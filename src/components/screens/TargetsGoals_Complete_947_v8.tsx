import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Target, TrendingUp, BarChart3, Calendar, Users, CheckCircle, AlertCircle,
  Plus, Edit, Trash2, Eye, Settings, Award, Flag, Clock, Activity, DollarSign,
  Briefcase, FileText, PieChart, LineChart, Filter, Download, RefreshCw
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

/**
 * شاشة المستهدفات والأهداف - رقم 947 - v8.0
 * نظام شامل لإدارة ومتابعة المستهدفات والأهداف
 */

interface GoalTarget {
  id: string;
  name: string;
  type: 'financial' | 'projects' | 'clients' | 'quality' | 'performance';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  responsible: string;
  status: 'ontrack' | 'delayed' | 'achieved' | 'pending';
  priority: 'high' | 'medium' | 'low';
}

const TABS_CONFIG: TabConfig[] = [
  { id: '947-01', number: '947-01', title: 'لوحة المستهدفات', icon: Target },
  { id: '947-02', number: '947-02', title: 'الأهداف المالية', icon: DollarSign },
  { id: '947-03', number: '947-03', title: 'أهداف المشاريع', icon: Briefcase },
  { id: '947-04', number: '947-04', title: 'أهداف العملاء', icon: Users },
  { id: '947-05', number: '947-05', title: 'مؤشرات الأداء', icon: TrendingUp },
  { id: '947-06', number: '947-06', title: 'التقارير والتحليل', icon: BarChart3 },
  { id: '947-07', number: '947-07', title: 'الإعدادات', icon: Settings }
];

