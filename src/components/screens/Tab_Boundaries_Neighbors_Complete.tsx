/**
 * تاب الحدود والمجاورين
 * =====================
 * 
 * المميزات:
 * ✅ تحديد المجاورين من الأربع جهات
 * ✅ إضافة صور للمجاورين
 * ✅ معلومات تفصيلية لكل جار
 * ✅ حفظ في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Save, AlertCircle, Compass, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import CodeDisplay from '../CodeDisplay';

interface Neighbor {
  direction: string;        // north, south, east, west
  directionAr: string;      // الشمال، الجنوب، الشرق، الغرب
  name: string;             // اسم المجاور
  type: string;             // نوع المجاور (شارع، أرض، مبنى...)
  width: number;            // العرض (للشوارع)
  description: string;      // وصف إضافي
  images: string[];         // روابط الصور
}

interface BoundariesNeighborsProps {
  transactionId?: string;
  readOnly?: boolean;
}

const neighborTypes = [
  'شارع',
  'أرض فضاء',
  'مبنى سكني',
  'مبنى تجاري',
  'مبنى حكومي',
  'حديقة',
  'موقف سيارات',
  'أخرى'
];

const Tab_Boundaries_Neighbors_Complete: React.FC<BoundariesNeighborsProps> = ({
  transactionId = 'NEW',
  readOnly = false
}) => {
  const defaultNeighbors: Neighbor[] = [
    { direction: 'north', directionAr: 'الشمال', name: '', type: '', width: 0, description: '', images: [] },
    { direction: 'south', directionAr: 'الجنوب', name: '', type: '', width: 0, description: '', images: [] },
    { direction: 'east', directionAr: 'الشرق', name: '', type: '', width: 0, description: '', images: [] },
    { direction: 'west', directionAr: 'الغرب', name: '', type: '', width: 0, description: '', images: [] }
  ];

  const [neighbors, setNeighbors] = useState<Neighbor[]>(defaultNeighbors);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    const savedData = localStorage.getItem(`boundaries_neighbors_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setNeighbors(parsed);
      } catch (error) {
        console.error('Error loading boundaries data:', error);
      }
    }
  }, [transactionId]);

  // تحديث بيانات المجاور
  const updateNeighbor = (direction: string, field: keyof Neighbor, value: any) => {
    setNeighbors(prev => prev.map(n => {
      if (n.direction === direction) {
        return { ...n, [field]: value };
      }
      return n;
    }));
    setHasUnsavedChanges(true);
  };

  // إضافة صورة
  const addImage = (direction: string) => {
    const imageUrl = prompt('أدخل رابط الصورة:');
    if (imageUrl) {
      setNeighbors(prev => prev.map(n => {
        if (n.direction === direction) {
          return { ...n, images: [...n.images, imageUrl] };
        }
        return n;
      }));
      setHasUnsavedChanges(true);
    }
  };

  // حذف صورة
  const removeImage = (direction: string, index: number) => {
    setNeighbors(prev => prev.map(n => {
      if (n.direction === direction) {
        return { ...n, images: n.images.filter((_, i) => i !== index) };
      }
      return n;
    }));
    setHasUnsavedChanges(true);
  };

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`boundaries_neighbors_${transactionId}`, JSON.stringify(neighbors));
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ الحدود والمجاورين بنجاح!');
  };

  // الألوان لكل جهة
  const directionColors = {
    north: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' },
    south: { bg: '#d1fae5', border: '#10b981', text: '#065f46', gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' },
    east: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
    west: { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8', gradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-BOUNDARIES-NEIGHBORS" position="top-right" />
      
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
                    <strong>ملاحظة:</strong> حدد معلومات المجاورين من الأربع جهات (الشمال، الجنوب، الشرق، الغرب).
                  </p>
                  <p style={{ fontSize: '12px', color: '#1e40af' }}>
                    يمكنك إضافة صور توضيحية لكل جهة عن طريق رفع روابط الصور.
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

          {/* بطاقات المجاورين */}
          <div className="grid grid-cols-2 gap-4">
            {neighbors.map((neighbor) => {
              const colors = directionColors[neighbor.direction as keyof typeof directionColors];
              
              return (
                <Card key={neighbor.direction} className="card-rtl" style={{
                  background: colors.gradient,
                  border: `2px solid ${colors.border}`
                }}>
                  <CardHeader style={{
                    borderBottom: `2px solid ${colors.border}`,
                    paddingBottom: '12px'
                  }}>
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5" style={{ color: colors.border }} />
                      <CardTitle style={{ 
                        fontFamily: 'Tajawal, sans-serif', 
                        fontSize: '16px',
                        color: colors.text
                      }}>
                        {neighbor.directionAr}
                      </CardTitle>
                      <Badge style={{
                        background: colors.border,
                        color: 'white'
                      }}>
                        {neighbor.direction}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {/* اسم المجاور */}
                    <InputWithCopy
                      label="اسم المجاور / الشارع *"
                      id={`name-${neighbor.direction}`}
                      value={neighbor.name}
                      onChange={(e) => updateNeighbor(neighbor.direction, 'name', e.target.value)}
                      placeholder="مثال: شارع الملك فهد، أرض فضاء، مبنى سكني..."
                      disabled={readOnly}
                      copyable={true}
                      clearable={true}
                    />

                    {/* نوع المجاور */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        fontSize: '13px', 
                        fontWeight: 600,
                        color: colors.text
                      }}>
                        نوع المجاور
                      </label>
                      <select
                        value={neighbor.type}
                        onChange={(e) => updateNeighbor(neighbor.direction, 'type', e.target.value)}
                        disabled={readOnly}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `2px solid ${colors.border}`,
                          background: 'white',
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '13px',
                          direction: 'rtl',
                          textAlign: 'right'
                        }}
                      >
                        <option value="">-- اختر النوع --</option>
                        {neighborTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* عرض الشارع (إذا كان النوع شارع) */}
                    {neighbor.type === 'شارع' && (
                      <InputWithCopy
                        label="عرض الشارع (م)"
                        id={`width-${neighbor.direction}`}
                        type="number"
                        value={neighbor.width.toString()}
                        onChange={(e) => updateNeighbor(neighbor.direction, 'width', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        disabled={readOnly}
                        copyable={false}
                        clearable={false}
                      />
                    )}

                    {/* الوصف */}
                    <TextAreaWithCopy
                      label="وصف إضافي (اختياري)"
                      id={`desc-${neighbor.direction}`}
                      value={neighbor.description}
                      onChange={(e) => updateNeighbor(neighbor.direction, 'description', e.target.value)}
                      rows={2}
                      placeholder="أي معلومات إضافية..."
                      disabled={readOnly}
                      copyable={true}
                      clearable={true}
                    />

                    {/* الصور */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label style={{ 
                          fontSize: '13px', 
                          fontWeight: 600,
                          color: colors.text
                        }}>
                          الصور ({neighbor.images.length})
                        </label>
                        <Button
                          size="sm"
                          onClick={() => addImage(neighbor.direction)}
                          disabled={readOnly}
                          style={{
                            background: `linear-gradient(135deg, ${colors.border} 0%, ${colors.text} 100%)`,
                            padding: '4px 8px',
                            fontSize: '11px'
                          }}
                        >
                          <Upload className="h-3 w-3 ml-1" />
                          إضافة صورة
                        </Button>
                      </div>

                      {neighbor.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {neighbor.images.map((img, index) => (
                            <div 
                              key={index} 
                              className="relative group"
                              style={{
                                borderRadius: '6px',
                                overflow: 'hidden',
                                border: `2px solid ${colors.border}`,
                                background: 'white'
                              }}
                            >
                              <img 
                                src={img} 
                                alt={`${neighbor.directionAr} ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                                }}
                              />
                              {!readOnly && (
                                <button
                                  onClick={() => removeImage(neighbor.direction, index)}
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                  }}
                                  className="group-hover:opacity-100"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div 
                          style={{
                            padding: '20px',
                            textAlign: 'center',
                            background: 'white',
                            borderRadius: '6px',
                            border: `2px dashed ${colors.border}`
                          }}
                        >
                          <ImageIcon className="h-8 w-8 mx-auto mb-2" style={{ color: colors.border, opacity: 0.5 }} />
                          <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                            لا توجد صور
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

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
              حفظ الحدود والمجاورين
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_Boundaries_Neighbors_Complete;
