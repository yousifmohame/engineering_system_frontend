/**
 * الشاشة 901 - إدارة الوثائق والملفات الشاملة (v3)
 * ===============================================
 * - تفعيل تاب 901-04 (التصنيفات)
 * - ربط التصنيفات (Classification) كجدول منفصل
 * - إصلاح نوافذ الرفع وإنشاء المجلدات لتستخدم ID التصنيف
 * - إصلاح 1: الضغط المفرد (onClick) يفتح المجلد (للتصفح)
 * - إصلاح 2: إظهار عدد العناصر داخل كل مجلد
 * - إصلاح 3: إصلاح "Invalid Date" في الأنشطة الأخيرة
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import * as documentApi from '../../api/documentApi'; 
import * as classificationApi from '../../api/classificationApi'; 
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Folder, File, Upload, Download, Search, Filter, Eye,
  Edit, Trash2, Lock, Shield, AlertCircle, HardDrive,
  Server, FileText, Image, FileArchive, FilePlus, FolderPlus,
  ChevronRight, ChevronDown, Settings, Link, RefreshCw,
  Share2, Star, Clock, User, Calendar, Tag, Grid3X3,
  List, Plus, X, Check, AlertTriangle, Info, Archive,
  Bookmark, Copy, Move, Zap, Database, Globe, Package,
  CheckCircle, XCircle, Percent, BarChart3, PieChart,
  TrendingUp, Activity, Hash, Users, Building
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { InputWithCopy } from '../InputWithCopy';
import { FileItem, FileActivity } from '../../api/documentApi';
import { Classification } from '../../api/classificationApi';
// واجهة لشريط المسار
interface BreadcrumbItem {
  id: string;
  name: string;
}
const DocumentsFilesManagement_Complete_901: React.FC = () => {
  const queryClient = useQueryClient();
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('901-01');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  // حالات التصفح
  const [currentParentId, setCurrentParentId] = useState('root');
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([{ id: 'root', name: 'الملفات الرئيسية' }]);
  // حالات جديدة للتصنيفات (901-04)
  const [showClassificationDialog, setShowClassificationDialog] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState<Classification | null>(null);
  const [newClassificationName, setNewClassificationName] = useState('');
  const [newClassificationColor, setNewClassificationColor] = useState('#6b7280');
  const [newClassificationDesc, setNewClassificationDesc] = useState('');
  // حالات الرفع
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadClassificationId, setUploadClassificationId] = useState<string | null>(null); 
  // حالات إنشاء مجلد
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderClassificationId, setNewFolderClassificationId] = useState<string | null>(null); 
  // 5. جلب البيانات (useQuery)
  const statsQuery = useQuery({
    queryKey: ['documentStats'],
    queryFn: documentApi.getDocumentStats,
  });
  const fileBrowserQuery = useQuery({
    queryKey: ['documents', { parentId: currentParentId, search: searchQuery }],
    queryFn: () => documentApi.getDocuments({ parentId: currentParentId, search: searchQuery }),
  });
  // Query لجلب *كل* المجلدات (لاختيار المجلد الأب عند الإنشاء، اختياري)
  const allFoldersQuery = useQuery({
    queryKey: ['documents', { type: 'folder' }],
    queryFn: () => documentApi.getDocuments({ type: 'folder' }),
  });
  const activitiesQuery = useQuery({
    queryKey: ['documentActivities'],
    queryFn: documentApi.getDocumentActivities,
    enabled: activeTab === '901-01' || activeTab === '901-11',
  });
  // Query: جلب التصنيفات
  const classificationsQuery = useQuery({
    queryKey: ['documentClassifications'],
    queryFn: classificationApi.getClassifications,
  });
  // 6. إعداد useMutation
  const uploadMutation = useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: () => {
      toast.success('تم رفع الملف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['documents', { parentId: currentParentId, search: searchQuery }] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      setShowUploadDialog(false);
      setFileToUpload(null);
      setUploadClassificationId(null);
    },
    onError: (error: Error) => {
      toast.error('فشل رفع الملف', { description: error.message });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: documentApi.deleteDocument,
    onSuccess: () => {
      toast.success(`تم حذف العنصر بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['documents'] }); // (تحديث كل شيء متعلق بالوثائق)
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      queryClient.invalidateQueries({ queryKey: ['documentActivities'] });
      setShowFileDialog(false);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast.error('فشل الحذف', { description: error.message });
    }
  });
  const createFolderMutation = useMutation({
    mutationFn: documentApi.createFolder,
    onSuccess: () => {
      toast.success('تم إنشاء المجلد بنجاح');
      queryClient.invalidateQueries({ queryKey: ['documents', { parentId: currentParentId, search: searchQuery }] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      setShowFolderDialog(false);
      setNewFolderName('');
      setNewFolderClassificationId(null);
    },
    onError: (error: Error) => {
      toast.error('فشل إنشاء المجلد', { description: error.message });
    }
  });
  // Mutators للتصنيفات
  const createClassificationMutation = useMutation({
    mutationFn: classificationApi.createClassification,
    onSuccess: () => {
      toast.success('تم إنشاء التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['documentClassifications'] });
      setShowClassificationDialog(false);
    },
    onError: (error: Error) => {
      toast.error('فشل إنشاء التصنيف', { description: error.message });
    }
  });
  const updateClassificationMutation = useMutation({
    mutationFn: (data: Classification) => classificationApi.updateClassification(data.id, data),
    onSuccess: () => {
      toast.success('تم تحديث التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['documentClassifications'] });
      setShowClassificationDialog(false);
    },
    onError: (error: Error) => {
      toast.error('فشل تحديث التصنيف', { description: error.message });
    }
  });
  const deleteClassificationMutation = useMutation({
    mutationFn: classificationApi.deleteClassification,
    onSuccess: () => {
      toast.success('تم حذف التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['documentClassifications'] });
    },
    onError: (error: Error) => {
      toast.error('فشل حذف التصنيف', { description: error.message });
    }
  });
  // 9. دوال معالجة الإجراءات
  const handleUploadSubmit = () => {
    if (!fileToUpload) {
      toast.warning("الرجاء اختيار ملف أولاً");
      return;
    }
    const formData = new FormData();
    formData.append('file', fileToUpload);
    if (uploadClassificationId) {
      formData.append('classificationId', uploadClassificationId);
    }
    if (currentParentId && currentParentId !== 'root') {
      formData.append('parentId', currentParentId);
    }
    formData.append('path', breadcrumb.map(b => b.name).join('/'));
    uploadMutation.mutate(formData);
  };
  const handleDeleteFile = (file: FileItem | null) => {
    if (!file) return;
    if (window.confirm(`هل أنت متأكد من حذف: "${file.name}"؟ ${file.type === 'folder' ? 'سيتم حذف جميع محتوياته.' : ''}`)) {
      toast.info(`جاري حذف: ${file.name}...`);
      deleteMutation.mutate(file.id);
    }
  };
  const handleCreateFolderSubmit = () => {
    if (!newFolderName.trim()) {
      toast.warning("الرجاء إدخال اسم للمجلد");
      return;
    }
    createFolderMutation.mutate({
      name: newFolderName,
      parentId: currentParentId,
      classificationId: newFolderClassificationId || null,
      path: breadcrumb.map(b => b.name).join('/')
    });
  };
  // دوال التصنيفات
  const openNewClassificationDialog = () => {
    setSelectedClassification(null);
    setNewClassificationName('');
    setNewClassificationColor('#6b7280');
    setNewClassificationDesc('');
    setShowClassificationDialog(true);
  };
  const openEditClassificationDialog = (classification: Classification) => {
    setSelectedClassification(classification);
    setNewClassificationName(classification.name);
    setNewClassificationColor(classification.color);
    setNewClassificationDesc(classification.description || '');
    setShowClassificationDialog(true);
  };
  const handleClassificationSubmit = () => {
    if (!newClassificationName.trim()) {
      toast.warning('اسم التصنيف مطلوب');
      return;
    }
    const data = {
      id: selectedClassification?.id || '',
      name: newClassificationName,
      color: newClassificationColor,
      description: newClassificationDesc,
    };
    if (selectedClassification) {
      updateClassificationMutation.mutate(data as Classification);
    } else {
      createClassificationMutation.mutate(data);
    }
  };
  const handleDeleteClassification = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن حذف التصنيف إذا كان مستخدماً.')) {
      deleteClassificationMutation.mutate(id);
    }
  };
  // 10. دوال التصفح (Navigation)
  const handleFolderClick = (folder: FileItem) => {
    if (folder.type !== 'folder') return;
    setBreadcrumb(prev => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentParentId(folder.id);
    setSearchQuery('');
  };
  const handleCrumbClick = (index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setCurrentParentId(newBreadcrumb[newBreadcrumb.length - 1].id);
    setSearchQuery('');
  };
  // 11. ✅ إصلاح 3: دالة آمنة لتنسيق التاريخ (مع الوقت)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // إرجاع النص الأصلي إذا كان غير صالح
      }
      return date.toLocaleString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString; 
    }
  };
  // دالة لتنسيق التاريخ فقط (بدون وقت)
  const formatDateOnly = (dateString: string | null | undefined) => {
     if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  }
  // إحصائيات رئيسية (تعتمد على statsQuery)
  const stats = statsQuery.data;
  const totalFiles = stats?.totalFiles ?? 0;
  const totalFolders = stats?.totalFolders ?? 0;
  const totalSize = stats?.totalSize ?? 0;
  const confidentialFiles = stats?.confidentialFiles ?? 0;
  const sharedFiles = stats?.sharedFiles ?? 0;
  const totalDownloads = stats?.totalDownloads ?? 0;
  // الملفات والمجلدات (تعتمد على fileBrowserQuery)
  const filesAndFolders = fileBrowserQuery.data ?? [];
  // الأنشطة (تعتمد على activitiesQuery)
  const activities = activitiesQuery.data ?? [];
  // تعريف التابات (تم دمج 02 و 03)
  const tabsConfig = [
    { id: '901-01', label: 'نظرة عامة', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: '901-02', label: 'متصفح الملفات', icon: <Folder className="w-4 h-4" /> },
    { id: '901-04', label: 'التصنيفات', icon: <Tag className="w-4 h-4" /> },
    { id: '901-06', label: 'النسخ الاحتياطي', icon: <Archive className="w-4 h-4" /> },
    { id: '901-07', label: 'الصلاحيات', icon: <Shield className="w-4 h-4" /> },
    { id: '901-08', label: 'المشاركة', icon: <Share2 className="w-4 h-4" /> },
    { id: '901-09', label: 'الإصدارات', icon: <Clock className="w-4 h-4" /> },
    { id: '901-10', label: 'البحث المتقدم', icon: <Search className="w-4 h-4" /> },
    { id: '901-11', label: 'الأنشطة', icon: <Activity className="w-4 h-4" /> },
    { id: '901-12', label: 'التقارير', icon: <FileText className="w-4 h-4" /> },
    { id: '901-13', label: 'الإحصائيات', icon: <BarChart3 className="w-4 h-4" /> },
    { id: '901-14', label: 'التنبيهات', icon: <AlertCircle className="w-4 h-4" /> },
    { id: '901-15', label: 'المفضلة', icon: <Star className="w-4 h-4" /> },
    { id: '901-16', label: 'سلة المحذوفات', icon: <Trash2 className="w-4 h-4" /> },
    { id: '901-17', label: 'الأرشيف', icon: <Archive className="w-4 h-4" /> },
    { id: '901-18', label: 'التكامل', icon: <Link className="w-4 h-4" /> },
    { id: '901-19', label: 'الإعدادات', icon: <Settings className="w-4 h-4" /> },
    { id: '901-20', label: 'المساعدة', icon: <Info className="w-4 h-4" /> },
  ];
  // مكون رأس الشاشة
  const renderScreenHeader = () => (
    <div className="dense-section-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-main-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إدارة الوثائق والملفات
            </h1>
            <p className="text-small text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الشاشة رقم 901 • {tabsConfig.length} تبويب شامل (تخزين محلي)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statsQuery.isLoading ? (
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
              جاري التحميل...
            </Badge>
          ) : (
            <>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <File className="w-3 h-3 ml-1" />
                {totalFiles} ملف
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Folder className="w-3 h-3 ml-1" />
                {totalFolders} مجلد
              </Badge>
            </>
          )}
          <Button size="sm" variant="outline" className="button-rtl dense-btn-secondary" onClick={() => queryClient.invalidateQueries()}>
            <RefreshCw className="w-3 h-3" />
            تحديث
          </Button>
          <Button size="sm" className="button-rtl dense-btn-primary" onClick={() => setShowUploadDialog(true)}>
            <Upload className="w-3 h-3" />
            رفع ملف
          </Button>
        </div>
      </div>
    </div>
  );
  // مكون الإحصائيات الرئيسية
  const renderMainStats = () => {
    if (statsQuery.isLoading) {
      return (
        <div className="dense-stats-grid mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dense-stat-card p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      );
    }
    if (statsQuery.isError) {
      return <div className="text-red-500 p-4 bg-red-50 rounded-lg">خطأ في جلب الإحصائيات: {(statsQuery.error as Error).message}</div>;
    }
    return (
      <div className="dense-stats-grid mb-4">
        {/* (6 بطاقات إحصائيات) */}
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <File className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#3b82f6' }}>
            {totalFiles}
          </div>
          <div className="dense-stat-label">إجمالي الملفات</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Folder className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>
            {totalFolders}
          </div>
          <div className="dense-stat-label">المجلدات</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#f59e0b' }}>
            {(totalSize / 1000000).toFixed(1)} MB
          </div>
          <div className="dense-stat-label">المساحة المستخدمة</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Lock className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#ef4444' }}>
            {confidentialFiles}
          </div>
          <div className="dense-stat-label">ملفات سرية</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Share2 className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#a855f7' }}>
            {sharedFiles}
          </div>
          <div className="dense-stat-label">ملفات مشتركة</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <Download className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#22c55e' }}>
            {totalDownloads}
          </div>
          <div className="dense-stat-label">التنزيلات</div>
        </div>
      </div>
    );
  };
  // التاب 01: نظرة عامة
  const renderOverviewTab = () => (
    <div className="dense-layout">
      {renderMainStats()}
      <div className="dense-grid dense-grid-2 mb-4">
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <File className="w-4 h-4" />
              الملفات الأخيرة
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            {fileBrowserQuery.isLoading ? (
              <p className="text-gray-500 text-sm p-4">جاري تحميل الملفات...</p>
            ) : fileBrowserQuery.isError ? (
                <p className="text-red-500 text-sm p-4">خطأ في تحميل الملفات</p>
            ) : filesAndFolders.filter(f => f.type === 'file').length === 0 ? (
                <p className="text-gray-500 text-sm p-4">لا توجد ملفات لعرضها.</p>
            ) : (
              filesAndFolders
                .filter(f => f.type === 'file') // عرض الملفات فقط
                .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
                .slice(0, 3)
                .map((file) => {
                  const classification = file.classification; // (البيانات مدمجة من الـ backend)
                  return (
                    <div
                      key={file.id}
                      className="dense-content-card cursor-pointer"
                      onClick={() => {
                        setSelectedFile(file);
                        setShowFileDialog(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="compact-title">{file.name}</span>
                        </div>
                        {classification && (
                          <Badge 
                            className="text-xs border" 
                            style={{ 
                              backgroundColor: `${classification.color}20`,
                              color: classification.color,
                              borderColor: `${classification.color}40`
                            }}
                          >
                            {classification.name}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between compact-text">
                          <span className="text-gray-600">الحجم:</span>
                          <span className="font-medium">{file.size ? (file.size / 1000).toFixed(0) + ' KB' : '-'}</span>
                        </div>
                        <div className="flex items-center justify-between compact-text">
                          <span className="text-gray-600">آخر تعديل:</span>
                          <span className="font-medium">{formatDateOnly(file.modified)}</span>
                        </div>
                        <div className="flex items-center justify-between compact-text">
                          <span className="text-gray-600">المالك:</span>
                          <span className="font-medium">{file.owner}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Activity className="w-4 h-4" />
              الأنشطة الأخيرة
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            {activitiesQuery.isLoading ? (
              <p className="text-gray-500 text-sm p-4">جاري تحميل الأنشطة...</p>
            ) : activitiesQuery.isError ? (
                <p className="text-red-500 text-sm p-4">خطأ في تحميل الأنشطة</p>
            ) : activities.length === 0 ? (
                <p className="text-gray-500 text-sm p-4">لا توجد أنشطة لعرضها.</p>
            ) : (
              activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="dense-content-card">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.action === 'download' ? 'bg-blue-100 text-blue-600' :
                      activity.action === 'upload' ? 'bg-green-100 text-green-600' :
                      activity.action === 'delete' ? 'bg-red-100 text-red-600' :
                      activity.action === 'folder_create' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.action === 'download' && <Download className="w-4 h-4" />}
                      {activity.action === 'upload' && <Upload className="w-4 h-4" />}
                      {activity.action === 'delete' && <Trash2 className="w-4 h-4" />}
                      {activity.action === 'folder_create' && <FolderPlus className="w-4 h-4" />}
                      {activity.action === 'view' && <Eye className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="compact-title">
                          {activity.action === 'download' ? 'تنزيل' :
                            activity.action === 'upload' ? 'رفع' :
                            activity.action === 'delete' ? 'حذف' :
                            activity.action === 'folder_create' ? 'إنشاء مجلد' : 'عرض'} - {activity.fileName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between compact-text text-gray-500">
                        <span>{activity.user}</span>
                        {/* ✅ إصلاح 3: استخدام الدالة الجديدة */}
                        <span>{formatDate(activity.timestamp)}</span>
                      </div>
                      {activity.details && (
                        <p className="compact-text text-gray-600 mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
  // التاب 02: متصفح الملفات (النسخة المدمجة)
  const renderFileBrowserTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Folder className="w-4 h-4" />
            متصفح الملفات
          </h3>
          <div className="flex items-center gap-2">
            {/* (أزرار عرض Grid/List - يمكنك إضافتها لاحقاً) */}
            <button className="dense-btn dense-btn-primary" onClick={() => setShowFolderDialog(true)}>
              <FolderPlus className="w-3 h-3" />
              مجلد جديد
            </button>
            <button className="dense-btn dense-btn-primary" onClick={() => setShowUploadDialog(true)}>
              <FilePlus className="w-3 h-3" />
              ملف جديد
            </button>
          </div>
        </div>
        {/* شريط المسار (Breadcrumbs) */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg mb-3 text-sm overflow-x-auto">
          {breadcrumb.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-1 flex-shrink-0">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" style={{ transform: 'scaleX(-1)' }} />}
              <Button
                variant="link"
                className={`p-0 h-auto font-medium ${index === breadcrumb.length - 1 ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                onClick={() => handleCrumbClick(index)}
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Input
            className="dense-form-input mb-3"
            placeholder={`ابحث في ${breadcrumb[breadcrumb.length - 1].name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {fileBrowserQuery.isLoading && <p className="text-gray-500 text-sm p-4 text-center">جاري تحميل المحتويات...</p>}
        {fileBrowserQuery.isError && <p className="text-red-500 text-sm p-4 text-center">خطأ في تحميل المحتويات</p>}
        {fileBrowserQuery.isSuccess && filesAndFolders.length === 0 && (
          <p className="text-gray-500 text-sm p-4 text-center">هذا المجلد فارغ.</p>
        )}
        {/* العرض (وضع القائمة الافتراضي) */}
        <div className={'space-y-2'}>
          {filesAndFolders.map((item) => {
            const classification = item.classification; // (البيانات مدمجة)
            return item.type === 'folder' ? (
              // --- عرض المجلد ---
              <div
                key={item.id}
                className="dense-content-card cursor-pointer"
                // ✅ إصلاح 1: الضغط المفرد يفتح المجلد
                onClick={() => handleFolderClick(item)}
                // (يمكنك إضافة onContextMenu لفتح قائمة خيارات)
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-yellow-500" />
                    <span className="compact-title">{item.name}</span>
                  </div>
                  {classification && (
                    <Badge 
                      className="text-xs border" 
                      style={{ 
                        backgroundColor: `${classification.color}20`, 
                        color: classification.color,
                        borderColor: `${classification.color}40`
                      }}
                    >
                      {classification.name}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {/* ✅ إصلاح 2: إظهار عدد العناصر */}
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">العناصر:</span>
                    <span className="font-medium">{item._count?.children ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">المالك:</span>
                    <span className="font-medium">{item.owner}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">آخر تعديل:</span>
                    <span className="font-medium">{formatDateOnly(item.modified)}</span>
                  </div>
                </div>
              </div>
            ) : (
              // --- عرض الملف ---
              <div
                key={item.id}
                className="dense-content-card cursor-pointer"
                onClick={() => {
                  setSelectedFile(item);
                  setShowFileDialog(true); // الضغط المفرد يفتح التفاصيل
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.extension === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                    {item.extension?.match(/^(jpg|jpeg|png)$/) && <Image className="w-4 h-4 text-green-600" />}
                    {(!item.extension || !['pdf', 'jpg', 'jpeg', 'png'].includes(item.extension!)) && <File className="w-4 h-4 text-gray-600" />}
                    <span className="compact-title">{item.name}</span>
                  </div>
                  {classification && (
                    <Badge 
                      className="text-xs border" 
                      style={{ 
                        backgroundColor: `${classification.color}20`, 
                        color: classification.color,
                        borderColor: `${classification.color}40`
                      }}
                    >
                      {classification.name}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="compact-text">
                    <span className="text-gray-600">الحجم:</span>
                    <span className="font-medium mr-1">
                      {item.size ? (item.size / 1000).toFixed(0) + ' KB' : '-'}
                    </span>
                  </div>
                  <div className="compact-text">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium mr-1">{item.extension || 'غير محدد'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">المالك:</span>
                    <span className="font-medium">{item.owner}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">آخر تعديل:</span>
                    <span className="font-medium">{formatDateOnly(item.modified)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
  // --- ✅ جديد: دالة عرض تاب التصنيفات (901-04) ---
  const renderClassificationsTab = () => {
    const classifications = classificationsQuery.data ?? [];
    const isLoading = classificationsQuery.isLoading;
    const isError = classificationsQuery.isError;
    return (
      <div className="dense-layout">
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Tag className="w-4 h-4" />
              إدارة التصنيفات
            </h3>
            <button className="dense-btn dense-btn-primary" onClick={openNewClassificationDialog}>
              <Plus className="w-3 h-3" />
              تصنيف جديد
            </button>
          </div>
          <div className="mt-4">
            {isLoading && <p className="text-gray-500 p-4 text-center">جاري تحميل التصنيفات...</p>}
            {isError && <p className="text-red-500 p-4 text-center">خطأ في تحميل التصنيفات.</p>}
            <div className="space-y-2">
              {classifications.map((item) => (
                <div key={item.id} className="dense-content-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <div className="flex-1">
                        <span className="compact-title">{item.name}</span>
                        <p className="compact-text text-gray-500">{item.description || 'لا يوجد وصف'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="dense-action-btn"
                        onClick={() => openEditClassificationDialog(item)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="dense-action-btn text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClassification(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // محتوى عام للتابات الأخرى
  const renderGenericTab = (tabId: string) => {
    const tabInfo = tabsConfig.find(t => t.id === tabId);
    return (
      <div className="dense-layout">
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              {tabInfo?.icon}
              {tabInfo?.label}
            </h3>
          </div>
          <div className="mt-4 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              {tabInfo?.icon && React.cloneElement(tabInfo.icon as React.ReactElement, { className: 'w-8 h-8 text-blue-600' })}
            </div>
            <h3 className="text-sub-title mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {tabInfo?.label}
            </h3>
            <p className="text-normal text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى شامل ومتكامل لـ {tabInfo?.label} مع جميع الأدوات والإعدادات
            </p>
          </div>
        </div>
      </div>
    );
  };
  // نافذة تفاصيل الملف
  const renderFileDialog = () => (
    <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
      <DialogContent className="max-w-3xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            تفاصيل {selectedFile?.type === 'folder' ? 'المجلد' : 'الملف'}
          </DialogTitle>
          <DialogDescription className="dialog-description">
            معلومات شاملة عن العنصر
          </DialogDescription>
        </DialogHeader>
        {selectedFile && (
          <div className="space-y-4">
            <div className="dense-grid dense-grid-2">
              <div className="dense-form-group">
                <Label className="dense-form-label">رقم العنصر</Label>
                <InputWithCopy value={selectedFile.fileNumber} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الاسم</Label>
                <Input value={selectedFile.name} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">النوع</Label>
                <Input value={selectedFile.type === 'file' ? 'ملف' : 'مجلد'} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الامتداد</Label>
                <Input value={selectedFile.extension || '-'} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الحجم</Label>
                <Input value={selectedFile.size ? (selectedFile.size / 1000).toFixed(0) + ' KB' : '-'} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">المالك</Label>
                <Input value={selectedFile.owner} readOnly className="dense-form-input" />
              </div>
            </div>
            <div className="dense-grid dense-grid-3">
              <div className="dense-form-group">
                <Label className="dense-form-label">تاريخ الإنشاء</Label>
                <Input value={formatDateOnly(selectedFile.created)} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">آخر تعديل</Label>
                <Input value={formatDateOnly(selectedFile.modified)} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الإصدار</Label>
                <Input value={selectedFile.version || '1.0'} readOnly className="dense-form-input" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-4 border-t">
              <Button 
                variant="destructive" 
                className="button-rtl dense-btn-destructive" 
                onClick={() => handleDeleteFile(selectedFile)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-3 h-3" />
                {deleteMutation.isPending ? 'جاري الحذف...' : 'حذف'}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowFileDialog(false)}>
                  إغلاق
                </Button>
                {/* لا نعرض زر التنزيل للمجلد */}
                {selectedFile.type === 'file' && (
                  <Button 
                    className="button-rtl dense-btn-primary"
                    onClick={() => {
                      toast.info(`جاري بدء تنزيل: ${selectedFile.name}`);
                      documentApi.downloadDocument(selectedFile.id, selectedFile.name)
                        .catch(err => toast.error('فشل التنزيل', { description: (err as Error).message }));
                    }}
                  >
                    <Download className="w-3 h-3" />
                    تنزيل
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
  // نافذة رفع ملف جديد
  const renderUploadDialog = () => (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent className="max-w-2xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            رفع ملف جديد
          </DialogTitle>
          <DialogDescription className="dialog-description">
            سيتم رفع الملف إلى: <span className="text-blue-600 font-medium">{breadcrumb[breadcrumb.length - 1].name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="dense-form">
          <div className="dense-form-group">
            <Label className="dense-form-label">التصنيف</Label>
            <Select
              value={uploadClassificationId || ''}
              onValueChange={(value) => setUploadClassificationId(value === 'none' ? null : value)}
            >
              <SelectTrigger className="dense-form-input">
                <SelectValue placeholder="اختر التصنيف (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">(بدون تصنيف)</SelectItem>
                {classificationsQuery.data?.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="dense-form-group">
            <Label className="dense-form-label">رفع الملف *</Label>
            <Input 
              type="file" 
              className="dense-form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)}
            />
            {fileToUpload && (
              <p className="text-small text-gray-600 mt-2">
                الملف المختار: {fileToUpload.name} ({(fileToUpload.size / 1000).toFixed(0)} KB)
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowUploadDialog(false)}>
              إلغاء
            </Button>
            <Button 
              className="button-rtl dense-btn-primary" 
              onClick={handleUploadSubmit}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'جاري الرفع...' : (
                <>
                  <Upload className="w-3 h-3" />
                  رفع الملف
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  // نافذة إنشاء مجلد جديد
  const renderCreateFolderDialog = () => (
    <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
      <DialogContent className="max-w-xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            إنشاء مجلد جديد
          </DialogTitle>
          <DialogDescription className="dialog-description">
            سيتم إنشاء المجلد داخل: <span className="text-blue-600 font-medium">{breadcrumb[breadcrumb.length - 1].name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="dense-form">
          <div className="dense-form-group">
            <Label className="dense-form-label" htmlFor="folderName">اسم المجلد *</Label>
            <Input 
              id="folderName"
              className="dense-form-input"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="مثال: عقود 2025"
            />
          </div>
          <div className="dense-form-group">
            <Label className="dense-form-label">التصنيف</Label>
            <Select
              value={newFolderClassificationId || ''}
              onValueChange={(value) => setNewFolderClassificationId(value === 'none' ? null : value)}
            >
              <SelectTrigger className="dense-form-input">
                <SelectValue placeholder="اختر التصنيف (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">(بدون تصنيف)</SelectItem>
                {classificationsQuery.data?.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowFolderDialog(false)}>
              إلغاء
            </Button>
            <Button 
              className="button-rtl dense-btn-primary" 
              onClick={handleCreateFolderSubmit}
              disabled={createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? 'جاري الإنشاء...' : (
                <>
                  <FolderPlus className="w-3 h-3" />
                  إنشاء المجلد
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  // نافذة إنشاء/تعديل التصنيف
  const renderClassificationDialog = () => (
    <Dialog open={showClassificationDialog} onOpenChange={setShowClassificationDialog}>
      <DialogContent className="max-w-xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {selectedClassification ? 'تعديل التصنيف' : 'تصنيف جديد'}
          </DialogTitle>
        </DialogHeader>
        <div className="dense-form">
          <div className="dense-form-group">
            <Label className="dense-form-label" htmlFor="className">اسم التصنيف *</Label>
            <Input 
              id="className"
              className="dense-form-input"
              value={newClassificationName}
              onChange={(e) => setNewClassificationName(e.target.value)}
              placeholder="مثال: عقود"
            />
          </div>
          <div className="dense-form-group">
            <Label className="dense-form-label" htmlFor="classColor">اللون *</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="classColor"
                type="color"
                className="dense-form-input w-16 p-1"
                value={newClassificationColor}
                onChange={(e) => setNewClassificationColor(e.target.value)}
              />
              <Input
                className="dense-form-input flex-1"
                value={newClassificationColor}
                onChange={(e) => setNewClassificationColor(e.target.value)}
                placeholder="#6b7280"
              />
            </div>
          </div>
          <div className="dense-form-group">
            <Label className="dense-form-label" htmlFor="classDesc">الوصف</Label>
            <Input 
              id="classDesc"
              className="dense-form-input"
              value={newClassificationDesc}
              onChange={(e) => setNewClassificationDesc(e.target.value)}
              placeholder="وصف مختصر..."
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowClassificationDialog(false)}>
              إلغاء
            </Button>
            <Button 
              className="button-rtl dense-btn-primary" 
              onClick={handleClassificationSubmit}
              disabled={createClassificationMutation.isPending || updateClassificationMutation.isPending}
            >
              {createClassificationMutation.isPending || updateClassificationMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <h3 className="text-sub-title mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تابات الملفات
          </h3>
          <p className="text-small text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {tabsConfig.length} تبويب
          </p>
        </div>
        <ScrollArea className="vertical-tabs-sidebar-body">
          {tabsConfig.map((tab, index) => (
            <React.Fragment key={tab.id}>
              <div
                className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="vertical-tab-icon">{tab.icon}</div>
                <div className="vertical-tab-title-condensed">{tab.label}</div>
                <div className="vertical-tab-number-condensed">{tab.id}</div>
              </div>
              {index < tabsConfig.length - 1 && <div className="vertical-tab-separator-condensed" />}
            </React.Fragment>
          ))}
        </ScrollArea>
        <div className="vertical-tabs-sidebar-footer">
          <div className="compact-text text-center text-gray-600">
            الشاشة 901 • v5.1
          </div>
        </div>
      </div>
      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          {renderScreenHeader()}
        </div>
        <ScrollArea className="vertical-tabs-content-body">
          {/* تحديث منطق العرض */}
          {activeTab === '901-01' && renderOverviewTab()}
          {activeTab === '901-02' && renderFileBrowserTab()}
          {activeTab === '901-04' && renderClassificationsTab()}
          {!['901-01', '901-02', '901-04'].includes(activeTab) && renderGenericTab(activeTab)}
        </ScrollArea>
      </div>
      {/* النوافذ المنبثقة */}
      {renderFileDialog()}
      {renderUploadDialog()}
      {renderCreateFolderDialog()}
      {renderClassificationDialog()}
    </div>
  );
};
export default DocumentsFilesManagement_Complete_901;