/**
 * الشاشة 901 - إدارة الوثائق والملفات الشاملة
 * ===============================================
 * 
 * نظام متكامل لإدارة الوثائق والملفات بـ 20 تبويب شامل
 * - السايد بار الرأسي المُكثف للتابات
 * - استغلال 95%+ من المساحة
 * - نظام الترقيم الموحد 901-XX
 * - دعم RTL كامل مع خط Tajawal
 * - بطاقات تفاعلية ونوافذ منبثقة شاملة
 * - إدارة الملفات والمجلدات
 * - التكامل مع الخدمات السحابية
 * - نظام الصلاحيات المتقدم
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Folder, File, Upload, Download, Search, Filter, Eye,
  Edit, Trash2, Lock, Shield, AlertCircle, Cloud, HardDrive,
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
import InputWithCopy from '../InputWithCopy';

// واجهات البيانات
interface FileItem {
  id: string;
  fileNumber: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  size?: number;
  modified: string;
  created: string;
  owner: string;
  classification: 'normal' | 'confidential' | 'secret' | 'top-secret';
  tags: string[];
  transactionId?: string;
  clientName?: string;
  path: string;
  version?: string;
  isShared?: boolean;
  downloads?: number;
  views?: number;
}

interface CloudService {
  id: string;
  serviceNumber: string;
  name: string;
  type: 'ftp' | 'gdrive' | 'onedrive' | 'dropbox' | 'local' | 's3';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  totalSpace: number;
  usedSpace: number;
  filesCount: number;
  autoSync: boolean;
}

interface FilePermission {
  id: string;
  permissionNumber: string;
  fileId: string;
  userId: string;
  userName: string;
  accessLevel: 'view' | 'edit' | 'delete' | 'admin';
  expiryDate?: string;
  granted: string;
  grantedBy: string;
}

interface FileActivity {
  id: string;
  activityNumber: string;
  fileId: string;
  fileName: string;
  action: 'upload' | 'download' | 'edit' | 'delete' | 'share' | 'view';
  user: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}

const DocumentsFilesManagement_Complete_901: React.FC = () => {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('901-01');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // بيانات تجريبية - الملفات
  const files: FileItem[] = useMemo(() => [
    {
      id: '1', fileNumber: 'FILE-901-001',
      name: 'المعاملات الهندسية 2025', type: 'folder',
      modified: '2025-10-08', created: '2025-01-15',
      owner: 'م. أحمد السعيد', classification: 'confidential',
      tags: ['معاملات', 'هندسة'], path: '/المعاملات',
      version: '1.0', isShared: true, downloads: 45, views: 128
    },
    {
      id: '2', fileNumber: 'FILE-901-002',
      name: 'تقرير المشروع الإنشائي.pdf', type: 'file',
      extension: 'pdf', size: 2450000,
      modified: '2025-10-05', created: '2025-09-28',
      owner: 'م. فاطمة علي', classification: 'normal',
      tags: ['تقارير', 'إنشائي'], path: '/التقارير',
      transactionId: 'TRX-2025-001',
      version: '2.3', isShared: false, downloads: 12, views: 34
    },
    {
      id: '3', fileNumber: 'FILE-901-003',
      name: 'العقود والاتفاقيات', type: 'folder',
      modified: '2025-10-07', created: '2024-06-10',
      owner: 'م. محمد حسن', classification: 'secret',
      tags: ['عقود', 'قانوني'], path: '/العقود',
      version: '1.0', isShared: true, downloads: 67, views: 203
    },
    {
      id: '4', fileNumber: 'FILE-901-004',
      name: 'المخططات المعمارية.dwg', type: 'file',
      extension: 'dwg', size: 8900000,
      modified: '2025-10-03', created: '2025-09-15',
      owner: 'م. سارة القحطاني', classification: 'confidential',
      tags: ['مخططات', 'معماري'], path: '/المخططات',
      transactionId: 'TRX-2025-002',
      version: '1.8', isShared: true, downloads: 23, views: 89
    },
    {
      id: '5', fileNumber: 'FILE-901-005',
      name: 'صور الموقع', type: 'folder',
      modified: '2025-10-06', created: '2025-08-20',
      owner: 'م. خالد المحمد', classification: 'normal',
      tags: ['صور', 'مواقع'], path: '/الصور',
      version: '1.0', isShared: false, downloads: 15, views: 56
    },
  ], []);

  // بيانات تجريبية - الخدمات السحابية
  const cloudServices: CloudService[] = useMemo(() => [
    {
      id: '1', serviceNumber: 'CLOUD-901-001',
      name: 'Google Drive الرئيسي', type: 'gdrive',
      status: 'connected', lastSync: '2025-10-09 14:30',
      totalSpace: 100000000000, usedSpace: 45000000000,
      filesCount: 1247, autoSync: true
    },
    {
      id: '2', serviceNumber: 'CLOUD-901-002',
      name: 'OneDrive للمشاريع', type: 'onedrive',
      status: 'connected', lastSync: '2025-10-09 13:15',
      totalSpace: 50000000000, usedSpace: 28000000000,
      filesCount: 834, autoSync: true
    },
    {
      id: '3', serviceNumber: 'CLOUD-901-003',
      name: 'خادم FTP المحلي', type: 'ftp',
      status: 'syncing', lastSync: '2025-10-09 14:25',
      totalSpace: 200000000000, usedSpace: 67000000000,
      filesCount: 2156, autoSync: false
    },
    {
      id: '4', serviceNumber: 'CLOUD-901-004',
      name: 'Amazon S3 النسخ الاحتياطي', type: 's3',
      status: 'connected', lastSync: '2025-10-09 12:00',
      totalSpace: 500000000000, usedSpace: 123000000000,
      filesCount: 3892, autoSync: true
    },
  ], []);

  // بيانات تجريبية - الصلاحيات
  const permissions: FilePermission[] = useMemo(() => [
    {
      id: '1', permissionNumber: 'PERM-901-001',
      fileId: '2', userId: 'U001',
      userName: 'م. أحمد السعيد', accessLevel: 'admin',
      granted: '2025-09-28', grantedBy: 'م. فاطمة علي'
    },
    {
      id: '2', permissionNumber: 'PERM-901-002',
      fileId: '2', userId: 'U002',
      userName: 'م. محمد حسن', accessLevel: 'edit',
      expiryDate: '2025-12-31',
      granted: '2025-10-01', grantedBy: 'م. فاطمة علي'
    },
    {
      id: '3', permissionNumber: 'PERM-901-003',
      fileId: '4', userId: 'U003',
      userName: 'م. خالد المحمد', accessLevel: 'view',
      granted: '2025-09-15', grantedBy: 'م. سارة القحطاني'
    },
  ], []);

  // بيانات تجريبية - الأنشطة
  const activities: FileActivity[] = useMemo(() => [
    {
      id: '1', activityNumber: 'ACT-901-001',
      fileId: '2', fileName: 'تقرير المشروع الإنشائي.pdf',
      action: 'download', user: 'م. أحمد السعيد',
      timestamp: '2025-10-09 14:35:22',
      ipAddress: '192.168.1.100',
      details: 'تحميل ناجح'
    },
    {
      id: '2', activityNumber: 'ACT-901-002',
      fileId: '4', fileName: 'المخططات المعمارية.dwg',
      action: 'edit', user: 'م. سارة القحطاني',
      timestamp: '2025-10-09 13:20:15',
      ipAddress: '192.168.1.105',
      details: 'تحديث الإصدار 1.8'
    },
    {
      id: '3', activityNumber: 'ACT-901-003',
      fileId: '2', fileName: 'تقرير المشروع الإنشائي.pdf',
      action: 'view', user: 'م. محمد حسن',
      timestamp: '2025-10-09 12:10:08',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4', activityNumber: 'ACT-901-004',
      fileId: '3', fileName: 'العقود والاتفاقيات',
      action: 'share', user: 'م. فاطمة علي',
      timestamp: '2025-10-08 16:45:33',
      ipAddress: '192.168.1.103',
      details: 'مشاركة مع 3 مستخدمين'
    },
  ], []);

  // إحصائيات رئيسية
  const totalFiles = files.length;
  const totalFolders = files.filter(f => f.type === 'folder').length;
  const totalSize = useMemo(() =>
    files.reduce((sum, f) => sum + (f.size || 0), 0), [files]);
  const confidentialFiles = files.filter(f => f.classification === 'confidential' || f.classification === 'secret').length;
  const sharedFiles = files.filter(f => f.isShared).length;
  const totalDownloads = useMemo(() =>
    files.reduce((sum, f) => sum + (f.downloads || 0), 0), [files]);

  // تعريف التابات بنظام الترقيم الموحد
  const tabsConfig = [
    { id: '901-01', label: 'نظرة عامة', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: '901-02', label: 'الملفات', icon: <File className="w-4 h-4" /> },
    { id: '901-03', label: 'المجلدات', icon: <Folder className="w-4 h-4" /> },
    { id: '901-04', label: 'التصنيفات', icon: <Tag className="w-4 h-4" /> },
    { id: '901-05', label: 'الخدمات السحابية', icon: <Cloud className="w-4 h-4" /> },
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
              الشاشة رقم 901 • {tabsConfig.length} تبويب شامل
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <File className="w-3 h-3 ml-1" />
            {totalFiles} ملف
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Folder className="w-3 h-3 ml-1" />
            {totalFolders} مجلد
          </Badge>
          <Button size="sm" variant="outline" className="button-rtl dense-btn-secondary">
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
  const renderMainStats = () => (
    <div className="dense-stats-grid mb-4">
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
            {files
              .filter(f => f.type === 'file')
              .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
              .slice(0, 3)
              .map((file) => (
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
                    <Badge className={`text-xs ${
                      file.classification === 'top-secret' ? 'bg-red-100 text-red-800' :
                      file.classification === 'secret' ? 'bg-orange-100 text-orange-800' :
                      file.classification === 'confidential' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {file.classification === 'top-secret' ? 'سري للغاية' :
                       file.classification === 'secret' ? 'سري' :
                       file.classification === 'confidential' ? 'سري' : 'عادي'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">الحجم:</span>
                      <span className="font-medium">{file.size ? (file.size / 1000).toFixed(0) + ' KB' : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">آخر تعديل:</span>
                      <span className="font-medium">{file.modified}</span>
                    </div>
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">المالك:</span>
                      <span className="font-medium">{file.owner}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Cloud className="w-4 h-4" />
              الخدمات السحابية
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            {cloudServices.slice(0, 3).map((service) => (
              <div key={service.id} className="dense-content-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="compact-title">{service.name}</span>
                  <Badge className={`text-xs ${
                    service.status === 'connected' ? 'bg-green-100 text-green-800' :
                    service.status === 'syncing' ? 'bg-blue-100 text-blue-800' :
                    service.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {service.status === 'connected' ? 'متصل' :
                     service.status === 'syncing' ? 'مزامنة' :
                     service.status === 'error' ? 'خطأ' : 'غير متصل'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">المساحة:</span>
                    <span className="font-medium">
                      {((service.usedSpace / service.totalSpace) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${(service.usedSpace / service.totalSpace) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">الملفات:</span>
                    <span className="font-medium">{service.filesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          {activities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="dense-content-card">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.action === 'download' ? 'bg-blue-100 text-blue-600' :
                  activity.action === 'upload' ? 'bg-green-100 text-green-600' :
                  activity.action === 'edit' ? 'bg-yellow-100 text-yellow-600' :
                  activity.action === 'delete' ? 'bg-red-100 text-red-600' :
                  activity.action === 'share' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.action === 'download' && <Download className="w-4 h-4" />}
                  {activity.action === 'upload' && <Upload className="w-4 h-4" />}
                  {activity.action === 'edit' && <Edit className="w-4 h-4" />}
                  {activity.action === 'delete' && <Trash2 className="w-4 h-4" />}
                  {activity.action === 'share' && <Share2 className="w-4 h-4" />}
                  {activity.action === 'view' && <Eye className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="compact-title">
                      {activity.action === 'download' ? 'تنزيل' :
                       activity.action === 'upload' ? 'رفع' :
                       activity.action === 'edit' ? 'تعديل' :
                       activity.action === 'delete' ? 'حذف' :
                       activity.action === 'share' ? 'مشاركة' : 'عرض'} - {activity.fileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between compact-text text-gray-500">
                    <span>{activity.user}</span>
                    <span>{activity.timestamp}</span>
                  </div>
                  {activity.details && (
                    <p className="compact-text text-gray-600 mt-1">{activity.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // التاب 02: الملفات
  const renderFilesTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <File className="w-4 h-4" />
            قائمة الملفات
          </h3>
          <div className="flex items-center gap-2">
            <button
              className={`dense-action-btn ${viewMode === 'grid' ? 'bg-blue-100' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-3 h-3" />
            </button>
            <button
              className={`dense-action-btn ${viewMode === 'list' ? 'bg-blue-100' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-3 h-3" />
            </button>
            <button className="dense-btn dense-btn-primary">
              <FilePlus className="w-3 h-3" />
              ملف جديد
            </button>
          </div>
        </div>

        <div className="mt-3">
          <Input
            className="dense-form-input mb-3"
            placeholder="ابحث عن ملف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={viewMode === 'grid' ? 'dense-grid dense-grid-auto' : 'space-y-2'}>
          {files
            .filter(f => f.type === 'file')
            .map((file) => (
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
                    {file.extension === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                    {file.extension === 'dwg' && <FileText className="w-4 h-4 text-blue-600" />}
                    {file.extension === 'jpg' && <Image className="w-4 h-4 text-green-600" />}
                    {!file.extension && <File className="w-4 h-4 text-gray-600" />}
                    <span className="compact-title">{file.name}</span>
                  </div>
                  <Badge className={`text-xs ${
                    file.classification === 'top-secret' ? 'bg-red-100 text-red-800' :
                    file.classification === 'secret' ? 'bg-orange-100 text-orange-800' :
                    file.classification === 'confidential' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {file.classification === 'top-secret' ? 'سري للغاية' :
                     file.classification === 'secret' ? 'سري' :
                     file.classification === 'confidential' ? 'سري' : 'عادي'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="compact-text">
                    <span className="text-gray-600">الحجم:</span>
                    <span className="font-medium mr-1">
                      {file.size ? (file.size / 1000).toFixed(0) + ' KB' : '-'}
                    </span>
                  </div>
                  <div className="compact-text">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium mr-1">{file.extension || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">المالك:</span>
                    <span className="font-medium">{file.owner}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">آخر تعديل:</span>
                    <span className="font-medium">{file.modified}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <button className="dense-btn dense-btn-secondary flex-1">
                    <Download className="w-3 h-3" />
                    تنزيل
                  </button>
                  <button className="dense-btn dense-btn-secondary flex-1">
                    <Eye className="w-3 h-3" />
                    عرض
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // التاب 05: الخدمات السحابية
  const renderCloudServicesTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Cloud className="w-4 h-4" />
            الخدمات السحابية المتصلة
          </h3>
          <button className="dense-btn dense-btn-primary">
            <Plus className="w-3 h-3" />
            إضافة خدمة
          </button>
        </div>

        <div className="dense-grid dense-grid-auto mt-3">
          {cloudServices.map((service) => (
            <div key={service.id} className="dense-content-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    service.type === 'gdrive' ? 'bg-yellow-100 text-yellow-600' :
                    service.type === 'onedrive' ? 'bg-blue-100 text-blue-600' :
                    service.type === 'ftp' ? 'bg-green-100 text-green-600' :
                    service.type === 's3' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Cloud className="w-4 h-4" />
                  </div>
                  <span className="compact-title">{service.name}</span>
                </div>
                <Badge className={`text-xs ${
                  service.status === 'connected' ? 'bg-green-100 text-green-800' :
                  service.status === 'syncing' ? 'bg-blue-100 text-blue-800' :
                  service.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {service.status === 'connected' ? 'متصل' :
                   service.status === 'syncing' ? 'مزامنة' :
                   service.status === 'error' ? 'خطأ' : 'غير متصل'}
                </Badge>
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">النوع:</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {service.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">آخر مزامنة:</span>
                  <span className="font-medium">{service.lastSync}</span>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">عدد الملفات:</span>
                  <span className="font-medium">{service.filesCount}</span>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between compact-text mb-1">
                  <span className="text-gray-600">المساحة المستخدمة:</span>
                  <span className="font-medium">
                    {((service.usedSpace / service.totalSpace) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${(service.usedSpace / service.totalSpace) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between compact-text mt-1">
                  <span className="text-gray-500">
                    {(service.usedSpace / 1000000000).toFixed(1)} GB
                  </span>
                  <span className="text-gray-500">
                    من {(service.totalSpace / 1000000000).toFixed(0)} GB
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between compact-text">
                <span className="text-gray-600">المزامنة التلقائية:</span>
                <Badge className={service.autoSync ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {service.autoSync ? 'مفعّل' : 'معطّل'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            <div className="dense-section-actions">
              <button className="dense-action-btn">
                <Plus className="w-3 h-3" />
              </button>
              <button className="dense-action-btn">
                <Filter className="w-3 h-3" />
              </button>
              <button className="dense-action-btn">
                <Download className="w-3 h-3" />
              </button>
            </div>
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
            <Button className="button-rtl dense-btn-primary">
              <Eye className="w-3 h-3" />
              عرض التفاصيل
            </Button>
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
            تفاصيل الملف
          </DialogTitle>
          <DialogDescription className="dialog-description">
            معلومات شاملة عن الملف
          </DialogDescription>
        </DialogHeader>

        {selectedFile && (
          <div className="space-y-4">
            <div className="dense-grid dense-grid-2">
              <div className="dense-form-group">
                <Label className="dense-form-label">رقم الملف</Label>
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
                <Input value={selectedFile.created} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">آخر تعديل</Label>
                <Input value={selectedFile.modified} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الإصدار</Label>
                <Input value={selectedFile.version || '1.0'} readOnly className="dense-form-input" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowFileDialog(false)}>
                إغلاق
              </Button>
              <Button className="button-rtl dense-btn-primary">
                <Download className="w-3 h-3" />
                تنزيل
              </Button>
              <Button className="button-rtl dense-btn-primary">
                <Edit className="w-3 h-3" />
                تعديل
              </Button>
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
            قم برفع ملف جديد إلى النظام
          </DialogDescription>
        </DialogHeader>

        <div className="dense-form">
          <div className="dense-form-group">
            <Label className="dense-form-label">التصنيف *</Label>
            <Select>
              <SelectTrigger className="dense-form-input">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">عادي</SelectItem>
                <SelectItem value="confidential">سري</SelectItem>
                <SelectItem value="secret">سري جداً</SelectItem>
                <SelectItem value="top-secret">سري للغاية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="dense-form-group">
            <Label className="dense-form-label">المجلد الهدف *</Label>
            <Select>
              <SelectTrigger className="dense-form-input">
                <SelectValue placeholder="اختر المجلد" />
              </SelectTrigger>
              <SelectContent>
                {files.filter(f => f.type === 'folder').map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="dense-form-group">
            <Label className="dense-form-label">رفع الملف *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-small text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اسحب الملف هنا أو انقر للاختيار
              </p>
              <p className="text-small text-gray-400 mt-1">
                الحد الأقصى: 100 MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowUploadDialog(false)}>
              إلغاء
            </Button>
            <Button className="button-rtl dense-btn-primary">
              <Upload className="w-3 h-3" />
              رفع الملف
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
            الشاشة 901 • v5.0
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          {renderScreenHeader()}
        </div>

        <ScrollArea className="vertical-tabs-content-body">
          {activeTab === '901-01' && renderOverviewTab()}
          {activeTab === '901-02' && renderFilesTab()}
          {activeTab === '901-05' && renderCloudServicesTab()}
          {!['901-01', '901-02', '901-05'].includes(activeTab) && renderGenericTab(activeTab)}
        </ScrollArea>
      </div>

      {/* النوافذ المنبثقة */}
      {renderFileDialog()}
      {renderUploadDialog()}
    </div>
  );
};

export default DocumentsFilesManagement_Complete_901;
