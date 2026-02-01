import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'current' | 'completed' | 'upcoming';
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("flex", className)}>
      <ol role="list" className="flex w-full rounded-md border border-slate-200 bg-white overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative flex flex-1">
            {step.status === 'completed' ? (
              <a href="#" className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 group-hover:bg-primary-800 transition-colors">
                    <Check className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-900">{step.label}</span>
                </span>
              </a>
            ) : step.status === 'current' ? (
              <a href="#" aria-current="step" className="flex items-center px-6 py-4 text-sm font-medium">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600">
                  <span className="text-primary-600">{stepIdx + 1}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-primary-600">{step.label}</span>
              </a>
            ) : (
              <a href="#" className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-300 group-hover:border-slate-400 transition-colors">
                    <span className="text-slate-500 group-hover:text-slate-900 transition-colors">{stepIdx + 1}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">{step.label}</span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for large screens */}
                <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-slate-200"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
