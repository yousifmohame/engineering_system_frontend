/**
 * تاب مسميات وعدد الأدوار - متصل بالـ Backend
 * ==========================================
 * * المميزات:
 * ✅ جلب البيانات من قاعدة البيانات (Prisma JSON field)
 * ✅ حفظ التغييرات في السيرفر
 * ✅ حساب تلقائي للصيغة
 * ✅ معالجة آمنة للبيانات (Fix Circular JSON Error)
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2, Save, Calculator, AlertCircle, Loader2 } from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';
import { getTransactionById, updateTransactionFloors } from '../../api/transactionApi';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

interface Floor {
  id: string;
  sequence: number;
  nameBySystem: string;          // اسم الدور حسب النظام
  standardName: string;          // الاسم القياسي
  isCustomNameBySystem: boolean;  // هل الاسم حسب النظام مخصص؟
  isCustomStandardName: boolean;  // هل الاسم القياسي مخصص؟
}

interface FloorsNamingProps {
  transactionId?: string;
  readOnly?: boolean;
}

const Tab_FloorsNaming_Complete: React.FC<FloorsNamingProps> = ({
  transactionId = '',
  readOnly = false
}) => {
  const queryClient = useQueryClient();
  
  const systemNameOptions = [
    'قبو 1', 'قبو 2', 'قبو 3',
    'الأرضي', 'الميزانين',
    'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
    'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'ملحق علوي 1', 'ملحق علوي 2', 'ملحق أرضي',
    'مخصص...'
  ];

  const standardNameOptions = [
    'Basement 1', 'Basement 2', 'Basement 3',
    'Ground Floor', 'Mezzanine',
    'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor',
    'Sixth Floor', 'Seventh Floor', 'Eighth Floor', 'Ninth Floor', 'Tenth Floor',
    'Upper Annex 1', 'Upper Annex 2', 'Ground Annex',
    'Custom...'
  ];

  const defaultFloors: Floor[] = [
    { id: '1', sequence: 1, nameBySystem: 'الأرضي', standardName: 'Ground Floor', isCustomNameBySystem: false, isCustomStandardName: false },
    { id: '2', sequence: 2, nameBySystem: 'الأول', standardName: 'First Floor', isCustomNameBySystem: false, isCustomStandardName: false },
  ];

  const [floors, setFloors] = useState<Floor[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 1. جلب البيانات
  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && transactionId !== 'new',
  });

  // 2. مزامنة البيانات
  useEffect(() => {
    if (transaction?.floors && Array.isArray(transaction.floors) && transaction.floors.length > 0) {
      setFloors(transaction.floors);
    } else if (transaction && (!transaction.floors || transaction.floors.length === 0)) {
      setFloors(defaultFloors);
      setHasUnsavedChanges(true); 
    } else if (transactionId === 'new' && floors.length === 0) {
        setFloors(defaultFloors);
    }
  }, [transaction, transactionId]);

  // 3. الحفظ
  const saveMutation = useMutation({
    mutationFn: (data: Floor[]) => {
        // تنظيف البيانات قبل الإرسال للتأكد من عدم وجود كائنات دائرية
        const sanitizedData = data.map(f => ({
            id: f.id,
            sequence: f.sequence,
            nameBySystem: String(f.nameBySystem || ''),
            standardName: String(f.standardName || ''),
            isCustomNameBySystem: !!f.isCustomNameBySystem,
            isCustomStandardName: !!f.isCustomStandardName
        }));
        return updateTransactionFloors(transactionId, sanitizedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      if(data.floors) setFloors(data.floors);
      setHasUnsavedChanges(false);
      toast.success('تم حفظ بيانات الأدوار بنجاح');
    },
    onError: (error: any) => {
      console.error("Save Error:", error);
      toast.error('فشل في حفظ البيانات: تأكد من صحة المدخلات');
    }
  });

  const calculateFloorsFormula = (): string => {
    if (floors.length === 0) return 'لا يوجد أدوار';

    const basements = floors.filter(f => f.nameBySystem && f.nameBySystem.includes('قبو')).length;
    const ground = floors.filter(f => f.nameBySystem === 'الأرضي').length;
    const mezzanine = floors.filter(f => f.nameBySystem === 'الميزانين').length;
    const upperAnnex = floors.filter(f => f.nameBySystem && f.nameBySystem.includes('ملحق علوي')).length;
    const groundAnnex = floors.filter(f => f.nameBySystem === 'ملحق أرضي').length;
    
    const repeatedFloors = floors.filter(f => 
      f.nameBySystem &&
      !f.nameBySystem.includes('قبو') && 
      f.nameBySystem !== 'الأرضي' && 
      f.nameBySystem !== 'الميزانين' &&
      !f.nameBySystem.includes('ملحق')
    ).length;

    const parts: string[] = [];
    if (basements > 0) parts.push(`${basements} × قبو`);
    if (ground > 0) parts.push('الأرضي');
    if (mezzanine > 0) parts.push('الميزانين');
    if (repeatedFloors > 0) parts.push(`${repeatedFloors} × دور متكرر`);
    if (upperAnnex > 0) parts.push(`${upperAnnex} × ملحق علوي`);
    if (groundAnnex > 0) parts.push(`${groundAnnex} × ملحق أرضي`);

    return parts.join(' + ') || 'غير محدد';
  };

  const addFloor = () => {
    const newFloor: Floor = {
      id: nanoid(),
      sequence: floors.length + 1,
      nameBySystem: '',
      standardName: '',
      isCustomNameBySystem: false,
      isCustomStandardName: false
    };
    setFloors([...floors, newFloor]);
    setHasUnsavedChanges(true);
  };

  const removeFloor = (id: string) => {
    const updated = floors.filter(f => f.id !== id);
    const resequenced = updated.map((f, index) => ({
      ...f,
      sequence: index + 1
    }));
    setFloors(resequenced);
    setHasUnsavedChanges(true);
  };

  // ✅ دالة تحديث القيمة بشكل آمن (لمنع خطأ Circular Structure)
  const handleSelectChange = (id: string, field: keyof Floor, val: any) => {
    // إذا كانت القيمة حدث (Event)، نستخرج القيمة النصية منه، وإلا نستخدم القيمة كما هي
    const safeValue = val?.target ? val.target.value : val;
    updateFloor(id, field, safeValue);
  };

  const updateFloor = (id: string, field: keyof Floor, value: any) => {
    setFloors(floors.map(f => {
      if (f.id === id) {
        const updated = { ...f, [field]: value };
        
        if (field === 'nameBySystem') {
            if (value === 'مخصص...') {
                updated.isCustomNameBySystem = true;
                updated.nameBySystem = '';
            } else if (!updated.isCustomNameBySystem) {
                const idx = systemNameOptions.indexOf(value);
                if (idx !== -1 && idx < standardNameOptions.length) {
                    updated.standardName = standardNameOptions[idx];
                    updated.isCustomStandardName = false;
                }
            }
        }
        
        if (field === 'standardName' && value === 'Custom...') {
          updated.isCustomStandardName = true;
          updated.standardName = '';
        } else if (field === 'standardName') {
          updated.isCustomStandardName = false;
        }
        
        return updated;
      }
      return f;
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (transactionId === 'new') {
        toast.warning('يجب حفظ المعاملة أولاً قبل حفظ تفاصيل الأدوار');
        return;
    }
    saveMutation.mutate(floors);
  };

  if (isLoading) {
      return <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>
  }

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-FLOORS-FIXED" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar { width: 8px !important; display: block !important; }
          .scroll-area-viewport::-webkit-scrollbar-track { background: rgba(37, 99, 235, 0.1) !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb { background: #2563eb !important; border-radius: 4px !important; }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover { background: #1e40af !important; }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* الاحصائيات */}
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600 }}>إجمالي عدد الأدوار</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e3a8a', fontFamily: 'monospace' }}>
                    {floors.length}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600 }}>صيغة الأدوار</span>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', border: '1px solid #93c5fd', fontSize: '13px', color: '#1e3a8a', fontWeight: 600, textAlign: 'center', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {calculateFloorsFormula()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl">
            <CardHeader style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', borderBottom: '2px solid #8b5cf6' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>جدول مسميات الأدوار</CardTitle>
                <Button size="sm" onClick={addFloor} disabled={readOnly} style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                  <Plus className="h-4 w-4 ml-1" /> إضافة دور
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow style={{ background: '#f8fafc' }}>
                      <TableHead className="text-right" style={{ width: '80px' }}>المسلسل</TableHead>
                      <TableHead className="text-right">اسم الدور حسب النظام</TableHead>
                      <TableHead className="text-right">الاسم القياسي (Standard Name)</TableHead>
                      <TableHead className="text-right" style={{ width: '100px' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {floors.map((floor) => (
                      <TableRow key={floor.id}>
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '1px solid #3b82f6', color: '#1e40af', fontFamily: 'monospace', fontSize: '14px', fontWeight: 700 }}>
                            {floor.sequence}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          {floor.isCustomNameBySystem ? (
                            <InputWithCopy
                              id={`system-name-${floor.id}`}
                              value={floor.nameBySystem}
                              onChange={(e) => updateFloor(floor.id, 'nameBySystem', e.target.value)}
                              placeholder="أدخل اسم الدور حسب النظام"
                              disabled={readOnly}
                              copyable={false}
                              clearable={true}
                            />
                          ) : (
                            <SelectWithCopy
                              id={`system-name-${floor.id}`}
                              value={floor.nameBySystem}
                              // ✅ استخدام الدالة الآمنة هنا
                              onChange={(val) => handleSelectChange(floor.id, 'nameBySystem', val)}
                              options={systemNameOptions.map(opt => ({ value: opt, label: opt }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          {floor.isCustomStandardName ? (
                            <InputWithCopy
                              id={`standard-name-${floor.id}`}
                              value={floor.standardName}
                              onChange={(e) => updateFloor(floor.id, 'standardName', e.target.value)}
                              placeholder="Enter Standard Name"
                              disabled={readOnly}
                              copyable={false}
                              clearable={true}
                            />
                          ) : (
                            <SelectWithCopy
                              id={`standard-name-${floor.id}`}
                              value={floor.standardName}
                              // ✅ استخدام الدالة الآمنة هنا
                              onChange={(val) => handleSelectChange(floor.id, 'standardName', val)}
                              options={standardNameOptions.map(opt => ({ value: opt, label: opt }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive" onClick={() => removeFloor(floor.id)} disabled={readOnly || floors.length <= 1} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', opacity: floors.length <= 1 ? 0.5 : 1 }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button onClick={handleSave} disabled={readOnly || saveMutation.isPending} style={{ background: hasUnsavedChanges ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
              {hasUnsavedChanges ? 'حفظ التغييرات' : 'حفظ البيانات'}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_FloorsNaming_Complete;