import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { SCREENS_CONFIG } from './ScreensConfig';
import { 
  Search, X, 
  Home, BarChart3, FileText, Users, Settings, Building, 
  Shield, Activity, Database, Eye, Crown, CheckCircle,
  TrendingUp, Bell, Lock, Calculator,
  User, Receipt, Network,
  Package, UserPlus, Briefcase,
  Archive, ScanText, Brain, GraduationCap,
  Folder, FileCheck, ShieldCheck, Key, Edit, FolderOpen,
  HelpCircle, Award, Truck, Hammer,
  Scale, Target, MessageSquare, Layout, GitBranch, Car,
  Zap, Smartphone, Cog, Star, MessageCircle, Clock,
  PieChart, RefreshCw, Lightbulb, Leaf, Bot, Bitcoin,
  Wifi, Cloud, Copyright, AlertTriangle, AlertCircle,
  Rocket, Monitor, Hash, Folders, Layers, Calendar, Megaphone
} from 'lucide-react';

interface Screen {
  id: string;
  title: string;
  screenNumber: string;
  icon: React.ReactNode;
  category: string;
}

interface ScreensSidebarProps {
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

// دالة مساعدة لتحويل اسم الأيقونة إلى مكون React
const getIconComponent = (iconName: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Home': <Home className="h-4 w-4" />,
    'LayoutDashboard': <Layout className="h-4 w-4" />,
    'FileText': <FileText className="h-4 w-4" />,
    'Users': <Users className="h-4 w-4" />,
    'Calculator': <Calculator className="h-4 w-4" />,
    'BarChart3': <BarChart3 className="h-4 w-4" />,
    'Package': <Package className="h-4 w-4" />,
    'Wrench': <Settings className="h-4 w-4" />,
    'ShoppingCart': <Package className="h-4 w-4" />,
    'ClipboardCheck': <CheckCircle className="h-4 w-4" />,
    'Bell': <Bell className="h-4 w-4" />,
    'GraduationCap': <GraduationCap className="h-4 w-4" />,
    'Building2': <Building className="h-4 w-4" />,
    'Building': <Building className="h-4 w-4" />,
    'Shield': <Shield className="h-4 w-4" />,
    'Activity': <Activity className="h-4 w-4" />,
    'Database': <Database className="h-4 w-4" />,
    'Brain': <Brain className="h-4 w-4" />,
    'Folder': <Folder className="h-4 w-4" />,
    'Settings': <Settings className="h-4 w-4" />,
    'Award': <Award className="h-4 w-4" />,
    'TrendingUp': <TrendingUp className="h-4 w-4" />,
    'Briefcase': <Briefcase className="h-4 w-4" />,
    'FileCheck': <FileCheck className="h-4 w-4" />,
    'Monitor': <Monitor className="h-4 w-4" />,
    'Edit': <Edit className="h-4 w-4" />,
    'Scale': <Scale className="h-4 w-4" />,
    'Target': <Target className="h-4 w-4" />,
    'MessageSquare': <MessageSquare className="h-4 w-4" />,
    'Network': <Network className="h-4 w-4" />,
    'Smartphone': <Smartphone className="h-4 w-4" />,
    'Cloud': <Cloud className="h-4 w-4" />,
    'Bot': <Bot className="h-4 w-4" />,
    'Rocket': <Rocket className="h-4 w-4" />,
    'User': <User className="h-4 w-4" />,
    'Receipt': <Receipt className="h-4 w-4" />,
    'UserPlus': <UserPlus className="h-4 w-4" />,
    'Archive': <Archive className="h-4 w-4" />,
    'MessageCircle': <MessageCircle className="h-4 w-4" />,
    'Clock': <Clock className="h-4 w-4" />,
    'Star': <Star className="h-4 w-4" />,
    'Hash': <Hash className="h-4 w-4" />,
    'Layers': <Layers className="h-4 w-4" />,
    'Layout': <Layout className="h-4 w-4" />,
    'Calendar': <Calendar className="h-4 w-4" />,
    'Megaphone': <Megaphone className="h-4 w-4" />,
  };
  
