import { useState } from 'react';
import { useSocialStore } from '@/lib/stores/socialStore';
import { Comment } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MessageCircle, Send, User as UserIcon, Reply, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  lessonId: string;
  currentUser: { id: string; name: string; avatar?: string };
}

export function CommentSection({ lessonId, currentUser }: CommentSectionProps) {
  const { comments, addComment, addReply, deleteComment } = useSocialStore();
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const lessonComments = comments[lessonId] || [];

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      lessonId,
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    addComment(lessonId, comment);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    
    const reply: Comment = {
      id: `r-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      lessonId,
      content: replyText,
      createdAt: new Date().toISOString()
    };
    
    addReply(lessonId, parentId, reply);
    setReplyText('');
    setReplyingTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={cn("flex gap-3", isReply ? "mt-3 ml-8" : "mt-6")}>
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {comment.userAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-4 h-4 text-slate-500" />
        )}
      </div>
      <div className="flex-1">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-slate-900">{comment.userName}</span>
            <span className="text-xs text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-3 mt-1 ml-1">
          {!isReply && (
            <button 
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs font-medium text-slate-500 hover:text-primary-600 flex items-center"
            >
              <Reply className="w-3 h-3 mr-1" /> Ответить
            </button>
          )}
          {comment.userId === currentUser.id && (
            <button 
              onClick={() => deleteComment(lessonId, comment.id)}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 flex items-center"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Удалить
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Напишите ответ..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
              autoFocus
            />
            <Button size="sm" onClick={() => handleAddReply(comment.id)} className="bg-primary-600 hover:bg-primary-700 text-white">
              <Send className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-900">
          Комментарии ({lessonComments.length})
        </h3>
      </div>

      {/* Add Comment Input */}
      <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 font-bold">
          {currentUser.name[0]}
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Задайте вопрос или поделитесь мнением..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 min-h-[100px] resize-y transition-all"
          />
          <div className="absolute bottom-3 right-3">
            <Button 
              size="sm" 
              onClick={handleAddComment} 
              disabled={!newComment.trim()}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Отправить <Send className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {lessonComments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
            Пока нет комментариев. Будьте первым!
          </div>
        ) : (
          lessonComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
