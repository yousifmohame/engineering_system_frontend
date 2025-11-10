import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  FileSignature, Settings, Plus, Edit, Trash2, Eye, Copy,
  CheckCircle, XCircle, Users, Building2, FileText, Shield,
  Printer, Mail, Lock, Download, Upload, Save, RefreshCw,
  AlertCircle, Info, Zap, Code, Layout, Layers, FileCheck
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

const TABS_CONFIG: TabConfig[] = [
  { id: '777-01', number: '777-01', title: 'نظرة عامة', icon: Layout },
  { id: '777-02', number: '777-02', title: 'أنواع العقود', icon: FileSignature },
  { id: '777-03', number: '777-03', title: 'البنود المسبقة', icon: Layers },
  { id: '777-04', number: '777-04', title: 'إعدادات الاعتماد', icon: Shield },
  { id: '777-05', number: '777-05', title: 'قوالب الطباعة', icon: Printer },
  { id: '777-06', number: '777-06', title: 'إعدادات الإشعارات', icon: Mail },
  { id: '777-07', number: '777-07', title: 'التوقيع الرقمي', icon: FileCheck },
  { id: '777-08', number: '777-08', title: 'خلفيات الحماية', icon: Lock },
];

interface ContractType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'عقود بناء' | 'عقود تجارية' | 'اتفاقيات' | 'عقود خدمات';
  requiresApproval: boolean;
  approvalWorkflow: 'يدوي' | 'رقمي' | 'مختلط';
  approvalLevels: ApprovalLevel[];
  defaultTerms: string;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

interface ApprovalLevel {
  id: string;
  level: number;
  approverType: 'مكتب' | 'مقاول' | 'عميل' | 'جهة حكومية';
  approverRole: string;
  isRequired: boolean;
  canReject: boolean;
  timeLimit: number; // بالأيام
}

interface ContractClause {
  id: string;
  contractTypeId: string;
  clauseNumber: string;
  title: string;
  content: string;
  isRequired: boolean;
  isEditable: boolean;
  order: number;
  category: 'مالي' | 'قانوني' | 'فني' | 'إداري';
}

interface PrintTemplate {
  id: string;
  contractTypeId: string;
  name: string;
  header: string;
  footer: string;
  logo: boolean;
  watermark: boolean;
  watermarkText: string;
  includeQR: boolean;
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  isDefault: boolean;
}

interface NotificationSetting {
  id: string;
  contractTypeId: string;
  eventType: 'إنشاء' | 'اعتماد' | 'رفض' | 'تعديل' | 'انتهاء';
  notifyContractor: boolean;
  notifyClient: boolean;
  notifyOffice: boolean;
  notifyOthers: string[];
  emailTemplate: string;
  smsTemplate: string;
}

