/**
 * الشاشة 947 - المستهدفات
 * ===========================================================================
 * 
 * نظام شامل لإدارة المستهدفات والأهداف
 * 
 * المميزات:
 * - مستهدفات تطوير وترقية فريق العمل
 * - مستهدفات عامة للمكتب
 * - مستهدفات هندسية
 * - مستهدفات بنية تحتية
 * - مستهدفات مقرات
 * - مستهدفات شراكات
 * - مستهدفات معرفية
 * - عداد تنازلي للأهداف
 * - صلاحيات تفصيلية
 * 
 * @version 1.0
 * @date 2025-10-20
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import {
  Target, Users, TrendingUp, Building2, Lightbulb, HandshakeIcon,
  Calendar, Clock, CheckCircle, AlertTriangle, Plus, Edit, Eye,
  Star, Award, Zap, Rocket, Flag, Milestone, BarChart3, Settings,
  FileText, Database, Cpu, Globe, Home, HardHat, DollarSign, XCircle
} from 'lucide-react';

// ===== واجهات البيانات =====

interface TargetGoal {
  id: string;
  targetNumber: string;
  title: string;
  description: string;
  category: 'فريق العمل' | 'عامة' | 'هندسية' | 'بنية تحتية' | 'مقرات' | 'شراكات' | 'معرفية';
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  startDate: string;
  targetDate: string;
  completionDate?: string;
  progress: number;
  status: 'جديد' | 'قيد التنفيذ' | 'معلق' | 'مكتمل' | 'ملغي';
  assignedTo: string[];
  budget: number;
  actualCost: number;
  department: string;
  createdBy: string;
  createdDate: string;
  lastUpdate: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  completedDate?: string;
}

const TargetsGoalsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('947-01');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<TargetGoal | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // تحديث الوقت كل ثانية للعداد التنازلي
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TABS_CONFIG = [
    { id: '947-01', number: '947-01', title: 'نظرة عامة', icon: Target },
    { id: '947-02', number: '947-02', title: 'تطوير فريق العمل', icon: Users },
    { id: '947-03', number: '947-03', title: 'المستهدفات العامة', icon: Flag },
    { id: '947-04', number: '947-04', title: 'المستهدفات الهندسية', icon: HardHat },
    { id: '947-05', number: '947-05', title: 'البنية التحتية', icon: Database },
    { id: '947-06', number: '947-06', title: 'المقرات والمرافق', icon: Building2 },
    { id: '947-07', number: '947-07', title: 'الشراكات', icon: HandshakeIcon },
    { id: '947-08', number: '947-08', title: 'المستهدفات المعرفية', icon: Lightbulb },
    { id: '947-09', number: '947-09', title: 'المراحل الرئيسية', icon: Milestone },
    { id: '947-10', number: '947-10', title: 'الموازنة والتكاليف', icon: DollarSign },
    { id: '947-11', number: '947-11', title: 'التقارير والإحصائيات', icon: BarChart3 },
    { id: '947-12', number: '947-12', title: 'الإعدادات والصلاحيات', icon: Settings },
  ];

  // حساب العداد التنازلي
  const calculateCountdown = (targetDate: string) => {
    const target = new Date(targetDate).getTime();
    const now = currentTime.getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  // بيانات المستهدفات
  const targetsGoals: TargetGoal[] = useMemo(() => [
    // تطوير فريق العمل
    {
      id: 'TG001',
      targetNumber: 'TG-2024-001',
      title: 'تدريب 20 مهندس على BIM',
      description: 'تدريب متقدم على تقنيات BIM وRevit لرفع كفاءة الفريق الهندسي',
      category: 'فريق العمل',
      priority: 'عالية',
      startDate: '2024-01-15',
      targetDate: '2024-12-31',
      progress: 65,
      status: 'قيد التنفيذ',
      assignedTo: ['قسم الموارد البشرية', 'الإدارة الهندسية'],
      budget: 150000,
      actualCost: 97500,
      department: 'الموارد البشرية',
      createdBy: 'مدير الموارد البشرية',
      createdDate: '2024-01-10',
      lastUpdate: '2024-10-15',
      milestones: [
        { id: 'M1', title: 'اختيار المتدربين', date: '2024-02-01', isCompleted: true, completedDate: '2024-01-28' },
        { id: 'M2', title: 'بدء الدورة الأولى', date: '2024-03-01', isCompleted: true, completedDate: '2024-03-01' },
        { id: 'M3', title: 'إنهاء الدورة الأولى', date: '2024-06-30', isCompleted: true, completedDate: '2024-06-25' },
        { id: 'M4', title: 'بدء الدورة الثانية', date: '2024-09-01', isCompleted: true, completedDate: '2024-09-05' },
        { id: 'M5', title: 'الامتحان النهائي', date: '2024-12-15', isCompleted: false },
      ],
    },
    {
      id: 'TG002',
      targetNumber: 'TG-2024-002',
      title: 'ترقية 5 مهندسين لمناصب قيادية',
      description: 'برنامج تطوير قيادي لمهندسين متميزين لتولي مناصب إدارية',
      category: 'فريق العمل',
      priority: 'عالية',
      startDate: '2024-03-01',
      targetDate: '2025-03-01',
      progress: 40,
      status: 'قيد التنفيذ',
      assignedTo: ['الإدارة العليا', 'الموارد البشرية'],
      budget: 200000,
      actualCost: 80000,
      department: 'الموارد البشرية',
      createdBy: 'الرئيس التنفيذي',
      createdDate: '2024-02-15',
      lastUpdate: '2024-10-10',
      milestones: [
        { id: 'M1', title: 'تحديد المرشحين', date: '2024-04-01', isCompleted: true, completedDate: '2024-03-28' },
        { id: 'M2', title: 'دورة القيادة الأولى', date: '2024-07-01', isCompleted: true, completedDate: '2024-07-05' },
        { id: 'M3', title: 'التقييم المرحلي', date: '2024-11-01', isCompleted: false },
        { id: 'M4', title: 'التقييم النهائي', date: '2025-02-01', isCompleted: false },
        { id: 'M5', title: 'الترقية الفعلية', date: '2025-03-01', isCompleted: false },
      ],
    },

    // المستهدفات العامة
    {
      id: 'TG010',
      targetNumber: 'TG-2024-010',
      title: 'زيادة الإيرادات بنسبة 25%',
      description: 'تحقيق نمو في الإيرادات من 20 مليون إلى 25 مليون ريال',
      category: 'عامة',
      priority: 'عالية',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      progress: 78,
      status: 'قيد التنفيذ',
      assignedTo: ['الإدارة المالية', 'المبيعات'],
      budget: 500000,
      actualCost: 390000,
      department: 'المالية',
      createdBy: 'المدير المالي',
      createdDate: '2023-12-20',
      lastUpdate: '2024-10-18',
      milestones: [
        { id: 'M1', title: 'الربع الأول +5%', date: '2024-03-31', isCompleted: true, completedDate: '2024-03-30' },
        { id: 'M2', title: 'الربع الثاني +10%', date: '2024-06-30', isCompleted: true, completedDate: '2024-06-29' },
        { id: 'M3', title: 'الربع الثالث +18%', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-28' },
        { id: 'M4', title: 'الربع الرابع +25%', date: '2024-12-31', isCompleted: false },
      ],
    },

    // المستهدفات الهندسية
    {
      id: 'TG020',
      targetNumber: 'TG-2024-020',
      title: 'إتمام 50 مشروع هندسي',
      description: 'تنفيذ وتسليم 50 مشروع هندسي بمعايير جودة عالية',
      category: 'هندسية',
      priority: 'عالية',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      progress: 72,
      status: 'قيد التنفيذ',
      assignedTo: ['الإدارة الهندسية', 'مديرو المشاريع'],
      budget: 0,
      actualCost: 0,
      department: 'الهندسة',
      createdBy: 'المدير الهندسي',
      createdDate: '2023-12-15',
      lastUpdate: '2024-10-19',
      milestones: [
        { id: 'M1', title: '10 مشاريع', date: '2024-03-31', isCompleted: true, completedDate: '2024-03-28' },
        { id: 'M2', title: '25 مشروع', date: '2024-06-30', isCompleted: true, completedDate: '2024-06-27' },
        { id: 'M3', title: '36 مشروع', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-29' },
        { id: 'M4', title: '50 مشروع', date: '2024-12-31', isCompleted: false },
      ],
    },
    {
      id: 'TG021',
      targetNumber: 'TG-2024-021',
      title: 'الحصول على شهادة ISO 9001',
      description: 'تطبيق نظام الجودة الشامل والحصول على شهادة ISO 9001',
      category: 'هندسية',
      priority: 'متوسطة',
      startDate: '2024-04-01',
      targetDate: '2025-06-30',
      progress: 35,
      status: 'قيد التنفيذ',
      assignedTo: ['الجودة', 'الإدارة العليا'],
      budget: 180000,
      actualCost: 63000,
      department: 'الجودة',
      createdBy: 'مدير الجودة',
      createdDate: '2024-03-15',
      lastUpdate: '2024-10-12',
      milestones: [
        { id: 'M1', title: 'تشكيل فريق العمل', date: '2024-05-01', isCompleted: true, completedDate: '2024-04-28' },
        { id: 'M2', title: 'التدقيق الداخلي الأول', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-25' },
        { id: 'M3', title: 'التدقيق الداخلي الثاني', date: '2025-02-28', isCompleted: false },
        { id: 'M4', title: 'التدقيق الخارجي', date: '2025-05-31', isCompleted: false },
        { id: 'M5', title: 'الحصول على الشهادة', date: '2025-06-30', isCompleted: false },
      ],
    },

    // البنية التحتية
    {
      id: 'TG030',
      targetNumber: 'TG-2024-030',
      title: 'ترقية البنية التحتية لتقنية المعلومات',
      description: 'تحديث الخوادم وأنظمة الشبكات وأمن المعلومات',
      category: 'بنية تحتية',
      priority: 'عالية',
      startDate: '2024-02-01',
      targetDate: '2024-11-30',
      progress: 55,
      status: 'قيد التنفيذ',
      assignedTo: ['تقنية المعلومات'],
      budget: 850000,
      actualCost: 467500,
      department: 'تقنية المعلومات',
      createdBy: 'مدير تقنية المعلومات',
      createdDate: '2024-01-20',
      lastUpdate: '2024-10-17',
      milestones: [
        { id: 'M1', title: 'شراء المعدات', date: '2024-04-01', isCompleted: true, completedDate: '2024-03-28' },
        { id: 'M2', title: 'تركيب الخوادم', date: '2024-06-30', isCompleted: true, completedDate: '2024-06-25' },
        { id: 'M3', title: 'ترقية الشبكات', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-28' },
        { id: 'M4', title: 'نظام الأمان', date: '2024-11-30', isCompleted: false },
      ],
    },

    // المقرات
    {
      id: 'TG040',
      targetNumber: 'TG-2024-040',
      title: 'افتتاح فرع جدة',
      description: 'إنشاء وتجهيز وافتتاح فرع جديد في مدينة جدة',
      category: 'مقرات',
      priority: 'عالية',
      startDate: '2024-06-01',
      targetDate: '2025-03-31',
      progress: 25,
      status: 'قيد التنفيذ',
      assignedTo: ['الإدارة العليا', 'التوسع'],
      budget: 3500000,
      actualCost: 875000,
      department: 'التوسع',
      createdBy: 'الرئيس التنفيذي',
      createdDate: '2024-05-15',
      lastUpdate: '2024-10-16',
      milestones: [
        { id: 'M1', title: 'البحث عن موقع', date: '2024-07-31', isCompleted: true, completedDate: '2024-07-25' },
        { id: 'M2', title: 'توقيع العقد', date: '2024-08-31', isCompleted: true, completedDate: '2024-08-28' },
        { id: 'M3', title: 'التجهيزات الداخلية', date: '2024-12-31', isCompleted: false },
        { id: 'M4', title: 'التوظيف', date: '2025-02-28', isCompleted: false },
        { id: 'M5', title: 'الافتتاح الرسمي', date: '2025-03-31', isCompleted: false },
      ],
    },

    // الشراكات
    {
      id: 'TG050',
      targetNumber: 'TG-2024-050',
      title: 'شراكة استراتيجية مع شركة عالمية',
      description: 'التعاقد مع شركة هندسية عالمية لنقل المعرفة والخبرات',
      category: 'شراكات',
      priority: 'متوسطة',
      startDate: '2024-07-01',
      targetDate: '2025-06-30',
      progress: 20,
      status: 'قيد التنفيذ',
      assignedTo: ['الإدارة العليا', 'التطوير'],
      budget: 500000,
      actualCost: 100000,
      department: 'التطوير',
      createdBy: 'المدير التنفيذي',
      createdDate: '2024-06-15',
      lastUpdate: '2024-10-14',
      milestones: [
        { id: 'M1', title: 'تحديد الشركاء المحتملين', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-25' },
        { id: 'M2', title: 'التفاوض', date: '2024-12-31', isCompleted: false },
        { id: 'M3', title: 'توقيع الاتفاقية', date: '2025-03-31', isCompleted: false },
        { id: 'M4', title: 'بدء التنفيذ', date: '2025-06-30', isCompleted: false },
      ],
    },

    // المستهدفات المعرفية
    {
      id: 'TG060',
      targetNumber: 'TG-2024-060',
      title: 'إطلاق قاعدة معرفية شاملة',
      description: 'إنشاء قاعدة معرفية رقمية لجميع المشاريع والخبرات',
      category: 'معرفية',
      priority: 'متوسطة',
      startDate: '2024-05-01',
      targetDate: '2024-12-31',
      progress: 60,
      status: 'قيد التنفيذ',
      assignedTo: ['تقنية المعلومات', 'الهندسة'],
      budget: 250000,
      actualCost: 150000,
      department: 'تقنية المعلومات',
      createdBy: 'مدير المعرفة',
      createdDate: '2024-04-15',
      lastUpdate: '2024-10-13',
      milestones: [
        { id: 'M1', title: 'تصميم النظام', date: '2024-06-30', isCompleted: true, completedDate: '2024-06-25' },
        { id: 'M2', title: 'التطوير', date: '2024-09-30', isCompleted: true, completedDate: '2024-09-28' },
        { id: 'M3', title: 'إدخال البيانات', date: '2024-11-30', isCompleted: false },
        { id: 'M4', title: 'الإطلاق', date: '2024-12-31', isCompleted: false },
      ],
    },
  ], []);

  const currentTab = TABS_CONFIG.find(tab => tab.id === activeTab);

  const renderTabContent = () => {
    // تاب 947-01: نظرة عامة
    if (activeTab === '947-01') {
      const totalTargets = targetsGoals.length;
      const activeTargets = targetsGoals.filter(t => t.status === 'قيد التنفيذ').length;
      const completedTargets = targetsGoals.filter(t => t.status === 'مكتمل').length;
      const avgProgress = targetsGoals.reduce((sum, t) => sum + t.progress, 0) / totalTargets;

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                نظرة عامة على المستهدفات
              </h3>
              <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                متابعة شاملة لجميع الأهداف الاستراتيجية
              </p>
            </div>
            <Button 
              className="dense-button bg-[#10b981] hover:bg-[#059669] text-white"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-3.5 w-3.5 ml-2" />
              مستهدف جديد
            </Button>
          </div>

          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي المستهدفات
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {totalTargets}
                    </p>
                  </div>
                  <Target className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      قيد التنفيذ
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {activeTargets}
                    </p>
                  </div>
                  <Zap className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مكتملة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {completedTargets}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط التقدم
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {avgProgress.toFixed(0)}%
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            {['فريق العمل', 'عامة', 'هندسية', 'بنية تحتية'].map((cat, idx) => {
              const count = targetsGoals.filter(t => t.category === cat).length;
              const colors = [
                { bg: '#fce7f3', border: '#f9a8d4', icon: '#ec4899' },
                { bg: '#dcfce7', border: '#86efac', icon: '#22c55e' },
                { bg: '#f3e8ff', border: '#d8b4fe', icon: '#a855f7' },
                { bg: '#fee2e2', border: '#fca5a5', icon: '#ef4444' },
              ];
              const color = colors[idx];

              return (
                <Card 
                  key={cat}
                  className="stats-card-compact card-rtl" 
                  style={{ 
                    '--bg-from': color.bg, 
                    '--bg-to': color.bg, 
                    '--border-color': color.border 
                  } as React.CSSProperties}
                >
                  <CardContent className="dense-card-content-sm">
                    <div className="stats-content-compact">
                      <div className="stats-text-compact">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          {cat}
                        </p>
                        <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                          {count}
                        </p>
                      </div>
                      <Star className="stats-icon-compact opacity-80" style={{ color: color.icon }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* المستهدفات مع العداد التنازلي */}
          <div className="grid grid-cols-2 dense-grid">
            {targetsGoals.slice(0, 4).map((target) => {
              const countdown = calculateCountdown(target.targetDate);

              return (
                <Card key={target.id} className="card-rtl">
                  <CardHeader className="card-header-dense">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {target.title}
                      </CardTitle>
                      <Badge className={
                        target.priority === 'عالية' ? 'bg-red-100 text-red-700' :
                        target.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {target.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="dense-card-content">
                    <div className="space-y-2">
                      {/* العداد التنازلي */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded border border-blue-200">
                        <p className="text-xs mb-1" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          الوقت المتبقي:
                        </p>
                        <div className="grid grid-cols-4 gap-1">
                          <div className="text-center">
                            <p className="text-base" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.days}
                            </p>
                            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              يوم
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-base" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.hours}
                            </p>
                            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              ساعة
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-base" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.minutes}
                            </p>
                            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              دقيقة
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-base" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.seconds}
                            </p>
                            <p className="text-[10px]" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              ثانية
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* التقدم */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            التقدم
                          </span>
                          <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {target.progress}%
                          </span>
                        </div>
                        <Progress value={target.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="dense-button"
                          onClick={() => {
                            setSelectedTarget(target);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 ml-1" />
                          التفاصيل
                        </Button>
                        <Badge className="bg-gray-100 text-gray-700 text-[10px]">
                          {target.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      );
    }

    // تاب 947-09: المراحل الرئيسية
    if (activeTab === '947-09') {
      // جمع جميع المراحل من جميع المستهدفات
      const allMilestones = targetsGoals.flatMap(target => 
        target.milestones.map(milestone => ({
          ...milestone,
          targetId: target.id,
          targetTitle: target.title,
          targetNumber: target.targetNumber,
          targetCategory: target.category,
        }))
      );

      const completedMilestones = allMilestones.filter(m => m.isCompleted).length;
      const pendingMilestones = allMilestones.filter(m => !m.isCompleted).length;
      const upcomingMilestones = allMilestones.filter(m => {
        const milestoneDate = new Date(m.date);
        const now = new Date();
        const daysUntil = Math.floor((milestoneDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return !m.isCompleted && daysUntil <= 30 && daysUntil >= 0;
      });

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المراحل الرئيسية
            </h3>
          </div>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      إجمالي المراحل
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {allMilestones.length}
                    </p>
                  </div>
                  <Milestone className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      مكتملة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {completedMilestones}
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      معلقة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {pendingMilestones}
                    </p>
                  </div>
                  <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      قادمة (30 يوم)
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {upcomingMilestones.length}
                    </p>
                  </div>
                  <Calendar className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة الإنجاز
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((completedMilestones / allMilestones.length) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط لكل هدف
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(allMilestones.length / targetsGoals.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardContent className="dense-card-content">
              <Table className="table-rtl dense-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستهدف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرحلة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التاريخ المستهدف</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>تاريخ الإكمال</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                    <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allMilestones
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((milestone: any) => (
                      <TableRow key={`${milestone.targetId}-${milestone.id}`}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {milestone.targetTitle}
                        </TableCell>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {milestone.title}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {milestone.date}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {milestone.completedDate || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                            {milestone.targetCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={milestone.isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {milestone.isCompleted ? 'مكتمل' : 'معلق'}
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
    }

    // تاب 947-10: الموازنة والتكاليف
    if (activeTab === '947-10') {
      const totalBudget = targetsGoals.reduce((sum, t) => sum + t.budget, 0);
      const totalActualCost = targetsGoals.reduce((sum, t) => sum + t.actualCost, 0);
      const totalRemaining = totalBudget - totalActualCost;
      const avgSpendRate = (totalActualCost / totalBudget) * 100;

      const budgetByCategory = targetsGoals.reduce((acc, target) => {
        if (!acc[target.category]) {
          acc[target.category] = { budget: 0, actual: 0 };
        }
        acc[target.category].budget += target.budget;
        acc[target.category].actual += target.actualCost;
        return acc;
      }, {} as Record<string, { budget: number; actual: number }>);

      return (
        <div className="space-y-2">
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الموازنة والتكاليف
          </h3>

          <div className="stats-grid-6">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الموازنة الإجمالية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalBudget / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <DollarSign className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      المصروف الفعلي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalActualCost / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <TrendingUp className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      المتبقي
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalRemaining / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة الصرف
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {avgSpendRate.toFixed(1)}%
                    </p>
                  </div>
                  <BarChart3 className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#e0e7ff', '--bg-to': '#c7d2fe', '--border-color': '#a5b4fc' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      متوسط الموازنة
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {(totalBudget / targetsGoals.length / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Award className="stats-icon-compact text-indigo-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fce7f3', '--bg-to': '#fbcfe8', '--border-color': '#f9a8d4' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة الاستخدام
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {((totalRemaining / totalBudget) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Zap className="stats-icon-compact text-pink-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الموازنة حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الفئة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموازنة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصروف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(budgetByCategory).map(([category, data]) => (
                      <TableRow key={category}>
                        <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {category}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {data.budget.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                          {data.actual.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                              {((data.actual / data.budget) * 100).toFixed(0)}%
                            </span>
                            <Progress value={(data.actual / data.budget) * 100} className="h-2 w-16" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  تفاصيل المستهدفات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <Table className="table-rtl dense-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المستهدف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموازنة</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المصروف</TableHead>
                      <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المتبقي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targetsGoals
                      .filter(t => t.budget > 0)
                      .map((target) => (
                        <TableRow key={target.id}>
                          <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {target.title}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                            {target.budget.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                            {target.actualCost.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                            {(target.budget - target.actualCost).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 947-11: التقارير والإحصائيات
    if (activeTab === '947-11') {
      const completionRate = (targetsGoals.filter(t => t.status === 'مكتمل').length / targetsGoals.length) * 100;
      const inProgressRate = (targetsGoals.filter(t => t.status === 'قيد التنفيذ').length / targetsGoals.length) * 100;
      const highPriorityTargets = targetsGoals.filter(t => t.priority === 'عالية');
      const onTimeTargets = targetsGoals.filter(t => {
        const daysLeft = Math.floor((new Date(t.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return t.progress >= 50 || daysLeft > 90;
      });

      return (
        <div className="space-y-2">
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            التقارير والإحصائيات
          </h3>

          <div className="stats-grid-8">
            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#dbeafe', '--bg-to': '#bfdbfe', '--border-color': '#93c5fd' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      نسبة الإنجاز
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {completionRate.toFixed(0)}%
                    </p>
                  </div>
                  <CheckCircle className="stats-icon-compact text-[#2563eb] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#d1fae5', '--bg-to': '#a7f3d0', '--border-color': '#6ee7b7' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      قيد التنفيذ
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                      {inProgressRate.toFixed(0)}%
                    </p>
                  </div>
                  <Zap className="stats-icon-compact text-[#10b981] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fee2e2', '--bg-to': '#fecaca', '--border-color': '#fca5a5' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      أولوية عالية
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {highPriorityTargets.length}
                    </p>
                  </div>
                  <AlertTriangle className="stats-icon-compact text-[#ef4444] opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card-compact card-rtl" style={{ '--bg-from': '#fef3c7', '--bg-to': '#fde68a', '--border-color': '#fcd34d' } as React.CSSProperties}>
              <CardContent className="dense-card-content-sm">
                <div className="stats-content-compact">
                  <div className="stats-text-compact">
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      في الوقت المحدد
                    </p>
                    <p className="stats-value-compact" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                      {onTimeTargets.length}
                    </p>
                  </div>
                  <Clock className="stats-icon-compact text-[#f59e0b] opacity-80" />
                </div>
              </CardContent>
            </Card>

            {['فريق العمل', 'هندسية', 'عامة', 'بنية تحتية'].map((cat, idx) => {
              const categoryTargets = targetsGoals.filter(t => t.category === cat);
              const categoryProgress = categoryTargets.reduce((sum, t) => sum + t.progress, 0) / (categoryTargets.length || 1);
              const colors = [
                { bg: '#e0e7ff', border: '#a5b4fc', icon: '#6366f1' },
                { bg: '#fce7f3', border: '#f9a8d4', icon: '#ec4899' },
                { bg: '#dcfce7', border: '#86efac', icon: '#22c55e' },
                { bg: '#f3e8ff', border: '#d8b4fe', icon: '#a855f7' },
              ];
              const color = colors[idx];

              return (
                <Card 
                  key={cat}
                  className="stats-card-compact card-rtl" 
                  style={{ 
                    '--bg-from': color.bg, 
                    '--bg-to': color.bg, 
                    '--border-color': color.border 
                  } as React.CSSProperties}
                >
                  <CardContent className="dense-card-content-sm">
                    <div className="stats-content-compact">
                      <div className="stats-text-compact">
                        <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                          {cat}
                        </p>
                        <p className="stats-value-compact" style={{ fontFamily: 'Courier New, monospace', color: '#1f2937' }}>
                          {categoryProgress.toFixed(0)}%
                        </p>
                      </div>
                      <BarChart3 className="stats-icon-compact opacity-80" style={{ color: color.icon }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الأداء حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {['فريق العمل', 'عامة', 'هندسية', 'بنية تحتية', 'مقرات', 'شراكات', 'معرفية'].map((category) => {
                    const categoryTargets = targetsGoals.filter(t => t.category === category);
                    const avgProgress = categoryTargets.reduce((sum, t) => sum + t.progress, 0) / (categoryTargets.length || 1);
                    
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {category} ({categoryTargets.length})
                          </span>
                          <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {avgProgress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={avgProgress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الأداء حسب الأولوية
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  {['عالية', 'متوسطة', 'منخفضة'].map((priority) => {
                    const priorityTargets = targetsGoals.filter(t => t.priority === priority);
                    const avgProgress = priorityTargets.reduce((sum, t) => sum + t.progress, 0) / (priorityTargets.length || 1);
                    
                    return (
                      <div key={priority}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {priority} ({priorityTargets.length})
                          </span>
                          <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {avgProgress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={avgProgress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // تاب 947-12: الإعدادات والصلاحيات
    if (activeTab === '947-12') {
      return (
        <div className="space-y-2">
          <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الإعدادات والصلاحيات
          </h3>

          <div className="grid grid-cols-2 dense-grid">
            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات العرض
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        عرض العداد التنازلي
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إظهار الوقت المتبقي لكل هدف
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تنبيهات المراحل
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إشعارات عند اقتراب موعد المرحلة
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تقارير دورية
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        إرسال تقرير أسبوعي بالتقدم
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تحديث تلقائي
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                        تحديث البيانات كل 60 ثانية
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-rtl">
              <CardHeader className="card-header-dense">
                <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  صلاحيات المستهدفات
                </CardTitle>
              </CardHeader>
              <CardContent className="dense-card-content">
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        إنشاء مستهدف جديد
                      </p>
                      <Badge className="bg-green-600 text-white text-[10px]">مفعّل</Badge>
                    </div>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الإدارة العليا + مديرو الأقسام
                    </p>
                  </div>

                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        تعديل المستهدفات
                      </p>
                      <Badge className="bg-green-600 text-white text-[10px]">مفعّل</Badge>
                    </div>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الإدارة العليا + المسؤولون
                    </p>
                  </div>

                  <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        حذف المستهدفات
                      </p>
                      <Badge className="bg-yellow-600 text-white text-[10px]">محدود</Badge>
                    </div>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      الإدارة العليا فقط
                    </p>
                  </div>

                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        عرض التقارير
                      </p>
                      <Badge className="bg-blue-600 text-white text-[10px]">مفعّل</Badge>
                    </div>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      جميع المستخدمين
                    </p>
                  </div>

                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: '600' }}>
                        تعديل الموازنة
                      </p>
                      <Badge className="bg-red-600 text-white text-[10px]">مقيّد</Badge>
                    </div>
                    <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                      المدير المالي + الإدارة العليا
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-rtl">
            <CardHeader className="card-header-dense">
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات التنبيهات
              </CardTitle>
            </CardHeader>
            <CardContent className="dense-card-content">
              <div className="grid grid-cols-3 dense-grid">
                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    تنبيه قبل انتهاء الموعد
                  </Label>
                  <Select>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 أيام</SelectItem>
                      <SelectItem value="14">14 يوم</SelectItem>
                      <SelectItem value="30">30 يوم</SelectItem>
                      <SelectItem value="60">60 يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    وقت إرسال التقرير
                  </Label>
                  <Select>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر الوقت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومي</SelectItem>
                      <SelectItem value="weekly">أسبوعي</SelectItem>
                      <SelectItem value="monthly">شهري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label className="dense-label" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نوع التنبيه
                  </Label>
                  <Select>
                    <SelectTrigger className="dense-select" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                      <SelectItem value="sms">رسالة نصية</SelectItem>
                      <SelectItem value="both">كلاهما</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // باقي التابات - عرض حسب الفئة
    const categoryTargets = targetsGoals.filter(t => {
      if (activeTab === '947-02') return t.category === 'فريق العمل';
      if (activeTab === '947-03') return t.category === 'عامة';
      if (activeTab === '947-04') return t.category === 'هندسية';
      if (activeTab === '947-05') return t.category === 'بنية تحتية';
      if (activeTab === '947-06') return t.category === 'مقرات';
      if (activeTab === '947-07') return t.category === 'شراكات';
      if (activeTab === '947-08') return t.category === 'معرفية';
      return true;
    });

    return (
      <div className="space-y-2">
        <h3 className="text-base" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          {currentTab?.title}
        </h3>

        <Card className="card-rtl">
          <CardContent className="dense-card-content">
            <Table className="table-rtl dense-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الرقم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العنوان</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموعد المستهدف</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>التقدم</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الأولوية</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                  <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryTargets.map((target) => {
                  const countdown = calculateCountdown(target.targetDate);
                  
                  return (
                    <TableRow key={target.id}>
                      <TableCell className="text-right" style={{ fontFamily: 'Courier New, monospace' }}>
                        {target.targetNumber}
                      </TableCell>
                      <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {target.title}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {target.targetDate}
                          </span>
                          <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                            {countdown.days} يوم متبقي
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
                            {target.progress}%
                          </span>
                          <Progress value={target.progress} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          target.priority === 'عالية' ? 'bg-red-100 text-red-700' :
                          target.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {target.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          target.status === 'مكتمل' ? 'bg-green-100 text-green-700' :
                          target.status === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-700' :
                          target.status === 'معلق' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {target.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="dense-button"
                            onClick={() => {
                              setSelectedTarget(target);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dense-button">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 rtl-support" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
              المستهدفات
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
              متابعة شاملة للأهداف الاستراتيجية مع عدادات تنازلية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-600 text-white">
              <Rocket className="h-3 w-3 ml-1" />
              استراتيجي
            </Badge>
            <Badge className="bg-[#2563eb] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
              SCR-947
            </Badge>
            <Badge className="bg-green-100 text-green-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              12 تاب
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-3" style={{ direction: 'rtl' }}>
        <Card className="w-56 card-rtl" style={{ height: 'fit-content' }}>
          <CardContent className="p-2">
            <div className="space-y-1">
              {TABS_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right p-2 rounded transition-all ${
                    activeTab === tab.id ? 'bg-[#2563eb] text-white' : 'hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {React.createElement(tab.icon, { className: 'h-4 w-4' })}
                      <span className="text-xs">{tab.title}</span>
                    </div>
                    <span 
                      className="text-[10px] px-1 rounded"
                      style={{ 
                        fontFamily: 'Courier New, monospace',
                        backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.1)'
                      }}
                    >
                      {tab.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>

      {/* نافذة تفاصيل المستهدف */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl dialog-rtl" style={{ direction: 'rtl' }}>
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تفاصيل المستهدف
            </DialogTitle>
            <DialogDescription className="dialog-description" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {selectedTarget?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedTarget && (
            <div className="space-y-3">
              {/* العداد التنازلي الكبير */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 card-rtl">
                <CardContent className="p-3">
                  <p className="text-sm mb-2 text-center" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    الوقت المتبقي للإنجاز
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {(() => {
                      const countdown = calculateCountdown(selectedTarget.targetDate);
                      return (
                        <>
                          <div className="text-center bg-white p-2 rounded shadow-sm">
                            <p className="text-2xl mb-1" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.days}
                            </p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              يوم
                            </p>
                          </div>
                          <div className="text-center bg-white p-2 rounded shadow-sm">
                            <p className="text-2xl mb-1" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.hours}
                            </p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              ساعة
                            </p>
                          </div>
                          <div className="text-center bg-white p-2 rounded shadow-sm">
                            <p className="text-2xl mb-1" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.minutes}
                            </p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              دقيقة
                            </p>
                          </div>
                          <div className="text-center bg-white p-2 rounded shadow-sm">
                            <p className="text-2xl mb-1" style={{ fontFamily: 'Courier New, monospace', color: '#2563eb' }}>
                              {countdown.seconds}
                            </p>
                            <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
                              ثانية
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* المراحل الرئيسية */}
              <Card className="card-rtl">
                <CardHeader className="card-header-dense">
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    المراحل الرئيسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="dense-card-content">
                  <div className="space-y-2">
                    {selectedTarget.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start gap-2">
                        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.isCompleted ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {milestone.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <span className="text-xs text-white" style={{ fontFamily: 'Courier New, monospace' }}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                            {milestone.title}
                          </p>
                          <p className="text-xs" style={{ fontFamily: 'Courier New, monospace', color: '#6b7280' }}>
                            {milestone.date} {milestone.completedDate && `(تم: ${milestone.completedDate})`}
                          </p>
                        </div>
                        <Badge className={milestone.isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {milestone.isCompleted ? 'مكتمل' : 'معلق'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex gap-2" style={{ direction: 'rtl' }}>
            <Button 
              variant="outline" 
              className="dense-button"
              onClick={() => setShowDetailsDialog(false)}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TargetsGoalsScreen;
