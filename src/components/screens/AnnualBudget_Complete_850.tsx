/**
 * الشاشة 850 - الميزانية السنوية - نظام شامل ومتكامل
 * =======================================================
 * 
 * نظام إدارة الميزانية السنوية للمكتب الهندسي:
 * - الميزانية التشغيلية والرأسمالية
 * - مصروفات المشاريع والرواتب
 * - الإيرادات والتدفقات النقدية
 * - التحليل المالي والمقارنات
 * - التوافق مع النظام السعودي (ZATCA, SOCPA)
 * - دعم التقويم الهجري والميلادي
 * - حساب الزكاة وضريبة القيمة المضافة
 * 
 * التطوير: نوفمبر 2025 - v1.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar, FileText, PieChart,
  BarChart3, Activity, AlertCircle, CheckCircle, Clock, Settings,
  Download, Upload, Plus, Eye, Edit, Trash2, Search, Filter,
  Save, RefreshCw, Calculator, Briefcase, Users, Building2,
  Wallet, CreditCard, Receipt, FileSpreadsheet, Target, Award,
  Layers, Package, Zap, ShoppingCart, Home, Car, Hammer
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 12 تبويب شامل =====
const TABS_CONFIG = [
  { id: '850-01', number: '850-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '850-02', number: '850-02', title: 'الميزانية التشغيلية', icon: Activity },
  { id: '850-03', number: '850-03', title: 'الميزانية الرأسمالية', icon: Building2 },
  { id: '850-04', number: '850-04', title: 'الرواتب والأجور', icon: Users },
  { id: '850-05', number: '850-05', title: 'المصروفات الإدارية', icon: Briefcase },
  { id: '850-06', number: '850-06', title: 'الإيرادات المتوقعة', icon: TrendingUp },
  { id: '850-07', number: '850-07', title: 'التدفقات النقدية', icon: Wallet },
  { id: '850-08', number: '850-08', title: 'التحليل المالي', icon: PieChart },
  { id: '850-09', number: '850-09', title: 'المقارنات', icon: Target },
  { id: '850-10', number: '850-10', title: 'التقارير المالية', icon: FileSpreadsheet },
  { id: '850-11', number: '850-11', title: 'الموافقات', icon: Award },
  { id: '850-12', number: '850-12', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع البنود =====
const BUDGET_CATEGORIES = [
  { id: 'operational', name: 'تشغيلية', color: 'blue' },
  { id: 'capital', name: 'رأسمالية', color: 'purple' },
  { id: 'projects', name: 'مشاريع', color: 'green' },
  { id: 'admin', name: 'إدارية', color: 'yellow' },
];

// ===== الفترات المالية =====
const FISCAL_PERIODS = [
  { id: '2025', name: '2025 (1446-1447 هـ)', isActive: true },
  { id: '2024', name: '2024 (1445-1446 هـ)', isActive: false },
  { id: '2023', name: '2023 (1444-1445 هـ)', isActive: false },
];

// ===== الأشهر =====
const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const AnnualBudget_Complete_850: React.FC = () => {
  const [activeTab, setActiveTab] = useState('850-01');
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // بيانات تجريبية - الميزانية الإجمالية
  const totalBudget = {
    planned: 15000000, // 15 مليون ريال
    actual: 11250000,  // 11.25 مليون ريال
    variance: 3750000, // فرق 3.75 مليون
    percentage: 75,    // نسبة التنفيذ 75%
  };

  // بيانات تجريبية - توزيع الميزانية
  const budgetDistribution = [
    { category: 'الرواتب والأجور', planned: 6000000, actual: 5850000, percentage: 97.5 },
    { category: 'مصروفات المشاريع', planned: 4500000, actual: 3200000, percentage: 71.1 },
    { category: 'المصروفات الإدارية', planned: 2000000, actual: 1500000, percentage: 75.0 },
    { category: 'الاستثمارات الرأسمالية', planned: 1500000, actual: 500000, percentage: 33.3 },
    { category: 'التسويق والإعلان', planned: 500000, actual: 100000, percentage: 20.0 },
    { category: 'التدريب والتطوير', planned: 300000, actual: 50000, percentage: 16.7 },
    { category: 'الصيانة والتشغيل', planned: 200000, actual: 50000, percentage: 25.0 },
  ];

  // بيانات الإيرادات
  const revenueData = [
    { source: 'استشارات هندسية', planned: 8000000, actual: 7200000, percentage: 90.0 },
    { source: 'إدارة مشاريع', planned: 5000000, actual: 3800000, percentage: 76.0 },
    { source: 'تصميم معماري', planned: 3000000, actual: 2400000, percentage: 80.0 },
    { source: 'دراسات جدوى', planned: 1500000, actual: 950000, percentage: 63.3 },
    { source: 'خدمات أخرى', planned: 500000, actual: 150000, percentage: 30.0 },
  ];

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 850-01: نظرة عامة
      case '850-01':
        return (
          <div className="universal-dense-tab-content">
            {/* إحصائيات رئيسية */}
            <div className="dense-stats-grid mb-4">
              <Card className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="dense-stat-number" style={{ color: '#2563eb' }}>
                  {(totalBudget.planned / 1000000).toFixed(1)}م
                </div>
                <div className="dense-stat-label">الميزانية المخططة</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="dense-stat-number" style={{ color: '#10b981' }}>
                  {(totalBudget.actual / 1000000).toFixed(1)}م
                </div>
                <div className="dense-stat-label">المنفذ فعلياً</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="dense-stat-number" style={{ color: '#f59e0b' }}>
                  {totalBudget.percentage}%
                </div>
                <div className="dense-stat-label">نسبة التنفيذ</div>
              </Card>

              <Card className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="dense-stat-number" style={{ color: '#8b5cf6' }}>
                  {(totalBudget.variance / 1000000).toFixed(1)}م
                </div>
                <div className="dense-stat-label">المتبقي</div>
              </Card>
            </div>

            {/* نظرة عامة على الميزانية */}
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  ملخص الميزانية السنوية {selectedPeriod}
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إجمالي الميزانية
                      </span>
                      <Badge className="bg-blue-600 text-white">
                        {totalBudget.planned.toLocaleString()} ريال
                      </Badge>
                    </div>
                    <Progress value={totalBudget.percentage} className="h-3 mb-2" />
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span>المنفذ: {totalBudget.actual.toLocaleString()} ريال</span>
                      <span>المتبقي: {totalBudget.variance.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  {/* الزكاة والضريبة */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium">الزكاة المستحقة</span>
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {(totalBudget.actual * 0.025).toLocaleString()} ريال
                      </div>
                      <div className="text-xs text-green-600">2.5% من رأس المال</div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium">ضريبة القيمة المضافة</span>
                      </div>
                      <div className="text-lg font-bold text-purple-700">
                        {(totalBudget.actual * 0.15).toLocaleString()} ريال
                      </div>
                      <div className="text-xs text-purple-600">15% حسب ZATCA</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* توزيع الميزانية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <PieChart className="h-4 w-4" />
                  توزيع بنود الميزانية
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {budgetDistribution.map((item, index) => (
                    <div key={index} className="dense-content-card p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            item.percentage >= 90 ? 'bg-green-100 text-green-700' :
                            item.percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {item.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>المخطط: {item.planned.toLocaleString()}</span>
                        <span>الفعلي: {item.actual.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-02: الميزانية التشغيلية
      case '850-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Activity className="h-4 w-4" />
                  إضافة بند تشغيلي جديد
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <InputWithCopy
                    label="اسم البند"
                    id="itemName"
                    placeholder="مثال: مصروفات الكهرباء"
                    defaultValue=""
                    required
                  />

                  <SelectWithCopy
                    label="التصنيف"
                    id="category"
                    defaultValue="utilities"
                    options={[
                      { value: 'utilities', label: 'المرافق والخدمات' },
                      { value: 'supplies', label: 'المستلزمات المكتبية' },
                      { value: 'maintenance', label: 'الصيانة والتشغيل' },
                      { value: 'transportation', label: 'النقل والمواصلات' },
                      { value: 'communications', label: 'الاتصالات والإنترنت' },
                      { value: 'other', label: 'أخرى' },
                    ]}
                  />

                  <InputWithCopy
                    label="المبلغ المخطط (ريال)"
                    id="plannedAmount"
                    type="number"
                    placeholder="0.00"
                    defaultValue=""
                    required
                  />

                  <SelectWithCopy
                    label="التكرار"
                    id="frequency"
                    defaultValue="monthly"
                    options={[
                      { value: 'monthly', label: 'شهري' },
                      { value: 'quarterly', label: 'ربع سنوي' },
                      { value: 'semi-annual', label: 'نصف سنوي' },
                      { value: 'annual', label: 'سنوي' },
                    ]}
                  />

                  <DateInputWithToday
                    label="تاريخ البداية"
                    id="startDate"
                  />

                  <DateInputWithToday
                    label="تاريخ الانتهاء"
                    id="endDate"
                  />

                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="الوصف والملاحظات"
                      id="description"
                      placeholder="وصف تفصيلي للبند..."
                      rows={3}
                      defaultValue=""
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* قائمة البنود التشغيلية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layers className="h-4 w-4" />
                  البنود التشغيلية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Search className="h-3 w-3" />
                    بحث
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم البند</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right">المخطط</TableHead>
                      <TableHead className="text-right">الفعلي</TableHead>
                      <TableHead className="text-right">النسبة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'الكهرباء والماء', category: 'المرافق', planned: 120000, actual: 95000, status: 'active' },
                      { name: 'الاتصالات والإنترنت', category: 'الاتصالات', planned: 48000, actual: 42000, status: 'active' },
                      { name: 'المستلزمات المكتبية', category: 'المستلزمات', planned: 60000, actual: 38000, status: 'active' },
                      { name: 'الصيانة الدورية', category: 'الصيانة', planned: 80000, actual: 25000, status: 'active' },
                    ].map((item, index) => {
                      const percentage = (item.actual / item.planned) * 100;
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-right font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs bg-blue-100 text-blue-700">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.planned.toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="text-right">
                            {item.actual.toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              percentage >= 90 ? 'bg-green-100 text-green-700' :
                              percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {percentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-700">نشط</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn">
                                <Trash2 className="h-3 w-3" />
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

      // 850-03: الميزانية الرأسمالية
      case '850-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Building2 className="h-4 w-4" />
                  الاستثمارات الرأسمالية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة استثمار
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'معدات مساحة وتصوير', 
                      type: 'معدات', 
                      amount: 500000, 
                      paid: 500000,
                      depreciation: 5,
                      date: '2025-01-15',
                      status: 'completed'
                    },
                    { 
                      name: 'أجهزة كمبيوتر وبرامج', 
                      type: 'تكنولوجيا', 
                      amount: 300000, 
                      paid: 150000,
                      depreciation: 4,
                      date: '2025-03-01',
                      status: 'in-progress'
                    },
                    { 
                      name: 'أثاث مكتبي', 
                      type: 'أثاث', 
                      amount: 200000, 
                      paid: 0,
                      depreciation: 10,
                      date: '2025-06-01',
                      status: 'planned'
                    },
                  ].map((item, index) => {
                    const percentage = (item.paid / item.amount) * 100;
                    return (
                      <div key={index} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{item.name}</span>
                              <Badge className="text-xs bg-purple-100 text-purple-700">
                                {item.type}
                              </Badge>
                              <Badge className={
                                item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }>
                                {item.status === 'completed' ? 'مكتمل' :
                                 item.status === 'in-progress' ? 'قيد التنفيذ' :
                                 'مخطط'}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                              <div>المبلغ الكلي: {item.amount.toLocaleString()} ريال</div>
                              <div>المدفوع: {item.paid.toLocaleString()} ريال</div>
                              <div>الاستهلاك السنوي: {item.depreciation}%</div>
                              <div>التاريخ: {item.date}</div>
                            </div>

                            {item.status !== 'planned' && (
                              <>
                                <Progress value={percentage} className="h-2 mb-1" />
                                <div className="text-xs text-gray-500">
                                  نسبة الإنجاز: {percentage.toFixed(1)}%
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* جدول الاستهلاك */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calculator className="h-4 w-4" />
                  جدول الاستهلاك السنوي
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">إجمالي الاستهلاك السنوي</span>
                      <span className="text-lg font-bold text-blue-700">
                        75,000 ريال
                      </span>
                    </div>
                  </div>

                  <Table className="dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الأصل</TableHead>
                        <TableHead className="text-right">القيمة</TableHead>
                        <TableHead className="text-right">النسبة</TableHead>
                        <TableHead className="text-right">الاستهلاك</TableHead>
                        <TableHead className="text-right">المتبقي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-right">معدات مساحة</TableCell>
                        <TableCell className="text-right">500,000</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                        <TableCell className="text-right">25,000</TableCell>
                        <TableCell className="text-right">475,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-right">أجهزة كمبيوتر</TableCell>
                        <TableCell className="text-right">300,000</TableCell>
                        <TableCell className="text-right">4%</TableCell>
                        <TableCell className="text-right">12,000</TableCell>
                        <TableCell className="text-right">288,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-right">أثاث مكتبي</TableCell>
                        <TableCell className="text-right">200,000</TableCell>
                        <TableCell className="text-right">10%</TableCell>
                        <TableCell className="text-right">20,000</TableCell>
                        <TableCell className="text-right">180,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-04: الرواتب والأجور
      case '850-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Users className="h-4 w-4" />
                  ميزانية الرواتب والأجور
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Calculator className="h-3 w-3" />
                  احتساب
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">إجمالي الرواتب</div>
                    <div className="text-lg font-bold text-blue-700">6,000,000</div>
                    <div className="text-xs text-gray-500">ريال سنوياً</div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">المدفوع</div>
                    <div className="text-lg font-bold text-green-700">5,850,000</div>
                    <div className="text-xs text-gray-500">حتى الآن</div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">GOSI</div>
                    <div className="text-lg font-bold text-purple-700">1,170,000</div>
                    <div className="text-xs text-gray-500">المؤسسة العامة</div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">المكافآت</div>
                    <div className="text-lg font-bold text-yellow-700">300,000</div>
                    <div className="text-xs text-gray-500">سنوية</div>
                  </div>
                </div>

                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">العدد</TableHead>
                      <TableHead className="text-right">متوسط الراتب</TableHead>
                      <TableHead className="text-right">الإجمالي الشهري</TableHead>
                      <TableHead className="text-right">الإجمالي السنوي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { category: 'مهندسون', count: 12, avgSalary: 15000, status: 'active' },
                      { category: 'فنيون', count: 8, avgSalary: 8000, status: 'active' },
                      { category: 'إداريون', count: 5, avgSalary: 6000, status: 'active' },
                      { category: 'عمال', count: 15, avgSalary: 3000, status: 'active' },
                    ].map((item, index) => {
                      const monthlyTotal = item.count * item.avgSalary;
                      const annualTotal = monthlyTotal * 12;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-right font-medium">{item.category}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-700">
                              {item.count}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.avgSalary.toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {monthlyTotal.toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-700">
                            {annualTotal.toLocaleString()} ريال
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* البدلات والمزايا */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <CreditCard className="h-4 w-4" />
                  البدلات والمزايا الإضافية
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'بدل سكن', monthly: 50000, annual: 600000, employees: 20 },
                    { name: 'بدل نقل', monthly: 30000, annual: 360000, employees: 40 },
                    { name: 'التأمين الطبي', monthly: 40000, annual: 480000, employees: 40 },
                    { name: 'مكافآت الأداء', monthly: 25000, annual: 300000, employees: 15 },
                  ].map((benefit, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{benefit.name}</span>
                          <Badge className="text-xs bg-purple-100 text-purple-700">
                            {benefit.employees} موظف
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">شهري</div>
                          <div className="font-medium">{benefit.monthly.toLocaleString()} ريال</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          الإجمالي السنوي
                        </div>
                        <div className="text-sm font-bold text-blue-700">
                          {benefit.annual.toLocaleString()} ريال
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-05: المصروفات الإدارية
      case '850-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Briefcase className="h-4 w-4" />
                  المصروفات الإدارية والعمومية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { 
                      category: 'إيجار المقر', 
                      planned: 240000, 
                      actual: 240000, 
                      frequency: 'شهري',
                      icon: Home,
                      color: 'blue'
                    },
                    { 
                      category: 'المستلزمات المكتبية', 
                      planned: 60000, 
                      actual: 38000, 
                      frequency: 'ربع سنوي',
                      icon: Package,
                      color: 'green'
                    },
                    { 
                      category: 'الاتصالات والإنترنت', 
                      planned: 48000, 
                      actual: 42000, 
                      frequency: 'شهري',
                      icon: Zap,
                      color: 'purple'
                    },
                    { 
                      category: 'الضيافة والاستقبال', 
                      planned: 36000, 
                      actual: 28000, 
                      frequency: 'شهري',
                      icon: ShoppingCart,
                      color: 'yellow'
                    },
                    { 
                      category: 'صيانة السيارات', 
                      planned: 80000, 
                      actual: 45000, 
                      frequency: 'ربع سنوي',
                      icon: Car,
                      color: 'red'
                    },
                  ].map((item, index) => {
                    const percentage = (item.actual / item.planned) * 100;
                    const Icon = item.icon;
                    
                    return (
                      <div key={index} className="dense-content-card p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ 
                                background: `rgba(${
                                  item.color === 'blue' ? '37, 99, 235' :
                                  item.color === 'green' ? '16, 185, 129' :
                                  item.color === 'purple' ? '139, 92, 246' :
                                  item.color === 'yellow' ? '245, 158, 11' :
                                  '239, 68, 68'
                                }, 0.1)`,
                                color: `${
                                  item.color === 'blue' ? '#2563eb' :
                                  item.color === 'green' ? '#10b981' :
                                  item.color === 'purple' ? '#8b5cf6' :
                                  item.color === 'yellow' ? '#f59e0b' :
                                  '#ef4444'
                                }`
                              }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{item.category}</span>
                                <Badge className="text-xs bg-gray-100 text-gray-700">
                                  {item.frequency}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                                <div>
                                  <span className="text-gray-500">المخطط:</span>{' '}
                                  <span className="font-medium">{item.planned.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">الفعلي:</span>{' '}
                                  <span className="font-medium">{item.actual.toLocaleString()}</span>
                                </div>
                              </div>

                              <Progress value={percentage} className="h-2 mb-1" />
                              <div className="text-xs text-gray-500">
                                نسبة الإنفاق: {percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-06: الإيرادات المتوقعة
      case '850-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <TrendingUp className="h-4 w-4" />
                  الإيرادات المتوقعة لعام {selectedPeriod}
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة مصدر
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid mb-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">الإيرادات المتوقعة</div>
                    <div className="text-lg font-bold text-green-700">18,000,000</div>
                    <div className="text-xs text-gray-500">ريال سنوياً</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">الإيرادات الفعلية</div>
                    <div className="text-lg font-bold text-blue-700">14,500,000</div>
                    <div className="text-xs text-gray-500">حتى الآن</div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">نسبة الإنجاز</div>
                    <div className="text-lg font-bold text-yellow-700">80.6%</div>
                    <div className="text-xs text-gray-500">من المتوقع</div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">المتبقي</div>
                    <div className="text-lg font-bold text-purple-700">3,500,000</div>
                    <div className="text-xs text-gray-500">للوصول للهدف</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {revenueData.map((item, index) => {
                    const difference = item.actual - item.planned;
                    const isDifferencePositive = difference >= 0;
                    
                    return (
                      <div key={index} className="dense-content-card p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">{item.source}</span>
                              <Badge className={
                                item.percentage >= 90 ? 'bg-green-100 text-green-700' :
                                item.percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }>
                                {item.percentage.toFixed(1)}%
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                              <div>
                                <div className="text-gray-500">المتوقع</div>
                                <div className="font-medium">{item.planned.toLocaleString()} ريال</div>
                              </div>
                              <div>
                                <div className="text-gray-500">الفعلي</div>
                                <div className="font-medium">{item.actual.toLocaleString()} ريال</div>
                              </div>
                              <div>
                                <div className="text-gray-500">الفرق</div>
                                <div className={isDifferencePositive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                  {isDifferencePositive ? '+' : ''}{difference.toLocaleString()} ريال
                                </div>
                              </div>
                            </div>

                            <Progress value={item.percentage} className="h-2" />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* التوزيع الشهري */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-4 w-4" />
                  التوزيع الشهري للإيرادات
                </h2>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الشهر</TableHead>
                      <TableHead className="text-right">المتوقع</TableHead>
                      <TableHead className="text-right">الفعلي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MONTHS_AR.slice(0, 10).map((month, index) => {
                      const planned = 1500000;
                      const actual = Math.floor(planned * (0.7 + Math.random() * 0.4));
                      const percentage = (actual / planned) * 100;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-right font-medium">{month}</TableCell>
                          <TableCell className="text-right">{planned.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{actual.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              percentage >= 90 ? 'bg-green-100 text-green-700' :
                              percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {percentage.toFixed(0)}%
                            </Badge>
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

      // 850-07: التدفقات النقدية
      case '850-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Wallet className="h-4 w-4" />
                  التدفقات النقدية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                  <Button className="dense-btn dense-btn-primary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* التدفقات الداخلة */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-gray-800">التدفقات النقدية الداخلة</span>
                      </div>
                      <span className="text-xl font-bold text-green-700">
                        +14,500,000 ريال
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">إيرادات الخدمات</div>
                        <div className="font-bold text-green-700">13,000,000</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">إيرادات أخرى</div>
                        <div className="font-bold text-green-700">1,000,000</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">تمويل</div>
                        <div className="font-bold text-green-700">500,000</div>
                      </div>
                    </div>
                  </div>

                  {/* التدفقات الخارجة */}
                  <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span className="font-bold text-gray-800">التدفقات النقدية الخارجة</span>
                      </div>
                      <span className="text-xl font-bold text-red-700">
                        -11,250,000 ريال
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">الرواتب</div>
                        <div className="font-bold text-red-700">-5,850,000</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">المشاريع</div>
                        <div className="font-bold text-red-700">-3,200,000</div>
                      </div>
                      <div className="p-2 bg-white rounded">
                        <div className="text-gray-600">التشغيل</div>
                        <div className="font-bold text-red-700">-2,200,000</div>
                      </div>
                    </div>
                  </div>

                  {/* صافي التدفق */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <span className="text-lg font-bold text-gray-800">صافي التدفق النقدي</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-700">
                        +3,250,000 ريال
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      تدفق نقدي إيجابي - الوضع المالي ممتاز
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* التدفقات الشهرية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-4 w-4" />
                  التدفقات الشهرية
                </h2>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الشهر</TableHead>
                      <TableHead className="text-right">الداخل</TableHead>
                      <TableHead className="text-right">الخارج</TableHead>
                      <TableHead className="text-right">الصافي</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MONTHS_AR.slice(0, 10).map((month, index) => {
                      const inflow = 1200000 + Math.floor(Math.random() * 600000);
                      const outflow = 900000 + Math.floor(Math.random() * 400000);
                      const net = inflow - outflow;
                      const balance = 500000 + (net * (index + 1));
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-right font-medium">{month}</TableCell>
                          <TableCell className="text-right text-green-700">
                            +{inflow.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-700">
                            -{outflow.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={net > 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                              {net > 0 ? '+' : ''}{net.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {balance.toLocaleString()}
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

      // 850-08: التحليل المالي
      case '850-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section mb-4">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <PieChart className="h-4 w-4" />
                  مؤشرات الأداء المالي الرئيسية
                </h2>
              </CardHeader>
              <CardContent>
                <div className="dense-stats-grid mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">هامش الربح</div>
                    <div className="text-2xl font-bold text-blue-700">22.4%</div>
                    <Badge className="text-xs bg-green-100 text-green-700 mt-1">
                      ممتاز
                    </Badge>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">العائد على الاستثمار</div>
                    <div className="text-2xl font-bold text-green-700">18.5%</div>
                    <Badge className="text-xs bg-green-100 text-green-700 mt-1">
                      جيد جداً
                    </Badge>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">نسبة السيولة</div>
                    <div className="text-2xl font-bold text-purple-700">2.8</div>
                    <Badge className="text-xs bg-green-100 text-green-700 mt-1">
                      صحي
                    </Badge>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                    <div className="text-xs text-gray-600 mb-1">معدل النمو</div>
                    <div className="text-2xl font-bold text-yellow-700">+15%</div>
                    <Badge className="text-xs bg-green-100 text-green-700 mt-1">
                      متصاعد
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { 
                      metric: 'الإيرادات الإجمالية', 
                      value: 18000000, 
                      growth: 15, 
                      status: 'good' 
                    },
                    { 
                      metric: 'إجمالي المصروفات', 
                      value: 15000000, 
                      growth: 8, 
                      status: 'good' 
                    },
                    { 
                      metric: 'صافي الربح', 
                      value: 3000000, 
                      growth: 22, 
                      status: 'excellent' 
                    },
                    { 
                      metric: 'التدفق النقدي', 
                      value: 3250000, 
                      growth: 18, 
                      status: 'excellent' 
                    },
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <Badge className={
                          item.status === 'excellent' ? 'bg-green-100 text-green-700' :
                          item.status === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">
                          {item.value.toLocaleString()} ريال
                        </span>
                        {item.growth > 0 && (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* النسب المالية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calculator className="h-4 w-4" />
                  النسب المالية حسب معايير SOCPA
                </h2>
              </CardHeader>
              <CardContent>
                <Table className="dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">النسبة المالية</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">المعيار</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { ratio: 'نسبة السيولة السريعة', value: 2.8, benchmark: '>2', status: 'good' },
                      { ratio: 'نسبة المديونية', value: 0.35, benchmark: '<0.5', status: 'good' },
                      { ratio: 'هامش الربح الإجمالي', value: 22.4, benchmark: '>20%', status: 'good' },
                      { ratio: 'العائد على الأصول', value: 15.8, benchmark: '>10%', status: 'good' },
                      { ratio: 'معدل دوران الأصول', value: 1.2, benchmark: '>1', status: 'good' },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-right font-medium">{item.ratio}</TableCell>
                        <TableCell className="text-right font-bold">
                          {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                          {item.ratio.includes('%') ? '%' : ''}
                        </TableCell>
                        <TableCell className="text-right text-gray-600">{item.benchmark}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            {item.status === 'good' ? 'جيد' : 'ممتاز'}
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

      // 850-09: المقارنات
      case '850-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Target className="h-4 w-4" />
                  مقارنة الأداء (المخطط vs الفعلي)
                </h2>
                <SelectWithCopy
                  id="comparisonPeriod"
                  options={[
                    { value: 'monthly', label: 'شهري' },
                    { value: 'quarterly', label: 'ربع سنوي' },
                    { value: 'annual', label: 'سنوي' },
                  ]}
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetDistribution.map((item, index) => {
                    const variance = item.actual - item.planned;
                    const variancePercentage = (variance / item.planned) * 100;
                    
                    return (
                      <div key={index} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-gray-800">{item.category}</span>
                          <Badge className={
                            variancePercentage >= -5 ? 'bg-green-100 text-green-700' :
                            variancePercentage >= -15 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            الانحراف: {variancePercentage.toFixed(1)}%
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-xs text-gray-600 mb-1">المخطط</div>
                            <div className="font-bold text-blue-700">
                              {item.planned.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-xs text-gray-600 mb-1">الفعلي</div>
                            <div className="font-bold text-green-700">
                              {item.actual.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-xs text-gray-600 mb-1">الفرق</div>
                            <div className={`font-bold ${variance < 0 ? 'text-red-700' : 'text-green-700'}`}>
                              {variance > 0 ? '+' : ''}{variance.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="relative pt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>نسبة التنفيذ</span>
                            <span>{item.percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-10: التقارير المالية
      case '850-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileSpreadsheet className="h-4 w-4" />
                  التقارير المالية والمحاسبية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  تقرير جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { 
                      name: 'القوائم المالية السنوية', 
                      type: 'مالي', 
                      standard: 'SOCPA',
                      date: '2025-10-15',
                      status: 'ready'
                    },
                    { 
                      name: 'تقرير الزكاة والضريبة', 
                      type: 'ضريبي', 
                      standard: 'ZATCA',
                      date: '2025-10-10',
                      status: 'ready'
                    },
                    { 
                      name: 'تحليل التكاليف والإيرادات', 
                      type: 'تحليلي', 
                      standard: 'داخلي',
                      date: '2025-10-05',
                      status: 'draft'
                    },
                    { 
                      name: 'تقرير التدفقات النقدية', 
                      type: 'مالي', 
                      standard: 'SOCPA',
                      date: '2025-10-01',
                      status: 'ready'
                    },
                  ].map((report, index) => (
                    <div key={index} className="dense-content-card p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">{report.name}</span>
                            <Badge className="text-xs bg-blue-100 text-blue-700">
                              {report.type}
                            </Badge>
                            <Badge className={
                              report.status === 'ready' ? 'bg-green-100 text-green-700' :
                              'bg-yellow-100 text-yellow-700'
                            }>
                              {report.status === 'ready' ? 'جاهز' : 'مسودة'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>معيار: {report.standard}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{report.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-11: الموافقات
      case '850-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Award className="h-4 w-4" />
                  طلبات الموافقة على بنود الميزانية
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { 
                      item: 'شراء معدات مساحة جديدة', 
                      amount: 250000, 
                      requester: 'قسم المشاريع',
                      date: '2025-10-14',
                      status: 'pending'
                    },
                    { 
                      item: 'تجديد عقد البرامج الهندسية', 
                      amount: 180000, 
                      requester: 'قسم تقنية المعلومات',
                      date: '2025-10-13',
                      status: 'approved'
                    },
                    { 
                      item: 'مكافآت الأداء الربع سنوية', 
                      amount: 75000, 
                      requester: 'إدارة الموارد البشرية',
                      date: '2025-10-12',
                      status: 'approved'
                    },
                    { 
                      item: 'حملة تسويقية', 
                      amount: 120000, 
                      requester: 'قسم التسويق',
                      date: '2025-10-11',
                      status: 'rejected'
                    },
                  ].map((approval, index) => (
                    <div key={index} className="dense-content-card p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{approval.item}</span>
                            <Badge className={
                              approval.status === 'approved' ? 'bg-green-100 text-green-700' :
                              approval.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {approval.status === 'approved' ? 'موافق عليه' :
                               approval.status === 'pending' ? 'قيد المراجعة' :
                               'مرفوض'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="text-gray-500">المبلغ:</span>{' '}
                              <span className="font-medium">{approval.amount.toLocaleString()} ريال</span>
                            </div>
                            <div>
                              <span className="text-gray-500">الطالب:</span>{' '}
                              <span className="font-medium">{approval.requester}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">التاريخ:</span>{' '}
                              <span className="font-medium">{approval.date}</span>
                            </div>
                          </div>
                        </div>

                        {approval.status === 'pending' && (
                          <div className="flex flex-col gap-1">
                            <Button className="dense-btn dense-btn-primary" style={{ minWidth: '80px' }}>
                              <CheckCircle className="h-3 w-3" />
                              موافقة
                            </Button>
                            <Button className="dense-btn dense-btn-secondary" style={{ minWidth: '80px' }}>
                              <AlertCircle className="h-3 w-3" />
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 850-12: الإعدادات
      case '850-12':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  إعدادات الميزانية
                </h2>
                <Button className="dense-btn dense-btn-primary">
                  <Save className="h-3 w-3" />
                  حفظ الإعدادات
                </Button>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <SelectWithCopy
                    label="السنة المالية"
                    id="fiscalYear"
                    defaultValue="2025"
                    options={FISCAL_PERIODS.map(period => ({
                      value: period.id,
                      label: period.name
                    }))}
                  />

                  <SelectWithCopy
                    label="العملة الأساسية"
                    id="currency"
                    defaultValue="SAR"
                    options={[
                      { value: 'SAR', label: 'ريال سعودي (SAR)' },
                      { value: 'USD', label: 'دولار أمريكي (USD)' },
                      { value: 'EUR', label: 'يورو (EUR)' },
                    ]}
                  />

                  <DateInputWithToday
                    label="تاريخ بداية السنة المالية"
                    id="fiscalYearStart"
                  />

                  <DateInputWithToday
                    label="تاريخ نهاية السنة المالية"
                    id="fiscalYearEnd"
                  />

                  <InputWithCopy
                    label="نسبة الزكاة (%)"
                    id="zakatRate"
                    type="number"
                    placeholder="2.5"
                    defaultValue="2.5"
                  />

                  <InputWithCopy
                    label="نسبة ضريبة القيمة المضافة (%)"
                    id="vatRate"
                    type="number"
                    placeholder="15"
                    defaultValue="15"
                  />

                  <SelectWithCopy
                    label="المعيار المحاسبي"
                    id="accountingStandard"
                    defaultValue="SOCPA"
                    options={[
                      { value: 'SOCPA', label: 'معايير SOCPA' },
                      { value: 'IFRS', label: 'معايير IFRS' },
                      { value: 'GAAP', label: 'معايير GAAP' },
                    ]}
                  />

                  <SelectWithCopy
                    label="نظام التقارير"
                    id="reportingSystem"
                    defaultValue="zatca"
                    options={[
                      { value: 'zatca', label: 'نظام ZATCA' },
                      { value: 'gosi', label: 'نظام GOSI' },
                      { value: 'internal', label: 'داخلي' },
                    ]}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-gray-800 mb-2">
                    إعدادات الإشعارات
                  </h3>

                  {[
                    { label: 'تنبيه عند تجاوز 80% من البند', checked: true },
                    { label: 'تنبيه عند تجاوز 90% من البند', checked: true },
                    { label: 'تنبيه عند تجاوز 100% من البند', checked: true },
                    { label: 'تقرير أسبوعي بالأداء المالي', checked: true },
                    { label: 'تقرير شهري بالميزانية', checked: true },
                    { label: 'إشعار عند طلب موافقة جديد', checked: true },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{setting.label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={setting.checked}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardContent>
                <div className="text-center p-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>محتوى هذا التبويب قيد التطوير</p>
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
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الميزانية السنوية
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                13 تبويب • الشاشة 850
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              ZATCA متوافق
            </Badge>
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Award className="w-2 h-2 ml-1" />
              SOCPA
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 850 - الميزانية السنوية
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام إدارة شامل • 13 تبويب • متوافق مع النظام السعودي
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {selectedPeriod}
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-850</code>
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

export default AnnualBudget_Complete_850;
