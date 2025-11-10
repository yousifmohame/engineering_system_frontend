import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Users, Building2, FileText, DollarSign, Calendar, Phone, Mail,
  MapPin, Star, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle,
  Briefcase, Award, Target, BarChart3
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '555-01', number: '555-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '555-02', number: '555-02', title: 'قائمة المقاولين', icon: Users },
  { id: '555-03', number: '555-03', title: 'التصنيفات والتخصصات', icon: Briefcase },
  { id: '555-04', number: '555-04', title: 'المشاريع المشتركة', icon: Building2 },
  { id: '555-05', number: '555-05', title: 'العقود والاتفاقيات', icon: FileText },
  { id: '555-06', number: '555-06', title: 'المدفوعات والمستحقات', icon: DollarSign },
  { id: '555-07', number: '555-07', title: 'التقييمات والأداء', icon: Star },
  { id: '555-08', number: '555-08', title: 'التواصل والملاحظات', icon: Mail },
  { id: '555-09', number: '555-09', title: 'المستندات والشهادات', icon: Award },
  { id: '555-10', number: '555-10', title: 'التقارير', icon: TrendingUp },
];

interface Contractor {
  id: string;
  name: string;
  companyName: string;
  classification: string;
  specialization: string[];
  rating: number;
  projectsCount: number;
  totalValue: number;
  status: 'نشط' | 'معلق' | 'محظور' | 'مكتمل';
  phone: string;
  email: string;
  city: string;
  joinDate: string;
}

interface Project {
  id: string;
  name: string;
  contractorId: string;
  contractorName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'جاري' | 'مكتمل' | 'متأخر' | 'ملغي';
  completion: number;
}

