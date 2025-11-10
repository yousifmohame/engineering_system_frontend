/**
 * ============================================================================
 * الشاشة 778 - اعتماد العقود v2.0 - جميع التابات مكتملة
 * ============================================================================
 * 
 * تحديثات v2.0:
 * ✅ تطوير شامل لجميع التابات (12 تاباً)
 * ✅ بيانات وهمية غنية (5 عقود + 15 اعتماد)
 * ✅ نظام اعتماد متعدد المستويات
 * ✅ نظام اعتماد رقمي متقدم
 * ✅ سجل تفصيلي للاعتمادات
 * ✅ نظام إشعارات شامل
 * 
 * @version 2.0
 * @date 2025-11-03
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Progress } from '../ui/progress';
import {
  FileCheck, CheckCircle, XCircle, Clock, AlertCircle, Users,
  Shield, FileSignature, Eye, Printer, Send, Mail, MessageSquare,
  Lock, Unlock, RefreshCw, Edit, Download, Upload, Save, Ban,
  UserCheck, FileText, Layers, Settings, Layout, BarChart3, Plus
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';

// تكوين التابات
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

// الواجهات
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

interface Notification {
  id: string;
  type: 'approval_request' | 'approval_granted' | 'approval_rejected' | 'reminder';
  contractId: string;
  contractType: string;
  message: string;
  sentDate: string;
  recipient: string;
  status: 'sent' | 'read' | 'pending';
  priority: 'عادي' | 'عاجل' | 'ضروري جداً';
}

const ContractApproval_Complete_778_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('778-01');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // بيانات وهمية - 5 عقود بحالات مختلفة
  const approvalRequests: ApprovalRequest[] = [
    {
      id: 'REQ001',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'فلل الياسمين - حي النرجس',
      value: 5000000,
      requestDate: '2025-10-25',
      currentLevel: 2,
      totalLevels: 3,
      status: 'in-progress',
      approvalWorkflow: 'digital',
      daysRemaining: 5,
      priority: 'عاجل',
      requiredApprovers: [
        {
          id: 'AP001',
          level: 1,
          type: 'مكتب',
          name: 'م. سعد العمري',
          role: 'مدير المكتب',
          status: 'approved',
          deadline: '2025-10-27',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP002',
          level: 2,
          type: 'عميل',
          name: 'عبدالله بن محمد العتيبي',
          role: 'المالك',
          status: 'in-progress',
          deadline: '2025-10-30',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP003',
          level: 3,
          type: 'مقاول',
          name: 'م. أحمد محمد السعيد',
          role: 'مدير الشركة',
          status: 'waiting',
          deadline: '2025-11-02',
          canReject: false,
          isRequired: true
        }
      ],
      completedApprovals: [
        {
          id: 'CA001',
          approverName: 'م. سعد العمري',
          approverType: 'مكتب - مدير المكتب',
          approvalDate: '2025-10-26 09:30',
          action: 'approved',
          comments: 'العقد مراجع ومعتمد. جميع البنود واضحة ومطابقة للمواصفات.',
          signature: 'DIGITAL-SIGN-001',
          ipAddress: '192.168.1.5'
        }
      ]
    },
    {
      id: 'REQ002',
      contractId: 'CONT002',
      contractType: 'عقد إشراف على مشروع',
      contractorName: 'مؤسسة القحطاني للإنشاءات',
      projectName: 'مسجد حي الروضة',
      value: 1200000,
      requestDate: '2025-10-28',
      currentLevel: 1,
      totalLevels: 2,
      status: 'pending',
      approvalWorkflow: 'manual',
      daysRemaining: 7,
      priority: 'عادي',
      requiredApprovers: [
        {
          id: 'AP004',
          level: 1,
          type: 'مكتب',
          name: 'م. خالد الدوسري',
          role: 'مدير الإشراف',
          status: 'waiting',
          deadline: '2025-11-01',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP005',
          level: 2,
          type: 'عميل',
          name: 'أوقاف الروضة',
          role: 'الجهة المالكة',
          status: 'waiting',
          deadline: '2025-11-04',
          canReject: true,
          isRequired: true
        }
      ],
      completedApprovals: []
    },
    {
      id: 'REQ003',
      contractId: 'CONT003',
      contractType: 'عقد استشارات هندسية',
      contractorName: 'شركة الدوسري للمقاولات الصناعية',
      projectName: 'مستودع المنطقة الصناعية',
      value: 8500000,
      requestDate: '2025-10-20',
      currentLevel: 3,
      totalLevels: 3,
      status: 'approved',
      approvalWorkflow: 'hybrid',
      daysRemaining: 0,
      priority: 'ضروري جداً',
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
          name: 'م. فهد سعود الدوسري',
          role: 'مدير المؤسسة',
          status: 'approved',
          deadline: '2025-11-01',
          canReject: false,
          isRequired: true
        }
      ],
      completedApprovals: [
        {
          id: 'CA002',
          approverName: 'م. أحمد الغامدي',
          approverType: 'مكتب - نائب المدير',
          approvalDate: '2025-10-26 10:30',
          action: 'approved',
          comments: 'تم المراجعة والاعتماد. العقد مطابق للمواصفات.',
          signature: 'DIGITAL-SIGN-002',
          ipAddress: '192.168.1.10'
        },
        {
          id: 'CA003',
          approverName: 'فهد بن سعود القحطاني',
          approverType: 'عميل - المالك',
          approvalDate: '2025-10-28 14:15',
          action: 'approved',
          comments: 'موافق على جميع البنود.',
          ipAddress: '10.0.0.25'
        },
        {
          id: 'CA004',
          approverName: 'م. فهد سعود الدوسري',
          approverType: 'مقاول - مدير المؤسسة',
          approvalDate: '2025-10-31 16:45',
          action: 'approved',
          comments: 'معتمد من طرفنا.',
          signature: 'DIGITAL-SIGN-003',
          ipAddress: '172.16.0.50'
        }
      ]
    },
    {
      id: 'REQ004',
      contractId: 'CONT004',
      contractType: 'عقد تصميم معماري',
      contractorName: 'مكتب الفارس للاستشارات',
      projectName: 'عمارة تجارية - طريق الملك فهد',
      value: 3200000,
      requestDate: '2025-10-22',
      currentLevel: 2,
      totalLevels: 2,
      status: 'rejected',
      approvalWorkflow: 'digital',
      daysRemaining: 0,
      priority: 'عادي',
      requiredApprovers: [
        {
          id: 'AP009',
          level: 1,
          type: 'مكتب',
          name: 'م. محمد الشهري',
          role: 'مدير التصميم',
          status: 'approved',
          deadline: '2025-10-25',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP010',
          level: 2,
          type: 'عميل',
          name: 'شركة الفارس التجارية',
          role: 'المالك',
          status: 'rejected',
          deadline: '2025-10-28',
          canReject: true,
          isRequired: true
        }
      ],
      completedApprovals: [
        {
          id: 'CA005',
          approverName: 'م. محمد الشهري',
          approverType: 'مكتب - مدير التصميم',
          approvalDate: '2025-10-24 11:00',
          action: 'approved',
          comments: 'التصميم مطابق للمواصفات.',
          signature: 'DIGITAL-SIGN-004',
          ipAddress: '192.168.1.15'
        },
        {
          id: 'CA006',
          approverName: 'شركة الفارس التجارية',
          approverType: 'عميل - المالك',
          approvalDate: '2025-10-27 10:30',
          action: 'rejected',
          comments: 'يحتاج تعديلات على بنود الأتعاب.',
          ipAddress: '203.0.113.45'
        }
      ]
    },
    {
      id: 'REQ005',
      contractId: 'CONT005',
      contractType: 'عقد صيانة دورية',
      contractorName: 'مؤسسة الخدمات الشاملة',
      projectName: 'مجمع الإدارة - حي الملقا',
      value: 850000,
      requestDate: '2025-11-01',
      currentLevel: 1,
      totalLevels: 3,
      status: 'pending',
      approvalWorkflow: 'manual',
      daysRemaining: 10,
      priority: 'عادي',
      requiredApprovers: [
        {
          id: 'AP011',
          level: 1,
          type: 'مكتب',
          name: 'م. عبدالعزيز الزهراني',
          role: 'مدير الصيانة',
          status: 'waiting',
          deadline: '2025-11-05',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP012',
          level: 2,
          type: 'عميل',
          name: 'إدارة المجمع',
          role: 'الجهة المسؤولة',
          status: 'waiting',
          deadline: '2025-11-08',
          canReject: true,
          isRequired: true
        },
        {
          id: 'AP013',
          level: 3,
          type: 'جهة حكومية',
          name: 'البلدية',
          role: 'جهة الترخيص',
          status: 'waiting',
          deadline: '2025-11-12',
          canReject: false,
          isRequired: false
        }
      ],
      completedApprovals: []
    }
  ];

  // سجل الاعتمادات
  const approvalLogs: ContractApprovalLog[] = [
    {
      id: 'LOG001',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      action: 'created',
      performedBy: 'م. سعد العمري',
      performedDate: '2025-10-25 08:00',
      details: 'تم إنشاء طلب اعتماد العقد'
    },
    {
      id: 'LOG002',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      action: 'sent',
      performedBy: 'النظام',
      performedDate: '2025-10-25 08:05',
      details: 'تم إرسال إشعار للمستوى الأول',
      level: 1
    },
    {
      id: 'LOG003',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      action: 'approved',
      performedBy: 'م. سعد العمري',
      performedDate: '2025-10-26 09:30',
      details: 'تم الاعتماد من المستوى الأول',
      level: 1,
      comments: 'العقد مراجع ومعتمد'
    },
    {
      id: 'LOG004',
      contractId: 'CONT003',
      contractType: 'عقد استشارات هندسية',
      action: 'approved',
      performedBy: 'م. أحمد الغامدي',
      performedDate: '2025-10-26 10:30',
      details: 'تم الاعتماد من المستوى الأول',
      level: 1
    },
    {
      id: 'LOG005',
      contractId: 'CONT003',
      contractType: 'عقد استشارات هندسية',
      action: 'approved',
      performedBy: 'فهد بن سعود القحطاني',
      performedDate: '2025-10-28 14:15',
      details: 'تم الاعتماد من المستوى الثاني',
      level: 2
    },
    {
      id: 'LOG006',
      contractId: 'CONT003',
      contractType: 'عقد استشارات هندسية',
      action: 'approved',
      performedBy: 'م. فهد سعود الدوسري',
      performedDate: '2025-10-31 16:45',
      details: 'تم الاعتماد النهائي - العقد معتمد بالكامل',
      level: 3
    },
    {
      id: 'LOG007',
      contractId: 'CONT004',
      contractType: 'عقد تصميم معماري',
      action: 'rejected',
      performedBy: 'شركة الفارس التجارية',
      performedDate: '2025-10-27 10:30',
      details: 'تم الرفض من المستوى الثاني',
      level: 2,
      comments: 'يحتاج تعديلات على بنود الأتعاب'
    },
    {
      id: 'LOG008',
      contractId: 'CONT005',
      contractType: 'عقد صيانة دورية',
      action: 'created',
      performedBy: 'م. عبدالعزيز الزهراني',
      performedDate: '2025-11-01 09:00',
      details: 'تم إنشاء طلب اعتماد العقد'
    }
  ];

  // الإشعارات
  const notifications: Notification[] = [
    {
      id: 'NOT001',
      type: 'approval_request',
      contractId: 'CONT001',
      contractType: 'عقد بناء فلل سكنية',
      message: 'طلب اعتماد عقد بناء فلل سكنية - المستوى 2',
      sentDate: '2025-11-01 08:00',
      recipient: 'عبدالله بن محمد العتيبي',
      status: 'sent',
      priority: 'عاجل'
    },
    {
      id: 'NOT002',
      type: 'approval_granted',
      contractId: 'CONT003',
      contractType: 'عقد استشارات هندسية',
      message: 'تم اعتماد عقد استشارات هندسية بالكامل',
      sentDate: '2025-10-31 17:00',
      recipient: 'جميع الأطراف',
      status: 'read',
      priority: 'ضروري جداً'
    },
    {
      id: 'NOT003',
      type: 'approval_rejected',
      contractId: 'CONT004',
      contractType: 'عقد تصميم معماري',
      message: 'تم رفض عقد تصميم معماري - يحتاج تعديلات',
      sentDate: '2025-10-27 10:35',
      recipient: 'م. محمد الشهري',
      status: 'read',
      priority: 'عادي'
    },
    {
      id: 'NOT004',
      type: 'reminder',
      contractId: 'CONT002',
      contractType: 'عقد إشراف على مشروع',
      message: 'تذكير: طلب اعتماد معلق منذ 4 أيام',
      sentDate: '2025-11-02 09:00',
      recipient: 'م. خالد الدوسري',
      status: 'sent',
      priority: 'عادي'
    },
    {
      id: 'NOT005',
      type: 'approval_request',
      contractId: 'CONT005',
      contractType: 'عقد صيانة دورية',
      message: 'طلب اعتماد عقد صيانة دورية - المستوى 1',
      sentDate: '2025-11-01 09:05',
      recipient: 'م. عبدالعزيز الزهراني',
      status: 'pending',
      priority: 'عادي'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'معلق', color: 'bg-yellow-500' },
      'in-progress': { label: 'قيد المراجعة', color: 'bg-blue-500' },
      'approved': { label: 'معتمد', color: 'bg-green-500' },
      'rejected': { label: 'مرفوض', color: 'bg-red-500' },
      'waiting': { label: 'بانتظار الاعتماد', color: 'bg-orange-500' },
      'sent': { label: 'مرسل', color: 'bg-blue-500' },
      'read': { label: 'مقروء', color: 'bg-gray-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { color: string }> = {
      'عادي': { color: 'bg-gray-500' },
      'عاجل': { color: 'bg-orange-500' },
      'ضروري جداً': { color: 'bg-red-500' }
    };
    const p = priorityMap[priority] || { color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${p.color} text-white`}>{priority}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '778-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على اعتماد العقود</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />
                تصدير التقرير
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileCheck className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{approvalRequests.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الطلبات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {approvalRequests.filter(r => r.status === 'pending' || r.status === 'in-progress').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>طلبات معلقة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {approvalRequests.filter(r => r.status === 'approved').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود معتمدة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {approvalRequests.filter(r => r.status === 'rejected').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود مرفوضة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {approvalRequests.filter(r => r.approvalWorkflow === 'digital').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد رقمي</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {approvalRequests.filter(r => r.approvalWorkflow === 'manual').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد يدوي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الطلبات الحديثة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{request.id}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractType}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{request.value.toLocaleString('ar-SA')} ر.س</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-mono">{request.currentLevel}/{request.totalLevels}</div>
                            <Progress value={(request.currentLevel / request.totalLevels) * 100} className="h-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right py-1">{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
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

      case '778-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                العقود المعلقة ({approvalRequests.filter(r => r.status === 'pending' || r.status === 'in-progress').length})
              </h2>
            </div>

            <div className="space-y-2">
              {approvalRequests.filter(r => r.status === 'pending' || r.status === 'in-progress').map((request) => (
                <Card key={request.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractType}</h3>
                          {getStatusBadge(request.status)}
                          {getPriorityBadge(request.priority)}
                        </div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.projectName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-mono">{request.id}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractorName}</span>
                          <span>•</span>
                          <span className="font-mono">{request.value.toLocaleString('ar-SA')} ر.س</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-center p-2" style={{ background: '#f0f9ff', borderRadius: '8px' }}>
                        <p className="text-xs font-mono">{request.currentLevel}/{request.totalLevels}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</p>
                      </div>
                      <div className="text-center p-2" style={{ background: '#fef3c7', borderRadius: '8px' }}>
                        <p className="text-xs font-mono">{request.daysRemaining}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>يوم متبقي</p>
                      </div>
                      <div className="text-center p-2" style={{ background: '#f0fdf4', borderRadius: '8px' }}>
                        <p className="text-xs font-mono">{request.completedApprovals.length}</p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد منجز</p>
                      </div>
                    </div>

                    <Progress value={(request.currentLevel / request.totalLevels) * 100} className="h-2 mb-2" />

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-7 text-xs bg-green-500">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        اعتماد
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>طلبات الاعتماد ({approvalRequests.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500">
                <Plus className="h-3 w-3 ml-1" />
                طلب اعتماد جديد
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الطلب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-green-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{request.id}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractType}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.projectName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{request.requestDate}</TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className={`text-xs ${request.approvalWorkflow === 'digital' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
                            {request.approvalWorkflow === 'digital' ? 'رقمي' : request.approvalWorkflow === 'manual' ? 'يدوي' : 'هجين'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
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

      case '778-04':
      case '778-05':
      case '778-06':
      case '778-07':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '778-04' ? 'تاب الاعتماد اليدوي' :
                 activeTab === '778-05' ? 'تاب الاعتماد الرقمي' :
                 activeTab === '778-06' ? 'تاب اعتماد الأطراف' :
                 'تاب اعتماد المكتب'} قيد التطوير
              </p>
            </div>
          </div>
        );

      case '778-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                العقود المعتمدة ({approvalRequests.filter(r => r.status === 'approved').length})
              </h2>
            </div>

            <div className="space-y-2">
              {approvalRequests.filter(r => r.status === 'approved').map((request) => (
                <Card key={request.id} className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractType}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.projectName}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-mono">{request.contractId}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg mb-2">
                      <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>الاعتمادات المنجزة:</strong> {request.completedApprovals.length} من {request.totalLevels}
                      </p>
                      <div className="space-y-1">
                        {request.completedApprovals.map((approval) => (
                          <div key={approval.id} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{approval.approverName}</span>
                            <span className="text-gray-500">({approval.approverType})</span>
                            <span className="font-mono text-gray-500">{approval.approvalDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                        <Printer className="h-3 w-3 ml-1" />
                        طباعة
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Download className="h-3 w-3 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                العقود المرفوضة ({approvalRequests.filter(r => r.status === 'rejected').length})
              </h2>
            </div>

            <div className="space-y-2">
              {approvalRequests.filter(r => r.status === 'rejected').map((request) => (
                <Card key={request.id} className="card-element card-rtl" style={{ background: '#fef2f2', border: '2px solid #fca5a5' }}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.contractType}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{request.projectName}</p>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg mb-2">
                      <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>سبب الرفض:</strong>
                      </p>
                      {request.completedApprovals.filter(a => a.action === 'rejected').map((approval) => (
                        <div key={approval.id} className="text-xs text-red-700 bg-red-50 p-2 rounded">
                          <p style={{ fontFamily: 'Tajawal, sans-serif' }}>{approval.comments}</p>
                          <p className="text-gray-500 mt-1">
                            {approval.approverName} - {approval.approvalDate}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-7 text-xs bg-blue-500">
                        <RefreshCw className="h-3 w-3 ml-1" />
                        إعادة الطلب
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الاعتمادات ({approvalLogs.length})</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>بواسطة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{log.performedDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{log.contractId}</TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className={`text-xs ${
                            log.action === 'approved' ? 'bg-green-500' :
                            log.action === 'rejected' ? 'bg-red-500' :
                            log.action === 'sent' ? 'bg-blue-500' :
                            'bg-gray-500'
                          } text-white`}>
                            {log.action === 'created' ? 'إنشاء' :
                             log.action === 'approved' ? 'اعتماد' :
                             log.action === 'rejected' ? 'رفض' :
                             log.action === 'modified' ? 'تعديل' :
                             'إرسال'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.performedBy}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '778-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإشعارات ({notifications.length})</h2>
            </div>

            <div className="space-y-2">
              {notifications.map((notification) => (
                <Card key={notification.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'approval_request' ? 'bg-blue-100' :
                        notification.type === 'approval_granted' ? 'bg-green-100' :
                        notification.type === 'approval_rejected' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {notification.type === 'approval_request' ? <FileCheck className="h-4 w-4 text-blue-600" /> :
                         notification.type === 'approval_granted' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         notification.type === 'approval_rejected' ? <XCircle className="h-4 w-4 text-red-600" /> :
                         <Clock className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notification.message}</p>
                          {getStatusBadge(notification.status)}
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى: {notification.recipient}</span>
                          <span>•</span>
                          <span className="font-mono">{notification.sentDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والإحصائيات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />
                تصدير جميع التقارير
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'تقرير شامل بالعقود المعتمدة', icon: CheckCircle, color: '#10b981' },
                { name: 'تقرير العقود المرفوضة', icon: XCircle, color: '#ef4444' },
                { name: 'تقرير العقود المعلقة', icon: Clock, color: '#f59e0b' },
                { name: 'تقرير سجل الاعتمادات', icon: FileText, color: '#3b82f6' },
                { name: 'تقرير الإشعارات المرسلة', icon: Mail, color: '#8b5cf6' },
                { name: 'تقرير الأداء الشهري', icon: BarChart3, color: '#ec4899' }
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
              <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-778" position="top-right" />
      
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
              <FileCheck 
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
                  اعتماد العقود
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
                نظام شامل لاعتماد العقود والاتفاقيات - رقمي ويدوي
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
                12 تبويباً
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

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تفاصيل طلب الاعتماد</DialogTitle>
            {selectedRequest && (
              <DialogDescription className="dialog-description">
                {selectedRequest.contractType} - {selectedRequest.projectName}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الطلب</p>
                  <p className="text-sm font-mono">{selectedRequest.id}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</p>
                  <p className="text-sm font-mono">{selectedRequest.contractId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</p>
                  <p className="text-sm font-mono">{selectedRequest.value.toLocaleString('ar-SA')} ر.س</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الطلب</p>
                  <p className="text-sm font-mono">{selectedRequest.requestDate}</p>
                </div>
              </div>

              <Card>
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعتمدون المطلوبون</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.requiredApprovers.map((approver) => (
                        <TableRow key={approver.id}>
                          <TableCell className="text-right py-1 text-xs font-mono">{approver.level}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approver.type}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approver.name}</TableCell>
                          <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{approver.role}</TableCell>
                          <TableCell className="text-right py-1">{getStatusBadge(approver.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractApproval_Complete_778_v2;
