/**
 * تاب مسميات وعدد الأدوار - شامل ومتكامل
 * ==========================================
 * 
 * المميزات:
 * ✅ جدول مرن لإدارة مسميات الأدوار
 * ✅ حساب تلقائي لعدد الأدوار
 * ✅ صيغة العرض: (عدد* قبو + الارضي + ميزانين + عدد * دور متكرر + ملاحق علوية + ملاحق ارضية)
 * ✅ إضافة/حذف أدوار بدون حدود
 * ✅ اختيار من قائمة أو كتابة مخصصة
 * ✅ حفظ في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2, Save, Calculator, AlertCircle } from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface Floor {
  id: string;
  sequence: number;
  nameBySystem: string;          // اسم الدور حسب النظام
  standardName: string;           // الاسم القياسي
  isCustomNameBySystem: boolean;  // هل الاسم حسب النظام مخصص؟
  isCustomStandardName: boolean;  // هل الاسم القياسي مخصص؟
}

interface FloorsNamingProps {
  transactionId?: string;
  readOnly?: boolean;
}

const Tab_FloorsNaming_Complete: React.FC<FloorsNamingProps> = ({
  transactionId = 'NEW',
  readOnly = false
}) => {
  // قوائم الخيارات المتاحة
  const systemNameOptions = [
    'قبو 1',
    'قبو 2',
    'قبو 3',
    'الأرضي',
    'الميزانين',
    'الأول',
    'الثاني',
    'الثالث',
    'الرابع',
    'الخامس',
    'السادس',
    'السابع',
    'الثامن',
    'التاسع',
    'العاشر',
    'ملحق علوي 1',
    'ملحق علوي 2',
    'ملحق أرضي',
    'مخصص...'
  ];

  const standardNameOptions = [
    'Basement 1',
    'Basement 2',
    'Basement 3',
    'Ground Floor',
    'Mezzanine',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Fifth Floor',
    'Sixth Floor',
    'Seventh Floor',
    'Eighth Floor',
    'Ninth Floor',
    'Tenth Floor',
    'Upper Annex 1',
    'Upper Annex 2',
    'Ground Annex',
    'Custom...'
  ];

  // البيانات الافتراضية
  const defaultFloors: Floor[] = [
    { id: '1', sequence: 1, nameBySystem: 'الأرضي', standardName: 'Ground Floor', isCustomNameBySystem: false, isCustomStandardName: false },
    { id: '2', sequence: 2, nameBySystem: 'الأول', standardName: 'First Floor', isCustomNameBySystem: false, isCustomStandardName: false },
    { id: '3', sequence: 3, nameBySystem: 'الثاني', standardName: 'Second Floor', isCustomNameBySystem: false, isCustomStandardName: false },
  ];

  const [floors, setFloors] = useState<Floor[]>(defaultFloors);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`floors_naming_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFloors(parsed);
      } catch (error) {
        console.error('Error loading floors data:', error);
      }
    }
  }, [transactionId]);

  // حساب عدد الأدوار تلقائياً
  const calculateFloorsFormula = (): string => {
    const basements = floors.filter(f => f.nameBySystem.includes('قبو')).length;
    const ground = floors.filter(f => f.nameBySystem === 'الأرضي').length;
    const mezzanine = floors.filter(f => f.nameBySystem === 'الميزانين').length;
    const upperAnnex = floors.filter(f => f.nameBySystem.includes('ملحق علوي')).length;
    const groundAnnex = floors.filter(f => f.nameBySystem === 'ملحق أرضي').length;
    
    // الأدوار المتكررة (من الأول فما فوق)
    const repeatedFloors = floors.filter(f => 
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

    return parts.join(' + ') || 'لا يوجد أدوار';
  };

  // إضافة دور جديد
  const addFloor = () => {
    const newFloor: Floor = {
      id: Date.now().toString(),
      sequence: floors.length + 1,
      nameBySystem: '',
      standardName: '',
      isCustomNameBySystem: false,
      isCustomStandardName: false
    };
    setFloors([...floors, newFloor]);
    setHasUnsavedChanges(true);
  };

  // حذف دور
  const removeFloor = (id: string) => {
    const updated = floors.filter(f => f.id !== id);
    // إعادة ترقيم الأدوار
    const resequenced = updated.map((f, index) => ({
      ...f,
      sequence: index + 1
    }));
    setFloors(resequenced);
    setHasUnsavedChanges(true);
  };

  // تحديث بيانات الدور
  const updateFloor = (id: string, field: keyof Floor, value: any) => {
    setFloors(floors.map(f => {
      if (f.id === id) {
        const updated = { ...f, [field]: value };
        
        // إذا اختار "مخصص..." نفعّل الإدخال المخصص
        if (field === 'nameBySystem' && value === 'مخصص...') {
          updated.isCustomNameBySystem = true;
          updated.nameBySystem = '';
        } else if (field === 'nameBySystem') {
          updated.isCustomNameBySystem = false;
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

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`floors_naming_${transactionId}`, JSON.stringify(floors));
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ مسميات الأدوار بنجاح!');
  };

  const totalFloors = floors.length;

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-FLOORS-NAMING" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        {/* تنسيق السكرول */}
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
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
            background: #1e40af !important;
          }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* بطاقة إحصائيات */}
          <Card style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6'
          }}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* إجمالي الأدوار */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600 }}>
                      إجمالي عدد الأدوار
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: '#1e3a8a',
                    fontFamily: 'monospace'
                  }}>
                    {totalFloors}
                  </div>
                </div>

                {/* صيغة الأدوار */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600 }}>
                      صيغة الأدوار
                    </span>
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '8px',
                    border: '1px solid #93c5fd',
                    fontSize: '13px',
                    color: '#1e3a8a',
                    fontWeight: 600,
                    textAlign: 'center',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {calculateFloorsFormula()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ملاحظة توضيحية */}
          <Card style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b'
          }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>
                    <strong>ملاحظة:</strong> يمكنك إضافة عدد لا نهائي من الأدوار، واختيار اسم كل دور من القائمة أو كتابة اسم مخصص.
                  </p>
                  <p style={{ fontSize: '12px', color: '#92400e' }}>
                    يتم حساب عدد الأدوار وصيغتها تلقائياً بناءً على مسميات الأدوار المدخلة.
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

          {/* جدول الأدوار */}
          <Card className="card-rtl">
            <CardHeader style={{
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              borderBottom: '2px solid #8b5cf6'
            }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  جدول مسميات الأدوار
                </CardTitle>
                <Button
                  size="sm"
                  onClick={addFloor}
                  disabled={readOnly}
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                >
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة دور
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow style={{ background: '#f8fafc' }}>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                        المسلسل
                      </TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اسم الدور حسب النظام
                      </TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الاسم القياسي (Standard Name)
                      </TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                        إجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {floors.map((floor) => (
                      <TableRow key={floor.id}>
                        {/* المسلسل */}
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{
                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            border: '1px solid #3b82f6',
                            color: '#1e40af',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            fontWeight: 700
                          }}>
                            {floor.sequence}
                          </Badge>
                        </TableCell>

                        {/* اسم الدور حسب النظام */}
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
                              onChange={(value) => updateFloor(floor.id, 'nameBySystem', value)}
                              options={systemNameOptions.map(opt => ({ value: opt, label: opt }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          )}
                        </TableCell>

                        {/* الاسم القياسي */}
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
                              onChange={(value) => updateFloor(floor.id, 'standardName', value)}
                              options={standardNameOptions.map(opt => ({ value: opt, label: opt }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          )}
                        </TableCell>

                        {/* إجراءات */}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFloor(floor.id)}
                            disabled={readOnly || floors.length === 1}
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              opacity: floors.length === 1 ? 0.5 : 1
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {floors.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    لا توجد أدوار. اضغط "إضافة دور" لبدء الإدخال.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* أزرار الحفظ */}
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
              حفظ مسميات الأدوار
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_FloorsNaming_Complete;
