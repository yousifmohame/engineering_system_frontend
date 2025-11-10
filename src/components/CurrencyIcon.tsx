import React from 'react';

interface CurrencyIconProps {
  /**
   * حجم الأيقونة بالبكسل
   */
  size?: number;
  /**
   * الشفافية (0-1)
   */
  opacity?: number;
  /**
   * هل هذا المبلغ متعلق بفريلانسر من خارج المملكة؟
   * إذا كان true، سيتم عرض "USD" بدلاً من رمز الريال
   */
  isFreelancerPayment?: boolean;
  /**
   * عملة بديلة للفريلانسرز
   */
  freelancerCurrency?: string;
  /**
   * CSS classes إضافية
   */
  className?: string;
}

export function CurrencyIcon({ 
  size = 16, 
  opacity = 1, 
  isFreelancerPayment = false,
  freelancerCurrency = 'USD',
  className = '' 
}: CurrencyIconProps) {
  // إذا كان المبلغ للفريلانسرز من خارج المملكة، عرض العملة النصية
  if (isFreelancerPayment) {
    return (
      <span 
        className={`inline-block text-xs font-medium text-muted-foreground ${className}`}
        style={{ 
          fontSize: `${size * 0.75}px`,
          opacity,
          fontFamily: 'Courier New, monospace',
          marginLeft: '4px'
        }}
      >
        {freelancerCurrency}
      </span>
    );
  }

  // استخدام رمز الريال السعودي النصي للمبالغ المحلية
  return (
    <span 
      className={`inline-block text-xs font-medium text-muted-foreground ${className}`}
      style={{ 
        fontSize: `${size * 0.75}px`,
        opacity,
        fontFamily: 'Tajawal, sans-serif',
        marginLeft: '4px'
      }}
    >
      ريال
    </span>
  );
}

/**
 * مكون مساعد لتنسيق المبالغ مع الرمز الجديد
 */
interface FormattedCurrencyProps {
  /**
   * المبلغ المالي
   */
  amount: number;
  /**
   * حجم رمز العملة
   */
  iconSize?: number;
  /**
   * هل هذا مبلغ فريلانسر؟
   */
  isFreelancerPayment?: boolean;
  /**
   * عملة الفريلانسر
   */
  freelancerCurrency?: string;
  /**
   * CSS classes للمبلغ
   */
  className?: string;
  /**
   * هل يجب إظهار المبلغ بالكلمات؟
   */
  showInWords?: boolean;
}

export function FormattedCurrency({
  amount,
  iconSize = 16,
  isFreelancerPayment = false,
  freelancerCurrency = 'USD',
  className = '',
  showInWords = false
}: FormattedCurrencyProps) {
  // تنسيق المبلغ
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  // تحويل الأرقام إلى كلمات (مبسط)
  const numberToArabicWords = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} مليار`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} مليون`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)} ألف`;
    return num.toString();
  };

  return (
    <span className={`inline-flex items-center ${className}`} style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <span className="font-medium">
        {formatNumber(amount)}
      </span>
      <CurrencyIcon 
        size={iconSize} 
        isFreelancerPayment={isFreelancerPayment}
        freelancerCurrency={freelancerCurrency}
      />
      {showInWords && !isFreelancerPayment && (
        <span className="text-xs text-muted-foreground mr-2">
          ({numberToArabicWords(amount)} ريال)
        </span>
      )}
    </span>
  );
}