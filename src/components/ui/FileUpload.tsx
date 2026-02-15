'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, X, Loader2, FileIcon, ImageIcon, Video } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  bucket: string;
  path?: string; // Optional prefix path
  accept?: string; // e.g. "image/*" or "video/*"
  currentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  label?: string;
  className?: string;
}

export function FileUpload({ 
  bucket, 
  path = '', 
  accept = '*', 
  currentUrl, 
  onUploadComplete, 
  label = "Загрузить файл",
  className 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getIcon = () => {
    if (accept.includes('video')) return <Video className="w-8 h-8 text-slate-400" />;
    if (accept.includes('image')) return <ImageIcon className="w-8 h-8 text-slate-400" />;
    return <FileIcon className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
        disabled={uploading}
      />

      {!currentUrl ? (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary-400 hover:bg-primary-50/30",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
          ) : (
            getIcon()
          )}
          <p className="text-sm font-medium text-slate-600 mt-2">
            {uploading ? 'Загрузка...' : label}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {accept === 'image/*' ? 'PNG, JPG, WEBP' : accept === 'video/*' ? 'MP4, WEBM' : 'Любой формат'}
          </p>
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          {accept.includes('image') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="Uploaded" className="w-full h-48 object-cover" />
          ) : accept.includes('video') ? (
            <video src={currentUrl} className="w-full h-48 object-cover bg-black" controls />
          ) : (
            <div className="p-4 flex items-center">
              <FileIcon className="w-6 h-6 mr-3 text-primary-600" />
              <span className="text-sm truncate flex-1">{currentUrl.split('/').pop()}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Заменить
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onUploadComplete('')} // Clear URL
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-500 mt-2">{error}</p>
      )}
    </div>
  );
}
