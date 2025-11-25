// src/types/followUpTypes.ts

export type AgentType = 'individual' | 'entity';
export type AgentStatus = 'active' | 'inactive' | 'suspended';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type SuccessStatus = 'success' | 'failed' | 'pending';

export interface FollowUpAgent {
  id: string;
  type: AgentType;
  name: string;
  nationalId?: string;        // للأفراد
  commercialRegister?: string; // للكيانات
  
  // بيانات الاتصال
  phone: string;
  email?: string;
  address?: string;

  // التخصصات
  specialization: string[];
  governmentEntities: string[];

  // الأداء (محسوبة من الباك إند)
  joinDate: string;
  status: AgentStatus;
  rating: number;
  notes?: string;

  // إحصائيات (تأتي من الباك إند)
  totalTasks?: number;
  successfulTasks?: number;
  failedTasks?: number;
  activeTransactions?: number;
  completedTransactions?: number;
  totalTransactions?: number;
  successRate?: number;
  averageCompletionTime?: number;
}

export interface FollowUpTask {
  id: string;
  agentId: string;
  agentName?: string; // للعرض
  
  transactionId: string;
  transactionTitle?: string; // للعرض
  
  governmentEntity: string;
  description: string; // taskDescription في التصميم القديم
  
  startDate: string;
  targetDate?: string;
  completionDate?: string;
  
  status: TaskStatus;
  successStatus: SuccessStatus;
  attempts: number;
  
  notes?: string;
  feedbacks: string[];
}

// واجهات البيانات المرسلة (Payloads) للإنشاء والتحديث
export interface CreateAgentPayload {
  type: AgentType;
  name: string;
  nationalId?: string;
  commercialRegister?: string;
  phone: string;
  email?: string;
  address?: string;
  specialization?: string[];
  governmentEntities?: string[];
  notes?: string;
}

export interface CreateTaskPayload {
  agentId: string;
  transactionId: string;
  governmentEntity: string;
  description: string;
  startDate: Date;
  targetDate?: Date;
  notes?: string;
}

export interface UpdateTaskStatusPayload {
  status?: TaskStatus;
  successStatus?: SuccessStatus;
  feedback?: string;     // لإضافة ملاحظة جديدة
  addAttempt?: boolean;  // لزيادة العداد
}