'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCourseStore } from '@/lib/stores';
import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AuthorCourses() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { courses, initialize } = useCourseStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
           {/* Search Bar Placeholder */}
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
           
           <Button variant="outline" className="hidden md:flex">
             <Filter className="w-4 h-4 mr-2" />
             Фильтры
           </Button>

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
