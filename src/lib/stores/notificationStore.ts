import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'assignment_graded',
    title: 'Задание проверено',
    message: 'Ваше задание по модулю "React Basics" было проверено. Оценка: 95/100.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    userId: '1',
    type: 'new_message',
    title: 'Новое сообщение',
    message: 'Анна Петрова ответила на ваш комментарий к уроку "Введение в хуки".',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '3',
    userId: '1',
    type: 'deadline_reminder',
    title: 'Напоминание о дедлайне',
    message: 'До сдачи курсового проекта осталось 3 дня.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    readAt: new Date().toISOString() // Already read
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: initialNotifications,
      unreadCount: initialNotifications.filter(n => !n.readAt).length,

      addNotification: (notification) => set((state) => {
        const newNotifications = [notification, ...state.notifications];
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter(n => !n.readAt).length
        };
      }),

      markAsRead: (id) => set((state) => {
        const newNotifications = state.notifications.map(n => 
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        );
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter(n => !n.readAt).length
        };
      }),

      markAllAsRead: () => set((state) => {
        const newNotifications = state.notifications.map(n => ({ ...n, readAt: new Date().toISOString() }));
        return {
          notifications: newNotifications,
          unreadCount: 0
        };
      }),

      clearAll: () => set({ notifications: [], unreadCount: 0 })
    }),
    {
      name: 'notification-storage',
    }
  )
);
