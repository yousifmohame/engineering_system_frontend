/**
 * الشاشة 831 - طباعة التقارير العامة - نظام شامل ومتكامل
 * =========================================================
 * 
 * نظام متكامل لطباعة التقارير عن أي شيء بالنظام:
 * - تقارير المعاملات (معاملة واحدة أو متعددة)
 * - تقارير العملاء (عميل واحد أو متعددين)
 * - تقارير التصنيفات
 * - تقارير مخصصة حسب الفترة
 * - تقارير إحصائية
 * - تقارير تحليلية
 * 
 * الميزات:
 * - اختيار نوع التقرير
 * - فلترة متقدمة
 * - معاينة قبل الطباعة
 * - تصدير PDF/Excel/Word
 * - قوالب جاهزة
 * - تصميم مخصص
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import {
  Printer, FileText, Download, Eye, Settings, Filter, Calendar,
  Users, Building, File, BarChart, PieChart, TrendingUp, Table,
  CheckCircle, X, Plus, Edit, Copy, Search, RefreshCw, Trash2,
  FileSpreadsheet, FileImage, FileCheck, Layers, Layout,
  Grid, List, Tag, Hash, Clock, MapPin, DollarSign, Percent
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '831-01', number: '831-01', title: 'نظرة عامة', icon: Printer },
  { id: '831-02', number: '831-02', title: 'تقارير المعاملات', icon: FileText },
  { id: '831-03', number: '831-03', title: 'تقارير العملاء', icon: Users },
  { id: '831-04', number: '831-04', title: 'تقارير التصنيفات', icon: Tag },
  { id: '831-05', number: '831-05', title: 'تقارير الفترة', icon: Calendar },
  { id: '831-06', number: '831-06', title: 'تقارير إحصائية', icon: BarChart },
  { id: '831-07', number: '831-07', title: 'تقارير تحليلية', icon: TrendingUp },
  { id: '831-08', number: '831-08', title: 'تقارير مالية', icon: DollarSign },
  { id: '831-09', number: '831-09', title: 'قوالب التقارير', icon: Layout },
  { id: '831-10', number: '831-10', title: 'معاينة الطباعة', icon: Eye },
  { id: '831-11', number: '831-11', title: 'إعدادات الطباعة', icon: Settings },
  { id: '831-12', number: '831-12', title: 'التصدير', icon: Download },
  { id: '831-13', number: '831-13', title: 'السجل', icon: Clock },
  { id: '831-14', number: '831-14', title: 'التقارير المحفوظة', icon: Layers },
  { id: '831-15', number: '831-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع التقارير =====
const REPORT_TYPES = [
  { id: 'transaction-single', name: 'تقرير معاملة واحدة', icon: FileText, category: 'transactions' },
  { id: 'transaction-multiple', name: 'تقرير معاملات متعددة', icon: Layers, category: 'transactions' },
  { id: 'client-single', name: 'تقرير عميل واحد', icon: Users, category: 'clients' },
  { id: 'client-multiple', name: 'تقرير عملاء متعددين', icon: Building, category: 'clients' },
  { id: 'category', name: 'تقرير تصنيف', icon: Tag, category: 'categories' },
  { id: 'period', name: 'تقرير فترة زمنية', icon: Calendar, category: 'period' },
  { id: 'statistical', name: 'تقرير إحصائي', icon: BarChart, category: 'statistics' },
  { id: 'analytical', name: 'تقرير تحليلي', icon: TrendingUp, category: 'analytics' },
  { id: 'financial', name: 'تقرير مالي', icon: DollarSign, category: 'financial' },
  { id: 'custom', name: 'تقرير مخصص', icon: Grid, category: 'custom' },
];

// ===== تنسيقات التصدير =====
const EXPORT_FORMATS = [
  { id: 'pdf', name: 'PDF', icon: FileText, color: 'red' },
  { id: 'excel', name: 'Excel', icon: FileSpreadsheet, color: 'green' },
  { id: 'word', name: 'Word', icon: FileText, color: 'blue' },
  { id: 'image', name: 'صورة', icon: FileImage, color: 'purple' },
];

const GeneralReportsPrinting_Complete_831: React.FC = () => {
  const [activeTab, setActiveTab] = useState('831-01');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '831-01':
        return renderOverviewTab();
      case '831-02':
        return renderTransactionReportsTab();
      case '831-03':
        return renderClientReportsTab();
      case '831-04':
        return renderCategoryReportsTab();
      case '831-05':
        return renderPeriodReportsTab();
      case '831-06':
        return renderStatisticalReportsTab();
      case '831-07':
        return renderAnalyticalReportsTab();
      case '831-08':
        return renderFinancialReportsTab();
      case '831-09':
        return renderTemplatesTab();
      case '831-10':
        return renderPrintPreviewTab();
      case '831-11':
        return renderPrintSettingsTab();
      case '831-12':
        return renderExportTab();
      case '831-13':
        return renderHistoryTab();
      case '831-14':
        return renderSavedReportsTab();
      case '831-15':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ===== التاب 831-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Printer className="w-4 h-4" />
            نظام طباعة التقارير العامة
          </h2>
        </div>
        
        <p className="compact-text text-gray-600 mt-2">
          نظام شامل لطباعة التقارير عن أي شيء بالنظام - معاملات، عملاء، تصنيفات، وغيرها
        </p>
      </div>

      {/* اختيار نوع التقرير */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <FileText className="w-4 h-4" />
            اختر نوع التقرير
          </h3>
        </div>

        <div className="dense-grid dense-grid-3 mt-3">
          {REPORT_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedReportType(type.id)}
              className={`dense-content-card cursor-pointer ${
                selectedReportType === type.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="dense-stat-icon">
                  {React.createElement(type.icon, { className: 'w-4 h-4' })}
                </div>
                {selectedReportType === type.id && (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="compact-title text-center">{type.name}</div>
              <Badge className="text-xs mx-auto mt-2">{type.category}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <Printer className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">156</div>
          <div className="dense-stat-label">تقرير مطبوع اليوم</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Download className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>89</div>
          <div className="dense-stat-label">تقرير مُصدّر</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <Layout className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#7c3aed' }}>24</div>
          <div className="dense-stat-label">قالب جاهز</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Layers className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#f59e0b' }}>312</div>
          <div className="dense-stat-label">تقرير محفوظ</div>
        </div>
      </div>

      {/* تنسيقات التصدير */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Download className="w-4 h-4" />
            تنسيقات التصدير المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-4 mt-3">
          {EXPORT_FORMATS.map((format) => (
            <div key={format.id} className="dense-content-card text-center">
              <div className="dense-stat-icon mx-auto mb-2"
                style={{
                  background: format.color === 'red' ? 'rgba(239, 68, 68, 0.1)' :
                             format.color === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                             format.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                             'rgba(124, 58, 237, 0.1)',
                  color: format.color === 'red' ? '#ef4444' :
                        format.color === 'green' ? '#10b981' :
                        format.color === 'blue' ? '#3b82f6' :
                        '#7c3aed'
                }}
              >
                {React.createElement(format.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="compact-title">{format.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 831-02: تقارير المعاملات =====
  const renderTransactionReportsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <FileText className="w-4 h-4" />
            تقارير المعاملات
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Printer className="w-3 h-3" />
            طباعة
          </Button>
        </div>

        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                نوع التقرير
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر نوع التقرير</option>
                  <option value="single">معاملة واحدة</option>
                  <option value="multiple">معاملات متعددة</option>
                  <option value="period">معاملات حسب الفترة</option>
                  <option value="status">معاملات حسب الحالة</option>
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                رقم المعاملة
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="TRX-2025-XXXXX"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                حالة المعاملة
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}>
                  <option value="">جميع الحالات</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="approved">معتمدة</option>
                  <option value="completed">مكتملة</option>
                </SelectWithCopy>
              </div>
            </div>
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                من تاريخ
              </label>
              <DateInputWithToday
                className="dense-form-input"
                style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}
              />
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                إلى تاريخ
              </label>
              <DateInputWithToday
                className="dense-form-input"
                style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}
              />
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                نوع المعاملة
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select">
                  <option value="">جميع الأنواع</option>
                  <option value="building">رخصة بناء</option>
                  <option value="renovation">ترميم</option>
                  <option value="demolition">هدم</option>
                </SelectWithCopy>
              </div>
            </div>
          </div>

          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              البيانات المطلوبة في التقرير
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['رقم المعاملة', 'العميل', 'التاريخ', 'الحالة', 'المبلغ', 'الموظف المسؤول', 'الملاحظات', 'المرفقات', 'التوقيعات'].map((field) => (
                <label key={field} className="flex items-center gap-2 compact-text cursor-pointer hover:bg-blue-50 p-2 rounded">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>{field}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== التاب 831-03: ت��ارير العملاء =====
  const renderClientReportsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Users className="w-4 h-4" />
            تقارير العملاء
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Printer className="w-3 h-3" />
            طباعة
          </Button>
        </div>

        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                نوع التقرير
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر نوع التقرير</option>
                  <option value="single">عميل واحد</option>
                  <option value="multiple">عملاء متعددين</option>
                  <option value="category">حسب التصنيف</option>
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                العميل
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="ابحث عن عميل..."
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                تصنيف العميل
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}>
                  <option value="">جميع التصنيفات</option>
                  <option value="vip">VIP</option>
                  <option value="regular">عادي</option>
                  <option value="government">حكومي</option>
                </SelectWithCopy>
              </div>
            </div>
          </div>

          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              البيانات المطلوبة
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['الاسم', 'رقم الهوية', 'الجوال', 'البريد الإلكتروني', 'العنوان', 'عدد المعاملات', 'إجمالي المبالغ', 'آخر معاملة', 'تاريخ التسجيل'].map((field) => (
                <label key={field} className="flex items-center gap-2 compact-text cursor-pointer hover:bg-blue-50 p-2 rounded">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>{field}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // باقي التابات - placeholder
  const renderCategoryReportsTab = () => renderPlaceholderTab('تقارير التصنيفات', Tag);
  const renderPeriodReportsTab = () => renderPlaceholderTab('تقارير الفترة', Calendar);
  const renderStatisticalReportsTab = () => renderPlaceholderTab('تقارير إحصائية', BarChart);
  const renderAnalyticalReportsTab = () => renderPlaceholderTab('تقارير تحليلية', TrendingUp);
  const renderFinancialReportsTab = () => renderPlaceholderTab('تقارير مالية', DollarSign);
  const renderTemplatesTab = () => renderPlaceholderTab('قوالب التقارير', Layout);
  const renderPrintPreviewTab = () => renderPlaceholderTab('معاينة الطباعة', Eye);
  const renderPrintSettingsTab = () => renderPlaceholderTab('إعدادات الطباعة', Settings);
  const renderExportTab = () => renderPlaceholderTab('التصدير', Download);
  const renderHistoryTab = () => renderPlaceholderTab('السجل', Clock);
  const renderSavedReportsTab = () => renderPlaceholderTab('التقارير المحفوظة', Layers);
  const renderSettingsTab = () => renderPlaceholderTab('الإعدادات', Settings);

  const renderPlaceholderTab = (title: string, Icon: any) => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Icon className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="compact-title text-gray-700 mb-2">تبويب {title}</h3>
          <p className="compact-text text-gray-500">
            سيتم تطوير هذا التبويب قريباً
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="compact-title text-white">طباعة التقارير</h2>
              <p className="text-xs text-white/80">شاشة 831</p>
            </div>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          <div className="space-y-1">
            {TABS_CONFIG.map((tab, index) => (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <div className={`vertical-tab-icon ${activeTab === tab.id ? 'active' : ''}`}>
                    {React.createElement(tab.icon, { className: 'w-4 h-4' })}
                  </div>
                  
                  <div className="vertical-tab-title-condensed">
                    {tab.title}
                  </div>
                  
                  <div className={`vertical-tab-number-condensed ${activeTab === tab.id ? 'active' : ''}`}>
                    {tab.number}
                  </div>
                </button>

                {index < TABS_CONFIG.length - 1 && (
                  <div className="vertical-tab-separator-condensed" />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="text-center">
            <div className="compact-subtitle text-gray-600">إجمالي التبويبات</div>
            <div className="compact-title text-blue-600">{TABS_CONFIG.length}</div>
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {TABS_CONFIG.find(t => t.id === activeTab)?.number}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="dense-btn dense-btn-secondary">
                <RefreshCw className="w-3 h-3" />
                تحديث
              </Button>
              <Button className="dense-btn dense-btn-secondary">
                <Download className="w-3 h-3" />
                تصدير
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="vertical-tabs-content-body">
          {renderTabContent()}
        </ScrollArea>
      </div>
    </div>
  );
};

export default GeneralReportsPrinting_Complete_831;
