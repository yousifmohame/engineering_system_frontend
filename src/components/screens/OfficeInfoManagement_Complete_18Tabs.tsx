import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';
import CodeDisplay from '../CodeDisplay';
import { 
  Building, Users, Crown, Stamp, UserCheck, Phone, CreditCard, Mail, Key, Monitor, MapPin, Award,
  Plus, Trash, Settings, Send, Upload, Save, RefreshCw, Download, Info, AlertCircle, CheckCircle,
  Clock, Edit, User, Star, FileCheck, Calendar, TrendingUp, Video, Camera, Receipt,
  Globe, MessageSquare, Navigation, Clock as ClockIcon
} from 'lucide-react';

/**
 * شاشة إدارة معلومات المكتب الشاملة - 18 تبويب
 * 
 * نظام إدارة شامل لجميع معلومات المكتب الهندسي
 * يشمل البيانات الأساسية، الموظفين، المالية، والإنجازات
 * 
 * @returns React Component
 */
const OfficeInfoManagement_Complete_18Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('office-basic-info');

  // قائمة التبويبات الـ18
  const tabs = [
    // المجموعة الأولى: المعلومات الأساسية
    { id: 'office-basic-info', label: 'المعلومات الأساسية', icon: <Building className="h-4 w-4" />, code: 'TAB-OFFICE-BASIC-INFO-001' },
    { id: 'office-registration', label: 'بيانات التسجيل', icon: <FileCheck className="h-4 w-4" />, code: 'TAB-OFFICE-REGISTRATION-002' },
    { id: 'office-staff-stats', label: 'إحصائيات الموظفين', icon: <Users className="h-4 w-4" />, code: 'TAB-OFFICE-STAFF-STATS-003' },
    { id: 'office-logo-branding', label: 'الشعار والهوية البصرية', icon: <Crown className="h-4 w-4" />, code: 'TAB-OFFICE-LOGO-BRANDING-004' },
    { id: 'office-seals-signatures', label: 'الأختام والتوقيعات', icon: <Stamp className="h-4 w-4" />, code: 'TAB-OFFICE-SEALS-SIGNATURES-005' },
    { id: 'office-owners', label: 'ملاك المكتب', icon: <Building className="h-4 w-4" />, code: 'TAB-OFFICE-OWNERS-006' },
    
    // المجموعة الثانية: الإدارة والاتصالات
    { id: 'office-managers', label: 'مديرو المكتب', icon: <UserCheck className="h-4 w-4" />, code: 'TAB-OFFICE-MANAGERS-007' },
    { id: 'office-contact-info', label: 'بيانات الاتصال الرسمية', icon: <Phone className="h-4 w-4" />, code: 'TAB-OFFICE-CONTACT-INFO-008' },
    { id: 'office-financial-banking', label: 'المعلومات المالية والمصرفية', icon: <CreditCard className="h-4 w-4" />, code: 'TAB-OFFICE-FINANCIAL-BANKING-009' },
    { id: 'office-smtp-settings', label: 'إعدادات SMTP للمراسلات', icon: <Mail className="h-4 w-4" />, code: 'TAB-OFFICE-SMTP-SETTINGS-010' },
    
    // المجموعة الثالثة: الأنظمة والموارد
    { id: 'office-software-licenses', label: 'تراخيص البرامج والأنظمة', icon: <Key className="h-4 w-4" />, code: 'TAB-OFFICE-SOFTWARE-LICENSES-011' },
    { id: 'office-equipment-resources', label: 'أجهزة وموارد المكتب', icon: <Monitor className="h-4 w-4" />, code: 'TAB-OFFICE-EQUIPMENT-RESOURCES-012' },
    { id: 'office-branches-locations', label: 'المقرات والفروع', icon: <MapPin className="h-4 w-4" />, code: 'TAB-OFFICE-BRANCHES-LOCATIONS-013' },
    { id: 'office-performance-achievements', label: 'تقييمات الأداء والإنجازات', icon: <Award className="h-4 w-4" />, code: 'TAB-OFFICE-PERFORMANCE-ACHIEVEMENTS-014' },
    
    // المجموعة الرابعة: التوسعات الإضافية (تبويبات 15-18)
    { id: 'office-certifications', label: 'الشهادات والاعتمادات', icon: <Award className="h-4 w-4" />, code: 'TAB-OFFICE-CERTIFICATIONS-015' },
    { id: 'office-partnerships', label: 'الشراكات والتحالفات', icon: <Users className="h-4 w-4" />, code: 'TAB-OFFICE-PARTNERSHIPS-016' },
    { id: 'office-sustainability', label: 'الاستدامة والمسؤولية', icon: <Globe className="h-4 w-4" />, code: 'TAB-OFFICE-SUSTAINABILITY-017' },
    { id: 'office-digital-transformation', label: 'التحول الرقمي والابتكار', icon: <Monitor className="h-4 w-4" />, code: 'TAB-OFFICE-DIGITAL-TRANSFORMATION-018' }
  ];

  // حالات البيانات لجميع التبويبات
  
  // المعلومات الأساسية
  const [basicInfo, setBasicInfo] = useState({
    officeName: 'مكتب الهندسة المتكامل',
    englishName: 'Integrated Engineering Office',
    establishmentDate: '2015-03-15',
    legalForm: 'مؤسسة فردية',
    mainActivity: 'الاستشارات الهندسية والإشراف',
    vision: 'أن نكون المكتب الهندسي الرائد في تقديم الحلول المبتكرة',
    mission: 'تقديم خدمات هندسية متميزة تلبي احتياجات العملاء',
    values: ['الجودة', 'الابتكار', 'الشفافية', 'الالتزام']
  });

  // بيانات التسجيل
  const [registrationData, setRegistrationData] = useState({
    commercialRegister: '1010123456',
    taxNumber: '123-456-789-012-3',
    municipalLicense: 'MUN-2024-001',
    engineersAuthority: 'ENG-AUTH-2024-456',
    chamberOfCommerce: 'CC-RD-2024-789'
  });

  // إحصائيات الموظفين
  const [staffStats, setStaffStats] = useState({
    totalEmployees: 45,
    engineers: 28,
    technicians: 12,
    administrative: 5,
    maleEmployees: 32,
    femaleEmployees: 13,
    saudiEmployees: 38,
    nonSaudiEmployees: 7
  });

  // الشعار والهوية البصرية
  const [brandingAssets, setBrandingAssets] = useState({
    mainLogo: null as File | null,
    alternateLogo: null as File | null,
    letterhead: null as File | null,
    businessCard: null as File | null,
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    accentColor: '#3b82f6'
  });

  // الأختام والتوقيعات
  const [sealsSignatures, setSealsSignatures] = useState({
    officialSeal: null as File | null,
    miniSeal: null as File | null,
    authorizedSignature: null as File | null,
    signatureOwnerInfo: {
      fullName: 'المهندس أحمد محمد العلي',
      position: 'المدير التنفيذي',
      approvalDate: '2024-01-15',
      expiryDate: '2025-01-15'
    }
  });

  // ملاك المكتب
  const [owners, setOwners] = useState([
    {
      id: '1',
      name: 'المهندس أحمد محمد العلي',
      idNumber: '1234567890',
      ownershipPercentage: 70,
      position: 'المدير التنفيذي',
      signature: null as File | null,
      phone: '+966501234567',
      email: 'ahmed@office.com',
      status: 'نشط'
    },
    {
      id: '2',
      name: 'المهندسة فاطمة سالم النور',
      idNumber: '0987654321',
      ownershipPercentage: 30,
      position: 'مديرة العمليات',
      signature: null as File | null,
      phone: '+966509876543',
      email: 'fatima@office.com',
      status: 'نشط'
    }
  ]);

  // مديرو المكتب
  const [managers, setManagers] = useState([
    {
      id: '1',
      name: 'المهندس أحمد محمد العلي',
      position: 'مدير عام',
      department: 'الإدارة العامة',
      managementLevel: 'مدير عام',
      adminSignature: null as File | null,
      signaturePermissions: ['موافقة المعاملات', 'اعتماد العقود'],
      maxAmount: 500000,
      appointmentDate: '2020-01-15'
    }
  ]);

  // بيانات الاتصال
  const [contactInfo, setContactInfo] = useState({
    primaryPhone: '+966-11-456-7890',
    secondaryPhone: '+966-11-456-7891',
    fax: '+966-11-456-7892',
    primaryEmail: 'info@engineering-office.com',
    secondaryEmail: 'admin@engineering-office.com',
    website: 'https://www.engineering-office.com',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/engineering-office',
      twitter: 'https://twitter.com/engineering_office',
      instagram: 'https://instagram.com/engineering_office',
      youtube: 'https://youtube.com/channel/engineering-office'
    }
  });

  // المعلومات المالية والمصرفية
  const [financialData, setFinancialData] = useState({
    taxRegistrationNumber: '123-456-789-012-3',
    vatRegistrationNumber: '300123456700003',
    socialInsuranceNumber: '1234567890',
    sanedNumber: 'SANED123456'
  });

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      bankName: 'البنك الأهلي السعودي',
      accountNumber: '123456789012',
      iban: 'SA1210000123456789012345',
      accountType: 'جاري',
      currency: 'ريال سعودي',
      status: 'نشط'
    }
  ]);

  // خوادم SMTP
  const [smtpServers, setSmtpServers] = useState([
    {
      id: '1',
      serverName: 'خادم البريد الرئيسي',
      smtpHost: 'smtp.gmail.com',
      port: 587,
      encryption: 'TLS',
      username: 'info@engineering-office.com',
      password: '••••••••',
      defaultSender: 'info@engineering-office.com',
      senderName: 'مكتب الهندسة المتكامل',
      status: 'نشط'
    }
  ]);

  // تراخيص البرامج
  const [softwareLicenses, setSoftwareLicenses] = useState([
    {
      id: '1',
      softwareName: 'AutoCAD 2024',
      licenseNumber: 'ACAD-2024-ENT-12345',
      licenseType: 'مؤسسي',
      authorizedUsers: 10,
      purchaseDate: '2024-01-15',
      expiryDate: '2025-01-15',
      cost: 25000,
      developer: 'Autodesk',
      status: 'ساري'
    }
  ]);

  // أجهزة وموارد المكتب
  const [officeEquipment, setOfficeEquipment] = useState([
    {
      id: '1',
      equipmentName: 'محطة عمل هندسية عالية الأداء',
      serialNumber: 'WS-2024-001',
      brandModel: 'Dell Precision 7760',
      purchaseDate: '2024-01-20',
      purchaseCost: 15000,
      currentLocation: 'قسم التصميم الهندسي',
      responsiblePerson: 'المهندس أحمد العلي',
      equipmentStatus: 'يعمل بكفاءة'
    }
  ]);

  // المقرات والفروع
  const [headOffice, setHeadOffice] = useState({
    address: 'شارع الملك فهد، حي الأعمال، الرياض 12345، المملكة العربية السعودية',
    totalArea: 500,
    floors: 2,
    offices: 12,
    ownershipType: 'ملك',
    monthlyRent: 0
  });

  const [branches, setBranches] = useState([
    {
      id: '1',
      branchName: 'فرع جدة',
      city: 'جدة',
      address: 'شارع التحلية، حي الأندلس، جدة 21455',
      area: 200,
      employeeCount: 15,
      ownershipType: 'إيجار',
      branchStatus: 'نشط'
    }
  ]);

  // تقييمات الأداء والإنجازات
  const [performanceKPIs, setPerformanceKPIs] = useState({
    completedProjects: 42,
    averageProcessingTime: 7.5,
    customerSatisfaction: 96.5,
    annualRevenue: 2850000
  });

  const [achievements, setAchievements] = useState([
    {
      id: '1',
      achievementName: 'جائزة أفضل مكتب هندسي 2024',
      awardingEntity: 'الهيئة السعودية للمهندسين',
      date: '2024-05-15',
      category: 'محلي',
      description: 'تكريم لتميز المكتب في تقديم الخدمات الهندسية المبتكرة',
      certificate: 'شهادة-التميز-2024.pdf'
    }
  ]);

  // الشهادات والاعتمادات (التبويب 15)
  const [certifications, setCertifications] = useState([
    {
      id: '1',
      certificationName: 'ISO 9001:2015',
      issuingAuthority: 'المنظمة الدولية للمعايير',
      issueDate: '2023-06-15',
      expiryDate: '2026-06-15',
      certificationScope: 'إدارة الجودة في الخدمات الهندسية',
      certificateNumber: 'ISO-9001-2023-456',
      status: 'ساري'
    },
    {
      id: '2',
      certificationName: 'شهادة الاعتماد المهني',
      issuingAuthority: 'الهيئة السعودية للمهندسين',
      issueDate: '2024-01-10',
      expiryDate: '2026-01-10',
      certificationScope: 'الاستشارات الهندسية المعمارية',
      certificateNumber: 'SCE-2024-789',
      status: 'ساري'
    }
  ]);

  // الشراكات والتحالفات (التبويب 16)
  const [partnerships, setPartnerships] = useState([
    {
      id: '1',
      partnerName: 'شركة البناء المتقدم',
      partnerType: 'شريك استراتيجي',
      partnershipScope: 'تنفيذ المشاريع الإنشائية',
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      contactPerson: 'المهندس سالم الأحمد',
      contactEmail: 'salem@construction.com',
      status: 'نشط'
    },
    {
      id: '2',
      partnerName: 'مكتب الاستشارات الدولية',
      partnerType: 'شريك تقني',
      partnershipScope: 'التصميم والاستشارات التقنية',
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      contactPerson: 'د. أحمد محمود',
      contactEmail: 'ahmed@international-consulting.com',
      status: 'نشط'
    }
  ]);

  // الاستدامة والمسؤولية (التبويب 17)
  const [sustainabilityData, setSustainabilityData] = useState({
    environmentalPolicy: 'ملتزمون بحماية البيئة من خلال التصاميم المستدامة',
    energyEfficiencyRating: 85,
    wasteReductionPercentage: 70,
    greenBuildingProjects: 15,
    carbonFootprintReduction: 30,
    renewableEnergyUsage: 40,
    sustainabilityCertifications: ['LEED Gold', 'BREEAM Excellent'],
    communityPrograms: [
      'برنامج التدريب المجاني للطلاب',
      'مبادرة البناء الأخضر',
      'برنامج التشجير'
    ]
  });

  // التحول الرقمي والابتكار (التبويب 18)
  const [digitalTransformation, setDigitalTransformation] = useState({
    digitalMaturityLevel: 4, // من 1 إلى 5
    automationPercentage: 75,
    cloudAdoption: 90,
    aiToolsImplemented: [
      'نظام التصميم بالذكاء الاصطناعي',
      'تحليل البيانات التنبؤي',
      'روبوت الدردشة الذكي'
    ],
    digitalSkillsTraining: 80, // نسبة الموظفين المدربين
    cybersecurityRating: 'ممتاز',
    innovationProjects: [
      {
        id: '1',
        projectName: 'منصة إدارة المشاريع الذكية',
        description: 'نظام ذكي لإدارة ومتابعة المشاريع الهندسية',
        status: 'قيد التطوير',
        completionPercentage: 75
      },
      {
        id: '2',
        projectName: 'تطبيق الواقع المعزز للتصميم',
        description: 'تطبيق يسمح للعملاء بمشاهدة التصاميم بتقنية الواقع المعزز',
        status: 'مكتمل',
        completionPercentage: 100
      }
    ]
  });

  // وظائف مساعدة
  const addItem = (setter: any, newItem: any) => {
    setter((prev: any) => [...prev, { ...newItem, id: Date.now().toString() }]);
  };

  const updateItem = (setter: any, id: string, field: string, value: any) => {
    setter((prev: any) => prev.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (setter: any, id: string) => {
    setter((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  // وظيفة رفع الملفات
  const handleFileUpload = (file: File, setter: any, field?: string) => {
    if (field) {
      setter((prev: any) => ({ ...prev, [field]: file }));
    } else {
      setter(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'office-basic-info':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-BASIC-INFO-001" position="top-right" />
            
            {/* المعلومات الأساسية */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Building className="h-5 w-5" />
                  المعلومات الأساسية للمكتب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسم المكتب <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={basicInfo.officeName}
                      onChange={(e) => setBasicInfo(prev => ({ ...prev, officeName: e.target.value }))}
                      className="input-field"
                      placeholder="اسم المكتب"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الاسم الإنجليزي
                    </Label>
                    <Input
                      value={basicInfo.englishName}
                      onChange={(e) => setBasicInfo(prev => ({ ...prev, englishName: e.target.value }))}
                      className="input-field"
                      placeholder="English Name"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تاريخ التأسيس
                    </Label>
                    <Input
                      type="date"
                      value={basicInfo.establishmentDate}
                      onChange={(e) => setBasicInfo(prev => ({ ...prev, establishmentDate: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الشكل القانوني
                    </Label>
                    <Select 
                      value={basicInfo.legalForm} 
                      onValueChange={(value) => setBasicInfo(prev => ({ ...prev, legalForm: value }))}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مؤسسة فردية">مؤسسة فردية</SelectItem>
                        <SelectItem value="شركة ذات مسؤولية محدودة">شركة ذات مسؤولية محدودة</SelectItem>
                        <SelectItem value="شركة مساهمة">شركة مساهمة</SelectItem>
                        <SelectItem value="شراكة مهنية">شراكة مهنية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    النشاط الرئيسي
                  </Label>
                  <Input
                    value={basicInfo.mainActivity}
                    onChange={(e) => setBasicInfo(prev => ({ ...prev, mainActivity: e.target.value }))}
                    className="input-field"
                    placeholder="النشاط الرئيسي للمكتب"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرؤية
                    </Label>
                    <textarea
                      value={basicInfo.vision}
                      onChange={(e) => setBasicInfo(prev => ({ ...prev, vision: e.target.value }))}
                      className="textarea-field"
                      rows={3}
                      placeholder="رؤية المكتب"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرسالة
                    </Label>
                    <textarea
                      value={basicInfo.mission}
                      onChange={(e) => setBasicInfo(prev => ({ ...prev, mission: e.target.value }))}
                      className="textarea-field"
                      rows={3}
                      placeholder="رسالة المكتب"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    القيم
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {basicInfo.values.map((value, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'office-registration':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-REGISTRATION-002" position="top-right" />
            
            {/* بيانات التسجيل */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileCheck className="h-5 w-5" />
                  بيانات التسجيل والتراخيص
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      رقم السجل التجاري <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={registrationData.commercialRegister}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, commercialRegister: e.target.value }))}
                      className="input-field font-code"
                      placeholder="1010123456"
                      maxLength={10}
                      style={{ fontFamily: 'Courier New, monospace' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرقم الضريبي
                    </Label>
                    <Input
                      value={registrationData.taxNumber}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, taxNumber: e.target.value }))}
                      className="input-field font-code"
                      placeholder="123-456-789-012-3"
                      style={{ fontFamily: 'Courier New, monospace' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      ترخيص البلدية
                    </Label>
                    <Input
                      value={registrationData.municipalLicense}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, municipalLicense: e.target.value }))}
                      className="input-field font-code"
                      placeholder="MUN-2024-001"
                      style={{ fontFamily: 'Courier New, monospace' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اعتماد هيئة المهندسين
                    </Label>
                    <Input
                      value={registrationData.engineersAuthority}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, engineersAuthority: e.target.value }))}
                      className="input-field font-code"
                      placeholder="ENG-AUTH-2024-456"
                      style={{ fontFamily: 'Courier New, monospace' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      عضوية الغرفة التجارية
                    </Label>
                    <Input
                      value={registrationData.chamberOfCommerce}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, chamberOfCommerce: e.target.value }))}
                      className="input-field font-code"
                      placeholder="CC-RD-2024-789"
                      style={{ fontFamily: 'Courier New, monospace' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // التبويبات الإضافية 15-18
      case 'office-certifications':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-CERTIFICATIONS-015" position="top-right" />
            
            {/* جدول الشهادات والاعتمادات */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Award className="h-5 w-5" />
                    الشهادات والاعتمادات
                  </div>
                  <Button 
                    onClick={() => addItem(setCertifications, {
                      certificationName: '',
                      issuingAuthority: '',
                      issueDate: '',
                      expiryDate: '',
                      certificationScope: '',
                      certificateNumber: '',
                      status: 'ساري'
                    })} 
                    size="sm" 
                    className="button-rtl"
                  >
                    <Plus className="h-3 w-3" />
                    إضافة شهادة
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسم الشهادة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الجهة المصدرة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تاريخ الإصدار
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تاريخ الانتهاء
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نطاق الاعتماد
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          رقم الشهادة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الحالة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          إجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certifications.map((cert) => (
                        <TableRow key={cert.id} className="hover:bg-gray-50">
                          <TableCell className="text-right">
                            <Input
                              value={cert.certificationName}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'certificationName', e.target.value)}
                              className="input-field text-xs"
                              placeholder="اسم الشهادة"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              value={cert.issuingAuthority}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'issuingAuthority', e.target.value)}
                              className="input-field text-xs"
                              placeholder="الجهة المصدرة"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="date"
                              value={cert.issueDate}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'issueDate', e.target.value)}
                              className="input-field text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="date"
                              value={cert.expiryDate}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'expiryDate', e.target.value)}
                              className="input-field text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              value={cert.certificationScope}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'certificationScope', e.target.value)}
                              className="input-field text-xs"
                              placeholder="نطاق الاعتماد"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              value={cert.certificateNumber}
                              onChange={(e) => updateItem(setCertifications, cert.id, 'certificateNumber', e.target.value)}
                              className="input-field text-xs font-code"
                              placeholder="رقم الشهادة"
                              style={{ fontFamily: 'Courier New, monospace' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={cert.status === 'ساري' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {cert.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeItem(setCertifications, cert.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'office-partnerships':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-PARTNERSHIPS-016" position="top-right" />
            
            {/* جدول الشراكات والتحالفات */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-5 w-5" />
                    الشراكات والتحالفات
                  </div>
                  <Button 
                    onClick={() => addItem(setPartnerships, {
                      partnerName: '',
                      partnerType: 'شريك استراتيجي',
                      partnershipScope: '',
                      startDate: '',
                      endDate: '',
                      contactPerson: '',
                      contactEmail: '',
                      status: 'نشط'
                    })} 
                    size="sm" 
                    className="button-rtl"
                  >
                    <Plus className="h-3 w-3" />
                    إضافة شراكة
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسم الشريك
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نوع الشراكة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نطاق الشراكة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تاريخ البداية
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تاريخ النهاية
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          جهة الاتصال
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          البريد الإلكتروني
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الحالة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          إجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partnerships.map((partnership) => (
                        <TableRow key={partnership.id} className="hover:bg-gray-50">
                          <TableCell className="text-right">
                            <Input
                              value={partnership.partnerName}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'partnerName', e.target.value)}
                              className="input-field text-xs"
                              placeholder="اسم الشريك"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Select 
                              value={partnership.partnerType} 
                              onValueChange={(value) => updateItem(setPartnerships, partnership.id, 'partnerType', value)}
                            >
                              <SelectTrigger className="input-field text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="شريك استراتيجي">شريك استراتيجي</SelectItem>
                                <SelectItem value="شريك تقني">شريك تقني</SelectItem>
                                <SelectItem value="شريك تجاري">شريك تجاري</SelectItem>
                                <SelectItem value="شريك أكاديمي">شريك أكاديمي</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              value={partnership.partnershipScope}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'partnershipScope', e.target.value)}
                              className="input-field text-xs"
                              placeholder="نطاق الشراكة"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="date"
                              value={partnership.startDate}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'startDate', e.target.value)}
                              className="input-field text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="date"
                              value={partnership.endDate}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'endDate', e.target.value)}
                              className="input-field text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              value={partnership.contactPerson}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'contactPerson', e.target.value)}
                              className="input-field text-xs"
                              placeholder="جهة الاتصال"
                              style={{ fontFamily: 'Tajawal, sans-serif' }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="email"
                              value={partnership.contactEmail}
                              onChange={(e) => updateItem(setPartnerships, partnership.id, 'contactEmail', e.target.value)}
                              className="input-field text-xs"
                              placeholder="email@domain.com"
                              dir="ltr"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Select 
                              value={partnership.status} 
                              onValueChange={(value) => updateItem(setPartnerships, partnership.id, 'status', value)}
                            >
                              <SelectTrigger className="input-field text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="نشط">نشط</SelectItem>
                                <SelectItem value="مؤقت">مؤقت</SelectItem>
                                <SelectItem value="منتهي">منتهي</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeItem(setPartnerships, partnership.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'office-sustainability':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-SUSTAINABILITY-017" position="top-right" />
            
            {/* السياسة البيئية */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Globe className="h-5 w-5" />
                  الاستدامة والمسؤولية البيئية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      السياسة البيئية
                    </Label>
                    <textarea
                      value={sustainabilityData.environmentalPolicy}
                      onChange={(e) => setSustainabilityData(prev => ({ ...prev, environmentalPolicy: e.target.value }))}
                      className="textarea-field"
                      rows={3}
                      placeholder="السياسة البيئية للمكتب"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تقييم كفاءة الطاقة (%)
                      </Label>
                      <Input
                        type="number"
                        value={sustainabilityData.energyEfficiencyRating}
                        onChange={(e) => setSustainabilityData(prev => ({ 
                          ...prev, 
                          energyEfficiencyRating: parseInt(e.target.value) || 0 
                        }))}
                        className="input-field font-code"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        نسبة تقليل النفايات (%)
                      </Label>
                      <Input
                        type="number"
                        value={sustainabilityData.wasteReductionPercentage}
                        onChange={(e) => setSustainabilityData(prev => ({ 
                          ...prev, 
                          wasteReductionPercentage: parseInt(e.target.value) || 0 
                        }))}
                        className="input-field font-code"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مشاريع البناء الأخضر
                      </Label>
                      <Input
                        type="number"
                        value={sustainabilityData.greenBuildingProjects}
                        onChange={(e) => setSustainabilityData(prev => ({ 
                          ...prev, 
                          greenBuildingProjects: parseInt(e.target.value) || 0 
                        }))}
                        className="input-field font-code"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      شهادات الاستدامة
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {sustainabilityData.sustainabilityCertifications.map((cert, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      البرامج المجتمعية
                    </Label>
                    <div className="space-y-2">
                      {sustainabilityData.communityPrograms.map((program, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{program}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* مؤشرات الاستدامة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-element">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {sustainabilityData.carbonFootprintReduction}%
                  </div>
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقليل البصمة الكربونية
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {sustainabilityData.renewableEnergyUsage}%
                  </div>
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    استخدام الطاقة المتجددة
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {sustainabilityData.greenBuildingProjects}
                  </div>
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مشاريع البناء الأخضر
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'office-digital-transformation':
        return (
          <div className="space-y-6 form-rtl">
            <CodeDisplay code="TAB-OFFICE-DIGITAL-TRANSFORMATION-018" position="top-right" />
            
            {/* مستوى النضج الرقمي */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Monitor className="h-5 w-5" />
                  التحول الرقمي والابتكار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {digitalTransformation.digitalMaturityLevel}/5
                    </div>
                    <div className="text-sm text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      مستوى النضج الرقمي
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {digitalTransformation.automationPercentage}%
                    </div>
                    <div className="text-sm text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      نسبة الأتمتة
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {digitalTransformation.cloudAdoption}%
                    </div>
                    <div className="text-sm text-purple-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اعتماد الحوسبة السحابية
                    </div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {digitalTransformation.digitalSkillsTraining}%
                    </div>
                    <div className="text-sm text-orange-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التدريب على المهارات الرقمية
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      أدوات الذكاء الاصطناعي المطبقة
                    </Label>
                    <div className="space-y-2">
                      {digitalTransformation.aiToolsImplemented.map((tool, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تقييم الأمن السيبراني
                    </Label>
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      {digitalTransformation.cybersecurityRating}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* مشاريع الابتكار */}
            <Card className="card-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <TrendingUp className="h-5 w-5" />
                  مشاريع الابتكار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          اسم المشروع
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الوصف
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الحالة
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          نسبة الإنجاز
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {digitalTransformation.innovationProjects.map((project) => (
                        <TableRow key={project.id} className="hover:bg-gray-50">
                          <TableCell className="text-right">
                            <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {project.projectName}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {project.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={
                              project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                              project.status === 'قيد التطوير' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${project.completionPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-code">
                                {project.completionPercentage}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قريباً
            </h3>
            <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              هذا التبويب قيد التطوير
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 rtl-support">
      {/* رأس الشاشة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة معلومات المكتب الشاملة
          </h1>
          <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام شامل لإدارة جميع معلومات المكتب الهندسي - 18 تبويب متخصص
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="button-rtl">
            <Download className="h-4 w-4" />
            تصدير البيانات
          </Button>
          <Button className="button-rtl">
            <Save className="h-4 w-4" />
            حفظ جميع التغييرات
          </Button>
        </div>
      </div>

      {/* التبويبات */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl-support">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-9 tabs-list-rtl">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="button-rtl text-xs p-2 flex flex-col gap-1"
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden lg:inline text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {tab.label}
              </span>
              <span className="text-xs font-code opacity-60">
                {tab.code.split('-').slice(-1)[0]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {renderTabContent()}
        </TabsContent>
      </Tabs>

      {/* شريط التقدم */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التقدم في إكمال البيانات
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((Object.keys(tabs).filter((_, index) => index < 8).length / tabs.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.round((8 / tabs.length) * 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          تم إكمال 8 من أصل {tabs.length} تبويب
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card className="card-element">
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {staffStats.totalEmployees}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي الموظفين
            </div>
          </CardContent>
        </Card>

        <Card className="card-element">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {achievements.length + certifications.length}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الإنجازات والشهادات
            </div>
          </CardContent>
        </Card>

        <Card className="card-element">
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {branches.length + 1}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المقرات والفروع
            </div>
          </CardContent>
        </Card>

        <Card className="card-element">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {partnerships.length}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الشراكات النشطة
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficeInfoManagement_Complete_18Tabs;