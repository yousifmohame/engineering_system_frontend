import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Megaphone, TrendingUp, Users, Target, Mail, Phone, Calendar, 
  FileText, BarChart3, MessageSquare, Share2, Settings,
  Clock, CheckCircle, XCircle, AlertCircle, PhoneCall, Send,
  Activity, PieChart, LineChart, Download, Filter, RefreshCw
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';

// تكوين التابات (9 تابات بعد حذف العروض والخصومات)
const TABS_CONFIG: TabConfig[] = [
  { id: '890-01', number: '890-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '890-02', number: '890-02', title: 'الحملات التسويقية', icon: Megaphone },
  { id: '890-03', number: '890-03', title: 'قنوات التسويق', icon: Share2 },
  { id: '890-04', number: '890-04', title: 'جهات الاتصال', icon: Users },
  { id: '890-05', number: '890-05', title: 'البريد الإلكتروني', icon: Mail },
  { id: '890-06', number: '890-06', title: 'الرسائل النصية', icon: MessageSquare },
  { id: '890-07', number: '890-07', title: 'المكالمات', icon: Phone },
  { id: '890-09', number: '890-09', title: 'التقارير والتحليلات', icon: TrendingUp },
  { id: '890-10', number: '890-10', title: 'الإعدادات', icon: Settings },
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

interface SMSMessage {
  id: string;
  recipient: string;
  message: string;
  status: 'تم الإرسال' | 'قيد الإرسال' | 'فشل' | 'مجدول';
  sentDate: string;
  cost: number;
  gateway: string;
}

interface Call {
  id: string;
  contactName: string;
  phoneNumber: string;
  callType: 'صادر' | 'وارد' | 'لم يرد';
  duration: number;
  date: string;
  time: string;
  notes: string;
  status: 'مكتمل' | 'لم يرد' | 'مشغول';
}

interface SMSGateway {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  username: string;
  password: string;
  sender: string;
  active: boolean;
  balance: number;
  costPerMessage: number;
}

const MarketingManagement_Complete_890_v3: React.FC = () => {
  const [activeTab, setActiveTab] = useState('890-01');
  
  // حالات للرسائل النصية
  const [smsGateways, setSmsGateways] = useState<SMSGateway[]>([
    {
      id: 'GW001',
      name: 'بوابة الرسائل الرئيسية',
      apiUrl: 'https://api.sms-gateway.sa/send',
      apiKey: 'sk_test_xxxxxxxxxxxxxxxx',
      username: 'marketing_dept',
      password: '********',
      sender: 'COMPANY-SA',
      active: true,
      balance: 5000,
      costPerMessage: 0.15
    },
    {
      id: 'GW002',
      name: 'بوابة SMS الاحتياطية',
      apiUrl: 'https://api.backup-sms.com/v2/send',
      apiKey: 'sk_backup_xxxxxxxxxxxxxxxx',
      username: 'backup_user',
      password: '********',
      sender: 'COMPANY-2',
      active: false,
      balance: 2000,
      costPerMessage: 0.18
    }
  ]);

  const [showGatewayDialog, setShowGatewayDialog] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<SMSGateway | null>(null);

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
  ];

  // بيانات وهمية للرسائل النصية
  const smsMessages: SMSMessage[] = [
    {
      id: 'SMS001',
      recipient: '0501234567',
      message: 'عرض خاص! خصم 30% على جميع خدماتنا حتى نهاية الشهر',
      status: 'تم الإرسال',
      sentDate: '2025-11-02 10:30',
      cost: 0.15,
      gateway: 'GW001'
    },
    {
      id: 'SMS002',
      recipient: '0509876543',
      message: 'تذكير: موعدك القادم يوم الأحد الساعة 10 صباحاً',
      status: 'تم الإرسال',
      sentDate: '2025-11-02 09:15',
      cost: 0.15,
      gateway: 'GW001'
    },
    {
      id: 'SMS003',
      recipient: '0551234567',
      message: 'شكراً لتعاملكم معنا. نرجو تقييم خدماتنا',
      status: 'قيد الإرسال',
      sentDate: '2025-11-02 11:00',
      cost: 0.15,
      gateway: 'GW001'
    },
  ];

  // بيانات وهمية للمكالمات
  const calls: Call[] = [
    {
      id: 'CALL001',
      contactName: 'أحمد محمد السعيد',
      phoneNumber: '0501234567',
      callType: 'صادر',
      duration: 480,
      date: '2025-11-02',
      time: '10:30',
      notes: 'متابعة عرض السعر - مهتم بالخدمة',
      status: 'مكتمل'
    },
    {
      id: 'CALL002',
      contactName: 'فاطمة علي الأحمد',
      phoneNumber: '0509876543',
      callType: 'وارد',
      duration: 320,
      date: '2025-11-02',
      time: '09:15',
      notes: 'استفسار عن الأسعار',
      status: 'مكتمل'
    },
    {
      id: 'CALL003',
      contactName: 'خالد عبدالله الخالد',
      phoneNumber: '0551234567',
      callType: 'صادر',
      duration: 0,
      date: '2025-11-02',
      time: '11:00',
      notes: 'محاولة الاتصال',
      status: 'لم يرد'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'تم الإرسال':
      case 'مكتمل':
        return '#10b981';
      case 'مكتمل':
        return '#2563eb';
      case 'متوقف':
      case 'فشل':
      case 'لم يرد':
        return '#ef4444';
      case 'مجدول':
      case 'قيد الإرسال':
      case 'مشغول':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveGateway = () => {
    toast.success('تم حفظ إعدادات البوابة بنجاح');
    setShowGatewayDialog(false);
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
                      9 تبويبات
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
                  <MessageSquare className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {smsMessages.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    رسائل نصية
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Phone className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {calls.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المكالمات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Target className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
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
                  <TrendingUp className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
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
                  <Activity className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {smsGateways.filter(g => g.active).length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    بوابات SMS نشطة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {calls.filter(c => c.status === 'مكتمل').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مكالمات مكتملة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول الحملات النشطة */}
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
                        <th className="text-right p-2 text-sm">الوصول</th>
                        <th className="text-right p-2 text-sm">التحويلات</th>
                        <th className="text-right p-2 text-sm">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{campaign.id}</td>
                          <td className="p-2 text-sm font-bold">{campaign.name}</td>
                          <td className="p-2 text-sm">{campaign.type}</td>
                          <td className="p-2 text-sm">
                            <Badge style={{ backgroundColor: getStatusColor(campaign.status), color: 'white' }}>
                              {campaign.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">{campaign.budget.toLocaleString()} ر.س</td>
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

      case '890-06':
        return (
          <div className="space-y-4">
            {/* إدارة بوابات SMS */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    بوابات الرسائل النصية (SMS Gateways)
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      setSelectedGateway(null);
                      setShowGatewayDialog(true);
                    }}
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}
                  >
                    إضافة بوابة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smsGateways.map((gateway) => (
                    <div 
                      key={gateway.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        borderColor: gateway.active ? '#10b981' : '#cbd5e1'
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{gateway.name}</h3>
                            <Badge style={{ backgroundColor: gateway.active ? '#10b981' : '#6b7280', color: 'white' }}>
                              {gateway.active ? 'نشط' : 'متوقف'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">API URL</p>
                              <p className="font-mono text-xs">{gateway.apiUrl}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">اسم المرسل</p>
                              <p className="font-bold">{gateway.sender}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">الرصيد المتبقي</p>
                              <p className="font-bold text-green-600">{gateway.balance.toLocaleString()} رسالة</p>
                            </div>
                            <div>
                              <p className="text-gray-500">تكلفة الرسالة</p>
                              <p className="font-bold">{gateway.costPerMessage} ر.س</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedGateway(gateway);
                              setShowGatewayDialog(true);
                            }}
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            تعديل
                          </Button>
                          <EnhancedSwitch
                            id={`gateway-${gateway.id}`}
                            checked={gateway.active}
                            onCheckedChange={(checked) => {
                              setSmsGateways(prev => prev.map(g => 
                                g.id === gateway.id ? { ...g, active: checked } : g
                              ));
                              toast.success(checked ? 'تم تفعيل البوابة' : 'تم إيقاف البوابة');
                            }}
                            size="sm"
                            variant="success"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نموذج إعدادات البوابة */}
            {showGatewayDialog && (
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedGateway ? 'تعديل بوابة SMS' : 'إضافة بوابة SMS جديدة'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <InputWithCopy
                      label="اسم البوابة *"
                      id="gateway-name"
                      placeholder="مثال: بوابة الرسائل الرئيسية"
                      value={selectedGateway?.name || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="API URL *"
                      id="api-url"
                      placeholder="https://api.sms-gateway.sa/send"
                      value={selectedGateway?.apiUrl || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="API Key *"
                      id="api-key"
                      placeholder="sk_xxxxxxxxxxxxxxxx"
                      value={selectedGateway?.apiKey || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="اسم المستخدم"
                      id="username"
                      placeholder="username"
                      value={selectedGateway?.username || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="كلمة المرور"
                      id="password"
                      type="password"
                      placeholder="********"
                      copyable={false}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="اسم المرسل *"
                      id="sender"
                      placeholder="COMPANY-SA"
                      value={selectedGateway?.sender || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="تكلفة الرسالة (ر.س)"
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.15"
                      value={selectedGateway?.costPerMessage?.toString() || ''}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="الرصيد الحالي"
                      id="balance"
                      type="number"
                      placeholder="5000"
                      value={selectedGateway?.balance?.toString() || ''}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <strong>ملاحظة:</strong> يرجى التأكد من صحة بيانات الـ API قبل الحفظ. سيتم اختبار الاتصال تلقائياً.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button 
                      onClick={handleSaveGateway}
                      style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}
                    >
                      حفظ الإعدادات
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowGatewayDialog(false)}
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      variant="outline"
                      style={{ fontFamily: 'Tajawal, sans-serif', borderColor: '#2563eb', color: '#2563eb' }}
                    >
                      اختبار الاتصال
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* إرسال رسالة نصية */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إرسال رسالة نصية جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="البوابة المستخدمة *"
                    id="selected-gateway"
                    options={smsGateways
                      .filter(g => g.active)
                      .map(g => ({ value: g.id, label: `${g.name} (${g.balance} رسالة)` }))
                    }
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال *"
                    id="recipient"
                    placeholder="05xxxxxxxx"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="نص الرسالة *"
                      id="message"
                      rows={4}
                      placeholder="اكتب نص الرسالة هنا..."
                      copyable={true}
                      clearable={true}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>الحد الأقصى: 612 حرف</span>
                      <span>0 / 612</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}>
                    <Send className="h-4 w-4 ml-2" />
                    إرسال الآن
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Clock className="h-4 w-4 ml-2" />
                    جدولة الإرسال
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* سجل الرسائل النصية */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل الرسائل النصية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2 text-sm">الرقم</th>
                        <th className="text-right p-2 text-sm">المستلم</th>
                        <th className="text-right p-2 text-sm">الرسالة</th>
                        <th className="text-right p-2 text-sm">الحالة</th>
                        <th className="text-right p-2 text-sm">تاريخ الإرسال</th>
                        <th className="text-right p-2 text-sm">التكلفة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smsMessages.map((msg) => (
                        <tr key={msg.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{msg.id}</td>
                          <td className="p-2 text-sm font-mono">{msg.recipient}</td>
                          <td className="p-2 text-sm" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {msg.message}
                          </td>
                          <td className="p-2 text-sm">
                            <Badge style={{ backgroundColor: getStatusColor(msg.status), color: 'white' }}>
                              {msg.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">{msg.sentDate}</td>
                          <td className="p-2 text-sm font-bold text-green-600">{msg.cost} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-07':
        return (
          <div className="space-y-4">
            {/* تسجيل مكالمة جديدة */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تسجيل مكالمة جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="اسم جهة الاتصال *"
                    id="contact-name"
                    placeholder="الاسم الكامل"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال *"
                    id="phone-number"
                    placeholder="05xxxxxxxx"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع المكالمة *"
                    id="call-type"
                    options={[
                      { value: 'outgoing', label: 'صادر' },
                      { value: 'incoming', label: 'وارد' },
                      { value: 'missed', label: 'لم يرد' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="حالة المكالمة *"
                    id="call-status"
                    options={[
                      { value: 'completed', label: 'مكتمل' },
                      { value: 'missed', label: 'لم يرد' },
                      { value: 'busy', label: 'مشغول' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="التاريخ *"
                    id="call-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="الوقت *"
                    id="call-time"
                    type="time"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="مدة المكالمة (بالثواني)"
                    id="duration"
                    type="number"
                    placeholder="360"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="ملاحظات المكالمة"
                      id="notes"
                      rows={3}
                      placeholder="سجل ملاحظاتك حول المكالمة..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}>
                    <PhoneCall className="h-4 w-4 ml-2" />
                    حفظ المكالمة
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات المكالمات */}
            <div className="grid grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <Phone className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {calls.length}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المكالمات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {calls.filter(c => c.status === 'مكتمل').length}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مكتملة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="h-6 w-4 mx-auto text-red-600 mb-2" />
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {calls.filter(c => c.status === 'لم يرد').length}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لم يرد
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {formatDuration(calls.reduce((sum, c) => sum + c.duration, 0))}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المدة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* سجل المكالمات */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    سجل المكالمات
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                    <Button size="sm" variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Download className="h-4 w-4 ml-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calls.map((call) => (
                    <div 
                      key={call.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Phone className={`h-5 w-5 ${call.callType === 'صادر' ? 'text-blue-600' : call.callType === 'وارد' ? 'text-green-600' : 'text-red-600'}`} />
                            <h3 className="font-bold text-lg">{call.contactName}</h3>
                            <Badge style={{ backgroundColor: getStatusColor(call.callType), color: 'white' }}>
                              {call.callType}
                            </Badge>
                            <Badge style={{ backgroundColor: getStatusColor(call.status), color: 'white' }}>
                              {call.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">{call.phoneNumber}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-500">{call.date}</p>
                          <p className="text-sm font-bold">{call.time}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">المدة</p>
                          <p className="font-bold">{call.duration > 0 ? formatDuration(call.duration) : 'N/A'}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-gray-500">الملاحظات</p>
                          <p className="text-gray-700">{call.notes || 'لا توجد ملاحظات'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-09':
        return (
          <div className="space-y-4">
            {/* البطاقات الإحصائية للتقارير */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ٣٢٥%
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متوسط ROI الكلي
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ٤٧٥K
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الوصول
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-8 w-8 text-orange-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ٢,١٠٠
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي التحويلات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-8 w-8 text-green-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ٤.٤%
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معدل التحويل
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* تقارير الأداء */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تقارير الأداء التسويقي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <BarChart3 className="h-8 w-8 mb-2 text-blue-600" />
                    <span>تقرير الحملات الشهري</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <PieChart className="h-8 w-8 mb-2 text-purple-600" />
                    <span>تحليل القنوات التسويقية</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <LineChart className="h-8 w-8 mb-2 text-green-600" />
                    <span>تقرير التحويلات</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <TrendingUp className="h-8 w-8 mb-2 text-orange-600" />
                    <span>تقرير ROI التفصيلي</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <MessageSquare className="h-8 w-8 mb-2 text-cyan-600" />
                    <span>تقرير الرسائل النصية</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-24 flex-col"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <Phone className="h-8 w-8 mb-2 text-indigo-600" />
                    <span>تقرير المكالمات</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* رسم بياني للأداء */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  أداء الحملات (آخر 6 أشهر)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around border-b border-l p-4">
                  {[45, 65, 52, 78, 88, 95].map((value, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-16 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t"
                        style={{ height: `${value * 2}px` }}
                      ></div>
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {['يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر'][idx]}
                      </span>
                      <span className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* تحليل القنوات */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  توزيع الأداء حسب القنوات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'البريد الإلكتروني', percentage: 35, color: '#3b82f6' },
                    { name: 'الرسائل النصية', percentage: 28, color: '#10b981' },
                    { name: 'واتساب', percentage: 22, color: '#06b6d4' },
                    { name: 'المكالمات', percentage: 15, color: '#8b5cf6' }
                  ].map((channel, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <span>{channel.name}</span>
                        <span className="font-bold">{channel.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full"
                          style={{ 
                            width: `${channel.percentage}%`,
                            background: channel.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '890-10':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-bold">تفعيل الإشعارات</p>
                      <p className="text-sm text-gray-500">استقبال إشعارات حول الحملات التسويقية</p>
                    </div>
                    <EnhancedSwitch
                      id="notifications"
                      checked={true}
                      onCheckedChange={() => {}}
                      variant="success"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-bold">التجديد التلقائي للحملات</p>
                      <p className="text-sm text-gray-500">تجديد الحملات تلقائياً عند انتهائها</p>
                    </div>
                    <EnhancedSwitch
                      id="auto-renew"
                      checked={false}
                      onCheckedChange={() => {}}
                      variant="default"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-bold">تقارير أسبوعية</p>
                      <p className="text-sm text-gray-500">إرسال تقارير الأداء الأسبوعية بالبريد</p>
                    </div>
                    <EnhancedSwitch
                      id="weekly-reports"
                      checked={true}
                      onCheckedChange={() => {}}
                      variant="success"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-bold">التتبع المتقدم</p>
                      <p className="text-sm text-gray-500">تفعيل أدوات التتبع والتحليل المتقدمة</p>
                    </div>
                    <EnhancedSwitch
                      id="advanced-tracking"
                      checked={true}
                      onCheckedChange={() => {}}
                      variant="default"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات الميزانية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="الحد الأقصى للميزانية الشهرية (ر.س)"
                    id="monthly-budget"
                    type="number"
                    placeholder="500000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تنبيه عند استخدام (%)"
                    id="budget-alert"
                    type="number"
                    placeholder="80"
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="البريد الإلكتروني للإشعارات"
                    id="notification-email"
                    type="email"
                    placeholder="marketing@company.com"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال للتنبيهات"
                    id="alert-phone"
                    placeholder="05xxxxxxxx"
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#ec4899' }}>
                حفظ جميع الإعدادات
              </Button>
              <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعادة تعيين
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600">التاب قيد التطوير</p>
            </div>
          </div>
        );
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
          {renderTabContent()}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MarketingManagement_Complete_890_v3;
