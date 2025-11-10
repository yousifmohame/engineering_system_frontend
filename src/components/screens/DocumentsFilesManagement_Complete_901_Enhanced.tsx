import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Folder,
  File,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Lock,
  Shield,
  AlertCircle,
  Cloud,
  HardDrive,
  Server,
  FileText,
  FilePlus,
  FolderPlus,
  Settings,
  Link,
  RefreshCw,
  Share2,
  Star,
  Clock,
  User,
  Calendar,
  Tag,
  Grid3X3,
  List,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  Archive,
  Printer,
  FileDown,
  Database,
  Box,
  Users,
  Briefcase,
  Save,
  Copy,
  Repeat
} from 'lucide-react';

/**
 * شاشة إدارة الملفات والمستندات - رقم 901 - محسّنة v5.0
 * نظام شامل لإدارة ملفات النظام وملفات المعاملات
 * مع دعم الخدمات السحابية والصلاحيات المتقدمة
 * 
 * التحسينات الجديدة:
 * - إصلاح مشكلة شريط امتلاء السعة
 * - إضافة إعدادات متقدمة لكل خدمة
 * - إضافة خدمة AWS S3
 * - إمكانية طباعة تقارير
 * - إعدادات ربط مع أجزاء النظام
 */

interface CloudService {
  id: string;
  name: string;
  type: 'ftp' | 'gdrive' | 'onedrive' | 'dropbox' | 'local' | 's3';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  totalSize: number; // بالـ GB
  usedSize: number;  // بالـ GB
  config?: {
    host?: string;
    port?: number;
    bucket?: string;
    region?: string;
    accessKey?: string;
    syncEnabled?: boolean;
    autoBackup?: boolean;
    linkedModules?: string[];
  };
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  owner: string;
  classification: 'normal' | 'medium' | 'sensitive';
  tags: string[];
  transactionId?: string;
  clientName?: string;
  children?: FileItem[];
}

