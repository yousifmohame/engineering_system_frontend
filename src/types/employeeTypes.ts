/**
 * هذا الملف يحتوي على الواجهات (Interfaces) المتعلقة بالموظفين
 */

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  nameEn?: string | null;
  nationalId: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string; // أو Date
  baseSalary?: number | null;
  type: string;
  status: string;
  nationality?: string | null;
  gosiNumber?: string | null;
  iqamaNumber?: string | null;
  performanceRating?: number | null;
  frozenUntil?: string | null; // أو Date
  frozenReason?: string | null;
  jobLevel?: number | null;
  
  // حقول إضافية نحتاجها
  permissionsCount?: number; // (من الواجهة)
  
  // بيانات مرتبطة (للتوضيح)
  // attachments?: Attachment[];
  // assignedTasks?: Task[];
}



// --- ✅ الإضافة الجديدة هنا ---
/**
 * الواجهة لبيانات الموظف المسند إلى معاملة
 * هذا هو الكائن الذي سيتم حفظه في حالة الشاشة الرئيسية
 */
export interface AssignedStaff {
  assignmentId: string; // ID فريد لعملية الإسناد نفسها
  employeeId: string;
  role: string; // دور الموظف في *هذه* المعاملة
}