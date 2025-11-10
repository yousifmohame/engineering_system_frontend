import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { CodeDisplay } from '../CodeDisplay';
import { 
  ScanText,
  Settings,
  Layers,
  Upload,
  Clock,
  CheckCircle,
  ShieldCheck,
  Database,
  AlertTriangle,
  BarChart3,
  Cog,
  Folder,
  FileText,
  Play,
  Pause,
  Stop,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Key,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Zap,
  Target,
  Activity,
  Gauge,
  TrendingUp,
  Image,
  FileImage,
  Hash,
  Fingerprint,
  Archive,
  Download,
  Send,
  MapPin,
  Link,
  Users,
  Calendar,
  Timer,
  Info,
  User,
  Server,
  Network,
  Globe,
  Lock,
  Unlock,
  Shield,
  AlertCircle,
  CheckSquare,
  XCircle,
  PieChart,
  LineChart,
  Printer,
  Scan,
  Router,
  Wifi,
  Cable,
  HardDrive,
  Power,
  PowerOff,
  Pause as PauseIcon,
  WifiOff,
  History
} from 'lucide-react';

interface OCREngine {
  id: string;
  name: string;
  type: 'Tesseract' | 'EasyOCR' | 'Ollama' | 'Custom';
  version: string;
  installPath: string;
  tessdataPath?: string;
  isInstalled: boolean;
  isActive: boolean;
  lastUsed: string;
  supportedLanguages: string[];
  accuracy: number;
  speed: number;
  memoryUsage: number;
  configFile: string;
}

interface QueueItem {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'JPEG' | 'BMP' | 'TIFF';
  fileSize: number;
  uploadTime: string;
  priority: 'عاجل' | 'عادي' | 'منخفض';
  status: 'منتظر' | 'قيد المعالجة' | 'مكتمل' | 'خطأ' | 'متوقف';
  progress: number;
  estimatedTime: number;
  assignedEngine: string;
  language: string;
  userId: string;
  userName: string;
  attempts: number;
  position: number;
}

interface BatchUpload {
  id: string;
  batchName: string;
  filesCount: number;
  totalSize: number;
  uploadDate: string;
  language: 'عربي' | 'إنجليزي' | 'مختلط' | 'تلقائي';
  quality: 'سريع' | 'متوازن' | 'عالي' | 'فائق';
  engine: string;
  scheduleType: 'فوري' | 'مجدول';
  scheduledTime?: string;
  status: 'تحضير' | 'قيد الرفع' | 'مجدول' | 'قيد المعالجة' | 'مكتمل' | 'فشل';
  progress: number;
  processedFiles: number;
  failedFiles: number;
  createdBy: string;
}

interface ProcessingStatus {
  id: string;
  fileName: string;
  startTime: string;
  currentStage: 'تحضير الصورة' | 'استخراج النص' | 'تحسين النتائج' | 'التحقق' | 'حفظ النتائج';
  progress: number;
  estimatedTimeRemaining: number;
  engine: string;
  language: string;
  resolution: string;
  pagesTotal: number;
  pagesProcessed: number;
  errorsCount: number;
  warningsCount: number;
  currentPage: number;
  lastActivity: string;
}

interface OCRResult {
  id: string;
  fileName: string;
  processDate: string;
  engine: string;
  language: string;
  originalText: string;
  extractedText: string;
  confidence: number;
  hasManualCorrections: boolean;
  correctedText?: string;
  correctionBy?: string;
  correctionDate?: string;
  accuracy: number;
  wordsTotal: number;
  wordsConfirmed: number;
  characterCount: number;
  qualityRating: number;
  reviewStatus: 'مراجعة مطلوبة' | 'مراجع' | 'معتمد' | 'مرفوض';
  reviewer?: string;
}

interface ValidationRule {
  id: string;
  ruleName: string;
  ruleType: 'هوية وطنية' | 'تاريخ' | 'رقم هاتف' | 'بريد إلكتروني' | 'مبلغ مالي' | 'اسم شخص' | 'عنوان' | 'مخصص';
  pattern: string;
  isActive: boolean;
  confidence: number;
  description: string;
  successCount: number;
  failureCount: number;
  lastUsed: string;
  createdBy: string;
  autoFix: boolean;
}

interface DataMapping {
  id: string;
  mappingName: string;
  sourceField: string;
  targetField: string;
  documentType: 'هوية' | 'جواز سفر' | 'عقد' | 'فاتورة' | 'شهادة' | 'تقرير' | 'أخرى';
  fieldType: 'نص' | 'رقم' | 'تاريخ' | 'عملة' | 'منطقي' | 'قائمة';
  isRequired: boolean;
  defaultValue?: string;
  validationRule?: string;
  extractionAccuracy: number;
  usageCount: number;
  lastExtracted: string;
  isActive: boolean;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  fileName: string;
  errorType: 'خطأ محرك OCR' | 'خطأ معالجة ملف' | 'خطأ شبكة' | 'خطأ ذاكرة' | 'خطأ صلاحيات' | 'خطأ تكوين';
  severity: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  errorMessage: string;
  errorCode: string;
  engine: string;
  resolution: 'إعادة محاولة' | 'تجاهل' | 'إصلاح يدوي' | 'تحديث المحرك' | 'تغيير الإعدادات';
  retryAttempts: number;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedDate?: string;
  notes?: string;
}

interface PerformanceMetrics {
  id: string;
  timestamp: string;
  engine: string;
  documentsProcessed: number;
  averageProcessingTime: number;
  successRate: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  averageAccuracy: number;
  throughputPerHour: number;
  queueLength: number;
  activeProcesses: number;
  uptime: number;
}

interface OCRSettings {
  id: string;
  settingName: string;
  settingType: 'دقة' | 'سرعة' | 'لغة' | 'معالجة مسبقة' | 'تحسين الصورة' | 'تصحيح الأخطاء' | 'إخراج';
  value: string;
  defaultValue: string;
  description: string;
  engine: string;
  isAdvanced: boolean;
  requiresRestart: boolean;
  lastModified: string;
  modifiedBy: string;
  affectsPerformance: boolean;
  validationRule?: string;
}

interface SmartOCREngine {
  id: string;
  engineName: 'Tesseract' | 'EasyOCR' | 'Ollama' | 'AnyLLM';
  hostname: string;
  port: number;
  ipEndpoint: string;
  apiKey: string;
  status: 'نشط' | 'مجمّد' | 'محذوف';
  isEnabled: boolean;
  connectionTest: 'idle' | 'testing' | 'success' | 'error';
  lastTested: string;
  responseTime: number;
  createdDate: string;
  modifiedBy: string;
  notes?: string;
}

interface PrinterScanner {
  id: string;
  deviceType: 'طابعة' | 'ماسح ضوئي';
  deviceName: string;
  networkAddress: string;
  port: number;
  connectionMode: 'محلي' | 'عن بعد';
  permissions: 'للجميع' | 'لأدوار محددة';
  specificRoles?: string[];
  dailyUsageLimit: number;
  currentUsageCount: number;
  isEnabled: boolean;
  status: 'نشط' | 'معطل' | 'خطأ';
  connectionTest: 'idle' | 'testing' | 'success' | 'error';
  lastTested: string;
  responseTime: number;
  createdDate: string;
  createdBy: string;
  modifiedBy: string;
  notes?: string;
}

interface UsageLog {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'طابعة' | 'ماسح ضوئي';
  date: string;
  userId: string;
  userName: string;
  operationsCount: number;
  operationType: 'طباعة' | 'مسح';
  documentsProcessed: string[];
  totalPages: number;
  startTime: string;
  endTime: string;
  status: 'مكتمل' | 'فشل' | 'متوقف';
  errorMessage?: string;
}

