import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Key, 
  Search, 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  AlertCircle,
  Lock,
  Unlock,
  Activity,
  Calendar,
  Download,
  Upload
} from 'lucide-react';

interface DetailedPermission {
  code: string;
  nameAr: string;
  nameEn: string;
  description: string;
  category: string;
  screenCode: string;
  level: 'basic' | 'advanced' | 'administrative' | 'critical';
  isActive: boolean;
  dependencies?: string[];
}

interface PermissionGroup {
  id: string;
  nameAr: string;
  nameEn: string;
  screenCode: string;
  permissions: DetailedPermission[];
  color: string;
  icon: React.ReactNode;
}

export default function DetailedPermissionsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // بيانات الصلاحيات التفصيلية المدمجة
  const permissionGroups: PermissionGroup[] = [
    {
      id: 'transactions',
      nameAr: 'صلاحيات المعاملات',
      nameEn: 'Transactions Permissions',
      screenCode: 'SCR-TRANSACTIONS',
      color: 'blue',
      icon: <FileText className="h-4 w-4" />,
      permissions: [
        {
          code: '0101',
          nameAr: 'عرض شاشة المعاملات',
          nameEn: 'View Transactions Screen',
          description: 'السماح بعرض الشاشة الرئيسية للمعاملات',
          category: 'عرض',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'basic',
          isActive: true
        },
        {
          code: '0102',
          nameAr: 'إنشاء معاملة جديدة',
          nameEn: 'Create New Transaction',
          description: 'السماح بإنشاء معاملات جديدة في النظام',
          category: 'إنشاء',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0101']
        },
        {
          code: '0103',
          nameAr: 'تعديل معاملة',
          nameEn: 'Edit Transaction',
          description: 'السماح بتعديل بيانات المعاملات الموجودة',
          category: 'تعديل',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0101', '0102']
        },
        {
          code: '0104',
          nameAr: 'حذف معاملة',
          nameEn: 'Delete Transaction',
          description: 'السماح بحذف المعاملات من النظام',
          category: 'حذف',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'critical',
          isActive: true,
          dependencies: ['0101', '0102', '0103']
        },
        {
          code: '0105',
          nameAr: 'استعراض تفاصيل المعاملة',
          nameEn: 'View Transaction Details',
          description: 'السماح بعرض التفاصيل الكاملة للمعاملة',
          category: 'عرض',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'basic',
          isActive: true,
          dependencies: ['0101']
        },
        {
          code: '0106',
          nameAr: 'طباعة مستند',
          nameEn: 'Print Document',
          description: 'السماح بطباعة مستندات المعاملة',
          category: 'طباعة',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'basic',
          isActive: true
        },
        {
          code: '0107',
          nameAr: 'مسح مستند',
          nameEn: 'Scan Document',
          description: 'السماح بمسح وإضافة مستندات للمعاملة',
          category: 'مسح',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'advanced',
          isActive: true
        },
        {
          code: '0108',
          nameAr: 'طلب صلاحية تبويب',
          nameEn: 'Request Tab Permission',
          description: 'السماح بطلب صلاحيات إضافية للتبويبات',
          category: 'طلب صلاحية',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'basic',
          isActive: true
        },
        {
          code: '0109',
          nameAr: 'أرشفة معاملة',
          nameEn: 'Archive Transaction',
          description: 'السماح بأرشفة المعاملات المكتملة',
          category: 'أرشفة',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'administrative',
          isActive: true,
          dependencies: ['0101', '0105']
        },
        {
          code: '0110',
          nameAr: 'استعادة معاملة',
          nameEn: 'Restore Transaction',
          description: 'السماح باستعادة المعاملات المؤرشفة',
          category: 'استعادة',
          screenCode: 'SCR-TRANSACTIONS',
          level: 'administrative',
          isActive: true,
          dependencies: ['0101', '0109']
        }
      ]
    },
    {
      id: 'clients',
      nameAr: 'صلاحيات العملاء',
      nameEn: 'Clients Permissions',
      screenCode: 'SCR-CLIENTS',
      color: 'green',
      icon: <Users className="h-4 w-4" />,
      permissions: [
        {
          code: '0201',
          nameAr: 'عرض شاشة العملاء',
          nameEn: 'View Clients Screen',
          description: 'السماح بعرض الشاشة الرئيسية للعملاء',
          category: 'عرض',
          screenCode: 'SCR-CLIENTS',
          level: 'basic',
          isActive: true
        },
        {
          code: '0202',
          nameAr: 'إضافة عميل',
          nameEn: 'Add Client',
          description: 'السماح بإضافة عملاء جدد للنظام',
          category: 'إضافة',
          screenCode: 'SCR-CLIENTS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0201']
        },
        {
          code: '0203',
          nameAr: 'تعديل بيانات عميل',
          nameEn: 'Edit Client Data',
          description: 'السماح بتعديل بيانات العملاء الموجودين',
          category: 'تعديل',
          screenCode: 'SCR-CLIENTS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0201', '0202']
        },
        {
          code: '0204',
          nameAr: 'حذف عميل',
          nameEn: 'Delete Client',
          description: 'السماح بحذف العملاء من النظام',
          category: 'حذف',
          screenCode: 'SCR-CLIENTS',
          level: 'critical',
          isActive: true,
          dependencies: ['0201', '0202', '0203']
        },
        {
          code: '0205',
          nameAr: 'رفع مستند عميل',
          nameEn: 'Upload Client Document',
          description: 'السماح برفع مستندات خاصة بالعميل',
          category: 'رفع ملفات',
          screenCode: 'SCR-CLIENTS',
          level: 'basic',
          isActive: true,
          dependencies: ['0201']
        },
        {
          code: '0206',
          nameAr: 'عرض سجل معاملات عميل',
          nameEn: 'View Client Transaction History',
          description: 'السماح بعرض تاريخ معاملات العميل',
          category: 'عرض',
          screenCode: 'SCR-CLIENTS',
          level: 'basic',
          isActive: true,
          dependencies: ['0201']
        },
        {
          code: '0207',
          nameAr: 'طباعة تقرير عميل',
          nameEn: 'Print Client Report',
          description: 'السماح بطباعة تقارير خاصة بالعميل',
          category: 'طباعة',
          screenCode: 'SCR-CLIENTS',
          level: 'basic',
          isActive: true,
          dependencies: ['0201', '0206']
        },
        {
          code: '0208',
          nameAr: 'إخطار عميل',
          nameEn: 'Notify Client',
          description: 'السماح بإرسال إخطارات للعميل',
          category: 'إخطار',
          screenCode: 'SCR-CLIENTS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0201']
        },
        {
          code: '0209',
          nameAr: 'تفعيل/تعطيل عميل',
          nameEn: 'Activate/Deactivate Client',
          description: 'السماح بتفعيل أو تعطيل حساب العميل',
          category: 'تحكم',
          screenCode: 'SCR-CLIENTS',
          level: 'administrative',
          isActive: true,
          dependencies: ['0201', '0202']
        },
        {
          code: '0210',
          nameAr: 'إدارة ولاء عميل',
          nameEn: 'Manage Client Loyalty',
          description: 'السماح بإدارة نقاط وبرامج ولاء العميل',
          category: 'ولاء',
          screenCode: 'SCR-CLIENTS',
          level: 'advanced',
          isActive: true,
          dependencies: ['0201', '0202']
        }
      ]
    },
    {
      id: 'employees',
      nameAr: 'صلاحيات الموظفين',
      nameEn: 'Employees Permissions',
      screenCode: 'SCR-EMPLOYEES',
      color: 'purple',
      icon: <Users className="h-4 w-4" />,
      permissions: [
        {
          code: '0301',
          nameAr: 'عرض شاشة الموظفين',
          nameEn: 'View Employees Screen',
          description: 'السماح بعرض الشاشة الرئيسية للموظفين',
          category: 'عرض',
          screenCode: 'SCR-EMPLOYEES',
          level: 'basic',
          isActive: true
        },
        {
          code: '0302',
          nameAr: 'إضافة موظف',
          nameEn: 'Add Employee',
          description: 'السماح بإضافة موظفين جدد للنظام',
          category: 'إضافة',
          screenCode: 'SCR-EMPLOYEES',
          level: 'administrative',
          isActive: true,
          dependencies: ['0301']
        },
        {
          code: '0303',
          nameAr: 'تعديل موظف',
          nameEn: 'Edit Employee',
          description: 'السماح بتعديل بيانات الموظفين',
          category: 'تعديل',
          screenCode: 'SCR-EMPLOYEES',
          level: 'administrative',
          isActive: true,
          dependencies: ['0301', '0302']
        },
        {
          code: '0304',
          nameAr: 'حذف موظف',
          nameEn: 'Delete Employee',
          description: 'السماح بحذف الموظفين من النظام',
          category: 'حذف',
          screenCode: 'SCR-EMPLOYEES',
          level: 'critical',
          isActive: true,
          dependencies: ['0301', '0302', '0303']
        },
        {
          code: '0305',
          nameAr: 'منح صلاحية موظف',
          nameEn: 'Grant Employee Permission',
          description: 'السماح بمنح صلاحيات للموظفين',
          category: 'صلاحيات',
          screenCode: 'SCR-EMPLOYEES',
          level: 'critical',
          isActive: true,
          dependencies: ['0301', '0302']
        },
        {
          code: '0306',
          nameAr: 'سحب صلاحية موظف',
          nameEn: 'Revoke Employee Permission',
          description: 'السماح بسحب صلاحيات من الموظفين',
          category: 'صلاحيات',
          screenCode: 'SCR-EMPLOYEES',
          level: 'critical',
          isActive: true,
          dependencies: ['0301', '0302', '0305']
        },
        {
          code: '0307',
          nameAr: 'عرض الحضور والإجازات',
          nameEn: 'View Attendance and Leaves',
          description: 'السماح بعرض سجلات الحضور والإجازات',
          category: 'حضور',
          screenCode: 'SCR-EMPLOYEES',
          level: 'advanced',
          isActive: true,
          dependencies: ['0301']
        },
        {
          code: '0308',
          nameAr: 'الموافقة على إجازة',
          nameEn: 'Approve Leave',
          description: 'السماح بالموافقة على طلبات الإجازات',
          category: 'إجازات',
          screenCode: 'SCR-EMPLOYEES',
          level: 'administrative',
          isActive: true,
          dependencies: ['0301', '0307']
        },
        {
          code: '0309',
          nameAr: 'إدارة الرواتب',
          nameEn: 'Manage Salaries',
          description: 'السماح بإدارة رواتب الموظفين',
          category: 'رواتب',
          screenCode: 'SCR-EMPLOYEES',
          level: 'critical',
          isActive: true,
          dependencies: ['0301', '0302']
        },
        {
          code: '0310',
          nameAr: 'تقييم أداء موظف',
          nameEn: 'Evaluate Employee Performance',
          description: 'السماح بتقييم أداء الموظفين',
          category: 'تقييم',
          screenCode: 'SCR-EMPLOYEES',
          level: 'administrative',
          isActive: true,
          dependencies: ['0301', '0302']
        }
      ]
    }
  ];

  // تصفية الصلاحيات حسب البحث والفلاتر
  const filteredGroups = permissionGroups.filter(group => {
    if (selectedGroup !== 'all' && group.id !== selectedGroup) return false;
    
    const matchesSearch = group.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.permissions.some(p => 
                           p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.code.includes(searchQuery)
                         );
    
    return matchesSearch;
  });

  const allPermissions = permissionGroups.flatMap(group => group.permissions);
  const filteredPermissions = allPermissions.filter(permission => {
    const matchesLevel = selectedLevel === 'all' || permission.level === selectedLevel;
    const matchesSearch = permission.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.code.includes(searchQuery);
    const matchesGroup = selectedGroup === 'all' || permissionGroups.find(g => g.id === selectedGroup)?.permissions.includes(permission);
    
    return matchesLevel && matchesSearch && matchesGroup;
  });

  const levelColors = {
    basic: 'bg-green-100 text-green-800 border-green-200',
    advanced: 'bg-blue-100 text-blue-800 border-blue-200',
    administrative: 'bg-purple-100 text-purple-800 border-purple-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const levelIcons = {
    basic: <CheckCircle className="h-3 w-3" />,
    advanced: <Settings className="h-3 w-3" />,
    administrative: <Shield className="h-3 w-3" />,
    critical: <AlertCircle className="h-3 w-3" />
  };

  return (
    <div className="space-y-6 rtl-support" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Key className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إدارة الصلاحيات التفصيلية v5.0
            </h1>
            <p className="text-blue-700 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نظام شامل لإدارة الصلاحيات المرقمة والمتقدمة مع دمج الصلاحيات المتشابهة
            </p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
            <div className="text-lg font-bold text-blue-600">{allPermissions.length}</div>
            <div className="text-xs text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الصلاحيات</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-green-100">
            <div className="text-lg font-bold text-green-600">{permissionGroups.length}</div>
            <div className="text-xs text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>مجموعات الصلاحيات</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
            <div className="text-lg font-bold text-purple-600">{allPermissions.filter(p => p.isActive).length}</div>
            <div className="text-xs text-purple-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>صلاحيات نشطة</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-red-100">
            <div className="text-lg font-bold text-red-600">{allPermissions.filter(p => p.level === 'critical').length}</div>
            <div className="text-xs text-red-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>صلاحيات حرجة</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-yellow-100">
            <div className="text-lg font-bold text-yellow-600">1700+</div>
            <div className="text-xs text-yellow-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>صلاحيات مرقمة</div>
          </div>
        </div>
      </div>

      {/* البحث والفلاتر */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الصلاحيات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-10"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              />
            </div>
            
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-field w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <option value="all">جميع المستويات</option>
                <option value="basic">أساسي</option>
                <option value="advanced">متقدم</option>
                <option value="administrative">إداري</option>
                <option value="critical">حرج</option>
              </select>
            </div>

            <div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="input-field w-full"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <option value="all">جميع المجموعات</option>
                {permissionGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.nameAr}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="groups" className="rtl-support">
        <TabsList className="tabs-list-rtl grid w-full grid-cols-3">
          <TabsTrigger value="groups" className="button-rtl">
            <Users className="h-4 w-4" />
            مجموعات الصلاحيات
          </TabsTrigger>
          <TabsTrigger value="permissions" className="button-rtl">
            <Key className="h-4 w-4" />
            جميع الصلاحيات
          </TabsTrigger>
          <TabsTrigger value="mapping" className="button-rtl">
            <Activity className="h-4 w-4" />
            ربط الصلاحيات
          </TabsTrigger>
        </TabsList>

        {/* مجموعات الصلاحيات */}
        <TabsContent value="groups" className="space-y-4">
          {filteredGroups.map(group => (
            <Card key={group.id} className="card-rtl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${group.color}-500 rounded-lg flex items-center justify-center text-white`}>
                      {group.icon}
                    </div>
                    <div>
                      <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {group.nameAr}
                      </CardTitle>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {group.screenCode} - {group.permissions.length} صلاحية
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-code">
                    {group.screenCode}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.permissions.map(permission => (
                    <div key={permission.code} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${levelColors[permission.level]}`}>
                          {levelIcons[permission.level]}
                          {permission.level}
                        </Badge>
                        <span className="font-code text-xs text-gray-500">{permission.code}</span>
                      </div>
                      
                      <h4 className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {permission.nameAr}
                      </h4>
                      
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {permission.description}
                      </p>
                      
                      {permission.dependencies && permission.dependencies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500">يتطلب:</span>
                          {permission.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs font-code">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant={permission.isActive ? 'default' : 'secondary'} className="text-xs">
                          {permission.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              نشطة
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              معطلة
                            </>
                          )}
                        </Badge>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* جميع الصلاحيات */}
        <TabsContent value="permissions" className="space-y-4">
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                جدول الصلاحيات التفصيلية ({filteredPermissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم العربي</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشاشة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map(permission => (
                      <TableRow key={permission.code}>
                        <TableCell className="font-code">{permission.code}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {permission.nameAr}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-code">
                            {permission.screenCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${levelColors[permission.level]}`}>
                            {levelIcons[permission.level]}
                            {permission.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={permission.isActive ? 'default' : 'secondary'}>
                            {permission.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                نشطة
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                معطلة
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md dialog-rtl">
                                <DialogHeader>
                                  <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    تفاصيل الصلاحية {permission.code}
                                  </DialogTitle>
                                  <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    معلومات تفصيلية عن الصلاحية والمتطلبات
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      الاسم العربي
                                    </label>
                                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {permission.nameAr}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      الوصف
                                    </label>
                                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      {permission.description}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                      المستوى
                                    </label>
                                    <Badge className={`${levelColors[permission.level]} mt-1`}>
                                      {levelIcons[permission.level]}
                                      {permission.level}
                                    </Badge>
                                  </div>
                                  
                                  {permission.dependencies && permission.dependencies.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                        الصلاحيات المطلوبة
                                      </label>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {permission.dependencies.map(dep => (
                                          <Badge key={dep} variant="outline" className="font-code">
                                            {dep}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant={permission.isActive ? "destructive" : "default"}
                            >
                              {permission.isActive ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Unlock className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ربط الصلاحيات */}
        <TabsContent value="mapping" className="space-y-4">
          <Card className="card-rtl">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                خريطة ربط الصلاحيات المدمجة
              </CardTitle>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عرض العلاقة بين الصلاحيات المرقمة (0101-1700) والشاشات المرتبطة
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissionGroups.map(group => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-${group.color}-500 rounded-lg flex items-center justify-center text-white`}>
                        {group.icon}
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {group.nameAr}
                        </h3>
                        <Badge variant="outline" className="font-code text-xs">
                          {group.screenCode}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الصلاحيات المرقمة:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {group.permissions.map(permission => (
                          <Badge key={permission.code} variant="secondary" className="text-xs font-code">
                            {permission.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}