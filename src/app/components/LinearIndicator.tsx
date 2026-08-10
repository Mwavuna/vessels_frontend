import { ReactNode } from 'react';

interface LinearIndicatorProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: ReactNode;
  warningThreshold?: number;
}

export function LinearIndicator({ label, value, max, unit, color, icon, warningThreshold }: LinearIndicatorProps) {
  const percentage = (value / max) * 100;
  const isWarning = warningThreshold && value < warningThreshold;
  const displayColor = isWarning ? '#FF9F43' : color;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-white/70">{icon}</div>
          <span className="text-white/60 text-xs uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-white text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value.toFixed(1)} {unit}
        </span>
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: displayColor,
            boxShadow: `0 0 10px ${displayColor}60`
          }}
        />
      </div>
    </div>
  );
}
