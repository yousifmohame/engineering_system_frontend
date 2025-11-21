/**
 * مكون موحد للمكونات (الرخصة القديمة / المقترح / القائم) - متصل بالـ Backend
 * =====================================================
 * * المميزات:
 * ✅ متصل بـ 3 حقول مختلفة في قاعدة البيانات حسب النوع
 * ✅ يقرأ الأدوار ديناميكياً من حقل floors
 * ✅ يحفظ البيانات تلقائياً في الحقل المناسب
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Save, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';
import { getTransactionById, updateTransactionGenericComponents } from '../../api/transactionApi';
import { toast } from 'sonner';

interface FloorComponent {
  id: string;
  floorId: string; // لإعادة الربط
  floorName: string;
  sequence: number;
  area: number;
  buildingRatio: number;
  usage: string;
  unitsCount: number;
  level: number;
}

interface ComponentsGenericProps {
  transactionId?: string;
  readOnly?: boolean;
  type: 'old-license' | 'proposed' | 'existing';
}

const usageTypes = [
  'سكني', 'تجاري', 'إداري', 'صناعي', 'خدمي', 'مختلط', 
  'مواقف سيارات', 'مخازن', 'غرف خدمات', 'مساحات مشتركة'
];

const Tab_Components_Generic_Complete: React.FC<ComponentsGenericProps> = ({
  transactionId = '',
  readOnly = false,
  type
}) => {
  const queryClient = useQueryClient();
  const [components, setComponents] = useState<FloorComponent[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // إعدادات التاب حسب النوع
  const config = {
    'old-license': {
      title: 'المكونات حسب الرخصة القديمة',
      code: 'TAB-COMPONENTS-OLD-LICENSE-DB',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      dbField: 'componentsOldLicense' // اسم الحقل في الـ Backend
    },
    'proposed': {
      title: 'المكونات حسب المقترح',
      code: 'TAB-COMPONENTS-PROPOSED-DB',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      dbField: 'componentsProposed'
    },
    'existing': {
      title: 'المكونات حسب القائم',
      code: 'TAB-COMPONENTS-EXISTING-DB',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      dbField: 'componentsExisting'
    }
  }[type];

  // 1. جلب البيانات
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // 2. معالجة ودمج البيانات
  useEffect(() => {
    if (transaction) {
      const dbFloors = transaction.floors || [];
      // قراءة الحقل المناسب ديناميكياً بناءً على النوع
      const dbComponents = transaction[config.dbField] || [];

      if (dbFloors.length === 0) {
        setComponents([]);
        setIsDataReady(true);
        return;
      }

      const mergedData: FloorComponent[] = dbFloors.map((floor: any) => {
        // البحث عن بيانات محفوظة لهذا الدور في الحقل المحدد
        const savedComponent = dbComponents.find((c: any) => c.floorId === floor.id);

        if (savedComponent) {
          return {
            ...savedComponent,
            floorName: floor.nameBySystem || floor.standardName || `الدور ${floor.sequence}`,
            sequence: floor.sequence
          };
        } else {
          // قيم افتراضية
          return {
            id: floor.id,
            floorId: floor.id,
            floorName: floor.nameBySystem || floor.standardName || `الدور ${floor.sequence}`,
            sequence: floor.sequence,
            area: 0,
            buildingRatio: 0,
            usage: 'سكني',
            unitsCount: 0,
            level: 0
          };
        }
      });

      setComponents(mergedData);
      setIsDataReady(true);
    }
  }, [transaction, config.dbField]);

  // 3. Mutation للحفظ
  const saveMutation = useMutation({
    mutationFn: (data: FloorComponent[]) => updateTransactionGenericComponents(transactionId, type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      setHasUnsavedChanges(false);
      toast.success(`تم حفظ ${config.title} بنجاح`);
    },
    onError: (error: any) => {
      toast.error('فشل الحفظ: ' + (error.response?.data?.message || error.message));
    }
  });

  // تحديث مكون
  const updateComponent = (id: string, field: keyof FloorComponent, value: any) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === id) {
        return { ...comp, [field]: value };
      }
      return comp;
    }));
    setHasUnsavedChanges(true);
  };

  // معالجة تغيير القائمة المنسدلة بأمان
  const handleSelectChange = (id: string, field: keyof FloorComponent, val: any) => {
    const safeValue = val?.target ? val.target.value : val;
    updateComponent(id, field, safeValue);
  };

  // حفظ البيانات
  const handleSave = () => {
    if (transactionId === 'new') {
        toast.warning('يجب حفظ المعاملة أولاً');
        return;
    }
    saveMutation.mutate(components);
  };

  // حساب الإجماليات
  const totals = {
    area: components.reduce((sum, c) => sum + (c.area || 0), 0),
    unitsCount: components.reduce((sum, c) => sum + (c.unitsCount || 0), 0)
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>;
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code={config.code} position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar { width: 8px !important; display: block !important; }
          .scroll-area-viewport::-webkit-scrollbar-track { background: rgba(37, 99, 235, 0.1) !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb { background: #2563eb !important; border-radius: 4px !important; }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* العنوان */}
          <Card style={{ background: config.gradient, border: `2px solid ${config.color}` }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: config.color }} />
                <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: config.color }}>
                  {config.title}
                </h2>
              </div>
            </CardContent>
          </Card>

          {/* تحذير التغييرات */}
          {hasUnsavedChanges && (
            <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span style={{ fontSize: '13px', color: '#92400e', fontWeight: 600 }}>لديك تغييرات غير محفوظة</span>
                  </div>
                  <Button size="sm" onClick={handleSave} disabled={readOnly} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <Save className="h-4 w-4 ml-1" /> حفظ الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الجدول */}
          {isDataReady && components.length > 0 ? (
            <Card className="card-rtl">
              <CardHeader style={{ background: config.gradient, borderBottom: `2px solid ${config.color}` }}>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>تفاصيل المكونات</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ background: '#f8fafc' }}>
                        <TableHead className="text-right" style={{ width: '80px' }}>م</TableHead>
                        <TableHead className="text-right">اسم الدور</TableHead>
                        <TableHead className="text-right">المساحة (م²)</TableHead>
                        <TableHead className="text-right">نسبة البناء (%)</TableHead>
                        <TableHead className="text-right">الاستخدام</TableHead>
                        <TableHead className="text-right">عدد الوحدات</TableHead>
                        <TableHead className="text-right">المنسوب (م)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="text-right">
                            <Badge variant="outline" style={{ background: config.gradient, border: `1px solid ${config.color}`, color: config.color, fontWeight: 700 }}>
                              {comp.sequence}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span style={{ fontWeight: 600 }}>{comp.floorName}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`area-${comp.id}`}
                              type="number"
                              value={comp.area.toString()}
                              onChange={(e) => updateComponent(comp.id, 'area', parseFloat(e.target.value) || 0)}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`ratio-${comp.id}`}
                              type="number"
                              value={comp.buildingRatio.toString()}
                              onChange={(e) => updateComponent(comp.id, 'buildingRatio', parseFloat(e.target.value) || 0)}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <SelectWithCopy
                              id={`usage-${comp.id}`}
                              value={comp.usage}
                              onChange={(val) => handleSelectChange(comp.id, 'usage', val)}
                              options={usageTypes.map(t => ({ value: t, label: t }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`units-${comp.id}`}
                              type="number"
                              value={comp.unitsCount.toString()}
                              onChange={(e) => updateComponent(comp.id, 'unitsCount', parseInt(e.target.value) || 0)}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <InputWithCopy
                              id={`level-${comp.id}`}
                              type="number"
                              value={comp.level.toString()}
                              onChange={(e) => updateComponent(comp.id, 'level', parseFloat(e.target.value) || 0)}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* صف الإجماليات */}
                      <TableRow style={{ background: config.gradient, fontWeight: 700 }}>
                        <TableCell colSpan={2} className="text-right" style={{ color: config.color }}>الإجماليات</TableCell>
                        <TableCell className="text-right">
                          <div style={{ padding: '6px 12px', background: config.color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}>
                            {totals.area.toFixed(2)} م²
                          </div>
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right">
                          <div style={{ padding: '6px 12px', background: config.color, color: 'white', borderRadius: '6px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}>
                            {totals.unitsCount}
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  لم يتم العثور على أدوار. يرجى الانتقال إلى تاب "مسميات وعدد الأدوار" أولاً.
                </p>
              </CardContent>
            </Card>
          )}

          {/* زر الحفظ */}
          {components.length > 0 && (
            <div className="flex gap-3 justify-end">
              <Button onClick={handleSave} disabled={readOnly || saveMutation.isPending} style={{ background: hasUnsavedChanges ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' }}>
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
                حفظ البيانات
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_Components_Generic_Complete;