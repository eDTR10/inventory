import { useState, useCallback } from 'react';
import * as logsService from '../services/logsService';

export interface LogEntry {
  user: string;
  action: string;
  date_time: string;
  changes: string;
}

export const useLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await logsService.getAllLogs();
      setLogs(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch logs';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear all logs
  const clearLogs = useCallback(async () => {
    setError(null);
    try {
      await logsService.clearAllLogs();
      setLogs([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear logs';
      setError(message);
      throw err;
    }
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    clearLogs,
  };
};

export default useLogs;
