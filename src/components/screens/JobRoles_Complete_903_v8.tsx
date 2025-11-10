/**
 * الشاشة 903 - إدارة الأدوار الوظيفية - v8.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import {
  UserCheck, Users, Shield, Settings, Activity, BarChart3,
  Plus, Edit, Eye, Download, Layers, History, Archive,
  ArrowRightLeft, ClipboardCheck, CheckSquare, Bell
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

const TABS_CONFIG: TabConfig[] = [
  { id: '903-01', number: '903-01', title: 'نظرة عامة', icon: Activity },
  { id: '903-02', number: '903-02', title: 'جميع الأدوار', icon: UserCheck },
  { id: '903-03', number: '903-03', title: 'إنشاء دور', icon: Plus },
  { id: '903-04', number: '903-04', title: 'تعيين الموظفين', icon: Users },
  { id: '903-05', number: '903-05', title: 'نقل بين الأدوار', icon: ArrowRightLeft },
  { id: '903-06', number: '903-06', title: 'الصلاحيات', icon: Shield },
  { id: '903-07', number: '903-07', title: 'خصائص الأدوار', icon: Settings },
  { id: '903-08', number: '903-08', title: 'التسلسل الوظيفي', icon: Layers },
  { id: '903-09', number: '903-09', title: 'الموظفون', icon: ClipboardCheck },
  { id: '903-10', number: '903-10', title: 'سجل التغييرات', icon: History },
  { id: '903-11', number: '903-11', title: 'التقارير', icon: BarChart3 },
  { id: '903-12', number: '903-12', title: 'قوائم الإسناد', icon: CheckSquare },
  { id: '903-13', number: '903-13', title: 'الإشعارات', icon: Bell },
  { id: '903-14', number: '903-14', title: 'الأرشيف', icon: Archive },
  { id: '903-15', number: '903-15', title: 'الإعدادات', icon: Settings },
];

interface JobRole {
  id: string;
  name: string;
  department: string;
  level: number;
  employeesCount: number;
  status: 'active' | 'inactive';
}

const JobRoles_Complete_903_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('903-01');
  const [autoAssign, setAutoAssign] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(true);

  const mockRoles: JobRole[] = [
    { id: 'ROLE-001', name: 'مدير عام', department: 'الإدارة', level: 1, employeesCount: 3, status: 'active' },
    { id: 'ROLE-002', name: 'مدير مشاريع', department: 'المشاريع', level: 2, employeesCount: 8, status: 'active' },
    { id: 'ROLE-003', name: 'مهندس معماري', department: 'الهندسة', level: 3, employeesCount: 15, status: 'active' },
  ];

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-green-500 text-white">نشط</Badge>
    ) : (
      <Badge className="text-xs px-1.5 py-0 h-5 bg-gray-500 text-white">غير نشط</Badge>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '903-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <UserCheck className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-2xl text-blue-600 mb-1">28</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الأدوار</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-2xl text-green-600 mb-1">156</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون المعينون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Shield className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-2xl text-purple-600 mb-1">2,450</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الصلاحيات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl">
                <CardContent className="p-3 text-center">
                  <Layers className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-2xl text-orange-600 mb-1">5</p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستويات الوظيفية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  توزيع الأدوار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإدارة</span>
                      <span className="text-xs font-mono">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</span>
                      <span className="text-xs font-mono">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهندسة</span>
                      <span className="text-xs font-mono">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '903-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>جميع الأدوار الوظيفية</h2>
              <Badge variant="outline" className="text-xs">{mockRoles.length} دور</Badge>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الدور</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستوى</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفون</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoles.map((role) => (
                      <TableRow key={role.id} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-right py-2 text-xs font-mono">{role.id}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.name}</TableCell>
                        <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{role.department}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{role.level}</TableCell>
                        <TableCell className="text-right py-2 text-xs">{role.employeesCount}</TableCell>
                        <TableCell className="text-right py-2">{getStatusBadge(role.status)}</TableCell>
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

      case '903-15':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأدوار</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ التغييرات</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Settings className="h-4 w-4" />
                  إعدادات الأدوار والصلاحيات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2">
                <EnhancedSwitch
                  id="auto-assign"
                  label="التعيين التلقائي"
                  description="تعيين دور افتراضي للموظفين الجدد"
                  checked={autoAssign}
                  onCheckedChange={setAutoAssign}
                  size="sm"
                  variant="default"
                />

                <EnhancedSwitch
                  id="notify-change"
                  label="التنبيه عند التغيير"
                  description="إرسال تنبيه عند تغيير دور الموظف"
                  checked={notifyOnChange}
                  onCheckedChange={setNotifyOnChange}
                  size="sm"
                  variant="success"
                />
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <UserCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
      <CodeDisplay code="SCR-903" position="top-right" />
      
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
              <UserCheck 
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
                  إدارة الأدوار الوظيفية
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
                    903
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
                إدارة شاملة للأدوار الوظيفية والصلاحيات
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
                15 تبويباً
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

export default JobRoles_Complete_903_v8;
