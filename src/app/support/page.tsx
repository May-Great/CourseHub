'use client';

import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, MessageCircle, FileText, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Центр поддержки</h1>
          <p className="text-slate-500 text-lg">
            Мы здесь, чтобы помочь вам с любыми вопросами по использованию платформы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">База знаний</h3>
              <p className="text-slate-500 text-sm mb-4">
                Найдите ответы на частые вопросы в нашей документации
              </p>
              <Button variant="outline" className="w-full">
                Читать статьи
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Чат с поддержкой</h3>
              <p className="text-slate-500 text-sm mb-4">
                Общайтесь с нашей командой в реальном времени
              </p>
              <Button variant="outline" className="w-full">
                Начать чат
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-slate-500 text-sm mb-4">
                Отправьте нам письмо, и мы ответим в течение 24 часов
              </p>
              <Button variant="outline" className="w-full">
                Написать письмо
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Часто задаваемые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              'Как создать свой первый курс?',
              'Как настроить выплаты?',
              'Могу ли я вернуть деньги за курс?',
              'Как связаться с автором курса?'
            ].map((question, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="font-medium text-slate-900">{question}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
