/**
 * الشاشة 815 - إدارة عروض الأسعار - v8.0
 * ==========================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 9 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, Plus, Edit, Eye, Download, CheckCircle, Clock,
  AlertCircle, X, Filter, DollarSign, Users, Settings,
  RefreshCw, Send, Target, TrendingUp, Calculator, CreditCard,
  Activity, BarChart3, Layers
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '815-01', number: '815-01', title: 'نظرة عامة', icon: Activity },
  { id: '815-02', number: '815-02', title: 'جميع العروض', icon: FileText },
  { id: '815-03', number: '815-03', title: 'إنشاء عرض', icon: Plus },
  { id: '815-04', number: '815-04', title: 'قوالب العروض', icon: Layers },
  { id: '815-05', number: '815-05', title: 'التسعير والحساب', icon: Calculator },
  { id: '815-06', number: '815-06', title: 'الدفعات', icon: CreditCard },
  { id: '815-07', number: '815-07', title: 'الموافقات', icon: CheckCircle },
  { id: '815-08', number: '815-08', title: 'التقارير', icon: BarChart3 },
  { id: '815-09', number: '815-09', title: 'الإعدادات', icon: Settings },
];

const QuotationsManagement_Complete_815_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('815-01');
  const [enableAutoCalc, setEnableAutoCalc] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const quotationsData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي العروض', value: '342', icon: FileText, color: '#3b82f6', change: 18 },
      { id: '2', label: 'عروض نشطة', value: '128', icon: Activity, color: '#10b981', change: 12 },
      { id: '3', label: 'قيد المراجعة', value: '45', icon: Clock, color: '#f59e0b', change: -3 },
      { id: '4', label: 'مقبولة', value: '89', icon: CheckCircle, color: '#8b5cf6', change: 8 },
      { id: '5', label: 'القيمة الإجمالية', value: '28.5M ر.س', icon: DollarSign, color: '#06b6d4', change: 22 },
      { id: '6', label: 'معدل القبول', value: '68%', icon: TrendingUp, color: '#ec4899', change: 5 },
    ],
    quotations: [
      { id: '1', number: 'Q-2025-001', title: 'عرض تصميم فيلا', client: 'أحمد محمد', value: 450000, status: 'sent', type: 'final', date: '2025-10-20' },
      { id: '2', number: 'Q-2025-002', title: 'عرض إشراف مشروع', client: 'فاطمة سعد', value: 280000, status: 'accepted', type: 'final', date: '2025-10-18' },
      { id: '3', number: 'Q-2025-003', title: 'عرض استشارات', client: 'خالد عبدالله', value: 120000, status: 'negotiating', type: 'preliminary', date: '2025-10-22' },
      { id: '4', number: 'Q-2025-004', title: 'عرض توسعة مبنى', client: 'نورة حسن', value: 680000, status: 'pending_review', type: 'final', date: '2025-10-23' },
    ],
    templates: [
      { id: '1', name: 'عرض استشارات هندسية', usage: 45, items: 8 },
      { id: '2', name: 'عرض تصميم معماري', usage: 32, items: 12 },
      { id: '3', name: 'عرض إشراف ومتابعة', usage: 28, items: 10 },
    ],
  }), []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      draft: { label: 'مسودة', color: 'bg-gray-500' },
      pending_review: { label: 'قيد المراجعة', color: 'bg-yellow-500' },
      sent: { label: 'مُرسل', color: 'bg-blue-500' },
      negotiating: { label: 'قيد التفاوض', color: 'bg-orange-500' },
      accepted: { label: 'مقبول', color: 'bg-green-500' },
      rejected: { label: 'مرفوض', color: 'bg-red-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      preliminary: { label: 'مبدئي', color: 'bg-blue-100 text-blue-700' },
      final: { label: 'نهائي', color: 'bg-green-100 text-green-700' },
      supplementary: { label: 'تكميلي', color: 'bg-purple-100 text-purple-700' },
    };
    const t = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return <Badge variant="outline" className={`text-xs px-1.5 py-0 ${t.color}`}>{t.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '815-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - عروض الأسعار</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {quotationsData.stats.map((stat) => (
                <Card key={stat.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4', style: { color: stat.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {stat.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <Activity className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* آخر العروض */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  آخر عروض الأسعار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {quotationsData.quotations.map((quot) => (
                    <div key={quot.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono">{quot.number}</span>
                            {getStatusBadge(quot.status)}
                            {getTypeBadge(quot.type)}
                          </div>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{quot.title}</p>
                          <p className="text-xs text-gray-600">{quot.client}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{quot.value.toLocaleString()} ر.س</p>
                          <p className="text-xs text-gray-600">{quot.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '815-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع عروض الأسعار</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />عرض جديد</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotationsData.quotations.map((quot) => (
                      <TableRow key={quot.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{quot.number}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{quot.title}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{quot.client}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{quot.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">{getTypeBadge(quot.type)}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(quot.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Send className="h-3 w-3" /></Button>
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

      case '815-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب عروض الأسعار</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />قالب جديد</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quotationsData.templates.map((template) => (
                <Card key={template.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Layers className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs px-1.5 py-0">{template.items} بنداً</Badge>
                    </div>
                    <h3 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>استخدم {template.usage} مرة</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">استخدام</Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '815-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات عروض الأسعار</h2>
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
                  id="auto-calc"
                  label="الحساب التلقائي"
                  description="حساب القيم والمجاميع تلقائياً"
                  checked={enableAutoCalc}
                  onCheckedChange={setEnableAutoCalc}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notifications"
                  label="التنبيهات"
                  description="إرسال تنبيهات عند تغيير حالة العرض"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="validity-period"
                    label="مدة صلاحية العرض الافتراضية"
                    value="30"
                    onChange={() => {}}
                    options={[
                      { value: '15', label: '15 يوماً' },
                      { value: '30', label: '30 يوماً' },
                      { value: '60', label: '60 يوماً' },
                      { value: '90', label: '90 يوماً' }
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
      <CodeDisplay code="SCR-815" position="top-right" />
      
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
              <FileText 
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
                  إدارة عروض الأسعار
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
                    815
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
                نظام متكامل لإدارة عروض الأسعار والعقود
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
                9 تبويبات
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

export default QuotationsManagement_Complete_815_v8;
