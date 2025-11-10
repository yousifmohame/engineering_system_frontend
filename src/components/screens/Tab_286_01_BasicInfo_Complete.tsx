/**
 * التاب 286-01 - المعلومات الأساسية لإنشاء معاملة - شامل ومكثف
 * ================================================================
 * 
 * المميزات:
 * - معلومات المعاملة الأساسية الشاملة
 * - اختيار نوع المعاملة مع مواصفات تفصيلية
 * - معلومات العميل/المالك
 * - معلومات الموقع والعقار
 * - معلومات الطلب والأولويات
 * - الفريق والتكلفة المبدئية
 * - المواعيد المتوقعة
 * - ملاحظات ومرفقات
 * - حفظ في localStorage
 * - تحقق من البيانات المطلوبة
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  FileText, User, Building, MapPin, Calendar, DollarSign,
  Users, Target, AlertCircle, CheckCircle, Save, X, RefreshCw,
  Phone, Mail, Hash, Home, Briefcase, Clock, TrendingUp, Flag
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

interface TransactionBasicInfo {
  // معلومات المعاملة
  transactionNumber: string;
  transactionType: string;
  transactionCategory: string;
  transactionTitle: string;
  priority: string;
  expectedDuration: number;
  expectedStartDate: string;
  expectedEndDate: string;
  
  // معلومات العميل
  clientType: string;
  clientName: string;
  clientId: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  
  // معلومات العقار
  propertyType: string;
  deedNumber: string;
  plotNumber: string;
  planNumber: string;
  district: string;
  city: string;
  landArea: number;
  
  // معلومات الطلب
  requestSource: string;
  requestDate: string;
  requestedBy: string;
  purposeBrief: string;
  purposeDetailed: string;
  
  // الفريق والتكلفة
  projectManager: string;
  teamMembers: string[];
  estimatedCost: number;
  agreedCost: number;
  
  // إعدادات
  autoAssignTasks: boolean;
  sendNotifications: boolean;
  requireApproval: boolean;
  isUrgent: boolean;
  
  // ملاحظات
  notes: string;
  internalNotes: string;
}

interface Props {
  onSave?: (data: TransactionBasicInfo) => void;
  initialData?: Partial<TransactionBasicInfo>;
  readOnly?: boolean;
}

const Tab_286_01_BasicInfo_Complete: React.FC<Props> = ({ 
  onSave, 
  initialData,
  readOnly = false 
}) => {
  // توليد رقم معاملة تلقائي
  const generateTransactionNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 999) + 1;
    const sequential = String(random).padStart(3, '0');
    return `${year}${month}${sequential}`;
  };

  const [data, setData] = useState<TransactionBasicInfo>({
    // معلومات المعاملة
    transactionNumber: generateTransactionNumber(),
    transactionType: '',
    transactionCategory: '',
    transactionTitle: '',
    priority: 'medium',
    expectedDuration: 30,
    expectedStartDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    
    // معلومات العميل
    clientType: 'individual',
    clientName: '',
    clientId: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    
    // معلومات العقار
    propertyType: '',
    deedNumber: '',
    plotNumber: '',
    planNumber: '',
    district: '',
    city: 'الرياض',
    landArea: 0,
    
    // معلومات الطلب
    requestSource: 'office',
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy: 'المهندس أحمد العلي',
    purposeBrief: '',
    purposeDetailed: '',
    
    // الفريق والتكلفة
    projectManager: '',
    teamMembers: [],
    estimatedCost: 0,
    agreedCost: 0,
    
    // إعدادات
    autoAssignTasks: true,
    sendNotifications: true,
    requireApproval: false,
    isUrgent: false,
    
    // ملاحظات
    notes: '',
    internalNotes: '',
    
    ...initialData
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // حساب تاريخ الانتهاء تلقائياً
  useEffect(() => {
    if (data.expectedStartDate && data.expectedDuration) {
      const start = new Date(data.expectedStartDate);
      start.setDate(start.getDate() + data.expectedDuration);
      const endDate = start.toISOString().split('T')[0];
      if (data.expectedEndDate !== endDate) {
        setData(prev => ({ ...prev, expectedEndDate: endDate }));
      }
    }
  }, [data.expectedStartDate, data.expectedDuration]);

  // التحقق من البيانات المطلوبة
  const validateData = (): string[] => {
    const validationErrors: string[] = [];
    
    if (!data.transactionType) validationErrors.push('نوع المعاملة مطلوب');
    if (!data.transactionTitle) validationErrors.push('عنوان المعاملة مطلوب');
    if (!data.clientName) validationErrors.push('اسم العميل مطلوب');
    if (!data.clientId) validationErrors.push('رقم هوية العميل مطلوب');
    if (!data.clientPhone) validationErrors.push('رقم جوال العميل مطلوب');
    if (!data.projectManager) validationErrors.push('مدير المشروع مطلوب');
    
    return validationErrors;
  };

  // الحفظ
  const handleSave = () => {
    const validationErrors = validateData();
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      alert(`⚠️ يرجى تعبئة الحقول المطلوبة:\n${validationErrors.join('\n')}`);
      return;
    }
    
    setErrors([]);
    localStorage.setItem(`transaction_basic_${data.transactionNumber}`, JSON.stringify(data));
    setHasUnsavedChanges(false);
    
    if (onSave) {
      onSave(data);
    }
    
    alert('✅ تم حفظ المعلومات الأساسية بنجاح!');
  };

  // إعادة التعيين
  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟')) {
      setData({
        ...data,
        transactionType: '',
        transactionTitle: '',
        clientName: '',
        clientId: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        deedNumber: '',
        plotNumber: '',
        planNumber: '',
        district: '',
        landArea: 0,
        purposeBrief: '',
        purposeDetailed: '',
        projectManager: '',
        estimatedCost: 0,
        agreedCost: 0,
        notes: '',
        internalNotes: ''
      });
      setHasUnsavedChanges(false);
      setErrors([]);
    }
  };

  // أنواع المعاملات
  const transactionTypes = [
    { value: 'building_permit', label: 'ترخيص بناء', duration: 30, category: 'licenses' },
    { value: 'subdivision', label: 'إفراز', duration: 25, category: 'properties' },
    { value: 'deed_modification', label: 'تعديل صك', duration: 15, category: 'properties' },
    { value: 'engineering_consultation', label: 'استشارة هندسية', duration: 10, category: 'consultations' },
    { value: 'supervision', label: 'إشراف هندسي', duration: 180, category: 'supervision' },
    { value: 'design', label: 'تصميم معماري', duration: 45, category: 'design' },
    { value: 'surveying', label: 'مساحة', duration: 7, category: 'surveying' },
    { value: 'other', label: 'أخرى', duration: 0, category: 'other' }
  ];

  // الأولويات
  const priorities = [
    { value: 'low', label: 'منخفضة', color: '#6b7280', bgColor: '#f3f4f6' },
    { value: 'medium', label: 'متوسطة', color: '#3b82f6', bgColor: '#dbeafe' },
    { value: 'high', label: 'عالية', color: '#f59e0b', bgColor: '#fef3c7' },
    { value: 'urgent', label: 'عاجلة', color: '#ef4444', bgColor: '#fee2e2' }
  ];

  // المديرين
  const managers = [
    { value: 'mgr1', label: 'المهندس أحمد العلي' },
    { value: 'mgr2', label: 'المهندسة فاطمة محمد' },
    { value: 'mgr3', label: 'المهندس خالد السعيد' },
    { value: 'mgr4', label: 'المهندسة نورة الحسن' }
  ];

  // تحديث البيانات
  const updateData = (field: keyof TransactionBasicInfo, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // تحديث المدة المتوقعة عند تغيير نوع المعاملة
    if (field === 'transactionType') {
      const selectedType = transactionTypes.find(t => t.value === value);
      if (selectedType) {
        setData(prev => ({ 
          ...prev, 
          [field]: value,
          expectedDuration: selectedType.duration,
          transactionCategory: selectedType.category
        }));
      }
    }
  };

  const selectedPriority = priorities.find(p => p.value === data.priority);

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-01" position="top-right" />
      
      {/* الهيدر مع الأزرار */}
      <Card className="card-rtl" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '2px solid #0ea5e9'
      }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                <FileText className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>
                  المعلومات الأساسية لإنشاء معاملة جديدة
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  تعبئة جميع المعلومات الضرورية لإنشاء المعاملة
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                padding: '6px 12px',
                fontSize: '12px'
              }}>
                {data.transactionNumber}
              </Badge>
              
              {!readOnly && (
                <>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                  >
                    <RefreshCw className="h-4 w-4 ml-1" />
                    إعادة تعيين
                  </Button>
                  <Button
                    onClick={handleSave}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Save className="h-4 w-4 ml-1" />
                    حفظ المعلومات
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* تحذيرات الحقول المطلوبة */}
          {errors.length > 0 && (
            <div className="mt-3 p-3" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid #ef4444'
            }}>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5" style={{ color: '#ef4444', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#991b1b', margin: 0 }}>
                    ⚠️ يرجى تعبئة الحقول المطلوبة التالية:
                  </p>
                  <ul style={{ fontSize: '12px', color: '#991b1b', margin: '4px 0 0 20px', padding: 0 }}>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ScrollArea style={{ height: 'calc(100vh - 280px)' }}>
        <div className="space-y-4 pl-4">
          
          {/* 1️⃣ معلومات المعاملة الأساسية */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                <Target className="h-5 w-5 inline ml-2" />
                معلومات المعاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="رقم المعاملة (تلقائي)"
                  id="transactionNumber"
                  value={data.transactionNumber}
                  onChange={(e) => updateData('transactionNumber', e.target.value)}
                  disabled
                  copyable
                  clearable={false}
                />
                
                <SelectWithCopy
                  label="نوع المعاملة *"
                  id="transactionType"
                  value={data.transactionType}
                  onChange={(value) => updateData('transactionType', value)}
                  options={transactionTypes.map(t => ({ value: t.value, label: t.label }))}
                  disabled={readOnly}
                  copyable
                  clearable
                />
                
                <SelectWithCopy
                  label="الأولوية *"
                  id="priority"
                  value={data.priority}
                  onChange={(value) => updateData('priority', value)}
                  options={priorities.map(p => ({ value: p.value, label: p.label }))}
                  disabled={readOnly}
                  copyable
                  clearable={false}
                />
              </div>

              <InputWithCopy
                label="عنوان المعاملة *"
                id="transactionTitle"
                value={data.transactionTitle}
                onChange={(e) => updateData('transactionTitle', e.target.value)}
                disabled={readOnly}
                placeholder="مثال: ترخيص بناء فيلا سكنية"
                required
                copyable
                clearable
              />

              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="تاريخ البدء المتوقع"
                  id="expectedStartDate"
                  type="date"
                  value={data.expectedStartDate}
                  onChange={(e) => updateData('expectedStartDate', e.target.value)}
                  disabled={readOnly}
                  copyable={false}
                  clearable={false}
                />
                
                <InputWithCopy
                  label="المدة المتوقعة (أيام)"
                  id="expectedDuration"
                  type="number"
                  value={data.expectedDuration.toString()}
                  onChange={(e) => updateData('expectedDuration', parseInt(e.target.value) || 0)}
                  disabled={readOnly}
                  copyable
                  clearable={false}
                />
                
                <InputWithCopy
                  label="تاريخ الانتهاء المتوقع (محسوب)"
                  id="expectedEndDate"
                  type="date"
                  value={data.expectedEndDate}
                  disabled
                  copyable={false}
                  clearable={false}
                />
              </div>

              {selectedPriority && (
                <div className="p-3" style={{
                  background: selectedPriority.bgColor,
                  borderRadius: '8px',
                  border: `2px solid ${selectedPriority.color}`
                }}>
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5" style={{ color: selectedPriority.color }} />
                    <p style={{ fontSize: '13px', fontWeight: 600, color: selectedPriority.color, margin: 0 }}>
                      الأولوية: {selectedPriority.label}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2️⃣ معلومات العميل/المالك */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af' }}>
                <User className="h-5 w-5 inline ml-2" />
                معلومات العميل/المالك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <SelectWithCopy
                  label="نوع العميل *"
                  id="clientType"
                  value={data.clientType}
                  onChange={(value) => updateData('clientType', value)}
                  options={[
                    { value: 'individual', label: 'فرد' },
                    { value: 'company', label: 'شركة' },
                    { value: 'government', label: 'جهة حكومية' }
                  ]}
                  disabled={readOnly}
                  copyable
                  clearable={false}
                />
                
                <InputWithCopy
                  label="اسم العميل الكامل *"
                  id="clientName"
                  value={data.clientName}
                  onChange={(e) => updateData('clientName', e.target.value)}
                  disabled={readOnly}
                  placeholder="الاسم الكامل"
                  required
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="رقم الهوية/السجل *"
                  id="clientId"
                  value={data.clientId}
                  onChange={(e) => updateData('clientId', e.target.value)}
                  disabled={readOnly}
                  placeholder="رقم الهوية أو السجل التجاري"
                  required
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="رقم الجوال *"
                  id="clientPhone"
                  type="tel"
                  value={data.clientPhone}
                  onChange={(e) => updateData('clientPhone', e.target.value)}
                  disabled={readOnly}
                  placeholder="05xxxxxxxx"
                  required
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="البريد الإلكتروني"
                  id="clientEmail"
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => updateData('clientEmail', e.target.value)}
                  disabled={readOnly}
                  placeholder="email@example.com"
                  copyable
                  clearable
                />
              </div>

              <TextAreaWithCopy
                label="العنوان"
                id="clientAddress"
                value={data.clientAddress}
                onChange={(e) => updateData('clientAddress', e.target.value)}
                disabled={readOnly}
                placeholder="العنوان الكامل"
                rows={2}
                copyable
                clearable
              />
            </CardContent>
          </Card>

          {/* 3️⃣ معلومات العقار */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            border: '2px solid #a855f7'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#7c3aed' }}>
                <Building className="h-5 w-5 inline ml-2" />
                معلومات العقار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <SelectWithCopy
                  label="نوع العقار"
                  id="propertyType"
                  value={data.propertyType}
                  onChange={(value) => updateData('propertyType', value)}
                  options={[
                    { value: 'residential', label: 'سكني' },
                    { value: 'commercial', label: 'تجاري' },
                    { value: 'industrial', label: 'صناعي' },
                    { value: 'agricultural', label: 'زراعي' },
                    { value: 'mixed', label: 'مختلط' }
                  ]}
                  disabled={readOnly}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="رقم الصك"
                  id="deedNumber"
                  value={data.deedNumber}
                  onChange={(e) => updateData('deedNumber', e.target.value)}
                  disabled={readOnly}
                  placeholder="رقم الصك"
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="رقم القطعة"
                  id="plotNumber"
                  value={data.plotNumber}
                  onChange={(e) => updateData('plotNumber', e.target.value)}
                  disabled={readOnly}
                  placeholder="رقم القطعة"
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <InputWithCopy
                  label="رقم المخطط"
                  id="planNumber"
                  value={data.planNumber}
                  onChange={(e) => updateData('planNumber', e.target.value)}
                  disabled={readOnly}
                  placeholder="رقم المخطط"
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="الحي"
                  id="district"
                  value={data.district}
                  onChange={(e) => updateData('district', e.target.value)}
                  disabled={readOnly}
                  placeholder="اسم الحي"
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="المدينة"
                  id="city"
                  value={data.city}
                  onChange={(e) => updateData('city', e.target.value)}
                  disabled={readOnly}
                  placeholder="المدينة"
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="مساحة الأرض (م²)"
                  id="landArea"
                  type="number"
                  value={data.landArea.toString()}
                  onChange={(e) => updateData('landArea', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                  placeholder="المساحة"
                  copyable
                  clearable={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4️⃣ معلومات الطلب */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            border: '2px solid #ec4899'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>
                <Briefcase className="h-5 w-5 inline ml-2" />
                معلومات الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <SelectWithCopy
                  label="مصدر الطلب"
                  id="requestSource"
                  value={data.requestSource}
                  onChange={(value) => updateData('requestSource', value)}
                  options={[
                    { value: 'office', label: 'المكتب مباشرة' },
                    { value: 'phone', label: 'اتصال هاتفي' },
                    { value: 'email', label: 'بريد إلكتروني' },
                    { value: 'website', label: 'الموقع الإلكتروني' },
                    { value: 'reference', label: 'إحالة' }
                  ]}
                  disabled={readOnly}
                  copyable
                  clearable={false}
                />
                
                <InputWithCopy
                  label="تاريخ الطلب"
                  id="requestDate"
                  type="date"
                  value={data.requestDate}
                  onChange={(e) => updateData('requestDate', e.target.value)}
                  disabled={readOnly}
                  copyable={false}
                  clearable={false}
                />
                
                <InputWithCopy
                  label="مستلم الطلب"
                  id="requestedBy"
                  value={data.requestedBy}
                  onChange={(e) => updateData('requestedBy', e.target.value)}
                  disabled={readOnly}
                  copyable
                  clearable
                />
              </div>

              <TextAreaWithCopy
                label="الغرض المختصر من الطلب"
                id="purposeBrief"
                value={data.purposeBrief}
                onChange={(e) => updateData('purposeBrief', e.target.value)}
                disabled={readOnly}
                placeholder="وصف مختصر للغرض من المعاملة"
                rows={2}
                copyable
                clearable
              />

              <TextAreaWithCopy
                label="الغرض التفصيلي من الطلب"
                id="purposeDetailed"
                value={data.purposeDetailed}
                onChange={(e) => updateData('purposeDetailed', e.target.value)}
                disabled={readOnly}
                placeholder="وصف تفصيلي شامل للغرض من المعاملة"
                rows={4}
                copyable
                clearable
              />
            </CardContent>
          </Card>

          {/* 5️⃣ الفريق والتكلفة */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            border: '2px solid #10b981'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#065f46' }}>
                <Users className="h-5 w-5 inline ml-2" />
                الفريق والتكلفة المبدئية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SelectWithCopy
                label="مدير المشروع *"
                id="projectManager"
                value={data.projectManager}
                onChange={(value) => updateData('projectManager', value)}
                options={managers}
                disabled={readOnly}
                copyable
                clearable
              />

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="التكلفة التقديرية (ريال)"
                  id="estimatedCost"
                  type="number"
                  value={data.estimatedCost.toString()}
                  onChange={(e) => updateData('estimatedCost', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                  placeholder="0.00"
                  copyable
                  clearable={false}
                />
                
                <InputWithCopy
                  label="التكلفة المتفق عليها (ريال)"
                  id="agreedCost"
                  type="number"
                  value={data.agreedCost.toString()}
                  onChange={(e) => updateData('agreedCost', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                  placeholder="0.00"
                  copyable
                  clearable={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* 6️⃣ الإعدادات */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            border: '2px solid #0284c7'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#0c4a6e' }}>
                <Settings className="h-5 w-5 inline ml-2" />
                الإعدادات والخيارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <EnhancedSwitch
                  id="autoAssignTasks"
                  checked={data.autoAssignTasks}
                  onCheckedChange={(checked) => updateData('autoAssignTasks', checked)}
                  label="تعيين المهام تلقائياً"
                  description="تعيين المهام للفريق حسب الإعدادات المسبقة"
                  size="md"
                  variant="default"
                  disabled={readOnly}
                />
                
                <EnhancedSwitch
                  id="sendNotifications"
                  checked={data.sendNotifications}
                  onCheckedChange={(checked) => updateData('sendNotifications', checked)}
                  label="إرسال إشعارات"
                  description="إرسال إشعارات للفريق والعميل"
                  size="md"
                  variant="success"
                  disabled={readOnly}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EnhancedSwitch
                  id="requireApproval"
                  checked={data.requireApproval}
                  onCheckedChange={(checked) => updateData('requireApproval', checked)}
                  label="يتطلب موافقة"
                  description="المعاملة تحتاج موافقة المدير قبل البدء"
                  size="md"
                  variant="warning"
                  disabled={readOnly}
                />
                
                <EnhancedSwitch
                  id="isUrgent"
                  checked={data.isUrgent}
                  onCheckedChange={(checked) => updateData('isUrgent', checked)}
                  label="معاملة عاجلة"
                  description="معاملة ذات أولوية عاجلة"
                  size="md"
                  variant="danger"
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* 7️⃣ الملاحظات */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
            border: '2px solid #eab308'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#854d0e' }}>
                <FileText className="h-5 w-5 inline ml-2" />
                الملاحظات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TextAreaWithCopy
                label="ملاحظات عامة"
                id="notes"
                value={data.notes}
                onChange={(e) => updateData('notes', e.target.value)}
                disabled={readOnly}
                placeholder="ملاحظات عامة عن المعاملة"
                rows={3}
                copyable
                clearable
              />
              
              <TextAreaWithCopy
                label="ملاحظات داخلية (للفريق فقط)"
                id="internalNotes"
                value={data.internalNotes}
                onChange={(e) => updateData('internalNotes', e.target.value)}
                disabled={readOnly}
                placeholder="��لاحظات داخلية للفريق"
                rows={3}
                copyable
                clearable
              />
            </CardContent>
          </Card>

        </div>
      </ScrollArea>

      {/* تحذير التغييرات غير المحفوظة */}
      {hasUnsavedChanges && !readOnly && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          zIndex: 999,
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '14px',
          fontWeight: 600
        }}>
          ⚠️ يوجد تغييرات غير محفوظة
        </div>
      )}
    </div>
  );
};

export default Tab_286_01_BasicInfo_Complete;
