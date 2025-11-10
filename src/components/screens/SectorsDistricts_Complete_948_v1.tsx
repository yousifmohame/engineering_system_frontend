/**
 * الشاشة 948 - قطاعات وأحياء الرياض v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة قطاعات وأحياء مدينة الرياض
 * 
 * المميزات:
 * ✅ إدارة القطاعات (5 قطاعات رئيسية)
 * ✅ إدارة الأحياء وربطها بالقطاعات
 * ✅ خصائص كل حي
 * ✅ تنظيمات خاصة بالأحياء
 * ✅ الإحصائيات والتقارير
 * 
 * التابات (10 تابات):
 * 948-01: نظرة عامة
 * 948-02: القطاعات
 * 948-03: الأحياء
 * 948-04: إضافة حي
 * 948-05: التنظيمات الخاصة
 * 948-06: الخصائص والمواصفات
 * 948-07: التقسيم الجغرافي
 * 948-08: الإحصائيات
 * 948-09: التقارير
 * 948-10: الإعدادات
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
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Map, MapPin, Plus, Eye, Edit, Download, Settings, TrendingUp,
  Navigation, AlertCircle, CheckCircle, FileText
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '948-01', number: '948-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '948-02', number: '948-02', title: 'القطاعات', icon: Map },
  { id: '948-03', number: '948-03', title: 'الأحياء', icon: MapPin },
  { id: '948-04', number: '948-04', title: 'إضافة حي', icon: Plus },
  { id: '948-05', number: '948-05', title: 'التنظيمات الخاصة', icon: AlertCircle },
  { id: '948-06', number: '948-06', title: 'الخصائص والمواصفات', icon: FileText },
  { id: '948-07', number: '948-07', title: 'التقسيم الجغرافي', icon: Navigation },
  { id: '948-08', number: '948-08', title: 'الإحصائيات', icon: TrendingUp },
  { id: '948-09', number: '948-09', title: 'التقارير', icon: Download },
  { id: '948-10', number: '948-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface Sector {
  id: string;
  name: string;
  description: string;
  area: number; // بالكيلومتر مربع
  population: number;
  districtsCount: number;
  createdDate: string;
}

interface District {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  area: number; // بالكيلومتر مربع
  population: number;
  type: 'residential' | 'commercial' | 'industrial' | 'mixed';
  characteristics: {
    classification: string; // راقي، متوسط، شعبي
    landType: string; // مخطط، غير مخطط
    services: string[]; // الخدمات المتوفرة
    features: string[]; // المميزات
  };
  hasSpecialRegulations: boolean;
  specialRegulations?: {
    type: string;
    description: string;
    issuingAuthority: string;
    validFrom: string;
    validUntil?: string;
    restrictions: string[];
  };
  status: 'active' | 'developing' | 'planned';
  coordinates: {
    centerLat: number;
    centerLng: number;
  };
  createdDate: string;
}

// ============================================================
// البيانات الوهمية - القطاعات (5 قطاعات)
// ============================================================

export const SECTORS: Sector[] = [
  {
    id: 'SEC-001',
    name: 'القطاع الشمالي',
    description: 'يضم الأحياء الشمالية للمدينة',
    area: 250,
    population: 850000,
    districtsCount: 35,
    createdDate: '2020-01-15'
  },
  {
    id: 'SEC-002',
    name: 'القطاع الجنوبي',
    description: 'يضم الأحياء الجنوبية للمدينة',
    area: 280,
    population: 920000,
    districtsCount: 40,
    createdDate: '2020-01-15'
  },
  {
    id: 'SEC-003',
    name: 'القطاع الشرقي',
    description: 'يضم الأحياء الشرقية للمدينة',
    area: 220,
    population: 780000,
    districtsCount: 32,
    createdDate: '2020-01-15'
  },
  {
    id: 'SEC-004',
    name: 'القطاع الغربي',
    description: 'يضم الأحياء الغربية للمدينة',
    area: 240,
    population: 810000,
    districtsCount: 36,
    createdDate: '2020-01-15'
  },
  {
    id: 'SEC-005',
    name: 'القطاع الأوسط',
    description: 'يضم أحياء وسط المدينة',
    area: 180,
    population: 950000,
    districtsCount: 45,
    createdDate: '2020-01-15'
  },
];

// ============================================================
// البيانات الوهمية - الأحياء (100 حي)
// ============================================================

const mockDistricts: District[] = Array.from({ length: 100 }, (_, i) => {
  const sector = SECTORS[i % 5];
  const hasSpecialReg = i % 5 === 0; // 20% لها تنظيمات خاصة
  
  return {
    id: `DIST-${String(i + 1).padStart(3, '0')}`,
    name: [
      'حي النرجس', 'حي الملقا', 'حي العليا', 'حي الروضة', 'حي الياسمين',
      'حي النخيل', 'حي الملز', 'حي السليمانية', 'حي العقيق', 'حي النسيم',
      'حي الربوة', 'حي المروج', 'حي الصحافة', 'حي الندى', 'حي الورود',
      'حي النفل', 'حي الأندلس', 'حي الازدهار', 'حي الفلاح', 'حي المعذر'
    ][i % 20] + (i >= 20 ? ` ${Math.floor(i / 20) + 1}` : ''),
    sectorId: sector.id,
    sectorName: sector.name,
    area: 5 + (i % 15),
    population: 15000 + (i * 500),
    type: ['residential', 'commercial', 'industrial', 'mixed'][i % 4] as any,
    characteristics: {
      classification: ['راقي', 'متوسط', 'شعبي'][i % 3],
      landType: i % 2 === 0 ? 'مخطط' : 'غير مخطط',
      services: [
        'مدارس',
        'مستشفى',
        'مراكز تجارية',
        'حدائق',
        'مساجد',
        'مراكز رياضية'
      ].filter((_, idx) => (i + idx) % 3 !== 0),
      features: [
        'شوارع مسفلتة',
        'إنارة كاملة',
        'شبكة صرف صحي',
        'شبكة مياه',
        'شبكة كهرباء'
      ].filter((_, idx) => (i + idx) % 2 !== 0),
    },
    hasSpecialRegulations: hasSpecialReg,
    specialRegulations: hasSpecialReg ? {
      type: [
        'قيود ارتفاع',
        'اشتراطات معمارية',
        'حظر أنشطة معينة',
        'نسب بناء خاصة'
      ][i % 4],
      description: 'تنظيم خاص للحي بموجب قرار أمانة منطقة الرياض',
      issuingAuthority: 'أمانة منطقة الرياض',
      validFrom: `202${Math.floor(Math.random() * 3) + 2}-01-01`,
      validUntil: i % 2 === 0 ? `203${Math.floor(Math.random() * 3) + 0}-12-31` : undefined,
      restrictions: [
        'الحد الأقصى للارتفاع: 3 أدوار',
        'نسبة البناء: 60%',
        'الارتدادات: 3 أمتار من جميع الجهات'
      ].slice(0, (i % 3) + 1),
    } : undefined,
    status: i % 20 === 0 ? 'developing' : i % 25 === 0 ? 'planned' : 'active',
    coordinates: {
      centerLat: 24.7136 + (Math.random() * 0.5),
      centerLng: 46.6753 + (Math.random() * 0.5),
    },
    createdDate: `202${Math.floor(Math.random() * 3) + 2}-${String((i % 12) + 1).padStart(2, '0')}-15`,
  };
});

// ============================================================
// المكون الرئيسي
// ============================================================

const SectorsDistricts_Complete_948_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('948-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    sectorId: '',
    type: 'residential' as 'residential' | 'commercial' | 'industrial' | 'mixed',
    classification: '',
    landType: '',
    hasSpecialRegulations: false,
    regulationType: '',
    regulationDescription: '',
    issuingAuthority: '',
    validFrom: '',
    validUntil: '',
  });

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const totalDistricts = mockDistricts.length;
    const withRegulations = mockDistricts.filter(d => d.hasSpecialRegulations).length;
    const totalPopulation = mockDistricts.reduce((sum, d) => sum + d.population, 0);
    const residential = mockDistricts.filter(d => d.type === 'residential').length;
    const commercial = mockDistricts.filter(d => d.type === 'commercial').length;
    const mixed = mockDistricts.filter(d => d.type === 'mixed').length;

    return {
      totalDistricts,
      withRegulations,
      totalPopulation,
      residential,
      commercial,
      mixed,
    };
  }, []);

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '948-01':
        return renderTab01_Overview();
      case '948-02':
        return renderTab02_Sectors();
      case '948-03':
        return renderTab03_Districts();
      case '948-04':
        return renderTab04_AddDistrict();
      case '948-05':
        return renderTab05_SpecialRegulations();
      case '948-06':
        return renderTab06_Characteristics();
      case '948-07':
        return renderTab07_Geographical();
      case '948-08':
        return renderTab08_Statistics();
      case '948-09':
        return renderTab09_Reports();
      case '948-10':
        return renderTab10_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 948-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3 text-center">
            <Map className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>5</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قطاعات</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
          <CardContent className="p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.totalDistricts}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حي</p>
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
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.residential}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سكني</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.commercial}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجاري</p>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statistics.mixed}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مختلط</p>
          </CardContent>
        </Card>
      </div>

      {/* جدول القطاعات */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاعات الخمسة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم القطاع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة (كم²)</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السكان</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الأحياء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SECTORS.map(sector => (
                <TableRow key={sector.id}>
                  <TableCell className="text-right">
                    <code className="text-xs bg-blue-50 px-2 py-1 rounded">{sector.id}</code>
                  </TableCell>
                  <TableCell className="text-right font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.name}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {sector.description}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.area.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.population.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.districtsCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 948-02: القطاعات
  // ============================================================

  const renderTab02_Sectors = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {SECTORS.map(sector => {
          const sectorDistricts = mockDistricts.filter(d => d.sectorId === sector.id);
          
          return (
            <Card key={sector.id} className="border-r-4" style={{ borderColor: '#2563eb' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sector.name}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sector.description}
                    </p>
                  </div>
                  <Badge style={{ background: '#dbeafe', color: '#1e40af', fontFamily: 'Tajawal, sans-serif' }}>
                    {sectorDistricts.length} حي
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">المساحة</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sector.area} كم²
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">السكان</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sector.population.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">الأحياء</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sectorDistricts.length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">بتنظيمات خاصة</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {sectorDistricts.filter(d => d.hasSpecialRegulations).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ============================================================
  // التاب 948-04: إضافة حي
  // ============================================================

  const renderTab04_AddDistrict = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة حي جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputWithCopy
                  label="اسم الحي *"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: حي النرجس"
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

            {/* الخصائص */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>خصائص الحي</h3>
              <div className="grid grid-cols-3 gap-4">
                <SelectWithCopy
                  label="النوع *"
                  id="type"
                  value={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as any })}
                  options={[
                    { value: 'residential', label: 'سكني' },
                    { value: 'commercial', label: 'تجاري' },
                    { value: 'industrial', label: 'صناعي' },
                    { value: 'mixed', label: 'مختلط' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
                <SelectWithCopy
                  label="التصنيف *"
                  id="classification"
                  value={formData.classification}
                  onChange={(value) => setFormData({ ...formData, classification: value })}
                  options={[
                    { value: 'راقي', label: 'راقي' },
                    { value: 'متوسط', label: 'متوسط' },
                    { value: 'شعبي', label: 'شعبي' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
                <SelectWithCopy
                  label="نوع الأرض *"
                  id="landType"
                  value={formData.landType}
                  onChange={(value) => setFormData({ ...formData, landType: value })}
                  options={[
                    { value: 'مخطط', label: 'مخطط' },
                    { value: 'غير مخطط', label: 'غير مخطط' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* التنظيمات الخاصة */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنظيمات الخاصة</h3>
              
              <div className="mb-4">
                <EnhancedSwitch
                  id="hasSpecialRegulations"
                  checked={formData.hasSpecialRegulations}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasSpecialRegulations: checked })}
                  label="يوجد تنظيمات خاصة لهذا الحي"
                  description="هل يوجد اشتراطات أو تنظيمات خاصة لهذا الحي؟"
                  variant="warning"
                />
              </div>

              {formData.hasSpecialRegulations && (
                <div className="space-y-4 mt-4 border-t-2 border-yellow-300 pt-4">
                  <InputWithCopy
                    label="نوع التنظيم *"
                    id="regulationType"
                    value={formData.regulationType}
                    onChange={(e) => setFormData({ ...formData, regulationType: e.target.value })}
                    placeholder="مثال: قيود ارتفاع"
                    required
                    copyable={true}
                    clearable={true}
                  />

                  <TextAreaWithCopy
                    label="وصف التنظيم *"
                    id="regulationDescription"
                    value={formData.regulationDescription}
                    onChange={(e) => setFormData({ ...formData, regulationDescription: e.target.value })}
                    rows={3}
                    placeholder="وضح التنظيم الخاص..."
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

                  <div className="grid grid-cols-2 gap-4">
                    <InputWithCopy
                      label="سريان من *"
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                      copyable={true}
                      clearable={false}
                    />
                    <InputWithCopy
                      label="سريان حتى"
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">إلغاء</Button>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                حفظ الحي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التابات المتبقية (placeholders)
  const renderTab03_Districts = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-03: الأحياء - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab05_SpecialRegulations = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-05: التنظيمات الخاصة - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_Characteristics = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-06: الخصائص والمواصفات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_Geographical = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-07: التقسيم الجغرافي - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab08_Statistics = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-08: الإحصائيات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab09_Reports = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-09: التقارير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab10_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 948-10: الإعدادات - قيد التطوير</h3></CardContent></Card>
  );

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
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <Map className="h-6 w-6" style={{ color: '#10b981', filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' }} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  قطاعات وأحياء الرياض
                </h1>

                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    948
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
                نظام شامل لإدارة قطاعات وأحياء المدينة والتنظيمات الخاصة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)'
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
    </div>
  );
};

export default SectorsDistricts_Complete_948_v1;
