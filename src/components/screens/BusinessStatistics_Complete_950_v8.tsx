import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Activity, Users,
  Briefcase, DollarSign, Calendar, Clock, Award, Target, FileText, Download,
  Filter, RefreshCw, Settings, Eye, Share2, Printer, Plus, AlertCircle, CheckCircle
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

/**
 * شاشة الإحصائيات الشاملة - رقم 950 - v8.0
 * لوحة معلومات تفاعلية مع إحصائيات ورسوم بيانية
 */

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

const TABS_CONFIG: TabConfig[] = [
  { id: '950-01', number: '950-01', title: 'لوحة المعلومات', icon: BarChart3 },
  { id: '950-02', number: '950-02', title: 'الإحصائيات المالية', icon: DollarSign },
  { id: '950-03', number: '950-03', title: 'إحصائيات المشاريع', icon: Briefcase },
  { id: '950-04', number: '950-04', title: 'إحصائيات العملاء', icon: Users },
  { id: '950-05', number: '950-05', title: 'الأداء والجودة', icon: Award },
  { id: '950-06', number: '950-06', title: 'التقارير المرئية', icon: PieChart },
  { id: '950-07', number: '950-07', title: 'إعدادات العرض', icon: Settings }
];

const BusinessStatistics_Complete_950_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('950-01');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExportDialog, setShowExportDialog] = useState(false);

  // مؤشرات التفعيل
  const [enableRealTime, setEnableRealTime] = useState(true);
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);

  // بيانات إحصائية
  const mainStats: StatCard[] = [
    { title: 'إجمالي الإيرادات', value: '12.5M ريال', change: '+15.3%', trend: 'up', icon: DollarSign, color: '#10b981' },
    { title: 'عدد المشاريع', value: '234', change: '+8.2%', trend: 'up', icon: Briefcase, color: '#3b82f6' },
    { title: 'عدد العملاء', value: '567', change: '+12.5%', trend: 'up', icon: Users, color: '#8b5cf6' },
    { title: 'معدل الرضا', value: '92%', change: '-2.1%', trend: 'down', icon: Award, color: '#f59e0b' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-600" />;
    return <Activity className="h-3.5 w-3.5 text-gray-600" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '950-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة المعلومات</h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0">مباشر</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-4 gap-2">
              {mainStats.map((stat, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-5 w-5', style: { color: stat.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(stat.trend)}
                        <span className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.title}</p>
                    <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* الرسوم البيانية */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <LineChart className="h-4 w-4" />
                    اتجاه الإيرادات الشهرية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني خطي</p>
                      <p className="text-xs text-gray-500">يتطلب مكتبة Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart3 className="h-4 w-4" />
                    توزيع المشاريع حسب الحالة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 rounded">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني عمودي</p>
                      <p className="text-xs text-gray-500">يتطلب مكتبة Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* أحدث الأنشطة */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Activity className="h-4 w-4" />
                    أحدث الإنجازات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1">
                    {[
                      { text: 'تم إتمام مشروع برج الرياض', time: 'منذ ساعتين', type: 'success' },
                      { text: 'عميل جديد: شركة البناء الحديثة', time: 'منذ 3 ساعات', type: 'info' },
                      { text: 'تحقيق هدف الإيرادات الشهري', time: 'منذ 5 ساعات', type: 'success' }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        {activity.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activity.text}</p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Target className="h-4 w-4" />
                    المستهدفات النشطة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {[
                      { name: 'إيرادات Q4', progress: 77, status: 'ontrack' },
                      { name: 'مشاريع جديدة', progress: 80, status: 'achieved' },
                      { name: 'رضا العملاء', progress: 88, status: 'ontrack' }
                    ].map((target, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.name}</span>
                          <span className="text-xs">{target.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all" 
                            style={{ 
                              width: `${target.progress}%`,
                              backgroundColor: target.progress >= 90 ? '#10b981' : target.progress >= 70 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '950-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات المالية</h2>
              <div className="flex gap-2">
                <SelectWithCopy
                  id="financial-period"
                  label=""
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  options={[
                    { value: 'week', label: 'أسبوعي' },
                    { value: 'month', label: 'شهري' },
                    { value: 'quarter', label: 'ربع سنوي' },
                    { value: 'year', label: 'سنوي' }
                  ]}
                  copyable={false}
                  clearable={false}
                />
              </div>
            </div>

            {/* مؤشرات مالية */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'الإيرادات', value: '12.5M', icon: DollarSign, color: '#10b981' },
                { label: 'المصروفات', value: '8.2M', icon: TrendingDown, color: '#ef4444' },
                { label: 'صافي الربح', value: '4.3M', icon: TrendingUp, color: '#3b82f6' },
                { label: 'هامش الربح', value: '34%', icon: PieChart, color: '#8b5cf6' },
                { label: 'النمو', value: '+15%', icon: BarChart3, color: '#f59e0b' },
                { label: 'المتوقع', value: '15M', icon: Target, color: '#6366f1' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* الرسوم البيانية المالية */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <PieChart className="h-4 w-4" />
                    توزيع الإيرادات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-purple-500 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم دائري</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <LineChart className="h-4 w-4" />
                    التدفق النقدي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto text-cyan-500 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم خطي</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  تفاصيل الإيرادات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { month: 'أكتوبر 2025', revenue: '1.2M', expenses: '750K', profit: '450K' },
                    { month: 'سبتمبر 2025', revenue: '1.1M', expenses: '680K', profit: '420K' },
                    { month: 'أغسطس 2025', revenue: '980K', expenses: '620K', profit: '360K' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{row.month}</span>
                      <div className="flex gap-4">
                        <span className="text-xs text-green-600">{row.revenue}</span>
                        <span className="text-xs text-red-600">{row.expenses}</span>
                        <span className="text-xs text-blue-600">{row.profit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '950-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات المشاريع</h2>
              <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
            </div>

            {/* مؤشرات المشاريع */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'إجمالي المشاريع', value: '234', color: '#3b82f6' },
                { label: 'قيد التنفيذ', value: '89', color: '#10b981' },
                { label: 'مكتملة', value: '145', color: '#6366f1' },
                { label: 'معلقة', value: '12', color: '#f59e0b' },
                { label: 'ملغاة', value: '8', color: '#ef4444' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* توزيع المشاريع */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <PieChart className="h-4 w-4" />
                    توزيع المشاريع حسب النوع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {[
                      { type: 'مباني سكنية', count: 89, color: '#3b82f6' },
                      { type: 'مباني تجارية', count: 56, color: '#10b981' },
                      { type: 'بنية تحتية', count: 45, color: '#f59e0b' },
                      { type: 'مشاريع أخرى', count: 44, color: '#8b5cf6' }
                    ].map((item, i) => {
                      const percentage = (item.count / 234) * 100;
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</span>
                            <span className="text-xs">{item.count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart3 className="h-4 w-4" />
                    معدل الإنجاز الشهري
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-orange-500 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '950-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات العملاء</h2>
              <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
            </div>

            {/* مؤشرات العملاء */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي العملاء', value: '567', change: '+12.5%', trend: 'up' },
                { label: 'عملاء جدد', value: '45', change: '+8.2%', trend: 'up' },
                { label: 'عملاء نشطين', value: '423', change: '+5.3%', trend: 'up' },
                { label: 'معدل الاحتفاظ', value: '94%', change: '-1.2%', trend: 'down' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <span className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* تحليل العملاء */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-4 w-4" />
                    توزيع العملاء حسب النوع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {[
                      { type: 'أفراد', count: 345, percentage: 61 },
                      { type: 'شركات', count: 156, percentage: 27 },
                      { type: 'جهات حكومية', count: 66, percentage: 12 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{item.count}</span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{item.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Award className="h-4 w-4" />
                    معدل رضا العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-4xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>92%</p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل الرضا العام</p>
                    </div>
                    <div className="space-y-1">
                      {[
                        { criteria: 'جودة الخدمة', score: 94 },
                        { criteria: 'سرعة التنفيذ', score: 89 },
                        { criteria: 'التواصل', score: 93 }
                      ].map((item, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.criteria}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '950-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأداء والجودة</h2>
              <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
            </div>

            {/* مؤشرات الأداء */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'الأداء العام', value: '85%', color: '#3b82f6' },
                { label: 'الجودة', value: '92%', color: '#10b981' },
                { label: 'الإنتاجية', value: '78%', color: '#f59e0b' },
                { label: 'الكفاءة', value: '88%', color: '#8b5cf6' },
                { label: 'الالتزام', value: '95%', color: '#6366f1' },
                { label: 'الابتكار', value: '73%', color: '#ec4899' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.value}</p>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className="h-full" style={{ width: item.value, backgroundColor: item.color }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* مقارنة الأداء */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  مقارنة الأداء الشهري
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-indigo-500 mb-2" />
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني مقارن</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '950-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير المرئية</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowExportDialog(true)}>
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Plus className="h-3 w-3 ml-1" />تقرير جديد
                </Button>
              </div>
            </div>

            {/* أنواع التقارير */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'التقرير المالي', icon: DollarSign, count: 15 },
                { name: 'تقرير المشاريع', icon: Briefcase, count: 23 },
                { name: 'تقرير العملاء', icon: Users, count: 12 },
                { name: 'تقرير الأداء', icon: Award, count: 8 },
                { name: 'تقرير الجودة', icon: Target, count: 6 },
                { name: 'تقارير مخصصة', icon: Settings, count: 4 }
              ].map((report, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {React.createElement(report.icon, { className: 'h-5 w-5 text-blue-600' })}
                      <div className="flex-1">
                        <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.name}</h3>
                        <Badge variant="outline" className="text-xs px-1.5 py-0 mt-1">{report.count} تقرير</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* آخر التقارير */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  آخر التقارير المنشأة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { name: 'التقرير المالي الشهري - أكتوبر', date: '2025-10-24', type: 'مالي' },
                    { name: 'تقرير أداء المشاريع Q4', date: '2025-10-20', type: 'مشاريع' },
                    { name: 'تحليل رضا العملاء', date: '2025-10-18', type: 'عملاء' }
                  ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.name}</p>
                          <span className="text-xs text-gray-500">{report.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{report.type}</Badge>
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Download className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '950-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات العرض</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            {/* الإعدادات العامة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-realtime"
                  label="التحديث المباشر"
                  description="عرض البيانات بشكل مباشر ومحدث"
                  checked={enableRealTime}
                  onCheckedChange={setEnableRealTime}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="enable-auto-refresh"
                  label="التحديث التلقائي"
                  description="تحديث البيانات تلقائياً كل فترة"
                  checked={enableAutoRefresh}
                  onCheckedChange={setEnableAutoRefresh}
                  size="sm"
                  variant="success"
                />

                <EnhancedSwitch
                  id="enable-animations"
                  label="التأثيرات المتحركة"
                  description="تفعيل الحركات والانتقالات السلسة"
                  checked={enableAnimations}
                  onCheckedChange={setEnableAnimations}
                  size="sm"
                  variant="default"
                />

                <div className="form-rtl">
                  <Label className="text-xs">الفترة الزمنية الافتراضية</Label>
                  <SelectWithCopy
                    id="default-period"
                    label=""
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    options={[
                      { value: 'week', label: 'أسبوعي' },
                      { value: 'month', label: 'شهري' },
                      { value: 'quarter', label: 'ربع سنوي' },
                      { value: 'year', label: 'سنوي' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* إعدادات الرسوم البيانية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  إعدادات الرسوم البيانية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="show-grid"
                  label="عرض الشبكة"
                  description="إظهار خطوط الشبكة في الرسوم البيانية"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="show-labels"
                  label="عرض التسميات"
                  description="إظهار تسميات البيانات"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="show-legend"
                  label="عرض وسيلة الإيضاح"
                  description="إظهار وسيلة إيضاح الرسوم"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-950" position="top-right" />
      
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
              <BarChart3 
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
                  الإحصائيات الشاملة
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
                    950
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
                لوحة معلومات تفاعلية شاملة
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
                7 تبويبات
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

      {/* Dialog تصدير */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>تصدير التقرير</DialogTitle>
            <DialogDescription className="dialog-description">اختر صيغة التصدير</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
              <Button key={format} variant="outline" className="w-full justify-start" onClick={() => setShowExportDialog(false)}>
                <Download className="h-4 w-4 ml-2" />
                تصدير كـ {format}
              </Button>
            ))}
          </div>

          <Separator />

          <Button variant="outline" className="w-full" onClick={() => setShowExportDialog(false)}>
            إلغاء
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessStatistics_Complete_950_v8;
