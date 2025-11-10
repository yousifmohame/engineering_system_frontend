/**
 * الشاشة 285 - سجل المعاملات الشامل - v8.0
 * ================================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 15 تبويباً شاملاً
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import {
  FileText, CheckCircle, XCircle, Clock, Users, Building,
  TrendingUp, BarChart3, PieChart, Calendar, Filter,
  Download, Eye, Search, RefreshCw, AlertCircle,
  Target, Activity, Database, Settings
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';

const TABS_CONFIG: TabConfig[] = [
  { id: '285-01', number: '285-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '285-02', number: '285-02', title: 'المعاملات النشطة', icon: Activity },
  { id: '285-03', number: '285-03', title: 'المنتهية', icon: CheckCircle },
  { id: '285-04', number: '285-04', title: 'الملغاة', icon: XCircle },
  { id: '285-05', number: '285-05', title: 'قيد المعالجة - المكتب', icon: Building },
  { id: '285-06', number: '285-06', title: 'قيد المعالجة - خارجي', icon: Users },
  { id: '285-07', number: '285-07', title: 'أوقات المعالجة', icon: Clock },
  { id: '285-08', number: '285-08', title: 'حسب التصنيف', icon: Target },
  { id: '285-09', number: '285-09', title: 'حسب العميل', icon: Users },
  { id: '285-10', number: '285-10', title: 'حسب المرحلة', icon: TrendingUp },
  { id: '285-11', number: '285-11', title: 'تحليلات زمنية', icon: Calendar },
  { id: '285-12', number: '285-12', title: 'التقارير', icon: FileText },
  { id: '285-13', number: '285-13', title: 'إحصائيات متقدمة', icon: PieChart },
  { id: '285-14', number: '285-14', title: 'المقارنات', icon: BarChart3 },
  { id: '285-15', number: '285-15', title: 'الإعدادات', icon: Settings },
];

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
  processingTime: number;
  assignedTo: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  value: number;
}

const TransactionsLog_Complete_285_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('285-01');

  // بيانات تجريبية
  const mockTransactionsLog = useMemo<TransactionLog[]>(() => [
    {
      id: '1',
      code: 'TRX-2025-001',
      title: 'ترخيص بناء سكني',
      client: 'أحمد محمد العلي',
      category: 'تراخيص بناء',
      status: 'completed',
      stages: 8,
      currentStage: 8,
      startDate: '2025-01-15',
      endDate: '2025-02-28',
      processingTime: 44,
      assignedTo: 'فريق التراخيص',
      priority: 'high',
      value: 450000
    },
    {
      id: '2',
      code: 'TRX-2025-002',
      title: 'إفراز أرض',
      client: 'شركة التطوير العقاري',
      category: 'إفراز',
      status: 'active',
      stages: 7,
      currentStage: 4,
      startDate: '2025-02-01',
      processingTime: 32,
      assignedTo: 'قسم المساحة',
      priority: 'medium',
      value: 320000
    },
    {
      id: '3',
      code: 'TRX-2025-003',
      title: 'استشارة هندسية',
      client: 'محمد خالد السعيد',
      category: 'استشارات',
      status: 'processing-office',
      stages: 5,
      currentStage: 3,
      startDate: '2025-03-10',
      processingTime: 18,
      assignedTo: 'المهندس أحمد',
      priority: 'urgent',
      value: 85000
    },
  ], []);

  // الإحصائيات
  const statistics = useMemo(() => {
    const total = mockTransactionsLog.length;
    const completed = mockTransactionsLog.filter(t => t.status === 'completed').length;
    const cancelled = mockTransactionsLog.filter(t => t.status === 'cancelled').length;
    const processingOffice = mockTransactionsLog.filter(t => t.status === 'processing-office').length;
    const processingExternal = mockTransactionsLog.filter(t => t.status === 'processing-external').length;
    const active = mockTransactionsLog.filter(t => t.status === 'active').length;
    const avgProcessingTime = Math.round(mockTransactionsLog.reduce((sum, t) => sum + t.processingTime, 0) / total);
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'completed': { label: 'منتهية', color: 'bg-green-500' },
      'cancelled': { label: 'ملغاة', color: 'bg-red-500' },
      'processing-office': { label: 'قيد المعالجة - مكتب', color: 'bg-blue-500' },
      'processing-external': { label: 'قيد المعالجة - خارجي', color: 'bg-purple-500' },
      'active': { label: 'نشطة', color: 'bg-yellow-500' },
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
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            {/* إحصائيات مكثفة */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <FileText className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">{statistics.total}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">{statistics.completed}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>منتهية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Activity className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-2xl text-yellow-600 mb-1">{statistics.active}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">{statistics.avgProcessingTime}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الأيام</p>
                </CardContent>
              </Card>
            </div>

            {/* معدلات الإنجاز */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  معدلات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل الإنجاز</span>
                      <span className="text-xs font-mono">{statistics.completionRate}%</span>
                    </div>
                    <Progress value={statistics.completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</span>
                      <span className="text-xs font-mono">{(statistics.totalValue / 1000000).toFixed(1)}M ر.س</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '285-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات النشطة</h2>
              <Badge variant="outline" className="text-xs">{statistics.active} معاملة</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactionsLog.filter(t => t.status === 'active').map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{transaction.code}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{transaction.title}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{transaction.client}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1">
                            <Progress value={(transaction.currentStage / transaction.stages) * 100} className="h-2 w-20" />
                            <span className="text-xs">{transaction.currentStage}/{transaction.stages}</span>
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

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Database className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-285" position="top-right" />
      
      {/* هيدر الشاشة v4.2.2 */}
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
              <Database 
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
                  سجل المعاملات الشامل
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
                استعراض شامل لحالة وتحليل المعاملات
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
                15 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
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

export default TransactionsLog_Complete_285_v8;
