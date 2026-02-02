import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line'; // Simplified line chart using bars for now or SVG later
  valuePrefix?: string;
  height?: number;
  className?: string;
}

export function SimpleChart({ title, data, type = 'bar', valuePrefix = '', height = 200, className }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-2 sm:space-x-4 w-full" style={{ height: `${height}px` }}>
          {data.map((point, index) => {
            const heightPercent = (point.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                  {valuePrefix}{point.value.toLocaleString()}
                </div>
                
                {/* Bar */}
                <div 
                  className={cn(
                    "w-full rounded-t-md transition-all duration-500 ease-out relative overflow-hidden",
                    point.color || "bg-primary-500 hover:bg-primary-600"
                  )}
                  style={{ height: `${heightPercent}%` }}
                >
                    {/* Gradient overlay for shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                
                {/* Label */}
                <div className="mt-2 text-xs text-slate-500 font-medium truncate w-full text-center">
                  {point.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendIndicator({ value, label }: { value: number, label: string }) {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center text-sm">
      <span className={cn(
        "font-bold mr-1.5 px-1.5 py-0.5 rounded text-xs",
        isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
      )}>
        {isPositive ? '+' : ''}{value}%
      </span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}
