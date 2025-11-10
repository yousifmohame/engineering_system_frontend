import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Map, Plus, Search, Eye, Edit, Trash2, Download, Upload,
  FileImage, Folder, MapPin, Layers, Grid, Route, Building2,
  FileText, Link as LinkIcon, AlertCircle, RefreshCw, Printer,
  Filter, Archive, Bell, BarChart3, History, Users, CheckCircle,
  XCircle, Clock, Share2, Copy, ExternalLink, Settings, 
  Maximize2, ZoomIn, Image as ImageIcon, FileCheck, Box
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import UniversalAdvancedSearchModal from '../UniversalAdvancedSearchModal';
import { copyToClipboard } from '../utils/clipboard';

// واجهات البيانات
interface OrganizationalPlan {
  id: string;
  planNumber: string;
  planName: string;
  createdDate: Date;
  approvalDate: Date;
  approvalNumber: string;
  status: 'active' | 'archived' | 'draft' | 'under_review' | 'expired';
  
  // القطاع والمنطقة
  sector: {
    sectorNumber: 1 | 2 | 3 | 4 | 5;
    sectorName: string;
    region: string;
    city: string;
  };
  
  // الأحياء المرتبطة (يمكن أن يكون مشترك بين أكثر من حي)
  districts: {
    id: string;
    districtName: string;
    districtCode: string;
    municipalityName: string;
    coverage: 'full' | 'partial';
    notes: string;
  }[];
  
  // معلومات المخطط
  planInfo: {
    planType: string;
    planCategory: string;
    totalArea: number;
    numberOfPlots: number;
    numberOfStreets: number;
    residentialPercentage: number;
    commercialPercentage: number;
    servicesPercentage: number;
    greenAreasPercentage: number;
    description: string;
  };
  
  // الحدود والإحداثيات
  boundaries: {
    northBoundary: string;
    southBoundary: string;
    eastBoundary: string;
    westBoundary: string;
    coordinates: { lat: number; lng: number }[];
  };
  
  // الشوارع والطرق
  streets: {
    id: string;
    streetName: string;
    streetNumber: string;
    width: number;
    length: number;
    streetType: string;
    pavementStatus: string;
  }[];
  
  // الخدمات والمرافق
  facilities: {
    mosques: number;
    schools: number;
    healthCenters: number;
    parks: number;
    commercialCenters: number;
    publicParking: number;
    waterTanks: number;
    electricityStations: number;
    otherFacilities: string[];
  };
  
  // حالة التنفيذ
  implementation: {
    implementationStatus: 'not_started' | 'in_progress' | 'completed' | 'partially_completed';
    completionPercentage: number;
    startDate?: Date;
    expectedCompletionDate?: Date;
    actualCompletionDate?: Date;
    contractor?: string;
    supervisor?: string;
    notes: string;
  };
  
  // الملفات والصور
  files: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    category: 'main_plan' | 'detailed_plan' | 'aerial_photo' | 'approval_document' | 'other';
    uploadDate: Date;
    uploadedBy: string;
    description: string;
  }[];
  
  // التحديثات والتعديلات
  updates: {
    id: string;
    updateDate: Date;
    updateType: string;
    updatedBy: string;
    description: string;
    affectedArea: string;
    approvalRequired: boolean;
    approvalStatus?: 'approved' | 'rejected' | 'pending';
  }[];
  
  // الملاحظات
  notes: {
    id: string;
    noteDate: Date;
    noteBy: string;
    noteType: 'general' | 'technical' | 'legal' | 'administrative';
    noteContent: string;
    attachments: string[];
  }[];
  
  // معلومات إضافية
  metadata: {
    createdBy: string;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    viewCount: number;
    downloadCount: number;
    tags: string[];
    keywords: string[];
  };
}

// القطاعات الخمسة
const SECTORS = [
  { number: 1, name: 'القطاع الأول - الشمالي', color: 'blue' },
  { number: 2, name: 'القطاع الثاني - الجنوبي', color: 'green' },
  { number: 3, name: 'القطاع الثالث - الشرقي', color: 'yellow' },
  { number: 4, name: 'القطاع الرابع - الغربي', color: 'purple' },
  { number: 5, name: 'القطاع الخامس - المركزي', color: 'red' }
];

