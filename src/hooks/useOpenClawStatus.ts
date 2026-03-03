import { useState, useEffect, useCallback } from 'react';
import { openclawClient } from '../services/openclawClient';

type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export function useOpenClawStatus(checkIntervalMs = 60000) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');

  const checkConnection = useCallback(async () => {
    setStatus('checking');
    const isHealthy = await openclawClient.healthCheck();
    setStatus(isHealthy ? 'connected' : 'disconnected');
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, checkIntervalMs);
    return () => clearInterval(interval);
  }, [checkConnection, checkIntervalMs]);

  return { status, checkConnection };
}
