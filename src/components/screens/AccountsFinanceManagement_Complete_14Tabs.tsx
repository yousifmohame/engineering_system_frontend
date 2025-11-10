import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { CodeDisplay } from '../CodeDisplay';
import UniversalDenseTabContent, { DenseActionButton, DenseInfoCard, DenseProgressBar, DenseDataTable } from '../UniversalDenseTabContent';
import { 
  Calculator,
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  PieChart,
  BarChart3,
  Banknote,
  Building2,
  Wallet,
  Calculator as CalculatorIcon,
  TrendingDown,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Plus,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
  ChevronRight,
  ChevronLeft,
  Settings,
  Key,
  Activity,
  Network,
  Database,
  Bell,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Target,
  LineChart,
  AreaChart,
  Home,
  Car,
  Plane,
  Coffee,
  Heart,
  BookOpen,
  Headphones,
  Monitor,
  Smartphone,
  Wifi,
  Globe,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  User,
  Users,
  Building,
  Package,
  ShoppingCart,
  Archive,
  Folder,
  FolderOpen,
  Clock,
  Star,
  Flag,
  Tag,
  Link,
  Copy,
  ExternalLink,
  PrinterIcon,
  Send,
  Repeat,
  RotateCcw,
  Zap,
  Shield,
  Crown,
  Gem
} from 'lucide-react';

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
  children?: string[];
}

interface Payment {
  id: string;
  paymentNumber: string;
  accountId: string;
  type: 'دفعة صادرة' | 'تحصيل وارد' | 'تحويل داخلي';
  amount: number;
  currency: string;
  date: string;
  dueDate?: string;
  status: 'مدفوع' | 'معلق' | 'متأخر' | 'ملغي';
  method: 'نقدي' | 'شيك' | 'تحويل بنكي' | 'بطاقة ائتمان';
  description: string;
  reference: string;
  beneficiary: string;
  approvedBy?: string;
  attachments: string[];
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
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

interface FinancialReport {
  id: string;
  reportName: string;
  reportType: 'الميزانية العمومية' | 'قائمة الدخل' | 'قائمة التدفقات النقدية' | 'قائمة حقوق الملكية';
  period: string;
  fromDate: string;
  toDate: string;
  status: 'قيد الإعداد' | 'مكتمل' | 'مراجعة' | 'معتمد';
  generatedBy: string;
  generatedDate: string;
  format: 'PDF' | 'Excel' | 'Word';
  data?: any;
}

interface Budget {
  id: string;
  budgetName: string;
  period: 'سنوي' | 'ربع سنوي' | 'شهري';
  year: number;
  quarter?: number;
  month?: number;
  status: 'مسودة' | 'معتمد' | 'نشط' | 'مغلق';
  totalBudget: number;
  actualSpent: number;
  variance: number;
  approvedBy?: string;
  items: BudgetItem[];
}

interface BudgetItem {
  id: string;
  accountId: string;
  accountName: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'فاتورة مبيعات' | 'فاتورة مشتريات' | 'فاتورة خدمات';
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: 'مسودة' | 'مرسلة' | 'مدفوعة جزئياً' | 'مدفوعة' | 'متأخرة' | 'ملغاة';
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
  totalPrice: number;
}

interface Expense {
  id: string;
  expenseNumber: string;
  type: 'مصروف تشغيلي' | 'مصروف رأسمالي' | 'مصروف إداري' | 'مصروف تسويقي';
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'معلق' | 'معتمد' | 'مدفوع' | 'مرفوض';
  requestedBy: string;
  approvedBy?: string;
  description: string;
  receipts: string[];
  accountId: string;
}

interface TaxRecord {
  id: string;
  taxType: 'ضريبة القيمة المضافة' | 'ضريبة الدخل' | 'الزكاة' | 'رسوم حكومية';
  period: string;
  amount: number;
  status: 'مستحق' | 'مدفوع' | 'متأخر';
  dueDate: string;
  paidDate?: string;
  reference: string;
  description: string;
  filingStatus: 'لم يُقدم' | 'مُقدم' | 'مراجع' | 'معتمد';
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: 'جاري' | 'توفير' | 'وديعة';
  currency: string;
  balance: number;
  availableBalance: number;
  status: 'نشط' | 'معلق' | 'مغلق';
  iban: string;
  swiftCode: string;
  branchName: string;
  managerId: string;
  lastSyncDate: string;
}

interface BankReconciliation {
  id: string;
  bankAccountId: string;
  periodFrom: string;
  periodTo: string;
  bookBalance: number;
  bankBalance: number;
  difference: number;
  status: 'قيد المراجعة' | 'مطابق' | 'غير مطابق' | 'معتمد';
  reconciledBy?: string;
  reconciledDate?: string;
  items: ReconciliationItem[];
}

interface ReconciliationItem {
  id: string;
  type: 'إيداع عالق' | 'شيك معلق' | 'رسوم بنكية' | 'فوائد' | 'خطأ بالدفاتر';
  amount: number;
  description: string;
  status: 'معلق' | 'مطابق' | 'مرفوض';
}

interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  category: 'أصول ثابتة' | 'أصول متداولة' | 'أصول غير ملموسة';
  type: 'مباني' | 'معدات' | 'أثاث' | 'سيارات' | 'أجهزة' | 'برمجيات' | 'أخرى';
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'القسط الثابت' | 'الرصيد المتناقص' | 'وحدات الإنتاج';
  depreciationRate: number;
  accumulatedDepreciation: number;
  location: string;
  condition: 'ممتاز' | 'جيد' | 'متوسط' | 'ضعيف';
  status: 'في الخدمة' | 'خارج الخدمة' | 'للبيع' | 'مباع';
}

