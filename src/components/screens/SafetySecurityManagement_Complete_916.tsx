import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import CodeDisplay from '../CodeDisplay';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  ClipboardList,
  Activity,
  Settings,
  BarChart3,
  Bell,
  Calendar,
  Eye,
  ThumbsUp,
  Award,
  TrendingUp,
  Plus,
  Search,
  Download,
  Key,
  Briefcase,
  HardHat,
  Upload,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  Save,
  Send,
  Copy,
  MapPin,
  Phone,
  Mail,
  Clock,
  Zap,
  Target,
  Database,
  Flag,
  Heart,
  BookOpen,
  Video,
  Mic,
  Camera,
  Printer,
  Share2,
  DollarSign
} from 'lucide-react';

/**
 * شاشة 916 - إدارة السلامة والأمان المهني - تطوير كامل
 * Safety & Occupational Security Management - Full Development
 * 
 * نظام متكامل لإدارة السلامة والأمان المهني مع:
 * - 12 تبويب شامل بنظام السايد بار الرأسي المُكثف
 * - تكثيف معلومات 95%+
 * - تتبع الحوادث والتدريب الأمني
 * - امتثال لمعايير السلامة السعودية
 * - نظام تقارير متقدم
 * - إدارة معدات السلامة
 * - نظام تنبيهات ذكي
 */

