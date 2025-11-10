/**
 * ============================================================================
 * Screen Context - نظام إدارة الشاشات المركزي
 * ============================================================================
 * 
 * يوفر context لإدارة الشاشة النشطة في جميع أنحاء التطبيق
 * 
 * @version 1.0
 * @date 2025-10-26
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScreenContextType {
  activeScreen: string;
  setActiveScreen: (screenId: string) => void;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider');
  }
  return context;
};

interface ScreenProviderProps {
  children: ReactNode;
}

export const ScreenProvider: React.FC<ScreenProviderProps> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<string>('homepage');

  return (
    <ScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};
