import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Платформа для обучения и преподавания нового поколения. Создавайте курсы с AI, учитесь у лучших и развивайте карьеру.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Платформа</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/buyer/catalog" className="hover:text-blue-600 transition-colors">Каталог курсов</Link></li>
              <li><Link href="/author/courses" className="hover:text-blue-600 transition-colors">Стать автором</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Тарифы</Link></li>
              <li><Link href="/features" className="hover:text-blue-600 transition-colors">Возможности AI</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Поддержка</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/help" className="hover:text-blue-600 transition-colors">Справочный центр</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Условия использования</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Конфиденциальность</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors flex items-center"><Mail className="w-3 h-3 mr-2" /> Связаться с нами</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Будьте в курсе</h4>
            <p className="text-sm text-slate-500 mb-4">
              Подпишитесь на новости о новых курсах и обновлениях платформы.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} CourseHub Inc. Все права защищены.</p>
          <p className="flex items-center">
            Сделано с <Heart className="w-3 h-3 text-rose-500 mx-1 fill-rose-500" /> для образования
          </p>
        </div>
      </div>
    </footer>
  );
}
