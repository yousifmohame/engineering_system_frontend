/**
 * الشاشة 814 - إدارة العقود - v8.0
 * ===================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 10 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, Plus, Edit, Eye, Download, Calendar, DollarSign,
  Users, Settings, Filter, RefreshCw, CheckCircle, Clock,
  AlertTriangle, BarChart3, Activity, FileSignature, Archive,
  Briefcase
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '814-01', number: '814-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '814-02', number: '814-02', title: 'جميع العقود', icon: FileText },
  { id: '814-03', number: '814-03', title: 'إنشاء عقد جديد', icon: Plus },
  { id: '814-04', number: '814-04', title: 'نماذج العقود', icon: Briefcase },
  { id: '814-05', number: '814-05', title: 'البنود والشروط', icon: FileSignature },
  { id: '814-06', number: '814-06', title: 'التوقيعات والتوثيق', icon: CheckCircle },
  { id: '814-07', number: '814-07', title: 'التجديد والإنهاء', icon: Calendar },
  { id: '814-08', number: '814-08', title: 'الأرشيف', icon: Archive },
  { id: '814-09', number: '814-09', title: 'التقارير', icon: BarChart3 },
  { id: '814-10', number: '814-10', title: 'الإعدادات', icon: Settings },
];

const ContractsManagement_Complete_814_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('814-01');
  const [enableAutoReminders, setEnableAutoReminders] = useState(true);
  const [enableDigitalSign, setEnableDigitalSign] = useState(true);

  const contractsData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي العقود', value: '156', icon: FileText, color: '#3b82f6', change: 12 },
      { id: '2', label: 'عقود نشطة', value: '98', icon: CheckCircle, color: '#10b981', change: 8 },
      { id: '3', label: 'قيد الانتظار', value: '23', icon: Clock, color: '#f59e0b', change: -5 },
      { id: '4', label: 'منتهية', value: '35', icon: AlertTriangle, color: '#ef4444', change: 3 },
      { id: '5', label: 'القيمة الإجمالية', value: '45.2M ر.س', icon: DollarSign, color: '#8b5cf6', change: 15 },
      { id: '6', label: 'العملاء', value: '87', icon: Users, color: '#06b6d4', change: 7 },
    ],
    contracts: [
      { id: '1', number: '001/2025', title: 'عقد تصميم فيلا سكنية', client: 'أحمد محمد العتيبي', value: 500000, status: 'active', startDate: '2025-01-01', endDate: '2025-12-31', progress: 65 },
      { id: '2', number: '002/2025', title: 'عقد استشارات هندسية', client: 'فاطمة سعد القحطاني', value: 180000, status: 'active', startDate: '2025-02-01', endDate: '2025-08-01', progress: 45 },
      { id: '3', number: '003/2025', title: 'عقد تنفيذ توسعة مبنى', client: 'خالد عبدالله الشمري', value: 850000, status: 'pending', startDate: '2025-03-01', endDate: '2026-03-01', progress: 10 },
      { id: '4', number: '004/2025', title: 'عقد إشراف على مشروع', client: 'نورة حسن الدوسري', value: 320000, status: 'active', startDate: '2025-01-15', endDate: '2025-07-15', progress: 80 },
    ],
    templates: [
      { id: '1', name: 'عقد استشارات هندسية', type: 'استشاري', clauses: 12, usage: 45 },
      { id: '2', name: 'عقد تصميم معماري', type: 'تصميم', clauses: 15, usage: 32 },
      { id: '3', name: 'عقد إشراف ومتابعة', type: 'إشراف', clauses: 10, usage: 28 },
    ],
  }), []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نشط</Badge>;
      case 'pending':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-yellow-500 text-white">قيد الانتظار</Badge>;
      case 'expired':
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500 text-white">منتهي</Badge>;
      default:
        return <Badge className="text-xs px-1.5 py-0 h-5 bg-gray-500 text-white">مسودة</Badge>;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '814-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - إدارة العقود</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {contractsData.stats.map((stat) => (
                <Card key={stat.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4', style: { color: stat.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {stat.change > 0 ? (
                          <span className="text-xs text-green-600">+{stat.change}%</span>
                        ) : (
                          <span className="text-xs text-red-600">{stat.change}%</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* العقود الأخيرة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  أحدث العقود
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {contractsData.contracts.map((contract) => (
                    <div key={contract.id} className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono">{contract.number}</span>
                            {getStatusBadge(contract.status)}
                          </div>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</p>
                          <p className="text-xs text-gray-600">{contract.client}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.value.toLocaleString()} ر.س</p>
                          <p className="text-xs text-gray-600">{contract.progress}% مكتمل</p>
                        </div>
                      </div>
                      <Progress value={contract.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '814-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العقود</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />عقد جديد</Button>
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
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractsData.contracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.client}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={contract.progress} className="h-1.5 w-20" />
                            <span className="text-xs">{contract.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="h-3 w-3" /></Button>
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

      case '814-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نماذج العقود</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />نموذج جديد</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {contractsData.templates.map((template) => (
                <Card key={template.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs px-1.5 py-0">{template.type}</Badge>
                    </div>
                    <h3 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{template.clauses} بنداً</span>
                      <span>استخدم {template.usage} مرة</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">استخدام</Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '814-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات العقود</h2>
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
                  id="auto-reminders"
                  label="التذكيرات التلقائية"
                  description="إرسال تذكيرات بانتهاء صلاحية العقود"
                  checked={enableAutoReminders}
                  onCheckedChange={setEnableAutoReminders}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="digital-sign"
                  label="التوقيع الرقمي"
                  description="تفعيل نظام التوقيع الإلكتروني"
                  checked={enableDigitalSign}
                  onCheckedChange={setEnableDigitalSign}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="contract-template"
                    label="النموذج الافتراضي"
                    value="template1"
                    onChange={() => {}}
                    options={[
                      { value: 'template1', label: 'عقد استشارات هندسية' },
                      { value: 'template2', label: 'عقد تصميم معماري' },
                      { value: 'template3', label: 'عقد إشراف ومتابعة' }
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
      <CodeDisplay code="SCR-814" position="top-right" />
      
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
                  إدارة العقود
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
                    814
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
                نظام متكامل لإدارة العقود والاتفاقيات
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
                10 تبويبات
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

export default ContractsManagement_Complete_814_v8;
