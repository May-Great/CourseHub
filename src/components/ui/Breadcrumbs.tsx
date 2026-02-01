import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        
        {items.map((item, index) => (
          <li key={item.label}>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" aria-hidden="true" />
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="ml-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-2 text-sm font-medium text-slate-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
