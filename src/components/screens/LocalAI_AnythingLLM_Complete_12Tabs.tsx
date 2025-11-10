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
import { CodeDisplay } from '../CodeDisplay';
import { 
  Brain,
  Settings,
  ScanText,
  ShieldCheck,
  Database,
  Workflow,
  BookOpen,
  BarChart3,
  Layers,
  Lock,
  Cpu,
  Network,
  Upload,
  Download,
  Eye,
  Edit,
  Play,
  Pause,
  Stop,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Key,
  Zap,
  Target,
  FileText,
  Image,
  Code,
  Activity,
  TrendingUp,
  PieChart,
  Monitor,
  Globe,
  Shield,
  Server,
  HardDrive,
  MemoryStick,
  Gauge,
  Link,
  Send,
  MessageSquare,
  FileCheck,
  Hash,
  Fingerprint
} from 'lucide-react';

interface AIConnectionConfig {
  id: string;
  name: string;
  hostname: string;
  port: number;
  apiKey: string;
  isActive: boolean;
  connectionStatus: 'متصل' | 'غير متصل' | 'خطأ في الاتصال';
  lastPing: string;
  responseTime: number;
  version: string;
  model: string;
  endpoint: string;
}

interface OCRTask {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | 'JPEG';
  fileSize: number;
  language: 'عربي' | 'إنجليزي' | 'مختلط';
  status: 'في الانتظار' | 'قيد المعالجة' | 'مكتمل' | 'فشل' | 'يحتاج مراجعة';
  uploadDate: string;
  completionDate?: string;
  extractedText: string;
  confidence: number;
  manualCorrections: boolean;
  processingTime: number;
  errorMessage?: string;
}

interface VerificationResult {
  id: string;
  documentType: 'هوية وطنية' | 'جواز سفر' | 'رخصة قيادة' | 'عقد' | 'شهادة' | 'أخرى';
  idNumber: string;
  name: string;
  dateOfBirth: string;
  issueDate: string;
  expiryDate: string;
  verificationStatus: 'صحيح' | 'خطأ' | 'يحتاج مراجعة' | 'منتهي الصلاحية';
  confidenceScore: number;
  verificationDate: string;
  verifiedBy: string;
  notes: string;
  documentImage: string;
}

interface DataExtraction {
  id: string;
  sourceDocument: string;
  extractionType: 'معلومات شخصية' | 'تواريخ مهمة' | 'أرقام ومبالغ' | 'عناوين' | 'توقيعات';
  extractedFields: ExtractedField[];
  extractionDate: string;
  accuracy: number;
  reviewStatus: 'معتمد' | 'يحتاج مراجعة' | 'مرفوض';
  reviewedBy?: string;
  savedToDatabase: boolean;
}

interface ExtractedField {
  fieldName: string;
  fieldValue: string;
  confidence: number;
  coordinates: { x: number; y: number; width: number; height: number };
  dataType: 'نص' | 'رقم' | 'تاريخ' | 'عملة' | 'بريد إلكتروني' | 'رقم هاتف';
}

interface DocumentAnalysis {
  id: string;
  documentName: string;
  documentType: 'هوية' | 'جواز سفر' | 'عقد' | 'شهادة' | 'فاتورة' | 'تقرير' | 'غير محدد';
  authenticity: 'أصلي' | 'مشكوك فيه' | 'مزور' | 'غير محدد';
  qualityScore: number;
  readabilityScore: number;
  completenessScore: number;
  securityFeatures: SecurityFeature[];
  analysisDate: string;
  processingModel: string;
  riskLevel: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
}

interface SecurityFeature {
  featureName: string;
  detected: boolean;
  confidence: number;
  description: string;
}

interface AIWorkflow {
  id: string;
  workflowName: string;
  description: string;
  triggerCondition: string;
  actions: WorkflowAction[];
  isActive: boolean;
  createdDate: string;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'عاجل';
}

interface WorkflowAction {
  actionType: 'OCR' | 'تحليل الوثيقة' | 'استخراج البيانات' | 'التحقق' | 'إرسال تنبيه' | 'حفظ في قاعدة البيانات';
  parameters: { [key: string]: any };
  order: number;
}

interface TrainingDataset {
  id: string;
  datasetName: string;
  datasetType: 'OCR عربي' | 'OCR إنجليزي' | 'تحليل وثائق' | 'استخراج بيانات' | 'تحقق من الهوية';
  sampleCount: number;
  fileSize: number;
  uploadDate: string;
  trainingStatus: 'جاهز' | 'قيد التدريب' | 'مكتمل' | 'فشل';
  accuracy: number;
  lastTrainingDate?: string;
  modelVersion: string;
  tags: string[];
}

