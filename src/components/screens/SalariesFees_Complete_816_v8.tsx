/**
 * الشاشة 816 - الرواتب والأجور - v8.0
 * ======================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 10 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  DollarSign, Plus, Edit, Eye, Download, CheckCircle, Clock,
  AlertTriangle, Filter, Calendar, Users, Settings, RefreshCw,
  Calculator, Receipt, CreditCard, Wallet, FileText,
  BarChart3, Activity, TrendingUp, Briefcase
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '816-01', number: '816-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '816-02', number: '816-02', title: 'رواتب الموظفين', icon: DollarSign },
  { id: '816-03', number: '816-03', title: 'أجور الفريلانسرز', icon: Users },
  { id: '816-04', number: '816-04', title: 'بدلات ومكافآت', icon: Receipt },
  { id: '816-05', number: '816-05', title: 'الخصومات', icon: Calculator },
  { id: '816-06', number: '816-06', title: 'طرق الدفع', icon: CreditCard },
  { id: '816-07', number: '816-07', title: 'كشوف الرواتب', icon: FileText },
  { id: '816-08', number: '816-08', title: 'التقارير المالية', icon: BarChart3 },
  { id: '816-09', number: '816-09', title: 'الأرشيف', icon: Wallet },
  { id: '816-10', number: '816-10', title: 'الإعدادات', icon: Settings },
];

const SalariesFees_Complete_816_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('816-01');
  const [enableAutoCalc, setEnableAutoCalc] = useState(true);
  const [enableGOSI, setEnableGOSI] = useState(true);

  const salariesData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي الرواتب الشهرية', value: '1.2M ر.س', icon: DollarSign, color: '#3b82f6', change: 5 },
      { id: '2', label: 'المدفوع هذا الشهر', value: '1.05M ر.س', icon: CheckCircle, color: '#10b981', change: 3 },
      { id: '3', label: 'قيد الانتظار', value: '150K ر.س', icon: Clock, color: '#f59e0b', change: -2 },
      { id: '4', label: 'عدد الموظفين', value: '189', icon: Users, color: '#8b5cf6', change: 8 },
      { id: '5', label: 'متوسط الراتب', value: '8,500 ر.س', icon: Activity, color: '#06b6d4', change: 2 },
      { id: '6', label: 'البدلات والمكافآت', value: '85K ر.س', icon: Receipt, color: '#ec4899', change: 6 },
    ],
    salaries: [
      { id: '1', employee: 'أحمد محمد علي', department: 'الهندسة', basic: 15000, allowances: 3000, deductions: 1500, net: 16500, status: 'paid' },
      { id: '2', employee: 'فاطمة سعيد', department: 'المالية', basic: 12000, allowances: 2500, deductions: 1200, net: 13300, status: 'paid' },
      { id: '3', employee: 'خالد عبدالله', department: 'المبيعات', basic: 18000, allowances: 4000, deductions: 1800, net: 20200, status: 'pending' },
      { id: '4', employee: 'نورة حسن', department: 'الموارد البشرية', basic: 10000, allowances: 2000, deductions: 1000, net: 11000, status: 'paid' },
    ],
    freelancers: [
      { id: '1', name: 'محمد سالم', task: 'تصميم شعار', amount: 5000, paid: 5000, status: 'paid' },
      { id: '2', name: 'سارة أحمد', task: 'كتابة محتوى', amount: 3500, paid: 1750, status: 'partial' },
      { id: '3', name: 'علي حسن', task: 'برمجة موقع', amount: 15000, paid: 7500, status: 'partial' },
    ],
  }), []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      paid: { label: 'مدفوع', color: 'bg-green-500' },
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-500' },
      unpaid: { label: 'غير مدفوع', color: 'bg-red-500' },
      partial: { label: 'مدفوع جزئياً', color: 'bg-blue-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '816-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - الرواتب والأجور</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {salariesData.stats.map((stat) => (
                <Card key={stat.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4', style: { color: stat.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {stat.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <Activity className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رواتب الموظفين */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <DollarSign className="h-4 w-4" />
                  رواتب هذا الشهر
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأساسي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البدلات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصافي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salariesData.salaries.map((sal) => (
                      <TableRow key={sal.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sal.employee}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sal.department}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.basic.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.allowances.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.net.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(sal.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '816-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>رواتب الموظفين</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />راتب جديد</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الراتب الأساسي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البدلات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخصومات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصافي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salariesData.salaries.map((sal) => (
                      <TableRow key={sal.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sal.employee}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sal.department}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.basic.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.allowances.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.deductions.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2 text-xs">{sal.net.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(sal.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
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

      case '816-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>أجور الفريلانسرز</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />مهمة جديدة</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {salariesData.freelancers.map((freelancer) => (
                <Card key={freelancer.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {getStatusBadge(freelancer.status)}
                    </div>
                    <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{freelancer.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{freelancer.task}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">المبلغ الكلي:</span>
                        <span className="font-mono">{freelancer.amount.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">المدفوع:</span>
                        <span className="font-mono text-green-600">{freelancer.paid.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">المتبقي:</span>
                        <span className="font-mono text-red-600">{(freelancer.amount - freelancer.paid).toLocaleString()} ر.س</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">دفع</Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '816-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الرواتب</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-calc"
                  label="الحساب التلقائي"
                  description="حساب الرواتب والخصومات تلقائياً"
                  checked={enableAutoCalc}
                  onCheckedChange={setEnableAutoCalc}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="gosi"
                  label="التكامل مع GOSI"
                  description="خصم التأمينات الاجتماعية تلقائياً"
                  checked={enableGOSI}
                  onCheckedChange={setEnableGOSI}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="payment-day"
                    label="يوم صرف الراتب"
                    value="28"
                    onChange={() => {}}
                    options={[
                      { value: '25', label: 'اليوم 25 من كل شهر' },
                      { value: '28', label: 'اليوم 28 من كل شهر' },
                      { value: '30', label: 'آخر يوم من كل شهر' },
                      { value: '1', label: 'اليوم الأول من الشهر التالي' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-816" position="top-right" />
      
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
              <DollarSign 
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
                  الرواتب والأجور
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
                    816
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
                نظام متكامل لإدارة الرواتب والأجور والبدلات
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

export default SalariesFees_Complete_816_v8;
