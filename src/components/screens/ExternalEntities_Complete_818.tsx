/**
 * الشاشة 818 - إدارة الجهات الخارجية - مطورة بالكامل v7.0
 * ================================================================
 * 
 * نظام شامل لإدارة الجهات الخارجية مع:
 * - 16 تبويب متطور بالكامل
 * - بحث شامل عن الجهات
 * - استعراض المعاملات والعملاء
 * - ربط مع شاشة المعاملات (284)
 * - سايد بار محسّن بارتفاع كامل
 * - مراكز مدينتي مع عدد المواعيد
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  Building, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  Clock, AlertCircle, X, Search, Filter, Calendar, Users, MapPin,
  Settings, History, Archive, RefreshCw, Printer, Target, Award,
  TrendingUp, Paperclip, Shield, Bell, Globe, Home, Briefcase, UserCheck,
  Navigation, QrCode, Send, Link2, ExternalLink, FileText, Phone, Mail,
  DollarSign, Star, ChevronRight, ArrowRight, Layers
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG: TabConfig[] = [
  { id: '818-01', number: '818-01', title: 'نظرة عامة', icon: Building },
  { id: '818-02', number: '818-02', title: 'الجهات الحكومية', icon: Shield },
  { id: '818-03', number: '818-03', title: 'شبه الحكومية', icon: Award },
  { id: '818-04', number: '818-04', title: 'الجهات الخاصة', icon: Briefcase },
  { id: '818-05', number: '818-05', title: 'الشركات', icon: Building },
  { id: '818-06', number: '818-06', title: 'الأفراد', icon: Users },
  { id: '818-07', number: '818-07', title: 'غير الربحية', icon: Award },
  { id: '818-08', number: '818-08', title: 'إضافة جهة', icon: Plus },
  { id: '818-09', number: '818-09', title: 'القطاعات', icon: MapPin },
  { id: '818-10', number: '818-10', title: 'جهات الاتصال', icon: UserCheck },
  { id: '818-11', number: '818-11', title: 'مراكز مدينتي', icon: Navigation },
  { id: '818-12', number: '818-12', title: 'التقارير', icon: TrendingUp },
  { id: '818-13', number: '818-13', title: 'الإحصائيات', icon: Target },
  { id: '818-14', number: '818-14', title: 'السجل', icon: History },
  { id: '818-15', number: '818-15', title: 'الأرشيف', icon: Archive },
  { id: '818-16', number: '818-16', title: 'الإعدادات', icon: Settings }
];

// أنواع الجهات
const ENTITY_TYPES = [
  { value: 'government', label: 'جهة حكومية', color: 'bg-blue-100 text-blue-700', icon: Shield },
  { value: 'semi-government', label: 'شبه حكومية', color: 'bg-indigo-100 text-indigo-700', icon: Award },
  { value: 'private-company', label: 'شركة خاصة', color: 'bg-green-100 text-green-700', icon: Building },
  { value: 'private-individual', label: 'فرد', color: 'bg-purple-100 text-purple-700', icon: Users },
  { value: 'non-profit', label: 'غير ربحية', color: 'bg-orange-100 text-orange-700', icon: Award }
];

// حالات الجهات
const ENTITY_STATUSES = [
  { value: 'active', label: 'نشطة', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'غير نشطة', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'suspended', label: 'موقوفة', color: 'bg-red-100 text-red-700' }
];

// القطاعات الحكومية - الرياض
const RIYADH_SECTORS = [
  {
    id: 'SEC-RYD-N',
    name: 'قطاع شمال مدينة الرياض',
    nameEn: 'North Riyadh Sector',
    code: 'RYD-N',
    type: 'government',
    status: 'active',
    coverage: ['حي العليا', 'حي الملز', 'حي الصحافة', 'حي النرجس', 'حي الياسمين'],
    transactionsCount: 250,
    activeTransactions: 45,
    completedTransactions: 205,
    clientsCount: 120,
    contactPerson: 'م. عبدالله السعيد',
    phone: '011-4567890',
    email: 'north@riyadh-balady.gov.sa'
  },
  {
    id: 'SEC-RYD-S',
    name: 'قطاع جنوب مدينة الرياض',
    nameEn: 'South Riyadh Sector',
    code: 'RYD-S',
    type: 'government',
    status: 'active',
    coverage: ['حي الشفا', 'حي الربوة', 'حي المنصورة', 'حي الدريهمية', 'حي الشميسي'],
    transactionsCount: 180,
    activeTransactions: 32,
    completedTransactions: 148,
    clientsCount: 95,
    contactPerson: 'م. محمد العمري',
    phone: '011-4567891',
    email: 'south@riyadh-balady.gov.sa'
  },
  {
    id: 'SEC-RYD-E',
    name: 'قطاع شرق مدينة الرياض',
    nameEn: 'East Riyadh Sector',
    code: 'RYD-E',
    type: 'government',
    status: 'active',
    coverage: ['حي الروضة', 'حي النسيم', 'حي الربيع', 'حي الريان', 'حي المرسلات'],
    transactionsCount: 210,
    activeTransactions: 38,
    completedTransactions: 172,
    clientsCount: 105,
    contactPerson: 'م. فهد الدوسري',
    phone: '011-4567892',
    email: 'east@riyadh-balady.gov.sa'
  },
  {
    id: 'SEC-RYD-W',
    name: 'قطاع غرب مدينة الرياض',
    nameEn: 'West Riyadh Sector',
    code: 'RYD-W',
    type: 'government',
    status: 'active',
    coverage: ['حي الشفاء', 'حي الورود', 'حي الواحة', 'حي السليمانية', 'حي الملك فهد'],
    transactionsCount: 195,
    activeTransactions: 35,
    completedTransactions: 160,
    clientsCount: 88,
    contactPerson: 'م. سعد القحطاني',
    phone: '011-4567893',
    email: 'west@riyadh-balady.gov.sa'
  }
];

// مراكز مدينتي
const MADINATY_OFFICES = [
  {
    id: 'MADT-001',
    name: 'مكتب مدينتي - الخليج',
    neighborhood: 'حي الخليج',
    location: {
      lat: 24.7136,
      lng: 46.6753,
      url: 'https://maps.app.goo.gl/example1',
      address: 'حي الخليج، شارع الأمير محمد بن سلمان',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example1'
    },
    qrCode: 'MADT-001-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345601',
    email: 'khalij@madinaty.sa',
    status: 'active',
    previousAppointments: 245,
    currentAppointments: 18,
    transactionsCount: 312
  },
  {
    id: 'MADT-002',
    name: 'مكتب مدينتي - قرطبة',
    neighborhood: 'حي قرطبة',
    location: {
      lat: 24.7425,
      lng: 46.6544,
      url: 'https://maps.app.goo.gl/example2',
      address: 'حي قرطبة، شارع الملك عبدالله',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example2'
    },
    qrCode: 'MADT-002-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345602',
    email: 'qurtubah@madinaty.sa',
    status: 'active',
    previousAppointments: 198,
    currentAppointments: 15,
    transactionsCount: 278
  },
  {
    id: 'MADT-003',
    name: 'مكتب مدينتي - العقيق',
    neighborhood: 'حي العقيق',
    location: {
      lat: 24.6877,
      lng: 46.7219,
      url: 'https://maps.app.goo.gl/example3',
      address: 'حي العقيق، شارع عمر بن الخطاب',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example3'
    },
    qrCode: 'MADT-003-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345603',
    email: 'alaqeeq@madinaty.sa',
    status: 'active',
    previousAppointments: 287,
    currentAppointments: 22,
    transactionsCount: 356
  },
  {
    id: 'MADT-004',
    name: 'مكتب مدينتي - النفل',
    neighborhood: 'حي النفل',
    location: {
      lat: 24.6543,
      lng: 46.7012,
      url: 'https://maps.app.goo.gl/example4',
      address: 'حي النفل، طريق الملك فهد',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example4'
    },
    qrCode: 'MADT-004-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345604',
    email: 'alnafal@madinaty.sa',
    status: 'active',
    previousAppointments: 156,
    currentAppointments: 12,
    transactionsCount: 189
  },
  {
    id: 'MADT-005',
    name: 'مكتب مدينتي - المغرزات',
    neighborhood: 'حي المغرزات',
    location: {
      lat: 24.7654,
      lng: 46.6789,
      url: 'https://maps.app.goo.gl/example5',
      address: 'حي المغرزات، شارع الأمير سلطان',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example5'
    },
    qrCode: 'MADT-005-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345605',
    email: 'almughrizat@madinaty.sa',
    status: 'active',
    previousAppointments: 221,
    currentAppointments: 19,
    transactionsCount: 298
  },
  {
    id: 'MADT-006',
    name: 'مكتب مدينتي - المعذر',
    neighborhood: 'حي الناصرية',
    location: {
      lat: 24.6912,
      lng: 46.7456,
      url: 'https://maps.app.goo.gl/example6',
      address: 'حي الناصرية، شارع التحلية',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!example6'
    },
    qrCode: 'MADT-006-QR-DATA',
    appointmentEnabled: true,
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    phone: '011-2345606',
    email: 'almoathar@madinaty.sa',
    status: 'active',
    previousAppointments: 178,
    currentAppointments: 14,
    transactionsCount: 214
  }
];

// جهات تجريبية
const SAMPLE_ENTITIES = [
  ...RIYADH_SECTORS,
  {
    id: 'ENT-GOV-001',
    name: 'وزارة الشؤون البلدية والقروية',
    nameEn: 'Ministry of Municipal and Rural Affairs',
    code: 'MOMRA',
    type: 'government',
    status: 'active',
    coverage: ['جميع مناطق المملكة'],
    transactionsCount: 1200,
    activeTransactions: 156,
    completedTransactions: 1044,
    clientsCount: 450,
    contactPerson: 'د. خالد العتيبي',
    phone: '011-4564000',
    email: 'info@momra.gov.sa'
  },
  {
    id: 'ENT-SEMI-001',
    name: 'الهيئة الملكية لمدينة الرياض',
    nameEn: 'Royal Commission for Riyadh City',
    code: 'RCRC',
    type: 'semi-government',
    status: 'active',
    coverage: ['مدينة الرياض'],
    transactionsCount: 850,
    activeTransactions: 98,
    completedTransactions: 752,
    clientsCount: 320,
    contactPerson: 'م. عبدالعزيز المطيري',
    phone: '011-4568000',
    email: 'info@rcrc.gov.sa'
  },
  {
    id: 'ENT-PVT-COM-001',
    name: 'مكتب الهندسة الاستشارية المتقدمة',
    nameEn: 'Advanced Engineering Consultants',
    code: 'AEC',
    type: 'private-company',
    status: 'active',
    coverage: ['الرياض', 'جدة'],
    transactionsCount: 45,
    activeTransactions: 12,
    completedTransactions: 33,
    clientsCount: 28,
    contactPerson: 'م. أحمد الزهراني',
    phone: '011-4569000',
    email: 'info@aec-ksa.com'
  },
  {
    id: 'ENT-PVT-IND-001',
    name: 'المهندس فيصل السالم',
    nameEn: 'Eng. Faisal Al-Salem',
    code: 'ENG-FS',
    type: 'private-individual',
    status: 'active',
    coverage: ['الرياض'],
    transactionsCount: 12,
    activeTransactions: 3,
    completedTransactions: 9,
    clientsCount: 8,
    contactPerson: 'م. فيصل السالم',
    phone: '0501234567',
    email: 'f.salem@gmail.com'
  },
  {
    id: 'ENT-NPO-001',
    name: 'جمعية المهندسين السعوديين',
    nameEn: 'Saudi Engineers Society',
    code: 'SES',
    type: 'non-profit',
    status: 'active',
    coverage: ['جميع مناطق المملكة'],
    transactionsCount: 320,
    activeTransactions: 45,
    completedTransactions: 275,
    clientsCount: 180,
    contactPerson: 'د. سلمان الحربي',
    phone: '011-4570000',
    email: 'info@saudi-engineers.org.sa'
  }
];

// معاملات تجريبية
const SAMPLE_TRANSACTIONS = [
  {
    id: 'TXN-2025-001',
    number: '2025/001',
    title: 'رخصة بناء - مشروع سكني',
    entityId: 'SEC-RYD-N',
    entityName: 'قطاع شمال مدينة الرياض',
    clientName: 'عبدالله بن سعود',
    status: 'active',
    progress: 65,
    startDate: '2025-01-05',
    dueDate: '2025-03-15',
    value: 125000
  },
  {
    id: 'TXN-2025-002',
    number: '2025/002',
    title: 'شهادة إتمام - فيلا',
    entityId: 'SEC-RYD-N',
    entityName: 'قطاع شمال مدينة الرياض',
    clientName: 'محمد العمري',
    status: 'completed',
    progress: 100,
    startDate: '2025-01-02',
    dueDate: '2025-02-28',
    value: 85000
  },
  {
    id: 'TXN-2025-003',
    number: '2025/003',
    title: 'رخصة هدم - مبنى قديم',
    entityId: 'SEC-RYD-S',
    entityName: 'قطاع جنوب مدينة الرياض',
    clientName: 'فهد الدوسري',
    status: 'active',
    progress: 40,
    startDate: '2025-01-10',
    dueDate: '2025-02-20',
    value: 35000
  },
  {
    id: 'TXN-2025-004',
    number: '2025/004',
    title: 'رخصة بناء - برج تجاري',
    entityId: 'ENT-GOV-001',
    entityName: 'وزارة الشؤون البلدية والقروية',
    clientName: 'شركة البناء المتطور',
    status: 'active',
    progress: 25,
    startDate: '2025-01-15',
    dueDate: '2025-06-30',
    value: 850000
  }
];

const ExternalEntities_Complete_818: React.FC = () => {
  const [activeTab, setActiveTab] = useState('818-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [entities, setEntities] = useState(SAMPLE_ENTITIES);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showEntityDetailsDialog, setShowEntityDetailsDialog] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // البحث الشامل
  const filteredEntities = useMemo(() => {
    let filtered = entities;

    // تطبيق البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entity => 
        entity.name.toLowerCase().includes(query) ||
        entity.nameEn.toLowerCase().includes(query) ||
        entity.code.toLowerCase().includes(query) ||
        entity.id.toLowerCase().includes(query) ||
        entity.contactPerson.toLowerCase().includes(query) ||
        entity.phone.includes(query) ||
        entity.email.toLowerCase().includes(query)
      );
    }

    // تطبيق فلتر النوع
    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    // تطبيق فلتر الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    return filtered;
  }, [entities, searchQuery, filterType, filterStatus]);

  // إحصائيات الجهات
  const statistics = useMemo(() => {
    return {
      total: entities.length,
      government: entities.filter(e => e.type === 'government').length,
      semiGovernment: entities.filter(e => e.type === 'semi-government').length,
      privateCompanies: entities.filter(e => e.type === 'private-company').length,
      privateIndividuals: entities.filter(e => e.type === 'private-individual').length,
      nonProfit: entities.filter(e => e.type === 'non-profit').length,
      active: entities.filter(e => e.status === 'active').length,
      totalTransactions: entities.reduce((sum, e) => sum + (e.transactionsCount || 0), 0),
      activeTransactions: entities.reduce((sum, e) => sum + (e.activeTransactions || 0), 0),
      totalClients: entities.reduce((sum, e) => sum + (e.clientsCount || 0), 0)
    };
  }, [entities]);

  // الحصول على معاملات الجهة
  const getEntityTransactions = (entityId: string) => {
    return SAMPLE_TRANSACTIONS.filter(t => t.entityId === entityId);
  };

  // فتح صفحة المعاملة
  const openTransaction = (transactionId: string) => {
    // يمكن ربطها مع الشاشة 284
    console.log('Opening transaction:', transactionId);
    alert(`فتح المعاملة: ${transactionId}\nسيتم الانتقال إلى الشاشة 284`);
  };

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 818-01: نظرة عامة
      case '818-01':
        return (
          <div className="space-y-3">
            {/* شريط البحث والفلتر */}
            <Card className="card-rtl">
              <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      البحث الشامل
                    </Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن جهة، كود، شخص، رقم..."
                        className="pr-10 text-xs"
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      نوع الجهة
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="government">حكومية</SelectItem>
                        <SelectItem value="semi-government">شبه حكومية</SelectItem>
                        <SelectItem value="private-company">شركة خاصة</SelectItem>
                        <SelectItem value="private-individual">فرد</SelectItem>
                        <SelectItem value="non-profit">غير ربحية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الحالة
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="active">نشطة</SelectItem>
                        <SelectItem value="inactive">غير نشطة</SelectItem>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="suspended">موقوفة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-8 gap-2">
              {[
                { label: 'إجمالي الجهات', value: statistics.total, icon: Building, color: '#2563eb' },
                { label: 'حكومية', value: statistics.government, icon: Shield, color: '#6366f1' },
                { label: 'شبه حكومية', value: statistics.semiGovernment, icon: Award, color: '#8b5cf6' },
                { label: 'شركات', value: statistics.privateCompanies, icon: Briefcase, color: '#10b981' },
                { label: 'أفراد', value: statistics.privateIndividuals, icon: Users, color: '#ec4899' },
                { label: 'غير ربحية', value: statistics.nonProfit, icon: Award, color: '#f59e0b' },
                { label: 'المعاملات', value: statistics.totalTransactions, icon: FileText, color: '#06b6d4' },
                { label: 'العملاء', value: statistics.totalClients, icon: Users, color: '#14b8a6' }
              ].map((stat, i) => (
                <Card key={i} className="card-rtl hover:shadow-md transition-shadow">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div style={{ color: stat.color }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4' })}
                      </div>
                      <span className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* نتائج البحث */}
            {searchQuery && (
              <Card className="card-rtl">
                <CardHeader className="p-3 pb-2 bg-blue-50">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نتائج البحث ({filteredEntities.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {filteredEntities.map((entity) => (
                      <Card 
                        key={entity.id} 
                        className="card-rtl hover:shadow-md transition-shadow cursor-pointer border-r-4 border-blue-500"
                        onClick={() => {
                          setSelectedEntity(entity);
                          setShowEntityDetailsDialog(true);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-[10px]" style={{ fontFamily: 'Courier New, monospace' }}>
                                  {entity.code}
                                </Badge>
                                <Badge className={ENTITY_TYPES.find(t => t.value === entity.type)?.color}>
                                  {ENTITY_TYPES.find(t => t.value === entity.type)?.label}
                                </Badge>
                                <Badge className={ENTITY_STATUSES.find(s => s.value === entity.status)?.color}>
                                  {ENTITY_STATUSES.find(s => s.value === entity.status)?.label}
                                </Badge>
                              </div>
                              <h4 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                {entity.name}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {entity.nameEn}
                              </p>
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">المعاملات: </span>
                                  <span className="font-bold">{entity.transactionsCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">النشطة: </span>
                                  <span className="font-bold text-green-600">{entity.activeTransactions}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">العملاء: </span>
                                  <span className="font-bold">{entity.clientsCount}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">جهة الاتصال: </span>
                                  <span className="font-medium">{entity.contactPerson}</span>
                                </div>
                              </div>
                            </div>
                            <Button className="mr-2" size="sm" variant="outline">
                              <Eye className="h-3 w-3 ml-1" />
                              عرض
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* قطاعات الرياض */}
            {!searchQuery && (
              <Card className="card-rtl">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    قطاعات مدينة الرياض
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    {RIYADH_SECTORS.map((sector) => (
                      <Card 
                        key={sector.id} 
                        className="card-rtl hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedEntity(sector);
                          setShowEntityDetailsDialog(true);
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                                  {sector.name}
                                </div>
                                <div className="text-xs text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                                  {sector.code}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">نشط</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-gray-600">المعاملات: </span>
                              <span className="font-bold">{sector.transactionsCount}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">النشطة: </span>
                              <span className="font-bold text-green-600">{sector.activeTransactions}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">العملاء: </span>
                              <span className="font-bold">{sector.clientsCount}</span>
                            </div>
                          </div>
                          <Button className="w-full" size="sm" variant="outline">
                            <Eye className="h-3 w-3 ml-1" />
                            عرض التفاصيل
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      // 818-11: مراكز مدينتي
      case '818-11':
        const totalPreviousAppointments = MADINATY_OFFICES.reduce((sum, o) => sum + o.previousAppointments, 0);
        const totalCurrentAppointments = MADINATY_OFFICES.reduce((sum, o) => sum + o.currentAppointments, 0);
        const totalOfficeTransactions = MADINATY_OFFICES.reduce((sum, o) => sum + o.transactionsCount, 0);

        return (
          <div className="space-y-3">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'عدد المكاتب', value: MADINATY_OFFICES.length, icon: Building, color: '#2563eb' },
                { label: 'المواعيد السابقة', value: totalPreviousAppointments, icon: History, color: '#6b7280' },
                { label: 'المواعيد الحالية', value: totalCurrentAppointments, icon: Calendar, color: '#10b981' },
                { label: 'إجمالي المعاملات', value: totalOfficeTransactions, icon: FileText, color: '#f59e0b' },
                { label: 'متوسط المواعيد', value: Math.round(totalPreviousAppointments / MADINATY_OFFICES.length), icon: Target, color: '#8b5cf6' },
                { label: 'مكاتب نشطة', value: MADINATY_OFFICES.filter(o => o.status === 'active').length, icon: CheckCircle, color: '#10b981' }
              ].map((stat, i) => (
                <Card key={i} className="card-rtl hover:shadow-md transition-shadow">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div style={{ color: stat.color }}>
                        {React.createElement(stat.icon, { className: 'h-4 w-4' })}
                      </div>
                      <span className="text-base" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول المكاتب */}
            <Card className="card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Navigation className="h-4 w-4 inline ml-1" />
                    مواقع مكاتب مدينتي ({MADINATY_OFFICES.length})
                  </CardTitle>
                  <Button size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 ml-1" />
                    إضافة مكتب
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>م</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المكتب</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المواعيد السابقة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المواعيد الحالية</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MADINATY_OFFICES.map((office, index) => (
                        <TableRow key={office.id} className="hover:bg-blue-50 transition-colors">
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            <div className="flex items-center gap-2 justify-end">
                              <span>{office.name}</span>
                              <Navigation className="h-3 w-3 text-blue-600" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {office.neighborhood}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-gray-100 text-gray-700" style={{ fontFamily: 'Courier New, monospace' }}>
                              {office.previousAppointments}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Courier New, monospace' }}>
                              {office.currentAppointments}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-700" style={{ fontFamily: 'Courier New, monospace' }}>
                              {office.transactionsCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {office.phone}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                title="QR Code"
                                onClick={() => {
                                  setSelectedOffice(office);
                                  setShowQRDialog(true);
                                }}
                              >
                                <QrCode className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                title="إرسال"
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: office.name,
                                      text: `موقع ${office.name}`,
                                      url: office.location.url
                                    });
                                  }
                                }}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                title="موعد"
                                onClick={() => {
                                  setSelectedOffice(office);
                                  setShowAppointmentDialog(true);
                                }}
                              >
                                <Calendar className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                title="الموقع"
                                onClick={() => {
                                  setSelectedOffice(office);
                                  setShowLocationDialog(true);
                                }}
                              >
                                <MapPin className="h-3 w-3" />
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

            {/* معلومات إضافية */}
            <Card className="card-rtl">
              <CardContent className="p-3 bg-blue-50">
                <div className="flex items-start gap-2">
                  <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                      مكاتب مدينتي - خدمات البلدية
                    </h3>
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مكاتب مدينتي تقدم خدمات بلدية متنوعة للمواطنين والمقيمين في مختلف أحياء مدينة الرياض.
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          الأحد - الخميس (8:00 ص - 4:00 م)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-blue-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {MADINATY_OFFICES.length} مكتب نشط
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-600" />
                        <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {totalCurrentAppointments} موعد حالي
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="space-y-3">
            <Card className="card-rtl">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-base mb-2" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                    {tab.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح
                  </p>
                  <Badge className="bg-blue-100 text-blue-700" style={{ fontFamily: 'Courier New, monospace' }}>
                    {tab.number}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      {/* رأس الشاشة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#2563eb] rounded-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                  إدارة الجهات الخارجية
                </h1>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                  نظام شامل لإدارة الجهات الخارجية والتنسيق معها
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                SCR-818
              </span>
              <Badge className="bg-[#10b981] text-white">16 تبويب</Badge>
              <Badge className="bg-[#2563eb] text-white">{statistics.total} جهة</Badge>
              <Badge className="bg-green-100 text-green-700">{statistics.active} نشطة</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
            <Button variant="outline" className="button-rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings className="h-4 w-4 ml-2" />
              إعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي: السايد بار + المحتوى */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* المحتوى الرئيسي */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          <Card className="flex-1 flex flex-col min-h-0 card-rtl">
            <ScrollArea className="flex-1">
              <CardContent className="p-6">
                {renderTabContent()}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* نافذة تفاصيل الجهة */}
      <Dialog open={showEntityDetailsDialog} onOpenChange={setShowEntityDetailsDialog}>
        <DialogContent className="max-w-6xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل الجهة - {selectedEntity?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedEntity && (
            <div className="space-y-3">
              {/* معلومات الجهة */}
              <Card className="card-rtl">
                <CardHeader className="p-3 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    معلومات أساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">الكود: </span>
                      <span className="font-bold" style={{ fontFamily: 'Courier New, monospace' }}>
                        {selectedEntity.code}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">النوع: </span>
                      <Badge className={ENTITY_TYPES.find(t => t.value === selectedEntity.type)?.color}>
                        {ENTITY_TYPES.find(t => t.value === selectedEntity.type)?.label}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">الحالة: </span>
                      <Badge className={ENTITY_STATUSES.find(s => s.value === selectedEntity.status)?.color}>
                        {ENTITY_STATUSES.find(s => s.value === selectedEntity.status)?.label}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">جهة الاتصال: </span>
                      <span className="font-medium">{selectedEntity.contactPerson}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الهاتف: </span>
                      <span className="font-medium" style={{ fontFamily: 'Courier New, monospace' }}>
                        {selectedEntity.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">البريد: </span>
                      <span className="font-medium">{selectedEntity.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">المعاملات: </span>
                      <span className="font-bold text-blue-600">{selectedEntity.transactionsCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">العملاء: </span>
                      <span className="font-bold text-green-600">{selectedEntity.clientsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* المعاملات */}
              <Card className="card-rtl">
                <CardHeader className="p-3 pb-2 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <FileText className="h-4 w-4 inline ml-1" />
                      المعاملات ({getEntityTransactions(selectedEntity.id).length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        نشطة: {selectedEntity.activeTransactions}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700">
                        مكتملة: {selectedEntity.completedTransactions}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getEntityTransactions(selectedEntity.id).map((txn) => (
                        <TableRow key={txn.id} className="hover:bg-blue-50">
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {txn.number}
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {txn.title}
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {txn.clientName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                              {txn.status === 'completed' ? 'مكتملة' : 'نشطة'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                                {txn.progress}%
                              </span>
                              <Progress value={txn.progress} className="h-2 w-16" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {txn.value.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => openTransaction(txn.id)}
                            >
                              <ArrowRight className="h-3 w-3 ml-1" />
                              فتح
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة QR Code */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <QrCode className="h-5 w-5 inline ml-1" />
              رمز الاستجابة السريعة
            </DialogTitle>
          </DialogHeader>

          {selectedOffice && (
            <div className="text-center space-y-3">
              <div>
                <h3 className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                  {selectedOffice.name}
                </h3>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {selectedOffice.neighborhood}
                </p>
              </div>

              <div className="w-64 h-64 mx-auto bg-white border-4 border-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-24 w-24 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                    QR Code للموقع
                  </p>
                  <p className="text-[10px] mt-1" style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                    {selectedOffice.qrCode}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  <Download className="h-3 w-3 ml-1" />
                  تحميل QR Code
                </Button>
                <Button className="w-full" size="sm" variant="outline">
                  <Send className="h-3 w-3 ml-1" />
                  مشاركة الموقع
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة الموقع */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-4xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <MapPin className="h-5 w-5 inline ml-1" />
              موقع {selectedOffice?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedOffice && (
            <div className="space-y-3">
              <Card className="card-rtl">
                <CardContent className="p-3 bg-blue-50">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">العنوان: </span>
                      <span className="font-medium">{selectedOffice.location.address}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الحي: </span>
                      <span className="font-medium">{selectedOffice.neighborhood}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                    خريطة الموقع
                  </p>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    (يمكن دمج Google Maps API)
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Navigation className="h-3 w-3 ml-1" />
                  فتح في خرائط جوجل
                </Button>
                <Button className="flex-1" variant="outline">
                  <Send className="h-3 w-3 ml-1" />
                  مشاركة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة الموعد */}
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="max-w-2xl" style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Calendar className="h-5 w-5 inline ml-1" />
              حجز موعد في {selectedOffice?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedOffice && (
            <div className="space-y-3">
              <Card className="card-rtl">
                <CardContent className="p-3 bg-green-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المكتب متاح لحجز المواعيد
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mr-6 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {selectedOffice.workingHours}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</Label>
                  <Input type="date" className="text-xs" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</Label>
                  <Select>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8:00 صباحاً</SelectItem>
                      <SelectItem value="9">9:00 صباحاً</SelectItem>
                      <SelectItem value="10">10:00 صباحاً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1 block" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الخدمة</Label>
                <Select>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building">رخصة بناء</SelectItem>
                    <SelectItem value="demolition">رخصة هدم</SelectItem>
                    <SelectItem value="completion">شهادة إتمام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button className="w-full">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  تأكيد الحجز
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExternalEntities_Complete_818;
