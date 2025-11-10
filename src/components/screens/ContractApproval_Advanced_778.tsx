import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  FileCheck, CheckCircle, XCircle, Clock, AlertCircle, Users,
  Shield, FileSignature, Eye, Printer, Send, Mail, MessageSquare,
  Lock, Unlock, RefreshCw, Edit, Download, Upload, Save, Ban,
  UserCheck, FileText, Layers, Settings, Layout, BarChart3
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

const TABS_CONFIG: TabConfig[] = [
  { id: '778-01', number: '778-01', title: 'نظرة عامة', icon: Layout },
  { id: '778-02', number: '778-02', title: 'العقود المعلقة', icon: Clock },
  { id: '778-03', number: '778-03', title: 'طلبات الاعتماد', icon: FileCheck },
  { id: '778-04', number: '778-04', title: 'الاعتماد اليدوي', icon: Edit },
  { id: '778-05', number: '778-05', title: 'الاعتماد الرقمي', icon: Shield },
  { id: '778-06', number: '778-06', title: 'اعتماد الأطراف', icon: Users },
  { id: '778-07', number: '778-07', title: 'اعتماد المكتب', icon: FileSignature },
  { id: '778-08', number: '778-08', title: 'العقود المعتمدة', icon: CheckCircle },
  { id: '778-09', number: '778-09', title: 'العقود المرفوضة', icon: XCircle },
  { id: '778-10', number: '778-10', title: 'سجل الاعتمادات', icon: FileText },
  { id: '778-11', number: '778-11', title: 'الإشعارات', icon: Mail },
  { id: '778-12', number: '778-12', title: 'التقارير', icon: BarChart3 },
];

interface ApprovalRequest {
  id: string;
  contractId: string;
  contractType: string;
  contractorName: string;
  projectName: string;
  value: number;
  requestDate: string;
  currentLevel: number;
  totalLevels: number;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  approvalWorkflow: 'manual' | 'digital' | 'hybrid';
  requiredApprovers: Approver[];
  completedApprovals: CompletedApproval[];
  daysRemaining: number;
  priority: 'عادي' | 'عاجل' | 'ضروري جداً';
}

interface Approver {
  id: string;
  level: number;
  type: 'مكتب' | 'مقاول' | 'عميل' | 'جهة حكومية';
  name: string;
  role: string;
  status: 'waiting' | 'approved' | 'rejected' | 'in-progress';
  deadline: string;
  canReject: boolean;
  isRequired: boolean;
}

interface CompletedApproval {
  id: string;
  approverName: string;
  approverType: string;
  approvalDate: string;
  action: 'approved' | 'rejected';
  comments: string;
  signature?: string;
  ipAddress: string;
}

interface ContractApprovalLog {
  id: string;
  contractId: string;
  contractType: string;
  action: 'created' | 'approved' | 'rejected' | 'modified' | 'sent';
  performedBy: string;
  performedDate: string;
  details: string;
  level?: number;
  comments?: string;
}

