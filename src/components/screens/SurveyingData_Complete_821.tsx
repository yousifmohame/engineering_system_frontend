/**
 * الشاشة 821 - إدارة البيانات المساحية - نظام شامل ومتكامل
 * ===========================================================
 * 
 * نظام متكامل لإدارة:
 * - الرفوعات المساحية (Survey Measurements)
 * - القرارات المساحية الإلكترونية (Electronic Survey Decisions)
 * 
 * الأغراض المتاحة:
 * - إصدار رخصة بناء
 * - تحديث صك
 * - تعديل بيانات صك
 * - نقل ملكية
 * - تعديل مكونات
 * - أخرى
 * 
 * الميزات:
 * - تحديد الموقع من الخريطة والإحداثيات
 * - QR Code لكل بيان
 * - ترقيم تلقائي لكل نوع
 * - ربط بالمعاملات
 * - نظام سايد بار رأسي للتابات
 * - تكثيف شامل للمعلومات
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import {
  Map, Plus, Edit, Trash2, Eye, Download, Upload, CheckCircle,
  MapPin, Compass, Ruler, Target, Navigation, Globe, Satellite,
  FileText, QrCode, Link, Calendar, User, Building, Home,
  Search, Filter, RefreshCw, Printer, Save, X, Copy, Check,
  AlertCircle, Info, TrendingUp, BarChart, PieChart, Activity,
  Layers, Move, ZoomIn, ZoomOut, Maximize2, Settings
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 15 تبويب شامل =====
const TABS_CONFIG = [
  { id: '821-01', number: '821-01', title: 'نظرة عامة', icon: Map },
  { id: '821-02', number: '821-02', title: 'رفوعات مساحية', icon: Compass },
  { id: '821-03', number: '821-03', title: 'قرارات مساحية', icon: FileText },
  { id: '821-04', number: '821-04', title: 'خريطة تفاعلية', icon: Satellite },
  { id: '821-05', number: '821-05', title: 'الإحداثيات', icon: Target },
  { id: '821-06', number: '821-06', title: 'QR Codes', icon: QrCode },
  { id: '821-07', number: '821-07', title: 'ربط المعاملات', icon: Link },
  { id: '821-08', number: '821-08', title: 'رخص البناء', icon: Building },
  { id: '821-09', number: '821-09', title: 'الصكوك', icon: Home },
  { id: '821-10', number: '821-10', title: 'نقل الملكية', icon: Move },
  { id: '821-11', number: '821-11', title: 'المقاسات', icon: Ruler },
  { id: '821-12', number: '821-12', title: 'الإحصائيات', icon: BarChart },
  { id: '821-13', number: '821-13', title: 'التقارير', icon: PieChart },
  { id: '821-14', number: '821-14', title: 'الأرشيف', icon: Layers },
  { id: '821-15', number: '821-15', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع البيانات المساحية =====
const SURVEY_TYPES = [
  { id: 'survey-measurement', name: 'رفع مساحي', prefix: 'SM', color: 'blue' },
  { id: 'electronic-decision', name: 'قرار مساحي إلكتروني', prefix: 'ED', color: 'purple' },
];

// ===== الأغراض المتاحة =====
const SURVEY_PURPOSES = [
  { id: 'building-permit', name: 'إصدار رخصة بناء', icon: Building, color: 'green' },
  { id: 'deed-update', name: 'تحديث صك', icon: RefreshCw, color: 'blue' },
  { id: 'deed-modification', name: 'تعديل بيانات صك', icon: Edit, color: 'yellow' },
  { id: 'ownership-transfer', name: 'نقل ملكية', icon: Move, color: 'purple' },
  { id: 'components-modification', name: 'تعديل مكونات', icon: Settings, color: 'orange' },
  { id: 'other', name: 'أخرى', icon: Info, color: 'gray' },
];

// ===== حالات البيانات المساحية =====
const SURVEY_STATUSES = [
  { id: 'pending', name: 'قيد المراجعة', color: 'yellow' },
  { id: 'approved', name: 'معتمد', color: 'green' },
  { id: 'rejected', name: 'مرفوض', color: 'red' },
  { id: 'in-progress', name: 'قيد التنفيذ', color: 'blue' },
  { id: 'completed', name: 'مكتمل', color: 'purple' },
];

const SurveyingData_Complete_821: React.FC = () => {
  const [activeTab, setActiveTab] = useState('821-01');
  const [selectedType, setSelectedType] = useState('survey-measurement');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

  // ===== بيانات تجريبية للرفوعات المساحية =====
  const surveyMeasurements = [
    {
      id: 'SM-2025-001',
      type: 'survey-measurement',
      purpose: 'building-permit',
      projectName: 'مشروع فيلا سكنية',
      location: 'حي النرجس، الرياض',
      area: '750',
      coordinates: { lat: '24.7136', lng: '46.6753' },
      status: 'approved',
      date: '2025-01-15',
      surveyor: 'م. أحمد العلي',
      hasQR: true,
      linkedTransactions: ['TRX-2025-1234'],
    },
    {
      id: 'SM-2025-002',
      type: 'survey-measurement',
      purpose: 'deed-update',
      projectName: 'تحديث بيانات قطعة أرض',
      location: 'حي الملقا، الرياض',
      area: '1200',
      coordinates: { lat: '24.7740', lng: '46.6177' },
      status: 'in-progress',
      date: '2025-01-20',
      surveyor: 'م. سارة المحمد',
      hasQR: true,
      linkedTransactions: ['TRX-2025-1235'],
    },
  ];

  // ===== بيانات تجريبية للقرارات المساحية =====
  const electronicDecisions = [
    {
      id: 'ED-2025-001',
      type: 'electronic-decision',
      purpose: 'ownership-transfer',
      projectName: 'نقل ملكية عقار',
      location: 'حي العليا، الرياض',
      area: '600',
      coordinates: { lat: '24.7077', lng: '46.6751' },
      status: 'approved',
      date: '2025-01-10',
      approver: 'م. خالد الأحمد',
      hasQR: true,
      linkedTransactions: ['TRX-2025-1236', 'TRX-2025-1237'],
    },
  ];

  const allSurveyData = [...surveyMeasurements, ...electronicDecisions];

  // ===== إحصائيات النظرة العامة =====
  const stats = {
    total: allSurveyData.length,
    approved: allSurveyData.filter(d => d.status === 'approved').length,
    pending: allSurveyData.filter(d => d.status === 'pending').length,
    inProgress: allSurveyData.filter(d => d.status === 'in-progress').length,
    totalArea: allSurveyData.reduce((sum, d) => sum + parseFloat(d.area), 0),
  };

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '821-01':
        return renderOverviewTab();
      case '821-02':
        return renderSurveyMeasurementsTab();
      case '821-03':
        return renderElectronicDecisionsTab();
      case '821-04':
        return renderInteractiveMapTab();
      case '821-05':
        return renderCoordinatesTab();
      case '821-06':
        return renderQRCodesTab();
      case '821-07':
        return renderLinkedTransactionsTab();
      case '821-08':
        return renderBuildingPermitsTab();
      case '821-09':
        return renderDeedsTab();
      case '821-10':
        return renderOwnershipTransferTab();
      case '821-11':
        return renderMeasurementsTab();
      case '821-12':
        return renderStatisticsTab();
      case '821-13':
        return renderReportsTab();
      case '821-14':
        return renderArchiveTab();
      case '821-15':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ===== التاب 821-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="dense-layout">
      {/* هيدر مُكثف */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Map className="w-4 h-4" />
            نظام إدارة البيانات المساحية
          </h2>
          <div className="dense-section-actions">
            <Button className="dense-btn dense-btn-primary">
              <Plus className="w-3 h-3" />
              إضافة بيان مساحي
            </Button>
          </div>
        </div>
        
        <p className="compact-text text-gray-600 mt-2">
          نظام شامل لإدارة الرفوعات المساحية والقرارات المساحية الإلكترونية مع دعم الخرائط والإحداثيات وQR Codes
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <Map className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.total}</div>
          <div className="dense-stat-label">إجمالي البيانات</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>{stats.approved}</div>
          <div className="dense-stat-label">معتمد</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Activity className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#3b82f6' }}>{stats.inProgress}</div>
          <div className="dense-stat-label">قيد التنفيذ</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#f59e0b' }}>{stats.pending}</div>
          <div className="dense-stat-label">قيد المراجعة</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <Ruler className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.totalArea.toLocaleString()}</div>
          <div className="dense-stat-label">م² إجمالي المساحة</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <QrCode className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{allSurveyData.filter(d => d.hasQR).length}</div>
          <div className="dense-stat-label">QR Codes</div>
        </div>
      </div>

      {/* أحدث البيانات المساحية */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Activity className="w-4 h-4" />
            أحدث البيانات المساحية
          </h3>
          <Button className="dense-btn dense-btn-secondary">
            <Eye className="w-3 h-3" />
            عرض الكل
          </Button>
        </div>

        <div className="dense-grid dense-grid-1 mt-4">
          {allSurveyData.slice(0, 3).map((data) => (
            <div key={data.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {React.createElement(
                    SURVEY_TYPES.find(t => t.id === data.type)?.prefix === 'SM' ? Compass : FileText,
                    { className: 'w-5 h-5 text-blue-600' }
                  )}
                  <div>
                    <div className="compact-title">{data.id}</div>
                    <div className="compact-subtitle">{data.projectName}</div>
                  </div>
                </div>
                <Badge 
                  className={`text-xs ${
                    data.status === 'approved' ? 'bg-green-100 text-green-700' :
                    data.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    data.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {SURVEY_STATUSES.find(s => s.id === data.status)?.name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-1 compact-text">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{data.location}</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <Ruler className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{data.area} م²</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{data.date}</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <QrCode className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{data.hasQR ? 'متوفر' : 'غير متوفر'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {SURVEY_PURPOSES.map((purpose) => {
                    if (purpose.id === data.purpose) {
                      return (
                        <Badge key={purpose.id} className="text-xs bg-purple-100 text-purple-700">
                          {React.createElement(purpose.icon, { className: 'w-3 h-3 ml-1' })}
                          {purpose.name}
                        </Badge>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Button className="dense-action-btn">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* الأغراض الشائعة */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Target className="w-4 h-4" />
            الأغراض المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-3 mt-3">
          {SURVEY_PURPOSES.map((purpose) => (
            <div key={purpose.id} className="dense-content-card text-center">
              <div className="dense-stat-icon mx-auto mb-2" 
                style={{ 
                  background: purpose.color === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                             purpose.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                             purpose.color === 'yellow' ? 'rgba(245, 158, 11, 0.1)' :
                             purpose.color === 'purple' ? 'rgba(124, 58, 237, 0.1)' :
                             purpose.color === 'orange' ? 'rgba(249, 115, 22, 0.1)' :
                             'rgba(107, 114, 128, 0.1)',
                  color: purpose.color === 'green' ? '#10b981' :
                        purpose.color === 'blue' ? '#3b82f6' :
                        purpose.color === 'yellow' ? '#f59e0b' :
                        purpose.color === 'purple' ? '#7c3aed' :
                        purpose.color === 'orange' ? '#f97316' :
                        '#6b7280'
                }}
              >
                {React.createElement(purpose.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="compact-title">{purpose.name}</div>
              <div className="compact-subtitle">
                {allSurveyData.filter(d => d.purpose === purpose.id).length} بيان
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 821-02: الرفوعات المساحية =====
  const renderSurveyMeasurementsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Compass className="w-4 h-4" />
            الرفوعات المساحية
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Plus className="w-3 h-3" />
            إضافة رفع مساحي
          </Button>
        </div>

        {/* نموذج إضافة رفع مساحي */}
        <div className="dense-form mt-4">
          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                رقم الرفع المساحي
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="SM-2025-XXX"
                  value="SM-2025-003"
                  style={{ 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                الغرض
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر الغرض</option>
                  {SURVEY_PURPOSES.map(purpose => (
                    <option key={purpose.id} value={purpose.id}>{purpose.name}</option>
                  ))}
                </SelectWithCopy>
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                اسم المشروع
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="أدخل اسم المشروع"
                  style={{ 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                الموقع
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="أدخل الموقع"
                  style={{ 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                المساحة (م²)
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  type="number"
                  className="dense-form-input"
                  placeholder="0"
                  style={{ 
                    backgroundColor: 'rgba(236, 253, 245, 0.6)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
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
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                خط العرض (Latitude)
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="24.7136"
                  style={{ 
                    backgroundColor: 'rgba(236, 253, 245, 0.6)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                خط الطول (Longitude)
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="46.6753"
                  style={{ 
                    backgroundColor: 'rgba(236, 253, 245, 0.6)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                المساح
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="اسم المساح"
                  style={{ 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              ملاحظات
            </label>
            <div className="input-with-copy-wrapper textarea-wrapper">
              <TextAreaWithCopy
                className="dense-form-textarea"
                placeholder="أدخل أي ملاحظات إضافية"
                rows={3}
                style={{ 
                  backgroundColor: 'rgba(245, 243, 255, 0.6)',
                  fontFamily: 'Tajawal, sans-serif'
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <Button className="dense-btn dense-btn-secondary">
              <X className="w-3 h-3" />
              إلغاء
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <Save className="w-3 h-3" />
              حفظ الرفع المساحي
            </Button>
          </div>
        </div>
      </div>

      {/* قائمة الرفوعات المساحية */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layers className="w-4 h-4" />
            الرفوعات المساحية المسجلة ({surveyMeasurements.length})
          </h3>
        </div>

        <div className="dense-grid dense-grid-2 mt-3">
          {surveyMeasurements.map((measurement) => (
            <div key={measurement.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="compact-title text-blue-600">{measurement.id}</div>
                  <div className="compact-text font-medium mt-1">{measurement.projectName}</div>
                </div>
                <Badge className="text-xs bg-blue-100 text-blue-700">
                  رفع مساحي
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 compact-text">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{measurement.location}</span>
                </div>
                <div className="flex items-center gap-2 compact-text">
                  <Ruler className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">المساحة: {measurement.area} م²</span>
                </div>
                <div className="flex items-center gap-2 compact-text">
                  <Target className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 font-mono text-xs">
                    {measurement.coordinates.lat}, {measurement.coordinates.lng}
                  </span>
                </div>
                <div className="flex items-center gap-2 compact-text">
                  <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{measurement.surveyor}</span>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${
                  measurement.status === 'approved' ? 'bg-green-100 text-green-700' :
                  measurement.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {SURVEY_STATUSES.find(s => s.id === measurement.status)?.name}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button className="dense-action-btn">
                    <QrCode className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 821-03: القرارات المساحية الإلكترونية =====
  const renderElectronicDecisionsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <FileText className="w-4 h-4" />
            القرارات المساحية الإلكترونية
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Plus className="w-3 h-3" />
            إضافة قرار مساحي
          </Button>
        </div>

        <p className="compact-text text-gray-600 mt-2">
          القرارات المساحية الإلكترونية المعتمدة رسمياً من الجهات المختصة
        </p>
      </div>

      {/* قائمة القرارات */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layers className="w-4 h-4" />
            القرارات المسجلة ({electronicDecisions.length})
          </h3>
        </div>

        <div className="dense-grid dense-grid-1 mt-3">
          {electronicDecisions.map((decision) => (
            <div key={decision.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="compact-title text-purple-600">{decision.id}</div>
                    <div className="compact-text font-medium mt-1">{decision.projectName}</div>
                  </div>
                </div>
                <Badge className="text-xs bg-purple-100 text-purple-700">
                  قرار إلكتروني
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 compact-text">
                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{decision.location}</span>
                  </div>
                  <div className="flex items-center gap-2 compact-text">
                    <Ruler className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">المساحة: {decision.area} م²</span>
                  </div>
                  <div className="flex items-center gap-2 compact-text">
                    <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{decision.approver}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 compact-text">
                    <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{decision.date}</span>
                  </div>
                  <div className="flex items-center gap-2 compact-text">
                    <Link className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{decision.linkedTransactions.length} معاملة مرتبطة</span>
                  </div>
                  <div className="flex items-center gap-2 compact-text">
                    <QrCode className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{decision.hasQR ? 'متوفر' : 'غير متوفر'}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 ml-1" />
                    {SURVEY_STATUSES.find(s => s.id === decision.status)?.name}
                  </Badge>
                  {SURVEY_PURPOSES.map((purpose) => {
                    if (purpose.id === decision.purpose) {
                      return (
                        <Badge key={purpose.id} className="text-xs bg-blue-100 text-blue-700">
                          {React.createElement(purpose.icon, { className: 'w-3 h-3 ml-1' })}
                          {purpose.name}
                        </Badge>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Button className="dense-action-btn">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Printer className="w-3 h-3" />
                  </Button>
                  <Button className="dense-action-btn">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 821-04: الخريطة التفاعلية =====
  const renderInteractiveMapTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Satellite className="w-4 h-4" />
            الخريطة التفاعلية
          </h2>
          <div className="dense-section-actions">
            <Button className="dense-btn dense-btn-secondary">
              <ZoomIn className="w-3 h-3" />
              تكبير
            </Button>
            <Button className="dense-btn dense-btn-secondary">
              <ZoomOut className="w-3 h-3" />
              تصغير
            </Button>
            <Button className="dense-btn dense-btn-primary">
              <Maximize2 className="w-3 h-3" />
              ملء الشاشة
            </Button>
          </div>
        </div>
      </div>

      {/* محاكاة الخريطة */}
      <div className="dense-section">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-blue-200 overflow-hidden">
          {/* هيدر الخريطة */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="compact-title">خريطة البيانات المساحية</div>
                  <div className="compact-subtitle">{allSurveyData.length} موقع مُسجل</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="dense-btn dense-btn-secondary">
                  <Layers className="w-3 h-3" />
                  الطبقات
                </Button>
                <Button className="dense-btn dense-btn-secondary">
                  <Filter className="w-3 h-3" />
                  التصفية
                </Button>
              </div>
            </div>
          </div>

          {/* محتوى الخريطة */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <Map className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <div className="compact-title text-gray-700">الخريطة التفاعلية</div>
                <div className="compact-text text-gray-500 mt-1">
                  سيتم عرض جميع المواقع المساحية على الخريطة
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* أدوات التحكم */}
          <div className="absolute left-4 top-20 space-y-2 z-10">
            <Button className="w-10 h-10 bg-white shadow-lg border border-gray-200 p-0 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </Button>
            <Button className="w-10 h-10 bg-white shadow-lg border border-gray-200 p-0 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </Button>
            <Button className="w-10 h-10 bg-white shadow-lg border border-gray-200 p-0 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </Button>
            <Button className="w-10 h-10 bg-white shadow-lg border border-gray-200 p-0 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* قائمة المواقع */}
          <div className="absolute right-4 top-20 bottom-4 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 overflow-y-auto z-10">
            <h3 className="compact-title mb-3">المواقع المُسجلة</h3>
            <div className="space-y-2">
              {allSurveyData.map((data, index) => (
                <div key={data.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="compact-title text-xs">{data.id}</div>
                      <div className="compact-subtitle text-xs">{data.projectName}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {data.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 font-mono">
                      <Target className="w-3 h-3" />
                      {data.coordinates.lat}, {data.coordinates.lng}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // باقي التابات - placeholder
  const renderCoordinatesTab = () => renderPlaceholderTab('الإحداثيات', Target);
  const renderQRCodesTab = () => renderPlaceholderTab('QR Codes', QrCode);
  const renderLinkedTransactionsTab = () => renderPlaceholderTab('ربط المعاملات', Link);
  const renderBuildingPermitsTab = () => renderPlaceholderTab('رخص البناء', Building);
  const renderDeedsTab = () => renderPlaceholderTab('الصكوك', Home);
  const renderOwnershipTransferTab = () => renderPlaceholderTab('نقل الملكية', Move);
  const renderMeasurementsTab = () => renderPlaceholderTab('المقاسات', Ruler);
  const renderStatisticsTab = () => renderPlaceholderTab('الإحصائيات', BarChart);
  const renderReportsTab = () => renderPlaceholderTab('التقارير', PieChart);
  const renderArchiveTab = () => renderPlaceholderTab('الأرشيف', Layers);
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
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="compact-title text-white">البيانات المساحية</h2>
              <p className="text-xs text-white/80">شاشة 821</p>
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

export default SurveyingData_Complete_821;
