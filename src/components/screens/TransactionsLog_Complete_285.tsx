/**
 * الشاشة 285 - سجل المعاملات الشامل - مطورة بالكامل v6.0
 * ================================================================
 * 
 * شاشة استعراض تفصيلي لحالة كل معاملة مع إحصائيات شاملة:
 * - المعاملات المنتهية والملغاة والتي تحت المعالجة
 * - زمن معالجة كل معاملة حسب تصنيفها
 * - علاقة المعاملات بالعملاء
 * - إجمالي المعاملات لكل تصنيف ولكل عدد أدوار
 * - 15 تبويب مطور بالكامل مع جميع التحسينات
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, CheckCircle, XCircle, Clock, Users, Building,
  TrendingUp, BarChart3, PieChart, Calendar, Filter,
  Download, Eye, Search, RefreshCw, AlertCircle,
  Target, Activity, Database, Settings, ArrowUp, ArrowDown,
  Save
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG = [
  { id: '285-01', number: '285-01', title: 'نظرة عامة شاملة', icon: BarChart3 },
  { id: '285-02', number: '285-02', title: 'المعاملات النشطة', icon: Activity },
  { id: '285-03', number: '285-03', title: 'المعاملات المنتهية', icon: CheckCircle },
  { id: '285-04', number: '285-04', title: 'المعاملات الملغاة', icon: XCircle },
  { id: '285-05', number: '285-05', title: 'تحت المعالجة - المكتب', icon: Building },
  { id: '285-06', number: '285-06', title: 'تحت المعالجة - جهات خارجية', icon: Users },
  { id: '285-07', number: '285-07', title: 'أوقات المعالجة', icon: Clock },
  { id: '285-08', number: '285-08', title: 'حسب التصنيف', icon: Target },
  { id: '285-09', number: '285-09', title: 'حسب العميل', icon: Users },
  { id: '285-10', number: '285-10', title: 'حسب المرحلة', icon: TrendingUp },
  { id: '285-11', number: '285-11', title: 'تحليلات زمنية', icon: Calendar },
  { id: '285-12', number: '285-12', title: 'تقارير تفصيلية', icon: FileText },
  { id: '285-13', number: '285-13', title: 'إحصائيات متقدمة', icon: PieChart },
  { id: '285-14', number: '285-14', title: 'المقارنات', icon: BarChart3 },
  { id: '285-15', number: '285-15', title: 'الإعدادات', icon: Settings }
];

// واجهات البيانات
interface TransactionLog {
  id: string;
  code: string;
  title: string;
  client: string;
  category: string;
  status: 'active' | 'completed' | 'cancelled' | 'processing-office' | 'processing-external';
  stages: number;
  currentStage: number;
  startDate: string;
  endDate?: string;
  processingTime: number; // بالأيام
  assignedTo: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  value: number;
}

const TransactionsLog_Complete_285: React.FC = () => {
  const [activeTab, setActiveTab] = useState('285-01');
  
  // بيانات الفلترة
  const [filterData, setFilterData] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    category: 'all',
    client: '',
    searchQuery: '',
  });

  const handleFilterChange = (field: string, value: any) => {
    setFilterData(prev => ({ ...prev, [field]: value }));
  };

  // بيانات تجريبية شاملة
  const mockTransactionsLog = useMemo(() => [
    {
      id: '1',
      code: 'TRX-2025-001',
      title: 'ترخيص بناء سكني',
      client: 'أحمد محمد العلي',
      category: 'تراخيص بناء',
      status: 'completed' as const,
      stages: 8,
      currentStage: 8,
      startDate: '2025-01-15',
      endDate: '2025-02-28',
      processingTime: 44,
      assignedTo: 'فريق التراخيص',
      priority: 'high' as const,
      value: 450000
    },
    {
      id: '2',
      code: 'TRX-2025-002',
      title: 'فسح مخطط سكني',
      client: 'شركة الخليج العقارية',
      category: 'فسوحات',
      status: 'processing-office' as const,
      stages: 10,
      currentStage: 6,
      startDate: '2025-02-01',
      processingTime: 28,
      assignedTo: 'قسم الفسوحات',
      priority: 'urgent' as const,
      value: 850000
    },
    {
      id: '3',
      code: 'TRX-2025-003',
      title: 'تعديل صك',
      client: 'فاطمة سعد الزهراني',
      category: 'صكوك',
      status: 'processing-external' as const,
      stages: 5,
      currentStage: 3,
      startDate: '2025-02-10',
      processingTime: 18,
      assignedTo: 'كتابة العدل',
      priority: 'medium' as const,
      value: 125000
    },
    {
      id: '4',
      code: 'TRX-2025-004',
      title: 'معاملة إفراز أرض',
      client: 'خالد عبدالله القحطاني',
      category: 'إفراز',
      status: 'cancelled' as const,
      stages: 7,
      currentStage: 4,
      startDate: '2025-01-20',
      endDate: '2025-02-15',
      processingTime: 26,
      assignedTo: 'قسم المساحة',
      priority: 'low' as const,
      value: 75000
    },
    {
      id: '5',
      code: 'TRX-2025-005',
      title: 'رخصة هدم وإعادة بناء',
      client: 'مؤسسة البناء الحديث',
      category: 'تراخيص بناء',
      status: 'active' as const,
      stages: 12,
      currentStage: 9,
      startDate: '2025-01-25',
      processingTime: 35,
      assignedTo: 'فريق التراخيص',
      priority: 'high' as const,
      value: 1200000
    },
  ], []);

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = mockTransactionsLog.length;
    const completed = mockTransactionsLog.filter(t => t.status === 'completed').length;
    const cancelled = mockTransactionsLog.filter(t => t.status === 'cancelled').length;
    const processingOffice = mockTransactionsLog.filter(t => t.status === 'processing-office').length;
    const processingExternal = mockTransactionsLog.filter(t => t.status === 'processing-external').length;
    const active = mockTransactionsLog.filter(t => t.status === 'active').length;
    
    const avgProcessingTime = Math.round(
      mockTransactionsLog.reduce((sum, t) => sum + t.processingTime, 0) / total
    );
    
    const totalValue = mockTransactionsLog.reduce((sum, t) => sum + t.value, 0);
    
    return {
      total,
      completed,
      cancelled,
      processingOffice,
      processingExternal,
      active,
      avgProcessingTime,
      totalValue,
      completionRate: Math.round((completed / total) * 100),
      cancellationRate: Math.round((cancelled / total) * 100),
    };
  }, [mockTransactionsLog]);

  // تصنيف المعاملات حسب الفئة
  const byCategory = useMemo(() => {
    const categories = new Map<string, number>();
    mockTransactionsLog.forEach(t => {
      categories.set(t.category, (categories.get(t.category) || 0) + 1);
    });
    return Array.from(categories.entries()).map(([name, count]) => ({ name, count }));
  }, [mockTransactionsLog]);

  // تصنيف المعاملات حسب العميل
  const byClient = useMemo(() => {
    const clients = new Map<string, number>();
    mockTransactionsLog.forEach(t => {
      clients.set(t.client, (clients.get(t.client) || 0) + 1);
    });
    return Array.from(clients.entries()).map(([name, count]) => ({ name, count }));
  }, [mockTransactionsLog]);

  // دالة للحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'processing-office': return 'bg-blue-100 text-blue-700';
      case 'processing-external': return 'bg-purple-100 text-purple-700';
      case 'active': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // دالة للحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'منتهية';
      case 'cancelled': return 'ملغاة';
      case 'processing-office': return 'قيد المعالجة - المكتب';
      case 'processing-external': return 'قيد المعالجة - جهة خارجية';
      case 'active': return 'نشطة';
      default: return 'غير معروف';
    }
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 285-01: نظرة عامة شاملة
      case '285-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              {[
                { 
                  label: 'إجمالي المعاملات', 
                  value: statistics.total.toString(), 
                  icon: FileText, 
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                { 
                  label: 'المنتهية', 
                  value: statistics.completed.toString(), 
                  icon: CheckCircle, 
                  color: 'text-green-600',
                  bg: 'bg-green-50'
                },
                { 
                  label: 'الملغاة', 
                  value: statistics.cancelled.toString(), 
                  icon: XCircle, 
                  color: 'text-red-600',
                  bg: 'bg-red-50'
                },
                { 
                  label: 'تحت المعالجة', 
                  value: (statistics.processingOffice + statistics.processingExternal).toString(), 
                  icon: Clock, 
                  color: 'text-yellow-600',
                  bg: 'bg-yellow-50'
                },
                { 
                  label: 'النشطة', 
                  value: statistics.active.toString(), 
                  icon: Activity, 
                  color: 'text-purple-600',
                  bg: 'bg-purple-50'
                },
                { 
                  label: 'متوسط وقت المعالجة', 
                  value: `${statistics.avgProcessingTime} يوم`, 
                  icon: Clock, 
                  color: 'text-orange-600',
                  bg: 'bg-orange-50'
                },
              ].map((stat, i) => (
                <Card key={i} className="dense-stat-card">
                  <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-2`}>
                    {React.createElement(stat.icon, { className: `h-5 w-5 ${stat.color}` })}
                  </div>
                  <div className={`dense-stat-number ${stat.color}`}>{stat.value}</div>
                  <div className="dense-stat-label">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* نسب الإنجاز */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <PieChart className="h-5 w-5" />
                  نسب الإنجاز والإلغاء
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="compact-text font-medium">نسبة الإنجاز</span>
                      <span className="compact-text font-bold text-green-600">{statistics.completionRate}%</span>
                    </div>
                    <Progress value={statistics.completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="compact-text font-medium">نسبة الإلغاء</span>
                      <span className="compact-text font-bold text-red-600">{statistics.cancellationRate}%</span>
                    </div>
                    <Progress value={statistics.cancellationRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توزيع المعاملات حسب التصنيف */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Target className="h-5 w-5" />
                  توزيع المعاملات حسب التصنيف
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {byCategory.map((cat, i) => (
                    <div key={i} className="p-3 bg-white rounded border">
                      <div className="flex items-center justify-between">
                        <span className="compact-text font-medium">{cat.name}</span>
                        <Badge className="bg-blue-100 text-blue-700">{cat.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-02: المعاملات النشطة
      case '285-02':
        const activeTransactions = mockTransactionsLog.filter(t => t.status === 'active');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Activity className="h-5 w-5" />
                  المعاملات النشطة ({activeTransactions.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">المرحلة</TableHead>
                      <TableHead className="text-right">الوقت</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-right">
                          <code className="font-code text-xs">{t.code}</code>
                        </TableCell>
                        <TableCell className="text-right font-medium">{t.title}</TableCell>
                        <TableCell className="text-right">{t.client}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs">{t.currentStage}/{t.stages}</span>
                        </TableCell>
                        <TableCell className="text-right text-xs">{t.processingTime} يوم</TableCell>
                        <TableCell className="text-right">
                          <Badge className={getStatusColor(t.status)}>
                            {getStatusText(t.status)}
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

      // 285-03: المعاملات المنتهية
      case '285-03':
        const completedTransactions = mockTransactionsLog.filter(t => t.status === 'completed');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CheckCircle className="h-5 w-5" />
                  المعاملات المنتهية ({completedTransactions.length})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Download className="h-3 w-3" />
                    تصدير التقرير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {completedTransactions.map((t) => (
                    <Card key={t.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="compact-title">{t.title}</div>
                          <code className="font-code text-xs text-gray-600">{t.code}</code>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          منتهية
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">العميل:</span>
                          <span className="font-medium">{t.client}</span>
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">الفئة:</span>
                          <span>{t.category}</span>
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">المدة:</span>
                          <span className="font-medium text-blue-600">{t.processingTime} يوم</span>
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">المراحل:</span>
                          <span>{t.stages} مراحل</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-04: المعاملات الملغاة
      case '285-04':
        const cancelledTransactions = mockTransactionsLog.filter(t => t.status === 'cancelled');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <XCircle className="h-5 w-5" />
                  المعاملات الملغاة ({cancelledTransactions.length})
                </h2>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">تاريخ الإلغاء</TableHead>
                      <TableHead className="text-right">المرحلة عند الإلغاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-right">
                          <code className="font-code text-xs">{t.code}</code>
                        </TableCell>
                        <TableCell className="text-right">{t.title}</TableCell>
                        <TableCell className="text-right">{t.client}</TableCell>
                        <TableCell className="text-right text-xs">{t.endDate}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs">{t.currentStage}/{t.stages}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 285-05: تحت المعالجة - المكتب
      case '285-05':
        const officeProcessing = mockTransactionsLog.filter(t => t.status === 'processing-office');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Building className="h-5 w-5" />
                  تحت المعالجة - المكتب ({officeProcessing.length})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeProcessing.map((t) => (
                    <Card key={t.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="compact-title">{t.title}</div>
                          <code className="font-code text-xs text-gray-600">{t.code}</code>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          <Building className="h-3 w-3 ml-1" />
                          المكتب
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">العميل:</span>
                          <span className="font-medium">{t.client}</span>
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">المسؤول:</span>
                          <span>{t.assignedTo}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">التقدم</span>
                            <span className="text-xs font-medium">{Math.round((t.currentStage / t.stages) * 100)}%</span>
                          </div>
                          <Progress value={(t.currentStage / t.stages) * 100} className="h-2" />
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">الأيام المنقضية:</span>
                          <span className="font-medium text-blue-600">{t.processingTime} يوم</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-06: تحت المعالجة - جهات خارجية
      case '285-06':
        const externalProcessing = mockTransactionsLog.filter(t => t.status === 'processing-external');
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-5 w-5" />
                  تحت المعالجة - جهات خارجية ({externalProcessing.length})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {externalProcessing.map((t) => (
                    <Card key={t.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="compact-title">{t.title}</div>
                          <code className="font-code text-xs text-gray-600">{t.code}</code>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          <Users className="h-3 w-3 ml-1" />
                          جهة خارجية
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">العميل:</span>
                          <span className="font-medium">{t.client}</span>
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">الجهة المسؤولة:</span>
                          <span>{t.assignedTo}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">التقدم</span>
                            <span className="text-xs font-medium">{Math.round((t.currentStage / t.stages) * 100)}%</span>
                          </div>
                          <Progress value={(t.currentStage / t.stages) * 100} className="h-2" />
                        </div>
                        <div className="compact-text flex items-center justify-between">
                          <span className="text-gray-600">الأيام المنقضية:</span>
                          <span className="font-medium text-purple-600">{t.processingTime} يوم</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-07: أوقات المعالجة
      case '285-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Clock className="h-5 w-5" />
                  تحليل أوقات المعالجة
                </h2>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الكود</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">عدد المراحل</TableHead>
                      <TableHead className="text-right">الوقت الإجمالي</TableHead>
                      <TableHead className="text-right">متوسط الوقت/مرحلة</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactionsLog.map((t) => {
                      const avgPerStage = Math.round(t.processingTime / t.stages);
                      const performance = avgPerStage <= 4 ? 'ممتاز' : avgPerStage <= 7 ? 'جيد' : 'يحتاج تحسين';
                      const performanceColor = avgPerStage <= 4 ? 'bg-green-100 text-green-700' : avgPerStage <= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
                      
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="text-right">
                            <code className="font-code text-xs">{t.code}</code>
                          </TableCell>
                          <TableCell className="text-right">{t.title}</TableCell>
                          <TableCell className="text-right">{t.stages}</TableCell>
                          <TableCell className="text-right font-medium">{t.processingTime} يوم</TableCell>
                          <TableCell className="text-right">{avgPerStage} يوم</TableCell>
                          <TableCell className="text-right">
                            <Badge className={performanceColor}>{performance}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 285-08: حسب التصنيف
      case '285-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Target className="h-5 w-5" />
                  المعاملات حسب التصنيف
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {byCategory.map((cat, i) => {
                    const categoryTransactions = mockTransactionsLog.filter(t => t.category === cat.name);
                    const completed = categoryTransactions.filter(t => t.status === 'completed').length;
                    const completionRate = Math.round((completed / cat.count) * 100);
                    
                    return (
                      <Card key={i} className="dense-content-card">
                        <div className="flex items-center justify-between mb-3">
                          <div className="compact-title">{cat.name}</div>
                          <Badge className="bg-blue-100 text-blue-700">{cat.count} معاملة</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="compact-text flex items-center justify-between">
                            <span>المنتهية:</span>
                            <span className="font-medium text-green-600">{completed}</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">نسبة الإنجاز:</span>
                              <span className="text-xs font-bold">{completionRate}%</span>
                            </div>
                            <Progress value={completionRate} className="h-2" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-09: حسب العميل
      case '285-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-5 w-5" />
                  المعاملات حسب العميل
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {byClient.map((client, i) => {
                    const clientTransactions = mockTransactionsLog.filter(t => t.client === client.name);
                    const totalValue = clientTransactions.reduce((sum, t) => sum + t.value, 0);
                    
                    return (
                      <Card key={i} className="dense-content-card">
                        <div className="compact-title mb-2">{client.name}</div>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <div className="compact-text flex items-center justify-between">
                            <span>عدد المعاملات:</span>
                            <Badge className="bg-blue-100 text-blue-700">{client.count}</Badge>
                          </div>
                          <div className="compact-text flex items-center justify-between">
                            <span>القيمة الإجمالية:</span>
                            <span className="font-medium text-green-600">{totalValue.toLocaleString()} ر.س</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-10: حسب المرحلة
      case '285-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <TrendingUp className="h-5 w-5" />
                  المعاملات حسب المرحلة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { stage: 'استقبال', count: 45, percentage: 15, color: 'blue' },
                    { stage: 'دراسة', count: 38, percentage: 13, color: 'green' },
                    { stage: 'مراجعة', count: 52, percentage: 17, color: 'yellow' },
                    { stage: 'موافقة', count: 61, percentage: 20, color: 'purple' },
                    { stage: 'تنفيذ', count: 48, percentage: 16, color: 'orange' },
                    { stage: 'تسليم', count: 56, percentage: 19, color: 'cyan' },
                  ].map((stage, i) => (
                    <Card key={i} className="dense-content-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="compact-title">{stage.stage}</div>
                        <Badge className={`bg-${stage.color}-100 text-${stage.color}-700`}>
                          {stage.count} معاملة
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">النسبة من الإجمالي</span>
                          <span className="font-bold">{stage.percentage}%</span>
                        </div>
                        <Progress value={stage.percentage * 5} className="h-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-11: تحليلات زمنية
      case '285-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-5 w-5" />
                  التحليلات الزمنية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* فلترة حسب الفترة الزمنية */}
                  <div className="dense-grid dense-grid-3 gap-3">
                    <DateInputWithToday
                      label="من تاريخ"
                      id="dateFrom"
                      value=""
                      onChange={() => {}}
                    />
                    <DateInputWithToday
                      label="إلى تاريخ"
                      id="dateTo"
                      value=""
                      onChange={() => {}}
                    />
                    <SelectWithCopy
                      label="الفترة"
                      id="period"
                      value="month"
                      onChange={() => {}}
                      options={[
                        { value: 'day', label: 'يومي' },
                        { value: 'week', label: 'أسبوعي' },
                        { value: 'month', label: 'شهري' },
                        { value: 'quarter', label: 'ربع سنوي' },
                        { value: 'year', label: 'سنوي' },
                      ]}
                    />
                  </div>

                  <Separator />

                  {/* إحصائيات زمنية */}
                  <div className="dense-grid dense-grid-2 gap-3">
                    {[
                      { period: 'هذا الشهر', count: 87, change: '+12%', trend: 'up' },
                      { period: 'الشهر الماضي', count: 75, change: '+8%', trend: 'up' },
                      { period: 'هذا الربع', count: 245, change: '+15%', trend: 'up' },
                      { period: 'هذا العام', count: 892, change: '-3%', trend: 'down' },
                    ].map((stat, i) => (
                      <div key={i} className="p-3 bg-white rounded border">
                        <div className="compact-subtitle mb-1">{stat.period}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-blue-600">{stat.count}</div>
                          <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-12: تقارير تفصيلية
      case '285-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-5 w-5" />
                  إنشاء تقرير تفصيلي
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Download className="h-3 w-3" />
                    تصدير PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div className="space-y-4">
                    <InputWithCopy
                      label="عنوان التقرير"
                      id="reportTitle"
                      value="تقرير سجل المعاملات الشهري"
                      onChange={() => {}}
                      placeholder="أدخل عنوان التقرير"
                    />

                    <SelectWithCopy
                      label="نوع التقرير"
                      id="reportType"
                      value="summary"
                      onChange={() => {}}
                      options={[
                        { value: 'summary', label: 'تقرير ملخص' },
                        { value: 'detailed', label: 'تقرير تفصيلي' },
                        { value: 'analytical', label: 'تقرير تحليلي' },
                        { value: 'comparative', label: 'تقرير مقارن' },
                      ]}
                    />

                    <DateInputWithToday
                      label="من تاريخ"
                      id="reportDateFrom"
                      value=""
                      onChange={() => {}}
                    />

                    <DateInputWithToday
                      label="إلى تاريخ"
                      id="reportDateTo"
                      value=""
                      onChange={() => {}}
                    />
                  </div>

                  <div className="space-y-4">
                    <SelectWithCopy
                      label="حالة المعاملات"
                      id="reportStatus"
                      value="all"
                      onChange={() => {}}
                      options={[
                        { value: 'all', label: 'الكل' },
                        { value: 'completed', label: 'منتهية فقط' },
                        { value: 'active', label: 'نشطة فقط' },
                        { value: 'cancelled', label: 'ملغاة فقط' },
                      ]}
                    />

                    <SelectWithCopy
                      label="التصنيف"
                      id="reportCategory"
                      value="all"
                      onChange={() => {}}
                      options={[
                        { value: 'all', label: 'جميع التصنيفات' },
                        { value: 'licenses', label: 'تراخيص' },
                        { value: 'permits', label: 'فسوحات' },
                        { value: 'deeds', label: 'صكوك' },
                      ]}
                    />

                    <SelectWithCopy
                      label="تنسيق التصدير"
                      id="exportFormat"
                      value="pdf"
                      onChange={() => {}}
                      options={[
                        { value: 'pdf', label: 'PDF' },
                        { value: 'excel', label: 'Excel' },
                        { value: 'word', label: 'Word' },
                        { value: 'csv', label: 'CSV' },
                      ]}
                    />

                    <TextAreaWithCopy
                      label="ملاحظات إضافية"
                      id="reportNotes"
                      value=""
                      onChange={() => {}}
                      placeholder="أضف أي ملاحظات للتقرير..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-13: إحصائيات متقدمة
      case '285-13':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <PieChart className="h-5 w-5" />
                  الإحصائيات المتقدمة
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* معدلات الأداء */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معدلات الأداء الشهرية
                    </h3>
                    <div className="dense-grid dense-grid-3 gap-3">
                      {[
                        { label: 'معدل الإنجاز', value: '92%', color: 'green' },
                        { label: 'معدل الإلغاء', value: '3%', color: 'red' },
                        { label: 'معدل التأخير', value: '5%', color: 'yellow' },
                      ].map((metric, i) => (
                        <div key={i} className="p-3 bg-white rounded border text-center">
                          <div className="compact-subtitle mb-2">{metric.label}</div>
                          <div className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* توزيع المعاملات حسب الأولوية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      توزيع حسب الأولوية
                    </h3>
                    <div className="space-y-2">
                      {[
                        { priority: 'عاجلة', count: 23, percentage: 8, color: 'red' },
                        { priority: 'عالية', count: 67, percentage: 22, color: 'orange' },
                        { priority: 'متوسطة', count: 145, percentage: 48, color: 'blue' },
                        { priority: 'منخفضة', count: 67, percentage: 22, color: 'gray' },
                      ].map((item, i) => (
                        <div key={i} className="p-2 bg-white rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="compact-text font-medium">{item.priority}</span>
                            <span className="compact-text font-bold">{item.count} معاملة</span>
                          </div>
                          <Progress value={item.percentage * 2} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* متوسطات زمنية */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      المتوسطات الزمنية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      {[
                        { label: 'متوسط الإنجاز الكلي', value: '28 يوم', icon: Clock },
                        { label: 'أسرع معاملة', value: '12 يوم', icon: CheckCircle },
                        { label: 'أبطأ معاملة', value: '56 يوم', icon: AlertCircle },
                        { label: 'متوسط الانتظار', value: '3 أيام', icon: Clock },
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-white rounded border flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            {React.createElement(item.icon, { className: 'h-5 w-5 text-blue-600' })}
                          </div>
                          <div>
                            <div className="compact-subtitle">{item.label}</div>
                            <div className="compact-title text-blue-600">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-14: المقارنات
      case '285-14':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-5 w-5" />
                  المقارنات والتحليل
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* خيارات المقارنة */}
                  <div className="dense-grid dense-grid-2 gap-3">
                    <SelectWithCopy
                      label="الفترة الأولى"
                      id="period1"
                      value="current-month"
                      onChange={() => {}}
                      options={[
                        { value: 'current-month', label: 'الشهر الحالي' },
                        { value: 'last-month', label: 'الشهر الماضي' },
                        { value: 'current-quarter', label: 'الربع الحالي' },
                        { value: 'last-quarter', label: 'الربع الماضي' },
                      ]}
                    />

                    <SelectWithCopy
                      label="الفترة الثانية"
                      id="period2"
                      value="last-month"
                      onChange={() => {}}
                      options={[
                        { value: 'current-month', label: 'الشهر الحالي' },
                        { value: 'last-month', label: 'الشهر الماضي' },
                        { value: 'current-quarter', label: 'الربع الحالي' },
                        { value: 'last-quarter', label: 'الربع الماضي' },
                      ]}
                    />
                  </div>

                  <Separator />

                  {/* نتائج المقارنة */}
                  <Table className="dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المؤشر</TableHead>
                        <TableHead className="text-right">الشهر الحالي</TableHead>
                        <TableHead className="text-right">الشهر الماضي</TableHead>
                        <TableHead className="text-right">التغيير</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { metric: 'إجمالي المعاملات', current: 87, previous: 75, change: '+16%' },
                        { metric: 'المعاملات المنتهية', current: 62, previous: 58, change: '+7%' },
                        { metric: 'المعاملات الملغاة', current: 3, previous: 5, change: '-40%' },
                        { metric: 'متوسط وقت الإنجاز', current: '26 يوم', previous: '29 يوم', change: '-10%' },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-right font-medium">{row.metric}</TableCell>
                          <TableCell className="text-right">{row.current}</TableCell>
                          <TableCell className="text-right">{row.previous}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={row.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                              {row.change}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator />

                  {/* تحليل الأداء */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      تحليل الأداء
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="compact-text font-medium text-green-800">نقاط القوة</span>
                        </div>
                        <p className="compact-text text-green-700">
                          تحسن ملحوظ في عدد المعاملات المنجزة وانخفاض في معدلات الإلغاء
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="compact-text font-medium text-yellow-800">نقاط التحسين</span>
                        </div>
                        <p className="compact-text text-yellow-700">
                          يمكن تحسين متوسط وقت المعالجة من خلال أتمتة بعض الإجراءات
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 285-15: الإعدادات
      case '285-15':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-5 w-5" />
                  إعدادات سجل المعاملات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* إعدادات العرض */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات العرض
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <SelectWithCopy
                        label="عدد الصفوف لكل صفحة"
                        id="rowsPerPage"
                        value="50"
                        onChange={() => {}}
                        options={[
                          { value: '25', label: '25 صف' },
                          { value: '50', label: '50 صف' },
                          { value: '100', label: '100 صف' },
                          { value: '200', label: '200 صف' },
                        ]}
                      />

                      <SelectWithCopy
                        label="ترتيب افتراضي"
                        id="defaultSort"
                        value="date-desc"
                        onChange={() => {}}
                        options={[
                          { value: 'date-desc', label: 'الأحدث أولاً' },
                          { value: 'date-asc', label: 'الأقدم أولاً' },
                          { value: 'status', label: 'حسب الحالة' },
                          { value: 'priority', label: 'حسب الأولوية' },
                        ]}
                      />

                      <SelectWithCopy
                        label="تنسيق التاريخ"
                        id="dateFormat"
                        value="dd-mm-yyyy"
                        onChange={() => {}}
                        options={[
                          { value: 'dd-mm-yyyy', label: 'يوم-شهر-سنة' },
                          { value: 'yyyy-mm-dd', label: 'سنة-شهر-يوم' },
                          { value: 'mm-dd-yyyy', label: 'شهر-يوم-سنة' },
                        ]}
                      />

                      <SelectWithCopy
                        label="نمط العرض"
                        id="viewMode"
                        value="cards"
                        onChange={() => {}}
                        options={[
                          { value: 'table', label: 'جدول' },
                          { value: 'cards', label: 'بطاقات' },
                          { value: 'list', label: 'قائمة' },
                        ]}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات التنبيهات */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات التنبيهات
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <SelectWithCopy
                        label="تنبيه المعاملات المتأخرة"
                        id="delayAlert"
                        value="enabled"
                        onChange={() => {}}
                        options={[
                          { value: 'enabled', label: 'مُفعّل' },
                          { value: 'disabled', label: 'معطل' },
                        ]}
                      />

                      <InputWithCopy
                        label="عتبة التأخير (أيام)"
                        id="delayThreshold"
                        type="number"
                        value="30"
                        onChange={() => {}}
                        placeholder="30"
                      />

                      <SelectWithCopy
                        label="تنبيه الإنجاز"
                        id="completionAlert"
                        value="enabled"
                        onChange={() => {}}
                        options={[
                          { value: 'enabled', label: 'مُفعّل' },
                          { value: 'disabled', label: 'معطل' },
                        ]}
                      />

                      <InputWithCopy
                        label="بريد التنبيهات"
                        id="alertEmail"
                        type="email"
                        value="admin@system.sa"
                        onChange={() => {}}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات التصدير */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات التصدير
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <SelectWithCopy
                        label="تنسيق التصدير الافتراضي"
                        id="exportFormat"
                        value="excel"
                        onChange={() => {}}
                        options={[
                          { value: 'excel', label: 'Excel' },
                          { value: 'pdf', label: 'PDF' },
                          { value: 'csv', label: 'CSV' },
                          { value: 'json', label: 'JSON' },
                        ]}
                      />

                      <SelectWithCopy
                        label="تضمين المرفقات"
                        id="includeAttachments"
                        value="yes"
                        onChange={() => {}}
                        options={[
                          { value: 'yes', label: 'نعم' },
                          { value: 'no', label: 'لا' },
                        ]}
                      />

                      <InputWithCopy
                        label="مسار الحفظ الافتراضي"
                        id="savePath"
                        value="/exports/transactions/"
                        onChange={() => {}}
                        placeholder="/exports/transactions/"
                      />

                      <SelectWithCopy
                        label="ضغط الملفات"
                        id="compression"
                        value="enabled"
                        onChange={() => {}}
                        options={[
                          { value: 'enabled', label: 'مُفعّل (ZIP)' },
                          { value: 'disabled', label: 'معطل' },
                        ]}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* إعدادات متقدمة */}
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات متقدمة
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <SelectWithCopy
                        label="التحديث التلقائي"
                        id="autoRefresh"
                        value="enabled"
                        onChange={() => {}}
                        options={[
                          { value: 'enabled', label: 'مُفعّل' },
                          { value: 'disabled', label: 'معطل' },
                        ]}
                      />

                      <InputWithCopy
                        label="فترة التحديث (ثواني)"
                        id="refreshInterval"
                        type="number"
                        value="60"
                        onChange={() => {}}
                        placeholder="60"
                      />

                      <SelectWithCopy
                        label="الحفظ التلقائي للفلاتر"
                        id="saveFilters"
                        value="enabled"
                        onChange={() => {}}
                        options={[
                          { value: 'enabled', label: 'مُفعّل' },
                          { value: 'disabled', label: 'معطل' },
                        ]}
                      />

                      <InputWithCopy
                        label="مدة الاحتفاظ بالسجلات (أيام)"
                        id="retentionDays"
                        type="number"
                        value="365"
                        onChange={() => {}}
                        placeholder="365"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                سجل المعاملات الشامل
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 285
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <FileText className="w-2 h-2 ml-1" />
              {statistics.total} معاملة
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-secondary">
              <RefreshCw className="h-3 w-3" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 285 - سجل المعاملات الشامل
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  استعراض تفصيلي لحالة كل معاملة • 15 تبويب • حقول محسّنة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {statistics.completed} منتهية
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-285</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsLog_Complete_285;
