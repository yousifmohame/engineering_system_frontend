import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  BarChart3, Building2, Home, TrendingUp, MapPin, Calendar,
  FileText, Download, Printer, Filter, Search, RefreshCw,
  Building, Users, Layers, Ruler, Zap, Activity, PieChart,
  ArrowUp, ArrowDown, Target, Award, ChevronRight, Map,
  DollarSign, Percent, LineChart, LayoutGrid, Hash, Star,
  Compass, MapPinned, Landmark, TreePine, Factory, ShoppingBag,
  CheckCircle, Eye, X, Trash2, File, Upload, Clock, Shield,
  Plus, Link2
} from 'lucide-react';
import CodeDisplay from '../CodeDisplay';
import UniversalTabsSidebar from '../UniversalTabsSidebar';

// This file should not exist - use BusinessStatistics_Complete_951 instead
// This is a placeholder to prevent errors

const BusinessStatistics_Complete_950: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            ⚠️ تحذير: رقم شاشة خاطئ
          </h2>
          <p className="text-gray-700 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            هذا الملف (950) لا يجب استخدامه.
            <br />
            الرجاء استخدام شاشة إحصائيات الأعمال برقم <strong>951</strong> بدلاً من ذلك.
          </p>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            الملف الصحيح: BusinessStatistics_Complete_951
          </Badge>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-right">
            <p className="text-sm text-yellow-800" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              <strong>ملاحظة:</strong> رقم الشاشة 950 محجوز لـ "التقارير الفنية"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessStatistics_Complete_950;
