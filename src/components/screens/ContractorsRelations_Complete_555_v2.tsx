import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Users, Building2, FileText, DollarSign, Calendar, Phone, Mail,
  MapPin, Star, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle,
  Briefcase, Award, Target, BarChart3, Plus, Edit, Trash2, Eye,
  Download, Upload, FileCheck, MessageSquare, Send
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner';

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

interface Specialization {
  id: string;
  name: string;
  category: string;
  contractorsCount: number;
}

interface Contract {
  id: string;
  contractorId: string;
  contractorName: string;
  projectName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'نشط' | 'منتهي' | 'ملغي';
  terms: string;
}

interface Payment {
  id: string;
  contractorId: string;
  contractorName: string;
  projectName: string;
  amount: number;
  dueDate: string;
  paidDate: string;
  status: 'مدفوع' | 'معلق' | 'متأخر';
  method: string;
}

interface Rating {
  id: string;
  contractorId: string;
  contractorName: string;
  projectName: string;
  overallScore: number;
  qualityScore: number;
  timeScore: number;
  costScore: number;
  date: string;
  notes: string;
}

interface Communication {
  id: string;
  contractorId: string;
  contractorName: string;
  type: 'اتصال' | 'بريد' | 'اجتماع' | 'واتساب';
  subject: string;
  date: string;
  notes: string;
}

interface Document {
  id: string;
  contractorId: string;
  contractorName: string;
  type: string;
  name: string;
  uploadDate: string;
  expiryDate: string;
  status: 'ساري' | 'منتهي' | 'قريب الانتهاء';
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

  // بيانات وهمية للتخصصات
  const specializations: Specialization[] = [
    { id: 'SP001', name: 'مباني سكنية', category: 'إنشائي', contractorsCount: 12 },
    { id: 'SP002', name: 'مباني تجارية', category: 'إنشائي', contractorsCount: 8 },
    { id: 'SP003', name: 'مباني صناعية', category: 'إنشائي', contractorsCount: 5 },
    { id: 'SP004', name: 'طرق وجسور', category: 'بنية تحتية', contractorsCount: 6 },
    { id: 'SP005', name: 'كهرباء', category: 'أعمال كهروميكانيكية', contractorsCount: 10 },
    { id: 'SP006', name: 'سباكة وصحي', category: 'أعمال كهروميكانيكية', contractorsCount: 9 },
    { id: 'SP007', name: 'تكييف وتبريد', category: 'أعمال كهروميكانيكية', contractorsCount: 7 },
    { id: 'SP008', name: 'تشطيبات عامة', category: 'تشطيبات', contractorsCount: 15 },
    { id: 'SP009', name: 'صيانة وترميم', category: 'صيانة', contractorsCount: 11 },
  ];

  // بيانات وهمية للعقود
  const contracts: Contract[] = [
    {
      id: 'CONT001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      value: 5000000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'نشط',
      terms: 'عقد مقاولة عامة - الدفع على مراحل'
    },
    {
      id: 'CONT002',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      projectName: 'مشروع برج النخيل التجاري',
      value: 15000000,
      startDate: '2024-06-01',
      endDate: '2026-06-01',
      status: 'نشط',
      terms: 'عقد BOT - تسليم مفتاح'
    },
    {
      id: 'CONT003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      projectName: 'مشروع مجمع الورود السكني',
      value: 8000000,
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      status: 'نشط',
      terms: 'عقد مقاولة باطن - دفعة مقدمة 30%'
    },
  ];

