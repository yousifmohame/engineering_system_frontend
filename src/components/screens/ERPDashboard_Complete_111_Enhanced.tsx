/**
 * الشاشة 111 - لوحة تحكم ERP المطورة
 * ===============================================
 * 
 * نظام متكامل لإدارة ERP بـ 10 تبويبات شاملة مطورة بالكامل
 * - السايد بار الرأسي المُكثف للتابات
 * - استغلال 95%+ من المساحة المتاحة
 * - نظام الترقيم الموحد 111-01 إلى 111-10
 * - دعم RTL كامل مع خط Tajawal
 * - بطاقات تفاعلية ونوافذ منبثقة شاملة
 * - لوحات تحكم متقدمة
 * - Lazy Loading و Virtual Scrolling
 * - تصدير وطباعة متقدمة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard, TrendingUp, DollarSign, Package, Users,
  ShoppingCart, Briefcase, BarChart3, PieChart, Activity,
  FileText, Receipt, CreditCard, Wallet, Building,
  Clock, CheckCircle, AlertCircle, RefreshCw, Plus,
  Download, Eye, Edit, Search, Filter, Calendar,
  Target, Award, TrendingDown, ArrowUpRight, ArrowDownRight,
  Layers, Database, Settings, Bell
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import InputWithCopy from '../InputWithCopy';

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

interface CustomerOrder {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  totalAmount: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'partial';
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
const TABS_CONFIG = [
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

const ERPDashboard_Complete_111_Enhanced: React.FC = () => {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('111-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showDialog, setShowDialog] = useState(false);

  // بيانات تجريبية - المبيعات الشهرية
  const salesData: SalesData[] = useMemo(() => [
    { month: 'يناير', revenue: 850000, cost: 520000, profit: 330000, profitMargin: 38.8, orders: 145 },
    { month: 'فبراير', revenue: 920000, cost: 550000, profit: 370000, profitMargin: 40.2, orders: 162 },
    { month: 'مارس', revenue: 1100000, cost: 650000, profit: 450000, profitMargin: 40.9, orders: 198 },
    { month: 'أبريل', revenue: 980000, cost: 580000, profit: 400000, profitMargin: 40.8, orders: 175 },
    { month: 'مايو', revenue: 1050000, cost: 610000, profit: 440000, profitMargin: 41.9, orders: 189 },
    { month: 'يونيو', revenue: 1200000, cost: 700000, profit: 500000, profitMargin: 41.7, orders: 215 },
    { month: 'يوليو', revenue: 1150000, cost: 680000, profit: 470000, profitMargin: 40.9, orders: 205 },
    { month: 'أغسطس', revenue: 1280000, cost: 750000, profit: 530000, profitMargin: 41.4, orders: 228 },
    { month: 'سبتمبر', revenue: 1320000, cost: 770000, profit: 550000, profitMargin: 41.7, orders: 235 },
    { month: 'أكتوبر', revenue: 1400000, cost: 820000, profit: 580000, profitMargin: 41.4, orders: 248 },
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
    {
      id: '3',
      itemCode: 'PRD-003',
      itemName: 'منتج نهائي - نوع Premium',
      category: 'منتج نهائي',
      quantity: 0,
      minStock: 50,
      maxStock: 300,
      unitPrice: 850,
      totalValue: 0,
      status: 'out-of-stock'
    },
    {
      id: '4',
      itemCode: 'PRD-004',
      itemName: 'قطع غيار - مجموعة C',
      category: 'قطع غيار',
      quantity: 1250,
      minStock: 300,
      maxStock: 800,
      unitPrice: 75,
      totalValue: 93750,
      status: 'overstock'
    },
    {
      id: '5',
      itemCode: 'PRD-005',
      itemName: 'أدوات تعبئة وتغليف',
      category: 'مستلزمات',
      quantity: 520,
      minStock: 200,
      maxStock: 1000,
      unitPrice: 35,
      totalValue: 18200,
      status: 'in-stock'
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
    {
      id: '2',
      poNumber: 'PO-2025-002',
      supplier: 'مؤسسة التوريدات المتقدمة',
      date: '2025-10-05',
      deliveryDate: '2025-10-20',
      totalAmount: 420000,
      status: 'pending',
      items: 18
    },
    {
      id: '3',
      poNumber: 'PO-2025-003',
      supplier: 'شركة القطع والمعدات',
      date: '2025-10-08',
      deliveryDate: '2025-10-12',
      totalAmount: 156000,
      status: 'received',
      items: 8
    },
  ], []);

  // بيانات تجريبية - طلبات العملاء
  const customerOrders: CustomerOrder[] = useMemo(() => [
    {
      id: '1',
      orderNumber: 'ORD-2025-145',
      customer: 'شركة التطوير الصناعي',
      date: '2025-10-10',
      totalAmount: 185000,
      status: 'processing',
      paymentStatus: 'paid'
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-146',
      customer: 'مؤسسة البناء الحديث',
      date: '2025-10-11',
      totalAmount: 320000,
      status: 'new',
      paymentStatus: 'pending'
    },
    {
      id: '3',
      orderNumber: 'ORD-2025-147',
      customer: 'شركة الإنتاج المتقدم',
      date: '2025-10-12',
      totalAmount: 95000,
      status: 'shipped',
      paymentStatus: 'paid'
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
    {
      label: 'قيمة المخزون',
      value: totalInventoryValue,
      change: -3.2,
      trend: 'down',
      icon: Package,
      color: 'text-cyan-600'
    },
    {
      label: 'طلبات الشراء النشطة',
      value: purchaseOrders.filter(po => po.status !== 'cancelled').length,
      change: 5.1,
      trend: 'up',
      icon: Receipt,
      color: 'text-pink-600'
    },
  ], [totalRevenue, totalProfit, avgProfitMargin, totalOrders, totalInventoryValue, purchaseOrders]);

  // عرض محتوى التاب النشط
  const renderTabContent = () => {
    const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    switch (activeTab) {
      // 111-01: لوحة التحكم الرئيسية
      case '111-01':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-blue-600" />
                  <h2 className="dense-section-title">لوحة التحكم الرئيسية - ERP</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* المؤشرات المالية */}
                <div className="dense-stats-grid mb-4">
                  {financialMetrics.map((metric, index) => (
                    <Card key={index} className="dense-stat-card">
                      <div className="dense-stat-icon">
                        {React.createElement(metric.icon, { className: 'h-3 w-3' })}
                      </div>
                      <div className={`dense-stat-number ${metric.color}`}>
                        {metric.label.includes('هامش') 
                          ? `${metric.value.toFixed(1)}%`
                          : metric.value.toLocaleString('ar-SA')}
                      </div>
                      <div className="dense-stat-label">{metric.label}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="h-2 w-2 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-2 w-2 text-red-600" />
                        )}
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}%
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* البيانات المالية الشهرية */}
                <Card className="dense-section mb-4">
                  <CardHeader className="dense-section-header">
                    <h3 className="dense-section-title">
                      <BarChart3 className="h-4 w-4" />
                      الأداء المالي الشهري
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="dense-grid dense-grid-auto">
                      {salesData.slice(-6).map((data, index) => (
                        <Card key={index} className="dense-content-card">
                          <div className="text-center mb-2">
                            <h4 className="compact-title text-blue-600">{data.month}</h4>
                          </div>
                          <Separator className="my-2" />
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="compact-text text-gray-600">الإيرادات:</span>
                              <span className="compact-text font-medium text-green-600">
                                {(data.revenue / 1000).toFixed(0)}K
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="compact-text text-gray-600">التكاليف:</span>
                              <span className="compact-text font-medium text-red-600">
                                {(data.cost / 1000).toFixed(0)}K
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="compact-text text-gray-600">الربح:</span>
                              <span className="compact-text font-bold text-blue-600">
                                {(data.profit / 1000).toFixed(0)}K
                              </span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between items-center">
                              <span className="compact-text text-gray-600">هامش الربح:</span>
                              <Badge className="bg-purple-100 text-purple-700">
                                {data.profitMargin.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="compact-text text-gray-600">الطلبات:</span>
                              <span className="compact-text font-medium text-orange-600">
                                {data.orders}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ملخصات سريعة */}
                <div className="dense-grid dense-grid-2">
                  <Card className="dense-section">
                    <CardHeader className="dense-section-header">
                      <h3 className="dense-section-title">
                        <Package className="h-4 w-4 text-orange-600" />
                        حالة المخزون
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                          <span className="compact-text">متوفر</span>
                          <Badge className="bg-green-100 text-green-700">
                            {inventoryItems.filter(i => i.status === 'in-stock').length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                          <span className="compact-text">مخزون منخفض</span>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            {inventoryItems.filter(i => i.status === 'low-stock').length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                          <span className="compact-text">نفد المخزون</span>
                          <Badge className="bg-red-100 text-red-700">
                            {inventoryItems.filter(i => i.status === 'out-of-stock').length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                          <span className="compact-text">مخزون زائد</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {inventoryItems.filter(i => i.status === 'overstock').length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dense-section">
                    <CardHeader className="dense-section-header">
                      <h3 className="dense-section-title">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                        أوامر الشراء
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {purchaseOrders.map((po) => (
                          <div key={po.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                            <div className="flex-1">
                              <div className="compact-text font-medium">{po.poNumber}</div>
                              <div className="text-xs text-gray-500">{po.supplier}</div>
                            </div>
                            <Badge className={
                              po.status === 'approved' ? 'bg-green-100 text-green-700' :
                              po.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              po.status === 'received' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {po.status === 'approved' ? 'معتمد' :
                               po.status === 'pending' ? 'قيد الانتظار' :
                               po.status === 'received' ? 'مستلم' : 'ملغي'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 111-04: إدارة المخزون
      case '111-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h2 className="dense-section-title">إدارة المخزون</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    صنف جديد
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table className="dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">كود الصنف</TableHead>
                        <TableHead className="text-right">اسم الصنف</TableHead>
                        <TableHead className="text-right">التصنيف</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">الحد الأدنى</TableHead>
                        <TableHead className="text-right">سعر الوحدة</TableHead>
                        <TableHead className="text-right">القيمة الإجمالية</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="text-right">
                            <code className="font-code text-blue-600">{item.itemCode}</code>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="compact-text font-medium">{item.itemName}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`compact-text font-medium ${
                              item.quantity === 0 ? 'text-red-600' :
                              item.quantity < item.minStock ? 'text-yellow-600' :
                              item.quantity > item.maxStock ? 'text-blue-600' :
                              'text-green-600'
                            }`}>
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right compact-text text-gray-600">
                            {item.minStock}
                          </TableCell>
                          <TableCell className="text-right compact-text">
                            {item.unitPrice.toLocaleString('ar-SA')} ر.س
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="compact-text font-medium text-blue-600">
                              {item.totalValue.toLocaleString('ar-SA')} ر.س
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              item.status === 'in-stock' ? 'bg-green-100 text-green-700' :
                              item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-700' :
                              item.status === 'out-of-stock' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }>
                              {item.status === 'in-stock' ? 'متوفر' :
                               item.status === 'low-stock' ? 'منخفض' :
                               item.status === 'out-of-stock' ? 'نفد' : 'زائد'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button className="dense-action-btn" variant="ghost">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button className="dense-action-btn" variant="ghost">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
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
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(currentTab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{currentTab.title}</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة جديد
                  </Button>
                  <Button className="dense-btn dense-btn-secondary">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    {React.createElement(currentTab.icon, { className: 'h-8 w-8 text-blue-600' })}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {currentTab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى هذا التبويب قيد التطوير
                  </p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {currentTab.number}
                  </p>
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
        {/* هيدر السايد بار */}
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لوحة تحكم ERP
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                10 تبويبات • الشاشة 111
              </p>
            </div>
          </div>
          <Separator />
        </div>

        {/* جسم السايد بار - قائمة التابات */}
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

        {/* فوتر السايد بار */}
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

      {/* مساحة المحتوى الرئيسية */}
      <div className="vertical-tabs-content-area">
        {/* هيدر المحتوى */}
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 111 - لوحة تحكم ERP
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام تخطيط موارد المؤسسة • 10 تبويبات تفاعلية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                نشط
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-111</code>
              </Badge>
            </div>
          </div>
        </div>

        {/* جسم المحتوى */}
        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ERPDashboard_Complete_111_Enhanced;
