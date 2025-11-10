import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { 
  FileText, Plus, Search, Filter, Eye, Edit, Trash2, Download,
  CheckCircle, Clock, AlertTriangle, Building, MapPin, Users,
  Calendar, File, Link2, BarChart3, Upload, QrCode, Home,
  Save, Printer, Send, Shield, Camera, RefreshCw, FileCheck,
  Database, MapPinned, Star, Copy, Bell, Settings, TrendingUp,
  Activity, PieChart, Lock, UserCheck, History, Mail, X, Zap,
  Archive, ExternalLink, Repeat, Award, Percent, Tag, Layers
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UniversalTabsSidebar from '../UniversalTabsSidebar';

// أنواع البيانات
interface OwnershipDocument {
  id: string;
  number: string;
  type: 'electronic-deed' | 'rega-document' | 'notary-deed' | 'manual-old' | 'manual-pending';
  area: number;
  owner: string;
  ownershipPercent: number;
  status: 'active' | 'pending' | 'expired' | 'verified';
  issueDate: string;
  city: string;
  district: string;
  planNumber: string;
  plotNumber: string;
  regaVerified: boolean;
  attachments: number;
  linkedTransactions: number;
}

interface Owner {
  id: string;
  type: 'individual' | 'company' | 'institution';
  name: string;
  idNumber: string;
  ownershipPercent: number;
  phone: string;
  email: string;
  notes: string;
}

interface Plot {
  id: string;
  city: string;
  district: string;
  planNumber: string;
  plotNumber: string;
  area: number;
  usage: string;
  northBoundary: string;
  southBoundary: string;
  eastBoundary: string;
  westBoundary: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  documentNumber?: string;
}

interface Attachment {
  id: string;
  documentNumber: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  category: 'main-deed' | 'supplement' | 'map' | 'certificate' | 'correspondence' | 'other';
  description: string;
  isVerified: boolean;
}

interface ActivityLog {
  id: string;
  documentNumber: string;
  action: string;
  type: 'create' | 'update' | 'delete' | 'view' | 'verify' | 'export' | 'attach' | 'link';
  user: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

const OwnershipDocuments_Complete_800: React.FC = () => {
  const [activeTab, setActiveTab] = useState('800-01');
  const [selectedDocument, setSelectedDocument] = useState<OwnershipDocument | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // بيانات تجريبية للوثائق
  const [documents] = useState<OwnershipDocument[]>([
    {
      id: 'DOC-001', number: '310105040083', type: 'electronic-deed', area: 450.5,
      owner: 'أحمد محمد العتيبي', ownershipPercent: 100, status: 'verified',
      issueDate: '2024-03-15', city: 'الرياض', district: 'الملقا', planNumber: '2467',
      plotNumber: '1523', regaVerified: true, attachments: 3, linkedTransactions: 2
    },
    {
      id: 'DOC-002', number: '999640002413', type: 'rega-document', area: 320.75,
      owner: 'فاطمة سعد القحطاني', ownershipPercent: 50, status: 'active',
      issueDate: '2024-05-20', city: 'جدة', district: 'الروضة', planNumber: '1892',
      plotNumber: '745', regaVerified: true, attachments: 5, linkedTransactions: 1
    },
    {
      id: 'DOC-003', number: '450120060125', type: 'notary-deed', area: 600.0,
      owner: 'خالد عبدالله الشمري', ownershipPercent: 100, status: 'active',
      issueDate: '2024-01-10', city: 'الدمام', district: 'الفيصلية', planNumber: '3456',
      plotNumber: '2234', regaVerified: false, attachments: 2, linkedTransactions: 3
    },
    {
      id: 'DOC-004', number: '220345078945', type: 'electronic-deed', area: 280.3,
      owner: 'سارة علي الغامدي', ownershipPercent: 100, status: 'verified',
      issueDate: '2024-06-01', city: 'الرياض', district: 'النرجس', planNumber: '5678',
      plotNumber: '3421', regaVerified: true, attachments: 4, linkedTransactions: 0
    },
    {
      id: 'DOC-005', number: '999640002413', type: 'rega-document', area: 320.75,
      owner: 'محمد بن سلطان العنزي', ownershipPercent: 50, status: 'pending',
      issueDate: '2024-05-20', city: 'جدة', district: 'الروضة', planNumber: '1892',
      plotNumber: '745', regaVerified: false, attachments: 1, linkedTransactions: 1
    },
    {
      id: 'DOC-006', number: '890123456789', type: 'manual-old', area: 750.5,
      owner: 'نورة محمد الدوسري', ownershipPercent: 100, status: 'active',
      issueDate: '2023-12-15', city: 'مكة المكرمة', district: 'العزيزية', planNumber: '4567',
      plotNumber: '1876', regaVerified: false, attachments: 6, linkedTransactions: 2
    },
    {
      id: 'DOC-007', number: '310105098765', type: 'electronic-deed', area: 520.0,
      owner: 'عبدالرحمن أحمد المطيري', ownershipPercent: 100, status: 'verified',
      issueDate: '2024-07-10', city: 'الرياض', district: 'حطين', planNumber: '7890',
      plotNumber: '4532', regaVerified: true, attachments: 3, linkedTransactions: 1
    },
    {
      id: 'DOC-008', number: '450120087654', type: 'notary-deed', area: 380.25,
      owner: 'منى سعيد الزهراني', ownershipPercent: 100, status: 'active',
      issueDate: '2024-04-25', city: 'المدينة المنورة', district: 'العيون', planNumber: '2345',
      plotNumber: '6789', regaVerified: true, attachments: 2, linkedTransactions: 0
    }
  ]);

  // بيانات تجريبية للملاك
  const [owners] = useState<Owner[]>([
    {
      id: 'OWN-001', type: 'individual', name: 'أحمد محمد العتيبي', idNumber: '1023456789',
      ownershipPercent: 100, phone: '0501234567', email: 'ahmed@example.sa', notes: ''
    },
    {
      id: 'OWN-002', type: 'individual', name: 'فاطمة سعد القحطاني', idNumber: '1087654321',
      ownershipPercent: 50, phone: '0509876543', email: 'fatima@example.sa', notes: 'ملكية مشتركة'
    },
    {
      id: 'OWN-003', type: 'individual', name: 'محمد بن سلطان العنزي', idNumber: '1034567890',
      ownershipPercent: 50, phone: '0503456789', email: 'mohammed@example.sa', notes: 'شريك في الملكية'
    },
    {
      id: 'OWN-004', type: 'company', name: 'شركة التطوير العقاري المحدودة', idNumber: '7001234567',
      ownershipPercent: 100, phone: '0112345678', email: 'info@development.sa', notes: 'شركة تطوير عقاري'
    },
    {
      id: 'OWN-005', type: 'individual', name: 'خالد عبدالله الشمري', idNumber: '1056789012',
      ownershipPercent: 100, phone: '0505678901', email: 'khaled@example.sa', notes: ''
    }
  ]);

  // بيانات تجريبية للقطع
  const [plots] = useState<Plot[]>([
    {
      id: 'PLT-001', city: 'الرياض', district: 'الملقا', planNumber: '2467', plotNumber: '1523',
      area: 450.5, usage: 'سكني', northBoundary: '30م شارع 20م', southBoundary: '30م قطعة رقم 1522',
      eastBoundary: '15م ممر', westBoundary: '15م قطعة رقم 1524'
    },
    {
      id: 'PLT-002', city: 'جدة', district: 'الروضة', planNumber: '1892', plotNumber: '745',
      area: 320.75, usage: 'سكني', northBoundary: '25م شارع 15م', southBoundary: '25م قطعة رقم 744',
      eastBoundary: '12.83م قطعة رقم 746', westBoundary: '12.83م شارع 12م'
    },
    {
      id: 'PLT-003', city: 'الدمام', district: 'الفيصلية', planNumber: '3456', plotNumber: '2234',
      area: 600.0, usage: 'تجاري', northBoundary: '40م شارع تجاري', southBoundary: '40م قطعة رقم 2233',
      eastBoundary: '15م ممر عام', westBoundary: '15م قطعة رقم 2235'
    },
    {
      id: 'PLT-004', city: 'الرياض', district: 'النرجس', planNumber: '5678', plotNumber: '3421',
      area: 280.3, usage: 'سكني', northBoundary: '22م شارع 18م', southBoundary: '22م قطعة رقم 3420',
      eastBoundary: '12.74م قطعة رقم 3422', westBoundary: '12.74م ممر'
    }
  ]);

  // بيانات تجريبية للإشعارات
  const [notifications] = useState<Notification[]>([
    {
      id: 'NOT-001', type: 'warning', title: 'وثيقة تحتاج تحديث',
      message: 'الوثيقة 999640002413 تحتاج تحديث بيانات المالك', time: 'منذ 5 دقائق', isRead: false, documentNumber: '999640002413'
    },
    {
      id: 'NOT-002', type: 'success', title: 'اكتمل التوثيق',
      message: 'تم توثيق الوثيقة 310105040083 من REGA بنجاح', time: 'منذ ساعة', isRead: false, documentNumber: '310105040083'
    },
    {
      id: 'NOT-003', type: 'info', title: 'تم رفع مرفق جديد',
      message: 'أضيف مرفق جديد للوثيقة 450120060125', time: 'منذ 3 ساعات', isRead: true, documentNumber: '450120060125'
    },
    {
      id: 'NOT-004', type: 'error', title: 'فشل التحقق',
      message: 'فشل التحقق من الوثيقة 220345078945 - خطأ في الاتصال', time: 'منذ 5 ساعات', isRead: true
    },
    {
      id: 'NOT-005', type: 'success', title: 'تم الربط بمعاملة',
      message: 'تم ربط الوثيقة 310105098765 بالمعاملة TXN-2024-145', time: 'أمس', isRead: true
    }
  ]);

  // بيانات تجريبية للمرفقات
  const [attachments] = useState<Attachment[]>([
    {
      id: 'ATT-001', documentNumber: '310105040083', fileName: 'صك_الكتروني_310105040083.pdf',
      fileType: 'PDF', fileSize: '2.4 MB', uploadedBy: 'أحمد محمد العتيبي', uploadDate: '2024-03-15 10:30',
      category: 'main-deed', description: 'الصك الإلكتروني الأصلي', isVerified: true
    },
    {
      id: 'ATT-002', documentNumber: '310105040083', fileName: 'مخطط_القطعة_1523.pdf',
      fileType: 'PDF', fileSize: '1.8 MB', uploadedBy: 'أحمد محمد العتيبي', uploadDate: '2024-03-15 10:35',
      category: 'map', description: 'مخطط القطعة من البلدية', isVerified: true
    },
    {
      id: 'ATT-003', documentNumber: '310105040083', fileName: 'شهادة_REGA.pdf',
      fileType: 'PDF', fileSize: '850 KB', uploadedBy: 'النظام (REGA)', uploadDate: '2024-03-15 11:00',
      category: 'certificate', description: 'شهادة توثيق REGA', isVerified: true
    },
    {
      id: 'ATT-004', documentNumber: '999640002413', fileName: 'وثيقة_REGA_999640002413.pdf',
      fileType: 'PDF', fileSize: '3.2 MB', uploadedBy: 'فاطمة سعد القحطاني', uploadDate: '2024-05-20 14:20',
      category: 'main-deed', description: 'وثيقة REGA الأصلية', isVerified: true
    },
    {
      id: 'ATT-005', documentNumber: '999640002413', fileName: 'صورة_الهوية_المالك1.pdf',
      fileType: 'PDF', fileSize: '650 KB', uploadedBy: 'فاطمة سعد القحطاني', uploadDate: '2024-05-20 14:25',
      category: 'supplement', description: 'صورة هوية المالك الأول', isVerified: true
    },
    {
      id: 'ATT-006', documentNumber: '999640002413', fileName: 'صورة_الهوية_المالك2.pdf',
      fileType: 'PDF', fileSize: '720 KB', uploadedBy: 'محمد بن سلطان العنزي', uploadDate: '2024-05-20 15:10',
      category: 'supplement', description: 'صورة هوية المالك الثاني', isVerified: true
    },
    {
      id: 'ATT-007', documentNumber: '450120060125', fileName: 'صك_عدلي_450120060125.pdf',
      fileType: 'PDF', fileSize: '4.1 MB', uploadedBy: 'خالد عبدالله الشمري', uploadDate: '2024-01-10 09:45',
      category: 'main-deed', description: 'الصك العدلي الأصلي', isVerified: false
    },
    {
      id: 'ATT-008', documentNumber: '450120060125', fileName: 'مراسلة_البلدية.pdf',
      fileType: 'PDF', fileSize: '1.2 MB', uploadedBy: 'خالد عبدالله الشمري', uploadDate: '2024-01-10 10:00',
      category: 'correspondence', description: 'مراسلة البلدية بشأن الصك', isVerified: false
    },
    {
      id: 'ATT-009', documentNumber: '220345078945', fileName: 'صك_الكتروني_220345078945.pdf',
      fileType: 'PDF', fileSize: '2.8 MB', uploadedBy: 'سارة علي الغامدي', uploadDate: '2024-06-01 11:15',
      category: 'main-deed', description: 'الصك الإلكتروني', isVerified: true
    },
    {
      id: 'ATT-010', documentNumber: '890123456789', fileName: 'صك_يدوي_قديم.pdf',
      fileType: 'PDF', fileSize: '5.4 MB', uploadedBy: 'نورة محمد الدوسري', uploadDate: '2023-12-15 16:30',
      category: 'main-deed', description: 'صك يدوي قديم (ممسوح ضوئياً)', isVerified: false
    }
  ]);

  // بيانات تجريبية لسجل النشاطات
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: 'LOG-001', documentNumber: '310105040083', action: 'توثيق إلكتروني من REGA',
      type: 'verify', user: 'النظام (REGA)', timestamp: '2024-10-19 11:30:15',
      details: 'تم التوثيق بنجاح - مدة العملية: 2.3 ثانية', ipAddress: '192.168.1.45'
    },
    {
      id: 'LOG-002', documentNumber: '310105040083', action: 'رفع مرفق جديد',
      type: 'attach', user: 'أحمد محمد العتيبي', timestamp: '2024-10-19 10:35:00',
      details: 'تم رفع ملف: مخطط_القطعة_1523.pdf (1.8 MB)', ipAddress: '192.168.1.45'
    },
    {
      id: 'LOG-003', documentNumber: '999640002413', action: 'تحديث بيانات المالك',
      type: 'update', user: 'فاطمة سعد القحطاني', timestamp: '2024-10-19 09:20:30',
      details: 'تم تحديث بيانات الاتصال للمالك الأول', ipAddress: '192.168.1.78'
    },
    {
      id: 'LOG-004', documentNumber: '450120060125', action: 'ربط بمعاملة',
      type: 'link', user: 'خالد عبدالله الشمري', timestamp: '2024-10-18 15:45:00',
      details: 'تم ربط الوثيقة بالمعاملة TXN-2024-198', ipAddress: '192.168.1.92'
    },
    {
      id: 'LOG-005', documentNumber: '220345078945', action: 'عرض الوثيقة',
      type: 'view', user: 'سارة علي الغامدي', timestamp: '2024-10-18 14:10:20',
      details: 'تم عرض تفاصيل الوثيقة', ipAddress: '192.168.1.103'
    },
    {
      id: 'LOG-006', documentNumber: '310105098765', action: 'تصدير التقرير',
      type: 'export', user: 'عبدالرحمن أحمد المطيري', timestamp: '2024-10-18 11:30:00',
      details: 'تم تصدير تقرير الوثيقة بصيغة PDF', ipAddress: '192.168.1.115'
    },
    {
      id: 'LOG-007', documentNumber: '890123456789', action: 'إنشاء وثيقة جديدة',
      type: 'create', user: 'نورة محمد الدوسري', timestamp: '2023-12-15 16:30:00',
      details: 'تم إنشاء وثيقة جديدة - صك يدوي قديم', ipAddress: '192.168.1.125'
    },
    {
      id: 'LOG-008', documentNumber: '450120087654', action: 'حذف مرفق',
      type: 'delete', user: 'منى سعيد الزهراني', timestamp: '2024-10-17 13:20:00',
      details: 'تم حذف مرفق قديم: مخطط_مؤقت.pdf', ipAddress: '192.168.1.98'
    }
  ]);

  const tabs = [
    { id: '800-01', label: 'الوثائق', icon: FileText, color: 'bg-blue-500' },
    { id: '800-02', label: 'الملاك', icon: Users, color: 'bg-green-500' },
    { id: '800-03', label: 'القطع', icon: MapPin, color: 'bg-purple-500' },
    { id: '800-04', label: 'البحث المتقدم', icon: Search, color: 'bg-orange-500' },
    { id: '800-05', label: 'الإحصائيات', icon: BarChart3, color: 'bg-cyan-500' },
    { id: '800-06', label: 'التوثيق الإلكتروني', icon: Shield, color: 'bg-red-500' },
    { id: '800-07', label: 'المرفقات', icon: File, color: 'bg-pink-500' },
    { id: '800-08', label: 'السجل والتاريخ', icon: History, color: 'bg-indigo-500' },
    { id: '800-09', label: 'الإشعارات', icon: Bell, color: 'bg-yellow-500' },
    { id: '800-10', label: 'الإعدادات', icon: Settings, color: 'bg-gray-500' }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      active: <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نشط</Badge>,
      verified: <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-5">موثق</Badge>,
      pending: <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">معلق</Badge>,
      expired: <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">منتهي</Badge>
    };
    return badges[status] || <Badge className="text-xs px-1.5 py-0 h-5">-</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const types = {
      'electronic-deed': { label: 'صك إلكتروني', color: 'bg-blue-100 text-blue-800' },
      'rega-document': { label: 'وثيقة REGA', color: 'bg-green-100 text-green-800' },
      'notary-deed': { label: 'صك عدلي', color: 'bg-purple-100 text-purple-800' },
      'manual-old': { label: 'يدوي قديم', color: 'bg-gray-100 text-gray-800' },
      'manual-pending': { label: 'يدوي معلق', color: 'bg-yellow-100 text-yellow-800' }
    };
    const t = types[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={`${t.color} text-xs px-1.5 py-0 h-5`}>{t.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '800-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>وثائق الملكية</h2>
                <Badge className="bg-blue-500 text-white text-xs px-2 py-0">{documents.length} وثيقة</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="بحث..." className="input-field h-8 w-48 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Plus className="h-3 w-3 ml-1" />إضافة وثيقة</Button>
              </div>
            </div>

            {/* بطاقات إحصائية مكثفة */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'الكل', value: documents.length, icon: FileText, color: 'blue' },
                { label: 'موثقة', value: documents.filter(d => d.status === 'verified').length, icon: CheckCircle, color: 'green' },
                { label: 'نشطة', value: documents.filter(d => d.status === 'active').length, icon: Activity, color: 'cyan' },
                { label: 'معلقة', value: documents.filter(d => d.status === 'pending').length, icon: Clock, color: 'yellow' },
                { label: 'REGA', value: documents.filter(d => d.regaVerified).length, icon: Shield, color: 'purple' },
                { label: 'مرفقات', value: documents.reduce((sum, d) => sum + d.attachments, 0), icon: File, color: 'orange' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول الوثائق المكثف */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2 w-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الوثيقة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملكية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>REGA</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc, index) => (
                        <TableRow key={doc.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => { setSelectedDocument(doc); setShowDetailsDialog(true); }}>
                          <TableCell className="text-right py-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{doc.number}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">{getTypeBadge(doc.type)}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.owner}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{doc.area.toLocaleString('ar-SA')} م²</TableCell>
                          <TableCell className="text-right py-2 text-xs">{doc.ownershipPercent}%</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.city}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.district}</TableCell>
                          <TableCell className="text-right py-2">{getStatusBadge(doc.status)}</TableCell>
                          <TableCell className="text-right py-2">
                            {doc.regaVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="عرض"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="تعديل"><Edit className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="تحميل"><Download className="h-3 w-3" /></Button>
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

      case '800-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاك</h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0">{owners.length} مالك</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="بحث في الملاك..." className="input-field h-8 w-48 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                <Button size="sm" className="h-8 text-xs bg-green-500"><Plus className="h-3 w-3 ml-1" />إضافة مالك</Button>
              </div>
            </div>

            {/* إحصائيات الملاك */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'إجمالي الملاك', value: owners.length, icon: Users, color: 'blue' },
                { label: 'أفراد', value: owners.filter(o => o.type === 'individual').length, icon: UserCheck, color: 'green' },
                { label: 'شركات', value: owners.filter(o => o.type === 'company').length, icon: Building, color: 'purple' },
                { label: 'مؤسسات', value: owners.filter(o => o.type === 'institution').length, icon: Award, color: 'orange' },
                { label: 'ملكية كاملة', value: owners.filter(o => o.ownershipPercent === 100).length, icon: Percent, color: 'cyan' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول الملاك */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2 w-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الهوية/السجل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسبة الملكية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجوال</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد الإلكتروني</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>ملاحظات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {owners.map((owner, index) => (
                        <TableRow key={owner.id} className="hover:bg-green-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{owner.name}</TableCell>
                          <TableCell className="text-right py-2">
                            {owner.type === 'individual' ? (
                              <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0 h-5">فرد</Badge>
                            ) : owner.type === 'company' ? (
                              <Badge className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0 h-5">شركة</Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 text-xs px-1.5 py-0 h-5">مؤسسة</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{owner.idNumber}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs">{owner.ownershipPercent}%</span>
                              <Progress value={owner.ownershipPercent} className="h-1.5 w-16" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{owner.phone}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{owner.email}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{owner.notes || '-'}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">تعديل</Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Mail className="h-3 w-3" /></Button>
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

      case '800-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطع</h2>
                <Badge className="bg-purple-500 text-white text-xs px-2 py-0">{plots.length} قطعة</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="بحث في القطع..." className="input-field h-8 w-48 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                <Button size="sm" variant="outline" className="h-8 text-xs"><MapPin className="h-3 w-3 ml-1" />عرض الخريطة</Button>
                <Button size="sm" className="h-8 text-xs bg-purple-500"><Plus className="h-3 w-3 ml-1" />إضافة قطعة</Button>
              </div>
            </div>

            {/* إحصائيات القطع */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'إجمالي القطع', value: plots.length, icon: MapPin, color: 'purple' },
                { label: 'المساحة الكلية', value: plots.reduce((sum, p) => sum + p.area, 0).toLocaleString('ar-SA') + ' م²', icon: Layers, color: 'blue', isText: true },
                { label: 'سكني', value: plots.filter(p => p.usage === 'سكني').length, icon: Home, color: 'green' },
                { label: 'تجاري', value: plots.filter(p => p.usage === 'تجاري').length, icon: Building, color: 'orange' },
                { label: 'المدن', value: new Set(plots.map(p => p.city)).size, icon: MapPinned, color: 'cyan' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className={stat.isText ? "text-sm" : "text-lg"} style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* قائمة القطع */}
            <div className="grid grid-cols-2 gap-3">
              {plots.map((plot, index) => (
                <Card key={plot.id} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader className="p-2 pb-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <MapPin className="h-4 w-4 text-purple-500" />
                        قطعة رقم {plot.plotNumber}
                      </CardTitle>
                      <Badge className={plot.usage === 'سكني' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} className="text-xs px-1.5 py-0 h-5">
                        {plot.usage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="form-rtl">
                        <Label className="text-xs text-gray-600">المدينة</Label>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{plot.city}</p>
                      </div>
                      <div className="form-rtl">
                        <Label className="text-xs text-gray-600">الحي</Label>
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{plot.district}</p>
                      </div>
                      <div className="form-rtl">
                        <Label className="text-xs text-gray-600">المخطط</Label>
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{plot.planNumber}</code>
                      </div>
                      <div className="form-rtl">
                        <Label className="text-xs text-gray-600">المساحة</Label>
                        <p className="text-xs">{plot.area.toLocaleString('ar-SA')} م²</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">الحدود</Label>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-xs p-1 bg-blue-50 rounded">
                          <span className="text-gray-600">شمالاً:</span> {plot.northBoundary}
                        </div>
                        <div className="text-xs p-1 bg-green-50 rounded">
                          <span className="text-gray-600">جنوباً:</span> {plot.southBoundary}
                        </div>
                        <div className="text-xs p-1 bg-purple-50 rounded">
                          <span className="text-gray-600">شرقاً:</span> {plot.eastBoundary}
                        </div>
                        <div className="text-xs p-1 bg-orange-50 rounded">
                          <span className="text-gray-600">غرباً:</span> {plot.westBoundary}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Eye className="h-3 w-3 ml-1" />عرض</Button>
                      <Button size="sm" variant="outline" className="flex-1 h-6 text-xs"><Edit className="h-3 w-3 ml-1" />تعديل</Button>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0"><MapPin className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '800-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>البحث المتقدم</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />إعادة تعيين</Button>
                <Button size="sm" className="h-8 text-xs bg-orange-500"><Search className="h-3 w-3 ml-1" />بحث</Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* معايير البحث الأساسية */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Search className="h-4 w-4" />
                    البحث الأساسي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">رقم الوثيقة</Label>
                    <Input placeholder="أدخل رقم الوثيقة" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">اسم المالك</Label>
                    <Input placeholder="أدخل اسم المالك" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">رقم الهوية</Label>
                    <Input placeholder="رقم الهوية/السجل" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">رقم القطعة</Label>
                    <Input placeholder="أدخل رقم القطعة" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">رقم المخطط</Label>
                    <Input placeholder="أدخل رقم المخطط" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                </CardContent>
              </Card>

              {/* الموقع */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <MapPin className="h-4 w-4" />
                    الموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">المدينة</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="all">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع المدن</SelectItem>
                          <SelectItem value="riyadh">الرياض</SelectItem>
                          <SelectItem value="jeddah">جدة</SelectItem>
                          <SelectItem value="dammam">الدمام</SelectItem>
                          <SelectItem value="makkah">مكة المكرمة</SelectItem>
                          <SelectItem value="madinah">المدينة المنورة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الحي</Label>
                    <Input placeholder="أدخل اسم الحي" className="input-field h-7 text-xs mt-1" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">نوع الاستخدام</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="all">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأنواع</SelectItem>
                          <SelectItem value="residential">سكني</SelectItem>
                          <SelectItem value="commercial">تجاري</SelectItem>
                          <SelectItem value="industrial">صناعي</SelectItem>
                          <SelectItem value="agricultural">زراعي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* معايير إضافية */}
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Filter className="h-4 w-4" />
                    معايير إضافية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <div className="form-rtl">
                    <Label className="text-xs">نوع الوثيقة</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="all">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأنواع</SelectItem>
                          <SelectItem value="electronic-deed">صك إلكتروني</SelectItem>
                          <SelectItem value="rega-document">وثيقة REGA</SelectItem>
                          <SelectItem value="notary-deed">صك عدلي</SelectItem>
                          <SelectItem value="manual-old">يدوي قديم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">الحالة</Label>
                    <div className="select-rtl mt-1">
                      <Select defaultValue="all">
                        <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الحالات</SelectItem>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="verified">موثق</SelectItem>
                          <SelectItem value="pending">معلق</SelectItem>
                          <SelectItem value="expired">منتهي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">المساحة من</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" placeholder="من" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">إلى</span>
                      <Input type="number" placeholder="إلى" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                    </div>
                  </div>
                  <div className="form-rtl">
                    <Label className="text-xs">تاريخ الإصدار</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="date" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                      <span className="text-xs">إلى</span>
                      <Input type="date" className="input-field h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>موثقة من REGA فقط</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* نتائج البحث */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <FileText className="h-4 w-4" />
                    نتائج البحث
                  </CardTitle>
                  <Badge className="bg-blue-500 text-white text-xs px-2 py-0">8 نتيجة</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <p className="text-xs text-gray-600 text-center py-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  اضغط على "بحث" لعرض النتائج
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case '800-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select defaultValue="month">
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">هذا الأسبوع</SelectItem>
                      <SelectItem value="month">هذا الشهر</SelectItem>
                      <SelectItem value="quarter">هذا الربع</SelectItem>
                      <SelectItem value="year">هذا العام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* الإحصائيات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'إجمالي الوثائق', value: documents.length, icon: FileText, color: 'blue', change: '+12%' },
                { label: 'المساحة الكلية', value: documents.reduce((sum, d) => sum + d.area, 0).toLocaleString('ar-SA') + ' م²', icon: Layers, color: 'green', change: '+8%', isText: true },
                { label: 'الملاك', value: owners.length, icon: Users, color: 'purple', change: '+5%' },
                { label: 'القطع', value: plots.length, icon: MapPin, color: 'orange', change: '+3%' },
                { label: 'موثقة REGA', value: documents.filter(d => d.regaVerified).length, icon: Shield, color: 'cyan', change: '+15%' },
                { label: 'المرفقات', value: documents.reduce((sum, d) => sum + d.attachments, 0), icon: File, color: 'pink', change: '+20%' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={stat.isText ? "text-sm" : "text-lg"} style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                      <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">{stat.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* توزيع الوثائق */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <PieChart className="h-4 w-4" />
                    توزيع الوثائق حسب النوع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1.5">
                    {[
                      { type: 'صك إلكتروني', count: 3, color: 'bg-blue-500', percent: 37.5 },
                      { type: 'وثيقة REGA', count: 2, color: 'bg-green-500', percent: 25 },
                      { type: 'صك عدلي', count: 2, color: 'bg-purple-500', percent: 25 },
                      { type: 'يدوي قديم', count: 1, color: 'bg-gray-500', percent: 12.5 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${item.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</span>
                            <span className="text-xs text-gray-600">{item.count}</span>
                          </div>
                          <Progress value={item.percent} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-600">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <BarChart3 className="h-4 w-4" />
                    توزيع حسب الحالة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1.5">
                    {[
                      { status: 'نشطة', count: 4, color: 'bg-green-500', percent: 50 },
                      { status: 'موثقة', count: 3, color: 'bg-blue-500', percent: 37.5 },
                      { status: 'معلقة', count: 1, color: 'bg-yellow-500', percent: 12.5 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${item.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.status}</span>
                            <span className="text-xs text-gray-600">{item.count}</span>
                          </div>
                          <Progress value={item.percent} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-600">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* إحصائيات المدن */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <MapPinned className="h-4 w-4" />
                  توزيع حسب المدن
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الوثائق</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { city: 'الرياض', count: 3, area: 1251.3, percent: 37.5 },
                      { city: 'جدة', count: 2, area: 641.5, percent: 25 },
                      { city: 'الدمام', count: 1, area: 600.0, percent: 12.5 },
                      { city: 'المدينة المنورة', count: 1, area: 380.25, percent: 12.5 },
                      { city: 'مكة المكرمة', count: 1, area: 750.5, percent: 12.5 }
                    ].map((item, i) => (
                      <TableRow key={i} className="hover:bg-cyan-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.city}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.count}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.area.toLocaleString('ar-SA')} م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.percent}%</TableCell>
                        <TableCell className="text-right py-2">
                          <Progress value={item.percent} className="h-1.5" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '800-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق الإلكتروني</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500"><Shield className="h-3 w-3 ml-1" />توثيق جديد</Button>
            </div>

            {/* حالة التوثيق */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'موثقة REGA', value: documents.filter(d => d.regaVerified).length, icon: CheckCircle, color: 'green' },
                { label: 'قيد التوثيق', value: 2, icon: Clock, color: 'yellow' },
                { label: 'فشل التوثيق', value: 1, icon: X, color: 'red' },
                { label: 'يدوية', value: documents.filter(d => !d.regaVerified).length, icon: File, color: 'gray' },
                { label: 'نسبة التوثيق', value: Math.round((documents.filter(d => d.regaVerified).length / documents.length) * 100) + '%', icon: Percent, color: 'blue', isText: true }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className={stat.isText ? "text-sm" : "text-lg"} style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* طرق التوثيق */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Shield className="h-4 w-4 text-green-500" />
                    توثيق REGA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <p className="text-xs text-gray-600">التوثيق الإلكتروني من منصة REGA</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>سرعة التوثيق</span>
                      <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0">فوري</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>الدقة</span>
                      <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0">عالية</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>التكلفة</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">مجاني</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full h-7 text-xs bg-green-500">بدء التوثيق</Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <FileCheck className="h-4 w-4 text-blue-500" />
                    توثيق يدوي
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <p className="text-xs text-gray-600">التوثيق اليدوي للوثائق القديمة</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>سرعة التوثيق</span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0">عادية</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>الدقة</span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0">متوسطة</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>التكلفة</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">مجاني</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">بدء التوثيق</Button>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <QrCode className="h-4 w-4 text-purple-500" />
                    مسح QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  <p className="text-xs text-gray-600">التوثيق عبر مسح رمز QR</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>سرعة التوثيق</span>
                      <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0">فوري</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>الدقة</span>
                      <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0">عالية جداً</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>التكلفة</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">مجاني</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">مسح الرمز</Button>
                </CardContent>
              </Card>
            </div>

            {/* سجل التوثيق */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <History className="h-4 w-4" />
                  آخر عمليات التوثيق
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الوثيقة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { time: '2024-10-19 11:30', number: '310105040083', method: 'REGA', duration: '2.3 ثانية', status: 'success', user: 'أحمد محمد' },
                      { time: '2024-10-19 10:15', number: '220345078945', method: 'REGA', duration: '1.8 ثانية', status: 'success', user: 'فاطمة سعد' },
                      { time: '2024-10-19 09:45', number: '450120087654', method: 'QR Code', duration: '0.5 ثانية', status: 'success', user: 'خالد عبدالله' },
                      { time: '2024-10-18 16:20', number: '890123456789', method: 'يدوي', duration: '5 دقائق', status: 'pending', user: 'سارة علي' },
                      { time: '2024-10-18 14:10', number: '999640002413', method: 'REGA', duration: '-', status: 'failed', user: 'محمد بن سلطان' }
                    ].map((item, i) => (
                      <TableRow key={i} className="hover:bg-red-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs">{item.time}</TableCell>
                        <TableCell className="text-right py-2">
                          <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{item.number}</code>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{item.method}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{item.duration}</TableCell>
                        <TableCell className="text-right py-2">
                          {item.status === 'success' ? (
                            <Badge className="bg-green-500 text-white text-xs px-1.5 py-0 h-5">نجح</Badge>
                          ) : item.status === 'pending' ? (
                            <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0 h-5">معلق</Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">فشل</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '800-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفقات</h2>
                <Badge className="bg-pink-500 text-white text-xs px-2 py-0">{attachments.length} مرفق</Badge>
              </div>
              <div className="flex gap-2">
                <Input placeholder="بحث في المرفقات..." className="input-field h-8 w-48 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }} />
                <Button size="sm" className="h-8 text-xs bg-pink-500"><Upload className="h-3 w-3 ml-1" />رفع مرفق</Button>
              </div>
            </div>

            {/* إحصائيات المرفقات */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'إجمالي المرفقات', value: attachments.length, icon: File, color: 'pink' },
                { label: 'صكوك أصلية', value: attachments.filter(a => a.category === 'main-deed').length, icon: FileCheck, color: 'blue' },
                { label: 'مخططات', value: attachments.filter(a => a.category === 'map').length, icon: MapPin, color: 'green' },
                { label: 'شهادات', value: attachments.filter(a => a.category === 'certificate').length, icon: Award, color: 'purple' },
                { label: 'موثقة', value: attachments.filter(a => a.isVerified).length, icon: CheckCircle, color: 'cyan' },
                { label: 'الحجم الكلي', value: '23.1 MB', icon: Database, color: 'orange', isText: true }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className={stat.isText ? "text-sm" : "text-lg"} style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* قائمة المرفقات */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2 w-8" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الوثيقة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الرفع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>رفع بواسطة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>موثق</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attachments.map((att, index) => (
                        <TableRow key={att.id} className="hover:bg-pink-50 transition-colors">
                          <TableCell className="text-right py-2 text-xs">{index + 1}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <File className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-xs truncate max-w-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{att.fileName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{att.documentNumber}</code>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            {att.category === 'main-deed' ? (
                              <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0 h-5">صك أصلي</Badge>
                            ) : att.category === 'map' ? (
                              <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0 h-5">مخطط</Badge>
                            ) : att.category === 'certificate' ? (
                              <Badge className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0 h-5">شهادة</Badge>
                            ) : att.category === 'supplement' ? (
                              <Badge className="bg-orange-100 text-orange-800 text-xs px-1.5 py-0 h-5">مستند مكمل</Badge>
                            ) : att.category === 'correspondence' ? (
                              <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1.5 py-0 h-5">مراسلة</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0 h-5">أخرى</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0">{att.fileType}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{att.fileSize}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{att.uploadDate}</TableCell>
                          <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{att.uploadedBy}</TableCell>
                          <TableCell className="text-right py-2">
                            {att.isVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-auto" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400 mr-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="عرض"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0" title="تحميل"><Download className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-red-600" title="حذف"><Trash2 className="h-3 w-3" /></Button>
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

      case '800-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>السجل والتاريخ</h2>
                <Badge className="bg-indigo-500 text-white text-xs px-2 py-0">{activityLogs.length} نشاط</Badge>
              </div>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select defaultValue="all">
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنشطة</SelectItem>
                      <SelectItem value="create">إنشاء</SelectItem>
                      <SelectItem value="update">تحديث</SelectItem>
                      <SelectItem value="delete">حذف</SelectItem>
                      <SelectItem value="view">عرض</SelectItem>
                      <SelectItem value="verify">توثيق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات النشاطات */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'إجمالي النشاطات', value: activityLogs.length, icon: Activity, color: 'indigo' },
                { label: 'توثيق', value: activityLogs.filter(l => l.type === 'verify').length, icon: Shield, color: 'green' },
                { label: 'تحديث', value: activityLogs.filter(l => l.type === 'update').length, icon: RefreshCw, color: 'blue' },
                { label: 'ربط', value: activityLogs.filter(l => l.type === 'link').length, icon: Link2, color: 'purple' },
                { label: 'مرفقات', value: activityLogs.filter(l => l.type === 'attach').length, icon: File, color: 'orange' },
                { label: 'اليوم', value: activityLogs.filter(l => l.timestamp.startsWith('2024-10-19')).length, icon: Clock, color: 'cyan' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Timeline النشاطات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <History className="h-4 w-4" />
                  سجل النشاطات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="p-3 space-y-2">
                    {activityLogs.map((log, index) => (
                      <div key={log.id} className="relative">
                        {index !== activityLogs.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" style={{ right: 'auto', left: '1rem' }} />
                        )}
                        <div className="flex items-start gap-3 p-2 bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            log.type === 'verify' ? 'bg-green-100' :
                            log.type === 'create' ? 'bg-blue-100' :
                            log.type === 'update' ? 'bg-purple-100' :
                            log.type === 'delete' ? 'bg-red-100' :
                            log.type === 'view' ? 'bg-cyan-100' :
                            log.type === 'attach' ? 'bg-orange-100' :
                            log.type === 'link' ? 'bg-pink-100' :
                            'bg-gray-100'
                          }`}>
                            {log.type === 'verify' ? <Shield className="h-4 w-4 text-green-600" /> :
                             log.type === 'create' ? <Plus className="h-4 w-4 text-blue-600" /> :
                             log.type === 'update' ? <RefreshCw className="h-4 w-4 text-purple-600" /> :
                             log.type === 'delete' ? <Trash2 className="h-4 w-4 text-red-600" /> :
                             log.type === 'view' ? <Eye className="h-4 w-4 text-cyan-600" /> :
                             log.type === 'attach' ? <File className="h-4 w-4 text-orange-600" /> :
                             log.type === 'link' ? <Link2 className="h-4 w-4 text-pink-600" /> :
                             <Activity className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.action}</h4>
                              <span className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{log.details}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{log.documentNumber}</code>
                              <Badge variant="outline" className="text-xs px-1.5 py-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.user}</Badge>
                              <span className="text-xs text-gray-500">{log.ipAddress}</span>
                            </div>
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

      case '800-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإشعارات</h2>
                <Badge className="bg-yellow-500 text-white text-xs px-2 py-0">{notifications.filter(n => !n.isRead).length} جديد</Badge>
              </div>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select defaultValue="all">
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="unread">غير مقروءة</SelectItem>
                      <SelectItem value="success">نجاح</SelectItem>
                      <SelectItem value="warning">تحذيرات</SelectItem>
                      <SelectItem value="error">أخطاء</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs">تحديد الكل كمقروء</Button>
              </div>
            </div>

            {/* إحصائيات الإشعارات */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'الكل', value: notifications.length, icon: Bell, color: 'yellow' },
                { label: 'غير مقروءة', value: notifications.filter(n => !n.isRead).length, icon: Bell, color: 'red' },
                { label: 'نجاح', value: notifications.filter(n => n.type === 'success').length, icon: CheckCircle, color: 'green' },
                { label: 'تحذيرات', value: notifications.filter(n => n.type === 'warning').length, icon: AlertTriangle, color: 'yellow' },
                { label: 'أخطاء', value: notifications.filter(n => n.type === 'error').length, icon: X, color: 'red' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* قائمة الإشعارات */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="p-2 space-y-1.5">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        !notif.isRead ? 'bg-blue-50 border-blue-200 hover:shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}>
                        <div className="flex items-start gap-2">
                          {notif.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          ) : notif.type === 'error' ? (
                            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Bell className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{notif.title}</h4>
                              {!notif.isRead && <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0 h-4">جديد</Badge>}
                            </div>
                            <p className="text-xs text-gray-600 mb-1.5">{notif.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{notif.time}</span>
                              {notif.documentNumber && (
                                <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{notif.documentNumber}</code>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0 flex-shrink-0"><Eye className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '800-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500"><Save className="h-3 w-3 ml-1" />حفظ التعديلات</Button>
            </div>

            {/* إعدادات العرض */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Eye className="h-4 w-4" />
                  إعدادات العرض
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض الوثائق في شبكة</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>عرض التفاصيل الموسعة</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إخفاء الوثائق المنتهية</span>
                  <Switch />
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">عدد النتائج في الصفحة</Label>
                  <div className="select-rtl mt-1">
                    <Select defaultValue="20">
                      <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 نتائج</SelectItem>
                        <SelectItem value="20">20 نتيجة</SelectItem>
                        <SelectItem value="50">50 نتيجة</SelectItem>
                        <SelectItem value="100">100 نتيجة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات الإشعارات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Bell className="h-4 w-4" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفعيل الإشعارات</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات البريد الإلكتروني</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات التوثيق</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات التحديثات</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إشعارات انتهاء الصلاحية</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* إعدادات التوثيق */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Shield className="h-4 w-4" />
                  إعدادات التوثيق
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوثيق التلقائي من REGA</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>حفظ شهادات التوثيق</span>
                  <Switch defaultChecked />
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الطريقة المفضلة للتوثيق</Label>
                  <div className="select-rtl mt-1">
                    <Select defaultValue="rega">
                      <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rega">REGA تلقائي</SelectItem>
                        <SelectItem value="qr">مسح QR Code</SelectItem>
                        <SelectItem value="manual">يدوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات الأمان */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Lock className="h-4 w-4" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تسجيل جميع النشاطات</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>طلب تأكيد عند الحذف</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تشفير المرفقات</span>
                  <Switch defaultChecked />
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">مدة الاحتفاظ بالسجلات</Label>
                  <div className="select-rtl mt-1">
                    <Select defaultValue="365">
                      <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 يوم</SelectItem>
                        <SelectItem value="180">180 يوم</SelectItem>
                        <SelectItem value="365">سنة واحدة</SelectItem>
                        <SelectItem value="730">سنتين</SelectItem>
                        <SelectItem value="unlimited">غير محدود</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إعدادات التصدير */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4" />
                  إعدادات التصدير والنسخ الاحتياطي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <div className="form-rtl">
                  <Label className="text-xs">تنسيق التصدير الافتراضي</Label>
                  <div className="select-rtl mt-1">
                    <Select defaultValue="pdf">
                      <SelectTrigger className="input-field select-trigger h-7 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تضمين المرفقات عند التصدير</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نسخ احتياطي تلقائي أسبوعي</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex bg-gray-50 overflow-hidden" dir="rtl">
      <CodeDisplay code="SCR-800" position="top-right" />
      
      <UniversalTabsSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="flex-shrink-0" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>وثائق الملكية</h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة شاملة لوثائق الملكية والصكوك</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-0.5">
                <Database className="h-3 w-3 ml-1" />
                {documents.length} وثيقة
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-0.5">
                <CheckCircle className="h-3 w-3 ml-1" />
                {documents.filter(d => d.regaVerified).length} موثقة
              </Badge>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="h-3 w-3 ml-1" />
                {notifications.filter(n => !n.isRead).length}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {renderTabContent()}
        </div>
      </div>

      {/* Dialog تفاصيل الوثيقة */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الوثيقة</DialogTitle>
            <DialogDescription className="dialog-description">معلومات كاملة عن الوثيقة</DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="form-rtl">
                  <Label className="text-xs">رقم الوثيقة</Label>
                  <code className="text-sm bg-blue-100 px-2 py-1 rounded block mt-1">{selectedDocument.number}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">النوع</Label>
                  <div className="mt-1">{getTypeBadge(selectedDocument.type)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المالك</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.owner}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">نسبة الملكية</Label>
                  <p className="text-sm mt-1">{selectedDocument.ownershipPercent}%</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المساحة</Label>
                  <p className="text-sm mt-1">{selectedDocument.area.toLocaleString('ar-SA')} م²</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">المدينة</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.city}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">الحي</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedDocument.district}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">تاريخ الإصدار</Label>
                  <p className="text-sm mt-1">{selectedDocument.issueDate}</p>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">رقم المخطط</Label>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">{selectedDocument.planNumber}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">رقم القطعة</Label>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">{selectedDocument.plotNumber}</code>
                </div>
                <div className="form-rtl">
                  <Label className="text-xs">توثيق REGA</Label>
                  <div className="mt-1">
                    {selectedDocument.regaVerified ? (
                      <Badge className="bg-green-500 text-white text-xs px-2 py-0">موثقة</Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white text-xs px-2 py-0">غير موثقة</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnershipDocuments_Complete_800;
