import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { 
  DollarSign, Calculator, FileText, Grid3x3, FunctionSquare, Percent, PlusCircle,
  Bookmark, BarChart3, Settings, Link2, HelpCircle, Save, Upload, Download,
  Eye, RotateCcw, Edit, CheckCircle, XCircle, AlertTriangle, Trash2,
  Building2, Users, MapPin, Calendar, FileCheck, Package, Copy,
  TrendingUp, Activity, Zap, Printer, Search, Filter,
  Database, Sliders, Info, Clock, Award, Target, 
  Layers, Globe, TrendingDown, Hash, ArrowUpDown
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

// ===================== TypeScript Interfaces =====================

interface ServiceType {
  id: string;
  code: string;
  mainCategory: string;
  subCategory: string;
  description: string;
  components: string[];
  isActive: boolean;
  requiresApproval: boolean;
  basePrice: number;
}

interface PricingFactor {
  id: string;
  name: string;
  type: 'area' | 'floors' | 'location' | 'client' | 'project' | 'approval' | 'time' | 'other';
  ranges: FactorRange[];
  isActive: boolean;
  priority: number;
  calculation: 'multiply' | 'add' | 'custom';
}

interface FactorRange {
  min: number;
  max: number;
  value: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface BasePrice {
  serviceId: string;
  basePrice: number;
  calculationType: 'fixed' | 'per_sqm_land' | 'per_sqm_building' | 'percentage' | 'custom';
  minFee: number;
  maxFee?: number;
  components: ComponentPrice[];
  vatIncluded: boolean;
}

interface ComponentPrice {
  name: string;
  price: number;
  type: 'percentage' | 'fixed';
  included: boolean;
}

interface Discount {
  id: string;
  name: string;
  type: 'client' | 'volume' | 'seasonal' | 'promotional';
  value: number;
  valueType: 'percentage' | 'fixed';
  conditions: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  maxDiscount?: number;
}

interface AdditionalCost {
  id: string;
  name: string;
  category: 'travel' | 'documents' | 'printing' | 'consultants' | 'revisions' | 'other';
  costType: 'fixed' | 'variable' | 'percentage';
  baseValue: number;
  isActive: boolean;
  description: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  serviceType: string;
  defaultFactors: Record<string, any>;
  estimatedFee: { min: number; max: number };
  isActive: boolean;
}

interface CalculatorInput {
  serviceType: string;
  landArea: number;
  buildingArea: number;
  floors: number;
  buildingHeight: number;
  location: string;
  clientType: string;
  projectType: string;
  urgency: string;
  complexity: string;
  approvals: string[];
  entities: string[];
}

// ===================== Mock Data =====================

const MOCK_SERVICES: ServiceType[] = [
  {
    id: 'SRV-001',
    code: 'LIC-RES-VILLA',
    mainCategory: 'تراخيص البناء',
    subCategory: 'ترخيص بناء سكني - فيلا',
    description: 'ترخيص بناء فيلا سكنية خاصة',
    components: ['تصميم معماري', 'تصميم إنشائي', 'كهروميكانيكي', 'دراسة الطاقة'],
    isActive: true,
    requiresApproval: false,
    basePrice: 15000
  },
  {
    id: 'SRV-002',
    code: 'LIC-COM-MALL',
    mainCategory: 'تراخيص البناء',
    subCategory: 'ترخيص بناء تجاري - مول',
    description: 'ترخيص بناء مركز تجاري (مول)',
    components: ['تصميم معماري', 'تصميم إنشائي', 'كهروميكانيكي', 'دراسة الطاقة', 'دفاع مدني', 'دراسة مرورية'],
    isActive: true,
    requiresApproval: true,
    basePrice: 85000
  },
  {
    id: 'SRV-003',
    code: 'SUP-EXEC',
    mainCategory: 'الإشراف على التنفيذ',
    subCategory: 'إشراف كامل',
    description: 'إشراف كامل على تنفيذ المشروع',
    components: ['متابعة يومية', 'تقارير أسبوعية', 'استلام أعمال'],
    isActive: true,
    requiresApproval: false,
    basePrice: 0 // محسوب كنسبة
  },
  {
    id: 'SRV-004',
    code: 'INT-DESIGN',
    mainCategory: 'التصميم الداخلي',
    subCategory: 'تصميم داخلي كامل',
    description: 'تصميم داخلي شامل للمبنى',
    components: ['تصميم ثلاثي الأبعاد', 'اختيار مواد', 'إشراف تنفيذ'],
    isActive: true,
    requiresApproval: false,
    basePrice: 25000
  },
  {
    id: 'SRV-005',
    code: 'EVAL-PROP',
    mainCategory: 'التقييم العقاري',
    subCategory: 'تقييم عقاري',
    description: 'تقييم قيمة العقار',
    components: ['معاينة ميدانية', 'دراسة السوق', 'تقرير تفصيلي'],
    isActive: true,
    requiresApproval: false,
    basePrice: 5000
  },
  {
    id: 'SRV-006',
    code: 'SAF-REP',
    mainCategory: 'تقارير السلامة',
    subCategory: 'تقرير سلامة إنشائية',
    description: 'فحص وتقرير السلامة الإنشائية',
    components: ['معاينة ميدانية', 'اختبارات', 'تقرير فني'],
    isActive: true,
    requiresApproval: false,
    basePrice: 8000
  },
  {
    id: 'SRV-007',
    code: 'STRUCT-STUDY',
    mainCategory: 'الدراسات الإنشائية',
    subCategory: 'دراسة إنشائية متقدمة',
    description: 'دراسة إنشائية للمباني المعقدة',
    components: ['تحليل إنشائي', 'نمذجة حاسوبية', 'تقرير تفصيلي'],
    isActive: true,
    requiresApproval: true,
    basePrice: 35000
  },
  {
    id: 'SRV-008',
    code: 'RENOV',
    mainCategory: 'الترميم والتجديد',
    subCategory: 'ترميم مبنى قائم',
    description: 'ترميم وإعادة تأهيل مبنى قائم',
    components: ['دراسة الوضع', 'تصميم الترميم', 'إشراف'],
    isActive: true,
    requiresApproval: false,
    basePrice: 20000
  }
];

const MOCK_FACTORS: PricingFactor[] = [
  {
    id: 'FAC-001',
    name: 'مساحة الأرض',
    type: 'area',
    priority: 1,
    calculation: 'multiply',
    isActive: true,
    ranges: [
      { min: 0, max: 200, value: 1.0, type: 'percentage', description: 'صغيرة جداً (0-200م²)' },
      { min: 201, max: 400, value: 1.1, type: 'percentage', description: 'صغيرة (201-400م²)' },
      { min: 401, max: 600, value: 1.2, type: 'percentage', description: 'متوسطة (401-600م²)' },
      { min: 601, max: 1000, value: 1.3, type: 'percentage', description: 'كبيرة (601-1000م²)' },
      { min: 1001, max: 2000, value: 1.5, type: 'percentage', description: 'كبيرة جداً (1001-2000م²)' },
      { min: 2001, max: 5000, value: 1.8, type: 'percentage', description: 'ضخمة (2001-5000م²)' },
      { min: 5001, max: 999999, value: 2.2, type: 'percentage', description: 'استثنائية (أكثر من 5000م²)' }
    ]
  },
  {
    id: 'FAC-002',
    name: 'عدد الأدوار',
    type: 'floors',
    priority: 2,
    calculation: 'multiply',
    isActive: true,
    ranges: [
      { min: 1, max: 1, value: 1.0, type: 'percentage', description: 'دور واحد' },
      { min: 2, max: 2, value: 1.15, type: 'percentage', description: 'دورين' },
      { min: 3, max: 3, value: 1.25, type: 'percentage', description: '3 أدوار' },
      { min: 4, max: 4, value: 1.35, type: 'percentage', description: '4 أدوار' },
      { min: 5, max: 7, value: 1.5, type: 'percentage', description: '5-7 أدوار' },
      { min: 8, max: 10, value: 1.7, type: 'percentage', description: '8-10 أدوار' },
      { min: 11, max: 999, value: 2.0, type: 'percentage', description: 'أكثر من 10 أدوار (برج)' }
    ]
  },
  {
    id: 'FAC-003',
    name: 'الموقع الجغرافي',
    type: 'location',
    priority: 3,
    calculation: 'multiply',
    isActive: true,
    ranges: [
      { min: 0, max: 0, value: 1.0, type: 'percentage', description: 'داخل الرياض - وسط' },
      { min: 0, max: 0, value: 1.05, type: 'percentage', description: 'داخل الرياض - شمال/جنوب' },
      { min: 0, max: 0, value: 1.15, type: 'percentage', description: 'خارج الرياض - مدن قريبة' },
      { min: 0, max: 0, value: 1.35, type: 'percentage', description: 'مدن بعيدة' },
      { min: 0, max: 0, value: 1.5, type: 'percentage', description: 'مناطق نائية' }
    ]
  },
  {
    id: 'FAC-004',
    name: 'نوع العميل',
    type: 'client',
    priority: 4,
    calculation: 'multiply',
    isActive: true,
    ranges: [
      { min: 0, max: 0, value: 1.0, type: 'percentage', description: 'أفراد - عميل جديد' },
      { min: 0, max: 0, value: 0.9, type: 'percentage', description: 'أفراد - عميل متكرر' },
      { min: 0, max: 0, value: 0.85, type: 'percentage', description: 'أفراد - عميل VIP' },
      { min: 0, max: 0, value: 1.1, type: 'percentage', description: 'شركات صغيرة' },
      { min: 0, max: 0, value: 1.15, type: 'percentage', description: 'شركات متوسطة' },
      { min: 0, max: 0, value: 1.25, type: 'percentage', description: 'شركات كبرى' },
      { min: 0, max: 0, value: 0.95, type: 'percentage', description: 'جهات حكومية' },
      { min: 0, max: 0, value: 0.7, type: 'percentage', description: 'مؤسسات خيرية' }
    ]
  }
];

const MOCK_DISCOUNTS: Discount[] = [
  {
    id: 'DSC-001',
    name: 'خصم العميل المتكرر',
    type: 'client',
    value: 10,
    valueType: 'percentage',
    conditions: ['أكثر من 3 معاملات سابقة'],
    isActive: true,
    maxDiscount: 15
  },
  {
    id: 'DSC-002',
    name: 'خصم العميل VIP',
    type: 'client',
    value: 15,
    valueType: 'percentage',
    conditions: ['تصنيف A', 'أكثر من 10 معاملات'],
    isActive: true,
    maxDiscount: 20
  },
  {
    id: 'DSC-003',
    name: 'خصم الكمية - 3 معاملات',
    type: 'volume',
    value: 12,
    valueType: 'percentage',
    conditions: ['3 معاملات أو أكثر في نفس الوقت'],
    isActive: true,
    maxDiscount: 25
  },
  {
    id: 'DSC-004',
    name: 'عرض اليوم الوطني',
    type: 'seasonal',
    value: 20,
    valueType: 'percentage',
    conditions: ['خلال شهر سبتمبر فقط'],
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    isActive: true,
    maxDiscount: 20
  },
  {
    id: 'DSC-005',
    name: 'خصم الإحالة',
    type: 'promotional',
    value: 500,
    valueType: 'fixed',
    conditions: ['عميل جديد من إحالة'],
    isActive: true
  }
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'TMP-001',
    name: 'فيلا سكنية صغيرة',
    description: 'فيلا سكنية بمساحة أقل من 400م²',
    serviceType: 'SRV-001',
    defaultFactors: {
      landArea: 300,
      buildingArea: 250,
      floors: 2,
      location: 'riyadh-center',
      clientType: 'individual'
    },
    estimatedFee: { min: 18000, max: 25000 },
    isActive: true
  },
  {
    id: 'TMP-002',
    name: 'فيلا سكنية كبيرة',
    description: 'فيلا سكنية بمساحة أكثر من 600م²',
    serviceType: 'SRV-001',
    defaultFactors: {
      landArea: 800,
      buildingArea: 650,
      floors: 3,
      location: 'riyadh-north',
      clientType: 'individual-vip'
    },
    estimatedFee: { min: 35000, max: 50000 },
    isActive: true
  },
  {
    id: 'TMP-003',
    name: 'مبنى تجاري صغير',
    description: 'محلات تجارية - دورين',
    serviceType: 'SRV-002',
    defaultFactors: {
      landArea: 500,
      buildingArea: 450,
      floors: 2,
      location: 'riyadh-center',
      clientType: 'company-small'
    },
    estimatedFee: { min: 40000, max: 60000 },
    isActive: true
  }
];

// ===================== Main Component =====================

const FeesSettings_Complete_952_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('952-01');
  const [services, setServices] = useState<ServiceType[]>(MOCK_SERVICES);
  const [factors, setFactors] = useState<PricingFactor[]>(MOCK_FACTORS);
  const [discounts, setDiscounts] = useState<Discount[]>(MOCK_DISCOUNTS);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  
  // State للنوافذ المنبثقة
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showFactorDialog, setShowFactorDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  
  // State للنماذج
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<PricingFactor | null>(null);
  
  // State لحاسبة الأتعاب
  const [calculatorInput, setCalculatorInput] = useState<CalculatorInput>({
    serviceType: '',
    landArea: 0,
    buildingArea: 0,
    floors: 1,
    buildingHeight: 0,
    location: '',
    clientType: '',
    projectType: '',
    urgency: 'normal',
    complexity: 'simple',
    approvals: [],
    entities: []
  });
  const [calculatedFee, setCalculatedFee] = useState<number>(0);
  const [feeBreakdown, setFeeBreakdown] = useState<any[]>([]);

  const TABS_CONFIG: TabConfig[] = [
    { id: '952-01', number: '952-01', title: 'أنواع الخدمات', icon: Package },
    { id: '952-02', number: '952-02', title: 'العوامل المؤثرة', icon: Sliders },
    { id: '952-03', number: '952-03', title: 'الأسعار الأساسية', icon: DollarSign },
    { id: '952-04', number: '952-04', title: 'مصفوفة التسعير', icon: Grid3x3 },
    { id: '952-05', number: '952-05', title: 'معادلات الحساب', icon: FunctionSquare },
    { id: '952-06', number: '952-06', title: 'الخصومات والعروض', icon: Percent },
    { id: '952-07', number: '952-07', title: 'الإضافات والمصاريف', icon: PlusCircle },
    { id: '952-08', number: '952-08', title: 'حاسبة الأتعاب', icon: Calculator },
    { id: '952-09', number: '952-09', title: 'القوالب والسيناريوهات', icon: Bookmark },
    { id: '952-10', number: '952-10', title: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '952-11', number: '952-11', title: 'إعدادات النظام', icon: Settings },
    { id: '952-12', number: '952-12', title: 'الربط والتكامل', icon: Link2 },
    { id: '952-13', number: '952-13', title: 'دليل الاستخدام', icon: HelpCircle }
  ];

  // دالة حساب الأتعاب
  const calculateFees = () => {
    const service = services.find(s => s.id === calculatorInput.serviceType);
    if (!service) return;

    let total = service.basePrice;
    const breakdown = [
      { label: 'السعر الأساسي', value: service.basePrice }
    ];

    // تطبيق العوامل
    factors.filter(f => f.isActive).forEach(factor => {
      let multiplier = 1.0;
      
      if (factor.type === 'area' && calculatorInput.landArea > 0) {
        const range = factor.ranges.find(r => 
          calculatorInput.landArea >= r.min && calculatorInput.landArea <= r.max
        );
        if (range) {
          multiplier = range.value;
          total *= multiplier;
          breakdown.push({
            label: `${factor.name} (${range.description})`,
            value: (service.basePrice * (multiplier - 1))
          });
        }
      }
      
      if (factor.type === 'floors' && calculatorInput.floors > 0) {
        const range = factor.ranges.find(r => 
          calculatorInput.floors >= r.min && calculatorInput.floors <= r.max
        );
        if (range) {
          multiplier = range.value;
          total *= multiplier;
          breakdown.push({
            label: `${factor.name} (${range.description})`,
            value: (total * (multiplier - 1))
          });
        }
      }
    });

    // ضريبة القيمة المضافة
    const vat = total * 0.15;
    breakdown.push({ label: 'ضريبة القيمة المضافة (15%)', value: vat });
    total += vat;

    setCalculatedFee(total);
    setFeeBreakdown(breakdown);
  };

  // دالة حفظ الإعدادات
  const saveSettings = () => {
    localStorage.setItem('fees_settings_services', JSON.stringify(services));
    localStorage.setItem('fees_settings_factors', JSON.stringify(factors));
    localStorage.setItem('fees_settings_discounts', JSON.stringify(discounts));
    alert('تم حفظ الإعدادات بنجاح');
  };

  // ===================== Render Functions =====================

  const renderTabContent = () => {
    switch (activeTab) {
      case '952-01':
        return renderTab01_Services();
      case '952-02':
        return renderTab02_Factors();
      case '952-03':
        return renderTab03_BasePrices();
      case '952-04':
        return renderTab04_PricingMatrix();
      case '952-05':
        return renderTab05_Formulas();
      case '952-06':
        return renderTab06_Discounts();
      case '952-07':
        return renderTab07_AdditionalCosts();
      case '952-08':
        return renderTab08_Calculator();
      case '952-09':
        return renderTab09_Templates();
      case '952-10':
        return renderTab10_Reports();
      case '952-11':
        return renderTab11_SystemSettings();
      case '952-12':
        return renderTab12_Integration();
      case '952-13':
        return renderTab13_Guide();
      default:
        return null;
    }
  };

  // ===================== Tab 952-01: أنواع الخدمات =====================
  const renderTab01_Services = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2 text-center">
            <Package className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
              {services.length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي الخدمات
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
              {services.filter(s => s.isActive).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خدمات نشطة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
          <CardContent className="p-2 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>
              {services.filter(s => !s.isActive).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خدمات متوقفة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-2 text-center">
            <Building2 className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
              4
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              فئات رئيسية
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-2 text-center">
            <Layers className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
              {services.reduce((acc, s) => acc + s.components.length, 0)}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي المكونات
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-2 text-center">
            <FileCheck className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#db2777' }}>
              {services.filter(s => s.requiresApproval).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تتطلب موافقات
            </p>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2 justify-between">
        <Button 
          onClick={() => {
            setSelectedService(null);
            setShowServiceDialog(true);
          }}
          style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          إضافة خدمة جديدة
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Upload className="h-4 w-4 ml-2" />
            استيراد
          </Button>
          <Button variant="outline" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* جدول الخدمات */}
      <Card className="card-element card-rtl">
        <CardHeader className="pb-3">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            جميع الخدمات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة الرئيسية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة الفرعية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوصف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكونات</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر الأساسي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="text-right">
                      <span className="font-mono text-xs" style={{ color: '#1e40af' }}>
                        {service.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {service.mainCategory}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {service.subCategory}
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <span className="text-xs text-gray-600">{service.description}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-1 justify-end">
                        {service.components.slice(0, 2).map((comp, idx) => (
                          <Badge key={idx} variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                            {comp}
                          </Badge>
                        ))}
                        {service.components.length > 2 && (
                          <Badge variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                            +{service.components.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
                        {service.basePrice > 0 ? `${service.basePrice.toLocaleString('ar-SA')} ر.س` : 'حسب النسبة'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={service.isActive ? "default" : "secondary"}
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                      >
                        {service.isActive ? 'نشط' : 'متوقف'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedService(service);
                            setShowServiceDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
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

  // ===================== Tab 952-02: العوامل المؤثرة =====================
  const renderTab02_Factors = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-2 text-center">
            <Sliders className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
              {factors.length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي العوامل
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
              {factors.filter(f => f.isActive).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عوامل نشطة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2 text-center">
            <Layers className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
              {factors.reduce((acc, f) => acc + f.ranges.length, 0)}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي النطاقات
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-2 text-center">
            <Hash className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
              {factors.filter(f => f.calculation === 'multiply').length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات ضرب
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-2 text-center">
            <PlusCircle className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#db2777' }}>
              {factors.filter(f => f.calculation === 'add').length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معاملات جمع
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
          <CardContent className="p-2 text-center">
            <ArrowUpDown className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ea580c' }}>
              {factors.filter(f => f.priority <= 3).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عالية الأولوية
            </p>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2 justify-between">
        <Button 
          onClick={() => {
            setSelectedFactor(null);
            setShowFactorDialog(true);
          }}
          style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          إضافة عامل جديد
        </Button>
      </div>

      {/* قائمة العوامل */}
      <div className="space-y-3">
        {factors.map((factor) => (
          <Card key={factor.id} className="card-element card-rtl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sliders className="h-5 w-5 text-amber-600" />
                  <div>
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>
                      {factor.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      النوع: {factor.type} • الأولوية: {factor.priority} • الحساب: {factor.calculation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={factor.isActive ? "default" : "secondary"} style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {factor.isActive ? 'نشط' : 'متوقف'}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {factor.ranges.map((range, idx) => (
                  <div 
                    key={idx}
                    className="p-2 rounded-lg border"
                    style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                        {range.description}
                      </span>
                      <span className="text-sm font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
                        {range.type === 'percentage' ? `×${range.value}` : `+${range.value} ر.س`}
                      </span>
                    </div>
                    {range.min > 0 || range.max < 999999 ? (
                      <p className="text-[10px] text-gray-500 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {range.min} - {range.max === 999999 ? '∞' : range.max}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ===================== Tab 952-03: الأسعار الأساسية =====================
  const renderTab03_BasePrices = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <Info className="h-4 w-4" style={{ color: '#1e40af' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>
          <strong>ملاحظة:</strong> الأسعار الأساسية هي نقطة البداية قبل تطبيق العوامل والمعاملات.
        </AlertDescription>
      </Alert>

      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الأسعار الأساسية للخدمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[550px]">
            <Table className="table-rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الخدمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>طريقة الحساب</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر الأساسي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحد الأدنى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحد الأقصى</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>شامل الضريبة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div>
                        <p className="font-semibold text-sm">{service.subCategory}</p>
                        <p className="text-xs text-gray-500">{service.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                        سعر ثابت
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {service.basePrice > 0 ? `${service.basePrice.toLocaleString('ar-SA')} ر.س` : 'حسب النسبة'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {(service.basePrice * 0.8).toLocaleString('ar-SA')} ر.س
                    </TableCell>
                    <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {service.basePrice > 0 ? `${(service.basePrice * 3).toLocaleString('ar-SA')} ر.س` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <EnhancedSwitch
                        checked={false}
                        onCheckedChange={() => {}}
                        size="sm"
                        variant="default"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
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

  // ===================== Tab 952-04: مصفوفة التسعير =====================
  const renderTab04_PricingMatrix = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <Grid3x3 className="h-4 w-4" style={{ color: '#d97706' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
          <strong>مصفوفة التسعير:</strong> اختر الخدمة والعوامل لعرض المصفوفة التفصيلية.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-3">
        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              اختر الخدمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SelectWithCopy
              label=""
              id="matrix-service"
              value=""
              onChange={() => {}}
              options={services.map(s => ({ value: s.id, label: s.subCategory }))}
              copyable={false}
              clearable={true}
            />
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              المحور الأفقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SelectWithCopy
              label=""
              id="matrix-horizontal"
              value=""
              onChange={() => {}}
              options={[
                { value: 'area', label: 'مساحة الأرض' },
                { value: 'floors', label: 'عدد الأدوار' },
                { value: 'location', label: 'الموقع' }
              ]}
              copyable={false}
              clearable={true}
            />
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              المحور العمودي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SelectWithCopy
              label=""
              id="matrix-vertical"
              value=""
              onChange={() => {}}
              options={[
                { value: 'client', label: 'نوع العميل' },
                { value: 'project', label: 'نوع المشروع' },
                { value: 'complexity', label: 'التعقيد' }
              ]}
              copyable={false}
              clearable={true}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            المصفوفة التفاعلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center" style={{ background: 'rgba(148, 163, 184, 0.1)', borderRadius: '8px' }}>
            <Grid3x3 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
              اختر الخدمة والمحاور لعرض المصفوفة
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===================== Tab 952-05: معادلات الحساب =====================
  const renderTab05_Formulas = () => (
    <div className="space-y-4">
      <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            المعادلة الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg" style={{ background: 'white', border: '2px solid #a5b4fc' }}>
            <pre className="text-sm" style={{ fontFamily: 'Courier New, monospace', direction: 'ltr', textAlign: 'left', color: '#4f46e5' }}>
{`الأتعاب الإجمالية = 
  (
    السعر الأساسي 
    × معامل المساحة 
    × معامل الأدوار 
    × معامل الموقع 
    × معامل نوع العميل
  ) 
  + الخدمات الإضافية 
  + أتعاب الموافقات الخاصة 
  - الخصومات
  + ضريبة القيمة المضافة (15%)`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              المتغيرات المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'مساحة_الارض',
                'مساحة_البناء',
                'عدد_الادوار',
                'ارتفاع_المبنى',
                'نوع_المشروع',
                'فئة_العميل',
                'الموقع_الجغرافي',
                'عدد_الموافقات_الخاصة',
                'مدة_التنفيذ_المتوقعة'
              ].map((variable, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border flex items-center justify-between"
                  style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                >
                  <span className="text-sm font-mono" style={{ color: '#4f46e5' }}>
                    {variable}
                  </span>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              الدوال المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'IF', desc: 'دالة شرطية' },
                { name: 'MAX', desc: 'القيمة الأعلى' },
                { name: 'MIN', desc: 'القيمة الأدنى' },
                { name: 'AVERAGE', desc: 'المتوسط' },
                { name: 'SUM', desc: 'الجمع' },
                { name: 'MULTIPLY', desc: 'الضرب' },
                { name: 'DIVIDE', desc: 'القسمة' },
                { name: 'ROUND', desc: 'التقريب' },
                { name: 'CEIL', desc: 'تقريب لأعلى' }
              ].map((func, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border"
                  style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold" style={{ color: '#4f46e5' }}>
                      {func.name}
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                      {func.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ===================== Tab 952-06: الخصومات والعروض =====================
  const renderTab06_Discounts = () => (
    <div className="space-y-4">
      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-5 gap-2">
        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
          <CardContent className="p-2 text-center">
            <Percent className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
              {discounts.length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إجمالي الخصومات
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-2 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#059669' }}>
              {discounts.filter(d => d.isActive).length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خصومات نشطة
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-2 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
              {discounts.filter(d => d.type === 'client').length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خصومات عملاء
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-2 text-center">
            <Calendar className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#db2777' }}>
              {discounts.filter(d => d.type === 'seasonal').length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              خصومات موسمية
            </p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
          <CardContent className="p-2 text-center">
            <Zap className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
            <p className="text-lg font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
              {discounts.filter(d => d.type === 'promotional').length}
            </p>
            <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              عروض ترويجية
            </p>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowDiscountDialog(true)}
          style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          إضافة خصم جديد
        </Button>
      </div>

      {/* قائمة الخصومات */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {discounts.map((discount) => (
            <Card key={discount.id} className="card-element card-rtl">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Percent className="h-5 w-5 text-amber-600" />
                    <div>
                      <h3 className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {discount.name}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}>
                          {discount.type}
                        </Badge>
                        <Badge 
                          variant={discount.isActive ? "default" : "secondary"}
                          style={{ fontSize: '9px', fontFamily: 'Tajawal, sans-serif' }}
                        >
                          {discount.isActive ? 'نشط' : 'متوقف'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
                      {discount.valueType === 'percentage' ? `${discount.value}%` : `${discount.value} ر.س`}
                    </p>
                    {discount.maxDiscount && (
                      <p className="text-[10px] text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        حد أقصى: {discount.maxDiscount}%
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#64748b' }}>
                    الشروط:
                  </p>
                  {discount.conditions.map((condition, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {condition}
                      </span>
                    </div>
                  ))}
                </div>

                {(discount.startDate || discount.endDate) && (
                  <div className="mt-2 p-2 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                      <Calendar className="h-3 w-3 inline ml-1" />
                      الفترة: {discount.startDate} إلى {discount.endDate}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // ===================== Tab 952-07: الإضافات والمصاريف =====================
  const renderTab07_AdditionalCosts = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <Info className="h-4 w-4" style={{ color: '#d97706' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
          <strong>المصاريف الإضافية:</strong> تكاليف إضافية قد تُضاف للأتعاب حسب طبيعة المشروع.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3">
        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              مصاريف الانتقال والسفر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'زيارة داخل الرياض', value: 200 },
                { name: 'زيارة خارج الرياض (يوم واحد)', value: 1500 },
                { name: 'زيارة مدن بعيدة (مع إقامة)', value: 3000 },
                { name: 'بدل مواصلات (للكيلومتر)', value: 2 }
              ].map((cost, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border flex items-center justify-between"
                  style={{ background: 'white' }}
                >
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.name}
                  </span>
                  <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.value} ر.س
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              مصاريف المستندات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'استخراج صك إلكتروني', value: 100 },
                { name: 'رسوم التوثيق', value: 500 },
                { name: 'الترجمة (للصفحة)', value: 50 },
                { name: 'التصديقات الرسمية', value: 300 }
              ].map((cost, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border flex items-center justify-between"
                  style={{ background: 'white' }}
                >
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.name}
                  </span>
                  <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.value} ر.س
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              مصاريف الطباعة والتوثيق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'طباعة A0 (ملون)', value: 50 },
                { name: 'طباعة A1 (ملون)', value: 30 },
                { name: 'طباعة A2 (ملون)', value: 20 },
                { name: 'تجليد دفتر المخططات', value: 100 },
                { name: 'نسخة رقمية (USB)', value: 50 }
              ].map((cost, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border flex items-center justify-between"
                  style={{ background: 'white' }}
                >
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.name}
                  </span>
                  <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.value} ر.س
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="pb-2">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
              مصاريف الاستشاريين الخارجيين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'استشاري جيوتقني', value: 8000 },
                { name: 'مكتب دراسة الطاقة', value: 3000 },
                { name: 'فحص المباني', value: 5000 },
                { name: 'دراسة مرورية', value: 12000 }
              ].map((cost, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded border flex items-center justify-between"
                  style={{ background: 'white' }}
                >
                  <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.name}
                  </span>
                  <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cost.value} ر.س
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ===================== Tab 952-08: حاسبة الأتعاب =====================
  const renderTab08_Calculator = () => (
    <div className="space-y-4">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <Calculator className="h-4 w-4" style={{ color: '#1e40af' }} />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e3a8a' }}>
          <strong>حاسبة الأتعاب التجريبية:</strong> أدخل بيانات المشروع لحساب الأتعاب المتوقعة.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        {/* قسم الإدخال */}
        <div className="space-y-3">
          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                معلومات المشروع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SelectWithCopy
                label="نوع الخدمة"
                id="calc-service"
                value={calculatorInput.serviceType}
                onChange={(value) => setCalculatorInput({...calculatorInput, serviceType: value})}
                options={services.map(s => ({ value: s.id, label: s.subCategory }))}
                copyable={false}
                clearable={true}
                required
              />

              <InputWithCopy
                label="مساحة الأرض (م²)"
                id="calc-land-area"
                type="number"
                value={calculatorInput.landArea.toString()}
                onChange={(e) => setCalculatorInput({...calculatorInput, landArea: Number(e.target.value)})}
                placeholder="مثال: 500"
                copyable={false}
                clearable={true}
                required
              />

              <InputWithCopy
                label="مساحة البناء (م²)"
                id="calc-building-area"
                type="number"
                value={calculatorInput.buildingArea.toString()}
                onChange={(e) => setCalculatorInput({...calculatorInput, buildingArea: Number(e.target.value)})}
                placeholder="مثال: 400"
                copyable={false}
                clearable={true}
                required
              />

              <InputWithCopy
                label="عدد الأدوار"
                id="calc-floors"
                type="number"
                value={calculatorInput.floors.toString()}
                onChange={(e) => setCalculatorInput({...calculatorInput, floors: Number(e.target.value)})}
                placeholder="مثال: 2"
                copyable={false}
                clearable={true}
                required
              />

              <SelectWithCopy
                label="الموقع الجغرافي"
                id="calc-location"
                value={calculatorInput.location}
                onChange={(value) => setCalculatorInput({...calculatorInput, location: value})}
                options={[
                  { value: 'riyadh-center', label: 'الرياض - وسط' },
                  { value: 'riyadh-north', label: 'الرياض - شمال' },
                  { value: 'outside-riyadh', label: 'خارج الرياض' }
                ]}
                copyable={false}
                clearable={true}
                required
              />

              <SelectWithCopy
                label="نوع العميل"
                id="calc-client-type"
                value={calculatorInput.clientType}
                onChange={(value) => setCalculatorInput({...calculatorInput, clientType: value})}
                options={[
                  { value: 'individual', label: 'أفراد - جديد' },
                  { value: 'individual-repeat', label: 'أفراد - متكرر' },
                  { value: 'individual-vip', label: 'أفراد - VIP' },
                  { value: 'company-small', label: 'شركة صغيرة' },
                  { value: 'company-large', label: 'شركة كبيرة' }
                ]}
                copyable={false}
                clearable={true}
                required
              />

              <SelectWithCopy
                label="مستوى الاستعجال"
                id="calc-urgency"
                value={calculatorInput.urgency}
                onChange={(value) => setCalculatorInput({...calculatorInput, urgency: value})}
                options={[
                  { value: 'normal', label: 'عادي (بدون تكلفة إضافية)' },
                  { value: 'urgent', label: 'مستعجل (+25%)' },
                  { value: 'very-urgent', label: 'عاجل جداً (+50%)' },
                  { value: 'immediate', label: 'فوري (+100%)' }
                ]}
                copyable={false}
                clearable={true}
              />

              <SelectWithCopy
                label="مستوى التعقيد"
                id="calc-complexity"
                value={calculatorInput.complexity}
                onChange={(value) => setCalculatorInput({...calculatorInput, complexity: value})}
                options={[
                  { value: 'simple', label: 'بسيط (×1.0)' },
                  { value: 'medium', label: 'متوسط (×1.2)' },
                  { value: 'complex', label: 'معقد (×1.5)' },
                  { value: 'very-complex', label: 'معقد جداً (×2.0)' }
                ]}
                copyable={false}
                clearable={true}
              />

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={calculateFees}
                  className="flex-1"
                  style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  <Calculator className="h-4 w-4 ml-2" />
                  احسب الأتعاب
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCalculatorInput({
                      serviceType: '',
                      landArea: 0,
                      buildingArea: 0,
                      floors: 1,
                      buildingHeight: 0,
                      location: '',
                      clientType: '',
                      projectType: '',
                      urgency: 'normal',
                      complexity: 'simple',
                      approvals: [],
                      entities: []
                    });
                    setCalculatedFee(0);
                    setFeeBreakdown([]);
                  }}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قسم النتائج */}
        <div className="space-y-3">
          <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b' }}>
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الأتعاب الإجمالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
                  {calculatedFee > 0 ? calculatedFee.toLocaleString('ar-SA') : '---'}
                </p>
                <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#92400e' }}>
                  ريال سعودي (شامل الضريبة)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                تفاصيل الحساب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px]">
                {feeBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {feeBreakdown.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-2 rounded border flex items-center justify-between"
                        style={{ background: idx === feeBreakdown.length - 1 ? 'rgba(34, 197, 94, 0.1)' : 'white' }}
                      >
                        <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {item.label}
                        </span>
                        <span className="font-bold" style={{ 
                          fontFamily: 'Tajawal, sans-serif', 
                          color: item.value >= 0 ? '#059669' : '#dc2626' 
                        }}>
                          {item.value >= 0 ? '+' : ''}{item.value.toLocaleString('ar-SA')} ر.س
                        </span>
                      </div>
                    ))}
                    <Separator />
                    <div className="p-2 rounded border flex items-center justify-between" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                      <span className="text-base font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الإجمالي النهائي
                      </span>
                      <span className="text-xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#d97706' }}>
                        {calculatedFee.toLocaleString('ar-SA')} ر.س
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12" style={{ color: '#94a3b8' }}>
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      املأ البيانات واضغط "احسب الأتعاب" لعرض التفاصيل
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // ===================== التابات المتبقية (مبسطة) =====================
  
  const renderTab09_Templates = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="card-element card-rtl">
            <CardHeader className="pb-2">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '14px' }}>
                {template.name}
              </CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <span className="text-gray-600">الأتعاب المتوقعة:</span>
                  <span className="font-bold text-green-600">
                    {template.estimatedFee.min.toLocaleString('ar-SA')} - {template.estimatedFee.max.toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
                <Button size="sm" variant="outline" className="w-full" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Eye className="h-3 w-3 ml-1" />
                  استخدام القالب
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTab10_Reports = () => (
    <div className="space-y-4">
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التقارير والإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              'تقرير الأتعاب الشهري',
              'تقرير مقارنة الأسعار',
              'تقرير الخصومات الممنوحة',
              'تقرير متوسط الأتعاب',
              'تقرير العروض النشطة',
              'تقرير الخدمات الأكثر طلباً'
            ].map((report, idx) => (
              <Button key={idx} variant="outline" className="justify-start" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <BarChart3 className="h-4 w-4 ml-2" />
                {report}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTab11_SystemSettings = () => (
    <div className="space-y-4">
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الإعدادات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <EnhancedSwitch
                label="تفعيل ضريبة القيمة المضافة تلقائياً"
                description="تطبيق ضريبة 15% على جميع الحسابات"
                checked={true}
                onCheckedChange={() => {}}
                variant="default"
              />
            </div>
            <div>
              <InputWithCopy
                label="نسبة الضريبة الافتراضية (%)"
                id="vat-rate"
                type="number"
                value="15"
                onChange={() => {}}
                copyable={false}
                clearable={false}
              />
            </div>
            <div>
              <EnhancedSwitch
                label="السماح بتجاوز الحد الأقصى للخصم"
                description="يتطلب صلاحية خاصة"
                checked={false}
                onCheckedChange={() => {}}
                variant="warning"
              />
            </div>
            <div>
              <SelectWithCopy
                label="طريقة التقريب"
                id="rounding"
                value="nearest"
                onChange={() => {}}
                options={[
                  { value: 'nearest', label: 'لأقرب ريال' },
                  { value: 'five', label: 'لأقرب 5 ريالات' },
                  { value: 'ten', label: 'لأقرب 10 ريالات' }
                ]}
                copyable={false}
                clearable={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTab12_Integration = () => (
    <div className="space-y-4">
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الربط مع شاشات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { screen: 'الشاشة 701', name: 'أنواع المعاملات', status: 'مفعّل', color: '#10b981' },
              { screen: 'الشاشة 818', name: 'الجهات الخارجية', status: 'مفعّل', color: '#10b981' },
              { screen: 'الشاشة 284', name: 'معالجة المعاملات', status: 'مفعّل', color: '#10b981' },
              { screen: 'الشاشة 286', name: 'إنشاء معاملة', status: 'مفعّل', color: '#10b981' },
              { screen: 'الشاشة 815', name: 'عروض الأسعار', status: 'قيد التطوير', color: '#f59e0b' },
              { screen: 'الشاشة 814', name: 'العقود', status: 'قيد التطوير', color: '#f59e0b' }
            ].map((integration, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{ background: 'white' }}
              >
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5" style={{ color: integration.color }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {integration.screen}
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {integration.name}
                    </p>
                  </div>
                </div>
                <Badge style={{ fontFamily: 'Tajawal, sans-serif', background: integration.color, color: 'white' }}>
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTab13_Guide = () => (
    <div className="space-y-4">
      <Card className="card-element card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
            دليل الاستخدام السريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                1. إعداد الخدمات
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ابدأ بإضافة جميع أنواع الخدمات التي يقدمها المكتب من التاب الأول، وحدد الأسعار الأساسية لكل خدمة.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                2. تحديد العوامل المؤثرة
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                أضف جميع العوامل التي تؤثر على تسعير الخدمات (المساحة، الموقع، نوع العميل، إلخ) مع تحديد معاملات التأثير.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                3. إنشاء سياسات الخصومات
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                حدد أنواع الخصومات المتاحة وشروط كل خصم والحد الأقصى المسموح به.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                4. استخدام حاسبة الأتعاب
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                بعد إعداد النظام، استخدم حاسبة الأتعاب لاختبار الحسابات والتأكد من دقة المعادلات.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                5. حفظ القوالب
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                احفظ قوالب جاهزة للحالات الشائعة لتسريع عملية تسعير المشاريع المستقبلية.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===================== Render Main Component =====================

  return (
    <div style={{ fontFamily: 'Tajawal, sans-serif' }}>
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
              <DollarSign 
                className="h-6 w-6" 
                style={{ 
                  color: '#d97706',
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
                  إعدادات الأتعاب والتسعير
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
                    952
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
                نظام شامل لإدارة أتعاب الخدمات الهندسية والاستشارية
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
                13 تبويبات
              </span>
            </div>

            <Button
              onClick={saveSettings}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '12px',
                padding: '6px 16px'
              }}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ جميع الإعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
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

export default FeesSettings_Complete_952_v8;
