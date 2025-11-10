import React from 'react';
import { cn } from './ui/utils';

interface CodeDisplayProps {
  code: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
  code, 
  position = 'top-right',
  className 
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div 
      className={cn(
        "fixed z-50 bg-gray-900 text-white px-3 py-1.5 rounded-md shadow-lg",
        "text-xs font-mono opacity-80 hover:opacity-100 transition-opacity",
        positionClasses[position],
        className
      )}
    >
      {code}
    </div>
  );
};

export default CodeDisplay;
