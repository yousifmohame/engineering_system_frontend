// Frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../api/axiosConfig'; // استيراد Axios المُعد

// تعريف شكل بيانات الموظف
interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  // أضف أي بيانات أخرى تهمك من نموذج Employee
}

// 1. <--- التعديل: تحديث الواجهة (Interface)
interface AuthState {
  employee: Employee | null;
  token: string | null; // هذا هو الـ Access Token
  refreshToken: string | null; // <--- التعديل: إضافة الـ Refresh Token
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => void;
  // <--- التعديل: إضافة دالة لتحديث التوكن (سيستخدمها axios)
  setNewAccessToken: (newAccessToken: string) => void;
}

// تعريف الـ Actions للـ Reducer
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { employee: Employee; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_NEW_ACCESS_TOKEN'; payload: { newAccessToken: string } }; // <--- التعديل

// 2. <--- التعديل: الحالة الأولية
const initialState: AuthState = {
  employee: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // نبدأ بـ true للتحقق من الـ localStorage
};

// 3. <--- التعديل: تحديث الـ Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        employee: action.payload.employee,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken, // <--- التعديل
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        employee: null,
        token: null,
        refreshToken: null, // <--- التعديل
        isLoading: false,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_NEW_ACCESS_TOKEN': // <--- التعديل: حالة لتحديث الـ Access Token
      return {
        ...state,
        token: action.payload.newAccessToken,
      };
    default:
      return state;
  }
};

// إنشاء الـ Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// إنشاء الـ "المزود" (Provider)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 4. <--- التعديل: التأكد من الـ Tokens عند تحديث الصفحة
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken'); // <--- التعديل
      const storedEmployee = localStorage.getItem('employee');
      
      if (storedToken && storedRefreshToken && storedEmployee) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            employee: JSON.parse(storedEmployee),
            token: storedToken,
            refreshToken: storedRefreshToken, // <--- التعديل
          },
        });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error("Failed to parse stored auth data", error);
      dispatch({ type: 'LOGOUT' });
    } finally {
       dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }, []);

  // 5. <--- التعديل: وظيفة تسجيل الدخول
  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email: emailOrPhone, 
        password: password,
      });

      // <--- التعديل: توقع (accessToken, refreshToken, employee)
      const { accessToken, refreshToken, employee } = response.data;

      // 1. تخزين البيانات في الـ localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken); // <--- التعديل
      localStorage.setItem('employee', JSON.stringify(employee));
      
      // 2. تخزين البيانات في الـ State
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          employee,
          token: accessToken,
          refreshToken, // <--- التعديل
        },
      });

      console.log('Login successful');

    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('فشل تسجيل الدخول. تأكد من البيانات.');
    }
  };

  // 6. <--- التعديل: وظيفة تسجيل الخروج
  const logout = () => {
    // (يُفضل إرسال طلب للـ backend لحذف الـ refreshToken من الـ DB)
    // api.post('/auth/logout', { refreshToken: state.refreshToken });

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); // <--- التعديل
    localStorage.removeItem('employee');
    dispatch({ type: 'LOGOUT' });
  };

  // 7. <--- التعديل: دالة لتحديث الـ token
  const setNewAccessToken = (newAccessToken: string) => {
    localStorage.setItem('token', newAccessToken);
    dispatch({
      type: 'SET_NEW_ACCESS_TOKEN',
      payload: { newAccessToken },
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...state,
        login, 
        logout,
        setNewAccessToken, // <--- التعديل
      }}
    >
      {/* لا نعرض التطبيق إلا بعد التأكد من حالة تسجيل الدخول
        لتجنب "ومضة" (flicker) ظهور شاشة تسجيل الدخول
      */}
      {!state.isLoading && children}
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