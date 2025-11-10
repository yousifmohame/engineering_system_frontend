/**
 * الشاشة 817 - إدارة الموظفين - v8.0
 * =====================================
 * 
 * تحديث v8.0:
 * ✅ UnifiedTabsSidebar v1.1
 * ✅ هيدر احترافي v4.2.2
 * ✅ InputWithCopy & EnhancedSwitch
 * ✅ 10 تبويبات شاملة
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Users, Plus, Edit, Eye, Download, CheckCircle, Clock,
  AlertCircle, Filter, Calendar, Building, Settings, RefreshCw,
  Award, TrendingUp, GraduationCap, Star, UserCheck, Activity,
  BarChart3, Briefcase
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '817-01', number: '817-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '817-02', number: '817-02', title: 'قائمة الموظفين', icon: Users },
  { id: '817-03', number: '817-03', title: 'إضافة موظف', icon: Plus },
  { id: '817-04', number: '817-04', title: 'الحضور والإجازات', icon: Calendar },
  { id: '817-05', number: '817-05', title: 'المهارات والشهادات', icon: GraduationCap },
  { id: '817-06', number: '817-06', title: 'التقييمات', icon: Star },
  { id: '817-07', number: '817-07', title: 'الترقيات', icon: Award },
  { id: '817-08', number: '817-08', title: 'التكامل مع HR', icon: UserCheck },
  { id: '817-09', number: '817-09', title: 'التقارير', icon: BarChart3 },
  { id: '817-10', number: '817-10', title: 'الإعدادات', icon: Settings },
];

const EmployeesManagement_Complete_817_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('817-01');
  const [enableAutoAttendance, setEnableAutoAttendance] = useState(true);
  const [enableGOSI, setEnableGOSI] = useState(true);

  const employeesData = useMemo(() => ({
    stats: [
      { id: '1', label: 'إجمالي الموظفين', value: '189', icon: Users, color: '#3b82f6', change: 12 },
      { id: '2', label: 'موظفون نشطون', value: '165', icon: CheckCircle, color: '#10b981', change: 8 },
      { id: '3', label: 'في إجازة', value: '12', icon: Calendar, color: '#f59e0b', change: -2 },
      { id: '4', label: 'دوام كامل', value: '142', icon: Building, color: '#8b5cf6', change: 5 },
      { id: '5', label: 'معدل الحضور', value: '94.5%', icon: Activity, color: '#06b6d4', change: 2.5 },
      { id: '6', label: 'معدل الرضا', value: '88%', icon: TrendingUp, color: '#ec4899', change: 4 },
    ],
    employees: [
      { id: '1', name: 'أحمد محمد علي', position: 'مهندس أول', department: 'الهندسة', type: 'full-time', status: 'active', salary: 15000, attendance: 98 },
      { id: '2', name: 'فاطمة سعيد حسن', position: 'محاسب قانوني', department: 'المالية', type: 'full-time', status: 'active', salary: 12000, attendance: 96 },
      { id: '3', name: 'خالد عبدالله', position: 'مدير مبيعات', department: 'المبيعات', type: 'full-time', status: 'active', salary: 18000, attendance: 100 },
      { id: '4', name: 'نورة حسن الدوسري', position: 'مسؤول موارد', department: 'الموارد البشرية', type: 'full-time', status: 'on-leave', salary: 10000, attendance: 92 },
    ],
    skills: [
      { id: '1', name: 'AutoCAD', level: 'متقدم', employees: 45 },
      { id: '2', name: 'Revit', level: 'متوسط', employees: 32 },
      { id: '3', name: 'إدارة المشاريع', level: 'متقدم', employees: 28 },
    ],
  }), []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: 'نشط', color: 'bg-green-500' },
      'on-leave': { label: 'في إجازة', color: 'bg-yellow-500' },
      inactive: { label: 'غير نشط', color: 'bg-gray-500' },
      suspended: { label: 'موقوف', color: 'bg-red-500' },
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; color: string }> = {
      'full-time': { label: 'دوام كامل', color: 'bg-blue-100 text-blue-700' },
      'part-time': { label: 'دوام جزئي', color: 'bg-green-100 text-green-700' },
      freelancer: { label: 'فريلانسر', color: 'bg-purple-100 text-purple-700' },
    };
    const t = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return <Badge variant="outline" className={`text-xs px-1.5 py-0 ${t.color}`}>{t.label}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '817-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة - إدارة الموظفين</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* المؤشرات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {employeesData.stats.map((stat) => (
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
                    {employeesData.employees.map((emp) => (
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
                        <TableCell className="text-right py-2">{getStatusBadge(emp.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '817-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الموظفين</h2>
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
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الراتب</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeesData.employees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.position}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{emp.department}</TableCell>
                        <TableCell className="text-right py-2">{getTypeBadge(emp.type)}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{emp.salary.toLocaleString()} ر.س</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(emp.status)}</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Edit className="h-3 w-3" /></Button>
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

      case '817-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المهارات والشهادات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500"><Plus className="h-3 w-3 ml-1" />مهارة جديدة</Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {employeesData.skills.map((skill) => (
                <Card key={skill.id} className="card-element card-rtl">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline" className="text-xs px-1.5 py-0">{skill.level}</Badge>
                    </div>
                    <h3 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{skill.name}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{skill.employees} موظف</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '817-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الموظفين</h2>
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
                  id="gosi-integration"
                  label="التكامل مع GOSI"
                  description="تفعيل التكامل مع نظام التأمينات الاجتماعية"
                  checked={enableGOSI}
                  onCheckedChange={setEnableGOSI}
                  size="sm"
                  variant="success"
                />

                <div className="form-rtl">
                  <SelectWithCopy
                    id="probation-period"
                    label="مدة التجربة الافتراضية"
                    value="90"
                    onChange={() => {}}
                    options={[
                      { value: '30', label: '30 يوماً' },
                      { value: '60', label: '60 يوماً' },
                      { value: '90', label: '90 يوماً' },
                      { value: '180', label: '180 يوماً' }
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
      <CodeDisplay code="SCR-817" position="top-right" />
      
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
                  إدارة الموظفين
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
                    817
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
                نظام شامل لإدارة الموظفين والموارد البشرية
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
                10 تبويبات
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

export default EmployeesManagement_Complete_817_v8;
