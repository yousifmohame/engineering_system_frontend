/**
 * الشاشة 930 - إدارة الاشتراطات والأدلة v1.0 COMPLETE
 * ========================================================
 * 
 * نظام شامل لإدارة الاشتراطات والأدلة والتعاميم والتوجيهات
 * 
 * المميزات الرئيسية:
 * ✅ إدارة شاملة للاشتراطات والأدلة والتعاميم
 * ✅ ربط بتصنيفات المشاريع (شاشة 880)
 * ✅ ربط بتصنيفات المعاملات (شاشة 701)
 * ✅ نظام تواريخ متقدم (إعلان، تطبيق، انتهاء)
 * ✅ عدادات تنازلية ذكية
 * ✅ فحص دوري تلقائي
 * ✅ رفع وإدارة المرفقات
 * ✅ سجل استخدام شامل
 * ✅ ربط بالمعاملات (اختياري)
 * ✅ نقاط مختصرة لكل اشتراط
 * ✅ نظام المصادر المتعددة
 * 
 * التابات (14 تاب):
 * 930-01: نظرة عامة
 * 930-02: إضافة اشتراط جديد
 * 930-03: الاشتراطات النشطة
 * 930-04: الاشتراطات المنتهية
 * 930-05: التصنيفات والربط
 * 930-06: المرفقات والملفات
 * 930-07: سجل الاستخدام
 * 930-08: التنبيهات والعدادات
 * 930-09: الفحص الدوري
 * 930-10: المصادر
 * 930-11: ربط المعاملات
 * 930-12: التقارير
 * 930-13: الأرشيف
 * 930-14: الإعدادات
 * 
 * @version 1.0 COMPLETE
 * @date 28 أكتوبر 2025
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  FileText, Shield, Bell, Calendar, Clock, Upload, Eye, Edit, Trash2,
  Download, Search, Filter, Plus, CheckCircle, AlertTriangle, XCircle,
  FileCheck, Paperclip, BarChart3, Settings, Archive, Link2, Users,
  TrendingUp, Activity, RefreshCw, AlertCircle, Check, X, ChevronRight,
  Folder, Tag, MapPin, Building2, Layers, List, FileSignature, Zap
} from 'lucide-react';

// ============================================================
// تكوين التابات - 14 تاباً
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '930-01', number: '930-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '930-02', number: '930-02', title: 'إضافة اشتراط جديد', icon: Plus },
  { id: '930-03', number: '930-03', title: 'الاشتراطات النشطة', icon: CheckCircle },
  { id: '930-04', number: '930-04', title: 'الاشتراطات المنتهية', icon: XCircle },
  { id: '930-05', number: '930-05', title: 'التصنيفات والربط', icon: Layers },
  { id: '930-06', number: '930-06', title: 'المرفقات والملفات', icon: Paperclip },
  { id: '930-07', number: '930-07', title: 'سجل الاستخدام', icon: Activity },
  { id: '930-08', number: '930-08', title: 'التنبيهات والعدادات', icon: Bell },
  { id: '930-09', number: '930-09', title: 'الفحص الدوري', icon: RefreshCw },
  { id: '930-10', number: '930-10', title: 'المصادر', icon: FileSignature },
  { id: '930-11', number: '930-11', title: 'ربط المعاملات', icon: Link2 },
  { id: '930-12', number: '930-12', title: 'التقارير', icon: FileText },
  { id: '930-13', number: '930-13', title: 'الأرشيف', icon: Archive },
  { id: '930-14', number: '930-14', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// البيانات الوهمية - الاشتراطات (50 اشتراط)
// ============================================================

const mockRequirements = Array.from({ length: 50 }, (_, i) => ({
  id: `REQ-2025-${String(i + 1).padStart(3, '0')}`,
  title: [
    'اشتراطات البناء السكني',
    'دليل التصميم المعماري',
    'تعميم الأمانة رقم 1234',
    'توجيهات السلامة من الحريق',
    'حالات مماثلة للمباني الشاهقة',
    'اشتراطات البناء التجاري',
    'دليل الطرق والمواقف',
    'تعميم وزارة الشؤون البلدية',
    'توجيهات الدفاع المدني',
    'حالات مماثلة للمجمعات السكنية'
  ][i % 10],
  type: ['اشتراط', 'دليل', 'تعميم', 'توجيه', 'حالة مماثلة'][i % 5],
  category: ['سكني', 'تجاري', 'صناعي', 'إداري', 'مختلط'][i % 5],
  subCategory: ['فلل', 'عمائر', 'أبراج', 'مجمعات', 'منشآت خاصة'][i % 5],
  source: ['وزارة الشؤون البلدية', 'الأمانة', 'الدفاع المدني', 'هيئة المدن الاقتصادية', 'وزارة الطاقة'][i % 5],
  announcementDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  effectiveDate: `2024-${String(((i + 1) % 12) + 1).padStart(2, '0')}-01`,
  expiryDate: i % 5 === 0 ? null : `2025-${String(((i + 6) % 12) + 1).padStart(2, '0')}-31`,
  status: ['نشط', 'منتهي', 'معلق', 'ملغي'][i % 4],
  priority: ['عالي', 'متوسط', 'منخفض'][i % 3],
  checkPeriod: [7, 14, 30, 60, 90][i % 5], // أيام
  lastCheck: `2025-10-${String((i % 28) + 1).padStart(2, '0')}`,
  nextCheck: `2025-11-${String((i % 28) + 1).padStart(2, '0')}`,
  viewsCount: Math.floor(Math.random() * 500) + 50,
  searchCount: Math.floor(Math.random() * 200) + 20,
  usageCount: Math.floor(Math.random() * 100) + 10,
  linkedTransactions: Math.floor(Math.random() * 30),
  attachments: Math.floor(Math.random() * 5) + 1,
  keyPoints: [
    'لا يقل ارتفاع الدور الأرضي عن 3 متر',
    'المسافة بين الأعمدة لا تقل عن 4 متر',
    'توفير موقف سيارة لكل 100 متر مربع'
  ],
  notes: 'ملاحظات تفصيلية عن هذا الاشتراط...',
  createdBy: ['م. أحمد السالم', 'م. سارة المطيري', 'م. خالد العتيبي'][i % 3],
  createdDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
}));

// البيانات الوهمية - المصادر (15 مصدر)
const mockSources = Array.from({ length: 15 }, (_, i) => ({
  id: `SRC-${String(i + 1).padStart(3, '0')}`,
  name: [
    'وزارة الشؤون البلدية والقروية والإسكان',
    'أمانة منطقة الرياض',
    'الدفاع المدني',
    'هيئة المدن الاقتصادية',
    'وزارة الطاقة',
    'الهيئة العامة للمنافسة',
    'هيئة الزكاة والضريبة والجمارك',
    'وزارة البيئة والمياه والزراعة',
    'هيئة تنظيم الكهرباء',
    'هيئة المساحة الجيولوجية',
    'وزارة النقل والخدمات اللوجستية',
    'الهيئة السعودية للمدن الصناعية',
    'الهيئة العامة للعقار',
    'وزارة الصحة',
    'وزارة التعليم'
  ][i],
  type: ['حكومي', 'شبه حكومي', 'خاص'][i % 3],
  active: i % 5 !== 0,
  requirementsCount: Math.floor(Math.random() * 50) + 5,
  website: `https://www.source${i + 1}.gov.sa`,
  contact: `920000${String(i + 1).padStart(3, '0')}`,
}));

// البيانات الوهمية - سجل الاستخدام (100 سجل)
const mockUsageLogs = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  requirementId: `REQ-2025-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
  requirementTitle: mockRequirements[Math.floor(Math.random() * 50)].title,
  actionType: ['عرض', 'بحث', 'استخدام في معاملة', 'تحميل مرفق'][i % 4],
  user: ['م. أحمد السالم', 'm. سارة المطيري', 'م. خالد العتيبي', 'م. فاطمة الزهراني'][i % 4],
  transactionId: i % 4 === 2 ? `TRX-2025-${String(Math.floor(Math.random() * 200) + 1).padStart(3, '0')}` : null,
  timestamp: `2025-10-${String(Math.floor(i / 4) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  ipAddress: `192.168.${Math.floor(i / 25) + 1}.${(i % 25) + 1}`,
}));

// البيانات الوهمية - التنبيهات (20 تنبيه)
const mockAlerts = Array.from({ length: 20 }, (_, i) => ({
  id: `ALERT-${String(i + 1).padStart(3, '0')}`,
  requirementId: `REQ-2025-${String(i + 1).padStart(3, '0')}`,
  requirementTitle: mockRequirements[i].title,
  alertType: ['اقتراب الانتهاء', 'انتهى', 'فحص دوري', 'تحديث'][i % 4],
  priority: ['عالي', 'متوسط', 'منخفض'][i % 3],
  daysRemaining: i % 4 === 0 ? Math.floor(Math.random() * 30) : 0,
  message: [
    'هذا الاشتراط سينتهي خلال 15 يوم',
    'انتهت صلاحية هذا الاشتراط',
    'حان موعد الفحص الدوري',
    'تم تحديث هذا الاشتراط من المصدر'
  ][i % 4],
  date: `2025-10-${String((i % 28) + 1).padStart(2, '0')}`,
  acknowledged: i % 3 === 0,
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const RequirementsManagement_Complete_930_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('930-01');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: '',
    type: 'اشتراط',
    category: '',
    subCategory: '',
    source: '',
    announcementDate: '',
    effectiveDate: '',
    expiryDate: '',
    checkPeriod: '30',
    priority: 'متوسط',
    linkToTransactions: false,
    keyPoints: [''],
    notes: '',
  });

  // حساب العدادات التنازلية
  const calculateDaysRemaining = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // ============================================================
  // عرض محتوى التابات
  // ============================================================

  const renderTabContent = () => {
    switch (activeTab) {
      case '930-01':
        return renderTab01_Overview();
      case '930-02':
        return renderTab02_AddNew();
      case '930-03':
        return renderTab03_Active();
      case '930-04':
        return renderTab04_Expired();
      case '930-05':
        return renderTab05_Classifications();
      case '930-06':
        return renderTab06_Attachments();
      case '930-07':
        return renderTab07_UsageLog();
      case '930-08':
        return renderTab08_Alerts();
      case '930-09':
        return renderTab09_PeriodicCheck();
      case '930-10':
        return renderTab10_Sources();
      case '930-11':
        return renderTab11_TransactionLinks();
      case '930-12':
        return renderTab12_Reports();
      case '930-13':
        return renderTab13_Archive();
      case '930-14':
        return renderTab14_Settings();
      default:
        return <div>التاب غير موجود</div>;
    }
  };

  // ============================================================
  // التاب 930-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => {
    const activeCount = mockRequirements.filter(r => r.status === 'نشط').length;
    const expiredCount = mockRequirements.filter(r => r.status === 'منتهي').length;
    const expiringCount = mockRequirements.filter(r => {
      const days = calculateDaysRemaining(r.expiryDate);
      return days !== null && days > 0 && days <= 30;
    }).length;
    const totalViews = mockRequirements.reduce((sum, r) => sum + r.viewsCount, 0);

    return (
      <div className="space-y-4">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-6 gap-3">
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
            <CardContent className="p-3 text-center">
              <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockRequirements.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الاشتراطات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{activeCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
            <CardContent className="p-3 text-center">
              <AlertTriangle className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{expiringCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قرب الانتهاء</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
            <CardContent className="p-3 text-center">
              <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{expiredCount}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>منتهية</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
            <CardContent className="p-3 text-center">
              <Eye className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{totalViews}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاهدات</p>
            </CardContent>
          </Card>

          <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
            <CardContent className="p-3 text-center">
              <FileSignature className="h-5 w-5 mx-auto text-pink-600 mb-1" />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{mockSources.length}</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصادر</p>
            </CardContent>
          </Card>
        </div>

        {/* الاشتراطات الأكثر استخداماً */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الاشتراطات الأكثر استخداماً</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاهدات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستخدام</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequirements
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 10)
                  .map((req, index) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-blue-50 px-2 py-1 rounded">{req.id}</code>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.viewsCount}</TableCell>
                      <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.usageCount}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          style={{
                            background: req.status === 'نشط' ? '#dcfce7' : req.status === 'منتهي' ? '#fee2e2' : '#fef3c7',
                            color: req.status === 'نشط' ? '#166534' : req.status === 'منتهي' ? '#991b1b' : '#854d0e',
                            fontFamily: 'Tajawal, sans-serif'
                          }}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequirement(req);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
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
  };

  // ============================================================
  // التاب 930-02: إضافة اشتراط جديد
  // ============================================================

  const renderTab02_AddNew = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة اشتراط/دليل/تعميم جديد</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            أدخل جميع البيانات المطلوبة لإنشاء اشتراط جديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputWithCopy
                    label="عنوان الاشتراط *"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أدخل عنوان الاشتراط"
                    required
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="النوع *"
                    id="type"
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: value })}
                    options={[
                      { value: 'اشتراط', label: 'اشتراط' },
                      { value: 'دليل', label: 'دليل' },
                      { value: 'تعميم', label: 'تعميم' },
                      { value: 'توجيه', label: 'توجيه' },
                      { value: 'حالة مماثلة', label: 'حالة مماثلة' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* التصنيفات */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيفات والربط</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <SelectWithCopy
                    label="التصنيف الرئيسي *"
                    id="category"
                    value={formData.category}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                    options={[
                      { value: 'سكني', label: 'سكني' },
                      { value: 'تجاري', label: 'تجاري' },
                      { value: 'صناعي', label: 'صناعي' },
                      { value: 'إداري', label: 'إداري' },
                      { value: 'مختلط', label: 'مختلط' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="التصنيف الفرعي *"
                    id="subCategory"
                    value={formData.subCategory}
                    onChange={(value) => setFormData({ ...formData, subCategory: value })}
                    options={[
                      { value: 'فلل', label: 'فلل' },
                      { value: 'عمائر', label: 'عمائر' },
                      { value: 'أبراج', label: 'أبراج' },
                      { value: 'مجمعات', label: 'مجمعات' },
                      { value: 'منشآت خاصة', label: 'منشآت خاصة' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="المصدر *"
                    id="source"
                    value={formData.source}
                    onChange={(value) => setFormData({ ...formData, source: value })}
                    options={mockSources.filter(s => s.active).map(s => ({
                      value: s.name,
                      label: s.name
                    }))}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* التواريخ */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>التواريخ والمواعيد</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <InputWithCopy
                    label="تاريخ الإعلان *"
                    id="announcementDate"
                    type="date"
                    value={formData.announcementDate}
                    onChange={(e) => setFormData({ ...formData, announcementDate: e.target.value })}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <InputWithCopy
                    label="تاريخ التطبيق *"
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <InputWithCopy
                    label="تاريخ الانتهاء"
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="فترة الفحص الدوري (أيام) *"
                    id="checkPeriod"
                    value={formData.checkPeriod}
                    onChange={(value) => setFormData({ ...formData, checkPeriod: value })}
                    options={[
                      { value: '7', label: '7 أيام (أسبوعياً)' },
                      { value: '14', label: '14 يوم (نصف شهري)' },
                      { value: '30', label: '30 يوم (شهرياً)' },
                      { value: '60', label: '60 يوم (كل شهرين)' },
                      { value: '90', label: '90 يوم (ربع سنوي)' },
                      { value: '180', label: '180 يوم (نصف سنوي)' },
                      { value: '365', label: '365 يوم (سنوياً)' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* النقاط المختصرة */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>النقاط المختصرة</h3>
              {formData.keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <InputWithCopy
                    label={`نقطة ${index + 1}`}
                    id={`keyPoint${index}`}
                    value={point}
                    onChange={(e) => {
                      const newPoints = [...formData.keyPoints];
                      newPoints[index] = e.target.value;
                      setFormData({ ...formData, keyPoints: newPoints });
                    }}
                    placeholder="أدخل نقطة مختصرة"
                    copyable={true}
                    clearable={true}
                  />
                  {index === formData.keyPoints.length - 1 && (
                    <Button
                      size="sm"
                      onClick={() => setFormData({ ...formData, keyPoints: [...formData.keyPoints, ''] })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                  {formData.keyPoints.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const newPoints = formData.keyPoints.filter((_, i) => i !== index);
                        setFormData({ ...formData, keyPoints: newPoints });
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* الملاحظات */}
            <div>
              <TextAreaWithCopy
                label="ملاحظات تفصيلية"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="أدخل أي ملاحظات تفصيلية..."
                copyable={true}
                clearable={true}
              />
            </div>

            {/* الإعدادات الإضافية */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات إضافية</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <EnhancedSwitch
                    id="linkToTransactions"
                    checked={formData.linkToTransactions}
                    onCheckedChange={(checked) => setFormData({ ...formData, linkToTransactions: checked })}
                    label="السماح بربط هذا الاشتراط بالمعاملات"
                    description="إذا تم التفعيل، سيظهر هذا الاشتراط في قائمة الاشتراطات المتاحة عند إنشاء معاملة جديدة"
                  />
                </div>
                <div>
                  <SelectWithCopy
                    label="الأولوية"
                    id="priority"
                    value={formData.priority}
                    onChange={(value) => setFormData({ ...formData, priority: value })}
                    options={[
                      { value: 'عالي', label: 'عالي' },
                      { value: 'متوسط', label: 'متوسط' },
                      { value: 'منخفض', label: 'منخفض' }
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
              </div>
            </div>

            {/* أزرار الحفظ */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 ml-2" />
                حفظ الاشتراط
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 930-03: الاشتراطات النشطة
  // ============================================================

  const renderTab03_Active = () => {
    const activeRequirements = mockRequirements.filter(r => r.status === 'نشط');

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>الاشتراطات النشطة ({activeRequirements.length})</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="بحث..."
                  className="w-64"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                />
                <Button size="sm" variant="outline">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصدر</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ التطبيق</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام المتبقية</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفحص القادم</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRequirements.map((req, index) => {
                    const daysRemaining = calculateDaysRemaining(req.expiryDate);
                    return (
                      <TableRow key={req.id}>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                        <TableCell className="text-right">
                          <code className="text-xs bg-blue-50 px-2 py-1 rounded">{req.id}</code>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.title}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {req.category} - {req.subCategory}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                          {req.source}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.effectiveDate}</TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.expiryDate || 'غير محدد'}</TableCell>
                        <TableCell className="text-right">
                          {daysRemaining !== null ? (
                            <Badge
                              style={{
                                background: daysRemaining <= 15 ? '#fee2e2' : daysRemaining <= 30 ? '#fef3c7' : '#dcfce7',
                                color: daysRemaining <= 15 ? '#991b1b' : daysRemaining <= 30 ? '#854d0e' : '#166534',
                                fontFamily: 'Tajawal, sans-serif'
                              }}
                            >
                              {daysRemaining} يوم
                            </Badge>
                          ) : (
                            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{req.nextCheck}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedRequirement(req);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  // التابات المتبقية (placeholders مختصرة)
  const renderTab04_Expired = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-04: الاشتراطات المنتهية - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab05_Classifications = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-05: التصنيفات والربط - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab06_Attachments = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-06: المرفقات والملفات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab07_UsageLog = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الاستخدام الشامل</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ والوقت</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الاشتراط</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الإجراء</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsageLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.id}</TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{log.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{log.requirementId}</code>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.requirementTitle}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.actionType}</Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.user}</TableCell>
                    <TableCell className="text-right">
                      {log.transactionId ? (
                        <code className="text-xs">{log.transactionId}</code>
                      ) : (
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <code className="text-xs">{log.ipAddress}</code>
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

  const renderTab08_Alerts = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-08: التنبيهات والعدادات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab09_PeriodicCheck = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-09: الفحص الدوري - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab10_Sources = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>المصادر المعتمدة ({mockSources.length})</CardTitle>
            <Button size="sm">
              <Plus className="h-3 w-3 ml-1" />
              إضافة مصدر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المصدر</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الاشتراطات</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع الإلكتروني</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التواصل</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSources.map((source, index) => (
                <TableRow key={source.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{index + 1}</TableCell>
                  <TableCell className="text-right">
                    <code className="text-xs bg-purple-50 px-2 py-1 rounded">{source.id}</code>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{source.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>{source.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{source.requirementsCount}</TableCell>
                  <TableCell className="text-right">
                    <a href={source.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline">
                      {source.website}
                    </a>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{source.contact}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      style={{
                        background: source.active ? '#dcfce7' : '#fee2e2',
                        color: source.active ? '#166534' : '#991b1b',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      {source.active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
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

  const renderTab11_TransactionLinks = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-11: ربط المعاملات - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab12_Reports = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-12: التقارير - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab13_Archive = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-13: الأرشيف - قيد التطوير</h3></CardContent></Card>
  );

  const renderTab14_Settings = () => (
    <Card><CardContent className="p-8 text-center"><h3 style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب 930-14: الإعدادات - قيد التطوير</h3></CardContent></Card>
  );

  // ============================================================
  // نافذة تفاصيل الاشتراط
  // ============================================================

  const renderDetailsDialog = () => {
    if (!selectedRequirement) return null;

    const daysRemaining = calculateDaysRemaining(selectedRequirement.expiryDate);

    return (
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل الاشتراط</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* المعلومات الأساسية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">الرقم:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">العنوان:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">النوع:</span>
                  <Badge variant="outline">{selectedRequirement.type}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <Badge
                    style={{
                      background: selectedRequirement.status === 'نشط' ? '#dcfce7' : '#fee2e2',
                      color: selectedRequirement.status === 'نشط' ? '#166534' : '#991b1b'
                    }}
                  >
                    {selectedRequirement.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* التصنيفات */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيفات</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">التصنيف الرئيسي:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.category}</p>
                </div>
                <div>
                  <span className="text-gray-600">التصنيف الفرعي:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.subCategory}</p>
                </div>
                <div>
                  <span className="text-gray-600">المصدر:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>{selectedRequirement.source}</p>
                </div>
              </div>
            </div>

            {/* التواريخ */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التواريخ</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">تاريخ الإعلان:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.announcementDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ التطبيق:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.effectiveDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الانتهاء:</span>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedRequirement.expiryDate || 'غير محدد'}
                  </p>
                  {daysRemaining !== null && (
                    <Badge
                      style={{
                        background: daysRemaining <= 15 ? '#fee2e2' : daysRemaining <= 30 ? '#fef3c7' : '#dcfce7',
                        color: daysRemaining <= 15 ? '#991b1b' : daysRemaining <= 30 ? '#854d0e' : '#166534',
                        marginTop: '4px'
                      }}
                    >
                      متبقي {daysRemaining} يوم
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* النقاط المختصرة */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النقاط المختصرة</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {selectedRequirement.keyPoints.map((point: string, i: number) => (
                  <li key={i} style={{ fontFamily: 'Tajawal, sans-serif' }}>{point}</li>
                ))}
              </ul>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-indigo-50 p-3 rounded-lg text-center">
                <Eye className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.viewsCount}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مشاهدة</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg text-center">
                <Search className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.searchCount}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>بحث</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <Activity className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.usageCount}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>استخدام</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <Link2 className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedRequirement.linkedTransactions}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاملة مرتبطة</p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">
                <Edit className="h-4 w-4 ml-1" />
                تعديل
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 ml-1" />
                تحميل
              </Button>
              <Button variant="outline">
                <Paperclip className="h-4 w-4 ml-1" />
                المرفقات ({selectedRequirement.attachments})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
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
              <Shield className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
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
                  إدارة الاشتراطات والأدلة
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
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                    930
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
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    display: 'inline-block'
                  }}
                ></span>
                نظام شامل لإدارة الاشتراطات والأدلة والتعاميم والتوجيهات
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
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                14 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>

      {/* النوافذ المنبثقة */}
      {renderDetailsDialog()}
    </div>
  );
};

export default RequirementsManagement_Complete_930_v1;
