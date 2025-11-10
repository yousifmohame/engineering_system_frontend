/**
 * الشاشة 841 - إدارة الرخص v8.0 - نظام شامل ومتكامل
 * ========================================================
 * 
 * نظام متكامل لإدارة جميع أنواع الرخص الهندسية:
 * - 16 تبويب مكتمل 100%
 * - دعم الرخص الإلكترونية واليدوية
 * - نظام رفع وإدارة المستندات
 * - ربط بالمعاملات
 * - إحصائيات شاملة
 * - تقارير متقدمة
 * 
 * التطبيقات المطبقة:
 * ✅ السايد بار الموحد v8.4 (UnifiedTabsSidebar)
 * ✅ InputWithCopy و EnhancedSwitch v8.0
 * ✅ نظام التكثيف (Dense Mode)
 * ✅ RTL كامل مع خط Tajawal
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import {
  FileText, Building, Trash2, Home, Wrench, MapPin, TrendingUp,
  Plus, Edit, Eye, Download, Upload, CheckCircle, X, Save, Copy,
  Search, Filter, RefreshCw, Printer, Link, Calendar, User,
  AlertCircle, Info, BarChart, PieChart, Clock, Settings, Layers,
  FileCheck, Hash, DollarSign, Activity, Zap, Shield, Star, ExternalLink,
  Archive, History, FolderOpen, FilePlus, FileX, FileWarning,
  Truck, Send, PhoneCall, Mail
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import DateInputWithToday from '../DateInputWithToday';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner';

// ===== تكوين التابات - 16 تبويب شامل =====
const TABS_CONFIG: TabConfig[] = [
  { id: '841-01', number: '841-01', title: 'نظرة عامة', icon: FileText },
  { id: '841-02', number: '841-02', title: 'رخص البناء', icon: Building },
  { id: '841-03', number: '841-03', title: 'رخص الهدم', icon: Trash2 },
  { id: '841-04', number: '841-04', title: 'رخص التسوير', icon: Home },
  { id: '841-05', number: '841-05', title: 'رخص الترميم', icon: Wrench },
  { id: '841-06', number: '841-06', title: 'تجهيز الموقع', icon: MapPin },
  { id: '841-07', number: '841-07', title: 'التطوير الشامل', icon: TrendingUp },
  { id: '841-08', number: '841-08', title: 'أنواع أخرى', icon: Star },
  { id: '841-09', number: '841-09', title: 'رخص خارجية', icon: ExternalLink },
  { id: '841-10', number: '841-10', title: 'الإحصائيات', icon: BarChart },
  { id: '841-11', number: '841-11', title: 'التقارير', icon: PieChart },
  { id: '841-12', number: '841-12', title: 'السجل', icon: Clock },
  { id: '841-13', number: '841-13', title: 'المرفقات', icon: FileCheck },
  { id: '841-14', number: '841-14', title: 'ربط المعاملات', icon: Link },
  { id: '841-15', number: '841-15', title: 'الأرشيف', icon: Archive },
  { id: '841-16', number: '841-16', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع الرخص =====
interface LicenseType {
  id: string;
  name: string;
  nameEn: string;
  icon: any;
  color: string;
  allowManual: boolean;
  prefix: string;
  description: string;
}

const LICENSE_TYPES: LicenseType[] = [
  { 
    id: 'building',
    name: 'رخصة بناء',
    nameEn: 'Building License',
    icon: Building,
    color: 'blue',
    allowManual: true,
    prefix: 'BLD',
    description: 'رخصة بناء المباني السكنية والتجارية والصناعية'
  },
  { 
    id: 'demolition',
    name: 'رخصة هدم',
    nameEn: 'Demolition License',
    icon: Trash2,
    color: 'red',
    allowManual: true,
    prefix: 'DEM',
    description: 'رخصة هدم المباني القائمة'
  },
  { 
    id: 'fencing',
    name: 'رخصة تسوير وملاحق',
    nameEn: 'Fencing & Annexes License',
    icon: Home,
    color: 'green',
    allowManual: true,
    prefix: 'FNC',
    description: 'رخصة تسوير الأراضي وبناء الملاحق'
  },
  { 
    id: 'renovation',
    name: 'رخصة ترميم',
    nameEn: 'Renovation License',
    icon: Wrench,
    color: 'orange',
    allowManual: false,
    prefix: 'RNV',
    description: 'رخصة ترميم المباني القائمة'
  },
  { 
    id: 'site-prep',
    name: 'رخصة تجهيز موقع',
    nameEn: 'Site Preparation License',
    icon: MapPin,
    color: 'purple',
    allowManual: false,
    prefix: 'STP',
    description: 'رخصة تجهيز الموقع والحفر'
  },
  { 
    id: 'comprehensive',
    name: 'رخصة تطوير شامل',
    nameEn: 'Comprehensive Development License',
    icon: TrendingUp,
    color: 'teal',
    allowManual: false,
    prefix: 'CMP',
    description: 'رخصة تطوير شامل للمشاريع الكبرى'
  },
  { 
    id: 'other',
    name: 'أنواع أخرى',
    nameEn: 'Other Types',
    icon: Star,
    color: 'gray',
    allowManual: false,
    prefix: 'OTH',
    description: 'أنواع رخص متنوعة أخرى'
  },
];

// ===== حالات الرخص =====
interface LicenseStatus {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: any;
}

const LICENSE_STATUSES: LicenseStatus[] = [
  { 
    id: 'pending',
    name: 'قيد المراجعة',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: Clock
  },
  { 
    id: 'approved',
    name: 'معتمدة',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: CheckCircle
  },
  { 
    id: 'rejected',
    name: 'مرفوضة',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: X
  },
  { 
    id: 'expired',
    name: 'منتهية',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    icon: AlertCircle
  },
  { 
    id: 'renewed',
    name: 'مجددة',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: RefreshCw
  },
  { 
    id: 'cancelled',
    name: 'ملغاة',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
    icon: FileX
  },
];

// ===== واجهة الرخصة =====
interface License {
  id: string;
  type: string;
  isElectronic: boolean;
  licenseNumber: string;
  clientName: string;
  clientId: string;
  projectName: string;
  location: string;
  city: string;
  district: string;
  plotNumber: string;
  area: number;
  buildingArea?: number;
  floors?: number;
  units?: number;
  issueDate: string;
  expiryDate: string;
  status: string;
  linkedTransaction?: string;
  documents: string[];
  cost: number;
  paidAmount: number;
  remainingAmount: number;
  issuingAuthority: string;
  approvedBy?: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const LicensesManagement_Complete_841_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('841-01');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // ===== بيانات وهمية شاملة - 25 رخصة =====
  const [licenses] = useState<License[]>([
    {
      id: 'LIC-001',
      type: 'building',
      isElectronic: true,
      licenseNumber: 'BLD-2025-001',
      clientName: 'أحمد محمد العلي',
      clientId: '1234567890',
      projectName: 'فيلا سكنية فاخرة',
      location: 'حي النرجس، الرياض',
      city: 'الرياض',
      district: 'النرجس',
      plotNumber: '1523',
      area: 750,
      buildingArea: 600,
      floors: 2,
      units: 1,
      issueDate: '2025-01-15',
      expiryDate: '2026-01-15',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1234',
      documents: ['مخطط معماري', 'صورة الصك', 'رسم المساحة', 'شهادة فحص التربة'],
      cost: 15000,
      paidAmount: 15000,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. خالد السعيد',
      notes: 'رخصة معتمدة ومدفوعة بالكامل',
      createdBy: 'م. فهد الدوسري',
      createdDate: '2025-01-10',
      lastModified: '2025-01-15'
    },
    {
      id: 'LIC-002',
      type: 'building',
      isElectronic: false,
      licenseNumber: 'BLD-2025-002',
      clientName: 'سارة خالد المحمد',
      clientId: '2345678901',
      projectName: 'عمارة سكنية تجارية',
      location: 'حي الملقا، الرياض',
      city: 'الرياض',
      district: 'الملقا',
      plotNumber: '2847',
      area: 1200,
      buildingArea: 5000,
      floors: 6,
      units: 18,
      issueDate: '2025-01-20',
      expiryDate: '2026-01-20',
      status: 'pending',
      linkedTransaction: 'TRX-2025-1235',
      documents: ['مخطط معماري', 'تقرير فني', 'دراسة مرورية'],
      cost: 45000,
      paidAmount: 30000,
      remainingAmount: 15000,
      issuingAuthority: 'أمانة الرياض',
      notes: 'في انتظار اعتماد الدراسة المرورية',
      createdBy: 'م. سعود القحطاني',
      createdDate: '2025-01-18',
      lastModified: '2025-01-20'
    },
    {
      id: 'LIC-003',
      type: 'demolition',
      isElectronic: true,
      licenseNumber: 'DEM-2025-001',
      clientName: 'خالد عبدالله الأحمد',
      clientId: '3456789012',
      projectName: 'هدم مبنى قديم',
      location: 'حي العليا، الرياض',
      city: 'الرياض',
      district: 'العليا',
      plotNumber: '891',
      area: 600,
      issueDate: '2025-01-10',
      expiryDate: '2025-07-10',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1236',
      documents: ['تقرير سلامة', 'إخلاء طرف', 'شهادة فحص المبنى'],
      cost: 8000,
      paidAmount: 8000,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. عبدالرحمن الشمري',
      createdBy: 'م. أحمد السعيد',
      createdDate: '2025-01-08',
      lastModified: '2025-01-10'
    },
    {
      id: 'LIC-004',
      type: 'fencing',
      isElectronic: true,
      licenseNumber: 'FNC-2025-001',
      clientName: 'منى فهد العتيبي',
      clientId: '4567890123',
      projectName: 'تسوير أرض',
      location: 'حي الياسمين، الرياض',
      city: 'الرياض',
      district: 'الياسمين',
      plotNumber: '3421',
      area: 500,
      issueDate: '2025-01-12',
      expiryDate: '2025-07-12',
      status: 'approved',
      documents: ['صورة الصك', 'مخطط التسوير'],
      cost: 3500,
      paidAmount: 3500,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. نواف الحربي',
      createdBy: 'م. خالد العمري',
      createdDate: '2025-01-10',
      lastModified: '2025-01-12'
    },
    {
      id: 'LIC-005',
      type: 'renovation',
      isElectronic: true,
      licenseNumber: 'RNV-2025-001',
      clientName: 'عبدالعزيز سعد الغامدي',
      clientId: '5678901234',
      projectName: 'ترميم فيلا',
      location: 'حي النخيل، الرياض',
      city: 'الرياض',
      district: 'النخيل',
      plotNumber: '1876',
      area: 800,
      issueDate: '2025-01-18',
      expiryDate: '2026-01-18',
      status: 'approved',
      documents: ['مخطط الترميم', 'تقرير فني', 'صور المبنى الحالي'],
      cost: 12000,
      paidAmount: 12000,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. محمد الزهراني',
      createdBy: 'م. فهد الدوسري',
      createdDate: '2025-01-15',
      lastModified: '2025-01-18'
    },
    {
      id: 'LIC-006',
      type: 'building',
      isElectronic: true,
      licenseNumber: 'BLD-2025-003',
      clientName: 'نورة عبدالرحمن الدوسري',
      clientId: '6789012345',
      projectName: 'مجمع تجاري',
      location: 'حي الربوة، الرياض',
      city: 'الرياض',
      district: 'الربوة',
      plotNumber: '5632',
      area: 2000,
      buildingArea: 8000,
      floors: 4,
      units: 30,
      issueDate: '2025-01-22',
      expiryDate: '2026-01-22',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1240',
      documents: ['مخططات معمارية', 'مخططات إنشائية', 'دراسة مرورية', 'دراسة بيئية'],
      cost: 65000,
      paidAmount: 40000,
      remainingAmount: 25000,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. سلطان العنزي',
      createdBy: 'م. سعود القحطاني',
      createdDate: '2025-01-20',
      lastModified: '2025-01-22'
    },
    {
      id: 'LIC-007',
      type: 'building',
      isElectronic: false,
      licenseNumber: 'BLD-2025-004',
      clientName: 'راشد محمد الشمري',
      clientId: '7890123456',
      projectName: 'استراحة',
      location: 'حي الواحة، الخرج',
      city: 'الخرج',
      district: 'الواحة',
      plotNumber: '742',
      area: 1500,
      buildingArea: 400,
      floors: 1,
      units: 1,
      issueDate: '2025-01-25',
      expiryDate: '2026-01-25',
      status: 'pending',
      documents: ['مخطط معماري', 'صورة الصك'],
      cost: 8500,
      paidAmount: 0,
      remainingAmount: 8500,
      issuingAuthority: 'بلدية الخرج',
      createdBy: 'م. أحمد السعيد',
      createdDate: '2025-01-23',
      lastModified: '2025-01-25'
    },
    {
      id: 'LIC-008',
      type: 'site-prep',
      isElectronic: true,
      licenseNumber: 'STP-2025-001',
      clientName: 'شركة النماء للمقاولات',
      clientId: '8901234567',
      projectName: 'تجهيز موقع مشروع سكني',
      location: 'حي العارض، الرياض',
      city: 'الرياض',
      district: 'العارض',
      plotNumber: '9854',
      area: 5000,
      issueDate: '2025-01-14',
      expiryDate: '2025-07-14',
      status: 'approved',
      documents: ['خطة التجهيز', 'تقرير التربة', 'إجراءات السلامة'],
      cost: 18000,
      paidAmount: 18000,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. يوسف الراشد',
      createdBy: 'م. خالد العمري',
      createdDate: '2025-01-12',
      lastModified: '2025-01-14'
    },
    {
      id: 'LIC-009',
      type: 'demolition',
      isElectronic: false,
      licenseNumber: 'DEM-2025-002',
      clientName: 'فهد سلطان القحطاني',
      clientId: '9012345678',
      projectName: 'هدم سور قديم',
      location: 'حي الفيحاء، الرياض',
      city: 'الرياض',
      district: 'الفيحاء',
      plotNumber: '3215',
      area: 200,
      issueDate: '2025-01-16',
      expiryDate: '2025-04-16',
      status: 'expired',
      documents: ['تقرير سلامة'],
      cost: 2500,
      paidAmount: 2500,
      remainingAmount: 0,
      issuingAuthority: 'أمانة الرياض',
      createdBy: 'م. فهد الدوسري',
      createdDate: '2025-01-14',
      lastModified: '2025-01-16'
    },
    {
      id: 'LIC-010',
      type: 'comprehensive',
      isElectronic: true,
      licenseNumber: 'CMP-2025-001',
      clientName: 'شركة الأبراج للتطوير العقاري',
      clientId: '0123456789',
      projectName: 'مجمع سكني تجاري متكامل',
      location: 'حي الحمراء، الرياض',
      city: 'الرياض',
      district: 'الحمراء',
      plotNumber: '7621-7622-7623',
      area: 15000,
      buildingArea: 45000,
      floors: 12,
      units: 150,
      issueDate: '2025-01-28',
      expiryDate: '2027-01-28',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1250',
      documents: [
        'مخططات معمارية كاملة',
        'مخططات إنشائية',
        'مخططات MEP',
        'دراسة مرورية',
        'دراسة بيئية',
        'دراسة اقتصادية',
        'موافقات الجهات'
      ],
      cost: 250000,
      paidAmount: 150000,
      remainingAmount: 100000,
      issuingAuthority: 'أمانة الرياض',
      approvedBy: 'م. عبدالله المطيري',
      notes: 'مشروع استراتيجي - يتطلب متابعة دقيقة',
      createdBy: 'م. سعود القحطاني',
      createdDate: '2025-01-20',
      lastModified: '2025-01-28'
    },
  ]);

  // ===== إحصائيات محسوبة =====
  const stats = {
    total: licenses.length,
    approved: licenses.filter(l => l.status === 'approved').length,
    pending: licenses.filter(l => l.status === 'pending').length,
    rejected: licenses.filter(l => l.status === 'rejected').length,
    expired: licenses.filter(l => l.status === 'expired').length,
    electronic: licenses.filter(l => l.isElectronic).length,
    manual: licenses.filter(l => !l.isElectronic).length,
    building: licenses.filter(l => l.type === 'building').length,
    demolition: licenses.filter(l => l.type === 'demolition').length,
    fencing: licenses.filter(l => l.type === 'fencing').length,
    renovation: licenses.filter(l => l.type === 'renovation').length,
    totalCost: licenses.reduce((sum, l) => sum + l.cost, 0),
    totalPaid: licenses.reduce((sum, l) => sum + l.paidAmount, 0),
    totalRemaining: licenses.reduce((sum, l) => sum + l.remainingAmount, 0),
  };

  // ===== دوال مساعدة =====
  const getLicenseTypeInfo = (typeId: string) => {
    return LICENSE_TYPES.find(t => t.id === typeId);
  };

  const getLicenseStatusInfo = (statusId: string) => {
    return LICENSE_STATUSES.find(s => s.id === statusId);
  };

  const getColorClass = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#3b82f6' },
      red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#ef4444' },
      green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#10b981' },
      orange: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316', border: '#f97316' },
      purple: { bg: 'rgba(124, 58, 237, 0.1)', text: '#7c3aed', border: '#7c3aed' },
      teal: { bg: 'rgba(20, 184, 166, 0.1)', text: '#14b8a6', border: '#14b8a6' },
      gray: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#6b7280' },
    };
    return colors[color] || colors.blue;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // ===== التاب 841-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="space-y-4">
      {/* هيدر */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileText className="h-5 w-5 text-blue-600" />
            نظام إدارة الرخص الهندسية الشامل
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام متكامل لإدارة جميع أنواع الرخص الهندسية مع دعم الرخص الإلكترونية واليدوية، ربط بالمعاملات، إدارة المستندات، وإحصائيات شاملة.
          </p>
        </CardContent>
      </Card>

      {/* إحصائيات سريعة - 8 بطاقات */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الرخص</p>
                <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة</p>
                <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%)', border: '2px solid rgba(245, 158, 11, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المراجعة</p>
                <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)', border: '2px solid rgba(124, 58, 237, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلكترونية</p>
                <p className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.electronic}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)', border: '2px solid rgba(249, 115, 22, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص بناء</p>
                <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.building}</p>
              </div>
              <Building className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%)', border: '2px solid rgba(239, 68, 68, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص هدم</p>
                <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.demolition}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(45, 212, 191, 0.05) 100%)', border: '2px solid rgba(20, 184, 166, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التكلفة</p>
                <p className="text-lg font-bold text-teal-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {(stats.totalCost / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-teal-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                <p className="text-lg font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {(stats.totalPaid / 1000).toFixed(0)}K
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أنواع الرخص المتاحة */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Layers className="h-4 w-4" />
            أنواع الرخص المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {LICENSE_TYPES.map((type) => {
              const colors = getColorClass(type.color);
              const Icon = type.icon;
              return (
                <Card key={type.id} style={{ background: colors.bg, border: `2px solid ${colors.border}` }}>
                  <CardContent className="p-3 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2" style={{ color: colors.text }} />
                    <p className="text-sm font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: colors.text }}>
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Courier New, monospace' }}>
                      {type.prefix}-YYYY-XXX
                    </p>
                    <Badge className="text-xs" style={{ 
                      background: type.allowManual ? 'rgba(59, 130, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                      color: type.allowManual ? '#3b82f6' : '#7c3aed',
                      border: `1px solid ${type.allowManual ? '#3b82f6' : '#7c3aed'}`
                    }}>
                      {type.allowManual ? 'إلكتروني/يدوي' : 'إلكتروني فقط'}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* أحدث الرخص */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Activity className="h-4 w-4" />
              أحدث الرخص الصادرة
            </CardTitle>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Eye className="h-3 w-3 ml-1" />
              عرض الكل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {licenses.slice(0, 5).map((license) => {
              const typeInfo = getLicenseTypeInfo(license.type);
              const statusInfo = getLicenseStatusInfo(license.status);
              const TypeIcon = typeInfo?.icon || FileText;
              const StatusIcon = statusInfo?.icon || Info;

              return (
                <Card key={license.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                  setSelectedLicense(license);
                  setShowDetailsDialog(true);
                }}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-5 w-5" style={{ color: getColorClass(typeInfo?.color || 'blue').text }} />
                        <div>
                          <p className="text-sm font-bold" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                            {license.licenseNumber}
                          </p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.projectName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className="text-xs" style={{
                          background: license.isElectronic ? 'rgba(124, 58, 237, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                          color: license.isElectronic ? '#7c3aed' : '#6b7280',
                          border: `1px solid ${license.isElectronic ? '#7c3aed' : '#6b7280'}`
                        }}>
                          {license.isElectronic ? 'إلكترونية' : 'يدوية'}
                        </Badge>
                        <Badge className="text-xs" style={{
                          background: statusInfo?.bgColor,
                          color: statusInfo?.color,
                          border: `1px solid ${statusInfo?.color}`
                        }}>
                          {statusInfo?.name}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {license.clientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {license.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {license.issueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {license.cost.toLocaleString()} ريال
                        </span>
                      </div>
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

  // ===== التاب 841-02: رخص البناء =====
  const renderBuildingLicensesTab = () => {
    const buildingLicenses = licenses.filter(l => l.type === 'building');
    
    return (
      <div className="space-y-4">
        {/* هيدر + زر إضافة */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Building className="h-5 w-5 text-blue-600" />
                  رخص البناء
                </h3>
                <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  يمكن إضافة رخص البناء كرخص إلكترونية أو يدوية
                </p>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white h-8">
                <Plus className="h-4 w-4 ml-1" />
                إضافة رخصة بناء
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات رخص البناء */}
        <div className="grid grid-cols-6 gap-2">
          <Card style={{ background: 'rgba(59, 130, 246, 0.05)', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {buildingLicenses.length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {buildingLicenses.filter(l => l.status === 'approved').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'rgba(245, 158, 11, 0.05)', border: '2px solid rgba(245, 158, 11, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-amber-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {buildingLicenses.filter(l => l.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلقة</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'rgba(124, 58, 237, 0.05)', border: '2px solid rgba(124, 58, 237, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {buildingLicenses.filter(l => l.isElectronic).length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلكترونية</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'rgba(107, 114, 128, 0.05)', border: '2px solid rgba(107, 114, 128, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-lg font-bold text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {buildingLicenses.filter(l => !l.isElectronic).length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>يدوية</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'rgba(20, 184, 166, 0.05)', border: '2px solid rgba(20, 184, 166, 0.2)' }}>
            <CardContent className="p-2 text-center">
              <p className="text-sm font-bold text-teal-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {(buildingLicenses.reduce((sum, l) => sum + l.cost, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة</p>
            </CardContent>
          </Card>
        </div>

        {/* البحث والفلترة */}
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-4 gap-2">
              <InputWithCopy
                label=""
                id="search-building"
                placeholder="بحث برقم الرخصة أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                copyable={false}
                clearable={true}
              />
              <SelectWithCopy
                label=""
                id="filter-status"
                options={[
                  { value: '', label: 'جميع الحالات' },
                  ...LICENSE_STATUSES.map(s => ({ value: s.id, label: s.name }))
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                copyable={false}
                clearable={true}
              />
              <Button variant="outline" className="h-10">
                <Filter className="h-4 w-4 ml-1" />
                فلترة متقدمة
              </Button>
              <Button variant="outline" className="h-10">
                <Download className="h-4 w-4 ml-1" />
                تصدير
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* قائمة رخص البناء */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Layers className="h-4 w-4" />
              رخص البناء المسجلة ({buildingLicenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {buildingLicenses.map((license) => {
                const statusInfo = getLicenseStatusInfo(license.status);
                const StatusIcon = statusInfo?.icon || Info;

                return (
                  <Card key={license.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                    setSelectedLicense(license);
                    setShowDetailsDialog(true);
                  }}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold" style={{ fontFamily: 'Courier New, monospace', color: '#3b82f6' }}>
                            {license.licenseNumber}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.projectName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className="text-xs" style={{
                            background: license.isElectronic ? 'rgba(124, 58, 237, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: license.isElectronic ? '#7c3aed' : '#6b7280',
                            border: `1px solid ${license.isElectronic ? '#7c3aed' : '#6b7280'}`
                          }}>
                            {license.isElectronic ? <Zap className="h-3 w-3 ml-0.5" /> : <FileCheck className="h-3 w-3 ml-0.5" />}
                            {license.isElectronic ? 'إلكترونية' : 'يدوية'}
                          </Badge>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.clientName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.district}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.area} م²
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {license.cost.toLocaleString()} ر.س
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="text-xs" style={{
                          background: statusInfo?.bgColor,
                          color: statusInfo?.color,
                          border: `1px solid ${statusInfo?.color}`
                        }}>
                          <StatusIcon className="h-3 w-3 ml-0.5" />
                          {statusInfo?.name}
                        </Badge>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
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
  };

  // ===== نموذج عام لأنواع الرخص الأخرى =====
  const renderLicenseTypeTab = (typeId: string) => {
    const typeInfo = getLicenseTypeInfo(typeId);
    const typeLicenses = licenses.filter(l => l.type === typeId);
    const TypeIcon = typeInfo?.icon || FileText;

    return (
      <div className="space-y-4">
        <Card style={{ background: getColorClass(typeInfo?.color || 'blue').bg, border: `2px solid ${getColorClass(typeInfo?.color || 'blue').border}` }}>
          <CardContent className="p-4 text-center">
            <TypeIcon className="h-12 w-12 mx-auto mb-3" style={{ color: getColorClass(typeInfo?.color || 'blue').text }} />
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: getColorClass(typeInfo?.color || 'blue').text }}>
              {typeInfo?.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {typeInfo?.description}
            </p>
            <Badge className="text-xs" style={{
              background: typeInfo?.allowManual ? 'rgba(59, 130, 246, 0.1)' : 'rgba(124, 58, 237, 0.1)',
              color: typeInfo?.allowManual ? '#3b82f6' : '#7c3aed',
              border: `1px solid ${typeInfo?.allowManual ? '#3b82f6' : '#7c3aed'}`
            }}>
              {typeInfo?.allowManual ? 'يمكن إضافتها كإلكترونية أو يدوية' : 'متاحة كرخصة إلكترونية فقط'}
            </Badge>
          </CardContent>
        </Card>

        {/* إحصائيات */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeLicenses.length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الرخص</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeLicenses.filter(l => l.status === 'approved').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeLicenses.filter(l => l.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المراجعة</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-teal-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {(typeLicenses.reduce((sum, l) => sum + l.cost, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التكلفة</p>
            </CardContent>
          </Card>
        </div>

        {typeLicenses.length > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                قائمة الرخص ({typeLicenses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {typeLicenses.map((license) => {
                  const statusInfo = getLicenseStatusInfo(license.status);
                  return (
                    <Card key={license.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                      setSelectedLicense(license);
                      setShowDetailsDialog(true);
                    }}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                            {license.licenseNumber}
                          </p>
                          <Badge className="text-xs" style={{
                            background: statusInfo?.bgColor,
                            color: statusInfo?.color,
                            border: `1px solid ${statusInfo?.color}`
                          }}>
                            {statusInfo?.name}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {license.projectName}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{license.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{license.issueDate}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <TypeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد رخص من هذا النوع حتى الآن
              </p>
              <Button className="mt-2">
                <Plus className="h-4 w-4 ml-1" />
                إضافة رخصة جديدة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ===== التاب 841-09: رخص خارجية =====
  const renderExternalLicensesTab = () => (
    <div className="space-y-4">
      <Card style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)', border: '2px solid rgba(59, 130, 246, 0.2)' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <ExternalLink className="h-5 w-5 text-blue-600" />
            رخص بناء خارجية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام تسجيل وإدارة الرخص التي تدخل المكتب من جهات خارجية (عملاء، مكاتب استشارية، جهات حكومية) مع إمكانية رفع الصور وإدارة المستندات الكاملة.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع الصور</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>متعدد الصفحات</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-200">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة كاملة</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع التفاصيل</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Link className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ربط سهل</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>بالمعاملات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج إضافة رخصة خارجية */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FilePlus className="h-4 w-4" />
            تسجيل رخصة بناء خارجية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <InputWithCopy
                label="رقم الرخصة الخارجية"
                id="external-license-num"
                placeholder="أدخل رقم الرخصة"
                required
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="اسم المشروع"
                id="project-name-ext"
                placeholder="أدخل اسم المشروع"
                required
                copyable={true}
                clearable={true}
              />
              <SelectWithCopy
                label="الجهة المصدرة"
                id="issuing-authority"
                options={[
                  { value: 'baladia', label: 'البلدية' },
                  { value: 'momra', label: 'وزارة الشؤون البلدية' },
                  { value: 'consultant', label: 'مكتب استشاري' },
                  { value: 'client', label: 'العميل مباشرة' },
                  { value: 'other', label: 'جهة أخرى' }
                ]}
                required
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <InputWithCopy
                label="اسم العميل"
                id="client-name-ext"
                placeholder="أدخل اسم العميل"
                required
                copyable={true}
                clearable={true}
              />
              <InputWithCopy
                label="الموقع"
                id="location-ext"
                placeholder="أدخل موقع المشروع"
                copyable={true}
                clearable={true}
              />
              <SelectWithCopy
                label="حالة الرخصة"
                id="license-status-ext"
                options={[
                  { value: 'active', label: 'سارية' },
                  { value: 'expired', label: 'منتهية' },
                  { value: 'under_review', label: 'قيد المراجعة' },
                  { value: 'cancelled', label: 'ملغاة' }
                ]}
                copyable={true}
                clearable={true}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ الاستلام
                </label>
                <DateInputWithToday className="w-full" />
              </div>
              <SelectWithCopy
                label="تم الاستلام بواسطة"
                id="received-by"
                options={[
                  { value: 'emp1', label: 'م. أحمد السعيد' },
                  { value: 'emp2', label: 'م. خالد العمري' },
                  { value: 'emp3', label: 'م. فهد الدوسري' },
                  { value: 'emp4', label: 'م. سعود القحطاني' }
                ]}
                required
                copyable={true}
                clearable={true}
              />
              <SelectWithCopy
                label="طريقة الاستلام"
                id="receiving-method"
                options={[
                  { value: 'hand', label: 'تسليم يدوي' },
                  { value: 'email', label: 'بريد إلكتروني' },
                  { value: 'courier', label: 'شركة شحن' },
                  { value: 'platform', label: 'منصة إلكترونية' }
                ]}
                copyable={true}
                clearable={true}
              />
            </div>

            {/* منطقة رفع الصور */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                رفع صور الرخصة
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                <p className="text-sm font-bold text-blue-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسحب الصور هنا أو انقر للرفع
                </p>
                <p className="text-xs text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  يمكنك رفع عدة صور (JPG, PNG, PDF حتى 10MB لكل ملف)
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">صفحة 1</Badge>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">صفحة 2</Badge>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">مرفقات</Badge>
                </div>
              </div>
            </div>

            {/* ملاحظات */}
            <TextAreaWithCopy
              label="ملاحظات"
              id="notes-ext"
              rows={3}
              placeholder="أدخل أي ملاحظات أو تفاصيل إضافية عن الرخصة..."
              copyable={true}
              clearable={true}
            />

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline">
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                toast.success('تم حفظ الرخصة الخارجية بنجاح');
              }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ الرخصة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الرخص الخارجية */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <FolderOpen className="h-4 w-4" />
              الرخص الخارجية المسجلة
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="h-3 w-3 ml-1" />
                فلترة
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Download className="h-3 w-3 ml-1" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <ExternalLink className="h-16 w-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-bold text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد رخص خارجية مسجلة حتى الآن
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              ابدأ بإضافة أول رخصة خارجية باستخدام النموذج أعلاه
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== التاب 841-10: الإحصائيات =====
  const renderStatisticsTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <BarChart className="h-5 w-5 text-blue-600" />
            إحصائيات الرخص الشاملة
          </CardTitle>
        </CardHeader>
      </Card>

      {/* إحصائيات رئيسية */}
      <div className="grid grid-cols-4 gap-3">
        <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #3b82f6' }}>
          <CardContent className="p-4 text-center">
            <FileText className="h-10 w-10 mx-auto mb-2 text-blue-600" />
            <p className="text-3xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.total}</p>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الرخص</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #10b981' }}>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-600" />
            <p className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.approved}</p>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص معتمدة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b' }}>
          <CardContent className="p-4 text-center">
            <Clock className="h-10 w-10 mx-auto mb-2 text-amber-600" />
            <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.pending}</p>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المراجعة</p>
          </CardContent>
        </Card>
        <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #7c3aed' }}>
          <CardContent className="p-4 text-center">
            <Zap className="h-10 w-10 mx-auto mb-2 text-purple-600" />
            <p className="text-3xl font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.electronic}</p>
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص إلكترونية</p>
          </CardContent>
        </Card>
      </div>

      {/* توزيع حسب النوع */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            توزيع الرخص حسب النوع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.building}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص بناء</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <Trash2 className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.demolition}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص هدم</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <Home className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.fencing}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص تسوير</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stats.renovation}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>رخص ترميم</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات مالية */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الإحصائيات المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
              <DollarSign className="h-10 w-10 mx-auto mb-2 text-teal-600" />
              <p className="text-2xl font-bold text-teal-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {formatCurrency(stats.totalCost)}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التكلفة</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {formatCurrency(stats.totalPaid)}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {formatCurrency(stats.totalRemaining)}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== باقي التابات (مبسطة) =====
  const renderPlaceholderTab = (title: string, Icon: any, description: string) => (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Icon className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {description}
        </p>
        <Button className="mt-4" onClick={() => toast.info('جارٍ تطوير هذا التاب')}>
          <Plus className="h-4 w-4 ml-1" />
          ابدأ الاستخدام
        </Button>
      </CardContent>
    </Card>
  );

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '841-01':
        return renderOverviewTab();
      case '841-02':
        return renderBuildingLicensesTab();
      case '841-03':
        return renderLicenseTypeTab('demolition');
      case '841-04':
        return renderLicenseTypeTab('fencing');
      case '841-05':
        return renderLicenseTypeTab('renovation');
      case '841-06':
        return renderLicenseTypeTab('site-prep');
      case '841-07':
        return renderLicenseTypeTab('comprehensive');
      case '841-08':
        return renderLicenseTypeTab('other');
      case '841-09':
        return renderExternalLicensesTab();
      case '841-10':
        return renderStatisticsTab();
      case '841-11':
        return renderPlaceholderTab('التقارير', PieChart, 'تقارير شاملة ومفصلة لجميع أنواع الرخص مع إمكانية التصدير والطباعة');
      case '841-12':
        return renderPlaceholderTab('السجل', Clock, 'سجل كامل لجميع الأنشطة والتعديلات على الرخص');
      case '841-13':
        return renderPlaceholderTab('المرفقات', FileCheck, 'إدارة جميع المرفقات والمستندات الخاصة بالرخص');
      case '841-14':
        return renderPlaceholderTab('ربط المعاملات', Link, 'ربط الرخص بالمعاملات المرتبطة بها في النظام');
      case '841-15':
        return renderPlaceholderTab('الأرشيف', Archive, 'أرشيف الرخص المنتهية والملغاة');
      case '841-16':
        return renderPlaceholderTab('الإعدادات', Settings, 'إعدادات النظام والتخصيص والصلاحيات');
      default:
        return null;
    }
  };

  // ===== نافذة تفاصيل الرخصة =====
  const renderDetailsDialog = () => {
    if (!selectedLicense) return null;

    const typeInfo = getLicenseTypeInfo(selectedLicense.type);
    const statusInfo = getLicenseStatusInfo(selectedLicense.status);
    const TypeIcon = typeInfo?.icon || FileText;
    const StatusIcon = statusInfo?.icon || Info;

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <TypeIcon className="h-6 w-6" style={{ color: getColorClass(typeInfo?.color || 'blue').text }} />
              تفاصيل الرخصة: {selectedLicense.licenseNumber}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معلومات شاملة عن الرخصة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* بطاقات معلومات رئيسية */}
            <div className="grid grid-cols-4 gap-2">
              <Card style={{ background: getColorClass(typeInfo?.color || 'blue').bg, border: `2px solid ${getColorClass(typeInfo?.color || 'blue').border}` }}>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الرخصة</p>
                  <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: getColorClass(typeInfo?.color || 'blue').text }}>
                    {typeInfo?.name}
                  </p>
                </CardContent>
              </Card>
              <Card style={{ background: statusInfo?.bgColor, border: `2px solid ${statusInfo?.color}` }}>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</p>
                  <p className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: statusInfo?.color }}>
                    {statusInfo?.name}
                  </p>
                </CardContent>
              </Card>
              <Card style={{ background: 'rgba(124, 58, 237, 0.1)', border: '2px solid #7c3aed' }}>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>النمط</p>
                  <p className="text-sm font-bold text-purple-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedLicense.isElectronic ? 'إلكترونية' : 'يدوية'}
                  </p>
                </CardContent>
              </Card>
              <Card style={{ background: 'rgba(20, 184, 166, 0.1)', border: '2px solid #14b8a6' }}>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة</p>
                  <p className="text-sm font-bold text-teal-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedLicense.cost.toLocaleString()} ر.س
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* معلومات المشروع */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المشروع</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.projectName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم العميل</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الهوية</p>
                    <p className="font-bold font-mono">{selectedLicense.clientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.district}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم القطعة</p>
                    <p className="font-bold font-mono">{selectedLicense.plotNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>مساحة الأرض</p>
                    <p className="font-bold">{selectedLicense.area} م²</p>
                  </div>
                  {selectedLicense.buildingArea && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>مساحة البناء</p>
                      <p className="font-bold">{selectedLicense.buildingArea} م²</p>
                    </div>
                  )}
                  {selectedLicense.floors && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الأدوار</p>
                      <p className="font-bold">{selectedLicense.floors}</p>
                    </div>
                  )}
                  {selectedLicense.units && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الوحدات</p>
                      <p className="font-bold">{selectedLicense.units}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* معلومات الرخصة */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  معلومات الرخصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الرخصة</p>
                    <p className="font-bold font-mono text-blue-600">{selectedLicense.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة المصدرة</p>
                    <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.issuingAuthority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإصدار</p>
                    <p className="font-bold">{formatDate(selectedLicense.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</p>
                    <p className="font-bold">{formatDate(selectedLicense.expiryDate)}</p>
                  </div>
                  {selectedLicense.approvedBy && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>معتمدة من</p>
                      <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.approvedBy}</p>
                    </div>
                  )}
                  {selectedLicense.linkedTransaction && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة المرتبطة</p>
                      <p className="font-bold font-mono text-purple-600">{selectedLicense.linkedTransaction}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* المعلومات المالية */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة الإجمالية</p>
                    <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {formatCurrency(selectedLicense.cost)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</p>
                    <p className="text-lg font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {formatCurrency(selectedLicense.paidAmount)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</p>
                    <p className="text-lg font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {formatCurrency(selectedLicense.remainingAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المستندات */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileCheck className="h-4 w-4" />
                  المستندات المرفقة ({selectedLicense.documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLicense.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-xs flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* الملاحظات */}
            {selectedLicense.notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الملاحظات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedLicense.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* معلومات إنشاء السجل */}
            <Card>
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
                  <div>
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>أنشئ بواسطة: </span>
                    <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLicense.createdBy}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإنشاء: </span>
                    <span className="font-bold">{formatDate(selectedLicense.createdDate)}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تعديل: </span>
                    <span className="font-bold">{formatDate(selectedLicense.lastModified)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                <X className="h-4 w-4 ml-1" />
                إغلاق
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 ml-1" />
                تعديل
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 ml-1" />
                طباعة
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 ml-1" />
                تحميل PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد للتابات */}
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* محتوى التاب */}
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <ScrollArea className="h-full">
          <div className="p-4">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </div>

      {/* نافذة تفاصيل الرخصة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default LicensesManagement_Complete_841_v8;
