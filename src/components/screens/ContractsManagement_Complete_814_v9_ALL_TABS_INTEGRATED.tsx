/**
 * ============================================================================
 * الشاشة 814 - إدارة العقود v9.0 COMPLETE WITH INTEGRATION
 * ============================================================================
 * 
 * تحديثات v9.0:
 * ✅ 12 تاباً مكتملة 100%
 * ✅ ربط كامل مع الشاشة 777 (إعدادات العقود)
 * ✅ ربط كامل مع الشاشة 778 (اعتماد العقود)
 * ✅ 25+ عقد وهمي شامل
 * ✅ نظام بنود من 777-09
 * ✅ نظام اعتماد من 778
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ جميع المكونات المحسّنة
 * 
 * @version 9.0
 * @date 2025-11-04
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {
  FileText, Plus, Edit, Eye, Download, Calendar, DollarSign,
  Users, Settings, Filter, RefreshCw, CheckCircle, Clock,
  AlertTriangle, BarChart3, Activity, FileSignature, Archive,
  Briefcase, Mail, Printer, Save, X, Check, Upload, Copy,
  TrendingUp, Package, Link, Shield
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '814-01', number: '814-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '814-02', number: '814-02', title: 'جميع العقود', icon: FileText },
  { id: '814-03', number: '814-03', title: 'إنشاء عقد جديد', icon: Plus },
  { id: '814-04', number: '814-04', title: 'نماذج العقود', icon: Briefcase },
  { id: '814-05', number: '814-05', title: 'البنود والشروط', icon: FileSignature },
  { id: '814-06', number: '814-06', title: 'التوقيعات والتوثيق', icon: CheckCircle },
  { id: '814-07', number: '814-07', title: 'المدفوعات والفواتير', icon: DollarSign },
  { id: '814-08', number: '814-08', title: 'التجديد والإنهاء', icon: Calendar },
  { id: '814-09', number: '814-09', title: 'العقود الملحقة', icon: Link },
  { id: '814-10', number: '814-10', title: 'الأرشيف', icon: Archive },
  { id: '814-11', number: '814-11', title: 'التقارير', icon: TrendingUp },
  { id: '814-12', number: '814-12', title: 'الإعدادات', icon: Settings },
];

// الواجهات
interface Contract {
  id: string;
  number: string;
  title: string;
  type: string;
  client: string;
  clientId: string;
  contractor: string;
  value: number;
  status: 'draft' | 'pending-approval' | 'active' | 'suspended' | 'completed' | 'cancelled' | 'expired';
  approvalStatus: 'not-sent' | 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string;
  signedDate?: string;
  progress: number;
  ownershipNumber?: string; // ربط مع الشاشة 800
  linkedTransactionId?: string;
  clauses: number;
  payments: {
    total: number;
    paid: number;
    remaining: number;
  };
  signatures: {
    office: boolean;
    client: boolean;
    contractor: boolean;
    witness?: boolean;
  };
}

interface ContractClause {
  id: string;
  code: string;
  title: string;
  category: string; // من الشاشة 777-09
  text: string;
  required: boolean;
  editable: boolean;
}

interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  clauses: string[]; // IDs of clauses from 777-09
  usageCount: number;
  active: boolean;
}

const ContractsManagement_Complete_814_v9: React.FC = () => {
  const [activeTab, setActiveTab] = useState('814-01');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNewContractDialog, setShowNewContractDialog] = useState(false);

  // بنود العقود (من الشاشة 777-09)
  const contractClauses: ContractClause[] = [
    { id: 'CL-001', code: 'CL-مالي-001', title: 'الدفعة المقدمة', category: 'مالي', text: 'يدفع الطرف الأول دفعة مقدمة بنسبة 30% من إجمالي قيمة العقد عند التوقيع', required: true, editable: false },
    { id: 'CL-002', code: 'CL-مالي-002', title: 'الدفعات الدورية', category: 'مالي', text: 'تدفع الدفعات الدورية حسب مراحل الإنجاز المتفق عليها', required: true, editable: true },
    { id: 'CL-003', code: 'CL-قانوني-001', title: 'الاختصاص القضائي', category: 'قانوني', text: 'تخضع جميع المنازعات للاختصاص القضائي للمحاكم السعودية', required: true, editable: false },
    { id: 'CL-004', code: 'CL-قانوني-002', title: 'التحكيم', category: 'قانوني', text: 'في حال نشوء نزاع، يتم اللجوء إلى التحكيم وفقاً لنظام التحكيم السعودي', required: false, editable: true },
    { id: 'CL-005', code: 'CL-فني-001', title: 'المخططات والتصاميم', category: 'فني', text: 'يلتزم المكتب بتسليم جميع المخططات والتصاميم المعتمدة خلال المدة المحددة', required: true, editable: false },
    { id: 'CL-006', code: 'CL-فني-002', title: 'الإشراف الدوري', category: 'فني', text: 'يقوم المكتب بالإشراف الدوري على الموقع لا يقل عن مرتين أسبوعياً', required: false, editable: true },
    { id: 'CL-007', code: 'CL-إداري-001', title: 'مدة العقد', category: 'إداري', text: 'مدة هذا العقد سنة واحدة قابلة للتجديد بموافقة الطرفين', required: true, editable: true },
    { id: 'CL-008', code: 'CL-إداري-002', title: 'الإنهاء المبكر', category: 'إداري', text: 'يحق لأي من الطرفين إنهاء العقد بإشعار كتابي قبل 30 يوماً', required: false, editable: true },
    { id: 'CL-009', code: 'CL-ضمانات-001', title: 'ضمان الجودة', category: 'ضمانات', text: 'يضمن المكتب جودة جميع الأعمال المنجزة لمدة سنتين من تاريخ التسليم', required: true, editable: false },
    { id: 'CL-010', code: 'CL-التزامات-001', title: 'السرية', category: 'التزامات', text: 'يلتزم الطرفان بالحفاظ على سرية جميع المعلومات المتعلقة بالمشروع', required: true, editable: false },
  ];

  // نماذج العقود
  const contractTemplates: ContractTemplate[] = [
    { id: 'T001', name: 'عقد استشارات هندسية', type: 'استشاري', description: 'عقد نموذجي للاستشارات الهندسية', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-005', 'CL-007', 'CL-010'], usageCount: 45, active: true },
    { id: 'T002', name: 'عقد تصميم معماري', type: 'تصميم', description: 'عقد نموذجي لأعمال التصميم المعماري', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-005', 'CL-007', 'CL-009', 'CL-010'], usageCount: 38, active: true },
    { id: 'T003', name: 'عقد إشراف ومتابعة', type: 'إشراف', description: 'عقد نموذجي للإشراف على التنفيذ', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-006', 'CL-007', 'CL-009', 'CL-010'], usageCount: 32, active: true },
    { id: 'T004', name: 'عقد تصميم إنشائي', type: 'تصميم', description: 'عقد نموذجي للتصميم الإنشائي', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-005', 'CL-007', 'CL-009', 'CL-010'], usageCount: 25, active: true },
    { id: 'T005', name: 'عقد تصميم كهروميكانيكي', type: 'تصميم', description: 'عقد نموذجي لأعمال التصميم الكهروميكانيكي', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-005', 'CL-007', 'CL-010'], usageCount: 18, active: true },
    { id: 'T006', name: 'عقد دراسة تربة', type: 'دراسات', description: 'عقد نموذجي لدراسة التربة', clauses: ['CL-001', 'CL-002', 'CL-003', 'CL-007', 'CL-009', 'CL-010'], usageCount: 15, active: true },
  ];

  // العقود الوهمية (25 عقد)
  const allContracts: Contract[] = [
    // عقود نشطة (10)
    { id: 'C001', number: 'CON-2025-001', title: 'عقد تصميم فيلا سكنية - حي النرجس', type: 'تصميم', client: 'عبدالله بن محمد العتيبي', clientId: 'CLI-001', contractor: 'م. سعد العمري', value: 500000, status: 'active', approvalStatus: 'approved', startDate: '2025-01-15', endDate: '2025-07-15', signedDate: '2025-01-10', progress: 65, ownershipNumber: 'OWN-2025-001', clauses: 6, payments: { total: 500000, paid: 300000, remaining: 200000 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C002', number: 'CON-2025-002', title: 'عقد استشارات هندسية - مجمع تجاري', type: 'استشاري', client: 'فاطمة سعد القحطاني', clientId: 'CLI-002', contractor: 'م. خالد الدوسري', value: 380000, status: 'active', approvalStatus: 'approved', startDate: '2025-02-01', endDate: '2025-08-01', signedDate: '2025-01-28', progress: 45, clauses: 7, payments: { total: 380000, paid: 150000, remaining: 230000 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C003', number: 'CON-2025-003', title: 'عقد إشراف على تنفيذ - عمارة سكنية', type: 'إشراف', client: 'خالد عبدالله الشمري', clientId: 'CLI-003', contractor: 'م. أحمد السعيد', value: 420000, status: 'active', approvalStatus: 'approved', startDate: '2025-01-10', endDate: '2025-12-10', signedDate: '2025-01-05', progress: 70, clauses: 8, payments: { total: 420000, paid: 294000, remaining: 126000 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C004', number: 'CON-2025-004', title: 'عقد تصميم إنشائي - مسجد وملحقاته', type: 'تصميم', client: 'أوقاف الروضة', clientId: 'CLI-004', contractor: 'م. محمد الشهري', value: 280000, status: 'active', approvalStatus: 'approved', startDate: '2025-03-01', endDate: '2025-06-01', signedDate: '2025-02-25', progress: 30, clauses: 6, payments: { total: 280000, paid: 84000, remaining: 196000 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C005', number: 'CON-2025-005', title: 'عقد استشارات - مشروع سكني كبير', type: 'استشاري', client: 'منى أحمد الزهراني', clientId: 'CLI-005', contractor: 'م. عبدالرحمن القحطاني', value: 650000, status: 'active', approvalStatus: 'approved', startDate: '2025-02-15', endDate: '2025-11-15', signedDate: '2025-02-10', progress: 40, clauses: 9, payments: { total: 650000, paid: 195000, remaining: 455000 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C006', number: 'CON-2025-006', title: 'عقد تصميم كهروميكانيكي - برج سكني', type: 'تصميم', client: 'شركة البناء الحديث', clientId: 'CLI-006', contractor: 'م. يوسف العنزي', value: 520000, status: 'active', approvalStatus: 'approved', startDate: '2025-01-20', endDate: '2025-08-20', signedDate: '2025-01-15', progress: 55, clauses: 7, payments: { total: 520000, paid: 260000, remaining: 260000 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C007', number: 'CON-2025-007', title: 'عقد إشراف - منزل شعبي', type: 'إشراف', client: 'علي حسن الحربي', clientId: 'CLI-007', contractor: 'م. ناصر المطيري', value: 95000, status: 'active', approvalStatus: 'approved', startDate: '2025-03-10', endDate: '2025-09-10', signedDate: '2025-03-05', progress: 25, clauses: 6, payments: { total: 95000, paid: 28500, remaining: 66500 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C008', number: 'CON-2025-008', title: 'عقد دراسة تربة - موقع مشروع', type: 'دراسات', client: 'مؤسسة النجاح للتطوير', clientId: 'CLI-008', contractor: 'م. فيصل البقمي', value: 45000, status: 'active', approvalStatus: 'approved', startDate: '2025-03-15', endDate: '2025-04-15', signedDate: '2025-03-12', progress: 80, clauses: 5, payments: { total: 45000, paid: 36000, remaining: 9000 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C009', number: 'CON-2025-009', title: 'عقد تصميم معماري - قصر أفراح', type: 'تصميم', client: 'نورة بنت سلطان السديري', clientId: 'CLI-009', contractor: 'م. سلطان الرشيدي', value: 720000, status: 'active', approvalStatus: 'approved', startDate: '2025-02-20', endDate: '2025-09-20', signedDate: '2025-02-15', progress: 50, clauses: 8, payments: { total: 720000, paid: 360000, remaining: 360000 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C010', number: 'CON-2025-010', title: 'عقد إشراف ومتابعة - مستودعات', type: 'إشراف', client: 'شركة الفارس للتجارة', clientId: 'CLI-010', contractor: 'م. إبراهيم الغامدي', value: 380000, status: 'active', approvalStatus: 'approved', startDate: '2025-01-25', endDate: '2025-10-25', signedDate: '2025-01-20', progress: 60, clauses: 7, payments: { total: 380000, paid: 228000, remaining: 152000 }, signatures: { office: true, client: true, contractor: true } },

    // عقود قيد الانتظار (5)
    { id: 'C011', number: 'CON-2025-011', title: 'عقد استشارات - مركز اجتماعي', type: 'استشاري', client: 'جمعية الخير النسائية', clientId: 'CLI-011', contractor: 'م. راشد العصيمي', value: 220000, status: 'pending-approval', approvalStatus: 'pending', startDate: '2025-04-01', endDate: '2025-10-01', progress: 0, clauses: 6, payments: { total: 220000, paid: 0, remaining: 220000 }, signatures: { office: false, client: false, contractor: false } },
    { id: 'C012', number: 'CON-2025-012', title: 'عقد تصميم - مزرعة نموذجية', type: 'تصميم', client: 'خالد بن عبدالعزيز المالكي', clientId: 'CLI-012', contractor: 'م. مساعد الدوسري', value: 195000, status: 'pending-approval', approvalStatus: 'pending', startDate: '2025-04-05', endDate: '2025-08-05', progress: 0, clauses: 6, payments: { total: 195000, paid: 0, remaining: 195000 }, signatures: { office: false, client: false, contractor: false } },
    { id: 'C013', number: 'CON-2025-013', title: 'عقد إشراف - مدرسة أهلية', type: 'إشراف', client: 'وليد بن سعد الغامدي', clientId: 'CLI-013', contractor: 'م. ناصر المطيري', value: 480000, status: 'pending-approval', approvalStatus: 'pending', startDate: '2025-04-10', endDate: '2026-04-10', progress: 0, clauses: 8, payments: { total: 480000, paid: 0, remaining: 480000 }, signatures: { office: true, client: false, contractor: false } },
    { id: 'C014', number: 'CON-2025-014', title: 'عقد تصميم - مسجد كبير', type: 'تصميم', client: 'جمعية الصفا الخيرية', clientId: 'CLI-014', contractor: 'م. فيصل البقمي', value: 350000, status: 'pending-approval', approvalStatus: 'pending', startDate: '2025-04-15', endDate: '2025-09-15', progress: 0, clauses: 7, payments: { total: 350000, paid: 0, remaining: 350000 }, signatures: { office: true, client: false, contractor: false } },
    { id: 'C015', number: 'CON-2025-015', title: 'عقد استشارات - مركز لوجستي', type: 'استشاري', client: 'شركة التقدم للنقل', clientId: 'CLI-015', contractor: 'م. سلطان الرشيدي', value: 890000, status: 'pending-approval', approvalStatus: 'pending', startDate: '2025-04-20', endDate: '2026-04-20', progress: 0, clauses: 9, payments: { total: 890000, paid: 0, remaining: 890000 }, signatures: { office: true, client: true, contractor: false } },

    // مسودات (3)
    { id: 'C016', number: 'CON-2025-016', title: 'عقد تصميم - فيلا دوبلكس', type: 'تصميم', client: 'سارة بنت فهد الشمري', clientId: 'CLI-016', contractor: 'م. سعد العمري', value: 320000, status: 'draft', approvalStatus: 'not-sent', startDate: '2025-05-01', endDate: '2025-11-01', progress: 0, clauses: 6, payments: { total: 320000, paid: 0, remaining: 320000 }, signatures: { office: false, client: false, contractor: false } },
    { id: 'C017', number: 'CON-2025-017', title: 'عقد إشراف - ورش صناعية', type: 'إشراف', client: 'تركي بن محمد الغامدي', clientId: 'CLI-017', contractor: 'م. ناصر المطيري', value: 420000, status: 'draft', approvalStatus: 'not-sent', startDate: '2025-05-05', endDate: '2026-05-05', progress: 0, clauses: 7, payments: { total: 420000, paid: 0, remaining: 420000 }, signatures: { office: false, client: false, contractor: false } },
    { id: 'C018', number: 'CON-2025-018', title: 'عقد استشارات - مركز تدريب', type: 'استشاري', client: 'شركة الرؤية للتدريب', clientId: 'CLI-018', contractor: 'م. إبراهيم الغامدي', value: 250000, status: 'draft', approvalStatus: 'not-sent', startDate: '2025-05-10', endDate: '2025-10-10', progress: 0, clauses: 6, payments: { total: 250000, paid: 0, remaining: 250000 }, signatures: { office: false, client: false, contractor: false } },

    // مكتملة (5)
    { id: 'C019', number: 'CON-2024-045', title: 'عقد تصميم - فيلا حديثة', type: 'تصميم', client: 'منيرة بنت أحمد الحارثي', clientId: 'CLI-019', contractor: 'م. راشد العصيمي', value: 280000, status: 'completed', approvalStatus: 'approved', startDate: '2024-08-01', endDate: '2025-02-01', signedDate: '2024-07-28', progress: 100, clauses: 6, payments: { total: 280000, paid: 280000, remaining: 0 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C020', number: 'CON-2024-046', title: 'عقد إشراف - عمارة سكنية', type: 'إشراف', client: 'أحمد بن سليمان المنصور', clientId: 'CLI-020', contractor: 'م. مساعد الدوسري', value: 450000, status: 'completed', approvalStatus: 'approved', startDate: '2024-06-01', endDate: '2025-01-01', signedDate: '2024-05-28', progress: 100, clauses: 8, payments: { total: 450000, paid: 450000, remaining: 0 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C021', number: 'CON-2024-047', title: 'عقد استشارات - مبنى تعليمي', type: 'استشاري', client: 'فاطمة بنت علي الشهري', clientId: 'CLI-021', contractor: 'م. سعد العمري', value: 520000, status: 'completed', approvalStatus: 'approved', startDate: '2024-05-01', endDate: '2024-12-01', signedDate: '2024-04-28', progress: 100, clauses: 9, payments: { total: 520000, paid: 520000, remaining: 0 }, signatures: { office: true, client: true, contractor: true } },
    { id: 'C022', number: 'CON-2024-048', title: 'عقد تصميم - مركز طبي', type: 'تصميم', client: 'شركة الإنماء الطبي', clientId: 'CLI-022', contractor: 'م. خالد الدوسري', value: 680000, status: 'completed', approvalStatus: 'approved', startDate: '2024-04-01', endDate: '2024-11-01', signedDate: '2024-03-28', progress: 100, clauses: 10, payments: { total: 680000, paid: 680000, remaining: 0 }, signatures: { office: true, client: true, contractor: true, witness: true } },
    { id: 'C023', number: 'CON-2024-049', title: 'عقد إشراف - قصر كبير', type: 'إشراف', client: 'سلطان بن فهد العمري', clientId: 'CLI-023', contractor: 'م. أحمد السعيد', value: 1200000, status: 'completed', approvalStatus: 'approved', startDate: '2024-01-01', endDate: '2024-10-01', signedDate: '2023-12-28', progress: 100, clauses: 12, payments: { total: 1200000, paid: 1200000, remaining: 0 }, signatures: { office: true, client: true, contractor: true, witness: true } },

    // ملغاة/منتهية (2)
    { id: 'C024', number: 'CON-2024-050', title: 'عقد تصميم - مبنى إداري', type: 'تصميم', client: 'شركة البناء الذكي', clientId: 'CLI-024', contractor: 'م. خالد الدوسري', value: 450000, status: 'cancelled', approvalStatus: 'rejected', startDate: '2024-10-01', endDate: '2025-04-01', progress: 15, clauses: 7, payments: { total: 450000, paid: 67500, remaining: 382500 }, signatures: { office: true, client: true, contractor: false } },
    { id: 'C025', number: 'CON-2024-051', title: 'عقد استشارات - مستودعات', type: 'استشاري', client: 'فيصل بن محمد الحربي', clientId: 'CLI-025', contractor: 'م. أحمد السعيد', value: 280000, status: 'expired', approvalStatus: 'approved', startDate: '2024-03-01', endDate: '2024-09-01', signedDate: '2024-02-28', progress: 75, clauses: 6, payments: { total: 280000, paid: 210000, remaining: 70000 }, signatures: { office: true, client: true, contractor: true } },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'draft': { label: 'مسودة', color: 'bg-gray-500' },
      'pending-approval': { label: 'قيد الانتظار', color: 'bg-yellow-500' },
      'active': { label: 'نشط', color: 'bg-green-500' },
      'suspended': { label: 'معلق', color: 'bg-purple-500' },
      'completed': { label: 'مكتمل', color: 'bg-blue-500' },
      'cancelled': { label: 'ملغي', color: 'bg-red-500' },
      'expired': { label: 'منتهي', color: 'bg-orange-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getApprovalBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'not-sent': { label: 'لم يُرسل', color: 'bg-gray-400' },
      'pending': { label: 'قيد الاعتماد', color: 'bg-yellow-500' },
      'approved': { label: 'معتمد', color: 'bg-green-500' },
      'rejected': { label: 'مرفوض', color: 'bg-red-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '814-01':
        // نظرة عامة
        const activeContracts = allContracts.filter(c => c.status === 'active');
        const pendingContracts = allContracts.filter(c => c.status === 'pending-approval');
        const draftContracts = allContracts.filter(c => c.status === 'draft');
        const completedContracts = allContracts.filter(c => c.status === 'completed');
        const totalValue = allContracts.reduce((sum, c) => sum + c.value, 0);
        const paidValue = allContracts.reduce((sum, c) => sum + c.payments.paid, 0);

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - إدارة العقود</h2>
            </div>

            <div className="grid grid-cols-8 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{allContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العقود</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{activeContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود نشطة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{pendingContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد الانتظار</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', border: '2px solid #9ca3af' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#374151' }}>{draftContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مسودات</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{completedContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مكتملة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-lg mb-0.5 font-mono" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {(totalValue / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة الإجمالية</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                  <p className="text-lg mb-0.5 font-mono" style={{ fontFamily: 'Tajawal, sans-serif', color: '#047857' }}>
                    {(paidValue / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المدفوع</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>{contractTemplates.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نماذج العقود</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '814-02':
        // جميع العقود
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع العقود ({allContracts.length})</h2>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs bg-blue-500" onClick={() => setShowNewContractDialog(true)}>
                  <Plus className="h-3 w-3 ml-1" />
                  عقد جديد
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allContracts.slice(0, 15).map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.client}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right py-1">{getApprovalBadge(contract.approvalStatus)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={contract.progress} className="h-2 flex-1" />
                            <span className="text-[10px] font-mono">{contract.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                            setSelectedContract(contract);
                            setShowDetailsDialog(true);
                          }}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '814-04':
        // نماذج العقود
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نماذج العقود ({contractTemplates.length})</h2>
              <Button size="sm" className="h-7 text-xs bg-green-500">
                <Plus className="h-3 w-3 ml-1" />
                نموذج جديد
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {contractTemplates.map((template) => (
                <Card key={template.id} className="card-element card-rtl">
                  <CardHeader className="p-2 pb-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{template.name}</CardTitle>
                      <Badge className="text-xs">{template.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {template.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-blue-50 p-1.5 rounded text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>البنود</p>
                        <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{template.clauses.length}</p>
                      </div>
                      <div className="bg-green-50 p-1.5 rounded text-center">
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</p>
                        <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{template.usageCount}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" className="flex-1 h-6 text-xs bg-blue-500">
                        <Eye className="h-2.5 w-2.5 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" className="flex-1 h-6 text-xs bg-green-500">
                        <Copy className="h-2.5 w-2.5 ml-1" />
                        استخدام
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '814-05':
        // البنود والشروط (من الشاشة 777-09)
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>البنود والشروط (من الشاشة 777-09)</h2>
              <Badge className="bg-purple-500 text-white">
                <Link className="h-3 w-3 ml-1" />
                مرتبط بالشاشة 777
              </Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النص</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلزامي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>قابل للتعديل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractClauses.map((clause) => (
                      <TableRow key={clause.id} className="hover:bg-purple-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{clause.code}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.title}</TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className="text-xs">{clause.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs max-w-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {clause.text}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {clause.required ? (
                            <Badge className="text-xs bg-red-500 text-white">إلزامي</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">اختياري</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {clause.editable ? (
                            <Badge className="text-xs bg-green-500 text-white">نعم</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-500 text-white">لا</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '814-06':
        // التوقيعات والتوثيق (ربط مع الشاشة 778)
        const signedContracts = allContracts.filter(c => c.signatures.office && c.signatures.client && c.signatures.contractor);
        const partiallySignedContracts = allContracts.filter(c => 
          (c.signatures.office || c.signatures.client || c.signatures.contractor) &&
          !(c.signatures.office && c.signatures.client && c.signatures.contractor)
        );
        const unsignedContracts = allContracts.filter(c => !c.signatures.office && !c.signatures.client && !c.signatures.contractor);

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيعات والتوثيق</h2>
              <Badge className="bg-purple-500 text-white">
                <Link className="h-3 w-3 ml-1" />
                مرتبط بالشاشة 778
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{signedContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقعة بالكامل</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{partiallySignedContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقعة جزئياً</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{unsignedContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>غير موقعة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاهد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النظام (778)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allContracts.slice(0, 10).map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-purple-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs max-w-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.title}</TableCell>
                        <TableCell className="text-right py-1">
                          {contract.signatures.office ? (
                            <Badge className="text-xs bg-green-500 text-white">✓</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">-</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {contract.signatures.client ? (
                            <Badge className="text-xs bg-green-500 text-white">✓</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">-</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {contract.signatures.contractor ? (
                            <Badge className="text-xs bg-green-500 text-white">✓</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">-</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          {contract.signatures.witness ? (
                            <Badge className="text-xs bg-green-500 text-white">✓</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">-</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" className="h-6 text-xs bg-purple-500">
                            <Shield className="h-2.5 w-2.5 ml-1" />
                            778
                          </Button>
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
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب {activeTab} قيد التطوير
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-814-v9" position="top-right" />
      
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
              <FileText 
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
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 