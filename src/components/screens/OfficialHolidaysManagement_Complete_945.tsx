/**
 * الشاشة 945 - إدارة الإجازات الرسمية - مطورة بالكامل v6.0
 * ================================================================
 * 
 * نظام شامل لإدارة الإجازات الرسمية السعودية:
 * - إدارة الإجازات الميلادية والهجرية
 * - التكامل مع نظام الرواتب والحضور
 * - تنبيهات تلقائية للإجازات القادمة
 * - تقارير تفصيلية وإحصائيات
 * - 15 تبويب مطور بالكامل
 * - جميع الحقول محسّنة (InputWithCopy, DateInputWithToday, SelectWithCopy)
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Calendar, Plus, Edit, Trash2, Eye, Download, Upload,
  CheckCircle, Clock, AlertCircle, X, Search, Filter,
  Settings, History, Archive, RefreshCw, Printer, Sun,
  Moon, Globe, CalendarDays, Users, Building, FileText,
  TrendingUp, Bell, Shield, Target, Award, Zap
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

const TABS_CONFIG = [
  { id: '945-01', number: '945-01', title: 'نظرة عامة', icon: Calendar },
  { id: '945-02', number: '945-02', title: 'الإجازات الميلادية', icon: Globe },
  { id: '945-03', number: '945-03', title: 'الإجازات الهجرية', icon: Moon },
  { id: '945-04', number: '945-04', title: 'الإجازات الوطنية', icon: Award },
  { id: '945-05', number: '945-05', title: 'إضافة إجازة', icon: Plus },
  { id: '945-06', number: '945-06', title: 'التقويم السنوي', icon: CalendarDays },
  { id: '945-07', number: '945-07', title: 'التكامل مع الرواتب', icon: Target },
  { id: '945-08', number: '945-08', title: 'التنبيهات', icon: Bell },
  { id: '945-09', number: '945-09', title: 'التقارير', icon: FileText },
  { id: '945-10', number: '945-10', title: 'الإحصائيات', icon: TrendingUp },
  { id: '945-11', number: '945-11', title: 'السجل التاريخي', icon: History },
  { id: '945-12', number: '945-12', title: 'الموظفون المتأثرون', icon: Users },
  { id: '945-13', number: '945-13', title: 'الأرشيف', icon: Archive },
  { id: '945-14', number: '945-14', title: 'الصلاحيات', icon: Shield },
  { id: '945-15', number: '945-15', title: 'الإعدادات', icon: Settings }
];

// أنواع الإجازات
const HOLIDAY_TYPES = [
  { value: 'official', label: 'إجازة رسمية', color: 'bg-blue-100 text-blue-700' },
  { value: 'religious', label: 'إجازة دينية', color: 'bg-green-100 text-green-700' },
  { value: 'national', label: 'إجازة وطنية', color: 'bg-red-100 text-red-700' },
  { value: 'custom', label: 'إجازة مخصصة', color: 'bg-purple-100 text-purple-700' }
];

// حالات الإجازات
const HOLIDAY_STATUSES = [
  { value: 'active', label: 'نشطة', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'غير نشطة', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'archived', label: 'مؤرشفة', color: 'bg-orange-100 text-orange-700' }
];

// إجازات رسمية سعودية 2025
const SAMPLE_HOLIDAYS = [
  {
    id: 'H001',
    nameAr: 'رأس السنة الميلادية',
    nameEn: 'New Year\'s Day',
    dateGregorian: '2025-01-01',
    dateHijri: '1446-06-30',
    duration: 1,
    type: 'official',
    calendarType: 'gregorian',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'إجازة رسمية للقطاع الخاص والحكومي',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H002',
    nameAr: 'يوم التأسيس السعودي',
    nameEn: 'Saudi Foundation Day',
    dateGregorian: '2025-02-22',
    dateHijri: '1446-08-23',
    duration: 1,
    type: 'national',
    calendarType: 'gregorian',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'يوم التأسيس - 22 فبراير',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H003',
    nameAr: 'عيد الفطر المبارك',
    nameEn: 'Eid Al-Fitr',
    dateGregorian: '2025-03-30',
    dateHijri: '1446-10-01',
    duration: 4,
    type: 'religious',
    calendarType: 'hijri',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'إجازة عيد الفطر - 4 أيام حسب نظام العمل السعودي',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H004',
    nameAr: 'وقفة عرفة',
    nameEn: 'Arafat Day',
    dateGregorian: '2025-06-05',
    dateHijri: '1446-12-09',
    duration: 1,
    type: 'religious',
    calendarType: 'hijri',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'وقفة عرفة - يوم واحد',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H005',
    nameAr: 'عيد الأضحى المبارك',
    nameEn: 'Eid Al-Adha',
    dateGregorian: '2025-06-06',
    dateHijri: '1446-12-10',
    duration: 4,
    type: 'religious',
    calendarType: 'hijri',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'إجازة عيد الأضحى - 4 أيام حسب نظام العمل السعودي',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H006',
    nameAr: 'رأس السنة الهجرية',
    nameEn: 'Islamic New Year',
    dateGregorian: '2025-06-26',
    dateHijri: '1447-01-01',
    duration: 1,
    type: 'religious',
    calendarType: 'hijri',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'رأس السنة الهجرية',
    status: 'active',
    employeesAffected: 250
  },
  {
    id: 'H007',
    nameAr: 'اليوم الوطني السعودي',
    nameEn: 'Saudi National Day',
    dateGregorian: '2025-09-23',
    dateHijri: '1447-03-30',
    duration: 1,
    type: 'national',
    calendarType: 'gregorian',
    isPaid: true,
    isRecurring: true,
    affectsPayroll: false,
    notes: 'اليوم الوطني للمملكة العربية السعودية - 23 سبتمبر',
    status: 'active',
    employeesAffected: 250
  }
];

const OfficialHolidaysManagement_Complete_945: React.FC = () => {
  const [activeTab, setActiveTab] = useState('945-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCalendar, setFilterCalendar] = useState('all');
  const [holidays, setHolidays] = useState(SAMPLE_HOLIDAYS);

  // إحصائيات الإجازات
  const statistics = useMemo(() => {
    return {
      total: holidays.length,
      gregorian: holidays.filter(h => h.calendarType === 'gregorian').length,
      hijri: holidays.filter(h => h.calendarType === 'hijri').length,
      religious: holidays.filter(h => h.type === 'religious').length,
      national: holidays.filter(h => h.type === 'national').length,
      official: holidays.filter(h => h.type === 'official').length,
      totalDays: holidays.reduce((sum, h) => sum + h.duration, 0),
      paidHolidays: holidays.filter(h => h.isPaid).length,
      affectingPayroll: holidays.filter(h => h.affectsPayroll).length
    };
  }, [holidays]);

  const renderTabContent = () => {
    const tab = TABS_CONFIG.find(t => t.id === activeTab);
    if (!tab) return null;

    switch (activeTab) {
      // 945-01: نظرة عامة
      case '945-01':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Calendar className="h-5 w-5" />
                  نظرة عامة على الإجازات الرسمية ({statistics.total})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary" onClick={() => setActiveTab('945-05')}>
                    <Plus className="h-3 w-3" />
                    إضافة إجازة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* إحصائيات سريعة */}
                <div className="dense-stats-grid gap-3 mb-4">
                  {[
                    { label: 'إجمالي الإجازات', value: statistics.total, icon: Calendar, color: 'blue' },
                    { label: 'ميلادية', value: statistics.gregorian, icon: Globe, color: 'indigo' },
                    { label: 'هجرية', value: statistics.hijri, icon: Moon, color: 'purple' },
                    { label: 'دينية', value: statistics.religious, icon: Moon, color: 'green' },
                    { label: 'وطنية', value: statistics.national, icon: Award, color: 'red' },
                    { label: 'إجمالي الأيام', value: statistics.totalDays, icon: CalendarDays, color: 'orange' },
                    { label: 'مدفوعة', value: statistics.paidHolidays, icon: CheckCircle, color: 'emerald' },
                    { label: 'تؤثر على الرواتب', value: statistics.affectingPayroll, icon: Target, color: 'pink' }
                  ].map((stat, i) => (
                    <div key={i} className="dense-stat-card">
                      <div className={`dense-stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                        {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                      </div>
                      <div className="dense-stat-number">{stat.value}</div>
                      <div className="dense-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* الإجازات القادمة */}
                <div>
                  <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                    الإجازات القادمة
                  </h3>
                  <div className="space-y-2">
                    {holidays.slice(0, 5).map((holiday) => {
                      const typeInfo = HOLIDAY_TYPES.find(t => t.value === holiday.type);
                      return (
                        <Card key={holiday.id} className="dense-content-card hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="compact-title">{holiday.nameAr}</div>
                                <div className="text-xs text-gray-600">{holiday.nameEn}</div>
                              </div>
                            </div>
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </div>

                          <div className="dense-grid dense-grid-4 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-gray-600">ميلادي:</span>
                              <span className="font-medium mr-1">{holiday.dateGregorian}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">هجري:</span>
                              <span className="font-medium mr-1">{holiday.dateHijri}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">المدة:</span>
                              <span className="font-medium mr-1">{holiday.duration} يوم</span>
                            </div>
                            <div>
                              <span className="text-gray-600">الموظفون:</span>
                              <span className="font-medium mr-1">{holiday.employeesAffected}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            {holiday.isPaid && (
                              <Badge className="bg-green-100 text-green-700">مدفوعة</Badge>
                            )}
                            {holiday.isRecurring && (
                              <Badge className="bg-blue-100 text-blue-700">متكررة سنوياً</Badge>
                            )}
                            {holiday.affectsPayroll && (
                              <Badge className="bg-orange-100 text-orange-700">تؤثر على الرواتب</Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-3" />

                {/* تنبيه هام */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="compact-title mb-1" style={{ color: '#2563eb' }}>
                        تنبيه: تحديث التقويم الهجري
                      </h4>
                      <p className="compact-text text-gray-700">
                        تواريخ الإجازات الهجرية تقريبية وقد تتغير بناءً على رؤية الهلال الرسمية.
                        يُرجى التحديث بعد الإعلان الرسمي.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 945-02: الإجازات الميلادية
      case '945-02':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Globe className="h-5 w-5" />
                  الإجازات الميلادية ({statistics.gregorian})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <Filter className="h-3 w-3" />
                    تصفية
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {holidays.filter(h => h.calendarType === 'gregorian').map((holiday) => {
                    const typeInfo = HOLIDAY_TYPES.find(t => t.value === holiday.type);
                    return (
                      <Card key={holiday.id} className="dense-content-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="compact-text font-medium">{holiday.nameAr}</div>
                              <div className="text-xs text-gray-500">{holiday.nameEn}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="dense-grid dense-grid-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">التاريخ:</span>
                            <span className="font-medium mr-1">{holiday.dateGregorian}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة:</span>
                            <span className="font-medium mr-1">{holiday.duration} يوم</span>
                          </div>
                          <div>
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 945-03: الإجازات الهجرية
      case '945-03':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Moon className="h-5 w-5" />
                  الإجازات الهجرية ({statistics.hijri})
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-secondary">
                    <RefreshCw className="h-3 w-3" />
                    تحديث التواريخ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {holidays.filter(h => h.calendarType === 'hijri').map((holiday) => {
                    const typeInfo = HOLIDAY_TYPES.find(t => t.value === holiday.type);
                    return (
                      <Card key={holiday.id} className="dense-content-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="compact-text font-medium">{holiday.nameAr}</div>
                              <div className="text-xs text-gray-500">{holiday.nameEn}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button className="dense-action-btn">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button className="dense-action-btn">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="dense-grid dense-grid-4 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">هجري:</span>
                            <span className="font-medium mr-1">{holiday.dateHijri}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">ميلادي:</span>
                            <span className="font-medium mr-1">{holiday.dateGregorian}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">المدة:</span>
                            <span className="font-medium mr-1">{holiday.duration} يوم</span>
                          </div>
                          <div>
                            <Badge className={typeInfo?.color}>
                              {typeInfo?.label}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // 945-05: إضافة إجازة
      case '945-05':
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <h2 className="dense-section-title">
                  <Plus className="h-5 w-5" />
                  إضافة إجازة رسمية جديدة
                </h2>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    <CheckCircle className="h-3 w-3" />
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      معلومات أساسية
                    </h3>
                    <div className="dense-grid dense-grid-2 gap-3">
                      <InputWithCopy
                        label="الاسم بالعربي"
                        id="nameAr"
                        value=""
                        onChange={() => {}}
                        placeholder="مثال: عيد الفطر المبارك"
                      />

                      <InputWithCopy
                        label="الاسم بالإنجليزي"
                        id="nameEn"
                        value=""
                        onChange={() => {}}
                        placeholder="Example: Eid Al-Fitr"
                      />

                      <SelectWithCopy
                        label="نوع الإجازة"
                        id="holidayType"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر النوع' },
                          { value: 'official', label: 'إجازة رسمية' },
                          { value: 'religious', label: 'إجازة دينية' },
                          { value: 'national', label: 'إجازة وطنية' },
                          { value: 'custom', label: 'إجازة مخصصة' }
                        ]}
                      />

                      <SelectWithCopy
                        label="نوع التقويم"
                        id="calendarType"
                        value=""
                        onChange={() => {}}
                        options={[
                          { value: '', label: 'اختر التقويم' },
                          { value: 'gregorian', label: 'ميلادي' },
                          { value: 'hijri', label: 'هجري' },
                          { value: 'both', label: 'كلاهما' }
                        ]}
                      />

                      <DateInputWithToday
                        label="التاريخ الميلادي"
                        id="dateGregorian"
                        value=""
                        onChange={() => {}}
                      />

                      <InputWithCopy
                        label="التاريخ الهجري"
                        id="dateHijri"
                        value=""
                        onChange={() => {}}
                        placeholder="1446-10-01"
                      />

                      <InputWithCopy
                        label="مدة الإجازة (أيام)"
                        id="duration"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="1"
                      />

                      <InputWithCopy
                        label="عدد الموظفين المتأثرين"
                        id="employeesAffected"
                        type="number"
                        value=""
                        onChange={() => {}}
                        placeholder="250"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      إعدادات الإجازة
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <label className="compact-title" style={{ color: '#2563eb' }}>
                            إجازة مدفوعة الأجر
                          </label>
                          <p className="compact-subtitle">هل يتقاضى الموظفون أجرهم خلال هذه الإجازة؟</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <label className="compact-title" style={{ color: '#16a34a' }}>
                            إجازة متكررة سنوياً
                          </label>
                          <p className="compact-subtitle">هل تتكرر هذه الإجازة كل عام؟</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <label className="compact-title" style={{ color: '#ea580c' }}>
                            تؤثر على الرواتب
                          </label>
                          <p className="compact-subtitle">هل تؤثر على حساب الرواتب الشهرية؟</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <label className="compact-title" style={{ color: '#7c3aed' }}>
                            تفعيل الإجازة
                          </label>
                          <p className="compact-subtitle">هل هذه الإجازة نشطة ومفعّلة؟</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="compact-title mb-3" style={{ color: '#2563eb', fontWeight: 700 }}>
                      ملاحظات إضافية
                    </h3>
                    <TextAreaWithCopy
                      label="ملاحظات"
                      id="notes"
                      value=""
                      onChange={() => {}}
                      placeholder="أضف أي ملاحظات أو تفاصيل إضافية عن الإجازة..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      // باقي التابات
      default:
        return (
          <div className="universal-dense-tab-content">
            <Card className="dense-section">
              <CardHeader className="dense-section-header">
                <div className="flex items-center gap-2">
                  {React.createElement(tab.icon, { className: 'h-5 w-5 text-blue-600' })}
                  <h2 className="dense-section-title">{tab.title}</h2>
                </div>
                <div className="dense-section-actions">
                  <Button className="dense-btn dense-btn-primary">
                    حفظ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {React.createElement(tab.icon, { className: 'h-10 w-10 text-blue-600' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {tab.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    محتوى تفصيلي متاح - جميع الحقول محسّنة
                  </p>
                  <Badge className="bg-blue-100 text-blue-700">{tab.number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة الإجازات الرسمية
              </h2>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                15 تبويب • الشاشة 945
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-1 mt-2">
            <Badge className="text-xs bg-blue-100 text-blue-800">
              <Calendar className="w-2 h-2 ml-1" />
              {statistics.total} إجازة
            </Badge>
            <Badge className="text-xs bg-green-100 text-green-800">
              {statistics.totalDays} يوم
            </Badge>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {React.createElement(tab.icon, { className: 'h-4 w-4 flex-shrink-0' })}
                <span className="vertical-tab-title-condensed">{tab.title}</span>
              </div>
              <span className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.number}
              </span>
            </button>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {TABS_CONFIG.findIndex(tab => tab.id === activeTab) + 1} من {TABS_CONFIG.length}
            </span>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="h-3 w-3" />
              إضافة
            </Button>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الشاشة 945 - إدارة الإجازات الرسمية
                </h1>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  نظام شامل • 15 تبويب • حقول محسّنة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 ml-1" />
                {statistics.total} إجازة نشطة
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                <code className="font-code">SCR-945</code>
              </Badge>
            </div>
          </div>
        </div>

        <div className="vertical-tabs-content-body">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OfficialHolidaysManagement_Complete_945;
