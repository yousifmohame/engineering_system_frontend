import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { 
  DollarSign, Plus, Edit, Eye, Download, CheckCircle, Clock, 
  AlertTriangle, Search, Filter, Calendar, Users, Building, 
  Settings, Archive, RefreshCw, Printer, Target, TrendingUp,
  Shield, Calculator, Receipt, CreditCard, Wallet, FileText, 
  Globe, Home, Briefcase, UserCheck, Save, X, Trash2, Upload,
  Copy, BarChart3, PieChart, FileSpreadsheet, Link, Unlink,
  ArrowUpDown, ArrowUp, ArrowDown, Send, Mail, Bell, History,
  Repeat, CircleDollarSign, Banknote, Coins, TrendingDown, Zap
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UniversalTabsSidebar from '../UniversalTabsSidebar';

// أنواع البيانات
interface Salary {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'permanent' | 'freelancer' | 'followup';
  basicSalary: number;
  allowances: { housing: number; transport: number; other: number; };
  deductions: { gosi: number; tax: number; other: number; };
  netSalary: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'unpaid' | 'partial';
  paymentDate: string;
  period: string;
  currency: string;
  notes: string;
}

interface FreelancerTask {
  id: string;
  freelancerId: string;
  freelancerName: string;
  transactionId?: string;
  taskTitle: string;
  taskDescription: string;
  agreedAmount: number;
  completionPercentage: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  status: 'in-progress' | 'completed' | 'pending-review' | 'paid';
  currency: string;
}

interface FollowupFee {
  id: string;
  employeeId: string;
  employeeName: string;
  transactionId: string;
  transactionTitle: string;
  entity: string;
  feeAmount: number;
  expenses: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
  completionDate: string;
  paymentDate: string;
  notes: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'wps' | 'check' | 'transfer';
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  swiftCode?: string;
  isActive: boolean;
  usageCount: number;
  totalAmount: number;
}

interface Transaction {
  id: string;
  title: string;
  client: string;
  amount: number;
  linkedEmployees: string[];
  linkedFreelancers: string[];
  status: string;
  createdDate: string;
}

interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  generatedDate: string;
  generatedBy: string;
  format: string;
  size: string;
}

