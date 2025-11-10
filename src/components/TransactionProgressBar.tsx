import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Clock, AlertTriangle, CheckCircle, User, Calendar, MapPin } from 'lucide-react';

interface TransactionProgressBarProps {
  transactionCode: string;
  transactionTitle: string;
  clientName: string;
  location: string;
  startDate: string;
  estimatedDuration: number; // بالأيام
  currentStage: number;
  totalStages: number;
  remainingDays: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  stages: Array<{
    id: string;
    title: string;
    status: 'completed' | 'current' | 'pending';
    completedDate?: string;
  }>;
}

export default function TransactionProgressBar({
  transactionCode,
  transactionTitle,
  clientName,
  location,
  startDate,
  estimatedDuration,
  currentStage,
  totalStages,
  remainingDays,
  urgencyLevel,
  stages
}: TransactionProgressBarProps) {
  
  // حساب النسبة المئوية للتقدم
  const progressPercentage = Math.round((currentStage / totalStages) * 100);
  
  // تحديد لون العداد الزمني حسب الوقت المتبقي
  const getTimeColor = () => {
    if (remainingDays < 0) return 'text-red-600'; // متأخر
    if (remainingDays <= 2) return 'text-orange-600'; // قريب الانتهاء
    if (remainingDays <= 5) return 'text-yellow-600'; // تحذير
    return 'text-green-600'; // آمن
  };

  // تحديد لون مستوى الأولوية
  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyText = () => {
    switch (urgencyLevel) {
      case 'critical': return 'عاجل جداً';
      case 'high': return 'عاجل';
      case 'medium': return 'متوسط';
      case 'low': return 'عادي';
      default: return 'غير محدد';
    }
  };

  return (
    <Card className="w-full border border-gray-200 hover:shadow-md transition-all duration-200">
      <div 
        className="p-4 space-y-3"
        style={{ 
          height: '140px', // الارتفاع حسب المواصفات
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* الصف 1: معلومات المعاملة الأساسية (14px، #1f2937) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              className="font-mono text-xs px-2 py-1"
              style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: '#1d4ed8',
                border: '1px solid rgba(37, 99, 235, 0.2)'
              }}
            >
              {transactionCode}
            </Badge>
            <h3 
              className="font-medium truncate max-w-md" 
              style={{ 
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '14px',
                color: '#1f2937'
              }}
            >
              {transactionTitle}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              className={`text-white text-xs px-2 py-1 ${getUrgencyColor()}`}
            >
              {getUrgencyText()}
            </Badge>
            <div className="text-xs text-gray-500">
              {currentStage}/{totalStages}
            </div>
          </div>
        </div>

        {/* الصف 2: التفاصيل الإضافية (12px، #6b7280) */}
        <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                {clientName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                {location}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '12px' }}>
                {startDate}
              </span>
            </div>
          </div>
          
          <div className="text-xs" style={{ fontFamily: 'Tajawal, sans-serif', color: '#6b7280' }}>
            المدة المقدرة: {estimatedDuration} يوم
          </div>
        </div>

        {/* الصف 3: العداد الزمني (16px، لون متغير حسب الوقت المتبقي) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span 
              className={`font-semibold ${getTimeColor()}`}
              style={{ 
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '16px'
              }}
            >
              {remainingDays >= 0 
                ? `${remainingDays} يوم متبقي`
                : `متأخر ${Math.abs(remainingDays)} يوم`
              }
            </span>
            {remainingDays <= 2 && remainingDays >= 0 && (
              <AlertTriangle className="h-4 w-4 text-orange-500 animate-pulse" />
            )}
            {remainingDays < 0 && (
              <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {progressPercentage}%
            </span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </div>

        {/* الصف 4: شريط المراحل (10 مراحل، عرض كل مرحلة 100px) */}
        <div className="space-y-2">
          {/* شريط التقدم العام */}
          <div className="w-full">
            <Progress 
              value={progressPercentage} 
              className="h-2 w-full" 
              style={{
                backgroundColor: '#f3f4f6'
              }}
            />
          </div>
          
          {/* مراحل المعاملة */}
          <div 
            className="flex gap-1 overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex-shrink-0 px-2 py-1 rounded text-xs text-center transition-all cursor-pointer hover:shadow-sm ${
                  stage.status === 'completed' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : stage.status === 'current'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
                style={{ 
                  width: '100px', // عرض كل مرحلة 100px حسب المواصفات
                  fontFamily: 'Tajawal, sans-serif'
                }}
                title={`${stage.title}${stage.completedDate ? ` - مكتمل في ${stage.completedDate}` : ''}`}
              >
                <div className="font-medium">
                  {index + 1}
                </div>
                <div className="truncate">
                  {stage.title.split(' ')[0]} {/* عرض الكلمة الأولى فقط */}
                </div>
                {stage.status === 'completed' && (
                  <CheckCircle className="h-3 w-3 mx-auto mt-1" />
                )}
                {stage.status === 'current' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}