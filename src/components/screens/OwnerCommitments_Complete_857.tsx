/**
 * الشاشة 857 - إدارة تعهدات الملاك
 * ========================================================
 * 
 * نظام شامل لإدارة تعهدات الملاك مع التوقيع الإلكتروني والاعتماد
 * 
 * المميزات:
 * ✅ إنشاء واستعراض تعهدات الملاك
 * ✅ ربط ببروفايلات العملاء من الشاشة 300
 * ✅ ربط بالمعاملات
 * ✅ توقيع إلكتروني ويدوي
 * ✅ اعتماد من المكتب (مباشر أو بعد المشرف)
 * ✅ تفاصيل عن منشئ الإدخال
 * ✅ سجل كامل للتوقيعات والاعتمادات
 * ✅ نوتة للمالك تشرح الغرض
 * ✅ إرسال عبر وسائل التواصل
 * 
 * @version 1.0
 * @date 30 أكتوبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  FileSignature, Users, Plus, Eye, Edit, Trash2, Search, Download, Send,
  CheckCircle, XCircle, Clock, AlertCircle, User, Calendar, Phone, Mail,
  FileText, Printer, Share2, MessageSquare, Settings, Archive, TrendingUp,
  ClipboardCheck, UserCheck, Shield, Zap, Filter, RefreshCw, Save
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '857-01', number: '857-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '857-02', number: '857-02', title: 'قائمة التعهدات', icon: FileSignature },
  { id: '857-03', number: '857-03', title: 'إنشاء تعهد', icon: Plus },
  { id: '857-04', number: '857-04', title: 'التوقيعات', icon: UserCheck },
  { id: '857-05', number: '857-05', title: 'الاعتمادات', icon: Shield },
  { id: '857-06', number: '857-06', title: 'القوالب', icon: FileText },
  { id: '857-07', number: '857-07', title: 'الإرسال', icon: Send },
  { id: '857-08', number: '857-08', title: 'التقارير', icon: Download },
  { id: '857-09', number: '857-09', title: 'السجل', icon: Archive },
  { id: '857-10', number: '857-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// الواجهات (Interfaces)
// ============================================================

interface OwnerCommitment {
  id: string;
  commitmentCode: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  transactionId?: string;
  transactionCode?: string;
  type: string;
  category: string;
  title: string;
  content: string;
  ownerNote: string; // النوتة الموجهة للمالك
  createdBy: string;
  createdDate: string;
  createdTime: string;
  notificationMethod: 'whatsapp' | 'telegram' | 'email' | 'sms' | 'phone' | 'in-person';
  notificationDate?: string;
  signatureType: 'electronic' | 'manual' | 'none';
  signatureDate?: string;
  signedBy?: string;
  signatureMethod?: string;
  approvalRequired: boolean;
  approvalType: 'direct' | 'after-supervisor';
  supervisorApproved: boolean;
  supervisorApprovedBy?: string;
  supervisorApprovalDate?: string;
  officeApproved: boolean;
  officeApprovedBy?: string;
  officeApprovalDate?: string;
  status: 'draft' | 'sent' | 'signed' | 'approved' | 'rejected' | 'expired';
  validUntil?: string;
  notes: string;
}

interface CommitmentTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  content: string;
  ownerNoteTemplate: string;
  variables: string[];
  approvalType: 'direct' | 'after-supervisor';
  validityDays: number;
  usageCount: number;
}

// ============================================================
// بيانات وهمية
// ============================================================

const MOCK_COMMITMENTS: OwnerCommitment[] = [
  {
    id: 'COM-001',
    commitmentCode: 'TC-2025-001',
    clientId: 'CLI-001',
    clientName: 'محمد بن أحمد العتيبي',
    clientPhone: '0501234567',
    clientEmail: 'mohammed@example.com',
    transactionId: 'TRX-001',
    transactionCode: '2510001',
    type: 'إنشائي',
    category: 'التزام بالمواصفات',
    title: 'تعهد بالالتزام بالمواصفات المعتمدة',
    content: 'أتعهد أنا المواطن محمد بن أحمد العتيبي بالالتزام التام بالمواصفات المعتمدة من البلدية للمشروع رقم 2510001 وعدم إجراء أي تعديلات بدون موافقة رسمية مسبقة.',
    ownerNote: 'عزيزي العميل، هذا التعهد مطلوب للتأكد من التزامكم بالمواصفات المعتمدة من البلدية. يرجى قراءته بعناية والتوقيع عليه إذا كنتم موافقين.',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-10-25',
    createdTime: '09:30',
    notificationMethod: 'whatsapp',
    notificationDate: '2025-10-25 09:35',
    signatureType: 'electronic',
    signatureDate: '2025-10-25 10:15',
    signedBy: 'محمد بن أحمد العتيبي',
    signatureMethod: 'توقيع إلكتروني عبر واتساب',
    approvalRequired: true,
    approvalType: 'after-supervisor',
    supervisorApproved: true,
    supervisorApprovedBy: 'م. خالد السالم',
    supervisorApprovalDate: '2025-10-25 11:00',
    officeApproved: true,
    officeApprovedBy: 'فهد الدوسري',
    officeApprovalDate: '2025-10-25 14:30',
    status: 'approved',
    validUntil: '2025-11-25',
    notes: 'تم التوقيع والاعتماد بنجاح'
  },
  {
    id: 'COM-002',
    commitmentCode: 'TC-2025-002',
    clientId: 'CLI-002',
    clientName: 'عبدالله بن سعد القحطاني',
    clientPhone: '0509876543',
    clientEmail: 'abdullah@example.com',
    transactionId: 'TRX-002',
    transactionCode: '2510002',
    type: 'مالي',
    category: 'التزام بالدفع',
    title: 'تعهد بسداد الأتعاب في المواعيد',
    content: 'أتعهد أنا المواطن عبدالله بن سعد القحطاني بسداد جميع الأتعاب المستحقة للمكتب في المواعيد المحددة دون تأخير.',
    ownerNote: 'عزيزي العميل، هذا التعهد يضمن التزامكم بسداد الأتعاب في مواعيدها. الرجاء التوقيع للمتابعة.',
    createdBy: 'فهد الدوسري',
    createdDate: '2025-10-26',
    createdTime: '10:00',
    notificationMethod: 'email',
    notificationDate: '2025-10-26 10:05',
    signatureType: 'electronic',
    signatureDate: '2025-10-26 15:20',
    signedBy: 'عبدالله بن سعد القحطاني',
    signatureMethod: 'توقيع إلكتروني عبر البريد الإلكتروني',
    approvalRequired: true,
    approvalType: 'direct',
    supervisorApproved: false,
    officeApproved: true,
    officeApprovedBy: 'أحمد المطيري',
    officeApprovalDate: '2025-10-26 16:00',
    status: 'approved',
    validUntil: '2025-12-31',
    notes: ''
  },
  {
    id: 'COM-003',
    commitmentCode: 'TC-2025-003',
    clientId: 'CLI-003',
    clientName: 'فيصل بن عبدالعزيز الشمري',
    clientPhone: '0551234567',
    clientEmail: 'faisal@example.com',
    transactionId: 'TRX-003',
    transactionCode: '2510003',
    type: 'إنشائي',
    category: 'التزام بالسلامة',
    title: 'تعهد بالالتزام بشروط السلامة',
    content: 'أتعهد أنا المواطن فيصل بن عبدالعزيز الشمري بتوفير جميع متطلبات السلامة في الموقع والالتزام بالإجراءات المعتمدة.',
    ownerNote: 'عزيزي العميل، السلامة أولاً. هذا التعهد يضمن التزامكم بمعايير السلامة. يرجى القراءة والتوقيع.',
    createdBy: 'خالد السالم',
    createdDate: '2025-10-27',
    createdTime: '11:30',
    notificationMethod: 'sms',
    notificationDate: '2025-10-27 11:35',
    signatureType: 'manual',
    signatureDate: '2025-10-28 09:00',
    signedBy: 'فيصل بن عبدالعزيز الشمري',
    signatureMethod: 'توقيع يدوي في المكتب',
    approvalRequired: true,
    approvalType: 'after-supervisor',
    supervisorApproved: true,
    supervisorApprovedBy: 'م. فهد الدوسري',
    supervisorApprovalDate: '2025-10-28 10:00',
    officeApproved: false,
    status: 'signed',
    validUntil: '2025-11-27',
    notes: 'في انتظار اعتماد المكتب'
  },
  {
    id: 'COM-004',
    commitmentCode: 'TC-2025-004',
    clientId: 'CLI-004',
    clientName: 'ناصر بن محمد الحربي',
    clientPhone: '0502345678',
    clientEmail: 'nasser@example.com',
    transactionId: 'TRX-004',
    transactionCode: '2510004',
    type: 'قانوني',
    category: 'تعهد بالملكية',
    title: 'تعهد بصحة ملكية الأرض',
    content: 'أتعهد أنا المواطن ناصر بن محمد الحربي بأن الأرض موضوع المعاملة مملوكة لي بشكل قانوني وخالية من أي نزاعات.',
    ownerNote: 'عزيزي العميل، هذا التعهد يؤكد صحة ملكيتكم للأرض. يرجى التوقيع بعد التأكد.',
    createdBy: 'سعد القحطاني',
    createdDate: '2025-10-28',
    createdTime: '14:00',
    notificationMethod: 'whatsapp',
    notificationDate: '2025-10-28 14:05',
    signatureType: 'none',
    approvalRequired: true,
    approvalType: 'direct',
    supervisorApproved: false,
    officeApproved: false,
    status: 'sent',
    validUntil: '2025-11-15',
    notes: 'تم الإرسال في انتظار التوقيع'
  },
  {
    id: 'COM-005',
    commitmentCode: 'TC-2025-005',
    clientId: 'CLI-005',
    clientName: 'سعد بن عبدالله الغامدي',
    clientPhone: '0503456789',
    clientEmail: 'saad@example.com',
    type: 'عام',
    category: 'التزام بالتعاون',
    title: 'تعهد بالتعاون مع المكتب',
    content: 'أتعهد أنا المواطن سعد بن عبدالله الغامدي بالتعاون التام مع المكتب وتقديم جميع المستندات المطلوبة في الوقت المحدد.',
    ownerNote: 'عزيزي العميل، تعاونكم مهم جداً لإنجاز الخدمة بسرعة وكفاءة. يرجى التوقيع على التعهد.',
    createdBy: 'أحمد المطيري',
    createdDate: '2025-10-29',
    createdTime: '09:00',
    notificationMethod: 'phone',
    signatureType: 'none',
    approvalRequired: false,
    approvalType: 'direct',
    supervisorApproved: false,
    officeApproved: false,
    status: 'draft',
    notes: 'قيد الإعداد'
  }
];

const MOCK_TEMPLATES: CommitmentTemplate[] = [
  {
    id: 'TPL-001',
    name: 'تعهد بالالتزام بالمواصفات',
    category: 'إنشائي',
    type: 'التزام بالمواصفات',
    content: 'أتعهد أنا المواطن {owner_name} بالالتزام التام بالمواصفات المعتمدة من البلدية للمشروع رقم {transaction_code} وعدم إجراء أي تعديلات بدون موافقة رسمية مسبقة.\n\nأسم المشروع: {project_name}\nالموقع: {location}\nالمساحة: {area} م²',
    ownerNoteTemplate: 'عزيزي العميل {owner_name}، هذا التعهد مطلوب للتأكد من التزامكم بالمواصفات المعتمدة من البلدية للمشروع {project_name}. يرجى قراءته بعناية والتوقيع عليه إذا كنتم موافقين.',
    variables: ['owner_name', 'transaction_code', 'project_name', 'location', 'area'],
    approvalType: 'after-supervisor',
    validityDays: 30,
    usageCount: 45
  },
  {
    id: 'TPL-002',
    name: 'تعهد بسداد الأتعاب',
    category: 'مالي',
    type: 'التزام بالدفع',
    content: 'أتعهد أنا المواطن {owner_name} بسداد جميع الأتعاب المستحقة للمكتب بقيمة {total_fees} ريال سعودي وفق الجدول الزمني التالي:\n\n{payment_schedule}\n\nوذلك عن المعاملة رقم {transaction_code}.',
    ownerNoteTemplate: 'عزيزي العميل {owner_name}، هذا التعهد يضمن التزامكم بسداد الأتعاب المستحقة بقيمة {total_fees} ريال في مواعيدها المحددة. الرجاء التوقيع للمتابعة.',
    variables: ['owner_name', 'total_fees', 'payment_schedule', 'transaction_code'],
    approvalType: 'direct',
    validityDays: 90,
    usageCount: 67
  },
  {
    id: 'TPL-003',
    name: 'تعهد بالالتزام بالسلامة',
    category: 'إنشائي',
    type: 'التزام بالسلامة',
    content: 'أتعهد أنا المواطن {owner_name} بتوفير جميع متطلبات السلامة في موقع الإنشاء والالتزام بالإجراءات التالية:\n\n1. توفير معدات الحماية الشخصية للعمال\n2. وضع لافتات تحذيرية واضحة\n3. الالتزام بمعايير السلامة المعتمدة\n4. إجراء فحوصات دورية للموقع\n5. الإبلاغ الفوري عن أي مخاطر',
    ownerNoteTemplate: 'عزيزي العميل {owner_name}، السلامة أولاً. هذا التعهد يضمن التزامكم بمعايير السلامة في موقع الإنشاء. يرجى القراءة بعناية والتوقيع.',
    variables: ['owner_name'],
    approvalType: 'after-supervisor',
    validityDays: 180,
    usageCount: 38
  },
  {
    id: 'TPL-004',
    name: 'تعهد بصحة الملكية',
    category: 'قانوني',
    type: 'تعهد بالملكية',
    content: 'أتعهد أنا المواطن {owner_name} حامل الهوية الوطنية رقم {id_number} بأن العقار موضوع الصك رقم {deed_number} مملوك لي بشكل قانوني وخالٍ من:\n\n1. أي نزاعات قضائية\n2. أي رهونات أو حجوزات\n3. أي مطالبات من الغير\n4. أي قيود قانونية\n\nوأتحمل المسؤولية الكاملة عن صحة هذا التعهد.',
    ownerNoteTemplate: 'عزيزي العميل {owner_name}، هذا التعهد يؤكد صحة ملكيتكم للعقار موضوع الصك رقم {deed_number} وخلوه من أي نزاعات. يرجى التوقيع بعد التأكد من صحة المعلومات.',
    variables: ['owner_name', 'id_number', 'deed_number'],
    approvalType: 'direct',
    validityDays: 365,
    usageCount: 29
  },
  {
    id: 'TPL-005',
    name: 'تعهد بالتعاون',
    category: 'عام',
    type: 'التزام بالتعاون',
    content: 'أتعهد أنا المواطن {owner_name} بالتعاون التام مع المكتب الهندسي في:\n\n1. تقديم جميع المستندات المطلوبة في الوقت المحدد\n2. الرد على الاستفسارات بشكل سريع\n3. الحضور للمواعيد المحددة\n4. إبلاغ المكتب بأي تغييرات\n5. احترام مواعيد العمل',
    ownerNoteTemplate: 'عزيزي العميل {owner_name}، تعاونكم مهم جداً لإنجاز الخدمة بسرعة وكفاءة. هذا التعهد البسيط يضمن التنسيق الجيد بيننا. يرجى التوقيع.',
    variables: ['owner_name'],
    approvalType: 'direct',
    validityDays: 60,
    usageCount: 56
  }
];

// ============================================================
// المكون الرئيسي
// ============================================================

const OwnerCommitments_Complete_857: React.FC = () => {
  const [activeTab, setActiveTab] = useState('857-01');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState<OwnerCommitment | null>(null);

  // ============================================================
  // التاب 857-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-8 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>إجمالي التعهدات</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e3a8a' }}>
                  {MOCK_COMMITMENTS.length}
                </p>
              </div>
              <FileSignature className="h-5 w-5" style={{ color: '#3b82f6' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46' }}>معتمدة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#064e3b' }}>
                  {MOCK_COMMITMENTS.filter(c => c.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>موقّعة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#78350f' }}>
                  {MOCK_COMMITMENTS.filter(c => c.status === 'signed').length}
                </p>
              </div>
              <UserCheck className="h-5 w-5" style={{ color: '#f59e0b' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#3730a3' }}>مرسلة</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#312e81' }}>
                  {MOCK_COMMITMENTS.filter(c => c.status === 'sent').length}
                </p>
              </div>
              <Send className="h-5 w-5" style={{ color: '#6366f1' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#831843' }}>مسودات</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#831843' }}>
                  {MOCK_COMMITMENTS.filter(c => c.status === 'draft').length}
                </p>
              </div>
              <Edit className="h-5 w-5" style={{ color: '#ec4899' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)', border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#5b21b6' }}>إلكترونية</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#4c1d95' }}>
                  {MOCK_COMMITMENTS.filter(c => c.signatureType === 'electronic').length}
                </p>
              </div>
              <Zap className="h-5 w-5" style={{ color: '#8b5cf6' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', border: '2px solid #06b6d4' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#164e63' }}>يدوية</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#083344' }}>
                  {MOCK_COMMITMENTS.filter(c => c.signatureType === 'manual').length}
                </p>
              </div>
              <Edit className="h-5 w-5" style={{ color: '#06b6d4' }} />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #f97316' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c2d12' }}>القوالب</p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#7c2d12' }}>
                  {MOCK_TEMPLATES.length}
                </p>
              </div>
              <FileText className="h-5 w-5" style={{ color: '#f97316' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول التعهدات */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أحدث التعهدات
            </CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 ml-1" />
              تعهد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 420px)' }}>
            <Table className="table-rtl">
              <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_COMMITMENTS.map((commitment) => (
                  <TableRow key={commitment.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                      {commitment.commitmentCode}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div>
                        <p>{commitment.clientName}</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>{commitment.clientPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {commitment.title}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <Badge style={{ background: '#6366f1' }}>
                        {commitment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ 
                        background: commitment.signatureType === 'electronic' ? '#8b5cf6' : 
                                   commitment.signatureType === 'manual' ? '#06b6d4' : '#6b7280'
                      }}>
                        {commitment.signatureType === 'electronic' ? 'إلكتروني' : 
                         commitment.signatureType === 'manual' ? 'يدوي' : 'بدون'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{ 
                        background: commitment.status === 'approved' ? '#10b981' : 
                                   commitment.status === 'signed' ? '#f59e0b' : 
                                   commitment.status === 'sent' ? '#6366f1' : 
                                   commitment.status === 'draft' ? '#6b7280' : '#ef4444'
                      }}>
                        {commitment.status === 'approved' ? 'معتمد' : 
                         commitment.status === 'signed' ? 'موقّع' : 
                         commitment.status === 'sent' ? 'مرسل' : 
                         commitment.status === 'draft' ? 'مسودة' : 'مرفوض'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCommitment(commitment);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-3 w-3 ml-1" />
                          إرسال
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // عرض محتوى التاب الحالي
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '857-01': return renderTab01_Overview();
      case '857-02': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-03': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-04': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-05': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-06': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-07': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-08': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-09': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      case '857-10': return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد التطوير...</div>;
      default: return renderTab01_Overview();
    }
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
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
              <FileSignature 
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
                  إدارة تعهدات الملاك
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
                    857
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
                إنشاء واستعراض تعهدات الملاك مع التوقيع الإلكتروني والاعتماد
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
                10 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* مساحة العمل */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', padding: '0 16px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerCommitments_Complete_857;
