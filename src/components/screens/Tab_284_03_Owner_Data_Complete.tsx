/**
 * التاب 284-03 - بيانات المالك - شامل ومكثف
 * ============================================
 * 
 * المميزات:
 * - معلومات المالك الأساسية الشاملة
 * - معلومات الاتصال المتعددة
 * - معلومات الصك والملكية
 * - معلومات إضافية ووظيفية
 * - جدول الشركاء في الملكية
 * - المستندات المرفقة
 * - ملاحظات وتنبيهات
 * - حفظ في localStorage
 * - تكامل مع النظام
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  User, Phone, Mail, MapPin, Calendar, Briefcase, Users,
  Home, FileText, Upload, Plus, Trash2, Edit2, Save,
  Shield, AlertCircle, CheckCircle, X, Copy, IdCard,
  Globe, Building, Heart
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { safeCopyToClipboard } from '../CopyHelper';

interface OwnerPartner {
  id: string;
  name: string;
  idNumber: string;
  ownership: number;
  phone: string;
  email: string;
}

interface OwnerDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface OwnerData {
  // معلومات أساسية
  fullName: string;
  idNumber: string;
  idType: string;
  nationality: string;
  birthDate: string;
  age: number;
  gender: string;
  maritalStatus: string;
  
  // معلومات الاتصال
  mobile1: string;
  mobile2: string;
  email: string;
  nationalAddress: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  
  // معلومات الصك
  deedNumber: string;
  deedDate: string;
  deedSource: string;
  ownershipType: string;
  
  // معلومات إضافية
  profession: string;
  employer: string;
  representativeType: string;
  isPowerOfAttorney: boolean;
  attorneyName: string;
  attorneyId: string;
  attorneyDocument: string;
  
  // الشركاء
  partners: OwnerPartner[];
  
  // المستندات
  documents: OwnerDocument[];
  
  // ملاحظات
  notes: string;
  alerts: string;
  isVerified: boolean;
  verifiedDate: string;
  verifiedBy: string;
}

interface Props {
  transactionId: string;
  readOnly?: boolean;
}

const Tab_284_03_Owner_Data_Complete: React.FC<Props> = ({ 
  transactionId, 
  readOnly = false 
}) => {
  const [ownerData, setOwnerData] = useState<OwnerData>({
    // معلومات أساسية
    fullName: 'عبدالله بن محمد الأحمد',
    idNumber: '1234567890',
    idType: 'national',
    nationality: 'سعودي',
    birthDate: '1985-03-15',
    age: 39,
    gender: 'male',
    maritalStatus: 'married',
    
    // معلومات الاتصال
    mobile1: '0501234567',
    mobile2: '0557654321',
    email: 'abdullah.ahmed@email.com',
    nationalAddress: 'RRRRNNNN',
    city: 'الرياض',
    district: 'الملقا',
    street: 'شارع الملك فهد',
    postalCode: '12345',
    
    // معلومات الصك
    deedNumber: '12345/6789',
    deedDate: '2020-01-15',
    deedSource: 'كتابة العدل - الرياض',
    ownershipType: 'individual',
    
    // معلومات إضافية
    profession: 'مهندس معماري',
    employer: 'شركة الهندسة الحديثة',
    representativeType: 'owner',
    isPowerOfAttorney: false,
    attorneyName: '',
    attorneyId: '',
    attorneyDocument: '',
    
    // الشركاء
    partners: [],
    
    // المستندات
    documents: [
      {
        id: 'doc1',
        name: 'صورة الهوية الوطنية',
        type: 'ID',
        uploadDate: '2025-01-15',
        size: '2.5 MB'
      },
      {
        id: 'doc2',
        name: 'صورة الصك',
        type: 'Deed',
        uploadDate: '2025-01-15',
        size: '1.8 MB'
      }
    ],
    
    // ملاحظات
    notes: '',
    alerts: '',
    isVerified: true,
    verifiedDate: '2025-01-16',
    verifiedBy: 'المهندس أحمد العلي'
  });

  const [editMode, setEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAddPartnerDialog, setShowAddPartnerDialog] = useState(false);
  const [newPartner, setNewPartner] = useState<OwnerPartner>({
    id: '',
    name: '',
    idNumber: '',
    ownership: 0,
    phone: '',
    email: ''
  });

  // حساب العمر تلقائياً
  useEffect(() => {
    if (ownerData.birthDate) {
      const today = new Date();
      const birthDate = new Date(ownerData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setOwnerData(prev => ({ ...prev, age }));
    }
  }, [ownerData.birthDate]);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`owner_data_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOwnerData(parsed);
      } catch (error) {
        console.error('Error loading owner data:', error);
      }
    }
  }, [transactionId]);

  // حفظ البيانات
  const handleSave = () => {
    try {
      localStorage.setItem(`owner_data_${transactionId}`, JSON.stringify(ownerData));
      setHasUnsavedChanges(false);
      setEditMode(false);
      alert('✅ تم حفظ بيانات المالك بنجاح!');
    } catch (error) {
      console.error('Error saving owner data:', error);
      alert('❌ حدث خطأ أثناء الحفظ');
    }
  };

  // إضافة شريك
  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.idNumber || newPartner.ownership <= 0) {
      alert('⚠️ الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    const partnersOwnership = ownerData.partners.reduce((sum, p) => sum + p.ownership, 0);
    const totalOwnership = partnersOwnership + newPartner.ownership;
    
    if (totalOwnership > 100) {
      alert('⚠️ مجموع نسب الملكية يتجاوز 100%');
      return;
    }
    
    const partner: OwnerPartner = {
      ...newPartner,
      id: `partner_${Date.now()}`
    };
    
    setOwnerData(prev => ({
      ...prev,
      partners: [...prev.partners, partner]
    }));
    
    setNewPartner({
      id: '',
      name: '',
      idNumber: '',
      ownership: 0,
      phone: '',
      email: ''
    });
    
    setShowAddPartnerDialog(false);
    setHasUnsavedChanges(true);
  };

  // حذف شريك
  const handleDeletePartner = (partnerId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
      setOwnerData(prev => ({
        ...prev,
        partners: prev.partners.filter(p => p.id !== partnerId)
      }));
      setHasUnsavedChanges(true);
    }
  };

  const totalPartnersOwnership = ownerData.partners.reduce((sum, p) => sum + p.ownership, 0);
  const ownerOwnership = 100 - totalPartnersOwnership;

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-284-03" position="top-right" />
      
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
                <User className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>
                  بيانات المالك
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  معلومات شاملة عن مالك العقار
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {ownerData.isVerified && (
                <Badge style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  fontSize: '12px'
                }}>
                  <CheckCircle className="h-3 w-3 ml-1" />
                  مُوَثَّق
                </Badge>
              )}
              
              {!readOnly && (
                <>
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#ffffff'
                      }}
                    >
                      <Edit2 className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff'
                        }}
                      >
                        <Save className="h-4 w-4 ml-1" />
                        حفظ
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          setHasUnsavedChanges(false);
                        }}
                        variant="outline"
                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                      >
                        <X className="h-4 w-4 ml-1" />
                        إلغاء
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea style={{ height: 'calc(100vh - 280px)' }}>
        <div className="space-y-4 pl-4">
          
          {/* 1️⃣ المعلومات الأساسية */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                <IdCard className="h-5 w-5 inline ml-2" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="الاسم الكامل *"
                  id="fullName"
                  value={ownerData.fullName}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, fullName: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="رقم الهوية/الإقامة *"
                  id="idNumber"
                  value={ownerData.idNumber}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, idNumber: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <SelectWithCopy
                  label="نوع الهوية *"
                  id="idType"
                  value={ownerData.idType}
                  onChange={(value) => {
                    setOwnerData({ ...ownerData, idType: value });
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'national', label: 'هوية وطنية' },
                    { value: 'resident', label: 'إقامة' },
                    { value: 'gcc', label: 'هوية خليجية' }
                  ]}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="الجنسية *"
                  id="nationality"
                  value={ownerData.nationality}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, nationality: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
                
                <SelectWithCopy
                  label="الجنس *"
                  id="gender"
                  value={ownerData.gender}
                  onChange={(value) => {
                    setOwnerData({ ...ownerData, gender: value });
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'male', label: 'ذكر' },
                    { value: 'female', label: 'أنثى' }
                  ]}
                  disabled={!editMode}
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="تاريخ الميلاد *"
                  id="birthDate"
                  type="date"
                  value={ownerData.birthDate}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, birthDate: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable={false}
                  clearable={false}
                />
                
                <InputWithCopy
                  label="العمر (محسوب)"
                  id="age"
                  value={ownerData.age.toString()}
                  disabled
                  copyable
                  clearable={false}
                />
                
                <SelectWithCopy
                  label="الحالة الاجتماعية"
                  id="maritalStatus"
                  value={ownerData.maritalStatus}
                  onChange={(value) => {
                    setOwnerData({ ...ownerData, maritalStatus: value });
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'single', label: 'أعزب' },
                    { value: 'married', label: 'متزوج' },
                    { value: 'divorced', label: 'مطلق' },
                    { value: 'widowed', label: 'أرمل' }
                  ]}
                  disabled={!editMode}
                  copyable
                  clearable
                />
              </div>
            </CardContent>
          </Card>

          {/* 2️⃣ معلومات الاتصال */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#1e40af' }}>
                <Phone className="h-5 w-5 inline ml-2" />
                معلومات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="رقم الجوال الرئيسي *"
                  id="mobile1"
                  type="tel"
                  value={ownerData.mobile1}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, mobile1: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="رقم جوال إضافي"
                  id="mobile2"
                  type="tel"
                  value={ownerData.mobile2}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, mobile2: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="البريد الإلكتروني *"
                  id="email"
                  type="email"
                  value={ownerData.email}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, email: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="العنوان الوطني"
                  id="nationalAddress"
                  value={ownerData.nationalAddress}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, nationalAddress: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="المدينة *"
                  id="city"
                  value={ownerData.city}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, city: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <InputWithCopy
                  label="الحي"
                  id="district"
                  value={ownerData.district}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, district: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="الشارع"
                  id="street"
                  value={ownerData.street}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, street: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="الرمز البريدي"
                  id="postalCode"
                  value={ownerData.postalCode}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, postalCode: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
              </div>
            </CardContent>
          </Card>

          {/* 3️⃣ معلومات الصك والملكية */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            border: '2px solid #a855f7'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#7c3aed' }}>
                <FileText className="h-5 w-5 inline ml-2" />
                معلومات الصك والملكية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="رقم الصك *"
                  id="deedNumber"
                  value={ownerData.deedNumber}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, deedNumber: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="تاريخ الصك *"
                  id="deedDate"
                  type="date"
                  value={ownerData.deedDate}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, deedDate: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable={false}
                  clearable={false}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="مصدر الصك *"
                  id="deedSource"
                  value={ownerData.deedSource}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, deedSource: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  required
                  copyable
                  clearable
                />
                
                <SelectWithCopy
                  label="نوع الملكية *"
                  id="ownershipType"
                  value={ownerData.ownershipType}
                  onChange={(value) => {
                    setOwnerData({ ...ownerData, ownershipType: value });
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: 'individual', label: 'ملكية فردية' },
                    { value: 'shared', label: 'ملكية مشتركة' },
                    { value: 'heirs', label: 'ملكية ورثة' }
                  ]}
                  disabled={!editMode}
                  copyable
                  clearable
                />
              </div>
            </CardContent>
          </Card>

          {/* 4️⃣ معلومات إضافية ووظيفية */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            border: '2px solid #ec4899'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>
                <Briefcase className="h-5 w-5 inline ml-2" />
                معلومات إضافية ووظيفية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="المهنة"
                  id="profession"
                  value={ownerData.profession}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, profession: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
                
                <InputWithCopy
                  label="جهة العمل"
                  id="employer"
                  value={ownerData.employer}
                  onChange={(e) => {
                    setOwnerData({ ...ownerData, employer: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  disabled={!editMode}
                  copyable
                  clearable
                />
              </div>

              <SelectWithCopy
                label="صفة مقدم الطلب *"
                id="representativeType"
                value={ownerData.representativeType}
                onChange={(value) => {
                  setOwnerData({ ...ownerData, representativeType: value });
                  setHasUnsavedChanges(true);
                }}
                options={[
                  { value: 'owner', label: 'المالك مباشرة' },
                  { value: 'attorney', label: 'وكيل بموجب وكالة' },
                  { value: 'guardian', label: 'ولي أمر' },
                  { value: 'heir', label: 'وريث' }
                ]}
                disabled={!editMode}
                copyable
                clearable
              />

              <div className="flex items-center gap-3 p-3" style={{
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(236, 72, 153, 0.3)'
              }}>
                <EnhancedSwitch
                  id="isPowerOfAttorney"
                  checked={ownerData.isPowerOfAttorney}
                  onCheckedChange={(checked) => {
                    setOwnerData({ ...ownerData, isPowerOfAttorney: checked });
                    setHasUnsavedChanges(true);
                  }}
                  label="يوجد وكالة"
                  description="هل يتم التعامل عبر وكيل بوكالة رسمية؟"
                  size="md"
                  variant="warning"
                  disabled={!editMode}
                />
              </div>

              {ownerData.isPowerOfAttorney && (
                <div className="grid grid-cols-3 gap-3 p-3" style={{
                  background: 'rgba(251, 146, 60, 0.1)',
                  borderRadius: '8px',
                  border: '1px dashed #f97316'
                }}>
                  <InputWithCopy
                    label="اسم الوكيل *"
                    id="attorneyName"
                    value={ownerData.attorneyName}
                    onChange={(e) => {
                      setOwnerData({ ...ownerData, attorneyName: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    disabled={!editMode}
                    required
                    copyable
                    clearable
                  />
                  
                  <InputWithCopy
                    label="رقم هوية الوكيل *"
                    id="attorneyId"
                    value={ownerData.attorneyId}
                    onChange={(e) => {
                      setOwnerData({ ...ownerData, attorneyId: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    disabled={!editMode}
                    required
                    copyable
                    clearable
                  />
                  
                  <InputWithCopy
                    label="رقم الوكالة *"
                    id="attorneyDocument"
                    value={ownerData.attorneyDocument}
                    onChange={(e) => {
                      setOwnerData({ ...ownerData, attorneyDocument: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    disabled={!editMode}
                    required
                    copyable
                    clearable
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5️⃣ الشركاء في الملكية */}
          {(ownerData.ownershipType === 'shared' || ownerData.ownershipType === 'heirs') && (
            <Card className="card-rtl" style={{ 
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '2px solid #10b981'
            }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#065f46' }}>
                    <Users className="h-5 w-5 inline ml-2" />
                    الشركاء في الملكية ({ownerData.partners.length})
                  </CardTitle>
                  
                  {editMode && (
                    <Button
                      onClick={() => setShowAddPartnerDialog(true)}
                      size="sm"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff'
                      }}
                    >
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة شريك
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* نسبة ملكية المالك الأساسي */}
                <div className="p-3" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '8px',
                  border: '2px solid #10b981'
                }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#065f46' }}>
                        {ownerData.fullName}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>
                        المالك الأساسي
                      </p>
                    </div>
                    <div style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '16px'
                    }}>
                      {ownerOwnership}%
                    </div>
                  </div>
                </div>

                {/* جدول الشركاء */}
                {ownerData.partners.length > 0 && (
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الاسم
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          رقم الهوية
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نسبة الملكية
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الجوال
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          البريد
                        </TableHead>
                        {editMode && (
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            إجراءات
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ownerData.partners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {partner.name}
                          </TableCell>
                          <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {partner.idNumber}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge style={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                              color: '#ffffff'
                            }}>
                              {partner.ownership}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {partner.phone}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                            {partner.email}
                          </TableCell>
                          {editMode && (
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePartner(partner.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* إجمالي نسب الملكية */}
                <div className="flex items-center justify-between p-3" style={{
                  background: totalPartnersOwnership + ownerOwnership === 100 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: `2px solid ${totalPartnersOwnership + ownerOwnership === 100 ? '#10b981' : '#ef4444'}`
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    إجمالي نسب الملكية:
                  </span>
                  <Badge style={{
                    background: totalPartnersOwnership + ownerOwnership === 100 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    fontSize: '16px',
                    padding: '6px 12px'
                  }}>
                    {totalPartnersOwnership + ownerOwnership}%
                  </Badge>
                </div>

                {totalPartnersOwnership + ownerOwnership !== 100 && (
                  <div className="flex items-center gap-2 p-3" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <AlertCircle className="h-5 w-5" style={{ color: '#ef4444' }} />
                    <p style={{ fontSize: '13px', color: '#991b1b' }}>
                      ⚠️ مجموع نسب الملكية يجب أن يساوي 100%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 6️⃣ المستندات المرفقة */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            border: '2px solid #0284c7'
          }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#0c4a6e' }}>
                  <FileText className="h-5 w-5 inline ml-2" />
                  المستندات المرفقة ({ownerData.documents.length})
                </CardTitle>
                
                {editMode && (
                  <Button
                    size="sm"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Upload className="h-4 w-4 ml-1" />
                    رفع ملف
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسم الملف
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      النوع
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تاريخ الرفع
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الحجم
                    </TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerData.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {doc.name}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {doc.uploadDate}
                      </TableCell>
                      <TableCell className="text-right font-mono" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {doc.size}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline">
                            عرض
                          </Button>
                          {editMode && (
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 7️⃣ الملاحظات والتنبيهات */}
          <Card className="card-rtl" style={{ 
            background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
            border: '2px solid #eab308'
          }}>
            <CardHeader className="pb-3">
              <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#854d0e' }}>
                <AlertCircle className="h-5 w-5 inline ml-2" />
                الملاحظات والتنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TextAreaWithCopy
                label="ملاحظات عامة"
                id="notes"
                value={ownerData.notes}
                onChange={(e) => {
                  setOwnerData({ ...ownerData, notes: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                rows={3}
                disabled={!editMode}
                copyable
                clearable
              />
              
              <TextAreaWithCopy
                label="تنبيهات مهمة"
                id="alerts"
                value={ownerData.alerts}
                onChange={(e) => {
                  setOwnerData({ ...ownerData, alerts: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                rows={2}
                disabled={!editMode}
                copyable
                clearable
              />
            </CardContent>
          </Card>

          {/* 8️⃣ حالة التوثيق */}
          {ownerData.isVerified && (
            <Card className="card-rtl" style={{ 
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              border: '2px solid #10b981'
            }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div style={{
                      padding: '10px',
                      background: '#10b981',
                      borderRadius: '50%'
                    }}>
                      <CheckCircle className="h-5 w-5" style={{ color: '#ffffff' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#065f46', margin: 0 }}>
                        تم التوثيق بنجاح
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        بواسطة: {ownerData.verifiedBy} • بتاريخ: {ownerData.verifiedDate}
                      </p>
                    </div>
                  </div>
                  <Shield className="h-8 w-8" style={{ color: '#10b981', opacity: 0.5 }} />
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </ScrollArea>

      {/* نافذة إضافة شريك */}
      {showAddPartnerDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card style={{ 
            width: '600px',
            maxHeight: '80vh',
            fontFamily: 'Tajawal, sans-serif',
            direction: 'rtl'
          }}>
            <CardHeader style={{ borderBottom: '2px solid #e5e7eb' }}>
              <CardTitle style={{ fontSize: '18px' }}>
                <Plus className="h-5 w-5 inline ml-2" />
                إضافة شريك جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <InputWithCopy
                label="اسم الشريك *"
                id="newPartnerName"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                required
                copyable={false}
                clearable
              />
              
              <InputWithCopy
                label="رقم الهوية *"
                id="newPartnerIdNumber"
                value={newPartner.idNumber}
                onChange={(e) => setNewPartner({ ...newPartner, idNumber: e.target.value })}
                required
                copyable={false}
                clearable
              />
              
              <InputWithCopy
                label="نسبة الملكية (%) *"
                id="newPartnerOwnership"
                type="number"
                value={newPartner.ownership.toString()}
                onChange={(e) => setNewPartner({ ...newPartner, ownership: parseFloat(e.target.value) || 0 })}
                required
                copyable={false}
                clearable={false}
              />
              
              <InputWithCopy
                label="رقم الجوال"
                id="newPartnerPhone"
                type="tel"
                value={newPartner.phone}
                onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                copyable={false}
                clearable
              />
              
              <InputWithCopy
                label="البريد الإلكتروني"
                id="newPartnerEmail"
                type="email"
                value={newPartner.email}
                onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                copyable={false}
                clearable
              />

              <div className="flex items-center gap-2 pt-3">
                <Button
                  onClick={handleAddPartner}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    flex: 1
                  }}
                >
                  <CheckCircle className="h-4 w-4 ml-1" />
                  إضافة
                </Button>
                <Button
                  onClick={() => setShowAddPartnerDialog(false)}
                  variant="outline"
                  style={{ flex: 1 }}
                >
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* تحذير التغييرات غير المحفوظة */}
      {hasUnsavedChanges && (
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

export default Tab_284_03_Owner_Data_Complete;
