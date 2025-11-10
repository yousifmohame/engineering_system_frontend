import React from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface EnhancedSwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const EnhancedSwitch: React.FC<EnhancedSwitchProps> = ({
  id,
  checked = false,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'enhanced-switch-sm',
    md: 'enhanced-switch-md',
    lg: 'enhanced-switch-lg'
  };

  const variantClasses = {
    default: 'enhanced-switch-default',
    success: 'enhanced-switch-success',
    warning: 'enhanced-switch-warning',
    danger: 'enhanced-switch-danger'
  };

  return (
    <div className={`enhanced-switch-wrapper ${className}`}>
      <div className="enhanced-switch-container">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={`enhanced-switch ${sizeClasses[size]} ${variantClasses[variant]}`}
        />
        {label && (
          <div className="enhanced-switch-content">
            <Label
              htmlFor={id}
              className="enhanced-switch-label"
              style={{
                fontFamily: 'Tajawal, sans-serif',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1
              }}
            >
              {label}
            </Label>
            {description && (
              <p
                className="enhanced-switch-description"
                style={{
                  fontFamily: 'Tajawal, sans-serif'
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}
        <div className="enhanced-switch-status">
          <span
            className={`status-badge ${checked ? 'active' : 'inactive'}`}
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            {checked ? 'مفعّل' : 'غير مفعّل'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSwitch;
