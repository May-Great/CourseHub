import { createClient } from '@/lib/supabase/client';

export interface LessonProgress {
  lesson_id: string;
  is_completed: boolean;
}

export const progressService = {
  // Получить прогресс по всем урокам курса для текущего пользователя
  async getCourseProgress(courseId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id, is_completed')
      .eq('course_id', courseId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }

    return data as LessonProgress[];
  },

  // Отметить урок как пройденный (или наоборот)
  async toggleLessonCompletion(courseId: string, lessonId: string, isCompleted: boolean) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Используем upsert: если записи нет - создаст, если есть - обновит
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        is_completed: isCompleted,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id, lesson_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      throw error;
    }

    return data;
  },

  // Вычислить процент прохождения курса (локально, на основе списка уроков и прогресса)
  calculateProgressPercentage(totalLessons: number, completedLessons: number): number {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  }
};
