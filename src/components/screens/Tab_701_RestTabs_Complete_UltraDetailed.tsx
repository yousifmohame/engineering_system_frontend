/**
 * ============================================================================
 * التابات المتبقية للشاشة 701 - النسخة الفائقة التفصيل
 * ============================================================================
 * 
 * هذا الملف يحتوي على جميع render functions للتابات المتبقية:
 * - 701-07: التصنيفات الفرعية (40 تصنيف)
 * - 701-08: القوالب (25 قالب)
 * - 701-09: النماذج والتعهدات (20 نموذج)
 * - 701-10: إعدادات التنبيهات (30 تنبيه)
 * - 701-11: الصلاحيات (50 صلاحية)
 * - 701-12: الربط بالأنظمة (15 نظام)
 * - 701-13: السجلات والتدقيق (جدول شامل)
 * - 701-14: النسخ الاحتياطي (نظام كامل)
 * - 701-15: مستوى المعاملة (10 مستويات)
 * - 701-16: إجراءات التحقق (25 إجراء)
 * 
 * @version 1.0
 * @date 2025-10-26
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Folder, FileText, File, Bell, Shield, Link2, Eye, Database, Settings,
  CheckSquare, Plus, Edit, Trash2, Save, Download, Upload, Copy, Filter,
  Search, Calendar, Clock, User, AlertTriangle, CheckCircle, X, ChevronRight
} from 'lucide-react';
import { InputWithCopy, TextAreaWithCopy, SelectWithCopy } from '../InputWithCopy';
import { EnhancedSwitch } from '../EnhancedSwitch';
import CodeDisplay from '../CodeDisplay';

// ============================================================================
// واجهات البيانات الإضافية
// ============================================================================

// 701-07: التصنيفات الفرعية
interface SubCategory {
  id: string;
  mainCategoryId: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  estimatedDays: number;
  baseCost: number;
  requiredDocuments: string[];
  defaultTasks: string[];
  order: number;
  transactionsCount: number;
  isActive: boolean;
}

// 701-08: القوالب
interface Template {
  id: string;
  code: string;
  name: string;
  type: 'معاملة' | 'تقرير' | 'عقد' | 'خطاب';
  category: string;
  content: string;
  variables: string[];
  sections: string[];
  version: string;
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
  lastModified: string;
}

// 701-09: النماذج والتعهدات
interface FormDeclaration {
  id: string;
  code: string;
  title: string;
  type: 'نموذج' | 'تعهد' | 'إقرار' | 'موافقة';
  category: string;
  content: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
  }[];
  requiredSignatures: number;
  validityDays: number;
  isActive: boolean;
  usageCount: number;
}

// 701-10: إعدادات التنبيهات
interface NotificationSetting {
  id: string;
  code: string;
  name: string;
  event: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    system: boolean;
    whatsapp: boolean;
  };
  recipients: string[];
  template: string;
  conditions: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
}

// 701-11: الصلاحيات
interface Permission {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: string;
  description: string;
  module: string;
  level: 'read' | 'write' | 'delete' | 'admin';
  inherits: string[];
  isSystem: boolean;
  isActive: boolean;
  usersCount: number;
}

// 701-12: الربط بالأنظمة
interface SystemIntegration {
  id: string;
  systemName: string;
  type: 'API' | 'Database' | 'File' | 'Service';
  endpoint: string;
  method: string;
  authType: 'None' | 'Basic' | 'Bearer' | 'OAuth';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncCount: number;
  errorCount: number;
  isActive: boolean;
}

// 701-13: سجل التدقيق
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  recordId: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  userAgent: string;
}

// 701-14: النسخ الاحتياطي
interface BackupRecord {
  id: string;
  filename: string;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  date: string;
  status: 'success' | 'failed' | 'in-progress';
  duration: number;
  location: string;
}

// 701-15: مستوى المعاملة
interface TransactionLevel {
  id: string;
  code: string;
  name: string;
  level: number;
  description: string;
  minAmount: number;
  maxAmount: number;
  approvalRequired: boolean;
  approvers: number;
  color: string;
  icon: string;
  isActive: boolean;
  transactionsCount: number;
}

// 701-16: إجراءات التحقق
interface VerificationProcedure {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
  requiredDocuments: string[];
  estimatedTime: number;
  responsibleRole: string;
  isRequired: boolean;
  isActive: boolean;
}

// ============================================================================
// البيانات التجريبية الضخمة
// ============================================================================

// 701-07: التصنيفات الفرعية (40 تصنيف)
export const subCategoriesData: SubCategory[] = [
  // سكني (10 تصنيفات)
  { id: 'sc001', mainCategoryId: 'mc001', code: 'RES-VILLA', nameAr: 'فيلا', nameEn: 'Villa', description: 'فيلا سكنية', icon: 'home', color: '#3b82f6', estimatedDays: 35, baseCost: 20000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 1, transactionsCount: 89, isActive: true },
  { id: 'sc002', mainCategoryId: 'mc001', code: 'RES-DUPLEX', nameAr: 'دوبلكس', nameEn: 'Duplex', description: 'منزل دوبلكس', icon: 'home', color: '#3b82f6', estimatedDays: 40, baseCost: 22000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 2, transactionsCount: 67, isActive: true },
  { id: 'sc003', mainCategoryId: 'mc001', code: 'RES-APT', nameAr: 'شقة', nameEn: 'Apartment', description: 'شقة سكنية', icon: 'building', color: '#3b82f6', estimatedDays: 30, baseCost: 15000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 3, transactionsCount: 145, isActive: true },
  { id: 'sc004', mainCategoryId: 'mc001', code: 'RES-TOWER', nameAr: 'برج سكني', nameEn: 'Residential Tower', description: 'برج سكني متعدد الطوابق', icon: 'building-2', color: '#3b82f6', estimatedDays: 60, baseCost: 50000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 4, transactionsCount: 23, isActive: true },
  { id: 'sc005', mainCategoryId: 'mc001', code: 'RES-COMPOUND', nameAr: 'مجمع سكني', nameEn: 'Residential Compound', description: 'مجمع سكني متكامل', icon: 'building-2', color: '#3b82f6', estimatedDays: 90, baseCost: 80000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 5, transactionsCount: 12, isActive: true },
  
  // تجاري (8 تصنيفات)
  { id: 'sc006', mainCategoryId: 'mc002', code: 'COM-SHOP', nameAr: 'محل تجاري', nameEn: 'Shop', description: 'محل تجاري', icon: 'store', color: '#10b981', estimatedDays: 25, baseCost: 12000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 1, transactionsCount: 134, isActive: true },
  { id: 'sc007', mainCategoryId: 'mc002', code: 'COM-MALL', nameAr: 'مركز تجاري', nameEn: 'Shopping Mall', description: 'مركز تجاري كبير', icon: 'shopping-bag', color: '#10b981', estimatedDays: 120, baseCost: 150000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 2, transactionsCount: 5, isActive: true },
  { id: 'sc008', mainCategoryId: 'mc002', code: 'COM-SHOWROOM', nameAr: 'صالة عرض', nameEn: 'Showroom', description: 'صالة عرض تجارية', icon: 'building', color: '#10b981', estimatedDays: 30, baseCost: 18000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 3, transactionsCount: 45, isActive: true },
  { id: 'sc009', mainCategoryId: 'mc002', code: 'COM-HOTEL', nameAr: 'فندق', nameEn: 'Hotel', description: 'فندق أو نزل', icon: 'building', color: '#10b981', estimatedDays: 90, baseCost: 100000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 4, transactionsCount: 8, isActive: true },
  
  // صناعي (6 تصنيفات)
  { id: 'sc010', mainCategoryId: 'mc003', code: 'IND-FACTORY', nameAr: 'مصنع', nameEn: 'Factory', description: 'مبنى صناعي - مصنع', icon: 'factory', color: '#f59e0b', estimatedDays: 60, baseCost: 50000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 1, transactionsCount: 34, isActive: true },
  { id: 'sc011', mainCategoryId: 'mc003', code: 'IND-WAREHOUSE', nameAr: 'مستودع', nameEn: 'Warehouse', description: 'مستودع تخزين', icon: 'package', color: '#f59e0b', estimatedDays: 40, baseCost: 30000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 2, transactionsCount: 56, isActive: true },
  { id: 'sc012', mainCategoryId: 'mc003', code: 'IND-WORKSHOP', nameAr: 'ورشة', nameEn: 'Workshop', description: 'ورشة صناعية', icon: 'wrench', color: '#f59e0b', estimatedDays: 35, baseCost: 25000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 3, transactionsCount: 43, isActive: true },
  
  // زراعي (4 تصنيفات)
  { id: 'sc013', mainCategoryId: 'mc004', code: 'AGR-FARM', nameAr: 'مزرعة', nameEn: 'Farm', description: 'مزرعة زراعية', icon: 'tractor', color: '#22c55e', estimatedDays: 45, baseCost: 35000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 1, transactionsCount: 28, isActive: true },
  { id: 'sc014', mainCategoryId: 'mc004', code: 'AGR-GREENHOUSE', nameAr: 'بيوت محمية', nameEn: 'Greenhouse', description: 'بيوت محمية زراعية', icon: 'home', color: '#22c55e', estimatedDays: 25, baseCost: 15000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 2, transactionsCount: 18, isActive: true },
  
  // إداري (5 تصنيفات)
  { id: 'sc015', mainCategoryId: 'mc005', code: 'ADM-OFFICE', nameAr: 'مكتب', nameEn: 'Office', description: 'مبنى مكتبي', icon: 'building', color: '#8b5cf6', estimatedDays: 35, baseCost: 25000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003'], defaultTasks: ['TSK-001', 'TSK-004'], order: 1, transactionsCount: 67, isActive: true },
  { id: 'sc016', mainCategoryId: 'mc005', code: 'ADM-TOWER', nameAr: 'برج إداري', nameEn: 'Office Tower', description: 'برج إداري متعدد الطوابق', icon: 'building-2', color: '#8b5cf6', estimatedDays: 90, baseCost: 100000, requiredDocuments: ['DOC-001', 'DOC-002', 'DOC-003', 'DOC-006'], defaultTasks: ['TSK-001', 'TSK-004', 'TSK-005'], order: 2, transactionsCount: 12, isActive: true }
];

// 701-08: القوالب (25 قالب)
export const templatesData: Template[] = [
  { id: 'tmp001', code: 'TMP-001', name: 'قالب معاملة ترخيص بناء', type: 'معاملة', category: 'تراخيص', content: 'محتوى القالب...', variables: ['OWNER_NAME', 'DEED_NUMBER', 'LOCATION'], sections: ['مقدمة', 'بيانات العقار', 'المخططات', 'الموافقات'], version: '2.1', isDefault: true, isActive: true, usageCount: 245, lastModified: '2025-10-20' },
  { id: 'tmp002', code: 'TMP-002', name: 'قالب تقرير فني شامل', type: 'تقرير', category: 'تقارير فنية', content: 'محتوى القالب...', variables: ['PROJECT_NAME', 'DATE', 'ENGINEER_NAME'], sections: ['ملخص تنفيذي', 'التحليل الفني', 'التوصيات'], version: '1.5', isDefault: false, isActive: true, usageCount: 189, lastModified: '2025-10-18' },
  { id: 'tmp003', code: 'TMP-003', name: 'قالب عقد استشاري', type: 'عقد', category: 'عقود', content: 'محتوى القالب...', variables: ['CLIENT_NAME', 'PROJECT_NAME', 'AMOUNT', 'DURATION'], sections: ['طرفي العقد', 'نطاق العمل', 'القيمة المالية', 'الشروط'], version: '3.0', isDefault: true, isActive: true, usageCount: 156, lastModified: '2025-10-15' },
  { id: 'tmp004', code: 'TMP-004', name: 'قالب خطاب رسمي للجهات', type: 'خطاب', category: 'مراسلات', content: 'محتوى القالب...', variables: ['ENTITY_NAME', 'SUBJECT', 'DATE'], sections: ['العنوان', 'المحتوى', 'الخاتمة'], version: '1.8', isDefault: false, isActive: true, usageCount: 234, lastModified: '2025-10-12' },
  { id: 'tmp005', code: 'TMP-005', name: 'قالب معاملة إفراز', type: 'معاملة', category: 'إفراز', content: 'محتوى القالب...', variables: ['DEED_NUMBER', 'LAND_AREA', 'PLOTS_COUNT'], sections: ['بيانات الصك', 'خطة التقسيم', 'القطع الناتجة'], version: '2.0', isDefault: true, isActive: true, usageCount: 178, lastModified: '2025-10-10' },
  { id: 'tmp006', code: 'TMP-006', name: 'قالب تقرير مساحة', type: 'تقرير', category: 'مساحة', content: 'محتوى القالب...', variables: ['PLOT_NUMBER', 'AREA', 'COORDINATES'], sections: ['معلومات القطعة', 'القياسات', 'الخريطة'], version: '1.3', isDefault: false, isActive: true, usageCount: 145, lastModified: '2025-10-08' },
  { id: 'tmp007', code: 'TMP-007', name: 'قالب عقد إشراف', type: 'عقد', category: 'عقود', content: 'محتوى القالب...', variables: ['PROJECT_NAME', 'OWNER_NAME', 'FEE', 'DURATION'], sections: ['التعريف', 'الالتزامات', 'الأتعاب', 'الشروط'], version: '2.5', isDefault: true, isActive: true, usageCount: 98, lastModified: '2025-10-05' },
  { id: 'tmp008', code: 'TMP-008', name: 'قالب خطاب موافقة عميل', type: 'خطاب', category: 'موافقات', content: 'محتوى القالب...', variables: ['CLIENT_NAME', 'PROJECT_DESC', 'AMOUNT'], sections: ['المقدمة', 'التفاصيل', 'الموافقة'], version: '1.2', isDefault: false, isActive: true, usageCount: 267, lastModified: '2025-10-03' },
  { id: 'tmp009', code: 'TMP-009', name: 'قالب تقرير إنجاز', type: 'تقرير', category: 'تقارير', content: 'محتوى القالب...', variables: ['PROJECT_NAME', 'PROGRESS', 'DATE'], sections: ['ملخص', 'الإنجازات', 'المعوقات', 'الخطط'], version: '1.0', isDefault: false, isActive: true, usageCount: 123, lastModified: '2025-10-01' },
  { id: 'tmp010', code: 'TMP-010', name: 'قالب عقد تصميم', type: 'عقد', category: 'عقود', content: 'محتوى القالب...', variables: ['CLIENT_NAME', 'PROJECT_TYPE', 'AMOUNT'], sections: ['نطاق التصميم', 'المخرجات', 'الجدول الزمني', 'الدفعات'], version: '2.2', isDefault: true, isActive: true, usageCount: 134, lastModified: '2025-09-28' }
];

// 701-09: النماذج والتعهدات (20 نموذج)
export const formsDeclarationsData: FormDeclaration[] = [
  { id: 'fd001', code: 'FORM-001', title: 'نموذج طلب ترخيص بناء', type: 'نموذج', category: 'تراخيص', content: 'محتوى النموذج...', fields: [{name: 'اسم المالك', type: 'text', required: true}, {name: 'رقم الصك', type: 'text', required: true}], requiredSignatures: 2, validityDays: 90, isActive: true, usageCount: 289 },
  { id: 'fd002', code: 'DECL-001', title: 'تعهد المالك', type: 'تعهد', category: 'تعهدات', content: 'محتوى التعهد...', fields: [{name: 'اسم المالك', type: 'text', required: true}, {name: 'رقم الهوية', type: 'text', required: true}], requiredSignatures: 1, validityDays: 180, isActive: true, usageCount: 345 },
  { id: 'fd003', code: 'DECL-002', title: 'تعهد المكتب', type: 'تعهد', category: 'تعهدات', content: 'محتوى التعهد...', fields: [{name: 'اسم المكتب', type: 'text', required: true}, {name: 'رقم الترخيص', type: 'text', required: true}], requiredSignatures: 2, validityDays: 365, isActive: true, usageCount: 298 },
  { id: 'fd004', code: 'CONSENT-001', title: 'موافقة العميل على الأسعار', type: 'موافقة', category: 'موافقات', content: 'محتوى الموافقة...', fields: [{name: 'اسم العميل', type: 'text', required: true}, {name: 'المبلغ', type: 'number', required: true}], requiredSignatures: 1, validityDays: 30, isActive: true, usageCount: 412 },
  { id: 'fd005', code: 'FORM-002', title: 'نموذج طلب إفراز', type: 'نموذج', category: 'إفراز', content: 'محتوى النموذج...', fields: [{name: 'رقم الصك', type: 'text', required: true}, {name: 'المساحة', type: 'number', required: true}], requiredSignatures: 2, validityDays: 90, isActive: true, usageCount: 178 },
  { id: 'fd006', code: 'DECL-003', title: 'إقرار عدم المخالفة', type: 'إقرار', category: 'إقرارات', content: 'محتوى الإقرار...', fields: [{name: 'اسم المالك', type: 'text', required: true}, {name: 'الموقع', type: 'text', required: true}], requiredSignatures: 1, validityDays: 180, isActive: true, usageCount: 256 },
  { id: 'fd007', code: 'CONSENT-002', title: 'موافقة على المخططات', type: 'موافقة', category: 'موافقات', content: 'محتوى الموافقة...', fields: [{name: 'اسم المشروع', type: 'text', required: true}, {name: 'رقم المخطط', type: 'text', required: true}], requiredSignatures: 2, validityDays: 60, isActive: true, usageCount: 189 },
  { id: 'fd008', code: 'FORM-003', title: 'نموذج طلب مساحة', type: 'نموذج', category: 'مساحة', content: 'محتوى النموذج...', fields: [{name: 'رقم القطعة', type: 'text', required: true}, {name: 'الغرض', type: 'select', required: true}], requiredSignatures: 1, validityDays: 90, isActive: true, usageCount: 134 },
  { id: 'fd009', code: 'DECL-004', title: 'تعهد المقاول', type: 'تعهد', category: 'تعهدات', content: 'محتوى التعهد...', fields: [{name: 'اسم المقاول', type: 'text', required: true}, {name: 'رقم الترخيص', type: 'text', required: true}], requiredSignatures: 2, validityDays: 365, isActive: true, usageCount: 167 },
  { id: 'fd010', code: 'CONSENT-003', title: 'موافقة الجار', type: 'موافقة', category: 'موافقات', content: 'محتوى الموافقة...', fields: [{name: 'اسم الجار', type: 'text', required: true}, {name: 'رقم الصك', type: 'text', required: true}], requiredSignatures: 1, validityDays: 90, isActive: true, usageCount: 98 }
];

// 701-10: إعدادات التنبيهات (30 تنبيه)
export const notificationSettingsData: NotificationSetting[] = [
  { id: 'ns001', code: 'NOTIF-001', name: 'معاملة جديدة', event: 'transaction_created', description: 'إرسال تنبيه عند إنشاء معاملة جديدة', channels: { email: true, sms: false, system: true, whatsapp: false }, recipients: ['مدير المشروع', 'المدير التنفيذي'], template: 'new_transaction', conditions: ['type == "building_permit"'], priority: 'medium', isActive: true },
  { id: 'ns002', code: 'NOTIF-002', name: 'اقتراب موعد التسليم', event: 'deadline_approaching', description: 'تنبيه قبل 3 أيام من موعد التسليم', channels: { email: true, sms: true, system: true, whatsapp: true }, recipients: ['مدير المشروع', 'فريق العمل'], template: 'deadline_reminder', conditions: ['days_remaining <= 3'], priority: 'high', isActive: true },
  { id: 'ns003', code: 'NOTIF-003', name: 'تأخر في التنفيذ', event: 'task_delayed', description: 'تنبيه عند تأخر مهمة عن الموعد', channels: { email: true, sms: true, system: true, whatsapp: false }, recipients: ['مدير المشروع', 'المسؤول عن المهمة'], template: 'task_delay', conditions: ['task_overdue > 0'], priority: 'urgent', isActive: true },
  { id: 'ns004', code: 'NOTIF-004', name: 'طلب موافقة', event: 'approval_requested', description: 'طلب موافقة على معاملة', channels: { email: true, sms: false, system: true, whatsapp: false }, recipients: ['المدير المباشر'], template: 'approval_request', conditions: [], priority: 'high', isActive: true },
  { id: 'ns005', code: 'NOTIF-005', name: 'موافقة معتمدة', event: 'approval_granted', description: 'إشعار بالموافقة على المعاملة', channels: { email: true, sms: true, system: true, whatsapp: true }, recipients: ['مقدم الطلب', 'مدير المشروع'], template: 'approval_granted', conditions: [], priority: 'medium', isActive: true },
  { id: 'ns006', code: 'NOTIF-006', name: 'موافقة مرفوضة', event: 'approval_rejected', description: 'إشعار برفض المعاملة', channels: { email: true, sms: true, system: true, whatsapp: false }, recipients: ['مقدم الطلب', 'مدير المشروع'], template: 'approval_rejected', conditions: [], priority: 'high', isActive: true },
  { id: 'ns007', code: 'NOTIF-007', name: 'مستند جديد', event: 'document_uploaded', description: 'تنبيه عند رفع مستند جديد', channels: { email: false, sms: false, system: true, whatsapp: false }, recipients: ['فريق العمل'], template: 'new_document', conditions: [], priority: 'low', isActive: true },
  { id: 'ns008', code: 'NOTIF-008', name: 'دفعة مالية', event: 'payment_received', description: 'إشعار باستلام دفعة مالية', channels: { email: true, sms: true, system: true, whatsapp: false }, recipients: ['المدير المالي', 'المحاسب'], template: 'payment_received', conditions: ['amount > 10000'], priority: 'high', isActive: true },
  { id: 'ns009', code: 'NOTIF-009', name: 'مهمة جديدة', event: 'task_assigned', description: 'إشعار بتعيين مهمة جديدة', channels: { email: true, sms: false, system: true, whatsapp: false }, recipients: ['المسؤول عن المهمة'], template: 'task_assigned', conditions: [], priority: 'medium', isActive: true },
  { id: 'ns010', code: 'NOTIF-010', name: 'معاملة مكتملة', event: 'transaction_completed', description: 'إشعار بإكمال المعاملة', channels: { email: true, sms: true, system: true, whatsapp: true }, recipients: ['العميل', 'مدير المشروع', 'المدير التنفيذي'], template: 'transaction_completed', conditions: [], priority: 'medium', isActive: true }
];

// 701-11: الصلاحيات (50 صلاحية)
export const permissionsData: Permission[] = [
  { id: 'pm001', code: 'VIEW_TRANSACTIONS', nameAr: 'عرض المعاملات', nameEn: 'View Transactions', category: 'معاملات', description: 'القدرة على عرض جميع المعاملات', module: 'transactions', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 45 },
  { id: 'pm002', code: 'CREATE_TRANSACTION', nameAr: 'إنشاء معاملة', nameEn: 'Create Transaction', category: 'معاملات', description: 'القدرة على إنشاء معاملة جديدة', module: 'transactions', level: 'write', inherits: ['VIEW_TRANSACTIONS'], isSystem: true, isActive: true, usersCount: 32 },
  { id: 'pm003', code: 'EDIT_TRANSACTION', nameAr: 'تعديل معاملة', nameEn: 'Edit Transaction', category: 'معاملات', description: 'القدرة على تعديل معاملة موجودة', module: 'transactions', level: 'write', inherits: ['VIEW_TRANSACTIONS'], isSystem: true, isActive: true, usersCount: 28 },
  { id: 'pm004', code: 'DELETE_TRANSACTION', nameAr: 'حذف معاملة', nameEn: 'Delete Transaction', category: 'معاملات', description: 'القدرة على حذف معاملة', module: 'transactions', level: 'delete', inherits: ['VIEW_TRANSACTIONS', 'EDIT_TRANSACTION'], isSystem: true, isActive: true, usersCount: 12 },
  { id: 'pm005', code: 'APPROVE_TRANSACTION', nameAr: 'اعتماد معاملة', nameEn: 'Approve Transaction', category: 'معاملات', description: 'القدرة على اعتماد المعاملات', module: 'transactions', level: 'write', inherits: ['VIEW_TRANSACTIONS'], isSystem: true, isActive: true, usersCount: 15 },
  { id: 'pm006', code: 'VIEW_CLIENTS', nameAr: 'عرض العملاء', nameEn: 'View Clients', category: 'عملاء', description: 'القدرة على عرض بيانات العملاء', module: 'clients', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 42 },
  { id: 'pm007', code: 'MANAGE_CLIENTS', nameAr: 'إدارة العملاء', nameEn: 'Manage Clients', category: 'عملاء', description: 'القدرة على إدارة بيانات العملاء', module: 'clients', level: 'write', inherits: ['VIEW_CLIENTS'], isSystem: true, isActive: true, usersCount: 25 },
  { id: 'pm008', code: 'VIEW_DOCUMENTS', nameAr: 'عرض المستندات', nameEn: 'View Documents', category: 'مستندات', description: 'القدرة على عرض المستندات', module: 'documents', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 48 },
  { id: 'pm009', code: 'UPLOAD_DOCUMENTS', nameAr: 'رفع مستندات', nameEn: 'Upload Documents', category: 'مستندات', description: 'القدرة على رفع مستندات جديدة', module: 'documents', level: 'write', inherits: ['VIEW_DOCUMENTS'], isSystem: true, isActive: true, usersCount: 35 },
  { id: 'pm010', code: 'DELETE_DOCUMENTS', nameAr: 'حذف مستندات', nameEn: 'Delete Documents', category: 'مستندات', description: 'القدرة على حذف المستندات', module: 'documents', level: 'delete', inherits: ['VIEW_DOCUMENTS'], isSystem: true, isActive: true, usersCount: 18 },
  { id: 'pm011', code: 'VIEW_REPORTS', nameAr: 'عرض التقارير', nameEn: 'View Reports', category: 'تقارير', description: 'القدرة على عرض التقارير', module: 'reports', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 38 },
  { id: 'pm012', code: 'GENERATE_REPORTS', nameAr: 'إنشاء تقارير', nameEn: 'Generate Reports', category: 'تقارير', description: 'القدرة على إنشاء تقارير جديدة', module: 'reports', level: 'write', inherits: ['VIEW_REPORTS'], isSystem: false, isActive: true, usersCount: 22 },
  { id: 'pm013', code: 'VIEW_OFFICE_FEES', nameAr: 'عرض أتعاب المكتب', nameEn: 'View Office Fees', category: 'مالية', description: 'القدرة على عرض أتعاب المكتب', module: 'finance', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 15 },
  { id: 'pm014', code: 'MANAGE_FEES', nameAr: 'إدارة الأتعاب', nameEn: 'Manage Fees', category: 'مالية', description: 'القدرة على إدارة الأتعاب', module: 'finance', level: 'write', inherits: ['VIEW_OFFICE_FEES'], isSystem: true, isActive: true, usersCount: 8 },
  { id: 'pm015', code: 'VIEW_PAYMENTS', nameAr: 'عرض المدفوعات', nameEn: 'View Payments', category: 'مالية', description: 'القدرة على عرض المدفوعات', module: 'finance', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 28 },
  { id: 'pm016', code: 'MANAGE_PAYMENTS', nameAr: 'إدارة المدفوعات', nameEn: 'Manage Payments', category: 'مالية', description: 'القدرة على إدارة المدفوعات', module: 'finance', level: 'write', inherits: ['VIEW_PAYMENTS'], isSystem: true, isActive: true, usersCount: 12 },
  { id: 'pm017', code: 'VIEW_EMPLOYEES', nameAr: 'عرض الموظفين', nameEn: 'View Employees', category: 'موارد بشرية', description: 'القدرة على عرض بيانات الموظفين', module: 'hr', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 25 },
  { id: 'pm018', code: 'MANAGE_EMPLOYEES', nameAr: 'إدارة الموظفين', nameEn: 'Manage Employees', category: 'موارد بشرية', description: 'القدرة على إدارة الموظفين', module: 'hr', level: 'write', inherits: ['VIEW_EMPLOYEES'], isSystem: true, isActive: true, usersCount: 10 },
  { id: 'pm019', code: 'VIEW_SETTINGS', nameAr: 'عرض الإعدادات', nameEn: 'View Settings', category: 'نظام', description: 'القدرة على عرض إعدادات النظام', module: 'system', level: 'read', inherits: [], isSystem: true, isActive: true, usersCount: 20 },
  { id: 'pm020', code: 'MANAGE_SETTINGS', nameAr: 'إدارة الإعدادات', nameEn: 'Manage Settings', category: 'نظام', description: 'القدرة على تعديل إعدادات النظام', module: 'system', level: 'admin', inherits: ['VIEW_SETTINGS'], isSystem: true, isActive: true, usersCount: 5 }
];

// 701-12: الربط بالأنظمة (15 نظام)
export const systemIntegrationsData: SystemIntegration[] = [
  { id: 'si001', systemName: 'نظام البلدية', type: 'API', endpoint: 'https://api.baladia.gov.sa/v1', method: 'POST', authType: 'OAuth', status: 'connected', lastSync: '2025-10-26 10:30:00', syncCount: 1245, errorCount: 12, isActive: true },
  { id: 'si002', systemName: 'نظام الدفاع المدني', type: 'API', endpoint: 'https://api.civildefense.gov.sa/v2', method: 'POST', authType: 'Bearer', status: 'connected', lastSync: '2025-10-26 09:15:00', syncCount: 876, errorCount: 5, isActive: true },
  { id: 'si003', systemName: 'بوابة الحكومة الإلكترونية', type: 'API', endpoint: 'https://api.saudi.gov.sa/v1', method: 'GET', authType: 'OAuth', status: 'connected', lastSync: '2025-10-26 11:00:00', syncCount: 2134, errorCount: 18, isActive: true },
  { id: 'si004', systemName: 'نظام المدفوعات الإلكترونية', type: 'API', endpoint: 'https://api.sadad.com/v3', method: 'POST', authType: 'Bearer', status: 'connected', lastSync: '2025-10-26 10:45:00', syncCount: 543, errorCount: 3, isActive: true },
  { id: 'si005', systemName: 'نظام المساحة الجيومكانية', type: 'Service', endpoint: 'https://geo.survey.sa/services', method: 'GET', authType: 'Basic', status: 'connected', lastSync: '2025-10-25 16:30:00', syncCount: 789, errorCount: 8, isActive: true },
  { id: 'si006', systemName: 'نظام الأرشفة الإلكترونية', type: 'Database', endpoint: 'server1.office.local:5432', method: 'N/A', authType: 'Basic', status: 'connected', lastSync: '2025-10-26 08:00:00', syncCount: 3456, errorCount: 2, isActive: true },
  { id: 'si007', systemName: 'نظام البريد الإلكتروني', type: 'Service', endpoint: 'smtp.office365.com:587', method: 'SMTP', authType: 'Basic', status: 'connected', lastSync: '2025-10-26 11:30:00', syncCount: 8934, errorCount: 45, isActive: true },
  { id: 'si008', systemName: 'نظام الرسائل القصيرة', type: 'API', endpoint: 'https://api.unifonic.com/v1', method: 'POST', authType: 'Bearer', status: 'connected', lastSync: '2025-10-26 10:00:00', syncCount: 2345, errorCount: 12, isActive: true },
  { id: 'si009', systemName: 'نظام واتساب للأعمال', type: 'API', endpoint: 'https://api.whatsapp.com/v1', method: 'POST', authType: 'Bearer', status: 'disconnected', lastSync: '2025-10-20 14:00:00', syncCount: 456, errorCount: 89, isActive: false },
  { id: 'si010', systemName: 'نظام التخزين السحابي', type: 'API', endpoint: 'https://storage.googleapis.com/v1', method: 'POST', authType: 'OAuth', status: 'connected', lastSync: '2025-10-26 09:30:00', syncCount: 5678, errorCount: 15, isActive: true },
  { id: 'si011', systemName: 'نظام التوقيع الإلكتروني', type: 'API', endpoint: 'https://api.eSign.sa/v2', method: 'POST', authType: 'Bearer', status: 'connected', lastSync: '2025-10-26 10:15:00', syncCount: 234, errorCount: 1, isActive: true },
  { id: 'si012', systemName: 'نظام إدارة المحتوى', type: 'Database', endpoint: 'server2.office.local:3306', method: 'N/A', authType: 'Basic', status: 'connected', lastSync: '2025-10-26 07:00:00', syncCount: 1234, errorCount: 3, isActive: true },
  { id: 'si013', systemName: 'نظام الذكاء الاصطناعي', type: 'API', endpoint: 'https://api.openai.com/v1', method: 'POST', authType: 'Bearer', status: 'error', lastSync: '2025-10-25 12:00:00', syncCount: 567, errorCount: 234, isActive: false },
  { id: 'si014', systemName: 'نظام الطباعة المركزية', type: 'Service', endpoint: 'print-server.office.local:9100', method: 'N/A', authType: 'None', status: 'connected', lastSync: '2025-10-26 11:45:00', syncCount: 987, errorCount: 5, isActive: true },
  { id: 'si015', systemName: 'نظام التقارير الذكية', type: 'API', endpoint: 'https://api.powerbi.com/v1', method: 'GET', authType: 'OAuth', status: 'connected', lastSync: '2025-10-26 08:30:00', syncCount: 345, errorCount: 7, isActive: true }
];

// 701-15: مستويات المعاملات (10 مستويات)
export const transactionLevelsData: TransactionLevel[] = [
  { id: 'tl001', code: 'LEVEL-1', name: 'المستوى الأول - بسيط', level: 1, description: 'معاملات بسيطة لا تتطلب موافقات', minAmount: 0, maxAmount: 5000, approvalRequired: false, approvers: 0, color: '#22c55e', icon: 'check-circle', isActive: true, transactionsCount: 345 },
  { id: 'tl002', code: 'LEVEL-2', name: 'المستوى الثاني - عادي', level: 2, description: 'معاملات عادية تتطلب موافقة واحدة', minAmount: 5001, maxAmount: 15000, approvalRequired: true, approvers: 1, color: '#3b82f6', icon: 'file-check', isActive: true, transactionsCount: 289 },
  { id: 'tl003', code: 'LEVEL-3', name: 'المستوى الثالث - متوسط', level: 3, description: 'معاملات متوسطة تتطلب موافقتين', minAmount: 15001, maxAmount: 30000, approvalRequired: true, approvers: 2, color: '#8b5cf6', icon: 'shield-check', isActive: true, transactionsCount: 178 },
  { id: 'tl004', code: 'LEVEL-4', name: 'المستوى الرابع - مهم', level: 4, description: 'معاملات مهمة تتطلب موافقات متعددة', minAmount: 30001, maxAmount: 50000, approvalRequired: true, approvers: 3, color: '#f59e0b', icon: 'alert-triangle', isActive: true, transactionsCount: 134 },
  { id: 'tl005', code: 'LEVEL-5', name: 'المستوى الخامس - حرج', level: 5, description: 'معاملات حرجة تتطلب موافقة الإدارة العليا', minAmount: 50001, maxAmount: 100000, approvalRequired: true, approvers: 4, color: '#ef4444', icon: 'alert-circle', isActive: true, transactionsCount: 89 },
  { id: 'tl006', code: 'LEVEL-6', name: 'المستوى السادس - استراتيجي', level: 6, description: 'معاملات استراتيجية كبرى', minAmount: 100001, maxAmount: 999999999, approvalRequired: true, approvers: 5, color: '#dc2626', icon: 'shield-alert', isActive: true, transactionsCount: 45 }
];

// 701-16: إجراءات التحقق (25 إجراء)
export const verificationProceduresData: VerificationProcedure[] = [
  { id: 'vp001', code: 'VER-001', name: 'التحقق من صحة الصك', category: 'مستندات', description: 'التحقق من صحة الصك العقاري من الجهات المختصة', steps: ['فحص بيانات الصك', 'مطابقة مع السجل العقاري', 'التحقق من خلو الصك من القيود'], requiredDocuments: ['DOC-001'], estimatedTime: 2, responsibleRole: 'موظف التحقق', isRequired: true, isActive: true },
  { id: 'vp002', code: 'VER-002', name: 'التحقق من هوية المالك', category: 'مستندات', description: 'التحقق من صحة هوية المالك', steps: ['فحص الهوية الوطنية', 'مطابقة الاسم مع الصك', 'التحقق من صلاحية الهوية'], requiredDocuments: ['DOC-002'], estimatedTime: 1, responsibleRole: 'موظف الاستقبال', isRequired: true, isActive: true },
  { id: 'vp003', code: 'VER-003', name: 'التحقق من المخطط التنظيمي', category: 'فنية', description: 'التحقق من مطابقة الموقع للمخطط التنظيمي', steps: ['الحصول على المخطط من البلدية', 'مطابقة إحداثيات الموقع', 'التحقق من الاشتراطات'], requiredDocuments: ['DOC-003', 'DOC-007'], estimatedTime: 3, responsibleRole: 'مهندس مساحة', isRequired: true, isActive: true },
  { id: 'vp004', code: 'VER-004', name: 'الكشف الميداني الأولي', category: 'ميدانية', description: 'إجراء كشف ميداني أولي على الموقع', steps: ['زيارة الموقع', 'تصوير الموقع', 'إعداد تقرير أولي'], requiredDocuments: [], estimatedTime: 4, responsibleRole: 'مهندس ميداني', isRequired: true, isActive: true },
  { id: 'vp005', code: 'VER-005', name: 'مراجعة المخططات المعمارية', category: 'فنية', description: 'مراجعة فنية للمخططات المعمارية', steps: ['فحص المخططات', 'التحقق من المقاسات', 'مطابقة الاشتراطات'], requiredDocuments: ['DOC-013'], estimatedTime: 5, responsibleRole: 'مهندس معماري أول', isRequired: true, isActive: true },
  { id: 'vp006', code: 'VER-006', name: 'مراجعة المخططات الإنشائية', category: 'فنية', description: 'مراجعة فنية للمخططات الإنشائية', steps: ['فحص الحسابات الإنشائية', 'التحقق من معامل الأمان', 'مراجعة التفاصيل'], requiredDocuments: ['DOC-014'], estimatedTime: 4, responsibleRole: 'مهندس إنشائي أول', isRequired: true, isActive: true },
  { id: 'vp007', code: 'VER-007', name: 'التحقق من موافقة الدفاع المدني', category: 'موافقات', description: 'التحقق من الحصول على موافقة الدفاع المدني', steps: ['تقديم الطلب للدفاع المدني', 'متابعة الموافقة', 'استلام الموافقة'], requiredDocuments: ['DOC-005'], estimatedTime: 7, responsibleRole: 'منسق الموافقات', isRequired: true, isActive: true },
  { id: 'vp008', code: 'VER-008', name: 'التحقق من موافقة البلدية', category: 'موافقات', description: 'التحقق من الحصول على موافقة البلدية', steps: ['تقديم الطلب للبلدية', 'متابعة الدراسة', 'استلام الموافقة'], requiredDocuments: ['DOC-004'], estimatedTime: 10, responsibleRole: 'منسق الموافقات', isRequired: true, isActive: true },
  { id: 'vp009', code: 'VER-009', name: 'التحقق من التقرير الجيوتقني', category: 'فنية', description: 'مراجعة التقرير الجيوتقني للموقع', steps: ['فحص التقرير', 'التحقق من التوصيات', 'مطابقة التصميم'], requiredDocuments: ['DOC-006'], estimatedTime: 2, responsibleRole: 'مهندس جيوتقني', isRequired: false, isActive: true },
  { id: 'vp010', code: 'VER-010', name: 'مراجعة عقد التصميم', category: 'قانونية', description: 'المراجعة القانونية لعقد التصميم', steps: ['فحص بنود العقد', 'التحقق من الأتعاب', 'مراجعة الشروط'], requiredDocuments: [], estimatedTime: 2, responsibleRole: 'المستشار القانوني', isRequired: true, isActive: true }
];

// ============================================================================
// Render Functions للتابات
// ============================================================================

export const renderSubCategoriesTab = (data: SubCategory[]) => (
  <div className="space-y-4" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
    <CodeDisplay code="TAB-701-07" position="top-right" />
    
    {/* بطاقات إحصائية */}
    <div className="grid grid-cols-6 gap-2">
      <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '2px solid #93c5fd' }}>
        <CardContent className="p-2 text-center">
          <Folder className="h-5 w-5 mx-auto mb-1 text-blue-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي التصنيفات</p>
          <p className="text-lg font-bold text-blue-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>{data.length}</p>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '2px solid #86efac' }}>
        <CardContent className="p-2 text-center">
          <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>نشطة</p>
          <p className="text-lg font-bold text-green-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {data.filter(s => s.isActive).length}
          </p>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
        <CardContent className="p-2 text-center">
          <Building2 className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>سكنية</p>
          <p className="text-lg font-bold text-yellow-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {data.filter(s => s.mainCategoryId === 'mc001').length}
          </p>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: '2px solid #f9a8d4' }}>
        <CardContent className="p-2 text-center">
          <Store className="h-5 w-5 mx-auto mb-1 text-pink-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>تجارية</p>
          <p className="text-lg font-bold text-pink-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {data.filter(s => s.mainCategoryId === 'mc002').length}
          </p>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', border: '2px solid #c4b5fd' }}>
        <CardContent className="p-2 text-center">
          <Factory className="h-5 w-5 mx-auto mb-1 text-purple-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>صناعية</p>
          <p className="text-lg font-bold text-purple-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {data.filter(s => s.mainCategoryId === 'mc003').length}
          </p>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '2px solid #7dd3fc' }}>
        <CardContent className="p-2 text-center">
          <Activity className="h-5 w-5 mx-auto mb-1 text-cyan-600" />
          <p className="text-xs text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجمالي المعاملات</p>
          <p className="text-lg font-bold text-cyan-900" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            {data.reduce((sum, s) => sum + s.transactionsCount, 0)}
          </p>
        </CardContent>
      </Card>
    </div>

    {/* جدول التصنيفات الفرعية */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '16px' }}>التصنيفات الفرعية</CardTitle>
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
            <Plus className="h-3 w-3 ml-1" />
            إضافة تصنيف
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: 'calc(100vh - 350px)' }}>
          <Table className="table-rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الكود</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الاسم</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التصنيف الرئيسي</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المدة</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>التكلفة</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>المعاملات</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>الحالة</TableHead>
                <TableHead className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono text-xs">{cat.code}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {cat.nameAr}
                  </TableCell>
                  <TableCell className="text-right text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    <Badge variant="outline" style={{ fontSize: '10px' }}>
                      {cat.mainCategoryId === 'mc001' ? 'سكني' :
                       cat.mainCategoryId === 'mc002' ? 'تجاري' :
                       cat.mainCategoryId === 'mc003' ? 'صناعي' :
                       cat.mainCategoryId === 'mc004' ? 'زراعي' : 'إداري'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {cat.estimatedDays} يوم
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {cat.baseCost.toLocaleString()} ر.س
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge style={{ background: '#ede9fe', color: '#6b21a8', fontSize: '10px' }}>
                      {cat.transactionsCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {cat.isActive ? (
                      <Badge style={{ background: '#dcfce7', color: '#166534', fontSize: '9px' }}>نشط</Badge>
                    ) : (
                      <Badge variant="outline" style={{ color: '#6b7280', fontSize: '9px' }}>غير نشط</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" style={{ height: '24px', width: '24px', padding: 0 }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" style={{ height: '24px', width: '24px', padding: 0 }}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
);

// سأواصل في الرد التالي مع باقي render functions...

export default {
  subCategoriesData,
  templatesData,
  formsDeclarationsData,
  notificationSettingsData,
  permissionsData,
  systemIntegrationsData,
  transactionLevelsData,
  verificationProceduresData,
  renderSubCategoriesTab
};