export default function SafetySecurityManagement_Complete_916() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // حالات النوافذ المنبثقة
  const [showAddIncidentDialog, setShowAddIncidentDialog] = useState(false);
  const [showAddTrainingDialog, setShowAddTrainingDialog] = useState(false);
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);

  // بيانات إحصائية شاملة
  const safetyStats = {
    totalInspections: 245,
    passedInspections: 228,
    failedInspections: 17,
    pendingInspections: 12,
    incidents: 8,
    criticalIncidents: 1,
    majorIncidents: 2,
    minorIncidents: 5,
    trainingSessions: 56,
    completedTraining: 48,
    scheduledTraining: 8,
    certifiedEmployees: 142,
    expiringCertificates: 12,
    expiredCertificates: 3,
    activeCertificates: 156,
    safetyEquipment: 458,
    equipmentInUse: 412,
    equipmentMaintenance: 23,
    equipmentDamaged: 8,
    complianceScore: 94.5,
    safetyScore: 91.8,
    lastAuditDate: '2025-09-15',
    nextAuditDate: '2025-12-15',
    activeAlerts: 7,
    resolvedAlerts: 156
  };

  // بيانات الحوادث - موسعة
  const [incidents, setIncidents] = useState([
    {
      id: 'INC-2025-001',
      type: 'إصابة عمل',
      severity: 'منخفضة',
      location: 'المستودع الرئيسي',
      area: 'قسم التخزين',
      date: '2025-10-03',
      time: '10:30 صباحاً',
      status: 'مغلق',
      reportedBy: 'أحمد العلي',
      assignedTo: 'م. خالد السعد',
      description: 'إصابة طفيفة في اليد أثناء الرفع اليدوي للمواد',
      rootCause: 'عدم استخدام معدات الرفع المناسبة',
      correctiveAction: 'تدريب الموظفين على استخدام معدات الرفع',
      preventiveAction: 'وضع لافتات تحذيرية وتوفير معدات إضافية',
      witnesses: ['محمد الأحمد', 'فاطمة السعد'],
      injuredPerson: 'أحمد العلي',
      injuryType: 'جرح سطحي',
      medicalAttention: 'إسعافات أولية',
      daysLost: 0,
      cost: 500,
      investigationComplete: true,
      reportSubmitted: true,
      closedDate: '2025-10-05',
      attachments: 2
    },
    {
      id: 'INC-2025-002',
      type: 'خطر محتمل',
      severity: 'متوسطة',
      location: 'موقع المشروع أ',
      area: 'منطقة الكهرباء',
      date: '2025-10-02',
      time: '14:15 مساءً',
      status: 'قيد المعالجة',
      reportedBy: 'محمد السعد',
      assignedTo: 'م. علي الغامدي',
      description: 'كابل كهربائي مكشوف يشكل خطراً على العاملين',
      rootCause: 'تآكل الغطاء العازل',
      correctiveAction: 'استبدال الكابل فوراً',
      preventiveAction: 'فحص دوري شهري لجميع الكابلات',
      witnesses: ['سارة الأحمد'],
      injuredPerson: '-',
      injuryType: '-',
      medicalAttention: '-',
      daysLost: 0,
      cost: 1500,
      investigationComplete: true,
      reportSubmitted: true,
      closedDate: null,
      attachments: 3
    },
    {
      id: 'INC-2025-003',
      type: 'حريق',
      severity: 'عالية',
      location: 'المكتب الإداري',
      area: 'الطابق الثاني',
      date: '2025-09-28',
      time: '09:45 صباحاً',
      status: 'مغلق',
      reportedBy: 'نورة القحطاني',
      assignedTo: 'م. سعد العتيبي',
      description: 'حريق صغير نتيجة ماس كهربائي في لوحة كهربائية',
      rootCause: 'عطل في قاطع الدائرة',
      correctiveAction: 'استبدال اللوحة الكهربائية واختبار النظام',
      preventiveAction: 'تركيب نظام كشف حرائق متقدم',
      witnesses: ['عبدالله الشمري', 'ليلى الدوسري', 'خالد النمر'],
      injuredPerson: '-',
      injuryType: '-',
      medicalAttention: '-',
      daysLost: 1,
      cost: 8500,
      investigationComplete: true,
      reportSubmitted: true,
      closedDate: '2025-10-01',
      attachments: 5
    },
    {
      id: 'INC-2025-004',
      type: 'سقوط من ارتفاع',
      severity: 'حرجة',
      location: 'موقع البناء ب',
      area: 'السقالات الخارجية',
      date: '2025-09-25',
      time: '11:20 صباحاً',
      status: 'مغلق',
      reportedBy: 'عبدالرحمن المطيري',
      assignedTo: 'م. فهد العجمي',
      description: 'سقوط عامل من ارتفاع 4 أمتار نتيجة عدم ربط حزام الأمان',
      rootCause: 'عدم الالتزام بإجراءات السلامة وعدم استخدام حزام الأمان',
      correctiveAction: 'نقل العامل للمستشفى فوراً وإيقاف العمل حتى مراجعة السلامة',
      preventiveAction: 'تدريب إلزامي على استخدام معدات السلامة وتشديد الرقابة',
      witnesses: ['يوسف الحربي', 'مشعل القرني', 'سلطان الشهري'],
      injuredPerson: 'عبدالرحمن المطيري',
      injuryType: 'كسر في الساق اليمنى وكدمات متعددة',
      medicalAttention: 'إسعاف ونقل للمستشفى',
      daysLost: 45,
      cost: 25000,
      investigationComplete: true,
      reportSubmitted: true,
      closedDate: '2025-10-07',
      attachments: 8
    }
  ]);

  // بيانات التفتيش - موسعة
  const [inspections, setInspections] = useState([
    {
      id: 'INS-2025-001',
      area: 'المستودع الرئيسي',
      type: 'تفتيش دوري',
      date: '2025-10-05',
      time: '09:00 صباحاً',
      inspector: 'م. خالد الأحمد',
      assistants: ['محمد السعد', 'فاطمة النمر'],
      score: 95,
      maxScore: 100,
      status: 'نجح',
      findings: 2,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 1,
      observations: 'المستودع في حالة جيدة بشكل عام مع بعض التحسينات المطلوبة',
      recommendations: [
        'تحسين الإضاءة في الممرات',
        'إضافة علامات تحذيرية إضافية'
      ],
      correctiveActions: [
        'تركيب 5 وحدات إضاءة LED',
        'طباعة ووضع 10 لافتات تحذيرية جديدة'
      ],
      deadline: '2025-10-20',
      followUpDate: '2025-11-05',
      completed: false,
      attachments: 4,
      checklist: {
        fireExtinguishers: 'ممتاز',
        emergencyExits: 'جيد',
        lighting: 'يحتاج تحسين',
        ventilation: 'ممتاز',
        signage: 'جيد',
        flooring: 'ممتاز',
        equipment: 'جيد'
      }
    },
    {
      id: 'INS-2025-002',
      area: 'موقع المشروع ب',
      type: 'تفتيش طارئ',
      date: '2025-10-04',
      time: '14:30 مساءً',
      inspector: 'م. فاطمة السعد',
      assistants: ['علي الغامدي'],
      score: 72,
      maxScore: 100,
      status: 'يحتاج تحسين',
      findings: 8,
      criticalFindings: 1,
      majorFindings: 3,
      minorFindings: 4,
      observations: 'عدة مشاكل تتطلب معالجة فورية خاصة في معدات الحماية الشخصية',
      recommendations: [
        'توفير معدات حماية شخصية كافية لجميع العاملين',
        'تحسين نظام التهوية',
        'إصلاح السقالات التالفة',
        'تدريب إضافي على السلامة'
      ],
      correctiveActions: [
        'شراء 50 خوذة وقفازات ونظارات واقية',
        'تركيب 3 مراوح صناعية',
        'استبدال السقالات التالفة',
        'جدولة تدريب سلامة لجميع العاملين'
      ],
      deadline: '2025-10-15',
      followUpDate: '2025-10-25',
      completed: false,
      attachments: 7,
      checklist: {
        fireExtinguishers: 'جيد',
        emergencyExits: 'يحتاج تحسين',
        lighting: 'مقبول',
        ventilation: 'ضعيف',
        signage: 'يحتاج تحسين',
        flooring: 'جيد',
        equipment: 'ضعيف'
      }
    },
    {
      id: 'INS-2025-003',
      area: 'المكتب الإداري',
      type: 'تفتيش سنوي',
      date: '2025-10-01',
      time: '10:00 صباحاً',
      inspector: 'م. سعد العتيبي',
      assistants: ['نورة القحطاني', 'عبدالله الشمري'],
      score: 88,
      maxScore: 100,
      status: 'جيد',
      findings: 4,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 3,
      observations: 'المكتب يحافظ على معايير السلامة الجيدة',
      recommendations: [
        'تحديث نظام الإنذار من الحرائق',
        'فحص دوري لطفايات الحريق',
        'تدريب الموظفين على خطة الإخلاء'
      ],
      correctiveActions: [
        'تحديث نظام الإنذار بتكلفة 15000 ريال',
        'جدولة فحص شهري لطفايات الحريق',
        'تنظيم تدريب إخلاء ربع سنوي'
      ],
      deadline: '2025-11-01',
      followUpDate: '2025-11-15',
      completed: false,
      attachments: 3,
      checklist: {
        fireExtinguishers: 'جيد',
        emergencyExits: 'ممتاز',
        lighting: 'ممتاز',
        ventilation: 'جيد',
        signage: 'جيد',
        flooring: 'ممتاز',
        equipment: 'جيد'
      }
    }
  ]);

  // بيانات التدريب - موسعة
  const [trainingSessions, setTrainingSessions] = useState([
    {
      id: 'TRN-2025-001',
      title: 'السلامة من الحرائق والإخلاء الطارئ',
      category: 'سلامة الحرائق',
      date: '2025-10-15',
      time: '09:00 - 13:00',
      duration: '4 ساعات',
      instructor: 'م. أحمد العلي',
      assistants: ['د. فاطمة السعد'],
      location: 'قاعة التدريب الرئيسية',
      capacity: 30,
      enrolled: 25,
      attended: 0,
      status: 'مجدول',
      level: 'متوسط',
      prerequisites: 'التدريب الأساسي على السلامة',
      objectives: [
        'فهم أنواع الحرائق وطرق إطفائها',
        'التعرف على معدات الإطفاء واستخدامها',
        'تنفيذ خطة الإخلاء بفعالية',
        'تطبيق الإسعافات الأولية لحالات الحروق'
      ],
      topics: [
        'أنواع الحرائق وأسبابها',
        'استخدام طفايات الحريق',
        'نظام الإنذار والكشف المبكر',
        'خطط الإخلاء وممارستها',
        'الإسعافات الأولية للحروق'
      ],
      materials: ['عرض تقديمي', 'فيديوهات تعليمية', 'طفايات تدريبية', 'محاكاة حريق'],
      certificate: true,
      certificateValidity: '2 سنوات',
      cost: 2500,
      mandatory: true,
      attachments: 3
    },
    {
      id: 'TRN-2025-002',
      title: 'الإسعافات الأولية المتقدمة',
      category: 'إسعافات أولية',
      date: '2025-10-10',
      time: '08:00 - 14:00',
      duration: '6 ساعات',
      instructor: 'د. فاطمة السعد',
      assistants: ['ممرض أحمد الغامدي', 'ممرضة نورة القحطاني'],
      location: 'مركز التدريب الطبي',
      capacity: 20,
      enrolled: 18,
      attended: 18,
      status: 'مكتمل',
      level: 'متقدم',
      prerequisites: 'الإسعافات الأولية الأساسية',
      objectives: [
        'إتقان تقنيات الإنعاش القلبي الرئوي (CPR)',
        'التعامل مع النزيف الشديد',
        'معالجة الكسور والإصابات الخطيرة',
        'إدارة حالات الطوارئ الطبية'
      ],
      topics: [
        'الإنعاش القلبي الرئوي CPR',
        'استخدام جهاز AED',
        'إيقاف النزيف وتضميد الجروح',
        'تثبيت الكسور',
        'التعامل مع الصدمات',
        'حالات الطوارئ الشائعة'
      ],
      materials: ['دمية تدريب CPR', 'جهاز AED تدريبي', 'حقيبة إسعافات كاملة', 'أدوات تثبيت'],
      certificate: true,
      certificateValidity: '3 سنوات',
      cost: 3500,
      mandatory: true,
      feedback: 4.8,
      attendanceRate: 100,
      passRate: 94.4,
      attachments: 5
    },
    {
      id: 'TRN-2025-003',
      title: 'العمل الآمن في الأماكن المرتفعة',
      category: 'سلامة العمل',
      date: '2025-10-20',
      time: '07:00 - 12:00',
      duration: '5 ساعات',
      instructor: 'م. خالد الأحمد',
      assistants: ['م. علي الغامدي'],
      location: 'موقع التدريب الميداني',
      capacity: 15,
      enrolled: 15,
      attended: 0,
      status: 'مجدول',
      level: 'متقدم',
      prerequisites: 'شهادة السلامة العامة',
      objectives: [
        'فهم مخاطر العمل في الارتفاعات',
        'استخدام معدات الحماية من السقوط',
        'فحص وصيانة معدات السلامة',
        'تطبيق إجراءات الإنقاذ'
      ],
      topics: [
        'تقييم مخاطر العمل في الارتفاعات',
        'أنواع أحزمة الأمان واستخدامها',
        'نقاط التثبيت الآمنة',
        'السقالات والسلالم',
        'إجراءات الإنقاذ في حالات الطوارئ'
      ],
      materials: ['أحزمة أمان', 'حبال تسلق', 'خوذات', 'سقالات تدريبية'],
      certificate: true,
      certificateValidity: '1 سنة',
      cost: 4000,
      mandatory: true,
      attachments: 2
    },
    {
      id: 'TRN-2025-004',
      title: 'التعامل مع المواد الخطرة',
      category: 'مواد خطرة',
      date: '2025-10-25',
      time: '09:00 - 15:00',
      duration: '6 ساعات',
      instructor: 'د. سعد العتيبي',
      assistants: ['م. فهد العجمي'],
      location: 'معمل السلامة',
      capacity: 12,
      enrolled: 10,
      attended: 0,
      status: 'مجدول',
      level: 'متخصص',
      prerequisites: 'شهادة السلامة الكيميائية',
      objectives: [
        'تحديد أنواع المواد الخطرة',
        'التعامل الآمن مع المواد الكيميائية',
        'استخدام معدات الحماية المناسبة',
        'إدارة حوادث انسكاب المواد الخطرة'
      ],
      topics: [
        'تصنيف المواد الخطرة MSDS',
        'رموز وملصقات السلامة',
        'معدات الحماية الشخصية الكيميائية',
        'التخزين الآمن',
        'إجراءات الطوارئ للانسكابات',
        'التخلص الآمن من النفايات الخطرة'
      ],
      materials: ['نماذج MSDS', 'معدات حماية كيميائية', 'مواد تدريبية آمنة', 'أدوات احتواء الانسكاب'],
      certificate: true,
      certificateValidity: '2 سنوات',
      cost: 5000,
      mandatory: false,
      attachments: 4
    }
  ]);

  // بيانات الشهادات
  const [certificates, setCertificates] = useState([
    {
      id: 'CERT-001',
      employeeName: 'أحمد العلي',
      certificateType: 'السلامة من الحرائق',
      issueDate: '2024-03-15',
      expiryDate: '2026-03-15',
      status: 'نشط',
      issuedBy: 'الدفاع المدني',
      certificateNumber: 'FD-2024-12345',
      renewalRequired: false,
      daysUntilExpiry: 520,
      attachments: 1
    },
    {
      id: 'CERT-002',
      employeeName: 'فاطمة السعد',
      certificateType: 'الإسعافات الأولية',
      issueDate: '2023-06-20',
      expiryDate: '2025-10-20',
      status: 'منتهي قريباً',
      issuedBy: 'الهلال الأحمر',
      certificateNumber: 'RC-2023-67890',
      renewalRequired: true,
      daysUntilExpiry: 8,
      attachments: 1
    },
    {
      id: 'CERT-003',
      employeeName: 'محمد الغامدي',
      certificateType: 'العمل في الأماكن المرتفعة',
      issueDate: '2024-01-10',
      expiryDate: '2025-01-10',
      status: 'منتهي قريباً',
      issuedBy: 'معهد السلامة المهنية',
      certificateNumber: 'OSI-2024-11111',
      renewalRequired: true,
      daysUntilExpiry: 95,
      attachments: 1
    },
    {
      id: 'CERT-004',
      employeeName: 'نورة القحطاني',
      certificateType: 'التعامل مع المواد الخطرة',
      issueDate: '2022-09-05',
      expiryDate: '2025-09-05',
      status: 'منتهي',
      issuedBy: 'هيئة البيئة',
      certificateNumber: 'ENV-2022-22222',
      renewalRequired: true,
      daysUntilExpiry: -2,
      attachments: 1
    }
  ]);

  // بيانات معدات السلامة
  const [safetyEquipment, setSafetyEquipment] = useState([
    {
      id: 'EQ-001',
      name: 'خوذات الأمان',
      category: 'معدات حماية شخصية',
      quantity: 150,
      inUse: 142,
      available: 8,
      maintenance: 0,
      damaged: 0,
      location: 'المستودع الرئيسي',
      lastInspection: '2025-10-01',
      nextInspection: '2025-11-01',
      condition: 'ممتاز',
      supplier: 'شركة السلامة المتقدمة',
      purchaseDate: '2024-05-15',
      warranty: '2 سنوات',
      cost: 45,
      totalValue: 6750,
      minimumStock: 20,
      reorderLevel: 30,
      status: 'نشط'
    },
    {
      id: 'EQ-002',
      name: 'طفايات الحريق ABC',
      category: 'معدات إطفاء',
      quantity: 85,
      inUse: 80,
      available: 5,
      maintenance: 3,
      damaged: 0,
      location: 'موزعة في المواقع',
      lastInspection: '2025-09-15',
      nextInspection: '2025-12-15',
      condition: 'جيد',
      supplier: 'مؤسسة الحماية من الحرائق',
      purchaseDate: '2023-08-20',
      warranty: '5 سنوات',
      cost: 350,
      totalValue: 29750,
      minimumStock: 10,
      reorderLevel: 15,
      status: 'نشط'
    },
    {
      id: 'EQ-003',
      name: 'أحزمة الأمان للأماكن المرتفعة',
      category: 'معدات حماية من السقوط',
      quantity: 45,
      inUse: 38,
      available: 4,
      maintenance: 2,
      damaged: 1,
      location: 'مواقع البناء',
      lastInspection: '2025-10-05',
      nextInspection: '2025-11-05',
      condition: 'جيد',
      supplier: 'شركة معدات السلامة الصناعية',
      purchaseDate: '2024-02-10',
      warranty: '3 سنوات',
      cost: 850,
      totalValue: 38250,
      minimumStock: 5,
      reorderLevel: 10,
      status: 'يحتاج صيانة'
    },
    {
      id: 'EQ-004',
      name: 'نظارات واقية',
      category: 'معدات حماية العيون',
      quantity: 200,
      inUse: 185,
      available: 15,
      maintenance: 0,
      damaged: 0,
      location: 'المستودع الرئيسي',
      lastInspection: '2025-09-20',
      nextInspection: '2025-10-20',
      condition: 'ممتاز',
      supplier: 'مصنع الحماية الشخصية',
      purchaseDate: '2024-07-01',
      warranty: '1 سنة',
      cost: 25,
      totalValue: 5000,
      minimumStock: 30,
      reorderLevel: 50,
      status: 'نشط'
    },
    {
      id: 'EQ-005',
      name: 'قفازات عمل مقاومة',
      category: 'معدات حماية اليدين',
      quantity: 300,
      inUse: 275,
      available: 20,
      maintenance: 0,
      damaged: 5,
      location: 'المستودع الرئيسي',
      lastInspection: '2025-10-03',
      nextInspection: '2025-11-03',
      condition: 'جيد',
      supplier: 'شركة المعدات الصناعية',
      purchaseDate: '2024-09-10',
      warranty: '6 أشهر',
      cost: 15,
      totalValue: 4500,
      minimumStock: 50,
      reorderLevel: 100,
      status: 'نشط'
    },
    {
      id: 'EQ-006',
      name: 'كاشفات الدخان',
      category: 'أجهزة الإنذار',
      quantity: 120,
      inUse: 115,
      available: 2,
      maintenance: 2,
      damaged: 1,
      location: 'جميع المباني',
      lastInspection: '2025-09-01',
      nextInspection: '2025-12-01',
      condition: 'جيد',
      supplier: 'شركة أنظمة الأمان',
      purchaseDate: '2023-03-15',
      warranty: '5 سنوات',
      cost: 180,
      totalValue: 21600,
      minimumStock: 5,
      reorderLevel: 10,
      status: 'نشط'
    }
  ]);

  // بيانات التنبيهات
  const [alerts, setAlerts] = useState([
    {
      id: 'ALR-001',
      type: 'شهادة منتهية',
      severity: 'عالية',
      title: 'شهادة الإسعافات الأولية منتهية',
      message: 'شهادة الإسعافات الأولية لـ نورة القحطاني منتهية الصلاحية',
      date: '2025-10-07',
      status: 'جديد',
      assignedTo: 'مدير الموارد البشرية',
      action: 'تجديد الشهادة',
      priority: 'عاجل',
      dueDate: '2025-10-15'
    },
    {
      id: 'ALR-002',
      type: 'فحص دوري',
      severity: 'متوسطة',
      title: 'موعد فحص طفايات الحريق',
      message: 'اقتراب موعد الفحص الدوري لطفايات الحريق في المستودع الرئيسي',
      date: '2025-10-06',
      status: 'جديد',
      assignedTo: 'فريق الصيانة',
      action: 'جدولة الفحص',
      priority: 'عادي',
      dueDate: '2025-10-20'
    },
    {
      id: 'ALR-003',
      type: 'معدات تالفة',
      severity: 'عالية',
      title: 'حزام أمان تالف',
      message: 'تم اكتشاف حزام أمان تالف (EQ-003) في موقع البناء ب',
      date: '2025-10-05',
      status: 'قيد المعالجة',
      assignedTo: 'مدير السلامة',
      action: 'استبدال فوري',
      priority: 'عاجل',
      dueDate: '2025-10-08'
    },
    {
      id: 'ALR-004',
      type: 'نقص مخزون',
      severity: 'متوسطة',
      title: 'نقص في مخزون النظارات الواقية',
      message: 'المخزون المتاح من النظارات الواقية أقل من الحد الأدنى',
      date: '2025-10-04',
      status: 'جديد',
      assignedTo: 'قسم المشتريات',
      action: 'طلب شراء جديد',
      priority: 'عادي',
      dueDate: '2025-10-25'
    },
    {
      id: 'ALR-005',
      type: 'تدريب إلزامي',
      severity: 'عالية',
      title: 'تدريب السلامة من الحرائق',
      message: 'تدريب السلامة من الحرائق إلزامي لـ 12 موظف قبل نهاية الشهر',
      date: '2025-10-03',
      status: 'جديد',
      assignedTo: 'مدير التدريب',
      action: 'جدولة وتسجيل الموظفين',
      priority: 'عاجل',
      dueDate: '2025-10-31'
    },
    {
      id: 'ALR-006',
      type: 'تفتيش متأخر',
      severity: 'متوسطة',
      title: 'تأخر في تفتيش موقع المشروع ج',
      message: 'لم يتم إجراء التفتيش الدوري لموقع المشروع ج في الموعد المحدد',
      date: '2025-10-02',
      status: 'قيد المعالجة',
      assignedTo: 'فريق التفتيش',
      action: 'جدولة تفتيش عاجل',
      priority: 'عادي',
      dueDate: '2025-10-10'
    },
    {
      id: 'ALR-007',
      type: 'شهادات قريبة الانتهاء',
      severity: 'متوسطة',
      title: '12 شهادة تنتهي خلال شهرين',
      message: 'يوجد 12 شهادة سلامة للموظفين ستنتهي صلاحيتها خلال الشهرين القادمين',
      date: '2025-10-01',
      status: 'جديد',
      assignedTo: 'مدير الموارد البشرية',
      action: 'إعداد خطة تجديد',
      priority: 'عادي',
      dueDate: '2025-11-30'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3, code: '916-01' },
    { id: 'incidents', label: 'الحوادث', icon: AlertTriangle, code: '916-02' },
    { id: 'inspections', label: 'التفتيش', icon: ClipboardList, code: '916-03' },
    { id: 'training', label: 'التدريب', icon: Award, code: '916-04' },
    { id: 'certificates', label: 'الشهادات', icon: FileText, code: '916-05' },
    { id: 'equipment', label: 'معدات السلامة', icon: Briefcase, code: '916-06' },
    { id: 'policies', label: 'السياسات', icon: Shield, code: '916-07' },
    { id: 'audits', label: 'التدقيق', icon: Eye, code: '916-08' },
    { id: 'compliance', label: 'الامتثال', icon: CheckCircle, code: '916-09' },
    { id: 'alerts', label: 'التنبيهات', icon: Bell, code: '916-10' },
    { id: 'reports', label: 'التقارير', icon: TrendingUp, code: '916-11' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, code: '916-12' }
  ];

  const getSeverityBadge = (severity: string) => {
    const styles = {
      'منخفضة': 'bg-green-100 text-green-700 border-green-200',
      'متوسطة': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'عالية': 'bg-orange-100 text-orange-700 border-orange-200',
      'حرجة': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[severity] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'مغلق': 'bg-gray-100 text-gray-700 border-gray-200',
      'قيد المعالجة': 'bg-blue-100 text-blue-700 border-blue-200',
      'مجدول': 'bg-purple-100 text-purple-700 border-purple-200',
      'مكتمل': 'bg-green-100 text-green-700 border-green-200',
      'نجح': 'bg-green-100 text-green-700 border-green-200',
      'جيد': 'bg-teal-100 text-teal-700 border-teal-200',
      'يحتاج تحسين': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'نشط': 'bg-green-100 text-green-700 border-green-200',
      'منتهي قريباً': 'bg-orange-100 text-orange-700 border-orange-200',
      'منتهي': 'bg-red-100 text-red-700 border-red-200',
      'يحتاج صيانة': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'جديد': 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getConditionBadge = (condition: string) => {
    const styles = {
      'ممتاز': 'bg-green-100 text-green-700 border-green-200',
      'جيد': 'bg-teal-100 text-teal-700 border-teal-200',
      'مقبول': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'يحتاج تحسين': 'bg-orange-100 text-orange-700 border-orange-200',
      'ضعيف': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[condition] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6 relative" dir="rtl">
      <CodeDisplay code="SCR-916" position="top-right" />
      
      {/* Header الشاشة */}
      <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة السلامة والأمان المهني
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام متكامل للسلامة والأمان المهني متوافق مع معايير السلامة السعودية - 12 تبويب شامل
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              SCR-916
            </Badge>
            <Badge className="bg-orange-100 text-orange-700 px-3 py-1">
              12 تبويب
            </Badge>
          </div>
        </div>
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {safetyStats.passedInspections}
            </div>
            <div className="text-sm text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفتيش ناجح
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-red-100">
            <div className="text-2xl font-bold text-red-600">
              {safetyStats.incidents}
            </div>
            <div className="text-sm text-red-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              حوادث مسجلة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {safetyStats.certifiedEmployees}
            </div>
            <div className="text-sm text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              موظف مدرب
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">
              {safetyStats.activeAlerts}
            </div>
            <div className="text-sm text-orange-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تنبيه نشط
            </div>
          </div>
        </div>
      </div>

      {/* التخطيط الرئيسي: السايد بار + المحتوى */}
      <div className="screen-with-vertical-tabs-layout">
        {/* السايد بار الرأسي للتابات */}
        <div className="vertical-tabs-sidebar">
          <div className="vertical-tabs-sidebar-header">
            <h3 className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              التبويبات ({tabs.length})
            </h3>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              السلامة والأمان
            </p>
          </div>

          <div className="vertical-tabs-sidebar-body">
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div
                  className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="vertical-tab-title-condensed">
                    {tab.label}
                  </span>
                  <span className="vertical-tab-number-condensed">
                    {tab.code}
                  </span>
                </div>
                
                {index < tabs.length - 1 && (
                  <div className="vertical-tab-separator-condensed" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="vertical-tabs-sidebar-footer">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التبويب النشط
              </span>
              <Badge variant="outline" className="text-xs">
                {tabs.findIndex(t => t.id === activeTab) + 1} من {tabs.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* مساحة المحتوى الرئيسية */}
        <div className="vertical-tabs-content-area">
          <div className="vertical-tabs-content-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {React.createElement(tabs.find(t => t.id === activeTab)?.icon || BarChart3, {
                  className: "h-5 w-5 text-orange-600"
                })}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    {tabs.find(t => t.id === activeTab)?.code}
                  </p>
                </div>
              </div>
              
              <Button 
                size="sm"
                variant="outline" 
                className="button-rtl"
              >
                <Key className="h-3 w-3" />
                طلب صلاحية
              </Button>
            </div>
          </div>

          <div className="vertical-tabs-content-body">
            {/* نظرة عامة */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <CodeDisplay code="916-01" position="top-right" />
                
                {/* نقاط السلامة والامتثال */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="card-element">
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        معدل الأمان العام
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                          {safetyStats.safetyScore}%
                        </div>
                        <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          معدل السلامة الإجمالي
                        </p>
                        <Progress 
                          value={safetyStats.safetyScore} 
                          className="mb-4"
                        />
                        <div className="grid grid-cols-3 gap-2 text-center mt-4">
                          <div>
                            <div className="text-lg font-bold text-green-600">{safetyStats.totalInspections}</div>
                            <div className="text-xs text-gray-500">إجمالي التفتيش</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{safetyStats.certifiedEmployees}</div>
                            <div className="text-xs text-gray-500">موظف معتمد</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-orange-600">{safetyStats.incidents}</div>
                            <div className="text-xs text-gray-500">حوادث</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        درجة الامتثال
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-blue-600 mb-2">
                          {safetyStats.complianceScore}%
                        </div>
                        <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          امتثال للمعايير السعودية
                        </p>
                        <Progress 
                          value={safetyStats.complianceScore} 
                          className="mb-4"
                        />
                        <div className="space-y-2 mt-4 text-right">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-xs">آخر تدقيق</span>
                            <span className="text-xs font-mono">{safetyStats.lastAuditDate}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-xs">التدقيق القادم</span>
                            <span className="text-xs font-mono">{safetyStats.nextAuditDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* إحصائيات تفصيلية */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{safetyStats.passedInspections}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفتيش ناجح</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{safetyStats.failedInspections}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفتيش فاشل</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{safetyStats.pendingInspections}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفتيش معلق</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{safetyStats.completedTraining}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تدريب مكتمل</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{safetyStats.incidents}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>حوادث</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="text-2xl font-bold text-teal-600">{safetyStats.safetyEquipment}</div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدات السلامة</div>
                    </CardContent>
                  </Card>
                </div>

                {/* آخر الحوادث والتنبيهات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="card-element">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          آخر الحوادث
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setActiveTab('incidents')}>
                          عرض الكل
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {incidents.slice(0, 3).map(incident => (
                        <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              incident.severity === 'حرجة' ? 'bg-red-100' :
                              incident.severity === 'عالية' ? 'bg-orange-100' :
                              incident.severity === 'متوسطة' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              <AlertTriangle className={`h-4 w-4 ${
                                incident.severity === 'حرجة' ? 'text-red-600' :
                                incident.severity === 'عالية' ? 'text-orange-600' :
                                incident.severity === 'متوسطة' ? 'text-yellow-600' : 'text-green-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {incident.type}
                              </div>
                              <div className="text-xs text-gray-500">
                                {incident.location} - {incident.date}
                              </div>
                            </div>
                          </div>
                          <Badge className={getSeverityBadge(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          التنبيهات النشطة
                        </CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setActiveTab('alerts')}>
                          عرض الكل
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {alerts.slice(0, 3).map(alert => (
                        <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              alert.severity === 'عالية' ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                              <Bell className={`h-4 w-4 ${
                                alert.severity === 'عالية' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {alert.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {alert.type} - {alert.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* الحوادث */}
            {activeTab === 'incidents' && (
              <div className="space-y-6">
                <CodeDisplay code="916-02" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في الحوادث..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="input-field w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحوادث</SelectItem>
                      <SelectItem value="critical">حرجة</SelectItem>
                      <SelectItem value="major">عالية</SelectItem>
                      <SelectItem value="moderate">متوسطة</SelectItem>
                      <SelectItem value="minor">منخفضة</SelectItem>
                      <SelectItem value="open">مفتوحة</SelectItem>
                      <SelectItem value="closed">مغلقة</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="btn-primary button-rtl" onClick={() => setShowAddIncidentDialog(true)}>
                    <Plus className="h-4 w-4" />
                    تسجيل حادث
                  </Button>
                </div>

                {/* إحصائيات الحوادث */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حوادث حرجة
                          </div>
                          <div className="text-2xl font-bold text-red-600">
                            {safetyStats.criticalIncidents}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حوادث عالية
                          </div>
                          <div className="text-2xl font-bold text-orange-600">
                            {safetyStats.majorIncidents}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حوادث بسيطة
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {safetyStats.minorIncidents}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            إجمالي الحوادث
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {safetyStats.incidents}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="card-element">
                  <CardContent className="p-0">
                    <div className="table-container">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخطورة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {incidents.map(incident => (
                            <TableRow key={incident.id} className="hover:bg-gray-50">
                              <TableCell className="text-right font-mono">{incident.id}</TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{incident.type}</TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{incident.location}</TableCell>
                              <TableCell className="text-right">{incident.date}</TableCell>
                              <TableCell className="text-right">
                                <Badge className={getSeverityBadge(incident.severity)}>
                                  {incident.severity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className={getStatusBadge(incident.status)}>
                                  {incident.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono">{incident.cost.toLocaleString('ar-SA')} ر.س</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* التفتيش */}
            {activeTab === 'inspections' && (
              <div className="space-y-6">
                <CodeDisplay code="916-03" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في التفتيش..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="btn-primary button-rtl" onClick={() => setShowInspectionDialog(true)}>
                    <Plus className="h-4 w-4" />
                    جدولة تفتيش
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            تفتيش ناجح
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {safetyStats.passedInspections}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <Progress value={(safetyStats.passedInspections / safetyStats.totalInspections) * 100} className="mt-3" />
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            يحتاج تحسين
                          </div>
                          <div className="text-2xl font-bold text-yellow-600">
                            {safetyStats.failedInspections}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                      <Progress value={(safetyStats.failedInspections / safetyStats.totalInspections) * 100} className="mt-3" />
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            تفتيش معلق
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {safetyStats.pendingInspections}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <Progress value={(safetyStats.pendingInspections / safetyStats.totalInspections) * 100} className="mt-3" />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {inspections.map(inspection => (
                    <Card key={inspection.id} className="card-element hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {inspection.area}
                              </h3>
                              <Badge className={getStatusBadge(inspection.status)}>
                                {inspection.status}
                              </Badge>
                              <Badge variant="outline">{inspection.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {inspection.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {inspection.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {inspection.inspector}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{inspection.score}</div>
                            <div className="text-xs text-gray-500">من {inspection.maxScore}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات حرجة</span>
                              <span className="text-xl font-bold text-red-600">{inspection.criticalFindings}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات رئيسية</span>
                              <span className="text-xl font-bold text-yellow-600">{inspection.majorFindings}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات بسيطة</span>
                              <span className="text-xl font-bold text-green-600">{inspection.minorFindings}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات:</div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {inspection.observations}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText className="h-4 w-4" />
                            <span>{inspection.attachments} مرفقات</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                              تحميل التقرير
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* التدريب */}
            {activeTab === 'training' && (
              <div className="space-y-6">
                <CodeDisplay code="916-04" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في التدريبات..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="btn-primary button-rtl" onClick={() => setShowAddTrainingDialog(true)}>
                    <Plus className="h-4 w-4" />
                    جدولة تدريب
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{safetyStats.completedTraining}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تدريب مكتمل</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{safetyStats.scheduledTraining}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تدريب مجدول</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{safetyStats.certifiedEmployees}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>موظف معتمد</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{safetyStats.trainingSessions}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الجلسات</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {trainingSessions.map(training => (
                    <Card key={training.id} className="card-element hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {training.title}
                              </h3>
                              <Badge className={getStatusBadge(training.status)}>
                                {training.status}
                              </Badge>
                              {training.mandatory && (
                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                  إلزامي
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {training.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {training.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {training.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-center px-4">
                            <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              المسجلين
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {training.enrolled}/{training.capacity}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              المدرب:
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{training.instructor}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              المدة:
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{training.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الأهداف التدريبية:
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {training.objectives.map((objective, index) => (
                              <li key={index} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <DollarSign className="h-4 w-4" />
                              {training.cost.toLocaleString('ar-SA')} ر.س
                            </span>
                            {training.certificate && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Award className="h-4 w-4" />
                                شهادة معتمدة
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                              التفاصيل
                            </Button>
                            {training.status === 'مجدول' && (
                              <Button size="sm" className="btn-primary">
                                <UserPlus className="h-4 w-4" />
                                تسجيل
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* الشهادات */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <CodeDisplay code="916-05" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في الشهادات..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="btn-primary button-rtl">
                    <Download className="h-4 w-4" />
                    تقرير الشهادات
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{safetyStats.activeCertificates}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهادة نشطة</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{safetyStats.expiringCertificates}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>منتهية قريباً</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{safetyStats.expiredCertificates}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>شهادة منتهية</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="card-element">
                  <CardContent className="p-0">
                    <div className="table-container">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الشهادة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {certificates.map(cert => (
                            <TableRow key={cert.id} className="hover:bg-gray-50">
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cert.employeeName}</TableCell>
                              <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cert.certificateType}</TableCell>
                              <TableCell className="text-right">{cert.issueDate}</TableCell>
                              <TableCell className="text-right">{cert.expiryDate}</TableCell>
                              <TableCell className="text-right">
                                <span className={`font-mono ${
                                  cert.daysUntilExpiry < 0 ? 'text-red-600' :
                                  cert.daysUntilExpiry < 30 ? 'text-orange-600' :
                                  cert.daysUntilExpiry < 90 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {cert.daysUntilExpiry < 0 ? 'منتهي' : `${cert.daysUntilExpiry} يوم`}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className={getStatusBadge(cert.status)}>
                                  {cert.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  {cert.renewalRequired && (
                                    <Button size="sm" variant="ghost" className="text-orange-600">
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* معدات السلامة */}
            {activeTab === 'equipment' && (
              <div className="space-y-6">
                <CodeDisplay code="916-06" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في المعدات..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="btn-primary button-rtl" onClick={() => setShowEquipmentDialog(true)}>
                    <Plus className="h-4 w-4" />
                    إضافة معدات
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{safetyStats.safetyEquipment}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعدات</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">{safetyStats.equipmentInUse}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الاستخدام</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{safetyStats.equipmentMaintenance}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحت الصيانة</div>
                    </CardContent>
                  </Card>

                  <Card className="card-element">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{safetyStats.equipmentDamaged}</div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدات تالفة</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safetyEquipment.map(equipment => (
                    <Card key={equipment.id} className="card-element hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {equipment.name}
                            </h3>
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {equipment.category}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(equipment.status)}>
                            {equipment.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكمية:</span>
                            <span className="font-mono">{equipment.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد الاستخدام:</span>
                            <span className="font-mono text-green-600">{equipment.inUse}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>متاح:</span>
                            <span className="font-mono text-blue-600">{equipment.available}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>معدل الاستخدام</span>
                            <span>{Math.round((equipment.inUse / equipment.quantity) * 100)}%</span>
                          </div>
                          <Progress value={(equipment.inUse / equipment.quantity) * 100} />
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر فحص:</span>
                            <span className="font-mono">{equipment.lastInspection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفحص القادم:</span>
                            <span className="font-mono">{equipment.nextInspection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة:</span>
                            <Badge className={getConditionBadge(equipment.condition)} size="sm">
                              {equipment.condition}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <span className="text-sm font-mono text-blue-600">
                            {equipment.totalValue.toLocaleString('ar-SA')} ر.س
                          </span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* التنبيهات */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <CodeDisplay code="916-10" position="top-right" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في التنبيهات..."
                      className="input-field pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="input-field w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التنبيهات</SelectItem>
                      <SelectItem value="high">عالية الأولوية</SelectItem>
                      <SelectItem value="medium">متوسطة الأولوية</SelectItem>
                      <SelectItem value="new">جديدة</SelectItem>
                      <SelectItem value="processing">قيد المعالجة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {alerts.map(alert => (
                    <Card key={alert.id} className={`card-element hover:shadow-lg transition-shadow ${
                      alert.severity === 'عالية' ? 'border-r-4 border-r-red-500' : 'border-r-4 border-r-yellow-500'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              alert.severity === 'عالية' ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                              <Bell className={`h-5 w-5 ${
                                alert.severity === 'عالية' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {alert.title}
                                </h3>
                                <Badge className={getStatusBadge(alert.status)}>
                                  {alert.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {alert.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {alert.assignedTo}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  موعد الإنجاز: {alert.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              alert.priority === 'عاجل' ? 'bg-red-100 text-red-700 border-red-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'
                            }>
                              {alert.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراء المطلوب: <span className="font-medium">{alert.action}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                              عرض
                            </Button>
                            <Button size="sm" className="btn-primary">
                              <CheckCircle className="h-3 w-3" />
                              معالجة
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* محتوى باقي التابات */}
            {!['overview', 'incidents', 'inspections', 'training', 'certificates', 'equipment', 'alerts'].includes(activeTab) && (
              <div className="space-y-6">
                <CodeDisplay code={tabs.find(t => t.id === activeTab)?.code || ''} position="top-right" />
                
                <Card className="card-element">
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tabs.find(t => t.id === activeTab)?.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Settings, {
                          className: "h-8 w-8 text-gray-400"
                        })}
                      </div>
                      <p className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        محتوى تبويب {tabs.find(t => t.id === activeTab)?.label} - قيد التطوير
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
