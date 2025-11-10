/**
 * الشاشة 941 - إعدادات التعهدات والإقرارات
 * ===========================================================================
 * 
 * شاشة شاملة لإدارة نماذج وقوالب التعهدات والإقرارات
 * 
 * المميزات:
 * - إنشاء وتحرير القوالب
 * - إدارة الحقول الديناميكية
 * - معاينة القوالب
 * - تفعيل/تعطيل القوالب
 * - إحصائيات الاستخدام
 * - تصدير واستيراد القوالب
 * 
 * التابات:
 * 941-01: قوالب تعهدات العملاء
 * 941-02: قوالب إقرارات العملاء
 * 941-03: قوالب تعهدات المالكين
 * 941-04: قوالب إقرارات المالكين
 * 941-05: قوالب تعهدات الموظفين
 * 941-06: قوالب إقرارات الموظفين
 * 941-07: قوالب تعهدات المقاولين
 * 941-08: قوالب إقرارات المقاولين
 * 941-09: قوالب تعهدات الاستشاريين
 * 941-10: قوالب إقرارات الاستشاريين
 * 941-11: إحصائيات القوالب
 * 941-12: إعدادات عامة
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
import {
  FileText, Plus, Search, Download, Upload, Edit, Eye, Copy,
  Trash2, CheckCircle, XCircle, Settings, BarChart3, Users,
  Building, Briefcase, HardHat, UserCheck, FileCheck, Shield,
  Archive, Save, RefreshCw, Filter, Star, TrendingUp,
  FileSignature, Building2
} from 'lucide-react';

// ===== واجهات البيانات =====

interface CommitmentTemplate {
  id: string;
  templateNumber: string;
  name: string;
  type: 'تعهد' | 'إقرار';
  category: 'عميل' | 'مالك' | 'موظف' | 'مقاول' | 'استشاري';
  content: string;
  fields: TemplateField[];
  authenticationRequired: 'مكتب' | 'مالك' | 'كلاهما';
  status: 'نشط' | 'معلق' | 'محذوف';
  usageCount: number;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  version: string;
}

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  placeholder: string;
  required: boolean;
  options?: string[];
}

const CommitmentsDeclarationsSettingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('941-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommitmentTemplate | null>(null);

  // تكوين التابات
  const TABS_CONFIG = [
    { id: '941-01', number: '941-01', title: 'قوالب تعهدات العملاء', icon: Users, category: 'عميل', type: 'تعهد' },
    { id: '941-02', number: '941-02', title: 'قوالب إقرارات العملاء', icon: FileCheck, category: 'عميل', type: 'إقرار' },
    { id: '941-03', number: '941-03', title: 'قوالب تعهدات المالكين', icon: Building, category: 'مالك', type: 'تعهد' },
    { id: '941-04', number: '941-04', title: 'قوالب إقرارات المالكين', icon: Shield, category: 'مالك', type: 'إقرار' },
    { id: '941-05', number: '941-05', title: 'قوالب تعهدات الموظفين', icon: UserCheck, category: 'موظف', type: 'تعهد' },
    { id: '941-06', number: '941-06', title: 'قوالب إقرارات الموظفين', icon: FileSignature, category: 'موظف', type: 'إقرار' },
    { id: '941-07', number: '941-07', title: 'قوالب تعهدات المقاولين', icon: HardHat, category: 'مقاول', type: 'تعهد' },
    { id: '941-08', number: '941-08', title: 'قوالب إقرارات المقاولين', icon: FileText, category: 'مقاول', type: 'إقرار' },
    { id: '941-09', number: '941-09', title: 'قوالب تعهدات الاستشاريين', icon: Briefcase, category: 'استشاري', type: 'تعهد' },
    { id: '941-10', number: '941-10', title: 'قوالب إقرارات الاستشاريين', icon: Building2, category: 'استشاري', type: 'إقرار' },
    { id: '941-11', number: '941-11', title: 'إحصائيات القوالب', icon: BarChart3, category: null, type: null },
    { id: '941-12', number: '941-12', title: 'إعدادات عامة', icon: Settings, category: null, type: null },
  ];

  // بيانات تجريبية - القوالب
  const sampleTemplates: CommitmentTemplate[] = useMemo(() => [
    {
      id: 'TPL001',
      templateNumber: 'TPL-001',
      name: 'تعهد استلام المستندات',
      type: 'تعهد',
      category: 'عميل',
      content: 'أتعهد أنا {{entity_name}} صاحب السجل التجاري رقم {{commercial_register}} باستلام المستندات التالية:\n{{documents_list}}\n\nوذلك بتاريخ {{date}}\n\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'entity_name', label: 'اسم الجهة', type: 'text', placeholder: 'اسم المؤسسة أو الشركة', required: true },
        { id: 'f2', name: 'commercial_register', label: 'رقم السجل التجاري', type: 'text', placeholder: 'XXXXXXXXXX', required: true },
        { id: 'f3', name: 'documents_list', label: 'قائمة المستندات', type: 'textarea', placeholder: 'قائمة المستندات المستلمة', required: true },
        { id: 'f4', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'كلاهما',
      status: 'نشط',
      usageCount: 145,
      createdBy: 'أحمد السالم',
      createdDate: '2024-01-15',
      lastModified: '2025-09-20',
      version: 'v2.1'
    },
    {
      id: 'TPL002',
      templateNumber: 'TPL-002',
      name: 'إقرار بصحة البيانات',
      type: 'إقرار',
      category: 'عميل',
      content: 'أقر أنا {{entity_name}} بأن جميع البيانات المقدمة في معاملة رقم {{transaction_number}} صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن صحتها.\n\nالاسم: {{entity_name}}\nرقم الهوية: {{id_number}}\nالتاريخ: {{date}}\n\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'entity_name', label: 'الاسم الكامل', type: 'text', placeholder: 'الاسم الكامل للعميل', required: true },
        { id: 'f2', name: 'transaction_number', label: 'رقم المعاملة', type: 'text', placeholder: 'TRX-2025-XXXX', required: true },
        { id: 'f3', name: 'id_number', label: 'رقم الهوية', type: 'text', placeholder: 'XXXXXXXXXX', required: true },
        { id: 'f4', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'مكتب',
      status: 'نشط',
      usageCount: 289,
      createdBy: 'فاطمة محمد',
      createdDate: '2024-01-20',
      lastModified: '2025-08-15',
      version: 'v3.0'
    },
    {
      id: 'TPL015',
      templateNumber: 'TPL-015',
      name: 'إقرار الملكية',
      type: 'إقرار',
      category: 'مالك',
      content: 'أقر أنا {{owner_name}} حامل الهوية رقم {{id_number}} بأنني المالك الشرعي للعقار الموضح أدناه:\n\nرقم الصك: {{deed_number}}\nرقم القطعة: {{property_number}}\nالموقع: {{location}}\nالمساحة: {{area}} متر مربع\n\nوأقر بأن العقار خالٍ من أي حقوق أو التزامات للغير.\n\nالتاريخ: {{date}}\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'owner_name', label: 'اسم المالك', type: 'text', placeholder: 'الاسم الكامل', required: true },
        { id: 'f2', name: 'id_number', label: 'رقم الهوية', type: 'text', placeholder: 'XXXXXXXXXX', required: true },
        { id: 'f3', name: 'deed_number', label: 'رقم الصك', type: 'text', placeholder: 'رقم صك الملكية', required: true },
        { id: 'f4', name: 'property_number', label: 'رقم القطعة', type: 'text', placeholder: 'رقم القطعة', required: true },
        { id: 'f5', name: 'location', label: 'الموقع', type: 'text', placeholder: 'الموقع الجغرافي', required: true },
        { id: 'f6', name: 'area', label: 'المساحة', type: 'number', placeholder: 'المساحة بالمتر المربع', required: true },
        { id: 'f7', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'مكتب',
      status: 'نشط',
      usageCount: 428,
      createdBy: 'خالد العتيبي',
      createdDate: '2024-01-25',
      lastModified: '2025-10-01',
      version: 'v1.5'
    },
    {
      id: 'TPL025',
      templateNumber: 'TPL-025',
      name: 'تعهد السرية المهنية',
      type: 'تعهد',
      category: 'موظف',
      content: 'أتعهد أنا {{employee_name}} الموظف بوظيفة {{position}} بالحفاظ التام على سرية جميع المعلومات والبيانات المتعلقة بالعمل، وعدم إفشائها لأي طرف خارجي سواء أثناء فترة العمل أو بعد انتهائها.\n\nوأتحمل المسؤولية القانونية الكاملة في حال إخلالي بهذا التعهد.\n\nرقم الموظف: {{employee_id}}\nالقسم: {{department}}\nالتاريخ: {{date}}\n\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'employee_name', label: 'اسم الموظف', type: 'text', placeholder: 'الاسم الكامل', required: true },
        { id: 'f2', name: 'position', label: 'المسمى الوظيفي', type: 'text', placeholder: 'المسمى الوظيفي', required: true },
        { id: 'f3', name: 'employee_id', label: 'رقم الموظف', type: 'text', placeholder: 'EMP-XXXX', required: true },
        { id: 'f4', name: 'department', label: 'القسم', type: 'select', placeholder: 'اختر القسم', required: true, options: ['الإدارة', 'المحاسبة', 'الهندسة', 'المبيعات', 'التسويق'] },
        { id: 'f5', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'مكتب',
      status: 'نشط',
      usageCount: 187,
      createdBy: 'إدارة الموارد البشرية',
      createdDate: '2024-02-10',
      lastModified: '2025-07-20',
      version: 'v2.0'
    },
    {
      id: 'TPL030',
      templateNumber: 'TPL-030',
      name: 'إقرار استلام الموقع',
      type: 'إقرار',
      category: 'مقاول',
      content: 'نقر نحن {{contractor_name}} صاحب الترخيص رقم {{license_number}} باستلام موقع المشروع التالي بحالة جيدة:\n\nاسم المشروع: {{project_name}}\nموقع المشروع: {{project_location}}\nتاريخ الاستلام: {{handover_date}}\n\nوقد تم الاستلام بحضور:\n- المهندس المشرف: {{supervisor_name}}\n- ممثل المالك: {{owner_representative}}\n\nوأقر بأن الموقع جاهز للبدء بالعمل.\n\nالتاريخ: {{date}}\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'contractor_name', label: 'اسم المقاول', type: 'text', placeholder: 'اسم المقاول أو المؤسسة', required: true },
        { id: 'f2', name: 'license_number', label: 'رقم الترخيص', type: 'text', placeholder: 'رقم ترخيص المقاولات', required: true },
        { id: 'f3', name: 'project_name', label: 'اسم المشروع', type: 'text', placeholder: 'اسم المشروع', required: true },
        { id: 'f4', name: 'project_location', label: 'موقع المشروع', type: 'text', placeholder: 'الموقع الجغرافي', required: true },
        { id: 'f5', name: 'handover_date', label: 'تاريخ الاستلام', type: 'date', placeholder: '', required: true },
        { id: 'f6', name: 'supervisor_name', label: 'اسم المهندس المشرف', type: 'text', placeholder: 'اسم المهندس', required: true },
        { id: 'f7', name: 'owner_representative', label: 'ممثل المالك', type: 'text', placeholder: 'اسم ممثل المالك', required: true },
        { id: 'f8', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'كلاهما',
      status: 'نشط',
      usageCount: 213,
      createdBy: 'قسم المشاريع',
      createdDate: '2024-02-15',
      lastModified: '2025-09-10',
      version: 'v1.8'
    },
    {
      id: 'TPL040',
      templateNumber: 'TPL-040',
      name: 'تعهد تقديم التقارير',
      type: 'تعهد',
      category: 'استشاري',
      content: 'نتعهد نحن {{consultant_name}} المكتب الاستشاري المرخص بموجب الترخيص رقم {{license_number}} بتقديم التقارير الفنية التالية:\n\n{{reports_list}}\n\nوفقاً للجدول الزمني المتفق عليه في العقد رقم {{contract_number}}\n\nالمشروع: {{project_name}}\nفترة التقديم: {{submission_period}}\n\nونتعهد بالالتزام التام بالمواصفات والمعايير المهنية.\n\nالتاريخ: {{date}}\nالتوقيع: ___________',
      fields: [
        { id: 'f1', name: 'consultant_name', label: 'اسم المكتب الاستشاري', type: 'text', placeholder: 'اسم المكتب', required: true },
        { id: 'f2', name: 'license_number', label: 'رقم الترخيص', type: 'text', placeholder: 'رقم الترخيص', required: true },
        { id: 'f3', name: 'reports_list', label: 'قائمة التقارير', type: 'textarea', placeholder: 'قائمة التقارير المطلوبة', required: true },
        { id: 'f4', name: 'contract_number', label: 'رقم العقد', type: 'text', placeholder: 'رقم عقد الاستشارات', required: true },
        { id: 'f5', name: 'project_name', label: 'اسم المشروع', type: 'text', placeholder: 'اسم المشروع', required: true },
        { id: 'f6', name: 'submission_period', label: 'فترة التقديم', type: 'text', placeholder: 'مثال: كل شهر/ربع سنوي', required: true },
        { id: 'f7', name: 'date', label: 'التاريخ', type: 'date', placeholder: '', required: true },
      ],
      authenticationRequired: 'مالك',
      status: 'نشط',
      usageCount: 96,
      createdBy: 'قسم الاستشارات',
      createdDate: '2024-03-01',
      lastModified: '2025-08-25',
      version: 'v1.3'
    },
  ], []);

  // الحصول على التاب النشط
  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  // عرض محتوى التابات
  const renderTabContent = () => {
    // فلترة القوالب حسب التاب
    const filteredTemplates = sampleTemplates.filter(template => {
      if (activeTab === '941-11' || activeTab === '941-12') return true; // عرض الكل في الإحصائيات والإعدادات
      
      const tab = currentTab;
      if (!tab || !tab.category || !tab.type) return false;
      
      return template.category === tab.category && template.type === tab.type;
    });

    // التابات 941-01 إلى 941-10: قوائم القوالب
    if (activeTab !== '941-11' && activeTab !== '941-12') {
      return (
        <div className="space-y-2">
          {/* رأس الشاشة */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                {currentTab?.title}
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إدارة قوالب {currentTab?.type === 'تعهد' ? 'التعهدات' : 'الإقرارات'} الخاصة بـ {currentTab?.category}
              </p>
            </div>
            <div className="flex gap-1">
              <Button 
                className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
                onClick={() => setShowCreateDialog(true)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus className="h-3.5 w-3.5 ml-2" />
                قالب جديد
              </Button>
              <Button 
                variant="outline" 
                className="dense-button button-rtl" 
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Upload className="h-3.5 w-3.5 ml-2" />
                استيراد
              </Button>
              <Button 
                variant="outline" 
                className="dense-button button-rtl" 
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Download className="h-3.5 w-3.5 ml-2" />
                تصدير
              </Button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي القوالب
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTemplates.length}
                    </p>
                  </div>
                  <Archive className="stats-icon-compact text-[#2563eb] opacity-80" />
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
                      {filteredTemplates.filter(t => t.status === 'نشط').length}
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
                      معلقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTemplates.filter(t => t.status === 'معلق').length}
                    </p>
                  </div>
                  <XCircle className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTemplates.length > 0 ? Math.round(filteredTemplates.reduce((sum, t) => sum + t.usageCount, 0) / filteredTemplates.length) : 0}
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#ffedd5', '--bg-to': '#fed7aa', '--border-color': '#fdba74' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الأكثر استخداماً
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {filteredTemplates.length > 0 ? Math.max(...filteredTemplates.map(t => t.usageCount)) : 0}
                    </p>
                  </div>
                  <Star className="stats-icon-compact text-orange-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* البحث والتصفية */}
          <Card className="bg-blue-50 border-blue-200 card-rtl">
            <CardContent className="p-2">
              <div className="grid grid-cols-3 dense-grid form-rtl">
                <div className="col-span-2 form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث</Label>
                  <div className="flex gap-1">
                    <Input
                      placeholder="ابحث برقم أو اسم القالب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dense-input"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    />
                    <Button className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                      <Search className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">الكل</SelectItem>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                      <SelectItem value="محذوف">محذوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* جدول القوالب */}
          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم القالب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة التوثيق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الاستخدام</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإصدار</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {template.templateNumber}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {template.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          template.type === 'تعهد' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }>
                          {template.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gray-100 text-gray-700">
                          {template.authenticationRequired}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          template.status === 'نشط' ? 'bg-green-100 text-green-700' :
                          template.status === 'معلق' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {template.usageCount}
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {template.version}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="dense-button"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowPreviewDialog(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
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
    }

    // تاب 941-11: إحصائيات القوالب
    if (activeTab === '941-11') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                إحصائيات القوالب
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إحصائيات شاملة لجميع قوالب التعهدات والإقرارات
              </p>
            </div>
            <Button variant="outline" className="dense-button button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-3.5 w-3.5 ml-2" />
              تحديث
            </Button>
          </div>

          {/* إحصائيات شاملة */}
          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي القوالب
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.length}
                    </p>
                  </div>
                  <Archive className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      تعهدات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.type === 'تعهد').length}
                    </p>
                  </div>
                  <FileCheck className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إقرارات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.type === 'إقرار').length}
                    </p>
                  </div>
                  <FileSignature className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      عملاء
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.category === 'عميل').length}
                    </p>
                  </div>
                  <Users className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#f3e8ff', '--bg-to': '#e9d5ff', '--border-color': '#d8b4fe' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مالكين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.category === 'مالك').length}
                    </p>
                  </div>
                  <Building className="stats-icon-compact text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      موظفين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.category === 'موظف').length}
                    </p>
                  </div>
                  <UserCheck className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#ffedd5', '--bg-to': '#fed7aa', '--border-color': '#fdba74' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مقاولين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.category === 'مقاول').length}
                    </p>
                  </div>
                  <HardHat className="stats-icon-compact text-orange-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dcfce7', '--bg-to': '#bbf7d0', '--border-color': '#86efac' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      استشاريين
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {sampleTemplates.filter(t => t.category === 'استشاري').length}
                    </p>
                  </div>
                  <Briefcase className="stats-icon-compact text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* أكثر القوالب استخداماً */}
          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                أكثر القوالب استخداماً
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الترتيب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم القالب</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الاستخدام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...sampleTemplates]
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((template, index) => (
                      <TableRow key={template.id}>
                        <TableCell className="text-right">
                          <Badge className="bg-yellow-100 text-yellow-700">
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {template.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            template.type === 'تعهد' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }>
                            {template.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-gray-100 text-gray-700">
                            {template.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {template.usageCount}
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

    // تاب 941-12: الإعدادات العامة
    if (activeTab === '941-12') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                الإعدادات العامة
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                إعدادات عامة لنظام التعهدات والإقرارات
              </p>
            </div>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ التغييرات
            </Button>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            {/* إعدادات التوثيق */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات التوثيق الإلكتروني
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        تفعيل التوثيق الإلكتروني
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        السماح بالتوثيق الإلكتروني للتعهدات والإقرارات
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التوثيق المزدوج إلزامي
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        طلب توثيق من المكتب والمالك معاً
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        إرسال إشعارات التوثيق
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إرسال تنبيهات عند الحاجة للتوثيق
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات القوالب */}
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات القوالب
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        السماح بتعديل القوالب
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        السماح للمستخدمين بتعديل القوالب الموجودة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        الموافقة على القوالب الجديدة
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        طلب موافقة المدير على القوالب الجديدة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        التحكم في الإصدارات
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        حفظ نسخة من كل تعديل على القوالب
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              إعدادات التعهدات والإقرارات
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              إدارة شاملة لنماذج وقوالب التعهدات والإقرارات
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-941
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              12 تاب
            </Badge>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        {/* السايد بار الرأسي للتابات */}
        <Card className="w-56 card-rtl" style={{ height: 'fit-content' }}>
          <CardContent className="p-2">
            <div className="space-y-1">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-2 rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#2563eb] text-white'
                      : 'hover:bg-gray-100'
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

        {/* منطقة المحتوى */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة إنشاء قالب جديد */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إنشاء قالب {currentTab?.type} جديد
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              أدخل بيانات القالب الجديد
            </DialogDescription>
          </DialogHeader>

          <div className="form-rtl form-dense space-y-3">
            <div className="grid grid-cols-2 dense-grid">
              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اسم القالب *
                </Label>
                <Input
                  className="dense-input"
                  placeholder="اسم واضح للقالب"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>

              <div className="form-group">
                <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  طريقة التوثيق *
                </Label>
                <Select>
                  <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <SelectValue placeholder="اختر طريقة التوثيق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مكتب">توثيق من المكتب</SelectItem>
                    <SelectItem value="مالك">توثيق من المالك</SelectItem>
                    <SelectItem value="كلاهما">توثيق مزدوج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-group">
              <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                محتوى القالب *
              </Label>
              <Textarea
                className="dense-input"
                rows={10}
                placeholder="اكتب محتوى القالب هنا... استخدم {{field_name}} للحقول الديناميكية"
                style={{ fontFamily: 'Tajawal, sans-serif', height: 'auto', minHeight: '200px' }}
              />
              <p className="text-[10px] mt-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                مثال: أتعهد أنا {'{{entity_name}}'} بـ...
              </p>
            </div>

            <Card className="bg-blue-50 border-blue-200 card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحقول الديناميكية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  أضف الحقول التي سيتم ملؤها عند استخدام القالب
                </p>
                <Button className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Plus className="h-3.5 w-3.5 ml-2" />
                  إضافة حقل
                </Button>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Save className="h-3.5 w-3.5 ml-2" />
              حفظ القالب
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowCreateDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة معاينة القالب */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاينة القالب
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-3">
              {/* معلومات القالب */}
              <Card className="bg-blue-50 border-blue-200 card-rtl">
                <CardContent className="p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        الرقم
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedTemplate.templateNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        النوع
                      </p>
                      <Badge className={
                        selectedTemplate.type === 'تعهد' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }>
                        {selectedTemplate.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        عدد الاستخدام
                      </p>
                      <p className="text-sm" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {selectedTemplate.usageCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* محتوى القالب */}
              <Card className="card-rtl">
                <CardHeader className="card-header-dense">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى القالب
                  </CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div 
                    className="p-3 bg-gray-50 rounded"
                    style={{ 
                      fontFamily: 'Tajawal, sans-serif',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.8',
                      fontSize: '14px'
                    }}
                  >
                    {selectedTemplate.content}
                  </div>
                </CardContent>
              </Card>

              {/* الحقول */}
              <Card className="card-rtl">
                <CardHeader className="card-header-dense">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الحقول الديناميكية ({selectedTemplate.fields.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id} className="p-2 bg-gray-50 rounded">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                          {field.label}
                        </p>
                        <p className="text-[10px]" style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                          {'{'}{'{'}{field.name}{'}'}{'}'} - {field.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              className="dense-button bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <Edit className="h-3.5 w-3.5 ml-2" />
              تحرير
            </Button>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowPreviewDialog(false)}
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

export default CommitmentsDeclarationsSettingsScreen;
