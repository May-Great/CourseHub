import React from 'react';
import { Course, User } from '@/lib/types';

interface CertificateProps {
  course: Course;
  user: User;
  completionDate: string;
}

export function Certificate({ course, user, completionDate }: CertificateProps) {
  return (
    <div className="p-8 border-4 border-double border-slate-200 rounded-lg text-center bg-white max-w-2xl mx-auto shadow-lg">
      <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Сертификат о прохождении</h2>
      <p className="text-slate-600 mb-6">Настоящим подтверждается, что</p>
      <h3 className="text-2xl font-bold text-indigo-700 mb-6">{user.name}</h3>
      <p className="text-slate-600 mb-2">успешно прошел(ла) курс</p>
      <h4 className="text-xl font-bold text-slate-800 mb-8">{course.title}</h4>
      <div className="text-sm text-slate-500">
        Дата выдачи: {new Date(completionDate).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}
