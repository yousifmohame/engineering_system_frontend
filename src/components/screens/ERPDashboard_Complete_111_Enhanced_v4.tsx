/**
 * الشاشة 111 - لوحة تحكم ERP المطورة v4.2.2
 * ================================================
 * 
 * نظام متكامل لإدارة ERP بـ 10 تبويبات شاملة
 * 
 * التطويرات v4.2.2 (أحدث):
 * ✅ إصلاح نهائي للمسافة: top: 0 للهيدر (ملتصق تماماً بأعلى مساحة العمل)
 * ✅ السايد بار في top: 62px (بعد هيدر الشاشة مباشرة)
 * ✅ لا توجد أي مسافات زائدة على الإطلاق
 * 
 * التطويرات v4.2.1:
 * ✅ إزالة المسافة الزائدة بين الهيدر وهيدر النظام
 * ✅ الهيدر ملتصق تماماً بالهيدر الثاني (margin: 0)
 * ✅ المسافة تتم عبر paddingTop في المحتوى
 * 
 * التطويرات v4.2:
 * ✅ هيدر احترافي بتصميم حديث وعصري
 * ✅ تدرجات لونية جذابة (أزرق-بنفسجي)
 * ✅ أيقونة محسّنة بظل وحواف ناعمة
 * ✅ عنوان بتأثير تدرج نصي (gradient text)
 * ✅ Badge الرقم بتصميم 3D محسّن
 * ✅ الوصف في سطر منفصل مع نقطة فاصلة
 * ✅ عداد التبويبات في الجهة اليسرى
 * ✅ حد سفلي بتدرج ملون ثلاثي
 * ✅ ظلال متعددة الطبقات لعمق بصري
 * 
 * التطويرات v4.1:
 * ✅ هيدر الشاشة ثابت ويبدأ من أسفل الهيدر الثاني (top: 108px)
 * ✅ الهيدر لا يخضع للتمرير الخاص بمساحة عمل كل تاب
 * ✅ تحديث موضع السايد بار ليتناسب مع الهيدر الجديد (top: 170px)
 * ✅ تعديل الارتفاعات لضمان عدم التداخل مع الهيدرات
 * 
 * التطويرات v4.0:
 * ✅ سايد بار التابات بخلفية فرعية من درجة سايد بار الشاشات
 * ✅ تكثيف سايد بار التابات: أيقونة + اسم + رقم في سطر واحد
 * ✅ خلفية تدرجية أزرق فاتح (متناسقة مع سايد بار الشاشات)
 * ✅ شريط تمرير بلون أزرق مميز
 * 
 * @version 4.2.2
 * @date 2025-10-21
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard, TrendingUp, DollarSign, Package, Users,
  ShoppingCart, Briefcase, BarChart3, Target, Settings,
  RefreshCw, Plus, Download, Eye, Edit, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ===== واجهات البيانات =====

interface SalesData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  orders: number;
}

interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  deliveryDate: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  items: number;
}

interface FinancialMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

// ===== التابات الموحدة (10 تاب) =====
const TABS_CONFIG: TabConfig[] = [
  { id: '111-01', number: '111-01', title: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
  { id: '111-02', number: '111-02', title: 'المبيعات والإيرادات', icon: TrendingUp },
  { id: '111-03', number: '111-03', title: 'المشتريات والموردين', icon: ShoppingCart },
  { id: '111-04', number: '111-04', title: 'إدارة المخزون', icon: Package },
  { id: '111-05', number: '111-05', title: 'الحسابات والمالية', icon: DollarSign },
  { id: '111-06', number: '111-06', title: 'إدارة العملاء', icon: Users },
  { id: '111-07', number: '111-07', title: 'المشاريع والعقود', icon: Briefcase },
  { id: '111-08', number: '111-08', title: 'التقارير التحليلية', icon: BarChart3 },
  { id: '111-09', number: '111-09', title: 'مؤشرات الأداء', icon: Target },
  { id: '111-10', number: '111-10', title: 'الإعدادات العامة', icon: Settings },
];

const ERPDashboard_Complete_111_Enhanced_v4: React.FC = () => {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('111-01');

  // بيانات تجريبية - المبيعات الشهرية
  const salesData: SalesData[] = useMemo(() => [
    { month: 'يناير', revenue: 850000, cost: 520000, profit: 330000, profitMargin: 38.8, orders: 145 },
    { month: 'فبراير', revenue: 920000, cost: 550000, profit: 370000, profitMargin: 40.2, orders: 162 },
    { month: 'مارس', revenue: 1100000, cost: 650000, profit: 450000, profitMargin: 40.9, orders: 198 },
    { month: 'أبريل', revenue: 980000, cost: 580000, profit: 400000, profitMargin: 40.8, orders: 175 },
    { month: 'مايو', revenue: 1050000, cost: 610000, profit: 440000, profitMargin: 41.9, orders: 189 },
    { month: 'يونيو', revenue: 1200000, cost: 700000, profit: 500000, profitMargin: 41.7, orders: 215 },
  ], []);

  // بيانات تجريبية - المخزون
  const inventoryItems: InventoryItem[] = useMemo(() => [
    {
      id: '1',
      itemCode: 'PRD-001',
      itemName: 'مادة خام - نوع A',
      category: 'مواد خام',
      quantity: 450,
      minStock: 200,
      maxStock: 1000,
      unitPrice: 125,
      totalValue: 56250,
      status: 'in-stock'
    },
    {
      id: '2',
      itemCode: 'PRD-002',
      itemName: 'منتج نصف مصنع - نوع B',
      category: 'نصف مصنع',
      quantity: 85,
      minStock: 100,
      maxStock: 500,
      unitPrice: 450,
      totalValue: 38250,
      status: 'low-stock'
    },
  ], []);

  // بيانات تجريبية - أوامر الشراء
  const purchaseOrders: PurchaseOrder[] = useMemo(() => [
    {
      id: '1',
      poNumber: 'PO-2025-001',
      supplier: 'شركة المواد الصناعية',
      date: '2025-10-01',
      deliveryDate: '2025-10-15',
      totalAmount: 285000,
      status: 'approved',
      items: 12
    },
  ], []);

  // حساب المؤشرات المالية
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalCost = salesData.reduce((sum, data) => sum + data.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = salesData.reduce((sum, data) => sum + data.profitMargin, 0) / salesData.length;
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0);
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);

  // المؤشرات المالية الرئيسية
  const financialMetrics: FinancialMetric[] = useMemo(() => [
    {
      label: 'إجمالي الإيرادات',
      value: totalRevenue,
      change: 12.5,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'إجمالي الأرباح',
      value: totalProfit,
      change: 15.2,
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      label: 'متوسط هامش الربح',
      value: avgProfitMargin,
      change: 2.3,
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      label: 'إجمالي الطلبات',
      value: totalOrders,
      change: 8.7,
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-orange-600'
    },
  ], [totalRevenue, totalProfit, avgProfitMargin, totalOrders]);

  // عرض محتوى التاب النشط
  const renderTabContent = () => {
    const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    switch (activeTab) {
      // 111-01: لوحة التحكم الرئيسية
      case '111-01':
        return (
          <div className="space-y-3">
            {/* المؤشرات المالية */}
            <div className="grid grid-cols-4 gap-2">
              {financialMetrics.map((metric, index) => (
                <Card key={index} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        {React.createElement(metric.icon, { className: 'h-4 w-4 text-blue-600' })}
                      </div>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {metric.label}
                      </p>
                      <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {metric.label.includes('هامش') 
                          ? `${metric.value.toFixed(1)}%`
                          : metric.value.toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* البيانات المالية الشهرية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    الأداء المالي الشهري
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-6 gap-2">
                  {salesData.map((data, index) => (
                    <Card key={index} className="card-element card-rtl">
                      <CardContent className="p-2">
                        <div className="text-center mb-2">
                          <h4 className="text-sm text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {data.month}
                          </h4>
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الإيرادات:
                            </span>
                            <span className="text-xs text-green-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                              {(data.revenue / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الربح:
                            </span>
                            <span className="text-xs text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                              {(data.profit / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 111-04: إدارة المخزون
      case '111-04':
        return (
          <div className="space-y-3">
            <Card className="card-element card-rtl">
              <CardContent className="p-3">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          كود الصنف
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسم الصنف
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الكمية
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الحالة
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="text-right">
                            <code className="text-xs text-blue-600" style={{ fontFamily: 'monospace' }}>
                              {item.itemCode}
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                              {item.itemName}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={`text-xs ${
                              item.status === 'in-stock' ? 'bg-green-100 text-green-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status === 'in-stock' ? 'متوفر' : 'منخفض'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="space-y-3">
            <Card className="card-element card-rtl">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    {React.createElement(currentTab.icon, { className: 'h-8 w-8 text-blue-600' })}
                  </div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    {currentTab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى هذا التبويب قيد التطوير
                  </p>
                  <Badge variant="outline" className="font-mono">
                    {currentTab.number}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div style={{ direction: 'rtl' }}>
      {/* هيدر الشاشة الاحترافي المطور v4.2 - ملتصق مباشرة بالهيدر الثاني */}
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
          {/* القسم الأيمن: الأيقونة والمعلومات */}
          <div className="flex items-center gap-4">
            {/* الأيقونة بتصميم حديث */}
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <LayoutDashboard 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            {/* معلومات الشاشة */}
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
                  لوحة تحكم ERP
                </h1>
                
                {/* Badge الرقم - تصميم محسّن */}
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
                    111
                  </span>
                </div>
              </div>
              
              {/* الوصف في سطر منفصل للوضوح */}
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
                نظام متكامل لإدارة موارد المؤسسة
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر: معلومات إضافية */}
          <div className="flex items-center gap-3">
            {/* عدد التابات */}
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

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد v1.1 */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* محتوى الشاشة القابل للتمرير */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ERPDashboard_Complete_111_Enhanced_v4;
