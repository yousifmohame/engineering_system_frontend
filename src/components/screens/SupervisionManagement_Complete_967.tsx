/**
 * الشاشة 666 - إدارة الإشراف والجودة - v8.0
 * ================================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 12 تبويباً شاملاً
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Shield, Users, FileText, Activity, AlertTriangle, CheckCircle,
  Clock, Eye, Settings, BarChart3, UserCheck, Bell, Target,
  Award, ClipboardCheck, ShieldCheck, MapPin, Ruler, HardHat,
  Plus, Check, X
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy } from '../InputWithCopy';

const TABS_CONFIG: TabConfig[] = [
  { id: '666-01', number: '666-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '666-02', number: '666-02', title: 'طلبات الموافقة', icon: ClipboardCheck },
  { id: '666-03', number: '666-03', title: 'مراقبة النشاطات', icon: Activity },
  { id: '666-04', number: '666-04', title: 'مراقبة الجودة', icon: ShieldCheck },
  { id: '666-05', number: '666-05', title: 'الفحوصات الميدانية', icon: MapPin },
  { id: '666-06', number: '666-06', title: 'المخالفات', icon: AlertTriangle },
  { id: '666-07', number: '666-07', title: 'التقييمات', icon: Award },
  { id: '666-08', number: '666-08', title: 'التقارير', icon: FileText },
  { id: '666-09', number: '666-09', title: 'المستخدمون', icon: Users },
  { id: '666-10', number: '666-10', title: 'التنبيهات', icon: Bell },
  { id: '666-11', number: '666-11', title: 'الأهداف', icon: Target },
  { id: '666-12', number: '666-12', title: 'الإعدادات', icon: Settings },
];

interface PendingRequest {
  id: string;
  type: 'permission' | 'leave' | 'transaction' | 'document';
  user: string;
  title: string;
  details: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
}

export default function SupervisionManagement_Complete_967() {
  const [activeTab, setActiveTab] = useState('666-01');

  const mockPendingRequests: PendingRequest[] = [
    {
      id: 'req1',
      type: 'permission',
      user: 'محمد أحمد',
      title: 'طلب صلاحية إدارة المعاملات',
      details: 'يطلب صلاحية VIEW_TRANSACTIONS, EDIT_TRANSACTIONS',
      priority: 'high',
      date: '2025-09-25'
    },
    {
      id: 'req2',
      type: 'leave',
      user: 'سارة علي',
      title: 'طلب إجازة سنوية',
      details: 'من 2025-10-01 إلى 2025-10-07 (7 أيام)',
      priority: 'medium',
      date: '2025-09-24'
    },
    {
      id: 'req3',
      type: 'transaction',
      user: 'خالد محمود',
      title: 'طلب الموافقة على معاملة 2025-045',
      details: 'معاملة بقيمة 150,000 ريال',
      priority: 'urgent',
      date: '2025-09-25'
    }
  ];

  const supervisionStats = {
    totalRequests: 24,
    pending: 8,
    approved: 14,
    rejected: 2,
    activeUsers: 45,
    violations: 3,
    inspections: 15,
    quality: 92
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; color: string }> = {
      low: { label: 'منخفضة', color: 'bg-gray-500' },
      medium: { label: 'متوسطة', color: 'bg-blue-500' },
      high: { label: 'عالية', color: 'bg-orange-500' },
      urgent: { label: 'عاجلة', color: 'bg-red-500' },
    };
    const p = priorityMap[priority] || { label: priority, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${p.color} text-white`}>{p.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '666-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة</h2>
            </div>

            {/* إحصائيات مكثفة */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <ClipboardCheck className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">{supervisionStats.totalRequests}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الطلبات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                  <p className="text-2xl text-yellow-600 mb-1">{supervisionStats.pending}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الانتظار</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">{supervisionStats.activeUsers}</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستخدم نشط</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <ShieldCheck className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">{supervisionStats.quality}%</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل الجودة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Activity className="h-4 w-4" />
                  توزيع الطلبات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>موافق عليها</span>
                    <span className="text-xs font-mono">{supervisionStats.approved} طلب</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(supervisionStats.approved / supervisionStats.totalRequests) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الانتظار</span>
                    <span className="text-xs font-mono">{supervisionStats.pending} طلب</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${(supervisionStats.pending / supervisionStats.totalRequests) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرفوضة</span>
                    <span className="text-xs font-mono">{supervisionStats.rejected} طلب</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${(supervisionStats.rejected / supervisionStats.totalRequests) * 100}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '666-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>طلبات الموافقة</h2>
              <Badge variant="outline" className="text-xs">{mockPendingRequests.length} طلب معلق</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{request.id.toUpperCase()}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.user}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.title}</TableCell>
                        <TableCell className="text-right py-2">{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">{request.date}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-green-600">
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                              <X className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
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

      case '666-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراقبة الجودة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Plus className="h-3 w-3 ml-1" />إضافة فحص
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <ShieldCheck className="h-4 w-4" />
                  مؤشرات الجودة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <Card className="card-element">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل الجودة الإجمالي</span>
                        <Badge className="bg-green-500 text-white text-xs">92%</Badge>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '92%' }} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-element">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفحوصات المكتملة</span>
                        <span className="text-xs font-mono">{supervisionStats.inspections} فحص</span>
                      </div>
                      <p className="text-xs text-gray-600">آخر فحص: 2025-10-20</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-element">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخالفات</span>
                        <Badge variant="outline" className="text-xs text-red-600">{supervisionStats.violations}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">تحتاج إلى متابعة</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-666" position="top-right" />
      
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
              <Shield 
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
                  إدارة الإشراف والجودة
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
                    666
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
                لوحة تحكم شاملة للإشراف ومراقبة الجودة والموافقات
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
                12 تبويبات
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
}
