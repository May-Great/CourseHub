'use client';

import { useState } from 'react';
import { mockCohorts, mockMessages } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';

export default function AuthorMessages() {
  const [selectedCohortId, setSelectedCohortId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  
  const { chatMessages, addChatMessage } = useAppStore();
  
  const selectedCohort = mockCohorts.find(c => c.id === selectedCohortId);
  const cohortMessages = [...mockMessages, ...chatMessages].filter(m => m.cohortId === selectedCohortId);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCohortId) return;
    
    const message = {
      id: `msg_${Date.now()}`,
      userId: 'author-1',
      userName: 'Анна Петрова',
      message: newMessage,
      timestamp: new Date().toISOString(),
      cohortId: selectedCohortId,
      type: 'message' as const,
    };
    
    addChatMessage(message);
    setNewMessage('');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {strings.messages}
        </h1>
        <p className="text-gray-600 mt-2">
          Общайтесь со студентами в потоках ваших курсов
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Cohorts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Потоки</h2>
          
          <div className="space-y-2">
            {mockCohorts.map((cohort) => {
              const unreadCount = cohortMessages.filter(m => m.cohortId === cohort.id).length;
              
              return (
                <button
                  key={cohort.id}
                  onClick={() => setSelectedCohortId(cohort.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCohortId === cohort.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{cohort.title}</p>
                      <p className="text-xs text-gray-500">
                        {cohort.participants.length} участников
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {selectedCohort ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{selectedCohort.title}</h3>
                <p className="text-sm text-gray-500">
                  {selectedCohort.participants.length} участников
                </p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cohortMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-gray-500">
                      Пока нет сообщений в этом потоке
                    </p>
                  </div>
                ) : (
                  cohortMessages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm font-semibold">
                          {message.userName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {message.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={strings.typeMessage}
                  />
                  <Button onClick={handleSendMessage}>
                    {strings.send}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Выберите поток
                </h3>
                <p className="text-gray-600">
                  Выберите поток слева, чтобы начать общение со студентами
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}