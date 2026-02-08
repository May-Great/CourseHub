'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
  };
  className?: string;
  showName?: boolean;
}

export function UserAvatar({ user, className, showName = false }: UserAvatarProps) {
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className="h-8 w-8 border border-slate-200">
        <AvatarImage src={user.avatar_url || ''} alt={user.name || 'User'} />
        <AvatarFallback className="bg-primary-100 text-primary-700 font-medium text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900 line-clamp-1">
            {user.name || 'Пользователь'}
          </span>
        </div>
      )}
    </div>
  );
}
