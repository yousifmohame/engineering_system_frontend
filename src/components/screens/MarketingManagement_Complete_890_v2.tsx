import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Megaphone, TrendingUp, Users, Target, Mail, Phone, Calendar, 
  FileText, BarChart3, DollarSign, MessageSquare, Share2, 
  Clock, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '890-01', number: '890-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '890-02', number: '890-02', title: 'الحملات التسويقية', icon: Megaphone },
  { id: '890-03', number: '890-03', title: 'قنوات التسويق', icon: Share2 },
  { id: '890-04', number: '890-04', title: 'جهات الاتصال', icon: Users },
  { id: '890-05', number: '890-05', title: 'البريد الإلكتروني', icon: Mail },
  { id: '890-06', number: '890-06', title: 'الرسائل النصية', icon: MessageSquare },
  { id: '890-07', number: '890-07', title: 'المكالمات', icon: Phone },
  { id: '890-08', number: '890-08', title: 'العروض والخصومات', icon: DollarSign },
  { id: '890-09', number: '890-09', title: 'التقارير والتحليلات', icon: TrendingUp },
  { id: '890-10', number: '890-10', title: 'الإعدادات', icon: Target },
];

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'نشط' | 'مكتمل' | 'متوقف' | 'مجدول';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  roi: number;
}

interface MarketingChannel {
  id: string;
  name: string;
  type: string;
  active: boolean;
  campaigns: number;
  totalReach: number;
  avgConversion: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  lastContact: string;
}

