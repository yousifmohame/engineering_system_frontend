// --- 1. (جديد) نسخ الأنواع الفرعية من ملفك التجريبي ---
export interface TransactionTask {
  id: string;
  name: string;
  duration: number;
  role: string;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface TransactionFee {
  name: string;
  amount: number;
  authority: string;
  required: boolean;
}

export interface TransactionStage {
  id: string;
  name: string;
  duration: number;
  tasks: number;
}

// ==========================================================

/**
 * 2. (مُعدل) نوع بيانات "نوع المعاملة" (القالب)
 * (يطابق موديل TransactionType الجديد في schema.prisma)
 */
export interface TransactionType {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;

  // --- الحقول الجديدة المفصلة ---
  category?: string | null;
  categoryAr?: string | null;
  duration?: number | null;
  estimatedCost?: number | null;
  complexity?: string | null;

  tasks?: TransactionTask[] | null;       // (Json)
  documents?: string[] | null;            // (String[])
  authorities?: string[] | null;          // (String[])
  fees?: TransactionFee[] | null;         // (Json)
  stages?: TransactionStage[] | null;     // (Json)
  warnings?: string[] | null;             // (String[])
  notes?: string[] | null;                // (String[])
}

/**
 * 3. (مُعدل) نوع بيانات "المعاملة" الرئيسية (الكيان)
 * (يطابق موديل Transaction المُعدل في schema.prisma)
 */
export interface Transaction {
  id: string;
  transactionCode: string;
  title: string;

  // علاقة
  transactionTypeId?: string | null;
  transactionType?: TransactionType | null;

  // بيانات أساسية
  status: string;
  statusColor?: string | null;
  priority?: string | null;
  description?: string | null;
  location?: string | null;
  deedNumber?: string | null;
  
  // بيانات منسوخة
  category?: string | null;
  complexity?: string | null;
  duration?: number | null;
  progress?: number | null;

  // مالية
  totalFees?: number | null;
  paidAmount?: number | null;
  remainingAmount?: number | null;
  fees?: TransactionFee[] | null; // (Json)

  // بيانات موروثة
  tasks?: any[]; // (Task[]) - استخدم any مؤقتاً
  documents?: string[] | null; // (Json - لكنه مصفوفة نصوص)
  authorities?: string[] | null;
  stages?: TransactionStage[] | null; // (Json)
  warnings?: string[] | null;
  notes?: string[] | null;
  
  // علاقات
  clientId: string;
  client?: any; 
  projectId?: string | null;
  contractId?: string | null;
  
  // مرفقات وحركات
  attachments?: any[];
  payments?: any[];
  
  // تواريخ
  createdAt: string;
  updatedAt: string;
  completedDate?: string | null;
}

/**
 * 4. (مُعدل) نوع بيانات الفورم الأساسي (شاشة 286 - تبويب 1)
 * (الآن أصبح أبسط)
 */
export type NewTransactionData = {
  title: string;
  clientId: string;
  type?: string; // (اختياري، سيتم تحديثه في التبويب 2)
  priority?: string;
  description?: string;
};

/**
 * 5. (مُعدل) نوع بيانات تحديث المعاملة
 * (يحتوي على جميع الحقول القابلة للتعديل)
 */
export type TransactionUpdateData = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'client' | 'transactionType'>>;

/**
 * 6. نوع بيانات خيارات الـ Select
 */
export type SelectOption = {
  value: string;
  label: string;
};