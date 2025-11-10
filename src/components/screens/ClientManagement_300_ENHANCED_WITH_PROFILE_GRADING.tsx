/**
 * ============================================================================
 * الشاشة 300 - إدارة العملاء - نظام البروفايل والتصنيف المحسّن v17.0
 * ============================================================================
 * 
 * التحديثات الجديدة v17.0:
 * ✅ نافذة بروفايل تفصيلية شاملة للعميل (عند الضغط عليه)
 * ✅ نظام تصنيفات العملاء (قابل للتخصيص)
 * ✅ نظام الدرجات الأوتوماتيكي (أ، ب، ج)
 * ✅ معايير حساب الدرجة:
 *    - حجم التعامل الإجمالي (الأتعاب)
 *    - نوعية المشاريع (من تصنيفات المشاريع)
 *    - تنوع أنواع المعاملات
 *    - نسبة المعاملات المنجزة
 *    - التقييم السري (0-100)
 * ✅ تاب إعدادات محسّن مع إدارة المعايير
 * 
 * @version 17.0 ENHANCED
 * @date 2025-11-03
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  Users, Plus, Edit, Trash2, Search, Filter, Download, Upload, Phone, Mail,
  MapPin, Building2, FileText, DollarSign, Calendar, Clock, CheckCircle, 
  AlertTriangle, Star, TrendingUp, BarChart3, Eye, Copy, Printer, FileSpreadsheet,
  User, Home, Briefcase, Award, Activity, Target, Flag, Percent, X, Save,
  RefreshCw, MessageSquare, Bell, ShieldCheck, Settings, ExternalLink, Hash,
  ThumbsUp, Layers, Package, TrendingDown, Info, Award as Medal, Zap,
  UserCheck, Shield, AlertCircleIcon, Settings2, Sliders
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import CodeDisplay from '../CodeDisplay';

// ============================================================================
// واجهات البيانات المحسّنة
// ============================================================================

interface ClientName {
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  familyName: string;
}

interface ClientContact {
  mobile: string;
  phone?: string;
  email: string;
  fax?: string;
  whatsapp?: string;
}

interface ClientAddress {
  country: string;
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  additionalNumber?: string;
  fullAddress: string;
}

interface ClientIdentification {
  idType: 'هوية وطنية' | 'إقامة' | 'جواز سفر' | 'سجل تجاري';
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  issuePlace: string;
}

interface ClientTransaction {
  id: string;
  transactionNumber: string;
  type: string;
  category: string;
  projectClassification?: string; // تصنيف المشروع
  status: string;
  statusColor: string;
  createdDate: string;
  completedDate?: string;
  totalFees: number;
  paidAmount: number;
  remainingAmount: number;
  location: string;
  deedNumber: string;
  progress: number;
}

// 🆕 نظام الدرجات
type ClientGrade = 'أ' | 'ب' | 'ج';

interface GradingCriteria {
  totalFeesWeight: number;      // وزن إجمالي الأتعاب (0-100)
  projectTypesWeight: number;    // وزن نوعية المشاريع (0-100)
  transactionTypesWeight: number; // وزن تنوع المعاملات (0-100)
  completionRateWeight: number;  // وزن نسبة الإنجاز (0-100)
  secretRatingWeight: number;    // وزن التقييم السري (0-100)
}

interface GradeThresholds {
  gradeA: { min: number; max: number };  // درجة أ
  gradeB: { min: number; max: number };  // درجة ب
  gradeC: { min: number; max: number };  // درجة ج
}

interface ClientClassification {
  id: string;
  name: string;
  color: string;
  description: string;
  isActive: boolean;
}

interface Client {
  id: string;
  code: string;
  name: ClientName;
  contact: ClientContact;
  address: ClientAddress;
  identification: ClientIdentification;
  type: 'فرد' | 'شركة' | 'جهة حكومية';
  category: string; // تصنيف قابل للتخصيص
  classification?: ClientClassification; // تصنيف إضافي
  nationality: string;
  occupation?: string;
  company?: string;
  rating: number; // تقييم عام (1-5)
  secretRating: number; // 🆕 تقييم سري (0-100)
  grade?: ClientGrade; // 🆕 الدرجة المحسوبة
  gradeScore?: number; // 🆕 النقاط الكلية (0-100)
  isActive: boolean;
  notes?: string;
  createdDate: string;
  lastModified: string;
  transactions: ClientTransaction[];
  totalTransactions: number;
  completedTransactions: number;
  activeTransactions: number;
  totalFees: number;
  totalPaid: number;
  totalRemaining: number;
  projectTypes: string[]; // 🆕 أنواع المشاريع التي تعامل معها
  transactionTypes: string[]; // 🆕 أنواع المعاملات
}

// ============================================================================
// المكون الرئيسي
// ============================================================================

const ClientManagement_300_ENHANCED: React.FC = () => {
  const [activeTab, setActiveTab] = useState('300-01');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // النوافذ المنبثقة
  const [showProfileDialog, setShowProfileDialog] = useState(false); // 🆕 بروفايل العميل
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);
  
  // الفلاتر
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterGrade, setFilterGrade] = useState<'all' | ClientGrade>('all'); // 🆕
  
  // إعدادات التصنيف
  const [clientClassifications, setClientClassifications] = useState<ClientClassification[]>([]);
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriteria>({
    totalFeesWeight: 30,
    projectTypesWeight: 20,
    transactionTypesWeight: 15,
    completionRateWeight: 20,
    secretRatingWeight: 15
  });
  const [gradeThresholds, setGradeThresholds] = useState<GradeThresholds>({
    gradeA: { min: 80, max: 100 },
    gradeB: { min: 60, max: 79 },
    gradeC: { min: 0, max: 59 }
  });

  // ============================================================================
  // دوال مساعدة
  // ============================================================================

  const getShortName = (name: ClientName) => {
    return `${name.firstName} ${name.familyName}`;
  };

  const getFullName = (name: ClientName) => {
    return `${name.firstName} ${name.fatherName} ${name.grandFatherName} ${name.familyName}`;
  };

  // 🆕 حساب درجة العميل أوتوماتيكياً
  const calculateClientGrade = (client: Client): { grade: ClientGrade; score: number } => {
    let totalScore = 0;
    const totalWeight = Object.values(gradingCriteria).reduce((sum, weight) => sum + weight, 0);

    // 1. حجم التعامل الإجمالي (0-100)
    const feesScore = Math.min(100, (client.totalFees / 500000) * 100); // افتراض أن 500K = 100
    totalScore += (feesScore * gradingCriteria.totalFeesWeight) / totalWeight;

    // 2. نوعية المشاريع (تنوع تصنيفات المشاريع)
    const uniqueProjectTypes = new Set(client.projectTypes || []);
    const projectTypesScore = Math.min(100, (uniqueProjectTypes.size / 5) * 100); // افتراض 5 أنواع = 100
    totalScore += (projectTypesScore * gradingCriteria.projectTypesWeight) / totalWeight;

    // 3. تنوع أنواع المعاملات
    const uniqueTransactionTypes = new Set(client.transactionTypes || []);
    const transactionTypesScore = Math.min(100, (uniqueTransactionTypes.size / 8) * 100); // افتراض 8 أنواع = 100
    totalScore += (transactionTypesScore * gradingCriteria.transactionTypesWeight) / totalWeight;

    // 4. نسبة الإنجاز
    const completionRate = client.totalTransactions > 0 
      ? (client.completedTransactions / client.totalTransactions) * 100 
      : 0;
    totalScore += (completionRate * gradingCriteria.completionRateWeight) / totalWeight;

    // 5. التقييم السري
    totalScore += (client.secretRating * gradingCriteria.secretRatingWeight) / totalWeight;

    // تحديد الدرجة
    const score = Math.round(totalScore);
    let grade: ClientGrade;
    
    if (score >= gradeThresholds.gradeA.min) {
      grade = 'أ';
    } else if (score >= gradeThresholds.gradeB.min) {
      grade = 'ب';
    } else {
      grade = 'ج';
    }

    return { grade, score };
  };

  // 🆕 الحصول على لون الدرجة
  const getGradeColor = (grade: ClientGrade): string => {
    switch (grade) {
      case 'أ': return '#10b981'; // أخضر
      case 'ب': return '#f59e0b'; // برتقالي
      case 'ج': return '#ef4444'; // أحمر
      default: return '#6b7280';
    }
  };

  // 🆕 الحصول على وصف الدرجة
  const getGradeDescription = (grade: ClientGrade): string => {
    switch (grade) {
      case 'أ': return 'عميل ممتاز - أولوية قصوى';
      case 'ب': return 'عميل جيد - متوسط الأهمية';
      case 'ج': return 'عميل عادي - أولوية منخفضة';
      default: return '';
    }
  };

  // ============================================================================
  // تكوين التابات
  // ============================================================================

  const TABS_CONFIG: TabConfig[] = [
    { id: '300-01', number: '300-01', title: 'قائمة العملاء', icon: Users },
    { id: '300-02', number: '300-02', title: 'البيانات الأساسية', icon: User },
    { id: '300-03', number: '300-03', title: 'بيانات الاتصال', icon: Phone },
    { id: '300-04', number: '300-04', title: 'العنوان', icon: MapPin },
    { id: '300-05', number: '300-05', title: 'بيانات الهوية', icon: FileText },
    { id: '300-06', number: '300-06', title: 'المعاملات', icon: Briefcase },
    { id: '300-07', number: '300-07', title: 'الأتعاب والمدفوعات', icon: DollarSign },
    { id: '300-08', number: '300-08', title: 'التقييم والملاحظات', icon: Star },
    { id: '300-09', number: '300-09', title: 'الإحصائيات', icon: BarChart3 },
    { id: '300-10', number: '300-10', title: 'التقارير', icon: Printer },
    { id: '300-11', number: '300-11', title: 'السجل الزمني', icon: Clock },
    { id: '300-12', number: '300-12', title: 'التصنيفات والإعدادات', icon: Settings } // 🆕 محدّث
  ];

  // ============================================================================
  // البيانات التجريبية المحسّنة
  // ============================================================================

  useEffect(() => {
    // تحميل التصنيفات الافتراضية
    const defaultClassifications: ClientClassification[] = [
      { id: 'vip', name: 'VIP', color: '#f59e0b', description: 'عملاء مميزون', isActive: true },
      { id: 'corporate', name: 'مؤسسة', color: '#3b82f6', description: 'شركات ومؤسسات', isActive: true },
      { id: 'regular', name: 'عادي', color: '#6b7280', description: 'عملاء عاديون', isActive: true },
      { id: 'government', name: 'حكومي', color: '#10b981', description: 'جهات حكومية', isActive: true },
      { id: 'special', name: 'خاص', color: '#8b5cf6', description: 'عملاء بمعاملة خاصة', isActive: true }
    ];
    setClientClassifications(defaultClassifications);

    // بيانات عملاء تجريبية محسّنة
    const mockClients: Client[] = [
      {
        id: 'cl001',
        code: 'CLT-2025-001',
        name: { firstName: 'محمد', fatherName: 'أحمد', grandFatherName: 'عبدالله', familyName: 'العلي' },
        contact: { mobile: '0551234567', phone: '0114567890', email: 'mohammed.ali@email.com', whatsapp: '0551234567' },
        address: { country: 'المملكة العربية السعودية', city: 'الرياض', district: 'النرجس', street: 'طريق الملك فهد', buildingNumber: '1234', postalCode: '12345', additionalNumber: '5678', fullAddress: 'طريق الملك فهد، حي النرجس، الرياض 12345' },
        identification: { idType: 'هوية وطنية', idNumber: '1234567890', issueDate: '2020-01-15', expiryDate: '2030-01-15', issuePlace: 'الرياض' },
        type: 'فرد',
        category: 'VIP',
        nationality: 'سعودي',
        occupation: 'مهندس',
        rating: 5,
        secretRating: 92, // 🆕 تقييم سري عالي
        isActive: true,
        notes: 'عميل ممتاز، دفع منتظم، لديه عدة مشاريع',
        createdDate: '2023-01-15',
        lastModified: '2025-11-03',
        transactions: [
          { 
            id: 'tr001', 
            transactionNumber: '2510245', 
            type: 'ترخيص بناء', 
            category: 'سكني', 
            projectClassification: 'فيلا سكنية فاخرة',
            status: 'مكتملة', 
            statusColor: '#10b981', 
            createdDate: '2025-09-01', 
            completedDate: '2025-10-15', 
            totalFees: 25000, 
            paidAmount: 25000, 
            remainingAmount: 0, 
            location: 'حي النرجس، الرياض', 
            deedNumber: '123456789', 
            progress: 100 
          },
          { 
            id: 'tr002', 
            transactionNumber: '2510189', 
            type: 'إفراز', 
            category: 'تجاري', 
            projectClassification: 'مجمع تجاري',
            status: 'قيد المعالجة', 
            statusColor: '#f59e0b', 
            createdDate: '2025-08-15', 
            totalFees: 35000, 
            paidAmount: 25000, 
            remainingAmount: 10000, 
            location: 'حي العليا، الرياض', 
            deedNumber: '987654321', 
            progress: 65 
          },
          { 
            id: 'tr003', 
            transactionNumber: '2509156', 
            type: 'تصميم معماري', 
            category: 'سكني', 
            projectClassification: 'فيلا سكنية',
            status: 'مكتملة', 
            statusColor: '#10b981', 
            createdDate: '2025-07-10', 
            completedDate: '2025-09-05', 
            totalFees: 18000, 
            paidAmount: 18000, 
            remainingAmount: 0, 
            location: 'حي الملقا، الرياض', 
            deedNumber: '456789123', 
            progress: 100 
          }
        ],
        totalTransactions: 3,
        completedTransactions: 2,
        activeTransactions: 1,
        totalFees: 78000,
        totalPaid: 68000,
        totalRemaining: 10000,
        projectTypes: ['فيلا سكنية فاخرة', 'مجمع تجاري', 'فيلا سكنية'], // 🆕
        transactionTypes: ['ترخيص بناء', 'إفراز', 'تصميم معماري'] // 🆕
      },
      {
        id: 'cl002',
        code: 'CLT-2025-002',
        name: { firstName: 'فاطمة', fatherName: 'خالد', grandFatherName: 'سعيد', familyName: 'الحسن' },
        contact: { mobile: '0559876543', email: 'fatima.hassan@email.com', whatsapp: '0559876543' },
        address: { country: 'المملكة العربية السعودية', city: 'جدة', district: 'الحمراء', street: 'شارع فلسطين', buildingNumber: '5678', postalCode: '23456', fullAddress: 'شارع فلسطين، حي الحمراء، جدة 23456' },
        identification: { idType: 'هوية وطنية', idNumber: '2345678901', issueDate: '2021-03-20', expiryDate: '2031-03-20', issuePlace: 'جدة' },
        type: 'فرد',
        category: 'عادي',
        nationality: 'سعودي',
        occupation: 'طبيبة',
        rating: 4,
        secretRating: 68, // 🆕 تقييم سري متوسط
        isActive: true,
        notes: 'عميلة جيدة',
        createdDate: '2023-03-20',
        lastModified: '2025-11-02',
        transactions: [
          { 
            id: 'tr004', 
            transactionNumber: '2510198', 
            type: 'ترخيص بناء', 
            category: 'سكني', 
            projectClassification: 'منزل سكني',
            status: 'في انتظار الموافقة', 
            statusColor: '#eab308', 
            createdDate: '2025-09-15', 
            totalFees: 22000, 
            paidAmount: 15000, 
            remainingAmount: 7000, 
            location: 'حي الحمراء، جدة', 
            deedNumber: '234567890', 
            progress: 45 
          }
        ],
        totalTransactions: 1,
        completedTransactions: 0,
        activeTransactions: 1,
        totalFees: 22000,
        totalPaid: 15000,
        totalRemaining: 7000,
        projectTypes: ['منزل سكني'], // 🆕
        transactionTypes: ['ترخيص بناء'] // 🆕
      }
    ];

    // حساب الدرجة لكل عميل
    const clientsWithGrades = mockClients.map(client => {
      const { grade, score } = calculateClientGrade(client);
      return {
        ...client,
        grade,
        gradeScore: score
      };
    });

    setClients(clientsWithGrades);
  }, []);

  // إعادة حساب الدرجات عند تغيير المعايير
  useEffect(() => {
    const updatedClients = clients.map(client => {
      const { grade, score } = calculateClientGrade(client);
      return {
        ...client,
        grade,
        gradeScore: score
      };
    });
    setClients(updatedClients);
  }, [gradingCriteria, gradeThresholds]);

  // ============================================================================
  // إحصائيات العملاء
  // ============================================================================

  const stats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter(c => c.isActive).length,
      gradeA: clients.filter(c => c.grade === 'أ').length,
      gradeB: clients.filter(c => c.grade === 'ب').length,
      gradeC: clients.filter(c => c.grade === 'ج').length,
      totalTransactions: clients.reduce((sum, c) => sum + c.totalTransactions, 0),
      totalFees: clients.reduce((sum, c) => sum + c.totalFees, 0),
      totalPaid: clients.reduce((sum, c) => sum + c.totalPaid, 0),
      totalRemaining: clients.reduce((sum, c) => sum + c.totalRemaining, 0)
    };
  }, [clients]);

  // ============================================================================
  // نافذة بروفايل العميل التفصيلية 🆕
  // ============================================================================

  const renderClientProfileDialog = () => {
    if (!selectedClient) return null;

    const { grade, score } = calculateClientGrade(selectedClient);
    const gradeColor = getGradeColor(grade);
    const gradeDesc = getGradeDescription(grade);

    return (
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent 
          className="max-w-7xl"
          style={{ 
            maxHeight: '90vh', 
            fontFamily: 'Tajawal, sans-serif', 
            direction: 'rtl' 
          }}
        >
          <DialogHeader>
            <DialogTitle 
              style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div 
                style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: '12px',
                  border: '2px solid #93c5fd'
                }}
              >
                <UserCheck className="h-6 w-6" style={{ color: '#2563eb' }} />
              </div>
              بروفايل العميل الشامل
              <Badge 
                style={{ 
                  background: gradeColor, 
                  color: '#fff', 
                  fontSize: '14px', 
                  padding: '4px 12px',
                  fontWeight: 700
                }}
              >
                الدرجة: {grade}
              </Badge>
            </DialogTitle>
            <DialogDescription style={{ fontSize: '13px', color: '#6b7280' }}>
              معلومات تفصيلية وإحصائيات شاملة للعميل
            </DialogDescription>
          </DialogHeader>

          <ScrollArea style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="space-y-4 p-4">
              {/* القسم الأول: معلومات العميل الأساسية */}
              <div className="grid grid-cols-3 gap-3">
                {/* البطاقة الأولى: المعلومات الشخصية */}
                <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div 
                        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                      >
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: '#1e40af' }}>
                        {getFullName(selectedClient.name)}
                      </h3>
                      <p className="text-xs text-gray-600">{selectedClient.code}</p>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">النوع:</span>
                        <span className="font-semibold">{selectedClient.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التصنيف:</span>
                        <Badge variant="outline" style={{ fontSize: '10px' }}>{selectedClient.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الجنسية:</span>
                        <span className="font-semibold">{selectedClient.nationality}</span>
                      </div>
                      {selectedClient.occupation && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">المهنة:</span>
                          <span className="font-semibold">{selectedClient.occupation}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* البطاقة الثانية: التقييم والدرجة */}
                <Card style={{ background: `linear-gradient(135deg, ${gradeColor}15 0%, ${gradeColor}08 100%)`, border: `2px solid ${gradeColor}` }}>
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">التقييم والدرجة</h4>
                      <div 
                        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-2"
                        style={{ 
                          background: gradeColor,
                          boxShadow: `0 4px 16px ${gradeColor}40`
                        }}
                      >
                        <span className="text-4xl font-bold text-white">{grade}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: gradeColor }}>
                        {gradeDesc}
                      </p>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">النقاط الكلية:</span>
                          <span className="text-sm font-bold" style={{ color: gradeColor }}>
                            {score}/100
                          </span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="text-center p-2 bg-white rounded border">
                          <p className="text-[10px] text-gray-600">تقييم عام</p>
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star}
                                className="h-3 w-3"
                                style={{ 
                                  fill: star <= selectedClient.rating ? '#fbbf24' : 'none',
                                  color: star <= selectedClient.rating ? '#fbbf24' : '#d1d5db'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <p className="text-[10px] text-gray-600">تقييم سري</p>
                          <p className="text-sm font-bold text-purple-600 mt-1">
                            {selectedClient.secretRating}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* البطاقة الثالثة: الإحصائيات المالية */}
                <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      الملخص المالي
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-600 mb-1">إجمالي الأتعاب</p>
                        <p className="text-xl font-bold text-green-900">
                          {selectedClient.totalFees.toLocaleString()} <span className="text-xs">ر.س</span>
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-600 mb-1">المدفوع</p>
                          <p className="text-sm font-bold text-green-700">
                            {selectedClient.totalPaid.toLocaleString()}
                          </p>
                          <Progress 
                            value={(selectedClient.totalPaid / selectedClient.totalFees) * 100} 
                            className="h-1 mt-1" 
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 mb-1">المتبقي</p>
                          <p className="text-sm font-bold text-red-700">
                            {selectedClient.totalRemaining.toLocaleString()}
                          </p>
                          <Progress 
                            value={(selectedClient.totalRemaining / selectedClient.totalFees) * 100} 
                            className="h-1 mt-1" 
                          />
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded border text-center">
                        <p className="text-[10px] text-gray-600 mb-1">نسبة السداد</p>
                        <p className="text-lg font-bold text-blue-600">
                          {((selectedClient.totalPaid / selectedClient.totalFees) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* القسم الثاني: إحصائيات المعاملات */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '16px' }}>
                    <Briefcase className="h-4 w-4 inline ml-2" />
                    إحصائيات المعاملات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: 'إجمالي المعاملات', value: selectedClient.totalTransactions, Icon: Briefcase, color: '#3b82f6' },
                      { label: 'مكتملة', value: selectedClient.completedTransactions, Icon: CheckCircle, color: '#10b981' },
                      { label: 'نشطة', value: selectedClient.activeTransactions, Icon: Activity, color: '#f59e0b' },
                      { label: 'نسبة الإنجاز', value: `${((selectedClient.completedTransactions / selectedClient.totalTransactions) * 100).toFixed(0)}%`, Icon: Percent, color: '#8b5cf6' },
                      { label: 'أنواع المشاريع', value: selectedClient.projectTypes?.length || 0, Icon: Layers, color: '#ec4899' },
                      { label: 'أنواع المعاملات', value: selectedClient.transactionTypes?.length || 0, Icon: Package, color: '#06b6d4' }
                    ].map((stat, i) => (
                      <Card key={i} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
                        <CardContent className="p-2 text-center">
                          <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                          <p className="text-[10px] text-gray-600">{stat.label}</p>
                          <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* القسم الثالث: تفصيل معايير الدرجة */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '16px' }}>
                    <Award className="h-4 w-4 inline ml-2" />
                    تفصيل معايير حساب الدرجة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* معيار 1: حجم التعامل */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-700">حجم التعامل الإجمالي ({gradingCriteria.totalFeesWeight}%)</span>
                        <span className="text-xs font-bold text-blue-600">
                          {Math.min(100, (selectedClient.totalFees / 500000) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, (selectedClient.totalFees / 500000) * 100)} className="h-2" />
                      <p className="text-[10px] text-gray-500 mt-1">
                        {selectedClient.totalFees.toLocaleString()} ر.س من أصل 500,000 ر.س
                      </p>
                    </div>

                    {/* معيار 2: نوعية المشاريع */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-700">نوعية المشاريع ({gradingCriteria.projectTypesWeight}%)</span>
                        <span className="text-xs font-bold text-green-600">
                          {Math.min(100, ((selectedClient.projectTypes?.length || 0) / 5) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, ((selectedClient.projectTypes?.length || 0) / 5) * 100)} className="h-2" />
                      <p className="text-[10px] text-gray-500 mt-1">
                        {selectedClient.projectTypes?.length || 0} نوع من أصل 5 أنواع
                      </p>
                    </div>

                    {/* معيار 3: تنوع المعاملات */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-700">تنوع أنواع المعاملات ({gradingCriteria.transactionTypesWeight}%)</span>
                        <span className="text-xs font-bold text-purple-600">
                          {Math.min(100, ((selectedClient.transactionTypes?.length || 0) / 8) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, ((selectedClient.transactionTypes?.length || 0) / 8) * 100)} className="h-2" />
                      <p className="text-[10px] text-gray-500 mt-1">
                        {selectedClient.transactionTypes?.length || 0} نوع من أصل 8 أنواع
                      </p>
                    </div>

                    {/* معيار 4: نسبة الإنجاز */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-700">نسبة المعاملات المنجزة ({gradingCriteria.completionRateWeight}%)</span>
                        <span className="text-xs font-bold text-orange-600">
                          {((selectedClient.completedTransactions / selectedClient.totalTransactions) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={(selectedClient.completedTransactions / selectedClient.totalTransactions) * 100} className="h-2" />
                      <p className="text-[10px] text-gray-500 mt-1">
                        {selectedClient.completedTransactions} من أصل {selectedClient.totalTransactions} معاملة
                      </p>
                    </div>

                    {/* معيار 5: التقييم السري */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-700">التقييم السري ({gradingCriteria.secretRatingWeight}%)</span>
                        <span className="text-xs font-bold text-red-600">
                          {selectedClient.secretRating}%
                        </span>
                      </div>
                      <Progress value={selectedClient.secretRating} className="h-2" />
                      <p className="text-[10px] text-gray-500 mt-1">
                        تقييم داخلي سري من 0 إلى 100
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* القسم الرابع: Timeline المعاملات الأخيرة */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontSize: '16px' }}>
                    <Clock className="h-4 w-4 inline ml-2" />
                    آخر المعاملات ({selectedClient.transactions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {selectedClient.transactions.slice(0, 3).map((tr, i) => (
                      <div 
                        key={tr.id} 
                        className="flex gap-3 p-3 border rounded hover:shadow-md transition-all"
                        style={{ background: i === 0 ? '#f8fafc' : '#fff' }}
                      >
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: tr.statusColor }}
                          >
                            <Briefcase className="h-4 w-4 text-white" />
                          </div>
                          {i < 2 && <div className="w-0.5 flex-1 bg-gray-300 mt-2" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {tr.transactionNumber}
                            </code>
                            <Badge style={{ background: `${tr.statusColor}15`, color: tr.statusColor, fontSize: '10px' }}>
                              {tr.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold mb-1">{tr.type} - {tr.category}</p>
                          {tr.projectClassification && (
                            <p className="text-xs text-gray-600 mb-1">
                              <Layers className="h-3 w-3 inline ml-1" />
                              {tr.projectClassification}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-[10px] text-gray-600">
                            <span>📅 {tr.createdDate}</span>
                            <span>💰 {tr.totalFees.toLocaleString()} ر.س</span>
                            <span>📊 {tr.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedClient.transactions.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={() => {
                        setShowProfileDialog(false);
                        setShowTransactionsDialog(true);
                      }}
                    >
                      عرض جميع المعاملات ({selectedClient.transactions.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button 
              onClick={() => setShowProfileDialog(false)} 
              variant="outline"
            >
              إغلاق
            </Button>
            <Button 
              onClick={() => {
                setShowProfileDialog(false);
                setActiveTab('300-02');
              }}
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}
            >
              <Edit className="h-3 w-3 ml-1" />
              تعديل البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================================
  // Render Functions للتابات (مختصرة)
  // ============================================================================

  const renderTabContent = () => {
    if (!selectedClient && activeTab !== '300-01') {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
              يرجى اختيار عميل من القائمة أولاً
            </p>
            <Button 
              onClick={() => setActiveTab('300-01')}
              className="mt-4"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}
            >
              العودة لقائمة العملاء
            </Button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case '300-01':
        return render_300_01_ClientsList();
      case '300-12':
        return render_300_12_ClassificationsSettings();
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Info className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', color: '#6b7280' }}>
                التاب {activeTab} قيد التطوير
              </p>
              <p className="text-sm text-gray-500 mt-2">
                يمكنك استخدام التاب 300-01 (قائمة العملاء) والتاب 300-12 (التصنيفات والإعدادات)
              </p>
            </div>
          </div>
        );
    }
  };

  // ========== 300-01: قائمة العملاء (محسّنة) ==========
  function render_300_01_ClientsList() {
    const filteredClients = clients.filter(c => {
      const matchSearch = !searchTerm || 
        getFullName(c.name).includes(searchTerm) || 
        c.code.includes(searchTerm) ||
        c.contact.mobile.includes(searchTerm);
      const matchType = filterType === 'all' || c.type === filterType;
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      const matchGrade = filterGrade === 'all' || c.grade === filterGrade; // 🆕
      return matchSearch && matchType && matchCategory && matchGrade;
    });

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-01" position="top-right" />
        
        {/* بطاقات الإحصائيات المحسّنة */}
        <div className="grid grid-cols-9 gap-2">
          {[
            { label: 'إجمالي', value: stats.total, Icon: Users, color: '#3b82f6' },
            { label: 'نشط', value: stats.active, Icon: CheckCircle, color: '#10b981' },
            { label: 'درجة أ', value: stats.gradeA, Icon: Medal, color: '#10b981' },
            { label: 'درجة ب', value: stats.gradeB, Icon: Medal, color: '#f59e0b' },
            { label: 'درجة ج', value: stats.gradeC, Icon: Medal, color: '#ef4444' },
            { label: 'المعاملات', value: stats.totalTransactions, Icon: Briefcase, color: '#8b5cf6' },
            { label: 'الأتعاب', value: `${(stats.totalFees / 1000).toFixed(0)}K`, Icon: DollarSign, color: '#ec4899' },
            { label: 'المدفوع', value: `${(stats.totalPaid / 1000).toFixed(0)}K`, Icon: CheckCircle, color: '#22c55e' },
            { label: 'المعروض', value: filteredClients.length, Icon: Filter, color: '#06b6d4' }
          ].map((stat, i) => (
            <Card key={i} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
              <CardContent className="p-2 text-center">
                <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: stat.color }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* شريط البحث والتصفية المحسّن */}
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <InputWithCopy
                  label=""
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 ابحث بالاسم، الكود، أو الجوال..."
                />
              </div>
              <SelectWithCopy
                label=""
                id="filterType"
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: 'all', label: 'جميع الأنواع' },
                  { value: 'فرد', label: 'فرد' },
                  { value: 'شركة', label: 'شركة' },
                  { value: 'جهة حكومية', label: 'جهة حكومية' }
                ]}
              />
              <SelectWithCopy
                label=""
                id="filterCategory"
                value={filterCategory}
                onChange={setFilterCategory}
                options={[
                  { value: 'all', label: 'جميع التصنيفات' },
                  ...clientClassifications.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name }))
                ]}
              />
              <SelectWithCopy
                label=""
                id="filterGrade"
                value={filterGrade}
                onChange={(value) => setFilterGrade(value as 'all' | ClientGrade)}
                options={[
                  { value: 'all', label: 'جميع الدرجات' },
                  { value: 'أ', label: 'درجة أ' },
                  { value: 'ب', label: 'درجة ب' },
                  { value: 'ج', label: 'درجة ج' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* جدول العملاء المحسّن */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '16px' }}>
                <Users className="h-4 w-4 inline ml-2" />
                قائمة العملاء ({filteredClients.length})
              </CardTitle>
              <Button size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                <Plus className="h-3 w-3 ml-1" />
                عميل جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea style={{ height: 'calc(100vh - 480px)' }}>
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs">الكود</TableHead>
                    <TableHead className="text-right text-xs">الاسم</TableHead>
                    <TableHead className="text-right text-xs">النوع</TableHead>
                    <TableHead className="text-right text-xs">التصنيف</TableHead>
                    <TableHead className="text-right text-xs">الدرجة</TableHead>
                    <TableHead className="text-right text-xs">النقاط</TableHead>
                    <TableHead className="text-right text-xs">الجوال</TableHead>
                    <TableHead className="text-right text-xs">المعاملات</TableHead>
                    <TableHead className="text-right text-xs">الأتعاب</TableHead>
                    <TableHead className="text-right text-xs">الحالة</TableHead>
                    <TableHead className="text-right text-xs">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map(client => {
                    const gradeColor = client.grade ? getGradeColor(client.grade) : '#6b7280';
                    return (
                      <TableRow 
                        key={client.id}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowProfileDialog(true); // 🆕 فتح البروفايل عند الضغط
                        }}
                      >
                        <TableCell className="text-right">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{client.code}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="text-xs font-semibold">{getShortName(client.name)}</p>
                            <p className="text-[10px] text-gray-500">{client.nationality}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{ fontSize: '10px' }}>{client.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge style={{ fontSize: '10px', background: clientClassifications.find(c => c.name === client.category)?.color + '20' || '#f3f4f6' }}>
                            {client.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            style={{ 
                              background: gradeColor, 
                              color: '#fff', 
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px'
                            }}
                          >
                            {client.grade || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full" 
                                style={{ 
                                  width: `${client.gradeScore || 0}%`,
                                  background: gradeColor
                                }} 
                              />
                            </div>
                            <span className="text-[10px] text-gray-600">{client.gradeScore || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono">{client.contact.mobile}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-blue-600">{client.totalTransactions}</span>
                            <span className="text-[10px] text-gray-500">
                              ({client.completedTransactions} ✓)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono font-bold text-blue-900">
                          {(client.totalFees / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={client.isActive ? 'default' : 'outline'}
                            style={{ 
                              fontSize: '10px',
                              background: client.isActive ? '#dcfce7' : '#fef2f2',
                              color: client.isActive ? '#166534' : '#991b1b'
                            }}
                          >
                            {client.isActive ? 'نشط' : 'موقوف'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedClient(client);
                                setShowProfileDialog(true);
                              }}
                              title="عرض البروفايل"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedClient(client);
                                setActiveTab('300-02');
                              }}
                              title="تعديل"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== 300-12: التصنيفات والإعدادات (محسّن) 🆕 ==========
  function render_300_12_ClassificationsSettings() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-12" position="top-right" />

        {/* قسم 1: إدارة التصنيفات */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: '16px' }}>
              <Layers className="h-4 w-4 inline ml-2" />
              إدارة تصنيفات العملاء
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600">
                  إدارة التصنيفات المتاحة للعملاء (VIP، مؤسسة، عادي، إلخ)
                </p>
                <Button size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                  <Plus className="h-3 w-3 ml-1" />
                  تصنيف جديد
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {clientClassifications.map(classification => (
                  <Card 
                    key={classification.id}
                    style={{ 
                      background: `${classification.color}08`,
                      border: `2px solid ${classification.color}40`
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ background: classification.color }}
                          />
                          <span className="font-semibold text-sm">{classification.name}</span>
                        </div>
                        <EnhancedSwitch
                          id={`class-${classification.id}`}
                          checked={classification.isActive}
                          onCheckedChange={() => {}}
                          label=""
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{classification.description}</p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قسم 2: نظام الدرجات */}
        <div className="grid grid-cols-2 gap-3">
          {/* حدود الدرجات */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '16px' }}>
                <Award className="h-4 w-4 inline ml-2" />
                حدود الدرجات (Thresholds)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* درجة أ */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#10b981' }}>
                      درجة أ (ممتاز)
                    </span>
                    <Badge style={{ background: '#10b981', color: '#fff', fontSize: '11px' }}>
                      {gradeThresholds.gradeA.min} - {gradeThresholds.gradeA.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputWithCopy
                      label="الحد الأدنى"
                      id="gradeA-min"
                      type="number"
                      value={gradeThresholds.gradeA.min.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeA: { ...gradeThresholds.gradeA, min: parseInt(e.target.value) }
                      })}
                    />
                    <InputWithCopy
                      label="الحد الأقصى"
                      id="gradeA-max"
                      type="number"
                      value={gradeThresholds.gradeA.max.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeA: { ...gradeThresholds.gradeA, max: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <Separator />

                {/* درجة ب */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                      درجة ب (جيد)
                    </span>
                    <Badge style={{ background: '#f59e0b', color: '#fff', fontSize: '11px' }}>
                      {gradeThresholds.gradeB.min} - {gradeThresholds.gradeB.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputWithCopy
                      label="الحد الأدنى"
                      id="gradeB-min"
                      type="number"
                      value={gradeThresholds.gradeB.min.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeB: { ...gradeThresholds.gradeB, min: parseInt(e.target.value) }
                      })}
                    />
                    <InputWithCopy
                      label="الحد الأقصى"
                      id="gradeB-max"
                      type="number"
                      value={gradeThresholds.gradeB.max.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeB: { ...gradeThresholds.gradeB, max: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <Separator />

                {/* درجة ج */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                      درجة ج (عادي)
                    </span>
                    <Badge style={{ background: '#ef4444', color: '#fff', fontSize: '11px' }}>
                      {gradeThresholds.gradeC.min} - {gradeThresholds.gradeC.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputWithCopy
                      label="الحد الأدنى"
                      id="gradeC-min"
                      type="number"
                      value={gradeThresholds.gradeC.min.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeC: { ...gradeThresholds.gradeC, min: parseInt(e.target.value) }
                      })}
                    />
                    <InputWithCopy
                      label="الحد الأقصى"
                      id="gradeC-max"
                      type="number"
                      value={gradeThresholds.gradeC.max.toString()}
                      onChange={(e) => setGradeThresholds({
                        ...gradeThresholds,
                        gradeC: { ...gradeThresholds.gradeC, max: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أوزان المعايير */}
          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: '16px' }}>
                <Sliders className="h-4 w-4 inline ml-2" />
                أوزان معايير التقييم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-900 mb-1 font-semibold">
                    💡 الإجمالي يجب أن يساوي 100%
                  </p>
                  <p className="text-xs text-blue-700">
                    المجموع الحالي: <span className="font-bold">
                      {Object.values(gradingCriteria).reduce((sum, weight) => sum + weight, 0)}%
                    </span>
                  </p>
                </div>

                {/* وزن حجم التعامل */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">حجم التعامل الإجمالي</label>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {gradingCriteria.totalFeesWeight}%
                    </Badge>
                  </div>
                  <InputWithCopy
                    label=""
                    id="weight-fees"
                    type="number"
                    min="0"
                    max="100"
                    value={gradingCriteria.totalFeesWeight.toString()}
                    onChange={(e) => setGradingCriteria({
                      ...gradingCriteria,
                      totalFeesWeight: parseInt(e.target.value) || 0
                    })}
                  />
                  <Progress value={gradingCriteria.totalFeesWeight} className="h-1 mt-1" />
                </div>

                {/* وزن نوعية المشاريع */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">نوعية المشاريع</label>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {gradingCriteria.projectTypesWeight}%
                    </Badge>
                  </div>
                  <InputWithCopy
                    label=""
                    id="weight-projects"
                    type="number"
                    min="0"
                    max="100"
                    value={gradingCriteria.projectTypesWeight.toString()}
                    onChange={(e) => setGradingCriteria({
                      ...gradingCriteria,
                      projectTypesWeight: parseInt(e.target.value) || 0
                    })}
                  />
                  <Progress value={gradingCriteria.projectTypesWeight} className="h-1 mt-1" />
                </div>

                {/* وزن تنوع المعاملات */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">تنوع أنواع المعاملات</label>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {gradingCriteria.transactionTypesWeight}%
                    </Badge>
                  </div>
                  <InputWithCopy
                    label=""
                    id="weight-transactions"
                    type="number"
                    min="0"
                    max="100"
                    value={gradingCriteria.transactionTypesWeight.toString()}
                    onChange={(e) => setGradingCriteria({
                      ...gradingCriteria,
                      transactionTypesWeight: parseInt(e.target.value) || 0
                    })}
                  />
                  <Progress value={gradingCriteria.transactionTypesWeight} className="h-1 mt-1" />
                </div>

                {/* وزن نسبة الإنجاز */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">نسبة المعاملات المنجزة</label>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {gradingCriteria.completionRateWeight}%
                    </Badge>
                  </div>
                  <InputWithCopy
                    label=""
                    id="weight-completion"
                    type="number"
                    min="0"
                    max="100"
                    value={gradingCriteria.completionRateWeight.toString()}
                    onChange={(e) => setGradingCriteria({
                      ...gradingCriteria,
                      completionRateWeight: parseInt(e.target.value) || 0
                    })}
                  />
                  <Progress value={gradingCriteria.completionRateWeight} className="h-1 mt-1" />
                </div>

                {/* وزن التقييم السري */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">التقييم السري</label>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {gradingCriteria.secretRatingWeight}%
                    </Badge>
                  </div>
                  <InputWithCopy
                    label=""
                    id="weight-secret"
                    type="number"
                    min="0"
                    max="100"
                    value={gradingCriteria.secretRatingWeight.toString()}
                    onChange={(e) => setGradingCriteria({
                      ...gradingCriteria,
                      secretRatingWeight: parseInt(e.target.value) || 0
                    })}
                  />
                  <Progress value={gradingCriteria.secretRatingWeight} className="h-1 mt-1" />
                </div>

                <Button 
                  className="w-full mt-3" 
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}
                  onClick={() => {
                    // إعادة حساب جميع الدرجات
                    const updatedClients = clients.map(client => {
                      const { grade, score } = calculateClientGrade(client);
                      return { ...client, grade, gradeScore: score };
                    });
                    setClients(updatedClients);
                  }}
                >
                  <RefreshCw className="h-3 w-3 ml-1" />
                  إعادة حساب جميع الدرجات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قسم 3: معلومات إضافية */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: '16px' }}>
              <Info className="h-4 w-4 inline ml-2" />
              كيفية عمل نظام التقييم الأوتوماتيكي
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {[
                {
                  title: 'حجم التعامل',
                  desc: 'يتم حساب نقاط بناءً على إجمالي الأتعاب (500K = 100%)',
                  Icon: DollarSign,
                  color: '#3b82f6'
                },
                {
                  title: 'نوعية المشاريع',
                  desc: 'تنوع تصنيفات المشاريع (5 أنواع = 100%)',
                  Icon: Layers,
                  color: '#10b981'
                },
                {
                  title: 'تنوع المعاملات',
                  desc: 'تنوع أنواع المعاملات (8 أنواع = 100%)',
                  Icon: Package,
                  color: '#f59e0b'
                },
                {
                  title: 'نسبة الإنجاز',
                  desc: 'نسبة المعاملات المكتملة من الإجمالي',
                  Icon: CheckCircle,
                  color: '#8b5cf6'
                },
                {
                  title: 'التقييم السري',
                  desc: 'تقييم داخلي من 0 إلى 100',
                  Icon: Shield,
                  color: '#ec4899'
                }
              ].map((item, i) => (
                <Card key={i} style={{ background: `${item.color}08`, border: `2px solid ${item.color}40` }}>
                  <CardContent className="p-3">
                    <item.Icon className="h-8 w-8 mx-auto mb-2" style={{ color: item.color }} />
                    <p className="text-xs font-semibold text-center mb-1">{item.title}</p>
                    <p className="text-[10px] text-center text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-900">
                <AlertCircleIcon className="h-4 w-4 inline ml-1" />
                <strong>ملاحظة:</strong> يتم حساب الدرجة تلقائياً بناءً على الأوزان المحددة. يمكنك تعديل الأوزان والحدود حسب احتياجات مكتبك.
                سيتم إعادة حساب جميع درجات العملاء عند الضغط على زر "إعادة حساب جميع الدرجات".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // العرض الرئيسي
  // ============================================================================

  return (
    <div 
      className="flex" 
      style={{ 
        gap: '4px', 
        paddingTop: '16px', 
        fontFamily: 'Tajawal, sans-serif', 
        direction: 'rtl' 
      }}
    >
      <CodeDisplay code="SCR-300-ENHANCED" position="top-left" />
      
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {renderTabContent()}
        
        {/* معلومات العميل المحدد */}
        {selectedClient && activeTab !== '300-01' && (
          <div 
            style={{ 
              position: 'fixed', 
              bottom: '60px', 
              left: '20px', 
              zIndex: 50,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '2px solid #93c5fd',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            <p className="text-xs text-gray-600">العميل المحدد</p>
            <p className="font-bold text-blue-900">{getShortName(selectedClient.name)}</p>
            <p className="text-[10px] text-gray-500">{selectedClient.code}</p>
            {selectedClient.grade && (
              <Badge 
                className="mt-1"
                style={{ 
                  background: getGradeColor(selectedClient.grade), 
                  color: '#fff', 
                  fontSize: '10px' 
                }}
              >
                {selectedClient.grade} - {selectedClient.gradeScore}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* نافذة البروفايل */}
      {renderClientProfileDialog()}
    </div>
  );
};

export default ClientManagement_300_ENHANCED;
