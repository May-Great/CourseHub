'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthorProfileStore, useMiniLessonStore, useCourseStore } from '@/lib/stores';
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
  Video,
  BookOpen,
  Play,
  Eye,
  Users,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function BuyerAuthorProfile() {
  const params = useParams();
  const router = useRouter();
  const authorId = params.id as string;
  
  const { getAuthorProfile, initialize: initProfiles, incrementViews, toggleFollow } = useAuthorProfileStore();
  const { listPublishedMiniLessons, initialize: initLessons } = useMiniLessonStore();
  const { courses, initialize: initCourses } = useCourseStore();
  
  const [activeTab, setActiveTab] = useState<'lessons' | 'courses'>('lessons');
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    initProfiles();
    initLessons();
    initCourses();
    
    // Increment views on mount
    incrementViews(authorId);
  }, [initProfiles, initLessons, initCourses, authorId, incrementViews]);
  
  const profile = getAuthorProfile(authorId);
  
  if (!profile) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Автор не найден</h1>
          <Button className="mt-4" onClick={() => router.push('/buyer/authors')}>Вернуться в каталог</Button>
        </div>
      </PageShell>
    );
  }
  
  const handleFollowClick = () => {
    toggleFollow(authorId, !isFollowing);
    setIsFollowing(!isFollowing);
  };
  
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
        <div className="h-64 md:h-80 w-full relative overflow-hidden bg-slate-200">
          {profile.coverUrl && (
            <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-6 left-6 z-10">
             <Link href="/buyer/authors">
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
               {profile.avatarUrl ? (
                 <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl">
                   {profile.displayName.charAt(0)}
                 </div>
               )}
            </div>
            
            <div className="md:ml-8 mt-4 md:mt-0 flex-1 w-full md:w-auto text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                     {profile.displayName}
                   </h1>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                     {profile.highlight && (
                       <p className="text-lg font-medium text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg">
                         {profile.highlight}
                       </p>
                     )}
                     <div className="flex items-center space-x-4 text-sm font-medium text-white/90 md:text-slate-500 bg-black/30 md:bg-transparent px-3 py-1 md:p-0 rounded-full backdrop-blur-sm md:backdrop-blur-none">
                       <span className="flex items-center" title="Просмотры профиля">
                         <Eye className="w-4 h-4 mr-1.5 opacity-70" />
                         {profile.views || 0}
                       </span>
                       <span className="flex items-center" title="Подписчики">
                         <Users className="w-4 h-4 mr-1.5 opacity-70" />
                         {profile.followersCount || 0}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex gap-3 justify-center md:justify-end">
                   <Button 
                     size="lg" 
                     onClick={handleFollowClick}
                     className={`rounded-xl px-8 shadow-lg transition-all ${
                       isFollowing 
                         ? "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-none" 
                         : "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20"
                     }`}
                   >
                     {isFollowing ? (
                       <>
                         <Check className="w-4 h-4 mr-2" /> Вы подписаны
                       </>
                     ) : (
                       "Подписаться"
                     )}
                   </Button>
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
                   {profile.bio}
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
                       <p className="text-slate-500 italic">У автора пока нет опубликованных мини-уроков.</p>
                     )}
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {authorCourses.map(course => (
                       <CourseCard key={course.id} course={course} showBuyButton={true} />
                     ))}
                     {authorCourses.length === 0 && (
                       <p className="text-slate-500 italic">У автора пока нет опубликованных курсов.</p>
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
                   {profile.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1.5 text-sm">
                       {tag}
                     </Badge>
                   ))}
                 </div>
               </div>
               
               {profile.social && Object.values(profile.social).some(v => v) && (
                 <div>
                   <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Контакты</h3>
                   <div className="flex flex-col gap-3">
                     {Object.entries(profile.social).map(([platform, url]) => {
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
