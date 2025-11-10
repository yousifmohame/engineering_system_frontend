/**
 * ============================================================================
 * الشاشة 777 - إعدادات العقود v2.0 - مع تابات محسّنة
 * ============================================================================
 * 
 * تحديثات v2.0:
 * ✅ تاب جديد: اعدادات البنود (777-09)
 * ✅ تاب جديد: اعدادات الرفض (777-10)
 * ✅ تاب جديد: اعدادات التعديل (777-11)
 * ✅ نظام شامل لإدارة بنود العقود
 * ✅ قائمة أسباب الرفض القابلة للتخصيص
 * ✅ أسباب إيقاف العقد للتعديل
 * 
 * @version 2.0
 * @date 2025-11-03
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import {
  FileSignature, Settings, Plus, Edit, Trash2, Eye, Copy,
  CheckCircle, XCircle, Users, Building2, FileText, Shield,
  Printer, Mail, Lock, Download, Upload, Save, RefreshCw,
  AlertCircle, Info, Zap, Code, Layout, Layers, FileCheck,
  ListChecks, Ban, AlertTriangle
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';
import CodeDisplay from '../CodeDisplay';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '777-01', number: '777-01', title: 'نظرة عامة', icon: Layout },
  { id: '777-02', number: '777-02', title: 'أنواع العقود', icon: FileSignature },
  { id: '777-03', number: '777-03', title: 'البنود المسبقة', icon: Layers },
  { id: '777-04', number: '777-04', title: 'إعدادات الاعتماد', icon: Shield },
  { id: '777-05', number: '777-05', title: 'قوالب الطباعة', icon: Printer },
  { id: '777-06', number: '777-06', title: 'إعدادات الإشعارات', icon: Mail },
  { id: '777-07', number: '777-07', title: 'التوقيع الرقمي', icon: FileCheck },
  { id: '777-08', number: '777-08', title: 'خلفيات الحماية', icon: Lock },
  { id: '777-09', number: '777-09', title: 'اعدادات البنود', icon: ListChecks },
  { id: '777-10', number: '777-10', title: 'اعدادات الرفض', icon: XCircle },
  { id: '777-11', number: '777-11', title: 'اعدادات التعديل', icon: AlertTriangle },
];

// الواجهات
interface ContractClauseTemplate {
  id: string;
  title: string;
  content: string;
  category: 'مالي' | 'قانوني' | 'فني' | 'إداري' | 'ضمانات' | 'التزامات';
  isRequired: boolean;
  isEditable: boolean;
  order: number;
  applicableToTypes: string[];
  createdDate: string;
  lastModified: string;
}

interface RejectionReason {
  id: string;
  code: string;
  reason: string;
  category: 'قانوني' | 'مالي' | 'فني' | 'إداري' | 'أخرى';
  requiresDetails: boolean;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

interface ModificationReason {
  id: string;
  code: string;
  reason: string;
  category: 'بنود' | 'قيمة' | 'مواصفات' | 'أطراف' | 'مدة' | 'أخرى';
  allowsAutoResume: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

const ContractSettings_Advanced_777_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('777-01');
  const [showAddClauseDialog, setShowAddClauseDialog] = useState(false);
  const [showAddRejectionDialog, setShowAddRejectionDialog] = useState(false);
  const [showAddModificationDialog, setShowAddModificationDialog] = useState(false);

  // بيانات وهمية - قوالب البنود
  const [clauseTemplates, setClauseTemplates] = useState<ContractClauseTemplate[]>([
    {
      id: 'CL001',
      title: 'بند الأتعاب والدفعات',
      content: 'تحدد أتعاب المكتب بمبلغ [المبلغ] ريال سعودي، تدفع على [عدد] دفعات حسب الجدول المرفق.',
      category: 'مالي',
      isRequired: true,
      isEditable: true,
      order: 1,
      applicableToTypes: ['جميع العقود'],
      createdDate: '2025-01-15',
      lastModified: '2025-10-20'
    },
    {
      id: 'CL002',
      title: 'بند مدة العقد',
      content: 'مدة هذا العقد [المدة] شهراً، تبدأ من تاريخ التوقيع وتنتهي في [تاريخ الانتهاء].',
      category: 'إداري',
      isRequired: true,
      isEditable: true,
      order: 2,
      applicableToTypes: ['جميع العقود'],
      createdDate: '2025-01-15',
      lastModified: '2025-09-10'
    },
    {
      id: 'CL003',
      title: 'بند الضمانات',
      content: 'يلتزم الطرف الثاني بتقديم ضمان بنكي بنسبة 5% من قيمة العقد كضمان حسن التنفيذ.',
      category: 'ضمانات',
      isRequired: false,
      isEditable: true,
      order: 3,
      applicableToTypes: ['عقود بناء', 'عقود إشراف'],
      createdDate: '2025-02-01',
      lastModified: '2025-08-25'
    },
    {
      id: 'CL004',
      title: 'بند المسؤولية القانونية',
      content: 'يكون المكتب مسؤولاً مسؤولية كاملة عن جميع الأعمال المقدمة ضمن نطاق هذا العقد.',
      category: 'قانوني',
      isRequired: true,
      isEditable: false,
      order: 4,
      applicableToTypes: ['جميع العقود'],
      createdDate: '2025-01-10',
      lastModified: '2025-01-10'
    },
    {
      id: 'CL005',
      title: 'بند المواصفات الفنية',
      content: 'يلتزم المكتب بتطبيق جميع المواصفات الفنية والكودات المعتمدة من الجهات المختصة.',
      category: 'فني',
      isRequired: true,
      isEditable: true,
      order: 5,
      applicableToTypes: ['عقود تصميم', 'عقود إشراف'],
      createdDate: '2025-01-20',
      lastModified: '2025-07-30'
    },
    {
      id: 'CL006',
      title: 'بند التزامات المالك',
      content: 'يلتزم المالك بتوفير جميع المستندات والوثائق اللازمة لإنجاز العمل خلال [المدة] أيام من تاريخ الطلب.',
      category: 'التزامات',
      isRequired: false,
      isEditable: true,
      order: 6,
      applicableToTypes: ['جميع العقود'],
      createdDate: '2025-02-15',
      lastModified: '2025-09-05'
    }
  ]);

  // بيانات أسباب الرفض
  const [rejectionReasons, setRejectionReasons] = useState<RejectionReason[]>([
    {
      id: 'RR001',
      code: 'REJ-001',
      reason: 'عدم توافق البنود المالية مع السياسة المعتمدة',
      category: 'مالي',
      requiresDetails: true,
      isActive: true,
      usageCount: 15,
      createdDate: '2025-01-10'
    },
    {
      id: 'RR002',
      code: 'REJ-002',
      reason: 'نقص في المستندات القانونية المطلوبة',
      category: 'قانوني',
      requiresDetails: true,
      isActive: true,
      usageCount: 8,
      createdDate: '2025-01-10'
    },
    {
      id: 'RR003',
      code: 'REJ-003',
      reason: 'عدم استيفاء المواصفات الفنية المطلوبة',
      category: 'فني',
      requiresDetails: true,
      isActive: true,
      usageCount: 12,
      createdDate: '2025-01-15'
    },
    {
      id: 'RR004',
      code: 'REJ-004',
      reason: 'تعارض مع عقود سابقة',
      category: 'إداري',
      requiresDetails: false,
      isActive: true,
      usageCount: 5,
      createdDate: '2025-01-20'
    },
    {
      id: 'RR005',
      code: 'REJ-005',
      reason: 'عدم موافقة أحد الأطراف على البنود',
      category: 'أخرى',
      requiresDetails: true,
      isActive: true,
      usageCount: 20,
      createdDate: '2025-02-01'
    },
    {
      id: 'RR006',
      code: 'REJ-006',
      reason: 'قيمة العقد أعلى من الميزانية المعتمدة',
      category: 'مالي',
      requiresDetails: false,
      isActive: true,
      usageCount: 10,
      createdDate: '2025-02-10'
    },
    {
      id: 'RR007',
      code: 'REJ-007',
      reason: 'عدم مطابقة العقد للنموذج المعتمد',
      category: 'إداري',
      requiresDetails: true,
      isActive: true,
      usageCount: 6,
      createdDate: '2025-03-01'
    }
  ]);

  // بيانات أسباب التعديل
  const [modificationReasons, setModificationReasons] = useState<ModificationReason[]>([
    {
      id: 'MR001',
      code: 'MOD-001',
      reason: 'تعديل في بنود العقد بناءً على طلب المالك',
      category: 'بنود',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 25,
      createdDate: '2025-01-10'
    },
    {
      id: 'MR002',
      code: 'MOD-002',
      reason: 'تعديل قيمة العقد',
      category: 'قيمة',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 18,
      createdDate: '2025-01-10'
    },
    {
      id: 'MR003',
      code: 'MOD-003',
      reason: 'تعديل المواصفات الفنية للمشروع',
      category: 'مواصفات',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 30,
      createdDate: '2025-01-15'
    },
    {
      id: 'MR004',
      code: 'MOD-004',
      reason: 'تغيير في أطراف العقد',
      category: 'أطراف',
      allowsAutoResume: false,
      requiresApproval: true,
      isActive: true,
      usageCount: 8,
      createdDate: '2025-01-20'
    },
    {
      id: 'MR005',
      code: 'MOD-005',
      reason: 'تمديد مدة العقد',
      category: 'مدة',
      allowsAutoResume: true,
      requiresApproval: true,
      isActive: true,
      usageCount: 22,
      createdDate: '2025-02-01'
    },
    {
      id: 'MR006',
      code: 'MOD-006',
      reason: 'تصحيح أخطاء كتابية في العقد',
      category: 'أخرى',
      allowsAutoResume: true,
      requiresApproval: false,
      isActive: true,
      usageCount: 12,
      createdDate: '2025-02-10'
    },
    {
      id: 'MR007',
      code: 'MOD-007',
      reason: 'تحديث بيانات الاتصال لأحد الأطراف',
      category: 'أخرى',
      allowsAutoResume: true,
      requiresApproval: false,
      isActive: true,
      usageCount: 5,
      createdDate: '2025-03-01'
    }
  ]);

  const handleAddClause = () => {
    toast.success('تمت إضافة البند بنجاح');
    setShowAddClauseDialog(false);
  };

  const handleAddRejection = () => {
    toast.success('تمت إضافة سبب الرفض بنجاح');
    setShowAddRejectionDialog(false);
  };

  const handleAddModification = () => {
    toast.success('تمت إضافة سبب التعديل بنجاح');
    setShowAddModificationDialog(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '777-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على إعدادات العقود</h2>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <ListChecks className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{clauseTemplates.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قوالب البنود</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{rejectionReasons.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسباب الرفض</p>
                </CardContent>
              </Card>
              
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{modificationReasons.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسباب التعديل</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {clauseTemplates.filter(c => c.isRequired).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>بنود إلزامية</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Ban className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {rejectionReasons.filter(r => r.isActive).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أسباب نشطة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {modificationReasons.filter(m => m.requiresApproval).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحتاج اعتماد</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '777-09':
        // اعدادات البنود
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>قوالب البنود ({clauseTemplates.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500" onClick={() => setShowAddClauseDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة بند جديد
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['مالي', 'قانوني', 'فني', 'إداري', 'ضمانات', 'التزامات'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                      {clauseTemplates.filter(c => c.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              {clauseTemplates.map((clause) => (
                <Card key={clause.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.title}</h3>
                          <Badge className={`text-xs ${clause.isRequired ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                            {clause.isRequired ? 'إلزامي' : 'اختياري'}
                          </Badge>
                          <Badge className="text-xs bg-gray-500 text-white">{clause.category}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clause.content}</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الترتيب: </span>
                            <span className="font-mono">{clause.order}</span>
                          </div>
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قابل للتعديل: </span>
                            <Badge className={`text-xs ${clause.isEditable ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                              {clause.isEditable ? 'نعم' : 'لا'}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تعديل: </span>
                            <span className="font-mono">{clause.lastModified}</span>
                          </div>
                        </div>

                        <div className="mt-2 bg-blue-50 p-2 rounded">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                            <strong>ينطبق على:</strong> {clause.applicableToTypes.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mr-3">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نافذة إضافة بند */}
            <Dialog open={showAddClauseDialog} onOpenChange={setShowAddClauseDialog}>
              <DialogContent className="max-w-3xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة بند جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="عنوان البند *"
                    id="clause-title"
                    placeholder="مثال: بند الأتعاب والدفعات"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="محتوى البند *"
                    id="clause-content"
                    rows={4}
                    placeholder="أدخل نص البند الكامل..."
                    copyable={false}
                    clearable={true}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <SelectWithCopy
                      label="التصنيف *"
                      id="clause-category"
                      options={[
                        { value: 'مالي', label: 'مالي' },
                        { value: 'قانوني', label: 'قانوني' },
                        { value: 'فني', label: 'فني' },
                        { value: 'إداري', label: 'إداري' },
                        { value: 'ضمانات', label: 'ضمانات' },
                        { value: 'التزامات', label: 'التزامات' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />

                    <InputWithCopy
                      label="رقم الترتيب *"
                      id="clause-order"
                      type="number"
                      placeholder="1"
                      copyable={false}
                      clearable={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <EnhancedSwitch
                      id="clause-required"
                      label="بند إلزامي"
                      description="هل هذا البند إلزامي في جميع العقود؟"
                      variant="danger"
                    />

                    <EnhancedSwitch
                      id="clause-editable"
                      label="قابل للتعديل"
                      description="هل يمكن تعديل هذا البند في العقد؟"
                      variant="success"
                    />
                  </div>

                  <SelectWithCopy
                    label="ينطبق على أنواع العقود *"
                    id="clause-types"
                    options={[
                      { value: 'all', label: 'جميع العقود' },
                      { value: 'construction', label: 'عقود بناء فقط' },
                      { value: 'supervision', label: 'عقود إشراف فقط' },
                      { value: 'design', label: 'عقود تصميم فقط' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddClauseDialog(false)}>إلغاء</Button>
                  <Button className="bg-green-500" onClick={handleAddClause}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ البند
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-10':
        // اعدادات الرفض
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسباب رفض اعتماد العقود ({rejectionReasons.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500" onClick={() => setShowAddRejectionDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة سبب جديد
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {['قانوني', 'مالي', 'فني', 'إداري', 'أخرى'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#fef2f2', border: '2px solid #fca5a5' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                      {rejectionReasons.filter(r => r.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {rejectionReasons.map((reason, index) => (
                    <div 
                      key={reason.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-red-50"
                      style={{ border: '1px solid #fee2e2' }}
                    >
                      <div className="bg-red-500 text-white rounded px-2 py-1 text-xs font-mono">
                        {reason.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{reason.reason}</p>
                      </div>
                      <Badge className="text-xs bg-gray-500 text-white">{reason.category}</Badge>
                      {reason.requiresDetails && (
                        <Badge className="text-xs bg-amber-500 text-white">يحتاج تفاصيل</Badge>
                      )}
                      <Badge className="text-xs bg-blue-500 text-white font-mono">
                        {reason.usageCount} استخدام
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة سبب رفض */}
            <Dialog open={showAddRejectionDialog} onOpenChange={setShowAddRejectionDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة سبب رفض جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="رمز السبب *"
                    id="rejection-code"
                    placeholder="REJ-008"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="سبب الرفض *"
                    id="rejection-reason"
                    rows={3}
                    placeholder="أدخل سبب الرفض بشكل واضح ومفصل..."
                    copyable={false}
                    clearable={true}
                  />

                  <SelectWithCopy
                    label="التصنيف *"
                    id="rejection-category"
                    options={[
                      { value: 'قانوني', label: 'قانوني' },
                      { value: 'مالي', label: 'مالي' },
                      { value: 'فني', label: 'فني' },
                      { value: 'إداري', label: 'إداري' },
                      { value: 'أخرى', label: 'أخرى' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <EnhancedSwitch
                    id="rejection-details"
                    label="يتطلب تفاصيل إضافية"
                    description="هل يجب على المستخدم إدخال تفاصيل إضافية عند اختيار هذا السبب؟"
                    variant="warning"
                  />

                  <div className="bg-red-50 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
                        <strong>ملاحظة:</strong> سيتم استخدام هذا السبب في شاشة اعتماد العقود (778) عند رفض أي عقد. تأكد من كتابة السبب بشكل واضح ومفهوم.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddRejectionDialog(false)}>إلغاء</Button>
                  <Button className="bg-red-500" onClick={handleAddRejection}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ السبب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-11':
        // اعدادات التعديل
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسباب إيقاف العقد للتعديل ({modificationReasons.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-amber-500" onClick={() => setShowAddModificationDialog(true)}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة سبب جديد
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {['بنود', 'قيمة', 'مواصفات', 'أطراف', 'مدة', 'أخرى'].map((category) => (
                <Card key={category} className="card-element card-rtl" style={{ background: '#fffbeb', border: '2px solid #fcd34d' }}>
                  <CardContent className="p-2 text-center">
                    <p className="text-lg mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                      {modificationReasons.filter(m => m.category === category).length}
                    </p>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {modificationReasons.map((reason) => (
                    <div 
                      key={reason.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-amber-50"
                      style={{ border: '1px solid #fef3c7' }}
                    >
                      <div className="bg-amber-500 text-white rounded px-2 py-1 text-xs font-mono">
                        {reason.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{reason.reason}</p>
                      </div>
                      <Badge className="text-xs bg-gray-500 text-white">{reason.category}</Badge>
                      {reason.requiresApproval && (
                        <Badge className="text-xs bg-red-500 text-white">يحتاج اعتماد</Badge>
                      )}
                      {reason.allowsAutoResume && (
                        <Badge className="text-xs bg-green-500 text-white">استئناف تلقائي</Badge>
                      )}
                      <Badge className="text-xs bg-blue-500 text-white font-mono">
                        {reason.usageCount} استخدام
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نافذة إضافة سبب تعديل */}
            <Dialog open={showAddModificationDialog} onOpenChange={setShowAddModificationDialog}>
              <DialogContent className="max-w-2xl dialog-rtl">
                <DialogHeader className="dialog-header">
                  <DialogTitle className="dialog-title">إضافة سبب تعديل جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <InputWithCopy
                    label="رمز السبب *"
                    id="modification-code"
                    placeholder="MOD-008"
                    copyable={false}
                    clearable={true}
                  />
                  
                  <TextAreaWithCopy
                    label="سبب التعديل *"
                    id="modification-reason"
                    rows={3}
                    placeholder="أدخل سبب إيقاف العقد للتعديل..."
                    copyable={false}
                    clearable={true}
                  />

                  <SelectWithCopy
                    label="التصنيف *"
                    id="modification-category"
                    options={[
                      { value: 'بنود', label: 'تعديل في البنود' },
                      { value: 'قيمة', label: 'تعديل القيمة' },
                      { value: 'مواصفات', label: 'تعديل المواصفات' },
                      { value: 'أطراف', label: 'تغيير الأطراف' },
                      { value: 'مدة', label: 'تعديل المدة' },
                      { value: 'أخرى', label: 'أخرى' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <EnhancedSwitch
                      id="modification-approval"
                      label="يتطلب اعتماد"
                      description="هل يحتاج التعديل لإعادة اعتماد العقد؟"
                      variant="danger"
                    />

                    <EnhancedSwitch
                      id="modification-resume"
                      label="استئناف تلقائي"
                      description="هل يمكن استئناف العقد تلقائياً بعد التعديل؟"
                      variant="success"
                    />
                  </div>

                  <div className="bg-amber-50 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                          <strong>ملاحظة:</strong> سيتم استخدام هذا السبب عند إيقاف أي عقد للتعديل.
                        </p>
                        <ul className="list-disc list-inside text-xs text-gray-600 mr-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <li>إذا كان يحتاج اعتماد: سيتم إيقاف العقد حتى يعاد اعتماده من جديد</li>
                          <li>إذا كان استئناف تلقائي: سيتم استئناف العقد تلقائياً بعد حفظ التعديل</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddModificationDialog(false)}>إلغاء</Button>
                  <Button className="bg-amber-500" onClick={handleAddModification}>
                    <Save className="h-3 w-3 ml-1" />
                    حفظ السبب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case '777-02':
      case '777-03':
      case '777-04':
      case '777-05':
      case '777-06':
      case '777-07':
      case '777-08':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '777-02' ? 'تاب أنواع العقود' :
                 activeTab === '777-03' ? 'تاب البنود المسبقة' :
                 activeTab === '777-04' ? 'تاب إعدادات الاعتماد' :
                 activeTab === '777-05' ? 'تاب قوالب الطباعة' :
                 activeTab === '777-06' ? 'تاب إعدادات الإشعارات' :
                 activeTab === '777-07' ? 'تاب التوقيع الرقمي' :
                 'تاب خلفيات الحماية'}
              </p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                (موجود في الإصدار السابق)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-777-v2" position="top-right" />
      
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
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
              <Settings 
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
                  إعدادات العقود
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
                    777-v2
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
                إعدادات شاملة للعقود (بنود + رفض + تعديل)
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
                11 تبويباً
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ContractSettings_Advanced_777_v2;
