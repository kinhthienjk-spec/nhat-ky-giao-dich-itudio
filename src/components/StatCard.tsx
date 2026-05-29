import { ReactNode } from 'react';

interface StatCardProps {
  id: string;
  label: string;
  value: string | number;
  highlightColor?: 'emerald' | 'rose' | 'indigo' | 'slate';
  icon: ReactNode;
  iconBgColor: string;
  sparklineType?: 'down-rose' | 'flat-up-blue' | 'down-flat-rose' | 'none';
  dots?: { activeCount: number; colorClass: string; max?: number };
}

export default function StatCard({
  id,
  label,
  value,
  highlightColor = 'indigo',
  icon,
  iconBgColor,
  sparklineType = 'none',
  dots,
}: StatCardProps) {
  
  // Decide value styling
  let valueColor = 'text-[#131b2e]';
  if (highlightColor === 'emerald') {
    valueColor = 'text-emerald-600 font-bold';
  } else if (highlightColor === 'rose') {
    valueColor = 'text-rose-600 font-bold';
  }

  return (
    <div 
      id={id}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 hover:shadow-[0_6px_24px_rgba(4,4,10,0.06)] transition-all duration-300 flex flex-col justify-between h-[125px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider text-[#464555] uppercase">
            {label}
          </span>
          <span className={`text-2xl font-extrabold mt-1 tracking-tight ${valueColor}`}>
            {value}
          </span>
        </div>
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center`}
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-2 flex items-center">
        {/* Sparkline graphics */}
        {sparklineType === 'down-rose' && (
          <svg className="w-full h-6 overflow-visible" viewBox="0 0 160 24" fill="none">
            <path
              d="M 5 8 Q 40 10, 80 16 T 155 18"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="155" cy="18" r="3" fill="#f43f5e" />
          </svg>
        )}

        {sparklineType === 'flat-up-blue' && (
          <svg className="w-full h-6 overflow-visible" viewBox="0 0 160 24" fill="none">
            <path
              d="M 5 18 Q 40 17, 80 15 T 155 13"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="155" cy="13" r="3" fill="#6366f1" />
          </svg>
        )}

        {sparklineType === 'down-flat-rose' && (
          <svg className="w-full h-6 overflow-visible" viewBox="0 0 160 24" fill="none">
            <path
              d="M 5 8 Q 50 16, 100 15 T 155 17"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="155" cy="17" r="3" fill="#f43f5e" />
          </svg>
        )}

        {/* Progress dots (streaks) */}
        {dots && (
          <div className="flex items-center gap-1.5 mt-1">
            {Array.from({ length: dots.max || 5 }).map((_, idx) => {
              const isActive = idx < dots.activeCount;
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? dots.colorClass : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
