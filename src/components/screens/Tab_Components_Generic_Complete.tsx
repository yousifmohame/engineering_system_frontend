/**
 * مكون موحد للمكونات (الرخصة القديمة / المقترح / القائم)
 * =====================================================
 * 
 * يستخدم لثلاثة تابات:
 * - المكونات حسب الرخصة القديمة
 * - المكونات حسب المقترح
 * - المكونات حسب القائم
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Save, AlertCircle, FileText } from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface FloorComponent {
  id: string;
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
  'سكني',
  'تجاري',
  'إداري',
  'صناعي',
  'خدمي',
  'مختلط',
  'مواقف سيارات',
  'مخازن',
  'غرف خدمات',
  'مساحات مشتركة'
];

const Tab_Components_Generic_Complete: React.FC<ComponentsGenericProps> = ({
  transactionId = 'NEW',
  readOnly = false,
  type
}) => {
  const [components, setComponents] = useState<FloorComponent[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحديد النصوص حسب النوع
  const config = {
    'old-license': {
      title: 'المكونات حسب الرخصة القديمة',
      code: 'TAB-COMPONENTS-OLD-LICENSE',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      storageKey: 'components_old_license'
    },
    'proposed': {
      title: 'المكونات حسب المقترح',
      code: 'TAB-COMPONENTS-PROPOSED',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      storageKey: 'components_proposed'
    },
    'existing': {
      title: 'المكونات حسب القائم',
      code: 'TAB-COMPONENTS-EXISTING',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      storageKey: 'components_existing'
    }
  }[type];

  // تحميل البيانات
  useEffect(() => {
    const savedFloors = localStorage.getItem(`floors_naming_${transactionId}`);
    
    if (savedFloors) {
      try {
        const floors = JSON.parse(savedFloors);
        
        const componentsData: FloorComponent[] = floors.map((floor: any) => ({
          id: floor.id,
          floorName: floor.nameBySystem || `الدور ${floor.sequence}`,
          sequence: floor.sequence,
          area: 0,
          buildingRatio: 0,
          usage: 'سكني',
          unitsCount: 0,
          level: 0
        }));

        // تحميل البيانات المحفوظة
        const savedComponents = localStorage.getItem(`${config.storageKey}_${transactionId}`);
        if (savedComponents) {
          try {
            const parsed = JSON.parse(savedComponents);
            const merged = componentsData.map(comp => {
              const saved = parsed.find((c: FloorComponent) => c.id === comp.id);
              return saved || comp;
            });
            setComponents(merged);
          } catch (e) {
            setComponents(componentsData);
          }
        } else {
          setComponents(componentsData);
        }
      } catch (error) {
        console.error('Error loading floors:', error);
      }
    }
  }, [transactionId, config.storageKey]);

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

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`${config.storageKey}_${transactionId}`, JSON.stringify(components));
    setHasUnsavedChanges(false);
    alert('✅ تم الحفظ بنجاح!');
  };

  // حساب الإجماليات
  const totals = {
    area: components.reduce((sum, c) => sum + c.area, 0),
    unitsCount: components.reduce((sum, c) => sum + c.unitsCount, 0)
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code={config.code} position="top-right" />
      
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
          {/* العنوان */}
          <Card style={{
            background: config.gradient,
            border: `2px solid ${config.color}`
          }}>
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
            <Card style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #f59e0b'
            }}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span style={{ fontSize: '13px', color: '#92400e', fontWeight: 600 }}>
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

          {/* الجدول */}
          {components.length > 0 ? (
            <Card className="card-rtl">
              <CardHeader style={{
                background: config.gradient,
                borderBottom: `2px solid ${config.color}`
              }}>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  تفاصيل المكونات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow style={{ background: '#f8fafc' }}>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                          م
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسم الدور
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المساحة (م²)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نسبة البناء (%)
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الاستخدام
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          عدد الوحدات
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المنسوب (م)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.map((comp) => (
                        <TableRow key={comp.id}>
                          {/* المسلسل */}
                          <TableCell className="text-right">
                            <Badge variant="outline" style={{
                              background: config.gradient,
                              border: `1px solid ${config.color}`,
                              color: config.color,
                              fontWeight: 700
                            }}>
                              {comp.sequence}
                            </Badge>
                          </TableCell>

                          {/* اسم الدور */}
                          <TableCell className="text-right">
                            <span style={{ fontWeight: 600 }}>{comp.floorName}</span>
                          </TableCell>

                          {/* المساحة */}
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

                          {/* نسبة البناء */}
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

                          {/* الاستخدام */}
                          <TableCell className="text-right">
                            <SelectWithCopy
                              id={`usage-${comp.id}`}
                              value={comp.usage}
                              onChange={(value) => updateComponent(comp.id, 'usage', value)}
                              options={usageTypes.map(t => ({ value: t, label: t }))}
                              disabled={readOnly}
                              copyable={false}
                              clearable={false}
                            />
                          </TableCell>

                          {/* عدد الوحدات */}
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

                          {/* المنسوب */}
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
                      <TableRow style={{
                        background: config.gradient,
                        fontWeight: 700
                      }}>
                        <TableCell colSpan={2} className="text-right" style={{ color: config.color }}>
                          الإجماليات
                        </TableCell>
                        <TableCell className="text-right">
                          <div style={{
                            padding: '6px 12px',
                            background: config.color,
                            color: 'white',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontFamily: 'monospace'
                          }}>
                            {totals.area.toFixed(2)} م²
                          </div>
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell className="text-right">
                          <div style={{
                            padding: '6px 12px',
                            background: config.color,
                            color: 'white',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontFamily: 'monospace'
                          }}>
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
