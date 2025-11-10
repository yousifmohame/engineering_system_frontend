/**
 * الشاشة 819 - التقسيم الجغرافي - v8.0
 * =======================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 8 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  MapPin, Plus, Edit, Eye, Download, Filter, Settings,
  RefreshCw, Map, Navigation, Globe, Building, Activity,
  BarChart3, Target
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '819-01', number: '819-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '819-02', number: '819-02', title: 'المناطق', icon: Map },
  { id: '819-03', number: '819-03', title: 'المدن', icon: Building },
  { id: '819-04', number: '819-04', title: 'الأحياء', icon: MapPin },
  { id: '819-05', number: '819-05', title: 'الإحداثيات', icon: Navigation },
  { id: '819-06', number: '819-06', title: 'الخرائط', icon: Globe },
  { id: '819-07', number: '819-07', title: 'التقارير', icon: BarChart3 },
  { id: '819-08', number: '819-08', title: 'الإعدادات', icon: Settings },
];

const GeographicalDivision_Complete_819_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('819-01');
  const [enableGPS, setEnableGPS] = useState(true);
  const [enableMaps, setEnableMaps] = useState(true);

  const geoData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي المناطق', value: '13', icon: Map, color: '#3b82f6' },
      { id: '2', label: 'المدن', value: '285', icon: Building, color: '#10b981' },
      { id: '3', label: 'الأحياء', value: '1,542', icon: MapPin, color: '#f59e0b' },
      { id: '4', label: 'المواقع النشطة', value: '3,845', icon: Target, color: '#8b5cf6' },
    ],
    regions: [
      { id: '1', name: 'منطقة الرياض', code: 'RD', cities: 48, districts: 356, active: true },
      { id: '2', name: 'منطقة مكة المكرمة', code: 'MK', cities: 52, districts: 412, active: true },
      { id: '3', name: 'المنطقة الشرقية', code: 'ES', cities: 38, districts: 287, active: true },
      { id: '4', name: 'منطقة المدينة المنورة', code: 'MD', cities: 28, districts: 198, active: true },
    ],
    cities: [
      { id: '1', name: 'الرياض', region: 'منطقة الرياض', districts: 156, population: '7.5M' },
      { id: '2', name: 'جدة', region: 'منطقة مكة المكرمة', districts: 142, population: '4.7M' },
      { id: '3', name: 'الدمام', region: 'المنطقة الشرقية', districts: 89, population: '1.2M' },
    ],
  }), []);

  const renderTabContent = () => {
    switch (activeTab) {
      case '819-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - التقسيم الجغرافي</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-4 gap-2">
              {geoData.stats.map((stat) => (
                <Card key={stat.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4', style: { color: stat.color } })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* المناطق */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Map className="h-4 w-4" />
                  المناطق الإدارية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدن</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأحياء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geoData.regions.map((region) => (
                      <TableRow key={region.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{region.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">{region.code}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{region.cities}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{region.districts}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نشط</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '819-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدن</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />مدينة جديدة</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنطقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الأحياء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السكان</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geoData.cities.map((city) => (
                      <TableRow key={city.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{city.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{city.region}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{city.districts}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{city.population}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
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

      case '819-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التقسيم الجغرافي</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="gps"
                  label="تفعيل GPS"
                  description="استخدام نظام تحديد المواقع"
                  checked={enableGPS}
                  onCheckedChange={setEnableGPS}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="maps"
                  label="عرض الخرائط"
                  description="إظهار الخرائط التفاعلية"
                  checked={enableMaps}
                  onCheckedChange={setEnableMaps}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="map-provider"
                    label="مزود الخرائط"
                    value="google"
                    onChange={() => {}}
                    options={[
                      { value: 'google', label: 'Google Maps' },
                      { value: 'osm', label: 'OpenStreetMap' },
                      { value: 'mapbox', label: 'Mapbox' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-819" position="top-right" />
      
      {/* هيدر الشاشة v4.2.2 */}
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
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <MapPin 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '20px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  التقسيم الجغرافي
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
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    819
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
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                إدارة المناطق والمدن والأحياء والمواقع
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
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                8 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GeographicalDivision_Complete_819_v8;
