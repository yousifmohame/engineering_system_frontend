// Frontend/src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; // 1. استيراد
import { QueryClient, QueryClientProvider } from "react-query"; // 2. استيراد
import { Toaster } from "./components/ui/sonner";

// 3. إنشاء عميل React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // 4. تغليف التطبيق بالكامل
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
      <Toaster richColors closeButton />
    </AuthProvider>
  </QueryClientProvider>
);