import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Settings, Activity, Zap, Shield, Users, Database, Server, 
  Cpu, HardDrive, Network, Clock, AlertTriangle, CheckCircle, 
  XCircle, LogOut, Trash2, Filter, Search, Download, Upload,
  RefreshCw, Eye, Lock, Power, Bell, FileText, Calendar, 
  TrendingUp, BarChart3, Archive, Save, Terminal, Wifi, MonitorStop,
  Monitor
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import HeaderSettingsManager from '../HeaderSettingsManager';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// أنواع البيانات
interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActivity: string;
  status: 'active' | 'idle' | 'locked';
  role: string;
  permissions: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'export' | 'error' | 'security';
  screen: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  duration?: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeSessions: number;
  totalUsers: number;
  uptime: string;
  requests: number;
}

const TABS_CONFIG: TabConfig[] = [
  { id: '999-01', number: '999-01', title: 'لوحة المراقبة', icon: Activity },
  { id: '999-02', number: '999-02', title: 'الجلسات النشطة', icon: Users },
  { id: '999-03', number: '999-03', title: 'سجلات النظام', icon: FileText },
  { id: '999-04', number: '999-04', title: 'إعدادات الأداء', icon: Zap },
  { id: '999-05', number: '999-05', title: 'إعدادات الأمان', icon: Shield },
  { id: '999-06', number: '999-06', title: 'النسخ الاحتياطي', icon: Database },
  { id: '999-07', number: '999-07', title: 'الصيانة', icon: Settings },
  { id: '999-08', number: '999-08', title: 'التنبيهات', icon: Bell },
  { id: '999-09', number: '999-09', title: 'إعدادات الهيدر', icon: Monitor }
];

