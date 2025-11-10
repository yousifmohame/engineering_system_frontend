import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Users, Building2, FileText, DollarSign, Calendar, Phone, Mail,
  MapPin, Star, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle,
  Briefcase, Award, Target, BarChart3, Plus, Edit, Trash2, Eye,
  Download, Upload, FileCheck, MessageSquare, Send, Lock, Unlock,
  PhoneCall, Printer, MapPinned, Shield, UserCheck, FileSignature,
  Ban, RefreshCw, Link, Users2, Home, Navigation
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '555-01', number: '555-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '555-02', number: '555-02', title: 'بروفايلات المقاولين', icon: Users },
  { id: '555-03', number: '555-03', title: 'التصنيفات والتخصصات', icon: Briefcase },
  { id: '555-04', number: '555-04', title: 'العقود والاتفاقيات', icon: FileSignature },
  { id: '555-05', number: '555-05', title: 'ربط العقود بالمعاملات', icon: Link },
  { id: '555-06', number: '555-06', title: 'المدفوعات والمستحقات', icon: DollarSign },
  { id: '555-07', number: '555-07', title: 'التقييمات والأداء', icon: Star },
  { id: '555-08', number: '555-08', title: 'التواصل والملاحظات', icon: Mail },
  { id: '555-09', number: '555-09', title: 'المستندات والشهادات', icon: Award },
  { id: '555-10', number: '555-10', title: 'الأحياء المخصصة', icon: Navigation },
  { id: '555-11', number: '555-11', title: 'التقارير', icon: TrendingUp },
];

// الواجهات
interface ContactDetails {
  primaryPhone: string;
  whatsappNumber: string;
  regularPhone: string;
  landlinePhone: string;
  faxNumber: string;
  primaryEmail: string;
  secondaryEmail: string;
  alternativePhone1: string;
  alternativePhone2: string;
  alternativePhone3: string;
}

interface AccreditationData {
  entityName: string;
  accreditationNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'ساري' | 'منتهي' | 'قريب الانتهاء';
}

interface AssignedDistrict {
  id: string;
  districtName: string;
  sectorName: string;
  assignmentDate: string;
  status: 'نشط' | 'معلق' | 'ملغي';
}

interface ContractorProfile {
  id: string;
  name: string;
  companyName: string;
  classification: string;
  specialization: string[];
  rating: number;
  projectsCount: number;
  totalValue: number;
  status: 'نشط' | 'معلق' | 'محظور' | 'مجمد';
  contactDetails: ContactDetails;
  accreditations: AccreditationData[];
  assignedDistricts: AssignedDistrict[];
  estimatedWorkValue: number;
  isOfficeMediator: boolean;
  publicNotes: string;
  privateNotes: string;
  activeContractsCount: number;
  underReviewContractsCount: number;
  city: string;
  joinDate: string;
  lastUpdateDate: string;
}

interface ContractLink {
  id: string;
  contractId: string;
  contractType: string;
  linkedType: 'معاملة' | 'عميل' | 'رخصة بناء';
  linkedId: string;
  linkedName: string;
  linkDate: string;
  status: 'نشط' | 'ملغي';
}

interface Contract {
  id: string;
  contractorId: string;
  contractorName: string;
  contractType: 'عقد ابتدائي' | 'عقد نهائي' | 'اتفاقية';
  projectName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'نشط' | 'تحت المراجعة' | 'معتمد' | 'مرفوض' | 'منتهي' | 'ملغي';
  approvalStatus: 'بانتظار الاعتماد' | 'معتمد من المكتب' | 'معتمد من الأطراف' | 'معتمد كامل' | 'مرفوض';
  terms: string;
  linkedTransactions: ContractLink[];
  linkedClients: ContractLink[];
  linkedLicenses: ContractLink[];
  createdDate: string;
  approvedDate?: string;
  approvedBy?: string;
}

