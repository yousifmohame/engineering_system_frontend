/**
 * واجهة الموعد (Appointment)
 * تطابق (تقريباً) ما قد يكون موجوداً في الـ Backend أو ما تحتاجه الواجهة
 */
export interface Appointment {
  id: string;
  title: string; // عنوان الموعد (مثلاً: "الكشف الميداني")
  date: string; // تاريخ ووقت الموعد (ISO String)
  type: 'field_visit' | 'client_meeting' | 'technical_review' | 'delivery' | 'other';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  transactionId: string; // ربط بالمعاملة
  location?: string;
}

// البيانات المطلوبة لإنشاء موعد جديد
export type CreateAppointmentData = Omit<Appointment, 'id' | 'status'>;