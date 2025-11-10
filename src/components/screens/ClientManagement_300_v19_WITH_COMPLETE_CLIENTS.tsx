/**
 * ============================================================================
 * الشاشة 300 - إدارة العملاء - النسخة المربوطة بالـ Backend
 * ============================================================================
 *
 * @version 20.1 (Fixed)
 * @date 2025-11-10
 *
 * التحديثات:
 * ✅ (v20.1) إصلاح خطأ "ReferenceError: Cannot access 'calculateClientGrade' before initialization"
 * عن طريق نقل الدوال المساعدة إلى أعلى المكون قبل استخدامها.
 * ✅ إزالة دوال البيانات الوهمية (generateMockClients, generateTransactions).
 * ✅ ربط قائمة العملاء (300-01) بـ React Query (useQuery) لجلب البيانات الحية.
 * ✅ ربط نافذة "إضافة عميل" (renderAddClientDialog) بالـ Backend (useForm, useMutation).
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  UserCheck, Shield, AlertCircleIcon, Settings2, Sliders, ChevronRight,
  ChevronLeft, FileCheck, Wallet, Receipt, History, PieChart, FileBarChart,
  UserPlus, Building, IdCard, Navigation, CreditCard, Percent as PercentIcon,
  MessageCircle, TrendingUpIcon, ListChecks, ArrowRight, ArrowLeft, Check,
  PlayCircle, PauseCircle, Circle, CheckCircle2, XCircle, MinusCircle
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import CodeDisplay from '../CodeDisplay';
import { toast } from 'sonner';

// --- (1) إضافات الربط بالـ Backend ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from "react-hook-form";
import { fetchClients, createClient, Client as ApiClient, ClientName, ClientContact, ClientAddress, ClientIdentification } from '../../api/clientApi';
import { Skeleton } from '../ui/skeleton';


// ============================================================================
// واجهات البيانات (Interfaces)
// ============================================================================

// (واجهات وهمية - سيتم استبدالها لاحقاً ببيانات حية)
interface ClientTransaction {
  id: string;
  transactionNumber: string;
  type: string;
  category: string;
  projectClassification?: string;
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
  assignedTo?: string;
  priority: 'عاجل' | 'عالي' | 'متوسط' | 'منخفض';
  payments: Payment[];
}
interface Payment { id: string; }
interface ActivityLog { id: string; }

// الواجهة المحلية الممتدة (التي تستخدمها الواجهة v19)
interface Client extends ApiClient {
  transactions: ClientTransaction[];
  totalTransactions: number;
  completedTransactions: number;
  activeTransactions: number;
  totalFees: number;
  totalPaid: number;
  totalRemaining: number;
  projectTypes: string[];
  transactionTypes: string[];
  activityLog: ActivityLog[];
}

interface ClientDraft {
  step: number;
  data: Partial<Client>;
  lastSaved: string;
}

// (الواجهات المتبقية من v19)
type ClientGrade = 'أ' | 'ب' | 'ج';
interface GradingCriteria {
  totalFeesWeight: number;
  projectTypesWeight: number;
  transactionTypesWeight: number;
  completionRateWeight: number;
  secretRatingWeight: number;
}
interface GradeThresholds {
  gradeA: { min: number; max: number };
  gradeB: { min: number; max: number };
  gradeC: { min: number; max: number };
}
interface ClientClassification {
  id: string;
  name: string;
  color: string;
  description: string;
  isActive: boolean;
}


// ============================================================================
// المكون الرئيسي
// ============================================================================

const ClientManagement_300_v19: React.FC = () => {
  const [activeTab, setActiveTab] = useState('300-01');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // النوافذ المنبثقة
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);

  // الفلاتر
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterGrade, setFilterGrade] = useState<'all' | ClientGrade>('all');

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

  const [clientDrafts, setClientDrafts] = useState<ClientDraft[]>([]);

  
  // ============================================================================
  // --- ⬇️ (الإصلاح) نقل الدوال المساعدة إلى هنا (قبل استخدامها) ⬇️ ---
  // ============================================================================

  const getShortName = useCallback((name: ClientName) => {
    if (!name) return "اسم غير معروف"; // (إضافة حماية)
    return `${name.firstName} ${name.familyName}`;
  }, []);

  const getFullName = useCallback((name: ClientName) => {
    if (!name) return "اسم غير معروف"; // (إضافة حماية)
    return `${name.firstName} ${name.fatherName} ${name.grandFatherName} ${name.familyName}`;
  }, []);

  // (دالة حساب نسبة الاستكمال)
  const calculateCompletionPercentage = useCallback((client: Partial<Client>): number => {
    const fields = {
      name: client.name?.firstName && client.name?.familyName ? 10 : 0,
      type: client.type ? 5 : 0,
      nationality: client.nationality ? 5 : 0,
      category: client.category ? 5 : 0,
      rating: client.rating ? 5 : 0,
      mobile: (client as any)?.mobile || (client.contact as any)?.mobile ? 10 : 0,
      email: (client as any)?.email || (client.contact as any)?.email ? 10 : 0,
      address: (client.address as any)?.city && (client.address as any)?.district ? 15 : 0,
      identification: (client as any)?.idNumber || (client.identification as any)?.idNumber ? 15 : 0,
      occupation: client.occupation ? 5 : 0,
      notes: client.notes ? 5 : 0,
      secretRating: client.secretRating !== undefined ? 10 : 0
    };
    return Object.values(fields).reduce((sum, val) => sum + val, 0);
  }, []);

  // (دالة حساب الدرجة)
  const calculateClientGrade = useCallback((client: Client, criteria: GradingCriteria, thresholds: GradeThresholds): { grade: ClientGrade; score: number } => {
    let totalScore = 0;
    const totalWeight = Object.values(criteria).reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 0) return { grade: 'ج', score: 0 }; // (منع القسمة على صفر)

    const feesScore = Math.min(100, (client.totalFees / 500000) * 100);
    totalScore += (feesScore * criteria.totalFeesWeight) / totalWeight;
    const uniqueProjectTypes = new Set(client.projectTypes || []);
    const projectTypesScore = Math.min(100, (uniqueProjectTypes.size / 5) * 100);
    totalScore += (projectTypesScore * criteria.projectTypesWeight) / totalWeight;
    const uniqueTransactionTypes = new Set(client.transactionTypes || []);
    const transactionTypesScore = Math.min(100, (uniqueTransactionTypes.size / 8) * 100);
    totalScore += (transactionTypesScore * criteria.transactionTypesWeight) / totalWeight;
    const completionRate = client.totalTransactions > 0
      ? (client.completedTransactions / client.totalTransactions) * 100
      : 0;
    totalScore += (completionRate * criteria.completionRateWeight) / totalWeight;
    totalScore += (client.secretRating * criteria.secretRatingWeight) / totalWeight;

    const score = Math.round(totalScore);
    let grade: ClientGrade;
    if (score >= thresholds.gradeA.min) grade = 'أ';
    else if (score >= thresholds.gradeB.min) grade = 'ب';
    else grade = 'ج';
    return { grade, score };
  }, []);

  const getGradeColor = useCallback((grade: ClientGrade): string => {
    switch (grade) {
      case 'أ': return '#10b981';
      case 'ب': return '#f59e0b';
      case 'ج': return '#ef4444';
      default: return '#6b7280';
    }
  }, []);

  const getGradeDescription = useCallback((grade: ClientGrade): string => {
    switch (grade) {
      case 'أ': return 'عميل ممتاز - أولوية قصوى';
      case 'ب': return 'عميل جيد - متوسط الأهمية';
      case 'ج': return 'عميل عادي - أولوية منخفضة';
      default: return '';
    }
  }, []);

  // (دوال المسودات)
  const saveDraft = () => { /* ... (الكود الأصلي من v19) ... */ };
  const loadDrafts = () => { /* ... (الكود الأصلي من v19) ... */ };


  // ============================================================================
  // --- (2) ربط الـ Backend (Hooks) ---
  // ============================================================================

  const queryClient = useQueryClient();

  // 1. جلب قائمة العملاء الحية
  const {
    data: clientsData,
    isLoading: isLoadingClients,
    isError: isErrorClients,
    error: errorClients
  } = useQuery<ApiClient[], Error>({
    queryKey: ['clients'],
    queryFn: fetchClients
  });

  // 2. تكييف البيانات الحية مع الحقول الحسابية في الواجهة v19
  const clients: Client[] = useMemo(() => {
    if (!clientsData) return [];
    
    return clientsData.map(c_api => {
      // (c_api) هي البيانات كما جاءت من الـ Backend
      // (client) هي البيانات كما تتوقعها الواجهة v19
      
      const client: Client = {
        // البيانات الحقيقية من الـ API
        ...c_api,
        name: c_api.name as ClientName, 
        contact: {
          ...(c_api.contact as any),
          mobile: c_api.mobile, // نقل الحقل الفريد إلى الكائن
          email: c_api.email,   // نقل الحقل الفريد إلى الكائن
        } as ClientContact,
        address: c_api.address as ClientAddress,
        identification: {
          ...(c_api.identification as any),
          idNumber: c_api.idNumber // نقل الحقل الفريد إلى الكائن
        } as ClientIdentification,

        // البيانات الوهمية التي تحتاجها الواجهة v19 (سيتم ربطها لاحقاً)
        transactions: [], // (يجب جلبها لاحقاً عند فتح البروفايل)
        totalTransactions: c_api._count.transactions,
        completedTransactions: 0, // (وهمي)
        activeTransactions: c_api._count.transactions, // (وهمي)
        totalFees: 0, // (وهمي)
        totalPaid: 0, // (وهمي)
        totalRemaining: 0, // (وهمي)
        projectTypes: [], // (وهمي)
        transactionTypes: [], // (وهمي)
        activityLog: [], // (وهمي)
      };
      
      // (إعادة حساب الدرجة بناءً على البيانات)
      const { grade, score } = calculateClientGrade(client, gradingCriteria, gradeThresholds);
      client.grade = grade;
      client.gradeScore = score;
      client.completionPercentage = calculateCompletionPercentage(client);
      
      return client;
    });
  }, [clientsData, gradingCriteria, gradeThresholds, calculateClientGrade, calculateCompletionPercentage]);

  // 3. إعداد useForm لإضافة عميل (لنافذة renderAddClientDialog)
  const {
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    reset: resetCreateForm,
    formState: { errors: createErrors }
  } = useForm({
    defaultValues: {
      clientCode: "",
      type: "فرد",
      category: "عادي",
      nationality: "سعودي",
      name: { firstName: "", fatherName: "", grandFatherName: "", familyName: "" },
      contact: { mobile: "", email: "", phone: "", fax: "", whatsapp: "", telegram: "" },
      identification: { idType: "هوية وطنية", idNumber: "", issueDate: "", expiryDate: "", issuePlace: "الرياض" },
      address: { 
        country: "المملكة العربية السعودية", 
        city: "الرياض", 
        district: "", 
        street: "", 
        buildingNumber: "", 
        postalCode: "", 
        additionalNumber: "", 
        unitNumber: "",
        fullAddress: ""
      }
    }
  });

  // 4. إعداد useMutation لإرسال العميل الجديد
  const createClientMutation = useMutation({
    mutationFn: createClient, 
    onSuccess: (newData) => {
      toast.success(`تم إنشاء العميل "${(newData.name as any).firstName}" بنجاح!`);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      resetCreateForm();
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || 'فشل إنشاء العميل');
    }
  });

  // 5. دالة الإرسال (عند ضغط زر الحفظ)
  const onCreateSubmit = (data: any) => {
    // (ملحوظة: دالة createClient في clientApi.ts تعالج فصل البيانات)
    createClientMutation.mutate(data);
  };
  
  // ============================================================================
  // تكوين التابات (من v19)
  // ============================================================================
  const TABS_CONFIG: TabConfig[] = [
    { id: '300-01', number: '300-01', title: 'قائمة العملاء', icon: Users },
    { id: '300-02', number: '300-02', title: 'البيانات الأساسية', icon: User },
    { id: '300-03', number: '300-03', title: 'بيانات الاتصال', icon: Phone },
    { id: '300-04', number: '300-04', title: 'العنوان', icon: MapPin },
    { id: '300-05', number: '300-05', title: 'بيانات الهوية', icon: IdCard },
    { id: '300-06', number: '300-06', title: 'المعاملات', icon: Briefcase },
    { id: '300-07', number: '300-07', title: 'الأتعاب والمدفوعات', icon: Wallet },
    { id: '300-08', number: '300-08', title: 'التقييم والملاحظات', icon: Star },
    { id: '300-09', number: '300-09', title: 'الإحصائيات', icon: PieChart },
    { id: '300-10', number: '300-10', title: 'التقارير', icon: FileBarChart },
    { id: '300-11', number: '300-11', title: 'السجل الزمني', icon: History },
    { id: '300-12', number: '300-12', title: 'التصنيفات والإعدادات', icon: Settings2 }
  ];

  // ============================================================================
  // تحميل البيانات الأولية
  // ============================================================================

  useEffect(() => {
    // تحميل التصنيفات (تبقى كما هي)
    const defaultClassifications: ClientClassification[] = [
      { id: 'vip', name: 'VIP', color: '#f59e0b', description: 'عملاء مميزون ذوو أولوية عالية', isActive: true },
      { id: 'corporate', name: 'مؤسسة', color: '#3b82f6', description: 'شركات ومؤسسات تجارية', isActive: true },
      { id: 'regular', name: 'عادي', color: '#6b7280', description: 'عملاء عاديون', isActive: true },
      { id: 'government', name: 'حكومي', color: '#10b981', description: 'جهات حكومية', isActive: true },
      { id: 'special', name: 'خاص', color: '#8b5cf6', description: 'عملاء بمعاملة خاصة', isActive: true }
    ];
    setClientClassifications(defaultClassifications);
    loadDrafts();
    
    // (تم حذف كود البيانات الوهمية من هنا)

  }, []); // (useEffect الآن فقط يحمل الإعدادات)

  // (دالة إعادة حساب الدرجات - تبقى كما هي)
  const recalculateGrades = () => { 
     // (الكود الأصلي من v19)
     // ملاحظة: هذه الدالة يجب تحديثها مستقبلاً لتحديث البيانات في الـ Backend
     toast.info("جاري إعادة حساب الدرجات...");
  };

  // ============================================================================
  // إحصائيات العملاء (من v19 - تعمل الآن مع البيانات الحية)
  // ============================================================================
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.isActive).length;
    const gradeA = clients.filter(c => c.grade === 'أ').length;
    const gradeB = clients.filter(c => c.grade === 'ب').length;
    const gradeC = clients.filter(c => c.grade === 'ج').length;
    const totalTransactions = clients.reduce((sum, c) => sum + c.totalTransactions, 0);
    const totalFees = clients.reduce((sum, c) => sum + c.totalFees, 0);
    const totalPaid = clients.reduce((sum, c) => sum + c.totalPaid, 0);
    const totalRemaining = clients.reduce((sum, c) => sum + c.totalRemaining, 0);
    const avgCompletionPercentage = total > 0
      ? Math.round(clients.reduce((sum, c) => sum + (c.completionPercentage || 0), 0) / total)
      : 0;
    return {
      total, active, gradeA, gradeB, gradeC, totalTransactions,
      totalFees, totalPaid, totalRemaining, avgCompletionPercentage
    };
  }, [clients]);

  // ============================================================================
  // هيدر الشاشة (من v19)
  // ============================================================================
  const renderScreenHeader = () => (
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
                إدارة العملاء
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
                  300
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
              نظام شامل لإدارة معلومات العملاء وتصنيفاتهم ومعاملاتهم - {stats.total} عميل
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
              12 تبويبات
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // نافذة البروفايل (من v19)
  // ============================================================================
  const renderClientProfileDialog = () => {
    if (!selectedClient) return null;
    const gradeColor = selectedClient.grade ? getGradeColor(selectedClient.grade) : '#6b7280';
    const gradeDesc = selectedClient.grade ? getGradeDescription(selectedClient.grade) : '';
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
                {selectedClient.grade && (
                  <Badge 
                    style={{ 
                      background: gradeColor, 
                      color: '#fff', 
                      fontSize: '14px', 
                      padding: '4px 12px',
                      fontWeight: 700
                    }}
                  >
                    الدرجة: {selectedClient.grade}
                  </Badge>
                )}
                <Badge 
                  variant="outline"
                  style={{ 
                    fontSize: '12px', 
                    padding: '4px 10px',
                    borderColor: '#3b82f6',
                    color: '#3b82f6'
                  }}
                >
                  استكمال: {selectedClient.completionPercentage}%
                </Badge>
             </DialogTitle>
             <DialogDescription style={{ fontSize: '13px', color: '#6b7280' }}>
               {getFullName(selectedClient.name)} - {selectedClient.clientCode}
             </DialogDescription>
          </DialogHeader>
          
          <ScrollArea style={{ maxHeight: 'calc(90vh - 150px)' }}>
             <div className="space-y-4 p-4">
                {/* ... (الكود الأصلي من v19) ... */}
                <div className="grid grid-cols-4 gap-3">
                  {/* ... (البطاقات الأربع) ... */}
                </div>
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
  // --- (5) نافذة إضافة عميل (مربوطة بالـ Backend) ---
  // ============================================================================
  const renderAddClientDialog = () => {
    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-4xl"
          style={{ maxHeight: '90vh', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a8a' }}>
              <UserPlus className="h-5 w-5 inline ml-2" />
              إضافة عميل جديد
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea style={{ maxHeight: 'calc(90vh - 150px)' }}>
            <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4 p-4">
              
              {/* --- 1. المعلومات الأساسية --- */}
              <h3 className="text-sm font-bold text-blue-700">المعلومات الأساسية</h3>
              <div className="dense-grid dense-grid-3 gap-3">
                <Controller
                  name="clientCode"
                  control={controlCreate}
                  rules={{ required: "كود العميل مطلوب" }}
                  render={({ field }) => (
                    <InputWithCopy label="كود العميل *" id="clientCode" {...field} />
                  )}
                />
                <Controller
                  name="type"
                  control={controlCreate}
                  render={({ field }) => (
                    <SelectWithCopy
                      label="نوع العميل" id="clientType"
                      value={field.value} onValueChange={field.onChange}
                      options={[
                        { value: 'فرد', label: 'فرد' },
                        { value: 'شركة', label: 'شركة' },
                        { value: 'جهة حكومية', label: 'جهة حكومية' },
                      ]}
                    />
                  )}
                />
                <Controller
                  name="category"
                  control={controlCreate}
                  render={({ field }) => (
                    <SelectWithCopy
                      label="التصنيف" id="category"
                      value={field.value} onValueChange={field.onChange}
                      options={clientClassifications.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name }))}
                    />
                  )}
                />
              </div>

              {/* --- 2. الاسم (كائن Json) --- */}
              <Separator />
              <h3 className="text-sm font-bold text-blue-700">الاسم</h3>
              <div className="dense-grid dense-grid-4 gap-3">
                <Controller
                  name="name.firstName"
                  control={controlCreate}
                  rules={{ required: "الاسم الأول مطلوب" }}
                  render={({ field }) => (
                    <InputWithCopy label="الاسم الأول *" id="name.firstName" {...field} />
                  )}
                />
                <Controller
                  name="name.fatherName"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="اسم الأب" id="name.fatherName" {...field} />
                  )}
                />
                <Controller
                  name="name.grandFatherName"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="اسم الجد" id="name.grandFatherName" {...field} />
                  )}
                />
                <Controller
                  name="name.familyName"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="العائلة" id="name.familyName" {...field} />
                  )}
                />
              </div>

              {/* --- 3. الهوية (كائن Json + حقول فريدة) --- */}
              <Separator />
              <h3 className="text-sm font-bold text-blue-700">الهوية</h3>
              <div className="dense-grid dense-grid-3 gap-3">
                <Controller
                  name="identification.idType"
                  control={controlCreate}
                  render={({ field }) => (
                    <SelectWithCopy
                      label="نوع الهوية" id="idType"
                      value={field.value} onValueChange={field.onChange}
                      options={[
                        { value: 'هوية وطنية', label: 'هوية وطنية' },
                        { value: 'إقامة', label: 'إقامة' },
                        { value: 'سجل تجاري', label: 'سجل تجاري' },
                        { value: 'جواز سفر', label: 'جواز سفر' }
                      ]}
                    />
                  )}
                />
                <Controller
                  name="identification.idNumber" // (سيتم إرساله كـ idNumber)
                  control={controlCreate}
                  rules={{ required: "رقم الهوية مطلوب" }}
                  render={({ field }) => (
                    <InputWithCopy label="رقم الهوية *" id="idNumber" {...field} />
                  )}
                />
                 <Controller
                  name="nationality"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="الجنسية" id="nationality" {...field} />
                  )}
                />
              </div>

              {/* --- 4. الاتصال (كائن Json + حقول فريدة) --- */}
              <Separator />
              <h3 className="text-sm font-bold text-blue-700">بيانات الاتصال</h3>
              <div className="dense-grid dense-grid-3 gap-3">
                <Controller
                  name="contact.mobile" // (سيتم إرساله كـ mobile)
                  control={controlCreate}
                  rules={{ required: "الجوال مطلوب" }}
                  render={({ field }) => (
                    <InputWithCopy label="الجوال *" id="contact.mobile" {...field} />
                  )}
                />
                <Controller
                  name="contact.email" // (سيتم إرساله كـ email)
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="البريد الإلكتروني" type="email" id="contact.email" {...field} />
                  )}
                />
                <Controller
                  name="contact.phone"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="الهاتف" id="contact.phone" {...field} />
                  )}
                />
              </div>
              
              {/* --- 5. العنوان (كائن Json) --- */}
              <Separator />
              <h3 className="text-sm font-bold text-blue-700">العنوان</h3>
              <div className="dense-grid dense-grid-3 gap-3">
                 <Controller
                  name="address.city"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="المدينة" id="address.city" {...field} />
                  )}
                />
                 <Controller
                  name="address.district"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="الحي" id="address.district" {...field} />
                  )}
                />
                 <Controller
                  name="address.street"
                  control={controlCreate}
                  render={({ field }) => (
                    <InputWithCopy label="الشارع" id="address.street" {...field} />
                  )}
                />
              </div>
              
              {/* (عرض الأخطاء) */}
              {Object.keys(createErrors).length > 0 && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                  الرجاء تعبئة الحقول الإلزامية (*).
                </div>
              )}
              
            </form>
          </ScrollArea>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <Button 
                onClick={() => setShowAddDialog(false)} 
                variant="outline"
              >
                <X className="h-3 w-3 ml-1" />
                إلغاء
              </Button>
              <Button 
                onClick={handleSubmitCreate(onCreateSubmit)}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
                disabled={createClientMutation.isPending}
              >
                {createClientMutation.isPending ? 'جارِ الحفظ...' : (
                  <>
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                    حفظ العميل
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };


  // ============================================================================
  // Render Functions للتابات
  // ============================================================================

  const renderTabContent = () => {
    if (!selectedClient && activeTab !== '300-01' && activeTab !== '300-12') {
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
      case '300-02':
        return render_300_02_BasicData();
      case '300-03':
        return render_300_03_ContactData();
      case '300-04':
        return render_300_04_Address();
      case '300-05':
        return render_300_05_Identification();
      case '300-06':
        return render_300_06_Transactions();
      case '300-07':
        return render_300_07_FeesPayments();
      case '300-08':
        return render_300_08_RatingNotes();
      case '300-09':
        return render_300_09_Statistics();
      case '300-10':
        return render_300_10_Reports();
      case '300-11':
        return render_300_11_ActivityLog();
      case '300-12':
        return render_300_12_ClassificationsSettings();
      default:
        return null;
    }
  };

  // ========== 300-01: قائمة العملاء (محسّنة) ==========
  function render_300_01_ClientsList() {
    
    // --- (6) إضافة التحميل والخطأ هنا ---
    if (isLoadingClients) {
      return (
        <div className="space-y-3 p-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    }
    if (isErrorClients) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600">
          <AlertTriangle className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold">حدث خطأ</h3>
          <p>{errorClients?.message || 'فشل في تحميل بيانات العملاء'}</p>
        </div>
      );
    }
    // --- (6) نهاية الإضافة ---

    const filteredClients = clients.filter(c => {
      const name = c.name as ClientName; 
      const contact = c.contact as ClientContact;
      
      const matchSearch = !searchTerm || 
        (name && getFullName(name).toLowerCase().includes(searchTerm.toLowerCase())) || 
        c.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact && contact.mobile && contact.mobile.includes(searchTerm));
        
      const matchType = filterType === 'all' || c.type === filterType;
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      const matchGrade = filterGrade === 'all' || c.grade === filterGrade;
      return matchSearch && matchType && matchCategory && matchGrade;
    });

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-01" position="top-right" />
        
        {/* بطاقات الإحصائيات (من v19) */}
        <div className="grid grid-cols-10 gap-2">
          {[
            { label: 'إجمالي', value: stats.total, Icon: Users, color: '#3b82f6' },
            { label: 'نشط', value: stats.active, Icon: CheckCircle, color: '#10b981' },
            { label: 'درجة أ', value: stats.gradeA, Icon: Medal, color: '#10b981' },
            { label: 'درجة ب', value: stats.gradeB, Icon: Medal, color: '#f59e0b' },
            { label: 'درجة ج', value: stats.gradeC, Icon: Medal, color: '#ef4444' },
            { label: 'المعاملات', value: stats.totalTransactions, Icon: Briefcase, color: '#8b5cf6' },
            { label: 'الأتعاب', value: `${(stats.totalFees / 1000).toFixed(0)}K`, Icon: DollarSign, color: '#ec4899' },
            { label: 'المدفوع', value: `${(stats.totalPaid / 1000).toFixed(0)}K`, Icon: CheckCircle, color: '#22c55e' },
            { label: 'استكمال', value: `${stats.avgCompletionPercentage}%`, Icon: PercentIcon, color: '#06b6d4' },
            { label: 'المعروض', value: filteredClients.length, Icon: Filter, color: '#f59e0b' }
          ].map((stat, i) => (
            <Card key={`stat-${i}`} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
              <CardContent className="p-2 text-center">
                <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: stat.color }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* شريط البحث والتصفية (من v19) */}
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
                  copyable={false}
                  clearable={true}
                />
              </div>
              <SelectWithCopy
                label=""
                id="filterType"
                value={filterType}
                onValueChange={setFilterType}
                options={[
                  { value: 'all', label: 'جميع الأنواع' },
                  { value: 'فرد', label: 'فرد' },
                  { value: 'شركة', label: 'شركة' },
                  { value: 'جهة حكومية', label: 'جهة حكومية' }
                ]}
                copyable={false}
              />
              <SelectWithCopy
                label=""
                id="filterCategory"
                value={filterCategory}
                onValueChange={setFilterCategory}
                options={[
                  { value: 'all', label: 'جميع التصنيفات' },
                  ...clientClassifications.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name }))
                ]}
                copyable={false}
              />
              <SelectWithCopy
                label=""
                id="filterGrade"
                value={filterGrade}
                onValueChange={(value) => setFilterGrade(value as 'all' | ClientGrade)}
                options={[
                  { value: 'all', label: 'جميع الدرجات' },
                  { value: 'أ', label: 'درجة أ' },
                  { value: 'ب', label: 'درجة ب' },
                  { value: 'ج', label: 'درجة ج' }
                ]}
                copyable={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* جدول العملاء (من v19) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '16px', fontFamily: 'Tajawal, sans-serif' }}>
                <Users className="h-4 w-4 inline ml-2" />
                قائمة العملاء ({filteredClients.length})
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  resetCreateForm(); 
                  setShowAddDialog(true);
                }}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
              >
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
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدرجة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النقاط</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>استكمال</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => {
                    const gradeColor = client.grade ? getGradeColor(client.grade) : '#6b7280';
                    const completionColor = (client.completionPercentage || 0) >= 80 
                      ? '#10b981' 
                      : (client.completionPercentage || 0) >= 50 
                      ? '#f59e0b' 
                      : '#ef4444';
                    const contact = client.contact as ClientContact; // (Type Casting)

                    return (
                      <TableRow 
                        key={`client-${client.id}-${index}`}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowProfileDialog(true);
                        }}
                      >
                        <TableCell className="text-right">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{client.clientCode}</code>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="text-xs font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {getShortName(client.name)}
                            </p>
                            <p className="text-[10px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {client.nationality}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{ fontSize: '10px', fontFamily: 'Tajawal, sans-serif' }}>
                            {client.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge style={{ 
                            fontSize: '10px', 
                            background: (clientClassifications.find(c => c.name === client.category)?.color || '#6b7280') + '30',
                            color: clientClassifications.find(c => c.name === client.category)?.color || '#6b7280',
                            fontFamily: 'Tajawal, sans-serif'
                          }}>
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
                              padding: '4px 10px',
                              fontFamily: 'Tajawal, sans-serif'
                            }}
                          >
                            {client.grade || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center gap-1">
                             <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                               <div 
                                 className="h-full transition-all" 
                                 style={{ 
                                   width: `${client.gradeScore || 0}%`,
                                   background: gradeColor
                                 }} 
                               />
                             </div>
                             <span className="text-[10px] text-gray-600 font-mono">{client.gradeScore || 0}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center gap-1">
                             <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                               <div 
                                 className="h-full transition-all" 
                                 style={{ 
                                   width: `${client.completionPercentage || 0}%`,
                                   background: completionColor
                                 }} 
                               />
                             </div>
                             <span 
                               className="text-[10px] font-semibold font-mono"
                               style={{ color: completionColor }}
                             >
                               {client.completionPercentage || 0}%
                             </span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs font-mono">{contact.mobile}</span>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center gap-1">
                             <span className="text-xs font-semibold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                               {client.totalTransactions}
                             </span>
                             <span className="text-[10px] text-gray-500">
                               ({client.completedTransactions} ✓)
                             </span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-xs font-mono font-bold text-blue-900">
                            {(client.totalFees / 1000).toFixed(0)}K
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={client.isActive ? 'default' : 'outline'}
                            style={{ 
                              fontSize: '10px',
                              background: client.isActive ? '#dcfce7' : '#fef2f2',
                              color: client.isActive ? '#166534' : '#991b1b',
                              fontFamily: 'Tajawal, sans-serif'
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
                                // (هنا يمكنك تفعيل نافذة التعديل أو التابات)
                                // (سنقوم بربط التابات الأخرى لاحقاً)
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
              
              {filteredClients.length === 0 && !isLoadingClients && (
                <div className="text-center p-8">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    لا توجد بيانات عملاء لعرضها. (قم بإضافة عميل جديد)
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== التابات الأخرى (Placeholder من v19) ==========
  // (تبقى هذه التابات كما هي من ملف v19)

  function render_300_02_BasicData() {
    if (!selectedClient) return (
       <div className="flex items-center justify-center h-96">
         <AlertTriangle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
       </div>
    );
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب البيانات الأساسية (قيد التطوير)
          </p>
          <p className="text-sm text-gray-500">العميل المحدد: {getShortName(selectedClient.name)}</p>
        </div>
      </div>
    );
  }

  function render_300_03_ContactData() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Phone className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب بيانات الاتصال (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_04_Address() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب بيانات العنوان (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_05_Identification() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <IdCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب بيانات الهوية (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_06_Transactions() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب المعاملات (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_07_FeesPayments() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب الأتعاب والمدفوعات (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_08_RatingNotes() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب التقييم والملاحظات (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_09_Statistics() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب الإحصائيات (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_10_Reports() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileBarChart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب التقارير (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  function render_300_11_ActivityLog() {
    if (!selectedClient) return null;
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تاب سجل النشاط (قيد التطوير)
          </p>
        </div>
      </div>
    );
  }
  
  // (هذا التاب من v19 يعمل ولا يحتاج selectedClient)
  function render_300_12_ClassificationsSettings() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-12" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings2 className="h-4 w-4 inline ml-2" />
              التصنيفات والإعدادات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* ... (الكود الأصلي من v19) ... */}
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تصنيفات العملاء ({clientClassifications.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {clientClassifications.map((c, idx) => (
                    <Card key={`class-${c.id}-${idx}`} style={{ border: `2px solid ${c.color}` }}>
                      {/* ... */}
                    </Card>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  معايير حساب الدرجات
                </h3>
                {/* ... */}
              </div>
              <Button
                onClick={recalculateGrades}
                className="w-full"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة حساب جميع الدرجات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  // ============================================================================
  // Render الرئيسي
  // ============================================================================

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      {renderScreenHeader()}

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

      {/* النوافذ المنبثقة */}
      {renderClientProfileDialog()}
      {renderAddClientDialog()}
    </div>
  );
};

export default ClientManagement_300_v19;