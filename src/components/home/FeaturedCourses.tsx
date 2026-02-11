'use client';

import { useEffect, useState } from 'react';
import { Course } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { CourseCard } from '@/components/course/CourseCard';
import { Loader2 } from 'lucide-react';

export function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const supabase = createClient();
      // Fetch 3 published courses, ordered by rating or creation date
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('rating', { ascending: false }) // Or created_at
        .limit(3);

      if (!error && data) {
        const mapped: Course[] = data.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          shortDescription: c.description || '',
          authorId: c.author_id,
          authorName: 'Автор курса', // We need to join profiles ideally, but for now placeholder
          thumbnail: c.cover_url,
          price: c.price,
          category: 'Популярное',
          modules: [],
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          studentsCount: 0,
          rating: c.rating || 5,
          tags: [],
          status: 'published',
          settings: { hasDeadlines: false, autoAdvance: false, allowLateSubmissions: false, requireSequentialProgress: false, discussionEnabled: false }
        }));
        setCourses(mapped);
      }
      setLoading(false);
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 bg-white/50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return null; // Don't show section if no courses
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {courses.map(course => (
        <CourseCard 
          key={course.id} 
          course={course} 
          showBuyButton={false} // Click goes to details
        />
      ))}
    </div>
  );
}
