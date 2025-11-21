/**
 * تاب الارتدادات - متصل بالـ Backend
 * ===========================================
 * * المميزات:
 * ✅ متصل بقاعدة البيانات
 * ✅ يقرأ الأدوار ديناميكياً من حقل `floors` في المعاملة
 * ✅ يحفظ بيانات الارتدادات في حقل `setbacks`
 * ✅ يحافظ على البيانات المدخلة حتى لو تغير اسم الدور
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Save, AlertCircle, Navigation, Loader2 } from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';
import { getTransactionById, updateTransactionSetbacks } from '../../api/transactionApi';
import { toast } from 'sonner';

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
  transactionId = '',
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  const [floorsSetbacks, setFloorsSetbacks] = useState<FloorSetbacks[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // 1. جلب البيانات من الـ Backend
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // 2. منطق الدمج (Merging Logic)
  useEffect(() => {
    if (transaction) {
      const dbFloors = transaction.floors || [];
      const dbSetbacks = transaction.setbacks || [];

      // إذا لم تكن هناك أدوار معرفة بعد
      if (dbFloors.length === 0) {
        setFloorsSetbacks([]);
        setIsDataReady(true);
        return;
      }

      // دمج الأدوار الحالية مع الارتدادات المحفوظة
      const mergedData: FloorSetbacks[] = dbFloors.map((floor: any) => {
        // البحث عن بيانات ارتدادات محفوظة لهذا الدور
        const savedSetbackData = dbSetbacks.find((s: any) => s.floorId === floor.id);

        if (savedSetbackData) {
          // إذا وجدت بيانات، نستخدمها ولكن نحدث الاسم والترتيب من تعريف الدور الحالي
          return {
            ...savedSetbackData,
            floorName: floor.nameBySystem || floor.standardName || `الدور ${floor.sequence}`,
            sequence: floor.sequence
          };
        } else {
          // إذا لم توجد بيانات (دور جديد)، ننشئ بيانات افتراضية
          return {
            floorId: floor.id,
            floorName: floor.nameBySystem || floor.standardName || `الدور ${floor.sequence}`,
            sequence: floor.sequence,
            setbacks: [
              { direction: 'north', directionAr: 'الشمال', current: 0, proposed: 0, regulatory: 0, difference: 0 },
              { direction: 'south', directionAr: 'الجنوب', current: 0, proposed: 0, regulatory: 0, difference: 0 },
              { direction: 'east', directionAr: 'الشرق', current: 0, proposed: 0, regulatory: 0, difference: 0 },
              { direction: 'west', directionAr: 'الغرب', current: 0, proposed: 0, regulatory: 0, difference: 0 }
            ]
          };
        }
      });

      setFloorsSetbacks(mergedData);
      setIsDataReady(true);
    }
  }, [transaction]);

  // 3. Mutation للحفظ
  const saveMutation = useMutation({
    mutationFn: (data: FloorSetbacks[]) => updateTransactionSetbacks(transactionId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      if (data.setbacks) {
          // إعادة تعيين الحالة من البيانات الراجعة لضمان المزامنة، لكن نحافظ على الدمج مع الأدوار
          // (بما أننا في النجاح، فالبيانات الراجعة هي الأحدث)
          // لكن الأفضل الاعتماد على useEffect أعلاه الذي سيعمل بعد invalidateQueries
      }
      setHasUnsavedChanges(false);
      toast.success('تم حفظ الارتدادات بنجاح');
    },
    onError: (error: any) => {
      toast.error('فشل في حفظ البيانات: ' + (error.response?.data?.message || error.message));
    }
  });

  // تحديث قيمة الارتداد
  const updateSetback = (floorId: string, direction: string, field: 'current' | 'proposed' | 'regulatory', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setFloorsSetbacks(prev => prev.map(floor => {
      if (floor.floorId === floorId) {
        const updatedSetbacks = floor.setbacks.map(s => {
          if (s.direction === direction) {
            const updated = { ...s, [field]: numValue };
            // حساب الفرق تلقائياً
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
    if (transactionId === 'new') {
        toast.warning('يجب حفظ المعاملة أولاً قبل حفظ الارتدادات');
        return;
    }
    saveMutation.mutate(floorsSetbacks);
  };

  // تحديد لون الفرق
  const getDifferenceStyle = (difference: number) => {
    if (difference > 0) {
      return { background: '#d1fae5', color: '#065f46', border: '1px solid #10b981' };
    } else if (difference < 0) {
      return { background: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' };
    } else {
      return { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' };
    }
  };

  const formatDifference = (diff: number): string => {
    if (diff > 0) return `+${diff.toFixed(2)} م`;
    if (diff < 0) return `${diff.toFixed(2)} م`;
    return '0.00 م';
  };

  if (isLoading) {
      return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-SETBACKS-BACKEND" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar { width: 8px !important; display: block !important; }
          .scroll-area-viewport::-webkit-scrollbar-track { background: rgba(37, 99, 235, 0.1) !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb { background: #2563eb !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover { background: #1e40af !important; }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* ملاحظة توضيحية */}
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
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

          {/* جداول الارتدادات لكل دور */}
          {isDataReady && floorsSetbacks.length > 0 ? (
            floorsSetbacks.map((floor) => (
              <Card key={floor.floorId} className="card-rtl">
                <CardHeader style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderBottom: '2px solid #f59e0b' }}>
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-amber-600" />
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                      {floor.floorName}
                    </CardTitle>
                    <Badge style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', fontFamily: 'monospace' }}>
                      الدور {floor.sequence}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ background: '#f8fafc' }}>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الجهة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القائم (م)</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقترح (م)</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النظامي (م)</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>الفرق</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floor.setbacks.map((setback) => (
                        <TableRow key={setback.direction}>
                          {/* الجهة */}
                          <TableCell className="text-right">
                            <Badge variant="outline" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '1px solid #6366f1', color: '#3730a3', fontWeight: 600 }}>
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
                              padding: '6px 12px', borderRadius: '6px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace', fontSize: '13px'
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
                  يرجى الانتقال إلى تاب "مسميات وعدد الأدوار" وإضافة الأدوار أولاً لتتمكن من إدخال الارتدادات
                </p>
              </CardContent>
            </Card>
          )}

          {/* زر الحفظ */}
          {floorsSetbacks.length > 0 && (
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleSave}
                disabled={readOnly || saveMutation.isPending}
                style={{ 
                  background: hasUnsavedChanges 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                }}
              >
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
                {hasUnsavedChanges ? 'حفظ التغييرات' : 'حفظ البيانات'}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_Setbacks_AllFloors_Complete;