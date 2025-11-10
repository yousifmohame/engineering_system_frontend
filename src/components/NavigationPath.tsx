import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PathItem {
  label: string;
  code?: string;
  onClick?: () => void;
}

interface NavigationPathProps {
  path: PathItem[];
  className?: string;
}

export function NavigationPath({ path, className = "" }: NavigationPathProps) {
  return (
    <div className={`flex items-center gap-2 text-small ${className}`}>
      <span className="font-code text-code opacity-70">NAV-PATH-SYSTEM</span>
      <div className="flex items-center gap-2 mr-4">
        {path.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronLeft className="w-3 h-3 text-[#6b7280] rotate-180" />
            )}
            <button
              onClick={item.onClick}
              className={`text-[#2563eb] hover:underline transition-colors ${
                !item.onClick ? 'cursor-default' : 'cursor-pointer'
              }`}
              style={{ fontSize: '12px' }}
            >
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}