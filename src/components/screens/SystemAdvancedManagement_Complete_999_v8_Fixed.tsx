/**
 * الشاشة 999 - إدارة النظام المتقدمة - v8.1
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  Settings, Activity, Shield, Users, Database, Server,
  Cpu, HardDrive, Network, Bell, BarChart3, Archive,
  Lock, FileText, Eye, Download, LogOut, Monitor,
  Check, RefreshCw, Trash2, AlertTriangle, Info, Zap,
  Clock, Calendar, ChevronRight, Search, Filter,
  TrendingUp, TrendingDown, Minus, Play, Pause, Mail, 
  MemoryStick, Gauge, Building2, UserCircle, Folder,
  FileType, Package, Layers, PieChart
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import HeaderSettingsManager from '../HeaderSettingsManager';
import { toast } from 'sonner@2.0.3';

const TABS_CONFIG: TabConfig[] = [
  { id: '999-01', number: '999-01', title: 'نظرة عامة', icon: Activity },
  { id: '999-02', number: '999-02', title: 'الجلسات النشطة', icon: Users },
  { id: '999-03', number: '999-03', title: 'سجل النظام', icon: FileText },
  { id: '999-04', number: '999-04', title: 'موارد النظام', icon: Server },
  { id: '999-05', number: '999-05', title: 'قاعدة البيانات', icon: Database },
  { id: '999-06', number: '999-06', title: 'الأمان', icon: Shield },
  { id: '999-07', number: '999-07', title: 'النسخ الاحتياطي', icon: Archive },
  { id: '999-08', number: '999-08', title: 'الإحصائيات', icon: BarChart3 },
  { id: '999-09', number: '999-09', title: 'إعدادات الهيدر', icon: Monitor },
  { id: '999-10', number: '999-10', title: 'إعدادات النظام', icon: Settings },
  { id: '999-11', number: '999-11', title: 'ذاكرة البريد', icon: Mail },
  { id: '999-12', number: '999-12', title: 'مراقبة الموارد', icon: MemoryStick },
];

interface ActiveSession {
  id: string;
  userName: string;
  device: string;
  loginTime: string;
  status: 'active' | 'idle';
}

interface SystemLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  category: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'error' | 'security';
  screen: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  duration: string;
}

interface BackupRecord {
  id: string;
  date: string;
  time: string;
  size: string;
  type: 'full' | 'incremental' | 'manual';
  status: 'success' | 'failed' | 'running';
  location: string;
}

const SystemAdvancedManagement_Complete_999_v8_Fixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('999-01');
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  
  // إعدادات الأمان
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [require2FA, setRequire2FA] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [allowMultipleSessions, setAllowMultipleSessions] = useState(true);
  
  // إعدادات النسخ الاحتياطي
  const [backupTime, setBackupTime] = useState('02:00');
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState('7');
  const [backupLocation, setBackupLocation] = useState('/backup');
  
  // إعدادات الأداء
  const [maxCpuUsage, setMaxCpuUsage] = useState('80');
  const [cacheSize, setCacheSize] = useState('512');
  const [dbConnections, setDbConnections] = useState('100');

  const mockSessions: ActiveSession[] = [
    { id: 'SES-001', userName: 'أحمد محمد', device: 'Chrome - Windows', loginTime: '10:30', status: 'active' },
    { id: 'SES-002', userName: 'سارة علي', device: 'Safari - macOS', loginTime: '09:15', status: 'active' },
    { id: 'SES-003', userName: 'خالد السالم', device: 'Edge - Windows', loginTime: '11:00', status: 'idle' },
  ];

  const mockSystemLogs: SystemLog[] = [
    { id: 'LOG-001', timestamp: '2025-10-31 14:30:25', userName: 'أحمد محمد', action: 'تسجيل دخول', category: 'login', screen: 'SCR-001', details: 'تسجيل دخول ناجح', ipAddress: '192.168.1.100', status: 'success', duration: '1.2s' },
    { id: 'LOG-002', timestamp: '2025-10-31 14:25:18', userName: 'سارة علي', action: 'إنشاء معاملة', category: 'create', screen: 'SCR-284', details: 'إنشاء معاملة جديدة رقم 2510001', ipAddress: '192.168.1.105', status: 'success', duration: '2.5s' },
    { id: 'LOG-003', timestamp: '2025-10-31 14:20:45', userName: 'خالد السالم', action: 'تحديث', category: 'update', screen: 'SCR-300', details: 'تحديث بيانات العميل', ipAddress: '192.168.1.110', status: 'success', duration: '0.8s' },
    { id: 'LOG-004', timestamp: '2025-10-31 14:15:32', userName: 'فاطمة حسن', action: 'حذف', category: 'delete', screen: 'SCR-901', details: 'حذف مستند قديم', ipAddress: '192.168.1.115', status: 'warning', duration: '1.1s' },
    { id: 'LOG-005', timestamp: '2025-10-31 14:10:08', userName: 'محمد عبدالله', action: 'تصدير', category: 'export', screen: 'SCR-222', details: 'تصدير تقرير مالي', ipAddress: '192.168.1.120', status: 'success', duration: '3.2s' },
    { id: 'LOG-006', timestamp: '2025-10-31 14:05:55', userName: 'نورة أحمد', action: 'محاولة دخول فاشلة', category: 'security', screen: 'LOGIN', details: 'محاولة دخول بكلمة مرور خاطئة', ipAddress: '192.168.1.125', status: 'failed', duration: '0.5s' },
    { id: 'LOG-007', timestamp: '2025-10-31 14:00:12', userName: 'عبدالرحمن سعيد', action: 'عرض', category: 'view', screen: 'SCR-815', details: 'عرض عرض السعر', ipAddress: '192.168.1.130', status: 'success', duration: '0.6s' },
    { id: 'LOG-008', timestamp: '2025-10-31 13:55:40', userName: 'ريم خالد', action: 'خطأ', category: 'error', screen: 'SCR-666', details: 'خطأ في تحميل البيانات', ipAddress: '192.168.1.135', status: 'failed', duration: '5.0s' },
  ];

  const mockBackups: BackupRecord[] = [
    { id: 'BKP-001', date: '2025-10-31', time: '02:00', size: '2.4 GB', type: 'full', status: 'success', location: '/backup/2025-10-31-full.sql' },
    { id: 'BKP-002', date: '2025-10-30', time: '02:00', size: '450 MB', type: 'incremental', status: 'success', location: '/backup/2025-10-30-inc.sql' },
    { id: 'BKP-003', date: '2025-10-29', time: '02:00', size: '380 MB', type: 'incremental', status: 'success', location: '/backup/2025-10-29-inc.sql' },
    { id: 'BKP-004', date: '2025-10-28', time: '02:00', size: '520 MB', type: 'incremental', status: 'success', location: '/backup/2025-10-28-inc.sql' },
    { id: 'BKP-005', date: '2025-10-27', time: '14:30', size: '2.3 GB', type: 'manual', status: 'success', location: '/backup/2025-10-27-manual.sql' },
    { id: 'BKP-006', date: '2025-10-26', time: '02:00', size: '410 MB', type: 'incremental', status: 'failed', location: '/backup/2025-10-26-inc.sql' },
  ];

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نشط</Badge>
    ) : (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-yellow-500 text-white">خامل</Badge>
    );
  };

  const getLogStatusBadge = (status: 'success' | 'failed' | 'warning') => {
    if (status === 'success') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نجح</Badge>;
    } else if (status === 'failed') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500 text-white">فشل</Badge>;
    } else {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-yellow-500 text-white">تحذير</Badge>;
    }
  };

  const getLogCategoryIcon = (category: SystemLog['category']) => {
    const iconProps = { className: 'h-3.5 w-3.5' };
    switch (category) {
      case 'login': return <Users {...iconProps} />;
      case 'logout': return <LogOut {...iconProps} />;
      case 'create': return <Check {...iconProps} />;
      case 'update': return <RefreshCw {...iconProps} />;
      case 'delete': return <Trash2 {...iconProps} />;
      case 'view': return <Eye {...iconProps} />;
      case 'export': return <Download {...iconProps} />;
      case 'error': return <AlertTriangle {...iconProps} />;
      case 'security': return <Shield {...iconProps} />;
      default: return <Info {...iconProps} />;
    }
  };

  const getBackupTypeBadge = (type: 'full' | 'incremental' | 'manual') => {
    if (type === 'full') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-blue-500 text-white">كامل</Badge>;
    } else if (type === 'incremental') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-purple-500 text-white">تزايدي</Badge>;
    } else {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-orange-500 text-white">يدوي</Badge>;
    }
  };

  const getBackupStatusBadge = (status: 'success' | 'failed' | 'running') => {
    if (status === 'success') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">ناجح</Badge>;
    } else if (status === 'failed') {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-red-500 text-white">فشل</Badge>;
    } else {
      return <Badge className="text-xs px-1.5 py-0 h-5 bg-blue-500 text-white">قيد التشغيل</Badge>;
    }
  };

  const handleBackupNow = () => {
    toast.success('تم بدء النسخ الاحتياطي', {
      description: 'جاري إنشاء نسخة احتياطية كاملة من قاعدة البيانات...'
    });
  };

  const handleRestoreBackup = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowBackupDialog(true);
  };

  const handleSaveSecuritySettings = () => {
    // حفظ في localStorage
    const securitySettings = {
      minPasswordLength,
      sessionTimeout,
      maxLoginAttempts,
      require2FA,
      requireUppercase,
      requireNumbers,
      requireSpecialChars,
      allowMultipleSessions
    };
    localStorage.setItem('system_security_settings', JSON.stringify(securitySettings));
    toast.success('تم حفظ إعدادات الأمان بنجاح');
  };

  const handleSaveBackupSettings = () => {
    const backupSettings = {
      autoBackup,
      backupTime,
      backupFrequency,
      retentionDays,
      backupLocation
    };
    localStorage.setItem('system_backup_settings', JSON.stringify(backupSettings));
    toast.success('تم حفظ إعدادات النسخ الاحتياطي بنجاح');
  };

  const handleSavePerformanceSettings = () => {
    const performanceSettings = {
      maxCpuUsage,
      cacheSize,
      dbConnections
    };
    localStorage.setItem('system_performance_settings', JSON.stringify(performanceSettings));
    toast.success('تم حفظ إعدادات الأداء بنجاح');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '999-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على النظام</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تقرير شامل
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">24</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستخدمون نشطون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Server className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">99.8%</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>وقت التشغيل</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Database className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">2.4 GB</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حجم البيانات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Archive className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">156</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسخ احتياطية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Cpu className="h-4 w-4" />
                  موارد النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعالج (CPU)</span>
                      <span className="text-xs font-mono">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الذاكرة (RAM)</span>
                      <span className="text-xs font-mono">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القرص الصلب</span>
                      <span className="text-xs font-mono">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجلسات النشطة</h2>
              <Badge variant="outline" className="text-xs">{mockSessions.length} جلسة</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهاز</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>وقت الدخول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{session.id}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.userName}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.device}</TableCell>
                        <TableCell className="text-right py-2 text-xs font-mono">{session.loginTime}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(session.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><LogOut className="h-3 w-3" /></Button>
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

      case '999-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل النظام</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />تصفية
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Search className="h-3 w-3 ml-1" />بحث
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
                <CardContent className="p-2 text-center">
                  <Check className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl text-green-600 mb-0.5">5,234</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات ناجحة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #ef4444' }}>
                <CardContent className="p-2 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl text-red-600 mb-0.5">42</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات فاشلة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
                <CardContent className="p-2 text-center">
                  <Info className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl text-orange-600 mb-0.5">158</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحذيرات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl text-purple-600 mb-0.5">12</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أحداث أمنية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <ScrollArea className="h-[500px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاشة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-purple-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs font-mono">{log.timestamp}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.userName}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              {getLogCategoryIcon(log.category)}
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{log.screen}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.details}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{log.ipAddress}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{log.duration}</TableCell>
                          <TableCell className="text-right py-2">{getLogStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedLog(log);
                                setShowLogDetails(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '999-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>موارد النظام</h2>
              <Button size="sm" className="h-8 text-xs bg-orange-500" onClick={handleSavePerformanceSettings}>
                <Download className="h-3 w-3 ml-1" />حفظ الإعدادات
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  مراقبة الأداء الحالي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المورد</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتوسط</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الذروة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرسم البياني</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1 justify-end">
                          <Cpu className="h-3.5 w-3.5 text-blue-600" />
                          المعالج (CPU)
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">45%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">42%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">89%</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">طبيعي</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Progress value={45} className="h-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1 justify-end">
                          <HardDrive className="h-3.5 w-3.5 text-green-600" />
                          الذاكرة (RAM)
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">62%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">58%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">85%</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">طبيعي</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Progress value={62} className="h-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1 justify-end">
                          <Server className="h-3.5 w-3.5 text-orange-600" />
                          القرص الصلب
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">78%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">72%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">92%</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-yellow-500 text-white">تحذير</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Progress value={78} className="h-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1 justify-end">
                          <Network className="h-3.5 w-3.5 text-purple-600" />
                          الشبكة
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">35%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">40%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">78%</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">طبيعي</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Progress value={35} className="h-2" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1 justify-end">
                          <Database className="h-3.5 w-3.5 text-cyan-600" />
                          قاعدة البيانات
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">52%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">48%</TableCell>
                      <TableCell className="text-right py-2 text-xs font-mono">81%</TableCell>
                      <TableCell className="text-right py-2">
                        <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">طبيعي</Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Progress value={52} className="h-2" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Cpu className="h-4 w-4" />
                    إعدادات المعالج
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <InputWithCopy
                    label="الحد الأقصى للاستخدام (%)"
                    id="max-cpu"
                    value={maxCpuUsage}
                    onChange={(e) => setMaxCpuUsage(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <EnhancedSwitch
                    id="cpu-auto-optimize"
                    label="تحسين تلقائي"
                    description="تفعيل التحسين التلقائي للمعالج"
                    checked={true}
                    onCheckedChange={() => {}}
                    size="sm"
                    variant="success"
                  />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <HardDrive className="h-4 w-4" />
                    إعدادات الذاكرة المؤقتة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <InputWithCopy
                    label="حجم الذاكرة المؤقتة (MB)"
                    id="cache-size"
                    value={cacheSize}
                    onChange={(e) => setCacheSize(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <EnhancedSwitch
                    id="cache-compression"
                    label="ضغط البيانات"
                    description="تفعيل ضغط البيانات في الذاكرة المؤقتة"
                    checked={true}
                    onCheckedChange={() => {}}
                    size="sm"
                    variant="success"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Database className="h-4 w-4" />
                  إعدادات قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <InputWithCopy
                  label="الاتصالات المتزامنة"
                  id="db-connections"
                  value={dbConnections}
                  onChange={(e) => setDbConnections(e.target.value)}
                  type="number"
                  copyable={true}
                  clearable={true}
                />
                <EnhancedSwitch
                  id="db-optimize"
                  label="تحسين الاستعلامات"
                  description="تفعيل التحسين التلقائي للاستعلامات"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>
          </div>
        );

      case '999-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قاعدة البيانات</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <RefreshCw className="h-3 w-3 ml-1" />تحديث
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Zap className="h-3 w-3 ml-1" />تحسين
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
                <CardContent className="p-2 text-center">
                  <Database className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl text-blue-600 mb-0.5">2.4 GB</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حجم قاعدة البيانات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
                <CardContent className="p-2 text-center">
                  <Server className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl text-green-600 mb-0.5">45</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الجداول</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl text-purple-600 mb-0.5">89</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الفهارس</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl text-orange-600 mb-0.5">1.2s</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الاستعلام</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Zap className="h-4 w-4" />
                    أدوات التحسين
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <RefreshCw className="h-3 w-3 ml-1" />تحسين الجداول (45 جدول)
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <TrendingUp className="h-3 w-3 ml-1" />إعادة بناء الفهارس (89 فهرس)
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <Check className="h-3 w-3 ml-1" />إصلاح الجداول التالفة
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <BarChart3 className="h-3 w-3 ml-1" />تحديث الإحصائيات
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Eye className="h-4 w-4" />
                    فحص السلامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <Shield className="h-3 w-3 ml-1" />فحص سلامة قاعدة البيانات
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <FileText className="h-3 w-3 ml-1" />تحليل الاستعلامات البطيئة
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <Lock className="h-3 w-3 ml-1" />فحص الأذونات
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start">
                    <AlertTriangle className="h-3 w-3 ml-1" />تقرير الأخطاء
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  استخدام مساحة التخزين
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة المستخدمة</span>
                    <span className="text-xs font-mono">2.4 GB / 10 GB</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <div className="text-center p-1 bg-blue-50 rounded">
                    <p className="text-blue-600">جداول: 1.8 GB</p>
                  </div>
                  <div className="text-center p-1 bg-purple-50 rounded">
                    <p className="text-purple-600">فهارس: 450 MB</p>
                  </div>
                  <div className="text-center p-1 bg-green-50 rounded">
                    <p className="text-green-600">سجلات: 150 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأمان</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500" onClick={handleSaveSecuritySettings}>
                <Shield className="h-3 w-3 ml-1" />حفظ الإعدادات
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Lock className="h-4 w-4" />
                    سياسات كلمات المرور
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <InputWithCopy
                    label="الحد الأدنى لطول كلمة المرور"
                    id="min-password"
                    value={minPasswordLength}
                    onChange={(e) => setMinPasswordLength(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <EnhancedSwitch
                    id="require-uppercase"
                    label="تتطلب حروف كبيرة وصغيرة"
                    checked={requireUppercase}
                    onCheckedChange={setRequireUppercase}
                    size="sm"
                    variant="default"
                  />
                  <EnhancedSwitch
                    id="require-numbers"
                    label="تتطلب أرقام"
                    checked={requireNumbers}
                    onCheckedChange={setRequireNumbers}
                    size="sm"
                    variant="default"
                  />
                  <EnhancedSwitch
                    id="require-special"
                    label="تتطلب رموز خاصة"
                    checked={requireSpecialChars}
                    onCheckedChange={setRequireSpecialChars}
                    size="sm"
                    variant="default"
                  />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-4 w-4" />
                    سياسات الجلسات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <InputWithCopy
                    label="مدة انتهاء الجلسة الخاملة (دقيقة)"
                    id="session-timeout"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <EnhancedSwitch
                    id="allow-multiple-sessions"
                    label="السماح بجلسات متعددة"
                    description="السماح للمستخدم بعدة جلسات نشطة"
                    checked={allowMultipleSessions}
                    onCheckedChange={setAllowMultipleSessions}
                    size="sm"
                    variant="default"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  سياسات تسجيل الدخول
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <InputWithCopy
                    label="عدد المحاولات الفاشلة القصوى"
                    id="max-login-attempts"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <div>
                    <EnhancedSwitch
                      id="require-2fa"
                      label="المصادقة الثنائية (2FA)"
                      description="إلزامي لجميع المستخدمين"
                      checked={require2FA}
                      onCheckedChange={setRequire2FA}
                      size="sm"
                      variant="warning"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertTriangle className="h-4 w-4" />
                  الأحداث الأمنية الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {mockSystemLogs.filter(log => log.category === 'security').map((log) => (
                    <div 
                      key={log.id}
                      className="p-2 bg-red-50 border border-red-200 rounded-lg"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-red-600" />
                          <span className="text-xs">{log.details}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <span>المستخدم: {log.userName}</span>
                        <span>•</span>
                        <span className="font-mono">{log.ipAddress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الاحتياطي</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSaveBackupSettings}>
                  <Download className="h-3 w-3 ml-1" />حفظ الإعدادات
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={handleBackupNow}>
                  <Play className="h-3 w-3 ml-1" />نسخة احتياطية الآن
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات النسخ الاحتياطي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <InputWithCopy
                    label="وقت النسخ الاحتياطي"
                    id="backup-time"
                    value={backupTime}
                    onChange={(e) => setBackupTime(e.target.value)}
                    type="time"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="تكرار النسخ"
                    id="backup-frequency"
                    value={backupFrequency}
                    onChange={setBackupFrequency}
                    options={[
                      { value: 'daily', label: 'يومي' },
                      { value: 'weekly', label: 'أسبوعي' },
                      { value: 'monthly', label: 'شهري' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <InputWithCopy
                    label="الاحتفاظ بعدد النسخ (أيام)"
                    id="retention-days"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(e.target.value)}
                    type="number"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="موقع التخزين"
                    id="backup-location"
                    value={backupLocation}
                    onChange={(e) => setBackupLocation(e.target.value)}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <EnhancedSwitch
                  id="auto-backup-enabled"
                  label="تفعيل النسخ الاحتياطي التلقائي"
                  description="إنشاء نسخة احتياطية بشكل تلقائي حسب الجدول"
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Archive className="h-4 w-4" />
                  النسخ الاحتياطية المتاحة ({mockBackups.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-[350px]">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBackups.map((backup) => (
                        <TableRow key={backup.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs font-mono">{backup.date}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{backup.time}</TableCell>
                          <TableCell className="text-right py-2 text-xs font-mono">{backup.size}</TableCell>
                          <TableCell className="text-right py-2">{getBackupTypeBadge(backup.type)}</TableCell>
                          <TableCell className="text-right py-2">{getBackupStatusBadge(backup.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => handleRestoreBackup(backup)}
                                disabled={backup.status !== 'success'}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => toast.info('تحميل النسخة الاحتياطية...')}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={() => toast.warning('حذف النسخة الاحتياطية')}
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '999-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Calendar className="h-3 w-3 ml-1" />الفترة
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl text-blue-600 mb-0.5">156</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المستخدمين</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl text-green-600 mb-0.5">45,678</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>طلبات اليوم</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl text-purple-600 mb-0.5">1.8s</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الاستجابة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ borderRight: '3px solid #06b6d4' }}>
                <CardContent className="p-2 text-center">
                  <Server className="h-5 w-5 mx-auto text-cyan-600 mb-1" />
                  <p className="text-xl text-cyan-600 mb-0.5">99.8%</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>وقت التشغيل</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <TrendingUp className="h-4 w-4" />
                    الاستخدام حسب اليوم
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, index) => (
                    <div key={day}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{day}</span>
                        <span className="text-xs font-mono">{(Math.random() * 50000 + 20000).toFixed(0)}</span>
                      </div>
                      <Progress value={Math.random() * 60 + 40} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart3 className="h-4 w-4" />
                    الشاشات الأكثر استخداماً
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  {[
                    { screen: '284', name: 'معالجة المعاملات', percent: 92 },
                    { screen: '001', name: 'الصفحة الرئيسية', percent: 85 },
                    { screen: '815', name: 'عروض الأسعار', percent: 78 },
                    { screen: '300', name: 'إدارة العملاء', percent: 65 },
                    { screen: '222', name: 'الحسابات والمالية', percent: 58 },
                    { screen: '901', name: 'المستندات', percent: 45 },
                    { screen: '999', name: 'إدارة النظام', percent: 32 }
                  ].map((item) => (
                    <div key={item.screen}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <span className="font-mono text-blue-600">{item.screen}</span> - {item.name}
                        </span>
                        <span className="text-xs font-mono">{item.percent}%</span>
                      </div>
                      <Progress value={item.percent} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Activity className="h-4 w-4" />
                  النشاط حسب الوقت (آخر 24 ساعة)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-12 gap-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className="bg-blue-500 rounded-t" 
                        style={{ 
                          height: `${Math.random() * 80 + 20}px`,
                          opacity: 0.3 + Math.random() * 0.7
                        }}
                      />
                      <span className="text-[10px] font-mono text-gray-500">{String(i).padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-09':
        return (
          <div className="space-y-3">
            <HeaderSettingsManager onSettingsChange={(settings) => {
              console.log('Header settings updated:', settings);
            }} />
          </div>
        );

      case '999-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات النظام</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-backup"
                  label="النسخ الاحتياطي التلقائي"
                  description="إنشاء نسخة احتياطية يومياً"
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                  size="sm"
                  variant="success"
                />

                <EnhancedSwitch
                  id="maintenance-mode"
                  label="وضع الصيانة"
                  description="تفعيل وضع الصيانة للنظام"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                  size="sm"
                  variant="warning"
                />
              </CardContent>
            </Card>
          </div>
        );

      case '999-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات ذاكرة البريد الإلكتروني</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => {
                toast.success('تم حفظ إعدادات ذاكرة البريد الإلكتروني');
              }}>
                <Check className="h-3 w-3 ml-1" />
                حفظ الإعدادات
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* بطاقة الحدود الأساسية */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <HardDrive className="h-4 w-4 text-blue-600" />
                    حدود التخزين الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <InputWithCopy
                    label="الحد الأقصى لصندوق الوارد (GB)"
                    id="inbox-max-size"
                    value="5"
                    onChange={() => {}}
                    placeholder="5"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى لحجم الرسالة (MB)"
                    id="message-max-size"
                    value="25"
                    onChange={() => {}}
                    placeholder="25"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى للمرفقات (MB)"
                    id="attachments-max-size"
                    value="10"
                    onChange={() => {}}
                    placeholder="10"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى لعدد المرفقات"
                    id="max-attachments-count"
                    value="5"
                    onChange={() => {}}
                    placeholder="5"
                    required
                  />
                </CardContent>
              </Card>

              {/* بطاقة الرسائل */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Mail className="h-4 w-4 text-green-600" />
                    حدود الرسائل
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <InputWithCopy
                    label="الحد الأقصى لعدد الرسائل (صندوق الوارد)"
                    id="max-inbox-messages"
                    value="10000"
                    onChange={() => {}}
                    placeholder="10000"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى لعدد الرسائل (المرسل)"
                    id="max-sent-messages"
                    value="5000"
                    onChange={() => {}}
                    placeholder="5000"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى للمسودات"
                    id="max-drafts"
                    value="500"
                    onChange={() => {}}
                    placeholder="500"
                    required
                  />

                  <InputWithCopy
                    label="الحد الأقصى للرسائل المحذوفة"
                    id="max-deleted"
                    value="1000"
                    onChange={() => {}}
                    placeholder="1000"
                    required
                  />
                </CardContent>
              </Card>

              {/* بطاقة التنظيف التلقائي */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Trash2 className="h-4 w-4 text-orange-600" />
                    التنظيف التلقائي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <EnhancedSwitch
                    id="auto-cleanup-enabled"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="تفعيل التنظيف التلقائي"
                    description="حذف الرسائل القديمة تلقائياً"
                  />

                  <InputWithCopy
                    label="حذف الرسائل أقدم من (أيام)"
                    id="auto-cleanup-days"
                    value="365"
                    onChange={() => {}}
                    placeholder="365"
                  />

                  <EnhancedSwitch
                    id="cleanup-deleted-folder"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="تفريغ سلة المحذوفات"
                    description="حذف نهائي بعد 30 يوم"
                  />

                  <InputWithCopy
                    label="تفريغ المحذوفات بعد (أيام)"
                    id="cleanup-trash-days"
                    value="30"
                    onChange={() => {}}
                    placeholder="30"
                  />
                </CardContent>
              </Card>

              {/* بطاقة الأرشفة */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Archive className="h-4 w-4 text-purple-600" />
                    الأرشفة التلقائية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-3">
                  <EnhancedSwitch
                    id="auto-archive-enabled"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="تفعيل الأرشفة التلقائية"
                    description="نقل الرسائل القديمة للأرشيف"
                  />

                  <InputWithCopy
                    label="أرشفة الرسائل أقدم من (أيام)"
                    id="auto-archive-days"
                    value="180"
                    onChange={() => {}}
                    placeholder="180"
                  />

                  <SelectWithCopy
                    label="موقع الأرشيف"
                    value="local"
                    onChange={() => {}}
                    options={[
                      { value: 'local', label: 'محلي (Local Storage)' },
                      { value: 'server', label: 'الخادم (Server)' },
                      { value: 'cloud', label: 'السحابة (Cloud)' }
                    ]}
                  />

                  <InputWithCopy
                    label="الحد الأقصى للأرشيف (GB)"
                    id="max-archive-size"
                    value="10"
                    onChange={() => {}}
                    placeholder="10"
                  />
                </CardContent>
              </Card>
            </div>

            {/* بطاقة الإحصائيات الحالية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  الاستخدام الحالي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-5 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>صندوق الوارد</p>
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={65} className="h-2 flex-1" />
                      <span className="text-xs font-mono">3.2 GB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">65% من 5 GB</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرسل</p>
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={42} className="h-2 flex-1" />
                      <span className="text-xs font-mono">2.1 GB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">42% من 5 GB</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسودات</p>
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={8} className="h-2 flex-1" />
                      <span className="text-xs font-mono">120 MB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">8 مسودات</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>المحذوفات</p>
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={15} className="h-2 flex-1" />
                      <span className="text-xs font-mono">450 MB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">124 رسالة</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأرشيف</p>
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={78} className="h-2 flex-1" />
                      <span className="text-xs font-mono">7.8 GB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">78% من 10 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراقبة الذاكرة والموارد الشاملة</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <RefreshCw className="h-3 w-3 ml-1" />
                  تحديث
                </Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير التقرير
                </Button>
              </div>
            </div>

            {/* بطاقات الإحصائيات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <MemoryStick className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-base text-blue-600">24.5 GB</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاستخدام</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <FileType className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-base text-green-600">2,450</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة نشطة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <UserCircle className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-base text-purple-600">156</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>موظف</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <Building2 className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-base text-orange-600">8</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>فرع</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <Monitor className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-base text-red-600">79</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>شاشة نشطة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-2 text-center">
                  <Folder className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-base text-indigo-600">45,680</p>
                  <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملف</p>
                </CardContent>
              </Card>
            </div>

            {/* جدول استخدام الذاكرة حسب المعاملات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileType className="h-4 w-4 text-blue-600" />
                  استخدام الذاكرة حسب المعاملات (أعلى 10)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea style={{ height: '250px' }}>
                  <Table className="table-rtl">
                    <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>حجم البيانات</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملفات</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصور</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجمالي</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: '2501234', type: 'رخصة بناء', data: '125 MB', files: 45, images: 120, total: '856 MB', percent: 85 },
                        { id: '2501156', type: 'رخصة هدم', data: '95 MB', files: 32, images: 85, total: '642 MB', percent: 64 },
                        { id: '2501089', type: 'رخصة تعديل', data: '78 MB', files: 28, images: 65, total: '534 MB', percent: 53 },
                        { id: '2501067', type: 'رخصة إضافة', data: '88 MB', files: 35, images: 78, total: '589 MB', percent: 58 },
                        { id: '2501023', type: 'رخصة بناء', data: '112 MB', files: 42, images: 95, total: '712 MB', percent: 71 },
                        { id: '2501001', type: 'فسح بناء', data: '65 MB', files: 22, images: 48, total: '445 MB', percent: 44 },
                        { id: '2412456', type: 'رخصة بناء', data: '98 MB', files: 38, images: 82, total: '623 MB', percent: 62 },
                        { id: '2412398', type: 'شهادة إنجاز', data: '72 MB', files: 26, images: 55, total: '498 MB', percent: 49 },
                        { id: '2412356', type: 'رخصة تعديل', data: '85 MB', files: 31, images: 72, total: '567 MB', percent: 56 },
                        { id: '2412298', type: 'رخصة بناء', data: '105 MB', files: 40, images: 88, total: '689 MB', percent: 68 },
                      ].map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-right text-xs font-mono">{item.id}</TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</TableCell>
                          <TableCell className="text-right text-xs font-mono">{item.data}</TableCell>
                          <TableCell className="text-right text-xs">{item.files}</TableCell>
                          <TableCell className="text-right text-xs">{item.images}</TableCell>
                          <TableCell className="text-right text-xs font-mono">{item.total}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <Progress value={item.percent} className="h-1.5 flex-1" />
                              <span className="text-xs font-mono w-8">{item.percent}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {/* جدول استخدام الذاكرة حسب الموظفين */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <UserCircle className="h-4 w-4 text-purple-600" />
                    استخدام الذاكرة حسب الموظفين (أعلى 8)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea style={{ height: '300px' }}>
                    <Table className="table-rtl">
                      <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                        <TableRow>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: 'أحمد محمد', transactions: 245, size: '4.2 GB', percent: 85 },
                          { name: 'فاطمة علي', transactions: 198, size: '3.8 GB', percent: 76 },
                          { name: 'خالد السالم', transactions: 167, size: '3.1 GB', percent: 62 },
                          { name: 'سارة أحمد', transactions: 156, size: '2.9 GB', percent: 58 },
                          { name: 'محمد خالد', transactions: 142, size: '2.6 GB', percent: 52 },
                          { name: 'نورة عبدالله', transactions: 128, size: '2.3 GB', percent: 46 },
                          { name: 'عبدالرحمن سعيد', transactions: 115, size: '2.1 GB', percent: 42 },
                          { name: 'ريم خالد', transactions: 98, size: '1.8 GB', percent: 36 },
                        ].map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name}</TableCell>
                            <TableCell className="text-right text-xs">{item.transactions}</TableCell>
                            <TableCell className="text-right text-xs font-mono">{item.size}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Progress value={item.percent} className="h-1.5 flex-1" />
                                <span className="text-xs font-mono w-8">{item.percent}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* جدول استخدام الذاكرة حسب الفروع */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Building2 className="h-4 w-4 text-orange-600" />
                    استخدام الذاكرة حسب الفروع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea style={{ height: '300px' }}>
                    <Table className="table-rtl">
                      <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                        <TableRow>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفرع</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                          <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: 'المكتب الرئيسي - الرياض', transactions: 856, size: '8.5 GB', percent: 92 },
                          { name: 'فرع الشرقية - الدمام', transactions: 342, size: '3.2 GB', percent: 65 },
                          { name: 'فرع مكة - جدة', transactions: 289, size: '2.8 GB', percent: 56 },
                          { name: 'فرع المدينة المنورة', transactions: 198, size: '1.9 GB', percent: 38 },
                          { name: 'فرع عسير - أبها', transactions: 156, size: '1.5 GB', percent: 30 },
                          { name: 'فرع القصيم - بريدة', transactions: 124, size: '1.2 GB', percent: 24 },
                          { name: 'فرع حائل', transactions: 98, size: '950 MB', percent: 19 },
                          { name: 'فرع تبوك', transactions: 76, size: '720 MB', percent: 14 },
                        ].map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name}</TableCell>
                            <TableCell className="text-right text-xs">{item.transactions}</TableCell>
                            <TableCell className="text-right text-xs font-mono">{item.size}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Progress value={item.percent} className="h-1.5 flex-1" />
                                <span className="text-xs font-mono w-8">{item.percent}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* استخدام الذاكرة حسب الشاشات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Monitor className="h-4 w-4 text-red-600" />
                  استخدام الذاكرة حسب الشاشات (أعلى 12)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea style={{ height: '300px' }}>
                  <Table className="table-rtl">
                    <TableHeader style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الشاشة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الشاشة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>البيانات المحملة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد السجلات</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { number: '284', name: 'معالجة المعاملات', data: '2.8 GB', records: 2450, size: '3.5 GB', percent: 88 },
                        { number: '300', name: 'إدارة العملاء', data: '1.2 GB', records: 1856, size: '1.8 GB', percent: 72 },
                        { number: '815', name: 'عروض الأسعار', data: '856 MB', records: 1234, size: '1.2 GB', percent: 64 },
                        { number: '901', name: 'الوثائق والملفات', data: '3.4 GB', records: 45680, size: '4.2 GB', percent: 95 },
                        { number: '222', name: 'الحسابات والمالية', data: '945 MB', records: 3456, size: '1.4 GB', percent: 68 },
                        { number: '820', name: 'المواعيد', data: '456 MB', records: 2345, size: '680 MB', percent: 42 },
                        { number: '999', name: 'إدارة النظام', data: '234 MB', records: 8956, size: '450 MB', percent: 35 },
                        { number: '858', name: 'البريد الإلكتروني', data: '2.1 GB', records: 12450, size: '2.8 GB', percent: 82 },
                        { number: '701', name: 'إعدادات المعاملات', data: '156 MB', records: 456, size: '280 MB', percent: 28 },
                        { number: '817', name: 'الموظفين', data: '345 MB', records: 156, size: '520 MB', percent: 38 },
                        { number: '818', name: 'الجهات الخارجية', data: '234 MB', records: 234, size: '380 MB', percent: 32 },
                        { number: '814', name: 'العقود', data: '678 MB', records: 892, size: '890 MB', percent: 58 },
                      ].map((item) => (
                        <TableRow key={item.number}>
                          <TableCell className="text-right text-xs font-mono">{item.number}</TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name}</TableCell>
                          <TableCell className="text-right text-xs font-mono">{item.data}</TableCell>
                          <TableCell className="text-right text-xs">{item.records.toLocaleString('ar-SA')}</TableCell>
                          <TableCell className="text-right text-xs font-mono">{item.size}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <Progress value={item.percent} className="h-1.5 flex-1" />
                              <span className="text-xs font-mono w-8">{item.percent}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* استخدام الذاكرة حسب نوع البيانات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <PieChart className="h-4 w-4 text-indigo-600" />
                  توزيع الذاكرة حسب نوع البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { type: 'الملفات والوثائق', size: '8.5 GB', percent: 35, color: 'bg-blue-500' },
                    { type: 'الصور والمخططات', size: '6.2 GB', percent: 25, color: 'bg-green-500' },
                    { type: 'بيانات المعاملات', size: '4.8 GB', percent: 20, color: 'bg-purple-500' },
                    { type: 'البريد الإلكتروني', size: '2.8 GB', percent: 11, color: 'bg-orange-500' },
                    { type: 'النسخ الاحتياطية', size: '1.5 GB', percent: 6, color: 'bg-red-500' },
                    { type: 'السجلات والتقارير', size: '680 MB', percent: 3, color: 'bg-yellow-500' },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</p>
                      <div className={`${item.color} text-white rounded p-2`}>
                        <p className="text-lg font-mono">{item.size}</p>
                        <p className="text-xs">{item.percent}%</p>
                      </div>
                      <Progress value={item.percent} className="h-1.5 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* تنبيهات وتحذيرات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  التنبيهات والتحذيرات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                {[
                  { type: 'تحذير', message: 'الشاشة 901 (الوثائق والملفات) تستخدم 95% من الذاكرة المخصصة', severity: 'high', action: 'أرشفة الملفات القديمة' },
                  { type: 'تنبيه', message: 'استخدام المعاملة 2501234 يتجاوز 800 MB', severity: 'medium', action: 'مراجعة المرفقات' },
                  { type: 'معلومة', message: 'موصى بتنظيف البريد الإلكتروني في الشاشة 858', severity: 'low', action: 'تفعيل التنظيف التلقائي' },
                ].map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded-lg border-2 ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-300' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                      'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-semibold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge className={`text-[10px] ml-2 ${
                            alert.severity === 'high' ? 'bg-red-500' :
                            alert.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}>
                            {alert.type}
                          </Badge>
                          {alert.message}
                        </p>
                        <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الإجراء المقترح: {alert.action}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        اتخاذ إجراء
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التاب: {activeTab}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-999" position="top-right" />

      {/* نافذة تفاصيل السجل */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">تفاصيل السجل</DialogTitle>
            <DialogDescription className="dialog-description">
              معلومات تفصيلية عن الإجراء المسجل
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="form-rtl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>معرّف السجل:</label>
                  <p className="text-sm font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت:</label>
                  <p className="text-sm font-mono">{selectedLog.timestamp}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم:</label>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.userName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء:</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getLogCategoryIcon(selectedLog.category)}
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.action}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاشة:</label>
                  <p className="text-sm font-mono">{selectedLog.screen}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل:</label>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.details}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان IP:</label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة:</label>
                  <p className="text-sm font-mono">{selectedLog.duration}</p>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة:</label>
                  <div className="mt-1">{getLogStatusBadge(selectedLog.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة استعادة النسخة الاحتياطية */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="max-w-xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">استعادة نسخة احتياطية</DialogTitle>
            <DialogDescription className="dialog-description">
              تأكيد استعادة النسخة الاحتياطية
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="form-rtl space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>تحذير هام</span>
                </div>
                <p className="text-xs text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  استعادة النسخة الاحتياطية ستقوم باستبدال جميع البيانات الحالية بالبيانات من النسخة المحددة. 
                  هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>رمز النسخة:</label>
                  <p className="text-sm font-mono">{selectedBackup.id}</p>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ:</label>
                  <p className="text-sm font-mono">{selectedBackup.date}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم:</label>
                  <p className="text-sm font-mono">{selectedBackup.size}</p>
                </div>
                <div>
                  <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع:</label>
                  <div className="mt-1">{getBackupTypeBadge(selectedBackup.type)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>موقع الملف:</label>
                <p className="text-sm font-mono text-gray-600">{selectedBackup.location}</p>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBackupDialog(false)}
                  className="h-9"
                >
                  إلغاء
                </Button>
                <Button 
                  className="h-9 bg-blue-500"
                  onClick={() => {
                    setShowBackupDialog(false);
                    toast.success('تم بدء استعادة النسخة الاحتياطية', {
                      description: 'سيتم إعادة تشغيل النظام بعد اكتمال الاستعادة...'
                    });
                  }}
                >
                  <Refresh className="h-4 w-4 ml-1" />
                  تأكيد الاستعادة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
              <Settings 
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
                  إدارة النظام المتقدمة
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
                    999
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
                إدارة وتحكم شاملة في النظام والمستخدمين
              </p>
            </div>
          </div>
          
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
                12 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default SystemAdvancedManagement_Complete_999_v8_Fixed;