const SystemAdvancedManagement_Complete_999_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('999-01');
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  
  // حقول إعدادات قابلة للتعديل
  const [encryptionAlgo, setEncryptionAlgo] = useState('aes256');
  const [reviewFrequency, setReviewFrequency] = useState('30');
  const [backupPath, setBackupPath] = useState('/var/backups/system');
  const [maxBackups, setMaxBackups] = useState('10');
  
  // مؤشرات التفعيل
  const [enableSensitiveEncryption, setEnableSensitiveEncryption] = useState(true);
  const [enableFileEncryption, setEnableFileEncryption] = useState(true);
  const [enableBackupEncryption, setEnableBackupEncryption] = useState(true);
  const [enablePermissionsReview, setEnablePermissionsReview] = useState(true);
  const [enablePermissionsLogging, setEnablePermissionsLogging] = useState(true);
  const [enablePermissionsAlert, setEnablePermissionsAlert] = useState(true);
  const [enableAutoBackup, setEnableAutoBackup] = useState(true);
  const [enableBackupCompression, setEnableBackupCompression] = useState(true);
  const [enableAutoMaintenance, setEnableAutoMaintenance] = useState(true);
  
  // بيانات وهمية للجلسات النشطة
  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: 'SES-001', userId: 'USR-001', userName: 'أحمد محمد العتيبي', email: 'ahmed.alotaibi@company.sa',
      ipAddress: '192.168.1.45', location: 'الرياض، السعودية', device: 'Windows 11', browser: 'Chrome 120',
      loginTime: '2025-10-19 08:30', lastActivity: '2025-10-19 11:45', status: 'active', role: 'مدير نظام', permissions: 2456
    },
    {
      id: 'SES-002', userId: 'USR-012', userName: 'فاطمة سعد القحطاني', email: 'fatima.alqahtani@company.sa',
      ipAddress: '192.168.1.78', location: 'جدة، السعودية', device: 'MacBook Pro', browser: 'Safari 17',
      loginTime: '2025-10-19 09:15', lastActivity: '2025-10-19 11:42', status: 'active', role: 'محاسب', permissions: 845
    },
    {
      id: 'SES-003', userId: 'USR-025', userName: 'خالد عبدالله الشمري', email: 'khalid.alshamri@company.sa',
      ipAddress: '192.168.1.92', location: 'الدمام، السعودية', device: 'iPhone 15 Pro', browser: 'Safari Mobile',
      loginTime: '2025-10-19 10:05', lastActivity: '2025-10-19 11:30', status: 'idle', role: 'مدير مشاريع', permissions: 1234
    },
    {
      id: 'SES-004', userId: 'USR-037', userName: 'سارة علي الغامدي', email: 'sara.alghamdi@company.sa',
      ipAddress: '192.168.1.103', location: 'الرياض، السعودية', device: 'Windows 10', browser: 'Edge 119',
      loginTime: '2025-10-19 10:45', lastActivity: '2025-10-19 11:40', status: 'active', role: 'مهندس', permissions: 678
    },
    {
      id: 'SES-005', userId: 'USR-048', userName: 'محمد بن سلطان العنزي', email: 'mohammed.alanazi@company.sa',
      ipAddress: '192.168.1.115', location: 'جدة، السعودية', device: 'iPad Pro', browser: 'Safari iPad',
      loginTime: '2025-10-19 11:30', lastActivity: '2025-10-19 11:35', status: 'locked', role: 'موظف', permissions: 156
    }
  ]);

  // بيانات سجلات النظام
  const [systemLogs] = useState<SystemLog[]>([
    {
      id: 'LOG-001', timestamp: '2025-10-19 11:45:30', userId: 'USR-001', userName: 'أحمد محمد',
      action: 'إنشاء معاملة', category: 'create', screen: 'SCR-286', details: 'معاملة جديدة TXN-2025-4567',
      ipAddress: '192.168.1.45', status: 'success', duration: '1.2s'
    },
    {
      id: 'LOG-002', timestamp: '2025-10-19 11:42:18', userId: 'USR-012', userName: 'فاطمة سعد',
      action: 'تحديث فاتورة', category: 'update', screen: 'SCR-222', details: 'فاتورة INV-2024-8901',
      ipAddress: '192.168.1.78', status: 'success', duration: '0.8s'
    },
    {
      id: 'LOG-003', timestamp: '2025-10-19 11:40:05', userId: 'USR-037', userName: 'سارة علي',
      action: 'محاولة وصول غير مصرح', category: 'security', screen: 'SCR-902', details: 'محاولة وصول للصلاحيات',
      ipAddress: '192.168.1.103', status: 'warning', duration: '0.1s'
    },
    {
      id: 'LOG-004', timestamp: '2025-10-19 11:35:42', userId: 'USR-037', userName: 'سارة علي',
      action: 'تصدير تقرير', category: 'export', screen: 'SCR-222', details: 'التقرير المالي Q3-2024',
      ipAddress: '192.168.1.103', status: 'success', duration: '3.5s'
    },
    {
      id: 'LOG-005', timestamp: '2025-10-19 11:30:15', userId: 'USR-048', userName: 'محمد العنزي',
      action: 'تسجيل دخول', category: 'login', screen: 'AUTH', details: 'تسجيل دخول ناجح',
      ipAddress: '192.168.1.115', status: 'success', duration: '0.5s'
    },
    {
      id: 'LOG-006', timestamp: '2025-10-19 11:25:50', userId: 'USR-001', userName: 'أحمد محمد',
      action: 'حذف مستند', category: 'delete', screen: 'SCR-901', details: 'مستند DOC-2024-4523',
      ipAddress: '192.168.1.45', status: 'success', duration: '0.3s'
    },
    {
      id: 'LOG-007', timestamp: '2025-10-19 11:20:22', userId: 'USR-012', userName: 'فاطمة سعد',
      action: 'عرض عميل', category: 'view', screen: 'SCR-300', details: 'عميل CLT-2024-1234',
      ipAddress: '192.168.1.78', status: 'success', duration: '0.2s'
    },
    {
      id: 'LOG-008', timestamp: '2025-10-19 11:15:10', userId: 'USR-025', userName: 'خالد الشمري',
      action: 'خطأ حفظ', category: 'error', screen: 'SCR-871', details: 'فشل الاتصال بقاعدة البيانات',
      ipAddress: '192.168.1.92', status: 'failed', duration: '5.0s'
    }
  ]);

  // بيانات مؤشرات النظام
  const [systemMetrics] = useState<SystemMetrics>({
    cpu: 45, memory: 62, disk: 78, network: 35,
    activeSessions: 5, totalUsers: 156, uptime: '45 يوم و 12 ساعة', requests: 45678
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>,
      idle: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">خامل</Badge>,
      locked: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">مقفل</Badge>,
      success: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">ناجح</Badge>,
      failed: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">فشل</Badge>,
      warning: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">تحذير</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      login: <Users className="h-3.5 w-3.5 text-green-600" />,
      logout: <LogOut className="h-3.5 w-3.5 text-gray-600" />,
      create: <CheckCircle className="h-3.5 w-3.5 text-blue-600" />,
      update: <RefreshCw className="h-3.5 w-3.5 text-purple-600" />,
      delete: <Trash2 className="h-3.5 w-3.5 text-red-600" />,
      view: <Eye className="h-3.5 w-3.5 text-cyan-600" />,
      export: <Download className="h-3.5 w-3.5 text-orange-600" />,
      error: <AlertTriangle className="h-3.5 w-3.5 text-red-600" />,
      security: <Shield className="h-3.5 w-3.5 text-yellow-600" />
    };
    return icons[category as keyof typeof icons] || <Activity className="h-3.5 w-3.5 text-gray-600" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '999-01':
        return (
          <div className="space-y-3">
            {/* مؤشرات الأداء الرئيسية - مكثفة */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'استخدام المعالج', value: `${systemMetrics.cpu}%`, icon: Cpu, color: '#3b82f6', progress: systemMetrics.cpu },
                { label: 'استخدام الذاكرة', value: `${systemMetrics.memory}%`, icon: HardDrive, color: '#10b981', progress: systemMetrics.memory },
                { label: 'مساحة القرص', value: `${systemMetrics.disk}%`, icon: Server, color: '#f59e0b', progress: systemMetrics.disk },
                { label: 'الشبكة', value: `${systemMetrics.network}%`, icon: Network, color: '#8b5cf6', progress: systemMetrics.network }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      {React.createElement(item.icon, { className: 'h-4 w-4', style: { color: item.color } })}
                      <span className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', color: item.color }}>{item.value}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    <Progress value={item.progress} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* إحصائيات عامة */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'الجلسات النشطة', value: systemMetrics.activeSessions, icon: Users, color: '#3b82f6' },
                { label: 'إجمالي المستخدمين', value: systemMetrics.totalUsers, icon: Users, color: '#10b981' },
                { label: 'وقت التشغيل', value: systemMetrics.uptime, icon: Clock, color: '#f59e0b' },
                { label: 'الطلبات اليوم', value: systemMetrics.requests.toLocaleString(), icon: Activity, color: '#8b5cf6' }
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

            {/* آخر الأنشطة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Activity className="h-4 w-4" />
                  آخر الأنشطة النظامية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {systemLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      {getCategoryIcon(log.category)}
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                      <p className="text-xs flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}</p>
                      {getStatusBadge(log.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* تحذيرات هامة */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="card-element card-rtl border-yellow-200 bg-yellow-50">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <AlertTriangle className="h-4 w-4" />
                    تحذيرات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <p className="text-xs text-yellow-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>مساحة القرص تقترب من النفاد</p>
                  <Button size="sm" variant="outline" className="h-6 w-full text-xs">عرض التفاصيل</Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl border-green-200 bg-green-50">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <CheckCircle className="h-4 w-4" />
                    حالة النظام
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <p className="text-xs text-green-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع الأنظمة تعمل بشكل طبيعي</p>
                  <Button size="sm" variant="outline" className="h-6 w-full text-xs">فحص شامل</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '999-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجلسات النشطة</h2>
                <Badge className="bg-blue-500 text-white text-xs px-2 py-0">{activeSessions.length} جلسة</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عنوان IP</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهاز</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصلاحيات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.userName}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{session.email}</TableCell>
                        <TableCell className="text-right py-2">
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{session.ipAddress}</code>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.location}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{session.device}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(session.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{session.permissions}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 text-xs px-2"
                              onClick={() => {
                                setSelectedSession(session);
                                setShowSessionDialog(true);
                              }}
                            >
                              تفاصيل
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2 text-red-600 hover:bg-red-50">
                              <Lock className="h-3 w-3" />
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

      case '999-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجلات النظام</h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0">{systemLogs.length} سجل</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Search className="h-3 w-3 ml-1" />بحث</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوقيت</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاشة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-purple-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs">{log.timestamp}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.userName}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            {getCategoryIcon(log.category)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{log.screen}</code>
                        </TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{log.duration}</TableCell>
                        <TableCell className="text-right py-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 text-xs px-2"
                            onClick={() => {
                              setSelectedLog(log);
                              setShowLogDetailsDialog(true);
                            }}
                          >
                            تفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '999-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأداء</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ التغييرات</Button>
            </div>

            {/* إعدادات التخزين المؤقت */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Database className="h-4 w-4" />
                  التخزين المؤقت (Cache)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-cache"
                  label="تفعيل التخزين المؤقت"
                  description="تحسين الأداء عبر حفظ البيانات المستخدمة بكثرة"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />
                
                <div className="form-rtl">
                  <Label className="text-xs">مدة التخزين (دقائق)</Label>
                  <InputWithCopy
                    id="cache-duration"
                    value="30"
                    onChange={() => {}}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-query-cache"
                  label="تخزين نتائج الاستعلامات"
                  description="حفظ نتائج استعلامات قاعدة البيانات"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
                />

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حجم الذاكرة المخصصة</span>
                  <Badge variant="outline" className="text-xs">512 MB</Badge>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات قاعدة البيانات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Server className="h-4 w-4" />
                  قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-query-optimization"
                  label="تحسين الاستعلامات تلقائياً"
                  description="تحسين أداء استعلامات قاعدة البيانات"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />

                <div className="form-rtl">
                  <Label className="text-xs">الحد الأقصى للاتصالات المتزامنة</Label>
                  <InputWithCopy
                    id="max-connections"
                    value="100"
                    onChange={() => {}}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-connection-pool"
                  label="استخدام مجموعة الاتصالات (Connection Pool)"
                  description="تحسين أداء الاتصالات بقاعدة البيانات"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>

            {/* إعدادات الشبكة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Network className="h-4 w-4" />
                  الشبكة والاتصال
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-compression"
                  label="ضغط البيانات المرسلة"
                  description="تقليل حجم البيانات المنقولة عبر الشبكة"
                  checked={true}
                  onCheckedChange={() => {}}
                  size="sm"
                  variant="default"
                />

                <div className="form-rtl">
                  <Label className="text-xs">مهلة الطلب (ثانية)</Label>
                  <InputWithCopy
                    id="request-timeout"
                    value="30"
                    onChange={() => {}}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-keep-alive"
                  label="الحفاظ على الاتصال (Keep-Alive)"
                  description="إبقاء الاتصال مفتوحاً لتحسين الأداء"
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
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأمان</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Save className="h-3 w-3 ml-1" />حفظ التغييرات</Button>
            </div>

            {/* سجل الأحداث الأمنية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  الأحداث الأمنية الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {[
                      { time: '11:45', event: 'تسجيل دخول ناجح من موقع جديد - المستخدم USR-001', severity: 'success' },
                      { time: '11:30', event: 'محاولة وصول غير مصرح للشاشة SCR-902', severity: 'warning' },
                      { time: '10:25', event: 'تم حظر 3 محاولات دخول فاشلة للمستخدم USR-025', severity: 'warning' },
                      { time: '09:15', event: 'تحديث ناجح لشهادة SSL', severity: 'success' },
                      { time: '08:30', event: 'فحص أمني دوري - لم يتم اكتشاف تهديدات', severity: 'success' },
                      { time: '07:45', event: 'محاولة دخول من موقع جغرافي غير معتاد', severity: 'error' }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 p-1.5 rounded hover:bg-opacity-50 cursor-pointer ${
                        item.severity === 'error' ? 'bg-red-50 hover:bg-red-100' : 
                        item.severity === 'warning' ? 'bg-yellow-50 hover:bg-yellow-100' : 
                        'bg-green-50 hover:bg-green-100'
                      }`}>
                        {item.severity === 'error' ? <XCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" /> :
                         item.severity === 'warning' ? <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" /> :
                         <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />}
                        <span className="text-xs text-gray-500">{item.time}</span>
                        <p className="text-xs flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.event}</p>
                        <Button size="sm" variant="outline" className="h-5 text-xs px-2">تفاصيل</Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* إعدادات التشفير */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Terminal className="h-4 w-4" />
                    إعدادات التشفير
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">خوارزمية التشفير</Label>
                    <SelectWithCopy
                      id="encryption-algo"
                      label=""
                      value={encryptionAlgo}
                      onChange={setEncryptionAlgo}
                      options={[
                        { value: 'aes256', label: 'AES-256' },
                        { value: 'aes128', label: 'AES-128' },
                        { value: 'rsa2048', label: 'RSA-2048' }
                      ]}
                      copyable={false}
                      clearable={false}
                    />
                  </div>
                  
                  <EnhancedSwitch
                    id="enable-sensitive-encryption"
                    label="تشفير البيانات الحساسة"
                    description="تشفير البيانات الحساسة في قاعدة البيانات"
                    checked={enableSensitiveEncryption}
                    onCheckedChange={setEnableSensitiveEncryption}
                    size="sm"
                    variant="success"
                  />
                  
                  <EnhancedSwitch
                    id="enable-file-encryption"
                    label="تشفير الملفات المرفقة"
                    description="تشفير جميع الملفات المرفوعة"
                    checked={enableFileEncryption}
                    onCheckedChange={setEnableFileEncryption}
                    size="sm"
                    variant="success"
                  />
                  
                  <EnhancedSwitch
                    id="enable-backup-encryption"
                    label="تشفير النسخ الاحتياطي"
                    description="تشفير ملفات النسخ الاحتياطي"
                    checked={enableBackupEncryption}
                    onCheckedChange={setEnableBackupEncryption}
                    size="sm"
                    variant="success"
                  />
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <FileText className="h-4 w-4" />
                    سياسات الصلاحيات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <EnhancedSwitch
                    id="enable-permissions-review"
                    label="مراجعة الصلاحيات الدورية"
                    description="مراجعة صلاحيات المستخدمين بشكل دوري"
                    checked={enablePermissionsReview}
                    onCheckedChange={setEnablePermissionsReview}
                    size="sm"
                    variant="default"
                  />
                  
                  <div className="form-rtl">
                    <Label className="text-xs">تكرار المراجعة (يوم)</Label>
                    <InputWithCopy
                      id="review-frequency"
                      value={reviewFrequency}
                      onChange={(e) => setReviewFrequency(e.target.value)}
                      type="number"
                      copyable={false}
                      clearable={true}
                    />
                  </div>
                  
                  <EnhancedSwitch
                    id="enable-permissions-logging"
                    label="تسجيل تغييرات الصلاحيات"
                    description="تسجيل جميع التغييرات على الصلاحيات"
                    checked={enablePermissionsLogging}
                    onCheckedChange={setEnablePermissionsLogging}
                    size="sm"
                    variant="success"
                  />
                  
                  <EnhancedSwitch
                    id="enable-permissions-alert"
                    label="تنبيه عند التغيير"
                    description="إرسال تنبيه عند تغيير الصلاحيات"
                    checked={enablePermissionsAlert}
                    onCheckedChange={setEnablePermissionsAlert}
                    size="sm"
                    variant="warning"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '999-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسخ الاحتياطي</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />استعادة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Archive className="h-3 w-3 ml-1" />نسخ احتياطي الآن</Button>
              </div>
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
                  <Label className="text-xs">مسار التخزين</Label>
                  <InputWithCopy
                    id="backup-path"
                    value={backupPath}
                    onChange={(e) => setBackupPath(e.target.value)}
                    copyable={true}
                    clearable={true}
                  />
                </div>

                <div className="form-rtl">
                  <Label className="text-xs">الحد الأقصى للنسخ</Label>
                  <InputWithCopy
                    id="max-backups"
                    value={maxBackups}
                    onChange={(e) => setMaxBackups(e.target.value)}
                    type="number"
                    copyable={false}
                    clearable={true}
                  />
                </div>

                <EnhancedSwitch
                  id="enable-backup-compression"
                  label="ضغط النسخ الاحتياطية"
                  description="ضغط الملفات لتوفير المساحة"
                  checked={enableBackupCompression}
                  onCheckedChange={setEnableBackupCompression}
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
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2025-10-19 02:00', type: 'كامل', size: '2.4 GB', status: 'success' },
                      { date: '2025-10-18 02:00', type: 'كامل', size: '2.3 GB', status: 'success' },
                      { date: '2025-10-17 02:00', type: 'كامل', size: '2.2 GB', status: 'success' },
                      { date: '2025-10-16 02:00', type: 'كامل', size: '2.1 GB', status: 'success' }
                    ].map((backup, i) => (
                      <TableRow key={i} className="hover:bg-cyan-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs">{backup.date}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{backup.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.size}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(backup.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Download className="h-3 w-3" /></Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2"><Trash2 className="h-3 w-3" /></Button>
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

      case '999-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصيانة</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><RefreshCw className="h-3 w-3 ml-1" />تنفيذ صيانة شاملة</Button>
            </div>

            {/* إعدادات الصيانة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات الصيانة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="enable-auto-maintenance"
                  label="الصيانة التلقائية"
                  description="تنفيذ مهام الصيانة تلقائياً"
                  checked={enableAutoMaintenance}
                  onCheckedChange={setEnableAutoMaintenance}
                  size="sm"
                  variant="default"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر صيانة شاملة</span>
                  <Badge variant="outline" className="text-xs">2025-10-19 02:00</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصيانة التالية</span>
                  <Badge variant="outline" className="text-xs">2025-10-20 02:00</Badge>
                </div>
              </CardContent>
            </Card>

            {/* مهام الصيانة المجدولة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="h-4 w-4" />
                  مهام الصيانة المجدولة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكرار</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تنفيذ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنفيذ التالي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { task: 'تحسين قاعدة البيانات', frequency: 'يومياً', last: '2025-10-19 02:00', next: '2025-10-20 02:00', status: 'active' },
                      { task: 'نسخ احتياطي كامل', frequency: 'يومياً', last: '2025-10-19 02:00', next: '2025-10-20 02:00', status: 'active' },
                      { task: 'تنظيف الملفات المؤقتة', frequency: 'أسبوعياً', last: '2025-10-15', next: '2025-10-22', status: 'active' },
                      { task: 'فحص أمني', frequency: 'أسبوعياً', last: '2025-10-18', next: '2025-10-25', status: 'active' },
                      { task: 'أرشفة السجلات', frequency: 'شهرياً', last: '2025-10-01', next: '2025-11-01', status: 'active' }
                    ].map((task, i) => (
                      <TableRow key={i} className="hover:bg-purple-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{task.task}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{task.frequency}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{task.last}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{task.next}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">تنفيذ الآن</Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">تعديل</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* سجل الصيانة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  آخر عمليات الصيانة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { time: '02:00', action: 'تحسين قاعدة البيانات - تم بنجاح', duration: '12 دقيقة', status: 'success' },
                    { time: '02:00', action: 'نسخ احتياطي تلقائي - تم بنجاح', duration: '15 دقيقة', status: 'success' },
                    { time: '01:45', action: 'تنظيف الملفات المؤقتة - تم توفير 2.4 GB', duration: '5 دقائق', status: 'success' },
                    { time: '01:30', action: 'فحص الأخطاء - لم يتم اكتشاف أخطاء', duration: '8 دقائق', status: 'success' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 bg-green-50 rounded hover:bg-green-100 transition-colors cursor-pointer">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-500">{item.time}</span>
                      <p className="text-xs flex-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.action}</p>
                      <code className="text-xs text-gray-500">{item.duration}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '999-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنبيهات</h2>
                <Badge className="bg-red-500 text-white text-xs px-2 py-0">15 تنبيه جديد</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">تحديد الكل كمقروء</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Settings className="h-3 w-3 ml-1" />إعدادات التنبيهات</Button>
              </div>
            </div>

            {/* إحصائيات التنبيهات */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'الكل', count: 15, icon: Bell, color: 'blue' },
                { label: 'حرجة', count: 2, icon: AlertTriangle, color: 'red' },
                { label: 'تحذيرات', count: 5, icon: AlertTriangle, color: 'yellow' },
                { label: 'معلوماتية', count: 8, icon: Bell, color: 'green' },
                { label: 'أمنية', count: 3, icon: Shield, color: 'purple' },
                { label: 'النظام', count: 4, icon: Settings, color: 'cyan' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: `h-4 w-4 text-${item.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* التنبيهات الحرجة */}
            <Card className="card-element card-rtl bg-red-50 border-red-200">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2 text-red-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertTriangle className="h-4 w-4" />
                  تنبيهات حرجة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { title: 'مساحة القرص تقترب من النفاد', desc: 'تبقى 5% فقط من المساحة المتاحة', time: '11:45', read: false },
                    { title: 'محاولات دخول مشبوهة', desc: '5 محاولات فاشلة من نفس IP', time: '10:30', read: false }
                  ].map((notification, i) => (
                    <div key={i} className="p-2 bg-white border border-red-200 rounded hover:shadow transition-all cursor-pointer">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notification.title}</h4>
                            {!notification.read && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-4">جديد</Badge>}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{notification.desc}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* جميع التنبيهات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Bell className="h-4 w-4" />
                  جميع التنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ScrollArea className="h-96">
                  <div className="space-y-1 pr-2">
                    {[
                      { title: 'تحديث النظام متاح', desc: 'إصدار جديد v5.1 متوفر للتحميل', time: '11:30', read: false, type: 'info' },
                      { title: 'نسخ احتياطي ناجح', desc: 'تم إنشاء نسخة احتياطية بنجاح', time: '02:00', read: true, type: 'success' },
                      { title: 'محاولة وصول غير مصرح', desc: 'المستخدم USR-037 حاول الوصول للشاشة SCR-902', time: '11:40', read: false, type: 'warning' },
                      { title: 'صيانة مجدولة', desc: 'صيانة دورية مجدولة غداً الساعة 02:00', time: 'أمس', read: true, type: 'info' },
                      { title: 'تحديث الصلاحيات', desc: 'تم تحديث صلاحيات 3 مستخدمين', time: 'أمس', read: true, type: 'info' }
                    ].map((notification, i) => (
                      <div key={i} className={`p-2 border rounded hover:shadow transition-all cursor-pointer ${
                        notification.type === 'success' ? 'bg-green-50 border-green-200' :
                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        notification.type === 'error' ? 'bg-red-50 border-red-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notification.title}</h4>
                              {!notification.read && <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-4">جديد</Badge>}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{notification.desc}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Trash2 className="h-3 w-3" /></Button>
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

      case '999-09':
        return (
          <div className="space-y-4">
            <HeaderSettingsManager />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-999" position="top-right" />
      
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
          {/* القسم الأيمن: الأيقونة والمعلومات */}
          <div className="flex items-center gap-4">
            {/* الأيقونة بتصميم حديث */}
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
            
            {/* معلومات الشاشة */}
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
                  الإدارة المتقدمة للنظام
                </h1>
                
                {/* Badge الرقم - تصميم محسّن */}
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
              
              {/* الوصف في سطر منفصل */}
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
                مراقبة وإدارة شاملة للنظام
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر: معلومات إضافية */}
          <div className="flex items-center gap-3">
            {/* عدد التابات */}
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
                9 تبويبات
              </span>
            </div>

            {/* حالة النظام */}
            <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-0.5">
              <CheckCircle className="h-3 w-3 ml-1" />
              النظام يعمل
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-0.5">
              <Clock className="h-3 w-3 ml-1" />
              {systemMetrics.uptime}
            </Badge>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد v1.1 */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى التاب */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* Dialog تفاصيل الجلسة */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الجلسة</DialogTitle>
            <DialogDescription className="dialog-description">معلومات كاملة عن جلسة المستخدم</DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-rtl">
                  <Label className="text-xs">المستخدم</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSession.userName}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">البريد الإلكتروني</Label>
                  <p className="text-sm mt-1">{selectedSession.email}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الدور</Label>
                  <Badge variant="outline" className="mt-1 text-xs">{selectedSession.role}</Badge>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">عنوان IP</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedSession.ipAddress}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الموقع</Label>
                  <p className="text-sm mt-1">{selectedSession.location}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الجهاز</Label>
                  <p className="text-sm mt-1">{selectedSession.device}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المتصفح</Label>
                  <p className="text-sm mt-1">{selectedSession.browser}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">وقت الدخول</Label>
                  <p className="text-sm mt-1">{selectedSession.loginTime}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">آخر نشاط</Label>
                  <p className="text-sm mt-1">{selectedSession.lastActivity}</p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowSessionDialog(false)}>
                  إغلاق
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                  <Lock className="h-4 w-4 ml-2" />
                  إنهاء الجلسة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog تفاصيل السجل */}
      <Dialog open={showLogDetailsDialog} onOpenChange={setShowLogDetailsDialog}>
        <DialogContent className="max-w-2xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل السجل</DialogTitle>
            <DialogDescription className="dialog-description">معلومات كاملة عن سجل النشاط</DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-rtl">
                  <Label className="text-xs">رقم السجل</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedLog.id}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">التوقيت</Label>
                  <p className="text-sm mt-1">{selectedLog.timestamp}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المستخدم</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.userName}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">رقم المستخدم</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedLog.userId}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الإجراء</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.action}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">التصنيف</Label>
                  <div className="mt-1">{getCategoryIcon(selectedLog.category)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الشاشة</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedLog.screen}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">عنوان IP</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedLog.ipAddress}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المدة</Label>
                  <code className="text-sm mt-1 block">{selectedLog.duration}</code>
                </div>
                <div className="form-rtl col-span-2">
                  <Label className="text-xs">التفاصيل</Label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{selectedLog.details}</p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير السجل
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowLogDetailsDialog(false)}>
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

export default SystemAdvancedManagement_Complete_999_v8;
