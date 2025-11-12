import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// ✅ صحيح: استيراد المكتبة الجديدة
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);