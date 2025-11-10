import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Edit,
  Save,
  Printer,
  Share,
  Download,
  Upload,
  Eye,
  Settings,
  MoreHorizontal,
  Phone,
  Mail,
  Building,
  CreditCard,
  Wallet,
  Archive,
  History,
  Target,
  Award,
  TrendingUp,
  Users,
  Shield,
  Database,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Star,
  Flag,
  Tag,
  ExternalLink,
  Receipt,
  Paperclip,
  Ruler,
  Square,
  Map,
  Scale,
  BarChart3,
  FileCheck,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

// مراحل المعاملة (10 مراحل)
const transactionStages = [
  { 
    id: 'stage-01', 
    title: 'استقبال', 
    duration: '1 يوم', 
    status: 'completed',
    color: '#10b981',
    completedDate: '2025-01-15',
    description: 'استقبال وتسجيل المعاملة في النظام'
  },
  { 
    id: 'stage-02', 
    title: 'دراسة', 
    duration: '5 أيام', 
    status: 'completed',
    color: '#10b981',
    completedDate: '2025-01-20',
    description: 'تحليل المتطلبات والوثائق المطلوبة'
  },
  { 
    id: 'stage-03', 
    title: 'مراجعة', 
    duration: '3 أيام', 
    status: 'current',
    color: '#f59e0b',
    description: 'المراجعة الفنية والقانونية للمعاملة'
  },
  { 
    id: 'stage-04', 
    title: 'موافقة', 
    duration: '7 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'الحصول على الموافقات الرسمية'
  },
  { 
    id: 'stage-05', 
    title: 'تنفيذ', 
    duration: '21 يوم', 
    status: 'pending',
    color: '#6b7280',
    description: 'تنفيذ الأعمال المطلوبة'
  },
  { 
    id: 'stage-06', 
    title: 'متابعة', 
    duration: 'مستمر', 
    status: 'pending',
    color: '#6b7280',
    description: 'متابعة تقدم الأعمال والمراقبة'
  },
  { 
    id: 'stage-07', 
    title: 'فحص', 
    duration: '5 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'فحص الأعمال المنجزة والتأكد من الجودة'
  },
  { 
    id: 'stage-08', 
    title: 'تسليم', 
    duration: '3 أيام', 
    status: 'pending',
    color: '#6b7280',
    description: 'تسليم المخرجات النهائية للعميل'
  },
  { 
    id: 'stage-09', 
    title: 'إغلاق', 
    duration: '2 يوم', 
    status: 'pending',
    color: '#6b7280',
    description: 'إغلاق المعاملة وإنهاء الإجراءات'
  },
  { 
    id: 'stage-10', 
    title: 'أرشفة', 
    duration: '1 يوم', 
    status: 'pending',
    color: '#6b7280',
    description: 'أرشفة الوثائق والملفات'
  }
];

