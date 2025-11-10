/**
 * التاب 284-06 - بيانات الشارع v1.0 COMPLETE
 * ========================================================
 * 
 * تاب شامل لإدارة بيانات الشارع في المعاملة
 * 
 * المميزات:
 * ✅ اختيار الشارع من قائمة شوارع الرياض (شاشة 939)
 * ✅ عرض تفاصيل الشارع (العرض، النوع، القطاع، الحي)
 * ✅ إظهار التنظيمات الخاصة إن وجدت
 * ✅ عرض السبب ونوع التنظيم
 * ✅ عرض الآثار المترتبة
 * ✅ حفظ البيانات في localStorage
 * 
 * @version 1.0 COMPLETE
 * @date 29 أكتوبر 2025
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { AlertCircle, MapPin, Navigation, Save } from 'lucide-react';

interface Tab_284_06_Props {
  transactionId?: string;
}

interface StreetData {
  streetId: string;
  streetName: string;
  streetWidth: number;
  streetType: string;
  sectorName: string;
  districtName: string;
  hasSpecialRegulation: boolean;
  regulationDetails?: {
    regulationType: string;
    reason: string;
    issuingAuthority: string;
    validFrom: string;
    validUntil?: string;
    restrictions: string[];
    impacts: string[];
    notes: string;
  };
}

// قائمة الشوارع (مستوردة من شاشة 939)
const STREETS_LIST = [
  {
    id: 'STR-2025-001',
    name: 'شارع الملك فهد',
    width: 60,
    type: 'رئيسي',
    sector: 'القطاع الشمالي',
    district: 'حي النرجس',
    hasSpecialRegulation: true,
    regulationType: 'حد أقصى للارتفاعات',
    reason: 'قرب المطار',
    issuingAuthority: 'الهيئة العامة للطيران المدني',
    validFrom: '2022-01-01',
    restrictions: ['الحد الأقصى للارتفاع: 12 متر', 'عدم البناء على الجانب الشمالي'],
    impacts: ['تقليل المساحة البنائية', 'زيادة تكلفة البناء'],
    notes: 'تنظيم خاص صادر بموجب قرار رقم 2000'
  },
  {
    id: 'STR-2025-002',
    name: 'شارع العليا',
    width: 40,
    type: 'ثانوي',
    sector: 'القطاع الأوسط',
    district: 'حي العليا',
    hasSpecialRegulation: false
  },
  {
    id: 'STR-2025-003',
    name: 'طريق الملك عبدالله',
    width: 60,
    type: 'رئيسي',
    sector: 'القطاع الشرقي',
    district: 'حي الملقا',
    hasSpecialRegulation: true,
    regulationType: 'اشتراطات واجهات',
    reason: 'منطقة سكنية راقية',
    issuingAuthority: 'أمانة منطقة الرياض',
    validFrom: '2023-06-01',
    validUntil: '2030-12-31',
    restrictions: ['استخدام مواد بناء محددة', 'الارتداد الأمامي: 10 أمتار'],
    impacts: ['زيادة تكلفة البناء', 'اشتراطات إضافية للتصاميم'],
    notes: 'تنظيم خاص صادر بموجب قرار رقم 2002'
  },
  {
    id: 'STR-2025-004',
    name: 'شارع التخصصي',
    width: 30,
    type: 'ثانوي',
    sector: 'القطاع الأوسط',
    district: 'حي النخيل',
    hasSpecialRegulation: false
  },
  {
    id: 'STR-2025-005',
    name: 'شارع الأمير سلطان',
    width: 40,
    type: 'رئيسي',
    sector: 'القطاع الغربي',
    district: 'حي الروضة',
    hasSpecialRegulation: false
  },
  {
    id: 'STR-2025-006',
    name: 'طريق الدائري الشمالي',
    width: 60,
    type: 'رئيسي',
    sector: 'القطاع الشمالي',
    district: 'حي الياسمين',
    hasSpecialRegulation: true,
    regulationType: 'حظر استخدامات معينة',
    reason: 'طريق رئيسي استراتيجي',
    issuingAuthority: 'الهيئة الملكية',
    validFrom: '2024-01-01',
    restrictions: ['الحد الأقصى للارتفاع: 12 متر', 'نسبة البناء: 60%'],
    impacts: ['التأخير في الموافقات', 'اشتراطات إضافية للتصاميم'],
    notes: 'تنظيم خاص صادر بموجب قرار رقم 2006'
  },
];

const Tab_284_06_Street_Data_Complete: React.FC<Tab_284_06_Props> = ({ transactionId = '2510001' }) => {
  const [streetData, setStreetData] = useState<StreetData>({
    streetId: '',
    streetName: '',
    streetWidth: 0,
    streetType: '',
    sectorName: '',
    districtName: '',
    hasSpecialRegulation: false,
  });

  const [selectedStreetId, setSelectedStreetId] = useState('');

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`street_data_${transactionId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStreetData(parsed);
      setSelectedStreetId(parsed.streetId);
    }
  }, [transactionId]);

  // عند اختيار شارع
  const handleStreetChange = (streetId: string) => {
    setSelectedStreetId(streetId);
    
    const street = STREETS_LIST.find(s => s.id === streetId);
    if (street) {
      const newData: StreetData = {
        streetId: street.id,
        streetName: street.name,
        streetWidth: street.width,
        streetType: street.type,
        sectorName: street.sector,
        districtName: street.district,
        hasSpecialRegulation: street.hasSpecialRegulation,
        regulationDetails: street.hasSpecialRegulation ? {
          regulationType: street.regulationType || '',
          reason: street.reason || '',
          issuingAuthority: street.issuingAuthority || '',
          validFrom: street.validFrom || '',
          validUntil: street.validUntil,
          restrictions: street.restrictions || [],
          impacts: street.impacts || [],
          notes: street.notes || '',
        } : undefined,
      };
      
      setStreetData(newData);
    }
  };

  // حفظ البيانات
  const handleSave = () => {
    if (!streetData.streetId) {
      alert('يرجى اختيار الشارع أولاً');
      return;
    }

    localStorage.setItem(`street_data_${transactionId}`, JSON.stringify(streetData));
    alert('تم حفظ بيانات الشارع بنجاح');
  };

  return (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {streetData.streetWidth || '-'}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض الشارع (م)</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <Navigation className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {streetData.streetType || '-'}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الشارع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {streetData.sectorName || '-'}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {streetData.districtName || '-'}
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</p>
          </CardContent>
        </Card>
      </div>

      {/* بيانات الشارع */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>بيانات الشارع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* اختيار الشارع */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>اختيار الشارع</h3>
              <SelectWithCopy
                label="اسم الشارع *"
                id="street"
                value={selectedStreetId}
                onChange={handleStreetChange}
                options={STREETS_LIST.map(s => ({
                  value: s.id,
                  label: `${s.name} - ${s.district} (${s.type}, ${s.width}م)`
                }))}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* عرض الشارع */}
            {streetData.streetId && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>مواصفات الشارع</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputWithCopy
                    label="عرض الشارع (متر)"
                    id="width"
                    value={String(streetData.streetWidth)}
                    onChange={() => {}}
                    copyable={true}
                    clearable={false}
                    disabled
                  />
                  <InputWithCopy
                    label="نوع الشارع"
                    id="type"
                    value={streetData.streetType}
                    onChange={() => {}}
                    copyable={true}
                    clearable={false}
                    disabled
                  />
                  <InputWithCopy
                    label="القطاع"
                    id="sector"
                    value={streetData.sectorName}
                    onChange={() => {}}
                    copyable={true}
                    clearable={false}
                    disabled
                  />
                  <InputWithCopy
                    label="الحي"
                    id="district"
                    value={streetData.districtName}
                    onChange={() => {}}
                    copyable={true}
                    clearable={false}
                    disabled
                  />
                </div>
              </div>
            )}

            {/* التنظيم الخاص */}
            {streetData.streetId && (
              <div className={streetData.hasSpecialRegulation ? 'bg-red-50 p-4 rounded-lg border-2 border-red-300' : 'bg-gray-50 p-4 rounded-lg'}>
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {streetData.hasSpecialRegulation && <AlertCircle className="h-5 w-5 text-red-600" />}
                  التنظيم الخاص
                </h3>
                
                <div className="mb-3">
                  <Badge
                    style={{
                      background: streetData.hasSpecialRegulation ? '#fee2e2' : '#dcfce7',
                      color: streetData.hasSpecialRegulation ? '#991b1b' : '#166534',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                  >
                    {streetData.hasSpecialRegulation ? 'يوجد تنظيم خاص' : 'لا يوجد تنظيم خاص'}
                  </Badge>
                </div>

                {streetData.hasSpecialRegulation && streetData.regulationDetails && (
                  <div className="space-y-3 mt-4 border-t-2 border-red-300 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputWithCopy
                        label="نوع التنظيم"
                        id="regulationType"
                        value={streetData.regulationDetails.regulationType}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                        disabled
                      />
                      <InputWithCopy
                        label="الجهة المصدرة"
                        id="issuingAuthority"
                        value={streetData.regulationDetails.issuingAuthority}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                        disabled
                      />
                    </div>

                    <InputWithCopy
                      label="السبب"
                      id="reason"
                      value={streetData.regulationDetails.reason}
                      onChange={() => {}}
                      copyable={true}
                      clearable={false}
                      disabled
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InputWithCopy
                        label="سريان من"
                        id="validFrom"
                        value={streetData.regulationDetails.validFrom}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                        disabled
                      />
                      <InputWithCopy
                        label="سريان حتى"
                        id="validUntil"
                        value={streetData.regulationDetails.validUntil || 'غير محدد'}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                        disabled
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الاشتراطات والقيود:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded">
                        {streetData.regulationDetails.restrictions.map((r, i) => (
                          <li key={i} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الآثار المترتبة:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded">
                        {streetData.regulationDetails.impacts.map((i, idx) => (
                          <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {i}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {streetData.regulationDetails.notes && (
                      <InputWithCopy
                        label="ملاحظات"
                        id="notes"
                        value={streetData.regulationDetails.notes}
                        onChange={() => {}}
                        copyable={true}
                        clearable={false}
                        disabled
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* زر الحفظ */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={!streetData.streetId}>
                <Save className="h-4 w-4 ml-2" />
                حفظ بيانات الشارع
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tab_284_06_Street_Data_Complete;
