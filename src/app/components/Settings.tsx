import { useState } from 'react';
import { Moon, Sun, Bell, Sliders, Database, User, Info, ChevronRight, Power, Zap, RefreshCw } from 'lucide-react';

interface SettingsProps {
  connected?: boolean;
  isEdgeLive?: boolean;
  onInjectFault?: (type: string) => void;
  onClearFault?: (id?: string) => void;
}

export function Settings({ connected, isEdgeLive = false, onInjectFault, onClearFault }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  const faultTypes = [
    { label: 'High Engine Temp', type: 'HIGH_ENGINE_TEMPERATURE', color: '#FF4D4D' },
    { label: 'Low Oil Pressure', type: 'LOW_OIL_PRESSURE', color: '#FF9F43' },
    { label: 'Low Fuel Level', type: 'LOW_FUEL_LEVEL', color: '#FF9F43' },
    { label: 'High Generator Current', type: 'HIGH_GENERATOR_CURRENT', color: '#FF9F43' },
    { label: 'Low Battery Level', type: 'LOW_BATTERY', color: '#FF9F43' },
    { label: 'Cooling System Failure', type: 'COOLING_FAILURE', color: '#FF4D4D' }
  ];


  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: darkMode ? <Moon size={20} /> : <Sun size={20} />,
          label: 'Dark Mode',
          value: darkMode ? 'Enabled' : 'Disabled',
          action: () => setDarkMode(!darkMode),
          toggle: true,
          checked: darkMode
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={20} />,
          label: 'Push Notifications',
          value: notifications ? 'On' : 'Off',
          action: () => setNotifications(!notifications),
          toggle: true,
          checked: notifications
        },
        {
          icon: <Bell size={20} />,
          label: 'Critical Alerts',
          value: criticalAlerts ? 'Enabled' : 'Disabled',
          action: () => setCriticalAlerts(!criticalAlerts),
          toggle: true,
          checked: criticalAlerts
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          icon: <Sliders size={20} />,
          label: 'Sensor Calibration',
          value: 'Configure',
          hasChevron: true
        },
        {
          icon: <Database size={20} />,
          label: 'Data Refresh',
          value: '2 seconds',
          hasChevron: true
        },
        {
          icon: <Power size={20} />,
          label: 'Simulation Mode',
          value: 'Active',
          hasChevron: true
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} />,
          label: 'Profile',
          value: 'Marine Engineer',
          hasChevron: true
        },
        {
          icon: <Info size={20} />,
          label: 'About',
          value: 'v1.0.2',
          hasChevron: true
        }
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="pt-2">
        <h1 className="text-white/90">Settings</h1>
        <p className="text-sm text-white/50">Configure your preferences</p>
      </div>

      <div className="bg-gradient-to-br from-[#00D1FF]/20 to-[#0E2A47]/20 border border-[#00D1FF]/30 rounded-[20px] p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#00D1FF]/20 rounded-full flex items-center justify-center border-2 border-[#00D1FF]/50">
            <User size={28} className="text-[#00D1FF]" />
          </div>
          <div>
            <p className="text-white text-lg font-medium">John Anderson</p>
            <p className="text-white/60 text-sm">Marine Systems Engineer</p>
            <p className="text-[#00D1FF] text-xs mt-1">License: ME-2024-4512</p>
          </div>
        </div>
      </div>
      <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#FF9F43]" />
            <p className="text-white text-sm font-medium">Fault Simulation Controls</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isEdgeLive ? 'bg-[#2ECC71]/20 text-[#2ECC71]' : 'bg-[#FF4D4D]/20 text-[#FF4D4D]'}`}>
            {isEdgeLive ? 'Edge Stream Live' : 'Disconnected from edge device'}
          </span>
        </div>

        <p className="text-white/50 text-xs">Inject faults over MQTT to test end-to-end multi-layer state sync:</p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {faultTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => onInjectFault && onInjectFault(item.type)}
              className="bg-white/5 border border-white/10 hover:border-white/30 rounded-lg p-2 text-left transition-colors active:scale-95"
            >
              <p className="text-white text-xs font-medium">{item.label}</p>
              <p className="text-white/40 text-[10px] mt-0.5">Inject Fault</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => onClearFault && onClearFault()}
          className="w-full mt-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-lg py-2 text-[#2ECC71] text-xs font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <RefreshCw size={14} /> Reset All Systems to Normal
        </button>
      </div>


      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <h2 className="text-white/90 text-sm uppercase tracking-wider px-1">{section.title}</h2>
          <div className="bg-[#101A24] rounded-[16px] border border-white/10 overflow-hidden">
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors active:bg-white/5 ${
                  itemIndex !== section.items.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-white/70">{item.icon}</div>
                  <span className="text-white/90 text-sm">{item.label}</span>
                </div>

                <div className="flex items-center gap-3">
                  {item.toggle ? (
                    <div
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        item.checked ? 'bg-[#00D1FF]' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          item.checked ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-white/50 text-sm">{item.value}</span>
                      {item.hasChevron && <ChevronRight size={18} className="text-white/30" />}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center space-y-2 pt-4">
        <p className="text-white/90 font-medium">Marine Engine Monitor</p>
        <p className="text-white/50 text-xs">Real-Time Marine Intelligence</p>
        <p className="text-white/30 text-xs">Version 1.0.2 • Build 2024.05</p>
      </div>

      <button className="w-full bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-[16px] py-3 text-[#FF4D4D] text-sm font-medium active:scale-95 transition-transform">
        Sign Out
      </button>
    </div>
  );
}
