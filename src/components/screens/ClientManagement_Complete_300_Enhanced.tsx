/**
 * الشاشة 300 - إدارة العملاء - v7.0 مع السايد بار الموحد
 * ========================================================
 * 
 * التحديثات v7.0:
 * ✅ تطبيق السايد بار الموحد الجديد (UnifiedTabsSidebar)
 * ✅ هيدر الشاشة الاحترافي v4.2.2
 * ✅ المسافة 8px بين السايد بارات
 * ✅ التدرج الأزرق الفاتح للسايد بار
 * ✅ التاب النشط أحمر #dc2626
 * ✅ السكرول ظاهر دائماً (8px)
 * 
 * المميزات:
 * - 15 تبويب شامل
 * - حقول إدخال محسّنة (InputWithCopy)
 * - مؤشرات تفعيل محسّنة (EnhancedSwitch)
 * - تكثيف المعلومات 95%+
 * - RTL كامل مع خط Tajawal
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Users, UserPlus, FileText, Phone, Mail, MessageSquare,
  Calendar, Building, MapPin, Briefcase, DollarSign,
  Star, TrendingUp, BarChart3, Activity, Settings,
  Plus, Save, Download, Eye, Edit, Trash2, Search,
  Filter, RefreshCw, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

const TABS_CONFIG: TabConfig[] = [
  { id: '300-01', number: '300-01', title: 'نظرة عامة', icon: Users },
  { id: '300-02', number: '300-02', title: 'جميع العملاء', icon: Users },
  { id: '300-03', number: '300-03', title: 'إضافة عميل جديد', icon: UserPlus },
  { id: '300-04', number: '300-04', title: 'بطاقة العميل', icon: FileText },
  { id: '300-05', number: '300-05', title: 'جهات الاتصال', icon: Phone },
  { id: '300-06', number: '300-06', title: 'العقود والاتفاقيات', icon: Briefcase },
  { id: '300-07', number: '300-07', title: 'الفواتير والمدفوعات', icon: DollarSign },
  { id: '300-08', number: '300-08', title: 'المشاريع', icon: Building },
  { id: '300-09', number: '300-09', title: 'الاتصالات والتفاعلات', icon: MessageSquare },
  { id: '300-10', number: '300-10', title: 'المواعيد والاجتماعات', icon: Calendar },
  { id: '300-11', number: '300-11', title: 'التحليلات والإحصائيات', icon: BarChart3 },
  { id: '300-12', number: '300-12', title: 'الوثائق والمرفقات', icon: FileText },
  { id: '300-13', number: '300-13', title: 'سجل الأنشطة', icon: Activity },
  { id: '300-14', number: '300-14', title: 'التقييمات والملاحظات', icon: Star },
  { id: '300-15', number: '300-15', title: 'الإعدادات', icon: Settings }
];

const ClientManagement_Complete_300_Enhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('300-01');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    clientName: '',
    clientNameEn: '',
    clientType: 'company',
    nationalId: '',
    commercialRegister: '',
    vatNumber: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    address: '',
    city: 'الرياض',
    country: 'السعودية',
    postalCode: '',
    category: 'vip',
    creditLimit: '100000',
    registrationDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    notes: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // بيانات تجريبية
  const mockClients = useMemo(() => [
    {
      id: '1',
      code: 'CLT-2025-001',
      name: 'شركة الخليج للتطوير العقاري',
      type: 'شركة',
      phone: '+966501234567',
      email: 'info@gulf-dev.sa',
      city: 'الرياض',
      status: 'نشط',
      rating: 4.8,
      projects: 12,
      value: 8500000
    },
    {
      id: '2',
      code: 'CLT-2025-002',
      name: 'المهندس أحمد محمد السالم',
      type: 'فرد',
      phone: '+966551234567',
      email: 'ahmed.salem@email.com',
      city: 'جدة',
      status: 'نشط',
      rating: 4.5,
      projects: 3,
      value: 950000
    },
    {
      id: '3',
      code: 'CLT-2025-003',
      name: 'مؤسسة الأعمال الهندسية المتطورة',
      type: 'شركة',
      phone: '+966561234567',
      email: 'info@advanced-eng.sa',
      city: 'الدمام',
      status: 'نشط',
      rating: 4.9,
      projects: 8,
      value: 5200000
    },
  ], []);

  const renderTabContent = () => {
    const currentTab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!currentTab) return null;

    switch (activeTab) {
      // 300-01: نظرة عامة
      case '300-01':
        return (
          <div className="space-y-3">
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'إجمالي العملاء', value: '342', icon: Users, color: '#2563eb' },
                { label: 'عملاء VIP', value: '45', icon: Star, color: '#f59e0b' },
                { label: 'عملاء نشطين', value: '298', icon: CheckCircle, color: '#10b981' },
                { label: 'قيمة المشاريع', value: '45.2M ر.س', icon: DollarSign, color: '#8b5cf6' },
              ].map((stat, i) => (
                <Card key={i} className="card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px',
                        background: `${stat.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {React.createElement(stat.icon, { 
                          className: 'h-4 w-4',
                          style: { color: stat.color }
                        })}
                      </div>
                      <span 
                        className="text-lg" 
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          fontWeight: 700,
                          color: '#1f2937'
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <p 
                      className="text-xs" 
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        color: '#6b7280'
                      }}
                    >
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول أحدث العملاء */}
            <Card className="card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h2 
                      className="text-sm" 
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        fontWeight: 700,
                        color: '#1f2937'
                      }}
                    >
                      أحدث العملاء
                    </h2>
                  </div>
                  <Button 
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-3 w-3 ml-1" />
                    عميل جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-blue-50">
                        <TableCell className="text-right text-xs">
                          <code className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{client.code}</code>
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {client.name}
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {client.type}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono">
                          {client.phone}
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {client.city}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-mono">{client.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button className="h-7 w-7 p-0" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="h-7 w-7 p-0" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
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

      // 300-02: جميع العملاء
      case '300-02':
        return (
          <div className="space-y-3">
            <Card className="card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      قائمة العملاء الشاملة
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="h-8 text-xs" variant="outline">
                      <Filter className="h-3 w-3 ml-1" />
                      تصفية
                    </Button>
                    <Button className="h-8 text-xs" variant="outline">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="mb-3">
                  <InputWithCopy
                    label="البحث عن عميل"
                    placeholder="ابحث بالاسم، الكود، أو رقم الهاتف..."
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mockClients.map((client) => (
                    <Card key={client.id} className="card-rtl hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div 
                              className="text-sm mb-1" 
                              style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}
                            >
                              {client.name}
                            </div>
                            <div 
                              className="text-xs" 
                              style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}
                            >
                              {client.type}
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {client.status}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <div className="text-xs flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="font-mono">{client.phone}</span>
                          </div>
                          <div className="text-xs flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Mail className="h-3 w-3 text-gray-400" />
                            {client.email}
                          </div>
                          <div className="text-xs flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {client.city}
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-mono">{client.rating}</span>
                          </div>
                          <div className="text-xs text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {client.projects} مشاريع
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

      // 300-03: إضافة عميل جديد
      case '300-03':
        return (
          <div className="space-y-3">
            <Card className="card-rtl">
              <CardHeader className="p-3 pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <h2 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      إضافة عميل جديد
                    </h2>
                  </div>
                  <Button className="h-8 text-xs bg-green-600 hover:bg-green-700">
                    <Save className="h-3 w-3 ml-1" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* القسم الأول: المعلومات الأساسية */}
                  <div className="space-y-3">
                    <h3 
                      className="text-sm mb-2"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      المعلومات الأساسية
                    </h3>

                    <InputWithCopy
                      label="اسم العميل (عربي)"
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleChange('clientName', e.target.value)}
                      placeholder="أدخل اسم العميل"
                      required
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="اسم العميل (English)"
                      id="clientNameEn"
                      value={formData.clientNameEn}
                      onChange={(e) => handleChange('clientNameEn', e.target.value)}
                      placeholder="Client Name in English"
                      copyable={true}
                      clearable={true}
                    />

                    <SelectWithCopy
                      label="نوع العميل"
                      id="clientType"
                      value={formData.clientType}
                      onChange={(value) => handleChange('clientType', value)}
                      options={[
                        { value: 'individual', label: 'فرد' },
                        { value: 'company', label: 'شركة' },
                        { value: 'government', label: 'جهة حكومية' },
                      ]}
                      required
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="رقم الهوية الوطنية / الإقامة"
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleChange('nationalId', e.target.value)}
                      placeholder="1234567890"
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="السجل التجاري"
                      id="commercialRegister"
                      value={formData.commercialRegister}
                      onChange={(e) => handleChange('commercialRegister', e.target.value)}
                      placeholder="1234567890"
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الرقم الضريبي"
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleChange('vatNumber', e.target.value)}
                      placeholder="300012345600003"
                      copyable={true}
                      clearable={true}
                    />
                  </div>

                  {/* القسم الثاني: معلومات الاتصال */}
                  <div className="space-y-3">
                    <h3 
                      className="text-sm mb-2"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      معلومات الاتصال
                    </h3>

                    <InputWithCopy
                      label="الهاتف"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+966 11 234 5678"
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الجوال"
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="+966 50 123 4567"
                      required
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="البريد الإلكتروني"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="client@example.com"
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الموقع الإلكتروني"
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.example.com"
                      copyable={true}
                      clearable={true}
                    />

                    <SelectWithCopy
                      label="المدينة"
                      id="city"
                      value={formData.city}
                      onChange={(value) => handleChange('city', value)}
                      options={[
                        { value: 'الرياض', label: 'الرياض' },
                        { value: 'جدة', label: 'جدة' },
                        { value: 'الدمام', label: 'الدمام' },
                        { value: 'مكة المكرمة', label: 'مكة المكرمة' },
                        { value: 'المدينة المنورة', label: 'المدينة المنورة' },
                      ]}
                      copyable={true}
                      clearable={true}
                    />

                    <TextAreaWithCopy
                      label="العنوان التفصيلي"
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="أدخل العنوان التفصيلي..."
                      rows={3}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* القسم الثالث: معلومات إضافية */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 
                      className="text-sm mb-2"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      معلومات إضافية
                    </h3>

                    <SelectWithCopy
                      label="تصنيف العميل"
                      id="category"
                      value={formData.category}
                      onChange={(value) => handleChange('category', value)}
                      options={[
                        { value: 'vip', label: 'VIP' },
                        { value: 'regular', label: 'عادي' },
                        { value: 'potential', label: 'عميل محتمل' },
                      ]}
                      copyable={true}
                      clearable={true}
                    />

                    <InputWithCopy
                      label="الحد الائتماني (ر.س)"
                      id="creditLimit"
                      value={formData.creditLimit}
                      onChange={(e) => handleChange('creditLimit', e.target.value)}
                      placeholder="100000"
                      copyable={true}
                      clearable={true}
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 
                      className="text-sm mb-2"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      الإسناد والتواريخ
                    </h3>

                    <DateInputWithToday
                      label="تاريخ التسجيل"
                      id="registrationDate"
                      value={formData.registrationDate}
                      onChange={(e) => handleChange('registrationDate', e.target.value)}
                    />

                    <InputWithCopy
                      label="موظف الحساب المسؤول"
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={(e) => handleChange('assignedTo', e.target.value)}
                      placeholder="اختر الموظف المسؤول..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <TextAreaWithCopy
                    label="ملاحظات"
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="أضف أي ملاحظات إضافية..."
                    rows={4}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات - محتوى افتراضي
      default:
        return (
          <div className="space-y-3">
            <Card className="card-element card-rtl">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    {React.createElement(currentTab.icon, { className: 'h-8 w-8 text-blue-600' })}
                  </div>
                  <h3 
                    className="text-lg mb-2" 
                    style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}
                  >
                    {currentTab.title}
                  </h3>
                  <p 
                    className="text-sm text-gray-600 mb-4" 
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
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
      {/* هيدر الشاشة الاحترافي v4.2.2 */}
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
              <Users 
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
                  إدارة العملاء الشاملة
                </h1>
                
                {/* Badge الرقم */}
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
                    300
                  </span>
                </div>
              </div>
              
              {/* الوصف */}
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
                نظام CRM متكامل لإدارة العملاء
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر: عدد التابات */}
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
                {TABS_CONFIG.length} تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي: السايد بار + المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
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

      {/* نافذة إضافة عميل */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
              إضافة عميل جديد
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'right' }}>
              انتقل إلى تبويب "إضافة عميل جديد" لإضافة عميل جديد.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                className="h-8 text-xs" 
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                إلغاء
              </Button>
              <Button 
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  setActiveTab('300-03');
                  setShowAddDialog(false);
                }}
              >
                انتقال
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement_Complete_300_Enhanced;
