import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  FileText, Plus, Search, Eye, Edit, Trash2, Download, Upload,
  CheckCircle, XCircle, Clock, FileCheck, Settings, User, MapPin,
  Calendar, Ruler, Image as ImageIcon, List, FileSignature, Home,
  Building, Save, Send, Printer, Copy, Filter, Link as LinkIcon,
  AlertCircle, RefreshCw, LayoutTemplate, Maximize2, ChevronDown,
  Palette, Type, Box, Table as TableIcon, Move, Sliders, Layers,
  Archive, Bell, BarChart3, History, Stamp, Paperclip, Shield,
  GitBranch, TrendingUp, Users, Zap, Star, BookOpen
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';

// واجهات البيانات
interface TechnicalReport {
  id: string;
  reportNumber: string;
  reportDate: Date;
  reportDateHijri: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  createdBy: string;
  
  header: {
    companyName: string;
    companyLogo?: string;
    licenseNumber: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    crNumber: string;
  };
  
  footer: {
    preparedBy: string;
    preparedPosition: string;
    reviewedBy: string;
    reviewedPosition: string;
    approvedBy: string;
    approvedPosition: string;
    footerText: string;
    stampImage?: string;
  };
  
  purpose: string;
  detailedPurpose: string;
  
  owner: {
    name: string;
    nationalId: string;
    crNumber: string;
    phone: string;
    email: string;
    address: string;
  };
  
  property: {
    deedNumber: string;
    deedDate: Date;
    deedDateHijri: string;
    issueDate: Date;
    issueDateHijri: string;
    region: string;
    city: string;
    district: string;
    plotNumber: string;
    planNumber: string;
    landArea: number;
    buildingArea: number;
    propertyType: string;
  };
  
  setbacks: {
    north: { setback: number; length: number; description: string };
    south: { setback: number; length: number; description: string };
    east: { setback: number; length: number; description: string };
    west: { setback: number; length: number; description: string };
    streetDirection: string;
    streetWidth: number;
    notes: string;
  };
  
  images: {
    aerialImage?: string;
    siteImage?: string;
    planImage?: string;
    additionalImages: string[];
  };
  
  request: {
    licenseNumber: string;
    requestNumber: string;
    requestType: string;
    requestDate: Date;
    requestDateHijri: string;
  };
  
  components: {
    id: string;
    name: string;
    existing: { status: string; area: number; floors: number; units: number };
    approved: { status: string; area: number; floors: number; units: number };
    proposed: { status: string; area: number; floors: number; units: number };
    notes: string;
  }[];
  
  siteStatus: {
    status: 'existing' | 'under_construction' | 'vacant' | 'partially_existing' | 'existing_with_occupancy';
    description: string;
    occupancyCertNumber?: string;
    completionPercentage?: number;
  };
  
  template: {
    showExisting: boolean;
    showApproved: boolean;
    showProposed: boolean;
    showImages: boolean;
    showStamp: boolean;
    pageSize: 'A4' | 'A3' | 'Letter';
    orientation: 'portrait' | 'landscape';
    fontSize: number;
    lineHeight: number;
    margins: { top: number; bottom: number; left: number; right: number };
    headerHeight: number;
    footerHeight: number;
    showWatermark: boolean;
    watermarkText: string;
    colorScheme: string;
  };
  
  signatures: {
    id: string;
    signerName: string;
    signerPosition: string;
    signatureType: 'digital' | 'stamp' | 'handwritten';
    signatureDate: Date;
    signatureImage?: string;
    verified: boolean;
  }[];
  
  attachments: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: Date;
    uploadedBy: string;
    category: string;
  }[];
  
  revisions: {
    id: string;
    revisionNumber: string;
    revisionDate: Date;
    revisedBy: string;
    changes: string;
    reason: string;
  }[];
  
  notifications: {
    id: string;
    type: 'approval' | 'rejection' | 'review' | 'update';
    message: string;
    sentTo: string[];
    sentDate: Date;
    read: boolean;
  }[];
}

