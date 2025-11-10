/**
 * الشاشة 285 - سجل المعاملات v9.0
 * =====================================
 * 
 * تحديثات v9.0:
 * ✅ تاب "حسب السنة" مع أيقونات السنوات (2022-2025)
 * ✅ توليد تلقائي لأيقونات السنوات الجديدة
 * ✅ أيقونات فرعية للأشهر داخل كل سنة
 * ✅ عرض المعاملات حسب شهر الإنشاء
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, CheckCircle, XCircle, Clock, Users, Building,
  TrendingUp, BarChart3, Calendar, Filter, Download, Eye,
  Activity, Settings, ChevronDown, ChevronRight
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

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

interface Transaction {
  id: string;
  number: string;
  client: string;
  status: string;
  date: string; // YYYY-MM-DD
  year: number;
  month: number;
}

const TransactionsLog_Complete_285_v9: React.FC = () => {
  const [activeTab, setActiveTab] = useState('285-01');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const mockTransactions: Transaction[] = [
    { id: '2203001', number: '2203001', client: 'أحمد محمد', status: 'completed', date: '2022-03-15', year: 2022, month: 3 },
    { id: '2205001', number: '2205001', client: 'سارة علي', status: 'completed', date: '2022-05-20', year: 2022, month: 5 },
    { id: '2205002', number: '2205002', client: 'خالد عبدالله', status: 'completed', date: '2022-05-22', year: 2022, month: 5 },
    { id: '2301001', number: '2301001', client: 'فاطمة حسن', status: 'completed', date: '2023-01-10', year: 2023, month: 1 },
    { id: '2307001', number: '2307001', client: 'محمد السالم', status: 'active', date: '2023-07-25', year: 2023, month: 7 },
    { id: '2307002', number: '2307002', client: 'نورة أحمد', status: 'active', date: '2023-07-28', year: 2023, month: 7 },
    { id: '2402001', number: '2402001', client: 'عبدالله أحمد', status: 'active', date: '2024-02-14', year: 2024, month: 2 },
    { id: '2406001', number: '2406001', client: 'منى خالد', status: 'active', date: '2024-06-30', year: 2024, month: 6 },
    { id: '2501001', number: '2501001', client: 'عبدالرحمن خالد', status: 'active', date: '2025-01-05', year: 2025, month: 1 },
    { id: '2501002', number: '2501002', client: 'ريم محمد', status: 'active', date: '2025-01-12', year: 2025, month: 1 },
    { id: '2501003', number: '2501003', client: 'سعد العتيبي', status: 'active', date: '2025-01-18', year: 2025, month: 1 },
  ];

  // توليد السنوات تلقائياً
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const yearsArray: number[] = [];
    
    for (let year = startYear; year <= currentYear; year++) {
      yearsArray.push(year);
    }
    
    return yearsArray;
  }, []);

  // أسماء الأشهر بالعربية
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // حساب عدد المعاملات لكل سنة
  const getTransactionsByYear = (year: number) => {
    return mockTransactions.filter(t => t.year === year);
  };

  // حساب عدد المعاملات لكل شهر في سنة محددة
  const getTransactionsByMonth = (year: number, month: number) => {
    return mockTransactions.filter(t => t.year === year && t.month === month);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: 'نشطة', color: 'bg-blue-500' },
      completed: { label: 'مكتملة', color: 'bg-green-500' },
      cancelled: { label: 'ملغاة', color: 'bg-red-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '285-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على سجل المعاملات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <FileText className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">{mockTransactions.length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Activity className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">{mockTransactions.filter(t => t.status === 'active').length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">{mockTransactions.filter(t => t.status === 'completed').length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">{years.length}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سنوات التشغيل</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-pink-600 mb-1" />
                  <p className="text-2xl text-pink-600 mb-1">{new Set(mockTransactions.map(t => t.client)).size}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عملاء</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '285-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب السنة والشهر</h2>
              <Badge variant="outline" className="text-xs">{mockTransactions.length} معاملة</Badge>
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
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
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

      case '285-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات السجل</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2 space-y-2">
                <EnhancedSwitch
                  id="auto-refresh"
                  label="التحديث التلقائي"
                  description="تحديث البيانات تلقائياً كل دقيقة"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  size="sm"
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
      <CodeDisplay code="SCR-285" position="top-right" />
      
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
                سجل شامل لجميع المعاملات مع التصنيف الزمني
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
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsLog_Complete_285_v9;
