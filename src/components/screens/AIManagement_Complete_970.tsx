/**
 * الشاشة 970 - إدارة الذكاء الصناعي
 * ====================================
 * 
 * نظام شامل لإدارة الذكاء الصناعي المحلي والسحابي
 * 
 * المميزات:
 * - ربط مع AnythingLLM المحلي
 * - ربط مع خدمات الذكاء الصناعي السحابية
 * - معالجة المستندات والصور
 * - إعداد التقارير والنماذج تلقائياً
 * - مراقبة العمليات وقوائم الانتظار
 * - إدارة الأولويات والإلغاء
 * 
 * التابات: 12 تبويب
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import UnifiedTabsSidebar, { TabConfig } from '../UnifiedTabsSidebar';
import { InputWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import {
  Brain, Cloud, Server, FileText, Image as ImageIcon, FileCheck, FileSpreadsheet,
  List, Activity, BarChart3, Settings, Layers, CheckCircle, XCircle, AlertCircle,
  PlayCircle, PauseCircle, StopCircle, RefreshCw, Trash2, ChevronUp, ChevronDown,
  Clock, Cpu, HardDrive, Wifi, WifiOff, Zap, TrendingUp, Database, Upload,
  Download, Eye, Edit, Copy, MessageSquare, BookOpen, Sparkles, LucideIcon,
  ArrowUpDown, Filter, Search, MoreVertical, Play, Pause, X, Plus
} from 'lucide-react';

// ==================== الواجهات ====================

interface AIProvider {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  url?: string;
  apiKey?: string;
  model?: string;
  enabled: boolean;
}

interface AIOperation {
  id: string;
  type: 'document' | 'image' | 'report' | 'form';
  title: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  provider: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedTime?: number;
  result?: string;
  error?: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'vision' | 'multimodal';
  size: string;
  capabilities: string[];
  enabled: boolean;
}

interface AIStats {
  totalOperations: number;
  completedOperations: number;
  failedOperations: number;
  averageTime: number;
  queueLength: number;
  activeOperations: number;
}

// ==================== تكوين التابات ====================

const TABS_CONFIG: TabConfig[] = [
  { id: '970-01', number: '970-01', title: 'نظرة عامة', icon: Brain },
  { id: '970-02', number: '970-02', title: 'الذكاء الصناعي المحلي', icon: Server },
  { id: '970-03', number: '970-03', title: 'الذكاء الصناعي السحابي', icon: Cloud },
  { id: '970-04', number: '970-04', title: 'معالجة المستندات', icon: FileText },
  { id: '970-05', number: '970-05', title: 'معالجة الصور', icon: ImageIcon },
  { id: '970-06', number: '970-06', title: 'إعداد التقارير', icon: FileCheck },
  { id: '970-07', number: '970-07', title: 'إعداد النماذج', icon: FileSpreadsheet },
  { id: '970-08', number: '970-08', title: 'قوائم الانتظار', icon: List },
  { id: '970-09', number: '970-09', title: 'مراقبة العمليات', icon: Activity },
  { id: '970-10', number: '970-10', title: 'الإحصائيات والأداء', icon: BarChart3 },
  { id: '970-11', number: '970-11', title: 'النماذج المتاحة', icon: Layers },
  { id: '970-12', number: '970-12', title: 'الإعدادات المتقدمة', icon: Settings },
];

// ==================== المكون الرئيسي ====================

const AIManagement_Complete_970: React.FC = () => {
  const [activeTab, setActiveTab] = useState('970-01');

  // حالات مزودي الخدمة
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: 'anythingllm',
      name: 'AnythingLLM (محلي)',
      type: 'local',
      status: 'connected',
      url: 'http://192.168.1.100:3001',
      apiKey: 'local-api-key-xxxx',
      model: 'llama-3.1-70b',
      enabled: true
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      type: 'cloud',
      status: 'connected',
      url: 'https://api.openai.com/v1',
      apiKey: 'sk-xxxx',
      model: 'gpt-4-turbo',
      enabled: true
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      type: 'cloud',
      status: 'disconnected',
      url: 'https://api.anthropic.com/v1',
      apiKey: '',
      model: 'claude-3-opus',
      enabled: false
    }
  ]);

  // حالات العمليات
  const [operations, setOperations] = useState<AIOperation[]>([
    {
      id: 'op-001',
      type: 'document',
      title: 'تحليل عقد المشروع رقم 2501001',
      status: 'processing',
      priority: 'high',
      progress: 45,
      provider: 'anythingllm',
      createdAt: '2025-10-25 14:30',
      startedAt: '2025-10-25 14:31',
      estimatedTime: 120
    },
    {
      id: 'op-002',
      type: 'image',
      title: 'استخراج نص من صور المخططات',
      status: 'queued',
      priority: 'medium',
      progress: 0,
      provider: 'openai',
      createdAt: '2025-10-25 14:35',
      estimatedTime: 180
    },
    {
      id: 'op-003',
      type: 'report',
      title: 'إعداد تقرير شهري للمعاملات',
      status: 'queued',
      priority: 'urgent',
      progress: 0,
      provider: 'anythingllm',
      createdAt: '2025-10-25 14:40',
      estimatedTime: 300
    },
    {
      id: 'op-004',
      type: 'form',
      title: 'ملء نموذج طلب ترخيص',
      status: 'completed',
      priority: 'low',
      progress: 100,
      provider: 'openai',
      createdAt: '2025-10-25 13:00',
      startedAt: '2025-10-25 13:01',
      completedAt: '2025-10-25 13:15',
      result: 'تم إكمال النموذج بنجاح'
    },
    {
      id: 'op-005',
      type: 'document',
      title: 'تلخيص مستند فني طويل',
      status: 'failed',
      priority: 'medium',
      progress: 30,
      provider: 'anythingllm',
      createdAt: '2025-10-25 12:00',
      startedAt: '2025-10-25 12:01',
      error: 'فشل الاتصال بالخادم'
    }
  ]);

  // النماذج المتاحة
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'llama-3.1-70b',
      name: 'Llama 3.1 70B',
      provider: 'anythingllm',
      type: 'text',
      size: '70B',
      capabilities: ['نصوص', 'تحليل', 'ترجمة', 'ملخصات'],
      enabled: true
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      type: 'multimodal',
      size: 'Unknown',
      capabilities: ['نصوص', 'صور', 'تحليل', 'برمجة', 'ترجمة'],
      enabled: true
    },
    {
      id: 'gpt-4-vision',
      name: 'GPT-4 Vision',
      provider: 'openai',
      type: 'vision',
      size: 'Unknown',
      capabilities: ['صور', 'OCR', 'تحليل بصري'],
      enabled: true
    }
  ]);

  // الإحصائيات
  const [stats, setStats] = useState<AIStats>({
    totalOperations: 247,
    completedOperations: 198,
    failedOperations: 12,
    averageTime: 145,
    queueLength: 2,
    activeOperations: 1
  });

  // إعدادات
  const [localAIUrl, setLocalAIUrl] = useState('http://192.168.1.100:3001');
  const [localAIKey, setLocalAIKey] = useState('local-api-key-xxxx');
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetries, setMaxRetries] = useState('3');
  const [timeout, setTimeout] = useState('300');
  const [concurrentOperations, setConcurrentOperations] = useState('3');

  // دوال مساعدة
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
      'queued': { label: 'في الانتظار', color: '#6b7280', icon: Clock },
      'processing': { label: 'جارٍ المعالجة', color: '#f59e0b', icon: PlayCircle },
      'completed': { label: 'مكتمل', color: '#10b981', icon: CheckCircle },
      'failed': { label: 'فشل', color: '#ef4444', icon: XCircle },
      'cancelled': { label: 'ملغي', color: '#8b5cf6', icon: StopCircle },
      'connected': { label: 'متصل', color: '#10b981', icon: Wifi },
      'disconnected': { label: 'غير متصل', color: '#6b7280', icon: WifiOff },
      'error': { label: 'خطأ', color: '#ef4444', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig['queued'];
    const StatusIcon = config.icon;

    return (
      <Badge 
        style={{ 
          backgroundColor: `${config.color}15`,
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        <StatusIcon className="h-3 w-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; color: string }> = {
      'low': { label: 'منخفضة', color: '#6b7280' },
      'medium': { label: 'متوسطة', color: '#3b82f6' },
      'high': { label: 'عالية', color: '#f59e0b' },
      'urgent': { label: 'عاجلة', color: '#ef4444' }
    };

    const config = priorityConfig[priority] || priorityConfig['medium'];

    return (
      <Badge 
        style={{ 
          backgroundColor: `${config.color}15`,
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      'document': FileText,
      'image': ImageIcon,
      'report': FileCheck,
      'form': FileSpreadsheet
    };
    return icons[type] || FileText;
  };

  // دوال إدارة العمليات
  const moveOperationUp = (id: string) => {
    const index = operations.findIndex(op => op.id === id);
    if (index > 0 && operations[index].status === 'queued') {
      const newOps = [...operations];
      [newOps[index - 1], newOps[index]] = [newOps[index], newOps[index - 1]];
      setOperations(newOps);
    }
  };

  const moveOperationDown = (id: string) => {
    const index = operations.findIndex(op => op.id === id);
    if (index < operations.length - 1 && operations[index].status === 'queued') {
      const newOps = [...operations];
      [newOps[index], newOps[index + 1]] = [newOps[index + 1], newOps[index]];
      setOperations(newOps);
    }
  };

  const cancelOperation = (id: string) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, status: 'cancelled' as const } : op
    ));
  };

  const retryOperation = (id: string) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, status: 'queued' as const, progress: 0, error: undefined } : op
    ));
  };

  const deleteOperation = (id: string) => {
    setOperations(operations.filter(op => op.id !== id));
  };

  // رندر محتوى التابات
  const renderTabContent = () => {
    switch (activeTab) {
      case '970-01':
        return renderOverviewTab();
      case '970-02':
        return renderLocalAITab();
      case '970-03':
        return renderCloudAITab();
      case '970-04':
        return renderDocumentProcessingTab();
      case '970-05':
        return renderImageProcessingTab();
      case '970-06':
        return renderReportGenerationTab();
      case '970-07':
        return renderFormGenerationTab();
      case '970-08':
        return renderQueueTab();
      case '970-09':
        return renderMonitoringTab();
      case '970-10':
        return renderStatisticsTab();
      case '970-11':
        return renderModelsTab();
      case '970-12':
        return renderAdvancedSettingsTab();
      default:
        return null;
    }
  };

  // التاب 01: نظرة عامة
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>إجمالي العمليات</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.totalOperations}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>العمليات المكتملة</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.completedOperations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>قيد المعالجة</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.activeOperations}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>في الانتظار</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.queueLength}</p>
              </div>
              <Clock className="h-8 w-8 text-pink-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)', border: '2px solid #f87171' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>فشلت</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.failedOperations}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', border: '2px solid #c084fc' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط الوقت</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>{stats.averageTime}ث</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* حالة مزودي الخدمة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>حالة مزودي خدمة الذكاء الصناعي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {providers.map(provider => (
              <div key={provider.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-3">
                  {provider.type === 'local' ? <Server className="h-5 w-5 text-blue-600" /> : <Cloud className="h-5 w-5 text-purple-600" />}
                  <div>
                    <p style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{provider.name}</p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{provider.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(provider.status)}
                  <EnhancedSwitch
                    checked={provider.enabled}
                    onCheckedChange={(checked) => {
                      setProviders(providers.map(p => p.id === provider.id ? { ...p, enabled: checked } : p));
                    }}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* آخر العمليات */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>آخر العمليات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {operations.slice(0, 5).map(op => {
              const TypeIcon = getTypeIcon(op.type);
              return (
                <div key={op.id} className="flex items-center justify-between p-2 rounded" style={{ background: '#f8fafc' }}>
                  <div className="flex items-center gap-3 flex-1">
                    <TypeIcon className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{op.title}</p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>{op.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(op.priority)}
                    {getStatusBadge(op.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 02: الذكاء الصناعي المحلي
  const renderLocalAITab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <Server className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إعدادات الاتصال بخادم AnythingLLM المحلي أو أي نظام ذكاء صناعي محلي آخر
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات AnythingLLM</CardTitle>
          <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
            قم بإعداد الاتصال بخادم AnythingLLM المحلي الخاص بك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="عنوان URL الخادم *"
              id="local-ai-url"
              value={localAIUrl}
              onChange={(e) => setLocalAIUrl(e.target.value)}
              placeholder="http://192.168.1.100:3001"
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="مفتاح API *"
              id="local-ai-key"
              value={localAIKey}
              onChange={(e) => setLocalAIKey(e.target.value)}
              placeholder="أدخل مفتاح API"
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="النموذج الافتراضي"
              id="local-model"
              value="llama-3.1-70b"
              onChange={() => {}}
              options={[
                { value: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
                { value: 'llama-3.1-8b', label: 'Llama 3.1 8B' },
                { value: 'mistral-7b', label: 'Mistral 7B' },
                { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="نوع الاتصال"
              id="connection-type"
              value="http"
              onChange={() => {}}
              options={[
                { value: 'http', label: 'HTTP' },
                { value: 'https', label: 'HTTPS' },
                { value: 'websocket', label: 'WebSocket' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>إعدادات متقدمة</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <InputWithCopy
                label="الحد الأقصى للرموز"
                id="max-tokens"
                value="2048"
                onChange={() => {}}
                placeholder="2048"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="درجة الحرارة (Temperature)"
                id="temperature"
                value="0.7"
                onChange={() => {}}
                placeholder="0.7"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="Top P"
                id="top-p"
                value="0.9"
                onChange={() => {}}
                placeholder="0.9"
                copyable={true}
                clearable={true}
              />

              <InputWithCopy
                label="Frequency Penalty"
                id="frequency-penalty"
                value="0.0"
                onChange={() => {}}
                placeholder="0.0"
                copyable={true}
                clearable={true}
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
              <Wifi className="h-4 w-4 ml-2" />
              اختبار الاتصال
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة تعيين
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 ml-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* إضافة مزود جديد */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة مزود محلي آخر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputWithCopy
              label="اسم المزود"
              id="provider-name"
              value=""
              onChange={() => {}}
              placeholder="مثال: Ollama"
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="عنوان URL"
              id="provider-url"
              value=""
              onChange={() => {}}
              placeholder="http://localhost:11434"
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="نوع المزود"
              id="provider-type"
              value=""
              onChange={() => {}}
              options={[
                { value: 'ollama', label: 'Ollama' },
                { value: 'lmstudio', label: 'LM Studio' },
                { value: 'koboldai', label: 'KoboldAI' },
                { value: 'textgen', label: 'Text Generation WebUI' },
                { value: 'custom', label: 'مخصص' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>

          <Button variant="outline">
            <Plus className="h-4 w-4 ml-2" />
            إضافة مزود جديد
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 03: الذكاء الصناعي السحابي
  const renderCloudAITab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #a5b4fc' }}>
        <Cloud className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إعدادات الاتصال بخدمات الذكاء الصناعي السحابية مثل OpenAI و Anthropic و Google
        </AlertDescription>
      </Alert>

      {/* OpenAI */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>OpenAI (GPT-4)</CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                خدمة GPT-4 من OpenAI
              </CardDescription>
            </div>
            <EnhancedSwitch
              checked={providers.find(p => p.id === 'openai')?.enabled || false}
              onCheckedChange={(checked) => {
                setProviders(providers.map(p => p.id === 'openai' ? { ...p, enabled: checked } : p));
              }}
              label="تفعيل"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="مفتاح API *"
              id="openai-key"
              value="sk-xxxx"
              onChange={() => {}}
              placeholder="sk-..."
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="النموذج"
              id="openai-model"
              value="gpt-4-turbo"
              onChange={() => {}}
              options={[
                { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-4-vision', label: 'GPT-4 Vision' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
              ]}
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="Organization ID (اختياري)"
              id="openai-org"
              value=""
              onChange={() => {}}
              placeholder="org-..."
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="الحد الأقصى للطلبات/دقيقة"
              id="openai-rate-limit"
              value="60"
              onChange={() => {}}
              placeholder="60"
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Anthropic Claude */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>Anthropic (Claude)</CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                خدمة Claude من Anthropic
              </CardDescription>
            </div>
            <EnhancedSwitch
              checked={providers.find(p => p.id === 'anthropic')?.enabled || false}
              onCheckedChange={(checked) => {
                setProviders(providers.map(p => p.id === 'anthropic' ? { ...p, enabled: checked } : p));
              }}
              label="تفعيل"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="مفتاح API *"
              id="anthropic-key"
              value=""
              onChange={() => {}}
              placeholder="sk-ant-..."
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="النموذج"
              id="anthropic-model"
              value="claude-3-opus"
              onChange={() => {}}
              options={[
                { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
                { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
                { value: 'claude-2.1', label: 'Claude 2.1' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Google AI */}
      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>Google AI (Gemini)</CardTitle>
              <CardDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
                خدمة Gemini من Google
              </CardDescription>
            </div>
            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="تفعيل"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="مفتاح API *"
              id="google-key"
              value=""
              onChange={() => {}}
              placeholder="AIza..."
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="النموذج"
              id="google-model"
              value="gemini-pro"
              onChange={() => {}}
              options={[
                { value: 'gemini-ultra', label: 'Gemini Ultra' },
                { value: 'gemini-pro', label: 'Gemini Pro' },
                { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 04: معالجة المستندات
  const renderDocumentProcessingTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <FileText className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          استخدم الذكاء الصناعي لمعالجة وتحليل المستندات تلقائياً
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>عمليات معالجة المستندات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* تحليل المستند */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#dbeafe' }}>
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تحليل المستندات</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    تحليل شامل لمحتوى المستند واستخراج المعلومات الرئيسية
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع مستند
                  </Button>
                </div>
              </div>
            </div>

            {/* تلخيص المستند */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#d1fae5' }}>
                  <FileCheck className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تلخيص المستندات</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    إنشاء ملخص مختصر للمستندات الطويلة
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع مستند
                  </Button>
                </div>
              </div>
            </div>

            {/* استخراج البيانات */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#e9d5ff' }}>
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>استخراج البيانات</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    استخراج بيانات محددة من المستندات (أسماء، تواريخ، أرقام...)
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع مستند
                  </Button>
                </div>
              </div>
            </div>

            {/* ترجمة المستند */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#fed7aa' }}>
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>ترجمة المستندات</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    ترجمة المستندات بين العربية والإنجليزية
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع مستند
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات معالجة المستندات */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات المعالجة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="المزود الافتراضي"
              id="doc-provider"
              value="anythingllm"
              onChange={() => {}}
              options={[
                { value: 'anythingllm', label: 'AnythingLLM (محلي)' },
                { value: 'openai', label: 'OpenAI GPT-4' },
                { value: 'anthropic', label: 'Anthropic Claude' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="صيغ الملفات المدعومة"
              id="supported-formats"
              value="all"
              onChange={() => {}}
              options={[
                { value: 'all', label: 'جميع الصيغ' },
                { value: 'pdf', label: 'PDF فقط' },
                { value: 'word', label: 'Word فقط' },
                { value: 'text', label: 'نصوص فقط' }
              ]}
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="الحد الأقصى لحجم الملف (MB)"
              id="max-file-size"
              value="50"
              onChange={() => {}}
              placeholder="50"
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="اللغة الافتراضية"
              id="default-language"
              value="ar"
              onChange={() => {}}
              options={[
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'الإنجليزية' },
                { value: 'auto', label: 'تلقائي' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>

          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="حفظ المستندات بعد المعالجة"
              description="الاحتفاظ بنسخة من المستندات المعالجة في النظام"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="معالجة دفعية"
              description="السماح بمعالجة عدة مستندات في نفس الوقت"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="إشعارات البريد الإلكتروني"
              description="إرسال إشعار عند اكتمال معالجة المستند"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 05: معالجة الصور
  const renderImageProcessingTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          استخدم الذكاء الصناعي للتعرف على النصوص في الصور (OCR) وتحليل المحتوى البصري
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>عمليات معالجة الصور</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* OCR */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#dbeafe' }}>
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>استخراج النصوص (OCR)</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    التعرف على النصوص العربية والإنجليزية في الصور
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع صورة
                  </Button>
                </div>
              </div>
            </div>

            {/* تحليل بصري */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#e9d5ff' }}>
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>التحليل البصري</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    وصف محتوى الصورة والعناصر الموجودة فيها
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع صورة
                  </Button>
                </div>
              </div>
            </div>

            {/* استخراج بيانات من الجداول */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#d1fae5' }}>
                  <Table className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>استخراج الجداول</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    تحويل الجداول في الصور إلى بيانات قابلة للتحرير
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع صورة
                  </Button>
                </div>
              </div>
            </div>

            {/* معالجة الختوم والتوقيعات */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#fed7aa' }}>
                  <Edit className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>التعرف على الختوم</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    التعرف على الختوم والتوقيعات في المستندات
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع صورة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات معالجة الصور */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات OCR والتحليل البصري</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="محرك OCR"
              id="ocr-engine"
              value="gpt-4-vision"
              onChange={() => {}}
              options={[
                { value: 'gpt-4-vision', label: 'GPT-4 Vision (سحابي)' },
                { value: 'tesseract', label: 'Tesseract (محلي)' },
                { value: 'easyocr', label: 'EasyOCR (محلي)' },
                { value: 'paddleocr', label: 'PaddleOCR (محلي)' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="جودة المعالجة"
              id="processing-quality"
              value="high"
              onChange={() => {}}
              options={[
                { value: 'low', label: 'منخفضة (سريعة)' },
                { value: 'medium', label: 'متوسطة' },
                { value: 'high', label: 'عالية (دقيقة)' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="لغات OCR"
              id="ocr-languages"
              value="ar+en"
              onChange={() => {}}
              options={[
                { value: 'ar', label: 'العربية فقط' },
                { value: 'en', label: 'الإنجليزية فقط' },
                { value: 'ar+en', label: 'العربية + الإنجليزية' },
                { value: 'auto', label: 'تلقائي' }
              ]}
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="دقة الصورة (DPI)"
              id="image-dpi"
              value="300"
              onChange={() => {}}
              placeholder="300"
              copyable={true}
              clearable={true}
            />
          </div>

          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="تحسين الصورة تلقائياً"
              description="تحسين جودة الصورة قبل المعالجة (سطوع، تباين، حدة)"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="إزالة الضوضاء"
              description="إزالة الخلفيات والعناصر المشوشة"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="كشف التوقيعات"
              description="التعرف تلقائياً على التوقيعات والختوم"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 06: إعداد التقارير
  const renderReportGenerationTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
        <FileCheck className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          استخدم الذكاء الصناعي لإنشاء تقارير احترافية تلقائياً من البيانات
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>أنواع التقارير</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* تقرير المعاملات */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#dbeafe' }}>
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تقرير المعاملات</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    تقرير شامل عن حالة وتقدم المعاملات
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    إنشاء تقرير
                  </Button>
                </div>
              </div>
            </div>

            {/* تقرير الأداء */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#d1fae5' }}>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تقرير الأداء</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    تحليل أداء المكتب والموظفين
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    إنشاء تقرير
                  </Button>
                </div>
              </div>
            </div>

            {/* تقرير مالي */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#fed7aa' }}>
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تقرير مالي</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    تحليل الإيرادات والمصروفات
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    إنشاء تقرير
                  </Button>
                </div>
              </div>
            </div>

            {/* تقرير مخصص */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#e9d5ff' }}>
                  <Edit className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>تقرير مخصص</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    إنشاء تقرير حسب احتياجاتك
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    إنشاء تقرير
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات التقارير */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات إنشاء التقارير</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="تنسيق التقرير"
              id="report-format"
              value="pdf"
              onChange={() => {}}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'word', label: 'Word (DOCX)' },
                { value: 'excel', label: 'Excel (XLSX)' },
                { value: 'html', label: 'HTML' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="القالب"
              id="report-template"
              value="professional"
              onChange={() => {}}
              options={[
                { value: 'professional', label: 'احترافي' },
                { value: 'simple', label: 'بسيط' },
                { value: 'detailed', label: 'مفصل' },
                { value: 'custom', label: 'مخصص' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="مستوى التفاصيل"
              id="detail-level"
              value="medium"
              onChange={() => {}}
              options={[
                { value: 'summary', label: 'ملخص' },
                { value: 'medium', label: 'متوسط' },
                { value: 'detailed', label: 'مفصل' },
                { value: 'comprehensive', label: 'شامل' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="اللغة"
              id="report-language"
              value="ar"
              onChange={() => {}}
              options={[
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'الإنجليزية' },
                { value: 'both', label: 'ثنائي اللغة' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>

          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="إضافة رسوم بيانية"
              description="إنشاء رسوم بيانية توضيحية تلقائياً"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="إضافة شعار المكتب"
              description="وضع شعار المكتب في رأس التقرير"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="جدولة تلقائية"
              description="إنشاء التقارير تلقائياً بشكل دوري"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 07: إعداد النماذج
  const renderFormGenerationTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <FileSpreadsheet className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          ملء النماذج والاستمارات تلقائياً باستخدام الذكاء الصناعي
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>النماذج المتاحة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* نموذج طلب ترخيص */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#dbeafe' }}>
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>طلب ترخيص</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    ملء نموذج طلب الترخيص تلقائياً
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    ملء النموذج
                  </Button>
                </div>
              </div>
            </div>

            {/* نموذج عقد */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#d1fae5' }}>
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>نموذج عقد</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    إنشاء وملء نماذج العقود
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    ملء النموذج
                  </Button>
                </div>
              </div>
            </div>

            {/* نموذج تعهد */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#fed7aa' }}>
                  <FileCheck className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>نموذج تعهد</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    إنشاء خطابات التعهد
                  </p>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 ml-1" />
                    ملء النموذج
                  </Button>
                </div>
              </div>
            </div>

            {/* نموذج مخصص */}
            <div className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded" style={{ background: '#e9d5ff' }}>
                  <Edit className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, marginBottom: '4px' }}>نموذج مخصص</h4>
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif', marginBottom: '8px' }}>
                    رفع وملء نماذج مخصصة
                  </p>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 ml-1" />
                    رفع نموذج
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات ملء النماذج */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات ملء النماذج</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SelectWithCopy
              label="مصدر البيانات"
              id="data-source"
              value="transaction"
              onChange={() => {}}
              options={[
                { value: 'transaction', label: 'بيانات المعاملة' },
                { value: 'client', label: 'بيانات العميل' },
                { value: 'manual', label: 'إدخال يدوي' },
                { value: 'mixed', label: 'مختلط' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="دقة الملء"
              id="fill-accuracy"
              value="high"
              onChange={() => {}}
              options={[
                { value: 'low', label: 'منخفضة (سريع)' },
                { value: 'medium', label: 'متوسطة' },
                { value: 'high', label: 'عالية (دقيق)' }
              ]}
              copyable={true}
              clearable={true}
            />
          </div>

          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="مراجعة بشرية"
              description="مراجعة النموذج المملوء قبل الحفظ"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="حفظ النسخة الأصلية"
              description="الاحتفاظ بنسخة من النموذج الفارغ"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="ملء ذكي للحقول المتعلقة"
              description="ملء الحقول ذات العلاقة تلقائياً"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 08: قوائم الانتظار
  const renderQueueTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <List className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إدارة قوائم الانتظار للعمليات - يمكنك تغيير الأولويات وإلغاء العمليات
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>قائمة الانتظار ({operations.filter(op => op.status === 'queued').length})</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 ml-1" />
                تحديث
              </Button>
              <Button size="sm" variant="outline">
                <Filter className="h-3 w-3 ml-1" />
                تصفية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {operations.filter(op => op.status === 'queued').map((op, index) => {
              const TypeIcon = getTypeIcon(op.type);
              return (
                <div key={op.id} className="p-3 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded" style={{ background: '#dbeafe' }}>
                      <TypeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{op.title}</h4>
                        <div className="flex gap-2">
                          {getPriorityBadge(op.priority)}
                          {getStatusBadge(op.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>تم الإنشاء: {op.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          <span>المزود: {op.provider}</span>
                        </div>
                        {op.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>الوقت المقدر: {op.estimatedTime}ث</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => moveOperationUp(op.id)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => moveOperationDown(op.id)}
                        disabled={index === operations.filter(o => o.status === 'queued').length - 1}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => cancelOperation(op.id)}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 09: مراقبة العمليات
  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
        <Activity className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          مراقبة العمليات الجارية والمكتملة والفاشلة في الوقت الفعلي
        </AlertDescription>
      </Alert>

      {/* العمليات الجارية */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>العمليات الجارية ({operations.filter(op => op.status === 'processing').length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operations.filter(op => op.status === 'processing').map(op => {
              const TypeIcon = getTypeIcon(op.type);
              return (
                <div key={op.id} className="p-3 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #fcd34d' }}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded" style={{ background: '#fed7aa' }}>
                      <TypeIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{op.title}</h4>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(op.priority)}
                          {getStatusBadge(op.status)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <span>التقدم: {op.progress}%</span>
                          <span className="text-gray-600">بدأت: {op.startedAt}</span>
                        </div>
                        <Progress value={op.progress} className="h-2" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {}}
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => cancelOperation(op.id)}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        <StopCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* العمليات المكتملة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>العمليات المكتملة ({operations.filter(op => op.status === 'completed').length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {operations.filter(op => op.status === 'completed').map(op => {
              const TypeIcon = getTypeIcon(op.type);
              return (
                <div key={op.id} className="p-2 rounded flex items-center justify-between" style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
                  <div className="flex items-center gap-3">
                    <TypeIcon className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{op.title}</p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>اكتمل: {op.completedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    {getStatusBadge(op.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* العمليات الفاشلة */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>العمليات الفاشلة ({operations.filter(op => op.status === 'failed').length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {operations.filter(op => op.status === 'failed').map(op => {
              const TypeIcon = getTypeIcon(op.type);
              return (
                <div key={op.id} className="p-3 rounded-lg" style={{ background: '#fecaca', border: '2px solid #f87171' }}>
                  <div className="flex items-start gap-3">
                    <TypeIcon className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{op.title}</h4>
                        {getStatusBadge(op.status)}
                      </div>
                      {op.error && (
                        <Alert style={{ background: 'white', border: '1px solid #fca5a5', padding: '8px', marginBottom: '8px' }}>
                          <AlertCircle className="h-3 w-3" />
                          <AlertDescription className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {op.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => retryOperation(op.id)}
                      >
                        <RefreshCw className="h-3 w-3 ml-1" />
                        إعادة
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteOperation(op.id)}
                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 10: الإحصائيات والأداء
  const renderStatisticsTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', border: '2px solid #c084fc' }}>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إحصائيات الأداء والاستخدام لنظام الذكاء الصناعي
        </AlertDescription>
      </Alert>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>معدل النجاح</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {((stats.completedOperations / stats.totalOperations) * 100).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>متوسط الوقت</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>
                  {stats.averageTime}ث
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', border: '2px solid #fb923c' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>العمليات اليوم</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>32</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-rtl" style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', border: '2px solid #c084fc' }}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>التوفير (وقت)</p>
                <p className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937', fontWeight: 700 }}>124س</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جداول الإحصائيات */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>التوزيع حسب النوع</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النوع</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العدد</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>النسبة</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الوقت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { type: 'معالجة المستندات', count: 98, percentage: 40, avgTime: 135 },
                { type: 'معالجة الصور', count: 72, percentage: 29, avgTime: 168 },
                { type: 'إعداد التقارير', count: 51, percentage: 21, avgTime: 245 },
                { type: 'إعداد النماذج', count: 26, percentage: 10, avgTime: 89 }
              ].map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.type}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.count}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage} className="h-2 flex-1" />
                      <span>{item.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.avgTime}ث</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* أداء المزودين */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>أداء المزودين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>المزود</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>العمليات</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>معدل النجاح</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>متوسط الوقت</TableHead>
                <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map(provider => (
                <TableRow key={provider.id}>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>{provider.name}</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>145</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>94.5%</TableCell>
                  <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>142ث</TableCell>
                  <TableCell className="text-right">{getStatusBadge(provider.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 11: النماذج المتاحة
  const renderModelsTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <Layers className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          النماذج (Models) المتاحة في الذكاء الصناعي المحلي والسحابي
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>النماذج المتاحة ({models.length})</CardTitle>
            <Button size="sm">
              <RefreshCw className="h-3 w-3 ml-1" />
              تحديث القائمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {models.map(model => (
              <div key={model.id} className="p-4 rounded-lg" style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>{model.name}</h4>
                      <Badge style={{ backgroundColor: model.type === 'text' ? '#dbeafe' : model.type === 'vision' ? '#e9d5ff' : '#fef3c7', color: '#1f2937' }}>
                        {model.type === 'text' ? 'نصوص' : model.type === 'vision' ? 'رؤية' : 'متعدد'}
                      </Badge>
                      <Badge variant="outline" style={{ fontFamily: 'Courier New, monospace' }}>{model.size}</Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      المزود: {model.provider === 'anythingllm' ? 'AnythingLLM (محلي)' : 'OpenAI'}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <EnhancedSwitch
                    checked={model.enabled}
                    onCheckedChange={(checked) => {
                      setModels(models.map(m => m.id === model.id ? { ...m, enabled: checked } : m));
                    }}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إضافة نموذج جديد */}
      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إضافة نموذج جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="اسم النموذج"
              id="model-name"
              value=""
              onChange={() => {}}
              placeholder="مثال: GPT-4 Turbo"
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="المزود"
              id="model-provider"
              value=""
              onChange={() => {}}
              options={[
                { value: 'anythingllm', label: 'AnythingLLM' },
                { value: 'openai', label: 'OpenAI' },
                { value: 'anthropic', label: 'Anthropic' },
                { value: 'google', label: 'Google' }
              ]}
              copyable={true}
              clearable={true}
            />

            <SelectWithCopy
              label="نوع النموذج"
              id="model-type"
              value=""
              onChange={() => {}}
              options={[
                { value: 'text', label: 'نصوص' },
                { value: 'vision', label: 'رؤية' },
                { value: 'multimodal', label: 'متعدد الوسائط' }
              ]}
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="حجم النموذج"
              id="model-size"
              value=""
              onChange={() => {}}
              placeholder="مثال: 70B"
              copyable={true}
              clearable={true}
            />
          </div>

          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إضافة النموذج
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // التاب 12: الإعدادات المتقدمة
  const renderAdvancedSettingsTab = () => (
    <div className="space-y-6">
      <Alert style={{ background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)', border: '2px solid #f87171' }}>
        <Settings className="h-4 w-4" />
        <AlertDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
          إعدادات متقدمة لنظام الذكاء الصناعي - تأكد من فهمك للإعدادات قبل التعديل
        </AlertDescription>
      </Alert>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأداء</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWithCopy
              label="الحد الأقصى للعمليات المتزامنة"
              id="max-concurrent"
              value={concurrentOperations}
              onChange={(e) => setConcurrentOperations(e.target.value)}
              placeholder="3"
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="مهلة الانتظار (ثانية)"
              id="timeout"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="300"
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="عدد المحاولات عند الفشل"
              id="max-retries"
              value={maxRetries}
              onChange={(e) => setMaxRetries(e.target.value)}
              placeholder="3"
              copyable={true}
              clearable={true}
            />

            <InputWithCopy
              label="الفاصل بين المحاولات (ثانية)"
              id="retry-interval"
              value="5"
              onChange={() => {}}
              placeholder="5"
              copyable={true}
              clearable={true}
            />
          </div>

          <div className="space-y-3">
            <EnhancedSwitch
              checked={autoRetry}
              onCheckedChange={setAutoRetry}
              label="إعادة المحاولة تلقائياً"
              description="إعادة العملية تلقائياً عند الفشل"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="تحسين الأداء"
              description="استخدام التخزين المؤقت والتحميل المسبق"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="وضع التوفير"
              description="تقليل استخدام الموارد على حساب السرعة"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الأمان والخصوصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="تشفير البيانات"
              description="تشفير جميع البيانات المرسلة للذكاء الصناعي"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="حذف البيانات بعد المعالجة"
              description="حذف البيانات من خوادم الذكاء الصناعي فوراً"
            />

            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="سجل العمليات"
              description="الاحتفاظ بسجل مفصل لجميع العمليات"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="إخفاء البيانات الحساسة"
              description="إخفاء الأسماء والأرقام قبل الإرسال"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-rtl">
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>إعدادات الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <EnhancedSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="إشعارات داخل النظام"
              description="عرض إشعارات عند اكتمال العمليات"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="إشعارات البريد الإلكتروني"
              description="إرسال بريد إلكتروني عند اكتمال العمليات الهامة"
            />

            <EnhancedSwitch
              checked={false}
              onCheckedChange={() => {}}
              label="إشعارات الفشل فقط"
              description="الإشعار فقط عند فشل العمليات"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}>
          <CheckCircle className="h-4 w-4 ml-2" />
          حفظ جميع الإعدادات
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 ml-2" />
          إعادة تعيين للافتراضي
        </Button>
      </div>
    </div>
  );

  // ==================== الرندر الرئيسي ====================

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* هيدر الشاشة */}
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
              <Brain 
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
                  إدارة الذكاء الصناعي
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
                    970
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
                نظام شامل لإدارة الذكاء الصناعي المحلي والسحابي
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
                12 تبويبات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex" style={{ gap: '4px', paddingTop: '16px' }}>
        {/* السايد بار */}
        <UnifiedTabsSidebar
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* محتوى التاب */}
        <div className="flex-1" style={{ minHeight: 'calc(100vh - 140px)', paddingLeft: '24px', paddingRight: '24px' }}>
          <ScrollArea style={{ height: 'calc(100vh - 160px)' }}>
            {renderTabContent()}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AIManagement_Complete_970;
