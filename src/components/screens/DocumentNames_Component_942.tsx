/**
 * مكون أسماء المستندات - للاستخدام في شاشة 942
 * ==================================================
 * 
 * تاب منفصل لإدارة أسماء المستندات الرئيسية
 * يتم استخدام هذه الأسماء في شاشة إعدادات المعاملات
 * 
 * @version 1.0
 * @date 2025-10-20
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { 
  FileText, Plus, Search, Edit, Trash2, Save, X, Copy, 
  CheckCircle, AlertCircle, Tag
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// واجهة اسم المستند
export interface DocumentName {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
  lastModified: string;
}

// بيانات افتراضية لأسماء المستندات
export const DEFAULT_DOCUMENT_NAMES: DocumentName[] = [
  {
    id: 'DN-001',
    code: 'ID-COPY',
    name: 'صورة الهوية الوطنية',
    description: 'نسخة من الهوية الوطنية سارية المفعول',
    category: 'وثائق شخصية',
    isActive: true,
    usageCount: 456,
    createdDate: '2024-01-15',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-002',
    code: 'DEED-COPY',
    name: 'صورة الصك',
    description: 'نسخة من صك الملكية',
    category: 'وثائق الملكية',
    isActive: true,
    usageCount: 389,
    createdDate: '2024-01-15',
    lastModified: '2025-10-18'
  },
  {
    id: 'DN-003',
    code: 'GEO-LOC',
    name: 'الموقع الجغرافي',
    description: 'إحداثيات الموقع الجغرافي للأرض',
    category: 'معلومات مساحية',
    isActive: true,
    usageCount: 342,
    createdDate: '2024-01-15',
    lastModified: '2025-10-19'
  },
  {
    id: 'DN-004',
    code: 'SITE-PHOTOS',
    name: 'صور الموقع',
    description: 'صور فوتوغرافية للموقع من زوايا مختلفة',
    category: 'معلومات مساحية',
    isActive: true,
    usageCount: 298,
    createdDate: '2024-01-15',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-005',
    code: 'ARCH-PLAN',
    name: 'المخطط المعماري',
    description: 'المخططات المعمارية للمشروع',
    category: 'مخططات هندسية',
    isActive: true,
    usageCount: 412,
    createdDate: '2024-01-15',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-006',
    code: 'STRUCT-PLAN',
    name: 'المخطط الإنشائي',
    description: 'المخططات الإنشائية والهيكلية',
    category: 'مخططات هندسية',
    isActive: true,
    usageCount: 387,
    createdDate: '2024-01-15',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-007',
    code: 'UTIL-STUDY',
    name: 'دراسة المرافق',
    description: 'دراسة توصيل المرافق (كهرباء، ماء، صرف)',
    category: 'دراسات فنية',
    isActive: true,
    usageCount: 245,
    createdDate: '2024-01-15',
    lastModified: '2025-10-18'
  },
  {
    id: 'DN-008',
    code: 'TECH-REPORT',
    name: 'تقرير فني',
    description: 'تقرير فني شامل عن المشروع',
    category: 'تقارير',
    isActive: true,
    usageCount: 189,
    createdDate: '2024-01-15',
    lastModified: '2025-10-19'
  },
  {
    id: 'DN-009',
    code: 'SURVEY-PLAN',
    name: 'مخطط المساحة',
    description: 'المخطط المساحي للأرض',
    category: 'مخططات مساحية',
    isActive: true,
    usageCount: 334,
    createdDate: '2024-01-16',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-010',
    code: 'SURVEY-REPORT',
    name: 'تقرير المسح',
    description: 'تقرير المسح الميداني',
    category: 'تقارير',
    isActive: true,
    usageCount: 267,
    createdDate: '2024-01-16',
    lastModified: '2025-10-19'
  },
  {
    id: 'DN-011',
    code: 'CALC-SURVEY',
    name: 'الحسابات المساحية',
    description: 'الحسابات والقياسات المساحية',
    category: 'معلومات مساحية',
    isActive: true,
    usageCount: 223,
    createdDate: '2024-01-16',
    lastModified: '2025-10-18'
  },
  {
    id: 'DN-012',
    code: 'INHERIT-DOC',
    name: 'حصر الورثة',
    description: 'وثيقة حصر الورثة من المحكمة',
    category: 'وثائق قانونية',
    isActive: true,
    usageCount: 145,
    createdDate: '2024-01-16',
    lastModified: '2025-10-17'
  },
  {
    id: 'DN-013',
    code: 'LICENSE',
    name: 'الترخيص',
    description: 'رخصة البناء أو الترخيص ذي الصلة',
    category: 'تراخيص',
    isActive: true,
    usageCount: 412,
    createdDate: '2024-01-17',
    lastModified: '2025-10-20'
  },
  {
    id: 'DN-014',
    code: 'POWER-ATTY',
    name: 'وكالة شرعية',
    description: 'وكالة شرعية من المالك',
    category: 'وثائق قانونية',
    isActive: true,
    usageCount: 198,
    createdDate: '2024-01-17',
    lastModified: '2025-10-19'
  },
  {
    id: 'DN-015',
    code: 'CONTRACT',
    name: 'العقد',
    description: 'عقد الاتفاق بين الأطراف',
    category: 'عقود',
    isActive: true,
    usageCount: 356,
    createdDate: '2024-01-18',
    lastModified: '2025-10-20'
  }
];

interface DocumentNamesComponentProps {
  onDocumentNamesChange?: (names: DocumentName[]) => void;
}

const DocumentNamesComponent: React.FC<DocumentNamesComponentProps> = ({ 
  onDocumentNamesChange 
}) => {
  const [documentNames, setDocumentNames] = useState<DocumentName[]>(DEFAULT_DOCUMENT_NAMES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentName | null>(null);
  
  // حقول النموذج
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    isActive: true
  });

  // الفئات المتاحة
  const categories = [
    'وثائق شخصية',
    'وثائق الملكية',
    'مخططات هندسية',
    'مخططات مساحية',
    'معلومات مساحية',
    'دراسات فنية',
    'تقارير',
    'وثائق قانونية',
    'تراخيص',
    'عقود'
  ];

  // فلترة البيانات
  const filteredData = documentNames.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.name.includes(searchQuery) ||
      doc.code.includes(searchQuery) ||
      doc.description.includes(searchQuery);
    
    const matchesCategory = filterCategory === 'الكل' || doc.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // إضافة مستند جديد
  const handleCreate = () => {
    if (!formData.code || !formData.name || !formData.category) {
      return;
    }

    const newDocument: DocumentName = {
      id: `DN-${String(documentNames.length + 1).padStart(3, '0')}`,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      isActive: formData.isActive,
      usageCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    const updatedList = [...documentNames, newDocument];
    setDocumentNames(updatedList);
    if (onDocumentNamesChange) {
      onDocumentNamesChange(updatedList);
    }

    // إعادة تعيين النموذج
    setFormData({
      code: '',
      name: '',
      description: '',
      category: '',
      isActive: true
    });
    setShowCreateDialog(false);
  };

  // تحديث مستند
  const handleEdit = () => {
    if (!selectedDocument || !formData.code || !formData.name || !formData.category) {
      return;
    }

    const updatedList = documentNames.map(doc => 
      doc.id === selectedDocument.id
        ? {
            ...doc,
            code: formData.code,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            isActive: formData.isActive,
            lastModified: new Date().toISOString().split('T')[0]
          }
        : doc
    );

    setDocumentNames(updatedList);
    if (onDocumentNamesChange) {
      onDocumentNamesChange(updatedList);
    }

    setShowEditDialog(false);
    setSelectedDocument(null);
  };

  // حذف مستند
  const handleDelete = (id: string) => {
    const updatedList = documentNames.filter(doc => doc.id !== id);
    setDocumentNames(updatedList);
    if (onDocumentNamesChange) {
      onDocumentNamesChange(updatedList);
    }
  };

  // فتح نافذة التعديل
  const openEditDialog = (doc: DocumentName) => {
    setSelectedDocument(doc);
    setFormData({
      code: doc.code,
      name: doc.name,
      description: doc.description,
      category: doc.category,
      isActive: doc.isActive
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-3">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'إجمالي الأسماء', value: documentNames.length, icon: FileText, color: 'blue' },
          { label: 'نشط', value: documentNames.filter(d => d.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'غير نشط', value: documentNames.filter(d => !d.isActive).length, icon: AlertCircle, color: 'gray' },
          { label: 'الفئات', value: categories.length, icon: Tag, color: 'purple' },
          { label: 'الاستخدام', value: documentNames.reduce((sum, d) => sum + d.usageCount, 0), icon: Copy, color: 'orange' }
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
                {stat.value.toLocaleString('ar-SA')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* شريط البحث والإضافة */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <InputWithCopy
                label="بحث في أسماء المستندات"
                id="search-docs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الكود، أو الوصف..."
                copyable={false}
                clearable={true}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                فلترة حسب الفئة
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <option value="الكل">جميع الفئات</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFormData({
                    code: '',
                    name: '',
                    description: '',
                    category: '',
                    isActive: true
                  });
                  setShowCreateDialog(true);
                }}
                className="w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة اسم مستند
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول أسماء المستندات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            قائمة أسماء المستندات ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '40px' }}>
                    #
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                    الكود
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اسم المستند
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الوصف
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                    الفئة
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '80px' }}>
                    الحالة
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '90px' }}>
                    الاستخدام
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '140px' }}>
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((doc, index) => (
                  <TableRow key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-xs">
                        {doc.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {doc.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {doc.description}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {doc.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.isActive ? (
                        <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {doc.usageCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(doc)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف "${doc.name}"؟`)) {
                              handleDelete(doc.id);
                            }
                          }}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* نافذة الإضافة */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Plus className="h-5 w-5 inline ml-2" />
              إضافة اسم مستند جديد
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أدخل تفاصيل اسم المستند الجديد
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="كود المستند"
                id="doc-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="مثال: ID-COPY"
                required
                copyable={false}
                clearable={true}
              />

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <InputWithCopy
              label="اسم المستند"
              id="doc-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="مثال: صورة الهوية الوطنية"
              required
              copyable={false}
              clearable={true}
            />

            <TextAreaWithCopy
              label="الوصف"
              id="doc-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="وصف مختصر للمستند..."
              copyable={false}
              clearable={true}
            />

            <EnhancedSwitch
              id="is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              label="تفعيل الاسم"
              description="هل سيكون هذا الاسم نشطاً ومتاحاً للاستخدام؟"
              variant="success"
              size="md"
            />
          </div>

          <DialogFooter className="gap-2" style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.code || !formData.name || !formData.category}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التعديل */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Edit className="h-5 w-5 inline ml-2" />
              تعديل اسم المستند
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قم بتعديل تفاصيل اسم المستند
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="كود المستند"
                id="edit-doc-code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                required
                copyable={false}
                clearable={true}
              />

              <div>
                <label className="block text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الفئة *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <InputWithCopy
              label="اسم المستند"
              id="edit-doc-name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              copyable={false}
              clearable={true}
            />

            <TextAreaWithCopy
              label="الوصف"
              id="edit-doc-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              copyable={false}
              clearable={true}
            />

            <EnhancedSwitch
              id="edit-is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              label="تفعيل الاسم"
              description="هل سيكون هذا الاسم نشطاً ومتاحاً للاستخدام؟"
              variant="success"
              size="md"
            />
          </div>

          <DialogFooter className="gap-2" style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedDocument(null);
              }}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!formData.code || !formData.name || !formData.category}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentNamesComponent;
