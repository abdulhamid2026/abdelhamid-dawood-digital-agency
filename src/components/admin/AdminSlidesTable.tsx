import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Plus, Edit, Trash2, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { useToast } from '@/hooks/use-toast';

const gradientOptions = [
  { label: 'ذهبي', value: 'from-primary/20 to-accent/20' },
  { label: 'أزرق', value: 'from-blue-600/20 to-cyan-500/20' },
  { label: 'بنفسجي', value: 'from-violet-600/20 to-purple-500/20' },
  { label: 'وردي', value: 'from-rose-600/20 to-pink-500/20' },
  { label: 'أخضر', value: 'from-emerald-600/20 to-teal-500/20' },
  { label: 'برتقالي', value: 'from-amber-500/20 to-orange-600/20' },
];

const AdminSlidesTable: React.FC = () => {
  const { slides, isLoading, createSlide, updateSlide, deleteSlide, toggleSlide } = useHeroSlides();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', gradient: 'from-primary/20 to-accent/20', sort_order: '0' });

  const resetForm = () => {
    setFormData({ title: '', description: '', gradient: 'from-primary/20 to-accent/20', sort_order: '0' });
    setEditingSlide(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: formData.title, description: formData.description || undefined, gradient: formData.gradient, sort_order: parseInt(formData.sort_order) };

    if (editingSlide) {
      const { error } = await updateSlide(editingSlide.id, payload);
      if (!error) { toast({ title: 'تم التحديث', description: 'تم تحديث الشريحة بنجاح' }); setIsDialogOpen(false); resetForm(); }
      else toast({ title: 'خطأ', description: 'فشل في تحديث الشريحة', variant: 'destructive' });
    } else {
      const { error } = await createSlide(payload);
      if (!error) { toast({ title: 'تم الإضافة', description: 'تم إضافة الشريحة بنجاح' }); setIsDialogOpen(false); resetForm(); }
      else toast({ title: 'خطأ', description: 'فشل في إضافة الشريحة', variant: 'destructive' });
    }
  };

  const handleEdit = (slide: any) => {
    setEditingSlide(slide);
    setFormData({ title: slide.title, description: slide.description || '', gradient: slide.gradient, sort_order: slide.sort_order.toString() });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteSlide(id);
    if (!error) toast({ title: 'تم الحذف', description: 'تم حذف الشريحة بنجاح' });
    else toast({ title: 'خطأ', description: 'فشل في حذف الشريحة', variant: 'destructive' });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="w-full gradient-gold"><Plus className="w-4 h-4 ml-2" />إضافة شريحة جديدة</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingSlide ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">العنوان</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="عنوان الشريحة" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">الوصف</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="وصف الشريحة" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">اللون</label>
              <select value={formData.gradient} onChange={(e) => setFormData({ ...formData, gradient: e.target.value })} className="w-full h-10 px-3 bg-secondary border border-border rounded-md text-foreground">
                {gradientOptions.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">الترتيب</label>
              <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} />
            </div>
            <Button type="submit" className="w-full gradient-gold">{editingSlide ? 'تحديث' : 'إضافة'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {slides.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" /><p className="text-muted-foreground">لا توجد شرائح حالياً</p></CardContent></Card>
      ) : (
        slides.map((slide, index) => (
          <motion.div key={slide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={!slide.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${slide.gradient}`} />
                      <h3 className="font-semibold text-foreground">{slide.title}</h3>
                      <Badge variant={slide.is_active ? 'default' : 'secondary'}>{slide.is_active ? 'نشط' : 'معطل'}</Badge>
                    </div>
                    {slide.description && <p className="text-sm text-muted-foreground">{slide.description}</p>}
                    <span className="text-xs text-muted-foreground">ترتيب: {slide.sort_order}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(slide)}><Edit className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleSlide(slide.id, !slide.is_active)}>
                        {slide.is_active ? <><ToggleLeft className="w-4 h-4 ml-2" />تعطيل</> : <><ToggleRight className="w-4 h-4 ml-2" />تفعيل</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(slide.id)} className="text-destructive"><Trash2 className="w-4 h-4 ml-2" />حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AdminSlidesTable;
