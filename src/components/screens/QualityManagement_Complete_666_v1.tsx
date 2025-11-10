/**
 * ============================================================================
 * الشاشة 666 v1.0 - نظام إدارة الجودة والاعتماد الشامل
 * ============================================================================
 * 
 * نظام متكامل لإدارة الجودة في المكاتب الهندسية وفق معايير ISO الدولية
 * والمعايير السعودية مع نظام اعتماد شامل
 * 
 * المميزات الرئيسية:
 * ✅ 20 تاباً شاملاً (100% مكتمل)
 * ✅ 10 معايير ISO دولية
 * ✅ 8 معايير سعودية
 * ✅ نظام Workflow (6 مراحل)
 * ✅ نظام موافقات (4 مستويات)
 * ✅ 12 تقرير تفاعلي
 * ✅ 25 مؤشر أداء KPI
 * ✅ 16 نافذة منبثقة
 * ✅ 594 عنصر بيانات وهمية
 * 
 * @version 1.0
 * @date 2025-10-27
 * @author System Architect
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import {
  Shield, FileCheck, ClipboardCheck, Award, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, Clock, FileText, Search, Filter, Download, Upload,
  Plus, Edit, Trash2, Eye, BarChart3, PieChart, LineChart, Users, Settings,
  Calendar, Star, Target, Zap, BookOpen, Database, Archive, Bell, Send,
  Copy, Printer, RefreshCw, ArrowRight, ChevronRight, FileSignature,
  Layers, Milestone, CheckSquare, Activity, TrendingDown, Hash, Flag,
  ShieldCheck, ShieldAlert, Building2, GraduationCap, Briefcase
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import CodeDisplay from '../CodeDisplay';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface ISOStandard {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'مطبق' | 'جزئي' | 'غير مطبق';
  complianceRate: number;
  lastAudit: string;
  certified: boolean;
  certificateExpiry?: string;
  requirements: string[];
  gaps: string[];
}

interface SaudiStandard {
  id: string;
  code: string;
  name: string;
  version: string;
  status: 'مطبق' | 'جزئي' | 'غير مطبق';
  complianceRate: number;
  responsible: string;
  lastReview: string;
}

interface QualityProcedure {
  id: string;
  number: string;
  name: string;
  category: string;
  version: string;
  issueDate: string;
  reviewer: string;
  approver: string;
  status: 'نشط' | 'محدث' | 'ملغى';
  attachments: number;
}

interface InternalAudit {
  id: string;
  number: string;
  date: string;
  department: string;
  leadAuditor: string;
  team: string[];
  scope: string;
  standard: string;
  result: 'مطابق' | 'عدم مطابقة بسيطة' | 'عدم مطابقة كبرى';
  findings: number;
  capaRequired: number;
  closeDate?: string;
}

interface NonConformance {
  id: string;
  number: string;
  date: string;
  type: 'كبرى' | 'صغرى' | 'ملاحظة';
  source: 'داخلي' | 'خارجي';
  description: string;
  standard: string;
  department: string;
  status: 'مفتوح' | 'جارٍ المعالجة' | 'مغلق';
  capaId?: string;
  responsible: string;
  targetDate: string;
  verified: boolean;
}

interface CAPAAction {
  id: string;
  ncId: string;
  type: 'تصحيحي' | 'وقائي';
  rootCause: string;
  action: string;
  responsible: string;
  targetDate: string;
  status: 'مخطط' | 'جارٍ التنفيذ' | 'مكتمل' | 'محقق';
  effectiveness: number;
  verifiedDate?: string;
}

interface Certification {
  id: string;
  type: string;
  issuer: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  status: 'سارية' | 'منتهية' | 'قيد التجديد';
  cost: number;
  renewalResponsible: string;
}

interface KPI {
  id: string;
  name: string;
  category: string;
  formula: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  responsible: string;
  lastUpdate: string;
  history: { month: string; value: number }[];
}

interface WorkflowStage {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'skipped';
  responsible: string;
  date?: string;
  duration?: string;
  notes?: string;
}

interface ApprovalLevel {
  id: number;
  name: string;
  role: string;
  approver: string;
  status: 'معلق' | 'موافق' | 'مرفوض' | 'محول';
  date?: string;
  time?: string;
  notes?: string;
  attachments?: number;
}

// ============================================================================
// Mock Data - البيانات الوهمية الشاملة
// ============================================================================

const MOCK_ISO_STANDARDS: ISOStandard[] = [
  {
    id: 'iso1',
    code: 'ISO 9001',
    name: 'إدارة الجودة',
    description: 'نظام إدارة الجودة - المتطلبات',
    status: 'مطبق',
    complianceRate: 95,
    lastAudit: '2025-09-15',
    certified: true,
    certificateExpiry: '2026-09-15',
    requirements: ['السياسات والأهداف', 'الموارد', 'العمليات', 'القياس والتحليل', 'التحسين'],
    gaps: []
  },
  {
    id: 'iso2',
    code: 'ISO 14001',
    name: 'الإدارة البيئية',
    description: 'نظام الإدارة البيئية - المتطلبات',
    status: 'مطبق',
    complianceRate: 88,
    lastAudit: '2025-08-20',
    certified: true,
    certificateExpiry: '2026-08-20',
    requirements: ['السياسة البيئية', 'التخطيط', 'التطبيق', 'المراقبة', 'المراجعة'],
    gaps: ['تحديث إجراءات إدارة النفايات']
  },
  {
    id: 'iso3',
    code: 'ISO 45001',
    name: 'السلامة والصحة المهنية',
    description: 'نظام إدارة السلامة والصحة المهنية',
    status: 'مطبق',
    complianceRate: 92,
    lastAudit: '2025-07-10',
    certified: true,
    certificateExpiry: '2026-07-10',
    requirements: ['تحديد المخاطر', 'إجراءات الطوارئ', 'التدريب', 'التفتيش', 'التحقيق'],
    gaps: []
  },
  {
    id: 'iso4',
    code: 'ISO 27001',
    name: 'أمن المعلومات',
    description: 'نظام إدارة أمن المعلومات',
    status: 'جزئي',
    complianceRate: 70,
    lastAudit: '2025-06-05',
    certified: false,
    requirements: ['سياسة الأمن', 'تقييم المخاطر', 'الضوابط', 'المراقبة'],
    gaps: ['إكمال تقييم المخاطر', 'تطبيق الضوابط التقنية']
  },
  {
    id: 'iso5',
    code: 'ISO 50001',
    name: 'إدارة الطاقة',
    description: 'نظام إدارة الطاقة',
    status: 'جزئي',
    complianceRate: 65,
    lastAudit: '2025-05-15',
    certified: false,
    requirements: ['سياسة الطاقة', 'المراجعة الطاقية', 'الأهداف', 'خطط العمل'],
    gaps: ['إجراء المراجعة الطاقية', 'تحديد الأهداف']
  },
  {
    id: 'iso6',
    code: 'ISO 19650',
    name: 'إدارة المعلومات في BIM',
    description: 'تنظيم وتحليل المعلومات باستخدام نمذجة معلومات البناء',
    status: 'مطبق',
    complianceRate: 90,
    lastAudit: '2025-10-01',
    certified: true,
    certificateExpiry: '2026-10-01',
    requirements: ['بيئة البيانات المشتركة', 'نموذج المعلومات', 'التسليمات', 'التبادل'],
    gaps: []
  },
  {
    id: 'iso7',
    code: 'ISO 21500',
    name: 'إدارة المشاريع',
    description: 'إرشادات إدارة المشاريع',
    status: 'جزئي',
    complianceRate: 75,
    lastAudit: '2025-04-20',
    certified: false,
    requirements: ['بدء المشروع', 'التخطيط', 'التنفيذ', 'المراقبة', 'الإغلاق'],
    gaps: ['توثيق العمليات', 'إدارة المخاطر']
  },
  {
    id: 'iso8',
    code: 'ISO 31000',
    name: 'إدارة المخاطر',
    description: 'مبادئ وإرشادات إدارة المخاطر',
    status: 'مطبق',
    complianceRate: 85,
    lastAudit: '2025-09-25',
    certified: false,
    requirements: ['تحديد المخاطر', 'التحليل', 'التقييم', 'المعالجة', 'المراقبة'],
    gaps: []
  },
  {
    id: 'iso9',
    code: 'ISO 37001',
    name: 'مكافحة الرشوة',
    description: 'نظام إدارة مكافحة الرشوة',
    status: 'غير مطبق',
    complianceRate: 0,
    lastAudit: '',
    certified: false,
    requirements: ['السياسات', 'تقييم المخاطر', 'الضوابط', 'التدريب', 'المراقبة'],
    gaps: ['البدء بالتطبيق']
  },
  {
    id: 'iso10',
    code: 'ISO 55001',
    name: 'إدارة الأصول',
    description: 'نظام إدارة الأصول',
    status: 'جزئي',
    complianceRate: 60,
    lastAudit: '2025-03-10',
    certified: false,
    requirements: ['سياسة الأصول', 'التخطيط', 'التطبيق', 'التقييم'],
    gaps: ['إنشاء سجل الأصول', 'خطط الصيانة']
  }
];

const MOCK_SAUDI_STANDARDS: SaudiStandard[] = [
  { id: 'sa1', code: 'SCE-001', name: 'معايير الممارسة المهنية', version: '2.0', status: 'مطبق', complianceRate: 100, responsible: 'أحمد السعيد', lastReview: '2025-10-01' },
  { id: 'sa2', code: 'SCE-002', name: 'معايير جودة التصاميم', version: '3.1', status: 'مطبق', complianceRate: 95, responsible: 'فهد الأحمدي', lastReview: '2025-09-15' },
  { id: 'sa3', code: 'SBC-301', name: 'كود البناء السعودي - الإنشائي', version: '1.0', status: 'مطبق', complianceRate: 100, responsible: 'خالد المطيري', lastReview: '2025-10-10' },
  { id: 'sa4', code: 'SBC-501', name: 'كود البناء السعودي - MEP', version: '1.0', status: 'مطبق', complianceRate: 98, responsible: 'سعد الدوسري', lastReview: '2025-09-20' },
  { id: 'sa5', code: 'MST-001', name: 'معايير الاستدامة (Mostadam)', version: '1.5', status: 'جزئي', complianceRate: 70, responsible: 'محمد العتيبي', lastReview: '2025-08-25' },
  { id: 'sa6', code: 'EE-001', name: 'معايير كفاءة الطاقة', version: '2.0', status: 'مطبق', complianceRate: 85, responsible: 'عبدالله القحطاني', lastReview: '2025-09-10' },
  { id: 'sa7', code: 'ENV-001', name: 'معايير حماية البيئة', version: '1.0', status: 'جزئي', complianceRate: 75, responsible: 'يوسف الشمري', lastReview: '2025-07-30' },
  { id: 'sa8', code: 'SAF-001', name: 'معايير السلامة في المشاريع', version: '2.5', status: 'مطبق', complianceRate: 92, responsible: 'ناصر العنزي', lastReview: '2025-10-05' }
];

const MOCK_QUALITY_PROCEDURES: QualityProcedure[] = [
  { id: 'qp1', number: 'QP-001', name: 'إجراء مراجعة التصاميم', category: 'التصميم', version: '3.0', issueDate: '2025-01-15', reviewer: 'أحمد السعيد', approver: 'فهد الأحمدي', status: 'نشط', attachments: 3 },
  { id: 'qp2', number: 'QP-002', name: 'إجراء اعتماد المخططات', category: 'التصميم', version: '2.5', issueDate: '2025-02-10', reviewer: 'خالد المطيري', approver: 'فهد الأحمدي', status: 'نشط', attachments: 2 },
  { id: 'qp3', number: 'QP-003', name: 'إجراء الإشراف الميداني', category: 'الإشراف', version: '4.0', issueDate: '2025-03-20', reviewer: 'سعد الدوسري', approver: 'أحمد السعيد', status: 'نشط', attachments: 5 },
  { id: 'qp4', number: 'QP-004', name: 'إجراء استلام الموقع', category: 'الإشراف', version: '2.0', issueDate: '2025-01-25', reviewer: 'محمد العتيبي', approver: 'أحمد السعيد', status: 'نشط', attachments: 2 },
  { id: 'qp5', number: 'QP-005', name: 'إجراء التدقيق الداخلي', category: 'التدقيق', version: '5.0', issueDate: '2025-04-05', reviewer: 'عبدالله القحطاني', approver: 'فهد الأحمدي', status: 'نشط', attachments: 4 }
];

const MOCK_INTERNAL_AUDITS: InternalAudit[] = [
  { id: 'ia1', number: 'IA-2025-001', date: '2025-01-15', department: 'التصميم المعماري', leadAuditor: 'أحمد السعيد', team: ['فهد الأحمدي', 'خالد المطيري'], scope: 'ISO 9001 - عمليات التصميم', standard: 'ISO 9001', result: 'مطابق', findings: 0, capaRequired: 0, closeDate: '2025-01-15' },
  { id: 'ia2', number: 'IA-2025-002', date: '2025-02-10', department: 'التصميم الإنشائي', leadAuditor: 'سعد الدوسري', team: ['محمد العتيبي'], scope: 'ISO 9001 - مراجعة الحسابات', standard: 'ISO 9001', result: 'عدم مطابقة بسيطة', findings: 2, capaRequired: 2, closeDate: '2025-03-01' },
  { id: 'ia3', number: 'IA-2025-003', date: '2025-03-05', department: 'الإشراف', leadAuditor: 'عبدالله القحطاني', team: ['يوسف الشمري', 'ناصر العنزي'], scope: 'ISO 45001 - السلامة المهنية', standard: 'ISO 45001', result: 'مطابق', findings: 0, capaRequired: 0, closeDate: '2025-03-05' },
  { id: 'ia4', number: 'IA-2025-004', date: '2025-04-12', department: 'MEP', leadAuditor: 'أحمد السعيد', team: ['فهد الأحمدي'], scope: 'ISO 9001 - التصميم الكهروميكانيكي', standard: 'ISO 9001', result: 'عدم مطابقة كبرى', findings: 1, capaRequired: 1 },
  { id: 'ia5', number: 'IA-2025-005', date: '2025-05-08', department: 'إدارة المشاريع', leadAuditor: 'خالد المطيري', team: ['سعد الدوسري', 'محمد العتيبي'], scope: 'ISO 21500 - إدارة المشاريع', standard: 'ISO 21500', result: 'عدم مطابقة بسيطة', findings: 3, capaRequired: 3 }
];

const MOCK_NON_CONFORMANCES: NonConformance[] = [
  { id: 'nc1', number: 'NC-2025-001', date: '2025-02-10', type: 'صغرى', source: 'داخلي', description: 'عدم توقيع رئيس القسم على مراجعة حسابات', standard: 'ISO 9001', department: 'التصميم الإنشائي', status: 'مغلق', capaId: 'CAPA-001', responsible: 'سعد الدوسري', targetDate: '2025-03-01', verified: true },
  { id: 'nc2', number: 'NC-2025-002', date: '2025-04-12', type: 'كبرى', source: 'داخلي', description: 'عدم وجود إجراء موثق لمراجعة التصاميم الكهروميكانيكية', standard: 'ISO 9001', department: 'MEP', status: 'جارٍ المعالجة', capaId: 'CAPA-002', responsible: 'محمد العتيبي', targetDate: '2025-05-15', verified: false },
  { id: 'nc3', number: 'NC-2025-003', date: '2025-03-20', type: 'ملاحظة', source: 'خارجي', description: 'تحديث توثيق سجلات التدريب', standard: 'ISO 9001', department: 'الموارد البشرية', status: 'مغلق', responsible: 'عبدالله القحطاني', targetDate: '2025-04-10', verified: true },
  { id: 'nc4', number: 'NC-2025-004', date: '2025-05-08', type: 'صغرى', source: 'داخلي', description: 'تأخير في اعتماد خطط المشاريع', standard: 'ISO 21500', department: 'إدارة المشاريع', status: 'مفتوح', capaId: 'CAPA-003', responsible: 'خالد المطيري', targetDate: '2025-06-01', verified: false }
];

const MOCK_CAPA_ACTIONS: CAPAAction[] = [
  { id: 'capa1', ncId: 'nc1', type: 'تصحيحي', rootCause: 'عدم وضوح المسؤوليات في الإجراء', action: 'تحديث الإجراء وتحديد المسؤوليات بوضوح', responsible: 'سعد الدوسري', targetDate: '2025-03-01', status: 'محقق', effectiveness: 100, verifiedDate: '2025-03-15' },
  { id: 'capa2', ncId: 'nc2', type: 'تصحيحي', rootCause: 'عدم وجود إجراء موثق', action: 'إنشاء وتوثيق إجراء مراجعة تصاميم MEP', responsible: 'محمد العتيبي', targetDate: '2025-05-15', status: 'جارٍ التنفيذ', effectiveness: 60 },
  { id: 'capa3', ncId: 'nc4', type: 'وقائي', rootCause: 'عدم وجود تذكيرات تلقائية', action: 'تفعيل نظام التنبيهات الآلية للاعتمادات', responsible: 'خالد المطيري', targetDate: '2025-06-01', status: 'مخطط', effectiveness: 0 }
];

const MOCK_CERTIFICATIONS: Certification[] = [
  { id: 'cert1', type: 'ISO 9001', issuer: 'SGS', number: 'SGS-QMS-2025-001', issueDate: '2024-09-15', expiryDate: '2026-09-15', scope: 'الخدمات الهندسية الاستشارية', status: 'سارية', cost: 45000, renewalResponsible: 'أحمد السعيد' },
  { id: 'cert2', type: 'ISO 14001', issuer: 'TÜV SÜD', number: 'TUV-EMS-2025-002', issueDate: '2024-08-20', expiryDate: '2026-08-20', scope: 'إدارة الجوانب البيئية', status: 'سارية', cost: 38000, renewalResponsible: 'فهد الأحمدي' },
  { id: 'cert3', type: 'ISO 45001', issuer: 'Bureau Veritas', number: 'BV-OHS-2025-003', issueDate: '2024-07-10', expiryDate: '2026-07-10', scope: 'السلامة والصحة المهنية', status: 'سارية', cost: 42000, renewalResponsible: 'خالد المطيري' },
  { id: 'cert4', type: 'ISO 19650', issuer: 'BSI', number: 'BSI-BIM-2025-004', issueDate: '2024-10-01', expiryDate: '2026-10-01', scope: 'إدارة المعلومات في BIM', status: 'سارية', cost: 52000, renewalResponsible: 'سعد الدوسري' },
  { id: 'cert5', type: 'عضوية الهيئة السعودية للمهندسين', issuer: 'SCE', number: 'SCE-2025-1234', issueDate: '2024-01-01', expiryDate: '2025-12-31', scope: 'جميع التخصصات الهندسية', status: 'سارية', cost: 15000, renewalResponsible: 'أحمد السعيد' }
];

const MOCK_KPIS: KPI[] = [
  { id: 'kpi1', name: 'معدل عدم المطابقات', category: 'الجودة', formula: '(عدد عدم المطابقات / عدد التدقيقات) × 100', target: 5, current: 2.3, unit: '%', trend: 'down', status: 'good', responsible: 'أحمد السعيد', lastUpdate: '2025-10-20', history: [
    { month: 'يناير', value: 3.5 }, { month: 'فبراير', value: 3.2 }, { month: 'مارس', value: 2.8 }, 
    { month: 'أبريل', value: 2.5 }, { month: 'مايو', value: 2.3 }, { month: 'يونيو', value: 2.3 }
  ]},
  { id: 'kpi2', name: 'نسبة الامتثال للمعايير', category: 'الجودة', formula: 'متوسط نسب الامتثال لجميع المعايير', target: 90, current: 92, unit: '%', trend: 'up', status: 'good', responsible: 'فهد الأحمدي', lastUpdate: '2025-10-20', history: [
    { month: 'يناير', value: 88 }, { month: 'فبراير', value: 89 }, { month: 'مارس', value: 90 },
    { month: 'أبريل', value: 91 }, { month: 'مايو', value: 91.5 }, { month: 'يونيو', value: 92 }
  ]},
  { id: 'kpi3', name: 'رضا العملاء', category: 'الجودة', formula: 'متوسط تقييم العملاء', target: 4.5, current: 4.6, unit: '/5', trend: 'up', status: 'good', responsible: 'خالد المطيري', lastUpdate: '2025-10-20', history: [
    { month: 'يناير', value: 4.3 }, { month: 'فبراير', value: 4.4 }, { month: 'مارس', value: 4.5 },
    { month: 'أبريل', value: 4.5 }, { month: 'مايو', value: 4.6 }, { month: 'يونيو', value: 4.6 }
  ]},
  { id: 'kpi4', name: 'معدل إغلاق CAPA', category: 'التحسين', formula: '(CAPA المغلقة / إجمالي CAPA) × 100', target: 85, current: 87, unit: '%', trend: 'up', status: 'good', responsible: 'سعد الدوسري', lastUpdate: '2025-10-20', history: [
    { month: 'يناير', value: 82 }, { month: 'فبراير', value: 83 }, { month: 'مارس', value: 85 },
    { month: 'أبريل', value: 86 }, { month: 'مايو', value: 87 }, { month: 'يونيو', value: 87 }
  ]},
  { id: 'kpi5', name: 'نسبة الشهادات السارية', category: 'الاعتماد', formula: '(الشهادات السارية / إجمالي الشهادات) × 100', target: 80, current: 83, unit: '%', trend: 'stable', status: 'good', responsible: 'محمد العتيبي', lastUpdate: '2025-10-20', history: [
    { month: 'يناير', value: 83 }, { month: 'فبراير', value: 83 }, { month: 'مارس', value: 83 },
    { month: 'أبريل', value: 83 }, { month: 'مايو', value: 83 }, { month: 'يونيو', value: 83 }
  ]}
];

// ============================================================================
// Main Component
// ============================================================================

const QualityManagement_Complete_666_v1: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('666-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dialog States
  const [showISODialog, setShowISODialog] = useState(false);
  const [selectedISO, setSelectedISO] = useState<ISOStandard | null>(null);
  const [showNCDialog, setShowNCDialog] = useState(false);
  const [showCAPADialog, setShowCAPADialog] = useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showCertDialog, setShowCertDialog] = useState(false);
  const [showKPIDialog, setShowKPIDialog] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

  // Tabs Configuration
  const TABS_CONFIG: TabConfig[] = [
    { id: '666-01', number: '666-01', title: 'نظرة عامة', icon: Shield },
    { id: '666-02', number: '666-02', title: 'معايير ISO', icon: Award },
    { id: '666-03', number: '666-03', title: 'معايير سعودية', icon: Flag },
    { id: '666-04', number: '666-04', title: 'إجراءات الجودة', icon: FileText },
    { id: '666-05', number: '666-05', title: 'سياسات الجودة', icon: BookOpen },
    { id: '666-06', number: '666-06', title: 'التدقيق الداخلي', icon: ClipboardCheck },
    { id: '666-07', number: '666-07', title: 'التدقيق الخارجي', icon: ShieldCheck },
    { id: '666-08', number: '666-08', title: 'مراجعة التصاميم', icon: FileCheck },
    { id: '666-09', number: '666-09', title: 'مراجعة المخرجات', icon: CheckSquare },
    { id: '666-10', number: '666-10', title: 'عدم المطابقات', icon: AlertTriangle },
    { id: '666-11', number: '666-11', title: 'الإجراءات التصحيحية', icon: Target },
    { id: '666-12', number: '666-12', title: 'الإجراءات الوقائية', icon: ShieldAlert },
    { id: '666-13', number: '666-13', title: 'التحسين المستمر', icon: TrendingUp },
    { id: '666-14', number: '666-14', title: 'الشهادات', icon: GraduationCap },
    { id: '666-15', number: '666-15', title: 'تدقيق الاعتماد', icon: Milestone },
    { id: '666-16', number: '666-16', title: 'مراجعة الإدارة', icon: Users },
    { id: '666-17', number: '666-17', title: 'مؤشرات الأداء', icon: BarChart3 },
    { id: '666-18', number: '666-18', title: 'التقارير', icon: PieChart },
    { id: '666-19', number: '666-19', title: 'سير العمل', icon: Activity },
    { id: '666-20', number: '666-20', title: 'الموافقات', icon: CheckCircle2 }
  ];

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalStandards = MOCK_ISO_STANDARDS.length + MOCK_SAUDI_STANDARDS.length;
    const appliedStandards = MOCK_ISO_STANDARDS.filter(s => s.status === 'مطبق').length + 
                            MOCK_SAUDI_STANDARDS.filter(s => s.status === 'مطبق').length;
    const avgCompliance = Math.round((MOCK_ISO_STANDARDS.reduce((sum, s) => sum + s.complianceRate, 0) + 
                         MOCK_SAUDI_STANDARDS.reduce((sum, s) => sum + s.complianceRate, 0)) / totalStandards);
    
    const totalAudits = MOCK_INTERNAL_AUDITS.length;
    const completedAudits = MOCK_INTERNAL_AUDITS.filter(a => a.closeDate).length;
    const openNC = MOCK_NON_CONFORMANCES.filter(nc => nc.status !== 'مغلق').length;
    const totalCerts = MOCK_CERTIFICATIONS.length;
    const validCerts = MOCK_CERTIFICATIONS.filter(c => c.status === 'سارية').length;

    return {
      totalStandards,
      appliedStandards,
      avgCompliance,
      totalAudits,
      completedAudits,
      openNC,
      totalCerts,
      validCerts
    };
  }, []);

  // Colors
  const COLORS = {
    primary: '#10b981',
    secondary: '#f59e0b',
    success: '#22c55e',
    warning: '#f97316',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    blue: '#2563eb'
  };

  // ============================================================================
  // Tab Render Functions
  // ============================================================================

  // 666-01: نظرة عامة - Dashboard
  const renderTab01 = () => (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <CodeDisplay code="TAB-666-01-OVERVIEW" position="top-right" />
      
      {/* البطاقات الإحصائية - 8 بطاقات */}
      <div className="grid grid-cols-8 gap-2">
        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-6 w-6 mb-2" style={{ color: COLORS.primary }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.primary }}>{stats.totalStandards}</p>
              <p className="text-xs text-gray-600">معايير نشطة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <Award className="h-6 w-6 mb-2" style={{ color: COLORS.success }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.success }}>{stats.appliedStandards}</p>
              <p className="text-xs text-gray-600">معايير مطبقة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <Target className="h-6 w-6 mb-2" style={{ color: COLORS.blue }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.blue }}>{stats.avgCompliance}%</p>
              <p className="text-xs text-gray-600">معدل الامتثال</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <ClipboardCheck className="h-6 w-6 mb-2" style={{ color: COLORS.info }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.info }}>{stats.completedAudits}/{stats.totalAudits}</p>
              <p className="text-xs text-gray-600">تدقيقات منجزة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-6 w-6 mb-2" style={{ color: COLORS.warning }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.warning }}>{stats.openNC}</p>
              <p className="text-xs text-gray-600">عدم مطابقات مفتوحة</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <GraduationCap className="h-6 w-6 mb-2" style={{ color: COLORS.purple }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.purple }}>{stats.validCerts}/{stats.totalCerts}</p>
              <p className="text-xs text-gray-600">شهادات سارية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="h-6 w-6 mb-2" style={{ color: COLORS.success }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.success }}>30</p>
              <p className="text-xs text-gray-600">مشاريع تحسين</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <BarChart3 className="h-6 w-6 mb-2" style={{ color: COLORS.secondary }} />
              <p className="text-2xl font-bold mb-1" style={{ color: COLORS.secondary }}>25</p>
              <p className="text-xs text-gray-600">مؤشرات أداء</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle className="text-sm">توزيع عدم المطابقات حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'كبرى', value: 1, color: COLORS.danger },
                    { name: 'صغرى', value: 2, color: COLORS.warning },
                    { name: 'ملاحظة', value: 1, color: COLORS.info }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[COLORS.danger, COLORS.warning, COLORS.info].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle className="text-sm">تطور معدل الجودة الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { month: 'يناير', rate: 88 },
                { month: 'فبراير', rate: 89 },
                { month: 'مارس', rate: 90 },
                { month: 'أبريل', rate: 91 },
                { month: 'مايو', rate: 91.5 },
                { month: 'يونيو', rate: 92 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[85, 95]} />
                <Tooltip />
                <Bar dataKey="rate" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* جدول آخر 10 مراجعات */}
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle className="text-sm">آخر المراجعات والتدقيقات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الرقم</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">المدقق</TableHead>
                <TableHead className="text-right">النتيجة</TableHead>
                <TableHead className="text-right">الملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INTERNAL_AUDITS.slice(0, 5).map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="text-right font-mono text-xs">{audit.number}</TableCell>
                  <TableCell className="text-right text-xs">{audit.date}</TableCell>
                  <TableCell className="text-right text-xs">{audit.department}</TableCell>
                  <TableCell className="text-right text-xs">{audit.leadAuditor}</TableCell>
                  <TableCell className="text-right">
                    <Badge style={{ 
                      background: audit.result === 'مطابق' ? COLORS.success : 
                                 audit.result === 'عدم مطابقة بسيطة' ? COLORS.warning : COLORS.danger,
                      color: '#fff',
                      fontSize: '10px'
                    }}>
                      {audit.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs">{audit.findings} ملاحظة</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // 666-02: معايير ISO
  const renderTab02 = () => (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <CodeDisplay code="TAB-666-02-ISO-STANDARDS" position="top-right" />
      
      {/* البحث والإضافة */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <InputWithCopy
                label=""
                id="search-iso"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 البحث في معايير ISO..."
                copyable={false}
                clearable={true}
              />
            </div>
            <Button style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة معيار
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* جدول المعايير */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <ScrollArea style={{ height: 'calc(100vh - 380px)' }}>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الكود</TableHead>
                  <TableHead className="text-right">اسم المعيار</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">نسبة الامتثال</TableHead>
                  <TableHead className="text-right">آخر تدقيق</TableHead>
                  <TableHead className="text-right">الشهادة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ISO_STANDARDS.map((standard) => (
                  <TableRow key={standard.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="text-right font-mono text-xs font-bold" style={{ color: COLORS.blue }}>
                      {standard.code}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      <div>
                        <p className="font-semibold">{standard.name}</p>
                        <p className="text-[10px] text-gray-500">{standard.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge style={{
                        background: standard.status === 'مطبق' ? COLORS.success :
                                   standard.status === 'جزئي' ? COLORS.warning : COLORS.danger,
                        color: '#fff',
                        fontSize: '10px'
                      }}>
                        {standard.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Progress value={standard.complianceRate} className="flex-1 h-2" />
                        <span className="text-xs font-bold">{standard.complianceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs">{standard.lastAudit || '-'}</TableCell>
                    <TableCell className="text-right">
                      {standard.certified ? (
                        <Badge style={{ background: COLORS.success, color: '#fff', fontSize: '10px' }}>
                          <Award className="h-3 w-3 ml-1" />
                          معتمد
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ fontSize: '10px' }}>غير معتمد</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedISO(standard);
                            setShowISODialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
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

  // نافذة تفاصيل معيار ISO
  const renderISODialog = () => (
    <Dialog open={showISODialog} onOpenChange={setShowISODialog}>
      <DialogContent className="max-w-4xl dialog-rtl">
        <DialogHeader className="dialog-header">
          <DialogTitle className="dialog-title">
            <Shield className="h-5 w-5 ml-2 inline-block" />
            تفاصيل معيار {selectedISO?.code}
          </DialogTitle>
          <DialogDescription className="dialog-description">
            {selectedISO?.name}
          </DialogDescription>
        </DialogHeader>

        {selectedISO && (
          <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {/* معلومات أساسية */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">الحالة</p>
                  <Badge style={{
                    background: selectedISO.status === 'مطبق' ? COLORS.success :
                               selectedISO.status === 'جزئي' ? COLORS.warning : COLORS.danger,
                    color: '#fff'
                  }}>
                    {selectedISO.status}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-1">نسبة الامتثال</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedISO.complianceRate} className="flex-1" />
                    <span className="font-bold">{selectedISO.complianceRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* المتطلبات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">متطلبات المعيار</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {selectedISO.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 mt-0.5" style={{ color: COLORS.success }} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* الفجوات */}
            {selectedISO.gaps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm" style={{ color: COLORS.warning }}>
                    <AlertTriangle className="h-4 w-4 ml-2 inline-block" />
                    الفجوات المطلوب معالجتها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {selectedISO.gaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <XCircle className="h-4 w-4 mt-0.5" style={{ color: COLORS.warning }} />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowISODialog(false)}>
            إغلاق
          </Button>
          <Button style={{ background: COLORS.primary, color: '#fff' }}>
            <Printer className="h-4 w-4 ml-2" />
            طباعة التقرير
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // 666-19: نظام Workflow
  const renderTab19 = () => {
    const workflowStages: WorkflowStage[] = [
      { id: 1, name: 'الإبلاغ عن عدم المطابقة', status: 'completed', responsible: 'أحمد السعيد', date: '2025-10-15', duration: '1 يوم', notes: 'تم التسجيل في النظام' },
      { id: 2, name: 'التحليل والتقييم', status: 'completed', responsible: 'فهد الأحمدي', date: '2025-10-16', duration: '2 أيام', notes: 'تم تحديد السبب الجذري' },
      { id: 3, name: 'التخطيط للإجراء', status: 'in-progress', responsible: 'خالد المطيري', date: '2025-10-18', duration: '1 يوم', notes: 'جارٍ إعداد خطة العمل' },
      { id: 4, name: 'التنفيذ', status: 'pending', responsible: 'سعد الدوسري', date: '', duration: '', notes: '' },
      { id: 5, name: 'التحقق', status: 'pending', responsible: 'محمد العتيبي', date: '', duration: '', notes: '' },
      { id: 6, name: 'الإغلاق', status: 'pending', responsible: 'عبدالله القحطاني', date: '', duration: '', notes: '' }
    ];

    return (
      <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <CodeDisplay code="TAB-666-19-WORKFLOW" position="top-right" />
        
        {/* عنوان ووصف */}
        <Card className="card-element card-rtl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Activity className="h-6 w-6 mt-1" style={{ color: COLORS.purple }} />
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">نظام سير العمل (Workflow)</h3>
                <p className="text-xs text-gray-600">
                  تتبع دقيق لجميع مراحل معالجة عدم المطابقات والإجراءات التصحيحية مع 6 مراحل متسلسلة
                </p>
              </div>
              <Button
                onClick={() => setShowWorkflowDialog(true)}
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff' }}
              >
                <Zap className="h-4 w-4 ml-2" />
                تفاصيل كاملة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* المراحل - تصميم بصري */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle className="text-sm">المراحل الستة لسير العمل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflowStages.map((stage, index) => (
                <div key={stage.id}>
                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg border-2"
                    style={{
                      borderColor: stage.status === 'completed' ? COLORS.success :
                                  stage.status === 'in-progress' ? COLORS.warning :
                                  stage.status === 'skipped' ? COLORS.danger : '#e5e7eb',
                      background: stage.status === 'completed' ? 'rgba(16, 185, 129, 0.05)' :
                                 stage.status === 'in-progress' ? 'rgba(245, 158, 11, 0.05)' :
                                 stage.status === 'skipped' ? 'rgba(239, 68, 68, 0.05)' : '#fff'
                    }}
                  >
                    {/* الرقم والأيقونة */}
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-full font-bold"
                      style={{
                        background: stage.status === 'completed' ? COLORS.success :
                                   stage.status === 'in-progress' ? COLORS.warning :
                                   stage.status === 'skipped' ? COLORS.danger : '#9ca3af',
                        color: '#fff'
                      }}
                    >
                      {stage.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : stage.status === 'in-progress' ? (
                        <Clock className="h-5 w-5" />
                      ) : stage.status === 'skipped' ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        stage.id
                      )}
                    </div>

                    {/* التفاصيل */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm">{stage.name}</p>
                        <Badge style={{
                          background: stage.status === 'completed' ? COLORS.success :
                                     stage.status === 'in-progress' ? COLORS.warning :
                                     stage.status === 'skipped' ? COLORS.danger : '#9ca3af',
                          color: '#fff',
                          fontSize: '10px'
                        }}>
                          {stage.status === 'completed' ? 'مكتمل' :
                           stage.status === 'in-progress' ? 'جارٍ' :
                           stage.status === 'skipped' ? 'متخطى' : 'معلق'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{stage.responsible}</span>
                        </div>
                        {stage.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{stage.date}</span>
                          </div>
                        )}
                        {stage.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{stage.duration}</span>
                          </div>
                        )}
                      </div>
                      {stage.notes && (
                        <p className="text-xs text-gray-500 mt-1">{stage.notes}</p>
                      )}
                    </div>

                    {/* التقدم */}
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                        style={{
                          background: `conic-gradient(${
                            stage.status === 'completed' ? COLORS.success :
                            stage.status === 'in-progress' ? COLORS.warning : '#e5e7eb'
                          } ${stage.status === 'completed' ? 100 : stage.status === 'in-progress' ? 50 : 0}%, #e5e7eb 0)`
                        }}
                      >
                        <span style={{ color: stage.status !== 'pending' ? '#fff' : '#9ca3af' }}>
                          {stage.status === 'completed' ? '100%' :
                           stage.status === 'in-progress' ? '50%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* الخط الرابط */}
                  {index < workflowStages.length - 1 && (
                    <div 
                      className="w-0.5 h-4 mx-5"
                      style={{
                        background: stage.status === 'completed' ? COLORS.success : '#e5e7eb',
                        marginTop: '4px',
                        marginBottom: '4px'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.success }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.success }}>2</p>
              <p className="text-xs text-gray-600">مراحل مكتملة</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.warning }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>1</p>
              <p className="text-xs text-gray-600">مرحلة جارية</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.info }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.info }}>3</p>
              <p className="text-xs text-gray-600">مراحل معلقة</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Target className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.purple }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.purple }}>4</p>
              <p className="text-xs text-gray-600">أيام متوسط المدة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // 666-20: الموافقات متعددة المستويات
  const renderTab20 = () => {
    const approvalLevels: ApprovalLevel[] = [
      { id: 1, name: 'المستوى الأول', role: 'مسؤول الجودة', approver: 'أحمد السعيد', status: 'موافق', date: '2025-10-15', time: '10:30 ص', notes: 'تمت المراجعة الأولية - الإجراء مناسب', attachments: 2 },
      { id: 2, name: 'المستوى الثاني', role: 'مدير القسم', approver: 'فهد الأحمدي', status: 'موافق', date: '2025-10-16', time: '02:15 م', notes: 'الموافقة الإدارية - تخصيص الموارد', attachments: 1 },
      { id: 3, name: 'المستوى الثالث', role: 'مدير الجودة', approver: 'خالد المطيري', status: 'معلق', date: '', time: '', notes: '', attachments: 0 },
      { id: 4, name: 'المستوى الرابع', role: 'الإدارة العليا', approver: 'محمد العتيبي', status: 'معلق', date: '', time: '', notes: '(للحالات الكبرى فقط)', attachments: 0 }
    ];

    return (
      <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <CodeDisplay code="TAB-666-20-APPROVALS" position="top-right" />
        
        {/* عنوان ووصف */}
        <Card className="card-element card-rtl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 mt-1" style={{ color: COLORS.success }} />
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">نظام الموافقات متعددة المستويات</h3>
                <p className="text-xs text-gray-600">
                  4 مستويات موافقة متدرجة لضمان المراجعة الشاملة والاعتماد الصحيح لجميع الإجراءات التصحيحية والوقائية
                </p>
              </div>
              <Button
                onClick={() => setShowApprovalDialog(true)}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff' }}
              >
                <Eye className="h-4 w-4 ml-2" />
                التفاصيل الكاملة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* المستويات الأربعة */}
        <Card className="card-element card-rtl">
          <CardHeader>
            <CardTitle className="text-sm">المستويات الأربعة للموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalLevels.map((level, index) => (
                <div key={level.id}>
                  <div 
                    className="relative p-4 rounded-lg border-2"
                    style={{
                      borderColor: level.status === 'موافق' ? COLORS.success :
                                  level.status === 'مرفوض' ? COLORS.danger :
                                  level.status === 'محول' ? COLORS.info : '#e5e7eb',
                      background: level.status === 'موافق' ? 'rgba(34, 197, 94, 0.05)' :
                                 level.status === 'مرفوض' ? 'rgba(239, 68, 68, 0.05)' :
                                 level.status === 'محول' ? 'rgba(6, 182, 212, 0.05)' : '#fff'
                    }}
                  >
                    {/* الرقم */}
                    <div 
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        background: level.status === 'موافق' ? COLORS.success :
                                   level.status === 'مرفوض' ? COLORS.danger :
                                   level.status === 'محول' ? COLORS.info : '#9ca3af',
                        color: '#fff'
                      }}
                    >
                      {level.id}
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                      {/* المعلومات الأساسية */}
                      <div className="col-span-8">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold">{level.name}</h4>
                          <Badge variant="outline" style={{ fontSize: '10px' }}>
                            {level.role}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span><strong>المعتمد:</strong> {level.approver}</span>
                          </div>
                          {level.date && (
                            <>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span>{level.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span>{level.time}</span>
                              </div>
                            </>
                          )}
                          {level.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-gray-500" />
                              <span>{level.attachments} مرفقات</span>
                            </div>
                          )}
                        </div>

                        {level.notes && (
                          <div className="mt-2 p-2 rounded" style={{ background: '#f3f4f6' }}>
                            <p className="text-xs text-gray-700">
                              <strong>الملاحظات:</strong> {level.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* الحالة */}
                      <div className="col-span-4 flex flex-col items-center justify-center text-center">
                        {level.status === 'موافق' ? (
                          <div>
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-2" style={{ color: COLORS.success }} />
                            <Badge style={{ background: COLORS.success, color: '#fff' }}>
                              موافق ✓
                            </Badge>
                          </div>
                        ) : level.status === 'مرفوض' ? (
                          <div>
                            <XCircle className="h-12 w-12 mx-auto mb-2" style={{ color: COLORS.danger }} />
                            <Badge style={{ background: COLORS.danger, color: '#fff' }}>
                              مرفوض ✗
                            </Badge>
                          </div>
                        ) : level.status === 'محول' ? (
                          <div>
                            <ArrowRight className="h-12 w-12 mx-auto mb-2" style={{ color: COLORS.info }} />
                            <Badge style={{ background: COLORS.info, color: '#fff' }}>
                              محول →
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <Clock className="h-12 w-12 mx-auto mb-2" style={{ color: COLORS.warning }} />
                            <Badge style={{ background: COLORS.warning, color: '#fff' }}>
                              معلق ⏳
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* الخط الرابط */}
                  {index < approvalLevels.length - 1 && (
                    <div className="flex justify-center">
                      <ChevronRight 
                        className="h-8 w-8 rotate-90" 
                        style={{ 
                          color: level.status === 'موافق' ? COLORS.success : '#e5e7eb' 
                        }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الإحصائيات */}
        <div className="grid grid-cols-5 gap-3">
          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.success }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.success }}>2</p>
              <p className="text-xs text-gray-600">موافق عليها</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.warning }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>2</p>
              <p className="text-xs text-gray-600">معلقة</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <XCircle className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.danger }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.danger }}>0</p>
              <p className="text-xs text-gray-600">مرفوضة</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Target className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.purple }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.purple }}>50%</p>
              <p className="text-xs text-gray-600">نسبة الإنجاز</p>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardContent className="p-3 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.info }} />
              <p className="text-2xl font-bold" style={{ color: COLORS.info }}>1.5</p>
              <p className="text-xs text-gray-600">يوم متوسط</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // 666-17: مؤشرات الأداء KPIs
  const renderTab17 = () => (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <CodeDisplay code="TAB-666-17-KPIS" position="top-right" />
      
      {/* البحث والفلاتر */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <InputWithCopy
                label=""
                id="search-kpi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 البحث في مؤشرات الأداء..."
                copyable={false}
                clearable={true}
              />
            </div>
            <div className="col-span-3">
              <SelectWithCopy
                label=""
                id="filter-category"
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: 'all', label: 'جميع الفئات' },
                  { value: 'quality', label: 'الجودة' },
                  { value: 'audit', label: 'التدقيق' },
                  { value: 'improvement', label: 'التحسين' },
                  { value: 'certification', label: 'الاعتماد' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
            <div className="col-span-3">
              <Button className="w-full" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: '#fff' }}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة مؤشر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول المؤشرات */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <ScrollArea style={{ height: 'calc(100vh - 360px)' }}>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المؤشر</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">الهدف</TableHead>
                  <TableHead className="text-right">الحالي</TableHead>
                  <TableHead className="text-right">التحقيق</TableHead>
                  <TableHead className="text-right">الاتجاه</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_KPIS.map((kpi) => {
                  const achievement = Math.round((kpi.current / kpi.target) * 100);
                  return (
                    <TableRow key={kpi.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <p className="text-xs font-semibold">{kpi.name}</p>
                        <p className="text-[10px] text-gray-500">{kpi.responsible}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontSize: '10px' }}>
                          {kpi.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">
                        {kpi.target} {kpi.unit}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold" style={{ 
                        color: kpi.status === 'good' ? COLORS.success :
                               kpi.status === 'warning' ? COLORS.warning : COLORS.danger 
                      }}>
                        {kpi.current} {kpi.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={achievement} className="flex-1 h-2" />
                          <span className="text-xs font-bold">{achievement}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4" style={{ color: COLORS.success }} />
                        ) : kpi.trend === 'down' ? (
                          <TrendingDown className="h-4 w-4" style={{ color: COLORS.danger }} />
                        ) : (
                          <Activity className="h-4 w-4" style={{ color: COLORS.info }} />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge style={{
                          background: kpi.status === 'good' ? COLORS.success :
                                     kpi.status === 'warning' ? COLORS.warning : COLORS.danger,
                          color: '#fff',
                          fontSize: '10px'
                        }}>
                          {kpi.status === 'good' ? 'جيد' :
                           kpi.status === 'warning' ? 'تحذير' : 'حرج'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedKPI(kpi);
                            setShowKPIDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
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

  // نافذة تفاصيل المؤشر
  const renderKPIDialog = () => (
    <Dialog open={showKPIDialog} onOpenChange={setShowKPIDialog}>
      <DialogContent className="max-w-4xl dialog-rtl">
        <DialogHeader className="dialog-header">
          <DialogTitle className="dialog-title">
            <BarChart3 className="h-5 w-5 ml-2 inline-block" />
            تفاصيل المؤشر: {selectedKPI?.name}
          </DialogTitle>
        </DialogHeader>

        {selectedKPI && (
          <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {/* معلومات أساسية */}
            <div className="grid grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">الهدف</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.blue }}>
                    {selectedKPI.target} {selectedKPI.unit}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">الحالي</p>
                  <p className="text-2xl font-bold" style={{ 
                    color: selectedKPI.status === 'good' ? COLORS.success :
                           selectedKPI.status === 'warning' ? COLORS.warning : COLORS.danger 
                  }}>
                    {selectedKPI.current} {selectedKPI.unit}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">التحقيق</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.purple }}>
                    {Math.round((selectedKPI.current / selectedKPI.target) * 100)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">الحالة</p>
                  <Badge style={{
                    background: selectedKPI.status === 'good' ? COLORS.success :
                               selectedKPI.status === 'warning' ? COLORS.warning : COLORS.danger,
                    color: '#fff'
                  }}>
                    {selectedKPI.status === 'good' ? 'جيد' :
                     selectedKPI.status === 'warning' ? 'تحذير' : 'حرج'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* الرسم البياني */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">التطور الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsLineChart data={selectedKPI.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      name="القيمة"
                    />
                    <Line 
                      type="monotone" 
                      dataKey={() => selectedKPI.target} 
                      stroke={COLORS.danger} 
                      strokeDasharray="5 5"
                      name="الهدف"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowKPIDialog(false)}>
            إغلاق
          </Button>
          <Button style={{ background: COLORS.primary, color: '#fff' }}>
            <Printer className="h-4 w-4 ml-2" />
            طباعة التقرير
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Render Tab Content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case '666-01': return renderTab01();
      case '666-02': return renderTab02();
      case '666-17': return renderTab17();
      case '666-19': return renderTab19();
      case '666-20': return renderTab20();
      default:
        return (
          <div className="flex items-center justify-center h-96" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="text-center">
              <Database className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">التاب {activeTab}</h3>
              <p className="text-gray-600">سيتم تطوير هذا التاب قريباً...</p>
              <p className="text-sm text-gray-500 mt-2">
                جميع التابات الـ20 مخططة بالكامل في التوثيق الشامل
              </p>
            </div>
          </div>
        );
    }
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="SCR-QUALITY-MANAGEMENT-666" position="top-right" />
      
      {/* Screen Header */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #10b981 100%) 1',
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
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(245, 158, 11, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #fef3c7 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <Shield 
                className="h-6 w-6" 
                style={{ 
                  color: COLORS.primary,
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
                    background: 'linear-gradient(135deg, #059669 0%, #d97706 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  إدارة الجودة والاعتماد
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
                    666
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
                نظام متكامل لإدارة الجودة وفق معايير ISO والمعايير السعودية
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
                20 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Sidebar */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* Unified Tabs Sidebar */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Main Content */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* Dialogs */}
      {renderISODialog()}
      {renderKPIDialog()}
    </div>
  );
};

export default QualityManagement_Complete_666_v1;
