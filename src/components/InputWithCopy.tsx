import React, { useState } from 'react';
import { Copy, CheckCircle, X } from 'lucide-react';
import { copyToClipboard } from './utils/clipboard';

interface InputWithCopyProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  copyable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

// ✅ 1. استخدام React.forwardRef لتغليف المكون
export const InputWithCopy = React.forwardRef<
  HTMLInputElement,
  InputWithCopyProps
>(
  (
    {
      label,
      copyable = true,
      clearable = true,
      value,
      defaultValue,
      onChange,
      onClear,
      ...props
    },
    ref // ✅ 2. استقبال الـ ref
  ) => {
    const [copied, setCopied] = useState(false);
    const [localValue, setLocalValue] = useState(defaultValue || '');

    // إذا كان هناك onChange، استخدم controlled mode، وإلا استخدم uncontrolled mode
    const isControlled = onChange !== undefined || value !== undefined;
    const currentValue = isControlled ? value : localValue;

    const handleCopy = async () => {
      const textToCopy = String(currentValue || '');
      if (!textToCopy) return;

      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleClear = () => {
      if (isControlled) {
        if (onChange) {
          // @ts-ignore - Create a synthetic event
          onChange({ target: { value: '' } } as any);
        }
        if (onClear) {
          onClear();
        }
      } else {
        setLocalValue('');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isControlled) {
        if (onChange) {
          onChange(e);
        }
      } else {
        setLocalValue(e.target.value);
      }
    };

    // تحديد القيمة النهائية للـ controlled input
    const inputProps = isControlled
      ? { value: value ?? '', onChange: handleChange }
      : { value: localValue, onChange: handleChange };

    const hasValue = String(currentValue || '').length > 0;

    return (
      <div className="dense-form-group">
        {label && (
          <label
            className="dense-form-label"
            htmlFor={props.id}
            style={{
              fontWeight: 700,
              color: '#2563eb',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '13px',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            {label}
            {props.required && <span className="text-red-600 mr-1">*</span>}
          </label>
        )}
        <div className="input-with-copy-wrapper">
          <input
            {...props}
            {...inputProps}
            ref={ref} // ✅ 3. تمرير الـ ref إلى عنصر input
            className={`enhanced-input-field ${props.className || ''}`}
            style={{
              ...props.style,
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
              textAlign: 'right',
            }}
          />
          <div className="input-actions-group">
            {clearable && hasValue && (
              <button
                type="button"
                className="input-action-btn clear-btn"
                onClick={handleClear}
                title="مسح"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {copyable && hasValue && (
              <button
                type="button"
                className={`input-action-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? 'تم النسخ!' : 'نسخ'}
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
// ✅ 4. إضافة اسم للعرض (جيد للـ debugging)
InputWithCopy.displayName = 'InputWithCopy';


interface TextAreaWithCopyProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  copyable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

// ✅ 1. استخدام React.forwardRef
export const TextAreaWithCopy = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaWithCopyProps
>(
  (
    {
      label,
      copyable = true,
      clearable = true,
      value,
      defaultValue,
      onChange,
      onClear,
      ...props
    },
    ref // ✅ 2. استقبال الـ ref
  ) => {
    const [copied, setCopied] = useState(false);
    const [localValue, setLocalValue] = useState(defaultValue || '');

    const isControlled = onChange !== undefined || value !== undefined;
    const currentValue = isControlled ? value : localValue;

    const handleCopy = async () => {
      const textToCopy = String(currentValue || '');
      if (!textToCopy) return;

      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleClear = () => {
      if (isControlled) {
        if (onChange) {
          // @ts-ignore
          onChange({ target: { value: '' } } as any);
        }
        if (onClear) {
          onClear();
        }
      } else {
        setLocalValue('');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isControlled) {
        if (onChange) {
          onChange(e);
        }
      } else {
        setLocalValue(e.target.value);
      }
    };

    const textareaProps = isControlled
      ? { value: value ?? '', onChange: handleChange }
      : { value: localValue, onChange: handleChange };

    const hasValue = String(currentValue || '').length > 0;

    return (
      <div className="dense-form-group">
        {label && (
          <label
            className="dense-form-label"
            htmlFor={props.id}
            style={{
              fontWeight: 700,
              color: '#2563eb',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '13px',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            {label}
            {props.required && <span className="text-red-600 mr-1">*</span>}
          </label>
        )}
        <div className="input-with-copy-wrapper textarea-wrapper">
          <textarea
            {...props}
            {...textareaProps}
            ref={ref} // ✅ 3. تمرير الـ ref إلى عنصر textarea
            className={`enhanced-textarea-field ${props.className || ''}`}
            style={{
              ...props.style,
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
              textAlign: 'right',
            }}
          />
          <div className="input-actions-group textarea-actions">
            {clearable && hasValue && (
              <button
                type="button"
                className="input-action-btn clear-btn"
                onClick={handleClear}
                title="مسح"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {copyable && hasValue && (
              <button
                type="button"
                className={`input-action-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? 'تم النسخ!' : 'نسخ'}
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
// ✅ 4. إضافة اسم للعرض
TextAreaWithCopy.displayName = 'TextAreaWithCopy';


// تعديل توقيع onChange ليدعم SyntheticEvent المزيف
type SelectWithCopyChangeHandler = (event: React.ChangeEvent<HTMLSelectElement> | { target: { id: string; value: string } }) => void;

interface SelectWithCopyProps {
  label?: string;
  copyable?: boolean;
  clearable?: boolean;
  options?: Array<{ value: string; label: string }>;
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: SelectWithCopyChangeHandler;
  onClear?: () => void;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// ✅ 1. استخدام React.forwardRef
export const SelectWithCopy = React.forwardRef<
  HTMLSelectElement,
  SelectWithCopyProps
>(
  (
    {
      label,
      copyable = true,
      clearable = true,
      options,
      id,
      value,
      defaultValue,
      onChange,
      onClear,
      required,
      className,
      style,
      children,
    },
    ref // ✅ 2. استقبال الـ ref
  ) => {
    const [copied, setCopied] = useState(false);
    const [localValue, setLocalValue] = useState(defaultValue || '');

    const isControlled = onChange !== undefined || value !== undefined;
    const currentValue = isControlled ? value : localValue;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (isControlled) {
        if (onChange) {
          onChange(e); // تمرير الحدث الكامل
        }
      } else {
        setLocalValue(e.target.value);
      }
    };

    const handleCopy = async () => {
      if (!currentValue) return;

      const selectedOption = options?.find((opt) => opt.value === currentValue);
      const textToCopy = selectedOption
        ? selectedOption.label
        : String(currentValue);

      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleClear = () => {
      if (isControlled) {
        if (onChange) {
          // 💡 تمرير SyntheticEvent مزيف مع id و value
          onChange({ target: { id: id || '', value: '' } } as any);
        }
        if (onClear) {
          onClear();
        }
      } else {
        setLocalValue('');
      }
    };

    const selectProps = isControlled
      ? { value: value ?? '', onChange: handleChange }
      : { value: localValue, onChange: handleChange };

    const hasValue = String(currentValue || '').length > 0;

    return (
      <div className="dense-form-group">
        {label && (
          <label
            className="dense-form-label"
            htmlFor={id}
            style={{
              fontWeight: 700,
              color: '#2563eb',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '13px',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            {label}
            {required && <span className="text-red-600 mr-1">*</span>}
          </label>
        )}
        <div className="input-with-copy-wrapper select-wrapper">
          <select
            id={id}
            {...selectProps}
            ref={ref} // ✅ 3. تمرير الـ ref إلى عنصر select
            required={required}
            className={`enhanced-select-field ${className || ''}`}
            style={{
              ...style,
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
              textAlign: 'right',
              fontSize: '13px',
            }}
          >
            {children ||
              options?.map((option, index) => (
                <option
                  key={`${option.value}-${index}`} // Fixed: Use unique key
                  value={option.value}
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >
                  {option.label}
                </option>
              ))}
          </select>
          <div className="input-actions-group select-actions">
            {clearable && hasValue && (
              <button
                type="button"
                className="input-action-btn clear-btn"
                onClick={handleClear}
                title="مسح"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {copyable && hasValue && (
              <button
                type="button"
                className={`input-action-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? 'تم النسخ!' : 'نسخ'}
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
// ✅ 4. إضافة اسم للعرض
SelectWithCopy.displayName = 'SelectWithCopy';


export default InputWithCopy;