  // بيانات وهمية للمدفوعات
  const payments: Payment[] = [
    {
      id: 'PAY001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      amount: 1500000,
      dueDate: '2025-01-15',
      paidDate: '2025-01-14',
      status: 'مدفوع',
      method: 'تحويل بنكي'
    },
    {
      id: 'PAY002',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      projectName: 'مشروع برج النخيل التجاري',
      amount: 4500000,
      dueDate: '2025-02-01',
      paidDate: '',
      status: 'معلق',
      method: ''
    },
    {
      id: 'PAY003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      projectName: 'مجمع الورود',
      amount: 2400000,
      dueDate: '2024-12-01',
      paidDate: '2024-12-15',
      status: 'متأخر',
      method: 'شيك'
    },
    {
      id: 'PAY004',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      amount: 2000000,
      dueDate: '2025-06-15',
      paidDate: '',
      status: 'معلق',
      method: ''
    },
  ];

  // بيانات وهمية للتقييمات
  const ratings: Rating[] = [
    {
      id: 'RAT001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      projectName: 'مشروع فلل الياسمين',
      overallScore: 4.8,
      qualityScore: 5.0,
      timeScore: 4.5,
      costScore: 5.0,
      date: '2025-10-15',
      notes: 'أداء ممتاز في الجودة والالتزام بالجدول الزمني'
    },
    {
      id: 'RAT002',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      projectName: 'مشروع برج النخيل',
      overallScore: 4.9,
      qualityScore: 5.0,
      timeScore: 4.8,
      costScore: 4.9,
      date: '2025-09-20',
      notes: 'تميز في الجودة مع التزام تام بالميزانية'
    },
    {
      id: 'RAT003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      projectName: 'مجمع الورود',
      overallScore: 4.5,
      qualityScore: 4.7,
      timeScore: 4.3,
      costScore: 4.5,
      date: '2025-08-10',
      notes: 'جودة جيدة مع بعض التأخير البسيط'
    },
  ];

  // بيانات وهمية للتواصل
  const communications: Communication[] = [
    {
      id: 'COM001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'اجتماع',
      subject: 'مناقشة مرحلة التشطيبات',
      date: '2025-11-01',
      notes: 'تم الاتفاق على مواصفات التشطيبات النهائية'
    },
    {
      id: 'COM002',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      type: 'بريد',
      subject: 'طلب تمديد فترة التنفيذ',
      date: '2025-10-28',
      notes: 'تم الموافقة على التمديد لمدة شهرين'
    },
    {
      id: 'COM003',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      type: 'اتصال',
      subject: 'متابعة سير العمل',
      date: '2025-11-02',
      notes: 'الأعمال تسير بشكل جيد'
    },
    {
      id: 'COM004',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'واتساب',
      subject: 'استفسار عن المواد',
      date: '2025-11-01',
      notes: 'تم الرد على جميع الاستفسارات'
    },
  ];