const SalariesFees_Complete_816: React.FC = () => {
  const [activeTab, setActiveTab] = useState('816-01');
  const [showAddSalaryDialog, setShowAddSalaryDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddFollowupDialog, setShowAddFollowupDialog] = useState(false);

  // بيانات وهمية للرواتب الدائمة
  const [permanentSalaries] = useState<Salary[]>([
    { id: 'SAL-P-2025-001', employeeId: 'EMP-001', employeeName: 'أحمد محمد العتيبي', department: 'الهندسة', type: 'permanent', basicSalary: 12000, allowances: { housing: 3000, transport: 800, other: 500 }, deductions: { gosi: 1170, tax: 0, other: 200 }, netSalary: 14930, paymentMethod: 'bank-transfer', status: 'paid', paymentDate: '2025-01-01', period: 'يناير 2025', currency: 'SAR', notes: '' },
    { id: 'SAL-P-2025-002', employeeId: 'EMP-002', employeeName: 'فاطمة سعد القحطاني', department: 'المحاسبة', type: 'permanent', basicSalary: 9000, allowances: { housing: 2500, transport: 600, other: 300 }, deductions: { gosi: 877.5, tax: 0, other: 150 }, netSalary: 11372.5, paymentMethod: 'wps', status: 'paid', paymentDate: '2025-01-01', period: 'يناير 2025', currency: 'SAR', notes: '' },
    { id: 'SAL-P-2025-003', employeeId: 'EMP-003', employeeName: 'خالد عبدالله الشمري', department: 'الإدارة', type: 'permanent', basicSalary: 15000, allowances: { housing: 4000, transport: 1000, other: 800 }, deductions: { gosi: 1462.5, tax: 0, other: 300 }, netSalary: 19037.5, paymentMethod: 'bank-transfer', status: 'pending', paymentDate: '', period: 'يناير 2025', currency: 'SAR', notes: 'ينتظر اعتماد المدير العام' },
    { id: 'SAL-P-2025-004', employeeId: 'EMP-004', employeeName: 'نورة عبدالرحمن السبيعي', department: 'الموارد البشرية', type: 'permanent', basicSalary: 8500, allowances: { housing: 2200, transport: 550, other: 250 }, deductions: { gosi: 828.75, tax: 0, other: 100 }, netSalary: 10571.25, paymentMethod: 'wps', status: 'paid', paymentDate: '2025-01-01', period: 'يناير 2025', currency: 'SAR', notes: '' },
    { id: 'SAL-P-2025-005', employeeId: 'EMP-005', employeeName: 'سعد محمد الغامدي', department: 'التسويق', type: 'permanent', basicSalary: 10000, allowances: { housing: 2800, transport: 700, other: 400 }, deductions: { gosi: 975, tax: 0, other: 150 }, netSalary: 12775, paymentMethod: 'bank-transfer', status: 'paid', paymentDate: '2025-01-01', period: 'يناير 2025', currency: 'SAR', notes: '' }
  ]);

  // بيانات وهمية لمهام الفريلانسرز
  const [freelancerTasks] = useState<FreelancerTask[]>([
    { id: 'TASK-F-2025-001', freelancerId: 'FREE-001', freelancerName: 'نورة محمد المطيري', transactionId: 'TRN-2025-1234', taskTitle: 'تصميم مخططات معمارية لفيلا سكنية', taskDescription: 'تصميم كامل لفيلا دورين بمساحة 400 متر مربع', agreedAmount: 8000, completionPercentage: 100, paidAmount: 8000, remainingAmount: 0, startDate: '2024-12-01', endDate: '2024-12-28', status: 'paid', currency: 'SAR' },
    { id: 'TASK-F-2025-002', freelancerId: 'FREE-002', freelancerName: 'محمد بن سلطان العنزي', transactionId: 'TRN-2025-1567', taskTitle: 'إعداد دراسة جدوى لمشروع تجاري', taskDescription: 'دراسة جدوى اقتصادية وفنية لمشروع مول تجاري', agreedAmount: 15000, completionPercentage: 60, paidAmount: 6000, remainingAmount: 9000, startDate: '2025-01-05', endDate: '2025-02-05', status: 'in-progress', currency: 'SAR' },
    { id: 'TASK-F-2025-003', freelancerId: 'FREE-003', freelancerName: 'سارة علي الدوسري', transactionId: 'TRN-2025-1890', taskTitle: 'مراجعة مخططات إنشائية', taskDescription: 'مراجعة وتدقيق المخططات الإنشائية لمبنى إداري', agreedAmount: 5000, completionPercentage: 100, paidAmount: 0, remainingAmount: 5000, startDate: '2025-01-10', endDate: '2025-01-17', status: 'completed', currency: 'SAR' },
    { id: 'TASK-F-2025-004', freelancerId: 'FREE-004', freelancerName: 'عبدالرحمن خالد الغامدي', transactionId: '', taskTitle: 'نمذجة ثلاثية الأبعاد لمشروع سكني', taskDescription: 'عمل نماذج 3D احترافية للمشروع السكني', agreedAmount: 12000, completionPercentage: 30, paidAmount: 0, remainingAmount: 12000, startDate: '2025-01-15', endDate: '2025-02-15', status: 'in-progress', currency: 'SAR' },
    { id: 'TASK-F-2025-005', freelancerId: 'FREE-005', freelancerName: 'ريم أحمد الزهراني', transactionId: 'TRN-2025-2101', taskTitle: 'إعداد مواصفات فنية', taskDescription: 'كتابة المواصفات الفنية لمشروع تطوير بنية تحتية', agreedAmount: 7500, completionPercentage: 80, paidAmount: 3000, remainingAmount: 4500, startDate: '2025-01-08', endDate: '2025-01-25', status: 'in-progress', currency: 'SAR' },
    { id: 'TASK-F-2025-006', freelancerId: 'FREE-006', freelancerName: 'يوسف عمر القرني', transactionId: 'TRN-2025-2234', taskTitle: 'حسابات إنشائية متقدمة', taskDescription: 'إعداد الحسابات الإنشائية للمبنى', agreedAmount: 9000, completionPercentage: 50, paidAmount: 4500, remainingAmount: 4500, startDate: '2025-01-12', endDate: '2025-02-10', status: 'in-progress', currency: 'SAR' }
  ]);

  // بيانات وهمية لأتعاب التعقيب
  const [followupFees] = useState<FollowupFee[]>([
    { id: 'FLW-2025-001', employeeId: 'EMP-004', employeeName: 'عبدالله أحمد الزهراني', transactionId: 'TRN-2025-2345', transactionTitle: 'معاملة إفراز أرض', entity: 'الأمانة', feeAmount: 2000, expenses: 300, totalAmount: 2300, paymentStatus: 'paid', completionDate: '2025-01-10', paymentDate: '2025-01-12', notes: 'تم الإنجاز بنجاح' },
    { id: 'FLW-2025-002', employeeId: 'EMP-005', employeeName: 'ريم محمد الحربي', transactionId: 'TRN-2025-2456', transactionTitle: 'معاملة رخصة بناء', entity: 'البلدية', feeAmount: 1800, expenses: 250, totalAmount: 2050, paymentStatus: 'pending', completionDate: '2025-01-15', paymentDate: '', notes: 'ينتظر الاعتماد' },
    { id: 'FLW-2025-003', employeeId: 'EMP-006', employeeName: 'يوسف عبدالعزيز القرني', transactionId: 'TRN-2025-2567', transactionTitle: 'معاملة فسح هندسي', entity: 'الدفاع المدني', feeAmount: 1500, expenses: 200, totalAmount: 1700, paymentStatus: 'unpaid', completionDate: '2025-01-18', paymentDate: '', notes: 'جاري المراجعة' },
    { id: 'FLW-2025-004', employeeId: 'EMP-007', employeeName: 'منى سعود القحطاني', transactionId: 'TRN-2025-2678', transactionTitle: 'معاملة شهادة إتمام', entity: 'البلدية', feeAmount: 2200, expenses: 350, totalAmount: 2550, paymentStatus: 'paid', completionDate: '2025-01-14', paymentDate: '2025-01-16', notes: 'معاملة مستعجلة' },
    { id: 'FLW-2025-005', employeeId: 'EMP-008', employeeName: 'صالح فهد الشهري', transactionId: 'TRN-2025-2789', transactionTitle: 'معاملة تعديل مخططات', entity: 'الأمانة', feeAmount: 1600, expenses: 220, totalAmount: 1820, paymentStatus: 'pending', completionDate: '2025-01-17', paymentDate: '', notes: 'في انتظار الدفع' }
  ]);

  // بيانات وسائل الدفع
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: 'PM-001', name: 'حساب بنك الراجحي الرئيسي', type: 'bank', accountNumber: '123456789012', bankName: 'مصرف الراجحي', iban: 'SA1234567890123456789012', swiftCode: 'RJHISARI', isActive: true, usageCount: 45, totalAmount: 345600 },
    { id: 'PM-002', name: 'نظام حماية الأجور WPS', type: 'wps', accountNumber: '987654321098', bankName: 'البنك الأهلي', iban: 'SA9876543210987654321098', swiftCode: 'NCBKSAJE', isActive: true, usageCount: 38, totalAmount: 287450 },
    { id: 'PM-003', name: 'صندوق النقدية', type: 'cash', isActive: true, usageCount: 12, totalAmount: 45800 },
    { id: 'PM-004', name: 'حساب البنك السعودي الفرنسي', type: 'bank', accountNumber: '456789012345', bankName: 'البنك السعودي الفرنسي', iban: 'SA4567890123456789012345', swiftCode: 'BSFRSARI', isActive: true, usageCount: 23, totalAmount: 156700 }
  ]);

  // بيانات المعاملات المرتبطة
  const [linkedTransactions] = useState<Transaction[]>([
    { id: 'TRN-2025-1234', title: 'معاملة تصميم فيلا سكنية - عميل الشمري', client: 'محمد الشمري', amount: 85000, linkedEmployees: ['EMP-001', 'EMP-003'], linkedFreelancers: ['FREE-001'], status: 'completed', createdDate: '2024-12-01' },
    { id: 'TRN-2025-1567', title: 'دراسة جدوى مول تجاري - شركة التطوير', client: 'شركة التطوير العقاري', amount: 150000, linkedEmployees: ['EMP-002'], linkedFreelancers: ['FREE-002'], status: 'in-progress', createdDate: '2025-01-05' },
    { id: 'TRN-2025-1890', title: 'مراجعة مخططات مبنى إداري', client: 'مؤسسة الأعمال', amount: 65000, linkedEmployees: ['EMP-001'], linkedFreelancers: ['FREE-003'], status: 'completed', createdDate: '2025-01-10' }
  ]);

  // بيانات التقارير
  const [reports] = useState<Report[]>([
    { id: 'REP-001', title: 'تقرير الرواتب الشهري - يناير 2025', type: 'monthly-salaries', period: 'يناير 2025', generatedDate: '2025-01-31', generatedBy: 'أحمد العتيبي', format: 'PDF', size: '2.4 MB' },
    { id: 'REP-002', title: 'تقرير الفريلانسرز - الربع الأول 2025', type: 'freelancers-quarterly', period: 'Q1 2025', generatedDate: '2025-01-28', generatedBy: 'فاطمة القحطاني', format: 'Excel', size: '1.8 MB' },
    { id: 'REP-003', title: 'تقرير أتعاب التعقيب - يناير 2025', type: 'followup-monthly', period: 'يناير 2025', generatedDate: '2025-01-30', generatedBy: 'خالد الشمري', format: 'PDF', size: '1.2 MB' }
  ]);

  const tabs = [
    { id: '816-01', label: 'لوحة التحكم', icon: DollarSign, color: 'bg-blue-500' },
    { id: '816-02', label: 'الرواتب الدائمة', icon: Calendar, color: 'bg-green-500' },
    { id: '816-03', label: 'الفريلانسرز بالقطعة', icon: Users, color: 'bg-purple-500' },
    { id: '816-04', label: 'أتعاب التعقيب', icon: FileText, color: 'bg-orange-500' },
    { id: '816-05', label: 'تقارير شاملة', icon: BarChart3, color: 'bg-cyan-500' },
    { id: '816-06', label: 'المعاملات المرتبطة', icon: Link, color: 'bg-pink-500' },
    { id: '816-07', label: 'وسائل الدفع', icon: CreditCard, color: 'bg-indigo-500' },
    { id: '816-08', label: 'تحويل العملات', icon: Globe, color: 'bg-teal-500' },
    { id: '816-09', label: 'الإعدادات', icon: Settings, color: 'bg-gray-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: <Badge className="bg-green-500 text-white text-xs px-2 py-0">مدفوع</Badge>,
      pending: <Badge className="bg-yellow-500 text-white text-xs px-2 py-0">قيد الانتظار</Badge>,
      unpaid: <Badge className="bg-red-500 text-white text-xs px-2 py-0">غير مدفوع</Badge>,
      partial: <Badge className="bg-orange-500 text-white text-xs px-2 py-0">دفعة جزئية</Badge>,
      'in-progress': <Badge className="bg-blue-500 text-white text-xs px-2 py-0">قيد التنفيذ</Badge>,
      completed: <Badge className="bg-green-500 text-white text-xs px-2 py-0">مكتمل</Badge>,
      'pending-review': <Badge className="bg-yellow-500 text-white text-xs px-2 py-0">ينتظر المراجعة</Badge>
    };
    return badges[status] || <Badge className="text-xs px-2 py-0">غير محدد</Badge>;
  };

  const calculateTotalSalaries = () => {
    const permanent = permanentSalaries.reduce((sum, s) => sum + s.netSalary, 0);
    const freelancer = freelancerTasks.reduce((sum, t) => sum + t.paidAmount, 0);
    const followup = followupFees.reduce((sum, f) => sum + (f.paymentStatus === 'paid' ? f.totalAmount : 0), 0);
    return { permanent, freelancer, followup, total: permanent + freelancer + followup };
  };

  const totals = calculateTotalSalaries();

  const renderTabContent = () => {
    switch (activeTab) {
      case '816-01':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة التحكم - الرواتب والأتعاب</h2>
                <p className="text-sm text-gray-600">نظرة شاملة على جميع الرواتب والأتعاب والمستحقات</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="button-rtl h-8"><Download className="h-3 w-3 ml-1" />تصدير</Button>
                <Button size="sm" className="button-rtl h-8"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي المدفوعات', value: totals.total.toLocaleString('ar-SA'), icon: DollarSign, bg: 'from-blue-50 to-blue-100', text: 'blue' },
                { label: 'رواتب دائمة', value: totals.permanent.toLocaleString('ar-SA'), icon: Calendar, bg: 'from-green-50 to-green-100', text: 'green' },
                { label: 'فريلانسرز', value: totals.freelancer.toLocaleString('ar-SA'), icon: Users, bg: 'from-purple-50 to-purple-100', text: 'purple' },
                { label: 'أتعاب تعقيب', value: totals.followup.toLocaleString('ar-SA'), icon: FileText, bg: 'from-orange-50 to-orange-100', text: 'orange' }
              ].map((stat, i) => (
                <Card key={i} className={`card-element card-rtl bg-gradient-to-br ${stat.bg} hover:shadow-md transition-all cursor-pointer`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.text}-500` })}
                      <Badge variant="outline" className={`text-${stat.text}-600 text-xs px-1.5 py-0`}>ر.س</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                    <p className={`text-xl text-${stat.text}-600`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع الرواتب حسب النوع</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { label: 'الرواتب الدائمة', value: totals.permanent, color: 'bg-green-500' },
                      { label: 'الفريلانسرز', value: totals.freelancer, color: 'bg-purple-500' },
                      { label: 'أتعاب التعقيب', value: totals.followup, color: 'bg-orange-500' }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{item.label}</span>
                          <span>{((item.value / totals.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(item.value / totals.total) * 100} className="h-1.5" />
                        <p className="text-xs text-gray-500 mt-0.5">{item.value.toLocaleString('ar-SA')} ر.س</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالات الدفع</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { label: 'مدفوع', count: permanentSalaries.filter(s => s.status === 'paid').length + freelancerTasks.filter(t => t.status === 'paid').length + followupFees.filter(f => f.paymentStatus === 'paid').length, icon: CheckCircle, color: 'green' },
                      { label: 'قيد الانتظار', count: permanentSalaries.filter(s => s.status === 'pending').length + freelancerTasks.filter(t => t.status === 'pending-review').length + followupFees.filter(f => f.paymentStatus === 'pending').length, icon: Clock, color: 'yellow' },
                      { label: 'غير مدفوع', count: permanentSalaries.filter(s => s.status === 'unpaid').length + freelancerTasks.filter(t => t.status === 'completed' && t.paidAmount === 0).length + followupFees.filter(f => f.paymentStatus === 'unpaid').length, icon: AlertTriangle, color: 'red' }
                    ].map((status, i) => (
                      <div key={i} className={`flex items-center justify-between p-2 bg-${status.color}-50 rounded hover:bg-${status.color}-100 transition-colors cursor-pointer`}>
                        <div className="flex items-center gap-2">
                          {React.createElement(status.icon, { className: `h-4 w-4 text-${status.color}-500` })}
                          <span className="text-sm">{status.label}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{status.count}</p>
                          <p className="text-xs text-gray-500">سجل</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر العمليات المالية</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ...permanentSalaries.slice(0, 2).map(s => ({ type: 'راتب دائم', name: s.employeeName, amount: s.netSalary, status: s.status, date: s.paymentDate || '-', icon: Calendar, color: 'green' })),
                    ...freelancerTasks.slice(0, 2).map(t => ({ type: 'مهمة فريلانس', name: t.freelancerName, amount: t.agreedAmount, status: t.status, date: t.endDate, icon: Users, color: 'purple' })),
                    ...followupFees.slice(0, 2).map(f => ({ type: 'أتعاب تعقيب', name: f.employeeName, amount: f.totalAmount, status: f.paymentStatus, date: f.completionDate, icon: FileText, color: 'orange' }))
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        {React.createElement(item.icon, { className: `h-4 w-4 text-${item.color}-500` })}
                        <div>
                          <p className="text-xs">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs">{item.amount.toLocaleString('ar-SA')} ر.س</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '816-02':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الرواتب الدائمة</h2>
                <p className="text-sm text-gray-600">رواتب الموظفين الدائمين الشهرية مع البدلات والاستقطاعات</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="button-rtl h-8" onClick={() => setShowAddSalaryDialog(true)}><Plus className="h-3 w-3 ml-1" />إضافة</Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'عدد الموظفين', value: permanentSalaries.length, icon: Users, color: 'blue' },
                { label: 'إجمالي الرواتب', value: totals.permanent.toLocaleString('ar-SA'), icon: DollarSign, color: 'green' },
                { label: 'مدفوع', value: permanentSalaries.filter(s => s.status === 'paid').length, icon: CheckCircle, color: 'teal' },
                { label: 'قيد الانتظار', value: permanentSalaries.filter(s => s.status === 'pending').length, icon: Clock, color: 'yellow' },
                { label: 'غير مدفوع', value: permanentSalaries.filter(s => s.status === 'unpaid').length, icon: AlertTriangle, color: 'red' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الرواتب الدائمة ({permanentSalaries.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input placeholder="بحث..." className="input-field w-48 h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Search className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم السجل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأساسي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>البدلات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستقطاعات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصافي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permanentSalaries.map((salary) => {
                        const totalAllowances = salary.allowances.housing + salary.allowances.transport + salary.allowances.other;
                        const totalDeductions = salary.deductions.gosi + salary.deductions.tax + salary.deductions.other;
                        return (
                          <TableRow key={salary.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                            <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{salary.id}</code>
                            </TableCell>
                            <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div>
                                <p className="text-xs">{salary.employeeName}</p>
                                <p className="text-xs text-gray-500">{salary.employeeId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{salary.department}</TableCell>
                            <TableCell className="text-right py-2"><span className="font-mono text-xs">{salary.basicSalary.toLocaleString('ar-SA')}</span></TableCell>
                            <TableCell className="text-right py-2">
                              <div className="text-xs">
                                <p className="font-mono">{totalAllowances.toLocaleString('ar-SA')}</p>
                                <p className="text-gray-500">({salary.allowances.housing}+{salary.allowances.transport}+{salary.allowances.other})</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <div className="text-xs">
                                <p className="font-mono text-red-600">{totalDeductions.toLocaleString('ar-SA')}</p>
                                <p className="text-gray-500">({salary.deductions.gosi}+{salary.deductions.tax}+{salary.deductions.other})</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2"><span className="font-mono text-xs text-green-600">{salary.netSalary.toLocaleString('ar-SA')}</span></TableCell>
                            <TableCell className="text-right py-2">{getStatusBadge(salary.status)}</TableCell>
                            <TableCell className="text-right py-2">
                              <div className="flex items-center gap-1 justify-end">
                                <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                                <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                                <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Printer className="h-3 w-3" /></Button>
                              </div>
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

      case '816-03':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الفريلانسرز والمهام بالقطعة</h2>
                <p className="text-sm text-gray-600">مهام الفريلانسرز المرتبطة بالمعاملات والمشاريع</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Link className="h-3 w-3 ml-1" />ربط بمعاملة</Button>
                <Button size="sm" className="button-rtl h-8" onClick={() => setShowAddTaskDialog(true)}><Plus className="h-3 w-3 ml-1" />إضافة مهمة</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي المهام', value: freelancerTasks.length, icon: Target, color: 'purple' },
                { label: 'المبلغ الإجمالي', value: freelancerTasks.reduce((sum, t) => sum + t.agreedAmount, 0).toLocaleString('ar-SA'), icon: DollarSign, color: 'green' },
                { label: 'المدفوع', value: freelancerTasks.reduce((sum, t) => sum + t.paidAmount, 0).toLocaleString('ar-SA'), icon: CheckCircle, color: 'teal' },
                { label: 'المتبقي', value: freelancerTasks.reduce((sum, t) => sum + t.remainingAmount, 0).toLocaleString('ar-SA'), icon: Clock, color: 'orange' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المهام النشطة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-[480px]">
                  <div className="space-y-2">
                    {freelancerTasks.map((task) => (
                      <Card key={task.id} className="card-element card-rtl bg-gradient-to-l from-purple-50 to-white hover:shadow-lg transition-all cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                                <Target className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.taskTitle}</h3>
                                <p className="text-xs text-gray-600 mb-1 line-clamp-1">{task.taskDescription}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-gray-500" />
                                    <span className="truncate">{task.freelancerName}</span>
                                  </div>
                                  {task.transactionId && (
                                    <div className="flex items-center gap-1">
                                      <Link className="h-3 w-3 text-blue-500" />
                                      <code className="text-xs bg-blue-100 px-1 py-0 rounded">{task.transactionId}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">{getStatusBadge(task.status)}</div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-600 mb-0.5">المتفق عليه</p>
                              <p className="text-sm text-blue-600">{task.agreedAmount.toLocaleString('ar-SA')} ر.س</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-600 mb-0.5">المدفوع</p>
                              <p className="text-sm text-green-600">{task.paidAmount.toLocaleString('ar-SA')} ر.س</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-600 mb-0.5">المتبقي</p>
                              <p className="text-sm text-orange-600">{task.remainingAmount.toLocaleString('ar-SA')} ر.س</p>
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-600">نسبة الإنجاز</span>
                              <span className="font-mono">{task.completionPercentage}%</span>
                            </div>
                            <Progress value={task.completionPercentage} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{task.startDate} - {task.endDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Eye className="h-3 w-3 ml-1" />عرض</Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2"><DollarSign className="h-3 w-3 ml-1" />دفع</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '816-04':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة أتعاب التعقيب</h2>
                <p className="text-sm text-gray-600">أتعاب متابعة المعاملات الحكومية والجهات الرسمية</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><FileSpreadsheet className="h-3 w-3 ml-1" />تصدير</Button>
                <Button size="sm" className="button-rtl h-8" onClick={() => setShowAddFollowupDialog(true)}><Plus className="h-3 w-3 ml-1" />إضافة</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي المعاملات', value: followupFees.length, icon: FileText, color: 'orange' },
                { label: 'إجمالي الأتعاب', value: followupFees.reduce((sum, f) => sum + f.totalAmount, 0).toLocaleString('ar-SA'), icon: DollarSign, color: 'green' },
                { label: 'المصروفات', value: followupFees.reduce((sum, f) => sum + f.expenses, 0).toLocaleString('ar-SA'), icon: Receipt, color: 'red' },
                { label: 'المدفوع', value: followupFees.filter(f => f.paymentStatus === 'paid').length, icon: CheckCircle, color: 'teal' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة أتعاب التعقيب ({followupFees.length})</CardTitle>
                  <Input placeholder="بحث..." className="input-field w-48 h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم السجل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصروفات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {followupFees.map((fee) => (
                        <TableRow key={fee.id} className="hover:bg-orange-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{fee.id}</code>
                          </TableCell>
                          <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div>
                              <p className="text-xs">{fee.employeeName}</p>
                              <p className="text-xs text-gray-500">{fee.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div>
                              <p className="text-xs">{fee.transactionTitle}</p>
                              <code className="text-xs bg-blue-100 px-1 py-0 rounded">{fee.transactionId}</code>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{fee.entity}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2"><span className="font-mono text-xs text-green-600">{fee.feeAmount.toLocaleString('ar-SA')}</span></TableCell>
                          <TableCell className="text-right py-2"><span className="font-mono text-xs text-red-600">{fee.expenses.toLocaleString('ar-SA')}</span></TableCell>
                          <TableCell className="text-right py-2"><span className="font-mono text-xs">{fee.totalAmount.toLocaleString('ar-SA')}</span></TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(fee.paymentStatus)}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                              {fee.paymentStatus !== 'paid' && (
                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-6 w-6 p-0"><CheckCircle className="h-3 w-3" /></Button>
                              )}
                            </div>
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

      case '816-05':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير المالية الشاملة</h2>
                <p className="text-sm text-gray-600">إنشاء وإدارة التقارير المالية لجميع أنواع الرواتب والأتعاب</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Upload className="h-3 w-3 ml-1" />استيراد</Button>
                <Button size="sm" className="button-rtl h-8"><Plus className="h-3 w-3 ml-1" />إنشاء تقرير</Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { title: 'تقرير الرواتب الشهري', desc: 'تقرير شامل للرواتب الدائمة', icon: Calendar, color: 'blue' },
                { title: 'تقرير الفريلانسرز', desc: 'تقرير مفصل لمهام الفريلانسرز', icon: Users, color: 'purple' },
                { title: 'تقرير أتعاب التعقيب', desc: 'تقرير المعاملات والأتعاب', icon: FileText, color: 'orange' }
              ].map((report, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 bg-${report.color}-100 rounded flex items-center justify-center`}>
                        {React.createElement(report.icon, { className: `h-4 w-4 text-${report.color}-600` })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.title}</h3>
                        <p className="text-xs text-gray-500">{report.desc}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full button-rtl h-7 text-xs"><Download className="h-3 w-3 ml-1" />إنشاء</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المدفوعات الشهرية</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { month: 'يناير', amount: 67850, percent: 85 },
                      { month: 'ديسمبر', amount: 62300, percent: 78 },
                      { month: 'نوفمبر', amount: 59450, percent: 74 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span>{item.month}</span>
                          <span className="font-mono">{item.amount.toLocaleString('ar-SA')} ر.س</span>
                        </div>
                        <Progress value={item.percent} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى المستحقات</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {permanentSalaries.sort((a, b) => b.netSalary - a.netSalary).slice(0, 3).map((salary, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">{i + 1}</div>
                          <span className="text-xs">{salary.employeeName}</span>
                        </div>
                        <span className="text-xs font-mono text-green-600">{salary.netSalary.toLocaleString('ar-SA')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>مقارنة سنوية</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {[
                      { year: '2025', amount: 845600, change: 12, direction: 'up' },
                      { year: '2024', amount: 754800, change: 8, direction: 'up' },
                      { year: '2023', amount: 698500, change: 0, direction: 'neutral' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs">{item.year}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono">{item.amount.toLocaleString('ar-SA')} ر.س</span>
                          <Badge className={`${item.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs px-1 py-0`}>
                            {item.direction === 'up' ? <ArrowUp className="h-3 w-3 ml-0.5" /> : <ArrowUpDown className="h-3 w-3 ml-0.5" />}
                            {item.change}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير المحفوظة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-[280px]">
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <Card key={report.id} className="card-element card-rtl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <CardContent className="p-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span>{report.generatedDate}</span>
                                  <span>•</span>
                                  <span>{report.generatedBy}</span>
                                  <Badge variant="outline" className="text-xs px-1 py-0">{report.format}</Badge>
                                  <span>{report.size}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '816-06':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات المرتبطة</h2>
                <p className="text-sm text-gray-600">عرض وإدارة المعاملات المرتبطة بالموظفين والفريلانسرز</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="button-rtl h-8"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="button-rtl h-8"><Link className="h-3 w-3 ml-1" />ربط معاملة</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي المعاملات', value: linkedTransactions.length, icon: Link, color: 'blue' },
                { label: 'القيمة الإجمالية', value: linkedTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('ar-SA'), icon: DollarSign, color: 'green' },
                { label: 'موظفين مرتبطين', value: new Set(linkedTransactions.flatMap(t => t.linkedEmployees)).size, icon: Users, color: 'purple' },
                { label: 'فريلانسرز مرتبطين', value: new Set(linkedTransactions.flatMap(t => t.linkedFreelancers)).size, icon: Target, color: 'orange' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المعاملات المرتبطة ({linkedTransactions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {linkedTransactions.map((transaction) => (
                    <Card key={transaction.id} className="card-element card-rtl bg-gradient-to-l from-blue-50 to-white hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{transaction.title}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <code className="bg-blue-100 px-1 py-0 rounded">{transaction.id}</code>
                                <span>•</span>
                                <span>{transaction.client}</span>
                                <span>•</span>
                                <span>{transaction.createdDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg text-green-600">{transaction.amount.toLocaleString('ar-SA')} ر.س</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <h4 className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفين ({transaction.linkedEmployees.length})</h4>
                            <div className="flex flex-wrap gap-1">
                              {transaction.linkedEmployees.map((empId) => {
                                const emp = permanentSalaries.find(s => s.employeeId === empId);
                                return <Badge key={empId} variant="outline" className="text-xs px-1.5 py-0">{emp?.employeeName || empId}</Badge>;
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفريلانسرز ({transaction.linkedFreelancers.length})</h4>
                            <div className="flex flex-wrap gap-1">
                              {transaction.linkedFreelancers.map((freelancerId) => {
                                const freelancer = freelancerTasks.find(f => f.freelancerId === freelancerId);
                                return <Badge key={freelancerId} variant="outline" className="text-xs px-1.5 py-0 bg-purple-50">{freelancer?.freelancerName || freelancerId}</Badge>;
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Eye className="h-3 w-3 ml-1" />عرض</Button>
                          <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Link className="h-3 w-3 ml-1" />إدارة</Button>
                          <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Unlink className="h-3 w-3 ml-1" />إلغاء</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '816-07':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة وسائل الدفع</h2>
                <p className="text-sm text-gray-600">إدارة الحسابات البنكية ووسائل الدفع المختلفة</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><Plus className="h-3 w-3 ml-1" />إضافة وسيلة دفع</Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي الوسائل', value: paymentMethods.length, icon: CreditCard, color: 'blue' },
                { label: 'النشطة', value: paymentMethods.filter(p => p.isActive).length, icon: CheckCircle, color: 'green' },
                { label: 'إجمالي المعاملات', value: paymentMethods.reduce((sum, p) => sum + p.usageCount, 0), icon: Repeat, color: 'purple' },
                { label: 'إجمالي المبالغ', value: paymentMethods.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString('ar-SA'), icon: DollarSign, color: 'orange' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                        <p className={`text-lg text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      {React.createElement(stat.icon, { className: `h-6 w-6 text-${stat.color}-500 opacity-50` })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        <div className={`w-8 h-8 ${method.isActive ? 'bg-green-100' : 'bg-gray-100'} rounded flex items-center justify-center flex-shrink-0`}>
                          {method.type === 'bank' && <CreditCard className={`h-4 w-4 ${method.isActive ? 'text-green-600' : 'text-gray-400'}`} />}
                          {method.type === 'wps' && <Shield className={`h-4 w-4 ${method.isActive ? 'text-green-600' : 'text-gray-400'}`} />}
                          {method.type === 'cash' && <Wallet className={`h-4 w-4 ${method.isActive ? 'text-green-600' : 'text-gray-400'}`} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{method.name}</h3>
                          <div className="flex items-center gap-1">
                            <Badge variant={method.isActive ? 'default' : 'secondary'} className="text-xs px-1.5 py-0">{method.isActive ? 'نشط' : 'غير نشط'}</Badge>
                            {method.type === 'bank' && <Badge variant="outline" className="text-xs px-1.5 py-0">بنكي</Badge>}
                            {method.type === 'wps' && <Badge variant="outline" className="text-xs px-1.5 py-0">WPS</Badge>}
                            {method.type === 'cash' && <Badge variant="outline" className="text-xs px-1.5 py-0">نقدي</Badge>}
                          </div>
                        </div>
                      </div>
                      <Switch checked={method.isActive} />
                    </div>

                    {method.type === 'bank' || method.type === 'wps' ? (
                      <div className="p-2 bg-gray-50 rounded mb-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><p className="text-xs text-gray-600">البنك</p><p>{method.bankName}</p></div>
                          <div><p className="text-xs text-gray-600">رقم الحساب</p><p className="font-mono text-xs">{method.accountNumber}</p></div>
                          <div><p className="text-xs text-gray-600">IBAN</p><p className="font-mono text-xs">{method.iban}</p></div>
                          <div><p className="text-xs text-gray-600">SWIFT</p><p className="font-mono text-xs">{method.swiftCode}</p></div>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div><p className="text-xs text-gray-600">الاستخدامات</p><p className="text-sm">{method.usageCount}</p></div>
                      <div><p className="text-xs text-gray-600">المبالغ</p><p className="text-sm text-green-600">{method.totalAmount.toLocaleString('ar-SA')} ر.س</p></div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Edit className="h-3 w-3 ml-1" />تعديل</Button>
                      <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Eye className="h-3 w-3 ml-1" />تفاصيل</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '816-08':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحويل العملات وأسعار الصرف</h2>
                <p className="text-sm text-gray-600">إدارة وتحديث أسعار الصرف للعملات المختلفة</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><RefreshCw className="h-3 w-3 ml-1" />تحديث الأسعار</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>حاسبة تحويل العملات</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="form-rtl">
                    <Label htmlFor="amount" className="text-xs">المبلغ</Label>
                    <Input id="amount" type="number" placeholder="10000" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  </div>
                  <div className="form-rtl">
                    <Label htmlFor="fromCurrency" className="text-xs">من عملة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                          <SelectItem value="USD">دولار</SelectItem>
                          <SelectItem value="EUR">يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label htmlFor="toCurrency" className="text-xs">إلى عملة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                          <SelectItem value="USD">دولار</SelectItem>
                          <SelectItem value="EUR">يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-blue-200 text-center">
                  <p className="text-xs text-gray-600 mb-1">النتيجة</p>
                  <p className="text-2xl text-blue-600">2,666.67 $</p>
                  <p className="text-xs text-gray-500 mt-1">سعر الصرف: 1 SAR = 0.2667 USD</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'دولار أمريكي', symbol: '$', rate: 3.75, change: 0.5, direction: 'up', color: 'green' },
                { name: 'يورو', symbol: '€', rate: 4.10, change: 1.2, direction: 'up', color: 'blue' },
                { name: 'ريال سعودي', symbol: 'ر.س', rate: 1.00, change: 0.0, direction: 'neutral', color: 'purple' }
              ].map((currency, i) => (
                <Card key={i} className={`card-element card-rtl bg-gradient-to-br from-${currency.color}-50 to-${currency.color}-100 hover:shadow-lg transition-all cursor-pointer`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 bg-${currency.color}-200 rounded-full flex items-center justify-center text-lg`}>{currency.symbol}</div>
                      <Badge className={`${currency.direction === 'up' ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs px-1.5 py-0`}>
                        {currency.direction === 'up' ? <ArrowUp className="h-3 w-3 ml-0.5" /> : <ArrowUpDown className="h-3 w-3 ml-0.5" />}
                        {currency.change}%
                      </Badge>
                    </div>
                    <h3 className="text-sm mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{currency.name}</h3>
                    <p className={`text-2xl text-${currency.color}-600 mb-1`}>{currency.rate}</p>
                    <p className="text-xs text-gray-600">1 USD = {currency.rate} SAR</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل تحديثات أسعار الصرف</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1.5">
                    {[
                      { date: '2025-01-19 14:30', currency: 'USD', oldRate: 3.74, newRate: 3.75, change: '+0.01' },
                      { date: '2025-01-19 10:15', currency: 'EUR', oldRate: 4.08, newRate: 4.10, change: '+0.02' },
                      { date: '2025-01-18 16:45', currency: 'USD', oldRate: 3.75, newRate: 3.74, change: '-0.01' },
                      { date: '2025-01-18 09:20', currency: 'EUR', oldRate: 4.10, newRate: 4.08, change: '-0.02' },
                      { date: '2025-01-17 13:00', currency: 'USD', oldRate: 3.74, newRate: 3.75, change: '+0.01' }
                    ].map((update, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs">{update.currency}</p>
                            <p className="text-xs text-gray-500">{update.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono">{update.oldRate} → {update.newRate}</p>
                          <p className={`text-xs ${update.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{update.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '816-09':
        return (
          <div className="space-y-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات النظام</h2>
                <p className="text-sm text-gray-600">تخصيص وضبط إعدادات نظام الرواتب والأتعاب</p>
              </div>
              <Button size="sm" className="button-rtl h-8"><Save className="h-3 w-3 ml-1" />حفظ الإعدادات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات العامة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-rtl">
                    <Label htmlFor="defaultCurrency" className="text-xs">العملة الافتراضية</Label>
                    <div className="select-rtl">
                      <Select defaultValue="SAR">
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                          <SelectItem value="USD">دولار</SelectItem>
                          <SelectItem value="EUR">يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label htmlFor="defaultPaymentMethod" className="text-xs">وسيلة الدفع الافتراضية</Label>
                    <div className="select-rtl">
                      <Select defaultValue="bank">
                        <SelectTrigger className="input-field select-trigger h-8 text-sm" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">تحويل بنكي</SelectItem>
                          <SelectItem value="wps">نظام WPS</SelectItem>
                          <SelectItem value="cash">نقدي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label htmlFor="gosiPercentage" className="text-xs">نسبة GOSI (%)</Label>
                    <Input id="gosiPercentage" type="number" defaultValue="9.75" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  </div>
                  <div className="form-rtl">
                    <Label htmlFor="paymentDay" className="text-xs">يوم الدفع الشهري</Label>
                    <Input id="paymentDay" type="number" defaultValue="1" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>خيارات الإشعارات</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { label: 'إشعار عند استحقاق راتب', desc: 'إرسال إشعار قبل 3 أيام من موعد الدفع', checked: true },
                    { label: 'إشعار عند إكمال مهمة فريلانسر', desc: 'إشعار تلقائي عند وصول نسبة الإنجاز 100%', checked: true },
                    { label: 'إشعار عند إضافة أتعاب تعقيب', desc: 'إشعار للموظف المعني بالمعاملة', checked: true },
                    { label: 'إشعار بريد إلكتروني', desc: 'إرسال نسخة من الإشعارات عبر البريد', checked: false }
                  ].map((option, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.desc}</p>
                      </div>
                      <Switch defaultChecked={option.checked} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التكامل</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { name: 'نظام حماية الأجور (WPS)', icon: Shield, color: 'blue', regNo: 'WPS-12345678', lastSync: '2025-01-19 10:30', active: true },
                    { name: 'التأمينات الاجتماعية (GOSI)', icon: Building, color: 'green', regNo: 'GOSI-87654321', lastSync: '2025-01-19 09:15', active: true },
                    { name: 'منصة قوى', icon: Users, color: 'purple', regNo: 'QIWA-12345678', lastSync: '2025-01-19 11:00', active: true }
                  ].map((system, i) => (
                    <div key={i} className="p-2 border border-gray-200 rounded hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 bg-${system.color}-100 rounded flex items-center justify-center`}>
                            {React.createElement(system.icon, { className: `h-4 w-4 text-${system.color}-600` })}
                          </div>
                          <div>
                            <h4 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{system.name}</h4>
                            <p className="text-xs text-gray-500">آخر مزامنة: {system.lastSync}</p>
                          </div>
                        </div>
                        <Switch defaultChecked={system.active} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="form-rtl">
                          <Label className="text-xs">رقم التسجيل</Label>
                          <Input placeholder={system.regNo} className="input-field h-7 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                        </div>
                        <div className="form-rtl">
                          <Label className="text-xs">آخر مزامنة</Label>
                          <Input value={system.lastSync} disabled className="input-field h-7 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', textAlign: 'right', direction: 'rtl' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات متقدمة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  {[
                    { label: 'المصادقة الثنائية للمدفوعات', desc: 'طلب موافقة مدير ثانٍ للمدفوعات الكبيرة', checked: true },
                    { label: 'الأرشفة التلقائية', desc: 'أرشفة السجلات الأقدم من سنة تلقائياً', checked: false },
                    { label: 'النسخ الاحتياطي التلقائي', desc: 'نسخ احتياطي يومي للبيانات المالية', checked: true }
                  ].map((option, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.desc}</p>
                      </div>
                      <Switch defaultChecked={option.checked} />
                    </div>
                  ))}
                </div>
                <div className="form-rtl mt-2">
                  <Label htmlFor="approvalLimit" className="text-xs">حد الموافقة التلقائية (ر.س)</Label>
                  <Input id="approvalLimit" type="number" defaultValue="5000" className="input-field h-8 text-sm" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                  <p className="text-xs text-gray-500 mt-0.5">المبالغ الأعلى من هذا الحد تحتاج موافقة إضافية</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التبويب {activeTab} قيد التطوير</h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>هذا التبويب سيحتوي على ميزات متقدمة قريباً</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex bg-gray-50 overflow-hidden" dir="rtl">
      <CodeDisplay code="SCR-816" position="top-right" />
      
      <UniversalTabsSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="flex-shrink-0" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الرواتب والأتعاب الشاملة</h1>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظام متكامل لإدارة الرواتب الدائمة والفريلانسرز وأتعاب التعقيب</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                <CheckCircle className="h-3 w-3 ml-1" />
                {totals.total.toLocaleString('ar-SA')} ر.س
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-1">
                <Users className="h-3 w-3 ml-1" />
                {permanentSalaries.length + freelancerTasks.length + followupFees.length} سجل
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SalariesFees_Complete_816;
