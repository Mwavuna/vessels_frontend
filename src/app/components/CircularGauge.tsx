import { ReactNode } from 'react';

interface CircularGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: ReactNode;
}

export function CircularGauge({ label, value, max, unit, color, icon }: CircularGaugeProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3 self-start">
        <div className="text-white/70">{icon}</div>
        <span className="text-white/60 text-xs uppercase tracking-wider">{label}</span>
      </div>

      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(value)}
          </span>
          <span className="text-xs text-white/50">{unit}</span>
        </div>
      </div>
    </div>
  );
}
