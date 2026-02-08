'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/lib/types';
import { useAuthStore } from '@/lib/stores/authStore';

export default function AuthorCourses() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthStore();

  useEffect(() => {
    async function fetchMyCourses() {
      if (!currentUser?.id) return;
      
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('author_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match Course type (simplified for now)
        // In real app, we would fetch modules/lessons count too
        const mappedCourses: Course[] = (data || []).map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          authorId: c.author_id,
          authorName: currentUser.name || 'Me', // We know it's current user
          price: c.price,
          coverUrl: c.cover_url,
          modules: [], // We don't need modules for list view usually, or fetch separately
          category: 'Development', // Placeholder
          level: 'Beginner', // Placeholder
          rating: 0,
          studentsCount: 0,
          lastUpdated: c.updated_at,
          isPublished: c.is_published
        }));

        setCourses(mappedCourses);
      } catch (e) {
        console.error('Error fetching courses:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCourses();
  }, [currentUser]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {strings.myCourses}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Управляйте своими курсами и создавайте новые
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center relative">
             <Search className="w-4 h-4 absolute left-3 text-slate-400" />
             <input 
               type="text" 
               placeholder="Поиск курса..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 w-64"
             />
           </div>
           
           <Link href="/author/courses/new">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              {strings.createCourse}
            </Button>
          </Link>
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <Plus className="w-8 h-8 text-primary-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {courses.length === 0 ? strings.noCourses : 'Курсы не найдены'}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {courses.length === 0 ? strings.noCoursesDescription : `По запросу "${searchQuery}" ничего не найдено.`}
          </p>
          <Link href="/author/courses/new">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 border-none rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              {strings.createCourse}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userRole="author"
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
