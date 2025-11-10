import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Folder, File, Upload, Download, Search, Filter, Eye, Edit, Trash2, Lock, Shield,
  AlertCircle, Cloud, HardDrive, Server, FileText, FilePlus, FolderPlus, Settings,
  Link, RefreshCw, Share2, Star, Clock, User, Calendar, Tag, Grid3X3, List, Plus,
  X, Check, AlertTriangle, Info, Archive, Printer, FileDown, Database, Box, Users,
  Briefcase, Save, Copy, Repeat
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

/**
 * شاشة إدارة الملفات والمستندات - رقم 901 - v8.0
 * نظام شامل لإدارة ملفات النظام وملفات المعاملات
 * مع دعم الخدمات السحابية والصلاحيات المتقدمة
 */

interface CloudService {
  id: string;
  name: string;
  type: 'ftp' | 'gdrive' | 'onedrive' | 'dropbox' | 'local' | 's3';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  totalSize: number;
  usedSize: number;
  config?: {
    host?: string;
    port?: number;
    bucket?: string;
    region?: string;
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
}

const TABS_CONFIG: TabConfig[] = [
  { id: '901-01', number: '901-01', title: 'ملفات المعاملات', icon: Briefcase },
  { id: '901-02', number: '901-02', title: 'ملفات النظام', icon: Database },
  { id: '901-03', number: '901-03', title: 'الخدمات السحابية', icon: Cloud },
  { id: '901-04', number: '901-04', title: 'التصنيفات والتسميات', icon: Tag },
  { id: '901-05', number: '901-05', title: 'الصلاحيات والأمان', icon: Shield },
  { id: '901-06', number: '901-06', title: 'سجل التغييرات', icon: Clock },
  { id: '901-07', number: '901-07', title: 'إعدادات التخزين', icon: HardDrive },
  { id: '901-08', number: '901-08', title: 'النسخ الاحتياطي', icon: Archive }
];

const DocumentsFilesManagement_Complete_901_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('901-01');
  const [showServiceSettings, setShowServiceSettings] = useState(false);
  const [selectedService, setSelectedService] = useState<CloudService | null>(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // إعدادات قابلة للتعديل
  const [ftpHost, setFtpHost] = useState('ftp.example.com');
  const [ftpPort, setFtpPort] = useState('21');
  const [maxFileSize, setMaxFileSize] = useState('100');
  const [storagePath, setStoragePath] = useState('/var/storage/documents');

  // مؤشرات التفعيل
  const [enableAutoSync, setEnableAutoSync] = useState(true);
  const [enableAutoBackup, setEnableAutoBackup] = useState(true);
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [enableVersionControl, setEnableVersionControl] = useState(true);

  // بيانات تجريبية
  const [cloudServices] = useState<CloudService[]>([
    {
      id: 'cs1', name: 'FTP - الخادم الرئيسي', type: 'ftp', status: 'connected',
      lastSync: '2025-10-24 14:30', totalSize: 500, usedSize: 320,
      config: { host: 'ftp.example.com', port: 21, syncEnabled: true, autoBackup: true }
    },
    {
      id: 'cs2', name: 'Google Drive - المعاملات', type: 'gdrive', status: 'connected',
      lastSync: '2025-10-24 13:45', totalSize: 15, usedSize: 8.5,
      config: { syncEnabled: true, autoBackup: false }
    },
    {
      id: 'cs3', name: 'OneDrive - المستندات', type: 'onedrive', status: 'disconnected',
      lastSync: '2025-10-23 10:15', totalSize: 1024, usedSize: 250,
      config: { syncEnabled: false, autoBackup: false }
    },
    {
      id: 'cs4', name: 'AWS S3 - الأرشيف', type: 's3', status: 'connected',
      lastSync: '2025-10-24 12:00', totalSize: 5000, usedSize: 1250,
      config: { bucket: 'archive-bucket', region: 'eu-west-1', syncEnabled: true, autoBackup: true }
    }
  ]);

  const [transactionFiles] = useState<FileItem[]>([
    {
      id: 'f1', name: 'عقد إنشاء مبنى سكني.pdf', type: 'file', size: '2.4 MB',
      modified: '2025-10-24 10:30', owner: 'أحمد محمد', classification: 'sensitive',
      tags: ['عقود', 'إنشاءات'], transactionId: 'TXN-2025-001', clientName: 'محمد بن علي'
    },
    {
      id: 'f2', name: 'تقرير فني - مشروع الرياض.docx', type: 'file', size: '1.8 MB',
      modified: '2025-10-23 15:20', owner: 'فاطمة أحمد', classification: 'medium',
      tags: ['تقارير', 'فني'], transactionId: 'TXN-2025-002', clientName: 'شركة البناء الحديثة'
    },
    {
      id: 'f3', name: 'رخصة بناء - مشروع جدة.pdf', type: 'file', size: '856 KB',
      modified: '2025-10-22 09:15', owner: 'خالد سعد', classification: 'sensitive',
      tags: ['رخص', 'بلدية'], transactionId: 'TXN-2025-003', clientName: 'سارة بنت خالد'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      connected: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">متصل</Badge>,
      disconnected: <Badge className="bg-gray-500 text-white text-xs px-1.5 py-0 h-5">غير متصل</Badge>,
      error: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">خطأ</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getClassificationBadge = (classification: string) => {
    const badges = {
      normal: <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">عادي</Badge>,
      medium: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">متوسط</Badge>,
      sensitive: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">حساس</Badge>
    };
    return badges[classification as keyof typeof badges] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getServiceIcon = (type: string) => {
    const icons = {
      ftp: Server,
      gdrive: Cloud,
      onedrive: Cloud,
      dropbox: Cloud,
      s3: Database,
      local: HardDrive
    };
    const Icon = icons[type as keyof typeof icons] || Server;
    return <Icon className="h-4 w-4" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '901-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملفات المعاملات</h2>
                <Badge className="bg-blue-500 text-white text-xs px-2 py-0">{transactionFiles.length} ملف</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Search className="h-3 w-3 ml-1" />بحث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Upload className="h-3 w-3 ml-1" />رفع ملف</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'إجمالي الملفات', value: '1,234', icon: File, color: '#3b82f6' },
                { label: 'الملفات الحساسة', value: '345', icon: Lock, color: '#ef4444' },
                { label: 'الحجم الكلي', value: '45.6 GB', icon: HardDrive, color: '#10b981' },
                { label: 'تم اليوم', value: '23', icon: Calendar, color: '#f59e0b' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول الملفات */}
            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التعديل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionFiles.map((file) => (
                      <TableRow key={file.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.name}</span>
                            <File className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{file.size}</TableCell>
                        <TableCell className="text-right py-2">{getClassificationBadge(file.classification)}</TableCell>
                        <TableCell className="text-right py-2">
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{file.transactionId}</code>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.clientName}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{file.modified}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                setSelectedFile(file);
                                setShowFileDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '901-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملفات النظام</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><FolderPlus className="h-3 w-3 ml-1" />مجلد جديد</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><FilePlus className="h-3 w-3 ml-1" />ملف جديد</Button>
              </div>
            </div>

            {/* المجلدات الرئيسية */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'المستندات الإدارية', count: 234, size: '12.4 GB', icon: Briefcase, color: '#3b82f6' },
                { name: 'القوالب والنماذج', count: 56, size: '2.1 GB', icon: FileText, color: '#10b981' },
                { name: 'التقارير', count: 189, size: '8.7 GB', icon: Database, color: '#f59e0b' },
                { name: 'الأرشيف', count: 456, size: '35.2 GB', icon: Archive, color: '#6366f1' },
                { name: 'النسخ الاحتياطي', count: 12, size: '125.6 GB', icon: HardDrive, color: '#8b5cf6' },
                { name: 'السجلات', count: 1234, size: '5.4 GB', icon: Clock, color: '#ec4899' }
              ].map((folder, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                      {React.createElement(folder.icon, { className: 'h-5 w-5', style: { color: folder.color } })}
                      <div className="flex-1">
                        <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{folder.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{folder.count} ملف</Badge>
                          <span className="text-xs text-gray-500">{folder.size}</span>
                        </div>
                      </div>
                      <Folder className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* أحدث الملفات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Clock className="h-4 w-4" />
                  أحدث الملفات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { name: 'تقرير الأداء الشهري.xlsx', folder: 'التقارير', time: 'منذ 15 دقيقة', user: 'أحمد محمد' },
                    { name: 'عقد توظيف - نموذج.docx', folder: 'القوالب', time: 'منذ ساعة', user: 'فاطمة سعد' },
                    { name: 'كشف الرواتب - أكتوبر.pdf', folder: 'المستندات الإدارية', time: 'منذ ساعتين', user: 'خالد علي' }
                  ].map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      <File className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{file.folder}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{file.time}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{file.user}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">فتح</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '901-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمات السحابية</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />إضافة خدمة</Button>
            </div>

            {/* قائمة الخدمات */}
            <div className="grid grid-cols-2 gap-3">
              {cloudServices.map((service) => {
                const usagePercent = (service.usedSize / service.totalSize) * 100;
                return (
                  <Card key={service.id} className="card-element card-rtl">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(service.type)}
                          <div>
                            <h3 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{service.name}</h3>
                            <p className="text-xs text-gray-500">آخر مزامنة: {service.lastSync}</p>
                          </div>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعة المستخدمة</span>
                            <span className="text-xs">{service.usedSize.toFixed(1)} / {service.totalSize} GB</span>
                          </div>
                          <Progress value={usagePercent} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{usagePercent.toFixed(1)}% مستخدم</p>
                        </div>

                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => {
                              setSelectedService(service);
                              setShowServiceSettings(true);
                            }}
                          >
                            <Settings className="h-3 w-3 ml-1" />
                            إعدادات
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                            <RefreshCw className="h-3 w-3 ml-1" />
                            مزامنة
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '901-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيفات والتسميات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />إضافة تصنيف</Button>
            </div>

            {/* التصنيفات الأمنية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  التصنيفات الأمنية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'عادي', count: 2456, color: '#10b981', icon: Info },
                    { name: 'متوسط', count: 567, color: '#f59e0b', icon: AlertCircle },
                    { name: 'حساس', count: 123, color: '#ef4444', icon: AlertTriangle }
                  ].map((cat, i) => (
                    <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          {React.createElement(cat.icon, { className: 'h-4 w-4', style: { color: cat.color } })}
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cat.name}</p>
                        </div>
                        <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cat.count}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* التسميات (Tags) */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Tag className="h-4 w-4" />
                  التسميات الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="flex flex-wrap gap-2">
                  {[
                    'عقود', 'تقارير', 'رخص', 'فواتير', 'مراسلات', 'فني', 'إداري',
                    'مالي', 'قانوني', 'تقني', 'بلدية', 'حكومي'
                  ].map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-2 py-1 cursor-pointer hover:bg-blue-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '901-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات والأمان</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ التغييرات</Button>
            </div>

            {/* إعدادات الأمان */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  إعدادات الأمان العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-encryption"
                  label="تشفير الملفات الحساسة"
                  description="تشفير تلقائي للملفات المصنفة كحساسة"
                  checked={enableEncryption}
                  onCheckedChange={setEnableEncryption}
                  size="sm"
                  variant="success"
                />

                <EnhancedSwitch
                  id="enable-version-control"
                  label="التحكم في الإصدارات"
                  description="حفظ نسخ من الملفات عند كل تعديل"
                  checked={enableVersionControl}
                  onCheckedChange={setEnableVersionControl}
                  size="sm"
                  variant="default"
                />

                <div className="form-rtl">
                  <Label className="text-xs">الحد الأقصى لحجم الملف (MB)</Label>
                  <InputWithCopy
                    id="max-file-size"
                    value={maxFileSize}
                    onChange={(e) => setMaxFileSize(e.target.value)}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* صلاحيات الوصول */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Users className="h-4 w-4" />
                  صلاحيات الوصول
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المجموعة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحميل</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>حذف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { group: 'المديرون', view: true, download: true, upload: true, delete: true },
                      { group: 'المهندسون', view: true, download: true, upload: true, delete: false },
                      { group: 'المحاسبون', view: true, download: true, upload: false, delete: false },
                      { group: 'الموظفون', view: true, download: false, upload: false, delete: false }
                    ].map((perm, i) => (
                      <TableRow key={i} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{perm.group}</TableCell>
                        <TableCell className="text-right py-2">
                          {perm.view ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          {perm.download ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          {perm.upload ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          {perm.delete ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '901-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التغييرات</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-96">
                  <div className="space-y-2 pr-2">
                    {[
                      { action: 'رفع ملف', file: 'عقد إنشاء مبنى.pdf', user: 'أحمد محمد', time: '2025-10-24 10:30', type: 'upload' },
                      { action: 'تحميل ملف', file: 'تقرير فني.docx', user: 'فاطمة أحمد', time: '2025-10-24 09:15', type: 'download' },
                      { action: 'حذف ملف', file: 'مستند قديم.pdf', user: 'خالد سعد', time: '2025-10-23 14:20', type: 'delete' },
                      { action: 'تعديل ملف', file: 'كشف الحسابات.xlsx', user: 'سارة علي', time: '2025-10-23 11:45', type: 'edit' },
                      { action: 'مشاركة ملف', file: 'العرض التقديمي.pptx', user: 'محمد خالد', time: '2025-10-22 16:30', type: 'share' }
                    ].map((log, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        <div className={`p-1.5 rounded ${
                          log.type === 'upload' ? 'bg-green-100' :
                          log.type === 'download' ? 'bg-blue-100' :
                          log.type === 'delete' ? 'bg-red-100' :
                          log.type === 'edit' ? 'bg-yellow-100' :
                          'bg-purple-100'
                        }`}>
                          {log.type === 'upload' && <Upload className="h-3.5 w-3.5 text-green-600" />}
                          {log.type === 'download' && <Download className="h-3.5 w-3.5 text-blue-600" />}
                          {log.type === 'delete' && <Trash2 className="h-3.5 w-3.5 text-red-600" />}
                          {log.type === 'edit' && <Edit className="h-3.5 w-3.5 text-yellow-600" />}
                          {log.type === 'share' && <Share2 className="h-3.5 w-3.5 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}: <strong>{log.file}</strong></p>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{log.user}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{log.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '901-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات التخزين</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ التغييرات</Button>
            </div>

            {/* إحصائيات التخزين */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'السعة الكلية', value: '2 TB', icon: HardDrive, color: '#3b82f6' },
                { label: 'المستخدم', value: '845 GB', icon: Database, color: '#10b981' },
                { label: 'المتاح', value: '1.17 TB', icon: Server, color: '#f59e0b' },
                { label: 'نسبة الاستخدام', value: '41%', icon: Box, color: '#8b5cf6' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* إعدادات المسارات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Folder className="h-4 w-4" />
                  مسارات التخزين
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="form-rtl">
                  <Label className="text-xs">المسار الرئيسي</Label>
                  <InputWithCopy
                    id="storage-path"
                    value={storagePath}
                    onChange={(e) => setStoragePath(e.target.value)}
                    copyable={true}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-auto-organize"
                  label="التنظيم التلقائي للملفات"
                  description="تنظيم الملفات حسب التاريخ والنوع"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="enable-compression"
                  label="ضغط الملفات القديمة"
                  description="ضغط الملفات غير المستخدمة لتوفير المساحة"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>
          </div>
        );

      case '901-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الاحتياطي</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Archive className="h-3 w-3 ml-1" />نسخ احتياطي الآن</Button>
            </div>

            {/* إعدادات النسخ الاحتياطي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات النسخ الاحتياطي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-auto-backup"
                  label="النسخ الاحتياطي التلقائي"
                  description="إنشاء نسخ احتياطية تلقائياً بشكل دوري"
                  checked={enableAutoBackup}
                  onCheckedChange={setEnableAutoBackup}
                  size="sm"
                  variant="default"
                />

                <div className="form-rtl">
                  <Label className="text-xs">التكرار</Label>
                  <SelectWithCopy
                    id="backup-frequency"
                    label=""
                    value="daily"
                    onChange={() => {}}
                    options={[
                      { value: 'hourly', label: 'كل ساعة' },
                      { value: 'daily', label: 'يومياً' },
                      { value: 'weekly', label: 'أسبوعياً' },
                      { value: 'monthly', label: 'شهرياً' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-backup-compression"
                  label="ضغط النسخ الاحتياطية"
                  description="ضغط الملفات لتوفير المساحة"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>

            {/* آخر النسخ الاحتياطية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Archive className="h-4 w-4" />
                  آخر النسخ الاحتياطية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملفات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2025-10-24 02:00', size: '125.6 GB', files: '12,456', status: 'success' },
                      { date: '2025-10-23 02:00', size: '124.8 GB', files: '12,389', status: 'success' },
                      { date: '2025-10-22 02:00', size: '123.2 GB', files: '12,234', status: 'success' },
                      { date: '2025-10-21 02:00', size: '122.1 GB', files: '12,123', status: 'success' }
                    ].map((backup, i) => (
                      <TableRow key={i} className="hover:bg-cyan-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs">{backup.date}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.size}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.files}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">ناجح</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              <Repeat className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-901" position="top-right" />
      
      {/* هيدر الشاشة الاحترافي v4.2.2 */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
          padding: '0',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div 
          className="flex items-center justify-between"
          style={{
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
          }}
        >
          {/* القسم الأيمن */}
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                border: '2px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              <Folder 
                className="h-6 w-6" 
                style={{ 
                  color: '#2563eb',
                  filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' 
                }} 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 
                  style={{ 
                    fontFamily: 'Tajawal, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '20px', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  إدارة الملفات والمستندات
                </h1>
                
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <span 
                    className="font-mono" 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em'
                    }}
                  >
                    901
                  </span>
                </div>
              </div>
              
              <p 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '13px', 
                  color: '#64748b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  background: '#94a3b8',
                  display: 'inline-block'
                }}></span>
                نظام شامل لإدارة الملفات والخدمات السحابية
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر */}
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '6px 14px',
                background: 'rgba(37, 99, 235, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.15)'
              }}
            >
              <span 
                style={{ 
                  fontFamily: 'Tajawal, sans-serif', 
                  fontSize: '12px', 
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                8 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* Dialog إعدادات الخدمة */}
      <Dialog open={showServiceSettings} onOpenChange={setShowServiceSettings}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الخدمة السحابية</DialogTitle>
            <DialogDescription className="dialog-description">تكوين وإدارة الخدمة السحابية</DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-3">
              <div className="form-rtl space-y-2">
                <div>
                  <Label className="text-xs">اسم الخدمة</Label>
                  <InputWithCopy
                    id="service-name"
                    value={selectedService.name}
                    onChange={() => {}}
                    copyable={true}
                    clearable={true}
                  />
                </div>

                {selectedService.type === 'ftp' && (
                  <>
                    <div>
                      <Label className="text-xs">عنوان الخادم</Label>
                      <InputWithCopy
                        id="ftp-host"
                        value={ftpHost}
                        onChange={(e) => setFtpHost(e.target.value)}
                        copyable={true}
                        clearable={true}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">المنفذ</Label>
                      <InputWithCopy
                        id="ftp-port"
                        value={ftpPort}
                        onChange={(e) => setFtpPort(e.target.value)}
                        type="number"
                        copyable={false}
                        clearable={true}
                      />
                    </div>
                  </>
                )}

                <EnhancedSwitch
                  id="service-auto-sync"
                  label="المزامنة التلقائية"
                  description="مزامنة الملفات تلقائياً"
                  checked={enableAutoSync}
                  onCheckedChange={setEnableAutoSync}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="service-auto-backup"
                  label="النسخ الاحتياطي التلقائي"
                  description="إنشاء نسخ احتياطية تلقائياً"
                  checked={enableAutoBackup}
                  onCheckedChange={setEnableAutoBackup}
                  size="sm"
                  variant="success"
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowServiceSettings(false)}>
                  إلغاء
                </Button>
                <Button className="flex-1 bg-blue-500">
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog تفاصيل الملف */}
      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الملف</DialogTitle>
            <DialogDescription className="dialog-description">معلومات كاملة عن الملف</DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-rtl">
                  <Label className="text-xs">اسم الملف</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedFile.name}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الحجم</Label>
                  <p className="text-sm mt-1">{selectedFile.size}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">التصنيف</Label>
                  <div className="mt-1">{getClassificationBadge(selectedFile.classification)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المالك</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedFile.owner}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">التعديل الأخير</Label>
                  <p className="text-sm mt-1">{selectedFile.modified}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المعاملة</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedFile.transactionId}</code>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 ml-2" />
                  مشاركة
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowFileDialog(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsFilesManagement_Complete_901_v8;