interface Liability {
  id: string;
  liabilityCode: string;
  liabilityName: string;
  type: 'التزامات متداولة' | 'التزامات طويلة الأجل';
  category: 'قروض' | 'حسابات دائنة' | 'مخصصات' | 'التزامات أخرى';
  amount: number;
  currency: string;
  startDate: string;
  maturityDate?: string;
  interestRate?: number;
  status: 'نشط' | 'مسدد' | 'منتهي الصلاحية';
  description: string;
  creditor: string;
  paymentSchedule?: string;
}

interface FinancialAnalysis {
  id: string;
  analysisType: 'تحليل الربحية' | 'تحليل السيولة' | 'تحليل الكفاءة' | 'تحليل الرافعة المالية';
  period: string;
  ratios: FinancialRatio[];
  trends: TrendData[];
  insights: string[];
  recommendations: string[];
}

interface FinancialRatio {
  name: string;
  value: number;
  benchmark: number;
  status: 'جيد' | 'متوسط' | 'ضعيف';
  description: string;
}

interface TrendData {
  period: string;
  value: number;
  change: number;
  changePercent: number;
}

export default function AccountsFinanceManagement_Complete_14Tabs() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // بيانات وهمية للحسابات
  const accountsData: Account[] = [
    {
      id: '1',
      accountNumber: '1000',
      accountName: 'النقدية في الصندوق',
      accountType: 'أصول',
      balance: 50000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'النقدية المتوفرة في صندوق المكتب',
      createdDate: '2025-01-01',
      lastTransaction: '2025-09-23',
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
      lastTransaction: '2025-09-22',
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
      lastTransaction: '2025-09-20',
      level: 1,
      isParent: true,
      children: ['3a', '3b']
    },
    {
      id: '4',
      accountNumber: '2000',
      accountName: 'الموردين - حسابات دائنة',
      accountType: 'خصوم',
      balance: -150000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'مستحقات للموردين والمقاولين',
      createdDate: '2025-01-01',
      lastTransaction: '2025-09-21',
      level: 1,
      isParent: false
    },
    {
      id: '5',
      accountNumber: '4000',
      accountName: 'إيرادات الاستشارات الهندسية',
      accountType: 'إيرادات',
      balance: -890000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'إيرادات الخدمات الاستشارية والتصميم',
      createdDate: '2025-01-01',
      lastTransaction: '2025-09-23',
      level: 1,
      isParent: false
    },
    {
      id: '6',
      accountNumber: '5000',
      accountName: 'مصروفات التشغيل',
      accountType: 'مصروفات',
      balance: 180000,
      currency: 'ريال سعودي',
      status: 'نشط',
      description: 'المصروفات التشغيلية للمكتب',
      createdDate: '2025-01-01',
      lastTransaction: '2025-09-22',
      level: 1,
      isParent: true,
      children: ['6a', '6b', '6c']
    }
  ];

  // بيانات وهمية للدفعات
  const paymentsData: Payment[] = [
    {
      id: '1',
      paymentNumber: 'PAY-2025-001',
      accountId: '2',
      type: 'تحصيل وارد',
      amount: 75000,
      currency: 'ريال سعودي',
      date: '2025-09-23',
      status: 'مدفوع',
      method: 'تحويل بنكي',
      description: 'تحصيل أتعاب مشروع المجمع السكني',
      reference: 'INV-2025-015',
      beneficiary: 'شركة التطوير العقاري المتقدمة',
      approvedBy: 'م. أحمد العلي',
      attachments: ['receipt.pdf', 'bank_statement.pdf']
    },
    {
      id: '2',
      paymentNumber: 'PAY-2025-002',
      accountId: '4',
      type: 'دفعة صادرة',
      amount: 25000,
      currency: 'ريال سعودي',
      date: '2025-09-22',
      status: 'معلق',
      method: 'شيك',
      description: 'دفع مستحقات المقاول الفرعي',
      reference: 'PO-2025-008',
      beneficiary: 'مؤسسة البناء المتطور',
      attachments: ['contract.pdf']
    }
  ];

  // بيانات وهمية للقيود اليومية
  const journalEntriesData: JournalEntry[] = [
    {
      id: '1',
      entryNumber: 'JE-2025-001',
      date: '2025-09-23',
      type: 'قيد يدوي',
      description: 'تسجيل إيرادات مشروع المجمع السكني',
      totalDebit: 75000,
      totalCredit: 75000,
      status: 'معتمد',
      createdBy: 'محاسب النظام',
      approvedBy: 'م. أحمد العلي',
      reference: 'INV-2025-015',
      lines: [
        {
          id: '1a',
          accountId: '2',
          accountName: 'البنك الأهلي السعودي - الحساب الجاري',
          debit: 75000,
          credit: 0,
          description: 'تحصيل نقدي'
        },
        {
          id: '1b',
          accountId: '5',
          accountName: 'إيرادات الاستشارات الهندسية',
          debit: 0,
          credit: 75000,
          description: 'إيرادات مشروع'
        }
      ]
    },
    {
      id: '2',
      entryNumber: 'JE-2025-002',
      date: '2025-09-22',
      type: 'قيد تلقائي',
      description: 'تسجيل مصروفات الكهرباء',
      totalDebit: 3500,
      totalCredit: 3500,
      status: 'مرحّل',
      createdBy: 'النظام التلقائي',
      lines: [
        {
          id: '2a',
          accountId: '6',
          accountName: 'مصروفات التشغيل',
          debit: 3500,
          credit: 0,
          description: 'فاتورة كهرباء سبتمبر'
        },
        {
          id: '2b',
          accountId: '2',
          accountName: 'البنك الأهلي السعودي - الحساب الجاري',
          debit: 0,
          credit: 3500,
          description: 'دفع تلقائي'
        }
      ]
    }
  ];

  // بيانات وهمية للتقارير المالية
  const reportsData: FinancialReport[] = [
    {
      id: '1',
      reportName: 'الميزانية العمومية - سبتمبر 2025',
      reportType: 'الميزانية العمومية',
      period: 'شهري',
      fromDate: '2025-09-01',
      toDate: '2025-09-30',
      status: 'معتمد',
      generatedBy: 'محاسب النظام',
      generatedDate: '2025-09-30',
      format: 'PDF'
    },
    {
      id: '2',
      reportName: 'قائمة الدخل - الربع الثالث 2025',
      reportType: 'قائمة الدخل',
      period: 'ربع سنوي',
      fromDate: '2025-07-01',
      toDate: '2025-09-30',
      status: 'مكتمل',
      generatedBy: 'محاسب النظام',
      generatedDate: '2025-09-30',
      format: 'Excel'
    }
  ];

  // بيانات وهمية للميزانيات
  const budgetsData: Budget[] = [
    {
      id: '1',
      budgetName: 'ميزانية التشغيل 2025',
      period: 'سنوي',
      year: 2025,
      status: 'نشط',
      totalBudget: 500000,
      actualSpent: 180000,
      variance: -320000,
      approvedBy: 'الإدارة العليا',
      items: [
        {
          id: '1a',
          accountId: '6',
          accountName: 'مصروفات التشغيل',
          budgetedAmount: 200000,
          actualAmount: 180000,
          variance: -20000,
          variancePercent: -10
        }
      ]
    }
  ];

  // بيانات وهمية للفواتير
  const invoicesData: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-015',
      type: 'فاتورة مبيعات',
      clientId: 'CLI-001',
      clientName: 'شركة التطوير العقاري المتقدمة',
      date: '2025-09-20',
      dueDate: '2025-10-20',
      status: 'مدفوعة',
      subtotal: 75000,
      vatAmount: 11250,
      totalAmount: 86250,
      paidAmount: 86250,
      remainingAmount: 0,
      currency: 'ريال سعودي',
      paymentTerms: '30 يوم',
      description: 'أتعاب التصميم المعماري - المجمع السكني',
      items: [
        {
          id: '1a',
          description: 'تصميم معماري شامل',
          quantity: 1,
          unitPrice: 75000,
          vatRate: 15,
          totalPrice: 86250
        }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-016',
      type: 'فاتورة مبيعات',
      clientId: 'CLI-002',
      clientName: 'مجموعة الاستثمار التجاري',
      date: '2025-09-22',
      dueDate: '2025-10-22',
      status: 'مرسلة',
      subtotal: 120000,
      vatAmount: 18000,
      totalAmount: 138000,
      paidAmount: 0,
      remainingAmount: 138000,
      currency: 'ريال سعودي',
      paymentTerms: '30 يوم',
      description: 'أتعاب الإشراف الهندسي - المركز التجاري',
      items: [
        {
          id: '2a',
          description: 'إشراف هندسي شامل',
          quantity: 1,
          unitPrice: 120000,
          vatRate: 15,
          totalPrice: 138000
        }
      ]
    }
  ];

  // بيانات وهمية للمصروفات
  const expensesData: Expense[] = [
    {
      id: '1',
      expenseNumber: 'EXP-2025-001',
      type: 'مصروف تشغيلي',
      category: 'مرافق',
      amount: 3500,
      currency: 'ريال سعودي',
      date: '2025-09-22',
      status: 'مدفوع',
      requestedBy: 'إدارة المكتب',
      approvedBy: 'م. أحمد العلي',
      description: 'فاتورة كهرباء شهر سبتمبر',
      receipts: ['electricity_bill.pdf'],
      accountId: '6'
    },
    {
      id: '2',
      expenseNumber: 'EXP-2025-002',
      type: 'مصروف إداري',
      category: 'قرطاسية',
      amount: 1200,
      currency: 'ريال سعودي',
      date: '2025-09-21',
      status: 'معتمد',
      requestedBy: 'السكرتارية',
      approvedBy: 'مدير الإدارة',
      description: 'مستلزمات مكتبية متنوعة',
      receipts: ['office_supplies.pdf'],
      accountId: '6'
    }
  ];

  // بيانات وهمية للضرائب
  const taxesData: TaxRecord[] = [
    {
      id: '1',
      taxType: 'ضريبة القيمة المضافة',
      period: 'سبتمبر 2025',
      amount: 15750,
      status: 'مستحق',
      dueDate: '2025-10-15',
      reference: 'VAT-2025-09',
      description: 'ضريبة القيمة المضافة عن شهر سبتمبر',
      filingStatus: 'لم يُقدم'
    },
    {
      id: '2',
      taxType: 'الزكاة',
      period: '2024',
      amount: 45000,
      status: 'مدفوع',
      dueDate: '2025-04-30',
      paidDate: '2025-04-25',
      reference: 'ZAK-2024',
      description: 'زكاة الشركات عن العام 2024',
      filingStatus: 'معتمد'
    }
  ];

  // بيانات وهمية للحسابات البنكية
  const bankAccountsData: BankAccount[] = [
    {
      id: '1',
      bankName: 'البنك الأهلي السعودي',
      accountNumber: '123456789',
      accountName: 'شركة الهندسة المتقدمة',
      accountType: 'جاري',
      currency: 'ريال سعودي',
      balance: 850000,
      availableBalance: 845000,
      status: 'نشط',
      iban: 'SA1234567890123456789012',
      swiftCode: 'NCBKSARI',
      branchName: 'فرع الملك فهد',
      managerId: 'مدير الحسابات',
      lastSyncDate: '2025-09-23'
    },
    {
      id: '2',
      bankName: 'مصرف الراجحي',
      accountNumber: '987654321',
      accountName: 'شركة الهندسة المتقدمة - التوفير',
      accountType: 'توفير',
      currency: 'ريال سعودي',
      balance: 250000,
      availableBalance: 250000,
      status: 'نشط',
      iban: 'SA9876543210987654321098',
      swiftCode: 'RJHISARI',
      branchName: 'فرع العليا',
      managerId: 'مدير الاستثمار',
      lastSyncDate: '2025-09-22'
    }
  ];

  // بيانات وهمية للأصول
  const assetsData: Asset[] = [
    {
      id: '1',
      assetCode: 'AST-001',
      assetName: 'مبنى المكتب الرئيسي',
      category: 'أصول ثابتة',
      type: 'مباني',
      purchaseDate: '2020-01-15',
      purchasePrice: 2000000,
      currentValue: 1800000,
      depreciationMethod: 'القسط الثابت',
      depreciationRate: 2.5,
      accumulatedDepreciation: 200000,
      location: 'الرياض - حي الملقا',
      condition: 'ممتاز',
      status: 'في الخدمة'
    },
    {
      id: '2',
      assetCode: 'AST-002',
      assetName: 'سيارات الشركة',
      category: 'أصول ثابتة',
      type: 'سيارات',
      purchaseDate: '2023-06-01',
      purchasePrice: 180000,
      currentValue: 135000,
      depreciationMethod: 'الرصيد المتناقص',
      depreciationRate: 25,
      accumulatedDepreciation: 45000,
      location: 'موقف المكتب',
      condition: 'جيد',
      status: 'في الخدمة'
    }
  ];

  // بيانات وهمية للخصوم
  const liabilitiesData: Liability[] = [
    {
      id: '1',
      liabilityCode: 'LIB-001',
      liabilityName: 'قرض المعدات الهندسية',
      type: 'التزامات طويلة الأجل',
      category: 'قروض',
      amount: 500000,
      currency: 'ريال سعودي',
      startDate: '2024-01-01',
      maturityDate: '2027-12-31',
      interestRate: 5.5,
      status: 'نشط',
      description: 'قرض لشراء معدات المسح والتصميم',
      creditor: 'بنك التنمية الاجتماعية',
      paymentSchedule: 'أقساط شهرية'
    },
    {
      id: '2',
      liabilityCode: 'LIB-002',
      liabilityName: 'مستحقات الموظفين',
      type: 'التزامات متداولة',
      category: 'مخصصات',
      amount: 85000,
      currency: 'ريال سعودي',
      startDate: '2025-09-01',
      status: 'نشط',
      description: 'رواتب ومكافآت الموظفين المستحقة',
      creditor: 'الموظفين'
    }
  ];

  // الحساب المحدد
  const selectedAccount = accountsData.find(acc => acc.id === selectedAccountId) || accountsData[0];

  // دالة تصفية الحسابات
  const filteredAccounts = accountsData.filter(account => {
    const matchesSearch = account.accountName.includes(searchQuery) || 
                         account.accountNumber.includes(searchQuery);
    const matchesType = filterType === 'الكل' || account.accountType === filterType;
    const matchesStatus = filterStatus === 'الكل' || account.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'مدفوع':
      case 'معتمد':
      case 'مرحّل':
      case 'مكتمل':
      case 'مطابق':
      case 'في الخدمة':
        return 'bg-green-100 text-green-800';
      case 'معلق':
      case 'قيد الإعداد':
      case 'قيد المراجعة':
      case 'مسودة':
      case 'مرسلة':
      case 'مستحق':
        return 'bg-yellow-100 text-yellow-800';
      case 'مغلق':
      case 'ملغي':
      case 'ملغاة':
      case 'مرفوض':
      case 'غير مطابق':
      case 'خارج الخدمة':
        return 'bg-red-100 text-red-800';
      case 'متأخر':
      case 'متأخرة':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // دالة الحصول على لون نوع الحساب
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'أصول':
        return 'bg-blue-100 text-blue-800';
      case 'خصوم':
        return 'bg-red-100 text-red-800';
      case 'حقوق الملكية':
        return 'bg-purple-100 text-purple-800';
      case 'إيرادات':
        return 'bg-green-100 text-green-800';
      case 'مصروفات':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // دالة تنسيق الأرقام
  const formatCurrency = (amount: number, currency: string = 'ريال سعودي') => {
    const formatted = Math.abs(amount).toLocaleString('ar-SA');
    const sign = amount < 0 ? '-' : '';
    const currencySymbol = currency === 'ريال سعودي' ? 'ر.س' : 
                          currency === 'دولار أمريكي' ? '$' : '€';
    return `${sign}${formatted} ${currencySymbol}`;
  };

  // دالة اختيار الأيقونة حسب نوع الحساب
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'أصول':
        return <Building className="h-5 w-5 text-blue-600" />;
      case 'خصوم':
        return <CreditCard className="h-5 w-5 text-red-600" />;
      case 'حقوق الملكية':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'إيرادات':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'مصروفات':
        return <TrendingDown className="h-5 w-5 text-orange-600" />;
      default:
        return <Calculator className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 relative" dir="rtl">
      <CodeDisplay code="SCR-ACCOUNTS-005" position="top-right" />
      
      {/* Header الشاشة */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الحسابات والمالية الشاملة
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام متكامل لإدارة الحسابات والعمليات المالية مع 14 تبويب متخصص وميزات احترافية
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              SCR-ACCOUNTS-005
            </Badge>
            <Badge className="bg-green-100 text-green-700 px-3 py-1">
              14 تبويب
            </Badge>
          </div>
        </div>
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(accountsData.filter(a => a.accountType === 'أصول').reduce((sum, a) => sum + a.balance, 0))}
            </div>
            <div className="text-sm text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي الأصول
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {invoicesData.filter(i => i.status === 'مدفوعة').length}
            </div>
            <div className="text-sm text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              فواتير مدفوعة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">
              {journalEntriesData.filter(j => j.status === 'معتمد').length}
            </div>
            <div className="text-sm text-purple-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قيود معتمدة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">
              {filteredAccounts.length}
            </div>
            <div className="text-sm text-orange-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي الحسابات
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات في شبكة أفقية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl-support">
        <div className="tabs-grid-container">
          {/* التبويب 1: قائمة الحسابات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                قائمة الحسابات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-LIST-001</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب قائمة الحسابات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 2: تفاصيل الحساب */}
          <div 
            className={`tabs-grid-item ${activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفاصيل الحساب
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-DETAIL-002</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب تفاصيل الحساب');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 3: الدفعات والتحصيلات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الدفعات والتحصيلات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-PAYMENTS-003</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الدفعات والتحصيلات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 4: القيود اليومية */}
          <div 
            className={`tabs-grid-item ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                القيود اليومية
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-JOURNAL-004</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب القيود اليومية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 5: التقارير المالية */}
          <div 
            className={`tabs-grid-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التقارير المالية
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-REPORTS-005</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب التقارير المالية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 6: الميزانية والتخطيط */}
          <div 
            className={`tabs-grid-item ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الميزانية والتخطيط
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-BUDGET-006</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الميزانية والتخطيط');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 7: الفواتير والمطالبات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الفواتير والمطالبات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-INVOICES-007</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الفواتير والمطالبات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 8: المصروفات والنفقات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                المصروفات والنفقات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-EXPENSES-008</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب المصروفات والنفقات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 9: الضرائب والزكاة */}
          <div 
            className={`tabs-grid-item ${activeTab === 'taxes' ? 'active' : ''}`}
            onClick={() => setActiveTab('taxes')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الضرائب والزكاة
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-TAXES-009</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الضرائب والزكاة');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 10: الحسابات البنكية */}
          <div 
            className={`tabs-grid-item ${activeTab === 'banks' ? 'active' : ''}`}
            onClick={() => setActiveTab('banks')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الحسابات البنكية
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-BANKS-010</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الحسابات البنكية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 11: المطابقة البنكية */}
          <div 
            className={`tabs-grid-item ${activeTab === 'reconcile' ? 'active' : ''}`}
            onClick={() => setActiveTab('reconcile')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                المطابقة البنكية
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-RECONCILE-011</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب المطابقة البنكية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 12: الأصول والممتلكات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الأصول والممتلكات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-ASSETS-012</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الأصول والممتلكات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 13: الخصوم والالتزامات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'liabilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('liabilities')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الخصوم والالتزامات
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-LIABILITIES-013</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الخصوم والالتزامات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 14: التحليل المالي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التحليل المالي
              </span>
            </div>
            <div className="tab-code-display">TAB-ACC-ANALYSIS-014</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب التحليل المالي');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <div className="mt-6">
          {/* التبويب 1: قائمة الحسابات */}
          <TabsContent value="list" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-ACC-LIST-001" position="top-right" />
              
              {/* أدوات البحث والتصفية */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <Label htmlFor="search">البحث في الحسابات</Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        className="input-field pr-10"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                        placeholder="اسم الحساب أو الرقم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor="filterType">تصفية بالنوع</Label>
                    <div className="select-rtl">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="input-field select-trigger">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">جميع الأنواع</SelectItem>
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
                    <Label htmlFor="filterStatus">تصفية بالحالة</Label>
                    <div className="select-rtl">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="input-field select-trigger">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">جميع الحالات</SelectItem>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="معلق">معلق</SelectItem>
                          <SelectItem value="مغلق">مغلق</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label>&nbsp;</Label>
                    <Button className="w-full btn-primary button-rtl">
                      <Plus className="h-4 w-4" />
                      إضافة حساب جديد
                    </Button>
                  </div>
                </div>
              </div>

              {/* جدول الحسابات */}
              <Card className="card-element card-rtl">
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            رقم الحساب
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اسم الحساب
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            النوع
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الرصيد
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            العملة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            آخر معاملة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.map((account) => (
                          <TableRow 
                            key={account.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedAccountId(account.id)}
                          >
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                {getAccountIcon(account.accountType)}
                                <Badge variant="outline" className="font-mono">
                                  {account.accountNumber}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <div>
                                <div className="font-medium">{account.accountName}</div>
                                {account.description && (
                                  <div className="text-sm text-gray-500 line-clamp-1">{account.description}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getAccountTypeColor(account.accountType)}>
                                {account.accountType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              <span className={account.balance < 0 ? 'text-red-600' : 'text-green-600'}>
                                {formatCurrency(account.balance, account.currency)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {account.currency}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(account.status)}>
                                {account.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {new Date(account.lastTransaction).toLocaleDateString('ar-SA')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* التبويب 2: تفاصيل الحساب */}
          <TabsContent value="detail" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-ACC-DETAIL-002" position="top-right" />
              
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تفاصيل الحساب: {selectedAccount.accountName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="accountNumber">رقم الحساب</Label>
                          <Input
                            id="accountNumber"
                            className="input-field"
                            value={selectedAccount.accountNumber}
                            readOnly
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="accountName">اسم الحساب</Label>
                          <Input
                            id="accountName"
                            className="input-field"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                            value={selectedAccount.accountName}
                            readOnly
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="accountType">نوع الحساب</Label>
                          <Input
                            id="accountType"
                            className="input-field"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                            value={selectedAccount.accountType}
                            readOnly
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="balance">الرصيد الحالي</Label>
                          <Input
                            id="balance"
                            className="input-field"
                            value={formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="currency">العملة</Label>
                          <Input
                            id="currency"
                            className="input-field"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                            value={selectedAccount.currency}
                            readOnly
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="status">الحالة</Label>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(selectedAccount.status)}>
                              {selectedAccount.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="createdDate">تاريخ الإنشاء</Label>
                          <Input
                            id="createdDate"
                            type="date"
                            className="input-field"
                            value={selectedAccount.createdDate}
                            readOnly
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="lastTransaction">آخر معاملة</Label>
                          <Input
                            id="lastTransaction"
                            type="date"
                            className="input-field"
                            value={selectedAccount.lastTransaction}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="form-group">
                      <Label htmlFor="description">وصف الحساب</Label>
                      <Textarea
                        id="description"
                        className="textarea-field"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                        value={selectedAccount.description}
                        readOnly
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" className="button-rtl">
                        <Edit className="h-4 w-4" />
                        تعديل
                      </Button>
                      <Button className="btn-primary button-rtl">
                        <Save className="h-4 w-4" />
                        حفظ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* التبويب 3: الدفعات والتحصيلات */}
          <TabsContent value="payments" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-ACC-PAYMENTS-003" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الدفعات والتحصيلات
                </h3>
                <Button className="btn-primary button-rtl">
                  <Plus className="h-4 w-4" />
                  إضافة دفعة جديدة
                </Button>
              </div>

              <Card className="card-element card-rtl">
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الدفعة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستفيد</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentsData.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <Badge variant="outline" className="font-mono">
                                {payment.paymentNumber}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge className={payment.type === 'تحصيل وارد' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                {payment.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              <span className={payment.type === 'تحصيل وارد' ? 'text-green-600' : 'text-blue-600'}>
                                {formatCurrency(payment.amount, payment.currency)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {payment.method}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {payment.beneficiary}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {new Date(payment.date).toLocaleDateString('ar-SA')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <PrinterIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* التبويب 7: الفواتير والمطالبات */}
          <TabsContent value="invoices" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-ACC-INVOICES-007" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفواتير والمطالبات
                </h3>
                <Button className="btn-primary button-rtl">
                  <Plus className="h-4 w-4" />
                  إنشاء فاتورة جديدة
                </Button>
              </div>

              <Card className="card-element card-rtl">
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ الإجمالي</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ المدفوع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاستحقاق</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoicesData.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <Badge variant="outline" className="font-mono">
                                {invoice.invoiceNumber}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {invoice.clientName}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <Badge variant="outline">
                                {invoice.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(invoice.totalAmount, invoice.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-green-600">
                              {formatCurrency(invoice.paidAmount, invoice.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-orange-600">
                              {formatCurrency(invoice.remainingAmount, invoice.currency)}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Send className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <PrinterIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* باقي التبويبات - placeholder للمحتوى */}
          {['journal', 'reports', 'budget', 'expenses', 'taxes', 'banks', 'reconcile', 'assets', 'liabilities', 'analysis'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="space-y-4">
                <CodeDisplay code={`TAB-ACC-${tab.toUpperCase()}-${
                  ['journal', 'reports', 'budget', 'expenses', 'taxes', 'banks', 'reconcile', 'assets', 'liabilities', 'analysis']
                  .indexOf(tab) + 4
                }`.padEnd(18, '0')} position="top-right" />
                
                <Card className="card-element card-rtl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {tab === 'journal' && <BookOpen className="h-8 w-8 text-gray-400" />}
                      {tab === 'reports' && <BarChart3 className="h-8 w-8 text-gray-400" />}
                      {tab === 'budget' && <Target className="h-8 w-8 text-gray-400" />}
                      {tab === 'expenses' && <ShoppingCart className="h-8 w-8 text-gray-400" />}
                      {tab === 'taxes' && <Building2 className="h-8 w-8 text-gray-400" />}
                      {tab === 'banks' && <Banknote className="h-8 w-8 text-gray-400" />}
                      {tab === 'reconcile' && <CheckCircle className="h-8 w-8 text-gray-400" />}
                      {tab === 'assets' && <Building className="h-8 w-8 text-gray-400" />}
                      {tab === 'liabilities' && <CreditCard className="h-8 w-8 text-gray-400" />}
                      {tab === 'analysis' && <PieChart className="h-8 w-8 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tab === 'journal' && 'القيود اليومية'}
                      {tab === 'reports' && 'التقارير المالية'}
                      {tab === 'budget' && 'الميزانية والتخطيط'}
                      {tab === 'expenses' && 'المصروفات والنفقات'}
                      {tab === 'taxes' && 'الضرائب والزكاة'}
                      {tab === 'banks' && 'الحسابات البنكية'}
                      {tab === 'reconcile' && 'المطابقة البنكية'}
                      {tab === 'assets' && 'الأصول والممتلكات'}
                      {tab === 'liabilities' && 'الخصوم والالتزامات'}
                      {tab === 'analysis' && 'التحليل المالي'}
                    </h3>
                    <p className="text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      هذا التبويب قيد التطوير ضمن شاشة الحسابات والمالية الشاملة
                    </p>
                    <Button className="btn-primary button-rtl">
                      <Plus className="h-4 w-4" />
                      ابدأ الآن
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}