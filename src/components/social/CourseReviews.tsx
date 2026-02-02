import React, { useState } from 'react';
import { useSocialStore } from '@/lib/stores/socialStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useProgressStore } from '@/lib/stores/progressStore';
import { Review } from '@/lib/types';
import { Star, ThumbsUp, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseReviewsProps {
  courseId: string;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const { currentUser: user } = useAuthStore();
  const { reviews, addReview, deleteReview, getCourseReviews } = useSocialStore();
  const { getUserProgress } = useProgressStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseReviews = getCourseReviews(courseId);
  const userProgress = user ? getUserProgress(user.id, courseId) : undefined;
  
  // Calculate average rating
  const averageRating = courseReviews.length > 0
    ? (courseReviews.reduce((acc, r) => acc + r.rating, 0) / courseReviews.length).toFixed(1)
    : '0.0';

  // Check eligibility
  const hasStarted = userProgress && userProgress.completedLessons.length > 0;
  const alreadyReviewed = user && courseReviews.some(r => r.userId === user.id);
  const canReview = user && hasStarted && !alreadyReviewed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Пожалуйста, войдите в систему");
      return;
    }

    if (!rating) {
      setError("Пожалуйста, поставьте оценку");
      return;
    }

    if (!content.trim()) {
      setError("Пожалуйста, напишите отзыв");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newReview: Review = {
        id: crypto.randomUUID(),
        courseId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      addReview(courseId, newReview);
      
      // Reset form
      setRating(0);
      setContent('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">{averageRating}</div>
          <div className="flex items-center gap-1 my-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                )}
              />
            ))}
          </div>
          <div className="text-sm text-slate-500">{courseReviews.length} отзывов</div>
        </div>

        <div className="flex-1 hidden sm:block border-l border-slate-200 pl-8">
            <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(score => {
                    const count = courseReviews.filter(r => r.rating === score).length;
                    const percent = courseReviews.length > 0 ? (count / courseReviews.length) * 100 : 0;
                    return (
                        <div key={score} className="flex items-center gap-2 text-sm">
                            <span className="w-3">{score}</span>
                            <Star className="w-3 h-3 text-slate-400" />
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[200px]">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-slate-400 text-xs">{count}</span>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Review Form */}
      {!user ? (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm text-center">
          Войдите, чтобы оставить отзыв
        </div>
      ) : alreadyReviewed ? (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm text-center">
          Вы уже оставили отзыв об этом курсе. Спасибо!
        </div>
      ) : !hasStarted ? (
        <div className="p-4 bg-amber-50 text-amber-700 rounded-lg text-sm text-center">
          Пройдите хотя бы один урок, чтобы оставить отзыв.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Написать отзыв</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Оценка</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8",
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Ваш комментарий</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Расскажите о ваших впечатлениях..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Отзывы ({courseReviews.length})</h3>
        {courseReviews.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Пока нет отзывов. Будьте первым!</p>
        ) : (
          courseReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-medium text-slate-600 text-lg">{review.userName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{review.userName}</div>
                    <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
