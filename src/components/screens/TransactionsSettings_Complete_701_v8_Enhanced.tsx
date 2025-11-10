/**
 * الشاشة 701 - إعدادات المعاملات v8.0 المحسّنة
 * =============================================
 * 
 * شاشة شاملة لإدارة جميع إعدادات نظام المعاملات
 * 
 * التابات (17 تاب):
 * 701-01: الإعدادات الأساسية
 * 701-02: إعدادات الترقيم
 * 701-03: المراحل
 * 701-04: حالات المعاملات
 * 701-05: الأولويات
 * 701-06: التصنيفات
 * 701-07: القوالب
 * 701-08: النماذج
 * 701-09: إعدادات التنبيهات
 * 701-10: الصلاحيات
 * 701-11: التصنيفات الرئيسية
 * 701-12: التصنيفات الفرعية
 * 701-13: الربط بالأنظمة
 * 701-14: السجلات والتدقيق
 * 701-15: النسخ الاحتياطي
 * 701-16: مستوى المعاملة ⭐ جديد
 * 701-17: إجراءات التحقق ⭐ جديد
 * 
 * @version 8.0
 * @date 2025-10-20
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Settings, Hash, GitBranch, Activity, Zap, Tag, FileText,
  File, Bell, Shield, Folder, FolderTree, Link2, Eye, Database,
  Plus, Edit, Trash2, Save, Search, Filter, BarChart3, Clock,
  CheckCircle, XCircle, AlertCircle, Play, Pause, ArrowRight,
  Layers, FileCheck, ShieldCheck, AlertTriangle, CheckSquare,
  ListChecks, ClipboardCheck, Target, Flag, Star, TrendingUp,
  Workflow, FileSignature, UserCheck, Award, Briefcase, FileWarning
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ===== واجهات البيانات =====

interface TransactionLevel {
  id: string;
  code: string;
  name: 'معاملة بسيطة' | 'معاملة كاملة';
  description: string;
  stages: LevelStage[];
  requiredDocuments: RequiredDocument[];
  settings: LevelSettings;
  urgencyLevels: UrgencyLevel[];
  importancelevels: ImportanceLevel[];
  procedures: string[];
  isActive: boolean;
  createdDate: string;
}

interface LevelStage {
  id: string;
  name: string;
  description: string;
  order: number;
  durationDays: number;
  isOptional: boolean;
  requiredApprovals: number;
  color: string;
}

interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  acceptedFormats: string[];
  maxSize: number;
  validityDays: number;
  category: string;
}

interface LevelSettings {
  minDuration: number;
  maxDuration: number;
  autoNotifications: boolean;
  requiresApproval: boolean;
  allowModification: boolean;
  trackingLevel: 'basic' | 'detailed' | 'comprehensive';
}

interface UrgencyLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  color: string;
  slaHours: number;
  notificationFrequency: number;
  escalationEnabled: boolean;
}

interface ImportanceLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  color: string;
  requiresHigherApproval: boolean;
  priority: number;
}

interface VerificationProcedure {
  id: string;
  code: string;
  name: string;
  description: string;
  stage: string;
  type: 'تحقق تلقائي' | 'تحقق يدوي' | 'تحقق مختلط';
  checkPoints: CheckPoint[];
  isRequired: boolean;
  order: number;
  failureAction: 'إيقاف' | 'تحذير' | 'تسجيل';
  isActive: boolean;
  createdDate: string;
}

interface CheckPoint {
  id: string;
  name: string;
  description: string;
  criteria: string;
  validationRule: string;
  errorMessage: string;
  isBlocking: boolean;
}

const TransactionsSettings_Complete_701_v8_Enhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('701-16');
  const [levelTab, setLevelTab] = useState<'simple' | 'complete'>('simple');

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '701-01', number: '701-01', title: 'الإعدادات الأساسية', icon: Settings },
    { id: '701-02', number: '701-02', title: 'إعدادات الترقيم', icon: Hash },
    { id: '701-03', number: '701-03', title: 'المراحل', icon: GitBranch },
    { id: '701-04', number: '701-04', title: 'حالات المعاملات', icon: Activity },
    { id: '701-05', number: '701-05', title: 'الأولويات', icon: Zap },
    { id: '701-06', number: '701-06', title: 'التصنيفات', icon: Tag },
    { id: '701-07', number: '701-07', title: 'القوالب', icon: FileText },
    { id: '701-08', number: '701-08', title: 'النماذج', icon: File },
    { id: '701-09', number: '701-09', title: 'إعدادات التنبيهات', icon: Bell },
    { id: '701-10', number: '701-10', title: 'الصلاحيات', icon: Shield },
    { id: '701-11', number: '701-11', title: 'التصنيفات الرئيسية', icon: Folder },
    { id: '701-12', number: '701-12', title: 'التصنيفات الفرعية', icon: FolderTree },
    { id: '701-13', number: '701-13', title: 'الربط بالأنظمة', icon: Link2 },
    { id: '701-14', number: '701-14', title: 'السجلات والتدقيق', icon: Eye },
    { id: '701-15', number: '701-15', title: 'النسخ الاحتياطي', icon: Database },
    { id: '701-16', number: '701-16', title: 'مستوى المعاملة', icon: Layers },
    { id: '701-17', number: '701-17', title: 'إجراءات التحقق', icon: ShieldCheck },
  ];

  // بيانات تجريبية - مستويات المعاملات
  const [transactionLevels, setTransactionLevels] = useState<TransactionLevel[]>([
    {
      id: 'LVL-SIMPLE',
      code: 'SIMPLE',
      name: 'معاملة بسيطة',
      description: 'معاملات سريعة ومباشرة لا تتطلب مراجعات معقدة أو مستندات كثيرة',
      stages: [
        {
          id: 'S-STG-01',
          name: 'استلام الطلب',
          description: 'استلام الطلب من العميل والتحقق الأولي',
          order: 1,
          durationDays: 1,
          isOptional: false,
          requiredApprovals: 0,
          color: '#3b82f6'
        },
        {
          id: 'S-STG-02',
          name: 'المراجعة السريعة',
          description: 'مراجعة سريعة للمستندات الأساسية',
          order: 2,
          durationDays: 1,
          isOptional: false,
          requiredApprovals: 1,
          color: '#f59e0b'
        },
        {
          id: 'S-STG-03',
          name: 'الاعتماد والإصدار',
          description: 'اعتماد نهائي وإصدار المخرجات',
          order: 3,
          durationDays: 1,
          isOptional: false,
          requiredApprovals: 1,
          color: '#10b981'
        }
      ],
      requiredDocuments: [
        {
          id: 'SD-01',
          name: 'صورة الهوية الوطنية',
          description: 'صورة من بطاقة الهوية الوطنية سارية المفعول',
          isRequired: true,
          acceptedFormats: ['PDF', 'JPG', 'PNG'],
          maxSize: 5,
          validityDays: 180,
          category: 'مستندات ثبوتية'
        },
        {
          id: 'SD-02',
          name: 'صورة الصك',
          description: 'صورة من صك الملكية',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 10,
          validityDays: 365,
          category: 'مستندات ملكية'
        },
        {
          id: 'SD-03',
          name: 'طلب مكتمل',
          description: 'نموذج الطلب مكتمل وموقع',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 2,
          validityDays: 30,
          category: 'نماذج'
        }
      ],
      settings: {
        minDuration: 2,
        maxDuration: 5,
        autoNotifications: true,
        requiresApproval: true,
        allowModification: true,
        trackingLevel: 'basic'
      },
      urgencyLevels: [
        {
          id: 'SU-01',
          level: 1,
          name: 'عادي',
          description: 'معاملة بإجراءات عادية',
          color: '#6b7280',
          slaHours: 72,
          notificationFrequency: 24,
          escalationEnabled: false
        },
        {
          id: 'SU-02',
          level: 2,
          name: 'مستعجل',
          description: 'يتطلب معالجة أسرع',
          color: '#f59e0b',
          slaHours: 48,
          notificationFrequency: 12,
          escalationEnabled: true
        },
        {
          id: 'SU-03',
          level: 3,
          name: 'عاجل جداً',
          description: 'أولوية قصوى',
          color: '#ef4444',
          slaHours: 24,
          notificationFrequency: 6,
          escalationEnabled: true
        }
      ],
      importancelevels: [
        {
          id: 'SI-01',
          level: 1,
          name: 'عادية',
          description: 'معاملة بأهمية عادية',
          color: '#6b7280',
          requiresHigherApproval: false,
          priority: 3
        },
        {
          id: 'SI-02',
          level: 2,
          name: 'مهمة',
          description: 'تحتاج متابعة',
          color: '#3b82f6',
          requiresHigherApproval: false,
          priority: 2
        },
        {
          id: 'SI-03',
          level: 3,
          name: 'حرجة',
          description: 'أهمية قصوى',
          color: '#ef4444',
          requiresHigherApproval: true,
          priority: 1
        }
      ],
      procedures: [
        'التحقق من اكتمال النماذج',
        'التحقق من صحة المستندات',
        'التحقق من الصلاحيات',
        'التحقق من عدم التعارض',
        'التحقق من الرسوم'
      ],
      isActive: true,
      createdDate: '2024-01-10'
    },
    {
      id: 'LVL-COMPLETE',
      code: 'COMPLETE',
      name: 'معاملة كاملة',
      description: 'معاملات شاملة تتطلب مراجعات متعددة ومستندات تفصيلية ومراحل معقدة',
      stages: [
        {
          id: 'C-STG-01',
          name: 'استلام وتسجيل',
          description: 'استلام الطلب وتسجيله في النظام',
          order: 1,
          durationDays: 2,
          isOptional: false,
          requiredApprovals: 1,
          color: '#3b82f6'
        },
        {
          id: 'C-STG-02',
          name: 'التدقيق الأولي',
          description: 'التدقيق الأولي على المستندات والبيانات',
          order: 2,
          durationDays: 3,
          isOptional: false,
          requiredApprovals: 1,
          color: '#8b5cf6'
        },
        {
          id: 'C-STG-03',
          name: 'الدراسة الفنية',
          description: 'دراسة فنية شاملة للمشروع',
          order: 3,
          durationDays: 5,
          isOptional: false,
          requiredApprovals: 2,
          color: '#06b6d4'
        },
        {
          id: 'C-STG-04',
          name: 'المراجعة القانونية',
          description: 'مراجعة قانونية للوثائق والالتزامات',
          order: 4,
          durationDays: 3,
          isOptional: false,
          requiredApprovals: 1,
          color: '#f59e0b'
        },
        {
          id: 'C-STG-05',
          name: 'موافقة المدير',
          description: 'الحصول على موافقة مدير المكتب',
          order: 5,
          durationDays: 2,
          isOptional: false,
          requiredApprovals: 1,
          color: '#ec4899'
        },
        {
          id: 'C-STG-06',
          name: 'التنفيذ والإعداد',
          description: 'تنفيذ المطلوب وإعداد المخرجات',
          order: 6,
          durationDays: 7,
          isOptional: false,
          requiredApprovals: 0,
          color: '#14b8a6'
        },
        {
          id: 'C-STG-07',
          name: 'المراجعة النهائية',
          description: 'مراجعة نهائية شاملة',
          order: 7,
          durationDays: 2,
          isOptional: false,
          requiredApprovals: 2,
          color: '#f97316'
        },
        {
          id: 'C-STG-08',
          name: 'الاعتماد والختم',
          description: 'الاعتماد النهائي والختم الرسمي',
          order: 8,
          durationDays: 1,
          isOptional: false,
          requiredApprovals: 1,
          color: '#10b981'
        },
        {
          id: 'C-STG-09',
          name: 'التسليم والأرشفة',
          description: 'تسليم المخرجات للعميل والأرشفة',
          order: 9,
          durationDays: 1,
          isOptional: false,
          requiredApprovals: 0,
          color: '#6366f1'
        }
      ],
      requiredDocuments: [
        {
          id: 'CD-01',
          name: 'صورة الهوية الوطنية',
          description: 'صورة من بطاقة الهوية الوطنية سارية المفعول',
          isRequired: true,
          acceptedFormats: ['PDF', 'JPG', 'PNG'],
          maxSize: 5,
          validityDays: 180,
          category: 'مستندات ثبوتية'
        },
        {
          id: 'CD-02',
          name: 'صورة الصك الإلكتروني',
          description: 'صورة من الصك الإلكتروني من ناجز',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 15,
          validityDays: 365,
          category: 'مستندات ملكية'
        },
        {
          id: 'CD-03',
          name: 'كروكي الموقع',
          description: 'كروكي تفصيلي لموقع العقار',
          isRequired: true,
          acceptedFormats: ['PDF', 'DWG', 'DXF'],
          maxSize: 20,
          validityDays: 90,
          category: 'مخططات'
        },
        {
          id: 'CD-04',
          name: 'شهادة الملكية',
          description: 'شهادة ملكية معتمدة',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 10,
          validityDays: 180,
          category: 'مستندات ملكية'
        },
        {
          id: 'CD-05',
          name: 'الرسومات المعمارية',
          description: 'جميع الرسومات المعمارية',
          isRequired: true,
          acceptedFormats: ['PDF', 'DWG'],
          maxSize: 50,
          validityDays: 365,
          category: 'مخططات'
        },
        {
          id: 'CD-06',
          name: 'التقرير الجيوتقني',
          description: 'تقرير فحص التربة',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 15,
          validityDays: 365,
          category: 'تقارير فنية'
        },
        {
          id: 'CD-07',
          name: 'الدراسة الإنشائية',
          description: 'الدراسة الإنشائية الكاملة',
          isRequired: true,
          acceptedFormats: ['PDF', 'DWG'],
          maxSize: 40,
          validityDays: 365,
          category: 'دراسات'
        },
        {
          id: 'CD-08',
          name: 'شهادة المساح',
          description: 'شهادة من مساح معتمد',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 10,
          validityDays: 180,
          category: 'شهادات'
        },
        {
          id: 'CD-09',
          name: 'خطة السلامة',
          description: 'خطة السلامة المهنية',
          isRequired: false,
          acceptedFormats: ['PDF'],
          maxSize: 10,
          validityDays: 365,
          category: 'خطط'
        },
        {
          id: 'CD-10',
          name: 'تقرير الأثر البيئي',
          description: 'تقييم الأثر البيئي',
          isRequired: false,
          acceptedFormats: ['PDF'],
          maxSize: 20,
          validityDays: 365,
          category: 'تقارير بيئية'
        },
        {
          id: 'CD-11',
          name: 'موافقات الجهات',
          description: 'موافقات الجهات المختصة',
          isRequired: true,
          acceptedFormats: ['PDF'],
          maxSize: 15,
          validityDays: 180,
          category: 'موافقات'
        },
        {
          id: 'CD-12',
          name: 'خطابات التفويض',
          description: 'خطابات التفويض إن وجدت',
          isRequired: false,
          acceptedFormats: ['PDF'],
          maxSize: 5,
          validityDays: 90,
          category: 'خطابات'
        }
      ],
      settings: {
        minDuration: 15,
        maxDuration: 45,
        autoNotifications: true,
        requiresApproval: true,
        allowModification: true,
        trackingLevel: 'comprehensive'
      },
      urgencyLevels: [
        {
          id: 'CU-01',
          level: 1,
          name: 'عادي',
          description: 'إجراءات عادية',
          color: '#6b7280',
          slaHours: 720,
          notificationFrequency: 72,
          escalationEnabled: false
        },
        {
          id: 'CU-02',
          level: 2,
          name: 'مستعجل',
          description: 'يتطلب متابعة مكثفة',
          color: '#f59e0b',
          slaHours: 480,
          notificationFrequency: 48,
          escalationEnabled: true
        },
        {
          id: 'CU-03',
          level: 3,
          name: 'عاجل جداً',
          description: 'أولوية قصوى',
          color: '#ef4444',
          slaHours: 240,
          notificationFrequency: 24,
          escalationEnabled: true
        }
      ],
      importancelevels: [
        {
          id: 'CI-01',
          level: 1,
          name: 'عادية',
          description: 'معاملة بأهمية عادية',
          color: '#6b7280',
          requiresHigherApproval: false,
          priority: 3
        },
        {
          id: 'CI-02',
          level: 2,
          name: 'مهمة',
          description: 'تحتاج متابعة دورية',
          color: '#3b82f6',
          requiresHigherApproval: true,
          priority: 2
        },
        {
          id: 'CI-03',
          level: 3,
          name: 'استراتيجية',
          description: 'ذات أهمية استراتيجية',
          color: '#8b5cf6',
          requiresHigherApproval: true,
          priority: 1
        },
        {
          id: 'CI-04',
          level: 4,
          name: 'حرجة',
          description: 'أهمية قصوى - مشاريع كبرى',
          color: '#ef4444',
          requiresHigherApproval: true,
          priority: 0
        }
      ],
      procedures: [
        'التحقق من اكتمال جميع المستندات',
        'التحقق من صحة المخططات الهندسية',
        'التحقق من الامتثال للكود السعودي',
        'التحقق من موافقات الجهات المختصة',
        'التحقق من سلامة البيانات المدخلة',
        'التحقق من الصلاحيات والتفويضات',
        'التحقق من اكتمال الدراسات الفنية',
        'التحقق من عدم التعارض مع مشاريع أخرى',
        'التحقق من سداد الرسوم',
        'التحقق من التواقيع والأختام',
        'التحقق من الجدوى الاقتصادية',
        'التحقق من الالتزامات القانونية'
      ],
      isActive: true,
      createdDate: '2024-01-10'
    }
  ]);

  // بيانات تجريبية - إجراءات التحقق
  const [verificationProcedures, setVerificationProcedures] = useState<VerificationProcedure[]>([
    {
      id: 'VER-001',
      code: 'VER-DOC-001',
      name: 'التحقق من اكتمال المستندات',
      description: 'التحقق من أن جميع المستندات المطلوبة مرفقة وصحيحة',
      stage: 'استلام الطلب',
      type: 'تحقق تلقائي',
      checkPoints: [
        {
          id: 'CP-001',
          name: 'عدد المستندات',
          description: 'التحقق من رفع العدد الصحيح من المستندات',
          criteria: 'عدد المستندات >= العدد المطلوب',
          validationRule: 'COUNT(documents) >= required_count',
          errorMessage: 'المستندات المرفقة غير مكتملة',
          isBlocking: true
        },
        {
          id: 'CP-002',
          name: 'صيغة المستندات',
          description: 'التحقق من أن الملفات بالصيغ المقبولة',
          criteria: 'الصيغة ضمن القائمة المسموحة',
          validationRule: 'file.extension IN allowed_formats',
          errorMessage: 'صيغة الملف غير مدعومة',
          isBlocking: true
        },
        {
          id: 'CP-003',
          name: 'حجم الملفات',
          description: 'التحقق من أن حجم الملفات ضمن الحد المسموح',
          criteria: 'الحجم <= الحد الأقصى',
          validationRule: 'file.size <= max_size_mb',
          errorMessage: 'حجم الملف يتجاوز الحد المسموح',
          isBlocking: true
        }
      ],
      isRequired: true,
      order: 1,
      failureAction: 'إيقاف',
      isActive: true,
      createdDate: '2024-02-01'
    },
    {
      id: 'VER-002',
      code: 'VER-DATA-001',
      name: 'التحقق من صحة البيانات',
      description: 'التحقق من أن البيانات المدخلة صحيحة ومنطقية',
      stage: 'التدقيق الأولي',
      type: 'تحقق مختلط',
      checkPoints: [
        {
          id: 'CP-004',
          name: 'رقم الهوية',
          description: 'التحقق من صحة رقم الهوية الوطنية',
          criteria: 'رقم الهوية صحيح ومطابق للمعايير',
          validationRule: 'VALIDATE_NATIONAL_ID(id_number)',
          errorMessage: 'رقم الهوية غير صحيح',
          isBlocking: true
        },
        {
          id: 'CP-005',
          name: 'رقم الصك',
          description: 'التحقق من وجود رقم الصك في السجلات',
          criteria: 'رقم الصك موجود وصحيح',
          validationRule: 'EXISTS(deed_number) AND valid',
          errorMessage: 'رقم الصك غير موجود أو غير صحيح',
          isBlocking: true
        },
        {
          id: 'CP-006',
          name: 'تاريخ الصلاحية',
          description: 'التحقق من أن المستندات لم تنتهِ صلاحيتها',
          criteria: 'تاريخ الانتهاء > اليوم',
          validationRule: 'expiry_date > CURRENT_DATE',
          errorMessage: 'المستند منتهي الصلاحية',
          isBlocking: true
        }
      ],
      isRequired: true,
      order: 2,
      failureAction: 'إيقاف',
      isActive: true,
      createdDate: '2024-02-01'
    },
    {
      id: 'VER-003',
      code: 'VER-TECH-001',
      name: 'التحقق الفني للمخططات',
      description: 'التحقق من مطابقة المخططات للمعايير الفنية',
      stage: 'الدراسة الفنية',
      type: 'تحقق يدوي',
      checkPoints: [
        {
          id: 'CP-007',
          name: 'مطابقة الكود السعودي',
          description: 'التحقق من مطابقة التصميم للكود السعودي',
          criteria: 'جميع المتطلبات مستوفاة',
          validationRule: 'MANUAL_CHECK: SBC compliance',
          errorMessage: 'التصميم غير مطابق للكود السعودي',
          isBlocking: true
        },
        {
          id: 'CP-008',
          name: 'الأبعاد والمساحات',
          description: 'التحقق من صحة الأبعاد والمساحات المذكورة',
          criteria: 'الأبعاد صحيحة ومتطابقة',
          validationRule: 'MANUAL_CHECK: dimensions accuracy',
          errorMessage: 'هناك تباين في الأبعاد والمساحات',
          isBlocking: true
        },
        {
          id: 'CP-009',
          name: 'الارتدادات النظامية',
          description: 'التحقق من الالتزام بالارتدادات',
          criteria: 'الارتدادات ضمن المسموح',
          validationRule: 'MANUAL_CHECK: setbacks compliance',
          errorMessage: 'الارتدادات غير مستوفاة',
          isBlocking: true
        }
      ],
      isRequired: true,
      order: 3,
      failureAction: 'إيقاف',
      isActive: true,
      createdDate: '2024-02-01'
    },
    {
      id: 'VER-004',
      code: 'VER-LEG-001',
      name: 'المراجعة القانونية',
      description: 'التحقق من الجوانب القانونية والالتزامات',
      stage: 'المراجعة القانونية',
      type: 'تحقق يدوي',
      checkPoints: [
        {
          id: 'CP-010',
          name: 'حالة الملكية',
          description: 'التحقق من خلو الملكية من النزاعات',
          criteria: 'لا يوجد نزاعات قانونية',
          validationRule: 'MANUAL_CHECK: no legal disputes',
          errorMessage: 'هناك نزاعات قانونية على الملكية',
          isBlocking: true
        },
        {
          id: 'CP-011',
          name: 'التفويضات والوكالات',
          description: 'التحقق من صحة التفويضات',
          criteria: 'جميع التفويضات صحيحة وسارية',
          validationRule: 'MANUAL_CHECK: valid authorizations',
          errorMessage: 'التفويضات غير صحيحة أو منتهية',
          isBlocking: true
        },
        {
          id: 'CP-012',
          name: 'الالتزامات المالية',
          description: 'التحقق من سداد جميع الالتزامات',
          criteria: 'لا يوجد التزامات معلقة',
          validationRule: 'MANUAL_CHECK: no pending obligations',
          errorMessage: 'هناك التزامات مالية معلقة',
          isBlocking: false
        }
      ],
      isRequired: true,
      order: 4,
      failureAction: 'تحذير',
      isActive: true,
      createdDate: '2024-02-01'
    },
    {
      id: 'VER-005',
      code: 'VER-APPR-001',
      name: 'التحقق من الصلاحيات',
      description: 'التحقق من صلاحيات المستخدمين للإجراءات',
      stage: 'جميع المراحل',
      type: 'تحقق تلقائي',
      checkPoints: [
        {
          id: 'CP-013',
          name: 'صلاحيات المستخدم',
          description: 'التحقق من أن المستخدم لديه الصلاحيات المطلوبة',
          criteria: 'المستخدم لديه الصلاحية',
          validationRule: 'HAS_PERMISSION(user, action)',
          errorMessage: 'المستخدم لا يملك الصلاحية المطلوبة',
          isBlocking: true
        },
        {
          id: 'CP-014',
          name: 'مستوى الموافقة',
          description: 'التحقق من مستوى الموافقة المطلوب',
          criteria: 'المستوى كافٍ للإجراء',
          validationRule: 'approval_level >= required_level',
          errorMessage: 'يتطلب موافقة من مستوى أعلى',
          isBlocking: true
        }
      ],
      isRequired: true,
      order: 5,
      failureAction: 'إيقاف',
      isActive: true,
      createdDate: '2024-02-01'
    },
    {
      id: 'VER-006',
      code: 'VER-FIN-001',
      name: 'التحقق المالي',
      description: 'التحقق من سداد الرسوم والالتزامات المالية',
      stage: 'الاعتماد والختم',
      type: 'تحقق تلقائي',
      checkPoints: [
        {
          id: 'CP-015',
          name: 'سداد الرسوم',
          description: 'التحقق من سداد جميع الرسوم المستحقة',
          criteria: 'الرسوم مسددة بالكامل',
          validationRule: 'paid_amount >= total_fees',
          errorMessage: 'هناك رسوم غير مسددة',
          isBlocking: true
        },
        {
          id: 'CP-016',
          name: 'طريقة الدفع',
          description: 'التحقق من صحة طريقة الدفع',
          criteria: 'طريقة دفع صحيحة ومعتمدة',
          validationRule: 'VALIDATE_PAYMENT_METHOD(method)',
          errorMessage: 'طريقة الدفع غير صحيحة',
          isBlocking: true
        }
      ],
      isRequired: true,
      order: 6,
      failureAction: 'إيقاف',
      isActive: true,
      createdDate: '2024-02-01'
    }
  ]);

  // ===== تاب مستوى المعاملة =====
  const renderTransactionLevelTab = () => {
    const currentLevel = transactionLevels.find(
      l => (levelTab === 'simple' && l.name === 'معاملة بسيطة') || 
           (levelTab === 'complete' && l.name === 'معاملة كاملة')
    );

    if (!currentLevel) return null;

    return (
      <div className="space-y-3">
        {/* نوع المعاملة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Layers className="h-5 w-5 inline ml-2" />
                مستوى المعاملة
              </CardTitle>
              <Tabs value={levelTab} onValueChange={(v) => setLevelTab(v as 'simple' | 'complete')}>
                <TabsList className="grid w-[400px] grid-cols-2" style={{ direction: 'rtl' }}>
                  <TabsTrigger value="simple" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <FileCheck className="h-4 w-4 ml-2" />
                    معاملة بسيطة
                  </TabsTrigger>
                  <TabsTrigger value="complete" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Briefcase className="h-4 w-4 ml-2" />
                    معاملة كاملة
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* البطاقة الرئيسية */}
        <Card className="card-element card-rtl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  {levelTab === 'simple' ? (
                    <FileCheck className="h-8 w-8 text-white" />
                  ) : (
                    <Briefcase className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {currentLevel.name}
                    </h3>
                    <Badge variant="outline" className="font-mono">{currentLevel.code}</Badge>
                    {currentLevel.isActive && <Badge className="bg-green-500">مفعّل</Badge>}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {currentLevel.description}
                  </p>
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="grid grid-cols-6 gap-2 mt-3">
                {[
                  { label: 'عدد المراحل', value: currentLevel.stages.length, icon: GitBranch },
                  { label: 'المستندات', value: currentLevel.requiredDocuments.length, icon: FileText },
                  { label: 'الحد الأدنى', value: `${currentLevel.settings.minDuration} يوم`, icon: Clock },
                  { label: 'الحد الأقصى', value: `${currentLevel.settings.maxDuration} يوم`, icon: Clock },
                  { label: 'مستويات الاستعجال', value: currentLevel.urgencyLevels.length, icon: Zap },
                  { label: 'مستويات الأهمية', value: currentLevel.importancelevels.length, icon: Star },
                ].map((stat, i) => (
                  <div key={i} className="p-2 bg-white rounded-lg border">
                    <div className="flex items-center gap-1 mb-1">
                      {React.createElement(stat.icon, { className: 'h-3.5 w-3.5 text-blue-500' })}
                      <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مراحل المعاملة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <GitBranch className="h-5 w-5 inline ml-2" />
              مراحل المعاملة ({currentLevel.stages.length} مرحلة)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {currentLevel.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: stage.color + '20' }}>
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: stage.color }}>
                      {stage.order}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {stage.name}
                      </h4>
                      {stage.isOptional && <Badge variant="outline" className="text-xs">اختيارية</Badge>}
                      <Badge variant="secondary" className="text-xs">{stage.durationDays} يوم</Badge>
                      {stage.requiredApprovals > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {stage.requiredApprovals} موافقة
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {stage.description}
                    </p>
                  </div>
                  {index < currentLevel.stages.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* المستندات المطلوبة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <FileText className="h-5 w-5 inline ml-2" />
              المستندات المطلوبة ({currentLevel.requiredDocuments.length} مستند)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '30%' }}>
                    اسم المستند
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '25%' }}>
                    التصنيف
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '15%' }}>
                    الصيغ المقبولة
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '10%' }}>
                    الحجم الأقصى
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '10%' }}>
                    الصلاحية
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '10%' }}>
                    إلزامي
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLevel.requiredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {doc.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {doc.acceptedFormats.map((format, i) => (
                          <Badge key={i} variant="secondary" className="text-xs font-mono">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs font-mono">
                        {doc.maxSize} MB
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {doc.validityDays} يوم
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.isRequired ? (
                        <Badge className="bg-red-500 text-white text-xs">إلزامي</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">اختياري</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* مستويات الاستعجال */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Zap className="h-5 w-5 inline ml-2" />
              مستويات الاستعجال
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-3 gap-3">
              {currentLevel.urgencyLevels.map((urgency) => (
                <div key={urgency.id} className="p-3 rounded-lg border bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: urgency.color }}>
                      <span className="text-xs text-white" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {urgency.level}
                      </span>
                    </div>
                    <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {urgency.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {urgency.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>SLA:</span>
                      <Badge variant="outline" className="text-xs">{urgency.slaHours} ساعة</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيه كل:</span>
                      <Badge variant="outline" className="text-xs">{urgency.notificationFrequency} ساعة</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصعيد:</span>
                      {urgency.escalationEnabled ? (
                        <Badge className="bg-green-500 text-xs">مفعّل</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">معطّل</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* مستويات الأهمية */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Star className="h-5 w-5 inline ml-2" />
              مستويات الأهمية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-4 gap-3">
              {currentLevel.importancelevels.map((importance) => (
                <div key={importance.id} className="p-3 rounded-lg border bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: importance.color }}>
                      <span className="text-xs text-white" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {importance.level}
                      </span>
                    </div>
                    <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {importance.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {importance.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية:</span>
                      <Badge variant="outline" className="text-xs">{importance.priority}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>موافقة عليا:</span>
                      {importance.requiresHigherApproval ? (
                        <Badge className="bg-red-500 text-xs">مطلوبة</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">غير مطلوبة</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الإجراءات المطلوبة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <ListChecks className="h-5 w-5 inline ml-2" />
              الإجراءات المطلوبة ({currentLevel.procedures.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {currentLevel.procedures.map((procedure, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded border bg-white">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {procedure}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الإعدادات */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings className="h-5 w-5 inline ml-2" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <EnhancedSwitch
                  id={`auto-notif-${currentLevel.id}`}
                  checked={currentLevel.settings.autoNotifications}
                  onCheckedChange={() => {}}
                  label="التنبيهات التلقائية"
                  description="إرسال تنبيهات تلقائية عند كل مرحلة"
                  size="sm"
                  variant="success"
                />
              </div>
              <div className="space-y-2">
                <EnhancedSwitch
                  id={`req-approval-${currentLevel.id}`}
                  checked={currentLevel.settings.requiresApproval}
                  onCheckedChange={() => {}}
                  label="تتطلب موافقة"
                  description="يجب الحصول على موافقات في المراحل"
                  size="sm"
                  variant="warning"
                />
              </div>
              <div className="space-y-2">
                <EnhancedSwitch
                  id={`allow-mod-${currentLevel.id}`}
                  checked={currentLevel.settings.allowModification}
                  onCheckedChange={() => {}}
                  label="السماح بالتعديل"
                  description="إمكانية تعديل المعاملة بعد البدء"
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-4 gap-3">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحد الأدنى للمدة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  {currentLevel.settings.minDuration} يوم
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحد الأقصى للمدة
                </p>
                <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  {currentLevel.settings.maxDuration} يوم
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مستوى التتبع
                </p>
                <Badge variant="outline" className="text-xs">
                  {currentLevel.settings.trackingLevel === 'basic' ? 'أساسي' :
                   currentLevel.settings.trackingLevel === 'detailed' ? 'تفصيلي' :
                   'شامل'}
                </Badge>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ الإنشاء
                </p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  {currentLevel.createdDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Edit className="h-4 w-4 ml-2" />
            تعديل الإعدادات
          </Button>
          <Button style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Save className="h-4 w-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    );
  };

  // ===== تاب إجراءات التحقق =====
  const renderVerificationProceduresTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'إجمالي الإجراءات', value: verificationProcedures.length, icon: ShieldCheck, color: 'blue' },
          { label: 'تحقق تلقائي', value: verificationProcedures.filter(v => v.type === 'تحقق تلقائي').length, icon: Zap, color: 'green' },
          { label: 'تحقق يدوي', value: verificationProcedures.filter(v => v.type === 'تحقق يدوي').length, icon: UserCheck, color: 'purple' },
          { label: 'تحقق مختلط', value: verificationProcedures.filter(v => v.type === 'تحقق مختلط').length, icon: Workflow, color: 'orange' },
          { label: 'إلزامية', value: verificationProcedures.filter(v => v.isRequired).length, icon: AlertCircle, color: 'red' },
          { label: 'نشطة', value: verificationProcedures.filter(v => v.isActive).length, icon: CheckCircle, color: 'teal' },
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500` })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* قائمة الإجراءات */}
      {verificationProcedures.map((procedure) => (
        <Card key={procedure.id} className="card-element card-rtl">
          <CardHeader className="p-3 bg-gradient-to-l from-blue-50 to-white">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                      {procedure.name}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">{procedure.code}</Badge>
                    {procedure.isRequired && <Badge className="bg-red-500 text-xs">إلزامي</Badge>}
                    {procedure.isActive && <Badge className="bg-green-500 text-xs">نشط</Badge>}
                  </div>
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {procedure.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <GitBranch className="h-3 w-3 ml-1" />
                      {procedure.stage}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {procedure.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ترتيب: {procedure.order}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        procedure.failureAction === 'إيقاف' ? 'bg-red-500' :
                        procedure.failureAction === 'تحذير' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                    >
                      عند الفشل: {procedure.failureAction}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
              نقاط التحقق ({procedure.checkPoints.length}):
            </h4>
            <div className="space-y-2">
              {procedure.checkPoints.map((checkpoint, index) => (
                <div key={checkpoint.id} className="p-2 rounded border bg-white">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                          {checkpoint.name}
                        </h5>
                        {checkpoint.isBlocking && (
                          <Badge variant="destructive" className="text-xs">حاجز</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {checkpoint.description}
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="text-xs">
                          <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعيار: </span>
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{checkpoint.criteria}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>القاعدة: </span>
                          <code className="text-xs font-mono bg-gray-100 px-1 rounded">{checkpoint.validationRule}</code>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>رسالة الخطأ: </span>
                          <span className="text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{checkpoint.errorMessage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button size="lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-5 w-5 ml-2" />
          إضافة إجراء تحقق جديد
        </Button>
      </div>
    </div>
  );

  // رندر محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '701-16':
        return renderTransactionLevelTab();
      case '701-17':
        return renderVerificationProceduresTab();
      default:
        return (
          <Card className="card-element card-rtl">
            <CardContent className="p-8">
              <div className="text-center">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                  {TABS_CONFIG.find(t => t.id === activeTab)?.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  محتوى هذا التاب قيد التطوير
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex" style={{ direction: 'rtl', gap: '1rem', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد */}
      <div
        style={{
          width: '200px',
          minWidth: '200px',
          height: 'calc(100vh - 140px)',
          position: 'sticky',
          top: '70px',
          right: 0,
          background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
          borderLeft: '2px solid #e2e8f0',
          borderRadius: '12px 0 0 12px',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <ScrollArea className="h-full" style={{ '--scrollbar-width': '6px' } as React.CSSProperties}>
          <div className="p-2 space-y-0.5">
            {TABS_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isNew = tab.id === '701-16' || tab.id === '701-17';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full p-2 rounded-lg transition-all duration-200 text-right
                    flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-l from-[#3b82f6] to-[#2563eb] text-white border-2 border-[#3b82f6] shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#eff6ff] hover:shadow-sm'
                    }
                  `}
                  style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-1">
                      {tab.title}
                      {isNew && (
                        <Badge className="bg-green-500 text-[10px] px-1 py-0">جديد</Badge>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] mt-0.5 ${isActive ? 'border-white/50 text-white' : ''}`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {tab.number}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* محتوى الشاشة */}
      <div className="flex-1">
        <div className="space-y-3">
          {/* العنوان */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-5 w-5 inline ml-2" />
                  إعدادات المعاملات - المحسّنة
                </CardTitle>
                <Badge variant="outline" className="font-mono">
                  701
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSettings_Complete_701_v8_Enhanced;
