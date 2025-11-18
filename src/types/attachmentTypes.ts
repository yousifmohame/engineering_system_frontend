/**
 * هذا الملف يحتوي على الواجهات (Interfaces) المتعلقة بالمرفقات
 * وهي تطابق نموذج (model) "Attachment" في schema.prisma
 */

export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string; // (التاريخ سيأتي كنص JSON)
  uploadedById: string;
  transactionId: string | null;
  
  // (اختياري) يمكنك إضافة بيانات الموظف إذا قمت بعمل 'include'
  // uploadedBy?: {
  //   name: string;
  // };
}