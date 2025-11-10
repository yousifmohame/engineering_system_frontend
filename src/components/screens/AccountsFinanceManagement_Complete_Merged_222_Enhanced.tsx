/**
 * الشاشة 222 - إدارة المحاسبة والمالية والتقارير (محسّنة ومطوّرة v3.0)
 * ===========================================================================
 * 
 * شاشة موحدة شاملة تجمع بين:
 * 1. إدارة المحاسبة والمالية (14 تاب)
 * 2. التقارير المالية التفصيلية (18 تاب)
 * 
 * المجموع: 32 تاب مطور بالكامل
 * 
 * المميزات:
 * - السايد بار الرأسي المُكثف للتابات
 * - استغلال 95%+ من المساحة المتاحة
 * - نظام الترقيم الموحد 222-XX
 * - دعم RTL كامل مع خط Tajawal
 * - بطاقات تفاعلية ونوافذ منبثقة شاملة
 * - حقول إدخال محسّنة وفق Guidelines v4.0
 * - رسوم بيانية ومؤشرات أداء متقدمة
 * - تصدير وطباعة متقدمة
 * - نماذج شاملة مع validation
 * - تطبيق كامل لنظام الألوان الموحد
 * 
 * @version 3.0 - Enhanced with Guidelines v4.0
 * @date 2025-10-16
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  Calculator, DollarSign, CreditCard, Receipt, FileText, TrendingUp,
  PieChart, BarChart3, Banknote, Building2, TrendingDown, Search,
  Filter, Plus, Edit, Eye, Key, CheckCircle,
  Building, BookOpen, Target, ShoppingCart, Printer,
  Send, Save, X, Calendar, Download, RefreshCw, LineChart,
  Users, Wallet, FileCheck, AlertCircle, Clock, Activity,
  ArrowUpRight, ArrowDownRight, Percent,
  FileBarChart, Upload, Trash2,
  CheckSquare, XCircle, AlertTriangle, Info, Settings,
  FileSpreadsheet, Mail, Share2, Layers, Zap, Shield, Award
} from 'lucide-react';

// ===== واجهات البيانات =====

interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'أصول' | 'خصوم' | 'حقوق الملكية' | 'إيرادات' | 'مصروفات';
  parentAccount?: string;
  balance: number;
  currency: 'ريال سعودي' | 'دولار أمريكي' | 'يورو';
  status: 'نشط' | 'معلق' | 'مغلق';
  description: string;
  createdDate: string;
  lastTransaction: string;
  level: number;
  isParent: boolean;
}

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  type: 'قيد يدوي' | 'قيد تلقائي' | 'قيد تسوية' | 'قيد إقفال';
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'مسودة' | 'معتمد' | 'مرحّل' | 'ملغي';
  createdBy: string;
  approvedBy?: string;
  reference?: string;
  lines: JournalLine[];
}

interface JournalLine {
  id: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

interface Payment {
  id: string;
  paymentNumber: string;
  type: 'دفعة صادرة' | 'تحصيل وارد' | 'تحويل داخلي';
  amount: number;
  currency: string;
  date: string;
  dueDate?: string;
  status: 'مكتملة' | 'معلقة' | 'ملغاة';
  method: 'نقدي' | 'شيك' | 'تحويل بنكي' | 'بطاقة';
  description: string;
  beneficiary?: string;
  payer?: string;
  accountFrom: string;
  accountTo: string;
  reference: string;
  approvedBy?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'فاتورة مبيعات' | 'فاتورة مشتريات' | 'فاتورة خدمات';
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: 'مسودة' | 'مرسلة' | 'دفع جزئي' | 'مدفوعة' | 'متأخرة' | 'ملغاة';
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  paymentTerms: string;
  description: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountType: 'حساب جاري' | 'حساب توفير' | 'وديعة';
  currency: string;
  balance: number;
  status: 'نشط' | 'معلق' | 'مغلق';
  iban: string;
  swiftCode: string;
  branch: string;
}

interface BankTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: 'إيداع' | 'سحب' | 'تحويل';
  amount: number;
  balance: number;
  description: string;
  reference: string;
}

interface OpeningBalance {
  id: string;
  accountNumber: string;
  accountName: string;
  debitBalance: number;
  creditBalance: number;
  fiscalYear: string;
  createdBy: string;
  createdDate: string;
}

interface Receivable {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  agingDays: number;
  status: 'جديد' | 'متأخر' | 'مستحق قريباً' | 'مسدد';
}

interface Payable {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  agingDays: number;
  status: 'جديد' | 'متأخر' | 'مستحق قريباً' | 'مسدد';
}

interface AccruedExpense {
  id: string;
  expenseType: string;
  description: string;
  amount: number;
  period: string;
  status: 'مستحق' | 'مسجل' | 'مسدد';
  dueDate: string;
}

interface AccruedRevenue {
  id: string;
  revenueType: string;
  description: string;
  amount: number;
  period: string;
  status: 'مستحق' | 'مسجل' | 'محصّل';
  expectedDate: string;
}

interface BudgetItem {
  id: string;
  category: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  period: string;
  department: string;
}

interface FinancialRatio {
  id: string;
  ratioName: string;
  category: string;
  currentValue: number;
  previousValue: number;
  change: number;
  benchmark: number;
  status: 'ممتاز' | 'جيد' | 'مقبول' | 'ضعيف';
}

interface CashFlow {
  id: string;
  activity: string;
  type: 'تشغيلية' | 'استثمارية' | 'تمويلية';
  amount: number;
  period: string;
  description: string;
}

interface IncomeStatement {
  id: string;
  category: string;
  type: 'إيراد' | 'مصروف' | 'صافي';
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
}

interface BalanceSheet {
  id: string;
  category: string;
  type: 'أصول' | 'التزامات' | 'حقوق ملكية';
  subType: string;
  currentAmount: number;
  previousAmount: number;
  change: number;
}

interface ProfitLossReport {
  id: string;
  category: string;
  type: 'إيراد' | 'مصروف';
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
  percentage: number;
}

interface ExpenseAnalysis {
  id: string;
  category: string;
  department: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
  trend: 'صاعد' | 'نازل' | 'ثابت';
}

interface RevenueAnalysis {
  id: string;
  source: string;
  category: string;
  amount: number;
  percentage: number;
  target: number;
  achievement: number;
  growth: number;
}

interface FinancialRatioDetailed {
  id: string;
  ratioName: string;
  category: string;
  formula: string;
  currentValue: number;
  industryAverage: number;
  interpretation: string;
  status: 'ممتاز' | 'جيد' | 'مقبول' | 'ضعيف';
}

interface HorizontalAnalysis {
  id: string;
  item: string;
  year2023: number;
  year2024: number;
  year2025: number;
  change2024: number;
  change2025: number;
  changePercent2024: number;
  changePercent2025: number;
}

interface VerticalAnalysis {
  id: string;
  item: string;
  type: 'أصول' | 'التزامات' | 'إيرادات' | 'مصروفات';
  amount: number;
  percentageOfTotal: number;
  percentageOfBase: number;
}

interface BudgetComparison {
  id: string;
  item: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  ytdBudget: number;
  ytdActual: number;
  ytdVariance: number;
}

interface InternalAudit {
  id: string;
  auditArea: string;
  finding: string;
  risk: 'عالي' | 'متوسط' | 'منخفض';
  status: 'مفتوح' | 'قيد المعالجة' | 'مغلق';
  priority: 'عاجل' | 'مهم' | 'عادي';
  recommendation: string;
  responsiblePerson: string;
  dueDate: string;
}

interface StandardCost {
  id: string;
  costCenter: string;
  item: string;
  standardCost: number;
  actualCost: number;
  variance: number;
  variancePercent: number;
  varianceType: 'مناسب' | 'غير مناسب';
  quantity: number;
}

interface BreakEvenAnalysis {
  id: string;
  product: string;
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  contributionMargin: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  currentSales: number;
  safetyMargin: number;
}

interface ProfitabilityAnalysis {
  id: string;
  item: string;
  category: string;
  revenue: number;
  directCosts: number;
  indirectCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
}

interface FinancialKPI {
  id: string;
  kpiName: string;
  category: string;
  currentValue: number;
  targetValue: number;
  previousValue: number;
  unit: string;
  trend: 'صاعد' | 'هابط' | 'ثابت';
  status: 'ممتاز' | 'جيد' | 'مقبول' | 'ضعيف';
  achievement: number;
}

interface FinancialForecast {
  id: string;
  period: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  cashFlow: number;
  confidence: number;
  scenario: 'متفائل' | 'واقعي' | 'متحفظ';
}

interface FinancialRisk {
  id: string;
  riskName: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  level: 'حرج' | 'عالي' | 'متوسط' | 'منخفض';
  mitigation: string;
  status: 'نشط' | 'قيد المراقبة' | 'محلول';
}

interface ExecutiveDashboardMetric {
  id: string;
  metric: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  target: number;
  icon: string;
  color: string;
}

// ===== التابات الموحدة (32 تاب) =====
const TABS_CONFIG: TabConfig[] = [
  // القسم الأول: المحاسبة والمالية (14 تاب)
  { id: '222-01', number: '222-01', title: 'شجرة الحسابات', icon: BookOpen },
  { id: '222-02', number: '222-02', title: 'القيود اليومية', icon: FileText },
  { id: '222-03', number: '222-03', title: 'الدفعات والتحصيلات', icon: DollarSign },
  { id: '222-04', number: '222-04', title: 'الفواتير', icon: Receipt },
  { id: '222-05', number: '222-05', title: 'البنوك والخزينة', icon: Building2 },
  { id: '222-06', number: '222-06', title: 'الأرصدة الافتتاحية', icon: Key },
  { id: '222-07', number: '222-07', title: 'التسويات المحاسبية', icon: Calculator },
  { id: '222-08', number: '222-08', title: 'الحسابات المدينة', icon: CreditCard },
  { id: '222-09', number: '222-09', title: 'الحسابات الدائنة', icon: Wallet },
  { id: '222-10', number: '222-10', title: 'المصروفات المستحقة', icon: TrendingDown },
  { id: '222-11', number: '222-11', title: 'الإيرادات المستحقة', icon: TrendingUp },
  { id: '222-12', number: '222-12', title: 'الموازنة التخطيطية', icon: Target },
  { id: '222-13', number: '222-13', title: 'تحليل التكاليف', icon: PieChart },
  { id: '222-14', number: '222-14', title: 'السنة المالية', icon: Calendar },
  
  // القسم الثاني: التقارير المالية (18 تاب)
  { id: '222-15', number: '222-15', title: 'قائمة المركز المالي', icon: FileBarChart },
  { id: '222-16', number: '222-16', title: 'قائمة الدخل', icon: TrendingUp },
  { id: '222-17', number: '222-17', title: 'قائمة التدفقات النقدية', icon: Activity },
  { id: '222-18', number: '222-18', title: 'ميزان المراجعة', icon: Calculator },
  { id: '222-19', number: '222-19', title: 'كشف الحساب', icon: FileText },
  { id: '222-20', number: '222-20', title: 'تقرير الأرباح والخسائر', icon: BarChart3 },
  { id: '222-21', number: '222-21', title: 'تقرير الموازنة', icon: Target },
  { id: '222-22', number: '222-22', title: 'تحليل المبيعات', icon: TrendingUp },
  { id: '222-23', number: '222-23', title: 'تحليل المشتريات', icon: ShoppingCart },
  { id: '222-24', number: '222-24', title: 'تقرير أعمار الديون', icon: Clock },
  { id: '222-25', number: '222-25', title: 'تقرير الضرائب', icon: Percent },
  { id: '222-26', number: '222-26', title: 'تقرير الربحية', icon: DollarSign },
  { id: '222-27', number: '222-27', title: 'تقارير المراكز والأقسام', icon: Building },
  { id: '222-28', number: '222-28', title: 'التحليل المالي المتقدم', icon: LineChart },
  { id: '222-29', number: '222-29', title: 'تقرير التدفق النقدي المتوقع', icon: Activity },
  { id: '222-30', number: '222-30', title: 'مؤشرات الأداء المالي', icon: Target },
  { id: '222-31', number: '222-31', title: 'التقارير المخصصة', icon: FileCheck },
  { id: '222-32', number: '222-32', title: 'تصدير وطباعة التقارير', icon: Printer },
];

export default function AccountsFinanceManagement_Complete_Merged_222_Enhanced() {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('222-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [showDialog, setShowDialog] = useState(false);
  const [showCreateAccountDialog, setShowCreateAccountDialog] = useState(false);
  const [showCreateJournalDialog, setShowCreateJournalDialog] = useState(false);

  // بيانات تجريبية - الحسابات
  const sampleAccounts: Account[] = useMemo(() => [
    {
      id: '1',
      accountNumber: '1000',
      accountName: 'النقدية في الصندوق',
      accountType: 'أصول',
      balance: 50000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'النقدية المتوفرة في صندوق المكتب الرئيسي',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-16',
      level: 1,
      isParent: false
    },
    {
      id: '2',
      accountNumber: '1100',
      accountName: 'البنك الأهلي السعودي - الحساب الجاري',
      accountType: 'أصول',
      balance: 850000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'الحساب الجاري الرئيسي للشركة',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-15',
      level: 1,
      isParent: false
    },
    {
      id: '3',
      accountNumber: '1200',
      accountName: 'العملاء - حسابات مدينة',
      accountType: 'أصول',
      balance: 320000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'مستحقات العملاء من أتعاب ومشاريع',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-14',
      level: 1,
      isParent: true
    },
    {
      id: '4',
      accountNumber: '1300',
      accountName: 'المخزون',
      accountType: 'أصول',
      balance: 180000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'مخزون المواد والأدوات الهندسية',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-13',
      level: 1,
      isParent: false
    },
    {
      id: '5',
      accountNumber: '1400',
      accountName: 'الأصول الثابتة',
      accountType: 'أصول',
      balance: 2500000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'المباني والمعدات والسيارات',
      createdDate: '2025-01-01',
      lastTransaction: '2025-09-30',
      level: 1,
      isParent: true
    },
    {
      id: '6',
      accountNumber: '2000',
      accountName: 'الموردين - حسابات دائنة',
      accountType: 'خصوم',
      balance: 150000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'مستحقات للموردين والمقاولين',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-12',
      level: 1,
      isParent: false
    },
    {
      id: '7',
      accountNumber: '2100',
      accountName: 'قروض بنكية قصيرة الأجل',
      accountType: 'خصوم',
      balance: 500000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'القروض البنكية المستحقة خلال سنة',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-01',
      level: 1,
      isParent: false
    },
    {
      id: '8',
      accountNumber: '3000',
      accountName: 'رأس المال',
      accountType: 'حقوق الملكية',
      balance: 5000000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'رأس المال المدفوع',
      createdDate: '2025-01-01',
      lastTransaction: '2025-01-01',
      level: 1,
      isParent: false
    },
    {
      id: '9',
      accountNumber: '4000',
      accountName: 'إيرادات الأتعاب الهندسية',
      accountType: 'إيرادات',
      balance: 1200000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'أتعاب الخدمات الهندسية المقدمة',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-16',
      level: 1,
      isParent: false
    },
    {
      id: '10',
      accountNumber: '5000',
      accountName: 'الرواتب والأجور',
      accountType: 'مصروفات',
      balance: 450000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'رواتب وأجور الموظفين',
      createdDate: '2025-01-01',
      lastTransaction: '2025-10-01',
      level: 1,
      isParent: false
    },
  ], []);

  // بيانات تجريبية - القيود اليومية
  const sampleJournalEntries: JournalEntry[] = useMemo(() => [
    {
      id: 'JE001',
      entryNumber: 'JE-2025-001',
      date: '2025-10-16',
      type: 'قيد يدوي',
      description: 'قيد إثبات استلام أتعاب مشروع الفيلا السكنية',
      totalDebit: 150000,
      totalCredit: 150000,
      status: 'معتمد',
      createdBy: 'أحمد محمد',
      approvedBy: 'مدير الحسابات',
      reference: 'PRJ-2025-045',
      lines: [
        { id: '1', accountNumber: '1100', accountName: 'البنك الأهلي', debit: 150000, credit: 0, description: 'استلام دفعة نقدية' },
        { id: '2', accountNumber: '4000', accountName: 'إيرادات الأتعاب', debit: 0, credit: 150000, description: 'أتعاب مشروع فيلا' },
      ]
    },
    {
      id: 'JE002',
      entryNumber: 'JE-2025-002',
      date: '2025-10-15',
      type: 'قيد يدوي',
      description: 'قيد إثبات صرف رواتب شهر أكتوبر 2025',
      totalDebit: 80000,
      totalCredit: 80000,
      status: 'مرحّل',
      createdBy: 'سارة أحمد',
      approvedBy: 'المدير المالي',
      reference: 'SAL-OCT-2025',
      lines: [
        { id: '1', accountNumber: '5000', accountName: 'الرواتب والأجور', debit: 80000, credit: 0, description: 'رواتب أكتوبر 2025' },
        { id: '2', accountNumber: '1100', accountName: 'البنك الأهلي', debit: 0, credit: 80000, description: 'سداد رواتب بنكياً' },
      ]
    },
    {
      id: 'JE003',
      entryNumber: 'JE-2025-003',
      date: '2025-10-14',
      type: 'قيد تسوية',
      description: 'قيد تسوية مصروفات الكهرباء والماء للمكتب',
      totalDebit: 5000,
      totalCredit: 5000,
      status: 'معتمد',
      createdBy: 'محمد علي',
      approvedBy: 'مدير الحسابات',
      lines: [
        { id: '1', accountNumber: '5100', accountName: 'مصروفات المرافق', debit: 5000, credit: 0, description: 'فواتير كهرباء وماء' },
        { id: '2', accountNumber: '2000', accountName: 'الموردين', debit: 0, credit: 5000, description: 'مستحقات فواتير' },
      ]
    },
    {
      id: 'JE004',
      entryNumber: 'JE-2025-004',
      date: '2025-10-13',
      type: 'قيد يدوي',
      description: 'قيد شراء معدات مكتبية وأجهزة حاسوب',
      totalDebit: 35000,
      totalCredit: 35000,
      status: 'معتمد',
      createdBy: 'خالد إبراهيم',
      approvedBy: 'مدير الحسابات',
      lines: [
        { id: '1', accountNumber: '1400', accountName: 'الأصول الثابتة', debit: 35000, credit: 0, description: 'شراء معدات' },
        { id: '2', accountNumber: '1100', accountName: 'البنك الأهلي', debit: 0, credit: 35000, description: 'دفع نقدي' },
      ]
    },
    {
      id: 'JE005',
      entryNumber: 'JE-2025-005',
      date: '2025-10-12',
      type: 'قيد تلقائي',
      description: 'قيد آلي لإثبات إيرادات الاستشارات الهندسية',
      totalDebit: 45000,
      totalCredit: 45000,
      status: 'مرحّل',
      createdBy: 'النظام',
      approvedBy: 'النظام',
      reference: 'AUTO-001',
      lines: [
        { id: '1', accountNumber: '1200', accountName: 'العملاء', debit: 45000, credit: 0, description: 'أتعاب استشارات' },
        { id: '2', accountNumber: '4000', accountName: 'إيرادات الأتعاب', debit: 0, credit: 45000, description: 'إيرادات استشارات' },
      ]
    },
    {
      id: 'JE006',
      entryNumber: 'JE-2025-006',
      date: '2025-10-11',
      type: 'قيد يدوي',
      description: 'قيد إثبات مصروفات صيانة السيارات',
      totalDebit: 8500,
      totalCredit: 8500,
      status: 'مسودة',
      createdBy: 'فاطمة حسن',
      lines: [
        { id: '1', accountNumber: '5200', accountName: 'مصروفات الصيانة', debit: 8500, credit: 0, description: 'صيانة سيارات' },
        { id: '2', accountNumber: '1000', accountName: 'الصندوق', debit: 0, credit: 8500, description: 'دفع نقدي' },
      ]
    },
    {
      id: 'JE007',
      entryNumber: 'JE-2025-007',
      date: '2025-10-10',
      type: 'قيد تسوية',
      description: 'قيد تسوية استهلاك الأصول الثابتة للشهر',
      totalDebit: 12000,
      totalCredit: 12000,
      status: 'معتمد',
      createdBy: 'محمد علي',
      approvedBy: 'المدير المالي',
      lines: [
        { id: '1', accountNumber: '5300', accountName: 'مصروف الاستهلاك', debit: 12000, credit: 0, description: 'استهلاك شهري' },
        { id: '2', accountNumber: '1410', accountName: 'مجمع الاستهلاك', debit: 0, credit: 12000, description: 'استهلاك متراكم' },
      ]
    },
    {
      id: 'JE008',
      entryNumber: 'JE-2025-008',
      date: '2025-10-09',
      type: 'قيد يدوي',
      description: 'قيد إثبات إيجار المكتب لشهر أكتوبر',
      totalDebit: 30000,
      totalCredit: 30000,
      status: 'مرحّل',
      createdBy: 'نورة عبدالله',
      approvedBy: 'مدير الحسابات',
      lines: [
        { id: '1', accountNumber: '5400', accountName: 'مصروف الإيجار', debit: 30000, credit: 0, description: 'إيجار شهر 10' },
        { id: '2', accountNumber: '1100', accountName: 'البنك الأهلي', debit: 0, credit: 30000, description: 'سداد بنكي' },
      ]
    },
  ], []);

  // بيانات تجريبية - الدفعات
  const samplePayments: Payment[] = useMemo(() => [
    {
      id: 'PAY001',
      paymentNumber: 'PAY-2025-001',
      type: 'تحصيل وارد',
      amount: 150000,
      currency: 'ريال سعودي',
      date: '2025-10-16',
      status: 'مكتملة',
      method: 'تحويل بنكي',
      description: 'تحصيل دفعة مشروع الفيلا السكنية - الدفعة الأولى',
      beneficiary: 'المهندس محمد السعيد',
      accountFrom: 'العملاء',
      accountTo: 'البنك الأهلي',
      reference: 'TRF-20251016-001',
      approvedBy: 'المدير المالي'
    },
    {
      id: 'PAY002',
      paymentNumber: 'PAY-2025-002',
      type: 'دفعة صادرة',
      amount: 80000,
      currency: 'ريال سعودي',
      date: '2025-10-15',
      status: 'مكتملة',
      method: 'تحويل بنكي',
      description: 'صرف رواتب شهر أكتوبر 2025 للموظفين',
      beneficiary: 'الموظفين',
      accountFrom: 'البنك الأهلي',
      accountTo: 'حسابات الموظفين',
      reference: 'SAL-OCT-2025',
      approvedBy: 'المدير العام'
    },
    {
      id: 'PAY003',
      paymentNumber: 'PAY-2025-003',
      type: 'دفعة صادرة',
      amount: 25000,
      currency: 'ريال سعودي',
      date: '2025-10-14',
      dueDate: '2025-10-20',
      status: 'معلقة',
      method: 'شيك',
      description: 'سداد مستحقات مقاول أعمال الخرسانة',
      beneficiary: 'مؤسسة البناء المتطور للمقاولات',
      accountFrom: 'البنك الأهلي',
      accountTo: 'الموردين',
      reference: 'CHQ-1234',
    },
    {
      id: 'PAY004',
      paymentNumber: 'PAY-2025-004',
      type: 'تحصيل وارد',
      amount: 250000,
      currency: 'ريال سعودي',
      date: '2025-10-13',
      status: 'مكتملة',
      method: 'تحويل بنكي',
      description: 'تحصيل دفعة مشروع العمارة التجارية',
      beneficiary: 'شركة العقارات المتحدة',
      accountFrom: 'العملاء',
      accountTo: 'البنك الأهلي',
      reference: 'TRF-20251013-002',
      approvedBy: 'المدير المالي'
    },
    {
      id: 'PAY005',
      paymentNumber: 'PAY-2025-005',
      type: 'دفعة صادرة',
      amount: 15000,
      currency: 'ريال سعودي',
      date: '2025-10-12',
      status: 'مكتملة',
      method: 'نقدي',
      description: 'صرف مصروفات تشغيلية متنوعة',
      beneficiary: 'صندوق المصروفات النثرية',
      accountFrom: 'البنك الأهلي',
      accountTo: 'الصندوق',
      reference: 'CASH-001',
      approvedBy: 'مدير العمليات'
    },
    {
      id: 'PAY006',
      paymentNumber: 'PAY-2025-006',
      type: 'تحويل داخلي',
      amount: 50000,
      currency: 'ريال سعودي',
      date: '2025-10-11',
      status: 'مكتملة',
      method: 'تحويل بنكي',
      description: 'تحويل من الحساب الجاري إلى حساب التوفير',
      accountFrom: 'البنك الأهلي - حساب جاري',
      accountTo: 'البنك الأهلي - حساب توفير',
      reference: 'INT-TRF-001',
      approvedBy: 'المدير المالي'
    },
    {
      id: 'PAY007',
      paymentNumber: 'PAY-2025-007',
      type: 'دفعة صادرة',
      amount: 30000,
      currency: 'ريال سعودي',
      date: '2025-10-10',
      status: 'مكتملة',
      method: 'بطاقة',
      description: 'شراء رخص برمجيات ومعدات تقنية',
      beneficiary: 'شركة التقنية المتقدمة',
      accountFrom: 'البنك الأهلي',
      accountTo: 'الموردين',
      reference: 'CARD-001',
      approvedBy: 'مدير تقنية المعلومات'
    },
    {
      id: 'PAY008',
      paymentNumber: 'PAY-2025-008',
      type: 'تحصيل وارد',
      amount: 95000,
      currency: 'ريال سعودي',
      date: '2025-10-09',
      status: 'مكتملة',
      method: 'شيك',
      description: 'تحصيل دفعة جزئية من مشروع الفيلا',
      beneficiary: 'م. عبدالله الشمري',
      payer: 'م. عبدالله الشمري',
      accountFrom: 'العملاء',
      accountTo: 'البنك الأهلي',
      reference: 'CHQ-5678',
      approvedBy: 'مدير الحسابات'
    },
  ], []);

  // بيانات تجريبية - الفواتير
  const sampleInvoices: Invoice[] = useMemo(() => [
    {
      id: 'INV001',
      invoiceNumber: 'INV-2025-001',
      type: 'فاتورة مبيعات',
      clientId: 'CLI-001',
      clientName: 'المهندس محمد السعيد',
      date: '2025-10-01',
      dueDate: '2025-10-31',
      status: 'مدفوعة',
      subtotal: 130434.78,
      vatAmount: 19565.22,
      totalAmount: 150000,
      paidAmount: 150000,
      remainingAmount: 0,
      currency: 'ريال سعودي',
      paymentTerms: '30 يوم من تاريخ الإصدار',
      description: 'أتعاب تصميم فيلا سكنية - حي النرجس',
      items: [
        { id: '1', description: 'التصميم المعماري الشامل', quantity: 1, unitPrice: 80000, vatRate: 15, total: 92000 },
        { id: '2', description: 'التصميم الإنشائي والحسابات', quantity: 1, unitPrice: 50000, vatRate: 15, total: 57500 },
      ]
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2025-002',
      type: 'فاتورة مبيعات',
      clientId: 'CLI-002',
      clientName: 'شركة العقارات المتحدة',
      date: '2025-10-05',
      dueDate: '2025-11-05',
      status: 'مرسلة',
      subtotal: 217391.30,
      vatAmount: 32608.70,
      totalAmount: 250000,
      paidAmount: 0,
      remainingAmount: 250000,
      currency: 'ريال سعودي',
      paymentTerms: '30 يوم من تاريخ الإصدار',
      description: 'أتعاب تصميم عمارة سكنية تجارية',
      items: [
        { id: '1', description: 'التصميم المعماري الشامل', quantity: 1, unitPrice: 150000, vatRate: 15, total: 172500 },
        { id: '2', description: 'التصميم الإنشائي الكامل', quantity: 1, unitPrice: 70000, vatRate: 15, total: 80500 },
      ]
    },
  ], []);

  // بيانات تجريبية - الحسابات البنكية
  const sampleBankAccounts: BankAccount[] = useMemo(() => [
    {
      id: 'BA001',
      accountNumber: '1234567890',
      bankName: 'البنك الأهلي السعودي',
      accountType: 'حساب جاري',
      currency: 'ريال سعودي',
      balance: 850000,
      status: 'نشط',
      iban: 'SA1234567890123456789012',
      swiftCode: 'NCBKSARI',
      branch: 'الفرع الرئيسي - الرياض'
    },
    {
      id: 'BA002',
      accountNumber: '9876543210',
      bankName: 'مصرف الراجحي',
      accountType: 'حساب توفير',
      currency: 'ريال سعودي',
      balance: 320000,
      status: 'نشط',
      iban: 'SA9876543210987654321098',
      swiftCode: 'RJHISARI',
      branch: 'فرع العليا - الرياض'
    },
    {
      id: 'BA003',
      accountNumber: '5555666677',
      bankName: 'البنك السعودي للاستثمار',
      accountType: 'وديعة',
      currency: 'ريال سعودي',
      balance: 500000,
      status: 'نشط',
      iban: 'SA5555666677445566778899',
      swiftCode: 'SIBCSARI',
      branch: 'فرع الملك فهد - الرياض'
    },
  ], []);

  // بيانات تجريبية - الحركات البنكية
  const sampleBankTransactions: BankTransaction[] = useMemo(() => [
    {
      id: 'BT001',
      transactionNumber: 'TRX-2025-001',
      date: '2025-10-16',
      type: 'إيداع',
      amount: 150000,
      balance: 850000,
      description: 'تحصيل أتعاب مشروع فيلا',
      reference: 'DEP-001'
    },
    {
      id: 'BT002',
      transactionNumber: 'TRX-2025-002',
      date: '2025-10-15',
      type: 'سحب',
      amount: 80000,
      balance: 700000,
      description: 'صرف رواتب الموظفين',
      reference: 'WDR-001'
    },
    {
      id: 'BT003',
      transactionNumber: 'TRX-2025-003',
      date: '2025-10-14',
      type: 'تحويل',
      amount: 50000,
      balance: 780000,
      description: 'تحويل لحساب التوفير',
      reference: 'TRF-001'
    },
  ], []);

  // بيانات تجريبية - الأرصدة الافتتاحية
  const sampleOpeningBalances: OpeningBalance[] = useMemo(() => [
    {
      id: 'OB001',
      accountNumber: '1000',
      accountName: 'النقدية في الصندوق',
      debitBalance: 50000,
      creditBalance: 0,
      fiscalYear: '2025',
      createdBy: 'أحمد محمد',
      createdDate: '2025-01-01'
    },
    {
      id: 'OB002',
      accountNumber: '1100',
      accountName: 'البنك الأهلي - الحساب الجاري',
      debitBalance: 800000,
      creditBalance: 0,
      fiscalYear: '2025',
      createdBy: 'أحمد محمد',
      createdDate: '2025-01-01'
    },
    {
      id: 'OB003',
      accountNumber: '2000',
      accountName: 'الموردين - حسابات دائنة',
      debitBalance: 0,
      creditBalance: 120000,
      fiscalYear: '2025',
      createdBy: 'أحمد محمد',
      createdDate: '2025-01-01'
    },
    {
      id: 'OB004',
      accountNumber: '3000',
      accountName: 'رأس المال',
      debitBalance: 0,
      creditBalance: 5000000,
      fiscalYear: '2025',
      createdBy: 'أحمد محمد',
      createdDate: '2025-01-01'
    },
  ], []);

  // بيانات تجريبية - الحسابات المدينة
  const sampleReceivables: Receivable[] = useMemo(() => [
    {
      id: 'REC001',
      clientId: 'CLI-001',
      clientName: 'المهندس محمد السعيد',
      invoiceNumber: 'INV-2025-001',
      totalAmount: 150000,
      paidAmount: 150000,
      remainingAmount: 0,
      dueDate: '2025-10-31',
      agingDays: 0,
      status: 'مسدد'
    },
    {
      id: 'REC002',
      clientId: 'CLI-002',
      clientName: 'شركة العقارات المتحدة',
      invoiceNumber: 'INV-2025-002',
      totalAmount: 250000,
      paidAmount: 0,
      remainingAmount: 250000,
      dueDate: '2025-11-05',
      agingDays: 15,
      status: 'مستحق قريباً'
    },
    {
      id: 'REC003',
      clientId: 'CLI-003',
      clientName: 'م. عبدالله الشمري',
      invoiceNumber: 'INV-2025-003',
      totalAmount: 180000,
      paidAmount: 90000,
      remainingAmount: 90000,
      dueDate: '2025-10-20',
      agingDays: -1,
      status: 'متأخر'
    },
    {
      id: 'REC004',
      clientId: 'CLI-004',
      clientName: 'شركة التطوير العمراني',
      invoiceNumber: 'INV-2025-004',
      totalAmount: 320000,
      paidAmount: 160000,
      remainingAmount: 160000,
      dueDate: '2025-11-15',
      agingDays: 25,
      status: 'مستحق قريباً'
    },
  ], []);

  // بيانات تجريبية - الحسابات الدائنة
  const samplePayables: Payable[] = useMemo(() => [
    {
      id: 'PAY001',
      vendorId: 'VEN-001',
      vendorName: 'مؤسسة البناء المتطور للمقاولات',
      invoiceNumber: 'VINV-2025-001',
      totalAmount: 75000,
      paidAmount: 50000,
      remainingAmount: 25000,
      dueDate: '2025-10-25',
      agingDays: 6,
      status: 'مستحق قريباً'
    },
    {
      id: 'PAY002',
      vendorId: 'VEN-002',
      vendorName: 'شركة التقنية المتقدمة',
      invoiceNumber: 'VINV-2025-002',
      totalAmount: 30000,
      paidAmount: 30000,
      remainingAmount: 0,
      dueDate: '2025-10-10',
      agingDays: 0,
      status: 'مسدد'
    },
    {
      id: 'PAY003',
      vendorId: 'VEN-003',
      vendorName: 'مورد المواد الهندسية',
      invoiceNumber: 'VINV-2025-003',
      totalAmount: 45000,
      paidAmount: 0,
      remainingAmount: 45000,
      dueDate: '2025-10-18',
      agingDays: -1,
      status: 'متأخر'
    },
  ], []);

  // بيانات تجريبية - المصروفات المستحقة
  const sampleAccruedExpenses: AccruedExpense[] = useMemo(() => [
    {
      id: 'AE001',
      expenseType: 'رواتب وأجور',
      description: 'رواتب الموظفين عن شهر أكتوبر 2025',
      amount: 80000,
      period: 'أكتوبر 2025',
      status: 'مستحق',
      dueDate: '2025-10-31'
    },
    {
      id: 'AE002',
      expenseType: 'إيجارات',
      description: 'إيجار المكتب الرئيسي',
      amount: 30000,
      period: 'أكتوبر 2025',
      status: 'مسجل',
      dueDate: '2025-10-31'
    },
    {
      id: 'AE003',
      expenseType: 'مرافق',
      description: 'فواتير الكهرباء والماء',
      amount: 5000,
      period: 'أكتوبر 2025',
      status: 'مستحق',
      dueDate: '2025-10-28'
    },
    {
      id: 'AE004',
      expenseType: 'تأمينات',
      description: 'تأمينات اجتماعية للموظفين',
      amount: 12000,
      period: 'أكتوبر 2025',
      status: 'مسدد',
      dueDate: '2025-10-31'
    },
  ], []);

  // بيانات تجريبية - الإيرادات المستحقة
  const sampleAccruedRevenues: AccruedRevenue[] = useMemo(() => [
    {
      id: 'AR001',
      revenueType: 'أتعاب هندسية',
      description: 'أتعاب مشروع العمارة التجارية - المرحلة الثانية',
      amount: 120000,
      period: 'أكتوبر 2025',
      status: 'مستحق',
      expectedDate: '2025-10-30'
    },
    {
      id: 'AR002',
      revenueType: 'استشارات',
      description: 'استشارات فنية لمشروع الفيلا',
      amount: 25000,
      period: 'أكتوبر 2025',
      status: 'مسجل',
      expectedDate: '2025-10-28'
    },
    {
      id: 'AR003',
      revenueType: 'إشراف',
      description: 'إشراف على تنفيذ مشاريع متعددة',
      amount: 45000,
      period: 'أكتوبر 2025',
      status: 'محصّل',
      expectedDate: '2025-10-25'
    },
  ], []);

  // بيانات تجريبية - الموازنة التخطيطية
  const sampleBudget: BudgetItem[] = useMemo(() => [
    {
      id: 'BDG001',
      category: 'الرواتب والأجور',
      budgetedAmount: 900000,
      actualAmount: 800000,
      variance: -100000,
      variancePercent: -11.1,
      period: '2025',
      department: 'الموارد البشرية'
    },
    {
      id: 'BDG002',
      category: 'الإيجارات',
      budgetedAmount: 360000,
      actualAmount: 300000,
      variance: -60000,
      variancePercent: -16.7,
      period: '2025',
      department: 'العمليات'
    },
    {
      id: 'BDG003',
      category: 'التسويق والإعلان',
      budgetedAmount: 150000,
      actualAmount: 180000,
      variance: 30000,
      variancePercent: 20,
      period: '2025',
      department: 'التسويق'
    },
    {
      id: 'BDG004',
      category: 'المعدات والتجهيزات',
      budgetedAmount: 200000,
      actualAmount: 150000,
      variance: -50000,
      variancePercent: -25,
      period: '2025',
      department: 'تقنية المعلومات'
    },
    {
      id: 'BDG005',
      category: 'الإيرادات المتوقعة',
      budgetedAmount: 1500000,
      actualAmount: 1200000,
      variance: -300000,
      variancePercent: -20,
      period: '2025',
      department: 'المبيعات'
    },
  ], []);

  // بيانات تجريبية - النسب والمؤشرات المالية
  const sampleFinancialRatios: FinancialRatio[] = useMemo(() => [
    {
      id: 'FR001',
      ratioName: 'نسبة السيولة السريعة',
      category: 'نسب السيولة',
      currentValue: 1.85,
      previousValue: 1.60,
      change: 0.25,
      benchmark: 1.50,
      status: 'ممتاز'
    },
    {
      id: 'FR002',
      ratioName: 'نسبة التداول',
      category: 'نسب السيولة',
      currentValue: 2.30,
      previousValue: 2.10,
      change: 0.20,
      benchmark: 2.00,
      status: 'ممتاز'
    },
    {
      id: 'FR003',
      ratioName: 'نسبة الدين إلى حقوق الملكية',
      category: 'نسب المديونية',
      currentValue: 0.45,
      previousValue: 0.55,
      change: -0.10,
      benchmark: 0.50,
      status: 'جيد'
    },
    {
      id: 'FR004',
      ratioName: 'هامش الربح الإجمالي',
      category: 'نسب الربحية',
      currentValue: 0.42,
      previousValue: 0.38,
      change: 0.04,
      benchmark: 0.35,
      status: 'ممتاز'
    },
    {
      id: 'FR005',
      ratioName: 'العائد على الأصول (ROA)',
      category: 'نسب الربحية',
      currentValue: 0.15,
      previousValue: 0.12,
      change: 0.03,
      benchmark: 0.10,
      status: 'ممتاز'
    },
    {
      id: 'FR006',
      ratioName: 'العائد على حقوق الملكية (ROE)',
      category: 'نسب الربحية',
      currentValue: 0.22,
      previousValue: 0.18,
      change: 0.04,
      benchmark: 0.15,
      status: 'ممتاز'
    },
  ], []);

  // بيانات تجريبية - التدفقات النقدية
  const sampleCashFlows: CashFlow[] = useMemo(() => [
    {
      id: 'CF001',
      activity: 'صافي الربح',
      type: 'تشغيلية',
      amount: 450000,
      period: 'Q3 2025',
      description: 'صافي الربح من العمليات التشغيلية'
    },
    {
      id: 'CF002',
      activity: 'الاستهلاك والإطفاء',
      type: 'تشغيلية',
      amount: 85000,
      period: 'Q3 2025',
      description: 'إضافة الاستهلاك والإطفاء'
    },
    {
      id: 'CF003',
      activity: 'التغير في المدينين',
      type: 'تشغيلية',
      amount: -120000,
      period: 'Q3 2025',
      description: 'زيادة في الحسابات المدينة'
    },
    {
      id: 'CF004',
      activity: 'شراء معدات وأصول',
      type: 'استثمارية',
      amount: -250000,
      period: 'Q3 2025',
      description: 'استثمار في معدات جديدة'
    },
    {
      id: 'CF005',
      activity: 'سداد قروض',
      type: 'تمويلية',
      amount: -100000,
      period: 'Q3 2025',
      description: 'سداد جزء من القروض طويلة الأجل'
    },
    {
      id: 'CF006',
      activity: 'توزيعات أرباح',
      type: 'تمويلية',
      amount: -50000,
      period: 'Q3 2025',
      description: 'توزيع أرباح على الشركاء'
    },
  ], []);

  // بيانات تجريبية - قائمة الدخل
  const sampleIncomeStatement: IncomeStatement[] = useMemo(() => [
    {
      id: 'IS001',
      category: 'إيرادات المبيعات',
      type: 'إيراد',
      currentPeriod: 1850000,
      previousPeriod: 1500000,
      change: 350000,
      changePercent: 23.3
    },
    {
      id: 'IS002',
      category: 'إيرادات الخدمات',
      type: 'إيراد',
      currentPeriod: 650000,
      previousPeriod: 550000,
      change: 100000,
      changePercent: 18.2
    },
    {
      id: 'IS003',
      category: 'تكلفة المبيعات',
      type: 'مصروف',
      currentPeriod: 1050000,
      previousPeriod: 900000,
      change: 150000,
      changePercent: 16.7
    },
    {
      id: 'IS004',
      category: 'مصروفات إدارية',
      type: 'مصروف',
      currentPeriod: 450000,
      previousPeriod: 400000,
      change: 50000,
      changePercent: 12.5
    },
    {
      id: 'IS005',
      category: 'مصروفات تسويقية',
      type: 'مصروف',
      currentPeriod: 180000,
      previousPeriod: 150000,
      change: 30000,
      changePercent: 20.0
    },
    {
      id: 'IS006',
      category: 'صافي الربح',
      type: 'صافي',
      currentPeriod: 820000,
      previousPeriod: 600000,
      change: 220000,
      changePercent: 36.7
    },
  ], []);

  // بيانات تجريبية - قائمة المركز المالي (الميزانية)
  const sampleBalanceSheet: BalanceSheet[] = useMemo(() => [
    {
      id: 'BS001',
      category: 'النقدية وما في حكمها',
      type: 'أصول',
      subType: 'أصول متداولة',
      currentAmount: 850000,
      previousAmount: 700000,
      change: 150000
    },
    {
      id: 'BS002',
      category: 'الحسابات المدينة',
      type: 'أصول',
      subType: 'أصول متداولة',
      currentAmount: 500000,
      previousAmount: 380000,
      change: 120000
    },
    {
      id: 'BS003',
      category: 'المخزون',
      type: 'أصول',
      subType: 'أصول متداولة',
      currentAmount: 320000,
      previousAmount: 280000,
      change: 40000
    },
    {
      id: 'BS004',
      category: 'الأصول الثابتة',
      type: 'أصول',
      subType: 'أصول غير متداولة',
      currentAmount: 2250000,
      previousAmount: 2100000,
      change: 150000
    },
    {
      id: 'BS005',
      category: 'حسابات دائنة',
      type: 'التزامات',
      subType: 'التزامات متداولة',
      currentAmount: 380000,
      previousAmount: 320000,
      change: 60000
    },
    {
      id: 'BS006',
      category: 'قروض قصيرة الأجل',
      type: 'التزامات',
      subType: 'التزامات متداولة',
      currentAmount: 250000,
      previousAmount: 300000,
      change: -50000
    },
    {
      id: 'BS007',
      category: 'قروض طويلة الأجل',
      type: 'التزامات',
      subType: 'التزامات غير متداولة',
      currentAmount: 800000,
      previousAmount: 900000,
      change: -100000
    },
    {
      id: 'BS008',
      category: 'رأس المال',
      type: 'حقوق ملكية',
      subType: 'حقوق ملكية',
      currentAmount: 2000000,
      previousAmount: 2000000,
      change: 0
    },
    {
      id: 'BS009',
      category: 'الأرباح المحتجزة',
      type: 'حقوق ملكية',
      subType: 'حقوق ملكية',
      currentAmount: 490000,
      previousAmount: 340000,
      change: 150000
    },
  ], []);

  // بيانات تجريبية - تقرير الأرباح والخسائر
  const sampleProfitLossReport: ProfitLossReport[] = useMemo(() => [
    {
      id: 'PL001',
      category: 'إيرادات المبيعات',
      type: 'إيراد',
      q1: 450000,
      q2: 480000,
      q3: 500000,
      q4: 420000,
      total: 1850000,
      percentage: 74.0
    },
    {
      id: 'PL002',
      category: 'إيرادات الخدمات',
      type: 'إيراد',
      q1: 150000,
      q2: 160000,
      q3: 180000,
      q4: 160000,
      total: 650000,
      percentage: 26.0
    },
    {
      id: 'PL003',
      category: 'تكلفة المبيعات',
      type: 'مصروف',
      q1: 250000,
      q2: 260000,
      q3: 280000,
      q4: 260000,
      total: 1050000,
      percentage: 42.0
    },
    {
      id: 'PL004',
      category: 'مصروفات إدارية',
      type: 'مصروف',
      q1: 110000,
      q2: 112000,
      q3: 115000,
      q4: 113000,
      total: 450000,
      percentage: 18.0
    },
    {
      id: 'PL005',
      category: 'مصروفات تسويقية',
      type: 'مصروف',
      q1: 42000,
      q2: 45000,
      q3: 48000,
      q4: 45000,
      total: 180000,
      percentage: 7.2
    },
    {
      id: 'PL006',
      category: 'مصروفات تشغيلية أخرى',
      type: 'مصروف',
      q1: 48000,
      q2: 50000,
      q3: 52000,
      q4: 50000,
      total: 200000,
      percentage: 8.0
    },
  ], []);

  // بيانات تجريبية - تحليل المصروفات
  const sampleExpenseAnalysis: ExpenseAnalysis[] = useMemo(() => [
    {
      id: 'EA001',
      category: 'الرواتب والأجور',
      department: 'الموارد البشرية',
      amount: 800000,
      percentage: 42.1,
      budget: 900000,
      variance: -100000,
      trend: 'نازل'
    },
    {
      id: 'EA002',
      category: 'الإيجارات',
      department: 'الإدارة العامة',
      amount: 360000,
      percentage: 18.9,
      budget: 350000,
      variance: 10000,
      trend: 'صاعد'
    },
    {
      id: 'EA003',
      category: 'المرافق والخدمات',
      department: 'الصيانة',
      amount: 180000,
      percentage: 9.5,
      budget: 200000,
      variance: -20000,
      trend: 'نازل'
    },
    {
      id: 'EA004',
      category: 'التسويق والإعلان',
      department: 'التسويق',
      amount: 180000,
      percentage: 9.5,
      budget: 180000,
      variance: 0,
      trend: 'ثابت'
    },
    {
      id: 'EA005',
      category: 'المواد والمستلزمات',
      department: 'العمليات',
      amount: 220000,
      percentage: 11.6,
      budget: 250000,
      variance: -30000,
      trend: 'نازل'
    },
    {
      id: 'EA006',
      category: 'الصيانة والتشغيل',
      department: 'الصيانة',
      amount: 160000,
      percentage: 8.4,
      budget: 150000,
      variance: 10000,
      trend: 'صاعد'
    },
  ], []);

  // بيانات تجريبية - تحليل الإيرادات
  const sampleRevenueAnalysis: RevenueAnalysis[] = useMemo(() => [
    {
      id: 'RA001',
      source: 'أتعاب هندسية',
      category: 'خدمات استشارية',
      amount: 1200000,
      percentage: 48.0,
      target: 1100000,
      achievement: 109.1,
      growth: 15.4
    },
    {
      id: 'RA002',
      source: 'خدمات إشراف',
      category: 'خدمات إشرافية',
      amount: 650000,
      percentage: 26.0,
      target: 700000,
      achievement: 92.9,
      growth: 8.3
    },
    {
      id: 'RA003',
      source: 'استشارات فنية',
      category: 'خدمات استشارية',
      amount: 400000,
      percentage: 16.0,
      target: 380000,
      achievement: 105.3,
      growth: 12.0
    },
    {
      id: 'RA004',
      source: 'تصميمات معمارية',
      category: 'خدمات تصميم',
      amount: 150000,
      percentage: 6.0,
      target: 150000,
      achievement: 100.0,
      growth: 5.0
    },
    {
      id: 'RA005',
      source: 'دراسات جدوى',
      category: 'خدمات استشارية',
      amount: 100000,
      percentage: 4.0,
      target: 120000,
      achievement: 83.3,
      growth: -5.0
    },
  ], []);

  // بيانات تجريبية - النسب المالية التفصيلية
  const sampleFinancialRatioDetailed: FinancialRatioDetailed[] = useMemo(() => [
    {
      id: 'FRD001',
      ratioName: 'نسبة التداول (Current Ratio)',
      category: 'نسب السيولة',
      formula: 'الأصول المتداولة ÷ الالتزامات المتداولة',
      currentValue: 2.65,
      industryAverage: 2.00,
      interpretation: 'قدرة عالية على سداد الالتزامات قصيرة الأجل',
      status: 'ممتاز'
    },
    {
      id: 'FRD002',
      ratioName: 'نسبة السيولة السريعة (Quick Ratio)',
      category: 'نسب السيولة',
      formula: '(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة',
      currentValue: 1.85,
      industryAverage: 1.50,
      interpretation: 'قدرة جيدة جداً على الوفاء بالالتزامات الفورية',
      status: 'ممتاز'
    },
    {
      id: 'FRD003',
      ratioName: 'هامش الربح الإجمالي (Gross Profit Margin)',
      category: 'نسب الربحية',
      formula: '(الإيرادات - تكلفة المبيعات) ÷ الإيرادات × 100',
      currentValue: 42.0,
      industryAverage: 35.0,
      interpretation: 'أداء قوي في تحقيق الربح من المبيعات',
      status: 'ممتاز'
    },
    {
      id: 'FRD004',
      ratioName: 'هامش الربح الصافي (Net Profit Margin)',
      category: 'نسب الربحية',
      formula: 'صافي الربح ÷ الإيرادات × 100',
      currentValue: 32.8,
      industryAverage: 25.0,
      interpretation: 'كفاءة عالية في إدارة التكاليف والمصروفات',
      status: 'ممتاز'
    },
    {
      id: 'FRD005',
      ratioName: 'العائد على الأصول (ROA)',
      category: 'نسب الربحية',
      formula: 'صافي الربح ÷ إجمالي الأصول × 100',
      currentValue: 20.9,
      industryAverage: 15.0,
      interpretation: 'استخدام فعال للأصول في تحقيق الأرباح',
      status: 'ممتاز'
    },
    {
      id: 'FRD006',
      ratioName: 'العائد على حقوق الملكية (ROE)',
      category: 'نسب الربحية',
      formula: 'صافي الربح ÷ حقوق الملكية × 100',
      currentValue: 32.9,
      industryAverage: 20.0,
      interpretation: 'عائد ممتاز للمساهمين على استثماراتهم',
      status: 'ممتاز'
    },
    {
      id: 'FRD007',
      ratioName: 'نسبة الدين إلى حقوق الملكية',
      category: 'نسب المديونية',
      formula: 'إجمالي الالتزامات ÷ حقوق الملكية × 100',
      currentValue: 57.4,
      industryAverage: 75.0,
      interpretation: 'مستوى ديون معتدل ومقبول',
      status: 'جيد'
    },
    {
      id: 'FRD008',
      ratioName: 'معدل دوران الأصول',
      category: 'نسب النشاط',
      formula: 'المبيعات ÷ إجمالي الأصول',
      currentValue: 0.64,
      industryAverage: 0.50,
      interpretation: 'كفاءة جيدة في استخدام الأصول لتوليد المبيعات',
      status: 'جيد'
    },
  ], []);

  // بيانات تجريبية - التحليل الأفقي
  const sampleHorizontalAnalysis: HorizontalAnalysis[] = useMemo(() => [
    {
      id: 'HA001',
      item: 'إجمالي الإيرادات',
      year2023: 2050000,
      year2024: 2300000,
      year2025: 2500000,
      change2024: 250000,
      change2025: 200000,
      changePercent2024: 12.2,
      changePercent2025: 8.7
    },
    {
      id: 'HA002',
      item: 'تكلفة المبيعات',
      year2023: 900000,
      year2024: 980000,
      year2025: 1050000,
      change2024: 80000,
      change2025: 70000,
      changePercent2024: 8.9,
      changePercent2025: 7.1
    },
    {
      id: 'HA003',
      item: 'مصروفات إدارية',
      year2023: 380000,
      year2024: 420000,
      year2025: 450000,
      change2024: 40000,
      change2025: 30000,
      changePercent2024: 10.5,
      changePercent2025: 7.1
    },
    {
      id: 'HA004',
      item: 'صافي الربح',
      year2023: 650000,
      year2024: 750000,
      year2025: 820000,
      change2024: 100000,
      change2025: 70000,
      changePercent2024: 15.4,
      changePercent2025: 9.3
    },
    {
      id: 'HA005',
      item: 'إجمالي الأصول',
      year2023: 3500000,
      year2024: 3700000,
      year2025: 3920000,
      change2024: 200000,
      change2025: 220000,
      changePercent2024: 5.7,
      changePercent2025: 5.9
    },
    {
      id: 'HA006',
      item: 'حقوق الملكية',
      year2023: 2100000,
      year2024: 2340000,
      year2025: 2490000,
      change2024: 240000,
      change2025: 150000,
      changePercent2024: 11.4,
      changePercent2025: 6.4
    },
  ], []);

  // بيانات تجريبية - التحليل الرأسي
  const sampleVerticalAnalysis: VerticalAnalysis[] = useMemo(() => [
    {
      id: 'VA001',
      item: 'النقدية والأرصدة البنكية',
      type: 'أصول',
      amount: 850000,
      percentageOfTotal: 21.7,
      percentageOfBase: 50.9
    },
    {
      id: 'VA002',
      item: 'الحسابات المدينة',
      type: 'أصول',
      amount: 500000,
      percentageOfTotal: 12.8,
      percentageOfBase: 29.9
    },
    {
      id: 'VA003',
      item: 'المخزون',
      type: 'أصول',
      amount: 320000,
      percentageOfTotal: 8.2,
      percentageOfBase: 19.2
    },
    {
      id: 'VA004',
      item: 'الأصول الثابتة',
      type: 'أصول',
      amount: 2250000,
      percentageOfTotal: 57.3,
      percentageOfBase: 100.0
    },
    {
      id: 'VA005',
      item: 'إيرادات المبيعات',
      type: 'إيرادات',
      amount: 1850000,
      percentageOfTotal: 74.0,
      percentageOfBase: 100.0
    },
    {
      id: 'VA006',
      item: 'إيرادات الخدمات',
      type: 'إيرادات',
      amount: 650000,
      percentageOfTotal: 26.0,
      percentageOfBase: 35.1
    },
    {
      id: 'VA007',
      item: 'تكلفة المبيعات',
      type: 'مصروفات',
      amount: 1050000,
      percentageOfTotal: 56.8,
      percentageOfBase: 100.0
    },
    {
      id: 'VA008',
      item: 'مصروفات إدارية',
      type: 'مصروفات',
      amount: 450000,
      percentageOfTotal: 24.3,
      percentageOfBase: 42.9
    },
  ], []);

  // بيانات تجريبية - الموازنة المقارنة
  const sampleBudgetComparison: BudgetComparison[] = useMemo(() => [
    {
      id: 'BC001',
      item: 'إيرادات المبيعات',
      category: 'الإيرادات',
      budgeted: 1800000,
      actual: 1850000,
      variance: 50000,
      variancePercent: 2.8,
      ytdBudget: 5400000,
      ytdActual: 5550000,
      ytdVariance: 150000
    },
    {
      id: 'BC002',
      item: 'إيرادات الخدمات',
      category: 'الإيرادات',
      budgeted: 600000,
      actual: 650000,
      variance: 50000,
      variancePercent: 8.3,
      ytdBudget: 1800000,
      ytdActual: 1950000,
      ytdVariance: 150000
    },
    {
      id: 'BC003',
      item: 'الرواتب والأجور',
      category: 'المصروفات',
      budgeted: 900000,
      actual: 800000,
      variance: -100000,
      variancePercent: -11.1,
      ytdBudget: 2700000,
      ytdActual: 2400000,
      ytdVariance: -300000
    },
    {
      id: 'BC004',
      item: 'الإيجارات',
      category: 'المصروفات',
      budgeted: 350000,
      actual: 360000,
      variance: 10000,
      variancePercent: 2.9,
      ytdBudget: 1050000,
      ytdActual: 1080000,
      ytdVariance: 30000
    },
    {
      id: 'BC005',
      item: 'المرافق والخدمات',
      category: 'المصروفات',
      budgeted: 200000,
      actual: 180000,
      variance: -20000,
      variancePercent: -10.0,
      ytdBudget: 600000,
      ytdActual: 540000,
      ytdVariance: -60000
    },
    {
      id: 'BC006',
      item: 'التسويق والإعلان',
      category: 'المصروفات',
      budgeted: 180000,
      actual: 180000,
      variance: 0,
      variancePercent: 0.0,
      ytdBudget: 540000,
      ytdActual: 540000,
      ytdVariance: 0
    },
  ], []);

  // بيانات تجريبية - المراجعة الداخلية
  const sampleInternalAudit: InternalAudit[] = useMemo(() => [
    {
      id: 'IA001',
      auditArea: 'دورة المشتريات',
      finding: 'عدم وجود موافقات معتمدة على بعض طلبات الشراء',
      risk: 'عالي',
      status: 'مفتوح',
      priority: 'عاجل',
      recommendation: 'تطبيق نظام الموافقات الإلكترونية لجميع طلبات الشراء',
      responsiblePerson: 'مدير المشتريات',
      dueDate: '2025-11-15'
    },
    {
      id: 'IA002',
      auditArea: 'إدارة النقدية',
      finding: 'تأخر في تحصيل بعض الفواتير المستحقة',
      risk: 'متوسط',
      status: 'قيد المعالجة',
      priority: 'مهم',
      recommendation: 'إنشاء جدول متابعة يومي للفواتير المستحقة',
      responsiblePerson: 'مدير الحسابات',
      dueDate: '2025-11-30'
    },
    {
      id: 'IA003',
      auditArea: 'الأصول الثابتة',
      finding: 'بعض الأصول غير مسجلة في سجل الأصول الثابتة',
      risk: 'متوسط',
      status: 'قيد المعالجة',
      priority: 'مهم',
      recommendation: 'إجراء جرد شامل للأصول وتحديث السجلات',
      responsiblePerson: 'مسؤول الأصول',
      dueDate: '2025-12-15'
    },
    {
      id: 'IA004',
      auditArea: 'الرقابة الداخلية',
      finding: 'ضعف في الفصل بين المهام في قسم المخازن',
      risk: 'عالي',
      status: 'مفتوح',
      priority: 'عاجل',
      recommendation: 'إعادة هيكلة الصلاحيات وتطبيق مبدأ الفصل بين المهام',
      responsiblePerson: 'المدير التنفيذي',
      dueDate: '2025-11-10'
    },
    {
      id: 'IA005',
      auditArea: 'المصروفات الإدارية',
      finding: 'مصروفات غير مدعومة بمستندات كافية',
      risk: 'متوسط',
      status: 'مفتوح',
      priority: 'مهم',
      recommendation: 'تطبيق سياسة صارمة للمستندات الداعمة',
      responsiblePerson: 'المدير المالي',
      dueDate: '2025-12-01'
    },
    {
      id: 'IA006',
      auditArea: 'نظام الرواتب',
      finding: 'سجلات الحضور لا تتطابق تماماً مع كشوف الرواتب',
      risk: 'منخفض',
      status: 'مغلق',
      priority: 'عادي',
      recommendation: 'تطبيق نظام بصمة إلكترونية مربوط بنظام الرواتب',
      responsiblePerson: 'مدير الموارد البشرية',
      dueDate: '2025-10-15'
    },
  ], []);

  // بيانات تجريبية - التكاليف المعيارية
  const sampleStandardCost: StandardCost[] = useMemo(() => [
    {
      id: 'SC001',
      costCenter: 'التصميم الهندسي',
      item: 'تكلفة ساعة العمل',
      standardCost: 150,
      actualCost: 145,
      variance: -5,
      variancePercent: -3.3,
      varianceType: 'مناسب',
      quantity: 2400
    },
    {
      id: 'SC002',
      costCenter: 'الإشراف الميداني',
      item: 'تكلفة ساعة العمل',
      standardCost: 120,
      actualCost: 135,
      variance: 15,
      variancePercent: 12.5,
      varianceType: 'غير مناسب',
      quantity: 3200
    },
    {
      id: 'SC003',
      costCenter: 'المواد والمستلزمات',
      item: 'تكلفة المواد لكل مشروع',
      standardCost: 25000,
      actualCost: 23500,
      variance: -1500,
      variancePercent: -6.0,
      varianceType: 'مناسب',
      quantity: 12
    },
    {
      id: 'SC004',
      costCenter: 'النقل والمواصلات',
      item: 'تكلفة النقل الشهرية',
      standardCost: 8000,
      actualCost: 8500,
      variance: 500,
      variancePercent: 6.3,
      varianceType: 'غير مناسب',
      quantity: 12
    },
    {
      id: 'SC005',
      costCenter: 'الاستشارات الفنية',
      item: 'تكلفة الاستشارة',
      standardCost: 5000,
      actualCost: 4800,
      variance: -200,
      variancePercent: -4.0,
      varianceType: 'مناسب',
      quantity: 35
    },
    {
      id: 'SC006',
      costCenter: 'الأجهزة والمعدات',
      item: 'تكلفة الصيانة الشهرية',
      standardCost: 3500,
      actualCost: 4200,
      variance: 700,
      variancePercent: 20.0,
      varianceType: 'غير مناسب',
      quantity: 12
    },
  ], []);

  // بيانات تجريبية - تحليل نقطة التعادل
  const sampleBreakEvenAnalysis: BreakEvenAnalysis[] = useMemo(() => [
    {
      id: 'BE001',
      product: 'خدمات التصميم المعماري',
      fixedCosts: 180000,
      variableCostPerUnit: 2500,
      sellingPricePerUnit: 8000,
      contributionMargin: 5500,
      breakEvenUnits: 33,
      breakEvenRevenue: 264000,
      currentSales: 520000,
      safetyMargin: 49.2
    },
    {
      id: 'BE002',
      product: 'خدمات الإشراف الهندسي',
      fixedCosts: 240000,
      variableCostPerUnit: 3000,
      sellingPricePerUnit: 10000,
      contributionMargin: 7000,
      breakEvenUnits: 35,
      breakEvenRevenue: 350000,
      currentSales: 650000,
      safetyMargin: 46.2
    },
    {
      id: 'BE003',
      product: 'الاستشارات الفنية',
      fixedCosts: 120000,
      variableCostPerUnit: 1500,
      sellingPricePerUnit: 5000,
      contributionMargin: 3500,
      breakEvenUnits: 35,
      breakEvenRevenue: 175000,
      currentSales: 400000,
      safetyMargin: 56.3
    },
    {
      id: 'BE004',
      product: 'دراسات الجدوى',
      fixedCosts: 80000,
      variableCostPerUnit: 8000,
      sellingPricePerUnit: 20000,
      contributionMargin: 12000,
      breakEvenUnits: 7,
      breakEvenRevenue: 140000,
      currentSales: 280000,
      safetyMargin: 50.0
    },
    {
      id: 'BE005',
      product: 'خدمات المساحة',
      fixedCosts: 150000,
      variableCostPerUnit: 2000,
      sellingPricePerUnit: 6000,
      contributionMargin: 4000,
      breakEvenUnits: 38,
      breakEvenRevenue: 228000,
      currentSales: 450000,
      safetyMargin: 49.3
    },
  ], []);

  // بيانات تجريبية - تحليل الربحية
  const sampleProfitabilityAnalysis: ProfitabilityAnalysis[] = useMemo(() => [
    {
      id: 'PA001',
      item: 'مشروع برج الأعمال',
      category: 'مشاريع كبرى',
      revenue: 850000,
      directCosts: 520000,
      indirectCosts: 105000,
      grossProfit: 330000,
      netProfit: 225000,
      profitMargin: 26.5,
      roi: 36.0
    },
    {
      id: 'PA002',
      item: 'مشروع فيلا سكنية',
      category: 'مشاريع صغيرة',
      revenue: 320000,
      directCosts: 180000,
      indirectCosts: 45000,
      grossProfit: 140000,
      netProfit: 95000,
      profitMargin: 29.7,
      roi: 42.2
    },
    {
      id: 'PA003',
      item: 'خدمات الإشراف الشهري',
      category: 'خدمات متكررة',
      revenue: 480000,
      directCosts: 290000,
      indirectCosts: 65000,
      grossProfit: 190000,
      netProfit: 125000,
      profitMargin: 26.0,
      roi: 35.2
    },
    {
      id: 'PA004',
      item: 'استشارات فنية متنوعة',
      category: 'خدمات احترافية',
      revenue: 280000,
      directCosts: 140000,
      indirectCosts: 42000,
      grossProfit: 140000,
      netProfit: 98000,
      profitMargin: 35.0,
      roi: 53.8
    },
    {
      id: 'PA005',
      item: 'دراسات جدوى',
      category: 'خدمات احترافية',
      revenue: 420000,
      directCosts: 245000,
      indirectCosts: 60000,
      grossProfit: 175000,
      netProfit: 115000,
      profitMargin: 27.4,
      roi: 37.7
    },
    {
      id: 'PA006',
      item: 'خدمات التصميم الداخلي',
      category: 'خدمات متخصصة',
      revenue: 180000,
      directCosts: 95000,
      indirectCosts: 28000,
      grossProfit: 85000,
      netProfit: 57000,
      profitMargin: 31.7,
      roi: 46.3
    },
  ], []);

  // بيانات تجريبية - المؤشرات المالية الرئيسية (KPIs)
  const sampleFinancialKPI: FinancialKPI[] = useMemo(() => [
    {
      id: 'KPI001',
      kpiName: 'معدل نمو الإيرادات',
      category: 'النمو',
      currentValue: 21.5,
      targetValue: 18.0,
      previousValue: 15.3,
      unit: '%',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 119.4
    },
    {
      id: 'KPI002',
      kpiName: 'هامش الربح الصافي',
      category: 'الربحية',
      currentValue: 32.8,
      targetValue: 28.0,
      previousValue: 29.5,
      unit: '%',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 117.1
    },
    {
      id: 'KPI003',
      kpiName: 'العائد على الأصول (ROA)',
      category: 'الربحية',
      currentValue: 20.9,
      targetValue: 18.0,
      previousValue: 18.2,
      unit: '%',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 116.1
    },
    {
      id: 'KPI004',
      kpiName: 'العائد على حقوق الملكية (ROE)',
      category: 'الربحية',
      currentValue: 32.9,
      targetValue: 25.0,
      previousValue: 27.8,
      unit: '%',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 131.6
    },
    {
      id: 'KPI005',
      kpiName: 'نسبة التداول الحالية',
      category: 'السيولة',
      currentValue: 2.65,
      targetValue: 2.00,
      previousValue: 2.45,
      unit: 'نسبة',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 132.5
    },
    {
      id: 'KPI006',
      kpiName: 'نسبة السيولة السريعة',
      category: 'السيولة',
      currentValue: 1.85,
      targetValue: 1.50,
      previousValue: 1.70,
      unit: 'نسبة',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 123.3
    },
    {
      id: 'KPI007',
      kpiName: 'نسبة الدين إلى حقوق الملكية',
      category: 'المديونية',
      currentValue: 57.4,
      targetValue: 60.0,
      previousValue: 62.8,
      unit: '%',
      trend: 'هابط',
      status: 'جيد',
      achievement: 104.5
    },
    {
      id: 'KPI008',
      kpiName: 'معدل دوران الأصول',
      category: 'الكفاءة',
      currentValue: 0.64,
      targetValue: 0.55,
      previousValue: 0.58,
      unit: 'مرة',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 116.4
    },
    {
      id: 'KPI009',
      kpiName: 'معدل تحصيل الديون',
      category: 'الكفاءة',
      currentValue: 42,
      targetValue: 45,
      previousValue: 48,
      unit: 'يوم',
      trend: 'صاعد',
      status: 'جيد',
      achievement: 107.1
    },
    {
      id: 'KPI010',
      kpiName: 'معدل دوران المخزون',
      category: 'الكفاءة',
      currentValue: 8.5,
      targetValue: 7.0,
      previousValue: 7.8,
      unit: 'مرة',
      trend: 'صاعد',
      status: 'ممتاز',
      achievement: 121.4
    },
  ], []);

  // بيانات تجريبية - التوقعات المالية
  const sampleFinancialForecast: FinancialForecast[] = useMemo(() => [
    {
      id: 'FF001',
      period: 'الربع الأول 2026',
      revenue: 2650000,
      expenses: 1780000,
      netProfit: 870000,
      cashFlow: 920000,
      confidence: 85,
      scenario: 'واقعي'
    },
    {
      id: 'FF002',
      period: 'الربع الثاني 2026',
      revenue: 2800000,
      expenses: 1850000,
      netProfit: 950000,
      cashFlow: 980000,
      confidence: 80,
      scenario: 'واقعي'
    },
    {
      id: 'FF003',
      period: 'الربع الثالث 2026',
      revenue: 2950000,
      expenses: 1920000,
      netProfit: 1030000,
      cashFlow: 1050000,
      confidence: 75,
      scenario: 'واقعي'
    },
    {
      id: 'FF004',
      period: 'الربع الرابع 2026',
      revenue: 3100000,
      expenses: 2000000,
      netProfit: 1100000,
      cashFlow: 1120000,
      confidence: 70,
      scenario: 'واقعي'
    },
    {
      id: 'FF005',
      period: 'الربع الأول 2026',
      revenue: 2900000,
      expenses: 1820000,
      netProfit: 1080000,
      cashFlow: 1100000,
      confidence: 75,
      scenario: 'متفائل'
    },
    {
      id: 'FF006',
      period: 'الربع الأول 2026',
      revenue: 2400000,
      expenses: 1750000,
      netProfit: 650000,
      cashFlow: 700000,
      confidence: 90,
      scenario: 'متحفظ'
    },
  ], []);

  // بيانات تجريبية - تحليل المخاطر المالية
  const sampleFinancialRisk: FinancialRisk[] = useMemo(() => [
    {
      id: 'FR001',
      riskName: 'تأخر سداد العملاء الرئيسيين',
      category: 'مخاطر السيولة',
      probability: 35,
      impact: 80,
      riskScore: 28,
      level: 'عالي',
      mitigation: 'تطبيق سياسة ائتمانية صارمة وتحفيز السداد المبكر',
      status: 'قيد المراقبة'
    },
    {
      id: 'FR002',
      riskName: 'انخفاض الطلب على الخدمات الهندسية',
      category: 'مخاطر الإيرادات',
      probability: 25,
      impact: 90,
      riskScore: 22.5,
      level: 'عالي',
      mitigation: 'تنويع قاعدة العملاء وتطوير خدمات جديدة',
      status: 'نشط'
    },
    {
      id: 'FR003',
      riskName: 'ارتفاع تكاليف المواد والعمالة',
      category: 'مخاطر التكاليف',
      probability: 60,
      impact: 70,
      riskScore: 42,
      level: 'حرج',
      mitigation: 'عقود طويلة الأجل مع الموردين وتحسين الكفاءة التشغيلية',
      status: 'نشط'
    },
    {
      id: 'FR004',
      riskName: 'فقدان كوادر رئيسية',
      category: 'مخاطر تشغيلية',
      probability: 30,
      impact: 75,
      riskScore: 22.5,
      level: 'عالي',
      mitigation: 'برامج تطوير وحوافز للموظفين الرئيسيين',
      status: 'قيد المراقبة'
    },
    {
      id: 'FR005',
      riskName: 'تغييرات في الأنظمة والقوانين',
      category: 'مخاطر تنظيمية',
      probability: 40,
      impact: 60,
      riskScore: 24,
      level: 'عالي',
      mitigation: 'متابعة مستمرة للتحديثات التنظيمية والامتثال الكامل',
      status: 'قيد المراقبة'
    },
    {
      id: 'FR006',
      riskName: 'مخاطر أمن المعلومات',
      category: 'مخاطر تقنية',
      probability: 20,
      impact: 85,
      riskScore: 17,
      level: 'متوسط',
      mitigation: 'تطبيق بروتوكولات أمنية متقدمة ونسخ احتياطي منتظم',
      status: 'محلول'
    },
    {
      id: 'FR007',
      riskName: 'منافسة شديدة في السوق',
      category: 'مخاطر السوق',
      probability: 50,
      impact: 65,
      riskScore: 32.5,
      level: 'عالي',
      mitigation: 'التميز في الجودة والخدمة والابتكار المستمر',
      status: 'نشط'
    },
  ], []);

  // بيانات تجريبية - لوحة القيادة التنفيذية
  const sampleExecutiveDashboard: ExecutiveDashboardMetric[] = useMemo(() => [
    {
      id: 'EDM001',
      metric: 'إجمالي الإيرادات',
      value: 2500000,
      previousValue: 2050000,
      change: 450000,
      changePercent: 22.0,
      target: 2400000,
      icon: 'DollarSign',
      color: 'green'
    },
    {
      id: 'EDM002',
      metric: 'صافي الربح',
      value: 820000,
      previousValue: 650000,
      change: 170000,
      changePercent: 26.2,
      target: 750000,
      icon: 'TrendingUp',
      color: 'blue'
    },
    {
      id: 'EDM003',
      metric: 'هامش الربح الصافي',
      value: 32.8,
      previousValue: 31.7,
      change: 1.1,
      changePercent: 3.5,
      target: 30.0,
      icon: 'Percent',
      color: 'purple'
    },
    {
      id: 'EDM004',
      metric: 'العائد على الاستثمار',
      value: 32.9,
      previousValue: 27.8,
      change: 5.1,
      changePercent: 18.3,
      target: 25.0,
      icon: 'TrendingUp',
      color: 'yellow'
    },
    {
      id: 'EDM005',
      metric: 'التدفق النقدي',
      value: 950000,
      previousValue: 780000,
      change: 170000,
      changePercent: 21.8,
      target: 850000,
      icon: 'Wallet',
      color: 'pink'
    },
    {
      id: 'EDM006',
      metric: 'إجمالي الأصول',
      value: 3920000,
      previousValue: 3500000,
      change: 420000,
      changePercent: 12.0,
      target: 3800000,
      icon: 'Building2',
      color: 'indigo'
    },
  ], []);

  // الحصول على التاب النشط
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  // عرض المحتوى حسب التاب النشط
  const renderTabContent = () => {
    switch (activeTab) {
      // ===== تاب 222-01: شجرة الحسابات =====
      case '222-01':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  شجرة الحسابات
                </h3>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة الدليل المحاسبي الكامل وتنظيم الحسابات حسب النوع
                </p>
              </div>
              <div className="flex gap-1">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  onClick={() => setShowCreateAccountDialog(true)}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  حساب جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>

            {/* نافذة إنشاء حساب جديد */}
            <Dialog open={showCreateAccountDialog} onOpenChange={setShowCreateAccountDialog}>
              <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إضافة حساب جديد
                  </DialogTitle>
                  <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أدخل معلومات الحساب الجديد في الدليل المحاسبي
                  </DialogDescription>
                </DialogHeader>
                
                <div className="form-rtl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor="accountNumber" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رقم الحساب *
                      </Label>
                      <Input
                        id="accountNumber"
                        className="input-field"
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          textAlign: 'right',
                          direction: 'rtl',
                          borderRadius: '8px'
                        }}
                        placeholder="مثال: 1000"
                      />
                    </div>

                    <div className="form-group">
                      <Label htmlFor="accountName" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اسم الحساب *
                      </Label>
                      <Input
                        id="accountName"
                        className="input-field"
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          textAlign: 'right',
                          direction: 'rtl',
                          borderRadius: '8px'
                        }}
                        placeholder="أدخل اسم الحساب"
                      />
                    </div>

                    <div className="form-group">
                      <Label htmlFor="accountType" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نوع الحساب *
                      </Label>
                      <div className="select-rtl">
                        <Select>
                          <SelectTrigger 
                            className="input-field select-trigger"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl',
                              borderRadius: '8px'
                            }}
                          >
                            <SelectValue placeholder="اختر نوع الحساب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="أصول">أصول</SelectItem>
                            <SelectItem value="خصوم">خصوم</SelectItem>
                            <SelectItem value="حقوق الملكية">حقوق الملكية</SelectItem>
                            <SelectItem value="إيرادات">إيرادات</SelectItem>
                            <SelectItem value="مصروفات">مصروفات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="parentAccount" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الحساب الرئيسي
                      </Label>
                      <div className="select-rtl">
                        <Select>
                          <SelectTrigger 
                            className="input-field select-trigger"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl',
                              borderRadius: '8px'
                            }}
                          >
                            <SelectValue placeholder="اختر الحساب الرئيسي (اختياري)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">لا يوجد (حساب رئيسي)</SelectItem>
                            <SelectItem value="1000">1000 - النقدية</SelectItem>
                            <SelectItem value="1100">1100 - البنوك</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="currency" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        العملة *
                      </Label>
                      <div className="select-rtl">
                        <Select>
                          <SelectTrigger 
                            className="input-field select-trigger"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl',
                              borderRadius: '8px'
                            }}
                          >
                            <SelectValue placeholder="اختر العملة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ريال سعودي">ريال سعودي (SAR)</SelectItem>
                            <SelectItem value="دولار أمريكي">دولار أمريكي (USD)</SelectItem>
                            <SelectItem value="يورو">يورو (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="status" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الحالة *
                      </Label>
                      <div className="select-rtl">
                        <Select>
                          <SelectTrigger 
                            className="input-field select-trigger"
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl',
                              borderRadius: '8px'
                            }}
                          >
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نشط">نشط</SelectItem>
                            <SelectItem value="معلق">معلق</SelectItem>
                            <SelectItem value="مغلق">مغلق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="form-group col-span-2">
                      <Label htmlFor="description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الوصف
                      </Label>
                      <Textarea
                        id="description"
                        rows={3}
                        className="input-field"
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          textAlign: 'right',
                          direction: 'rtl',
                          borderRadius: '8px'
                        }}
                        placeholder="وصف تفصيلي للحساب..."
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2" style={{ justifyContent: 'flex-start' }}>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateAccountDialog(false)}
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    className="bg-[#10b981] hover:bg-[#059669] text-white"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Save className="h-4 w-4 ml-2" />
                    حفظ الحساب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ال��حث والتصفية */}
            <Card className="bg-blue-50 border-blue-200 card-rtl">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 form-rtl">
                  <div className="col-span-2 form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث في الحسابات</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="ابحث برقم الحساب أو الاسم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field"
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          textAlign: 'right',
                          direction: 'rtl',
                          borderRadius: '8px'
                        }}
                      />
                      <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الحساب</Label>
                    <div className="select-rtl">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="أصول">أصول</SelectItem>
                          <SelectItem value="خصوم">خصوم</SelectItem>
                          <SelectItem value="حقوق الملكية">حقوق الملكية</SelectItem>
                          <SelectItem value="إيرادات">إيرادات</SelectItem>
                          <SelectItem value="مصروفات">مصروفات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                    <div className="select-rtl">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="معلق">معلق</SelectItem>
                          <SelectItem value="مغلق">مغلق</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الحسابات
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        156
                      </p>
                    </div>
                    <BookOpen className="h-10 w-10 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الأصول
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        48
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الخصوم
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        32
                      </p>
                    </div>
                    <TrendingDown className="h-10 w-10 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الإيرادات
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        28
                      </p>
                    </div>
                    <DollarSign className="h-10 w-10 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        المصروفات
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        48
                      </p>
                    </div>
                    <Receipt className="h-10 w-10 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحسابات */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الحسابات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الحساب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الحساب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العملة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر معاملة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.accountNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {account.accountName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            account.accountType === 'أصول' ? 'bg-green-100 text-green-700' :
                            account.accountType === 'خصوم' ? 'bg-red-100 text-red-700' :
                            account.accountType === 'إيرادات' ? 'bg-blue-100 text-blue-700' :
                            account.accountType === 'مصروفات' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {account.accountType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.balance.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {account.currency}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            account.status === 'نشط' ? 'bg-green-100 text-green-700' :
                            account.status === 'معلق' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.lastTransaction}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-02: القيود اليومية =====
      case '222-02':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  القيود اليومية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة القيود المحاسبية اليدوية والتلقائية والتسويات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  onClick={() => setShowCreateJournalDialog(true)}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  قيد جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي القيود
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        247
                      </p>
                    </div>
                    <FileText className="h-10 w-10 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيود معتمدة
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        198
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيود مسودة
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        32
                      </p>
                    </div>
                    <Clock className="h-10 w-10 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيود هذا الشهر
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        45
                      </p>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* البحث والفلترة */}
            <Card className="bg-blue-50 border-blue-200 card-rtl">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 form-rtl">
                  <div className="col-span-2 form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث في القيود</Label>
                    <Input
                      placeholder="ابحث برقم القيد أو الوصف..."
                      className="input-field"
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        textAlign: 'right',
                        direction: 'rtl',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع القيد</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="قيد يدوي">قيد يدوي</SelectItem>
                          <SelectItem value="قيد تلقائي">قيد تلقائي</SelectItem>
                          <SelectItem value="قيد تسوية">قيد تسوية</SelectItem>
                          <SelectItem value="قيد إقفال">قيد إقفال</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="مسودة">مسودة</SelectItem>
                          <SelectItem value="معتمد">معتمد</SelectItem>
                          <SelectItem value="مرحّل">مرحّل</SelectItem>
                          <SelectItem value="ملغي">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول القيود اليومية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة القيود اليومية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم القيد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدين</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدائن</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleJournalEntries.slice(0, 8).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.entryNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            entry.type === 'قيد يدوي' ? 'bg-blue-100 text-blue-700' :
                            entry.type === 'قيد تلقائي' ? 'bg-green-100 text-green-700' :
                            entry.type === 'قيد تسوية' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {entry.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.totalDebit.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.totalCredit.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            entry.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                            entry.status === 'مسودة' ? 'bg-yellow-100 text-yellow-700' :
                            entry.status === 'مرحّل' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Printer className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-03: الدفعات والتحصيلات =====
      case '222-03':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الدفعات والتحصيلات
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة جميع الدفعات الصادرة والتحصيلات الواردة والتحويلات البنكية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  دفعة جديدة
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تحصيلات واردة
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.5M ريال
                      </p>
                    </div>
                    <ArrowDownRight className="h-10 w-10 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        دفعات صادرة
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.8M ريال
                      </p>
                    </div>
                    <ArrowUpRight className="h-10 w-10 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تحويلات داخلية
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        850K ريال
                      </p>
                    </div>
                    <RefreshCw className="h-10 w-10 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المعاملات
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5.15M ريال
                      </p>
                    </div>
                    <Activity className="h-10 w-10 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        معاملات اليوم
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        12
                      </p>
                    </div>
                    <Calendar className="h-10 w-10 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* البحث والفلترة */}
            <Card className="bg-blue-50 border-blue-200 card-rtl">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-4 form-rtl">
                  <div className="col-span-2 form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث في الدفعات</Label>
                    <Input
                      placeholder="ابحث برقم الدفعة أو المستفيد..."
                      className="input-field"
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        textAlign: 'right',
                        direction: 'rtl',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العملية</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="دفعة صادرة">دفعة صادرة</SelectItem>
                          <SelectItem value="تحصيل وارد">تحصيل وارد</SelectItem>
                          <SelectItem value="تحويل داخلي">تحويل داخلي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الطريقة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="نقدي">نقدي</SelectItem>
                          <SelectItem value="بنكي">بنكي</SelectItem>
                          <SelectItem value="شيك">شيك</SelectItem>
                          <SelectItem value="بطاقة">بطاقة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="مكتملة">مكتملة</SelectItem>
                          <SelectItem value="معلقة">معلقة</SelectItem>
                          <SelectItem value="ملغاة">ملغاة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الدفعات والتحصيلات */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الدفعات والتحصيلات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العملية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستفيد/الدافع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePayments.slice(0, 8).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payment.paymentNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payment.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            payment.type === 'تحصيل وارد' ? 'bg-green-100 text-green-700' :
                            payment.type === 'دفعة صادرة' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {payment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payment.amount.toLocaleString('ar-SA')} {payment.currency}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-purple-100 text-purple-700">
                            {payment.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {payment.beneficiary || payment.payer}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            payment.status === 'مكتملة' ? 'bg-green-100 text-green-700' :
                            payment.status === 'معلقة' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Printer className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-04: الفواتير =====
      case '222-04':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الفواتير
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة الفواتير البيعية والشرائية مع متابعة الدفعات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  فاتورة جديدة
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فواتير مدفوعة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.2M ريال
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فواتير مرسلة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        850K ريال
                      </p>
                    </div>
                    <Send className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فواتير مسودة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        320K ريال
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فواتير متأخرة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        180K ريال
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فواتير جزئية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        450K ريال
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الفواتير
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3M ريال
                      </p>
                    </div>
                    <Receipt className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* البحث والفلترة */}
            <Card className="bg-blue-50 border-blue-200 card-rtl">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-4 form-rtl">
                  <div className="col-span-2 form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث في الفواتير</Label>
                    <Input
                      placeholder="ابحث برقم الفاتورة أو اسم العميل..."
                      className="input-field"
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        textAlign: 'right',
                        direction: 'rtl',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الفاتورة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="فاتورة مبيعات">فاتورة مبيعات</SelectItem>
                          <SelectItem value="فاتورة مشتريات">فاتورة مشتريات</SelectItem>
                          <SelectItem value="فاتورة خدمات">فاتورة خدمات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="مسودة">مسودة</SelectItem>
                          <SelectItem value="مرسلة">مرسلة</SelectItem>
                          <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                          <SelectItem value="دفع جزئي">دفع جزئي</SelectItem>
                          <SelectItem value="متأخرة">متأخرة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-group">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الشهر</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger 
                          className="input-field select-trigger"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '8px'
                          }}
                        >
                          <SelectValue placeholder="اختر الشهر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">الكل</SelectItem>
                          <SelectItem value="أكتوبر 2025">أكتوبر 2025</SelectItem>
                          <SelectItem value="سبتمبر 2025">سبتمبر 2025</SelectItem>
                          <SelectItem value="أغسطس 2025">أغسطس 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول الفواتير */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الفواتير</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ الإجمالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ المدفوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {invoice.date}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {invoice.clientName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {invoice.totalAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {invoice.paidAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {invoice.remainingAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            invoice.status === 'مدفوعة' ? 'bg-green-100 text-green-700' :
                            invoice.status === 'مرسلة' ? 'bg-yellow-100 text-yellow-700' :
                            invoice.status === 'دفع جزئي' ? 'bg-blue-100 text-blue-700' :
                            invoice.status === 'متأخرة' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Printer className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Send className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-05: البنوك والخزينة =====
      case '222-05':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  البنوك والخزينة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة الحسابات البنكية والحركات المالية والتسويات البنكية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  حساب بنكي جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  كشف حساب
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الأرصدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.67M ريال
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        حسابات جارية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        850K ريال
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        حسابات توفير
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        320K ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        ودائع
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        500K ريال
                      </p>
                    </div>
                    <Banknote className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الحسابات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحسابات البنكية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الحسابات البنكية النشطة</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم البنك</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الحساب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IBAN</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفرع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBankAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {account.bankName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.accountNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.iban}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            account.accountType === 'حساب جاري' ? 'bg-blue-100 text-blue-700' :
                            account.accountType === 'حساب توفير' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {account.accountType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {account.balance.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {account.branch}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Printer className="h-3 w-3" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* جدول الحركات البنكية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر الحركات البنكية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العملية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرصيد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرجع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {transaction.transactionNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {transaction.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            transaction.type === 'إيداع' ? 'bg-green-100 text-green-700' :
                            transaction.type === 'سحب' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {transaction.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {transaction.balance.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {transaction.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {transaction.reference}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-06: الأرصدة الافتتاحية =====
      case '222-06':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الأرصدة الافتتاحية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدخال وإدارة الأرصدة الافتتاحية للحسابات في بداية السنة المالية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة رصيد افتتاحي
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Upload className="h-4 w-4 ml-2" />
                  استيراد Excel
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المدين
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        850K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الدائن
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5.12M ريال
                      </p>
                    </div>
                    <TrendingDown className="h-10 w-10 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الحسابات
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        156
                      </p>
                    </div>
                    <BookOpen className="h-10 w-10 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        السنة المالية
                      </p>
                      <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2025
                      </p>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الأرصدة الافتتاحية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الأرصدة الافتتاحية للسنة المالية 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الحساب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الحساب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رصيد مدين</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رصيد دائن</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنة المالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>أُنشئ بواسطة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleOpeningBalances.map((balance) => (
                      <TableRow key={balance.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {balance.accountNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {balance.accountName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {balance.debitBalance > 0 ? balance.debitBalance.toLocaleString('ar-SA') : '-'}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {balance.creditBalance > 0 ? balance.creditBalance.toLocaleString('ar-SA') : '-'}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {balance.fiscalYear}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {balance.createdBy}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {balance.createdDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-07: التسويات المحاسبية =====
      case '222-07':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  التسويات المحاسبية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  قيود التسوية الجردية والتعديلات المحاسبية والاستحقاقات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  قيد تسوية جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileSpreadsheet className="h-4 w-4 ml-2" />
                  تقرير التسويات
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيود تسوية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        24
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تسويات معتمدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        18
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيد الاستهلاك
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        12K ريال
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تسويات الشهر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        6
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تحتاج مراجعة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول قيود التسوية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قيود التسوية المحاسبية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم القيد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع التسوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleJournalEntries.filter(e => e.type === 'قيد تسوية').map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.entryNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.date}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-yellow-100 text-yellow-700">
                            {entry.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {entry.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {entry.totalDebit.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            entry.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-08: الحسابات المدينة =====
      case '222-08':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الحسابات المدينة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  متابعة مستحقات العملاء وإدارة أعمار الديون والتحصيلات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال تذكير
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تقرير الديون
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المستحقات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        500K ريال
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مسدد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        150K ريال
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مستحق قريباً
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        250K ريال
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متأخر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        90K ريال
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد العملاء
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-center">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط أيام السداد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        14 يوم
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحسابات المدينة */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المستحقات من العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ الكلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عمر الدين</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleReceivables.map((receivable) => (
                      <TableRow key={receivable.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {receivable.clientName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {receivable.invoiceNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {receivable.totalAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {receivable.paidAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {receivable.remainingAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {receivable.dueDate}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {Math.abs(receivable.agingDays)} {receivable.agingDays < 0 ? 'متأخر' : 'متبقي'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            receivable.status === 'مسدد' ? 'bg-green-100 text-green-700' :
                            receivable.status === 'مستحق قريباً' ? 'bg-yellow-100 text-yellow-700' :
                            receivable.status === 'متأخر' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {receivable.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Mail className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-09: الحسابات الدائنة =====
      case '222-09':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الحسابات الدائنة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  متابعة مستحقات الموردين وإدارة أعمار الديون والدفعات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <CreditCard className="h-4 w-4 ml-2" />
                  سداد مستحقات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تقرير الموردين
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المستحقات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        150K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مسدد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        80K ريال
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مستحق قريباً
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        25K ريال
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متأخر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        45K ريال
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الموردين
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-center">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط أيام السداد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        7 أيام
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحسابات الدائنة */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المستحقات للموردين</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المورد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ الكلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عمر الدين</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePayables.map((payable) => (
                      <TableRow key={payable.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {payable.vendorName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payable.invoiceNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payable.totalAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payable.paidAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payable.remainingAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {payable.dueDate}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {Math.abs(payable.agingDays)} {payable.agingDays < 0 ? 'متأخر' : 'متبقي'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            payable.status === 'مسدد' ? 'bg-green-100 text-green-700' :
                            payable.status === 'مستحق قريباً' ? 'bg-yellow-100 text-yellow-700' :
                            payable.status === 'متأخر' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {payable.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <DollarSign className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-10: المصروفات المستحقة =====
      case '222-10':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  المصروفات المستحقة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة المصروفات المحملة على الفترة الحالية والمستحق سدادها
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  مصروف مستحق جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileSpreadsheet className="h-4 w-4 ml-2" />
                  تقرير المصروفات
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المستحق
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        127K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        رواتب وأجور
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        80K ريال
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إيجارات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        30K ريال
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مرافق وتأمينات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        17K ريال
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد المصروفات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول المصروفات المستحقة */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المصروفات المستحقة للفترة الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المصروف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleAccruedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {expense.expenseType}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {expense.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {expense.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {expense.period}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {expense.dueDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            expense.status === 'مسدد' ? 'bg-green-100 text-green-700' :
                            expense.status === 'مسجل' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-11: الإيرادات المستحقة =====
      case '222-11':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الإيرادات المستحقة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  إدارة الإيرادات المحققة والمستحق تحصيلها من العملاء
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إيراد مستحق جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تقرير الإيرادات
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المستحق
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        190K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أتعاب هندسية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        120K ريال
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        استشارات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        25K ريال
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إشراف
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        45K ريال
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الإيرادات المستحقة */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإيرادات المستحقة للفترة الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الإيراد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ المتوقع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleAccruedRevenues.map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {revenue.revenueType}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {revenue.description}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {revenue.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {revenue.period}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {revenue.expectedDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            revenue.status === 'محصّل' ? 'bg-green-100 text-green-700' :
                            revenue.status === 'مسجل' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {revenue.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-12: الموازنة التخطيطية =====
      case '222-12':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  الموازنة التخطيطية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  الموازنة السنوية والمقارنة مع الفعلي وتحليل الانحرافات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  بند موازنة جديد
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4 ml-2" />
                  تقرير الانحرافات
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الموازنة المخططة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.61M ريال
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الفعلي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.83M ريال
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الانحراف
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        -780K ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة التنفيذ
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        70%
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        بنود تحتاج مراجعة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد البنود
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الموازنة التخطيطية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>بنود الموازنة السنوية 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخطط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفعلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الانحراف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الانحراف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBudget.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.department}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.budgetedAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.actualAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.variance.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.variancePercent < 0 ? 'bg-green-100 text-green-700' :
                            item.variancePercent > 15 ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.period}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-13: التحليل المالي =====
      case '222-13':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  التحليل المالي والنسب المالية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل شامل للنسب والمؤشرات المالية ومقارنتها بالمعايير القياسية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="h-4 w-4 ml-2" />
                  تقرير تحليلي
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب ممتازة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب جيدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب السيولة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب الربحية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب المديونية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول النسب المالية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>النسب والمؤشرات المالية الرئيسية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النسبة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الحالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة السابقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التغير</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعيار القياسي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFinancialRatios.map((ratio) => (
                      <TableRow key={ratio.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {ratio.ratioName}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {ratio.category}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {ratio.currentValue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {ratio.previousValue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={ratio.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {ratio.change > 0 ? '+' : ''}{ratio.change.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {ratio.benchmark.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            ratio.status === 'ممتاز' ? 'bg-green-100 text-green-700' :
                            ratio.status === 'جيد' ? 'bg-blue-100 text-blue-700' :
                            ratio.status === 'مقبول' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {ratio.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <BarChart3 className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-14: التدفقات النقدية =====
      case '222-14':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  قائمة التدفقات النقدية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  التدفقات النقدية من الأنشطة التشغيلية والاستثمارية والتمويلية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة تدفق نقدي
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة القائمة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أنشطة تشغيلية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +415K
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أنشطة استثمارية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        -250K
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أنشطة تمويلية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        -150K
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        صافي التدفقات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +15K
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        النقدية أول الفترة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        700K
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        النقدية آخر الفترة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        715K
                      </p>
                    </div>
                    <Banknote className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التدفقات النقدية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل التدفقات النقدية للربع الثالث 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النشاط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleCashFlows.map((flow) => (
                      <TableRow key={flow.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.activity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            flow.type === 'تشغيلية' ? 'bg-green-100 text-green-700' :
                            flow.type === 'استثمارية' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {flow.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={flow.amount >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {flow.amount >= 0 ? '+' : ''}{flow.amount.toLocaleString('ar-SA')} ريال
                          </span>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.period}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-15: قائمة الدخل =====
      case '222-15':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  قائمة الدخل (Income Statement)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  الإيرادات والمصروفات وصافي الربح مع المقارنة بالفترة السابقة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة القائمة
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.5M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المصروفات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.68M ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        صافي الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        820K ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        هامش الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        32.8%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +21.9%
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول قائمة الدخل */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الدخل التفصيلية - الفترة الحالية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة الحالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة السابقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التغير</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة التغير</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleIncomeStatement.map((item) => (
                      <TableRow key={item.id} className={item.type === 'صافي' ? 'bg-blue-50' : ''}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.type === 'إيراد' ? 'bg-green-100 text-green-700' :
                            item.type === 'مصروف' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.currentPeriod.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.previousPeriod.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={item.change >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {item.change >= 0 ? '+' : ''}{item.change.toLocaleString('ar-SA')} ريال
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }>
                            {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <BarChart3 className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-16: قائمة المركز المالي =====
      case '222-16':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  قائمة المركز المالي (الميزانية العمومية)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  الأصول والالتزامات وحقوق الملكية مع المقارنة بالفترة السابقة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة القائمة
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الأصول
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3.92M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أصول متداولة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.67M ريال
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أصول ثابتة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.25M ريال
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الالتزامات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.43M ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        حقوق الملكية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.49M ريال
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة الملكية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        63.5%
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول قائمة المركز المالي */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الميزانية العمومية التفصيلية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع الفرعي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة الحالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة السابقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التغير</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBalanceSheet.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.type === 'أصول' ? 'bg-blue-100 text-blue-700' :
                            item.type === 'التزامات' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.subType}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.currentAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.previousAmount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={item.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {item.change >= 0 ? '+' : ''}{item.change.toLocaleString('ar-SA')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <BarChart3 className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-17: تقرير الأرباح والخسائر =====
      case '222-17':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير الأرباح والخسائر التفصيلي
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تقرير ربع سنوي شامل للإيرادات والمصروفات والأرباح
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة التقرير
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.5M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المصروفات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.88M ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        صافي الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        620K ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        هامش الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        24.8%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أفضل ربع
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        Q3
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو سنوي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +18.5%
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تقرير الأرباح والخسائر */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التقرير الربع سنوي للأرباح والخسائر 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>Q1</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>Q2</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>Q3</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>Q4</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProfitLossReport.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.category}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.type === 'إيراد' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.q1.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.q2.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.q3.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.q4.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.total.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {item.percentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-18: تقرير التدفقات النقدية التفصيلي =====
      case '222-18':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير التدفقات النقدية التفصيلي
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تقرير شامل للتدفقات النقدية مع التحليل الزمني والتصنيفي
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="h-4 w-4 ml-2" />
                  رسم بياني
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تدفقات تشغيلية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +415K ريال
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تدفقات استثمارية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        -250K ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تدفقات تمويلية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        -150K ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        صافي التدفقات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +15K ريال
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        معدل التدفق الشهري
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +5K ريال
                      </p>
                    </div>
                    <LineChart className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التدفقات */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>ملخص التدفقات النقدية حسب النشاط</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النشاط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleCashFlows.map((flow) => (
                      <TableRow key={flow.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.activity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            flow.type === 'تشغيلية' ? 'bg-green-100 text-green-700' :
                            flow.type === 'استثمارية' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }>
                            {flow.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={flow.amount >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {flow.amount >= 0 ? '+' : ''}{flow.amount.toLocaleString('ar-SA')} ريال
                          </span>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.period}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {flow.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-19: تقرير تحليل المصروفات =====
      case '222-19':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير تحليل المصروفات
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل شامل للمصروفات حسب الفئات والأقسام مع مقارنة الموازنة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <PieChart className="h-4 w-4 ml-2" />
                  رسم دائري
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي المصروفات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.9M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الموازنة المعتمدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.03M ريال
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الفرق (وفر)
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        130K ريال
                      </p>
                    </div>
                    <ArrowDownRight className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة التنفيذ
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        93.6%
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أكبر فئة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        الرواتب
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الفئات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        6
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تحليل المصروفات */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل المصروفات حسب الفئة والقسم</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ الفعلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموازنة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الانحراف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleExpenseAnalysis.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {expense.category}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {expense.department}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {expense.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {expense.percentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {expense.budget.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={expense.variance < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {expense.variance >= 0 ? '+' : ''}{expense.variance.toLocaleString('ar-SA')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            expense.trend === 'صاعد' ? 'bg-red-100 text-red-700' :
                            expense.trend === 'نازل' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {expense.trend}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <BarChart3 className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-20: تقرير تحليل الإيرادات =====
      case '222-20':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير تحليل الإيرادات
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل شامل للإيرادات حسب المصادر والفئات مع تحقيق الأهداف
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="h-4 w-4 ml-2" />
                  رسم بياني
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.5M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الهدف المحدد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.45M ريال
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة التحقيق
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        102%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أكبر مصدر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        أتعاب هندسية
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        معدل النمو
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +10.7%
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد المصادر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-indigo-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تحليل الإيرادات */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل الإيرادات حسب المصدر والفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصدر</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهدف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة التحقيق</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النمو %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleRevenueAnalysis.map((revenue) => (
                      <TableRow key={revenue.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {revenue.source}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {revenue.category}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {revenue.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {revenue.percentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {revenue.target.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            revenue.achievement >= 100 ? 'bg-green-100 text-green-700' :
                            revenue.achievement >= 90 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {revenue.achievement.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={revenue.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {revenue.growth >= 0 ? '+' : ''}{revenue.growth.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <BarChart3 className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-21: تقرير النسب المالية =====
      case '222-21':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير النسب المالية التفصيلي
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تقرير شامل للنسب المالية مع المعادلات والتفسيرات والمقارنات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تصدير التقرير
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب ممتازة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        6
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب جيدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب السيولة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب الربحية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب المديونية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسب النشاط
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-indigo-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول النسب المالية التفصيلية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>النسب المالية مع المعادلات والتفسيرات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم النسبة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعادلة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الصناعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفسير</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFinancialRatioDetailed.map((ratio) => (
                      <TableRow key={ratio.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {ratio.ratioName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {ratio.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {ratio.formula}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {ratio.currentValue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {ratio.industryAverage.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {ratio.interpretation}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            ratio.status === 'ممتاز' ? 'bg-green-100 text-green-700' :
                            ratio.status === 'جيد' ? 'bg-blue-100 text-blue-700' :
                            ratio.status === 'مقبول' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {ratio.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-22: تقرير التحليل الأفقي =====
      case '222-22':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير التحليل الأفقي (Horizontal Analysis)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل مقارن للبيانات المالية عبر الفترات الزمنية (2023-2025)
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <LineChart className="h-4 w-4 ml-2" />
                  رسم الاتجاهات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +21.9%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو صافي الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +26.2%
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو الأصول
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +12.0%
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو حقوق الملكية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +18.6%
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        معدل النمو السنوي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +10.6%
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التحليل الأفقي */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التحليل الأفقي للبيانات المالية (2023-2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>2023</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>2024</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>2025</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التغير 2024</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة 2024</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التغير 2025</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة 2025</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleHorizontalAnalysis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.item}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.year2023.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.year2024.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.year2025.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={item.change2024 >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {item.change2024 >= 0 ? '+' : ''}{item.change2024.toLocaleString('ar-SA')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={item.changePercent2024 >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {item.changePercent2024 >= 0 ? '+' : ''}{item.changePercent2024.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={item.change2025 >= 0 ? 'text-green-700' : 'text-red-700'}>
                            {item.change2025 >= 0 ? '+' : ''}{item.change2025.toLocaleString('ar-SA')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={item.changePercent2025 >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {item.changePercent2025 >= 0 ? '+' : ''}{item.changePercent2025.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-23: تقرير التحليل الرأسي =====
      case '222-23':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير التحليل الرأسي (Vertical Analysis)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل النسب المئوية للبنود المالية من إجمالي المجموعة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <PieChart className="h-4 w-4 ml-2" />
                  رسم دائري
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الأصول المتداولة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        42.7%
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الأصول الثابتة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        57.3%
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إيرادات المبيعات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        74.0%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تكلفة المبيعات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        56.8%
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مصروفات إدارية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        24.3%
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد البنود
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        8
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التحليل الرأسي */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التحليل الرأسي - النسب المئوية من الإجمالي</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة من الإجمالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة من القاعدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleVerticalAnalysis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.item}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.type === 'أصول' ? 'bg-blue-100 text-blue-700' :
                            item.type === 'التزامات' ? 'bg-red-100 text-red-700' :
                            item.type === 'إيرادات' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.amount.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {item.percentageOfTotal.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-purple-100 text-purple-700">
                            {item.percentageOfBase.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </button>
                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                              <PieChart className="h-3 w-3" />
                            </button>
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

      // ===== تاب 222-24: تقرير الموازنة المقارنة =====
      case '222-24':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير الموازنة المقارنة
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  مقارنة تفصيلية بين الموازنة المعتمدة والفعلي مع التحليل السنوي
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="h-4 w-4 ml-2" />
                  رسم مقارن
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الموازنة الكلية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3.03M ريال
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الفعلي الكلي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3.04M ريال
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الانحراف الكلي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +10K ريال
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة التنفيذ
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        100.3%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        بنود إيجابية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        بنود سلبية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الموازنة المقارنة */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>مقارنة الموازنة مع الفعلي - التقرير السنوي</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموازنة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفعلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الانحراف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>YTD موازنة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>YTD فعلي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>YTD انحراف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBudgetComparison.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.item}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.category === 'الإيرادات' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }>
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.budgeted.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.actual.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={
                            (item.category === 'الإيرادات' && item.variance > 0) || (item.category === 'المصروفات' && item.variance < 0) 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }>
                            {item.variance >= 0 ? '+' : ''}{item.variance.toLocaleString('ar-SA')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            (item.category === 'الإيرادات' && item.variancePercent > 0) || (item.category === 'المصروفات' && item.variancePercent < 0)
                              ? 'bg-green-100 text-green-700'
                              : item.variancePercent === 0
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-700'
                          }>
                            {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.ytdBudget.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.ytdActual.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            (item.category === 'الإيرادات' && item.ytdVariance > 0) || (item.category === 'المصروفات' && item.ytdVariance < 0)
                              ? 'bg-green-100 text-green-700'
                              : item.ytdVariance === 0
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-700'
                          }>
                            {item.ytdVariance >= 0 ? '+' : ''}{item.ytdVariance.toLocaleString('ar-SA')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-25: تقرير المراجعة الداخلية =====
      case '222-25':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير المراجعة الداخلية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تقرير شامل للملاحظات والتوصيات من المراجعة الداخلية
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <FileText className="h-4 w-4 ml-2" />
                  إنشاء تقرير
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قضايا مفتوحة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قيد المعالجة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مغلقة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر عالية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        قضايا عاجلة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        معدل الإنجاز
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        28.6%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول المراجعة الداخلية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات المراجعة الداخلية والتوصيات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>منطقة المراجعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخاطر</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوصية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleInternalAudit.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {audit.auditArea}
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {audit.finding}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            audit.risk === 'عالي' ? 'bg-red-100 text-red-700' :
                            audit.risk === 'متوسط' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {audit.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            audit.status === 'مفتوح' ? 'bg-red-100 text-red-700' :
                            audit.status === 'قيد المعالجة' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {audit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            audit.priority === 'عاجل' ? 'bg-red-100 text-red-700' :
                            audit.priority === 'مهم' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {audit.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {audit.recommendation}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {audit.responsiblePerson}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {audit.dueDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-26: تقرير التكاليف المعيارية =====
      case '222-26':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير التكاليف المعيارية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل مقارن بين التكاليف المعيارية والفعلية مع تحليل الانحرافات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <BarChart3 className="h-4 w-4 ml-2" />
                  رسم الانحرافات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي معياري
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.13M ريال
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي فعلي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.14M ريال
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الانحراف الكلي
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +10K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        انحرافات مناسبة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        انحرافات غير مناسبة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نسبة الانحراف
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +0.9%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التكاليف المعيارية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل التكاليف المعيارية مقابل الفعلية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مركز التكلفة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة المعيارية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة الفعلية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الانحراف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleStandardCost.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {cost.costCenter}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {cost.item}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {cost.standardCost.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {cost.actualCost.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          <span className={cost.variance < 0 ? 'text-green-700' : 'text-red-700'}>
                            {cost.variance >= 0 ? '+' : ''}{cost.variance.toLocaleString('ar-SA')} ريال
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={cost.variance < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {cost.variancePercent >= 0 ? '+' : ''}{cost.variancePercent.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {cost.quantity.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            cost.varianceType === 'مناسب' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }>
                            {cost.varianceType}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-27: تقرير نقطة التعادل =====
      case '222-27':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير تحليل نقطة التعادل (Break-Even Analysis)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل نقطة التعادل للخدمات مع هامش الأمان والمساهمة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <LineChart className="h-4 w-4 ml-2" />
                  رسم التعادل
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي تكاليف ثابتة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        770K ريال
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط هامش المساهمة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        6.4K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط التعادل
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        30 وحدة
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        460K ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط هامش الأمان
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        50.2%
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الخدمات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-indigo-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تحليل نقطة التعادل */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل نقطة التعادل للخدمات الهندسية</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكاليف الثابتة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تكلفة متغيرة/وحدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>سعر البيع/وحدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>هامش المساهمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقطة التعادل (وحدات)</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقطة التعادل (ريال)</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبيعات الحالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>هامش الأمان %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBreakEvenAnalysis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.product}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.fixedCosts.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.variableCostPerUnit.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.sellingPricePerUnit.toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            {item.contributionMargin.toLocaleString('ar-SA')} ريال
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.breakEvenUnits} وحدة
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.breakEvenRevenue.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.currentSales.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {item.safetyMargin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-28: تقرير تحليل الربحية =====
      case '222-28':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير تحليل الربحية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل شامل للربحية حسب المشاريع والخدمات مع العائد على الاستثمار
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <PieChart className="h-4 w-4 ml-2" />
                  رسم الربحية
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي الإيرادات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        2.53M ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي التكاليف
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1.82M ريال
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        صافي الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        715K ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط هامش الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        29.4%
                      </p>
                    </div>
                    <Percent className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط ROI
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        41.9%
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        أكثر مشروع ربحية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        فيلا سكنية
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تحليل الربحية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل الربحية التفصيلي للمشاريع والخدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع/الخدمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإيرادات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكاليف المباشرة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكاليف غير المباشرة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الربح الإجمالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>صافي الربح</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>هامش الربح %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>ROI %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProfitabilityAnalysis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.item}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.revenue.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.directCosts.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.indirectCosts.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {item.grossProfit.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            {item.netProfit.toLocaleString('ar-SA')} ريال
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.profitMargin >= 30 ? 'bg-green-100 text-green-700' :
                            item.profitMargin >= 20 ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {item.profitMargin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.roi >= 40 ? 'bg-green-100 text-green-700' :
                            item.roi >= 30 ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {item.roi.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-29: تقرير المؤشرات المالية الرئيسية (KPIs) =====
      case '222-29':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير المؤشرات المالية الرئيسية (KPIs)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  لوحة شاملة لمؤشرات الأداء المالي الرئيسية مع المقارنات والاتجاهات
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Activity className="h-4 w-4 ml-2" />
                  تحديث المؤشرات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Dashboard
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        KPIs ممتازة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        7
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        KPIs جيدة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط الإنجاز
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        121.5%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        اتجاه صاعد
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        8
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        اتجاه هابط
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إجمالي KPIs
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        10
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-indigo-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول المؤشرات المالية الرئيسية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المؤشرات المالية الرئيسية - تحليل شامل</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المؤشر</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الحالية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة المستهدفة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة السابقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوحدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFinancialKPI.map((kpi) => (
                      <TableRow key={kpi.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {kpi.kpiName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {kpi.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {kpi.currentValue.toFixed(2)} {kpi.unit}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {kpi.targetValue.toFixed(2)} {kpi.unit}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {kpi.previousValue.toFixed(2)} {kpi.unit}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {kpi.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            kpi.trend === 'صاعد' ? 'bg-green-100 text-green-700' :
                            kpi.trend === 'هابط' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {kpi.trend}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            kpi.status === 'ممتاز' ? 'bg-green-100 text-green-700' :
                            kpi.status === 'جيد' ? 'bg-blue-100 text-blue-700' :
                            kpi.status === 'مقبول' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {kpi.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            kpi.achievement >= 115 ? 'bg-green-100 text-green-700' :
                            kpi.achievement >= 100 ? 'bg-blue-100 text-blue-700' :
                            kpi.achievement >= 90 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {kpi.achievement.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-30: تقرير التوقعات المالية =====
      case '222-30':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير التوقعات المالية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  توقعات مستقبلية للأداء المالي مع سيناريوهات متعددة
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <LineChart className="h-4 w-4 ml-2" />
                  رسم التوقعات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4 ml-2" />
                  تقرير مفصل
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        توقع الإيرادات 2026
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        11.5M ريال
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        توقع صافي الربح
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3.95M ريال
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        نمو متوقع
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        +11.5%
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط الثقة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        77.5%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        سيناريوهات
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        3
                      </p>
                    </div>
                    <Layers className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        فترات زمنية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4 أرباع
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-indigo-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول التوقعات المالية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقعات المالية - السيناريوهات المختلفة</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السيناريو</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإيرادات المتوقعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصروفات المتوقعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>صافي الربح المتوقع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التدفق النقدي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الثقة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFinancialForecast.map((forecast) => (
                      <TableRow key={forecast.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {forecast.period}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            forecast.scenario === 'متفائل' ? 'bg-green-100 text-green-700' :
                            forecast.scenario === 'واقعي' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {forecast.scenario}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {forecast.revenue.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {forecast.expenses.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            {forecast.netProfit.toLocaleString('ar-SA')} ريال
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {forecast.cashFlow.toLocaleString('ar-SA')} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            forecast.confidence >= 80 ? 'bg-green-100 text-green-700' :
                            forecast.confidence >= 70 ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {forecast.confidence}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-31: تقرير تحليل المخاطر المالية =====
      case '222-31':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  تقرير تحليل المخاطر المالية
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  تحليل شامل للمخاطر المالية مع التقييم وخطط التخفيف
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Shield className="h-4 w-4 ml-2" />
                  تقييم المخاطر
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-3">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر حرجة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-[#ef4444] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر عالية
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        5
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-[#f59e0b] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر متوسطة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <Info className="h-8 w-8 text-[#2563eb] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر نشطة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        4
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مخاطر محلولة
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        1
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-[#10b981] opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        متوسط نقاط المخاطر
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        26.9
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-pink-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تحليل المخاطر المالية */}
            <Card className="card-rtl">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>مصفوفة المخاطر المالية - التقييم والمعالجة</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخاطرة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاحتمالية %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التأثير %</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نقاط المخاطر</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>خطة التخفيف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleFinancialRisk.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {risk.riskName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700">
                            {risk.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {risk.probability}%
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {risk.impact}%
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            risk.riskScore >= 30 ? 'bg-red-100 text-red-700' :
                            risk.riskScore >= 20 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {risk.riskScore.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            risk.level === 'حرج' ? 'bg-red-100 text-red-700' :
                            risk.level === 'عالي' ? 'bg-yellow-100 text-yellow-700' :
                            risk.level === 'متوسط' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {risk.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {risk.mitigation}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            risk.status === 'نشط' ? 'bg-red-100 text-red-700' :
                            risk.status === 'قيد المراقبة' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {risk.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // ===== تاب 222-32: لوحة القيادة المالية التنفيذية =====
      case '222-32':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  لوحة القيادة المالية التنفيذية (Executive Financial Dashboard)
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  لوحة تنفيذية شاملة للمؤشرات المالية الرئيسية والأداء المالي العام
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#10b981] hover:bg-[#059669] text-white"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث البيانات
                </Button>
                <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة Dashboard
                </Button>
              </div>
            </div>

            {/* البطاقات الرئيسية - 6 مؤشرات تنفيذية */}
            <div className="grid grid-cols-3 gap-4">
              {sampleExecutiveDashboard.map((metric) => (
                <Card key={metric.id} className={`card-rtl bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 border-${metric.color}-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        {metric.metric}
                      </h4>
                      {React.createElement(
                        metric.icon === 'DollarSign' ? DollarSign :
                        metric.icon === 'TrendingUp' ? TrendingUp :
                        metric.icon === 'Percent' ? Percent :
                        metric.icon === 'Wallet' ? Wallet :
                        Building2,
                        { className: `h-8 w-8 text-${metric.color}-600 opacity-80` }
                      )}
                    </div>
                    <p className="text-2xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {metric.value.toLocaleString('ar-SA')} {metric.metric.includes('%') ? '%' : 'ريال'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={metric.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {metric.change >= 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                        </Badge>
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          مقارنة بالفترة السابقة
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        <span>المستهدف: {metric.target.toLocaleString('ar-SA')}</span>
                        <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* الجداول التحليلية */}
            <div className="grid grid-cols-2 gap-4">
              {/* أداء الإيرادات */}
              <Card className="card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إيرادات المبيعات</span>
                      <Badge className="bg-blue-100 text-blue-700">1,850,000 ريال</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إيرادات الخدمات</span>
                      <Badge className="bg-green-100 text-green-700">650,000 ريال</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الإيرادات</span>
                      <Badge className="bg-purple-100 text-purple-700">2,500,000 ريال</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النمو</span>
                      <Badge className="bg-yellow-100 text-yellow-700">+21.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أداء الربحية */}
              <Card className="card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليل الربحية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الربح الإجمالي</span>
                      <Badge className="bg-green-100 text-green-700">1,450,000 ريال</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>صافي الربح</span>
                      <Badge className="bg-blue-100 text-blue-700">820,000 ريال</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>هامش الربح الصافي</span>
                      <Badge className="bg-purple-100 text-purple-700">32.8%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>العائد على الاستثمار</span>
                      <Badge className="bg-pink-100 text-pink-700">32.9%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ملخص تنفيذي شامل */}
            <Card className="card-rtl bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الملخص التنفيذي الشامل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة التداول
                    </p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      2.65
                    </p>
                    <Badge className="bg-green-100 text-green-700 mt-2">ممتاز</Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      السيولة السريعة
                    </p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      1.85
                    </p>
                    <Badge className="bg-green-100 text-green-700 mt-2">ممتاز</Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة المديونية
                    </p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      57.4%
                    </p>
                    <Badge className="bg-blue-100 text-blue-700 mt-2">جيد</Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      دوران الأصول
                    </p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      0.64
                    </p>
                    <Badge className="bg-green-100 text-green-700 mt-2">ممتاز</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // جميع التابات مكتملة - لا placeholder
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
            <div className="p-6 bg-blue-50 rounded-full">
              {currentTab && React.createElement(currentTab.icon, { 
                className: "h-16 w-16 text-[#2563eb]" 
              })}
            </div>
            <h3 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              {currentTab?.title}
            </h3>
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              التاب {currentTab?.number} - سيتم تطويره قريباً
            </p>
            <Badge className="bg-[#2563eb] text-white">
              قيد التطوير
            </Badge>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#2563eb] rounded-lg">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  إدارة المحاسبة والمالية والتقارير
                </h1>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  نظام محاسبي ومالي شامل متكامل مع التقارير التفصيلية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                SCR-222
              </span>
              <Badge className="bg-[#10b981] text-white">32 تبويب</Badge>
              <Badge className="bg-[#2563eb] text-white">نشط</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings className="h-4 w-4 ml-2" />
              إعدادات
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة عامة */}
        <div className="grid grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    إجمالي الأصول
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    3.9M
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-[#10b981] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    إجمالي الخصوم
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    650K
                  </p>
                </div>
                <TrendingDown className="h-10 w-10 text-[#ef4444] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الإيرادات
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    1.2M
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-[#2563eb] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    المصروفات
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    850K
                  </p>
                </div>
                <Receipt className="h-10 w-10 text-[#f59e0b] opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    صافي الربح
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    350K
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-purple-600 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 card-rtl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الرصيد البنكي
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    1.17M
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-pink-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* المحتوى الرئيسي: السايد بار + المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى التابات مع إمكانية التمرير */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          <Card className="flex-1 flex flex-col min-h-0 card-rtl">
            <ScrollArea className="flex-1">
              <CardContent className="p-6">
                {renderTabContent()}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
