'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { currentUser, initialize } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setAvatarUrl(currentUser.avatar || null);
    }
  }, [currentUser]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { user } = (await supabase.auth.getUser()).data;

      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      
      // Update local store
      await initialize();
      alert('Профиль обновлен!');
    } catch (error) {
      alert('Ошибка обновления профиля');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Настройки профиля</h1>
      
      <Card className="p-8 space-y-8">
        <div className="flex flex-col items-center pb-8 border-b border-slate-100">
          <AvatarUpload 
            url={avatarUrl} 
            onUpload={(url) => setAvatarUrl(url)} 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email (нельзя изменить)
            </label>
            <Input 
              value={currentUser?.email || ''} 
              disabled 
              className="bg-slate-50 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Имя и Фамилия
            </label>
            <Input 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Введите ваше имя"
            />
          </div>

          <div className="pt-4">
            <Button onClick={updateProfile} disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Сохранить изменения
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
