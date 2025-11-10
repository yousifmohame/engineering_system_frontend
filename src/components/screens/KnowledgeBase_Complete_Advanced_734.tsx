import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Book,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  Save,
  Eye,
  FileText,
  Clock,
  Tag,
  Link,
  AlertCircle,
  CheckCircle,
  Star,
  Calendar,
  Brain,
  Database,
  Archive,
  Share2,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Settings,
  Shield,
  GitBranch,
  MessageSquare,
  Bell,
  Bookmark,
  Copy,
  ExternalLink,
  History,
  Zap,
  Target,
  Heart,
  ThumbsUp,
  Flag,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Layers,
  Code2,
  FileCode,
  Workflow,
  Sparkles,
  Send,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  XCircle,
  Info,
  Folder,
  HardDrive,
  ThumbsUp,
  Flag,
  Send,
  ExternalLink,
  Key,
} from 'lucide-react';

/**
 * ==================================================================
 * شاشة قاعدة المعرفة المتقدمة - رقم 734
 * ==================================================================
 * 
 * نظام إدارة معرفة متكامل (KMS) مع 20 تاب متخصص
 * يشمل AI، Workflow، Versioning، Analytics، وغيرها
 * 
 * التابات الـ 20:
 * 1. لوحة التحكم الرئيسية
 * 2. إضافة محتوى جديد
 * 3. قائمة المحتويات
 * 4. البحث الذكي المتقدم
 * 5. التصنيفات والفئات
 * 6. الاشتراطات الرسمية
 * 7. المحتوى المرتبط
 * 8. سير العمل والموافقات
 * 9. إصدارات المحتوى
 * 10. المراجعات والتعليقات
 * 11. المشاركة والتعاون
 * 12. الأرشفة والحفظ
 * 13. التقارير والإحصاءات
 * 14. التحليلات المتقدمة
 * 15. الذكاء الاصطناعي
 * 16. التكامل مع الأنظمة
 * 17. الإشعارات والتنبيهات
 * 18. الصلاحيات والأمان
 * 19. الإعدادات المتقدمة
 * 20. سجل الأنشطة
 */

