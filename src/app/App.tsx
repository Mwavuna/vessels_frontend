import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Sensors } from './components/Sensors';
import { Faults } from './components/Faults';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { BottomNav } from './components/BottomNav';
import { useTelemetrySocket } from './hooks/useTelemetrySocket';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const telemetryState = useTelemetrySocket();

  return (
    <div className="min-h-screen bg-[#050B12] flex items-center justify-center p-4">
      {/* Mobile Container - Simulates iPhone/Android device */}
      <div className="w-full max-w-[390px] h-[844px] bg-[#050B12] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-8 border-[#0a1520]">
        {/* Status Bar */}
        <div className="h-11 bg-[#050B12] flex items-center justify-between px-6 pt-2 flex-shrink-0">
          <span className="text-white/90 text-xs">9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0.5" y="0.5" width="15" height="11" rx="2" stroke="white" strokeOpacity="0.6"/>
              <rect x="2" y="2" width="12" height="8" rx="1" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {activeTab === 'dashboard' && <Dashboard {...telemetryState} isEdgeLive={telemetryState.isEdgeLive} onClearFault={telemetryState.clearFault} />}
          {activeTab === 'sensors' && <Sensors telemetry={telemetryState.telemetry} history={telemetryState.history} isEdgeLive={telemetryState.isEdgeLive} />}
          {activeTab === 'faults' && (
            <Faults
              faults={telemetryState.faults}
              alerts={telemetryState.alerts}
              onClearFault={telemetryState.clearFault}
              onInjectFault={telemetryState.injectFault}
              onAcknowledgeAlert={telemetryState.acknowledgeAlert}
              onClearAlerts={telemetryState.clearAlerts}
            />
          )}

          {activeTab === 'analytics' && <Analytics dashboard={telemetryState.dashboard} history={telemetryState.history} />}
          {activeTab === 'settings' && (
            <Settings
              connected={telemetryState.connected}
              isEdgeLive={telemetryState.isEdgeLive}
              onInjectFault={telemetryState.injectFault}
              onClearFault={telemetryState.clearFault}
            />
          )}
        </div>



        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
