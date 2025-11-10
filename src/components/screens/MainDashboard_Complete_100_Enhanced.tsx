/**
 * الشاشة 100 - لوحة التحكم الرئيسية - جميع التابات مطورة بالكامل
 * =====================================================
 * 
 * 12 تبويب مطور بشكل كامل مع بيانات تجريبية شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

const TABS_CONFIG = [
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

const MainDashboard_Complete_100_Enhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('100-01');
  const [searchQuery, setSearchQuery] = useState('');

  // بيانات تجريبية شاملة
  const dashboardData = useMemo(() => ({
    metrics: [
      { id: '1', label: 'إجمالي الإيرادات', value: '12,450,000 ر.س', change: 12.5, trend: 'up', icon: DollarSign, color: 'text-green-600', percentage: 83 },
      { id: '2', label: 'العملاء النشطين', value: '342', change: 8.2, trend: 'up', icon: Users, color: 'text-blue-600', percentage: 85 },
      { id: '3', label: 'المشاريع الجارية', value: '45', change: 5.3, trend: 'up', icon: Briefcase, color: 'text-purple-600', percentage: 90 },
      { id: '4', label: 'معدل الإنجاز', value: '87.5%', change: 2.8, trend: 'up', icon: Target, color: 'text-orange-600', percentage: 92 },
      { id: '5', label: 'المعاملات اليومية', value: '128', change: -3.5, trend: 'down', icon: FileText, color: 'text-cyan-600', percentage: 85 },
      { id: '6', label: 'رضا العملاء', value: '4.7/5', change: 0.3, trend: 'up', icon: Star, color: 'text-yellow-600', percentage: 94 },
      { id: '7', label: 'قيمة المخزون', value: '2,850,000 ر.س', change: -2.1, trend: 'down', icon: Package, color: 'text-indigo-600', percentage: 78 },
      { id: '8', label: 'عدد الموظفين', value: '156', change: 4.0, trend: 'up', icon: Users, color: 'text-pink-600', percentage: 92 },
    ],
    financialSummary: [
      { month: 'يناير', revenue: 850000, expenses: 520000, profit: 330000, margin: 38.8 },
      { month: 'فبراير', revenue: 920000, expenses: 550000, profit: 370000, margin: 40.2 },
      { month: 'مارس', revenue: 1100000, expenses: 650000, profit: 450000, margin: 40.9 },
      { month: 'أبريل', revenue: 980000, expenses: 580000, profit: 400000, margin: 40.8 },
      { month: 'مايو', revenue: 1050000, expenses: 610000, profit: 440000, margin: 41.9 },
      { month: 'يونيو', revenue: 1220000, expenses: 660000, profit: 560000, margin: 45.9 },
    ],
    clients: [
      { id: '1', name: 'شركة التطوير العقاري', category: 'عقارات', revenue: 5500000, projects: 3, rating: 4.8, status: 'vip' },
      { id: '2', name: 'وزارة الشؤون البلدية', category: 'حكومي', revenue: 12000000, projects: 2, rating: 4.9, status: 'vip' },
      { id: '3', name: 'مكتب الهندسة المتقدمة', category: 'استشاري', revenue: 850000, projects: 1, rating: 4.5, status: 'active' },
    ],
    projects: [
      { id: '1', name: 'تصميم المجمع السكني', client: 'شركة التطوير', progress: 75, status: 'on-track', deadline: '2025-12-31', budget: 3000000, spent: 2250000 },
      { id: '2', name: 'الإشراف على الطريق', client: 'الشؤون البلدية', progress: 45, status: 'at-risk', deadline: '2026-06-30', budget: 8000000, spent: 3600000 },
      { id: '3', name: 'تطوير مركز تجاري', client: 'مؤسسة الاستثمار', progress: 90, status: 'on-track', deadline: '2025-11-15', budget: 2500000, spent: 2300000 },
    ],
    employees: [
      { id: '1', name: 'أحمد محمد علي', department: 'الهندسة', position: 'مهندس أول', performance: 92, attendance: 98, tasks: 45, status: 'active' },
      { id: '2', name: 'فاطمة سالم', department: 'المحاسبة', position: 'محاسب قانوني', performance: 88, attendance: 95, tasks: 38, status: 'active' },
      { id: '3', name: 'خالد عبدالله', department: 'المبيعات', position: 'مدير مبيعات', performance: 95, attendance: 100, tasks: 52, status: 'active' },
    ],
    inventory: [
      { id: '1', item: 'مواد خام - نوع A', category: 'مواد بناء', quantity: 85, minLevel: 100, value: 425000, status: 'low' },
      { id: '2', item: 'إسمنت - ممتاز', category: 'مواد بناء', quantity: 500, minLevel: 200, value: 140000, status: 'ok' },
      { id: '3', item: 'معدات يدوية', category: 'أدوات', quantity: 0, minLevel: 5, value: 0, status: 'out' },
    ],
    transactions: [
      { id: '1', number: 'TRX-2025-001', type: 'بيع', client: 'شركة التطوير', amount: 115000, date: '2025-10-12', status: 'completed' },
      { id: '2', number: 'TRX-2025-002', type: 'شراء', supplier: 'مؤسسة المواد', amount: 45000, date: '2025-10-11', status: 'pending' },
      { id: '3', number: 'TRX-2025-003', type: 'بيع', client: 'مكتب الهندسة', amount: 85000, date: '2025-10-10', status: 'completed' },
    ],
    alerts: [
      { id: '1', title: 'مخزون منخفض', message: 'مستوى المخزون أقل من الحد الأدنى', severity: 'high', category: 'مخزون', timestamp: '2025-10-12 14:00' },
      { id: '2', title: 'فاتورة متأخرة', message: 'فاتورة متأخرة 7 أيام', severity: 'medium', category: 'مالية', timestamp: '2025-10-12 10:30' },
      { id: '3', title: 'موعد اجتماع', message: 'اجتماع مع العميل غداً', severity: 'low', category: 'جدولة', timestamp: '2025-10-11 15:00' },
    ],
    activities: [
      { id: '1', title: 'معاملة #2025-1234', description: 'تم إضافة معاملة جديدة', user: 'أحمد محمد', timestamp: '2025-10-12 14:32', amount: 115000 },
      { id: '2', title: 'عميل جديد', description: 'تم تسجيل: مكتب الهندسة', user: 'فاطمة علي', timestamp: '2025-10-12 13:15' },
      { id: '3', title: 'تحديث مشروع', description: 'تحديث: المجمع السكني', user: 'خالد سعيد', timestamp: '2025-10-12 12:45' },
    ],
  }), []);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 100-01: نظرة عامة
      case '100-01':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-stats-grid mb-4">
              {dashboardData.metrics.map((m) => (
                <Card key={m.id} className="dense-stat-card">
                  <div className={`w-8 h-8 rounded-full bg-${m.color.split('-')[1]}-50 flex items-center justify-center mb-2`}>
                    {React.createElement(m.icon, { className: `h-4 w-4 ${m.color}` })}
                  </div>
                  <div className={`dense-stat-number ${m.color}`}>{m.value}</div>
                  <div className="dense-stat-label">{m.label}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {m.trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-green-600" /> : <ArrowDownRight className="h-3 w-3 text-red-600" />}
                    <span className={`text-xs ${m.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.change > 0 ? '+' : ''}{m.change}%
                    </span>
                  </div>
                  <Progress value={m.percentage} className="h-1 mt-2" />
                </Card>
              ))}
            </div>
          </div>
        );

      // 100-02: المؤشرات المالية
      case '100-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><DollarSign className="h-5 w-5" />المؤشرات المالية التفصيلية</h2>
                <Button className="dense-btn dense-btn-secondary"><Download className="h-3 w-3" />تصدير</Button>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid mb-4">
                  <Card className="dense-content-card text-center">
                    <div className="compact-subtitle text-green-600 mb-1">إجمالي الإيرادات</div>
                    <div className="text-xl font-bold text-green-600">
                      {dashboardData.financialSummary.reduce((sum, m) => sum + m.revenue, 0).toLocaleString('ar-SA')} ر.س
                    </div>
                  </Card>
                  <Card className="dense-content-card text-center">
                    <div className="compact-subtitle text-red-600 mb-1">إجمالي المصروفات</div>
                    <div className="text-xl font-bold text-red-600">
                      {dashboardData.financialSummary.reduce((sum, m) => sum + m.expenses, 0).toLocaleString('ar-SA')} ر.س
                    </div>
                  </Card>
                  <Card className="dense-content-card text-center">
                    <div className="compact-subtitle text-blue-600 mb-1">صافي الربح</div>
                    <div className="text-xl font-bold text-blue-600">
                      {dashboardData.financialSummary.reduce((sum, m) => sum + m.profit, 0).toLocaleString('ar-SA')} ر.س
                    </div>
                  </Card>
                  <Card className="dense-content-card text-center">
                    <div className="compact-subtitle text-purple-600 mb-1">متوسط الهامش</div>
                    <div className="text-xl font-bold text-purple-600">
                      {(dashboardData.financialSummary.reduce((sum, m) => sum + m.margin, 0) / dashboardData.financialSummary.length).toFixed(1)}%
                    </div>
                  </Card>
                </div>

                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الشهر</TableHead>
                      <TableHead className="text-right">الإيرادات</TableHead>
                      <TableHead className="text-right">المصروفات</TableHead>
                      <TableHead className="text-right">الربح</TableHead>
                      <TableHead className="text-right">الهامش</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.financialSummary.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-right font-medium">{row.month}</TableCell>
                        <TableCell className="text-right text-green-600">{row.revenue.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right text-red-600">{row.expenses.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right text-blue-600 font-medium">{row.profit.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right"><Badge className="bg-purple-100 text-purple-700">{row.margin.toFixed(1)}%</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 100-03: العملاء والمشاريع
      case '100-03':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-grid dense-grid-2">
              <Card className="dense-section">
                <CardHeader className="dense-section-header">
                  <h3 className="dense-section-title"><Users className="h-4 w-4" />أهم العملاء</h3>
                </CardHeader>
                <CardContent>
                  {dashboardData.clients.map((client) => (
                    <Card key={client.id} className="dense-content-card mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="compact-title">{client.name}</div>
                          <div className="compact-subtitle">{client.category}</div>
                        </div>
                        <Badge className={client.status === 'vip' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                          {client.status === 'vip' ? 'VIP' : 'نشط'}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="dense-grid dense-grid-3">
                        <div className="text-center">
                          <div className="compact-subtitle">الإيرادات</div>
                          <div className="compact-text font-medium text-green-600">{(client.revenue / 1000000).toFixed(1)}M ر.س</div>
                        </div>
                        <div className="text-center">
                          <div className="compact-subtitle">المشاريع</div>
                          <div className="compact-text font-medium text-blue-600">{client.projects}</div>
                        </div>
                        <div className="text-center">
                          <div className="compact-subtitle">التقييم</div>
                          <div className="compact-text font-medium text-yellow-600 flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400" />{client.rating}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card className="dense-section">
                <CardHeader className="dense-section-header">
                  <h3 className="dense-section-title"><Briefcase className="h-4 w-4" />المشاريع النشطة</h3>
                </CardHeader>
                <CardContent>
                  {dashboardData.projects.map((project) => (
                    <Card key={project.id} className="dense-content-card mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="compact-title">{project.name}</div>
                          <div className="compact-subtitle">{project.client}</div>
                        </div>
                        <Badge className={project.status === 'on-track' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {project.status === 'on-track' ? 'في المسار' : 'معرض للخطر'}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="compact-subtitle">التقدم</span>
                          <span className="compact-text font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="dense-grid dense-grid-3">
                        <div className="text-center">
                          <div className="compact-subtitle">الموعد</div>
                          <div className="compact-text font-medium">{project.deadline}</div>
                        </div>
                        <div className="text-center">
                          <div className="compact-subtitle">الميزانية</div>
                          <div className="compact-text font-medium">{(project.budget / 1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-center">
                          <div className="compact-subtitle">المصروف</div>
                          <div className="compact-text font-medium text-orange-600">{(project.spent / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      // 100-04: الموارد البشرية
      case '100-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Users className="h-5 w-5" />مقاييس الموارد البشرية</h2>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid mb-4">
                  {[
                    { label: 'إجمالي الموظفين', value: '156', color: 'text-blue-600' },
                    { label: 'نشط', value: '142', color: 'text-green-600' },
                    { label: 'في إجازة', value: '8', color: 'text-yellow-600' },
                    { label: 'عن بعد', value: '6', color: 'text-purple-600' },
                  ].map((stat, i) => (
                    <Card key={i} className="dense-content-card text-center">
                      <div className="compact-subtitle mb-1">{stat.label}</div>
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    </Card>
                  ))}
                </div>

                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الموظف</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">المنصب</TableHead>
                      <TableHead className="text-right">الأداء</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="text-right font-medium">{emp.name}</TableCell>
                        <TableCell className="text-right">{emp.department}</TableCell>
                        <TableCell className="text-right">{emp.position}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <Progress value={emp.performance} className="h-2 w-16" />
                            <span className="compact-text">{emp.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right"><Badge className="bg-green-100 text-green-700">نشط</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      // 100-05: المخزون والمشتريات
      case '100-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Package className="h-5 w-5" />إدارة المخزون</h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary"><Plus className="h-3 w-3" />إضافة صنف</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الصنف</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الحد الأدنى</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-right font-medium">{item.item}</TableCell>
                        <TableCell className="text-right">{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.minLevel}</TableCell>
                        <TableCell className="text-right">{item.value.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            item.status === 'low' ? 'bg-orange-100 text-orange-700' :
                            item.status === 'out' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {item.status === 'low' ? 'منخفض' : item.status === 'out' ? 'نفذ' : 'متوفر'}
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

      // 100-06: المعاملات والوثائق
      case '100-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><FileText className="h-5 w-5" />المعاملات والوثائق</h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary"><Plus className="h-3 w-3" />معاملة جديدة</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المعاملة</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">العميل/المورد</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.transactions.map((trx) => (
                      <TableRow key={trx.id}>
                        <TableCell className="text-right font-medium">
                          <code className="font-code text-xs">{trx.number}</code>
                        </TableCell>
                        <TableCell className="text-right">{trx.type}</TableCell>
                        <TableCell className="text-right">{trx.client || trx.supplier}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {trx.amount.toLocaleString('ar-SA')} ر.س
                        </TableCell>
                        <TableCell className="text-right">{trx.date}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={trx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {trx.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
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

      // 100-07: الأداء والجودة
      case '100-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Target className="h-5 w-5" />مؤشرات الأداء والجودة</h2>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid">
                  {[
                    { label: 'معدل الإنجاز', value: '87.5%', target: 90, color: 'text-green-600' },
                    { label: 'رضا العملاء', value: '4.7/5', target: 100, color: 'text-blue-600' },
                    { label: 'جودة التسليم', value: '92%', target: 95, color: 'text-purple-600' },
                    { label: 'الالتزام بالمواعيد', value: '88%', target: 100, color: 'text-orange-600' },
                  ].map((kpi, i) => (
                    <Card key={i} className="dense-content-card text-center p-4">
                      <div className="compact-subtitle mb-2">{kpi.label}</div>
                      <div className={`text-2xl font-bold ${kpi.color} mb-2`}>{kpi.value}</div>
                      <Progress value={parseFloat(kpi.value)} className="h-2 mb-1" />
                      <div className="compact-subtitle">الهدف: {kpi.target}%</div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 100-08: التنبيهات والإشعارات
      case '100-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Bell className="h-5 w-5" />التنبيهات والإشعارات</h2>
                <Badge className="bg-red-100 text-red-700">{dashboardData.alerts.length} تنبيه</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-md border ${
                        alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                        alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="compact-title mb-1">{alert.title}</div>
                          <div className="compact-subtitle">{alert.message}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                            <span className="text-xs text-gray-500">{alert.timestamp}</span>
                          </div>
                        </div>
                        <Badge className={
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 100-09: التقارير التحليلية
      case '100-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><BarChart3 className="h-5 w-5" />التقارير التحليلية</h2>
                <Button className="dense-btn dense-btn-secondary"><Download className="h-3 w-3" />تصدير الكل</Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-3">
                  {[
                    { title: 'تقرير المبيعات الشهري', type: 'مالي', date: '2025-10-12', size: '2.4 MB' },
                    { title: 'تحليل أداء الموظفين', type: 'موارد بشرية', date: '2025-10-11', size: '1.8 MB' },
                    { title: 'تقرير حالة المشاريع', type: 'مشاريع', date: '2025-10-10', size: '3.2 MB' },
                    { title: 'تحليل رضا العملاء', type: 'عملاء', date: '2025-10-09', size: '1.5 MB' },
                  ].map((report, i) => (
                    <Card key={i} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="compact-title mb-1">{report.title}</div>
                          <div className="compact-subtitle">{report.type}</div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">{report.type}</Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <div className="compact-subtitle">{report.date} • {report.size}</div>
                        <div className="flex items-center gap-1">
                          <Button className="dense-btn dense-btn-secondary p-1 w-7 h-7"><Eye className="h-3 w-3" /></Button>
                          <Button className="dense-btn dense-btn-primary p-1 w-7 h-7"><Download className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 100-10: الأنشطة الأخيرة
      case '100-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Activity className="h-5 w-5" />الأنشطة الأخيرة</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="compact-title mb-1">{activity.title}</div>
                        <div className="compact-subtitle">{activity.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{activity.user}</span>
                          {activity.amount && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs font-medium text-green-600">
                                {activity.amount.toLocaleString('ar-SA')} ر.س
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 100-11: الإجراءات السريعة
      case '100-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Zap className="h-5 w-5" />الإجراءات السريعة</h2>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-3">
                  {[
                    { title: 'معاملة جديدة', icon: Plus, color: 'bg-blue-500', count: 0 },
                    { title: 'المعاملات المعلقة', icon: Clock, color: 'bg-yellow-500', count: 23 },
                    { title: 'تقرير يومي', icon: FileText, color: 'bg-green-500', count: 0 },
                    { title: 'العملاء الجدد', icon: Users, color: 'bg-purple-500', count: 8 },
                    { title: 'المهام العاجلة', icon: AlertCircle, color: 'bg-red-500', count: 5 },
                    { title: 'الفواتير', icon: DollarSign, color: 'bg-indigo-500', count: 12 },
                  ].map((action, i) => (
                    <button key={i} className="dense-content-card text-center p-4 cursor-pointer hover:shadow-lg transition-all">
                      <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-2`}>
                        {React.createElement(action.icon, { className: 'h-6 w-6 text-white' })}
                      </div>
                      <div className="compact-title mb-1">{action.title}</div>
                      {action.count > 0 && <Badge className="bg-red-100 text-red-700">{action.count}</Badge>}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 100-12: الإعدادات
      case '100-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title"><Settings className="h-5 w-5" />إعدادات لوحة التحكم</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="dense-form-group">
                    <label className="dense-form-label">فترة التحديث التلقائي</label>
                    <select className="dense-form-select">
                      <option>كل دقيقة</option>
                      <option>كل 5 دقائق</option>
                      <option>كل 10 دقائق</option>
                      <option>يدوي</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">عرض المؤشرات</label>
                    <div className="space-y-2">
                      {['المؤشرات المالية', 'مؤشرات العملاء', 'مؤشرات المشاريع', 'مؤشرات الموظفين'].map((item, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span className="compact-text">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="dense-btn dense-btn-primary flex-1">حفظ الإعدادات</Button>
                    <Button className="dense-btn dense-btn-secondary flex-1">إعادة تعيين</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لوحة التحكم الرئيسية
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                12 تبويب • الشاشة 100
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              نشط
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 100 - لوحة التحكم الرئيسية
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  جميع التابات مطورة بالكامل • 12 تبويب شامل
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                مكتمل 100%
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-100</code>
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

export default MainDashboard_Complete_100_Enhanced;
