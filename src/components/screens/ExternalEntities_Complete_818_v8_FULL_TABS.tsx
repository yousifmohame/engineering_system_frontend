/**
 * الشاشة 818 - إدارة الجهات الخارجية - جميع التابات مكتملة v8.0
 * ================================================================
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import {
  Building, Plus, Edit, Trash2, Eye, Download, Shield, Award, Briefcase, Users,
  MapPin, UserCheck, Navigation, TrendingUp, Target, History, Archive, Settings,
  Phone, Mail, Globe, CheckCircle, Clock, AlertTriangle, Search, Filter, Calendar,
  BarChart3, PieChart, Activity, Zap, FileText, Send, Printer, RefreshCw, Star,
  ChevronRight, ExternalLink, X, Save, RotateCcw, Database, Hash, DollarSign, Layers, Bell
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import { toast } from 'sonner@2.0.3';

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

const GOVERNMENT_ENTITIES = [
  { id: 'GOV-001', name: 'وزارة الشؤون البلدية والقروية', code: 'MOMRA', sector: 'حكومي', region: 'جميع المناطق', transactions: 1450, status: 'active' },
  { id: 'GOV-002', name: 'أمانة منطقة الرياض', code: 'AMR', sector: 'حكومي', region: 'الرياض', transactions: 2380, status: 'active' },
  { id: 'GOV-003', name: 'وزارة الإسكان', code: 'MOH', sector: 'حكومي', region: 'جميع المناطق', transactions: 890, status: 'active' },
  { id: 'GOV-004', name: 'الهيئة العامة للعقار', code: 'REGA', sector: 'حكومي', region: 'جميع المناطق', transactions: 3200, status: 'active' },
  { id: 'GOV-005', name: 'وزارة العدل', code: 'MOJ', sector: 'حكومي', region: 'جميع المناطق', transactions: 1560, status: 'active' },
  { id: 'GOV-006', name: 'هيئة الزكاة والضريبة والجمارك', code: 'ZATCA', sector: 'حكومي', region: 'جميع المناطق', transactions: 760, status: 'active' },
  { id: 'GOV-007', name: 'وزارة الموارد البشرية', code: 'MHRSD', sector: 'حكومي', region: 'جميع المناطق', transactions: 420, status: 'active' },
  { id: 'GOV-008', name: 'الدفاع المدني', code: 'CD', sector: 'حكومي', region: 'الرياض', transactions: 980, status: 'active' },
  { id: 'GOV-009', name: 'هيئة المساحة الجيولوجية', code: 'SGS', sector: 'حكومي', region: 'جميع المناطق', transactions: 340, status: 'active' },
  { id: 'GOV-010', name: 'الهيئة السعودية للمدن الصناعية', code: 'MODON', sector: 'حكومي', region: 'جميع المناطق', transactions: 590, status: 'active' },
  { id: 'GOV-011', name: 'وزارة البيئة والمياه', code: 'MEWA', sector: 'حكومي', region: 'جميع المناطق', transactions: 470, status: 'active' },
  { id: 'GOV-012', name: 'الهيئة الملكية للجبيل وينبع', code: 'RCJY', sector: 'حكومي', region: 'الشرقية - المدينة', transactions: 620, status: 'active' }
];

const SEMI_GOVERNMENT_ENTITIES = [
  { id: 'SEMI-001', name: 'الهيئة الملكية لمدينة الرياض', code: 'RCRC', sector: 'شبه حكومي', region: 'الرياض', transactions: 1890, status: 'active' },
  { id: 'SEMI-002', name: 'الهيئة السعودية للمهندسين', code: 'SCE', sector: 'شبه حكومي', region: 'جميع المناطق', transactions: 1240, status: 'active' },
  { id: 'SEMI-003', name: 'الهيئة العامة للمنشآت الصغيرة', code: 'MONSHAAT', sector: 'شبه حكومي', region: 'جميع المناطق', transactions: 680, status: 'active' },
  { id: 'SEMI-004', name: 'هيئة تنظيم الكهرباء', code: 'ECRA', sector: 'شبه حكومي', region: 'جميع المناطق', transactions: 420, status: 'active' },
  { id: 'SEMI-005', name: 'هيئة تنظيم المياه', code: 'WRA', sector: 'شبه حكومي', region: 'جميع المناطق', transactions: 530, status: 'active' },
  { id: 'SEMI-006', name: 'هيئة تطوير مكة المكرمة', code: 'MAKKAH-DEV', sector: 'شبه حكومي', region: 'مكة', transactions: 890, status: 'active' },
  { id: 'SEMI-007', name: 'هيئة تطوير المدينة المنورة', code: 'MADINAH-DEV', sector: 'شبه حكومي', region: 'المدينة', transactions: 760, status: 'active' },
  { id: 'SEMI-008', name: 'الهيئة العامة للترفيه', code: 'GEA', sector: 'شبه حكومي', region: 'جميع المناطق', transactions: 340, status: 'active' }
];

const PRIVATE_ENTITIES = [
  { id: 'PVT-001', name: 'مكتب دار الريادة للاستشارات الهندسية', code: 'DRE', sector: 'خاص', region: 'الرياض', transactions: 245, status: 'active' },
  { id: 'PVT-002', name: 'مكتب العمران للاستشارات', code: 'UCC', sector: 'خاص', region: 'الرياض', transactions: 180, status: 'active' },
  { id: 'PVT-003', name: 'مكتب المهندس خالد السعيد', code: 'EKS', sector: 'خاص', region: 'الرياض', transactions: 95, status: 'active' },
  { id: 'PVT-004', name: 'مكتب النخبة الهندسية', code: 'EEC', sector: 'خاص', region: 'جدة', transactions: 156, status: 'active' },
  { id: 'PVT-005', name: 'مكتب الأفق الحديث', code: 'MHC', sector: 'خاص', region: 'الدمام', transactions: 120, status: 'active' },
  { id: 'PVT-006', name: 'مكتب البناء المتقدم', code: 'ABC', sector: 'خاص', region: 'الرياض', transactions: 210, status: 'active' },
  { id: 'PVT-007', name: 'مكتب الإبداع الهندسي', code: 'IEC', sector: 'خاص', region: 'الرياض', transactions: 145, status: 'active' },
  { id: 'PVT-008', name: 'مكتب التطوير الشامل', code: 'CDC', sector: 'خاص', region: 'جدة', transactions: 98, status: 'active' },
  { id: 'PVT-009', name: 'مكتب الخبرة الهندسية', code: 'EXC', sector: 'خاص', region: 'الخبر', transactions: 87, status: 'active' },
  { id: 'PVT-010', name: 'مكتب المستقبل للتصاميم', code: 'FDC', sector: 'خاص', region: 'الرياض', transactions: 165, status: 'active' },
  { id: 'PVT-011', name: 'مكتب الرؤية الحديثة', code: 'MVC', sector: 'خاص', region: 'الرياض', transactions: 132, status: 'active' },
  { id: 'PVT-012', name: 'مكتب الهندسة المتطورة', code: 'AEC', sector: 'خاص', region: 'الرياض', transactions: 178, status: 'active' },
  { id: 'PVT-013', name: 'مكتب الابتكار الهندسي', code: 'INN', sector: 'خاص', region: 'جدة', transactions: 110, status: 'active' },
  { id: 'PVT-014', name: 'مكتب التميز الاستشاري', code: 'ECC', sector: 'خاص', region: 'الرياض', transactions: 145, status: 'active' },
  { id: 'PVT-015', name: 'مكتب الجودة الهندسية', code: 'QEC', sector: 'خاص', region: 'الدمام', transactions: 92, status: 'active' }
];

const COMPANIES = [
  { id: 'COM-001', name: 'شركة بن لادن السعودية', code: 'BINLADIN', sector: 'مقاولات', region: 'جميع المناطق', transactions: 456, status: 'active', employees: 12500 },
  { id: 'COM-002', name: 'شركة السيف للمقاولات', code: 'ALSAIF', sector: 'مقاولات', region: 'الرياض', transactions: 289, status: 'active', employees: 3400 },
  { id: 'COM-003', name: 'شركة العقيل للهندسة', code: 'ALAQEEL', sector: 'هندسي', region: 'الشرقية', transactions: 195, status: 'active', employees: 890 },
  { id: 'COM-004', name: 'شركة الخريف للتطوير', code: 'ALKAREEF', sector: 'عقاري', region: 'الرياض', transactions: 234, status: 'active', employees: 560 },
  { id: 'COM-005', name: 'شركة رتال للتطوير العمراني', code: 'RETAL', sector: 'عقاري', region: 'جميع المناطق', transactions: 378, status: 'active', employees: 1200 },
  { id: 'COM-006', name: 'شركة إعمار المدينة الاقتصادية', code: 'EMAAR-MEC', sector: 'عقاري', region: 'جدة', transactions: 412, status: 'active', employees: 2100 },
  { id: 'COM-007', name: 'شركة دار الأركان', code: 'DAR', sector: 'عقاري', region: 'جميع المناطق', transactions: 523, status: 'active', employees: 1800 },
  { id: 'COM-008', name: 'شركة جبل عمر للتطوير', code: 'JABAL-OMAR', sector: 'عقاري', region: 'مكة', transactions: 345, status: 'active', employees: 950 },
  { id: 'COM-009', name: 'شركة مكة للإنشاء والتعمير', code: 'MCC', sector: 'مقاولات', region: 'مكة', transactions: 267, status: 'active', employees: 2300 },
  { id: 'COM-010', name: 'شركة البابطين للمقاولات', code: 'BABTIN', sector: 'مقاولات', region: 'الشرقية', transactions: 298, status: 'active', employees: 1500 },
  { id: 'COM-011', name: 'شركة النهضة العربية', code: 'NAHDA', sector: 'مقاولات', region: 'الرياض', transactions: 214, status: 'active', employees: 870 },
  { id: 'COM-012', name: 'شركة سيسكو العربية', code: 'SYSCO', sector: 'مقاولات', region: 'جدة', transactions: 189, status: 'active', employees: 650 },
  { id: 'COM-013', name: 'شركة الراجحي للاستثمار العقاري', code: 'RAIC', sector: 'عقاري', region: 'جميع المناطق', transactions: 445, status: 'active', employees: 780 },
  { id: 'COM-014', name: 'شركة المملكة القابضة', code: 'KHC', sector: 'استثماري', region: 'جميع المناطق', transactions: 356, status: 'active', employees: 1200 },
  { id: 'COM-015', name: 'شركة صافولا العقارية', code: 'SAVOLA-RE', sector: 'عقاري', region: 'جدة', transactions: 278, status: 'active', employees: 430 },
  { id: 'COM-016', name: 'شركة الفطيم للإنشاءات', code: 'ALFUTTAIM', sector: 'مقاولات', region: 'الرياض', transactions: 234, status: 'active', employees: 1100 },
  { id: 'COM-017', name: 'شركة الزامل للصناعة', code: 'ZAMIL', sector: 'صناعي', region: 'الشرقية', transactions: 198, status: 'active', employees: 2400 },
  { id: 'COM-018', name: 'شركة العثمان للهندسة', code: 'OTHMAN', sector: 'هندسي', region: 'الرياض', transactions: 167, status: 'active', employees: 580 },
  { id: 'COM-019', name: 'شركة الحكير للاستثمار', code: 'ALHOKAIR', sector: 'استثماري', region: 'الرياض', transactions: 289, status: 'active', employees: 950 },
  { id: 'COM-020', name: 'شركة عبداللطيف جميل العقارية', code: 'ALJ-RE', sector: 'عقاري', region: 'جدة', transactions: 323, status: 'active', employees: 670 }
];

const INDIVIDUALS = [
  { id: 'IND-001', name: 'المهندس عبدالله بن محمد السعيد', license: 'ENG-2015-4567', specialty: 'إنشائي', region: 'الرياض', transactions: 45, status: 'active' },
  { id: 'IND-002', name: 'المهندس فهد بن سعود العتيبي', license: 'ENG-2016-2341', specialty: 'معماري', region: 'الرياض', transactions: 38, status: 'active' },
  { id: 'IND-003', name: 'المهندسة سارة بنت أحمد الغامدي', license: 'ENG-2017-5678', specialty: 'كهربائي', region: 'جدة', transactions: 29, status: 'active' },
  { id: 'IND-004', name: 'المهندس خالد بن عبدالرحمن القحطاني', license: 'ENG-2015-8901', specialty: 'ميكانيكي', region: 'الدمام', transactions: 52, status: 'active' },
  { id: 'IND-005', name: 'المهندس محمد بن فهد الدوسري', license: 'ENG-2018-3456', specialty: 'مدني', region: 'الرياض', transactions: 41, status: 'active' },
  { id: 'IND-006', name: 'المهندسة نورة بنت سعيد الشمري', license: 'ENG-2016-7890', specialty: 'معماري', region: 'الرياض', transactions: 33, status: 'active' },
  { id: 'IND-007', name: 'المهندس أحمد بن محمد العمري', license: 'ENG-2017-2345', specialty: 'إنشائي', region: 'جدة', transactions: 47, status: 'active' },
  { id: 'IND-008', name: 'المهندس سعد بن عبدالله الحربي', license: 'ENG-2019-6789', specialty: 'كهربائي', region: 'الرياض', transactions: 36, status: 'active' },
  { id: 'IND-009', name: 'المهندسة منى بنت فهد الزهراني', license: 'ENG-2016-1234', specialty: 'معماري', region: 'مكة', transactions: 28, status: 'active' },
  { id: 'IND-010', name: 'المهندس ماجد بن سلمان المطيري', license: 'ENG-2018-5678', specialty: 'مدني', region: 'الرياض', transactions: 44, status: 'active' },
  { id: 'IND-011', name: 'المهندس طارق بن محمد الأحمدي', license: 'ENG-2017-9012', specialty: 'إنشائي', region: 'الدمام', transactions: 39, status: 'active' },
  { id: 'IND-012', name: 'المهندسة ريم بنت عبدالرحمن السديري', license: 'ENG-2019-3456', specialty: 'كهربائي', region: 'الرياض', transactions: 31, status: 'active' },
  { id: 'IND-013', name: 'المهندس بدر بن خالد العنزي', license: 'ENG-2015-7890', specialty: 'ميكانيكي', region: 'حائل', transactions: 42, status: 'active' },
  { id: 'IND-014', name: 'المهندس يوسف بن أحمد الشهري', license: 'ENG-2018-1234', specialty: 'معماري', region: 'أبها', transactions: 35, status: 'active' },
  { id: 'IND-015', name: 'المهندسة هند بنت سعيد الغامدي', license: 'ENG-2016-5678', specialty: 'مدني', region: 'الباحة', transactions: 27, status: 'active' },
  { id: 'IND-016', name: 'المهندس عمر بن فهد القرني', license: 'ENG-2017-9012', specialty: 'إنشائي', region: 'الطائف', transactions: 40, status: 'active' },
  { id: 'IND-017', name: 'المهندس سلطان بن محمد الشمري', license: 'ENG-2019-2345', specialty: 'كهربائي', region: 'حائل', transactions: 34, status: 'active' },
  { id: 'IND-018', name: 'المهندسة عبير بنت خالد العتيبي', license: 'ENG-2016-6789', specialty: 'معماري', region: 'الرياض', transactions: 30, status: 'active' },
  { id: 'IND-019', name: 'المهندس وليد بن سعد الدوسري', license: 'ENG-2018-1234', specialty: 'مدني', region: 'الخرج', transactions: 37, status: 'active' },
  { id: 'IND-020', name: 'المهندس فيصل بن عبدالله السالم', license: 'ENG-2017-5678', specialty: 'إنشائي', region: 'الرياض', transactions: 43, status: 'active' },
  { id: 'IND-021', name: 'المهندسة لطيفة بنت محمد الحربي', license: 'ENG-2019-9012', specialty: 'كهربائي', region: 'جدة', transactions: 29, status: 'active' },
  { id: 'IND-022', name: 'المهندس راشد بن سعود القحطاني', license: 'ENG-2016-3456', specialty: 'ميكانيكي', region: 'الدمام', transactions: 41, status: 'active' },
  { id: 'IND-023', name: 'المهندس ناصر بن فهد العمري', license: 'ENG-2018-7890', specialty: 'معماري', region: 'الرياض', transactions: 36, status: 'active' },
  { id: 'IND-024', name: 'المهندسة جواهر بنت أحمد الزهراني', license: 'ENG-2017-2345', specialty: 'مدني', region: 'الطائف', transactions: 32, status: 'active' },
  { id: 'IND-025', name: 'المهندس عادل بن محمد المطيري', license: 'ENG-2019-6789', specialty: 'إنشائي', region: 'الرياض', transactions: 46, status: 'active' }
];

const NON_PROFIT_ENTITIES = [
  { id: 'NPO-001', name: 'جمعية المهندسين السعوديين', code: 'SCE', sector: 'مهني', region: 'جميع المناطق', transactions: 890, status: 'active', members: 45000 },
  { id: 'NPO-002', name: 'جمعية المقاولين السعوديين', code: 'SCA', sector: 'مهني', region: 'جميع المناطق', transactions: 560, status: 'active', members: 12000 },
  { id: 'NPO-003', name: 'جمعية العمران السعودية', code: 'SUS', sector: 'تطوعي', region: 'جميع المناطق', transactions: 340, status: 'active', members: 8500 },
  { id: 'NPO-004', name: 'جمعية حماية البيئة', code: 'EPA', sector: 'بيئي', region: 'جميع المناطق', transactions: 280, status: 'active', members: 5600 },
  { id: 'NPO-005', name: 'جمعية التخطيط العمراني', code: 'UPS', sector: 'مهني', region: 'جميع المناطق', transactions: 420, status: 'active', members: 9800 },
  { id: 'NPO-006', name: 'جمعية الإسكان الخيري', code: 'CHA', sector: 'خيري', region: 'جميع المناطق', transactions: 670, status: 'active', members: 15000 },
  { id: 'NPO-007', name: 'جمعية العمارة السعودية', code: 'SAA', sector: 'مهني', region: 'جميع المناطق', transactions: 390, status: 'active', members: 7200 },
  { id: 'NPO-008', name: 'جمعية الحفاظ على التراث', code: 'HPS', sector: 'تراثي', region: 'جميع المناطق', transactions: 230, status: 'active', members: 4300 },
  { id: 'NPO-009', name: 'جمعية البناء الأخضر', code: 'GBC', sector: 'بيئي', region: 'جميع المناطق', transactions: 310, status: 'active', members: 6100 },
  { id: 'NPO-010', name: 'جمعية التنمية المستدامة', code: 'SDA', sector: 'تنموي', region: 'جميع المناطق', transactions: 450, status: 'active', members: 10500 }
];

const SECTORS = [
  { id: 'SEC-001', name: 'القطاع الشمالي', code: 'NORTH', entities: 45, transactions: 1234, activeProjects: 89, region: 'الرياض' },
  { id: 'SEC-002', name: 'القطاع الجنوبي', code: 'SOUTH', entities: 38, transactions: 987, activeProjects: 67, region: 'الرياض' },
  { id: 'SEC-003', name: 'القطاع الشرقي', code: 'EAST', entities: 52, transactions: 1456, activeProjects: 95, region: 'الرياض' },
  { id: 'SEC-004', name: 'القطاع الغربي', code: 'WEST', entities: 41, transactions: 1123, activeProjects: 78, region: 'الرياض' },
  { id: 'SEC-005', name: 'قطاع الوسط', code: 'CENTER', entities: 67, transactions: 1890, activeProjects: 112, region: 'الرياض' },
  { id: 'SEC-006', name: 'قطاع النهضة', code: 'NAHDA', entities: 29, transactions: 756, activeProjects: 54, region: 'الرياض' },
  { id: 'SEC-007', name: 'قطاع العريجاء', code: 'AREEYA', entities: 35, transactions: 892, activeProjects: 61, region: 'الرياض' },
  { id: 'SEC-008', name: 'قطاع الشفا', code: 'SHIFA', entities: 43, transactions: 1045, activeProjects: 72, region: 'الرياض' },
  { id: 'SEC-009', name: 'قطاع العزيزية', code: 'AZIZIYAH', entities: 31, transactions: 834, activeProjects: 58, region: 'الرياض' },
  { id: 'SEC-010', name: 'قطاع الملك فهد', code: 'KF', entities: 56, transactions: 1567, activeProjects: 98, region: 'الرياض' },
  { id: 'SEC-011', name: 'قطاع الملك عبدالله', code: 'KA', entities: 48, transactions: 1378, activeProjects: 87, region: 'الرياض' },
  { id: 'SEC-012', name: 'قطاع الملك سلمان', code: 'KS', entities: 39, transactions: 1012, activeProjects: 69, region: 'الرياض' },
  { id: 'SEC-013', name: 'قطاع ديراب', code: 'DIRAB', entities: 27, transactions: 678, activeProjects: 49, region: 'الرياض' }
];

const CONTACTS = Array.from({ length: 50 }, (_, i) => ({
  id: `CONT-${String(i + 1).padStart(3, '0')}`,
  name: `${['م. عبدالله', 'د. فهد', 'أ. سارة', 'م. خالد', 'د. نورة'][i % 5]} ${['السعيد', 'العتيبي', 'الغامدي', 'القحطاني', 'الدوسري'][Math.floor(i / 5) % 5]}`,
  position: ['مدير عام', 'مدير إدارة', 'رئيس قسم', 'مهندس أول', 'مستشار'][i % 5],
  entity: [GOVERNMENT_ENTITIES, SEMI_GOVERNMENT_ENTITIES, PRIVATE_ENTITIES, COMPANIES][i % 4][Math.floor(i / 4) % 12]?.name || 'جهة غير محددة',
  phone: `050${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
  email: `contact${i + 1}@entity.com`,
  department: ['الهندسة', 'المالية', 'التراخيص', 'التخطيط', 'الفحص'][i % 5],
  status: i % 7 === 0 ? 'inactive' : 'active'
}));

const ExternalEntities_Complete_818_v8: React.FC = () => {
  const [activeTab, setActiveTab] = useState('818-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // نموذج إضافة جهة (5 خطوات)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    code: '',
    type: '',
    category: '',
    region: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
    services: [] as string[],
    certifications: [] as string[],
    status: 'active'
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case '818-01':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-2">
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>12</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جهات حكومية</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Award className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>8</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>شبه حكومية</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <Briefcase className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>15</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جهات خاصة</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Building className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>20</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>شركات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>25</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أفراد</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
                <CardContent className="p-2 text-center">
                  <Award className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#c2410c' }}>10</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>غير ربحية</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', border: '2px solid #c084fc' }}>
                <CardContent className="p-2 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c3aed' }}>13</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قطاعات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', border: '2px solid #5eead4' }}>
                <CardContent className="p-2 text-center">
                  <UserCheck className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0f766e' }}>50</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جهات اتصال</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإحصائيات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3" style={{ background: '#f0f9ff', borderRadius: '8px' }}>
                    <Database className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>14,680</p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المعاملات</p>
                  </div>
                  <div className="text-center p-3" style={{ background: '#f0fdf4', borderRadius: '8px' }}>
                    <Activity className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>1,245</p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معاملات نشطة</p>
                  </div>
                  <div className="text-center p-3" style={{ background: '#fefce8', borderRadius: '8px' }}>
                    <Users className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                    <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#ca8a04' }}>2,890</p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>العملاء</p>
                  </div>
                  <div className="text-center p-3" style={{ background: '#fdf2f8', borderRadius: '8px' }}>
                    <DollarSign className="h-6 w-6 mx-auto text-pink-600 mb-2" />
                    <p className="text-2xl mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>234.5M</p>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيمة المعاملات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '818-02':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات الحكومية ({GOVERNMENT_ENTITIES.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#2563eb' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة جهة حكومية
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنطقة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GOVERNMENT_ENTITIES.map((entity, index) => (
                      <TableRow key={entity.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.code}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.region}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-03':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات شبه الحكومية ({SEMI_GOVERNMENT_ENTITIES.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#4f46e5' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة جهة
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنطقة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SEMI_GOVERNMENT_ENTITIES.map((entity, index) => (
                      <TableRow key={entity.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.code}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.region}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-04':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات الخاصة ({PRIVATE_ENTITIES.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#15803d' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة جهة خاصة
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنطقة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PRIVATE_ENTITIES.map((entity, index) => (
                      <TableRow key={entity.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.code}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.region}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-05':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الشركات ({COMPANIES.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#b45309' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة شركة
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموظفين</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COMPANIES.map((company, index) => (
                      <TableRow key={company.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{company.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{company.code}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{company.sector}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{company.employees.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{company.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-06':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأفراد ({INDIVIDUALS.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#be185d' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة فرد
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>رقم الترخيص</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التخصص</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المنطقة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INDIVIDUALS.map((individual, index) => (
                      <TableRow key={individual.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{individual.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{individual.license}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{individual.specialty}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{individual.region}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{individual.transactions}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-07':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات غير الربحية ({NON_PROFIT_ENTITIES.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#c2410c' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة جهة
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأعضاء</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {NON_PROFIT_ENTITIES.map((entity, index) => (
                      <TableRow key={entity.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.code}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.sector}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.members.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{entity.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-08':
        return (
          <div className="space-y-3">
            <Card className="card-element card-rtl" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)', border: '2px solid #fcd34d' }}>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Zap className="h-4 w-4 text-amber-600" />
                  إضافة جهة خارجية جديدة - خطوة {currentStep} من 5
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="mb-3">
                  <Progress value={currentStep * 20} className="h-2" />
                </div>

                {currentStep === 1 && (
                  <div className="space-y-3">
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعلومات الأساسية</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الاسم بالعربية *"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="مثال: وزارة الشؤون البلدية"
                        required
                        copyable={false}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="الاسم بالإنجليزية"
                        id="nameEn"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        placeholder="Ex: Ministry of Municipal Affairs"
                        copyable={false}
                        clearable={true}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الكود *"
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="مثال: MOMRA"
                        required
                        copyable={false}
                        clearable={true}
                      />
                      <SelectWithCopy
                        label="النوع *"
                        id="type"
                        value={formData.type}
                        onChange={(value) => setFormData({ ...formData, type: value })}
                        options={[
                          { value: 'government', label: 'جهة حكومية' },
                          { value: 'semi-government', label: 'شبه حكومية' },
                          { value: 'private', label: 'خاصة' },
                          { value: 'company', label: 'شركة' },
                          { value: 'individual', label: 'فرد' },
                          { value: 'non-profit', label: 'غير ربحية' }
                        ]}
                        copyable={false}
                        clearable={false}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموقع والمنطقة</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <SelectWithCopy
                        label="المنطقة *"
                        id="region"
                        value={formData.region}
                        onChange={(value) => setFormData({ ...formData, region: value })}
                        options={[
                          { value: 'riyadh', label: 'الرياض' },
                          { value: 'makkah', label: 'مكة المكرمة' },
                          { value: 'madinah', label: 'المدينة المنورة' },
                          { value: 'eastern', label: 'الشرقية' },
                          { value: 'all', label: 'جميع المناطق' }
                        ]}
                        copyable={false}
                        clearable={false}
                      />
                      <InputWithCopy
                        label="المدينة"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="مثال: الرياض"
                        copyable={false}
                        clearable={true}
                      />
                    </div>
                    <TextAreaWithCopy
                      label="العنوان"
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      placeholder="العنوان التفصيلي..."
                      copyable={false}
                      clearable={true}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات الاتصال</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="الهاتف *"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="011-XXXXXXX"
                        required
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="البريد الإلكتروني *"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="info@entity.gov.sa"
                        required
                        copyable={true}
                        clearable={true}
                      />
                    </div>
                    <InputWithCopy
                      label="الموقع الإلكتروني"
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.entity.gov.sa"
                      copyable={true}
                      clearable={true}
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>جهة الاتصال الرئيسية</h4>
                    <InputWithCopy
                      label="الاسم *"
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="مثال: د. خالد العتيبي"
                      required
                      copyable={false}
                      clearable={true}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <InputWithCopy
                        label="هاتف جهة الاتصال *"
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="05XXXXXXXX"
                        required
                        copyable={true}
                        clearable={true}
                      />
                      <InputWithCopy
                        label="البريد الإلكتروني *"
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="contact@entity.gov.sa"
                        required
                        copyable={true}
                        clearable={true}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-3">
                    <h4 className="text-sm mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>معلومات إضافية</h4>
                    <TextAreaWithCopy
                      label="الوصف"
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="وصف مختصر عن الجهة..."
                      copyable={false}
                      clearable={true}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <EnhancedSwitch
                          id="status"
                          checked={formData.status === 'active'}
                          onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                          label="حالة الجهة"
                          description="تفعيل أو إيقاف الجهة"
                          variant="success"
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      السابق
                    </Button>
                  )}
                  {currentStep < 5 ? (
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      style={{ background: '#2563eb' }}
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      التالي
                      <ChevronRight className="h-3 w-3 mr-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      style={{ background: '#15803d' }}
                      onClick={() => {
                        toast.success('تم إضافة الجهة بنجاح');
                        setCurrentStep(1);
                        setFormData({
                          name: '', nameEn: '', code: '', type: '', category: '', region: '', city: '',
                          phone: '', email: '', website: '', address: '', contactPerson: '', contactPhone: '',
                          contactEmail: '', description: '', services: [], certifications: [], status: 'active'
                        });
                      }}
                    >
                      <Save className="h-3 w-3 ml-1" />
                      حفظ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case '818-09':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>القطاعات ({SECTORS.length})</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#7c3aed' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة قطاع
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المشاريع النشطة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SECTORS.map((sector, index) => (
                      <TableRow key={sector.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{sector.name}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{sector.code}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{sector.entities}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{sector.transactions.toLocaleString('ar-SA')}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{sector.activeProjects}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-10':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>جهات الاتصال ({CONTACTS.length})</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
                <Button size="sm" className="h-8 text-xs" style={{ background: '#0f766e' }}>
                  <Plus className="h-3 w-3 ml-1" />
                  إضافة جهة اتصال
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المسمى الوظيفي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>القسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CONTACTS.slice(0, 20).map((contact, index) => (
                      <TableRow key={contact.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contact.name}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contact.position}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contact.entity}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{contact.department}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{contact.phone}</TableCell>
                        <TableCell className="text-right text-xs">{contact.email}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: contact.status === 'active' ? '#10b981' : '#6b7280', color: '#ffffff' }}>
                            {contact.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-11':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراكز مدينتي (12 مركز)</h3>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#0f766e' }}>
                <Plus className="h-3 w-3 ml-1" />
                إضافة مركز
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', border: '2px solid #5eead4' }}>
                <CardContent className="p-2 text-center">
                  <Navigation className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0f766e' }}>12</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي المراكز</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>12</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مراكز نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Calendar className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>109</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مواعيد حالية</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <History className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>1,804</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>مواعيد سابقة</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <FileText className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>2,431</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>12</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>أحياء مغطاة</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>اسم المركز</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحي</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الهاتف</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>البريد</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مواعيد حالية</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>مواعيد سابقة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 'MADT-001', name: 'مكتب مدينتي - الخليج', neighborhood: 'حي الخليج', address: 'حي الخليج، شارع الأمير محمد بن سلمان', phone: '011-2345601', email: 'khalij@madinaty.sa', current: 18, previous: 245, transactions: 312 },
                      { id: 'MADT-002', name: 'مكتب مدينتي - قرطبة', neighborhood: 'حي قرطبة', address: 'حي قرطبة، شارع الملك عبدالله', phone: '011-2345602', email: 'qurtubah@madinaty.sa', current: 15, previous: 198, transactions: 278 },
                      { id: 'MADT-003', name: 'مكتب مدينتي - العقيق', neighborhood: 'حي العقيق', address: 'حي العقيق، شارع عمر بن الخطاب', phone: '011-2345603', email: 'alaqeeq@madinaty.sa', current: 22, previous: 287, transactions: 356 },
                      { id: 'MADT-004', name: 'مكتب مدينتي - النفل', neighborhood: 'حي النفل', address: 'حي النفل، طريق الملك فهد', phone: '011-2345604', email: 'alnafal@madinaty.sa', current: 12, previous: 156, transactions: 189 },
                      { id: 'MADT-005', name: 'مكتب مدينتي - المغرزات', neighborhood: 'حي المغرزات', address: 'حي المغرزات، شارع الأمير سلطان', phone: '011-2345605', email: 'almughrizat@madinaty.sa', current: 19, previous: 221, transactions: 298 },
                      { id: 'MADT-006', name: 'مكتب مدينتي - المعذر', neighborhood: 'حي الناصرية', address: 'حي الناصرية، شارع التحلية', phone: '011-2345606', email: 'almoathar@madinaty.sa', current: 14, previous: 178, transactions: 214 },
                      { id: 'MADT-007', name: 'مكتب مدينتي - المنصورة', neighborhood: 'حي المنصورة', address: 'حي المنصورة، شارع الإمام سعود', phone: '011-2345607', email: 'almansoura@madinaty.sa', current: 11, previous: 134, transactions: 167 },
                      { id: 'MADT-008', name: 'مكتب مدينتي - ظهرة لبن', neighborhood: 'حي ظهرة لبن', address: 'حي ظهرة لبن، طريق الملك خالد', phone: '011-2345608', email: 'dhahrat@madinaty.sa', current: 9, previous: 112, transactions: 145 },
                      { id: 'MADT-009', name: 'مكتب مدينتي - طويق', neighborhood: 'حي العريجاء', address: 'حي العريجاء، شارع الأمير تركي', phone: '011-2345609', email: 'tuwaiq@madinaty.sa', current: 8, previous: 98, transactions: 123 },
                      { id: 'MADT-010', name: 'مكتب مدينتي - السلام', neighborhood: 'حي السلام', address: 'حي السلام، شارع الملك فيصل', phone: '011-2345610', email: 'alsalam@madinaty.sa', current: 7, previous: 89, transactions: 98 },
                      { id: 'MADT-011', name: 'مكتب مدينتي - عكاظ', neighborhood: 'حي عكاظ', address: 'حي عكاظ، شارع الأمير ناصر', phone: '011-2345611', email: 'okaz@madinaty.sa', current: 5, previous: 56, transactions: 67 },
                      { id: 'MADT-012', name: 'مكتب مدينتي - الحائر', neighborhood: 'حي الحائر', address: 'حي الحائر، طريق الجنوب', phone: '011-2345612', email: 'alhair@madinaty.sa', current: 3, previous: 30, transactions: 44 }
                    ].map((center, index) => (
                      <TableRow key={center.id}>
                        <TableCell className="text-right text-xs font-mono">{index + 1}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.name}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.neighborhood}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{center.address}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{center.phone}</TableCell>
                        <TableCell className="text-right text-xs">{center.email}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{center.current}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{center.previous}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{center.transactions}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-[10px]" style={{ background: '#10b981', color: '#ffffff' }}>نشط</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <MapPin className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-12':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقارير</h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'تقرير شامل بجميع الجهات', icon: FileText, color: '#2563eb' },
                { name: 'تقرير الجهات حسب النوع', icon: Layers, color: '#15803d' },
                { name: 'تقرير المعاملات حسب الجهة', icon: TrendingUp, color: '#b45309' },
                { name: 'تقرير الإحصائيات الشهرية', icon: BarChart3, color: '#be185d' },
                { name: 'تقرير جهات الاتصال', icon: UserCheck, color: '#4f46e5' },
                { name: 'تقرير القطاعات', icon: MapPin, color: '#7c3aed' },
                { name: 'تقرير السجل الزمني', icon: History, color: '#c2410c' },
                { name: 'تقرير مقارن سنوي', icon: Activity, color: '#0f766e' }
              ].map((report, index) => (
                <Card key={index} className="card-element card-rtl cursor-pointer hover:shadow-lg transition-all" style={{ background: `${report.color}10`, border: `2px solid ${report.color}40` }}>
                  <CardContent className="p-3 text-center">
                    <report.icon className="h-8 w-8 mx-auto mb-2" style={{ color: report.color }} />
                    <p className="text-xs mb-2" style={{ fontFamily: 'Tajawal, sans-serif', color: report.color }}>{report.name}</p>
                    <div className="flex gap-1 justify-center">
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        <Eye className="h-2.5 w-2.5 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]">
                        <Download className="h-2.5 w-2.5 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case '818-13':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-2">
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
                <CardContent className="p-2 text-center">
                  <Database className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1e40af' }}>90</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي الجهات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
                <CardContent className="p-2 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#15803d' }}>85</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جهات نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
                <CardContent className="p-2 text-center">
                  <Activity className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#b45309' }}>14,680</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معاملات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
                <CardContent className="p-2 text-center">
                  <Zap className="h-5 w-5 mx-auto text-indigo-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#4f46e5' }}>1,245</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>نشطة</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
                <CardContent className="p-2 text-center">
                  <Users className="h-5 w-5 mx-auto text-pink-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#be185d' }}>2,890</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>عملاء</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', border: '2px solid #5eead4' }}>
                <CardContent className="p-2 text-center">
                  <UserCheck className="h-5 w-5 mx-auto text-teal-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#0f766e' }}>50</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>جهات اتصال</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', border: '2px solid #c084fc' }}>
                <CardContent className="p-2 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#7c3aed' }}>13</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قطاعات</p>
                </CardContent>
              </Card>
              <Card className="card-element" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
                <CardContent className="p-2 text-center">
                  <DollarSign className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                  <p className="text-xl mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif', color: '#c2410c' }}>234M</p>
                  <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>القيمة</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>توزيع الجهات حسب النوع</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="space-y-2">
                    {[
                      { label: 'حكومية', value: 12, color: '#2563eb', percentage: 13.3 },
                      { label: 'شبه حكومية', value: 8, color: '#4f46e5', percentage: 8.9 },
                      { label: 'خاصة', value: 15, color: '#15803d', percentage: 16.7 },
                      { label: 'شركات', value: 20, color: '#b45309', percentage: 22.2 },
                      { label: 'أفراد', value: 25, color: '#be185d', percentage: 27.8 },
                      { label: 'غير ربحية', value: 10, color: '#c2410c', percentage: 11.1 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>{item.label}</span>
                          <span className="text-xs font-mono" style={{ color: item.color }}>{item.value} ({item.percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-1.5" style={{ background: `${item.color}30` }} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-element card-rtl">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>أكثر 5 جهات نشاطاً</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <Table className="table-rtl">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                        <TableHead className="text-right text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: 'الهيئة العامة للعقار', transactions: 3200 },
                        { name: 'أمانة منطقة الرياض', transactions: 2380 },
                        { name: 'الهيئة الملكية لمدينة الرياض', transactions: 1890 },
                        { name: 'وزارة الشؤون البلدية', transactions: 1450 },
                        { name: 'وزارة العدل', transactions: 1560 }
                      ].map((entity, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-right text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif' }}>{entity.name}</TableCell>
                          <TableCell className="text-right text-[10px] font-mono">{entity.transactions.toLocaleString('ar-SA')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case '818-14':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>سجل الأحداث (100 سجل)</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Filter className="h-3 w-3 ml-1" />
                  تصفية
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Download className="h-3 w-3 ml-1" />
                  تصدير
                </Button>
              </div>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الوقت</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحدث</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجهة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 30 }, (_, i) => ({
                      id: i + 1,
                      date: '2025-11-03',
                      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                      event: ['إضافة جهة', 'تعديل بيانات', 'حذف جهة', 'تغيير حالة', 'إضافة جهة اتصال'][i % 5],
                      entity: GOVERNMENT_ENTITIES[i % GOVERNMENT_ENTITIES.length].name,
                      user: ['أحمد محمد', 'سارة علي', 'خالد السعيد'][i % 3],
                      type: ['create', 'update', 'delete', 'status', 'contact'][i % 5]
                    })).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-right text-xs font-mono">{log.id}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{log.date}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{log.time}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.event}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.entity}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{log.user}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className="text-[10px]"
                            style={{
                              background: log.type === 'create' ? '#15803d' : log.type === 'update' ? '#2563eb' : log.type === 'delete' ? '#dc2626' : '#b45309',
                              color: '#ffffff'
                            }}
                          >
                            {log.type === 'create' ? 'إضافة' : log.type === 'update' ? 'تعديل' : log.type === 'delete' ? 'حذف' : 'أخرى'}
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

      case '818-15':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأرشيف ({15} جهة)</h3>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <RefreshCw className="h-3 w-3 ml-1" />
                استعادة الكل
              </Button>
            </div>

            <Card className="card-element card-rtl">
              <CardContent className="p-2">
                <Table className="table-rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>#</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الأرشفة</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستخدم</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>السبب</TableHead>
                      <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 15 }, (_, i) => ({
                      id: i + 1,
                      name: `جهة مؤرشفة ${i + 1}`,
                      type: ['حكومية', 'خاصة', 'شركة'][i % 3],
                      date: '2024-10-15',
                      user: ['أحمد محمد', 'سارة علي'][i % 2],
                      reason: ['غير نشطة', 'دمج مع جهة أخرى', 'إغلاق'][i % 3]
                    })).map((archived) => (
                      <TableRow key={archived.id}>
                        <TableCell className="text-right text-xs font-mono">{archived.id}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{archived.name}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{archived.type}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{archived.date}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{archived.user}</TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>{archived.reason}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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

      case '818-16':
        return (
          <div className="space-y-3">
            <h3 className="text-base mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإعدادات</h3>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderBottom: '2px solid #93c5fd' }}>
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Database className="h-4 w-4 text-blue-600" />
                  إعدادات قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="auto-sync"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="المزامنة التلقائية"
                    description="مزامنة البيانات تلقائياً مع الجهات"
                    variant="success"
                    size="md"
                  />
                  <EnhancedSwitch
                    id="cache-entities"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="تخزين مؤقت للجهات"
                    description="تحسين الأداء عبر التخزين المؤقت"
                    variant="default"
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderBottom: '2px solid #86efac' }}>
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Bell className="h-4 w-4 text-green-600" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <EnhancedSwitch
                    id="notify-new-entity"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="إشعار عند إضافة جهة"
                    variant="success"
                    size="md"
                  />
                  <EnhancedSwitch
                    id="notify-update"
                    checked={true}
                    onCheckedChange={() => {}}
                    label="إشعار عند تحديث بيانات"
                    variant="default"
                    size="md"
                  />
                  <EnhancedSwitch
                    id="notify-status"
                    checked={false}
                    onCheckedChange={() => {}}
                    label="إشعار عند تغيير الحالة"
                    variant="warning"
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-element card-rtl">
              <CardHeader className="p-3 pb-2" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderBottom: '2px solid #fcd34d' }}>
                <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <Download className="h-4 w-4 text-amber-600" />
                  إعدادات التصدير
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <SelectWithCopy
                    label="تنسيق التصدير الافتراضي"
                    id="export-format"
                    value="excel"
                    onChange={() => {}}
                    options={[
                      { value: 'excel', label: 'Excel' },
                      { value: 'pdf', label: 'PDF' },
                      { value: 'csv', label: 'CSV' }
                    ]}
                    copyable={false}
                    clearable={false}
                  />
                  <EnhancedSwitch
                    id="include-archived"
                    checked={false}
                    onCheckedChange={() => {}}
                    label="تضمين المؤرشف"
                    description="تضمين الجهات المؤرشفة في التصدير"
                    variant="warning"
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <RotateCcw className="h-3 w-3 ml-1" />
                إعادة تعيين
              </Button>
              <Button size="sm" className="h-8 text-xs" style={{ background: '#15803d' }}>
                <Save className="h-3 w-3 ml-1" />
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        );

      default:
        return <div className="p-8 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاب قيد التطوير...</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#fafbfc' }}>
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
              <Building 
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
                  إدارة الجهات الخارجية
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
                    818
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
                نظام شامل لإدارة جميع الجهات الحكومية والخاصة والأفراد
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
                16 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ gap: '4px', paddingTop: '16px' }}>
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 overflow-auto px-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ExternalEntities_Complete_818_v8;
