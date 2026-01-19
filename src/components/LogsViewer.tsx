import { useEffect } from 'react';
import useLogs from '../hooks/useLogs';
import { Button } from './ui/button';

export const LogsViewer = () => {
  const { logs, loading, error, fetchLogs, clearLogs } = useLogs();

  // Fetch logs on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchLogs();
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };
    initialize();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
      return;
    }

    try {
      await clearLogs();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  // Format date_time for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Format action for display
  const getActionBadgeColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
      case 'CREATE_BATCH':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <Button
          variant="outline"
          onClick={handleClearLogs}
          disabled={logs.length === 0}
          className="text-red-600 hover:text-red-700"
        >
          Clear Logs
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Logs Table */}
      <div>
        <div className="text-sm text-gray-600 mb-4">
          Total logs: {logs.length}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading logs...</p>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded border">
            <p className="text-gray-600">No activity logs yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Logs will be recorded as you perform actions on the inventory
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-4 text-left font-semibold">Date & Time</th>
                  <th className="p-4 text-left font-semibold">User</th>
                  <th className="p-4 text-left font-semibold">Action</th>
                  <th className="p-4 text-left font-semibold">Changes</th>
                </tr>
              </thead>
              <tbody>
                {/* Display logs in reverse order (newest first) */}
                {[...logs].reverse().map((log, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 last:border-b-0">
                    <td className="p-4 text-sm text-gray-700">
                      {formatDate(log.date_time)}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {log.user}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 max-w-lg">
                      <div className="bg-gray-50 p-2 rounded text-xs whitespace-pre-wrap break-words">
                        {log.changes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm font-semibold text-blue-900 mb-2">Legend:</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">CREATE</span>
            <span className="text-gray-700">New item added</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">UPDATE</span>
            <span className="text-gray-700">Item modified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">DELETE</span>
            <span className="text-gray-700">Item removed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsViewer;