const ContractorsRelations_Advanced_555: React.FC = () => {
  const [activeTab, setActiveTab] = useState('555-01');
  const [selectedContractor, setSelectedContractor] = useState<ContractorProfile | null>(null);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDistrictsDialog, setShowDistrictsDialog] = useState(false);
  const [showAccreditationsDialog, setShowAccreditationsDialog] = useState(false);
  const [showContractLinkDialog, setShowContractLinkDialog] = useState(false);

  // بيانات وهمية موسعة للمقاولين
  const [contractors, setContractors] = useState<ContractorProfile[]>([
    {
      id: 'CON001',
      name: 'م. أحمد محمد السعيد',
      companyName: 'شركة السعيد للمقاولات',
      classification: 'الدرجة الأولى',
      specialization: ['مباني سكنية', 'مباني تجارية', 'طرق'],
      rating: 4.8,
      projectsCount: 15,
      totalValue: 25000000,
      status: 'نشط',
      contactDetails: {
        primaryPhone: '0501234567',
        whatsappNumber: '0501234567',
        regularPhone: '0509876543',
        landlinePhone: '0112345678',
        faxNumber: '0112345679',
        primaryEmail: 'ahmad@alsaeed.com',
        secondaryEmail: 'info@alsaeed.com',
        alternativePhone1: '0551234567',
        alternativePhone2: '0561234567',
        alternativePhone3: '0571234567'
      },
      accreditations: [
        {
          entityName: 'وزارة الشؤون البلدية والقروية',
          accreditationNumber: 'ACC-2024-001',
          issueDate: '2024-01-15',
          expiryDate: '2026-01-15',
          status: 'ساري'
        },
        {
          entityName: 'الهيئة السعودية للمقاولين',
          accreditationNumber: 'HSC-2024-001',
          issueDate: '2024-03-20',
          expiryDate: '2025-03-20',
          status: 'ساري'
        }
      ],
      assignedDistricts: [
        {
          id: 'D001',
          districtName: 'حي العليا',
          sectorName: 'شمال الرياض',
          assignmentDate: '2024-01-10',
          status: 'نشط'
        },
        {
          id: 'D002',
          districtName: 'حي الملز',
          sectorName: 'وسط الرياض',
          assignmentDate: '2024-02-15',
          status: 'نشط'
        },
        {
          id: 'D003',
          districtName: 'حي الروضة',
          sectorName: 'شمال الرياض',
          assignmentDate: '2024-03-01',
          status: 'نشط'
        }
      ],
      estimatedWorkValue: 50000000,
      isOfficeMediator: true,
      publicNotes: 'مقاول موثوق وملتزم بالمواعيد. له سجل حافل في تنفيذ المشاريع الكبرى.',
      privateNotes: 'ملاحظة سرية: يفضل التعامل معه في المشاريع الكبيرة فقط. لديه مشكلة بسيطة في السيولة.',
      activeContractsCount: 8,
      underReviewContractsCount: 3,
      city: 'الرياض',
      joinDate: '2020-01-15',
      lastUpdateDate: '2025-11-01'
    },
    {
      id: 'CON002',
      name: 'م. خالد عبدالله الخالدي',
      companyName: 'مؤسسة الخالدي الإنشائية',
      classification: 'الدرجة الثانية',
      specialization: ['مباني سكنية', 'فلل', 'تشطيبات'],
      rating: 4.5,
      projectsCount: 12,
      totalValue: 18000000,
      status: 'نشط',
      contactDetails: {
        primaryPhone: '0509876543',
        whatsappNumber: '0509876543',
        regularPhone: '0501234567',
        landlinePhone: '0122345678',
        faxNumber: '0122345679',
        primaryEmail: 'khaled@alkhaldi.com',
        secondaryEmail: 'contact@alkhaldi.com',
        alternativePhone1: '0551234568',
        alternativePhone2: '',
        alternativePhone3: ''
      },
      accreditations: [
        {
          entityName: 'أمانة جدة',
          accreditationNumber: 'JED-2024-002',
          issueDate: '2024-02-01',
          expiryDate: '2025-02-01',
          status: 'قريب الانتهاء'
        }
      ],
      assignedDistricts: [
        {
          id: 'D004',
          districtName: 'حي الزهراء',
          sectorName: 'شمال جدة',
          assignmentDate: '2024-03-15',
          status: 'نشط'
        },
        {
          id: 'D005',
          districtName: 'حي الصفا',
          sectorName: 'وسط جدة',
          assignmentDate: '2024-04-01',
          status: 'نشط'
        }
      ],
      estimatedWorkValue: 30000000,
      isOfficeMediator: false,
      publicNotes: 'متخصص في الفلل والمباني السكنية الفاخرة.',
      privateNotes: 'ملاحظة سرية: يحتاج إلى متابعة دقيقة في المشاريع الكبيرة.',
      activeContractsCount: 5,
      underReviewContractsCount: 2,
      city: 'جدة',
      joinDate: '2021-03-20',
      lastUpdateDate: '2025-10-28'
    },
    {
      id: 'CON003',
      name: 'م. فهد سعد العتيبي',
      companyName: 'العتيبي للمقاولات العامة',
      classification: 'الدرجة الأولى',
      specialization: ['مباني صناعية', 'مستودعات', 'ورش'],
      rating: 4.9,
      projectsCount: 20,
      totalValue: 35000000,
      status: 'نشط',
      contactDetails: {
        primaryPhone: '0551234567',
        whatsappNumber: '0551234567',
        regularPhone: '0561234567',
        landlinePhone: '0132345678',
        faxNumber: '0132345679',
        primaryEmail: 'fahad@alotaibi.com',
        secondaryEmail: 'admin@alotaibi.com',
        alternativePhone1: '0571234567',
        alternativePhone2: '0581234567',
        alternativePhone3: '0591234567'
      },
      accreditations: [
        {
          entityName: 'أمانة الدمام',
          accreditationNumber: 'DAM-2024-003',
          issueDate: '2024-01-01',
          expiryDate: '2026-01-01',
          status: 'ساري'
        },
        {
          entityName: 'الهيئة الملكية للجبيل وينبع',
          accreditationNumber: 'RCJY-2024-001',
          issueDate: '2024-02-15',
          expiryDate: '2027-02-15',
          status: 'ساري'
        }
      ],
      assignedDistricts: [
        {
          id: 'D006',
          districtName: 'المنطقة الصناعية الأولى',
          sectorName: 'الدمام الصناعية',
          assignmentDate: '2024-01-05',
          status: 'نشط'
        },
        {
          id: 'D007',
          districtName: 'المنطقة الصناعية الثانية',
          sectorName: 'الدمام الصناعية',
          assignmentDate: '2024-01-05',
          status: 'نشط'
        },
        {
          id: 'D008',
          districtName: 'حي الفيصلية',
          sectorName: 'الدمام',
          assignmentDate: '2024-02-10',
          status: 'نشط'
        }
      ],
      estimatedWorkValue: 80000000,
      isOfficeMediator: true,
      publicNotes: 'أفضل مقاول للمشاريع الصناعية والمستودعات. سجل حافل ممتاز.',
      privateNotes: 'ملاحظة سرية: يُنصح به بشدة. موثوق وملتزم 100%.',
      activeContractsCount: 12,
      underReviewContractsCount: 5,
      city: 'الدمام',
      joinDate: '2019-06-10',
      lastUpdateDate: '2025-11-02'
    }
  ]);

  // بيانات وهمية للعقود الموسعة
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 'CONT001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      contractType: 'عقد نهائي',
      projectName: 'مشروع فلل الياسمين',
      value: 5000000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'معتمد',
      approvalStatus: 'معتمد كامل',
      terms: 'عقد مقاولة عامة - الدفع على مراحل - ضمان سنتين',
      linkedTransactions: [
        {
          id: 'LT001',
          contractId: 'CONT001',
          contractType: 'عقد نهائي',
          linkedType: 'معاملة',
          linkedId: 'TRX-2025-001',
          linkedName: 'معاملة رخصة بناء - فلل الياسمين',
          linkDate: '2025-01-05',
          status: 'نشط'
        },
        {
          id: 'LT002',
          contractId: 'CONT001',
          contractType: 'عقد نهائي',
          linkedType: 'معاملة',
          linkedId: 'TRX-2025-002',
          linkedName: 'معاملة فسح أراضي',
          linkDate: '2025-01-06',
          status: 'نشط'
        }
      ],
      linkedClients: [
        {
          id: 'LC001',
          contractId: 'CONT001',
          contractType: 'عقد نهائي',
          linkedType: 'عميل',
          linkedId: 'CLI-001',
          linkedName: 'عبدالله بن محمد العتيبي',
          linkDate: '2025-01-01',
          status: 'نشط'
        }
      ],
      linkedLicenses: [
        {
          id: 'LL001',
          contractId: 'CONT001',
          contractType: 'عقد نهائي',
          linkedType: 'رخصة بناء',
          linkedId: 'LIC-2025-001',
          linkedName: 'رخصة بناء فلل - رقم 123456',
          linkDate: '2025-01-03',
          status: 'نشط'
        }
      ],
      createdDate: '2024-12-15',
      approvedDate: '2024-12-28',
      approvedBy: 'م. سعد العمري - مدير المكتب'
    },
    {
      id: 'CONT002',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      contractType: 'عقد ابتدائي',
      projectName: 'مشروع برج النخيل التجاري',
      value: 15000000,
      startDate: '2024-06-01',
      endDate: '2026-06-01',
      status: 'تحت المراجعة',
      approvalStatus: 'بانتظار الاعتماد',
      terms: 'عقد BOT - تسليم مفتاح - ضمان 5 سنوات',
      linkedTransactions: [
        {
          id: 'LT003',
          contractId: 'CONT002',
          contractType: 'عقد ابتدائي',
          linkedType: 'معاملة',
          linkedId: 'TRX-2024-150',
          linkedName: 'معاملة ترخيص مبنى تجاري',
          linkDate: '2024-06-05',
          status: 'نشط'
        }
      ],
      linkedClients: [
        {
          id: 'LC002',
          contractId: 'CONT002',
          contractType: 'عقد ابتدائي',
          linkedType: 'عميل',
          linkedId: 'CLI-002',
          linkedName: 'شركة النخيل العقارية',
          linkDate: '2024-06-01',
          status: 'نشط'
        }
      ],
      linkedLicenses: [],
      createdDate: '2024-05-15',
      approvedDate: undefined,
      approvedBy: undefined
    },
    {
      id: 'CONT003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      contractType: 'اتفاقية',
      projectName: 'مشروع مجمع الورود السكني',
      value: 8000000,
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      status: 'معتمد',
      approvalStatus: 'معتمد من المكتب',
      terms: 'عقد مقاولة باطن - دفعة مقدمة 30%',
      linkedTransactions: [
        {
          id: 'LT004',
          contractId: 'CONT003',
          contractType: 'اتفاقية',
          linkedType: 'معاملة',
          linkedId: 'TRX-2024-080',
          linkedName: 'معاملة إفراغ أراضي',
          linkDate: '2024-03-05',
          status: 'نشط'
        }
      ],
      linkedClients: [
        {
          id: 'LC003',
          contractId: 'CONT003',
          contractType: 'اتفاقية',
          linkedType: 'عميل',
          linkedId: 'CLI-003',
          linkedName: 'فهد بن سعود القحطاني',
          linkDate: '2024-03-01',
          status: 'نشط'
        }
      ],
      linkedLicenses: [
        {
          id: 'LL002',
          contractId: 'CONT003',
          contractType: 'اتفاقية',
          linkedType: 'رخصة بناء',
          linkedId: 'LIC-2024-035',
          linkedName: 'رخصة بناء مجمع سكني - رقم 987654',
          linkDate: '2024-03-02',
          status: 'نشط'
        }
      ],
      createdDate: '2024-02-10',
      approvedDate: '2024-02-25',
      approvedBy: 'م. أحمد الغامدي - نائب المدير'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'جاري':
      case 'ساري':
      case 'مدفوع':
      case 'معتمد':
      case 'معتمد كامل':
        return '#10b981';
      case 'مكتمل':
        return '#2563eb';
      case 'معلق':
      case 'متأخر':
      case 'قريب الانتهاء':
      case 'تحت المراجعة':
      case 'بانتظار الاعتماد':
        return '#f59e0b';
      case 'محظور':
      case 'ملغي':
      case 'منتهي':
      case 'مرفوض':
      case 'مجمد':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const freezeContractor = (contractorId: string) => {
    setContractors(contractors.map(c => 
      c.id === contractorId ? { ...c, status: 'مجمد' } : c
    ));
    toast.success('تم تجميد بروفايل المقاول بنجاح');
  };

  const unfreezeContractor = (contractorId: string) => {
    setContractors(contractors.map(c => 
      c.id === contractorId ? { ...c, status: 'نشط' } : c
    ));
    toast.success('تم تفعيل بروفايل المقاول بنجاح');
  };

  const deleteContractor = (contractorId: string) => {
    if (confirm('هل أنت متأكد من حذف بروفايل المقاول؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      setContractors(contractors.filter(c => c.id !== contractorId));
      toast.success('تم حذف بروفايل المقاول بنجاح');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '555-01':
        // نظرة عامة
        return (
          <div className="space-y-6">
            {/* هيدر الشاشة */}
            <div
              style={{
                position: 'sticky',
                top: '0',
                zIndex: 10,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%) 1',
                padding: '0',
                marginBottom: '0',
                marginTop: '0',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, rgba(217, 119, 6, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                      border: '2px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    <Users 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#f59e0b',
                        filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3))' 
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
                          background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        علاقات المقاولين المتقدمة
                      </h1>
                      
                      <div
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
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
                          555
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
                      نظام شامل لإدارة المقاولين مع ربط العقود والمعاملات والعملاء ورخص البناء
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.15)'
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
                      11 تبويب متقدم
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Users className="h-4 w-4 mx-auto text-amber-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المقاولين
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.filter(c => c.status === 'نشط').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نشط
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <FileSignature className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.reduce((sum, c) => sum + c.activeContractsCount, 0)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عقود نشطة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Clock className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.reduce((sum, c) => sum + c.underReviewContractsCount, 0)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تحت المراجعة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(contractors.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي القيمة (ر.س)
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Target className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(contractors.reduce((sum, c) => sum + c.estimatedWorkValue, 0) / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    القيمة التقديرية
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Navigation className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.reduce((sum, c) => sum + c.assignedDistricts.length, 0)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أحياء مخصصة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Shield className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.reduce((sum, c) => sum + c.accreditations.length, 0)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اعتمادات
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول المقاولين */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  بروفايلات المقاولين المسجلين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشركة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عقود نشطة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحت المراجعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>أحياء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>وسيط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold">{contractor.name}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.classification}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline" style={{ backgroundColor: '#10b981', color: 'white' }}>
                            {contractor.activeContractsCount}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline" style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                            {contractor.underReviewContractsCount}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{contractor.assignedDistricts.length}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {contractor.isOfficeMediator ? (
                            <Badge variant="outline" style={{ backgroundColor: '#2563eb', color: 'white' }}>نعم</Badge>
                          ) : (
                            <Badge variant="outline">لا</Badge>
                          )}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(contractor.status), color: 'white' }}>
                            {contractor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedContractor(contractor);
                                setShowContractorDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {contractor.status === 'نشط' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => freezeContractor(contractor.id)}
                              >
                                <Lock className="h-3 w-3" />
                              </Button>
                            ) : contractor.status === 'مجمد' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => unfreezeContractor(contractor.id)}
                              >
                                <Unlock className="h-3 w-3" />
                              </Button>
                            ) : null}
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

      case '555-02':
        // بروفايلات المقاولين
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة بروفايل مقاول جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" dir="rtl">
                  <TabsList className="grid w-full grid-cols-5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="contact">التواصل</TabsTrigger>
                    <TabsTrigger value="accreditation">الاعتمادات</TabsTrigger>
                    <TabsTrigger value="districts">الأحياء</TabsTrigger>
                    <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <InputWithCopy
                        label="اسم المقاول *"
                        id="contractor-name"
                        placeholder="الاسم الكامل"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="اسم الشركة *"
                        id="company-name"
                        placeholder="اسم الشركة أو المؤسسة"
                        copyable={true}
                        clearable={true}
                      />
                      <SelectWithCopy
                        label="التصنيف *"
                        id="classification"
                        options={[
                          { value: 'first', label: 'الدرجة الأولى' },
                          { value: 'second', label: 'الدرجة الثانية' },
                          { value: 'third', label: 'الدرجة الثالثة' },
                          { value: 'fourth', label: 'الدرجة الرابعة' },
                        ]}
                        copyable={true}
                        clearable={true}
                      />
                      <SelectWithCopy
                        label="المدينة *"
                        id="city"
                        options={[
                          { value: 'riyadh', label: 'الرياض' },
                          { value: 'jeddah', label: 'جدة' },
                          { value: 'dammam', label: 'الدمام' },
                          { value: 'makkah', label: 'مكة المكرمة' },
                          { value: 'madinah', label: 'المدينة المنورة' },
                        ]}
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="القيمة التقديرية للأعمال (ر.س)"
                        id="estimated-value"
                        type="number"
                        placeholder="50000000"
                        copyable={true}
                        clearable={true}
                      />
                      <div className="flex items-center gap-2 mt-6">
                        <EnhancedSwitch id="is-mediator" />
                        <label htmlFor="is-mediator" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المكتب وسيط بين المقاول والمالك
                        </label>
                      </div>
                      <div className="col-span-2">
                        <TextAreaWithCopy
                          label="التخصصات"
                          id="specializations"
                          rows={2}
                          placeholder="مباني سكنية، مباني تجارية، طرق..."
                          copyable={true}
                          clearable={true}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <InputWithCopy
                        label="رقم الجوال الأساسي *"
                        id="primary-phone"
                        placeholder="05xxxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="رقم الواتساب"
                        id="whatsapp"
                        placeholder="05xxxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="رقم عادي"
                        id="regular-phone"
                        placeholder="05xxxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="رقم ثابت"
                        id="landline"
                        placeholder="011xxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="فاكس"
                        id="fax"
                        placeholder="011xxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="البريد الإلكتروني الأساسي *"
                        id="primary-email"
                        type="email"
                        placeholder="contractor@company.com"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="بريد إلكتروني ثانوي"
                        id="secondary-email"
                        type="email"
                        placeholder="info@company.com"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="رقم بديل 1"
                        id="alt-phone-1"
                        placeholder="05xxxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="رقم بديل 2"
                        id="alt-phone-2"
                        placeholder="05xxxxxxxx"
                        copyable={true}
                        clearable={true}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="accreditation" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>بيانات الاعتماد لدى الجهات</h3>
                        <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة اعتماد
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Card className="border-2">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-4 gap-3">
                              <InputWithCopy
                                label="الجهة *"
                                id="entity-name-1"
                                placeholder="وزارة الشؤون البلدية"
                                copyable={true}
                                clearable={true}
                              />
                              <InputWithCopy
                                label="رقم الاعتماد *"
                                id="accreditation-num-1"
                                placeholder="ACC-2024-001"
                                copyable={true}
                                clearable={true}
                              />
                              <InputWithCopy
                                label="تاريخ الإصدار *"
                                id="issue-date-1"
                                type="date"
                                copyable={true}
                                clearable={true}
                              />
                              <InputWithCopy
                                label="تاريخ الانتهاء *"
                                id="expiry-date-1"
                                type="date"
                                copyable={true}
                                clearable={true}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="districts" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>الأحياء المخصصة للمقاول</h3>
                        <Button size="sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Plus className="h-4 w-4 ml-2" />
                          تخصيص حي
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        قم بتحديد الأحياء التي يعمل فيها المقاول لتسهيل عملية البحث والتخصيص
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <TextAreaWithCopy
                        label="ملاحظات عامة (ظاهرة للجميع)"
                        id="public-notes"
                        rows={4}
                        placeholder="ملاحظات عامة عن المقاول..."
                        copyable={true}
                        clearable={true}
                      />
                      
                      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-red-600" />
                          <h3 className="text-sm font-bold text-red-700">ملاحظات سرية</h3>
                        </div>
                        <TextAreaWithCopy
                          label="ملاحظات سرية (للمديرين فقط)"
                          id="private-notes"
                          rows={4}
                          placeholder="ملاحظات سرية وحساسة عن المقاول..."
                          copyable={true}
                          clearable={true}
                        />
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ هذه الملاحظات سرية ولن تظهر إلا للمديرين والمخولين فقط
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم حفظ بروفايل المقاول بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    حفظ البروفايل
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* قائمة البروفايلات */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  جميع بروفايلات المقاولين ({contractors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contractors.map((contractor) => (
                    <div 
                      key={contractor.id}
                      className="p-4 border-2 rounded-lg hover:shadow-lg transition-shadow"
                      style={{ 
                        fontFamily: 'Tajawal, sans-serif',
                        borderColor: contractor.status === 'مجمد' ? '#ef4444' : '#e5e7eb'
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{contractor.name}</h3>
                            <Badge style={{ backgroundColor: getStatusColor(contractor.status), color: 'white' }}>
                              {contractor.status}
                            </Badge>
                            {contractor.isOfficeMediator && (
                              <Badge variant="outline" style={{ borderColor: '#2563eb', color: '#2563eb' }}>
                                <Users2 className="h-3 w-3 ml-1" />
                                المكتب وسيط
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{contractor.companyName}</p>
                          
                          <div className="grid grid-cols-6 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">التصنيف</p>
                              <p className="text-sm font-bold">{contractor.classification}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">عقود نشطة</p>
                              <p className="text-sm font-bold text-green-600">{contractor.activeContractsCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">تحت المراجعة</p>
                              <p className="text-sm font-bold text-orange-600">{contractor.underReviewContractsCount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">أحياء مخصصة</p>
                              <p className="text-sm font-bold text-blue-600">{contractor.assignedDistricts.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">اعتمادات</p>
                              <p className="text-sm font-bold text-purple-600">{contractor.accreditations.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">القيمة التقديرية</p>
                              <p className="text-sm font-bold text-amber-600">
                                {(contractor.estimatedWorkValue / 1000000).toFixed(1)}م ر.س
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-green-600" />
                              <span>{contractor.contactDetails.whatsappNumber}</span>
                              <Badge variant="outline" className="text-[10px] px-1">واتساب</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-blue-600" />
                              <span className="text-[11px]">{contractor.contactDetails.primaryEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PhoneCall className="h-3 w-3 text-gray-600" />
                              <span>{contractor.contactDetails.landlinePhone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedContractor(contractor);
                              setShowContractorDialog(true);
                            }}
                          >
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 ml-1" />
                            تعديل
                          </Button>
                          {contractor.status === 'نشط' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => freezeContractor(contractor.id)}
                            >
                              <Lock className="h-3 w-3 ml-1" />
                              تجميد
                            </Button>
                          ) : contractor.status === 'مجمد' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => unfreezeContractor(contractor.id)}
                            >
                              <Unlock className="h-3 w-3 ml-1" />
                              تفعيل
                            </Button>
                          ) : null}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-600"
                            onClick={() => deleteContractor(contractor.id)}
                          >
                            <Trash2 className="h-3 w-3 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </div>

                      {contractor.publicNotes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                          <p className="text-blue-800">{contractor.publicNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-04':
        // العقود والاتفاقيات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إنشاء عقد/اتفاقية جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع العقد *"
                    id="contract-type"
                    options={[
                      { value: 'preliminary', label: 'عقد ابتدائي' },
                      { value: 'final', label: 'عقد نهائي' },
                      { value: 'agreement', label: 'اتفاقية' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المشروع *"
                    id="project-name"
                    placeholder="مثال: مشروع فلل الياسمين"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="قيمة العقد (ر.س) *"
                    id="contract-value"
                    type="number"
                    placeholder="5000000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ البداية *"
                    id="start-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ النهاية *"
                    id="end-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-3">
                    <TextAreaWithCopy
                      label="شروط العقد"
                      id="terms"
                      rows={3}
                      placeholder="عقد مقاولة عامة - الدفع على مراحل..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم إنشاء العقد بنجاح - الآن في انتظار الاعتماد')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء العقد
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العقود والاتفاقيات ({contracts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة الاعتماد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>روابط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.contractorName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{contract.contractType}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.projectName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold text-green-600">
                          {(contract.value / 1000000).toFixed(1)}م ر.س
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(contract.approvalStatus), color: 'white' }}>
                            {contract.approvalStatus}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(contract.status), color: 'white' }}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px]">
                              {contract.linkedTransactions.length} معاملة
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {contract.linkedClients.length} عميل
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {contract.linkedLicenses.length} رخصة
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Link className="h-3 w-3" />
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

      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذا التاب قيد التطوير
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <ScrollArea className="h-full">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Dialog لعرض تفاصيل المقاول */}
      <Dialog open={showContractorDialog} onOpenChange={setShowContractorDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              بروفايل المقاول - {selectedContractor?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedContractor && (
            <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {/* البيانات الأساسية */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">البيانات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">الاسم</p>
                    <p className="font-bold">{selectedContractor.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">الشركة</p>
                    <p className="font-bold">{selectedContractor.companyName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">التصنيف</p>
                    <p>{selectedContractor.classification}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">المدينة</p>
                    <p>{selectedContractor.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">القيمة التقديرية</p>
                    <p className="font-bold text-amber-600">
                      {(selectedContractor.estimatedWorkValue / 1000000).toFixed(1)} مليون ر.س
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">المكتب وسيط</p>
                    <Badge variant="outline" style={{ 
                      backgroundColor: selectedContractor.isOfficeMediator ? '#2563eb' : '#6b7280',
                      color: 'white'
                    }}>
                      {selectedContractor.isOfficeMediator ? 'نعم' : 'لا'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* بيانات التواصل */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">بيانات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-gray-500 text-xs">واتساب</p>
                      <p className="font-bold">{selectedContractor.contactDetails.whatsappNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500 text-xs">هاتف ثابت</p>
                      <p>{selectedContractor.contactDetails.landlinePhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-gray-500 text-xs">فاكس</p>
                      <p>{selectedContractor.contactDetails.faxNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
                      <p className="text-xs">{selectedContractor.contactDetails.primaryEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* الاعتمادات */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">الاعتمادات ({selectedContractor.accreditations.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedContractor.accreditations.map((acc, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{acc.entityName}</p>
                          <p className="text-xs text-gray-600">رقم: {acc.accreditationNumber}</p>
                          <p className="text-xs text-gray-500">
                            من {acc.issueDate} إلى {acc.expiryDate}
                          </p>
                        </div>
                        <Badge style={{ backgroundColor: getStatusColor(acc.status), color: 'white' }}>
                          {acc.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* الأحياء المخصصة */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">الأحياء المخصصة ({selectedContractor.assignedDistricts.length})</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {selectedContractor.assignedDistricts.map((district) => (
                    <div key={district.id} className="p-2 border rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-3 w-3 text-cyan-600" />
                        <div>
                          <p className="font-bold">{district.districtName}</p>
                          <p className="text-gray-600">{district.sectorName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* الملاحظات */}
              {selectedContractor.publicNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ملاحظات عامة</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>{selectedContractor.publicNotes}</p>
                  </CardContent>
                </Card>
              )}

              {selectedContractor.privateNotes && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                      <Lock className="h-4 w-4" />
                      ملاحظات سرية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-red-800">
                    <p>{selectedContractor.privateNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorsRelations_Advanced_555;