// بيانات تجريبية شاملة - 20 تقرير
const getSampleReports = (): TechnicalReport[] => {
  const engineers = [
    'م. أحمد محمد السالم',
    'م. سارة أحمد الأحمدي',
    'م. فهد عبدالله العتيبي',
    'م. نورة سعد القحطاني',
    'م. خالد محمد الشمري',
    'م. لمى عبدالرحمن الدوسري',
    'م. عبدالله فيصل المطيري',
    'م. هند علي الزهراني'
  ];

  const cities = [
    { region: 'منطقة الرياض', city: 'الرياض', districts: ['حي النرجس', 'حي الملقا', 'حي العليا', 'حي الياسمين', 'حي النخيل', 'حي الربوة'] },
    { region: 'منطقة مكة المكرمة', city: 'جدة', districts: ['حي الزهراء', 'حي الروضة', 'حي السلامة', 'حي الحمراء', 'حي النعيم'] },
    { region: 'المنطقة الشرقية', city: 'الدمام', districts: ['حي الفيصلية', 'حي الشاطئ', 'حي الضباب', 'حي المزروعية'] },
    { region: 'منطقة المدينة المنورة', city: 'المدينة المنورة', districts: ['حي العزيزية', 'حي الخالدية', 'حي قباء', 'حي الحرة'] }
  ];

  const owners = [
    { name: 'شركة أبناء صالح عبدالعزيز الرفيدي للتجارة', type: 'company', cr: '6331...01208', national: '1012345678' },
    { name: 'م. عبدالله محمد الشمري', type: 'individual', cr: '', national: '1098765432' },
    { name: 'شركة التطوير العقاري المحدودة', type: 'company', cr: '1010567890', national: '' },
    { name: 'أ. فاطمة أحمد القحطاني', type: 'individual', cr: '', national: '1123456789' },
    { name: 'مؤسسة النور للمقاولات', type: 'company', cr: '7845...98765', national: '' },
    { name: 'د. محمد سعد العتيبي', type: 'individual', cr: '', national: '1034567890' },
    { name: 'شركة الأمل للاستثمار العقاري', type: 'company', cr: '5612...34567', national: '' },
    { name: 'م. سارة علي الغامدي', type: 'individual', cr: '', national: '1087654321' }
  ];

  const purposes = [
    { value: 'license', label: 'الحصول على ترخيص بناء' },
    { value: 'modification', label: 'تعديل ترخيص قائم' },
    { value: 'correction', label: 'تصحيح وضع مبني قائم' },
    { value: 'renewal', label: 'تجديد ترخيص' },
    { value: 'occupancy', label: 'الحصول على شهادة إشغال' },
    { value: 'survey', label: 'رفع مساحي' },
    { value: 'demolition', label: 'ترخيص هدم' },
    { value: 'addition', label: 'إضافة ملحق' }
  ];

  const propertyTypes = ['سكني', 'تجاري', 'صناعي', 'متعدد الاستخدام', 'إداري', 'تعليمي'];
  const statuses: Array<'draft' | 'pending_review' | 'approved' | 'rejected'> = ['draft', 'pending_review', 'approved', 'rejected'];

  const reports: TechnicalReport[] = [];

  for (let i = 1; i <= 20; i++) {
    const cityData = cities[Math.floor(Math.random() * cities.length)];
    const owner = owners[i % owners.length];
    const purpose = purposes[i % purposes.length];
    const engineer = engineers[i % engineers.length];
    const status = statuses[i % statuses.length];
    const propertyType = propertyTypes[i % propertyTypes.length];
    const district = cityData.districts[i % cityData.districts.length];

    const deedDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const reportDate = new Date(2025, 9, i);
    const landArea = 400 + Math.floor(Math.random() * 1200);
    const buildingArea = Math.floor(landArea * (0.5 + Math.random() * 0.3));

    const report: TechnicalReport = {
      id: `TR-${String(i).padStart(3, '0')}`,
      reportNumber: `TR-2025-${String(i).padStart(3, '0')}`,
      reportDate: reportDate,
      reportDateHijri: `${reportDate.getDate()}/${reportDate.getMonth() + 1}/${reportDate.getFullYear() - 579}`,
      status: status,
      createdBy: engineer,

      header: {
        companyName: 'مكتب أسس تاون للاستشارات الهندسية',
        licenseNumber: '51...2536',
        address: `${cityData.city} - طريق الملك ${['فهد', 'عبدالله', 'عبدالعزيز'][i % 3]}`,
        phone: `+966 11 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
        email: 'info@asstown.sa',
        website: 'www.asstown.sa',
        crNumber: '1010123456'
      },

      footer: {
        preparedBy: engineer,
        preparedPosition: ['مهندس استشاري', 'مهندسة استشارية', 'مهندس مدني', 'مهندس معماري'][i % 4],
        reviewedBy: status === 'draft' ? '' : engineers[(i + 1) % engineers.length],
        reviewedPosition: status === 'draft' ? '' : 'مدير المشاريع',
        approvedBy: status === 'approved' ? 'م. خالد سعيد العتيبي' : '',
        approvedPosition: status === 'approved' ? 'المدير التنفيذي' : '',
        footerText: 'هذا التقرير معد وفقاً للمعايير والمواصفات السعودية واللوائح التنفيذية',
      },

      purpose: purpose.value,
      detailedPurpose: `${purpose.label} - ${propertyType}`,

      owner: {
        name: owner.name,
        nationalId: owner.national,
        crNumber: owner.cr,
        phone: `+966 ${['50', '55', '53', '54'][i % 4]} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
        email: owner.type === 'company' ? `info@company${i}.sa` : `owner${i}@example.sa`,
        address: `${cityData.city} - ${district}`
      },

      property: {
        deedNumber: String(100000 + i * 12345),
        deedDate: deedDate,
        deedDateHijri: `${deedDate.getDate()}/${deedDate.getMonth() + 1}/${deedDate.getFullYear() - 579}`,
        issueDate: deedDate,
        issueDateHijri: `${deedDate.getDate()}/${deedDate.getMonth() + 1}/${deedDate.getFullYear() - 579}`,
        region: cityData.region,
        city: cityData.city,
        district: district,
        plotNumber: String(1000 + i * 100),
        planNumber: String(500 + i * 50),
        landArea: landArea,
        buildingArea: buildingArea,
        propertyType: propertyType
      },

      setbacks: {
        north: { 
          setback: [4, 6, 2][i % 3], 
          length: 20 + Math.floor(Math.random() * 30), 
          description: ['شارع عرض 12م', 'شارع عرض 15م', 'شارع عرض 20م', 'جار'][i % 4]
        },
        south: { 
          setback: 2, 
          length: 20 + Math.floor(Math.random() * 30), 
          description: ['جار', 'مطابق الارتفاع + اطلاع'][i % 2]
        },
        east: { 
          setback: [2, 2.5, 3][i % 3], 
          length: 15 + Math.floor(Math.random() * 20), 
          description: ['شارع عرض 12م', 'جار'][i % 2]
        },
        west: { 
          setback: [2, 3, 4][i % 3], 
          length: 15 + Math.floor(Math.random() * 20), 
          description: ['شارع عرض 15م', 'جار', 'حديقة عامة'][i % 3]
        },
        streetDirection: ['شمالي', 'شمالي وشرقي', 'شمالي وغربي', 'شرقي وغربي'][i % 4],
        streetWidth: [12, 15, 20, 25][i % 4],
        notes: 'مطابق للارتفاع واطلاع حسب الكود السعودي'
      },

      images: {
        aerialImage: undefined,
        siteImage: undefined,
        planImage: undefined,
        additionalImages: []
      },

      request: {
        licenseNumber: `BLD-2025-${String(7000 + i)}`,
        requestNumber: `${i}/2/${i % 5 + 1}/1/${10 + i}`,
        requestType: purpose.label,
        requestDate: new Date(2025, 9, i - 5),
        requestDateHijri: `${(i - 5)}/${10}/${1447}`
      },

      components: generateComponents(i, propertyType, landArea, buildingArea),

      siteStatus: {
        status: ['vacant', 'existing', 'under_construction', 'existing_with_occupancy'][i % 4] as any,
        description: ['فضاء', 'قائم', 'تحت الإنشاء', 'قائم مع شهادة إشغال'][i % 4],
        occupancyCertNumber: i % 4 === 3 ? `OCC-2024-${String(5000 + i)}` : undefined,
        completionPercentage: [0, 100, 45, 100][i % 4]
      },

      template: {
        showExisting: true,
        showApproved: true,
        showProposed: i % 3 === 0,
        showImages: true,
        showStamp: true,
        pageSize: ['A4', 'A3'][i % 2] as 'A4' | 'A3',
        orientation: 'portrait',
        fontSize: 12,
        lineHeight: 1.5,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
        headerHeight: 120,
        footerHeight: 80,
        showWatermark: i % 5 === 0,
        watermarkText: i % 5 === 0 ? 'مسودة' : '',
        colorScheme: 'default'
      },

      signatures: generateSignatures(i, status, engineer),
      attachments: generateAttachments(i, status),
      revisions: generateRevisions(i, status),
      notifications: generateNotifications(i, status, engineer)
    };

    reports.push(report);
  }

  return reports;
};

