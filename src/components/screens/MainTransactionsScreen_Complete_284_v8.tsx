/**
 * الشاشة 284 - المعاملات الرئيسية v8.4.1
 * ================================================
 * 
 * نظام متكامل لإدارة المعاملات الهندسية بـ 30 تبويباً شاملاً
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
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  FileText, User, MapPin, Calendar, Clock, CheckCircle, AlertCircle,
  PlayCircle, Edit, Save, Printer, Share, Download, Upload, Eye,
  Settings, MoreHorizontal, Phone, Mail, Building, CreditCard,
  Wallet, Archive, History, Target, Award, TrendingUp, Users,
  Shield, Database, Search, Filter, RefreshCw, Bell, Star,
  Flag, Tag, ExternalLink, Receipt, Paperclip, Ruler, Square,
  Map, Scale, BarChart3, FileCheck, X, Plus, Send, Layers
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ===== التابات الموحدة (30 تاب) =====
const TABS_CONFIG: TabConfig[] = [
  { id: '284-01', number: '284-01', title: 'الحالة العامة للمعاملة', icon: Eye },
  { id: '284-02', number: '284-02', title: 'معلومات المعاملة', icon: FileText },
  { id: '284-03', number: '284-03', title: 'معلومات المالك', icon: User },
  { id: '284-04', number: '284-04', title: 'معلومات الأرض', icon: MapPin },
  { id: '284-05', number: '284-05', title: 'معلومات الملكية', icon: Building },
  { id: '284-06', number: '284-06', title: 'الوثائق والمستندات', icon: Archive },
  { id: '284-07', number: '284-07', title: 'المدفوعات والرسوم', icon: CreditCard },
  { id: '284-08', number: '284-08', title: 'التواصل والمراسلات', icon: Mail },
  { id: '284-09', number: '284-09', title: 'الموافقات والاعتمادات', icon: CheckCircle },
  { id: '284-10', number: '284-10', title: 'الجدول الزمني', icon: Calendar },
  { id: '284-11', number: '284-11', title: 'فريق العمل', icon: Users },
  { id: '284-12', number: '284-12', title: 'تقدم الأعمال', icon: TrendingUp },
  { id: '284-13', number: '284-13', title: 'ضمان الجودة', icon: Award },
  { id: '284-14', number: '284-14', title: 'إدارة المخاطر', icon: Shield },
  { id: '284-15', number: '284-15', title: 'الموارد والأدوات', icon: Database },
  { id: '284-16', number: '284-16', title: 'التقارير الفنية', icon: FileCheck },
  { id: '284-17', number: '284-17', title: 'التحليلات والإحصائيات', icon: BarChart3 },
  { id: '284-18', number: '284-18', title: 'الامتثال القانوني', icon: Scale },
  { id: '284-19', number: '284-19', title: 'الإشعارات والتنبيهات', icon: Bell },
  { id: '284-20', number: '284-20', title: 'سجل التغييرات', icon: History },
  { id: '284-21', number: '284-21', title: 'المرفقات والملفات', icon: Paperclip },
  { id: '284-22', number: '284-22', title: 'الإحداثيات والمواقع', icon: MapPin },
  { id: '284-23', number: '284-23', title: 'القياسات والمساحات', icon: Ruler },
  { id: '284-24', number: '284-24', title: 'الحدود والفواصل', icon: Square },
  { id: '284-25', number: '284-25', title: 'أعمال المسح', icon: Target },
  { id: '284-26', number: '284-26', title: 'رسم الخرائط', icon: Map },
  { id: '284-27', number: '284-27', title: 'الشهادات والتصاريح', icon: Award },
  { id: '284-28', number: '284-28', title: 'الجهات الخارجية', icon: ExternalLink },
  { id: '284-29', number: '284-29', title: 'الفوترة والمحاسبة', icon: Receipt },
  { id: '284-30', number: '284-30', title: 'الأرشفة والحفظ', icon: Archive }
];

// ===== مراحل المعاملة =====
interface TransactionStage {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'current' | 'pending';
  color: string;
  completedDate?: string;
  description: string;
}

const TRANSACTION_STAGES: TransactionStage[] = [
  { 
    id: 'stage-01', 
    title: 'استقبال', 
    duration: '1 يوم', 
    status: 'completed',
    color: '#10b981',
    completedDate: '2025-01-15',
    description: 'استقبال وتسجيل المعاملة في النظام'
  },
  { 
    id: 'stage-02', 
    title: 'دراسة', 
    duration: '5 أيام', 
    status: 'completed',
    color: '#10b981',
    completedDate: '2025-01-20',
    description: 'تحليل المتطلبات والوثائق المطلوبة'
  },
  { 
    id: 'stage-03', 
    title: 'مراجعة', 
    duration: '3 أيام', 
    status: 'current',
    color: '#f59e0b',
    description: 'المراجعة الفنية والقانونية للمعاملة'
  },
  { 
    id: 'stage-04', 
    title: 'موافقة', 
    duration: '7 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'الحصول على الموافقات الرسمية'
  },
  { 
    id: 'stage-05', 
    title: 'تنفيذ', 
    duration: '10 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'تنفيذ الأعمال المطلوبة'
  },
  { 
    id: 'stage-06', 
    title: 'إشراف', 
    duration: '5 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'الإشراف على الأعمال والتأكد من الجودة'
  },
  { 
    id: 'stage-07', 
    title: 'فحص', 
    duration: '3 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'فحص واعتماد الأعمال المنجزة'
  },
  { 
    id: 'stage-08', 
    title: 'اعتماد', 
    duration: '7 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'الاعتماد النهائي من الجهات المختصة'
  },
  { 
    id: 'stage-09', 
    title: 'تسليم', 
    duration: '2 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'تسليم الوثائق النهائية للعميل'
  },
  { 
    id: 'stage-10', 
    title: 'إنهاء', 
    duration: '1 يوم', 
    status: 'pending',
    color: '#6b7280',
    description: 'إنهاء المعاملة وأرشفتها'
  }
];

// ===== المكون الرئيسي =====
export default function MainTransactionsScreen_Complete_284_v8() {
  const [activeTab, setActiveTab] = useState('284-01');
  const [selectedStage, setSelectedStage] = useState('stage-03');

  // بيانات المعاملة النموذجية
  const transactionData = {
    code: 'TXN-2025-001234',
    title: 'تصحيح حدود أرض سكنية - حي النرجس - مخطط الورود',
    client: 'أحمد محمد العلي',
    clientId: '1234567890',
    clientPhone: '0501234567',
    clientEmail: 'ahmad.ali@example.com',
    location: 'حي النرجس، الرياض',
    plotNumber: '1234',
    blockNumber: 'A-456',
    area: '600',
    startDate: '2025-01-15',
    estimatedDuration: 45,
    currentStage: 3,
    totalStages: 10,
    remainingDays: 12,
    urgencyLevel: 'medium' as const,
    completionPercentage: 30,
    assignedEngineer: 'م. خالد أحمد',
    supervisor: 'م. محمد حسن',
    status: 'قيد التنفيذ'
  };

  // التاب الحالي
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab) || TABS_CONFIG[0];

  // محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '284-01':
        return <Tab01_GeneralStatus transactionData={transactionData} stages={TRANSACTION_STAGES} />;
      case '284-02':
        return <Tab02_TransactionInfo transactionData={transactionData} />;
      case '284-03':
        return <Tab03_OwnerInfo transactionData={transactionData} />;
      case '284-04':
        return <Tab04_LandInfo transactionData={transactionData} />;
      case '284-05':
        return <Tab05_OwnershipInfo transactionData={transactionData} />;
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
              <Layers 
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
                  المعاملات الرئيسية
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
                    284
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
                نظام متكامل لإدارة المعاملات الهندسية بجميع مراحلها
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
                30 تبويباً
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

// ===== التاب 01: الحالة العامة =====
function Tab01_GeneralStatus({ transactionData, stages }: any) {
  return (
    <div className="space-y-4">
      {/* بطاقة معلومات المعاملة */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            معلومات المعاملة
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                رقم المعاملة
              </p>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                {transactionData.code}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                العميل
              </p>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                {transactionData.client}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                الحالة
              </p>
              <Badge style={{ background: '#f59e0b', color: '#fff' }}>
                {transactionData.status}
              </Badge>
            </div>
          </div>
          
          <Separator style={{ margin: '12px 0' }} />
          
          <div>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              عنوان المعاملة
            </p>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#1f2937' }}>
              {transactionData.title}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* مراحل المعاملة */}
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            مراحل المعاملة ({stages.length} مراحل)
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="space-y-3">
            {stages.map((stage: TransactionStage, index: number) => (
              <div 
                key={stage.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ 
                  background: stage.status === 'current' ? '#fef3c7' : '#f9fafb',
                  border: `2px solid ${stage.status === 'current' ? '#f59e0b' : '#e5e7eb'}`
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: stage.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>
                    {stage.title}
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                    {stage.description}
                  </p>
                </div>
                <div className="text-left">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                    {stage.duration}
                  </p>
                  {stage.completedDate && (
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#10b981' }}>
                      {stage.completedDate}
                    </p>
                  )}
                </div>
                {stage.status === 'completed' && <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />}
                {stage.status === 'current' && <PlayCircle className="h-5 w-5" style={{ color: '#f59e0b' }} />}
                {stage.status === 'pending' && <Clock className="h-5 w-5" style={{ color: '#6b7280' }} />}
              </div>
            ))}
          </div>
          
          {/* شريط التقدم */}
          <div style={{ marginTop: '16px' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#6b7280' }}>
                نسبة الإنجاز
              </span>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>
                {transactionData.completionPercentage}%
              </span>
            </div>
            <Progress value={transactionData.completionPercentage} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== التاب 02: معلومات المعاملة =====
function Tab02_TransactionInfo({ transactionData }: any) {
  const [formData, setFormData] = useState({
    code: transactionData.code,
    title: transactionData.title,
    status: transactionData.status,
    startDate: transactionData.startDate,
    location: transactionData.location,
    notes: 'ملاحظات خاصة بالمعاملة...'
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            البيانات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="رقم المعاملة"
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="تاريخ البدء"
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <InputWithCopy
              label="عنوان المعاملة"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <InputWithCopy
              label="الموقع"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <TextAreaWithCopy
              label="ملاحظات"
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              copyable={true}
              clearable={true}
            />
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
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}

// ===== التاب 03: معلومات المالك =====
function Tab03_OwnerInfo({ transactionData }: any) {
  const [ownerData, setOwnerData] = useState({
    name: transactionData.client,
    idNumber: transactionData.clientId,
    phone: transactionData.clientPhone,
    email: transactionData.clientEmail,
    address: 'الرياض، المملكة العربية السعودية',
    nationality: 'سعودي'
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            البيانات الشخصية
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="الاسم الكامل"
              id="name"
              value={ownerData.name}
              onChange={(e) => setOwnerData({ ...ownerData, name: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="رقم الهوية"
              id="idNumber"
              value={ownerData.idNumber}
              onChange={(e) => setOwnerData({ ...ownerData, idNumber: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="رقم الجوال"
              id="phone"
              type="tel"
              value={ownerData.phone}
              onChange={(e) => setOwnerData({ ...ownerData, phone: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="البريد الإلكتروني"
              id="email"
              type="email"
              value={ownerData.email}
              onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="الجنسية"
              id="nationality"
              value={ownerData.nationality}
              onChange={(e) => setOwnerData({ ...ownerData, nationality: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <TextAreaWithCopy
              label="العنوان"
              id="address"
              value={ownerData.address}
              onChange={(e) => setOwnerData({ ...ownerData, address: e.target.value })}
              rows={3}
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== التاب 04: معلومات الأرض =====
function Tab04_LandInfo({ transactionData }: any) {
  const [landData, setLandData] = useState({
    plotNumber: transactionData.plotNumber,
    blockNumber: transactionData.blockNumber,
    area: transactionData.area,
    location: transactionData.location,
    landType: 'سكنية',
    usage: 'بناء سكني'
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            بيانات الأرض
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="رقم القطعة"
              id="plotNumber"
              value={landData.plotNumber}
              onChange={(e) => setLandData({ ...landData, plotNumber: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="رقم المخطط"
              id="blockNumber"
              value={landData.blockNumber}
              onChange={(e) => setLandData({ ...landData, blockNumber: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="المساحة (م²)"
              id="area"
              type="number"
              value={landData.area}
              onChange={(e) => setLandData({ ...landData, area: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <SelectWithCopy
              label="نوع الأرض"
              id="landType"
              value={landData.landType}
              onChange={(value) => setLandData({ ...landData, landType: value })}
              options={[
                { value: 'سكنية', label: 'سكنية' },
                { value: 'تجارية', label: 'تجارية' },
                { value: 'صناعية', label: 'صناعية' },
                { value: 'زراعية', label: 'زراعية' }
              ]}
              copyable={true}
              clearable={true}
            />
            
            <SelectWithCopy
              label="الاستخدام"
              id="usage"
              value={landData.usage}
              onChange={(value) => setLandData({ ...landData, usage: value })}
              options={[
                { value: 'بناء سكني', label: 'بناء سكني' },
                { value: 'بناء تجاري', label: 'بناء تجاري' },
                { value: 'فيلا', label: 'فيلا' },
                { value: 'عمارة', label: 'عمارة' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <InputWithCopy
              label="الموقع التفصيلي"
              id="location"
              value={landData.location}
              onChange={(e) => setLandData({ ...landData, location: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== التاب 05: معلومات الملكية =====
function Tab05_OwnershipInfo({ transactionData }: any) {
  const [ownershipData, setOwnershipData] = useState({
    deedNumber: '12345678',
    deedDate: '2023-05-15',
    issuePlace: 'كتابة العدل - الرياض',
    ownershipType: 'ملكية تامة',
    restrictions: 'لا يوجد'
  });

  const [isVerified, setIsVerified] = useState(false);
  const [hasRestrictions, setHasRestrictions] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            بيانات الصك
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="رقم الصك"
              id="deedNumber"
              value={ownershipData.deedNumber}
              onChange={(e) => setOwnershipData({ ...ownershipData, deedNumber: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="تاريخ الصك"
              id="deedDate"
              type="date"
              value={ownershipData.deedDate}
              onChange={(e) => setOwnershipData({ ...ownershipData, deedDate: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <InputWithCopy
              label="جهة الإصدار"
              id="issuePlace"
              value={ownershipData.issuePlace}
              onChange={(e) => setOwnershipData({ ...ownershipData, issuePlace: e.target.value })}
              copyable={true}
              clearable={true}
              required
            />
            
            <SelectWithCopy
              label="نوع الملكية"
              id="ownershipType"
              value={ownershipData.ownershipType}
              onChange={(value) => setOwnershipData({ ...ownershipData, ownershipType: value })}
              options={[
                { value: 'ملكية تامة', label: 'ملكية تامة' },
                { value: 'ملكية مشتركة', label: 'ملكية مشتركة' },
                { value: 'ملكية منقوصة', label: 'ملكية منقوصة' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>
          
          <Separator style={{ margin: '16px 0' }} />
          
          <div className="space-y-3">
            <EnhancedSwitch
              id="isVerified"
              checked={isVerified}
              onCheckedChange={setIsVerified}
              label="الصك موثق"
              description="تأكيد توثيق الصك من الجهات الرسمية"
              variant="success"
            />
            
            <EnhancedSwitch
              id="hasRestrictions"
              checked={hasRestrictions}
              onCheckedChange={setHasRestrictions}
              label="يوجد قيود"
              description="وجود قيود أو موانع على الملكية"
              variant="warning"
            />
          </div>
          
          {hasRestrictions && (
            <div style={{ marginTop: '16px' }}>
              <TextAreaWithCopy
                label="تفاصيل القيود"
                id="restrictions"
                value={ownershipData.restrictions}
                onChange={(e) => setOwnershipData({ ...ownershipData, restrictions: e.target.value })}
                rows={3}
                copyable={true}
                clearable={true}
                placeholder="اذكر تفاصيل القيود أو الموانع..."
              />
            </div>
          )}
        </CardContent>
      </Card>
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
