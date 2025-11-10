/**
 * تاب مساحة الأرض - شامل ومتكامل
 * ===================================
 * 
 * المميزات:
 * ✅ 3 مصادر للمساحة: الطبيعة، الصك، المخطط التنظيمي
 * ✅ كشف التطابق/عدم التطابق تلقائياً
 * ✅ تنبيهات ذكية عند الاختلاف
 * ✅ إمكانية الحفظ حتى مع وجود تنبيه
 * ✅ تسجيل التنبيه في تاب الإشعارات والتنبيهات
 * ✅ حفظ في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Save, AlertTriangle, CheckCircle, MapPin, FileText, Map } from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface LandAreaData {
  naturalArea: number;          // المساحة حسب الطبيعة (الواقع)
  deedArea: number;             // المساحة حسب الصك
  planArea: number;             // المساحة حسب المخطط التنظيمي
  notes: string;                // ملاحظات إضافية
}

interface LandAreaProps {
  transactionId?: string;
  readOnly?: boolean;
}

const Tab_LandArea_Complete: React.FC<LandAreaProps> = ({
  transactionId = 'NEW',
  readOnly = false
}) => {
  const [landData, setLandData] = useState<LandAreaData>({
    naturalArea: 0,
    deedArea: 0,
    planArea: 0,
    notes: ''
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showMismatchWarning, setShowMismatchWarning] = useState(false);
  const [mismatchDetails, setMismatchDetails] = useState<string[]>([]);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`land_area_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setLandData(parsed);
      } catch (error) {
        console.error('Error loading land area data:', error);
      }
    }
  }, [transactionId]);

  // فحص التطابق عند تغيير أي قيمة
  useEffect(() => {
    checkMismatch();
  }, [landData.naturalArea, landData.deedArea, landData.planArea]);

  // فحص التطابق بين المساحات
  const checkMismatch = () => {
    const { naturalArea, deedArea, planArea } = landData;
    
    // إذا كانت أي قيمة صفر، لا نفحص
    if (naturalArea === 0 || deedArea === 0 || planArea === 0) {
      setShowMismatchWarning(false);
      setMismatchDetails([]);
      return;
    }

    const mismatches: string[] = [];
    const tolerance = 0.01; // تفاوت مسموح به (1%)

    // فحص التطابق بين الطبيعة والصك
    const naturalDeedDiff = Math.abs(naturalArea - deedArea);
    const naturalDeedPercent = (naturalDeedDiff / deedArea) * 100;
    if (naturalDeedPercent > tolerance) {
      mismatches.push(
        `اختلاف بين المساحة حسب الطبيعة (${naturalArea.toFixed(2)} م²) والصك (${deedArea.toFixed(2)} م²): فرق ${naturalDeedDiff.toFixed(2)} م² (${naturalDeedPercent.toFixed(2)}%)`
      );
    }

    // فحص التطابق بين الطبيعة والمخطط
    const naturalPlanDiff = Math.abs(naturalArea - planArea);
    const naturalPlanPercent = (naturalPlanDiff / planArea) * 100;
    if (naturalPlanPercent > tolerance) {
      mismatches.push(
        `اختلاف بين المساحة حسب الطبيعة (${naturalArea.toFixed(2)} م²) والمخطط التنظيمي (${planArea.toFixed(2)} م²): فرق ${naturalPlanDiff.toFixed(2)} م² (${naturalPlanPercent.toFixed(2)}%)`
      );
    }

    // فحص التطابق بين الصك والمخطط
    const deedPlanDiff = Math.abs(deedArea - planArea);
    const deedPlanPercent = (deedPlanDiff / planArea) * 100;
    if (deedPlanPercent > tolerance) {
      mismatches.push(
        `اختلاف بين المساحة حسب الصك (${deedArea.toFixed(2)} م²) والمخطط التنظيمي (${planArea.toFixed(2)} م²): فرق ${deedPlanDiff.toFixed(2)} م² (${deedPlanPercent.toFixed(2)}%)`
      );
    }

    setMismatchDetails(mismatches);
    setShowMismatchWarning(mismatches.length > 0);
  };

  // تحديث قيمة
  const updateField = (field: keyof LandAreaData, value: any) => {
    setLandData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // حفظ البيانات
  const handleSave = () => {
    // حفظ في localStorage
    localStorage.setItem(`land_area_${transactionId}`, JSON.stringify(landData));
    
    // إذا كان هناك عدم تطابق، نسجله في الإشعارات
    if (showMismatchWarning) {
      saveNotificationToAlerts();
    }
    
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ بيانات مساحة الأرض بنجاح!' + 
          (showMismatchWarning ? '\n⚠️ تم تسجيل التنبيه بعدم التطابق في الإشعارات.' : ''));
  };

  // حفظ التنبيه في تاب الإشعارات
  const saveNotificationToAlerts = () => {
    const notificationData = {
      id: `land_area_mismatch_${Date.now()}`,
      transactionId: transactionId,
      type: 'warning',
      title: '⚠️ عدم تطابق في مساحة الأرض',
      message: mismatchDetails.join('\n'),
      details: {
        naturalArea: landData.naturalArea,
        deedArea: landData.deedArea,
        planArea: landData.planArea,
        mismatches: mismatchDetails
      },
      createdAt: new Date().toISOString(),
      createdBy: 'النظام',
      read: false,
      priority: 'high'
    };

    // حفظ في localStorage للإشعارات
    const existingNotifications = JSON.parse(
      localStorage.getItem(`notifications_${transactionId}`) || '[]'
    );
    existingNotifications.push(notificationData);
    localStorage.setItem(`notifications_${transactionId}`, JSON.stringify(existingNotifications));
  };

  // حساب أكبر وأصغر مساحة
  const getMinMaxAreas = () => {
    const areas = [landData.naturalArea, landData.deedArea, landData.planArea];
    const validAreas = areas.filter(a => a > 0);
    
    if (validAreas.length === 0) return { min: 0, max: 0, diff: 0 };
    
    const min = Math.min(...validAreas);
    const max = Math.max(...validAreas);
    const diff = max - min;
    
    return { min, max, diff };
  };

  const { min, max, diff } = getMinMaxAreas();

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-LAND-AREA" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar {
            width: 8px !important;
            display: block !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-track {
            background: rgba(37, 99, 235, 0.1) !important;
            border-radius: 4px !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb {
            background: #2563eb !important;
            border-radius: 4px !important;
          }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* بطاقة المعلومات */}
          <Card style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                    <strong>ملاحظة:</strong> يجب إدخال المساحة من 3 مصادر مختلفة للتحقق من التطابق.
                  </p>
                  <p style={{ fontSize: '12px', color: '#1e40af' }}>
                    سيتم تنبيهك تلقائياً في حالة وجود اختلاف بين المساحات، مع إمكانية الحفظ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تحذير التغييرات غير المحفوظة */}
          {hasUnsavedChanges && (
            <Card style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '2px solid #ef4444'
            }}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600 }}>
                      لديك تغييرات غير محفوظة
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={readOnly}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <Save className="h-4 w-4 ml-1" />
                    حفظ الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* تنبيه عدم التطابق */}
          {showMismatchWarning && (
            <Alert style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #f59e0b'
            }}>
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription>
                <div style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#92400e', marginBottom: '8px' }}>
                    ⚠️ تحذير: عدم تطابق في مساحة الأرض
                  </p>
                  <ul style={{ fontSize: '12px', color: '#92400e', paddingRight: '20px' }}>
                    {mismatchDetails.map((detail, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '12px', color: '#92400e', marginTop: '8px', fontWeight: 600 }}>
                    💡 يمكنك الحفظ رغم وجود الاختلاف، وسيتم تسجيل التنبيه في الإشعارات.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* حالة التطابق */}
          {!showMismatchWarning && landData.naturalArea > 0 && landData.deedArea > 0 && landData.planArea > 0 && (
            <Card style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              border: '2px solid #10b981'
            }}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span style={{ fontSize: '13px', color: '#065f46', fontWeight: 600 }}>
                    ✅ جميع المساحات متطابقة (التفاوت أقل من 1%)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* بطاقات المساحات */}
          <div className="grid grid-cols-3 gap-4">
            {/* المساحة حسب الطبيعة */}
            <Card className="card-rtl" style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #f59e0b'
            }}>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>
                    المساحة حسب الطبيعة
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <InputWithCopy
                  label="المساحة (م²)"
                  id="natural-area"
                  type="number"
                  value={landData.naturalArea.toString()}
                  onChange={(e) => updateField('naturalArea', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  disabled={readOnly}
                  copyable={true}
                  clearable={true}
                  required
                />
                <p style={{ fontSize: '11px', color: '#92400e', marginTop: '6px' }}>
                  المساحة الفعلية حسب القياس الميداني
                </p>
              </CardContent>
            </Card>

            {/* المساحة حسب الصك */}
            <Card className="card-rtl" style={{
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              border: '2px solid #6366f1'
            }}>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>
                    المساحة حسب الصك
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <InputWithCopy
                  label="المساحة (م²)"
                  id="deed-area"
                  type="number"
                  value={landData.deedArea.toString()}
                  onChange={(e) => updateField('deedArea', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  disabled={readOnly}
                  copyable={true}
                  clearable={true}
                  required
                />
                <p style={{ fontSize: '11px', color: '#3730a3', marginTop: '6px' }}>
                  المساحة المسجلة في وثيقة الصك
                </p>
              </CardContent>
            </Card>

            {/* المساحة حسب المخطط التنظيمي */}
            <Card className="card-rtl" style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '2px solid #3b82f6'
            }}>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>
                    المساحة حسب المخطط التنظيمي
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <InputWithCopy
                  label="المساحة (م²)"
                  id="plan-area"
                  type="number"
                  value={landData.planArea.toString()}
                  onChange={(e) => updateField('planArea', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  disabled={readOnly}
                  copyable={true}
                  clearable={true}
                  required
                />
                <p style={{ fontSize: '11px', color: '#1e40af', marginTop: '6px' }}>
                  المساحة المعتمدة في المخطط التنظيمي
                </p>
              </CardContent>
            </Card>
          </div>

          {/* بطاقة الملخص */}
          {max > 0 && (
            <Card className="card-rtl" style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              border: '2px solid #a855f7'
            }}>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  ملخص المساحات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '4px' }}>
                      أصغر مساحة
                    </p>
                    <Badge style={{
                      background: '#a855f7',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      padding: '6px 12px'
                    }}>
                      {min.toFixed(2)} م²
                    </Badge>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '4px' }}>
                      أكبر مساحة
                    </p>
                    <Badge style={{
                      background: '#a855f7',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      padding: '6px 12px'
                    }}>
                      {max.toFixed(2)} م²
                    </Badge>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '4px' }}>
                      الفرق
                    </p>
                    <Badge style={{
                      background: diff > 0 ? '#ef4444' : '#10b981',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      padding: '6px 12px'
                    }}>
                      {diff.toFixed(2)} م²
                    </Badge>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '11px', color: '#6b21a8', marginBottom: '4px' }}>
                      نسبة الاختلاف
                    </p>
                    <Badge style={{
                      background: (diff / max * 100) > 1 ? '#ef4444' : '#10b981',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      padding: '6px 12px'
                    }}>
                      {((diff / max) * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملاحظات */}
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                ملاحظات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InputWithCopy
                label="الملاحظات"
                id="notes"
                value={landData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="أي ملاحظات حول مساحة الأرض..."
                disabled={readOnly}
                copyable={true}
                clearable={true}
              />
            </CardContent>
          </Card>

          {/* زر الحفظ */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleSave}
              disabled={readOnly || !hasUnsavedChanges}
              style={{ 
                background: hasUnsavedChanges 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ مساحة الأرض {showMismatchWarning && '(مع التنبيه)'}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_LandArea_Complete;
