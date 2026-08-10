import { useState, useMemo } from 'react';
import { Thermometer, Gauge, Droplet, Wind, Flame, ChevronRight, WifiOff } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TelemetryPacket } from '../types';

interface SensorsProps {
  telemetry: TelemetryPacket | null;
  history?: TelemetryPacket[];
  isEdgeLive?: boolean;
}

export function Sensors({ telemetry, history = [], isEdgeLive = false }: SensorsProps) {
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const sensors = useMemo(() => {
    if (!isEdgeLive || !telemetry) {
      return [
        { id: 'temp', name: 'Engine Temperature', value: '--', unit: '°C', status: 'offline', icon: <Thermometer size={20} />, color: '#555555', data: [0, 0] },
        { id: 'pressure', name: 'Oil Pressure', value: '--', unit: 'bar', status: 'offline', icon: <Droplet size={20} />, color: '#555555', data: [0, 0] },
        { id: 'rpm', name: 'Engine Speed', value: '--', unit: 'RPM', status: 'offline', icon: <Gauge size={20} />, color: '#555555', data: [0, 0] },
        { id: 'cooling', name: 'Cooling Temperature', value: '--', unit: '°C', status: 'offline', icon: <Flame size={20} />, color: '#555555', data: [0, 0] },
        { id: 'battery', name: 'Battery Level', value: '--', unit: '%', status: 'offline', icon: <Wind size={20} />, color: '#555555', data: [0, 0] },
        { id: 'fuel-press', name: 'Fuel Tank Pressure', value: '--', unit: 'bar', status: 'offline', icon: <Droplet size={20} />, color: '#555555', data: [0, 0] }
      ];
    }

    const propulsion = telemetry.subsystems?.propulsion?.engine;
    const lubrication = telemetry.subsystems?.lubrication;
    const cooling = telemetry.subsystems?.cooling;
    const fuel = telemetry.subsystems?.fuel?.tank;

    const extractHistory = (getter: (p: TelemetryPacket) => number | undefined, defaultVal: number) => {
      if (!history.length) return [defaultVal, defaultVal];
      return history.map(p => getter(p) ?? defaultVal);
    };

    const tempSeries = extractHistory(p => p.subsystems?.propulsion?.engine?.temperature, 75);
    const pressureSeries = extractHistory(p => p.subsystems?.lubrication?.oilPressure, 4.2);
    const rpmSeries = extractHistory(p => p.subsystems?.propulsion?.engine?.rpm, 1450);
    const coolingSeries = extractHistory(p => p.subsystems?.cooling?.temperature, 70);
    const fuelPressSeries = extractHistory(p => p.subsystems?.fuel?.tank?.pressure, 4.5);
    const batterySeries = extractHistory(p => p.subsystems?.electrical?.batteryLevel, 95);

    return [
      {
        id: 'temp',
        name: 'Engine Temperature',
        value: propulsion?.temperature ?? 75,
        unit: '°C',
        status: (propulsion?.temperature ?? 75) > 85 ? 'warning' : 'normal',
        icon: <Thermometer size={20} />,
        color: (propulsion?.temperature ?? 75) > 85 ? '#FF4D4D' : '#2ECC71',
        data: tempSeries
      },
      {
        id: 'pressure',
        name: 'Oil Pressure',
        value: lubrication?.oilPressure ?? 4.2,
        unit: 'bar',
        status: (lubrication?.oilPressure ?? 4.2) < 3.5 ? 'warning' : 'normal',
        icon: <Droplet size={20} />,
        color: (lubrication?.oilPressure ?? 4.2) < 3.5 ? '#FF4D4D' : '#00D1FF',
        data: pressureSeries
      },
      {
        id: 'rpm',
        name: 'Engine Speed',
        value: propulsion?.rpm ?? 1450,
        unit: 'RPM',
        status: 'normal',
        icon: <Gauge size={20} />,
        color: '#00D1FF',
        data: rpmSeries
      },
      {
        id: 'cooling',
        name: 'Cooling Temperature',
        value: cooling?.temperature ?? 70,
        unit: '°C',
        status: (cooling?.temperature ?? 70) > 85 ? 'warning' : 'normal',
        icon: <Flame size={20} />,
        color: (cooling?.temperature ?? 70) > 85 ? '#FF4D4D' : '#FF9F43',
        data: coolingSeries
      },
      {
        id: 'battery',
        name: 'Battery Level',
        value: telemetry?.subsystems?.electrical?.batteryLevel ?? 95,
        unit: '%',
        status: (telemetry?.subsystems?.electrical?.batteryLevel ?? 95) < 20 ? 'warning' : 'normal',
        icon: <Wind size={20} />,
        color: (telemetry?.subsystems?.electrical?.batteryLevel ?? 95) < 20 ? '#FF4D4D' : '#00D1FF',
        data: batterySeries
      },
      {
        id: 'fuel-press',
        name: 'Fuel Tank Pressure',
        value: fuel?.pressure ?? 4.5,
        unit: 'bar',
        status: 'normal',
        icon: <Droplet size={20} />,
        color: '#2ECC71',
        data: fuelPressSeries
      }
    ];
  }, [telemetry, history, isEdgeLive]);

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-white/90">Sensor Monitor</h1>
          <p className="text-sm text-white/50">Real-time sensor readings</p>
        </div>
        {!isEdgeLive && (
          <span className="bg-[#FF4D4D]/20 border border-[#FF4D4D]/40 text-[#FF4D4D] text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <WifiOff size={12} /> Disconnected
          </span>
        )}
      </div>

      {!isEdgeLive && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-[16px] p-4 flex items-start gap-3">
          <WifiOff size={20} className="text-[#FF4D4D] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#FF4D4D] font-medium text-sm">Disconnected from edge device</p>
            <p className="text-white/60 text-xs mt-0.5">No live telemetry — start edge_devices to stream data.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sensors.map((sensor) => {
          const isExpanded = expandedSensor === sensor.id;
          const chartData = sensor.data.map((value, i) => ({ value, index: i }));

          return (
            <button
              key={sensor.id}
              onClick={() => isEdgeLive && setExpandedSensor(isExpanded ? null : sensor.id)}
              className={`w-full bg-[#101A24] rounded-[16px] p-4 border border-white/10 text-left transition-all ${isEdgeLive ? 'active:scale-98 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-white/70">{sensor.icon}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{sensor.name}</p>
                    <p className="text-white/50 text-xs mt-0.5">
                      {isEdgeLive ? `Last update: ${new Date().toLocaleTimeString()}` : 'Stream inactive'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {sensor.value}
                    </p>
                    <p className="text-white/50 text-xs">{sensor.unit}</p>
                  </div>
                  {isEdgeLive && (
                    <ChevronRight
                      size={20}
                      className={`text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </div>
              </div>

              {isEdgeLive && isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-xs">Historical Trend</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></div>
                      <span className="text-[#2ECC71] text-xs">Normal</span>
                    </div>
                  </div>

                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={sensor.color}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-white/50 text-[10px] uppercase">Min</p>
                      <p className="text-white text-sm">{Math.min(...sensor.data).toFixed(1)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-white/50 text-[10px] uppercase">Avg</p>
                      <p className="text-white text-sm">
                        {(sensor.data.reduce((a, b) => a + b, 0) / sensor.data.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-white/50 text-[10px] uppercase">Max</p>
                      <p className="text-white text-sm">{Math.max(...sensor.data).toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
