import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Upload, Settings2, Palette, LayoutGrid, Image } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SECTIONS = [
  { key: 'show_news', label: 'شريط الأخبار' },
  { key: 'show_packages', label: 'بطاقة الباقات' },
  { key: 'show_apps', label: 'بطاقة التطبيقات' },
  { key: 'show_livestream', label: 'بطاقة البث المباشر' },
  { key: 'show_wifi', label: 'بطاقة شبكات واي فاي' },
  { key: 'show_portfolio', label: 'بطاقة معرض الأعمال' },
  { key: 'show_services', label: 'قسم الخدمات' },
  { key: 'show_social', label: 'أيقونات التواصل' },
  { key: 'show_featured_clients', label: 'عملاؤنا المميزون' },
  { key: 'show_ai_tools', label: 'بطاقة أدوات الذكاء الاصطناعي' },
];

const AdminPlatformSettings: React.FC = () => {
  const { settings, isLoading, updateSetting, updateMultipleSettings } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { setLocalSettings(settings); }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `site/logo_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل رفع الشعار', variant: 'destructive' });
    } else {
      const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(path);
      setLocalSettings(prev => ({ ...prev, site_logo_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSaveAll = async () => {
    await updateMultipleSettings(localSettings);
  };

  if (isLoading) return <div className="text-center p-8 text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings2 className="w-5 h-5" />هوية المنصة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اسم المنصة</Label>
            <Input value={localSettings.site_name || ''} onChange={e => setLocalSettings(prev => ({ ...prev, site_name: e.target.value }))} />
          </div>
          <div>
            <Label>شعار المنصة</Label>
            <div className="flex gap-2 items-center mt-1">
              <Input placeholder="رابط الشعار" value={localSettings.site_logo_url || ''} onChange={e => setLocalSettings(prev => ({ ...prev, site_logo_url: e.target.value }))} className="flex-1" />
              <input type="file" accept="image/*" ref={fileRef} onChange={handleLogoUpload} className="hidden" />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4 ml-1" />{uploading ? 'جاري...' : 'رفع'}
              </Button>
            </div>
            {localSettings.site_logo_url && (
              <div className="mt-2 flex items-center gap-3">
                <img src={localSettings.site_logo_url} alt="logo" className="w-12 h-12 rounded-lg object-contain border border-border" />
                <span className="text-xs text-muted-foreground">معاينة الشعار</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sections Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5" />إظهار/إخفاء الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTIONS.map(section => (
              <div key={section.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label className="cursor-pointer">{section.label}</Label>
                <Switch
                  checked={localSettings[section.key] === 'true'}
                  onCheckedChange={v => setLocalSettings(prev => ({ ...prev, [section.key]: v ? 'true' : 'false' }))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveAll} className="w-full">
        <Save className="w-4 h-4 ml-2" />حفظ جميع الإعدادات
      </Button>
    </div>
  );
};

export default AdminPlatformSettings;
