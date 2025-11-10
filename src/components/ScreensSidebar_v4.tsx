import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { SCREENS_CONFIG } from './ScreensConfig';
import { useScreen } from './ScreenContext';
import { 
  Search, ChevronDown, ChevronLeft, X, Plus,
  Home, BarChart3, FileText, Users, Settings, Building, 
  Shield, Activity, Database, Eye, Crown, CheckCircle,
  TrendingUp, Bell, Lock, Calculator, DollarSign, Banknote,
  User, Receipt, Network,
  Package, UserPlus, Briefcase,
  Archive, ScanText, Brain, GraduationCap,
  Folder, FileCheck, ShieldCheck, Key, Edit, FolderOpen, FolderTree,
  HelpCircle, Award, Truck, Hammer,
  Scale, Target, MessageSquare, Layout, GitBranch, Car,
  Zap, Smartphone, Cog, Star, MessageCircle, Clock,
  PieChart, RefreshCw, Lightbulb, Leaf, Bot, Bitcoin,
  Wifi, Cloud, Copyright, AlertTriangle, AlertCircle,
  Rocket, Monitor, Hash, Folders, Layers, ClipboardList, Calendar,
  HardHat, FileSignature, MapPin, Map, Mail, Megaphone, Download
} from 'lucide-react';

interface Screen {
  id: string;
  title: string;
  screenNumber: string;
  icon: React.ReactNode;
  category: string;
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
    'ClipboardList': <ClipboardList className="h-4 w-4" />,
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
    'DollarSign': <DollarSign className="h-4 w-4" />,
    'Zap': <Zap className="h-4 w-4" />,
    'AlertCircle': <AlertCircle className="h-4 w-4" />,
    'PlusCircle': <Plus className="h-4 w-4" />,
    'Banknote': <Banknote className="h-4 w-4" />,
    'Calendar': <Calendar className="h-4 w-4" />,
    'HardHat': <HardHat className="h-4 w-4" />,
    'FileSignature': <FileSignature className="h-4 w-4" />,
    'MapPin': <MapPin className="h-4 w-4" />,
    'Map': <Map className="h-4 w-4" />,
    'Mail': <Mail className="h-4 w-4" />,
    'Megaphone': <Megaphone className="h-4 w-4" />,
    'FolderOpen': <FolderOpen className="h-4 w-4" />,
    'FolderTree': <FolderTree className="h-4 w-4" />,
    'Download': <Download className="h-4 w-4" />
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

// تقسيم الشاشات إلى 3 أقسام
type SectionType = 'work-management' | 'system-management' | 'office-management';

const SCREEN_SECTIONS: Record<SectionType, {
  id: string;
  number: string;
  title: string;
  screenIds: string[];
}> = {
  'work-management': {
    id: 'work-management',
    number: '01',
    title: 'أقسام إدارة العمل',
    screenIds: [
      'main-dashboard', 'erp-dashboard',
      'general-accounting', 'accounts-finance', 'accounts-management', 'partners-accounts', 'transactions-log', 'create-transaction', 'simple-transactions', 'cash-payments',
      'clients-unified',
      'contractors-relations', // ✅ شاشة 555 - علاقات المقاولين
      'hardware-software-management', // ✅ شاشة 677 - الأجهزة والبرمجيات
      'supervision-management', // ✅ شاشة 967 - إدارة الإشراف والجودة
      'main-transactions-screen', 'transactions-settings', 'digital-documentation', 'technical-reports',
      'contract-settings', // ✅ شاشة 777 - إعدادات العقود
      'contract-approval', // ✅ شاشة 778 - اعتماد العقود
      'ownership-documents', 'contracts-management', 'quotations-management', 'appointments-management',
      'surveying-data', 'general-reports-printing', 'documents-printing', 'transaction-documents-creation',
      'licenses-management', 'annual-budget', 'communication-channels', 'owner-commitments', 'official-email', 'notes-processing', 'execution-supervision',
      'engineering-drawings', 'supervision-transactions', 'transaction-invoices', 'project-classifications', 'marketing-management',
      'client-meetings', // ✅ شاشة 891 - مقابلات العملاء
      'tasks-settings-advanced', 'communication-logs', 'follow-up-agents', 'follow-up-fees', 
      'riyadh-streets', 'sectors-districts',
      'madinati-appointments' // ✅ شاشة 933 - مواعيد مدينتي
    ]
  },
  'system-management': {
    id: 'system-management',
    number: '02',
    title: 'أقسام إدارة النظام',
    screenIds: [
      'files-documents-management', // ✅ شاشة 900 - إدارة الملفات والمستندات
      'documents-files-management', // ✅ شاشة 901 - نظام الملفات المتقدم
      'documents-receiving', // ✅ شاشة 902 - استلام وثائق
      'permissions-management', 'job-roles', 'notification-settings', 'professional-settings',
      'requirements-management', 'exceptions-special-requests', 'commitments-declarations', 'commitments-declarations-settings', 'document-types',
      'digital-assets', 'targets-goals', 'locations-map', 'business-statistics', 'fees-settings',
      'templates-forms-designer', 'ai-management', 'system-documentation', 'documentation-viewer',
      'system-advanced-management', 'example-auto-numbered'
    ]
  },
  'office-management': {
    id: 'office-management',
    number: '03',
    title: 'إدارة المكتب',
    screenIds: [
      'advanced-hr-management', 'official-holidays-management',
      'salaries-fees-management', 'employees-management', 'employee-contracts', 'surveyors-management',
      'external-entities', 'geographical-division', 'transaction-tasks-assignment',
      'office-branches', // ✅ إضافة شاشة 905 - فروع المكتب
      'office-partners-ownership', 'office-qualification', 'building-safety', 'organizational-plans',
      'documents-files-management', 'my-tasks'
    ]
  }
};

export default function ScreensSidebar_v4() {
  const { activeScreen, setActiveScreen } = useScreen();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<SectionType>>(
    new Set(['work-management', 'system-management', 'office-management'])
  );
  
  // تبديل حالة القسم (مطوي/موسع)
  const toggleSection = (sectionId: SectionType) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };
  
