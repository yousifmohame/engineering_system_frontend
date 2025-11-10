// Frontend/src/App.tsx
import React from 'react';
import { ScreenProvider } from './components/ScreenContext';
import SystemHeader from './components/SystemHeader';
import ScreensSidebar from './components/ScreensSidebar_v4';
import ScreenRenderer from './components/ScreenRenderer_v8_Clean';
import SystemFooter from './components/SystemFooter';

// --- 1. استيراد المصادقة وشاشة تسجيل الدخول ---
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';

function App() {
  // --- 2. التحقق من حالة المصادقة ---
  const { isAuthenticated } = useAuth();

  // --- 3. إذا لم يكن مسجلاً، اعرض شاشة تسجيل الدخول ---
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // --- 4. إذا كان مسجلاً، اعرض النظام بالكامل ---
  // (هذا هو الكود الأصلي الخاص بك)
  return (
    <ScreenProvider>
      <div style={{ 
        fontFamily: 'Tajawal, sans-serif', 
        direction: 'rtl',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* الهيدر الموحد */}
        <SystemHeader />
        
        {/* محتوى التطبيق */}
        <div style={{ 
          display: 'flex', 
          flex: 1,
          marginTop: '40px',
          position: 'relative'
        }}>
          {/* السايد بار */}
          <ScreensSidebar />
          
          {/* مساحة العمل */}
          <main style={{
            flex: 1,
            marginRight: '284px',
            minHeight: 'calc(100vh - 72px)',
            background: '#ffffff'
          }}>
            <ScreenRenderer />
          </main>
        </div>
        
        {/* الفوتر */}
        <SystemFooter />
      </div>
    </ScreenProvider>
  );
}

export default App;