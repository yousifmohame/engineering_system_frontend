import { api } from './axiosConfig';
import { 
  Transaction, 
  NewTransactionData,
  TransactionType,
  SelectOption,
  TransactionUpdateData,
  TransactionTask,
  TransactionFee,
  TransactionStage,
  CostCategory,
} from '../types/transactionTypes';

/**
 * ============================================================================
 * 1. إنشاء معاملة جديدة (مسودة) (لشاشة 286)
 * POST /api/transactions
 * ============================================================================
 */
export const createTransaction = async (formData: NewTransactionData): Promise<Transaction> => {
  try {
    const { data } = await api.post('/transactions', formData);
    return data;
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    throw new Error(error.response?.data?.message || 'فشل في إنشاء المعاملة');
  }
};

/**
 * ============================================================================
 * 2. جلب أنواع المعاملات (لقائمة الاختيار - شاشة 286)
 * GET /api/transactions/types
 * ============================================================================
 */
type ApiSimpleOption = {
  id: string;
  name: string;
};

export const getTransactionTypes = async (): Promise<ApiSimpleOption[]> => {
  try {
    const { data } = await api.get('/transactions/types/simple');
    return data;
  } catch (error: any) {
    console.error('Error fetching transaction types:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب أنواع المعاملات');
  }
};

// ============================================================================
// 3. (مُعدل) جلب أنواع المعاملات (للإدارة - شاشة 701)
// ============================================================================
export const getFullTransactionTypes = async (): Promise<TransactionType[]> => {
  try {
    const { data } = await api.get('/transactions/types/full');
    return data;
  } catch (error: any) {
    console.error('Error fetching full transaction types:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب أنواع المعاملات');
  }
};

/**
 * ============================================================================
 * 4. (جديد) إنشاء نوع معاملة جديد (لشاشة 701)
 * POST /api/transactions/types
 * ============================================================================
 */
type TransactionTypeCreateData = Omit<TransactionType, 'id' | 'code'>;

export const createTransactionType = async (typeData: TransactionTypeCreateData): Promise<TransactionType> => {
  try {
    const { data } = await api.post('/transactions/types', typeData);
    return data;
  } catch (error: any) {
    console.error('Error creating transaction type:', error);
    throw new Error(error.response?.data?.message || 'فشل في إنشاء نوع المعاملة');
  }
};

/**
 * ============================================================================
 * 5. (جديد) تعديل نوع معاملة (لشاشة 701)
 * PUT /api/transactions/types/:id
 * ============================================================================
 */
type TransactionTypeUpdateData = Omit<TransactionType, 'id' | 'code'>;

export const updateTransactionType = async (id: string, typeData: Partial<TransactionTypeUpdateData>): Promise<TransactionType> => {
  try {
    const { data } = await api.put(`/transactions/types/${id}`, typeData);
    return data;
  } catch (error: any) {
    console.error('Error updating transaction type:', error);
    throw new Error(error.response?.data?.message || 'فشل في تعديل نوع المعاملة');
  }
};

export const updateTransaction = async (
  id: string, 
  data: Partial<TransactionUpdateData>
): Promise<Transaction> => {
  try {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

/**
 * ============================================================================
 * 7. جلب جميع المعاملات (لشاشة 285 أو القوائم)
 * GET /api/transactions
 * ============================================================================
 */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data } = await api.get('/transactions');
    return data;
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب قائمة المعاملات');
  }
};

/**
 * ============================================================================
 * 8. حذف معاملة
 * DELETE /api/transactions/:id
 * ============================================================================
 */
export const deleteTransaction = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    throw new Error(error.response?.data?.message || 'فشل في حذف المعاملة');
  }
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
  try {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    throw error;
  }
};

export const updateTransactionCosts = async (id: string, costDetails: CostCategory[]) => {
  const { data } = await api.put(`/transactions/${id}`, { costDetails });
  return data;
};

export const getTransactionTemplateFees = async (typeId: string): Promise<CostCategory[]> => {
  try {
    const { data } = await api.get(`/transactions/template-fees/${typeId}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching template fees:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب رسوم القالب');
  }
};

export const updateTransactionTasks = async (id: string, tasks: any[]) => {
  const { data } = await api.put(`/transactions/${id}/tasks`, { tasks });
  return data;
};

export const updateTransactionStaff = async (id: string, staff: { employeeId: string; role: string }[]) => {
  const response = await api.put(`/transactions/${id}/staff`, { staff });
  return response.data;
};

export const updateTransactionFloors = async (id: string, floors: any[]) => {
  const response = await api.put(`/transactions/${id}`, { floors });
  return response.data;
};

export const updateTransactionSetbacks = async (id: string, setbacks: any[]) => {
  const response = await api.put(`/transactions/${id}`, { setbacks });
  return response.data;
};

export const updateTransactionComponents = async (id: string, components: any[]) => {
  const response = await api.put(`/transactions/${id}`, { components });
  return response.data;
};

export const updateTransactionGenericComponents = async (
  id: string, 
  type: 'old-license' | 'proposed' | 'existing', 
  data: any[]
) => {
  const fieldMap = {
    'old-license': 'componentsOldLicense',
    'proposed': 'componentsProposed',
    'existing': 'componentsExisting'
  };
  const fieldName = fieldMap[type];
  const response = await api.put(`/transactions/${id}`, { [fieldName]: data });
  return response.data;
};

export const updateTransactionBoundaries = async (id: string, boundaries: any[]) => {
  const response = await api.put(`/transactions/${id}`, { boundaries });
  return response.data;
};

export const updateTransactionLandArea = async (id: string, landArea: any) => {
  const response = await api.put(`/transactions/${id}`, { landArea });
  return response.data;
};

/**
 * ============================================================================
 * 6. (جديد) حذف نوع معاملة (لشاشة 701)
 * DELETE /api/transactions/types/:id
 * ============================================================================
 */
export const deleteTransactionType = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete(`/transactions/types/${id}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting transaction type:', error);
    throw new Error(error.response?.data?.message || 'فشل في حذف نوع المعاملة');
  }
};

// ✅✅✅ هذا هو الجزء الناقص: تجميع كل الدوال وتصديرها ككائن واحد
export const transactionApi = {
  createTransaction,
  getTransactionTypes,
  getFullTransactionTypes,
  createTransactionType,
  updateTransactionType,
  updateTransaction,
  getAllTransactions,
  deleteTransaction,
  getTransactionById,
  updateTransactionCosts,
  getTransactionTemplateFees,
  updateTransactionTasks,
  updateTransactionStaff,
  updateTransactionFloors,
  updateTransactionSetbacks,
  updateTransactionComponents,
  updateTransactionGenericComponents,
  updateTransactionBoundaries,
  updateTransactionLandArea,
  deleteTransactionType
};