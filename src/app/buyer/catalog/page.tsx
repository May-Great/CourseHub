'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CourseCard } from '@/components/course/CourseCard';
import { useStudentStore } from '@/lib/stores';
import { strings } from '@/lib/strings.ru';
import { PageShell } from '@/components/layout/PageShell';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/lib/types';

export default function BuyerCatalog() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { purchaseCourse } = useStudentStore();

  useEffect(() => {
    async function fetchPublishedCourses() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true) // Only published courses
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Map data
        const mappedCourses: Course[] = data.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          shortDescription: c.description || '',
          authorId: c.author_id,
          authorName: 'Author',
          thumbnail: c.cover_url,
          price: c.price,
          category: 'General',
          modules: [],
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          studentsCount: 0,
          rating: 5,
          tags: [],
          status: c.is_published ? 'published' : 'draft',
          settings: {
            hasDeadlines: false,
            autoAdvance: false,
            allowLateSubmissions: false,
            requireSequentialProgress: false,
            certificateEnabled: false,
            discussionEnabled: false
          }
        }));
        setCourses(mappedCourses);
      }
      setLoading(false);
    }

    fetchPublishedCourses();
  }, []);

  // Update URL when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };
  
  const categories = Array.from(new Set(courses.map(course => course.category)));
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleBuyCourse = (courseId: string) => {
    purchaseCourse(courseId);
    alert('Курс успешно добавлен в ваше обучение!');
  };
  
  return (
    <PageShell>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          {strings.catalog}
        </h1>
        <p className="text-lg text-slate-500">
          Исследуйте новые горизонты знаний. Выбирайте из сотен курсов от лучших авторов.
        </p>
      </div>
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm py-4">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-soft text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all"
            placeholder="Чему хотите научиться сегодня?"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Button 
            variant={selectedCategory === '' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('')}
            className="rounded-xl whitespace-nowrap"
          >
            Все
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-xl whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Курсы не найдены
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Мы не нашли ничего по запросу &quot;{searchQuery}&quot;. Попробуйте изменить ключевые слова или сбросить фильтры.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {setSearchQuery(''); setSelectedCategory('');}}
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                showBuyButton={true}
                onBuy={handleBuyCourse}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
