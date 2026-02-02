import React, { useRef } from 'react';
import { Course, User } from '@/lib/types';
import { Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateProps {
  course: Course;
  user: User;
  completionDate: string;
}

export const Certificate: React.FC<CertificateProps> = ({ course, user, completionDate }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = certificateRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore event listeners
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="flex gap-4">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Скачать PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          <Share2 className="w-4 h-4" />
          Поделиться
        </button>
      </div>

      <div className="w-full overflow-x-auto pb-8">
        <div 
          ref={certificateRef}
          className="min-w-[800px] w-full max-w-4xl aspect-[1.414/1] bg-white relative p-12 shadow-lg border-8 border-double border-slate-200 text-center flex flex-col items-center justify-between mx-auto"
          style={{ fontFamily: 'serif' }}
        >
          {/* Border Decoration */}
          <div className="absolute inset-4 border-2 border-slate-900 pointer-events-none" />
          <div className="absolute inset-6 border border-slate-400 pointer-events-none" />

        {/* Header */}
        <div className="mt-8 space-y-4 relative z-10">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 uppercase tracking-widest">Сертификат</h1>
          <p className="text-xl text-slate-500 uppercase tracking-wide">об окончании курса</p>
        </div>

        {/* Content */}
        <div className="space-y-6 relative z-10 my-8">
          <p className="text-lg text-slate-600">Настоящим подтверждается, что</p>
          <h2 className="text-4xl font-bold text-indigo-900 italic font-serif px-8 py-2 border-b border-slate-200 inline-block min-w-[400px]">
            {user.name}
          </h2>
          <p className="text-lg text-slate-600 mt-4">успешно прошел(ла) курс</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 max-w-2xl mx-auto leading-tight">
            {course.title}
          </h3>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end mt-12 px-12 relative z-10">
          <div className="text-left">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            <p className="text-sm text-slate-500 font-sans">Дата выдачи</p>
            <p className="text-lg font-medium font-sans">{new Date(completionDate).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-indigo-900 rounded-full flex items-center justify-center rotate-12 mb-4 opacity-80">
              <span className="text-xs font-bold text-indigo-900 uppercase transform -rotate-12 text-center leading-none">
                Course<br/>Hub<br/>Verified
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="w-48 border-b border-slate-400 mb-2 flex justify-end">
              <span className="font-dancing-script text-2xl pr-4 italic text-slate-800">{course.authorName}</span>
            </div>
            <p className="text-sm text-slate-500 font-sans">Преподаватель</p>
            <p className="text-lg font-medium font-sans">{course.authorName}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
