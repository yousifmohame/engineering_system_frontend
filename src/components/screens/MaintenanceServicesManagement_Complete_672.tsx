import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Wrench,
  Settings,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  RefreshCw,
  HelpCircle,
  X,
  MoreHorizontal,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  User,
  Calendar,
  Activity,
  TrendingUp,
  Package,
  Zap,
  Plus,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  HardDrive,
  Router,
  Server,
  Camera,
  Mic,
  Speaker,
  Headphones,
  MousePointer,
  Keyboard,
  Hash,
  MapPin,
  Ruler,
  Compass,
  Target,
  Box,
  Boxes,
  ClipboardList,
  BarChart3,
  History,
  Tool,
  Hammer,
  Drill,
  Paintbrush
} from 'lucide-react';

// Types and Interfaces
interface Equipment {
  id: string;
  name: string;
  category: 'office' | 'survey' | 'printing' | 'network' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: 'active' | 'maintenance' | 'broken' | 'retired';
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
  assignedTo?: string;
  notes?: string;
}

interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  requestDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  assignedTechnician?: string;
  estimatedCost?: number;
  actualCost?: number;
}

// Mock Data - معدات المكتب الهندسي
const mockOfficeEquipment: Equipment[] = [
  {
    id: 'OFC-001',
    name: 'حاسوب مكتبي - محطة عمل CAD',
    category: 'office',
    brand: 'Dell',
    model: 'Precision 5820',
    serialNumber: 'SN-DELL-2024-001',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    status: 'active',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-03-01',
    location: 'قسم التصميم - الدور الثاني',
    assignedTo: 'م. أحمد محمد'
  },
  {
    id: 'OFC-002',
    name: 'طابعة ليزر A3 ملونة',
    category: 'printing',
    brand: 'HP',
    model: 'LaserJet Pro M454dn',
    serialNumber: 'SN-HP-2024-002',
    purchaseDate: '2024-02-10',
    warrantyExpiry: '2026-02-10',
    status: 'active',
    lastMaintenance: '2025-01-05',
    nextMaintenance: '2025-04-05',
    location: 'غرفة الطباعة المركزية',
    notes: 'تحتاج استبدال تونر أسود قريباً'
  },
  {
    id: 'OFC-003',
    name: 'ماسح ضوئي A0 احترافي',
    category: 'printing',
    brand: 'Canon',
    model: 'imagePROGRAF iPF850',
    serialNumber: 'SN-CAN-2024-003',
    purchaseDate: '2024-03-20',
    warrantyExpiry: '2027-03-20',
    status: 'maintenance',
    lastMaintenance: '2025-01-20',
    nextMaintenance: '2025-02-20',
    location: 'غرفة الطباعة المركزية'
  },
  {
    id: 'OFC-004',
    name: 'موزع شبكة - Switch Gigabit',
    category: 'network',
    brand: 'Cisco',
    model: 'Catalyst 2960-X',
    serialNumber: 'SN-CIS-2024-004',
    purchaseDate: '2024-01-05',
    warrantyExpiry: '2029-01-05',
    status: 'active',
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-05-15',
    location: 'غرفة الخوادم'
  }
];

