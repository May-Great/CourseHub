import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];
type CourseUpdate = Database['public']['Tables']['courses']['Update'];

export const courseService = {
  // Получить все курсы автора
  async getAuthorCourses(authorId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Course[];
  },

  // Получить один курс по ID
  async getCourseById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        modules (
          *,
          lessons (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Создать новый курс
  async createCourse(courseData: CourseInsert) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  // Обновить курс
  async updateCourse(id: string, updates: CourseUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  // Удалить курс
  async deleteCourse(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
