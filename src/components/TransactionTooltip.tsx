import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Calendar,
  User,
  FileText,
  Clock,
  Target,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface Transaction {
  id: string;
  code: string;
  client: string;
  type: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdDate: string;
  dueDate: string;
  progress: number;
}

interface TransactionTooltipProps {
  transaction: Transaction;
  children: React.ReactNode;
}

export function TransactionTooltip({ transaction, children }: TransactionTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left - 150, // 15cm ≈ 150px (تقريباً)
      y: rect.top - 200
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          icon: <Clock className="w-4 h-4 text-yellow-600" />, 
          label: 'قيد الانتظار', 
          color: 'bg-yellow-100 text-yellow-800' 
        };
      case 'in_review':
        return { 
          icon: <AlertCircle className="w-4 h-4 text-blue-600" />, 
          label: 'قيد المراجعة', 
          color: 'bg-blue-100 text-blue-800' 
        };
      case 'approved':
        return { 
          icon: <CheckCircle className="w-4 h-4 text-green-600" />, 
          label: 'تمت الموافقة', 
          color: 'bg-green-100 text-green-800' 
        };
      case 'rejected':
        return { 
          icon: <XCircle className="w-4 h-4 text-red-600" />, 
          label: 'مرفوضة', 
          color: 'bg-red-100 text-red-800' 
        };
      case 'completed':
        return { 
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, 
          label: 'مكتملة', 
          color: 'bg-emerald-100 text-emerald-800' 
        };
      default:
        return { 
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />, 
          label: 'غير محدد', 
          color: 'bg-gray-100 text-gray-800' 
        };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { label: 'عاجل', color: 'bg-red-500 text-white' };
      case 'high':
        return { label: 'عالية', color: 'bg-orange-100 text-orange-800' };
      case 'normal':
        return { label: 'عادية', color: 'bg-blue-100 text-blue-800' };
      case 'low':
        return { label: 'منخفضة', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'غير محدد', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const calculateDaysRemaining = () => {
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const statusInfo = getStatusInfo(transaction.status);
  const priorityInfo = getPriorityInfo(transaction.priority);
  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="relative">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-[9999] pointer-events-none transaction-tooltip"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '400px', // تقريباً 15cm
            maxWidth: '400px'
          }}
        >
          <Card 
            className="card-element shadow-2xl border-2"
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <CardContent className="p-6">
              {/* العنوان والكود */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sub-title" style={{ fontFamily: 'Tajawal, sans-serif', color: '#1f2937' }}>
                    تفاصيل المعاملة
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 ml-1" />
                    معلومات سريعة
                  </Badge>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="font-code text-code text-center" style={{ fontSize: '12px', color: '#2563eb' }}>
                    {transaction.code}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* المعلومات الأساسية */}
              <div className="space-y-3">
                {/* العميل */}
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      العميل
                    </p>
                    <p className="text-small font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {transaction.client}
                    </p>
                  </div>
                </div>

                {/* نوع المعاملة */}
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      نوع المعاملة
                    </p>
                    <p className="text-small font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {transaction.type}
                    </p>
                  </div>
                </div>

                {/* الحالة والأولوية */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    {statusInfo.icon}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الحالة
                      </p>
                      <Badge className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        الأولوية
                      </p>
                      <Badge className={`text-xs ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* التواريخ */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تاريخ الإنشاء
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.createdDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        تاريخ الاستحقاق
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {transaction.dueDate}
                      </p>
                      {daysRemaining >= 0 && (
                        <p className={`text-xs ${daysRemaining <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                          ({daysRemaining} يوم متبقي)
                        </p>
                      )}
                      {daysRemaining < 0 && (
                        <p className="text-xs text-red-600">
                          (متأخر {Math.abs(daysRemaining)} يوم)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* شريط التقدم */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    نسبة الإنجاز
                  </p>
                  <p className="text-small font-medium" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2563eb' }}>
                    {transaction.progress}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${transaction.progress}%`,
                      backgroundColor: transaction.progress === 100 ? '#10b981' : 
                                     transaction.progress >= 75 ? '#3b82f6' :
                                     transaction.progress >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="mt-4 pt-3 border-t border-muted/30">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      انقر لعرض التفاصيل الكاملة
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Eye className="w-3 h-3" />
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '10px' }}>
                      استعراض
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}