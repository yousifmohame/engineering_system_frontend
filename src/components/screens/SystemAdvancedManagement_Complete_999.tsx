import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
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
import UniversalTabsSidebar from '../UniversalTabsSidebar';
import HeaderSettingsManager from '../HeaderSettingsManager';

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

const SystemAdvancedManagement_Complete_999: React.FC = () => {
  const [activeTab, setActiveTab] = useState('999-01');
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  
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

  const tabs = [
    { id: '999-01', label: 'لوحة المراقبة', icon: Activity, color: 'bg-blue-500' },
    { id: '999-02', label: 'الجلسات النشطة', icon: Users, color: 'bg-green-500' },
    { id: '999-03', label: 'سجلات النظام', icon: FileText, color: 'bg-purple-500' },
    { id: '999-04', label: 'إعدادات الأداء', icon: Zap, color: 'bg-orange-500' },
    { id: '999-05', label: 'إعدادات الأمان', icon: Shield, color: 'bg-red-500' },
    { id: '999-06', label: 'النسخ الاحتياطي', icon: Database, color: 'bg-cyan-500' },
    { id: '999-07', label: 'الصيانة', icon: Settings, color: 'bg-pink-500' },
    { id: '999-08', label: 'التنبيهات', icon: Bell, color: 'bg-indigo-500' },
    { id: '999-09', label: 'إعدادات الهيدر', icon: Monitor, color: 'bg-teal-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>,
      idle: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">خامل</Badge>,
      locked: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">مقفل</Badge>,
      success: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">ناجح</Badge>,
      failed: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">فشل</Badge>,
      warning: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">تحذير</Badge>
    };
    return badges[status] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
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
    return icons[category] || <Activity className="h-3.5 w-3.5 text-gray-600" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '999-01':
        return (
          <div className="space-y-3">
            {/* مؤشرات الأداء الرئيسية - مكثفة */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'استخدام المعالج', value: systemMetrics.cpu, icon: Cpu, color: 'blue', unit: '%' },
                { label: 'استخدام الذاكرة', value: systemMetrics.memory, icon: HardDrive, color: 'green', unit: '%' },
                { label: 'استخدام القرص', value: systemMetrics.disk, icon: Database, color: 'orange', unit: '%' },
                { label: 'استخدام الشبكة', value: systemMetrics.network, icon: Network, color: 'purple', unit: '%' }
              ].map((metric, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-l-4" style={{ borderLeftColor: `var(--${metric.color}-500)` }}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      {React.createElement(metric.icon, { className: `h-5 w-5 text-${metric.color}-500` })}
                      <span className="text-2xl">{metric.value}{metric.unit}</span>
                    </div>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{metric.label}</p>
                    <Progress value={metric.value} className="h-1.5 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* إحصائيات سريعة - صف واحد مكثف */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'الجلسات النشطة', value: systemMetrics.activeSessions, icon: Users, color: 'green' },
                { label: 'إجمالي المستخدمين', value: systemMetrics.totalUsers, icon: Users, color: 'blue' },
                { label: 'الطلبات اليوم', value: systemMetrics.requests, icon: Activity, color: 'purple' },
                { label: 'وقت التشغيل', value: systemMetrics.uptime, icon: Clock, color: 'cyan', isText: true },
                { label: 'حالة الخادم', value: 'نشط', icon: Server, color: 'green', isText: true },
                { label: 'حالة الشبكة', value: 'متصل', icon: Wifi, color: 'green', isText: true }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className={`text-sm ${stat.isText ? '' : 'text-lg'}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* أحدث النشاطات - مكثفة جداً */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Activity className="h-4 w-4" />
                    آخر 5 نشاطات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                        {getCategoryIcon(log.category)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}</p>
                          <p className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</p>
                        </div>
                        {getStatusBadge(log.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Users className="h-4 w-4" />
                    الجلسات النشطة ({activeSessions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                        <Users className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.userName}</p>
                          <p className="text-xs text-gray-500">{session.role}</p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* تنبيهات النظام - مكثفة */}
            <Card className="card-element card-rtl bg-yellow-50 border-yellow-200">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنبيه: استخدام القرص مرتفع</h4>
                    <p className="text-xs text-gray-700 mb-2">استخدام القرص الصلب وصل إلى {systemMetrics.disk}%. يُنصح بتنظيف الملفات المؤقتة.</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-6 text-xs">عرض التفاصيل</Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs">تنظيف الآن</Button>
                    </div>
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجلسات النشطة</h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0">{activeSessions.length} جلسة</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Search className="h-3 w-3 ml-1" />بحث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2 w-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الدور</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهاز</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>وقت الدخول</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر نشاط</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeSessions.map((session, index) => (
                        <TableRow key={session.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => { setSelectedSession(session); setShowSessionDialog(true); }}>
                          <TableCell className="text-right py-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="text-right py-2">
                            <div>
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{session.userName}</p>
                              <p className="text-xs text-gray-500">{session.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{session.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div>
                              <p className="text-xs">{session.device}</p>
                              <p className="text-xs text-gray-500">{session.browser}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{session.ipAddress}</code>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{session.loginTime}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{session.lastActivity}</TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(session.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="عرض"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="قفل"><Lock className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-red-600" title="إنهاء"><LogOut className="h-3 w-3" /></Button>
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

      case '999-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجلات النظام</h2>
                <Badge className="bg-purple-500 text-white text-xs px-2 py-0">{systemLogs.length} سجل</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="بحث..." className="input-field h-8 w-48 text-xs" style={{ fontFamily: 'Tajawal, sans-serif', border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl' }} />
                <div className="select-rtl">
                  <Select defaultValue="all">
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="login">دخول</SelectItem>
                      <SelectItem value="create">إنشاء</SelectItem>
                      <SelectItem value="update">تحديث</SelectItem>
                      <SelectItem value="delete">حذف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2 w-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراء</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاشة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاصيل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemLogs.map((log, index) => (
                        <TableRow key={log.id} className="hover:bg-purple-50 transition-colors cursor-pointer" onClick={() => { setSelectedLog(log); setShowLogDetailsDialog(true); }}>
                          <TableCell className="text-right py-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{log.timestamp}</TableCell>
                          <TableCell className="text-right py-2">
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.userName}</p>
                            <code className="text-xs text-gray-500">{log.userId}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1.5 justify-end">
                              {getCategoryIcon(log.category)}
                              <span className="text-xs">{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{log.screen}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <p className="text-xs truncate max-w-xs" title={log.details}>{log.details}</p>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{log.ipAddress}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs">{log.duration}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
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
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأداء</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500"><Save className="h-3 w-3 ml-1" />حفظ التعديلات</Button>
            </div>

            {/* إعدادات الأداء العامة */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Cpu className="h-4 w-4 text-blue-500" />
                    أداء المعالج
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">الحد الأقصى للاستخدام</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="80" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">%</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">التنبيه عند</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="90" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحسين تلقائي</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <HardDrive className="h-4 w-4 text-green-500" />
                    أداء الذاكرة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">حجم الذاكرة المؤقتة</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="512" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">MB</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">تنظيف تلقائي كل</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="24" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">ساعة</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>ضغط البيانات</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Database className="h-4 w-4 text-purple-500" />
                    قاعدة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">الاتصالات المتزامنة</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="100" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">فترة Timeout</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="30" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">ثانية</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحسين الاستعلامات</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* إعدادات التخزين المؤقت */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Archive className="h-4 w-4" />
                  إعدادات التخزين المؤقت (Cache)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-4 gap-2">
                  <div className="form-rtl">
                    <Label className="text-xs">حجم Cache الشاشات</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="256" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">MB</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">مدة الاحتفاظ</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="24" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">ساعة</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">تحديث تلقائي كل</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="15" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">دقيقة</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">استراتيجية التنظيف</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="lru">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lru">الأقل استخداماً</SelectItem>
                          <SelectItem value="lfu">الأقل تكراراً</SelectItem>
                          <SelectItem value="fifo">الأول بالدخول</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جدول مراقبة الأداء */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <TrendingUp className="h-4 w-4" />
                  مراقبة الأداء الحالي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المورد</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام الحالي</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتوسط</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الذروة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'المعالج (CPU)', current: 45, avg: 42, peak: 89, status: 'طبيعي' },
                      { name: 'الذاكرة (RAM)', current: 62, avg: 58, peak: 85, status: 'طبيعي' },
                      { name: 'القرص (Disk)', current: 78, avg: 72, peak: 92, status: 'تحذير' },
                      { name: 'الشبكة (Network)', current: 35, avg: 40, peak: 78, status: 'طبيعي' },
                      { name: 'قاعدة البيانات', current: 52, avg: 48, peak: 81, status: 'طبيعي' }
                    ].map((item, i) => (
                      <TableRow key={i} className="hover:bg-orange-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs">{item.current}%</span>
                            <Progress value={item.current} className="h-1.5 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.avg}%</TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.peak}%</TableCell>
                        <TableCell className="text-right py-2">
                          {item.status === 'طبيعي' ? (
                            <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">طبيعي</Badge>
                          ) : (
                            <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">تحذير</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs">تحسين</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '999-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأمان</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500"><Save className="h-3 w-3 ml-1" />حفظ التعديلات</Button>
            </div>

            {/* إعدادات الأمان الرئيسية */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Lock className="h-4 w-4 text-red-500" />
                    سياسة كلمات المرور
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">الحد الأدنى للطول</Label>
                    <Input type="number" defaultValue="8" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>أحرف كبيرة</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>أرقام</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رموز خاصة</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">انتهاء الصلاحية</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="90" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">يوم</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Shield className="h-4 w-4 text-blue-500" />
                    الجلسات والوصول
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">مدة الجلسة</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="60" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">دقيقة</span>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الخمول قبل القفل</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="15" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">دقيقة</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>جلسة واحدة فقط</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تسجيل الخروج التلقائي</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">محاولات الدخول</Label>
                    <Input type="number" defaultValue="3" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Network className="h-4 w-4 text-green-500" />
                    أمان الشبكة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفعيل Firewall</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>حظر IPs المشبوهة</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير الاتصال (SSL)</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>Two-Factor Auth</span>
                    <Switch />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">نطاق IPs المسموحة</Label>
                    <Input placeholder="192.168.1.*" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* سجل الأحداث الأمنية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  آخر الأحداث الأمنية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1">
                  {[
                    { time: '11:40', event: 'محاولة وصول غير مصرح من IP: 192.168.1.103', severity: 'warning' },
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
                    <div className="select-rtl mt-1">
                      <Select defaultValue="aes256">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes256">AES-256</SelectItem>
                          <SelectItem value="aes128">AES-128</SelectItem>
                          <SelectItem value="rsa2048">RSA-2048</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير البيانات الحساسة</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير الملفات المرفقة</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير النسخ الاحتياطي</span>
                    <Switch defaultChecked />
                  </div>
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
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراجعة الصلاحيات الدورية</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">تكرار المراجعة</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="30" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">يوم</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تسجيل تغييرات الصلاحيات</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تنبيه عند التغيير</span>
                    <Switch defaultChecked />
                  </div>
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
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Upload className="h-3 w-3 ml-1" />نسخ احتياطي الآن</Button>
              </div>
            </div>

            {/* حالة النسخ الاحتياطي */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'آخر نسخة احتياطية', value: 'منذ 6 ساعات', icon: Clock, color: 'blue' },
                { label: 'عدد النسخ', value: '45 نسخة', icon: Database, color: 'green' },
                { label: 'حجم النسخ الكلي', value: '12.4 GB', icon: HardDrive, color: 'purple' },
                { label: 'النسخ الفاشلة', value: '0', icon: CheckCircle, color: 'green' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: `h-4 w-4 text-${item.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* إعدادات النسخ الاحتياطي */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Settings className="h-4 w-4" />
                    إعدادات النسخ التلقائي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفعيل النسخ التلقائي</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">التكرار</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="daily">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">كل ساعة</SelectItem>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                          <SelectItem value="monthly">شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الوقت المفضل</Label>
                    <Input type="time" defaultValue="02:00" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الاحتفاظ بالنسخ لمدة</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="30" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">يوم</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>ضغط النسخ</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير النسخ</span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Server className="h-4 w-4" />
                    وجهة النسخ الاحتياطي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">الخادم الرئيسي</Label>
                    <Input defaultValue="backup.company.sa" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">المسار</Label>
                    <Input defaultValue="/backups/system/" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسخ احتياطي إضافي</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الخادم الثانوي</Label>
                    <Input defaultValue="backup2.company.sa" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسخ سحابي (Cloud)</span>
                    <Switch />
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">اختبار الاتصال</Button>
                </CardContent>
              </Card>
            </div>

            {/* سجل النسخ الاحتياطية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  سجل النسخ الاحتياطية الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2025-10-19 02:00', type: 'كامل', size: '2.4 GB', duration: '12 دقيقة', status: 'success' },
                      { date: '2025-10-18 02:00', type: 'كامل', size: '2.3 GB', duration: '11 دقيقة', status: 'success' },
                      { date: '2025-10-17 14:00', type: 'تزايدي', size: '450 MB', duration: '3 دقائق', status: 'success' },
                      { date: '2025-10-17 02:00', type: 'كامل', size: '2.3 GB', duration: '13 دقيقة', status: 'success' },
                      { date: '2025-10-16 02:00', type: 'كامل', size: '2.2 GB', duration: '10 دقائق', status: 'success' }
                    ].map((backup, i) => (
                      <TableRow key={i} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs">{i + 1}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.date}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{backup.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.size}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{backup.duration}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نجح</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">استعادة</Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">تحميل</Button>
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
              <Button size="sm" className="h-8 text-xs bg-red-500"><Power className="h-3 w-3 ml-1" />وضع الصيانة</Button>
            </div>

            {/* حالة النظام */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'آخر صيانة', value: 'منذ 3 أيام', icon: Clock, color: 'blue' },
                { label: 'الصيانة القادمة', value: 'بعد 4 أيام', icon: Calendar, color: 'green' },
                { label: 'المهام المجدولة', value: '12 مهمة', icon: Settings, color: 'purple' },
                { label: 'الأخطاء المعلقة', value: '2', icon: AlertTriangle, color: 'yellow' },
                { label: 'التحديثات المتاحة', value: '3 تحديثات', icon: RefreshCw, color: 'cyan' }
              ].map((item, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(item.icon, { className: `h-4 w-4 text-${item.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</p>
                    </div>
                    <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* أدوات الصيانة */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Database className="h-4 w-4 text-blue-500" />
                    صيانة قاعدة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1.5">
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <CheckCircle className="h-3 w-3 ml-2" />
                    تحسين الجداول
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <RefreshCw className="h-3 w-3 ml-2" />
                    إعادة بناء الفهارس
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Trash2 className="h-3 w-3 ml-2" />
                    حذف البيانات القديمة
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Archive className="h-3 w-3 ml-2" />
                    أرشفة السجلات
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <HardDrive className="h-4 w-4 text-green-500" />
                    صيانة النظام
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1.5">
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Trash2 className="h-3 w-3 ml-2" />
                    تنظيف الملفات المؤقتة
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Archive className="h-3 w-3 ml-2" />
                    تنظيف Cache
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <FileText className="h-3 w-3 ml-2" />
                    تنظيف Logs القديمة
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <RefreshCw className="h-3 w-3 ml-2" />
                    إعادة تشغيل الخدمات
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Shield className="h-4 w-4 text-purple-500" />
                    فحص وتحديث
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1.5">
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Eye className="h-3 w-3 ml-2" />
                    فحص الأخطاء
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Shield className="h-3 w-3 ml-2" />
                    فحص أمني شامل
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <Download className="h-3 w-3 ml-2" />
                    تحديث النظام
                  </Button>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs justify-start">
                    <CheckCircle className="h-3 w-3 ml-2" />
                    التحقق من السلامة
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* المهام المجدولة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Calendar className="h-4 w-4" />
                    المهام المجدولة
                  </CardTitle>
                  <Button size="sm" variant="outline" className="h-6 text-xs">إضافة مهمة</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهمة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكرار</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تنفيذ</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنفيذ القادم</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
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
                <CardTitle className="text-sm flex items-center gap-2 text-red-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <AlertTriangle className="h-4 w-4" />
                  تنبيهات حرجة تحتاج إجراء فوري
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-1.5">
                  {[
                    { title: 'استخدام القرص مرتفع جداً', desc: 'وصل استخدام القرص إلى 92% - يجب تنظيف المساحة', time: 'منذ 5 دقائق', action: 'تنظيف الآن' },
                    { title: 'محاولات دخول مشبوهة', desc: '15 محاولة فاشلة من نفس IP في 5 دقائق', time: 'منذ 10 دقائق', action: 'حظر IP' }
                  ].map((alert, i) => (
                    <div key={i} className="p-2 bg-white rounded border border-red-300 hover:shadow-md transition-all">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-xs mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{alert.title}</h4>
                          <p className="text-xs text-gray-700 mb-1">{alert.desc}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{alert.time}</span>
                            <Button size="sm" className="h-6 text-xs bg-red-500">{alert.action}</Button>
                          </div>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Bell className="h-4 w-4" />
                    جميع التنبيهات
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="select-rtl">
                      <Select defaultValue="all">
                        <SelectTrigger className="input-field select-trigger h-7 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأنواع</SelectItem>
                          <SelectItem value="critical">حرجة</SelectItem>
                          <SelectItem value="warning">تحذيرات</SelectItem>
                          <SelectItem value="info">معلوماتية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <div className="p-2 space-y-1.5">
                    {[
                      { type: 'critical', icon: XCircle, color: 'red', title: 'استخدام القرص 92%', desc: 'المساحة على وشك الامتلاء', time: 'منذ 5 دقائق', read: false },
                      { type: 'critical', icon: XCircle, color: 'red', title: 'محاولات دخول مشبوهة', desc: '15 محاولة فاشلة من IP: 192.168.1.156', time: 'منذ 10 دقائق', read: false },
                      { type: 'warning', icon: AlertTriangle, color: 'yellow', title: 'استخدام المعالج مرتفع', desc: 'وصل إلى 87% لمدة 10 دقائق', time: 'منذ 15 دقيقة', read: false },
                      { type: 'security', icon: Shield, color: 'purple', title: 'تغيير في الصلاحيات', desc: 'تم تعديل صلاحيات المستخدم USR-025', time: 'منذ 20 دقيقة', read: false },
                      { type: 'warning', icon: AlertTriangle, color: 'yellow', title: 'نسخة احتياطية متأخرة', desc: 'لم يتم إجراء نسخ احتياطي منذ 8 ساعات', time: 'منذ 25 دقيقة', read: false },
                      { type: 'info', icon: CheckCircle, color: 'green', title: 'اكتمل التحديث', desc: 'تم تحديث النظام إلى الإصدار 5.0.3', time: 'منذ 30 دقيقة', read: true },
                      { type: 'security', icon: Shield, color: 'purple', title: 'جلسة جديدة', desc: 'تسجيل دخول من موقع جديد - الرياض', time: 'منذ 35 دقيقة', read: true },
                      { type: 'warning', icon: AlertTriangle, color: 'yellow', title: 'عدد الجلسات مرتفع', desc: 'يوجد 25 جلسة نشطة حالياً', time: 'منذ 40 دقيقة', read: true },
                      { type: 'info', icon: CheckCircle, color: 'green', title: 'نسخ احتياطي تلقائي', desc: 'تم بنجاح - الحجم: 2.4 GB', time: 'منذ ساعة', read: true },
                      { type: 'system', icon: Settings, color: 'cyan', title: 'صيانة مجدولة', desc: 'صيانة دورية بعد 4 أيام', time: 'منذ ساعتين', read: true },
                      { type: 'info', icon: Bell, color: 'blue', title: 'تقرير يومي جاهز', desc: 'تقرير النشاطات ليوم 2025-10-19', time: 'منذ 3 ساعات', read: true },
                      { type: 'security', icon: Shield, color: 'purple', title: 'تحديث شهادة SSL', desc: 'تم تحديث الشهادة الأمنية بنجاح', time: 'منذ 4 ساعات', read: true }
                    ].map((notification, i) => (
                      <div key={i} className={`p-2 rounded border transition-all cursor-pointer ${
                        notification.read ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : 'bg-white border-blue-200 hover:shadow-md'
                      }`}>
                        <div className="flex items-start gap-2">
                          {React.createElement(notification.icon, { 
                            className: `h-4 w-4 text-${notification.color}-600 flex-shrink-0 mt-0.5` 
                          })}
                          <div className="flex-1 min-w-0">
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
    <div className="w-full h-full flex bg-gray-50 overflow-hidden" dir="rtl">
      <CodeDisplay code="SCR-999" position="top-right" />
      
      <UniversalTabsSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="flex-shrink-0" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة المتقدمة للنظام</h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراقبة وإدارة شاملة للنظام</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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

        <div className="flex-1 overflow-y-auto p-3">
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
                <div className="form-rtl">
                  <Label className="text-xs">الصلاحيات</Label>
                  <Badge className="mt-1 text-xs bg-blue-500 text-white">{selectedSession.permissions} صلاحية</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  <LogOut className="h-4 w-4 ml-2" />
                  إنهاء الجلسة
                </Button>
                <Button variant="outline" className="flex-1">
                  <Lock className="h-4 w-4 ml-2" />
                  قفل الجلسة
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
            <DialogDescription className="dialog-description">معلومات كاملة عن العملية</DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-rtl">
                  <Label className="text-xs">رقم السجل</Label>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">{selectedLog.id}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الوقت</Label>
                  <p className="text-sm mt-1">{selectedLog.timestamp}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المستخدم</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedLog.userName}</p>
                  <code className="text-xs text-gray-500">{selectedLog.userId}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الإجراء</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryIcon(selectedLog.category)}
                    <span className="text-sm">{selectedLog.action}</span>
                  </div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الشاشة</Label>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded block mt-1">{selectedLog.screen}</code>
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

export default SystemAdvancedManagement_Complete_999;
