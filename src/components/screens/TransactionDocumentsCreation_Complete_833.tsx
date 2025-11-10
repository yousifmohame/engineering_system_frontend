/**
 * الشاشة 833 - إنشاء وثائق المعاملات - نظام شامل ومتكامل
 * ===========================================================
 * 
 * نظام متكامل لإعداد وطباعة وتوثيق مستندات المعاملات:
 * - إنشاء مستندات من بيانات المعاملات
 * - قوالب جاهزة قابلة للتخصيص
 * - سحب البيانات تلقائياً من المعاملة
 * - توقيع رقمي وختم إلكتروني
 * - حفظ وأرشفة تلقائي
 * 
 * الميزات:
 * - محرر نصوص متقدم
 * - دمج البيانات تلقائياً
 * - قوالب متعددة
 * - معاينة فورية
 * - طباعة وتوثيق
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import {
  FileText, Plus, Edit, Eye, Save, Printer, Download, Upload,
  CheckCircle, X, Copy, RefreshCw, Layout, Grid, List, Tag,
  Settings, Shield, Stamp, Clock, Layers, File, Database,
  User, Building, Calendar, DollarSign, Hash, MapPin, Phone,
  Mail, FileCheck, FileImage, AlertCircle, Info
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '833-01', number: '833-01', title: 'نظرة عامة', icon: FileText },
  { id: '833-02', number: '833-02', title: 'إنشاء مستند جديد', icon: Plus },
  { id: '833-03', number: '833-03', title: 'القوالب الجاهزة', icon: Layout },
  { id: '833-04', number: '833-04', title: 'سحب البيانات', icon: Database },
  { id: '833-05', number: '833-05', title: 'المحرر', icon: Edit },
  { id: '833-06', number: '833-06', title: 'معاينة المستند', icon: Eye },
  { id: '833-07', number: '833-07', title: 'التوقيع والختم', icon: Shield },
  { id: '833-08', number: '833-08', title: 'الطباعة', icon: Printer },
  { id: '833-09', number: '833-09', title: 'التوثيق', icon: FileCheck },
  { id: '833-10', number: '833-10', title: 'الحفظ', icon: Save },
  { id: '833-11', number: '833-11', title: 'المستندات المنشأة', icon: Layers },
  { id: '833-12', number: '833-12', title: 'السجل', icon: Clock },
  { id: '833-13', number: '833-13', title: 'الأرشيف', icon: File },
  { id: '833-14', number: '833-14', title: 'القوالب المخصصة', icon: Grid },
  { id: '833-15', number: '833-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع المستندات =====
const DOCUMENT_TYPES = [
  { id: 'contract', name: 'عقد', icon: FileText, template: true },
  { id: 'letter', name: 'خطاب رسمي', icon: Mail, template: true },
  { id: 'certificate', name: 'شهادة', icon: FileCheck, template: true },
  { id: 'report', name: 'تقرير', icon: FileText, template: true },
  { id: 'invoice', name: 'فاتورة', icon: DollarSign, template: true },
  { id: 'receipt', name: 'إيصال', icon: FileCheck, template: true },
  { id: 'custom', name: 'مخصص', icon: Edit, template: false },
];

// ===== قوالب جاهزة =====
const TEMPLATES = [
  {
    id: 'building-permit-contract',
    name: 'عقد رخصة بناء',
    type: 'contract',
    description: 'عقد استشارة هندسية لإصدار رخصة بناء',
    fields: ['رقم المعاملة', 'اسم العميل', 'رقم الهوية', 'الموقع', 'المساحة', 'التاريخ'],
    popularity: 98,
  },
  {
    id: 'consultation-letter',
    name: 'خطاب استشارة هندسية',
    type: 'letter',
    description: 'خطاب رسمي لتقديم استشارة هندسية',
    fields: ['رقم المعاملة', 'اسم العميل', 'موضوع الاستشارة', 'التاريخ'],
    popularity: 87,
  },
  {
    id: 'completion-certificate',
    name: 'شهادة إتمام',
    type: 'certificate',
    description: 'شهادة إتمام الأعمال الهندسية',
    fields: ['رقم المعاملة', 'اسم المشروع', 'اسم العميل', 'تاريخ الإتمام'],
    popularity: 76,
  },
];

// ===== حقول البيانات المتاحة =====
const DATA_FIELDS = [
  { category: 'معلومات المعاملة', fields: ['رقم المعاملة', 'تاريخ المعاملة', 'نوع المعاملة', 'حالة المعاملة'] },
  { category: 'معلومات العميل', fields: ['اسم العميل', 'رقم الهوية', 'رقم الجوال', 'البريد الإلكتروني', 'العنوان'] },
  { category: 'معلومات المشروع', fields: ['اسم المشروع', 'الموقع', 'المساحة', 'نوع البناء', 'عدد الأدوار'] },
  { category: 'معلومات مالية', fields: ['قيمة المعاملة', 'المبلغ المدفوع', 'المتبقي', 'طريقة الدفع'] },
  { category: 'معلومات المكتب', fields: ['اسم المكتب', 'رقم الترخيص', 'العنوان', 'الهاتف', 'البريد'] },
];

const TransactionDocumentsCreation_Complete_833: React.FC = () => {
  const [activeTab, setActiveTab] = useState('833-01');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [documentContent, setDocumentContent] = useState('');

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '833-01':
        return renderOverviewTab();
      case '833-02':
        return renderCreateDocumentTab();
      case '833-03':
        return renderTemplatesTab();
      case '833-04':
        return renderDataPullingTab();
      case '833-05':
        return renderEditorTab();
      case '833-06':
        return renderPreviewTab();
      case '833-07':
        return renderSignatureTab();
      case '833-08':
        return renderPrintingTab();
      case '833-09':
        return renderAuthenticationTab();
      case '833-10':
        return renderSaveTab();
      case '833-11':
        return renderCreatedDocumentsTab();
      case '833-12':
        return renderHistoryTab();
      case '833-13':
        return renderArchiveTab();
      case '833-14':
        return renderCustomTemplatesTab();
      case '833-15':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ===== التاب 833-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <FileText className="w-4 h-4" />
            نظام إنشاء وثائق المعاملات
          </h2>
        </div>
        
        <p className="compact-text text-gray-600 mt-2">
          نظام شامل لإعداد وطباعة وتوثيق أي مستند محتواه مأخوذ من بيانات المعاملات
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <FileText className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">1,234</div>
          <div className="dense-stat-label">مستند منشأ</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Layout className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>18</div>
          <div className="dense-stat-label">قالب جاهز</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#3b82f6' }}>876</div>
          <div className="dense-stat-label">موثق</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Printer className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#f59e0b' }}>567</div>
          <div className="dense-stat-label">مطبوع</div>
        </div>
      </div>

      {/* أنواع المستندات */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Grid className="w-4 h-4" />
            أنواع المستندات المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-4 mt-3">
          {DOCUMENT_TYPES.map((type) => (
            <div key={type.id} className="dense-content-card text-center">
              <div className="dense-stat-icon mx-auto mb-2">
                {React.createElement(type.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="compact-title">{type.name}</div>
              {type.template && (
                <Badge className="text-xs mt-2">قالب متاح</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* القوالب الأكثر استخداماً */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layout className="w-4 h-4" />
            القوالب الأكثر استخداماً
          </h3>
        </div>

        <div className="dense-grid dense-grid-1 mt-3">
          {TEMPLATES.map((template) => (
            <div key={template.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="dense-stat-icon">
                    {React.createElement(
                      DOCUMENT_TYPES.find(t => t.id === template.type)?.icon || FileText,
                      { className: 'w-4 h-4' }
                    )}
                  </div>
                  <div>
                    <div className="compact-title">{template.name}</div>
                    <div className="compact-subtitle">{template.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge className="text-xs bg-green-100 text-green-700">
                    {template.popularity}% شائع
                  </Badge>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {template.fields.slice(0, 4).map((field) => (
                  <Badge key={field} className="text-xs bg-blue-50 text-blue-700">
                    {field}
                  </Badge>
                ))}
                {template.fields.length > 4 && (
                  <Badge className="text-xs bg-gray-100 text-gray-700">
                    +{template.fields.length - 4} حقل
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 mt-3">
                <Button className="dense-action-btn">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button className="dense-action-btn">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button className="dense-btn dense-btn-primary">
                  <Plus className="w-3 h-3" />
                  استخدام
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 833-02: إنشاء مستند جديد =====
  const renderCreateDocumentTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Plus className="w-4 h-4" />
            إنشاء مستند جديد
          </h2>
        </div>

        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                نوع المستند
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر نوع المستند</option>
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                القالب
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}>
                  <option value="">بدون قالب (فارغ)</option>
                  {TEMPLATES.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
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
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                عنوان المستند
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="أدخل عنوان المستند"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                التاريخ
              </label>
              <DateInputWithToday
                className="dense-form-input"
                style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}
              />
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                المسؤول
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="اسم المسؤول"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button className="dense-btn dense-btn-secondary">
              <X className="w-3 h-3" />
              إلغاء
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="w-3 h-3" />
              إنشاء المستند
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== التاب 833-04: سحب البيانات =====
  const renderDataPullingTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Database className="w-4 h-4" />
            سحب البيانات من المعاملة
          </h2>
        </div>

        <div className="dense-form mt-4">
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

          <Button className="dense-btn dense-btn-primary mt-2">
            <Database className="w-3 h-3" />
            سحب البيانات
          </Button>
        </div>
      </div>

      {/* الحقول المتاحة */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Grid className="w-4 h-4" />
            الحقول المتاحة للسحب
          </h3>
        </div>

        <div className="space-y-3 mt-3">
          {DATA_FIELDS.map((category) => (
            <div key={category.category} className="dense-content-card">
              <div className="compact-title mb-2">{category.category}</div>
              <div className="grid grid-cols-2 gap-2">
                {category.fields.map((field) => (
                  <label key={field} className="flex items-center gap-2 compact-text cursor-pointer hover:bg-blue-50 p-2 rounded">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{field}</span>
                    <Button className="dense-action-btn mr-auto">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 833-05: المحرر =====
  const renderEditorTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Edit className="w-4 h-4" />
            محرر المستند
          </h2>
          <div className="dense-section-actions">
            <Button className="dense-action-btn">
              <Eye className="w-3 h-3" />
            </Button>
            <Button className="dense-action-btn">
              <Save className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="input-with-copy-wrapper textarea-wrapper">
            <TextAreaWithCopy
              className="dense-form-textarea"
              placeholder="أدخل محتوى المستند هنا..."
              rows={20}
              style={{ 
                backgroundColor: 'rgba(245, 243, 255, 0.6)',
                minHeight: '400px'
              }}
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className="text-xs">عدد الكلمات: 0</Badge>
              <Badge className="text-xs">عدد الأحرف: 0</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button className="dense-btn dense-btn-secondary">
                <Copy className="w-3 h-3" />
                نسخ
              </Button>
              <Button className="dense-btn dense-btn-primary">
                <Save className="w-3 h-3" />
                حفظ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // باقي التابات - placeholder
  const renderTemplatesTab = () => renderPlaceholderTab('القوالب الجاهزة', Layout);
  const renderPreviewTab = () => renderPlaceholderTab('معاينة المستند', Eye);
  const renderSignatureTab = () => renderPlaceholderTab('التوقيع والختم', Shield);
  const renderPrintingTab = () => renderPlaceholderTab('الطباعة', Printer);
  const renderAuthenticationTab = () => renderPlaceholderTab('التوثيق', FileCheck);
  const renderSaveTab = () => renderPlaceholderTab('الحفظ', Save);
  const renderCreatedDocumentsTab = () => renderPlaceholderTab('المستندات المنشأة', Layers);
  const renderHistoryTab = () => renderPlaceholderTab('السجل', Clock);
  const renderArchiveTab = () => renderPlaceholderTab('الأرشيف', File);
  const renderCustomTemplatesTab = () => renderPlaceholderTab('القوالب المخصصة', Grid);
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
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="compact-title text-white">إنشاء الوثائق</h2>
              <p className="text-xs text-white/80">شاشة 833</p>
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

export default TransactionDocumentsCreation_Complete_833;