const MarketingManagement_Complete_890_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('890-01');

  // بيانات وهمية للحملات
  const campaigns: Campaign[] = [
    {
      id: 'C001',
      name: 'حملة الصيف 2025',
      type: 'حملة موسمية',
      status: 'نشط',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      budget: 150000,
      spent: 87500,
      reach: 125000,
      conversions: 850,
      roi: 285
    },
    {
      id: 'C002',
      name: 'عروض رمضان',
      type: 'حملة دينية',
      status: 'مكتمل',
      startDate: '2025-03-01',
      endDate: '2025-04-10',
      budget: 200000,
      spent: 195000,
      reach: 350000,
      conversions: 1250,
      roi: 420
    },
    {
      id: 'C003',
      name: 'اليوم الوطني',
      type: 'حملة وطنية',
      status: 'مجدول',
      startDate: '2025-09-15',
      endDate: '2025-09-30',
      budget: 100000,
      spent: 0,
      reach: 0,
      conversions: 0,
      roi: 0
    },
    {
      id: 'C004',
      name: 'إطلاق خدمة جديدة',
      type: 'حملة منتج',
      status: 'نشط',
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      budget: 75000,
      spent: 42000,
      reach: 68000,
      conversions: 420,
      roi: 195
    },
  ];

  // بيانات وهمية للقنوات
  const channels: MarketingChannel[] = [
    {
      id: 'CH001',
      name: 'البريد الإلكتروني',
      type: 'Email Marketing',
      active: true,
      campaigns: 12,
      totalReach: 85000,
      avgConversion: 4.2
    },
    {
      id: 'CH002',
      name: 'واتساب بزنس',
      type: 'Messaging',
      active: true,
      campaigns: 8,
      totalReach: 42000,
      avgConversion: 8.5
    },
    {
      id: 'CH003',
      name: 'الرسائل النصية SMS',
      type: 'SMS Marketing',
      active: true,
      campaigns: 15,
      totalReach: 125000,
      avgConversion: 3.8
    },
    {
      id: 'CH004',
      name: 'تويتر X',
      type: 'Social Media',
      active: true,
      campaigns: 6,
      totalReach: 215000,
      avgConversion: 2.1
    },
    {
      id: 'CH005',
      name: 'سناب شات',
      type: 'Social Media',
      active: true,
      campaigns: 4,
      totalReach: 95000,
      avgConversion: 3.5
    },
  ];

  // بيانات وهمية للجهات
  const contacts: Contact[] = [
    {
      id: 'CON001',
      name: 'أحمد محمد السعيد',
      email: 'ahmad@example.com',
      phone: '0501234567',
      type: 'عميل محتمل',
      status: 'جديد',
      lastContact: '2025-11-01'
    },
    {
      id: 'CON002',
      name: 'فاطمة علي الأحمد',
      email: 'fatima@example.com',
      phone: '0509876543',
      type: 'عميل حالي',
      status: 'نشط',
      lastContact: '2025-10-28'
    },
    {
      id: 'CON003',
      name: 'خالد عبدالله الخالد',
      email: 'khaled@example.com',
      phone: '0551234567',
      type: 'عميل محتمل',
      status: 'متابعة',
      lastContact: '2025-10-25'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return '#10b981';
      case 'مكتمل': return '#2563eb';
      case 'متوقف': return '#ef4444';
      case 'مجدول': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '890-01':
        return (
          <div className="space-y-6">
            {/* هيدر الشاشة */}
            <div
              style={{
                position: 'sticky',
                top: '0',
                zIndex: 10,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #ec4899 100%) 1',
                padding: '0',
                marginBottom: '0',
                marginTop: '0',
                boxShadow: '0 4px 16px rgba(236, 72, 153, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.03) 0%, rgba(139, 92, 246, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(236, 72, 153, 0.15)',
                      border: '2px solid rgba(236, 72, 153, 0.2)'
                    }}
                  >
                    <Megaphone 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#ec4899',
                        filter: 'drop-shadow(0 1px 2px rgba(236, 72, 153, 0.3))' 
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
                          background: 'linear-gradient(135deg, #db2777 0%, #8b5cf6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        إدارة التسويق
                      </h1>
                      
                      <div
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(236, 72, 153, 0.3)',
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
                          890
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
                      نظام إدارة الحملات التسويقية والتحليلات
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(236, 72, 153, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(236, 72, 153, 0.15)'
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

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Megaphone className="h-4 w-4 mx-auto text-pink-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {campaigns.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الحملات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {campaigns.filter(c => c.status === 'نشط').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نشطة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Users className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الوصول
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Target className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التحويلات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الميزانية (ر.س)
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.filter(c => c.roi > 0).length).toFixed(1)}%
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معدل ROI
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Share2 className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {channels.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    القنوات النشطة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Users className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contacts.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    جهات الاتصال
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحملات */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحملات التسويقية النشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2 text-sm">الرقم</th>
                        <th className="text-right p-2 text-sm">اسم الحملة</th>
                        <th className="text-right p-2 text-sm">النوع</th>
                        <th className="text-right p-2 text-sm">الحالة</th>
                        <th className="text-right p-2 text-sm">الميزانية</th>
                        <th className="text-right p-2 text-sm">المنصرف</th>
                        <th className="text-right p-2 text-sm">الوصول</th>
                        <th className="text-right p-2 text-sm">التحويلات</th>
                        <th className="text-right p-2 text-sm">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{campaign.id}</td>
                          <td className="p-2 text-sm">{campaign.name}</td>
                          <td className="p-2 text-sm">{campaign.type}</td>
                          <td className="p-2 text-sm">
                            <Badge style={{ backgroundColor: getStatusColor(campaign.status), color: 'white' }}>
                              {campaign.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">{campaign.budget.toLocaleString()} ر.س</td>
                          <td className="p-2 text-sm">{campaign.spent.toLocaleString()} ر.س</td>
                          <td className="p-2 text-sm">{campaign.reach.toLocaleString()}</td>
                          <td className="p-2 text-sm">{campaign.conversions.toLocaleString()}</td>
                          <td className="p-2 text-sm font-bold text-green-600">{campaign.roi}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-02':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة حملة تسويقية جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="اسم الحملة *"
                    id="campaign-name"
                    placeholder="مثال: حملة الصيف 2025"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع الحملة *"
                    id="campaign-type"
                    options={[
                      { value: 'seasonal', label: 'حملة موسمية' },
                      { value: 'product', label: 'حملة منتج' },
                      { value: 'service', label: 'حملة خدمة' },
                      { value: 'religious', label: 'حملة دينية' },
                      { value: 'national', label: 'حملة وطنية' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ البداية *"
                    id="start-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ النهاية *"
                    id="end-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="الميزانية (ر.س) *"
                    id="budget"
                    type="number"
                    placeholder="100000"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="الحالة *"
                    id="status"
                    options={[
                      { value: 'active', label: 'نشط' },
                      { value: 'scheduled', label: 'مجدول' },
                      { value: 'paused', label: 'متوقف' },
                      { value: 'completed', label: 'مكتمل' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="وصف الحملة"
                      id="description"
                      rows={3}
                      placeholder="وصف تفصيلي للحملة وأهدافها..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}>
                    حفظ الحملة
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* قائمة الحملات */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  جميع الحملات ({campaigns.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id} 
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            من {campaign.startDate} إلى {campaign.endDate}
                          </p>
                        </div>
                        <Badge style={{ backgroundColor: getStatusColor(campaign.status), color: 'white' }}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">الميزانية</p>
                          <p className="font-bold">{campaign.budget.toLocaleString()} ر.س</p>
                        </div>
                        <div>
                          <p className="text-gray-500">الوصول</p>
                          <p className="font-bold text-purple-600">{campaign.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">التحويلات</p>
                          <p className="font-bold text-blue-600">{campaign.conversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">ROI</p>
                          <p className="font-bold text-green-600">{campaign.roi}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-03':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قنوات التسويق المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {channels.map((channel) => (
                    <div 
                      key={channel.id}
                      className="p-4 border rounded-lg"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{channel.name}</h3>
                          <p className="text-sm text-gray-600">{channel.type}</p>
                        </div>
                        <EnhancedSwitch
                          id={`channel-${channel.id}`}
                          checked={channel.active}
                          onCheckedChange={() => {}}
                          size="sm"
                          variant="success"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">الحملات</p>
                          <p className="font-bold">{channel.campaigns}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">الوصول</p>
                          <p className="font-bold text-purple-600">{channel.totalReach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">التحويل</p>
                          <p className="font-bold text-green-600">{channel.avgConversion}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-04':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة جهة اتصال جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="الاسم الكامل *"
                    id="contact-name"
                    placeholder="الاسم الرباعي"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="البريد الإلكتروني *"
                    id="contact-email"
                    type="email"
                    placeholder="example@domain.com"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال *"
                    id="contact-phone"
                    placeholder="05xxxxxxxx"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع الجهة *"
                    id="contact-type"
                    options={[
                      { value: 'potential', label: 'عميل محتمل' },
                      { value: 'current', label: 'عميل حالي' },
                      { value: 'partner', label: 'شريك' },
                      { value: 'vendor', label: 'مورد' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div className="mt-4">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}>
                    حفظ جهة الاتصال
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قائمة جهات الاتصال ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2 text-sm">الرقم</th>
                        <th className="text-right p-2 text-sm">الاسم</th>
                        <th className="text-right p-2 text-sm">البريد</th>
                        <th className="text-right p-2 text-sm">الجوال</th>
                        <th className="text-right p-2 text-sm">النوع</th>
                        <th className="text-right p-2 text-sm">الحالة</th>
                        <th className="text-right p-2 text-sm">آخر تواصل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{contact.id}</td>
                          <td className="p-2 text-sm font-bold">{contact.name}</td>
                          <td className="p-2 text-sm">{contact.email}</td>
                          <td className="p-2 text-sm">{contact.phone}</td>
                          <td className="p-2 text-sm">{contact.type}</td>
                          <td className="p-2 text-sm">
                            <Badge variant="outline">{contact.status}</Badge>
                          </td>
                          <td className="p-2 text-sm">{contact.lastContact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-05':
      case '890-06':
      case '890-07':
      case '890-08':
      case '890-09':
      case '890-10':
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذا التاب قيد التطوير
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <ScrollArea className="h-full">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MarketingManagement_Complete_890_v2;