// دالة لتوليد المكونات
function generateComponents(index: number, propertyType: string, landArea: number, buildingArea: number) {
  const components = [];
  const floors = Math.min(Math.floor(landArea / 200) + 1, 4);

  for (let f = 0; f < floors; f++) {
    const floorArea = Math.floor(buildingArea / floors);
    components.push({
      id: `COMP-${index}-${f + 1}`,
      name: f === 0 ? 'الدور الأرضي' : f === floors - 1 && propertyType === 'سكني' ? 'ملحق علوي' : `الدور ${['الأول', 'الثاني', 'الثالث'][f - 1]}`,
      existing: { 
        status: index % 4 === 0 ? '' : 'قائم', 
        area: index % 4 === 0 ? 0 : floorArea, 
        floors: index % 4 === 0 ? 0 : 1, 
        units: index % 4 === 0 ? 0 : Math.floor(floorArea / 100) 
      },
      approved: { 
        status: 'معتمد', 
        area: floorArea, 
        floors: 1, 
        units: Math.floor(floorArea / 100) 
      },
      proposed: { 
        status: index % 3 === 0 ? 'مقترح' : '', 
        area: index % 3 === 0 ? Math.floor(floorArea * 1.2) : 0, 
        floors: index % 3 === 0 ? 1 : 0, 
        units: index % 3 === 0 ? Math.floor(floorArea / 100) + 1 : 0 
      },
      notes: f === 0 && propertyType === 'تجاري' ? 'محلات تجارية' : f === 0 && propertyType === 'سكني' ? 'شقة سكنية' : ''
    });
  }

  return components;
}

