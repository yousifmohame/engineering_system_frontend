/**
 * الشاشة 555 - علاقات المقاولين v4.0 - جميع التابات مكتملة
 * ==============================================================
 * 
 * تحديثات v4.0:
 * ✅ تطوير شامل لجميع التابات (11 تاباً)
 * ✅ بيانات وهمية غنية (3 مقاولين + 4 عقود)
 * ✅ جداول تفصيلية لكل تاب
 * ✅ بطاقات إحصائية شاملة
 * ✅ نوافذ منبثقة تفاعلية
 * ✅ نظام كامل لإدارة بيانات التواصل
 * ✅ نظام إدارة الأحياء المخصصة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Progress } from '../ui/progress';
import {
  Users, Building2, FileText, DollarSign, Calendar, Phone, Mail,
  MapPin, Star, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle,
  Briefcase, Award, Target, BarChart3, Plus, Edit, Trash2, Eye,
  Download, Upload, FileCheck, MessageSquare, Send, 
  PhoneCall, Printer, MapPinned, Shield, UserCheck, FileSignature,
  Ban, RefreshCw, Link, Navigation, Home, Settings
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';

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
  primaryEmail: string;
  secondaryEmail: string;
  alternativePhone1: string;
  alternativePhone2: string;
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

interface Payment {
  id: string;
  contractorId: string;
  contractorName: string;
  contractId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'مدفوع' | 'معلق' | 'متأخر';
  invoiceNumber: string;
}

interface Evaluation {
  id: string;
  contractorId: string;
  contractorName: string;
  projectName: string;
  evaluationDate: string;
  overallRating: number;
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
  costRating: number;
  evaluator: string;
  comments: string;
}

interface Communication {
  id: string;
  contractorId: string;
  contractorName: string;
  type: 'email' | 'phone' | 'meeting' | 'whatsapp';
  subject: string;
  date: string;
  sender: string;
  recipient: string;
  content: string;
  status: 'مرسل' | 'مستلم' | 'قيد المراجعة';
}

interface Document {
  id: string;
  contractorId: string;
  contractorName: string;
  documentType: string;
  documentName: string;
  issueDate: string;
  expiryDate?: string;
  status: 'ساري' | 'منتهي' | 'قريب الانتهاء';
  fileSize: string;
}

const ContractorsRelations_Complete_555_v4: React.FC = () => {
  const [activeTab, setActiveTab] = useState('555-01');
  const [selectedContractor, setSelectedContractor] = useState<ContractorProfile | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDistrictsDialog, setShowDistrictsDialog] = useState(false);
  const [showAccreditationsDialog, setShowAccreditationsDialog] = useState(false);

  // بيانات وهمية موسعة للمقاولين (3 مقاولين)
  const contractors: ContractorProfile[] = [
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
        primaryEmail: 'ahmad@alsaeed.com',
        secondaryEmail: 'info@alsaeed.com',
        alternativePhone1: '0551234567',
        alternativePhone2: '0561234567'
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
          status: 'قريب الانتهاء'
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
      privateNotes: 'ملاحظة سرية: يفضل التعامل معه في المشاريع الكبيرة فقط.',
      activeContractsCount: 8,
      underReviewContractsCount: 3,
      city: 'الرياض',
      joinDate: '2020-03-15',
      lastUpdateDate: '2025-11-03'
    },
    {
      id: 'CON002',
      name: 'م. خالد عبدالله القحطاني',
      companyName: 'مؤسسة القحطاني للإنشاءات',
      classification: 'الدرجة الثانية',
      specialization: ['فلل سكنية', 'مساجد', 'مدارس'],
      rating: 4.5,
      projectsCount: 22,
      totalValue: 18000000,
      status: 'نشط',
      contactDetails: {
        primaryPhone: '0557891234',
        whatsappNumber: '0557891234',
        regularPhone: '0503456789',
        landlinePhone: '0113456789',
        primaryEmail: 'khalid@alqahtani.com',
        secondaryEmail: 'projects@alqahtani.com',
        alternativePhone1: '0541234567',
        alternativePhone2: '0521234567'
      },
      accreditations: [
        {
          entityName: 'أمانة منطقة الرياض',
          accreditationNumber: 'RYD-2023-015',
          issueDate: '2023-05-10',
          expiryDate: '2025-05-10',
          status: 'ساري'
        }
      ],
      assignedDistricts: [
        {
          id: 'D004',
          districtName: 'حي النرجس',
          sectorName: 'شمال الرياض',
          assignmentDate: '2024-01-20',
          status: 'نشط'
        },
        {
          id: 'D005',
          districtName: 'حي الياسمين',
          sectorName: 'شمال الرياض',
          assignmentDate: '2024-02-20',
          status: 'نشط'
        }
      ],
      estimatedWorkValue: 35000000,
      isOfficeMediator: false,
      publicNotes: 'متخصص في المباني السكنية الصغيرة والمتوسطة. جودة عالية.',
      privateNotes: 'ملاحظة سرية: ممتاز في الفلل، لكن لا يفضل للمشاريع الكبيرة.',
      activeContractsCount: 5,
      underReviewContractsCount: 2,
      city: 'الرياض',
      joinDate: '2021-08-20',
      lastUpdateDate: '2025-11-02'
    },
    {
      id: 'CON003',
      name: 'م. فهد سعود الدوسري',
      companyName: 'شركة الدوسري للمقاولات الصناعية',
      classification: 'الدرجة الأولى',
      specialization: ['مستودعات', 'مصانع', 'محطات وقود'],
      rating: 4.9,
      projectsCount: 28,
      totalValue: 45000000,
      status: 'نشط',
      contactDetails: {
        primaryPhone: '0559876543',
        whatsappNumber: '0559876543',
        regularPhone: '0505678901',
        landlinePhone: '0138765432',
        primaryEmail: 'fahad@aldossary.com',
        secondaryEmail: 'contracts@aldossary.com',
        alternativePhone1: '0568901234',
        alternativePhone2: '0578901234'
      },
      accreditations: [
        {
          entityName: 'الهيئة الملكية للجبيل وينبع',
          accreditationNumber: 'RCJY-2024-002',
          issueDate: '2024-02-01',
          expiryDate: '2026-02-01',
          status: 'ساري'
        },
        {
          entityName: 'وزارة الطاقة والصناعة',
          accreditationNumber: 'MOEI-2023-050',
          issueDate: '2023-11-15',
          expiryDate: '2025-11-15',
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
  ];

  // بيانات وهمية للمدفوعات
  const payments: Payment[] = [
    {
      id: 'PAY001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      contractId: 'CONT001',
      amount: 500000,
      paymentDate: '2025-01-15',
      paymentMethod: 'تحويل بنكي',
      status: 'مدفوع',
      invoiceNumber: 'INV-2025-001'
    },
    {
      id: 'PAY002',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      contractId: 'CONT001',
      amount: 750000,
      paymentDate: '2025-02-15',
      paymentMethod: 'شيك',
      status: 'مدفوع',
      invoiceNumber: 'INV-2025-002'
    },
    {
      id: 'PAY003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة القحطاني للإنشاءات',
      contractId: 'CONT002',
      amount: 350000,
      paymentDate: '2025-03-10',
      paymentMethod: 'تحويل بنكي',
      status: 'معلق',
      invoiceNumber: 'INV-2025-003'
    },
    {
      id: 'PAY004',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      contractId: 'CONT004',
      amount: 1200000,
      paymentDate: '2025-01-20',
      paymentMethod: 'تحويل بنكي',
      status: 'مدفوع',
      invoiceNumber: 'INV-2025-004'
    },
    {
      id: 'PAY005',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      contractId: 'CONT004',
      amount: 900000,
      paymentDate: '2025-04-05',
      paymentMethod: 'شيك',
      status: 'متأخر',
      invoiceNumber: 'INV-2025-005'
    }
  ];

  // بيانات وهمية للتقييمات
  const evaluations: Evaluation[] = [
    {
      id: 'EVAL001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      evaluationDate: '2025-10-15',
      overallRating: 4.8,
      qualityRating: 5.0,
      timelinessRating: 4.5,
      communicationRating: 4.8,
      costRating: 4.7,
      evaluator: 'م. سعد العمري',
      comments: 'أداء ممتاز في جميع الجوانب. التزام كامل بالمواصفات والمواعيد.'
    },
    {
      id: 'EVAL002',
      contractorId: 'CON002',
      contractorName: 'مؤسسة القحطاني للإنشاءات',
      projectName: 'بناء مسجد حي النرجس',
      evaluationDate: '2025-09-20',
      overallRating: 4.5,
      qualityRating: 4.7,
      timelinessRating: 4.3,
      communicationRating: 4.5,
      costRating: 4.5,
      evaluator: 'م. عبدالله الزهراني',
      comments: 'جودة عمل جيدة جداً. تأخير بسيط في بعض المراحل.'
    },
    {
      id: 'EVAL003',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      projectName: 'مستودع المنطقة الصناعية',
      evaluationDate: '2025-10-30',
      overallRating: 4.9,
      qualityRating: 5.0,
      timelinessRating: 4.9,
      communicationRating: 4.8,
      costRating: 4.9,
      evaluator: 'م. فيصل الحربي',
      comments: 'أداء استثنائي. أفضل مقاول للمشاريع الصناعية.'
    }
  ];

  // بيانات وهمية للتواصل
  const communications: Communication[] = [
    {
      id: 'COMM001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'email',
      subject: 'استفسار عن مرحلة التشطيبات',
      date: '2025-11-01',
      sender: 'المكتب',
      recipient: 'أحمد السعيد',
      content: 'نود الاستفسار عن موعد بدء مرحلة التشطيبات النهائية.',
      status: 'مرسل'
    },
    {
      id: 'COMM002',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'phone',
      subject: 'مكالمة بخصوص الجدول الزمني',
      date: '2025-10-28',
      sender: 'أحمد السعيد',
      recipient: 'المكتب',
      content: 'تم الاتفاق على تسليم المشروع يوم 15 ديسمبر 2025.',
      status: 'مستلم'
    },
    {
      id: 'COMM003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة القحطاني للإنشاءات',
      type: 'meeting',
      subject: 'اجتماع تنسيقي للمشروع',
      date: '2025-10-25',
      sender: 'المكتب',
      recipient: 'خالد القحطاني',
      content: 'تم مناقشة جميع التفاصيل الفنية والاتفاق على الخطوات القادمة.',
      status: 'قيد المراجعة'
    },
    {
      id: 'COMM004',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      type: 'whatsapp',
      subject: 'إرسال مخططات محدثة',
      date: '2025-11-02',
      sender: 'المكتب',
      recipient: 'فهد الدوسري',
      content: 'تم إرسال المخططات المحدثة للمستودع عبر واتساب.',
      status: 'مرسل'
    }
  ];

  // بيانات وهمية للمستندات
  const documents: Document[] = [
    {
      id: 'DOC001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      documentType: 'ترخيص مقاولات',
      documentName: 'ترخيص الدرجة الأولى',
      issueDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'ساري',
      fileSize: '2.4 MB'
    },
    {
      id: 'DOC002',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      documentType: 'شهادة تأمين',
      documentName: 'تأمين المسؤولية المهنية',
      issueDate: '2024-06-01',
      expiryDate: '2025-06-01',
      status: 'قريب الانتهاء',
      fileSize: '1.8 MB'
    },
    {
      id: 'DOC003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة القحطاني للإنشاءات',
      documentType: 'السجل التجاري',
      documentName: 'سجل تجاري رقم 1234567890',
      issueDate: '2021-08-20',
      expiryDate: '2026-08-20',
      status: 'ساري',
      fileSize: '1.2 MB'
    },
    {
      id: 'DOC004',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      documentType: 'شهادة جودة',
      documentName: 'شهادة ISO 9001',
      issueDate: '2023-03-10',
      expiryDate: '2026-03-10',
      status: 'ساري',
      fileSize: '3.1 MB'
    },
    {
      id: 'DOC005',
      contractorId: 'CON003',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      documentType: 'شهادة سلامة',
      documentName: 'شهادة السلامة المهنية',
      issueDate: '2024-01-01',
      status: 'ساري',
      fileSize: '2.7 MB'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'نشط': { label: 'نشط', color: 'bg-green-500' },
      'معلق': { label: 'معلق', color: 'bg-yellow-500' },
      'محظور': { label: 'محظور', color: 'bg-red-500' },
      'مجمد': { label: 'مجمد', color: 'bg-gray-500' },
      'مدفوع': { label: 'مدفوع', color: 'bg-green-500' },
      'متأخر': { label: 'متأخر', color: 'bg-red-500' },
      'ساري': { label: 'ساري', color: 'bg-green-500' },
      'منتهي': { label: 'منتهي', color: 'bg-red-500' },
      'قريب الانتهاء': { label: 'قريب الانتهاء', color: 'bg-yellow-500' },
      'مرسل': { label: 'مرسل', color: 'bg-blue-500' },
      'مستلم': { label: 'مستلم', color: 'bg-green-500' },
      'قيد المراجعة': { label: 'قيد المراجعة', color: 'bg-yellow-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '555-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على علاقات المقاولين</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />
                تصدير التقرير
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{contractors.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المقاولين</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{contractors.filter(c => c.status === 'نشط').length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مقاولين نشطين</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{contractors.reduce((sum, c) => sum + c.activeContractsCount, 0)}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Building2 className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>{contractors.reduce((sum, c) => sum + c.projectsCount, 0)}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المشاريع</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {(contractors.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة الإجمالية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', border: '2px solid #5eead4' }}>
                <CardContent className="p-2 text-center">
                  <Star className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0f766e' }}>
                    {(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط التقييم</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة المقاولين</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الشركة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors.map((contractor) => (
                      <TableRow key={contractor.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contractor.id}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.name}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.classification}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contractor.projectsCount}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-mono">{contractor.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(contractor.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
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

      case '555-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>بروفايلات المقاولين ({contractors.length})</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#2563eb' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة مقاول جديد
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.name}</h3>
                          {getStatusBadge(contractor.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-mono">{contractor.id}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.classification}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.city}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedContractor(contractor);
                            setShowContactDialog(true);
                          }}
                        >
                          <Phone className="h-3 w-3 ml-1" />
                          التواصل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedContractor(contractor);
                            setShowDistrictsDialog(true);
                          }}
                        >
                          <Navigation className="h-3 w-3 ml-1" />
                          الأحياء
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedContractor(contractor);
                            setShowAccreditationsDialog(true);
                          }}
                        >
                          <Award className="h-3 w-3 ml-1" />
                          الاعتمادات
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center p-2" style={{ background: '#f0f9ff', borderRadius: '8px' }}>
                        <Building2 className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                        <p className="text-xs font-mono">{contractor.projectsCount}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مشروع</p>
                      </div>
                      <div className="text-center p-2" style={{ background: '#f0fdf4', borderRadius: '8px' }}>
                        <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-1" />
                        <p className="text-xs font-mono">{(contractor.totalValue / 1000000).toFixed(1)}M</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</p>
                      </div>
                      <div className="text-center p-2" style={{ background: '#fefce8', borderRadius: '8px' }}>
                        <Star className="h-4 w-4 mx-auto text-yellow-600 mb-1" />
                        <p className="text-xs font-mono">{contractor.rating}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</p>
                      </div>
                      <div className="text-center p-2" style={{ background: '#fdf2f8', borderRadius: '8px' }}>
                        <FileSignature className="h-4 w-4 mx-auto text-pink-600 mb-1" />
                        <p className="text-xs font-mono">{contractor.activeContractsCount}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عقد نشط</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-3 w-3 text-gray-600" />
                      <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {contractor.specialization.join(' • ')}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.publicNotes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة التواصل */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">بيانات التواصل - {selectedContractor?.name}</DialogTitle>
                </DialogHeader>

                {selectedContractor && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الهاتف الأساسي"
                        id="primary-phone"
                        value={selectedContractor.contactDetails.primaryPhone}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="واتساب"
                        id="whatsapp"
                        value={selectedContractor.contactDetails.whatsappNumber}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="الهاتف العادي"
                        id="regular-phone"
                        value={selectedContractor.contactDetails.regularPhone}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="الهاتف الأرضي"
                        id="landline"
                        value={selectedContractor.contactDetails.landlinePhone}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="البريد الأساسي"
                        id="primary-email"
                        value={selectedContractor.contactDetails.primaryEmail}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="البريد الثانوي"
                        id="secondary-email"
                        value={selectedContractor.contactDetails.secondaryEmail}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="هاتف بديل 1"
                        id="alt-phone-1"
                        value={selectedContractor.contactDetails.alternativePhone1}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="هاتف بديل 2"
                        id="alt-phone-2"
                        value={selectedContractor.contactDetails.alternativePhone2}
                        readOnly
                        copyable={true}
                        clearable={false}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowContactDialog(false)}>إغلاق</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة الأحياء */}
            <Dialog open={showDistrictsDialog} onOpenChange={setShowDistrictsDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">الأحياء المخصصة - {selectedContractor?.name}</DialogTitle>
                  <DialogDescription className="dialog-description">
                    عدد الأحياء: {selectedContractor?.assignedDistricts.length}
                  </DialogDescription>
                </DialogHeader>

                {selectedContractor && (
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الحي</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ التخصيص</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedContractor.assignedDistricts.map((district, index) => (
                        <TableRow key={district.id}>
                          <TableCell className="text-right py-1 text-xs font-mono">{index + 1}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.districtName}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.sectorName}</TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{district.assignmentDate}</TableCell>
                          <TableCell className="text-right py-1">{getStatusBadge(district.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDistrictsDialog(false)}>إغلاق</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* نافذة الاعتمادات */}
            <Dialog open={showAccreditationsDialog} onOpenChange={setShowAccreditationsDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">الاعتمادات والتراخيص - {selectedContractor?.name}</DialogTitle>
                  <DialogDescription className="dialog-description">
                    عدد الاعتمادات: {selectedContractor?.accreditations.length}
                  </DialogDescription>
                </DialogHeader>

                {selectedContractor && (
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة المانحة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الاعتماد</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedContractor.accreditations.map((acc, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-right py-1 text-xs font-mono">{index + 1}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{acc.entityName}</TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{acc.accreditationNumber}</TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{acc.issueDate}</TableCell>
                          <TableCell className="text-right py-1 text-xs font-mono">{acc.expiryDate}</TableCell>
                          <TableCell className="text-right py-1">{getStatusBadge(acc.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAccreditationsDialog(false)}>إغلاق</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '555-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيفات والتخصصات</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#7c3aed' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة تصنيف
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* التصنيفات */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderBottom: '2px solid #a5b4fc' }}>
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    التصنيفات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-1">
                  <div className="space-y-2">
                    {[
                      { name: 'الدرجة الأولى', count: 2, color: '#10b981' },
                      { name: 'الدرجة الثانية', count: 1, color: '#3b82f6' },
                      { name: 'الدرجة الثالثة', count: 0, color: '#6b7280' },
                      { name: 'الدرجة الرابعة', count: 0, color: '#6b7280' }
                    ].map((classification, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: classification.color }}></div>
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{classification.name}</span>
                        </div>
                        <Badge className="text-xs" style={{ background: classification.color, color: '#ffffff' }}>{classification.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* التخصصات */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderBottom: '2px solid #fcd34d' }}>
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Target className="h-4 w-4 text-amber-600" />
                    التخصصات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-1">
                  <div className="space-y-2">
                    {[
                      { name: 'مباني سكنية', count: 2 },
                      { name: 'مباني تجارية', count: 1 },
                      { name: 'طرق', count: 1 },
                      { name: 'فلل سكنية', count: 1 },
                      { name: 'مساجد', count: 1 },
                      { name: 'مدارس', count: 1 },
                      { name: 'مستودعات', count: 1 },
                      { name: 'مصانع', count: 1 },
                      { name: 'محطات وقود', count: 1 }
                    ].map((spec, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{spec.name}</span>
                        <Badge className="text-xs" variant="outline">{spec.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول المقاولين حسب التخصص */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المقاولين حسب التخصص</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصصات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد التخصصات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.name}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.classification}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {contractor.specialization.join(' • ')}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contractor.specialization.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '555-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود والاتفاقيات</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#10b981' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة عقد جديد
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {contractors.reduce((sum, c) => sum + c.activeContractsCount, 0)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {contractors.reduce((sum, c) => sum + c.underReviewContractsCount, 0)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المراجعة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>15</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معتمدة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>2</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ملغاة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {(contractors.reduce((sum, c) => sum + c.estimatedWorkValue, 0) / 1000000).toFixed(0)}M
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة المقدرة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة العقود النشطة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {contractors.map((contractor) => (
                    <div key={contractor.id} className="p-2 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.name}</p>
                        </div>
                        <div className="text-left">
                          <Badge className="text-xs bg-blue-500 text-white">{contractor.activeContractsCount} عقد نشط</Badge>
                          <p className="text-xs text-gray-600 mt-1">{contractor.underReviewContractsCount} تحت المراجعة</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة المقدرة:</span>
                        <span className="font-mono">{contractor.estimatedWorkValue.toLocaleString('ar-SA')} ر.س</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>ربط العقود بالمعاملات</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#8b5cf6' }}>
                <Link className="h-3 w-3 ml-1" />
                ربط جديد
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Link className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>15</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الروابط</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>13</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>روابط نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>2</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>روابط ملغاة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الروابط الحالية</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {contractors.map((contractor) => (
                    <div key={contractor.id} className="p-2 rounded-lg" style={{ background: '#f0f9ff', border: '1px solid #bfdbfe' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {contractor.activeContractsCount} عقد مرتبط
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <Eye className="h-3 w-3 ml-1" />
                          عرض الروابط
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs bg-blue-500 text-white">معاملات: {contractor.activeContractsCount * 2}</Badge>
                        <Badge className="text-xs bg-green-500 text-white">عملاء: {contractor.activeContractsCount}</Badge>
                        <Badge className="text-xs bg-purple-500 text-white">رخص: {contractor.activeContractsCount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوعات والمستحقات ({payments.length})</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#059669' }}>
                <Plus className="h-3 w-3 ml-1" />
                تسجيل دفعة
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {payments.filter(p => p.status === 'مدفوع').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مدفوعة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {payments.filter(p => p.status === 'معلق').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {payments.filter(p => p.status === 'متأخر').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متأخرة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {(payments.reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المدفوعات</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الفاتورة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الدفع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الدفع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-green-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{payment.invoiceNumber}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{payment.amount.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{payment.paymentDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.paymentMethod}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '555-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييمات والأداء ({evaluations.length})</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#f59e0b' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة تقييم
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {['الجودة', 'الالتزام بالوقت', 'التواصل', 'التكلفة', 'التقييم العام'].map((criterion, index) => {
                const avgRating = evaluations.length > 0 
                  ? (evaluations.reduce((sum, e) => {
                      const ratings = [e.qualityRating, e.timelinessRating, e.communicationRating, e.costRating, e.overallRating];
                      return sum + ratings[index];
                    }, 0) / evaluations.length).toFixed(1)
                  : '0.0';
                
                return (
                  <Card key={index} className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                    <CardContent className="p-2 text-center">
                      <Star className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                      <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{avgRating}</p>
                      <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{criterion}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقيّم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id} className="hover:bg-yellow-50">
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{evaluation.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{evaluation.projectName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{evaluation.evaluationDate}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-mono">{evaluation.overallRating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{evaluation.evaluator}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{evaluation.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '555-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التواصل والملاحظات ({communications.length})</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#3b82f6' }}>
                <Plus className="h-3 w-3 ml-1" />
                تسجيل تواصل
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'email', icon: Mail, label: 'بريد', count: communications.filter(c => c.type === 'email').length, color: '#ef4444' },
                { type: 'phone', icon: Phone, label: 'هاتف', count: communications.filter(c => c.type === 'phone').length, color: '#3b82f6' },
                { type: 'meeting', icon: Users, label: 'اجتماع', count: communications.filter(c => c.type === 'meeting').length, color: '#8b5cf6' },
                { type: 'whatsapp', icon: MessageSquare, label: 'واتساب', count: communications.filter(c => c.type === 'whatsapp').length, color: '#10b981' }
              ].map((item, index) => (
                <Card key={index} className="card-element card-rtl" style={{ background: `${item.color}10`, border: `2px solid ${item.color}40` }}>
                  <CardContent className="p-2 text-center">
                    <item.icon className="h-5 w-5 mx-auto mb-1" style={{ color: item.color }} />
                    <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.count}</p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>من</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communications.map((comm) => (
                      <TableRow key={comm.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1">
                          {comm.type === 'email' && <Mail className="h-3 w-3 inline text-red-500" />}
                          {comm.type === 'phone' && <Phone className="h-3 w-3 inline text-blue-500" />}
                          {comm.type === 'meeting' && <Users className="h-3 w-3 inline text-purple-500" />}
                          {comm.type === 'whatsapp' && <MessageSquare className="h-3 w-3 inline text-green-500" />}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.subject}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{comm.date}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.sender}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.recipient}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(comm.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '555-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستندات والشهادات ({documents.length})</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#7c3aed' }}>
                <Upload className="h-3 w-3 ml-1" />
                رفع مستند
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {documents.filter(d => d.status === 'ساري').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مستندات سارية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {documents.filter(d => d.status === 'قريب الانتهاء').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قريبة الانتهاء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {documents.filter(d => d.status === 'منتهي').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>منتهية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المستند</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المستند</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-purple-50">
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.documentType}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.documentName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{doc.issueDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{doc.expiryDate || '-'}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{doc.fileSize}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
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

      case '555-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأحياء المخصصة</h2>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#0891b2' }}>
                <Plus className="h-3 w-3 ml-1" />
                تخصيص حي جديد
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', border: '2px solid #5eead4' }}>
                <CardContent className="p-2 text-center">
                  <Navigation className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0f766e' }}>
                    {contractors.reduce((sum, c) => sum + c.assignedDistricts.length, 0)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي التخصيصات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {contractors.reduce((sum, c) => sum + c.assignedDistricts.filter(d => d.status === 'نشط').length, 0)}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تخصيصات نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {new Set(contractors.flatMap(c => c.assignedDistricts.map(d => d.districtName))).size}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أحياء مختلفة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Target className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {new Set(contractors.flatMap(c => c.assignedDistricts.map(d => d.sectorName))).size}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قطاعات مختلفة</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="card-element card-rtl">
                  <CardHeader className="p-2 pb-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.companyName}</CardTitle>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contractor.name}</p>
                      </div>
                      <Badge className="text-xs bg-teal-500 text-white">{contractor.assignedDistricts.length} حي</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <Table className="table-rtl dense-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الحي</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ التخصيص</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contractor.assignedDistricts.map((district, index) => (
                          <TableRow key={district.id}>
                            <TableCell className="text-right py-1 text-xs font-mono">{index + 1}</TableCell>
                            <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.districtName}</TableCell>
                            <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.sectorName}</TableCell>
                            <TableCell className="text-right py-1 text-xs font-mono">{district.assignmentDate}</TableCell>
                            <TableCell className="text-right py-1">{getStatusBadge(district.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '555-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والإحصائيات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />
                تصدير جميع التقارير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'تقرير شامل بالمقاولين', icon: FileText, color: '#2563eb' },
                { name: 'تقرير العقود النشطة', icon: FileSignature, color: '#10b981' },
                { name: 'تقرير المدفوعات', icon: DollarSign, color: '#f59e0b' },
                { name: 'تقرير التقييمات', icon: Star, color: '#ec4899' },
                { name: 'تقرير التواصل', icon: Mail, color: '#8b5cf6' },
                { name: 'تقرير المستندات', icon: Award, color: '#0891b2' },
                { name: 'تقرير الأحياء المخصصة', icon: Navigation, color: '#dc2626' },
                { name: 'تقرير الأداء الشهري', icon: TrendingUp, color: '#059669' }
              ].map((report, index) => (
                <Card key={index} className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: `${report.color}10`, border: `2px solid ${report.color}40` }}>
                  <CardContent className="p-3 text-center">
                    <report.icon className="h-8 w-8 mx-auto mb-2" style={{ color: report.color }} />
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: report.color }}>{report.name}</p>
                    <div className="flex gap-1 justify-center">
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        <Eye className="h-2.5 w-2.5 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        <Download className="h-2.5 w-2.5 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-555" position="top-right" />
      
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
              <Users 
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
                  علاقات المقاولين
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
                إدارة شاملة لعلاقات المقاولين والعقود والتقييمات
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
                11 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ContractorsRelations_Complete_555_v4;
