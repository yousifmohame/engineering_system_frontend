interface FileItem {
  id: string;
  fileNumber: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  size?: number;
  modified: string; // ستكون كتاريخ ISO String
  created: string;  // ستكون كتاريخ ISO String
  owner: string; // أصبح اسماً فقط
  classificationId: string | null;
  classification: { name: string; color: string } | null; // (الـ controller لا يرسل هذا، لكننا سنحتاجه في الواجهة)
  tags: string[];
  transactionId?: string;
  _count?: { // لإظهار عدد العناصر
    children: number;
  };
  clientName?: string;
  path: string;
  version?: string;
  isShared?: boolean;
  downloads?: number;
  views?: number;
}
interface FileActivity {
  id: string;
  activityNumber: string;
  fileId: string;
  fileName: string;
  action: 'upload' | 'download' | 'edit' | 'delete' | 'share' | 'view';
  user: string;
  timestamp: string; // ستكون كتاريخ منسق
  ipAddress?: string;
  details?: string;
}