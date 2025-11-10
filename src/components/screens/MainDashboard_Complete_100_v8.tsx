/**
 * الشاشة 100 - لوحة التحكم الرئيسية - v8.0
 * =====================================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 12 تبويب شامل
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Home, BarChart3, Users, Briefcase, DollarSign, Package, FileText,
  Activity, Bell, Settings, Clock, CheckCircle, AlertCircle, RefreshCw,
  Plus, Download, Target, ArrowUpRight, ArrowDownRight, Star, Zap,
  TrendingUp, Calendar, Eye, Edit, Trash2, Search, Filter
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '100-01', number: '100-01', title: 'نظرة عامة', icon: Home },
  { id: '100-02', number: '100-02', title: 'المؤشرات المالية', icon: DollarSign },
  { id: '100-03', number: '100-03', title: 'العملاء والمشاريع', icon: Briefcase },
  { id: '100-04', number: '100-04', title: 'الموارد البشرية', icon: Users },
  { id: '100-05', number: '100-05', title: 'المخزون والمشتريات', icon: Package },
  { id: '100-06', number: '100-06', title: 'المعاملات والوثائق', icon: FileText },
  { id: '100-07', number: '100-07', title: 'الأداء والجودة', icon: Target },
  { id: '100-08', number: '100-08', title: 'التنبيهات والإشعارات', icon: Bell },
  { id: '100-09', number: '100-09', title: 'التقارير التحليلية', icon: BarChart3 },
  { id: '100-10', number: '100-10', title: 'الأنشطة الأخيرة', icon: Activity },
  { id: '100-11', number: '100-11', title: 'الإجراءات السريعة', icon: Zap },
  { id: '100-12', number: '100-12', title: 'الإعدادات', icon: Settings },
];

const MainDashboard_Complete_100_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('100-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [enableRealTimeUpdates, setEnableRealTimeUpdates] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  // بيانات تجريبية شاملة
  const dashboardData = useMemo(() => ({
    metrics: [
      { id: '1', label: 'إجمالي الإيرادات', value: '12.5M ر.س', change: 12.5, trend: 'up', icon: DollarSign, color: '#10b981', percentage: 83 },
      { id: '2', label: 'العملاء النشطين', value: '342', change: 8.2, trend: 'up', icon: Users, color: '#3b82f6', percentage: 85 },
      { id: '3', label: 'المشاريع الجارية', value: '45', change: 5.3, trend: 'up', icon: Briefcase, color: '#8b5cf6', percentage: 90 },
      { id: '4', label: 'معدل الإنجاز', value: '87.5%', change: 2.8, trend: 'up', icon: Target, color: '#f59e0b', percentage: 92 },
      { id: '5', label: 'المعاملات اليومية', value: '128', change: -3.5, trend: 'down', icon: FileText, color: '#06b6d4', percentage: 85 },
      { id: '6', label: 'رضا العملاء', value: '4.7/5', change: 0.3, trend: 'up', icon: Star, color: '#eab308', percentage: 94 },
    ],
    clients: [
      { id: '1', name: 'شركة التطوير العقاري', category: 'عقارات', revenue: 5500000, projects: 3, rating: 4.8, status: 'vip' },
      { id: '2', name: 'وزارة الشؤون البلدية', category: 'حكومي', revenue: 12000000, projects: 2, rating: 4.9, status: 'vip' },
      { id: '3', name: 'مكتب الهندسة المتقدمة', category: 'استشاري', revenue: 850000, projects: 1, rating: 4.5, status: 'active' },
    ],
    projects: [
      { id: '1', name: 'تصميم المجمع السكني', client: 'شركة التطوير', progress: 75, status: 'on-track', deadline: '2025-12-31' },
      { id: '2', name: 'الإشراف على الطريق', client: 'الشؤون البلدية', progress: 45, status: 'at-risk', deadline: '2026-06-30' },
      { id: '3', name: 'تطوير مركز تجاري', client: 'مؤسسة الاستثمار', progress: 90, status: 'on-track', deadline: '2025-11-15' },
    ],
  }), []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '100-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {dashboardData.metrics.map((metric) => (
                <Card key={metric.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                        {React.createElement(metric.icon, { className: 'h-4 w-4', style: { color: metric.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{metric.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{metric.value}</p>
                    <Progress value={metric.percentage} className="h-1.5 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* أهم العملاء والمشاريع */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-4 w-4" />
                    أهم العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {dashboardData.clients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{client.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{client.rating}</span>
                            </div>
                          </div>
                        </div>
                        {client.status === 'vip' && <Badge className="bg-purple-500 text-white text-xs px-1.5 py-0 h-5">VIP</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Briefcase className="h-4 w-4" />
                    المشاريع الجارية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {dashboardData.projects.map((project) => (
                      <div key={project.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{project.name}</span>
                          <Badge 
                            className={`text-xs px-1.5 py-0 h-5 ${
                              project.status === 'on-track' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                            }`}
                          >
                            {project.status === 'on-track' ? 'على المسار' : 'متأخر'}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project.client}</span>
                          <span>{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '100-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المؤشرات المالية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Download className="h-3 w-3 ml-1" />تصدير التقرير</Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'الإيرادات الشهرية', value: '1.2M ر.س', icon: TrendingUp, color: '#10b981' },
                { label: 'المصروفات', value: '650K ر.س', icon: ArrowDownRight, color: '#ef4444' },
                { label: 'صافي الربح', value: '550K ر.س', icon: DollarSign, color: '#3b82f6' },
                { label: 'هامش الربح', value: '45.8%', icon: BarChart3, color: '#8b5cf6' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  الأداء المالي - آخر 6 أشهر
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني للأداء المالي</p>
                    <p className="text-xs text-gray-500">يتطلب مكتبة Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '100-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>العملاء والمشاريع</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />إضافة</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-4 w-4" />
                    قائمة العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.clients.map((client) => (
                        <TableRow key={client.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client.name}</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{client.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs">{client.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-1.5 py-0 h-5 ${
                              client.status === 'vip' ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                              {client.status === 'vip' ? 'VIP' : 'نشط'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Briefcase className="h-4 w-4" />
                    المشاريع النشطة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {dashboardData.projects.map((project) => (
                      <div key={project.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{project.name}</span>
                          <Badge className={`text-xs px-1.5 py-0 h-5 ${
                            project.status === 'on-track' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {project.status === 'on-track' ? 'على المسار' : 'متأخر'}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-2 mb-1" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project.client}</span>
                          <span>{project.progress}% مكتمل</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '100-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات لوحة التحكم</h2>
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
                  id="enable-realtime"
                  label="التحديث المباشر"
                  description="تحديث البيانات تلقائياً بشكل مباشر"
                  checked={enableRealTimeUpdates}
                  onCheckedChange={setEnableRealTimeUpdates}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="enable-notifications"
                  label="التنبيهات"
                  description="إظهار التنبيهات والإشعارات"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="default-view"
                    label="العرض الافتراضي"
                    value="overview"
                    onChange={() => {}}
                    options={[
                      { value: 'overview', label: 'نظرة عامة' },
                      { value: 'financial', label: 'المؤشرات المالية' },
                      { value: 'projects', label: 'المشاريع' }
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
      <CodeDisplay code="SCR-100" position="top-right" />
      
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
              <Home 
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
                  لوحة التحكم الرئيسية
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
                    100
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
                مراقبة شاملة للأداء والعمليات
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
                12 تبويباً
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

export default MainDashboard_Complete_100_v8;
