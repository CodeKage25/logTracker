const fs = require('fs');
const LogTracker = require('./logTracker');

// Mock console.log to capture logs during testing
const consoleLogMock = jest.fn();
console.log = consoleLogMock;

// Function to wait for monitoring logs to be captured
async function waitForMonitoringLogs(logTrackerInstance, timeout) {
    const logInterval = logTrackerInstance.monitoringInterval;
    const startTime = Date.now();
  
    while (Date.now() - startTime < timeout) {
      logTrackerInstance.logMetrics(); // Trigger logMetrics to capture monitoring logs
  
      // Check if the expected logs have been captured
      if (consoleLogMock.mock.calls.some(call =>
        call[0].includes('"cpuUsage"')
        && call[0].includes('"memoryUsage"')
        && call[0].includes('"memoryUsagePercentage"')
      )) {
        return;
      }
  
      await new Promise(resolve => setTimeout(resolve, logInterval));
    }
  
    // If the timeout is reached, throw an error
    throw new Error('Timeout: Monitoring logs were not captured within the specified duration.');
  }
  

describe('LogTracker', () => {
  let logTrackerInstance;

  beforeAll(() => {
    // Create a new LogTracker instance and start logging before the tests
    logTrackerInstance = new LogTracker();
    logTrackerInstance.startLogging();
  });

  afterAll(() => {
    // Stop logging after all tests are done
    logTrackerInstance.stopLogging();
  });

  afterEach(() => {
    // Cleanup any monitoring and file logging after each test
    logTrackerInstance.stopMonitoring();
    logTrackerInstance.logToFile = false;
    jest.clearAllMocks(); // Clear any accumulated mock data
  });

  it('should log messages to the console', () => {
    console.log('This is an info message.');
    console.log('Warning! Something might be wrong.');
    console.log('Error occurred:', 'Some error message.');

    // Check if the mock function was called with the expected log messages
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('This is an info message.'));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Warning! Something might be wrong.'));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('Error occurred: Some error message.'));
  });

  it('should log metrics to the console when monitoring is enabled', async () => {
    // Set a shorter monitoring interval for testing purposes
    logTrackerInstance.monitoringInterval = 1000;
  
    logTrackerInstance.startMonitoring();
  
    try {
      // Wait for a sufficient amount of time to ensure monitoring logs are captured
      await waitForMonitoringLogs(logTrackerInstance, 8000); // Wait for 8 seconds
    } catch (error) {
      // If waitForMonitoringLogs throws an error, log it and stop monitoring
      console.error(error);
      logTrackerInstance.stopMonitoring();
    }
  
    // Stop monitoring before performing assertions
    logTrackerInstance.stopMonitoring();
  
    // Check if the mock function was called with the expected metrics log
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('"cpuUsage"'));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('"memoryUsage"'));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining('"memoryUsagePercentage"'));
  }, 10000); // Increased timeout for monitoring test
  

  it('should log to a file when file logging is enabled', async () => {
    // Enable file logging by setting the logToFile property and log file path
    logTrackerInstance.logToFile = true;
    logTrackerInstance.logFilePath = 'test.log';

    // Log some messages
    console.log('This message should be logged to the file.');
    console.log('This warning should be logged to the file.');
    console.log('This error should be logged to the file.');

    // Wait for a sufficient amount of time to allow logs to be written to the file
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Read the contents of the log file and check if the messages are present
    const fileContents = fs.readFileSync('test.log', 'utf8');
    expect(fileContents).toContain('This message should be logged to the file.');
    expect(fileContents).toContain('This warning should be logged to the file.');
    expect(fileContents).toContain('This error should be logged to the file.');
  }, 5000); // Increased timeout for file logging test
});