interface AIReport {
  id: string;
  reportType: 'دقة OCR' | 'إحصائيات المعالجة' | 'أداء النماذج' | 'استخدام الموارد' | 'أمان النظام';
  generationDate: string;
  dateRange: { from: string; to: string };
  totalOperations: number;
  successRate: number;
  averageProcessingTime: number;
  topErrors: string[];
  recommendations: string[];
  reportData: any;
}

interface BatchProcess {
  id: string;
  batchName: string;
  processType: 'OCR مجمع' | 'تحليل مجمع' | 'استخراج مجمع' | 'تحقق مجمع';
  filesCount: number;
  status: 'في الانتظار' | 'قيد التشغيل' | 'مكتمل' | 'متوقف' | 'فشل';
  progress: number;
  startTime?: string;
  endTime?: string;
  processedFiles: number;
  failedFiles: number;
  queuePosition: number;
  estimatedTime: number;
}

interface AIModel {
  id: string;
  modelName: string;
  modelType: 'OCR' | 'تحليل الوثائق' | 'استخراج البيانات' | 'معالجة اللغة الطبيعية' | 'رؤية حاسوبية';
  version: string;
  language: 'عربي' | 'إنجليزي' | 'متعدد اللغات';
  accuracy: number;
  speed: number;
  memoryUsage: number;
  isLoaded: boolean;
  lastUsed: string;
  usageCount: number;
  filePath: string;
  fileSize: number;
}

interface AISecurityLog {
  id: string;
  timestamp: string;
  operationType: 'OCR' | 'تحليل' | 'استخراج' | 'تدريب' | 'تحديث نموذج';
  userId: string;
  userName: string;
  dataProcessed: string;
  encryptionUsed: boolean;
  ipAddress: string;
  deviceInfo: string;
  risk: 'منخفض' | 'متوسط' | 'عالي';
  outcome: 'نجح' | 'فشل' | 'تم الرفض';
}

