/**
 * Screen 285 - Transactions Log v10.0 - Real Data Backend Integration
 * ===========================================================
 * ✅ Fully integrated with Backend API (getAllTransactions)
 * ✅ Preserves exact UI/UX of the mock version
 * ✅ Real-time data transformation for charts and stats
 * ✅ Real-time data fetching and updates
 */
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, CheckCircle, XCircle, Clock, Users, Building,
  TrendingUp, BarChart3, Calendar, Filter, Download, Eye,
  Activity, Settings, ChevronDown, ChevronRight, Search,
  MapPin, Star, DollarSign, Hash, Briefcase, Home, Loader2
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { ScrollArea } from '../ui/scroll-area';

// --- Import API & Types ---
import { getAllTransactions } from '../../api/transactionApi';
import { Transaction as ApiTransaction } from '../../types/transactionTypes';

// --- Tabs Configuration ---
const TABS_CONFIG: TabConfig[] = [
  { id: '285-01', number: '285-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '285-02', number: '285-02', title: 'المعاملات النشطة', icon: Activity },
  { id: '285-03', number: '285-03', title: 'المعاملات المنتهية', icon: CheckCircle },
  { id: '285-04', number: '285-04', title: 'المعاملات الملغاة', icon: XCircle },
  { id: '285-05', number: '285-05', title: 'تحت المعالجة', icon: Clock },
  { id: '285-06', number: '285-06', title: 'حسب التصنيف', icon: FileText },
  { id: '285-07', number: '285-07', title: 'حسب العميل', icon: Users },
  { id: '285-08', number: '285-08', title: 'حسب السنة', icon: Calendar },
  { id: '285-09', number: '285-09', title: 'تحليلات', icon: TrendingUp },
  { id: '285-10', number: '285-10', title: 'الإعدادات', icon: Settings }
];

// --- Extended Interface for UI Logic ---
interface DashboardTransaction extends ApiTransaction {
  clientName: string;
  typeName: string;
  year: number;
  month: number;
  displayDate: string;
  category: string; // Extracted from template or defaults to 'General'
}

const TransactionsLog_Complete_285_v10: React.FC = () => {
  const [activeTab, setActiveTab] = useState('285-01');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 1. Fetch Real Data from Backend
  const { data: rawTransactions, isLoading, isError, refetch } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: getAllTransactions,
    refetchInterval: autoRefresh ? 60000 : false, // Refresh every 60s if enabled
  });

  // 2. Transform Data for UI (Memoized)
  const transactions: DashboardTransaction[] = useMemo(() => {
    if (!rawTransactions) return [];

    return rawTransactions.map(t => {
      const date = new Date(t.createdAt);
      
      // Handle Client Name Safely (JSON or String)
      let clientName = 'غير محدد';
      if (t.client?.name) {
        if (typeof t.client.name === 'string') {
            clientName = t.client.name;
        } else if (t.client.name.firstName) {
            clientName = `${t.client.name.firstName} ${t.client.name.familyName}`;
        }
      }

      return {
        ...t,
        clientName: clientName,
        typeName: t.transactionType?.name || 'عام',
        // Use categoryAr from template, or the transaction's own category, or default
        category: t.transactionType?.categoryAr || t.category || 'عام',
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        displayDate: date.toLocaleDateString('ar-SA'),
        progress: t.progress || 0,
        totalFees: t.totalFees || 0
      };
    });
  }, [rawTransactions]);

  // --- Filtering Logic ---
  const activeTransactions = transactions.filter(t => ['active', 'Draft', 'In Progress', 'Under Review'].includes(t.status));
  const completedTransactions = transactions.filter(t => ['completed', 'Completed', 'Approved'].includes(t.status));
  const cancelledTransactions = transactions.filter(t => ['cancelled', 'Cancelled', 'Rejected'].includes(t.status));
  const pendingTransactions = transactions.filter(t => ['pending', 'Pending', 'Draft'].includes(t.status));
  const underReviewTransactions = transactions.filter(t => ['under review', 'Under Review'].includes(t.status));

  const getTransactionsByYear = (year: number) => transactions.filter(t => t.year === year);
  const getTransactionsByMonth = (year: number, month: number) => transactions.filter(t => t.year === year && t.month === month);
  const getTransactionsByCategory = (category: string) => transactions.filter(t => t.category === category);
  const getTransactionsByClient = (clientName: string) => transactions.filter(t => t.clientName === clientName);

  // Unique Lists
  const uniqueClients = useMemo(() => Array.from(new Set(transactions.map(t => t.clientName))).sort(), [transactions]);
  const uniqueCategories = useMemo(() => Array.from(new Set(transactions.map(t => t.category))).sort(), [transactions]);
  const years = useMemo(() => Array.from(new Set(transactions.map(t => t.year))).sort((a, b) => b - a), [transactions]);

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // --- UI Helpers ---
  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'in progress', 'running'].includes(lowerStatus)) return <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-5">نشطة</Badge>;
    if (['completed', 'approved', 'finished'].includes(lowerStatus)) return <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">مكتملة</Badge>;
    if (['cancelled', 'rejected'].includes(lowerStatus)) return <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">ملغاة</Badge>;
    if (['pending', 'draft'].includes(lowerStatus)) return <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">معلقة</Badge>;
    if (['under review', 'review'].includes(lowerStatus)) return <Badge className="bg-purple-500 text-white text-xs px-1.5 py-0 h-5">مراجعة</Badge>;
    return <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">{status}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, string> = {
      'سكني': 'bg-blue-500',
      'تجاري': 'bg-green-500',
      'صناعي': 'bg-orange-500',
      'إداري': 'bg-purple-500',
      'تراخيص': 'bg-teal-500',
      'عام': 'bg-gray-500'
    };
    const color = categoryMap[category] || 'bg-gray-500';
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${color} text-white`}>{category}</Badge>;
  };

  // --- Reusable Table Renderer ---
  const renderTransactionsTable = (data: DashboardTransaction[]) => (
    <Table className="table-rtl dense-table">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right text-xs font-bold">رقم المعاملة</TableHead>
          <TableHead className="text-right text-xs font-bold">العميل</TableHead>
          <TableHead className="text-right text-xs font-bold">التصنيف</TableHead>
          <TableHead className="text-right text-xs font-bold">النوع</TableHead>
          <TableHead className="text-right text-xs font-bold">الحالة</TableHead>
          <TableHead className="text-right text-xs font-bold">التاريخ</TableHead>
          <TableHead className="text-right text-xs font-bold">الإنجاز</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map(t => (
            <TableRow key={t.id} className="hover:bg-blue-50">
              <TableCell className="font-mono text-xs">{t.transactionCode}</TableCell>
              <TableCell className="text-xs text-gray-700">{t.clientName}</TableCell>
              <TableCell>{getCategoryBadge(t.category)}</TableCell>
              <TableCell className="text-xs">{t.typeName}</TableCell>
              <TableCell>{getStatusBadge(t.status)}</TableCell>
              <TableCell className="text-xs font-mono">{t.displayDate}</TableCell>
              <TableCell>
                 <div className="flex items-center gap-1">
                    <Progress value={t.progress} className="h-1.5 w-12" />
                    <span className="text-[10px] font-mono">{t.progress}%</span>
                 </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-400">لا توجد بيانات</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // --- Tab Content Logic ---
  const renderTabContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-10 w-10 text-blue-500" /></div>;
    if (isError) return <div className="text-center text-red-500 p-10">فشل تحميل البيانات. تأكد من تشغيل السيرفر.</div>;

    switch (activeTab) {
      // 1. نظرة عامة
      case '285-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على سجل المعاملات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير الكل
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{transactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المعاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{activeTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{completedTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{pendingTransactions.length + underReviewTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{cancelledTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ملغاة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>{uniqueClients.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عملاء</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر 10 معاملات</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(-10).reverse().map(t => (
                      <TableRow key={t.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      // 2. المعاملات النشطة
      case '285-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات النشطة ({activeTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Hash className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{activeTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {activeTransactions.filter(t => t.progress >= 75).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قرب الانتهاء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {activeTransactions.filter(t => t.progress >= 25 && t.progress < 75).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد التنفيذ</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {activeTransactions.filter(t => t.progress < 25).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>في البداية</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      // 3. المعاملات المنتهية
      case '285-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات المنتهية ({completedTransactions.length})</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />تصفية
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{completedTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Home className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {completedTransactions.filter(t => t.category === 'سكني').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>سكنية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Building className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {completedTransactions.filter(t => t.category === 'تجاري').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تجارية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {(completedTransactions.reduce((sum, t) => sum + (t.totalFees || 0), 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الأتعاب</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-green-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{(t.totalFees || 0).toLocaleString('ar-SA')} ر.س</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 4. المعاملات الملغاة
      case '285-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات الملغاة ({cancelledTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{cancelledTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الملغاة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Calendar className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {new Date().getFullYear()}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>السنة الحالية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {((cancelledTransactions.length / transactions.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>من الإجمالي</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإلغاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-red-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 5. تحت المعالجة
      case '285-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات تحت المعالجة ({pendingTransactions.length + underReviewTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-yellow-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{pendingTransactions.length + underReviewTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Eye className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {underReviewTransactions.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المراجعة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#c2410c' }}>
                    {pendingTransactions.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {([...pendingTransactions, ...underReviewTransactions]).map(t => (
                      <TableRow key={t.id} className="hover:bg-yellow-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo || 'غير محدد'}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      // 6. حسب التصنيف
      case '285-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب التصنيف</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {uniqueCategories.map((cat, idx) => {
                const catTrans = getTransactionsByCategory(cat);
                const colors = [
                  { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '#93c5fd', text: '#1e40af' },
                  { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '#86efac', text: '#15803d' },
                  { bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '#fb923c', text: '#c2410c' },
                  { bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '#a5b4fc', text: '#4f46e5' }
                ];
                const colorIndex = idx % colors.length;
                return (
                  <Card key={cat} className="card-element card-rtl" style={{ background: colors[colorIndex].bg, border: `2px solid ${colors[colorIndex].border}` }}>
                    <CardContent className="p-2 text-center">
                      <Briefcase className="h-5 w-5 mx-auto mb-1" style={{ color: colors[colorIndex].text }} />
                      <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: colors[colorIndex].text }}>{catTrans.length}</p>
                      <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{cat}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="space-y-2">
              {uniqueCategories.map(category => {
                const catTransactions = getTransactionsByCategory(category);
                if (catTransactions.length === 0) return null;
                return (
                  <Card key={category} className="card-element card-rtl">
                    <CardHeader className="p-2 pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</CardTitle>
                        <Badge className="text-xs">{catTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                      <Table className="table-rtl dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catTransactions.slice(0, 5).map(t => (
                            <TableRow key={t.id} className="hover:bg-blue-50">
                              <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location || 'غير محدد'}</TableCell>
                              <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                              <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {catTransactions.length > 5 && (
                        <div className="text-center mt-2">
                          <Badge variant="outline" className="text-xs">+ {catTransactions.length - 5} معاملة أخرى</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      // 7. حسب العميل
      case '285-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب العميل</h2>
              <Button size="sm" className="h-8 text-xs bg-pink-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>{uniqueClients.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العملاء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Star className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {uniqueClients.filter(c => getTransactionsByClient(c).length >= 3).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عملاء متكررون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {Math.max(...uniqueClients.map(c => getTransactionsByClient(c).length))}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أكثر معاملات</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              {uniqueClients.slice(0, 10).map(client => {
                const clientTransactions = getTransactionsByClient(client);
                const isExpanded = expandedClient === client;
                return (
                  <Card key={client} className="card-element card-rtl">
                    <CardHeader className="p-2">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedClient(isExpanded ? null : client)}
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-pink-600" /> : <ChevronRight className="h-4 w-4 text-pink-600" />}
                          <Users className="h-4 w-4 text-pink-600" />
                          <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client}</span>
                        </div>
                        <Badge className="text-xs bg-pink-500 text-white">{clientTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="p-2 pt-0">
                        <Table className="table-rtl dense-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientTransactions.map(t => (
                              <TableRow key={t.id} className="hover:bg-pink-50">
                                <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                                <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                                <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.typeName}</TableCell>
                                <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location || 'غير محدد'}</TableCell>
                                <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                                <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );

      // 8. حسب السنة
      case '285-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب السنة والشهر</h2>
              <Badge variant="outline" className="text-xs">{transactions.length} معاملة</Badge>
            </div>
            <div className="space-y-2">
              {years.map(year => {
                const yearTransactions = getTransactionsByYear(year);
                const isExpanded = expandedYear === year;
                return (
                  <Card key={year} className="card-element card-rtl">
                    <CardHeader className="p-2">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedYear(isExpanded ? null : year)}>
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-600" /> : <ChevronRight className="h-4 w-4 text-blue-600" />}
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-mono text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>{year}</span>
                        </div>
                        <Badge className="text-xs bg-blue-500 text-white">{yearTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="p-2 pt-0">
                        <div className="grid grid-cols-4 gap-2">
                          {monthNames.map((monthName, index) => {
                            const monthNumber = index + 1;
                            const monthTransactions = getTransactionsByMonth(year, monthNumber);
                            const hasTransactions = monthTransactions.length > 0;
                            const isMonthExpanded = expandedMonth === `${year}-${monthNumber}`;
                            return (
                              <div key={monthNumber}>
                                <Card 
                                  className={`cursor-pointer transition-all ${hasTransactions ? 'card-element card-rtl hover:shadow-md' : 'opacity-50'}`}
                                  style={{ 
                                    background: hasTransactions 
                                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
                                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                    border: hasTransactions ? '2px solid #3b82f6' : '1px solid #d1d5db'
                                  }}
                                  onClick={() => hasTransactions && setExpandedMonth(isMonthExpanded ? null : `${year}-${monthNumber}`)}
                                >
                                  <CardContent className="p-2 text-center">
                                    <Calendar className={`h-4 w-4 mx-auto mb-1 ${hasTransactions ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: hasTransactions ? '#1f2937' : '#9ca3af' }}>
                                      {monthName}
                                    </p>
                                    <Badge className={`text-xs ${hasTransactions ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>
                                      {monthTransactions.length}
                                    </Badge>
                                  </CardContent>
                                </Card>
                                {isMonthExpanded && monthTransactions.length > 0 && (
                                  <Card className="card-element card-rtl mt-2">
                                    <CardContent className="p-2">
                                      <Table className="table-rtl dense-table">
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {monthTransactions.map(t => (
                                            <TableRow key={t.id} className="hover:bg-blue-50">
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.transactionCode}</TableCell>
                                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.clientName}</TableCell>
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.displayDate}</TableCell>
                                              <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );

      // 9. تحليلات
      case '285-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليلات سجل المعاملات</h2>
              <Button size="sm" className="h-8 text-xs bg-indigo-500">
                <Download className="h-3 w-3 ml-1" />تصدير التحليلات
              </Button>
            </div>
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب الحالة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {[
                    { status: 'active', count: activeTransactions.length, label: 'نشطة', color: '#3b82f6' },
                    { status: 'completed', count: completedTransactions.length, label: 'مكتملة', color: '#10b981' },
                    { status: 'pending', count: pendingTransactions.length, label: 'تحت المعالجة', color: '#f59e0b' },
                    { status: 'cancelled', count: cancelledTransactions.length, label: 'ملغاة', color: '#ef4444' }
                  ].map(item => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</span>
                        <span className="text-xs font-mono">{item.count} ({((item.count / transactions.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(item.count / transactions.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب التصنيف</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {uniqueCategories.map(cat => {
                    const count = getTransactionsByCategory(cat).length;
                    const percentage = (count / transactions.length) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cat}</span>
                          <span className="text-xs font-mono">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى 5 عملاء نشاطاً</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueClients
                        .map(client => ({
                          client,
                          count: getTransactionsByClient(client).length
                        }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((item, idx) => (
                          <TableRow key={idx} className="hover:bg-blue-50">
                            <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.client}</TableCell>
                            <TableCell className="text-right py-1 text-xs font-mono">{item.count}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب السنة</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {years.reverse().map(year => {
                        const count = getTransactionsByYear(year).length;
                        return (
                          <TableRow key={year} className="hover:bg-blue-50">
                            <TableCell className="text-right py-1 text-xs font-mono">{year}</TableCell>
                            <TableCell className="text-right py-1 text-xs font-mono">{count}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      // 10. الإعدادات
      case '285-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات السجل</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ</Button>
            </div>
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderBottom: '2px solid #93c5fd' }}>
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Activity className="h-4 w-4 text-blue-600" />
                  إعدادات العرض والتحديث
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-2">
                <EnhancedSwitch
                  id="auto-refresh"
                  label="التحديث التلقائي"
                  description="تحديث البيانات تلقائياً كل دقيقة"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  size="md"
                  variant="success"
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-285-API" position="top-right" />
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
              <FileText 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
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
                  سجل المعاملات
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
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    285
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
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                سجل شامل لجميع المعاملات مع تحليلات وإحصائيات تفصيلية
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
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                10 تبويبات
              </span>
            </div>
            {isLoading && <span className="text-xs text-blue-500 animate-pulse">جاري التحديث...</span>}
          </div>
        </div>
      </div>
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="flex-1 px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsLog_Complete_285_v10;