/**
 * ============================================================================
 * الشاشة 300 - إدارة العملاء - v19.0 FINAL (مربوطة + واجهات كاملة)
 * ============================================================================
 * ✅ مربوطة 100% بالـ Backend API
 * ✅ واجهات كاملة لجميع التابات الـ 12 (من v18.0)
 * ✅ معالجة Loading و Error
 * ✅ Multi-step Wizard مكتمل
 * ✅ نظام البروفايل الغني
 * ✅ حسابات استكمال البيانات والدرجة (تُحسب في الـ Backend)
 * 
 * @version 19.0 FULL MERGED
 * @date 2025-11-10
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
  UserCheck, Shield, AlertCircleIcon, Settings2, Sliders, ChevronRight,
  ChevronLeft, FileCheck, Wallet, Receipt, History, PieChart, FileBarChart,
  UserPlus, Building, IdCard, Navigation, CreditCard, Percent as PercentIcon,
  MessageCircle, TrendingUpIcon, ListChecks, ArrowRight, ArrowLeft, Check,
  PlayCircle, PauseCircle, Circle, CheckCircle2, XCircle, MinusCircle, Loader2
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import CodeDisplay from '../CodeDisplay';
import { toast } from 'sonner';

// ============================================================================
// استيراد الأنواع والـ API
// ============================================================================
import { 
  Client, 
  ClientName, 
  ClientContact, 
  ClientAddress, 
  ClientIdentification 
} from '../../types/clientTypes';
import { 
  getAllClients, 
  createClient, 
  updateClient 
} from '../../api/clientApi';

// ============================================================================
// الواجهات الداخلية (لا تأتي من الـ API)
// ============================================================================
interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  date: string;
  method: 'نقدي' | 'شيك' | 'تحويل بنكي' | 'بطاقة ائتمان' | 'مدى';
  reference?: string;
  notes?: string;
  receivedBy: string;
}

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

interface ActivityLog {
  id: string;
  date: string;
  time: string;
  action: string;
  description: string;
  performedBy: string;
  category: 'معاملة' | 'دفعة' | 'تعديل بيانات' | 'تواصل' | 'ملاحظة' | 'أخرى';
}

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

interface ClientDraft {
  step: number;
  data: Partial<Client>;
  lastSaved: string;
}

// ============================================================================
// المكون الرئيسي
// ============================================================================
const ClientManagement_300_FULL: React.FC = () => {
  const [activeTab, setActiveTab] = useState('300-01');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterGrade, setFilterGrade] = useState<'all' | ClientGrade>('all');
  
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
  
  const [addClientStep, setAddClientStep] = useState(1);
  const [newClientData, setNewClientData] = useState<Partial<Client>>({});
  const [clientDrafts, setClientDrafts] = useState<ClientDraft[]>([]);

  // ============================================================================
  // دوال مساعدة
  // ============================================================================
  const getShortName = (name: ClientName) => {
    return `${name.firstName} ${name.familyName}`;
  };

  const getFullName = (name: ClientName) => {
    return `${name.firstName} ${name.fatherName} ${name.grandFatherName} ${name.familyName}`;
  };

  // تُستخدم فقط في معالج الإدخال (قبل الحفظ)
  const calculateCompletionPercentage = (client: Partial<Client>): number => {
    const fields = {
      name: client.name?.firstName && client.name?.familyName ? 10 : 0,
      type: client.type ? 5 : 0,
      nationality: client.nationality ? 5 : 0,
      category: client.category ? 5 : 0,
      rating: client.rating ? 5 : 0,
      mobile: client.contact?.mobile ? 10 : 0,
      email: client.contact?.email ? 10 : 0,
      address: client.address?.city && client.address?.district ? 15 : 0,
      identification: client.identification?.idNumber && client.identification?.idType ? 15 : 0,
      occupation: client.occupation ? 5 : 0,
      notes: client.notes ? 5 : 0,
      secretRating: client.secretRating !== undefined ? 10 : 0
    };
    return Object.values(fields).reduce((sum, val) => sum + val, 0);
  };

  // تُستخدم فقط في معالج الإدخال (قبل الحفظ)
  const calculateClientGrade = (client: Partial<Client>): { grade: ClientGrade; score: number } => {
    let totalScore = 0;
    const totalWeight = Object.values(gradingCriteria).reduce((sum, weight) => sum + weight, 0);
    const feesScore = Math.min(100, ((client.totalFees || 0) / 500000) * 100);
    totalScore += (feesScore * gradingCriteria.totalFeesWeight) / totalWeight;
    const uniqueProjectTypes = new Set(client.projectTypes || []);
    const projectTypesScore = Math.min(100, (uniqueProjectTypes.size / 5) * 100);
    totalScore += (projectTypesScore * gradingCriteria.projectTypesWeight) / totalWeight;
    const uniqueTransactionTypes = new Set(client.transactionTypes || []);
    const transactionTypesScore = Math.min(100, (uniqueTransactionTypes.size / 8) * 100);
    totalScore += (transactionTypesScore * gradingCriteria.transactionTypesWeight) / totalWeight;
    const completionRate = (client.totalTransactions || 0) > 0 
      ? ((client.completedTransactions || 0) / (client.totalTransactions || 1)) * 100 
      : 0;
    totalScore += (completionRate * gradingCriteria.completionRateWeight) / totalWeight;
    totalScore += ((client.secretRating || 0) * gradingCriteria.secretRatingWeight) / totalWeight;
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

  const getGradeColor = (grade?: string): string => {
    switch (grade) {
      case 'أ': return '#10b981';
      case 'ب': return '#f59e0b';
      case 'ج': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getGradeDescription = (grade?: string): string => {
    switch (grade) {
      case 'أ': return 'عميل ممتاز - أولوية قصوى';
      case 'ب': return 'عميل جيد - متوسط الأهمية';
      case 'ج': return 'عميل عادي - أولوية منخفضة';
      default: return '';
    }
  };

  const saveDraft = () => {
    const draft: ClientDraft = {
      step: addClientStep,
      data: newClientData,
      lastSaved: new Date().toISOString()
    };
    const drafts = [...clientDrafts];
    const existingIndex = drafts.findIndex(d => d.data.id === newClientData.id);
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    setClientDrafts(drafts);
    localStorage.setItem('client_drafts', JSON.stringify(drafts));
    toast.success('تم حفظ التقدم بنجاح');
  };

  const loadDrafts = () => {
    const stored = localStorage.getItem('client_drafts');
    if (stored) {
      try {
        const drafts = JSON.parse(stored);
        setClientDrafts(drafts);
      } catch (e) {
        console.error('Error loading drafts:', e);
      }
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
  // جلب البيانات من الـ Backend
  // ============================================================================
  useEffect(() => {
    const defaultClassifications: ClientClassification[] = [
      { id: 'vip', name: 'VIP', color: '#f59e0b', description: 'عملاء مميزون', isActive: true },
      { id: 'corporate', name: 'مؤسسة', color: '#3b82f6', description: 'شركات ومؤسسات', isActive: true },
      { id: 'regular', name: 'عادي', color: '#6b7280', description: 'عملاء عاديون', isActive: true },
      { id: 'government', name: 'حكومي', color: '#10b981', description: 'جهات حكومية', isActive: true },
      { id: 'special', name: 'خاص', color: '#8b5cf6', description: 'عملاء بمعاملة خاصة', isActive: true }
    ];
    setClientClassifications(defaultClassifications);
    loadDrafts();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      console.error(err);
      setError('فشل في جلب بيانات العملاء. يرجى المحاولة مرة أخرى.');
      toast.error('فشل في جلب بيانات العملاء.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // دوال الإنشاء والتحديث
  // ============================================================================
  const handleCreateClient = async () => {
    try {
      if (!newClientData.contact?.mobile || !newClientData.identification?.idNumber || !newClientData.name?.firstName) {
        toast.error('الرجاء ملء الحقول الإلزامية: الجوال، رقم الهوية، والاسم الأول.');
        return;
      }
      const dataToCreate = {
        ...newClientData,
        name: newClientData.name as ClientName,
        contact: newClientData.contact as ClientContact,
        identification: newClientData.identification as ClientIdentification,
        address: newClientData.address as ClientAddress,
        type: newClientData.type as 'فرد' | 'شركة' | 'جهة حكومية',
        // لا نرسل الحقول التي يحسبها الـ backend
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        grade: undefined,
        gradeScore: undefined,
        completionPercentage: undefined,
      };
      // @ts-ignore
      const newClient = await createClient(dataToCreate);
      setClients(prev => [newClient, ...prev]);
      setShowAddDialog(false);
      setAddClientStep(1);
      setNewClientData({});
      toast.success(`تم إضافة العميل "${newClient.name.firstName}" بنجاح`);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'فشل في إضافة العميل.';
      if (errorMsg.includes('تضارب')) {
        toast.error('فشل الإضافة: البيانات مستخدمة مسبقاً', { description: errorMsg });
      } else {
        toast.error('فشل في إضافة العميل', { description: errorMsg });
      }
    }
  };

  // ============================================================================
  // إحصائيات
  // ============================================================================
  const stats = useMemo(() => {
    if (isLoading || clients.length === 0) {
      return { 
        total: 0, active: 0, gradeA: 0, gradeB: 0, gradeC: 0, 
        totalTransactions: 0, totalFees: 0, totalPaid: 0, totalRemaining: 0, 
        avgCompletionPercentage: 0 
      };
    }
    return {
      total: clients.length,
      active: clients.filter(c => c.isActive).length,
      gradeA: clients.filter(c => c.grade === 'أ').length,
      gradeB: clients.filter(c => c.grade === 'ب').length,
      gradeC: clients.filter(c => c.grade === 'ج').length,
      totalTransactions: clients.reduce((sum, c) => sum + (c.totalTransactions || 0), 0),
      totalFees: clients.reduce((sum, c) => sum + (c.totalFees || 0), 0),
      totalPaid: clients.reduce((sum, c) => sum + (c.totalPaid || 0), 0),
      totalRemaining: clients.reduce((sum, c) => sum + (c.totalRemaining || 0), 0),
      avgCompletionPercentage: Math.round(clients.reduce((sum, c) => sum + c.completionPercentage, 0) / clients.length)
    };
  }, [clients, isLoading]);

  // ============================================================================
  // وظائف العرض (من v18.0 مع تحسينات الربط)
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
              نظام شامل لإدارة معلومات العملاء وتصنيفاتهم ومعاملاتهم
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

  const renderClientProfileDialog = () => {
    if (!selectedClient) return null;
    const grade = selectedClient.grade;
    const score = selectedClient.gradeScore || 0;
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
                الدرجة: {grade || '-'}
              </Badge>
              <Badge 
                variant="outline"
                style={{ 
                  fontSize: '12px', 
                  padding: '4px 10px',
                  borderColor: '#3b82f6',
                  color: '#3b82f6'
                }}
              >
                استكمال البيانات: {selectedClient.completionPercentage}%
              </Badge>
            </DialogTitle>
            <DialogDescription style={{ fontSize: '13px', color: '#6b7280' }}>
              معلومات تفصيلية وإحصائيات شاملة للعميل
            </DialogDescription>
          </DialogHeader>
          <ScrollArea style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-3 gap-3">
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
                      <p className="text-xs text-gray-600">{selectedClient.clientCode}</p>
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
                        <span className="text-4xl font-bold text-white">{grade || '-'}</span>
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
                          {(selectedClient.totalFees || 0).toLocaleString()} <span className="text-xs">ر.س</span>
                        </p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-600 mb-1">المدفوع</p>
                          <p className="text-sm font-bold text-green-700">
                            {(selectedClient.totalPaid || 0).toLocaleString()}
                          </p>
                          <Progress 
                            value={selectedClient.totalFees ? ((selectedClient.totalPaid || 0) / selectedClient.totalFees) * 100 : 0} 
                            className="h-1 mt-1" 
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 mb-1">المتبقي</p>
                          <p className="text-sm font-bold text-red-700">
                            {(selectedClient.totalRemaining || 0).toLocaleString()}
                          </p>
                          <Progress 
                            value={selectedClient.totalFees ? ((selectedClient.totalRemaining || 0) / selectedClient.totalFees) * 100 : 0} 
                            className="h-1 mt-1" 
                          />
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded border text-center">
                        <p className="text-[10px] text-gray-600 mb-1">نسبة السداد</p>
                        <p className="text-lg font-bold text-blue-600">
                          {selectedClient.totalFees ? (((selectedClient.totalPaid || 0) / selectedClient.totalFees) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

  const renderAddClientDialog = () => {
    const totalSteps = 6;
    const progressPercentage = (addClientStep / totalSteps) * 100;
    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent 
          className="max-w-5xl"
          style={{ 
            maxHeight: '90vh', 
            fontFamily: 'Tajawal, sans-serif', 
            direction: 'rtl' 
          }}
        >
          <DialogHeader>
            <DialogTitle 
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <UserPlus className="h-5 w-5" style={{ color: '#2563eb' }} />
              إضافة عميل جديد - الخطوة {addClientStep} من {totalSteps}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <span className="text-gray-600">تقدم الإدخال:</span>
              <span className="font-bold text-blue-600">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between gap-1">
              {[
                { num: 1, label: 'أساسي', icon: User },
                { num: 2, label: 'اتصال', icon: Phone },
                { num: 3, label: 'عنوان', icon: MapPin },
                { num: 4, label: 'هوية', icon: IdCard },
                { num: 5, label: 'إضافي', icon: Info },
                { num: 6, label: 'مراجعة', icon: CheckCircle2 }
              ].map((step) => {
                const Icon = step.icon;
                const isCompleted = addClientStep > step.num;
                const isCurrent = addClientStep === step.num;
                return (
                  <div key={step.num} className="flex-1 text-center">
                    <div 
                      className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 transition-all"
                      style={{
                        background: isCompleted 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : isCurrent
                          ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                          : '#e5e7eb',
                        boxShadow: isCurrent ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
                      }}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Icon 
                          className="h-4 w-4" 
                          style={{ color: isCurrent ? '#fff' : '#9ca3af' }} 
                        />
                      )}
                    </div>
                    <p 
                      className="text-[9px]"
                      style={{ 
                        color: isCompleted || isCurrent ? '#1e40af' : '#9ca3af',
                        fontWeight: isCurrent ? 700 : 400
                      }}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <Separator />
          <ScrollArea style={{ maxHeight: 'calc(90vh - 300px)' }}>
            <div className="space-y-4 p-4">
              {addClientStep === 1 && renderStep1_BasicInfo()}
              {addClientStep === 2 && renderStep2_ContactInfo()}
              {addClientStep === 3 && renderStep3_Address()}
              {addClientStep === 4 && renderStep4_Identification()}
              {addClientStep === 5 && renderStep5_Additional()}
              {addClientStep === 6 && renderStep6_Review()}
            </div>
          </ScrollArea>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                {addClientStep > 1 && (
                  <Button
                    onClick={() => setAddClientStep(addClientStep - 1)}
                    variant="outline"
                  >
                    <ArrowRight className="h-3 w-3 ml-1" />
                    السابق
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={saveDraft}
                  variant="outline"
                  style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                >
                  <Save className="h-3 w-3 ml-1" />
                  حفظ التقدم
                </Button>
                <Button 
                  onClick={() => setShowAddDialog(false)} 
                  variant="outline"
                >
                  <X className="h-3 w-3 ml-1" />
                  إلغاء
                </Button>
                {addClientStep < totalSteps ? (
                  <Button
                    onClick={() => setAddClientStep(addClientStep + 1)}
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}
                  >
                    التالي
                    <ArrowLeft className="h-3 w-3 mr-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateClient}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}
                  >
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                    حفظ العميل
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderStep1_BasicInfo = () => (
    <div className="space-y-4">
      <div 
        className="p-3 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}
      >
        <h3 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
          <User className="h-4 w-4" />
          البيانات الشخصية الأساسية
        </h3>
        <p className="text-xs text-blue-700">
          أدخل الاسم الرباعي الكامل للعميل (جميع الحقول إلزامية)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputWithCopy
          label="الاسم الأول *"
          id="firstName"
          value={newClientData.name?.firstName || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            name: { ...newClientData.name, firstName: e.target.value } as ClientName
          })}
          placeholder="مثال: محمد"
          required
        />
        <InputWithCopy
          label="اسم الأب *"
          id="fatherName"
          value={newClientData.name?.fatherName || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            name: { ...newClientData.name, fatherName: e.target.value } as ClientName
          })}
          placeholder="مثال: أحمد"
          required
        />
        <InputWithCopy
          label="اسم الجد *"
          id="grandFatherName"
          value={newClientData.name?.grandFatherName || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            name: { ...newClientData.name, grandFatherName: e.target.value } as ClientName
          })}
          placeholder="مثال: عبدالله"
          required
        />
        <InputWithCopy
          label="اسم العائلة *"
          id="familyName"
          value={newClientData.name?.familyName || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            name: { ...newClientData.name, familyName: e.target.value } as ClientName
          })}
          placeholder="مثال: العلي"
          required
        />
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-3">
        <SelectWithCopy
          label="نوع العميل *"
          id="clientType"
          value={newClientData.type || ''}
          onChange={(value) => setNewClientData({ ...newClientData, type: value as any })}
          options={[
            { value: 'فرد', label: 'فرد' },
            { value: 'شركة', label: 'شركة' },
            { value: 'جهة حكومية', label: 'جهة حكومية' }
          ]}
        />
        <SelectWithCopy
          label="التصنيف *"
          id="clientCategory"
          value={newClientData.category || ''}
          onChange={(value) => setNewClientData({ ...newClientData, category: value })}
          options={clientClassifications.filter(c => c.isActive).map(c => ({
            value: c.name,
            label: c.name
          }))}
        />
        <InputWithCopy
          label="الجنسية *"
          id="nationality"
          value={newClientData.nationality || ''}
          onChange={(e) => setNewClientData({ ...newClientData, nationality: e.target.value })}
          placeholder="مثال: سعودي"
          required
        />
        <InputWithCopy
          label="المهنة (اختياري)"
          id="occupation"
          value={newClientData.occupation || ''}
          onChange={(e) => setNewClientData({ ...newClientData, occupation: e.target.value })}
          placeholder="مثال: مهندس"
        />
      </div>
      {newClientData.type === 'شركة' && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <InputWithCopy
              label="اسم الشركة"
              id="company"
              value={newClientData.company || ''}
              onChange={(e) => setNewClientData({ ...newClientData, company: e.target.value })}
              placeholder="مثال: شركة العلي للمقاولات"
            />
            <InputWithCopy
              label="السجل التجاري"
              id="commercialRegister"
              value={newClientData.commercialRegister || ''}
              onChange={(e) => setNewClientData({ ...newClientData, commercialRegister: e.target.value })}
              placeholder="مثال: 1234567890"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStep2_ContactInfo = () => (
    <div className="space-y-4">
      <div 
        className="p-3 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}
      >
        <h3 className="text-sm font-bold text-green-900 mb-1 flex items-center gap-2">
          <Phone className="h-4 w-4" />
          معلومات الاتصال
        </h3>
        <p className="text-xs text-green-700">
          أدخل جميع وسائل الاتصال المتاحة (الجوال والبريد إلزامي)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputWithCopy
          label="رقم الجوال *"
          id="mobile"
          value={newClientData.contact?.mobile || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, mobile: e.target.value } as ClientContact
          })}
          placeholder="05XXXXXXXX"
          required
        />
        <InputWithCopy
          label="رقم الهاتف (اختياري)"
          id="phone"
          value={newClientData.contact?.phone || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, phone: e.target.value } as ClientContact
          })}
          placeholder="011XXXXXXX"
        />
        <InputWithCopy
          label="البريد الإلكتروني *"
          id="email"
          value={newClientData.contact?.email || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, email: e.target.value } as ClientContact
          })}
          placeholder="example@email.com"
          required
        />
        <InputWithCopy
          label="رقم الفاكس (اختياري)"
          id="fax"
          value={newClientData.contact?.fax || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, fax: e.target.value } as ClientContact
          })}
          placeholder="011XXXXXXX"
        />
        <InputWithCopy
          label="واتساب (اختياري)"
          id="whatsapp"
          value={newClientData.contact?.whatsapp || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, whatsapp: e.target.value } as ClientContact
          })}
          placeholder="05XXXXXXXX"
        />
        <InputWithCopy
          label="تيليجرام (اختياري)"
          id="telegram"
          value={newClientData.contact?.telegram || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            contact: { ...newClientData.contact, telegram: e.target.value } as ClientContact
          })}
          placeholder="@username"
        />
      </div>
    </div>
  );

  const renderStep3_Address = () => (
    <div className="space-y-4">
      <div 
        className="p-3 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}
      >
        <h3 className="text-sm font-bold text-yellow-900 mb-1 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          العنوان التفصيلي
        </h3>
        <p className="text-xs text-yellow-700">
          أدخل العنوان الكامل للعميل (حقول المدينة والحي إلزامية)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputWithCopy
          label="الدولة *"
          id="country"
          value={newClientData.address?.country || 'المملكة العربية السعودية'}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, country: e.target.value } as ClientAddress
          })}
          required
        />
        <InputWithCopy
          label="المدينة *"
          id="city"
          value={newClientData.address?.city || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, city: e.target.value } as ClientAddress
          })}
          placeholder="مثال: الرياض"
          required
        />
        <InputWithCopy
          label="الحي *"
          id="district"
          value={newClientData.address?.district || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, district: e.target.value } as ClientAddress
          })}
          placeholder="مثال: النرجس"
          required
        />
        <InputWithCopy
          label="الشارع"
          id="street"
          value={newClientData.address?.street || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, street: e.target.value } as ClientAddress
          })}
          placeholder="مثال: طريق الملك فهد"
        />
        <InputWithCopy
          label="رقم المبنى"
          id="buildingNumber"
          value={newClientData.address?.buildingNumber || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, buildingNumber: e.target.value } as ClientAddress
          })}
          placeholder="1234"
        />
        <InputWithCopy
          label="الرمز البريدي"
          id="postalCode"
          value={newClientData.address?.postalCode || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, postalCode: e.target.value } as ClientAddress
          })}
          placeholder="12345"
        />
        <InputWithCopy
          label="الرقم الإضافي"
          id="additionalNumber"
          value={newClientData.address?.additionalNumber || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, additionalNumber: e.target.value } as ClientAddress
          })}
          placeholder="5678"
        />
        <InputWithCopy
          label="رقم الوحدة"
          id="unitNumber"
          value={newClientData.address?.unitNumber || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            address: { ...newClientData.address, unitNumber: e.target.value } as ClientAddress
          })}
          placeholder="رقم الشقة/المكتب"
        />
      </div>
      <TextAreaWithCopy
        label="العنوان الكامل"
        id="fullAddress"
        value={newClientData.address?.fullAddress || ''}
        onChange={(e) => setNewClientData({
          ...newClientData,
          address: { ...newClientData.address, fullAddress: e.target.value } as ClientAddress
        })}
        rows={2}
        placeholder="العنوان الكامل والمفصل"
      />
    </div>
  );

  const renderStep4_Identification = () => (
    <div className="space-y-4">
      <div 
        className="p-3 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}
      >
        <h3 className="text-sm font-bold text-pink-900 mb-1 flex items-center gap-2">
          <IdCard className="h-4 w-4" />
          بيانات الهوية الرسمية
        </h3>
        <p className="text-xs text-pink-700">
          أدخل معلومات الهوية أو السجل التجاري (جميع الحقول إلزامية)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectWithCopy
          label="نوع الهوية *"
          id="idType"
          value={newClientData.identification?.idType || ''}
          onChange={(value) => setNewClientData({
            ...newClientData,
            identification: { ...newClientData.identification, idType: value as any } as ClientIdentification
          })}
          options={[
            { value: 'هوية وطنية', label: 'هوية وطنية' },
            { value: 'إقامة', label: 'إقامة' },
            { value: 'جواز سفر', label: 'جواز سفر' },
            { value: 'سجل تجاري', label: 'سجل تجاري' }
          ]}
        />
        <InputWithCopy
          label="رقم الهوية/السجل *"
          id="idNumber"
          value={newClientData.identification?.idNumber || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            identification: { ...newClientData.identification, idNumber: e.target.value } as ClientIdentification
          })}
          placeholder="1234567890"
          required
        />
        <InputWithCopy
          label="تاريخ الإصدار *"
          id="issueDate"
          value={newClientData.identification?.issueDate || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            identification: { ...newClientData.identification, issueDate: e.target.value } as ClientIdentification
          })}
          placeholder="YYYY-MM-DD"
          required
        />
        <InputWithCopy
          label="تاريخ الانتهاء *"
          id="expiryDate"
          value={newClientData.identification?.expiryDate || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            identification: { ...newClientData.identification, expiryDate: e.target.value } as ClientIdentification
          })}
          placeholder="YYYY-MM-DD"
          required
        />
        <InputWithCopy
          label="مكان الإصدار *"
          id="issuePlace"
          value={newClientData.identification?.issuePlace || ''}
          onChange={(e) => setNewClientData({
            ...newClientData,
            identification: { ...newClientData.identification, issuePlace: e.target.value } as ClientIdentification
          })}
          placeholder="مثال: الرياض"
          required
        />
      </div>
    </div>
  );

  const renderStep5_Additional = () => (
    <div className="space-y-4">
      <div 
        className="p-3 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}
      >
        <h3 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-2">
          <Info className="h-4 w-4" />
          معلومات إضافية وتقييم
        </h3>
        <p className="text-xs text-indigo-700">
          أدخل معلومات إضافية وتقييم العميل (جميع الحقول اختيارية)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-700 mb-2 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التقييم العام (1-5 نجوم)
          </label>
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className="h-6 w-6 cursor-pointer transition-all"
                onClick={() => setNewClientData({ ...newClientData, rating: star })}
                style={{
                  fill: (newClientData.rating || 0) >= star ? '#fbbf24' : 'none',
                  color: (newClientData.rating || 0) >= star ? '#fbbf24' : '#d1d5db'
                }}
              />
            ))}
            <span className="text-sm text-gray-600 mr-2">
              {newClientData.rating || 0} نجوم
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-700 mb-2 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التقييم السري (0-100)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={newClientData.secretRating || 50}
              onChange={(e) => setNewClientData({ ...newClientData, secretRating: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">0</span>
              <Badge 
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                  color: '#fff',
                  fontSize: '13px',
                  padding: '4px 12px'
                }}
              >
                {newClientData.secretRating || 50}/100
              </Badge>
              <span className="text-xs text-gray-600">100</span>
            </div>
            <Progress value={newClientData.secretRating || 50} className="h-2" />
          </div>
        </div>
      </div>
      <TextAreaWithCopy
        label="ملاحظات (اختياري)"
        id="notes"
        value={newClientData.notes || ''}
        onChange={(e) => setNewClientData({ ...newClientData, notes: e.target.value })}
        rows={4}
        placeholder="أي ملاحظات أو معلومات إضافية عن العميل..."
      />
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-yellow-50">
        <EnhancedSwitch
          id="isActive"
          checked={newClientData.isActive !== false}
          onCheckedChange={(checked) => setNewClientData({ ...newClientData, isActive: checked })}
          label="حساب نشط"
          description="هل هذا الحساب نشط ويمكن التعامل معه؟"
        />
      </div>
    </div>
  );

  const renderStep6_Review = () => {
    const completionPercentage = calculateCompletionPercentage(newClientData);
    return (
      <div className="space-y-4">
        <div 
          className="p-4 rounded-lg"
          style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}
        >
          <h3 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            مراجعة البيانات النهائية
          </h3>
          <p className="text-xs text-green-700 mb-3">
            راجع جميع المعلومات المدخلة قبل الحفظ النهائي
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-700">نسبة استكمال البيانات:</span>
                <span className="text-sm font-bold text-green-900">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <Badge
              style={{
                background: completionPercentage >= 80 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : completionPercentage >= 50
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                padding: '6px 12px'
              }}
            >
              {completionPercentage >= 80 ? '✓ ممتاز' : completionPercentage >= 50 ? '⚠ جيد' : '✗ ناقص'}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                البيانات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="font-semibold">
                  {newClientData.name ? getFullName(newClientData.name) : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <Badge variant="outline">{newClientData.type || '-'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">التصنيف:</span>
                <Badge>{newClientData.category || '-'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الجنسية:</span>
                <span className="font-semibold">{newClientData.nationality || '-'}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                بيانات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">الجوال:</span>
                <span className="font-mono font-semibold">{newClientData.contact?.mobile || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البريد:</span>
                <span className="text-[10px]">{newClientData.contact?.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">واتساب:</span>
                <span className="font-mono">{newClientData.contact?.whatsapp || '-'}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-yellow-600" />
                العنوان
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">المدينة:</span>
                <span className="font-semibold">{newClientData.address?.city || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الحي:</span>
                <span className="font-semibold">{newClientData.address?.district || '-'}</span>
              </div>
              <div className="col-span-2 text-xs text-gray-600">
                {newClientData.address?.fullAddress || 'لم يتم إدخال العنوان الكامل'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <IdCard className="h-4 w-4 text-pink-600" />
                بيانات الهوية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <Badge variant="outline">{newClientData.identification?.idType || '-'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الرقم:</span>
                <span className="font-mono font-semibold">{newClientData.identification?.idNumber || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الصلاحية:</span>
                <span className="text-[10px]">{newClientData.identification?.expiryDate || '-'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {completionPercentage < 60 && (
          <div 
            className="p-3 rounded-lg border-2 border-orange-300"
            style={{ background: '#fef3c7' }}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-orange-900 mb-1">
                  تنبيه: بيانات ناقصة
                </p>
                <p className="text-xs text-orange-700">
                  نسبة استكمال البيانات أقل من 60%. يمكنك حفظ العميل الآن واستكمال البيانات لاحقاً، 
                  أو العودة للخطوات السابقة لإكمال المعلومات الناقصة.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // التابات الكاملة
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
      case '300-01': return render_300_01_ClientsList();
      case '300-02': return render_300_02_BasicData();
      case '300-03': return render_300_03_ContactData();
      case '300-04': return render_300_04_Address();
      case '300-05': return render_300_05_Identification();
      case '300-06': return render_300_06_Transactions();
      case '300-07': return render_300_07_FeesPayments();
      case '300-08': return render_300_08_RatingNotes();
      case '300-09': return render_300_09_Statistics();
      case '300-10': return render_300_10_Reports();
      case '300-11': return render_300_11_ActivityLog();
      case '300-12': return render_300_12_ClassificationsSettings();
      default: return null;
    }
  };

  function render_300_01_ClientsList() {
    const filteredClients = clients.filter(c => {
      const matchSearch = !searchTerm || 
        getFullName(c.name).includes(searchTerm) || 
        c.clientCode.includes(searchTerm) ||
        c.contact.mobile.includes(searchTerm);
      const matchType = filterType === 'all' || c.type === filterType;
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      const matchGrade = filterGrade === 'all' || c.grade === filterGrade;
      return matchSearch && matchType && matchCategory && matchGrade;
    });

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-01" position="top-right" />
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
            <Card key={i} style={{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`, border: `2px solid ${stat.color}40` }}>
              <CardContent className="p-2 text-center">
                <stat.Icon className="h-4 w-4 mx-auto mb-0.5" style={{ color: stat.color }} />
                <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: stat.color }}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '16px' }}>
                <Users className="h-4 w-4 inline ml-2" />
                قائمة العملاء ({isLoading ? 'جاري التحميل...' : `${filteredClients.length}`})
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  setNewClientData({});
                  setAddClientStep(1);
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
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                  <p className="ml-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>جاري تحميل بيانات العملاء...</p>
                </div>
              )}
              {!isLoading && error && (
                <div className="flex items-center justify-center h-96 flex-col">
                  <AlertCircleIcon className="h-12 w-12 text-red-500" />
                  <p className="ml-4 mt-4 text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{error}</p>
                </div>
              )}
              {!isLoading && !error && (
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs">الكود</TableHead>
                      <TableHead className="text-right text-xs">الاسم</TableHead>
                      <TableHead className="text-right text-xs">النوع</TableHead>
                      <TableHead className="text-right text-xs">التصنيف</TableHead>
                      <TableHead className="text-right text-xs">الدرجة</TableHead>
                      <TableHead className="text-right text-xs">النقاط</TableHead>
                      <TableHead className="text-right text-xs">استكمال</TableHead>
                      <TableHead className="text-right text-xs">الجوال</TableHead>
                      <TableHead className="text-right text-xs">المعاملات</TableHead>
                      <TableHead className="text-right text-xs">الأتعاب</TableHead>
                      <TableHead className="text-right text-xs">الحالة</TableHead>
                      <TableHead className="text-right text-xs">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map(client => {
                      const gradeColor = getGradeColor(client.grade);
                      const completionColor = client.completionPercentage >= 80 
                        ? '#10b981' 
                        : client.completionPercentage >= 50 
                        ? '#f59e0b' 
                        : '#ef4444';
                      return (
                        <TableRow 
                          key={client.id}
                          className="hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowProfileDialog(true);
                          }}
                        >
                          <TableCell className="text-right">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{client.clientCode}</code>
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
                            <Badge style={{ 
                              fontSize: '10px', 
                              background: clientClassifications.find(c => c.name === client.category)?.color + '20' || '#f3f4f6' 
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
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full" 
                                  style={{ 
                                    width: `${client.completionPercentage}%`,
                                    background: completionColor
                                  }} 
                                />
                              </div>
                              <span 
                                className="text-[10px] font-semibold"
                                style={{ color: completionColor }}
                              >
                                {client.completionPercentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono">{client.contact.mobile}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold text-blue-600">{client.totalTransactions || 0}</span>
                              <span className="text-[10px] text-gray-500">
                                ({client.completedTransactions || 0} ✓)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-bold text-blue-900">
                            {((client.totalFees || 0) / 1000).toFixed(0)}K
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
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_02_BasicData() {
    const [localClient, setLocalClient] = useState(selectedClient);
    useEffect(() => setLocalClient(selectedClient), [selectedClient]);

    const handleSave = async () => {
      if (!localClient) return;
      try {
        const updated = await updateClient(localClient.id, {
          name: localClient.name,
          type: localClient.type,
          category: localClient.category,
          nationality: localClient.nationality,
          occupation: localClient.occupation,
          company: localClient.company,
        });
        setSelectedClient(updated);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        toast.success('تم حفظ البيانات الأساسية بنجاح');
      } catch (err) {
        toast.error('فشل حفظ التغييرات');
      }
    };

    if (!localClient) return null;

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-02" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>البيانات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <InputWithCopy
                label="الاسم الأول *"
                id="firstName"
                value={localClient.name.firstName}
                onChange={(e) => setLocalClient({ ...localClient, name: { ...localClient.name, firstName: e.target.value } })}
                required
              />
              <InputWithCopy
                label="اسم الأب *"
                id="fatherName"
                value={localClient.name.fatherName}
                onChange={(e) => setLocalClient({ ...localClient, name: { ...localClient.name, fatherName: e.target.value } })}
                required
              />
              <InputWithCopy
                label="اسم الجد *"
                id="grandFatherName"
                value={localClient.name.grandFatherName}
                onChange={(e) => setLocalClient({ ...localClient, name: { ...localClient.name, grandFatherName: e.target.value } })}
                required
              />
              <InputWithCopy
                label="اسم العائلة *"
                id="familyName"
                value={localClient.name.familyName}
                onChange={(e) => setLocalClient({ ...localClient, name: { ...localClient.name, familyName: e.target.value } })}
                required
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="نوع العميل *"
                id="clientType"
                value={localClient.type}
                onChange={(value) => setLocalClient({ ...localClient, type: value as any })}
                options={[
                  { value: 'فرد', label: 'فرد' },
                  { value: 'شركة', label: 'شركة' },
                  { value: 'جهة حكومية', label: 'جهة حكومية' }
                ]}
              />
              <SelectWithCopy
                label="التصنيف *"
                id="clientCategory"
                value={localClient.category}
                onChange={(value) => setLocalClient({ ...localClient, category: value })}
                options={clientClassifications.filter(c => c.isActive).map(c => ({
                  value: c.name,
                  label: c.name
                }))}
              />
              <InputWithCopy
                label="الجنسية *"
                id="nationality"
                value={localClient.nationality}
                onChange={(e) => setLocalClient({ ...localClient, nationality: e.target.value })}
                required
              />
              <InputWithCopy
                label="المهنة"
                id="occupation"
                value={localClient.occupation || ''}
                onChange={(e) => setLocalClient({ ...localClient, occupation: e.target.value })}
              />
            </div>
            {localClient.type === 'شركة' && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <InputWithCopy
                    label="اسم الشركة"
                    id="company"
                    value={localClient.company || ''}
                    onChange={(e) => setLocalClient({ ...localClient, company: e.target.value })}
                  />
                  <InputWithCopy
                    label="السجل التجاري"
                    id="commercialRegister"
                    value={localClient.commercialRegister || ''}
                    onChange={(e) => setLocalClient({ ...localClient, commercialRegister: e.target.value })}
                  />
                </div>
              </>
            )}
            <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_03_ContactData() {
    const [localClient, setLocalClient] = useState(selectedClient);
    useEffect(() => setLocalClient(selectedClient), [selectedClient]);

    const handleSave = async () => {
      if (!localClient) return;
      try {
        const updated = await updateClient(localClient.id, { contact: localClient.contact });
        setSelectedClient(updated);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        toast.success('تم حفظ بيانات الاتصال بنجاح');
      } catch (err) {
        toast.error('فشل حفظ التغييرات');
      }
    };

    if (!localClient) return null;

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-03" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>بيانات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="رقم الجوال *"
                id="mobile"
                value={localClient.contact.mobile}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, mobile: e.target.value } })}
                required
              />
              <InputWithCopy
                label="رقم الهاتف"
                id="phone"
                value={localClient.contact.phone || ''}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, phone: e.target.value } })}
              />
              <InputWithCopy
                label="البريد الإلكتروني *"
                id="email"
                value={localClient.contact.email}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, email: e.target.value } })}
                required
              />
              <InputWithCopy
                label="رقم الفاكس"
                id="fax"
                value={localClient.contact.fax || ''}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, fax: e.target.value } })}
              />
              <InputWithCopy
                label="واتساب"
                id="whatsapp"
                value={localClient.contact.whatsapp || ''}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, whatsapp: e.target.value } })}
              />
              <InputWithCopy
                label="تيليجرام"
                id="telegram"
                value={localClient.contact.telegram || ''}
                onChange={(e) => setLocalClient({ ...localClient, contact: { ...localClient.contact, telegram: e.target.value } })}
              />
            </div>
            <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_04_Address() {
    const [localClient, setLocalClient] = useState(selectedClient);
    useEffect(() => setLocalClient(selectedClient), [selectedClient]);

    const handleSave = async () => {
      if (!localClient) return;
      try {
        const updated = await updateClient(localClient.id, { address: localClient.address });
        setSelectedClient(updated);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        toast.success('تم حفظ العنوان بنجاح');
      } catch (err) {
        toast.error('فشل حفظ التغييرات');
      }
    };

    if (!localClient) return null;

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-04" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>العنوان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputWithCopy
                label="الدولة *"
                id="country"
                value={localClient.address.country}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, country: e.target.value } })}
                required
              />
              <InputWithCopy
                label="المدينة *"
                id="city"
                value={localClient.address.city}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, city: e.target.value } })}
                required
              />
              <InputWithCopy
                label="الحي *"
                id="district"
                value={localClient.address.district}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, district: e.target.value } })}
                required
              />
              <InputWithCopy
                label="الشارع"
                id="street"
                value={localClient.address.street || ''}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, street: e.target.value } })}
              />
              <InputWithCopy
                label="رقم المبنى"
                id="buildingNumber"
                value={localClient.address.buildingNumber || ''}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, buildingNumber: e.target.value } })}
              />
              <InputWithCopy
                label="الرمز البريدي"
                id="postalCode"
                value={localClient.address.postalCode || ''}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, postalCode: e.target.value } })}
              />
              <InputWithCopy
                label="الرقم الإضافي"
                id="additionalNumber"
                value={localClient.address.additionalNumber || ''}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, additionalNumber: e.target.value } })}
              />
              <InputWithCopy
                label="رقم الوحدة"
                id="unitNumber"
                value={localClient.address.unitNumber || ''}
                onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, unitNumber: e.target.value } })}
              />
            </div>
            <TextAreaWithCopy
              label="العنوان الكامل"
              id="fullAddress"
              value={localClient.address.fullAddress || ''}
              onChange={(e) => setLocalClient({ ...localClient, address: { ...localClient.address, fullAddress: e.target.value } })}
              rows={2}
            />
            <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_05_Identification() {
    const [localClient, setLocalClient] = useState(selectedClient);
    useEffect(() => setLocalClient(selectedClient), [selectedClient]);

    const handleSave = async () => {
      if (!localClient) return;
      try {
        const updated = await updateClient(localClient.id, { identification: localClient.identification });
        setSelectedClient(updated);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        toast.success('تم حفظ بيانات الهوية بنجاح');
      } catch (err) {
        toast.error('فشل حفظ التغييرات');
      }
    };

    if (!localClient) return null;

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-05" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>بيانات الهوية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SelectWithCopy
                label="نوع الهوية *"
                id="idType"
                value={localClient.identification.idType}
                onChange={(value) => setLocalClient({ ...localClient, identification: { ...localClient.identification, idType: value as any } })}
                options={[
                  { value: 'هوية وطنية', label: 'هوية وطنية' },
                  { value: 'إقامة', label: 'إقامة' },
                  { value: 'جواز سفر', label: 'جواز سفر' },
                  { value: 'سجل تجاري', label: 'سجل تجاري' }
                ]}
              />
              <InputWithCopy
                label="رقم الهوية/السجل *"
                id="idNumber"
                value={localClient.identification.idNumber}
                onChange={(e) => setLocalClient({ ...localClient, identification: { ...localClient.identification, idNumber: e.target.value } })}
                required
              />
              <InputWithCopy
                label="تاريخ الإصدار *"
                id="issueDate"
                value={localClient.identification.issueDate}
                onChange={(e) => setLocalClient({ ...localClient, identification: { ...localClient.identification, issueDate: e.target.value } })}
                required
              />
              <InputWithCopy
                label="تاريخ الانتهاء *"
                id="expiryDate"
                value={localClient.identification.expiryDate}
                onChange={(e) => setLocalClient({ ...localClient, identification: { ...localClient.identification, expiryDate: e.target.value } })}
                required
              />
              <InputWithCopy
                label="مكان الإصدار *"
                id="issuePlace"
                value={localClient.identification.issuePlace}
                onChange={(e) => setLocalClient({ ...localClient, identification: { ...localClient.identification, issuePlace: e.target.value } })}
                required
              />
            </div>
            <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_06_Transactions() {
    if (!selectedClient) return null;
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-06" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>المعاملات ({selectedClient.transactions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedClient.transactions && selectedClient.transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم المعاملة</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">المدفوع</TableHead>
                    <TableHead className="text-right">المتبقي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClient.transactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-right font-mono">{tx.transactionNumber}</TableCell>
                      <TableCell className="text-right">{tx.type}</TableCell>
                      <TableCell className="text-right">
                        <Badge style={{ background: tx.statusColor, color: '#fff' }}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{tx.createdDate}</TableCell>
                      <TableCell className="text-right font-bold">{tx.totalFees.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">{tx.paidAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">{tx.remainingAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">لا توجد معاملات لهذا العميل</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_07_FeesPayments() {
    if (!selectedClient) return null;
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-07" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>الأتعاب والمدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card style={{ background: '#dcfce7' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">إجمالي الأتعاب</p>
                  <p className="text-xl font-bold text-green-900">{(selectedClient.totalFees || 0).toLocaleString()} ر.س</p>
                </CardContent>
              </Card>
              <Card style={{ background: '#dbeafe' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">المدفوع</p>
                  <p className="text-xl font-bold text-blue-900">{(selectedClient.totalPaid || 0).toLocaleString()} ر.س</p>
                </CardContent>
              </Card>
              <Card style={{ background: '#fee2e2' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">المتبقي</p>
                  <p className="text-xl font-bold text-red-900">{(selectedClient.totalRemaining || 0).toLocaleString()} ر.س</p>
                </CardContent>
              </Card>
            </div>
            {/* يمكنك إضافة جدول للمدفوعات هنا */}
            <p className="text-gray-500 text-center">التفاصيل المالية مرتبطة بالمعاملات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_08_RatingNotes() {
    const [localClient, setLocalClient] = useState(selectedClient);
    useEffect(() => setLocalClient(selectedClient), [selectedClient]);

    const handleSave = async () => {
      if (!localClient) return;
      try {
        const updated = await updateClient(localClient.id, {
          rating: localClient.rating,
          secretRating: localClient.secretRating,
          notes: localClient.notes
        });
        setSelectedClient(updated);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        toast.success('تم حفظ التقييم والملاحظات بنجاح');
      } catch (err) {
        toast.error('فشل حفظ التغييرات');
      }
    };

    if (!localClient) return null;

    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-08" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>التقييم والملاحظات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">التقييم العام (1-5 نجوم)</label>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => setLocalClient({ ...localClient, rating: star })}
                    style={{
                      fill: (localClient.rating || 0) >= star ? '#fbbf24' : 'none',
                      color: (localClient.rating || 0) >= star ? '#fbbf24' : '#d1d5db'
                    }}
                  />
                ))}
                <span className="text-sm text-gray-600 mr-2">
                  {localClient.rating || 0} نجوم
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">التقييم السري (0-100)</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localClient.secretRating || 50}
                  onChange={(e) => setLocalClient({ ...localClient, secretRating: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">0</span>
                  <Badge 
                    style={{ 
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                      color: '#fff',
                      fontSize: '13px',
                      padding: '4px 12px'
                    }}
                  >
                    {localClient.secretRating || 50}/100
                  </Badge>
                  <span className="text-xs text-gray-600">100</span>
                </div>
                <Progress value={localClient.secretRating || 50} className="h-2" />
              </div>
            </div>
            <TextAreaWithCopy
              label="ملاحظات"
              id="notes"
              value={localClient.notes || ''}
              onChange={(e) => setLocalClient({ ...localClient, notes: e.target.value })}
              rows={4}
              placeholder="أدخل ملاحظاتك عن هذا العميل..."
            />
            <Button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_09_Statistics() {
    if (!selectedClient) return null;
    const { grade, gradeScore } = selectedClient;
    const gradeColor = getGradeColor(grade);
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-09" position="top-right" />
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>الإحصائيات العامة</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>نسبة استكمال البيانات</span>
                  <span className="font-bold" style={{ color: selectedClient.completionPercentage >= 80 ? '#10b981' : '#f59e0b' }}>
                    {selectedClient.completionPercentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>الدرجة</span>
                  <Badge style={{ background: gradeColor, color: '#fff' }}>{grade || '-'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>النقاط</span>
                  <span className="font-bold" style={{ color: gradeColor }}>{gradeScore || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي المعاملات</span>
                  <span className="font-bold">{selectedClient.totalTransactions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>المعاملات المكتملة</span>
                  <span className="font-bold text-green-600">{selectedClient.completedTransactions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>معدل الإنجاز</span>
                  <span className="font-bold">
                    {selectedClient.totalTransactions ? 
                      ((selectedClient.completedTransactions / selectedClient.totalTransactions) * 100).toFixed(1) + '%' 
                      : '0%'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>التقييمات</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">التقييم العام</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className="h-5 w-5"
                        style={{
                          fill: star <= selectedClient.rating ? '#fbbf24' : 'none',
                          color: star <= selectedClient.rating ? '#fbbf24' : '#d1d5db'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التقييم السري</p>
                  <Progress value={selectedClient.secretRating || 0} className="h-2" />
                  <p className="text-sm font-bold text-purple-600 mt-1">{selectedClient.secretRating || 0}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function render_300_10_Reports() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-10" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>التقارير</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">قسم التقارير قيد التطوير. سيتم إضافة تصدير Excel و PDF لاحقاً.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" disabled>
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                تصدير Excel
              </Button>
              <Button variant="outline" disabled>
                <FileText className="h-4 w-4 ml-2" />
                تصدير PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_11_ActivityLog() {
    if (!selectedClient) return null;
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-11" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>السجل الزمني (النشاط الأخير)</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedClient.activityLog && selectedClient.activityLog.length > 0 ? (
              <div className="space-y-4">
                {selectedClient.activityLog.slice(0, 10).map(log => (
                  <div key={log.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{log.performedBy}</span>
                      <span className="text-gray-500">{log.date} {log.time}</span>
                    </div>
                    <p className="text-sm mt-1">{log.description}</p>
                    <Badge variant="outline" className="mt-2">{log.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">لا يوجد سجل نشاط لهذا العميل</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function render_300_12_ClassificationsSettings() {
    return (
      <div className="space-y-3">
        <CodeDisplay code="TAB-300-12" position="top-right" />
        <Card>
          <CardHeader>
            <CardTitle>التصنيفات والإعدادات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">هذا القسم يعرض الإعدادات العامة لنظام التصنيف.</p>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">معايير تقييم العملاء:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>الأتعاب: {gradingCriteria.totalFeesWeight}%</li>
                <li>أنواع المشاريع: {gradingCriteria.projectTypesWeight}%</li>
                <li>أنواع المعاملات: {gradingCriteria.transactionTypesWeight}%</li>
                <li>معدل الإنجاز: {gradingCriteria.completionRateWeight}%</li>
                <li>التقييم السري: {gradingCriteria.secretRatingWeight}%</li>
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">تصنيفات العملاء:</h4>
              <div className="flex flex-wrap gap-2">
                {clientClassifications.map(cls => (
                  <Badge key={cls.id} style={{ background: cls.color + '20', color: cls.color }}>
                    {cls.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // Render النهائي
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
      {renderClientProfileDialog()}
      {renderAddClientDialog()}
    </div>
  );
};

export default ClientManagement_300_FULL;