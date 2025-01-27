import { toast } from 'react-hot-toast';

interface LogEntry {
  timestamp: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

class CsvLogger {
  private logs: LogEntry[] = [];

  log(type: LogEntry['type'], message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details
    };
    
    this.logs.push(entry);
    
    if (type === 'error') {
      console.error(`[CSV ERROR] ${message}`, details || '');
      toast.error(message);
    } else {
      console.log(`[CSV ${type.toUpperCase()}] ${message}`, details || '');
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const csvLogger = new CsvLogger();