import { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, ChevronDown, Trash2 } from 'lucide-react';
import { Alert, Fault } from '../types';

interface FaultsProps {
  faults: Fault[];
  alerts: Alert[];
  onClearFault?: (id?: string) => void;
  onInjectFault?: (type: string) => void;
  onAcknowledgeAlert?: (id: string) => void;
  onClearAlerts?: () => void;
}

export function Faults({ faults, alerts, onClearFault, onAcknowledgeAlert, onClearAlerts }: FaultsProps) {
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  const activeAlerts = useMemo(() => {
    return alerts
      .filter((alert) => alert.active && alert.status !== 'RESOLVED')
      .map((alert) => ({
        id: alert.id,
        faultId: alert.faultId,
        title: alert.message,
        severity: alert.active ? 'warning' : 'resolved',
        status: alert.status || 'OPEN',
        source: alert.deviceId,
        time: alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : 'now',
        description: alert.message,
        action: alert.active ? 'Investigate the underlying fault' : 'No action required',
      }));
  }, [alerts]);

  const recentHistory = useMemo(() => {
    return alerts
      .filter((alert) => !alert.active || alert.status === 'RESOLVED')
      .slice(0, 10)
      .map((alert) => ({
        id: alert.id,
        title: alert.message.replace(/_/g, ' '),
        severity: 'resolved',
        source: alert.deviceId,
        time: alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : 'now',
        description: alert.message,
        resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleTimeString() : 'Recently'
      }));
  }, [alerts]);

  const activeAlertsCount = activeAlerts.length;
  const criticalCount = faults.filter(f => f.active && f.severity === 'high').length;
  const resolvedCount = alerts.filter(a => !a.active || a.status === 'RESOLVED').length;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-[#FF4D4D]/10',
          border: 'border-[#FF4D4D]/30',
          text: 'text-[#FF4D4D]',
          icon: AlertTriangle,
          label: 'Critical',
          glow: 'shadow-[0_0_20px_rgba(255,77,77,0.3)]'
        };
      case 'warning':
        return {
          bg: 'bg-[#FF9F43]/10',
          border: 'border-[#FF9F43]/30',
          text: 'text-[#FF9F43]',
          icon: AlertCircle,
          label: 'Warning',
          glow: 'shadow-[0_0_15px_rgba(255,159,67,0.2)]'
        };
      case 'resolved':
        return {
          bg: 'bg-white/5',
          border: 'border-white/10',
          text: 'text-[#2ECC71]',
          icon: CheckCircle,
          label: 'Resolved',
          glow: ''
        };
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/10',
          text: 'text-white/70',
          icon: AlertCircle,
          label: 'Info',
          glow: ''
        };
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-white/90">Fault Monitor</h1>
          <p className="text-sm text-white/50">Active alerts and history</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#FF9F43]/10 border border-[#FF9F43]/30 rounded-[16px] p-3 text-center">
          <p className="text-[#FF9F43]" style={{ fontSize: '30px' }}>{activeAlertsCount}</p>
          <p className="text-[10px] text-white/60 uppercase mt-1">Active</p>
        </div>
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-[16px] p-3 text-center">
          <p className="text-[#FF4D4D]" style={{ fontSize: '30px' }}>{criticalCount}</p>
          <p className="text-[10px] text-white/60 uppercase mt-1">Critical</p>
        </div>
        <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-[16px] p-3 text-center">
          <p className="text-[#2ECC71]" style={{ fontSize: '30px' }}>{resolvedCount}</p>
          <p className="text-[10px] text-white/60 uppercase mt-1">Resolved</p>
        </div>
      </div>

      {activeAlertsCount > 0 && onClearFault && (
        <button
          onClick={() => onClearFault()}
          className="w-full bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-[16px] py-2.5 text-[#2ECC71] text-xs font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <CheckCircle size={14} /> Clear All Active Faults & Alerts
        </button>
      )}

      {activeAlertsCount === 0 && (
        <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-[16px] p-4 flex items-center gap-3">
          <CheckCircle size={22} className="text-[#2ECC71]" />
          <div>
            <p className="text-[#2ECC71] text-sm font-medium">All Systems Operational</p>
            <p className="text-white/50 text-xs mt-0.5">No active faults or unhandled alerts detected.</p>
          </div>
        </div>
      )}

      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-white/90 text-sm uppercase tracking-wider">Active Alerts</h2>
          {activeAlerts.map((fault) => {
            const config = getSeverityConfig(fault.severity);
            const Icon = config.icon;
            const isExpanded = expandedFault === fault.id;

            return (
              <div
                key={fault.id}
                className={`w-full ${config.bg} border ${config.border} ${config.glow} rounded-[16px] p-4 text-left transition-all`}
              >
                <div
                  onClick={() => setExpandedFault(isExpanded ? null : fault.id)}
                  className="cursor-pointer flex items-start gap-3"
                >
                  <Icon size={20} className={`${config.text} flex-shrink-0 mt-0.5 ${fault.severity === 'warning' ? 'animate-pulse' : ''}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`${config.text} font-medium text-sm`}>{fault.title}</p>
                      <ChevronDown
                        size={16}
                        className={`text-white/30 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{fault.time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${fault.status === 'ACKNOWLEDGED' ? 'bg-[#00D1FF]/20 text-[#00D1FF]' : 'bg-[#FF9F43]/20 text-[#FF9F43]'}`}>
                        {fault.status || 'OPEN'}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">{fault.source}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    <div>
                      <p className="text-white/50 text-[10px] uppercase mb-1">Description</p>
                      <p className="text-white/80 text-xs">{fault.description}</p>
                    </div>

                    <div>
                      <p className="text-white/50 text-[10px] uppercase mb-1">Recommended Action</p>
                      <p className="text-white/80 text-xs">{fault.action}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onClearFault) onClearFault(fault.faultId || fault.id);
                        }}
                        className="bg-[#2ECC71]/20 hover:bg-[#2ECC71]/30 border border-[#2ECC71]/40 rounded-lg py-2 text-[#2ECC71] text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle size={12} /> Resolve & Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onAcknowledgeAlert) onAcknowledgeAlert(fault.id);
                        }}
                        className="bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 border border-[#00D1FF]/40 rounded-lg py-2 text-[#00D1FF] text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Clock size={12} /> Acknowledge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {recentHistory.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white/90 text-sm uppercase tracking-wider">Recent History</h2>
            {onClearAlerts && (
              <button
                type="button"
                onClick={() => onClearAlerts()}
                className="text-white/40 hover:text-white/80 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} /> Clear History
              </button>
            )}
          </div>
          {recentHistory.map((fault) => {
            const config = getSeverityConfig(fault.severity);
            const Icon = config.icon;

            return (
              <div
                key={fault.id}
                className={`${config.bg} border ${config.border} rounded-[16px] p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`${config.text} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-white/90 font-medium text-sm mb-1">{fault.title}</p>
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <Clock size={12} />
                      <span>{fault.time}</span>
                      <span>•</span>
                      <span className={config.text}>Resolved {fault.resolvedAt}</span>
                    </div>
                    <p className="text-white/60 text-xs">{fault.source}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
