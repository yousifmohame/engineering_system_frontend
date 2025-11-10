/**
 * تاب المكونات التفصيلية النهائية
 * =================================
 * 
 * المميزات:
 * ✅ جدول شامل لمكونات كل دور
 * ✅ اختيار أكثر من استخدام لنفس الدور
 * ✅ تحديد مساحة ونسبة كل استخدام
 * ✅ حساب الإجمالي والنسبة الإجمالية تلقائياً
 * ✅ عدد الوحدات والمنسوب
 * ✅ إمكانية إخفاء الصفوف والأعمدة عند الطباعة
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Save, AlertCircle, Plus, Trash2, Eye, EyeOff, Printer, 
  Building2, Maximize2, TrendingUp, Users, BarChart3 
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import { Checkbox } from '../ui/checkbox';

interface FloorUsage {
  id: string;
  usageType: string;   // نوع الاستخدام
  area: number;        // المساحة
  percentage: number;  // النسبة
}

interface FloorComponent {
  id: string;
  floorId: string;
  floorName: string;
  sequence: number;
  totalArea: number;           // المساحة الكلية
  buildingRatio: number;       // نسبة البناء
  usages: FloorUsage[];        // الاستخدامات المتعددة
  unitsCount: number;          // عدد الوحدات
  level: number;               // المنسوب
  hiddenInPrint: boolean;      // مخفي في الطباعة
}

interface FinalComponentsProps {
  transactionId?: string;
  readOnly?: boolean;
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

const Tab_FinalComponents_Detailed_Complete: React.FC<FinalComponentsProps> = ({
  transactionId = 'NEW',
  readOnly = false
}) => {
  const [components, setComponents] = useState<FloorComponent[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [floorsLoaded, setFloorsLoaded] = useState(false);
  
  // إعدادات الطباعة
  const [printSettings, setPrintSettings] = useState({
    hideSequence: false,
    hideFloorName: false,
    hideTotalArea: false,
    hideBuildingRatio: false,
    hideUsages: false,
    hideUnitsCount: false,
    hideLevel: false
  });

  // تحميل البيانات
  useEffect(() => {
    const savedFloors = localStorage.getItem(`floors_naming_${transactionId}`);
    
    if (savedFloors) {
      try {
        const floors = JSON.parse(savedFloors);
        
        const componentsData: FloorComponent[] = floors.map((floor: any) => ({
          id: floor.id,
          floorId: floor.id,
          floorName: floor.nameBySystem || `الدور ${floor.sequence}`,
          sequence: floor.sequence,
          totalArea: 0,
          buildingRatio: 0,
          usages: [
            { id: '1', usageType: 'سكني', area: 0, percentage: 0 }
          ],
          unitsCount: 0,
          level: 0,
          hiddenInPrint: false
        }));

        // تحميل البيانات المحفوظة
        const savedComponents = localStorage.getItem(`final_components_${transactionId}`);
        if (savedComponents) {
          try {
            const parsed = JSON.parse(savedComponents);
            const merged = componentsData.map(comp => {
              const saved = parsed.find((c: FloorComponent) => c.floorId === comp.floorId);
              return saved || comp;
            });
            setComponents(merged);
          } catch (e) {
            setComponents(componentsData);
          }
        } else {
          setComponents(componentsData);
        }
        
        setFloorsLoaded(true);
      } catch (error) {
        console.error('Error loading floors:', error);
      }
    } else {
      setComponents([]);
      setFloorsLoaded(true);
    }
  }, [transactionId]);

  // إضافة استخدام جديد لدور
  const addUsage = (componentId: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        const newUsage: FloorUsage = {
          id: Date.now().toString(),
          usageType: '',
          area: 0,
          percentage: 0
        };
        return { ...comp, usages: [...comp.usages, newUsage] };
      }
      return comp;
    }));
    setHasUnsavedChanges(true);
  };

  // حذف استخدام
  const removeUsage = (componentId: string, usageId: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        const updated = comp.usages.filter(u => u.id !== usageId);
        return { ...comp, usages: updated.length > 0 ? updated : comp.usages };
      }
      return comp;
    }));
    setHasUnsavedChanges(true);
  };

  // تحديث استخدام
  const updateUsage = (componentId: string, usageId: string, field: keyof FloorUsage, value: any) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        const updatedUsages = comp.usages.map(u => {
          if (u.id === usageId) {
            const updated = { ...u, [field]: value };
            // حساب النسبة تلقائياً
            if (field === 'area' && comp.totalArea > 0) {
              updated.percentage = (parseFloat(value) / comp.totalArea) * 100;
            }
            return updated;
          }
          return u;
        });
        return { ...comp, usages: updatedUsages };
      }
      return comp;
    }));
    setHasUnsavedChanges(true);
  };

  // تحديث بيانات المكون
  const updateComponent = (componentId: string, field: keyof FloorComponent, value: any) => {
    setComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        const updated = { ...comp, [field]: value };
        
        // إعادة حساب نسب الاستخدامات عند تغيير المساحة الكلية
        if (field === 'totalArea' && parseFloat(value) > 0) {
          updated.usages = updated.usages.map(u => ({
            ...u,
            percentage: (u.area / parseFloat(value)) * 100
          }));
        }
        
        return updated;
      }
      return comp;
    }));
    setHasUnsavedChanges(true);
  };

  // حساب الإجمالي والنسبة الإجمالية لكل دور
  const getTotals = (component: FloorComponent) => {
    const totalUsagesArea = component.usages.reduce((sum, u) => sum + u.area, 0);
    const totalUsagesPercentage = component.usages.reduce((sum, u) => sum + u.percentage, 0);
    return { totalUsagesArea, totalUsagesPercentage };
  };

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`final_components_${transactionId}`, JSON.stringify(components));
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ المكونات التفصيلية بنجاح!');
  };

  // طباعة
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-FINAL-COMPONENTS" position="top-right" />
      
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
          @media print {
            .no-print { display: none !important; }
            .print-hidden { display: none !important; }
          }
        `}</style>
        
        <div className="p-4 space-y-4">
          {/* إعدادات الطباعة */}
          <Card className="card-rtl no-print" style={{
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            border: '2px solid #a855f7'
          }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-purple-600" />
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                    إعدادات الطباعة
                  </CardTitle>
                </div>
                <Button size="sm" onClick={handlePrint} style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
                }}>
                  <Printer className="h-4 w-4 ml-1" />
                  طباعة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-sequence"
                    checked={printSettings.hideSequence}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, hideSequence: !!checked }))}
                  />
                  <label htmlFor="hide-sequence" style={{ fontSize: '12px', cursor: 'pointer' }}>
                    إخفاء المسلسل
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-floor-name"
                    checked={printSettings.hideFloorName}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, hideFloorName: !!checked }))}
                  />
                  <label htmlFor="hide-floor-name" style={{ fontSize: '12px', cursor: 'pointer' }}>
                    إخفاء اسم الدور
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-units"
                    checked={printSettings.hideUnitsCount}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, hideUnitsCount: !!checked }))}
                  />
                  <label htmlFor="hide-units" style={{ fontSize: '12px', cursor: 'pointer' }}>
                    إخفاء عدد الوحدات
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-level"
                    checked={printSettings.hideLevel}
                    onCheckedChange={(checked) => setPrintSettings(prev => ({ ...prev, hideLevel: !!checked }))}
                  />
                  <label htmlFor="hide-level" style={{ fontSize: '12px', cursor: 'pointer' }}>
                    إخفاء المنسوب
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* التحذيرات */}
          {hasUnsavedChanges && (
            <Card className="card-rtl no-print" style={{
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

          {/* جداول المكونات */}
          {floorsLoaded && components.length > 0 ? (
            components.map((component) => {
              const { totalUsagesArea, totalUsagesPercentage } = getTotals(component);
              const isHidden = component.hiddenInPrint;
              
              return (
                <Card 
                  key={component.id} 
                  className={`card-rtl ${isHidden ? 'print-hidden' : ''}`}
                  style={{
                    opacity: isHidden ? 0.6 : 1,
                    border: isHidden ? '2px dashed #9ca3af' : undefined
                  }}
                >
                  <CardHeader style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderBottom: '2px solid #3b82f6'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                          {component.floorName}
                        </CardTitle>
                        <Badge style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white'
                        }}>
                          الدور {component.sequence}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 no-print">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateComponent(component.id, 'hiddenInPrint', !isHidden)}
                        >
                          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addUsage(component.id)}
                          disabled={readOnly}
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                          <Plus className="h-3 w-3 ml-1" />
                          إضافة استخدام
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    {/* بيانات الدور الأساسية */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <InputWithCopy
                        label="المساحة الكلية (م²)"
                        id={`total-area-${component.id}`}
                        type="number"
                        value={component.totalArea.toString()}
                        onChange={(e) => updateComponent(component.id, 'totalArea', parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="نسبة البناء (%)"
                        id={`building-ratio-${component.id}`}
                        type="number"
                        value={component.buildingRatio.toString()}
                        onChange={(e) => updateComponent(component.id, 'buildingRatio', parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="عدد الوحدات"
                        id={`units-${component.id}`}
                        type="number"
                        value={component.unitsCount.toString()}
                        onChange={(e) => updateComponent(component.id, 'unitsCount', parseInt(e.target.value) || 0)}
                        disabled={readOnly}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="المنسوب (م)"
                        id={`level-${component.id}`}
                        type="number"
                        value={component.level.toString()}
                        onChange={(e) => updateComponent(component.id, 'level', parseFloat(e.target.value) || 0)}
                        disabled={readOnly}
                        copyable={false}
                        clearable={false}
                      />
                    </div>

                    {/* جدول الاستخدامات */}
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow style={{ background: '#f8fafc' }}>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '250px' }}>
                            نوع الاستخدام
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المساحة (م²)
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            النسبة (%)
                          </TableHead>
                          <TableHead className="text-right no-print" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                            إجراء
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {component.usages.map((usage, index) => (
                          <TableRow key={usage.id}>
                            <TableCell className="text-right">
                              <SelectWithCopy
                                id={`usage-type-${usage.id}`}
                                value={usage.usageType}
                                onChange={(value) => updateUsage(component.id, usage.id, 'usageType', value)}
                                options={usageTypes.map(t => ({ value: t, label: t }))}
                                disabled={readOnly}
                                copyable={false}
                                clearable={false}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <InputWithCopy
                                id={`usage-area-${usage.id}`}
                                type="number"
                                value={usage.area.toString()}
                                onChange={(e) => updateUsage(component.id, usage.id, 'area', parseFloat(e.target.value) || 0)}
                                disabled={readOnly}
                                copyable={false}
                                clearable={false}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div style={{
                                padding: '8px 12px',
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                borderRadius: '6px',
                                border: '1px solid #3b82f6',
                                textAlign: 'center',
                                fontWeight: 700,
                                color: '#1e40af',
                                fontFamily: 'monospace'
                              }}>
                                {usage.percentage.toFixed(2)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-right no-print">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeUsage(component.id, usage.id)}
                                disabled={readOnly || component.usages.length === 1}
                                style={{ opacity: component.usages.length === 1 ? 0.5 : 1 }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* صف الإجمالي */}
                        <TableRow style={{ 
                          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                          fontWeight: 700
                        }}>
                          <TableCell className="text-right" style={{ color: '#065f46' }}>
                            الإجمالي
                          </TableCell>
                          <TableCell className="text-right">
                            <div style={{
                              padding: '8px 12px',
                              background: '#10b981',
                              color: 'white',
                              borderRadius: '6px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontFamily: 'monospace'
                            }}>
                              {totalUsagesArea.toFixed(2)} م²
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div style={{
                              padding: '8px 12px',
                              background: '#10b981',
                              color: 'white',
                              borderRadius: '6px',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontFamily: 'monospace'
                            }}>
                              {totalUsagesPercentage.toFixed(2)}%
                            </div>
                          </TableCell>
                          <TableCell className="no-print"></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-3" />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontSize: '14px' }}>
                  لم يتم العثور على أدوار. يرجى الانتقال إلى تاب "مسميات وعدد الأدوار" أولاً.
                </p>
              </CardContent>
            </Card>
          )}

          {/* زر الحفظ */}
          {components.length > 0 && (
            <div className="flex gap-3 justify-end no-print">
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
                حفظ المكونات التفصيلية
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_FinalComponents_Detailed_Complete;
