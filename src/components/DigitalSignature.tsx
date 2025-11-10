import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from "sonner";
import { 
  PenTool, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  Palette,
  Square,
  Check
} from 'lucide-react';

interface DigitalSignatureProps {
  onSave?: (signatureData: string) => void;
  width?: number;
  height?: number;
  employeeName?: string;
  employeeId?: string;
  className?: string;
}

interface SignatureSample {
  id: string;
  name: string;
  dataUrl: string;
  createdDate: string;
  isActive: boolean;
}

export function DigitalSignature({ 
  onSave, 
  width = 400, 
  height = 200, 
  employeeName = '',
  employeeId = '',
  className = '' 
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [signatures, setSignatures] = useState<SignatureSample[]>([
    {
      id: '1',
      name: 'التوقيع الرئيسي',
      dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      createdDate: '2024-09-15',
      isActive: true
    }
  ]);

  const getCanvas = useCallback(() => {
    return canvasRef.current;
  }, []);

  const getContext = useCallback(() => {
    const canvas = getCanvas();
    return canvas?.getContext('2d');
  }, [getCanvas]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({ x, y });
  }, [getCanvas]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPoint({ x, y });
  }, [isDrawing, lastPoint, penColor, penWidth, getCanvas, getContext]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    toast.success('تم مسح التوقيع');
  }, [getCanvas, getContext]);

  const saveSignature = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) return;

    // التحقق من وجود محتوى في Canvas
    const imageData = canvas.toDataURL('image/png');
    
    // إنشاء canvas مؤقت للتحقق من المحتوى
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // ملء الخلفية بالأبيض للمقارنة
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    const emptyImageData = tempCanvas.toDataURL('image/png');

    if (imageData === emptyImageData) {
      toast.error('يرجى رسم التوقيع أولاً');
      return;
    }

    const newSignature: SignatureSample = {
      id: Date.now().toString(),
      name: `توقيع ${employeeName || 'جديد'} - ${new Date().toLocaleDateString('ar-SA')}`,
      dataUrl: imageData,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: false
    };

    setSignatures(prev => [...prev, newSignature]);
    
    if (onSave) {
      onSave(imageData);
    }
    
    toast.success('تم حفظ التوقيع بنجاح');
    clearCanvas();
  }, [getCanvas, employeeName, onSave, clearCanvas]);

  const downloadSignature = useCallback((signatureData?: string) => {
    const canvas = getCanvas();
    if (!canvas && !signatureData) return;

    const dataUrl = signatureData || canvas?.toDataURL('image/png');
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `signature_${employeeName || employeeId || 'employee'}_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('تم تحميل التوقيع');
  }, [getCanvas, employeeName, employeeId]);

  const setActiveSignature = useCallback((signatureId: string) => {
    setSignatures(prev => 
      prev.map(sig => ({
        ...sig,
        isActive: sig.id === signatureId
      }))
    );
    toast.success('تم تعيين التوقيع النشط');
  }, []);

  const deleteSignature = useCallback((signatureId: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== signatureId));
    toast.success('تم حذف التوقيع');
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('حجم الملف كبير جداً (الحد الأقصى 5 ميجا)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const newSignature: SignatureSample = {
          id: Date.now().toString(),
          name: `توقيع مرفوع - ${file.name}`,
          dataUrl: result,
          createdDate: new Date().toISOString().split('T')[0],
          isActive: false
        };

        setSignatures(prev => [...prev, newSignature]);
        toast.success('تم رفع التوقيع بنجاح');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  React.useEffect(() => {
    const canvas = getCanvas();
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    
    const ctx = getContext();
    if (!ctx) return;

    // تطبيق إعدادات افتراضية
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [width, height, getCanvas, getContext]);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="card-element">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            <PenTool className="w-5 h-5" />
            إنشاء التوقيع الرقمي
            {employeeName && (
              <Badge variant="outline">
                {employeeName} ({employeeId})
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* أدوات الرسم */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Label className="text-small" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  لون القلم:
                </Label>
                <div className="flex gap-2">
                  {['#000000', '#0066cc', '#cc0000', '#009900'].map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${penColor === color ? 'border-gray-600' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setPenColor(color)}
                    />
                  ))}
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-6 h-6 rounded border-2 border-gray-300"
                  />
                </div>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Label className="text-small" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  سمك القلم:
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={penWidth}
                  onChange={(e) => setPenWidth(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-small w-6">{penWidth}px</span>
              </div>
            </div>

            {/* منطقة الرسم */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-small text-muted-foreground" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ارسم توقيعك في المنطقة أدناه:
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCanvas}
                    className="h-8"
                  >
                    <RotateCcw className="w-3 h-3 ml-1" />
                    مسح
                  </Button>
                </div>
              </div>
              
              <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded cursor-crosshair bg-white mx-auto block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ touchAction: 'none' }}
              />

              <div className="flex justify-center gap-2 mt-4">
                <Button onClick={saveSignature} className="btn-primary">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التوقيع
                </Button>
                <Button onClick={() => downloadSignature()} variant="outline">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </div>

            {/* رفع توقيع من ملف */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="text-center">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <Label className="text-small text-blue-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  أو ارفع صورة التوقيع من جهازك
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-2 cursor-pointer"
                />
                <p className="text-xs text-blue-600 mt-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  يُفضل PNG أو JPG بخلفية شفافة، الحد الأقصى 5 ميجا
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التوقيعات المحفوظة */}
      {signatures.length > 0 && (
        <Card className="card-element">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Tajawal, sans-serif' }}>
              التوقيعات المحفوظة ({signatures.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signatures.map((signature) => (
                <Card key={signature.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* معاينة التوقيع */}
                    <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={signature.dataUrl} 
                        alt={signature.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      {signature.isActive && (
                        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                          <Check className="w-3 h-3 ml-1" />
                          نشط
                        </Badge>
                      )}
                    </div>

                    {/* تفاصيل التوقيع */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-small" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {signature.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        تم الإنشاء: {new Date(signature.createdDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>

                    {/* الإجراءات */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      {!signature.isActive ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-green-600"
                          onClick={() => setActiveSignature(signature.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-green-600"
                          disabled
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => downloadSignature(signature.dataUrl)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-red-600"
                        onClick={() => deleteSignature(signature.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}