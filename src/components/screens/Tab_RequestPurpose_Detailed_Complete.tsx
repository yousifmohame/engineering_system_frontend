/**
 * التاب: الغرض التفصيلي من الطلب
 * ====================================
 * 
 * يُستخدم في:
 * - الشاشة 286: إنشاء معاملة جديدة
 * - الشاشة 284: معالجة المعاملات
 * 
 * الوظيفة:
 * - اختيار متعدد من 5 أغراض تفصيلية
 * - كل غرض له حقول تفاعلية خاصة
 * - حسابات تلقائية للفروقات
 * - حفظ تلقائي في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

// ==================== الواجهات ====================

interface FloorData {
  id: string;
  name: string;
  area: number;
}

interface FloorUsageChange {
  floorId: string;
  floorName: string;
  fromUsage: string;
  toUsage: string;
}

interface FloorAreaChange {
  floorId: string;
  floorName: string;
  fromArea: number;
  toArea: number;
  difference: number; // موجب للزيادة، سالب للنقص
}

interface SetbackChange {
  direction: 'north' | 'south' | 'east' | 'west';
  directionAr: string;
  current: number;
  proposed: number;
  nature: number;
  difference: number;
}

interface FloorCountChange {
  current: number;
  approved: number;
  proposed: number;
  difference: number;
}

interface ProjectUsageChange {
  fromUsage: string;
  toUsage: string;
  basis: 'approved-building-system' | 'exception' | 'directive' | 'approval';
  basisAr: string;
  notes: string;
}

interface DetailedPurpose {
  id: string;
  name: string;
  nameEn: string;
  isActive: boolean;
  data: any;
}

interface TabProps {
  transactionId?: string;
  onSave?: (purposes: DetailedPurpose[]) => void;
  readOnly?: boolean;
}

// ==================== البيانات الافتراضية ====================

const AVAILABLE_FLOORS: FloorData[] = [
  { id: 'basement', name: 'البدروم', area: 200 },
  { id: 'ground', name: 'الأرضي', area: 300 },
  { id: 'first', name: 'الأول', area: 300 },
  { id: 'second', name: 'الثاني', area: 300 },
  { id: 'roof', name: 'الملحق العلوي', area: 150 }
];

const USAGE_TYPES = [
  { value: 'residential', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
  { value: 'administrative', label: 'إداري' },
  { value: 'industrial', label: 'صناعي' },
  { value: 'mixed', label: 'مختلط' }
];

const PROJECT_BASIS = [
  { value: 'approved-building-system', label: 'نظام البناء المعتمد' },
  { value: 'exception', label: 'استثناء' },
  { value: 'directive', label: 'توجيه' },
  { value: 'approval', label: 'موافقة' }
];

// ==================== المكون الرئيسي ====================

const Tab_RequestPurpose_Detailed_Complete: React.FC<TabProps> = ({
  transactionId = 'NEW',
  onSave,
  readOnly = false
}) => {
  // 1. تعديل استخدام الأدوار
  const [floorUsageActive, setFloorUsageActive] = useState(false);
  const [floorUsageChanges, setFloorUsageChanges] = useState<FloorUsageChange[]>([]);

  // 2. تعديل مساحات الأدوار
  const [floorAreasActive, setFloorAreasActive] = useState(false);
  const [floorAreaChanges, setFloorAreaChanges] = useState<FloorAreaChange[]>([]);

  // 3. تعديل الارتدادات
  const [setbacksActive, setSetbacksActive] = useState(false);
  const [setbackChanges, setSetbackChanges] = useState<SetbackChange[]>([
    { direction: 'north', directionAr: 'الشمال', current: 3, proposed: 4, nature: 3.5, difference: 0 },
    { direction: 'south', directionAr: 'الجنوب', current: 3, proposed: 3, nature: 2.8, difference: 0 },
    { direction: 'east', directionAr: 'الشرق', current: 4, proposed: 5, nature: 4.2, difference: 0 },
    { direction: 'west', directionAr: 'الغرب', current: 4, proposed: 4, nature: 4, difference: 0 }
  ]);

  // 4. زيادة أدوار
  const [floorsCountActive, setFloorsCountActive] = useState(false);
  const [floorsCount, setFloorsCount] = useState<FloorCountChange>({
    current: 2,
    approved: 3,
    proposed: 4,
    difference: 0
  });

  // 5. تعديل استخدام المشروع
  const [projectUsageActive, setProjectUsageActive] = useState(false);
  const [projectUsage, setProjectUsage] = useState<ProjectUsageChange>({
    fromUsage: 'residential',
    toUsage: 'commercial',
    basis: 'approved-building-system',
    basisAr: 'نظام البناء المعتمد',
    notes: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`request_purpose_detailed_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // تحميل البيانات المحفوظة
        if (parsed.floorUsageActive !== undefined) setFloorUsageActive(parsed.floorUsageActive);
        if (parsed.floorUsageChanges) setFloorUsageChanges(parsed.floorUsageChanges);
        if (parsed.floorAreasActive !== undefined) setFloorAreasActive(parsed.floorAreasActive);
        if (parsed.floorAreaChanges) setFloorAreaChanges(parsed.floorAreaChanges);
        if (parsed.setbacksActive !== undefined) setSetbacksActive(parsed.setbacksActive);
        if (parsed.setbackChanges) setSetbackChanges(parsed.setbackChanges);
        if (parsed.floorsCountActive !== undefined) setFloorsCountActive(parsed.floorsCountActive);
        if (parsed.floorsCount) setFloorsCount(parsed.floorsCount);
        if (parsed.projectUsageActive !== undefined) setProjectUsageActive(parsed.projectUsageActive);
        if (parsed.projectUsage) setProjectUsage(parsed.projectUsage);
      } catch (error) {
        console.error('Error loading saved detailed purposes:', error);
      }
    }
  }, [transactionId]);

  // حساب فرق عدد الأدوار تلقائياً
  useEffect(() => {
    setFloorsCount(prev => ({
      ...prev,
      difference: prev.proposed - prev.current
    }));
  }, [floorsCount.current, floorsCount.proposed]);

  // حساب فرق الارتدادات تلقائياً
  const calculateSetbackDifference = (index: number) => {
    const setback = setbackChanges[index];
    const diff = setback.proposed - setback.current;
    const updated = [...setbackChanges];
    updated[index] = { ...setback, difference: diff };
    setSetbackChanges(updated);
    setHasChanges(true);
  };

  // حفظ البيانات
  const handleSave = () => {
    const dataToSave = {
      floorUsageActive,
      floorUsageChanges,
      floorAreasActive,
      floorAreaChanges,
      setbacksActive,
      setbackChanges,
      floorsCountActive,
      floorsCount,
      projectUsageActive,
      projectUsage
    };

    localStorage.setItem(`request_purpose_detailed_${transactionId}`, JSON.stringify(dataToSave));
    setHasChanges(false);
    
    if (onSave) {
      const purposes: DetailedPurpose[] = [
        { id: 'floor-usage', name: 'تعديل استخدام الأدوار', nameEn: 'Floor Usage Modification', isActive: floorUsageActive, data: floorUsageChanges },
        { id: 'floor-areas', name: 'تعديل مساحات الأدوار', nameEn: 'Floor Areas Modification', isActive: floorAreasActive, data: floorAreaChanges },
        { id: 'setbacks', name: 'تعديل الارتدادات', nameEn: 'Setbacks Modification', isActive: setbacksActive, data: setbackChanges },
        { id: 'floors-count', name: 'زيادة أدوار', nameEn: 'Add Floors', isActive: floorsCountActive, data: floorsCount },
        { id: 'project-usage', name: 'تعديل استخدام المشروع', nameEn: 'Project Usage Change', isActive: projectUsageActive, data: projectUsage }
      ];
      onSave(purposes);
    }
    
    alert('تم حفظ الأغراض التفصيلية بنجاح!');
  };

  // إضافة تغيير استخدام دور
  const addFloorUsageChange = () => {
    setFloorUsageChanges([...floorUsageChanges, {
      floorId: '',
      floorName: '',
      fromUsage: '',
      toUsage: ''
    }]);
    setHasChanges(true);
  };

  // حذف تغيير استخدام دور
  const removeFloorUsageChange = (index: number) => {
    setFloorUsageChanges(floorUsageChanges.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // إضافة تغيير مساحة دور
  const addFloorAreaChange = () => {
    setFloorAreaChanges([...floorAreaChanges, {
      floorId: '',
      floorName: '',
      fromArea: 0,
      toArea: 0,
      difference: 0
    }]);
    setHasChanges(true);
  };

  // حذف تغيير مساحة دور
  const removeFloorAreaChange = (index: number) => {
    setFloorAreaChanges(floorAreaChanges.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // حساب فرق المساحة
  const calculateAreaDifference = (index: number) => {
    const change = floorAreaChanges[index];
    const diff = change.toArea - change.fromArea;
    const updated = [...floorAreaChanges];
    updated[index] = { ...change, difference: diff };
    setFloorAreaChanges(updated);
    setHasChanges(true);
  };

  // حساب عدد الأغراض النشطة
  const activeCount = [floorUsageActive, floorAreasActive, setbacksActive, floorsCountActive, projectUsageActive].filter(Boolean).length;

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-PURPOSE-DETAILED" position="top-right" />
      
      <ScrollArea style={{ height: 'calc(100vh - 180px)' }}>
        {/* سكرول ظاهر دائماً */}
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
                      تم تفعيل {activeCount} من 5 أغراض
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

          {/* 1. تعديل استخدام الأدوار */}
          <Card className="card-rtl" style={{ borderColor: floorUsageActive ? '#2563eb' : '#e5e7eb' }}>
            <CardHeader className="p-3" style={{ background: floorUsageActive ? 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' : '#f8fafc' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  1️⃣ تعديل استخدام الأدوار
                </CardTitle>
                <EnhancedSwitch
                  id="floor-usage-active"
                  checked={floorUsageActive}
                  onCheckedChange={(checked) => {
                    setFloorUsageActive(checked);
                    setHasChanges(true);
                  }}
                  size="sm"
                  disabled={readOnly}
                />
              </div>
            </CardHeader>
            
            {floorUsageActive && (
              <CardContent className="p-3 space-y-3">
                {floorUsageChanges.map((change, index) => (
                  <div key={index} className="p-3" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        التغيير #{index + 1}
                      </span>
                      {!readOnly && (
                        <Button variant="outline" size="sm" onClick={() => removeFloorUsageChange(index)} style={{ color: '#ef4444' }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <SelectWithCopy
                        label="الدور"
                        id={`floor-usage-${index}-floor`}
                        value={change.floorId}
                        onChange={(value) => {
                          const floor = AVAILABLE_FLOORS.find(f => f.id === value);
                          const updated = [...floorUsageChanges];
                          updated[index] = { ...change, floorId: value, floorName: floor?.name || '' };
                          setFloorUsageChanges(updated);
                          setHasChanges(true);
                        }}
                        options={AVAILABLE_FLOORS.map(f => ({ value: f.id, label: f.name }))}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <SelectWithCopy
                        label="من استخدام"
                        id={`floor-usage-${index}-from`}
                        value={change.fromUsage}
                        onChange={(value) => {
                          const updated = [...floorUsageChanges];
                          updated[index] = { ...change, fromUsage: value };
                          setFloorUsageChanges(updated);
                          setHasChanges(true);
                        }}
                        options={USAGE_TYPES}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <SelectWithCopy
                        label="إلى استخدام"
                        id={`floor-usage-${index}-to`}
                        value={change.toUsage}
                        onChange={(value) => {
                          const updated = [...floorUsageChanges];
                          updated[index] = { ...change, toUsage: value };
                          setFloorUsageChanges(updated);
                          setHasChanges(true);
                        }}
                        options={USAGE_TYPES}
                        copyable={true}
                        clearable={true}
                      />
                    </div>
                  </div>
                ))}
                
                {!readOnly && (
                  <Button onClick={addFloorUsageChange} variant="outline" size="sm" style={{ width: '100%' }}>
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة تغيير
                  </Button>
                )}
              </CardContent>
            )}
          </Card>

          {/* 2. تعديل مساحات الأدوار */}
          <Card className="card-rtl" style={{ borderColor: floorAreasActive ? '#10b981' : '#e5e7eb' }}>
            <CardHeader className="p-3" style={{ background: floorAreasActive ? 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)' : '#f8fafc' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  2️⃣ تعديل مساحات الأدوار
                </CardTitle>
                <EnhancedSwitch
                  id="floor-areas-active"
                  checked={floorAreasActive}
                  onCheckedChange={(checked) => {
                    setFloorAreasActive(checked);
                    setHasChanges(true);
                  }}
                  size="sm"
                  variant="success"
                  disabled={readOnly}
                />
              </div>
            </CardHeader>
            
            {floorAreasActive && (
              <CardContent className="p-3 space-y-3">
                {floorAreaChanges.map((change, index) => (
                  <div key={index} className="p-3" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        التغيير #{index + 1}
                      </span>
                      {!readOnly && (
                        <Button variant="outline" size="sm" onClick={() => removeFloorAreaChange(index)} style={{ color: '#ef4444' }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <SelectWithCopy
                        label="الدور"
                        id={`floor-area-${index}-floor`}
                        value={change.floorId}
                        onChange={(value) => {
                          const floor = AVAILABLE_FLOORS.find(f => f.id === value);
                          const updated = [...floorAreaChanges];
                          updated[index] = { ...change, floorId: value, floorName: floor?.name || '' };
                          setFloorAreaChanges(updated);
                          setHasChanges(true);
                        }}
                        options={AVAILABLE_FLOORS.map(f => ({ value: f.id, label: f.name }))}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <InputWithCopy
                        label="من (م²)"
                        id={`floor-area-${index}-from`}
                        type="number"
                        value={change.fromArea.toString()}
                        onChange={(e) => {
                          const updated = [...floorAreaChanges];
                          updated[index] = { ...change, fromArea: parseFloat(e.target.value) || 0 };
                          setFloorAreaChanges(updated);
                          calculateAreaDifference(index);
                        }}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <InputWithCopy
                        label="إلى (م²)"
                        id={`floor-area-${index}-to`}
                        type="number"
                        value={change.toArea.toString()}
                        onChange={(e) => {
                          const updated = [...floorAreaChanges];
                          updated[index] = { ...change, toArea: parseFloat(e.target.value) || 0 };
                          setFloorAreaChanges(updated);
                          calculateAreaDifference(index);
                        }}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <div>
                        <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                          الفرق
                        </label>
                        <div 
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: change.difference > 0 ? '#d1fae5' : change.difference < 0 ? '#fee2e2' : '#f3f4f6',
                            border: '2px solid',
                            borderColor: change.difference > 0 ? '#10b981' : change.difference < 0 ? '#ef4444' : '#e5e7eb',
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: change.difference > 0 ? '#065f46' : change.difference < 0 ? '#991b1b' : '#6b7280',
                            textAlign: 'center'
                          }}
                        >
                          {change.difference > 0 ? '+' : ''}{change.difference} م²
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!readOnly && (
                  <Button onClick={addFloorAreaChange} variant="outline" size="sm" style={{ width: '100%' }}>
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة تغيير
                  </Button>
                )}
              </CardContent>
            )}
          </Card>

          {/* 3. تعديل الارتدادات */}
          <Card className="card-rtl" style={{ borderColor: setbacksActive ? '#8b5cf6' : '#e5e7eb' }}>
            <CardHeader className="p-3" style={{ background: setbacksActive ? 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)' : '#f8fafc' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  3️⃣ تعديل الارتدادات
                </CardTitle>
                <EnhancedSwitch
                  id="setbacks-active"
                  checked={setbacksActive}
                  onCheckedChange={(checked) => {
                    setSetbacksActive(checked);
                    setHasChanges(true);
                  }}
                  size="sm"
                  disabled={readOnly}
                />
              </div>
            </CardHeader>
            
            {setbacksActive && (
              <CardContent className="p-3 space-y-2">
                {setbackChanges.map((setback, index) => (
                  <div key={setback.direction} className="p-2" style={{ background: '#f8fafc', borderRadius: '6px' }}>
                    <div className="grid grid-cols-5 gap-2">
                      <div>
                        <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                          الجهة
                        </label>
                        <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1f2937', padding: '6px' }}>
                          {setback.directionAr}
                        </div>
                      </div>
                      
                      <InputWithCopy
                        label="القائم (م)"
                        id={`setback-${setback.direction}-current`}
                        type="number"
                        value={setback.current.toString()}
                        onChange={(e) => {
                          const updated = [...setbackChanges];
                          updated[index] = { ...setback, current: parseFloat(e.target.value) || 0 };
                          setSetbackChanges(updated);
                          calculateSetbackDifference(index);
                        }}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <InputWithCopy
                        label="المقترح (م)"
                        id={`setback-${setback.direction}-proposed`}
                        type="number"
                        value={setback.proposed.toString()}
                        onChange={(e) => {
                          const updated = [...setbackChanges];
                          updated[index] = { ...setback, proposed: parseFloat(e.target.value) || 0 };
                          setSetbackChanges(updated);
                          calculateSetbackDifference(index);
                        }}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <InputWithCopy
                        label="الطبيعة (م)"
                        id={`setback-${setback.direction}-nature`}
                        type="number"
                        value={setback.nature.toString()}
                        onChange={(e) => {
                          const updated = [...setbackChanges];
                          updated[index] = { ...setback, nature: parseFloat(e.target.value) || 0 };
                          setSetbackChanges(updated);
                          setHasChanges(true);
                        }}
                        copyable={true}
                        clearable={true}
                      />
                      
                      <div>
                        <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                          الفرق
                        </label>
                        <div 
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: setback.difference > 0 ? '#d1fae5' : setback.difference < 0 ? '#fee2e2' : '#f3f4f6',
                            border: '1px solid',
                            borderColor: setback.difference > 0 ? '#10b981' : setback.difference < 0 ? '#ef4444' : '#e5e7eb',
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: setback.difference > 0 ? '#065f46' : setback.difference < 0 ? '#991b1b' : '#6b7280',
                            textAlign: 'center'
                          }}
                        >
                          {setback.difference > 0 ? '+' : ''}{setback.difference}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* 4. زيادة أدوار */}
          <Card className="card-rtl" style={{ borderColor: floorsCountActive ? '#f59e0b' : '#e5e7eb' }}>
            <CardHeader className="p-3" style={{ background: floorsCountActive ? 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)' : '#f8fafc' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  4️⃣ زيادة أدوار
                </CardTitle>
                <EnhancedSwitch
                  id="floors-count-active"
                  checked={floorsCountActive}
                  onCheckedChange={(checked) => {
                    setFloorsCountActive(checked);
                    setHasChanges(true);
                  }}
                  size="sm"
                  variant="warning"
                  disabled={readOnly}
                />
              </div>
            </CardHeader>
            
            {floorsCountActive && (
              <CardContent className="p-3">
                <div className="grid grid-cols-4 gap-3">
                  <InputWithCopy
                    label="العدد القائم"
                    id="floors-current"
                    type="number"
                    value={floorsCount.current.toString()}
                    onChange={(e) => {
                      setFloorsCount({ ...floorsCount, current: parseInt(e.target.value) || 0 });
                      setHasChanges(true);
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  
                  <InputWithCopy
                    label="العدد المعتمد"
                    id="floors-approved"
                    type="number"
                    value={floorsCount.approved.toString()}
                    onChange={(e) => {
                      setFloorsCount({ ...floorsCount, approved: parseInt(e.target.value) || 0 });
                      setHasChanges(true);
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  
                  <InputWithCopy
                    label="العدد المقترح"
                    id="floors-proposed"
                    type="number"
                    value={floorsCount.proposed.toString()}
                    onChange={(e) => {
                      setFloorsCount({ ...floorsCount, proposed: parseInt(e.target.value) || 0 });
                      setHasChanges(true);
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  
                  <div>
                    <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                      الفرق
                    </label>
                    <div 
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: floorsCount.difference > 0 ? '#d1fae5' : floorsCount.difference < 0 ? '#fee2e2' : '#f3f4f6',
                        border: '2px solid',
                        borderColor: floorsCount.difference > 0 ? '#10b981' : floorsCount.difference < 0 ? '#ef4444' : '#e5e7eb',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: floorsCount.difference > 0 ? '#065f46' : floorsCount.difference < 0 ? '#991b1b' : '#6b7280',
                        textAlign: 'center'
                      }}
                    >
                      {floorsCount.difference > 0 ? '+' : ''}{floorsCount.difference} دور
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* 5. تعديل استخدام المشروع بالكامل */}
          <Card className="card-rtl" style={{ borderColor: projectUsageActive ? '#ec4899' : '#e5e7eb' }}>
            <CardHeader className="p-3" style={{ background: projectUsageActive ? 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)' : '#f8fafc' }}>
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                  5️⃣ تعديل استخدام المشروع بالكامل
                </CardTitle>
                <EnhancedSwitch
                  id="project-usage-active"
                  checked={projectUsageActive}
                  onCheckedChange={(checked) => {
                    setProjectUsageActive(checked);
                    setHasChanges(true);
                  }}
                  size="sm"
                  disabled={readOnly}
                />
              </div>
            </CardHeader>
            
            {projectUsageActive && (
              <CardContent className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <SelectWithCopy
                    label="من استخدام *"
                    id="project-usage-from"
                    value={projectUsage.fromUsage}
                    onChange={(value) => {
                      setProjectUsage({ ...projectUsage, fromUsage: value });
                      setHasChanges(true);
                    }}
                    options={USAGE_TYPES}
                    copyable={true}
                    clearable={false}
                  />
                  
                  <SelectWithCopy
                    label="إلى استخدام *"
                    id="project-usage-to"
                    value={projectUsage.toUsage}
                    onChange={(value) => {
                      setProjectUsage({ ...projectUsage, toUsage: value });
                      setHasChanges(true);
                    }}
                    options={USAGE_TYPES}
                    copyable={true}
                    clearable={false}
                  />
                </div>
                
                <SelectWithCopy
                  label="بموجب *"
                  id="project-usage-basis"
                  value={projectUsage.basis}
                  onChange={(value) => {
                    const selected = PROJECT_BASIS.find(b => b.value === value);
                    setProjectUsage({ 
                      ...projectUsage, 
                      basis: value as any,
                      basisAr: selected?.label || ''
                    });
                    setHasChanges(true);
                  }}
                  options={PROJECT_BASIS}
                  copyable={true}
                  clearable={false}
                />
                
                <TextAreaWithCopy
                  label="ملاحظات"
                  id="project-usage-notes"
                  value={projectUsage.notes}
                  onChange={(e) => {
                    setProjectUsage({ ...projectUsage, notes: e.target.value });
                    setHasChanges(true);
                  }}
                  rows={3}
                  copyable={true}
                  clearable={true}
                />
              </CardContent>
            )}
          </Card>

          {/* معلومات إضافية */}
          <Card className="card-rtl" style={{ background: '#eff6ff', borderColor: '#2563eb' }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" style={{ color: '#2563eb' }} />
                <div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#1e40af', fontWeight: 600, marginBottom: '4px' }}>
                    ملاحظة هامة
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a', lineHeight: '1.6' }}>
                    الأغراض التفصيلية تحدد بدقة التعديلات المطلوبة على المشروع. يتم حساب الفروقات تلقائياً. 
                    يرجى التأكد من دقة المعلومات المدخلة حيث سيتم استخدامها في التقارير الفنية والرسومات.
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