const ContractApproval_Advanced_778: React.FC = () => {
  const [activeTab, setActiveTab] = useState('778-01');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    {
      id: 'REQ001',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      value: 5000000,
      requestDate: '2025-11-01',
      currentLevel: 1,
      totalLevels: 3,
      status: 'in-progress',
      approvalWorkflow: 'hybrid',
      requiredApprovers: [
        {
          id: 'AP001',
          level: 1,
          type: 'مكتب',
          name: 'م. سعد العمري',
          role: 'مدير المشاريع',
          status: 'in-progress',
          deadline: '2025-11-04',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP002',
          level: 2,
          type: 'عميل',
          name: 'عبدالله بن محمد العتيبي',
          role: 'المالك',
          status: 'waiting',
          deadline: '2025-11-08',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP003',
          level: 3,
          type: 'مقاول',
          name: 'م. أحمد محمد السعيد',
          role: 'مدير المقاولات',
          status: 'waiting',
          deadline: '2025-11-13',
          canReject: false,
          isRequired: true
        }
      ],
      completedApprovals: [],
      daysRemaining: 3,
      priority: 'عاجل'
    },
    {
      id: 'REQ002',
      contractId: 'CONT002',
      contractType: 'عقد بناء مباني تجارية',
      contractorName: 'العتيبي للمقاولات العامة',
      projectName: 'مشروع برج النخيل التجاري',
      value: 15000000,
      requestDate: '2025-10-28',
      currentLevel: 1,
      totalLevels: 2,
      status: 'pending',
      approvalWorkflow: 'digital',
      requiredApprovers: [
        {
          id: 'AP004',
          level: 1,
          type: 'مكتب',
          name: 'م. خالد الغامدي',
          role: 'المدير التنفيذي',
          status: 'waiting',
          deadline: '2025-11-02',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP005',
          level: 2,
          type: 'جهة حكومية',
          name: 'أمانة الرياض',
          role: 'إدارة التراخيص',
          status: 'waiting',
          deadline: '2025-11-11',
          canReject: true,
          isRequired: true
        }
      ],
      completedApprovals: [],
      daysRemaining: 1,
      priority: 'ضروري جداً'
    },
    {
      id: 'REQ003',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      projectName: 'مشروع مجمع الورود السكني',
      value: 8000000,
      requestDate: '2025-10-25',
      currentLevel: 3,
      totalLevels: 3,
      status: 'approved',
      approvalWorkflow: 'manual',
      requiredApprovers: [
        {
          id: 'AP006',
          level: 1,
          type: 'مكتب',
          name: 'م. أحمد الغامدي',
          role: 'نائب المدير',
          status: 'approved',
          deadline: '2025-10-27',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP007',
          level: 2,
          type: 'عميل',
          name: 'فهد بن سعود القحطاني',
          role: 'المالك',
          status: 'approved',
          deadline: '2025-10-29',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP008',
          level: 3,
          type: 'مقاول',
          name: 'م. خالد عبدالله الخالدي',
          role: 'مدير المؤسسة',
          status: 'approved',
          deadline: '2025-11-01',
          canReject: false,
          isRequired: true
        }
      ],
      completedApprovals: [
        {
          id: 'CA001',
          approverName: 'م. أحمد الغامدي',
          approverType: 'مكتب - نائب المدير',
          approvalDate: '2025-10-26 10:30',
          action: 'approved',
          comments: 'تم المراجعة والاعتماد. العقد مطابق للمواصفات.',
          signature: 'DIGITAL-SIGN-001',
          ipAddress: '192.168.1.10'
        },
        {
          id: 'CA002',
          approverName: 'فهد بن سعود القحطاني',
          approverType: 'عميل - المالك',
          approvalDate: '2025-10-28 14:15',
          action: 'approved',
          comments: 'موافق على العقد والشروط.',
          signature: 'MANUAL-SIGN-001',
          ipAddress: '192.168.1.25'
        },
        {
          id: 'CA003',
          approverName: 'م. خالد عبدالله الخالدي',
          approverType: 'مقاول - مدير المؤسسة',
          approvalDate: '2025-10-31 09:00',
          action: 'approved',
          comments: 'نوافق على شروط العقد ونلتزم بالتنفيذ.',
          signature: 'DIGITAL-SIGN-002',
          ipAddress: '192.168.1.50'
        }
      ],
      daysRemaining: 0,
      priority: 'عادي'
    }
  ]);

  const [approvalLogs, setApprovalLogs] = useState<ContractApprovalLog[]>([
    {
      id: 'LOG001',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      action: 'created',
      performedBy: 'م. سعد العمري',
      performedDate: '2025-11-01 09:00',
      details: 'تم إنشاء طلب اعتماد جديد',
      level: 1
    },
    {
      id: 'LOG002',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      action: 'sent',
      performedBy: 'النظام',
      performedDate: '2025-11-01 09:05',
      details: 'تم إرسال إشعار لـ م. سعد العمري (مدير المشاريع)',
      level: 1
    },
    {
      id: 'LOG003',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      action: 'approved',
      performedBy: 'م. أحمد الغامدي',
      performedDate: '2025-10-26 10:30',
      details: 'تم اعتماد العقد من المستوى الأول',
      level: 1,
      comments: 'تم المراجعة والاعتماد. العقد مطابق للمواصفات.'
    },
    {
      id: 'LOG004',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      action: 'sent',
      performedBy: 'النظام',
      performedDate: '2025-10-26 10:32',
      details: 'تم إرسال إشعار لـ فهد بن سعود القحطاني (المالك)',
      level: 2
    },
    {
      id: 'LOG005',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      action: 'approved',
      performedBy: 'فهد بن سعود القحطاني',
      performedDate: '2025-10-28 14:15',
      details: 'تم اعتماد العقد من المستوى الثاني',
      level: 2,
      comments: 'موافق على العقد والشروط.'
    },
    {
      id: 'LOG006',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      action: 'sent',
      performedBy: 'النظام',
      performedDate: '2025-10-28 14:17',
      details: 'تم إرسال إشعار لـ م. خالد عبدالله الخالدي (مدير المؤسسة)',
      level: 3
    },
    {
      id: 'LOG007',
      contractId: 'CONT003',
      contractType: 'اتفاقية صيانة',
      action: 'approved',
      performedBy: 'م. خالد عبدالله الخالدي',
      performedDate: '2025-10-31 09:00',
      details: 'تم اعتماد العقد النهائي من جميع المستويات',
      level: 3,
      comments: 'نوافق على شروط العقد ونلتزم بالتنفيذ.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'معتمد':
        return '#10b981';
      case 'pending':
      case 'waiting':
      case 'بانتظار':
        return '#f59e0b';
      case 'rejected':
      case 'مرفوض':
        return '#ef4444';
      case 'in-progress':
      case 'قيد المعالجة':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عادي':
        return '#10b981';
      case 'عاجل':
        return '#f59e0b';
      case 'ضروري جداً':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleApprove = (requestId: string) => {
    setApprovalRequests(approvalRequests.map(req => {
      if (req.id === requestId) {
        const updatedApprovers = req.requiredApprovers.map(app => {
          if (app.level === req.currentLevel && app.status === 'in-progress') {
            return { ...app, status: 'approved' as const };
          }
          return app;
        });
        
        const newLevel = req.currentLevel + 1;
        const isComplete = newLevel > req.totalLevels;
        
        return {
          ...req,
          currentLevel: isComplete ? req.currentLevel : newLevel,
          status: isComplete ? 'approved' as const : 'in-progress' as const,
          requiredApprovers: updatedApprovers.map(app => {
            if (app.level === newLevel) {
              return { ...app, status: 'in-progress' as const };
            }
            return app;
          })
        };
      }
      return req;
    }));
    
    toast.success('تم اعتماد العقد بنجاح');
    setShowApprovalDialog(false);
  };

  const handleReject = (requestId: string, reason: string) => {
    setApprovalRequests(approvalRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'rejected' as const,
          requiredApprovers: req.requiredApprovers.map(app => {
            if (app.level === req.currentLevel) {
              return { ...app, status: 'rejected' as const };
            }
            return app;
          })
        };
      }
      return req;
    }));
    
    toast.error(`تم رفض العقد: ${reason}`);
    setShowRejectDialog(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '778-01':
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
                borderImage: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%) 1',
                padding: '0',
                marginBottom: '0',
                marginTop: '0',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(5, 150, 105, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                      border: '2px solid rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <FileCheck 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#10b981',
                        filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' 
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
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        اعتماد العقود المتقدم
                      </h1>
                      
                      <div
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
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
                          778
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
                      نظام شامل لاعتماد العقود يدوياً ورقمياً من جميع الأطراف
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.15)'
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
                      12 تبويب شامل
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Clock className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.status === 'pending' || r.status === 'in-progress').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قيد الاعتماد
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.status === 'approved').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معتمدة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <XCircle className="h-4 w-4 mx-auto text-red-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.status === 'rejected').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مرفوضة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <AlertCircle className="h-4 w-4 mx-auto text-red-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.daysRemaining <= 2 && r.status !== 'approved').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متأخرة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Edit className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.approvalWorkflow === 'manual').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    يدوي
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Shield className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.approvalWorkflow === 'digital').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    رقمي
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Layers className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalRequests.filter(r => r.approvalWorkflow === 'hybrid').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مختلط
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <FileText className="h-4 w-4 mx-auto text-indigo-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {approvalLogs.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    سجلات
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول طلبات الاعتماد */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  جميع طلبات الاعتماد ({approvalRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العقد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-mono">
                          {request.contractId}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {request.contractType}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {request.contractorName}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {request.projectName}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold text-green-600">
                          {(request.value / 1000000).toFixed(1)}م ر.س
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">
                            {request.currentLevel}/{request.totalLevels}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{request.approvalWorkflow}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getPriorityColor(request.priority), color: 'white' }}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(request.status), color: 'white' }}>
                            {request.status === 'pending' ? 'بانتظار' : 
                             request.status === 'in-progress' ? 'قيد المعالجة' :
                             request.status === 'approved' ? 'معتمد' : 'مرفوض'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {request.status === 'in-progress' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  style={{ backgroundColor: '#10b981', color: 'white' }}
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowApprovalDialog(true);
                                  }}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              <Printer className="h-3 w-3" />
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

      case '778-10':
        // سجل الاعتمادات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل جميع الاعتمادات ({approvalLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>بواسطة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-xs">
                          {log.performedDate}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-mono text-xs">
                          {log.contractId}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-xs">
                          {log.contractType}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline" className="text-[10px]">
                            {log.action === 'created' ? 'إنشاء' :
                             log.action === 'approved' ? 'اعتماد' :
                             log.action === 'rejected' ? 'رفض' :
                             log.action === 'sent' ? 'إرسال' : 'تعديل'}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-xs">
                          {log.performedBy}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {log.level && (
                            <Badge variant="outline" className="text-[10px]">
                              المستوى {log.level}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-xs">
                          {log.details}
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

      {/* Dialog تفاصيل الطلب */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل طلب الاعتماد - {selectedRequest?.contractId}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معلومات العقد</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">نوع العقد</p>
                    <p className="font-bold">{selectedRequest.contractType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">المقاول</p>
                    <p className="font-bold">{selectedRequest.contractorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">المشروع</p>
                    <p>{selectedRequest.projectName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">القيمة</p>
                    <p className="font-bold text-green-600">
                      {(selectedRequest.value / 1000000).toFixed(1)} مليون ر.س
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">مستويات الاعتماد ({selectedRequest.totalLevels})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedRequest.requiredApprovers.map((approver) => (
                    <div key={approver.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>المستوى {approver.level}</Badge>
                            <Badge variant="outline">{approver.type}</Badge>
                          </div>
                          <p className="font-bold text-sm">{approver.name}</p>
                          <p className="text-xs text-gray-600">{approver.role}</p>
                          <p className="text-xs text-gray-500">الموعد النهائي: {approver.deadline}</p>
                        </div>
                        <Badge style={{ backgroundColor: getStatusColor(approver.status), color: 'white' }}>
                          {approver.status === 'waiting' ? 'بانتظار' :
                           approver.status === 'in-progress' ? 'قيد المعالجة' :
                           approver.status === 'approved' ? 'معتمد' : 'مرفوض'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {selectedRequest.completedApprovals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الاعتمادات المكتملة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedRequest.completedApprovals.map((approval) => (
                      <div key={approval.id} className="p-3 border rounded-lg bg-green-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-sm">{approval.approverName}</p>
                            <p className="text-xs text-gray-600">{approval.approverType}</p>
                          </div>
                          <Badge style={{ backgroundColor: '#10b981', color: 'white' }}>
                            معتمد
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">التاريخ: {approval.approvalDate}</p>
                        {approval.comments && (
                          <p className="text-xs bg-white p-2 rounded">{approval.comments}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog الاعتماد */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اعتماد العقد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <p>هل أنت متأكد من اعتماد هذا العقد؟</p>
            <TextAreaWithCopy
              label="ملاحظات (اختياري)"
              id="approval-notes"
              rows={3}
              placeholder="أضف ملاحظاتك..."
              copyable={true}
              clearable={true}
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => selectedRequest && handleApprove(selectedRequest.id)}
              style={{ background: '#10b981' }}
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              اعتماد
            </Button>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog الرفض */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              رفض العقد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <p className="text-red-600">يرجى تحديد سبب الرفض:</p>
            <TextAreaWithCopy
              label="سبب الرفض *"
              id="rejection-reason"
              rows={4}
              placeholder="أدخل سبب الرفض..."
              copyable={true}
              clearable={true}
              required
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => selectedRequest && handleReject(selectedRequest.id, 'سبب الرفض')}
              style={{ background: '#ef4444' }}
            >
              <XCircle className="h-4 w-4 ml-2" />
              رفض
            </Button>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractApproval_Advanced_778;
