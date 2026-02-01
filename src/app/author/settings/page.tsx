'use client';

import { Button } from '@/components/ui/Button';
import { strings } from '@/lib/strings.ru';

export default function AuthorSettings() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {strings.settings}
        </h1>
        <p className="text-gray-600 mt-2">
          Управляйте настройками профиля и платежными реквизитами
        </p>
      </div>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Профиль автора
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              defaultValue="Анна Петрова"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="anna@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              rows={3}
              defaultValue="Опытный разработчик с 8+ годами опыта в создании веб-приложений"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button>
            Сохранить профиль
          </Button>
        </div>
      </div>
      
      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Платежные реквизиты
        </h2>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💳</div>
          <p className="text-gray-500 mb-4">
            Настройка платежных реквизитов будет доступна в следующих версиях
          </p>
          <Button variant="outline">
            Настроить выплаты
          </Button>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Уведомления
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Новые студенты</p>
              <p className="text-sm text-gray-500">Уведомления о новых записях на курсы</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Сообщения в чате</p>
              <p className="text-sm text-gray-500">Уведомления о новых сообщениях</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Еженедельные отчеты</p>
              <p className="text-sm text-gray-500">Статистика по курсам и доходам</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
        
        <div className="mt-6">
          <Button>
            Сохранить настройки
          </Button>
        </div>
      </div>
    </div>
  );
}