  // تصفية الشاشات بناءً على البحث والفئة
  const filteredScreens = useMemo(() => {
    return SCREENS_LIST.filter(screen => {
      const title = screen.title || '';
      const screenNumber = screen.screenNumber || '';
      
      const matchesSearch = searchQuery === '' || 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screenNumber.includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'الكل' || screen.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);
  
  // تقسيم الشاشات حسب الأقسام
  const screensBySection = useMemo(() => {
    const result: Record<SectionType, Screen[]> = {
      'work-management': [],
      'system-management': [],
      'office-management': []
    };
    
    filteredScreens.forEach(screen => {
      // تحديد القسم الذي تنتمي إليه الشاشة
      for (const [sectionId, section] of Object.entries(SCREEN_SECTIONS)) {
        if (section.screenIds.includes(screen.id)) {
          result[sectionId as SectionType].push(screen);
          break;
        }
      }
    });
    
    return result;
  }, [filteredScreens]);

  // دعم التنقل بلوحة المفاتيح
  React.useEffect(() => {
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
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
          setActiveScreen(filteredScreens[newIndex].id);
          const activeElement = document.querySelector('.sidebar-item-highlighted');
          activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [activeScreen, filteredScreens, setActiveScreen]);

  return (
    <div 
      className="fixed right-0 z-40 shadow-2xl"
      style={{
        top: '40px', // بداية من أسفل الهيدر مباشرة
        height: 'calc(100vh - 40px)', // ارتفاع بدون الهيدر
        width: '280px',
        background: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 50%, #d6d3d1 100%)',
        borderLeft: '3px solid #78716c',
        direction: 'rtl'
      }}
      dir="rtl"
    >
      {/* رأس السايد بار */}
      <div 
        className="sticky top-0 z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(245, 245, 244, 0.98) 0%, rgba(231, 229, 228, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid #78716c',
          padding: '12px 16px'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="p-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #78716c 0%, #57534e 100%)',
              boxShadow: '0 2px 8px rgba(120, 113, 108, 0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Database className="h-4 w-4 text-white" />
          </div>
          <h2 
            className="text-sm"
            style={{ 
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 700,
              color: '#57534e'
            }}
          >
            أقسام النظام
          </h2>
        </div>

        {/* شريط البحث */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث في الأقسام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-sm"
            style={{ 
              fontFamily: 'Tajawal, sans-serif',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #d6d3d1',
              borderRadius: '8px'
            }}
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

        {/* زر الرئيسية المصغر */}
        <div className="mt-3 mb-2">
          <button
            onClick={() => setActiveScreen('homepage')}
            className={`w-full p-2 rounded-lg transition-all duration-200 text-right flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.01] ${
              activeScreen === 'homepage' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}
            style={{
              border: `2px solid ${activeScreen === 'homepage' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.3)'}`,
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* أيقونة الرئيسية مصغرة */}
            <div 
              className="flex-shrink-0 p-1 rounded-md bg-white/20"
              style={{
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Home className="h-4 w-4 text-white" />
            </div>
            
            {/* النص */}
            <div className="flex-1 text-right">
              <div 
                className="text-white text-xs"
                style={{ 
                  fontFamily: 'Tajawal, sans-serif',
                  fontWeight: 700
                }}
              >
                الصفحة الرئيسية
              </div>
            </div>
            
            {/* رقم الشاشة */}
            <Badge 
              variant="outline"
              className="font-mono text-[9px] flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#16a34a',
                padding: '1px 5px',
                fontSize: '9px'
              }}
            >
              001
            </Badge>
          </button>
        </div>

        {/* عداد الشاشات */}
        <div className="mt-2 text-center">
          <Badge 
            variant="outline"
            style={{
              background: 'rgba(120, 113, 108, 0.1)',
              border: '1px solid #d6d3d1',
              color: '#57534e',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '11px'
            }}
          >
            {filteredScreens.length} قسم مُصرح
          </Badge>
        </div>

        {/* فاصل مرئي */}
        <div 
          className="mx-4 my-2"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #78716c 50%, transparent 100%)',
            borderRadius: '1px'
          }}
        />
      </div>

      {/* قائمة الشاشات */}
      <ScrollArea 
        className="h-full" 
        style={{ 
          maxHeight: 'calc(100vh - 240px)', // تقليل الارتفاع لاستيعاب زر الرئيسية
          '--scrollbar-width': '8px',
          '--scrollbar-track-color': 'rgba(214, 211, 209, 0.3)',
          '--scrollbar-thumb-color': '#78716c',
          '--scrollbar-thumb-hover-color': '#57534e'
        } as React.CSSProperties}
      >
        <style>{`
          .scroll-area-viewport::-webkit-scrollbar {
            width: 8px !important;
            display: block !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-track {
            background: rgba(214, 211, 209, 0.3) !important;
            border-radius: 4px !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb {
            background: #78716c !important;
            border-radius: 4px !important;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
            background: #57534e !important;
          }
        `}</style>

        <div className="p-2 space-y-1">
          {filteredScreens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                لا توجد أقسام مطابقة
              </p>
            </div>
          ) : (
            <>
              {/* عرض الأقسام الثلاثة */}
              {(Object.entries(SCREEN_SECTIONS) as [SectionType, typeof SCREEN_SECTIONS[SectionType]][]).map(([sectionId, section]) => {
                const sectionScreens = screensBySection[sectionId];
                if (sectionScreens.length === 0 && searchQuery) return null;
                
                const isExpanded = expandedSections.has(sectionId);
                
                return (
                  <div key={sectionId} className="mb-2">
                    {/* رأس القسم */}
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full p-2.5 rounded-lg transition-all duration-200 text-right flex items-center gap-2 bg-gradient-to-r from-stone-300 to-stone-200 hover:from-stone-400 hover:to-stone-300 shadow-sm border-2 border-stone-400"
                    >
                      {/* أيقونة السهم */}
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-stone-700 flex-shrink-0" />
                      ) : (
                        <ChevronLeft className="h-4 w-4 text-stone-700 flex-shrink-0" />
                      )}
                      
                      {/* رقم القسم */}
                      <Badge 
                        variant="outline"
                        className="font-mono text-[10px] flex-shrink-0"
                        style={{
                          background: '#ffffff',
                          border: '1px solid #78716c',
                          color: '#78716c',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}
                      >
                        {section.number}
                      </Badge>
                      
                      {/* اسم القسم */}
                      <div 
                        className="flex-1 text-right text-sm"
                        style={{ 
                          fontFamily: 'Tajawal, sans-serif',
                          fontWeight: 700,
                          color: '#44403c'
                        }}
                      >
                        {section.title}
                      </div>
                      
                      {/* عدد الشاشات */}
                      <Badge 
                        variant="outline"
                        className="text-[9px] flex-shrink-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #a8a29e',
                          color: '#57534e',
                          padding: '1px 5px',
                          fontSize: '9px'
                        }}
                      >
                        {sectionScreens.length}
                      </Badge>
                    </button>
                    
                    {/* شاشات القسم */}
                    {isExpanded && (
                      <div className="mr-2 mt-1 space-y-0.5 border-r-2 border-stone-300 pr-2">
                        {sectionScreens.map((screen) => {
                          const isActive = activeScreen === screen.id;
                          
                          return (
                            <button
                              key={screen.id}
                              onClick={() => setActiveScreen(screen.id)}
                              className={`
                                w-full p-2 rounded-lg transition-all duration-200 text-right
                                flex items-center gap-2
                                ${isActive 
                                  ? 'bg-white shadow-lg scale-[1.02] border-2' 
                                  : 'bg-white/20 hover:bg-white/40 hover:shadow-md'
                                }
                              `}
                              style={{
                                borderColor: isActive ? '#78716c' : 'transparent',
                                backdropFilter: isActive ? 'blur(10px)' : 'none'
                              }}
                            >
                              {/* الأيقونة */}
                              <div 
                                className="flex-shrink-0"
                                style={{
                                  color: isActive ? '#78716c' : '#57534e'
                                }}
                              >
                                {screen.icon}
                              </div>
                              
                              {/* اسم الشاشة */}
                              <div 
                                className="flex-1 text-right text-sm line-clamp-1"
                                style={{ 
                                  fontFamily: 'Tajawal, sans-serif',
                                  fontWeight: isActive ? 700 : 600,
                                  color: isActive ? '#dc2626' : '#57534e'
                                }}
                              >
                                {screen.title}
                              </div>
                              
                              {/* رقم الشاشة */}
                              <Badge 
                                variant="outline"
                                className="font-mono text-[10px] flex-shrink-0"
                                style={{
                                  background: isActive ? '#fef2f2' : 'rgba(255, 255, 255, 0.6)',
                                  border: `1px solid ${isActive ? '#dc2626' : '#78716c'}`,
                                  color: isActive ? '#dc2626' : '#78716c',
                                  padding: '2px 6px',
                                  fontSize: '10px'
                                }}
                              >
                                {screen.screenNumber}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>

      {/* فوتر السايد بار */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-3"
        style={{
          background: 'linear-gradient(180deg, rgba(231, 229, 228, 0.95) 0%, rgba(214, 211, 209, 0.95) 100%)',
          borderTop: '2px solid #78716c',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="text-center">
          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#78716c', fontWeight: 600 }}>
            {SCREENS_LIST.length} قسم في النظام • v8.1
          </p>
        </div>
      </div>
    </div>
  );
}