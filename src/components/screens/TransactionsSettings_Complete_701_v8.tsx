/**
 * الشاشة 701 - إعدادات المعاملات v8.0
 * =======================================
 * 
 * شاشة شاملة لإدارة جميع إعدادات نظام المعاملات
 * 
 * التابات:
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
 * 701-11: التصنيفات الرئيسية للمعاملات
 * 701-12: التصنيفات الفرعية للمعاملات
 * 701-13: الربط بالأنظمة
 * 701-14: السجلات والتدقيق
 * 701-15: النسخ الاحتياطي
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
import {
  Settings, Hash, GitBranch, Activity, Zap, Tag, FileText,
  File, Bell, Shield, Folder, FolderTree, Link2, Eye, Database,
  Plus, Edit, Trash2, Save, Search, Filter, BarChart3, Clock,
  CheckCircle, XCircle, AlertCircle, Play, Pause, ArrowRight
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import TransactionCategoriesComponent from './TransactionCategories_Component_701';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ===== واجهات البيانات =====

interface Stage {
  id: string;
  code: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  color: string;
  icon: string;
  requiredDocuments: string[];
  allowedTransitions: string[];
  notifications: boolean;
  createdDate: string;
}

interface TransactionStatus {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'قيد التنفيذ' | 'مكتملة' | 'معلقة' | 'ملغاة';
  color: string;
  icon: string;
  isActive: boolean;
  requiresApproval: boolean;
  canEdit: boolean;
  canDelete: boolean;
  nextStatuses: string[];
  createdDate: string;
}

interface Priority {
  id: string;
  code: string;
  name: string;
  description: string;
  level: number;
  color: string;
  icon: string;
  sla: number;
  isActive: boolean;
  autoEscalation: boolean;
  createdDate: string;
}

interface Classification {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  color: string;
  isActive: boolean;
  subClassifications: number;
  createdDate: string;
}

interface Template {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'معاملة' | 'مستند' | 'تقرير';
  category: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

interface Form {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'استمارة' | 'نموذج' | 'طلب';
  category: string;
  fields: any[];
  isActive: boolean;
  isRequired: boolean;
  usageCount: number;
  createdDate: string;
}

const TransactionsSettings_Complete_701_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('701-01');
  const [categorySubTab, setCategorySubTab] = useState<'main' | 'sub'>('main');

  // تكوين التابات
  const TABS_CONFIG: TabConfig[] = [
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
  ];

  // بيانات تجريبية - المراحل
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 'STG-001',
      code: 'INIT',
      name: 'البدء',
      description: 'مرحلة استلام الطلب وبدء المعاملة',
      order: 1,
      isActive: true,
      color: '#3b82f6',
      icon: 'Play',
      requiredDocuments: ['صورة الهوية', 'صورة الصك'],
      allowedTransitions: ['STG-002'],
      notifications: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'STG-002',
      code: 'REVIEW',
      name: 'المراجعة',
      description: 'مراجعة المستندات والمتطلبات',
      order: 2,
      isActive: true,
      color: '#f59e0b',
      icon: 'Search',
      requiredDocuments: [],
      allowedTransitions: ['STG-003', 'STG-001'],
      notifications: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'STG-003',
      code: 'APPROVAL',
      name: 'الموافقة',
      description: 'مرحلة الموافقة والاعتماد',
      order: 3,
      isActive: true,
      color: '#10b981',
      icon: 'CheckCircle',
      requiredDocuments: [],
      allowedTransitions: ['STG-004', 'STG-002'],
      notifications: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'STG-004',
      code: 'COMPLETE',
      name: 'الإكمال',
      description: 'إكمال المعاملة والتسليم',
      order: 4,
      isActive: true,
      color: '#6366f1',
      icon: 'CheckCircle',
      requiredDocuments: [],
      allowedTransitions: [],
      notifications: true,
      createdDate: '2024-01-15'
    }
  ]);

  // بيانات تجريبية - الحالات
  const [statuses, setStatuses] = useState<TransactionStatus[]>([
    {
      id: 'ST-001',
      code: 'NEW',
      name: 'جديدة',
      description: 'معاملة جديدة تم استلامها',
      category: 'قيد التنفيذ',
      color: '#3b82f6',
      icon: 'Plus',
      isActive: true,
      requiresApproval: false,
      canEdit: true,
      canDelete: true,
      nextStatuses: ['ST-002', 'ST-005'],
      createdDate: '2024-01-15'
    },
    {
      id: 'ST-002',
      code: 'IN_PROGRESS',
      name: 'قيد التنفيذ',
      description: 'المعاملة قيد التنفيذ',
      category: 'قيد التنفيذ',
      color: '#f59e0b',
      icon: 'Play',
      isActive: true,
      requiresApproval: false,
      canEdit: true,
      canDelete: false,
      nextStatuses: ['ST-003', 'ST-004', 'ST-005'],
      createdDate: '2024-01-15'
    },
    {
      id: 'ST-003',
      code: 'COMPLETED',
      name: 'مكتملة',
      description: 'تم إكمال المعاملة بنجاح',
      category: 'مكتملة',
      color: '#10b981',
      icon: 'CheckCircle',
      isActive: true,
      requiresApproval: true,
      canEdit: false,
      canDelete: false,
      nextStatuses: [],
      createdDate: '2024-01-15'
    },
    {
      id: 'ST-004',
      code: 'PENDING',
      name: 'معلقة',
      description: 'معاملة معلقة بانتظار إجراء',
      category: 'معلقة',
      color: '#f97316',
      icon: 'Pause',
      isActive: true,
      requiresApproval: false,
      canEdit: true,
      canDelete: false,
      nextStatuses: ['ST-002', 'ST-006'],
      createdDate: '2024-01-15'
    },
    {
      id: 'ST-005',
      code: 'REJECTED',
      name: 'مرفوضة',
      description: 'تم رفض المعاملة',
      category: 'ملغاة',
      color: '#ef4444',
      icon: 'XCircle',
      isActive: true,
      requiresApproval: true,
      canEdit: false,
      canDelete: false,
      nextStatuses: [],
      createdDate: '2024-01-15'
    },
    {
      id: 'ST-006',
      code: 'CANCELLED',
      name: 'ملغاة',
      description: 'تم إلغاء المعاملة',
      category: 'ملغاة',
      color: '#6b7280',
      icon: 'XCircle',
      isActive: true,
      requiresApproval: true,
      canEdit: false,
      canDelete: false,
      nextStatuses: [],
      createdDate: '2024-01-15'
    }
  ]);

  // بيانات تجريبية - الأولويات
  const [priorities, setPriorities] = useState<Priority[]>([
    {
      id: 'PR-001',
      code: 'URGENT',
      name: 'عاجل جداً',
      description: 'أولوية قصوى - يجب البدء فوراً',
      level: 1,
      color: '#dc2626',
      icon: 'AlertCircle',
      sla: 1,
      isActive: true,
      autoEscalation: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'PR-002',
      code: 'HIGH',
      name: 'عالية',
      description: 'أولوية عالية - البدء في أقرب وقت',
      level: 2,
      color: '#f59e0b',
      icon: 'Zap',
      sla: 3,
      isActive: true,
      autoEscalation: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'PR-003',
      code: 'MEDIUM',
      name: 'متوسطة',
      description: 'أولوية متوسطة - يمكن جدولتها',
      level: 3,
      color: '#3b82f6',
      icon: 'ArrowRight',
      sla: 7,
      isActive: true,
      autoEscalation: false,
      createdDate: '2024-01-15'
    },
    {
      id: 'PR-004',
      code: 'LOW',
      name: 'منخفضة',
      description: 'أولوية منخفضة - يمكن تأجيلها',
      level: 4,
      color: '#6b7280',
      icon: 'Clock',
      sla: 14,
      isActive: true,
      autoEscalation: false,
      createdDate: '2024-01-15'
    }
  ]);

  // بيانات تجريبية - التصنيفات
  const [classifications, setClassifications] = useState<Classification[]>([
    {
      id: 'CL-001',
      code: 'BUILDING',
      name: 'معاملات البناء',
      description: 'جميع المعاملات المتعلقة بالبناء والتشييد',
      category: 'هندسية',
      color: '#3b82f6',
      isActive: true,
      subClassifications: 5,
      createdDate: '2024-01-15'
    },
    {
      id: 'CL-002',
      code: 'SURVEY',
      name: 'معاملات المساحة',
      description: 'معاملات المسح والإفراز',
      category: 'مساحية',
      color: '#10b981',
      isActive: true,
      subClassifications: 3,
      createdDate: '2024-01-15'
    },
    {
      id: 'CL-003',
      code: 'LEGAL',
      name: 'معاملات قانونية',
      description: 'المعاملات القانونية والصكوك',
      category: 'قانونية',
      color: '#f59e0b',
      isActive: true,
      subClassifications: 4,
      createdDate: '2024-01-15'
    }
  ]);

  // بيانات تجريبية - القوالب
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'TPL-001',
      code: 'BUILD-LIC-TPL',
      name: 'قالب ترخيص بناء',
      description: 'القالب الرسمي لطلب ترخيص البناء',
      type: 'معاملة',
      category: 'هندسية',
      content: '<html>...</html>',
      variables: ['اسم_المالك', 'رقم_الصك', 'المساحة'],
      isActive: true,
      usageCount: 456,
      createdDate: '2024-01-15'
    },
    {
      id: 'TPL-002',
      code: 'SURVEY-RPT-TPL',
      name: 'قالب تقرير مساحي',
      description: 'قالب التقرير المساحي الشامل',
      type: 'تقرير',
      category: 'مساحية',
      content: '<html>...</html>',
      variables: ['رقم_الطلب', 'المساح', 'التاريخ'],
      isActive: true,
      usageCount: 234,
      createdDate: '2024-01-16'
    }
  ]);

  // بيانات تجريبية - النماذج
  const [forms, setForms] = useState<Form[]>([
    {
      id: 'FRM-001',
      code: 'OWNER-INFO',
      name: 'استمارة بيانات المالك',
      description: 'جمع البيانات الأساسية للمالك',
      type: 'استمارة',
      category: 'عامة',
      fields: [
        { name: 'الاسم', type: 'text', required: true },
        { name: 'الهوية', type: 'text', required: true },
        { name: 'الجوال', type: 'tel', required: true }
      ],
      isActive: true,
      isRequired: true,
      usageCount: 789,
      createdDate: '2024-01-15'
    },
    {
      id: 'FRM-002',
      code: 'SITE-INFO',
      name: 'نموذج بيانات الموقع',
      description: 'تسجيل معلومات موقع العمل',
      type: 'نموذج',
      category: 'هندسية',
      fields: [
        { name: 'المدينة', type: 'select', required: true },
        { name: 'الحي', type: 'text', required: true },
        { name: 'الإحداثيات', type: 'text', required: false }
      ],
      isActive: true,
      isRequired: false,
      usageCount: 567,
      createdDate: '2024-01-16'
    }
  ]);

  // ===== مكونات التابات =====

  // تاب المراحل
  const renderStagesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي المراحل', value: stages.length, icon: GitBranch, color: 'blue' },
          { label: 'المراحل النشطة', value: stages.filter(s => s.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'متوسط المدة', value: '5 أيام', icon: Clock, color: 'orange' },
          { label: 'الاستخدام الشهري', value: '1,234', icon: BarChart3, color: 'purple' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مرحلة جديدة
        </Button>
      </div>

      {/* جدول المراحل */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            المراحل ({stages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>
                  الترتيب
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الكود
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم المرحلة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الوصف
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  المستندات
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {stage.order}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {stage.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {stage.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {stage.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {stage.requiredDocuments.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {stage.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
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

  // تاب الحالات
  const renderStatusesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'إجمالي الحالات', value: statuses.length, icon: Activity, color: 'blue' },
          { label: 'قيد التنفيذ', value: statuses.filter(s => s.category === 'قيد التنفيذ').length, icon: Play, color: 'orange' },
          { label: 'مكتملة', value: statuses.filter(s => s.category === 'مكتملة').length, icon: CheckCircle, color: 'green' },
          { label: 'معلقة', value: statuses.filter(s => s.category === 'معلقة').length, icon: Pause, color: 'yellow' },
          { label: 'ملغاة', value: statuses.filter(s => s.category === 'ملغاة').length, icon: XCircle, color: 'red' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة حالة جديدة
        </Button>
      </div>

      {/* جدول الحالات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            حالات المعاملات ({statuses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>
                  #
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الكود
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الاسم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالات التالية
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  موافقة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status, index) => (
                <TableRow key={status.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {status.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {status.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {status.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {status.nextStatuses.length} حالة
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {status.requiresApproval ? (
                      <Badge className="bg-orange-500 text-white text-xs">مطلوبة</Badge>
                    ) : (
                      <Badge className="bg-blue-500 text-white text-xs">غير مطلوبة</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {status.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
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

  // تاب الأولويات
  const renderPrioritiesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي الأولويات', value: priorities.length, icon: Zap, color: 'blue' },
          { label: 'مع تصعيد تلقائي', value: priorities.filter(p => p.autoEscalation).length, icon: AlertCircle, color: 'red' },
          { label: 'متوسط SLA', value: '7 أيام', icon: Clock, color: 'orange' },
          { label: 'الاستخدام الشهري', value: '892', icon: BarChart3, color: 'purple' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* قائمة الأولويات */}
      <div className="grid grid-cols-2 gap-3">
        {priorities.map((priority) => (
          <Card key={priority.id} className="card-element card-rtl hover:shadow-md transition-shadow">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${priority.color}20` }}
                  >
                    {React.createElement(
                      priority.icon === 'AlertCircle' ? AlertCircle : 
                      priority.icon === 'Zap' ? Zap :
                      priority.icon === 'ArrowRight' ? ArrowRight : Clock,
                      { className: 'h-6 w-6', style: { color: priority.color } }
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                      {priority.name}
                    </h3>
                    <Badge variant="outline" className="text-xs font-mono mt-1">
                      {priority.code}
                    </Badge>
                  </div>
                </div>
                {priority.isActive ? (
                  <Badge className="bg-green-500 text-white">نشط</Badge>
                ) : (
                  <Badge className="bg-gray-400 text-white">غير نشط</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {priority.description}
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المستوى
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {priority.level}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    SLA (أيام)
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {priority.sla}
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تصعيد
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {priority.autoEscalation ? '✓' : '✗'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1" variant="outline">
                  <Edit className="h-3.5 w-3.5 ml-2" />
                  تعديل
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* زر إضافة */}
      <div className="flex justify-center">
        <Button size="lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-5 w-5 ml-2" />
          إضافة أولوية جديدة
        </Button>
      </div>
    </div>
  );

  // تاب التصنيفات
  const renderClassificationsTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي التصنيفات', value: classifications.length, icon: Tag, color: 'blue' },
          { label: 'النشطة', value: classifications.filter(c => c.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'التصنيفات الفرعية', value: classifications.reduce((sum, c) => sum + c.subClassifications, 0), icon: FolderTree, color: 'purple' },
          { label: 'الفئات', value: new Set(classifications.map(c => c.category)).size, icon: Folder, color: 'orange' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* قائمة التصنيفات */}
      <div className="grid grid-cols-3 gap-3">
        {classifications.map((classification) => (
          <Card key={classification.id} className="card-element card-rtl hover:shadow-md transition-shadow">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs font-mono">
                  {classification.code}
                </Badge>
                {classification.isActive ? (
                  <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                ) : (
                  <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                )}
              </div>
              <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>
                {classification.name}
              </h3>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {classification.description}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {classification.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {classification.subClassifications} فرعي
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1" variant="outline">
                  <Edit className="h-3.5 w-3.5 ml-2" />
                  تعديل
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* زر إضافة */}
      <div className="flex justify-center">
        <Button size="lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-5 w-5 ml-2" />
          إضافة تصنيف جديد
        </Button>
      </div>
    </div>
  );

  // تاب القوالب
  const renderTemplatesTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'إجمالي القوالب', value: templates.length, icon: FileText, color: 'blue' },
          { label: 'معاملات', value: templates.filter(t => t.type === 'معاملة').length, icon: File, color: 'green' },
          { label: 'مستندات', value: templates.filter(t => t.type === 'مستند').length, icon: FileText, color: 'purple' },
          { label: 'تقارير', value: templates.filter(t => t.type === 'تقرير').length, icon: BarChart3, color: 'orange' },
          { label: 'الاستخدام', value: templates.reduce((sum, t) => sum + t.usageCount, 0), icon: Activity, color: 'red' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول القوالب */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            القوالب ({templates.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الكود
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم القالب
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  النوع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الفئة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  المتغيرات
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الاستخدام
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {template.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {template.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {template.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {template.variables.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {template.usageCount.toLocaleString('ar-SA')}
                  </TableCell>
                  <TableCell className="text-right">
                    {template.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button size="lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-5 w-5 ml-2" />
          إضافة قالب جديد
        </Button>
      </div>
    </div>
  );

  // تاب النماذج
  const renderFormsTab = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'إجمالي النماذج', value: forms.length, icon: File, color: 'blue' },
          { label: 'استمارات', value: forms.filter(f => f.type === 'استمارة').length, icon: FileText, color: 'green' },
          { label: 'نماذج', value: forms.filter(f => f.type === 'نموذج').length, icon: File, color: 'purple' },
          { label: 'طلبات', value: forms.filter(f => f.type === 'طلب').length, icon: FileText, color: 'orange' },
          { label: 'الاستخدام', value: forms.reduce((sum, f) => sum + f.usageCount, 0), icon: Activity, color: 'red' }
        ].map((stat, i) => (
          <Card key={i} className="card-element card-rtl">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(stat.icon, { 
                  className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` 
                })}
                <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* جدول النماذج */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            النماذج ({forms.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الكود
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم النموذج
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  النوع
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  الفئة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الحقول
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  إلزامي
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الاستخدام
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                  الحالة
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {form.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {form.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {form.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {form.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {form.fields.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {form.isRequired ? (
                      <Badge className="bg-red-500 text-white text-xs">نعم</Badge>
                    ) : (
                      <Badge className="bg-blue-500 text-white text-xs">لا</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {form.usageCount.toLocaleString('ar-SA')}
                  </TableCell>
                  <TableCell className="text-right">
                    {form.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button size="lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <Plus className="h-5 w-5 ml-2" />
          إضافة نموذج جديد
        </Button>
      </div>
    </div>
  );

  // رند محتوى التاب
  const renderTabContent = () => {
    switch (activeTab) {
      case '701-01':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات الأساسية (قيد التطوير)</div>;
      case '701-02':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الترقيم (قيد التطوير)</div>;
      case '701-03':
        return renderStagesTab();
      case '701-04':
        return renderStatusesTab();
      case '701-05':
        return renderPrioritiesTab();
      case '701-06':
        return renderClassificationsTab();
      case '701-07':
        return renderTemplatesTab();
      case '701-08':
        return renderFormsTab();
      case '701-09':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التنبيهات (قيد التطوير)</div>;
      case '701-10':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات (قيد التطوير)</div>;
      case '701-11':
      case '701-12':
        return (
          <div className="space-y-3">
            {/* تبويبات فرعية */}
            <div className="flex gap-2">
              <Button
                variant={categorySubTab === 'main' ? 'default' : 'outline'}
                onClick={() => setCategorySubTab('main')}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Folder className="h-4 w-4 ml-2" />
                التصنيفات الرئيسية
              </Button>
              <Button
                variant={categorySubTab === 'sub' ? 'default' : 'outline'}
                onClick={() => setCategorySubTab('sub')}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <FolderTree className="h-4 w-4 ml-2" />
                التصنيفات الفرعية
              </Button>
            </div>
            
            {/* المكون الرئيسي */}
            <TransactionCategoriesComponent activeSubTab={categorySubTab} />
          </div>
        );
      case '701-13':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الربط بالأنظمة (قيد التطوير)</div>;
      case '701-14':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>السجلات والتدقيق (قيد التطوير)</div>;
      case '701-15':
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الاحتياطي (قيد التطوير)</div>;
      default:
        return <div className="p-4 text-center text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات الأساسية</div>;
    }
  };

  return (
    <div className="flex" style={{ direction: 'rtl', gap: '4px', minHeight: 'calc(100vh - 140px)' }}>
      {/* السايد بار الموحد v1.1 */}
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* محتوى الشاشة */}
      <div className="flex-1">
        <div className="space-y-3">
          {/* العنوان */}
          <Card className="card-element card-rtl">
            <CardHeader className="p-3">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Settings className="h-5 w-5 inline ml-2" />
                إعدادات المعاملات
              </CardTitle>
            </CardHeader>
          </Card>

          {/* محتوى التاب */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSettings_Complete_701_v8;
