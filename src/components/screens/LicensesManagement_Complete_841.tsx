/**
 * الشاشة 841 - إدارة الرخص - نظام شامل ومتكامل
 * =====================================================
 * 
 * نظام متكامل لإدارة جميع أنواع الرخص:
 * 1. رخص البناء (إلكترونية/يدوية)
 * 2. رخص الهدم (إلكترونية/يدوية)
 * 3. رخص التسوير والملاحق (إلكترونية/يدوية)
 * 4. رخص الترميم (إلكترونية فقط)
 * 5. رخص تجهيز الموقع (إلكترونية فقط)
 * 6. رخص التطوير الشامل (إلكترونية فقط)
 * 7. أنواع أخرى (إلكترونية فقط)
 * 
 * الميزات:
 * - إدخال يدوي أو استخلاص من المعاملات
 * - رفع وإدارة المستندات
 * - تحديد النوع (إلكتروني/يدوي) للأنواع المناسبة
 * - ربط بالمعاملات
 * - نظام إحصائيات شامل
 */

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import {
  FileText, Building, Trash2, Home, Wrench, MapPin, TrendingUp,
  Plus, Edit, Eye, Download, Upload, CheckCircle, X, Save, Copy,
  Search, Filter, RefreshCw, Printer, Link, Calendar, User,
  AlertCircle, Info, BarChart, PieChart, Clock, Settings, Layers,
  FileCheck, Hash, DollarSign, Activity, Zap, Shield, Star, ExternalLink
} from 'lucide-react';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from '../InputWithCopy';
import DateInputWithToday from '../DateInputWithToday';

// ===== تكوين التابات - 16 تبويب شامل =====
const TABS_CONFIG = [
  { id: '841-01', number: '841-01', title: 'نظرة عامة', icon: FileText },
  { id: '841-02', number: '841-02', title: 'رخص البناء', icon: Building },
  { id: '841-03', number: '841-03', title: 'رخص الهدم', icon: Trash2 },
  { id: '841-04', number: '841-04', title: 'رخص التسوير والملاحق', icon: Home },
  { id: '841-05', number: '841-05', title: 'رخص الترميم', icon: Wrench },
  { id: '841-06', number: '841-06', title: 'رخص تجهيز الموقع', icon: MapPin },
  { id: '841-07', number: '841-07', title: 'رخص التطوير الشامل', icon: TrendingUp },
  { id: '841-08', number: '841-08', title: 'أنواع أخرى', icon: Star },
  { id: '841-09', number: '841-09', title: 'رخص بناء خارجية', icon: ExternalLink },
  { id: '841-10', number: '841-10', title: 'الإحصائيات', icon: BarChart },
  { id: '841-11', number: '841-11', title: 'التقارير', icon: PieChart },
  { id: '841-12', number: '841-12', title: 'السجل', icon: Clock },
  { id: '841-13', number: '841-13', title: 'الوثائق المرفقة', icon: FileCheck },
  { id: '841-14', number: '841-14', title: 'ربط بالمعاملات', icon: Link },
  { id: '841-15', number: '841-15', title: 'الأرشيف', icon: Layers },
  { id: '841-16', number: '841-16', title: 'الإعدادات', icon: Settings },
];

// ===== أنواع الرخص =====
const LICENSE_TYPES = [
  { 
    id: 'building', 
    name: 'رخصة بناء', 
    icon: Building, 
    color: 'blue',
    allowManual: true, // يمكن أن تكون يدوية أو إلكترونية
    prefix: 'BLD'
  },
  { 
    id: 'demolition', 
    name: 'رخصة هدم', 
    icon: Trash2, 
    color: 'red',
    allowManual: true,
    prefix: 'DEM'
  },
  { 
    id: 'fencing', 
    name: 'رخصة تسوير وملاحق', 
    icon: Home, 
    color: 'green',
    allowManual: true,
    prefix: 'FNC'
  },
  { 
    id: 'renovation', 
    name: 'رخصة ترميم', 
    icon: Wrench, 
    color: 'orange',
    allowManual: false, // إلكترونية فقط
    prefix: 'RNV'
  },
  { 
    id: 'site-prep', 
    name: 'رخصة تجهيز موقع', 
    icon: MapPin, 
    color: 'purple',
    allowManual: false,
    prefix: 'STP'
  },
  { 
    id: 'comprehensive', 
    name: 'رخصة تطوير شامل', 
    icon: TrendingUp, 
    color: 'teal',
    allowManual: false,
    prefix: 'CMP'
  },
  { 
    id: 'other', 
    name: 'أنواع أخرى', 
    icon: Star, 
    color: 'gray',
    allowManual: false,
    prefix: 'OTH'
  },
];

