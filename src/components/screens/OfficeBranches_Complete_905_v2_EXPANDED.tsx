/**
 * الشاشة 905 - إدارة فروع المكتب v2.0 EXPANDED
 * ================================================
 * 
 * شاشة شاملة لإدارة المقر الرئيسي والفروع مع 14 تاباً
 * إضافة تابات: الشركة المالكة، الفروع الدولية، المواقع الإلكترونية، البريد الإلكتروني
 * 
 * @version 2.0 EXPANDED
 * @date 8 نوفمبر 2025
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
import { EnhancedSwitch } from '../EnhancedSwitch';
import { Label } from '../ui/label';
import {
  Building2, MapPin, Users, DollarSign, FileText, Zap,
  CheckCircle, Plus, Edit, Eye, Key, Activity, BarChart3, Building,
  Phone, Calendar, Receipt, CreditCard, Save, X, Trash2,
  Send, Mail, MessageSquare, Globe, Share2, Copy, Download, QrCode,
  Landmark, Scale, Shield, Briefcase, UserCheck, FileCheck,
  Server, Cloud, Database, Link, AlertTriangle, Bell
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';

// تكوين التابات - 14 تاباً
const TABS_CONFIG: TabConfig[] = [
  { id: '905-01', number: '905-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '905-02', number: '905-02', title: 'المقر الرئيسي', icon: Building2 },
  { id: '905-03', number: '905-03', title: 'قائمة الفروع', icon: Building },
  { id: '905-04', number: '905-04', title: 'الشركة المالكة', icon: Landmark },
  { id: '905-05', number: '905-05', title: 'الفروع الدولية', icon: Globe },
  { id: '905-06', number: '905-06', title: 'الإدارة والموظفين', icon: Users },
  { id: '905-07', number: '905-07', title: 'الملكية والإيجار', icon: Key },
  { id: '905-08', number: '905-08', title: 'الخدمات والمرافق', icon: Zap },
  { id: '905-09', number: '905-09', title: 'المواقع الإلكترونية', icon: Globe },
  { id: '905-10', number: '905-10', title: 'البريد الإلكتروني', icon: Mail },
  { id: '905-11', number: '905-11', title: 'الالتزامات المالية', icon: DollarSign },
  { id: '905-12', number: '905-12', title: 'المراسلات والإشعارات', icon: FileText },
  { id: '905-13', number: '905-13', title: 'الموقع والعنوان', icon: MapPin },
  { id: '905-14', number: '905-14', title: 'المستندات والعقود', icon: FileText },
];

// ============= INTERFACES =============

// الشركة المالكة
interface CompanyOwner {
  id: string;
  name: string;
  nameEn: string;
  nationality: string;
  country: string;
  commercialRegister: string;
  taxNumber: string;
  establishmentDate: string;
  capital: number;
  currency: string;
  foundingContract: {
    contractNumber: string;
    contractDate: string;
    lastUpdate: string;
    documentUrl: string;
    imageUrl: string;
  };
  owners: OwnerDetail[];
  management: CompanyManagement;
  taxDeclarations: TaxDeclaration[];
  headquarters: HeadquartersDetail;
}

interface OwnerDetail {
  id: string;
  name: string;
  nationality: string;
  idNumber: string;
  ownershipPercentage: number;
  authority: string; // الصلاحيات
  role: string; // المنصب
  phone: string;
  email: string;
  joinDate: string;
}

interface CompanyManagement {
  chairman: { name: string; phone: string; email: string };
  ceo: { name: string; phone: string; email: string };
  cfo: { name: string; phone: string; email: string };
  coo: { name: string; phone: string; email: string };
}

interface TaxDeclaration {
  id: string;
  declarationType: string;
  period: string;
  amount: number;
  status: string;
  submissionDate: string;
  dueDate: string;
  documentUrl: string;
}

interface HeadquartersDetail {
  city: string;
  district: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  employees: number;
  imageUrl: string;
}

// الفروع الدولية
interface InternationalBranch {
  id: string;
  country: string;
  state: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  manager: { name: string; phone: string; email: string };
  employees: number;
  establishedDate: string;
  commercialRegister: {
    number: string;
    issueDate: string;
    expiryDate: string;
    imageUrl: string;
  };
  foundingDocument: {
    number: string;
    date: string;
    imageUrl: string;
  };
  taxInfo: {
    taxNumber: string;
    vatNumber: string;
    taxOffice: string;
  };
  relatedEntities: RelatedEntity[];
  location: {
    latitude: number;
    longitude: number;
    mapUrl: string;
    imageUrl: string;
  };
  renewals: Renewal[];
  alerts: Alert[];
}

interface RelatedEntity {
  id: string;
  name: string;
  type: string;
  website: string;
  contactPerson: string;
  phone: string;
  email: string;
  relationship: string;
}

interface Renewal {
  id: string;
  itemType: string;
  currentExpiryDate: string;
  renewalDate: string;
  cost: number;
  status: string;
  reminderDays: number;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  isRead: boolean;
}

// المواقع الإلكترونية
interface Website {
  id: string;
  name: string;
  url: string;
  purpose: string;
  status: 'active' | 'inactive' | 'maintenance';
  domain: {
    name: string;
    provider: string;
    purchaseDate: string;
    expiryDate: string;
    duration: string;
    cost: number;
    currency: string;
    paymentMethod: string;
    purchasedBy: string;
    autoRenewal: boolean;
  };
  hosting: {
    provider: string;
    plan: string;
    storage: string;
    bandwidth: string;
    purchaseDate: string;
    expiryDate: string;
    monthlyCost: number;
    currency: string;
    paymentMethod: string;
  };
  development: {
    developedBy: string;
    platform: string;
    language: string;
    framework: string;
    database: string;
    startDate: string;
    launchDate: string;
    cost: number;
    currency: string;
  };
  dataStorage: {
    provider: string;
    type: string;
    location: string;
    capacity: string;
    backup: boolean;
    backupFrequency: string;
    monthlyCost: number;
    currency: string;
  };
  ssl: {
    provider: string;
    type: string;
    issueDate: string;
    expiryDate: string;
    autoRenewal: boolean;
  };
  technical: {
    adminEmail: string;
    techSupportEmail: string;
    ftpAccess: string;
    cpanelUrl: string;
    databaseUrl: string;
  };
  analytics: {
    monthlyVisitors: number;
    monthlyPageViews: number;
    lastUpdate: string;
  };
}

// البريد الإلكتروني
interface EmailService {
  id: string;
  emailAddress: string;
  type: string; // رسمي، إداري، دعم فني، مبيعات
  status: 'active' | 'inactive';
  domain: {
    name: string;
    provider: string;
    purchaseDate: string;
    expiryDate: string;
    duration: string;
    cost: number;
    currency: string;
    paymentMethod: string;
    purchasedBy: string;
    autoRenewal: boolean;
  };
  emailHosting: {
    provider: string;
    plan: string;
    mailboxes: number;
    storagePerMailbox: string;
    totalStorage: string;
    purchaseDate: string;
    expiryDate: string;
    monthlyCost: number;
    currency: string;
    paymentMethod: string;
  };
  configuration: {
    smtpServer: string;
    smtpPort: number;
    imapServer: string;
    imapPort: number;
    pop3Server: string;
    pop3Port: number;
    encryption: string;
    authentication: string;
  };
  security: {
    spamFilter: boolean;
    antiVirus: boolean;
    twoFactorAuth: boolean;
    encryption: boolean;
    backupEnabled: boolean;
    backupFrequency: string;
  };
  usage: {
    activeMailboxes: number;
    usedStorage: string;
    sentEmailsPerMonth: number;
    receivedEmailsPerMonth: number;
  };
  administrators: EmailAdmin[];
}

interface EmailAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  addedDate: string;
}

// ============= MOCK DATA =============

// بيانات الشركة المالكة
const companyOwnerData: CompanyOwner = {
  id: 'COMP-001',
  name: 'شركة الاستشارات الهندسية المتقدمة',
  nameEn: 'Advanced Engineering Consultancy Company',
  nationality: 'سعودي',
  country: 'المملكة العربية السعودية',
  commercialRegister: '1010123456',
  taxNumber: '300012345600003',
  establishmentDate: '2015-03-15',
  capital: 5000000,
  currency: 'ر.س',
  foundingContract: {
    contractNumber: 'FC-2015-001',
    contractDate: '2015-03-10',
    lastUpdate: '2023-06-20',
    documentUrl: '/documents/founding-contract.pdf',
    imageUrl: '/images/founding-contract.jpg',
  },
  owners: [
    {
      id: 'OWN-001',
      name: 'م. عبدالله بن محمد السالم',
      nationality: 'سعودي',
      idNumber: '1012345678',
      ownershipPercentage: 40,
      authority: 'رئيس مجلس الإدارة - صلاحيات كاملة',
      role: 'مؤسس ورئيس تنفيذي',
      phone: '+966 50 123 4567',
      email: 'abdullah@office.sa',
      joinDate: '2015-03-15',
    },
    {
      id: 'OWN-002',
      name: 'م. خالد بن أحمد العتيبي',
      nationality: 'سعودي',
      idNumber: '1023456789',
      ownershipPercentage: 30,
      authority: 'عضو مجلس إدارة - صلاحيات مالية',
      role: 'شريك ومدير مالي',
      phone: '+966 50 234 5678',
      email: 'khaled@office.sa',
      joinDate: '2015-03-15',
    },
    {
      id: 'OWN-003',
      name: 'د. سارة بنت عبدالرحمن المطيري',
      nationality: 'سعودي',
      idNumber: '1034567890',
      ownershipPercentage: 20,
      authority: 'عضو مجلس إدارة - صلاحيات تشغيلية',
      role: 'شريك ومدير عمليات',
      phone: '+966 50 345 6789',
      email: 'sarah@office.sa',
      joinDate: '2016-01-10',
    },
    {
      id: 'OWN-004',
      name: 'م. فهد بن سليمان القحطاني',
      nationality: 'سعودي',
      idNumber: '1045678901',
      ownershipPercentage: 10,
      authority: 'عضو مجلس إدارة - صلاحيات استشارية',
      role: 'شريك ومستشار فني',
      phone: '+966 50 456 7890',
      email: 'fahad@office.sa',
      joinDate: '2017-05-20',
    },
  ],
  management: {
    chairman: { name: 'م. عبدالله بن محمد السالم', phone: '+966 50 123 4567', email: 'abdullah@office.sa' },
    ceo: { name: 'م. خالد بن أحمد العتيبي', phone: '+966 50 234 5678', email: 'khaled@office.sa' },
    cfo: { name: 'أحمد بن علي الغامدي', phone: '+966 50 567 8901', email: 'cfo@office.sa' },
    coo: { name: 'د. سارة بنت عبدالرحمن المطيري', phone: '+966 50 345 6789', email: 'sarah@office.sa' },
  },
  taxDeclarations: [
    {
      id: 'TAX-001',
      declarationType: 'ضريبة القيمة المضافة',
      period: 'الربع الرابع 2024',
      amount: 125000,
      status: 'مقدم',
      submissionDate: '2025-01-15',
      dueDate: '2025-01-31',
      documentUrl: '/documents/vat-q4-2024.pdf',
    },
    {
      id: 'TAX-002',
      declarationType: 'الزكاة السنوية',
      period: '2024',
      amount: 87500,
      status: 'مقدم',
      submissionDate: '2025-02-20',
      dueDate: '2025-03-31',
      documentUrl: '/documents/zakat-2024.pdf',
    },
  ],
  headquarters: {
    city: 'الرياض',
    district: 'العليا',
    address: '7250 طريق الملك فهد، العليا',
    postalCode: '12211',
    phone: '+966 11 234 5678',
    email: 'info@office.sa',
    employees: 45,
    imageUrl: '/images/headquarters.jpg',
  },
};

// بيانات الفروع الدولية
const internationalBranches: InternationalBranch[] = [
  {
    id: 'INT-001',
    country: 'الإمارات العربية المتحدة',
    state: 'دبي',
    city: 'دبي',
    fullAddress: 'برج الأعمال، شارع الشيخ زايد، دبي، الإمارات',
    postalCode: '00000',
    phone: '+971 4 123 4567',
    email: 'dubai@office.ae',
    website: 'https://dubai.office.ae',
    manager: { name: 'م. ماجد بن سعيد الدوسري', phone: '+971 50 123 4567', email: 'majed.dubai@office.ae' },
    employees: 12,
    establishedDate: '2020-09-15',
    commercialRegister: {
      number: 'DXB-2020-12345',
      issueDate: '2020-09-15',
      expiryDate: '2025-09-15',
      imageUrl: '/images/dubai-cr.jpg',
    },
    foundingDocument: {
      number: 'FD-DXB-2020-001',
      date: '2020-09-10',
      imageUrl: '/images/dubai-founding.jpg',
    },
    taxInfo: {
      taxNumber: 'UAE-TAX-123456',
      vatNumber: '100012345600003',
      taxOffice: 'هيئة الضرائب الاتحادية',
    },
    relatedEntities: [
      {
        id: 'RE-001',
        name: 'بلدية دبي',
        type: 'جهة حكومية',
        website: 'https://dm.gov.ae',
        contactPerson: 'إدارة التراخيص',
        phone: '+971 4 221 5555',
        email: 'info@dm.gov.ae',
        relationship: 'جهة الترخيص',
      },
      {
        id: 'RE-002',
        name: 'الهيئة الاتحادية للضرائب',
        type: 'جهة حكومية',
        website: 'https://tax.gov.ae',
        contactPerson: 'قسم الشركات',
        phone: '+971 600 599 994',
        email: 'info@tax.gov.ae',
        relationship: 'الجهة الضريبية',
      },
    ],
    location: {
      latitude: 25.2048,
      longitude: 55.2708,
      mapUrl: 'https://maps.google.com/?q=25.2048,55.2708',
      imageUrl: '/images/dubai-location.jpg',
    },
    renewals: [
      {
        id: 'REN-001',
        itemType: 'السجل التجاري',
        currentExpiryDate: '2025-09-15',
        renewalDate: '2025-08-15',
        cost: 15000,
        status: 'قيد التنفيذ',
        reminderDays: 30,
      },
      {
        id: 'REN-002',
        itemType: 'عقد الإيجار',
        currentExpiryDate: '2025-12-31',
        renewalDate: '2025-11-30',
        cost: 180000,
        status: 'مجدول',
        reminderDays: 60,
      },
    ],
    alerts: [
      {
        id: 'ALT-001',
        type: 'تجديد السجل التجاري',
        message: 'يتطلب تجديد السجل التجاري خلال 6 أشهر',
        priority: 'high',
        date: '2025-03-15',
        isRead: false,
      },
    ],
  },
  {
    id: 'INT-002',
    country: 'مصر',
    state: 'القاهرة',
    city: 'القاهرة الجديدة',
    fullAddress: 'التجمع الخامس، الحي الثالث، القاهرة الجديدة، مصر',
    postalCode: '11835',
    phone: '+20 2 2617 1234',
    email: 'cairo@office.eg',
    website: 'https://cairo.office.eg',
    manager: { name: 'م. أحمد محمد حسن', phone: '+20 10 1234 5678', email: 'ahmed.cairo@office.eg' },
    employees: 8,
    establishedDate: '2021-03-20',
    commercialRegister: {
      number: 'CAI-2021-54321',
      issueDate: '2021-03-20',
      expiryDate: '2026-03-20',
      imageUrl: '/images/cairo-cr.jpg',
    },
    foundingDocument: {
      number: 'FD-CAI-2021-001',
      date: '2021-03-15',
      imageUrl: '/images/cairo-founding.jpg',
    },
    taxInfo: {
      taxNumber: 'EGY-TAX-654321',
      vatNumber: '200012345600003',
      taxOffice: 'مصلحة الضرائب المصرية',
    },
    relatedEntities: [
      {
        id: 'RE-003',
        name: 'هيئة التنمية الصناعية',
        type: 'جهة حكومية',
        website: 'https://ida.gov.eg',
        contactPerson: 'قسم التراخيص',
        phone: '+20 2 2617 8000',
        email: 'info@ida.gov.eg',
        relationship: 'جهة الترخيص',
      },
    ],
    location: {
      latitude: 30.0131,
      longitude: 31.4247,
      mapUrl: 'https://maps.google.com/?q=30.0131,31.4247',
      imageUrl: '/images/cairo-location.jpg',
    },
    renewals: [
      {
        id: 'REN-003',
        itemType: 'السجل التجاري',
        currentExpiryDate: '2026-03-20',
        renewalDate: '2026-02-20',
        cost: 8000,
        status: 'مجدول',
        reminderDays: 30,
      },
    ],
    alerts: [],
  },
];

// بيانات المواقع الإلكترونية
const websites: Website[] = [
  {
    id: 'WEB-001',
    name: 'الموقع الرسمي للشركة',
    url: 'https://office.sa',
    purpose: 'موقع رسمي للشركة - عرض الخدمات والمشاريع',
    status: 'active',
    domain: {
      name: 'office.sa',
      provider: 'SaudiNIC',
      purchaseDate: '2018-01-15',
      expiryDate: '2026-01-15',
      duration: '8 سنوات',
      cost: 1200,
      currency: 'ر.س',
      paymentMethod: 'تحويل بنكي',
      purchasedBy: 'م. عبدالله السالم',
      autoRenewal: true,
    },
    hosting: {
      provider: 'AWS (Amazon Web Services)',
      plan: 'Business Plan',
      storage: '100 GB SSD',
      bandwidth: 'غير محدود',
      purchaseDate: '2018-02-01',
      expiryDate: '2026-02-01',
      monthlyCost: 450,
      currency: 'ر.س',
      paymentMethod: 'بطاقة ائتمان',
    },
    development: {
      developedBy: 'شركة التقنية الحديثة للبرمجيات',
      platform: 'WordPress',
      language: 'PHP, JavaScript',
      framework: 'React.js',
      database: 'MySQL 8.0',
      startDate: '2018-01-20',
      launchDate: '2018-03-15',
      cost: 85000,
      currency: 'ر.س',
    },
    dataStorage: {
      provider: 'AWS S3',
      type: 'Cloud Storage',
      location: 'البحرين (AWS ME-South-1)',
      capacity: '500 GB',
      backup: true,
      backupFrequency: 'يومي',
      monthlyCost: 180,
      currency: 'ر.س',
    },
    ssl: {
      provider: 'Let\'s Encrypt',
      type: 'SSL/TLS (Wildcard)',
      issueDate: '2024-11-01',
      expiryDate: '2025-11-01',
      autoRenewal: true,
    },
    technical: {
      adminEmail: 'admin@office.sa',
      techSupportEmail: 'support@office.sa',
      ftpAccess: 'ftp.office.sa',
      cpanelUrl: 'https://cpanel.office.sa',
      databaseUrl: 'https://phpmyadmin.office.sa',
    },
    analytics: {
      monthlyVisitors: 12500,
      monthlyPageViews: 45000,
      lastUpdate: '2025-11-07',
    },
  },
  {
    id: 'WEB-002',
    name: 'بوابة العملاء',
    url: 'https://portal.office.sa',
    purpose: 'بوابة لإدارة حسابات العملاء ومتابعة المشاريع',
    status: 'active',
    domain: {
      name: 'portal.office.sa',
      provider: 'SaudiNIC',
      purchaseDate: '2020-06-01',
      expiryDate: '2025-06-01',
      duration: '5 سنوات',
      cost: 800,
      currency: 'ر.س',
      paymentMethod: 'تحويل بنكي',
      purchasedBy: 'م. خالد العتيبي',
      autoRenewal: true,
    },
    hosting: {
      provider: 'Microsoft Azure',
      plan: 'Premium Plan',
      storage: '250 GB SSD',
      bandwidth: 'غير محدود',
      purchaseDate: '2020-06-15',
      expiryDate: '2025-06-15',
      monthlyCost: 650,
      currency: 'ر.س',
      paymentMethod: 'بطاقة ائتمان',
    },
    development: {
      developedBy: 'فريق التطوير الداخلي',
      platform: 'Custom (Next.js)',
      language: 'TypeScript, Node.js',
      framework: 'Next.js 14',
      database: 'PostgreSQL 15',
      startDate: '2020-06-01',
      launchDate: '2020-09-15',
      cost: 150000,
      currency: 'ر.س',
    },
    dataStorage: {
      provider: 'Azure Blob Storage',
      type: 'Cloud Storage',
      location: 'الإمارات (UAE North)',
      capacity: '1 TB',
      backup: true,
      backupFrequency: 'كل 6 ساعات',
      monthlyCost: 320,
      currency: 'ر.س',
    },
    ssl: {
      provider: 'DigiCert',
      type: 'EV SSL (Extended Validation)',
      issueDate: '2024-09-15',
      expiryDate: '2025-09-15',
      autoRenewal: true,
    },
    technical: {
      adminEmail: 'portal-admin@office.sa',
      techSupportEmail: 'portal-support@office.sa',
      ftpAccess: 'sftp.portal.office.sa',
      cpanelUrl: 'N/A (Custom)',
      databaseUrl: 'https://db.portal.office.sa',
    },
    analytics: {
      monthlyVisitors: 3200,
      monthlyPageViews: 18500,
      lastUpdate: '2025-11-07',
    },
  },
];

// بيانات البريد الإلكتروني
const emailServices: EmailService[] = [
  {
    id: 'EMAIL-001',
    emailAddress: 'info@office.sa',
    type: 'رسمي',
    status: 'active',
    domain: {
      name: 'office.sa',
      provider: 'SaudiNIC',
      purchaseDate: '2018-01-15',
      expiryDate: '2026-01-15',
      duration: '8 سنوات',
      cost: 1200,
      currency: 'ر.س',
      paymentMethod: 'تحويل بنكي',
      purchasedBy: 'م. عبدالله السالم',
      autoRenewal: true,
    },
    emailHosting: {
      provider: 'Microsoft 365',
      plan: 'Business Premium',
      mailboxes: 50,
      storagePerMailbox: '50 GB',
      totalStorage: '2.5 TB',
      purchaseDate: '2018-02-01',
      expiryDate: '2026-02-01',
      monthlyCost: 1250,
      currency: 'ر.س',
      paymentMethod: 'بطاقة ائتمان',
    },
    configuration: {
      smtpServer: 'smtp.office365.com',
      smtpPort: 587,
      imapServer: 'outlook.office365.com',
      imapPort: 993,
      pop3Server: 'outlook.office365.com',
      pop3Port: 995,
      encryption: 'TLS/SSL',
      authentication: 'OAuth 2.0',
    },
    security: {
      spamFilter: true,
      antiVirus: true,
      twoFactorAuth: true,
      encryption: true,
      backupEnabled: true,
      backupFrequency: 'يومي',
    },
    usage: {
      activeMailboxes: 42,
      usedStorage: '1.8 TB',
      sentEmailsPerMonth: 8500,
      receivedEmailsPerMonth: 15200,
    },
    administrators: [
      {
        id: 'ADMIN-001',
        name: 'م. عبدالله السالم',
        email: 'abdullah@office.sa',
        role: 'مدير رئيسي',
        permissions: ['كامل الصلاحيات'],
        addedDate: '2018-02-01',
      },
      {
        id: 'ADMIN-002',
        name: 'أحمد الغامدي',
        email: 'it@office.sa',
        role: 'مدير IT',
        permissions: ['إدارة المستخدمين', 'إعدادات الأمان', 'النسخ الاحتياطي'],
        addedDate: '2019-03-15',
      },
    ],
  },
  {
    id: 'EMAIL-002',
    emailAddress: 'support@office.sa',
    type: 'دعم فني',
    status: 'active',
    domain: {
      name: 'office.sa',
      provider: 'SaudiNIC',
      purchaseDate: '2018-01-15',
      expiryDate: '2026-01-15',
      duration: '8 سنوات',
      cost: 0,
      currency: 'ر.س',
      paymentMethod: 'N/A',
      purchasedBy: 'N/A',
      autoRenewal: true,
    },
    emailHosting: {
      provider: 'Microsoft 365',
      plan: 'Business Premium (Shared)',
      mailboxes: 50,
      storagePerMailbox: '50 GB',
      totalStorage: '2.5 TB',
      purchaseDate: '2018-02-01',
      expiryDate: '2026-02-01',
      monthlyCost: 0,
      currency: 'ر.س',
      paymentMethod: 'ضمن الباقة الرئيسية',
    },
    configuration: {
      smtpServer: 'smtp.office365.com',
      smtpPort: 587,
      imapServer: 'outlook.office365.com',
      imapPort: 993,
      pop3Server: 'outlook.office365.com',
      pop3Port: 995,
      encryption: 'TLS/SSL',
      authentication: 'OAuth 2.0',
    },
    security: {
      spamFilter: true,
      antiVirus: true,
      twoFactorAuth: true,
      encryption: true,
      backupEnabled: true,
      backupFrequency: 'يومي',
    },
    usage: {
      activeMailboxes: 1,
      usedStorage: '18 GB',
      sentEmailsPerMonth: 1200,
      receivedEmailsPerMonth: 3500,
    },
    administrators: [
      {
        id: 'ADMIN-003',
        name: 'فريق الدعم الفني',
        email: 'support@office.sa',
        role: 'فريق',
        permissions: ['قراءة وإرسال البريد'],
        addedDate: '2019-06-01',
      },
    ],
  },
];

// ============= MAIN COMPONENT =============

export default function OfficeBranches_Complete_905_v2() {
  const [activeTab, setActiveTab] = useState('905-01');

  // State للشركة المالكة
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<OwnerDetail | null>(null);
  const [showAddOwnerDialog, setShowAddOwnerDialog] = useState(false);

  // State للفروع الدولية
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<InternationalBranch | null>(null);
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [showEntityDialog, setShowEntityDialog] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<RelatedEntity | null>(null);

  // State للمواقع الإلكترونية
  const [showWebsiteDialog, setShowWebsiteDialog] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);

  // State للبريد الإلكتروني
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailService | null>(null);
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false);

  // ============= RENDER FUNCTIONS =============

  const renderCompanyOwnerTab = () => (
    <div className="space-y-6">
      {/* معلومات الشركة الأساسية */}
      <Card className="card-rtl" style={{ border: '2px solid #f59e0b' }}>
        <CardHeader style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark className="h-5 w-5" style={{ color: '#f59e0b' }} />
            معلومات الشركة الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>اسم الشركة (عربي)</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.name}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>اسم الشركة (English)</Label>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.nameEn}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>الجنسية</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.nationality}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>الدولة</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.country}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>السجل التجاري</Label>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.commercialRegister}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>الرقم الضريبي</Label>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.taxNumber}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>تاريخ التأسيس</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {new Date(companyOwnerData.establishmentDate).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>رأس المال</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                {companyOwnerData.capital.toLocaleString()} {companyOwnerData.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الملاك ونسبهم */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '12px 16px' }}>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="h-5 w-5" style={{ color: '#2563eb' }} />
              الملاك ونسبهم وصلاحياتهم ({companyOwnerData.owners.length})
            </CardTitle>
            <Button
              onClick={() => setShowAddOwnerDialog(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                fontSize: '12px',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <Plus className="h-4 w-4" style={{ marginLeft: '4px' }} />
              إضافة مالك
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الاسم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الجنسية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>رقم الهوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>نسبة الملكية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الصلاحيات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>المنصب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyOwnerData.owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                      {owner.name}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {owner.nationality}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace', fontSize: '13px' }}>
                      {owner.idNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10b981' }}>
                          {owner.ownershipPercentage}%
                        </span>
                        <Progress
                          value={owner.ownershipPercentage}
                          style={{ width: '100px', height: '6px' }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                      {owner.authority}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                      <Badge
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11px',
                        }}
                      >
                        {owner.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <Button
                          onClick={() => {
                            setSelectedOwner(owner);
                            setShowOwnerDialog(true);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 8px',
                            fontSize: '11px',
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 8px',
                            fontSize: '11px',
                          }}
                        >
                          <Edit className="h-3 w-3" />
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

      {/* عقد التأسيس */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck className="h-5 w-5" style={{ color: '#ec4899' }} />
            عقد التأسيس وتحديثاته
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>رقم العقد</Label>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {companyOwnerData.foundingContract.contractNumber}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>تاريخ العقد</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {new Date(companyOwnerData.foundingContract.contractDate).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>آخر تحديث</Label>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                {new Date(companyOwnerData.foundingContract.lastUpdate).toLocaleDateString('ar-SA')}
              </p>
            </div>
            <div>
              <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#6b7280' }}>الإجراءات</Label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '11px',
                  }}
                >
                  <Eye className="h-3 w-3" style={{ marginLeft: '4px' }} />
                  عرض
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '11px',
                  }}
                >
                  <Download className="h-3 w-3" style={{ marginLeft: '4px' }} />
                  تحميل
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإقرارات الضريبية */}
      <Card className="card-rtl">
        <CardHeader style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', padding: '12px 16px' }}>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt className="h-5 w-5" style={{ color: '#10b981' }} />
            الإقرارات الضريبية ({companyOwnerData.taxDeclarations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>نوع الإقرار</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الفترة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>المبلغ</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>تاريخ التقديم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الموعد النهائي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyOwnerData.taxDeclarations.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                      {tax.declarationType}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {tax.period}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#10b981' }}>
                      {tax.amount.toLocaleString()} ر.س
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        style={{
                          background: tax.status === 'مقدم' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11px',
                        }}
                      >
                        {tax.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {new Date(tax.submissionDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}>
                      {new Date(tax.dueDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        style={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 8px',
                          fontSize: '11px',
                        }}
                      >
                        <Eye className="h-3 w-3" style={{ marginLeft: '4px' }} />
                        عرض
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInternationalBranchesTab = () => (
    <div className="space-y-6">
      {/* إحصائيات */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="card-rtl" style={{ border: '2px solid #2563eb' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  إجمالي الفروع
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {internationalBranches.length}
                </p>
              </div>
              <Globe className="h-8 w-8" style={{ color: '#2563eb', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الموظفون
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {internationalBranches.reduce((sum, b) => sum + b.employees, 0)}
                </p>
              </div>
              <Users className="h-8 w-8" style={{ color: '#10b981', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التجديدات القادمة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {internationalBranches.reduce((sum, b) => sum + b.renewals.length, 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8" style={{ color: '#f59e0b', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #ef4444' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التنبيهات
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {internationalBranches.reduce((sum, b) => sum + b.alerts.filter(a => !a.isRead).length, 0)}
                </p>
              </div>
              <Bell className="h-8 w-8" style={{ color: '#ef4444', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الجهات ذات الصلة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {internationalBranches.reduce((sum, b) => sum + b.relatedEntities.length, 0)}
                </p>
              </div>
              <Briefcase className="h-8 w-8" style={{ color: '#8b5cf6', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر إضافة */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => setShowAddBranchDialog(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus className="h-4 w-4" style={{ marginLeft: '6px' }} />
          إضافة فرع دولي
        </Button>
      </div>

      {/* قائمة الفروع */}
      {internationalBranches.map((branch) => (
        <Card key={branch.id} className="card-rtl">
          <CardHeader style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '12px 16px' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe className="h-5 w-5" style={{ color: '#2563eb' }} />
                فرع {branch.country} - {branch.city}
                <Badge
                  style={{
                    background: branch.alerts.length > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                    marginRight: '8px',
                  }}
                >
                  {branch.alerts.length > 0 ? `${branch.alerts.length} تنبيه` : 'لا توجد تنبيهات'}
                </Badge>
              </CardTitle>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowBranchDialog(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Eye className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  عرض التفاصيل
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Edit className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  تعديل
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>العنوان الكامل</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {branch.fullAddress}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الهاتف</Label>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {branch.phone}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الموظفون</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                  {branch.employees} موظف
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>تاريخ التأسيس</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {new Date(branch.establishedDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>السجل التجاري</Label>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {branch.commercialRegister.number}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>انتهاء السجل</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#f59e0b' }}>
                  {new Date(branch.commercialRegister.expiryDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المدير</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {branch.manager.name}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الجهات ذات الصلة</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#8b5cf6' }}>
                  {branch.relatedEntities.length} جهة
                </p>
              </div>
            </div>

            {/* التنبيهات إن وجدت */}
            {branch.alerts.length > 0 && (
              <div className="mt-4 p-3" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '8px', border: '2px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                    التنبيهات المهمة
                  </Label>
                </div>
                {branch.alerts.map((alert) => (
                  <div key={alert.id} className="mt-2 p-2" style={{ background: '#ffffff', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>
                          {alert.type}
                        </p>
                        <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                          {alert.message}
                        </p>
                      </div>
                      <Badge
                        style={{
                          background: alert.priority === 'high' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                                    alert.priority === 'medium' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '10px',
                        }}
                      >
                        {alert.priority === 'high' ? 'عاجل' : alert.priority === 'medium' ? 'متوسط' : 'عادي'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderWebsitesTab = () => (
    <div className="space-y-6">
      {/* إحصائيات */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="card-rtl" style={{ border: '2px solid #2563eb' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  المواقع النشطة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {websites.filter(w => w.status === 'active').length}
                </p>
              </div>
              <Globe className="h-8 w-8" style={{ color: '#2563eb', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الزوار الشهريون
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {websites.reduce((sum, w) => sum + w.analytics.monthlyVisitors, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8" style={{ color: '#10b981', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التكلفة الشهرية
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {websites.reduce((sum, w) => sum + w.hosting.monthlyCost + w.dataStorage.monthlyCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8" style={{ color: '#f59e0b', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التخزين الكلي
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  1.5 TB
                </p>
              </div>
              <Database className="h-8 w-8" style={{ color: '#8b5cf6', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الـ SSL
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {websites.filter(w => w.ssl.autoRenewal).length}/{websites.length}
                </p>
              </div>
              <Shield className="h-8 w-8" style={{ color: '#ec4899', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #06b6d4' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  موفرو الخدمة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  4
                </p>
              </div>
              <Server className="h-8 w-8" style={{ color: '#06b6d4', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر إضافة */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => setShowAddWebsiteDialog(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus className="h-4 w-4" style={{ marginLeft: '6px' }} />
          إضافة موقع إلكتروني
        </Button>
      </div>

      {/* قائمة المواقع */}
      {websites.map((website) => (
        <Card key={website.id} className="card-rtl">
          <CardHeader style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '12px 16px' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe className="h-5 w-5" style={{ color: '#2563eb' }} />
                {website.name}
                <Badge
                  style={{
                    background: website.status === 'active' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                               website.status === 'inactive' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                               'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                    marginRight: '8px',
                  }}
                >
                  {website.status === 'active' ? 'نشط' : website.status === 'inactive' ? 'غير نشط' : 'صيانة'}
                </Badge>
              </CardTitle>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button
                  onClick={() => {
                    setSelectedWebsite(website);
                    setShowWebsiteDialog(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Eye className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  عرض التفاصيل
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Edit className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  تعديل
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>رابط الموقع</Label>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: 'Courier New, monospace', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#2563eb', display: 'block' }}
                >
                  {website.url}
                </a>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الغرض</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.purpose}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>موفر الدومين</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.domain.provider}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>انتهاء الدومين</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#f59e0b' }}>
                  {new Date(website.domain.expiryDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>موفر الاستضافة</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.hosting.provider}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>التكلفة الشهرية</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                  {website.hosting.monthlyCost.toLocaleString()} {website.hosting.currency}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>موفر التخزين</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.dataStorage.provider}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>السعة</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.dataStorage.capacity}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المطور</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.development.developedBy}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المنصة</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {website.development.platform}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الزوار الشهريون</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#8b5cf6' }}>
                  {website.analytics.monthlyVisitors.toLocaleString()}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المشاهدات الشهرية</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#8b5cf6' }}>
                  {website.analytics.monthlyPageViews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmailServicesTab = () => (
    <div className="space-y-6">
      {/* إحصائيات */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="card-rtl" style={{ border: '2px solid #2563eb' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الحسابات النشطة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {emailServices.filter(e => e.status === 'active').length}
                </p>
              </div>
              <Mail className="h-8 w-8" style={{ color: '#2563eb', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #10b981' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  صناديق البريد
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {emailServices.reduce((sum, e) => sum + e.usage.activeMailboxes, 0)}
                </p>
              </div>
              <Users className="h-8 w-8" style={{ color: '#10b981', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #f59e0b' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التكلفة الشهرية
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {emailServices.reduce((sum, e) => sum + e.emailHosting.monthlyCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8" style={{ color: '#f59e0b', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #8b5cf6' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  التخزين المستخدم
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  1.8 TB
                </p>
              </div>
              <Database className="h-8 w-8" style={{ color: '#8b5cf6', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #ec4899' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الرسائل المرسلة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {emailServices.reduce((sum, e) => sum + e.usage.sentEmailsPerMonth, 0).toLocaleString()}
                </p>
              </div>
              <Send className="h-8 w-8" style={{ color: '#ec4899', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ border: '2px solid #06b6d4' }}>
          <CardContent className="p-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                  الرسائل المستلمة
                </p>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
                  {emailServices.reduce((sum, e) => sum + e.usage.receivedEmailsPerMonth, 0).toLocaleString()}
                </p>
              </div>
              <Mail className="h-8 w-8" style={{ color: '#06b6d4', opacity: 0.8 }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر إضافة */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => setShowAddEmailDialog(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            fontSize: '13px',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus className="h-4 w-4" style={{ marginLeft: '6px' }} />
          إضافة بريد إلكتروني
        </Button>
      </div>

      {/* قائمة البريد الإلكتروني */}
      {emailServices.map((email) => (
        <Card key={email.id} className="card-rtl">
          <CardHeader style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', padding: '12px 16px' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail className="h-5 w-5" style={{ color: '#2563eb' }} />
                {email.emailAddress}
                <Badge
                  style={{
                    background: email.type === 'رسمي' ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' : 
                               email.type === 'دعم فني' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                               'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                    marginRight: '8px',
                  }}
                >
                  {email.type}
                </Badge>
                <Badge
                  style={{
                    background: email.status === 'active' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                  }}
                >
                  {email.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </CardTitle>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button
                  onClick={() => {
                    setSelectedEmail(email);
                    setShowEmailDialog(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Eye className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  عرض التفاصيل
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  <Edit className="h-4 w-4" style={{ marginLeft: '4px' }} />
                  تعديل
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>موفر الدومين</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {email.domain.provider}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>انتهاء الدومين</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#f59e0b' }}>
                  {new Date(email.domain.expiryDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>موفر البريد</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {email.emailHosting.provider}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>الباقة</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {email.emailHosting.plan}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>صناديق البريد</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                  {email.usage.activeMailboxes} / {email.emailHosting.mailboxes}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>التخزين المستخدم</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#8b5cf6' }}>
                  {email.usage.usedStorage}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>التكلفة الشهرية</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                  {email.emailHosting.monthlyCost.toLocaleString()} {email.emailHosting.currency}
                </p>
              </div>
              <div>
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px', color: '#6b7280' }}>المدراء</Label>
                <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  {email.administrators.length} مدير
                </p>
              </div>
            </div>

            {/* الأمان */}
            <div className="mt-4 p-3" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderRadius: '8px', border: '2px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Shield className="h-5 w-5" style={{ color: '#10b981' }} />
                <Label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                  الأمان والحماية
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: email.security.spamFilter ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151' }}>
                    فلتر البريد المزعج
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: email.security.antiVirus ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151' }}>
                    مكافح الفيروسات
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: email.security.twoFactorAuth ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151' }}>
                    المصادقة الثنائية
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: email.security.encryption ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151' }}>
                    التشفير
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle className="h-4 w-4" style={{ color: email.security.backupEnabled ? '#10b981' : '#9ca3af' }} />
                  <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px', color: '#374151' }}>
                    النسخ الاحتياطي ({email.security.backupFrequency})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case '905-01':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-01: نظرة عامة - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-02':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-02: المقر الرئيسي - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-03':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-03: قائمة الفروع - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-04':
        return renderCompanyOwnerTab();
      case '905-05':
        return renderInternationalBranchesTab();
      case '905-06':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-06: الإدارة والموظفين - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-07':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-07: الملكية والإيجار - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-08':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-08: الخدمات والمرافق - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-09':
        return renderWebsitesTab();
      case '905-10':
        return renderEmailServicesTab();
      case '905-11':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-11: الالتزامات المالية - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-12':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-12: المراسلات والإشعارات - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-13':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-13: الموقع والعنوان - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case '905-14':
        return (
          <div className="space-y-4">
            <Card className="card-rtl">
              <CardContent className="p-6">
                <p style={{ fontFamily: 'Tajawal, sans-serif', textAlign: 'center', color: '#6b7280' }}>
                  التاب 905-14: المستندات والعقود - قيد التطوير
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl', minHeight: '100vh', background: '#f8fafc' }}>
      {/* هيدر الشاشة الموحد v4.2.2 */}
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
          {/* القسم الأيمن */}
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
              <Building2 
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
                    background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  فروع المكتب
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
                    905
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
                إدارة المقر الرئيسي والفروع المحلية والدولية
              </p>
            </div>
          </div>
          
          {/* القسم الأيسر */}
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
                14 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار الموحد للتابات */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* مساحة العمل */}
        <div className="flex-1" style={{ 
          minHeight: 'calc(100vh - 140px)',
          paddingRight: '20px',
          paddingLeft: '20px',
          paddingBottom: '20px'
        }}>
          <ScrollArea style={{ height: 'calc(100vh - 140px)' }}>
            {renderTabContent()}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
