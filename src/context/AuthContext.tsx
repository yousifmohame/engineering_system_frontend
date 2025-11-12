// Frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {api} from '../api/axiosConfig'; // استيراد Axios المُعد

// تعريف شكل بيانات الموظف والـ Context
interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  // أضف أي بيانات أخرى تهمك من نموذج Employee
}

interface AuthContextType {
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => void;
}

// إنشاء الـ Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// إنشاء الـ "المزود" (Provider)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // التأكد من أن المستخدم لا يزال مسجلاً دخوله عند تحديث الصفحة
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmployee = localStorage.getItem('employee');
    
    if (storedToken && storedEmployee) {
      setToken(storedToken);
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  // وظيفة تسجيل الدخول
  const login = async (emailOrPhone: string, password: string) => {
    try {
      // (يمكنك استخدام 'email' أو 'phone' لتسجيل الدخول)
      const response = await api.post('/auth/login', {
        email: emailOrPhone, 
        password: password,
      });

      const { token, employee } = response.data;

      // 1. تخزين البيانات في الـ State
      setToken(token);
      setEmployee(employee);

      // 2. تخزين البيانات في الـ localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('employee', JSON.stringify(employee));
      
      console.log('Login successful');

    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('فشل تسجيل الدخول. تأكد من البيانات.');
    }
  };

  // وظيفة تسجيل الخروج
  const logout = () => {
    setEmployee(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        employee, 
        token, 
        isAuthenticated: !!token, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لسهولة الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};