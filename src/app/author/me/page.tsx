'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthorProfileStore, useMiniLessonStore, useCourseStore, useAppStore } from '@/lib/stores';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/course/CourseCard';
import { 
  Edit, 
  MapPin, 
  Link as LinkIcon, 
  Youtube, 
  Instagram, 
  Send, 
  Globe,
  Play,
  Share2
} from 'lucide-react';
import { strings } from '@/lib/strings.ru';

export default function AuthorMyPage() {
  const { currentUser } = useAppStore();
  const { getAuthorProfile, initialize: initProfiles, upsertAuthorProfile } = useAuthorProfileStore();
  const { listPublishedMiniLessons, initialize: initLessons } = useMiniLessonStore();
  const { courses, initialize: initCourses } = useCourseStore();
  
  const [activeTab, setActiveTab] = useState<'lessons' | 'courses'>('lessons');
  
  useEffect(() => {
    initProfiles();
    initLessons();
    initCourses();
  }, [initProfiles, initLessons, initCourses]);

  // Use currentUser.id or fallback to '1' for mock
  const authorId = currentUser?.id || '1';
  let profile = getAuthorProfile(authorId);

  // If profile doesn't exist, create a default one based on user data
  if (!profile && currentUser) {
    const newProfile = {
      id: currentUser.id,
      displayName: currentUser.name,
      bio: 'Расскажите о себе...',
      tags: [],
      directions: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // We don't upsert immediately to avoid side effects during render, 
    // but in a real app we might fetch or prompt creation.
    // For this mock, we'll just use the default object for display.
    profile = newProfile;
  }

  const authorLessons = listPublishedMiniLessons().filter(l => l.authorId === authorId);
  const authorCourses = courses.filter(c => c.authorId === authorId && c.status === 'published');

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'telegram': return <Send className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-white pb-0 mb-8 border-b border-slate-200">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full relative overflow-hidden bg-slate-200 group">
          {profile?.coverUrl ? (
            <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
              <span className="flex items-center"><Edit className="w-4 h-4 mr-2" /> Добавьте обложку</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-6 right-6 z-10 flex gap-2">
             <Button variant="ghost" className="text-white hover:bg-white/20">
               <Share2 className="w-4 h-4 mr-2" /> Поделиться
             </Button>
             <Link href="/author/me/edit">
               <Button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30">
                 <Edit className="w-4 h-4 mr-2" /> Редактировать профиль
               </Button>
             </Link>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-end -mt-20 md:-mt-24 mb-6 relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden flex-shrink-0 relative group">
               {profile?.avatarUrl ? (
                 <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl">
                   {profile?.displayName?.charAt(0)}
                 </div>
               )}
            </div>
            
            <div className="md:ml-8 mt-4 md:mt-0 flex-1 w-full md:w-auto text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                     {profile?.displayName}
                   </h1>
                   {profile?.highlight ? (
                     <p className="text-lg font-medium text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg">
                       {profile.highlight}
                     </p>
                   ) : (
                     <p className="text-slate-400 text-sm italic">Добавьте краткое описание деятельности...</p>
                   )}
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
                   {profile?.bio || 'Расскажите о себе и своем опыте...'}
                 </p>
               </div>
               
               {/* Content Tabs */}
               <div>
                 <div className="flex space-x-8 border-b border-slate-200 mb-8">
                   <button 
                     onClick={() => setActiveTab('lessons')}
                     className={`pb-4 text-lg font-semibold border-b-2 transition-colors ${activeTab === 'lessons' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                   >
                     Мини-уроки <span className="text-sm font-normal text-slate-400 ml-1">{authorLessons.length}</span>
                   </button>
                   <button 
                     onClick={() => setActiveTab('courses')}
                     className={`pb-4 text-lg font-semibold border-b-2 transition-colors ${activeTab === 'courses' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                   >
                     Курсы <span className="text-sm font-normal text-slate-400 ml-1">{authorCourses.length}</span>
                   </button>
                 </div>
                 
                 {activeTab === 'lessons' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {authorLessons.map(lesson => (
                       <Link key={lesson.id} href={`/buyer/lessons/${lesson.id}`} className="group">
                         <Card variant="hover" className="h-full border-slate-200 hover:border-primary-200">
                           <div className="aspect-video bg-slate-100 relative overflow-hidden rounded-t-xl">
                             {lesson.coverImageUrl && (
                               <img src={lesson.coverImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             )}
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                               <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                                 <Play className="w-4 h-4 text-slate-900 ml-0.5" />
                               </div>
                             </div>
                           </div>
                           <CardContent className="p-4">
                             <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{lesson.title}</h3>
                             <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
                           </CardContent>
                         </Card>
                       </Link>
                     ))}
                     {authorLessons.length === 0 && (
                       <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                         <p className="text-slate-500 mb-4">У вас пока нет опубликованных мини-уроков.</p>
                         <Link href="/author/lessons/new">
                           <Button variant="outline">Создать урок</Button>
                         </Link>
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {authorCourses.map(course => (
                       <CourseCard key={course.id} course={course} showBuyButton={false} />
                     ))}
                     {authorCourses.length === 0 && (
                       <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                         <p className="text-slate-500 mb-4">У вас пока нет опубликованных курсов.</p>
                         <Link href="/author/courses/new">
                           <Button variant="outline">Создать курс</Button>
                         </Link>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             </div>
             
             {/* Sidebar Info */}
             <div className="space-y-8">
               <div>
                 <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Направления</h3>
                 <div className="flex flex-wrap gap-2">
                   {profile?.tags.length ? profile.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1.5 text-sm">
                       {tag}
                     </Badge>
                   )) : (
                     <p className="text-slate-400 text-sm italic">Теги не добавлены</p>
                   )}
                 </div>
               </div>
               
               <div>
                 <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Контакты</h3>
                 <div className="flex flex-col gap-3">
                   {profile?.social && Object.values(profile.social).some(v => v) ? (
                     Object.entries(profile.social).map(([platform, url]) => {
                       if (!url) return null;
                       return (
                         <a 
                           key={platform} 
                           href={url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-colors"
                         >
                           {renderSocialIcon(platform)}
                           <span className="ml-3 font-medium capitalize">{platform}</span>
                         </a>
                       );
                     })
                   ) : (
                     <p className="text-slate-400 text-sm italic">Ссылки не добавлены</p>
                   )}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