export default function LocalOCR_Processor_Complete_10Tabs() {
  const [activeTab, setActiveTab] = useState('setup');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [selectedEngine, setSelectedEngine] = useState('tesseract');
  const [engineTest, setEngineTest] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [queueProcessing, setQueueProcessing] = useState(false);
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['Tesseract', 'EasyOCR']);
  const [newEngineDialog, setNewEngineDialog] = useState(false);
  const [newDeviceDialog, setNewDeviceDialog] = useState(false);
  const [usageLogDialog, setUsageLogDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<PrinterScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // بيانات وهمية لمحركات OCR
  const ocrEnginesData: OCREngine[] = [
    {
      id: '1',
      name: 'Tesseract 5.3.0',
      type: 'Tesseract',
      version: '5.3.0',
      installPath: 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe',
      tessdataPath: 'C:\\Program Files\\Tesseract-OCR\\tessdata',
      isInstalled: true,
      isActive: true,
      lastUsed: '2025-09-23 14:30:00',
      supportedLanguages: ['ara', 'eng', 'ara+eng'],
      accuracy: 94.5,
      speed: 85,
      memoryUsage: 2.3,
      configFile: 'tesseract.conf'
    },
    {
      id: '2',
      name: 'EasyOCR Arabic',
      type: 'EasyOCR',
      version: '1.7.0',
      installPath: 'python -m easyocr',
      isInstalled: true,
      isActive: false,
      lastUsed: '2025-09-22 10:15:00',
      supportedLanguages: ['ar', 'en'],
      accuracy: 91.2,
      speed: 75,
      memoryUsage: 3.8,
      configFile: 'easyocr_config.json'
    },
    {
      id: '3',
      name: 'Ollama Vision',
      type: 'Ollama',
      version: '0.1.32',
      installPath: 'http://localhost:11434/api/generate',
      isInstalled: false,
      isActive: false,
      lastUsed: '',
      supportedLanguages: ['arabic', 'english', 'multilingual'],
      accuracy: 89.7,
      speed: 60,
      memoryUsage: 8.5,
      configFile: 'ollama_vision.json'
    }
  ];

  // بيانات وهمية لقائمة الانتظار
  const queueData: QueueItem[] = [
    {
      id: '1',
      fileName: 'هوية_أحمد_محمد.pdf',
      fileType: 'PDF',
      fileSize: 2.3,
      uploadTime: '2025-09-23 14:30:00',
      priority: 'عاجل',
      status: 'قيد المعالجة',
      progress: 67,
      estimatedTime: 45,
      assignedEngine: 'Tesseract 5.3.0',
      language: 'عربي',
      userId: 'USR-001',
      userName: 'أحمد العلي',
      attempts: 1,
      position: 1
    },
    {
      id: '2',
      fileName: 'contract_english.jpg',
      fileType: 'JPG',
      fileSize: 4.7,
      uploadTime: '2025-09-23 14:25:00',
      priority: 'عادي',
      status: 'منتظر',
      progress: 0,
      estimatedTime: 120,
      assignedEngine: 'EasyOCR Arabic',
      language: 'إنجليزي',
      userId: 'USR-002',
      userName: 'سارة محمد',
      attempts: 0,
      position: 2
    },
    {
      id: '3',
      fileName: 'فاتورة_كهرباء.png',
      fileType: 'PNG',
      fileSize: 1.8,
      uploadTime: '2025-09-23 14:20:00',
      priority: 'منخفض',
      status: 'مكتمل',
      progress: 100,
      estimatedTime: 0,
      assignedEngine: 'Tesseract 5.3.0',
      language: 'مختلط',
      userId: 'USR-003',
      userName: 'خالد السعود',
      attempts: 1,
      position: 0
    },
    {
      id: '4',
      fileName: 'scan_document.tiff',
      fileType: 'TIFF',
      fileSize: 8.9,
      uploadTime: '2025-09-23 14:15:00',
      priority: 'عاجل',
      status: 'خطأ',
      progress: 0,
      estimatedTime: 0,
      assignedEngine: 'Tesseract 5.3.0',
      language: 'عربي',
      userId: 'USR-001',
      userName: 'أحمد العلي',
      attempts: 3,
      position: 0
    }
  ];

  // بيانات وهمية للرفع المجمع
  const batchUploadsData: BatchUpload[] = [
    {
      id: '1',
      batchName: 'دفعة الهويات الوطنية',
      filesCount: 25,
      totalSize: 47.8,
      uploadDate: '2025-09-23 09:00:00',
      language: 'عربي',
      quality: 'عالي',
      engine: 'Tesseract 5.3.0',
      scheduleType: 'فوري',
      status: 'مكتمل',
      progress: 100,
      processedFiles: 25,
      failedFiles: 0,
      createdBy: 'أحمد العلي'
    },
    {
      id: '2',
      batchName: 'عقود العملاء الجدد',
      filesCount: 15,
      totalSize: 89.3,
      uploadDate: '2025-09-23 11:30:00',
      language: 'مختلط',
      quality: 'متوازن',
      engine: 'EasyOCR Arabic',
      scheduleType: 'مجدول',
      scheduledTime: '2025-09-23 16:00:00',
      status: 'قيد المعالجة',
      progress: 47,
      processedFiles: 7,
      failedFiles: 1,
      createdBy: 'سارة محمد'
    },
    {
      id: '3',
      batchName: 'فواتير المشتريات',
      filesCount: 45,
      totalSize: 123.7,
      uploadDate: '2025-09-23 13:15:00',
      language: 'تلقائي',
      quality: 'سريع',
      engine: 'Tesseract 5.3.0',
      scheduleType: 'مجدول',
      scheduledTime: '2025-09-23 18:00:00',
      status: 'مجدول',
      progress: 0,
      processedFiles: 0,
      failedFiles: 0,
      createdBy: 'خالد السعود'
    }
  ];

  // بيانات وهمية لحالة المعالجة
  const processingStatusData: ProcessingStatus[] = [
    {
      id: '1',
      fileName: 'هوية_أحمد_محمد.pdf',
      startTime: '2025-09-23 14:30:00',
      currentStage: 'استخراج النص',
      progress: 67,
      estimatedTimeRemaining: 45,
      engine: 'Tesseract 5.3.0',
      language: 'عربي',
      resolution: '300 DPI',
      pagesTotal: 2,
      pagesProcessed: 1,
      errorsCount: 0,
      warningsCount: 1,
      currentPage: 2,
      lastActivity: '2025-09-23 14:32:15'
    }
  ];

  // بيانات وهمية لنتائج OCR
  const ocrResultsData: OCRResult[] = [
    {
      id: '1',
      fileName: 'فاتورة_كهرباء.png',
      processDate: '2025-09-23 14:20:00',
      engine: 'Tesseract 5.3.0',
      language: 'مختلط',
      originalText: '',
      extractedText: 'الشركة السعودية للكهرباء\nفاتورة رقم: 12345678\nالمبلغ المستحق: 450.00 ريال\nتاريخ الاستحقاق: 2025-10-01',
      confidence: 92.5,
      hasManualCorrections: true,
      correctedText: 'الشركة السعودية للكهرباء\nفاتورة رقم: 12345678\nالمبلغ المستحق: 450.00 ريال\nتاريخ الاستحقاق: 2025-10-01',
      correctionBy: 'سارة محمد',
      correctionDate: '2025-09-23 14:25:00',
      accuracy: 95.2,
      wordsTotal: 12,
      wordsConfirmed: 11,
      characterCount: 156,
      qualityRating: 9,
      reviewStatus: 'معتمد',
      reviewer: 'سارة محمد'
    },
    {
      id: '2',
      fileName: 'contract_english.jpg',
      processDate: '2025-09-22 16:45:00',
      engine: 'EasyOCR Arabic',
      language: 'إنجليزي',
      originalText: '',
      extractedText: 'ENGINEERING CONTRACT AGREEMENT\nProject Name: Residential Complex Phase 1\nContract Value: SAR 2,500,000\nDuration: 18 months',
      confidence: 88.7,
      hasManualCorrections: false,
      accuracy: 88.7,
      wordsTotal: 15,
      wordsConfirmed: 13,
      characterCount: 187,
      qualityRating: 8,
      reviewStatus: 'مراجع',
      reviewer: 'أحمد العلي'
    }
  ];

  // بيانات وهمية لقواعد التحقق
  const validationRulesData: ValidationRule[] = [
    {
      id: '1',
      ruleName: 'رقم الهوية الوطنية السعودية',
      ruleType: 'هوية وطنية',
      pattern: '^[12]\\d{9}$',
      isActive: true,
      confidence: 96.8,
      description: 'التحقق من صحة رقم الهوية الوطنية السعودية (10 أرقام يبدأ بـ 1 أو 2)',
      successCount: 347,
      failureCount: 12,
      lastUsed: '2025-09-23 14:30:00',
      createdBy: 'أحمد العلي',
      autoFix: true
    },
    {
      id: '2',
      ruleName: 'التاريخ الهجري والميلادي',
      ruleType: 'تاريخ',
      pattern: '\\d{1,2}[/-]\\d{1,2}[/-]\\d{4}|\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}',
      isActive: true,
      confidence: 89.3,
      description: 'التحقق من صحة التواريخ بالصيغ المختلفة',
      successCount: 567,
      failureCount: 23,
      lastUsed: '2025-09-23 13:45:00',
      createdBy: 'سارة محمد',
      autoFix: false
    },
    {
      id: '3',
      ruleName: 'رقم الجوال السعودي',
      ruleType: 'رقم هاتف',
      pattern: '^(\\+966|0)?5[0-9]{8}$',
      isActive: true,
      confidence: 94.1,
      description: 'التحقق من صحة أرقام الجوال السعودية',
      successCount: 289,
      failureCount: 8,
      lastUsed: '2025-09-23 12:20:00',
      createdBy: 'خالد السعود',
      autoFix: true
    }
  ];

  // بيانات وهمية لربط البيانات
  const dataMappingData: DataMapping[] = [
    {
      id: '1',
      mappingName: 'استخراج بيانات الهوية الوطنية',
      sourceField: 'النص المستخرج',
      targetField: 'رقم الهوية',
      documentType: 'هوية',
      fieldType: 'رقم',
      isRequired: true,
      defaultValue: '',
      validationRule: 'رقم الهوية الوطنية السعودية',
      extractionAccuracy: 96.8,
      usageCount: 347,
      lastExtracted: '2025-09-23 14:30:00',
      isActive: true
    },
    {
      id: '2',
      mappingName: 'استخراج اسم صاحب الهوية',
      sourceField: 'النص المستخرج',
      targetField: 'الاسم الكامل',
      documentType: 'هوية',
      fieldType: 'نص',
      isRequired: true,
      defaultValue: '',
      extractionAccuracy: 92.4,
      usageCount: 347,
      lastExtracted: '2025-09-23 14:30:00',
      isActive: true
    },
    {
      id: '3',
      mappingName: 'استخراج تاريخ الميلاد',
      sourceField: 'النص المستخرج',
      targetField: 'تاريخ الميلاد',
      documentType: 'هوية',
      fieldType: 'تاريخ',
      isRequired: true,
      defaultValue: '',
      validationRule: 'التاريخ الهجري والميلادي',
      extractionAccuracy: 89.1,
      usageCount: 347,
      lastExtracted: '2025-09-23 14:30:00',
      isActive: true
    }
  ];

  // بيانات وهمية لسجل الأخطاء
  const errorLogsData: ErrorLog[] = [
    {
      id: '1',
      timestamp: '2025-09-23 14:15:22',
      fileName: 'scan_document.tiff',
      errorType: 'خطأ معالجة ملف',
      severity: 'عالي',
      errorMessage: 'فشل في قراءة ملف TIFF: تنسيق غير مدعوم',
      errorCode: 'OCR_FILE_001',
      engine: 'Tesseract 5.3.0',
      resolution: 'تحديث المحرك',
      retryAttempts: 3,
      isResolved: false,
      notes: 'يحتاج إلى تحديث مكتبة TIFF'
    },
    {
      id: '2',
      timestamp: '2025-09-23 13:30:15',
      fileName: 'low_quality_scan.jpg',
      errorType: 'خطأ محرك OCR',
      severity: 'متوسط',
      errorMessage: 'دقة الصورة منخفضة جداً: أقل من 150 DPI',
      errorCode: 'OCR_QUALITY_002',
      engine: 'EasyOCR Arabic',
      resolution: 'تحسين الصورة',
      retryAttempts: 1,
      isResolved: true,
      resolvedBy: 'أحمد العلي',
      resolvedDate: '2025-09-23 13:45:00',
      notes: 'تم تحسين الصورة وإعادة المعالجة'
    },
    {
      id: '3',
      timestamp: '2025-09-23 12:45:30',
      fileName: 'corrupted_pdf.pdf',
      errorType: 'خطأ ذاكرة',
      severity: 'حرج',
      errorMessage: 'نفدت ذاكرة النظام أثناء معالجة ملف كبير',
      errorCode: 'OCR_MEMORY_003',
      engine: 'Tesseract 5.3.0',
      resolution: 'إعادة محاولة',
      retryAttempts: 2,
      isResolved: true,
      resolvedBy: 'النظام التلقائي',
      resolvedDate: '2025-09-23 13:00:00',
      notes: 'تم تقسيم الملف إلى أجزاء أصغر'
    }
  ];

  // بيانات وهمية لمقاييس الأداء
  const performanceData: PerformanceMetrics[] = [
    {
      id: '1',
      timestamp: '2025-09-23 14:30:00',
      engine: 'Tesseract 5.3.0',
      documentsProcessed: 156,
      averageProcessingTime: 2.3,
      successRate: 94.2,
      errorRate: 5.8,
      cpuUsage: 67.5,
      memoryUsage: 2.8,
      diskUsage: 78.3,
      averageAccuracy: 92.1,
      throughputPerHour: 67,
      queueLength: 8,
      activeProcesses: 3,
      uptime: 847
    },
    {
      id: '2',
      timestamp: '2025-09-23 14:25:00',
      engine: 'EasyOCR Arabic',
      documentsProcessed: 89,
      averageProcessingTime: 3.7,
      successRate: 89.9,
      errorRate: 10.1,
      cpuUsage: 84.2,
      memoryUsage: 4.1,
      diskUsage: 78.3,
      averageAccuracy: 88.6,
      throughputPerHour: 42,
      queueLength: 12,
      activeProcesses: 2,
      uptime: 623
    }
  ];

  // بيانات وهمية لإعدادات OCR
  const ocrSettingsData: OCRSettings[] = [
    {
      id: '1',
      settingName: 'دقة الاستخراج',
      settingType: 'دقة',
      value: 'عالية',
      defaultValue: 'متوسطة',
      description: 'مستوى دقة استخراج النصوص من الصور',
      engine: 'Tesseract 5.3.0',
      isAdvanced: false,
      requiresRestart: false,
      lastModified: '2025-09-23 10:15:00',
      modifiedBy: 'أحمد العلي',
      affectsPerformance: true,
      validationRule: 'منخفضة|متوسطة|عالية|فائقة'
    },
    {
      id: '2',
      settingName: 'معالجة الصور المسبقة',
      settingType: 'معالجة مسبقة',
      value: 'مفعل',
      defaultValue: 'معطل',
      description: 'تحسين جودة الصور قبل المعالجة',
      engine: 'جميع المحركات',
      isAdvanced: true,
      requiresRestart: false,
      lastModified: '2025-09-22 16:30:00',
      modifiedBy: 'سارة محمد',
      affectsPerformance: true,
      validationRule: 'مفعل|معطل'
    },
    {
      id: '3',
      settingName: 'عدد المعالجات المتوازية',
      settingType: 'سرعة',
      value: '4',
      defaultValue: '2',
      description: 'عدد العمليات المتوازية لمعالجة الملفات',
      engine: 'جميع المحركات',
      isAdvanced: true,
      requiresRestart: true,
      lastModified: '2025-09-21 14:45:00',
      modifiedBy: 'خالد السعود',
      affectsPerformance: true,
      validationRule: '1|2|4|8|16'
    }
  ];

  // بيانات وهمية لمحركات OCR الذكية
  const smartOCREnginesData: SmartOCREngine[] = [
    {
      id: '1',
      engineName: 'Tesseract',
      hostname: 'localhost',
      port: 3001,
      ipEndpoint: '192.168.1.10',
      apiKey: 'tesseract-api-key-2025',
      status: 'نشط',
      isEnabled: true,
      connectionTest: 'success',
      lastTested: '2025-09-23 14:30:00',
      responseTime: 45,
      createdDate: '2025-09-01',
      modifiedBy: 'أحمد العلي'
    },
    {
      id: '2',
      engineName: 'EasyOCR',
      hostname: 'localhost',
      port: 3002,
      ipEndpoint: '192.168.1.11',
      apiKey: 'easyocr-api-key-2025',
      status: 'نشط',
      isEnabled: true,
      connectionTest: 'success',
      lastTested: '2025-09-23 14:25:00',
      responseTime: 67,
      createdDate: '2025-09-05',
      modifiedBy: 'سارة محمد'
    },
    {
      id: '3',
      engineName: 'Ollama',
      hostname: 'localhost',
      port: 11434,
      ipEndpoint: '192.168.1.12',
      apiKey: 'ollama-vision-key-2025',
      status: 'مجمّد',
      isEnabled: false,
      connectionTest: 'error',
      lastTested: '2025-09-22 10:15:00',
      responseTime: 0,
      createdDate: '2025-09-10',
      modifiedBy: 'خالد السعود',
      notes: 'يحتاج إلى تحديث المحرك'
    },
    {
      id: '4',
      engineName: 'AnyLLM',
      hostname: 'localhost',
      port: 3003,
      ipEndpoint: '192.168.1.13',
      apiKey: 'anyllm-api-key-2025',
      status: 'محذوف',
      isEnabled: false,
      connectionTest: 'idle',
      lastTested: '2025-09-20 16:00:00',
      responseTime: 0,
      createdDate: '2025-09-15',
      modifiedBy: 'أحمد العلي',
      notes: 'تم حذفه لعدم الاستخدام'
    }
  ];

  // بيانات وهمية لأجهزة الطباعة والمسح
  const printersScannersData: PrinterScanner[] = [
    {
      id: '1',
      deviceType: 'طابعة',
      deviceName: 'HP LaserJet Pro 400',
      networkAddress: '192.168.1.50',
      port: 9100,
      connectionMode: 'محلي',
      permissions: 'للجميع',
      dailyUsageLimit: 500,
      currentUsageCount: 156,
      isEnabled: true,
      status: 'نشط',
      connectionTest: 'success',
      lastTested: '2025-09-23 14:30:00',
      responseTime: 23,
      createdDate: '2025-09-01',
      createdBy: 'أحمد العلي',
      modifiedBy: 'أحمد العلي'
    },
    {
      id: '2',
      deviceType: 'ماسح ضوئي',
      deviceName: 'Canon imageFORMULA DR-C225',
      networkAddress: '192.168.1.51',
      port: 8080,
      connectionMode: 'عن بعد',
      permissions: 'لأدوار محددة',
      specificRoles: ['مدير المكتب', 'موظف الأرشيف'],
      dailyUsageLimit: 200,
      currentUsageCount: 45,
      isEnabled: true,
      status: 'نشط',
      connectionTest: 'success',
      lastTested: '2025-09-23 14:25:00',
      responseTime: 67,
      createdDate: '2025-09-05',
      createdBy: 'سارة محمد',
      modifiedBy: 'سارة محمد'
    },
    {
      id: '3',
      deviceType: 'طابعة',
      deviceName: 'Epson EcoTank L3250',
      networkAddress: '192.168.1.52',
      port: 9100,
      connectionMode: 'محلي',
      permissions: 'لأدوار محددة',
      specificRoles: ['المحاسب', 'مدير المكتب'],
      dailyUsageLimit: 100,
      currentUsageCount: 89,
      isEnabled: false,
      status: 'معطل',
      connectionTest: 'error',
      lastTested: '2025-09-22 10:15:00',
      responseTime: 0,
      createdDate: '2025-09-10',
      createdBy: 'خالد السعود',
      modifiedBy: 'خالد السعود',
      notes: 'نفد الحبر - يحتاج صيانة'
    },
    {
      id: '4',
      deviceType: 'ماسح ضوئي',
      deviceName: 'Brother ADS-2700W',
      networkAddress: 'scanner.office.local',
      port: 9090,
      connectionMode: 'عن بعد',
      permissions: 'للجميع',
      dailyUsageLimit: 300,
      currentUsageCount: 12,
      isEnabled: true,
      status: 'نشط',
      connectionTest: 'success',
      lastTested: '2025-09-23 13:45:00',
      responseTime: 34,
      createdDate: '2025-09-15',
      createdBy: 'أحمد العلي',
      modifiedBy: 'سارة محمد'
    }
  ];

  // بيانات وهمية لسجل الاستخدام
  const usageLogsData: UsageLog[] = [
    {
      id: '1',
      deviceId: '1',
      deviceName: 'HP LaserJet Pro 400',
      deviceType: 'طابعة',
      date: '2025-09-23',
      userId: 'USR-001',
      userName: 'أحمد العلي',
      operationsCount: 15,
      operationType: 'طباعة',
      documentsProcessed: ['عقد_العميل_123.pdf', 'فاتورة_456.pdf'],
      totalPages: 45,
      startTime: '09:30:00',
      endTime: '09:45:00',
      status: 'مكتمل'
    },
    {
      id: '2',
      deviceId: '2',
      deviceName: 'Canon imageFORMULA DR-C225',
      deviceType: 'ماسح ضوئي',
      date: '2025-09-23',
      userId: 'USR-002',
      userName: 'سارة محمد',
      operationsCount: 8,
      operationType: 'مسح',
      documentsProcessed: ['هوية_عميل_789.jpg', 'شهادة_تجارية.jpg'],
      totalPages: 16,
      startTime: '11:15:00',
      endTime: '11:35:00',
      status: 'مكتمل'
    },
    {
      id: '3',
      deviceId: '1',
      deviceName: 'HP LaserJet Pro 400',
      deviceType: 'طابعة',
      date: '2025-09-22',
      userId: 'USR-003',
      userName: 'خالد السعود',
      operationsCount: 25,
      operationType: 'طباعة',
      documentsProcessed: ['تقرير_مشروع_ABC.pdf', 'مخططات_هندسية.pdf'],
      totalPages: 78,
      startTime: '14:20:00',
      endTime: '14:50:00',
      status: 'مكتمل'
    },
    {
      id: '4',
      deviceId: '4',
      deviceName: 'Brother ADS-2700W',
      deviceType: 'ماسح ضوئي',
      date: '2025-09-22',
      userId: 'USR-001',
      userName: 'أحمد العلي',
      operationsCount: 12,
      operationType: 'مسح',
      documentsProcessed: ['وثائق_مختلفة.pdf'],
      totalPages: 24,
      startTime: '16:10:00',
      endTime: '16:25:00',
      status: 'فشل',
      errorMessage: 'انقطاع في الاتصال الشبكي'
    }
  ];

  // دالة تصفية البيانات
  const getFilteredData = (data: any[], searchField: string) => {
    return data.filter(item => {
      const matchesSearch = item[searchField]?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.errorMessage?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'الكل' || item.status === filterStatus || item.severity === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل':
      case 'معتمد':
      case 'مراجع':
      case 'مفعل':
      case 'نشط':
        return 'bg-green-100 text-green-800';
      case 'قيد المعالجة':
      case 'قيد الرفع':
      case 'تحضير':
      case 'منتظر':
      case 'مجدول':
        return 'bg-yellow-100 text-yellow-800';
      case 'خطأ':
      case 'فشل':
      case 'مرفوض':
      case 'حرج':
        return 'bg-red-100 text-red-800';
      case 'متوقف':
      case 'معطل':
      case 'عالي':
        return 'bg-orange-100 text-orange-800';
      case 'مراجعة مطلوبة':
      case 'متوسط':
        return 'bg-purple-100 text-purple-800';
      case 'منخفض':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // دالة الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عاجل':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'عادي':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'منخفض':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // دالة اختبار المحرك
  const testEngine = useCallback(async (engineId: string) => {
    setEngineTest('testing');
    
    // محاكاة اختبار المحرك
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.2) {
        setEngineTest('success');
      } else {
        setEngineTest('error');
      }
      
      setTimeout(() => setEngineTest('idle'), 3000);
    }, 2000);
  }, []);

  // دالة رفع الملفات
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      console.log('رفع ملف OCR:', file.name);
    });
  }, []);

  // دالة بدء المعالجة
  const startProcessing = useCallback(() => {
    setQueueProcessing(true);
    
    // محاكاة بدء المعالجة
    setTimeout(() => {
      setQueueProcessing(false);
    }, 5000);
  }, []);

  // دالة تنسيق حجم الملف
  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  // دالة تنسيق التاريخ والوقت
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // دالة تنسيق الوقت المتبقي
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}د ${remainingSeconds}ث`;
  };

  return (
    <div className="space-y-6 relative" dir="rtl">
      <CodeDisplay code="SCR-LOCAL-OCR-019" position="top-right" />
      
      {/* Header الشاشة */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <ScanText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                معالج OCR المحلي الشامل
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام متطور لمعالجة الوثائق محلياً مع 12 تبويب متخصص ودعم Tesseract وEasyOCR وOllama وإعدادات المحركات الذكية وإدارة الطابعات والماسحات
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              SCR-LOCAL-OCR-019
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
              12 تبويب
            </Badge>
          </div>
        </div>
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">
              {ocrEnginesData.filter(e => e.isActive).length}
            </div>
            <div className="text-sm text-emerald-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              محرك نشط
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-teal-100">
            <div className="text-2xl font-bold text-teal-600">
              {queueData.filter(q => q.status === 'قيد المعالجة').length}
            </div>
            <div className="text-sm text-teal-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              قيد المعالجة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-cyan-100">
            <div className="text-2xl font-bold text-cyan-600">
              {ocrResultsData.filter(r => r.reviewStatus === 'معتمد').length}
            </div>
            <div className="text-sm text-cyan-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نتيجة معتمدة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(performanceData[0]?.successRate || 0)}%
            </div>
            <div className="text-sm text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معدل النجاح
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات في شبكة أفقية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl-support">
        <div className="tabs-grid-container">
          {/* التبويب 1: إعداد محرك OCR */}
          <div 
            className={`tabs-grid-item ${activeTab === 'setup' ? 'active' : ''}`}
            onClick={() => setActiveTab('setup')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعداد محرك OCR
              </span>
            </div>
            <div className="tab-code-display">TAB-OCR-SETUP</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إعداد محرك OCR');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 2: مدير قائمة الانتظار */}
          <div 
            className={`tabs-grid-item ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                مدير قائمة الانتظار
              </span>
            </div>
            <div className="tab-code-display">TAB-QUEUE-MANAGER</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب مدير قائمة الانتظار');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 3: الرفع المجمع */}
          <div 
            className={`tabs-grid-item ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الرفع المجمع
              </span>
            </div>
            <div className="tab-code-display">TAB-BATCH-UPLOAD</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب الرفع المجمع');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 4: حالة المعالجة */}
          <div 
            className={`tabs-grid-item ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                حالة المعالجة
              </span>
            </div>
            <div className="tab-code-display">TAB-PROCESSING-STATUS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب حالة المعالجة');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 5: مراجعة النتائج */}
          <div 
            className={`tabs-grid-item ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                مراجعة النتائج
              </span>
            </div>
            <div className="tab-code-display">TAB-RESULTS-REVIEW</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب مراجعة النتائج');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 6: التحقق التلقائي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'validation' ? 'active' : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التحقق التلقائي
              </span>
            </div>
            <div className="tab-code-display">TAB-AUTO-VALIDATION</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب التحقق التلقائي');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 7: ربط البيانات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'mapping' ? 'active' : ''}`}
            onClick={() => setActiveTab('mapping')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                ربط البيانات
              </span>
            </div>
            <div className="tab-code-display">TAB-DATA-MAPPING</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب ربط البيانات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 8: معالجة الأخطاء */}
          <div 
            className={`tabs-grid-item ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                معالجة الأخطاء
              </span>
            </div>
            <div className="tab-code-display">TAB-ERROR-HANDLING</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب معالجة الأخطاء');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 9: مراقبة الأداء */}
          <div 
            className={`tabs-grid-item ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                مراقبة الأداء
              </span>
            </div>
            <div className="tab-code-display">TAB-PERFORMANCE</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب مراقبة الأداء');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 10: إعدادات OCR متقدمة */}
          <div 
            className={`tabs-grid-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Cog className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات OCR متقدمة
              </span>
            </div>
            <div className="tab-code-display">TAB-OCR-SETTINGS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إعدادات OCR متقدمة');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 11: إعدادات محركات OCR الذكي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'smart-engines' ? 'active' : ''}`}
            onClick={() => setActiveTab('smart-engines')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                محركات OCR الذكية
              </span>
            </div>
            <div className="tab-code-display">TAB-SMART-OCR-ENGINES</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إعدادات محركات OCR الذكية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 12: إدارة الطابعات والماسحات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'printers-scanners' ? 'active' : ''}`}
            onClick={() => setActiveTab('printers-scanners')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Printer className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الطابعات والماسحات
              </span>
            </div>
            <div className="tab-code-display">TAB-PRINTERS-SCANNERS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إدارة الطابعات والماسحات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <div className="mt-6">
          {/* التبويب 1: إعداد محرك OCR */}
          <TabsContent value="setup" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-OCR-SETUP" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعداد وتكوين محركات OCR
                </h3>
                <Button className="btn-primary button-rtl">
                  <Plus className="h-4 w-4" />
                  إضافة محرك جديد
                </Button>
              </div>

              {/* كروت محركات OCR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {ocrEnginesData.map((engine) => (
                  <Card key={engine.id} className="card-element card-rtl">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {engine.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            الإصدار: {engine.version}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={engine.isInstalled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {engine.isInstalled ? 'مثبت' : 'غير مثبت'}
                          </Badge>
                          <Badge className={engine.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                            {engine.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* معلومات المسار */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            مسار التثبيت
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border font-mono text-xs">
                            {engine.installPath}
                          </div>
                        </div>

                        {/* مسار tessdata للتيسراكت */}
                        {engine.type === 'Tesseract' && engine.tessdataPath && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              مسار tessdata
                            </Label>
                            <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border font-mono text-xs">
                              {engine.tessdataPath}
                            </div>
                          </div>
                        )}

                        {/* اللغات المدعومة */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اللغات المدعومة:
                          </Label>
                          <div className="flex flex-wrap gap-1">
                            {engine.supportedLanguages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* إحصائيات الأداء */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="text-sm font-bold text-blue-600">
                              {engine.accuracy.toFixed(1)}%
                            </div>
                            <div className="text-xs text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الدقة
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <div className="text-sm font-bold text-green-600">
                              {engine.speed}%
                            </div>
                            <div className="text-xs text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              السرعة
                            </div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2">
                            <div className="text-sm font-bold text-orange-600">
                              {engine.memoryUsage.toFixed(1)} GB
                            </div>
                            <div className="text-xs text-orange-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الذاكرة
                            </div>
                          </div>
                        </div>

                        {/* آخر استخدام */}
                        {engine.lastUsed && (
                          <div className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            آخر استخدام: {formatDateTime(engine.lastUsed)}
                          </div>
                        )}

                        {/* أزرار الإجراءات */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="button-rtl"
                            onClick={() => testEngine(engine.id)}
                            disabled={!engine.isInstalled || engineTest === 'testing'}
                          >
                            {engineTest === 'testing' ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                            اختبار
                          </Button>
                          <Button size="sm" variant="outline" className="button-rtl">
                            <Settings className="h-4 w-4" />
                            إعدادات
                          </Button>
                          <Button size="sm" className="btn-primary button-rtl">
                            <Edit className="h-4 w-4" />
                            تعديل
                          </Button>
                        </div>

                        {/* حالة الاختبار */}
                        {engineTest === 'success' && (
                          <div className="text-center">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              المحرك يعمل بشكل صحيح
                            </Badge>
                          </div>
                        )}
                        
                        {engineTest === 'error' && (
                          <div className="text-center">
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              خطأ في تشغيل المحرك
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* التبويب 2: مدير قائمة الانتظار */}
          <TabsContent value="queue" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-QUEUE-MANAGER" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  مدير قائمة انتظار المعالجة
                </h3>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="button-rtl"
                    onClick={() => setQueueProcessing(!queueProcessing)}
                  >
                    {queueProcessing ? (
                      <>
                        <Pause className="h-4 w-4" />
                        إيقاف
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        بدء المعالجة
                      </>
                    )}
                  </Button>
                  <Button className="btn-primary button-rtl">
                    <RefreshCw className="h-4 w-4" />
                    تحديث القائمة
                  </Button>
                </div>
              </div>

              {/* جدول قائمة الانتظار */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      قائمة انتظار المعالجة
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="input-field pr-10"
                          placeholder="البحث في القائمة..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="input-field select-trigger">
                          <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">جميع الحالات</SelectItem>
                          <SelectItem value="منتظر">منتظر</SelectItem>
                          <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                          <SelectItem value="مكتمل">مكتمل</SelectItem>
                          <SelectItem value="خطأ">خطأ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الترتيب
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اسم الملف
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الأولوية
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            التقدم
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المحرك المخصص
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الوقت المتبقي
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            رفع بواسطة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredData(queueData, 'fileName').map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                {item.position > 0 && (
                                  <Badge variant="outline" className="font-mono">
                                    #{item.position}
                                  </Badge>
                                )}
                                {item.attempts > 1 && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                                    المحاولة {item.attempts}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                {item.fileType === 'PDF' && <FileText className="h-4 w-4 text-red-600" />}
                                {['JPG', 'JPEG', 'PNG', 'BMP', 'TIFF'].includes(item.fileType) && 
                                  <FileImage className="h-4 w-4 text-blue-600" />}
                                <div>
                                  <div className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {item.fileName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.fileType} • {formatFileSize(item.fileSize)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {item.status === 'قيد المعالجة' && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-mono">{item.progress}%</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="font-mono text-xs">
                                {item.assignedEngine}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {item.estimatedTime > 0 && (
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm font-mono">
                                    {formatTimeRemaining(item.estimatedTime)}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <div className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {item.userName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDateTime(item.uploadTime)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Pause className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* التبويب 3: الرفع المجمع */}
          <TabsContent value="batch" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-BATCH-UPLOAD" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الرفع المجمع للملفات
                </h3>
                <Button 
                  className="btn-primary button-rtl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  رفع دفعة جديدة
                </Button>
              </div>

              {/* نموذج إعداد الرفع المجمع */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إعداد الرفع المجمع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="batchName">اسم الدفعة</Label>
                          <Input
                            id="batchName"
                            className="input-field"
                            placeholder="أدخل اسم الدفعة"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="batchLanguage">لغة المعالجة</Label>
                          <div className="select-rtl">
                            <Select defaultValue="auto">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر اللغة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="arabic">عربي فقط</SelectItem>
                                <SelectItem value="english">إنجليزي فقط</SelectItem>
                                <SelectItem value="mixed">مختلط</SelectItem>
                                <SelectItem value="auto">تلقائي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="batchQuality">جودة المعالجة</Label>
                          <div className="select-rtl">
                            <Select defaultValue="balanced">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر الجودة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fast">سريع</SelectItem>
                                <SelectItem value="balanced">متوازن</SelectItem>
                                <SelectItem value="high">عالي</SelectItem>
                                <SelectItem value="ultra">فائق</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="batchEngine">المحرك المفضل</Label>
                          <div className="select-rtl">
                            <Select defaultValue="tesseract">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر المحرك" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tesseract">Tesseract 5.3.0</SelectItem>
                                <SelectItem value="easyocr">EasyOCR Arabic</SelectItem>
                                <SelectItem value="ollama">Ollama Vision</SelectItem>
                                <SelectItem value="auto">تلقائي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="scheduleType">نوع الجدولة</Label>
                          <div className="select-rtl">
                            <Select defaultValue="immediate">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر نوع الجدولة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">فوري</SelectItem>
                                <SelectItem value="scheduled">مجدول</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="scheduledTime">وقت الجدولة (اختياري)</Label>
                          <Input
                            id="scheduledTime"
                            type="datetime-local"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* منطقة السحب والإفلات */}
                    <Separator className="my-6" />
                    
                    <div 
                      className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFileUpload(e.dataTransfer.files);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Upload className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-emerald-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        اسحب الملفات هنا أو انقر للتحديد
                      </h3>
                      <p className="text-emerald-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        دعم متعدد الصيغ: PDF, JPG, PNG, JPEG, BMP, TIFF
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <Button className="btn-primary button-rtl" asChild>
                        <span>
                          <Plus className="h-4 w-4" />
                          تحديد الملفات
                        </span>
                      </Button>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" className="button-rtl">
                        <X className="h-4 w-4" />
                        إلغاء
                      </Button>
                      <Button className="btn-primary button-rtl">
                        <Send className="h-4 w-4" />
                        بدء الرفع المجمع
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* جدول الدفعات المرفوعة */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    سجل الرفع المجمع
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اسم الدفعة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            عدد الملفات
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحجم الإجمالي
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            المحرك
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            نوع الجدولة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            التقدم
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            بواسطة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchUploadsData.map((batch) => (
                          <TableRow key={batch.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div>
                                <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {batch.batchName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDateTime(batch.uploadDate)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {batch.filesCount}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatFileSize(batch.totalSize)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-xs">
                                {batch.engine}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                {batch.scheduleType === 'مجدول' ? (
                                  <Clock className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <Zap className="h-3 w-3 text-green-500" />
                                )}
                                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {batch.scheduleType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(batch.status)}>
                                {batch.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${batch.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-mono">{batch.progress}%</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {batch.processedFiles}/{batch.filesCount} ملف
                                {batch.failedFiles > 0 && ` (${batch.failedFiles} فشل)`}
                              </div>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {batch.createdBy}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* التبويب 11: إعدادات محركات OCR الذكي */}
          <TabsContent value="smart-engines" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-SMART-OCR-ENGINES" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات محركات OCR الذكية
                </h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="button-rtl">
                    <RefreshCw className="h-4 w-4" />
                    استعادة الإعدادات الافتراضية
                  </Button>
                  <Button 
                    className="btn-primary button-rtl"
                    onClick={() => setNewEngineDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    إضافة محرك جديد
                  </Button>
                </div>
              </div>

              {/* حقل اختيار المحركات المتعددة */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    اختيار محركات OCR النشطة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="form-rtl">
                    <div className="form-group">
                      <Label htmlFor="engines-selection">المحركات المفعلة للمعالجة</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        {['Tesseract', 'EasyOCR', 'Ollama', 'AnyLLM'].map((engine) => (
                          <div key={engine} className="flex items-center space-x-2 space-x-reverse">
                            <Switch
                              id={`engine-${engine}`}
                              checked={selectedEngines.includes(engine)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEngines([...selectedEngines, engine]);
                                } else {
                                  setSelectedEngines(selectedEngines.filter(e => e !== engine));
                                }
                              }}
                            />
                            <Label htmlFor={`engine-${engine}`} className="cursor-pointer" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {engine}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        عند التفعيل: يضاف المحرك لقائمة الانتظار في تب TAB-QUEUE-MANAGER
                        <br />
                        عند التعطيل: يُحذف من قوائم التشغيل ولا تستهلك موارد
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* جدول تعريف المحركات */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      جدول تعريف محركات OCR
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="input-field pr-10"
                          placeholder="البحث في المحركات..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="input-field select-trigger">
                          <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">جميع الحالات</SelectItem>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="مجمّد">مجمّد</SelectItem>
                          <SelectItem value="محذوف">محذوف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اسم المحرك
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الهوست نيم
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            بورت
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            IP Endpoint
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            API Key
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اختبار الاتصال
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {smartOCREnginesData.filter(engine => {
                          const matchesSearch = engine.engineName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                               engine.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                               engine.ipEndpoint.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesStatus = filterStatus === 'الكل' || engine.status === filterStatus;
                          return matchesSearch && matchesStatus;
                        }).map((engine) => (
                          <TableRow key={engine.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {engine.engineName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDateTime(engine.lastTested)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {engine.hostname}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {engine.port}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {engine.ipEndpoint}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs">
                                  {engine.apiKey.substring(0, 8)}...
                                </span>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(engine.status)}>
                                  {engine.status}
                                </Badge>
                                <Switch
                                  checked={engine.isEnabled}
                                  onCheckedChange={(checked) => {
                                    console.log(`تغيير حالة المحرك ${engine.engineName} إلى:`, checked);
                                  }}
                                  size="sm"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="button-rtl"
                                  onClick={() => testEngine(engine.id)}
                                  disabled={engineTest === 'testing'}
                                >
                                  {engineTest === 'testing' ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Zap className="h-3 w-3" />
                                  )}
                                  اختبار
                                </Button>
                                
                                {engine.connectionTest === 'success' && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-green-600">
                                      {engine.responseTime}ms
                                    </span>
                                  </div>
                                )}
                                
                                {engine.connectionTest === 'error' && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-red-600">
                                      خطأ
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الإجراءات */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" className="button-rtl">
                  <X className="h-4 w-4" />
                  إلغاء
                </Button>
                <Button className="btn-primary button-rtl">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </div>

              {/* نافذة إضافة محرك جديد */}
              <Dialog open={newEngineDialog} onOpenChange={setNewEngineDialog}>
                <DialogContent className="max-w-2xl dialog-rtl">
                  <DialogHeader className="dialog-header">
                    <DialogTitle className="dialog-title">
                      إضافة محرك OCR جديد
                    </DialogTitle>
                    <DialogDescription className="dialog-description">
                      قم بتعريف محرك OCR جديد مع معلومات الاتصال والإعدادات
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="new-engine-name">اسم المحرك *</Label>
                          <div className="select-rtl">
                            <Select>
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر نوع المحرك" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tesseract">Tesseract</SelectItem>
                                <SelectItem value="easyocr">EasyOCR</SelectItem>
                                <SelectItem value="ollama">Ollama</SelectItem>
                                <SelectItem value="anyllm">AnyLLM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="new-hostname">الهوست نيم *</Label>
                          <Input
                            id="new-hostname"
                            className="input-field"
                            placeholder="localhost أو 192.168.1.100"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="new-port">رقم البورت *</Label>
                          <Input
                            id="new-port"
                            type="number"
                            className="input-field"
                            placeholder="3001"
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="new-ip">IP Endpoint *</Label>
                          <Input
                            id="new-ip"
                            className="input-field"
                            placeholder="192.168.1.10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="new-api-key">API Key *</Label>
                          <Input
                            id="new-api-key"
                            type="password"
                            className="input-field"
                            placeholder="أدخل مفتاح API"
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="new-status">الحالة الابتدائية</Label>
                          <div className="select-rtl">
                            <Select defaultValue="نشط">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="نشط">نشط</SelectItem>
                                <SelectItem value="مجمّد">مجمّد</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Switch id="new-enabled" defaultChecked />
                            <Label htmlFor="new-enabled" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تفعيل المحرك مباشرة
                            </Label>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="new-notes">ملاحظات (اختياري)</Label>
                          <Textarea
                            id="new-notes"
                            className="textarea-field"
                            placeholder="أدخل أي ملاحظات إضافية..."
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        className="button-rtl"
                        onClick={() => setNewEngineDialog(false)}
                      >
                        <X className="h-4 w-4" />
                        إلغاء
                      </Button>
                      <Button 
                        variant="outline" 
                        className="button-rtl"
                      >
                        <Zap className="h-4 w-4" />
                        اختبار الاتصال
                      </Button>
                      <Button 
                        className="btn-primary button-rtl"
                        onClick={() => {
                          setNewEngineDialog(false);
                          alert('تم إضافة المحرك بنجاح');
                        }}
                      >
                        <Save className="h-4 w-4" />
                        حفظ المحرك
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* التبويب 12: إدارة الطابعات والماسحات */}
          <TabsContent value="printers-scanners" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-PRINTERS-SCANNERS" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إدارة الطابعات والماسحات
                </h3>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="button-rtl"
                    onClick={() => {
                      printersScannersData.forEach(device => {
                        if (device.currentUsageCount > 0) {
                          device.currentUsageCount = 0;
                        }
                      });
                      alert('تم إعادة ضبط العداد اليومي لجميع الأجهزة');
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    إعادة ضبط العداد اليومي
                  </Button>
                  <Button 
                    className="btn-primary button-rtl"
                    onClick={() => setNewDeviceDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    إضافة جهاز جديد
                  </Button>
                </div>
              </div>

              {/* جدول الأجهزة المضافة */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      قائمة الطابعات والماسحات
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="input-field pr-10"
                          placeholder="البحث في الأجهزة..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ fontFamily: 'Tajawal, sans-serif' }}
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="input-field select-trigger">
                          <SelectValue placeholder="تصفية بالحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الكل">جميع الحالات</SelectItem>
                          <SelectItem value="نشط">نشط</SelectItem>
                          <SelectItem value="معطل">معطل</SelectItem>
                          <SelectItem value="خطأ">خطأ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            نوع الجهاز
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الاسم
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            العنوان الشبكي
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            بورت
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حالة التمكين
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حد الاستخدام اليومي
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            عداد الاستخدام الحالي
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اختبار الاتصال
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {printersScannersData.filter(device => {
                          const matchesSearch = device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                               device.networkAddress.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesStatus = filterStatus === 'الكل' || device.status === filterStatus;
                          return matchesSearch && matchesStatus;
                        }).map((device) => (
                          <TableRow key={device.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                {device.deviceType === 'طابعة' ? (
                                  <Printer className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Scan className="h-4 w-4 text-green-600" />
                                )}
                                <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {device.deviceType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {device.deviceName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {device.connectionMode}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {device.networkAddress}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {device.port}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(device.status)}>
                                  {device.status}
                                </Badge>
                                <Switch
                                  checked={device.isEnabled}
                                  onCheckedChange={(checked) => {
                                    device.isEnabled = checked;
                                    device.status = checked ? 'نشط' : 'معطل';
                                    console.log(`تغيير حالة الجهاز ${device.deviceName} إلى:`, checked);
                                  }}
                                  size="sm"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="text-center">
                                <div className="font-mono font-bold">
                                  {device.dailyUsageLimit}
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                  {device.permissions === 'للجميع' ? 'للجميع' : 'محدود'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="text-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        (device.currentUsageCount / device.dailyUsageLimit) > 0.8 
                                          ? 'bg-red-500' 
                                          : (device.currentUsageCount / device.dailyUsageLimit) > 0.6 
                                            ? 'bg-yellow-500' 
                                            : 'bg-green-500'
                                      }`}
                                      style={{ 
                                        width: `${Math.min((device.currentUsageCount / device.dailyUsageLimit) * 100, 100)}%` 
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-mono">
                                    {device.currentUsageCount}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {Math.round((device.currentUsageCount / device.dailyUsageLimit) * 100)}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="button-rtl"
                                  onClick={() => testEngine(device.id)}
                                  disabled={engineTest === 'testing' || !device.isEnabled}
                                >
                                  {engineTest === 'testing' ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Zap className="h-3 w-3" />
                                  )}
                                  اختبار
                                </Button>
                                
                                {device.connectionTest === 'success' && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-green-600">
                                      {device.responseTime}ms
                                    </span>
                                  </div>
                                )}
                                
                                {device.connectionTest === 'error' && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-red-600">
                                      خطأ
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedDevice(device);
                                    setUsageLogDialog(true);
                                  }}
                                >
                                  <History className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    device.isEnabled = !device.isEnabled;
                                    device.status = device.isEnabled ? 'نشط' : 'معطل';
                                  }}
                                >
                                  {device.isEnabled ? (
                                    <PauseIcon className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* نافذة إضافة جهاز جديد */}
              <Dialog open={newDeviceDialog} onOpenChange={setNewDeviceDialog}>
                <DialogContent className="max-w-4xl dialog-rtl">
                  <DialogHeader className="dialog-header">
                    <DialogTitle className="dialog-title">
                      إضافة طابعة أو ماسح ضوئي جديد
                    </DialogTitle>
                    <DialogDescription className="dialog-description">
                      قم بتعريف جهاز جديد مع معلومات الشبكة وإعدادات الصلاحيات
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="device-type">نوع الجهاز *</Label>
                          <div className="select-rtl">
                            <Select>
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر نوع الجهاز" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="printer">طابعة</SelectItem>
                                <SelectItem value="scanner">ماسح ضوئي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="device-name">اسم الجهاز *</Label>
                          <Input
                            id="device-name"
                            className="input-field"
                            placeholder="مثال: HP LaserJet Pro 400"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="network-address">العنوان الشبكي *</Label>
                          <Input
                            id="network-address"
                            className="input-field"
                            placeholder="IP أو هوست نيم: 192.168.1.50"
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="device-port">رقم البورت *</Label>
                          <Input
                            id="device-port"
                            type="number"
                            className="input-field"
                            placeholder="9100"
                          />
                        </div>

                        <div className="form-group">
                          <Label htmlFor="connection-mode">وضع الاتصال</Label>
                          <div className="select-rtl">
                            <Select defaultValue="local">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر وضع الاتصال" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="local">محلي</SelectItem>
                                <SelectItem value="remote">عن بعد</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="permissions">صلاحيات الاستخدام</Label>
                          <div className="select-rtl">
                            <Select defaultValue="everyone">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر نوع الصلاحيات" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="everyone">للجميع</SelectItem>
                                <SelectItem value="specific">لأدوار محددة</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="daily-limit">الحد الأقصى للاستخدام اليومي</Label>
                          <Input
                            id="daily-limit"
                            type="number"
                            className="input-field"
                            placeholder="500"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            عدد العمليات المسموحة يومياً
                          </p>
                        </div>
                        
                        <div className="form-group">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Switch id="enable-device" defaultChecked />
                            <Label htmlFor="enable-device" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              تفعيل الجهاز مباشرة
                            </Label>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="device-notes">ملاحظات (اختياري)</Label>
                          <Textarea
                            id="device-notes"
                            className="textarea-field"
                            placeholder="أدخل أي ملاحظات حول الجهاز..."
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        className="button-rtl"
                        onClick={() => setNewDeviceDialog(false)}
                      >
                        <X className="h-4 w-4" />
                        إلغاء
                      </Button>
                      <Button 
                        variant="outline" 
                        className="button-rtl"
                      >
                        <Zap className="h-4 w-4" />
                        اختبار الاتصال
                      </Button>
                      <Button 
                        className="btn-primary button-rtl"
                        onClick={() => {
                          setNewDeviceDialog(false);
                          alert('تم إضافة الجهاز بنجاح');
                        }}
                      >
                        <Save className="h-4 w-4" />
                        حفظ الجهاز
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* نافذة سجل الاستخدام */}
              <Dialog open={usageLogDialog} onOpenChange={setUsageLogDialog}>
                <DialogContent className="max-w-6xl dialog-rtl">
                  <DialogHeader className="dialog-header">
                    <DialogTitle className="dialog-title">
                      سجل استخدام الجهاز - {selectedDevice?.deviceName}
                    </DialogTitle>
                    <DialogDescription className="dialog-description">
                      سجل العمليات للأيام الثلاثة الماضية
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="table-container">
                      <Table className="table-rtl">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              التاريخ
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              المستخدم
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              عدد العمليات
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              نوع العملية
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              إجمالي الصفحات
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الوقت
                            </TableHead>
                            <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              الحالة
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usageLogsData
                            .filter(log => selectedDevice && log.deviceId === selectedDevice.id)
                            .map((log) => (
                            <TableRow key={log.id} className="hover:bg-gray-50">
                              <TableCell className="text-right">
                                <div className="font-medium">
                                  {new Date(log.date).toLocaleDateString('ar-SA')}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {log.userName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {log.userId}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-mono font-bold">
                                  {log.operationsCount}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center gap-2">
                                  {log.operationType === 'طباعة' ? (
                                    <Printer className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <Scan className="h-4 w-4 text-green-600" />
                                  )}
                                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {log.operationType}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-mono font-bold">
                                  {log.totalPages}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="text-sm">
                                  <div>{log.startTime}</div>
                                  <div className="text-gray-500">إلى {log.endTime}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className={getStatusColor(log.status)}>
                                  {log.status}
                                </Badge>
                                {log.errorMessage && (
                                  <div className="text-xs text-red-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {log.errorMessage}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="button-rtl"
                        onClick={() => setUsageLogDialog(false)}
                      >
                        إغلاق
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* باقي التبويبات - placeholder للمحتوى */}
          {['status', 'results', 'validation', 'mapping', 'errors', 'performance', 'settings'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="space-y-4">
                <CodeDisplay 
                  code={
                    tab === 'status' ? 'TAB-PROCESSING-STATUS' :
                    tab === 'results' ? 'TAB-RESULTS-REVIEW' :
                    tab === 'validation' ? 'TAB-AUTO-VALIDATION' :
                    tab === 'mapping' ? 'TAB-DATA-MAPPING' :
                    tab === 'errors' ? 'TAB-ERROR-HANDLING' :
                    tab === 'performance' ? 'TAB-PERFORMANCE' :
                    'TAB-OCR-SETTINGS'
                  } 
                  position="top-right" 
                />
                
                <Card className="card-element card-rtl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {tab === 'status' && <Clock className="h-8 w-8 text-gray-400" />}
                      {tab === 'results' && <CheckCircle className="h-8 w-8 text-gray-400" />}
                      {tab === 'validation' && <ShieldCheck className="h-8 w-8 text-gray-400" />}
                      {tab === 'mapping' && <Database className="h-8 w-8 text-gray-400" />}
                      {tab === 'errors' && <AlertTriangle className="h-8 w-8 text-gray-400" />}
                      {tab === 'performance' && <BarChart3 className="h-8 w-8 text-gray-400" />}
                      {tab === 'settings' && <Cog className="h-8 w-8 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tab === 'status' && 'حالة المعالجة المباشرة'}
                      {tab === 'results' && 'مراجعة نتائج الاستخراج'}
                      {tab === 'validation' && 'التحقق التلقائي من البيانات'}
                      {tab === 'mapping' && 'ربط البيانات مع النظام'}
                      {tab === 'errors' && 'معالجة وحل الأخطاء'}
                      {tab === 'performance' && 'مراقبة أداء المحركات'}
                      {tab === 'settings' && 'إعدادات OCR المتقدمة'}
                    </h3>
                    <p className="text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tab === 'status' && 'تتبع مباشر للملفات قيد المعالجة مع تفاصيل المراحل'}
                      {tab === 'results' && 'مراجعة وتصحيح النصوص المستخرجة قبل الاعتماد'}
                      {tab === 'validation' && 'قواعد تحقق تلقائية للبيانات المستخرجة'}
                      {tab === 'mapping' && 'ربط الحقول المستخرجة بحقول النظام'}
                      {tab === 'errors' && 'إدارة وحل أخطاء المعالجة تلقائياً'}
                      {tab === 'performance' && 'مراقبة الأداء واستهلاك الموارد'}
                      {tab === 'settings' && 'إعدادات متقدمة لتحسين الدقة والسرعة'}
                    </p>
                    <Button className="btn-primary button-rtl">
                      <Plus className="h-4 w-4" />
                      ابدأ الآن
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}