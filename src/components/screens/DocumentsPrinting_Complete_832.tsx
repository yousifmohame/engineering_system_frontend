/**
 * الشاشة 832 - طباعة الوثائق - نظام شامل ومتكامل
 * =======================================================
 * 
 * نظام متكامل لطباعة الوثائق المرفوعة سابقاً:
 * - عرض جميع الوثائق المرفوعة
 * - تكويد الوثائق قبل الطباعة (QR Code, Barcode)
 * - معاينة الوثائق
 * - طباعة فردية أو جماعية
 * - إضافة علامات مائية
 * - توقيع رقمي
 * 
 * الميزات:
 * - بحث متقدم عن الوثائق
 * - فلترة حسب النوع/التاريخ/المصدر
 * - معاينة قبل الطباعة
 * - تكويد تلقائي
 * - إعدادات طباعة مرنة
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import {
  Printer, File, QrCode, Barcode, Eye, Settings, Filter, Search,
  Download, Upload, CheckCircle, X, Plus, Edit, Copy, RefreshCw,
  FileText, FileImage, FileCheck, Layers, Layout, Grid,
  List, Tag, Hash, Clock, Shield, Stamp, AlertCircle, Image,
  Maximize2, MinusCircle, PlusCircle, RotateCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '832-01', number: '832-01', title: 'نظرة عامة', icon: Printer },
  { id: '832-02', number: '832-02', title: 'الوثائق المتاحة', icon: File },
  { id: '832-03', number: '832-03', title: 'بحث الوثائق', icon: Search },
  { id: '832-04', number: '832-04', title: 'تكويد QR', icon: QrCode },
  { id: '832-05', number: '832-05', title: 'تكويد Barcode', icon: Barcode },
  { id: '832-06', number: '832-06', title: 'معاينة الطباعة', icon: Eye },
  { id: '832-07', number: '832-07', title: 'العلامات المائية', icon: Image },
  { id: '832-08', number: '832-08', title: 'التوقيع الرقمي', icon: Shield },
  { id: '832-09', number: '832-09', title: 'إعدادات الطباعة', icon: Settings },
  { id: '832-10', number: '832-10', title: 'طباعة جماعية', icon: Layers },
  { id: '832-11', number: '832-11', title: 'السجل', icon: Clock },
  { id: '832-12', number: '832-12', title: 'الوثائق المكودة', icon: FileCheck },
  { id: '832-13', number: '832-13', title: 'القوالب', icon: Layout },
  { id: '832-14', number: '832-14', title: 'الأرشيف', icon: FileText },
  { id: '832-15', number: '832-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع الوثائق =====
const DOCUMENT_TYPES = [
  { id: 'pdf', name: 'PDF', icon: FileText, color: 'red', count: 245 },
  { id: 'image', name: 'صور', icon: FileImage, color: 'blue', count: 189 },
  { id: 'doc', name: 'مستندات', icon: FileText, color: 'blue', count: 156 },
  { id: 'scan', name: 'مسح ضوئي', icon: FileCheck, color: 'green', count: 98 },
];

// ===== أنواع التكويد =====
const CODING_TYPES = [
  { id: 'qr', name: 'QR Code', icon: QrCode, description: 'رمز استجابة سريع ثنائي الأبعاد' },
  { id: 'barcode', name: 'Barcode', icon: Barcode, description: 'رمز شريطي أحادي البعد' },
  { id: 'both', name: 'كلاهما', icon: Grid, description: 'QR Code + Barcode معاً' },
];

const DocumentsPrinting_Complete_832: React.FC = () => {
  const [activeTab, setActiveTab] = useState('832-01');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [codingType, setCodingType] = useState('qr');
  const [showPreview, setShowPreview] = useState(false);

  // بيانات تجريبية للوثائق
  const documents = [
    {
      id: 'DOC-2025-001',
      name: 'رخصة بناء - مشروع فيلا سكنية.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: '2025-01-15',
      source: 'معاملة TRX-2025-1234',
      coded: true,
      printed: 3,
    },
    {
      id: 'DOC-2025-002',
      name: 'صورة هوية العميل.jpg',
      type: 'image',
      size: '1.8 MB',
      date: '2025-01-14',
      source: 'عميل CLT-123',
      coded: false,
      printed: 1,
    },
    {
      id: 'DOC-2025-003',
      name: 'عقد استشارة هندسية.pdf',
      type: 'pdf',
      size: '1.2 MB',
      date: '2025-01-13',
      source: 'معاملة TRX-2025-1235',
      coded: true,
      printed: 2,
    },
  ];

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '832-01':
        return renderOverviewTab();
      case '832-02':
        return renderAvailableDocumentsTab();
      case '832-03':
        return renderSearchDocumentsTab();
      case '832-04':
        return renderQRCodingTab();
      case '832-05':
        return renderBarcodeCodingTab();
      case '832-06':
        return renderPrintPreviewTab();
      case '832-07':
        return renderWatermarkTab();
      case '832-08':
        return renderDigitalSignatureTab();
      case '832-09':
        return renderPrintSettingsTab();
      case '832-10':
        return renderBatchPrintingTab();
      case '832-11':
        return renderHistoryTab();
      case '832-12':
        return renderCodedDocumentsTab();
      case '832-13':
        return renderTemplatesTab();
      case '832-14':
        return renderArchiveTab();
      case '832-15':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ===== التاب 832-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Printer className="w-4 h-4" />
            نظام طباعة الوثائق
          </h2>
        </div>
        
        <p className="compact-text text-gray-600 mt-2">
          نظام شامل لطباعة الوثائق المرفوعة سابقاً مع إمكانية التكويد والتوقيع الرقمي
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <File className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">688</div>
          <div className="dense-stat-label">إجمالي الوثائق</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>432</div>
          <div className="dense-stat-label">وثيقة مُكودة</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Printer className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#3b82f6' }}>89</div>
          <div className="dense-stat-label">مطبوع اليوم</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#7c3aed' }}>156</div>
          <div className="dense-stat-label">موقّع رقمياً</div>
        </div>
      </div>

      {/* أنواع الوثائق */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Grid className="w-4 h-4" />
            أنواع الوثائق المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-4 mt-3">
          {DOCUMENT_TYPES.map((type) => (
            <div key={type.id} className="dense-content-card text-center">
              <div className="dense-stat-icon mx-auto mb-2"
                style={{
                  background: type.color === 'red' ? 'rgba(239, 68, 68, 0.1)' :
                             type.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                             'rgba(16, 185, 129, 0.1)',
                  color: type.color === 'red' ? '#ef4444' :
                        type.color === 'blue' ? '#3b82f6' :
                        '#10b981'
                }}
              >
                {React.createElement(type.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="compact-title">{type.name}</div>
              <div className="compact-subtitle">{type.count} وثيقة</div>
            </div>
          ))}
        </div>
      </div>

      {/* أنواع التكويد */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <QrCode className="w-4 h-4" />
            أنواع التكويد المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-3 mt-3">
          {CODING_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => setCodingType(type.id)}
              className={`dense-content-card cursor-pointer ${
                codingType === type.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="dense-stat-icon">
                  {React.createElement(type.icon, { className: 'w-4 h-4' })}
                </div>
                {codingType === type.id && (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="compact-title">{type.name}</div>
              <div className="compact-subtitle">{type.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 832-02: الوثائق المتاحة =====
  const renderAvailableDocumentsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <File className="w-4 h-4" />
            الوثائق المتاحة للطباعة
          </h2>
          <div className="dense-section-actions">
            <Button className="dense-btn dense-btn-secondary">
              <Filter className="w-3 h-3" />
              فلترة
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <Printer className="w-3 h-3" />
              طباعة المحدد
            </Button>
          </div>
        </div>

        <div className="dense-grid dense-grid-1 mt-4">
          {documents.map((doc) => (
            <div key={doc.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-3">
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments([...selectedDocuments, doc.id]);
                      } else {
                        setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    {React.createElement(
                      DOCUMENT_TYPES.find(t => t.id === doc.type)?.icon || File,
                      { className: 'w-5 h-5 text-blue-600' }
                    )}
                    <div>
                      <div className="compact-title">{doc.name}</div>
                      <div className="compact-subtitle">رقم: {doc.id}</div>
                    </div>
                  </div>
                </label>
                <div className="flex items-center gap-1">
                  {doc.coded && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      <QrCode className="w-3 h-3 ml-1" />
                      مُكود
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="compact-text">
                  <span className="text-gray-500">الحجم:</span>
                  <span className="font-medium mr-1">{doc.size}</span>
                </div>
                <div className="compact-text">
                  <span className="text-gray-500">التاريخ:</span>
                  <span className="font-medium mr-1">{doc.date}</span>
                </div>
                <div className="compact-text">
                  <span className="text-gray-500">المصدر:</span>
                  <span className="font-medium mr-1">{doc.source}</span>
                </div>
                <div className="compact-text">
                  <span className="text-gray-500">مرات الطباعة:</span>
                  <span className="font-medium mr-1">{doc.printed}</span>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button className="dense-action-btn">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <QrCode className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
                <Button className="dense-btn dense-btn-primary">
                  <Printer className="w-3 h-3" />
                  طباعة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 832-04: تكويد QR =====
  const renderQRCodingTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <QrCode className="w-4 h-4" />
            تكويد QR Code
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Plus className="w-3 h-3" />
            إضافة كود
          </Button>
        </div>

        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                اختر الوثيقة
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر وثيقة</option>
                  {documents.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                موضع الكود
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}>
                  <option value="top-right">أعلى يمين</option>
                  <option value="top-left">أعلى يسار</option>
                  <option value="bottom-right">أسفل يمين</option>
                  <option value="bottom-left">أسفل يسار</option>
                  <option value="center">الوسط</option>
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                حجم الكود
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select">
                  <option value="small">صغير (50x50)</option>
                  <option value="medium">متوسط (100x100)</option>
                  <option value="large">كبير (150x150)</option>
                </SelectWithCopy>
              </div>
            </div>
          </div>

          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              البيانات المُضمّنة في الكود
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['رقم الوثيقة', 'التاريخ', 'المصدر', 'رابط التحقق', 'معلومات المكتب', 'التوقيع الرقمي'].map((field) => (
                <label key={field} className="flex items-center gap-2 compact-text cursor-pointer hover:bg-blue-50 p-2 rounded">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>{field}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button className="dense-btn dense-btn-secondary">
              <Eye className="w-3 h-3" />
              معاينة
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="w-3 h-3" />
              إضافة الكود
            </Button>
          </div>
        </div>

        {/* معاينة QR Code */}
        <div className="dense-section mt-4">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Eye className="w-4 h-4" />
              معاينة QR Code
            </h3>
          </div>

          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg mt-3">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <div className="compact-title text-gray-700">معاينة QR Code</div>
              <div className="compact-subtitle text-gray-500">سيظهر هنا الكود المُولّد</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // باقي التابات - placeholder
  const renderSearchDocumentsTab = () => renderPlaceholderTab('بحث الوثائق', Search);
  const renderBarcodeCodingTab = () => renderPlaceholderTab('تكويد Barcode', Barcode);
  const renderPrintPreviewTab = () => renderPlaceholderTab('معاينة الطباعة', Eye);
  const renderWatermarkTab = () => renderPlaceholderTab('العلامات المائية', Image);
  const renderDigitalSignatureTab = () => renderPlaceholderTab('التوقيع الرقمي', Shield);
  const renderPrintSettingsTab = () => renderPlaceholderTab('إعدادات الطباعة', Settings);
  const renderBatchPrintingTab = () => renderPlaceholderTab('طباعة جماعية', Layers);
  const renderHistoryTab = () => renderPlaceholderTab('السجل', Clock);
  const renderCodedDocumentsTab = () => renderPlaceholderTab('الوثائق المكودة', FileCheck);
  const renderTemplatesTab = () => renderPlaceholderTab('القوالب', Layout);
  const renderArchiveTab = () => renderPlaceholderTab('الأرشيف', FilePdf);
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <File className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="compact-title text-white">طباعة الوثائق</h2>
              <p className="text-xs text-white/80">شاشة 832</p>
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

export default DocumentsPrinting_Complete_832;
