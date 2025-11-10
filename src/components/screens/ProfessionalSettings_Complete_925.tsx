/**
 * الشاشة 925 - الإعدادات المهنية الشاملة
 * ===============================================
 * 
 * نظام متكامل للإعدادات المهنية بـ 20 تبويب شامل
 * - السايد بار الرأسي المُكثف للتابات
 * - استغلال 95%+ من المساحة
 * - نظام الترقيم الموحد 925-XX
 * - دعم RTL كامل مع خط Tajawal
 * - بطاقات تفاعلية ونوافذ منبثقة شاملة
 * - إدارة القوالب والأصول الهندسية
 * - المعايير المهنية والمواصفات
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Layers, FileText, Image, Box, Ruler, Zap, Settings,
  Download, Upload, Eye, Edit, Trash2, Plus, Search, Filter,
  Star, BookOpen, GraduationCap, Wrench, Building, Hammer,
  Lightbulb, Database, Link, RefreshCw, CheckCircle, AlertCircle,
  Info, Archive, FolderOpen, File, Grid3X3, List, Copy,
  Share2, ExternalLink, Award, Target, Calendar, Clock,
  Users, Package, Globe, Shield, Lock, Key, Palette,
  Code, Terminal, Cpu, HardDrive, CloudUpload, Smartphone
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import InputWithCopy from '../InputWithCopy';

// واجهات البيانات
interface Template {
  id: string;
  templateNumber: string;
  name: string;
  category: string;
  version: string;
  size: string;
  lastModified: string;
  downloads: number;
  rating: number;
  status: 'active' | 'archived' | 'draft';
  author?: string;
  description?: string;
  compatibility?: string[];
}

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  type: 'family' | 'block' | 'detail' | 'material';
  category: string;
  fileSize: string;
  format: string;
  lastUsed: string;
  usageCount: number;
  tags: string[];
}

interface Standard {
  id: string;
  standardNumber: string;
  name: string;
  organization: string;
  version: string;
  effectiveDate: string;
  category: string;
  status: 'active' | 'pending' | 'archived';
  compliance: number;
}

interface Specification {
  id: string;
  specNumber: string;
  title: string;
  section: string;
  revision: string;
  lastUpdate: string;
  approvedBy: string;
  status: 'approved' | 'draft' | 'review';
}

const ProfessionalSettings_Complete_925: React.FC = () => {
  // حالات الإدارة
  const [activeTab, setActiveTab] = useState('925-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // بيانات تجريبية - القوالب
  const templates: Template[] = useMemo(() => [
    {
      id: '1', templateNumber: 'TPL-925-001',
      name: 'قالب معماري شامل 2025', category: 'معماري',
      version: '2024.1', size: '45 MB', lastModified: '2025-09-20',
      downloads: 156, rating: 4.8, status: 'active',
      author: 'م. أحمد السعيد',
      description: 'قالب Revit معماري متكامل حسب المعايير السعودية',
      compatibility: ['Revit 2024', 'Revit 2023']
    },
    {
      id: '2', templateNumber: 'TPL-925-002',
      name: 'قالب إنشائي قياسي', category: 'إنشائي',
      version: '2024.0', size: '38 MB', lastModified: '2025-09-18',
      downloads: 142, rating: 4.6, status: 'active',
      author: 'م. فاطمة علي',
      description: 'قالب للمشاريع الإنشائية مع جميع العائلات',
      compatibility: ['Revit 2024']
    },
    {
      id: '3', templateNumber: 'TPL-925-003',
      name: 'قالب MEP متقدم', category: 'ميكانيكي',
      version: '2024.1', size: '52 MB', lastModified: '2025-09-15',
      downloads: 98, rating: 4.7, status: 'active',
      author: 'م. محمد حسن',
      description: 'قالب شامل لأنظمة MEP',
      compatibility: ['Revit 2024', 'Revit 2023', 'Revit 2022']
    },
    {
      id: '4', templateNumber: 'TPL-925-004',
      name: 'قالب AutoCAD معماري', category: 'معماري',
      version: '2024', size: '12 MB', lastModified: '2025-09-10',
      downloads: 203, rating: 4.9, status: 'active',
      author: 'م. سارة القحطاني',
      description: 'قالب AutoCAD للرسومات المعمارية',
      compatibility: ['AutoCAD 2024', 'AutoCAD 2023']
    },
  ], []);

  // بيانات تجريبية - الأصول
  const assets: Asset[] = useMemo(() => [
    {
      id: '1', assetNumber: 'AST-925-001',
      name: 'عائلة أبواب خشبية', type: 'family',
      category: 'أبواب', fileSize: '2.4 MB', format: '.rfa',
      lastUsed: '2025-10-05', usageCount: 45,
      tags: ['أبواب', 'خشب', 'داخلي']
    },
    {
      id: '2', assetNumber: 'AST-925-002',
      name: 'بلوك أثاث مكتبي', type: 'block',
      category: 'أثاث', fileSize: '850 KB', format: '.dwg',
      lastUsed: '2025-10-03', usageCount: 67,
      tags: ['أثاث', 'مكتب', 'AutoCAD']
    },
    {
      id: '3', assetNumber: 'AST-925-003',
      name: 'تفاصيل واجهات زجاجية', type: 'detail',
      category: 'تفاصيل', fileSize: '1.2 MB', format: '.rvt',
      lastUsed: '2025-10-01', usageCount: 23,
      tags: ['واجهات', 'زجاج', 'تفاصيل']
    },
    {
      id: '4', assetNumber: 'AST-925-004',
      name: 'خامات رخام فاخر', type: 'material',
      category: 'خامات', fileSize: '5.6 MB', format: '.mat',
      lastUsed: '2025-09-28', usageCount: 34,
      tags: ['رخام', 'خامات', 'تشطيبات']
    },
  ], []);

  // بيانات تجريبية - المعايير
  const standards: Standard[] = useMemo(() => [
    {
      id: '1', standardNumber: 'STD-925-001',
      name: 'كود البناء السعودي SBC 301',
      organization: 'الهيئة السعودية للمواصفات',
      version: '2018', effectiveDate: '2018-01-01',
      category: 'إنشائي', status: 'active', compliance: 95
    },
    {
      id: '2', standardNumber: 'STD-925-002',
      name: 'كود البناء السعودي SBC 201',
      organization: 'الهيئة السعودية للمواصفات',
      version: '2018', effectiveDate: '2018-01-01',
      category: 'معماري', status: 'active', compliance: 98
    },
    {
      id: '3', standardNumber: 'STD-925-003',
      name: 'كود السلامة من الحريق SBC 801',
      organization: 'الدفاع المدني',
      version: '2019', effectiveDate: '2019-06-01',
      category: 'سلامة', status: 'active', compliance: 92
    },
    {
      id: '4', standardNumber: 'STD-925-004',
      name: 'الكود الميكانيكي SBC 501',
      organization: 'الهيئة السعودية للمواصفات',
      version: '2018', effectiveDate: '2018-01-01',
      category: 'ميكانيكي', status: 'pending', compliance: 88
    },
  ], []);

  // بيانات تجريبية - المواصفات
  const specifications: Specification[] = useMemo(() => [
    {
      id: '1', specNumber: 'SPEC-925-001',
      title: 'مواصفات الخرسانة المسلحة',
      section: 'القسم 03 - الخرسانة',
      revision: 'Rev. 3', lastUpdate: '2025-08-15',
      approvedBy: 'م. أحمد السعيد', status: 'approved'
    },
    {
      id: '2', specNumber: 'SPEC-925-002',
      title: 'مواصفات أعمال البناء',
      section: 'القسم 04 - البناء',
      revision: 'Rev. 2', lastUpdate: '2025-08-10',
      approvedBy: 'م. فاطمة علي', status: 'approved'
    },
    {
      id: '3', specNumber: 'SPEC-925-003',
      title: 'مواصفات الأعمال المعدنية',
      section: 'القسم 05 - معادن',
      revision: 'Rev. 1', lastUpdate: '2025-08-05',
      approvedBy: 'م. محمد حسن', status: 'review'
    },
    {
      id: '4', specNumber: 'SPEC-925-004',
      title: 'مواصفات الدهانات والتشطيبات',
      section: 'القسم 09 - تشطيبات',
      revision: 'Draft', lastUpdate: '2025-07-28',
      approvedBy: 'م. سارة القحطاني', status: 'draft'
    },
  ], []);

  // إحصائيات رئيسية
  const totalTemplates = templates.length;
  const totalAssets = assets.length;
  const totalStandards = standards.length;
  const totalSpecs = specifications.length;
  const avgCompliance = useMemo(() =>
    (standards.reduce((sum, std) => sum + std.compliance, 0) / standards.length).toFixed(1),
    [standards]
  );

  // تعريف التابات بنظام الترقيم الموحد
  const tabsConfig = [
    { id: '925-01', label: 'نظرة عامة', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: '925-02', label: 'قوالب Revit', icon: <Layers className="w-4 h-4" /> },
    { id: '925-03', label: 'قوالب AutoCAD', icon: <FileText className="w-4 h-4" /> },
    { id: '925-04', label: 'قوالب 3DS Max', icon: <Box className="w-4 h-4" /> },
    { id: '925-05', label: 'الأصول الهندسية', icon: <Package className="w-4 h-4" /> },
    { id: '925-06', label: 'العائلات Families', icon: <FolderOpen className="w-4 h-4" /> },
    { id: '925-07', label: 'البلوكات Blocks', icon: <Database className="w-4 h-4" /> },
    { id: '925-08', label: 'التفاصيل Details', icon: <Ruler className="w-4 h-4" /> },
    { id: '925-09', label: 'الخامات Materials', icon: <Palette className="w-4 h-4" /> },
    { id: '925-10', label: 'المعايير Standards', icon: <BookOpen className="w-4 h-4" /> },
    { id: '925-11', label: 'المواصفات Specs', icon: <FileText className="w-4 h-4" /> },
    { id: '925-12', label: 'الكودات Codes', icon: <Code className="w-4 h-4" /> },
    { id: '925-13', label: 'المكتبات Libraries', icon: <Archive className="w-4 h-4" /> },
    { id: '925-14', label: 'الإعدادات Settings', icon: <Settings className="w-4 h-4" /> },
    { id: '925-15', label: 'التكاملات Integration', icon: <Link className="w-4 h-4" /> },
    { id: '925-16', label: 'الإضافات Plugins', icon: <Zap className="w-4 h-4" /> },
    { id: '925-17', label: 'النسخ الاحتياطي', icon: <CloudUpload className="w-4 h-4" /> },
    { id: '925-18', label: 'الأرشيف Archive', icon: <Archive className="w-4 h-4" /> },
    { id: '925-19', label: 'التقارير Reports', icon: <FileText className="w-4 h-4" /> },
    { id: '925-20', label: 'المساعدة Help', icon: <Info className="w-4 h-4" /> },
  ];

  // مكون رأس الشاشة
  const renderScreenHeader = () => (
    <div className="dense-section-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-main-title" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الإعدادات المهنية الشاملة
            </h1>
            <p className="text-small text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              الشاشة رقم 925 • {tabsConfig.length} تبويب شامل
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 ml-1" />
            {totalTemplates} قالب
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Package className="w-3 h-3 ml-1" />
            {totalAssets} أصل
          </Badge>
          <Button size="sm" variant="outline" className="button-rtl dense-btn-secondary">
            <RefreshCw className="w-3 h-3" />
            تحديث
          </Button>
          <Button size="sm" className="button-rtl dense-btn-primary" onClick={() => setShowUploadDialog(true)}>
            <Upload className="w-3 h-3" />
            رفع قالب
          </Button>
        </div>
      </div>
    </div>
  );

  // مكون الإحصائيات الرئيسية
  const renderMainStats = () => (
    <div className="dense-stats-grid mb-4">
      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
          <Layers className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#6366f1' }}>
          {totalTemplates}
        </div>
        <div className="dense-stat-label">القوالب</div>
      </div>

      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          <Package className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#10b981' }}>
          {totalAssets}
        </div>
        <div className="dense-stat-label">الأصول</div>
      </div>

      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#f59e0b' }}>
          {totalStandards}
        </div>
        <div className="dense-stat-label">المعايير</div>
      </div>

      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
          <FileText className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#2563eb' }}>
          {totalSpecs}
        </div>
        <div className="dense-stat-label">المواصفات</div>
      </div>

      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
          <Star className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#a855f7' }}>
          4.7
        </div>
        <div className="dense-stat-label">متوسط التقييم</div>
      </div>

      <div className="dense-stat-card">
        <div className="dense-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
          <CheckCircle className="w-4 h-4" />
        </div>
        <div className="dense-stat-number" style={{ color: '#22c55e' }}>
          {avgCompliance}%
        </div>
        <div className="dense-stat-label">الامتثال</div>
      </div>
    </div>
  );

  // التاب 01: نظرة عامة
  const renderOverviewTab = () => (
    <div className="dense-layout">
      {renderMainStats()}

      <div className="dense-grid dense-grid-2 mb-4">
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Star className="w-4 h-4" />
              القوالب الأكثر استخداماً
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            {templates
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((template) => (
                <div
                  key={template.id}
                  className="dense-content-card cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateDialog(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="compact-title">{template.name}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {template.status === 'active' ? 'نشط' : template.status === 'archived' ? 'مؤرشف' : 'مسودة'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-medium">{template.category}</span>
                    </div>
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">التنزيلات:</span>
                      <span className="font-medium">{template.downloads}</span>
                    </div>
                    <div className="flex items-center justify-between compact-text">
                      <span className="text-gray-600">التقييم:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{template.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              <Package className="w-4 h-4" />
              الأصول الأخيرة
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            {assets.slice(0, 3).map((asset) => (
              <div key={asset.id} className="dense-content-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="compact-title">{asset.name}</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {asset.type === 'family' ? 'عائلة' :
                     asset.type === 'block' ? 'بلوك' :
                     asset.type === 'detail' ? 'تفصيل' : 'خامة'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">التصنيف:</span>
                    <span className="font-medium">{asset.category}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">الحجم:</span>
                    <span className="font-medium">{asset.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between compact-text">
                    <span className="text-gray-600">الاستخدامات:</span>
                    <span className="font-medium">{asset.usageCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <BookOpen className="w-4 h-4" />
            المعايير والمواصفات
          </h3>
        </div>
        <div className="dense-grid dense-grid-auto mt-2">
          {standards.slice(0, 3).map((standard) => (
            <div key={standard.id} className="dense-content-card">
              <div className="flex items-center justify-between mb-2">
                <span className="compact-title">{standard.name}</span>
                <Badge className={`text-xs ${
                  standard.status === 'active' ? 'bg-green-100 text-green-800' :
                  standard.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {standard.status === 'active' ? 'نشط' :
                   standard.status === 'pending' ? 'معلق' : 'مؤرشف'}
                </Badge>
              </div>
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">الجهة:</span>
                  <span className="font-medium text-xs">{standard.organization}</span>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">الإصدار:</span>
                  <span className="font-medium">{standard.version}</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between compact-text mb-1">
                  <span className="text-gray-600">الامتثال:</span>
                  <span className="font-medium">{standard.compliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${standard.compliance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // التاب 02: قوالب Revit
  const renderRevitTemplatesTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Layers className="w-4 h-4" />
            قوالب Revit
          </h3>
          <button className="dense-btn dense-btn-primary" onClick={() => setShowUploadDialog(true)}>
            <Upload className="w-3 h-3" />
            رفع قالب
          </button>
        </div>

        <div className="mt-3">
          <Input
            className="dense-form-input mb-3"
            placeholder="ابحث عن قالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dense-grid dense-grid-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className="dense-content-card cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                setShowTemplateDialog(true);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="compact-title">{template.name}</span>
                </div>
                <Badge className={`text-xs ${
                  template.status === 'active' ? 'bg-green-100 text-green-800' :
                  template.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {template.status === 'active' ? 'نشط' :
                   template.status === 'archived' ? 'مؤرشف' : 'مسودة'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="compact-text">
                  <span className="text-gray-600">التصنيف:</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs mr-1">{template.category}</Badge>
                </div>
                <div className="compact-text">
                  <span className="text-gray-600">الإصدار:</span>
                  <span className="font-medium mr-1">{template.version}</span>
                </div>
                <div className="compact-text">
                  <span className="text-gray-600">الحجم:</span>
                  <span className="font-medium mr-1">{template.size}</span>
                </div>
                <div className="compact-text">
                  <span className="text-gray-600">التنزيلات:</span>
                  <span className="font-medium mr-1">{template.downloads}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(template.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="compact-text mr-1">{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="dense-action-btn">
                    <Download className="w-3 h-3" />
                  </button>
                  <button className="dense-action-btn">
                    <Eye className="w-3 h-3" />
                  </button>
                  <button className="dense-action-btn">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // التاب 05: الأصول الهندسية
  const renderAssetsTab = () => (
    <div className="dense-layout">
      <div className="dense-section">
        <div className="dense-section-header">
          <h3 className="dense-section-title">
            <Package className="w-4 h-4" />
            الأصول الهندسية
          </h3>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="dense-form-input w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="family">عائلات</SelectItem>
                <SelectItem value="block">بلوكات</SelectItem>
                <SelectItem value="detail">تفاصيل</SelectItem>
                <SelectItem value="material">خامات</SelectItem>
              </SelectContent>
            </Select>
            <button className="dense-btn dense-btn-primary">
              <Upload className="w-3 h-3" />
              رفع أصل
            </button>
          </div>
        </div>

        <div className="dense-grid dense-grid-auto mt-3">
          {assets.map((asset) => (
            <div key={asset.id} className="dense-content-card">
              <div className="flex items-center justify-between mb-2">
                <span className="compact-title">{asset.name}</span>
                <Badge className={`text-xs ${
                  asset.type === 'family' ? 'bg-purple-100 text-purple-800' :
                  asset.type === 'block' ? 'bg-blue-100 text-blue-800' :
                  asset.type === 'detail' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {asset.type === 'family' ? 'عائلة' :
                   asset.type === 'block' ? 'بلوك' :
                   asset.type === 'detail' ? 'تفصيل' : 'خامة'}
                </Badge>
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">التصنيف:</span>
                  <span className="font-medium">{asset.category}</span>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">الحجم:</span>
                  <span className="font-medium">{asset.fileSize}</span>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">الصيغة:</span>
                  <span className="font-code">{asset.format}</span>
                </div>
                <div className="flex items-center justify-between compact-text">
                  <span className="text-gray-600">الاستخدامات:</span>
                  <span className="font-medium">{asset.usageCount}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {asset.tags.map((tag, index) => (
                  <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between compact-text text-gray-500">
                <span>آخر استخدام: {asset.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // محتوى عام للتابات الأخرى
  const renderGenericTab = (tabId: string) => {
    const tabInfo = tabsConfig.find(t => t.id === tabId);
    return (
      <div className="dense-layout">
        <div className="dense-section">
          <div className="dense-section-header">
            <h3 className="dense-section-title">
              {tabInfo?.icon}
              {tabInfo?.label}
            </h3>
            <div className="dense-section-actions">
              <button className="dense-action-btn">
                <Plus className="w-3 h-3" />
              </button>
              <button className="dense-action-btn">
                <Filter className="w-3 h-3" />
              </button>
              <button className="dense-action-btn">
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              {tabInfo?.icon && React.cloneElement(tabInfo.icon as React.ReactElement, { className: 'w-8 h-8 text-indigo-600' })}
            </div>
            <h3 className="text-sub-title mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {tabInfo?.label}
            </h3>
            <p className="text-normal text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محتوى شامل ومتكامل لـ {tabInfo?.label} مع جميع الأدوات والإعدادات
            </p>
            <Button className="button-rtl dense-btn-primary">
              <Eye className="w-3 h-3" />
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // نافذة تفاصيل القالب
  const renderTemplateDialog = () => (
    <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
      <DialogContent className="max-w-3xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            تفاصيل القالب
          </DialogTitle>
          <DialogDescription className="dialog-description">
            معلومات شاملة عن القالب
          </DialogDescription>
        </DialogHeader>

        {selectedTemplate && (
          <div className="space-y-4">
            <div className="dense-grid dense-grid-2">
              <div className="dense-form-group">
                <Label className="dense-form-label">رقم القالب</Label>
                <InputWithCopy value={selectedTemplate.templateNumber} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الاسم</Label>
                <Input value={selectedTemplate.name} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">التصنيف</Label>
                <Input value={selectedTemplate.category} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الإصدار</Label>
                <Input value={selectedTemplate.version} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">الحجم</Label>
                <Input value={selectedTemplate.size} readOnly className="dense-form-input" />
              </div>
              <div className="dense-form-group">
                <Label className="dense-form-label">التقييم</Label>
                <Input value={`${selectedTemplate.rating} من 5`} readOnly className="dense-form-input" />
              </div>
            </div>

            {selectedTemplate.description && (
              <div className="dense-form-group">
                <Label className="dense-form-label">الوصف</Label>
                <textarea
                  value={selectedTemplate.description}
                  readOnly
                  className="dense-form-textarea"
                  rows={3}
                />
              </div>
            )}

            {selectedTemplate.compatibility && (
              <div className="dense-form-group">
                <Label className="dense-form-label">التوافق</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.compatibility.map((comp, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowTemplateDialog(false)}>
                إغلاق
              </Button>
              <Button className="button-rtl dense-btn-primary">
                <Download className="w-3 h-3" />
                تحميل
              </Button>
              <Button className="button-rtl dense-btn-primary">
                <Edit className="w-3 h-3" />
                تعديل
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // نافذة رفع قالب جديد
  const renderUploadDialog = () => (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent className="max-w-2xl dialog-rtl">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            رفع قالب جديد
          </DialogTitle>
          <DialogDescription className="dialog-description">
            قم برفع قالب جديد إلى المكتبة
          </DialogDescription>
        </DialogHeader>

        <div className="dense-form">
          <div className="dense-grid dense-grid-2">
            <div className="dense-form-group">
              <Label className="dense-form-label">نوع القالب *</Label>
              <Select>
                <SelectTrigger className="dense-form-input">
                  <SelectValue placeholder="اختر نوع القالب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revit">Revit</SelectItem>
                  <SelectItem value="autocad">AutoCAD</SelectItem>
                  <SelectItem value="3dsmax">3DS Max</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="dense-form-group">
              <Label className="dense-form-label">التصنيف *</Label>
              <Select>
                <SelectTrigger className="dense-form-input">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architectural">معماري</SelectItem>
                  <SelectItem value="structural">إنشائي</SelectItem>
                  <SelectItem value="mep">ميكانيكي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="dense-form-group">
            <Label className="dense-form-label">اسم القالب *</Label>
            <Input className="dense-form-input" placeholder="أدخل اسم القالب" />
          </div>

          <div className="dense-form-group">
            <Label className="dense-form-label">الوصف</Label>
            <textarea
              className="dense-form-textarea"
              placeholder="وصف القالب (اختياري)"
              rows={3}
            />
          </div>

          <div className="dense-form-group">
            <Label className="dense-form-label">رفع الملف *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-small text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اسحب الملف هنا أو انقر للاختيار
              </p>
              <p className="text-small text-gray-400 mt-1">
                الحد الأقصى: 100 MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" className="button-rtl dense-btn-secondary" onClick={() => setShowUploadDialog(false)}>
              إلغاء
            </Button>
            <Button className="button-rtl dense-btn-primary">
              <Upload className="w-3 h-3" />
              رفع القالب
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="screen-with-vertical-tabs-layout">
      {/* السايد بار الرأسي للتابات */}
      <div className="vertical-tabs-sidebar">
        <div className="vertical-tabs-sidebar-header">
          <h3 className="text-sub-title mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تابات الإعدادات
          </h3>
          <p className="text-small text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {tabsConfig.length} تبويب
          </p>
        </div>

        <ScrollArea className="vertical-tabs-sidebar-body">
          {tabsConfig.map((tab, index) => (
            <React.Fragment key={tab.id}>
              <div
                className={`vertical-tab-item-condensed ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="vertical-tab-icon">{tab.icon}</div>
                <div className="vertical-tab-title-condensed">{tab.label}</div>
                <div className="vertical-tab-number-condensed">{tab.id}</div>
              </div>
              {index < tabsConfig.length - 1 && <div className="vertical-tab-separator-condensed" />}
            </React.Fragment>
          ))}
        </ScrollArea>

        <div className="vertical-tabs-sidebar-footer">
          <div className="compact-text text-center text-gray-600">
            الشاشة 925 • v5.0
          </div>
        </div>
      </div>

      {/* مساحة المحتوى */}
      <div className="vertical-tabs-content-area">
        <div className="vertical-tabs-content-header">
          {renderScreenHeader()}
        </div>

        <ScrollArea className="vertical-tabs-content-body">
          {activeTab === '925-01' && renderOverviewTab()}
          {activeTab === '925-02' && renderRevitTemplatesTab()}
          {activeTab === '925-05' && renderAssetsTab()}
          {!['925-01', '925-02', '925-05'].includes(activeTab) && renderGenericTab(activeTab)}
        </ScrollArea>
      </div>

      {/* النوافذ المنبثقة */}
      {renderTemplateDialog()}
      {renderUploadDialog()}
    </div>
  );
};

export default ProfessionalSettings_Complete_925;