export default function DocumentsFilesManagement_Complete_901_Enhanced() {
  const [activeTab, setActiveTab] = useState('901-03');
  const [showServiceSettings, setShowServiceSettings] = useState(false);
  const [selectedService, setSelectedService] = useState<CloudService | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);

  // بيانات تجريبية للخدمات السحابية - محسّنة
  const [cloudServices, setCloudServices] = useState<CloudService[]>([
    {
      id: 'cs1',
      name: 'FTP - الخادم الرئيسي',
      type: 'ftp',
      status: 'connected',
      lastSync: '2025-09-25 14:30',
      totalSize: 500,
      usedSize: 320,
      config: {
        host: 'ftp.example.com',
        port: 21,
        syncEnabled: true,
        autoBackup: true,
        linkedModules: ['transactions', 'documents']
      }
    },
    {
      id: 'cs2',
      name: 'Google Drive - المعاملات',
      type: 'gdrive',
      status: 'connected',
      lastSync: '2025-09-25 13:45',
      totalSize: 15,
      usedSize: 8.5,
      config: {
        syncEnabled: true,
        autoBackup: false,
        linkedModules: ['transactions']
      }
    },
    {
      id: 'cs3',
      name: 'OneDrive - المستندات',
      type: 'onedrive',
      status: 'disconnected',
      lastSync: '2025-09-24 10:15',
      totalSize: 1024,
      usedSize: 250,
      config: {
        syncEnabled: false,
        autoBackup: false,
        linkedModules: ['documents']
      }
    },
    {
      id: 'cs4',
      name: 'Dropbox - النسخ الاحتياطية',
      type: 'dropbox',
      status: 'error',
      lastSync: '2025-09-23 08:00',
      totalSize: 2048,
      usedSize: 1200,
      config: {
        syncEnabled: true,
        autoBackup: true,
        linkedModules: ['backup']
      }
    },
    {
      id: 'cs5',
      name: 'التخزين المحلي',
      type: 'local',
      status: 'connected',
      lastSync: '2025-09-25 14:35',
      totalSize: 2048,
      usedSize: 890,
      config: {
        syncEnabled: true,
        autoBackup: true,
        linkedModules: ['all']
      }
    },
    {
      id: 'cs6',
      name: 'AWS S3 - التخزين السحابي',
      type: 's3',
      status: 'connected',
      lastSync: '2025-09-25 14:40',
      totalSize: 5120,
      usedSize: 2300,
      config: {
        bucket: 'engineering-office-bucket',
        region: 'me-south-1',
        accessKey: 'AKIA***************',
        syncEnabled: true,
        autoBackup: true,
        linkedModules: ['transactions', 'documents', 'backup', 'projects']
      }
    }
  ]);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'ftp':
        return <Server className="w-5 h-5 text-gray-600" />;
      case 'gdrive':
        return <Cloud className="w-5 h-5 text-blue-600" />;
      case 'onedrive':
        return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'dropbox':
        return <Cloud className="w-5 h-5 text-blue-700" />;
      case 'local':
        return <HardDrive className="w-5 h-5 text-gray-700" />;
      case 's3':
        return <Database className="w-5 h-5 text-orange-600" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 border-green-200">متصل</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">غير متصل</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">خطأ</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  const calculateUsagePercentage = (usedSize: number, totalSize: number): number => {
    if (!totalSize || totalSize === 0) return 0;
    const percentage = (usedSize / totalSize) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const formatSize = (sizeInGB: number): string => {
    if (sizeInGB >= 1024) {
      return `${(sizeInGB / 1024).toFixed(1)} TB`;
    }
    return `${sizeInGB.toFixed(1)} GB`;
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  const handlePrintServiceReport = (service: CloudService) => {
    // منطق طباعة تقرير الخدمة
    console.log('Printing service report for:', service.name);
    window.print();
  };

  const handlePrintAllReport = () => {
    // منطق طباعة تقرير شامل
    console.log('Printing comprehensive report');
    window.print();
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Folder className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة الملفات
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                شاشة رقم 901
              </p>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-sidebar-body">
          {[
            { id: '901-01', title: 'استعراض الملفات', icon: <List className="w-4 h-4" /> },
            { id: '901-02', title: 'البحث المتقدم', icon: <Search className="w-4 h-4" /> },
            { id: '901-03', title: 'الخدمات السحابية', icon: <Cloud className="w-4 h-4" /> },
            { id: '901-04', title: 'رفع الملفات', icon: <Upload className="w-4 h-4" /> },
            { id: '901-05', title: 'الصلاحيات', icon: <Shield className="w-4 h-4" /> },
            { id: '901-06', title: 'التصنيفات', icon: <Tag className="w-4 h-4" /> },
            { id: '901-07', title: 'الأرشيف', icon: <Archive className="w-4 h-4" /> },
            { id: '901-08', title: 'النسخ الاحتياطي', icon: <Server className="w-4 h-4" /> },
            { id: '901-09', title: 'الإحصائيات', icon: <Grid3X3 className="w-4 h-4" /> },
            { id: '901-10', title: 'الإعدادات', icon: <Settings className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="vertical-tab-icon">{tab.icon}</div>
              <div className="vertical-tab-content">
                <div className="vertical-tab-title">{tab.title}</div>
              </div>
              <div className="vertical-tab-number">{tab.id}</div>
            </button>
          ))}
        </div>

        <div className="vertical-tabs-sidebar-footer">
          <div className="text-xs text-center text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <div className="font-bold mb-1">10 تبويبات نشطة</div>
            <div className="text-xs opacity-75">آخر تحديث: 29/09/2025</div>
          </div>
        </div>
      </div>

      {/* منطقة المحتوى الرئيسية */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '901-03' && 'الخدمات السحابية والتخزين'}
              </h2>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {activeTab === '901-03' && 'إدارة الاتصال بالخدمات السحابية وإعدادات الربط مع أجزاء النظام'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowPrintDialog(true)}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                طباعة تقرير
              </Button>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200" style={{ fontFamily: 'Courier New, monospace' }}>
                {activeTab}
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {/* تاب الخدمات السحابية - 901-03 - محسّن */}
          {activeTab === '901-03' && (
            <div className="space-y-4">
              {/* الإحصائيات الموجزة */}
              <div className="dense-stats-grid">
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">{cloudServices.length}</div>
                  <div className="dense-stat-label">خدمات مربوطة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">
                    {cloudServices.filter(s => s.status === 'connected').length}
                  </div>
                  <div className="dense-stat-label">متصلة الآن</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">
                    {formatSize(cloudServices.reduce((sum, s) => sum + s.totalSize, 0))}
                  </div>
                  <div className="dense-stat-label">إجمالي المساحة</div>
                </div>
                <div className="dense-stat-card">
                  <div className="dense-stat-icon">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div className="dense-stat-number">
                    {formatSize(cloudServices.reduce((sum, s) => sum + s.usedSize, 0))}
                  </div>
                  <div className="dense-stat-label">مساحة مستخدمة</div>
                </div>
              </div>

              {/* الإعدادات العامة للربط */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    إعدادات الربط العامة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="dense-grid dense-grid-3">
                    <div className="dense-form-group">
                      <Label>تفعيل المزامنة التلقائية</Label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-xs text-gray-600">مزامنة كل 15 دقيقة</span>
                      </div>
                    </div>
                    <div className="dense-form-group">
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-xs text-gray-600">يومياً عند الساعة 2:00 صباحاً</span>
                      </div>
                    </div>
                    <div className="dense-form-group">
                      <Label>تشفير الملفات المرفوعة</Label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-xs text-gray-600">AES-256</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-xs text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <strong>ملاحظة:</strong> يتم ربط الخدمات السحابية مع أجزاء النظام التالية: المعاملات، المستندات، المشاريع، النسخ الاحتياطي.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* قائمة الخدمات السحابية */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>الخدمات السحابية المربوطة</CardTitle>
                    <Button size="sm" onClick={() => setShowAddServiceDialog(true)}>
                      <Plus className="w-4 h-4" />
                      إضافة خدمة
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cloudServices.map((service) => {
                      const usagePercentage = calculateUsagePercentage(service.usedSize, service.totalSize);
                      
                      return (
                        <div
                          key={service.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all bg-white hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                {getServiceIcon(service.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {service.name}
                                  </span>
                                  {getStatusBadge(service.status)}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                  آخر مزامنة: {service.lastSync}
                                </div>
                                
                                {/* شريط الامتلاء - محسّن ليبقى داخل الحدود */}
                                <div className="w-full max-w-md">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium" style={{ fontFamily: 'Courier New, monospace' }}>
                                      {formatSize(service.usedSize)} / {formatSize(service.totalSize)}
                                    </span>
                                    <span className="text-xs font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                                      {usagePercentage}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${getUsageColor(usagePercentage)} rounded-full transition-all duration-500 ease-out`}
                                      style={{
                                        width: `${usagePercentage}%`
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* الوحدات المربوطة */}
                                {service.config?.linkedModules && (
                                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                                    <span className="text-xs text-gray-600">مربوط مع:</span>
                                    {service.config.linkedModules.map((module, idx) => (
                                      <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                        {module === 'transactions' && 'المعاملات'}
                                        {module === 'documents' && 'المستندات'}
                                        {module === 'backup' && 'النسخ الاحتياطي'}
                                        {module === 'projects' && 'المشاريع'}
                                        {module === 'all' && 'جميع الأجزاء'}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* الأزرار */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                title="تحديث"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowServiceSettings(true);
                                }}
                                title="الإعدادات"
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                title="اختبار الاتصال"
                              >
                                <Link className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handlePrintServiceReport(service)}
                                title="طباعة تقرير"
                              >
                                <Printer className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* نافذة إعدادات الخدمة */}
      <Dialog open={showServiceSettings} onOpenChange={setShowServiceSettings}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إعدادات {selectedService?.name}</DialogTitle>
            <DialogDescription>
              إعدادات الاتصال والربط والمزامنة والنسخ الاحتياطي
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              {/* إعدادات الاتصال */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إعدادات الاتصال</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService.type === 'ftp' && (
                    <>
                      <div className="dense-form-group">
                        <Label>عنوان الخادم</Label>
                        <Input 
                          defaultValue={selectedService.config?.host} 
                          placeholder="ftp.example.com"
                          className="input-field"
                        />
                      </div>
                      <div className="dense-grid dense-grid-2">
                        <div className="dense-form-group">
                          <Label>المنفذ</Label>
                          <Input 
                            type="number"
                            defaultValue={selectedService.config?.port} 
                            placeholder="21"
                            className="input-field"
                          />
                        </div>
                        <div className="dense-form-group">
                          <Label>نوع الاتصال</Label>
                          <select className="dense-form-select w-full">
                            <option>FTP</option>
                            <option>FTPS</option>
                            <option>SFTP</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedService.type === 's3' && (
                    <>
                      <div className="dense-form-group">
                        <Label>اسم الـ Bucket</Label>
                        <Input 
                          defaultValue={selectedService.config?.bucket} 
                          placeholder="my-bucket-name"
                          className="input-field"
                        />
                      </div>
                      <div className="dense-grid dense-grid-2">
                        <div className="dense-form-group">
                          <Label>المنطقة (Region)</Label>
                          <select className="dense-form-select w-full">
                            <option value="me-south-1">الشرق الأوسط (البحرين)</option>
                            <option value="me-central-1">الشرق الأوسط (الإمارات)</option>
                            <option value="eu-west-1">أوروبا (أيرلندا)</option>
                            <option value="us-east-1">أمريكا (فرجينيا)</option>
                          </select>
                        </div>
                        <div className="dense-form-group">
                          <Label>فئة التخزين</Label>
                          <select className="dense-form-select w-full">
                            <option>Standard</option>
                            <option>Intelligent-Tiering</option>
                            <option>Glacier</option>
                          </select>
                        </div>
                      </div>
                      <div className="dense-form-group">
                        <Label>Access Key ID</Label>
                        <Input 
                          type="password"
                          defaultValue={selectedService.config?.accessKey} 
                          placeholder="AKIA***************"
                          className="input-field"
                        />
                      </div>
                      <div className="dense-form-group">
                        <Label>Secret Access Key</Label>
                        <Input 
                          type="password"
                          placeholder="********************************"
                          className="input-field"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* إعدادات المزامنة */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إعدادات المزامنة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تفعيل المزامنة التلقائية</Label>
                      <p className="text-xs text-gray-600">مزامنة الملفات بشكل دوري</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked={selectedService.config?.syncEnabled}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="dense-form-group">
                    <Label>تكرار المزامنة</Label>
                    <select className="dense-form-select w-full">
                      <option>كل 5 دقائق</option>
                      <option>كل 15 دقيقة</option>
                      <option>كل 30 دقيقة</option>
                      <option>كل ساعة</option>
                      <option>يدوي فقط</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>حذف الملفات عند الحذف المحلي</Label>
                      <p className="text-xs text-gray-600">حذف تلقائي من السحابة</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>

              {/* إعدادات الربط مع أجزاء النظام */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">الربط مع أجزاء النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600 mb-3">
                    حدد أجزاء النظام التي سيتم ربطها بهذه الخدمة
                  </p>
                  {[
                    { id: 'transactions', label: 'نظام المعاملات', icon: <FileText className="w-4 h-4" /> },
                    { id: 'documents', label: 'إدارة المستندات', icon: <Folder className="w-4 h-4" /> },
                    { id: 'projects', label: 'إدارة المشاريع', icon: <Briefcase className="w-4 h-4" /> },
                    { id: 'backup', label: 'النسخ الاحتياطي', icon: <Database className="w-4 h-4" /> },
                    { id: 'hr', label: 'الموارد البشرية', icon: <Users className="w-4 h-4" /> },
                    { id: 'contracts', label: 'إدارة العقود', icon: <FileText className="w-4 h-4" /> }
                  ].map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        {module.icon}
                        <span className="text-sm">{module.label}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked={selectedService.config?.linkedModules?.includes(module.id)}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* إعدادات النسخ الاحتياطي */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">إعدادات النسخ الاحتياطي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>تفعيل النسخ الاحتياطي التلقائي</Label>
                      <p className="text-xs text-gray-600">نسخ احتياطي تلقائي يومي</p>
                    </div>
                    <input 
                      type="checkbox" 
                      defaultChecked={selectedService.config?.autoBackup}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="dense-grid dense-grid-2">
                    <div className="dense-form-group">
                      <Label>وقت النسخ الاحتياطي</Label>
                      <input type="time" defaultValue="02:00" className="dense-form-input w-full" />
                    </div>
                    <div className="dense-form-group">
                      <Label>الاحتفاظ بـ</Label>
                      <select className="dense-form-select w-full">
                        <option>آخر 7 نسخ</option>
                        <option>آخر 14 نسخة</option>
                        <option>آخر 30 نسخة</option>
                        <option>آخر 90 نسخة</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الحفظ */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowServiceSettings(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => setShowServiceSettings(false)}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة خدمة جديدة */}
      <Dialog open={showAddServiceDialog} onOpenChange={setShowAddServiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة خدمة تخزين جديدة</DialogTitle>
            <DialogDescription>
              اختر نوع الخدمة وأدخل بيانات الاتصال
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="dense-form-group">
              <Label>نوع الخدمة</Label>
              <select className="dense-form-select w-full">
                <option value="">-- اختر نوع الخدمة --</option>
                <option value="ftp">FTP Server</option>
                <option value="gdrive">Google Drive</option>
                <option value="onedrive">Microsoft OneDrive</option>
                <option value="dropbox">Dropbox</option>
                <option value="s3">Amazon S3</option>
                <option value="local">تخزين محلي</option>
              </select>
            </div>

            <div className="dense-form-group">
              <Label>اسم الخدمة</Label>
              <Input placeholder="مثال: FTP - الخادم الرئيسي" className="input-field" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                بعد اختيار نوع الخدمة، سيتم عرض حقول الإعدادات المطلوبة
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddServiceDialog(false)}>
                إلغاء
              </Button>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                إضافة الخدمة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة طباعة التقرير */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>طباعة تقرير الخدمات السحابية</DialogTitle>
            <DialogDescription>
              اختر نوع التقرير المطلوب
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => {
                handlePrintAllReport();
                setShowPrintDialog(false);
              }}
            >
              <Printer className="w-4 h-4 ml-2" />
              تقرير شامل عن جميع الخدمات
            </Button>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">تقرير خدمة محددة:</p>
              <div className="space-y-2">
                {cloudServices.map((service) => (
                  <Button 
                    key={service.id}
                    variant="ghost" 
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      handlePrintServiceReport(service);
                      setShowPrintDialog(false);
                    }}
                  >
                    {getServiceIcon(service.type)}
                    <span className="ml-2">{service.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}