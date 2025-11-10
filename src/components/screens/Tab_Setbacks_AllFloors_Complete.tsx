/**
 * تاب الارتدادات من الأربع جهات ولجميع الأدوار
 * ===========================================
 * 
 * المميزات:
 * ✅ يقرأ مسميات الأدوار من تاب مسميات الأدوار
 * ✅ جدول شامل لكل دور مع الأربع جهات
 * ✅ حقول: القائم، المقترح، النظامي
 * ✅ حساب الفرق تلقائياً
 * ✅ ألوان ديناميكية للفروقات
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Save, AlertCircle, Navigation } from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface Setback {
  direction: string;      // north, south, east, west
  directionAr: string;    // الشمال، الجنوب، الشرق، الغرب
  current: number;        // القائم
  proposed: number;       // المقترح
  regulatory: number;     // النظامي
  difference: number;     // الفرق (المقترح - القائم)
}

interface FloorSetbacks {
  floorId: string;
  floorName: string;
  sequence: number;
  setbacks: Setback[];
}

interface SetbacksAllFloorsProps {
  transactionId?: string;
  readOnly?: boolean;
}

const Tab_Setbacks_AllFloors_Complete: React.FC<SetbacksAllFloorsProps> = ({
  transactionId = 'NEW',
  readOnly = false
}) => {
  const [floorsSetbacks, setFloorsSetbacks] = useState<FloorSetbacks[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [floorsLoaded, setFloorsLoaded] = useState(false);

  // تحميل مسميات الأدوار من localStorage
  useEffect(() => {
    const savedFloors = localStorage.getItem(`floors_naming_${transactionId}`);
    
    if (savedFloors) {
      try {
        const floors = JSON.parse(savedFloors);
        
        // إنشاء بيانات الارتدادات لكل دور
        const setbacksData: FloorSetbacks[] = floors.map((floor: any) => ({
          floorId: floor.id,
          floorName: floor.nameBySystem || `الدور ${floor.sequence}`,
          sequence: floor.sequence,
          setbacks: [
            { direction: 'north', directionAr: 'الشمال', current: 0, proposed: 0, regulatory: 0, difference: 0 },
            { direction: 'south', directionAr: 'الجنوب', current: 0, proposed: 0, regulatory: 0, difference: 0 },
            { direction: 'east', directionAr: 'الشرق', current: 0, proposed: 0, regulatory: 0, difference: 0 },
            { direction: 'west', directionAr: 'الغرب', current: 0, proposed: 0, regulatory: 0, difference: 0 }
          ]
        }));

        // محاولة تحميل البيانات المحفوظة مسبقاً
        const savedSetbacks = localStorage.getItem(`setbacks_all_floors_${transactionId}`);
        if (savedSetbacks) {
          try {
            const parsed = JSON.parse(savedSetbacks);
            // دمج البيانات المحفوظة مع الأدوار الجديدة
            const merged = setbacksData.map(floor => {
              const saved = parsed.find((f: FloorSetbacks) => f.floorId === floor.floorId);
              return saved || floor;
            });
            setFloorsSetbacks(merged);
          } catch (e) {
            setFloorsSetbacks(setbacksData);
          }
        } else {
          setFloorsSetbacks(setbacksData);
        }
        
        setFloorsLoaded(true);
      } catch (error) {
        console.error('Error loading floors:', error);
      }
    } else {
      // بيانات افتراضية إذا لم توجد أدوار محفوظة
      setFloorsSetbacks([
        {
          floorId: '1',
          floorName: 'الأرضي',
          sequence: 1,
          setbacks: [
            { direction: 'north', directionAr: 'الشمال', current: 3, proposed: 4, regulatory: 3, difference: 1 },
            { direction: 'south', directionAr: 'الجنوب', current: 3, proposed: 3, regulatory: 3, difference: 0 },
            { direction: 'east', directionAr: 'الشرق', current: 4, proposed: 5, regulatory: 4, difference: 1 },
            { direction: 'west', directionAr: 'الغرب', current: 4, proposed: 4, regulatory: 4, difference: 0 }
          ]
        }
      ]);
      setFloorsLoaded(true);
    }
  }, [transactionId]);

  // تحديث قيمة الارتداد
  const updateSetback = (floorId: string, direction: string, field: 'current' | 'proposed' | 'regulatory', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setFloorsSetbacks(prev => prev.map(floor => {
      if (floor.floorId === floorId) {
        const updatedSetbacks = floor.setbacks.map(s => {
          if (s.direction === direction) {
            const updated = { ...s, [field]: numValue };
            // حساب الفرق
            updated.difference = updated.proposed - updated.current;
            return updated;
          }
          return s;
        });
        return { ...floor, setbacks: updatedSetbacks };
      }
      return floor;
    }));
    
    setHasUnsavedChanges(true);
  };

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`setbacks_all_floors_${transactionId}`, JSON.stringify(floorsSetbacks));
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ الارتدادات بنجاح!');
  };

  // تحديد لون الفرق
  const getDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return {
        background: '#d1fae5',
        color: '#065f46',
        border: '1px solid #10b981'
      };
    } else if (difference < 0) {
      return {
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #ef4444'
      };
    } else {
      return {
        background: '#f3f4f6',
        color: '#6b7280',
        border: '1px solid #e5e7eb'
      };
    }
  };

  const formatDifference = (diff: number): string => {
    if (diff > 0) return `+${diff.toFixed(2)} م`;
    if (diff < 0) return `${diff.toFixed(2)} م`;
    return '0.00 م';
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-SETBACKS-ALL-FLOORS" position="top-right" />
      
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
          {/* ملاحظة توضيحية */}
          <Card style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                    <strong>ملاحظة:</strong> يتم قراءة مسميات الأدوار تلقائياً من تاب "مسميات وعدد الأدوار".
                  </p>
                  <p style={{ fontSize: '12px', color: '#1e40af' }}>
                    الفرق = المقترح - القائم • الألوان: <span style={{ color: '#10b981' }}>أخضر للزيادة</span> • <span style={{ color: '#ef4444' }}>أحمر للنقص</span> • <span style={{ color: '#6b7280' }}>رمادي بدون تغيير</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تحذير التغييرات */}
          {hasUnsavedChanges && (
            <Card style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '2px solid #ef4444'
            }}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
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

          {/* جداول الارتدادات لكل دور */}
          {floorsLoaded && floorsSetbacks.length > 0 ? (
            floorsSetbacks.map((floor) => (
              <Card key={floor.floorId} className="card-rtl">
                <CardHeader style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderBottom: '2px solid #f59e0b'
                }}>
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-amber-600" />
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                      {floor.floorName}
                    </CardTitle>
                    <Badge style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      fontFamily: 'monospace'
                    }}>
                      الدور {floor.sequence}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ background: '#f8fafc' }}>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                          الجهة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          القائم (م)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المقترح (م)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          النظامي (م)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                          الفرق
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floor.setbacks.map((setback) => (
                        <TableRow key={setback.direction}>
                          {/* الجهة */}
                          <TableCell className="text-right">
                            <Badge variant="outline" style={{
                              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                              border: '1px solid #6366f1',
                              color: '#3730a3',
                              fontWeight: 600
                            }}>
                              {setback.directionAr}
                            </Badge>
                          </TableCell>

                          {/* القائم */}
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`current-${floor.floorId}-${setback.direction}`}
                              type="number"
                              value={setback.current.toString()}
                              onChange={(e) => updateSetback(floor.floorId, setback.direction, 'current', e.target.value)}
                              placeholder="0.00"
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>

                          {/* المقترح */}
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`proposed-${floor.floorId}-${setback.direction}`}
                              type="number"
                              value={setback.proposed.toString()}
                              onChange={(e) => updateSetback(floor.floorId, setback.direction, 'proposed', e.target.value)}
                              placeholder="0.00"
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>

                          {/* النظامي */}
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`regulatory-${floor.floorId}-${setback.direction}`}
                              type="number"
                              value={setback.regulatory.toString()}
                              onChange={(e) => updateSetback(floor.floorId, setback.direction, 'regulatory', e.target.value)}
                              placeholder="0.00"
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>

                          {/* الفرق */}
                          <TableCell className="text-right">
                            <div style={{
                              ...getDifferenceStyle(setback.difference),
                              padding: '6px 12px',
                              borderRadius: '6px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              fontSize: '13px'
                            }}>
                              {formatDifference(setback.difference)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-3" />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>
                  لم يتم العثور على أدوار محفوظة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309', fontSize: '12px' }}>
                  يرجى الانتقال إلى تاب "مسميات وعدد الأدوار" وإضافة الأدوار أولاً
                </p>
              </CardContent>
            </Card>
          )}

          {/* زر الحفظ */}
          {floorsSetbacks.length > 0 && (
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
                حفظ الارتدادات
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_Setbacks_AllFloors_Complete;
