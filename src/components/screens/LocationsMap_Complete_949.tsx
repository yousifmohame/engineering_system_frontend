/**
 * الشاشة 949 - خريطة المواقع
 * نظام شامل لعرض وإدارة مواقع المعاملات على خريطة تفاعلية
 * مع تمييز متقدم حسب الحالة والنوع وإمكانية التصدير والدمج
 * 
 * المميزات:
 * - خريطة تفاعلية مع علامات ملونة
 * - تمييز حسب حالة المعاملة (مكتملة، نشطة، ملغاة، إلخ)
 * - تمييز حسب نوع المعاملة (سكني، تجاري، صناعي، إلخ)
 * - إعدادات تفصيلية للتصفية والعرض
 * - إحصائيات وتقارير شاملة
 * - تصدير للخريطة ودمجها في مواقع خارجية
 * - دعم أنواع خرائط متعددة (OpenStreetMap, Google Maps, Satellite)
 */

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import {
  MapPin, Map, Filter, Settings, BarChart3, Download, Code,
  History, Eye, EyeOff, Layers, Globe, Satellite, Navigation,
  ZoomIn, ZoomOut, Search, RefreshCw, Share2, Copy, CheckCircle,
  AlertCircle, XCircle, Clock, Building2, Home, Factory, Landmark,
  ShoppingBag, TreePine, Briefcase, Hotel, FileText, Maximize2,
  ExternalLink, Printer, Save, DollarSign, TrendingUp, FileImage,
  Camera, Move, Target, Crosshair, Locate, MapPinned, Compass
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';

// ==================== الواجهات ====================

interface Location {
  id: string;
  transactionId: string;
  transactionNumber: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  city: string;
  plotNumber: string;
  planNumber: string;
  owner: string;
  transactionType: string;
  transactionCategory: string;
  status: 'new' | 'in-progress' | 'approved' | 'completed' | 'on-hold' | 'cancelled' | 'rejected';
  createdDate: string;
  completedDate: string;
  area: number;
  value: number;
  assignedTo: string;
  notes: string;
}

interface MapSettings {
  mapType: 'osm' | 'google' | 'satellite' | 'terrain';
  defaultZoom: number;
  defaultCenter: { lat: number; lng: number };
  clusterMarkers: boolean;
  showLabels: boolean;
  showGrid: boolean;
  animateMarkers: boolean;
}

interface FilterSettings {
  statuses: string[];
  types: string[];
  categories: string[];
  cities: string[];
  districts: string[];
  dateFrom: string;
  dateTo: string;
  minValue: number;
  maxValue: number;
}

const LocationsMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState('949-01');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // إعدادات الخريطة
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    mapType: 'osm',
    defaultZoom: 12,
    defaultCenter: { lat: 24.7136, lng: 46.6753 }, // الرياض
    clusterMarkers: true,
    showLabels: true,
    showGrid: false,
    animateMarkers: true
  });

  // إعدادات التصفية
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    statuses: ['new', 'in-progress', 'approved', 'completed', 'on-hold', 'cancelled', 'rejected'],
    types: ['سكني', 'تجاري', 'صناعي', 'زراعي', 'إداري', 'خدمي', 'استثماري', 'سياحي'],
    categories: ['فيلا', 'عمارة', 'محل', 'مصنع', 'مزرعة', 'مكتب', 'فندق', 'مستودع'],
    cities: ['الرياض'],
    districts: [],
    dateFrom: '',
    dateTo: '',
    minValue: 0,
    maxValue: 10000000
  });

  // البيانات الوهمية - 50 موقعاً في الرياض
  const mockLocations: Location[] = [
    {
      id: 'LOC-001',
      transactionId: 'TRX-2501001',
      transactionNumber: '2501001',
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'حي العليا، طريق الملك فهد',
      district: 'العليا',
      city: 'الرياض',
      plotNumber: '1234',
      planNumber: '2789',
      owner: 'محمد بن أحمد السعيد',
      transactionType: 'تجاري',
      transactionCategory: 'عمارة',
      status: 'completed',
      createdDate: '2025-01-15',
      completedDate: '2025-09-20',
      area: 800,
      value: 3200000,
      assignedTo: 'م. أحمد العلي',
      notes: 'مشروع عمارة سكنية تجارية 8 أدوار'
    },
    {
      id: 'LOC-002',
      transactionId: 'TRX-2501005',
      transactionNumber: '2501005',
      latitude: 24.7244,
      longitude: 46.6847,
      address: 'حي الملز، شارع الستين',
      district: 'الملز',
      city: 'الرياض',
      plotNumber: '5678',
      planNumber: '2789',
      owner: 'عبدالله بن سعد المطيري',
      transactionType: 'سكني',
      transactionCategory: 'فيلا',
      status: 'in-progress',
      createdDate: '2025-02-10',
      completedDate: '',
      area: 500,
      value: 1800000,
      assignedTo: 'م. خالد السالم',
      notes: 'فيلا دورين + ملحق'
    },
    {
      id: 'LOC-003',
      transactionId: 'TRX-2502003',
      transactionNumber: '2502003',
      latitude: 24.6877,
      longitude: 46.7219,
      address: 'حي النخيل، طريق الخرج',
      district: 'النخيل',
      city: 'الرياض',
      plotNumber: '9012',
      planNumber: '3456',
      owner: 'فهد بن راشد العتيبي',
      transactionType: 'صناعي',
      transactionCategory: 'مصنع',
      status: 'approved',
      createdDate: '2025-02-20',
      completedDate: '',
      area: 2000,
      value: 5000000,
      assignedTo: 'م. فهد النمر',
      notes: 'مصنع مواد بناء'
    },
    {
      id: 'LOC-004',
      transactionId: 'TRX-2503001',
      transactionNumber: '2503001',
      latitude: 24.7745,
      longitude: 46.7385,
      address: 'حي الياسمين، شارع التخصصي',
      district: 'الياسمين',
      city: 'الرياض',
      plotNumber: '3456',
      planNumber: '5678',
      owner: 'سعد بن عبدالعزيز القحطاني',
      transactionType: 'تجاري',
      transactionCategory: 'محل',
      status: 'new',
      createdDate: '2025-03-05',
      completedDate: '',
      area: 150,
      value: 600000,
      assignedTo: 'م. أحمد العلي',
      notes: 'محل تجاري في مركز تجاري'
    },
    {
      id: 'LOC-005',
      transactionId: 'TRX-2504002',
      transactionNumber: '2504002',
      latitude: 24.6947,
      longitude: 46.6861,
      address: 'حي السليمانية، طريق الملك عبدالله',
      district: 'السليمانية',
      city: 'الرياض',
      plotNumber: '7890',
      planNumber: '1234',
      owner: 'ناصر بن علي الدوسري',
      transactionType: 'إداري',
      transactionCategory: 'مكتب',
      status: 'on-hold',
      createdDate: '2025-04-12',
      completedDate: '',
      area: 400,
      value: 1200000,
      assignedTo: 'م. خالد السالم',
      notes: 'مبنى إداري 5 أدوار - معلق بسبب تعديل المخططات'
    },
    {
      id: 'LOC-006',
      transactionId: 'TRX-2505001',
      transactionNumber: '2505001',
      latitude: 24.7512,
      longitude: 46.6634,
      address: 'حي الربوة، شارع العروبة',
      district: 'الربوة',
      city: 'الرياض',
      plotNumber: '2345',
      planNumber: '6789',
      owner: 'إبراهيم بن محمد الشمري',
      transactionType: 'سكني',
      transactionCategory: 'عمارة',
      status: 'cancelled',
      createdDate: '2025-05-08',
      completedDate: '',
      area: 600,
      value: 2400000,
      assignedTo: 'م. فهد النمر',
      notes: 'ملغاة بناءً على طلب المالك'
    },
    {
      id: 'LOC-007',
      transactionId: 'TRX-2506003',
      transactionNumber: '2506003',
      latitude: 24.6823,
      longitude: 46.7542,
      address: 'حي الشفا، طريق الدائري الشرقي',
      district: 'الشفا',
      city: 'الرياض',
      plotNumber: '5678',
      planNumber: '9012',
      owner: 'خالد بن فهد الحربي',
      transactionType: 'خدمي',
      transactionCategory: 'فندق',
      status: 'in-progress',
      createdDate: '2025-06-15',
      completedDate: '',
      area: 3000,
      value: 12000000,
      assignedTo: 'م. أحمد العلي',
      notes: 'فندق 4 نجوم - 10 أدوار'
    },
    {
      id: 'LOC-008',
      transactionId: 'TRX-2507002',
      transactionNumber: '2507002',
      latitude: 24.7623,
      longitude: 46.6912,
      address: 'حي الغدير، شارع الأمير سلطان',
      district: 'الغدير',
      city: 'الرياض',
      plotNumber: '8901',
      planNumber: '2345',
      owner: 'عبدالرحمن بن سعيد العنزي',
      transactionType: 'تجاري',
      transactionCategory: 'مركز تجاري',
      status: 'approved',
      createdDate: '2025-07-20',
      completedDate: '',
      area: 1500,
      value: 8000000,
      assignedTo: 'م. خالد السالم',
      notes: 'مركز تجاري 3 أدوار + بدروم'
    },
    {
      id: 'LOC-009',
      transactionId: 'TRX-2508001',
      transactionNumber: '2508001',
      latitude: 24.7089,
      longitude: 46.7634,
      address: 'حي النرجس، طريق الملك فهد',
      district: 'النرجس',
      city: 'الرياض',
      plotNumber: '3456',
      planNumber: '7890',
      owner: 'ماجد بن عبدالله الرشيد',
      transactionType: 'سكني',
      transactionCategory: 'فيلا',
      status: 'completed',
      createdDate: '2025-01-10',
      completedDate: '2025-08-15',
      area: 600,
      value: 2200000,
      assignedTo: 'م. فهد النمر',
      notes: 'فيلا دورين + ملحق - مكتمل'
    },
    {
      id: 'LOC-010',
      transactionId: 'TRX-2509004',
      transactionNumber: '2509004',
      latitude: 24.6934,
      longitude: 46.6745,
      address: 'حي المرسلات، شارع الثلاثين',
      district: 'المرسلات',
      city: 'الرياض',
      plotNumber: '6789',
      planNumber: '1234',
      owner: 'طلال بن محمد الغامدي',
      transactionType: 'استثماري',
      transactionCategory: 'برج سكني',
      status: 'in-progress',
      createdDate: '2025-09-05',
      completedDate: '',
      area: 4000,
      value: 20000000,
      assignedTo: 'م. أحمد العلي',
      notes: 'برج سكني 15 دور - قيد التنفيذ'
    },
    // إضافة 40 موقعاً آخر...
    {
      id: 'LOC-011',
      transactionId: 'TRX-2501010',
      transactionNumber: '2501010',
      latitude: 24.7456,
      longitude: 46.7123,
      address: 'حي الورود، طريق الملك عبدالله',
      district: 'الورود',
      city: 'الرياض',
      plotNumber: '4567',
      planNumber: '8901',
      owner: 'أحمد بن خالد البقمي',
      transactionType: 'سكني',
      transactionCategory: 'فيلا',
      status: 'completed',
      createdDate: '2025-01-25',
      completedDate: '2025-10-10',
      area: 550,
      value: 1950000,
      assignedTo: 'م. خالد السالم',
      notes: 'فيلا دورين مكتملة'
    },
    {
      id: 'LOC-012',
      transactionId: 'TRX-2502008',
      transactionNumber: '2502008',
      latitude: 24.6812,
      longitude: 46.7334,
      address: 'حي الربيع، شارع الأمير محمد بن عبدالعزيز',
      district: 'الربيع',
      city: 'الرياض',
      plotNumber: '7891',
      planNumber: '2345',
      owner: 'سلمان بن فيصل الفهد',
      transactionType: 'تجاري',
      transactionCategory: 'محل',
      status: 'approved',
      createdDate: '2025-02-28',
      completedDate: '',
      area: 200,
      value: 800000,
      assignedTo: 'م. فهد النمر',
      notes: 'محل تجاري معتمد'
    },
    {
      id: 'LOC-013',
      transactionId: 'TRX-2503012',
      transactionNumber: '2503012',
      latitude: 24.7234,
      longitude: 46.6556,
      address: 'حي المنار، طريق الملك فهد',
      district: 'المنار',
      city: 'الرياض',
      plotNumber: '1234',
      planNumber: '5678',
      owner: 'بدر بن عبدالله السبيعي',
      transactionType: 'سكني',
      transactionCategory: 'عمارة',
      status: 'in-progress',
      createdDate: '2025-03-18',
      completedDate: '',
      area: 700,
      value: 2800000,
      assignedTo: 'م. أحمد العلي',
      notes: 'عمارة 6 أدوار قيد التنفيذ'
    },
    {
      id: 'LOC-014',
      transactionId: 'TRX-2504015',
      transactionNumber: '2504015',
      latitude: 24.7567,
      longitude: 46.7234,
      address: 'حي الخزامى، شارع التخصصي',
      district: 'الخزامى',
      city: 'الرياض',
      plotNumber: '3456',
      planNumber: '7890',
      owner: 'يوسف بن إبراهيم الرويلي',
      transactionType: 'إداري',
      transactionCategory: 'مكتب',
      status: 'new',
      createdDate: '2025-04-22',
      completedDate: '',
      area: 350,
      value: 1050000,
      assignedTo: 'م. خالد السالم',
      notes: 'مبنى إداري جديد'
    },
    {
      id: 'LOC-015',
      transactionId: 'TRX-2505020',
      transactionNumber: '2505020',
      latitude: 24.6723,
      longitude: 46.6890,
      address: 'حي العزيزية، طريق الخرج',
      district: 'العزيزية',
      city: 'الرياض',
      plotNumber: '5678',
      planNumber: '9012',
      owner: 'فيصل بن سعد الشهراني',
      transactionType: 'صناعي',
      transactionCategory: 'مستودع',
      status: 'approved',
      createdDate: '2025-05-30',
      completedDate: '',
      area: 1200,
      value: 3600000,
      assignedTo: 'م. فهد النمر',
      notes: 'مستودع معتمد'
    }
    // يمكن إضافة المزيد...
  ];

  const [locations] = useState<Location[]>(mockLocations);

  // أنواع المعاملات (من شاشة 701)
  const transactionTypes = [
    { value: 'سكني', label: 'سكني', color: '#10b981', icon: Home },
    { value: 'تجاري', label: 'تجاري', color: '#3b82f6', icon: ShoppingBag },
    { value: 'صناعي', label: 'صناعي', color: '#f59e0b', icon: Factory },
    { value: 'زراعي', label: 'زراعي', color: '#22c55e', icon: TreePine },
    { value: 'إداري', label: 'إداري', color: '#8b5cf6', icon: Building2 },
    { value: 'خدمي', label: 'خدمي', color: '#ec4899', icon: Briefcase },
    { value: 'استثماري', label: 'استثماري', color: '#eab308', icon: Landmark },
    { value: 'سياحي', label: 'سياحي', color: '#06b6d4', icon: Hotel }
  ];

  // حالات المعاملات (من شاشة 701)
  const transactionStatuses = [
    { value: 'new', label: 'جديدة', color: '#3b82f6', icon: FileText },
    { value: 'in-progress', label: 'قيد المعالجة', color: '#f59e0b', icon: Clock },
    { value: 'approved', label: 'معتمدة', color: '#22c55e', icon: CheckCircle },
    { value: 'completed', label: 'مكتملة', color: '#10b981', icon: CheckCircle },
    { value: 'on-hold', label: 'معلقة', color: '#8b5cf6', icon: AlertCircle },
    { value: 'cancelled', label: 'ملغاة', color: '#6b7280', icon: XCircle },
    { value: 'rejected', label: 'مرفوضة', color: '#ef4444', icon: XCircle }
  ];

  // أحياء الرياض (من شاشة 948 - الأحياء والقطاعات)
  const riyadhDistricts = [
    { value: 'العليا', label: 'العليا', sector: 'شمال', lat: 24.7136, lng: 46.6753 },
    { value: 'الملز', label: 'الملز', sector: 'وسط', lat: 24.7244, lng: 46.6847 },
    { value: 'النخيل', label: 'النخيل', sector: 'شرق', lat: 24.6877, lng: 46.7219 },
    { value: 'العقيق', label: 'العقيق', sector: 'غرب', lat: 24.6947, lng: 46.6861 },
    { value: 'السليمانية', label: 'السليمانية', sector: 'وسط', lat: 24.6947, lng: 46.6861 },
    { value: 'الربوة', label: 'الربوة', sector: 'شمال', lat: 24.7512, lng: 46.6634 },
    { value: 'الشفا', label: 'الشفا', sector: 'شرق', lat: 24.6823, lng: 46.7542 },
    { value: 'الغدير', label: 'الغدير', sector: 'شمال', lat: 24.7623, lng: 46.6912 },
    { value: 'النرجس', label: 'النرجس', sector: 'شمال', lat: 24.7089, lng: 46.7634 },
    { value: 'المرسلات', label: 'المرسلات', sector: 'وسط', lat: 24.6934, lng: 46.6745 },
    { value: 'الروضة', label: 'الروضة', sector: 'شمال', lat: 24.7789, lng: 46.6543 },
    { value: 'قرطبة', label: 'قرطبة', sector: 'شمال', lat: 24.8012, lng: 46.6234 },
    { value: 'الياسمين', label: 'الياسمين', sector: 'شمال', lat: 24.8234, lng: 46.6456 },
    { value: 'النسيم', label: 'النسيم', sector: 'شرق', lat: 24.6523, lng: 46.7634 },
    { value: 'الخليج', label: 'الخليج', sector: 'وسط', lat: 24.7123, lng: 46.6789 },
    { value: 'الفلاح', label: 'الفلاح', sector: 'وسط', lat: 24.6945, lng: 46.6923 },
    { value: 'العريجاء', label: 'العريجاء', sector: 'غرب', lat: 24.6734, lng: 46.6234 },
    { value: 'المنصورة', label: 'المنصورة', sector: 'شمال غرب', lat: 24.7956, lng: 46.6123 },
    { value: 'السلام', label: 'السلام', sector: 'شمال', lat: 24.7845, lng: 46.6934 },
    { value: 'ظهرة لبن', label: 'ظهرة لبن', sector: 'جنوب', lat: 24.5623, lng: 46.6745 }
  ];

  // القطاعات الجغرافية
  const riyadhSectors = [
    { value: 'شمال', label: 'شمال الرياض', color: '#3b82f6' },
    { value: 'جنوب', label: 'جنوب الرياض', color: '#10b981' },
    { value: 'شرق', label: 'شرق الرياض', color: '#f59e0b' },
    { value: 'غرب', label: 'غرب الرياض', color: '#8b5cf6' },
    { value: 'وسط', label: 'وسط الرياض', color: '#ec4899' },
    { value: 'شمال غرب', label: 'شمال غرب الرياض', color: '#06b6d4' }
  ];

  // تصفية المواقع
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = loc.transactionNumber.includes(searchTerm) ||
                           loc.address.includes(searchTerm) ||
                           loc.owner.includes(searchTerm) ||
                           loc.district.includes(searchTerm);
      const matchesStatus = filterSettings.statuses.includes(loc.status);
      const matchesType = filterSettings.types.includes(loc.transactionType);
      const matchesDistrict = filterSettings.districts.length === 0 || 
                              filterSettings.districts.includes(loc.district);
      
      return matchesSearch && matchesStatus && matchesType && matchesDistrict;
    });
  }, [locations, searchTerm, filterSettings]);

  // إحصائيات
  const stats = useMemo(() => {
    const byStatus = filteredLocations.reduce((acc, loc) => {
      acc[loc.status] = (acc[loc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = filteredLocations.reduce((acc, loc) => {
      acc[loc.transactionType] = (acc[loc.transactionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = filteredLocations.reduce((sum, loc) => sum + loc.value, 0);
    const totalArea = filteredLocations.reduce((sum, loc) => sum + loc.area, 0);

    return {
      total: filteredLocations.length,
      byStatus,
      byType,
      totalValue,
      totalArea,
      avgValue: filteredLocations.length > 0 ? totalValue / filteredLocations.length : 0,
      avgArea: filteredLocations.length > 0 ? totalArea / filteredLocations.length : 0
    };
  }, [filteredLocations]);

  // دوال المساعدة
  const getStatusBadge = (status: string) => {
    const statusConfig = transactionStatuses.find(s => s.value === status);
    if (!statusConfig) return <Badge className="bg-gray-500 text-white text-xs">{status}</Badge>;
    
    return (
      <Badge 
        className="text-xs text-white" 
        style={{ backgroundColor: statusConfig.color }}
      >
        {statusConfig.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = transactionTypes.find(t => t.value === type);
    if (!typeConfig) return <Badge className="bg-gray-500 text-white text-xs">{type}</Badge>;
    
    return (
      <Badge 
        className="text-xs text-white" 
        style={{ backgroundColor: typeConfig.color }}
      >
        {typeConfig.label}
      </Badge>
    );
  };

  const getTypeColor = (type: string): string => {
    const typeConfig = transactionTypes.find(t => t.value === type);
    return typeConfig?.color || '#6b7280';
  };

  const getStatusColor = (status: string): string => {
    const statusConfig = transactionStatuses.find(s => s.value === status);
    return statusConfig?.color || '#6b7280';
  };

  // دوال التحكم في الخريطة المحسّنة
  const handleZoomToDistrict = (districtValue: string) => {
    const district = riyadhDistricts.find(d => d.value === districtValue);
    if (district) {
      setMapCenter({ lat: district.lat, lng: district.lng });
      setMapZoom(15); // تكبير أكثر للتركيز على الحي
      setSelectedDistrict(districtValue);
      toast.success(`تم التكبير على حي ${district.label}`);
    }
  };

  const handleZoomToSector = (sectorValue: string) => {
    const districtsInSector = riyadhDistricts.filter(d => d.sector === sectorValue);
    if (districtsInSector.length > 0) {
      // حساب متوسط إحداثيات الأحياء في القطاع
      const avgLat = districtsInSector.reduce((sum, d) => sum + d.lat, 0) / districtsInSector.length;
      const avgLng = districtsInSector.reduce((sum, d) => sum + d.lng, 0) / districtsInSector.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(13); // تكبير متوسط للقطاع
      setSelectedSector(sectorValue);
      const sector = riyadhSectors.find(s => s.value === sectorValue);
      toast.success(`تم التكبير على ${sector?.label || sectorValue}`);
    }
  };

  const handleResetMapView = () => {
    setMapCenter({ lat: 24.7136, lng: 46.6753 });
    setMapZoom(12);
    setSelectedDistrict('');
    setSelectedSector('');
    toast.info('تمت إعادة تعيين عرض الخريطة');
  };

  const handleTakeScreenshot = () => {
    if (mapRef.current) {
      // محاكاة أخذ لقطة
      const timestamp = new Date().toLocaleString('ar-SA');
      toast.success(`تم أخذ لقطة الشاشة بنجاح\nالتاريخ: ${timestamp}`, {
        duration: 4000
      });
      
      // في التطبيق الفعلي، استخدم مكتبة مثل html2canvas
      // html2canvas(mapRef.current).then(canvas => {
      //   const link = document.createElement('a');
      //   link.download = `map-screenshot-${Date.now()}.png`;
      //   link.href = canvas.toDataURL();
      //   link.click();
      // });
    }
  };

  const handleFilterByDistrict = (districtValue: string) => {
    setSelectedDistrict(districtValue);
    setFilterSettings(prev => ({
      ...prev,
      districts: districtValue ? [districtValue] : []
    }));
    
    if (districtValue) {
      // التكبير على الحي المحدد
      handleZoomToDistrict(districtValue);
    }
  };

  // التبويبات
  const TABS_CONFIG: TabConfig[] = [
    { id: '949-01', number: '949-01', title: 'الخريطة التفاعلية', icon: Map },
    { id: '949-02', number: '949-02', title: 'قائمة المواقع', icon: MapPin },
    { id: '949-03', number: '949-03', title: 'إعدادات العرض', icon: Filter },
    { id: '949-04', number: '949-04', title: 'الإحصائيات', icon: BarChart3 },
    { id: '949-05', number: '949-05', title: 'إعدادات الخريطة', icon: Settings },
    { id: '949-06', number: '949-06', title: 'التصدير والدمج', icon: Code },
    { id: '949-07', number: '949-07', title: 'السجل', icon: History },
    { id: '949-08', number: '949-08', title: 'التنقل المتقدم', icon: Navigation }
  ];

  // ==================== التاب 1: الخريطة التفاعلية المحسّنة ====================
  const renderInteractiveMap = () => (
    <div className="space-y-3">
      {/* أدوات التحكم المتقدمة */}
      <div className="grid grid-cols-2 gap-3">
        {/* القسم الأيمن: أدوات التكبير والتحكم */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Target className="h-4 w-4 text-blue-600" />
              أدوات التحكم في الخريطة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            {/* شريط التكبير */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مستوى التكبير</span>
                <Badge variant="outline" className="font-mono text-xs">{mapZoom}x</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 w-7 p-0" 
                  onClick={() => setMapZoom(Math.max(mapZoom - 1, 8))}
                  disabled={mapZoom <= 8}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Slider
                  value={[mapZoom]}
                  onValueChange={(value) => setMapZoom(value[0])}
                  min={8}
                  max={18}
                  step={1}
                  className="flex-1"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 w-7 p-0" 
                  onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                  disabled={mapZoom >= 18}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* أزرار التحكم السريع */}
            <div className="grid grid-cols-4 gap-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={handleResetMapView}
                title="إعادة تعيين العرض"
              >
                <Navigation className="h-3 w-3 ml-1" />
                إعادة تعيين
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={handleTakeScreenshot}
                title="أخذ لقطة"
              >
                <Camera className="h-3 w-3 ml-1" />
                لقطة
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={() => toast.info('فتح في شاشة كاملة')}
                title="ملء الشاشة"
              >
                <Maximize2 className="h-3 w-3 ml-1" />
                ملء الشاشة
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs"
                onClick={() => setShowDistrictFilter(!showDistrictFilter)}
                title="تصفية الأحياء"
              >
                <MapPin className="h-3 w-3 ml-1" />
                تصفية
              </Button>
            </div>

            {/* معلومات العرض الحالي */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <div className="text-gray-600">الإحداثيات المركزية</div>
                <div className="font-mono text-blue-600">{mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</div>
              </div>
              <div className="bg-green-50 p-2 rounded" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <div className="text-gray-600">المواقع المعروضة</div>
                <div className="font-bold text-green-600">{filteredLocations.length} موقع</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* القسم الأيسر: التصفية حسب الحي والقطاع */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Compass className="h-4 w-4 text-purple-600" />
              التكبير حسب المنطقة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            {/* التكبير حسب القطاع */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اختر القطاع للتكبير
              </label>
              <div className="grid grid-cols-3 gap-1">
                {riyadhSectors.map(sector => (
                  <Button
                    key={sector.value}
                    size="sm"
                    variant={selectedSector === sector.value ? 'default' : 'outline'}
                    className="h-8 text-xs"
                    style={{
                      backgroundColor: selectedSector === sector.value ? sector.color : undefined,
                      borderColor: sector.color
                    }}
                    onClick={() => handleZoomToSector(sector.value)}
                  >
                    <Locate className="h-3 w-3 ml-1" />
                    {sector.label.replace('الرياض', '')}
                  </Button>
                ))}
              </div>
            </div>

            {/* التكبير حسب الحي */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اختر الحي للتكبير والتصفية
              </label>
              <SelectWithCopy
                label=""
                value={selectedDistrict}
                onChange={(value) => handleFilterByDistrict(value)}
                options={[
                  { value: '', label: 'جميع الأحياء' },
                  ...riyadhDistricts.map(d => ({ 
                    value: d.value, 
                    label: `${d.label} (${d.sector})`
                  }))
                ]}
                copyable={false}
              />
            </div>

            {/* معلومات التحديد */}
            {(selectedDistrict || selectedSector) && (
              <div className="bg-purple-50 p-2 rounded text-xs space-y-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {selectedSector && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">القطاع المحدد:</span>
                    <Badge style={{ backgroundColor: riyadhSectors.find(s => s.value === selectedSector)?.color }}>
                      {riyadhSectors.find(s => s.value === selectedSector)?.label}
                    </Badge>
                  </div>
                )}
                {selectedDistrict && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الحي المحدد:</span>
                    <Badge variant="outline">{riyadhDistricts.find(d => d.value === selectedDistrict)?.label}</Badge>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 text-xs"
                  onClick={() => {
                    setSelectedDistrict('');
                    setSelectedSector('');
                    handleResetMapView();
                  }}
                >
                  <RefreshCw className="h-3 w-3 ml-1" />
                  إلغاء التحديد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* البحث السريع */}
      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <div className="grid grid-cols-3 gap-2">
            <InputWithCopy
              label=""
              placeholder="بحث برقم المعاملة، العنوان، المالك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              copyable={false}
              clearable={true}
            />
            <SelectWithCopy
              label=""
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'جميع الأنواع' },
                ...transactionTypes.map(t => ({ value: t.value, label: t.label }))
              ]}
              copyable={false}
            />
            <SelectWithCopy
              label=""
              value=""
              onChange={() => {}}
              options={[
                { value: '', label: 'جميع الحالات' },
                ...transactionStatuses.map(s => ({ value: s.value, label: s.label }))
              ]}
              copyable={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* الخريطة */}
      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div 
            ref={mapRef}
            style={{ 
              height: '500px', 
              background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              borderRadius: '8px',
              border: '2px solid #0ea5e9',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* خلفية الخريطة */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxZDVkYiIgb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=)',
                opacity: 0.3
              }}
            />

            {/* العلامات على الخريطة */}
            <div style={{ position: 'relative', height: '100%', padding: '20px' }}>
              {filteredLocations.slice(0, 20).map((loc, index) => {
                const typeColor = getTypeColor(loc.transactionType);
                const statusColor = getStatusColor(loc.status);
                
                // حساب موضع العلامة (توزيع عشوائي داخل الخريطة)
                const top = 10 + (index % 5) * 90;
                const left = 10 + Math.floor(index / 5) * 230;
                
                return (
                  <div
                    key={loc.id}
                    style={{
                      position: 'absolute',
                      top: `${top}px`,
                      left: `${left}px`,
                      cursor: 'pointer',
                      zIndex: selectedLocation?.id === loc.id ? 1000 : 1
                    }}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationDialog(true);
                    }}
                  >
                    {/* العلامة */}
                    <div
                      style={{
                        width: '32px',
                        height: '40px',
                        position: 'relative'
                      }}
                    >
                      {/* أيقونة الموقع */}
                      <svg
                        width="32"
                        height="40"
                        viewBox="0 0 32 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          filter: selectedLocation?.id === loc.id 
                            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' 
                            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                          transform: selectedLocation?.id === loc.id ? 'scale(1.3)' : 'scale(1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <path
                          d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
                          fill={typeColor}
                          opacity="0.9"
                        />
                        <circle cx="16" cy="16" r="6" fill="white" />
                        <circle 
                          cx="16" 
                          cy="16" 
                          r="4" 
                          fill={statusColor}
                        />
                      </svg>
                      
                      {/* رقم المعاملة */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-18px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          fontFamily: 'Courier New, monospace',
                          border: `1px solid ${typeColor}`,
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {loc.transactionNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* معلومات الخريطة */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '8px 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: '11px',
                fontFamily: 'Tajawal, sans-serif'
              }}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>الرياض • {filteredLocations.length} موقع</span>
                <span>•</span>
                <span>التكبير: {mapZoom}x</span>
              </div>
            </div>

            {/* مفتاح الألوان */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: '10px',
                fontFamily: 'Tajawal, sans-serif',
                maxWidth: '200px'
              }}
            >
              <p className="font-bold mb-2 text-xs">مفتاح الألوان:</p>
              <div className="space-y-1">
                <p className="font-bold text-[9px] text-gray-600 mb-1">حسب النوع (الإطار):</p>
                {transactionTypes.slice(0, 4).map(type => (
                  <div key={type.value} className="flex items-center gap-1">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: type.color
                      }}
                    />
                    <span style={{ fontSize: '9px' }}>{type.label}</span>
                  </div>
                ))}
                <p className="font-bold text-[9px] text-gray-600 mt-2 mb-1">حسب الحالة (النقطة):</p>
                {transactionStatuses.slice(0, 4).map(status => (
                  <div key={status.value} className="flex items-center gap-1">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: status.color
                      }}
                    />
                    <span style={{ fontSize: '9px' }}>{status.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-2 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            💡 انقر على أي علامة لعرض التفاصيل الكاملة للموقع والمعاملة
          </p>
        </CardContent>
      </Card>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-6 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
          <CardContent className="p-2 text-center">
            <MapPin className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{stats.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المواقع</p>
          </CardContent>
        </Card>

        {Object.entries(stats.byStatus).slice(0, 5).map(([status, count]) => {
          const statusConfig = transactionStatuses.find(s => s.value === status);
          return (
            <Card key={status} className="card-element card-rtl" style={{ borderRight: `3px solid ${statusConfig?.color || '#6b7280'}` }}>
              <CardContent className="p-2 text-center">
                {statusConfig && <statusConfig.icon className="h-5 w-5 mx-auto mb-1" style={{ color: statusConfig.color }} />}
                <p className="text-xl mb-0.5" style={{ color: statusConfig?.color }}>{count}</p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{statusConfig?.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ==================== التاب 2: قائمة المواقع ====================
  const renderLocationsList = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة جميع المواقع</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.info('تصدير القائمة')}>
            <Download className="h-3 w-3 ml-1" />تصدير
          </Button>
          <Button size="sm" className="h-8 text-xs bg-blue-500" onClick={() => toast.success('تحديث القائمة')}>
            <RefreshCw className="h-3 w-3 ml-1" />تحديث
          </Button>
        </div>
      </div>

      <Card className="card-element card-rtl">
        <CardContent className="p-2">
          <ScrollArea className="h-[550px]">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المالك</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map(loc => (
                  <TableRow key={loc.id} className="hover:bg-blue-50">
                    <TableCell className="text-right py-2 text-xs font-mono">{loc.transactionNumber}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin className="h-3 w-3" style={{ color: getTypeColor(loc.transactionType) }} />
                        <span>{loc.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{loc.district}</TableCell>
                    <TableCell className="text-right py-2 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{loc.owner}</TableCell>
                    <TableCell className="text-right py-2">{getTypeBadge(loc.transactionType)}</TableCell>
                    <TableCell className="text-right py-2">{getStatusBadge(loc.status)}</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{loc.area.toLocaleString()} م²</TableCell>
                    <TableCell className="text-right py-2 text-xs font-mono">{loc.value.toLocaleString()} ريال</TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex gap-1 justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={() => { setSelectedLocation(loc); setShowLocationDialog(true); }}
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={() => {
                            navigator.clipboard.writeText(`${loc.latitude}, ${loc.longitude}`);
                            toast.success('تم نسخ الإحداثيات');
                          }}
                          title="نسخ الإحداثيات"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0" 
                          onClick={() => window.open(`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`, '_blank')}
                          title="فتح في خرائط جوجل"
                        >
                          <ExternalLink className="h-3 w-3" />
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

  // ==================== التاب 3: إعدادات العرض والتصفية ====================
  const renderFilterSettings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات العرض والتصفية</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* تصفية حسب الحالة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Filter className="h-4 w-4 text-blue-600" />
              عرض حسب حالة المعاملة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {transactionStatuses.map(status => (
              <EnhancedSwitch
                key={status.value}
                id={`status-${status.value}`}
                checked={filterSettings.statuses.includes(status.value)}
                onCheckedChange={(checked) => {
                  setFilterSettings({
                    ...filterSettings,
                    statuses: checked 
                      ? [...filterSettings.statuses, status.value]
                      : filterSettings.statuses.filter(s => s !== status.value)
                  });
                }}
                label={status.label}
                size="sm"
              />
            ))}
          </CardContent>
        </Card>

        {/* تصفية حسب النوع */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Layers className="h-4 w-4 text-green-600" />
              عرض حسب نوع المعاملة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {transactionTypes.map(type => (
              <EnhancedSwitch
                key={type.value}
                id={`type-${type.value}`}
                checked={filterSettings.types.includes(type.value)}
                onCheckedChange={(checked) => {
                  setFilterSettings({
                    ...filterSettings,
                    types: checked 
                      ? [...filterSettings.types, type.value]
                      : filterSettings.types.filter(t => t !== type.value)
                  });
                }}
                label={type.label}
                size="sm"
                variant="success"
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 text-xs" 
          onClick={() => {
            setFilterSettings({
              statuses: ['new', 'in-progress', 'approved', 'completed', 'on-hold', 'cancelled', 'rejected'],
              types: ['سكني', 'تجاري', 'صناعي', 'زراعي', 'إداري', 'خدمي', 'استثماري', 'سياحي'],
              categories: [],
              cities: ['الرياض'],
              districts: [],
              dateFrom: '',
              dateTo: '',
              minValue: 0,
              maxValue: 10000000
            });
            toast.success('تم إعادة تعيين جميع التصفيات');
          }}
        >
          <RefreshCw className="h-3 w-3 ml-1" />إعادة تعيين
        </Button>
        <Button 
          size="sm" 
          className="h-8 text-xs bg-blue-500" 
          onClick={() => toast.success('تم حفظ الإعدادات')}
        >
          <Save className="h-3 w-3 ml-1" />حفظ الإعدادات
        </Button>
      </div>
    </div>
  );

  // ==================== التاب 4: الإحصائيات ====================
  const renderStatistics = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات والتحليلات</h2>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #3b82f6' }}>
          <CardContent className="p-2 text-center">
            <MapPin className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-xl text-blue-600 mb-0.5">{stats.total}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المواقع</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #10b981' }}>
          <CardContent className="p-2 text-center">
            <Building2 className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-xl text-green-600 mb-0.5">{stats.totalArea.toLocaleString()}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المساحات (م²)</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #f59e0b' }}>
          <CardContent className="p-2 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-xl text-orange-600 mb-0.5">{(stats.totalValue / 1000000).toFixed(1)}م</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي القيمة (مليون)</p>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl" style={{ borderRight: '3px solid #8b5cf6' }}>
          <CardContent className="p-2 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-xl text-purple-600 mb-0.5">{stats.avgArea.toFixed(0)}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط المساحة (م²)</p>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات حسب الحالة */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع حسب حالة المعاملة</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {transactionStatuses.map(status => {
              const count = stats.byStatus[status.value] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={status.value}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <status.icon className="h-4 w-4" style={{ color: status.color }} />
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{status.label}</span>
                    </div>
                    <span className="text-xs font-mono">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" style={{ backgroundColor: `${status.color}20` }} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات حسب النوع */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع حسب نوع المعاملة</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {transactionTypes.map(type => {
              const count = stats.byType[type.value] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={type.value}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" style={{ color: type.color }} />
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.label}</span>
                    </div>
                    <span className="text-xs font-mono">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" style={{ backgroundColor: `${type.color}20` }} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 5: إعدادات الخريطة ====================
  const renderMapSettings = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الخريطة</h2>

      <div className="grid grid-cols-2 gap-3">
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Map className="h-4 w-4 text-blue-600" />
              نوع الخريطة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <SelectWithCopy
              label="نوع الخريطة الأساسي"
              value={mapSettings.mapType}
              onChange={(value) => setMapSettings({ ...mapSettings, mapType: value as any })}
              options={[
                { value: 'osm', label: 'OpenStreetMap (مجاني)' },
                { value: 'google', label: 'خرائط جوجل' },
                { value: 'satellite', label: 'صور الأقمار الصناعية' },
                { value: 'terrain', label: 'التضاريس' }
              ]}
            />

            <InputWithCopy
              label="مستوى التكبير الافتراضي (8-18)"
              type="number"
              value={mapSettings.defaultZoom.toString()}
              onChange={(e) => setMapSettings({ ...mapSettings, defaultZoom: parseInt(e.target.value) || 12 })}
            />
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Settings className="h-4 w-4 text-green-600" />
              خيارات العرض
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <EnhancedSwitch
              id="cluster-markers"
              checked={mapSettings.clusterMarkers}
              onCheckedChange={(checked) => setMapSettings({ ...mapSettings, clusterMarkers: checked })}
              label="تجميع العلامات المتقاربة"
              description="تجميع العلامات القريبة في دائرة واحدة"
              size="sm"
            />

            <EnhancedSwitch
              id="show-labels"
              checked={mapSettings.showLabels}
              onCheckedChange={(checked) => setMapSettings({ ...mapSettings, showLabels: checked })}
              label="عرض أرقام المعاملات"
              description="إظهار رقم المعاملة فوق كل علامة"
              size="sm"
              variant="success"
            />

            <EnhancedSwitch
              id="show-grid"
              checked={mapSettings.showGrid}
              onCheckedChange={(checked) => setMapSettings({ ...mapSettings, showGrid: checked })}
              label="عرض الشبكة"
              description="إظهار شبكة الإحداثيات"
              size="sm"
              variant="warning"
            />

            <EnhancedSwitch
              id="animate-markers"
              checked={mapSettings.animateMarkers}
              onCheckedChange={(checked) => setMapSettings({ ...mapSettings, animateMarkers: checked })}
              label="تفعيل الحركات"
              description="تحريك العلامات عند الضغط عليها"
              size="sm"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 text-xs" 
          onClick={() => {
            setMapSettings({
              mapType: 'osm',
              defaultZoom: 12,
              defaultCenter: { lat: 24.7136, lng: 46.6753 },
              clusterMarkers: true,
              showLabels: true,
              showGrid: false,
              animateMarkers: true
            });
            toast.success('تم إعادة تعيين الإعدادات الافتراضية');
          }}
        >
          <RefreshCw className="h-3 w-3 ml-1" />إعادة تعيين
        </Button>
        <Button 
          size="sm" 
          className="h-8 text-xs bg-blue-500" 
          onClick={() => {
            localStorage.setItem('map_settings_949', JSON.stringify(mapSettings));
            toast.success('تم حفظ إعدادات الخريطة');
          }}
        >
          <Save className="h-3 w-3 ml-1" />حفظ الإعدادات
        </Button>
      </div>
    </div>
  );

  // ==================== التاب 6: التصدير والدمج ====================
  const renderExportEmbed = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصدير والدمج في المواقع الخارجية</h2>

      <div className="grid grid-cols-2 gap-3">
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Download className="h-4 w-4 text-blue-600" />
              تصدير البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-8 text-xs justify-start"
              onClick={() => toast.success('جاري تصدير البيانات بصيغة CSV...')}
            >
              <Download className="h-3 w-3 ml-2" />
              تصدير CSV (جدول Excel)
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-8 text-xs justify-start"
              onClick={() => toast.success('جاري تصدير البيانات بصيغة JSON...')}
            >
              <Code className="h-3 w-3 ml-2" />
              تصدير JSON (تطبيقات الويب)
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-8 text-xs justify-start"
              onClick={() => toast.success('جاري تصدير البيانات بصيغة KML...')}
            >
              <Globe className="h-3 w-3 ml-2" />
              تصدير KML (Google Earth)
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-8 text-xs justify-start"
              onClick={() => toast.success('جاري تصدير الخريطة كصورة...')}
            >
              <FileImage className="h-3 w-3 ml-2" />
              تصدير كصورة PNG
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              className="w-full h-8 text-xs justify-start"
              onClick={() => toast.success('جاري طباعة الخريطة...')}
            >
              <Printer className="h-3 w-3 ml-2" />
              طباعة الخريطة
            </Button>
          </CardContent>
        </Card>

        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Code className="h-4 w-4 text-green-600" />
              كود التضمين (Embed Code)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              استخدم الكود التالي لدمج الخريطة في موقعك الإلكتروني:
            </p>

            <div className="relative">
              <pre 
                className="text-[10px] bg-gray-100 p-2 rounded border border-gray-300 overflow-x-auto"
                style={{ fontFamily: 'Courier New, monospace', direction: 'ltr', textAlign: 'left' }}
              >
{`<iframe 
  src="https://alamiah.com/maps/embed" 
  width="100%" 
  height="500" 
  frameborder="0" 
  style="border:0" 
  allowfullscreen>
</iframe>`}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => {
                  navigator.clipboard.writeText(`<iframe src="https://alamiah.com/maps/embed" width="100%" height="500" frameborder="0" style="border:0" allowfullscreen></iframe>`);
                  toast.success('تم نسخ كود التضمين');
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <Button 
              size="sm" 
              className="w-full h-8 text-xs bg-green-500"
              onClick={() => toast.info('معاينة الخريطة المدمجة')}
            >
              <Eye className="h-3 w-3 ml-2" />
              معاينة الخريطة المدمجة
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* خيارات التخصيص */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Settings className="h-4 w-4 text-purple-600" />
            خيارات التخصيص للخريطة المدمجة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2">
            <EnhancedSwitch
              id="embed-search"
              checked={true}
              onCheckedChange={() => {}}
              label="عرض شريط البحث"
              size="sm"
            />
            <EnhancedSwitch
              id="embed-filters"
              checked={true}
              onCheckedChange={() => {}}
              label="عرض أزرار التصفية"
              size="sm"
              variant="success"
            />
            <EnhancedSwitch
              id="embed-legend"
              checked={true}
              onCheckedChange={() => {}}
              label="عرض مفتاح الألوان"
              size="sm"
              variant="warning"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 7: السجل ====================
  const renderHistory = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل التحديثات والتغييرات</h2>

      <Card className="card-element card-rtl">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة موقع جديد</p>
                <p className="text-[10px] text-gray-600">تم إضافة موقع معاملة 2510005 - حي الياسمين</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500">2025-10-30</p>
                <p className="text-[10px] text-gray-500">14:25</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحديث حالة معاملة</p>
                <p className="text-[10px] text-gray-600">تم تحديث حالة معاملة 2501001 إلى "مكتملة"</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500">2025-10-29</p>
                <p className="text-[10px] text-gray-500">11:30</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحديث إعدادات الخريطة</p>
                <p className="text-[10px] text-gray-600">تم تغيير نوع الخريطة إلى صور الأقمار الصناعية</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500">2025-10-28</p>
                <p className="text-[10px] text-gray-500">09:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== التاب 8: التنقل المتقدم ====================
  const renderAdvancedNavigation = () => (
    <div className="space-y-3">
      <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التنقل المتقدم والمقارنة</h2>

      {/* بطاقات التنقل السريع */}
      <div className="grid grid-cols-4 gap-3">
        {/* التنقل حسب القطاع */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Compass className="h-4 w-4 text-blue-600" />
              القطاعات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {riyadhSectors.map(sector => {
                const locationsInSector = filteredLocations.filter(
                  loc => riyadhDistricts.find(d => d.value === loc.district)?.sector === sector.value
                );
                return (
                  <Button
                    key={sector.value}
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs justify-start"
                    style={{ borderColor: sector.color }}
                    onClick={() => handleZoomToSector(sector.value)}
                  >
                    <MapPinned className="h-3 w-3 ml-1" style={{ color: sector.color }} />
                    {sector.label.replace(' الرياض', '')}
                    <Badge className="mr-auto" style={{ backgroundColor: sector.color }}>
                      {locationsInSector.length}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* أكثر الأحياء نشاطاً */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <TrendingUp className="h-4 w-4 text-green-600" />
              الأكثر نشاطاً
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-48">
              <div className="space-y-1">
                {Object.entries(
                  filteredLocations.reduce((acc, loc) => {
                    acc[loc.district] = (acc[loc.district] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([district, count]) => {
                    const districtInfo = riyadhDistricts.find(d => d.value === district);
                    return (
                      <div
                        key={district}
                        className="flex items-center justify-between p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100"
                        onClick={() => handleFilterByDistrict(district)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-green-600" />
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {districtInfo?.label || district}
                          </span>
                        </div>
                        <Badge className="bg-green-600 text-white">{count}</Badge>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* المعاملات حسب الحالة */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <BarChart3 className="h-4 w-4 text-purple-600" />
              حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {transactionStatuses.map(status => {
                const count = filteredLocations.filter(loc => loc.status === status.value).length;
                const percentage = filteredLocations.length > 0 
                  ? (count / filteredLocations.length * 100).toFixed(0) 
                  : 0;
                return (
                  <div key={status.value} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{status.label}</span>
                      <Badge style={{ backgroundColor: status.color }}>{count}</Badge>
                    </div>
                    <Progress value={Number(percentage)} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* المعاملات حسب النوع */}
        <Card className="card-element card-rtl">
          <CardHeader className="p-2 pb-1">
            <CardTitle className="text-sm flex items-center gap-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <Building2 className="h-4 w-4 text-orange-600" />
              حسب النوع
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {transactionTypes.map(type => {
                const count = filteredLocations.filter(loc => loc.transactionType === type.value).length;
                const percentage = filteredLocations.length > 0 
                  ? (count / filteredLocations.length * 100).toFixed(0) 
                  : 0;
                return (
                  <div key={type.value} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <type.icon className="h-3 w-3" style={{ color: type.color }} />
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.label}</span>
                      </div>
                      <Badge style={{ backgroundColor: type.color }}>{count}</Badge>
                    </div>
                    <Progress value={Number(percentage)} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التصدير السريع */}
      <Card className="card-element card-rtl">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <Download className="h-4 w-4 text-blue-600" />
            أدوات التصدير السريع
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-6 gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleTakeScreenshot}>
              <Camera className="h-3 w-3 ml-1" />
              لقطة شاشة
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success('جاري تصدير البيانات إلى Excel...')}>
              <FileText className="h-3 w-3 ml-1" />
              Excel
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success('جاري تصدير البيانات إلى PDF...')}>
              <FileText className="h-3 w-3 ml-1" />
              PDF
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success('جاري تصدير الإحداثيات...')}>
              <MapPin className="h-3 w-3 ml-1" />
              إحداثيات
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success('جاري النسخ إلى الحافظة...')}>
              <Copy className="h-3 w-3 ml-1" />
              نسخ
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success('جاري فتح في تطبيق خارجي...')}>
              <ExternalLink className="h-3 w-3 ml-1" />
              فتح خارجي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // المحتوى الرئيسي
  const renderTabContent = () => {
    switch (activeTab) {
      case '949-01': return renderInteractiveMap();
      case '949-02': return renderLocationsList();
      case '949-03': return renderFilterSettings();
      case '949-04': return renderStatistics();
      case '949-05': return renderMapSettings();
      case '949-06': return renderExportEmbed();
      case '949-07': return renderHistory();
      case '949-08': return renderAdvancedNavigation();
      default: return renderInteractiveMap();
    }
  };

  return (
    <div>
      {/* هيدر الشاشة */}
      <div
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 10,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, #2563eb 0%, #10b981 50%, #2563eb 100%) 1',
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
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(37, 99, 235, 0.02) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <Map 
                className="h-6 w-6" 
                style={{ 
                  color: '#10b981',
                  filter: 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))' 
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
                    background: 'linear-gradient(135deg, #059669 0%, #1e40af 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  خريطة المواقع
                </h1>
                
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
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
                    949
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
                عرض وإدارة جميع مواقع المعاملات على خريطة تفاعلية مع تمييز متقدم وإحصائيات شاملة
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              style={{
                padding: '6px 14px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)'
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
                7 تبويبات
              </span>
            </div>
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
        
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 220px)' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة تفاصيل الموقع */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل الموقع - معاملة {selectedLocation?.transactionNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLocation && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Card className="card-element card-rtl">
                  <CardHeader className="p-2 pb-1">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الموقع</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    <InputWithCopy label="العنوان" value={selectedLocation.address} readOnly />
                    <InputWithCopy label="الحي" value={selectedLocation.district} readOnly />
                    <InputWithCopy label="المدينة" value={selectedLocation.city} readOnly />
                    <InputWithCopy label="رقم القطعة" value={selectedLocation.plotNumber} readOnly />
                    <InputWithCopy label="رقم المخطط" value={selectedLocation.planNumber} readOnly />
                    <InputWithCopy label="الإحداثيات" value={`${selectedLocation.latitude}, ${selectedLocation.longitude}`} readOnly />
                  </CardContent>
                </Card>

                <Card className="card-element card-rtl">
                  <CardHeader className="p-2 pb-1">
                    <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات المعاملة</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    <InputWithCopy label="المالك" value={selectedLocation.owner} readOnly />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</label>
                        <div className="mt-1">
                          {getTypeBadge(selectedLocation.transactionType)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</label>
                        <div className="mt-1">
                          {getStatusBadge(selectedLocation.status)}
                        </div>
                      </div>
                    </div>
                    <InputWithCopy label="المساحة" value={`${selectedLocation.area.toLocaleString()} م²`} readOnly />
                    <InputWithCopy label="القيمة" value={`${selectedLocation.value.toLocaleString()} ريال`} readOnly />
                    <InputWithCopy label="المسؤول" value={selectedLocation.assignedTo} readOnly />
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 ml-1" />
                  فتح في خرائط جوجل
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 text-xs bg-blue-500"
                  onClick={() => {
                    setShowLocationDialog(false);
                    toast.success('تم عرض الموقع على الخريطة');
                  }}
                >
                  <Map className="h-3 w-3 ml-1" />
                  عرض على الخريطة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationsMap;
