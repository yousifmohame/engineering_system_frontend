/**
 * ===================================================================
 * ملف التكوين الشامل لجميع شاشات النظام والتابات الخاصة بها
 * ===================================================================
 * 
 * هذا الملف يحتوي على تعريف كامل لجميع الشاشات في النظام
 * مع التابات الخاصة بكل شاشة والأيقونات والأرقام
 * 
 * النظام: WMS v5.0+
 * التاريخ: 7 أكتوبر 2025
 * الترقيم: XXX-YY (رقم الشاشة - رقم التاب)
 */

import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface TabConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  number: string; // XXX-YY format
  description?: string;
}

export interface ScreenTabsConfig {
  screenId: string;
  screenNumber: string; // XXX format
  screenTitle: string;
  totalTabs: number;
  tabs: TabConfig[];
  hasVerticalSidebar: boolean;
  sidebarIcon?: LucideIcon;
  sidebarGradient?: string;
}

/**
 * التكوين الشامل لجميع الشاشات
 */
export const SCREENS_TABS_CONFIG: Record<string, ScreenTabsConfig> = {
  // ===== شاشة 001: لوحة التحكم الرئيسية =====
  'main-dashboard': {
    screenId: 'main-dashboard',
    screenNumber: '001',
    screenTitle: 'لوحة التحكم الرئيسية',
    totalTabs: 10,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.Home,
    sidebarGradient: 'from-blue-500 to-purple-600',
    tabs: [
      { id: 'overview', title: 'نظرة عامة', icon: Icons.Home, number: '001-01' },
      { id: 'live-stats', title: 'الإحصائيات المباشرة', icon: Icons.Activity, number: '001-02' },
      { id: 'recent-transactions', title: 'المعاملات الأخيرة', icon: Icons.FileText, number: '001-03' },
      { id: 'performance', title: 'تقارير الأداء', icon: Icons.BarChart3, number: '001-04' },
      { id: 'active-employees', title: 'الموظفين النشطين', icon: Icons.Users, number: '001-05' },
      { id: 'ongoing-projects', title: 'المشاريع الجارية', icon: Icons.Target, number: '001-06' },
      { id: 'alerts', title: 'التنبيهات والإشعارات', icon: Icons.AlertCircle, number: '001-07' },
      { id: 'goals', title: 'الأهداف والإنجازات', icon: Icons.Award, number: '001-08' },
      { id: 'calendar', title: 'التقويم والمواعيد', icon: Icons.Calendar, number: '001-09' },
      { id: 'quick-settings', title: 'الإعدادات السريعة', icon: Icons.Zap, number: '001-10' },
    ],
  },

  // ===== شاشة 123: نظام ERP =====
  'erp-dashboard': {
    screenId: 'erp-dashboard',
    screenNumber: '123',
    screenTitle: 'نظام ERP المتكامل',
    totalTabs: 8,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.Database,
    sidebarGradient: 'from-green-500 to-teal-600',
    tabs: [
      { id: 'overview', title: 'نظرة عامة ERP', icon: Icons.Database, number: '123-01' },
      { id: 'inventory', title: 'المخزون والمستودعات', icon: Icons.Package, number: '123-02' },
      { id: 'procurement', title: 'المشتريات والموردين', icon: Icons.ShoppingCart, number: '123-03' },
      { id: 'sales', title: 'المبيعات والعملاء', icon: Icons.Users, number: '123-04' },
      { id: 'production', title: 'الإنتاج والتصنيع', icon: Icons.Settings, number: '123-05' },
      { id: 'finance', title: 'المالية والمحاسبة', icon: Icons.DollarSign, number: '123-06' },
      { id: 'supply-chain', title: 'سلسلة التوريد', icon: Icons.TrendingUp, number: '123-07' },
      { id: 'reports', title: 'التقارير والتحليلات', icon: Icons.BarChart3, number: '123-08' },
    ],
  },

  // ===== شاشة 284: إدارة المعاملات =====
  'main-transactions': {
    screenId: 'main-transactions',
    screenNumber: '284',
    screenTitle: 'إدارة المعاملات الرئيسية',
    totalTabs: 30,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.FileText,
    sidebarGradient: 'from-purple-500 to-pink-600',
    tabs: [
      { id: 'basic-info', title: 'البيانات الأساسية', icon: Icons.FileText, number: '284-01' },
      { id: 'client-data', title: 'بيانات العميل', icon: Icons.User, number: '284-02' },
      { id: 'location-data', title: 'البيانات المكانية', icon: Icons.MapPin, number: '284-03' },
      { id: 'timeline', title: 'الجدول الزمني', icon: Icons.Clock, number: '284-04' },
      { id: 'documents', title: 'الوثائق والمرفقات', icon: Icons.FileCheck, number: '284-05' },
      { id: 'actions', title: 'المتابعة والإجراءات', icon: Icons.Target, number: '284-06' },
      { id: 'financial', title: 'البيانات المالية', icon: Icons.DollarSign, number: '284-07' },
      { id: 'technical', title: 'المعلومات الفنية', icon: Icons.Settings, number: '284-08' },
      { id: 'approvals', title: 'الموافقات والاعتمادات', icon: Icons.CheckCircle, number: '284-09' },
      { id: 'communications', title: 'الاتصالات والمراسلات', icon: Icons.MessageSquare, number: '284-10' },
      { id: 'inspection', title: 'الفحص والمعاينة', icon: Icons.Eye, number: '284-11' },
      { id: 'reports', title: 'التقارير', icon: Icons.FileText, number: '284-12' },
      { id: 'history', title: 'السجل التاريخي', icon: Icons.History, number: '284-13' },
      { id: 'related', title: 'المعاملات المرتبطة', icon: Icons.Link, number: '284-14' },
      { id: 'notes', title: 'الملاحظات', icon: Icons.FileEdit, number: '284-15' },
      { id: 'attachments', title: 'المرفقات الإضافية', icon: Icons.Paperclip, number: '284-16' },
      { id: 'team', title: 'الفريق المسؤول', icon: Icons.Users, number: '284-17' },
      { id: 'tasks', title: 'المهام والواجبات', icon: Icons.ListChecks, number: '284-18' },
      { id: 'deadlines', title: 'المواعيد النهائية', icon: Icons.Calendar, number: '284-19' },
      { id: 'priorities', title: 'الأولويات', icon: Icons.Flag, number: '284-20' },
      { id: 'risks', title: 'المخاطر', icon: Icons.AlertTriangle, number: '284-21' },
      { id: 'quality', title: 'الجودة', icon: Icons.Award, number: '284-22' },
      { id: 'costs', title: 'التكاليف', icon: Icons.Calculator, number: '284-23' },
      { id: 'resources', title: 'الموارد', icon: Icons.Boxes, number: '284-24' },
      { id: 'schedule', title: 'الجدولة', icon: Icons.CalendarClock, number: '284-25' },
      { id: 'compliance', title: 'الالتزام', icon: Icons.ShieldCheck, number: '284-26' },
      { id: 'audit', title: 'المراجعة', icon: Icons.FileSearch, number: '284-27' },
      { id: 'analytics', title: 'التحليلات', icon: Icons.TrendingUp, number: '284-28' },
      { id: 'export', title: 'التصدير', icon: Icons.Download, number: '284-29' },
      { id: 'archive', title: 'الأرشفة', icon: Icons.Archive, number: '284-30' },
    ],
  },

  // ===== شاشة 539: إدارة الموارد البشرية المتقدمة =====
  'hr-advanced-management': {
    screenId: 'hr-advanced-management',
    screenNumber: '539',
    screenTitle: 'إدارة الموارد البشرية المتقدمة',
    totalTabs: 20,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.Users,
    sidebarGradient: 'from-orange-500 to-red-600',
    tabs: [
      { id: 'dashboard', title: 'لوحة التحكم HR', icon: Icons.LayoutDashboard, number: '539-01' },
      { id: 'employees', title: 'إدارة الموظفين', icon: Icons.Users, number: '539-02' },
      { id: 'recruitment', title: 'التوظيف والاستقطاب', icon: Icons.UserPlus, number: '539-03' },
      { id: 'attendance', title: 'الحضور والانصراف', icon: Icons.Clock, number: '539-04' },
      { id: 'leave', title: 'الإجازات', icon: Icons.CalendarOff, number: '539-05' },
      { id: 'payroll', title: 'الرواتب والمزايا', icon: Icons.DollarSign, number: '539-06' },
      { id: 'performance', title: 'تقييم الأداء', icon: Icons.TrendingUp, number: '539-07' },
      { id: 'training', title: 'التدريب والتطوير', icon: Icons.GraduationCap, number: '539-08' },
      { id: 'contracts', title: 'العقود', icon: Icons.FileSignature, number: '539-09' },
      { id: 'benefits', title: 'المزايا والحوافز', icon: Icons.Gift, number: '539-10' },
      { id: 'insurance', title: 'التأمينات', icon: Icons.Shield, number: '539-11' },
      { id: 'gosi', title: 'التأمينات الاجتماعية', icon: Icons.Building2, number: '539-12' },
      { id: 'qiwa', title: 'منصة قوى', icon: Icons.Globe, number: '539-13' },
      { id: 'wps', title: 'نظام حماية الأجور', icon: Icons.CreditCard, number: '539-14' },
      { id: 'complaints', title: 'الشكاوى والتظلمات', icon: Icons.AlertCircle, number: '539-15' },
      { id: 'disciplines', title: 'الجزاءات', icon: Icons.Gavel, number: '539-16' },
      { id: 'end-service', title: 'نهاية الخدمة', icon: Icons.UserMinus, number: '539-17' },
      { id: 'reports', title: 'التقارير HR', icon: Icons.FileBarChart, number: '539-18' },
      { id: 'analytics', title: 'التحليلات', icon: Icons.BarChart3, number: '539-19' },
      { id: 'settings', title: 'إعدادات HR', icon: Icons.Settings, number: '539-20' },
    ],
  },

  // ===== شاشة 734: قاعدة المعرفة =====
  'knowledge-base': {
    screenId: 'knowledge-base',
    screenNumber: '734',
    screenTitle: 'قاعدة المعرفة المتقدمة',
    totalTabs: 20,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.Brain,
    sidebarGradient: 'from-purple-500 to-blue-600',
    tabs: [
      { id: 'dashboard', title: 'لوحة التحكم', icon: Icons.BarChart3, number: '734-01' },
      { id: 'add-content', title: 'إضافة محتوى', icon: Icons.Plus, number: '734-02' },
      { id: 'content-list', title: 'قائمة المحتويات', icon: Icons.List, number: '734-03' },
      { id: 'search', title: 'البحث المتقدم', icon: Icons.Search, number: '734-04' },
      { id: 'categories', title: 'التصنيفات', icon: Icons.Folder, number: '734-05' },
      { id: 'requirements', title: 'الاشتراطات', icon: Icons.FileCheck, number: '734-06' },
      { id: 'relations', title: 'المحتوى المرتبط', icon: Icons.Link, number: '734-07' },
      { id: 'workflow', title: 'سير العمل', icon: Icons.Workflow, number: '734-08' },
      { id: 'versions', title: 'الإصدارات', icon: Icons.GitBranch, number: '734-09' },
      { id: 'reviews', title: 'المراجعات', icon: Icons.MessageSquare, number: '734-10' },
      { id: 'collaboration', title: 'التعاون', icon: Icons.Share2, number: '734-11' },
      { id: 'archive', title: 'الأرشفة', icon: Icons.Archive, number: '734-12' },
      { id: 'reports', title: 'التقارير', icon: Icons.FileText, number: '734-13' },
      { id: 'analytics', title: 'التحليلات', icon: Icons.TrendingUp, number: '734-14' },
      { id: 'ai', title: 'الذكاء الاصطناعي', icon: Icons.Sparkles, number: '734-15' },
      { id: 'integration', title: 'التكامل', icon: Icons.Zap, number: '734-16' },
      { id: 'notifications', title: 'الإشعارات', icon: Icons.Bell, number: '734-17' },
      { id: 'permissions', title: 'الصلاحيات', icon: Icons.Shield, number: '734-18' },
      { id: 'settings', title: 'الإعدادات', icon: Icons.Settings, number: '734-19' },
      { id: 'activity-log', title: 'سجل الأنشطة', icon: Icons.History, number: '734-20' },
    ],
  },

  // ===== شاشة 814: إدارة العقود =====
  'contracts-management': {
    screenId: 'contracts-management',
    screenNumber: '814',
    screenTitle: 'إدارة العقود',
    totalTabs: 12,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.FileSignature,
    sidebarGradient: 'from-indigo-500 to-purple-600',
    tabs: [
      { id: 'dashboard', title: 'لوحة التحكم', icon: Icons.LayoutDashboard, number: '814-01' },
      { id: 'contracts-list', title: 'قائمة العقود', icon: Icons.FileText, number: '814-02' },
      { id: 'new-contract', title: 'عقد جديد', icon: Icons.FilePlus, number: '814-03' },
      { id: 'templates', title: 'النماذج', icon: Icons.FileType, number: '814-04' },
      { id: 'parties', title: 'الأطراف', icon: Icons.Users, number: '814-05' },
      { id: 'terms', title: 'الشروط', icon: Icons.FileCheck, number: '814-06' },
      { id: 'financial', title: 'البيانات المالية', icon: Icons.DollarSign, number: '814-07' },
      { id: 'renewals', title: 'التجديدات', icon: Icons.RefreshCw, number: '814-08' },
      { id: 'amendments', title: 'التعديلات', icon: Icons.FileEdit, number: '814-09' },
      { id: 'termination', title: 'الإنهاء', icon: Icons.FileX, number: '814-10' },
      { id: 'reports', title: 'التقارير', icon: Icons.FileBarChart, number: '814-11' },
      { id: 'archive', title: 'الأرشيف', icon: Icons.Archive, number: '814-12' },
    ],
  },

  // ===== شاشة 450: التدريب والتطوير =====
  'training-development': {
    screenId: 'training-development',
    screenNumber: '450',
    screenTitle: 'التدريب والتطوير',
    totalTabs: 12,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.GraduationCap,
    sidebarGradient: 'from-green-500 to-emerald-600',
    tabs: [
      { id: 'dashboard', title: 'لوحة التحكم', icon: Icons.LayoutDashboard, number: '450-01' },
      { id: 'programs', title: 'البرامج التدريبية', icon: Icons.BookOpen, number: '450-02' },
      { id: 'courses', title: 'الدورات', icon: Icons.GraduationCap, number: '450-03' },
      { id: 'instructors', title: 'المدربون', icon: Icons.UserCheck, number: '450-04' },
      { id: 'trainees', title: 'المتدربون', icon: Icons.Users, number: '450-05' },
      { id: 'schedule', title: 'الجدول الزمني', icon: Icons.Calendar, number: '450-06' },
      { id: 'attendance', title: 'الحضور', icon: Icons.ClipboardCheck, number: '450-07' },
      { id: 'evaluation', title: 'التقييم', icon: Icons.Star, number: '450-08' },
      { id: 'certificates', title: 'الشهادات', icon: Icons.Award, number: '450-09' },
      { id: 'budget', title: 'الميزانية', icon: Icons.DollarSign, number: '450-10' },
      { id: 'reports', title: 'التقارير', icon: Icons.FileText, number: '450-11' },
      { id: 'settings', title: 'الإعدادات', icon: Icons.Settings, number: '450-12' },
    ],
  },

  // ===== شاشة 901: الوثائق والملفات =====
  'documents-files-management': {
    screenId: 'documents-files-management',
    screenNumber: '901',
    screenTitle: 'إدارة الوثائق والملفات',
    totalTabs: 15,
    hasVerticalSidebar: true,
    sidebarIcon: Icons.FolderOpen,
    sidebarGradient: 'from-blue-500 to-cyan-600',
    tabs: [
      { id: 'dashboard', title: 'لوحة التحكم', icon: Icons.LayoutDashboard, number: '901-01' },
      { id: 'files', title: 'الملفات', icon: Icons.File, number: '901-02' },
      { id: 'folders', title: 'المجلدات', icon: Icons.Folder, number: '901-03' },
      { id: 'upload', title: 'رفع الملفات', icon: Icons.Upload, number: '901-04' },
      { id: 'search', title: 'البحث', icon: Icons.Search, number: '901-05' },
      { id: 'categories', title: 'التصنيفات', icon: Icons.Tag, number: '901-06' },
      { id: 'permissions', title: 'الصلاحيات', icon: Icons.Lock, number: '901-07' },
      { id: 'versions', title: 'الإصدارات', icon: Icons.GitBranch, number: '901-08' },
      { id: 'sharing', title: 'المشاركة', icon: Icons.Share2, number: '901-09' },
      { id: 'archive', title: 'الأرشيف', icon: Icons.Archive, number: '901-10' },
      { id: 'trash', title: 'المحذوفات', icon: Icons.Trash2, number: '901-11' },
      { id: 'storage', title: 'التخزين', icon: Icons.HardDrive, number: '901-12' },
      { id: 'activity', title: 'السجل', icon: Icons.Activity, number: '901-13' },
      { id: 'reports', title: 'التقارير', icon: Icons.FileText, number: '901-14' },
      { id: 'settings', title: 'الإعدادات', icon: Icons.Settings, number: '901-15' },
    ],
  },

  // ===== يمكن إضافة باقي الشاشات هنا =====
  // TODO: إضافة باقي الـ 80 شاشة المتبقية
};

/**
 * دالة مساعدة للحصول على تكوين شاشة معينة
 */
export function getScreenTabsConfig(screenId: string): ScreenTabsConfig | null {
  return SCREENS_TABS_CONFIG[screenId] || null;
}

/**
 * دالة مساعدة للحصول على جميع التابات لشاشة معينة
 */
export function getScreenTabs(screenId: string): TabConfig[] {
  const config = getScreenTabsConfig(screenId);
  return config?.tabs || [];
}

/**
 * دالة مساعدة للتحقق من وجود سايد بار رأسي للشاشة
 */
export function hasVerticalSidebar(screenId: string): boolean {
  const config = getScreenTabsConfig(screenId);
  return config?.hasVerticalSidebar || false;
}

/**
 * دالة مساعدة لتوليد رقم تاب تلقائياً
 */
export function generateTabNumber(screenNumber: string, tabIndex: number): string {
  const paddedIndex = String(tabIndex + 1).padStart(2, '0');
  return `${screenNumber}-${paddedIndex}`;
}

export default SCREENS_TABS_CONFIG;
