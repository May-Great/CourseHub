'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/Button';
import { Star, Loader2, Send, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
}

interface CourseReviewsProps {
  courseId: string;
  progressPercentage?: number; // Passed from parent to check eligibility
}

export function CourseReviews({ courseId, progressPercentage = 0 }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuthStore();
  
  // New review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            user:profiles(full_name, avatar_url)
          `)
          .eq('course_id', courseId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setReviews(data.map((r: any) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            user: {
              name: r.user?.full_name || 'Пользователь',
              avatar_url: r.user?.avatar_url
            }
          })));
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [courseId, supabase]);

  const handleSubmit = async () => {
    if (!currentUser || rating === 0) return;
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          course_id: courseId,
          user_id: currentUser.id,
          rating,
          comment
        })
        .select(`
            id,
            rating,
            comment,
            created_at,
            user:profiles(full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      if (data) {
        const newReview: Review = {
          id: data.id,
          rating: data.rating,
          comment: data.comment,
          created_at: data.created_at,
          user: {
            name: currentUser.name || 'Я',
            avatar_url: currentUser.avatar
          }
        };
        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment('');
      }
    } catch (e) {
      console.error('Error submitting review:', e);
      alert('Ошибка при отправке отзыва. Возможно, вы еще не купили курс?');
    } finally {
      setSubmitting(false);
    }
  };

  const canReview = progressPercentage >= 30;
  const userHasReview = reviews.some(r => r.user.name === currentUser?.name); // Simple check, better use ID if available in review object

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-slate-900">Отзывы студентов ({reviews.length})</h3>
      
      {/* Review Form */}
      {currentUser && !userHasReview && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          {!canReview ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-500">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">Оставьте отзыв позже</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Чтобы оставить честный отзыв, пройдите хотя бы 30% курса. 
                Ваш текущий прогресс: <span className="font-bold text-primary-600">{progressPercentage}%</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Ваше мнение о курсе</h4>
              
              {/* Rating Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8 transition-colors",
                        star <= (hoverRating || rating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-slate-300"
                      )} 
                    />
                  </button>
                ))}
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Что вам понравилось? Что можно улучшить?"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none min-h-[100px] resize-y text-sm"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={rating === 0 || submitting}
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Отправить отзыв
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-500 italic">
          Пока нет отзывов. Станьте первым!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-slate-100 last:border-0">
              <UserAvatar user={review.user} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">{review.user.name}</span>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ru })}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4", 
                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      )} 
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
