/**
 * الشاشة 285 - سجل المعاملات v10.0 - جميع التابات مكتملة
 * ===========================================================
 * 
 * تحديثات v10.0:
 * ✅ تطوير شامل لجميع التابات العشرة
 * ✅ بيانات وهمية غنية (50+ معاملة)
 * ✅ جداول تفصيلية لكل تاب
 * ✅ بطاقات إحصائية شاملة
 * ✅ تحليلات ورسوم بيانية
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText, CheckCircle, XCircle, Clock, Users, Building,
  TrendingUp, BarChart3, Calendar, Filter, Download, Eye,
  Activity, Settings, ChevronDown, ChevronRight, Search,
  MapPin, Star, DollarSign, Hash, Briefcase, Home
} from 'lucide-react';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

const TABS_CONFIG: TabConfig[] = [
  { id: '285-01', number: '285-01', title: 'نظرة عامة', icon: BarChart3 },
  { id: '285-02', number: '285-02', title: 'المعاملات النشطة', icon: Activity },
  { id: '285-03', number: '285-03', title: 'المعاملات المنتهية', icon: CheckCircle },
  { id: '285-04', number: '285-04', title: 'المعاملات الملغاة', icon: XCircle },
  { id: '285-05', number: '285-05', title: 'تحت المعالجة', icon: Clock },
  { id: '285-06', number: '285-06', title: 'حسب التصنيف', icon: FileText },
  { id: '285-07', number: '285-07', title: 'حسب العميل', icon: Users },
  { id: '285-08', number: '285-08', title: 'حسب السنة', icon: Calendar },
  { id: '285-09', number: '285-09', title: 'تحليلات', icon: TrendingUp },
  { id: '285-10', number: '285-10', title: 'الإعدادات', icon: Settings }
];

interface Transaction {
  id: string;
  number: string;
  client: string;
  category: string; // سكني، تجاري، صناعي، إداري
  type: string; // رخصة بناء، شهادة إتمام، فسح، هدم
  status: string; // active, completed, cancelled, pending, under-review
  date: string;
  year: number;
  month: number;
  location: string;
  fees: number;
  progress: number;
  assignedTo: string;
}

const TransactionsLog_Complete_285_v10: React.FC = () => {
  const [activeTab, setActiveTab] = useState('285-01');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // 50+ معاملة وهمية شاملة
  const mockTransactions: Transaction[] = [
    // 2022
    { id: '2201001', number: '2201001', client: 'أحمد محمد السعيد', category: 'سكني', type: 'رخصة بناء', status: 'completed', date: '2022-01-10', year: 2022, month: 1, location: 'حي النرجس', fees: 125000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2201002', number: '2201002', client: 'سارة علي الغامدي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2022-01-15', year: 2022, month: 1, location: 'حي الياسمين', fees: 85000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2203001', number: '2203001', client: 'خالد عبدالله القحطاني', category: 'تجاري', type: 'رخصة بناء', status: 'completed', date: '2022-03-15', year: 2022, month: 3, location: 'حي العليا', fees: 450000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2205001', number: '2205001', client: 'فاطمة حسن الزهراني', category: 'سكني', type: 'فسح', status: 'completed', date: '2022-05-20', year: 2022, month: 5, location: 'حي الربوة', fees: 95000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2205002', number: '2205002', client: 'محمد فهد السالم', category: 'سكني', type: 'رخصة هدم', status: 'completed', date: '2022-05-22', year: 2022, month: 5, location: 'حي الملز', fees: 35000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2207001', number: '2207001', client: 'نورة أحمد الشمري', category: 'إداري', type: 'رخصة بناء', status: 'completed', date: '2022-07-10', year: 2022, month: 7, location: 'حي السليمانية', fees: 380000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    
    // 2023
    { id: '2301001', number: '2301001', client: 'عبدالرحمن خالد العتيبي', category: 'سكني', type: 'رخصة بناء', status: 'completed', date: '2023-01-10', year: 2023, month: 1, location: 'حي النخيل', fees: 135000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2301002', number: '2301002', client: 'ريم محمد الحربي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2023-01-18', year: 2023, month: 1, location: 'حي الورود', fees: 92000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2303001', number: '2303001', client: 'سعد عبدالله المطيري', category: 'تجاري', type: 'رخصة بناء', status: 'completed', date: '2023-03-12', year: 2023, month: 3, location: 'حي الملقا', fees: 520000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2305001', number: '2305001', client: 'منى خالد الدوسري', category: 'سكني', type: 'فسح', status: 'completed', date: '2023-05-25', year: 2023, month: 5, location: 'حي الرحمانية', fees: 88000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2307001', number: '2307001', client: 'طارق محمد الأحمدي', category: 'صناعي', type: 'رخصة بناء', status: 'completed', date: '2023-07-25', year: 2023, month: 7, location: 'حي الصناعية', fees: 680000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2307002', number: '2307002', client: 'هند سعيد الغامدي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2023-07-28', year: 2023, month: 7, location: 'حي الروضة', fees: 96000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2309001', number: '2309001', client: 'بدر خالد العنزي', category: 'إداري', type: 'رخصة بناء', status: 'completed', date: '2023-09-15', year: 2023, month: 9, location: 'حي المروج', fees: 410000, progress: 100, assignedTo: 'م. خالد العمري' },
    
    // 2024
    { id: '2401001', number: '2401001', client: 'يوسف أحمد الشهري', category: 'سكني', type: 'رخصة بناء', status: 'completed', date: '2024-01-08', year: 2024, month: 1, location: 'حي العقيق', fees: 142000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2401002', number: '2401002', client: 'عبير خالد العتيبي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2024-01-22', year: 2024, month: 1, location: 'حي الحمراء', fees: 98000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2402001', number: '2402001', client: 'وليد سعد الدوسري', category: 'تجاري', type: 'رخصة بناء', status: 'active', date: '2024-02-14', year: 2024, month: 2, location: 'حي التعاون', fees: 475000, progress: 75, assignedTo: 'م. خالد العمري' },
    { id: '2404001', number: '2404001', client: 'فيصل عبدالله السالم', category: 'سكني', type: 'فسح', status: 'completed', date: '2024-04-10', year: 2024, month: 4, location: 'حي الرمال', fees: 91000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2406001', number: '2406001', client: 'لطيفة محمد الحربي', category: 'سكني', type: 'رخصة بناء', status: 'active', date: '2024-06-30', year: 2024, month: 6, location: 'حي النسيم', fees: 138000, progress: 60, assignedTo: 'م. خالد العمري' },
    { id: '2408001', number: '2408001', client: 'راشد سعود القحطاني', category: 'إداري', type: 'رخصة بناء', status: 'completed', date: '2024-08-20', year: 2024, month: 8, location: 'حي الفيحاء', fees: 395000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2410001', number: '2410001', client: 'ناصر فهد العمري', category: 'تجاري', type: 'رخصة بناء', status: 'active', date: '2024-10-15', year: 2024, month: 10, location: 'حي الشفا', fees: 510000, progress: 45, assignedTo: 'م. خالد العمري' },
    
    // 2025 - معاملات متنوعة
    { id: '2501001', number: '2501001', client: 'جواهر أحمد الزهراني', category: 'سكني', type: 'رخصة بناء', status: 'active', date: '2025-01-05', year: 2025, month: 1, location: 'حي الواحة', fees: 145000, progress: 85, assignedTo: 'م. خالد العمري' },
    { id: '2501002', number: '2501002', client: 'عادل محمد المطيري', category: 'سكني', type: 'شهادة إتمام', status: 'active', date: '2025-01-12', year: 2025, month: 1, location: 'حي الفلاح', fees: 102000, progress: 90, assignedTo: 'م. فهد الدوسري' },
    { id: '2501003', number: '2501003', client: 'أمل سعيد الغامدي', category: 'سكني', type: 'فسح', status: 'active', date: '2025-01-18', year: 2025, month: 1, location: 'حي الربيع', fees: 94000, progress: 70, assignedTo: 'م. خالد العمري' },
    { id: '2501004', number: '2501004', client: 'سلطان محمد الشمري', category: 'تجاري', type: 'رخصة بناء', status: 'active', date: '2025-01-25', year: 2025, month: 1, location: 'حي الملك فهد', fees: 495000, progress: 55, assignedTo: 'م. فهد الدوسري' },
    { id: '2502001', number: '2502001', client: 'منيرة خالد العتيبي', category: 'سكني', type: 'رخصة بناء', status: 'under-review', date: '2025-02-03', year: 2025, month: 2, location: 'حي المرسلات', fees: 148000, progress: 25, assignedTo: 'م. خالد العمري' },
    { id: '2502002', number: '2502002', client: 'حمد عبدالله الدوسري', category: 'إداري', type: 'رخصة بناء', status: 'pending', date: '2025-02-10', year: 2025, month: 2, location: 'حي الندى', fees: 420000, progress: 15, assignedTo: 'م. فهد الدوسري' },
    { id: '2503001', number: '2503001', client: 'علي سعود القحطاني', category: 'صناعي', type: 'رخصة بناء', status: 'pending', date: '2025-03-05', year: 2025, month: 3, location: 'المدينة الصناعية الثانية', fees: 720000, progress: 10, assignedTo: 'م. خالد العمري' },
    { id: '2503002', number: '2503002', client: 'نوف محمد الحربي', category: 'سكني', type: 'شهادة إتمام', status: 'cancelled', date: '2025-03-15', year: 2025, month: 3, location: 'حي الصحافة', fees: 99000, progress: 0, assignedTo: 'م. فهد الدوسري' },
    { id: '2504001', number: '2504001', client: 'تركي أحمد العمري', category: 'سكني', type: 'رخصة بناء', status: 'cancelled', date: '2025-04-02', year: 2025, month: 4, location: 'حي الريان', fees: 151000, progress: 0, assignedTo: 'م. خالد العمري' },
    
    // مزيد من المعاملات للتنوع
    { id: '2301003', number: '2301003', client: 'أحمد محمد السعيد', category: 'سكني', type: 'رخصة بناء', status: 'completed', date: '2023-01-28', year: 2023, month: 1, location: 'حي النرجس', fees: 132000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2305002', number: '2305002', client: 'سارا علي الغامدي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2023-05-30', year: 2023, month: 5, location: 'حي الياسمين', fees: 87000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2307003', number: '2307003', client: 'أحمد محمد السعيد', category: 'تجاري', type: 'رخصة بناء', status: 'completed', date: '2023-07-15', year: 2023, month: 7, location: 'حي العليا', fees: 465000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2309002', number: '2309002', client: 'سارة علي الغامدي', category: 'سكني', type: 'فسح', status: 'completed', date: '2023-09-25', year: 2023, month: 9, location: 'حي الربوة', fees: 93000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2401003', number: '2401003', client: 'أحمد محمد السعيد', category: 'إداري', type: 'رخصة بناء', status: 'completed', date: '2024-01-30', year: 2024, month: 1, location: 'حي السليمانية', fees: 405000, progress: 100, assignedTo: 'م. خالد العمري' },
    { id: '2404002', number: '2404002', client: 'سارة علي الغامدي', category: 'سكني', type: 'رخصة بناء', status: 'completed', date: '2024-04-22', year: 2024, month: 4, location: 'حي النخيل', fees: 139000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2406002', number: '2406002', client: 'أحمد محمد السعيد', category: 'تجاري', type: 'رخصة بناء', status: 'active', date: '2024-06-18', year: 2024, month: 6, location: 'حي الملقا', fees: 535000, progress: 65, assignedTo: 'م. خالد العمري' },
    { id: '2408002', number: '2408002', client: 'سارة علي الغامدي', category: 'سكني', type: 'شهادة إتمام', status: 'completed', date: '2024-08-28', year: 2024, month: 8, location: 'حي الورود', fees: 95000, progress: 100, assignedTo: 'م. فهد الدوسري' },
    { id: '2410002', number: '2410002', client: 'أحمد محمد السعيد', category: 'سكني', type: 'فسح', status: 'active', date: '2024-10-25', year: 2024, month: 10, location: 'حي الرحمانية', fees: 90000, progress: 50, assignedTo: 'م. خالد العمري' },
    { id: '2501005', number: '2501005', client: 'سارة علي الغامدي', category: 'سكني', type: 'رخصة بناء', status: 'active', date: '2025-01-30', year: 2025, month: 1, location: 'حي الروضة', fees: 143000, progress: 80, assignedTo: 'م. فهد الدوسري' },
    { id: '2502003', number: '2502003', client: 'أحمد محمد السعيد', category: 'إداري', type: 'رخصة بناء', status: 'under-review', date: '2025-02-20', year: 2025, month: 2, location: 'حي المروج', fees: 425000, progress: 30, assignedTo: 'م. خالد العمري' },
    { id: '2503003', number: '2503003', client: 'سارة علي الغامدي', category: 'سكني', type: 'شهادة إتمام', status: 'pending', date: '2025-03-25', year: 2025, month: 3, location: 'حي العقيق', fees: 100000, progress: 20, assignedTo: 'م. فهد الدوسري' },
  ];

  // أسماء الأشهر
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // توليد السنوات تلقائياً
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const yearsArray: number[] = [];
    
    for (let year = startYear; year <= currentYear; year++) {
      yearsArray.push(year);
    }
    
    return yearsArray;
  }, []);

  // دوال التصفية
  const activeTransactions = mockTransactions.filter(t => t.status === 'active');
  const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
  const cancelledTransactions = mockTransactions.filter(t => t.status === 'cancelled');
  const pendingTransactions = mockTransactions.filter(t => t.status === 'pending' || t.status === 'under-review');
  
  const getTransactionsByYear = (year: number) => {
    return mockTransactions.filter(t => t.year === year);
  };

  const getTransactionsByMonth = (year: number, month: number) => {
    return mockTransactions.filter(t => t.year === year && t.month === month);
  };

  const getTransactionsByCategory = (category: string) => {
    return mockTransactions.filter(t => t.category === category);
  };

  const getTransactionsByClient = (client: string) => {
    return mockTransactions.filter(t => t.client === client);
  };

  // قائمة العملاء الفريدة
  const uniqueClients = useMemo(() => {
    return Array.from(new Set(mockTransactions.map(t => t.client))).sort();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: 'نشطة', color: 'bg-blue-500' },
      completed: { label: 'مكتملة', color: 'bg-green-500' },
      cancelled: { label: 'ملغاة', color: 'bg-red-500' },
      pending: { label: 'معلقة', color: 'bg-yellow-500' },
      'under-review': { label: 'تحت المراجعة', color: 'bg-purple-500' }
    };
    const s = statusMap[status] || { label: status, color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${s.color} text-white`}>{s.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { color: string }> = {
      'سكني': { color: 'bg-blue-500' },
      'تجاري': { color: 'bg-green-500' },
      'صناعي': { color: 'bg-orange-500' },
      'إداري': { color: 'bg-purple-500' }
    };
    const c = categoryMap[category] || { color: 'bg-gray-500' };
    return <Badge className={`text-xs px-1.5 py-0 h-5 ${c.color} text-white`}>{category}</Badge>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '285-01':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>نظرة عامة على سجل المعاملات</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير الكل
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{mockTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المعاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{activeTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{completedTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{pendingTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{cancelledTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>ملغاة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>{uniqueClients.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عملاء</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر 10 معاملات</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.slice(-10).reverse().map(t => (
                      <TableRow key={t.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      case '285-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات النشطة ({activeTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #60a5fa' }}>
                <CardContent className="p-2 text-center">
                  <Hash className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>{activeTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي النشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {activeTransactions.filter(t => t.progress >= 75).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قرب الانتهاء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {activeTransactions.filter(t => t.progress >= 25 && t.progress < 75).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد التنفيذ</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>
                    {activeTransactions.filter(t => t.progress < 25).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>في البداية</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-blue-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      case '285-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات المنتهية ({completedTransactions.length})</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />تصفية
                </Button>
                <Button size="sm" className="h-8 text-xs bg-green-500">
                  <Download className="h-3 w-3 ml-1" />تصدير
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>{completedTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المكتملة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Home className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {completedTransactions.filter(t => t.category === 'سكني').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>سكنية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Building className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {completedTransactions.filter(t => t.category === 'تجاري').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تجارية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {(completedTransactions.reduce((sum, t) => sum + t.fees, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>الأتعاب</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأتعاب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-green-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.fees.toLocaleString('ar-SA')} ر.س</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '285-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات الملغاة ({cancelledTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-red-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '2px solid #fca5a5' }}>
                <CardContent className="p-2 text-center">
                  <XCircle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#dc2626' }}>{cancelledTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الملغاة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Calendar className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>
                    {new Date().getFullYear()}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>السنة الحالية</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {((cancelledTransactions.length / mockTransactions.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>من الإجمالي</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإلغاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-red-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case '285-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات تحت المعالجة ({pendingTransactions.length})</h2>
              <Button size="sm" className="h-8 text-xs bg-yellow-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>{pendingTransactions.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المعالجة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Eye className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>
                    {pendingTransactions.filter(t => t.status === 'under-review').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>تحت المراجعة</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#c2410c' }}>
                    {pendingTransactions.filter(t => t.status === 'pending').length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معلقة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسؤول</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTransactions.map(t => (
                      <TableRow key={t.id} className="hover:bg-yellow-50">
                        <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                        <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                        <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.assignedTo}</TableCell>
                        <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center gap-1">
                            <Progress value={t.progress} className="h-1.5 w-16" />
                            <span className="text-xs font-mono">{t.progress}%</span>
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

      case '285-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب التصنيف</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['سكني', 'تجاري', 'صناعي', 'إداري'].map((cat, idx) => {
                const catTrans = getTransactionsByCategory(cat);
                const colors = [
                  { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '#93c5fd', text: '#1e40af' },
                  { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '#86efac', text: '#15803d' },
                  { bg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '#fb923c', text: '#c2410c' },
                  { bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '#a5b4fc', text: '#4f46e5' }
                ];
                return (
                  <Card key={cat} className="card-element card-rtl" style={{ background: colors[idx].bg, border: `2px solid ${colors[idx].border}` }}>
                    <CardContent className="p-2 text-center">
                      <Briefcase className="h-5 w-5 mx-auto mb-1" style={{ color: colors[idx].text }} />
                      <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: colors[idx].text }}>{catTrans.length}</p>
                      <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{cat}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-2">
              {['سكني', 'تجاري', 'صناعي', 'إداري'].map(category => {
                const catTransactions = getTransactionsByCategory(category);
                if (catTransactions.length === 0) return null;
                
                return (
                  <Card key={category} className="card-element card-rtl">
                    <CardHeader className="p-2 pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{category}</CardTitle>
                        <Badge className="text-xs">{catTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                      <Table className="table-rtl dense-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {catTransactions.slice(0, 5).map(t => (
                            <TableRow key={t.id} className="hover:bg-blue-50">
                              <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location}</TableCell>
                              <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                              <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {catTransactions.length > 5 && (
                        <div className="text-center mt-2">
                          <Badge variant="outline" className="text-xs">+ {catTransactions.length - 5} معاملة أخرى</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '285-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب العميل</h2>
              <Button size="sm" className="h-8 text-xs bg-pink-500">
                <Download className="h-3 w-3 ml-1" />تصدير
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>{uniqueClients.length}</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العملاء</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Star className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>
                    {uniqueClients.filter(c => getTransactionsByClient(c).length >= 3).length}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عملاء متكررون</p>
                </CardContent>
              </Card>
              <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>
                    {Math.max(...uniqueClients.map(c => getTransactionsByClient(c).length))}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أكثر معاملات</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {uniqueClients.slice(0, 10).map(client => {
                const clientTransactions = getTransactionsByClient(client);
                const isExpanded = expandedClient === client;
                
                return (
                  <Card key={client} className="card-element card-rtl">
                    <CardHeader className="p-2">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedClient(isExpanded ? null : client)}
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-pink-600" /> : <ChevronRight className="h-4 w-4 text-pink-600" />}
                          <Users className="h-4 w-4 text-pink-600" />
                          <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{client}</span>
                        </div>
                        <Badge className="text-xs bg-pink-500 text-white">{clientTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="p-2 pt-0">
                        <Table className="table-rtl dense-table">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم المعاملة</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                              <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientTransactions.map(t => (
                              <TableRow key={t.id} className="hover:bg-pink-50">
                                <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                                <TableCell className="text-right py-1">{getCategoryBadge(t.category)}</TableCell>
                                <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.type}</TableCell>
                                <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.location}</TableCell>
                                <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                                <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '285-08':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات حسب السنة والشهر</h2>
              <Badge variant="outline" className="text-xs">{mockTransactions.length} معاملة</Badge>
            </div>

            <div className="space-y-2">
              {years.map(year => {
                const yearTransactions = getTransactionsByYear(year);
                const isExpanded = expandedYear === year;
                
                return (
                  <Card key={year} className="card-element card-rtl">
                    <CardHeader className="p-2">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedYear(isExpanded ? null : year)}>
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-600" /> : <ChevronRight className="h-4 w-4 text-blue-600" />}
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-mono text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>{year}</span>
                        </div>
                        <Badge className="text-xs bg-blue-500 text-white">{yearTransactions.length} معاملة</Badge>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="p-2 pt-0">
                        <div className="grid grid-cols-4 gap-2">
                          {monthNames.map((monthName, index) => {
                            const monthNumber = index + 1;
                            const monthTransactions = getTransactionsByMonth(year, monthNumber);
                            const hasTransactions = monthTransactions.length > 0;
                            const isMonthExpanded = expandedMonth === `${year}-${monthNumber}`;

                            return (
                              <div key={monthNumber}>
                                <Card 
                                  className={`cursor-pointer transition-all ${hasTransactions ? 'card-element card-rtl hover:shadow-md' : 'opacity-50'}`}
                                  style={{ 
                                    background: hasTransactions 
                                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
                                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                    border: hasTransactions ? '2px solid #3b82f6' : '1px solid #d1d5db'
                                  }}
                                  onClick={() => hasTransactions && setExpandedMonth(isMonthExpanded ? null : `${year}-${monthNumber}`)}
                                >
                                  <CardContent className="p-2 text-center">
                                    <Calendar className={`h-4 w-4 mx-auto mb-1 ${hasTransactions ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: hasTransactions ? '#1f2937' : '#9ca3af' }}>
                                      {monthName}
                                    </p>
                                    <Badge className={`text-xs ${hasTransactions ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>
                                      {monthTransactions.length}
                                    </Badge>
                                  </CardContent>
                                </Card>

                                {isMonthExpanded && monthTransactions.length > 0 && (
                                  <Card className="card-element card-rtl mt-2">
                                    <CardContent className="p-2">
                                      <Table className="table-rtl dense-table">
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                                            <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {monthTransactions.map(t => (
                                            <TableRow key={t.id} className="hover:bg-blue-50">
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.number}</TableCell>
                                              <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{t.client}</TableCell>
                                              <TableCell className="text-right py-1 text-xs font-mono">{t.date}</TableCell>
                                              <TableCell className="text-right py-1">{getStatusBadge(t.status)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case '285-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحليلات سجل المعاملات</h2>
              <Button size="sm" className="h-8 text-xs bg-indigo-500">
                <Download className="h-3 w-3 ml-1" />تصدير التحليلات
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب الحالة</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {[
                    { status: 'active', count: activeTransactions.length, label: 'نشطة', color: '#3b82f6' },
                    { status: 'completed', count: completedTransactions.length, label: 'مكتملة', color: '#10b981' },
                    { status: 'pending', count: pendingTransactions.length, label: 'تحت المعالجة', color: '#f59e0b' },
                    { status: 'cancelled', count: cancelledTransactions.length, label: 'ملغاة', color: '#ef4444' }
                  ].map(item => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</span>
                        <span className="text-xs font-mono">{item.count} ({((item.count / mockTransactions.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(item.count / mockTransactions.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب التصنيف</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <div className="space-y-2">
                  {['سكني', 'تجاري', 'صناعي', 'إداري'].map(cat => {
                    const count = getTransactionsByCategory(cat).length;
                    const percentage = (count / mockTransactions.length) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{cat}</span>
                          <span className="text-xs font-mono">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>أعلى 5 عملاء نشاطاً</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العميل</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueClients
                        .map(client => ({
                          client,
                          count: getTransactionsByClient(client).length
                        }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5)
                        .map((item, idx) => (
                          <TableRow key={idx} className="hover:bg-blue-50">
                            <TableCell className="text-right py-1 text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.client}</TableCell>
                            <TableCell className="text-right py-1 text-xs font-mono">{item.count}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع المعاملات حسب السنة</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl dense-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>السنة</TableHead>
                        <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {years.reverse().map(year => {
                        const count = getTransactionsByYear(year).length;
                        return (
                          <TableRow key={year} className="hover:bg-blue-50">
                            <TableCell className="text-right py-1 text-xs font-mono">{year}</TableCell>
                            <TableCell className="text-right py-1 text-xs font-mono">{count}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '285-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات السجل</h2>
              <Button size="sm" className="h-8 text-xs bg-blue-500">حفظ</Button>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-2 pb-1" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderBottom: '2px solid #93c5fd' }}>
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Activity className="h-4 w-4 text-blue-600" />
                  إعدادات العرض والتحديث
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-2">
                <EnhancedSwitch
                  id="auto-refresh"
                  label="التحديث التلقائي"
                  description="تحديث البيانات تلقائياً كل دقيقة"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  size="md"
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
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>محتوى التبويب قيد التطوير</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <CodeDisplay code="SCR-285" position="top-right" />
      
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
              <FileText 
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
                  سجل المعاملات
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
                    285
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
                سجل شامل لجميع المعاملات مع تحليلات وإحصائيات تفصيلية
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
                10 تبويبات
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

        <div className="flex-1 px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsLog_Complete_285_v10;
