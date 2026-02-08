export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center font-sans tracking-tight select-none ${className}`}>
      <span className="text-slate-900 font-semibold text-2xl mr-1">Course</span>
      <div className="bg-[#3b82f6] text-white px-2 py-0.5 rounded-md font-semibold text-2xl flex items-center justify-center">
        Hub
      </div>
    </div>
  );
}
