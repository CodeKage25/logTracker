const fs = require('fs');
const os = require('os');

class LogTracker {
  constructor(logToFile = false, logFilePath = 'app.log') {
    this.logToFile = logToFile;
    this.logFilePath = logFilePath;

    this.logLevel = 'info'; // Default log level
    this.logFormat = '{timestamp} [{level}] {message}'; // Default log format
    this.monitoringInterval = 5000; // Default monitoring interval (in milliseconds)

    this.monitoringEnabled = false;
    this.monitoringIntervalId = null;
  }

  setLogLevel(logLevel) {
    this.logLevel = logLevel;
  }

  setLogFormat(logFormat) {
    this.logFormat = logFormat;
  }

  startLogging() {
    this.logToFile && this.createLogFile();

    // Override console methods to handle logging
    console._log = console.log;
    console._info = console.info;
    console._warn = console.warn;
    console._error = console.error;

    console.log = this.log.bind(this, 'info');
    console.info = this.log.bind(this, 'info');
    console.warn = this.log.bind(this, 'warning');
    console.error = this.log.bind(this, 'error');
  }

  stopLogging() {
    // Restore original console methods
    console.log = console._log;
    console.info = console._info;
    console.warn = console._warn;
    console.error = console._error;

    // Stop monitoring (if enabled)
    this.stopMonitoring();
  }

  log(level, ...args) {
    if (this.isLogLevelEnabled(level)) {
      const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
      const timestamp = new Date().toISOString();
      const formattedLog = this.logFormat.replace('{timestamp}', timestamp).replace('{level}', level.toUpperCase()).replace('{message}', message);

      console._log(formattedLog);

      if (this.logToFile) {
        fs.appendFile(this.logFilePath, formattedLog + '\n', (err) => {
          if (err) {
            console.error('Error writing to log file:', err);
          }
        });
      }
    }
  }

  isLogLevelEnabled(level) {
    const logLevels = ['info', 'warning', 'error'];
    return logLevels.indexOf(level) >= logLevels.indexOf(this.logLevel);
  }

  createLogFile() {
    fs.writeFile(this.logFilePath, '', (err) => {
      if (err) {
        console.error('Error creating log file:', err);
      }
    });
  }

  startMonitoring() {
    if (!this.monitoringEnabled) {
      this.monitoringEnabled = true;
      this.monitoringIntervalId = setInterval(() => this.logMetrics(), this.monitoringInterval);
    }
  }

  stopMonitoring() {
    if (this.monitoringEnabled) {
      clearInterval(this.monitoringIntervalId);
      this.monitoringEnabled = false;
    }
  }

  logMetrics() {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsagePercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
  
    this.log('info', {
      timestamp: new Date().toISOString(),
      cpuUsage,
      memoryUsage,
      memoryUsagePercentage
    });
  }
  
}

// Create an instance of the custom logging and monitoring module
const logTracker = new LogTracker();

module.exports = logTracker