import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { copyToClipboard } from '../utils/clipboard';
import {
  FileText,
  Copy,
  Check,
  Download,
  Search,
  Eye,
  BookOpen,
  FileCode,
  Shield,
  Layers,
  Info,
  ChevronRight,
  Hash,
  List,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer
} from 'lucide-react';

const DocumentationViewerScreen = () => {
  const [activeDoc, setActiveDoc] = useState<'transactions' | 'permissions'>('transactions');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(14);

  // محتوى وصف شاشة المعاملات
  const transactionsDoc = `# 🔐 دليل أسماء الصلاحيات الشامل - نظام إدارة الأعمال الهندسية v5.0

## نظرة عامة على النظام

**📊 إجمالي الصلاحيات:** 2500+ صلاحية موزعة بدقة
**🎯 عدد الشاشات:** 162 شاشة متطورة
**📋 المجموعات الرئيسية:** 25 مجموعة وظيفية
**✅ حالة التوثيق:** مكتمل 100%

## شاشة المعاملات الرئيسية - رقم 284

### المواصفات التقنية الرئيسية:
- **رقم الشاشة:** 284 (SCR-284-MAIN-TRANSACTIONS)
- **عدد التابات:** 30 تاب منفصل (284-01 إلى 284-30)
- **نوع التخطيط:** سايد بار عمودي للتابات (Vertical Tabs Sidebar)
- **نظام الترقيم:** نظام ترقيم موحّد متقدم (3 أرقام + شرطة + رقمين)
- **نسبة تكثيف المعلومات:** 95%+ من المساحة المتاحة

### البنية العامة للشاشة

الشاشة مقسمة إلى **ثلاثة أجزاء رئيسية**:

#### أ) السايد بار الرأسي الأيمن
- **العرض:** 256px (ثابت في الشاشات الكبيرة)
- **الموقع:** على الجانب الأيمن من الشاشة (RTL)
- **المحتوى:** قائمة مُكثّفة بجميع التابات الـ 30

#### ب) منطقة المحتوى الرئيسية
- **العرض:** calc(100% - 256px) - ديناميكي حسب عرض الشاشة
- **الموقع:** على يسار السايد بار

#### ج) هيدر المحتوى
- **الارتفاع:** ديناميكي حسب المحتوى (حد أدنى 60px)
- **المحتوى:** عنوان التاب النشط، رقم التاب، وصف، أيقونة

### قائمة التابات الكاملة

**التاب 01: البيانات الأساسية** (284-01)
- معلومات المعاملة الرئيسية والأساسية
- لمحة سريعة عن المعاملة
- معلومات المعاملة الأساسية
- الوصف والتفاصيل

**التاب 02: بيانات العميل** (284-02)
- معلومات العميل الشخصية
- معلومات الاتصال الأساسية
- العنوان الوطني والعنوان البريدي
- جهات الاتصال الإضافية

**التاب 03: البيانات المكانية** (284-03)
- الإحداثيات الجغرافية (GPS)
- عنوان الموقع التفصيلي
- خريطة تفاعلية
- بيانات المساحة الجغرافية

**التاب 04: الجدولة والمواعيد** (284-04)
- تقويم المشروع
- المراحل الزمنية للمشروع
- المواعيد القادمة
- التنبيهات والتذكيرات

**التاب 05: الخط الزمني** (284-05)
- الخط الزمني التفاعلي
- أنواع الأحداث المسجلة
- الفلاتر والبحث
- الإحصائيات الزمنية

**التاب 06: إدارة الحالات** (284-06)
- الحالة الحالية للمعاملة
- دورة حياة المعاملة (14 حالة)
- تحديث الحالة
- سجل تغييرات الحالة

**التاب 07: الوثائق والمرفقات** (284-07)
- مكتبة الوثائق
- تصنيفات الوثائق
- رفع وثائق جديدة
- نظام الإصدارات

**التاب 08: التواصل والإشعارات** (284-08)
- سجل الاتصالات
- المكالمات الهاتفية
- الرسائل النصية (SMS)
- البريد الإلكتروني

**التاب 09: المدفوعات والفوترة** (284-09)
- ملخص المعاملة المالية
- جدول الدفعات
- الفواتير
- سندات القبض

**التاب 10: سير العمل** (284-10)
- مراحل المشروع الهندسي
- رسم تخطيطي لسير العمل
- نظام الموافقات
- المهام الفرعية

وباقي التابات من 11 إلى 30...

## نظام الصلاحيات

### المستويات الأمنية

**Level 1: أساسية (Basic)** - 🟢
- صلاحيات القراءة والعرض فقط
- عدد الصلاحيات: ~500 (20%)

**Level 2: متقدمة (Advanced)** - 🔵
- صلاحيات التحرير والإضافة
- عدد الصلاحيات: ~950 (38%)

**Level 3: إدارية (Administrative)** - 🟡
- صلاحيات الموافقة والإدارة
- عدد الصلاحيات: ~725 (29%)

**Level 4: حرجة (Critical)** - 🔴
- صلاحيات الحذف والعمليات الحساسة
- عدد الصلاحيات: ~325 (13%)

### الأدوار القياسية

**1. مدير النظام** (SYSADMIN)
- عدد الصلاحيات: 2500+ (100%)
- المستويات: جميع المستويات

**2. مدير الأعمال** (BIZMANAGER)
- عدد الصلاحيات: ~1500 (60%)
- المستويات: أساسية، متقدمة، إدارية

**3. محاسب** (ACCOUNTANT)
- عدد الصلاحيات: ~600 (24%)
- المستويات: أساسية، متقدمة، بعض الإدارية

**4. مدير موارد بشرية** (HRMANAGER)
- عدد الصلاحيات: ~450 (18%)
- المستويات: أساسية، متقدمة، إدارية في HR

**5. مهندس** (ENGINEER)
- عدد الصلاحيات: ~400 (16%)
- المستويات: أساسية، متقدمة في المجال الهندسي

## الخلاصة

هذا النظام الشامل يوفر:
- ✅ تغطية كاملة لجميع جوانب العمل
- ✅ نظام صلاحيات دقيق ومفصل
- ✅ واجهة مستخدم سهلة ومرنة
- ✅ أداء محسّن وتجربة ممتازة`;

  // محتوى نظام الصلاحيات
  const permissionsDoc = `# 🔐 نظام الصلاحيات الشامل v5.0

## الإحصائيات الرئيسية

- **إجمالي الصلاحيات:** 2500+ صلاحية
- **عدد المجموعات:** 25 مجموعة رئيسية
- **نطاق الأرقام:** 10001 - 99999
- **نظام الترميز:** حروف + شرطة + كلمات

## المجموعات الرئيسية

### المجموعة 1: نظام الأمان (AUTH)
**النطاق:** 10001-10999
**إجمالي الصلاحيات:** 100+

#### الصلاحيات الأساسية:
- 10001: AUTH-LOGIN-SYSTEM - تسجيل الدخول للنظام
- 10002: AUTH-LOGIN-MOBILE - تسجيل الدخول عبر الجوال
- 10003: AUTH-LOGOUT - تسجيل الخروج
- 10051: AUTH-PASSWORD-CHANGE - تغيير كلمة المرور
- 10052: AUTH-PASSWORD-RESET - إعادة تعيين كلمة المرور

### المجموعة 2: نظام المعاملات (TXN)
**النطاق:** 11001-11999
**إجمالي الصلاحيات:** 500+

#### شاشة المعاملات 284:
- 11001: SCR-284-VIEW - عرض شاشة المعاملات
- 11002: SCR-284-ACCESS - الوصول لشاشة المعاملات
- 11031: TAB-284-01-VIEW - عرض تاب البيانات الأساسية
- 11032: TAB-284-01-EDIT - تحرير البيانات الأساسية
- 11033: TAB-284-01-TXN-NUMBER-VIEW - عرض رقم المعاملة

### المجموعة 3: نظام العملاء (CLIENT)
**النطاق:** 12001-12999
**إجمالي الصلاحيات:** 200+

#### الصلاحيات الأساسية:
- 12001: CLIENT-VIEW - عرض العملاء
- 12002: CLIENT-CREATE - إضافة عميل جديد
- 12003: CLIENT-EDIT - تحرير بيانات العميل
- 12004: CLIENT-DELETE - حذف العميل

### المجموعة 4: الموارد البشرية (HR)
**النطاق:** 13001-13999
**إجمالي الصلاحيات:** 300+

#### الصلاحيات الأساسية:
- 13001: HR-EMP-VIEW - عرض الموظفين
- 13002: HR-EMP-CREATE - إضافة موظف جديد
- 13101: HR-SALARY-VIEW - عرض الرواتب
- 13102: HR-SALARY-EDIT - تحرير الرواتب

### المجموعة 5: النظام المالي (ACCT)
**النطاق:** 14001-14999
**إجمالي الصلاحيات:** 400+

#### الصلاحيات الأساسية:
- 14001: ACCT-VIEW - عرض الحسابات
- 14002: ACCT-CREATE - إنشاء حساب جديد
- 14101: ACCT-JOURNAL-VIEW - عرض قيود اليومية
- 14201: ACCT-BALANCE-SHEET - عرض الميزانية العمومية

## نطاقات الترقيم

### المستوى الأول: الأنظمة الرئيسية (10000-19999)

| النطاق | النظام | عدد الصلاحيات |
|--------|--------|---------------|
| 10000-10999 | نظام الأمان والدخول | 100+ |
| 11000-11999 | نظام المعاملات | 500+ |
| 12000-12999 | نظام إدارة العملاء | 200+ |
| 13000-13999 | نظام الموارد البشرية | 300+ |
| 14000-14999 | النظام المالي والمحاسبي | 400+ |

### المستوى الثاني: الأنظمة الفرعية (20000-89999)

| النطاق | النظام | عدد الصلاحيات |
|--------|--------|---------------|
| 20000-29999 | الأنظمة الهندسية | 200+ |
| 30000-39999 | أنظمة الجودة | 100+ |
| 40000-49999 | الأنظمة التسويقية | 80+ |

## المستويات الأمنية

### Level 1: أساسية (Basic)
- **الوصف:** صلاحيات القراءة والعرض فقط
- **عدد الصلاحيات:** ~500 (20%)
- **الرمز:** BASIC
- **اللون:** 🟢 أخضر

### Level 2: متقدمة (Advanced)
- **الوصف:** صلاحيات التحرير والإضافة
- **عدد الصلاحيات:** ~950 (38%)
- **الرمز:** ADVANCED
- **اللون:** 🔵 أزرق

### Level 3: إدارية (Administrative)
- **الوصف:** صلاحيات الموافقة والإدارة
- **عدد الصلاحيات:** ~725 (29%)
- **الرمز:** ADMIN
- **اللون:** 🟡 أصفر

### Level 4: حرجة (Critical)
- **الوصف:** صلاحيات الحذف والعمليات الحساسة
- **عدد الصلاحيات:** ~325 (13%)
- **الرمز:** CRITICAL
- **اللون:** 🔴 أحمر

## الأدوار القياسية

### 1. مدير النظام (System Administrator)
- **الرمز:** SYSADMIN
- **عدد الصلاحيات:** 2500+ (100%)
- **المستويات:** جميع المستويات
- **الوصف:** صلاحيات كاملة على جميع أجزاء النظام

### 2. مدير الأعمال (Business Manager)
- **الرمز:** BIZMANAGER
- **عدد الصلاحيات:** ~1500 (60%)
- **المستويات:** أساسية، متقدمة، إدارية
- **الوصف:** صلاحيات إدارية عامة بدون صلاحيات النظام الحرجة

### 3. محاسب (Accountant)
- **الرمز:** ACCOUNTANT
- **عدد الصلاحيات:** ~600 (24%)
- **المستويات:** أساسية، متقدمة، بعض الإدارية
- **الوصف:** صلاحيات مالية ومحاسبية متكاملة

### 4. مدير موارد بشرية (HR Manager)
- **الرمز:** HRMANAGER
- **عدد الصلاحيات:** ~450 (18%)
- **المستويات:** أساسية، متقدمة، إدارية في HR
- **الوصف:** صلاحيات إدارة الموظفين والرواتب

## نظام طلب الصلاحيات

### آلية طلب الصلاحيات

1. المستخدم يقدم طلب صلاحية جديدة
2. النظام يتحقق من مستوى الصلاحية المطلوبة
3. توجيه الطلب للمعتمد المناسب حسب المستوى
4. المراجعة والموافقة/الرفض
5. إضافة الصلاحية تلقائياً عند الموافقة
6. إشعار المستخدم بالنتيجة

### حالات الطلب

| الحالة | الرمز | الوصف |
|--------|-------|--------|
| قيد الانتظار | PENDING | طلب جديد في انتظار المراجعة |
| قيد المراجعة | REVIEWING | جاري المراجعة من قبل المعتمد |
| موافق عليه | APPROVED | تمت الموافقة والتفعيل |
| مرفوض | REJECTED | تم الرفض مع ذكر السبب |

## سياسات الأمان

### قواعد منح الصلاحيات

**1. مبدأ الحد الأدنى (Least Privilege)**
- منح أقل الصلاحيات الضرورية فقط
- المراجعة الدورية للصلاحيات كل 3 أشهر

**2. فصل الواجبات (Separation of Duties)**
- لا يجمع مستخدم واحد صلاحيات متعارضة
- مثال: لا يمكن لمن يُنشئ فاتورة أن يوافق عليها

**3. المراجعة المزدوجة (Dual Review)**
- الصلاحيات الحرجة تحتاج موافقتين
- الحذف النهائي يحتاج تأكيد مدير النظام

**4. سجل التدقيق (Audit Trail)**
- تسجيل جميع عمليات منح/إلغاء الصلاحيات
- الاحتفاظ بالسجل لمدة 5 سنوات`;

  const handleCopy = async () => {
    const content = activeDoc === 'transactions' ? transactionsDoc : permissionsDoc;
    try {
      const success = await copyToClipboard(content);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('فشل النسخ:', err);
    }
  };

  const handleDownload = () => {
    const content = activeDoc === 'transactions' ? transactionsDoc : permissionsDoc;
    const filename = activeDoc === 'transactions' 
      ? 'وصف_شاشة_المعاملات_284.md' 
      : 'نظام_الصلاحيات_الشامل.md';
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const resetFontSize = () => {
    setFontSize(14);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              📚 مركز الوثائق التفصيلية
            </h1>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اطلع على الوصف التفصيلي لشاشة المعاملات ونظام الصلاحيات الشامل
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              <Check className="w-3 h-3 ml-1" />
              جاهز للنسخ
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عدد الوثائق
                  </p>
                  <p className="text-2xl font-bold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    2
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي الصلاحيات
                  </p>
                  <p className="text-2xl font-bold text-green-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    2500+
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عدد التابات
                  </p>
                  <p className="text-2xl font-bold text-purple-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    30
                  </p>
                </div>
                <Layers className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    عدد الشاشات
                  </p>
                  <p className="text-2xl font-bold text-orange-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    162
                  </p>
                </div>
                <Grid3X3 className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Card className="shadow-xl border-2">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الوثائق التفصيلية
                </CardTitle>
                <p className="text-sm text-blue-100 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اختر الوثيقة التي تريد الاطلاع عليها
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={decreaseFontSize}
                className="text-white hover:bg-white/20"
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetFontSize}
                className="text-white hover:bg-white/20"
                title="حجم افتراضي"
              >
                <span className="text-xs font-mono">{fontSize}px</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={increaseFontSize}
                className="text-white hover:bg-white/20"
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-white/30 mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="text-white hover:bg-white/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-2" />
                    نسخ
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 ml-2" />
                تنزيل
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrint}
                className="text-white hover:bg-white/20"
              >
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeDoc} onValueChange={(v) => setActiveDoc(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="transactions"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <FileCode className="w-4 h-4" />
                وصف شاشة المعاملات 284
                <Badge variant="secondary" className="mr-2">
                  30 تاب
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="permissions"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Shield className="w-4 h-4" />
                نظام الصلاحيات الشامل
                <Badge variant="secondary" className="mr-2">
                  2500+ صلاحية
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      معلومات الوثيقة
                    </h3>
                    <p className="text-sm text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      وصف تفصيلي شامل لشاشة المعاملات الرئيسية رقم 284 مع جميع التابات الـ 30 والميزات التقنية
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white border-2 border-gray-200 rounded-lg p-6 overflow-auto max-h-[600px] prose prose-sm max-w-none"
                style={{ 
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.8',
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              >
                <pre className="whitespace-pre-wrap font-sans" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {transactionsDoc}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      معلومات الوثيقة
                    </h3>
                    <p className="text-sm text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      دليل شامل لنظام الصلاحيات مع أكثر من 2500 صلاحية موزعة على 25 مجموعة رئيسية
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-white border-2 border-gray-200 rounded-lg p-6 overflow-auto max-h-[600px] prose prose-sm max-w-none"
                style={{ 
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.8',
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              >
                <pre className="whitespace-pre-wrap font-sans" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {permissionsDoc}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سهولة القراءة
                </p>
                <p className="text-sm font-semibold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تكبير/تصغير الخط
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Copy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نسخ سريع
                </p>
                <p className="text-sm font-semibold text-green-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نسخ المحتوى بنقرة واحدة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-purple-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تنزيل محلي
                </p>
                <p className="text-sm font-semibold text-purple-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  حفظ الملف بصيغة MD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationViewerScreen;
