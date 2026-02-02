import React from 'react';
import { useCartStore, useAppStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, PlayCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Course } from '@/lib/types';

interface EnrollButtonProps {
  course: Course;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const EnrollButton: React.FC<EnrollButtonProps> = ({ 
  course, 
  className, 
  variant = 'primary',
  size = 'md'
}) => {
  const { purchasedCourses } = useAppStore();
  const { addItem, isInCart, setIsOpen } = useCartStore();
  const router = useRouter();

  const isPurchased = purchasedCourses.includes(course.id);
  const inCart = isInCart(course.id);

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isPurchased) {
      router.push(`/buyer/courses/${course.id}`);
    } else {
      if (!inCart) {
        addItem({
          courseId: course.id,
          title: course.title,
          price: course.price,
          thumbnail: course.thumbnail
        });
      } else {
        setIsOpen(true);
      }
    }
  };

  if (isPurchased) {
    return (
      <Button 
        onClick={handleAction} 
        variant="secondary" 
        size={size}
        className={`bg-emerald-100 text-emerald-700 hover:bg-emerald-200 ${className}`}
      >
        <PlayCircle className="w-4 h-4 mr-2" />
        Продолжить
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAction} 
      variant={variant}
      size={size}
      className={className}
    >
      {inCart ? (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзине
        </>
      ) : (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Купить за {course.price.toLocaleString('ru-RU')} ₽
        </>
      )}
    </Button>
  );
};
