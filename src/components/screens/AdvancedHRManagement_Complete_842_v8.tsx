/**
 * الشاشة 842 - إدارة الموارد البشرية المتقدمة - v8.0
 * =======================================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 8 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Users, UserPlus, Calendar, Clock, Award, TrendingUp, DollarSign,
  FileText, Settings, BarChart3, Plus, Search, Filter, Download,
  CheckCircle, AlertCircle, Activity, Briefcase, GraduationCap,
  Heart, Edit, Trash2, Eye, RefreshCw
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '842-01', number: '842-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '842-02', number: '842-02', title: 'الموظفون', icon: Users },
  { id: '842-03', number: '842-03', title: 'الحضور والانصراف', icon: Clock },
  { id: '842-04', number: '842-04', title: 'الإجازات', icon: Calendar },
  { id: '842-05', number: '842-05', title: 'الرواتب والأجور', icon: DollarSign },
  { id: '842-06', number: '842-06', title: 'تقييم الأداء', icon: TrendingUp },
  { id: '842-07', number: '842-07', title: 'التدريب والتطوير', icon: GraduationCap },
  { id: '842-08', number: '842-08', title: 'الإعدادات', icon: Settings },
];

const AdvancedHRManagement_Complete_842_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('842-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [enableAutoAttendance, setEnableAutoAttendance] = useState(true);
  const [enableLeaveApprovals, setEnableLeaveApprovals] = useState(true);

  // بيانات تجريبية
  const hrData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي الموظفين', value: '247', icon: Users, color: '#3b82f6', change: 8 },
      { id: '2', label: 'الموظفون النشطون', value: '235', icon: CheckCircle, color: '#10b981', change: 5 },
      { id: '3', label: 'في إجازة', value: '8', icon: Calendar, color: '#f59e0b', change: -2 },
      { id: '4', label: 'تعيينات جديدة', value: '4', icon: UserPlus, color: '#8b5cf6', change: 12 },
      { id: '5', label: 'متوسط الرواتب', value: '8,500 ر.س', icon: DollarSign, color: '#06b6d4', change: 3.5 },
      { id: '6', label: 'رضا الموظفين', value: '87%', icon: Heart, color: '#ec4899', change: 4.2 },
    ],
    employees: [
      { id: '1', name: 'أحمد محمد علي', position: 'مهندس أول', department: 'الهندسة', salary: 12000, status: 'active', attendance: 98 },
      { id: '2', name: 'فاطمة سعيد', position: 'محاسب قانوني', department: 'المالية', salary: 10000, status: 'active', attendance: 95 },
      { id: '3', name: 'خالد عبدالله', position: 'مدير مبيعات', department: 'المبيعات', salary: 15000, status: 'active', attendance: 100 },
      { id: '4', name: 'نورة حسن', position: 'مسؤول موارد', department: 'الموارد البشرية', salary: 9000, status: 'on-leave', attendance: 92 },
    ],
    leaves: [
      { id: '1', employee: 'نورة حسن', type: 'سنوية', startDate: '2025-10-20', endDate: '2025-10-27', days: 7, status: 'approved' },
      { id: '2', employee: 'محمد سالم', type: 'مرضية', startDate: '2025-10-24', endDate: '2025-10-25', days: 2, status: 'pending' },
      { id: '3', employee: 'سارة أحمد', type: 'طارئة', startDate: '2025-10-24', endDate: '2025-10-24', days: 1, status: 'approved' },
    ],
  }), []);

  const renderTabContent = () => {
    switch (activeTab) {
      case '842-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - الموارد البشرية</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {hrData.stats.map((stat) => (
                <Card key={stat.id} className="card-element card-rtl">
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4', style: { color: stat.color } })}
                      </div>
                      <div className="flex items-center gap-1">
                        {stat.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <Activity className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* قائمة الموظفين */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Users className="h-4 w-4" />
                  أحدث الموظفين
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوظيفة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحضور</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hrData.employees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.position}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={emp.attendance} className="h-1.5 w-16" />
                            <span className="text-xs">{emp.attendance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-1.5 py-0 h-5 ${
                            emp.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {emp.status === 'active' ? 'نشط' : 'إجازة'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '842-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الموظفين</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />موظف جديد</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوظيفة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الراتب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hrData.employees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.position}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.salary.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-1.5 py-0 h-5 ${
                            emp.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {emp.status === 'active' ? 'نشط' : 'إجازة'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600"><Trash2 className="h-3 w-3" /></Button>
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

      case '842-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إدارة الإجازات</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />فلترة</Button>
                <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />طلب إجازة</Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="h-4 w-4" />
                  طلبات الإجازات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>من</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إلى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأيام</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hrData.leaves.map((leave) => (
                      <TableRow key={leave.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{leave.employee}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{leave.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{leave.startDate}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{leave.endDate}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{leave.days}</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-1.5 py-0 h-5 ${
                            leave.status === 'approved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {leave.status === 'approved' ? 'موافق عليها' : 'قيد المراجعة'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '842-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الموارد البشرية</h2>
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
                  id="auto-attendance"
                  label="الحضور التلقائي"
                  description="تسجيل الحضور والانصراف تلقائياً"
                  checked={enableAutoAttendance}
                  onCheckedChange={setEnableAutoAttendance}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="leave-approvals"
                  label="الموافقات على الإجازات"
                  description="تفعيل نظام الموافقات على طلبات الإجازات"
                  checked={enableLeaveApprovals}
                  onCheckedChange={setEnableLeaveApprovals}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="work-hours"
                    label="ساعات العمل اليومية"
                    value="8"
                    onChange={() => {}}
                    options={[
                      { value: '6', label: '6 ساعات' },
                      { value: '8', label: '8 ساعات' },
                      { value: '9', label: '9 ساعات' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-842" position="top-right" />
      
      {/* هيدر الشاشة v4.2.2 */}
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
              <Users 
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
                  إدارة الموارد البشرية المتقدمة
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
                    842
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
                نظام متكامل لإدارة الموارد البشرية
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
                8 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
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

export default AdvancedHRManagement_Complete_842_v8;
