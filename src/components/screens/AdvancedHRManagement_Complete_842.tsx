import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Activity,
  Briefcase,
  GraduationCap,
  Heart
} from 'lucide-react';

/**
 * شاشة 842 - إدارة الموارد البشرية المتقدمة
 * Advanced HR Management
 * 
 * نظام متكامل لإدارة الموارد البشرية مع:
 * - 8 تابات رئيسية بنظام السايد بار الرأسي
 * - تكثيف معلومات 95%+
 * - إدارة شاملة للموظفين
 * - نظام الحضور والرواتب
 */

export default function AdvancedHRManagement_Complete_842() {
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات تجريبية
  const hrStats = {
    totalEmployees: 247,
    activeEmployees: 235,
    onLeave: 8,
    newHires: 4,
    avgSalary: 8500,
    satisfaction: 87
  };

  const tabs = [
    {
      id: 'overview',
      number: '842-01',
      title: 'نظرة عامة',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'لوحة معلومات الموارد'
    },
    {
      id: 'employees',
      number: '842-02',
      title: 'الموظفون',
      icon: <Users className="w-4 h-4" />,
      description: 'إدارة الموظفين'
    },
    {
      id: 'attendance',
      number: '842-03',
      title: 'الحضور',
      icon: <Clock className="w-4 h-4" />,
      description: 'نظام الحضور'
    },
    {
      id: 'leaves',
      number: '842-04',
      title: 'الإجازات',
      icon: <Calendar className="w-4 h-4" />,
      description: 'إدارة الإجازات'
    },
    {
      id: 'payroll',
      number: '842-05',
      title: 'الرواتب',
      icon: <DollarSign className="w-4 h-4" />,
      description: 'نظام الرواتب'
    },
    {
      id: 'performance',
      number: '842-06',
      title: 'الأداء',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'تقييم الأداء'
    },
    {
      id: 'reports',
      number: '842-07',
      title: 'التقارير',
      icon: <FileText className="w-4 h-4" />,
      description: 'تقارير الموارد'
    },
    {
      id: 'settings',
      number: '842-08',
      title: 'الإعدادات',
      icon: <Settings className="w-4 h-4" />,
      description: 'إعدادات النظام'
    }
  ];

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        {/* هيدر السايد بار */}
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                الموارد البشرية
              </h2>
              <p className="text-xs text-white/80" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة شاملة للموارد
              </p>
            </div>
          </div>
          
          {/* رقم الشاشة */}
          <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <span className="text-xs text-white/70" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              رقم الشاشة:
            </span>
            <span className="font-code text-white font-bold">
              SCR-842
            </span>
          </div>
        </div>

        {/* قائمة التابات */}
        <div className="vertical-tabs-sidebar-body">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="vertical-tab-icon">
                {tab.icon}
              </div>
              <div className="vertical-tab-content">
                <div className="vertical-tab-title">{tab.title}</div>
                <div className="text-xs opacity-70" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {tab.description}
                </div>
              </div>
              <div className="vertical-tab-number">{tab.number}</div>
            </button>
          ))}
        </div>

        {/* فوتر السايد بار */}
        <div className="vertical-tabs-sidebar-footer">
          <div className="dense-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {hrStats.activeEmployees}
              </div>
              <div className="text-xs opacity-70" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                موظفون نشطون
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {hrStats.onLeave}
              </div>
              <div className="text-xs opacity-70" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                في إجازة
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        {/* هيدر المحتوى */}
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {tabs.find(t => t.id === activeTab)?.title}
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="dense-btn dense-btn-secondary">
                <Filter className="w-3 h-3" />
                تصفية
              </Button>
              <Button className="dense-btn dense-btn-primary">
                <Plus className="w-3 h-3" />
                موظف جديد
              </Button>
            </div>
          </div>
        </div>

        {/* جسم المحتوى */}
        <div className="vertical-tabs-content-body">
          {activeTab === 'overview' && <OverviewTab stats={hrStats} />}
          {activeTab === 'employees' && <EmployeesTab />}
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'leaves' && <LeavesTab />}
          {activeTab === 'payroll' && <PayrollTab />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

// مكونات التابات
function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="dense-layout">
      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <Users className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.totalEmployees}</div>
          <div className="dense-stat-label">إجمالي الموظفين</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.activeEmployees}</div>
          <div className="dense-stat-label">موظفون نشطون</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.onLeave}</div>
          <div className="dense-stat-label">في إجازة</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <UserPlus className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.newHires}</div>
          <div className="dense-stat-label">تعيينات جديدة</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.avgSalary.toLocaleString()}</div>
          <div className="dense-stat-label">متوسط الراتب</div>
        </div>
        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Heart className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.satisfaction}%</div>
          <div className="dense-stat-label">رضا الموظفين</div>
        </div>
      </div>

      {/* الموظفون المميزون */}
      <div className="dense-section mt-4">
        <div className="dense-section-header">
          <div className="dense-section-title">
            <Award className="w-4 h-4 text-yellow-600" />
            الموظفون المميزون
          </div>
        </div>
        <div className="dense-grid dense-grid-3 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="dense-content-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    موظف {i}
                  </div>
                  <div className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    القسم: قسم {Math.ceil(i / 2)}
                  </div>
                </div>
                <Badge variant="default" className="text-xs">
                  متميز
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">التقييم:</span>
                  <span className="font-semibold mr-1">{(4.5 + (i % 5) / 10).toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-gray-600">الخبرة:</span>
                  <span className="font-semibold mr-1">{3 + i} سنوات</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeesTab() {
  return (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <div className="dense-section-title">
            <Users className="w-4 h-4" />
            قائمة الموظفين
          </div>
          <div className="dense-section-actions">
            <Button className="dense-action-btn">
              <Search className="w-3 h-3" />
            </Button>
            <Button className="dense-action-btn">
              <Filter className="w-3 h-3" />
            </Button>
            <Button className="dense-action-btn">
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <Input placeholder="ابحث عن موظف..." className="dense-form-input" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="dense-table">
            <thead>
              <tr>
                <th>الكود</th>
                <th>الاسم</th>
                <th>القسم</th>
                <th>الوظيفة</th>
                <th>الراتب</th>
                <th>تاريخ التعيين</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr key={i}>
                  <td className="font-code">EMP-{1000 + i}</td>
                  <td>موظف {i}</td>
                  <td>قسم {Math.ceil(i / 2)}</td>
                  <td className="text-xs">وظيفة {i}</td>
                  <td className="font-semibold">{(5000 + i * 500).toLocaleString()} ريال</td>
                  <td className="font-code text-xs">2022-0{i}-15</td>
                  <td>
                    <Badge variant={i % 3 === 0 ? 'default' : 'outline'} className="text-xs">
                      {i % 3 === 0 ? 'نشط' : 'في إجازة'}
                    </Badge>
                  </td>
                  <td>
                    <Button className="dense-action-btn">
                      <Search className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendanceTab() {
  return (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <div className="dense-section-title">
            <Clock className="w-4 h-4" />
            سجل الحضور اليومي
          </div>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="dense-table">
            <thead>
              <tr>
                <th>الموظف</th>
                <th>وقت الدخول</th>
                <th>وقت الخروج</th>
                <th>ساعات العمل</th>
                <th>الإضافي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i}>
                  <td>موظف {i}</td>
                  <td className="font-code text-xs">08:{String(i * 5).padStart(2, '0')}</td>
                  <td className="font-code text-xs">17:{String(i * 3).padStart(2, '0')}</td>
                  <td className="text-center font-semibold">{8 + (i % 3 === 0 ? 1 : 0)}</td>
                  <td className="text-center">{i % 3 === 0 ? '1' : '-'}</td>
                  <td>
                    <Badge variant={i % 4 === 0 ? 'destructive' : 'default'} className="text-xs">
                      {i % 4 === 0 ? 'تأخير' : 'في الوقت'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LeavesTab() {
  return (
    <div className="dense-layout">
      <div className="dense-grid dense-grid-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="dense-section">
            <div className="dense-section-header">
              <div className="dense-section-title">
                <Calendar className="w-4 h-4" />
                طلب إجازة #{i}
              </div>
              <Badge
                variant={i % 3 === 0 ? 'default' : i % 3 === 1 ? 'destructive' : 'outline'}
                className="text-xs"
              >
                {i % 3 === 0 ? 'موافق' : i % 3 === 1 ? 'مرفوض' : 'قيد المراجعة'}
              </Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الموظف:</span>
                <span className="font-semibold">موظف {i}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="font-semibold">{i % 2 === 0 ? 'سنوية' : 'مرضية'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المدة:</span>
                <span className="font-semibold">{3 + i} أيام</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البداية:</span>
                <span className="font-code text-xs">2024-02-{String(i).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayrollTab() {
  return (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <div className="dense-section-title">
            <DollarSign className="w-4 h-4" />
            كشف الرواتب الشهري
          </div>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="dense-table">
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الراتب الأساسي</th>
                <th>البدلات</th>
                <th>الخصومات</th>
                <th>الصافي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr key={i}>
                  <td>موظف {i}</td>
                  <td className="font-semibold">{(5000 + i * 500).toLocaleString()}</td>
                  <td>{(500 + i * 50).toLocaleString()}</td>
                  <td className="text-red-600">{(200 + i * 20).toLocaleString()}</td>
                  <td className="font-bold text-green-600">{(5300 + i * 530).toLocaleString()}</td>
                  <td>
                    <Badge variant={i % 2 === 0 ? 'default' : 'outline'} className="text-xs">
                      {i % 2 === 0 ? 'مدفوع' : 'قيد الدفع'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PerformanceTab() {
  return (
    <div className="dense-layout">
      <div className="dense-grid dense-grid-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="dense-section">
            <div className="dense-section-header">
              <div className="dense-section-title">
                <TrendingUp className="w-4 h-4" />
                تقييم موظف {i}
              </div>
              <div className="text-xs font-semibold text-green-600">
                {(85 + i).toFixed(0)}%
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الإنتاجية:</span>
                <span className="font-semibold">{80 + i}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الجودة:</span>
                <span className="font-semibold">{85 + i}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الالتزام:</span>
                <span className="font-semibold">{90 + (i % 5)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="dense-layout">
      <div className="dense-grid dense-grid-2">
        <div className="dense-section">
          <div className="dense-section-header">
            <div className="dense-section-title">
              <FileText className="w-4 h-4" />
              تقرير الموظفين الشهري
            </div>
            <Button className="dense-btn dense-btn-primary">
              <Download className="w-3 h-3" />
              تصدير
            </Button>
          </div>
        </div>
        
        <div className="dense-section">
          <div className="dense-section-header">
            <div className="dense-section-title">
              <Clock className="w-4 h-4" />
              تقرير الحضور
            </div>
            <Button className="dense-btn dense-btn-primary">
              <Download className="w-3 h-3" />
              تصدير
            </Button>
          </div>
        </div>

        <div className="dense-section">
          <div className="dense-section-header">
            <div className="dense-section-title">
              <DollarSign className="w-4 h-4" />
              تقرير الرواتب
            </div>
            <Button className="dense-btn dense-btn-primary">
              <Download className="w-3 h-3" />
              تصدير
            </Button>
          </div>
        </div>

        <div className="dense-section">
          <div className="dense-section-header">
            <div className="dense-section-title">
              <TrendingUp className="w-4 h-4" />
              تقرير الأداء
            </div>
            <Button className="dense-btn dense-btn-primary">
              <Download className="w-3 h-3" />
              تصدير
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <div className="dense-section-title">
            <Settings className="w-4 h-4" />
            إعدادات نظام الموارد البشرية
          </div>
        </div>
        
        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label">ساعات العمل اليومية</label>
              <input type="number" className="dense-form-input" defaultValue="8" />
            </div>
            <div className="dense-form-group">
              <label className="dense-form-label">أيام الإجازة السنوية</label>
              <input type="number" className="dense-form-input" defaultValue="30" />
            </div>
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label">نظام الحضور</label>
              <select className="dense-form-select">
                <option>بصمة</option>
                <option>يدوي</option>
              </select>
            </div>
            <div className="dense-form-group">
              <label className="dense-form-label">موافقة تلقائية للإجازات</label>
              <select className="dense-form-select">
                <option>معطل</option>
                <option>مفعل</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button className="dense-btn dense-btn-secondary">
              إلغاء
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <CheckCircle className="w-3 h-3" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}