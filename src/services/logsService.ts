import axios from '../plugin/axios';

// Configuration - Load from environment variables
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '';
const LOGS_SHEET_NAME = import.meta.env.VITE_GOOGLE_LOGS_SHEET_NAME || 'logs';

// Validate required environment variables
if (!SHEET_ID) {
  console.warn('⚠️ WARNING: VITE_GOOGLE_SHEET_ID is not set! Add it to .env.local');
}

export interface LogEntry {
  user: string;
  action: string;
  date_time: string;
  changes: string;
}

interface SheetData {
  values: string[][];
  range: string;
}

/**
 * Get current user from localStorage or auth context
 */
const getCurrentUser = (): string => {
  // Get from localStorage (set during OAuth login)
  const userEmail = localStorage.getItem('user_email');
  return userEmail && userEmail.trim() ? userEmail : 'Unknown User';
};

/**
 * Convert log entry to row data
 */
const logToRow = (log: LogEntry): string[] => {
  return [
    log.user,
    log.action,
    log.date_time,
    log.changes,
  ];
};

/**
 * Add a log entry for an action
 */
export const addLog = async (
  action: string,
  changes: string,
  user?: string
): Promise<void> => {
  try {
    const logEntry: LogEntry = {
      user: user || getCurrentUser(),
      action,
      date_time: new Date().toISOString(),
      changes,
    };

    const row = logToRow(logEntry);

    await axios.post(
      `${SHEET_ID}/values/${LOGS_SHEET_NAME}:append?valueInputOption=RAW`,
      {
        values: [row],
      }
    );

    console.log('📝 Log entry added:', logEntry);
  } catch (error) {
    console.error('✗ Error adding log entry:', error);
    // Don't throw - logging failure shouldn't break the app
  }
};

/**
 * Get all log entries
 */
export const getAllLogs = async (): Promise<LogEntry[]> => {
  try {
    const response = await axios.get<SheetData>(
      `${SHEET_ID}/values/${LOGS_SHEET_NAME}?valueRenderOption=FORMATTED_VALUE`
    );

    const data = response.data.values;
    if (!data || data.length <= 1) {
      console.log('No logs found');
      return [];
    }

    // Skip header row and convert to LogEntry[]
    const logs = data.slice(1).map(row => ({
      user: row[0] || '',
      action: row[1] || '',
      date_time: row[2] || '',
      changes: row[3] || '',
    }));

    return logs;
  } catch (error) {
    console.error('✗ Error fetching logs:', error);
    throw error;
  }
};

/**
 * Initialize logs sheet with headers if empty
 */
export const initializeLogsSheet = async (): Promise<void> => {
  try {
    const response = await axios.get<SheetData>(
      `${SHEET_ID}/values/${LOGS_SHEET_NAME}`
    );

    const hasData = response.data.values && response.data.values.length > 0;

    if (!hasData) {
      const headers = [
        ['user', 'action', 'date_time', 'changes'],
      ];

      await axios.put(
        `${SHEET_ID}/values/${LOGS_SHEET_NAME}?valueInputOption=RAW`,
        {
          values: headers,
        }
      );

      console.log('✓ Logs sheet initialized with headers');
    }
  } catch (error) {
    console.error('✗ Error initializing logs sheet:', error);
    // Don't throw - this is non-critical
  }
};

/**
 * Clear all old logs (for maintenance)
 */
export const clearAllLogs = async (): Promise<void> => {
  try {
    const logs = await getAllLogs();
    if (logs.length === 0) {
      console.log('Logs are already empty');
      return;
    }

    // Delete all rows except header (rows 2 through end)
    await axios.post(
      `${SHEET_ID}/batchUpdate`,
      {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: 1, // Keep header (row 1)
                endIndex: logs.length + 1,
              },
            },
          },
        ],
      }
    );

    console.log('✓ All logs cleared');
  } catch (error) {
    console.error('✗ Error clearing logs:', error);
  }
};

export default {
  addLog,
  getAllLogs,
  initializeLogsSheet,
  clearAllLogs,
};
