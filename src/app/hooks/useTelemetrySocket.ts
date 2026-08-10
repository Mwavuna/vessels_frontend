import { useEffect, useRef, useState } from 'react';
import { Alert, DashboardSummary, Fault, TelemetryPacket } from '../types';

const WS_URL = import.meta.env.VITE_SERVER_WS_URL ?? 'ws://localhost:4000/ws';
const API_URL = import.meta.env.VITE_SERVER_API_URL ?? 'http://localhost:4000/api';

export function useTelemetrySocket() {
  const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null);
  const [history, setHistory] = useState<TelemetryPacket[]>([]);
  const [faults, setFaults] = useState<Fault[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [connected, setConnected] = useState(false);
  const [isEdgeLive, setIsEdgeLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const lastTelemetryTimeRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    // Check if live telemetry stream ticks have stopped (> 3500ms since last packet)
    const liveCheckInterval = setInterval(() => {
      if (!isMounted) return;
      const now = Date.now();
      const timeSinceLast = now - lastTelemetryTimeRef.current;
      if (lastTelemetryTimeRef.current > 0 && timeSinceLast > 3500) {
        setIsEdgeLive(false);
      }
    }, 1000);

    function connect() {
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      try {
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const message = JSON.parse(event.data);
            switch (message.type) {
              case 'init':
                if (message.payload.telemetry) {
                  setTelemetry(message.payload.telemetry);
                  lastTelemetryTimeRef.current = Date.now();
                  setIsEdgeLive(true);
                }
                if (message.payload.history?.length) setHistory(message.payload.history);
                setFaults(message.payload.faults ?? []);
                setAlerts(message.payload.alerts ?? []);
                if (message.payload.dashboard) setDashboard(message.payload.dashboard);
                break;
              case 'telemetry':
                lastTelemetryTimeRef.current = Date.now();
                setTelemetry(message.payload);
                setIsEdgeLive(true);
                setHistory((prev) => {
                  const updated = [...prev, message.payload];
                  return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
                });
                break;
              case 'fault':
                setFaults(message.payload ?? []);
                break;
              case 'alert':
                setAlerts(message.payload.active ?? []);
                break;
              case 'dashboard':
                if (message.payload) setDashboard(message.payload);
                break;
              default:
                break;
            }
          } catch (err) {
            console.error('Unable to parse websocket message', err);
          }
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setError('Websocket connecting...');
          setConnected(false);
          setIsEdgeLive(false);
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setConnected(false);
          setIsEdgeLive(false);
          socketRef.current = null;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connect();
          }, 3000);
        };
      } catch (e) {
        if (!isMounted) return;
        setConnected(false);
        setIsEdgeLive(false);
        socketRef.current = null;
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMounted) connect();
        }, 3000);
      }
    }

    connect();

    return () => {
      isMounted = false;
      clearInterval(liveCheckInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const sendWs = (msg: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(msg));
      } catch (e) {
        console.error('Failed to send websocket message', e);
      }
    }
  };

  const injectFault = async (type: string) => {
    sendWs({ type: 'inject_fault', payload: { type, vesselId: 'MV001' } });
    try {
      await fetch(`${API_URL}/faults/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, vesselId: 'MV001' })
      });
    } catch (err) {
      console.error('Failed to inject fault via HTTP', err);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    sendWs({ type: 'acknowledge_alert', payload: { id } });
    try {
      await fetch(`${API_URL}/faults/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Failed to acknowledge alert via HTTP', err);
    }
  };

  const clearFault = async (id?: string) => {
    sendWs({ type: 'clear_fault', payload: { id, vesselId: 'MV001' } });
    try {
      await fetch(`${API_URL}/faults/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, vesselId: 'MV001' })
      });
    } catch (err) {
      console.error('Failed to clear fault via HTTP', err);
    }
  };

  const clearAlerts = async () => {
    sendWs({ type: 'clear_alerts', payload: {} });
    try {
      await fetch(`${API_URL}/alerts/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Failed to clear alert history via HTTP', err);
    }
  };

  return { telemetry, history, faults, alerts, dashboard, connected, isEdgeLive, error, injectFault, clearFault, acknowledgeAlert, clearAlerts };
}
