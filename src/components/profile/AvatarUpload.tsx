'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Camera, Loader2, User } from 'lucide-react';
import Image from 'next/image';

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export function AvatarUpload({ url, onUpload, size = 150 }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      onUpload(data.publicUrl);

    } catch (error) {
      alert('Error uploading avatar!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer rounded-full overflow-hidden border-4 border-white shadow-lg"
        style={{ width: size, height: size }}
        onClick={() => fileInputRef.current?.click()}
      >
        {url ? (
          <Image
            src={url}
            alt="Avatar"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
            <User className="w-1/2 h-1/2" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="hidden">
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          ref={fileInputRef}
        />
      </div>

      <Button 
        variant="outline" 
        size="sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {uploading ? 'Загрузка...' : 'Изменить фото'}
      </Button>
    </div>
  );
}