const ContractorsRelations_Complete_555: React.FC = () => {
  const [activeTab, setActiveTab] = useState('555-01');

  // بيانات وهمية للمقاولين
  const contractors: Contractor[] = [
    {
      id: 'CON001',
      name: 'م. أحمد محمد السعيد',
      companyName: 'شركة السعيد للمقاولات',
      classification: 'الدرجة الأولى',
      specialization: ['مباني سكنية', 'مباني تجارية', 'طرق'],
      rating: 4.8,
      projectsCount: 15,
      totalValue: 25000000,
      status: 'نشط',
      phone: '0501234567',
      email: 'ahmad@alsaeed.com',
      city: 'الرياض',
      joinDate: '2020-01-15'
    },
    {
      id: 'CON002',
      name: 'م. خالد عبدالله الخالدي',
      companyName: 'مؤسسة الخالدي الإنشائية',
      classification: 'الدرجة الثانية',
      specialization: ['مباني سكنية', 'فلل', 'تشطيبات'],
      rating: 4.5,
      projectsCount: 12,
      totalValue: 18000000,
      status: 'نشط',
      phone: '0509876543',
      email: 'khaled@alkhaldi.com',
      city: 'جدة',
      joinDate: '2021-03-20'
    },
    {
      id: 'CON003',
      name: 'م. فهد سعد العتيبي',
      companyName: 'العتيبي للمقاولات العامة',
      classification: 'الدرجة الأولى',
      specialization: ['مباني صناعية', 'مستودعات', 'ورش'],
      rating: 4.9,
      projectsCount: 20,
      totalValue: 35000000,
      status: 'نشط',
      phone: '0551234567',
      email: 'fahad@alotaibi.com',
      city: 'الدمام',
      joinDate: '2019-06-10'
    },
    {
      id: 'CON004',
      name: 'م. محمد علي القحطاني',
      companyName: 'القحطاني للإنشاءات',
      classification: 'الدرجة الثالثة',
      specialization: ['صيانة', 'ترميم', 'تشطيبات'],
      rating: 4.2,
      projectsCount: 8,
      totalValue: 6000000,
      status: 'نشط',
      phone: '0561234567',
      email: 'mohammed@alqahtani.com',
      city: 'الرياض',
      joinDate: '2022-01-05'
    },
    {
      id: 'CON005',
      name: 'م. عبدالرحمن سليمان الدوسري',
      companyName: 'الدوسري للمقاولات المتخصصة',
      classification: 'الدرجة الثانية',
      specialization: ['كهرباء', 'سباكة', 'تكييف'],
      rating: 4.6,
      projectsCount: 10,
      totalValue: 12000000,
      status: 'نشط',
      phone: '0571234567',
      email: 'abdulrahman@aldosari.com',
      city: 'الخبر',
      joinDate: '2020-09-15'
    },
  ];

  // بيانات وهمية للمشاريع المشتركة
  const projects: Project[] = [
    {
      id: 'PRJ001',
      name: 'مشروع فلل الياسمين',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      value: 5000000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'جاري',
      completion: 45
    },
    {
      id: 'PRJ002',
      name: 'مشروع برج النخيل التجاري',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      value: 15000000,
      startDate: '2024-06-01',
      endDate: '2026-06-01',
      status: 'جاري',
      completion: 62
    },
    {
      id: 'PRJ003',
      name: 'مشروع مجمع الورود السكني',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      value: 8000000,
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      status: 'جاري',
      completion: 78
    },
    {
      id: 'PRJ004',
      name: 'صيانة مباني الشركة',
      contractorId: 'CON004',
      contractorName: 'القحطاني للإنشاءات',
      value: 500000,
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      status: 'جاري',
      completion: 30
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'جاري':
        return '#10b981';
      case 'مكتمل':
        return '#2563eb';
      case 'معلق':
      case 'متأخر':
        return '#f59e0b';
      case 'محظور':
      case 'ملغي':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '555-01':
        return (
          <div className="space-y-6">
            {/* هيدر الشاشة */}
            <div
              style={{
                position: 'sticky',
                top: '0',
                zIndex: 10,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderBottom: '3px solid transparent',
                borderImage: 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%) 1',
                padding: '0',
                marginBottom: '0',
                marginTop: '0',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, rgba(217, 119, 6, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                      border: '2px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    <Users 
                      className="h-6 w-6" 
                      style={{ 
                        color: '#f59e0b',
                        filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3))' 
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
                          background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        علاقات المقاولين
                      </h1>
                      
                      <div
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
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
                          555
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
                      نظام شامل لإدارة العلاقات مع المقاولين والمشاريع المشتركة
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div 
                    style={{
                      padding: '6px 14px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.15)'
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

            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-8 gap-3">
              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Users className="h-4 w-4 mx-auto text-amber-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي المقاولين
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <CheckCircle className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.filter(c => c.status === 'نشط').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نشط
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Building2 className="h-4 w-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {projects.length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المشاريع
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Clock className="h-4 w-4 mx-auto text-orange-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {projects.filter(p => p.status === 'جاري').length}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    جاري التنفيذ
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(contractors.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}م
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إجمالي القيمة (ر.س)
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Star className="h-4 w-4 mx-auto text-yellow-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متوسط التقييم
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <Target className="h-4 w-4 mx-auto text-purple-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {contractors.reduce((sum, c) => sum + c.projectsCount, 0)}
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    مشاريع منفذة
                  </p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardContent className="p-1.5 text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-cyan-600 mb-0.5" />
                  <p className="text-xs mb-0" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {Math.round(projects.reduce((sum, p) => sum + p.completion, 0) / projects.length)}%
                  </p>
                  <p className="text-[9px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    متوسط الإنجاز
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* جدول المقاولين */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المقاولين النشطون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-2 text-sm">الرقم</th>
                        <th className="text-right p-2 text-sm">الاسم</th>
                        <th className="text-right p-2 text-sm">الشركة</th>
                        <th className="text-right p-2 text-sm">التصنيف</th>
                        <th className="text-right p-2 text-sm">التقييم</th>
                        <th className="text-right p-2 text-sm">المشاريع</th>
                        <th className="text-right p-2 text-sm">القيمة الإجمالية</th>
                        <th className="text-right p-2 text-sm">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractors.map((contractor) => (
                        <tr key={contractor.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 text-sm">{contractor.id}</td>
                          <td className="p-2 text-sm font-bold">{contractor.name}</td>
                          <td className="p-2 text-sm">{contractor.companyName}</td>
                          <td className="p-2 text-sm">{contractor.classification}</td>
                          <td className="p-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold">{contractor.rating}</span>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{contractor.projectsCount}</td>
                          <td className="p-2 text-sm font-bold text-green-600">
                            {(contractor.totalValue / 1000000).toFixed(1)}م ر.س
                          </td>
                          <td className="p-2 text-sm">
                            <Badge style={{ backgroundColor: getStatusColor(contractor.status), color: 'white' }}>
                              {contractor.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* المشاريع المشتركة */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المشاريع المشتركة الجارية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.contractorName}</p>
                        </div>
                        <Badge style={{ backgroundColor: getStatusColor(project.status), color: 'white' }}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">القيمة</p>
                          <p className="font-bold">{(project.value / 1000000).toFixed(1)}م ر.س</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">البداية</p>
                          <p>{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">النهاية</p>
                          <p>{project.endDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">الإنجاز</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-green-600">{project.completion}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-02':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة مقاول جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="اسم المقاول *"
                    id="contractor-name"
                    placeholder="الاسم الكامل"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم الشركة *"
                    id="company-name"
                    placeholder="اسم الشركة أو المؤسسة"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="التصنيف *"
                    id="classification"
                    options={[
                      { value: 'first', label: 'الدرجة الأولى' },
                      { value: 'second', label: 'الدرجة الثانية' },
                      { value: 'third', label: 'الدرجة الثالثة' },
                      { value: 'fourth', label: 'الدرجة الرابعة' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="رقم الجوال *"
                    id="phone"
                    placeholder="05xxxxxxxx"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="البريد الإلكتروني *"
                    id="email"
                    type="email"
                    placeholder="contractor@company.com"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="المدينة *"
                    id="city"
                    options={[
                      { value: 'riyadh', label: 'الرياض' },
                      { value: 'jeddah', label: 'جدة' },
                      { value: 'dammam', label: 'الدمام' },
                      { value: 'makkah', label: 'مكة المكرمة' },
                      { value: 'madinah', label: 'المدينة المنورة' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="التخصصات"
                      id="specializations"
                      rows={3}
                      placeholder="مباني سكنية، مباني تجارية، طرق..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}>
                    حفظ المقاول
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* قائمة المقاولين بالكامل */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  قائمة المقاولين ({contractors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contractors.map((contractor) => (
                    <div 
                      key={contractor.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{contractor.name}</h3>
                          <p className="text-sm text-gray-600">{contractor.companyName}</p>
                          <div className="flex gap-2 mt-2">
                            {contractor.specialization.map((spec, idx) => (
                              <Badge key={idx} variant="outline">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge style={{ backgroundColor: getStatusColor(contractor.status), color: 'white' }}>
                            {contractor.status}
                          </Badge>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{contractor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">التصنيف</p>
                          <p className="font-bold">{contractor.classification}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">المشاريع</p>
                          <p className="font-bold text-blue-600">{contractor.projectsCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">القيمة الإجمالية</p>
                          <p className="font-bold text-green-600">{(contractor.totalValue / 1000000).toFixed(1)}م ر.س</p>
                        </div>
                        <div>
                          <p className="text-gray-500">تاريخ التسجيل</p>
                          <p>{contractor.joinDate}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span>{contractor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-500" />
                          <span className="text-xs">{contractor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{contractor.city}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-03':
      case '555-04':
      case '555-05':
      case '555-06':
      case '555-07':
      case '555-08':
      case '555-09':
      case '555-10':
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هذا التاب قيد التطوير
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
      <UnifiedTabsSidebar
        tabs={TABS_CONFIG}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <ScrollArea className="h-full">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ContractorsRelations_Complete_555;
