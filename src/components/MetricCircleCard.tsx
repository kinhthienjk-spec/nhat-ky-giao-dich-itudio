import { ReactNode } from 'react';

interface MetricCircleCardProps {
  id: string;
  label: string;
  value: string;
  valueColorClass: string;
  icon: ReactNode;
  iconBgColor: string;
}

export default function MetricCircleCard({
  id,
  label,
  value,
  valueColorClass,
  icon,
  iconBgColor,
}: MetricCircleCardProps) {
  return (
    <div 
      id={id}
      className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 flex-1 flex flex-col justify-between min-h-[110px] hover:shadow-[0_6px_24px_rgba(4,4,10,0.06)] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold text-slate-500 tracking-wide">
          {label}
        </span>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
      <div>
        <span className={`text-[25px] font-extrabold tracking-tight ${valueColorClass}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
