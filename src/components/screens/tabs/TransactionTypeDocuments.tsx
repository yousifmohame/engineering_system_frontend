import React, { useState } from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

interface Props {
  control: Control<any>; // (استقبال `control` من الفورم الأب)
}

const TransactionTypeDocuments: React.FC<Props> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents", // (يجب أن يطابق الاسم في Zod Schema)
  });

  const [newDocumentName, setNewDocumentName] = useState("");

  // --- ✅ 1. تعديل handleAddDocument ---
  const handleAddDocument = () => {
    if (newDocumentName.trim()) {
      // (إضافة كائن بدلاً من نص)
      append({ value: newDocumentName.trim() }); 
      setNewDocumentName(""); // (تفريغ الحقل)
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="اكتب اسم المستند المطلوب (مثال: صورة الصك)"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDocument();
                }
              }}
            />
            <Button type="button" onClick={handleAddDocument}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مستند
            </Button>
          </div>
        </CardContent>
      </Card>

      {fields.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h4 className="font-semibold">قائمة المستندات ({fields.length})</h4>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between gap-2 p-2 border rounded-md"
              >
                {/* --- ✅ 2. تعديل العرض --- */}
                {/* (قراءة `field.value` بدلاً من `field`) */}
                <span className="text-sm">{field.value}</span>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionTypeDocuments;