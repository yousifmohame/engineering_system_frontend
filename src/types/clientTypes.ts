// src/types/clientTypes.ts
// هذا الملف يحتوي على جميع الأنواع المتعلقة بالعملاء
// وهو يعكس 100% بنية schema.prisma الموسعة

import type { 
  Client as PrismaClient, 
  Transaction as PrismaTransaction, 
  Contract as PrismaContract, 
  Quotation as PrismaQuotation, 
  Attachment as PrismaAttachment,
  Payment as PrismaPayment,
  ActivityLog as PrismaActivityLog,
  ClientClassification as PrismaClientClassification,
  Employee as PrismaEmployee
} from '@prisma/client'; // افترض أنك قمت بتشغيل 'npx prisma generate'

// ============================================================================
// 1. واجهات الكائنات المخزنة كـ JSON
// ============================================================================

export interface ClientName {
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  familyName: string;
}

export interface ClientContact {
  mobile: string;
  phone?: string;
  email: string;
  fax?: string;
  whatsapp?: string;
  telegram?: string;
}

export interface ClientAddress {
  country: string;
  city: string;
  district: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
  additionalNumber?: string;
  unitNumber?: string;
  fullAddress?: string;
}

export interface ClientIdentification {
  idType: 'هوية وطنية' | 'إقامة' | 'جواز سفر' | 'سجل تجاري';
  idNumber: string;
  issueDate: string;
  expiryDate: string;
  issuePlace: string;
}

// ============================================================================
// 2. واجهات الإعدادات (من نموذج SystemSettings)
// ============================================================================

export type ClientGrade = 'أ' | 'ب' | 'ج';

export interface GradingCriteria {
  totalFeesWeight: number;
  projectTypesWeight: number;
  transactionTypesWeight: number;
  completionRateWeight: number;
  secretRatingWeight: number;
}

export interface GradeThresholds {
  gradeA: { min: number; max: number };
  gradeB: { min: number; max: number };
  gradeC: { min: number; max: number };
}

// واجهة لـ API الإعدادات
export interface SystemSettings {
  gradingCriteria: GradingCriteria;
  gradeThresholds: GradeThresholds;
}


// ============================================================================
// 3. أنواع النماذج (Models) كما تأتي من الـ API
// (نفترض أن الـ API يقوم بتضمين 'include' للعلاقات)
// ============================================================================

export type Payment = PrismaPayment;
export type ClientClassification = PrismaClientClassification;

// سجل النشاط مع اسم الموظف
export type ActivityLog = PrismaActivityLog & {
  performedBy: Pick<PrismaEmployee, 'id' | 'name'>;
};

// المعاملة مع مدفوعاتها
export type TransactionWithPayments = PrismaTransaction & {
  payments: Payment[];
};

// ============================================================================
// 4. النوع الرئيسي للعميل (Client)
// ============================================================================

/**
 * هذا هو النوع الكامل للعميل الذي يجب أن يرجعه الـ API
 * (getAllClients, getClientById, updateClient, createClient)
 * وهو يعكس schema.prisma ويحدد أنواع حقول JSON والعلاقات المضمنة.
 */
export type Client = Omit<PrismaClient, 'name' | 'contact' | 'address' | 'identification'> & {
  // حقول JSON محددة النوع
  name: ClientName;
  contact: ClientContact;
  address: ClientAddress;
  identification: ClientIdentification;
  
  // العلاقات المضمنة (Included Relations)
  transactions: TransactionWithPayments[];
  contracts: PrismaContract[];
  quotations: PrismaQuotation[];
  attachments: PrismaAttachment[];
  activityLogs: ActivityLog[];
};