const TargetsGoals_Complete_947_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('947-01');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalTarget | null>(null);

  // إعدادات
  const [targetName, setTargetName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAutoReports, setEnableAutoReports] = useState(true);

  // بيانات تجريبية
  const [targets] = useState<GoalTarget[]>([
    {
      id: 'T1', name: 'إيرادات الربع الرابع', type: 'financial', period: 'quarterly',
      targetValue: 5000000, currentValue: 3850000, unit: 'ريال', startDate: '2025-10-01',
      endDate: '2025-12-31', responsible: 'قسم المالية', status: 'ontrack', priority: 'high'
    },
    {
      id: 'T2', name: 'عدد المشاريع الجديدة', type: 'projects', period: 'monthly',
      targetValue: 15, currentValue: 12, unit: 'مشروع', startDate: '2025-10-01',
      endDate: '2025-10-31', responsible: 'إدارة المشاريع', status: 'ontrack', priority: 'high'
    },
    {
      id: 'T3', name: 'رضا العملاء', type: 'quality', period: 'monthly',
      targetValue: 95, currentValue: 88, unit: '%', startDate: '2025-10-01',
      endDate: '2025-10-31', responsible: 'خدمة العملاء', status: 'delayed', priority: 'medium'
    },
    {
      id: 'T4', name: 'عملاء جدد', type: 'clients', period: 'monthly',
      targetValue: 20, currentValue: 23, unit: 'عميل', startDate: '2025-10-01',
      endDate: '2025-10-31', responsible: 'قسم التسويق', status: 'achieved', priority: 'medium'
    },
    {
      id: 'T5', name: 'كفاءة التنفيذ', type: 'performance', period: 'weekly',
      targetValue: 90, currentValue: 85, unit: '%', startDate: '2025-10-21',
      endDate: '2025-10-27', responsible: 'العمليات', status: 'ontrack', priority: 'low'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      ontrack: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">على المسار</Badge>,
      delayed: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">متأخر</Badge>,
      achieved: <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-5">محقق</Badge>,
      pending: <Badge className="bg-gray-500 text-white text-xs px-1.5 py-0 h-5">معلق</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">عالية</Badge>,
      medium: <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0 h-5">متوسطة</Badge>,
      low: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">منخفضة</Badge>
    };
    return badges[priority as keyof typeof badges] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 70) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '947-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة المستهدفات</h2>
                <Badge className="bg-blue-500 text-white text-xs px-2 py-0">{targets.length} مستهدف</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-3 w-3 ml-1" />مستهدف جديد
                </Button>
              </div>
            </div>

            {/* إحصائيات عامة */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'إجمالي المستهدفات', value: targets.length, icon: Target, color: '#3b82f6' },
                { label: 'على المسار', value: targets.filter(t => t.status === 'ontrack').length, icon: CheckCircle, color: '#10b981' },
                { label: 'متأخرة', value: targets.filter(t => t.status === 'delayed').length, icon: AlertCircle, color: '#f59e0b' },
                { label: 'محققة', value: targets.filter(t => t.status === 'achieved').length, icon: Award, color: '#6366f1' },
                { label: 'معلقة', value: targets.filter(t => t.status === 'pending').length, icon: Clock, color: '#6b7280' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول المستهدفات */}
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستهدف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targets.map((target) => {
                      const progress = (target.currentValue / target.targetValue) * 100;
                      return (
                        <TableRow key={target.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.name}</span>
                              <span className="text-xs text-gray-500">{target.currentValue.toLocaleString()} / {target.targetValue.toLocaleString()} {target.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                              {target.type === 'financial' ? 'مالي' :
                               target.type === 'projects' ? 'مشاريع' :
                               target.type === 'clients' ? 'عملاء' :
                               target.type === 'quality' ? 'جودة' : 'أداء'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">
                            {target.period === 'daily' ? 'يومي' :
                             target.period === 'weekly' ? 'أسبوعي' :
                             target.period === 'monthly' ? 'شهري' :
                             target.period === 'quarterly' ? 'ربع سنوي' : 'سنوي'}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="h-2 flex-1" />
                              <span className="text-xs" style={{ color: getProgressColor(progress) }}>
                                {progress.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(target.status)}</TableCell>
                          <TableCell className="text-right py-2">{getPriorityBadge(target.priority)}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.responsible}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
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

      case '947-02':
        const financialTargets = targets.filter(t => t.type === 'financial');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأهداف المالية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />هدف جديد</Button>
            </div>

            {/* بطاقات الأهداف المالية */}
            <div className="grid grid-cols-2 gap-3">
              {financialTargets.map((target) => {
                const progress = (target.currentValue / target.targetValue) * 100;
                return (
                  <Card key={target.id} className="card-element card-rtl">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.name}</h3>
                        {getStatusBadge(target.status)}
                      </div>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {target.currentValue.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">من {target.targetValue.toLocaleString()} {target.unit}</span>
                      </div>

                      <Progress value={progress} className="h-3 mb-2" />
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{progress.toFixed(1)}% مكتمل</span>
                        <span>{target.endDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* إحصائيات مالية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <DollarSign className="h-4 w-4" />
                  ملخص الأداء المالي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'إجمالي المستهدف', value: '12.5M ريال', change: '+12%' },
                    { label: 'المحقق حتى الآن', value: '8.2M ريال', change: '+8%' },
                    { label: 'المتبقي', value: '4.3M ريال', change: '34%' }
                  ].map((item, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                      <p className="text-lg mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 mt-1">{item.change}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '947-03':
        const projectTargets = targets.filter(t => t.type === 'projects');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>أهداف المشاريع</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />هدف جديد</Button>
            </div>

            {/* قائمة أهداف المشاريع */}
            {projectTargets.map((target) => {
              const progress = (target.currentValue / target.targetValue) * 100;
              return (
                <Card key={target.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.name}</h3>
                          <p className="text-xs text-gray-500">{target.responsible}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(target.status)}
                        {getPriorityBadge(target.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستهدف</p>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.targetValue} {target.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنجز</p>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.currentValue} {target.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.targetValue - target.currentValue} {target.unit}</p>
                      </div>
                    </div>

                    <Progress value={progress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>التقدم: {progress.toFixed(1)}%</span>
                      <span>الموعد النهائي: {target.endDate}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case '947-04':
        const clientTargets = targets.filter(t => t.type === 'clients');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>أهداف العملاء</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />هدف جديد</Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {clientTargets.map((target) => {
                const progress = (target.currentValue / target.targetValue) * 100;
                return (
                  <Card key={target.id} className="card-element card-rtl">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.name}</h3>
                          <p className="text-xs text-gray-500">{target.period === 'monthly' ? 'شهري' : target.period}</p>
                        </div>
                        {getStatusBadge(target.status)}
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="text-center">
                          <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.currentValue}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحقق</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>{target.targetValue}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستهدف</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', color: getProgressColor(progress) }}>
                            {progress.toFixed(0)}%
                          </p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</p>
                        </div>
                      </div>

                      <Progress value={progress} className="h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '947-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>مؤشرات الأداء (KPIs)</h2>
              <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
            </div>

            {/* مؤشرات الأداء الرئيسية */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'معدل الإنجاز', value: '78%', target: '85%', status: 'delayed' },
                { name: 'الأداء الكلي', value: '85%', target: '80%', status: 'achieved' },
                { name: 'رضا العملاء', value: '88%', target: '95%', status: 'ontrack' },
                { name: 'الجودة', value: '92%', target: '90%', status: 'achieved' }
              ].map((kpi, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <Activity className="h-4 w-4 text-blue-600" />
                      {getStatusBadge(kpi.status)}
                    </div>
                    <h3 className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{kpi.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{kpi.value}</span>
                      <span className="text-xs text-gray-500">/ {kpi.target}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رسم بياني للأداء */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <LineChart className="h-4 w-4" />
                  اتجاه الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسم بياني للأداء (يتطلب مكتبة Charts)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '947-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والتحليل</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><FileText className="h-3 w-3 ml-1" />تقرير جديد</Button>
              </div>
            </div>

            {/* أنواع التقارير */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'تقرير الأداء الشهري', icon: BarChart3, count: 12 },
                { name: 'تقرير المستهدفات', icon: Target, count: 8 },
                { name: 'تقرير المقارنات', icon: PieChart, count: 5 },
                { name: 'التقرير التنفيذي', icon: FileText, count: 3 },
                { name: 'تقرير التوقعات', icon: TrendingUp, count: 6 },
                { name: 'تقارير مخصصة', icon: Settings, count: 4 }
              ].map((report, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3 mb-2">
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
                  <Clock className="h-4 w-4" />
                  آخر التقارير المنشأة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { name: 'تقرير الأداء - أكتوبر 2025', date: '2025-10-24', type: 'أداء' },
                    { name: 'مقارنة المستهدفات Q3 vs Q4', date: '2025-10-20', type: 'مقارنة' },
                    { name: 'التقرير التنفيذي الشهري', date: '2025-10-15', type: 'تنفيذي' }
                  ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.name}</p>
                          <p className="text-xs text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{report.type}</Badge>
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Download className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '947-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات المستهدفات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ التغييرات</Button>
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
                  id="enable-notifications"
                  label="تفعيل التنبيهات"
                  description="إرسال تنبيهات عند اقتراب المواعيد النهائية"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="enable-auto-reports"
                  label="التقارير التلقائية"
                  description="إنشاء تقارير دورية تلقائياً"
                  checked={enableAutoReports}
                  onCheckedChange={setEnableAutoReports}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <Label className="text-xs">تكرار التقارير</Label>
                  <SelectWithCopy
                    id="report-frequency"
                    label=""
                    value="weekly"
                    onChange={() => {}}
                    options={[
                      { value: 'daily', label: 'يومي' },
                      { value: 'weekly', label: 'أسبوعي' },
                      { value: 'monthly', label: 'شهري' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* إعدادات التنبيهات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertCircle className="h-4 w-4" />
                  إعدادات التنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="form-rtl">
                  <Label className="text-xs">التنبيه قبل الموعد النهائي (أيام)</Label>
                  <InputWithCopy
                    id="alert-days"
                    value="7"
                    onChange={() => {}}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="alert-delayed"
                  label="تنبيه المستهدفات المتأخرة"
                  description="إرسال تنبيه يومي للمستهدفات المتأخرة"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="warning"
                />

                <EnhancedSwitch
                  id="alert-achieved"
                  label="تنبيه عند تحقيق الهدف"
                  description="إرسال إشعار عند تحقيق المستهدف"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
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
      <CodeDisplay code="SCR-947" position="top-right" />
      
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
              <Target 
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
                  المستهدفات والأهداف
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
                    947
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
                إدارة ومتابعة المستهدفات والأهداف
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
    </div>
  );
};

export default TargetsGoals_Complete_947_v8;
