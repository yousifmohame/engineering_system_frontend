import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CodeDisplay } from './CodeDisplay';

interface Stage {
  id: number;
  name: string;
  duration: string;
  status: 'completed' | 'current' | 'future';
}

export function ProgressHeader() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 15,
    hours: 8,
    minutes: 45
  });

  const stages: Stage[] = [
    { id: 1, name: 'إنشاء', duration: '2 يوم', status: 'completed' },
    { id: 2, name: 'تحليل', duration: '5 أيام', status: 'completed' },
    { id: 3, name: 'مراجعة', duration: '3 أيام', status: 'current' },
    { id: 4, name: 'موافقة', duration: '7 أيام', status: 'future' },
    { id: 5, name: 'تنفيذ', duration: '21 يوم', status: 'future' },
    { id: 6, name: 'متابعة', duration: 'مستمر', status: 'future' },
    { id: 7, name: 'فحص', duration: '5 أيام', status: 'future' },
    { id: 8, name: 'تسليم', duration: '3 أيام', status: 'future' },
    { id: 9, name: 'إغلاق', duration: '2 يوم', status: 'future' },
    { id: 10, name: 'أرشفة', duration: '1 يوم', status: 'future' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000); // تحديث كل دقيقة

    return () => clearInterval(timer);
  }, []);

  const getTimeColor = () => {
    const totalMinutes = timeRemaining.days * 1440 + timeRemaining.hours * 60 + timeRemaining.minutes;
    const totalEstimated = 50 * 1440; // تقدير 50 يوم كإجمالي
    const percentage = (totalMinutes / totalEstimated) * 100;
    
    if (percentage < 10) return '#ef4444'; // أحمر
    if (percentage < 25) return '#f59e0b'; // أصفر
    return '#10b981'; // أخضر
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '🟢';
      case 'current':
        return '🟡';
      case 'future':
        return '⚫';
      default:
        return '⚫';
    }
  };

  return (
    <Card className="w-full relative card-element" style={{ height: '140px' }}>
      <CodeDisplay code="PROG-BAR-TXN-001" position="bottom-right" />
      
      <div className="p-4 space-y-2">
        {/* الصف الأول - معلومات المعاملة الأساسية */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-normal" style={{ color: '#1f2937', fontFamily: 'Tajawal, sans-serif' }}>
            <span>معاملة رقم: <strong>TXN-2025-20-SE-0001</strong></span>
            <span>العميل: <strong>أحمد محمد السعود</strong></span>
            <span>نوع المعاملة: <strong>إصدار رخصة بناء</strong></span>
          </div>
        </div>

        {/* الصف الثاني - التفاصيل الإضافية */}
        <div className="flex items-center gap-6 text-small" style={{ color: '#6b7280', fontFamily: 'Tajawal, sans-serif' }}>
          <span>الحي: النرجس</span>
          <span>القطاع: شرق الرياض</span>
          <span>الأولوية: عادية</span>
          <span>منشئ المعاملة: م.سارة النمر</span>
        </div>

        {/* الصف الثالث - العداد الزمني */}
        <div className="flex items-center justify-center py-1">
          <div 
            className="text-center"
            style={{ 
              fontSize: '16px', 
              color: getTimeColor(),
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: '600'
            }}
          >
            العداد العام: {timeRemaining.days} يوم، {timeRemaining.hours} ساعات، {timeRemaining.minutes} دقيقة
          </div>
        </div>

        {/* الصف الرابع - شريط المراحل */}
        <div className="flex items-center justify-center gap-2" style={{ height: '60px' }}>
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center" style={{ width: '100px' }}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 mb-1">
                <span className="text-lg">{getStageIcon(stage.status)}</span>
              </div>
              <div className="text-center">
                <div 
                  className="font-medium"
                  style={{ 
                    fontSize: '10px',
                    color: stage.status === 'current' ? '#f59e0b' : '#1f2937',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  {stage.name}
                </div>
                <div 
                  className="text-xs"
                  style={{ 
                    fontSize: '9px',
                    color: '#6b7280',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  {stage.duration}
                </div>
              </div>
              {stage.status === 'current' && (
                <div 
                  className="text-xs font-medium mt-1"
                  style={{ 
                    color: '#f59e0b',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  ← المرحلة الحالية
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}