/**
 * Hook موحد للحصول على معلومات الشاشة
 * ===============================================
 * 
 * يوفر معلومات الشاشة (الرقم، العنوان، الأيقونة، إلخ) من مصدر واحد
 * عند تغيير رقم الشاشة في screensConfig، يتحدث تلقائياً في كل مكان
 * 
 * الاستخدام:
 * ```tsx
 * const screenInfo = useScreenInfo('main-dashboard');
 * <CodeDisplay code={screenInfo.code} />
 * ```
 */

import { SCREENS_CONFIG } from '../ScreensConfig';

export interface ScreenInfo {
  id: string;
  code: string;           // مثل: "001" أو "672" أو "916"
  title: string;          // العنوان العربي
  titleEn?: string;       // العنوان الإنجليزي (اختياري)
  category?: string;      // الفئة
  description?: string;   // الوصف
  path?: string;          // المسار (اختياري)
  totalTabs?: number;     // عدد التابات
}

/**
 * Hook للحصول على معلومات شاشة محددة
 */
export function useScreenInfo(screenId: string): ScreenInfo {
  const screen = SCREENS_CONFIG.find(s => s.id === screenId);
  
  if (!screen) {
    console.warn(`⚠️ Screen not found: ${screenId}`);
    return {
      id: screenId,
      code: 'UNKNOWN',
      title: 'شاشة غير معروفة',
      category: 'غير مصنف'
    };
  }

  return {
    id: screen.id,
    code: screen.screenNumber,
    title: screen.title,
    category: screen.category,
    path: screen.path,
    totalTabs: screen.totalTabs
  };
}

/**
 * Hook للحصول على قائمة جميع الشاشات
 */
export function useAllScreens(): ScreenInfo[] {
  return SCREENS_CONFIG.map(screen => ({
    id: screen.id,
    code: screen.screenNumber,
    title: screen.title,
    category: screen.category,
    path: screen.path,
    totalTabs: screen.totalTabs
  }));
}

/**
 * Hook للحصول على الشاشات حسب الفئة
 */
export function useScreensByCategory(category: string): ScreenInfo[] {
  return SCREENS_CONFIG
    .filter(screen => screen.category === category)
    .map(screen => ({
      id: screen.id,
      code: screen.screenNumber,
      title: screen.title,
      category: screen.category,
      path: screen.path,
      totalTabs: screen.totalTabs
    }));
}

/**
 * دالة مساعدة للحصول على الكود الكامل للشاشة
 * مثل: 001 أو 672 أو 916
 */
export function getScreenCode(screenId: string): string {
  const screen = SCREENS_CONFIG.find(s => s.id === screenId);
  return screen?.screenNumber || 'UNKNOWN';
}

/**
 * دالة مساعدة للحصول على عنوان الشاشة
 */
export function getScreenTitle(screenId: string): string {
  const screen = SCREENS_CONFIG.find(s => s.id === screenId);
  return screen?.title || 'شاشة غير معروفة';
}

/**
 * دالة مساعدة للتحقق من وجود الشاشة
 */
export function isScreenExists(screenId: string): boolean {
  return SCREENS_CONFIG.some(s => s.id === screenId);
}
