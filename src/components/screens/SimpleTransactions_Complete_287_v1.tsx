/**
 * الشاشة 287 - معاملات بسيطة v1.0 COMPLETE
 * ========================================================
 * 
 * نسخة مبسطة من شاشة معالجة المعاملات (284) للمعاملات السريعة والبسيطة
 * 
 * المميزات:
 * ✅ معالجة سريعة للمعاملات البسيطة
 * ✅ 8 تابات أساسية فقط (مقابل 47 في الشاشة 284)
 * ✅ إمكانية التحويل لمعاملة كاملة
 * ✅ واجهة مبسطة وسريعة
 * ✅ جميع المعلومات الأساسية فقط
 * 
 * التابات (8 تابات):
 * 287-01: المعلومات الأساسية
 * 287-02: بيانات المالك
 * 287-03: الموقع والأرض
 * 287-04: المتطلبات الأساسية
 * 287-05: المستندات
 * 287-06: الرسوم والأتعاب
 * 287-07: ملاحظات سريعة
 * 287-08: الإنجاز والتسليم
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import Tab_287_06_Fees_Complete_Advanced from './Tab_287_06_Fees_Complete_Advanced';
import Tab_287_08_FinalFiles_Complete from './Tab_287_08_FinalFiles_Complete';
import {
  FileText, User, MapPin, FileCheck, Paperclip, DollarSign, MessageSquare,
  CheckCircle, Zap, Plus, Eye, ArrowRight, AlertCircle, Calendar,
  Building2, Clock, TrendingUp, Activity
} from 'lucide-react';

// ============================================================
// تكوين التابات - 8 تابات بسيطة فقط
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '287-01', number: '287-01', title: 'المعلومات الأساسية', icon: FileText },
  { id: '287-02', number: '287-02', title: 'بيانات المالك', icon: User },
  { id: '287-03', number: '287-03', title: 'الموقع والأرض', icon: MapPin },
  { id: '287-04', number: '287-04', title: 'المتطلبات الأساسية', icon: FileCheck },
  { id: '287-05', number: '287-05', title: 'المستندات', icon: Paperclip },
  { id: '287-06', number: '287-06', title: 'الرسوم والأتعاب', icon: DollarSign },
  { id: '287-07', number: '287-07', title: 'ملاحظات سريعة', icon: MessageSquare },
  { id: '287-08', number: '287-08', title: 'ملفات إنهاء المعاملة', icon: CheckCircle },
];

// ============================================================
// البيانات الوهمية - المعاملات البسيطة (30 معاملة)
// ============================================================

const mockSimpleTransactions = Array.from({ length: 30 }, (_, i) => ({
  id: `2510${String(i + 1).padStart(3, '0')}`,
  ownerName: ['أحمد بن محمد السالم', 'فاطمة بنت علي المطيري', 'خالد بن عبدالله العتيبي'][i % 3],
  type: ['سكني', 'تجاري'][i % 2],
  subType: i % 2 === 0 ? 'فيلا' : 'محل تجاري',
  location: `${['الرياض', 'جدة', 'الدمام'][i % 3]} - ${['حي النرجس', 'حي الملقا', 'حي العليا'][i % 3]}`,
  area: Math.floor(Math.random() * 500) + 200,
  status: ['جديدة', 'قيد المعالجة', 'مكتملة'][i % 3],
  fees: Math.floor(Math.random() * 50000) + 10000,
  progress: Math.floor(Math.random() * 100),
  createdDate: `2025-10-${String((i % 28) + 1).padStart(2, '0')}`,
  daysElapsed: Math.floor(Math.random() * 30) + 1,
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const SimpleTransactions_Complete_287_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('287-01');
  const [selectedTransaction, setSelectedTransaction] = useState<string>('');

  // بيانات النموذج المبسط
  const [formData, setFormData] = useState({
    ownerFirstName: '',
    ownerFatherName: '',
    ownerGrandName: '',
    ownerLastName: '',
    ownerPhone: '',
    ownerEmail: '',
    type: 'سكني',
    subType: 'فيلا',
    city: '',
    district: '',
    area: '',
    plotNumber: '',
    requirements: '',
    fees: '',
    notes: '',
  });

  // ============================================================
  // التاب 287-01: المعلومات الأساسية
  // ============================================================

  const renderTab01_BasicInfo = () => (
    <div className="space-y-4">
      {/* قائمة المعاملات البسيطة */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات البسيطة ({mockSimpleTransactions.length})</CardTitle>
            <Button size="sm">
              <Plus className="h-3 w-3 ml-1" />
              معاملة بسيطة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المالك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSimpleTransactions.map((trx, index) => (
                  <TableRow key={trx.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{trx.id}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trx.ownerName}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trx.type} - {trx.subType}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{trx.location}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trx.area} م²</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: trx.status === 'مكتملة' ? '#dcfce7' : trx.status === 'قيد المعالجة' ? '#fef3c7' : '#dbeafe',
                          color: trx.status === 'مكتملة' ? '#166534' : trx.status === 'قيد المعالجة' ? '#854d0e' : '#1e40af',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {trx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col gap-1">
                        <Progress value={trx.progress} className="h-2" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trx.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" title="تحويل لمعاملة كاملة">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* تحذير */}
      <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملات بسيطة - محدودة المزايا</p>
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذه الشاشة للمعاملات البسيطة فقط. يمكنك تحويل أي معاملة لمعاملة كاملة في شاشة 284 للحصول على جميع المزايا.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 287-02: بيانات المالك
  // ============================================================

  const renderTab02_OwnerData = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>بيانات المالك الأساسية</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الاسم الرباعي ومعلومات الاتصال فقط
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* الاسم الرباعي */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم الرباعي</h3>
              <div className="grid grid-cols-4 gap-4">
                <InputWithCopy
                  label="الاسم الأول *"
                  id="ownerFirstName"
                  value={formData.ownerFirstName}
                  onChange={(e) => setFormData({ ...formData, ownerFirstName: e.target.value })}
                  placeholder="أحمد"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="اسم الأب *"
                  id="ownerFatherName"
                  value={formData.ownerFatherName}
                  onChange={(e) => setFormData({ ...formData, ownerFatherName: e.target.value })}
                  placeholder="محمد"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="اسم الجد *"
                  id="ownerGrandName"
                  value={formData.ownerGrandName}
                  onChange={(e) => setFormData({ ...formData, ownerGrandName: e.target.value })}
                  placeholder="عبدالله"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="اسم العائلة *"
                  id="ownerLastName"
                  value={formData.ownerLastName}
                  onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                  placeholder="السالم"
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الاتصال</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="رقم الجوال *"
                  id="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="البريد الإلكتروني"
                  id="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  placeholder="email@example.com"
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 287-03: الموقع والأرض
  // ============================================================

  const renderTab03_Location = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>بيانات الموقع والأرض</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* النوع */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المشروع</h3>
              <div className="grid grid-cols-2 gap-4">
                <SelectWithCopy
                  label="التصنيف الرئيسي *"
                  id="type"
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value })}
                  options={[
                    { value: 'سكني', label: 'سكني' },
                    { value: 'تجاري', label: 'تجاري' },
                    { value: 'صناعي', label: 'صناعي' },
                    { value: 'إداري', label: 'إداري' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
                <SelectWithCopy
                  label="التصنيف الفرعي *"
                  id="subType"
                  value={formData.subType}
                  onChange={(value) => setFormData({ ...formData, subType: value })}
                  options={
                    formData.type === 'سكني'
                      ? [
                          { value: 'فيلا', label: 'فيلا' },
                          { value: 'عمارة سكنية', label: 'عمارة سكنية' },
                          { value: 'مجمع سكني', label: 'مجمع سكني' }
                        ]
                      : [
                          { value: 'محل تجاري', label: 'محل تجاري' },
                          { value: 'مركز تجاري', label: 'مركز تجاري' }
                        ]
                  }
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* الموقع */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع الجغرافي</h3>
              <div className="grid grid-cols-3 gap-4">
                <InputWithCopy
                  label="المدينة *"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="الرياض"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="الحي *"
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="حي النرجس"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="رقم القطعة *"
                  id="plotNumber"
                  value={formData.plotNumber}
                  onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                  placeholder="1234"
                  required
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* المساحة */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</h3>
              <InputWithCopy
                label="مساحة الأرض (م²) *"
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="500"
                required
                copyable={true}
                clearable={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التابات المتبقية (placeholders مبسطة)
  const renderTab04_Requirements = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المتطلبات الأساسية</CardTitle>
      </CardHeader>
      <CardContent>
        <TextAreaWithCopy
          label="المتطلبات"
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={10}
          placeholder="اكتب المتطلبات الأساسية للمشروع..."
          copyable={true}
          clearable={true}
        />
      </CardContent>
    </Card>
  );

  const renderTab05_Documents = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المستندات الأساسية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            <Paperclip className="h-4 w-4 ml-2" />
            رفع صك الملكية
          </Button>
          <Button variant="outline" className="w-full">
            <Paperclip className="h-4 w-4 ml-2" />
            رفع صورة الهوية
          </Button>
          <Button variant="outline" className="w-full">
            <Paperclip className="h-4 w-4 ml-2" />
            رفع المخطط
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTab06_Fees = () => (
    <Tab_287_06_Fees_Complete_Advanced transactionId={selectedTransaction} />
  );

  const renderTab07_Notes = () => (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <TextAreaWithCopy
          label="ملاحظات"
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={10}
          placeholder="اكتب أي ملاحظات..."
          copyable={true}
          clearable={true}
        />
      </CardContent>
    </Card>
  );

  const renderTab08_FinalFiles = () => (
    <Tab_287_08_FinalFiles_Complete />
  );

  // ============================================================
  // عرض محتوى التاب النشط
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '287-01':
        return renderTab01_BasicInfo();
      case '287-02':
        return renderTab02_OwnerData();
      case '287-03':
        return renderTab03_Location();
      case '287-04':
        return renderTab04_Requirements();
      case '287-05':
        return renderTab05_Documents();
      case '287-06':
        return renderTab06_Fees();
      case '287-07':
        return renderTab07_Notes();
      case '287-08':
        return renderTab08_FinalFiles();
      default:
        return renderTab01_BasicInfo();
    }
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
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
              <Zap className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
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
                  معاملات بسيطة
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
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    287
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
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                نسخة مبسطة من شاشة معالجة المعاملات للمعاملات السريعة
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
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                8 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SimpleTransactions_Complete_287_v1;
