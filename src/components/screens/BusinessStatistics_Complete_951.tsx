import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  BarChart3, Building2, Home, TrendingUp, MapPin, Calendar,
  FileText, Download, Printer, Filter, Search, RefreshCw,
  Building, Users, Layers, Ruler, Zap, Activity, PieChart,
  ArrowUp, ArrowDown, Target, Award, ChevronRight, Map,
  DollarSign, Percent, LineChart, LayoutGrid, Hash, Star,
  Compass, MapPinned, Landmark, TreePine, Factory, ShoppingBag,
  CheckCircle, Eye, X, Trash2, File, Upload, Clock, Shield,
  Plus, Link2, UserCircle, Network, MapPin as MapPinIcon
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UniversalTabsSidebar from '../UniversalTabsSidebar';

// أنواع البيانات
interface ProjectStats {
  type: string;
  count: number;
  totalArea: number;
  avgArea: number;
  totalValue: number;
  percentage: number;
}

interface CityStats {
  city: string;
  projectsCount: number;
  totalArea: number;
  residentialCount: number;
  commercialCount: number;
  industrialCount: number;
  licensesCount: number;
  avgFloors: number;
}

interface MonthlyStats {
  month: string;
  projects: number;
  area: number;
  value: number;
  licenses: number;
}

interface DistrictStats {
  district: string;
  city: string;
  villasCount: number;
  buildingsCount: number;
  totalArea: number;
  avgPrice: number;
}

interface BuildingHeightStats {
  floors: number;
  count: number;
  totalArea: number;
  avgAreaPerFloor: number;
  cities: string[];
}

interface ClientStats {
  clientName: string;
  clientType: string;
  projectsCount: number;
  totalArea: number;
  totalValue: number;
  completedProjects: number;
  ongoingProjects: number;
  avgProjectValue: number;
}

interface ExternalEntityStats {
  entityName: string;
  entityType: string;
  interactionsCount: number;
  projectsInvolved: number;
  totalValue: number;
  category: string;
  city: string;
}

interface RiyadhSectorStats {
  sectorName: string;
  projectsCount: number;
  totalArea: number;
  residentialCount: number;
  commercialCount: number;
  mixedUseCount: number;
  avgPrice: number;
  growth: number;
}

interface YearComparisonStats {
  year: number;
  projectsCount: number;
  totalArea: number;
  totalValue: number;
  avgProjectValue: number;
  growthRate: number;
  licensesCount: number;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  lastModified: string;
  filters: string[];
  status: string;
}

interface ExportHistory {
  id: string;
  fileName: string;
  format: string;
  size: string;
  date: string;
  records: number;
  status: string;
}

interface MainClassificationStats {
  classificationName: string;
  projectsCount: number;
  totalArea: number;
  totalValue: number;
  percentage: number;
  avgProjectValue: number;
  growth: number;
  licensesCount: number;
}

interface SubClassificationStats {
  subClassificationName: string;
  mainClassification: string;
  projectsCount: number;
  totalArea: number;
  totalValue: number;
  avgArea: number;
  avgValue: number;
  trend: string;
}

interface TransactionTypeStats {
  transactionType: string;
  count: number;
  avgProcessingTime: number;
  completedCount: number;
  pendingCount: number;
  rejectedCount: number;
  successRate: number;
  avgFees: number;
}

interface NeighborhoodStats {
  neighborhoodName: string;
  city: string;
  projectsCount: number;
  totalArea: number;
  residentialCount: number;
  commercialCount: number;
  avgPrice: number;
  population: number;
  developmentIndex: number;
}

interface FloorHeightStats {
  category: string;
  floorRange: string;
  projectsCount: number;
  totalArea: number;
  avgHeight: number;
  avgFloors: number;
  totalUnits: number;
  avgUnitArea: number;
}

interface TimeAnalysisStats {
  period: string;
  year: number;
  month?: string;
  quarter?: string;
  projectsCount: number;
  totalValue: number;
  avgValue: number;
  growth: number;
  licensesIssued: number;
}

interface UsageStats {
  usageType: string;
  projectsCount: number;
  totalArea: number;
  percentage: number;
  avgProjectArea: number;
  totalValue: number;
  avgValue: number;
  trend: string;
}

