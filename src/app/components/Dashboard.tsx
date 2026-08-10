import { useEffect, useMemo, useState } from 'react';
import { Activity, Droplet, Gauge as GaugeIcon, Fuel, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { CircularGauge } from './CircularGauge';
import { LinearIndicator } from './LinearIndicator';
import { DashboardSummary, TelemetryPacket } from '../types';

interface DashboardProps {
  telemetry: TelemetryPacket | null;
  dashboard: DashboardSummary | null;
  connected: boolean;
  isEdgeLive?: boolean;
  onClearFault?: (id?: string) => void;
}

export function Dashboard({ telemetry, dashboard, connected, isEdgeLive = false, onClearFault }: DashboardProps) {
  const [rpm, setRpm] = useState(0);
  const [temp, setTemp] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [fuelFlow, setFuelFlow] = useState(0);

  useEffect(() => {
    if (!isEdgeLive || !telemetry) {
      setRpm(0);
      setTemp(0);
      setPressure(0);
      setFuelFlow(0);
      return;
    }

    const propulsion = telemetry.subsystems?.propulsion?.engine;
    const lubrication = telemetry.subsystems?.lubrication;
    const fuel = telemetry.subsystems?.fuel?.tank;

    setRpm(propulsion?.rpm ?? 0);
    setTemp(propulsion?.temperature ?? 0);
    setPressure(lubrication?.oilPressure ?? 0);
    setFuelFlow(fuel?.consumptionRate ?? 0);
  }, [telemetry, isEdgeLive]);

  const engineHealth = useMemo(() => {
    if (!isEdgeLive || !telemetry || !dashboard) return null;
    return dashboard.overallHealth === 'good' ? 95 : dashboard.overallHealth === 'degraded' ? 78 : 62;
  }, [dashboard, telemetry, isEdgeLive]);

  const healthColor = !isEdgeLive
    ? '#FF9F43'
    : (engineHealth ?? 0) > 85
    ? '#2ECC71'
    : (engineHealth ?? 0) > 70
    ? '#FF9F43'
    : '#FF4D4D';

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-white/90">Engine Monitor</h1>
          <p className="text-sm text-white/50">Real-Time Marine Intelligence</p>
        </div>
        {!isEdgeLive && (
          <span className="bg-[#FF4D4D]/20 border border-[#FF4D4D]/40 text-[#FF4D4D] text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <WifiOff size={12} /> Disconnected
          </span>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#101A24] to-[#0E2A47] rounded-[20px] p-5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider">Engine Health</p>
            <p className="text-white mt-1" style={{ fontSize: '36px', fontVariantNumeric: 'tabular-nums' }}>
              {isEdgeLive && engineHealth !== null ? `${Math.round(engineHealth)}%` : '--'}
            </p>
          </div>
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: healthColor }}>
              <Activity size={28} style={{ color: healthColor }} />
            </div>
            {isEdgeLive && <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: healthColor }}></div>}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isEdgeLive ? 'bg-[#2ECC71] animate-pulse' : 'bg-[#FF9F43]'}`}></div>
            <span className="text-white/70 font-medium">
              {isEdgeLive
                ? (dashboard?.activeFaults ? `${dashboard.activeFaults} Active Faults` : 'All Systems Operational')
                : (connected ? 'Disconnected from edge device' : 'Connecting to Server...')}
            </span>
          </div>
          {isEdgeLive && Boolean(dashboard?.activeFaults) && onClearFault && (
            <button
              type="button"
              onClick={() => onClearFault()}
              className="bg-[#2ECC71]/20 hover:bg-[#2ECC71]/30 text-[#2ECC71] border border-[#2ECC71]/40 px-2.5 py-1 rounded-lg text-[10px] font-semibold active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle size={12} /> Clear Faults
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CircularGauge
          label="RPM"
          value={isEdgeLive ? rpm : 0}
          max={2000}
          unit=""
          color={isEdgeLive ? '#00D1FF' : '#555555'}
          icon={<GaugeIcon size={20} />}
        />
        <CircularGauge
          label="Temperature"
          value={isEdgeLive ? temp : 0}
          max={100}
          unit="°C"
          color={isEdgeLive ? (temp > 85 ? '#FF4D4D' : '#2ECC71') : '#555555'}
          icon={<Activity size={20} />}
        />
      </div>

      <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10 space-y-4">
        <LinearIndicator
          label="Oil Pressure"
          value={isEdgeLive ? pressure : 0}
          max={6}
          unit="bar"
          color={isEdgeLive ? '#00D1FF' : '#555555'}
          icon={<Droplet size={18} />}
          warningThreshold={3.8}
        />
        <LinearIndicator
          label="Fuel Flow"
          value={isEdgeLive ? fuelFlow : 0}
          max={300}
          unit="L/h"
          color={isEdgeLive ? '#2ECC71' : '#555555'}
          icon={<Fuel size={18} />}
        />
        <LinearIndicator
          label="Cooling Temp"
          value={isEdgeLive ? (telemetry?.subsystems?.cooling?.temperature ?? 0) : 0}
          max={100}
          unit="°C"
          color={isEdgeLive ? ((telemetry?.subsystems?.cooling?.temperature ?? 0) > 85 ? '#FF4D4D' : '#00D1FF') : '#555555'}
          icon={<Activity size={18} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#101A24] rounded-[16px] p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isEdgeLive ? ((telemetry?.subsystems?.lubrication?.oilPressure ?? 4.2) < 3.5 ? 'bg-[#FF4D4D]' : 'bg-[#2ECC71]') : 'bg-white/20'} ${isEdgeLive ? 'animate-pulse' : ''}`}></div>
            <span className="text-white/60 text-xs">Lubrication</span>
          </div>
          <p className="text-white text-lg">
            {isEdgeLive ? ((telemetry?.subsystems?.lubrication?.oilPressure ?? 4.2) < 3.5 ? 'Warning' : 'Normal') : 'Offline'}
          </p>
        </div>
        <div className="bg-[#101A24] rounded-[16px] p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isEdgeLive ? ((telemetry?.subsystems?.cooling?.temperature ?? 70) > 85 ? 'bg-[#FF4D4D]' : 'bg-[#2ECC71]') : 'bg-white/20'} ${isEdgeLive ? 'animate-pulse' : ''}`}></div>
            <span className="text-white/60 text-xs">Cooling</span>
          </div>
          <p className="text-white text-lg">
            {isEdgeLive ? ((telemetry?.subsystems?.cooling?.temperature ?? 70) > 85 ? 'High Temp' : 'Normal') : 'Offline'}
          </p>
        </div>
      </div>

      {isEdgeLive && (temp > 85 || (dashboard?.activeFaults ?? 0) > 0) && (
        <div className="bg-[#FF9F43]/10 border border-[#FF9F43]/30 rounded-[16px] p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle size={20} className="text-[#FF9F43] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#FF9F43] font-medium text-sm">System Warning Active</p>
              <p className="text-white/60 text-xs mt-0.5">Active subsystem fault or abnormal reading detected.</p>
            </div>
          </div>
          {onClearFault && (
            <button
              type="button"
              onClick={() => onClearFault()}
              className="bg-[#2ECC71]/20 hover:bg-[#2ECC71]/30 text-[#2ECC71] border border-[#2ECC71]/40 px-3 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <CheckCircle size={14} /> Resolve & Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
