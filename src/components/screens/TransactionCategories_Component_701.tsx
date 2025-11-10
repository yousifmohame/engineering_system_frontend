/**
 * مكون تصنيفات المعاملات - للاستخدام في شاشة 701
 * ======================================================
 * 
 * تابين منفصلين:
 * - التصنيفات الرئيسية (مع المستندات الافتراضية)
 * - التصنيفات الفرعية (ترتبط بالرئيسية)
 * 
 * يستخدم أسماء المستندات من شاشة 942
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
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Folder, FolderTree, Plus, Edit, Trash2, Save, FileText,
  CheckCircle, XCircle, Tag, List, Settings, Copy
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { DEFAULT_DOCUMENT_NAMES, type DocumentName } from './DocumentNames_Component_942';

// واجهات البيانات
export interface RequiredDocument {
  documentId: string;
  documentName: string;
  documentCode: string;
  isRequired: boolean;
  notes?: string;
}

export interface MainCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  requiredDocuments: RequiredDocument[];
  isActive: boolean;
  subcategoriesCount: number;
  usageCount: number;
  createdDate: string;
}

export interface SubCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  mainCategoryId: string;
  mainCategoryName: string;
  additionalDocuments: RequiredDocument[];
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

// بيانات افتراضية للتصنيفات الرئيسية
const DEFAULT_MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'MC-001',
    code: 'BUILD-LIC',
    name: 'ترخيص بناء',
    description: 'معاملات ترخيص البناء للمباني السكنية والتجارية والصناعية',
    requiredDocuments: [
      { documentId: 'DN-001', documentName: 'صورة الهوية الوطنية', documentCode: 'ID-COPY', isRequired: true },
      { documentId: 'DN-002', documentName: 'صورة الصك', documentCode: 'DEED-COPY', isRequired: true },
      { documentId: 'DN-003', documentName: 'الموقع الجغرافي', documentCode: 'GEO-LOC', isRequired: true },
      { documentId: 'DN-004', documentName: 'صور الموقع', documentCode: 'SITE-PHOTOS', isRequired: false },
      { documentId: 'DN-005', documentName: 'المخطط المعماري', documentCode: 'ARCH-PLAN', isRequired: true },
      { documentId: 'DN-006', documentName: 'المخطط الإنشائي', documentCode: 'STRUCT-PLAN', isRequired: true },
      { documentId: 'DN-007', documentName: 'دراسة المرافق', documentCode: 'UTIL-STUDY', isRequired: true }
    ],
    isActive: true,
    subcategoriesCount: 3,
    usageCount: 567,
    createdDate: '2024-01-15'
  },
  {
    id: 'MC-002',
    code: 'SUBDIVIDE',
    name: 'إفراز',
    description: 'معاملات إفراز الأراضي وتقسيمها',
    requiredDocuments: [
      { documentId: 'DN-002', documentName: 'صورة الصك', documentCode: 'DEED-COPY', isRequired: true },
      { documentId: 'DN-001', documentName: 'صورة الهوية الوطنية', documentCode: 'ID-COPY', isRequired: true },
      { documentId: 'DN-009', documentName: 'مخطط المساحة', documentCode: 'SURVEY-PLAN', isRequired: true },
      { documentId: 'DN-010', documentName: 'تقرير المسح', documentCode: 'SURVEY-REPORT', isRequired: true },
      { documentId: 'DN-011', documentName: 'الحسابات المساحية', documentCode: 'CALC-SURVEY', isRequired: true }
    ],
    isActive: true,
    subcategoriesCount: 3,
    usageCount: 423,
    createdDate: '2024-01-15'
  },
  {
    id: 'MC-003',
    code: 'RENOVATION',
    name: 'ترميم',
    description: 'معاملات ترميم المباني القائمة',
    requiredDocuments: [
      { documentId: 'DN-001', documentName: 'صورة الهوية الوطنية', documentCode: 'ID-COPY', isRequired: true },
      { documentId: 'DN-002', documentName: 'صورة الصك', documentCode: 'DEED-COPY', isRequired: true },
      { documentId: 'DN-013', documentName: 'الترخيص', documentCode: 'LICENSE', isRequired: false },
      { documentId: 'DN-005', documentName: 'المخطط المعماري', documentCode: 'ARCH-PLAN', isRequired: true },
      { documentId: 'DN-008', documentName: 'تقرير فني', documentCode: 'TECH-REPORT', isRequired: true }
    ],
    isActive: true,
    subcategoriesCount: 2,
    usageCount: 298,
    createdDate: '2024-01-16'
  },
  {
    id: 'MC-004',
    code: 'DEMOLISH',
    name: 'هدم',
    description: 'معاملات هدم المباني',
    requiredDocuments: [
      { documentId: 'DN-001', documentName: 'صورة الهوية الوطنية', documentCode: 'ID-COPY', isRequired: true },
      { documentId: 'DN-002', documentName: 'صورة الصك', documentCode: 'DEED-COPY', isRequired: true },
      { documentId: 'DN-008', documentName: 'تقرير فني', documentCode: 'TECH-REPORT', isRequired: true },
      { documentId: 'DN-004', documentName: 'صور الموقع', documentCode: 'SITE-PHOTOS', isRequired: true }
    ],
    isActive: true,
    subcategoriesCount: 1,
    usageCount: 145,
    createdDate: '2024-01-16'
  }
];

// بيانات افتراضية للتصنيفات الفرعية
const DEFAULT_SUB_CATEGORIES: SubCategory[] = [
  {
    id: 'SC-001',
    code: 'RES-BUILD',
    name: 'بناء سكني',
    description: 'ترخيص بناء للمباني السكنية',
    mainCategoryId: 'MC-001',
    mainCategoryName: 'ترخيص بناء',
    additionalDocuments: [
      { documentId: 'DN-007', documentName: 'دراسة المرافق', documentCode: 'UTIL-STUDY', isRequired: true, notes: 'مطلوب للمباني السكنية' }
    ],
    isActive: true,
    usageCount: 342,
    createdDate: '2024-01-15'
  },
  {
    id: 'SC-002',
    code: 'COM-BUILD',
    name: 'بناء تجاري',
    description: 'ترخيص بناء للمباني التجارية',
    mainCategoryId: 'MC-001',
    mainCategoryName: 'ترخيص بناء',
    additionalDocuments: [
      { documentId: 'DN-015', documentName: 'العقد', documentCode: 'CONTRACT', isRequired: false, notes: 'عقد الإيجار للمحل إن وجد' }
    ],
    isActive: true,
    usageCount: 189,
    createdDate: '2024-01-15'
  },
  {
    id: 'SC-003',
    code: 'IND-BUILD',
    name: 'بناء صناعي',
    description: 'ترخيص بناء للمباني الصناعية',
    mainCategoryId: 'MC-001',
    mainCategoryName: 'ترخيص بناء',
    additionalDocuments: [
      { documentId: 'DN-013', documentName: 'الترخيص', documentCode: 'LICENSE', isRequired: true, notes: 'ترخيص النشاط الصناعي' },
      { documentId: 'DN-008', documentName: 'تقرير فني', documentCode: 'TECH-REPORT', isRequired: true, notes: 'دراسة الأثر البيئي' }
    ],
    isActive: true,
    usageCount: 67,
    createdDate: '2024-01-15'
  },
  {
    id: 'SC-004',
    code: 'LAND-SPLIT',
    name: 'تقسيم أرض',
    description: 'إفراز وتقسيم الأراضي',
    mainCategoryId: 'MC-002',
    mainCategoryName: 'إفراز',
    additionalDocuments: [],
    isActive: true,
    usageCount: 234,
    createdDate: '2024-01-15'
  },
  {
    id: 'SC-005',
    code: 'INHERIT',
    name: 'إفراز إرثي',
    description: 'إفراز الأراضي الموروثة',
    mainCategoryId: 'MC-002',
    mainCategoryName: 'إفراز',
    additionalDocuments: [
      { documentId: 'DN-012', documentName: 'حصر الورثة', documentCode: 'INHERIT-DOC', isRequired: true, notes: 'إلزامي للإفراز الإرثي' }
    ],
    isActive: true,
    usageCount: 145,
    createdDate: '2024-01-15'
  }
];

interface TransactionCategoriesComponentProps {
  activeSubTab: 'main' | 'sub';
}

const TransactionCategoriesComponent: React.FC<TransactionCategoriesComponentProps> = ({ 
  activeSubTab 
}) => {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>(DEFAULT_MAIN_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(DEFAULT_SUB_CATEGORIES);
  const [showMainDialog, setShowMainDialog] = useState(false);
  const [showSubDialog, setShowSubDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [editingMain, setEditingMain] = useState<MainCategory | null>(null);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<RequiredDocument[]>([]);

  // حقول النموذج الرئيسي
  const [mainForm, setMainForm] = useState({
    code: '',
    name: '',
    description: '',
    isActive: true
  });

  // حقول النموذج الفرعي
  const [subForm, setSubForm] = useState({
    code: '',
    name: '',
    description: '',
    mainCategoryId: '',
    isActive: true
  });

  // عرض تصنيف رئيسي
  const renderMainCategories = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي التصنيفات', value: mainCategories.length, icon: Folder, color: 'blue' },
          { label: 'نشط', value: mainCategories.filter(c => c.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'التصنيفات الفرعية', value: subCategories.length, icon: FolderTree, color: 'purple' },
          { label: 'الاستخدام', value: mainCategories.reduce((sum, c) => sum + c.usageCount, 0), icon: Copy, color: 'orange' }
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

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setMainForm({ code: '', name: '', description: '', isActive: true });
            setSelectedDocuments([]);
            setEditingMain(null);
            setShowMainDialog(true);
          }}
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة تصنيف رئيسي
        </Button>
      </div>

      {/* جدول التصنيفات */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التصنيفات الرئيسية ({mainCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                  الاسم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الوصف
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                  المستندات
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '90px' }}>
                  الفرعية
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
              {mainCategories.map((category, index) => (
                <TableRow key={category.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {category.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {category.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {category.requiredDocuments.length} مستند
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {category.subcategoriesCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {category.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingMain(category);
                          setMainForm({
                            code: category.code,
                            name: category.name,
                            description: category.description,
                            isActive: category.isActive
                          });
                          setSelectedDocuments(category.requiredDocuments);
                          setShowMainDialog(true);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedDocuments(category.requiredDocuments);
                          setShowDocumentsDialog(true);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <FileText className="h-3.5 w-3.5" />
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

  // عرض تصنيفات فرعية
  const renderSubCategories = () => (
    <div className="space-y-3">
      {/* إحصائيات */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'إجمالي الفرعية', value: subCategories.length, icon: FolderTree, color: 'purple' },
          { label: 'نشط', value: subCategories.filter(c => c.isActive).length, icon: CheckCircle, color: 'green' },
          { label: 'التصنيفات الرئيسية', value: mainCategories.length, icon: Folder, color: 'blue' },
          { label: 'الاستخدام', value: subCategories.reduce((sum, c) => sum + c.usageCount, 0), icon: Copy, color: 'orange' }
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

      {/* زر إضافة */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSubForm({ code: '', name: '', description: '', mainCategoryId: '', isActive: true });
            setSelectedDocuments([]);
            setEditingSub(null);
            setShowSubDialog(true);
          }}
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة تصنيف فرعي
        </Button>
      </div>

      {/* جدول التصنيفات الفرعية */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التصنيفات الفرعية ({subCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                  الاسم
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التصنيف الرئيسي
                </TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '120px' }}>
                  مستندات إضافية
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
              {subCategories.map((category, index) => (
                <TableRow key={category.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {category.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {category.mainCategoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {category.additionalDocuments.length} مستند
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {category.isActive ? (
                      <Badge className="bg-green-500 text-white text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-400 text-white text-xs">غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSub(category);
                          setSubForm({
                            code: category.code,
                            name: category.name,
                            description: category.description,
                            mainCategoryId: category.mainCategoryId,
                            isActive: category.isActive
                          });
                          setSelectedDocuments(category.additionalDocuments);
                          setShowSubDialog(true);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
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

  return (
    <div className="space-y-3">
      {activeSubTab === 'main' && renderMainCategories()}
      {activeSubTab === 'sub' && renderSubCategories()}

      {/* نافذة التصنيف الرئيسي */}
      <Dialog open={showMainDialog} onOpenChange={setShowMainDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {editingMain ? 'تعديل تصنيف رئيسي' : 'إضافة تصنيف رئيسي'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              حدد المستندات الافتراضية التي ستطلب عند اختيار هذا التصنيف
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="كود التصنيف"
                id="main-code"
                value={mainForm.code}
                onChange={(e) => setMainForm({...mainForm, code: e.target.value.toUpperCase()})}
                placeholder="مثال: BUILD-LIC"
                required
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="اسم التصنيف"
                id="main-name"
                value={mainForm.name}
                onChange={(e) => setMainForm({...mainForm, name: e.target.value})}
                placeholder="مثال: ترخيص بناء"
                required
                copyable={false}
                clearable={true}
              />
            </div>

            <TextAreaWithCopy
              label="الوصف"
              id="main-description"
              value={mainForm.description}
              onChange={(e) => setMainForm({...mainForm, description: e.target.value})}
              rows={2}
              placeholder="وصف التصنيف..."
              copyable={false}
              clearable={true}
            />

            <Separator />

            <div>
              <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileText className="h-4 w-4 inline ml-2" />
                المستندات الافتراضية المطلوبة
              </h3>
              
              <ScrollArea className="h-[300px] border rounded-lg p-3">
                <div className="space-y-2">
                  {DEFAULT_DOCUMENT_NAMES.filter(d => d.isActive).map(doc => {
                    const isSelected = selectedDocuments.some(sd => sd.documentId === doc.id);
                    const selectedDoc = selectedDocuments.find(sd => sd.documentId === doc.id);
                    
                    return (
                      <div key={doc.id} className="flex items-start gap-3 p-2 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments([...selectedDocuments, {
                                documentId: doc.id,
                                documentName: doc.name,
                                documentCode: doc.code,
                                isRequired: true
                              }]);
                            } else {
                              setSelectedDocuments(selectedDocuments.filter(sd => sd.documentId !== doc.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {doc.code}
                            </Badge>
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {doc.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {doc.description}
                          </p>
                          {isSelected && (
                            <div className="mt-2">
                              <label className="flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={selectedDoc?.isRequired !== false}
                                  onChange={(e) => {
                                    setSelectedDocuments(selectedDocuments.map(sd =>
                                      sd.documentId === doc.id
                                        ? {...sd, isRequired: e.target.checked}
                                        : sd
                                    ));
                                  }}
                                />
                                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  إلزامي
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mt-2 text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تم اختيار {selectedDocuments.length} مستند
              </div>
            </div>

            <EnhancedSwitch
              id="main-active"
              checked={mainForm.isActive}
              onCheckedChange={(checked) => setMainForm({...mainForm, isActive: checked})}
              label="تفعيل التصنيف"
              description="هل سيكون هذا التصنيف متاحاً للاستخدام؟"
              variant="success"
              size="md"
            />
          </div>

          <DialogFooter className="gap-2" style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowMainDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                // TODO: حفظ التصنيف
                setShowMainDialog(false);
              }}
              disabled={!mainForm.code || !mainForm.name}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التصنيف الفرعي */}
      <Dialog open={showSubDialog} onOpenChange={setShowSubDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {editingSub ? 'تعديل تصنيف فرعي' : 'إضافة تصنيف فرعي'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              حدد التصنيف الرئيسي والمستندات الإضافية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التصنيف الرئيسي *
              </label>
              <select
                value={subForm.mainCategoryId}
                onChange={(e) => setSubForm({...subForm, mainCategoryId: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
                required
              >
                <option value="">اختر التصنيف الرئيسي</option>
                {mainCategories.filter(c => c.isActive).map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.code} - {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="كود التصنيف الفرعي"
                id="sub-code"
                value={subForm.code}
                onChange={(e) => setSubForm({...subForm, code: e.target.value.toUpperCase()})}
                placeholder="مثال: RES-BUILD"
                required
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="اسم التصنيف الفرعي"
                id="sub-name"
                value={subForm.name}
                onChange={(e) => setSubForm({...subForm, name: e.target.value})}
                placeholder="مثال: بناء سكني"
                required
                copyable={false}
                clearable={true}
              />
            </div>

            <TextAreaWithCopy
              label="الوصف"
              id="sub-description"
              value={subForm.description}
              onChange={(e) => setSubForm({...subForm, description: e.target.value})}
              rows={2}
              placeholder="وصف التصنيف الفرعي..."
              copyable={false}
              clearable={true}
            />

            <Separator />

            <div>
              <h3 className="text-sm mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <FileText className="h-4 w-4 inline ml-2" />
                المستندات الإضافية (تضاف للمستندات الافتراضية من التصنيف الرئيسي)
              </h3>
              
              <ScrollArea className="h-[250px] border rounded-lg p-3">
                <div className="space-y-2">
                  {DEFAULT_DOCUMENT_NAMES.filter(d => d.isActive).map(doc => {
                    const isSelected = selectedDocuments.some(sd => sd.documentId === doc.id);
                    const selectedDoc = selectedDocuments.find(sd => sd.documentId === doc.id);
                    
                    return (
                      <div key={doc.id} className="flex items-start gap-3 p-2 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments([...selectedDocuments, {
                                documentId: doc.id,
                                documentName: doc.name,
                                documentCode: doc.code,
                                isRequired: true
                              }]);
                            } else {
                              setSelectedDocuments(selectedDocuments.filter(sd => sd.documentId !== doc.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs font-mono">
                              {doc.code}
                            </Badge>
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {doc.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="ملاحظة (اختياري)..."
                                value={selectedDoc?.notes || ''}
                                onChange={(e) => {
                                  setSelectedDocuments(selectedDocuments.map(sd =>
                                    sd.documentId === doc.id
                                      ? {...sd, notes: e.target.value}
                                      : sd
                                  ));
                                }}
                                className="w-full text-xs px-2 py-1 border rounded"
                                style={{ fontFamily: 'Tajawal, sans-serif' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mt-2 text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تم اختيار {selectedDocuments.length} مستند إضافي
              </div>
            </div>

            <EnhancedSwitch
              id="sub-active"
              checked={subForm.isActive}
              onCheckedChange={(checked) => setSubForm({...subForm, isActive: checked})}
              label="تفعيل التصنيف"
              description="هل سيكون هذا التصنيف الفرعي متاحاً للاستخدام؟"
              variant="success"
              size="md"
            />
          </div>

          <DialogFooter className="gap-2" style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowSubDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                // TODO: حفظ التصنيف الفرعي
                setShowSubDialog(false);
              }}
              disabled={!subForm.code || !subForm.name || !subForm.mainCategoryId}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة عرض المستندات */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-3xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <FileText className="h-5 w-5 inline ml-2" />
              المستندات المطلوبة
            </DialogTitle>
          </DialogHeader>

          <div>
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الكود
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اسم المستند
                  </TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', width: '100px' }}>
                    الحالة
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDocuments.map(doc => (
                  <TableRow key={doc.documentId}>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs font-mono">
                        {doc.documentCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {doc.documentName}
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.isRequired ? (
                        <Badge className="bg-red-500 text-white text-xs">إلزامي</Badge>
                      ) : (
                        <Badge className="bg-blue-500 text-white text-xs">اختياري</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter style={{ direction: 'rtl' }}>
            <Button
              variant="outline"
              onClick={() => setShowDocumentsDialog(false)}
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

export default TransactionCategoriesComponent;
