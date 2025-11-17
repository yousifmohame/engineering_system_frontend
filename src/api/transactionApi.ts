import { api } from './axiosConfig'; // [cite: yousifmohame/engineering_system_frontend/engineering_system_frontend-56bd58b8f79ad81e27761f75c12a8cb186450dfa/src/api/axiosConfig.js]
import { 
  Transaction, 
  NewTransactionData,
  TransactionType,
  SelectOption,
  TransactionUpdateData,
  // (استيراد الأنواع الفرعية)
  TransactionTask,
  TransactionFee,
  TransactionStage
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
    
    // --- ✅ 1. (تم حذف التحويل .map من هنا) ---
    return data; // (إرجاع البيانات الخام كما هي: [{ id, name }])

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
    // --- ✅ 3. استدعاء المسار "الكامل" الجديد ---
    const { data } = await api.get('/transactions/types/full');
    return data; // (إرجاع البيانات الكاملة كما هي)
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
    // يستدعي المسار الصحيح في الخادم
    // (PUT /api/transactions/:id)
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    // أعد إرسال الخطأ ليتم التقاطه بواسطة useMutation
    throw error;
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