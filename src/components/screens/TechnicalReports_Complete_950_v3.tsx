/**
 * الشاشة 950 - التقارير الفنية v3.0 - نظام شامل ومتقدم
 * ====================================================================
 * 
 * نظام متكامل لإنشاء وإدارة التقارير الفنية الاحترافية
 * 
 * التابات الستة:
 * - 950-01: إنشاء تقرير فني (محسّن ومكثف)
 * - 950-02: إعدادات التقارير الفنية (جديد)
 * - 950-03: القوالب (محسّن مع بيانات الرخصة القديمة)
 * - 950-04: سجل التقارير (جديد)
 * - 950-05: المعاينة والطباعة (محسّن)
 * - 950-06: الإصدارات (موجود)
 * 
 * المميزات الجديدة:
 * - قائمة الأغراض المسموحة قابلة للتخصيص
 * - قالب تصحيح الوضع مع بيانات الرخصة القديمة
 * - أزرار محسّنة: إلغاء، تجميد، اعتماد، تعديل، تصدير PDF، إرسال
 * - سجل شامل لجميع التقارير المنشأة
 * - إعدادات طباعة كثيفة/غير كثيفة
 * - إخفاء/إظهار بيانات محددة في الطباعة
 * - جزء مسؤولية المكتب
 * - بيانات الطلب الشاملة (رخصة البناء، طلب الخدمة، السنة، رقم الطلب)
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  FileText, Printer, Download, Eye, Save, Plus, Edit, Trash2,
  Image as ImageIcon, MapPin, User, Building, Calendar, Hash,
  FileSignature, CheckCircle, Settings, Copy, Upload, QrCode,
  Layout, Layers, RefreshCw, History, Star, FileCheck, X,
  Lock, Unlock, Ban, Send, Archive, AlertCircle, Shield
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ==================== الواجهات ====================

interface ReportPurpose {
  id: string;
  name: string;
  nameEn: string;
  isActive: boolean;
  category: string;
  order: number;
}

interface OldLicenseData {
  licenseNumber: string;
  licenseDate: string; // هجري
  licenseIssuer: string;
  licenseType: string;
}

interface PrintSettings {
  isDense: boolean;
  showTransactionNumber: boolean;
  showBuildingLicense: boolean;
  showServiceRequest: boolean;
  showYear: boolean;
  showRequestNumber: boolean;
  showOfficeResponsibility: boolean;
}

interface ReportInRegistry {
  id: string;
  reportNumber: string;
  reportDate: string;
  transactionNumber: string;
  ownerName: string;
  reportType: string;
  version: string;
  status: 'مسودة' | 'جاهز' | 'معتمد' | 'مجمّد' | 'ملغي';
  createdBy: string;
  createdDate: string;
  lastModified: string;
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
  buildingLicenseNumber: string;
  buildingLicenseDate: string; // هجري
  serviceRequestNumber: string;
  serviceRequestYear: string;
  requestNumber: string;
  requestYear: string;
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
  
  // بيانات الرخصة القديمة (لتصحيح الوضع)
  oldLicense?: OldLicenseData;
  
  // مسؤولية المكتب
  officeResponsibility: string;
  
  // إدارة الإصدارات
  version: string;
  status: 'مسودة' | 'جاهز' | 'معتمد' | 'مجمّد' | 'ملغي';
}

// ==================== إعدادات التابات ====================

const TABS_CONFIG: TabConfig[] = [
  { id: '950-01', number: '950-01', title: 'إنشاء تقرير فني', icon: FileText },
  { id: '950-02', number: '950-02', title: 'إعدادات التقارير', icon: Settings },
  { id: '950-03', number: '950-03', title: 'القوالب', icon: Layout },
  { id: '950-04', number: '950-04', title: 'سجل التقارير', icon: Archive },
  { id: '950-05', number: '950-05', title: 'المعاينة والطباعة', icon: Printer },
  { id: '950-06', number: '950-06', title: 'الإصدارات', icon: History },
];

// ==================== المكون الرئيسي ====================

const TechnicalReports_Complete_950_v3: React.FC = () => {
  const [activeTab, setActiveTab] = useState('950-01');
  const printRef = useRef<HTMLDivElement>(null);
  
  // إعدادات الطباعة
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    isDense: false,
    showTransactionNumber: true,
    showBuildingLicense: true,
    showServiceRequest: true,
    showYear: true,
    showRequestNumber: true,
    showOfficeResponsibility: true
  });
  
  // قائمة الأغراض المسموحة
  const [reportPurposes, setReportPurposes] = useState<ReportPurpose[]>([
    { id: '1', name: 'تصحيح وضع مبنى قائم', nameEn: 'Building Status Correction', isActive: true, category: 'تصحيح', order: 1 },
    { id: '2', name: 'ترخيص بناء جديد', nameEn: 'New Building License', isActive: true, category: 'ترخيص', order: 2 },
    { id: '3', name: 'تصحيح وضع بدون تعديل الاستخدام', nameEn: 'Correction Without Usage Change', isActive: true, category: 'تصحيح', order: 3 },
    { id: '4', name: 'إضافة دور جديد', nameEn: 'Adding New Floor', isActive: true, category: 'توسعة', order: 4 },
    { id: '5', name: 'ترميم مبنى قائم', nameEn: 'Existing Building Renovation', isActive: true, category: 'ترميم', order: 5 },
    { id: '6', name: 'تعديل واجهة المبنى', nameEn: 'Building Facade Modification', isActive: true, category: 'تعديل', order: 6 },
    { id: '7', name: 'تغيير استخدام', nameEn: 'Usage Change', isActive: true, category: 'تعديل', order: 7 },
    { id: '8', name: 'هدم مبنى', nameEn: 'Building Demolition', isActive: true, category: 'هدم', order: 8 },
  ]);
  
  // سجل التقارير
  const [reportsRegistry, setReportsRegistry] = useState<ReportInRegistry[]>([
    {
      id: 'REP-001',
      reportNumber: 'TR-2501-001',
      reportDate: '2025-01-15',
      transactionNumber: '2501045',
      ownerName: 'المهندس عبدالله المطيري',
      reportType: 'تصحيح وضع',
      version: '1.0',
      status: 'معتمد',
      createdBy: 'م. أحمد العلي',
      createdDate: '2025-01-15',
      lastModified: '2025-01-20'
    },
    {
      id: 'REP-002',
      reportNumber: 'TR-2501-002',
      reportDate: '2025-01-18',
      transactionNumber: '2501052',
      ownerName: 'المهندس خالد السعيد',
      reportType: 'ترخيص بناء',
      version: '1.0',
      status: 'جاهز',
      createdBy: 'م. محمد الأحمد',
      createdDate: '2025-01-18',
      lastModified: '2025-01-19'
    },
    {
      id: 'REP-003',
      reportNumber: 'TR-2501-003',
      reportDate: '2025-01-20',
      transactionNumber: '2501058',
      ownerName: 'المهندسة فاطمة الزهراني',
      reportType: 'ترميم',
      version: '2.1',
      status: 'مسودة',
      createdBy: 'م. سارة القحطاني',
      createdDate: '2025-01-20',
      lastModified: '2025-01-22'
    },
  ]);
  
  // بيانات وهمية للمعاملة المرتبطة
  const [linkedTransaction] = useState({
    number: '2501045',
    buildingLicenseNumber: 'رخ-2024-5678',
    buildingLicenseDate: '15/05/1445',
    serviceRequestNumber: 'SRQ-2025-1234',
    serviceRequestYear: '2025',
    requestNumber: 'REQ-2025-456',
    requestYear: '2025',
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
    buildingLicenseNumber: linkedTransaction.buildingLicenseNumber,
    buildingLicenseDate: linkedTransaction.buildingLicenseDate,
    serviceRequestNumber: linkedTransaction.serviceRequestNumber,
    serviceRequestYear: linkedTransaction.serviceRequestYear,
    requestNumber: linkedTransaction.requestNumber,
    requestYear: linkedTransaction.requestYear,
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
    
    oldLicense: {
      licenseNumber: 'رخ-2020-1234',
      licenseDate: '10/03/1441',
      licenseIssuer: 'أمانة منطقة الرياض',
      licenseType: 'ترخيص بناء سكني'
    },
    
    officeResponsibility: 'يتحمل المكتب الهندسي الاستشاري المسؤولية الكاملة عن صحة ودقة جميع المعلومات والبيانات الواردة في هذا التقرير الفني، وذلك أمام جميع الجهات الرسمية ذات العلاقة.',
    
    version: '1.0',
    status: 'مسودة'
  });
  
  // حالات النوافذ
  const [showAddPurposeDialog, setShowAddPurposeDialog] = useState(false);
  const [showDeletePurposeDialog, setShowDeletePurposeDialog] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<ReportPurpose | null>(null);
  const [newPurposeName, setNewPurposeName] = useState('');
  const [newPurposeNameEn, setNewPurposeNameEn] = useState('');
  const [newPurposeCategory, setNewPurposeCategory] = useState('');
  
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
  
  // دالة إضافة غرض جديد
  const handleAddPurpose = () => {
    if (!newPurposeName) return;
    
    const newPurpose: ReportPurpose = {
      id: Date.now().toString(),
      name: newPurposeName,
      nameEn: newPurposeNameEn,
      isActive: true,
      category: newPurposeCategory,
      order: reportPurposes.length + 1
    };
    
    setReportPurposes([...reportPurposes, newPurpose]);
    setNewPurposeName('');
    setNewPurposeNameEn('');
    setNewPurposeCategory('');
    setShowAddPurposeDialog(false);
  };
  
  // دالة حذف غرض
  const handleDeletePurpose = () => {
    if (!selectedPurpose) return;
    setReportPurposes(reportPurposes.filter(p => p.id !== selectedPurpose.id));
    setShowDeletePurposeDialog(false);
    setSelectedPurpose(null);
  };
  
  // دالة تغيير حالة التقرير
  const handleChangeReportStatus = (reportId: string, newStatus: 'معتمد' | 'مجمّد' | 'ملغي') => {
    setReportsRegistry(reportsRegistry.map(r => 
      r.id === reportId ? { ...r, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } : r
    ));
  };
  
  // دالة رندر محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '950-01':
        return renderReportCreationTab();
      case '950-02':
        return renderSettingsTab();
      case '950-03':
        return renderTemplatesTab();
      case '950-04':
        return renderRegistryTab();
      case '950-05':
        return renderPrintPreviewTab();
      case '950-06':
        return renderVersionsTab();
      default:
        return null;
    }
  };
  
  // التاب 1: إنشاء التقرير (محسّن ومكثف)
  const renderReportCreationTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {/* شريط الإجراءات السريعة */}
        <Card className="card-rtl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  style={{
                    padding: '6px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderRadius: '8px'
                  }}
                >
                  <FileText className="h-4 w-4" style={{ color: '#2563eb' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '2px' }}>
                    التقرير الفني: {report.reportNumber}
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>
                    المعاملة: {report.transactionNumber} • الحالة: {report.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Button onClick={handleSave} size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Save className="h-3 w-3 ml-1" />
                  حفظ
                </Button>
                <Button onClick={handlePrint} size="sm" variant="outline">
                  <Printer className="h-3 w-3 ml-1" />
                  طباعة
                </Button>
                <Button onClick={handleExportPDF} size="sm" variant="outline">
                  <Download className="h-3 w-3 ml-1" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* بيانات المعاملة والطلب - مكثفة */}
        <Card className="card-rtl">
          <CardHeader className="p-2.5">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
              بيانات المعاملة والطلب
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2.5 space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <InputWithCopy
                label="رقم المعاملة *"
                id="transaction-number"
                value={report.transactionNumber}
                onChange={(e) => setReport({ ...report, transactionNumber: e.target.value })}
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="رقم رخصة البناء"
                id="building-license"
                value={report.buildingLicenseNumber}
                onChange={(e) => setReport({ ...report, buildingLicenseNumber: e.target.value })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="تاريخ الرخصة (هجري)"
                id="license-date-hijri"
                value={report.buildingLicenseDate}
                onChange={(e) => setReport({ ...report, buildingLicenseDate: e.target.value })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="رقم طلب الخدمة"
                id="service-request"
                value={report.serviceRequestNumber}
                onChange={(e) => setReport({ ...report, serviceRequestNumber: e.target.value })}
                copyable={true}
                clearable={true}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <InputWithCopy
                label="سنة طلب الخدمة"
                id="service-year"
                value={report.serviceRequestYear}
                onChange={(e) => setReport({ ...report, serviceRequestYear: e.target.value })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="رقم الطلب"
                id="request-number"
                value={report.requestNumber}
                onChange={(e) => setReport({ ...report, requestNumber: e.target.value })}
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="سنة الطلب"
                id="request-year"
                value={report.requestYear}
                onChange={(e) => setReport({ ...report, requestYear: e.target.value })}
                copyable={true}
                clearable={true}
              />
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
            </div>
          </CardContent>
        </Card>
        
        {/* الغرض من التقرير */}
        <Card className="card-rtl">
          <CardHeader className="p-2.5">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
              الغرض من التقرير
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2.5">
            <SelectWithCopy
              label="الغرض *"
              id="report-purpose"
              value={report.reportPurpose}
              onChange={(value) => setReport({ ...report, reportPurpose: value })}
              options={reportPurposes.filter(p => p.isActive).map(p => ({ value: p.name, label: p.name }))}
              copyable={true}
              clearable={false}
            />
          </CardContent>
        </Card>
        
        {/* بيانات الرخصة القديمة (لتصحيح الوضع فقط) */}
        {report.requestType === 'تصحيح وضع' && (
          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            <CardHeader className="p-2.5">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#92400e' }}>
                <AlertCircle className="h-4 w-4 inline ml-1" />
                بيانات الرخصة القديمة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2.5 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <InputWithCopy
                  label="رقم الرخصة القديمة"
                  id="old-license-number"
                  value={report.oldLicense?.licenseNumber || ''}
                  onChange={(e) => setReport({
                    ...report,
                    oldLicense: { ...report.oldLicense!, licenseNumber: e.target.value }
                  })}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="تاريخ الرخصة القديمة (هجري)"
                  id="old-license-date"
                  value={report.oldLicense?.licenseDate || ''}
                  onChange={(e) => setReport({
                    ...report,
                    oldLicense: { ...report.oldLicense!, licenseDate: e.target.value }
                  })}
                  copyable={true}
                  clearable={true}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputWithCopy
                  label="جهة الإصدار"
                  id="old-license-issuer"
                  value={report.oldLicense?.licenseIssuer || ''}
                  onChange={(e) => setReport({
                    ...report,
                    oldLicense: { ...report.oldLicense!, licenseIssuer: e.target.value }
                  })}
                  copyable={true}
                  clearable={true}
                />
                <InputWithCopy
                  label="نوع الرخصة"
                  id="old-license-type"
                  value={report.oldLicense?.licenseType || ''}
                  onChange={(e) => setReport({
                    ...report,
                    oldLicense: { ...report.oldLicense!, licenseType: e.target.value }
                  })}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* مسؤولية المكتب */}
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
          <CardHeader className="p-2.5">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#991b1b' }}>
              <Shield className="h-4 w-4 inline ml-1" />
              مسؤولية المكتب الهندسي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2.5">
            <TextAreaWithCopy
              label="نص المسؤولية *"
              id="office-responsibility"
              value={report.officeResponsibility}
              onChange={(e) => setReport({ ...report, officeResponsibility: e.target.value })}
              rows={3}
              copyable={true}
              clearable={false}
            />
          </CardContent>
        </Card>
        
        {/* بيانات المالك - مكثفة */}
        <Card className="card-rtl">
          <CardHeader className="p-2.5">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
              بيانات المالك
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2.5 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <InputWithCopy
                label="اسم المالك *"
                id="owner-name"
                value={report.ownerName}
                onChange={(e) => setReport({ ...report, ownerName: e.target.value })}
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="رقم الهوية *"
                id="owner-id"
                value={report.ownerIdNumber}
                onChange={(e) => setReport({ ...report, ownerIdNumber: e.target.value })}
                copyable={true}
                clearable={false}
              />
              <InputWithCopy
                label="الجوال *"
                id="owner-phone"
                value={report.ownerPhone}
                onChange={(e) => setReport({ ...report, ownerPhone: e.target.value })}
                copyable={true}
                clearable={false}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* الملاحظات والتوصيات - مكثفة */}
        <Card className="card-rtl">
          <CardHeader className="p-2.5">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
              الملاحظات والتوصيات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2.5 space-y-2">
            <TextAreaWithCopy
              label="الملاحظات الفنية"
              id="technical-notes"
              value={report.technicalNotes}
              onChange={(e) => setReport({ ...report, technicalNotes: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
            <TextAreaWithCopy
              label="التوصيات"
              id="recommendations"
              value={report.recommendations}
              onChange={(e) => setReport({ ...report, recommendations: e.target.value })}
              rows={2}
              copyable={true}
              clearable={true}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
  
  // التاب 2: إعدادات التقارير الفنية (جديد)
  const renderSettingsTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Card className="card-rtl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة الأغراض المسموحة
            </CardTitle>
            <Button onClick={() => setShowAddPurposeDialog(true)} size="sm">
              <Plus className="h-4 w-4 ml-1" />
              إضافة غرض جديد
            </Button>
          </CardHeader>
          <CardContent>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الترتيب</TableHead>
                  <TableHead className="text-right">الاسم بالعربية</TableHead>
                  <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportPurposes.map((purpose) => (
                  <TableRow key={purpose.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {purpose.order}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {purpose.name}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>
                      {purpose.nameEn}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline">{purpose.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <EnhancedSwitch
                        id={`purpose-${purpose.id}`}
                        checked={purpose.isActive}
                        onCheckedChange={(checked) => {
                          setReportPurposes(reportPurposes.map(p => 
                            p.id === purpose.id ? { ...p, isActive: checked } : p
                          ));
                        }}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPurpose(purpose);
                          setShowDeletePurposeDialog(true);
                        }}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* إعدادات الطباعة */}
        <Card className="card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إعدادات الطباعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EnhancedSwitch
              id="dense-printing"
              checked={printSettings.isDense}
              onCheckedChange={(checked) => setPrintSettings({ ...printSettings, isDense: checked })}
              label="طباعة كثيفة البيانات"
              description="تقليل المسافات والهوامش لاستغلال أفضل للمساحة"
            />
            
            <div className="border-t pt-3 mt-3">
              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                عرض/إخفاء البيانات في الطباعة
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <EnhancedSwitch
                  id="show-transaction-number"
                  checked={printSettings.showTransactionNumber}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showTransactionNumber: checked })}
                  label="رقم المعاملة"
                  size="sm"
                />
                <EnhancedSwitch
                  id="show-building-license"
                  checked={printSettings.showBuildingLicense}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showBuildingLicense: checked })}
                  label="رقم رخصة البناء"
                  size="sm"
                />
                <EnhancedSwitch
                  id="show-service-request"
                  checked={printSettings.showServiceRequest}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showServiceRequest: checked })}
                  label="رقم طلب الخدمة"
                  size="sm"
                />
                <EnhancedSwitch
                  id="show-year"
                  checked={printSettings.showYear}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showYear: checked })}
                  label="السنة"
                  size="sm"
                />
                <EnhancedSwitch
                  id="show-request-number"
                  checked={printSettings.showRequestNumber}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showRequestNumber: checked })}
                  label="رقم الطلب"
                  size="sm"
                />
                <EnhancedSwitch
                  id="show-responsibility"
                  checked={printSettings.showOfficeResponsibility}
                  onCheckedChange={(checked) => setPrintSettings({ ...printSettings, showOfficeResponsibility: checked })}
                  label="مسؤولية المكتب"
                  size="sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
  
  // التاب 3: القوالب (محسّن)
  const renderTemplatesTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* قالب ترخيص بناء */}
          <Card className="card-rtl cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div 
                  style={{
                    padding: '10px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderRadius: '10px'
                  }}
                >
                  <Layout className="h-5 w-5" style={{ color: '#2563eb' }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                    قالب ترخيص بناء
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    قالب شامل لتقارير ترخيص البناء الجديد
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
          
          {/* قالب تصحيح وضع (محسّن) */}
          <Card className="card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ borderColor: '#f59e0b', borderWidth: '2px' }}>
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                      قالب تصحيح وضع
                    </h3>
                    <Badge style={{ background: '#f59e0b', color: '#fff' }}>محسّن</Badge>
                  </div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    قالب شامل مع بيانات الرخصة القديمة (رقم، تاريخ هجري، جهة الإصدار)
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 mt-2">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>
                      <CheckCircle className="h-3 w-3 inline ml-1" />
                      يتضمن: رقم الرخصة القديمة • تاريخها بالهجري • جهة الإصدار • نوع الرخصة
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 ml-1" />
                      معاينة
                    </Button>
                    <Button size="sm" style={{ background: '#f59e0b' }}>
                      استخدام
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* قالب هدم */}
          <Card className="card-rtl cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div 
                  style={{
                    padding: '10px',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    borderRadius: '10px'
                  }}
                >
                  <Layout className="h-5 w-5" style={{ color: '#ef4444' }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                    قالب هدم
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    قالب شامل لتقارير الهدم والإزالة
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
          
          {/* قالب ترميم */}
          <Card className="card-rtl cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div 
                  style={{
                    padding: '10px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    borderRadius: '10px'
                  }}
                >
                  <Layout className="h-5 w-5" style={{ color: '#059669' }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                    قالب ترميم
                  </h3>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    قالب شامل لتقارير الترميم والصيانة
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
        </div>
      </div>
    </ScrollArea>
  );
  
  // التاب 4: سجل التقارير (جديد)
  const renderRegistryTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Card className="card-rtl">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل التقارير الفنية المنشأة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم التقرير</TableHead>
                  <TableHead className="text-right">المعاملة</TableHead>
                  <TableHead className="text-right">المالك</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الإصدار</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsRegistry.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                      {rep.reportNumber}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {rep.transactionNumber}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {rep.ownerName}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge variant="outline">{rep.reportType}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                      v{rep.version}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: rep.status === 'معتمد' ? '#10b981' :
                                    rep.status === 'جاهز' ? '#3b82f6' :
                                    rep.status === 'مجمّد' ? '#8b5cf6' :
                                    rep.status === 'ملغي' ? '#6b7280' : '#f59e0b',
                          color: '#ffffff'
                        }}
                      >
                        {rep.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          title="تعديل"
                          disabled={rep.status === 'معتمد' || rep.status === 'ملغي'}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="اعتماد"
                          disabled={rep.status === 'معتمد' || rep.status === 'ملغي'}
                          onClick={() => handleChangeReportStatus(rep.id, 'معتمد')}
                          style={{ color: '#10b981' }}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="تجميد"
                          disabled={rep.status === 'مجمّد' || rep.status === 'ملغي'}
                          onClick={() => handleChangeReportStatus(rep.id, 'مجمّد')}
                          style={{ color: '#8b5cf6' }}
                        >
                          <Lock className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="إلغاء"
                          disabled={rep.status === 'ملغي'}
                          onClick={() => handleChangeReportStatus(rep.id, 'ملغي')}
                          style={{ color: '#ef4444' }}
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="تصدير PDF"
                          onClick={handleExportPDF}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="إرسال"
                          style={{ color: '#2563eb' }}
                        >
                          <Send className="h-3 w-3" />
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
    </ScrollArea>
  );
  
  // التاب 5: المعاينة والطباعة (محسّن)
  const renderPrintPreviewTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
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
          className="bg-white p-6 mx-auto shadow-lg"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            fontFamily: 'Arial, Tajawal, sans-serif',
            fontSize: printSettings.isDense ? '11px' : '12px',
            padding: printSettings.isDense ? '12mm' : '20mm'
          }}
        >
          {/* رأس الصفحة */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b-2">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <p style={{ fontSize: '9px', color: '#666' }}>شعار المكتب</p>
            </div>
            
            <div className="text-center flex-1">
              <h1 style={{ fontSize: printSettings.isDense ? '18px' : '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '6px' }}>
                {report.reportTitle}
              </h1>
              <div style={{ fontSize: '11px', color: '#666' }}>
                <span>رقم التقرير: {report.reportNumber}</span>
                <span className="mx-2">•</span>
                <span>التاريخ: {report.reportDate}</span>
              </div>
            </div>
            
            <div className="text-left" style={{ fontSize: '10px', color: '#666' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '3px' }}>مكتب الهندسة الاستشارية</p>
              <p>رخصة رقم: 12345</p>
              <p>جوال: 0501234567</p>
            </div>
          </div>
          
          {/* بيانات المعاملة */}
          {printSettings.showTransactionNumber && (
            <div className="mb-3">
              <h2 style={{ fontSize: printSettings.isDense ? '13px' : '14px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '8px' }}>
                1. بيانات المعاملة
              </h2>
              <div className="grid grid-cols-2 gap-2" style={{ fontSize: printSettings.isDense ? '10px' : '11px' }}>
                <div><strong>رقم المعاملة:</strong> {report.transactionNumber}</div>
                {printSettings.showBuildingLicense && (
                  <>
                    <div><strong>رقم رخصة البناء:</strong> {report.buildingLicenseNumber}</div>
                    <div><strong>تاريخ الرخصة:</strong> {report.buildingLicenseDate}</div>
                  </>
                )}
                {printSettings.showServiceRequest && (
                  <>
                    <div><strong>رقم طلب الخدمة:</strong> {report.serviceRequestNumber}</div>
                    <div><strong>سنة طلب الخدمة:</strong> {report.serviceRequestYear}</div>
                  </>
                )}
                {printSettings.showRequestNumber && (
                  <>
                    <div><strong>رقم الطلب:</strong> {report.requestNumber}</div>
                    {printSettings.showYear && <div><strong>سنة الطلب:</strong> {report.requestYear}</div>}
                  </>
                )}
                <div><strong>نوع الطلب:</strong> {report.requestType}</div>
                <div className="col-span-2"><strong>الغرض:</strong> {report.reportPurpose}</div>
              </div>
            </div>
          )}
          
          {/* بيانات الرخصة القديمة */}
          {report.oldLicense && report.requestType === 'تصحيح وضع' && (
            <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <h2 style={{ fontSize: printSettings.isDense ? '13px' : '14px', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                بيانات الرخصة القديمة
              </h2>
              <div className="grid grid-cols-2 gap-2" style={{ fontSize: printSettings.isDense ? '10px' : '11px' }}>
                <div><strong>رقم الرخصة:</strong> {report.oldLicense.licenseNumber}</div>
                <div><strong>التاريخ (هجري):</strong> {report.oldLicense.licenseDate}</div>
                <div><strong>جهة الإصدار:</strong> {report.oldLicense.licenseIssuer}</div>
                <div><strong>النوع:</strong> {report.oldLicense.licenseType}</div>
              </div>
            </div>
          )}
          
          {/* بيانات المالك */}
          <div className="mb-3">
            <h2 style={{ fontSize: printSettings.isDense ? '13px' : '14px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px', marginBottom: '8px' }}>
              2. بيانات المالك
            </h2>
            <div className="grid grid-cols-2 gap-2" style={{ fontSize: printSettings.isDense ? '10px' : '11px' }}>
              <div><strong>الاسم:</strong> {report.ownerName}</div>
              <div><strong>رقم الهوية:</strong> {report.ownerIdNumber}</div>
              <div><strong>الجوال:</strong> {report.ownerPhone}</div>
            </div>
          </div>
          
          {/* مسؤولية المكتب */}
          {printSettings.showOfficeResponsibility && (
            <div className="mb-3 bg-red-50 border-2 border-red-200 rounded p-3">
              <h2 style={{ fontSize: printSettings.isDense ? '13px' : '14px', fontWeight: 'bold', marginBottom: '8px', color: '#991b1b' }}>
                مسؤولية المكتب الهندسي
              </h2>
              <p style={{ fontSize: printSettings.isDense ? '10px' : '11px', lineHeight: '1.6', color: '#1f2937' }}>
                {report.officeResponsibility}
              </p>
            </div>
          )}
          
          {/* ذيل الصفحة */}
          <div className="mt-6 pt-3 border-t" style={{ fontSize: '9px', color: '#999' }}>
            <div className="flex items-center justify-between">
              <span>صفحة 1 من 1</span>
              <span>{report.reportNumber}</span>
              <span>مكتب الهندسة الاستشارية</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
  
  // التاب 6: الإصدارات
  const renderVersionsTab = () => (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="text-center p-12" style={{ background: '#f8fafc', borderRadius: '12px' }}>
          <History className="h-16 w-16 mx-auto mb-4" style={{ color: '#94a3b8' }} />
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#64748b' }}>
            لا توجد إصدارات سابقة
          </p>
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
            الإصدار الحالي: {report.version}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
  
  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="SCR-950-v3.0" position="top-right" />
      
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
      
      {/* نافذة إضافة غرض جديد */}
      <Dialog open={showAddPurposeDialog} onOpenChange={setShowAddPurposeDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة غرض جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <InputWithCopy
              label="الاسم بالعربية *"
              id="new-purpose-name"
              value={newPurposeName}
              onChange={(e) => setNewPurposeName(e.target.value)}
              copyable={false}
              clearable={true}
            />
            <InputWithCopy
              label="الاسم بالإنجليزية"
              id="new-purpose-name-en"
              value={newPurposeNameEn}
              onChange={(e) => setNewPurposeNameEn(e.target.value)}
              copyable={false}
              clearable={true}
            />
            <InputWithCopy
              label="التصنيف"
              id="new-purpose-category"
              value={newPurposeCategory}
              onChange={(e) => setNewPurposeCategory(e.target.value)}
              copyable={false}
              clearable={true}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPurposeDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddPurpose} disabled={!newPurposeName}>
              <Plus className="h-4 w-4 ml-1" />
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* نافذة حذف غرض */}
      <Dialog open={showDeletePurposeDialog} onOpenChange={setShowDeletePurposeDialog}>
        <DialogContent className="max-w-md dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          
          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#4b5563' }}>
            هل أنت متأكد من حذف الغرض "{selectedPurpose?.name}"؟
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeletePurposeDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleDeletePurpose} style={{ background: '#ef4444' }}>
              <Trash2 className="h-4 w-4 ml-1" />
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicalReports_Complete_950_v3;
