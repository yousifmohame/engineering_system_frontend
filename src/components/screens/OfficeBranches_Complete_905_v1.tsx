/**
 * الشاشة 905 - إدارة فروع المكتب v1.5 ALL TABS COMPLETE
 * =====================================================
 * 
 * شاشة شاملة لإدارة المقر الرئيسي والفروع مع جميع التفاصيل
 * جميع التابات العشرة مطورة بالكامل
 * 
 * @version 1.5 ALL TABS COMPLETE
 * @date نوفمبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { Label } from '../ui/label';
import {
  Building2, MapPin, Users, DollarSign, FileText, Zap,
  CheckCircle, Plus, Edit, Eye, Key, Activity, BarChart3, Building,
  Phone, Calendar, Receipt, CreditCard, Save, X, Trash2,
  Send, Mail, MessageSquare, Globe, Share2, Copy, Download, QrCode
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';

// تكوين التابات
const TABS_CONFIG: TabConfig[] = [
  { id: '905-01', number: '905-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '905-02', number: '905-02', title: 'المقر الرئيسي', icon: Building2 },
  { id: '905-03', number: '905-03', title: 'قائمة الفروع', icon: Building },
  { id: '905-04', number: '905-04', title: 'الإدارة والموظفين', icon: Users },
  { id: '905-05', number: '905-05', title: 'الملكية والإيجار', icon: Key },
  { id: '905-06', number: '905-06', title: 'الخدمات والمرافق', icon: Zap },
  { id: '905-07', number: '905-07', title: 'الالتزامات المالية', icon: DollarSign },
  { id: '905-08', number: '905-08', title: 'المراسلات والإشعارات', icon: FileText },
  { id: '905-09', number: '905-09', title: 'الموقع والعنوان', icon: MapPin },
  { id: '905-10', number: '905-10', title: 'المستندات والعقود', icon: FileText },
];

interface PaymentRecord {
  id: string;
  branchId: string;
  serviceType: string; // كهرباء، ماء، هاتف، إنترنت، إيجار، صرف صحي
  invoiceNumber: string;
  billPeriod: string; // مثلاً: "يناير 2025"
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  paidBy: string;
  notes: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  attachments?: string[];
}

interface Branch {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  type: string;
  isActive: boolean;
  establishedDate: string;
  currentEmployees: number;
  projectedEmployees: number;
  maxCapacity: number;
  ownershipType: string;
  management: {
    generalManager: { name: string; phone: string; email: string };
    executiveManager: { name: string; phone: string; email: string };
    deputyManager: { name: string; phone: string; email: string };
  };
  owner?: {
    name: string;
    phone: string;
    email: string;
    representativeName?: string;
  };
  leaseContract?: {
    contractNumber: string;
    monthlyRent: number;
    startDate: string;
    endDate: string;
    isRenewable: boolean;
  };
  building: {
    name: string;
    totalArea: number;
  };
  utilities: {
    electricity: { provider: string; monthlyAverage: number };
    water: { provider: string; monthlyAverage: number };
    phone: { provider: string; numbers: string[] };
    internet: { provider: string; speed: string };
  };
  location: {
    nationalAddress: {
      city: string;
      district: string;
      streetName: string;
      buildingNumber: string;
      postalCode: string;
      shortAddress: string;
    };
    qrCode: string;
    googleMapsLink: string;
  };
  statistics: {
    totalNotifications: number;
    pendingPayments: number;
    upcomingRenewals: number;
    maintenanceRequests: number;
  };
}

const mainHeadquarters: Branch = {
  id: 'HQ-001',
  code: 'HQ-RYD-001',
  name: 'المقر الرئيسي - الرياض',
  nameEn: 'Main Headquarters - Riyadh',
  type: 'مقر رئيسي',
  isActive: true,
  establishedDate: '2018-01-15',
  currentEmployees: 45,
  projectedEmployees: 60,
  maxCapacity: 75,
  ownershipType: 'مؤجر',
  management: {
    generalManager: { name: 'م. عبدالله بن محمد السالم', phone: '+966 50 123 4567', email: 'ceo@office.sa' },
    executiveManager: { name: 'م. سارة بنت أحمد المطيري', phone: '+966 50 234 5678', email: 'exec@office.sa' },
    deputyManager: { name: 'م. خالد بن عبدالعزيز العتيبي', phone: '+966 50 345 6789', email: 'deputy@office.sa' }
  },
  owner: {
    name: 'شركة الأملاك العقارية المحدودة',
    phone: '+966 11 456 7890',
    email: 'info@realestate.sa',
    representativeName: 'أحمد بن سعد الغامدي'
  },
  leaseContract: {
    contractNumber: 'LEASE-2023-001',
    monthlyRent: 85000,
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    isRenewable: true
  },
  building: { name: 'برج الأعمال الدولي', totalArea: 850 },
  utilities: {
    electricity: { provider: 'الشركة السعودية للكهرباء', monthlyAverage: 12500 },
    water: { provider: 'شركة المياه الوطنية', monthlyAverage: 3200 },
    phone: { provider: 'STC', numbers: ['+966 11 234 5678', '+966 11 234 5679'] },
    internet: { provider: 'STC Business', speed: '500 Mbps' }
  },
  location: {
    nationalAddress: {
      city: 'الرياض',
      district: 'العليا',
      streetName: 'طريق الملك فهد',
      buildingNumber: '7250',
      postalCode: '12211',
      shortAddress: '7250 طريق الملك فهد، العليا 12211'
    },
    qrCode: 'QR-HQ-RYD-001',
    googleMapsLink: 'https://maps.google.com/?q=24.7136,46.6753'
  },
  statistics: { totalNotifications: 24, pendingPayments: 2, upcomingRenewals: 1, maintenanceRequests: 3 }
};

const branches: Branch[] = [
  {
    id: 'BR-001',
    code: 'BR-JED-001',
    name: 'فرع جدة - الرئيسي',
    nameEn: 'Jeddah Main Branch',
    type: 'فرع',
    isActive: true,
    establishedDate: '2019-06-01',
    currentEmployees: 28,
    projectedEmployees: 35,
    maxCapacity: 45,
    ownershipType: 'مؤجر',
    management: {
      generalManager: { name: 'م. فهد بن صالح الزهراني', phone: '+966 50 567 8901', email: 'jeddah.gm@office.sa' },
      executiveManager: { name: 'م. نورة بنت ناصر الحربي', phone: '+966 50 678 9012', email: 'jeddah.exec@office.sa' },
      deputyManager: { name: 'م. عمر بن حسن القحطاني', phone: '+966 50 789 0123', email: 'jeddah.deputy@office.sa' }
    },
    owner: { name: 'مؤسسة الأبراج التجارية', phone: '+966 12 345 6789', email: 'info@towers.sa' },
    leaseContract: {
      contractNumber: 'LEASE-2024-002',
      monthlyRent: 55000,
      startDate: '2024-01-01',
      endDate: '2027-12-31',
      isRenewable: true
    },
    building: { name: 'مركز الأعمال الغربي', totalArea: 520 },
    utilities: {
      electricity: { provider: 'الشركة السعودية للكهرباء', monthlyAverage: 8500 },
      water: { provider: 'شركة المياه الوطنية', monthlyAverage: 2100 },
      phone: { provider: 'Mobily', numbers: ['+966 12 345 6789'] },
      internet: { provider: 'Mobily Business', speed: '300 Mbps' }
    },
    location: {
      nationalAddress: {
        city: 'جدة',
        district: 'الزهراء',
        streetName: 'شارع الأمير سلطان',
        buildingNumber: '8520',
        postalCode: '23425',
        shortAddress: '8520 شارع الأمير سلطان، الزهراء 23425'
      },
      qrCode: 'QR-BR-JED-001',
      googleMapsLink: 'https://maps.google.com/?q=21.5433,39.1728'
    },
    statistics: { totalNotifications: 15, pendingPayments: 1, upcomingRenewals: 0, maintenanceRequests: 2 }
  },
  {
    id: 'BR-002',
    code: 'BR-DMM-001',
    name: 'فرع الدمام',
    nameEn: 'Dammam Branch',
    type: 'فرع',
    isActive: true,
    establishedDate: '2020-09-15',
    currentEmployees: 18,
    projectedEmployees: 25,
    maxCapacity: 32,
    ownershipType: 'مؤجر',
    management: {
      generalManager: { name: 'م. سعد بن علي الدوسري', phone: '+966 50 890 1234', email: 'dammam.gm@office.sa' },
      executiveManager: { name: 'م. هند بنت فهد العجمي', phone: '+966 50 901 2345', email: 'dammam.exec@office.sa' },
      deputyManager: { name: 'م. طارق بن محمد الشهري', phone: '+966 50 012 3456', email: 'dammam.deputy@office.sa' }
    },
    owner: { name: 'شركة الشرقية للاستثمار العقاري', phone: '+966 13 234 5678', email: 'info@eastern-re.sa' },
    leaseContract: {
      contractNumber: 'LEASE-2024-003',
      monthlyRent: 38000,
      startDate: '2024-03-01',
      endDate: '2028-02-29',
      isRenewable: true
    },
    building: { name: 'برج الشرقية للأعمال', totalArea: 380 },
    utilities: {
      electricity: { provider: 'الشركة السعودية للكهرباء', monthlyAverage: 6200 },
      water: { provider: 'شركة المياه الوطنية', monthlyAverage: 1500 },
      phone: { provider: 'Zain', numbers: ['+966 13 456 7890'] },
      internet: { provider: 'Zain Business', speed: '200 Mbps' }
    },
    location: {
      nationalAddress: {
        city: 'الدمام',
        district: 'الفيصلية',
        streetName: 'طريق الملك عبدالعزيز',
        buildingNumber: '6420',
        postalCode: '32245',
        shortAddress: '6420 طريق الملك عبدالعزيز، الفيصلية 32245'
      },
      qrCode: 'QR-BR-DMM-001',
      googleMapsLink: 'https://maps.google.com/?q=26.4207,50.0888'
    },
    statistics: { totalNotifications: 8, pendingPayments: 0, upcomingRenewals: 0, maintenanceRequests: 1 }
  }
];

const OfficeBranches_Complete_905_v1: React.FC = () => {
  const [activeTab, setActiveTab] = useState('905-01');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchDetails, setShowBranchDetails] = useState(false);
  const [showAddBranch, setShowAddBranch] = useState(false);
  
  // حالات سجلات السداد
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedBranchForPayment, setSelectedBranchForPayment] = useState<Branch | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  
  // حقول نموذج السداد
  const [paymentForm, setPaymentForm] = useState({
    serviceType: '',
    invoiceNumber: '',
    billPeriod: '',
    issueDate: '',
    dueDate: '',
    amount: '',
    paidAmount: '',
    paymentDate: '',
    paymentMethod: '',
    referenceNumber: '',
    paidBy: '',
    notes: ''
  });

  // حالات نظام الإرسال للموقع
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedBranchForSend, setSelectedBranchForSend] = useState<Branch | null>(null);
  const [selectedSendType, setSelectedSendType] = useState<'address' | 'location' | 'qr' | 'all' | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [recipientType, setRecipientType] = useState<'client' | 'employee' | 'manual'>('manual');
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    contact: '', // email, phone, or username depending on channel
    message: ''
  });

  // قوائم العملاء والموظفين
  const clients = [
    { id: 'C001', name: 'م. أحمد بن سعد الغامدي', phone: '+966 50 123 4567', email: 'ahmed@example.sa', type: 'VIP' },
    { id: 'C002', name: 'م. فهد بن محمد القحطاني', phone: '+966 55 234 5678', email: 'fahad@example.sa', type: 'عادي' },
    { id: 'C003', name: 'م. خالد بن عبدالله العتيبي', phone: '+966 50 345 6789', email: 'khaled@example.sa', type: 'VIP' },
    { id: 'C004', name: 'م. سارة بنت ناصر المطيري', phone: '+966 55 456 7890', email: 'sarah@example.sa', type: 'عادي' },
    { id: 'C005', name: 'م. نورة بنت صالح الزهراني', phone: '+966 50 567 8901', email: 'noura@example.sa', type: 'VIP' },
    { id: 'C006', name: 'م. عبدالله بن حسن الدوسري', phone: '+966 55 678 9012', email: 'abdullah@example.sa', type: 'عادي' },
    { id: 'C007', name: 'م. منى بنت فهد الشمري', phone: '+966 50 789 0123', email: 'mona@example.sa', type: 'عادي' },
    { id: 'C008', name: 'م. راشد بن أحمد الحربي', phone: '+966 55 890 1234', email: 'rashed@example.sa', type: 'VIP' },
  ];

  const employees = [
    { id: 'E001', name: 'م. عبدالله بن محمد السالم', phone: '+966 50 123 4567', email: 'ceo@office.sa', role: 'مدير عام', department: 'الإدارة' },
    { id: 'E002', name: 'م. سارة بنت أحمد المطيري', phone: '+966 50 234 5678', email: 'exec@office.sa', role: 'مدير تنفيذي', department: 'الإدارة' },
    { id: 'E003', name: 'م. خالد بن عبدالعزيز العتيبي', phone: '+966 50 345 6789', email: 'deputy@office.sa', role: 'نائب المدير', department: 'الإدارة' },
    { id: 'E004', name: 'م. فهد بن صالح الزهراني', phone: '+966 50 567 8901', email: 'jeddah.gm@office.sa', role: 'مدير فرع', department: 'فرع جدة' },
    { id: 'E005', name: 'م. نورة بنت ناصر الحربي', phone: '+966 50 678 9012', email: 'jeddah.exec@office.sa', role: 'مدير تنفيذي', department: 'فرع جدة' },
    { id: 'E006', name: 'م. عمر بن حسن القحطاني', phone: '+966 50 789 0123', email: 'jeddah.deputy@office.sa', role: 'نائب المدير', department: 'فرع جدة' },
    { id: 'E007', name: 'م. محمد بن ناصر الشهري', phone: '+966 50 890 1234', email: 'dammam.gm@office.sa', role: 'مدير فرع', department: 'فرع الدمام' },
    { id: 'E008', name: 'م. هند بنت سعد الغامدي', phone: '+966 50 901 2345', email: 'hr@office.sa', role: 'مدير موارد بشرية', department: 'الموارد البشرية' },
    { id: 'E009', name: 'م. يوسف بن فهد العنزي', phone: '+966 50 012 3456', email: 'finance@office.sa', role: 'مدير مالي', department: 'المالية' },
    { id: 'E010', name: 'م. ريم بنت عبدالله الدوسري', phone: '+966 50 123 5678', email: 'legal@office.sa', role: 'مستشار قانوني', department: 'الشؤون القانونية' },
  ];

  const allBranches = [mainHeadquarters, ...branches];

  const totalStats = useMemo(() => {
    return {
      totalBranches: allBranches.length,
      activeBranches: allBranches.filter(b => b.isActive).length,
      totalEmployees: allBranches.reduce((sum, b) => sum + b.currentEmployees, 0),
      totalCapacity: allBranches.reduce((sum, b) => sum + b.maxCapacity, 0),
      totalArea: allBranches.reduce((sum, b) => sum + b.building.totalArea, 0),
      totalRent: allBranches
        .filter(b => b.ownershipType === 'مؤجر')
        .reduce((sum, b) => sum + (b.leaseContract?.monthlyRent || 0), 0),
      totalNotifications: allBranches.reduce((sum, b) => sum + b.statistics.totalNotifications, 0),
      pendingPayments: allBranches.reduce((sum, b) => sum + b.statistics.pendingPayments, 0),
    };
  }, [allBranches]);

  const render905_01_Overview = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'إجمالي المواقع', value: totalStats.totalBranches.toString(), color: '#2563eb', icon: Building2 },
          { label: 'المواقع النشطة', value: totalStats.activeBranches.toString(), color: '#10b981', icon: CheckCircle },
          { label: 'إجمالي الموظفين', value: totalStats.totalEmployees.toString(), color: '#8b5cf6', icon: Users },
          { label: 'السعة الإجمالية', value: totalStats.totalCapacity.toString(), color: '#f59e0b', icon: Users },
          { label: 'المساحة الكلية', value: `${totalStats.totalArea.toLocaleString()} م²`, color: '#06b6d4', icon: Building },
          { label: 'الإيجار الشهري', value: `${(totalStats.totalRent / 1000).toFixed(0)}K`, color: '#ec4899', icon: DollarSign }
        ].map((stat, i) => (
          <Card key={i} className="card-rtl" style={{ background: `${stat.color}10`, border: `2px solid ${stat.color}` }}>
            <CardContent className="p-2 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-1" style={{ color: stat.color }} />
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '18px', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-rtl">
        <CardHeader className="p-2">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              جميع المواقع ({allBranches.length})
            </CardTitle>
            <Button size="sm" className="button-rtl" style={{ background: '#10b981', color: 'white' }} onClick={() => setShowAddBranch(true)}>
              <Plus className="h-4 w-4" />
              إضافة فرع جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="table-rtl dense-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفين</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإيجار</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="text-right font-mono" style={{ color: branch.type === 'مقر رئيسي' ? '#2563eb' : '#8b5cf6', fontWeight: 600 }}>
                    {branch.code}
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '12px' }}>{branch.name}</p>
                      <p className="text-[10px] text-gray-500">{branch.nameEn}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge style={{ background: branch.type === 'مقر رئيسي' ? '#2563eb' : '#8b5cf6', color: 'white' }}>
                      {branch.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                    {branch.location.nationalAddress.city}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-center">
                      <p className="font-mono" style={{ fontSize: '12px', fontWeight: 600 }}>{branch.currentEmployees}/{branch.maxCapacity}</p>
                      <Progress value={(branch.currentEmployees / branch.maxCapacity) * 100} className="h-1 mt-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono" style={{ fontSize: '11px' }}>
                    {branch.building.totalArea.toLocaleString()} م²
                  </TableCell>
                  <TableCell className="text-right">
                    {branch.ownershipType === 'مؤجر' ? (
                      <Badge variant="outline" className="font-mono">
                        {(branch.leaseContract!.monthlyRent / 1000).toFixed(0)}K
                      </Badge>
                    ) : (
                      <Badge variant="secondary">مملوك</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                      {branch.isActive ? 'نشط' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedBranch(branch);
                          setShowBranchDetails(true);
                        }}
                      >
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

  const renderBranchDetails = (branch: Branch) => (
    <div className="space-y-3">
      <Card className="card-rtl">
        <CardHeader className="p-2">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
            تفاصيل {branch.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            المحتوى التفصيلي سيتم تطويره...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 905-03: قائمة الفروع
  const render905_03_BranchesList = () => (
    <div className="space-y-3">
      <Card className="card-rtl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
              جميع الفروع ({branches.length})
            </CardTitle>
            <Button onClick={() => setShowAddBranch(true)} size="sm">
              <Plus className="h-4 w-4 ml-1" />
              إضافة فرع جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {branches.map((branch) => (
              <Card key={branch.id} className="card-rtl" style={{ border: '2px solid #e5e7eb' }}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5" style={{ color: '#2563eb' }} />
                        <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', fontWeight: 700 }}>
                          {branch.name}
                        </h3>
                        <Badge variant="secondary" style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                          {branch.code}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المدينة</p>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                            {branch.location.nationalAddress.city}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الموظفون</p>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                            {branch.currentEmployees} / {branch.maxCapacity}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المساحة</p>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                            {branch.building.totalArea} م²
                          </p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الإيجار الشهري</p>
                          <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px', fontWeight: 700, color: '#059669' }}>
                            {branch.leaseContract?.monthlyRent.toLocaleString('ar-SA')} ر.س
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress 
                          value={(branch.currentEmployees / branch.maxCapacity) * 100} 
                          className="h-2"
                        />
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                          نسبة الإشغال: {Math.round((branch.currentEmployees / branch.maxCapacity) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedBranch(branch); setShowBranchDetails(true); }}>
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 905-04: الإدارة والموظفين
  const render905_04_Management = () => (
    <div className="space-y-3">
      {allBranches.map((branch) => (
        <Card key={branch.id} className="card-rtl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" style={{ color: '#2563eb' }} />
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>{branch.name}</CardTitle>
                <Badge variant="outline" style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                  {branch.code}
                </Badge>
              </div>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 ml-1" />
                تعديل الإدارة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded" style={{ background: '#dbeafe' }}>
                    <Users className="h-4 w-4" style={{ color: '#2563eb' }} />
                  </div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>المدير العام</p>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الاسم</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>{branch.management.generalManager.name}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الهاتف</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>{branch.management.generalManager.phone}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>البريد</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>{branch.management.generalManager.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded" style={{ background: '#f3e8ff' }}>
                    <Users className="h-4 w-4" style={{ color: '#7c3aed' }} />
                  </div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>المدير التنفيذي</p>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الاسم</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>{branch.management.executiveManager.name}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الهاتف</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>{branch.management.executiveManager.phone}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>البريد</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>{branch.management.executiveManager.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded" style={{ background: '#d1fae5' }}>
                    <Users className="h-4 w-4" style={{ color: '#059669' }} />
                  </div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>نائب المدير</p>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الاسم</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>{branch.management.deputyManager.name}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الهاتف</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>{branch.management.deputyManager.phone}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>البريد</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>{branch.management.deputyManager.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الحاليون</p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#2563eb' }}>
                    {branch.currentEmployees}
                  </p>
                </div>
                <div className="text-center">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المتوقع</p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#f59e0b' }}>
                    {branch.projectedEmployees}
                  </p>
                </div>
                <div className="text-center">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>السعة</p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#059669' }}>
                    {branch.maxCapacity}
                  </p>
                </div>
                <div className="text-center">
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الإشغال</p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#7c3aed' }}>
                    {Math.round((branch.currentEmployees / branch.maxCapacity) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // التاب 905-05: الملكية والإيجار
  const render905_05_Ownership = () => (
    <div className="space-y-3">
      {allBranches.map((branch) => (
        <Card key={branch.id} className="card-rtl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" style={{ color: '#2563eb' }} />
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>{branch.name}</CardTitle>
              </div>
              <Badge 
                variant={branch.ownershipType === 'مؤجر' ? 'secondary' : 'default'}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {branch.ownershipType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {branch.ownershipType === 'مؤجر' && branch.owner && branch.leaseContract ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                    معلومات المالك
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>اسم المالك</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>{branch.owner.name}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>هاتف المالك</p>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', marginTop: '2px' }}>{branch.owner.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>البريد الإلكتروني</p>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', marginTop: '2px' }}>{branch.owner.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                    تفاصيل عقد الإيجار
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>رقم العقد</p>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', marginTop: '2px', fontWeight: 700 }}>
                        {branch.leaseContract.contractNumber}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>الإيجار الشهري</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', marginTop: '2px', fontWeight: 700, color: '#059669' }}>
                        {branch.leaseContract.monthlyRent.toLocaleString('ar-SA')} ر.س
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>الإيجار السنوي</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', marginTop: '2px', fontWeight: 700, color: '#7c3aed' }}>
                        {(branch.leaseContract.monthlyRent * 12).toLocaleString('ar-SA')} ر.س
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>تاريخ البداية</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                        {new Date(branch.leaseContract.startDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>تاريخ الانتهاء</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                        {new Date(branch.leaseContract.endDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>المتبقي</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px', fontWeight: 700 }}>
                        {Math.ceil((new Date(branch.leaseContract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} يوم
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between p-2 rounded" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>قابل للتجديد</span>
                    <Badge variant={branch.leaseContract.isRenewable ? 'default' : 'secondary'}>
                      {branch.leaseContract.isRenewable ? 'نعم' : 'لا'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 rounded-lg" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                    <DollarSign className="h-5 w-5 mx-auto mb-1" style={{ color: '#2563eb' }} />
                    <p className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                      {branch.leaseContract.monthlyRent.toLocaleString('ar-SA')}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>شهرياً (ر.س)</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ background: '#d1fae5', border: '2px solid #6ee7b7' }}>
                    <BarChart3 className="h-5 w-5 mx-auto mb-1" style={{ color: '#059669' }} />
                    <p className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#047857' }}>
                      {(branch.leaseContract.monthlyRent * 12).toLocaleString('ar-SA')}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>سنوياً (ر.س)</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ background: '#e9d5ff', border: '2px solid #c084fc' }}>
                    <Activity className="h-5 w-5 mx-auto mb-1" style={{ color: '#7c3aed' }} />
                    <p className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#6b21a8' }}>
                      {Math.round(branch.leaseContract.monthlyRent / branch.building.totalArea)}
                    </p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>ر.س/م²</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                <Key className="h-8 w-8 mx-auto mb-2" style={{ color: '#94a3b8' }} />
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>هذا الموقع ملك للمكتب</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // دالة حفظ سجل السداد
  const handleSavePayment = () => {
    if (!selectedBranchForPayment) {
      toast.error('يجب تحديد الفرع أولاً');
      return;
    }
    
    if (!paymentForm.serviceType || !paymentForm.amount || !paymentForm.paymentDate) {
      toast.error('يجب تعبئة الحقول الإلزامية (نوع الخدمة، المبلغ، تاريخ السداد)');
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    const paidAmount = parseFloat(paymentForm.paidAmount || paymentForm.amount);
    
    let status: 'paid' | 'partial' | 'pending' | 'overdue' = 'paid';
    if (paidAmount === 0) status = 'pending';
    else if (paidAmount < amount) status = 'partial';
    else if (paidAmount >= amount && new Date(paymentForm.paymentDate) > new Date(paymentForm.dueDate)) status = 'overdue';

    const newPayment: PaymentRecord = {
      id: editingPayment?.id || `PAY-${Date.now()}`,
      branchId: selectedBranchForPayment.id,
      serviceType: paymentForm.serviceType,
      invoiceNumber: paymentForm.invoiceNumber,
      billPeriod: paymentForm.billPeriod,
      issueDate: paymentForm.issueDate,
      dueDate: paymentForm.dueDate,
      amount,
      paidAmount,
      paymentDate: paymentForm.paymentDate,
      paymentMethod: paymentForm.paymentMethod,
      referenceNumber: paymentForm.referenceNumber,
      paidBy: paymentForm.paidBy,
      notes: paymentForm.notes,
      status
    };

    if (editingPayment) {
      setPaymentRecords(prev => prev.map(p => p.id === editingPayment.id ? newPayment : p));
      toast.success('تم تحديث سجل السداد بنجاح');
    } else {
      setPaymentRecords(prev => [...prev, newPayment]);
      toast.success('تم إضافة سجل السداد بنجاح');
    }

    // إعادة تعيين النموذج
    setPaymentForm({
      serviceType: '',
      invoiceNumber: '',
      billPeriod: '',
      issueDate: '',
      dueDate: '',
      amount: '',
      paidAmount: '',
      paymentDate: '',
      paymentMethod: '',
      referenceNumber: '',
      paidBy: '',
      notes: ''
    });
    setShowAddPayment(false);
    setEditingPayment(null);
  };

  // دالة حذف سجل سداد
  const handleDeletePayment = (paymentId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setPaymentRecords(prev => prev.filter(p => p.id !== paymentId));
      toast.success('تم حذف السجل بنجاح');
    }
  };

  // دالة تنسيق محتوى الإرسال
  const formatSendContent = (branch: Branch, type: 'address' | 'location' | 'qr' | 'all') => {
    let content = `**معلومات موقع ${branch.name}**\n\n`;
    
    if (type === 'address' || type === 'all') {
      content += `📍 **العنوان الوطني:**\n`;
      content += `المدينة: ${branch.location.nationalAddress.city}\n`;
      content += `الحي: ${branch.location.nationalAddress.district}\n`;
      content += `الشارع: ${branch.location.nationalAddress.streetName}\n`;
      content += `رقم المبنى: ${branch.location.nationalAddress.buildingNumber}\n`;
      content += `الرمز البريدي: ${branch.location.nationalAddress.postalCode}\n`;
      content += `العنوان الكامل: ${branch.location.nationalAddress.shortAddress}\n\n`;
    }

    if (type === 'location' || type === 'all') {
      content += `🗺️ **الموقع على الخريطة:**\n`;
      content += `رابط Google Maps: ${branch.location.googleMapsLink}\n\n`;
    }

    if (type === 'qr' || type === 'all') {
      content += `📱 **رمز QR:**\n`;
      content += `كود QR: ${branch.location.qrCode}\n`;
      content += `امسح الرمز للحصول على جميع المعلومات\n\n`;
    }

    content += `رمز الفرع: ${branch.code}\n`;
    content += `اسم المبنى: ${branch.building.name}\n`;
    
    return content;
  };

  // دالة فتح نافذة الإرسال
  const handleOpenSendDialog = (branch: Branch, type: 'address' | 'location' | 'qr' | 'all') => {
    setSelectedBranchForSend(branch);
    setSelectedSendType(type);
    setShowSendDialog(true);
    setSelectedChannel('');
    setRecipientType('manual');
    setSelectedPerson('');
    setRecipientInfo({ name: '', contact: '', message: formatSendContent(branch, type) });
  };

  // دالة إرسال المعلومات
  const handleSendInformation = () => {
    if (!selectedChannel) {
      toast.error('يجب اختيار وسيلة الإرسال');
      return;
    }
    
    if (!recipientInfo.contact) {
      toast.error('يجب إدخال معلومات المستقبل');
      return;
    }

    // محاكاة الإرسال (في التطبيق الحقيقي، ستكون هنا API calls)
    const channelNames: Record<string, string> = {
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني',
      sms: 'الرسائل النصية',
      telegram: 'تيليجرام',
      slack: 'سلاك',
      twitter: 'تويتر'
    };

    toast.success(`تم إرسال المعلومات عبر ${channelNames[selectedChannel] || 'الوسيلة المختارة'} بنجاح`);
    
    // إعادة تعيين النموذج
    setShowSendDialog(false);
    setSelectedBranchForSend(null);
    setSelectedSendType(null);
    setSelectedChannel('');
    setRecipientType('manual');
    setSelectedPerson('');
    setRecipientInfo({ name: '', contact: '', message: '' });
  };

  // دالة نسخ المحتوى
  const handleCopyContent = async () => {
    const success = await copyToClipboard(recipientInfo.message);
    if (success) {
      toast.success('تم نسخ المحتوى إلى الحافظة');
    } else {
      toast.error('فشل نسخ المحتوى. الرجاء المحاولة مرة أخرى.');
    }
  };

  // دالة التعبئة التلقائية عند اختيار شخص
  const handlePersonSelect = (personId: string) => {
    setSelectedPerson(personId);
    
    if (!personId) {
      // مسح البيانات عند إلغاء الاختيار
      setRecipientInfo(prev => ({
        ...prev,
        name: '',
        contact: ''
      }));
      return;
    }

    const person = recipientType === 'client' 
      ? clients.find(c => c.id === personId)
      : employees.find(e => e.id === personId);

    if (person) {
      // تحديد جهة الاتصال حسب القناة المختارة
      let contactValue = '';
      if (selectedChannel === 'email') {
        contactValue = person.email;
      } else if (selectedChannel === 'whatsapp' || selectedChannel === 'sms') {
        contactValue = person.phone;
      } else if (selectedChannel === 'telegram' || selectedChannel === 'slack' || selectedChannel === 'twitter') {
        // للقنوات الأخرى، نستخدم اسم المستخدم (يمكن تحسينه لاحقاً)
        contactValue = `@${person.name.split(' ')[0]}`;
      }

      setRecipientInfo(prev => ({
        ...prev,
        name: person.name,
        contact: contactValue
      }));
    }
  };

  // دالة تغيير نوع المستقبل
  const handleRecipientTypeChange = (type: 'client' | 'employee' | 'manual') => {
    setRecipientType(type);
    setSelectedPerson('');
    if (type === 'manual') {
      // مسح البيانات عند اختيار الإدخال اليدوي
      setRecipientInfo(prev => ({
        ...prev,
        name: '',
        contact: ''
      }));
    }
  };

  // التاب 905-06: الخدمات والمرافق مع سجلات السداد
  const render905_06_Utilities = () => {
    const serviceTypes = ['كهرباء', 'مياه', 'هاتف', 'إنترنت', 'إيجار', 'صرف صحي', 'نظافة', 'صيانة', 'أمن وحراسة', 'أخرى'];
    const paymentMethods = ['نقدي', 'شيك', 'تحويل بنكي', 'سداد', 'مدى', 'بطاقة ائتمان', 'أخرى'];

    return (
      <div className="space-y-3">
        {allBranches.map((branch) => {
          const branchPayments = paymentRecords.filter(p => p.branchId === branch.id);
          const totalPaid = branchPayments.reduce((sum, p) => sum + p.paidAmount, 0);
          const totalDue = branchPayments.reduce((sum, p) => sum + p.amount, 0);
          
          return (
            <Card key={branch.id} className="card-rtl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" style={{ color: '#f59e0b' }} />
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>{branch.name}</CardTitle>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedBranchForPayment(branch);
                      setEditingPayment(null);
                      setPaymentForm({
                        serviceType: '',
                        invoiceNumber: '',
                        billPeriod: '',
                        issueDate: '',
                        dueDate: '',
                        amount: '',
                        paidAmount: '',
                        paymentDate: '',
                        paymentMethod: '',
                        referenceNumber: '',
                        paidBy: '',
                        notes: ''
                      });
                      setShowAddPayment(true);
                    }}
                    style={{ background: '#10b981', color: 'white' }}
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة سجل سداد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* معلومات الخدمات الأساسية */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded" style={{ background: '#fbbf24' }}>
                        <Zap className="h-4 w-4" style={{ color: '#ffffff' }} />
                      </div>
                      <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700 }}>الكهرباء</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>المزود</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.utilities.electricity.provider}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>المتوسط الشهري</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', marginTop: '2px', fontWeight: 700, color: '#059669' }}>
                          {branch.utilities.electricity.monthlyAverage.toLocaleString('ar-SA')} ر.س
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: '#dbeafe', border: '2px solid #93c5fd' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded" style={{ background: '#3b82f6' }}>
                        <Activity className="h-4 w-4" style={{ color: '#ffffff' }} />
                      </div>
                      <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700 }}>المياه</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a' }}>المزود</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.utilities.water.provider}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a' }}>المتوسط الشهري</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', marginTop: '2px', fontWeight: 700, color: '#059669' }}>
                          {branch.utilities.water.monthlyAverage.toLocaleString('ar-SA')} ر.س
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: '#d1fae5', border: '2px solid #6ee7b7' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded" style={{ background: '#059669' }}>
                        <Phone className="h-4 w-4" style={{ color: '#ffffff' }} />
                      </div>
                      <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700 }}>الهاتف</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>المزود</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.utilities.phone.provider}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>الأرقام</p>
                        <div className="space-y-1 mt-2">
                          {branch.utilities.phone.numbers.map((num, idx) => (
                            <p key={idx} style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '4px' }}>
                              {num}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: '#e9d5ff', border: '2px solid #c084fc' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded" style={{ background: '#7c3aed' }}>
                        <Activity className="h-4 w-4" style={{ color: '#ffffff' }} />
                      </div>
                      <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700 }}>الإنترنت</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#581c87' }}>المزود</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.utilities.internet.provider}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#581c87' }}>السرعة</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px', fontWeight: 700 }}>
                          {branch.utilities.internet.speed}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* قسم سجلات السداد */}
                {branchPayments.length > 0 && (
                  <>
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #0ea5e9' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-5 w-5" style={{ color: '#0284c7' }} />
                          <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700 }}>
                            ملخص السدادات ({branchPayments.length})
                          </h4>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>إجمالي الفواتير</p>
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', fontWeight: 700, color: '#dc2626' }}>
                              {totalDue.toLocaleString('ar-SA')} ر.س
                            </p>
                          </div>
                          <div className="text-center">
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>إجمالي المدفوع</p>
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', fontWeight: 700, color: '#059669' }}>
                              {totalPaid.toLocaleString('ar-SA')} ر.س
                            </p>
                          </div>
                          <div className="text-center">
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>المتبقي</p>
                            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', fontWeight: 700, color: '#f59e0b' }}>
                              {(totalDue - totalPaid).toLocaleString('ar-SA')} ر.س
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Table className="table-rtl dense-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الخدمة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المبلغ</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدفوع</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ السداد</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branchPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                              {payment.serviceType}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                              {payment.billPeriod}
                            </TableCell>
                            <TableCell className="text-right font-mono" style={{ fontSize: '12px', fontWeight: 600 }}>
                              {payment.amount.toLocaleString('ar-SA')} ر.س
                            </TableCell>
                            <TableCell className="text-right font-mono" style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
                              {payment.paidAmount.toLocaleString('ar-SA')} ر.س
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                              {new Date(payment.paymentDate).toLocaleDateString('ar-SA')}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                style={{
                                  background: payment.status === 'paid' ? '#10b981' : payment.status === 'partial' ? '#f59e0b' : payment.status === 'overdue' ? '#dc2626' : '#6b7280',
                                  color: 'white'
                                }}
                              >
                                {payment.status === 'paid' ? 'مسدد' : payment.status === 'partial' ? 'جزئي' : payment.status === 'overdue' ? 'متأخر' : 'معلق'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedBranchForPayment(branch);
                                    setEditingPayment(payment);
                                    setPaymentForm({
                                      serviceType: payment.serviceType,
                                      invoiceNumber: payment.invoiceNumber,
                                      billPeriod: payment.billPeriod,
                                      issueDate: payment.issueDate,
                                      dueDate: payment.dueDate,
                                      amount: payment.amount.toString(),
                                      paidAmount: payment.paidAmount.toString(),
                                      paymentDate: payment.paymentDate,
                                      paymentMethod: payment.paymentMethod,
                                      referenceNumber: payment.referenceNumber,
                                      paidBy: payment.paidBy,
                                      notes: payment.notes
                                    });
                                    setShowAddPayment(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeletePayment(payment.id)}
                                >
                                  <Trash2 className="h-3 w-3" style={{ color: '#dc2626' }} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}

                {branchPayments.length === 0 && (
                  <div className="text-center p-6" style={{ background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <Receipt className="h-8 w-8 mx-auto mb-2" style={{ color: '#94a3b8' }} />
                    <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b', fontSize: '13px' }}>
                      لا توجد سجلات سداد حتى الآن
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* نافذة إضافة/تعديل سجل السداد */}
        <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
          <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh' }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingPayment ? 'تعديل سجل السداد' : 'إضافة سجل سداد جديد'}
              </DialogTitle>
              <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {selectedBranchForPayment?.name}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="form-rtl space-y-3 p-4">
                {/* معلومات الفاتورة */}
                <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '2px solid #cbd5e1' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#1e40af' }}>
                    معلومات الفاتورة
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <SelectWithCopy
                      label="نوع الخدمة *"
                      id="serviceType"
                      value={paymentForm.serviceType}
                      onChange={(value) => setPaymentForm(prev => ({ ...prev, serviceType: value }))}
                      options={serviceTypes.map(type => ({ value: type, label: type }))}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="رقم الفاتورة"
                      id="invoiceNumber"
                      value={paymentForm.invoiceNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      placeholder="مثال: INV-2025-001"
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="فترة الفاتورة"
                      id="billPeriod"
                      value={paymentForm.billPeriod}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, billPeriod: e.target.value }))}
                      placeholder="مثال: يناير 2025"
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="تاريخ الإصدار"
                      id="issueDate"
                      type="date"
                      value={paymentForm.issueDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, issueDate: e.target.value }))}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="تاريخ الاستحقاق"
                      id="dueDate"
                      type="date"
                      value={paymentForm.dueDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="المبلغ الإجمالي (ر.س) *"
                      id="amount"
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>

                {/* معلومات السداد */}
                <div className="p-3 rounded-lg" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#059669' }}>
                    معلومات السداد
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <InputWithCopy
                      label="المبلغ المدفوع (ر.س) *"
                      id="paidAmount"
                      type="number"
                      value={paymentForm.paidAmount}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paidAmount: e.target.value }))}
                      placeholder="0.00"
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="تاريخ السداد *"
                      id="paymentDate"
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      copyable={true}
                      clearable={true}
                    />
                    <SelectWithCopy
                      label="طريقة السداد"
                      id="paymentMethod"
                      value={paymentForm.paymentMethod}
                      onChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
                      options={paymentMethods.map(method => ({ value: method, label: method }))}
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="رقم المرجع/الإيصال"
                      id="referenceNumber"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, referenceNumber: e.target.value }))}
                      placeholder="رقم الشيك أو رقم العملية"
                      copyable={true}
                      clearable={true}
                    />
                    <InputWithCopy
                      label="اسم الدافع"
                      id="paidBy"
                      value={paymentForm.paidBy}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, paidBy: e.target.value }))}
                      placeholder="اسم الموظف المسؤول"
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                </div>

                {/* ملاحظات */}
                <div className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#92400e' }}>
                    ملاحظات إضافية
                  </h4>
                  <TextAreaWithCopy
                    label="الملاحظات"
                    id="notes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="أي ملاحظات أو تفاصيل إضافية..."
                    copyable={true}
                    clearable={true}
                  />
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddPayment(false);
                      setEditingPayment(null);
                    }}
                  >
                    <X className="h-4 w-4 ml-1" />
                    إلغاء
                  </Button>
                  <Button onClick={handleSavePayment} style={{ background: '#10b981', color: 'white' }}>
                    <Save className="h-4 w-4 ml-1" />
                    {editingPayment ? 'تحديث السجل' : 'حفظ السجل'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // التاب 905-07: الالتزامات المالية (بسيط - بيانات وهمية)
  const render905_07_Financial = () => (
    <div className="space-y-3">
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            الالتزامات المالية الشهرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allBranches.map((branch) => (
            <div key={branch.id} className="mb-4 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                {branch.name}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 rounded" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>الكهرباء</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#059669' }}>
                    {branch.utilities.electricity.monthlyAverage.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
                <div className="p-2 rounded" style={{ background: '#dbeafe', border: '1px solid #93c5fd' }}>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a' }}>المياه</p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#059669' }}>
                    {branch.utilities.water.monthlyAverage.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
                {branch.leaseContract && (
                  <div className="p-2 rounded" style={{ background: '#fce7f3', border: '1px solid #f9a8d4' }}>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#9f1239' }}>الإيجار</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>
                      {branch.leaseContract.monthlyRent.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3 p-2 rounded-lg" style={{ background: '#e9d5ff', border: '2px solid #c084fc' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>الإجمالي الشهري</span>
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px', fontWeight: 700, color: '#7c3aed' }}>
                    {(
                      branch.utilities.electricity.monthlyAverage +
                      branch.utilities.water.monthlyAverage +
                      (branch.leaseContract?.monthlyRent || 0)
                    ).toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // التاب 905-08: المراسلات والإشعارات (بسيط)
  const render905_08_Communications = () => (
    <div className="space-y-3">
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            المراسلات والإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {allBranches.map((branch) => (
              <Card key={branch.id} className="card-rtl" style={{ border: '1px solid #e5e7eb' }}>
                <CardContent className="p-3 text-center">
                  <FileText className="h-5 w-5 mx-auto mb-2" style={{ color: '#2563eb' }} />
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', marginBottom: '6px' }}>{branch.name}</p>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: '#1e40af' }}>
                    {branch.statistics.totalNotifications}
                  </p>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#64748b' }}>إشعار</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 905-09: الموقع والعنوان الوطني مع نظام الإرسال
  const render905_09_Location = () => (
    <div className="space-y-3">
      {allBranches.map((branch) => (
        <Card key={branch.id} className="card-rtl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: '#059669' }} />
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px' }}>{branch.name}</CardTitle>
              </div>
              
              {/* أزرار الإرسال السريع */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenSendDialog(branch, 'address')}
                  style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #059669' }}
                >
                  <Send className="h-3 w-3 ml-1" />
                  إرسال العنوان
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenSendDialog(branch, 'location')}
                  style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)', border: '2px solid #2563eb' }}
                >
                  <Globe className="h-3 w-3 ml-1" />
                  إرسال الموقع
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenSendDialog(branch, 'qr')}
                  style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)', border: '2px solid #f59e0b' }}
                >
                  <QrCode className="h-3 w-3 ml-1" />
                  إرسال QR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenSendDialog(branch, 'all')}
                  style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)', border: '2px solid #7c3aed' }}
                >
                  <Share2 className="h-3 w-3 ml-1" />
                  إرسال الكل
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="p-3 rounded-lg mb-3" style={{ background: '#d1fae5', border: '2px solid #6ee7b7' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                    العنوان الوطني
                  </h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>المدينة</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.location.nationalAddress.city}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>الحي</p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                          {branch.location.nationalAddress.district}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>اسم الشارع</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', marginTop: '2px' }}>
                        {branch.location.nationalAddress.streetName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>رقم المبنى</p>
                        <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', marginTop: '2px' }}>
                          {branch.location.nationalAddress.buildingNumber}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>الرمز البريدي</p>
                        <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', marginTop: '2px' }}>
                          {branch.location.nationalAddress.postalCode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>العنوان الكامل</p>
                      <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', marginTop: '2px', lineHeight: '1.6' }}>
                        {branch.location.nationalAddress.shortAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-4 rounded-lg text-center" style={{ background: '#fef3c7', border: '3px solid #fcd34d' }}>
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
                    رمز الاستجابة السريعة (QR)
                  </h4>
                  <div 
                    className="mx-auto mb-4" 
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      background: '#ffffff', 
                      border: '2px solid #92400e',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <MapPin className="h-12 w-12 mx-auto mb-2" style={{ color: '#92400e' }} />
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#92400e' }}>
                        {branch.location.qrCode}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#92400e' }}>
                    امسح الرمز للحصول على معلومات الموقع
                  </p>
                </div>

                <div className="mt-3 p-3 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>اسم المبنى</span>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 700 }}>
                        {branch.building.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>رمز الموقع</span>
                      <span style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', fontWeight: 700 }}>
                        {branch.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#64748b' }}>رابط الموقع</span>
                      <a 
                        href={branch.location.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#2563eb', textDecoration: 'underline' }}
                      >
                        فتح في الخريطة
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* نافذة اختيار وسيلة الإرسال */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ maxHeight: '90vh' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedSendType === 'address' && 'إرسال العنوان الوطني'}
              {selectedSendType === 'location' && 'إرسال رابط الموقع'}
              {selectedSendType === 'qr' && 'إرسال رمز QR'}
              {selectedSendType === 'all' && 'إرسال جميع المعلومات'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedBranchForSend?.name}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <div className="form-rtl space-y-4 p-4">
              {/* اختيار وسيلة الإرسال */}
              <div className="p-3 rounded-lg" style={{ background: '#f1f5f9', border: '2px solid #cbd5e1' }}>
                <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#1e40af' }}>
                  اختر وسيلة الإرسال
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'whatsapp', label: 'واتساب', icon: MessageSquare, color: '#25D366' },
                    { id: 'email', label: 'بريد إلكتروني', icon: Mail, color: '#EA4335' },
                    { id: 'sms', label: 'رسالة نصية', icon: Phone, color: '#2563eb' },
                    { id: 'telegram', label: 'تيليجرام', icon: Send, color: '#0088cc' },
                    { id: 'slack', label: 'سلاك', icon: MessageSquare, color: '#4A154B' },
                    { id: 'twitter', label: 'تويتر/X', icon: Share2, color: '#1DA1F2' }
                  ].map((channel) => (
                    <Button
                      key={channel.id}
                      variant={selectedChannel === channel.id ? 'default' : 'outline'}
                      className="h-auto flex-col gap-2 p-4"
                      onClick={() => setSelectedChannel(channel.id)}
                      style={{
                        background: selectedChannel === channel.id ? channel.color : 'white',
                        color: selectedChannel === channel.id ? 'white' : '#64748b',
                        border: `2px solid ${selectedChannel === channel.id ? channel.color : '#e2e8f0'}`
                      }}
                    >
                      <channel.icon className="h-6 w-6" />
                      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                        {channel.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* معلومات المستقبل */}
              <div className="p-3 rounded-lg" style={{ background: '#f0fdf4', border: '2px solid #86efac' }}>
                <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#059669' }}>
                  معلومات المستقبل
                </h4>
                
                {/* أزرار اختيار نوع المستقبل */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button
                    variant={recipientType === 'client' ? 'default' : 'outline'}
                    className="h-auto flex-col gap-2 p-3"
                    onClick={() => handleRecipientTypeChange('client')}
                    style={{
                      background: recipientType === 'client' ? '#10b981' : 'white',
                      color: recipientType === 'client' ? 'white' : '#059669',
                      border: `2px solid ${recipientType === 'client' ? '#10b981' : '#86efac'}`
                    }}
                  >
                    <Users className="h-5 w-5" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                      اختيار من العملاء
                    </span>
                    {recipientType === 'client' && (
                      <span style={{ fontSize: '10px', opacity: 0.9 }}>({clients.length} عميل)</span>
                    )}
                  </Button>
                  
                  <Button
                    variant={recipientType === 'employee' ? 'default' : 'outline'}
                    className="h-auto flex-col gap-2 p-3"
                    onClick={() => handleRecipientTypeChange('employee')}
                    style={{
                      background: recipientType === 'employee' ? '#059669' : 'white',
                      color: recipientType === 'employee' ? 'white' : '#059669',
                      border: `2px solid ${recipientType === 'employee' ? '#059669' : '#86efac'}`
                    }}
                  >
                    <Building2 className="h-5 w-5" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                      اختيار من الموظفين
                    </span>
                    {recipientType === 'employee' && (
                      <span style={{ fontSize: '10px', opacity: 0.9 }}>({employees.length} موظف)</span>
                    )}
                  </Button>
                  
                  <Button
                    variant={recipientType === 'manual' ? 'default' : 'outline'}
                    className="h-auto flex-col gap-2 p-3"
                    onClick={() => handleRecipientTypeChange('manual')}
                    style={{
                      background: recipientType === 'manual' ? '#64748b' : 'white',
                      color: recipientType === 'manual' ? 'white' : '#64748b',
                      border: `2px solid ${recipientType === 'manual' ? '#64748b' : '#cbd5e1'}`
                    }}
                  >
                    <Edit className="h-5 w-5" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                      إدخال يدوي
                    </span>
                  </Button>
                </div>

                {/* قائمة اختيار الشخص (تظهر للعملاء أو الموظفين فقط) */}
                {recipientType !== 'manual' && (
                  <div className="mb-4">
                    <SelectWithCopy
                      label={recipientType === 'client' ? 'اختر العميل' : 'اختر الموظف'}
                      id="selectedPerson"
                      value={selectedPerson}
                      onChange={handlePersonSelect}
                      options={[
                        { value: '', label: `-- اختر ${recipientType === 'client' ? 'عميل' : 'موظف'} --` },
                        ...(recipientType === 'client' ? clients : employees).map(person => ({
                          value: person.id,
                          label: `${person.name} - ${person.phone}`
                        }))
                      ]}
                      copyable={true}
                      clearable={true}
                    />
                    
                    {/* عرض معلومات الشخص المختار */}
                    {selectedPerson && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #86efac' }}>
                        {(() => {
                          const person = recipientType === 'client' 
                            ? clients.find(c => c.id === selectedPerson)
                            : employees.find(e => e.id === selectedPerson);
                          
                          if (!person) return null;
                          
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge style={{ background: '#10b981', color: 'white' }}>
                                  {recipientType === 'client' ? (person as typeof clients[0]).type : (person as typeof employees[0]).role}
                                </Badge>
                                {recipientType === 'employee' && (
                                  <Badge style={{ background: '#059669', color: 'white' }}>
                                    {(person as typeof employees[0]).department}
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                <div>
                                  <span style={{ color: '#6b7280' }}>الهاتف: </span>
                                  <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 600 }}>{person.phone}</span>
                                </div>
                                <div>
                                  <span style={{ color: '#6b7280' }}>البريد: </span>
                                  <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 600, fontSize: '10px' }}>{person.email}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* حقول الاسم ومعلومات الاتصال (قابلة للتعديل دائماً) */}
                <div className="grid grid-cols-2 gap-3">
                  <InputWithCopy
                    label="اسم المستقبل"
                    id="recipientName"
                    value={recipientInfo.name}
                    onChange={(e) => setRecipientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم المستقبل"
                    copyable={true}
                    clearable={true}
                  />
                  <InputWithCopy
                    label={selectedChannel === 'email' ? 'البريد الإلكتروني' : selectedChannel === 'sms' || selectedChannel === 'whatsapp' ? 'رقم الهاتف' : 'اسم المستخدم'}
                    id="recipientContact"
                    value={recipientInfo.contact}
                    onChange={(e) => setRecipientInfo(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder={selectedChannel === 'email' ? 'example@email.com' : selectedChannel === 'sms' || selectedChannel === 'whatsapp' ? '+966 50 123 4567' : '@username'}
                    copyable={true}
                    clearable={true}
                  />
                </div>
                
                {/* ملاحظة توضيحية */}
                <div className="mt-3 p-2 rounded" style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid #67e8f9' }}>
                  <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#0e7490', lineHeight: '1.6' }}>
                    💡 <strong>تلميح:</strong> عند اختيار شخص من القائمة، سيتم تعبئة البيانات تلقائياً حسب وسيلة الإرسال المختارة. يمكنك تعديل البيانات يدوياً بعد التعبئة.
                  </p>
                </div>
              </div>

              {/* معاينة المحتوى */}
              <div className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                    معاينة المحتوى
                  </h4>
                  <Button size="sm" variant="outline" onClick={handleCopyContent}>
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ المحتوى
                  </Button>
                </div>
                <TextAreaWithCopy
                  label=""
                  id="messageContent"
                  value={recipientInfo.message}
                  onChange={(e) => setRecipientInfo(prev => ({ ...prev, message: e.target.value }))}
                  rows={10}
                  copyable={false}
                  clearable={false}
                />
              </div>

              {/* أزرار الإرسال */}
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSendDialog(false);
                    setSelectedChannel('');
                  }}
                >
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSendInformation} 
                  style={{ background: '#10b981', color: 'white' }}
                  disabled={!selectedChannel || !recipientInfo.contact}
                >
                  <Send className="h-4 w-4 ml-1" />
                  إرسال
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );

  // التاب 905-10: المستندات والعقود (بسيط)
  const render905_10_Documents = () => (
    <div className="space-y-3">
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
            المستندات والعقود
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allBranches.filter(b => b.leaseContract).map((branch) => (
            <div key={branch.id} className="mb-4 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 700 }}>
                  {branch.name}
                </h4>
                <Badge style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {branch.leaseContract ? 'عقد إيجار' : 'ملكية'}
                </Badge>
              </div>
              {branch.leaseContract && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded" style={{ background: '#dbeafe', border: '1px solid #93c5fd' }}>
                    <FileText className="h-4 w-4 mb-1" style={{ color: '#2563eb' }} />
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#1e3a8a' }}>عقد الإيجار</p>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', fontWeight: 700 }}>
                      {branch.leaseContract.contractNumber}
                    </p>
                  </div>
                  <div className="p-2 rounded" style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
                    <CheckCircle className="h-4 w-4 mb-1" style={{ color: '#059669' }} />
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#064e3b' }}>تاريخ البداية</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>
                      {new Date(branch.leaseContract.startDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="p-2 rounded" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
                    <Calendar className="h-4 w-4 mb-1" style={{ color: '#f59e0b' }} />
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#92400e' }}>تاريخ الانتهاء</p>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 700 }}>
                      {new Date(branch.leaseContract.endDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case '905-01':
        return render905_01_Overview();
      case '905-02':
        return renderBranchDetails(mainHeadquarters);
      case '905-03':
        return render905_03_BranchesList();
      case '905-04':
        return render905_04_Management();
      case '905-05':
        return render905_05_Ownership();
      case '905-06':
        return render905_06_Utilities();
      case '905-07':
        return render905_07_Financial();
      case '905-08':
        return render905_08_Communications();
      case '905-09':
        return render905_09_Location();
      case '905-10':
        return render905_10_Documents();
      default:
        return (
          <Card className="card-rtl">
            <CardContent className="p-8 text-center">
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', color: '#6b7280' }}>
                محتوى التاب قيد التطوير...
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ position: 'sticky', top: '0', zIndex: 10, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderBottom: '3px solid transparent', borderImage: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 50%, #2563eb 100%) 1', padding: '0', marginBottom: '0', marginTop: '0', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center justify-between" style={{ padding: '14px 20px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(139, 92, 246, 0.02) 100%)' }}>
          <div className="flex items-center gap-4">
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)', border: '2px solid rgba(37, 99, 235, 0.2)' }}>
              <Building2 className="h-6 w-6" style={{ color: '#2563eb', filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.3))' }} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0, background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
                  فروع المكتب
                </h1>
                <div style={{ padding: '4px 12px', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', borderRadius: '8px', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>905</span>
                </div>
              </div>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }}></span>
                إدارة شاملة للمقر الرئيسي والفروع
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ padding: '6px 14px', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#475569', fontWeight: 600 }}>{allBranches.length} موقع</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)', paddingLeft: '16px', paddingRight: '16px' }}>
          {renderTabContent()}
        </div>
      </div>

      <Dialog open={showBranchDetails} onOpenChange={setShowBranchDetails}>
        <DialogContent className="max-w-6xl dialog-rtl" style={{ maxHeight: '90vh' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>تفاصيل {selectedBranch?.name}</DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <ScrollArea className="h-[70vh]">
              <div className="space-y-3 p-2">
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>المحتوى التفصيلي الكامل سيتم تطويره...</p>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddBranch} onOpenChange={setShowAddBranch}>
        <DialogContent className="max-w-4xl dialog-rtl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة فرع جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 p-2">
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نموذج إضافة فرع جديد سيتم تطويره...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeBranches_Complete_905_v1;