const BusinessStatistics_Complete_951: React.FC = () => {
  const [activeTab, setActiveTab] = useState('951-01');
  const [timeFilter, setTimeFilter] = useState('12months');
  const [cityFilter, setCityFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [comparisonType, setComparisonType] = useState('years');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  // بيانات إحصائيات المشاريع حسب النوع
  const [projectTypeStats] = useState<ProjectStats[]>([
    { type: 'فلل سكنية', count: 342, totalArea: 153900, avgArea: 450, totalValue: 461700000, percentage: 38.5 },
    { type: 'مباني سكنية', count: 189, totalArea: 283500, avgArea: 1500, totalValue: 566700000, percentage: 21.3 },
    { type: 'مباني تجارية', count: 145, totalArea: 217500, avgArea: 1500, totalValue: 652500000, percentage: 16.4 },
    { type: 'مجمعات سكنية', count: 87, totalArea: 174000, avgArea: 2000, totalValue: 522000000, percentage: 9.8 },
    { type: 'مراكز تجارية', count: 62, totalArea: 186000, avgArea: 3000, totalValue: 744000000, percentage: 7.0 },
    { type: 'منشآت صناعية', count: 38, totalArea: 114000, avgArea: 3000, totalValue: 228000000, percentage: 4.3 },
    { type: 'مساجد', count: 25, totalArea: 12500, avgArea: 500, totalValue: 37500000, percentage: 2.8 }
  ]);

  // بيانات إحصائيات المدن
  const [cityStats] = useState<CityStats[]>([
    { city: 'الرياض', projectsCount: 384, totalArea: 576000, residentialCount: 245, commercialCount: 98, industrialCount: 23, licensesCount: 428, avgFloors: 4.2 },
    { city: 'جدة', projectsCount: 267, totalArea: 400500, residentialCount: 178, commercialCount: 67, industrialCount: 15, licensesCount: 298, avgFloors: 5.1 },
    { city: 'الدمام', projectsCount: 156, totalArea: 234000, residentialCount: 98, commercialCount: 42, industrialCount: 12, licensesCount: 174, avgFloors: 3.8 },
    { city: 'مكة المكرمة', projectsCount: 98, totalArea: 147000, residentialCount: 67, commercialCount: 23, industrialCount: 5, licensesCount: 109, avgFloors: 6.3 },
    { city: 'المدينة المنورة', projectsCount: 67, totalArea: 100500, residentialCount: 45, commercialCount: 18, industrialCount: 3, licensesCount: 75, avgFloors: 4.5 }
  ]);

  // بيانات إحصائيات شهرية
  const [monthlyStats] = useState<MonthlyStats[]>([
    { month: 'يناير 2024', projects: 67, area: 100500, value: 301500000, licenses: 75 },
    { month: 'فبراير 2024', projects: 72, area: 108000, value: 324000000, licenses: 80 },
    { month: 'مارس 2024', projects: 89, area: 133500, value: 400500000, licenses: 99 },
    { month: 'أبريل 2024', projects: 78, area: 117000, value: 351000000, licenses: 87 },
    { month: 'مايو 2024', projects: 95, area: 142500, value: 427500000, licenses: 106 },
    { month: 'يونيو 2024', projects: 83, area: 124500, value: 373500000, licenses: 92 },
    { month: 'يوليو 2024', projects: 91, area: 136500, value: 409500000, licenses: 101 },
    { month: 'أغسطس 2024', projects: 87, area: 130500, value: 391500000, licenses: 97 },
    { month: 'سبتمبر 2024', projects: 76, area: 114000, value: 342000000, licenses: 85 },
    { month: 'أكتوبر 2024', projects: 102, area: 153000, value: 459000000, licenses: 114 },
    { month: 'نوفمبر 2024', projects: 94, area: 141000, value: 423000000, licenses: 105 },
    { month: 'ديسمبر 2024', projects: 88, area: 132000, value: 396000000, licenses: 98 }
  ]);

  // بيانات إحصائيات الأحياء
  const [districtStats] = useState<DistrictStats[]>([
    { district: 'الملقا', city: 'الرياض', villasCount: 45, buildingsCount: 12, totalArea: 31500, avgPrice: 3500 },
    { district: 'النرجس', city: 'الرياض', villasCount: 38, buildingsCount: 8, totalArea: 26100, avgPrice: 3800 },
    { district: 'حطين', city: 'الرياض', villasCount: 42, buildingsCount: 15, totalArea: 34200, avgPrice: 3200 },
    { district: 'الروضة', city: 'جدة', villasCount: 52, buildingsCount: 18, totalArea: 38400, avgPrice: 3600 },
    { district: 'الفيصلية', city: 'الدمام', villasCount: 28, buildingsCount: 9, totalArea: 21600, avgPrice: 3300 },
    { district: 'العزيزية', city: 'مكة المكرمة', villasCount: 31, buildingsCount: 11, totalArea: 24900, avgPrice: 4200 },
    { district: 'العيون', city: 'المدينة المنورة', villasCount: 24, buildingsCount: 7, totalArea: 18300, avgPrice: 3900 }
  ]);

  // بيانات إحصائيات ارتفاعات المباني
  const [buildingHeightStats] = useState<BuildingHeightStats[]>([
    { floors: 1, count: 298, totalArea: 119200, avgAreaPerFloor: 400, cities: ['الرياض', 'جدة', 'الدمام'] },
    { floors: 2, count: 245, totalArea: 147000, avgAreaPerFloor: 300, cities: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'] },
    { floors: 3, count: 187, totalArea: 168300, avgAreaPerFloor: 300, cities: ['الرياض', 'جدة', 'الدمام'] },
    { floors: 4, count: 142, totalArea: 170400, avgAreaPerFloor: 300, cities: ['الرياض', 'جدة', 'مكة المكرمة'] },
    { floors: 5, count: 98, totalArea: 147000, avgAreaPerFloor: 300, cities: ['الرياض', 'جدة'] },
    { floors: 6, count: 67, totalArea: 120600, avgAreaPerFloor: 300, cities: ['جدة', 'مكة المكرمة'] },
    { floors: 7, count: 45, totalArea: 94500, avgAreaPerFloor: 300, cities: ['جدة', 'مكة المكرمة'] },
    { floors: 8, count: 32, totalArea: 76800, avgAreaPerFloor: 300, cities: ['جدة', 'مكة المكرمة'] },
    { floors: 10, count: 18, totalArea: 54000, avgAreaPerFloor: 300, cities: ['جدة'] },
    { floors: 12, count: 12, totalArea: 43200, avgAreaPerFloor: 300, cities: ['جدة', 'مكة المكرمة'] },
    { floors: 15, count: 8, totalArea: 36000, avgAreaPerFloor: 300, cities: ['جدة'] },
    { floors: 20, count: 3, totalArea: 18000, avgAreaPerFloor: 300, cities: ['جدة'] }
  ]);

  // بيانات إحصائيات العملاء
  const [clientStats] = useState<ClientStats[]>([
    { clientName: 'شركة التطوير العقاري الأولى', clientType: 'شركة', projectsCount: 67, totalArea: 100500, totalValue: 301500000, completedProjects: 52, ongoingProjects: 15, avgProjectValue: 4500000 },
    { clientName: 'مؤسسة البناء الحديث', clientType: 'مؤسسة', projectsCount: 54, totalArea: 81000, totalValue: 243000000, completedProjects: 45, ongoingProjects: 9, avgProjectValue: 4500000 },
    { clientName: 'المهندس أحمد العتيبي', clientType: 'فردي', projectsCount: 48, totalArea: 72000, totalValue: 216000000, completedProjects: 42, ongoingProjects: 6, avgProjectValue: 4500000 },
    { clientName: 'شركة المباني الذكية', clientType: 'شركة', projectsCount: 42, totalArea: 63000, totalValue: 189000000, completedProjects: 35, ongoingProjects: 7, avgProjectValue: 4500000 },
    { clientName: 'مجموعة الإنشاءات المتقدمة', clientType: 'مجموعة', projectsCount: 38, totalArea: 57000, totalValue: 171000000, completedProjects: 30, ongoingProjects: 8, avgProjectValue: 4500000 },
    { clientName: 'المهندس خالد المطيري', clientType: 'فردي', projectsCount: 35, totalArea: 52500, totalValue: 157500000, completedProjects: 28, ongoingProjects: 7, avgProjectValue: 4500000 },
    { clientName: 'شركة العمران الجديد', clientType: 'شركة', projectsCount: 32, totalArea: 48000, totalValue: 144000000, completedProjects: 26, ongoingProjects: 6, avgProjectValue: 4500000 },
    { clientName: 'مؤسسة الإعمار الوطنية', clientType: 'مؤسسة', projectsCount: 28, totalArea: 42000, totalValue: 126000000, completedProjects: 22, ongoingProjects: 6, avgProjectValue: 4500000 },
    { clientName: 'المهندس سعد القحطاني', clientType: 'فردي', projectsCount: 25, totalArea: 37500, totalValue: 112500000, completedProjects: 20, ongoingProjects: 5, avgProjectValue: 4500000 },
    { clientName: 'شركة البنيان الراسخ', clientType: 'شركة', projectsCount: 22, totalArea: 33000, totalValue: 99000000, completedProjects: 18, ongoingProjects: 4, avgProjectValue: 4500000 }
  ]);

  // بيانات إحصائيات الجهات الخارجية
  const [externalEntityStats] = useState<ExternalEntityStats[]>([
    { entityName: 'أمانة منطقة الرياض', entityType: 'حكومي', interactionsCount: 287, projectsInvolved: 245, totalValue: 735000000, category: 'رخص وتصاريح', city: 'الرياض' },
    { entityName: 'الهيئة العامة للمساحة', entityType: 'حكومي', interactionsCount: 234, projectsInvolved: 198, totalValue: 594000000, category: 'مساحة', city: 'الرياض' },
    { entityName: 'هيئة تطوير الرياض', entityType: 'حكومي', interactionsCount: 189, projectsInvolved: 156, totalValue: 468000000, category: 'تطوير', city: 'الرياض' },
    { entityName: 'الدفاع المدني', entityType: 'حكومي', interactionsCount: 176, projectsInvolved: 142, totalValue: 426000000, category: 'سلامة', city: 'الرياض' },
    { entityName: 'شركة الكهرباء السعودية', entityType: 'خاص', interactionsCount: 165, projectsInvolved: 134, totalValue: 402000000, category: 'خدمات', city: 'الرياض' },
    { entityName: 'المياه الوطنية', entityType: 'حكومي', interactionsCount: 154, projectsInvolved: 128, totalValue: 384000000, category: 'خدمات', city: 'الرياض' },
    { entityName: 'وزارة البلديات', entityType: 'حكومي', interactionsCount: 142, projectsInvolved: 115, totalValue: 345000000, category: 'رخص وتصاريح', city: 'الرياض' },
    { entityName: 'الهيئة الملكية لمدينة الرياض', entityType: 'حكومي', interactionsCount: 128, projectsInvolved: 102, totalValue: 306000000, category: 'تطوير', city: 'الرياض' },
    { entityName: 'هيئة المهندسين السعوديين', entityType: 'مهني', interactionsCount: 115, projectsInvolved: 98, totalValue: 294000000, category: 'تصنيف', city: 'الرياض' },
    { entityName: 'البنك الوطني', entityType: 'خاص', interactionsCount: 98, projectsInvolved: 87, totalValue: 261000000, category: 'تمويل', city: 'الرياض' }
  ]);

  // بيانات إحصائيات قطاعات الرياض
  const [riyadhSectorStats] = useState<RiyadhSectorStats[]>([
    { sectorName: 'قطاع وسط مدينة الرياض', projectsCount: 156, totalArea: 234000, residentialCount: 98, commercialCount: 42, mixedUseCount: 16, avgPrice: 4500, growth: 14.8 },
    { sectorName: 'قطاع شمال مدينة الرياض', projectsCount: 189, totalArea: 283500, residentialCount: 125, commercialCount: 48, mixedUseCount: 16, avgPrice: 3900, growth: 18.2 },
    { sectorName: 'قطاع جنوب مدينة الرياض', projectsCount: 132, totalArea: 198000, residentialCount: 89, commercialCount: 32, mixedUseCount: 11, avgPrice: 3300, growth: 12.5 },
    { sectorName: 'قطاع شرق مدينة الرياض', projectsCount: 145, totalArea: 217500, residentialCount: 96, commercialCount: 38, mixedUseCount: 11, avgPrice: 3600, growth: 16.3 },
    { sectorName: 'قطاع غرب مدينة الرياض', projectsCount: 124, totalArea: 186000, residentialCount: 82, commercialCount: 31, mixedUseCount: 11, avgPrice: 3700, growth: 13.7 }
  ]);

  // بيانات المقارنات السنوية
  const [yearComparisonStats] = useState<YearComparisonStats[]>([
    { year: 2024, projectsCount: 1022, totalArea: 1533000, totalValue: 4599000000, avgProjectValue: 4500000, growthRate: 18.4, licensesCount: 1139 },
    { year: 2023, projectsCount: 863, totalArea: 1294500, totalValue: 3883500000, avgProjectValue: 4500000, growthRate: 15.2, licensesCount: 962 },
    { year: 2022, projectsCount: 749, totalArea: 1123500, totalValue: 3370500000, avgProjectValue: 4500000, growthRate: 12.8, licensesCount: 835 },
    { year: 2021, projectsCount: 664, totalArea: 996000, totalValue: 2988000000, avgProjectValue: 4500000, growthRate: 8.5, licensesCount: 740 },
    { year: 2020, projectsCount: 612, totalArea: 918000, totalValue: 2754000000, avgProjectValue: 4500000, growthRate: 5.2, licensesCount: 682 }
  ]);

  // بيانات التقارير المخصصة
  const [customReports] = useState<CustomReport[]>([
    { id: 'RPT-001', name: 'تقرير المشاريع السكنية الشهري', description: 'تقرير شامل للمشاريع السكنية خلال الشهر الحالي', createdDate: '2024-01-15', lastModified: '2024-10-10', filters: ['نوع: سكني', 'الفترة: شهري', 'المدينة: الرياض'], status: 'نشط' },
    { id: 'RPT-002', name: 'تقرير المقارنة السنوية', description: 'مقارنة شاملة للأداء بين السنوات الخمس الماضية', createdDate: '2024-02-20', lastModified: '2024-10-08', filters: ['الفترة: سنوي', 'نوع: الكل'], status: 'نشط' },
    { id: 'RPT-003', name: 'تقرير العملاء الرئيسيين', description: 'تحليل تفصيلي لأكبر 10 عملاء من حيث القيمة', createdDate: '2024-03-05', lastModified: '2024-10-12', filters: ['العملاء: أعلى 10', 'القيمة: تنازلي'], status: 'نشط' },
    { id: 'RPT-004', name: 'تقرير التراخيص الربع سنوي', description: 'إحصائيات التراخيص والتصاريح الصادرة', createdDate: '2024-04-12', lastModified: '2024-09-28', filters: ['الفترة: ربع سنوي', 'نوع: تراخيص'], status: 'نشط' },
    { id: 'RPT-005', name: 'تقرير المدن الكبرى', description: 'تحليل مقارن لأداء المدن الخمس الكبرى', createdDate: '2024-05-18', lastModified: '2024-10-05', filters: ['المدن: أعلى 5', 'المشاريع: الكل'], status: 'نشط' },
    { id: 'RPT-006', name: 'تقرير الأحياء الجديدة', description: 'تحليل المشاريع في الأحياء المستجدة', createdDate: '2024-06-22', lastModified: '2024-10-01', filters: ['الأحياء: جديدة', 'الفترة: آخر 6 أشهر'], status: 'مؤرشف' },
    { id: 'RPT-007', name: 'تقرير المباني التجارية', description: 'إحصائيات شاملة للمشاريع التجارية', createdDate: '2024-07-08', lastModified: '2024-10-15', filters: ['نوع: تجاري', 'الحالة: الكل'], status: 'نشط' },
    { id: 'RPT-008', name: 'تقرير الجهات الحكومية', description: 'تحليل التعاملات مع الجهات الحكومية', createdDate: '2024-08-14', lastModified: '2024-10-07', filters: ['الجهات: حكومي', 'التفاعلات: الكل'], status: 'نشط' }
  ]);

  // بيانات سجل التصدير
  const [exportHistory] = useState<ExportHistory[]>([
    { id: 'EXP-001', fileName: 'تقرير_المشاريع_أكتوبر_2024.pdf', format: 'PDF', size: '2.4', date: '2024-10-18 14:30', records: 1022, status: 'مكتمل' },
    { id: 'EXP-002', fileName: 'بيانات_العملاء_2024.xlsx', format: 'Excel', size: '1.8', date: '2024-10-17 11:15', records: 856, status: 'مكتمل' },
    { id: 'EXP-003', fileName: 'إحصائيات_المدن_Q3_2024.csv', format: 'CSV', size: '0.456', date: '2024-10-16 09:45', records: 2134, status: 'مكتمل' },
    { id: 'EXP-004', fileName: 'تقرير_شامل_السنوي.docx', format: 'Word', size: '3.2', date: '2024-10-15 16:20', records: 1567, status: 'مكتمل' },
    { id: 'EXP-005', fileName: 'جداول_التراخيص_2024.xlsx', format: 'Excel', size: '2.1', date: '2024-10-14 13:00', records: 1139, status: 'مكتمل' },
    { id: 'EXP-006', fileName: 'مقارنة_الأداء_5_سنوات.pdf', format: 'PDF', size: '1.5', date: '2024-10-13 10:30', records: 4310, status: 'مكتمل' },
    { id: 'EXP-007', fileName: 'بيانات_القطاعات_الرياض.csv', format: 'CSV', size: '0.324', date: '2024-10-12 15:45', records: 746, status: 'مكتمل' },
    { id: 'EXP-008', fileName: 'تحليل_الجهات_الخارجية.xlsx', format: 'Excel', size: '0.987', date: '2024-10-11 12:10', records: 512, status: 'مكتمل' }
  ]);

  // بيانات التصنيف الرئيسي
  const [mainClassificationStats] = useState<MainClassificationStats[]>([
    { classificationName: 'سكني', projectsCount: 387, totalArea: 580500, totalValue: 1741500000, percentage: 37.8, avgProjectValue: 4500000, growth: 16.4, licensesCount: 431 },
    { classificationName: 'تجاري', projectsCount: 245, totalArea: 367500, totalValue: 1102500000, percentage: 24.0, avgProjectValue: 4500000, growth: 14.2, licensesCount: 273 },
    { classificationName: 'مختلط الاستخدام', projectsCount: 156, totalArea: 234000, totalValue: 702000000, percentage: 15.3, avgProjectValue: 4500000, growth: 18.7, licensesCount: 174 },
    { classificationName: 'إداري', projectsCount: 98, totalArea: 147000, totalValue: 441000000, percentage: 9.6, avgProjectValue: 4500000, growth: 12.1, licensesCount: 109 },
    { classificationName: 'صناعي', projectsCount: 67, totalArea: 100500, totalValue: 301500000, percentage: 6.5, avgProjectValue: 4500000, growth: 10.8, licensesCount: 75 },
    { classificationName: 'خدمي', projectsCount: 38, totalArea: 57000, totalValue: 171000000, percentage: 3.7, avgProjectValue: 4500000, growth: 15.3, licensesCount: 42 },
    { classificationName: 'زراعي', projectsCount: 19, totalArea: 28500, totalValue: 85500000, percentage: 1.9, avgProjectValue: 4500000, growth: 8.5, licensesCount: 21 },
    { classificationName: 'ترفيهي', projectsCount: 12, totalArea: 18000, totalValue: 54000000, percentage: 1.2, avgProjectValue: 4500000, growth: 19.2, licensesCount: 14 }
  ]);

  // بيانات التصنيف الفرعي
  const [subClassificationStats] = useState<SubClassificationStats[]>([
    { subClassificationName: 'فلل سكنية', mainClassification: 'سكني', projectsCount: 142, totalArea: 213000, totalValue: 639000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'شقق سكنية', mainClassification: 'سكني', projectsCount: 128, totalArea: 192000, totalValue: 576000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'عمائر سكنية', mainClassification: 'سكني', projectsCount: 117, totalArea: 175500, totalValue: 526500000, avgArea: 1500, avgValue: 4500000, trend: 'مستقر' },
    { subClassificationName: 'محلات تجارية', mainClassification: 'تجاري', projectsCount: 98, totalArea: 147000, totalValue: 441000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'مراكز تسوق', mainClassification: 'تجاري', projectsCount: 76, totalArea: 114000, totalValue: 342000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'مكاتب إدارية', mainClassification: 'إداري', projectsCount: 65, totalArea: 97500, totalValue: 292500000, avgArea: 1500, avgValue: 4500000, trend: 'مستقر' },
    { subClassificationName: 'أبراج مختلطة', mainClassification: 'مختلط الاستخدام', projectsCount: 87, totalArea: 130500, totalValue: 391500000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'مصانع', mainClassification: 'صناعي', projectsCount: 45, totalArea: 67500, totalValue: 202500000, avgArea: 1500, avgValue: 4500000, trend: 'مستقر' },
    { subClassificationName: 'مستودعات', mainClassification: 'صناعي', projectsCount: 22, totalArea: 33000, totalValue: 99000000, avgArea: 1500, avgValue: 4500000, trend: 'نازل' },
    { subClassificationName: 'مراكز صحية', mainClassification: 'خدمي', projectsCount: 18, totalArea: 27000, totalValue: 81000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'مدارس', mainClassification: 'خدمي', projectsCount: 12, totalArea: 18000, totalValue: 54000000, avgArea: 1500, avgValue: 4500000, trend: 'مستقر' },
    { subClassificationName: 'مزارع', mainClassification: 'زراعي', projectsCount: 14, totalArea: 21000, totalValue: 63000000, avgArea: 1500, avgValue: 4500000, trend: 'مستقر' },
    { subClassificationName: 'منتزهات', mainClassification: 'ترفيهي', projectsCount: 8, totalArea: 12000, totalValue: 36000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' },
    { subClassificationName: 'مطاعم', mainClassification: 'تجاري', projectsCount: 54, totalArea: 81000, totalValue: 243000000, avgArea: 1500, avgValue: 4500000, trend: 'صاعد' }
  ]);

  // بيانات أنواع المعاملات
  const [transactionTypeStats] = useState<TransactionTypeStats[]>([
    { transactionType: 'رخصة بناء جديد', count: 342, avgProcessingTime: 12, completedCount: 318, pendingCount: 18, rejectedCount: 6, successRate: 93.0, avgFees: 15000 },
    { transactionType: 'رخصة ترميم', count: 218, avgProcessingTime: 8, completedCount: 206, pendingCount: 9, rejectedCount: 3, successRate: 94.5, avgFees: 8000 },
    { transactionType: 'رخصة هدم', count: 156, avgProcessingTime: 6, completedCount: 149, pendingCount: 5, rejectedCount: 2, successRate: 95.5, avgFees: 5000 },
    { transactionType: 'فسح بناء', count: 298, avgProcessingTime: 4, completedCount: 287, pendingCount: 8, rejectedCount: 3, successRate: 96.3, avgFees: 3000 },
    { transactionType: 'رخصة توسعة', count: 134, avgProcessingTime: 10, completedCount: 125, pendingCount: 7, rejectedCount: 2, successRate: 93.3, avgFees: 12000 },
    { transactionType: 'شهادة إتمام بناء', count: 267, avgProcessingTime: 5, completedCount: 259, pendingCount: 6, rejectedCount: 2, successRate: 97.0, avgFees: 2000 },
    { transactionType: 'رخصة إفراغ', count: 189, avgProcessingTime: 7, completedCount: 178, pendingCount: 8, rejectedCount: 3, successRate: 94.2, avgFees: 6000 },
    { transactionType: 'رخصة تعديل', count: 167, avgProcessingTime: 9, completedCount: 156, pendingCount: 9, rejectedCount: 2, successRate: 93.4, avgFees: 10000 },
    { transactionType: 'رخصة صيانة', count: 145, avgProcessingTime: 6, completedCount: 139, pendingCount: 5, rejectedCount: 1, successRate: 95.9, avgFees: 4000 },
    { transactionType: 'رخصة سور', count: 98, avgProcessingTime: 5, completedCount: 94, pendingCount: 3, rejectedCount: 1, successRate: 95.9, avgFees: 3500 },
    { transactionType: 'رخصة حفر', count: 87, avgProcessingTime: 7, completedCount: 82, pendingCount: 4, rejectedCount: 1, successRate: 94.3, avgFees: 7000 },
    { transactionType: 'رخصة ردم', count: 76, avgProcessingTime: 5, completedCount: 73, pendingCount: 2, rejectedCount: 1, successRate: 96.1, avgFees: 4500 }
  ]);

  // بيانات الأحياء
  const [neighborhoodStats] = useState<NeighborhoodStats[]>([
    { neighborhoodName: 'حي العليا', city: 'الرياض', projectsCount: 87, totalArea: 130500, residentialCount: 54, commercialCount: 33, avgPrice: 5200, population: 45000, developmentIndex: 92 },
    { neighborhoodName: 'حي الملقا', city: 'الرياض', projectsCount: 76, totalArea: 114000, residentialCount: 48, commercialCount: 28, avgPrice: 4800, population: 38000, developmentIndex: 88 },
    { neighborhoodName: 'حي النرجس', city: 'الرياض', projectsCount: 65, totalArea: 97500, residentialCount: 42, commercialCount: 23, avgPrice: 4500, population: 32000, developmentIndex: 85 },
    { neighborhoodName: 'حي الياسمين', city: 'الرياض', projectsCount: 58, totalArea: 87000, residentialCount: 38, commercialCount: 20, avgPrice: 4300, population: 28000, developmentIndex: 82 },
    { neighborhoodName: 'حي الربوة', city: 'الرياض', projectsCount: 54, totalArea: 81000, residentialCount: 35, commercialCount: 19, avgPrice: 4600, population: 30000, developmentIndex: 84 },
    { neighborhoodName: 'حي الروضة', city: 'الرياض', projectsCount: 49, totalArea: 73500, residentialCount: 32, commercialCount: 17, avgPrice: 4400, population: 26000, developmentIndex: 81 },
    { neighborhoodName: 'حي الورود', city: 'الرياض', projectsCount: 45, totalArea: 67500, residentialCount: 29, commercialCount: 16, avgPrice: 4200, population: 24000, developmentIndex: 79 },
    { neighborhoodName: 'حي السليمانية', city: 'الرياض', projectsCount: 42, totalArea: 63000, residentialCount: 27, commercialCount: 15, avgPrice: 4700, population: 27000, developmentIndex: 83 },
    { neighborhoodName: 'حي الغدير', city: 'الرياض', projectsCount: 38, totalArea: 57000, residentialCount: 24, commercialCount: 14, avgPrice: 4100, population: 22000, developmentIndex: 77 },
    { neighborhoodName: 'حي النخيل', city: 'الرياض', projectsCount: 35, totalArea: 52500, residentialCount: 22, commercialCount: 13, avgPrice: 4000, population: 20000, developmentIndex: 75 },
    { neighborhoodName: 'حي الملك فهد', city: 'الرياض', projectsCount: 32, totalArea: 48000, residentialCount: 20, commercialCount: 12, avgPrice: 4900, population: 25000, developmentIndex: 86 },
    { neighborhoodName: 'حي الصحافة', city: 'الرياض', projectsCount: 29, totalArea: 43500, residentialCount: 18, commercialCount: 11, avgPrice: 4300, population: 21000, developmentIndex: 78 },
    { neighborhoodName: 'حي المحمدية', city: 'الرياض', projectsCount: 27, totalArea: 40500, residentialCount: 17, commercialCount: 10, avgPrice: 3900, population: 19000, developmentIndex: 74 },
    { neighborhoodName: 'حي الفلاح', city: 'الرياض', projectsCount: 25, totalArea: 37500, residentialCount: 16, commercialCount: 9, avgPrice: 3800, population: 18000, developmentIndex: 72 },
    { neighborhoodName: 'حي الازدهار', city: 'الرياض', projectsCount: 23, totalArea: 34500, residentialCount: 15, commercialCount: 8, avgPrice: 4100, population: 17000, developmentIndex: 76 }
  ]);

  // بيانات الأدوار والارتفاعات
  const [floorHeightStats] = useState<FloorHeightStats[]>([
    { category: 'دور واحد', floorRange: '1', projectsCount: 156, totalArea: 234000, avgHeight: 4.5, avgFloors: 1, totalUnits: 156, avgUnitArea: 1500 },
    { category: 'دورين', floorRange: '2', projectsCount: 189, totalArea: 283500, avgHeight: 8.0, avgFloors: 2, totalUnits: 378, avgUnitArea: 750 },
    { category: '3-5 أدوار', floorRange: '3-5', projectsCount: 234, totalArea: 351000, avgHeight: 16.0, avgFloors: 4, totalUnits: 936, avgUnitArea: 375 },
    { category: '6-10 أدوار', floorRange: '6-10', projectsCount: 178, totalArea: 267000, avgHeight: 28.0, avgFloors: 8, totalUnits: 1424, avgUnitArea: 188 },
    { category: '11-15 دور', floorRange: '11-15', projectsCount: 98, totalArea: 147000, avgHeight: 43.0, avgFloors: 13, totalUnits: 1274, avgUnitArea: 115 },
    { category: '16-20 دور', floorRange: '16-20', projectsCount: 67, totalArea: 100500, avgHeight: 63.0, avgFloors: 18, totalUnits: 1206, avgUnitArea: 83 },
    { category: '21-30 دور', floorRange: '21-30', projectsCount: 45, totalArea: 67500, avgHeight: 88.0, avgFloors: 25, totalUnits: 1125, avgUnitArea: 60 },
    { category: 'أكثر من 30 دور', floorRange: '30+', projectsCount: 23, totalArea: 34500, avgHeight: 120.0, avgFloors: 35, totalUnits: 805, avgUnitArea: 43 }
  ]);

  // بيانات التحليل الزمني
  const [timeAnalysisStats] = useState<TimeAnalysisStats[]>([
    { period: 'يناير 2024', year: 2024, month: 'يناير', projectsCount: 87, totalValue: 391500000, avgValue: 4500000, growth: 12.5, licensesIssued: 97 },
    { period: 'فبراير 2024', year: 2024, month: 'فبراير', projectsCount: 82, totalValue: 369000000, avgValue: 4500000, growth: 11.8, licensesIssued: 91 },
    { period: 'مارس 2024', year: 2024, month: 'مارس', projectsCount: 95, totalValue: 427500000, avgValue: 4500000, growth: 14.2, licensesIssued: 106 },
    { period: 'أبريل 2024', year: 2024, month: 'أبريل', projectsCount: 89, totalValue: 400500000, avgValue: 4500000, growth: 13.1, licensesIssued: 99 },
    { period: 'مايو 2024', year: 2024, month: 'مايو', projectsCount: 93, totalValue: 418500000, avgValue: 4500000, growth: 13.8, licensesIssued: 104 },
    { period: 'يونيو 2024', year: 2024, month: 'يونيو', projectsCount: 78, totalValue: 351000000, avgValue: 4500000, growth: 10.5, licensesIssued: 87 },
    { period: 'يوليو 2024', year: 2024, month: 'يوليو', projectsCount: 91, totalValue: 409500000, avgValue: 4500000, growth: 13.4, licensesIssued: 101 },
    { period: 'أغسطس 2024', year: 2024, month: 'أغسطس', projectsCount: 85, totalValue: 382500000, avgValue: 4500000, growth: 12.2, licensesIssued: 95 },
    { period: 'سبتمبر 2024', year: 2024, month: 'سبتمبر', projectsCount: 88, totalValue: 396000000, avgValue: 4500000, growth: 12.9, licensesIssued: 98 },
    { period: 'أكتوبر 2024', year: 2024, month: 'أكتوبر', projectsCount: 96, totalValue: 432000000, avgValue: 4500000, growth: 14.5, licensesIssued: 107 },
    { period: 'الربع الأول 2024', year: 2024, quarter: 'Q1', projectsCount: 264, totalValue: 1188000000, avgValue: 4500000, growth: 12.8, licensesIssued: 294 },
    { period: 'الربع الثاني 2024', year: 2024, quarter: 'Q2', projectsCount: 260, totalValue: 1170000000, avgValue: 4500000, growth: 12.5, licensesIssued: 290 },
    { period: 'الربع الثالث 2024', year: 2024, quarter: 'Q3', projectsCount: 264, totalValue: 1188000000, avgValue: 4500000, growth: 12.8, licensesIssued: 294 },
    { period: 'الربع الرابع 2024', year: 2024, quarter: 'Q4', projectsCount: 234, totalValue: 1053000000, avgValue: 4500000, growth: 11.2, licensesIssued: 261 }
  ]);

  // بيانات حسب الاستخدام
  const [usageStats] = useState<UsageStats[]>([
    { usageType: 'سكني بحت', projectsCount: 298, totalArea: 447000, percentage: 29.2, avgProjectArea: 1500, totalValue: 1341000000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'تجاري بحت', projectsCount: 187, totalArea: 280500, percentage: 18.3, avgProjectArea: 1500, totalValue: 841500000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'سكني تجاري', projectsCount: 145, totalArea: 217500, percentage: 14.2, avgProjectArea: 1500, totalValue: 652500000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'إداري', projectsCount: 112, totalArea: 168000, percentage: 11.0, avgProjectArea: 1500, totalValue: 504000000, avgValue: 4500000, trend: 'مستقر' },
    { usageType: 'صناعي', projectsCount: 89, totalArea: 133500, percentage: 8.7, avgProjectArea: 1500, totalValue: 400500000, avgValue: 4500000, trend: 'مستقر' },
    { usageType: 'خدمي', projectsCount: 76, totalArea: 114000, percentage: 7.4, avgProjectArea: 1500, totalValue: 342000000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'تعليمي', projectsCount: 54, totalArea: 81000, percentage: 5.3, avgProjectArea: 1500, totalValue: 243000000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'صحي', projectsCount: 38, totalArea: 57000, percentage: 3.7, avgProjectArea: 1500, totalValue: 171000000, avgValue: 4500000, trend: 'صاعد' },
    { usageType: 'ترفيهي', projectsCount: 23, totalArea: 34500, percentage: 2.2, avgProjectArea: 1500, totalValue: 103500000, avgValue: 4500000, trend: 'مستقر' }
  ]);

  const tabs = [
    { id: '951-01', label: 'لوحة المعلومات', icon: LayoutGrid, color: 'bg-blue-500' },
    { id: '951-02', label: 'حسب النوع', icon: Building2, color: 'bg-green-500' },
    { id: '951-03', label: 'حسب المساحات', icon: Ruler, color: 'bg-purple-500' },
    { id: '951-04', label: 'الرخص والتصاريح', icon: FileText, color: 'bg-orange-500' },
    { id: '951-05', label: 'حسب المدن', icon: MapPin, color: 'bg-cyan-500' },
    { id: '951-06', label: 'حسب الأحياء', icon: Map, color: 'bg-pink-500' },
    { id: '951-07', label: 'الأدوار والارتفاعات', icon: Layers, color: 'bg-red-500' },
    { id: '951-08', label: 'التحليل الزمني', icon: Calendar, color: 'bg-indigo-500' },
    { id: '951-09', label: 'حسب الاستخدام', icon: Target, color: 'bg-yellow-500' },
    { id: '951-10', label: 'المقارنات', icon: TrendingUp, color: 'bg-teal-500' },
    { id: '951-11', label: 'تقارير مخصصة', icon: BarChart3, color: 'bg-violet-500' },
    { id: '951-12', label: 'التصدير', icon: Download, color: 'bg-gray-500' },
    { id: '951-13', label: 'حسب العميل', icon: UserCircle, color: 'bg-blue-600' },
    { id: '951-14', label: 'حسب الجهات الخارجية', icon: Network, color: 'bg-green-600' },
    { id: '951-15', label: 'حسب قطاعات الرياض', icon: MapPinIcon, color: 'bg-purple-600' },
    { id: '951-16', label: 'حسب التصنيف الرئيسي', icon: LayoutGrid, color: 'bg-orange-600' },
    { id: '951-17', label: 'حسب التصنيف الفرعي', icon: Layers, color: 'bg-cyan-600' },
    { id: '951-18', label: 'حسب نوع المعاملة', icon: FileText, color: 'bg-pink-600' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case '951-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>لوحة معلومات إحصائيات الأعمال</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="input-field select-trigger h-8 w-36 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">آخر شهر</SelectItem>
                      <SelectItem value="3months">آخر 3 أشهر</SelectItem>
                      <SelectItem value="6months">آخر 6 أشهر</SelectItem>
                      <SelectItem value="12months">آخر 12 شهر</SelectItem>
                      <SelectItem value="all">كل الفترات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
              </div>
            </div>

            {/* الإحصائيات الرئيسية */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'إجمالي المشاريع', value: '1,022', icon: Building2, color: 'blue', change: '+12.5%' },
                { label: 'المساحة الكلية', value: '1.54M م²', icon: Ruler, color: 'green', change: '+8.3%' },
                { label: 'القيمة الإجمالية', value: '4.62B ريال', icon: DollarSign, color: 'purple', change: '+15.7%' },
                { label: 'الرخص الصادرة', value: '1,139', icon: FileText, color: 'orange', change: '+9.2%' },
                { label: 'متوسط المساحة', value: '1,506 م²', icon: LayoutGrid, color: 'cyan', change: '+3.1%' },
                { label: 'متوسط القيمة', value: '4.52M ريال', icon: Award, color: 'pink', change: '+6.4%' }
              ].map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4" style={{ borderTopColor: `var(--${stat.color}-500)` }}>
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {React.createElement(stat.icon, { className: `h-4 w-4 text-${stat.color}-500 flex-shrink-0` })}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.label}</p>
                    </div>
                    <p className="text-lg mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.value}</p>
                    <Badge className={`bg-green-100 text-green-800 text-xs px-1 py-0 flex items-center gap-1 w-fit`}>
                      <ArrowUp className="h-3 w-3" />
                      {stat.change}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رسم بياني توزيع المشاريع */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <PieChart className="h-4 w-4" />
                    توزيع المشاريع حسب النوع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1.5">
                    {projectTypeStats.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${
                          i === 0 ? 'bg-blue-500' :
                          i === 1 ? 'bg-green-500' :
                          i === 2 ? 'bg-purple-500' :
                          i === 3 ? 'bg-orange-500' : 'bg-cyan-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</span>
                            <span className="text-xs text-gray-600">{item.count}</span>
                          </div>
                          <Progress value={item.percentage} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-600 w-12 text-left">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <MapPin className="h-4 w-4" />
                    أكثر 5 مدن نشاطاً
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-1.5">
                    {cityStats.map((city, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{city.city}</span>
                            <span className="text-xs text-gray-600">{city.projectsCount} مشروع</span>
                          </div>
                          <Progress value={(city.projectsCount / cityStats[0].projectsCount) * 100} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-600">{(city.totalArea / 1000).toFixed(0)}K م²</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الاتجاهات الشهرية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <LineChart className="h-4 w-4" />
                  الاتجاهات الشهرية - آخر 12 شهر
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64">
                  <div className="p-2">
                    <div className="grid grid-cols-12 gap-1">
                      {monthlyStats.map((month, i) => {
                        const maxProjects = Math.max(...monthlyStats.map(m => m.projects));
                        const height = (month.projects / maxProjects) * 180;
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className="flex-1 flex items-end justify-center w-full">
                              <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                                style={{ height: `${height}px` }}
                                title={`${month.month}: ${month.projects} مشروع`}
                              />
                            </div>
                            <span className="text-xs text-gray-600 transform -rotate-45 origin-top-right whitespace-nowrap" style={{ fontSize: '9px' }}>
                              {month.month.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* أبرز الإحصائيات */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-0">الأعلى</Badge>
                  </div>
                  <p className="text-xs text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى عدد أدوار</p>
                  <p className="text-2xl text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>20 دور</p>
                  <p className="text-xs text-gray-600 mt-1">برج تجاري - جدة</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl bg-gradient-to-br from-green-50 to-green-100 border-green-300">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Home className="h-8 w-8 text-green-600" />
                    <Badge className="bg-green-600 text-white text-xs px-2 py-0">الأكثر</Badge>
                  </div>
                  <p className="text-xs text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>أكثر نوع مشاريع</p>
                  <p className="text-2xl text-green-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>342</p>
                  <p className="text-xs text-gray-600 mt-1">فلل سكنية</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Ruler className="h-8 w-8 text-purple-600" />
                    <Badge className="bg-purple-600 text-white text-xs px-2 py-0">الأكبر</Badge>
                  </div>
                  <p className="text-xs text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>أكبر مساحة مشروع</p>
                  <p className="text-2xl text-purple-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>8,500 م²</p>
                  <p className="text-xs text-gray-600 mt-1">مجمع تجاري - الرياض</p>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <Badge className="bg-orange-600 text-white text-xs px-2 py-0">نمو</Badge>
                  </div>
                  <p className="text-xs text-gray-700 mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النمو السنوي</p>
                  <p className="text-2xl text-orange-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>+18.4%</p>
                  <p className="text-xs text-gray-600 mt-1">مقارنة بالعام السابق</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '951-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب نوع المشروع</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-7 gap-2">
              {projectTypeStats.map((stat, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      {i === 0 ? <Home className="h-3.5 w-3.5 text-blue-500" /> :
                       i === 1 ? <Building className="h-3.5 w-3.5 text-green-500" /> :
                       i === 2 ? <ShoppingBag className="h-3.5 w-3.5 text-purple-500" /> :
                       i === 3 ? <Building2 className="h-3.5 w-3.5 text-orange-500" /> :
                       i === 4 ? <Landmark className="h-3.5 w-3.5 text-cyan-500" /> :
                       i === 5 ? <Factory className="h-3.5 w-3.5 text-red-500" /> :
                       <TreePine className="h-3.5 w-3.5 text-green-600" />}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.type}</p>
                    </div>
                    <p className="text-base mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.count}</p>
                    <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0">{stat.percentage}%</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>العدد</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط المساحة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectTypeStats.map((stat, i) => (
                      <TableRow key={i} className="hover:bg-green-50 transition-colors">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            {i === 0 ? <Home className="h-4 w-4 text-blue-500" /> :
                             i === 1 ? <Building className="h-4 w-4 text-green-500" /> :
                             i === 2 ? <ShoppingBag className="h-4 w-4 text-purple-500" /> :
                             i === 3 ? <Building2 className="h-4 w-4 text-orange-500" /> :
                             i === 4 ? <Landmark className="h-4 w-4 text-cyan-500" /> :
                             i === 5 ? <Factory className="h-4 w-4 text-red-500" /> :
                             <TreePine className="h-4 w-4 text-green-600" />}
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{stat.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{stat.count}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{stat.totalArea.toLocaleString('ar-SA')} م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{stat.avgArea.toLocaleString('ar-SA')} م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(stat.totalValue / 1000000).toFixed(1)}M ريال</TableCell>
                        <TableCell className="text-right py-2 text-xs">{((stat.totalValue / stat.count) / 1000000).toFixed(2)}M ريال</TableCell>
                        <TableCell className="text-right py-2 text-xs">{stat.percentage}%</TableCell>
                        <TableCell className="text-right py-2">
                          <Progress value={stat.percentage * 2.6} className="h-2" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '951-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب الأحياء</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select>
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="فلترة حسب المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل المدن</SelectItem>
                      <SelectItem value="riyadh">الرياض</SelectItem>
                      <SelectItem value="jeddah">جدة</SelectItem>
                      <SelectItem value="dammam">الدمام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Map className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد الأحياء</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{neighborhoodStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">حي</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {neighborhoodStats.reduce((sum, n) => sum + n.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي السكان</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(neighborhoodStats.reduce((sum, n) => sum + n.population, 0) / 1000).toFixed(0)}K
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">نسمة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط السعر</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(neighborhoodStats.reduce((sum, n) => sum + n.avgPrice, 0) / neighborhoodStats.length).toFixed(0)}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">ريال/م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط التطوير</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(neighborhoodStats.reduce((sum, n) => sum + n.developmentIndex, 0) / neighborhoodStats.length).toFixed(0)}
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">مؤشر</Badge>
                </CardContent>
              </Card>
            </div>

            {/* بطاقات الأحياء */}
            <div className="grid grid-cols-5 gap-2">
              {neighborhoodStats.map((neighborhood, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${
                        neighborhood.developmentIndex > 85 ? 'from-green-500 to-green-600' :
                        neighborhood.developmentIndex > 80 ? 'from-blue-500 to-blue-600' :
                        neighborhood.developmentIndex > 75 ? 'from-purple-500 to-purple-600' :
                        'from-orange-500 to-orange-600'
                      } rounded-lg flex items-center justify-center`}>
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{neighborhood.neighborhoodName}</p>
                        <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0 mt-0.5">{neighborhood.city}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">المشاريع</p>
                        <p className="font-medium">{neighborhood.projectsCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">السكان</p>
                        <p className="font-medium">{(neighborhood.population / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-600">السعر</p>
                        <p className="font-medium">{neighborhood.avgPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">التطوير</p>
                        <p className={`font-medium ${
                          neighborhood.developmentIndex > 85 ? 'text-green-600' :
                          neighborhood.developmentIndex > 80 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>{neighborhood.developmentIndex}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Map className="h-4 w-4" />
                  قائمة الأحياء التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>سكني</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجاري</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>السعر</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>السكان</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>مؤشر التطوير</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {neighborhoodStats.map((neighborhood, i) => (
                        <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{neighborhood.neighborhoodName}</span>
                              <MapPin className="h-4 w-4 text-blue-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-2 py-0">{neighborhood.city}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{neighborhood.projectsCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{(neighborhood.totalArea / 1000).toFixed(0)}K م²</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{neighborhood.residentialCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{neighborhood.commercialCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{neighborhood.avgPrice} ريال/م²</TableCell>
                          <TableCell className="text-right py-2 text-xs">{(neighborhood.population / 1000).toFixed(0)}K</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <Progress value={neighborhood.developmentIndex} className="h-2 w-16" />
                              <Badge className={`text-xs px-2 py-0 ${
                                neighborhood.developmentIndex > 85 ? 'bg-green-100 text-green-800' :
                                neighborhood.developmentIndex > 80 ? 'bg-blue-100 text-blue-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {neighborhood.developmentIndex}
                              </Badge>
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

      case '951-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات الأدوار والارتفاعات</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />تصفية</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-8 gap-2">
              {floorHeightStats.map((floor, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{floor.category}</p>
                    </div>
                    <p className="text-base mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{floor.projectsCount}</p>
                    <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0">{floor.avgHeight}م</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رسم بياني الارتفاعات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Building2 className="h-4 w-4" />
                  توزيع المشاريع حسب عدد الأدوار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-64 flex items-end justify-around gap-2">
                  {floorHeightStats.map((floor, i) => {
                    const maxProjects = Math.max(...floorHeightStats.map(f => f.projectsCount));
                    const height = (floor.projectsCount / maxProjects) * 220;
                    const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'indigo', 'red'];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {floor.avgHeight}م
                          </Badge>
                          <span className="text-xs mb-1">{floor.projectsCount}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer bg-gradient-to-t from-${colors[i]}-600 to-${colors[i]}-400 hover:from-${colors[i]}-700 hover:to-${colors[i]}-500`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 truncate" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                          {floor.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات تفصيلية */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {floorHeightStats.reduce((sum, f) => sum + f.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الوحدات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {floorHeightStats.reduce((sum, f) => sum + f.totalUnits, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">وحدة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الارتفاع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(floorHeightStats.reduce((sum, f) => sum + f.avgHeight, 0) / floorHeightStats.length).toFixed(1)}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">متر</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الأدوار</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(floorHeightStats.reduce((sum, f) => sum + f.avgFloors, 0) / floorHeightStats.length).toFixed(1)}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">دور</Badge>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Layers className="h-4 w-4" />
                  جدول الأدوار والارتفاعات التفصيلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>نطاق الأدوار</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المشاريع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الارتفاع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الأدوار</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الوحدات</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط مساحة الوحدة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {floorHeightStats.map((floor, i) => (
                      <TableRow key={i} className="hover:bg-purple-50 transition-colors cursor-pointer">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{floor.category}</span>
                            <Layers className="h-4 w-4 text-blue-500" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge variant="outline" className="text-xs px-2 py-0">{floor.floorRange}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{floor.projectsCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{(floor.totalArea / 1000).toFixed(0)}K م²</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{floor.avgHeight} متر</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{floor.avgFloors} دور</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-0">{floor.totalUnits.toLocaleString('ar-SA')}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{floor.avgUnitArea} م²</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* بطاقات مقارنة */}
            <div className="grid grid-cols-4 gap-2">
              {floorHeightStats.slice(0, 4).map((floor, i) => {
                const colors = ['blue', 'green', 'purple', 'orange'];
                return (
                  <Card key={i} className={`card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-${colors[i]}-500`}>
                    <CardContent className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-br from-${colors[i]}-500 to-${colors[i]}-600 rounded-lg flex items-center justify-center`}>
                          <Layers className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{floor.category}</p>
                          <Badge className={`text-xs px-1 py-0 mt-0.5 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {floor.floorRange} دور
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">المشاريع</p>
                          <p className="font-medium">{floor.projectsCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">الارتفاع</p>
                          <p className="font-medium">{floor.avgHeight}م</p>
                        </div>
                        <div>
                          <p className="text-gray-600">الوحدات</p>
                          <p className="font-medium">{floor.totalUnits}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">م² للوحدة</p>
                          <p className="font-medium">{floor.avgUnitArea}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '951-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التحليل الزمني للإحصائيات</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select>
                    <SelectTrigger className="input-field select-trigger h-8 w-32 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر الفترة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="quarterly">ربع سنوي</SelectItem>
                      <SelectItem value="yearly">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{timeAnalysisStats.filter(t => t.month).length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">شهر</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {timeAnalysisStats.filter(t => t.month).reduce((sum, t) => sum + t.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(timeAnalysisStats.filter(t => t.month).reduce((sum, t) => sum + t.totalValue, 0) / 1000000000).toFixed(1)}B
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى نمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {Math.max(...timeAnalysisStats.map(t => t.growth)).toFixed(1)}%
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">أكتوبر</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {timeAnalysisStats.filter(t => t.month).reduce((sum, t) => sum + t.licensesIssued, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">رخصة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="h-4 w-4 text-pink-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(timeAnalysisStats.reduce((sum, t) => sum + t.growth, 0) / timeAnalysisStats.length).toFixed(1)}%
                  </p>
                  <Badge className="bg-pink-100 text-pink-800 text-xs px-1 py-0 mt-1">شهري</Badge>
                </CardContent>
              </Card>
            </div>

            {/* رسم بياني الاتجاهات الشهرية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <LineChart className="h-4 w-4" />
                  اتجاه المشاريع خلال العام 2024
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-56 flex items-end justify-around gap-1">
                  {timeAnalysisStats.filter(t => t.month).map((time, i) => {
                    const maxProjects = Math.max(...timeAnalysisStats.filter(t => t.month).map(t => t.projectsCount));
                    const height = (time.projectsCount / maxProjects) * 190;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 ${
                            time.growth > 13 ? 'bg-green-100 text-green-800' :
                            time.growth > 12 ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            +{time.growth}%
                          </Badge>
                          <span className="text-xs mb-1">{time.projectsCount}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer ${
                              i % 3 === 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500' :
                              i % 3 === 1 ? 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-700 hover:to-green-500' :
                              'bg-gradient-to-t from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500'
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 truncate" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                          {time.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* جدول تحليل شهري */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Calendar className="h-4 w-4" />
                  التحليل الشهري التفصيلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النمو</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeAnalysisStats.map((time, i) => (
                        <TableRow key={i} className="hover:bg-green-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{time.period}</span>
                              {time.month ? <Calendar className="h-4 w-4 text-blue-500" /> : <Activity className="h-4 w-4 text-purple-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-2 py-0">{time.year}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{time.projectsCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{(time.totalValue / 1000000).toFixed(0)}M ريال</TableCell>
                          <TableCell className="text-right py-2 text-xs">{(time.avgValue / 1000000).toFixed(1)}M ريال</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                              time.growth > 13 ? 'bg-green-100 text-green-800' :
                              time.growth > 12 ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              <ArrowUp className="h-3 w-3" />
                              {time.growth}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{time.licensesIssued}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* التحليل الربع سنوي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  المقارنة الربع سنوية 2024
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-4 gap-2">
                  {timeAnalysisStats.filter(t => t.quarter).map((quarter, i) => {
                    const colors = ['blue', 'green', 'purple', 'orange'];
                    return (
                      <Card key={i} className={`card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-${colors[i]}-500`}>
                        <CardContent className="p-2">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 bg-gradient-to-br from-${colors[i]}-500 to-${colors[i]}-600 rounded-lg flex items-center justify-center`}>
                              <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{quarter.quarter}</p>
                              <Badge className={`text-xs px-1 py-0 mt-0.5 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                                +{quarter.growth}%
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">المشاريع</p>
                              <p className="font-medium">{quarter.projectsCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">القيمة</p>
                              <p className="font-medium">{(quarter.totalValue / 1000000000).toFixed(2)}B</p>
                            </div>
                            <div>
                              <p className="text-gray-600">التراخيص</p>
                              <p className="font-medium">{quarter.licensesIssued}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">المتوسط</p>
                              <p className="font-medium">{(quarter.avgValue / 1000000).toFixed(1)}M</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '951-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب الاستخدام</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />تصفية</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-9 gap-2">
              {usageStats.map((usage, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{usage.usageType}</p>
                    </div>
                    <p className="text-base mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{usage.projectsCount}</p>
                    <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0">{usage.percentage}%</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رسم بياني التوزيع */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <PieChart className="h-4 w-4" />
                  توزيع المشاريع حسب نوع الاستخدام
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-64 flex items-end justify-around gap-2">
                  {usageStats.map((usage, i) => {
                    const maxProjects = Math.max(...usageStats.map(u => u.projectsCount));
                    const height = (usage.projectsCount / maxProjects) * 220;
                    const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'indigo', 'red', 'yellow'];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {usage.percentage}%
                          </Badge>
                          <span className="text-xs mb-1">{usage.projectsCount}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer bg-gradient-to-t from-${colors[i]}-600 to-${colors[i]}-400 hover:from-${colors[i]}-700 hover:to-${colors[i]}-500`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 truncate" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                          {usage.usageType.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات تفصيلية */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {usageStats.reduce((sum, u) => sum + u.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(usageStats.reduce((sum, u) => sum + u.totalArea, 0) / 1000000).toFixed(2)}M
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(usageStats.reduce((sum, u) => sum + u.totalValue, 0) / 1000000000).toFixed(2)}B
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Target className="h-4 w-4" />
                  جدول الاستخدامات التفصيلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع الاستخدام</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المشاريع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط المساحة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageStats.map((usage, i) => (
                      <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{usage.usageType}</span>
                            <Target className="h-4 w-4 text-blue-500" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{usage.projectsCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{(usage.totalArea / 1000).toFixed(0)}K م²</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={usage.percentage * 3.5} className="h-2 w-16" />
                            <span className="text-xs">{usage.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{usage.avgProjectArea.toLocaleString('ar-SA')} م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(usage.totalValue / 1000000).toFixed(0)}M ريال</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(usage.avgValue / 1000000).toFixed(1)}M ريال</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                            usage.trend === 'صاعد' ? 'bg-green-100 text-green-800' :
                            usage.trend === 'مستقر' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {usage.trend === 'صاعد' ? <ArrowUp className="h-3 w-3" /> :
                             usage.trend === 'مستقر' ? <Activity className="h-3 w-3" /> :
                             <ArrowDown className="h-3 w-3" />}
                            {usage.trend}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* بطاقات مفصلة */}
            <div className="grid grid-cols-3 gap-2">
              {usageStats.slice(0, 6).map((usage, i) => {
                const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink'];
                const Icon = i === 0 ? Home : i === 1 ? ShoppingBag : i === 2 ? Building2 : 
                            i === 3 ? Landmark : i === 4 ? Factory : Building;
                return (
                  <Card key={i} className={`card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-${colors[i]}-500`}>
                    <CardContent className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-br from-${colors[i]}-500 to-${colors[i]}-600 rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{usage.usageType}</p>
                          <Badge className={`text-xs px-1 py-0 mt-0.5 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {usage.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">المشاريع</p>
                          <p className="font-medium">{usage.projectsCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">الاتجاه</p>
                          <p className={`font-medium ${
                            usage.trend === 'صاعد' ? 'text-green-600' :
                            usage.trend === 'مستقر' ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>{usage.trend}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">المساحة</p>
                          <p className="font-medium">{(usage.totalArea / 1000).toFixed(0)}K م²</p>
                        </div>
                        <div>
                          <p className="text-gray-600">القيمة</p>
                          <p className="font-medium">{(usage.totalValue / 1000000).toFixed(0)}M</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '951-13':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب العميل</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Search className="h-3 w-3 ml-1" />بحث متقدم</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي العملاء</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clientStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">نشط</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مجموع المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{clientStats.reduce((sum, c) => sum + c.projectsCount, 0)}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">
                    <ArrowUp className="h-3 w-3" />
                    +12.3%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(clientStats.reduce((sum, c) => sum + c.totalValue, 0) / 1000000000).toFixed(2)}B
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(clientStats.reduce((sum, c) => sum + c.totalArea, 0) / 1000).toFixed(0)}K
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتملة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {clientStats.reduce((sum, c) => sum + c.completedProjects, 0)}
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>
            </div>

            {/* أفضل 5 عملاء */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Star className="h-4 w-4 text-yellow-500" />
                  أفضل 5 عملاء
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-5 gap-2">
                  {clientStats.slice(0, 5).map((client, i) => (
                    <Card key={i} className="card-element card-rtl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">{i + 1}</span>
                          </div>
                          <Badge className={`text-xs px-1 py-0 ${
                            client.clientType === 'شركة' ? 'bg-blue-100 text-blue-800' :
                            client.clientType === 'مؤسسة' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {client.clientType}
                          </Badge>
                        </div>
                        <p className="text-xs mb-2 line-clamp-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client.clientName}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">المشاريع:</span>
                            <span className="font-medium">{client.projectsCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">القيمة:</span>
                            <span className="font-medium">{(client.totalValue / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* جدول تفصيلي للعملاء */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Users className="h-4 w-4" />
                  قائمة العملاء التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم العميل</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتملة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجارية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientStats.map((client, i) => (
                        <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2 text-xs">{i + 1}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client.clientName}</span>
                              <UserCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-2 py-0 ${
                              client.clientType === 'شركة' ? 'bg-blue-100 text-blue-800' :
                              client.clientType === 'مؤسسة' ? 'bg-green-100 text-green-800' :
                              client.clientType === 'مجموعة' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {client.clientType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0">{client.projectsCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{client.totalArea.toLocaleString('ar-SA')} م²</TableCell>
                          <TableCell className="text-right py-2 text-xs">{(client.totalValue / 1000000).toFixed(1)}M ريال</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{client.completedProjects}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0">{client.ongoingProjects}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{(client.avgProjectValue / 1000000).toFixed(2)}M ريال</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '951-14':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب الجهات الخارجية</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="input-field select-trigger h-8 w-36 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل المدن</SelectItem>
                      <SelectItem value="riyadh">الرياض</SelectItem>
                      <SelectItem value="jeddah">جدة</SelectItem>
                      <SelectItem value="dammam">الدمام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Network className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي الجهات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{externalEntityStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">جهة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاعلات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {externalEntityStats.reduce((sum, e) => sum + e.interactionsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">معاملة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع المرتبطة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {externalEntityStats.reduce((sum, e) => sum + e.projectsInvolved, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(externalEntityStats.reduce((sum, e) => sum + e.totalValue, 0) / 1000000000).toFixed(2)}B
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>حكومية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {externalEntityStats.filter(e => e.entityType === 'حكومي').length}
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">جهة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4 text-pink-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>خاصة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {externalEntityStats.filter(e => e.entityType === 'خاص').length}
                  </p>
                  <Badge className="bg-pink-100 text-pink-800 text-xs px-1 py-0 mt-1">جهة</Badge>
                </CardContent>
              </Card>
            </div>

            {/* توزيع الجهات حسب الفئة */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <PieChart className="h-4 w-4" />
                    التوزيع حسب النوع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {['حكومي', 'خاص', 'مهني'].map((type, i) => {
                      const count = externalEntityStats.filter(e => e.entityType === type).length;
                      const percentage = (count / externalEntityStats.length) * 100;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${
                            i === 0 ? 'bg-blue-500' :
                            i === 1 ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type}</span>
                              <span className="text-xs text-gray-600">{count} جهة</span>
                            </div>
                            <Progress value={percentage} className="h-1.5" />
                          </div>
                          <span className="text-xs text-gray-600 w-12 text-left">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Target className="h-4 w-4" />
                    التوزيع حسب الفئة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {Array.from(new Set(externalEntityStats.map(e => e.category))).slice(0, 5).map((category, i) => {
                      const count = externalEntityStats.filter(e => e.category === category).length;
                      const percentage = (count / externalEntityStats.length) * 100;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${
                            i === 0 ? 'bg-orange-500' :
                            i === 1 ? 'bg-cyan-500' :
                            i === 2 ? 'bg-pink-500' :
                            i === 3 ? 'bg-yellow-500' : 'bg-indigo-500'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</span>
                              <span className="text-xs text-gray-600">{count}</span>
                            </div>
                            <Progress value={percentage} className="h-1.5" />
                          </div>
                          <span className="text-xs text-gray-600 w-12 text-left">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفصيلي للجهات الخارجية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Network className="h-4 w-4" />
                  قائمة الجهات الخارجية التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الجهة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التفاعلات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدينة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {externalEntityStats.map((entity, i) => (
                        <TableRow key={i} className="hover:bg-green-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2 text-xs">{i + 1}</TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.entityName}</span>
                              <Network className="h-4 w-4 text-green-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-2 py-0 ${
                              entity.entityType === 'حكومي' ? 'bg-blue-100 text-blue-800' :
                              entity.entityType === 'خاص' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {entity.entityType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0">{entity.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-0">{entity.interactionsCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-cyan-100 text-cyan-800 text-xs px-2 py-0">{entity.projectsInvolved}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{(entity.totalValue / 1000000).toFixed(1)}M ريال</TableCell>
                          <TableCell className="text-right py-2 text-xs">{entity.city}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '951-15':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب قطاعات الرياض</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />تصفية</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPinIcon className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي القطاعات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{riyadhSectorStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">قطاع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>مجموع المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {riyadhSectorStats.reduce((sum, s) => sum + s.projectsCount, 0)}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(riyadhSectorStats.reduce((sum, s) => sum + s.totalArea, 0) / 1000).toFixed(0)}K
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط السعر</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(riyadhSectorStats.reduce((sum, s) => sum + s.avgPrice, 0) / riyadhSectorStats.length).toFixed(0)}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">ريال/م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    +{(riyadhSectorStats.reduce((sum, s) => sum + s.growth, 0) / riyadhSectorStats.length).toFixed(1)}%
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">سنوي</Badge>
                </CardContent>
              </Card>
            </div>

            {/* خريطة القطاعات */}
            <div className="grid grid-cols-5 gap-2">
              {riyadhSectorStats.map((sector, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.sectorName}</p>
                        <Badge className={`text-xs px-1 py-0 mt-0.5 ${
                          sector.growth > 15 ? 'bg-green-100 text-green-800' :
                          sector.growth > 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          <ArrowUp className="h-3 w-3 ml-0.5" />
                          {sector.growth}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-600">المشاريع</p>
                        <p className="font-medium">{sector.projectsCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">المساحة</p>
                        <p className="font-medium">{(sector.totalArea / 1000).toFixed(0)}K م²</p>
                      </div>
                      <div>
                        <p className="text-gray-600">سكني</p>
                        <p className="font-medium">{sector.residentialCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">تجاري</p>
                        <p className="font-medium">{sector.commercialCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Map className="h-4 w-4" />
                  قائمة قطاعات الرياض التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>سكني</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجاري</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>مختلط</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط السعر</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النمو</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riyadhSectorStats.map((sector, i) => (
                      <TableRow key={i} className="hover:bg-purple-50 transition-colors cursor-pointer">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.sectorName}</span>
                            <MapPinIcon className="h-4 w-4 text-purple-500" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{sector.projectsCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{sector.totalArea.toLocaleString('ar-SA')} م²</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{sector.residentialCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{sector.commercialCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-0">{sector.mixedUseCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{sector.avgPrice.toLocaleString('ar-SA')} ريال/م²</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                            sector.growth > 15 ? 'bg-green-100 text-green-800' :
                            sector.growth > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <ArrowUp className="h-3 w-3" />
                            +{sector.growth}%
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

      case '951-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقارنات الإحصائية</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select value={comparisonType} onValueChange={setComparisonType}>
                    <SelectTrigger className="input-field select-trigger h-8 w-40 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">مقارنة السنوات</SelectItem>
                      <SelectItem value="cities">مقارنة المدن</SelectItem>
                      <SelectItem value="types">مقارنة الأنواع</SelectItem>
                      <SelectItem value="quarters">مقارنة الأرباع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات المقارنة السريعة */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد السنوات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{yearComparisonStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">سنة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى نمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {Math.max(...yearComparisonStats.map(y => y.growthRate)).toFixed(1)}%
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">2024</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {yearComparisonStats.reduce((sum, y) => sum + y.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">5 سنوات</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المساحة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(yearComparisonStats.reduce((sum, y) => sum + y.totalArea, 0) / 1000000).toFixed(2)}M
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي القيمة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(yearComparisonStats.reduce((sum, y) => sum + y.totalValue, 0) / 1000000000).toFixed(1)}B
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-pink-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(yearComparisonStats.reduce((sum, y) => sum + y.growthRate, 0) / yearComparisonStats.length).toFixed(1)}%
                  </p>
                  <Badge className="bg-pink-100 text-pink-800 text-xs px-1 py-0 mt-1">سنوي</Badge>
                </CardContent>
              </Card>
            </div>

            {/* رسم بياني المقارنة السنوية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <LineChart className="h-4 w-4" />
                  مقارنة عدد المشاريع عبر السنوات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-48 flex items-end justify-around gap-2">
                  {yearComparisonStats.map((year, i) => {
                    const maxProjects = Math.max(...yearComparisonStats.map(y => y.projectsCount));
                    const height = (year.projectsCount / maxProjects) * 160;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 ${
                            year.growthRate > 15 ? 'bg-green-100 text-green-800' :
                            year.growthRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <ArrowUp className="h-3 w-3" />
                            {year.growthRate}%
                          </Badge>
                          <span className="text-xs mb-1">{year.projectsCount}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer ${
                              i === 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500' :
                              i === 1 ? 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-700 hover:to-green-500' :
                              i === 2 ? 'bg-gradient-to-t from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500' :
                              i === 3 ? 'bg-gradient-to-t from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500' :
                              'bg-gradient-to-t from-cyan-600 to-cyan-400 hover:from-cyan-700 hover:to-cyan-500'
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>{year.year}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* جدول المقارنة التفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  جدول المقارنة التفصيلي للسنوات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المشاريع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط قيمة المشروع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النمو</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المقارنة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearComparisonStats.map((year, i) => (
                      <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-2 py-0 ${
                            i === 0 ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {year.year}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{year.projectsCount.toLocaleString('ar-SA')}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{(year.totalArea / 1000).toFixed(0)}K م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(year.totalValue / 1000000000).toFixed(2)}B ريال</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(year.avgProjectValue / 1000000).toFixed(1)}M ريال</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                            year.growthRate > 15 ? 'bg-green-100 text-green-800' :
                            year.growthRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <ArrowUp className="h-3 w-3" />
                            {year.growthRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{year.licensesCount.toLocaleString('ar-SA')}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <div className="w-full">
                            <Progress value={(year.projectsCount / yearComparisonStats[0].projectsCount) * 100} className="h-2" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* مقارنة المدن */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <MapPin className="h-4 w-4" />
                    مقارنة أداء المدن الكبرى
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {cityStats.map((city, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              i === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                              i === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                              i === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                              i === 3 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                              'bg-gradient-to-br from-cyan-500 to-cyan-600'
                            }`}>
                              <span className="text-xs text-white">{i + 1}</span>
                            </div>
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{city.city}</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{city.projectsCount} مشروع</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                          <div>
                            <p className="text-gray-600">المساحة</p>
                            <p className="font-medium">{(city.totalArea / 1000).toFixed(0)}K م²</p>
                          </div>
                          <div>
                            <p className="text-gray-600">التراخيص</p>
                            <p className="font-medium">{city.licensesCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">متوسط الأدوار</p>
                            <p className="font-medium">{city.avgFloors}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Building2 className="h-4 w-4" />
                    مقارنة أنواع المشاريع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {projectTypeStats.slice(0, 5).map((type, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${
                              i === 0 ? 'bg-blue-500' :
                              i === 1 ? 'bg-green-500' :
                              i === 2 ? 'bg-purple-500' :
                              i === 3 ? 'bg-orange-500' : 'bg-cyan-500'
                            }`} />
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{type.type}</span>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0">{type.percentage}%</Badge>
                        </div>
                        <Progress value={type.percentage * 2.6} className="h-2" />
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div>
                            <p className="text-gray-600">العدد: {type.count}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">القيمة: {(type.totalValue / 1000000).toFixed(0)}M</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '951-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير المخصصة</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Plus className="h-3 w-3 ml-1" />تقرير جديد</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير الكل</Button>
              </div>
            </div>

            {/* إحصائيات التقارير السريعة */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التقارير</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{customReports.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">تقرير</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير النشطة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customReports.filter(r => r.status === 'نشط').length}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">نشط</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <File className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المؤرشفة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customReports.filter(r => r.status === 'مؤرشف').length}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">مؤرشف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر تحديث</p>
                  </div>
                  <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {customReports[0]?.lastModified || 'N/A'}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">اليوم</Badge>
                </CardContent>
              </Card>
            </div>

            {/* نموذج إنشاء تقرير جديد */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Plus className="h-4 w-4" />
                  إنشاء تقرير مخصص جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reportName" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم التقرير *</Label>
                    <Input
                      id="reportName"
                      className="input-field h-8 text-xs"
                      style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}
                      placeholder="أدخل اسم التقرير"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع التقرير *</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر نوع التقرير" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="projects">تقرير المشاريع</SelectItem>
                          <SelectItem value="clients">تقرير العملاء</SelectItem>
                          <SelectItem value="financial">تقرير مالي</SelectItem>
                          <SelectItem value="comparison">تقرير مقارنة</SelectItem>
                          <SelectItem value="custom">مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timePeriod" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة الزمنية *</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر الفترة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">شهري</SelectItem>
                          <SelectItem value="quarter">ربع سنوي</SelectItem>
                          <SelectItem value="year">سنوي</SelectItem>
                          <SelectItem value="custom">فترة مخصصة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحقول المطلوبة</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['اسم المشروع', 'التاريخ', 'القيمة', 'المساحة', 'العميل', 'الحالة'].map((field, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="checkbox" id={`field-${i}`} className="w-3 h-3" />
                          <label htmlFor={`field-${i}`} className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{field}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>خيارات التصفية</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['حسب المدينة', 'حسب النوع', 'حسب الحالة', 'حسب القيمة', 'حسب التاريخ', 'مخصص'].map((filter, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="checkbox" id={`filter-${i}`} className="w-3 h-3" />
                          <label htmlFor={`filter-${i}`} className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{filter}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline" className="h-8 text-xs">إلغاء</Button>
                  <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ كقالب</Button>
                  <Button size="sm" className="h-8 text-xs bg-green-500"><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                </div>
              </CardContent>
            </Card>

            {/* قائمة التقارير المحفوظة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  التقارير المحفوظة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-2 space-y-2">
                    {customReports.map((report, i) => (
                      <Card key={i} className="card-element card-rtl hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <h4 className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.name}</h4>
                                <Badge className={`text-xs px-2 py-0 ${
                                  report.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{report.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {report.filters.map((filter, j) => (
                                  <Badge key={j} variant="outline" className="text-xs px-2 py-0">{filter}</Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>الرمز: {report.id}</span>
                                <span>•</span>
                                <span>تاريخ الإنشاء: {report.createdDate}</span>
                                <span>•</span>
                                <span>آخر تعديل: {report.lastModified}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Download className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Trash2 className="h-3 w-3 text-red-500" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case '951-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>تصدير البيانات</h2>
              <Button size="sm" className="h-8 text-xs bg-green-500"><RefreshCw className="h-3 w-3 ml-1" />تحديث</Button>
            </div>

            {/* إحصائيات التصدير السريعة */}
            <div className="grid grid-cols-5 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التصديرات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exportHistory.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">ملف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <File className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم الكلي</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {exportHistory.reduce((sum, exp) => sum + parseFloat(exp.size), 0).toFixed(1)}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">MB</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي السجلات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {exportHistory.reduce((sum, exp) => sum + exp.records, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">سجل</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>PDF</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {exportHistory.filter(e => e.format === 'PDF').length}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">ملف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <File className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>Excel</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {exportHistory.filter(e => e.format === 'Excel').length}
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">ملف</Badge>
                </CardContent>
              </Card>
            </div>

            {/* نموذج تصدير جديد */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4" />
                  تصدير بيانات جديدة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع البيانات *</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر نوع البيانات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">كل البيانات</SelectItem>
                          <SelectItem value="projects">المشاريع</SelectItem>
                          <SelectItem value="clients">العملاء</SelectItem>
                          <SelectItem value="statistics">الإحصائيات</SelectItem>
                          <SelectItem value="financial">البيانات المالية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>صيغة التصدير *</Label>
                    <div className="select-rtl">
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="input-field select-trigger h-8 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="word">Word</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفترة الزمنية</Label>
                    <div className="select-rtl">
                      <Select>
                        <SelectTrigger className="input-field select-trigger h-8 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                          <SelectValue placeholder="اختر الفترة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">الشهر الحالي</SelectItem>
                          <SelectItem value="quarter">الربع الحالي</SelectItem>
                          <SelectItem value="year">السنة الحالية</SelectItem>
                          <SelectItem value="all">كل الفترات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</Label>
                    <Input
                      className="input-field h-8 text-xs"
                      style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}
                      placeholder="اسم الملف (اختياري)"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <Label className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>خيارات التصدير</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="includeImages" className="w-3 h-3" defaultChecked />
                      <label htmlFor="includeImages" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تضمين الصور</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="includeCharts" className="w-3 h-3" defaultChecked />
                      <label htmlFor="includeCharts" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تضمين الرسوم البيانية</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="includeDetails" className="w-3 h-3" defaultChecked />
                      <label htmlFor="includeDetails" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تضمين التفاصيل</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="compressed" className="w-3 h-3" />
                      <label htmlFor="compressed" className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>ضغط الملف</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs"><Eye className="h-3 w-3 ml-1" />معاينة</Button>
                  <Button size="sm" className="h-8 text-xs bg-blue-500"><Download className="h-3 w-3 ml-1" />تصدير الآن</Button>
                </div>
              </CardContent>
            </Card>

            {/* صيغ التصدير المتاحة */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { format: 'PDF', icon: FileText, color: 'red', description: 'مناسب للطباعة والأرشفة' },
                { format: 'Excel', icon: File, color: 'green', description: 'مناسب للتحليل والمعالجة' },
                { format: 'CSV', icon: File, color: 'blue', description: 'مناسب لقواعد البيانات' },
                { format: 'Word', icon: FileText, color: 'blue', description: 'مناسب للتحرير والتوثيق' }
              ].map((item, i) => (
                <Card key={i} className={`card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-${item.color}-200 bg-gradient-to-br from-${item.color}-50 to-white`}>
                  <CardContent className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(item.icon, { className: `h-5 w-5 text-${item.color}-500` })}
                      <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.format}</span>
                    </div>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.description}</p>
                    <div className="mt-2">
                      <Badge className={`bg-${item.color}-100 text-${item.color}-800 text-xs px-2 py-0`}>
                        {exportHistory.filter(e => e.format === item.format || (item.format === 'Excel' && e.format === 'Excel')).length} ملف
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* سجل التصديرات السابقة */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Clock className="h-4 w-4" />
                  سجل التصديرات السابقة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرمز</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم الملف</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الصيغة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحجم</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>السجلات</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportHistory.map((exp, i) => (
                        <TableRow key={i} className="hover:bg-green-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-2 py-0">{exp.id}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs truncate max-w-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{exp.fileName}</span>
                              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-2 py-0 ${
                              exp.format === 'PDF' ? 'bg-red-100 text-red-800' :
                              exp.format === 'Excel' ? 'bg-green-100 text-green-800' :
                              exp.format === 'CSV' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {exp.format}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{exp.size}</TableCell>
                          <TableCell className="text-right py-2 text-xs">{exp.date}</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0">{exp.records.toLocaleString('ar-SA')}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto">
                              <CheckCircle className="h-3 w-3" />
                              {exp.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Download className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Eye className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Link2 className="h-3 w-3" /></Button>
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

      case '951-03':
      case '951-04':
      case '951-05':
      case '951-06':
      case '951-07':
      case '951-08':
      case '951-09':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التبويب {activeTab} قيد التطوير</h3>
              <p className="text-gray-600 text-sm">سيتم إضافة المحتوى قريباً</p>
            </div>
          </div>
        );

      case '951-16':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب التصنيف الرئيسي</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />تصفية</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-8 gap-2">
              {mainClassificationStats.map((cls, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      {i === 0 ? <Home className="h-3.5 w-3.5 text-blue-500" /> :
                       i === 1 ? <ShoppingBag className="h-3.5 w-3.5 text-green-500" /> :
                       i === 2 ? <Building2 className="h-3.5 w-3.5 text-purple-500" /> :
                       i === 3 ? <Landmark className="h-3.5 w-3.5 text-orange-500" /> :
                       i === 4 ? <Factory className="h-3.5 w-3.5 text-cyan-500" /> :
                       i === 5 ? <Building className="h-3.5 w-3.5 text-pink-500" /> :
                       i === 6 ? <TreePine className="h-3.5 w-3.5 text-green-600" /> :
                       <Star className="h-3.5 w-3.5 text-yellow-500" />}
                      <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cls.classificationName}</p>
                    </div>
                    <p className="text-base mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cls.projectsCount}</p>
                    <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0">{cls.percentage}%</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* رسم بياني توزيع التصنيفات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <PieChart className="h-4 w-4" />
                  توزيع المشاريع حسب التصنيف الرئيسي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-64 flex items-end justify-around gap-2">
                  {mainClassificationStats.map((cls, i) => {
                    const maxProjects = Math.max(...mainClassificationStats.map(c => c.projectsCount));
                    const height = (cls.projectsCount / maxProjects) * 220;
                    const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'emerald', 'yellow'];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {cls.percentage}%
                          </Badge>
                          <span className="text-xs mb-1">{cls.projectsCount}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer bg-gradient-to-t from-${colors[i]}-600 to-${colors[i]}-400 hover:from-${colors[i]}-700 hover:to-${colors[i]}-500`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cls.classificationName}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات تفصيلية */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المشاريع</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {mainClassificationStats.reduce((sum, c) => sum + c.projectsCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">مشروع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(mainClassificationStats.reduce((sum, c) => sum + c.totalArea, 0) / 1000000).toFixed(2)}M
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">م²</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(mainClassificationStats.reduce((sum, c) => sum + c.totalValue, 0) / 1000000000).toFixed(2)}B
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">ريال</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النمو</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(mainClassificationStats.reduce((sum, c) => sum + c.growth, 0) / mainClassificationStats.length).toFixed(1)}%
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">سنوي</Badge>
                </CardContent>
              </Card>
            </div>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <LayoutGrid className="h-4 w-4" />
                  جدول التصنيفات الرئيسية التفصيلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-rtl">
                  <TableHeader className="sticky top-0 bg-gray-50 z-10">
                    <TableRow>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المشاريع</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النمو</TableHead>
                      <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التراخيص</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mainClassificationStats.map((cls, i) => (
                      <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cls.classificationName}</span>
                            {i === 0 ? <Home className="h-4 w-4 text-blue-500" /> :
                             i === 1 ? <ShoppingBag className="h-4 w-4 text-green-500" /> :
                             i === 2 ? <Building2 className="h-4 w-4 text-purple-500" /> :
                             i === 3 ? <Landmark className="h-4 w-4 text-orange-500" /> :
                             i === 4 ? <Factory className="h-4 w-4 text-cyan-500" /> :
                             i === 5 ? <Building className="h-4 w-4 text-pink-500" /> :
                             i === 6 ? <TreePine className="h-4 w-4 text-green-600" /> :
                             <Star className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{cls.projectsCount.toLocaleString('ar-SA')}</Badge>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{(cls.totalArea / 1000).toFixed(0)}K م²</TableCell>
                        <TableCell className="text-right py-2 text-xs">{(cls.totalValue / 1000000).toFixed(0)}M ريال</TableCell>
                        <TableCell className="text-right py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <Progress value={cls.percentage * 2.5} className="h-2 w-16" />
                            <span className="text-xs">{cls.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs">{(cls.avgProjectValue / 1000000).toFixed(1)}M ريال</TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                            cls.growth > 15 ? 'bg-green-100 text-green-800' :
                            cls.growth > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            <ArrowUp className="h-3 w-3" />
                            {cls.growth}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0">{cls.licensesCount.toLocaleString('ar-SA')}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* بطاقات التصنيفات مع التفاصيل */}
            <div className="grid grid-cols-4 gap-2">
              {mainClassificationStats.map((cls, i) => {
                const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'emerald', 'yellow'];
                const icons = [Home, ShoppingBag, Building2, Landmark, Factory, Building, TreePine, Star];
                const Icon = icons[i];
                return (
                  <Card key={i} className={`card-element card-rtl hover:shadow-lg transition-all cursor-pointer border-t-4 border-${colors[i]}-500`}>
                    <CardContent className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-br from-${colors[i]}-500 to-${colors[i]}-600 rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cls.classificationName}</p>
                          <Badge className={`text-xs px-1 py-0 mt-0.5 bg-${colors[i]}-100 text-${colors[i]}-800`}>
                            {cls.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">المشاريع</p>
                          <p className="font-medium">{cls.projectsCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">النمو</p>
                          <p className="font-medium text-green-600">+{cls.growth}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">المساحة</p>
                          <p className="font-medium">{(cls.totalArea / 1000).toFixed(0)}K م²</p>
                        </div>
                        <div>
                          <p className="text-gray-600">القيمة</p>
                          <p className="font-medium">{(cls.totalValue / 1000000).toFixed(0)}M</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '951-17':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب التصنيف الفرعي</h2>
              <div className="flex gap-2">
                <div className="select-rtl">
                  <Select>
                    <SelectTrigger className="input-field select-trigger h-8 w-40 text-xs" style={{ border: '2px solid #e5e7eb', backgroundColor: '#ffffff', textAlign: 'right', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="فلترة حسب التصنيف الرئيسي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل التصنيفات</SelectItem>
                      <SelectItem value="residential">سكني</SelectItem>
                      <SelectItem value="commercial">تجاري</SelectItem>
                      <SelectItem value="mixed">مختلط الاستخدام</SelectItem>
                      <SelectItem value="admin">إداري</SelectItem>
                      <SelectItem value="industrial">صناعي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيفات الفرعية</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{subClassificationStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">تصنيف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه الصاعد</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {subClassificationStats.filter(s => s.trend === 'صاعد').length}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">تصنيف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه المستقر</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {subClassificationStats.filter(s => s.trend === 'مستقر').length}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">تصنيف</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDown className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه النازل</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {subClassificationStats.filter(s => s.trend === 'نازل').length}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">تصنيف</Badge>
                </CardContent>
              </Card>
            </div>

            {/* جدول التصنيفات الفرعية */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Layers className="h-4 w-4" />
                  قائمة التصنيفات الفرعية التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف الفرعي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف الرئيسي</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>عدد المشاريع</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المساحة الكلية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>القيمة الإجمالية</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط المساحة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط القيمة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاتجاه</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subClassificationStats.map((sub, i) => (
                        <TableRow key={i} className="hover:bg-green-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sub.subClassificationName}</span>
                              <Layers className="h-4 w-4 text-blue-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge variant="outline" className="text-xs px-2 py-0">{sub.mainClassification}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{sub.projectsCount.toLocaleString('ar-SA')}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{(sub.totalArea / 1000).toFixed(0)}K م²</TableCell>
                          <TableCell className="text-right py-2 text-xs">{(sub.totalValue / 1000000).toFixed(0)}M ريال</TableCell>
                          <TableCell className="text-right py-2 text-xs">{sub.avgArea.toLocaleString('ar-SA')} م²</TableCell>
                          <TableCell className="text-right py-2 text-xs">{(sub.avgValue / 1000000).toFixed(1)}M ريال</TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className={`text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto ${
                              sub.trend === 'صاعد' ? 'bg-green-100 text-green-800' :
                              sub.trend === 'مستقر' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {sub.trend === 'صاعد' ? <ArrowUp className="h-3 w-3" /> :
                               sub.trend === 'مستقر' ? <Activity className="h-3 w-3" /> :
                               <ArrowDown className="h-3 w-3" />}
                              {sub.trend}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* بطاقات التصنيفات الفرعية */}
            <div className="grid grid-cols-7 gap-2">
              {subClassificationStats.slice(0, 14).map((sub, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-2">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sub.subClassificationName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">المشاريع</span>
                        <span className="font-medium">{sub.projectsCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">القيمة</span>
                        <span className="font-medium">{(sub.totalValue / 1000000).toFixed(0)}M</span>
                      </div>
                      <Badge className={`text-xs px-1 py-0 w-full justify-center ${
                        sub.trend === 'صاعد' ? 'bg-green-100 text-green-800' :
                        sub.trend === 'مستقر' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {sub.trend}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '951-18':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات حسب نوع المعاملة</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs"><Filter className="h-3 w-3 ml-1" />تصفية</Button>
                <Button size="sm" className="h-8 text-xs bg-green-500"><Download className="h-3 w-3 ml-1" />تصدير</Button>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع المعاملات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>{transactionTypeStats.length}</p>
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0 mt-1">نوع</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعاملات</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {transactionTypeStats.reduce((sum, t) => sum + t.count, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0 mt-1">معاملة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتملة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {transactionTypeStats.reduce((sum, t) => sum + t.completedCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs px-1 py-0 mt-1">معاملة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المعالجة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {transactionTypeStats.reduce((sum, t) => sum + t.pendingCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0 mt-1">معاملة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <X className="h-4 w-4 text-red-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفوضة</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {transactionTypeStats.reduce((sum, t) => sum + t.rejectedCount, 0).toLocaleString('ar-SA')}
                  </p>
                  <Badge className="bg-red-100 text-red-800 text-xs px-1 py-0 mt-1">معاملة</Badge>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl hover:shadow-lg transition-all">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="h-4 w-4 text-cyan-500" />
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط النجاح</p>
                  </div>
                  <p className="text-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {(transactionTypeStats.reduce((sum, t) => sum + t.successRate, 0) / transactionTypeStats.length).toFixed(1)}%
                  </p>
                  <Badge className="bg-cyan-100 text-cyan-800 text-xs px-1 py-0 mt-1">معدل</Badge>
                </CardContent>
              </Card>
            </div>

            {/* رسم بياني أنواع المعاملات */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <BarChart3 className="h-4 w-4" />
                  توزيع المعاملات حسب النوع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="h-56 flex items-end justify-around gap-1">
                  {transactionTypeStats.map((trans, i) => {
                    const maxCount = Math.max(...transactionTypeStats.map(t => t.count));
                    const height = (trans.count / maxCount) * 190;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col items-center">
                          <Badge className={`text-xs px-1 py-0 mb-1 ${
                            trans.successRate > 95 ? 'bg-green-100 text-green-800' :
                            trans.successRate > 90 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trans.successRate}%
                          </Badge>
                          <span className="text-xs mb-1">{trans.count}</span>
                          <div 
                            className={`w-full rounded-t transition-all cursor-pointer ${
                              i % 4 === 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500' :
                              i % 4 === 1 ? 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-700 hover:to-green-500' :
                              i % 4 === 2 ? 'bg-gradient-to-t from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500' :
                              'bg-gradient-to-t from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500'
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700 truncate w-full text-center" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '9px' }}>
                          {trans.transactionType.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* جدول تفصيلي */}
            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <FileText className="h-4 w-4" />
                  قائمة أنواع المعاملات التفصيلية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <Table className="table-rtl">
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>نوع المعاملة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>العدد</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الوقت</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المكتملة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>قيد المعالجة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرفوضة</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النجاح</TableHead>
                        <TableHead className="text-right text-xs py-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الرسوم</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionTypeStats.map((trans, i) => (
                        <TableRow key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trans.transactionType}</span>
                              <FileText className="h-4 w-4 text-blue-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0">{trans.count.toLocaleString('ar-SA')}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-purple-100 text-purple-800 text-xs px-2 py-0 flex items-center gap-1 w-fit mr-auto">
                              <Clock className="h-3 w-3" />
                              {trans.avgProcessingTime} يوم
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">{trans.completedCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-0">{trans.pendingCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0">{trans.rejectedCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right py-2">
                            <div className="flex items-center gap-2 justify-end">
                              <Progress value={trans.successRate} className="h-2 w-20" />
                              <span className="text-xs">{trans.successRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-2 text-xs">{trans.avgFees.toLocaleString('ar-SA')} ريال</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* بطاقات أنواع المعاملات */}
            <div className="grid grid-cols-6 gap-2">
              {transactionTypeStats.map((trans, i) => (
                <Card key={i} className="card-element card-rtl hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-2">
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>{trans.transactionType}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">العدد</span>
                        <span className="font-medium">{trans.count}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">النجاح</span>
                        <span className={`font-medium ${
                          trans.successRate > 95 ? 'text-green-600' :
                          trans.successRate > 90 ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>{trans.successRate}%</span>
                      </div>
                      <Badge className={`text-xs px-1 py-0 w-full justify-center ${
                        trans.successRate > 95 ? 'bg-green-100 text-green-800' :
                        trans.successRate > 90 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trans.avgProcessingTime} يوم
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex bg-gray-50 overflow-hidden" dir="rtl">
      <CodeDisplay code="SCR-951" position="top-right" />
      
      <UniversalTabsSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="flex-shrink-0" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>إحصائيات الأعمال</h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليلات شاملة لأعمال المكتب</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-0.5">
                <Building2 className="h-3 w-3 ml-1" />
                1,022 مشروع
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-0.5">
                <Ruler className="h-3 w-3 ml-1" />
                1.54M م²
              </Badge>
              <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs px-2 py-0.5">
                <DollarSign className="h-3 w-3 ml-1" />
                4.62B ريال
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessStatistics_Complete_951;
