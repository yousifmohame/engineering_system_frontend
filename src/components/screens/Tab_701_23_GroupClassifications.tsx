/**
 * تاب 701-23 - تصنيفات الأقسام (مجموعات التابات)
 * ==================================================
 * 
 * المميزات:
 * ✅ تخصيص كل تاب لمجموعة أو أكثر
 * ✅ 4 مجموعات: إجراءات، معلومات، مستندات، أخرى
 * ✅ إمكانية اختيار multiple groups لكل تاب
 * ✅ حفظ في localStorage
 * ✅ واجهة سهلة الاستخدام
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Save, AlertCircle, PlayCircle, Info, FileText, MoreHorizontal, Tag } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface TabMapping {
  tabId: string;
  tabNumber: string;
  tabName: string;
  groups: string[]; // المجموعات التي ينتمي لها
}

const GROUPS = [
  { id: 'actions', name: 'إجراءات', icon: PlayCircle, color: '#10b981' },
  { id: 'info', name: 'معلومات', icon: Info, color: '#3b82f6' },
  { id: 'documents', name: 'مستندات', icon: FileText, color: '#f59e0b' },
  { id: 'other', name: 'أخرى', icon: MoreHorizontal, color: '#8b5cf6' }
];

// قائمة تابات شاشة 284 (المثال)
const SCREEN_284_TABS = [
  { id: '284-01', number: '284-01', title: 'معلومات عامة' },
  { id: '284-02', number: '284-02', title: 'الإشعارات والتنبيهات' },
  { id: '284-03', number: '284-03', title: 'بيانات المالك' },
  { id: '284-04', number: '284-04', title: 'بيانات الملكية' },
  { id: '284-05', number: '284-05', title: 'بيانات مقدم الطلب' },
  { id: '284-06', number: '284-06', title: 'الموقع الجغرافي' },
  { id: '284-06B', number: '284-06B', title: 'الغرض المختصر من الطلب' },
  { id: '284-06C', number: '284-06C', title: 'الغرض التفصيلي من الطلب' },
  { id: '284-07', number: '284-07', title: 'طلبات المالك' },
  { id: '284-08', number: '284-08', title: 'وثائق مستلمة من المالك' },
  { id: '284-09', number: '284-09', title: 'التحقق' },
  { id: '284-10', number: '284-10', title: 'طلبات المكتب' },
  { id: '284-11', number: '284-11', title: 'عرض السعر' },
  { id: '284-12', number: '284-12', title: 'العقد' },
  { id: '284-13', number: '284-13', title: 'المدفوعات' },
  { id: '284-14', number: '284-14', title: 'مستحقات وفواتير' },
  { id: '284-15', number: '284-15', title: 'مستندات السداد' },
  { id: '284-16', number: '284-16', title: 'صور فواتير الجهات' },
  { id: '284-17', number: '284-17', title: 'طلبات الجهات' },
  { id: '284-18', number: '284-18', title: 'ملاحظات الجهات' },
  { id: '284-19', number: '284-19', title: 'متطلبات النظام' },
  { id: '284-20', number: '284-20', title: 'مراسلات' },
  { id: '284-21', number: '284-21', title: 'تعهدات المكتب' },
  { id: '284-22', number: '284-22', title: 'تعهدات المالك' },
  { id: '284-23', number: '284-23', title: 'خطابات المكتب للجهات' },
  { id: '284-24', number: '284-24', title: 'خطابات المكتب للمالك' },
  { id: '284-25', number: '284-25', title: 'ملفات تسليم للجهات' },
  { id: '284-26', number: '284-26', title: 'ملفات تسليم للمالك' },
  { id: '284-27', number: '284-27', title: 'المهام' },
  { id: '284-28', number: '284-28', title: 'جدول زمني للإنجاز' },
  { id: '284-29', number: '284-29', title: 'فريق العمل' },
  { id: '284-30', number: '284-30', title: 'مراسلات داخلية بين فريق العمل' },
  { id: '284-31', number: '284-31', title: 'التقارير' },
  { id: '284-32', number: '284-32', title: 'النزاعات' },
  { id: '284-33', number: '284-33', title: 'ربط بمعاملة أخرى' },
  { id: '284-34', number: '284-34', title: 'موافقات المالك' },
  { id: '284-35', number: '284-35', title: 'زيارات الموقع' },
  { id: '284-36', number: '284-36', title: 'صور من الموقع' },
  { id: '284-37', number: '284-37', title: 'المخالفات المرصودة' },
  { id: '284-38', number: '284-38', title: 'مستحقات سابقة على المالك' },
  { id: '284-39', number: '284-39', title: 'وثائق إنهاء المعاملة' },
  { id: '284-40', number: '284-40', title: 'مسميات وعدد الأدوار' },
  { id: '284-41', number: '284-41', title: 'الارتدادات من الأربع جهات' },
  { id: '284-42', number: '284-42', title: 'المكونات التفصيلية النهائية' },
  { id: '284-43', number: '284-43', title: 'المكونات حسب الرخصة القديمة' },
  { id: '284-44', number: '284-44', title: 'المكونات حسب المقترح' },
  { id: '284-45', number: '284-45', title: 'المكونات حسب القائم' },
  { id: '284-46', number: '284-46', title: 'الحدود والمجاورين' },
  { id: '284-47', number: '284-47', title: 'مساحة الأرض' }, // ⭐ جديد
];

const Tab_701_23_GroupClassifications: React.FC = () => {
  const [tabMappings, setTabMappings] = useState<Record<string, string[]>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحميل التصنيفات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tab_group_mappings');
    if (saved) {
      try {
        setTabMappings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading mappings:', error);
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
  }, []);

  // تحميل التصنيفات الافتراضية
  const loadDefaults = () => {
    const defaults: Record<string, string[]> = {};
    
    SCREEN_284_TABS.forEach(tab => {
      const tabNumber = parseInt(tab.number.split('-')[1]);
      
      // تصنيف افتراضي ذكي
      if (tabNumber >= 1 && tabNumber <= 10) {
        defaults[tab.id] = ['info']; // معلومات
      } else if (tabNumber >= 11 && tabNumber <= 22) {
        defaults[tab.id] = ['documents']; // مستندات
      } else if (tabNumber >= 23 && tabNumber <= 33) {
        defaults[tab.id] = ['actions']; // إجراءات
      } else {
        defaults[tab.id] = ['other']; // أخرى
      }
    });
    
    setTabMappings(defaults);
  };

  // تبديل مجموعة لتاب
  const toggleGroup = (tabId: string, groupId: string) => {
    setTabMappings(prev => {
      const current = prev[tabId] || [];
      const updated = current.includes(groupId)
        ? current.filter(g => g !== groupId)
        : [...current, groupId];
      
      return { ...prev, [tabId]: updated };
    });
    setHasUnsavedChanges(true);
  };

  // حفظ التصنيفات
  const handleSave = () => {
    localStorage.setItem('tab_group_mappings', JSON.stringify(tabMappings));
    setHasUnsavedChanges(false);
    alert('✅ تم حفظ تصنيفات الأقسام بنجاح!\n\n⚡ ستظهر التغييرات عند إعادة فتح شاشة المعاملات (284).');
  };

  // حساب عدد التابات في كل مجموعة
  const getGroupCount = (groupId: string): number => {
    return Object.values(tabMappings).filter(groups => groups.includes(groupId)).length;
  };

  return (
    <div className="space-y-6">
      {/* بطاقة المعلومات */}
      <Card style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '2px solid #3b82f6'
      }}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                <strong>ملاحظة:</strong> يمكنك تخصيص ظهور كل تاب في أي من المجموعات الأربعة في سايد بار شاشة المعاملات.
              </p>
              <p style={{ fontSize: '12px', color: '#1e40af' }}>
                يمكن للتاب الواحد أن يظهر في أكثر من مجموعة في نفس الوقت.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* بطاقات إحصائيات المجموعات */}
      <div className="grid grid-cols-4 gap-4">
        {GROUPS.map(group => {
          const Icon = group.icon;
          const count = getGroupCount(group.id);
          
          return (
            <Card 
              key={group.id}
              style={{
                background: `linear-gradient(135deg, ${group.color}20 0%, ${group.color}40 100%)`,
                border: `2px solid ${group.color}`
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4" style={{ color: group.color }} />
                      <span style={{
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: group.color
                      }}>
                        {group.name}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: group.color
                    }}>
                      {count}
                    </p>
                    <p style={{
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: '11px',
                      color: group.color
                    }}>
                      تبويب
                    </p>
                  </div>
                  <Tag className="h-8 w-8" style={{ color: group.color, opacity: 0.3 }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <Save className="h-4 w-4 ml-1" />
                حفظ الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* جدول التصنيفات */}
      <Card className="card-rtl">
        <CardHeader style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          borderBottom: '2px solid #a855f7'
        }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            تصنيفات التابات ({SCREEN_284_TABS.length} تبويب)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                    الرقم
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اسم التاب
                  </TableHead>
                  {GROUPS.map(group => {
                    const Icon = group.icon;
                    return (
                      <TableHead key={group.id} className="text-center" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                        <div className="flex items-center justify-center gap-2">
                          <Icon className="h-4 w-4" style={{ color: group.color }} />
                          <span>{group.name}</span>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {SCREEN_284_TABS.map(tab => {
                  const groups = tabMappings[tab.id] || [];
                  
                  return (
                    <TableRow key={tab.id}>
                      <TableCell className="text-right">
                        <Badge style={{
                          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                          color: 'white',
                          fontFamily: 'monospace',
                          fontSize: '11px'
                        }}>
                          {tab.number}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                          {tab.title}
                        </span>
                      </TableCell>
                      
                      {GROUPS.map(group => (
                        <TableCell key={group.id} className="text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={groups.includes(group.id)}
                              onCheckedChange={() => toggleGroup(tab.id, group.id)}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderColor: group.color,
                                borderWidth: '2px'
                              }}
                            />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* زر الحفظ */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={() => loadDefaults()}
          variant="outline"
          style={{
            borderColor: '#9ca3af',
            color: '#6b7280'
          }}
        >
          إعادة تعيين للافتراضي
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          style={{
            background: hasUnsavedChanges
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
          }}
        >
          <Save className="h-4 w-4 ml-2" />
          حفظ التصنيفات
        </Button>
      </div>
    </div>
  );
};

export default Tab_701_23_GroupClassifications;