  // بيانات وهمية للمستندات
  const documents: Document[] = [
    {
      id: 'DOC001',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'رخصة مقاول',
      name: 'رخصة المقاولات - الدرجة الأولى',
      uploadDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'ساري'
    },
    {
      id: 'DOC002',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'شهادة ضريبة القيمة المضافة',
      name: 'شهادة ضريبة القيمة المضافة',
      uploadDate: '2024-06-01',
      expiryDate: '2025-06-01',
      status: 'ساري'
    },
    {
      id: 'DOC003',
      contractorId: 'CON003',
      contractorName: 'العتيبي للمقاولات العامة',
      type: 'رخصة مقاول',
      name: 'رخصة المقاولات - الدرجة الأولى',
      uploadDate: '2023-03-20',
      expiryDate: '2025-03-20',
      status: 'قريب الانتهاء'
    },
    {
      id: 'DOC004',
      contractorId: 'CON002',
      contractorName: 'مؤسسة الخالدي الإنشائية',
      type: 'سجل تجاري',
      name: 'السجل التجاري',
      uploadDate: '2023-01-10',
      expiryDate: '2024-01-10',
      status: 'منتهي'
    },
    {
      id: 'DOC005',
      contractorId: 'CON001',
      contractorName: 'شركة السعيد للمقاولات',
      type: 'تأمين المسؤولية',
      name: 'بوليصة تأمين المسؤولية المهنية',
      uploadDate: '2024-07-01',
      expiryDate: '2025-07-01',
      status: 'ساري'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط':
      case 'جاري':
      case 'ساري':
      case 'مدفوع':
        return '#10b981';
      case 'مكتمل':
        return '#2563eb';
      case 'معلق':
      case 'متأخر':
      case 'قريب الانتهاء':
        return '#f59e0b';
      case 'محظور':
      case 'ملغي':
      case 'منتهي':
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
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم حفظ المقاول بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
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
                        <div className="text-left flex flex-col items-end gap-2">
                          <Badge style={{ backgroundColor: getStatusColor(contractor.status), color: 'white' }}>
                            {contractor.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{contractor.rating}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
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
        // التصنيفات والتخصصات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة تخصص جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="اسم التخصص *"
                    id="spec-name"
                    placeholder="مثال: مباني سكنية"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="الفئة *"
                    id="category"
                    options={[
                      { value: 'construction', label: 'إنشائي' },
                      { value: 'infrastructure', label: 'بنية تحتية' },
                      { value: 'electromechanical', label: 'أعمال كهروميكانيكية' },
                      { value: 'finishing', label: 'تشطيبات' },
                      { value: 'maintenance', label: 'صيانة' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <div className="flex items-end">
                    <Button 
                      style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b', width: '100%' }}
                      onClick={() => toast.success('تم إضافة التخصص بنجاح')}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {['إنشائي', 'بنية تحتية', 'أعمال كهروميكانيكية', 'تشطيبات', 'صيانة'].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {specializations
                        .filter(s => {
                          if (category === 'إنشائي') return s.category === 'إنشائي';
                          if (category === 'بنية تحتية') return s.category === 'بنية تحتية';
                          if (category === 'أعمال كهروميكانيكية') return s.category === 'أعمال كهروميكانيكية';
                          if (category === 'تشطيبات') return s.category === 'تشطيبات';
                          if (category === 'صيانة') return s.category === 'صيانة';
                          return false;
                        })
                        .map((spec) => (
                          <div 
                            key={spec.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{spec.name}</span>
                              <Badge variant="outline">{spec.contractorsCount} مقاول</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  جميع التخصصات ({specializations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المقاولين</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specializations.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{spec.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold">{spec.name}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{spec.category}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{spec.contractorsCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
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

      case '555-04':
        // المشاريع المشتركة
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة مشروع مشترك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <InputWithCopy
                    label="اسم المشروع *"
                    id="project-name"
                    placeholder="مثال: مشروع فلل الياسمين"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="قيمة المشروع (ر.س) *"
                    id="project-value"
                    type="number"
                    placeholder="5000000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ البداية *"
                    id="start-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ النهاية *"
                    id="end-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="الحالة *"
                    id="status"
                    options={[
                      { value: 'active', label: 'جاري' },
                      { value: 'completed', label: 'مكتمل' },
                      { value: 'delayed', label: 'متأخر' },
                      { value: 'cancelled', label: 'ملغي' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="وصف المشروع"
                      id="description"
                      rows={3}
                      placeholder="تفاصيل المشروع والنطاق..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم إضافة المشروع بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة المشروع
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المشاريع المشتركة ({projects.length})
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
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.contractorName}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge style={{ backgroundColor: getStatusColor(project.status), color: 'white' }}>
                            {project.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">القيمة</p>
                          <p className="font-bold text-green-600">{(project.value / 1000000).toFixed(1)}م ر.س</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">تاريخ البداية</p>
                          <p>{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">تاريخ النهاية</p>
                          <p>{project.endDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">نسبة الإنجاز</p>
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

      case '555-05':
        // العقود والاتفاقيات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة عقد جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المشروع *"
                    id="project-name"
                    placeholder="مثال: مشروع فلل الياسمين"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="قيمة العقد (ر.س) *"
                    id="contract-value"
                    type="number"
                    placeholder="5000000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ البداية *"
                    id="start-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ النهاية *"
                    id="end-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="حالة العقد *"
                    id="status"
                    options={[
                      { value: 'active', label: 'نشط' },
                      { value: 'expired', label: 'منتهي' },
                      { value: 'cancelled', label: 'ملغي' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="شروط العقد"
                      id="terms"
                      rows={3}
                      placeholder="عقد مقاولة عامة - الدفع على مراحل..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم إضافة العقد بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة العقد
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العقود والاتفاقيات ({contracts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>البداية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النهاية</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.contractorName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.projectName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold text-green-600">
                          {(contract.value / 1000000).toFixed(1)}م ر.س
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.startDate}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{contract.endDate}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(contract.status), color: 'white' }}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
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

      case '555-06':
        // المدفوعات والمستحقات
        return (
          <div className="space-y-4">
            {/* البطاقات الإحصائية */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إجمالي المدفوعات
                      </p>
                      <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {(payments.filter(p => p.status === 'مدفوع').reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}م ر.س
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مدفوعات معلقة
                      </p>
                      <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {(payments.filter(p => p.status === 'معلق').reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}م ر.س
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مدفوعات متأخرة
                      </p>
                      <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {(payments.filter(p => p.status === 'متأخر').reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}م ر.س
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        إجمالي المستحقات
                      </p>
                      <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {(payments.reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}م ر.س
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تسجيل دفعة جديدة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المشروع *"
                    id="project-name"
                    placeholder="مثال: مشروع فلل الياسمين"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="المبلغ (ر.س) *"
                    id="amount"
                    type="number"
                    placeholder="1500000"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ الاستحقاق *"
                    id="due-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="طريقة الدفع *"
                    id="payment-method"
                    options={[
                      { value: 'bank-transfer', label: 'تحويل بنكي' },
                      { value: 'check', label: 'شيك' },
                      { value: 'cash', label: 'نقدي' },
                      { value: 'credit', label: 'آجل' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="الحالة *"
                    id="status"
                    options={[
                      { value: 'paid', label: 'مدفوع' },
                      { value: 'pending', label: 'معلق' },
                      { value: 'overdue', label: 'متأخر' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم تسجيل الدفعة بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    تسجيل الدفعة
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل المدفوعات ({payments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشروع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاستحقاق</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الدفع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الطريقة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.contractorName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.projectName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold text-green-600">
                          {(payment.amount / 1000000).toFixed(1)}م ر.س
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.dueDate}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.paidDate || '-'}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{payment.method || '-'}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(payment.status), color: 'white' }}>
                            {payment.status}
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

      case '555-07':
        // التقييمات والأداء
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة تقييم جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المشروع *"
                    id="project-name"
                    placeholder="مثال: مشروع فلل الياسمين"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تقييم الجودة (من 5) *"
                    id="quality-score"
                    type="number"
                    placeholder="5.0"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تقييم الوقت (من 5) *"
                    id="time-score"
                    type="number"
                    placeholder="4.5"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تقييم التكلفة (من 5) *"
                    id="cost-score"
                    type="number"
                    placeholder="5.0"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="التاريخ *"
                    id="date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="ملاحظات"
                      id="notes"
                      rows={3}
                      placeholder="ملاحظات حول الأداء..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم إضافة التقييم بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة التقييم
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل التقييمات ({ratings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div 
                      key={rating.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{rating.contractorName}</h3>
                          <p className="text-sm text-gray-600">{rating.projectName}</p>
                          <p className="text-xs text-gray-500 mt-1">{rating.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-2xl font-bold">{rating.overallScore}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 text-xs">الجودة</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-blue-600 fill-blue-600" />
                            <span className="font-bold text-blue-600">{rating.qualityScore}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-gray-600 text-xs">الوقت</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-4 w-4 text-green-600 fill-green-600" />
                            <span className="font-bold text-green-600">{rating.timeScore}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="text-gray-600 text-xs">التكلفة</p>
                          <div className="flex items-center gap-1 mt-1">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            <span className="font-bold text-amber-600">{rating.costScore}</span>
                          </div>
                        </div>
                      </div>
                      {rating.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">{rating.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '555-08':
        // التواصل والملاحظات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إضافة سجل تواصل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع التواصل *"
                    id="type"
                    options={[
                      { value: 'call', label: 'اتصال' },
                      { value: 'email', label: 'بريد' },
                      { value: 'meeting', label: 'اجتماع' },
                      { value: 'whatsapp', label: 'واتساب' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="الموضوع *"
                    id="subject"
                    placeholder="مثال: مناقشة مرحلة التشطيبات"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="التاريخ *"
                    id="date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <TextAreaWithCopy
                      label="الملاحظات"
                      id="notes"
                      rows={3}
                      placeholder="تفاصيل التواصل..."
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم إضافة السجل بنجاح')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة السجل
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سجل التواصل ({communications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموضوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الملاحظات</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.contractorName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{comm.type}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold">{comm.subject}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{comm.date}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="text-xs">{comm.notes}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Send className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
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

      case '555-09':
        // المستندات والشهادات
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  رفع مستند جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <SelectWithCopy
                    label="المقاول *"
                    id="contractor"
                    options={contractors.map(c => ({ value: c.id, label: c.companyName }))}
                    copyable={true}
                    clearable={true}
                  />
                  <SelectWithCopy
                    label="نوع المستند *"
                    id="doc-type"
                    options={[
                      { value: 'license', label: 'رخصة مقاول' },
                      { value: 'vat', label: 'شهادة ضريبة القيمة المضافة' },
                      { value: 'commercial', label: 'سجل تجاري' },
                      { value: 'insurance', label: 'تأمين المسؤولية' },
                      { value: 'certificate', label: 'شهادات أخرى' },
                    ]}
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="اسم المستند *"
                    id="doc-name"
                    placeholder="مثال: رخصة المقاولات - الدرجة الأولى"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label="تاريخ الانتهاء *"
                    id="expiry-date"
                    type="date"
                    copyable={true}
                    clearable={true}
                  />
                  <div className="col-span-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اسحب وأفلت الملف هنا أو اضغط للتصفح
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.success('تم رفع المستند بنجاح')}
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    رفع المستند
                  </Button>
                  <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        مستندات سارية
                      </p>
                      <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {documents.filter(d => d.status === 'ساري').length}
                      </p>
                    </div>
                    <FileCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        قريبة الانتهاء
                      </p>
                      <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {documents.filter(d => d.status === 'قريب الانتهاء').length}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        منتهية
                      </p>
                      <p className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {documents.filter(d => d.status === 'منتهي').length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المستندات والشهادات ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقاول</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المستند</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الرفع</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الانتهاء</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.id}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.contractorName}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }} className="font-bold">{doc.name}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.uploadDate}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>{doc.expiryDate}</TableCell>
                        <TableCell style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <Badge style={{ backgroundColor: getStatusColor(doc.status), color: 'white' }}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
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

      case '555-10':
        // التقارير
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير المقاولين الشامل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير شامل بجميع المقاولين وتفاصيلهم الكاملة
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل PDF
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير المشاريع المشتركة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير بجميع المشاريع ونسب الإنجاز
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل PDF
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير المدفوعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير شامل بجميع المدفوعات والمستحقات
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل PDF
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير التقييمات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير تفصيلي بتقييمات الأداء
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل PDF
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير المستندات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير بجميع المستندات وحالاتها
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل PDF
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                      onClick={() => toast.success('جاري إعداد التقرير...')}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تحميل Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تقرير مخصص
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إنشاء تقرير مخصص حسب معايير محددة
                  </p>
                  <Button 
                    className="w-full" 
                    style={{ fontFamily: 'Tajawal, sans-serif', background: '#f59e0b' }}
                    onClick={() => toast.info('قريباً...')}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء تقرير مخصص
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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