// دالة لتوليد التوقيعات
function generateSignatures(index: number, status: string, engineer: string) {
  const signatures = [];
  
  if (status !== 'draft') {
    signatures.push({
      id: `SIG-${index}-1`,
      signerName: engineer,
      signerPosition: 'مهندس استشاري',
      signatureType: 'digital' as const,
      signatureDate: new Date(2025, 9, index),
      verified: true
    });
  }

  if (status === 'approved') {
    signatures.push({
      id: `SIG-${index}-2`,
      signerName: 'م. محمد أحمد الغامدي',
      signerPosition: 'مدير المشاريع',
      signatureType: 'digital' as const,
      signatureDate: new Date(2025, 9, index + 1),
      verified: true
    });

    signatures.push({
      id: `SIG-${index}-3`,
      signerName: 'م. خالد سعيد العتيبي',
      signerPosition: 'المدير التنفيذي',
      signatureType: 'stamp' as const,
      signatureDate: new Date(2025, 9, index + 2),
      verified: true
    });
  }

  return signatures;
}

// دالة لتوليد المرفقات
function generateAttachments(index: number, status: string) {
  const attachments = [];
  const categories = ['مخططات', 'صور', 'مستندات', 'رسومات'];
  const fileTypes = ['PDF', 'DWG', 'JPG', 'PNG', 'DOC'];

  if (status !== 'draft') {
    for (let i = 0; i < Math.min(index % 5 + 1, 8); i++) {
      attachments.push({
        id: `ATT-${index}-${i + 1}`,
        fileName: `${['مخطط الموقع', 'صورة جوية', 'المخطط المعماري', 'صورة الصك', 'رسم توضيحي', 'المخطط الإنشائي', 'تقرير التربة', 'شهادة الملكية'][i % 8]}.${fileTypes[i % fileTypes.length].toLowerCase()}`,
        fileType: fileTypes[i % fileTypes.length],
        fileSize: Math.floor(Math.random() * 5000) + 500,
        uploadDate: new Date(2025, 9, index - Math.floor(Math.random() * 5)),
        uploadedBy: `م. ${['أحمد', 'سارة', 'فهد', 'نورة'][i % 4]}`,
        category: categories[i % categories.length]
      });
    }
  }

  return attachments;
}

