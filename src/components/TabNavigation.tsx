import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { CodeDisplay } from './CodeDisplay';
import { 
  FileText, Settings, Users, Building, FileCheck, Calculator, 
  BarChart3, Database, Shield, ClipboardList, Archive, BookOpen,
  DollarSign, Clock, MapPin, User, Phone, Mail, Home, Car,
  Briefcase, Star, Calendar, MessageSquare, Camera, Printer,
  Download, Upload, Search, Filter, MoreHorizontal, Target,
  Clipboard
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: any;
  code: string;
  category: 'basic' | 'technical' | 'financial' | 'management';
  isVisible: boolean;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const allTabs: Tab[] = [
  // المعلومات الأساسية (9 تابات)
  { id: 'basic-info', label: 'البيانات الأساسية', icon: FileText, code: 'TAB-BSC-001', category: 'basic', isVisible: true },
  { id: 'client-info', label: 'معلومات العميل', icon: User, code: 'TAB-CLT-002', category: 'basic', isVisible: true },
  { id: 'project-location', label: 'موقع المشروع', icon: MapPin, code: 'TAB-LOC-003', category: 'basic', isVisible: true },
  { id: 'contact-details', label: 'بيانات التواصل', icon: Phone, code: 'TAB-CNT-004', category: 'basic', isVisible: true },
  { id: 'property-info', label: 'معلومات العقار', icon: Home, code: 'TAB-PRP-005', category: 'basic', isVisible: true },
  { id: 'owner-info', label: 'بيانات المالك', icon: Users, code: 'TAB-OWN-006', category: 'basic', isVisible: true },
  { id: 'consultant-info', label: 'بيانات الاستشاري', icon: Briefcase, code: 'TAB-CNS-007', category: 'basic', isVisible: true },
  { id: 'contractor-info', label: 'بيانات المقاول', icon: Building, code: 'TAB-CTR-008', category: 'basic', isVisible: true },
  { id: 'request-purpose', label: 'الغرض من الطلب', icon: Target, code: 'TAB-PRP-009', category: 'basic', isVisible: true },

  // المعلومات التقنية (9 تابات)
  { id: 'engineering-report', label: 'التقرير الفني من المكتب الهندسي', icon: Clipboard, code: 'TAB-ENG-010', category: 'technical', isVisible: false },
  { id: 'tech-drawings', label: 'المخططات التقنية', icon: FileCheck, code: 'TAB-DRW-011', category: 'technical', isVisible: false },
  { id: 'calculations', label: 'الحسابات الإنشائية', icon: Calculator, code: 'TAB-CAL-012', category: 'technical', isVisible: false },
  { id: 'specifications', label: 'المواصفات الفنية', icon: Settings, code: 'TAB-SPC-013', category: 'technical', isVisible: false },
  { id: 'reports', label: 'التقارير التقنية', icon: BarChart3, code: 'TAB-RPT-014', category: 'technical', isVisible: false },
  { id: 'approvals', label: 'الموافقات المطلوبة', icon: Shield, code: 'TAB-APV-015', category: 'technical', isVisible: false },
  { id: 'inspections', label: 'أعمال الفحص', icon: Search, code: 'TAB-INS-016', category: 'technical', isVisible: false },
  { id: 'compliance', label: 'الامتثال للكود', icon: ClipboardList, code: 'TAB-CMP-017', category: 'technical', isVisible: false },
  { id: 'amendments', label: 'التعديلات المطلوبة', icon: Archive, code: 'TAB-AMD-018', category: 'technical', isVisible: false },

  // المعلومات المالية (7 تابات)
  { id: 'fees-structure', label: 'هيكل الرسوم', icon: DollarSign, code: 'TAB-FEE-019', category: 'financial', isVisible: false },
  { id: 'payments', label: 'المدفوعات', icon: Calculator, code: 'TAB-PAY-020', category: 'financial', isVisible: false },
  { id: 'invoices', label: 'الفواتير', icon: FileText, code: 'TAB-INV-021', category: 'financial', isVisible: false },
  { id: 'receipts', label: 'الإيصالات', icon: Archive, code: 'TAB-RCP-022', category: 'financial', isVisible: false },
  { id: 'refunds', label: 'المبالغ المستردة', icon: Download, code: 'TAB-RFD-023', category: 'financial', isVisible: false },
  { id: 'penalties', label: 'الغرامات والعقوبات', icon: BookOpen, code: 'TAB-PEN-024', category: 'financial', isVisible: false },
  { id: 'financial-summary', label: 'الملخص المالي', icon: BarChart3, code: 'TAB-FIN-025', category: 'financial', isVisible: false },

  // إدارة المعاملة (8 تابات)
  { id: 'timeline', label: 'الجدول الزمني', icon: Calendar, code: 'TAB-TML-026', category: 'management', isVisible: false },
  { id: 'workflow', label: 'سير العمل', icon: Settings, code: 'TAB-WFL-027', category: 'management', isVisible: false },
  { id: 'communications', label: 'المراسلات', icon: MessageSquare, code: 'TAB-COM-028', category: 'management', isVisible: false },
  { id: 'documents', label: 'المستندات', icon: Archive, code: 'TAB-DOC-029', category: 'management', isVisible: false },
  { id: 'attachments', label: 'المرفقات', icon: Upload, code: 'TAB-ATT-030', category: 'management', isVisible: false },
  { id: 'history', label: 'سجل المعاملة', icon: Clock, code: 'TAB-HST-031', category: 'management', isVisible: false },
  { id: 'status-updates', label: 'تحديثات الحالة', icon: Star, code: 'TAB-STS-032', category: 'management', isVisible: false },
  { id: 'partner-assignment', label: 'تخصيص للشركاء', icon: Users, code: 'TAB-PRT-033', category: 'management', isVisible: false }
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>(
    allTabs.filter(tab => tab.isVisible)
  );

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
      // إخفاء تابات هذه الفئة
      setVisibleTabs(prev => prev.filter(tab => tab.category !== category || tab.category === 'basic'));
    } else {
      newExpanded.add(category);
      // إظهار تابات هذه الفئة
      const categoryTabs = allTabs.filter(tab => tab.category === category);
      setVisibleTabs(prev => {
        const existingIds = new Set(prev.map(tab => tab.id));
        const newTabs = categoryTabs.filter(tab => !existingIds.has(tab.id));
        return [...prev, ...newTabs];
      });
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'basic':
        return { label: 'المعلومات الأساسية', color: '#2563eb', count: 9 };
      case 'technical':
        return { label: 'المعلومات التقنية', color: '#10b981', count: 9 };
      case 'financial':
        return { label: 'المعلومات المالية', color: '#f59e0b', count: 7 };
      case 'management':
        return { label: 'إدارة المعاملة', color: '#ef4444', count: 8 };
      default:
        return { label: '', color: '#6b7280', count: 0 };
    }
  };

  const renderCategoryHeader = (category: string) => {
    const info = getCategoryInfo(category);
    const isExpanded = expandedCategories.has(category);
    
    return (
      <Button
        variant="ghost"
        className="w-full justify-between h-auto p-3 mb-2"
        onClick={() => toggleCategory(category)}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: info.color }}
          />
          <span className="text-sub-title font-medium">{info.label}</span>
          <Badge variant="outline" className="text-xs">{info.count}</Badge>
        </div>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </Button>
    );
  };

  const groupedTabs = visibleTabs.reduce((acc, tab) => {
    if (!acc[tab.category]) {
      acc[tab.category] = [];
    }
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<string, Tab[]>);

  return (
    <Card className="relative" style={{ width: '280px', height: 'calc(100vh - 200px)' }}>
      <CodeDisplay code="SCR-TXN-2025-001" position="bottom-right" />
      
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sub-title font-semibold mb-1">تابات المعاملة</h3>
          <p className="text-small text-muted-foreground">
            {visibleTabs.length} من أصل {allTabs.length} تاب متاح
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-1">
            {['basic', 'technical', 'financial', 'management'].map(category => (
              <div key={category}>
                {renderCategoryHeader(category)}
                {expandedCategories.has(category) && groupedTabs[category] && (
                  <div className="space-y-1 mr-4 mb-4">
                    {groupedTabs[category].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <div key={tab.id} className="relative">
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start h-auto p-3 text-right"
                            onClick={() => onTabChange(tab.id)}
                          >
                            <Icon className="w-4 h-4 ml-2" />
                            <span className="text-small">{tab.label}</span>
                          </Button>
                          <div className="absolute bottom-0 right-1">
                            <span className="font-code text-code opacity-70">
                              {tab.code}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full text-small"
            onClick={() => {
              setExpandedCategories(new Set(['basic', 'technical', 'financial', 'management']));
              setVisibleTabs(allTabs);
            }}
          >
            <MoreHorizontal className="w-4 h-4 ml-2" />
            إظهار جميع التابات
          </Button>
        </div>
      </div>
    </Card>
  );
}