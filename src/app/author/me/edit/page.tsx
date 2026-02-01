'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthorProfileStore, useAppStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AuthorProfile } from '@/lib/types';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  X,
  Youtube,
  Instagram,
  Send,
  Globe,
  Eye
} from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const { getAuthorProfile, upsertAuthorProfile, initialize } = useAuthorProfileStore();
  
  // Use currentUser.id or fallback to '1' for mock
  const authorId = currentUser?.id || '1';
  
  const [formData, setFormData] = useState<Partial<AuthorProfile>>({
    id: authorId,
    displayName: '',
    bio: '',
    tags: [],
    social: {
      telegram: '',
      instagram: '',
      youtube: '',
      website: ''
    }
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    initialize();
    const existingProfile = getAuthorProfile(authorId);
    if (existingProfile) {
      setFormData(existingProfile);
    } else if (currentUser) {
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.name,
      }));
    }
  }, [authorId, getAuthorProfile, currentUser, initialize]);

  const handleInputChange = (field: keyof AuthorProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: keyof NonNullable<AuthorProfile['social']>, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (formData.id) {
      upsertAuthorProfile(formData as AuthorProfile);
      router.push('/author/me');
    }
  };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-2 pl-0 hover:bg-transparent hover:text-primary-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Назад
            </Button>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Редактирование профиля
            </h1>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => router.push('/author/me')}>
               <Eye className="w-4 h-4 mr-2" /> Предпросмотр
             </Button>
             <Button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20">
               <Save className="w-4 h-4 mr-2" /> Сохранить
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 {/* Avatar Upload Placeholder */}
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Фото профиля</label>
                   <div className="flex items-center gap-4">
                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 overflow-hidden">
                       {formData.avatarUrl ? (
                         <img src={formData.avatarUrl} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-2xl font-bold text-slate-400">{formData.displayName?.charAt(0)}</span>
                       )}
                     </div>
                     <div className="flex-1">
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             placeholder="URL фото..." 
                             className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                             value={formData.avatarUrl || ''}
                             onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                           />
                           {/* Real upload would go here */}
                           <Button variant="outline" size="sm">
                             <Upload className="w-4 h-4" />
                           </Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Рекомендуемый размер 400x400px</p>
                     </div>
                   </div>
                 </div>

                 {/* Cover Upload Placeholder */}
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Обложка профиля</label>
                   <div className="flex flex-col gap-2">
                      <div className="h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative">
                         {formData.coverUrl && (
                           <img src={formData.coverUrl} alt="" className="w-full h-full object-cover opacity-50" />
                         )}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-slate-500">Preview</span>
                         </div>
                      </div>
                      <input 
                         type="text" 
                         placeholder="URL обложки..." 
                         className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                         value={formData.coverUrl || ''}
                         onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                       />
                   </div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Имя (отображаемое) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName || ''}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Highlight (Плашка)
                </label>
                <input
                  type="text"
                  value={formData.highlight || ''}
                  onChange={(e) => handleInputChange('highlight', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  placeholder="Например: 5 лет в дизайне / 100+ проектов"
                />
                <p className="text-xs text-slate-400 mt-1">Короткий текст под именем, выделяющий ваш опыт.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Био / О себе
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all resize-none"
                  placeholder="Расскажите вашу историю, опыт и чем вы можете помочь студентам..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags & Directions */}
          <Card>
            <CardHeader>
              <CardTitle>Направления и теги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                  placeholder="Добавить тег (например: Marketing, Python)"
                />
                <Button onClick={handleAddTag} variant="outline" className="px-4">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {formData.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(!formData.tags || formData.tags.length === 0) && (
                  <p className="text-slate-400 text-sm italic py-2">Нет добавленных тегов</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Социальные сети</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Send className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.social?.telegram || ''}
                    onChange={(e) => handleSocialChange('telegram', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    placeholder="Telegram (https://t.me/...)"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.social?.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    placeholder="Instagram"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.social?.youtube || ''}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    placeholder="YouTube"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.social?.website || ''}
                    onChange={(e) => handleSocialChange('website', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    placeholder="Личный сайт"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sticky Action Bar (Mobile only, or use fixed positioning) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-40 flex gap-3 shadow-lg">
           <Button variant="outline" className="flex-1" onClick={() => router.push('/author/me')}>
             Отмена
           </Button>
           <Button className="flex-1 bg-primary-600 text-white" onClick={handleSave}>
             Сохранить
           </Button>
        </div>
      </div>
    </PageShell>
  );
}