// بيانات تجريبية شاملة - 30 مخطط
const getSamplePlans = (): OrganizationalPlan[] => {
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'];
  const planTypes = ['سكني', 'تجاري', 'صناعي', 'متعدد الاستخدام', 'سكني تجاري', 'زراعي'];
  const planCategories = ['مخطط معتمد', 'مخطط قيد الاعتماد', 'مخطط تفصيلي', 'مخطط عام', 'مخطط قديم محدث'];
  const statuses: Array<'active' | 'archived' | 'draft' | 'under_review' | 'expired'> = ['active', 'archived', 'draft', 'under_review', 'expired'];

  const plans: OrganizationalPlan[] = [];

  for (let i = 1; i <= 30; i++) {
    const sectorNum = ((i - 1) % 5 + 1) as 1 | 2 | 3 | 4 | 5;
    const sector = SECTORS[sectorNum - 1];
    const city = cities[i % cities.length];
    const status = statuses[i % statuses.length];
    const planType = planTypes[i % planTypes.length];
    const createdDate = new Date(2020 + (i % 5), (i % 12), (i % 28) + 1);
    const approvalDate = new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    // توليد أحياء متعددة (1-4 أحياء لكل مخطط)
    const numDistricts = Math.min((i % 4) + 1, 4);
    const districts = [];
    for (let d = 1; d <= numDistricts; d++) {
      districts.push({
        id: `DIST-${i}-${d}`,
        districtName: `حي ${['النرجس', 'الملقا', 'العليا', 'الياسمين', 'النخيل', 'الربوة', 'الروضة', 'السلامة'][((i + d) % 8)]}`,
        districtCode: `D-${String(i * 10 + d).padStart(4, '0')}`,
        municipalityName: `بلدية ${['شمال', 'جنوب', 'شرق', 'غرب', 'وسط'][d % 5]} ${city}`,
        coverage: d === 1 ? 'full' : 'partial',
        notes: d > 1 ? `يشمل ${['الجزء الشمالي', 'الجزء الجنوبي', 'الجزء الشرقي'][d % 3]} من الحي` : 'يشمل كامل الحي'
      });
    }

    // توليد شوارع
    const numStreets = 5 + (i % 15);
    const streets = [];
    for (let s = 1; s <= numStreets; s++) {
      streets.push({
        id: `STR-${i}-${s}`,
        streetName: `${['شارع الملك فهد', 'طريق الملك عبدالله', 'شارع العليا', 'طريق المطار', 'شارع التحلية', 'طريق الدائري'][s % 6]} - ${s}`,
        streetNumber: `${i}/${s}`,
        width: [12, 15, 20, 25, 30, 40][s % 6],
        length: 200 + (s * 50),
        streetType: ['رئيسي', 'فرعي', 'محلي', 'خدمة'][s % 4],
        pavementStatus: ['مسفلت', 'قيد التسفيلت', 'ترابي'][s % 3]
      });
    }

    const totalArea = 500000 + (i * 50000);
    const numberOfPlots = 200 + (i * 50);

    const plan: OrganizationalPlan = {
      id: `PLAN-${String(i).padStart(3, '0')}`,
      planNumber: `${i * 100}/${2020 + (i % 5)}`,
      planName: `مخطط ${['النهضة', 'التطوير', 'الأمل', 'المستقبل', 'الرياض الجديدة', 'جدة الحديثة', 'الدمام الكبرى', 'المدينة العصرية'][i % 8]} ${i}`,
      createdDate: createdDate,
      approvalDate: approvalDate,
      approvalNumber: `APP-${2020 + (i % 5)}-${String(i).padStart(4, '0')}`,
      status: status,

      sector: {
        sectorNumber: sectorNum,
        sectorName: sector.name,
        region: `منطقة ${city}`,
        city: city
      },

      districts: districts,

      planInfo: {
        planType: planType,
        planCategory: planCategories[i % planCategories.length],
        totalArea: totalArea,
        numberOfPlots: numberOfPlots,
        numberOfStreets: numStreets,
        residentialPercentage: 50 + (i % 20),
        commercialPercentage: 10 + (i % 15),
        servicesPercentage: 5 + (i % 10),
        greenAreasPercentage: 10 + (i % 15),
        description: `مخطط تنظيمي ${planType} يشمل ${numDistricts} ${numDistricts === 1 ? 'حي' : 'أحياء'} بمساحة إجمالية ${totalArea.toLocaleString()} م² ويحتوي على ${numberOfPlots} قطعة`
      },

      boundaries: {
        northBoundary: `شارع ${['الملك فهد', 'الملك عبدالله', 'العليا'][i % 3]} - ${i}`,
        southBoundary: `طريق ${['الدائري', 'المطار', 'الخرج'][i % 3]} - ${i}`,
        eastBoundary: `شارع ${['التحلية', 'العروبة', 'الأمير محمد'][i % 3]} - ${i}`,
        westBoundary: `طريق ${['المدينة', 'مكة', 'الطائف'][i % 3]} - ${i}`,
        coordinates: [
          { lat: 24.7136 + (i * 0.01), lng: 46.6753 + (i * 0.01) },
          { lat: 24.7136 + (i * 0.01), lng: 46.6853 + (i * 0.01) },
          { lat: 24.7236 + (i * 0.01), lng: 46.6853 + (i * 0.01) },
          { lat: 24.7236 + (i * 0.01), lng: 46.6753 + (i * 0.01) }
        ]
      },

      streets: streets,

      facilities: {
        mosques: 2 + (i % 5),
        schools: 1 + (i % 4),
        healthCenters: (i % 3) === 0 ? 1 : 0,
        parks: 3 + (i % 6),
        commercialCenters: (i % 4) === 0 ? 1 : 0,
        publicParking: 5 + (i % 8),
        waterTanks: 2 + (i % 3),
        electricityStations: 1 + (i % 2),
        otherFacilities: i % 3 === 0 ? ['محطة وقود', 'مركز شرطة'] : []
      },

      implementation: {
        implementationStatus: ['not_started', 'in_progress', 'completed', 'partially_completed'][i % 4] as any,
        completionPercentage: i % 4 === 2 ? 100 : (i % 4) * 33,
        startDate: i % 4 !== 0 ? new Date(2022, (i % 12), 1) : undefined,
        expectedCompletionDate: i % 4 === 1 ? new Date(2026, (i % 12), 1) : undefined,
        actualCompletionDate: i % 4 === 2 ? new Date(2024, (i % 12), 1) : undefined,
        contractor: i % 4 !== 0 ? `شركة ${['البناء', 'التطوير', 'الإنشاءات'][i % 3]} للمقاولات` : undefined,
        supervisor: i % 4 !== 0 ? `م. ${['أحمد السالم', 'محمد الغامدي', 'خالد العتيبي'][i % 3]}` : '',
        notes: i % 4 === 1 ? 'العمل جاري بشكل منتظم' : ''
      },

      files: generateFiles(i, status),
      updates: generateUpdates(i, status),
      notes: generateNotes(i),

      metadata: {
        createdBy: `م. ${['سارة الأحمدي', 'فهد العتيبي', 'نورة القحطاني'][i % 3]}`,
        lastModifiedBy: `م. ${['أحمد السالم', 'محمد الغامدي', 'خالد العتيبي'][i % 3]}`,
        lastModifiedDate: new Date(2025, 9, i),
        viewCount: 50 + (i * 10),
        downloadCount: 10 + (i * 3),
        tags: [`قطاع-${sectorNum}`, planType, city, ...districts.map(d => d.districtName)],
        keywords: ['مخطط', 'تنظيمي', planType, city, sector.name.split(' - ')[1]]
      }
    };

    plans.push(plan);
  }

  return plans;
};

