/**
 * التاب 287-08 - ملفات إنهاء المعاملة v1.0
 * ==============================================
 * 
 * التاب الثامن في شاشة المعاملات البسيطة (287)
 * يعرض جميع ملفات ووثائق إنهاء المعاملة النهائية
 * 
 * المميزات:
 * ✅ عرض جميع المخططات النهائية (معماري، إنشائي، MEP، ديكور)
 * ✅ الوثائق الرسمية (شهادة إتمام، شهادة الإشغال، رخصة البناء...)
 * ✅ إمكانية المعاينة والتحميل والطباعة والإرسال
 * ✅ تصنيف حسب النوع مع أيقونات ملونة
 * ✅ تتبع حالة كل ملف (مكتمل، قيد المراجعة، معتمد)
 * ✅ ربط بنظام طباعة المخططات النهائية
 * 
 * @version 1.0
 * @date 9 نوفمبر 2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import {
  FileText, Download, Eye, Printer, Send, CheckCircle, Clock, AlertCircle,
  Image as ImageIcon, File, FileCheck, Building2, Hammer, Zap, Palette,
  type LucideIcon
} from 'lucide-react';

// ============================================================
// الواجهات
// ============================================================

interface FinalFile {
  id: string;
  type: 'architectural' | 'structural' | 'mep' | 'interior' | 'certificate' | 'license' | 'other';
  category: 'مخططات' | 'وثائق رسمية' | 'شهادات' | 'مستندات أخرى';
  name: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'مكتمل' | 'قيد المراجعة' | 'معتمد' | 'مرفوض';
  version: string;
  notes?: string;
  approvedBy?: string;
  approvalDate?: string;
}

interface FileTypeInfo {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// ============================================================
// البيانات الوهمية - ملفات إنهاء المعاملة
// ============================================================

const mockFinalFiles: FinalFile[] = [
  // المخططات المعمارية
  {
    id: 'FF-001',
    type: 'architectural',
    category: 'مخططات',
    name: 'المخطط المعماري النهائي - الواجهة الرئيسية',
    fileName: 'architectural_front_final.pdf',
    fileSize: '8.2 MB',
    uploadDate: '2025-10-15',
    uploadedBy: 'م. أحمد السالم',
    status: 'معتمد',
    version: 'v3.2',
    notes: 'معتمد من الأمانة - رقم الاعتماد: 45123',
    approvedBy: 'م. خالد المطيري',
    approvalDate: '2025-10-18'
  },
  {
    id: 'FF-002',
    type: 'architectural',
    category: 'مخططات',
    name: 'المخطط المعماري النهائي - المساقط الأفقية',
    fileName: 'architectural_plans_final.pdf',
    fileSize: '12.5 MB',
    uploadDate: '2025-10-15',
    uploadedBy: 'م. أحمد السالم',
    status: 'معتمد',
    version: 'v3.2',
    approvedBy: 'م. خالد المطيري',
    approvalDate: '2025-10-18'
  },
  
  // المخططات الإنشائية
  {
    id: 'FF-003',
    type: 'structural',
    category: 'مخططات',
    name: 'المخطط الإنشائي النهائي - الأساسات',
    fileName: 'structural_foundation_final.pdf',
    fileSize: '6.8 MB',
    uploadDate: '2025-10-16',
    uploadedBy: 'م. عبدالله العتيبي',
    status: 'معتمد',
    version: 'v2.1',
    approvedBy: 'م. محمد الغامدي',
    approvalDate: '2025-10-19'
  },
  {
    id: 'FF-004',
    type: 'structural',
    category: 'مخططات',
    name: 'المخطط الإنشائي النهائي - الهيكل الإنشائي',
    fileName: 'structural_frame_final.pdf',
    fileSize: '9.3 MB',
    uploadDate: '2025-10-16',
    uploadedBy: 'م. عبدالله العتيبي',
    status: 'معتمد',
    version: 'v2.1',
    approvedBy: 'م. محمد الغامدي',
    approvalDate: '2025-10-19'
  },
  
  // مخططات MEP
  {
    id: 'FF-005',
    type: 'mep',
    category: 'مخططات',
    name: 'مخططات الكهرباء النهائية',
    fileName: 'mep_electrical_final.pdf',
    fileSize: '5.2 MB',
    uploadDate: '2025-10-17',
    uploadedBy: 'م. فهد الشمري',
    status: 'معتمد',
    version: 'v1.8',
    approvedBy: 'م. سلطان القحطاني',
    approvalDate: '2025-10-20'
  },
  {
    id: 'FF-006',
    type: 'mep',
    category: 'مخططات',
    name: 'مخططات السباكة والصرف الصحي النهائية',
    fileName: 'mep_plumbing_final.pdf',
    fileSize: '4.7 MB',
    uploadDate: '2025-10-17',
    uploadedBy: 'م. فهد الشمري',
    status: 'معتمد',
    version: 'v1.8',
    approvedBy: 'م. سلطان القحطاني',
    approvalDate: '2025-10-20'
  },
  {
    id: 'FF-007',
    type: 'mep',
    category: 'مخططات',
    name: 'مخططات التكييف والتهوية النهائية',
    fileName: 'mep_hvac_final.pdf',
    fileSize: '6.1 MB',
    uploadDate: '2025-10-17',
    uploadedBy: 'م. فهد الشمري',
    status: 'قيد المراجعة',
    version: 'v1.8',
    notes: 'في انتظار اعتماد المكتب الاستشاري'
  },
  
  // مخططات الديكور الداخلي
  {
    id: 'FF-008',
    type: 'interior',
    category: 'مخططات',
    name: 'مخططات الديكور الداخلي النهائية',
    fileName: 'interior_design_final.pdf',
    fileSize: '11.2 MB',
    uploadDate: '2025-10-18',
    uploadedBy: 'م. نورة الدوسري',
    status: 'معتمد',
    version: 'v2.0',
    approvedBy: 'المالك',
    approvalDate: '2025-10-22'
  },
  
  // الوثائق الرسمية
  {
    id: 'FF-009',
    type: 'license',
    category: 'وثائق رسمية',
    name: 'رخصة البناء النهائية المعتمدة',
    fileName: 'building_license_approved.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2025-10-20',
    uploadedBy: 'م. خالد المطيري',
    status: 'معتمد',
    version: 'نهائي',
    notes: 'رخصة بناء رقم: 45123/2025',
    approvedBy: 'أمانة الرياض',
    approvalDate: '2025-10-20'
  },
  {
    id: 'FF-010',
    type: 'certificate',
    category: 'شهادات',
    name: 'شهادة إتمام البناء',
    fileName: 'completion_certificate.pdf',
    fileSize: '1.5 MB',
    uploadDate: '2025-10-25',
    uploadedBy: 'م. أحمد السالم',
    status: 'مكتمل',
    version: 'نهائي',
    notes: 'شهادة إتمام من المكتب الهندسي'
  },
  {
    id: 'FF-011',
    type: 'certificate',
    category: 'شهادات',
    name: 'شهادة الإشغال النهائية',
    fileName: 'occupancy_certificate.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2025-10-28',
    uploadedBy: 'م. خالد المطيري',
    status: 'قيد المراجعة',
    version: 'نهائي',
    notes: 'في انتظار اعتماد الدفاع المدني'
  },
  
  // مستندات أخرى
  {
    id: 'FF-012',
    type: 'other',
    category: 'مستندات أخرى',
    name: 'تقرير الاستشاري النهائي',
    fileName: 'consultant_final_report.pdf',
    fileSize: '3.2 MB',
    uploadDate: '2025-10-22',
    uploadedBy: 'م. محمد الغامدي',
    status: 'مكتمل',
    version: 'v1.0'
  }
];

// معلومات أنواع الملفات
const FILE_TYPE_INFO: Record<FinalFile['type'], FileTypeInfo> = {
  architectural: {
    label: 'معماري',
    icon: Building2,
    color: '#2563eb',
    bgColor: '#dbeafe'
  },
  structural: {
    label: 'إنشائي',
    icon: Hammer,
    color: '#dc2626',
    bgColor: '#fee2e2'
  },
  mep: {
    label: 'كهروميكانيكال',
    icon: Zap,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  interior: {
    label: 'ديكور داخلي',
    icon: Palette,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  certificate: {
    label: 'شهادة',
    icon: FileCheck,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  license: {
    label: 'رخصة',
    icon: FileText,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  other: {
    label: 'أخرى',
    icon: File,
    color: '#6b7280',
    bgColor: '#f3f4f6'
  }
};

// ألوان الحالات
const STATUS_COLORS: Record<FinalFile['status'], { bg: string; text: string; border: string }> = {
  'مكتمل': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  'قيد المراجعة': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  'معتمد': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
  'مرفوض': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
};

// ============================================================
// المكون الرئيسي
// ============================================================

const Tab_287_08_FinalFiles_Complete: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FinalFile | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('الكل');
  const [filterStatus, setFilterStatus] = useState<string>('الكل');

  // تصفية الملفات
  const filteredFiles = mockFinalFiles.filter(file => {
    if (filterCategory !== 'الكل' && file.category !== filterCategory) return false;
    if (filterStatus !== 'الكل' && file.status !== filterStatus) return false;
    return true;
  });

  // عرض تفاصيل الملف
  const handleViewDetails = (file: FinalFile) => {
    setSelectedFile(file);
    setShowDetailsDialog(true);
  };

  // تحميل الملف
  const handleDownload = (file: FinalFile) => {
    alert(`جاري تحميل: ${file.name}`);
  };

  // طباعة الملف
  const handlePrint = (file: FinalFile) => {
    alert(`جاري طباعة: ${file.name}`);
  };

  // إرسال الملف
  const handleSend = (file: FinalFile) => {
    alert(`جاري إرسال: ${file.name}`);
  };

  // حساب الإحصائيات
  const stats = {
    total: mockFinalFiles.length,
    completed: mockFinalFiles.filter(f => f.status === 'مكتمل').length,
    approved: mockFinalFiles.filter(f => f.status === 'معتمد').length,
    underReview: mockFinalFiles.filter(f => f.status === 'قيد المراجعة').length,
    plans: mockFinalFiles.filter(f => f.category === 'مخططات').length,
    certificates: mockFinalFiles.filter(f => f.category === 'شهادات' || f.category === 'وثائق رسمية').length
  };

  return (
    <div className="space-y-4">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: '2px solid #93c5fd'
        }}>
          <CardContent className="p-3 text-center">
            <FileText className="h-5 w-5 mx-auto text-[#2563eb] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af', fontWeight: 700 }}>
              {stats.total}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              إجمالي الملفات
            </p>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #fbbf24'
        }}>
          <CardContent className="p-3 text-center">
            <ImageIcon className="h-5 w-5 mx-auto text-[#f59e0b] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontWeight: 700 }}>
              {stats.plans}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              المخططات
            </p>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '2px solid #6ee7b7'
        }}>
          <CardContent className="p-3 text-center">
            <FileCheck className="h-5 w-5 mx-auto text-[#10b981] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46', fontWeight: 700 }}>
              {stats.certificates}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              الوثائق والشهادات
            </p>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
          border: '2px solid #a5b4fc'
        }}>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-[#6366f1] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4338ca', fontWeight: 700 }}>
              {stats.completed}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              مكتمل
            </p>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '2px solid #6ee7b7'
        }}>
          <CardContent className="p-3 text-center">
            <FileCheck className="h-5 w-5 mx-auto text-[#10b981] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#065f46', fontWeight: 700 }}>
              {stats.approved}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              معتمد
            </p>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #fbbf24'
        }}>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-[#f59e0b] mb-1" />
            <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e', fontWeight: 700 }}>
              {stats.underReview}
            </p>
            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              قيد المراجعة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* الفلاتر */}
      <Card className="card-rtl">
        <CardHeader style={{ padding: '12px 16px' }}>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', margin: 0 }}>
              تصفية الملفات
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                الفئة
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field w-full text-xs"
                style={{ fontFamily: 'Tajawal, sans-serif', padding: '6px 10px', height: '32px' }}
              >
                <option value="الكل">جميع الفئات</option>
                <option value="مخططات">مخططات</option>
                <option value="وثائق رسمية">وثائق رسمية</option>
                <option value="شهادات">شهادات</option>
                <option value="مستندات أخرى">مستندات أخرى</option>
              </select>
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-full text-xs"
                style={{ fontFamily: 'Tajawal, sans-serif', padding: '6px 10px', height: '32px' }}
              >
                <option value="الكل">جميع الحالات</option>
                <option value="مكتمل">مكتمل</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="معتمد">معتمد</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول الملفات */}
      <Card className="card-rtl">
        <CardHeader style={{ padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', margin: 0 }}>
            ملفات إنهاء المعاملة ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea style={{ height: 'calc(100vh - 480px)' }}>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '50px' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>الحجم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>التاريخ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '180px' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file, index) => {
                  const typeInfo = FILE_TYPE_INFO[file.type];
                  const TypeIcon = typeInfo.icon;
                  const statusColor = STATUS_COLORS[file.status];

                  return (
                    <TableRow key={file.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            backgroundColor: typeInfo.bgColor,
                            color: typeInfo.color,
                            border: `1px solid ${typeInfo.color}`,
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {file.name}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                        {file.fileSize}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                        {file.uploadDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          style={{ 
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`,
                            fontFamily: 'Tajawal, sans-serif',
                            fontSize: '10px'
                          }}
                        >
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(file)}
                            style={{ height: '28px', padding: '0 8px' }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(file)}
                            style={{ height: '28px', padding: '0 8px' }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePrint(file)}
                            style={{ height: '28px', padding: '0 8px' }}
                          >
                            <Printer className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSend(file)}
                            style={{ height: '28px', padding: '0 8px' }}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* نافذة التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل الملف
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedFile?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4">
              {/* المعلومات الأساسية */}
              <Card className="card-rtl">
                <CardHeader style={{ padding: '10px 14px' }}>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', margin: 0 }}>
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        النوع
                      </p>
                      <div>
                        {(() => {
                          const typeInfo = FILE_TYPE_INFO[selectedFile.type];
                          const TypeIcon = typeInfo.icon;
                          return (
                            <Badge 
                              style={{ 
                                backgroundColor: typeInfo.bgColor,
                                color: typeInfo.color,
                                border: `1px solid ${typeInfo.color}`,
                                fontFamily: 'Tajawal, sans-serif',
                                fontSize: '11px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <TypeIcon className="h-3 w-3" />
                              {typeInfo.label}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الحالة
                      </p>
                      <Badge 
                        style={{ 
                          backgroundColor: STATUS_COLORS[selectedFile.status].bg,
                          color: STATUS_COLORS[selectedFile.status].text,
                          border: `1px solid ${STATUS_COLORS[selectedFile.status].border}`,
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '11px'
                        }}
                      >
                        {selectedFile.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اسم الملف
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                        {selectedFile.fileName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حجم الملف
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                        {selectedFile.fileSize}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تاريخ الرفع
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.uploadDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        رفع بواسطة
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.uploadedBy}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الإصدار
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                        {selectedFile.version}
                      </p>
                    </div>

                    {selectedFile.approvedBy && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اعتمد بواسطة
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {selectedFile.approvedBy}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            تاريخ الاعتماد
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {selectedFile.approvalDate}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {selectedFile.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        ملاحظات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {selectedFile.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* معاينة الملف (محاكاة) */}
              <Card className="card-rtl">
                <CardHeader style={{ padding: '10px 14px' }}>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', margin: 0 }}>
                    معاينة الملف
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div 
                    style={{
                      height: '200px',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      border: '2px dashed #9ca3af',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <FileText className="h-12 w-12 text-gray-400" />
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      معاينة المخطط
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
            {selectedFile && (
              <>
                <Button
                  onClick={() => handleSend(selectedFile)}
                  style={{ fontFamily: 'Tajawal, sans-serif', marginRight: '8px' }}
                >
                  <Send className="h-4 w-4 ml-1" />
                  إرسال
                </Button>
                <Button
                  onClick={() => handlePrint(selectedFile)}
                  style={{ fontFamily: 'Tajawal, sans-serif', marginRight: '8px' }}
                >
                  <Printer className="h-4 w-4 ml-1" />
                  طباعة
                </Button>
                <Button
                  onClick={() => handleDownload(selectedFile)}
                  style={{ fontFamily: 'Tajawal, sans-serif', marginRight: '8px' }}
                >
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab_287_08_FinalFiles_Complete;
