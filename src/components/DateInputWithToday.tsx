import React, { useState } from 'react';
import { Calendar, Copy, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { copyToClipboard } from './utils/clipboard';

interface DateInputWithTodayProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  copyable?: boolean;
  showTodayButton?: boolean;
}

export const DateInputWithToday: React.FC<DateInputWithTodayProps> = ({
  label,
  copyable = true,
  showTodayButton = true,
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  // تأكد من أن القيمة دائماً محددة (إما controlled أو uncontrolled)
  const dateValue = value !== undefined ? value : undefined;
  const dateDefaultValue = value === undefined ? (defaultValue !== undefined ? defaultValue : '') : undefined;

  const handleCopy = async () => {
    const textToCopy = String(value || defaultValue || '');
    if (!textToCopy) return;

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    const event = {
      target: { value: today }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  return (
    <div className="dense-form-group">
      {label && (
        <label 
          className="dense-form-label" 
          htmlFor={props.id}
          style={{
            fontFamily: 'Tajawal, sans-serif',
            fontWeight: 700,
            color: '#2563eb',
            fontSize: '13px',
            marginBottom: '6px',
            display: 'block'
          }}
        >
          {label}
          {props.required && <span className="text-red-600 mr-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center gap-2">
        <div className="input-with-copy-wrapper flex-1">
          <input
            type="date"
            {...props}
            value={dateValue}
            defaultValue={dateDefaultValue}
            onChange={onChange}
            className={`dense-form-input ${props.className || ''}`}
            style={{
              ...props.style,
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
              textAlign: 'right',
              backgroundColor: 'rgba(254, 243, 199, 0.5)',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 40px 8px 12px',
              height: '40px',
              fontSize: '14px'
            }}
          />
          {copyable && (
            <button
              type="button"
              className={`input-copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={copied ? 'تم النسخ!' : 'نسخ'}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="copy-tooltip">
                {copied ? 'تم النسخ!' : 'نسخ'}
              </span>
            </button>
          )}
        </div>
        {showTodayButton && (
          <Button
            type="button"
            className="dense-btn dense-btn-secondary h-10 px-3"
            onClick={handleTodayClick}
            title="اختيار اليوم"
          >
            <Calendar className="h-4 w-4" />
            اليوم
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateInputWithToday;
