/**
 * الشاشة 946 - الأصول الرقمية
 * ===========================================================================
 * 
 * نظام شامل لإدارة تراخيص البرمجيات والأصول الرقمية
 * 
 * المميزات:
 * - إدارة تراخيص البرمجيات (محلية وكلاود)
 * - جميع أنواع البرمجيات (هندسية، عامة، حماية، إنتاجية)
 * - رموز التفعيل مشفرة مع صلاحيات
 * - تنبيهات انتهاء الصلاحية
 * - أسعار متعددة العملات
 * - تتبع التجديدات والتكاليف
 * - سجل شامل للأصول
 * 
 * 🔒 معلومات حساسة - رموز التفعيل مشفرة
 * 
 * @version 1.0
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
import {
  Key, Lock, Unlock, Shield, Cloud, HardDrive, Code, FileCode,
  Wrench, Package, Download, Calendar, DollarSign, AlertTriangle,
  CheckCircle, Eye, EyeOff, Copy, Plus, Edit, Save, RefreshCw,
  Bell, TrendingUp, BarChart3, Settings, Archive, Star, Award,
  Globe, Cpu, Database, Server, Briefcase, CreditCard, Zap, XCircle,
  Wallet
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

// ===== واجهات البيانات =====

interface DigitalAsset {
  id: string;
  assetNumber: string;
  name: string;
  vendor: string;
  category: 'هندسية' | 'عامة' | 'حماية' | 'إنتاجية' | 'تصميم' | 'إدارة';
  type: 'محلي' | 'كلاود' | 'هجين';
  licenses: number;
  purchaseDate: string;
  expiryDate: string;
  renewalDate: string;
  status: 'نشط' | 'منتهي' | 'قريب الانتهاء' | 'معلق';
  activationKey?: string;
  isKeyVisible: boolean;
  purchasePrice: number;
  purchaseCurrency: string;
  renewalPrice: number;
  renewalCurrency: string;
  annualCost: number;
  department: string;
  assignedTo: string[];
  notes: string;
}

interface AssetRenewal {
  id: string;
  assetId: string;
  assetName: string;
  renewalDate: string;
  previousExpiryDate: string;
  newExpiryDate: string;
  cost: number;
  currency: string;
  paidBy: string;
  paymentMethod: string;
  invoiceNumber: string;
  status: 'مكتمل' | 'قيد المعالجة' | 'مجدول';
}

const DigitalAssetsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('946-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [keyVisibility, setKeyVisibility] = useState<Record<string, boolean>>({});

  const TABS_CONFIG = [
    { id: '946-01', number: '946-01', title: 'نظرة عامة', icon: Package },
    { id: '946-02', number: '946-02', title: 'البرمجيات الهندسية', icon: Wrench },
    { id: '946-03', number: '946-03', title: 'البرمجيات العامة', icon: Code },
    { id: '946-04', number: '946-04', title: 'برامج الحماية', icon: Shield },
    { id: '946-05', number: '946-05', title: 'برامج الإنتاجية', icon: Briefcase },
    { id: '946-06', number: '946-06', title: 'برامج التصميم', icon: FileCode },
    { id: '946-07', number: '946-07', title: 'الأصول السحابية', icon: Cloud },
    { id: '946-08', number: '946-08', title: 'الأصول المحلية', icon: HardDrive },
    { id: '946-09', number: '946-09', title: 'التجديدات', icon: RefreshCw },
    { id: '946-10', number: '946-10', title: 'التكاليف والموازنة', icon: DollarSign },
    { id: '946-11', number: '946-11', title: 'التنبيهات والإشعارات', icon: Bell },
    { id: '946-12', number: '946-12', title: 'رموز التفعيل', icon: Key },
    { id: '946-13', number: '946-13', title: 'سجل الأصول', icon: Archive },
    { id: '946-14', number: '946-14', title: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '946-15', number: '946-15', title: 'الإعدادات والصلاحيات', icon: Settings },
  ];

  // بيانات الأصول الرقمية
  const digitalAssets: DigitalAsset[] = useMemo(() => [
    // البرمجيات الهندسية
    {
      id: 'DA001',
      assetNumber: 'DA-2024-001',
      name: 'AutoCAD 2024',
      vendor: 'Autodesk',
      category: 'هندسية',
      type: 'محلي',
      licenses: 15,
      purchaseDate: '2024-01-15',
      expiryDate: '2025-01-14',
      renewalDate: '2024-12-15',
      status: 'قريب الانتهاء',
      activationKey: 'ACAD-2024-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 75000,
      purchaseCurrency: 'SAR',
      renewalPrice: 70000,
      renewalCurrency: 'SAR',
      annualCost: 70000,
      department: 'الهندسة',
      assignedTo: ['المهندسون', 'المصممون'],
      notes: 'ترخيص شبكي لـ 15 مستخدم متزامن',
    },
    {
      id: 'DA002',
      assetNumber: 'DA-2024-002',
      name: 'Revit 2024',
      vendor: 'Autodesk',
      category: 'هندسية',
      type: 'محلي',
      licenses: 10,
      purchaseDate: '2024-02-01',
      expiryDate: '2025-02-01',
      renewalDate: '2025-01-01',
      status: 'نشط',
      activationKey: 'RVIT-2024-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 65000,
      purchaseCurrency: 'SAR',
      renewalPrice: 60000,
      renewalCurrency: 'SAR',
      annualCost: 60000,
      department: 'الهندسة',
      assignedTo: ['مهندسو BIM'],
      notes: 'ترخيص BIM متقدم',
    },
    {
      id: 'DA003',
      assetNumber: 'DA-2024-003',
      name: 'SAP2000 v25',
      vendor: 'CSI',
      category: 'هندسية',
      type: 'محلي',
      licenses: 5,
      purchaseDate: '2023-11-20',
      expiryDate: '2024-11-19',
      renewalDate: '2024-10-20',
      status: 'قريب الانتهاء',
      activationKey: 'SAP2-2025-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 8500,
      purchaseCurrency: 'USD',
      renewalPrice: 7500,
      renewalCurrency: 'USD',
      annualCost: 28125,
      department: 'الهندسة الإنشائية',
      assignedTo: ['المهندسون الإنشائيون'],
      notes: 'برنامج تحليل إنشائي',
    },
    {
      id: 'DA004',
      assetNumber: 'DA-2024-004',
      name: 'Civil 3D 2024',
      vendor: 'Autodesk',
      category: 'هندسية',
      type: 'محلي',
      licenses: 8,
      purchaseDate: '2024-03-10',
      expiryDate: '2025-03-10',
      renewalDate: '2025-02-10',
      status: 'نشط',
      activationKey: 'C3D-2024-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 55000,
      purchaseCurrency: 'SAR',
      renewalPrice: 50000,
      renewalCurrency: 'SAR',
      annualCost: 50000,
      department: 'الهندسة المدنية',
      assignedTo: ['مهندسو الطرق'],
      notes: 'تصميم البنية التحتية',
    },

    // البرمجيات العامة
    {
      id: 'DA010',
      assetNumber: 'DA-2024-010',
      name: 'Microsoft 365 Business',
      vendor: 'Microsoft',
      category: 'عامة',
      type: 'كلاود',
      licenses: 50,
      purchaseDate: '2024-01-01',
      expiryDate: '2025-01-01',
      renewalDate: '2024-12-01',
      status: 'قريب الانتهاء',
      activationKey: 'M365-BUSI-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 2500,
      purchaseCurrency: 'USD',
      renewalPrice: 2500,
      renewalCurrency: 'USD',
      annualCost: 9375,
      department: 'الجميع',
      assignedTo: ['جميع الموظفين'],
      notes: 'اشتراك سنوي 50 مستخدم',
    },
    {
      id: 'DA011',
      assetNumber: 'DA-2024-011',
      name: 'Adobe Creative Cloud',
      vendor: 'Adobe',
      category: 'تصميم',
      type: 'كلاود',
      licenses: 12,
      purchaseDate: '2024-02-15',
      expiryDate: '2025-02-15',
      renewalDate: '2025-01-15',
      status: 'نشط',
      activationKey: 'ADBE-CC-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 7200,
      purchaseCurrency: 'USD',
      renewalPrice: 7200,
      renewalCurrency: 'USD',
      annualCost: 27000,
      department: 'التصميم',
      assignedTo: ['المصممون', 'التسويق'],
      notes: 'كامل برامج Adobe',
    },

    // برامج الحماية
    {
      id: 'DA020',
      assetNumber: 'DA-2024-020',
      name: 'Kaspersky Endpoint Security',
      vendor: 'Kaspersky',
      category: 'حماية',
      type: 'محلي',
      licenses: 75,
      purchaseDate: '2024-04-01',
      expiryDate: '2025-04-01',
      renewalDate: '2025-03-01',
      status: 'نشط',
      activationKey: 'KASP-END-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 15000,
      purchaseCurrency: 'SAR',
      renewalPrice: 13500,
      renewalCurrency: 'SAR',
      annualCost: 13500,
      department: 'تقنية المعلومات',
      assignedTo: ['جميع الأجهزة'],
      notes: 'حماية متقدمة للشبكة',
    },
    {
      id: 'DA021',
      assetNumber: 'DA-2024-021',
      name: 'Fortinet FortiGate',
      vendor: 'Fortinet',
      category: 'حماية',
      type: 'هجين',
      licenses: 1,
      purchaseDate: '2023-06-15',
      expiryDate: '2026-06-15',
      renewalDate: '2026-05-15',
      status: 'نشط',
      activationKey: 'FGVM-XXXX-XXXX-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 120000,
      purchaseCurrency: 'SAR',
      renewalPrice: 35000,
      renewalCurrency: 'SAR',
      annualCost: 35000,
      department: 'تقنية المعلومات',
      assignedTo: ['أمن المعلومات'],
      notes: 'جدار ناري متقدم - ترخيص 3 سنوات',
    },

    // برامج الإنتاجية
    {
      id: 'DA030',
      assetNumber: 'DA-2024-030',
      name: 'Monday.com Team',
      vendor: 'Monday.com',
      category: 'إدارة',
      type: 'كلاود',
      licenses: 30,
      purchaseDate: '2024-05-01',
      expiryDate: '2025-05-01',
      renewalDate: '2025-04-01',
      status: 'نشط',
      activationKey: 'MNDY-TEAM-XXXX-XXXX',
      isKeyVisible: false,
      purchasePrice: 3600,
      purchaseCurrency: 'USD',
      renewalPrice: 3600,
      renewalCurrency: 'USD',
      annualCost: 13500,
      department: 'إدارة المشاريع',
      assignedTo: ['مديرو المشاريع', 'المنسقون'],
      notes: 'إدارة المشاريع والمهام',
    },
  ], []);

  // سجل التجديدات
  const assetRenewals: AssetRenewal[] = useMemo(() => [
    {
      id: 'REN001',
      assetId: 'DA001',
      assetName: 'AutoCAD 2024',
      renewalDate: '2024-01-15',
      previousExpiryDate: '2024-01-14',
      newExpiryDate: '2025-01-14',
      cost: 70000,
      currency: 'SAR',
      paidBy: 'إدارة المالية',
      paymentMethod: 'تحويل بنكي',
      invoiceNumber: 'INV-2024-001',
      status: 'مكتمل',
    },
    {
      id: 'REN002',
      assetId: 'DA010',
      assetName: 'Microsoft 365 Business',
      renewalDate: '2024-01-01',
      previousExpiryDate: '2024-01-01',
      newExpiryDate: '2025-01-01',
      cost: 2500,
      currency: 'USD',
      paidBy: 'إدارة المالية',
      paymentMethod: 'بطاقة ائتمان',
      invoiceNumber: 'MSFT-2024-365',
      status: 'مكتمل',
    },
    {
      id: 'REN003',
      assetId: 'DA003',
      assetName: 'SAP2000 v25',
      renewalDate: '2024-11-01',
      previousExpiryDate: '2024-11-19',
      newExpiryDate: '2025-11-19',
      cost: 7500,
      currency: 'USD',
      paidBy: 'قسم الهندسة',
      paymentMethod: 'تحويل دولي',
      invoiceNumber: 'CSI-2024-SAP',
      status: 'مجدول',
    },
  ], []);

  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  // تبديل ظهور مفتاح التفعيل
  const toggleKeyVisibility = (assetId: string) => {
    setKeyVisibility(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  const renderTabContent = () => {
    // تاب 946-01: نظرة عامة
    if (activeTab === '946-01') {
      const totalAssets = digitalAssets.length;
      const activeAssets = digitalAssets.filter(a => a.status === 'نشط').length;
      const expiringSoon = digitalAssets.filter(a => a.status === 'قريب الانتهاء').length;
      const expiredAssets = digitalAssets.filter(a => a.status === 'منتهي').length;
      const totalAnnualCost = digitalAssets.reduce((sum, a) => sum + a.annualCost, 0);
      const cloudAssets = digitalAssets.filter(a => a.type === 'كلاود').length;
      const localAssets = digitalAssets.filter(a => a.type === 'محلي').length;
      const totalLicenses = digitalAssets.reduce((sum, a) => sum + a.licenses, 0);

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                نظرة عامة على الأصول الرقمية
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة شاملة لتراخيص البرمجيات والأصول الرقمية
              </p>
            </div>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-3.5 w-3.5 ml-2" />
              أصل جديد
            </Button>
          </div>

          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الأصول
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalAssets}
                    </p>
                  </div>
                  <Package className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نشطة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {activeAssets}
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
                      قريبة الانتهاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {expiringSoon}
                    </p>
                  </div>
                  <AlertTriangle className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      منتهية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {expiredAssets}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      سحابية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {cloudAssets}
                    </p>
                  </div>
                  <Cloud className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      محلية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {localAssets}
                    </p>
                  </div>
                  <HardDrive className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      التراخيص
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalLicenses}
                    </p>
                  </div>
                  <Key className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      التكلفة السنوية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalAnnualCost / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <DollarSign className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الأصول حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableBody>
                    {['هندسية', 'عامة', 'حماية', 'إنتاجية', 'تصميم', 'إدارة'].map((category) => {
                      const count = digitalAssets.filter(a => a.category === category).length;
                      return (
                        <TableRow key={category}>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {category}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                            {count}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التنبيهات القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {digitalAssets
                    .filter(a => a.status === 'قريب الانتهاء')
                    .slice(0, 5)
                    .map((asset) => {
                      const daysLeft = Math.floor((new Date(asset.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={asset.id} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                              {asset.name}
                            </span>
                            <Badge className="bg-yellow-600 text-white text-[10px]">
                              {daysLeft} يوم
                            </Badge>
                          </div>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                            ينتهي في {asset.expiryDate}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 946-12: رموز التفعيل
    if (activeTab === '946-12') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                رموز التفعيل
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                معلومات سرية للغاية - صلاحيات محدودة
              </p>
            </div>
            <Badge className="bg-red-600 text-white">
              <Lock className="h-3 w-3 ml-1" />
              سري للغاية
            </Badge>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البرنامج</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشركة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رمز التفعيل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digitalAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {asset.name}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {asset.vendor}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span 
                            className="text-xs" 
                            style={{ 
                              fontFamily: 'Courier New, monospace',
                              filter: keyVisibility[asset.id] ? 'none' : 'blur(4px)'
                            }}
                          >
                            {asset.activationKey}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="dense-button"
                            onClick={() => toggleKeyVisibility(asset.id)}
                          >
                            {keyVisibility[asset.id] ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="dense-button"
                            onClick={() => {
                              copyToClipboard(asset.activationKey || '');
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.licenses}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dense-button"
                          onClick={() => {
                            setSelectedAsset(asset);
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

    // تاب 946-10: التكاليف والموازنة
    if (activeTab === '946-10') {
      const totalCostSAR = digitalAssets
        .filter(a => a.renewalCurrency === 'SAR')
        .reduce((sum, a) => sum + a.renewalPrice, 0);
      const totalCostUSD = digitalAssets
        .filter(a => a.renewalCurrency === 'USD')
        .reduce((sum, a) => sum + a.renewalPrice, 0);
      const totalCostSAREquivalent = totalCostSAR + (totalCostUSD * 3.75);

      return (
        <div className="space-y-2">
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التكاليف والموازنة
          </h3>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي (ريال)
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCostSAR / 1000).toFixed(0)}K
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
                      إجمالي (دولار)
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      ${(totalCostUSD / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <Globe className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      المعادل بالريال
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCostSAREquivalent / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <CreditCard className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط التكلفة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCostSAREquivalent / digitalAssets.length / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الموازنة المتبقية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      125K
                    </p>
                  </div>
                  <Wallet className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      68%
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التكاليف بالتفصيل
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البرنامج</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>سعر الشراء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>سعر التجديد</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة السنوية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digitalAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {asset.name}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.purchasePrice.toLocaleString()} {asset.purchaseCurrency}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.renewalPrice.toLocaleString()} {asset.renewalCurrency}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.annualCost.toLocaleString()} ريال
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

    // باقي التابات - عرض عام
    const categoryAssets = digitalAssets.filter(a => {
      if (activeTab === '946-02') return a.category === 'هندسية';
      if (activeTab === '946-03') return a.category === 'عامة';
      if (activeTab === '946-04') return a.category === 'حماية';
      if (activeTab === '946-05') return a.category === 'إنتاجية';
      if (activeTab === '946-06') return a.category === 'تصميم';
      if (activeTab === '946-07') return a.type === 'كلاود';
      if (activeTab === '946-08') return a.type === 'محلي';
      return true;
    });

    return (
      <div className="space-y-2">
        <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {currentTab?.title}
        </h3>

        <Card className="card-rtl">
          <CardContent className="dense-card-content">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشركة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAssets.map((asset) => {
                  const daysLeft = Math.floor((new Date(asset.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.assetNumber}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {asset.name}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {asset.vendor}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.licenses}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {asset.expiryDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Badge className={
                            asset.status === 'نشط' ? 'bg-green-100 text-green-700' :
                            asset.status === 'قريب الانتهاء' ? 'bg-yellow-100 text-yellow-700' :
                            asset.status === 'منتهي' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {asset.status}
                          </Badge>
                          {daysLeft > 0 && daysLeft < 90 && (
                            <Badge className="bg-orange-100 text-orange-700 text-[10px]">
                              {daysLeft}د
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="dense-button"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              الأصول الرقمية
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إدارة شاملة لتراخيص البرمجيات والأصول الرقمية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white">
              <Key className="h-3 w-3 ml-1" />
              محمي
            </Badge>
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-946
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
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

      {/* نافذة إضافة أصل جديد */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إضافة أصل رقمي جديد
            </DialogTitle>
          </DialogHeader>

          <div className="form-rtl form-dense space-y-3">
            <div className="grid grid-cols-3 dense-grid">
              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم البرنامج *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="مثال: AutoCAD 2024"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشركة المطورة *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="مثال: Autodesk"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="هندسية">هندسية</SelectItem>
                    <SelectItem value="عامة">عامة</SelectItem>
                    <SelectItem value="حماية">حماية</SelectItem>
                    <SelectItem value="إنتاجية">إنتاجية</SelectItem>
                    <SelectItem value="تصميم">تصميم</SelectItem>
                    <SelectItem value="إدارة">إدارة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  النوع *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="محلي">محلي</SelectItem>
                    <SelectItem value="كلاود">كلاود</SelectItem>
                    <SelectItem value="هجين">هجين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  عدد التراخيص *
                </Label>
                <Input
                  type="number"
                  className="dense-input"
                  placeholder="10"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ الشراء *
                </Label>
                <Input
                  type="date"
                  className="dense-input"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تاريخ الانتهاء *
                </Label>
                <Input
                  type="date"
                  className="dense-input"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سعر الشراء *
                </Label>
                <Input
                  type="number"
                  className="dense-input"
                  placeholder="50000"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العملة *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي</SelectItem>
                    <SelectItem value="USD">دولار أمريكي</SelectItem>
                    <SelectItem value="EUR">يورو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                رمز التفعيل
              </Label>
              <Input
                className="dense-input"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                style={{ fontFamily: 'Courier New, monospace' }}
              />
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ملاحظات
              </Label>
              <Textarea
                className="dense-input"
                rows={2}
                placeholder="أي ملاحظات إضافية..."
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
              onClick={() => setShowAddDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل الأصل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل الأصل الرقمي
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedAsset?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-3">
              <Card className="bg-blue-50 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الرقم
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedAsset.assetNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الشركة
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        {selectedAsset.vendor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        التراخيص
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedAsset.licenses}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الحالة
                      </p>
                      <Badge className={
                        selectedAsset.status === 'نشط' ? 'bg-green-100 text-green-700' :
                        selectedAsset.status === 'قريب الانتهاء' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {selectedAsset.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التواريخ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          تاريخ الشراء
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.purchaseDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          تاريخ الانتهاء
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          موعد التجديد
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.renewalDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      التكاليف
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          سعر الشراء
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.purchasePrice.toLocaleString()} {selectedAsset.purchaseCurrency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          سعر التجديد
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.renewalPrice.toLocaleString()} {selectedAsset.renewalCurrency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          التكلفة السنوية
                        </p>
                        <p className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedAsset.annualCost.toLocaleString()} ريال
                        </p>
                      </div>
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
    </div>
  );
};

export default DigitalAssetsScreen;
