/**
 * الشاشة 943 - شركاء ملكية المكتب
 * ===========================================================================
 * 
 * شاشة سرية للغاية - صلاحيات الملاك فقط
 * نظام إدارة شامل للشراكة والملكية
 * 
 * المميزات الجديدة v2.0:
 * - نظام صلاحيات تفصيلي متقدم
 * - سجل المساهمات الرأسمالية (نقدي/عيني)
 * - تتبع القرارات والموافقات
 * - سجل التوزيعات المالية
 * - إدارة العقود والاتفاقيات
 * - 15 تاباً شاملاً
 * 
 * 🔒 HIGHLY CONFIDENTIAL - OWNERS ONLY
 * 
 * @version 2.0
 * @date 2025-10-20
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  Shield, Users, TrendingUp, DollarSign, Building2, Globe,
  FileCheck, Award, Lock, Eye, EyeOff, Plus, Edit, Save,
  AlertTriangle, CheckCircle, Settings, BarChart3, Calendar,
  Briefcase, UserCheck, PieChart, Wallet, CreditCard, Receipt,
  FileText, Crown, Star, Target, Activity, History, Vote,
  Gavel, HandshakeIcon, Coins, TrendingDown, ArrowUpRight,
  ArrowDownRight, ClipboardList, UserCog, AlertCircle, FileSignature,
  Clock, XCircle
} from 'lucide-react';

// ===== واجهات البيانات =====

interface Partner {
  id: string;
  partnerNumber: string;
  name: string;
  nationality: string;
  nationalId: string;
  ownershipPercent: number;
  profitSharePercent: number;
  lossSharePercent: number;
  capitalContribution: number;
  role: string;
  joinDate: string;
  isActive: boolean;
  hasVotingRight: boolean;
  hasManagementRight: boolean;
  votingWeight: number;
  email: string;
  phone: string;
  address: string;
}

interface CapitalContribution {
  id: string;
  partnerId: string;
  partnerName: string;
  date: string;
  type: 'نقدي' | 'عيني';
  amount: number;
  description: string;
  method: string;
  reason: string;
  assetDetails?: string;
  documentNumber: string;
  status: 'مكتمل' | 'قيد المعالجة' | 'ملغي';
}

interface Decision {
  id: string;
  decisionNumber: string;
  date: string;
  title: string;
  description: string;
  type: 'إداري' | 'مالي' | 'استثماري' | 'استراتيجي';
  requiresVoting: boolean;
  votesRequired: number;
  votesFor: number;
  votesAgainst: number;
  status: 'معتمد' | 'مرفوض' | 'قيد التصويت' | 'مؤجل';
  votingDeadline?: string;
}

interface ProfitDistribution {
  id: string;
  distributionNumber: string;
  date: string;
  period: string;
  totalProfit: number;
  totalDistributed: number;
  retained: number;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مجدول';
}

interface Permission {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  requiresApproval: boolean;
  approvalType: 'فردي' | 'ثنائي' | 'جماعي';
}

const OfficePartnersOwnershipScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('943-01');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showContributionDialog, setShowContributionDialog] = useState(false);

  const TABS_CONFIG = [
    { id: '943-01', number: '943-01', title: 'نظرة عامة', icon: PieChart },
    { id: '943-02', number: '943-02', title: 'الشركاء المحليون', icon: Users },
    { id: '943-03', number: '943-03', title: 'هيكل الملكية', icon: Building2 },
    { id: '943-04', number: '943-04', title: 'المساهمات الرأسمالية', icon: Coins },
    { id: '943-05', number: '943-05', title: 'توزيع الأرباح', icon: DollarSign },
    { id: '943-06', number: '943-06', title: 'الصلاحيات والقرارات', icon: Shield },
    { id: '943-07', number: '943-07', title: 'نظام التصويت', icon: Vote },
    { id: '943-08', number: '943-08', title: 'الشركة الأم الأجنبية', icon: Globe },
    { id: '943-09', number: '943-09', title: 'العقود والاتفاقيات', icon: FileCheck },
    { id: '943-10', number: '943-10', title: 'التراخيص والاعتمادات', icon: Award },
    { id: '943-11', number: '943-11', title: 'التكاليف الدورية', icon: Receipt },
    { id: '943-12', number: '943-12', title: 'المعاملات المالية', icon: Wallet },
    { id: '943-13', number: '943-13', title: 'سجل القرارات', icon: ClipboardList },
    { id: '943-14', number: '943-14', title: 'الاجتماعات والمحاضر', icon: Briefcase },
    { id: '943-15', number: '943-15', title: 'الإعدادات والأمان', icon: Settings },
  ];

  // بيانات الشركاء
  const partners: Partner[] = useMemo(() => [
    {
      id: 'P001',
      partnerNumber: 'PTR-001',
      name: 'المهندس عبدالله بن محمد السعيد',
      nationality: 'السعودية',
      nationalId: '1045678912',
      ownershipPercent: 40,
      profitSharePercent: 40,
      lossSharePercent: 40,
      capitalContribution: 2000000,
      role: 'الشريك المؤسس - الرئيس التنفيذي',
      joinDate: '2020-01-15',
      isActive: true,
      hasVotingRight: true,
      hasManagementRight: true,
      votingWeight: 2,
      email: 'abdullah.alsaeed@office.com',
      phone: '+966501234567',
      address: 'الرياض - حي الملقا',
    },
    {
      id: 'P002',
      partnerNumber: 'PTR-002',
      name: 'المهندس خالد بن سعد العتيبي',
      nationality: 'السعودية',
      nationalId: '1087654321',
      ownershipPercent: 30,
      profitSharePercent: 30,
      lossSharePercent: 30,
      capitalContribution: 1500000,
      role: 'شريك مؤسس - المدير الفني',
      joinDate: '2020-01-15',
      isActive: true,
      hasVotingRight: true,
      hasManagementRight: true,
      votingWeight: 2,
      email: 'khaled.alotaibi@office.com',
      phone: '+966502345678',
      address: 'الرياض - حي الياسمين',
    },
    {
      id: 'P003',
      partnerNumber: 'PTR-003',
      name: 'شركة الهندسة العالمية المحدودة',
      nationality: 'الولايات المتحدة',
      nationalId: 'US-REG-8745698',
      ownershipPercent: 25,
      profitSharePercent: 25,
      lossSharePercent: 25,
      capitalContribution: 1250000,
      role: 'شريك استراتيجي - الشركة الأم',
      joinDate: '2021-06-01',
      isActive: true,
      hasVotingRight: true,
      hasManagementRight: false,
      votingWeight: 1,
      email: 'contact@globaleng.com',
      phone: '+1-555-0123456',
      address: 'New York, USA',
    },
    {
      id: 'P004',
      partnerNumber: 'PTR-004',
      name: 'المهندسة فاطمة بنت أحمد الدوسري',
      nationality: 'السعودية',
      nationalId: '1098765432',
      ownershipPercent: 5,
      profitSharePercent: 5,
      lossSharePercent: 5,
      capitalContribution: 250000,
      role: 'شريك - مستشار قانوني',
      joinDate: '2022-03-20',
      isActive: true,
      hasVotingRight: false,
      hasManagementRight: false,
      votingWeight: 0,
      email: 'fatimah.aldosari@office.com',
      phone: '+966503456789',
      address: 'الرياض - حي النخيل',
    },
  ], []);

  // سجل المساهمات الرأسمالية
  const capitalContributions: CapitalContribution[] = useMemo(() => [
    // مساهمات الشريك الأول
    {
      id: 'CC001',
      partnerId: 'P001',
      partnerName: 'عبدالله السعيد',
      date: '2020-01-15',
      type: 'نقدي',
      amount: 1500000,
      description: 'المساهمة الأولية عند التأسيس',
      method: 'تحويل بنكي',
      reason: 'تأسيس الشركة',
      documentNumber: 'TRN-2020-001',
      status: 'مكتمل',
    },
    {
      id: 'CC002',
      partnerId: 'P001',
      partnerName: 'عبدالله السعيد',
      date: '2021-03-10',
      type: 'عيني',
      amount: 500000,
      description: 'مكتب إداري ومعدات هندسية',
      method: 'تقييم عيني',
      reason: 'زيادة رأس المال',
      assetDetails: 'مكتب 200م² + 5 أجهزة كمبيوتر + طابعات هندسية',
      documentNumber: 'AST-2021-015',
      status: 'مكتمل',
    },

    // مساهمات الشريك الثاني
    {
      id: 'CC003',
      partnerId: 'P002',
      partnerName: 'خالد العتيبي',
      date: '2020-01-15',
      type: 'نقدي',
      amount: 1200000,
      description: 'المساهمة الأولية عند التأسيس',
      method: 'شيك بنكي',
      reason: 'تأسيس الشركة',
      documentNumber: 'CHK-2020-0125',
      status: 'مكتمل',
    },
    {
      id: 'CC004',
      partnerId: 'P002',
      partnerName: 'خالد العتيبي',
      date: '2020-08-22',
      type: 'عيني',
      amount: 300000,
      description: 'برامج هندسية وتراخيص',
      method: 'تقييم عيني',
      reason: 'زيادة رأس المال',
      assetDetails: 'تراخيص AutoCAD، Revit، SAP2000 + برامج مساحية',
      documentNumber: 'AST-2020-088',
      status: 'مكتمل',
    },

    // مساهمات الشركة الأجنبية
    {
      id: 'CC005',
      partnerId: 'P003',
      partnerName: 'Global Engineering',
      date: '2021-06-01',
      type: 'نقدي',
      amount: 1250000,
      description: 'استثمار استراتيجي',
      method: 'تحويل دولي',
      reason: 'دخول شريك استراتيجي',
      documentNumber: 'SWIFT-2021-6854',
      status: 'مكتمل',
    },

    // مساهمات الشريك الرابع
    {
      id: 'CC006',
      partnerId: 'P004',
      partnerName: 'فاطمة الدوسري',
      date: '2022-03-20',
      type: 'نقدي',
      amount: 250000,
      description: 'مساهمة نقدية',
      method: 'تحويل بنكي',
      reason: 'دخول كشريك استشاري',
      documentNumber: 'TRN-2022-0320',
      status: 'مكتمل',
    },
  ], []);

  // القرارات
  const decisions: Decision[] = useMemo(() => [
    {
      id: 'DEC001',
      decisionNumber: 'DEC-2024-001',
      date: '2024-01-15',
      title: 'الموافقة على الموازنة السنوية 2024',
      description: 'الموافقة على موازنة بقيمة 15 مليون ريال للعام 2024',
      type: 'مالي',
      requiresVoting: true,
      votesRequired: 2,
      votesFor: 3,
      votesAgainst: 0,
      status: 'معتمد',
    },
    {
      id: 'DEC002',
      decisionNumber: 'DEC-2024-002',
      date: '2024-03-10',
      title: 'فتح فرع جديد في جدة',
      description: 'الموافقة على فتح فرع جديد في مدينة جدة بتكلفة متوقعة 2 مليون ريال',
      type: 'استراتيجي',
      requiresVoting: true,
      votesRequired: 3,
      votesFor: 2,
      votesAgainst: 1,
      status: 'مؤجل',
    },
    {
      id: 'DEC003',
      decisionNumber: 'DEC-2024-003',
      date: '2024-05-20',
      title: 'تعيين مدير مالي جديد',
      description: 'تعيين المهندس أحمد الغامدي كمدير مالي براتب شهري 25,000 ريال',
      type: 'إداري',
      requiresVoting: true,
      votesRequired: 2,
      votesFor: 3,
      votesAgainst: 0,
      status: 'معتمد',
    },
    {
      id: 'DEC004',
      decisionNumber: 'DEC-2024-004',
      date: '2024-10-01',
      title: 'الاستثمار في نظام BIM متقدم',
      description: 'شراء نظام BIM متكامل بتكلفة 500,000 ريال',
      type: 'استثماري',
      requiresVoting: true,
      votesRequired: 2,
      votesFor: 2,
      votesAgainst: 0,
      status: 'قيد التصويت',
      votingDeadline: '2024-10-25',
    },
  ], []);

  // توزيعات الأرباح
  const profitDistributions: ProfitDistribution[] = useMemo(() => [
    {
      id: 'PD001',
      distributionNumber: 'DIST-2023-Q4',
      date: '2024-01-31',
      period: 'الربع الرابع 2023',
      totalProfit: 2100000,
      totalDistributed: 1680000,
      retained: 420000,
      status: 'مكتمل',
    },
    {
      id: 'PD002',
      distributionNumber: 'DIST-2024-Q1',
      date: '2024-04-30',
      period: 'الربع الأول 2024',
      totalProfit: 2400000,
      totalDistributed: 1920000,
      retained: 480000,
      status: 'مكتمل',
    },
    {
      id: 'PD003',
      distributionNumber: 'DIST-2024-Q2',
      date: '2024-07-31',
      period: 'الربع الثاني 2024',
      totalProfit: 2800000,
      totalDistributed: 2240000,
      retained: 560000,
      status: 'مكتمل',
    },
    {
      id: 'PD004',
      distributionNumber: 'DIST-2024-Q3',
      date: '2024-10-31',
      period: 'الربع الثالث 2024',
      totalProfit: 3200000,
      totalDistributed: 2560000,
      retained: 640000,
      status: 'قيد التنفيذ',
    },
  ], []);

  // الصلاحيات
  const permissions: Permission[] = useMemo(() => [
    {
      id: 'PERM001',
      code: 'FIN-001',
      name: 'الموافقة على المصروفات الرأسمالية',
      category: 'مالية',
      description: 'الموافقة على المصروفات التي تتجاوز 100,000 ريال',
      requiresApproval: true,
      approvalType: 'ثنائي',
    },
    {
      id: 'PERM002',
      code: 'FIN-002',
      name: 'توقيع العقود',
      category: 'مالية',
      description: 'توقيع العقود التي تتجاوز قيمتها 500,000 ريال',
      requiresApproval: true,
      approvalType: 'جماعي',
    },
    {
      id: 'PERM003',
      code: 'HR-001',
      name: 'تعيين موظفين برواتب عليا',
      category: 'موارد بشرية',
      description: 'تعيين موظفين برواتب تتجاوز 20,000 ريال شهرياً',
      requiresApproval: true,
      approvalType: 'ثنائي',
    },
    {
      id: 'PERM004',
      code: 'STR-001',
      name: 'القرارات الاستراتيجية',
      category: 'استراتيجية',
      description: 'اتخاذ قرارات استراتيجية مثل فتح فروع جديدة',
      requiresApproval: true,
      approvalType: 'جماعي',
    },
    {
      id: 'PERM005',
      code: 'INV-001',
      name: 'الاستثمارات',
      category: 'استثمارية',
      description: 'الموافقة على الاستثمارات الجديدة',
      requiresApproval: true,
      approvalType: 'جماعي',
    },
    {
      id: 'PERM006',
      code: 'ADM-001',
      name: 'القرارات الإدارية اليومية',
      category: 'إدارية',
      description: 'القرارات الإدارية الروتينية',
      requiresApproval: false,
      approvalType: 'فردي',
    },
  ], []);

  const renderTabContent = () => {
    // تاب 943-01: نظرة عامة
    if (activeTab === '943-01') {
      const totalCapital = partners.reduce((sum, p) => sum + p.capitalContribution, 0);
      const activePartners = partners.filter(p => p.isActive).length;
      const votingPartners = partners.filter(p => p.hasVotingRight).length;
      const totalDistributed = profitDistributions.reduce((sum, d) => sum + d.totalDistributed, 0);
      const totalRetained = profitDistributions.reduce((sum, d) => sum + d.retained, 0);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                نظرة عامة على الشراكة
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                معلومات محمية - للملاك فقط
              </p>
            </div>
            <Badge className="bg-red-600 text-white">
              <Lock className="h-3 w-3 ml-1" />
              سري للغاية
            </Badge>
          </div>

          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      رأس المال
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCapital / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الشركاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {partners.length}
                    </p>
                  </div>
                  <Users className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نشطون
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {activePartners}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      حق تصويت
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {votingPartners}
                    </p>
                  </div>
                  <Vote className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الأرباح 2024
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalDistributed / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      ROI السنوي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalDistributed / totalCapital) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Activity className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الأرباح المحتجزة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalRetained / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <Wallet className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      القرارات المعلقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {decisions.filter(d => d.status === 'قيد التصويت').length}
                    </p>
                  </div>
                  <AlertCircle className="stats-icon-compact text-red-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  توزيع الملكية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {partners.map((partner) => (
                    <div key={partner.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {partner.name}
                        </span>
                        <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                          {partner.ownershipPercent}%
                        </span>
                      </div>
                      <Progress value={partner.ownershipPercent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المساهمات الرأسمالية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {partner.name.split(' ')[partner.name.split(' ').length - 1]}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {(partner.capitalContribution / 1000000).toFixed(2)}M
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 943-02: الشركاء المحليون
    if (activeTab === '943-02') {
      const localPartners = partners.filter(p => p.nationality === 'السعودية');

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الشركاء المحليون السعوديون
            </h3>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              إضافة شريك
            </Button>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهوية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملكية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأرباح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساهمة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {partner.partnerNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {partner.name}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {partner.nationalId}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {partner.ownershipPercent}%
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {partner.profitSharePercent}%
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {(partner.capitalContribution / 1000000).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {partner.hasVotingRight && (
                            <Badge className="bg-blue-100 text-blue-700 text-[10px]">تصويت×{partner.votingWeight}</Badge>
                          )}
                          {partner.hasManagementRight && (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">إدارة</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="dense-button"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
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
    }

    // تاب 943-04: المساهمات الرأسمالية
    if (activeTab === '943-04') {
      const cashContributions = capitalContributions.filter(c => c.type === 'نقدي');
      const inkindContributions = capitalContributions.filter(c => c.type === 'عيني');
      const totalCash = cashContributions.reduce((sum, c) => sum + c.amount, 0);
      const totalInkind = inkindContributions.reduce((sum, c) => sum + c.amount, 0);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل المساهمات الرأسمالية
            </h3>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              onClick={() => setShowContributionDialog(true)}
            >
              <Plus className="h-3.5 w-3.5 ml-2" />
              مساهمة جديدة
            </Button>
          </div>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي المساهمات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {capitalContributions.length}
                    </p>
                  </div>
                  <Coins className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نقدي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCash / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <DollarSign className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      عيني
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalInkind / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <Building2 className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة النقدي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalCash / (totalCash + totalInkind)) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <PieChart className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة العيني
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalInkind / (totalCash + totalInkind)) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Award className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مكتملة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {capitalContributions.filter(c => c.status === 'مكتمل').length}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشريك</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capitalContributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contribution.date}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {contribution.partnerName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={contribution.type === 'نقدي' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                          {contribution.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contribution.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {contribution.method}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {contribution.reason}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {contribution.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          contribution.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          contribution.status === 'قيد المعالجة' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {contribution.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // تاب 943-05: توزيع الأرباح
    if (activeTab === '943-05') {
      const totalProfit = profitDistributions.reduce((sum, d) => sum + d.totalProfit, 0);
      const totalDistributed = profitDistributions.reduce((sum, d) => sum + d.totalDistributed, 0);
      const totalRetained = profitDistributions.reduce((sum, d) => sum + d.retained, 0);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              توزيع الأرباح
            </h3>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              توزيع جديد
            </Button>
          </div>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الأرباح
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalProfit / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تم توزيعه
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalDistributed / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <ArrowUpRight className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      المحتجز
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalRetained / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <Wallet className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة التوزيع
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalDistributed / totalProfit) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <PieChart className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      عدد التوزيعات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {profitDistributions.length}
                    </p>
                  </div>
                  <History className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط التوزيع
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalDistributed / profitDistributions.length) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم التوزيع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الربح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تم توزيعه</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحتجز</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitDistributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {dist.distributionNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {dist.date}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {dist.period}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {dist.totalProfit.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {dist.totalDistributed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {dist.retained.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          dist.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          dist.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {dist.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* تفصيل التوزيع على الشركاء */}
          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفصيل التوزيع على الشركاء (آخر توزيع)
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشريك</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الأرباح</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ المستحق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => {
                    const lastDist = profitDistributions[profitDistributions.length - 1];
                    const partnerShare = lastDist ? (lastDist.totalDistributed * partner.profitSharePercent / 100) : 0;
                    
                    return (
                      <TableRow key={partner.id}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {partner.name}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {partner.profitSharePercent}%
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {partnerShare.toLocaleString()} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-700">
                            تم التحويل
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // تاب 943-06: الصلاحيات والقرارات
    if (activeTab === '943-06') {
      const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
      }, {} as Record<string, Permission[]>);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نظام الصلاحيات والقرارات
            </h3>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              صلاحية جديدة
            </Button>
          </div>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الصلاحيات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.length}
                    </p>
                  </div>
                  <Shield className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      فردية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.filter(p => p.approvalType === 'فردي').length}
                    </p>
                  </div>
                  <UserCog className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      ثنائية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.filter(p => p.approvalType === 'ثنائي').length}
                    </p>
                  </div>
                  <Users className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      جماعية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.filter(p => p.approvalType === 'جماعي').length}
                    </p>
                  </div>
                  <HandshakeIcon className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مالية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.filter(p => p.category === 'مالية').length}
                    </p>
                  </div>
                  <DollarSign className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      استراتيجية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {permissions.filter(p => p.category === 'استراتيجية').length}
                    </p>
                  </div>
                  <Target className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <Card key={category} className="card-rtl">
                <CardHeader className="card-header-dense">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    صلاحيات {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="space-y-2">
                    {perms.map((perm) => (
                      <div key={perm.id} className="p-2 bg-gray-50 rounded">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                                {perm.code}
                              </Badge>
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                {perm.name}
                              </span>
                            </div>
                            <p className="text-xs mr-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              {perm.description}
                            </p>
                          </div>
                          <Badge className={
                            perm.approvalType === 'فردي' ? 'bg-green-100 text-green-700' :
                            perm.approvalType === 'ثنائي' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {perm.approvalType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // تاب 943-07: نظام التصويت
    if (activeTab === '943-07') {
      const votingPartners = partners.filter(p => p.hasVotingRight);
      const totalVotingWeight = votingPartners.reduce((sum, p) => sum + p.votingWeight, 0);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نظام التصويت
            </h3>
          </div>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الأصوات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalVotingWeight}
                    </p>
                  </div>
                  <Vote className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      أصحاب تصويت
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {votingPartners.length}
                    </p>
                  </div>
                  <UserCheck className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      قيد التصويت
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {decisions.filter(d => d.status === 'قيد التصويت').length}
                    </p>
                  </div>
                  <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      معتمدة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {decisions.filter(d => d.status === 'معتمد').length}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مرفوضة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {decisions.filter(d => d.status === 'مرفوض').length}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مؤجلة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {decisions.filter(d => d.status === 'مؤجل').length}
                    </p>
                  </div>
                  <Calendar className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  توزيع الأصوات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشريك</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>وزن الصوت</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votingPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {partner.name}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {partner.votingWeight}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                              {((partner.votingWeight / totalVotingWeight) * 100).toFixed(1)}%
                            </span>
                            <Progress value={(partner.votingWeight / totalVotingWeight) * 100} className="h-2 w-16" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قواعد التصويت
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      القرارات المالية
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تتطلب موافقة أصحاب 75% من الأصوات
                    </p>
                  </div>

                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      القرارات الاستراتيجية
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تتطلب إجماع جميع الشركاء المؤسسين
                    </p>
                  </div>

                  <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      القرارات الإدارية
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تتطلب موافقة أغلبية بسيطة (50%+1)
                    </p>
                  </div>

                  <div className="p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      القرارات الاستثمارية
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تتطلب موافقة 66% من الأصوات
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 943-08: الشركة الأم الأجنبية
    if (activeTab === '943-08') {
      const foreignPartner = partners.find(p => p.nationality !== 'السعودية');

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الشركة الأم الأجنبية
            </h3>
            <Badge className="bg-blue-600 text-white">
              <Globe className="h-3 w-3 ml-1" />
              USA
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 card-rtl">
            <CardContent className="p-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    اسم الشركة
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    Global Engineering Corp.
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الدولة
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    الولايات المتحدة الأمريكية
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    نسبة الملكية
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {foreignPartner?.ownershipPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    تاريخ الشراكة
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {foreignPartner?.joinDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التراخيص والاعتمادات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ترخيص وزارة الاستثمار
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        رقم: FI-2021-5847
                      </p>
                    </div>
                    <Badge className="bg-green-600 text-white">ساري</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ترخيص هيئة المهندسين
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        رقم: SCE-2021-9234
                      </p>
                    </div>
                    <Badge className="bg-green-600 text-white">ساري</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اعتماد الغرفة التجارية
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        التجديد: 2025-12-31
                      </p>
                    </div>
                    <Badge className="bg-yellow-600 text-white">يجدد قريباً</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التكاليف الدورية السنوية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رسوم ترخيص سنوية
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        50,000 ريال
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رسوم استشارية
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        120,000 ريال
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        دعم فني
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        80,000 ريال
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الإجمالي السنوي
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        250,000 ريال
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 943-13: سجل القرارات
    if (activeTab === '943-13') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل القرارات
            </h3>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              قرار جديد
            </Button>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم القرار</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصويت</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decisions.map((decision) => (
                    <TableRow key={decision.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {decision.decisionNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {decision.date}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {decision.title}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-blue-100 text-blue-700">
                          {decision.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                        {decision.votesFor}/{decision.votesAgainst}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          decision.status === 'معتمد' ? 'bg-green-100 text-green-700' :
                          decision.status === 'مرفوض' ? 'bg-red-100 text-red-700' :
                          decision.status === 'قيد التصويت' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {decision.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // تاب 943-15: الإعدادات والأمان
    if (activeTab === '943-15') {
      return (
        <div className="space-y-2">
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الإعدادات والأمان
          </h3>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات الخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تشفير البيانات المالية
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تشفير AES-256
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مصادقة ثنائية
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        للوصول إلى بيانات الشراكة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        سجل الأنشطة
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تتبع جميع العمليات
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات التنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تنبيهات القرارات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إشعار عند قرار جديد
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تنبيهات التوزيعات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إشعار عند توزيع أرباح
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تنبيهات المساهمات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إشعار عند مساهمة جديدة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 943-14: الاجتماعات والمحاضر - نظام شامل ومفصل
    if (activeTab === '943-14') {
      // بيانات الاجتماعات الشاملة
      interface Meeting {
        id: string;
        number: string;
        title: string;
        date: string;
        time: string;
        type: 'عادي' | 'طارئ' | 'استثنائي' | 'سنوي';
        status: 'مجدول' | 'منعقد' | 'ملغي' | 'مؤجل';
        groupBy: {
          subject: string;
          transaction?: string;
          client?: string;
        };
        location: string;
        calledBy: {
          name: string;
          role: string;
        };
        attendees: Array<{
          name: string;
          role: string;
          type: 'شريك' | 'موظف' | 'ضيف';
          attended: boolean;
        }>;
        agenda: string[];
        reason: string;
        outputs: Array<{
          id: string;
          description: string;
          assignedTo: string;
          deadline: string;
          status: 'معلق' | 'جاري' | 'مكتمل' | 'متأخر';
          completionPercent: number;
        }>;
        minutes?: string;
        attachments?: string[];
      }

      const meetings: Meeting[] = [
        // مجموعة الاجتماعات المالية
        {
          id: 'MTG001',
          number: 'MTG-2024-001',
          title: 'اجتماع توزيع الأرباح السنوي',
          date: '2024-12-15',
          time: '10:00',
          type: 'سنوي',
          status: 'منعقد',
          groupBy: {
            subject: 'الأمور المالية',
          },
          location: 'قاعة الاجتماعات الرئيسية',
          calledBy: {
            name: 'المهندس عبدالله السعيد',
            role: 'الرئيس التنفيذي'
          },
          attendees: [
            { name: 'عبدالله السعيد', role: 'الرئيس التنفيذي', type: 'شريك', attended: true },
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'فاطمة الدوسري', role: 'مستشار قانوني', type: 'شريك', attended: true },
            { name: 'محمد الغامدي', role: 'المدير المالي', type: 'موظف', attended: true },
            { name: 'مراجع خارجي', role: 'مدقق حسابات', type: 'ضيف', attended: true },
          ],
          agenda: [
            'مراجعة الأداء المالي للسنة المالية 2024',
            'الموافقة على توزيع الأرباح',
            'تحديد نسب الاحتفاظ بالأرباح',
            'مناقشة الموازنة التقديرية 2025',
          ],
          reason: 'اجتماع سنوي إلزامي حسب نظام الشركة لتوزيع الأرباح واعتماد الموازنة',
          outputs: [
            {
              id: 'OUT001',
              description: 'إصدار قرار توزيع الأرباح بواقع 2.5 مليون ريال',
              assignedTo: 'المدير المالي',
              deadline: '2024-12-20',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT002',
              description: 'إعداد تقرير تفصيلي للنسب المالية',
              assignedTo: 'قسم المحاسبة',
              deadline: '2024-12-25',
              status: 'جاري',
              completionPercent: 75
            },
            {
              id: 'OUT003',
              description: 'تحديث السياسات المالية',
              assignedTo: 'المستشار القانوني',
              deadline: '2025-01-10',
              status: 'جاري',
              completionPercent: 30
            }
          ],
          minutes: 'تم الاجتماع بحضور جميع الشركاء ومناقشة النتائج المالية للعام 2024 والموافقة بالإجماع على توزيع 50% من الأرباح الصافية.',
          attachments: ['التقرير المالي 2024.pdf', 'محضر الاجتماع.pdf']
        },
        {
          id: 'MTG002',
          number: 'MTG-2024-002',
          title: 'مراجعة رأس المال والمساهمات',
          date: '2024-11-10',
          time: '14:00',
          type: 'عادي',
          status: 'منعقد',
          groupBy: {
            subject: 'الأمور المالية',
          },
          location: 'مكتب المدير التنفيذي',
          calledBy: {
            name: 'المهندس خالد العتيبي',
            role: 'المدير الفني'
          },
          attendees: [
            { name: 'عبدالله السعيد', role: 'الرئيس التنفيذي', type: 'شريك', attended: true },
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'محمد الغامدي', role: 'المدير المالي', type: 'موظف', attended: true },
          ],
          agenda: [
            'دراسة الحاجة لزيادة رأس المال',
            'تقييم المساهمات العينية الحالية',
            'مناقشة فرص الاستثمار الجديدة',
          ],
          reason: 'الحاجة لتقييم الوضع المالي وإمكانية زيادة رأس المال لدعم التوسع',
          outputs: [
            {
              id: 'OUT004',
              description: 'إعداد دراسة جدوى لزيادة رأس المال بـ 1 مليون',
              assignedTo: 'المدير المالي',
              deadline: '2024-11-30',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT005',
              description: 'تقييم الأصول العينية المساهم بها',
              assignedTo: 'مثمن معتمد',
              deadline: '2024-12-15',
              status: 'معلق',
              completionPercent: 0
            }
          ],
          minutes: 'تمت مناقشة إمكانية زيادة رأس المال وتم تكليف المدير المالي بإعداد دراسة تفصيلية.',
        },
        
        // مجموعة اجتماعات المشاريع والعملاء
        {
          id: 'MTG003',
          number: 'MTG-2024-003',
          title: 'متابعة مشروع برج الخليج التجاري',
          date: '2024-12-01',
          time: '09:00',
          type: 'عادي',
          status: 'منعقد',
          groupBy: {
            subject: 'متابعة المشاريع',
            transaction: 'TRN-2024-156',
            client: 'شركة الخليج العقارية'
          },
          location: 'قاعة الاجتماعات الفرعية',
          calledBy: {
            name: 'المهندس خالد العتيبي',
            role: 'المدير الفني'
          },
          attendees: [
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'أحمد المطيري', role: 'مدير المشروع', type: 'موظف', attended: true },
            { name: 'سارة الأحمدي', role: 'مهندسة إنشائية', type: 'موظف', attended: true },
            { name: 'ممثل العميل', role: 'مدير التطوير', type: 'ضيف', attended: true },
          ],
          agenda: [
            'مراجعة مراحل التنفيذ المكتملة',
            'مناقشة التحديات الفنية',
            'تحديد الجدول الزمني للمرحلة القادمة',
            'مناقشة المستحقات المالية',
          ],
          reason: 'اجتماع دوري لمتابعة سير العمل في المشروع وحل المشاكل الفنية',
          outputs: [
            {
              id: 'OUT006',
              description: 'تسليم المخططات المعدلة للطابق الأرضي',
              assignedTo: 'قسم التصميم الإنشائي',
              deadline: '2024-12-10',
              status: 'جاري',
              completionPercent: 60
            },
            {
              id: 'OUT007',
              description: 'إصدار محضر اعتماد المرحلة الأولى',
              assignedTo: 'مدير المشروع',
              deadline: '2024-12-05',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT008',
              description: 'تحديث الجدول الزمني العام',
              assignedTo: 'مكتب إدارة المشاريع',
              deadline: '2024-12-08',
              status: 'مكتمل',
              completionPercent: 100
            }
          ],
          minutes: 'اجتماع ناجح أسفر عن حل عدة تحديات فنية والاتفاق على تسريع المرحلة الثانية.',
          attachments: ['تقرير التقدم.pdf', 'المخططات المعدلة.dwg']
        },
        {
          id: 'MTG004',
          number: 'MTG-2024-004',
          title: 'اجتماع تسليم مشروع فيلا الياسمين',
          date: '2024-11-25',
          time: '11:00',
          type: 'عادي',
          status: 'منعقد',
          groupBy: {
            subject: 'متابعة المشاريع',
            transaction: 'TRN-2024-087',
            client: 'المهندس فهد الدوسري'
          },
          location: 'موقع المشروع',
          calledBy: {
            name: 'مدير المشاريع',
            role: 'مدير التنفيذ'
          },
          attendees: [
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'فهد الدوسري', role: 'المالك', type: 'ضيف', attended: true },
            { name: 'عبدالرحمن الشهري', role: 'مدير المشروع', type: 'موظف', attended: true },
            { name: 'نورة القحطاني', role: 'مهندسة معمارية', type: 'موظف', attended: true },
          ],
          agenda: [
            'جولة تفقدية نهائية للمشروع',
            'قائمة التدقيق النهائية',
            'التسليم الابتدائي',
            'اعتماد الدفعة النهائية',
          ],
          reason: 'اجتماع التسليم الابتدائي للمشروع بحضور المالك',
          outputs: [
            {
              id: 'OUT009',
              description: 'معالجة الملاحظات الطفيفة (3 بنود)',
              assignedTo: 'المقاول',
              deadline: '2024-12-05',
              status: 'جاري',
              completionPercent: 70
            },
            {
              id: 'OUT010',
              description: 'إصدار شهادة التسليم الابتدائي',
              assignedTo: 'الإدارة الفنية',
              deadline: '2024-11-27',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT011',
              description: 'إعداد ملف الصيانة والضمانات',
              assignedTo: 'قسم التوثيق',
              deadline: '2024-12-10',
              status: 'جاري',
              completionPercent: 50
            }
          ],
          minutes: 'تسليم ناجح مع رضا تام من العميل ووجود ملاحظات بسيطة سيتم معالجتها.',
        },

        // مجموعة الاجتماعات الإدارية
        {
          id: 'MTG005',
          number: 'MTG-2024-005',
          title: 'اجتماع التخطيط الاستراتيجي 2025',
          date: '2024-12-20',
          time: '09:00',
          type: 'استثنائي',
          status: 'مجدول',
          groupBy: {
            subject: 'التخطيط الاستراتيجي',
          },
          location: 'قاعة الاجتماعات الرئيسية',
          calledBy: {
            name: 'المهندس عبدالله السعيد',
            role: 'الرئيس التنفيذي'
          },
          attendees: [
            { name: 'عبدالله السعيد', role: 'الرئيس التنفيذي', type: 'شريك', attended: false },
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: false },
            { name: 'فاطمة الدوسري', role: 'مستشار قانوني', type: 'شريك', attended: false },
            { name: 'جميع رؤساء الأقسام', role: 'إدارة تنفيذية', type: 'موظف', attended: false },
          ],
          agenda: [
            'مراجعة إنجازات 2024',
            'تحديد الأهداف الاستراتيجية 2025',
            'خطط التوسع والنمو',
            'الموازنة التشغيلية المقترحة',
            'تطوير الكفاءات والموارد البشرية',
          ],
          reason: 'اجتماع استراتيجي سنوي لرسم خارطة طريق العام القادم',
          outputs: [
            {
              id: 'OUT012',
              description: 'وضع الخطة الاستراتيجية 2025',
              assignedTo: 'فريق التخطيط',
              deadline: '2025-01-15',
              status: 'معلق',
              completionPercent: 0
            },
            {
              id: 'OUT013',
              description: 'اعتماد الموازنة السنوية',
              assignedTo: 'المدير المالي',
              deadline: '2024-12-31',
              status: 'معلق',
              completionPercent: 0
            }
          ],
        },
        {
          id: 'MTG006',
          number: 'MTG-2024-006',
          title: 'اجتماع طارئ - أزمة المشروع الصناعي',
          date: '2024-10-15',
          time: '16:00',
          type: 'طارئ',
          status: 'منعقد',
          groupBy: {
            subject: 'حل الأزمات',
            transaction: 'TRN-2024-234',
            client: 'مصنع الجوهرة الصناعي'
          },
          location: 'غرفة العمليات',
          calledBy: {
            name: 'المهندس عبدالله السعيد',
            role: 'الرئيس التنفيذي'
          },
          attendees: [
            { name: 'عبدالله السعيد', role: 'الرئيس التنفيذي', type: 'شريك', attended: true },
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'فاطمة الدوسري', role: 'مستشار قانوني', type: 'شريك', attended: true },
            { name: 'فريق المشروع', role: 'فريق متخصص', type: 'موظف', attended: true },
          ],
          agenda: [
            'مناقشة توقف العمل في الموقع',
            'تقييم المخاطر القانونية',
            'خطة الحلول العاجلة',
            'التواصل مع العميل',
          ],
          reason: 'توقف مفاجئ في العمل بسبب خلاف مع المقاول الرئيسي',
          outputs: [
            {
              id: 'OUT014',
              description: 'التفاوض مع المقاول لحل الخلاف',
              assignedTo: 'المستشار القانوني',
              deadline: '2024-10-18',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT015',
              description: 'إعداد خطة بديلة للتنفيذ',
              assignedTo: 'المدير الفني',
              deadline: '2024-10-20',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT016',
              description: 'إصدار تقرير للعميل',
              assignedTo: 'مدير المشروع',
              deadline: '2024-10-16',
              status: 'مكتمل',
              completionPercent: 100
            }
          ],
          minutes: 'اجتماع طارئ حرج أسفر عن حل سريع للأزمة بالتفاوض الناجح مع المقاول.',
          attachments: ['تقرير الأزمة.pdf', 'الحل البديل.pdf']
        },

        // مجموعة اجتماعات العملاء الخاصة
        {
          id: 'MTG007',
          number: 'MTG-2024-007',
          title: 'لقاء تعريفي - مشروع المجمع السكني',
          date: '2024-11-05',
          time: '10:00',
          type: 'عادي',
          status: 'منعقد',
          groupBy: {
            subject: 'علاقات العملاء',
            transaction: 'TRN-2024-289',
            client: 'شركة النخبة العقارية'
          },
          location: 'قاعة الاستقبال',
          calledBy: {
            name: 'قسم التسويق',
            role: 'مدير التسويق'
          },
          attendees: [
            { name: 'عبدالله السعيد', role: 'الرئيس التنفيذي', type: 'شريك', attended: true },
            { name: 'ممثل الشركة', role: 'مدير التطوير', type: 'ضيف', attended: true },
            { name: 'فريق المبيعات', role: 'استشاريون', type: 'موظف', attended: true },
          ],
          agenda: [
            'التعريف بخدمات المكتب',
            'عرض المشاريع السابقة',
            'مناقشة متطلبات العميل',
            'تقديم عرض سعر أولي',
          ],
          reason: 'لقاء تعريفي لعميل جديد محتمل لمشروع ضخم',
          outputs: [
            {
              id: 'OUT017',
              description: 'إعداد عرض فني ومالي مفصل',
              assignedTo: 'قسم العروض',
              deadline: '2024-11-15',
              status: 'مكتمل',
              completionPercent: 100
            },
            {
              id: 'OUT018',
              description: 'زيارة ميدانية لموقع المشروع',
              assignedTo: 'الفريق الفني',
              deadline: '2024-11-10',
              status: 'مكتمل',
              completionPercent: 100
            }
          ],
          minutes: 'لقاء ناجح أظهر اهتمام العميل بالتعاقد، وتم تقديم عرض تنافسي.',
        },
        {
          id: 'MTG008',
          number: 'MTG-2024-008',
          title: 'متابعة رضا العميل - مشروع الفيلا الفاخرة',
          date: '2024-12-05',
          time: '15:00',
          type: 'عادي',
          status: 'منعقد',
          groupBy: {
            subject: 'علاقات العملاء',
            transaction: 'TRN-2024-123',
            client: 'الأمير تركي بن سعود'
          },
          location: 'مكتب العميل',
          calledBy: {
            name: 'المهندس خالد العتيبي',
            role: 'المدير الفني'
          },
          attendees: [
            { name: 'خالد العتيبي', role: 'المدير الفني', type: 'شريك', attended: true },
            { name: 'الأمير تركي', role: 'المالك', type: 'ضيف', attended: true },
            { name: 'مدير المشروع', role: 'مشرف تنفيذي', type: 'موظف', attended: true },
          ],
          agenda: [
            'الاستماع لملاحظات العميل',
            'مراجعة جودة التنفيذ',
            'مناقشة أي تعديلات مطلوبة',
            'التخطيط للمراحل القادمة',
          ],
          reason: 'اجتماع دوري لضمان رضا العميل عن سير العمل',
          outputs: [
            {
              id: 'OUT019',
              description: 'تنفيذ تعديلات طفيفة في التشطيبات',
              assignedTo: 'المقاول',
              deadline: '2024-12-20',
              status: 'جاري',
              completionPercent: 40
            },
            {
              id: 'OUT020',
              description: 'رفع تقرير الجودة',
              assignedTo: 'قسم الجودة',
              deadline: '2024-12-10',
              status: 'مكتمل',
              completionPercent: 100
            }
          ],
          minutes: 'العميل راضٍ جداً عن جودة العمل مع ملاحظات بسيطة جداً.',
        },
      ];

      // حالات التجميع
      const [groupingMode, setGroupingMode] = useState<'all' | 'subject' | 'transaction' | 'client'>('all');
      const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
      const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
      const [showMeetingDialog, setShowMeetingDialog] = useState(false);
      const [showOutputsDialog, setShowOutputsDialog] = useState(false);

      // تجميع الاجتماعات
      const getGroupedMeetings = () => {
        if (groupingMode === 'all') {
          return { 'جميع الاجتماعات': meetings };
        }

        const grouped: { [key: string]: Meeting[] } = {};
        
        meetings.forEach(meeting => {
          let key = '';
          if (groupingMode === 'subject') {
            key = meeting.groupBy.subject;
          } else if (groupingMode === 'transaction') {
            key = meeting.groupBy.transaction || 'بدون معاملة';
          } else if (groupingMode === 'client') {
            key = meeting.groupBy.client || 'بدون عميل';
          }

          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(meeting);
        });

        return grouped;
      };

      const groupedMeetings = getGroupedMeetings();

      // إحصائيات
      const totalMeetings = meetings.length;
      const completedMeetings = meetings.filter(m => m.status === 'منعقد').length;
      const scheduledMeetings = meetings.filter(m => m.status === 'مجدول').length;
      const totalOutputs = meetings.reduce((sum, m) => sum + m.outputs.length, 0);
      const completedOutputs = meetings.reduce((sum, m) => sum + m.outputs.filter(o => o.status === 'مكتمل').length, 0);
      const pendingOutputs = meetings.reduce((sum, m) => sum + m.outputs.filter(o => o.status === 'معلق').length, 0);

      // دالة للحصول على لون الحالة
      const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
          'مجدول': '#3b82f6',
          'منعقد': '#10b981',
          'ملغي': '#ef4444',
          'مؤجل': '#f59e0b',
        };
        return colors[status] || '#6b7280';
      };

      const getOutputStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
          'معلق': '#6b7280',
          'جاري': '#3b82f6',
          'مكتمل': '#10b981',
          'متأخر': '#ef4444',
        };
        return colors[status] || '#6b7280';
      };

      return (
        <div className="space-y-2">
          {/* العنوان والإحصائيات */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                الاجتماعات والمحاضر - نظام شامل
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة وتتبع جميع اجتماعات الشركاء والمخرجات
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                <Plus className="h-3.5 w-3.5 ml-2" />
                اجتماع جديد
              </Button>
            </div>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الاجتماعات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalMeetings}
                    </p>
                  </div>
                  <Briefcase className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      اجتماعات منعقدة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {completedMeetings}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      اجتماعات مجدولة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {scheduledMeetings}
                    </p>
                  </div>
                  <Calendar className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي المخرجات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalOutputs}
                    </p>
                  </div>
                  <Target className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مخرجات مكتملة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {completedOutputs}
                    </p>
                  </div>
                  <Activity className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مخرجات معلقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {pendingOutputs}
                    </p>
                  </div>
                  <AlertCircle className="stats-icon-compact text-red-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* أزرار التجميع */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  تجميع الاجتماعات حسب:
                </span>
                <div className="flex gap-2 flex-1">
                  <Button
                    size="sm"
                    variant={groupingMode === 'all' ? 'default' : 'outline'}
                    onClick={() => setGroupingMode('all')}
                    className="dense-button"
                  >
                    الكل
                  </Button>
                  <Button
                    size="sm"
                    variant={groupingMode === 'subject' ? 'default' : 'outline'}
                    onClick={() => setGroupingMode('subject')}
                    className="dense-button"
                  >
                    الموضوع
                  </Button>
                  <Button
                    size="sm"
                    variant={groupingMode === 'transaction' ? 'default' : 'outline'}
                    onClick={() => setGroupingMode('transaction')}
                    className="dense-button"
                  >
                    المعاملة
                  </Button>
                  <Button
                    size="sm"
                    variant={groupingMode === 'client' ? 'default' : 'outline'}
                    onClick={() => setGroupingMode('client')}
                    className="dense-button"
                  >
                    العميل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* عرض المجموعات والاجتماعات */}
          <div className="space-y-2">
            {Object.entries(groupedMeetings).map(([groupName, groupMeetings]) => (
              <Card key={groupName} className="card-rtl">
                <CardHeader 
                  className="card-header-dense cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedGroup(selectedGroup === groupName ? null : groupName)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {groupName}
                    </CardTitle>
                    <Badge className="bg-[#2563eb] text-white">
                      {groupMeetings.length} اجتماع
                    </Badge>
                  </div>
                </CardHeader>
                
                {selectedGroup === groupName && (
                  <CardContent className="dense-card-content">
                    {/* Timeline الاجتماعات */}
                    <div className="relative pr-6" style={{ borderRight: '3px solid #e5e7eb' }}>
                      {groupMeetings
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((meeting, idx) => (
                          <div key={meeting.id} className="relative mb-4 pr-4">
                            {/* نقطة التايم لاين */}
                            <div
                              className="absolute"
                              style={{
                                right: '-9px',
                                top: '8px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(meeting.status),
                                border: '3px solid white',
                                boxShadow: '0 0 0 2px #e5e7eb'
                              }}
                            />

                            {/* بطاقة الاجتماع */}
                            <div
                              className="p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
                              style={{
                                backgroundColor: 'white',
                                border: '2px solid #e5e7eb'
                              }}
                              onClick={() => {
                                setSelectedMeeting(meeting);
                                setShowMeetingDialog(true);
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="text-xs px-2 py-0.5 rounded"
                                      style={{
                                        fontFamily: 'Courier New, monospace',
                                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                        color: '#2563eb'
                                      }}
                                    >
                                      {meeting.number}
                                    </span>
                                    <Badge
                                      style={{
                                        backgroundColor: getStatusColor(meeting.status) + '20',
                                        color: getStatusColor(meeting.status),
                                        borderColor: getStatusColor(meeting.status)
                                      }}
                                      className="border text-[10px]"
                                    >
                                      {meeting.status}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      {meeting.type}
                                    </Badge>
                                  </div>
                                  <h4
                                    className="text-sm mb-1"
                                    style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}
                                  >
                                    {meeting.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {meeting.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {meeting.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {meeting.attendees.length} مشارك
                                    </span>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <div className="text-xs" style={{ color: '#6b7280', fontFamily: 'Tajawal, sans-serif' }}>
                                    دعا له:
                                  </div>
                                  <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                    {meeting.calledBy.name}
                                  </div>
                                  <div className="text-[10px]" style={{ color: '#6b7280' }}>
                                    {meeting.calledBy.role}
                                  </div>
                                </div>
                              </div>

                              {/* شريط المخرجات المختصر */}
                              <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
                                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                  المخرجات:
                                </span>
                                <div className="flex gap-1 flex-1">
                                  {meeting.outputs.slice(0, 3).map(output => (
                                    <div
                                      key={output.id}
                                      className="h-1.5 flex-1 rounded-full"
                                      style={{
                                        backgroundColor: getOutputStatusColor(output.status) + '40',
                                      }}
                                      title={`${output.description} - ${output.status}`}
                                    />
                                  ))}
                                  {meeting.outputs.length > 3 && (
                                    <span className="text-[10px]" style={{ color: '#6b7280' }}>
                                      +{meeting.outputs.length - 3}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="dense-button h-6 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMeeting(meeting);
                                    setShowOutputsDialog(true);
                                  }}
                                >
                                  <FileText className="h-3 w-3 ml-1" />
                                  المخرجات ({meeting.outputs.length})
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* نافذة تفاصيل الاجتماع */}
          <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
            <DialogContent className="max-w-6xl dialog-rtl" style={{ direction: 'rtl', maxHeight: '90vh', overflow: 'auto' }}>
              {selectedMeeting && (
                <>
                  <DialogHeader className="dialog-header">
                    <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      تفاصيل الاجتماع - {selectedMeeting.number}
                    </DialogTitle>
                    <DialogDescription className="dialog-description">
                      جميع معلومات وتفاصيل الاجتماع والحضور والمخرجات
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3" style={{ padding: '16px 0' }}>
                    {/* معلومات أساسية */}
                    <Card className="card-rtl">
                      <CardHeader className="card-header-dense">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المعلومات الأساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="dense-card-content">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              عنوان الاجتماع
                            </Label>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                              {selectedMeeting.title}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              رقم الاجتماع
                            </Label>
                            <p className="text-sm font-mono">
                              {selectedMeeting.number}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              التاريخ والوقت
                            </Label>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedMeeting.date} - {selectedMeeting.time}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              المكان
                            </Label>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {selectedMeeting.location}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              النوع
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {selectedMeeting.type}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              الحالة
                            </Label>
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(selectedMeeting.status) + '20',
                                color: getStatusColor(selectedMeeting.status),
                                borderColor: getStatusColor(selectedMeeting.status)
                              }}
                              className="border text-xs"
                            >
                              {selectedMeeting.status}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div>
                          <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            دعا إلى الاجتماع
                          </Label>
                          <div className="p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                              {selectedMeeting.calledBy.name}
                            </p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              {selectedMeeting.calledBy.role}
                            </p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div>
                          <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            سبب الاجتماع
                          </Label>
                          <p className="text-sm p-2 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#fef3c7' }}>
                            {selectedMeeting.reason}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* جدول الأعمال */}
                    <Card className="card-rtl">
                      <CardHeader className="card-header-dense">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          جدول الأعمال
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="dense-card-content">
                        <ol className="space-y-2" style={{ paddingRight: '20px', listStyle: 'arabic-indic' }}>
                          {selectedMeeting.agenda.map((item, idx) => (
                            <li key={idx} className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>

                    {/* الحضور */}
                    <Card className="card-rtl">
                      <CardHeader className="card-header-dense">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          أطراف الاجتماع والحضور ({selectedMeeting.attendees.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="dense-card-content">
                        <Table className="table-rtl dense-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصفة</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                              <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحضور</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedMeeting.attendees.map((attendee, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {attendee.name}
                                </TableCell>
                                <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                                  {attendee.role}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                    style={{
                                      backgroundColor: attendee.type === 'شريك' ? '#dbeafe' : attendee.type === 'موظف' ? '#dcfce7' : '#fef3c7',
                                      borderColor: attendee.type === 'شريك' ? '#2563eb' : attendee.type === 'موظف' ? '#10b981' : '#f59e0b',
                                      color: attendee.type === 'شريك' ? '#2563eb' : attendee.type === 'موظف' ? '#10b981' : '#f59e0b'
                                    }}
                                  >
                                    {attendee.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {attendee.attended ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-400" />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* المخرجات */}
                    <Card className="card-rtl">
                      <CardHeader className="card-header-dense">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المخرجات والقرارات ({selectedMeeting.outputs.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="dense-card-content">
                        <div className="space-y-2">
                          {selectedMeeting.outputs.map((output) => (
                            <div
                              key={output.id}
                              className="p-3 rounded-lg"
                              style={{
                                backgroundColor: '#f8fafc',
                                border: `2px solid ${getOutputStatusColor(output.status)}40`
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                                    {output.description}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
                                    <span className="flex items-center gap-1">
                                      <UserCog className="h-3 w-3" />
                                      {output.assignedTo}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      موعد التسليم: {output.deadline}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  style={{
                                    backgroundColor: getOutputStatusColor(output.status) + '20',
                                    color: getOutputStatusColor(output.status),
                                    borderColor: getOutputStatusColor(output.status)
                                  }}
                                  className="border text-xs"
                                >
                                  {output.status}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  <span style={{ color: '#6b7280' }}>نسبة الإنجاز</span>
                                  <span style={{ fontWeight: 600 }}>{output.completionPercent}%</span>
                                </div>
                                <Progress value={output.completionPercent} className="h-1.5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* المحضر */}
                    {selectedMeeting.minutes && (
                      <Card className="card-rtl">
                        <CardHeader className="card-header-dense">
                          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            محضر الاجتماع
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="dense-card-content">
                          <p className="text-sm p-3 rounded" style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', lineHeight: '1.8' }}>
                            {selectedMeeting.minutes}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* المرفقات */}
                    {selectedMeeting.attachments && selectedMeeting.attachments.length > 0 && (
                      <Card className="card-rtl">
                        <CardHeader className="card-header-dense">
                          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المرفقات ({selectedMeeting.attachments.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="dense-card-content">
                          <div className="space-y-1">
                            {selectedMeeting.attachments.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                                style={{ border: '1px solid #e5e7eb' }}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {file}
                                  </span>
                                </div>
                                <Button size="sm" variant="ghost" className="dense-button">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowMeetingDialog(false)}
                      className="dense-button"
                    >
                      إغلاق
                    </Button>
                    <Button className="dense-button bg-[#2563eb] hover:bg-[#1e40af] text-white">
                      <Edit className="h-3.5 w-3.5 ml-2" />
                      تعديل
                    </Button>
                    <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                      <FileText className="h-3.5 w-3.5 ml-2" />
                      طباعة المحضر
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* نافذة المخرجات المفصلة */}
          <Dialog open={showOutputsDialog} onOpenChange={setShowOutputsDialog}>
            <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
              {selectedMeeting && (
                <>
                  <DialogHeader className="dialog-header">
                    <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      مخرجات الاجتماع - {selectedMeeting.title}
                    </DialogTitle>
                    <DialogDescription className="dialog-description">
                      متابعة تفصيلية لجميع المخرجات والمنجز منها
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3" style={{ padding: '16px 0' }}>
                    {/* إحصائيات المخرجات */}
                    <div className="grid grid-cols-4 gap-2">
                      <Card className="card-rtl">
                        <CardContent className="dense-card-content-sm text-center">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            الإجمالي
                          </p>
                          <p className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {selectedMeeting.outputs.length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="dense-card-content-sm text-center">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            مكتمل
                          </p>
                          <p className="text-base text-green-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {selectedMeeting.outputs.filter(o => o.status === 'مكتمل').length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="dense-card-content-sm text-center">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            جاري
                          </p>
                          <p className="text-base text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {selectedMeeting.outputs.filter(o => o.status === 'جاري').length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="card-rtl">
                        <CardContent className="dense-card-content-sm text-center">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            معلق
                          </p>
                          <p className="text-base text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                            {selectedMeeting.outputs.filter(o => o.status === 'معلق').length}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* قائمة المخرجات التفصيلية */}
                    <Table className="table-rtl dense-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المخرج</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكلف</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموعد</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMeeting.outputs.map((output) => (
                          <TableRow key={output.id}>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {output.description}
                            </TableCell>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {output.assignedTo}
                            </TableCell>
                            <TableCell className="text-right text-xs font-mono">
                              {output.deadline}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                style={{
                                  backgroundColor: getOutputStatusColor(output.status) + '20',
                                  color: getOutputStatusColor(output.status),
                                  borderColor: getOutputStatusColor(output.status)
                                }}
                                className="border text-xs"
                              >
                                {output.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Progress value={output.completionPercent} className="h-1.5 flex-1" />
                                <span className="text-xs font-mono" style={{ minWidth: '35px' }}>
                                  {output.completionPercent}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowOutputsDialog(false)}
                      className="dense-button"
                    >
                      إغلاق
                    </Button>
                    <Button className="dense-button bg-[#2563eb] hover:bg-[#1e40af] text-white">
                      <FileText className="h-3.5 w-3.5 ml-2" />
                      تقرير المخرجات
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    // باقي التابات
    return (
      <div className="space-y-2">
        <Card className="card-rtl">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى التاب
            </h3>
            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              محتوى {TABS_CONFIG.find(t => t.id === activeTab)?.title}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              شركاء ملكية المكتب
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              معلومات سرية للغاية - للملاك فقط - نظام متقدم v2.0
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-600 text-white">
              <Shield className="h-3 w-3 ml-1" />
              CONFIDENTIAL
            </Badge>
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-943
            </Badge>
            <Badge className="bg-purple-600 text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              15 تاب
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        <Card className="w-56 card-rtl" style={{ height: 'fit-content' }}>
          <CardContent className="p-2">
            <div className="space-y-1">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-2 rounded transition-all ${
                    activeTab === tab.id ? 'bg-[#2563eb] text-white' : 'hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(tab.icon, { className: 'h-4 w-4' })}
                      <span className="text-xs">{tab.title}</span>
                    </div>
                    <span 
                      className="text-[10px] px-1 rounded"
                      style={{ 
                        fontFamily: 'Courier New, monospace',
                        backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.1)'
                      }}
                    >
                      {tab.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة تفاصيل الشريك */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل الشريك
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedPartner?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-3">
              <Card className="bg-blue-50 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        رقم الشريك
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedPartner.partnerNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الهوية الوطنية
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedPartner.nationalId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        البريد الإلكتروني
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedPartner.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الهاتف
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedPartner.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      نسب الملكية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الملكية
                        </p>
                        <Progress value={selectedPartner.ownershipPercent} className="h-2" />
                        <p className="text-xs mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedPartner.ownershipPercent}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الأرباح
                        </p>
                        <Progress value={selectedPartner.profitSharePercent} className="h-2" />
                        <p className="text-xs mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedPartner.profitSharePercent}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الصلاحيات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          حق التصويت
                        </span>
                        {selectedPartner.hasVotingRight ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          حق الإدارة
                        </span>
                        {selectedPartner.hasManagementRight ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          وزن الصوت
                        </span>
                        <Badge className="bg-blue-100 text-blue-700">
                          {selectedPartner.votingWeight}×
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المساهمة المالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="text-center">
                      <p className="text-2xl mb-2" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                        {(selectedPartner.capitalContribution / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        مليون ريال سعودي
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowDetailsDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة مساهمة */}
      <Dialog open={showContributionDialog} onOpenChange={setShowContributionDialog}>
        <DialogContent className="max-w-3xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة مساهمة رأسمالية جديدة
            </DialogTitle>
          </DialogHeader>

          <div className="form-rtl form-dense space-y-3">
            <div className="grid grid-cols-2 dense-grid">
              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشريك *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر الشريك" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نوع المساهمة *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقدي">نقدي</SelectItem>
                    <SelectItem value="عيني">عيني</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المبلغ (ريال) *
                </Label>
                <Input
                  type="number"
                  className="dense-input"
                  placeholder="500000"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التاريخ *
                </Label>
                <Input
                  type="date"
                  className="dense-input"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الطريقة *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="تحويل بنكي / شيك / نقداً"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رقم المستند
                </Label>
                <Input
                  className="dense-input"
                  placeholder="TRN-2024-XXX"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                السبب *
              </Label>
              <Input
                className="dense-input"
                placeholder="زيادة رأس المال / تأسيس / ..."
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الوصف
              </Label>
              <Textarea
                className="dense-input"
                rows={3}
                placeholder="وصف تفصيلي للمساهمة..."
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '70px' }}
              />
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفاصيل الأصول (للمساهمات العينية)
              </Label>
              <Textarea
                className="dense-input"
                rows={2}
                placeholder="وصف الأصول العينية (مكاتب، معدات، برامج...)"
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '50px' }}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowContributionDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficePartnersOwnershipScreen;
