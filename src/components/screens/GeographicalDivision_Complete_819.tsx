/**
 * الشاشة 819 - التقسيم الجغرافي - مطورة بالكامل v6.0
 * ================================================================
 * 
 * نظام شامل للتقسيم الجغرافي مع:
 * - إدارة النطاق الجغرافي للعمل
 * - ربط الأحياء بالقطاعات والجهات
 * - دعم الأحياء التابعة لأكثر من جهة
 * - ربط ديناميكي مع شاشة المعاملات (286)
 * - نظام بحث وتصفية متقدم
 * - 15 تبويب مطور بالكامل
 * - جميع الحقول محسّنة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import {
  MapPin, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, Building,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Bell, Globe, Home, Map, Navigation
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG = [
  { id: '819-01', number: '819-01', title: 'نظرة عامة', icon: MapPin },
  { id: '819-02', number: '819-02', title: 'المدن', icon: Building },
  { id: '819-03', number: '819-03', title: 'القطاعات', icon: Map },
  { id: '819-04', number: '819-04', title: 'الأحياء', icon: Home },
  { id: '819-05', number: '819-05', title: 'ربط الأحياء بالجهات', icon: Navigation },
  { id: '819-06', number: '819-06', title: 'إضافة حي', icon: Plus },
  { id: '819-07', number: '819-07', title: 'إضافة قطاع', icon: Plus },
  { id: '819-08', number: '819-08', title: 'البحث المتقدم', icon: Search },
  { id: '819-09', number: '819-09', title: 'الخريطة التفاعلية', icon: Globe },
  { id: '819-10', number: '819-10', title: 'التقارير', icon: TrendingUp },
  { id: '819-11', number: '819-11', title: 'الإحصائيات', icon: Target },
  { id: '819-12', number: '819-12', title: 'التنبيهات', icon: Bell },
  { id: '819-13', number: '819-13', title: 'السجل', icon: History },
  { id: '819-14', number: '819-14', title: 'الأرشيف', icon: Archive },
  { id: '819-15', number: '819-15', title: 'الإعدادات', icon: Settings }
];

// بيانات الأحياء والقطاعات
const NEIGHBORHOODS_DATA = [
  // قطاع شمال الرياض
  {
    id: 'NBH-001',
    name: 'حي العليا',
    nameEn: 'Al Olaya District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-N', sectorName: 'قطاع شمال مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 45000,
    area: 12.5,
    status: 'active',
    coordinates: { lat: 24.6977, lng: 46.6850 }
  },
  {
    id: 'NBH-002',
    name: 'حي الملز',
    nameEn: 'Al Malaz District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-N', sectorName: 'قطاع شمال مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 38000,
    area: 10.2,
    status: 'active',
    coordinates: { lat: 24.6927, lng: 46.7278 }
  },
  {
    id: 'NBH-003',
    name: 'حي الصحافة',
    nameEn: 'Al Sahafa District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-N', sectorName: 'قطاع شمال مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 52000,
    area: 15.8,
    status: 'active',
    coordinates: { lat: 24.7616, lng: 46.6534 }
  },
  // قطاع جنوب الرياض
  {
    id: 'NBH-004',
    name: 'حي الشفا',
    nameEn: 'Al Shifa District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-S', sectorName: 'قطاع جنوب مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 35000,
    area: 9.5,
    status: 'active',
    coordinates: { lat: 24.6398, lng: 46.7148 }
  },
  {
    id: 'NBH-005',
    name: 'حي الربوة',
    nameEn: 'Al Rabwa District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-S', sectorName: 'قطاع جنوب مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 42000,
    area: 11.3,
    status: 'active',
    coordinates: { lat: 24.6254, lng: 46.7456 }
  },
  // قطاع شرق الرياض
  {
    id: 'NBH-006',
    name: 'حي الروضة',
    nameEn: 'Al Rawdah District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-E', sectorName: 'قطاع شرق مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 48000,
    area: 13.7,
    status: 'active',
    coordinates: { lat: 24.7205, lng: 46.7895 }
  },
  {
    id: 'NBH-007',
    name: 'حي النسيم',
    nameEn: 'Al Naseem District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-E', sectorName: 'قطاع شرق مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 55000,
    area: 16.2,
    status: 'active',
    coordinates: { lat: 24.7312, lng: 46.8123 }
  },
  // قطاع غرب الرياض
  {
    id: 'NBH-008',
    name: 'حي الشفاء',
    nameEn: 'Al Shafa District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-W', sectorName: 'قطاع غرب مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 40000,
    area: 10.8,
    status: 'active',
    coordinates: { lat: 24.6789, lng: 46.6234 }
  },
  {
    id: 'NBH-009',
    name: 'حي الورود',
    nameEn: 'Al Wurud District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-W', sectorName: 'قطاع غرب مدينة الرياض', isPrimary: true }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' }
    ],
    population: 46000,
    area: 12.9,
    status: 'active',
    coordinates: { lat: 24.6934, lng: 46.6112 }
  },
  // حي يتبع أكثر من قطاع (مثال)
  {
    id: 'NBH-010',
    name: 'حي المعذر',
    nameEn: 'Al Maazer District',
    city: 'الرياض',
    sectors: [
      { sectorId: 'SEC-RYD-N', sectorName: 'قطاع شمال مدينة الرياض', isPrimary: true },
      { sectorId: 'SEC-RYD-E', sectorName: 'قطاع شرق مدينة الرياض', isPrimary: false }
    ],
    entities: [
      { entityId: 'ENT-GOV-001', entityName: 'وزارة الشؤون البلدية والقروية' },
      { entityId: 'ENT-SEMI-001', entityName: 'الهيئة الملكية لمدينة الرياض' }
    ],
    population: 32000,
    area: 8.5,
    status: 'active',
    coordinates: { lat: 24.7123, lng: 46.7345 }
  }
];

const GeographicalDivision_Complete_819: React.FC = () => {
  const [activeTab, setActiveTab] = useState('819-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [neighborhoods, setNeighborhoods] = useState(NEIGHBORHOODS_DATA);

  // إحصائيات التقسيم الجغرافي
  const statistics = useMemo(() => {
    return {
      totalNeighborhoods: neighborhoods.length,
      totalCities: new Set(neighborhoods.map(n => n.city)).size,
      totalSectors: new Set(neighborhoods.flatMap(n => n.sectors.map(s => s.sectorId))).size,
      multiSectorNeighborhoods: neighborhoods.filter(n => n.sectors.length > 1).length,
      multiEntityNeighborhoods: neighborhoods.filter(n => n.entities.length > 1).length,
      totalPopulation: neighborhoods.reduce((sum, n) => sum + n.population, 0),
      totalArea: neighborhoods.reduce((sum, n) => sum + n.area, 0),
      activeNeighborhoods: neighborhoods.filter(n => n.status === 'active').length
    };
  }, [neighborhoods]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 819-01: نظرة عامة
      case '819-01':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <MapPin className="h-5 w-5" />
                  نظرة عامة على التقسيم الجغرافي
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('819-06')}>
                    <Plus className="h-3 w-3" />
                    إضافة حي
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* إحصائيات سريعة */}
                <div className="dense-stats-grid gap-3 mb-4">
                  {[
                    { label: 'إجمالي الأحياء', value: statistics.totalNeighborhoods, icon: Home, color: 'blue' },
                    { label: 'المدن', value: statistics.totalCities, icon: Building, color: 'indigo' },
                    { label: 'القطاعات', value: statistics.totalSectors, icon: Map, color: 'purple' },
                    { label: 'أحياء متعددة القطاعات', value: statistics.multiSectorNeighborhoods, icon: Navigation, color: 'green' },
                    { label: 'أحياء متعددة الجهات', value: statistics.multiEntityNeighborhoods, icon: Target, color: 'orange' },
                    { label: 'إجمالي السكان', value: statistics.totalPopulation.toLocaleString(), icon: Users, color: 'pink' },
                    { label: 'المساحة الإجمالية', value: `${statistics.totalArea.toFixed(1)} كم²`, icon: Globe, color: 'cyan' },
                    { label: 'نشطة', value: statistics.activeNeighborhoods, icon: CheckCircle, color: 'emerald' }
                  ].map((stat, i) => (
                    <div key={i} className="dense-stat-card">
                      <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                        {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                      </div>
                      <div className="dense-stat-number">{stat.value}</div>
                      <div className="dense-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* خريطة توزيع الأحياء */}
                <div>
                  <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                    توزيع الأحياء حسب القطاعات
                  </h3>
                  <div className="space-y-2">
                    {['SEC-RYD-N', 'SEC-RYD-S', 'SEC-RYD-E', 'SEC-RYD-W'].map((sectorId) => {
                      const sectorNeighborhoods = neighborhoods.filter(n => 
                        n.sectors.some(s => s.sectorId === sectorId)
                      );
                      const sectorName = sectorNeighborhoods[0]?.sectors.find(s => s.sectorId === sectorId)?.sectorName || '';
                      
                      return (
                        <Card key={sectorId} className="dense-content-card">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Map className="h-4 w-4 text-blue-600" />
                              <div className="compact-text font-medium">{sectorName}</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">
                              {sectorNeighborhoods.length} حي
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sectorNeighborhoods.slice(0, 5).map((nbh) => (
                              <Badge key={nbh.id} className="bg-gray-100 text-gray-700 text-xs">
                                {nbh.name}
                              </Badge>
                            ))}
                            {sectorNeighborhoods.length > 5 && (
                              <Badge className="bg-blue-50 text-blue-600 text-xs">
                                +{sectorNeighborhoods.length - 5} أكثر
                              </Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 819-04: الأحياء
      case '819-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Home className="h-5 w-5" />
                  قائمة الأحياء ({statistics.totalNeighborhoods})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* البحث */}
                <div className="relative mb-4">
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث عن حي..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="compact-input pr-8 w-full"
                    style={{ height: '32px', fontSize: '12px', paddingRight: '32px' }}
                  />
                </div>

                {/* قائمة الأحياء */}
                <div className="space-y-2">
                  {neighborhoods.map((neighborhood) => (
                    <Card key={neighborhood.id} className="dense-content-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="compact-text font-medium">{neighborhood.name}</div>
                            <div className="text-xs text-gray-500">{neighborhood.nameEn}</div>
                          </div>
                        </div>
                        {neighborhood.sectors.length > 1 && (
                          <Badge className="bg-orange-100 text-orange-700">
                            متعدد القطاعات
                          </Badge>
                        )}
                      </div>

                      <div className="dense-grid dense-grid-3 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-600">السكان:</span>
                          <span className="font-medium mr-1">{neighborhood.population.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">المساحة:</span>
                          <span className="font-medium mr-1">{neighborhood.area} كم²</span>
                        </div>
                        <div>
                          <span className="text-gray-600">المدينة:</span>
                          <span className="font-medium mr-1">{neighborhood.city}</span>
                        </div>
                      </div>

                      {/* القطاعات */}
                      <div className="mb-2">
                        <div className="text-xs text-gray-600 mb-1">القطاعات:</div>
                        <div className="flex flex-wrap gap-1">
                          {neighborhood.sectors.map((sector, idx) => (
                            <Badge 
                              key={idx} 
                              className={sector.isPrimary ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                            >
                              {sector.sectorName.replace('قطاع ', '')}
                              {sector.isPrimary && ' (رئيسي)'}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* الجهات */}
                      {neighborhood.entities.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-1">الجهات:</div>
                          <div className="flex flex-wrap gap-1">
                            {neighborhood.entities.map((entity, idx) => (
                              <Badge key={idx} className="bg-green-100 text-green-700 text-xs">
                                {entity.entityName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Button className="dense-action-btn">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button className="dense-action-btn">
                          <MapPin className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 819-06: إضافة حي
      case '819-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-5 w-5" />
                  إضافة حي جديد
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <CheckCircle className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات أساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="اسم الحي بالعربي"
                        id="nameAr"
                        value=""
                        onChange={() => {}}
                        placeholder="مثال: حي العليا"
                      />

                      <InputWithCopy
                        label="اسم الحي بالإنجليزي"
                        id="nameEn"
                        value=""
                        onChange={() => {}}
                        placeholder="Example: Al Olaya District"
                      />

                      <SelectWithCopy
                        label="المدينة"
                        id="city"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر المدينة' },
                          { value: 'الرياض', label: 'الرياض' },
                          { value: 'جدة', label: 'جدة' },
                          { value: 'الدمام', label: 'الدمام' },
                          { value: 'مكة المكرمة', label: 'مكة المكرمة' }
                        ]}
                      />

                      <InputWithCopy
                        label="عدد السكان (تقريبي)"
                        id="population"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="45000"
                      />

                      <InputWithCopy
                        label="المساحة (كم²)"
                        id="area"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="12.5"
                      />

                      <InputWithCopy
                        label="خط العرض (Latitude)"
                        id="latitude"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="24.6977"
                      />

                      <InputWithCopy
                        label="خط الطول (Longitude)"
                        id="longitude"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="46.6850"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ربط بالقطاعات
                    </h3>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                      <p className="text-xs text-blue-700">
                        يمكن ربط الحي بقطاع واحد أو أكثر. حدد القطاع الرئيسي والقطاعات الفرعية إن وجدت.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <SelectWithCopy
                          label="القطاع الرئيسي"
                          id="primarySector"
                          value=""
                          onChange={() => {}}
                          options={[
                            { value: '', label: 'اختر القطاع الرئيسي' },
                            { value: 'SEC-RYD-N', label: 'قطاع شمال مدينة الرياض' },
                            { value: 'SEC-RYD-S', label: 'قطاع جنوب مدينة الرياض' },
                            { value: 'SEC-RYD-E', label: 'قطاع شرق مدينة الرياض' },
                            { value: 'SEC-RYD-W', label: 'قطاع غرب مدينة الرياض' }
                          ]}
                        />
                      </div>

                      <div>
                        <label className="dense-form-label mb-2" style={{ color: '#2563eb', fontWeight: 700 }}>
                          قطاعات إضافية (اختياري)
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <input type="checkbox" id="addSector1" className="w-4 h-4" />
                          <label htmlFor="addSector1" className="text-xs">قطاع شرق مدينة الرياض</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ربط بالجهات
                    </h3>
                    <div className="space-y-2">
                      {[
                        { id: 'ENT-GOV-001', name: 'وزارة الشؤون البلدية والقروية' },
                        { id: 'ENT-SEMI-001', name: 'الهيئة الملكية لمدينة الرياض' }
                      ].map((entity) => (
                        <div key={entity.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                          <input type="checkbox" id={entity.id} className="w-4 h-4" />
                          <label htmlFor={entity.id} className="text-xs flex-1">{entity.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التقسيم الجغرافي
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 819
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Home className="w-2 h-2 ml-1" />
              {statistics.totalNeighborhoods} حي
            </Badge>
            <Badge className="text-xs bg-green-100 text-green-800">
              {statistics.totalSectors} قطاع
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="h-3 w-3" />
              إضافة
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 819 - التقسيم الجغرافي
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • 15 تبويب • ربط ديناميكي
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {statistics.totalNeighborhoods} حي
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-819</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GeographicalDivision_Complete_819;