// دالة لتوليد الملفات
function generateFiles(index: number, status: string) {
  const files = [];
  const categories: Array<'main_plan' | 'detailed_plan' | 'aerial_photo' | 'approval_document' | 'other'> = 
    ['main_plan', 'detailed_plan', 'aerial_photo', 'approval_document', 'other'];
  
  if (status !== 'draft') {
    for (let i = 0; i < Math.min(index % 8 + 2, 10); i++) {
      files.push({
        id: `FILE-${index}-${i + 1}`,
        fileName: `${['المخطط_الرئيسي', 'المخطط_التفصيلي', 'الصورة_الجوية', 'قرار_الاعتماد', 'الحدود_والإحداثيات', 'جدول_القطع', 'شبكة_الشوارع', 'المرافق_العامة', 'الملاحظات_الفنية', 'تقرير_التنفيذ'][i % 10]}_${index}.${['pdf', 'dwg', 'jpg', 'png', 'kml'][i % 5]}`,
        fileType: ['PDF', 'DWG', 'JPG', 'PNG', 'KML'][i % 5],
        fileSize: 1024 + (i * 512),
        fileUrl: `/files/plans/${index}/${i + 1}`,
        category: categories[i % categories.length],
        uploadDate: new Date(2025, 9, index - i),
        uploadedBy: `م. ${['أحمد', 'سارة', 'فهد', 'نورة'][i % 4]}`,
        description: `ملف ${['المخطط الأساسي', 'المخطط التفصيلي', 'الصورة الجوية', 'الاعتماد', 'إضافي'][i % 5]}`
      });
    }
  }
  
  return files;
}

