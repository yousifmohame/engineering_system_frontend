/**
 * دالة نسخ النص إلى الحافظة - متوافقة مع جميع البيئات
 * تستخدم الطريقة الحديثة (Clipboard API) إذا كانت متاحة،
 * وإلا تستخدم الطريقة القديمة (execCommand)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // محاولة استخدام Clipboard API الحديث
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, falling back to execCommand:', err);
    }
  }

  // الطريقة البديلة: استخدام execCommand (للمتصفحات القديمة أو البيئات المحمية)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // إخفاء العنصر
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (err) {
    console.error('Both clipboard methods failed:', err);
    return false;
  }
}
