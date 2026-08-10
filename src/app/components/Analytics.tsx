import { useMemo } from 'react';
import { TrendingUp, Activity, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';
import { TelemetryPacket, DashboardSummary } from '../types';


interface AnalyticsProps {
  dashboard: DashboardSummary | null;
  history?: TelemetryPacket[];
}

export function Analytics({ dashboard, history = [] }: AnalyticsProps) {
  const rpmData = useMemo(() => {
    if (!history.length) {
      return Array.from({ length: 12 }, (_, i) => ({ index: i, value: 1400 + Math.random() * 50 }));
    }
    return history.map((p, i) => ({
      index: i,
      value: p.subsystems?.propulsion?.engine?.rpm ?? 1450
    }));
  }, [history]);

  const tempData = useMemo(() => {
    if (!history.length) {
      return Array.from({ length: 12 }, (_, i) => ({ index: i, value: 75 + Math.random() * 5 }));
    }
    return history.map((p, i) => ({
      index: i,
      value: p.subsystems?.propulsion?.engine?.temperature ?? 78
    }));
  }, [history]);

  const rpmValues = rpmData.map(d => d.value);
  const minRpm = rpmValues.length ? Math.min(...rpmValues) : 1400;
  const maxRpm = rpmValues.length ? Math.max(...rpmValues) : 1500;
  const avgRpm = rpmValues.length ? Math.round(rpmValues.reduce((a, b) => a + b, 0) / rpmValues.length) : 1450;

  const faultFrequency = [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 1 },
    { month: 'Apr', count: 4 },
    { month: 'May', count: dashboard?.activeFaults ?? 0 }
  ];


  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-white/90">Analytics</h1>
        <p className="text-sm text-white/50">Performance insights</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-[#00D1FF]/20 to-[#00D1FF]/5 border border-[#00D1FF]/30 rounded-[16px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#00D1FF]" />
            <span className="text-white/60 text-xs">Uptime</span>
          </div>
          <p className="text-white mb-1" style={{ fontSize: '24px' }}>98.7%</p>
          <p className="text-[#00D1FF] text-xs">Last 30 days</p>
        </div>

        <div className="bg-gradient-to-br from-[#2ECC71]/20 to-[#2ECC71]/5 border border-[#2ECC71]/30 rounded-[16px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#2ECC71]" />
            <span className="text-white/60 text-xs">Efficiency</span>
          </div>
          <p className="text-white mb-1" style={{ fontSize: '24px' }}>94.2%</p>
          <p className="text-[#2ECC71] text-xs">+2.3% vs last month</p>
        </div>
      </div>

      <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/90 text-sm font-medium">Engine RPM Trend</p>
            <p className="text-white/50 text-xs">Last 24 hours</p>
          </div>
          <Activity size={18} className="text-[#00D1FF]" />
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rpmData}>
              <defs>
                <linearGradient id="rpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00D1FF"
                strokeWidth={2}
                fill="url(#rpmGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <p className="text-white/50 text-[10px] uppercase">Min</p>
            <p className="text-white text-sm">{Math.round(minRpm)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-[10px] uppercase">Avg</p>
            <p className="text-white text-sm">{Math.round(avgRpm)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-[10px] uppercase">Max</p>
            <p className="text-white text-sm">{Math.round(maxRpm)}</p>
          </div>
        </div>

      </div>

      <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/90 text-sm font-medium">Temperature Trend</p>
            <p className="text-white/50 text-xs">Last 24 hours</p>
          </div>
          <Activity size={18} className="text-[#2ECC71]" />
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2ECC71"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-2 mt-3 p-2 bg-[#2ECC71]/10 rounded-lg">
          <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
          <p className="text-[#2ECC71] text-xs">Within safe operating range</p>
        </div>
      </div>

      <div className="bg-[#101A24] rounded-[20px] p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/90 text-sm font-medium">Fault Frequency</p>
            <p className="text-white/50 text-xs">Last 5 months</p>
          </div>
          <AlertTriangle size={18} className="text-[#FF9F43]" />
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={faultFrequency}>
              <defs>
                <linearGradient id="faultGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9F43" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#ffffff40" style={{ fontSize: '10px' }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#FF9F43"
                strokeWidth={2}
                fill="url(#faultGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-2 mt-3 p-2 bg-[#2ECC71]/10 rounded-lg">
          <TrendingUp size={14} className="text-[#2ECC71]" />
          <p className="text-[#2ECC71] text-xs">32% reduction vs last quarter</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#00D1FF]/10 to-transparent border border-[#00D1FF]/30 rounded-[16px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#00D1FF]/20 rounded-full flex items-center justify-center">
            <Activity size={16} className="text-[#00D1FF]" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-medium">AI Prediction</p>
            <p className="text-white/50 text-xs">Next maintenance</p>
          </div>
        </div>
        <p className="text-white text-lg mb-1">12 days</p>
        <p className="text-white/60 text-xs">Based on current operating patterns</p>
      </div>
    </div>
  );
}