// Mock Data - معدات المسح والقياس الميدانية
const mockSurveyEquipment: Equipment[] = [
  {
    id: 'SUR-001',
    name: 'جهاز التوتال ستيشن',
    category: 'survey',
    brand: 'Leica',
    model: 'TS16',
    serialNumber: 'SN-LEI-2024-001',
    purchaseDate: '2024-01-10',
    warrantyExpiry: '2026-01-10',
    status: 'active',
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2025-06-15',
    location: 'مخزن المعدات الميدانية',
    assignedTo: 'فريق المساحة'
  },
  {
    id: 'SUR-002',
    name: 'جهاز ليزر قياس المسافات',
    category: 'survey',
    brand: 'Leica',
    model: 'DISTO D810',
    serialNumber: 'SN-LEI-2024-002',
    purchaseDate: '2024-02-15',
    warrantyExpiry: '2027-02-15',
    status: 'active',
    lastMaintenance: '2025-01-10',
    nextMaintenance: '2025-07-10',
    location: 'مخزن المعدات الميدانية'
  },
  {
    id: 'SUR-003',
    name: 'GPS جيوديسي',
    category: 'survey',
    brand: 'Trimble',
    model: 'R10 GNSS',
    serialNumber: 'SN-TRM-2024-003',
    purchaseDate: '2024-03-01',
    warrantyExpiry: '2027-03-01',
    status: 'active',
    lastMaintenance: '2024-12-20',
    nextMaintenance: '2025-06-20',
    location: 'مخزن المعدات الميدانية',
    assignedTo: 'فريق المساحة'
  },
  {
    id: 'SUR-004',
    name: 'شريط قياس ليزري 50 متر',
    category: 'survey',
    brand: 'Stanley',
    model: 'TLM330',
    serialNumber: 'SN-STA-2024-004',
    purchaseDate: '2024-01-20',
    warrantyExpiry: '2026-01-20',
    status: 'active',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-05-01',
    location: 'مخزن المعدات الميدانية'
  },
  {
    id: 'SUR-005',
    name: 'ميزان نيفو إلكتروني',
    category: 'survey',
    brand: 'Topcon',
    model: 'DL-503',
    serialNumber: 'SN-TOP-2024-005',
    purchaseDate: '2024-02-01',
    warrantyExpiry: '2027-02-01',
    status: 'active',
    lastMaintenance: '2024-12-10',
    nextMaintenance: '2025-06-10',
    location: 'مخزن المعدات الميدانية'
  }
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    equipmentId: 'OFC-003',
    equipmentName: 'ماسح ضوئي A0 احترافي',
    requestDate: '2025-01-20',
    priority: 'high',
    status: 'in-progress',
    description: 'خطأ في نظام التغذية الورقية - تحتاج استبدال قطع غيار',
    assignedTechnician: 'فني الصيانة - محمد علي',
    estimatedCost: 1500,
    actualCost: 1200
  },
  {
    id: 'REQ-002',
    equipmentId: 'SUR-001',
    equipmentName: 'جهاز التوتال ستيشن',
    requestDate: '2024-12-15',
    priority: 'medium',
    status: 'completed',
    description: 'معايرة دورية وفحص دقة القياسات',
    assignedTechnician: 'فني المساحة - خالد أحمد',
    estimatedCost: 2000,
    actualCost: 1800
  }
];

