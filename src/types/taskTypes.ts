/**
 * src/types/taskTypes.ts
 * * هذا الملف يحتوي على جميع تعريفات الأنواع (Typescript)
 * المتعلقة بـ "المهام" (Tasks) في النظام.
 */

// واجهة قياسية لاستخدامها في القوائم المنسدلة (Select)
export interface SelectOption {
  value: string;
  label: string;
}

// تعريف الحالات المحتملة للمهمة
export type TaskStatus = 
  | 'unassigned'      // (مُسندة ولكن لم تُستلم)
  | 'processing'      // (قيد المعالجة)
  | 'completed'       // (مكتملة)
  | 'cancelled'       // (ملغاة)
  | 'overdue'         // (متأخرة)
  | 'pending'         // (معلقة)
  | 'not-received'    // (مرادف لـ unassigned)
  | 'in-progress';    // (مرادف لـ processing)

// تعريف أولويات المهمة
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// تعريف كائن الأتعاب (المخزن كـ JSON في قاعدة البيانات)
export interface TaskFees {
  total: number;
  paid: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentPercentage: number;
}

/**
 * الواجهة الأساسية للمهمة (Task)
 * تطابق (model Task) في (prisma/schema.prisma)
 * مع إضافة الحقول المضمنة (populated) من الخادم
 */
export interface Task {
  id: string;
  taskNumber: string; // (أصبح اختيارياً في القاعدة، لكن المنطق يتطلبه)
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null; // (يأتي كـ ISO string من الـ JSON)
  
  // --- الحقول المضافة في آخر migration ---
  priority?: TaskPriority | null;
  progress?: number | null;
  category?: string | null;
  assignedById?: string | null;
  receivedDate?: string | null;
  completedDate?: string | null;
  attachmentsCount?: number | null;
  commentsCount?: number | null;
  fees?: TaskFees | null; // (يستخدم الواجهة أعلاه)
  // ------------------------------------

  createdAt: string; // (يأتي كـ ISO string)
  transactionId: string;
  assignedToId?: string | null;

  // --- الحقول المضمنة (Populated) ---
  // هذه الحقول لا توجد مباشرة في جدول Task
  // بل يتم جلبها من علاقات (relations) في الـ controller
  
  // (يأتي من العلاقة مع Transaction)
  transactionNumber?: string; 
  
  // (يأتي من العلاقة مع Employee)
  assignedBy?: string; 
}

/**
 * البيانات المطلوبة لإنشاء مهمة جديدة
 */
export type NewTaskData = {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
  progress?: number;
  category?: string;
  fees?: TaskFees;
  transactionId: string;  // (مطلوب لربط المهمة)
  assignedToId?: string; // (لمن ستُسند المهمة)
};

/**
 * البيانات التي يمكن تحديثها في مهمة
 */
export type TaskUpdateData = Partial<NewTaskData>;