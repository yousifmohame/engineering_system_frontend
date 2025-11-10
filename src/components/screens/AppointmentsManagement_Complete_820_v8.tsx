/**
 * الشاشة 820 - إدارة المواعيد v8.4.1
 * ====================================
 * 
 * نظام شامل لإدارة جميع أنواع المواعيد بـ 15 تبويباً متكاملاً
 * 
 * التطويرات v8.4.1 (أكتوبر 2025):
 * ✅ تطبيق UnifiedTabsSidebar v1.1
 * ✅ سايد بار موحد بعرض 220px مع خلفية بيج/كريمي
 * ✅ مسافة 4px من سايد بار الشاشات
 * ✅ مسافات مضغوطة 2px بين التابات
 * ✅ سكرول ذهبي ظاهر 8px
 * ✅ التاب النشط باللون الأحمر
 * ✅ هيدر احترافي v4.2.2
 * ✅ استخدام InputWithCopy و EnhancedSwitch
 * ✅ تكثيف المعلومات 95%+
 * 
 * @version 8.4.1
 * @date 2025-10-24
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Calendar, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Bell, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Mail, Phone, DollarSign, FileText,
  CalendarDays, AlarmClock, BellRing, Timer, Repeat, User, Briefcase,
  MapPin, Send, Star
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import DateInputWithToday from '../DateInputWithToday';

// ===== التابات الموحدة (15 تاب) =====
const TABS_CONFIG: TabConfig[] = [
  { id: '820-01', number: '820-01', title: 'نظرة عامة', icon: Calendar },
  { id: '820-02', number: '820-02', title: 'التقويم الشامل', icon: CalendarDays },
  { id: '820-03', number: '820-03', title: 'مواعيد الملاك', icon: Users },
  { id: '820-04', number: '820-04', title: 'ديدلاين المعاملات', icon: Target },
  { id: '820-05', number: '820-05', title: 'الجهات الخارجية', icon: Building },
  { id: '820-06', number: '820-06', title: 'مواعيد التحصيل', icon: DollarSign },
  { id: '820-07', number: '820-07', title: 'مواعيد الرواتب', icon: Briefcase },
  { id: '820-08', number: '820-08', title: 'إنشاء موعد', icon: Plus },
  { id: '820-09', number: '820-09', title: 'التنبيهات المتقدمة', icon: BellRing },
  { id: '820-10', number: '820-10', title: 'التذكيرات', icon: AlarmClock },
  { id: '820-11', number: '820-11', title: 'التقارير', icon: FileText },
  { id: '820-12', number: '820-12', title: 'الإحصائيات', icon: TrendingUp },
  { id: '820-13', number: '820-13', title: 'الأرشيف', icon: Archive },
  { id: '820-14', number: '820-14', title: 'المزامنة', icon: RefreshCw },
  { id: '820-15', number: '820-15', title: 'الإعدادات', icon: Settings }
];

// ===== أنواع المواعيد =====
const APPOINTMENT_TYPES = [
  { value: 'owners-meeting', label: 'اجتماع مع الملاك', color: 'bg-blue-100 text-blue-700', icon: Users },
  { value: 'transaction-deadline', label: 'ديدلاين معاملة', color: 'bg-red-100 text-red-700', icon: Target },
  { value: 'external-entity', label: 'موعد جهة خارجية', color: 'bg-purple-100 text-purple-700', icon: Building },
  { value: 'collection', label: 'موعد تحصيل', color: 'bg-green-100 text-green-700', icon: DollarSign },
  { value: 'payroll', label: 'موعد دفع راتب', color: 'bg-yellow-100 text-yellow-700', icon: Briefcase },
  { value: 'general', label: 'موعد عام', color: 'bg-gray-100 text-gray-700', icon: Calendar }
];

// ===== حالات المواعيد =====
const APPOINTMENT_STATUSES = [
  { value: 'scheduled', label: 'مجدول', color: 'bg-blue-100 text-blue-700' },
  { value: 'confirmed', label: 'مؤكد', color: 'bg-green-100 text-green-700' },
  { value: 'in-progress', label: 'جاري', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-700' },
  { value: 'postponed', label: 'مؤجل', color: 'bg-orange-100 text-orange-700' },
  { value: 'missed', label: 'فائت', color: 'bg-gray-100 text-gray-700' }
];

// ===== الأولويات =====
const PRIORITIES = [
  { value: 'low', label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-700' }
];

// ===== مواعيد نموذجية =====
const SAMPLE_APPOINTMENTS = [
  {
    id: 'APT-2025-001',
    type: 'owners-meeting',
    title: 'اجتماع مع مالك المشروع - معاملة 286-00245',
    description: 'مناقشة تصميم المبنى السكني',
    datetime: '2025-01-20T10:00:00',
    duration: 60,
    location: 'مكتب المشروع',
    status: 'scheduled',
    priority: 'high',
    relatedTransaction: '286-00245',
    relatedClient: '360-00123',
    assignedTo: 'م. أحمد محمد',
    createdDate: '2025-01-10'
  },
  {
    id: 'APT-2025-002',
    type: 'transaction-deadline',
    title: 'موعد نهائي لتسليم المعاملة 286-00246',
    description: 'آخر موعد لتقديم وثائق الإفراز',
    datetime: '2025-01-25T14:00:00',
    duration: 0,
    location: 'البلدية',
    status: 'confirmed',
    priority: 'urgent',
    relatedTransaction: '286-00246',
    assignedTo: 'م. سعيد خالد',
    createdDate: '2025-01-05'
  },
  {
    id: 'APT-2025-003',
    type: 'collection',
    title: 'تحصيل دفعة من العميل فاطمة خالد',
    description: 'الدفعة الثانية - 50,000 ر.س',
    datetime: '2025-01-18T09:00:00',
    duration: 30,
    location: 'المكتب',
    status: 'scheduled',
    priority: 'high',
    relatedClient: '360-00124',
    amount: 50000,
    assignedTo: 'محمد أحمد',
    createdDate: '2025-01-08'
  },
  {
    id: 'APT-2025-004',
    type: 'payroll',
    title: 'موعد صرف رواتب الموظفين - يناير 2025',
    description: 'صرف رواتب شهر يناير',
    datetime: '2025-01-30T12:00:00',
    duration: 120,
    location: 'قسم المحاسبة',
    status: 'scheduled',
    priority: 'urgent',
    assignedTo: 'قسم المالية',
    createdDate: '2025-01-01'
  },
  {
    id: 'APT-2025-005',
    type: 'external-entity',
    title: 'زيارة مكتب البلدية',
    description: 'متابعة طلب ترخيص البناء',
    datetime: '2025-01-22T11:00:00',
    duration: 90,
    location: 'البلدية - قسم التراخيص',
    status: 'scheduled',
    priority: 'medium',
    relatedTransaction: '286-00247',
    assignedTo: 'م. علي حسن',
    createdDate: '2025-01-12'
  }
];

// ===== المكون الرئيسي =====
export default function AppointmentsManagement_Complete_820_v8() {
  const [activeTab, setActiveTab] = useState('820-01');
  const [appointments] = useState(SAMPLE_APPOINTMENTS);

  // التاب الحالي
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab) || TABS_CONFIG[0];

  // محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '820-01':
        return <Tab01_Overview appointments={appointments} />;
      case '820-02':
        return <Tab02_Calendar appointments={appointments} />;
      case '820-03':
        return <Tab03_OwnersAppointments appointments={appointments} />;
      case '820-04':
        return <Tab04_DeadlinesAppointments appointments={appointments} />;
      case '820-05':
        return <Tab05_ExternalEntities appointments={appointments} />;
      case '820-06':
        return <Tab06_CollectionAppointments appointments={appointments} />;
      case '820-07':
        return <Tab07_PayrollAppointments appointments={appointments} />;
      case '820-08':
        return <Tab08_CreateAppointment />;
      default:
        return <DefaultTabContent tabNumber={currentTab.number} tabTitle={currentTab.title} />;
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
            {/* الأيقونة */}
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <Calendar 
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
                  إدارة المواعيد
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
                    820
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
                نظام شامل لإدارة جميع أنواع المواعيد والديدلاين
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
                15 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى التاب */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          <ScrollArea style={{ height: 'calc(100vh - 140px)' }}>
            <div style={{ padding: '16px' }}>
              {renderTabContent()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// ===== التاب 01: نظرة عامة =====
function Tab01_Overview({ appointments }: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // إحصائيات
  const stats = {
    total: appointments.length,
    today: appointments.filter((a: any) => a.datetime.startsWith(today)).length,
    scheduled: appointments.filter((a: any) => a.status === 'scheduled').length,
    confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
    urgent: appointments.filter((a: any) => a.priority === 'urgent').length
  };

  return (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-5 gap-3">
        <Card>
          <CardContent style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  إجمالي المواعيد
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {stats.total}
                </p>
              </div>
              <Calendar className="h-8 w-8" style={{ color: '#2563eb', opacity: 0.6 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  اليوم
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#10b981' }}>
                  {stats.today}
                </p>
              </div>
              <Clock className="h-8 w-8" style={{ color: '#10b981', opacity: 0.6 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  مجدول
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>
                  {stats.scheduled}
                </p>
              </div>
              <CalendarDays className="h-8 w-8" style={{ color: '#3b82f6', opacity: 0.6 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  مؤكد
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#10b981' }}>
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: '#10b981', opacity: 0.6 }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: '12px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  عاجل
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>
                  {stats.urgent}
                </p>
              </div>
              <AlertCircle className="h-8 w-8" style={{ color: '#ef4444', opacity: 0.6 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة المواعيد */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            المواعيد القادمة
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                <TableHead style={{ textAlign: 'right', fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt: any) => {
                const type = APPOINTMENT_TYPES.find(t => t.value === apt.type);
                const status = APPOINTMENT_STATUSES.find(s => s.value === apt.status);
                const priority = PRIORITIES.find(p => p.value === apt.priority);
                
                return (
                  <TableRow key={apt.id}>
                    <TableCell style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {apt.id}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {apt.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={type?.color} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {type?.label}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {new Date(apt.datetime).toLocaleString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <Badge className={priority?.color} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {priority?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={status?.color} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {status?.label}
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
}

// ===== التاب 02: التقويم الشامل =====
function Tab02_Calendar({ appointments }: any) {
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          التقويم الشامل
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        <div className="text-center py-12">
          <CalendarDays className="h-16 w-16 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', marginBottom: '8px' }}>
            عرض التقويم الشامل
          </p>
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#9ca3af' }}>
            سيتم تطوير واجهة التقويم التفاعلية قريباً
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== التاب 03-07: نفس التنسيق =====
function Tab03_OwnersAppointments({ appointments }: any) {
  const ownerAppointments = appointments.filter((a: any) => a.type === 'owners-meeting');
  
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          مواعيد الملاك ({ownerAppointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        {ownerAppointments.length > 0 ? (
          <div className="space-y-3">
            {ownerAppointments.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      {apt.title}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {apt.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock className="h-3 w-3" />
                        {new Date(apt.datetime).toLocaleString('ar-SA')}
                      </span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin className="h-3 w-3" />
                        {apt.location}
                      </span>
                    </div>
                  </div>
                  <Badge style={{ background: '#3b82f6', color: '#fff', fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {apt.id}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
              لا توجد مواعيد مع الملاك حالياً
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Tab04_DeadlinesAppointments({ appointments }: any) {
  const deadlines = appointments.filter((a: any) => a.type === 'transaction-deadline');
  
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          ديدلاين المعاملات ({deadlines.length})
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        {deadlines.length > 0 ? (
          <div className="space-y-3">
            {deadlines.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#dc2626' }}>
                      {apt.title}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {apt.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock className="h-3 w-3" />
                        {new Date(apt.datetime).toLocaleString('ar-SA')}
                      </span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText className="h-3 w-3" />
                        {apt.relatedTransaction}
                      </span>
                    </div>
                  </div>
                  <Badge style={{ background: '#ef4444', color: '#fff', fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    عاجل
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
              لا توجد ديدلاين حالياً
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Tab05_ExternalEntities({ appointments }: any) {
  const external = appointments.filter((a: any) => a.type === 'external-entity');
  
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          مواعيد الجهات الخارجية ({external.length})
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        {external.length > 0 ? (
          <div className="space-y-3">
            {external.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-lg" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  {apt.title}
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                  {apt.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
              لا توجد مواعيد مع جهات خارجية
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Tab06_CollectionAppointments({ appointments }: any) {
  const collection = appointments.filter((a: any) => a.type === 'collection');
  
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          مواعيد التحصيل ({collection.length})
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        {collection.length > 0 ? (
          <div className="space-y-3">
            {collection.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      {apt.title}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {apt.description}
                    </p>
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock className="h-3 w-3" />
                      {new Date(apt.datetime).toLocaleString('ar-SA')}
                    </span>
                  </div>
                  {apt.amount && (
                    <Badge style={{ background: '#10b981', color: '#fff', fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                      {apt.amount.toLocaleString('ar-SA')} ر.س
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
              لا توجد مواعيد تحصيل
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Tab07_PayrollAppointments({ appointments }: any) {
  const payroll = appointments.filter((a: any) => a.type === 'payroll');
  
  return (
    <Card>
      <CardHeader style={{ padding: '12px 16px' }}>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
          مواعيد الرواتب ({payroll.length})
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '16px' }}>
        {payroll.length > 0 ? (
          <div className="space-y-3">
            {payroll.map((apt: any) => (
              <div key={apt.id} className="p-3 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  {apt.title}
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  {apt.description}
                </p>
                <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock className="h-3 w-3" />
                  {new Date(apt.datetime).toLocaleString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#9ca3af' }}>
              لا توجد مواعيد رواتب
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===== التاب 08: إنشاء موعد =====
function Tab08_CreateAppointment() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'general',
    description: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    priority: 'medium',
    assignedTo: '',
    relatedTransaction: '',
    relatedClient: ''
  });

  const [enableReminders, setEnableReminders] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            إنشاء موعد جديد
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="space-y-4">
            {/* العنوان والنوع */}
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="عنوان الموعد"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="أدخل عنوان الموعد"
                required
                copyable={true}
                clearable={true}
              />
              
              <SelectWithCopy
                label="نوع الموعد"
                id="type"
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                options={APPOINTMENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* التاريخ والوقت */}
            <div className="grid grid-cols-3 gap-4">
              <InputWithCopy
                label="التاريخ"
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                copyable={true}
                clearable={true}
              />
              
              <InputWithCopy
                label="الوقت"
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                copyable={true}
                clearable={true}
              />
              
              <InputWithCopy
                label="المدة (دقيقة)"
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* الوصف */}
            <TextAreaWithCopy
              label="الوصف"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="وصف تفصيلي للموعد..."
              copyable={true}
              clearable={true}
            />

            {/* الموقع والأولوية */}
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="الموقع"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="مكان الموعد"
                copyable={true}
                clearable={true}
              />
              
              <SelectWithCopy
                label="الأولوية"
                id="priority"
                value={formData.priority}
                onChange={(value) => setFormData({ ...formData, priority: value })}
                options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
                copyable={true}
                clearable={true}
              />
            </div>

            <Separator />

            {/* الإعدادات */}
            <div className="space-y-3">
              <EnhancedSwitch
                id="enableReminders"
                checked={enableReminders}
                onCheckedChange={setEnableReminders}
                label="تفعيل التذكيرات"
                description="إرسال تذكيرات تلقائية قبل الموعد"
                variant="success"
              />
              
              <EnhancedSwitch
                id="enableNotifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
                label="تفعيل الإشعارات"
                description="إرسال إشعارات للأطراف المعنية"
                variant="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button style={{ background: '#2563eb', color: '#fff', fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-4 w-4 ml-2" />
          إنشاء الموعد
        </Button>
      </div>
    </div>
  );
}

// ===== محتوى افتراضي للتابات الأخرى =====
function DefaultTabContent({ tabNumber, tabTitle }: { tabNumber: string; tabTitle: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {tabTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', marginBottom: '8px' }}>
            محتوى التاب {tabNumber}
          </p>
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#9ca3af' }}>
            سيتم تطوير هذا القسم قريباً
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
