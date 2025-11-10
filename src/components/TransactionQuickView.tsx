import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  FileText, User, Calendar, DollarSign, Eye, ExternalLink, 
  CheckCircle, Clock, AlertCircle, ArrowRight 
} from 'lucide-react';

interface Transaction {
  id: string;
  clientName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  date: string;
  amount: string;
  type: string;
  linkedDocuments: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
  }>;
}

interface TransactionQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  onNavigateToTransaction: () => void;
  onLinkDocument?: (docId: string) => void;
  onUnlinkDocument?: (docId: string) => void;
  enableDragDrop?: boolean;
}

// بيانات تجريبية للمعاملة
const mockTransaction: Transaction = {
  id: 'TXN-2025-001234',
  clientName: 'أحمد محمد علي',
  status: 'in-progress',
  date: '2025-01-15',
  amount: '25,000 ريال',
  type: 'مشروع هندسي',
  linkedDocuments: [
    { id: 'DOC-001', name: 'تقرير فني أولي.pdf', type: 'تقرير', status: 'approved' },
    { id: 'DOC-002', name: 'مخططات أولية.dwg', type: 'مخطط', status: 'pending' },
    { id: 'DOC-003', name: 'عقد المشروع.pdf', type: 'عقد', status: 'approved' }
  ]
};

const TransactionQuickView: React.FC<TransactionQuickViewProps> = ({
  isOpen,
  onClose,
  transactionId,
  onNavigateToTransaction,
  onLinkDocument,
  onUnlinkDocument,
  enableDragDrop = true
}) => {
  
  // وظائف السحب والإفلات
  const handleDragOver = (e: React.DragEvent) => {
    if (enableDragDrop) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (enableDragDrop) {
      e.preventDefault();
      const docId = e.dataTransfer.getData('text/plain');
      if (docId && onLinkDocument) {
        onLinkDocument(docId);
      }
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'قيد الانتظار', icon: Clock },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'قيد التنفيذ', icon: AlertCircle },
      'completed': { color: 'bg-green-100 text-green-800', label: 'مكتملة', icon: CheckCircle },
      'on-hold': { color: 'bg-red-100 text-red-800', label: 'معلقة', icon: AlertCircle },
      'approved': { color: 'bg-green-100 text-green-800', label: 'معتمد', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} inline-flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dialog-rtl" dir="rtl">
        <DialogHeader className="dialog-header">
          <DialogTitle className="dialog-title flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <FileText className="h-5 w-5 text-blue-600" />
            معاملة {mockTransaction.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* معلومات المعاملة الأساسية */}
          <div className="grid grid-cols-2 gap-6">
            {/* العمود الأيسر - المعلومات الرئيسية */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  الحالة:
                </span>
                {getStatusBadge(mockTransaction.status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  العميل:
                </span>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {mockTransaction.clientName}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  التاريخ:
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {new Date(mockTransaction.date).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  المبلغ:
                </span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-bold text-green-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {mockTransaction.amount}
                  </span>
                </div>
              </div>
            </div>

            {/* العمود الأيمن - الوثائق المرتبطة */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                الوثائق المرتبطة ({mockTransaction.linkedDocuments.length})
              </h3>
              <div className="space-y-2">
                {mockTransaction.linkedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          {doc.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusBadge(doc.status)}
                      <Button variant="ghost" size="sm" className="p-1">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تقدم المعاملة
              </span>
              <span className="text-sm text-gray-600">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>بدأت</span>
              <span>قيد التنفيذ</span>
              <span>مكتملة</span>
            </div>
          </div>

          {/* المراحل الحالية */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              المراحل الحالية
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>مراجعة المستندات الأولية</span>
                <Badge className="bg-green-100 text-green-800 mr-auto">مكتمل</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>التحقق الفني والمراجعة</span>
                <Badge className="bg-blue-100 text-blue-800 mr-auto">جاري</Badge>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>الموافقة النهائية والإغلاق</span>
                <Badge className="bg-gray-100 text-gray-600 mr-auto">معلق</Badge>
              </div>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">3</div>
              <div className="text-xs text-blue-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>وثائق مرتبطة</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">15</div>
              <div className="text-xs text-green-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>يوم متبقي</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">2</div>
              <div className="text-xs text-yellow-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>تحديثات اليوم</div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            آخر تحديث: منذ ساعتين
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
            <Button onClick={onNavigateToTransaction} className="bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="h-4 w-4" />
              عرض المعاملة الكاملة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionQuickView;