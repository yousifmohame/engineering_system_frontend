/**
 * التاب 286-02 - تفاصيل المعاملة الشاملة - شامل ومكثف
 * =========================================================
 * 
 * المميزات:
 * - بطاقات تفاعلية لأنواع المعاملات
 * - تفاصيل شاملة لكل نوع
 * - جدول المهام الافتراضية
 * - المتطلبات والمستندات
 * - الجهات ذات العلاقة
 * - الرسوم المتوقعة
 * - المراحل والخطوات
 * - الملفات المطلوبة
 * - التحذيرات والملاحظات
 * - معاينة تفصيلية قبل الاختيار
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  Target, FileText, Clock, DollarSign, CheckCircle, AlertCircle,
  Users, Building, MapPin, Briefcase, Settings, Calendar, Eye,
  ChevronRight, Search, Filter, X, List, Layers, Shield, Hash,
  TrendingUp, Activity, FileCheck, Paperclip, Info
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';

interface TransactionType {
  id: string;
  name: string;
  code: string;
  category: string;
  categoryAr: string;
  description: string;
  duration: number;
  estimatedCost: number;
  complexity: 'simple' | 'medium' | 'complex';
  tasks: TransactionTask[];
  documents: string[];
  authorities: string[];
  fees: TransactionFee[];
  stages: TransactionStage[];
  warnings: string[];
  notes: string[];
}

interface TransactionTask {
  id: string;
  name: string;
  duration: number;
  role: string;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[];
}

interface TransactionFee {
  name: string;
  amount: number;
  authority: string;
  required: boolean;
}

interface TransactionStage {
  id: string;
  name: string;
  duration: number;
  tasks: number;
}

interface Props {
  onSelect?: (typeId: string) => void;
  selectedType?: string;
}

const Tab_286_02_TransactionDetails_Complete: React.FC<Props> = ({ 
  onSelect,
  selectedType 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // أنواع المعاملات الشاملة
  const transactionTypes: TransactionType[] = [
    {
      id: 'building_permit',
      name: 'ترخيص بناء',
      code: 'BP',
      category: 'licenses',
      categoryAr: 'التراخيص',
      description: 'إصدار ترخيص بناء جديد لمشروع سكني أو تجاري أو صناعي',
      duration: 30,
      estimatedCost: 15000,
      complexity: 'complex',
      tasks: [
        { id: 't1', name: 'استقبال الطلب ومراجعة المستندات', duration: 1, role: 'موظف استقبال', priority: 'high', dependencies: [] },
        { id: 't2', name: 'فحص الموقع والمعاينة الميدانية', duration: 3, role: 'مهندس معاين', priority: 'high', dependencies: ['t1'] },
        { id: 't3', name: 'مراجعة المخططات المعمارية', duration: 5, role: 'مهندس معماري', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'مراجعة المخططات الإنشائية', duration: 4, role: 'مهندس إنشائي', priority: 'high', dependencies: ['t3'] },
        { id: 't5', name: 'مراجعة الأنظمة الكهربائية والميكانيكية', duration: 3, role: 'مهندس MEP', priority: 'medium', dependencies: ['t4'] },
        { id: 't6', name: 'الحصول على موافقة الدفاع المدني', duration: 7, role: 'منسق جهات', priority: 'high', dependencies: ['t5'] },
        { id: 't7', name: 'الحصول على موافقة البلدية', duration: 5, role: 'منسق جهات', priority: 'high', dependencies: ['t6'] },
        { id: 't8', name: 'إصدار الترخيص النهائي', duration: 2, role: 'مدير معاملات', priority: 'high', dependencies: ['t7'] },
      ],
      documents: [
        'صورة الصك',
        'صورة الهوية الوطنية',
        'المخططات المعمارية المعتمدة',
        'المخططات الإنشائية المعتمدة',
        'مخططات الكهرباء والتكييف',
        'التقرير الجيوتقني',
        'خطاب تفويض (إن وجد)',
        'الموافقات المبدئية من الجهات'
      ],
      authorities: [
        'البلدية',
        'الدفاع المدني',
        'وزارة البلديات',
        'هيئة الهلال الأحمر',
        'شركة الكهرباء',
        'شركة المياه'
      ],
      fees: [
        { name: 'رسوم البلدية', amount: 5000, authority: 'البلدية', required: true },
        { name: 'رسوم الدفاع المدني', amount: 2000, authority: 'الدفاع المدني', required: true },
        { name: 'رسوم الترخيص', amount: 3000, authority: 'وزارة البلديات', required: true },
        { name: 'رسوم إضافية', amount: 500, authority: 'متنوعة', required: false }
      ],
      stages: [
        { id: 's1', name: 'الاستقبال والمراجعة الأولية', duration: 2, tasks: 2 },
        { id: 's2', name: 'المراجعة الفنية', duration: 12, tasks: 3 },
        { id: 's3', name: 'الحصول على الموافقات', duration: 12, tasks: 2 },
        { id: 's4', name: 'الإصدار النهائي', duration: 4, tasks: 1 }
      ],
      warnings: [
        'يجب التأكد من صحة الصك وعدم وجود نزاعات',
        'المخططات يجب أن تكون معتمدة من مهندس معتمد',
        'التقرير الجيوتقني لا يتجاوز 6 أشهر',
        'يجب الحصول على موافقة الدفاع المدني قبل البلدية'
      ],
      notes: [
        'الفترة المذكورة تقريبية وقد تختلف حسب الجهات',
        'بعض المشاريع قد تحتاج موافقات إضافية',
        'يُنصح بمراجعة الاشتراطات المحلية للبلدية'
      ]
    },
    {
      id: 'subdivision',
      name: 'إفراز',
      code: 'SD',
      category: 'properties',
      categoryAr: 'العقارات',
      description: 'تقسيم قطعة أرض إلى قطع متعددة وإصدار صكوك منفصلة',
      duration: 25,
      estimatedCost: 12000,
      complexity: 'medium',
      tasks: [
        { id: 't1', name: 'استلام الطلب ومراجعة الصك', duration: 1, role: 'موظف استقبال', priority: 'high', dependencies: [] },
        { id: 't2', name: 'الكشف الميداني على الأرض', duration: 2, role: 'مساح', priority: 'high', dependencies: ['t1'] },
        { id: 't3', name: 'إعداد المخطط التقسيمي', duration: 5, role: 'مهندس مساحة', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'مراجعة المخطط مع البلدية', duration: 7, role: 'منسق جهات', priority: 'high', dependencies: ['t3'] },
        { id: 't5', name: 'الحصول على موافقة البلدية', duration: 7, role: 'منسق جهات', priority: 'high', dependencies: ['t4'] },
        { id: 't6', name: 'إعداد الصكوك الجديدة', duration: 3, role: 'محامي', priority: 'medium', dependencies: ['t5'] },
      ],
      documents: [
        'صورة الصك الأم',
        'صورة الهوية الوطنية',
        'كروكي الموقع',
        'الإحداثيات المساحية',
        'خطاب تفويض (إن وجد)'
      ],
      authorities: [
        'البلدية',
        'وزارة العدل (كتابة العدل)',
        'وزارة البلديات'
      ],
      fees: [
        { name: 'رسوم البلدية', amount: 3000, authority: 'البلدية', required: true },
        { name: 'رسوم كتابة العدل', amount: 2000, authority: 'وزارة العدل', required: true },
        { name: 'رسوم المساحة', amount: 4000, authority: 'مكتب مساحة', required: true }
      ],
      stages: [
        { id: 's1', name: 'المراجعة الأولية', duration: 3, tasks: 2 },
        { id: 's2', name: 'الأعمال المساحية', duration: 5, tasks: 1 },
        { id: 's3', name: 'الموافقات', duration: 14, tasks: 2 },
        { id: 's4', name: 'إصدار الصكوك', duration: 3, tasks: 1 }
      ],
      warnings: [
        'يجب أن لا تقل مساحة كل قطعة عن الحد الأدنى المحدد',
        'التأكد من عدم وجود رهن أو حجز على الصك',
        'بعض البلديات تشترط عرض شارع معين'
      ],
      notes: [
        'المدة قد تزيد إذا كانت الأرض كبيرة',
        'بعض المناطق لها اشتراطات خاصة'
      ]
    },
    {
      id: 'deed_modification',
      name: 'تعديل صك',
      code: 'DM',
      category: 'properties',
      categoryAr: 'العقارات',
      description: 'تعديل بيانات في الصك مثل المساحة أو الحدود أو اسم المالك',
      duration: 15,
      estimatedCost: 8000,
      complexity: 'simple',
      tasks: [
        { id: 't1', name: 'استلام الطلب ومراجعة الصك', duration: 1, role: 'موظف استقبال', priority: 'high', dependencies: [] },
        { id: 't2', name: 'الكشف الميداني (إن لزم)', duration: 2, role: 'مساح', priority: 'medium', dependencies: ['t1'] },
        { id: 't3', name: 'إعداد المستندات المطلوبة', duration: 3, role: 'محامي', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'مراجعة كتابة العدل', duration: 7, role: 'منسق جهات', priority: 'high', dependencies: ['t3'] },
        { id: 't5', name: 'إصدار الصك المعدل', duration: 2, role: 'محامي', priority: 'high', dependencies: ['t4'] },
      ],
      documents: [
        'صورة الصك القديم',
        'صورة الهوية الوطنية',
        'ما يثبت التعديل (حكم - حجة - إقرار)',
        'خطاب تفويض (إن وجد)'
      ],
      authorities: [
        'وزارة العدل (كتابة العدل)',
        'البلدية (حسب نوع التعديل)'
      ],
      fees: [
        { name: 'رسوم كتابة العدل', amount: 1500, authority: 'وزارة العدل', required: true },
        { name: 'رسوم المساحة', amount: 2000, authority: 'مكتب مساحة', required: false },
        { name: 'رسوم إدارية', amount: 500, authority: 'متنوعة', required: true }
      ],
      stages: [
        { id: 's1', name: 'المراجعة والتحضير', duration: 4, tasks: 2 },
        { id: 's2', name: 'إعداد المستندات', duration: 3, tasks: 1 },
        { id: 's3', name: 'الموافقات', duration: 7, tasks: 1 },
        { id: 's4', name: 'الإصدار', duration: 1, tasks: 1 }
      ],
      warnings: [
        'يجب أن يكون سبب التعديل مقبولاً قانونياً',
        'بعض التعديلات تحتاج حكم قضائي'
      ],
      notes: [
        'المدة تعتمد على نوع التعديل المطلوب',
        'بعض التعديلات فورية'
      ]
    },
    {
      id: 'engineering_consultation',
      name: 'استشارة هندسية',
      code: 'EC',
      category: 'consultations',
      categoryAr: 'الاستشارات',
      description: 'تقديم استشارة هندسية متخصصة في مجال معين',
      duration: 10,
      estimatedCost: 5000,
      complexity: 'simple',
      tasks: [
        { id: 't1', name: 'استلام الطلب وتحديد نوع الاستشارة', duration: 1, role: 'مستشار هندسي', priority: 'high', dependencies: [] },
        { id: 't2', name: 'جمع المعلومات والبيانات', duration: 2, role: 'مستشار هندسي', priority: 'medium', dependencies: ['t1'] },
        { id: 't3', name: 'الدراسة والتحليل', duration: 4, role: 'مستشار هندسي', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'إعداد التقرير النهائي', duration: 2, role: 'مستشار هندسي', priority: 'high', dependencies: ['t3'] },
        { id: 't5', name: 'مراجعة واعتماد التقرير', duration: 1, role: 'مدير فني', priority: 'medium', dependencies: ['t4'] },
      ],
      documents: [
        'طلب الاستشارة',
        'المستندات ذات العلاقة',
        'المخططات (إن وجدت)',
        'التقارير السابقة (إن وجدت)'
      ],
      authorities: [],
      fees: [
        { name: 'أتعاب الاستشارة', amount: 5000, authority: 'المكتب', required: true }
      ],
      stages: [
        { id: 's1', name: 'الاستلام والتحضير', duration: 3, tasks: 2 },
        { id: 's2', name: 'الدراسة', duration: 4, tasks: 1 },
        { id: 's3', name: 'إعداد التقرير', duration: 3, tasks: 2 }
      ],
      warnings: [
        'المدة تعتمد على تعقيد الاستشارة المطلوبة'
      ],
      notes: [
        'يمكن تقديم الاستشارة بشكل شفهي أو مكتوب',
        'بعض الاستشارات تحتاج زيارة ميدانية'
      ]
    },
    {
      id: 'supervision',
      name: 'إشراف هندسي',
      code: 'SV',
      category: 'supervision',
      categoryAr: 'الإشراف',
      description: 'الإشراف على تنفيذ مشروع هندسي',
      duration: 180,
      estimatedCost: 50000,
      complexity: 'complex',
      tasks: [
        { id: 't1', name: 'توقيع عقد الإشراف', duration: 1, role: 'مدير معاملات', priority: 'high', dependencies: [] },
        { id: 't2', name: 'مراجعة المخططات التنفيذية', duration: 5, role: 'مهندس مشرف', priority: 'high', dependencies: ['t1'] },
        { id: 't3', name: 'الإشراف على أعمال الحفر والأساسات', duration: 20, role: 'مهندس مشرف', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'الإشراف على الأعمال الإنشائية', duration: 60, role: 'مهندس مشرف', priority: 'high', dependencies: ['t3'] },
        { id: 't5', name: 'الإشراف على الأعمال التشطيبية', duration: 40, role: 'مهندس مشرف', priority: 'high', dependencies: ['t4'] },
        { id: 't6', name: 'الفحص النهائي وإصدار التقرير', duration: 5, role: 'مدير فني', priority: 'high', dependencies: ['t5'] },
      ],
      documents: [
        'عقد الإشراف',
        'المخططات المعتمدة',
        'جدول كميات الأعمال',
        'بوليصة تأمين المهندس'
      ],
      authorities: [
        'البلدية',
        'الهيئة السعودية للمهندسين'
      ],
      fees: [
        { name: 'أتعاب الإشراف', amount: 50000, authority: 'المكتب', required: true }
      ],
      stages: [
        { id: 's1', name: 'التحضير والمراجعة', duration: 6, tasks: 2 },
        { id: 's2', name: 'الأساسات', duration: 20, tasks: 1 },
        { id: 's3', name: 'الهيكل الإنشائي', duration: 60, tasks: 1 },
        { id: 's4', name: 'التشطيبات', duration: 40, tasks: 1 },
        { id: 's5', name: 'الفحص النهائي', duration: 5, tasks: 1 }
      ],
      warnings: [
        'المدة تعتمد على حجم وتعقيد المشروع',
        'يجب توفر المهندس المشرف في الموقع حسب الاتفاق',
        'التأخير في التنفيذ قد يزيد من المدة'
      ],
      notes: [
        'الأتعاب تُحدد بناءً على قيمة المشروع',
        'يمكن تقسيم الإشراف إلى مراحل'
      ]
    },
    {
      id: 'design',
      name: 'تصميم معماري',
      code: 'AD',
      category: 'design',
      categoryAr: 'التصميم',
      description: 'تصميم معماري كامل لمشروع سكني أو تجاري',
      duration: 45,
      estimatedCost: 25000,
      complexity: 'complex',
      tasks: [
        { id: 't1', name: 'الاجتماع الأولي مع العميل', duration: 1, role: 'مهندس معماري', priority: 'high', dependencies: [] },
        { id: 't2', name: 'الكشف الميداني والمعاينة', duration: 1, role: 'مهندس معماري', priority: 'high', dependencies: ['t1'] },
        { id: 't3', name: 'إعداد الدراسات الأولية', duration: 7, role: 'مهندس معماري', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'عرض الأفكار على العميل', duration: 2, role: 'مهندس معماري', priority: 'medium', dependencies: ['t3'] },
        { id: 't5', name: 'إعداد المخططات المعمارية التفصيلية', duration: 15, role: 'مهندس معماري', priority: 'high', dependencies: ['t4'] },
        { id: 't6', name: 'إعداد الواجهات والقطاعات', duration: 10, role: 'مهندس معماري', priority: 'high', dependencies: ['t5'] },
        { id: 't7', name: 'إعداد المناظير ثلاثية الأبعاد', duration: 7, role: 'مصمم 3D', priority: 'medium', dependencies: ['t6'] },
        { id: 't8', name: 'المراجعة النهائية والاعتماد', duration: 2, role: 'مدير فني', priority: 'high', dependencies: ['t7'] },
      ],
      documents: [
        'صورة الصك',
        'كروكي الموقع',
        'متطلبات العميل',
        'الصور الفوتوغرافية للموقع'
      ],
      authorities: [],
      fees: [
        { name: 'أتعاب التصميم', amount: 25000, authority: 'المكتب', required: true }
      ],
      stages: [
        { id: 's1', name: 'الدراسات الأولية', duration: 10, tasks: 4 },
        { id: 's2', name: 'المخططات التفصيلية', duration: 25, tasks: 2 },
        { id: 's3', name: 'المناظير والإخراج', duration: 7, tasks: 1 },
        { id: 's4', name: 'المراجعة والاعتماد', duration: 3, tasks: 1 }
      ],
      warnings: [
        'المدة تعتمد على حجم المشروع',
        'التعديلات الكثيرة قد تزيد المدة',
        'يجب الاتفاق على عدد مرات التعديل المسموحة'
      ],
      notes: [
        'الأتعاب تُحدد بناءً على المساحة المبنية',
        'يمكن طلب مخططات إضافية بتكلفة منفصلة'
      ]
    },
    {
      id: 'surveying',
      name: 'مساحة',
      code: 'SU',
      category: 'surveying',
      categoryAr: 'المساحة',
      description: 'أعمال مساحية للأراضي والعقارات',
      duration: 7,
      estimatedCost: 4000,
      complexity: 'simple',
      tasks: [
        { id: 't1', name: 'استلام الطلب وتحديد نطاق العمل', duration: 1, role: 'مهندس مساحة', priority: 'high', dependencies: [] },
        { id: 't2', name: 'الكشف الميداني والرفع المساحي', duration: 2, role: 'مساح', priority: 'high', dependencies: ['t1'] },
        { id: 't3', name: 'معالجة البيانات وإعداد المخططات', duration: 2, role: 'مهندس مساحة', priority: 'high', dependencies: ['t2'] },
        { id: 't4', name: 'المراجعة والاعتماد', duration: 1, role: 'مدير فني', priority: 'medium', dependencies: ['t3'] },
        { id: 't5', name: 'تسليم التقرير والمخططات', duration: 1, role: 'موظف إداري', priority: 'low', dependencies: ['t4'] },
      ],
      documents: [
        'صورة الصك (إن وجد)',
        'كروكي الموقع',
        'الإحداثيات (إن وجدت)'
      ],
      authorities: [],
      fees: [
        { name: 'أتعاب المساحة', amount: 4000, authority: 'المكتب', required: true }
      ],
      stages: [
        { id: 's1', name: 'التحضير', duration: 1, tasks: 1 },
        { id: 's2', name: 'الرفع الميداني', duration: 2, tasks: 1 },
        { id: 's3', name: 'المعالجة والإعداد', duration: 3, tasks: 2 },
        { id: 's4', name: 'التسليم', duration: 1, tasks: 1 }
      ],
      warnings: [
        'المدة تعتمد على مساحة الأرض',
        'الظروف الجوية قد تؤثر على الرفع الميداني'
      ],
      notes: [
        'الأتعاب تُحدد بناءً على المساحة',
        'يمكن طلب تقرير مفصل بتكلفة إضافية'
      ]
    },
    {
      id: 'other',
      name: 'أخرى',
      code: 'OT',
      category: 'other',
      categoryAr: 'أخرى',
      description: 'معاملات أخرى غير مصنفة',
      duration: 0,
      estimatedCost: 0,
      complexity: 'medium',
      tasks: [],
      documents: [],
      authorities: [],
      fees: [],
      stages: [],
      warnings: ['يتم تحديد التفاصيل حسب نوع المعاملة'],
      notes: ['يرجى تحديد نوع المعاملة بدقة']
    }
  ];

  // التصفية
  const filteredTypes = transactionTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || type.category === filterCategory;
    const matchesComplexity = filterComplexity === 'all' || type.complexity === filterComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  // ألوان التعقيد
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return { bg: '#dcfce7', text: '#065f46', label: 'بسيط' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e', label: 'متوسط' };
      case 'complex': return { bg: '#fee2e2', text: '#991b1b', label: 'معقد' };
      default: return { bg: '#f3f4f6', text: '#374151', label: 'غير محدد' };
    }
  };

  // اختيار نوع المعاملة
  const handleSelect = (typeId: string) => {
    if (onSelect) {
      onSelect(typeId);
    }
    alert(`✅ تم اختيار: ${transactionTypes.find(t => t.id === typeId)?.name}`);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <CodeDisplay code="TAB-286-02" position="top-right" />
      
      {/* الهيدر مع البحث والتصفية */}
      <Card className="card-rtl" style={{ 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '2px solid #0ea5e9'
      }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                <Target className="h-6 w-6" style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0c4a6e', margin: 0 }}>
                  تفاصيل أنواع المعاملات
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  اختر نوع المعاملة المناسب مع معاينة التفاصيل الكاملة
                </p>
              </div>
            </div>
            
            <Badge style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              {filteredTypes.length} نوع متاح
            </Badge>
          </div>

          {/* البحث والفلتر */}
          <div className="grid grid-cols-3 gap-3">
            <InputWithCopy
              label="بحث"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن نوع المعاملة..."
              copyable={false}
              clearable
            />
            
            <SelectWithCopy
              label="التصنيف"
              id="category"
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: 'all', label: 'جميع التصنيفات' },
                { value: 'licenses', label: 'التراخيص' },
                { value: 'properties', label: 'العقارات' },
                { value: 'consultations', label: 'الاستشارات' },
                { value: 'supervision', label: 'الإشراف' },
                { value: 'design', label: 'التصميم' },
                { value: 'surveying', label: 'المساحة' },
                { value: 'other', label: 'أخرى' }
              ]}
              copyable={false}
              clearable={false}
            />
            
            <SelectWithCopy
              label="مستوى التعقيد"
              id="complexity"
              value={filterComplexity}
              onChange={setFilterComplexity}
              options={[
                { value: 'all', label: 'جميع المستويات' },
                { value: 'simple', label: 'بسيط' },
                { value: 'medium', label: 'متوسط' },
                { value: 'complex', label: 'معقد' }
              ]}
              copyable={false}
              clearable={false}
            />
          </div>
        </CardContent>
      </Card>

      <ScrollArea style={{ height: 'calc(100vh - 280px)' }}>
        <div className="space-y-4 pl-4">
          
          {/* البطاقات التفاعلية */}
          <div className="grid grid-cols-2 gap-4">
            {filteredTypes.map((type) => {
              const complexityColor = getComplexityColor(type.complexity);
              const isSelected = selectedType === type.id;
              const isExpanded = showDetails === type.id;
              
              return (
                <Card 
                  key={type.id} 
                  className="card-rtl"
                  style={{ 
                    background: isSelected 
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge style={{
                            background: complexityColor.bg,
                            color: complexityColor.text,
                            fontSize: '10px',
                            padding: '2px 8px'
                          }}>
                            {complexityColor.label}
                          </Badge>
                          <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {type.code}
                          </Badge>
                          <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {type.categoryAr}
                          </Badge>
                        </div>
                        <CardTitle style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                          {type.name}
                        </CardTitle>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.5' }}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* المعلومات الأساسية */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" style={{ color: '#3b82f6' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>المدة</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.duration} يوم
                        </p>
                      </div>
                      
                      <div className="p-2" style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3" style={{ color: '#10b981' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>التكلفة</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.estimatedCost.toLocaleString()} ر.س
                        </p>
                      </div>
                      
                      <div className="p-2" style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="h-3 w-3" style={{ color: '#f59e0b' }} />
                          <span style={{ fontSize: '10px', color: '#64748b' }}>المهام</span>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                          {type.tasks.length} مهمة
                        </p>
                      </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowDetails(isExpanded ? null : type.id)}
                        variant="outline"
                        style={{ flex: 1, fontSize: '12px' }}
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                      </Button>
                      <Button
                        onClick={() => handleSelect(type.id)}
                        style={{
                          flex: 1,
                          fontSize: '12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff'
                        }}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        اختيار
                      </Button>
                    </div>

                    {/* التفاصيل الموسعة */}
                    {isExpanded && (
                      <div className="space-y-3 pt-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                        
                        {/* المهام */}
                        {type.tasks.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <List className="h-4 w-4 inline ml-1" />
                              المهام ({type.tasks.length})
                            </h4>
                            <div className="space-y-1">
                              {type.tasks.map((task, index) => (
                                <div key={task.id} className="p-2" style={{ 
                                  background: '#f8fafc', 
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge style={{ 
                                        fontSize: '9px', 
                                        padding: '1px 4px',
                                        background: '#3b82f6',
                                        color: '#ffffff'
                                      }}>
                                        {index + 1}
                                      </Badge>
                                      <span style={{ fontSize: '11px', color: '#1f2937' }}>
                                        {task.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {task.duration} يوم
                                      </Badge>
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {task.role}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* المستندات */}
                        {type.documents.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Paperclip className="h-4 w-4 inline ml-1" />
                              المستندات المطلوبة ({type.documents.length})
                            </h4>
                            <div className="grid grid-cols-2 gap-1">
                              {type.documents.map((doc, index) => (
                                <div key={index} className="p-2" style={{ 
                                  background: '#f0fdf4', 
                                  borderRadius: '6px',
                                  border: '1px solid #bbf7d0'
                                }}>
                                  <span style={{ fontSize: '11px', color: '#065f46' }}>
                                    • {doc}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* الجهات */}
                        {type.authorities.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Building className="h-4 w-4 inline ml-1" />
                              الجهات ذات العلاقة ({type.authorities.length})
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {type.authorities.map((auth, index) => (
                                <Badge key={index} variant="outline" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                  {auth}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* الرسوم */}
                        {type.fees.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <DollarSign className="h-4 w-4 inline ml-1" />
                              الرسوم المتوقعة
                            </h4>
                            <Table className="table-rtl dense-table">
                              <TableBody>
                                {type.fees.map((fee, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="text-right py-1" style={{ fontSize: '11px' }}>
                                      {fee.name}
                                      {fee.required && <span style={{ color: '#ef4444' }}> *</span>}
                                    </TableCell>
                                    <TableCell className="text-right py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                                      {fee.amount.toLocaleString()} ر.س
                                    </TableCell>
                                    <TableCell className="text-right py-1" style={{ fontSize: '10px', color: '#64748b' }}>
                                      {fee.authority}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* المراحل */}
                        {type.stages.length > 0 && (
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                              <Layers className="h-4 w-4 inline ml-1" />
                              المراحل ({type.stages.length})
                            </h4>
                            <div className="space-y-1">
                              {type.stages.map((stage, index) => (
                                <div key={stage.id} className="p-2" style={{ 
                                  background: '#fef3c7', 
                                  borderRadius: '6px',
                                  border: '1px solid #fde68a'
                                }}>
                                  <div className="flex items-center justify-between">
                                    <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
                                      {index + 1}. {stage.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <Badge style={{ 
                                        fontSize: '9px', 
                                        padding: '1px 4px',
                                        background: '#f59e0b',
                                        color: '#ffffff'
                                      }}>
                                        {stage.duration} يوم
                                      </Badge>
                                      <Badge variant="outline" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                        {stage.tasks} مهام
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* التحذيرات */}
                        {type.warnings.length > 0 && (
                          <div className="p-3" style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            borderRadius: '8px',
                            border: '1px solid #ef4444'
                          }}>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4" style={{ color: '#ef4444', flexShrink: 0 }} />
                              <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b', margin: '0 0 4px 0' }}>
                                  تحذيرات هامة:
                                </h4>
                                <ul style={{ fontSize: '11px', color: '#991b1b', margin: 0, padding: '0 0 0 16px' }}>
                                  {type.warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* الملاحظات */}
                        {type.notes.length > 0 && (
                          <div className="p-3" style={{ 
                            background: 'rgba(59, 130, 246, 0.1)', 
                            borderRadius: '8px',
                            border: '1px solid #3b82f6'
                          }}>
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4" style={{ color: '#3b82f6', flexShrink: 0 }} />
                              <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', margin: '0 0 4px 0' }}>
                                  ملاحظات:
                                </h4>
                                <ul style={{ fontSize: '11px', color: '#1e40af', margin: 0, padding: '0 0 0 16px' }}>
                                  {type.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* لا توجد نتائج */}
          {filteredTypes.length === 0 && (
            <Card className="card-rtl">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#94a3b8' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#475569', margin: '0 0 8px 0' }}>
                  لا توجد نتائج
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  جرب تغيير معايير البحث أو الفلتر
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </ScrollArea>
    </div>
  );
};

export default Tab_286_02_TransactionDetails_Complete;
