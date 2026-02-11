'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CourseCard } from '@/components/course/CourseCard';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/stores/authStore';
import { Course } from '@/lib/types';

export default function BuyerCourses() {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'saved'>('enrolled');
  const [loading, setLoading] = useState(true);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchPurchasedCourses() {
      if (!currentUser?.id) return;
      
      const supabase = createClient();
      
      // Fetch enrollments and join with courses
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          progress,
          course:courses (
            id, title, description, price, cover_url, author_id, updated_at
          )
        `)
        .eq('user_id', currentUser.id);

      if (!error && data) {
        // Map Supabase response to Course type
        const courses: Course[] = data.map((item: any) => ({
          id: item.course.id,
          title: item.course.title,
          description: item.course.description,
          shortDescription: item.course.description || '',
          authorId: item.course.author_id,
          authorName: 'Unknown', 
          thumbnail: item.course.cover_url,
          price: item.course.price,
          category: 'General',
          modules: [],
          createdAt: item.course.created_at || new Date().toISOString(),
          updatedAt: item.course.updated_at,
          studentsCount: 0,
          rating: 5,
          tags: [],
          status: 'published',
          progress: item.progress || 0, // Add progress from enrollment
          settings: {
            hasDeadlines: false,
            autoAdvance: false,
            allowLateSubmissions: false,
            requireSequentialProgress: false,
            discussionEnabled: false
          }
        }));
        setPurchasedCourses(courses);
      }
      setLoading(false);
    }

    fetchPurchasedCourses();
  }, [currentUser]);
  
  if (loading) {
    return (
      <PageShell>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {strings.myLearning}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Ваши курсы и прогресс обучения
            </p>
          </div>
          {purchasedCourses.length > 0 && (
            <Link href="/buyer/catalog">
              <Button variant="ghost" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                Каталог курсов <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center",
              activeTab === 'enrolled' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Мои курсы
          </button>
        </div>
        
        {/* Enrolled Tab */}
        {activeTab === 'enrolled' && (
          purchasedCourses.length === 0 ? (
            <Card className="text-center py-20 border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {strings.noPurchasedCourses}
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                {strings.noPurchasedCoursesDescription}
              </p>
              <Link href="/buyer/catalog">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none rounded-xl">
                  Перейти в каталог
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress={true}
                  progress={course.progress} // Use real progress
                  showBuyButton={false}
                />
              ))}
            </div>
          )
        )}
      </div>
    </PageShell>
  );
}
