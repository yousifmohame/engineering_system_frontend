/**
 * التاب: الغرض المختصر من الطلب
 * ====================================
 * 
 * يُستخدم في:
 * - الشاشة 286: إنشاء معاملة جديدة
 * - الشاشة 284: معالجة المعاملات
 * 
 * الوظيفة:
 * - اختيار متعدد من 6 أغراض رئيسية
 * - إمكانية اختيار أكثر من غرض واحد
 * - حفظ تلقائي في localStorage
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { CheckSquare, Square, Save, RefreshCw } from 'lucide-react';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

// ==================== الواجهات ====================

interface BriefPurpose {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  isSelected: boolean;
  color: string;
  icon: string;
}

interface TabProps {
  transactionId?: string;
  onSave?: (purposes: BriefPurpose[]) => void;
  readOnly?: boolean;
}

// ==================== البيانات الافتراضية ====================

const DEFAULT_PURPOSES: BriefPurpose[] = [
  {
    id: 'issuance',
    name: 'إصدار',
    nameEn: 'Issuance',
    description: 'إصدار رخصة أو تصريح جديد',
    isSelected: false,
    color: '#2563eb',
    icon: '📋'
  },
  {
    id: 'modify-components',
    name: 'تعديل مكونات',
    nameEn: 'Modify Components',
    description: 'تعديل المكونات الموجودة في الرخصة الحالية',
    isSelected: false,
    color: '#f59e0b',
    icon: '🔧'
  },
  {
    id: 'add-components',
    name: 'إضافة مكونات',
    nameEn: 'Add Components',
    description: 'إضافة مكونات جديدة للرخصة الحالية',
    isSelected: false,
    color: '#10b981',
    icon: '➕'
  },
  {
    id: 'renewal-only',
    name: 'تجديد فقط',
    nameEn: 'Renewal Only',
    description: 'تجديد الرخصة بدون أي تعديلات',
    isSelected: false,
    color: '#8b5cf6',
    icon: '🔄'
  },
  {
    id: 'renewal-modify',
    name: 'تجديد وتعديل مكونات',
    nameEn: 'Renewal & Modify',
    description: 'تجديد الرخصة مع تعديل المكونات',
    isSelected: false,
    color: '#ec4899',
    icon: '🔄🔧'
  },
  {
    id: 'correction',
    name: 'تصحيح وضع مبنى قائم',
    nameEn: 'Building Status Correction',
    description: 'تصحيح وضع مبنى موجود وفق الأنظمة',
    isSelected: false,
    color: '#ef4444',
    icon: '🏗️'
  }
];

// ==================== المكون الرئيسي ====================

const Tab_RequestPurpose_Brief_Complete: React.FC<TabProps> = ({
  transactionId = 'NEW',
  onSave,
  readOnly = false
}) => {
  const [purposes, setPurposes] = useState<BriefPurpose[]>(DEFAULT_PURPOSES);
  const [hasChanges, setHasChanges] = useState(false);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`request_purpose_brief_${transactionId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPurposes(parsed);
      } catch (error) {
        console.error('Error loading saved purposes:', error);
      }
    }
  }, [transactionId]);

  // حفظ البيانات
  const handleSave = () => {
    localStorage.setItem(`request_purpose_brief_${transactionId}`, JSON.stringify(purposes));
    setHasChanges(false);
    if (onSave) {
      onSave(purposes);
    }
    alert('تم حفظ الأغراض المختصرة بنجاح!');
  };

  // تبديل اختيار غرض
  const togglePurpose = (id: string) => {
    if (readOnly) return;
    
    setPurposes(purposes.map(p => 
      p.id === id ? { ...p, isSelected: !p.isSelected } : p
    ));
    setHasChanges(true);
  };

  // إعادة تعيين
  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الأغراض؟')) {
      setPurposes(DEFAULT_PURPOSES);
      setHasChanges(true);
    }
  };

  // حساب الأغراض المختارة
  const selectedCount = purposes.filter(p => p.isSelected).length;

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', height: '100%' }}>
      <CodeDisplay code="TAB-PURPOSE-BRIEF" position="top-right" />
      
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
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: '10px'
                    }}
                  >
                    <CheckSquare className="h-5 w-5" style={{ color: '#2563eb' }} />
                  </div>
                  
                  <div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                      الأغراض المختصرة من الطلب
                    </h3>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                      تم اختيار {selectedCount} من {purposes.length} غرض
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
                    <>
                      <Button onClick={handleReset} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 ml-1" />
                        إعادة تعيين
                      </Button>
                      <Button onClick={handleSave} size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <Save className="h-4 w-4 ml-1" />
                        حفظ
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* قائمة الأغراض */}
          <div className="grid grid-cols-2 gap-3">
            {purposes.map((purpose) => (
              <Card
                key={purpose.id}
                className="card-rtl cursor-pointer hover:shadow-lg transition-all"
                onClick={() => togglePurpose(purpose.id)}
                style={{
                  border: purpose.isSelected ? `2px solid ${purpose.color}` : '2px solid #e5e7eb',
                  background: purpose.isSelected 
                    ? `linear-gradient(135deg, ${purpose.color}15 0%, ${purpose.color}05 100%)` 
                    : '#ffffff',
                  opacity: readOnly && !purpose.isSelected ? 0.5 : 1,
                  cursor: readOnly ? 'default' : 'pointer'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: '24px' }}>{purpose.icon}</span>
                        <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                          {purpose.name}
                        </h4>
                      </div>
                      
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', lineHeight: '1.6', marginBottom: '8px' }}>
                        {purpose.description}
                      </p>
                      
                      <Badge 
                        variant="outline" 
                        style={{ 
                          fontSize: '10px', 
                          fontFamily: 'Courier New, monospace',
                          color: purpose.color,
                          borderColor: purpose.color
                        }}
                      >
                        {purpose.nameEn}
                      </Badge>
                    </div>
                    
                    <div>
                      {purpose.isSelected ? (
                        <CheckSquare 
                          className="h-6 w-6" 
                          style={{ color: purpose.color }} 
                        />
                      ) : (
                        <Square 
                          className="h-6 w-6" 
                          style={{ color: '#d1d5db' }} 
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ملخص الأغراض المختارة */}
          {selectedCount > 0 && (
            <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' }}>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#1e40af' }}>
                  ملخص الأغراض المختارة ({selectedCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {purposes.filter(p => p.isSelected).map((purpose) => (
                    <Badge
                      key={purpose.id}
                      style={{
                        background: purpose.color,
                        color: '#ffffff',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      {purpose.icon} {purpose.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* معلومات إضافية */}
          <Card className="card-rtl" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <span style={{ fontSize: '16px' }}>💡</span>
                <div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#92400e', fontWeight: 600, marginBottom: '4px' }}>
                    ملاحظة هامة
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#78350f', lineHeight: '1.6' }}>
                    يمكنك اختيار أكثر من غرض واحد. الأغراض المختارة ستحدد المتطلبات والإجراءات اللازمة للمعاملة. 
                    تأكد من اختيار جميع الأغراض التي تنطبق على طلبك.
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

export default Tab_RequestPurpose_Brief_Complete;