// ===== حالات الرخص =====
const LICENSE_STATUSES = [
  { id: 'pending', name: 'قيد المراجعة', color: 'yellow' },
  { id: 'approved', name: 'معتمدة', color: 'green' },
  { id: 'rejected', name: 'مرفوضة', color: 'red' },
  { id: 'expired', name: 'منتهية', color: 'gray' },
  { id: 'renewed', name: 'مجددة', color: 'blue' },
  { id: 'cancelled', name: 'ملغاة', color: 'orange' },
];

const LicensesManagement_Complete_841: React.FC = () => {
  const [activeTab, setActiveTab] = useState('841-01');
  const [selectedLicenseType, setSelectedLicenseType] = useState('building');
  const [isElectronic, setIsElectronic] = useState(true);
  const [linkedTransaction, setLinkedTransaction] = useState('');
  const [externalLicenses, setExternalLicenses] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // بيانات تجريبية للرخص
  const licenses = [
    {
      id: 'BLD-2025-001',
      type: 'building',
      isElectronic: true,
      clientName: 'أحمد محمد العلي',
      projectName: 'فيلا سكنية - حي النرجس',
      location: 'حي النرجس، الرياض',
      area: '750',
      issueDate: '2025-01-15',
      expiryDate: '2026-01-15',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1234',
      documents: ['مخطط معماري', 'صورة الصك', 'رسم المساحة'],
      cost: '15000',
    },
    {
      id: 'BLD-2025-002',
      type: 'building',
      isElectronic: false,
      clientName: 'سارة خالد المحمد',
      projectName: 'عمارة سكنية - حي الملقا',
      location: 'حي الملقا، الرياض',
      area: '1200',
      issueDate: '2025-01-20',
      expiryDate: '2026-01-20',
      status: 'pending',
      linkedTransaction: 'TRX-2025-1235',
      documents: ['مخطط معماري', 'تقرير فني'],
      cost: '25000',
    },
    {
      id: 'DEM-2025-001',
      type: 'demolition',
      isElectronic: true,
      clientName: 'خالد عبدالله الأحمد',
      projectName: 'هدم مبنى قديم',
      location: 'حي العليا، الرياض',
      area: '600',
      issueDate: '2025-01-10',
      expiryDate: '2025-07-10',
      status: 'approved',
      linkedTransaction: 'TRX-2025-1236',
      documents: ['تقرير سلامة', 'إخلاء طرف'],
      cost: '8000',
    },
  ];

  // إحصائيات
  const stats = {
    total: licenses.length,
    approved: licenses.filter(l => l.status === 'approved').length,
    pending: licenses.filter(l => l.status === 'pending').length,
    electronic: licenses.filter(l => l.isElectronic).length,
    manual: licenses.filter(l => !l.isElectronic).length,
  };

  // ===== رندر محتوى التاب =====
  const renderTabContent = () => {
    switch (activeTab) {
      case '841-01':
        return renderOverviewTab();
      case '841-02':
        return renderBuildingLicensesTab();
      case '841-03':
        return renderDemolitionLicensesTab();
      case '841-04':
        return renderFencingLicensesTab();
      case '841-05':
        return renderRenovationLicensesTab();
      case '841-06':
        return renderSitePrepLicensesTab();
      case '841-07':
        return renderComprehensiveLicensesTab();
      case '841-08':
        return renderOtherLicensesTab();
      case '841-09':
        return renderExternalBuildingLicensesTab();
      case '841-10':
        return renderStatisticsTab();
      case '841-11':
        return renderReportsTab();
      case '841-12':
        return renderHistoryTab();
      case '841-13':
        return renderDocumentsTab();
      case '841-14':
        return renderTransactionLinkingTab();
      case '841-15':
        return renderArchiveTab();
      case '841-16':
        return renderSettingsTab();
      default:
        return null;
    }
  };

  // ===== التاب 841-01: نظرة عامة =====
  const renderOverviewTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <FileText className="w-4 h-4" />
            نظام إدارة الرخص الشامل
          </h2>
        </div>
        
        <p className="compact-text text-gray-600 mt-2">
          نظام متكامل لإدارة جميع أنواع الرخص الهندسية مع دعم الرخص الإلكترونية واليدوية
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="dense-stats-grid">
        <div className="dense-stat-card">
          <div className="dense-stat-icon">
            <FileText className="w-4 h-4" />
          </div>
          <div className="dense-stat-number">{stats.total}</div>
          <div className="dense-stat-label">إجمالي الرخص</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#10b981' }}>{stats.approved}</div>
          <div className="dense-stat-label">معتمدة</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#f59e0b' }}>{stats.pending}</div>
          <div className="dense-stat-label">قيد المراجعة</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Zap className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#3b82f6' }}>{stats.electronic}</div>
          <div className="dense-stat-label">إلكترونية</div>
        </div>

        <div className="dense-stat-card">
          <div className="dense-stat-icon" style={{ background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }}>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="dense-stat-number" style={{ color: '#6b7280' }}>{stats.manual}</div>
          <div className="dense-stat-label">يدوية</div>
        </div>
      </div>

      {/* أنواع الرخص */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layers className="w-4 h-4" />
            أنواع الرخص المتاحة
          </h3>
        </div>

        <div className="dense-grid dense-grid-3 mt-3">
          {LICENSE_TYPES.map((type) => (
            <div key={type.id} className="dense-content-card text-center">
              <div className="dense-stat-icon mx-auto mb-2"
                style={{
                  background: type.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                             type.color === 'red' ? 'rgba(239, 68, 68, 0.1)' :
                             type.color === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                             type.color === 'orange' ? 'rgba(249, 115, 22, 0.1)' :
                             type.color === 'purple' ? 'rgba(124, 58, 237, 0.1)' :
                             type.color === 'teal' ? 'rgba(20, 184, 166, 0.1)' :
                             'rgba(107, 114, 128, 0.1)',
                  color: type.color === 'blue' ? '#3b82f6' :
                        type.color === 'red' ? '#ef4444' :
                        type.color === 'green' ? '#10b981' :
                        type.color === 'orange' ? '#f97316' :
                        type.color === 'purple' ? '#7c3aed' :
                        type.color === 'teal' ? '#14b8a6' :
                        '#6b7280'
                }}
              >
                {React.createElement(type.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="compact-title">{type.name}</div>
              <div className="compact-subtitle mb-1">{type.prefix}-YYYY-XXX</div>
              {type.allowManual ? (
                <Badge className="text-xs bg-blue-100 text-blue-700">
                  إلكتروني/يدوي
                </Badge>
              ) : (
                <Badge className="text-xs bg-purple-100 text-purple-700">
                  إلكتروني فقط
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* أحدث الرخص */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Activity className="w-4 h-4" />
            أحدث الرخص الصادرة
          </h3>
          <Button className="dense-btn dense-btn-secondary">
            <Eye className="w-3 h-3" />
            عرض الكل
          </Button>
        </div>

        <div className="dense-grid dense-grid-1 mt-3">
          {licenses.slice(0, 3).map((license) => (
            <div key={license.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {React.createElement(
                    LICENSE_TYPES.find(t => t.id === license.type)?.icon || FileText,
                    { className: 'w-5 h-5 text-blue-600' }
                  )}
                  <div>
                    <div className="compact-title">{license.id}</div>
                    <div className="compact-subtitle">{license.projectName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {license.isElectronic ? (
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      <Zap className="w-3 h-3 ml-1" />
                      إلكترونية
                    </Badge>
                  ) : (
                    <Badge className="text-xs bg-gray-100 text-gray-700">
                      <FileCheck className="w-3 h-3 ml-1" />
                      يدوية
                    </Badge>
                  )}
                  <Badge 
                    className={`text-xs ${
                      license.status === 'approved' ? 'bg-green-100 text-green-700' :
                      license.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {LICENSE_STATUSES.find(s => s.id === license.status)?.name}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-1 compact-text">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.clientName}</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.location}</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.issueDate}</span>
                </div>
                <div className="flex items-center gap-1 compact-text">
                  <DollarSign className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.cost} ريال</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 mt-3">
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
          ))}
        </div>
      </div>
    </div>
  );

  // ===== التاب 841-02: رخص البناء =====
  const renderBuildingLicensesTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Building className="w-4 h-4" />
            رخص البناء
          </h2>
          <Button className="dense-btn dense-btn-primary">
            <Plus className="w-3 h-3" />
            إضافة رخصة بناء
          </Button>
        </div>

        <p className="compact-text text-gray-600 mt-2">
          يمكن إضافة رخص البناء كرخص إلكترونية أو يدوية
        </p>
      </div>

      {/* نموذج إضافة رخصة */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Plus className="w-4 h-4" />
            إضافة رخصة بناء جديدة
          </h3>
        </div>

        <div className="dense-form mt-4">
          {/* نوع الرخصة */}
          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              نوع الرخصة
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="licenseMode"
                  checked={isElectronic}
                  onChange={() => setIsElectronic(true)}
                  className="w-4 h-4"
                />
                <span className="compact-text">
                  <Zap className="w-4 h-4 inline-block ml-1 text-blue-600" />
                  إلكترونية
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="licenseMode"
                  checked={!isElectronic}
                  onChange={() => setIsElectronic(false)}
                  className="w-4 h-4"
                />
                <span className="compact-text">
                  <FileCheck className="w-4 h-4 inline-block ml-1 text-gray-600" />
                  يدوية
                </span>
              </label>
            </div>
          </div>

          {/* مصدر البيانات */}
          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              مصدر البيانات
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dataSource"
                  checked={linkedTransaction !== ''}
                  onChange={() => setLinkedTransaction('TRX-2025-')}
                  className="w-4 h-4"
                />
                <span className="compact-text">
                  <Link className="w-4 h-4 inline-block ml-1 text-blue-600" />
                  استخلاص من معاملة
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dataSource"
                  checked={linkedTransaction === ''}
                  onChange={() => setLinkedTransaction('')}
                  className="w-4 h-4"
                />
                <span className="compact-text">
                  <Edit className="w-4 h-4 inline-block ml-1 text-green-600" />
                  إدخال يدوي
                </span>
              </label>
            </div>
          </div>

          {/* إذا كان من معاملة */}
          {linkedTransaction !== '' && (
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                رقم المعاملة
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="TRX-2025-XXXXX"
                  value={linkedTransaction}
                  onChange={(e) => setLinkedTransaction(e.target.value)}
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>
          )}

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                رقم الرخصة
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="BLD-2025-XXX"
                  defaultValue="BLD-2025-003"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                اسم العميل
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  className="dense-form-input"
                  placeholder="أدخل اسم العميل"
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                />
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
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
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
                  style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
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
                  style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}
                />
              </div>
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                التكلفة (ريال)
              </label>
              <div className="input-with-copy-wrapper">
                <InputWithCopy
                  type="number"
                  className="dense-form-input"
                  placeholder="0"
                  style={{ backgroundColor: 'rgba(236, 253, 245, 0.6)' }}
                />
              </div>
            </div>
          </div>

          <div className="dense-form-row">
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                تاريخ الإصدار
              </label>
              <DateInputWithToday
                className="dense-form-input"
                style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}
              />
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                تاريخ الانتهاء
              </label>
              <DateInputWithToday
                className="dense-form-input"
                style={{ backgroundColor: 'rgba(254, 243, 199, 0.6)' }}
              />
            </div>

            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                الحالة
              </label>
              <div className="input-with-copy-wrapper">
                <SelectWithCopy className="dense-form-select" style={{ backgroundColor: 'rgba(251, 246, 255, 0.6)' }}>
                  <option value="">اختر الحالة</option>
                  {LICENSE_STATUSES.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </SelectWithCopy>
              </div>
            </div>
          </div>

          {/* رفع المستندات */}
          <div className="dense-form-group">
            <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
              رفع المستندات
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="compact-text text-gray-600">اسحب الملفات هنا أو انقر للرفع</p>
              <p className="compact-subtitle text-gray-500 mt-1">PDF, DOC, JPG, PNG (حتى 10MB)</p>
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
                style={{ backgroundColor: 'rgba(245, 243, 255, 0.6)' }}
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
              حفظ الرخصة
            </Button>
          </div>
        </div>
      </div>

      {/* قائمة رخص البناء */}
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layers className="w-4 h-4" />
            رخص البناء المسجلة
          </h3>
        </div>

        <div className="dense-grid dense-grid-2 mt-3">
          {licenses.filter(l => l.type === 'building').map((license) => (
            <div key={license.id} className="dense-content-card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="compact-title text-blue-600">{license.id}</div>
                  <div className="compact-text font-medium mt-1">{license.projectName}</div>
                </div>
                <div className="flex items-center gap-1">
                  {license.isElectronic ? (
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      إلكترونية
                    </Badge>
                  ) : (
                    <Badge className="text-xs bg-gray-100 text-gray-700">
                      يدوية
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 compact-text">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.clientName}</span>
                </div>
                <div className="flex items-center gap-2 compact-text">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{license.location}</span>
                </div>
                <div className="flex items-center gap-2 compact-text">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">المساحة: {license.area} م²</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between">
                <Badge 
                  className={`text-xs ${
                    license.status === 'approved' ? 'bg-green-100 text-green-700' :
                    license.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {LICENSE_STATUSES.find(s => s.id === license.status)?.name}
                </Badge>
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
    </div>
  );

  // التابات الأخرى - نفس النمط مع تغيير النوع
  const renderDemolitionLicensesTab = () => renderLicenseTypeTab('demolition', 'رخص الهدم', Trash2, true);
  const renderFencingLicensesTab = () => renderLicenseTypeTab('fencing', 'رخص التسوير والملاحق', Home, true);
  const renderRenovationLicensesTab = () => renderLicenseTypeTab('renovation', 'رخص الترميم', Wrench, false);
  const renderSitePrepLicensesTab = () => renderLicenseTypeTab('site-prep', 'رخص تجهيز الموقع', MapPin, false);
  const renderComprehensiveLicensesTab = () => renderLicenseTypeTab('comprehensive', 'رخص التطوير الشامل', TrendingUp, false);
  const renderOtherLicensesTab = () => renderLicenseTypeTab('other', 'أنواع أخرى', Star, false);
  
  // ===== التاب 841-09: رخص بناء خارجية =====
  const renderExternalBuildingLicensesTab = () => {
    const [externalLicenses, setExternalLicenses] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);

    return (
      <div className="dense-layout">
        <div className="dense-section">
          <div className="dense-section-header">
            <h2 className="dense-section-title">
              <ExternalLink className="w-4 h-4" />
              رخص بناء خارجية
            </h2>
            <Button className="dense-btn dense-btn-primary">
              <Plus className="w-3 h-3" />
              إضافة رخصة خارجية
            </Button>
          </div>
          
          <p className="compact-text text-gray-600 mt-2">
            نظام تسجيل الرخص التي تدخل المكتب من جهات خارجية مع إمكانية رفع صور وإدارة المستندات
          </p>
        </div>

        {/* نموذج إضافة رخصة خارجية */}
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Plus className="w-4 h-4" />
              تسجيل رخصة بناء خارجية جديدة
            </h3>
          </div>

          <div className="dense-form mt-4">
            <div className="dense-form-row">
              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  رقم الرخصة الخارجية *
                </label>
                <InputWithCopy
                  label=""
                  id="externalLicenseNumber"
                  placeholder="أدخل رقم الرخصة"
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  اسم المشروع *
                </label>
                <InputWithCopy
                  label=""
                  id="projectName"
                  placeholder="أدخل اسم المشروع"
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  الجهة المصدرة *
                </label>
                <SelectWithCopy
                  label=""
                  id="issuingAuthority"
                  options={[
                    { value: 'baladia', label: 'البلدية' },
                    { value: 'momra', label: 'وزارة الشؤون البلدية' },
                    { value: 'consultant', label: 'مكتب استشاري' },
                    { value: 'client', label: 'العميل مباشرة' },
                    { value: 'other', label: 'جهة أخرى' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            <div className="dense-form-row">
              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  اسم العميل *
                </label>
                <InputWithCopy
                  label=""
                  id="clientName"
                  placeholder="أدخل اسم العميل"
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  الموقع
                </label>
                <InputWithCopy
                  label=""
                  id="location"
                  placeholder="أدخل موقع المشروع"
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  تاريخ الاستلام *
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
                  تم الاستلام بواسطة *
                </label>
                <SelectWithCopy
                  label=""
                  id="receivedBy"
                  options={[
                    { value: 'emp1', label: 'م. أحمد السعيد' },
                    { value: 'emp2', label: 'م. خالد العمري' },
                    { value: 'emp3', label: 'م. فهد الدوسري' },
                    { value: 'emp4', label: 'م. سعود القحطاني' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  طريقة الاستلام
                </label>
                <SelectWithCopy
                  label=""
                  id="receivingMethod"
                  options={[
                    { value: 'hand', label: 'تسليم يدوي' },
                    { value: 'email', label: 'بريد إلكتروني' },
                    { value: 'courier', label: 'شركة شحن' },
                    { value: 'platform', label: 'منصة إلكترونية' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>

              <div className="dense-form-group">
                <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                  حالة الرخصة
                </label>
                <SelectWithCopy
                  label=""
                  id="licenseStatus"
                  options={[
                    { value: 'active', label: 'سارية' },
                    { value: 'expired', label: 'منتهية' },
                    { value: 'under_review', label: 'قيد المراجعة' },
                    { value: 'cancelled', label: 'ملغاة' }
                  ]}
                  copyable={true}
                  clearable={true}
                />
              </div>
            </div>

            {/* رفع صور الرخصة */}
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                رفع صور الرخصة *
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50">
                <Upload className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                <p className="compact-text text-blue-700" style={{ fontWeight: 600 }}>
                  اسحب الصور هنا أو انقر للرفع
                </p>
                <p className="compact-subtitle text-blue-600 mt-2">
                  يمكنك رفع عدة صور (JPG, PNG, PDF حتى 10MB لكل ملف)
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    صفحة 1
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    صفحة 2
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    مرفقات
                  </Badge>
                </div>
              </div>
              
              {/* عرض الصور المرفوعة */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <FileCheck className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <Button 
                        className="absolute top-1 left-1 w-6 h-6 p-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <p className="text-xs text-center mt-1 text-gray-600">صورة {idx + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ملاحظات */}
            <div className="dense-form-group">
              <label className="dense-form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                ملاحظات
              </label>
              <TextAreaWithCopy
                label=""
                id="notes"
                rows={4}
                placeholder="أدخل أي ملاحظات أو تفاصيل إضافية عن الرخصة..."
                copyable={true}
                clearable={true}
              />
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-end gap-2">
              <Button className="dense-btn dense-btn-secondary">
                <X className="w-3 h-3" />
                إلغاء
              </Button>
              <Button className="dense-btn dense-btn-primary">
                <Save className="w-3 h-3" />
                حفظ الرخصة
              </Button>
            </div>
          </div>
        </div>

        {/* قائمة الرخص الخارجية المسجلة */}
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Layers className="w-4 h-4" />
              الرخص الخارجية المسجلة
            </h3>
            <div className="flex items-center gap-2">
              <Button className="dense-btn dense-btn-secondary">
                <Filter className="w-3 h-3" />
                فلترة
              </Button>
              <Button className="dense-btn dense-btn-secondary">
                <Download className="w-3 h-3" />
                تصدير
              </Button>
            </div>
          </div>

          {externalLicenses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-3">
              <ExternalLink className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="compact-title text-gray-500 mb-1">لا توجد رخص خارجية مسجلة</p>
              <p className="compact-text text-gray-400">
                ابدأ بإضافة أول رخصة خارجية باستخدام النموذج أعلاه
              </p>
            </div>
          ) : (
            <div className="dense-grid dense-grid-2 mt-3">
              {externalLicenses.map((license, idx) => (
                <div key={idx} className="dense-content-card">
                  {/* محتوى البطاقة */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // نموذج عام لأنواع الرخص
  const renderLicenseTypeTab = (type: string, title: string, Icon: any, allowManual: boolean) => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h2 className="dense-section-title">
            <Icon className="w-4 h-4" />
            {title}
          </h2>
        </div>

        <p className="compact-text text-gray-600 mt-2">
          {allowManual 
            ? 'يمكن إضافة هذا النوع كرخصة إلكترونية أو يدوية'
            : 'هذا النوع متاح كرخصة إلكترونية فقط'
          }
        </p>

        {!allowManual && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="compact-text text-blue-700">
              الرخص من هذا النوع إلكترونية فقط ويتم استخراجها من النظام الإلكتروني
            </span>
          </div>
        )}
      </div>

      <div className="dense-section text-center py-12">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="compact-title text-gray-700 mb-2">{title}</h3>
        <p className="compact-text text-gray-500">
          سيتم إضافة النموذج الكامل لهذا النوع من الرخص
        </p>
      </div>
    </div>
  );

  // باقي التابات
  const renderStatisticsTab = () => renderPlaceholderTab('الإحصائيات', BarChart);
  const renderReportsTab = () => renderPlaceholderTab('التقارير', PieChart);
  const renderHistoryTab = () => renderPlaceholderTab('السجل', Clock);
  const renderDocumentsTab = () => renderPlaceholderTab('الوثائق المرفقة', FileCheck);
  const renderTransactionLinkingTab = () => renderPlaceholderTab('ربط بالمعاملات', Link);
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="compact-title text-white">إدارة الرخص</h2>
              <p className="text-xs text-white/80">شاشة 841</p>
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

export default LicensesManagement_Complete_841;
