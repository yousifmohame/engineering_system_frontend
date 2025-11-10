/**
 * الشاشة 924 - إدارة أنواع الملاك v1.0
 * ==========================================
 * 
 * شاشة لإدارة أنواع الملاك المستخدمة في الاستعلامات والمعاملات
 * - إضافة/تعديل/حذف أنواع الملاك
 * - تفعيل/إيقاف الأنواع
 * - البحث والفلترة
 * - تصدير القائمة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  Users, Plus, Edit3, Trash2, Search, Download, X, Save,
  CheckCircle, AlertCircle, FileText
} from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

// 🎯 واجهة نوع المالك
interface OwnerType {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  usageCount: number; // عدد مرات الاستخدام
}

// 🗂️ أنواع الملاك الافتراضية
const INITIAL_OWNER_TYPES: OwnerType[] = [
  {
    id: '1',
    nameAr: 'فرد سعودي',
    nameEn: 'Saudi Individual',
    code: 'SAU-IND',
    description: 'مواطن سعودي',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 145
  },
  {
    id: '2',
    nameAr: 'فرد مقيم',
    nameEn: 'Resident Individual',
    code: 'RES-IND',
    description: 'مقيم في السعودية',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 89
  },
  {
    id: '3',
    nameAr: 'شركة سعودية',
    nameEn: 'Saudi Company',
    code: 'SAU-COM',
    description: 'شركة مسجلة في السعودية',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 67
  },
  {
    id: '4',
    nameAr: 'شركة أجنبية',
    nameEn: 'Foreign Company',
    code: 'FOR-COM',
    description: 'شركة أجنبية',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 12
  },
  {
    id: '5',
    nameAr: 'جهة حكومية',
    nameEn: 'Government Entity',
    code: 'GOV-ENT',
    description: 'جهة حكومية سعودية',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 34
  },
  {
    id: '6',
    nameAr: 'ملكية مشتركة',
    nameEn: 'Joint Ownership',
    code: 'JNT-OWN',
    description: 'أكثر من مالك',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 56
  },
  {
    id: '7',
    nameAr: 'ورثة',
    nameEn: 'Heirs',
    code: 'HEIRS',
    description: 'ملكية ورثة',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 23
  },
  {
    id: '8',
    nameAr: 'وقف',
    nameEn: 'Endowment',
    code: 'WAQF',
    description: 'وقف خيري أو ذري',
    isActive: true,
    createdDate: '2025-01-01',
    usageCount: 18
  }
];

const OwnerTypes_Complete_924: React.FC = () => {
  // 🎨 الحالات الرئيسية
  const [ownerTypes, setOwnerTypes] = useState<OwnerType[]>(INITIAL_OWNER_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<OwnerType | null>(null);
  
  // 🆕 حالة النموذج
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    code: '',
    description: '',
    isActive: true
  });

  // 🔄 إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      code: '',
      description: '',
      isActive: true
    });
  };

  // ➕ إضافة نوع مالك جديد
  const handleAdd = () => {
    if (!formData.nameAr || !formData.nameEn || !formData.code) {
      toast.error('الرجاء ملء جميع الحقول الإلزامية');
      return;
    }

    const newType: OwnerType = {
      id: `${Date.now()}`,
      ...formData,
      createdDate: new Date().toISOString().split('T')[0],
      usageCount: 0
    };

    setOwnerTypes([...ownerTypes, newType]);
    toast.success('تم إضافة نوع المالك بنجاح');
    setShowAddDialog(false);
    resetForm();
  };

  // ✏️ تعديل نوع مالك
  const handleEdit = () => {
    if (!selectedType || !formData.nameAr || !formData.nameEn || !formData.code) {
      toast.error('الرجاء ملء جميع الحقول الإلزامية');
      return;
    }

    setOwnerTypes(ownerTypes.map(t =>
      t.id === selectedType.id
        ? { ...t, ...formData }
        : t
    ));

    toast.success('تم تحديث نوع المالك بنجاح');
    setShowEditDialog(false);
    setSelectedType(null);
    resetForm();
  };

  // 🗑️ حذف نوع مالك
  const handleDelete = () => {
    if (!selectedType) return;

    if (selectedType.usageCount > 0) {
      toast.error(`لا يمكن حذف هذا النوع لأنه مستخدم في ${selectedType.usageCount} سجل`);
      return;
    }

    setOwnerTypes(ownerTypes.filter(t => t.id !== selectedType.id));
    toast.success('تم حذف نوع المالك بنجاح');
    setShowDeleteDialog(false);
    setSelectedType(null);
  };

  // 🔀 تبديل التفعيل
  const handleToggleActive = (id: string) => {
    setOwnerTypes(ownerTypes.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  // 🔍 تصفية النتائج
  const filteredTypes = ownerTypes.filter(t =>
    t.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📊 الإحصائيات
  const stats = {
    total: ownerTypes.length,
    active: ownerTypes.filter(t => t.isActive).length,
    inactive: ownerTypes.filter(t => !t.isActive).length,
    totalUsage: ownerTypes.reduce((sum, t) => sum + t.usageCount, 0)
  };

  return (
    <div className="min-h-screen" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* 🎯 هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '16px',
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
              <Users 
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
                  أنواع الملاك
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
                    924
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
                إدارة أنواع الملاك المستخدمة في الاستعلامات والمعاملات
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
                تبويب واحد
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-4">
        {/* 📊 بطاقات إحصائية */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الأنواع
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#1e40af', fontSize: '20px' }}>
                    {stats.total}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مفعّل
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#15803d', fontSize: '20px' }}>
                    {stats.active}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    غير مفعّل
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#dc2626', fontSize: '20px' }}>
                    {stats.inactive}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الاستخدام
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '700', color: '#b45309', fontSize: '20px' }}>
                    {stats.totalUsage}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🔧 شريط الأدوات */}
        <Card className="card-rtl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <InputWithCopy
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث باسم النوع أو الرمز..."
                  copyable={false}
                  clearable={true}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowAddDialog(true)}
                  style={{ background: '#10b981', color: '#fff' }}
                >
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة نوع جديد
                </Button>

                <Button variant="outline">
                  <Download className="h-4 w-4 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📋 جدول أنواع الملاك */}
        <Card className="card-rtl">
          <CardHeader className="p-4">
            <CardTitle className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قائمة أنواع الملاك ({filteredTypes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ScrollArea className="h-[500px]">
              <Table className="table-rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالعربية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم بالإنجليزية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الاستخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type, idx) => (
                    <TableRow key={type.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="font-mono bg-blue-500 text-white">
                          {type.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        {type.nameAr}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {type.nameEn}
                      </TableCell>
                      <TableCell className="text-right text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {type.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{type.usageCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <EnhancedSwitch
                          id={`switch-${type.id}`}
                          checked={type.isActive}
                          onCheckedChange={() => handleToggleActive(type.id)}
                          size="sm"
                          variant={type.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedType(type);
                              setFormData({
                                nameAr: type.nameAr,
                                nameEn: type.nameEn,
                                code: type.code,
                                description: type.description,
                                isActive: type.isActive
                              });
                              setShowEditDialog(true);
                            }}
                            style={{ height: '28px', padding: '0 8px' }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedType(type);
                              setShowDeleteDialog(true);
                            }}
                            style={{ height: '28px', padding: '0 8px', borderColor: '#ef4444', color: '#ef4444' }}
                            disabled={type.usageCount > 0}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ➕ نافذة إضافة نوع جديد */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Plus className="h-5 w-5 inline ml-2 text-green-600" />
                إضافة نوع مالك جديد
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="الاسم بالعربية *"
                  id="name-ar"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: فرد سعودي"
                  copyable={false}
                  clearable={true}
                />

                <InputWithCopy
                  label="الاسم بالإنجليزية *"
                  id="name-en"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Example: Saudi Individual"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <InputWithCopy
                label="الرمز *"
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="مثال: SAU-IND"
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="الوصف"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للنوع"
                copyable={false}
                clearable={true}
              />

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <EnhancedSwitch
                  id="is-active-add"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label="مفعّل"
                  size="md"
                  variant="success"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handleAdd} style={{ background: '#10b981', color: '#fff' }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ✏️ نافذة تعديل نوع */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Edit3 className="h-5 w-5 inline ml-2 text-blue-600" />
                تعديل نوع المالك
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputWithCopy
                  label="الاسم بالعربية *"
                  id="edit-name-ar"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: فرد سعودي"
                  copyable={false}
                  clearable={true}
                />

                <InputWithCopy
                  label="الاسم بالإنجليزية *"
                  id="edit-name-en"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Example: Saudi Individual"
                  copyable={false}
                  clearable={true}
                />
              </div>

              <InputWithCopy
                label="الرمز *"
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="مثال: SAU-IND"
                copyable={false}
                clearable={true}
              />

              <InputWithCopy
                label="الوصف"
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للنوع"
                copyable={false}
                clearable={true}
              />

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <EnhancedSwitch
                  id="is-active-edit"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label="مفعّل"
                  size="md"
                  variant="success"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditDialog(false);
                setSelectedType(null);
                resetForm();
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button onClick={handleEdit} style={{ background: '#2563eb', color: '#fff' }}>
                <Save className="h-4 w-4 ml-1" />
                حفظ التعديلات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🗑️ نافذة حذف نوع */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md" style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <Trash2 className="h-5 w-5 inline ml-2 text-red-600" />
                تأكيد الحذف
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هل أنت متأكد من حذف هذا النوع؟
              </DialogDescription>
            </DialogHeader>

            {selectedType && (
              <Card className="card-rtl bg-red-50">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      {selectedType.nameAr}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الرمز: {selectedType.code}
                    </p>
                    {selectedType.usageCount > 0 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <strong>تحذير:</strong> هذا النوع مستخدم في {selectedType.usageCount} سجل ولا يمكن حذفه
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDeleteDialog(false);
                setSelectedType(null);
              }}>
                <X className="h-4 w-4 ml-1" />
                إلغاء
              </Button>
              <Button
                onClick={handleDelete}
                style={{ background: '#ef4444', color: '#fff' }}
                disabled={selectedType?.usageCount ? selectedType.usageCount > 0 : false}
              >
                <Trash2 className="h-4 w-4 ml-1" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OwnerTypes_Complete_924;
