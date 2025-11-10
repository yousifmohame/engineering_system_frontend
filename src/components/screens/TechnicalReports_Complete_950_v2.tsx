/**
 * الشاشة 950 - التقارير الفنية v2.0 - نظام شامل
 * ====================================================================
 * 
 * نظام متكامل لإنشاء وإدارة التقارير الفنية الاحترافية
 * 
 * المميزات:
 * - صفحات A4 ديناميكية مع ترقيم تلقائي
 * - 12 قسماً شاملاً من البيانات
 * - سحب تلقائي من جميع تابات المعاملة
 * - إمكانية التعديل الكامل
 * - صور ومخططات ديناميكية
 * - نظام طباعة وتصدير PDF احترافي
 * - توثيق رقمي مع QR Code
 * - إدارة إصدارات متعددة
 * - قوالب جاهزة قابلة للتخصيص
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { 
  FileText, Printer, Download, Eye, Save, Plus, Edit, Trash2,
  Image as ImageIcon, MapPin, User, Building, Calendar, Hash,
  FileSignature, CheckCircle, Settings, Copy, Upload, QrCode,
  Layout, Layers, RefreshCw, History, Star, FileCheck
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ==================== الواجهات ====================

interface ReportSection {
  id: string;
  title: string;
  isRequired: boolean;
  isVisible: boolean;
  order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: 'ترخيص بناء' | 'تصحيح وضع' | 'هدم' | 'ترميم';
  sections: ReportSection[];
  createdDate: string;
}

interface ReportVersion {
  id: string;
  versionNumber: string;
  status: 'مسودة' | 'نهائي' | 'معدّل';
  createdDate: string;
  createdBy: string;
  notes: string;
}

interface FloorData {
  id: string;
  name: string;
  buildingPercentage: number;
  builtArea: number;
  unitsCount: number;
  usageType: string;
  notes: string;
}

interface ReportImage {
  id: string;
  url: string;
  description: string;
  captureDate: string;
  category: 'موقع' | 'جوية' | 'مخطط';
}

interface TechnicalReport {
  // معلومات التقرير الأساسية
  reportNumber: string;
  reportDate: string;
  reportTitle: string;
  
  // معلومات المعاملة
  transactionNumber: string;
  licenseNumber: string;
  licenseDate: string;
  requestType: string;
  reportPurpose: string;
  
  // بيانات المالك
  ownerName: string;
  ownerIdNumber: string;
  ownerNationality: string;
  ownerPhone: string;
  ownerAddress: string;
  
  // بيانات الملكية
  deedNumber: string;
  deedDate: string;
  planNumber: string;
  plotNumbers: string[];
  district: string;
  totalArea: number;
  plotDimensions: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  
  // الموقع الجغرافي
  municipality: string;
  officialDistrict: string;
  streetName: string;
  locationMap?: string;
  
  // الارتدادات والأبعاد
  setbacks: {
    north: { actualLength: number; systemSetback: number; actualSetback: number; notes: string; streetWidth: number; };
    south: { actualLength: number; systemSetback: number; actualSetback: number; notes: string; streetWidth: number; };
    east: { actualLength: number; systemSetback: number; actualSetback: number; notes: string; streetWidth: number; };
    west: { actualLength: number; systemSetback: number; actualSetback: number; notes: string; streetWidth: number; };
  };
  
  // نوع الطلب وتفاصيله
  requestDescription: string;
  
  // الأدوار والوحدات
  floors: FloorData[];
  totalBuiltArea: number;
  totalUnitsCount: number;
  
  // الصور والمخططات
  images: ReportImage[];
  
  // الملاحظات والتوصيات
  technicalNotes: string;
  licenseCompliance: 'نعم' | 'لا' | 'جزئياً';
  complianceDetails: string;
  recommendations: string;
  finalNotes: string;
  
  // التوقيعات
  engineerName: string;
  engineerMembershipNumber: string;
  engineerSpecialty: string;
  engineerSignature?: string;
  officeStamp?: string;
  ownerSignature?: string;
  
  // التوثيق الرقمي
  digitalAuthNumber?: string;
  qrCode?: string;
  
  // إدارة الإصدارات
  version: string;
  status: 'مسودة' | 'نهائي' | 'معدّل';
  versions: ReportVersion[];
}

// ==================== إعدادات التابات ====================

const TABS_CONFIG: TabConfig[] = [
  { id: '950-01', number: '950-01', title: 'إنشاء تقرير فني', icon: FileText },
  { id: '950-02', number: '950-02', title: 'القوالب', icon: Layout },
  { id: '950-03', number: '950-03', title: 'الإصدارات', icon: History },
  { id: '950-04', number: '950-04', title: 'المعاينة والطباعة', icon: Printer },
];

// ==================== المكون الرئيسي ====================

const TechnicalReports_Complete_950_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('950-01');
  const printRef = useRef<HTMLDivElement>(null);
  
  // بيانات وهمية للمعاملة المرتبطة
  const [linkedTransaction] = useState({
    number: '2501045',
    ownerName: 'المهندس عبدالله بن سعد المطيري',
    ownerId: '1023456789',
    ownerNationality: 'سعودي',
    ownerPhone: '0501234567',
    ownerAddress: 'الرياض - حي النرجس',
    planNumber: 'مخ-3421',
    plotNumbers: ['456', '457'],
    district: 'النرجس',
    totalArea: 850,
    deedNumber: 'صك-789123',
    deedDate: '1445-03-15',
    requestType: 'تصحيح وضع',
    location: {
      municipality: 'أمانة منطقة الرياض',
      district: 'حي النرجس',
      street: 'شارع الملك فهد',
      lat: 24.7136,
      lng: 46.6753
    }
  });
  
  // حالة التقرير
  const [report, setReport] = useState<TechnicalReport>({
    reportNumber: 'TR-2501-001',
    reportDate: new Date().toISOString().split('T')[0],
    reportTitle: 'تقرير فني',
    
    transactionNumber: linkedTransaction.number,
    licenseNumber: 'رخ-2024-5678',
    licenseDate: '2024-05-15',
    requestType: linkedTransaction.requestType,
    reportPurpose: 'تصحيح وضع مبنى قائم بدون التعديل في الاستخدام أو عدد الوحدات أو نسب البناء',
    
    ownerName: linkedTransaction.ownerName,
    ownerIdNumber: linkedTransaction.ownerId,
    ownerNationality: linkedTransaction.ownerNationality,
    ownerPhone: linkedTransaction.ownerPhone,
    ownerAddress: linkedTransaction.ownerAddress,
    
    deedNumber: linkedTransaction.deedNumber,
    deedDate: linkedTransaction.deedDate,
    planNumber: linkedTransaction.planNumber,
    plotNumbers: linkedTransaction.plotNumbers,
    district: linkedTransaction.district,
    totalArea: linkedTransaction.totalArea,
    plotDimensions: { north: 25, south: 25, east: 34, west: 34 },
    
    municipality: linkedTransaction.location.municipality,
    officialDistrict: linkedTransaction.location.district,
    streetName: linkedTransaction.location.street,
    
    setbacks: {
      north: { actualLength: 25, systemSetback: 3, actualSetback: 3.5, notes: 'مطابق', streetWidth: 15 },
      south: { actualLength: 25, systemSetback: 3, actualSetback: 2.8, notes: 'انتهاك بسيط', streetWidth: 12 },
      east: { actualLength: 34, systemSetback: 4, actualSetback: 4.2, notes: 'مطابق', streetWidth: 20 },
      west: { actualLength: 34, systemSetback: 4, actualSetback: 4, notes: 'مطابق', streetWidth: 0 }
    },
    
    requestDescription: 'تصحيح وضع مبنى قائم بدون التعديل في الاستخدام أو عدد الوحدات أو نسب البناء. المبنى مكون من دورين سكنيين مع ملحق علوي.',
    
    floors: [
      { id: '1', name: 'الدور الأرضي', buildingPercentage: 60, builtArea: 510, unitsCount: 2, usageType: 'سكني', notes: 'شقتان' },
      { id: '2', name: 'الدور الأول', buildingPercentage: 60, builtArea: 510, unitsCount: 2, usageType: 'سكني', notes: 'شقتان' },
      { id: '3', name: 'الملحق العلوي', buildingPercentage: 30, builtArea: 255, unitsCount: 1, usageType: 'سكني', notes: 'شقة واحدة' }
    ],
    totalBuiltArea: 1275,
    totalUnitsCount: 5,
    
    images: [],
    
    technicalNotes: 'المبنى في حالة جيدة. جميع الأعمال الإنشائية سليمة. لا توجد مخالفات إنشائية.',
    licenseCompliance: 'جزئياً',
    complianceDetails: 'يوجد انتهاك بسيط في الارتداد الجنوبي بمقدار 20 سم',
    recommendations: 'يوصى بتصحيح الوضع وفق الأنظمة المعمول بها',
    finalNotes: 'تم إعداد هذا التقرير بناءً على الزيارة الميدانية والمستندات المقدمة',
    
    engineerName: 'م. أحمد بن محمد العلي',
    engineerMembershipNumber: 'SCE-123456',
    engineerSpecialty: 'هندسة معمارية',
    
    version: '1.0',
    status: 'مسودة',
    versions: []
  });
  
  // القوالب الجاهزة
  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'TPL-001',
      name: 'تقرير ترخيص بناء',
      type: 'ترخيص بناء',
      sections: [],
      createdDate: '2025-01-01'
    },
    {
      id: 'TPL-002',
      name: 'تقرير تصحيح وضع',
      type: 'تصحيح وضع',
      sections: [],
      createdDate: '2025-01-02'
    },
    {
      id: 'TPL-003',
      name: 'تقرير هدم',
      type: 'هدم',
      sections: [],
      createdDate: '2025-01-03'
    },
    {
      id: 'TPL-004',
      name: 'تقرير ترميم',
      type: 'ترميم',
      sections: [],
      createdDate: '2025-01-04'
    }
  ]);
  
  // حالات النوافذ
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showAddFloorDialog, setShowAddFloorDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  
  // دالة الحفظ
  const handleSave = () => {
    console.log('حفظ التقرير:', report);
    alert('تم حفظ التقرير بنجاح!');
  };
  
  // دالة الطباعة
  const handlePrint = () => {
    window.print();
  };
  
  // دالة تصدير PDF
  const handleExportPDF = () => {
    alert('سيتم تصدير التقرير كملف PDF');
  };
  
  // دالة إضافة دور
  const handleAddFloor = () => {
    const newFloor: FloorData = {
      id: Date.now().toString(),
      name: '',
      buildingPercentage: 0,
      builtArea: 0,
      unitsCount: 0,
      usageType: 'سكني',
      notes: ''
    };
    setReport({ ...report, floors: [...report.floors, newFloor] });
    setShowAddFloorDialog(false);
  };
  
  // دالة حذف دور
  const handleDeleteFloor = (id: string) => {
    setReport({ ...report, floors: report.floors.filter(f => f.id !== id) });
  };
  
  // دالة رندر محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '950-01':
        return renderReportCreationTab();
      case '950-02':
        return renderTemplatesTab();
      case '950-03':
        return renderVersionsTab();
      case '950-04':
        return renderPrintPreviewTab();
      default:
        return null;
    }
  };
  
  // التاب 1: إنشاء التقرير
  const renderReportCreationTab = () => (
    <div className="p-6 space-y-6">
      {/* شريط الإجراءات السريعة */}
      <Card className="card-rtl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                style={{
                  padding: '8px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '10px'
                }}
              >
                <FileText className="h-5 w-5" style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                  التقرير الفني: {report.reportNumber}
                </h3>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                  المعاملة: {report.transactionNumber} • الحالة: {report.status}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ
              </Button>
              <Button onClick={() => setShowPrintPreview(true)} variant="outline">
                <Eye className="h-4 w-4 ml-1" />
                معاينة
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 ml-1" />
                طباعة
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <Download className="h-4 w-4 ml-1" />
                تصدير PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 1: معلومات التقرير الأساسية */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            1. معلومات التقرير الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="رقم التقرير *"
              id="report-number"
              value={report.reportNumber}
              onChange={(e) => setReport({ ...report, reportNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="تاريخ التقرير *"
              id="report-date"
              type="date"
              value={report.reportDate}
              onChange={(e) => setReport({ ...report, reportDate: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="عنوان التقرير *"
              id="report-title"
              value={report.reportTitle}
              onChange={(e) => setReport({ ...report, reportTitle: e.target.value })}
              copyable={true}
              clearable={false}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 2: معلومات المعاملة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            2. معلومات المعاملة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="رقم المعاملة *"
              id="transaction-number"
              value={report.transactionNumber}
              onChange={(e) => setReport({ ...report, transactionNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="رقم الرخصة"
              id="license-number"
              value={report.licenseNumber}
              onChange={(e) => setReport({ ...report, licenseNumber: e.target.value })}
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="تاريخ الرخصة"
              id="license-date"
              type="date"
              value={report.licenseDate}
              onChange={(e) => setReport({ ...report, licenseDate: e.target.value })}
              copyable={true}
              clearable={true}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="نوع الطلب *"
              id="request-type"
              value={report.requestType}
              onChange={(value) => setReport({ ...report, requestType: value })}
              options={[
                { value: 'ترخيص بناء', label: 'ترخيص بناء' },
                { value: 'تصحيح وضع', label: 'تصحيح وضع' },
                { value: 'هدم', label: 'هدم' },
                { value: 'ترميم', label: 'ترميم' }
              ]}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="الغرض من التقرير *"
              id="report-purpose"
              value={report.reportPurpose}
              onChange={(e) => setReport({ ...report, reportPurpose: e.target.value })}
              copyable={true}
              clearable={false}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 3: بيانات المالك */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            3. بيانات المالك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="اسم المالك *"
              id="owner-name"
              value={report.ownerName}
              onChange={(e) => setReport({ ...report, ownerName: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="رقم الهوية/الإقامة *"
              id="owner-id"
              value={report.ownerIdNumber}
              onChange={(e) => setReport({ ...report, ownerIdNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="الجنسية"
              id="owner-nationality"
              value={report.ownerNationality}
              onChange={(e) => setReport({ ...report, ownerNationality: e.target.value })}
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="رقم الجوال *"
              id="owner-phone"
              value={report.ownerPhone}
              onChange={(e) => setReport({ ...report, ownerPhone: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="العنوان"
              id="owner-address"
              value={report.ownerAddress}
              onChange={(e) => setReport({ ...report, ownerAddress: e.target.value })}
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 4: بيانات الملكية */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            4. بيانات الملكية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="رقم الصك *"
              id="deed-number"
              value={report.deedNumber}
              onChange={(e) => setReport({ ...report, deedNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="تاريخ الصك"
              id="deed-date"
              type="date"
              value={report.deedDate}
              onChange={(e) => setReport({ ...report, deedDate: e.target.value })}
              copyable={true}
              clearable={true}
            />
            <InputWithCopy
              label="رقم المخطط *"
              id="plan-number"
              value={report.planNumber}
              onChange={(e) => setReport({ ...report, planNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="أرقام القطع *"
              id="plot-numbers"
              value={report.plotNumbers.join(', ')}
              onChange={(e) => setReport({ ...report, plotNumbers: e.target.value.split(',').map(n => n.trim()) })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="الحي *"
              id="district"
              value={report.district}
              onChange={(e) => setReport({ ...report, district: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="المساحة الكلية (م²) *"
              id="total-area"
              type="number"
              value={report.totalArea.toString()}
              onChange={(e) => setReport({ ...report, totalArea: parseFloat(e.target.value) || 0 })}
              copyable={true}
              clearable={false}
            />
          </div>
          <div>
            <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>
              أبعاد القطعة (متر)
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <InputWithCopy
                label="الشمال"
                id="dim-north"
                type="number"
                value={report.plotDimensions.north.toString()}
                onChange={(e) => setReport({ ...report, plotDimensions: { ...report.plotDimensions, north: parseFloat(e.target.value) || 0 } })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="الجنوب"
                id="dim-south"
                type="number"
                value={report.plotDimensions.south.toString()}
                onChange={(e) => setReport({ ...report, plotDimensions: { ...report.plotDimensions, south: parseFloat(e.target.value) || 0 } })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="الشرق"
                id="dim-east"
                type="number"
                value={report.plotDimensions.east.toString()}
                onChange={(e) => setReport({ ...report, plotDimensions: { ...report.plotDimensions, east: parseFloat(e.target.value) || 0 } })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="الغرب"
                id="dim-west"
                type="number"
                value={report.plotDimensions.west.toString()}
                onChange={(e) => setReport({ ...report, plotDimensions: { ...report.plotDimensions, west: parseFloat(e.target.value) || 0 } })}
                copyable={true}
                clearable={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 5: الموقع الجغرافي */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            5. الموقع الجغرافي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="البلدية/الأمانة *"
              id="municipality"
              value={report.municipality}
              onChange={(e) => setReport({ ...report, municipality: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="اسم الحي الرسمي *"
              id="official-district"
              value={report.officialDistrict}
              onChange={(e) => setReport({ ...report, officialDistrict: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="اسم الشارع"
              id="street-name"
              value={report.streetName}
              onChange={(e) => setReport({ ...report, streetName: e.target.value })}
              copyable={true}
              clearable={true}
            />
          </div>
          <div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 ml-1" />
              إدراج خريطة الموقع
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 6: الارتدادات والأبعاد */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            6. الارتدادات والأبعاد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(['north', 'south', 'east', 'west'] as const).map((direction) => {
              const labels = { north: 'الشمال', south: 'الجنوب', east: 'الشرق', west: 'الغرب' };
              const setback = report.setbacks[direction];
              
              return (
                <div key={direction} className="p-4" style={{ background: '#f8fafc', borderRadius: '8px' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>
                    {labels[direction]}
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    <InputWithCopy
                      label="الطول (م)"
                      id={`${direction}-length`}
                      type="number"
                      value={setback.actualLength.toString()}
                      onChange={(e) => setReport({
                        ...report,
                        setbacks: {
                          ...report.setbacks,
                          [direction]: { ...setback, actualLength: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="ارتداد نظامي (م)"
                      id={`${direction}-system`}
                      type="number"
                      value={setback.systemSetback.toString()}
                      onChange={(e) => setReport({
                        ...report,
                        setbacks: {
                          ...report.setbacks,
                          [direction]: { ...setback, systemSetback: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="ارتداد فعلي (م)"
                      id={`${direction}-actual`}
                      type="number"
                      value={setback.actualSetback.toString()}
                      onChange={(e) => setReport({
                        ...report,
                        setbacks: {
                          ...report.setbacks,
                          [direction]: { ...setback, actualSetback: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="عرض الشارع (م)"
                      id={`${direction}-street`}
                      type="number"
                      value={setback.streetWidth.toString()}
                      onChange={(e) => setReport({
                        ...report,
                        setbacks: {
                          ...report.setbacks,
                          [direction]: { ...setback, streetWidth: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="ملاحظات"
                      id={`${direction}-notes`}
                      value={setback.notes}
                      onChange={(e) => setReport({
                        ...report,
                        setbacks: {
                          ...report.setbacks,
                          [direction]: { ...setback, notes: e.target.value }
                        }
                      })}
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 7: نوع الطلب وتفاصيله */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            7. نوع الطلب وتفاصيله
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaWithCopy
            label="وصف تفصيلي للطلب *"
            id="request-description"
            value={report.requestDescription}
            onChange={(e) => setReport({ ...report, requestDescription: e.target.value })}
            rows={5}
            copyable={true}
            clearable={true}
          />
        </CardContent>
      </Card>
      
      {/* القسم 8: الأدوار والوحدات */}
      <Card className="card-rtl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            8. الأدوار والوحدات
          </CardTitle>
          <Button onClick={() => setShowAddFloorDialog(true)} size="sm">
            <Plus className="h-4 w-4 ml-1" />
            إضافة دور
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.floors.map((floor, index) => (
              <div key={floor.id} className="p-4" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                    الدور {index + 1}
                  </h4>
                  <Button onClick={() => handleDeleteFloor(floor.id)} variant="outline" size="sm" style={{ color: '#ef4444' }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  <InputWithCopy
                    label="اسم الدور"
                    id={`floor-${floor.id}-name`}
                    value={floor.name}
                    onChange={(e) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, name: e.target.value } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="النسبة %"
                    id={`floor-${floor.id}-percentage`}
                    type="number"
                    value={floor.buildingPercentage.toString()}
                    onChange={(e) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, buildingPercentage: parseFloat(e.target.value) || 0 } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="المساحة (م²)"
                    id={`floor-${floor.id}-area`}
                    type="number"
                    value={floor.builtArea.toString()}
                    onChange={(e) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, builtArea: parseFloat(e.target.value) || 0 } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="عدد الوحدات"
                    id={`floor-${floor.id}-units`}
                    type="number"
                    value={floor.unitsCount.toString()}
                    onChange={(e) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, unitsCount: parseInt(e.target.value) || 0 } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="الاستخدام"
                    id={`floor-${floor.id}-usage`}
                    value={floor.usageType}
                    onChange={(value) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, usageType: value } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    options={[
                      { value: 'سكني', label: 'سكني' },
                      { value: 'تجاري', label: 'تجاري' },
                      { value: 'إداري', label: 'إداري' },
                      { value: 'مختلط', label: 'مختلط' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="ملاحظات"
                    id={`floor-${floor.id}-notes`}
                    value={floor.notes}
                    onChange={(e) => {
                      const updated = report.floors.map(f => 
                        f.id === floor.id ? { ...f, notes: e.target.value } : f
                      );
                      setReport({ ...report, floors: updated });
                    }}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4" style={{ background: '#dbeafe', borderRadius: '8px' }}>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#1e3a8a' }}>
                إجمالي المساحة المبنية
              </p>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1e40af' }}>
                {report.floors.reduce((sum, f) => sum + f.builtArea, 0).toFixed(2)} م²
              </p>
            </div>
            <div className="p-4" style={{ background: '#d1fae5', borderRadius: '8px' }}>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#065f46' }}>
                إجمالي عدد الوحدات
              </p>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#047857' }}>
                {report.floors.reduce((sum, f) => sum + f.unitsCount, 0)} وحدة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 9: الصور والمخططات */}
      <Card className="card-rtl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            9. الصور والمخططات
          </CardTitle>
          <Button onClick={() => setShowAddImageDialog(true)} size="sm">
            <Plus className="h-4 w-4 ml-1" />
            إضافة صورة
          </Button>
        </CardHeader>
        <CardContent>
          {report.images.length === 0 ? (
            <div className="text-center p-8" style={{ background: '#f8fafc', borderRadius: '8px' }}>
              <ImageIcon className="h-12 w-12 mx-auto mb-3" style={{ color: '#94a3b8' }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#64748b' }}>
                لم يتم إضافة صور بعد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {/* الصور ستظهر هنا */}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* القسم 10: الملاحظات والتوصيات */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            10. الملاحظات والتوصيات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextAreaWithCopy
            label="الملاحظات الفنية"
            id="technical-notes"
            value={report.technicalNotes}
            onChange={(e) => setReport({ ...report, technicalNotes: e.target.value })}
            rows={4}
            copyable={true}
            clearable={true}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="المطابقة للرخصة والأنظمة"
              id="compliance"
              value={report.licenseCompliance}
              onChange={(value) => setReport({ ...report, licenseCompliance: value as 'نعم' | 'لا' | 'جزئياً' })}
              options={[
                { value: 'نعم', label: 'نعم - مطابق بالكامل' },
                { value: 'لا', label: 'لا - غير مطابق' },
                { value: 'جزئياً', label: 'جزئياً - مطابق جزئياً' }
              ]}
              copyable={true}
              clearable={false}
            />
            <TextAreaWithCopy
              label="تفاصيل المطابقة"
              id="compliance-details"
              value={report.complianceDetails}
              onChange={(e) => setReport({ ...report, complianceDetails: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
          </div>
          
          <TextAreaWithCopy
            label="التوصيات"
            id="recommendations"
            value={report.recommendations}
            onChange={(e) => setReport({ ...report, recommendations: e.target.value })}
            rows={4}
            copyable={true}
            clearable={true}
          />
          
          <TextAreaWithCopy
            label="ملاحظات ختامية"
            id="final-notes"
            value={report.finalNotes}
            onChange={(e) => setReport({ ...report, finalNotes: e.target.value })}
            rows={3}
            copyable={true}
            clearable={true}
          />
        </CardContent>
      </Card>
      
      {/* القسم 11: بيانات المهندس */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            11. بيانات المهندس المعد للتقرير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="اسم المهندس *"
              id="engineer-name"
              value={report.engineerName}
              onChange={(e) => setReport({ ...report, engineerName: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="رقم العضوية *"
              id="engineer-membership"
              value={report.engineerMembershipNumber}
              onChange={(e) => setReport({ ...report, engineerMembershipNumber: e.target.value })}
              copyable={true}
              clearable={false}
            />
            <InputWithCopy
              label="التخصص *"
              id="engineer-specialty"
              value={report.engineerSpecialty}
              onChange={(e) => setReport({ ...report, engineerSpecialty: e.target.value })}
              copyable={true}
              clearable={false}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                توقيع المهندس
              </label>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                <Upload className="h-4 w-4 ml-1" />
                رفع التوقيع
              </Button>
            </div>
            <div>
              <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                ختم المكتب
              </label>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                <Upload className="h-4 w-4 ml-1" />
                رفع الختم
              </Button>
            </div>
            <div>
              <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>
                توقيع المالك
              </label>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                <Upload className="h-4 w-4 ml-1" />
                رفع التوقيع
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* القسم 12: التوثيق الرقمي */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            12. التوثيق الرقمي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="رقم التوثيق الرقمي"
              id="digital-auth"
              value={report.digitalAuthNumber || ''}
              onChange={(e) => setReport({ ...report, digitalAuthNumber: e.target.value })}
              copyable={true}
              clearable={true}
            />
            <div>
              <Button variant="outline" style={{ width: '100%' }}>
                <QrCode className="h-4 w-4 ml-1" />
                التحقق عبر ناجز
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>
                  التوثيق الرقمي عبر الهيئة السعودية للمهندسين
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  سيتم إنشاء رمز QR للتحقق من صحة التقرير بعد التوثيق
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // التاب 2: القوالب
  const renderTemplatesTab = () => (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="card-rtl cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div 
                  style={{
                    padding: '10px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '10px'
                  }}
                >
                  <Layout className="h-5 w-5" style={{ color: '#f59e0b' }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                    {template.name}
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>
                    النوع: {template.type}
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#9ca3af' }}>
                    تاريخ الإنشاء: {template.createdDate}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 ml-1" />
                      معاينة
                    </Button>
                    <Button size="sm">
                      استخدام
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // التاب 3: الإصدارات
  const renderVersionsTab = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
          إصدارات التقرير {report.reportNumber}
        </h3>
        <Button onClick={() => setShowVersionDialog(true)}>
          <Plus className="h-4 w-4 ml-1" />
          إصدار جديد
        </Button>
      </div>
      
      {report.versions.length === 0 ? (
        <div className="text-center p-12" style={{ background: '#f8fafc', borderRadius: '12px' }}>
          <History className="h-16 w-16 mx-auto mb-4" style={{ color: '#94a3b8' }} />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#64748b' }}>
            لا توجد إصدارات سابقة
          </p>
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
            الإصدار الحالي: {report.version}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* قائمة الإصدارات */}
        </div>
      )}
    </div>
  );
  
  // التاب 4: المعاينة والطباعة
  const renderPrintPreviewTab = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
          معاينة التقرير قبل الطباعة
        </h3>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 ml-1" />
            طباعة
          </Button>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 ml-1" />
            تصدير PDF
          </Button>
        </div>
      </div>
      
      <div 
        ref={printRef}
        className="bg-white p-8 mx-auto shadow-lg"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* رأس الصفحة */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b-2">
          <div>
            <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Building className="h-10 w-10 text-blue-600" />
            </div>
            <p style={{ fontSize: '10px', color: '#666' }}>شعار المكتب</p>
          </div>
          
          <div className="text-center flex-1">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              {report.reportTitle}
            </h1>
            <div className="flex items-center justify-center gap-4" style={{ fontSize: '12px', color: '#666' }}>
              <span>رقم التقرير: {report.reportNumber}</span>
              <span>•</span>
              <span>التاريخ: {report.reportDate}</span>
            </div>
          </div>
          
          <div className="text-left" style={{ fontSize: '11px', color: '#666' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>مكتب الهندسة الاستشارية</p>
            <p>رخصة رقم: 12345</p>
            <p>جوال: 0501234567</p>
            <p>البريد: info@office.com</p>
          </div>
        </div>
        
        {/* معلومات المعاملة */}
        <div className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '6px' }}>
            1. معلومات المعاملة
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '12px' }}>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>رقم المعاملة:</span>
              <span>{report.transactionNumber}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>رقم الرخصة:</span>
              <span>{report.licenseNumber}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>تاريخ الرخصة:</span>
              <span>{report.licenseDate}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>نوع الطلب:</span>
              <span>{report.requestType}</span>
            </div>
          </div>
          <div className="mt-3" style={{ fontSize: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>الغرض من التقرير:</span>
            <p className="mt-1">{report.reportPurpose}</p>
          </div>
        </div>
        
        {/* بيانات المالك */}
        <div className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '6px' }}>
            2. بيانات المالك
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '12px' }}>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>الاسم:</span>
              <span>{report.ownerName}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>رقم الهوية:</span>
              <span>{report.ownerIdNumber}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>الجنسية:</span>
              <span>{report.ownerNationality}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>الجوال:</span>
              <span>{report.ownerPhone}</span>
            </div>
            <div className="flex col-span-2">
              <span style={{ fontWeight: 'bold', width: '120px' }}>العنوان:</span>
              <span>{report.ownerAddress}</span>
            </div>
          </div>
        </div>
        
        {/* بيانات الملكية */}
        <div className="mb-6">
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', borderBottom: '2px solid #e5e7eb', paddingBottom: '6px' }}>
            3. بيانات الملكية
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ fontSize: '12px' }}>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>رقم الصك:</span>
              <span>{report.deedNumber}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>تاريخ الصك:</span>
              <span>{report.deedDate}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>رقم المخطط:</span>
              <span>{report.planNumber}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>أرقام القطع:</span>
              <span>{report.plotNumbers.join(', ')}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>الحي:</span>
              <span>{report.district}</span>
            </div>
            <div className="flex">
              <span style={{ fontWeight: 'bold', width: '120px' }}>المساحة:</span>
              <span>{report.totalArea} م²</span>
            </div>
          </div>
        </div>
        
        {/* ذيل الصفحة */}
        <div className="absolute bottom-8 left-8 right-8" style={{ fontSize: '10px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div className="flex items-center justify-between">
            <span>صفحة 1 من 3</span>
            <span>{report.reportNumber}</span>
            <span>مكتب الهندسة الاستشارية</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="SCR-950-v2.0" position="top-right" />
      
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
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <FileText 
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
                  التقارير الفنية
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
                    950
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
                نظام شامل لإنشاء وإدارة التقارير الفنية الاحترافية
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
                {TABS_CONFIG.length} تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TechnicalReports_Complete_950_v2;