// دالة لتوليد التعديلات
function generateRevisions(index: number, status: string) {
  const revisions = [];

  if (status === 'approved' && index % 3 === 0) {
    for (let i = 0; i < Math.min(index % 3 + 1, 3); i++) {
      revisions.push({
        id: `REV-${index}-${i + 1}`,
        revisionNumber: `R${i + 1}`,
        revisionDate: new Date(2025, 9, index + i + 3),
        revisedBy: `م. ${['أحمد السالم', 'محمد الغامدي', 'خالد العتيبي'][i % 3]}`,
        changes: ['تحديث بيانات المالك', 'تعديل مساحة البناء', 'إضافة ملاحظات فنية', 'تحديث المخططات'][i % 4],
        reason: ['تصحيح خطأ إدخال', 'طلب من العميل', 'متطلبات البلدية', 'تحديث البيانات'][i % 4]
      });
    }
  }

  return revisions;
}

// دالة لتوليد الإشعارات
function generateNotifications(index: number, status: string, engineer: string) {
  const notifications = [];

  if (status === 'pending_review') {
    notifications.push({
      id: `NOT-${index}-1`,
      type: 'review' as const,
      message: 'التقرير جاهز للمراجعة',
      sentTo: ['م. محمد الغامدي', 'م. خالد العتيبي'],
      sentDate: new Date(2025, 9, index),
      read: false
    });
  }

  if (status === 'approved') {
    notifications.push({
      id: `NOT-${index}-2`,
      type: 'approval' as const,
      message: 'تم اعتماد التقرير الفني بنجاح',
      sentTo: [engineer],
      sentDate: new Date(2025, 9, index + 2),
      read: true
    });

    notifications.push({
      id: `NOT-${index}-3`,
      type: 'update' as const,
      message: 'تم إرسال نسخة من التقرير إلى العميل',
      sentTo: [engineer],
      sentDate: new Date(2025, 9, index + 3),
      read: true
    });
  }

  if (status === 'rejected') {
    notifications.push({
      id: `NOT-${index}-4`,
      type: 'rejection' as const,
      message: 'التقرير بحاجة لمراجعة - يرجى تعديل البيانات المشار إليها',
      sentTo: [engineer],
      sentDate: new Date(2025, 9, index + 1),
      read: true
    });
  }

  return notifications;
}

const TechnicalReportsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('950-01');
  const [reports, setReports] = useState<TechnicalReport[]>(getSampleReports());
  const [selectedReport, setSelectedReport] = useState<TechnicalReport | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const convertToHijri = (gregorianDate: Date): string => {
    const day = gregorianDate.getDate();
    const month = gregorianDate.getMonth() + 1;
    const year = gregorianDate.getFullYear();
    const hijriYear = year - 579;
    return `${day}/${month}/${hijriYear}`;
  };

  const handleCreateReport = () => {
    const newReport: TechnicalReport = {
      id: `TR-${Date.now()}`,
      reportNumber: `TR-2025-${String(reports.length + 1).padStart(3, '0')}`,
      reportDate: new Date(),
      reportDateHijri: convertToHijri(new Date()),
      status: 'draft',
      createdBy: 'المستخدم الحالي',
      header: {
        companyName: 'مكتب أسس تاون للاستشارات الهندسية',
        licenseNumber: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        crNumber: ''
      },
      footer: {
        preparedBy: '',
        preparedPosition: '',
        reviewedBy: '',
        reviewedPosition: '',
        approvedBy: '',
        approvedPosition: '',
        footerText: 'هذا التقرير معد وفقاً للمعايير والمواصفات السعودية',
      },
      purpose: '',
      detailedPurpose: '',
      owner: {
        name: '',
        nationalId: '',
        crNumber: '',
        phone: '',
        email: '',
        address: ''
      },
      property: {
        deedNumber: '',
        deedDate: new Date(),
        deedDateHijri: '',
        issueDate: new Date(),
        issueDateHijri: '',
        region: '',
        city: '',
        district: '',
        plotNumber: '',
        planNumber: '',
        landArea: 0,
        buildingArea: 0,
        propertyType: ''
      },
      setbacks: {
        north: { setback: 0, length: 0, description: '' },
        south: { setback: 0, length: 0, description: '' },
        east: { setback: 0, length: 0, description: '' },
        west: { setback: 0, length: 0, description: '' },
        streetDirection: '',
        streetWidth: 0,
        notes: ''
      },
      images: {
        aerialImage: undefined,
        siteImage: undefined,
        planImage: undefined,
        additionalImages: []
      },
      request: {
        licenseNumber: '',
        requestNumber: '',
        requestType: '',
        requestDate: new Date(),
        requestDateHijri: ''
      },
      components: [],
      siteStatus: {
        status: 'vacant',
        description: '',
        completionPercentage: 0
      },
      template: {
        showExisting: true,
        showApproved: true,
        showProposed: true,
        showImages: true,
        showStamp: true,
        pageSize: 'A4',
        orientation: 'portrait',
        fontSize: 12,
        lineHeight: 1.5,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
        headerHeight: 120,
        footerHeight: 80,
        showWatermark: false,
        watermarkText: '',
        colorScheme: 'default'
      },
      signatures: [],
      attachments: [],
      revisions: [],
      notifications: []
    };

    setReports([...reports, newReport]);
    setSelectedReport(newReport);
    setIsCreateDialogOpen(false);
    toast.success('تم إنشاء تقرير فني جديد بنجاح');
  };

  const handleSaveReport = () => {
    if (!selectedReport) return;
    const updatedReports = reports.map(r => r.id === selectedReport.id ? selectedReport : r);
    setReports(updatedReports);
    toast.success('تم حفظ التقرير بنجاح');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'مسودة', className: 'bg-gray-100 text-gray-700' },
      pending_review: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-700' },
      approved: { label: 'معتمد', className: 'bg-green-100 text-green-700' },
      rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-700' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className} style={{ fontFamily: 'Tajawal, sans-serif' }}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4" dir="rtl">
      {/* رأس الشاشة */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير الفنية</h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إنشاء وإدارة التقارير الفنية الشاملة - نظام متكامل مع بيانات واقعية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-950
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {reports.length} تقرير
            </Badge>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'الإجمالي', value: reports.length, icon: FileText, color: 'blue' },
            { label: 'مسودة', value: reports.filter(r => r.status === 'draft').length, icon: Edit, color: 'gray' },
            { label: 'قيد المراجعة', value: reports.filter(r => r.status === 'pending_review').length, icon: Clock, color: 'yellow' },
            { label: 'معتمد', value: reports.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'green' },
            { label: 'مرفوض', value: reports.filter(r => r.status === 'rejected').length, icon: XCircle, color: 'red' }
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <List className="w-4 h-4 text-white" />
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
                    { id: '950-01', icon: FileText, label: 'قائمة التقارير' },
                    { id: '950-02', icon: Plus, label: 'إنشاء تقرير جديد' },
                    { id: '950-03', icon: Settings, label: 'إعدادات التقرير' },
                    { id: '950-04', icon: User, label: 'بيانات المالك' },
                    { id: '950-05', icon: Home, label: 'بيانات الملكية' },
                    { id: '950-06', icon: Ruler, label: 'الارتدادات والأبعاد' },
                    { id: '950-07', icon: ImageIcon, label: 'الصور والمرفقات المرئية' },
                    { id: '950-08', icon: FileSignature, label: 'تفاصيل الطلب' },
                    { id: '950-09', icon: Building, label: 'المكونات والعناصر' },
                    { id: '950-10', icon: MapPin, label: 'حالة الموقع' },
                    { id: '950-11', icon: Stamp, label: 'التوقيعات والاعتمادات' },
                    { id: '950-12', icon: Paperclip, label: 'المرفقات والملحقات' },
                    { id: '950-13', icon: LayoutTemplate, label: 'قوالب التقارير' },
                    { id: '950-14', icon: History, label: 'سجل التعديلات' },
                    { id: '950-15', icon: Printer, label: 'التصدير والطباعة' },
                    { id: '950-16', icon: Archive, label: 'الأرشفة والحفظ' },
                    { id: '950-17', icon: BarChart3, label: 'إحصائيات التقارير' },
                    { id: '950-18', icon: Bell, label: 'الإشعارات والتنبيهات' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
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

                {/* 950-01: قائمة التقارير */}
                {activeTab === '950-01' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة التقارير الفنية</h2>
                        <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          عرض وإدارة جميع التقارير الفنية - {filteredReports.length} تقرير
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#10b981] hover:bg-[#059669]">
                        <Plus className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير جديد</span>
                      </Button>
                    </div>

                    <Separator />

                    {/* البحث والتصفية */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2 form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>البحث</Label>
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            className="input-field pr-10"
                            placeholder="بحث برقم التقرير أو اسم المالك..."
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
                            <SelectItem value="draft">مسودة</SelectItem>
                            <SelectItem value="pending_review">قيد المراجعة</SelectItem>
                            <SelectItem value="approved">معتمد</SelectItem>
                            <SelectItem value="rejected">مرفوض</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button variant="outline" className="w-full">
                          <Filter className="h-4 w-4 ml-2" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تصفية متقدمة</span>
                        </Button>
                      </div>
                    </div>

                    {/* جدول التقارير */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم التقرير</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الصك</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الغرض</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المُعد</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReports.map((report) => (
                            <TableRow key={report.id} className="hover:bg-gray-50">
                              <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                                {report.reportNumber}
                              </TableCell>
                              <TableCell className="text-right">
                                <div style={{ fontFamily: 'Courier New, monospace' }}>
                                  {new Date(report.reportDate).toLocaleDateString('ar-SA')}
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {report.reportDateHijri}
                                </div>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <div className="max-w-[180px] truncate" title={report.owner.name}>
                                  {report.owner.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                                {report.property.deedNumber}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <div className="max-w-[150px] truncate" title={report.detailedPurpose}>
                                  {report.detailedPurpose}
                                </div>
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {report.property.city}
                              </TableCell>
                              <TableCell className="text-right">
                                {getStatusBadge(report.status)}
                              </TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {report.createdBy}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setActiveTab('950-03');
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setActiveTab('950-03');
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* إحصائيات إضافية */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المساحات</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {reports.reduce((sum, r) => sum + r.property.landArea, 0).toLocaleString()} م²
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقارير الشهر</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {reports.filter(r => new Date(r.reportDate).getMonth() === 9).length}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل الاعتماد</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {Math.round((reports.filter(r => r.status === 'approved').length / reports.length) * 100)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="p-3">
                          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المهندسين</div>
                          <div className="text-lg mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                            {new Set(reports.map(r => r.createdBy)).size}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* 950-02: إنشاء تقرير جديد */}
                {activeTab === '950-02' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء تقرير فني جديد</h2>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        املأ البيانات الأساسية لإنشاء تقرير جديد
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم التقرير *</Label>
                        <Input
                          className="input-field"
                          value={`TR-2025-${String(reports.length + 1).padStart(3, '0')}`}
                          readOnly
                          style={{ 
                            fontFamily: 'Courier New, monospace', 
                            backgroundColor: '#f3f4f6',
                            border: '2px solid #e5e7eb',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ الميلادي *</Label>
                        <Input
                          type="date"
                          className="input-field"
                          defaultValue={new Date().toISOString().split('T')[0]}
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
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ الهجري</Label>
                        <Input
                          className="input-field"
                          value={convertToHijri(new Date())}
                          readOnly
                          style={{ 
                            fontFamily: 'Courier New, monospace', 
                            backgroundColor: '#f3f4f6',
                            border: '2px solid #e5e7eb',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}
                        />
                      </div>

                      <div className="form-group col-span-2">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الغرض من التقرير *</Label>
                        <Select>
                          <SelectTrigger className="input-field" style={{ 
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            textAlign: 'right',
                            direction: 'rtl'
                          }}>
                            <SelectValue placeholder="اختر الغرض" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="license">الحصول على ترخيص بناء</SelectItem>
                            <SelectItem value="modification">تعديل ترخيص قائم</SelectItem>
                            <SelectItem value="correction">تصحيح وضع مبني قائم</SelectItem>
                            <SelectItem value="renewal">تجديد ترخيص</SelectItem>
                            <SelectItem value="occupancy">الحصول على شهادة إشغال</SelectItem>
                            <SelectItem value="survey">رفع مساحي</SelectItem>
                            <SelectItem value="demolition">ترخيص هدم</SelectItem>
                            <SelectItem value="addition">إضافة ملحق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العقار *</Label>
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
                            <SelectItem value="agricultural">زراعي</SelectItem>
                            <SelectItem value="mixed">متعدد الاستخدام</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="form-group col-span-3">
                        <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الغرض التفصيلي</Label>
                        <Textarea
                          className="input-field"
                          rows={3}
                          placeholder="وصف تفصيلي للغرض من التقرير..."
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

                    <div className="flex gap-3 justify-end pt-4">
                      <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إلغاء
                      </Button>
                      <Button onClick={handleCreateReport} className="bg-[#10b981] hover:bg-[#059669]">
                        <Save className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء التقرير</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* الرسالة الافتراضية عند عدم اختيار تقرير */}
                {!selectedReport && ['950-03', '950-04', '950-05', '950-06', '950-07', '950-08', '950-09', '950-10', '950-11', '950-12', '950-13', '950-14', '950-15', '950-16', '950-17', '950-18'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرجاء اختيار تقرير من القائمة أو إنشاء تقرير جديد
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setActiveTab('950-01')} variant="outline">
                        <List className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض القائمة</span>
                      </Button>
                      <Button onClick={() => setActiveTab('950-02')} className="bg-[#10b981] hover:bg-[#059669]">
                        <Plus className="h-4 w-4 ml-2" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير جديد</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* باقي التابات */}
                {selectedReport && ['950-03', '950-04', '950-05', '950-06', '950-07', '950-08', '950-09', '950-10', '950-11', '950-12', '950-13', '950-14', '950-15', '950-16', '950-17', '950-18'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تاب {activeTab}
                    </h3>
                    <p className="text-gray-500 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التقرير: {selectedReport.reportNumber}
                    </p>
                    <p className="text-sm text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المحتوى قيد التطوير - البيانات متوفرة في النظام
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto text-right">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</div>
                        <div className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedReport.owner.name}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصك</div>
                        <div className="text-sm mt-1" style={{ fontFamily: 'Courier New, monospace' }}>{selectedReport.property.deedNumber}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</div>
                        <div className="text-sm mt-1" style={{ fontFamily: 'Courier New, monospace' }}>{selectedReport.property.landArea} م²</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</div>
                        <div className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedReport.property.city}</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 mt-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      قريباً
                    </Badge>
                  </div>
                )}

              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* نافذة إنشاء تقرير جديد */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إنشاء تقرير فني جديد
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سيتم إنشاء تقرير جديد برقم: TR-2025-{String(reports.length + 1).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>

          <div className="form-rtl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ الميلادي</Label>
                <Input
                  type="date"
                  className="input-field"
                  defaultValue={new Date().toISOString().split('T')[0]}
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
                <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>الغرض من التقرير</Label>
                <Select>
                  <SelectTrigger className="input-field" style={{ 
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}>
                    <SelectValue placeholder="اختر الغرض" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="license">ترخيص بناء</SelectItem>
                    <SelectItem value="modification">تعديل ترخيص</SelectItem>
                    <SelectItem value="correction">تصحيح وضع</SelectItem>
                    <SelectItem value="occupancy">شهادة إشغال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="dialog-footer">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إلغاء
            </Button>
            <Button onClick={handleCreateReport} className="bg-[#10b981] hover:bg-[#059669]">
              <Plus className="h-4 w-4 ml-2" />
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إنشاء</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicalReportsManagement;
