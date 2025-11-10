/**
 * Copy Helper - دالة نسخ آمنة تعمل في جميع البيئات
 * =======================================================
 * 
 * هذه الدالة توفر طريقة آمنة للنسخ إلى الحافظة تعمل في جميع البيئات
 * حتى لو كانت Clipboard API محظورة أو غير متاحة
 */

/**
 * نسخ نص إلى الحافظة بطريقة آمنة
 * @param text النص المراد نسخه
 * @returns Promise<boolean> - true إذا نجح النسخ، false إذا فشل
 */
export const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  // استخدام الطريقة القديمة مباشرة (execCommand) لتجنب مشاكل الصلاحيات
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // إخفاء ال textarea بشكل كامل
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // تحديد النص بطرق متعددة لضمان التوافق
    textArea.focus();
    textArea.select();
    
    // محاولة إضافية للتحديد (للمتصفحات القديمة)
    try {
      textArea.setSelectionRange(0, text.length);
    } catch (e) {
      // تجاهل الخطأ
    }
    
    // محاولة النسخ باستخدام execCommand
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      successful = false;
    }
    
    // إزالة العنصر
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    // فشل النسخ تماماً
    return false;
  }
};

/**
 * نسخ نص مع إظهار رسالة للمستخدم
 * @param text النص المراد نسخه
 * @param successMessage رسالة النجاح (اختياري)
 * @param errorMessage رسالة الخطأ (اختياري)
 */
export const copyWithAlert = async (
  text: string,
  successMessage: string = '✅ تم النسخ بنجاح',
  errorMessage: string = '❌ فشل في النسخ'
): Promise<void> => {
  const success = await safeCopyToClipboard(text);
  alert(success ? successMessage : errorMessage);
};

export default safeCopyToClipboard;
