/**
 * الشاشة 701 - إعدادات المعاملات - مطورة بالكامل v6.1
 * ============================================================
 * 
 * شاشة شاملة لإدارة جميع إعدادات نظام المعاملات
 * 11 تبويب مطور بالكامل مع:
 * - حقول إدخال بخلفيات ملونة
 * - عناوين بلون أزرق + Bold
 * - أزرار نسخ لجميع الحقول
 * - أزرار اختيار اليوم للتواريخ
 * - جميع الحقول تستخدم onChange لتجنب React warnings
 * 
 * التاب الجديد (701-11):
 * - تصنيفات المعاملات (رئيسية + فرعية)
 * - المهمات الافتراضية لكل تصنيف
 * - المستندات المطلوبة (من المالك + من المكتب)
 * - تكامل تلقائي مع شاشة إنشاء معاملة (286)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Settings, FileText, Calendar, Users, Tag, Database,
  Bell, Shield, Lock, RefreshCw, Save, Plus, Hash,
  Layout, Link2, CheckCircle, Eye, Activity, Zap,
  Trash2, Edit, Folder, FolderTree, ClipboardList, X
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// مكون إدارة تصنيفات المعاملات - يتكامل مع شاشة 286
const TransactionCategoriesManager: React.FC = () => {
  // تصنيفات رئيسية مع تصنيفات فرعية
  const [mainCategories, setMainCategories] = useState([
    {
      id: 1,
      name: 'ترخيص بناء',
      code: 'BUILD-LIC',
      subcategories: [
        { id: 11, name: 'سكني', code: 'RES' },
        { id: 12, name: 'تجاري', code: 'COM' },
        { id: 13, name: 'صناعي', code: 'IND' }
      ],
      defaultTasks: [
        { id: 1, name: 'استقبال الطلب', duration: 1, assignable: true },
        { id: 2, name: 'مراجعة المستندات', duration: 2, assignable: true },
        { id: 3, name: 'فحص الموقع', duration: 3, assignable: true },
        { id: 4, name: 'إعداد المخططات', duration: 5, assignable: true },
        { id: 5, name: 'مراجعة فنية', duration: 3, assignable: true },
        { id: 6, name: 'موافقة البلدية', duration: 7, assignable: false },
        { id: 7, name: 'استخراج الترخيص', duration: 5, assignable: true },
        { id: 8, name: 'التسليم للعميل', duration: 1, assignable: true }
      ],
      ownerDocuments: [
        { id: 1, name: 'صورة الهوية الوطنية', required: true },
        { id: 2, name: 'صورة الصك', required: true },
        { id: 3, name: 'الموقع الجغرافي', required: true },
        { id: 4, name: 'صور الموقع', required: false }
      ],
      officeDocuments: [
        { id: 1, name: 'المخطط المعماري', required: true },
        { id: 2, name: 'المخطط الإنشائي', required: true },
        { id: 3, name: 'دراسة المرافق', required: true },
        { id: 4, name: 'تقرير فني', required: false }
      ]
    },
    {
      id: 2,
      name: 'إفراز',
      code: 'SUBDIVIDE',
      subcategories: [
        { id: 21, name: 'تقسيم أرض', code: 'LAND-SPLIT' },
        { id: 22, name: 'إفراز إرث', code: 'INHERIT' },
        { id: 23, name: 'تجزئة عقار', code: 'PROP-SPLIT' }
      ],
      defaultTasks: [
        { id: 1, name: 'استقبال الطلب', duration: 1, assignable: true },
        { id: 2, name: 'مراجعة الصك', duration: 2, assignable: true },
        { id: 3, name: 'المسح الميداني', duration: 4, assignable: true },
        { id: 4, name: 'إعداد المخطط', duration: 5, assignable: true },
        { id: 5, name: 'موافقة الأمانة', duration: 10, assignable: false },
        { id: 6, name: 'استخراج الصكوك', duration: 7, assignable: false },
        { id: 7, name: 'التسليم النهائي', duration: 1, assignable: true }
      ],
      ownerDocuments: [
        { id: 1, name: 'صورة الصك الأصلي', required: true },
        { id: 2, name: 'صورة الهوية', required: true },
        { id: 3, name: 'حصر الورثة (للإفراز الإرثي)', required: false }
      ],
      officeDocuments: [
        { id: 1, name: 'مخطط المساحة', required: true },
        { id: 2, name: 'تقرير المسح', required: true },
        { id: 3, name: 'الحسابات المساحية', required: true }
      ]
    }
  ]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [showAddMain, setShowAddMain] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  const selectedCategory = mainCategories.find(c => c.id === selectedMainCategory);

  return (
    <div className="space-y-4">
      {/* قسم التصنيفات الرئيسية */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="compact-title" style={{ color: '#2563eb', fontWeight: 700 }}>
            التصنيفات الرئيسية
          </h3>
          <Button
            className="dense-btn dense-btn-primary"
            onClick={() => setShowAddMain(!showAddMain)}
          >
            <Plus className="h-3 w-3" />
            إضافة تصنيف رئيسي
          </Button>
        </div>

        {showAddMain && (
          <Card className="dense-content-card mb-3 bg-blue-50">
            <div className="dense-grid dense-grid-2 gap-3">
              <InputWithCopy
                label="اسم التصنيف الرئيسي"
                id="newMainCatName"
                value=""
                onChange={() => {}}
                placeholder="مثال: ترخيص بناء"
              />
              <InputWithCopy
                label="كود التصنيف"
                id="newMainCatCode"
                value=""
                onChange={() => {}}
                placeholder="مثال: BUILD-LIC"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Button className="dense-btn dense-btn-primary">
                <Plus className="h-3 w-3" />
                إضافة
              </Button>
              <Button className="dense-btn dense-btn-secondary" onClick={() => setShowAddMain(false)}>
                <X className="h-3 w-3" />
                إلغاء
              </Button>
            </div>
          </Card>
        )}

        <div className="dense-grid dense-grid-3 gap-3">
          {mainCategories.map(category => (
            <Card
              key={category.id}
              className={`dense-content-card cursor-pointer ${selectedMainCategory === category.id ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => setSelectedMainCategory(category.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Folder className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="compact-title">{category.name}</div>
                    <div className="text-xs text-gray-600 font-mono">{category.code}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button className="dense-action-btn">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Badge className="bg-green-100 text-green-700">
                  {category.subcategories.length} فرعي
                </Badge>
                <Badge className="bg-purple-100 text-purple-700">
                  {category.defaultTasks.length} مهمة
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <>
          <Separator />

          {/* قسم التصنيفات الفرعية */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="compact-title" style={{ color: '#2563eb', fontWeight: 700 }}>
                التصنيفات الفرعية لـ "{selectedCategory.name}"
              </h3>
              <Button
                className="dense-btn dense-btn-primary"
                onClick={() => setShowAddSub(!showAddSub)}
              >
                <Plus className="h-3 w-3" />
                إضافة تصنيف فرعي
              </Button>
            </div>

            {showAddSub && (
              <Card className="dense-content-card mb-3 bg-green-50">
                <div className="dense-grid dense-grid-2 gap-3">
                  <InputWithCopy
                    label="اسم التصنيف الفرعي"
                    id="newSubCatName"
                    value=""
                    onChange={() => {}}
                    placeholder="مثال: سكني"
                  />
                  <InputWithCopy
                    label="كود التصنيف"
                    id="newSubCatCode"
                    value=""
                    onChange={() => {}}
                    placeholder="مثال: RES"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة
                  </Button>
                  <Button className="dense-btn dense-btn-secondary" onClick={() => setShowAddSub(false)}>
                    <X className="h-3 w-3" />
                    إلغاء
                  </Button>
                </div>
              </Card>
            )}

            <div className="dense-grid dense-grid-4 gap-2">
              {selectedCategory.subcategories.map(sub => (
                <Card
                  key={sub.id}
                  className={`dense-content-card cursor-pointer ${selectedSubcategory === sub.id ? 'border-green-500 bg-green-50' : ''}`}
                  onClick={() => setSelectedSubcategory(sub.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="compact-text font-medium">{sub.name}</div>
                      <div className="text-xs text-gray-600 font-mono">{sub.code}</div>
                    </div>
                    <Button className="dense-action-btn">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* قسم المهمات الافتراضية */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="compact-title" style={{ color: '#2563eb', fontWeight: 700 }}>
                المهمات الافتراضية ({selectedCategory.defaultTasks.length})
              </h3>
              <Button
                className="dense-btn dense-btn-primary"
                onClick={() => setShowAddTask(!showAddTask)}
              >
                <Plus className="h-3 w-3" />
                إضافة مهمة
              </Button>
            </div>

            {showAddTask && (
              <Card className="dense-content-card mb-3 bg-purple-50">
                <div className="dense-grid dense-grid-3 gap-3">
                  <InputWithCopy
                    label="اسم المهمة"
                    id="newTaskName"
                    value=""
                    onChange={() => {}}
                    placeholder="مثال: استقبال الطلب"
                  />
                  <InputWithCopy
                    label="المدة (أيام)"
                    id="newTaskDuration"
                    type="number"
                    value=""
                    onChange={() => {}}
                    placeholder="1"
                  />
                  <SelectWithCopy
                    label="قابلة للإسناد"
                    id="newTaskAssignable"
                    value=""
                    onChange={() => {}}
                    options={[
                      { value: 'true', label: 'نعم' },
                      { value: 'false', label: 'لا (جهة خارجية)' }
                    ]}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة
                  </Button>
                  <Button className="dense-btn dense-btn-secondary" onClick={() => setShowAddTask(false)}>
                    <X className="h-3 w-3" />
                    إلغاء
                  </Button>
                </div>
              </Card>
            )}

            <div className="space-y-2">
              {selectedCategory.defaultTasks.map((task, i) => (
                <Card key={task.id} className="dense-content-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="compact-text font-medium">{task.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{task.duration} يوم</span>
                          {!task.assignable && (
                            <Badge className="bg-gray-100 text-gray-700">جهة خارجية</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button className="dense-action-btn">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button className="dense-action-btn">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* قسم المستندات المطلوبة */}
          <div className="dense-grid dense-grid-2 gap-4">
            {/* مستندات من المالك */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="compact-title" style={{ color: '#2563eb', fontWeight: 700 }}>
                  مستندات من المالك ({selectedCategory.ownerDocuments.length})
                </h3>
                <Button
                  className="dense-btn dense-btn-primary"
                  onClick={() => setShowAddDoc(!showAddDoc)}
                >
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </div>
              <div className="space-y-2">
                {selectedCategory.ownerDocuments.map(doc => (
                  <Card key={doc.id} className="dense-content-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="compact-text">{doc.name}</div>
                          <Badge className={doc.required ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                            {doc.required ? 'مطلوب' : 'اختياري'}
                          </Badge>
                        </div>
                      </div>
                      <Button className="dense-action-btn">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* مستندات من المكتب */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="compact-title" style={{ color: '#16a34a', fontWeight: 700 }}>
                  مستندات من المكتب ({selectedCategory.officeDocuments.length})
                </h3>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="h-3 w-3" />
                  إضافة
                </Button>
              </div>
              <div className="space-y-2">
                {selectedCategory.officeDocuments.map(doc => (
                  <Card key={doc.id} className="dense-content-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="compact-text">{doc.name}</div>
                          <Badge className={doc.required ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                            {doc.required ? 'مطلوب' : 'اختياري'}
                          </Badge>
                        </div>
                      </div>
                      <Button className="dense-action-btn">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* ملاحظة التكامل */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="compact-title mb-1" style={{ color: '#2563eb' }}>
                  التكامل مع شاشة إنشاء معاملة (286)
                </h4>
                <p className="compact-text text-gray-700">
                  جميع التصنيفات والمهمات والمستندات المعرّفة هنا ستظهر تلقائياً في شاشة إنشاء معاملة جديدة. 
                  عند اختيار تصنيف، سيتم تحميل المهمات الافتراضية والمستندات المطلوبة تلقائياً.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TABS_CONFIG = [
  { id: '701-01', number: '701-01', title: 'الإعدادات العامة', icon: Settings },
  { id: '701-02', number: '701-02', title: 'نظام الترقيم', icon: Hash },
  { id: '701-03', number: '701-03', title: 'حقول المعاملات', icon: FileText },
  { id: '701-04', number: '701-04', title: 'المراحل والحالات', icon: Activity },
  { id: '701-05', number: '701-05', title: 'الأولويات والتصنيف', icon: Tag },
  { id: '701-06', number: '701-06', title: 'المواعيد والتنبيهات', icon: Calendar },
  { id: '701-07', number: '701-07', title: 'صلاحيات المعاملات', icon: Shield },
  { id: '701-08', number: '701-08', title: 'الإشعارات التلقائية', icon: Bell },
  { id: '701-09', number: '701-09', title: 'القوالب والنماذج', icon: Layout },
  { id: '701-10', number: '701-10', title: 'التكامل والربط', icon: Link2 },
  { id: '701-11', number: '701-11', title: 'تصنيفات المعاملات', icon: FolderTree },
  { id: '701-12', number: '701-12', title: 'متطلبات شركة الكهرباء', icon: Zap }
];

const TransactionsSettings_Complete_701: React.FC = () => {
  const [activeTab, setActiveTab] = useState('701-01');
  const [autoSave, setAutoSave] = useState(true);
  
  // حالات النماذج - جميع الحقول في state لتجنب React warnings
  const [formData, setFormData] = useState({
    // Tab 01: الإعدادات العامة
    transactionPrefix: 'TRX',
    fiscalYear: '2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    defaultStatus: 'جديدة',
    autoArchive: true,
    archiveDays: '90',
    
    // Tab 02: نظام الترقيم
    numberingPattern: 'TRX-YYYY-NNNN',
    prefix: 'TRX',
    currentSequence: '1234',
    numberingType: 'سنوي',
    sequenceLength: '4',
    
    // Tab 03: حقول المعاملات
    titleFieldName: 'عنوان المعاملة',
    titleFieldType: 'text',
    descFieldName: 'وصف المعاملة',
    dateFieldName: 'تاريخ المعاملة',
    dateFormat: 'YYYY-MM-DD',
    
    // Tab 06: المواعيد والتنبيهات
    warningDays: '3',
    fiscalYearStart: '2025-01-01',
    fiscalYearEnd: '2025-12-31',
    workHours: '8',
    weekendDays: 'الجمعة-السبت',
    notificationEmail: 'notifications@example.com',
    
    // Tab 08: الإشعارات التلقائية
    primaryEmail: 'admin@example.com',
    backupEmail: 'backup@example.com',
    phone: '+966501234567',
    dailyReportTime: '08:00',
    weeklyReport: 'الأحد',
    reminderDays: '3',
    
    // Tab 10: التكامل والربط
    apiEndpoint: 'https://api.example.com/transactions',
    apiKey: 'sk_live_xxxxxxxxxxxx',
    webhookUrl: 'https://webhook.example.com/transactions/callback',
    integrationType: 'REST API',
    
    // Tab 12: متطلبات شركة الكهرباء
    minAreaResidential: '300',
    minAreaCommercial: '500',
    minAreaIndustrial: '1000',
    minAreaAdmin: '400',
    roomLength: '3.0',
    roomWidth: '2.5',
    roomHeight: '2.8',
    totalArea: '7.5',
    minClearHeight: '2.6',
    technicalNotes: `- يجب أن تكون الغرفة في موقع يسهل الوصول إليه
- يجب توفير تهوية مناسبة للغرفة
- يجب عزل الجدران والأرضية ضد الرطوبة
- يجب توفير إضاءة كافية داخل الغرفة
- يجب تركيب باب معدني مقاوم للحريق`,
    requiredDocs: `- شهادة إنجاز الأعمال الكهربائية
- تقرير الفحص الفني
- مخططات غرفة الكهرباء المعتمدة
- شهادة المقاول المرخص
- موافقة الدفاع المدني على الأنظمة الكهربائية`,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 701-01: الإعدادات العامة
      case '701-01':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Settings className="h-5 w-5" />
                  الإعدادات العامة للمعاملات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div className="space-y-4">
                    <InputWithCopy
                      label="بادئة رقم المعاملة"
                      id="transactionPrefix"
                      value={formData.transactionPrefix}
                      onChange={(e) => handleChange('transactionPrefix', e.target.value)}
                      placeholder="مثال: TRX"
                      required
                    />

                    <InputWithCopy
                      label="السنة المالية"
                      id="fiscalYear"
                      type="number"
                      value={formData.fiscalYear}
                      onChange={(e) => handleChange('fiscalYear', e.target.value)}
                      placeholder="2025"
                      required
                    />

                    <DateInputWithToday
                      label="تاريخ بداية السنة المالية"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <DateInputWithToday
                      label="تاريخ نهاية السنة المالية"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      required
                    />

                    <SelectWithCopy
                      label="الحالة الافتراضية للمعاملات الجديدة"
                      id="defaultStatus"
                      value={formData.defaultStatus}
                      onChange={(e) => handleChange('defaultStatus', e.target.value)}
                      options={[
                        { value: 'جديدة', label: 'جديدة' },
                        { value: 'قيد المراجعة', label: 'قيد المراجعة' },
                        { value: 'معلقة', label: 'معلقة' },
                      ]}
                      required
                    />

                    <InputWithCopy
                      label="أيام الأرشفة التلقائية"
                      id="archiveDays"
                      type="number"
                      value={formData.archiveDays}
                      onChange={(e) => handleChange('archiveDays', e.target.value)}
                      placeholder="90"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <label 
                        className="compact-title"
                        style={{ 
                          fontWeight: 700, 
                          color: '#2563eb',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        تفعيل الحفظ التلقائي
                      </label>
                      <p className="compact-subtitle">حفظ التغييرات تلقائياً كل 30 ثانية</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <label 
                        className="compact-title"
                        style={{ 
                          fontWeight: 700, 
                          color: '#2563eb',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        تفعيل الأرشفة التلقائية
                      </label>
                      <p className="compact-subtitle">أرشفة المعاملات المكتملة تلقائياً</p>
                    </div>
                    <Switch checked={formData.autoArchive} onCheckedChange={(v) => handleChange('autoArchive', v)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-02: نظام الترقيم
      case '701-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Hash className="h-5 w-5" />
                  إعدادات نظام الترقيم
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div className="space-y-4">
                    <InputWithCopy
                      label="نمط الترقيم"
                      id="numberingPattern"
                      value={formData.numberingPattern}
                      onChange={(e) => handleChange('numberingPattern', e.target.value)}
                      placeholder="TRX-YYYY-NNNN"
                      required
                    />

                    <InputWithCopy
                      label="بادئة الرقم"
                      id="prefix"
                      value={formData.prefix}
                      onChange={(e) => handleChange('prefix', e.target.value)}
                      placeholder="TRX"
                      required
                    />

                    <InputWithCopy
                      label="الرقم التسلسلي الحالي"
                      id="currentSequence"
                      type="number"
                      value={formData.currentSequence}
                      onChange={(e) => handleChange('currentSequence', e.target.value)}
                      placeholder="1234"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <SelectWithCopy
                      label="نوع الترقيم"
                      id="numberingType"
                      value={formData.numberingType}
                      onChange={(e) => handleChange('numberingType', e.target.value)}
                      options={[
                        { value: 'سنوي', label: 'سنوي (يبدأ كل سنة من 1)' },
                        { value: 'تسلسلي', label: 'تسلسلي (مستمر)' },
                        { value: 'شهري', label: 'شهري (يبدأ كل شهر من 1)' },
                      ]}
                      required
                    />

                    <InputWithCopy
                      label="طول الرقم التسلسلي"
                      id="sequenceLength"
                      type="number"
                      value={formData.sequenceLength}
                      onChange={(e) => handleChange('sequenceLength', e.target.value)}
                      placeholder="4"
                      required
                    />

                    <InputWithCopy
                      label="مثال على الترقيم"
                      id="exampleNumber"
                      defaultValue="TRX-2025-0001"
                      readOnly
                      style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 
                    className="compact-title mb-2"
                    style={{ 
                      fontWeight: 700, 
                      color: '#2563eb',
                      fontFamily: 'Tajawal, sans-serif'
                    }}
                  >
                    معاينة الترقيم
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="compact-text">معاملة جديدة:</span>
                      <code className="font-code text-sm font-bold text-blue-600">TRX-2025-0001</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="compact-text">المعاملة التالية:</span>
                      <code className="font-code text-sm font-bold text-blue-600">TRX-2025-0002</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="compact-text">المعاملة المتوقعة لنهاية السنة:</span>
                      <code className="font-code text-sm font-bold text-blue-600">TRX-2025-2500</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-03: حقول المعاملات
      case '701-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FileText className="h-5 w-5" />
                  تخصيص حقول المعاملات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة حقل
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 
                      className="compact-title mb-3"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      حقل العنوان
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <InputWithCopy
                        label="اسم الحقل"
                        value={formData.titleFieldName}
                        onChange={(e) => handleChange('titleFieldName', e.target.value)}
                        required
                      />
                      <SelectWithCopy
                        label="نوع الحقل"
                        value={formData.titleFieldType}
                        onChange={(e) => handleChange('titleFieldType', e.target.value)}
                        options={[
                          { value: 'text', label: 'نص' },
                          { value: 'number', label: 'رقم' },
                          { value: 'date', label: 'تاريخ' },
                          { value: 'select', label: 'قائمة منسدلة' },
                        ]}
                        required
                      />
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span 
                          className="compact-text"
                          style={{ 
                            fontWeight: 700, 
                            color: '#2563eb',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          حقل مطلوب
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span 
                          className="compact-text"
                          style={{ 
                            fontWeight: 700, 
                            color: '#2563eb',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          قابل للبحث
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 
                      className="compact-title mb-3"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      حقل الوصف
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <InputWithCopy
                        label="اسم الحقل"
                        value={formData.descFieldName}
                        onChange={(e) => handleChange('descFieldName', e.target.value)}
                        required
                      />
                      <SelectWithCopy
                        label="نوع الحقل"
                        defaultValue="textarea"
                        options={[
                          { value: 'textarea', label: 'نص طويل' },
                          { value: 'text', label: 'نص قصير' },
                        ]}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 
                      className="compact-title mb-3"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      حقل التاريخ
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-4">
                      <InputWithCopy
                        label="اسم الحقل"
                        value={formData.dateFieldName}
                        onChange={(e) => handleChange('dateFieldName', e.target.value)}
                        required
                      />
                      <SelectWithCopy
                        label="صيغة التاريخ"
                        value={formData.dateFormat}
                        onChange={(e) => handleChange('dateFormat', e.target.value)}
                        options={[
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                          { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
                        ]}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-04: المراحل والحالات
      case '701-04':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Activity className="h-5 w-5" />
                  إدارة مراحل وحالات المعاملات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة حالة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'جديدة', color: '#3b82f6', order: 1 },
                    { name: 'قيد المراجعة', color: '#f59e0b', order: 2 },
                    { name: 'معتمدة', color: '#10b981', order: 3 },
                    { name: 'مكتملة', color: '#6366f1', order: 4 },
                  ].map((status, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="dense-grid dense-grid-3 gap-4">
                        <InputWithCopy
                          label="اسم الحالة"
                          defaultValue={status.name}
                          required
                        />
                        <div className="dense-form-group">
                          <label 
                            className="dense-form-label"
                            style={{ 
                              fontWeight: 700, 
                              color: '#2563eb',
                              fontFamily: 'Tajawal, sans-serif'
                            }}
                          >
                            لون الحالة
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              defaultValue={status.color}
                              className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                              style={{ backgroundColor: status.color }}
                            />
                            <InputWithCopy
                              defaultValue={status.color}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <InputWithCopy
                          label="ترتيب العرض"
                          type="number"
                          defaultValue={status.order.toString()}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-05: الأولويات والتصنيف
      case '701-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Tag className="h-5 w-5" />
                  إدارة الأولويات والتصنيفات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة تصنيف
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div>
                    <h3 
                      className="compact-title mb-3"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      مستويات الأولوية
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'عاجل جداً', color: '#ef4444', days: '1' },
                        { name: 'عاجل', color: '#f59e0b', days: '3' },
                        { name: 'عادي', color: '#3b82f6', days: '7' },
                        { name: 'منخفض', color: '#6b7280', days: '14' },
                      ].map((priority, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: priority.color }}
                            />
                            <InputWithCopy
                              label="اسم الأولوية"
                              defaultValue={priority.name}
                              className="flex-1"
                            />
                          </div>
                          <InputWithCopy
                            label="مدة الإنجاز المتوقعة (أيام)"
                            type="number"
                            defaultValue={priority.days}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 
                      className="compact-title mb-3"
                      style={{ 
                        fontWeight: 700, 
                        color: '#2563eb',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      تصنيفات المعاملات
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'معاملة داخلية' },
                        { name: 'معاملة خارجية' },
                        { name: 'معاملة حكومية' },
                        { name: 'معاملة مالية' },
                      ].map((category, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg border border-gray-200">
                          <InputWithCopy
                            label="اسم التصنيف"
                            defaultValue={category.name}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-06: المواعيد والتنبيهات
      case '701-06':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-5 w-5" />
                  إعدادات المواعيد والتنبيهات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div className="space-y-4">
                    <InputWithCopy
                      label="أيام التحذير قبل الموعد"
                      id="warningDays"
                      type="number"
                      value={formData.warningDays}
                      onChange={(e) => handleChange('warningDays', e.target.value)}
                      placeholder="3"
                      required
                    />

                    <DateInputWithToday
                      label="بداية العام المالي"
                      id="fiscalYearStart"
                      value={formData.fiscalYearStart}
                      onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
                      required
                    />

                    <DateInputWithToday
                      label="نهاية العام المالي"
                      id="fiscalYearEnd"
                      value={formData.fiscalYearEnd}
                      onChange={(e) => handleChange('fiscalYearEnd', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <InputWithCopy
                      label="ساعات العمل اليومية"
                      id="workHours"
                      type="number"
                      value={formData.workHours}
                      onChange={(e) => handleChange('workHours', e.target.value)}
                      placeholder="8"
                      required
                    />

                    <SelectWithCopy
                      label="أيام الإجازة الأسبوعية"
                      id="weekendDays"
                      value={formData.weekendDays}
                      onChange={(e) => handleChange('weekendDays', e.target.value)}
                      options={[
                        { value: 'الجمعة-السبت', label: 'الجمعة والسبت' },
                        { value: 'الجمعة', label: 'الجمعة فقط' },
                        { value: 'السبت-الأحد', label: 'السبت والأحد' },
                      ]}
                      required
                    />

                    <InputWithCopy
                      label="بريد التنبيهات الرئيسي"
                      id="notificationEmail"
                      type="email"
                      value={formData.notificationEmail}
                      onChange={(e) => handleChange('notificationEmail', e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {[
                    { title: 'إرسال تنبيه عند إضافة معاملة جديدة', desc: 'إشعار فوري لجميع المسؤولين' },
                    { title: 'إرسال تنبيه قبل انتهاء الموعد', desc: 'تنبيه قبل 3 أيام من الموعد' },
                    { title: 'إرسال تنبيه عند تغيير الحالة', desc: 'إشعار عند تغيير حالة المعاملة' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <label 
                          className="compact-title"
                          style={{ 
                            fontWeight: 700, 
                            color: '#2563eb',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {item.title}
                        </label>
                        <p className="compact-subtitle">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-07: صلاحيات المعاملات
      case '701-07':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Shield className="h-5 w-5" />
                  صلاحيات المعاملات
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: 'مدير النظام', create: true, edit: true, delete: true, view: true },
                    { role: 'مدير المعاملات', create: true, edit: true, delete: false, view: true },
                    { role: 'موظف معاملات', create: true, edit: true, delete: false, view: true },
                    { role: 'مستخدم عادي', create: false, edit: false, delete: false, view: true },
                  ].map((perm, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
                      <h3 
                        className="compact-title mb-3"
                        style={{ 
                          fontWeight: 700, 
                          color: '#2563eb',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {perm.role}
                      </h3>
                      <div className="dense-grid dense-grid-4 gap-3">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={perm.view} />
                          <span className="compact-text">عرض</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={perm.create} />
                          <span className="compact-text">إضافة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={perm.edit} />
                          <span className="compact-text">تعديل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={perm.delete} />
                          <span className="compact-text">حذف</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-08: الإشعارات التلقائية
      case '701-08':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات التلقائية
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-2 gap-4">
                  <div className="space-y-4">
                    <InputWithCopy
                      label="البريد الإلكتروني الرئيسي"
                      id="primaryEmail"
                      type="email"
                      value={formData.primaryEmail}
                      onChange={(e) => handleChange('primaryEmail', e.target.value)}
                      placeholder="email@example.com"
                      required
                    />

                    <InputWithCopy
                      label="البريد الإلكتروني الاحتياطي"
                      id="backupEmail"
                      type="email"
                      value={formData.backupEmail}
                      onChange={(e) => handleChange('backupEmail', e.target.value)}
                      placeholder="email@example.com"
                    />

                    <InputWithCopy
                      label="رقم الجوال للتنبيهات العاجلة"
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+966501234567"
                    />
                  </div>

                  <div className="space-y-4">
                    <SelectWithCopy
                      label="وقت إرسال التقرير اليومي"
                      id="dailyReportTime"
                      value={formData.dailyReportTime}
                      onChange={(e) => handleChange('dailyReportTime', e.target.value)}
                      options={[
                        { value: '08:00', label: '8:00 صباحاً' },
                        { value: '09:00', label: '9:00 صباحاً' },
                        { value: '10:00', label: '10:00 صباحاً' },
                      ]}
                      required
                    />

                    <SelectWithCopy
                      label="تكرار التقرير الأسبوعي"
                      id="weeklyReport"
                      value={formData.weeklyReport}
                      onChange={(e) => handleChange('weeklyReport', e.target.value)}
                      options={[
                        { value: 'الأحد', label: 'الأحد' },
                        { value: 'الاثنين', label: 'الاثنين' },
                        { value: 'الخميس', label: 'الخميس' },
                      ]}
                      required
                    />

                    <InputWithCopy
                      label="عدد أيام التذكير قبل الموعد"
                      id="reminderDays"
                      type="number"
                      value={formData.reminderDays}
                      onChange={(e) => handleChange('reminderDays', e.target.value)}
                      placeholder="3"
                      required
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {[
                    'إشعار بالبريد الإلكتروني',
                    'إشعار برسالة نصية (SMS)',
                    'إشعار داخل النظام',
                    'إشعار على التطبيق المحمول',
                  ].map((notification, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <label 
                        className="compact-title"
                        style={{ 
                          fontWeight: 700, 
                          color: '#2563eb',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {notification}
                      </label>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-09: القوالب والنماذج
      case '701-09':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layout className="h-5 w-5" />
                  القوالب والنماذج
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    قالب جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'قالب المعاملة العامة', fields: 12, usage: 342 },
                    { name: 'قالب المعاملة الحكومية', fields: 18, usage: 156 },
                    { name: 'قالب المعاملة المالية', fields: 15, usage: 89 },
                  ].map((template, i) => (
                    <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 
                          className="compact-title"
                          style={{ 
                            fontWeight: 700, 
                            color: '#2563eb',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">{template.fields} حقل</Badge>
                          <Badge className="bg-green-100 text-green-700">{template.usage} استخدام</Badge>
                        </div>
                      </div>
                      <div className="dense-grid dense-grid-2 gap-3">
                        <InputWithCopy
                          label="اسم القالب"
                          defaultValue={template.name}
                          required
                        />
                        <InputWithCopy
                          label="عدد الحقول"
                          type="number"
                          defaultValue={template.fields.toString()}
                          readOnly
                          style={{ backgroundColor: 'rgba(243, 244, 246, 0.7)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-10: التكامل والربط
      case '701-10':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Link2 className="h-5 w-5" />
                  إعدادات التكامل والربط
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InputWithCopy
                    label="API Endpoint"
                    id="apiEndpoint"
                    type="url"
                    value={formData.apiEndpoint}
                    onChange={(e) => handleChange('apiEndpoint', e.target.value)}
                    placeholder="https://..."
                    required
                  />

                  <InputWithCopy
                    label="API Key"
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    placeholder="API Key"
                    required
                  />

                  <TextAreaWithCopy
                    label="Webhook URL"
                    id="webhookUrl"
                    value={formData.webhookUrl}
                    onChange={(e) => handleChange('webhookUrl', e.target.value)}
                    placeholder="https://..."
                    rows={3}
                  />

                  <SelectWithCopy
                    label="نوع التكامل"
                    id="integrationType"
                    value={formData.integrationType}
                    onChange={(e) => handleChange('integrationType', e.target.value)}
                    options={[
                      { value: 'REST API', label: 'REST API' },
                      { value: 'GraphQL', label: 'GraphQL' },
                      { value: 'SOAP', label: 'SOAP' },
                      { value: 'Webhook', label: 'Webhook' },
                    ]}
                    required
                  />

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <label 
                        className="compact-title"
                        style={{ 
                          fontWeight: 700, 
                          color: '#2563eb',
                          fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        تفعيل المزامنة التلقائية
                      </label>
                      <p className="compact-subtitle">مزامنة البيانات كل 5 دقائق</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 701-11: تصنيفات المعاملات
      case '701-11':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FolderTree className="h-5 w-5" />
                  إدارة تصنيفات المعاملات
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Save className="h-3 w-3" />
                    حفظ جميع التغييرات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionCategoriesManager />
              </CardContent>
            </Card>
          </div>
        );

      // 701-12: متطلبات شركة الكهرباء
      case '701-12':
        return (
          <div className="universal-dense-tab-content">
            {/* قسم أنواع وتصنيفات المعاملات */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Zap className="h-5 w-5" />
                  أنواع وتصنيفات المعاملات التي تتطلب غرفة كهرباء
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة تصنيف
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="dense-grid dense-grid-3 gap-3">
                  {[
                    { type: 'سكني', minArea: 300, roomRequired: true, color: 'blue' },
                    { type: 'تجاري', minArea: 500, roomRequired: true, color: 'green' },
                    { type: 'صناعي', minArea: 1000, roomRequired: true, color: 'purple' },
                    { type: 'إداري', minArea: 400, roomRequired: true, color: 'orange' },
                    { type: 'مستودعات', minArea: 800, roomRequired: true, color: 'cyan' },
                    { type: 'مجمعات سكنية', minArea: 1500, roomRequired: true, color: 'pink' }
                  ].map((cat, idx) => (
                    <Card key={idx} className="dense-content-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-${cat.color}-100 text-${cat.color}-700 flex items-center justify-center`}>
                            <Zap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="compact-title">{cat.type}</div>
                            <Badge className={`bg-${cat.color}-100 text-${cat.color}-700 text-xs`}>
                              {cat.roomRequired ? 'يتطلب غرفة' : 'لا يتطلب'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحد الأدنى للمساحة:</span>
                          <span className="font-medium">{cat.minArea} م²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">غرفة كهرباء:</span>
                          <span className="font-medium text-green-600">
                            {cat.roomRequired ? 'مطلوبة' : 'غير مطلوبة'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* قسم إجمالي المساحات */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Activity className="h-5 w-5" />
                  شروط المساحة لطلب غرفة كهرباء
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="compact-title mb-2" style={{ color: '#d97706' }}>
                        القاعدة العامة لشركة الكهرباء
                      </h4>
                      <p className="compact-text text-gray-700">
                        تطلب شركة الكهرباء توفير غرفة كهرباء مستقلة للمشاريع التي تتجاوز مساحتها الحد المعين حسب نوع المبنى.
                        يجب أن تكون الغرفة مطابقة للمواصفات الفنية المحددة من الشركة.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-2 gap-3">
                  <InputWithCopy
                    label="الحد الأدنى للمساحة (سكني)"
                    id="minAreaResidential"
                    value="300"
                    onChange={(e) => setFormData({...formData, minAreaResidential: e.target.value})}
                    placeholder="300"
                  />
                  <InputWithCopy
                    label="الحد الأدنى للمساحة (تجاري)"
                    id="minAreaCommercial"
                    value="500"
                    onChange={(e) => setFormData({...formData, minAreaCommercial: e.target.value})}
                    placeholder="500"
                  />
                  <InputWithCopy
                    label="الحد الأدنى للمساحة (صناعي)"
                    id="minAreaIndustrial"
                    value="1000"
                    onChange={(e) => setFormData({...formData, minAreaIndustrial: e.target.value})}
                    placeholder="1000"
                  />
                  <InputWithCopy
                    label="الحد الأدنى للمساحة (إداري)"
                    id="minAreaAdmin"
                    value="400"
                    onChange={(e) => setFormData({...formData, minAreaAdmin: e.target.value})}
                    placeholder="400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* قسم الأبعاد النظامية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Layout className="h-5 w-5" />
                  الأبعاد النظامية لغرفة الكهرباء
                </h2>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="compact-title mb-2" style={{ color: '#2563eb' }}>
                        المواصفات الفنية المعتمدة
                      </h4>
                      <p className="compact-text text-gray-700">
                        الأبعاد التالية هي الحد الأدنى المطلوب من شركة الكهرباء. يمكن تعديلها حسب نوع المشروع وحجمه.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="dense-grid dense-grid-3 gap-3">
                  <div className="dense-content-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="compact-title" style={{ color: '#2563eb' }}>الطول</span>
                      <Badge className="bg-blue-100 text-blue-700">متر</Badge>
                    </div>
                    <InputWithCopy
                      label=""
                      id="roomLength"
                      value="3.0"
                      onChange={(e) => setFormData({...formData, roomLength: e.target.value})}
                      placeholder="3.0"
                    />
                  </div>

                  <div className="dense-content-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="compact-title" style={{ color: '#10b981' }}>العرض</span>
                      <Badge className="bg-green-100 text-green-700">متر</Badge>
                    </div>
                    <InputWithCopy
                      label=""
                      id="roomWidth"
                      value="2.5"
                      onChange={(e) => setFormData({...formData, roomWidth: e.target.value})}
                      placeholder="2.5"
                    />
                  </div>

                  <div className="dense-content-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="compact-title" style={{ color: '#f59e0b' }}>الارتفاع</span>
                      <Badge className="bg-orange-100 text-orange-700">متر</Badge>
                    </div>
                    <InputWithCopy
                      label=""
                      id="roomHeight"
                      value="2.8"
                      onChange={(e) => setFormData({...formData, roomHeight: e.target.value})}
                      placeholder="2.8"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="dense-grid dense-grid-2 gap-3">
                  <InputWithCopy
                    label="المساحة الإجمالية المطلوبة"
                    id="totalArea"
                    value="7.5"
                    onChange={(e) => setFormData({...formData, totalArea: e.target.value})}
                    placeholder="7.5"
                  />
                  <InputWithCopy
                    label="الحد الأدنى للارتفاع الحر"
                    id="minClearHeight"
                    value="2.6"
                    onChange={(e) => setFormData({...formData, minClearHeight: e.target.value})}
                    placeholder="2.6"
                  />
                </div>
              </CardContent>
            </Card>

            {/* قسم أنواع غرف الكهرباء */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <FolderTree className="h-5 w-5" />
                  أنواع غرف الكهرباء حسب المشروع
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <Plus className="h-3 w-3" />
                    إضافة نوع
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: 'غرفة كهرباء قياسية',
                      description: 'للمباني السكنية والتجارية الصغيرة',
                      dimensions: '3.0م × 2.5م × 2.8م',
                      load: 'حتى 100 أمبير',
                      color: 'blue',
                      features: ['مفاتيح حماية', 'لوحة توزيع', 'عداد كهربائي', 'إضاءة طوارئ']
                    },
                    {
                      type: 'غرفة كهرباء متوسطة',
                      description: 'للمباني التجارية والإدارية المتوسطة',
                      dimensions: '4.0م × 3.0م × 3.0م',
                      load: 'من 100 إلى 400 أمبير',
                      color: 'green',
                      features: ['نظام حماية متقدم', 'لوحتي توزيع', 'عدادات متعددة', 'تهوية ميكانيكية']
                    },
                    {
                      type: 'غرفة كهرباء صناعية',
                      description: 'للمباني الصناعية والمجمعات الكبيرة',
                      dimensions: '5.0م × 4.0م × 3.5م',
                      load: 'أكثر من 400 أمبير',
                      color: 'purple',
                      features: ['نظام UPS', 'محولات كهربائية', 'أنظمة تبريد', 'إطفاء حريق تلقائي']
                    }
                  ].map((room, idx) => (
                    <Card key={idx} className="dense-content-card border-2">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-${room.color}-100 text-${room.color}-700 flex items-center justify-center flex-shrink-0`}>
                            <Zap className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="compact-title mb-1">{room.type}</div>
                            <p className="compact-subtitle">{room.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button className="dense-action-btn">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button className="dense-action-btn">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="dense-grid dense-grid-2 gap-2 mb-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-600">الأبعاد:</span>
                          <div className="compact-text font-medium">{room.dimensions}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-600">الحمل الكهربائي:</span>
                          <div className="compact-text font-medium">{room.load}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-600 mb-2 block">المميزات والتجهيزات:</span>
                        <div className="flex flex-wrap gap-1">
                          {room.features.map((feature, fIdx) => (
                            <Badge key={fIdx} className={`bg-${room.color}-100 text-${room.color}-700 text-xs`}>
                              <CheckCircle className="h-2 w-2 ml-1" />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* قسم المتطلبات الإضافية */}
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <ClipboardList className="h-5 w-5" />
                  المتطلبات الإضافية والملاحظات
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <TextAreaWithCopy
                    label="ملاحظات المواصفات الفنية"
                    id="technicalNotes"
                    value={`- يجب أن تكون الغرفة في موقع يسهل الوصول إليه
- يجب توفير تهوية مناسبة للغرفة
- يجب عزل الجدران والأرضية ضد الرطوبة
- يجب توفير إضاءة كافية داخل الغرفة
- يجب تركيب باب معدني مقاوم للحريق`}
                    onChange={(e) => setFormData({...formData, technicalNotes: e.target.value})}
                  />

                  <TextAreaWithCopy
                    label="المستندات المطلوبة من شركة الكهرباء"
                    id="requiredDocs"
                    value={`- شهادة إنجاز الأعمال الكهربائية
- تقرير الفحص الفني
- مخططات غرفة الكهرباء المعتمدة
- شهادة المقاول المرخص
- موافقة الدفاع المدني على الأنظمة الكهربائية`}
                    onChange={(e) => setFormData({...formData, requiredDocs: e.target.value})}
                  />
                </div>

                <Separator className="my-4" />

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="compact-title mb-2" style={{ color: '#059669' }}>
                        التكامل التلقائي
                      </h4>
                      <p className="compact-text text-gray-700">
                        جميع المعلومات المحددة هنا سيتم استخدامها تلقائياً عند إنشاء معاملة جديدة.
                        سيتم التحقق من المساحة الإجمالية للمشروع وإضافة متطلبات غرفة الكهرباء تلقائياً إذا كانت المساحة تتجاوز الحد المعين.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات المعاملات
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                12 تبويب • الشاشة 701
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-green-100 text-green-800">
              <CheckCircle className="w-2 h-2 ml-1" />
              نشط
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-secondary">
              <RefreshCw className="h-3 w-3" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 701 - إعدادات المعاملات
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات شاملة • 11 تبويب • حقول محسّنة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                محفوظ
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-701</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSettings_Complete_701;