// دالة لتوليد التحديثات
function generateUpdates(index: number, status: string) {
  const updates = [];
  
  if (status === 'active' && index % 3 === 0) {
    for (let i = 0; i < Math.min(index % 4 + 1, 3); i++) {
      updates.push({
        id: `UPD-${index}-${i + 1}`,
        updateDate: new Date(2025, 8 + i, index),
        updateType: ['تعديل حدود', 'إضافة مرافق', 'تحديث شوارع', 'تعديل استخدامات'][i % 4],
        updatedBy: `م. ${['أحمد السالم', 'محمد الغامدي', 'خالد العتيبي'][i % 3]}`,
        description: `تحديث ${['الحدود الشمالية', 'منطقة الخدمات', 'شبكة الشوارع', 'نسب الاستخدامات'][i % 4]}`,
        affectedArea: `${['الجزء الشمالي', 'المنطقة المركزية', 'الجزء الجنوبي'][i % 3]} من المخطط`,
        approvalRequired: i % 2 === 0,
        approvalStatus: i % 2 === 0 ? (['approved', 'rejected', 'pending'][i % 3] as any) : undefined
      });
    }
  }
  
  return updates;
}

// دالة لتوليد الملاحظات
function generateNotes(index: number) {
  const notes = [];
  const noteTypes: Array<'general' | 'technical' | 'legal' | 'administrative'> = ['general', 'technical', 'legal', 'administrative'];
  
  for (let i = 0; i < Math.min(index % 5 + 1, 5); i++) {
    notes.push({
      id: `NOTE-${index}-${i + 1}`,
      noteDate: new Date(2025, 9, index - (i * 5)),
      noteBy: `${['م.', 'د.', 'أ.'][i % 3]} ${['أحمد السالم', 'محمد الغامدي', 'خالد العتيبي', 'سارة الأحمدي'][i % 4]}`,
      noteType: noteTypes[i % noteTypes.length],
      noteContent: [
        'المخطط معتمد وجاهز للتنفيذ',
        'يوجد بعض التعديلات المطلوبة على الحدود الشمالية',
        'تم مراجعة جميع الوثائق القانونية',
        'يجب تحديث شبكة الشوارع',
        'المخطط متوافق مع المعايير والمواصفات'
      ][i % 5],
      attachments: i === 0 ? [`attachment-${index}-1.pdf`] : []
    });
  }
  
  return notes;
}

const OrganizationalPlansManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('918-01');
  const [plans, setPlans] = useState<OrganizationalPlan[]>(getSamplePlans());
  const [selectedPlan, setSelectedPlan] = useState<OrganizationalPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleCreatePlan = () => {
    toast.success('تم إنشاء مخطط جديد بنجاح');
    setIsCreateDialogOpen(false);
  };

  const handleSavePlan = () => {
    if (!selectedPlan) return;
    toast.success('تم حفظ بيانات المخطط بنجاح');
  };

  const handleDownloadFile = (file: any) => {
    toast.success(`جاري تنزيل: ${file.fileName}`);
  };

  const handleAdvancedSearch = (results: any) => {
    console.log('Advanced Search Results:', results);
    toast.success(`تم العثور على ${results.count} نتيجة`);
    // يمكن هنا تطبيق النتائج على البيانات المعروضة
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.planNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.districts.some(d => d.districtName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSector = filterSector === 'all' || plan.sector.sectorNumber.toString() === filterSector;
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-700' },
      archived: { label: 'مؤرشف', className: 'bg-gray-100 text-gray-700' },
      draft: { label: 'مسودة', className: 'bg-blue-100 text-blue-700' },
      under_review: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-700' },
      expired: { label: 'منتهي', className: 'bg-red-100 text-red-700' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.className} style={{ fontFamily: 'Tajawal, sans-serif' }}>{config.label}</Badge>;
  };

  const getSectorBadge = (sectorNumber: number) => {
    const sector = SECTORS[sectorNumber - 1];
    return (
      <Badge className={`bg-${sector.color}-100 text-${sector.color}-700`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
        القطاع {sectorNumber}
      </Badge>
    );
  };

  const getImplementationBadge = (status: string) => {
    const statusConfig = {
      not_started: { label: 'لم يبدأ', className: 'bg-gray-100 text-gray-700' },
      in_progress: { label: 'جاري التنفيذ', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'مكتمل', className: 'bg-green-100 text-green-700' },
      partially_completed: { label: 'مكتمل جزئياً', className: 'bg-yellow-100 text-yellow-700' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return <Badge className={config.className} style={{ fontFamily: 'Tajawal, sans-serif' }}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4" dir="rtl">
      {/* رأس الشاشة */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخططات التنظيمية</h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                أرشفة وإدارة المخططات التنظيمية المعتمدة - نظام بحث متقدم ومرن
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-700" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-918
            </Badge>
            <Badge className="bg-blue-100 text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {plans.length} مخطط
            </Badge>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'الإجمالي', value: plans.length, icon: Map, color: 'blue' },
            { label: 'نشط', value: plans.filter(p => p.status === 'active').length, icon: CheckCircle, color: 'green' },
            { label: 'مؤرشف', value: plans.filter(p => p.status === 'archived').length, icon: Archive, color: 'gray' },
            { label: 'القطع', value: plans.reduce((sum, p) => sum + p.planInfo.numberOfPlots, 0).toLocaleString(), icon: Grid, color: 'purple' },
            { label: 'الملفات', value: plans.reduce((sum, p) => sum + p.files.length, 0), icon: FileImage, color: 'orange' },
            { label: 'القطاعات', value: new Set(plans.map(p => p.sector.sectorNumber)).size, icon: Layers, color: 'indigo' }
          ].map((stat, idx) => (
            <Card key={idx} className="card-rtl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-2xl mt-1" style={{ fontFamily: 'Courier New, monospace' }}>{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* السايد بار الرأسي للتابات */}
        <div className="w-64 flex-shrink-0">
          <Card className="card-rtl sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التابات (18)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="p-2 space-y-0.5">
                  {[
                    { id: '918-01', icon: FileText, label: 'قائمة المخططات' },
                    { id: '918-02', icon: Plus, label: 'إضافة مخطط جديد' },
                    { id: '918-03', icon: Map, label: 'معلومات المخطط' },
                    { id: '918-04', icon: Building2, label: 'الأحياء المرتبطة' },
                    { id: '918-05', icon: Layers, label: 'القطاع والمنطقة' },
                    { id: '918-06', icon: FileImage, label: 'الملفات والصور' },
                    { id: '918-07', icon: FileCheck, label: 'البيانات التفصيلية' },
                    { id: '918-08', icon: MapPin, label: 'الحدود والإحداثيات' },
                    { id: '918-09', icon: Grid, label: 'المساحات والقطع' },
                    { id: '918-10', icon: Route, label: 'الشوارع والطرق' },
                    { id: '918-11', icon: Box, label: 'الخدمات والمرافق' },
                    { id: '918-12', icon: Settings, label: 'حالة التنفيذ' },
                    { id: '918-13', icon: RefreshCw, label: 'التحديثات والتعديلات' },
                    { id: '918-14', icon: FileText, label: 'الملاحظات والتعليقات' },
                    { id: '918-15', icon: Printer, label: 'التصدير والطباعة' },
                    { id: '918-16', icon: Archive, label: 'الأرشفة' },
                    { id: '918-17', icon: BarChart3, label: 'الإحصائيات' },
                    { id: '918-18', icon: History, label: 'السجل التاريخي' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-all ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {tab.label}
                        </div>
                        <div className="text-[10px] opacity-60" style={{ fontFamily: 'Courier New, monospace' }}>
                          {tab.id}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1">
          <Card className="card-rtl">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="p-6">

                {/* 918-01: قائمة المخططات */}
                {activeTab === '918-01' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المخططات التنظيمية</h2>
                        <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          البحث والتصفح في الأرشيف - {filteredPlans.length} مخطط
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#10b981] hover:bg-[#059669]">
                        <Plus className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>مخطط جديد</span>
                      </Button>
                    </div>

                    <Separator />

                    {/* البحث والتصفية المتقدمة */}
                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-2 form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>البحث السريع</Label>
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            className="input-field pr-10"
                            placeholder="بحث برقم المخطط أو اسمه أو الحي..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                              fontFamily: 'Tajawal, sans-serif',
                              border: '2px solid #e5e7eb',
                              backgroundColor: '#ffffff',
                              textAlign: 'right',
                              direction: 'rtl'
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</Label>
                        <Select value={filterSector} onValueChange={setFilterSector}>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع القطاعات</SelectItem>
                            {SECTORS.map(sector => (
                              <SelectItem key={sector.number} value={sector.number.toString()}>
                                {sector.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الحالات</SelectItem>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="archived">مؤرشف</SelectItem>
                            <SelectItem value="draft">مسودة</SelectItem>
                            <SelectItem value="under_review">قيد المراجعة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setIsAdvancedSearchOpen(true)}
                        >
                          <Filter className="h-4 w-4 ml-2" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث متقدم</span>
                        </Button>
                      </div>
                    </div>

                    {/* جدول المخططات */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المخطط</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المخطط</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأحياء</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة (م²)</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملفات</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPlans.map((plan) => (
                            <TableRow key={plan.id} className="hover:bg-gray-50">
                              <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                                <div className="flex items-center gap-2 justify-end">
                                  <span>{plan.planNumber}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                      const success = await copyToClipboard(plan.planNumber);
                                      if (success) {
                                        toast.success('تم نسخ رقم المخطط');
                                      } else {
                                        toast.error('فشل نسخ رقم المخطط');
                                      }
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <div className="max-w-[200px] truncate" title={plan.planName}>
                                  {plan.planName}
                                </div>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <div className="flex flex-wrap gap-1 justify-end">
                                  {plan.districts.slice(0, 2).map(d => (
                                    <Badge key={d.id} className="bg-blue-50 text-blue-700 text-[10px]">
                                      {d.districtName}
                                    </Badge>
                                  ))}
                                  {plan.districts.length > 2 && (
                                    <Badge className="bg-gray-100 text-gray-700 text-[10px]">
                                      +{plan.districts.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {getSectorBadge(plan.sector.sectorNumber)}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                                {plan.planInfo.totalArea.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                                {plan.planInfo.numberOfPlots}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <FileImage className="h-4 w-4 text-gray-400" />
                                  <span style={{ fontFamily: 'Courier New, monospace' }}>{plan.files.length}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {getStatusBadge(plan.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPlan(plan);
                                      setActiveTab('918-03');
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      if (plan.files.length > 0) {
                                        handleDownloadFile(plan.files[0]);
                                      } else {
                                        toast.error('لا توجد ملفات للتنزيل');
                                      }
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* إحصائيات تفصيلية */}
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المساحات</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {(plans.reduce((sum, p) => sum + p.planInfo.totalArea, 0) / 1000000).toFixed(2)} كم²
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القطع</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {Math.round(plans.reduce((sum, p) => sum + p.planInfo.numberOfPlots, 0) / plans.length)}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الأحياء</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {new Set(plans.flatMap(p => p.districts.map(d => d.districtName))).size}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>مكتمل التنفيذ</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {plans.filter(p => p.implementation.implementationStatus === 'completed').length}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل المشاهدات</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {Math.round(plans.reduce((sum, p) => sum + p.metadata.viewCount, 0) / plans.length)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* 918-02: إضافة مخطط جديد */}
                {activeTab === '918-02' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة مخطط تنظيمي جديد</h2>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        املأ البيانات الأساسية للمخطط الجديد
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المخطط *</Label>
                        <Input
                          className="input-field"
                          placeholder="مثال: 3000/2025"
                          style={{ 
                            fontFamily: 'Courier New, monospace',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group col-span-2">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المخطط *</Label>
                        <Input
                          className="input-field"
                          placeholder="مثال: مخطط النهضة الشمالي"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع *</Label>
                        <Select>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue placeholder="اختر القطاع" />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTORS.map(sector => (
                              <SelectItem key={sector.number} value={sector.number.toString()}>
                                {sector.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة *</Label>
                        <Select>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riyadh">الرياض</SelectItem>
                            <SelectItem value="jeddah">جدة</SelectItem>
                            <SelectItem value="dammam">الدمام</SelectItem>
                            <SelectItem value="makkah">مكة المكرمة</SelectItem>
                            <SelectItem value="madinah">المدينة المنورة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المخطط *</Label>
                        <Select>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">سكني</SelectItem>
                            <SelectItem value="commercial">تجاري</SelectItem>
                            <SelectItem value="industrial">صناعي</SelectItem>
                            <SelectItem value="mixed">متعدد الاستخدام</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الإجمالية (م²) *</Label>
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="0"
                          style={{ 
                            fontFamily: 'Courier New, monospace',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد القطع *</Label>
                        <Input
                          type="number"
                          className="input-field"
                          placeholder="0"
                          style={{ 
                            fontFamily: 'Courier New, monospace',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاعتماد *</Label>
                        <Input
                          type="date"
                          className="input-field"
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group col-span-3">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</Label>
                        <Textarea
                          className="input-field"
                          rows={3}
                          placeholder="وصف تفصيلي للمخطط..."
                          style={{ 
                            fontFamily: 'Tajawal, sans-serif',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع الملفات</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسحب الملفات هنا أو انقر للتحميل
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الصيغ المدعومة: PDF, DWG, JPG, PNG, KML
                        </p>
                        <Button variant="outline" className="mt-3">
                          <Upload className="h-4 w-4 ml-2" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>اختر الملفات</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إلغاء
                      </Button>
                      <Button onClick={handleCreatePlan} className="bg-[#10b981] hover:bg-[#059669]">
                        <Map className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>حفظ المخطط</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* الرسالة الافتراضية */}
                {!selectedPlan && ['918-03', '918-04', '918-05', '918-06', '918-07', '918-08', '918-09', '918-10', '918-11', '918-12', '918-13', '918-14', '918-15', '918-16', '918-17', '918-18'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <Map className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرجاء اختيار مخطط من القائمة أو إضافة مخطط جديد
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setActiveTab('918-01')} variant="outline">
                        <FileText className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض القائمة</span>
                      </Button>
                      <Button onClick={() => setActiveTab('918-02')} className="bg-[#10b981] hover:bg-[#059669]">
                        <Plus className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>مخطط جديد</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* عرض معلومات المخطط المحدد */}
                {selectedPlan && ['918-03', '918-04', '918-05', '918-06', '918-07', '918-08', '918-09', '918-10', '918-11', '918-12', '918-13', '918-14', '918-15', '918-16', '918-17', '918-18'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Map className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تاب {activeTab}
                    </h3>
                    <p className="text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المخطط: {selectedPlan.planNumber}
                    </p>
                    <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {selectedPlan.planName}
                    </p>
                    
                    {/* معلومات سريعة */}
                    <div className="mt-6 grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                      <Card className="card-rtl">
                        <CardContent className="p-4 text-right">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</div>
                          <div className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            القطاع {selectedPlan.sector.sectorNumber}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-4 text-right">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأحياء</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {selectedPlan.districts.length}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-4 text-right">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</div>
                          <div className="text-sm mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {selectedPlan.planInfo.totalArea.toLocaleString()} م²
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="card-rtl">
                        <CardContent className="p-4 text-right">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملفات</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {selectedPlan.files.length}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Badge className="bg-purple-100 text-purple-700 mt-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      البيانات كاملة ومتاحة
                    </Badge>
                  </div>
                )}

              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* نافذة إضافة مخطط */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة مخطط تنظيمي جديد
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أضف المعلومات الأساسية للمخطط وابدأ برفع الملفات
            </DialogDescription>
          </DialogHeader>

          <div className="form-rtl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المخطط</Label>
                <Input
                  className="input-field"
                  placeholder="مثال: 3000/2025"
                  style={{ 
                    fontFamily: 'Courier New, monospace',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
              </div>
              <div className="form-group">
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</Label>
                <Select>
                  <SelectTrigger className="input-field" style={{ 
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}>
                    <SelectValue placeholder="اختر القطاع" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map(sector => (
                      <SelectItem key={sector.number} value={sector.number.toString()}>
                        القطاع {sector.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="dialog-footer">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إلغاء
            </Button>
            <Button onClick={handleCreatePlan} className="bg-[#10b981] hover:bg-[#059669]">
              <Map className="h-4 w-4 ml-2" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة البحث المتقدم الشامل */}
      <UniversalAdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
      />
    </div>
  );
};

export default OrganizationalPlansManagement;
