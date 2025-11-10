/**
 * التاب 284-05 - بيانات مقدم الطلب الشاملة
 * ===========================================
 * 
 * نظام شامل لإدارة بيانات مقدم الطلب مع دعم الحالتين:
 * 1. المالك نفسه (نسخ تلقائي للبيانات)
 * 2. مقدم طلب آخر (بيانات كاملة + وكالة/تفويض)
 * 
 * الميزات:
 * - تبديل ذكي بين المالك ومقدم آخر
 * - نسخ تلقائي لبيانات المالك
 * - بيانات شخصية كاملة
 * - إدارة الوكالات والتفويضات
 * - رفع المستندات
 * - التحقق من صحة الوكالات
 * - محاكاة ربط مع ناجز
 * - تواريخ الصلاحية
 * - صلاحيات التفويض
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User, Users, FileCheck, Upload, CheckCircle, XCircle, AlertCircle,
  Calendar, Phone, Mail, MapPin, CreditCard, Building, Shield,
  FileText, Download, Eye, RefreshCw, ExternalLink, Check, X,
  Copy, UserCheck, Clock, AlertTriangle, Info, Briefcase, Home
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

// ==================== الواجهات ====================

interface ApplicantData {
  isOwner: boolean;                    // هل المقدم هو المالك نفسه؟
  relationToOwner?: string;            // العلاقة بالمالك
  
  // البيانات الشخصية
  arabicName: string;
  englishName: string;
  nationalId: string;
  idType: string;                      // نوع الهوية
  idIssueDate: string;
  idExpiryDate: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  
  // بيانات الاتصال
  mobile: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  
  // بيانات الوكالة/التفويض
  authorizationType?: string;          // نوع التفويض
  authorizationNumber?: string;        // رقم الوكالة/التفويض
  authorizationIssueDate?: string;
  authorizationExpiryDate?: string;
  authorizationScope?: string;         // نطاق الصلاحيات
  isVerifiedNajiz?: boolean;           // تم التحقق من ناجز؟
  najizVerificationDate?: string;
  najizVerificationStatus?: string;
  
  // المستندات
  idDocument?: File | null;
  authorizationDocument?: File | null;
  
  // ملاحظات
  notes?: string;
}

interface OwnerData {
  arabicName: string;
  englishName: string;
  nationalId: string;
  mobile: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
}

// ==================== البيانات الوهمية ====================

const MOCK_OWNER_DATA: OwnerData = {
  arabicName: 'عبدالله محمد السعيد',
  englishName: 'Abdullah Mohammed Al-Saeed',
  nationalId: '1234567890',
  mobile: '0501234567',
  phone: '0112345678',
  email: 'abdullah.alsaeed@example.com',
  address: 'شارع الملك فهد، حي النخيل',
  city: 'الرياض',
  dateOfBirth: '1985-05-15',
  nationality: 'سعودي',
  gender: 'ذكر'
};

const RELATION_TYPES = [
  { value: 'legal_agent', label: 'وكيل شرعي' },
  { value: 'son', label: 'ابن' },
  { value: 'daughter', label: 'ابنة' },
  { value: 'heir', label: 'وريث' },
  { value: 'authorized', label: 'مفوض' },
  { value: 'lawyer', label: 'محامي' },
  { value: 'representative', label: 'ممثل قانوني' }
];

const ID_TYPES = [
  { value: 'national_id', label: 'هوية وطنية' },
  { value: 'iqama', label: 'إقامة' },
  { value: 'passport', label: 'جواز سفر' },
  { value: 'gcc_id', label: 'هوية خليجية' }
];

const AUTHORIZATION_TYPES = [
  { value: 'general_power', label: 'وكالة عامة' },
  { value: 'special_power', label: 'وكالة خاصة' },
  { value: 'limited_authorization', label: 'تفويض محدد' },
  { value: 'absolute_authorization', label: 'تفويض مطلق' }
];

const AUTHORIZATION_SCOPES = [
  { value: 'all_transactions', label: 'جميع التصرفات والمعاملات' },
  { value: 'real_estate_only', label: 'المعاملات العقارية فقط' },
  { value: 'government_transactions', label: 'المعاملات الحكومية' },
  { value: 'financial_transactions', label: 'المعاملات المالية' },
  { value: 'specific_transaction', label: 'معاملة محددة فقط' }
];

const NATIONALITIES = [
  { value: 'saudi', label: 'سعودي' },
  { value: 'egyptian', label: 'مصري' },
  { value: 'jordanian', label: 'أردني' },
  { value: 'syrian', label: 'سوري' },
  { value: 'yemeni', label: 'يمني' },
  { value: 'other', label: 'أخرى' }
];

const SAUDI_CITIES = [
  { value: 'riyadh', label: 'الرياض' },
  { value: 'jeddah', label: 'جدة' },
  { value: 'makkah', label: 'مكة المكرمة' },
  { value: 'madinah', label: 'المدينة المنورة' },
  { value: 'dammam', label: 'الدمام' },
  { value: 'khobar', label: 'الخبر' },
  { value: 'taif', label: 'الطائف' },
  { value: 'tabuk', label: 'تبوك' },
  { value: 'other', label: 'أخرى' }
];

// ==================== المكون ====================

const Tab_284_05_Applicant_Data_Complete: React.FC = () => {
  const [applicantData, setApplicantData] = useState<ApplicantData>({
    isOwner: true,
    arabicName: MOCK_OWNER_DATA.arabicName,
    englishName: MOCK_OWNER_DATA.englishName,
    nationalId: MOCK_OWNER_DATA.nationalId,
    idType: 'national_id',
    idIssueDate: '2015-05-15',
    idExpiryDate: '2030-05-15',
    dateOfBirth: MOCK_OWNER_DATA.dateOfBirth,
    nationality: 'saudi',
    gender: 'male',
    mobile: MOCK_OWNER_DATA.mobile,
    phone: MOCK_OWNER_DATA.phone,
    email: MOCK_OWNER_DATA.email,
    address: MOCK_OWNER_DATA.address,
    city: 'riyadh',
    postalCode: '12345',
    notes: ''
  });

  const [showNajizDialog, setShowNajizDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<'id' | 'authorization'>('id');
  const [najizVerificationInProgress, setNajizVerificationInProgress] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // نسخ بيانات المالك تلقائياً عند التبديل
  const handleOwnerToggle = (isOwner: boolean) => {
    if (isOwner) {
      setApplicantData({
        ...applicantData,
        isOwner: true,
        arabicName: MOCK_OWNER_DATA.arabicName,
        englishName: MOCK_OWNER_DATA.englishName,
        nationalId: MOCK_OWNER_DATA.nationalId,
        mobile: MOCK_OWNER_DATA.mobile,
        phone: MOCK_OWNER_DATA.phone,
        email: MOCK_OWNER_DATA.email,
        address: MOCK_OWNER_DATA.address,
        dateOfBirth: MOCK_OWNER_DATA.dateOfBirth,
        relationToOwner: undefined,
        authorizationType: undefined,
        authorizationNumber: undefined,
        authorizationIssueDate: undefined,
        authorizationExpiryDate: undefined,
        authorizationScope: undefined
      });
    } else {
      setApplicantData({
        ...applicantData,
        isOwner: false,
        arabicName: '',
        englishName: '',
        nationalId: '',
        mobile: '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setHasUnsavedChanges(true);
  };

  // التحقق من ناجز
  const handleNajizVerification = () => {
    setNajizVerificationInProgress(true);
    
    // محاكاة عملية التحقق
    setTimeout(() => {
      setApplicantData({
        ...applicantData,
        isVerifiedNajiz: true,
        najizVerificationDate: new Date().toISOString().split('T')[0],
        najizVerificationStatus: 'verified'
      });
      setNajizVerificationInProgress(false);
      setShowNajizDialog(false);
      setHasUnsavedChanges(true);
    }, 2000);
  };

  // التحقق من صلاحية الوكالة
  const isAuthorizationValid = () => {
    if (!applicantData.authorizationExpiryDate) return null;
    const expiryDate = new Date(applicantData.authorizationExpiryDate);
    const today = new Date();
    return expiryDate > today;
  };

  // حساب الأيام المتبقية
  const getDaysRemaining = () => {
    if (!applicantData.authorizationExpiryDate) return null;
    const expiryDate = new Date(applicantData.authorizationExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // حفظ البيانات
  const handleSave = () => {
    console.log('Saving applicant data:', applicantData);
    setHasUnsavedChanges(false);
    // هنا يمكن إضافة منطق الحفظ الفعلي
  };

  return (
    <div className="space-y-4">
      <CodeDisplay code="TAB-284-05" position="top-right" />

      {/* تنبيه التغييرات غير المحفوظة */}
      {hasUnsavedChanges && (
        <Alert style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
          <AlertTriangle className="h-4 w-4" style={{ color: '#f59e0b' }} />
          <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
            لديك تغييرات غير محفوظة. تأكد من حفظ البيانات.
          </AlertDescription>
        </Alert>
      )}

      {/* مفتاح التبديل: المالك نفسه أم مقدم آخر */}
      <Card className="card-rtl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  padding: '10px',
                  background: applicantData.isOwner 
                    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '12px',
                  border: applicantData.isOwner 
                    ? '2px solid #10b981'
                    : '2px solid #3b82f6'
                }}
              >
                {applicantData.isOwner ? (
                  <UserCheck className="h-6 w-6" style={{ color: '#10b981' }} />
                ) : (
                  <Users className="h-6 w-6" style={{ color: '#3b82f6' }} />
                )}
              </div>
              
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                  {applicantData.isOwner ? 'المالك هو مقدم الطلب' : 'مقدم طلب آخر'}
                </h3>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                  {applicantData.isOwner 
                    ? 'البيانات منسوخة تلقائياً من بيانات المالك'
                    : 'يرجى إدخال بيانات مقدم الطلب والوكالة/التفويض'
                  }
                </p>
              </div>
            </div>

            <EnhancedSwitch
              id="is-owner-switch"
              checked={applicantData.isOwner}
              onCheckedChange={handleOwnerToggle}
              label="المالك نفسه؟"
              size="md"
              variant={applicantData.isOwner ? 'success' : 'default'}
            />
          </div>
        </CardContent>
      </Card>

      {/* العلاقة بالمالك (في حال مقدم آخر) */}
      {!applicantData.isOwner && (
        <Card className="card-rtl">
          <CardHeader style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderBottom: '2px solid #f59e0b' }}>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase className="h-5 w-5" style={{ color: '#f59e0b' }} />
              علاقة مقدم الطلب بالمالك
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                id="relation-type"
                label="نوع العلاقة *"
                value={applicantData.relationToOwner || ''}
                onChange={(value) => {
                  setApplicantData({ ...applicantData, relationToOwner: value });
                  setHasUnsavedChanges(true);
                }}
                options={[
                  { value: '', label: 'اختر نوع العلاقة' },
                  ...RELATION_TYPES
                ]}
                required
                copyable={false}
                clearable={true}
              />

              {applicantData.relationToOwner && (
                <div className="col-span-2">
                  <Alert style={{ background: '#eff6ff', border: '2px solid #3b82f6' }}>
                    <Info className="h-4 w-4" style={{ color: '#3b82f6' }} />
                    <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a', fontSize: '12px' }}>
                      {applicantData.relationToOwner === 'legal_agent' && 'يجب إرفاق وكالة شرعية سارية الصلاحية'}
                      {applicantData.relationToOwner === 'son' && 'يجب إرفاق ما يثبت صلة القرابة (بطاقة عائلية أو إثبات نسب)'}
                      {applicantData.relationToOwner === 'daughter' && 'يجب إرفاق ما يثبت صلة القرابة (بطاقة عائلية أو إثبات نسب)'}
                      {applicantData.relationToOwner === 'heir' && 'يجب إرفاق حصر الورثة وما يثبت صلة الوراثة'}
                      {applicantData.relationToOwner === 'authorized' && 'يجب إرفاق تفويض رسمي موثق'}
                      {applicantData.relationToOwner === 'lawyer' && 'يجب إرفاق عقد التوكيل ورخصة المحاماة'}
                      {applicantData.relationToOwner === 'representative' && 'يجب إرفاق ما يثبت التمثيل القانوني'}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* البيانات الشخصية */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderBottom: '2px solid #3b82f6' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="h-5 w-5" style={{ color: '#3b82f6' }} />
            البيانات الشخصية
            {applicantData.isOwner && (
              <Badge style={{ background: '#10b981', color: '#fff', fontSize: '10px' }}>
                منسوخة من بيانات المالك
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* الاسم بالعربي */}
            <InputWithCopy
              id="arabic-name"
              label="الاسم بالعربي *"
              value={applicantData.arabicName}
              onChange={(e) => {
                setApplicantData({ ...applicantData, arabicName: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="أدخل الاسم الكامل بالعربي"
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* الاسم بالإنجليزي */}
            <InputWithCopy
              id="english-name"
              label="الاسم بالإنجليزي *"
              value={applicantData.englishName}
              onChange={(e) => {
                setApplicantData({ ...applicantData, englishName: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="Full Name in English"
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* نوع الهوية */}
            <SelectWithCopy
              id="id-type"
              label="نوع الهوية *"
              value={applicantData.idType}
              onChange={(value) => {
                setApplicantData({ ...applicantData, idType: value });
                setHasUnsavedChanges(true);
              }}
              options={[
                { value: '', label: 'اختر نوع الهوية' },
                ...ID_TYPES
              ]}
              required
              copyable={false}
              clearable={true}
              disabled={applicantData.isOwner}
            />

            {/* رقم الهوية */}
            <InputWithCopy
              id="national-id"
              label="رقم الهوية *"
              value={applicantData.nationalId}
              onChange={(e) => {
                setApplicantData({ ...applicantData, nationalId: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="أدخل رقم الهوية"
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* تاريخ إصدار الهوية */}
            <InputWithCopy
              id="id-issue-date"
              label="تاريخ إصدار الهوية *"
              type="date"
              value={applicantData.idIssueDate}
              onChange={(e) => {
                setApplicantData({ ...applicantData, idIssueDate: e.target.value });
                setHasUnsavedChanges(true);
              }}
              required
              copyable={true}
              clearable={true}
            />

            {/* تاريخ انتهاء الهوية */}
            <InputWithCopy
              id="id-expiry-date"
              label="تاريخ انتهاء الهوية *"
              type="date"
              value={applicantData.idExpiryDate}
              onChange={(e) => {
                setApplicantData({ ...applicantData, idExpiryDate: e.target.value });
                setHasUnsavedChanges(true);
              }}
              required
              copyable={true}
              clearable={true}
            />

            {/* تاريخ الميلاد */}
            <InputWithCopy
              id="date-of-birth"
              label="تاريخ الميلاد *"
              type="date"
              value={applicantData.dateOfBirth}
              onChange={(e) => {
                setApplicantData({ ...applicantData, dateOfBirth: e.target.value });
                setHasUnsavedChanges(true);
              }}
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* الجنسية */}
            <SelectWithCopy
              id="nationality"
              label="الجنسية *"
              value={applicantData.nationality}
              onChange={(value) => {
                setApplicantData({ ...applicantData, nationality: value });
                setHasUnsavedChanges(true);
              }}
              options={[
                { value: '', label: 'اختر الجنسية' },
                ...NATIONALITIES
              ]}
              required
              copyable={false}
              clearable={true}
              disabled={applicantData.isOwner}
            />

            {/* الجنس */}
            <SelectWithCopy
              id="gender"
              label="الجنس *"
              value={applicantData.gender}
              onChange={(value) => {
                setApplicantData({ ...applicantData, gender: value });
                setHasUnsavedChanges(true);
              }}
              options={[
                { value: '', label: 'اختر الجنس' },
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' }
              ]}
              required
              copyable={false}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* بيانات الاتصال */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderBottom: '2px solid #10b981' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone className="h-5 w-5" style={{ color: '#10b981' }} />
            بيانات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* الجوال */}
            <InputWithCopy
              id="mobile"
              label="رقم الجوال *"
              value={applicantData.mobile}
              onChange={(e) => {
                setApplicantData({ ...applicantData, mobile: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="05xxxxxxxx"
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* الهاتف */}
            <InputWithCopy
              id="phone"
              label="رقم الهاتف"
              value={applicantData.phone}
              onChange={(e) => {
                setApplicantData({ ...applicantData, phone: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="011xxxxxxx"
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* البريد الإلكتروني */}
            <InputWithCopy
              id="email"
              label="البريد الإلكتروني *"
              type="email"
              value={applicantData.email}
              onChange={(e) => {
                setApplicantData({ ...applicantData, email: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="example@domain.com"
              required
              copyable={true}
              clearable={!applicantData.isOwner}
              disabled={applicantData.isOwner}
            />

            {/* المدينة */}
            <SelectWithCopy
              id="city"
              label="المدينة *"
              value={applicantData.city}
              onChange={(value) => {
                setApplicantData({ ...applicantData, city: value });
                setHasUnsavedChanges(true);
              }}
              options={[
                { value: '', label: 'اختر المدينة' },
                ...SAUDI_CITIES
              ]}
              required
              copyable={false}
              clearable={true}
            />

            {/* العنوان */}
            <div className="col-span-2">
              <InputWithCopy
                id="address"
                label="العنوان الكامل *"
                value={applicantData.address}
                onChange={(e) => {
                  setApplicantData({ ...applicantData, address: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                placeholder="أدخل العنوان الكامل"
                required
                copyable={true}
                clearable={!applicantData.isOwner}
                disabled={applicantData.isOwner}
              />
            </div>

            {/* الرمز البريدي */}
            <InputWithCopy
              id="postal-code"
              label="الرمز البريدي"
              value={applicantData.postalCode}
              onChange={(e) => {
                setApplicantData({ ...applicantData, postalCode: e.target.value });
                setHasUnsavedChanges(true);
              }}
              placeholder="12345"
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* بيانات الوكالة/التفويض (في حال مقدم آخر) */}
      {!applicantData.isOwner && (
        <Card className="card-rtl">
          <CardHeader style={{ background: 'linear-gradient(135deg, #fae8ff 0%, #f3e8ff 100%)', borderBottom: '2px solid #a855f7' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck className="h-5 w-5" style={{ color: '#a855f7' }} />
                بيانات الوكالة / التفويض
              </CardTitle>

              {applicantData.isVerifiedNajiz && (
                <Badge style={{ background: '#10b981', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle className="h-3 w-3" />
                  موثق عبر ناجز
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* نوع التفويض */}
              <SelectWithCopy
                id="authorization-type"
                label="نوع الوكالة/التفويض *"
                value={applicantData.authorizationType || ''}
                onChange={(value) => {
                  setApplicantData({ ...applicantData, authorizationType: value });
                  setHasUnsavedChanges(true);
                }}
                options={[
                  { value: '', label: 'اختر نوع التفويض' },
                  ...AUTHORIZATION_TYPES
                ]}
                required
                copyable={false}
                clearable={true}
              />

              {/* رقم الوكالة */}
              <InputWithCopy
                id="authorization-number"
                label="رقم الوكالة/التفويض *"
                value={applicantData.authorizationNumber || ''}
                onChange={(e) => {
                  setApplicantData({ ...applicantData, authorizationNumber: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                placeholder="أدخل رقم الوكالة"
                required
                copyable={true}
                clearable={true}
              />

              {/* تاريخ الإصدار */}
              <InputWithCopy
                id="authorization-issue-date"
                label="تاريخ الإصدار *"
                type="date"
                value={applicantData.authorizationIssueDate || ''}
                onChange={(e) => {
                  setApplicantData({ ...applicantData, authorizationIssueDate: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                required
                copyable={true}
                clearable={true}
              />

              {/* تاريخ الانتهاء */}
              <InputWithCopy
                id="authorization-expiry-date"
                label="تاريخ الانتهاء *"
                type="date"
                value={applicantData.authorizationExpiryDate || ''}
                onChange={(e) => {
                  setApplicantData({ ...applicantData, authorizationExpiryDate: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                required
                copyable={true}
                clearable={true}
              />

              {/* نطاق الصلاحيات */}
              <div className="col-span-2">
                <SelectWithCopy
                  id="authorization-scope"
                  label="نطاق صلاحيات التفويض *"
                  value={applicantData.authorizationScope || ''}
                  onChange={(value) => {
                    setApplicantData({ ...applicantData, authorizationScope: value });
                    setHasUnsavedChanges(true);
                  }}
                  options={[
                    { value: '', label: 'اختر نطاق الصلاحيات' },
                    ...AUTHORIZATION_SCOPES
                  ]}
                  required
                  copyable={false}
                  clearable={true}
                />
              </div>

              {/* حالة الصلاحية */}
              {applicantData.authorizationExpiryDate && (
                <div className="col-span-2">
                  <Alert 
                    style={{ 
                      background: isAuthorizationValid() 
                        ? '#d1fae5' 
                        : isAuthorizationValid() === false 
                        ? '#fee2e2' 
                        : '#fef3c7',
                      border: isAuthorizationValid() 
                        ? '2px solid #10b981' 
                        : isAuthorizationValid() === false 
                        ? '2px solid #ef4444' 
                        : '2px solid #f59e0b'
                    }}
                  >
                    {isAuthorizationValid() ? (
                      <>
                        <CheckCircle className="h-4 w-4" style={{ color: '#10b981' }} />
                        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46', fontSize: '12px' }}>
                          الوكالة سارية المفعول - متبقي {getDaysRemaining()} يوم
                        </AlertDescription>
                      </>
                    ) : isAuthorizationValid() === false ? (
                      <>
                        <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
                        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#991b1b', fontSize: '12px' }}>
                          الوكالة منتهية الصلاحية - انتهت منذ {Math.abs(getDaysRemaining() || 0)} يوم
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" style={{ color: '#f59e0b' }} />
                        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontSize: '12px' }}>
                          يرجى التحقق من صلاحية الوكالة
                        </AlertDescription>
                      </>
                    )}
                  </Alert>
                </div>
              )}

              {/* زر التحقق من ناجز */}
              <div className="col-span-2">
                <Button
                  onClick={() => setShowNajizDialog(true)}
                  disabled={!applicantData.authorizationNumber || applicantData.isVerifiedNajiz}
                  style={{
                    width: '100%',
                    background: applicantData.isVerifiedNajiz 
                      ? 'linear-gradient(135deg, #d1fae5 0%, #10b981 100%)'
                      : 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%)',
                    border: applicantData.isVerifiedNajiz 
                      ? '2px solid #10b981'
                      : '2px solid #3b82f6',
                    color: '#fff',
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {applicantData.isVerifiedNajiz ? (
                    <>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      تم التحقق من الوكالة عبر ناجز
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 ml-2" />
                      التحقق من صحة الوكالة عبر ناجز
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* المستندات */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', borderBottom: '2px solid #f59e0b' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="h-5 w-5" style={{ color: '#f59e0b' }} />
            المستندات المطلوبة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {/* صورة الهوية */}
            <div className="p-3 rounded-lg" style={{ background: '#f8fafc', border: '2px dashed #cbd5e1' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                  صورة الهوية *
                </h4>
                {applicantData.idDocument && (
                  <Badge style={{ background: '#10b981', color: '#fff', fontSize: '9px' }}>
                    <CheckCircle className="h-3 w-3 ml-1" />
                    مرفق
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDocumentType('id');
                  setShowDocumentDialog(true);
                }}
                style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}
              >
                <Upload className="h-3 w-3 ml-1" />
                {applicantData.idDocument ? 'تغيير المستند' : 'رفع المستند'}
              </Button>
            </div>

            {/* صورة الوكالة (في حال مقدم آخر) */}
            {!applicantData.isOwner && (
              <div className="p-3 rounded-lg" style={{ background: '#f8fafc', border: '2px dashed #cbd5e1' }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                    صورة الوكالة/التفويض *
                  </h4>
                  {applicantData.authorizationDocument && (
                    <Badge style={{ background: '#10b981', color: '#fff', fontSize: '9px' }}>
                      <CheckCircle className="h-3 w-3 ml-1" />
                      مرفق
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDocumentType('authorization');
                    setShowDocumentDialog(true);
                  }}
                  style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}
                >
                  <Upload className="h-3 w-3 ml-1" />
                  {applicantData.authorizationDocument ? 'تغيير المستند' : 'رفع المستند'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ملاحظات إضافية */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderBottom: '2px solid #6366f1' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="h-5 w-5" style={{ color: '#6366f1' }} />
            ملاحظات إضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <TextAreaWithCopy
            id="notes"
            value={applicantData.notes || ''}
            onChange={(e) => {
              setApplicantData({ ...applicantData, notes: e.target.value });
              setHasUnsavedChanges(true);
            }}
            placeholder="أضف أي ملاحظات إضافية حول مقدم الطلب..."
            rows={4}
            copyable={true}
            clearable={true}
          />
        </CardContent>
      </Card>

      {/* أزرار الحفظ */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setApplicantData({
              isOwner: true,
              arabicName: MOCK_OWNER_DATA.arabicName,
              englishName: MOCK_OWNER_DATA.englishName,
              nationalId: MOCK_OWNER_DATA.nationalId,
              idType: 'national_id',
              idIssueDate: '2015-05-15',
              idExpiryDate: '2030-05-15',
              dateOfBirth: MOCK_OWNER_DATA.dateOfBirth,
              nationality: 'saudi',
              gender: 'male',
              mobile: MOCK_OWNER_DATA.mobile,
              phone: MOCK_OWNER_DATA.phone,
              email: MOCK_OWNER_DATA.email,
              address: MOCK_OWNER_DATA.address,
              city: 'riyadh',
              postalCode: '12345',
              notes: ''
            });
            setHasUnsavedChanges(false);
          }}
        >
          <RefreshCw className="h-4 w-4 ml-1" />
          إعادة تعيين
        </Button>

        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          style={{
            background: hasUnsavedChanges 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : '#d1d5db',
            border: '2px solid',
            borderColor: hasUnsavedChanges ? '#10b981' : '#9ca3af',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
            fontWeight: 600
          }}
        >
          <CheckCircle className="h-4 w-4 ml-1" />
          حفظ البيانات
        </Button>
      </div>

      {/* نافذة التحقق من ناجز */}
      <Dialog open={showNajizDialog} onOpenChange={setShowNajizDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield className="h-5 w-5" style={{ color: '#3b82f6' }} />
              التحقق من الوكالة عبر منصة ناجز
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert style={{ background: '#eff6ff', border: '2px solid #3b82f6' }}>
              <Info className="h-4 w-4" style={{ color: '#3b82f6' }} />
              <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a', fontSize: '12px' }}>
                سيتم التحقق من صحة وصلاحية الوكالة مباشرة من منصة ناجز الإلكترونية
              </AlertDescription>
            </Alert>

            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '8px' }}>
                بيانات الوكالة:
              </h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <div className="flex justify-between">
                  <span style={{ color: '#6b7280' }}>رقم الوكالة:</span>
                  <span style={{ fontWeight: 600 }}>{applicantData.authorizationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6b7280' }}>النوع:</span>
                  <span style={{ fontWeight: 600 }}>
                    {AUTHORIZATION_TYPES.find(t => t.value === applicantData.authorizationType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6b7280' }}>تاريخ الانتهاء:</span>
                  <span style={{ fontWeight: 600 }}>{applicantData.authorizationExpiryDate}</span>
                </div>
              </div>
            </div>

            {najizVerificationInProgress && (
              <div className="text-center py-4">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin" style={{ color: '#3b82f6' }} />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280', marginTop: '8px' }}>
                  جاري التحقق من ناجز...
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNajizDialog(false)}
              disabled={najizVerificationInProgress}
            >
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button 
              onClick={handleNajizVerification}
              disabled={najizVerificationInProgress}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: '#fff',
                fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <Shield className="h-4 w-4 ml-1" />
              التحقق الآن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة رفع المستندات */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px' }}>
              رفع {selectedDocumentType === 'id' ? 'صورة الهوية' : 'صورة الوكالة/التفويض'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#cbd5e1' }}
            >
              <Upload className="h-12 w-12 mx-auto mb-3" style={{ color: '#6b7280' }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#374151', marginBottom: '4px' }}>
                اضغط لرفع الملف أو اسحبه هنا
              </p>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#9ca3af' }}>
                PDF, JPG, PNG (حتى 5 ميجابايت)
              </p>
            </div>

            <Alert style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <AlertCircle className="h-4 w-4" style={{ color: '#f59e0b' }} />
              <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontSize: '12px' }}>
                تأكد من وضوح الصورة وقراءة جميع البيانات
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>
              <X className="h-4 w-4 ml-1" />
              إلغاء
            </Button>
            <Button
              onClick={() => {
                // محاكاة رفع الملف
                setShowDocumentDialog(false);
                setHasUnsavedChanges(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <Upload className="h-4 w-4 ml-1" />
              رفع الملف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_284_05_Applicant_Data_Complete;
