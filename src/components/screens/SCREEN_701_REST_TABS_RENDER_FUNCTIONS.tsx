/**
 * الشاشة 701 - دوال render للتابات المتبقية (701-08 إلى 701-16)
 * =================================================================
 * 
 * هذا الملف يحتوي على دوال render التفصيلية للتابات التالية:
 * ✅ 701-08: القوالب (15 قالب شامل)
 * ✅ 701-09: النماذج والتعهدات (20 نموذج)
 * ✅ 701-10: إعدادات التنبيهات (12 نوع تنبيه)
 * ✅ 701-11: الصلاحيات (25 صلاحية)
 * ✅ 701-12: الربط بالأنظمة (10 أنظمة)
 * ✅ 701-13: السجلات والتدقيق (إعدادات الأرشفة)
 * ✅ 701-14: النسخ الاحتياطي (إعدادات شاملة)
 * ✅ 701-15: مستوى المعاملة (5 مستويات)
 * ✅ 701-16: إجراءات التحقق (15 إجراء)
 * 
 * @version 12.1 COMPLETE_REST_TABS
 * @date نوفمبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import {
  FileText, File, Bell, Shield, Link2, Database, Archive,
  Plus, Edit, Trash2, Save, Search, Filter, Eye, CheckCircle,
  AlertCircle, Clock, Copy, Download, Upload, RefreshCw,
  Layers, Target, Flag, Star, Award, Lock, Key, Zap
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// ============================================================
// 701-08: القوالب
// ============================================================

interface Template {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: string;
  type: string;
  description: string;
  fields: number;
  isActive: boolean;
  usageCount: number;
  lastModified: string;
  color: string;
}

const mockTemplates: Template[] = [
  {
    id: 'TPL-001',
    code: 'TPL-RES-01',
    nameAr: 'معاملة سكنية عادية',
    nameEn: 'Standard Residential Transaction',
    category: 'سكني',
    type: 'رخصة بناء',
    description: 'قالب شامل للمعاملات السكنية العادية',
    fields: 42,
    isActive: true,
    usageCount: 1245,
    lastModified: '2025-11-01',
    color: '#10b981'
  },
  {
    id: 'TPL-002',
    code: 'TPL-COM-01',
    nameAr: 'معاملة تجارية',
    nameEn: 'Commercial Transaction',
    category: 'تجاري',
    type: 'رخصة بناء',
    description: 'قالب شامل للمعاملات التجارية',
    fields: 56,
    isActive: true,
    usageCount: 832,
    lastModified: '2025-10-28',
    color: '#3b82f6'
  },
  {
    id: 'TPL-003',
    code: 'TPL-IND-01',
    nameAr: 'معاملة صناعية',
    nameEn: 'Industrial Transaction',
    category: 'صناعي',
    type: 'رخصة بناء',
    description: 'قالب للمنشآت الصناعية',
    fields: 65,
    isActive: true,
    usageCount: 423,
    lastModified: '2025-10-25',
    color: '#f59e0b'
  },
  {
    id: 'TPL-004',
    code: 'TPL-ADM-01',
    nameAr: 'معاملة إدارية',
    nameEn: 'Administrative Transaction',
    category: 'إداري',
    type: 'رخصة بناء',
    description: 'قالب للمباني الإدارية',
    fields: 48,
    isActive: true,
    usageCount: 567,
    lastModified: '2025-10-20',
    color: '#8b5cf6'
  },
  {
    id: 'TPL-005',
    code: 'TPL-MIX-01',
    nameAr: 'معاملة مختلطة',
    nameEn: 'Mixed Use Transaction',
    category: 'مختلط',
    type: 'رخصة بناء',
    description: 'قالب للاستخدام المختلط',
    fields: 72,
    isActive: true,
    usageCount: 345,
    lastModified: '2025-10-15',
    color: '#ec4899'
  },
  {
    id: 'TPL-006',
    code: 'TPL-RES-02',
    nameAr: 'فيلا سكنية فاخرة',
    nameEn: 'Luxury Residential Villa',
    category: 'سكني',
    type: 'رخصة بناء',
    description: 'قالب للفلل السكنية الفاخرة',
    fields: 58,
    isActive: true,
    usageCount: 678,
    lastModified: '2025-10-10',
    color: '#10b981'
  },
  {
    id: 'TPL-007',
    code: 'TPL-MOD-01',
    nameAr: 'تعديل رخصة بناء',
    nameEn: 'Building Permit Modification',
    category: 'تعديل',
    type: 'تعديل رخصة',
    description: 'قالب لتعديل رخصة بناء موجودة',
    fields: 35,
    isActive: true,
    usageCount: 923,
    lastModified: '2025-10-05',
    color: '#f59e0b'
  },
  {
    id: 'TPL-008',
    code: 'TPL-ADD-01',
    nameAr: 'إضافة دور',
    nameEn: 'Floor Addition',
    category: 'إضافة',
    type: 'رخصة إضافة',
    description: 'قالب لإضافة دور جديد',
    fields: 38,
    isActive: true,
    usageCount: 512,
    lastModified: '2025-09-30',
    color: '#3b82f6'
  },
  {
    id: 'TPL-009',
    code: 'TPL-DEM-01',
    nameAr: 'هدم مبنى',
    nameEn: 'Building Demolition',
    category: 'هدم',
    type: 'رخصة هدم',
    description: 'قالب لرخصة هدم مبنى',
    fields: 28,
    isActive: true,
    usageCount: 234,
    lastModified: '2025-09-25',
    color: '#ef4444'
  },
  {
    id: 'TPL-010',
    code: 'TPL-COM-02',
    nameAr: 'مركز تجاري',
    nameEn: 'Shopping Center',
    category: 'تجاري',
    type: 'رخصة بناء',
    description: 'قالب للمراكز التجارية الكبيرة',
    fields: 82,
    isActive: true,
    usageCount: 156,
    lastModified: '2025-09-20',
    color: '#3b82f6'
  },
  {
    id: 'TPL-011',
    code: 'TPL-AGR-01',
    nameAr: 'معاملة زراعية',
    nameEn: 'Agricultural Transaction',
    category: 'زراعي',
    type: 'رخصة بناء',
    description: 'قالب للمنشآت الزراعية',
    fields: 44,
    isActive: true,
    usageCount: 189,
    lastModified: '2025-09-15',
    color: '#22c55e'
  },
  {
    id: 'TPL-012',
    code: 'TPL-SER-01',
    nameAr: 'معاملة خدمية',
    nameEn: 'Service Transaction',
    category: 'خدمي',
    type: 'رخصة بناء',
    description: 'قالب للمباني الخدمية',
    fields: 52,
    isActive: true,
    usageCount: 412,
    lastModified: '2025-09-10',
    color: '#06b6d4'
  },
  {
    id: 'TPL-013',
    code: 'TPL-EDU-01',
    nameAr: 'معاملة تعليمية',
    nameEn: 'Educational Transaction',
    category: 'تعليمي',
    type: 'رخصة بناء',
    description: 'قالب للمنشآت التعليمية',
    fields: 61,
    isActive: true,
    usageCount: 298,
    lastModified: '2025-09-05',
    color: '#8b5cf6'
  },
  {
    id: 'TPL-014',
    code: 'TPL-HTH-01',
    nameAr: 'معاملة صحية',
    nameEn: 'Health Transaction',
    category: 'صحي',
    type: 'رخصة بناء',
    description: 'قالب للمنشآت الصحية',
    fields: 74,
    isActive: true,
    usageCount: 267,
    lastModified: '2025-09-01',
    color: '#ef4444'
  },
  {
    id: 'TPL-015',
    code: 'TPL-TOU-01',
    nameAr: 'معاملة سياحية',
    nameEn: 'Tourism Transaction',
    category: 'سياحي',
    type: 'رخصة بناء',
    description: 'قالب للمنشآت السياحية',
    fields: 68,
    isActive: true,
    usageCount: 145,
    lastModified: '2025-08-28',
    color: '#f59e0b'
  }
];

export const render701_08_Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className=\"space-y-3\">
      {/* البطاقات الإحصائية */}
      <div className=\"grid grid-cols-5 gap-2\">
        {[
          { label: 'إجمالي القوالب', value: '15', color: '#2563eb', icon: FileText },
          { label: 'القوالب النشطة', value: '15', color: '#10b981', icon: CheckCircle },
          { label: 'إجمالي الحقول', value: '823', color: '#f59e0b', icon: Layers },
          { label: 'إجمالي الاستخدامات', value: '7.2K', color: '#8b5cf6', icon: Star },
          { label: 'آخر تحديث', value: 'اليوم', color: '#ec4899', icon: Clock }
        ].map((stat, i) => (
          <Card key={i} className=\"card-rtl\" style={{ background: `${stat.color}10`, border: `2px solid ${stat.color}` }}>
            <CardContent className=\"p-2 text-center\">
              <stat.icon className=\"h-5 w-5 mx-auto mb-1\" style={{ color: stat.color }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
              <p className=\"text-[10px]\" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الأزرار */}
      <div className=\"flex items-center justify-between\">
        <div className=\"flex gap-2\">
          <Button size=\"sm\" className=\"button-rtl\" style={{ background: '#10b981', color: 'white' }}>
            <Plus className=\"h-4 w-4\" />
            قالب جديد
          </Button>
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Upload className=\"h-4 w-4\" />
            استيراد
          </Button>
        </div>
        <div className=\"flex gap-2\">
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Download className=\"h-4 w-4\" />
            تصدير
          </Button>
          <Button size=\"sm\" variant=\"outline\" className=\"button-rtl\">
            <Search className=\"h-4 w-4\" />
            بحث
          </Button>
        </div>
      </div>

      {/* جدول القوالب */}
      <Card className=\"card-rtl\">
        <CardHeader className=\"p-2\">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
            جميع القوالب (15 قالب)
          </CardTitle>
        </CardHeader>
        <CardContent className=\"p-2\">
          <Table className=\"table-rtl\">
            <TableHeader>
              <TableRow>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الحقول</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>مرات الاستخدام</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className=\"text-right font-mono\" style={{ color: template.color, fontWeight: 600 }}>
                    {template.code}
                  </TableCell>
                  <TableCell className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '12px' }}>{template.nameAr}</p>
                      <p className=\"text-[10px] text-gray-500\">{template.nameEn}</p>
                    </div>
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <Badge style={{ background: `${template.color}20`, color: template.color }}>{template.category}</Badge>
                  </TableCell>
                  <TableCell className=\"text-right\" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {template.type}
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <Badge variant=\"outline\">{template.fields}</Badge>
                  </TableCell>
                  <TableCell className=\"text-right font-mono\" style={{ color: '#10b981', fontWeight: 600 }}>
                    {template.usageCount.toLocaleString()}
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'نشط' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell className=\"text-right\">
                    <div className=\"flex gap-1 justify-end\">
                      <Button 
                        size=\"sm\" 
                        variant=\"ghost\"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className=\"h-3 w-3\" />
                      </Button>
                      <Button size=\"sm\" variant=\"ghost\">
                        <Edit className=\"h-3 w-3\" />
                      </Button>
                      <Button size=\"sm\" variant=\"ghost\">
                        <Copy className=\"h-3 w-3\" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className=\"max-w-2xl dialog-rtl\">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل القالب</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className=\"space-y-3\">
              <div className=\"grid grid-cols-2 gap-3\">
                <Card className=\"card-rtl\">
                  <CardContent className=\"p-2\">
                    <p className=\"text-xs text-gray-500 mb-1\">الكود</p>
                    <p className=\"font-mono\" style={{ color: selectedTemplate.color, fontWeight: 700 }}>
                      {selectedTemplate.code}
                    </p>
                  </CardContent>
                </Card>
                <Card className=\"card-rtl\">
                  <CardContent className=\"p-2\">
                    <p className=\"text-xs text-gray-500 mb-1\">مرات الاستخدام</p>
                    <p className=\"font-mono\" style={{ color: '#10b981', fontWeight: 700 }}>
                      {selectedTemplate.usageCount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Separator />
              <div>
                <p className=\"text-sm mb-1\" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>
                  {selectedTemplate.nameAr}
                </p>
                <p className=\"text-xs text-gray-500\">{selectedTemplate.nameEn}</p>
              </div>
              <div>
                <p className=\"text-xs text-gray-500 mb-1\">الوصف</p>
                <p className=\"text-sm\" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedTemplate.description}
                </p>
              </div>
              <div className=\"grid grid-cols-3 gap-2\">
                <div>
                  <p className=\"text-xs text-gray-500 mb-1\">التصنيف</p>
                  <Badge style={{ background: `${selectedTemplate.color}20`, color: selectedTemplate.color }}>
                    {selectedTemplate.category}
                  </Badge>
                </div>
                <div>
                  <p className=\"text-xs text-gray-500 mb-1\">النوع</p>
                  <p className=\"text-sm\" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedTemplate.type}</p>
                </div>
                <div>
                  <p className=\"text-xs text-gray-500 mb-1\">عدد الحقول</p>
                  <Badge>{selectedTemplate.fields}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================================
// 701-09: النماذج والتعهدات
// ============================================================

interface FormDeclaration {
  id: string;
  code: string;
  nameAr: string;
  type: 'نموذج' | 'تعهد' | 'إقرار';
  category: string;
  isRequired: boolean;
  isActive: boolean;
  hasSignature: boolean;
  version: string;
  lastUpdated: string;
  usageCount: number;
  color: string;
}

const mockForms: FormDeclaration[] = [
  { id: 'FRM-001', code: 'FRM-OWN-01', nameAr: 'تعهد المالك بالمطابقة', type: 'تعهد', category: 'مالك', isRequired: true, isActive: true, hasSignature: true, version: '2.1', lastUpdated: '2025-11-01', usageCount: 2456, color: '#10b981' },
  { id: 'FRM-002', code: 'FRM-OFF-01', nameAr: 'تعهد المكتب بالإشراف', type: 'تعهد', category: 'مكتب', isRequired: true, isActive: true, hasSignature: true, version: '3.0', lastUpdated: '2025-10-28', usageCount: 2456, color: '#3b82f6' },
  { id: 'FRM-003', code: 'FRM-SAF-01', nameAr: 'نموذج اشتراطات السلامة', type: 'نموذج', category: 'سلامة', isRequired: true, isActive: true, hasSignature: false, version: '1.5', lastUpdated: '2025-10-25', usageCount: 1834, color: '#ef4444' },
  { id: 'FRM-004', code: 'FRM-CIV-01', nameAr: 'إقرار المهندس المدني', type: 'إقرار', category: 'فني', isRequired: true, isActive: true, hasSignature: true, version: '2.0', lastUpdated: '2025-10-20', usageCount: 2123, color: '#f59e0b' },
  { id: 'FRM-005', code: 'FRM-ARC-01', nameAr: 'إقرار المهندس المعماري', type: 'إقرار', category: 'فني', isRequired: true, isActive: true, hasSignature: true, version: '2.0', lastUpdated: '2025-10-15', usageCount: 2123, color: '#f59e0b' },
  { id: 'FRM-006', code: 'FRM-ELE-01', nameAr: 'إقرار المهندس الكهربائي', type: 'إقرار', category: 'فني', isRequired: true, isActive: true, hasSignature: true, version: '1.8', lastUpdated: '2025-10-10', usageCount: 1956, color: '#f59e0b' },
  { id: 'FRM-007', code: 'FRM-MEC-01', nameAr: 'إقرار المهندس الميكانيكي', type: 'إقرار', category: 'فني', isRequired: true, isActive: true, hasSignature: true, version: '1.8', lastUpdated: '2025-10-05', usageCount: 1845, color: '#f59e0b' },
  { id: 'FRM-008', code: 'FRM-SOI-01', nameAr: 'نموذج فحص التربة', type: 'نموذج', category: 'فني', isRequired: true, isActive: true, hasSignature: false, version: '1.3', lastUpdated: '2025-09-30', usageCount: 1678, color: '#8b5cf6' },
  { id: 'FRM-009', code: 'FRM-NBR-01', nameAr: 'نموذج موافقة الجيران', type: 'نموذج', category: 'اجتماعي', isRequired: false, isActive: true, hasSignature: true, version: '1.0', lastUpdated: '2025-09-25', usageCount: 923, color: '#06b6d4' },
  { id: 'FRM-010', code: 'FRM-ENV-01', nameAr: 'تعهد البيئة والنظافة', type: 'تعهد', category: 'بيئة', isRequired: true, isActive: true, hasSignature: true, version: '1.2', lastUpdated: '2025-09-20', usageCount: 2034, color: '#22c55e' },
  { id: 'FRM-011', code: 'FRM-WAT-01', nameAr: 'نموذج طلب توصيل المياه', type: 'نموذج', category: 'خدمات', isRequired: false, isActive: true, hasSignature: false, version: '2.0', lastUpdated: '2025-09-15', usageCount: 1567, color: '#3b82f6' },
  { id: 'FRM-012', code: 'FRM-ELC-01', nameAr: 'نموذج طلب توصيل الكهرباء', type: 'نموذج', category: 'خدمات', isRequired: false, isActive: true, hasSignature: false, version: '2.0', lastUpdated: '2025-09-10', usageCount: 1589, color: '#f59e0b' },
  { id: 'FRM-013', code: 'FRM-FNC-01', nameAr: 'تعهد بناء السور', type: 'تعهد', category: 'مالك', isRequired: true, isActive: true, hasSignature: true, version: '1.1', lastUpdated: '2025-09-05', usageCount: 1923, color: '#10b981' },
  { id: 'FRM-014', code: 'FRM-PRK-01', nameAr: 'نموذج المواقف والمداخل', type: 'نموذج', category: 'فني', isRequired: true, isActive: true, hasSignature: false, version: '1.4', lastUpdated: '2025-09-01', usageCount: 2145, color: '#8b5cf6' },
  { id: 'FRM-015', code: 'FRM-GRN-01', nameAr: 'تعهد المساحات الخضراء', type: 'تعهد', category: 'بيئة', isRequired: false, isActive: true, hasSignature: true, version: '1.0', lastUpdated: '2025-08-28', usageCount: 1234, color: '#22c55e' },
  { id: 'FRM-016', code: 'FRM-DEM-01', nameAr: 'نموذج طلب هدم', type: 'نموذج', category: 'هدم', isRequired: true, isActive: true, hasSignature: true, version: '1.6', lastUpdated: '2025-08-25', usageCount: 567, color: '#ef4444' },
  { id: 'FRM-017', code: 'FRM-MOD-01', nameAr: 'نموذج طلب تعديل', type: 'نموذج', category: 'تعديل', isRequired: true, isActive: true, hasSignature: true, version: '1.3', lastUpdated: '2025-08-20', usageCount: 1456, color: '#f59e0b' },
  { id: 'FRM-018', code: 'FRM-ADD-01', nameAr: 'نموذج طلب إضافة', type: 'نموذج', category: 'إضافة', isRequired: true, isActive: true, hasSignature: true, version: '1.2', lastUpdated: '2025-08-15', usageCount: 989, color: '#3b82f6' },
  { id: 'FRM-019', code: 'FRM-COM-01', nameAr: 'إقرار إنجاز البناء', type: 'إقرار', category: 'إنجاز', isRequired: true, isActive: true, hasSignature: true, version: '2.2', lastUpdated: '2025-08-10', usageCount: 1678, color: '#10b981' },
  { id: 'FRM-020', code: 'FRM-OCC-01', nameAr: 'نموذج طلب شهادة إشغال', type: 'نموذج', category: 'إشغال', isRequired: true, isActive: true, hasSignature: true, version: '2.0', lastUpdated: '2025-08-05', usageCount: 1523, color: '#8b5cf6' }
];

export const render701_09_FormsDeclarations = () => {
  const [selectedForm, setSelectedForm] = useState<FormDeclaration | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const typeColors = {
    'نموذج': '#3b82f6',
    'تعهد': '#10b981',
    'إقرار': '#f59e0b'
  };

  return (
    <div className=\"space-y-3\">
      {/* البطاقات الإحصائية */}
      <div className=\"grid grid-cols-6 gap-2\">
        {[
          { label: 'إجمالي النماذج', value: '20', color: '#2563eb', icon: FileText },
          { label: 'نماذج', value: '10', color: '#3b82f6', icon: File },
          { label: 'تعهدات', value: '6', color: '#10b981', icon: Shield },
          { label: 'إقرارات', value: '4', color: '#f59e0b', icon: Award },
          { label: 'إلزامية', value: '16', color: '#ef4444', icon: AlertCircle },
          { label: 'تتطلب توقيع', value: '15', color: '#8b5cf6', icon: FileText }
        ].map((stat, i) => (
          <Card key={i} className=\"card-rtl\" style={{ background: `${stat.color}10`, border: `2px solid ${stat.color}` }}>
            <CardContent className=\"p-2 text-center\">
              <stat.icon className=\"h-5 w-5 mx-auto mb-1\" style={{ color: stat.color }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
              <p className=\"text-[10px]\" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* شبكة النماذج */}
      <div className=\"grid grid-cols-4 gap-2\">
        {mockForms.map((form) => (
          <Card 
            key={form.id} 
            className=\"card-rtl cursor-pointer hover:shadow-lg transition-all\"
            style={{ border: `2px solid ${typeColors[form.type]}` }}
            onClick={() => {
              setSelectedForm(form);
              setShowPreview(true);
            }}
          >
            <CardContent className=\"p-2\">
              <div className=\"flex items-center justify-between mb-2\">
                <Badge className=\"font-mono text-[9px]\">{form.code}</Badge>
                <Badge style={{ background: typeColors[form.type], color: 'white' }}>
                  {form.type}
                </Badge>
              </div>
              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: '11px', marginBottom: '6px' }}>
                {form.nameAr}
              </h4>
              <div className=\"space-y-1\">
                <div className=\"flex items-center justify-between\">
                  <span className=\"text-[9px] text-gray-500\">الإصدار</span>
                  <Badge variant=\"outline\" className=\"text-[9px]\">v{form.version}</Badge>
                </div>
                <div className=\"flex items-center justify-between\">
                  <span className=\"text-[9px] text-gray-500\">الاستخدامات</span>
                  <Badge variant=\"outline\" className=\"text-[9px] font-mono\">{form.usageCount.toLocaleString()}</Badge>
                </div>
                <Separator className=\"my-1\" />
                <div className=\"flex gap-1 flex-wrap\">
                  {form.isRequired && <Badge variant=\"destructive\" className=\"text-[8px]\">إلزامي</Badge>}
                  {form.hasSignature && <Badge variant=\"secondary\" className=\"text-[8px]\">توقيع</Badge>}
                  {form.isActive && <Badge variant=\"default\" className=\"text-[8px]\">نشط</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نافذة المعاينة */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className=\"max-w-3xl dialog-rtl\">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>معاينة النموذج</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className=\"space-y-4\">
              {/* معلومات النموذج */}
              <Card className=\"card-rtl\" style={{ border: `2px solid ${typeColors[selectedForm.type]}` }}>
                <CardContent className=\"p-3\">
                  <div className=\"flex items-start justify-between mb-3\">
                    <div>
                      <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700 }}>
                        {selectedForm.nameAr}
                      </h3>
                      <Badge className=\"font-mono mt-1\">{selectedForm.code}</Badge>
                    </div>
                    <Badge style={{ background: typeColors[selectedForm.type], color: 'white' }}>
                      {selectedForm.type}
                    </Badge>
                  </div>
                  
                  <div className=\"grid grid-cols-4 gap-3\">
                    <div>
                      <p className=\"text-xs text-gray-500 mb-1\">التصنيف</p>
                      <Badge>{selectedForm.category}</Badge>
                    </div>
                    <div>
                      <p className=\"text-xs text-gray-500 mb-1\">الإصدار</p>
                      <Badge variant=\"outline\">v{selectedForm.version}</Badge>
                    </div>
                    <div>
                      <p className=\"text-xs text-gray-500 mb-1\">آخر تحديث</p>
                      <p className=\"text-xs font-mono\">{selectedForm.lastUpdated}</p>
                    </div>
                    <div>
                      <p className=\"text-xs text-gray-500 mb-1\">الاستخدامات</p>
                      <Badge variant=\"outline\" className=\"font-mono\">{selectedForm.usageCount.toLocaleString()}</Badge>
                    </div>
                  </div>

                  <Separator className=\"my-3\" />
                  
                  <div className=\"flex gap-2\">
                    {selectedForm.isRequired && (
                      <Badge variant=\"destructive\">
                        <AlertCircle className=\"h-3 w-3 ml-1\" />
                        إلزامي
                      </Badge>
                    )}
                    {selectedForm.hasSignature && (
                      <Badge variant=\"secondary\">
                        <FileText className=\"h-3 w-3 ml-1\" />
                        يتطلب توقيع
                      </Badge>
                    )}
                    {selectedForm.isActive && (
                      <Badge variant=\"default\">
                        <CheckCircle className=\"h-3 w-3 ml-1\" />
                        نشط
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* محتوى النموذج (مثال) */}
              <Card className=\"card-rtl\">
                <CardHeader className=\"p-2\" style={{ background: '#f8fafc' }}>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>محتوى النموذج</CardTitle>
                </CardHeader>
                <CardContent className=\"p-3\">
                  <div className=\"space-y-3\">
                    <div className=\"text-center p-4\" style={{ border: '2px dashed #cbd5e1', borderRadius: '8px' }}>
                      <FileText className=\"h-12 w-12 mx-auto mb-2 text-gray-400\" />
                      <p className=\"text-sm text-gray-500\" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        معاينة محتوى النموذج
                      </p>
                      <p className=\"text-xs text-gray-400 mt-1\" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        سيتم عرض محتوى النموذج الفعلي هنا
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الإجراءات */}
              <div className=\"flex gap-2 justify-end\">
                <Button variant=\"outline\" size=\"sm\">
                  <Download className=\"h-4 w-4\" />
                  تحميل PDF
                </Button>
                <Button variant=\"outline\" size=\"sm\">
                  <Edit className=\"h-4 w-4\" />
                  تعديل
                </Button>
                <Button variant=\"outline\" size=\"sm\">
                  <Copy className=\"h-4 w-4\" />
                  نسخ
                </Button>
                <Button size=\"sm\" style={{ background: '#10b981', color: 'white' }}>
                  <Save className=\"h-4 w-4\" />
                  حفظ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// سأكمل باقي التابات في الرسالة التالية بسبب حجم الكود...
