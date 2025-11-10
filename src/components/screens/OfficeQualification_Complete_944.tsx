/**
 * الشاشة 944 - تأهيل المكتب لدى الجهات
 * ===========================================================================
 * 
 * إدارة شاملة لتأهيل المكتب لدى الجهات الحكومية والخاصة
 * 
 * المميزات:
 * - تأهيل لدى كل جهة حكومية
 * - تتبع تواريخ التأهيل والتجديد
 * - إدارة المتطلبات والوثائق
 * - تنبيهات انتهاء الصلاحية
 * - متابعة الحالة والتقدم
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
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import {
  Building2, FileCheck, Calendar, AlertTriangle, CheckCircle,
  Clock, Upload, Download, Plus, RefreshCw, Bell, Award,
  Shield, Briefcase, Landmark, Home, Construction, Zap,
  Users, FileText, Settings, Archive, Star
} from 'lucide-react';

interface Qualification {
  id: string;
  entity: string;
  qualificationNumber: string;
  status: 'نشط' | 'قيد التجديد' | 'منتهي' | 'معلق';
  startDate: string;
  expiryDate: string;
  renewalDate: string;
  requirementsTotal: number;
  requirementsMet: number;
  lastUpdate: string;
  costAnnual: number;
  category: string;
}

const OfficeQualificationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('944-01');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS_CONFIG = [
    { id: '944-01', number: '944-01', title: 'نظرة عامة', icon: Award, entity: null },
    { id: '944-02', number: '944-02', title: 'وزارة الشؤون البلدية', icon: Building2, entity: 'وزارة الشؤون البلدية' },
    { id: '944-03', number: '944-03', title: 'هيئة المهندسين السعوديين', icon: Users, entity: 'هيئة المهندسين' },
    { id: '944-04', number: '944-04', title: 'وزارة الإسكان', icon: Home, entity: 'وزارة الإسكان' },
    { id: '944-05', number: '944-05', title: 'الهيئة الملكية', icon: Landmark, entity: 'الهيئة الملكية' },
    { id: '944-06', number: '944-06', title: 'أمانة المنطقة', icon: Building2, entity: 'الأمانة' },
    { id: '944-07', number: '944-07', title: 'الدفاع المدني', icon: Shield, entity: 'الدفاع المدني' },
    { id: '944-08', number: '944-08', title: 'هيئة الكهرباء', icon: Zap, entity: 'هيئة الكهرباء' },
    { id: '944-09', number: '944-09', title: 'المقاولون والمطورون', icon: Construction, entity: 'القطاع الخاص' },
    { id: '944-10', number: '944-10', title: 'الجهات الدولية', icon: Award, entity: 'دولية' },
    { id: '944-11', number: '944-11', title: 'سجل التأهيلات', icon: Archive, entity: null },
    { id: '944-12', number: '944-12', title: 'الإعدادات والتنبيهات', icon: Settings, entity: null },
  ];

  const qualifications: Qualification[] = useMemo(() => [
    {
      id: 'Q001',
      entity: 'وزارة الشؤون البلدية',
      qualificationNumber: 'MUN-2024-8745',
      status: 'نشط',
      startDate: '2024-01-15',
      expiryDate: '2026-01-14',
      renewalDate: '2025-10-15',
      requirementsTotal: 12,
      requirementsMet: 12,
      lastUpdate: '2024-01-15',
      costAnnual: 15000,
      category: 'حكومي',
    },
    {
      id: 'Q002',
      entity: 'هيئة المهندسين السعوديين',
      qualificationNumber: 'SCE-2023-4521',
      status: 'نشط',
      startDate: '2023-06-01',
      expiryDate: '2025-05-31',
      renewalDate: '2025-03-01',
      requirementsTotal: 15,
      requirementsMet: 15,
      lastUpdate: '2023-06-01',
      costAnnual: 25000,
      category: 'حكومي',
    },
    {
      id: 'Q003',
      entity: 'وزارة الإسكان',
      qualificationNumber: 'MOH-2024-9876',
      status: 'نشط',
      startDate: '2024-03-20',
      expiryDate: '2026-03-19',
      renewalDate: '2025-12-20',
      requirementsTotal: 10,
      requirementsMet: 10,
      lastUpdate: '2024-03-20',
      costAnnual: 18000,
      category: 'حكومي',
    },
    {
      id: 'Q004',
      entity: 'الهيئة الملكية',
      qualificationNumber: 'RC-2024-3214',
      status: 'قيد التجديد',
      startDate: '2022-09-10',
      expiryDate: '2024-09-09',
      renewalDate: '2024-06-10',
      requirementsTotal: 18,
      requirementsMet: 14,
      lastUpdate: '2024-10-01',
      costAnnual: 35000,
      category: 'حكومي',
    },
    {
      id: 'Q005',
      entity: 'أمانة المنطقة الشرقية',
      qualificationNumber: 'EP-2023-7854',
      status: 'نشط',
      startDate: '2023-11-05',
      expiryDate: '2025-11-04',
      renewalDate: '2025-08-05',
      requirementsTotal: 8,
      requirementsMet: 8,
      lastUpdate: '2023-11-05',
      costAnnual: 12000,
      category: 'حكومي',
    },
    {
      id: 'Q006',
      entity: 'الدفاع المدني',
      qualificationNumber: 'CD-2024-5632',
      status: 'نشط',
      startDate: '2024-02-15',
      expiryDate: '2025-02-14',
      renewalDate: '2024-11-15',
      requirementsTotal: 6,
      requirementsMet: 6,
      lastUpdate: '2024-02-15',
      costAnnual: 8000,
      category: 'حكومي',
    },
    {
      id: 'Q007',
      entity: 'هيئة تنظيم الكهرباء',
      qualificationNumber: 'ECRA-2023-8521',
      status: 'نشط',
      startDate: '2023-08-20',
      expiryDate: '2025-08-19',
      renewalDate: '2025-05-20',
      requirementsTotal: 14,
      requirementsMet: 14,
      lastUpdate: '2023-08-20',
      costAnnual: 22000,
      category: 'حكومي',
    },
    {
      id: 'Q008',
      entity: 'شركة أرامكو السعودية',
      qualificationNumber: 'SAC-2024-1234',
      status: 'نشط',
      startDate: '2024-01-10',
      expiryDate: '2027-01-09',
      renewalDate: '2026-10-10',
      requirementsTotal: 25,
      requirementsMet: 25,
      lastUpdate: '2024-01-10',
      costAnnual: 50000,
      category: 'خاص',
    },
  ], []);

  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  const renderTabContent = () => {
    // تاب 944-01: نظرة عامة
    if (activeTab === '944-01') {
      const activeQuals = qualifications.filter(q => q.status === 'نشط').length;
      const renewalQuals = qualifications.filter(q => q.status === 'قيد التجديد').length;
      const totalCost = qualifications.reduce((sum, q) => sum + q.costAnnual, 0);
      const avgProgress = qualifications.reduce((sum, q) => sum + (q.requirementsMet / q.requirementsTotal * 100), 0) / qualifications.length;

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              نظرة عامة على التأهيلات
            </h3>
            <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="h-3.5 w-3.5 ml-2" />
              تأهيل جديد
            </Button>
          </div>

          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي التأهيلات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {qualifications.length}
                    </p>
                  </div>
                  <Award className="stats-icon-compact text-[#2563eb] opacity-80" />
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
                      {activeQuals}
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
                      قيد التجديد
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {renewalQuals}
                    </p>
                  </div>
                  <RefreshCw className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تنبيهات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      2
                    </p>
                  </div>
                  <Bell className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      التكلفة السنوية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalCost / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Briefcase className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط التقدم
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {avgProgress.toFixed(0)}%
                    </p>
                  </div>
                  <Star className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      حكومية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {qualifications.filter(q => q.category === 'حكومي').length}
                    </p>
                  </div>
                  <Building2 className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      خاصة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {qualifications.filter(q => q.category === 'خاص').length}
                    </p>
                  </div>
                  <Briefcase className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التأهيلات القريبة من الانتهاء
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualifications.slice(0, 5).map((qual) => {
                    const daysLeft = Math.floor((new Date(qual.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={qual.id}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {qual.entity}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.qualificationNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.expiryDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={daysLeft < 90 ? 'bg-red-100 text-red-700' : daysLeft < 180 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                            {daysLeft} يوم
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            qual.status === 'نشط' ? 'bg-green-100 text-green-700' :
                            qual.status === 'قيد التجديد' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {qual.status}
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

    // تاب 944-11: سجل التأهيلات
    if (activeTab === '944-11') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              سجل جميع التأهيلات
            </h3>
            <div className="flex gap-1">
              <Button variant="outline" className="dense-button button-rtl">
                <Download className="h-3.5 w-3.5 ml-2" />
                تصدير
              </Button>
              <Button variant="outline" className="dense-button button-rtl">
                <RefreshCw className="h-3.5 w-3.5 ml-2" />
                تحديث
              </Button>
            </div>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم التأهيل</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البداية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الانتهاء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التجديد</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualifications.map((qual) => {
                    const progress = (qual.requirementsMet / qual.requirementsTotal) * 100;
                    return (
                      <TableRow key={qual.id}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {qual.entity}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.qualificationNumber}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.startDate}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.expiryDate}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {qual.renewalDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                              {progress.toFixed(0)}%
                            </span>
                            <Progress value={progress} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {(qual.costAnnual / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            qual.status === 'نشط' ? 'bg-green-100 text-green-700' :
                            qual.status === 'قيد التجديد' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }>
                            {qual.status}
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

    // التابات الخاصة بكل جهة (944-02 إلى 944-10)
    if (currentTab && currentTab.entity) {
      const entityQual = qualifications.find(q => q.entity.includes(currentTab.entity!));

      if (!entityQual) {
        return (
          <div className="space-y-2">
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا يوجد تأهيل
                </h3>
                <p className="text-sm mb-4" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  لم يتم التأهيل لدى {currentTab.entity} بعد
                </p>
                <Button className="dense-button bg-[#10b981] hover:bg-[#059669] text-white">
                  <Plus className="h-3.5 w-3.5 ml-2" />
                  بدء التأهيل
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      const progress = (entityQual.requirementsMet / entityQual.requirementsTotal) * 100;
      const daysLeft = Math.floor((new Date(entityQual.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {currentTab.entity}
            </h3>
            <Badge className={
              entityQual.status === 'نشط' ? 'bg-green-600 text-white' :
              entityQual.status === 'قيد التجديد' ? 'bg-yellow-600 text-white' :
              'bg-red-600 text-white'
            }>
              {entityQual.status}
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 card-rtl">
            <CardContent className="p-3">
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    رقم التأهيل
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {entityQual.qualificationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    تاريخ البداية
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {entityQual.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    تاريخ الانتهاء
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {entityQual.expiryDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    الأيام المتبقية
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {daysLeft} يوم
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    التكلفة السنوية
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                    {entityQual.costAnnual.toLocaleString()} ريال
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المتطلبات والتقدم
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        التقدم الإجمالي
                      </span>
                      <span className="text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                        {entityQual.requirementsMet}/{entityQual.requirementsTotal}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-xs mt-1" style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                      {progress.toFixed(1)}% مكتمل
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الوثائق الأساسية
                        </span>
                      </div>
                      <Badge className="bg-green-600 text-white text-[10px]">مكتمل</Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          المخططات المعتمدة
                        </span>
                      </div>
                      <Badge className="bg-green-600 text-white text-[10px]">مكتمل</Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          التراخيص المهنية
                        </span>
                      </div>
                      <Badge className="bg-green-600 text-white text-[10px]">مكتمل</Badge>
                    </div>

                    {entityQual.requirementsMet < entityQual.requirementsTotal && (
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            شهادات التأمين
                          </span>
                        </div>
                        <Badge className="bg-yellow-600 text-white text-[10px]">قيد المعالجة</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التجديد والتنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        موعد التجديد القادم
                      </span>
                    </div>
                    <p className="text-sm mr-6" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {entityQual.renewalDate}
                    </p>
                  </div>

                  {daysLeft < 180 && (
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          تنبيه التجديد
                        </span>
                      </div>
                      <p className="text-xs mr-6" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                        يُنصح ببدء إجراءات التجديد خلال {daysLeft} يوم
                      </p>
                    </div>
                  )}

                  <Button className="w-full dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                    <Upload className="h-3.5 w-3.5 ml-2" />
                    رفع مستندات التجديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 944-12: الإعدادات والتنبيهات
    return (
      <div className="space-y-2">
        <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إعدادات التنبيهات
        </h3>
        <Card className="card-rtl">
          <CardContent className="p-3">
            <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إعدادات التنبيهات والإشعارات للتأهيلات
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
              تأهيل المكتب لدى الجهات
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إدارة شاملة لتأهيلات المكتب لدى الجهات الحكومية والخاصة
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-944
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              12 تاب
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
    </div>
  );
};

export default OfficeQualificationScreen;
