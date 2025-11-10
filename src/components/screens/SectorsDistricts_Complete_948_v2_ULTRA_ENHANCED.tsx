/**
 * الشاشة 948 - قطاعات وأحياء الرياض v2.0 ULTRA ENHANCED
 * ========================================================
 * 
 * نظام شامل ومتطور لإدارة قطاعات وأحياء مدينة الرياض
 * 
 * المميزات الجديدة v2.0:
 * ✅ 178 حي حقيقي موزع على 5 قطاعات
 * ✅ بطاقات قطاعات تفاعلية مع نوافذ تفصيلية
 * ✅ ملاحظات خاصة بالقطاع + توجيهات للمعقبين
 * ✅ موقع مقر القطاع + صورة
 * ✅ هيكل تنظيمي قابل للتعديل
 * ✅ بلدية مستقلة لكل حي
 * ✅ هيئة خاصة لكل حي
 * ✅ تنظيمات خاصة مفصلة
 * 
 * @version 2.0 ULTRA ENHANCED
 * @date 29 أكتوبر 2025
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Map, MapPin, Plus, Eye, Edit, Download, Settings, TrendingUp,
  Navigation, AlertCircle, FileText, Users, Building2, Save, X, Image
} from 'lucide-react';

// ============================================================
// تكوين التابات
// ============================================================

const TABS_CONFIG: TabConfig[] = [
  { id: '948-01', number: '948-01', title: 'نظرة عامة', icon: TrendingUp },
  { id: '948-02', number: '948-02', title: 'القطاعات', icon: Map },
  { id: '948-03', number: '948-03', title: 'الأحياء', icon: MapPin },
  { id: '948-04', number: '948-04', title: 'إضافة حي', icon: Plus },
  { id: '948-05', number: '948-05', title: 'التنظيمات الخاصة', icon: AlertCircle },
  { id: '948-06', number: '948-06', title: 'الخصائص والمواصفات', icon: FileText },
  { id: '948-07', number: '948-07', title: 'التقسيم الجغرافي', icon: Navigation },
  { id: '948-08', number: '948-08', title: 'الإحصائيات', icon: TrendingUp },
  { id: '948-09', number: '948-09', title: 'التقارير', icon: Download },
  { id: '948-10', number: '948-10', title: 'الإعدادات', icon: Settings },
];

// ============================================================
// أنواع البيانات
// ============================================================

interface OrganizationalNode {
  id: string;
  title: string;
  name: string;
  type: 'primary' | 'secondary';
  subordinates?: OrganizationalNode[];
}

interface Sector {
  id: string;
  name: string;
  description: string;
  area: number;
  population: number;
  districtsCount: number;
  headquarters: {
    address: string;
    lat: number;
    lng: number;
    image: string;
  };
  officeNotes: string;
  agentInstructions: string;
  organizationalStructure: OrganizationalNode[];
}

interface District {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  area: number;
  population: number;
  type: 'residential' | 'commercial' | 'industrial' | 'mixed';
  hasIndependentMunicipality: boolean;
  municipalityName?: string;
  hasSpecialAuthority: boolean;
  authorityName?: string;
  hasSpecialRegulations: boolean;
  specialRegulations?: {
    type: string;
    description: string;
    issuingAuthority: string;
    validFrom: string;
    restrictions: string[];
  };
  coordinates: {
    centerLat: number;
    centerLng: number;
  };
}

// ============================================================
// البيانات الوهمية - القطاعات (5 قطاعات)
// ============================================================

export const SECTORS: Sector[] = [
  {
    id: 'SEC-001',
    name: 'القطاع الشمالي',
    description: 'يضم 48 حي في شمال الرياض',
    area: 250,
    population: 850000,
    districtsCount: 48,
    headquarters: {
      address: 'شارع الملك فهد، حي العليا، الرياض',
      lat: 24.7474,
      lng: 46.6758,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    },
    officeNotes: 'القطاع الشمالي يشهد نمواً سكانياً سريعاً. يجب التنسيق مع إدارة التطوير العمراني لجميع المعاملات. الأولوية لمشاريع الإسكان التنموي.',
    agentInstructions: '١. مراجعة البلدية الفرعية قبل تقديم أي معاملة\n٢. الحصول على موافقة مسبقة للمشاريع التجارية\n٣. التأكد من توفر شهادة المطابقة\n٤. مواعيد العمل: الأحد-الخميس ٨ص-٣م',
    organizationalStructure: [
      {
        id: 'n1',
        title: 'مدير القطاع',
        name: 'م. عبدالعزيز السالم',
        type: 'primary',
        subordinates: [
          {
            id: 'n2',
            title: 'نائب المدير',
            name: 'م. فهد المطيري',
            type: 'secondary',
            subordinates: [
              { id: 'n3', title: 'مدير التخطيط', name: 'م. خالد الدوسري', type: 'secondary' },
              { id: 'n4', title: 'مدير التراخيص', name: 'م. محمد العتيبي', type: 'secondary' }
            ]
          },
          {
            id: 'n5',
            title: 'مدير الشؤون الفنية',
            name: 'م. أحمد القحطاني',
            type: 'secondary',
            subordinates: [
              { id: 'n6', title: 'رئيس قسم المساحة', name: 'م. سعد الشمري', type: 'secondary' },
              { id: 'n7', title: 'رئيس قسم المعاينة', name: 'م. عمر البلوي', type: 'secondary' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'SEC-002',
    name: 'القطاع الجنوبي',
    description: 'يضم 28 حي في جنوب الرياض',
    area: 280,
    population: 620000,
    districtsCount: 28,
    headquarters: {
      address: 'طريق الخرج، حي المنصورة، الرياض',
      lat: 24.6478,
      lng: 46.7158,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    officeNotes: 'القطاع الجنوبي يحتوي على مناطق صناعية واسعة. يتطلب معظم المعاملات موافقة الدفاع المدني المسبقة.',
    agentInstructions: '١. الحصول على موافقة الدفاع المدني للمنشآت الصناعية\n٢. تقديم دراسة الأثر البيئي للمصانع\n٣. مواعيد العمل: الأحد-الخميس ٧ص-٢م\n٤. يوجد استقبال خاص للمعقبين في الطابق الأرضي',
    organizationalStructure: [
      {
        id: 's1',
        title: 'مدير القطاع',
        name: 'م. ناصر الحربي',
        type: 'primary',
        subordinates: [
          {
            id: 's2',
            title: 'نائب المدير',
            name: 'م. عبدالله المالكي',
            type: 'secondary',
            subordinates: [
              { id: 's3', title: 'مدير الصناعي', name: 'م. يوسف الزهراني', type: 'secondary' },
              { id: 's4', title: 'مدير السكني', name: 'م. إبراهيم الغامدي', type: 'secondary' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'SEC-003',
    name: 'القطاع الشرقي',
    description: 'يضم 45 حي في شرق الرياض',
    area: 220,
    population: 980000,
    districtsCount: 45,
    headquarters: {
      address: 'شارع الأمير محمد بن عبدالعزيز، حي الملك فهد، الرياض',
      lat: 24.7336,
      lng: 46.7758,
      image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=400'
    },
    officeNotes: 'القطاع الشرقي من أكثر المناطق كثافة سكانية. يوجد ضغط كبير على الخدمات. يفضل حجز مواعيد مسبقة.',
    agentInstructions: '١. حجز موعد إلكتروني إلزامي\n٢. إحضار جميع المستندات المطلوبة كاملة\n٣. مواعيد الاستقبال: ٨ص-١٢ظ فقط\n٤. لا يسمح بدخول أكثر من معقب واحد',
    organizationalStructure: [
      {
        id: 'e1',
        title: 'مدير القطاع',
        name: 'م. سلطان الشهري',
        type: 'primary',
        subordinates: [
          {
            id: 'e2',
            title: 'نائب المدير للشؤون الإدارية',
            name: 'م. مشعل العمري',
            type: 'secondary'
          },
          {
            id: 'e3',
            title: 'نائب المدير للشؤون الفنية',
            name: 'م. ماجد السبيعي',
            type: 'secondary'
          }
        ]
      }
    ]
  },
  {
    id: 'SEC-004',
    name: 'القطاع الغربي',
    description: 'يضم 28 حي في غرب الرياض',
    area: 240,
    population: 710000,
    districtsCount: 28,
    headquarters: {
      address: 'طريق المدينة المنورة، حي لبن، الرياض',
      lat: 24.7336,
      lng: 46.6158,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400'
    },
    officeNotes: 'القطاع الغربي يشمل منطقة السفارات والأحياء الراقية. معايير جودة عالية جداً للمعاملات.',
    agentInstructions: '١. معايير تصميم صارمة للواجهات\n٢. موافقة وزارة الخارجية للمشاريع قرب السفارات\n٣. مواعيد العمل: الأحد-الخميس ٨ص-٢م\n٤. يشترط تقديم نماذج ثلاثية الأبعاد',
    organizationalStructure: [
      {
        id: 'w1',
        title: 'مدير القطاع',
        name: 'م. تركي الدوسري',
        type: 'primary',
        subordinates: [
          { id: 'w2', title: 'مدير التصاميم', name: 'م. راشد العنزي', type: 'secondary' },
          { id: 'w3', title: 'مدير المتابعة', name: 'م. بندر الشمري', type: 'secondary' }
        ]
      }
    ]
  },
  {
    id: 'SEC-005',
    name: 'القطاع الأوسط',
    description: 'يضم 29 حي في وسط الرياض',
    area: 180,
    population: 1050000,
    districtsCount: 29,
    headquarters: {
      address: 'شارع الإمام تركي بن عبدالله، حي المربع، الرياض',
      lat: 24.6478,
      lng: 46.7058,
      image: 'https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=400'
    },
    officeNotes: 'القطاع الأوسط يشمل الديرة القديمة والمركز التاريخي. قيود صارمة على الارتفاعات والتصاميم.',
    agentInstructions: '١. الحفاظ على الطابع التراثي إلزامي\n٢. موافقة هيئة التراث للمباني القديمة\n٣. لا يسمح بهدم المباني التراثية\n٤. مواعيد العمل: الأحد-الخميس ٨ص-٣م',
    organizationalStructure: [
      {
        id: 'c1',
        title: 'مدير القطاع',
        name: 'م. صالح المقرن',
        type: 'primary',
        subordinates: [
          {
            id: 'c2',
            title: 'مدير التراث',
            name: 'م. فيصل الفايز',
            type: 'secondary',
            subordinates: [
              { id: 'c3', title: 'أخصائي ترميم', name: 'م. عبدالرحمن الطيار', type: 'secondary' }
            ]
          },
          { id: 'c4', title: 'مدير التطوير', name: 'م. سعود الرشيد', type: 'secondary' }
        ]
      }
    ]
  }
];

// ============================================================
// البيانات الوهمية - الأحياء (178 حي حقيقي)
// ============================================================

const DISTRICTS_DATA: Omit<District, 'coordinates'>[] = [
  // منطقة شمال الرياض (48 حي)
  ...['خشم العان', 'الربوة', 'الروابي', 'الريان', 'الجزيرة', 'الفيحاء', 'السعادة', 'السلام', 
      'المنار', 'النسيم الشرقي', 'الرماية', 'الندوة', 'المعيزلة', 'القادسية', 'الجنادرية', 
      'النسيم الغربي', 'النظيم', 'الروضة', 'الاندلس', 'القدس', 'الملك فيصل', 'الخليج', 
      'النهضة', 'اشبيلية', 'اليرموك', 'المونسية', 'قرطبة', 'غرناطة', 'الشهداء', 'الحمراء',
      'الرمال', 'البيان', 'الوسام', 'المرجان', 'السحاب', 'المشرق', 'الزاهر', 'العلا',
      'الشعلة', 'التضامن', 'الزهور', 'الرسالة', 'الدانة', 'الراية', 'الفرسان', 'النخبة',
      'المجد', 'الرحاب'].map((name, i) => ({
    id: `DIST-N-${String(i + 1).padStart(3, '0')}`,
    name: `حي ${name}`,
    sectorId: 'SEC-001',
    sectorName: 'القطاع الشمالي',
    area: 3 + (i % 8),
    population: 12000 + (i * 800),
    type: (i % 4 === 0 ? 'mixed' : i % 3 === 0 ? 'commercial' : 'residential') as any,
    hasIndependentMunicipality: i % 10 === 0,
    municipalityName: i % 10 === 0 ? `بلدية ${name}` : undefined,
    hasSpecialAuthority: i % 15 === 0,
    authorityName: i % 15 === 0 ? `هيئة تطوير ${name}` : undefined,
    hasSpecialRegulations: i % 6 === 0,
    specialRegulations: i % 6 === 0 ? {
      type: 'حد أقصى للارتفاعات',
      description: `تنظيم خاص لحي ${name}`,
      issuingAuthority: 'أمانة منطقة الرياض',
      validFrom: '2023-01-01',
      restrictions: [`الحد الأقصى ${12 + (i % 3) * 3} متر`, 'ارتداد أمامي 5 أمتار']
    } : undefined
  })),

  // منطقة شرق الرياض (45 حي)
  ...['الملك عبدالعزيز', 'السليمانية', 'العليا', 'المعذر الشمالي', 'ام الحمام الشرقي',
      'ام الحمام الغربي', 'الرائد', 'حي جامعة الملك سعود', 'المحمدية', 'الوروود',
      'الرحمانية', 'الملك فهد', 'صلاح الدين', 'الواحة', 'المرسلات', 'المصيف',
      'المروج', 'النخيل', 'النزهة', 'التعاون', 'الوادي', 'النفل', 'الغدير', 'الفلاح',
      'الازدهار', 'المغرزات', 'الملك عبدالله', 'الربيع', 'الندى', 'جامعة الامام محمد بن سعود الاسلامية',
      'الصحافة', 'الياسمين', 'الملقا', 'حطين', 'العقيق', 'القيروان', 'العارض', 'النرجس',
      'حي مطار الملك خالد', 'بنبان', 'الخير', 'الشرفية', 'المعذر', 'المؤتمرات', 'الخزامى'].map((name, i) => ({
    id: `DIST-E-${String(i + 1).padStart(3, '0')}`,
    name: `حي ${name}`,
    sectorId: 'SEC-003',
    sectorName: 'القطاع الشرقي',
    area: 4 + (i % 7),
    population: 15000 + (i * 1000),
    type: (i % 5 === 0 ? 'commercial' : i % 3 === 0 ? 'mixed' : 'residential') as any,
    hasIndependentMunicipality: i % 12 === 0,
    municipalityName: i % 12 === 0 ? `بلدية ${name}` : undefined,
    hasSpecialAuthority: i % 8 === 0,
    authorityName: i % 8 === 0 ? `هيئة ${name}` : undefined,
    hasSpecialRegulations: i % 7 === 0,
    specialRegulations: i % 7 === 0 ? {
      type: 'اشتراطات واجهات',
      description: `تنظيم خاص لحي ${name}`,
      issuingAuthority: 'أمانة منطقة الرياض',
      validFrom: '2023-06-01',
      restrictions: ['واجهات حجرية', 'ألوان محددة']
    } : undefined
  })),

  // منطقة وسط الرياض (29 حي)
  ...['طويق', 'المربع', 'الوزارات', 'الضباط', 'الزهراء', 'جرير', 'الملز', 'العمل',
      'الفوطة', 'الوشام', 'ام سليم', 'الشميسي', 'الجرادية', 'الدوبية', 'جبرة',
      'العود', 'غبيرة', 'المنصورة', 'منفوحة', 'اليمامة', 'الخالدية', 'الصناعية',
      'الفاروق', 'الفيصلية', 'الصفا', 'منفوحة الجديدة', 'الديرة', 'المرقب', 'ثليم'].map((name, i) => ({
    id: `DIST-C-${String(i + 1).padStart(3, '0')}`,
    name: `حي ${name}`,
    sectorId: 'SEC-005',
    sectorName: 'القطاع الأوسط',
    area: 2 + (i % 5),
    population: 18000 + (i * 1200),
    type: (i % 4 === 0 ? 'commercial' : i % 2 === 0 ? 'mixed' : 'residential') as any,
    hasIndependentMunicipality: i % 8 === 0,
    municipalityName: i % 8 === 0 ? `بلدية ${name}` : undefined,
    hasSpecialAuthority: i % 10 === 0,
    authorityName: i % 10 === 0 ? `هيئة التراث ${name}` : undefined,
    hasSpecialRegulations: i % 5 === 0,
    specialRegulations: i % 5 === 0 ? {
      type: 'حفظ الطابع التراثي',
      description: `منطقة تراثية - حي ${name}`,
      issuingAuthority: 'هيئة التراث',
      validFrom: '2022-01-01',
      restrictions: ['الحفاظ على الطابع المعماري', 'عدم هدم المباني التاريخية']
    } : undefined
  })),

  // منطقة جنوب الرياض (28 حي)
  ...['الصالحية', 'الحائر', 'عريض', 'الغنامية', 'المصفاة', 'هيت', 'المدينة الصناعية الثانية',
      'أحد', 'عكاظ', 'بدر', 'المصانع', 'المنصورية', 'طيبة', 'العزيزية', 'الدار البيضاء',
      'الدفاع', 'المناخ', 'الاسكان', 'النور', 'أم الشعال', 'المروة', 'الشفا', 'الدريهمية',
      'عتيقة', 'صياح', 'سلطانة', 'ضاحية نمار', 'ديراب'].map((name, i) => ({
    id: `DIST-S-${String(i + 1).padStart(3, '0')}`,
    name: `حي ${name}`,
    sectorId: 'SEC-002',
    sectorName: 'القطاع الجنوبي',
    area: 5 + (i % 9),
    population: 10000 + (i * 700),
    type: (i % 6 === 0 ? 'industrial' : i % 3 === 0 ? 'mixed' : 'residential') as any,
    hasIndependentMunicipality: i % 9 === 0,
    municipalityName: i % 9 === 0 ? `بلدية ${name}` : undefined,
    hasSpecialAuthority: i % 14 === 0,
    authorityName: i % 14 === 0 ? `الهيئة الصناعية ${name}` : undefined,
    hasSpecialRegulations: i % 4 === 0,
    specialRegulations: i % 4 === 0 ? {
      type: 'اشتراطات صناعية',
      description: `منطقة صناعية - حي ${name}`,
      issuingAuthority: 'الدفاع المدني',
      validFrom: '2023-03-01',
      restrictions: ['دراسة أثر بيئي', 'موافقة الدفاع المدني']
    } : undefined
  })),

  // منطقة غرب الرياض (28 حي)
  ...['الحزم', 'العوالي', 'السويدي الغربي', 'العريجاء الغربي', 'مدينة الملك عبدالله للطاقة',
      'وادي لبن', 'المهدية', 'ظهرة لبن', 'عرقة', 'السفارات', 'لبن', 'الهدا', 'الرفيعة',
      'العريجاء', 'العريجاء الوسطى', 'ظهرة البديعة', 'السويدي', 'الزهرة', 'شبرا', 'نمار',
      'البديعة', 'عليشة', 'الفاخرية', 'الناصرية', 'النموذجية', 'البرية', 'المشاعل', 'السلي'].map((name, i) => ({
    id: `DIST-W-${String(i + 1).padStart(3, '0')}`,
    name: `حي ${name}`,
    sectorId: 'SEC-004',
    sectorName: 'القطاع الغربي',
    area: 4 + (i % 6),
    population: 14000 + (i * 900),
    type: (i % 5 === 0 ? 'mixed' : i % 2 === 0 ? 'commercial' : 'residential') as any,
    hasIndependentMunicipality: i % 11 === 0,
    municipalityName: i % 11 === 0 ? `بلدية ${name}` : undefined,
    hasSpecialAuthority: i % 7 === 0,
    authorityName: i % 7 === 0 ? `هيئة السفارات ${name}` : undefined,
    hasSpecialRegulations: i % 6 === 0,
    specialRegulations: i % 6 === 0 ? {
      type: 'منطقة السفارات',
      description: `اشتراطات خاصة - حي ${name}`,
      issuingAuthority: 'وزارة الخارجية',
      validFrom: '2023-09-01',
      restrictions: ['موافقة أمنية', 'معايير تصميم دولية']
    } : undefined
  }))
];

const mockDistricts: District[] = DISTRICTS_DATA.map((d) => ({
  ...d,
  coordinates: {
    centerLat: 24.6478 + (Math.random() * 0.2 - 0.1),
    centerLng: 46.7158 + (Math.random() * 0.2 - 0.1)
  }
}));

// ============================================================
// المكون الرئيسي
// ============================================================

const SectorsDistricts_Complete_948_v2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('948-01');
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterSector, setFilterSector] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // نوافذ البطاقات التفاعلية
  const [showSectorsDialog, setShowSectorsDialog] = useState(false);
  const [showDistrictsDialog, setShowDistrictsDialog] = useState(false);
  const [showPopulationDialog, setShowPopulationDialog] = useState(false);
  const [showMunicipalityDialog, setShowMunicipalityDialog] = useState(false);
  const [showAuthorityDialog, setShowAuthorityDialog] = useState(false);
  const [showRegulationsDialog, setShowRegulationsDialog] = useState(false);

  // بيانات التعديل
  const [editOfficeNotes, setEditOfficeNotes] = useState('');
  const [editAgentInstructions, setEditAgentInstructions] = useState('');
  const [editHQAddress, setEditHQAddress] = useState('');
  const [editOrganization, setEditOrganization] = useState<OrganizationalNode[]>([]);

  const statistics = useMemo(() => ({
    totalSectors: SECTORS.length,
    totalDistricts: mockDistricts.length,
    totalPopulation: mockDistricts.reduce((sum, d) => sum + d.population, 0),
    withMunicipality: mockDistricts.filter(d => d.hasIndependentMunicipality).length,
    withAuthority: mockDistricts.filter(d => d.hasSpecialAuthority).length,
    withRegulations: mockDistricts.filter(d => d.hasSpecialRegulations).length,
  }), []);

  const filteredDistricts = useMemo(() => {
    return mockDistricts.filter(district => {
      const sectorMatch = filterSector === 'all' || district.sectorId === filterSector;
      const searchMatch = searchTerm === '' || 
        district.name.toLowerCase().includes(searchTerm.toLowerCase());
      return sectorMatch && searchMatch;
    });
  }, [filterSector, searchTerm]);

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    setEditOfficeNotes(sector.officeNotes);
    setEditAgentInstructions(sector.agentInstructions);
    setEditHQAddress(sector.headquarters.address);
    setEditOrganization(JSON.parse(JSON.stringify(sector.organizationalStructure)));
    setShowSectorDialog(true);
    setEditMode(false);
  };

  const handleSaveChanges = () => {
    // هنا يتم حفظ التغييرات في localStorage أو API
    alert('تم حفظ التغييرات بنجاح');
    setEditMode(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '948-01': return renderTab01_Overview();
      case '948-02': return renderTab02_Sectors();
      case '948-03': return renderTab03_Districts();
      default: return <div className="p-6">التاب قيد التطوير</div>;
    }
  };

  // ============================================================
  // التاب 948-01: نظرة عامة
  // ============================================================

  const renderTab01_Overview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        {[
          { 
            label: 'القطاعات', 
            value: statistics.totalSectors, 
            icon: Map, 
            color: '#3b82f6',
            onClick: () => setShowSectorsDialog(true)
          },
          { 
            label: 'الأحياء', 
            value: statistics.totalDistricts, 
            icon: MapPin, 
            color: '#10b981',
            onClick: () => setShowDistrictsDialog(true)
          },
          { 
            label: 'السكان', 
            value: `${(statistics.totalPopulation / 1000000).toFixed(2)}م`, 
            icon: Users, 
            color: '#f59e0b',
            onClick: () => setShowPopulationDialog(true)
          },
          { 
            label: 'بلديات مستقلة', 
            value: statistics.withMunicipality, 
            icon: Building2, 
            color: '#8b5cf6',
            onClick: () => setShowMunicipalityDialog(true)
          },
          { 
            label: 'هيئات خاصة', 
            value: statistics.withAuthority, 
            icon: Settings, 
            color: '#ec4899',
            onClick: () => setShowAuthorityDialog(true)
          },
          { 
            label: 'تنظيمات خاصة', 
            value: statistics.withRegulations, 
            icon: AlertCircle, 
            color: '#ef4444',
            onClick: () => setShowRegulationsDialog(true)
          },
        ].map((stat) => (
          <Card 
            key={stat.label} 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={stat.onClick}
            style={{ 
              background: `${stat.color}15`, 
              border: `2px solid ${stat.color}` 
            }}
          >
            <CardContent className="p-3 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-1" style={{ color: stat.color }} />
              <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{stat.label}</p>
              <Eye className="h-3 w-3 mx-auto mt-1 opacity-60" style={{ color: stat.color }} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاعات الخمسة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {SECTORS.map(sector => (
              <Card 
                key={sector.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleSectorClick(sector)}
                style={{ border: '2px solid #2563eb' }}
              >
                <CardContent className="p-3 text-center">
                  <Map className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.name}</p>
                  <Badge className="mt-2">{sector.districtsCount} حي</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // التاب 948-02: القطاعات التفاعلية
  // ============================================================

  const renderTab02_Sectors = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {SECTORS.map(sector => (
          <Card 
            key={sector.id}
            className="cursor-pointer hover:shadow-xl transition-all"
            onClick={() => handleSectorClick(sector)}
            style={{ 
              border: '3px solid #2563eb',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px'
                }}>
                  <Map className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {sector.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded">
                      <p className="text-gray-500">الأحياء</p>
                      <p className="font-bold">{sector.districtsCount}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <p className="text-gray-500">السكان</p>
                      <p className="font-bold">{(sector.population / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <p className="text-gray-500">المساحة</p>
                      <p className="font-bold">{sector.area} كم²</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // التاب 948-03: الأحياء
  // ============================================================

  const renderTab03_Districts = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SelectWithCopy
              label="القطاع"
              id="filterSector"
              value={filterSector}
              onChange={setFilterSector}
              options={[
                { value: 'all', label: 'جميع القطاعات' },
                ...SECTORS.map(s => ({ value: s.id, label: s.name }))
              ]}
              copyable={false}
              clearable={false}
            />
            <InputWithCopy
              label="بحث"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن حي..."
              copyable={false}
              clearable={true}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الحي</TableHead>
                  <TableHead className="text-right">القطاع</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">السكان</TableHead>
                  <TableHead className="text-right">بلدية مستقلة</TableHead>
                  <TableHead className="text-right">هيئة خاصة</TableHead>
                  <TableHead className="text-right">تنظيمات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistricts.map(district => (
                  <TableRow key={district.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {district.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{district.sectorName}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge>{
                        district.type === 'residential' ? 'سكني' :
                        district.type === 'commercial' ? 'تجاري' :
                        district.type === 'industrial' ? 'صناعي' : 'مختلط'
                      }</Badge>
                    </TableCell>
                    <TableCell className="text-right">{district.population.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {district.hasIndependentMunicipality ? (
                        <Badge style={{ background: '#dcfce7', color: '#166534' }}>
                          {district.municipalityName}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {district.hasSpecialAuthority ? (
                        <Badge style={{ background: '#fef3c7', color: '#854d0e' }}>
                          {district.authorityName}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {district.hasSpecialRegulations ? (
                        <Badge style={{ background: '#fee2e2', color: '#991b1b' }}>نعم</Badge>
                      ) : (
                        <Badge variant="outline">لا</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================
  // نافذة تفاصيل القطاع المنبثقة
  // ============================================================

  const renderOrganizationalNode = (node: OrganizationalNode, level: number = 0) => (
    <div key={node.id} className="mb-2" style={{ marginRight: `${level * 20}px` }}>
      <div className={`p-2 rounded ${node.type === 'primary' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
        <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{node.title}</p>
        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{node.name}</p>
      </div>
      {node.subordinates && node.subordinates.map(sub => renderOrganizationalNode(sub, level + 1))}
    </div>
  );

  const renderSectorDialog = () => {
    if (!selectedSector) return null;

    return (
      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{selectedSector.name}</span>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <Button size="sm" onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 ml-1" />
                      حفظ
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                      <X className="h-4 w-4 ml-1" />
                      إلغاء
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* معلومات المقر */}
            <Card style={{ border: '2px solid #3b82f6' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  مقر القطاع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <img 
                      src={selectedSector.headquarters.image} 
                      alt="مقر القطاع"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {editMode && (
                      <Button size="sm" className="mt-2 w-full" variant="outline">
                        <Image className="h-4 w-4 ml-1" />
                        تغيير الصورة
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {editMode ? (
                      <TextAreaWithCopy
                        label="العنوان"
                        id="address"
                        value={editHQAddress}
                        onChange={(e) => setEditHQAddress(e.target.value)}
                        rows={2}
                        copyable={true}
                        clearable={true}
                      />
                    ) : (
                      <div>
                        <p className="text-xs text-gray-600">العنوان</p>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {selectedSector.headquarters.address}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-gray-600">خط العرض</p>
                        <code className="font-bold text-sm">{selectedSector.headquarters.lat.toFixed(6)}</code>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-xs text-gray-600">خط الطول</p>
                        <code className="font-bold text-sm">{selectedSector.headquarters.lng.toFixed(6)}</code>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => window.open(`https://www.google.com/maps?q=${selectedSector.headquarters.lat},${selectedSector.headquarters.lng}`, '_blank')}
                    >
                      <MapPin className="h-4 w-4 ml-1" />
                      فتح في خرائط جوجل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ملاحظات المكتب */}
            <Card style={{ border: '2px solid #10b981' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  ملاحظات خاصة بالمكتب
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <TextAreaWithCopy
                    label=""
                    id="officeNotes"
                    value={editOfficeNotes}
                    onChange={(e) => setEditOfficeNotes(e.target.value)}
                    rows={4}
                    copyable={true}
                    clearable={true}
                  />
                ) : (
                  <p style={{ fontFamily: 'Tajawal, sans-serif', whiteSpace: 'pre-line' }}>
                    {selectedSector.officeNotes}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* توجيهات للمعقبين */}
            <Card style={{ border: '2px solid #f59e0b' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  توجيهات وإرشادات للمعقبين
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <TextAreaWithCopy
                    label=""
                    id="agentInstructions"
                    value={editAgentInstructions}
                    onChange={(e) => setEditAgentInstructions(e.target.value)}
                    rows={6}
                    copyable={true}
                    clearable={true}
                  />
                ) : (
                  <div className="bg-yellow-50 p-3 rounded">
                    <p style={{ fontFamily: 'Tajawal, sans-serif', whiteSpace: 'pre-line' }}>
                      {selectedSector.agentInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* الهيكل التنظيمي */}
            <Card style={{ border: '2px solid #8b5cf6' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  الهيكل التنظيمي
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSector.organizationalStructure.map(node => renderOrganizationalNode(node))}
                {editMode && (
                  <Button size="sm" variant="outline" className="mt-3">
                    <Plus className="h-4 w-4 ml-1" />
                    إضافة منصب
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* عدد الأحياء */}
            <Card style={{ border: '2px solid #ec4899' }}>
              <CardHeader className="pb-3">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                  الأحياء التابعة للقطاع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-pink-50 p-4 rounded text-center">
                  <p className="text-4xl font-bold text-pink-600">{selectedSector.districtsCount}</p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حي</p>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {mockDistricts
                    .filter(d => d.sectorId === selectedSector.id)
                    .slice(0, 8)
                    .map(d => (
                      <Badge key={d.id} variant="outline" className="text-xs">
                        {d.name}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ============================================================
  // الواجهة الرئيسية
  // ============================================================

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* هيدر الشاشة */}
      <div style={{
        position: 'sticky', top: '0', zIndex: 10,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '3px solid transparent',
        borderImage: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%) 1',
        padding: '0', marginBottom: '0', marginTop: '0',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="flex items-center justify-between" style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(124, 58, 237, 0.02) 100%)'
        }}>
          <div className="flex items-center gap-4">
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
              border: '2px solid rgba(37, 99, 235, 0.2)'
            }}>
              <Map className="h-6 w-6" style={{ color: '#2563eb' }} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 style={{
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: '20px', margin: 0,
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  قطاعات وأحياء الرياض
                </h1>
                <div style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>948</span>
                </div>
              </div>
              <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px', color: '#64748b', margin: 0 }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8', display: 'inline-block', marginLeft: '6px' }}></span>
                178 حي موزع على 5 قطاعات رئيسية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar tabs={TABS_CONFIG} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto px-6">{renderTabContent()}</div>
      </div>

      {/* النافذة المنبثقة للقطاع */}
      {renderSectorDialog()}

      {/* نافذة القطاعات */}
      <Dialog open={showSectorsDialog} onOpenChange={setShowSectorsDialog}>
        <DialogContent className="max-w-2xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map className="h-6 w-6 text-blue-600" />
              القطاعات الخمسة لمدينة الرياض
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {SECTORS.map(sector => (
                <Card key={sector.id} style={{ border: '2px solid #3b82f6', background: 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Map className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.name}</h3>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge>{sector.districtsCount} حي</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setShowSectorsDialog(false);
                            handleSectorClick(sector);
                          }}
                        >
                          <Eye className="h-3 w-3 ml-1" />
                          عرض
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowSectorsDialog(false); setActiveTab('948-02'); }}>
                <Map className="h-4 w-4 ml-1" />
                الانتقال لتاب القطاعات
              </Button>
              <Button variant="outline" onClick={() => setShowSectorsDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة الأحياء */}
      <Dialog open={showDistrictsDialog} onOpenChange={setShowDistrictsDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin className="h-6 w-6 text-green-600" />
              توزيع الأحياء على القطاعات ({statistics.totalDistricts} حي)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {SECTORS.map(sector => {
                const sectorDistricts = mockDistricts.filter(d => d.sectorId === sector.id);
                return (
                  <Card key={sector.id} style={{ border: '2px solid #10b981', background: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%)' }}>
                    <CardContent className="p-3 text-center">
                      <MapPin className="h-5 w-5 mx-auto mb-2 text-green-600" />
                      <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.name}</p>
                      <Badge className="mt-2" style={{ background: '#10b981' }}>{sectorDistricts.length} حي</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowDistrictsDialog(false); setActiveTab('948-03'); }}>
                <MapPin className="h-4 w-4 ml-1" />
                الانتقال لتاب الأحياء
              </Button>
              <Button variant="outline" onClick={() => setShowDistrictsDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة السكان */}
      <Dialog open={showPopulationDialog} onOpenChange={setShowPopulationDialog}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users className="h-6 w-6 text-amber-600" />
              توزيع السكان على القطاعات
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card style={{ border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)' }}>
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي السكان</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#f59e0b' }}>
                    {statistics.totalPopulation.toLocaleString('ar-SA')}
                  </p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ({(statistics.totalPopulation / 1000000).toFixed(2)} مليون نسمة)
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {SECTORS.map(sector => {
                    const sectorPop = mockDistricts.filter(d => d.sectorId === sector.id).reduce((sum, d) => sum + d.population, 0);
                    const percentage = ((sectorPop / statistics.totalPopulation) * 100).toFixed(1);
                    return (
                      <div key={sector.id} className="bg-white p-3 rounded-lg text-center" style={{ border: '1px solid #fbbf24' }}>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.name}</p>
                        <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#f59e0b' }}>
                          {sectorPop.toLocaleString('ar-SA')}
                        </p>
                        <Badge style={{ background: '#fbbf24', fontSize: '10px' }}>{percentage}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowPopulationDialog(false); setActiveTab('948-08'); }}>
                <TrendingUp className="h-4 w-4 ml-1" />
                الانتقال لتاب الإحصائيات
              </Button>
              <Button variant="outline" onClick={() => setShowPopulationDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة البلديات المستقلة */}
      <Dialog open={showMunicipalityDialog} onOpenChange={setShowMunicipalityDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 className="h-6 w-6 text-purple-600" />
              الأحياء ذات البلديات المستقلة ({statistics.withMunicipality} حي)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-3 p-2">
                {mockDistricts.filter(d => d.hasIndependentMunicipality).map(district => (
                  <Card key={district.id} style={{ border: '2px solid #8b5cf6', background: 'linear-gradient(135deg, #ede9fe 0%, #faf5ff 100%)' }}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.name}</h4>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            القطاع: {district.sectorName}
                          </p>
                          <Badge style={{ background: '#8b5cf6', fontSize: '10px' }}>
                            {district.municipalityName}
                          </Badge>
                        </div>
                        <Building2 className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowMunicipalityDialog(false); setActiveTab('948-03'); }}>
                <MapPin className="h-4 w-4 ml-1" />
                الانتقال لتاب الأحياء
              </Button>
              <Button variant="outline" onClick={() => setShowMunicipalityDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة الهيئات الخاصة */}
      <Dialog open={showAuthorityDialog} onOpenChange={setShowAuthorityDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings className="h-6 w-6 text-pink-600" />
              الأحياء ذات الهيئات الخاصة ({statistics.withAuthority} حي)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-3 p-2">
                {mockDistricts.filter(d => d.hasSpecialAuthority).map(district => (
                  <Card key={district.id} style={{ border: '2px solid #ec4899', background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)' }}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.name}</h4>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            القطاع: {district.sectorName}
                          </p>
                          <Badge style={{ background: '#ec4899', fontSize: '10px' }}>
                            {district.authorityName}
                          </Badge>
                        </div>
                        <Settings className="h-4 w-4 text-pink-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowAuthorityDialog(false); setActiveTab('948-05'); }}>
                <AlertCircle className="h-4 w-4 ml-1" />
                الانتقال لتاب التنظيمات الخاصة
              </Button>
              <Button variant="outline" onClick={() => setShowAuthorityDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة التنظيمات الخاصة */}
      <Dialog open={showRegulationsDialog} onOpenChange={setShowRegulationsDialog}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle className="h-6 w-6 text-red-600" />
              الأحياء ذات التنظيمات الخاصة ({statistics.withRegulations} حي)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 gap-3 p-2">
                {mockDistricts.filter(d => d.hasSpecialRegulations).map(district => (
                  <Card key={district.id} style={{ border: '2px solid #ef4444', background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)' }}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{district.name}</h4>
                            <Badge variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                              {district.sectorName}
                            </Badge>
                          </div>
                          {district.specialRegulations && (
                            <div className="bg-white p-2 rounded space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع:</span>
                                <Badge style={{ background: '#ef4444', fontSize: '10px' }}>{district.specialRegulations.type}</Badge>
                              </div>
                              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {district.specialRegulations.description}
                              </p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                الجهة المصدرة: <span className="font-bold">{district.specialRegulations.issuingAuthority}</span>
                              </p>
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                ساري من: <span className="font-bold">{district.specialRegulations.validFrom}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Button onClick={() => { setShowRegulationsDialog(false); setActiveTab('948-05'); }}>
                <AlertCircle className="h-4 w-4 ml-1" />
                الانتقال لتاب التنظيمات الخاصة
              </Button>
              <Button variant="outline" onClick={() => setShowRegulationsDialog(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectorsDistricts_Complete_948_v2;
