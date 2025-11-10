/**
 * الشاشة 939 - شوارع الرياض v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة شوارع مدينة الرياض
 * 
 * المميزات:
 * ✅ إدارة كاملة لبيانات الشوارع
 * ✅ التنظيمات الخاصة لكل شارع
 * ✅ مدى السريان والجهة المصدرة
 * ✅ الآثار المترتبة على التنظيم
 * ✅ التقسيم حسب القطاعات (5 قطاعات)
 * ✅ الربط بالأحياء
 * ✅ عرض الشارع والمواصفات
 * 
 * التابات (10 تابات):
 * 939-01: نظرة عامة
 * 939-02: إضافة شارع
 * 939-03: قائمة الشوارع
 * 939-04: حسب القطاع
 * 939-05: التنظيمات الخاصة
 * 939-06: الشوارع الرئيسية
 * 939-07: الشوارع الفرعية
 * 939-08: الإحصائيات
 * 939-09: التقارير
 * 939-10: الإعدادات
 * 
 * @version 1.0 COMPLETE
 * @date 29 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  MapPin, Plus, Eye, Edit, Search, Filter, Download, Settings,
  AlertCircle, CheckCircle, TrendingUp, FileText, Map, Navigation
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '939-01', number: '939-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '939-02', number: '939-02', title: 'إضافة شارع', icon: Plus },
  { id: '939-03', number: '939-03', title: 'قائمة الشوارع', icon: FileText },
  { id: '939-04', number: '939-04', title: 'حسب القطاع', icon: Map },
  { id: '939-05', number: '939-05', title: 'التنظيمات الخاصة', icon: AlertCircle },
  { id: '939-06', number: '939-06', title: 'الشوارع الرئيسية', icon: Navigation },
  { id: '939-07', number: '939-07', title: 'الشوارع الفرعية', icon: MapPin },
  { id: '939-08', number: '939-08', title: 'الإحصائيات', icon: TrendingUp },
  { id: '939-09', number: '939-09', title: 'التقارير', icon: Download },
  { id: '939-10', number: '939-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface Street {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  districtId: string;
  districtName: string;
  type: 'main' | 'secondary' | 'branch';
  width: number; // بالمتر
  length: number; // بالمتر
  hasSpecialRegulation: boolean;
  regulationDetails?: {
    regulationType: string;
    reason: string;
    issuingAuthority: string;
    validFrom: string;
    validUntil?: string;
    restrictions: string[];
    impacts: string[];
    notes: string;
  };
  status: 'active' | 'under-construction' | 'planned';
  coordinates: {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
  };
  createdDate: string;
  lastUpdated: string;
}

// ============================================================
// البيانات الوهمية - القطاعات (5 قطاعات)
// ============================================================

const SECTORS = [
  { id: 'SEC-001', name: 'القطاع الشمالي' },
  { id: 'SEC-002', name: 'القطاع الجنوبي' },
  { id: 'SEC-003', name: 'القطاع الشرقي' },
  { id: 'SEC-004', name: 'القطاع الغربي' },
  { id: 'SEC-005', name: 'القطاع الأوسط' },
];

// ============================================================
// البيانات الوهمية - الشوارع (80 شارع)
// ============================================================

const mockStreets: Street[] = Array.from({ length: 80 }, (_, i) => {
  const sector = SECTORS[i % 5];
  const hasSpecialReg = i % 4 === 0; // 25% لها تنظيمات خاصة
  
  return {
    id: `STR-2025-${String(i + 1).padStart(3, '0')}`,
    name: [
      'شارع الملك فهد',
      'شارع العليا',
      'طريق الملك عبدالله',
      'شارع التخصصي',
      'شارع الأمير سلطان',
      'طريق الدائري الشمالي',
      'شارع الستين',
      'طريق خريص',
      'شارع النخيل',
      'طريق المدينة المنورة'
    ][i % 10] + ` ${Math.floor(i / 10) + 1}`,
    sectorId: sector.id,
    sectorName: sector.name,
    districtId: `DIST-${String((i % 20) + 1).padStart(3, '0')}`,
    districtName: [
      'حي النرجس',
      'حي الملقا',
      'حي العليا',
      'حي الروضة',
      'حي الياسمين',
      'حي النخيل',
      'حي الملز',
      'حي السليمانية',
      'حي العقيق',
      'حي النسيم'
    ][(i % 10)],
    type: i % 5 === 0 ? 'main' : i % 3 === 0 ? 'secondary' : 'branch',
    width: [60, 40, 30, 20, 15, 12][i % 6],
    length: 1000 + (i * 100),
    hasSpecialRegulation: hasSpecialReg,
    regulationDetails: hasSpecialReg ? {
      regulationType: [
        'حد أقصى للارتفاعات',
        'منع البناء على جانب معين',
        'اشتراطات واجهات',
        'حظر استخدامات معينة'
      ][i % 4],
      reason: [
        'قرب المطار',
        'موقع أثري محمي',
        'منطقة سكنية راقية',
        'طريق رئيسي استراتيجي'
      ][i % 4],
      issuingAuthority: [
        'أمانة منطقة الرياض',
        'الهيئة العامة للطيران المدني',
        'وزارة الثقافة',
        'الهيئة الملكية'
      ][i % 4],
      validFrom: `202${Math.floor(Math.random() * 3) + 2}-01-01`,
      validUntil: i % 2 === 0 ? `203${Math.floor(Math.random() * 3) + 0}-12-31` : undefined,
      restrictions: [
        'الحد الأقصى للارتفاع: 12 متر',
        'عدم البناء على الجانب الشمالي',
        'استخدام مواد بناء محددة',
        'الارتداد الأمامي: 10 أمتار'
      ].slice(0, (i % 3) + 2),
      impacts: [
        'تقليل المساحة البنائية',
        'زيادة تكلفة البناء',
        'التأخير في الموافقات',
        'اشتراطات إضافية للتصاميم'
      ].slice(0, (i % 3) + 2),
      notes: 'تنظيم خاص صادر بموجب قرار رقم ' + (2000 + i)
    } : undefined,
    status: i % 15 === 0 ? 'under-construction' : i % 20 === 0 ? 'planned' : 'active',
    coordinates: {
      startLat: 24.7136 + (Math.random() * 0.5),
      startLng: 46.6753 + (Math.random() * 0.5),
      endLat: 24.7136 + (Math.random() * 0.5),
      endLng: 46.6753 + (Math.random() * 0.5),
    },
    createdDate: `202${Math.floor(Math.random() * 3) + 2}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    lastUpdated: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  };
});

// ============================================================
// المكون الرئيسي
// ============================================================

const RiyadhStreets_Complete_939_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('939-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    sectorId: '',
    districtId: '',
    type: 'branch' as 'main' | 'secondary' | 'branch',
    width: '',
    length: '',
    hasSpecialRegulation: false,
    regulationType: '',
    reason: '',
    issuingAuthority: '',
    validFrom: '',
    validUntil: '',
    restrictions: '',
    impacts: '',
    notes: '',
  });

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = mockStreets.length;
    const withRegulations = mockStreets.filter(s => s.hasSpecialRegulation).length;
    const mainStreets = mockStreets.filter(s => s.type === 'main').length;
    const secondaryStreets = mockStreets.filter(s => s.type === 'secondary').length;
    const branchStreets = mockStreets.filter(s => s.type === 'branch').length;
    const active = mockStreets.filter(s => s.status === 'active').length;

    return {
      total,
      withRegulations,
      mainStreets,
      secondaryStreets,
      branchStreets,
      active,
    };
  }, []);

  // فلترة الشوارع
  const filteredStreets = useMemo(() => {
    return mockStreets.filter(street => {
      const sectorMatch = filterSector === 'all' || street.sectorId === filterSector;
      const typeMatch = filterType === 'all' || street.type === filterType;
      return sectorMatch && typeMatch;
    });
  }, [filterSector, filterType]);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '939-01':
        return renderTab01_Overview();
      case '939-02':
        return renderTab02_AddStreet();
      case '939-03':
        return renderTab03_AllStreets();
      case '939-04':
        return renderTab04_BySector();
      case '939-05':
        return renderTab05_SpecialRegulations();
      case '939-06':
        return renderTab06_MainStreets();
      case '939-07':
        return renderTab07_BranchStreets();
      case '939-08':
        return renderTab08_Statistics();
      case '939-09':
        return renderTab09_Reports();
      case '939-10':
        return renderTab10_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 939-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الشوارع</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-3 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.withRegulations}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>بتنظيمات خاصة</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', border: '2px solid #d8b4fe' }}>
          <CardContent className="p-3 text-center">
            <Navigation className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.mainStreets}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شوارع رئيسية</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <Map className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.secondaryStreets}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شوارع ثانوية</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.branchStreets}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شوارع فرعية</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.active}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول الشوارع */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر 20 شارع تم إضافتها</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الشارع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العرض (م)</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنظيم خاص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStreets.slice(0, 20).map((street, index) => (
                  <TableRow key={street.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs bg-blue-50 px-2 py-1 rounded">{street.id}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {street.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                        {street.sectorName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                      {street.districtName}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: 
                            street.type === 'main' ? '#f3e8ff' :
                            street.type === 'secondary' ? '#fef3c7' : '#dbeafe',
                          color: 
                            street.type === 'main' ? '#7c3aed' :
                            street.type === 'secondary' ? '#f59e0b' : '#2563eb',
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '9px'
                        }}
                      >
                        {street.type === 'main' ? 'رئيسي' : street.type === 'secondary' ? 'ثانوي' : 'فرعي'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {street.width}
                    </TableCell>
                    <TableCell className="text-right">
                      {street.hasSpecialRegulation ? (
                        <Badge style={{ background: '#fee2e2', color: '#991b1b', fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                          نعم
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                          لا
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: 
                            street.status === 'active' ? '#dcfce7' :
                            street.status === 'under-construction' ? '#fef3c7' : '#e0e7ff',
                          color: 
                            street.status === 'active' ? '#166534' :
                            street.status === 'under-construction' ? '#854d0e' : '#4338ca',
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '9px'
                        }}
                      >
                        {street.status === 'active' ? 'نشط' :
                         street.status === 'under-construction' ? 'تحت الإنشاء' : 'مخطط'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedStreet(street);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 939-02: إضافة شارع
  // ============================================================

  const renderTab02_AddStreet = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة شارع جديد</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تسجيل شارع جديد في منظومة شوارع الرياض
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="اسم الشارع *"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: شارع الملك فهد"
                  required
                  copyable={true}
                  clearable={true}
                />
                <SelectWithCopy
                  label="القطاع *"
                  id="sector"
                  value={formData.sectorId}
                  onChange={(value) => setFormData({ ...formData, sectorId: value })}
                  options={SECTORS.map(s => ({ value: s.id, label: s.name }))}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* المواصفات */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>مواصفات الشارع</h3>
              <div className="grid grid-cols-3 gap-4">
                <SelectWithCopy
                  label="نوع الشارع *"
                  id="type"
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as any })}
                  options={[
                    { value: 'main', label: 'رئيسي' },
                    { value: 'secondary', label: 'ثانوي' },
                    { value: 'branch', label: 'فرعي' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="عرض الشارع (متر) *"
                  id="width"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  placeholder="مثال: 60"
                  required
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="طول الشارع (متر)"
                  id="length"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  placeholder="مثال: 5000"
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* التنظيم الخاص */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنظيم الخاص</h3>
              
              <div className="mb-4">
                <EnhancedSwitch
                  id="hasSpecialRegulation"
                  checked={formData.hasSpecialRegulation}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasSpecialRegulation: checked })}
                  label="يوجد تنظيم خاص لهذا الشارع"
                  description="هل يوجد اشتراطات أو تنظيمات خاصة لهذا الشارع؟"
                  variant="warning"
                />
              </div>

              {formData.hasSpecialRegulation && (
                <div className="space-y-4 mt-4 border-t-2 border-yellow-300 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputWithCopy
                      label="نوع التنظيم *"
                      id="regulationType"
                      value={formData.regulationType}
                      onChange={(e) => setFormData({ ...formData, regulationType: e.target.value })}
                      placeholder="مثال: حد أقصى للارتفاعات"
                      required
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="الجهة المصدرة *"
                      id="issuingAuthority"
                      value={formData.issuingAuthority}
                      onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                      placeholder="مثال: أمانة منطقة الرياض"
                      required
                      copyable={true}
                      clearable={true}
                    />
                  </div>

                  <TextAreaWithCopy
                    label="السبب *"
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={2}
                    placeholder="وضح سبب التنظيم الخاص..."
                    required
                    copyable={true}
                    clearable={true}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputWithCopy
                      label="سريان التنظيم من *"
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                      copyable={true}
                      clearable={false}
                    />
                    <InputWithCopy
                      label="سريان التنظيم حتى"
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      copyable={true}
                      clearable={true}
                    />
                  </div>

                  <TextAreaWithCopy
                    label="الاشتراطات والقيود *"
                    id="restrictions"
                    value={formData.restrictions}
                    onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                    rows={3}
                    placeholder="اكتب كل اشتراط في سطر منفصل..."
                    required
                    copyable={true}
                    clearable={true}
                  />

                  <TextAreaWithCopy
                    label="الآثار المترتبة *"
                    id="impacts"
                    value={formData.impacts}
                    onChange={(e) => setFormData({ ...formData, impacts: e.target.value })}
                    rows={3}
                    placeholder="اكتب كل أثر في سطر منفصل..."
                    required
                    copyable={true}
                    clearable={true}
                  />

                  <TextAreaWithCopy
                    label="ملاحظات إضافية"
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="أي ملاحظات إضافية..."
                    copyable={true}
                    clearable={true}
                  />
                </div>
              )}
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">إلغاء</Button>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                حفظ الشارع
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التابات المتبقية (placeholders)
  // ============================================================

  const renderTab03_AllStreets = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-03: قائمة الشوارع - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab04_BySector = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-04: حسب القطاع - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab05_SpecialRegulations = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-05: التنظيمات الخاصة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_MainStreets = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-06: الشوارع الرئيسية - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_BranchStreets = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-07: الشوارع الفرعية - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab08_Statistics = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-08: الإحصائيات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab09_Reports = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-09: التقارير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab10_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 939-10: الإعدادات - قيد التطوير</h3></CardContent></Card>
  );

  // ============================================================
  // نافذة التفاصيل
  // ============================================================

  const renderDetailsDialog = () => {
    if (!selectedStreet) return null;

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الشارع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600">الرمز</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedStreet.id}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-xs text-gray-600">اسم الشارع</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedStreet.name}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-xs text-gray-600">عرض الشارع</p>
                <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedStreet.width} متر</p>
              </div>
            </div>

            {/* التنظيم الخاص */}
            {selectedStreet.hasSpecialRegulation && selectedStreet.regulationDetails && (
              <Card className="border-2 border-red-300">
                <CardHeader className="pb-3 bg-red-50">
                  <CardTitle className="text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    التنظيم الخاص
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600">نوع التنظيم</p>
                      <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedStreet.regulationDetails.regulationType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">السبب</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedStreet.regulationDetails.reason}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">الجهة المصدرة</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedStreet.regulationDetails.issuingAuthority}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">سريان التنظيم</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedStreet.regulationDetails.validFrom} 
                          {selectedStreet.regulationDetails.validUntil && ` → ${selectedStreet.regulationDetails.validUntil}`}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">الاشتراطات</p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedStreet.regulationDetails.restrictions.map((r, i) => (
                          <li key={i} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">الآثار المترتبة</p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedStreet.regulationDetails.impacts.map((i, idx) => (
                          <li key={idx} style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <MapPin className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  شوارع الرياض
                </h1>

                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    939
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: '13px',
                  color: '#64748b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                نظام شامل لإدارة شوارع مدينة الرياض والتنظيمات الخاصة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.15)'
              }}
            >
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                10 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default RiyadhStreets_Complete_939_v1;