export default function LocalAI_AnythingLLM_Complete_12Tabs() {
  const [activeTab, setActiveTab] = useState('config');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [connectionTest, setConnectionTest] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // بيانات وهمية لإعدادات الاتصال
  const aiConnectionsData: AIConnectionConfig[] = [
    {
      id: '1',
      name: 'AnythingLLM الرئيسي',
      hostname: 'localhost',
      port: 3001,
      apiKey: 'anything-llm-key-2025-main',
      isActive: true,
      connectionStatus: 'متصل',
      lastPing: '2025-09-23 14:30:15',
      responseTime: 45,
      version: '1.2.3',
      model: 'GPT-4o-mini',
      endpoint: '/api/v1/workspace/chat'
    },
    {
      id: '2',
      name: 'خادم المعالجة الثانوي',
      hostname: '192.168.1.100',
      port: 3002,
      apiKey: 'anything-llm-key-2025-backup',
      isActive: false,
      connectionStatus: 'غير متصل',
      lastPing: '2025-09-23 12:15:30',
      responseTime: 0,
      version: '1.2.1',
      model: 'Claude-3-Haiku',
      endpoint: '/api/v1/workspace/chat'
    }
  ];

  // بيانات وهمية لمهام OCR
  const ocrTasksData: OCRTask[] = [
    {
      id: '1',
      fileName: 'هوية_احمد_علي.pdf',
      fileType: 'PDF',
      fileSize: 2.3,
      language: 'عربي',
      status: 'مكتمل',
      uploadDate: '2025-09-23 10:30:00',
      completionDate: '2025-09-23 10:32:15',
      extractedText: 'المملكة العربية السعودية\nالهوية الوطنية\nأحمد محمد العلي\n1234567890\nتاريخ الميلاد: 1990/05/15',
      confidence: 94.5,
      manualCorrections: false,
      processingTime: 135
    },
    {
      id: '2',
      fileName: 'contract_english.jpg',
      fileType: 'JPG',
      fileSize: 4.7,
      language: 'إنجليزي',
      status: 'قيد المعالجة',
      uploadDate: '2025-09-23 11:45:00',
      extractedText: '',
      confidence: 0,
      manualCorrections: false,
      processingTime: 0
    },
    {
      id: '3',
      fileName: 'فاتورة_كهرباء.png',
      fileType: 'PNG',
      fileSize: 1.8,
      language: 'مختلط',
      status: 'يحتاج مراجعة',
      uploadDate: '2025-09-23 09:20:00',
      completionDate: '2025-09-23 09:25:30',
      extractedText: 'الشركة السعودية للكهرباء\nفاتورة رقم: 12345\nالمبلغ: 450.00 ريال',
      confidence: 78.2,
      manualCorrections: true,
      processingTime: 330
    }
  ];

  // بيانات وهمية لنتائج التحقق
  const verificationData: VerificationResult[] = [
    {
      id: '1',
      documentType: 'هوية وطنية',
      idNumber: '1234567890',
      name: 'أحمد محمد العلي',
      dateOfBirth: '1990-05-15',
      issueDate: '2020-03-10',
      expiryDate: '2030-03-10',
      verificationStatus: 'صحيح',
      confidenceScore: 96.8,
      verificationDate: '2025-09-23',
      verifiedBy: 'النظام التلقائي',
      notes: 'جميع البيانات متطابقة مع قاعدة البيانات الحكومية',
      documentImage: '/docs/id_1234567890.jpg'
    },
    {
      id: '2',
      documentType: 'جواز سفر',
      idNumber: 'A12345678',
      name: 'سارة أحمد المحمد',
      dateOfBirth: '1985-12-20',
      issueDate: '2022-01-15',
      expiryDate: '2032-01-15',
      verificationStatus: 'يحتاج مراجعة',
      confidenceScore: 82.3,
      verificationDate: '2025-09-23',
      verifiedBy: 'م. خالد السعود',
      notes: 'رقم الجواز يحتاج تأكيد من الجهات المختصة',
      documentImage: '/docs/passport_A12345678.jpg'
    }
  ];

  // بيانات وهمية لاستخراج البيانات
  const dataExtractionData: DataExtraction[] = [
    {
      id: '1',
      sourceDocument: 'عقد_عمل_2025.pdf',
      extractionType: 'معلومات شخصية',
      extractedFields: [
        {
          fieldName: 'اسم الموظف',
          fieldValue: 'محمد أحمد الخالد',
          confidence: 95.2,
          coordinates: { x: 120, y: 200, width: 180, height: 25 },
          dataType: 'نص'
        },
        {
          fieldName: 'الراتب الأساسي',
          fieldValue: '8500.00',
          confidence: 98.7,
          coordinates: { x: 350, y: 450, width: 100, height: 20 },
          dataType: 'عملة'
        },
        {
          fieldName: 'تاريخ بداية العمل',
          fieldValue: '2025-01-01',
          confidence: 92.1,
          coordinates: { x: 200, y: 300, width: 120, height: 20 },
          dataType: 'تاريخ'
        }
      ],
      extractionDate: '2025-09-23',
      accuracy: 95.3,
      reviewStatus: 'معتمد',
      reviewedBy: 'سارة محمد',
      savedToDatabase: true
    }
  ];

  // بيانات وهمية لتحليل الوثائق
  const documentAnalysisData: DocumentAnalysis[] = [
    {
      id: '1',
      documentName: 'هوية_وطنية_نموذج.pdf',
      documentType: 'هوية',
      authenticity: 'أصلي',
      qualityScore: 94.5,
      readabilityScore: 97.2,
      completenessScore: 100,
      securityFeatures: [
        {
          featureName: 'الختم الأمني',
          detected: true,
          confidence: 96.8,
          description: 'ختم أمني صحيح وواضح'
        },
        {
          featureName: 'الخط المغناطيسي',
          detected: true,
          confidence: 89.2,
          description: 'خط مغناطيسي قابل للقراءة'
        },
        {
          featureName: 'العلامة المائية',
          detected: true,
          confidence: 92.1,
          description: 'علامة مائية أصلية'
        }
      ],
      analysisDate: '2025-09-23',
      processingModel: 'DocumentAnalyzer-v2.1',
      riskLevel: 'منخفض'
    }
  ];

  // بيانات وهمية لسير العمل الذكي
  const aiWorkflowsData: AIWorkflow[] = [
    {
      id: '1',
      workflowName: 'معالجة الهويات الوطنية تلقائياً',
      description: 'سير عمل تلقائي لمعالجة الهويات الوطنية من الرفع إلى التحقق والحفظ',
      triggerCondition: 'عند رفع ملف يحتوي على كلمة "هوية" في الاسم',
      actions: [
        {
          actionType: 'OCR',
          parameters: { language: 'عربي', enhanceImage: true },
          order: 1
        },
        {
          actionType: 'تحليل الوثيقة',
          parameters: { documentType: 'هوية وطنية', checkSecurity: true },
          order: 2
        },
        {
          actionType: 'استخراج البيانات',
          parameters: { fields: ['الاسم', 'رقم الهوية', 'تاريخ الميلاد'] },
          order: 3
        },
        {
          actionType: 'التحقق',
          parameters: { verifyWithGov: true, requiredAccuracy: 90 },
          order: 4
        },
        {
          actionType: 'حفظ في قاعدة البيانات',
          parameters: { table: 'national_ids', createBackup: true },
          order: 5
        }
      ],
      isActive: true,
      createdDate: '2025-09-01',
      lastExecuted: '2025-09-23 10:30:00',
      executionCount: 47,
      successRate: 94.2,
      priority: 'عالي'
    }
  ];

  // بيانات وهمية لبيانات التدريب
  const trainingDatasets: TrainingDataset[] = [
    {
      id: '1',
      datasetName: 'هويات وطنية سعودية',
      datasetType: 'OCR عربي',
      sampleCount: 5000,
      fileSize: 2.3,
      uploadDate: '2025-08-15',
      trainingStatus: 'مكتمل',
      accuracy: 96.8,
      lastTrainingDate: '2025-09-01',
      modelVersion: 'ArabicOCR-v3.2',
      tags: ['هوية', 'وثائق رسمية', 'عربي', 'عالي الجودة']
    },
    {
      id: '2',
      datasetName: 'جوازات سفر متنوعة',
      datasetType: 'تحليل وثائق',
      sampleCount: 2500,
      fileSize: 1.8,
      uploadDate: '2025-09-10',
      trainingStatus: 'قيد التدريب',
      accuracy: 89.4,
      modelVersion: 'PassportAnalyzer-v2.1',
      tags: ['جواز سفر', 'وثائق سفر', 'متعدد الجنسيات']
    }
  ];

  // بيانات وهمية لتقارير الذكاء الاصطناعي
  const aiReportsData: AIReport[] = [
    {
      id: '1',
      reportType: 'دقة OCR',
      generationDate: '2025-09-23',
      dateRange: { from: '2025-09-01', to: '2025-09-23' },
      totalOperations: 1247,
      successRate: 94.6,
      averageProcessingTime: 2.3,
      topErrors: [
        'جودة الصورة منخفضة',
        'نص مشوش أو غير واضح',
        'زاوية الصورة غير مناسبة'
      ],
      recommendations: [
        'تحسين جودة الصور قبل المعالجة',
        'إضافة خطوة تحسين الصورة تلقائياً',
        'تدريب النموذج على صور بجودات مختلفة'
      ],
      reportData: {
        dailyStats: [
          { date: '2025-09-20', operations: 89, success: 85, accuracy: 95.5 },
          { date: '2025-09-21', operations: 76, success: 71, accuracy: 93.4 },
          { date: '2025-09-22', operations: 92, success: 88, accuracy: 95.7 },
          { date: '2025-09-23', operations: 45, success: 43, accuracy: 95.6 }
        ]
      }
    }
  ];

  // بيانات وهمية للمعالجة المجمعة
  const batchProcesses: BatchProcess[] = [
    {
      id: '1',
      batchName: 'معالجة وثائق الموظفين الجدد',
      processType: 'OCR مجمع',
      filesCount: 25,
      status: 'مكتمل',
      progress: 100,
      startTime: '2025-09-23 09:00:00',
      endTime: '2025-09-23 09:45:30',
      processedFiles: 25,
      failedFiles: 0,
      queuePosition: 0,
      estimatedTime: 0
    },
    {
      id: '2',
      batchName: 'تحليل عقود العملاء',
      processType: 'تحليل مجمع',
      filesCount: 15,
      status: 'قيد التشغيل',
      progress: 67,
      startTime: '2025-09-23 14:15:00',
      processedFiles: 10,
      failedFiles: 1,
      queuePosition: 0,
      estimatedTime: 12
    },
    {
      id: '3',
      batchName: 'استخراج بيانات الفواتير',
      processType: 'استخراج مجمع',
      filesCount: 50,
      status: 'في الانتظار',
      progress: 0,
      processedFiles: 0,
      failedFiles: 0,
      queuePosition: 1,
      estimatedTime: 25
    }
  ];

  // بيانات وهمية لنماذج الذكاء الاصطناعي
  const aiModelsData: AIModel[] = [
    {
      id: '1',
      modelName: 'ArabicOCR-Advanced',
      modelType: 'OCR',
      version: '3.2.1',
      language: 'عربي',
      accuracy: 96.8,
      speed: 85,
      memoryUsage: 2.3,
      isLoaded: true,
      lastUsed: '2025-09-23 14:30:00',
      usageCount: 1247,
      filePath: '/models/arabic_ocr_v3.2.1.onnx',
      fileSize: 450.7
    },
    {
      id: '2',
      modelName: 'DocumentAnalyzer-Pro',
      modelType: 'تحليل الوثائق',
      version: '2.1.5',
      language: 'متعدد اللغات',
      accuracy: 94.2,
      speed: 92,
      memoryUsage: 1.8,
      isLoaded: true,
      lastUsed: '2025-09-23 13:45:00',
      usageCount: 892,
      filePath: '/models/doc_analyzer_v2.1.5.onnx',
      fileSize: 320.4
    },
    {
      id: '3',
      modelName: 'DataExtractor-Multi',
      modelType: 'استخراج البيانات',
      version: '1.9.2',
      language: 'متعدد اللغات',
      accuracy: 91.5,
      speed: 78,
      memoryUsage: 2.7,
      isLoaded: false,
      lastUsed: '2025-09-22 16:20:00',
      usageCount: 534,
      filePath: '/models/data_extractor_v1.9.2.onnx',
      fileSize: 678.9
    }
  ];

  // بيانات وهمية لسجل الأمان
  const aiSecurityLogs: AISecurityLog[] = [
    {
      id: '1',
      timestamp: '2025-09-23 14:30:15',
      operationType: 'OCR',
      userId: 'USR-001',
      userName: 'أحمد العلي',
      dataProcessed: 'هوية_وطنية_مشفرة.pdf',
      encryptionUsed: true,
      ipAddress: '192.168.1.100',
      deviceInfo: 'Windows 11 - Chrome 118',
      risk: 'منخفض',
      outcome: 'نجح'
    },
    {
      id: '2',
      timestamp: '2025-09-23 13:45:22',
      operationType: 'تحليل',
      userId: 'USR-002',
      userName: 'سارة محمد',
      dataProcessed: 'عقد_سري_محمي.pdf',
      encryptionUsed: true,
      ipAddress: '192.168.1.105',
      deviceInfo: 'macOS 14 - Safari 17',
      risk: 'متوسط',
      outcome: 'نجح'
    },
    {
      id: '3',
      timestamp: '2025-09-23 12:20:10',
      operationType: 'تدريب',
      userId: 'ADM-001',
      userName: 'خالد السعود',
      dataProcessed: 'مجموعة_بيانات_حساسة.zip',
      encryptionUsed: true,
      ipAddress: '192.168.1.200',
      deviceInfo: 'Ubuntu 22.04 - Firefox 119',
      risk: 'عالي',
      outcome: 'نجح'
    }
  ];

  // دالة تصفية البيانات
  const getFilteredData = (data: any[], searchField: string) => {
    return data.filter(item => {
      const matchesSearch = item[searchField]?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'الكل' || item.status === filterStatus || item.connectionStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متصل':
      case 'مكتمل':
      case 'نجح':
      case 'صحيح':
      case 'معتمد':
      case 'أصلي':
        return 'bg-green-100 text-green-800';
      case 'قيد المعالجة':
      case 'قيد التشغيل':
      case 'قيد التدريب':
      case 'في الانتظار':
      case 'يحتاج مراجعة':
        return 'bg-yellow-100 text-yellow-800';
      case 'غير متصل':
      case 'فشل':
      case 'خطأ في الاتصال':
      case 'مرفوض':
      case 'مزور':
        return 'bg-red-100 text-red-800';
      case 'متوقف':
      case 'مشكوك فيه':
      case 'منتهي الصلاحية':
        return 'bg-orange-100 text-orange-800';
      case 'منخفض':
        return 'bg-blue-100 text-blue-800';
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800';
      case 'عالي':
      case 'حرج':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // دالة اختبار الاتصال
  const testConnection = useCallback(async (connectionId: string) => {
    setConnectionTest('testing');
    
    // محاكاة اختبار الاتصال
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.2) {
        setConnectionTest('success');
      } else {
        setConnectionTest('error');
      }
      
      setTimeout(() => setConnectionTest('idle'), 3000);
    }, 2000);
  }, []);

  // دالة رفع الملفات لـ OCR
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    setOcrProcessing(true);
    Array.from(files).forEach(file => {
      console.log('معالجة ملف OCR:', file.name);
    });
    
    // محاكاة المعالجة
    setTimeout(() => {
      setOcrProcessing(false);
    }, 3000);
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

  return (
    <div className="space-y-6 relative" dir="rtl">
      <CodeDisplay code="SCR-LOCAL-AI-018" position="top-right" />
      
      {/* Header الشاشة */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الذكاء الاصطناعي المحلي (AnythingLLM)
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نظام متطور للذكاء الاصطناعي المحلي مع 12 تبويب متخصص لمعالجة الوثائق والتحليل الذكي
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              SCR-LOCAL-AI-018
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
              12 تبويب
            </Badge>
          </div>
        </div>
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">
              {aiConnectionsData.filter(c => c.connectionStatus === 'متصل').length}
            </div>
            <div className="text-sm text-purple-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اتصال نشط
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {ocrTasksData.filter(t => t.status === 'مكتمل').length}
            </div>
            <div className="text-sm text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              مهمة OCR مكتملة
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {aiModelsData.filter(m => m.isLoaded).length}
            </div>
            <div className="text-sm text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              نموذج محمّل
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-cyan-100">
            <div className="text-2xl font-bold text-cyan-600">
              {Math.round(aiReportsData[0]?.successRate || 0)}%
            </div>
            <div className="text-sm text-cyan-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              معدل النجاح
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات في شبكة أفقية */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rtl-support">
        <div className="tabs-grid-container">
          {/* التبويب 1: إعدادات الاتصال */}
          <div 
            className={`tabs-grid-item ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إعدادات الاتصال
              </span>
            </div>
            <div className="tab-code-display">TAB-AI-CONFIG</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إعدادات الاتصال');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 2: معالجة OCR */}
          <div 
            className={`tabs-grid-item ${activeTab === 'ocr' ? 'active' : ''}`}
            onClick={() => setActiveTab('ocr')}
          >
            <div className="flex items-center gap-2 mb-2">
              <ScanText className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                معالجة OCR
              </span>
            </div>
            <div className="tab-code-display">TAB-OCR-PROCESSING</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب معالجة OCR');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 3: التحقق التلقائي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التحقق التلقائي
              </span>
            </div>
            <div className="tab-code-display">TAB-AUTO-VERIFICATION</div>
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

          {/* التبويب 4: استخراج البيانات */}
          <div 
            className={`tabs-grid-item ${activeTab === 'extraction' ? 'active' : ''}`}
            onClick={() => setActiveTab('extraction')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                استخراج البيانات
              </span>
            </div>
            <div className="tab-code-display">TAB-DATA-EXTRACTION</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب استخراج البيانات');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 5: تحليل الوثائق */}
          <div 
            className={`tabs-grid-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تحليل الوثائق
              </span>
            </div>
            <div className="tab-code-display">TAB-DOCUMENT-ANALYSIS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب تحليل الوثائق');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 6: سير العمل الذكي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Workflow className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                سير العمل الذكي
              </span>
            </div>
            <div className="tab-code-display">TAB-AI-WORKFLOWS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب سير العمل الذكي');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 7: بيانات التدريب */}
          <div 
            className={`tabs-grid-item ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                بيانات التدريب
              </span>
            </div>
            <div className="tab-code-display">TAB-TRAINING-DATA</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب بيانات التدريب');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 8: تقارير الذكاء الاصطناعي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تقارير الذكاء الاصطناعي
              </span>
            </div>
            <div className="tab-code-display">TAB-AI-REPORTS</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب تقارير الذكاء الاصطناعي');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 9: المعالجة المجمعة الذكية */}
          <div 
            className={`tabs-grid-item ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                المعالجة المجمعة
              </span>
            </div>
            <div className="tab-code-display">TAB-BATCH-AI</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب المعالجة المجمعة الذكية');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 10: أمان الذكاء الاصطناعي */}
          <div 
            className={`tabs-grid-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                أمان الذكاء الاصطناعي
              </span>
            </div>
            <div className="tab-code-display">TAB-AI-SECURITY</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب أمان الذكاء الاصطناعي');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 11: إدارة النماذج */}
          <div 
            className={`tabs-grid-item ${activeTab === 'models' ? 'active' : ''}`}
            onClick={() => setActiveTab('models')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إدارة النماذج
              </span>
            </div>
            <div className="tab-code-display">TAB-MODEL-MANAGEMENT</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب إدارة النماذج');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>

          {/* التبويب 12: تكامل مع الشاشات الأخرى */}
          <div 
            className={`tabs-grid-item ${activeTab === 'integration' ? 'active' : ''}`}
            onClick={() => setActiveTab('integration')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-4 w-4" />
              <span className="font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                التكامل
              </span>
            </div>
            <div className="tab-code-display">TAB-AI-INTEGRATION</div>
            <button 
              className="permission-button permission-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                alert('طلب صلاحية لتبويب تكامل مع الشاشات الأخرى');
              }}
            >
              <Key className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* محتوى التبويبات */}
        <div className="mt-6">
          {/* التبويب 1: إعدادات الاتصال */}
          <TabsContent value="config" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-AI-CONFIG" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  إعدادات الاتصال مع AnythingLLM
                </h3>
                <Button className="btn-primary button-rtl">
                  <Plus className="h-4 w-4" />
                  إضافة اتصال جديد
                </Button>
              </div>

              {/* نموذج إعداد الاتصال */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إعداد اتصال AnythingLLM الرئيسي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="hostname">اسم المضيف (Hostname)</Label>
                          <Input
                            id="hostname"
                            className="input-field"
                            placeholder="localhost أو 192.168.1.100"
                            defaultValue="localhost"
                            style={{ fontFamily: 'Tajawal, sans-serif' }}
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="port">رقم المنفذ (Port)</Label>
                          <Input
                            id="port"
                            type="number"
                            className="input-field"
                            placeholder="3001"
                            defaultValue="3001"
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="endpoint">نقطة النهاية (Endpoint)</Label>
                          <Input
                            id="endpoint"
                            className="input-field"
                            placeholder="/api/v1/workspace/chat"
                            defaultValue="/api/v1/workspace/chat"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="form-group">
                          <Label htmlFor="apiKey">مفتاح API</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            className="input-field"
                            placeholder="أدخل مفتاح API"
                            defaultValue="anything-llm-key-2025-main"
                          />
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="model">النموذج المستخدم</Label>
                          <div className="select-rtl">
                            <Select defaultValue="gpt4o-mini">
                              <SelectTrigger className="input-field select-trigger">
                                <SelectValue placeholder="اختر النموذج" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt4o-mini">GPT-4o-mini</SelectItem>
                                <SelectItem value="claude-3-haiku">Claude-3-Haiku</SelectItem>
                                <SelectItem value="llama-2-7b">Llama-2-7B</SelectItem>
                                <SelectItem value="local-arabic">نموذج عربي محلي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <Label htmlFor="timeout">مهلة الاتصال (ثانية)</Label>
                          <Input
                            id="timeout"
                            type="number"
                            className="input-field"
                            placeholder="30"
                            defaultValue="30"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          className="button-rtl"
                          onClick={() => testConnection('1')}
                          disabled={connectionTest === 'testing'}
                        >
                          {connectionTest === 'testing' ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                          اختبار الاتصال
                        </Button>
                        
                        {connectionTest === 'success' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            متصل بنجاح
                          </Badge>
                        )}
                        
                        {connectionTest === 'error' && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            فشل في الاتصال
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" className="button-rtl">
                          إلغاء
                        </Button>
                        <Button className="btn-primary button-rtl">
                          <Save className="h-4 w-4" />
                          حفظ الإعدادات
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* جدول الاتصالات الموجودة */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    الاتصالات المكونة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="table-container">
                    <Table className="table-rtl">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اسم الاتصال
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            العنوان
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            النموذج
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            زمن الاستجابة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            آخر اتصال
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aiConnectionsData.map((connection) => (
                          <TableRow key={connection.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {connection.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    v{connection.version}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-mono text-sm">
                                {connection.hostname}:{connection.port}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="font-mono">
                                {connection.model}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3 text-green-600" />
                                <span className="text-sm">{connection.responseTime}ms</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(connection.connectionStatus)}>
                                {connection.connectionStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {formatDateTime(connection.lastPing)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => testConnection(connection.id)}>
                                  <Zap className="h-4 w-4" />
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

          {/* التبويب 2: معالجة OCR */}
          <TabsContent value="ocr" className="space-y-6">
            <div className="space-y-4">
              <CodeDisplay code="TAB-OCR-PROCESSING" position="top-right" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  معالجة OCR للنصوص العربية والإنجليزية
                </h3>
                <Button 
                  className="btn-primary button-rtl"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrProcessing}
                >
                  {ocrProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  رفع ملفات للمعالجة
                </Button>
              </div>

              {/* منطقة رفع الملفات */}
              <Card className="card-element card-rtl">
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <ScanText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      اسحب الملفات هنا أو انقر للاختيار
                    </h3>
                    <p className="text-purple-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      الصيغ المدعومة: PDF, JPG, PNG, JPEG (دعم النصوص العربية والإنجليزية)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <Button className="btn-primary button-rtl" asChild>
                      <span>
                        <Plus className="h-4 w-4" />
                        اختيار الملفات
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* إعدادات معالجة OCR */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    إعدادات معالجة OCR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="form-rtl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="form-group">
                        <Label htmlFor="ocrLanguage">لغة المعالجة</Label>
                        <div className="select-rtl">
                          <Select defaultValue="mixed">
                            <SelectTrigger className="input-field select-trigger">
                              <SelectValue placeholder="اختر اللغة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="arabic">عربي فقط</SelectItem>
                              <SelectItem value="english">إنجليزي فقط</SelectItem>
                              <SelectItem value="mixed">مختلط (عربي + إنجليزي)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <Label htmlFor="ocrQuality">جودة المعالجة</Label>
                        <div className="select-rtl">
                          <Select defaultValue="high">
                            <SelectTrigger className="input-field select-trigger">
                              <SelectValue placeholder="اختر الجودة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fast">سريع (دقة أقل)</SelectItem>
                              <SelectItem value="balanced">متوازن</SelectItem>
                              <SelectItem value="high">عالي الجودة</SelectItem>
                              <SelectItem value="ultra">فائق الجودة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <Label htmlFor="ocrModel">نموذج OCR</Label>
                        <div className="select-rtl">
                          <Select defaultValue="arabic-advanced">
                            <SelectTrigger className="input-field select-trigger">
                              <SelectValue placeholder="اختر النموذج" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="arabic-basic">عربي أساسي</SelectItem>
                              <SelectItem value="arabic-advanced">عربي متقدم</SelectItem>
                              <SelectItem value="multilingual">متعدد اللغات</SelectItem>
                              <SelectItem value="handwriting">خط يدوي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* جدول مهام OCR */}
              <Card className="card-element card-rtl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      مهام معالجة OCR
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="input-field pr-10"
                          placeholder="البحث في المهام..."
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
                          <SelectItem value="في الانتظار">في الانتظار</SelectItem>
                          <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
                          <SelectItem value="مكتمل">مكتمل</SelectItem>
                          <SelectItem value="يحتاج مراجعة">يحتاج مراجعة</SelectItem>
                          <SelectItem value="فشل">فشل</SelectItem>
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
                            اسم الملف
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            اللغة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            حجم الملف
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الحالة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الدقة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            وقت المعالجة
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            تاريخ الرفع
                          </TableHead>
                          <TableHead className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            الإجراءات
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredData(ocrTasksData, 'fileName').map((task) => (
                          <TableRow key={task.id} className="hover:bg-gray-50">
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                    {task.fileName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {task.fileType}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge 
                                variant="outline"
                                className={
                                  task.language === 'عربي' ? 'border-green-300 text-green-700' :
                                  task.language === 'إنجليزي' ? 'border-blue-300 text-blue-700' :
                                  'border-purple-300 text-purple-700'
                                }
                              >
                                {task.language}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatFileSize(task.fileSize)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {task.confidence > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        task.confidence >= 90 ? 'bg-green-500' :
                                        task.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${task.confidence}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-mono">{task.confidence.toFixed(1)}%</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {task.processingTime > 0 && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm">{task.processingTime}s</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {formatDateTime(task.uploadDate)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {task.status === 'يحتاج مراجعة' && (
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
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

          {/* باقي التبويبات - placeholder للمحتوى */}
          {['verification', 'extraction', 'analysis', 'workflows', 'training', 'reports', 'batch', 'security', 'models', 'integration'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              <div className="space-y-4">
                <CodeDisplay 
                  code={
                    tab === 'verification' ? 'TAB-AUTO-VERIFICATION' :
                    tab === 'extraction' ? 'TAB-DATA-EXTRACTION' :
                    tab === 'analysis' ? 'TAB-DOCUMENT-ANALYSIS' :
                    tab === 'workflows' ? 'TAB-AI-WORKFLOWS' :
                    tab === 'training' ? 'TAB-TRAINING-DATA' :
                    tab === 'reports' ? 'TAB-AI-REPORTS' :
                    tab === 'batch' ? 'TAB-BATCH-AI' :
                    tab === 'security' ? 'TAB-AI-SECURITY' :
                    tab === 'models' ? 'TAB-MODEL-MANAGEMENT' :
                    'TAB-AI-INTEGRATION'
                  } 
                  position="top-right" 
                />
                
                <Card className="card-element card-rtl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {tab === 'verification' && <ShieldCheck className="h-8 w-8 text-gray-400" />}
                      {tab === 'extraction' && <Database className="h-8 w-8 text-gray-400" />}
                      {tab === 'analysis' && <FileCheck className="h-8 w-8 text-gray-400" />}
                      {tab === 'workflows' && <Workflow className="h-8 w-8 text-gray-400" />}
                      {tab === 'training' && <BookOpen className="h-8 w-8 text-gray-400" />}
                      {tab === 'reports' && <BarChart3 className="h-8 w-8 text-gray-400" />}
                      {tab === 'batch' && <Layers className="h-8 w-8 text-gray-400" />}
                      {tab === 'security' && <Lock className="h-8 w-8 text-gray-400" />}
                      {tab === 'models' && <Cpu className="h-8 w-8 text-gray-400" />}
                      {tab === 'integration' && <Network className="h-8 w-8 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tab === 'verification' && 'التحقق التلقائي من الوثائق'}
                      {tab === 'extraction' && 'استخراج البيانات الذكي'}
                      {tab === 'analysis' && 'تحليل الوثائق المتقدم'}
                      {tab === 'workflows' && 'سير العمل الذكي'}
                      {tab === 'training' && 'بيانات التدريب والنماذج'}
                      {tab === 'reports' && 'تقارير الذكاء الاصطناعي'}
                      {tab === 'batch' && 'المعالجة المجمعة الذكية'}
                      {tab === 'security' && 'أمان الذكاء الاصطناعي'}
                      {tab === 'models' && 'إدارة النماذج'}
                      {tab === 'integration' && 'التكامل مع الشاشات'}
                    </h3>
                    <p className="text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {tab === 'verification' && 'فحص صحة المرفقات والتحقق من البيانات تلقائياً'}
                      {tab === 'extraction' && 'استخراج المعلومات من الوثائق وحفظها في قاعدة البيانات'}
                      {tab === 'analysis' && 'تحليل نوع الوثيقة وكشف التلاعب والمصادقة'}
                      {tab === 'workflows' && 'إنشاء قواعد تلقائية للمعالجة وجدولة المهام'}
                      {tab === 'training' && 'رفع عينات للتدريب وتحسين دقة النماذج العربية'}
                      {tab === 'reports' && 'تقارير دقة OCR وإحصائيات المعالجة وتحليل الأداء'}
                      {tab === 'batch' && 'معالجة عشرات الملفات دفعة واحدة مع متابعة الحالة'}
                      {tab === 'security' && 'تشفير البيانات وسجل العمليات وضوابط الوصول'}
                      {tab === 'models' && 'اختيار النموذج وتحديث النماذج ومراقبة الموارد'}
                      {tab === 'integration' && 'ربط تلقائي مع شاشات المعاملات والعملاء والموظفين'}
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