const ContractSettings_Advanced_777: React.FC = () => {
  const [activeTab, setActiveTab] = useState('777-01');
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false);
  const [showAddClauseDialog, setShowAddClauseDialog] = useState(false);

  const [contractTypes, setContractTypes] = useState<ContractType[]>([
    {
      id: 'CT001',
      name: 'عقد بناء فلل سكنية',
      code: 'CBV',
      description: 'عقد مقاولة لبناء فلل سكنية',
      category: 'عقود بناء',
      requiresApproval: true,
      approvalWorkflow: 'مختلط',
      approvalLevels: [
        {
          id: 'AL001',
          level: 1,
          approverType: 'مكتب',
          approverRole: 'مدير المشاريع',
          isRequired: true,
          canReject: true,
          timeLimit: 3
        },
        {
          id: 'AL002',
          level: 2,
          approverType: 'عميل',
          approverRole: 'المالك',
          isRequired: true,
          canReject: true,
          timeLimit: 7
        },
        {
          id: 'AL003',
          level: 3,
          approverType: 'مقاول',
          approverRole: 'مدير المقاولات',
          isRequired: true,
          canReject: false,
          timeLimit: 5
        }
      ],
      defaultTerms: 'عقد مقاولة عامة - الدفع على مراحل - ضمان سنتين - تسليم مفتاح',
      isActive: true,
      createdDate: '2024-01-15',
      lastModified: '2025-10-20'
    },
    {
      id: 'CT002',
      name: 'عقد بناء مباني تجارية',
      code: 'CBT',
      description: 'عقد مقاولة لبناء مباني تجارية',
      category: 'عقود بناء',
      requiresApproval: true,
      approvalWorkflow: 'رقمي',
      approvalLevels: [
        {
          id: 'AL004',
          level: 1,
          approverType: 'مكتب',
          approverRole: 'المدير التنفيذي',
          isRequired: true,
          canReject: true,
          timeLimit: 5
        },
        {
          id: 'AL005',
          level: 2,
          approverType: 'جهة حكومية',
          approverRole: 'الأمانة',
          isRequired: true,
          canReject: true,
          timeLimit: 14
        }
      ],
      defaultTerms: 'عقد BOT - تسليم مفتاح - ضمان 5 سنوات',
      isActive: true,
      createdDate: '2024-02-10',
      lastModified: '2025-09-15'
    },
    {
      id: 'CT003',
      name: 'اتفاقية صيانة',
      code: 'AMS',
      description: 'اتفاقية صيانة دورية للمباني',
      category: 'اتفاقيات',
      requiresApproval: false,
      approvalWorkflow: 'يدوي',
      approvalLevels: [],
      defaultTerms: 'اتفاقية صيانة سنوية - دفعات شهرية',
      isActive: true,
      createdDate: '2024-03-05',
      lastModified: '2025-08-22'
    },
    {
      id: 'CT004',
      name: 'عقد استشارات هندسية',
      code: 'CEC',
      description: 'عقد تقديم استشارات هندسية',
      category: 'عقود خدمات',
      requiresApproval: true,
      approvalWorkflow: 'مختلط',
      approvalLevels: [
        {
          id: 'AL006',
          level: 1,
          approverType: 'مكتب',
          approverRole: 'المدير الفني',
          isRequired: true,
          canReject: true,
          timeLimit: 2
        }
      ],
      defaultTerms: 'عقد استشارات - الدفع بعد كل مرحلة',
      isActive: true,
      createdDate: '2024-04-12',
      lastModified: '2025-11-01'
    }
  ]);

  const [contractClauses, setContractClauses] = useState<ContractClause[]>([
    {
      id: 'CC001',
      contractTypeId: 'CT001',
      clauseNumber: '1',
      title: 'التعريفات',
      content: 'في هذا العقد تعني المصطلحات التالية المعاني الموضحة قرين كل منها ما لم يقتضِ السياق خلاف ذلك...',
      isRequired: true,
      isEditable: false,
      order: 1,
      category: 'قانوني'
    },
    {
      id: 'CC002',
      contractTypeId: 'CT001',
      clauseNumber: '2',
      title: 'نطاق العمل',
      content: 'يلتزم المقاول بتنفيذ الأعمال المبينة في المخططات والمواصفات الملحقة بهذا العقد...',
      isRequired: true,
      isEditable: true,
      order: 2,
      category: 'فني'
    },
    {
      id: 'CC003',
      contractTypeId: 'CT001',
      clauseNumber: '3',
      title: 'قيمة العقد وطريقة الدفع',
      content: 'تبلغ قيمة هذا العقد مبلغ [...] ريال سعودي شاملة ضريبة القيمة المضافة، تُدفع على النحو التالي...',
      isRequired: true,
      isEditable: true,
      order: 3,
      category: 'مالي'
    },
    {
      id: 'CC004',
      contractTypeId: 'CT001',
      clauseNumber: '4',
      title: 'مدة التنفيذ',
      content: 'يلتزم المقاول بإنجاز الأعمال خلال [...] يوم من تاريخ الأمر بالمباشرة...',
      isRequired: true,
      isEditable: true,
      order: 4,
      category: 'إداري'
    },
    {
      id: 'CC005',
      contractTypeId: 'CT001',
      clauseNumber: '5',
      title: 'الضمانات',
      content: 'يقدم المقاول ضماناً بنكياً غير مشروط بنسبة 5% من قيمة العقد، كما يلتزم بتقديم ضمان صيانة لمدة سنتين...',
      isRequired: true,
      isEditable: false,
      order: 5,
      category: 'مالي'
    },
    {
      id: 'CC006',
      contractTypeId: 'CT001',
      clauseNumber: '6',
      title: 'الغرامات',
      content: 'في حال تأخر المقاول عن إنجاز الأعمال، يستحق على المقاول غرامة تأخير قدرها 0.1% من قيمة العقد عن كل يوم تأخير...',
      isRequired: true,
      isEditable: true,
      order: 6,
      category: 'قانوني'
    }
  ]);

  const [printTemplates, setPrintTemplates] = useState<PrintTemplate[]>([
    {
      id: 'PT001',
      contractTypeId: 'CT001',
      name: 'قالب عقد البناء الرسمي',
      header: 'شعار المكتب + عنوان المكتب',
      footer: 'جميع الحقوق محفوظة © 2025',
      logo: true,
      watermark: true,
      watermarkText: 'نسخة أصلية',
      includeQR: true,
      pageSize: 'A4',
      orientation: 'portrait',
      isDefault: true
    },
    {
      id: 'PT002',
      contractTypeId: 'CT001',
      name: 'قالب المسودة',
      header: 'مسودة عقد - غير معتمدة',
      footer: 'هذه مسودة للمراجعة فقط',
      logo: false,
      watermark: true,
      watermarkText: 'مسودة - غير معتمدة',
      includeQR: false,
      pageSize: 'A4',
      orientation: 'portrait',
      isDefault: false
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'NS001',
      contractTypeId: 'CT001',
      eventType: 'إنشاء',
      notifyContractor: true,
      notifyClient: true,
      notifyOffice: true,
      notifyOthers: ['manager@office.com'],
      emailTemplate: 'تم إنشاء عقد جديد رقم {contract_number} بتاريخ {date}',
      smsTemplate: 'عقد جديد {contract_number} - {project_name}'
    },
    {
      id: 'NS002',
      contractTypeId: 'CT001',
      eventType: 'اعتماد',
      notifyContractor: true,
      notifyClient: true,
      notifyOffice: true,
      notifyOthers: [],
      emailTemplate: 'تم اعتماد العقد رقم {contract_number} من قبل {approver_name}',
      smsTemplate: 'تم اعتماد العقد {contract_number}'
    },
    {
      id: 'NS003',
      contractTypeId: 'CT001',
      eventType: 'رفض',
      notifyContractor: true,
      notifyClient: true,
      notifyOffice: true,
      notifyOthers: [],
      emailTemplate: 'تم رفض العقد رقم {contract_number}. السبب: {rejection_reason}',
      smsTemplate: 'تم رفض العقد {contract_number}'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'معتمد':
        return '#10b981';
      case 'معلق':
        return '#f59e0b';
      case 'غير نشط':
      case 'ملغي':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '777-01':
        // نظرة عامة
        return (
          <div className="space-y-6">
            {/* هيدر */}
            <div
              style={{
                position: 'sticky',
                top: '0',
                zIndex: 10,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #8b5cf6 100%) 1',
                padding: '0',
                marginBottom: '0',
                marginTop: '0',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)',
                      border: '2px solid rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <Settings 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#8b5cf6',
                        filter: 'drop-shadow(0 1px 2px rgba(139, 92, 246, 0.3))' 
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
                          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        إعدادات العقود المتقدمة
                      </h1>
                      
                      <div
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
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
                          777
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
                      إدارة شاملة لأنواع العقود والبنود والاعتماد والطباعة والإشعارات
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(139, 92, 246, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.15)'
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
                      8 تبويبات متقدمة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <FileSignature className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractTypes.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أنواع العقود
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractTypes.filter(t => t.isActive).length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نشطة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Layers className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractClauses.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    بنود مسبقة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Shield className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractTypes.filter(t => t.requiresApproval).length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تحتاج اعتماد
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Printer className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {printTemplates.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قوالب طباعة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Mail className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {notificationSettings.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إعدادات إشعارات
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Zap className="h-4 w-4 mx-auto text-yellow-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractTypes.filter(t => t.approvalWorkflow === 'رقمي').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اعتماد رقمي
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Lock className="h-4 w-4 mx-auto text-red-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {printTemplates.filter(t => t.watermark).length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    خلفيات حماية
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* ملخص سريع */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أنواع العقود حسب الفئة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {['عقود بناء', 'عقود تجارية', 'اتفاقيات', 'عقود خدمات'].map((category) => {
                      const count = contractTypes.filter(t => t.category === category).length;
                      return (
                        <div key={category} className="flex justify-between items-center p-2 border rounded">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    أنواع الاعتماد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {['يدوي', 'رقمي', 'مختلط'].map((workflow) => {
                      const count = contractTypes.filter(t => t.approvalWorkflow === workflow).length;
                      return (
                        <div key={workflow} className="flex justify-between items-center p-2 border rounded">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{workflow}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '777-02':
        // أنواع العقود
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة نوع عقد جديد
                </CardTitle>
                <Button 
                  onClick={() => setShowAddTypeDialog(true)}
                  style={{ fontFamily: 'Tajawal, sans-serif', background: '#8b5cf6' }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة نوع
                </Button>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  أنواع العقود المسجلة ({contractTypes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>يحتاج اعتماد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الاعتماد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستويات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline" className="font-mono">{type.code}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold">
                          {type.name}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{type.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {type.requiresApproval ? (
                            <Badge style={{ backgroundColor: '#f59e0b', color: 'white' }}>نعم</Badge>
                          ) : (
                            <Badge variant="outline">لا</Badge>
                          )}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{type.approvalWorkflow}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{type.approvalLevels.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: getStatusColor(type.isActive ? 'نشط' : 'غير نشط'), color: 'white' }}>
                            {type.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Copy className="h-3 w-3" />
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

      case '777-03':
        // البنود المسبقة
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    البنود المسبقة للعقود
                  </CardTitle>
                  <Button 
                    onClick={() => setShowAddClauseDialog(true)}
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#8b5cf6' }}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة بند
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contractTypes.map((type) => {
                    const typeClauses = contractClauses.filter(c => c.contractTypeId === type.id);
                    if (typeClauses.length === 0) return null;
                    
                    return (
                      <Card key={type.id} className="border-2">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className="font-mono">{type.code}</Badge>
                            {type.name}
                            <Badge variant="outline">{typeClauses.length} بند</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {typeClauses.map((clause) => (
                              <div key={clause.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono">{clause.clauseNumber}</Badge>
                                    <span className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {clause.title}
                                    </span>
                                    <Badge variant="outline" className="text-[10px]">{clause.category}</Badge>
                                  </div>
                                  <div className="flex gap-1">
                                    {clause.isRequired && (
                                      <Badge style={{ backgroundColor: '#ef4444', color: 'white' }} className="text-[10px]">
                                        إلزامي
                                      </Badge>
                                    )}
                                    {clause.isEditable && (
                                      <Badge style={{ backgroundColor: '#10b981', color: 'white' }} className="text-[10px]">
                                        قابل للتعديل
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {clause.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-04':
        // إعدادات الاعتماد
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مستويات الاعتماد لكل نوع عقد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contractTypes.filter(t => t.requiresApproval).map((type) => (
                    <Card key={type.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <FileSignature className="h-4 w-4 text-purple-600" />
                          {type.name}
                          <Badge variant="outline">{type.approvalWorkflow}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {type.approvalLevels.length > 0 ? (
                          <div className="space-y-2">
                            {type.approvalLevels.map((level) => (
                              <div key={level.id} className="p-3 border rounded-lg bg-gray-50">
                                <div className="grid grid-cols-6 gap-3 text-xs">
                                  <div>
                                    <p className="text-gray-500">المستوى</p>
                                    <Badge className="font-bold">{level.level}</Badge>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">نوع المعتمد</p>
                                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {level.approverType}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">الدور</p>
                                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {level.approverRole}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">إلزامي</p>
                                    {level.isRequired ? (
                                      <Badge style={{ backgroundColor: '#ef4444', color: 'white' }}>نعم</Badge>
                                    ) : (
                                      <Badge variant="outline">لا</Badge>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-gray-500">يمكنه الرفض</p>
                                    {level.canReject ? (
                                      <Badge style={{ backgroundColor: '#f59e0b', color: 'white' }}>نعم</Badge>
                                    ) : (
                                      <Badge variant="outline">لا</Badge>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-gray-500">المهلة</p>
                                    <p className="font-bold text-orange-600">{level.timeLimit} يوم</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            لا توجد مستويات اعتماد محددة
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-05':
        // قوالب الطباعة
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قوالب الطباعة الاحترافية
                  </CardTitle>
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#8b5cf6' }}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة قالب
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {printTemplates.map((template) => (
                    <Card key={template.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Printer className="h-4 w-4 text-cyan-600" />
                              <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {template.name}
                              </h3>
                              {template.isDefault && (
                                <Badge style={{ backgroundColor: '#10b981', color: 'white' }}>افتراضي</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {contractTypes.find(t => t.id === template.contractTypeId)?.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 ml-1" />
                              معاينة
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 ml-1" />
                              تعديل
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500">حجم الصفحة</p>
                            <Badge variant="outline">{template.pageSize}</Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">الاتجاه</p>
                            <Badge variant="outline">
                              {template.orientation === 'portrait' ? 'عمودي' : 'أفقي'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-500">الشعار</p>
                            {template.logo ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500">علامة مائية</p>
                            {template.watermark ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-500">رمز QR</p>
                            {template.includeQR ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {template.watermark && (
                          <div className="mt-3 p-2 bg-purple-50 rounded text-xs">
                            <div className="flex items-center gap-2">
                              <Lock className="h-3 w-3 text-purple-600" />
                              <span className="text-purple-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                نص العلامة المائية: {template.watermarkText}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '777-06':
        // إعدادات الإشعارات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات الإشعارات للأطراف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notificationSettings.map((setting) => (
                    <Card key={setting.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Mail className="h-5 w-5 text-indigo-600" />
                          <div>
                            <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {setting.eventType}
                            </h3>
                            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {contractTypes.find(t => t.id === setting.contractTypeId)?.name}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                          <div className="flex items-center gap-2">
                            {setting.notifyContractor ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعار المقاول</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {setting.notifyClient ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعار العميل</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {setting.notifyOffice ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعار المكتب</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>قالب البريد:</strong> {setting.emailTemplate}
                            </p>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <p className="text-xs text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>قالب SMS:</strong> {setting.smsTemplate}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
    </div>
  );
};

export default ContractSettings_Advanced_777;