const KnowledgeBase_Complete_Advanced_734 = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState('');
  
  // حالات النوافذ المنبثقة للإحصائيات
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [selectedStatType, setSelectedStatType] = useState('');
  
  // حالات النوافذ المنبثقة للمقالات
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  
  // حالات النوافذ المنبثقة للتصنيفات
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // حالات نوافذ المحاضرات الرسمية
  const [showAddLectureDialog, setShowAddLectureDialog] = useState(false);
  const [showLectureDetailsDialog, setShowLectureDetailsDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAIProcessDialog, setShowAIProcessDialog] = useState(false);

  // الصلاحيات الـ 20+ للشاشة 734
  const permissions = [
    // صلاحيات الوصول
    { id: 'PERM-734-001', code: 'SCR-734-VIEW', name: 'عرض شاشة قاعدة المعرفة', level: 'basic', category: 'access' },
    { id: 'PERM-734-002', code: 'SCR-734-FULL-ACCESS', name: 'الوصول الكامل لقاعدة المعرفة', level: 'administrative', category: 'access' },
    
    // صلاحيات المحتوى
    { id: 'PERM-734-101', code: 'KB-CONTENT-VIEW-ALL', name: 'عرض جميع المحتويات', level: 'basic', category: 'content' },
    { id: 'PERM-734-102', code: 'KB-CONTENT-CREATE', name: 'إنشاء محتوى جديد', level: 'advanced', category: 'content' },
    { id: 'PERM-734-103', code: 'KB-CONTENT-EDIT', name: 'تعديل المحتوى', level: 'advanced', category: 'content' },
    { id: 'PERM-734-104', code: 'KB-CONTENT-DELETE', name: 'حذف المحتوى', level: 'critical', category: 'content' },
    { id: 'PERM-734-105', code: 'KB-CONTENT-PUBLISH', name: 'نشر المحتوى', level: 'administrative', category: 'content' },
    { id: 'PERM-734-106', code: 'KB-CONTENT-ARCHIVE', name: 'أرشفة المحتوى', level: 'advanced', category: 'content' },
    
    // صلاحيات البحث
    { id: 'PERM-734-201', code: 'KB-SEARCH-BASIC', name: 'البحث الأساسي', level: 'basic', category: 'search' },
    { id: 'PERM-734-202', code: 'KB-SEARCH-ADVANCED', name: 'البحث المتقدم', level: 'advanced', category: 'search' },
    { id: 'PERM-734-203', code: 'KB-SEARCH-AI', name: 'البحث بالذكاء الاصطناعي', level: 'advanced', category: 'search' },
    
    // صلاحيات التصنيف
    { id: 'PERM-734-301', code: 'KB-CATEGORY-VIEW', name: 'عرض التصنيفات', level: 'basic', category: 'category' },
    { id: 'PERM-734-302', code: 'KB-CATEGORY-MANAGE', name: 'إدارة التصنيفات', level: 'administrative', category: 'category' },
    
    // صلاحيات Workflow
    { id: 'PERM-734-401', code: 'KB-WORKFLOW-VIEW', name: 'عرض سير العمل', level: 'basic', category: 'workflow' },
    { id: 'PERM-734-402', code: 'KB-WORKFLOW-APPROVE', name: 'الموافقة على المحتوى', level: 'administrative', category: 'workflow' },
    { id: 'PERM-734-403', code: 'KB-WORKFLOW-REJECT', name: 'رفض المحتوى', level: 'administrative', category: 'workflow' },
    
    // صلاحيات Versioning
    { id: 'PERM-734-501', code: 'KB-VERSION-VIEW', name: 'عرض الإصدارات', level: 'basic', category: 'version' },
    { id: 'PERM-734-502', code: 'KB-VERSION-RESTORE', name: 'استرجاع إصدار سابق', level: 'administrative', category: 'version' },
    
    // صلاحيات المراجعات
    { id: 'PERM-734-601', code: 'KB-REVIEW-ADD', name: 'إضافة مراجعة', level: 'basic', category: 'review' },
    { id: 'PERM-734-602', code: 'KB-REVIEW-MODERATE', name: 'إدارة المراجعات', level: 'advanced', category: 'review' },
    
    // صلاحيات المشاركة
    { id: 'PERM-734-701', code: 'KB-SHARE-INTERNAL', name: 'المشاركة الداخلية', level: 'basic', category: 'share' },
    { id: 'PERM-734-702', code: 'KB-SHARE-EXTERNAL', name: 'المشاركة الخارجية', level: 'advanced', category: 'share' },
    
    // صلاحيات التقارير
    { id: 'PERM-734-801', code: 'KB-REPORT-VIEW', name: 'عرض التقارير', level: 'basic', category: 'report' },
    { id: 'PERM-734-802', code: 'KB-REPORT-EXPORT', name: 'تصدير التقارير', level: 'advanced', category: 'report' },
    
    // صلاحيات الذكاء الاصطناعي
    { id: 'PERM-734-901', code: 'KB-AI-USE', name: 'استخدام الذكاء الاصطناعي', level: 'advanced', category: 'ai' },
    { id: 'PERM-734-902', code: 'KB-AI-TRAIN', name: 'تدريب النماذج', level: 'critical', category: 'ai' },
    
    // صلاحيات التكامل
    { id: 'PERM-734-1001', code: 'KB-INTEGRATION-VIEW', name: 'عرض التكاملات', level: 'advanced', category: 'integration' },
    { id: 'PERM-734-1002', code: 'KB-INTEGRATION-MANAGE', name: 'إدارة التكاملات', level: 'critical', category: 'integration' },
  ];

  // بيانات نموذجية
  const dashboardStats = {
    totalArticles: 2847,
    publishedArticles: 2456,
    draftArticles: 284,
    pendingReview: 107,
    totalViews: 145678,
    totalDownloads: 34521,
    totalComments: 5432,
    totalContributors: 87,
    avgRating: 4.7,
    categoriesCount: 45,
    tagsCount: 234,
    activeWorkflows: 23,
  };

  // بيانات المحاضرات الرسمية
  const officialLectures = [
    {
      id: 'LEC-2025-001',
      title: 'ورشة عمل: أحدث معايير البناء الأخضر في المملكة',
      type: 'أونلاين',
      eventType: 'ورشة عمل',
      date: '2025-10-15',
      time: '14:00',
      duration: '3 ساعات',
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',
      password: 'GreenBuild2025',
      organizer: 'external',
      organizerName: 'الهيئة السعودية للمدن الخضراء',
      status: 'قادمة',
      attendees: ['موظف001', 'موظف015', 'موظف023', 'موظف042'],
      requiredAttendees: ['جميع المهندسين المعماريين', 'مهندسي التصميم البيئي'],
      isRecorded: true,
      recordingBy: 'الجهة المنظمة',
      certificate: true,
      cpdHours: 3,
      registrationDeadline: '2025-10-13',
      maxParticipants: 100,
      currentParticipants: 47,
      topics: ['البناء المستدام', 'الطاقة المتجددة', 'معايير LEED', 'التصميم البيئي'],
      materials: [],
      notes: '',
    },
    {
      id: 'LEC-2025-002',
      title: 'ندوة: التحول الرقمي في إدارة المشاريع الهندسية',
      type: 'حضورية',
      eventType: 'ندوة',
      date: '2025-10-20',
      time: '10:00',
      duration: '5 ساعات',
      location: 'فندق الريتز كارلتون - الرياض',
      address: 'طريق الملك فهد، العليا، الرياض 12213',
      organizer: 'office',
      organizerName: 'مكتب الهندسة المتكامل',
      status: 'قادمة',
      attendees: ['موظف001', 'موظف005', 'موظف012', 'موظف018', 'موظف025'],
      requiredAttendees: ['مدراء المشاريع', 'المهندسون الرئيسيون'],
      isRecorded: true,
      recordingBy: 'المكتب',
      certificate: true,
      cpdHours: 5,
      registrationDeadline: '2025-10-18',
      maxParticipants: 50,
      currentParticipants: 38,
      topics: ['BIM', 'إدارة المشاريع الرقمية', 'الذكاء الاصطناعي', 'التطبيقات الذكية'],
      materials: [],
      budget: 45000,
      venue: 'قاعة المؤتمرات الكبرى',
      notes: 'يتطلب حضور شخصي - لا يمكن الحضور عن بعد',
    },
    {
      id: 'LEC-2025-003',
      title: 'محاضرة تدريبية: استخدام Revit المتقدم للمشاريع الكبرى',
      type: 'أونلاين',
      eventType: 'محاضرة تدريبية',
      date: '2025-10-12',
      time: '16:00',
      duration: '2 ساعة',
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/...',
      password: 'Revit2025Pro',
      organizer: 'external',
      organizerName: 'Autodesk Middle East',
      status: 'مكتملة',
      attendees: ['موظف003', 'موظف007', 'موظف015', 'موظف022', 'موظف031'],
      requiredAttendees: ['مهندسو التصميم', 'فريق BIM'],
      isRecorded: true,
      recordingBy: 'الجهة المنظمة',
      recordingUrl: 'https://autodesk.com/recordings/revit-advanced-2025',
      certificate: true,
      cpdHours: 2,
      completedDate: '2025-10-12',
      topics: ['Revit Architecture', 'Family Creation', 'Advanced Modeling', 'Collaboration'],
      materials: [
        { type: 'عرض تقديمي', name: 'Revit_Advanced_Techniques.pdf', size: '12 MB', url: '#' },
        { type: 'ملف مشروع', name: 'Sample_Project.rvt', size: '45 MB', url: '#' },
      ],
      images: [
        { id: 1, url: '/images/lecture-001.jpg', caption: 'لقطة من الجلسة' },
        { id: 2, url: '/images/lecture-002.jpg', caption: 'عرض الشاشة' },
      ],
      videoUrl: 'https://youtube.com/watch?v=...',
      notes: 'كانت جلسة مفيدة جداً، تم تغطية جميع المواضيع المطلوبة بشكل ممتاز',
      aiAnalysis: {
        processed: true,
        summary: 'تم معالجة الفيديو والصور بالذكاء الاصطناعي',
        keyPoints: [
          'تقنيات متقدمة في نمذجة العائلات',
          'استخدام Dynamo للأتمتة',
          'أفضل ممارسات التعاون متعدد التخصصات',
        ],
        transcription: 'تم استخراج النص من الفيديو...',
      },
    },
    {
      id: 'LEC-2025-004',
      title: 'لقاء: اشتراطات البلدية الجديدة لعام 2025',
      type: 'هجين',
      eventType: 'لقاء تعريفي',
      date: '2025-11-05',
      time: '11:00',
      duration: '4 ساعات',
      platform: 'Webex',
      link: 'https://webex.com/meet/...',
      password: 'Municipality2025',
      location: 'مقر المكتب - قاعة الاجتماعات الرئيسية',
      organizer: 'external',
      organizerName: 'أمانة منطقة الرياض',
      status: 'قادمة',
      attendees: ['موظف001', 'موظف004', 'موظف009', 'موظف016'],
      requiredAttendees: ['الجميع'],
      isRecorded: true,
      recordingBy: 'كلاهما',
      certificate: false,
      registrationDeadline: '2025-11-03',
      maxParticipants: 200,
      currentParticipants: 125,
      topics: ['اشتراطات البناء الجديدة', 'إجراءات التراخيص', 'التحديثات القانونية'],
      materials: [],
      notes: 'يمكن الحضور حضورياً أو عن بعد',
    },
  ];

  const recentArticles = [
    {
      id: 'KB-001',
      title: 'دليل شامل للحصول على ترخيص البناء السكني',
      category: 'تراخيص البناء',
      author: 'أحمد محمد',
      status: 'published',
      views: 1234,
      rating: 4.8,
      lastUpdated: '2025-10-01',
      version: '2.1',
    },
    {
      id: 'KB-002',
      title: 'متطلبات التصميم المعماري للمباني التجارية',
      category: 'تصميم معماري',
      author: 'سارة أحمد',
      status: 'review',
      views: 856,
      rating: 4.6,
      lastUpdated: '2025-09-30',
      version: '1.5',
    },
    {
      id: 'KB-003',
      title: 'اشتراطات السلامة من الحريق للمباني',
      category: 'السلامة',
      author: 'خالد علي',
      status: 'draft',
      views: 423,
      rating: 4.5,
      lastUpdated: '2025-09-28',
      version: '1.0',
    },
  ];

  const categories = [
    { id: 'CAT-001', name: 'تراخيص البناء', count: 234, icon: '🏗️' },
    { id: 'CAT-002', name: 'تصميم معماري', count: 189, icon: '📐' },
    { id: 'CAT-003', name: 'السلامة', count: 156, icon: '🛡️' },
    { id: 'CAT-004', name: 'الاشتراطات', count: 298, icon: '📋' },
    { id: 'CAT-005', name: 'العقود', count: 123, icon: '📝' },
  ];

  return (
    <div className="screen-with-vertical-tabs-layout" dir="rtl">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        {/* هيدر السايد بار */}
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                قاعدة المعرفة
              </h2>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                شاشة 734 - 20 تاب
              </p>
            </div>
          </div>
        </div>

        {/* جسم السايد بار - التابات */}
        <div className="vertical-tabs-sidebar-body">
          {/* تاب 1: لوحة التحكم */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`vertical-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">لوحة التحكم</div>
              <div className="vertical-tab-number">734-01</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 2: إضافة محتوى */}
          <button
            onClick={() => setActiveTab('add-content')}
            className={`vertical-tab-item ${activeTab === 'add-content' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Plus className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">إضافة محتوى</div>
              <div className="vertical-tab-number">734-02</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 3: قائمة المحتويات */}
          <button
            onClick={() => setActiveTab('content-list')}
            className={`vertical-tab-item ${activeTab === 'content-list' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Database className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">قائمة المحتويات</div>
              <div className="vertical-tab-number">734-03</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 4: البحث الذكي */}
          <button
            onClick={() => setActiveTab('smart-search')}
            className={`vertical-tab-item ${activeTab === 'smart-search' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Brain className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">البحث الذكي</div>
              <div className="vertical-tab-number">734-04</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 5: التصنيفات */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`vertical-tab-item ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Layers className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">التصنيفات</div>
              <div className="vertical-tab-number">734-05</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 6: الاشتراطات */}
          <button
            onClick={() => setActiveTab('requirements')}
            className={`vertical-tab-item ${activeTab === 'requirements' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <FileText className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الاشتراطات الرسمية</div>
              <div className="vertical-tab-number">734-06</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 7: المحتوى المرتبط */}
          <button
            onClick={() => setActiveTab('linked-content')}
            className={`vertical-tab-item ${activeTab === 'linked-content' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Link className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">المحتوى المرتبط</div>
              <div className="vertical-tab-number">734-07</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 8: سير العمل */}
          <button
            onClick={() => setActiveTab('workflow')}
            className={`vertical-tab-item ${activeTab === 'workflow' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Workflow className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">سير العمل</div>
              <div className="vertical-tab-number">734-08</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 9: إصدارات المحتوى */}
          <button
            onClick={() => setActiveTab('versions')}
            className={`vertical-tab-item ${activeTab === 'versions' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">إصدارات المحتوى</div>
              <div className="vertical-tab-number">734-09</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 10: المراجعات */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`vertical-tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">المراجعات والتعليقات</div>
              <div className="vertical-tab-number">734-10</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 11: المشاركة */}
          <button
            onClick={() => setActiveTab('sharing')}
            className={`vertical-tab-item ${activeTab === 'sharing' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">المشاركة والتعاون</div>
              <div className="vertical-tab-number">734-11</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 12: الأرشفة */}
          <button
            onClick={() => setActiveTab('archive')}
            className={`vertical-tab-item ${activeTab === 'archive' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Archive className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الأرشفة والحفظ</div>
              <div className="vertical-tab-number">734-12</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 13: التقارير */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`vertical-tab-item ${activeTab === 'reports' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <FileText className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">التقارير</div>
              <div className="vertical-tab-number">734-13</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 14: التحليلات */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`vertical-tab-item ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">التحليلات المتقدمة</div>
              <div className="vertical-tab-number">734-14</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 15: الذكاء الاصطناعي */}
          <button
            onClick={() => setActiveTab('ai')}
            className={`vertical-tab-item ${activeTab === 'ai' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الذكاء الاصطناعي</div>
              <div className="vertical-tab-number">734-15</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 16: التكامل */}
          <button
            onClick={() => setActiveTab('integration')}
            className={`vertical-tab-item ${activeTab === 'integration' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Zap className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">التكامل مع الأنظمة</div>
              <div className="vertical-tab-number">734-16</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 17: الإشعارات */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`vertical-tab-item ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Bell className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الإشعارات</div>
              <div className="vertical-tab-number">734-17</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 18: الصلاحيات */}
          <button
            onClick={() => setActiveTab('permissions')}
            className={`vertical-tab-item ${activeTab === 'permissions' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Shield className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الصلاحيات والأمان</div>
              <div className="vertical-tab-number">734-18</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 19: الإعدادات */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`vertical-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <Settings className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">الإعدادات المتقدمة</div>
              <div className="vertical-tab-number">734-19</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 20: محاضرات رسمية */}
          <button
            onClick={() => setActiveTab('official-lectures')}
            className={`vertical-tab-item ${activeTab === 'official-lectures' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">محاضرات رسمية</div>
              <div className="vertical-tab-number">734-20</div>
            </div>
          </button>

          <div className="vertical-tab-separator" />

          {/* تاب 21: سجل الأنشطة */}
          <button
            onClick={() => setActiveTab('activity-log')}
            className={`vertical-tab-item ${activeTab === 'activity-log' ? 'active' : ''}`}
          >
            <div className="vertical-tab-icon">
              <History className="w-4 h-4" />
            </div>
            <div className="vertical-tab-content">
              <div className="vertical-tab-title">��جل الأنشطة</div>
              <div className="vertical-tab-number">734-21</div>
            </div>
          </button>
        </div>

        {/* فوتر السايد بار */}
        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {dashboardStats.totalArticles.toLocaleString()} مقال
            </span>
            <span className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {dashboardStats.totalViews.toLocaleString()} مشاهدة
            </span>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        {/* هيدر المحتوى */}
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === 'dashboard' && 'لوحة التحكم الرئيسية'}
                {activeTab === 'add-content' && 'إضافة محتوى جديد'}
                {activeTab === 'content-list' && 'قائمة المحتويات'}
                {activeTab === 'smart-search' && 'البحث الذكي المتقدم'}
                {activeTab === 'categories' && 'التصنيفات والفئات'}
                {activeTab === 'requirements' && 'الاشتراطات الرسمية'}
                {activeTab === 'linked-content' && 'المحتوى المرتبط'}
                {activeTab === 'workflow' && 'سير العمل والموافقات'}
                {activeTab === 'versions' && 'إصدارات المحتوى'}
                {activeTab === 'reviews' && 'المراجعات والتعليقات'}
                {activeTab === 'sharing' && 'المشاركة والتعاون'}
                {activeTab === 'archive' && 'الأرشفة والحفظ'}
                {activeTab === 'reports' && 'التقارير والإحصاءات'}
                {activeTab === 'analytics' && 'التحليلات المتقدمة'}
                {activeTab === 'ai' && 'الذكاء الاصطناعي'}
                {activeTab === 'integration' && 'التكامل مع الأنظمة'}
                {activeTab === 'notifications' && 'الإشعارات والتنبيهات'}
                {activeTab === 'permissions' && 'الصلاحيات والأمان'}
                {activeTab === 'settings' && 'الإعدادات المتقدمة'}
                {activeTab === 'official-lectures' && 'محاضرات رسمية'}
                {activeTab === 'activity-log' && 'سجل الأنشطة'}
              </h1>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام إدارة المعرفة المتكامل - Knowledge Management System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 ml-2" />
                استيراد
              </Button>
            </div>
          </div>
        </div>

        {/* جسم المحتوى */}
        <div className="vertical-tabs-content-body">
          {/* تاب لوحة التحكم */}
          {activeTab === 'dashboard' && (
            <div className="dense-layout">
              {/* الإحصائيات الرئيسية - تفاعلية */}
              <div className="dense-stats-grid">
                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('totalArticles');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.totalArticles.toLocaleString()}</div>
                  <div className="dense-stat-label">إجمالي المقالات</div>
                </div>

                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('publishedArticles');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.publishedArticles.toLocaleString()}</div>
                  <div className="dense-stat-label">مقالات منشورة</div>
                </div>

                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('pendingReview');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.pendingReview}</div>
                  <div className="dense-stat-label">في انتظار المراجعة</div>
                </div>

                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('totalViews');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.totalViews.toLocaleString()}</div>
                  <div className="dense-stat-label">إجمالي المشاهدات</div>
                </div>

                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('totalDownloads');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.totalDownloads.toLocaleString()}</div>
                  <div className="dense-stat-label">إجمالي التنزيلات</div>
                </div>

                <div 
                  className="dense-stat-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedStatType('totalContributors');
                    setShowStatsDialog(true);
                  }}
                >
                  <div className="dense-stat-icon">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{dashboardStats.totalContributors}</div>
                  <div className="dense-stat-label">المساهمون</div>
                </div>
              </div>

              {/* المقالات الحديثة - تفاعلية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Clock className="w-4 h-4" />
                    آخر المقالات
                  </div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-secondary">
                      <Eye className="w-3 h-3" />
                      عرض الكل
                    </Button>
                  </div>
                </div>
                <div className="dense-grid dense-grid-auto">
                  {recentArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="dense-content-card cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => {
                        setSelectedArticle(article);
                        setShowArticleDialog(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="compact-title text-gray-900 mb-1">
                            {article.title}
                          </h3>
                          <p className="compact-subtitle text-gray-500">
                            {article.author} • الإصدار {article.version}
                          </p>
                        </div>
                        <Badge
                          variant={article.status === 'published' ? 'default' : article.status === 'review' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {article.status === 'published' ? 'منشور' : article.status === 'review' ? 'مراجعة' : 'مسودة'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                          <Tag className="w-3 h-3" />
                          <span>{article.category}</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                          <Eye className="w-3 h-3" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{article.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="dense-action-btn flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(article);
                            setShowArticleDialog(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="dense-action-btn flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="dense-action-btn flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* التصنيفات الأكثر استخداماً - تفاعلية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Layers className="w-4 h-4" />
                    التصنيفات الأكثر استخداماً
                  </div>
                </div>
                <div className="dense-grid dense-grid-5">
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="dense-content-card text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDialog(true);
                      }}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h4 className="compact-title mb-1">{category.name}</h4>
                      <p className="compact-subtitle text-blue-600 font-semibold">{category.count} مقال</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-06: الاشتراطات الرسمية */}
          {activeTab === 'requirements' && (
            <div className="dense-layout">
              {/* إحصائيات الاشتراطات */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">127</div>
                  <div className="dense-stat-label">إجمالي الاشتراطات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">98</div>
                  <div className="dense-stat-label">اشتراطات سارية</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">18</div>
                  <div className="dense-stat-label">تنتهي قريباً</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">11</div>
                  <div className="dense-stat-label">منتهية</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">3,452</div>
                  <div className="dense-stat-label">إجمالي التنزيلات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">23</div>
                  <div className="dense-stat-label">تم رفعها هذا الشهر</div>
                </div>
              </div>

              {/* أدوات الفلترة والبحث */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Filter className="w-4 h-4" />
                    فلترة وبحث متقدم
                  </div>
                </div>
                <div className="dense-form-row">
                  <div className="dense-form-group">
                    <label className="dense-form-label">الجهة المُصدرة</label>
                    <select className="dense-form-select">
                      <option>جميع الجهات</option>
                      <option>وزارة الشؤون البلدية</option>
                      <option>أمانة منطقة الرياض</option>
                      <option>الدفاع المدني</option>
                      <option>هيئة المدن الاقتصادية</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">الحالة</label>
                    <select className="dense-form-select">
                      <option>جميع الحالات</option>
                      <option>ساري</option>
                      <option>ينتهي قريباً</option>
                      <option>منتهي</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">نوع الملف</label>
                    <select className="dense-form-select">
                      <option>جميع الأنواع</option>
                      <option>PDF</option>
                      <option>Word</option>
                      <option>Excel</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">البحث</label>
                    <input type="text" className="dense-form-input" placeholder="ابحث في الاشتراطات..." />
                  </div>
                </div>
              </div>

              {/* قائمة الاشتراطات */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <FileText className="w-4 h-4" />
                    الاشتراطات الرسمية النشطة
                  </div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-primary">
                      <Plus className="w-3 h-3" />
                      إضافة اشتراط
                    </Button>
                  </div>
                </div>
                
                <div className="dense-grid dense-grid-2">
                  {[
                    {
                      id: 'REQ-001',
                      name: 'اشتراطات البناء السكني - الرياض 2025',
                      entity: 'أمانة منطقة الرياض',
                      issueDate: '2025-01-15',
                      expiryDate: '2025-12-31',
                      status: 'ساري',
                      type: 'PDF',
                      size: '3.2 MB',
                      downloads: 456,
                      linkedArticles: 23,
                      priority: 'عالي',
                    },
                    {
                      id: 'REQ-002',
                      name: 'كود البناء السعودي - الإصدار الثالث',
                      entity: 'وزارة الشؤون البلدية',
                      issueDate: '2024-06-01',
                      expiryDate: '2026-06-01',
                      status: 'ساري',
                      type: 'PDF',
                      size: '18.5 MB',
                      downloads: 1234,
                      linkedArticles: 67,
                      priority: 'حرج',
                    },
                    {
                      id: 'REQ-003',
                      name: 'اشتراطات السلامة من الحريق 2025',
                      entity: 'المديرية العامة للدفاع المدني',
                      issueDate: '2025-03-01',
                      expiryDate: '2025-11-15',
                      status: 'ينتهي قريباً',
                      type: 'PDF',
                      size: '5.8 MB',
                      downloads: 789,
                      linkedArticles: 34,
                      priority: 'عالي',
                    },
                    {
                      id: 'REQ-004',
                      name: 'اشتراطات البناء الأخضر والاستدامة',
                      entity: 'هيئة المدن الاقتصادية',
                      issueDate: '2024-12-01',
                      expiryDate: '2025-12-01',
                      status: 'ساري',
                      type: 'PDF',
                      size: '4.1 MB',
                      downloads: 234,
                      linkedArticles: 12,
                      priority: 'متوسط',
                    },
                  ].map((req) => (
                    <div key={req.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                              {req.id}
                            </code>
                            <Badge className={
                              req.status === 'ساري' ? 'bg-green-100 text-green-800' :
                              req.status === 'ينتهي قريباً' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {req.status}
                            </Badge>
                            <Badge className={
                              req.priority === 'حرج' ? 'bg-red-100 text-red-800' :
                              req.priority === 'عالي' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {req.priority}
                            </Badge>
                          </div>
                          <h4 className="compact-title text-gray-900 mb-1">{req.name}</h4>
                          <p className="compact-subtitle text-gray-600 mb-2">
                            <span className="font-semibold">{req.entity}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>الإصدار: {req.issueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>الانتهاء: {req.expiryDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{req.type} - {req.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{req.downloads} تنزيل</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3 text-xs text-blue-600">
                        <Link className="w-3 h-3" />
                        <span>{req.linkedArticles} مقال مرتبط</span>
                      </div>

                      <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Eye className="w-3 h-3" />
                          عرض
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Download className="w-3 h-3" />
                          تنزيل
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Edit className="w-3 h-3" />
                          تعديل
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Share2 className="w-3 h-3" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* تنبيهات الاشتراطات */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Bell className="w-4 h-4" />
                    تنبيهات الصلاحية
                  </div>
                </div>
                <div className="space-y-2">
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-xs">
                      <strong>تحذير:</strong> هناك 18 اشتراط تنتهي صلاحيته خلال الـ 30 يوم القادمة
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs">
                      <strong>معلومة:</strong> تم تحديث 5 اشتراطات جديدة هذا الأسبوع
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-07: المحتوى المرتبط */}
          {activeTab === 'linked-content' && (
            <div className="dense-layout">
              {/* إحصائيات الارتباطات */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Link className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">1,234</div>
                  <div className="dense-stat-label">إجمالي الروابط</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">456</div>
                  <div className="dense-stat-label">مرتبط بمعاملات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">234</div>
                  <div className="dense-stat-label">مرتبط بعملاء</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Folder className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">178</div>
                  <div className="dense-stat-label">مرتبط بمشاريع</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">89</div>
                  <div className="dense-stat-label">مرتبط باشتراطات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">92%</div>
                  <div className="dense-stat-label">معدل الاستخدام</div>
                </div>
              </div>

              {/* خريطة الروابط التفاعلية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Layers className="w-4 h-4" />
                    خريطة الروابط التفاعلية
                  </div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-secondary">
                      <Eye className="w-3 h-3" />
                      عرض كامل
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    خريطة بصرية للروابط بين المحتوى
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {['المعاملات', 'العملاء', 'المشاريع', 'الاشتراطات', 'التقارير', 'المستندات'].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-2">
                          {item}
                        </div>
                        <div className="text-xs text-gray-600">{Math.floor(Math.random() * 100) + 50} رابط</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* المحتوى المرتبط بالمعاملات */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <FileText className="w-4 h-4" />
                    المحتوى المرتبط بالمعاملات
                  </div>
                </div>
                <div className="dense-grid dense-grid-3">
                  {[
                    { id: 'TRANS-001', title: 'معاملة ترخيص بناء سكني', linkedArticles: 12, type: 'ترخيص', status: 'نشط' },
                    { id: 'TRANS-002', title: 'معاملة شهادة إتمام بناء', linkedArticles: 8, type: 'شهادة', status: 'مكتمل' },
                    { id: 'TRANS-003', title: 'معاملة تعديل تصميم', linkedArticles: 15, type: 'تعديل', status: 'قيد المراجعة' },
                    { id: 'TRANS-004', title: 'معاملة فك ارتباط', linkedArticles: 5, type: 'إداري', status: 'نشط' },
                    { id: 'TRANS-005', title: 'معاملة تجديد رخصة', linkedArticles: 9, type: 'تجديد', status: 'نشط' },
                    { id: 'TRANS-006', title: 'معاملة دمج قطع', linkedArticles: 11, type: 'إداري', status: 'معلق' },
                  ].map((trans) => (
                    <div key={trans.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                          {trans.id}
                        </code>
                        <Badge className={
                          trans.status === 'نشط' ? 'bg-green-100 text-green-800' :
                          trans.status === 'مكتمل' ? 'bg-blue-100 text-blue-800' :
                          trans.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {trans.status}
                        </Badge>
                      </div>
                      <h4 className="compact-title mb-1">{trans.title}</h4>
                      <p className="compact-subtitle mb-2">{trans.type}</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
                        <Link className="w-3 h-3" />
                        <span>{trans.linkedArticles} مقال مرتبط</span>
                      </div>
                      <Button size="sm" className="dense-btn dense-btn-secondary w-full">
                        <Eye className="w-3 h-3" />
                        عرض الروابط
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* المحتوى المرتبط بالعملاء */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Users className="w-4 h-4" />
                    المحتوى المرتبط بالعملاء
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'أحمد محمد علي', articles: 23, projects: 5, transactions: 12 },
                    { name: 'شركة التطوير العقاري', articles: 45, projects: 12, transactions: 28 },
                    { name: 'مؤسسة البناء الحديث', articles: 18, projects: 7, transactions: 15 },
                    { name: 'سارة أحمد السالم', articles: 12, projects: 3, transactions: 8 },
                  ].map((client, idx) => (
                    <div key={idx} className="dense-content-card">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="compact-title mb-1">{client.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>{client.articles} مقال</span>
                            <span>•</span>
                            <span>{client.projects} مشروع</span>
                            <span>•</span>
                            <span>{client.transactions} معاملة</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="dense-action-btn">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-12: الأرشفة والحفظ */}
          {activeTab === 'archive' && (
            <div className="dense-layout">
              {/* إحصائيات الأرشيف */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">2,847</div>
                  <div className="dense-stat-label">إجمالي المؤرشف</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">156 GB</div>
                  <div className="dense-stat-label">المساحة المستخدمة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">234</div>
                  <div className="dense-stat-label">أرشفة هذا الشهر</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">45</div>
                  <div className="dense-stat-label">استرجاع نشط</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">100%</div>
                  <div className="dense-stat-label">معدل النسخ الاحتياطي</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">99.9%</div>
                  <div className="dense-stat-label">نسبة الموثوقية</div>
                </div>
              </div>

              {/* أدوات الأرشفة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Settings className="w-4 h-4" />
                    إعدادات الأرشفة التلقائية
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">أرشفة المحتوى القديم تلقائياً</h4>
                      <p className="compact-subtitle">أرشفة المحتوى الذي لم يتم الوصول إليه لمدة 6 أشهر</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">النسخ الاحتياطي اليومي</h4>
                      <p className="compact-subtitle">نسخ احتياطي كامل يومياً في الساعة 2:00 صباحاً</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">ضغط الملفات المؤرشفة</h4>
                      <p className="compact-subtitle">ضغط الملفات لتوفير المساحة التخزينية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* الأرشيف حسب الفئة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Folder className="w-4 h-4" />
                    الأرشيف حسب الفئة
                  </div>
                </div>
                <div className="dense-grid dense-grid-4">
                  {[
                    { category: 'المعاملات', count: 1234, size: '45 GB', color: 'blue' },
                    { category: 'الاشتراطات', count: 456, size: '18 GB', color: 'green' },
                    { category: 'التقارير', count: 789, size: '32 GB', color: 'purple' },
                    { category: 'المستندات', count: 234, size: '28 GB', color: 'orange' },
                    { category: 'الصور', count: 567, size: '21 GB', color: 'red' },
                    { category: 'المراسلات', count: 345, size: '8 GB', color: 'teal' },
                    { category: 'العقود', count: 123, size: '4 GB', color: 'pink' },
                    { category: 'أخرى', count: 99, size: '2 GB', color: 'gray' },
                  ].map((item, idx) => (
                    <div key={idx} className="dense-content-card text-center">
                      <div className={`w-12 h-12 mx-auto mb-2 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                        <Archive className={`w-6 h-6 text-${item.color}-600`} />
                      </div>
                      <h4 className="compact-title mb-1">{item.category}</h4>
                      <p className="compact-subtitle mb-1">{item.count.toLocaleString()} عنصر</p>
                      <p className="compact-subtitle text-gray-500">{item.size}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* سجل الأرشفة الأخير */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <History className="w-4 h-4" />
                    سجل الأرشفة الأخير
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { action: 'أرشفة تلقائية', items: 45, date: '2025-10-02 02:00', status: 'مكتمل', type: 'auto' },
                    { action: 'نسخ احتياطي يدوي', items: 12, date: '2025-10-01 15:30', status: 'مكتمل', type: 'manual' },
                    { action: 'استرجاع محتوى', items: 8, date: '2025-10-01 10:15', status: 'مكتمل', type: 'restore' },
                    { action: 'أرشفة تلقائية', items: 52, date: '2025-10-01 02:00', status: 'مكتمل', type: 'auto' },
                    { action: 'حذف من الأرشيف', items: 3, date: '2025-09-30 14:20', status: 'مكتمل', type: 'delete' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.type === 'auto' ? 'bg-blue-100 text-blue-600' :
                          log.type === 'manual' ? 'bg-green-100 text-green-600' :
                          log.type === 'restore' ? 'bg-purple-100 text-purple-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {log.type === 'auto' && <RefreshCw className="w-4 h-4" />}
                          {log.type === 'manual' && <Archive className="w-4 h-4" />}
                          {log.type === 'restore' && <Upload className="w-4 h-4" />}
                          {log.type === 'delete' && <Trash2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="compact-title">{log.action}</h4>
                          <p className="compact-subtitle">{log.items} عنصر • {log.date}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{log.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* أدوات الاسترجاع السريع */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Upload className="w-4 h-4" />
                    استرجاع سريع
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <label className="dense-form-label">نوع المحتوى</label>
                      <select className="dense-form-select">
                        <option>جميع الأنواع</option>
                        <option>المعاملات</option>
                        <option>الاشتراطات</option>
                        <option>التقارير</option>
                      </select>
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">التاريخ من</label>
                      <input type="date" className="dense-form-input" />
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">التاريخ إلى</label>
                      <input type="date" className="dense-form-input" />
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">&nbsp;</label>
                      <Button className="dense-btn dense-btn-primary w-full">
                        <Search className="w-3 h-3" />
                        بحث واسترجاع
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-13: التقارير والإحصاءات */}
          {activeTab === 'reports' && (
            <div className="dense-layout">
              {/* إحصائيات التقارير */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">342</div>
                  <div className="dense-stat-label">تقارير محفوظة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">+23%</div>
                  <div className="dense-stat-label">زيادة هذا الشهر</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">145,678</div>
                  <div className="dense-stat-label">إجمالي المشاهدات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">34,521</div>
                  <div className="dense-stat-label">تنزيلات التقارير</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">87</div>
                  <div className="dense-stat-label">مستخدمون نشطون</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">4.7</div>
                  <div className="dense-stat-label">متوسط التقييم</div>
                </div>
              </div>

              {/* أدوات إنشاء التقارير */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Plus className="w-4 h-4" />
                    إنشاء تقرير جديد
                  </div>
                </div>
                <div className="dense-grid dense-grid-4">
                  {[
                    { type: 'استخدام المحتوى', icon: '📊', color: 'blue' },
                    { type: 'الاشتراطات النشطة', icon: '📋', color: 'green' },
                    { type: 'المحتوى الأكثر مشاهدة', icon: '👁️', color: 'purple' },
                    { type: 'نشاط المستخدمين', icon: '👥', color: 'orange' },
                    { type: 'التنزيلات', icon: '⬇️', color: 'red' },
                    { type: 'الروابط والعلاقات', icon: '🔗', color: 'teal' },
                    { type: 'الأرشفة والنسخ', icon: '💾', color: 'pink' },
                    { type: 'تقرير مخصص', icon: '⚙️', color: 'gray' },
                  ].map((report, idx) => (
                    <div key={idx} className="dense-content-card text-center cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="text-4xl mb-2">{report.icon}</div>
                      <h4 className="compact-title mb-2">{report.type}</h4>
                      <Button size="sm" className="dense-btn dense-btn-primary w-full">
                        إنشاء
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* التقارير المحفوظة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Bookmark className="w-4 h-4" />
                    التقارير المحفوظة
                  </div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-secondary">
                      <Filter className="w-3 h-3" />
                      فلترة
                    </Button>
                  </div>
                </div>
                <div className="dense-grid dense-grid-3">
                  {[
                    {
                      id: 'REP-001',
                      name: 'تقرير الاستخدام الشهري - سبتمبر 2025',
                      type: 'استخدام',
                      date: '2025-10-01',
                      views: 234,
                      downloads: 45,
                      size: '2.3 MB',
                    },
                    {
                      id: 'REP-002',
                      name: 'تقرير الاشتراطات النشطة - الربع الثالث',
                      type: 'اشتراطات',
                      date: '2025-09-30',
                      views: 189,
                      downloads: 67,
                      size: '1.8 MB',
                    },
                    {
                      id: 'REP-003',
                      name: 'تقرير المحتوى الأكثر مشاهدة',
                      type: 'إحصائيات',
                      date: '2025-09-28',
                      views: 456,
                      downloads: 123,
                      size: '3.1 MB',
                    },
                    {
                      id: 'REP-004',
                      name: 'تقرير نشاط المستخدمين - أسبوعي',
                      type: 'نشاط',
                      date: '2025-09-25',
                      views: 123,
                      downloads: 34,
                      size: '1.2 MB',
                    },
                    {
                      id: 'REP-005',
                      name: 'تقرير التنزيلات والمشاركات',
                      type: 'تنزيلات',
                      date: '2025-09-20',
                      views: 234,
                      downloads: 56,
                      size: '2.7 MB',
                    },
                    {
                      id: 'REP-006',
                      name: 'تقرير الروابط والعلاقات - شامل',
                      type: 'روابط',
                      date: '2025-09-15',
                      views: 178,
                      downloads: 45,
                      size: '4.2 MB',
                    },
                  ].map((report) => (
                    <div key={report.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-mono">
                          {report.id}
                        </code>
                        <Badge className="bg-blue-100 text-blue-800">{report.type}</Badge>
                      </div>
                      <h4 className="compact-title mb-2">{report.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{report.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{report.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{report.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{report.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* مؤشرات الأداء الرئيسية (KPIs) */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Target className="w-4 h-4" />
                    مؤشرات الأداء الرئيسية (KPIs)
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'معدل استخدام المحتوى', value: '87%', trend: '+5%', status: 'positive' },
                    { label: 'متوسط وقت البحث', value: '12 ثانية', trend: '-3 ثانية', status: 'positive' },
                    { label: 'معدل الرضا', value: '4.7/5', trend: '+0.2', status: 'positive' },
                    { label: 'نسبة المحتوى المحدث', value: '92%', trend: '+8%', status: 'positive' },
                  ].map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="compact-title text-gray-800">{kpi.label}</h4>
                        <Badge className={`${kpi.status === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {kpi.trend}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{kpi.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* رسوم بيانية تفاعلية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <BarChart3 className="w-4 h-4" />
                    الرسوم البيانية التفاعلية
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    رسم بياني تفاعلي لاستخدام المحتوى خلال الـ 6 أشهر الماضية
                  </div>
                  <div className="h-48 flex items-end justify-around gap-2">
                    {[45, 67, 54, 78, 89, 92].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${height}% استخدام`}
                        />
                        <span className="text-xs text-gray-600 mt-2">
                          {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-05: التصنيفات والفئات */}
          {activeTab === 'categories' && (
            <div className="dense-layout">
              {/* إحصائيات التصنيفات */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><Layers className="w-4 h-4" /></div>
                  <div className="dense-stat-number">45</div>
                  <div className="dense-stat-label">إجمالي التصنيفات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><Tag className="w-4 h-4" /></div>
                  <div className="dense-stat-number">234</div>
                  <div className="dense-stat-label">الوسوم النشطة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><FileText className="w-4 h-4" /></div>
                  <div className="dense-stat-number">2,847</div>
                  <div className="dense-stat-label">مقالات مُصنفة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><TrendingUp className="w-4 h-4" /></div>
                  <div className="dense-stat-number">+18%</div>
                  <div className="dense-stat-label">نمو هذا الشهر</div>
                </div>
              </div>

              {/* شجرة التصنيفات الرئيسية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Layers className="w-4 h-4" />شجرة التصنيفات</div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-primary"><Plus className="w-3 h-3" />إضافة تصنيف</Button>
                  </div>
                </div>
                <div className="dense-grid dense-grid-3">
                  {[
                    { id: 'CAT-001', name: 'تراخيص البناء', parent: null, count: 234, subcategories: 8, color: 'blue' },
                    { id: 'CAT-002', name: 'تصميم معماري', parent: null, count: 189, subcategories: 12, color: 'purple' },
                    { id: 'CAT-003', name: 'السلامة والأمان', parent: null, count: 156, subcategories: 6, color: 'red' },
                    { id: 'CAT-004', name: 'الاشتراطات الرسمية', parent: null, count: 298, subcategories: 15, color: 'green' },
                    { id: 'CAT-005', name: 'العقود والاتفاقيات', parent: null, count: 123, subcategories: 7, color: 'yellow' },
                    { id: 'CAT-006', name: 'المشاريع الهندسية', parent: null, count: 345, subcategories: 18, color: 'indigo' },
                  ].map((cat) => (
                    <div key={cat.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono">{cat.id}</code>
                        <Badge className={`bg-${cat.color}-100 text-${cat.color}-800`}>نشط</Badge>
                      </div>
                      <h4 className="compact-title mb-1">{cat.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1"><FileText className="w-3 h-3" /><span>{cat.count} مقال</span></div>
                        <div className="flex items-center gap-1"><Layers className="w-3 h-3" /><span>{cat.subcategories} فرعي</span></div>
                      </div>
                      <div className="flex items-center gap-1 mt-auto">
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Edit className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Eye className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Plus className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الوسوم الأكثر استخداماً */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Tag className="w-4 h-4" />الوسوم الشائعة</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['ترخيص', 'بناء', 'سكني', 'تجاري', 'تصميم', 'معماري', 'سلامة', 'حريق', 'إنشائي', 'كود', 'اشتراطات', 'دفاع مدني', 'أمانة', 'موافقة', 'شهادة', 'إتمام', 'فحص', 'مباني', 'فيلا', 'عمارة'].map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-blue-50 transition-colors">
                      <Tag className="w-3 h-3 ml-1" />{tag} ({Math.floor(Math.random() * 50) + 10})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-08: سير العمل والموافقات */}
          {activeTab === 'workflow' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><Workflow className="w-4 h-4" /></div><div className="dense-stat-number">23</div><div className="dense-stat-label">مسارات نشطة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">107</div><div className="dense-stat-label">في انتظار المراجعة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><CheckCircle className="w-4 h-4" /></div><div className="dense-stat-number">456</div><div className="dense-stat-label">تمت الموافقة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><XCircle className="w-4 h-4" /></div><div className="dense-stat-number">23</div><div className="dense-stat-label">مرفوضة</div></div>
              </div>

              {/* مسارات العمل النشطة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Workflow className="w-4 h-4" />مسارات العمل</div>
                  <Button size="sm" className="dense-btn dense-btn-primary"><Plus className="w-3 h-3" />إنشاء مسار</Button>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'WF-001', name: 'مراجعة ونشر المحتوى الجديد', steps: 4, current: 2, status: 'active', responsible: 'أحمد محمد', deadline: '2025-10-05' },
                    { id: 'WF-002', name: 'موافقة على الاشتراطات المحدثة', steps: 3, current: 3, status: 'completed', responsible: 'سارة علي', deadline: '2025-10-01' },
                    { id: 'WF-003', name: 'مراجعة التقارير الفنية', steps: 5, current: 1, status: 'pending', responsible: 'خالد أحمد', deadline: '2025-10-08' },
                  ].map((wf) => (
                    <div key={wf.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">{wf.id}</code>
                        <Badge className={wf.status === 'active' ? 'bg-blue-100 text-blue-800' : wf.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {wf.status === 'active' ? 'نشط' : wf.status === 'completed' ? 'مكتمل' : 'معلق'}
                        </Badge>
                      </div>
                      <h4 className="compact-title mb-2">{wf.name}</h4>
                      <div className="mb-2"><Progress value={(wf.current / wf.steps) * 100} className="h-2" /></div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                        <div>الخطوة: {wf.current}/{wf.steps}</div>
                        <div>المسؤول: {wf.responsible}</div>
                        <div>الموعد: {wf.deadline}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Eye className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Edit className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><CheckCircle className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-09: إصدارات المحتوى */}
          {activeTab === 'versions' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><GitBranch className="w-4 h-4" /></div><div className="dense-stat-number">1,234</div><div className="dense-stat-label">إجمالي الإصدارات</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">89</div><div className="dense-stat-label">محدثة اليوم</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><RefreshCw className="w-4 h-4" /></div><div className="dense-stat-number">23</div><div className="dense-stat-label">تم الاسترجاع</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Archive className="w-4 h-4" /></div><div className="dense-stat-number">345</div><div className="dense-stat-label">إصدارات مؤرشفة</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><GitBranch className="w-4 h-4" />سجل الإصدارات</div>
                </div>
                <div className="space-y-1">
                  {[
                    { version: 'v2.5', date: '2025-10-03 14:30', author: 'أحمد محمد', changes: 12, type: 'major', description: 'تحديث شامل للمحتوى' },
                    { version: 'v2.4', date: '2025-10-02 09:15', author: 'سارة علي', changes: 5, type: 'minor', description: 'تصحيح أخطاء إملائية' },
                    { version: 'v2.3', date: '2025-10-01 16:45', author: 'خالد أحمد', changes: 8, type: 'patch', description: 'إضافة أمثلة جديدة' },
                    { version: 'v2.2', date: '2025-09-30 11:20', author: 'منى حسن', changes: 15, type: 'major', description: 'إعادة هيكلة المحتوى' },
                  ].map((ver, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      <Badge className={ver.type === 'major' ? 'bg-red-100 text-red-800' : ver.type === 'minor' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {ver.version}
                      </Badge>
                      <div className="flex-1">
                        <div className="compact-title">{ver.description}</div>
                        <div className="compact-subtitle">{ver.author} • {ver.date} • {ver.changes} تغيير</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="dense-action-btn"><Eye className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn"><RefreshCw className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn"><Download className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-10: المراجعات والتعليقات */}
          {activeTab === 'reviews' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><MessageSquare className="w-4 h-4" /></div><div className="dense-stat-number">5,432</div><div className="dense-stat-label">إجمالي التعليقات</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Star className="w-4 h-4" /></div><div className="dense-stat-number">4.7</div><div className="dense-stat-label">متوسط التقييم</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><ThumbsUp className="w-4 h-4" /></div><div className="dense-stat-number">3,245</div><div className="dense-stat-label">تقييمات إيجابية</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Flag className="w-4 h-4" /></div><div className="dense-stat-number">12</div><div className="dense-stat-label">محتوى مبلّغ عنه</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><MessageSquare className="w-4 h-4" />التعليقات الأخيرة</div>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 1, user: 'أحمد محمد علي', rating: 5, comment: 'محتوى ممتاز ومفيد جداً، ساعدني كثيراً في إنجاز المعاملة', date: '2025-10-03 10:30', article: 'دليل الحصول على ترخيص البناء' },
                    { id: 2, user: 'سارة أحمد حسن', rating: 4, comment: 'معلومات قيمة لكن تحتاج لمزيد من الأمثلة العملية', date: '2025-10-02 14:15', article: 'متطلبات التصميم المعماري' },
                    { id: 3, user: 'خالد علي محمود', rating: 5, comment: 'شرح واضح ومفصل، شكراً للجهود المبذولة', date: '2025-10-01 09:45', article: 'اشتراطات السلامة من الحريق' },
                  ].map((review) => (
                    <div key={review.id} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="compact-title">{review.user}</div>
                            <div className="compact-subtitle">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">{review.article}</span>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="dense-action-btn"><ThumbsUp className="w-3 h-3" /></Button>
                          <Button size="sm" variant="ghost" className="dense-action-btn"><Flag className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-11: المشاركة والتعاون */}
          {activeTab === 'sharing' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><Share2 className="w-4 h-4" /></div><div className="dense-stat-number">2,345</div><div className="dense-stat-label">مشاركات داخلية</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><ExternalLink className="w-4 h-4" /></div><div className="dense-stat-number">567</div><div className="dense-stat-label">مشاركات خارجية</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Users className="w-4 h-4" /></div><div className="dense-stat-number">87</div><div className="dense-stat-label">متعاونون نشطون</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Edit className="w-4 h-4" /></div><div className="dense-stat-number">234</div><div className="dense-stat-label">تعديلات تعاونية</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Users className="w-4 h-4" />المساهمون النشطون</div>
                </div>
                <div className="dense-grid dense-grid-4">
                  {[
                    { name: 'أحمد محمد علي', role: 'محرر رئيسي', contributions: 234, avatar: 'أ' },
                    { name: 'سارة أحمد حسن', role: 'مراجع فني', contributions: 189, avatar: 'س' },
                    { name: 'خالد علي محمود', role: 'كاتب محتوى', contributions: 156, avatar: 'خ' },
                    { name: 'منى حسن علي', role: 'مدقق لغوي', contributions: 123, avatar: 'م' },
                  ].map((contributor, idx) => (
                    <div key={idx} className="dense-content-card text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">{contributor.avatar}</div>
                      <h4 className="compact-title mb-1">{contributor.name}</h4>
                      <p className="compact-subtitle mb-1">{contributor.role}</p>
                      <p className="text-xs text-blue-600">{contributor.contributions} مساهمة</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-14: التحليلات المتقدمة */}
          {activeTab === 'analytics' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><BarChart3 className="w-4 h-4" /></div><div className="dense-stat-number">145,678</div><div className="dense-stat-label">إجمالي المشاهدات</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><TrendingUp className="w-4 h-4" /></div><div className="dense-stat-number">+23%</div><div className="dense-stat-label">نمو المشاهدات</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Users className="w-4 h-4" /></div><div className="dense-stat-number">12,345</div><div className="dense-stat-label">مستخدمون فريدون</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">4.5 دقيقة</div><div className="dense-stat-label">متوسط وقت القراءة</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><BarChart3 className="w-4 h-4" />المحتوى الأكثر مشاهدة</div>
                </div>
                <div className="space-y-1">
                  {[
                    { rank: 1, title: 'دليل الحصول على ترخيص البناء السكني', views: 12345, trend: '+15%' },
                    { rank: 2, title: 'متطلبات التصميم المعماري للمباني التجارية', views: 9876, trend: '+12%' },
                    { rank: 3, title: 'اشتراطات السلامة من الحريق', views: 7654, trend: '+8%' },
                    { rank: 4, title: 'دليل شهادة إتمام البناء', views: 5432, trend: '+5%' },
                    { rank: 5, title: 'الكود السعودي للبناء السكني', views: 4321, trend: '+3%' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">{item.rank}</div>
                      <div className="flex-1">
                        <div className="compact-title">{item.title}</div>
                        <div className="compact-subtitle">{item.views.toLocaleString()} مشاهدة</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{item.trend}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-15: الذكاء الاصطناعي */}
          {activeTab === 'ai' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><Brain className="w-4 h-4" /></div><div className="dense-stat-number">98.5%</div><div className="dense-stat-label">دقة التصنيف</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Sparkles className="w-4 h-4" /></div><div className="dense-stat-number">2,345</div><div className="dense-stat-label">توصيات ذكية</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Zap className="w-4 h-4" /></div><div className="dense-stat-number">0.3 ثانية</div><div className="dense-stat-label">وقت الاستجابة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Award className="w-4 h-4" /></div><div className="dense-stat-number">95%</div><div className="dense-stat-label">رضا المستخدمين</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Brain className="w-4 h-4" />مساعد المعرفة الذكي</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="compact-title text-blue-900">مساعد AI متاح</h4>
                      <p className="compact-subtitle text-blue-700">اسألني أي سؤال عن قاعدة المعرفة</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="اكتب سؤالك هنا..." className="dense-form-input bg-white" />
                    <Button className="dense-btn dense-btn-primary w-full"><Send className="w-3 h-3" />إرسال</Button>
                  </div>
                </div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Sparkles className="w-4 h-4" />التوصيات الذكية</div>
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'محتوى ذو صلة: اشتراطات البناء الحديثة', relevance: 95 },
                    { title: 'يُنصح بالقراءة: تحديثات الكود السعودي 2025', relevance: 88 },
                    { title: 'مقالات مشابهة: متطلبات السلامة في المباني', relevance: 82 },
                  ].map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1">
                        <div className="compact-title">{rec.title}</div>
                        <Progress value={rec.relevance} className="h-1 mt-1" />
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">{rec.relevance}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-16: التكامل مع الأنظمة */}
          {activeTab === 'integration' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><Zap className="w-4 h-4" /></div><div className="dense-stat-number">12</div><div className="dense-stat-label">أنظمة متصلة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><CheckCircle className="w-4 h-4" /></div><div className="dense-stat-number">99.8%</div><div className="dense-stat-label">نسبة التوفر</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><RefreshCw className="w-4 h-4" /></div><div className="dense-stat-number">2,345</div><div className="dense-stat-label">عمليات متزامنة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">0.5 ثانية</div><div className="dense-stat-label">زمن الاستجابة</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Zap className="w-4 h-4" />التكاملات النشطة</div>
                  <Button size="sm" className="dense-btn dense-btn-primary"><Plus className="w-3 h-3" />إضافة تكامل</Button>
                </div>
                <div className="dense-grid dense-grid-3">
                  {[
                    { name: 'نظام إدارة المعاملات', status: 'متصل', lastSync: '2025-10-03 10:30', records: 2847 },
                    { name: 'نظام إدارة المستندات', status: 'متصل', lastSync: '2025-10-03 10:25', records: 5432 },
                    { name: 'نظام المشاريع الهندسية', status: 'متصل', lastSync: '2025-10-03 10:20', records: 1234 },
                    { name: 'نظام إدارة العملاء', status: 'غير متصل', lastSync: '2025-10-02 14:30', records: 890 },
                    { name: 'نظام التقارير', status: 'متصل', lastSync: '2025-10-03 10:15', records: 456 },
                    { name: 'منصة التدريب', status: 'متصل', lastSync: '2025-10-03 10:10', records: 234 },
                  ].map((int, idx) => (
                    <div key={idx} className="dense-content-card">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="compact-title flex-1">{int.name}</h4>
                        <Badge className={int.status === 'متصل' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {int.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600 mb-2">
                        <div>آخر مزامنة: {int.lastSync}</div>
                        <div>السجلات: {int.records.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><RefreshCw className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Settings className="w-3 h-3" /></Button>
                        <Button size="sm" variant="ghost" className="dense-action-btn flex-1"><Eye className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-17: الإشعارات والتنبيهات */}
          {activeTab === 'notifications' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><Bell className="w-4 h-4" /></div><div className="dense-stat-number">234</div><div className="dense-stat-label">إشعارات نشطة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><AlertCircle className="w-4 h-4" /></div><div className="dense-stat-number">12</div><div className="dense-stat-label">تنبيهات عاجلة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">45</div><div className="dense-stat-label">تذكيرات معلقة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><CheckCircle className="w-4 h-4" /></div><div className="dense-stat-number">1,234</div><div className="dense-stat-label">تم قراءتها</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Bell className="w-4 h-4" />الإشعارات الأخيرة</div>
                  <Button size="sm" className="dense-btn dense-btn-secondary">تحديد الكل كمقروء</Button>
                </div>
                <div className="space-y-2">
                  {[
                    { type: 'urgent', title: 'اشتراط ينتهي قريباً', message: 'اشتراطات السلامة تنتهي خلال 15 يوم', time: 'منذ 5 دقائق', read: false },
                    { type: 'info', title: 'محتوى جديد', message: 'تم إضافة 3 مقالات جديدة في قسم التراخيص', time: 'منذ ساعة', read: false },
                    { type: 'success', title: 'موافقة على المحتوى', message: 'تمت الموافقة على مقالك: دليل البناء السكني', time: 'منذ ساعتين', read: true },
                    { type: 'warning', title: 'مراجعة مطلوبة', message: 'يرجى مراجعة التعليقات على مقال الاشتراطات', time: 'منذ 3 ساعات', read: false },
                  ].map((notif, idx) => (
                    <div key={idx} className={`dense-content-card ${!notif.read ? 'border-l-4 border-blue-500' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notif.type === 'urgent' ? 'bg-red-100 text-red-600' :
                          notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          notif.type === 'success' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="compact-title mb-1">{notif.title}</h4>
                          <p className="compact-subtitle mb-1">{notif.message}</p>
                          <span className="text-xs text-gray-500">{notif.time}</span>
                        </div>
                        {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-18: الصلاحيات والأمان */}
          {activeTab === 'permissions' && (
            <div className="dense-layout">
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  يحتوي النظام على {permissions.length} صلاحية متخصصة لإدارة قاعدة المعرفة
                </AlertDescription>
              </Alert>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Shield className="w-4 h-4" />
                    الصلاحيات المتاحة
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    صلاحيات الوصول
                  </h3>
                  <div className="dense-grid dense-grid-2">
                    {permissions.filter(p => p.category === 'access').map((perm) => (
                      <div key={perm.id} className="dense-content-card">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="compact-title">{perm.name}</h4>
                            <p className="compact-subtitle font-mono">{perm.code}</p>
                          </div>
                          <Badge variant={perm.level === 'basic' ? 'default' : 'destructive'} className="text-xs">
                            {perm.level === 'basic' ? 'أساسي' : 'إداري'}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="dense-btn dense-btn-secondary w-full mt-2"
                          onClick={() => {
                            setSelectedPermission(perm.code);
                            setShowPermissionDialog(true);
                          }}
                        >
                          <Key className="w-3 h-3" />
                          طلب الصلاحية
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    صلاحيات المحتوى
                  </h3>
                  <div className="dense-grid dense-grid-3">
                    {permissions.filter(p => p.category === 'content').map((perm) => (
                      <div key={perm.id} className="dense-content-card">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="compact-title">{perm.name}</h4>
                            <p className="compact-subtitle font-mono">{perm.code}</p>
                          </div>
                          <Badge
                            variant={perm.level === 'critical' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {perm.level === 'critical' ? 'حرج' : perm.level === 'administrative' ? 'إداري' : 'متقدم'}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="dense-btn dense-btn-secondary w-full mt-2"
                          onClick={() => {
                            setSelectedPermission(perm.code);
                            setShowPermissionDialog(true);
                          }}
                        >
                          <Key className="w-3 h-3" />
                          طلب
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 ml-2" />
                    عرض جميع الصلاحيات ({permissions.length})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-19: الإعدادات المتقدمة */}
          {activeTab === 'settings' && (
            <div className="dense-layout">
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Settings className="w-4 h-4" />إعدادات عامة</div>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'تفعيل البحث الذكي', description: 'استخدام الذكاء الاصطناعي في البحث', enabled: true },
                    { title: 'الموافقة التلقائية', description: 'الموافقة تلقائياً على المحتوى من المحررين الموثوقين', enabled: false },
                    { title: 'الإشعارات الفور��ة', description: 'إرسال إشعارات فورية للتحديثات المهمة', enabled: true },
                    { title: 'النسخ الاحتياطي التلقائي', description: 'إنشاء نسخة احتياطية يومية للمحتوى', enabled: true },
                    { title: 'التصنيف التلقائي', description: 'تصنيف المحتوى تلقائياً بواسطة AI', enabled: true },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="compact-title mb-1">{setting.title}</h4>
                        <p className="compact-subtitle">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><Shield className="w-4 h-4" />إعدادات الأمان</div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <label className="dense-form-label">مستوى الأمان</label>
                      <select className="dense-form-select" defaultValue="عالي">
                        <option>عادي</option>
                        <option>متوسط</option>
                        <option>عالي</option>
                        <option>حرج</option>
                      </select>
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">فترة انتهاء الجلسة (دقيقة)</label>
                      <input type="number" className="dense-form-input" defaultValue="30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-20: سجل الأنشطة */}
          {activeTab === 'activity-log' && (
            <div className="dense-layout">
              <div className="dense-stats-grid">
                <div className="dense-stat-card"><div className="dense-stat-icon"><History className="w-4 h-4" /></div><div className="dense-stat-number">12,345</div><div className="dense-stat-label">إجمالي الأنشطة</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Clock className="w-4 h-4" /></div><div className="dense-stat-number">234</div><div className="dense-stat-label">نشطة اليوم</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><Users className="w-4 h-4" /></div><div className="dense-stat-number">87</div><div className="dense-stat-label">مستخدمون نشطون</div></div>
                <div className="dense-stat-card"><div className="dense-stat-icon"><AlertCircle className="w-4 h-4" /></div><div className="dense-stat-number">3</div><div className="dense-stat-label">أنشطة مشبوهة</div></div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title"><History className="w-4 h-4" />سجل الأنشطة الأخير</div>
                  <div className="dense-section-actions">
                    <Button size="sm" className="dense-btn dense-btn-secondary"><Filter className="w-3 h-3" />فلترة</Button>
                    <Button size="sm" className="dense-btn dense-btn-secondary"><Download className="w-3 h-3" />تصدير</Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { user: 'أحمد محمد علي', action: 'إضافة محتوى جديد', target: 'دليل البناء السكني', time: '2025-10-03 14:30:25', type: 'create', ip: '192.168.1.100' },
                    { user: 'سارة أحمد حسن', action: 'تعديل محتوى', target: 'متطلبات التصميم', time: '2025-10-03 14:25:10', type: 'edit', ip: '192.168.1.101' },
                    { user: 'خالد علي محمود', action: 'حذف تعليق', target: 'تعليق #1234', time: '2025-10-03 14:20:45', type: 'delete', ip: '192.168.1.102' },
                    { user: 'منى حسن علي', action: 'الموافقة على محتوى', target: 'اشتراطات السلامة', time: '2025-10-03 14:15:30', type: 'approve', ip: '192.168.1.103' },
                    { user: 'فهد محمد سعيد', action: 'تحميل ملف', target: 'الكود السعودي.pdf', time: '2025-10-03 14:10:15', type: 'download', ip: '192.168.1.104' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'create' ? 'bg-green-500' :
                        log.type === 'edit' ? 'bg-blue-500' :
                        log.type === 'delete' ? 'bg-red-500' :
                        log.type === 'approve' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="compact-title">{log.user} - {log.action}</div>
                        <div className="compact-subtitle">الهدف: {log.target} • الوقت: {log.time} • IP: {log.ip}</div>
                      </div>
                      <Button size="sm" variant="ghost" className="dense-action-btn"><Eye className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-02: إضافة محتوى جديد */}
          {activeTab === 'add-content' && (
            <div className="dense-layout">
              {/* نموذج إضافة محتوى */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Plus className="w-4 h-4" />
                    إنشاء محتوى جديد
                  </div>
                </div>
                <div className="dense-form">
                  <div className="dense-form-group">
                    <label className="dense-form-label">عنوان المحتوى *</label>
                    <input type="text" className="dense-form-input" placeholder="أدخل عنوان المحتوى..." />
                  </div>

                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <label className="dense-form-label">التصنيف الرئيسي *</label>
                      <select className="dense-form-select">
                        <option>اختر التصنيف</option>
                        <option>تراخيص البناء</option>
                        <option>تصميم معماري</option>
                        <option>السلامة والأمان</option>
                        <option>الاشتراطات الرسمية</option>
                        <option>العقود والاتفاقيات</option>
                        <option>المشاريع الهندسية</option>
                      </select>
                    </div>

                    <div className="dense-form-group">
                      <label className="dense-form-label">التصنيف الفرعي</label>
                      <select className="dense-form-select">
                        <option>اختر التصنيف الفرعي</option>
                        <option>سكني</option>
                        <option>تجاري</option>
                        <option>صناعي</option>
                        <option>إداري</option>
                      </select>
                    </div>

                    <div className="dense-form-group">
                      <label className="dense-form-label">حالة المحتوى *</label>
                      <select className="dense-form-select">
                        <option>مسودة</option>
                        <option>قيد المراجعة</option>
                        <option>جاهز للنشر</option>
                        <option>منشور</option>
                      </select>
                    </div>

                    <div className="dense-form-group">
                      <label className="dense-form-label">مستوى الأهمية</label>
                      <select className="dense-form-select">
                        <option>عادي</option>
                        <option>مهم</option>
                        <option>عاجل</option>
                        <option>حرج</option>
                      </select>
                    </div>
                  </div>

                  <div className="dense-form-group">
                    <label className="dense-form-label">الوسوم (Tags)</label>
                    <input type="text" className="dense-form-input" placeholder="أدخل الوسوم مفصولة بفاصلة..." />
                    <p className="compact-subtitle mt-1">مثال: ترخيص، بناء، سكني، تصميم</p>
                  </div>

                  <div className="dense-form-group">
                    <label className="dense-form-label">الملخص القصير *</label>
                    <textarea className="dense-form-textarea" rows={3} placeholder="ملخص مختصر للمحتوى (100-200 كلمة)..."></textarea>
                  </div>

                  <div className="dense-form-group">
                    <label className="dense-form-label">المحتوى الكامل *</label>
                    <textarea className="dense-form-textarea" rows={10} style={{ minHeight: '240px' }} placeholder="اكتب المحتوى الكامل هنا..."></textarea>
                  </div>

                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <label className="dense-form-label">المؤلف</label>
                      <input type="text" className="dense-form-input" defaultValue="أحمد محمد العلي" disabled />
                    </div>

                    <div className="dense-form-group">
                      <label className="dense-form-label">تاريخ النشر</label>
                      <input type="date" className="dense-form-input" defaultValue="2025-10-06" />
                    </div>

                    <div className="dense-form-group">
                      <label className="dense-form-label">تاريخ الانتهاء (اختياري)</label>
                      <input type="date" className="dense-form-input" />
                    </div>
                  </div>
                </div>
              </div>

              {/* المرفقات والملفات */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Upload className="w-4 h-4" />
                    المرفقات والملفات
                  </div>
                </div>
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="compact-title mb-1">اسحب الملفات هنا أو انقر للتحميل</p>
                  <p className="compact-subtitle">يدعم: PDF، Word، Excel، الصور (أقصى حجم: 10MB)</p>
                  <Button size="sm" className="dense-btn dense-btn-primary mt-3">
                    <Upload className="w-3 h-3" />
                    تحميل ملفات
                  </Button>
                </div>
              </div>

              {/* الروابط ذات الصلة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Link className="w-4 h-4" />
                    الروابط ذات الصلة
                  </div>
                  <Button size="sm" className="dense-btn dense-btn-secondary">
                    <Plus className="w-3 h-3" />
                    إضافة رابط
                  </Button>
                </div>
                <div className="dense-form">
                  <div className="dense-form-row">
                    <div className="dense-form-group">
                      <label className="dense-form-label">ربط بمعاملة</label>
                      <input type="text" className="dense-form-input" placeholder="رقم المعاملة..." />
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">ربط بمشروع</label>
                      <input type="text" className="dense-form-input" placeholder="رقم المشروع..." />
                    </div>
                    <div className="dense-form-group">
                      <label className="dense-form-label">ربط بعميل</label>
                      <input type="text" className="dense-form-input" placeholder="اسم أو رقم العميل..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* إعدادات النشر */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Settings className="w-4 h-4" />
                    إعدادات النشر
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">السماح بالتعليقات</h4>
                      <p className="compact-subtitle">السماح للمستخدمين بإضافة تعليقات</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">إرسال إشعارات</h4>
                      <p className="compact-subtitle">إشعار المشتركين عند النشر</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">إنشاء إصدار جديد</h4>
                      <p className="compact-subtitle">حفظ كإصدار منفصل</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="compact-title mb-1">محتوى مميز</h4>
                      <p className="compact-subtitle">عرض في الصفحة الرئيسية</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" className="button-rtl">
                  <XCircle className="w-4 h-4" />
                  إلغاء
                </Button>
                <Button variant="outline" className="button-rtl">
                  <Save className="w-4 h-4" />
                  حفظ كمسودة
                </Button>
                <Button variant="outline" className="button-rtl">
                  <Eye className="w-4 h-4" />
                  معاينة
                </Button>
                <Button className="button-rtl btn-primary">
                  <Send className="w-4 h-4" />
                  نشر المحتوى
                </Button>
              </div>
            </div>
          )}

          {/* تاب 734-03: قائمة المحتويات */}
          {activeTab === 'content-list' && (
            <div className="dense-layout">
              {/* إحصائيات المحتوى */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><FileText className="w-4 h-4" /></div>
                  <div className="dense-stat-number">2,847</div>
                  <div className="dense-stat-label">إجمالي المقالات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><CheckCircle className="w-4 h-4" /></div>
                  <div className="dense-stat-number">2,456</div>
                  <div className="dense-stat-label">منشورة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><Clock className="w-4 h-4" /></div>
                  <div className="dense-stat-number">284</div>
                  <div className="dense-stat-label">مسودات</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><AlertCircle className="w-4 h-4" /></div>
                  <div className="dense-stat-number">107</div>
                  <div className="dense-stat-label">قيد المراجعة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><Archive className="w-4 h-4" /></div>
                  <div className="dense-stat-number">234</div>
                  <div className="dense-stat-label">مؤرشفة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon"><Star className="w-4 h-4" /></div>
                  <div className="dense-stat-number">4.7</div>
                  <div className="dense-stat-label">متوسط التقييم</div>
                </div>
              </div>

              {/* أدوات البحث والفلترة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Filter className="w-4 h-4" />
                    أدوات البحث والفلترة
                  </div>
                  <Button size="sm" className="dense-btn dense-btn-primary">
                    <Plus className="w-3 h-3" />
                    إضافة محتوى جديد
                  </Button>
                </div>
                <div className="dense-form-row">
                  <div className="dense-form-group">
                    <label className="dense-form-label">البحث النصي</label>
                    <input type="text" className="dense-form-input" placeholder="ابحث عن محتوى..." />
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">الحالة</label>
                    <select className="dense-form-select">
                      <option>جميع الحالات</option>
                      <option>منشور</option>
                      <option>مسودة</option>
                      <option>قيد المراجعة</option>
                      <option>مؤرشف</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">التصنيف</label>
                    <select className="dense-form-select">
                      <option>جميع التصنيفات</option>
                      <option>تراخيص البناء</option>
                      <option>تصميم معماري</option>
                      <option>السلامة</option>
                      <option>الاشتراطات</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">المؤلف</label>
                    <select className="dense-form-select">
                      <option>جميع المؤلفين</option>
                      <option>أحمد محمد</option>
                      <option>سارة أحمد</option>
                      <option>خالد علي</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">فترة النشر</label>
                    <select className="dense-form-select">
                      <option>جميع الفترات</option>
                      <option>اليوم</option>
                      <option>آخر 7 أيام</option>
                      <option>آخر 30 يوم</option>
                      <option>آخر 3 أشهر</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">الترتيب</label>
                    <select className="dense-form-select">
                      <option>الأحدث أولاً</option>
                      <option>الأقدم أولاً</option>
                      <option>الأكثر مشاهدة</option>
                      <option>الأعلى تقييماً</option>
                      <option>الأبجدي (أ-ي)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* جدول المحتويات */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Database className="w-4 h-4" />
                    جميع المحتويات
                  </div>
                  <div className="dense-section-actions">
                    <Button size="sm" variant="outline" className="dense-btn dense-btn-secondary">
                      <Download className="w-3 h-3" />
                      تصدير
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <input type="checkbox" className="w-4 h-4" />
                        </TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المؤلف</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاهدات</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقييم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: 'KB-001', title: 'دليل شامل للحصول على ترخيص البناء السكني', category: 'تراخيص البناء', author: 'أحمد محمد', status: 'published', views: 1234, rating: 4.8, date: '2025-10-01', version: '2.1' },
                        { id: 'KB-002', title: 'متطلبات التصميم المعماري للمباني التجارية', category: 'تصميم معماري', author: 'سارة أحمد', status: 'review', views: 856, rating: 4.6, date: '2025-09-30', version: '1.5' },
                        { id: 'KB-003', title: 'اشتراطات السلامة من الحريق للمباني', category: 'السلامة', author: 'خالد علي', status: 'draft', views: 423, rating: 4.5, date: '2025-09-28', version: '1.0' },
                        { id: 'KB-004', title: 'دليل شهادة إتمام البناء والإجراءات', category: 'تراخيص البناء', author: 'منى حسن', status: 'published', views: 945, rating: 4.7, date: '2025-09-25', version: '1.3' },
                        { id: 'KB-005', title: 'الكود السعودي للبناء السكني - النسخة الكاملة', category: 'الاشتراطات', author: 'فهد سعيد', status: 'published', views: 2134, rating: 4.9, date: '2025-09-20', version: '3.2' },
                        { id: 'KB-006', title: 'متطلبات الإنشاء الخرساني للمباني العالية', category: 'تصميم معماري', author: 'عبدالله محمود', status: 'review', views: 678, rating: 4.4, date: '2025-09-18', version: '1.2' },
                        { id: 'KB-007', title: 'دليل فحص واستلام المباني السكنية', category: 'تراخيص البناء', author: 'أحمد محمد', status: 'published', views: 1098, rating: 4.6, date: '2025-09-15', version: '2.0' },
                        { id: 'KB-008', title: 'اشتراطات الدفاع المدني للمباني التجارية', category: 'السلامة', author: 'سارة أحمد', status: 'draft', views: 234, rating: 4.3, date: '2025-09-10', version: '1.0' },
                      ].map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="text-right">
                            <input type="checkbox" className="w-4 h-4" />
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">{article.id}</code>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="compact-title">{article.title}</div>
                            <div className="compact-subtitle">الإصدار {article.version}</div>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge variant="outline">{article.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{article.author}</TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <Badge className={
                              article.status === 'published' ? 'bg-green-100 text-green-800' :
                              article.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {article.status === 'published' ? 'منشور' : article.status === 'review' ? 'مراجعة' : 'مسودة'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-gray-500" />
                              <span>{article.views}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{article.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{article.date}</TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="dense-action-btn">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="dense-action-btn">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="dense-action-btn">
                                <Share2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="dense-action-btn">
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* pagination */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">عرض 1-8 من 2,847 مقالة</div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="dense-btn">السابق</Button>
                    <Button size="sm" variant="outline" className="dense-btn dense-btn-primary">1</Button>
                    <Button size="sm" variant="outline" className="dense-btn">2</Button>
                    <Button size="sm" variant="outline" className="dense-btn">3</Button>
                    <span className="text-xs px-2">...</span>
                    <Button size="sm" variant="outline" className="dense-btn">356</Button>
                    <Button size="sm" variant="outline" className="dense-btn">التالي</Button>
                  </div>
                </div>
              </div>

              {/* إجراءات جماعية */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Settings className="w-4 h-4" />
                    إجراءات جماعية
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="dense-btn dense-btn-secondary">
                    <CheckCircle className="w-3 h-3" />
                    نشر المحدد
                  </Button>
                  <Button size="sm" className="dense-btn dense-btn-secondary">
                    <Archive className="w-3 h-3" />
                    أرشفة المحدد
                  </Button>
                  <Button size="sm" className="dense-btn dense-btn-secondary">
                    <Copy className="w-3 h-3" />
                    نسخ المحدد
                  </Button>
                  <Button size="sm" className="dense-btn dense-btn-secondary">
                    <Download className="w-3 h-3" />
                    تصدير ��لمحدد
                  </Button>
                  <Button size="sm" variant="destructive" className="dense-btn">
                    <Trash2 className="w-3 h-3" />
                    حذف المحدد
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* تاب 734-04: البحث الذكي المتقدم */}
          {activeTab === 'smart-search' && (
            <div className="dense-layout">
              {/* شريط البحث الذكي */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Brain className="w-4 h-4" />
                    البحث الذكي المدعوم بالذكاء الاصطناعي
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-blue-900 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        البحث الذكي في قاعدة المعرفة
                      </h3>
                      <p className="text-xs text-blue-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اكتب سؤالك بلغة طبيعية، وسيقوم الذكاء الاصطناعي بالبحث عن أفضل الإجابات
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="اكتب سؤالك هنا... (مثال: كيف أحصل على ترخيص بناء سكني في الرياض؟)"
                      className="flex-1 dense-form-input bg-white h-12"
                    />
                    <Button className="btn-primary h-12 px-6">
                      <Search className="w-4 h-4 ml-2" />
                      بحث ذكي
                    </Button>
                  </div>
                </div>
              </div>

              {/* أمثلة بحث سريعة */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Sparkles className="w-4 h-4" />
                    أسئلة مقترحة
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'ما هي متطلبات الحصول على ترخيص بناء سكني؟',
                    'كيف أقدم طلب شهادة إتمام بناء؟',
                    'ما هي اشتراطات السلامة من الحريق للمباني التجارية؟',
                    'ما هو الكود السعودي للبناء السكني؟',
                    'كيف أحسب المساحة البنائية المسموحة؟',
                    'ما هي رسوم ترخيص البناء في الرياض؟',
                  ].map((question, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700">{question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* نتائج البحث */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Search className="w-4 h-4" />
                    نتائج البحث
                  </div>
                  <div className="text-xs text-gray-600">تم العثور على 45 نتيجة خلال 0.23 ثانية</div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'KB-001',
                      title: 'دليل شامل للحصول على ترخيص البناء السكني',
                      excerpt: 'يشرح هذا الدليل جميع الخطوات والمتطلبات اللازمة للحصول على ترخيص بناء سكني في المملكة العربية السعودية...',
                      category: 'تراخيص البناء',
                      relevance: 98,
                      views: 1234,
                      rating: 4.8,
                      lastUpdated: '2025-10-01',
                    },
                    {
                      id: 'KB-004',
                      title: 'دليل شهادة إتمام البناء والإجراءات',
                      excerpt: 'معلومات كاملة عن كيفية الحصول على شهادة إتمام البناء وجميع المستندات المطلوبة والإجراءات...',
                      category: 'تراخيص البناء',
                      relevance: 92,
                      views: 945,
                      rating: 4.7,
                      lastUpdated: '2025-09-25',
                    },
                    {
                      id: 'KB-005',
                      title: 'الكود السعودي للبناء السكني - النسخة الكاملة',
                      excerpt: 'النص الكامل للكود السعودي للبناء السكني مع شرح تفصيلي لجميع الاشتراطات والمتطلبات الفنية...',
                      category: 'الاشتراطات',
                      relevance: 88,
                      views: 2134,
                      rating: 4.9,
                      lastUpdated: '2025-09-20',
                    },
                  ].map((result) => (
                    <div key={result.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">{result.id}</code>
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              <Target className="w-3 h-3 ml-1" />
                              {result.relevance}% ملاءمة
                            </Badge>
                            <Badge variant="outline" className="text-xs">{result.category}</Badge>
                          </div>
                          <h3 className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {result.title}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{result.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{result.views} مشاهدة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{result.rating} تقييم</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>آخر تحديث: {result.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="ghost" className="dense-action-btn">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="dense-action-btn">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="dense-action-btn">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* pagination */}
                <div className="flex items-center justify-center pt-4 mt-4 border-t border-gray-200 gap-1">
                  <Button size="sm" variant="outline" className="dense-btn">السابق</Button>
                  <Button size="sm" variant="outline" className="dense-btn dense-btn-primary">1</Button>
                  <Button size="sm" variant="outline" className="dense-btn">2</Button>
                  <Button size="sm" variant="outline" className="dense-btn">3</Button>
                  <span className="text-xs px-2">...</span>
                  <Button size="sm" variant="outline" className="dense-btn">6</Button>
                  <Button size="sm" variant="outline" className="dense-btn">التالي</Button>
                </div>
              </div>

              {/* فلاتر البحث المتقدم */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Filter className="w-4 h-4" />
                    فلاتر البحث المتقدم
                  </div>
                </div>
                <div className="dense-form-row">
                  <div className="dense-form-group">
                    <label className="dense-form-label">نوع المحتوى</label>
                    <select className="dense-form-select">
                      <option>جميع الأنواع</option>
                      <option>مقالات</option>
                      <option>أدلة</option>
                      <option>اشتراطات</option>
                      <option>فيديوهات</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">التصنيف</label>
                    <select className="dense-form-select">
                      <option>جميع التصنيفات</option>
                      <option>تراخيص البناء</option>
                      <option>تصميم معماري</option>
                      <option>السلامة</option>
                      <option>الاشتراطات</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">الفترة الزمنية</label>
                    <select className="dense-form-select">
                      <option>كل الأوقات</option>
                      <option>آخر أسبوع</option>
                      <option>آخر شهر</option>
                      <option>آخر سنة</option>
                    </select>
                  </div>
                  <div className="dense-form-group">
                    <label className="dense-form-label">الترتيب</label>
                    <select className="dense-form-select">
                      <option>الأكثر ملاءمة</option>
                      <option>الأحدث</option>
                      <option>الأكثر مشاهدة</option>
                      <option>الأعلى تقييماً</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* بحث متقدم ببولين */}
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Code2 className="w-4 h-4" />
                    البحث المتقدم (Boolean)
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="compact-subtitle mb-3">استخدم عوامل البحث المنطقية للبحث الدقيق:</p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">AND</Badge>
                        <span className="text-xs">و</span>
                      </div>
                      <p className="text-xs text-gray-600">ترخيص AND بناء</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-800 text-xs">OR</Badge>
                        <span className="text-xs">أو</span>
                      </div>
                      <p className="text-xs text-gray-600">سكني OR تجاري</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-100 text-red-800 text-xs">NOT</Badge>
                        <span className="text-xs">ليس</span>
                      </div>
                      <p className="text-xs text-gray-600">بناء NOT صناعي</p>
                    </div>
                  </div>
                  <Input className="dense-form-input bg-white" placeholder='مثال: ترخيص AND (سكني OR تجاري) NOT صناعي' />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* نافذة تفاصيل الإحصائيات */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="dialog-rtl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedStatType === 'totalArticles' && 'تفاصيل إجمالي المقالات'}
              {selectedStatType === 'publishedArticles' && 'تفاصيل المقالات المنشورة'}
              {selectedStatType === 'pendingReview' && 'تفاصيل المقالات قيد المراجعة'}
              {selectedStatType === 'totalViews' && 'تفاصيل المشاهدات'}
              {selectedStatType === 'totalDownloads' && 'تفاصيل التنزيلات'}
              {selectedStatType === 'totalContributors' && 'تفاصيل المساهمين'}
            </DialogTitle>
            <DialogDescription>
              بيانات تفصيلية وإحصائيات شاملة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* إحصائيات شاملة */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedStatType === 'totalArticles' ? '2,847' :
                   selectedStatType === 'publishedArticles' ? '2,456' :
                   selectedStatType === 'pendingReview' ? '107' :
                   selectedStatType === 'totalViews' ? '145,678' :
                   selectedStatType === 'totalDownloads' ? '34,521' : '87'}
                </div>
                <div className="text-xs text-gray-600 mt-1">الإجمالي</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">+{Math.floor(Math.random() * 100 + 50)}</div>
                <div className="text-xs text-gray-600 mt-1">هذا الشهر</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">+{Math.floor(Math.random() * 30 + 10)}</div>
                <div className="text-xs text-gray-600 mt-1">هذا الأسبوع</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">+{Math.floor(Math.random() * 10 + 5)}</div>
                <div className="text-xs text-gray-600 mt-1">اليوم</div>
              </div>
            </div>

            {/* جدول تفصيلي */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">المؤلف</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">القيمة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-right">مقال تجريبي رقم {i + 1}</TableCell>
                      <TableCell className="text-right">تراخيص البناء</TableCell>
                      <TableCell className="text-right">أحمد محمد</TableCell>
                      <TableCell className="text-right">2025-10-{String(i + 1).padStart(2, '0')}</TableCell>
                      <TableCell className="text-right">{Math.floor(Math.random() * 1000 + 100)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* رسم بياني بسيط */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">الاتجاه الزمني</h4>
              <div className="h-32 flex items-end justify-around gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all hover:from-blue-600 hover:to-purple-600"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatsDialog(false)}>
              إغلاق
            </Button>
            <Button>
              <Download className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل المقال */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="dialog-rtl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              {selectedArticle?.id} • الإصدار {selectedArticle?.version}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* معلومات المقال */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold">المؤلف</span>
                </div>
                <p className="text-sm text-gray-700">{selectedArticle?.author}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold">التصنيف</span>
                </div>
                <p className="text-sm text-gray-700">{selectedArticle?.category}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold">المشاهدات</span>
                </div>
                <p className="text-sm text-gray-700">{selectedArticle?.views.toLocaleString()} مشاهدة</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold">التقييم</span>
                </div>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(selectedArticle?.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-700">({selectedArticle?.rating})</span>
                </div>
              </div>
            </div>

            {/* محتوى المقال */}
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">ملخص المقال</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                هذا نص تجريبي يمثل محتوى المقال. يحتوي هذا المقال على معلومات شاملة وتفصيلية حول {selectedArticle?.title}.
                تم تحديث هذا المقال آخر مرة في تاريخ {selectedArticle?.lastUpdated}، ويتضمن أحدث المعلومات والتطورات في المجال.
              </p>
            </div>

            {/* إحصائيات إضافية */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">234</div>
                <div className="text-xs text-gray-600">تنزيلات</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">45</div>
                <div className="text-xs text-gray-600">تعليقات</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-600">89</div>
                <div className="text-xs text-gray-600">مشاركات</div>
              </div>
            </div>

            {/* التعليقات الأخيرة */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">آخر التعليقات</h4>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">مستخدم {i + 1}</span>
                        <span className="text-xs text-gray-500">منذ {i + 1} ساعة</span>
                      </div>
                      <p className="text-xs text-gray-600">تعليق تجريبي رائع على هذا المقال المفيد!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArticleDialog(false)}>
              إغلاق
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
            <Button>
              <Download className="w-4 h-4 ml-2" />
              تنزيل PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تفاصيل التصنيف */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="dialog-rtl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              <span className="text-3xl">{selectedCategory?.icon}</span>
              {selectedCategory?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory?.id} • {selectedCategory?.count} مقال
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* إحصائيات التصنيف */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedCategory?.count}</div>
                <div className="text-xs text-gray-600 mt-1">إجمالي المقالات</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{Math.floor((selectedCategory?.count || 0) * 0.8)}</div>
                <div className="text-xs text-gray-600 mt-1">منشورة</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.floor((selectedCategory?.count || 0) * 0.15)}</div>
                <div className="text-xs text-gray-600 mt-1">قيد المراجعة</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.floor((selectedCategory?.count || 0) * 0.05)}</div>
                <div className="text-xs text-gray-600 mt-1">مسودات</div>
              </div>
            </div>

            {/* المقالات الأكثر مشاهدة في هذا التصنيف */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-semibold">المقالات الأكثر مشاهدة</h4>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-gray-900">مقال تجريبي في {selectedCategory?.name} - الجزء {i + 1}</h5>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            <span>{Math.floor(Math.random() * 500 + 50)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">منشور</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* المساهمون في هذا التصنيف */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-semibold">أبرز المساهمين</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">مؤلف {i + 1}</div>
                        <div className="text-xs text-gray-600">{Math.floor(Math.random() * 20 + 5)} مقال</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* توزيع المقالات حسب الشهر */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">النشاط الشهري</h4>
              <div className="h-40 flex items-end justify-around gap-1">
                {['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'].map((month, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all hover:from-blue-600 hover:to-purple-600 cursor-pointer"
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                      title={`${month}: ${Math.floor(Math.random() * 50 + 10)} مقال`}
                    />
                    <span className="text-xs text-gray-600 mt-2">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              إغلاق
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              تصفية المقالات
            </Button>
            <Button>
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة طلب الصلاحية */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="dialog-rtl">
          <DialogHeader>
            <DialogTitle>طلب صلاحية</DialogTitle>
            <DialogDescription>
              يمكنك طلب الصلاحية التالية: {selectedPermission}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>سبب الطلب</Label>
              <Textarea
                placeholder="اذكر سبب حاجتك لهذه الصلاحية..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
              إلغاء
            </Button>
            <Button
              onClick={() => {
                alert('تم إرسال طلب الصلاحية بنجاح!');
                setShowPermissionDialog(false);
              }}
            >
              إرسال الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBase_Complete_Advanced_734;
