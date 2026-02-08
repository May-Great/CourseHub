'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/course/CourseCard';
import { 
  ArrowLeft, 
  MapPin, 
  Link as LinkIcon, 
  Youtube, 
  Instagram, 
  Send, 
  Globe,
  Loader2,
  Users
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/lib/types';

interface AuthorProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  cover_url: string | null;
  social_links: any;
}

export default function BuyerAuthorProfile() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;
  
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAuthorData() {
      const supabase = createClient();
      
      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authorId)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);

        // 2. Fetch Courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('author_id', authorId)
          .eq('is_published', true);
          
        if (coursesError) throw coursesError;
        
        // Map courses
        const mappedCourses: Course[] = (coursesData || []).map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          shortDescription: c.description || '',
          authorId: c.author_id,
          authorName: profileData.full_name || 'Author',
          thumbnail: c.cover_url,
          price: c.price,
          category: 'Development',
          modules: [],
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          studentsCount: 0,
          rating: c.rating || 0,
          tags: [],
          status: 'published',
          settings: { hasDeadlines: false, autoAdvance: false, allowLateSubmissions: false, requireSequentialProgress: false, certificateEnabled: false, discussionEnabled: false }
        }));
        
        setCourses(mappedCourses);
      } catch (error) {
        console.error('Error fetching author:', error);
      } finally {
        setLoading(false);
      }
    }

    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId]);
  
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'telegram': return <Send className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </PageShell>
    );
  }
  
  if (!profile) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Автор не найден</h1>
          <Button className="mt-4" onClick={() => router.push('/buyer/catalog')}>Вернуться в каталог</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-white pb-0 mb-8 border-b border-slate-200">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full relative overflow-hidden bg-slate-200">
          {profile.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-300 to-slate-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-6 left-6 z-10">
             <Link href="/buyer/catalog">
               <Button variant="ghost" className="text-white hover:bg-white/20">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Назад
               </Button>
             </Link>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-end -mt-20 md:-mt-24 mb-6 relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0">
               {profile.avatar_url ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl">
                   {profile.full_name?.charAt(0) || '?'}
                 </div>
               )}
            </div>
            
            <div className="md:ml-8 mt-4 md:mt-0 flex-1 w-full md:w-auto text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                     {profile.full_name}
                   </h1>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                     {profile.headline && (
                       <p className="text-lg font-medium text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg">
                         {profile.headline}
                       </p>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Bio & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12">
             <div className="lg:col-span-2 space-y-8">
               <div>
                 <h2 className="text-xl font-bold text-slate-900 mb-3">Об авторе</h2>
                 <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                   {profile.bio || 'Автор пока не добавил описание.'}
                 </p>
               </div>
               
               <div>
                 <h2 className="text-xl font-bold text-slate-900 mb-6">Курсы автора ({courses.length})</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {courses.map(course => (
                     <CourseCard key={course.id} course={course} showBuyButton={true} />
                   ))}
                   {courses.length === 0 && (
                     <p className="text-slate-500 italic">У автора пока нет опубликованных курсов.</p>
                   )}
                 </div>
               </div>
             </div>
             
             {/* Sidebar Info */}
             <div className="space-y-8">
               {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                 <div>
                   <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Контакты</h3>
                   <div className="flex flex-col gap-3">
                     {Object.entries(profile.social_links).map(([platform, url]) => {
                       if (!url) return null;
                       return (
                         <a 
                           key={platform} 
                           href={url as string} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-colors"
                         >
                           {renderSocialIcon(platform)}
                           <span className="ml-3 font-medium capitalize">{platform}</span>
                         </a>
                       );
                     })}
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
