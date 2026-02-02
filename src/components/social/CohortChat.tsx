import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/stores/chatStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { ChatMessage } from '@/lib/types';
import { Send, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CohortChatProps {
  courseId: string;
  cohortId?: string; // Optional, defaults to "default-cohort-{courseId}"
  height?: string;
  className?: string;
}

export const CohortChat: React.FC<CohortChatProps> = ({ 
  courseId, 
  cohortId, 
  height,
  className
}) => {
  const { currentUser: user } = useAuthStore();
  const { chatMessages, addChatMessage, getCohortMessages, getCourseMessages } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use a default cohort ID if none provided, or fall back to course-level chat
  const activeCohortId = cohortId || `cohort-${courseId}-default`;
  
  // Get messages for this cohort
  const messages = getCohortMessages(activeCohortId);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      cohortId: activeCohortId,
      courseId: courseId,
      type: 'message'
    };
    
    addChatMessage(message);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={cn("flex flex-col bg-white rounded-xl shadow-sm border border-slate-200", className)} 
      style={{ height: height || '600px' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Чат потока</h3>
          <p className="text-xs text-slate-500">Общение с одногруппниками и преподавателями</p>
        </div>
        <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {messages.length} сообщений
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <p>Нет сообщений. Будьте первыми!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user?.id === msg.userId;
            const isSystem = msg.type === 'system';
            
            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex max-w-[80%]",
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  isMe ? "bg-indigo-100 text-indigo-700 ml-2" : "bg-slate-100 text-slate-600 mr-2"
                )}>
                  {msg.userName.charAt(0)}
                </div>
                
                <div className={cn(
                  "p-3 rounded-2xl text-sm",
                  isMe 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-slate-100 text-slate-800 rounded-tl-none"
                )}>
                  {!isMe && <div className="text-xs font-semibold mb-1 opacity-70">{msg.userName}</div>}
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <div className={cn(
                    "text-[10px] mt-1 text-right opacity-70",
                    isMe ? "text-indigo-100" : "text-slate-400"
                  )}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
