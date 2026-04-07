import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteSettings {
  [key: string]: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value');
    if (!error && data) {
      const map: SiteSettings = {};
      (data as any[]).forEach((row: any) => {
        map[row.setting_key] = row.setting_value || '';
      });
      setSettings(map);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: value } as any)
      .eq('setting_key', key);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حفظ الإعداد', variant: 'destructive' });
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
      toast({ title: 'تم', description: 'تم حفظ الإعداد بنجاح' });
    }
  };

  const updateMultipleSettings = async (updates: Record<string, string>) => {
    const promises = Object.entries(updates).map(([key, value]) =>
      supabase.from('site_settings').update({ setting_value: value } as any).eq('setting_key', key)
    );
    await Promise.all(promises);
    setSettings(prev => ({ ...prev, ...updates }));
    toast({ title: 'تم', description: 'تم حفظ الإعدادات بنجاح' });
  };

  const getSetting = (key: string, defaultValue = '') => settings[key] || defaultValue;

  return { settings, isLoading, updateSetting, updateMultipleSettings, getSetting, refetch: fetchSettings };
};
