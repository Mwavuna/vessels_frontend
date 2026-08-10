import { Gauge, Thermometer, AlertTriangle, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: Gauge },
    { id: 'sensors', label: 'Sensors', Icon: Thermometer },
    { id: 'faults', label: 'Faults', Icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#101A24]/95 backdrop-blur-xl border-t border-white/10 flex-shrink-0">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-95"
            >
              <div className={`transition-all ${isActive ? 'text-[#00D1FF]' : 'text-white/50'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] transition-all ${isActive ? 'text-[#00D1FF] font-medium' : 'text-white/50'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
