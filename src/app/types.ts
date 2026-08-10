export interface TelemetryPacket {
  deviceId: string;
  timestamp: string;
  subsystems: Record<string, any>;
}

export interface Fault {
  id: string;
  deviceId: string;
  type: string;
  subsystem: string;
  severity: 'low' | 'medium' | 'high';
  active: boolean;
  detectedAt: string;
  clearedAt?: string | null;
  details?: Record<string, any>;
}

export interface Alert {
  id: string;
  deviceId: string;
  faultId: string;
  message: string;
  active: boolean;
  status?: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string | null;
}


export interface DashboardSummary {
  deviceId: string;
  overallHealth: 'good' | 'degraded' | 'critical';
  subsystemHealth: Record<string, 'good' | 'degraded' | 'critical'>;
  activeFaults: number;
  activeAlerts: number;
  lastUpdate: string | null;
}
