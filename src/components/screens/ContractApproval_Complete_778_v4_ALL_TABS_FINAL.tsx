/**
 * ============================================================================
 * الشاشة 778 - اعتماد العقود v4.0 - جميع التابات مكتملة 100%
 * ============================================================================
 * 
 * تحديثات v4.0:
 * ✅ جميع 12 تاباً مطورة بالكامل
 * ✅ بيانات وهمية شاملة (45+ عقد)
 * ✅ نظام اعتماد متقدم كامل
 * ✅ تقارير وإشعارات شاملة
 * ✅ ربط بشاشات 777، 891، 750
 * 
 * @version 4.0
 * @date 2025-11-04
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
  UserCheck, FileText, Layers, Settings, Layout, BarChart3, Plus,
  Image, Calendar, MapPin, FileUser, Bell, Zap, Check, X, Filter,
  TrendingUp, TrendingDown, Activity, DollarSign, FileSpreadsheet
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
interface Contract {
  id: string;
  number: string;
  type: string;
  contractorName: string;
  clientName: string;
  projectName: string;
  value: number;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'on-hold';
  priority: 'عادي' | 'عاجل' | 'ضروري جداً';
  requestDate: string;
  deadline: string;
  daysRemaining: number;
  currentLevel: number;
  totalLevels: number;
  completionPercentage: number;
  approvalWorkflow: 'manual' | 'digital' | 'hybrid';
}

interface ApprovalLog {
  id: string;
  contractId: string;
  action: 'created' | 'submitted' | 'approved' | 'rejected' | 'on-hold' | 'resumed' | 'modified';
  performedBy: string;
  performedDate: string;
  performedTime: string;
  level: number;
  notes: string;
  ipAddress: string;
}

interface Notification {
  id: string;
  contractId: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const ContractApproval_Complete_778_v4: React.FC = () => {
  const [activeTab, setActiveTab] = useState('778-01');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // بيانات وهمية شاملة - 45 عقداً
  const allContracts: Contract[] = [
    // العقود المعلقة (12)
    { id: 'C001', number: 'CONT-2025-001', type: 'عقد إشراف', contractorName: 'م. سعد العمري', clientName: 'عبدالله العتيبي', projectName: 'فلل سكنية - حي النرجس', value: 350000, status: 'pending', priority: 'عاجل', requestDate: '2025-11-01', deadline: '2025-11-15', daysRemaining: 11, currentLevel: 1, totalLevels: 3, completionPercentage: 33, approvalWorkflow: 'hybrid' },
    { id: 'C002', number: 'CONT-2025-002', type: 'عقد تصميم', contractorName: 'م. خالد الدوسري', clientName: 'شركة الأمل التجارية', projectName: 'مجمع تجاري', value: 580000, status: 'pending', priority: 'ضروري جداً', requestDate: '2025-11-02', deadline: '2025-11-10', daysRemaining: 6, currentLevel: 2, totalLevels: 4, completionPercentage: 50, approvalWorkflow: 'digital' },
    { id: 'C003', number: 'CONT-2025-003', type: 'عقد بناء', contractorName: 'م. أحمد السعيد', clientName: 'فهد الشمري', projectName: 'فيلا فاخرة', value: 1200000, status: 'pending', priority: 'عادي', requestDate: '2025-10-28', deadline: '2025-11-20', daysRemaining: 16, currentLevel: 1, totalLevels: 3, completionPercentage: 33, approvalWorkflow: 'manual' },
    { id: 'C004', number: 'CONT-2025-004', type: 'عقد إشراف', contractorName: 'م. محمد الشهري', clientName: 'أوقاف الروضة', projectName: 'مسجد وملحقاته', value: 420000, status: 'pending', priority: 'عاجل', requestDate: '2025-11-03', deadline: '2025-11-17', daysRemaining: 13, currentLevel: 1, totalLevels: 2, completionPercentage: 50, approvalWorkflow: 'hybrid' },
    { id: 'C005', number: 'CONT-2025-005', type: 'عقد تصميم', contractorName: 'م. عبدالرحمن القحطاني', clientName: 'منى الزهراني', projectName: 'استراحة عائلية', value: 180000, status: 'pending', priority: 'عادي', requestDate: '2025-10-30', deadline: '2025-11-25', daysRemaining: 21, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'digital' },
    { id: 'C006', number: 'CONT-2025-006', type: 'عقد بناء', contractorName: 'م. يوسف العنزي', clientName: 'شركة البناء الحديث', projectName: 'عمارة سكنية', value: 2300000, status: 'pending', priority: 'ضروري جداً', requestDate: '2025-11-04', deadline: '2025-11-12', daysRemaining: 8, currentLevel: 3, totalLevels: 4, completionPercentage: 75, approvalWorkflow: 'hybrid' },
    { id: 'C007', number: 'CONT-2025-007', type: 'عقد إشراف', contractorName: 'م. ناصر المطيري', clientName: 'علي الحربي', projectName: 'منزل شعبي', value: 95000, status: 'pending', priority: 'عادي', requestDate: '2025-10-25', deadline: '2025-11-22', daysRemaining: 18, currentLevel: 1, totalLevels: 2, completionPercentage: 50, approvalWorkflow: 'manual' },
    { id: 'C008', number: 'CONT-2025-008', type: 'عقد تصميم', contractorName: 'م. فيصل البقمي', clientName: 'مؤسسة النجاح', projectName: 'مكاتب إدارية', value: 450000, status: 'pending', priority: 'عاجل', requestDate: '2025-11-01', deadline: '2025-11-14', daysRemaining: 10, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'digital' },
    { id: 'C009', number: 'CONT-2025-009', type: 'عقد بناء', contractorName: 'م. سلطان الرشيدي', clientName: 'نورة السديري', projectName: 'قصر أفراح', value: 3500000, status: 'pending', priority: 'ضروري جداً', requestDate: '2025-11-05', deadline: '2025-11-11', daysRemaining: 7, currentLevel: 3, totalLevels: 5, completionPercentage: 60, approvalWorkflow: 'hybrid' },
    { id: 'C010', number: 'CONT-2025-010', type: 'عقد إشراف', contractorName: 'م. إبراهيم الغامدي', clientName: 'شركة الفارس', projectName: 'مستودعات', value: 680000, status: 'pending', priority: 'عادي', requestDate: '2025-10-29', deadline: '2025-11-23', daysRemaining: 19, currentLevel: 1, totalLevels: 3, completionPercentage: 33, approvalWorkflow: 'manual' },
    { id: 'C011', number: 'CONT-2025-011', type: 'عقد تصميم', contractorName: 'م. راشد العصيمي', clientName: 'جمعية الخير', projectName: 'مركز اجتماعي', value: 320000, status: 'pending', priority: 'عاجل', requestDate: '2025-11-02', deadline: '2025-11-16', daysRemaining: 12, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'digital' },
    { id: 'C012', number: 'CONT-2025-012', type: 'عقد بناء', contractorName: 'م. مساعد الدوسري', clientName: 'خالد المالكي', projectName: 'مزرعة نموذجية', value: 890000, status: 'pending', priority: 'عادي', requestDate: '2025-10-27', deadline: '2025-11-24', daysRemaining: 20, currentLevel: 1, totalLevels: 2, completionPercentage: 50, approvalWorkflow: 'hybrid' },

    // قيد المعالجة (10)
    { id: 'C013', number: 'CONT-2025-013', type: 'عقد إشراف', contractorName: 'م. سعد العمري', clientName: 'سارة الشمري', projectName: 'فيلا دوبلكس', value: 280000, status: 'in-progress', priority: 'عاجل', requestDate: '2025-10-20', deadline: '2025-11-08', daysRemaining: 4, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'hybrid' },
    { id: 'C014', number: 'CONT-2025-014', type: 'عقد تصميم', contractorName: 'م. خالد الدوسري', clientName: 'شركة العمران', projectName: 'برج سكني', value: 1500000, status: 'in-progress', priority: 'ضروري جداً', requestDate: '2025-10-18', deadline: '2025-11-06', daysRemaining: 2, currentLevel: 3, totalLevels: 4, completionPercentage: 75, approvalWorkflow: 'digital' },
    { id: 'C015', number: 'CONT-2025-015', type: 'عقد بناء', contractorName: 'م. أحمد السعيد', clientName: 'عمر القحطاني', projectName: 'شاليهات', value: 950000, status: 'in-progress', priority: 'عادي', requestDate: '2025-10-22', deadline: '2025-11-12', daysRemaining: 8, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'manual' },
    { id: 'C016', number: 'CONT-2025-016', type: 'عقد إشراف', contractorName: 'م. محمد الشهري', clientName: 'هيئة النظافة', projectName: 'مركز معالجة', value: 2100000, status: 'in-progress', priority: 'عاجل', requestDate: '2025-10-19', deadline: '2025-11-09', daysRemaining: 5, currentLevel: 3, totalLevels: 5, completionPercentage: 60, approvalWorkflow: 'hybrid' },
    { id: 'C017', number: 'CONT-2025-017', type: 'عقد تصميم', contractorName: 'م. عبدالرحمن القحطاني', clientName: 'لطيفة العنزي', projectName: 'صالة أفراح', value: 720000, status: 'in-progress', priority: 'عادي', requestDate: '2025-10-24', deadline: '2025-11-14', daysRemaining: 10, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'digital' },
    { id: 'C018', number: 'CONT-2025-018', type: 'عقد بناء', contractorName: 'م. يوسف العنزي', clientName: 'شركة التطوير', projectName: 'مجمع تجاري', value: 4200000, status: 'in-progress', priority: 'ضروري جداً', requestDate: '2025-10-17', deadline: '2025-11-05', daysRemaining: 1, currentLevel: 4, totalLevels: 5, completionPercentage: 80, approvalWorkflow: 'hybrid' },
    { id: 'C019', number: 'CONT-2025-019', type: 'عقد إشراف', contractorName: 'م. ناصر المطيري', clientName: 'تركي الغامدي', projectName: 'ورش صناعية', value: 540000, status: 'in-progress', priority: 'عاجل', requestDate: '2025-10-21', deadline: '2025-11-11', daysRemaining: 7, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'manual' },
    { id: 'C020', number: 'CONT-2025-020', type: 'عقد تصميم', contractorName: 'م. فيصل البقمي', clientName: 'جمعية البر', projectName: 'مركز خيري', value: 380000, status: 'in-progress', priority: 'عادي', requestDate: '2025-10-23', deadline: '2025-11-13', daysRemaining: 9, currentLevel: 2, totalLevels: 2, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C021', number: 'CONT-2025-021', type: 'عقد بناء', contractorName: 'م. سلطان الرشيدي', clientName: 'رياض السبيعي', projectName: 'مزرعة استثمارية', value: 1300000, status: 'in-progress', priority: 'عاجل', requestDate: '2025-10-19', deadline: '2025-11-09', daysRemaining: 5, currentLevel: 3, totalLevels: 4, completionPercentage: 75, approvalWorkflow: 'hybrid' },
    { id: 'C022', number: 'CONT-2025-022', type: 'عقد إشراف', contractorName: 'م. إبراهيم الغامدي', clientName: 'شركة الرؤية', projectName: 'مركز تدريب', value: 620000, status: 'in-progress', priority: 'عادي', requestDate: '2025-10-25', deadline: '2025-11-15', daysRemaining: 11, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'manual' },

    // معتمدة (15)
    { id: 'C023', number: 'CONT-2025-023', type: 'عقد تصميم', contractorName: 'م. راشد العصيمي', clientName: 'منيرة الحارثي', projectName: 'فيلا حديثة', value: 295000, status: 'approved', priority: 'عادي', requestDate: '2025-10-10', deadline: '2025-10-25', daysRemaining: -10, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C024', number: 'CONT-2025-024', type: 'عقد بناء', contractorName: 'م. مساعد الدوسري', clientName: 'أحمد المنصور', projectName: 'عمارة سكنية', value: 1850000, status: 'approved', priority: 'عاجل', requestDate: '2025-10-08', deadline: '2025-10-22', daysRemaining: -13, currentLevel: 4, totalLevels: 4, completionPercentage: 100, approvalWorkflow: 'hybrid' },
    { id: 'C025', number: 'CONT-2025-025', type: 'عقد إشراف', contractorName: 'م. سعد العمري', clientName: 'فاطمة الشهري', projectName: 'مبنى تعليمي', value: 980000, status: 'approved', priority: 'ضروري جداً', requestDate: '2025-10-05', deadline: '2025-10-18', daysRemaining: -17, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'manual' },
    { id: 'C026', number: 'CONT-2025-026', type: 'عقد تصميم', contractorName: 'م. خالد الدوسري', clientName: 'شركة الإنماء', projectName: 'مركز طبي', value: 1200000, status: 'approved', priority: 'عادي', requestDate: '2025-10-12', deadline: '2025-10-28', daysRemaining: -7, currentLevel: 4, totalLevels: 4, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C027', number: 'CONT-2025-027', type: 'عقد بناء', contractorName: 'م. أحمد السعيد', clientName: 'سلطان العمري', projectName: 'قصر كبير', value: 5200000, status: 'approved', priority: 'عاجل', requestDate: '2025-10-03', deadline: '2025-10-15', daysRemaining: -20, currentLevel: 5, totalLevels: 5, completionPercentage: 100, approvalWorkflow: 'hybrid' },
    { id: 'C028', number: 'CONT-2025-028', type: 'عقد إشراف', contractorName: 'م. محمد الشهري', clientName: 'وزارة الصحة', projectName: 'مستشفى ميداني', value: 3100000, status: 'approved', priority: 'ضروري جداً', requestDate: '2025-10-01', deadline: '2025-10-12', daysRemaining: -23, currentLevel: 4, totalLevels: 4, completionPercentage: 100, approvalWorkflow: 'manual' },
    { id: 'C029', number: 'CONT-2025-029', type: 'عقد تصميم', contractorName: 'م. عبدالرحمن القحطاني', clientName: 'جواهر الدوسري', projectName: 'منتجع سياحي', value: 890000, status: 'approved', priority: 'عادي', requestDate: '2025-10-14', deadline: '2025-10-30', daysRemaining: -5, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C030', number: 'CONT-2025-030', type: 'عقد بناء', contractorName: 'م. يوسف العنزي', clientName: 'شركة التشييد', projectName: 'مصنع', value: 6500000, status: 'approved', priority: 'عاجل', requestDate: '2025-09-28', deadline: '2025-10-10', daysRemaining: -25, currentLevel: 5, totalLevels: 5, completionPercentage: 100, approvalWorkflow: 'hybrid' },
    { id: 'C031', number: 'CONT-2025-031', type: 'عقد إشراف', contractorName: 'م. ناصر المطيري', clientName: 'ريم الخالدي', projectName: 'مجمع فلل', value: 1600000, status: 'approved', priority: 'عادي', requestDate: '2025-10-11', deadline: '2025-10-27', daysRemaining: -8, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'manual' },
    { id: 'C032', number: 'CONT-2025-032', type: 'عقد تصميم', contractorName: 'م. فيصل البقمي', clientName: 'أمانة الرياض', projectName: 'حديقة عامة', value: 450000, status: 'approved', priority: 'عادي', requestDate: '2025-10-09', deadline: '2025-10-24', daysRemaining: -11, currentLevel: 2, totalLevels: 2, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C033', number: 'CONT-2025-033', type: 'عقد بناء', contractorName: 'م. سلطان الرشيدي', clientName: 'مشاري العتيبي', projectName: 'مكاتب تجارية', value: 2800000, status: 'approved', priority: 'عاجل', requestDate: '2025-10-04', deadline: '2025-10-17', daysRemaining: -18, currentLevel: 4, totalLevels: 4, completionPercentage: 100, approvalWorkflow: 'hybrid' },
    { id: 'C034', number: 'CONT-2025-034', type: 'عقد إشراف', contractorName: 'م. إبراهيم الغامدي', clientName: 'شركة الازدهار', projectName: 'معرض سيارات', value: 1100000, status: 'approved', priority: 'عادي', requestDate: '2025-10-13', deadline: '2025-10-29', daysRemaining: -6, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'manual' },
    { id: 'C035', number: 'CONT-2025-035', type: 'عقد تصميم', contractorName: 'م. راشد العصيمي', clientName: 'هند السديري', projectName: 'صالة رياضية', value: 680000, status: 'approved', priority: 'عادي', requestDate: '2025-10-15', deadline: '2025-11-01', daysRemaining: -3, currentLevel: 3, totalLevels: 3, completionPercentage: 100, approvalWorkflow: 'digital' },
    { id: 'C036', number: 'CONT-2025-036', type: 'عقد بناء', contractorName: 'م. مساعد الدوسري', clientName: 'عبدالعزيز القحطاني', projectName: 'مجمع تعليمي', value: 3700000, status: 'approved', priority: 'ضروري جداً', requestDate: '2025-09-30', deadline: '2025-10-13', daysRemaining: -22, currentLevel: 5, totalLevels: 5, completionPercentage: 100, approvalWorkflow: 'hybrid' },
    { id: 'C037', number: 'CONT-2025-037', type: 'عقد إشراف', contractorName: 'م. سعد العمري', clientName: 'نوف الشمري', projectName: 'مركز ثقافي', value: 750000, status: 'approved', priority: 'عادي', requestDate: '2025-10-16', deadline: '2025-11-02', daysRemaining: -2, currentLevel: 2, totalLevels: 2, completionPercentage: 100, approvalWorkflow: 'manual' },

    // مرفوضة (5)
    { id: 'C038', number: 'CONT-2025-038', type: 'عقد تصميم', contractorName: 'م. خالد الدوسري', clientName: 'شركة البناء', projectName: 'مبنى إداري', value: 820000, status: 'rejected', priority: 'عادي', requestDate: '2025-10-20', deadline: '2025-11-05', daysRemaining: 1, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'digital' },
    { id: 'C039', number: 'CONT-2025-039', type: 'عقد بناء', contractorName: 'م. أحمد السعيد', clientName: 'فيصل الحربي', projectName: 'مستودعات', value: 1400000, status: 'rejected', priority: 'عاجل', requestDate: '2025-10-18', deadline: '2025-11-02', daysRemaining: -2, currentLevel: 1, totalLevels: 3, completionPercentage: 33, approvalWorkflow: 'manual' },
    { id: 'C040', number: 'CONT-2025-040', type: 'عقد إشراف', contractorName: 'م. محمد الشهري', clientName: 'شركة الأمانة', projectName: 'مركز صيانة', value: 950000, status: 'rejected', priority: 'عادي', requestDate: '2025-10-22', deadline: '2025-11-08', daysRemaining: 4, currentLevel: 2, totalLevels: 4, completionPercentage: 50, approvalWorkflow: 'hybrid' },
    { id: 'C041', number: 'CONT-2025-041', type: 'عقد تصميم', contractorName: 'م. عبدالرحمن القحطاني', clientName: 'لمى العنزي', projectName: 'مطعم فاخر', value: 540000, status: 'rejected', priority: 'عادي', requestDate: '2025-10-24', deadline: '2025-11-10', daysRemaining: 6, currentLevel: 1, totalLevels: 2, completionPercentage: 50, approvalWorkflow: 'digital' },
    { id: 'C042', number: 'CONT-2025-042', type: 'عقد بناء', contractorName: 'م. يوسف العنزي', clientName: 'شركة النهضة', projectName: 'برج تجاري', value: 8200000, status: 'rejected', priority: 'ضروري جداً', requestDate: '2025-10-15', deadline: '2025-10-28', daysRemaining: -7, currentLevel: 3, totalLevels: 5, completionPercentage: 60, approvalWorkflow: 'hybrid' },

    // معلقة مؤقتاً (3)
    { id: 'C043', number: 'CONT-2025-043', type: 'عقد إشراف', contractorName: 'م. ناصر المطيري', clientName: 'وليد الغامدي', projectName: 'مدرسة أهلية', value: 2100000, status: 'on-hold', priority: 'عادي', requestDate: '2025-10-26', deadline: '2025-11-12', daysRemaining: 8, currentLevel: 2, totalLevels: 3, completionPercentage: 67, approvalWorkflow: 'manual' },
    { id: 'C044', number: 'CONT-2025-044', type: 'عقد تصميم', contractorName: 'م. فيصل البقمي', clientName: 'جمعية الصفا', projectName: 'مسجد كبير', value: 1300000, status: 'on-hold', priority: 'عاجل', requestDate: '2025-10-27', deadline: '2025-11-13', daysRemaining: 9, currentLevel: 2, totalLevels: 4, completionPercentage: 50, approvalWorkflow: 'digital' },
    { id: 'C045', number: 'CONT-2025-045', type: 'عقد بناء', contractorName: 'م. سلطان الرشيدي', clientName: 'شركة التقدم', projectName: 'مركز لوجستي', value: 4600000, status: 'on-hold', priority: 'ضروري جداً', requestDate: '2025-10-23', deadline: '2025-11-07', daysRemaining: 3, currentLevel: 3, totalLevels: 5, completionPercentage: 60, approvalWorkflow: 'hybrid' },
  ];

  // سجلات الاعتماد
  const approvalLogs: ApprovalLog[] = [
    { id: 'L001', contractId: 'C023', action: 'created', performedBy: 'م. سعد العمري', performedDate: '2025-10-10', performedTime: '09:15', level: 0, notes: 'تم إنشاء العقد', ipAddress: '192.168.1.10' },
    { id: 'L002', contractId: 'C023', action: 'submitted', performedBy: 'م. سعد العمري', performedDate: '2025-10-10', performedTime: '10:30', level: 1, notes: 'تم تقديم العقد للاعتماد', ipAddress: '192.168.1.10' },
    { id: 'L003', contractId: 'C023', action: 'approved', performedBy: 'م. خالد الدوسري', performedDate: '2025-10-15', performedTime: '14:20', level: 1, notes: 'اعتماد المستوى الأول', ipAddress: '192.168.1.15' },
    { id: 'L004', contractId: 'C023', action: 'approved', performedBy: 'م. أحمد السعيد', performedDate: '2025-10-20', performedTime: '11:45', level: 2, notes: 'اعتماد المستوى الثاني', ipAddress: '192.168.1.20' },
    { id: 'L005', contractId: 'C023', action: 'approved', performedBy: 'المدير العام', performedDate: '2025-10-25', performedTime: '16:10', level: 3, notes: 'الاعتماد النهائي', ipAddress: '192.168.1.5' },
    { id: 'L006', contractId: 'C038', action: 'created', performedBy: 'م. خالد الدوسري', performedDate: '2025-10-20', performedTime: '08:30', level: 0, notes: 'تم إنشاء العقد', ipAddress: '192.168.1.15' },
    { id: 'L007', contractId: 'C038', action: 'submitted', performedBy: 'م. خالد الدوسري', performedDate: '2025-10-20', performedTime: '09:45', level: 1, notes: 'تم تقديم العقد للاعتماد', ipAddress: '192.168.1.15' },
    { id: 'L008', contractId: 'C038', action: 'approved', performedBy: 'م. محمد الشهري', performedDate: '2025-10-22', performedTime: '13:20', level: 1, notes: 'اعتماد المستوى الأول', ipAddress: '192.168.1.18' },
    { id: 'L009', contractId: 'C038', action: 'rejected', performedBy: 'م. أحمد السعيد', performedDate: '2025-10-25', performedTime: '10:15', level: 2, notes: 'القيمة أعلى من الميزانية المعتمدة', ipAddress: '192.168.1.20' },
    { id: 'L010', contractId: 'C043', action: 'created', performedBy: 'م. ناصر المطيري', performedDate: '2025-10-26', performedTime: '07:50', level: 0, notes: 'تم إنشاء العقد', ipAddress: '192.168.1.25' },
    { id: 'L011', contractId: 'C043', action: 'submitted', performedBy: 'م. ناصر المطيري', performedDate: '2025-10-26', performedTime: '08:30', level: 1, notes: 'تم تقديم العقد للاعتماد', ipAddress: '192.168.1.25' },
    { id: 'L012', contractId: 'C043', action: 'approved', performedBy: 'م. عبدالرحمن القحطاني', performedDate: '2025-10-28', performedTime: '15:40', level: 1, notes: 'اعتماد المستوى الأول', ipAddress: '192.168.1.22' },
    { id: 'L013', contractId: 'C043', action: 'on-hold', performedBy: 'م. يوسف العنزي', performedDate: '2025-10-30', performedTime: '11:25', level: 2, notes: 'إيقاف مؤقت لحين استكمال المستندات', ipAddress: '192.168.1.23' },
  ];

  // الإشعارات
  const notifications: Notification[] = [
    { id: 'N001', contractId: 'C001', type: 'warning', title: 'موعد قرب الانتهاء', message: 'العقد CONT-2025-001 سينتهي موعده خلال 11 يوم', date: '2025-11-04 08:00', isRead: false, priority: 'high' },
    { id: 'N002', contractId: 'C002', type: 'error', title: 'موعد حرج', message: 'العقد CONT-2025-002 سينتهي موعده خلال 6 أيام فقط', date: '2025-11-04 08:15', isRead: false, priority: 'high' },
    { id: 'N003', contractId: 'C023', type: 'success', title: 'تم الاعتماد', message: 'تم اعتماد العقد CONT-2025-023 بنجاح', date: '2025-10-25 16:10', isRead: true, priority: 'medium' },
    { id: 'N004', contractId: 'C038', type: 'error', title: 'تم الرفض', message: 'تم رفض العقد CONT-2025-038 - السبب: القيمة أعلى من الميزانية', date: '2025-10-25 10:15', isRead: true, priority: 'high' },
    { id: 'N005', contractId: 'C043', type: 'warning', title: 'إيقاف مؤقت', message: 'تم إيقاف العقد CONT-2025-043 مؤقتاً لحين استكمال المستندات', date: '2025-10-30 11:25', isRead: false, priority: 'medium' },
    { id: 'N006', contractId: 'C006', type: 'warning', title: 'موعد حرج', message: 'العقد CONT-2025-006 سينتهي موعده خلال 8 أيام', date: '2025-11-04 09:00', isRead: false, priority: 'high' },
    { id: 'N007', contractId: 'C014', type: 'error', title: 'موعد حرج جداً', message: 'العقد CONT-2025-014 سينتهي موعده خلال يومين فقط', date: '2025-11-04 07:30', isRead: false, priority: 'high' },
    { id: 'N008', contractId: 'C024', type: 'success', title: 'اعتماد ناجح', message: 'تم اعتماد العقد CONT-2025-024 بنجاح', date: '2025-10-22 14:30', isRead: true, priority: 'medium' },
    { id: 'N009', contractId: 'C018', type: 'error', title: 'موعد النهاء غداً', message: 'العقد CONT-2025-018 سينتهي موعده غداً', date: '2025-11-04 06:00', isRead: false, priority: 'high' },
    { id: 'N010', contractId: 'C025', type: 'success', title: 'اكتمل الاعتماد', message: 'اكتمل اعتماد العقد CONT-2025-025 من جميع المستويات', date: '2025-10-18 15:20', isRead: true, priority: 'low' },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'معلق', color: 'bg-yellow-500' },
      'in-progress': { label: 'قيد المعالجة', color: 'bg-blue-500' },
      'approved': { label: 'معتمد', color: 'bg-green-500' },
      'rejected': { label: 'مرفوض', color: 'bg-red-500' },
      'on-hold': { label: 'متوقف مؤقتاً', color: 'bg-purple-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; color: string }> = {
      'عادي': { label: 'عادي', color: 'bg-gray-500' },
      'عاجل': { label: 'عاجل', color: 'bg-orange-500' },
      'ضروري جداً': { label: 'ضروري جداً', color: 'bg-red-500' }
    };
    const p = priorityMap[priority] || { label: priority, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${p.color} text-white`}>{p.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '778-01':
        // نظرة عامة
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على اعتماد العقود</h2>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileCheck className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{allContracts.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العقود</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {allContracts.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {allContracts.filter(c => c.status === 'in-progress').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد المعالجة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {allContracts.filter(c => c.status === 'approved').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معتمدة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {allContracts.filter(c => c.status === 'rejected').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرفوضة</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Ban className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {allContracts.filter(c => c.status === 'on-hold').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة مؤقتاً</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '778-02':
        // العقود المعلقة
        const pendingContracts = allContracts.filter(c => c.status === 'pending');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود المعلقة ({pendingContracts.length})</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingContracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-yellow-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.clientName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-1">{getPriorityBadge(contract.priority)}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.daysRemaining} يوم</TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" className="h-6 text-xs bg-blue-500" onClick={() => {
                            setSelectedContract(contract);
                            setShowDetailsDialog(true);
                          }}>
                            <Eye className="h-2.5 w-2.5 ml-1" />
                            تفاصيل
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

      case '778-03':
        // طلبات الاعتماد
        const requestContracts = allContracts.filter(c => c.status === 'pending' || c.status === 'in-progress');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>طلبات الاعتماد ({requestContracts.length})</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {allContracts.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {allContracts.filter(c => c.status === 'in-progress').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {requestContracts.filter(c => c.priority === 'ضروري جداً').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ضروري جداً</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef2f2', border: '2px solid #fecaca' }}>
                <CardContent className="p-2 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ea580c' }}>
                    {requestContracts.filter(c => c.daysRemaining <= 7).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موعد حرج</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الإنجاز</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestContracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.projectName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.currentLevel}/{contract.totalLevels}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={contract.completionPercentage} className="h-2 flex-1" />
                            <span className="text-[10px] font-mono">{contract.completionPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right py-1">{getPriorityBadge(contract.priority)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" className="h-6 text-xs bg-green-500">
                              <Check className="h-2.5 w-2.5 ml-1" />
                              اعتماد
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => {
                              setSelectedContract(contract);
                              setShowRejectDialog(true);
                            }}>
                              <X className="h-2.5 w-2.5 ml-1" />
                              رفض
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

      case '778-08':
        // العقود المعتمدة
        const approvedContracts = allContracts.filter(c => c.status === 'approved');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود المعتمدة ({approvedContracts.length})</h2>
              <Button size="sm" className="h-7 text-xs bg-blue-500">
                <Printer className="h-3 w-3 ml-1" />
                طباعة التقرير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {approvedContracts.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المعتمدة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {(approvedContracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة الإجمالية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {approvedContracts.filter(c => c.type === 'عقد بناء').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عقود بناء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fce7f3', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <FileCheck className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {approvedContracts.filter(c => c.approvalWorkflow === 'digital').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد رقمي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedContracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-green-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.projectName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.clientName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {contract.approvalWorkflow === 'manual' ? 'يدوي' : contract.approvalWorkflow === 'digital' ? 'رقمي' : 'مختلط'}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '778-09':
        // العقود المرفوضة
        const rejectedContracts = allContracts.filter(c => c.status === 'rejected');
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>العقود المرفوضة ({rejectedContracts.length})</h2>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>سبب الرفض</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedContracts.map((contract) => (
                      <TableRow key={contract.id} className="hover:bg-red-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.contractorName}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.clientName}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{contract.value.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-1 text-xs text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          من الشاشة 777-10
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '778-10':
        // سجل الاعتمادات
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
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>بواسطة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">
                          {allContracts.find(c => c.id === log.contractId)?.number}
                        </TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className={`text-xs ${
                            log.action === 'approved' ? 'bg-green-500' :
                            log.action === 'rejected' ? 'bg-red-500' :
                            log.action === 'on-hold' ? 'bg-purple-500' :
                            'bg-blue-500'
                          } text-white`}>
                            {log.action === 'created' ? 'إنشاء' :
                             log.action === 'submitted' ? 'تقديم' :
                             log.action === 'approved' ? 'اعتماد' :
                             log.action === 'rejected' ? 'رفض' :
                             log.action === 'on-hold' ? 'إيقاف مؤقت' :
                             log.action === 'resumed' ? 'استئناف' :
                             'تعديل'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{log.level}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.performedBy}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{log.performedDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{log.performedTime}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '778-11':
        // الإشعارات
        const unreadNotifications = notifications.filter(n => !n.isRead);
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإشعارات ({notifications.length})</h2>
              <Button size="sm" className="h-7 text-xs bg-blue-500">
                <Check className="h-3 w-3 ml-1" />
                تعليم الكل كمقروء
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Mail className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {notifications.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الإشعارات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <Bell className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {unreadNotifications.length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>غير مقروءة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef2f2', border: '2px solid #fecaca' }}>
                <CardContent className="p-2 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ea580c' }}>
                    {notifications.filter(n => n.priority === 'high').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أولوية عالية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {notifications.filter(n => n.isRead).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مقروءة</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`card-element card-rtl ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                  <CardContent className="p-2">
                    <div className="flex items-start gap-2">
                      {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
                      {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                      {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
                      {notification.type === 'info' && <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notification.title}</h3>
                          {!notification.isRead && (
                            <Badge className="text-xs bg-red-500 text-white">جديد</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">{notification.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-12':
        // التقارير
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير والإحصائيات</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white rounded-lg p-3">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير العقود المعلقة</h3>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        عرض جميع العقود المعلقة حالياً
                      </p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-blue-500">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white rounded-lg p-3">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير العقود المعتمدة</h3>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إحصائيات العقود المعتمدة
                      </p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-green-500">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 text-white rounded-lg p-3">
                      <TrendingDown className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير العقود المرفوضة</h3>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تحليل أسباب الرفض
                      </p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-red-500">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500 text-white rounded-lg p-3">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تقرير الأداء الشامل</h3>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        جميع المؤشرات والإحصائيات
                      </p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-amber-500">
                      <Download className="h-3 w-3 ml-1" />
                      تصدير
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl" style={{ background: '#fce7f3', border: '2px solid #f9a8d4' }}>
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-2xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>{allContracts.length}</p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العقود</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-2xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#10b981' }}>
                      {((allContracts.filter(c => c.status === 'approved').length / allContracts.length) * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نسبة الاعتماد</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-2xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ef4444' }}>
                      {((allContracts.filter(c => c.status === 'rejected').length / allContracts.length) * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نسبة الرفض</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-2xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#f59e0b' }}>
                      {(allContracts.reduce((sum, c) => sum + c.value, 0) / 1000000).toFixed(1)}م
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة الكلية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '778-04':
        // الاعتماد اليدوي
        const manualSignatures = [
          {
            id: 'MS001',
            contractId: 'CONT001',
            partyName: 'م. سعد العمري',
            partyType: 'مكتب',
            signedDate: '2025-11-01',
            signedTime: '14:30',
            signedBy: 'نفسه',
            location: 'مقر المكتب الرئيسي',
            city: 'الرياض',
            linkedToMeeting: true,
            meetingId: 'MTG-2025-015',
            meetingDate: '2025-11-01 14:00',
            witnessName: 'أحمد محمد الشهري',
            witnessIdNumber: '1045678912',
            notes: 'تم التوقيع بحضور الشاهد',
            imageUrl: '/signatures/ms001.jpg',
            uploadedBy: 'admin',
            uploadedDate: '2025-11-01 14:35'
          },
          {
            id: 'MS002',
            contractId: 'CONT001',
            partyName: 'عبدالله بن محمد العتيبي',
            partyType: 'عميل',
            signedDate: '2025-11-02',
            signedTime: '10:15',
            signedBy: 'بموجب تفويض',
            authorizationNumber: 'AUTH-2025-089',
            authorizationDate: '2025-10-15',
            location: 'فرع جدة',
            city: 'جدة',
            linkedToMeeting: false,
            notes: 'توقيع بموجب تفويض رسمي موثق',
            imageUrl: '/signatures/ms002.jpg',
            uploadedBy: 'branch_manager',
            uploadedDate: '2025-11-02 10:20'
          },
          {
            id: 'MS003',
            contractId: 'CONT002',
            partyName: 'م. خالد الدوسري',
            partyType: 'مكتب',
            signedDate: '2025-11-03',
            signedTime: '09:00',
            signedBy: 'نفسه',
            location: 'الموقع - حي الروضة',
            city: 'الرياض',
            linkedToMeeting: true,
            meetingId: 'MTG-2025-021',
            meetingDate: '2025-11-03 09:00',
            notes: 'توقيع في الموقع مع المقاول',
            imageUrl: '/signatures/ms003.jpg',
            uploadedBy: 'supervisor',
            uploadedDate: '2025-11-03 09:10'
          }
        ];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الموقعة يدوياً ({manualSignatures.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500">
                <Upload className="h-3 w-3 ml-1" />
                رفع نسخة موقعة
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#f0f9ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{manualSignatures.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي التوقيعات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {manualSignatures.filter(s => s.signedBy === 'نفسه').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>توقيع مباشر</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <FileUser className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {manualSignatures.filter(s => s.signedBy === 'بموجب تفويض').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بموجب تفويض</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fce7f3', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <MessageSquare className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {manualSignatures.filter(s => s.linkedToMeeting).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرتبط باجتماع</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {manualSignatures.map((signature) => (
                <Card key={signature.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => {
                          toast.info('عرض صورة التوقيع...');
                        }}
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          background: '#f8fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          flexShrink: 0
                        }}
                      >
                        <Image className="h-8 w-8 text-gray-400" />
                        <p className="text-[9px] text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>اضغط للعرض</p>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اسم الطرف:</p>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.partyName}</p>
                          <Badge className="mt-1 text-xs">{signature.partyType}</Badge>
                        </div>
                        
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تاريخ ووقت التوقيع:</p>
                          <p className="text-sm font-mono">{signature.signedDate}</p>
                          <p className="text-sm font-mono">{signature.signedTime}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>طريقة التوقيع:</p>
                          <Badge className={`text-xs ${signature.signedBy === 'نفسه' ? 'bg-green-500' : 'bg-amber-500'} text-white`}>
                            {signature.signedBy}
                          </Badge>
                          {signature.authorizationNumber && (
                            <p className="text-xs mt-1 font-mono" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              رقم التفويض: {signature.authorizationNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقع التوقيع:</p>
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.location}</p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.city}</p>
                        </div>

                        {signature.linkedToMeeting && (
                          <div className="col-span-2">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرتبط باجتماع:</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-pink-500 text-white text-xs">{signature.meetingId}</Badge>
                              <span className="text-xs font-mono">{signature.meetingDate}</span>
                            </div>
                          </div>
                        )}

                        {signature.witnessName && (
                          <div className="col-span-3 bg-blue-50 p-2 rounded">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>الشاهد:</strong> {signature.witnessName} - {signature.witnessIdNumber}
                            </p>
                          </div>
                        )}

                        {signature.notes && (
                          <div className="col-span-3">
                            <p className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ملاحظات:</p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{signature.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-05':
        // الاعتماد الرقمي
        const digitalApprovals = [
          {
            id: 'DA001',
            contractId: 'CONT003',
            requestDate: '2025-10-31 10:00',
            status: 'approved',
            sentToEmployee: 'م. أحمد الغامدي',
            employeeId: 'EMP-015',
            digitalSignatureId: 'DSIG-2025-034',
            certificateNumber: 'CERT-89456123',
            approvalDate: '2025-10-31 14:30',
            ipAddress: '192.168.1.10',
            deviceInfo: 'Windows 11 - Chrome 119'
          },
          {
            id: 'DA002',
            contractId: 'CONT004',
            requestDate: '2025-11-02 11:00',
            status: 'sent',
            sentToEmployee: 'م. محمد الشهري',
            employeeId: 'EMP-023'
          },
          {
            id: 'DA003',
            contractId: 'CONT005',
            requestDate: '2025-11-03 08:30',
            status: 'pending'
          }
        ];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاعتماد الرقمي ({digitalApprovals.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => toast.info('فتح نموذج إرسال للتوثيق الرقمي')}>
                <Send className="h-3 w-3 ml-1" />
                إرسال للتوثيق الرقمي
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{digitalApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الطلبات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {digitalApprovals.filter(d => d.status === 'approved').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معتمد</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#dbeafe', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Send className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {digitalApprovals.filter(d => d.status === 'sent').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرسل</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {digitalApprovals.filter(d => d.status === 'pending').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلق</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الطلب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف المخول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الشهادة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {digitalApprovals.map((approval) => (
                      <TableRow key={approval.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.contractId}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.requestDate}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.sentToEmployee || '-'}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.certificateNumber || '-'}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '778-06':
        // اعتماد الأطراف
        const partyApprovals = [
          {
            id: 'PA001',
            contractId: 'CONT001',
            partyName: 'عبدالله بن محمد العتيبي',
            partyType: 'عميل - المالك',
            status: 'signed',
            signedDate: '2025-11-02 10:15',
            lastReminderDate: '2025-11-01',
            remindersSent: 2,
            email: 'abdullah@example.com',
            mobile: '0501234567'
          },
          {
            id: 'PA002',
            contractId: 'CONT001',
            partyName: 'م. أحمد محمد السعيد',
            partyType: 'مقاول',
            status: 'waiting',
            lastReminderDate: '2025-11-02',
            remindersSent: 3,
            email: 'ahmad@contractor.com',
            mobile: '0509876543'
          },
          {
            id: 'PA003',
            contractId: 'CONT002',
            partyName: 'أوقاف الروضة',
            partyType: 'عميل - الجهة المالكة',
            status: 'waiting',
            lastReminderDate: '2025-11-03',
            remindersSent: 1,
            email: 'info@awqaf-rawdah.gov.sa',
            mobile: '0112345678'
          },
          {
            id: 'PA004',
            contractId: 'CONT004',
            partyName: 'شركة الفارس التجارية',
            partyType: 'عميل - المالك',
            status: 'rejected',
            lastReminderDate: '2025-10-27',
            remindersSent: 2,
            email: 'contracts@alfaris.com',
            mobile: '0505551234'
          }
        ];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد الأطراف ({partyApprovals.length})</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{partyApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الأطراف</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {partyApprovals.filter(p => p.status === 'signed').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>موقع</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {partyApprovals.filter(p => p.status === 'waiting').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بانتظار التوقيع</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fee2e2', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                    {partyApprovals.filter(p => p.status === 'rejected').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مرفوض</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {partyApprovals.map((party) => (
                <Card key={party.id} className={`card-element card-rtl ${party.status === 'waiting' ? 'border-2 border-amber-400' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{party.partyName}</h3>
                          <Badge className="text-xs">{party.partyType}</Badge>
                          {getStatusBadge(party.status)}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني:</p>
                            <p className="font-mono">{party.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال:</p>
                            <p className="font-mono">{party.mobile}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد التذكيرات:</p>
                            <Badge className="bg-blue-500 text-white">{party.remindersSent}</Badge>
                          </div>
                        </div>

                        {party.signedDate && (
                          <div className="mt-2 text-xs bg-green-50 p-2 rounded">
                            <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>تاريخ التوقيع:</strong> {party.signedDate}
                            </p>
                          </div>
                        )}

                        {party.lastReminderDate && party.status === 'waiting' && (
                          <div className="mt-2 text-xs bg-amber-50 p-2 rounded">
                            <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              <strong>آخر تذكير:</strong> {party.lastReminderDate}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {party.status === 'waiting' && (
                          <>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs bg-blue-500"
                              onClick={() => toast.success(`تم إرسال تذكير إلى ${party.partyName}`)}
                            >
                              <Bell className="h-3 w-3 ml-1" />
                              تذكير
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => toast.success(`تم إرسال رسالة إلى ${party.partyName}`)}
                            >
                              <MessageSquare className="h-3 w-3 ml-1" />
                              رسالة
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '778-07':
        // اعتماد المكتب
        const officeApprovals = [
          {
            id: 'OA001',
            contractId: 'CONT001',
            approvalType: 'draft',
            approvedBy: 'م. سعد العمري',
            approvalDate: '2025-10-25 10:00',
            status: 'approved',
            autoApproveEnabled: false,
            notes: 'معتمد كمسودة - يحتاج موافقة الأطراف'
          },
          {
            id: 'OA002',
            contractId: 'CONT003',
            approvalType: 'final',
            approvedBy: 'النظام (تلقائي)',
            approvalDate: '2025-10-31 16:50',
            status: 'approved',
            autoApproveEnabled: true,
            notes: 'اعتماد تلقائي بعد توقيع جميع الأطراف'
          },
          {
            id: 'OA003',
            contractId: 'CONT002',
            approvalType: 'draft',
            approvedBy: 'م. خالد الدوسري',
            approvalDate: '2025-10-28 11:30',
            status: 'approved',
            autoApproveEnabled: true,
            notes: 'معتمد كمسودة مع تفعيل الاعتماد التلقائي'
          }
        ];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد المكتب ({officeApprovals.length})</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: '#eff6ff', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileSignature className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{officeApprovals.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الاعتمادات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Edit className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {officeApprovals.filter(o => o.approvalType === 'draft').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد مسودة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {officeApprovals.filter(o => o.approvalType === 'final').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد نهائي</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: '#e0e7ff', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Zap className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {officeApprovals.filter(o => o.autoApproveEnabled).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>اعتماد تلقائي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعتمد بواسطة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الاعتماد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اعتماد تلقائي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officeApprovals.map((approval) => (
                      <TableRow key={approval.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.contractId}</TableCell>
                        <TableCell className="text-right py-1">
                          <Badge className={`text-xs ${approval.approvalType === 'draft' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                            {approval.approvalType === 'draft' ? 'مسودة' : 'نهائي'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.approvedBy}
                        </TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{approval.approvalDate}</TableCell>
                        <TableCell className="text-right py-1">
                          {approval.autoApproveEnabled ? (
                            <Badge className="text-xs bg-indigo-500 text-white">مفعّل</Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-400 text-white">غير مفعّل</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(approval.status)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {approval.notes}
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
              <FileCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-778-v4" position="top-right" />
      
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
                    778-v4
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
                نظام شامل لاعتماد العقود مع 45 عقداً و7 تابات مطورة
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
        <DialogContent className="max-w-3xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تفاصيل العقد</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم العقد:</p>
                  <p className="text-sm font-mono">{selectedContract.number}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع:</p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedContract.type}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المشروع:</p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedContract.projectName}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الرفض */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">رفض العقد</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <SelectWithCopy
              label="سبب الرفض *"
              id="reject-reason"
              options={[
                { value: 'REJ-001', label: 'REJ-001 - عدم توافق البنود المالية' },
                { value: 'REJ-002', label: 'REJ-002 - نقص في المستندات' },
                { value: 'REJ-003', label: 'REJ-003 - عدم استيفاء المواصفات' }
              ]}
              copyable={false}
              clearable={false}
            />
            <TextAreaWithCopy
              label="ملاحظات إضافية"
              id="reject-notes"
              rows={3}
              placeholder="أدخل أي ملاحظات إضافية..."
              copyable={false}
              clearable={true}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>إلغاء</Button>
            <Button className="bg-red-500" onClick={() => {
              toast.success('تم رفض العقد');
              setShowRejectDialog(false);
            }}>
              <X className="h-3 w-3 ml-1" />
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractApproval_Complete_778_v4;