export default function MainTransactionsScreen_Complete_284() {
  // رقم الشاشة ثابت - 284
  const screenNumber = '284';
  
  // دالة لإنشاء أرقام التبويبات
  const generateTabNumber = (tabIndex: number) => {
    const paddedIndex = String(tabIndex).padStart(2, '0');
    return `${screenNumber}-${paddedIndex}`;
  };
  
  const [activeTab, setActiveTab] = useState(generateTabNumber(1));
  const [selectedStage, setSelectedStage] = useState('stage-03');
  const [showTabsSidebar, setShowTabsSidebar] = useState(true);
  const [searchTabQuery, setSearchTabQuery] = useState('');
  const [selectedTabCategory, setSelectedTabCategory] = useState('الكل');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // التابات الأساسية (30 تاب) - مع أرقام ثابتة
  const mainTabs = useMemo(() => [
    { id: generateTabNumber(1), title: 'الحالة العامة للمعاملة', icon: <Eye className="h-4 w-4" />, description: 'عرض الحالة العامة وملخص المعاملة', category: 'معلومات أساسية' },
    { id: generateTabNumber(2), title: 'معلومات المعاملة', icon: <FileText className="h-4 w-4" />, description: 'تفاصيل المعاملة والبيانات الأساسية', category: 'معلومات أساسية' },
    { id: generateTabNumber(3), title: 'معلومات المالك', icon: <User className="h-4 w-4" />, description: 'بيانات المالك والمعلومات الشخصية', category: 'معلومات أساسية' },
    { id: generateTabNumber(4), title: 'معلومات الأرض', icon: <MapPin className="h-4 w-4" />, description: 'تفاصيل الأرض والموقع الجغرافي', category: 'معلومات أساسية' },
    { id: generateTabNumber(5), title: 'معلومات الملكية', icon: <Building className="h-4 w-4" />, description: 'بيانات الملكية والحقوق القانونية', category: 'معلومات أساسية' },
    { id: generateTabNumber(6), title: 'الوثائق والمستندات', icon: <Archive className="h-4 w-4" />, description: 'إدارة جميع الوثائق المتعلقة بالمعاملة', category: 'وثائق ومدفوعات' },
    { id: generateTabNumber(7), title: 'المدفوعات والرسوم', icon: <CreditCard className="h-4 w-4" />, description: 'تتبع المدفوعات والرسوم المطلوبة', category: 'وثائق ومدفوعات' },
    { id: generateTabNumber(8), title: 'التواصل والمراسلات', icon: <Mail className="h-4 w-4" />, description: 'سجل التواصل مع العملاء والجهات', category: 'وثائق ومدفوعات' },
    { id: generateTabNumber(9), title: 'الموافقات والاعتمادات', icon: <CheckCircle className="h-4 w-4" />, description: 'حالة الموافقات من الجهات المختصة', category: 'وثائق ومدفوعات' },
    { id: generateTabNumber(10), title: 'الجدول الزمني', icon: <Calendar className="h-4 w-4" />, description: 'الجدول الزمني للمعاملة والمواعيد المهمة', category: 'وثائق ومدفوعات' },
    { id: generateTabNumber(11), title: 'فريق العمل', icon: <Users className="h-4 w-4" />, description: 'أعضاء فريق العمل والمسؤوليات', category: 'متابعة وإدارة' },
    { id: generateTabNumber(12), title: 'تقدم الأعمال', icon: <TrendingUp className="h-4 w-4" />, description: 'تتبع تقدم الأعمال والإنجازات', category: 'متابعة وإدارة' },
    { id: generateTabNumber(13), title: 'ضمان الجودة', icon: <Award className="h-4 w-4" />, description: 'مراجعة الجودة والمعايير الفنية', category: 'متابعة وإدارة' },
    { id: generateTabNumber(14), title: 'إدارة المخاطر', icon: <Shield className="h-4 w-4" />, description: 'تحديد وإدارة المخاطر المحتملة', category: 'متابعة وإدارة' },
    { id: generateTabNumber(15), title: 'الموارد والأدوات', icon: <Database className="h-4 w-4" />, description: 'إدارة الموارد والأدوات المطلوبة', category: 'متابعة وإدارة' },
    { id: generateTabNumber(16), title: 'التقارير الفنية', icon: <FileCheck className="h-4 w-4" />, description: 'إنشاء وإدارة التقارير الفنية', category: 'تقارير وتحليلات' },
    { id: generateTabNumber(17), title: 'التحليلات والإحصائيات', icon: <BarChart3 className="h-4 w-4" />, description: 'تحليل البيانات والإحصائيات', category: 'تقارير وتحليلات' },
    { id: generateTabNumber(18), title: 'الامتثال القانوني', icon: <Scale className="h-4 w-4" />, description: 'التأكد من الامتثال للقوانين واللوائح', category: 'تقارير وتحليلات' },
    { id: generateTabNumber(19), title: 'الإشعارات والتنبيهات', icon: <Bell className="h-4 w-4" />, description: 'إدارة الإشعارات والتنبيهات', category: 'تقارير وتحليلات' },
    { id: generateTabNumber(20), title: 'سجل التغييرات', icon: <History className="h-4 w-4" />, description: 'تتبع جميع التغييرات والتعديلات', category: 'تقارير وتحليلات' },
    { id: generateTabNumber(21), title: 'المرفقات والملفات', icon: <Paperclip className="h-4 w-4" />, description: 'إدارة المرفقات والملفات الإضافية', category: 'امتثال وقانونية' },
    { id: generateTabNumber(22), title: 'الإحداثيات والمواقع', icon: <MapPin className="h-4 w-4" />, description: 'إدارة الإحداثيات والمواقع الجغرافية', category: 'مواقع وقياسات' },
    { id: generateTabNumber(23), title: 'القياسات والمساحات', icon: <Ruler className="h-4 w-4" />, description: 'بيانات القياسات والمساحات', category: 'مواقع وقياسات' },
    { id: generateTabNumber(24), title: 'الحدود والفواصل', icon: <Square className="h-4 w-4" />, description: 'تحديد الحدود والفواصل القانونية', category: 'مواقع وقياسات' },
    { id: generateTabNumber(25), title: 'أعمال المسح', icon: <Target className="h-4 w-4" />, description: 'تفاصيل أعمال المسح الميداني', category: 'مواقع وقياسات' },
    { id: generateTabNumber(26), title: 'رسم الخرائط', icon: <Map className="h-4 w-4" />, description: 'إنشاء وإدارة الخرائط', category: 'مواقع وقياسات' },
    { id: generateTabNumber(27), title: 'الشهادات والتصاريح', icon: <Award className="h-4 w-4" />, description: 'إدارة الشهادات والتصاريح', category: 'مواقع وقياسات' },
    { id: generateTabNumber(28), title: 'الجهات الخارجية', icon: <ExternalLink className="h-4 w-4" />, description: 'التعامل مع الجهات الخارجية', category: 'أرشفة وحفظ' },
    { id: generateTabNumber(29), title: 'الفوترة والمحاسبة', icon: <Receipt className="h-4 w-4" />, description: 'إدارة الفواتير والمحاسبة', category: 'أرشفة وحفظ' },
    { id: generateTabNumber(30), title: 'الأرشفة والحفظ', icon: <Archive className="h-4 w-4" />, description: 'أرشفة الوثائق والبيانات', category: 'أرشفة وحفظ' }
  ], []);

  // بيانات المعاملة النموذجية
  const transactionData = {
    code: 'TXN-2025-001234',
    title: 'تصحيح حدود أرض سكنية - حي النرجس - مخطط الورود',
    client: 'أحمد محمد العلي',
    location: 'حي النرجس، الرياض',
    startDate: '2025-01-15',
    estimatedDuration: 45,
    currentStage: 3,
    totalStages: 10,
    remainingDays: 12,
    urgencyLevel: 'medium' as const,
    completionPercentage: 30
  };

  // فئات التابات للتصفية
  const TAB_CATEGORIES = [
    'الكل',
    'معلومات أساسية',
    'وثائق ومدفوعات', 
    'متابعة وإدارة',
    'تقارير وتحليلات',
    'امتثال وقانونية',
    'مواقع وقياسات',
    'أرشفة وحفظ'
  ];

  // تصفية التابات بناءً على البحث والفئة
  const filteredTabs = mainTabs.filter(tab => {
    const matchesSearch = searchTabQuery === '' || 
      tab.title.toLowerCase().includes(searchTabQuery.toLowerCase()) ||
      tab.id.toLowerCase().includes(searchTabQuery.toLowerCase());
    
    const matchesCategory = selectedTabCategory === 'الكل' || tab.category === selectedTabCategory;
    
    return matchesSearch && matchesCategory;
  });

  // تحديد المرحلة المختارة
  const getActiveStage = () => {
    return transactionStages.find(stage => stage.id === selectedStage) || transactionStages[2];
  };

  // تحديد التاب النشط
  const getActiveTabInfo = () => {
    return mainTabs.find(tab => tab.id === activeTab) || mainTabs[0];
  };

  return (
    <div className="screen-with-vertical-tabs-layout" dir="rtl">
      {/* السايد بار الرأسي للتابات */}
      {showTabsSidebar && (
        <div className={`vertical-tabs-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {/* هيدر السايد بار */}
          <div className="vertical-tabs-sidebar-header">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="compact-title text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التبويبات ({mainTabs.length})
                </h3>
                <p className="compact-text text-white opacity-80">
                  المعروضة: {filteredTabs.length}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:bg-white/20"
              >
                {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>

            {/* بحث وتصفية */}
            {!sidebarCollapsed && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-white/60" />
                  <Input
                    type="text"
                    placeholder="ابحث في التبويبات..."
                    value={searchTabQuery}
                    onChange={(e) => setSearchTabQuery(e.target.value)}
                    className="input-field compact-input pr-10 text-white bg-white/10 border-white/20 placeholder:text-white/60"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </div>
                <Select value={selectedTabCategory} onValueChange={setSelectedTabCategory}>
                  <SelectTrigger className="input-field compact-input text-white bg-white/10 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAB_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* جسم السايد بار - القائمة */}
          <div className="vertical-tabs-sidebar-body">
            {filteredTabs.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <div
                  className={`vertical-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.description}
                >
                  <div className="vertical-tab-icon">
                    {tab.icon}
                  </div>
                  
                  {!sidebarCollapsed && (
                    <div className="vertical-tab-content">
                      <div className="vertical-tab-title">{tab.title}</div>
                      <div className="vertical-tab-number">{tab.id}</div>
                    </div>
                  )}
                </div>
                
                {/* فواصل بين كل 5 تابات */}
                {(index + 1) % 5 === 0 && index < filteredTabs.length - 1 && (
                  <div className="vertical-tab-separator"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* فوتر السايد بار */}
          {!sidebarCollapsed && (
            <div className="vertical-tabs-sidebar-footer">
              <div className="grid grid-cols-2 gap-2 text-center compact-text">
                <div>
                  <div className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {mainTabs.length}
                  </div>
                  <div className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي التابات
                  </div>
                </div>
                <div>
                  <div className="font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {filteredTabs.length}
                  </div>
                  <div className="text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المعروضة
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* مساحة المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        {/* هيدر المحتوى */}
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="compact-title text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  شاشة {screenNumber} - إدارة المعاملات
                </h1>
                <p className="compact-text text-gray-600">
                  {transactionData.code} - {transactionData.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 compact-text">
                30 تبويب
              </Badge>
              <span className="font-mono compact-text bg-gray-100 px-2 py-1 rounded border" style={{ color: '#1d4ed8' }}>
                {screenNumber}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTabsSidebar(!showTabsSidebar)}
                className="compact-button"
              >
                {showTabsSidebar ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="bg-white border border-gray-200 rounded-lg p-3"
               style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f3e8ff 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="compact-text font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المرحلة {transactionData.currentStage} من {transactionData.totalStages}
                </span>
                <Badge className="compact-text">{transactionData.completionPercentage}%</Badge>
              </div>
              <div className="flex items-center gap-2 compact-text">
                <Clock className="h-3 w-3 text-orange-600" />
                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {transactionData.remainingDays} يوم متبقي
                </span>
              </div>
            </div>

            {/* مراحل مُكثفة */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {transactionStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex-shrink-0 px-2 py-1 rounded text-center compact-text transition-all cursor-pointer ${
                    stage.status === 'completed' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : stage.status === 'current'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                  style={{ minWidth: '70px', fontFamily: 'Tajawal, sans-serif' }}
                  onClick={() => setSelectedStage(stage.id)}
                  title={stage.description}
                >
                  <div className="font-medium">{index + 1}. {stage.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* جسم المحتوى */}
        <div className="vertical-tabs-content-body">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="compact-title flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {getActiveTabInfo().icon}
                  {getActiveTabInfo().title}
                </h3>
                <p className="compact-text text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {getActiveTabInfo().description}
                </p>
              </div>
              <Badge variant="outline" className="font-mono compact-text">
                {getActiveTabInfo().id}
              </Badge>
            </div>
          </div>

          {/* محتوى التاب النشط */}
          {activeTab === generateTabNumber(1) && (
            <div className="space-y-3">
              {/* إحصائيات */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                  <div className="dense-stat-number">{transactionData.completionPercentage}%</div>
                  <div className="dense-stat-label">نسبة الإنجاز</div>
                </div>
                
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div className="dense-stat-number">
                    {transactionStages.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="dense-stat-label">مراحل مكتملة</div>
                </div>
                
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div className="dense-stat-number">{transactionData.remainingDays}</div>
                  <div className="dense-stat-label">أيام متبقية</div>
                </div>

                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Calendar className="h-3 w-3" />
                  </div>
                  <div className="dense-stat-number">{transactionData.estimatedDuration}</div>
                  <div className="dense-stat-label">مدة المعاملة</div>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="dense-grid dense-grid-2">
                <div className="dense-section">
                  <div className="dense-section-header">
                    <h4 className="dense-section-title">
                      <FileText className="h-3 w-3" />
                      ملخص المعاملة
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between compact-text">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة:</span>
                      <span className="font-mono">{transactionData.code}</span>
                    </div>
                    <div className="flex justify-between compact-text">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل:</span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{transactionData.client}</span>
                    </div>
                    <div className="flex justify-between compact-text">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع:</span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{transactionData.location}</span>
                    </div>
                    <div className="flex justify-between compact-text">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ البداية:</span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{transactionData.startDate}</span>
                    </div>
                  </div>
                </div>

                <div className="dense-section">
                  <div className="dense-section-header">
                    <h4 className="dense-section-title">
                      <PlayCircle className="h-3 w-3" />
                      المرحلة الحالية
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium compact-text" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {getActiveStage().title}
                      </span>
                    </div>
                    <p className="compact-text text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {getActiveStage().description}
                    </p>
                    <div className="flex justify-between compact-text">
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة المقدرة:</span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{getActiveStage().duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* محتوى نموذجي للتابات الأخرى */}
          {activeTab !== generateTabNumber(1) && (
            <div className="dense-section">
              <div className="dense-section-header">
                <h4 className="dense-section-title">
                  {getActiveTabInfo().icon}
                  {getActiveTabInfo().title}
                </h4>
                <div className="dense-section-actions">
                  <button className="dense-action-btn" title="تحرير">
                    <Edit className="h-3 w-3" />
                  </button>
                  <button className="dense-action-btn" title="حفظ">
                    <Save className="h-3 w-3" />
                  </button>
                  <button className="dense-action-btn" title="إعدادات">
                    <Settings className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  {getActiveTabInfo().icon && React.cloneElement(getActiveTabInfo().icon, { className: 'h-8 w-8 text-blue-600' })}
                </div>
                <h3 className="compact-title mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {getActiveTabInfo().title}
                </h3>
                <p className="compact-text text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {getActiveTabInfo().description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" className="compact-button">
                    <Plus className="h-3 w-3" />
                    إضافة جديد
                  </Button>
                  <Button size="sm" variant="outline" className="compact-button">
                    <Eye className="h-3 w-3" />
                    عرض الكل
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}