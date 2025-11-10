/**
 * ============================================================================
 * مدير الروابط السريعة - QuickLinksManager v1.0
 * ============================================================================
 * 
 * مكون شامل لإدارة الروابط السريعة للخدمات الخارجية
 * 
 * المميزات:
 * ✅ عرض الروابط السريعة في نافذة منبثقة
 * ✅ فتح الروابط في متصفح خارجي (target="_blank")
 * ✅ إضافة روابط جديدة
 * ✅ تعديل الروابط الموجودة (الاسم + الرابط)
 * ✅ حذف الروابط
 * ✅ حفظ في localStorage
 * ✅ روابط افتراضية: البوابة المكانية + بوابة الأمانة
 * 
 * @version 1.0
 * @date 3 نوفمبر 2025
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { InputWithCopy, SelectWithCopy, TextAreaWithCopy } from './InputWithCopy';
import {
  ExternalLink, Plus, Edit, Trash2, Link as LinkIcon, Globe,
  CheckCircle, AlertCircle, X, Save, Eye
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// الواجهات
// ============================================================================

interface QuickLink {
  id: string;
  name: string;
  url: string;
  description?: string;
  icon: 'globe' | 'link' | 'external';
  color: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// الروابط الافتراضية
// ============================================================================

const DEFAULT_LINKS: QuickLink[] = [
  {
    id: 'QL-001',
    name: 'البوابة المكانية',
    url: 'https://www.momra.gov.sa/',
    description: 'بوابة وزارة الشؤون البلدية والقروية والإسكان',
    icon: 'globe',
    color: '#2563eb',
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    createdBy: 'النظام'
  },
  {
    id: 'QL-002',
    name: 'بوابة الأمانة',
    url: 'https://www.alriyadh.gov.sa/',
    description: 'بوابة أمانة منطقة الرياض',
    icon: 'globe',
    color: '#10b981',
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    createdBy: 'النظام'
  }
];

// ============================================================================
// المكون الرئيسي
// ============================================================================

const QuickLinksManager: React.FC<Props> = ({ open, onOpenChange }) => {
  const [links, setLinks] = useState<QuickLink[]>(DEFAULT_LINKS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<QuickLink | null>(null);

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    icon: 'globe' as 'globe' | 'link' | 'external',
    color: '#2563eb'
  });

  // تحميل الروابط من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quick_links');
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading quick links:', error);
      }
    }
  }, []);

  // حفظ الروابط في localStorage
  const saveLinks = (newLinks: QuickLink[]) => {
    localStorage.setItem('quick_links', JSON.stringify(newLinks));
    setLinks(newLinks);
  };

  // إضافة رابط جديد
  const handleAdd = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('يرجى إدخال اسم الرابط والرابط');
      return;
    }

    // التحقق من صحة الرابط
    try {
      new URL(formData.url);
    } catch {
      toast.error('يرجى إدخال رابط صحيح (مثال: https://example.com)');
      return;
    }

    const newLink: QuickLink = {
      id: `QL-${Date.now()}`,
      name: formData.name,
      url: formData.url,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      createdBy: 'المستخدم الحالي'
    };

    saveLinks([...links, newLink]);
    toast.success(`تمت إضافة الرابط "${formData.name}" بنجاح`);
    setShowAddDialog(false);
    resetForm();
  };

  // تعديل رابط
  const handleEdit = () => {
    if (!selectedLink || !formData.name.trim() || !formData.url.trim()) {
      toast.error('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    // التحقق من صحة الرابط
    try {
      new URL(formData.url);
    } catch {
      toast.error('يرجى إدخال رابط صحيح (مثال: https://example.com)');
      return;
    }

    const updatedLinks = links.map(link =>
      link.id === selectedLink.id
        ? {
            ...link,
            name: formData.name,
            url: formData.url,
            description: formData.description,
            icon: formData.icon,
            color: formData.color,
            modifiedDate: new Date().toISOString()
          }
        : link
    );

    saveLinks(updatedLinks);
    toast.success(`تم تحديث الرابط "${formData.name}" بنجاح`);
    setShowEditDialog(false);
    setSelectedLink(null);
    resetForm();
  };

  // حذف رابط
  const handleDelete = () => {
    if (!selectedLink) return;

    const updatedLinks = links.filter(link => link.id !== selectedLink.id);
    saveLinks(updatedLinks);
    toast.success(`تم حذف الرابط "${selectedLink.name}" بنجاح`);
    setShowDeleteDialog(false);
    setSelectedLink(null);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      icon: 'globe',
      color: '#2563eb'
    });
  };

  // فتح نافذة التعديل
  const openEditDialog = (link: QuickLink) => {
    setSelectedLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      description: link.description || '',
      icon: link.icon,
      color: link.color
    });
    setShowEditDialog(true);
  };

  // فتح نافذة الحذف
  const openDeleteDialog = (link: QuickLink) => {
    setSelectedLink(link);
    setShowDeleteDialog(true);
  };

  // فتح الرابط في متصفح خارجي
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* النافذة الرئيسية */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '20px' }}>
              <ExternalLink className="h-5 w-5 inline ml-2" />
              الروابط السريعة
            </DialogTitle>
            <DialogDescription style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إدارة الروابط السريعة للخدمات والمواقع الخارجية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* زر إضافة رابط جديد */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                <LinkIcon className="h-4 w-4 inline ml-1" />
                إجمالي الروابط: <Badge variant="outline">{links.length}</Badge>
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                style={{ background: '#10b981', color: '#fff' }}
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة رابط جديد
              </Button>
            </div>

            <Separator />

            {/* قائمة الروابط */}
            <ScrollArea style={{ height: '400px' }}>
              <div className="grid grid-cols-2 gap-3 p-2">
                {links.map((link) => (
                  <Card
                    key={link.id}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    style={{
                      borderRight: `4px solid ${link.color}`,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              background: link.color,
                              padding: '8px',
                              borderRadius: '8px'
                            }}
                          >
                            {link.icon === 'globe' && <Globe className="h-5 w-5 text-white" />}
                            {link.icon === 'link' && <LinkIcon className="h-5 w-5 text-white" />}
                            {link.icon === 'external' && <ExternalLink className="h-5 w-5 text-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {link.name}
                            </p>
                            {link.description && (
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {link.url}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => openLink(link.url)}
                          style={{ flex: 1, background: link.color, color: '#fff' }}
                        >
                          <ExternalLink className="h-3 w-3 ml-1" />
                          فتح الرابط
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(link)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteDialog(link)}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة رابط */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle>
              <Plus className="h-5 w-5 inline ml-2" />
              إضافة رابط جديد
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <InputWithCopy
              label="اسم الرابط *"
              id="add-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: البوابة المكانية"
              required
              copyable={false}
              clearable={true}
            />

            <InputWithCopy
              label="الرابط (URL) *"
              id="add-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
              copyable={false}
              clearable={true}
            />

            <TextAreaWithCopy
              label="الوصف (اختياري)"
              id="add-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              copyable={false}
              clearable={true}
            />

            <SelectWithCopy
              label="الأيقونة"
              id="add-icon"
              value={formData.icon}
              onChange={(value) => setFormData({ ...formData, icon: value as any })}
              options={[
                { value: 'globe', label: '🌐 كرة أرضية' },
                { value: 'link', label: '🔗 رابط' },
                { value: 'external', label: '↗️ رابط خارجي' }
              ]}
              copyable={false}
              clearable={false}
            />

            <div className="form-group">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    style={{
                      background: color,
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: formData.color === color ? '3px solid #000' : '1px solid #e5e7eb'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
              إلغاء
            </Button>
            <Button onClick={handleAdd} style={{ background: '#10b981', color: '#fff' }}>
              <Save className="h-3 w-3 ml-1" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل رابط */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle>
              <Edit className="h-5 w-5 inline ml-2" />
              تعديل الرابط
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <InputWithCopy
              label="اسم الرابط *"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              copyable={false}
              clearable={true}
            />

            <InputWithCopy
              label="الرابط (URL) *"
              id="edit-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              copyable={false}
              clearable={true}
            />

            <TextAreaWithCopy
              label="الوصف (اختياري)"
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              copyable={false}
              clearable={true}
            />

            <SelectWithCopy
              label="الأيقونة"
              id="edit-icon"
              value={formData.icon}
              onChange={(value) => setFormData({ ...formData, icon: value as any })}
              options={[
                { value: 'globe', label: '🌐 كرة أرضية' },
                { value: 'link', label: '🔗 رابط' },
                { value: 'external', label: '↗️ رابط خارجي' }
              ]}
              copyable={false}
              clearable={false}
            />

            <div className="form-group">
              <label className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>اللون</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    style={{
                      background: color,
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: formData.color === color ? '3px solid #000' : '1px solid #e5e7eb'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedLink(null); resetForm(); }}>
              إلغاء
            </Button>
            <Button onClick={handleEdit} style={{ background: '#2563eb', color: '#fff' }}>
              <Save className="h-3 w-3 ml-1" />
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle>
              <Trash2 className="h-5 w-5 inline ml-2 text-red-600" />
              تأكيد الحذف
            </DialogTitle>
          </DialogHeader>

          <Alert style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription>
              <p className="font-bold text-red-900 mb-1">هل أنت متأكد من حذف هذا الرابط؟</p>
              <p className="text-sm text-red-800">
                الرابط: <strong>{selectedLink?.name}</strong>
              </p>
              <p className="text-xs text-red-700 mt-1">
                هذا الإجراء لا يمكن التراجع عنه!
              </p>
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedLink(null); }}>
              إلغاء
            </Button>
            <Button onClick={handleDelete} style={{ background: '#ef4444', color: '#fff' }}>
              <Trash2 className="h-3 w-3 ml-1" />
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickLinksManager;
