/**
 * التاب: الغرض التفصيلي من الطلب (الإصدار الديناميكي v2.0)
 * ====================================
 * * يُستخدم في:
 * - الشاشة 286: إنشاء معاملة جديدة
 * - الشاشة 284: معالجة المعاملات
 * * الوظيفة:
 * - جلب الأغراض التفصيلية النشطة من API (المعرفة في شاشة 701).
 * - عرض "عارض النماذج" (DynamicFormRenderer) لكل غرض.
 * - السماح للمستخدم بتفعيل/إلغاء تفعيل كل غرض.
 * - حفظ البيانات المُدخلة + حالة التفعيل في localStorage.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Save, AlertCircle } from 'lucide-react';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { useQuery } from '@tanstack/react-query';
import { getRequestPurposes, RequestPurpose } from '../../api/settingsApi'; // (استيراد)
import DynamicFormRenderer from './DynamicFormRenderer'; // (استيراد)
import { Skeleton } from '../ui/skeleton'; // (استيراد)

// (تم حذف جميع الواجهات القديمة: FloorData, FloorUsageChange, etc.)

interface TabProps {
  transactionId?: string;
  onSave?: (purposes: any) => void; // (تغيير: سنرسل كائن البيانات بالكامل)
  readOnly?: boolean;
}

// (تم حذف البيانات الافتراضية القديمة: AVAILABLE_FLOORS, USAGE_TYPES, etc.)

const Tab_RequestPurpose_Detailed_Complete: React.FC<TabProps> = ({
  transactionId = 'NEW',
  onSave,
  readOnly = false
}) => {
  // --- 1. State جديدة للتحكم في التفعيل (Toggles) ---
  const [activeToggles, setActiveToggles] = useState<{ [purposeId: string]: boolean }>({});
  
  // --- 2. State جديدة لتخزين بيانات النماذج ---
  // البنية: { [purposeId]: { [fieldKey]: value, ... }, ... }
  const [dataStore, setDataStore] = useState<{ [purposeId: string]: { [fieldKey: string]: any } }>({});

  const [hasChanges, setHasChanges] = useState(false);

  // --- 3. جلب الأغراض التفصيلية "المُعرفة" من الإعدادات ---
  const { data: definedPurposes, isLoading } = useQuery<RequestPurpose[]>({
    queryKey: ['requestPurposes', 'detailed'],
    queryFn: () => getRequestPurposes('detailed'),
    // جلب الأغراض النشطة (في الإعدادات) فقط
    select: (data) => data.filter(p => p.isActive),
  });

  // 4. تحميل البيانات المحفوظة من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`request_purpose_detailed_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.activeToggles) {
          setActiveToggles(parsed.activeToggles);
        }
        if (parsed.dataStore) {
          setDataStore(parsed.dataStore);
        }
      } catch (error) {
        console.error('Error loading saved detailed purposes:', error);
      }
    }
  }, [transactionId]);

  // (تم حذف جميع دوال useEffect و calculate القديمة)

  // 5. دالة الحفظ الجديدة
  const handleSave = () => {
    const dataToSave = {
      activeToggles,
      dataStore
    };

    localStorage.setItem(`request_purpose_detailed_${transactionId}`, JSON.stringify(dataToSave));
    setHasChanges(false);
    
    if (onSave) {
      // إرسال البيانات التي تم تفعيلها فقط
      const activeData: any = {};
      Object.keys(activeToggles).forEach(purposeId => {
        if (activeToggles[purposeId]) {
          activeData[purposeId] = dataStore[purposeId] || {};
        }
      });
      onSave(activeData);
    }
    
    // (استبدل alert بنافذة Sonner أو toast notification إذا أمكن)
    alert('تم حفظ الأغراض التفصيلية بنجاح!');
  };

  // 6. دالة لتحديث بيانات نموذج فرعي (تُمرر إلى العارض)
  const handleDataChange = (purposeId: string, fieldKey: string, value: any) => {
    setDataStore(prev => ({
      ...prev,
      [purposeId]: {
        ...(prev[purposeId] || {}),
        [fieldKey]: value,
      },
    }));
    setHasChanges(true);
  };
  
  // 7. دالة لتفعيل/إلغاء تفعيل الغرض
  const handleToggleChange = (purposeId: string, checked: boolean) => {
     setActiveToggles(prev => ({
       ...prev,
       [purposeId]: checked,
     }));
     setHasChanges(true);
  };

  // حساب عدد الأغراض النشطة
  const activeCount = Object.values(activeToggles).filter(Boolean).length;

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-PURPOSE-DETAILED-DYN" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <div className="p-4 space-y-4">
          {/* شريط الإحصائيات والإجراءات */}
          <Card className="card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '8px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '10px'
                    }}
                  >
                    <AlertCircle className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                      الأغراض التفصيلية من الطلب
                    </h3>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      تم تفعيل {activeCount} من {definedPurposes?.length || 0} أغراض متاحة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <Badge style={{ background: '#f59e0b', color: '#fff' }}>
                      تغييرات غير محفوظة
                    </Badge>
                  )}
                  {!readOnly && (
                    <Button onClick={handleSave} size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                      <Save className="h-4 w-4 ml-1" />
                      حفظ
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- 8. العرض الديناميكي للأغراض --- */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          )}

          {definedPurposes?.map((purpose) => {
            const isToggled = activeToggles[purpose.id] ?? false;

            return (
              <Card key={purpose.id} className="card-rtl" style={{ borderColor: isToggled ? '#2563eb' : '#e5e7eb' }}>
                <CardHeader className="p-3" style={{ background: isToggled ? 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' : '#f8fafc' }}>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                      {purpose.icon} {purpose.name} {/* (الاسم والأيقونة من الـ API) */}
                    </CardTitle>
                    <EnhancedSwitch
                      id={`purpose-toggle-${purpose.id}`}
                      checked={isToggled}
                      onCheckedChange={(checked) => handleToggleChange(purpose.id, checked)}
                      size="sm"
                      disabled={readOnly}
                    />
                  </div>
                </CardHeader>
                
                {isToggled && (
                  <CardContent className="p-3">
                    {/* --- 9. استخدام عارض النماذج الديناميكي --- */}
                    <DynamicFormRenderer
                      purposeId={purpose.id}
                      data={dataStore[purpose.id] || {}}
                      onChange={(fieldKey, value) => handleDataChange(purpose.id, fieldKey, value)}
                      readOnly={readOnly}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* معلومات إضافية */}
          <Card className="card-rtl" style={{ background: '#eff6ff', borderColor: '#2563eb' }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" style={{ color: '#2563eb' }} />
                <div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#1e40af', fontWeight: 600, marginBottom: '4px' }}>
                    نظام النماذج الديناميكي
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a', lineHeight: '1.6' }}>
                    يتم عرض هذه النماذج بناءً على الإعدادات في لوحة التحكم (شاشة 701). يمكن للمدير إضافة أو تعديل أو حذف أي من هذه النماذج بالكامل.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_RequestPurpose_Detailed_Complete;