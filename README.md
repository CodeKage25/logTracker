# LogTracker

LogTracker is a simple Node.js module that provides custom logging and monitoring functionality. It allows you to log messages to the console and optionally to a log file. Additionally, it can monitor CPU and memory usage and log these metrics at a specified interval.

## Features

- Efficient logging with various log levels (info, warning, error, etc.).
- Support for logging to console and files.
- Real-time monitoring of CPU, memory, and other relevant metrics.
- Customizable log format and log rotation.
- Easy integration into your Node.js applications.

## Installation

    You can install LogTracker via npm:

    npm install log-tracker

# Usage

To use LogTracker in your Node.js application, follow these steps:

    Import the LogTracker module into your script:

    const logTracker = require('log-tracker');

Optionally, customize the log level and log format (if needed):

    logTracker.setLogLevel('info'); // Set log level to 'info', 'warning', or 'error'
    logTracker.setLogFormat('{timestamp} [{level}] {message}'); // Customize log format

Start logging:

    logTracker.startLogging();



Log messages to the console:

    console.log('This is a regular log message.');
    console.info('This is an info message.');
    console.warn('Warning! Something might be wrong.');
    console.error('Error occurred:', 'Some error message.');


Optionally, enable file logging:

    logTracker.logToFile = true; // Enable file logging
    logTracker.logFilePath = 'app.log'; // Specify the log file path


Start monitoring (if desired):

    logTracker.startMonitoring();

Optionally, customize the monitoring interval:

    logTracker.monitoringInterval = 5000; // Set the monitoring interval in milliseconds


Log metrics (CPU and memory usage) at the specified interval:

    // Metrics will be logged at the specified interval while monitoring is enabled


Stop monitoring and logging when done:

    logTracker.stopMonitoring();
    logTracker.stopLogging();


# Example

    const logTracker = require('log-tracker');

    // Customize log level and format (optional)
    logTracker.setLogLevel('info');
    logTracker.setLogFormat('{timestamp} [{level}] {message}');

    // Start logging
    logTracker.startLogging();

    // Optionally enable file logging
    logTracker.logToFile = true;
    logTracker.logFilePath = 'app.log';

    // Log messages
    console.log('This is a regular log message.');
    console.info('This is an info message.');
    console.warn('Warning! Something might be wrong.');
    console.error('Error occurred:', 'Some error message.');

    // Start monitoring (optional)
    logTracker.startMonitoring();

    // Metrics will be logged at the specified interval while monitoring is enabled

    // Stop monitoring and logging when done
    logTracker.stopMonitoring();
    logTracker.stopLogging();


## License
This project is licensed under the MIT License - see the LICENSE file for details.
