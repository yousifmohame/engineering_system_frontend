import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Bell, 
  X, 
  Trash2, 
  Check, 
  Clock, 
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Archive,
  Star,
  StarOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'transaction' | 'task' | 'urgent';
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon?: React.ReactNode;
  actionUrl?: string;
  metadata?: {
    transactionId?: string;
    userId?: string;
    projectId?: string;
  };
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  unreadCount: number;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  unreadCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system' | 'transaction' | 'task' | 'urgent'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // تصفية الإشعارات
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // الحصول على أيقونة نوع الإشعار
  const getNotificationIcon = (type: string, priority: string) => {
    const baseClasses = "h-4 w-4";
    
    switch (type) {
      case 'system':
        return <Settings className={`${baseClasses} text-blue-600`} />;
      case 'transaction':
        return <MessageSquare className={`${baseClasses} text-green-600`} />;
      case 'task':
        return <CheckCircle className={`${baseClasses} text-orange-600`} />;
      case 'urgent':
        return <AlertCircle className={`${baseClasses} text-red-600`} />;
      default:
        return <Bell className={`${baseClasses} text-gray-600`} />;
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // تنسيق التاريخ
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // تبديل تحديد الإشعار
  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  // تحديد جميع الإشعارات
  const selectAllNotifications = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  // إلغاء تحديد جميع الإشعارات
  const deselectAllNotifications = () => {
    setSelectedNotifications([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal "NotificationsModal": Frame width:400px height:600px padding:16px background:#FFFFFF cornerRadius:8px */}
      <DialogContent 
        className="dialog-rtl overflow-hidden"
        style={{
          width: '400px',        // width:400px حسب المواصفات
          height: '600px',       // height:600px حسب المواصفات
          maxWidth: '400px',
          maxHeight: '600px',
          padding: '16px',       // padding:16px حسب المواصفات
          backgroundColor: '#FFFFFF', // background:#FFFFFF
          borderRadius: '8px'    // cornerRadius:8px
        }}
      >
        {/* Header: Text "الإشعارات" font:Inter SemiBold size:16, Button "مسح الكل" */}
        <DialogHeader className="dialog-header border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <DialogTitle 
                  className="dialog-title"
                  style={{
                    fontFamily: 'Tajawal, sans-serif', // استخدام Tajawal بدلاً من Inter
                    fontWeight: '600', // SemiBold
                    fontSize: '16px'   // size:16
                  }}
                >
                  الإشعارات
                </DialogTitle>
                <DialogDescription className="dialog-description text-sm">
                  إدارة وعرض جميع الإشعارات النشطة في النظام
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {unreadCount} جديد
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-xs"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <Trash2 className="h-3 w-3" />
                مسح الكل
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 overflow-hidden">
          {/* أدوات التحكم العلوية */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* البحث والفلترة */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الإشعارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg text-sm input-field"
                  style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm input-field min-w-[120px]"
                style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
              >
                <option value="all">جميع الأنواع</option>
                <option value="system">إشعارات النظام</option>
                <option value="transaction">إشعارات المعاملات</option>
                <option value="task">إشعارات المهام</option>
                <option value="urgent">التنبيهات العاجلة</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm input-field min-w-[120px]"
                style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}
              >
                <option value="all">جميع الحالات</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
                <option value="archived">مؤرشفة</option>
              </select>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center gap-2">
              {selectedNotifications.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={deselectAllNotifications}>
                    إلغاء التحديد ({selectedNotifications.length})
                  </Button>
                  <Button variant="outline" size="sm" 
                    onClick={() => selectedNotifications.forEach(onMarkAsRead)}>
                    <Check className="h-4 w-4" />
                    تحديد كمقروء
                  </Button>
                </>
              )}
              
              <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                <Check className="h-4 w-4" />
                تحديد الكل كمقروء
              </Button>
              
              <Button variant="outline" size="sm" onClick={onClearAll} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
                مسح الكل
              </Button>
            </div>
          </div>

          {/* Scrollable List: For each notification {icon, title, timestamp, status} حسب المواصفات */}
          <div 
            className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50"
            style={{
              maxHeight: 'calc(600px - 200px)', // تقليل الارتفاع ليتناسب مع المواصفات
              overflowY: 'auto'
            }}
          >
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لا توجد إشعارات
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'لا توجد إشعارات تطابق المعايير المحددة'
                    : 'لا توجد إشعارات في الوقت الحالي'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {/* For each notification {icon, title, timestamp, status} */}
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 transition-colors duration-200 cursor-pointer hover:bg-white/80 ${
                      notification.status === 'unread' ? 'bg-blue-50/50' : 'bg-white'
                    } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => toggleSelectNotification(notification.id)}
                    style={{ padding: '12px' }} // تقليل padding ليتناسب مع المساحة المحدودة
                  >
                    <div className="flex items-start gap-2"> {/* تقليل gap */}
                      {/* icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>

                      {/* title, timestamp, status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          {/* title */}
                          <h4 
                            className={`text-sm font-medium truncate ${
                              notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                            }`}
                            style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '13px' }}
                          >
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-0.5 ${getPriorityColor(notification.priority)}`}
                              style={{ fontSize: '10px' }}
                            >
                              {notification.priority === 'urgent' ? 'عاجل' :
                               notification.priority === 'high' ? 'مرتفع' :
                               notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                          </div>
                        </div>

                        <p 
                          className="text-sm text-gray-600 mb-2 line-clamp-1" // تقليل عدد الأسطر
                          style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* timestamp */}
                          <span 
                            className="text-xs text-gray-500"
                            style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '11px' }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-1">
                            {/* status */}
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title={notification.status === 'unread' ? 'تحديد كمقروء' : 'مقروء'}
                            >
                              <Eye className="h-3 w-3" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="حذف الإشعار"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Button "إغلاق" */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <span>المجموع: {notifications.length}</span>
              <span>غير مقروءة: {notifications.filter(n => n.status === 'unread').length}</span>
              <span>مقروءة: {notifications.filter(n => n.status === 'read').length}</span>
            </div>

            {/* Footer: Button "إغلاق" حسب المواصفات */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;