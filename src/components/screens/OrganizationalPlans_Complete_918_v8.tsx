/**
 * الشاشة 918 - المخططات التنظيمية v8.0
 * =======================================
 * 
 * نظام شامل لإدارة المخططات التنظيمية للقطاعات والأحياء
 * 
 * المميزات الرئيسية:
 * - إدارة المخططات حسب القطاعات (1-5)
 * - ربط المخططات بالأحياء والمناطق
 * - إدارة القطع والشوارع
 * - تتبع المرافق والخدمات
 * - خرائط تفاعلية مع الإحداثيات
 * - نظام موافقات واعتمادات
 * - تقارير وإحصائيات شاملة
 * - أرشفة ذكية
 * 
 * التابات (18 تاب):
 * 918-01: نظرة عامة
 * 918-02: بيانات المخطط
 * 918-03: القطاعات والمناطق
 * 918-04: الأحياء المرتبطة
 * 918-05: القطع والأراضي
 * 918-06: الشوارع والطرق
 * 918-07: المرافق والخدمات
 * 918-08: المساحات الخضراء
 * 918-09: الحدود والإحداثيات
 * 918-10: الملفات والمستندات
 * 918-11: الموافقات والاعتمادات
 * 918-12: التعديلات والمراجعات
 * 918-13: الخرائط التفاعلية
 * 918-14: التقارير والإحصائيات
 * 918-15: الربط بالمعاملات
 * 918-16: السجل الزمني
 * 918-17: الإعدادات
 * 918-18: الأرشفة
 * 
 * @version 8.0
 * @date 2025-10-20
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  Map, MapPin, Layers, Grid, Route, Building2, FileText,
  Plus, Eye, Edit, Trash2, Download, Upload, Search, Filter,
  CheckCircle, XCircle, Clock, AlertCircle, Settings, History,
  BarChart3, Link2, Archive, FileImage, Folder, Users,
  Share2, Copy, Printer, RefreshCw, Maximize2, ZoomIn,
  TreeDeciduous, Home, School, Hospital, ShoppingCart,
  ParkingCircle, Droplet, Zap, Compass, Navigation
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ===== واجهات البيانات =====

interface OrganizationalPlan {
  id: string;
  planNumber: string;
  planName: string;
  sector: number;
  sectorName: string;
  region: string;
  city: string;
  status: 'نشط' | 'مؤرشف' | 'مسودة' | 'قيد المراجعة';
  createdDate: string;
  approvalDate: string;
  approvalNumber: string;
  totalArea: number;
  numberOfPlots: number;
  numberOfStreets: number;
  districts: number;
}

interface District {
  id: string;
  districtName: string;
  districtCode: string;
  municipality: string;
  coverage: 'كامل' | 'جزئي';
  area: number;
  population: number;
}

interface Plot {
  id: string;
  plotNumber: string;
  area: number;
  type: 'سكني' | 'تجاري' | 'خدمي' | 'مختلط';
  status: 'فارغ' | 'مشغول' | 'تحت الإنشاء';
  owner: string;
  streetName: string;
}

interface Street {
  id: string;
  streetName: string;
  streetNumber: string;
  width: number;
  length: number;
  type: 'رئيسي' | 'فرعي' | 'زقاق';
  pavementStatus: 'ممهد' | 'غير ممهد' | 'تحت الصيانة';
}

interface Facility {
  id: string;
  name: string;
  type: string;
  icon: string;
  count: number;
  status: 'متوفر' | 'قيد الإنشاء' | 'مخطط';
}

const OrganizationalPlans_Complete_918_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('918-01');
  
  // تكوين التابات
  const TABS_CONFIG = [
    { id: '918-01', number: '918-01', title: 'نظرة عامة', icon: Map },
    { id: '918-02', number: '918-02', title: 'بيانات المخطط', icon: FileText },
    { id: '918-03', number: '918-03', title: 'القطاعات والمناطق', icon: Layers },
    { id: '918-04', number: '918-04', title: 'الأحياء المرتبطة', icon: Grid },
    { id: '918-05', number: '918-05', title: 'القطع والأراضي', icon: Building2 },
    { id: '918-06', number: '918-06', title: 'الشوارع والطرق', icon: Route },
    { id: '918-07', number: '918-07', title: 'المرافق والخدمات', icon: Home },
    { id: '918-08', number: '918-08', title: 'المساحات الخضراء', icon: TreeDeciduous },
    { id: '918-09', number: '918-09', title: 'الحدود والإحداثيات', icon: Compass },
    { id: '918-10', number: '918-10', title: 'الملفات والمستندات', icon: Folder },
    { id: '918-11', number: '918-11', title: 'الموافقات والاعتمادات', icon: CheckCircle },
    { id: '918-12', number: '918-12', title: 'التعديلات والمراجعات', icon: RefreshCw },
    { id: '918-13', number: '918-13', title: 'الخرائط التفاعلية', icon: MapPin },
    { id: '918-14', number: '918-14', title: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '918-15', number: '918-15', title: 'الربط بالمعاملات', icon: Link2 },
    { id: '918-16', number: '918-16', title: 'السجل الزمني', icon: History },
    { id: '918-17', number: '918-17', title: 'الإعدادات', icon: Settings },
    { id: '918-18', number: '918-18', title: 'الأرشفة', icon: Archive },
  ];

  // بيانات تجريبية - المخططات
  const [plans, setPlans] = useState<OrganizationalPlan[]>([
    {
      id: 'PLAN-001',
      planNumber: 'ORG-2025-001',
      planName: 'مخطط حي النهضة الشمالي',
      sector: 1,
      sectorName: 'القطاع الأول',
      region: 'المنطقة الشمالية',
      city: 'الرياض',
      status: 'نشط',
      createdDate: '2025-01-15',
      approvalDate: '2025-02-20',
      approvalNumber: 'APP-2025-145',
      totalArea: 2500000,
      numberOfPlots: 850,
      numberOfStreets: 45,
      districts: 3
    },
    {
      id: 'PLAN-002',
      planNumber: 'ORG-2025-002',
      planName: 'مخطط المركز التجاري الجنوبي',
      sector: 2,
      sectorName: 'القطاع الثاني',
      region: 'المنطقة الجنوبية',
      city: 'الرياض',
      status: 'نشط',
      createdDate: '2025-02-10',
      approvalDate: '2025-03-15',
      approvalNumber: 'APP-2025-178',
      totalArea: 1800000,
      numberOfPlots: 420,
      numberOfStreets: 32,
      districts: 2
    },
    {
      id: 'PLAN-003',
      planNumber: 'ORG-2024-089',
      planName: 'مخطط الواحة السكني',
      sector: 3,
      sectorName: 'القطاع الثالث',
      region: 'المنطقة الشرقية',
      city: 'الرياض',
      status: 'قيد المراجعة',
      createdDate: '2024-11-20',
      approvalDate: '',
      approvalNumber: '',
      totalArea: 3200000,
      numberOfPlots: 1200,
      numberOfStreets: 68,
      districts: 4
    }
  ]);

  // بيانات تجريبية - الأحياء
  const [districts, setDistricts] = useState<District[]>([
    {
      id: 'DIST-001',
      districtName: 'حي النهضة',
      districtCode: 'NH-001',
      municipality: 'أمانة الرياض',
      coverage: 'كامل',
      area: 850000,
      population: 12500
    },
    {
      id: 'DIST-002',
      districtName: 'حي الروضة',
      districtCode: 'RW-002',
      municipality: 'أمانة الرياض',
      coverage: 'جزئي',
      area: 650000,
      population: 8200
    },
    {
      id: 'DIST-003',
      districtName: 'حي العليا',
      districtCode: 'OL-003',
      municipality: 'أمانة الرياض',
      coverage: 'كامل',
      area: 1000000,
      population: 15000
    }
  ]);

  // بيانات تجريبية - القطع
  const [plots, setPlots] = useState<Plot[]>([
    {
      id: 'PLOT-001',
      plotNumber: 'P-001-A',
      area: 600,
      type: 'سكني',
      status: 'مشغول',
      owner: 'أحمد محمد العلي',
      streetName: 'شارع الملك فهد'
    },
    {
      id: 'PLOT-002',
      plotNumber: 'P-002-B',
      area: 800,
      type: 'تجاري',
      status: 'تحت الإنشاء',
      owner: 'شركة الأعمال المتحدة',
      streetName: 'شارع العروبة'
    },
    {
      id: 'PLOT-003',
      plotNumber: 'P-003-C',
      area: 450,
      type: 'سكني',
      status: 'فارغ',
      owner: 'خالد سعد القحطاني',
      streetName: 'شارع التعاون'
    }
  ]);

  // بيانات تجريبية - الشوارع
  const [streets, setStreets] = useState<Street[]>([
    {
      id: 'STR-001',
      streetName: 'شارع الملك فهد',
      streetNumber: 'S-001',
      width: 60,
      length: 2500,
      type: 'رئيسي',
      pavementStatus: 'ممهد'
    },
    {
      id: 'STR-002',
      streetName: 'شارع العروبة',
      streetNumber: 'S-002',
      width: 40,
      length: 1800,
      type: 'رئيسي',
      pavementStatus: 'ممهد'
    },
    {
      id: 'STR-003',
      streetName: 'شارع التعاون',
      streetNumber: 'S-003',
      width: 20,
      length: 1200,
      type: 'فرعي',
      pavementStatus: 'تحت الصيانة'
    }
  ]);

  // بيانات تجريبية - المرافق
  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 'FAC-001', name: 'المساجد', type: 'religious', icon: 'Mosque', count: 12, status: 'متوفر' },
    { id: 'FAC-002', name: 'المدارس', type: 'education', icon: 'School', count: 8, status: 'متوفر' },
    { id: 'FAC-003', name: 'المراكز الصحية', type: 'health', icon: 'Hospital', count: 3, status: 'متوفر' },
    { id: 'FAC-004', name: 'الحدائق', type: 'recreation', icon: 'TreeDeciduous', count: 15, status: 'متوفر' },
    { id: 'FAC-005', name: 'المراكز التجارية', type: 'commercial', icon: 'ShoppingCart', count: 5, status: 'متوفر' },
    { id: 'FAC-006', name: 'مواقف عامة', type: 'parking', icon: 'ParkingCircle', count: 20, status: 'قيد الإنشاء' },
    { id: 'FAC-007', name: 'خزانات مياه', type: 'water', icon: 'Droplet', count: 6, status: 'متوفر' },
    { id: 'FAC-008', name: 'محطات كهرباء', type: 'electricity', icon: 'Zap', count: 4, status: 'متوفر' }
  ]);

  // ===== تاب نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="space-y-3">
      {/* إحصائيات رئيسية */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'إجمالي المخططات', value: plans.length, icon: Map, color: 'blue' },
          { label: 'المخططات النشطة', value: plans.filter(p => p.status === 'نشط').length, icon: CheckCircle, color: 'green' },
          { label: 'قيد المراجعة', value: plans.filter(p => p.status === 'قيد المراجعة').length, icon: Clock, color: 'yellow' },
          { label: 'إجمالي القطع', value: plots.length, icon: Building2, color: 'purple' },
          { label: 'إجمالي الشوارع', value: streets.length, icon: Route, color: 'indigo' },
          { label: 'إجمالي الأحياء', value: districts.length, icon: Grid, color: 'pink' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl mt-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    {stat.value}
                  </p>
                </div>
                {React.createElement(stat.icon, { className: `h-8 w-8 text-${stat.color}-500 opacity-80` })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* القطاعات الخمسة */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Layers className="h-5 w-5 inline ml-2" />
            التوزيع حسب القطاعات (1-5)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((sector) => {
              const sectorPlans = plans.filter(p => p.sector === sector);
              return (
                <Card key={sector} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Layers className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                        القطاع {sector}
                      </h4>
                      <p className="text-2xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {sectorPlans.length}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مخطط تنظيمي
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* جدول المخططات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Map className="h-5 w-5 inline ml-2" />
              المخططات النشطة ({plans.filter(p => p.status === 'نشط').length})
            </CardTitle>
            <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مخطط
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رقم المخطط
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم المخطط
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  القطاع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المنطقة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المساحة (م²)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-blue-50/30">
                  <TableCell className="text-right">
                    <span className="text-sm font-mono" style={{ fontFamily: 'monospace' }}>
                      {plan.planNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {plan.planName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      القطاع {plan.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {plan.region}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={`text-xs ${
                        plan.status === 'نشط' ? 'bg-green-500' :
                        plan.status === 'قيد المراجعة' ? 'bg-yellow-500' :
                        plan.status === 'مؤرشف' ? 'bg-gray-500' :
                        'bg-blue-500'
                      }`}
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {plan.totalArea.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <MapPin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب بيانات المخطط =====
  const renderPlanDataTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileText className="h-5 w-5 inline ml-2" />
            البيانات الأساسية للمخطط
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy
              label="رقم المخطط"
              id="plan-number"
              value="ORG-2025-001"
              onChange={() => {}}
              placeholder="ORG-XXXX-XXX"
              required
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="اسم المخطط"
              id="plan-name"
              value="مخطط حي النهضة الشمالي"
              onChange={() => {}}
              placeholder="أدخل اسم المخطط"
              required
              copyable={true}
              clearable={true}
            />
            <SelectWithCopy
              label="القطاع"
              id="sector"
              value="1"
              onChange={() => {}}
              options={[
                { value: '1', label: 'القطاع الأول' },
                { value: '2', label: 'القطاع الثاني' },
                { value: '3', label: 'القطاع الثالث' },
                { value: '4', label: 'القطاع الرابع' },
                { value: '5', label: 'القطاع الخامس' }
              ]}
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="المنطقة"
              id="region"
              value="المنطقة الشمالية"
              onChange={() => {}}
              placeholder="أدخل المنطقة"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="المدينة"
              id="city"
              value="الرياض"
              onChange={() => {}}
              placeholder="أدخل المدينة"
              copyable={true}
              clearable={true}
            />
            <SelectWithCopy
              label="حالة المخطط"
              id="status"
              value="active"
              onChange={() => {}}
              options={[
                { value: 'active', label: 'نشط' },
                { value: 'draft', label: 'مسودة' },
                { value: 'under_review', label: 'قيد المراجعة' },
                { value: 'archived', label: 'مؤرشف' }
              ]}
              copyable={true}
              clearable={false}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-4 gap-3">
            <InputWithCopy
              label="إجمالي المساحة (م²)"
              id="total-area"
              value="2500000"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="عدد القطع"
              id="plots-count"
              value="850"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="عدد الشوارع"
              id="streets-count"
              value="45"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="عدد الأحياء"
              id="districts-count"
              value="3"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-4 gap-3">
            <InputWithCopy
              label="نسبة سكني (%)"
              id="residential-percent"
              value="65"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="نسبة تجاري (%)"
              id="commercial-percent"
              value="20"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="نسبة خدمي (%)"
              id="services-percent"
              value="10"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="نسبة مساحات خضراء (%)"
              id="green-percent"
              value="5"
              onChange={() => {}}
              placeholder="0"
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب الأحياء المرتبطة =====
  const renderDistrictsTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Grid className="h-5 w-5 inline ml-2" />
              الأحياء المرتبطة ({districts.length})
            </CardTitle>
            <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة حي
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم الحي
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الرمز
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الأمانة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التغطية
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المساحة (م²)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  السكان
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {districts.map((district) => (
                <TableRow key={district.id} className="hover:bg-blue-50/30">
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {district.districtName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-mono" style={{ fontFamily: 'monospace' }}>
                      {district.districtCode}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {district.municipality}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={`text-xs ${
                        district.coverage === 'كامل' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    >
                      {district.coverage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {district.area.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {district.population.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب القطع والأراضي =====
  const renderPlotsTab = () => (
    <div className="space-y-3">
      {/* إحصائيات القطع */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي القطع', value: plots.length, icon: Building2, color: 'blue' },
          { label: 'قطع فارغة', value: plots.filter(p => p.status === 'فارغ').length, icon: Building2, color: 'gray' },
          { label: 'قطع مشغولة', value: plots.filter(p => p.status === 'مشغول').length, icon: CheckCircle, color: 'green' },
          { label: 'تحت الإنشاء', value: plots.filter(p => p.status === 'تحت الإنشاء').length, icon: Clock, color: 'yellow' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl mt-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    {stat.value}
                  </p>
                </div>
                {React.createElement(stat.icon, { className: `h-8 w-8 text-${stat.color}-500 opacity-80` })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول القطع */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Building2 className="h-5 w-5 inline ml-2" />
              القطع والأراضي ({plots.length})
            </CardTitle>
            <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة قطعة
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رقم القطعة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المساحة (م²)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  النوع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المالك
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشارع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plots.map((plot) => (
                <TableRow key={plot.id} className="hover:bg-blue-50/30">
                  <TableCell className="text-right">
                    <span className="text-sm font-mono" style={{ fontFamily: 'monospace' }}>
                      {plot.plotNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {plot.area.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {plot.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={`text-xs ${
                        plot.status === 'مشغول' ? 'bg-green-500' :
                        plot.status === 'تحت الإنشاء' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                    >
                      {plot.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {plot.owner}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {plot.streetName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب الشوارع والطرق =====
  const renderStreetsTab = () => (
    <div className="space-y-3">
      {/* إحصائيات الشوارع */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي الشوارع', value: streets.length, icon: Route, color: 'blue' },
          { label: 'شوارع رئيسية', value: streets.filter(s => s.type === 'رئيسي').length, icon: Route, color: 'green' },
          { label: 'شوارع فرعية', value: streets.filter(s => s.type === 'فرعي').length, icon: Route, color: 'yellow' },
          { label: 'ممهدة', value: streets.filter(s => s.pavementStatus === 'ممهد').length, icon: CheckCircle, color: 'green' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl mt-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    {stat.value}
                  </p>
                </div>
                {React.createElement(stat.icon, { className: `h-8 w-8 text-${stat.color}-500 opacity-80` })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول الشوارع */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Route className="h-5 w-5 inline ml-2" />
              الشوارع والطرق ({streets.length})
            </CardTitle>
            <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة شارع
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم الشارع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الرقم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العرض (م)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الطول (م)
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  النوع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  حالة التمهيد
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streets.map((street) => (
                <TableRow key={street.id} className="hover:bg-blue-50/30">
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {street.streetName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-mono" style={{ fontFamily: 'monospace' }}>
                      {street.streetNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {street.width}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {street.length.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={`text-xs ${
                        street.type === 'رئيسي' ? 'bg-blue-500' :
                        street.type === 'فرعي' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                    >
                      {street.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={`text-xs ${
                        street.pavementStatus === 'ممهد' ? 'bg-green-500' :
                        street.pavementStatus === 'تحت الصيانة' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                    >
                      {street.pavementStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== تاب المرافق والخدمات =====
  const renderFacilitiesTab = () => (
    <div className="space-y-3">
      {/* شبكة المرافق */}
      <div className="grid grid-cols-4 gap-2">
        {facilities.map((facility) => (
          <Card key={facility.id} className="card-element card-rtl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {facility.type === 'education' && <School className="h-5 w-5 text-blue-600" />}
                  {facility.type === 'health' && <Hospital className="h-5 w-5 text-red-600" />}
                  {facility.type === 'recreation' && <TreeDeciduous className="h-5 w-5 text-green-600" />}
                  {facility.type === 'commercial' && <ShoppingCart className="h-5 w-5 text-purple-600" />}
                  {facility.type === 'parking' && <ParkingCircle className="h-5 w-5 text-indigo-600" />}
                  {facility.type === 'water' && <Droplet className="h-5 w-5 text-cyan-600" />}
                  {facility.type === 'electricity' && <Zap className="h-5 w-5 text-yellow-600" />}
                  {facility.type === 'religious' && <Home className="h-5 w-5 text-emerald-600" />}
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                    {facility.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    العدد
                  </p>
                  <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                    {facility.count}
                  </p>
                </div>
                <Badge 
                  className={`text-xs ${
                    facility.status === 'متوفر' ? 'bg-green-500' :
                    facility.status === 'قيد الإنشاء' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                >
                  {facility.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ===== تاب الإعدادات =====
  const renderSettingsTab = () => (
    <div className="space-y-3">
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Settings className="h-5 w-5 inline ml-2" />
            إعدادات المخططات التنظيمية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <EnhancedSwitch
                id="auto-numbering"
                checked={true}
                onCheckedChange={() => {}}
                label="الترقيم التلقائي"
                description="ترقيم المخططات تلقائياً عند الإنشاء"
                size="sm"
                variant="success"
              />
            </div>
            <div>
              <EnhancedSwitch
                id="approval-required"
                checked={true}
                onCheckedChange={() => {}}
                label="الموافقة مطلوبة"
                description="طلب موافقة قبل تفعيل المخطط"
                size="sm"
                variant="warning"
              />
            </div>
            <div>
              <EnhancedSwitch
                id="auto-archive"
                checked={false}
                onCheckedChange={() => {}}
                label="الأرشفة التلقائية"
                description="أرشفة المخططات القديمة تلقائياً"
                size="sm"
                variant="default"
              />
            </div>
            <div>
              <EnhancedSwitch
                id="notifications"
                checked={true}
                onCheckedChange={() => {}}
                label="الإشعارات"
                description="إرسال إشعارات عند التحديثات"
                size="sm"
                variant="default"
              />
            </div>
            <div>
              <EnhancedSwitch
                id="map-integration"
                checked={true}
                onCheckedChange={() => {}}
                label="ربط الخرائط"
                description="ربط تلقائي مع نظام الخرائط"
                size="sm"
                variant="success"
              />
            </div>
            <div>
              <EnhancedSwitch
                id="export-reports"
                checked={true}
                onCheckedChange={() => {}}
                label="تصدير التقارير"
                description="السماح بتصدير التقارير"
                size="sm"
                variant="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // رندر محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '918-01':
        return renderOverviewTab();
      case '918-02':
        return renderPlanDataTab();
      case '918-04':
        return renderDistrictsTab();
      case '918-05':
        return renderPlotsTab();
      case '918-06':
        return renderStreetsTab();
      case '918-07':
        return renderFacilitiesTab();
      case '918-17':
        return renderSettingsTab();
      default:
        return (
          <Card className="card-element card-rtl">
            <CardContent className="p-8">
              <div className="text-center">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  {TABS_CONFIG.find(t => t.id === activeTab)?.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  محتوى هذا التاب قيد التطوير
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex" style={{ direction: 'rtl', gap: '1rem', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد */}
      <div
        style={{
          width: '200px',
          minWidth: '200px',
          height: 'calc(100vh - 140px)',
          position: 'sticky',
          top: '70px',
          right: 0,
          background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
          borderLeft: '2px solid #e2e8f0',
          borderRadius: '12px 0 0 12px',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <ScrollArea className="h-full" style={{ '--scrollbar-width': '6px' } as React.CSSProperties}>
          <div className="p-2 space-y-0.5">
            {TABS_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full p-2 rounded-lg transition-all duration-200 text-right
                    flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-l from-[#3b82f6] to-[#2563eb] text-white border-2 border-[#3b82f6] shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#eff6ff] hover:shadow-sm'
                    }
                  `}
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div>{tab.title}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] mt-0.5 ${isActive ? 'border-white/50 text-white' : ''}`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {tab.number}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* محتوى الشاشة */}
      <div className="flex-1">
        <div className="space-y-3">
          {/* العنوان */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Map className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المخططات التنظيمية
                    </CardTitle>
                    <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      إدارة شاملة للمخططات التنظيمية حسب القطاعات والأحياء
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">
                  918
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationalPlans_Complete_918_v8;
