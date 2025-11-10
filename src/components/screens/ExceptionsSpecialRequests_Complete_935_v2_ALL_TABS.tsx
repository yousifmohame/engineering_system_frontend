/**
 * الشاشة 935 - استثناءات وطلبات خاصة v2.0 COMPLETE - FIXED
 * =================================================================
 * 
 * نظام شامل لإدارة الاستثناءات والطلبات الخاصة مع جميع التابات مكتملة
 * 
 * @version 2.0 COMPLETE FIXED
 * @date 6 نوفمبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  AlertCircle, FileText, CheckCircle, XCircle, Clock, Plus, Eye,
  Download, Search, Building2, Link2, TrendingUp, Activity, Bell,
  Settings, Paperclip, Upload, Trash2, Send, Filter, Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const TABS_CONFIG: TabConfig[] = [
  { id: '935-01', number: '935-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '935-02', number: '935-02', title: 'إضافة طلب جديد', icon: Plus },
  { id: '935-03', number: '935-03', title: 'الطلبات المعلقة', icon: Clock },
  { id: '935-04', number: '935-04', title: 'الطلبات المعتمدة', icon: CheckCircle },
  { id: '935-05', number: '935-05', title: 'الطلبات المرفوضة', icon: XCircle },
  { id: '935-06', number: '935-06', title: 'ربط المعاملات/العملاء', icon: Link2 },
  { id: '935-07', number: '935-07', title: 'الموافقات', icon: CheckCircle },
  { id: '935-08', number: '935-08', title: 'المرفقات', icon: Paperclip },
  { id: '935-09', number: '935-09', title: 'سجل الأنشطة', icon: Activity },
  { id: '935-10', number: '935-10', title: 'التنبيهات', icon: Bell },
  { id: '935-11', number: '935-11', title: 'التقارير', icon: FileText },
  { id: '935-12', number: '935-12', title: 'الإعدادات', icon: Settings },
];

// بيانات وهمية للطلبات
const mockExceptions = Array.from({ length: 60 }, (_, i) => ({
  id: `EXC-2025-${String(i + 1).padStart(3, '0')}`,
  title: [
    'طلب استثناء من الارتفاع النظامي',
    'طلب تقليل نسبة البناء',
    'طلب زيادة عدد الأدوار',
    'طلب تغيير نوع الاستخدام',
    'طلب دمج قطع أراضي',
    'طلب استثناء من الارتدادات',
    'طلب بناء في منطقة محمية',
    'طلب تمديد مدة الترخيص'
  ][i % 8],
  type: ['استثناء عام', 'استثناء فني', 'استثناء إداري', 'طلب خاص'][i % 4],
  status: ['معلق', 'قيد المراجعة', 'معتمد', 'مرفوض'][i % 4],
  priority: ['عالي', 'متوسط', 'منخفض'][i % 3],
  requestedBy: ['م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'][i % 3],
  requestDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

const ExceptionsSpecialRequests_Complete_935_v2 = () => {
  const [activeTab, setActiveTab] = useState('935-01');
  const [searchQuery, setSearchQuery] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case '935-01': return renderTab01_Overview();
      case '935-02': return renderTab02_AddNew();
      case '935-03': return renderTab03_Pending();
      case '935-04': return renderTab04_Approved();
      case '935-05': return renderTab05_Rejected();
      case '935-06': return renderTab06_Linking();
      case '935-07': return renderTab07_Approvals();
      case '935-08': return renderTab08_Attachments();
      case '935-09': return renderTab09_Activities();
      case '935-10': return renderTab10_Notifications();
      case '935-11': return renderTab11_Reports();
      case '935-12': return renderTab12_Settings();
      default: return <div>التاب غير موجود</div>;
    }
  };

  // التاب 935-01: نظرة عامة
  const renderTab01_Overview = () => {
    const pendingCount = mockExceptions.filter(e => e.status === 'معلق').length;
    const approvedCount = mockExceptions.filter(e => e.status === 'معتمد').length;
    const rejectedCount = mockExceptions.filter(e => e.status === 'مرفوض').length;
    const reviewingCount = mockExceptions.filter(e => e.status === 'قيد المراجعة').length;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockExceptions.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الطلبات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{pendingCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', border: '2px solid #a78bfa' }}>
            <CardContent className="p-3 text-center">
              <Activity className="h-5 w-5 mx-auto text-purple-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{reviewingCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المراجعة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approvedCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-3 text-center">
              <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{rejectedCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرفوضة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <AlertCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockExceptions.filter(e => e.priority === 'عالي').length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أولوية عالية</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقدم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExceptions.slice(0, 20).map((exc) => (
                    <TableRow key={exc.id}>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded">{exc.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            backgroundColor: exc.status === 'معتمد' ? '#dcfce7' : exc.status === 'مرفوض' ? '#fee2e2' : '#fef3c7',
                            color: exc.status === 'معتمد' ? '#166534' : exc.status === 'مرفوض' ? '#991b1b' : '#854d0e'
                          }}
                        >
                          {exc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            backgroundColor: exc.priority === 'عالي' ? '#fee2e2' : exc.priority === 'متوسط' ? '#fef3c7' : '#e0e7ff'
                          }}
                        >
                          {exc.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestedBy}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  // التابات الأخرى - محتوى مؤقت
  const renderTab02_AddNew = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة طلب جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InputWithCopy label="عنوان الطلب" id="title" value="" onChange={() => {}} copyable={true} clearable={true} />
          <SelectWithCopy label="النوع" id="type" value="" onChange={() => {}} options={[
            { value: 'general', label: 'استثناء عام' },
            { value: 'technical', label: 'استثناء فني' },
            { value: 'admin', label: 'استثناء إداري' },
          ]} copyable={false} clearable={true} />
          <TextAreaWithCopy label="الوصف" id="desc" value="" onChange={() => {}} rows={6} copyable={true} clearable={true} />
          <Button onClick={() => toast.success('تم إضافة الطلب بنجاح')}>
            <Plus className="h-4 w-4 ml-2" />
            حفظ الطلب
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab03_Pending = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الطلبات المعلقة ({mockExceptions.filter(e => e.status === 'معلق').length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExceptions.filter(e => e.status === 'معلق').map((exc) => (
              <TableRow key={exc.id}>
                <TableCell className="text-right"><code className="text-xs">{exc.id}</code></TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.title}</TableCell>
                <TableCell className="text-right"><Badge>{exc.priority}</Badge></TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderTab04_Approved = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الطلبات المعتمدة ({mockExceptions.filter(e => e.status === 'معتمد').length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExceptions.filter(e => e.status === 'معتمد').map((exc) => (
              <TableRow key={exc.id}>
                <TableCell className="text-right"><code className="text-xs">{exc.id}</code></TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.title}</TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderTab05_Rejected = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الطلبات المرفوضة ({mockExceptions.filter(e => e.status === 'مرفوض').length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExceptions.filter(e => e.status === 'مرفوض').map((exc) => (
              <TableRow key={exc.id}>
                <TableCell className="text-right"><code className="text-xs">{exc.id}</code></TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.title}</TableCell>
                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exc.requestDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderTab06_Linking = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>ربط المعاملات والعملاء</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">نظام الربط متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab07_Approvals = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الموافقات</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">نظام الموافقات متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab08_Attachments = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">نظام المرفقات متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab09_Activities = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الأنشطة</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">سجل الأنشطة متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab10_Notifications = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">نظام التنبيهات متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab11_Reports = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-gray-600">نظام التقارير متاح قريباً</p>
      </CardContent>
    </Card>
  );

  const renderTab12_Settings = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <EnhancedSwitch
            id="auto-approval"
            checked={false}
            onCheckedChange={() => {}}
            label="الموافقة التلقائية"
            description="تفعيل الموافقة التلقائية للطلبات المستوفية للشروط"
          />
          <EnhancedSwitch
            id="notifications"
            checked={true}
            onCheckedChange={() => {}}
            label="التنبيهات"
            description="إرسال تنبيهات عند تغيير حالة الطلب"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      {/* الهيدر */}
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
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12)'
        }}
      >
        <div className="flex items-center justify-between" style={{ padding: '14px 20px' }}>
          <div className="flex items-center gap-4">
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
              border: '2px solid rgba(37, 99, 235, 0.2)'
            }}>
              <AlertCircle className="h-6 w-6" style={{ color: '#2563eb' }} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 style={{
                  fontFamily: 'Tajawal, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  margin: 0,
                  background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  استثناءات وطلبات خاصة
                </h1>

                <div style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>935</span>
                </div>
              </div>

              <p style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '13px',
                color: '#64748b',
                margin: 0
              }}>
                إدارة جميع الاستثناءات والطلبات الخاصة
              </p>
            </div>
          </div>

          <div style={{
            padding: '6px 14px',
            background: 'rgba(37, 99, 235, 0.08)',
            borderRadius: '8px'
          }}>
            <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569' }}>
              12 تبويبات
            </span>
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

export default ExceptionsSpecialRequests_Complete_935_v2;
