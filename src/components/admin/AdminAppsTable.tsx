import React, { useState } from 'react';
import { useApps, App } from '@/hooks/useApps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, Download, Smartphone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

const categories = [
  { value: 'social', label: 'التواصل الاجتماعي' },
  { value: 'tools', label: 'الأدوات' },
  { value: 'design', label: 'التصاميم والمونتاج' },
];

const colorPresets = [
  { value: 'from-yellow-500 to-amber-600', label: 'ذهبي' },
  { value: 'from-blue-500 to-blue-700', label: 'أزرق' },
  { value: 'from-pink-500 to-purple-600', label: 'وردي' },
  { value: 'from-sky-400 to-blue-600', label: 'سماوي' },
  { value: 'from-emerald-500 to-green-700', label: 'أخضر' },
  { value: 'from-red-500 to-orange-600', label: 'أحمر' },
  { value: 'from-violet-500 to-purple-700', label: 'بنفسجي' },
  { value: 'from-slate-600 to-slate-800', label: 'رمادي' },
  { value: 'from-orange-500 to-red-600', label: 'برتقالي' },
  { value: 'from-indigo-500 to-blue-600', label: 'نيلي' },
  { value: 'from-amber-500 to-yellow-600', label: 'عنبري' },
];

const defaultForm = {
  name: '',
  description: '',
  category: 'social',
  icon: '',
  icon_url: '',
  download_url: '',
  version: '1.0',
  size: '10 MB',
  rating: 4.5,
  downloads_count: '1K+',
  color: 'from-blue-500 to-blue-700',
  is_active: true,
  sort_order: 0,
};

const AdminAppsTable: React.FC = () => {
  const { apps, addApp, updateApp, deleteApp, uploadApk } = useApps();
  const [isOpen, setIsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setEditingApp(null);
    setForm(defaultForm);
    setApkFile(null);
    setIsOpen(true);
  };

  const openEdit = (app: App) => {
    setEditingApp(app);
    setForm({
      name: app.name,
      description: app.description || '',
      category: app.category,
      icon: app.icon || '',
      icon_url: app.icon_url || '',
      download_url: app.download_url || '',
      version: app.version || '1.0',
      size: app.size || '10 MB',
      rating: app.rating || 4.5,
      downloads_count: app.downloads_count || '1K+',
      color: app.color || 'from-blue-500 to-blue-700',
      is_active: app.is_active,
      sort_order: app.sort_order,
    });
    setApkFile(null);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم التطبيق');
      return;
    }

    setUploading(true);

    if (editingApp) {
      await updateApp(editingApp.id, form);
      if (apkFile) await uploadApk(apkFile, editingApp.id);
    } else {
      // Create app first, then upload if file exists
      const { data, error } = await (await import('@/integrations/supabase/client')).supabase
        .from('apps')
        .insert([form as any])
        .select()
        .single();
      
      if (!error && data && apkFile) {
        await uploadApk(apkFile, (data as any).id);
      } else if (!error) {
        toast.success('تم إضافة التطبيق بنجاح');
      }
      // Refetch
      const { useApps: _ } = await import('@/hooks/useApps');
    }

    setUploading(false);
    setIsOpen(false);
    setApkFile(null);
    // Force refetch by closing dialog
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
      await deleteApp(id);
    }
  };

  const getCategoryLabel = (cat: string) => categories.find(c => c.value === cat)?.label || cat;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="w-5 h-5" /> إدارة التطبيقات
        </h2>
        <div className="flex gap-2">
          <ExportButton onExportExcel={() => exportToExcel(apps, 'apps')} onExportPDF={() => exportToPDF(apps, 'apps')} />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 ml-1" /> إضافة تطبيق</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingApp ? 'تعديل التطبيق' : 'إضافة تطبيق جديد'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>اسم التطبيق *</Label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
                </div>
                <div>
                  <Label>التصنيف</Label>
                  <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>اسم الأيقونة (Lucide) - اختياري</Label>
                  <Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="مثال: MessageCircle, Shield, Star" />
                  <p className="text-xs text-muted-foreground mt-1">اتركه فارغ إذا كنت تريد استخدام رابط صورة</p>
                </div>
                <div>
                  <Label>رابط صورة الأيقونة - اختياري</Label>
                  <Input value={form.icon_url} onChange={e => setForm({...form, icon_url: e.target.value})} placeholder="https://example.com/icon.png" />
                  {form.icon_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.icon_url} alt="preview" className="w-10 h-10 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <span className="text-xs text-muted-foreground">معاينة الأيقونة</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label>رابط التحميل المباشر</Label>
                  <Input value={form.download_url} onChange={e => setForm({...form, download_url: e.target.value})} placeholder="https://example.com/app.apk" />
                </div>
                <div>
                  <Label>أو ارفع ملف APK</Label>
                  <Input type="file" accept=".apk,.xapk,.apks" onChange={e => setApkFile(e.target.files?.[0] || null)} />
                  {apkFile && <p className="text-xs text-muted-foreground mt-1">📦 {apkFile.name} ({(apkFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>الإصدار</Label>
                    <Input value={form.version} onChange={e => setForm({...form, version: e.target.value})} />
                  </div>
                  <div>
                    <Label>الحجم</Label>
                    <Input value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>التقييم</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>عدد التحميلات</Label>
                    <Input value={form.downloads_count} onChange={e => setForm({...form, downloads_count: e.target.value})} />
                  </div>
                </div>
                <div>
                  <Label>لون التدرج</Label>
                  <Select value={form.color} onValueChange={v => setForm({...form, color: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {colorPresets.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${c.value}`} />
                            {c.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>الترتيب</Label>
                    <Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} />
                    <Label>نشط</Label>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={uploading}>
                  {uploading ? 'جاري الحفظ...' : (editingApp ? 'تحديث' : 'إضافة')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الأيقونة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الإصدار</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التحميل</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">لا توجد تطبيقات بعد</TableCell></TableRow>
            ) : apps.map(app => (
              <TableRow key={app.id}>
                <TableCell>
                  {app.icon_url ? (
                    <img src={app.icon_url} alt={app.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell><Badge variant="secondary">{getCategoryLabel(app.category)}</Badge></TableCell>
                <TableCell>{app.version}</TableCell>
                <TableCell>
                  <Badge variant={app.is_active ? 'default' : 'secondary'}>
                    {app.is_active ? 'نشط' : 'معطل'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {app.download_url ? (
                    <a href={app.download_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(app)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(app.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAppsTable;