  return iconMap[iconName] || <FileText className="h-4 w-4" />;
};

// استخدام SCREENS_CONFIG مباشرة من ملف التكوين المركزي
const SCREENS_LIST: Screen[] = SCREENS_CONFIG.map(screen => ({
  id: screen.id,
  title: screen.title,
  screenNumber: screen.screenNumber,
  icon: getIconComponent(screen.icon),
  category: screen.category
}));

// نسخة احتياطية قديمة (لا تُستخدم بعد الآن - تم استبدالها بالنظام الموحد أعلاه)
const SCREENS_LIST_OLD_BACKUP: Screen[] = [
  // المجموعة الأولى: الشاشات الأساسية (10 شاشات) - ترتيب جديد
  { id: 'main-transactions-screen', title: 'إدارة المعاملات الرئيسية', screenNumber: '284', icon: <FileText className="h-4 w-4" />, category: 'أساسية' },
  { id: 'my-account', title: 'حسابي', screenNumber: '148', icon: <User className="h-4 w-4" />, category: 'أساسية' },
  { id: 'main-dashboard', title: 'لوحة التحكم الرئيسية', screenNumber: '916', icon: <Home className="h-4 w-4" />, category: 'أساسية' },
  { id: 'clients-management', title: 'إدارة العملاء', screenNumber: '123', icon: <Users className="h-4 w-4" />, category: 'أساسية' },
  { id: 'employees-management', title: 'إدارة الموظفين', screenNumber: '539', icon: <UserPlus className="h-4 w-4" />, category: 'أساسية' },
  { id: 'accounts-finance', title: 'المحاسبة', screenNumber: '672', icon: <Calculator className="h-4 w-4" />, category: 'أساسية' },
  { id: 'office-info-management', title: 'معلومات المكتب', screenNumber: '194', icon: <Building className="h-4 w-4" />, category: 'أساسية' },
  { id: 'advanced-reports-complete', title: 'التقارير', screenNumber: '365', icon: <BarChart3 className="h-4 w-4" />, category: 'أساسية' },
  { id: 'notification-settings', title: 'الإشعارات', screenNumber: '782', icon: <Bell className="h-4 w-4" />, category: 'أساسية' },
  { id: 'system-settings-management', title: 'الإعدادات العامة', screenNumber: '450', icon: <Settings className="h-4 w-4" />, category: 'أساسية' },

  // المجموعة الثانية: إدارة الموارد والعمليات (17 شاشة)
  { id: 'projects-management', title: 'شاشة إدارة المشاريع', screenNumber: '927', icon: <Building className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'invoices-management', title: 'شاشة الفواتير', screenNumber: '584', icon: <Receipt className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'equipment-management', title: 'شاشة إدارة المعدات', screenNumber: '163', icon: <Package className="h-4 w-4" />, category: 'موارد وعمليات' },

  { id: 'quality-management', title: 'شاشة ضمان الجودة', screenNumber: '309', icon: <Award className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'project-tracking', title: 'شاشة تتبع المشاريع', screenNumber: '871', icon: <TrendingUp className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'hr-advanced-management', title: 'شاشة الموارد البشرية المتقدمة', screenNumber: '695', icon: <Briefcase className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'policies-management', title: 'شاشة السياسات', screenNumber: '241', icon: <FileCheck className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'insurance-management', title: 'شاشة التأمين', screenNumber: '908', icon: <Shield className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'software-management', title: 'شاشة إدارة البرمجيات', screenNumber: '576', icon: <Monitor className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'forms-management', title: 'شاشة النماذج', screenNumber: '621', icon: <Edit className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'branches-management', title: 'شاشة إدارة الفروع', screenNumber: '792', icon: <Building className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'partners-management', title: 'شاشة إدارة الشراكات', screenNumber: '357', icon: <Users className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'contracts-management', title: 'شاشة إدارة العقود', screenNumber: '814', icon: <FileText className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'development-management-827', title: 'إدارة التطوير والتصميم', screenNumber: '827', icon: <Brain className="h-4 w-4" />, category: 'موارد وعمليات' },
  { id: 'demo-universal-sidebar', title: 'عرض السايد بار الموحد', screenNumber: '456', icon: <Database className="h-4 w-4" />, category: 'موارد وعمليات' },

  // المجموعة الثالثة: الشاشات التخصصية المتقدمة (26 شاشة)
  { id: 'tenders-management', title: 'شاشة إدارة المناقصات', screenNumber: '459', icon: <Award className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'asset-management', title: 'شاشة إدارة الأصول', screenNumber: '981', icon: <Package className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'legal-affairs-management-engineering-office', title: 'شاشة الشؤون القانونية للمكتب الهندسي', screenNumber: '628', icon: <Scale className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'marketing-management', title: 'شاشة التسويق', screenNumber: '275', icon: <Target className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'communication-management', title: 'شاشة التواصل', screenNumber: '842', icon: <MessageSquare className="h-4 w-4" />, category: 'تخصصية متقدمة' },

  { id: 'knowledge-base', title: 'شاشة قاعدة المعرفة', screenNumber: '734', icon: <Archive className="h-4 w-4" />, category: 'تخصصية متقدمة' },

  { id: 'external-api', title: 'شاشة APIs الخارجية', screenNumber: '570', icon: <Network className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'documents-management-complete-15tabs', title: 'شاشة إدارة المستندات', screenNumber: '796', icon: <Folder className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'client-portal-458', title: 'بوابة العملاء', screenNumber: '458', icon: <Users className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'mobile-app-sync-812', title: 'مزامنة التطبيق المحمول', screenNumber: '812', icon: <Smartphone className="h-4 w-4" />, category: 'تخصصية متقدمة' },


  { id: 'performance-monitoring-769', title: 'مراقبة الأداء', screenNumber: '769', icon: <Activity className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'budget-cost-management-391', title: 'إدارة الميزانيات والتكاليف', screenNumber: '391', icon: <Calculator className="h-4 w-4" />, category: 'تخصصية متقدمة' },



  // المجموعة الرابعة: التقنيات المتطورة والذكاء الاصطناعي (11 شاشة)

  { id: 'internal-communications', title: 'شاشة التواصل الداخلي', screenNumber: '356', icon: <MessageCircle className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'legal-case-management', title: 'إدارة القضايا القانونية', screenNumber: '923', icon: <Scale className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'ai-ml-platform', title: 'الذكاء الاصطناعي والتعلم الآلي', screenNumber: '434', icon: <Brain className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'documents-files-management-enhanced', title: 'إدارة الملفات والمستندات (محسّن)', screenNumber: '901', icon: <Folder className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  { id: 'robotics-automation', title: 'الروبوتات والأتمتة', screenNumber: '323', icon: <Bot className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'advanced-cybersecurity', title: 'الأمن السيبراني المتقدم', screenNumber: '489', icon: <Shield className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'cloud-infrastructure', title: 'البنية التحتية السحابية', screenNumber: '712', icon: <Cloud className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'api-integration-hub', title: 'مركز تكامل APIs', screenNumber: '156', icon: <Network className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'advanced-reporting-new', title: 'التقارير المتقدمة', screenNumber: '526', icon: <BarChart3 className="h-4 w-4" />, category: 'تقنيات متطورة' },
  { id: 'real-time-analytics', title: 'التحليلات في الوقت الفعلي', screenNumber: '970', icon: <Activity className="h-4 w-4" />, category: 'تقنيات متطورة' },

  // المجموعة الخامسة: الأمان والامتثال والإدارة المتقدمة (25 شاشة)
  { id: 'digital-authentication-system', title: 'التوثيق الرقمي', screenNumber: '612', icon: <Key className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'multi-factor-auth', title: 'المصادقة متعددة العوامل', screenNumber: '278', icon: <Shield className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'role-based-access', title: 'التحكم في الوصول القائم على الأدوار', screenNumber: '845', icon: <Users className="h-4 w-4" />, category: 'أ��ان وامتثال' },
  { id: 'data-encryption', title: 'تشفير البيانات', screenNumber: '401', icon: <Lock className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'backup-recovery', title: 'النسخ الاحتياطي والاستعادة', screenNumber: '737', icon: <Archive className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'gdpr-compliance', title: 'امتثال GDPR', screenNumber: '589', icon: <FileText className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'audit-compliance', title: 'امتثال المراجعة', screenNumber: '923', icon: <CheckCircle className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'financial-compliance', title: 'الامتثال المالي', screenNumber: '356', icon: <Calculator className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'regulatory-reporting', title: 'التقارير التنظيمية', screenNumber: '690', icon: <BarChart3 className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'incident-management', title: 'إدارة الحوادث', screenNumber: '234', icon: <AlertCircle className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'business-continuity', title: 'استمرارية الأعمال', screenNumber: '867', icon: <RefreshCw className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'vendor-compliance', title: 'امتثال الموردين', screenNumber: '412', icon: <Truck className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'intellectual-property', title: 'الملكية الفكرية', screenNumber: '529', icon: <Copyright className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'executive-dashboard', title: 'لوحة تحكم التنفيذيين', screenNumber: '245', icon: <Crown className="h-4 w-4" />, category: 'أمان وامتثال' },
  { id: 'board-reporting', title: 'تقارير مجلس الإدارة', screenNumber: '812', icon: <BarChart3 className="h-4 w-4" />, category: 'أمان وامتثال' },
  
  // المجموعة السادسة: الشاشات الجديدة المتقدمة (7 شاشات)
  { id: 'screen-789', title: 'إدارة العمليات المتقدمة الشاملة', screenNumber: '789', icon: <Rocket className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'system-advanced-management-999', title: 'إدارة النظام المتقدمة والإعدادات الشاملة', screenNumber: '999', icon: <Settings className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'documents-files-management-901', title: 'إدارة الملفات والمستندات المتقدمة', screenNumber: '901', icon: <FolderOpen className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'supervision-management-967', title: 'الإشراف المتقدمة والمتابعة', screenNumber: '967', icon: <Eye className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'professional-settings-925', title: 'الإعدادات المهنية والقوالب', screenNumber: '925', icon: <Star className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'system-documentation', title: 'توثيق برمجة النظام', screenNumber: '990', icon: <FileCheck className="h-4 w-4" />, category: 'إدارة متقدمة' },
  { id: 'user-guide', title: 'دليل المستخدم الشامل', screenNumber: '991', icon: <HelpCircle className="h-4 w-4" />, category: 'إدارة متقدمة' },
  
  // شاشة الأقسام والصلاحيات
  { id: 'departments-permissions-management', title: 'الأقسام والصلاحيات', screenNumber: '326', icon: <Folders className="h-4 w-4" />, category: 'تخصصية متقدمة' },
  
  // شاشة الصلاحيات الشاملة - 120 صلاحية
  { id: 'comprehensive-permissions', title: 'نظام الصلاحيات الشامل', screenNumber: 'PERM-001', icon: <ShieldCheck className="h-4 w-4" />, category: 'أمان وامتثال' },
  
  // شاشة توضيحية خاصة
  { id: 'tab-numbering-system-demo', title: 'عرض نظام ترقيم التابات الجديد', screenNumber: '998', icon: <Hash className="h-4 w-4" />, category: 'عرض توضيحي' }
];

/**
 * ملاحظة: القائمة القديمة الثابتة SCREENS_LIST_OLD_BACKUP موجودة للتوافق فقط
 * النظام الآن يقرأ من SCREENS_CONFIG مباشرة عبر SCREENS_LIST
 */

// فئات التصنيف - يتم استخراجها ديناميكياً من SCREENS_CONFIG
const CATEGORIES = Array.from(
  new Set(['الكل', ...SCREENS_CONFIG.map(s => s.category)])
).filter(Boolean);

export default function ScreensSidebar({ 
  activeScreen, 
  onScreenChange, 
  isVisible, 
  onToggle 
}: ScreensSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [showScrollHint, setShowScrollHint] = useState(true);
  
  // تصفية الشاشات بناءً على البحث والفئة (البحث بالاسم أو الرقم)
  const filteredScreens = useMemo(() => {
    return SCREENS_LIST.filter(screen => {
      // التحقق من وجود البيانات المطلوبة
      const title = screen.title || '';
      const screenNumber = screen.screenNumber || '';
      
      const matchesSearch = searchQuery === '' || 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screenNumber.includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'الكل' || screen.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // إضافة دعم التمرير بلوحة المفاتيح
  React.useEffect(() => {
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = filteredScreens.findIndex(screen => screen.id === activeScreen);
        let newIndex;
        
        if (e.key === 'ArrowUp') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : filteredScreens.length - 1;
        } else {
          newIndex = currentIndex < filteredScreens.length - 1 ? currentIndex + 1 : 0;
        }
        
        if (filteredScreens[newIndex]) {
          onScreenChange(filteredScreens[newIndex].id);
          // التمرير إلى العنصر النشط
          const activeElement = document.querySelector('.sidebar-item-highlighted');
          activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [isVisible, activeScreen, filteredScreens, onScreenChange]);

  if (!isVisible) return null;

  return (
    <div className="screens-sidebar-fixed sidebar-scroll-smooth fixed-element-entrance" dir="rtl">
      {/* رأس السايد بار */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 pt-[8px] pr-[16px] pb-[16px] pl-[16px] my-[4px] mx-[0px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الأقسام
              </h2>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* شريط البحث المحسن */}
        <div className="sidebar-search-enhanced">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث في الأقسام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pr-10"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          />
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* قائمة الشاشات مع التمرير المحسن والمضمون */}
      <div className="flex-1 overflow-y-auto sidebar-scroll-vertical sidebar-screens-container" style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '400px' }}>
        <div className="px-1 py-0">
          {/* مؤشر عدد الشاشات والتمرير */}
          <div className="mb-1 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {filteredScreens.length} قسم مُصرح
              </span>
              {filteredScreens.length > 8 && showScrollHint && (
                <button
                  onClick={() => setShowScrollHint(false)}
                  className="text-xs text-blue-500 hover:text-blue-700 transition-colors animate-bounce"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                  title="انقر لإخفاء التنبيه"
                >
                  ↕ مرر للمزيد
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-0">
            {filteredScreens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد أقسام مطابقة للبحث
                </p>
              </div>
            ) : (
              filteredScreens.map((screen, index) => (
                <div key={screen.id}>
                  <div 
                    className={`
                      sidebar-screen-item-enhanced sidebar-focusable transition-all duration-200
                      ${activeScreen === screen.id ? 'active sidebar-item-highlighted' : ''}
                    `}
                    onClick={() => onScreenChange(screen.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`الانتقال إلى ${screen.title} - الرقم ${screen.screenNumber}`}
                  >
                    {/* تخطيط بسيط ومباشر */}
                    <div className="flex items-center gap-3 w-full px-3 py-2">
                      {/* الأيقونة */}
                      <div className={`sidebar-icon-container ${activeScreen === screen.id ? 'active' : ''}`}>
                        {screen.icon}
                      </div>
                      
                      {/* اسم الشاشة */}
                      <h3 className="sidebar-screen-title-enhanced flex-1">
                        {screen.title}
                      </h3>
                      
                      {/* رقم الشاشة */}
                      <span className={`sidebar-screen-number-enhanced ${activeScreen === screen.id ? 'active' : ''}`}>
                        {screen.screenNumber}
                      </span>
                    </div>
                  </div>
                  
                  {/* فاصل صريح بين كل شاشة */}
                  {index < filteredScreens.length - 1 && (
                    <div className="screen-separator" />
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* مؤشر نهاية القائمة */}
          {filteredScreens.length > 0 && (
            <div className="mt-4 text-center py-3">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نهاية الأقسام - {filteredScreens.length} قسم
                </span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* فوتر السايد بار مع نصائح التنقل */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام إدارة الأعمال الهندسية v5.0
          </p>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {SCREENS_LIST.length} قسم في النظام
          </p>
          {filteredScreens.length > 8 && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                💡 استخدم ��↓ للتنقل أو مرر بالماوس
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}