export default function MaintenanceServicesManagement_Complete_672() {
  const [activeTab, setActiveTab] = useState('677-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  // Statistics
  const totalEquipment = mockOfficeEquipment.length + mockSurveyEquipment.length;
  const activeEquipment = [...mockOfficeEquipment, ...mockSurveyEquipment].filter(e => e.status === 'active').length;
  const maintenanceNeeded = [...mockOfficeEquipment, ...mockSurveyEquipment].filter(e => e.status === 'maintenance').length;
  const brokenEquipment = [...mockOfficeEquipment, ...mockSurveyEquipment].filter(e => e.status === 'broken').length;

  // قائمة التابات
  const tabs = [
    { id: '677-01', name: 'نظرة عامة', icon: BarChart3 },
    { id: '677-02', name: 'أجهزة الحاسوب', icon: Monitor },
    { id: '677-03', name: 'أجهزة الطباعة', icon: Printer },
    { id: '677-04', name: 'الشبكات والخوادم', icon: Server },
    { id: '677-05', name: 'معدات المسح الميدانية', icon: Compass },
    { id: '677-06', name: 'طلبات الصيانة', icon: ClipboardList },
    { id: '677-07', name: 'جدولة الصيانة', icon: Calendar },
    { id: '677-08', name: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '677-09', name: 'الفنيون والموردون', icon: Users },
    { id: '677-10', name: 'الإعدادات', icon: Settings }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      broken: 'bg-red-100 text-red-800 border-red-200',
      retired: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const labels = {
      active: 'نشط',
      maintenance: 'تحت الصيانة',
      broken: 'معطل',
      retired: 'متقاعد'
    };
    return (
      <Badge className={`${variants[status]} border text-xs`}>
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة'
    };
    return (
      <Badge className={`${variants[priority]} text-xs`}>
        {labels[priority]}
      </Badge>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '677-01':
        return (
          <div className="universal-dense-tab-content">
            {/* Header */}
            <div className="bg-blue-50 border-b border-blue-200 p-4 rounded-t-lg mb-4">
              <h1 className="typography-h1">إدارة الصيانة والخدمات - المكتب الهندسي</h1>
              <p className="text-xs text-gray-600 mt-1">نظام شامل لإدارة صيانة معدات المكتب والمعدات الميدانية</p>
            </div>

            {/* Stats */}
            <div className="dense-stats-grid mb-4">
              <div className="dense-stat-card">
                <div className="dense-stat-icon">
                  <Package className="h-3 w-3" />
                </div>
                <div className="dense-stat-number">{totalEquipment}</div>
                <div className="dense-stat-label">إجمالي المعدات</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#10b981' }}>{activeEquipment}</div>
                <div className="dense-stat-label">نشطة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Wrench className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#f59e0b' }}>{maintenanceNeeded}</div>
                <div className="dense-stat-label">تحت الصيانة</div>
              </div>
              <div className="dense-stat-card">
                <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="dense-stat-number" style={{ color: '#ef4444' }}>{brokenEquipment}</div>
                <div className="dense-stat-label">معطلة</div>
              </div>
            </div>

            {/* Categories Overview */}
            <div className="dense-grid dense-grid-2 gap-4">
              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Monitor className="h-4 w-4" />
                    معدات المكتب
                  </div>
                </div>
                <div className="space-y-2 p-2">
                  {[
                    { name: 'أجهزة الحاسوب', count: mockOfficeEquipment.filter(e => e.category === 'office').length, icon: Laptop },
                    { name: 'أجهزة الطباعة', count: mockOfficeEquipment.filter(e => e.category === 'printing').length, icon: Printer },
                    { name: 'معدات الشبكات', count: mockOfficeEquipment.filter(e => e.category === 'network').length, icon: Router }
                  ].map((cat, idx) => (
                    <div key={idx} className="dense-content-card p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4 text-blue-600" />
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{cat.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dense-section">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Compass className="h-4 w-4" />
                    معدات المسح الميدانية
                  </div>
                </div>
                <div className="space-y-2 p-2">
                  {[
                    { name: 'أجهزة المسح', count: 3, icon: Target },
                    { name: 'أجهزة القياس', count: 2, icon: Ruler },
                    { name: 'ملحقات', count: mockSurveyEquipment.length - 5, icon: Box }
                  ].map((cat, idx) => (
                    <div key={idx} className="dense-content-card p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4 text-green-600" />
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{cat.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Maintenance */}
            <div className="dense-section mt-4">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <History className="h-4 w-4" />
                  طلبات الصيانة الأخيرة
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="dense-table w-full">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>المعدة</th>
                      <th>الأولوية</th>
                      <th>الحالة</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMaintenanceRequests.map((req) => (
                      <tr key={req.id}>
                        <td><code className="text-xs">{req.id}</code></td>
                        <td>{req.equipmentName}</td>
                        <td>{getPriorityBadge(req.priority)}</td>
                        <td>
                          <Badge className={req.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {req.status === 'completed' ? 'مكتمل' : 'جاري'}
                          </Badge>
                        </td>
                        <td>{req.requestDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case '677-02':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Laptop className="h-4 w-4" />
                  أجهزة الحاسوب ومحطات العمل
                </div>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-primary" size="sm">
                    <Plus className="h-3 w-3" />
                    إضافة جهاز
                  </Button>
                </div>
              </div>

              <div className="dense-grid dense-grid-2 gap-3 mt-3">
                {mockOfficeEquipment.filter(e => e.category === 'office').map((equipment) => (
                  <div key={equipment.id} className="dense-content-card p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-xs font-medium">{equipment.name}</div>
                          <div className="text-xs text-gray-600">{equipment.brand} {equipment.model}</div>
                        </div>
                      </div>
                      {getStatusBadge(equipment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-gray-600">الرقم التسلسلي:</span>
                        <div className="font-mono text-xs">{equipment.serialNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">الموقع:</span>
                        <div>{equipment.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">آخر صيانة:</span>
                        <div>{equipment.lastMaintenance}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">الصيانة القادمة:</span>
                        <div className="text-orange-600">{equipment.nextMaintenance}</div>
                      </div>
                    </div>

                    {equipment.assignedTo && (
                      <div className="mt-2 text-xs text-gray-600">
                        <User className="h-3 w-3 inline ml-1" />
                        مسند إلى: {equipment.assignedTo}
                      </div>
                    )}

                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Wrench className="h-3 w-3" />
                        صيانة
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Eye className="h-3 w-3" />
                        عرض
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '677-03':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Printer className="h-4 w-4" />
                  أجهزة الطباعة والمسح الضوئي
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  إضافة طابعة
                </Button>
              </div>

              <div className="dense-grid dense-grid-2 gap-3 mt-3">
                {mockOfficeEquipment.filter(e => e.category === 'printing').map((equipment) => (
                  <div key={equipment.id} className="dense-content-card p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Printer className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-xs font-medium">{equipment.name}</div>
                          <div className="text-xs text-gray-600">{equipment.brand} {equipment.model}</div>
                        </div>
                      </div>
                      {getStatusBadge(equipment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-gray-600">الموقع:</span>
                        <div>{equipment.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">الضمان ينتهي:</span>
                        <div>{equipment.warrantyExpiry}</div>
                      </div>
                    </div>

                    {equipment.notes && (
                      <Alert className="mt-2">
                        <AlertDescription className="text-xs">
                          {equipment.notes}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Wrench className="h-3 w-3" />
                        صيانة
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '677-04':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Server className="h-4 w-4" />
                  معدات الشبكات والخوادم
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  إضافة معدة شبكة
                </Button>
              </div>

              <div className="dense-grid dense-grid-2 gap-3 mt-3">
                {mockOfficeEquipment.filter(e => e.category === 'network').map((equipment) => (
                  <div key={equipment.id} className="dense-content-card p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Router className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-xs font-medium">{equipment.name}</div>
                          <div className="text-xs text-gray-600">{equipment.brand} {equipment.model}</div>
                        </div>
                      </div>
                      {getStatusBadge(equipment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-gray-600">الموقع:</span>
                        <div>{equipment.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">الصيانة القادمة:</span>
                        <div>{equipment.nextMaintenance}</div>
                      </div>
                    </div>

                    <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span>حالة الاتصال:</span>
                        <Badge className="bg-green-100 text-green-800">متصل</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>وقت التشغيل:</span>
                        <span className="font-mono">99.9%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '677-05':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Compass className="h-4 w-4" />
                  معدات المسح والقياس الميدانية
                </div>
                <div className="flex gap-2">
                  <Button className="dense-btn dense-btn-primary" size="sm">
                    <Plus className="h-3 w-3" />
                    إضافة معدة
                  </Button>
                  <Button className="dense-btn" size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                    تصدير
                  </Button>
                </div>
              </div>

              <Alert className="mt-3 mb-3">
                <AlertDescription className="text-xs">
                  <MapPin className="h-3 w-3 inline ml-1" />
                  جميع معدات المسح الميدانية يتم معايرتها دورياً كل 6 أشهر للحفاظ على دقة القياسات
                </AlertDescription>
              </Alert>

              <div className="dense-grid dense-grid-2 gap-3">
                {mockSurveyEquipment.map((equipment) => (
                  <div key={equipment.id} className="dense-content-card p-3 border-r-4 border-r-green-500">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-xs font-medium">{equipment.name}</div>
                          <div className="text-xs text-gray-600">{equipment.brand} {equipment.model}</div>
                        </div>
                      </div>
                      {getStatusBadge(equipment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-gray-600">الرقم التسلسلي:</span>
                        <div className="font-mono text-xs">{equipment.serialNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">الموقع:</span>
                        <div>{equipment.location}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">آخر معايرة:</span>
                        <div>{equipment.lastMaintenance}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">المعايرة القادمة:</span>
                        <div className="text-orange-600 font-medium">{equipment.nextMaintenance}</div>
                      </div>
                    </div>

                    {equipment.assignedTo && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <Users className="h-3 w-3 inline ml-1" />
                        مسند إلى: <span className="font-medium">{equipment.assignedTo}</span>
                      </div>
                    )}

                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Wrench className="h-3 w-3" />
                        معايرة
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <FileText className="h-3 w-3" />
                        شهادة
                      </Button>
                      <Button size="sm" variant="ghost" className="dense-btn">
                        <Eye className="h-3 w-3" />
                        عرض
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Equipment Categories */}
              <div className="dense-section mt-4">
                <div className="dense-section-header">
                  <div className="dense-section-title">
                    <Boxes className="h-4 w-4" />
                    تصنيفات المعدات الميدانية
                  </div>
                </div>
                <div className="dense-grid dense-grid-4 gap-2 mt-2">
                  {[
                    { name: 'أجهزة المسح', count: 3, icon: Target, color: 'green' },
                    { name: 'أجهزة القياس الليزرية', count: 2, icon: Zap, color: 'blue' },
                    { name: 'أجهزة GPS', count: 1, icon: MapPin, color: 'purple' },
                    { name: 'معدات إضافية', count: 4, icon: Box, color: 'orange' }
                  ].map((cat, idx) => (
                    <div key={idx} className="dense-content-card p-2 text-center">
                      <cat.icon className={`h-6 w-6 mx-auto mb-1 text-${cat.color}-600`} />
                      <div className="text-xs font-medium">{cat.name}</div>
                      <Badge className={`bg-${cat.color}-100 text-${cat.color}-800 mt-1`}>{cat.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case '677-06':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <ClipboardList className="h-4 w-4" />
                  طلبات الصيانة
                </div>
                <Button className="dense-btn dense-btn-primary" size="sm">
                  <Plus className="h-3 w-3" />
                  طلب صيانة جديد
                </Button>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="dense-table w-full">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>المعدة</th>
                      <th>الوصف</th>
                      <th>الأولوية</th>
                      <th>الحالة</th>
                      <th>الفني</th>
                      <th>التكلفة المقدرة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMaintenanceRequests.map((req) => (
                      <tr key={req.id}>
                        <td><code className="text-xs">{req.id}</code></td>
                        <td>{req.equipmentName}</td>
                        <td className="max-w-xs truncate">{req.description}</td>
                        <td>{getPriorityBadge(req.priority)}</td>
                        <td>
                          <Badge className={
                            req.status === 'completed' ? 'bg-green-100 text-green-800' :
                            req.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {req.status === 'completed' ? 'مكتمل' : req.status === 'in-progress' ? 'جاري' : 'معلق'}
                          </Badge>
                        </td>
                        <td>{req.assignedTechnician || '-'}</td>
                        <td>{req.estimatedCost ? `${req.estimatedCost} ريال` : '-'}</td>
                        <td>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="dense-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="dense-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case '677-07':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Calendar className="h-4 w-4" />
                  جدولة الصيانة الدورية
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  محتوى تبويب جدولة الصيانة قيد التطوير
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case '677-08':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <BarChart3 className="h-4 w-4" />
                  التقارير والإحصائيات
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  محتوى تبويب التقارير قيد التطوير
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case '677-09':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Users className="h-4 w-4" />
                  الفنيون والموردون
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  محتوى تبويب الفنيون والموردون قيد التطوير
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      case '677-10':
        return (
          <div className="universal-dense-tab-content">
            <div className="dense-section">
              <div className="dense-section-header">
                <div className="dense-section-title">
                  <Settings className="h-4 w-4" />
                  الإعدادات
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  محتوى تبويب الإعدادات قيد التطوير
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout" dir="rtl">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <h2 className="typography-h2" style={{ color: 'white', marginBottom: '4px' }}>
            الصيانة والخدمات
          </h2>
          <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <code style={{ fontFamily: 'Courier New, monospace', fontSize: '10px' }}>SCR-677</code>
          </div>
        </div>

        <div className="vertical-tabs-sidebar-body">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`vertical-tab-item-condensed ${isActive ? 'active' : ''}`}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0 
                  }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="vertical-tab-title-condensed">
                    {tab.name}
                  </div>
                  
                  <div className="vertical-tab-number-condensed">
                    {tab.id}
                  </div>
                </button>
                
                {index < tabs.length - 1 && (
                  <div className="vertical-tab-separator-condensed" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
            <span>10 تبويبات</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              نشط
            </span>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="typography-h2" style={{ marginBottom: '2px' }}>
                {tabs.find(t => t.id === activeTab)?.name}
              </h3>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <code style={{ fontFamily: 'Courier New, monospace', fontSize: '10px' }}>
                  {activeTab}
                </code>
                <span>•</span>
                <span>آخر تحديث: {new Date().toLocaleString('ar-SA')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-3 w-3" />
                تحديث
              </Button>
              <Button size="sm" variant="outline">
                <HelpCircle className="h-3 w-3" />
                مساعدة
              </Button>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
