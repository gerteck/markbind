const chalkModule = require('chalk');
const figlet = require('figlet');
const DailyRotateFile = require('winston-daily-rotate-file');
const winston = require('winston');
const coreLogger = require('@markbind/core/src/utils/logger');

const chalk = chalkModule.default || chalkModule;

// @markbind/core's consoleTransport but with level: info
const consoleTransport = new (winston.transports.Console)({
  level: 'info',
  handleExceptions: true,
});

function useDebugConsole() {
  consoleTransport.level = 'debug';
}

const dailyRotateFileTransport = new DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  dirname: '_markbind/logs',
  filename: 'markbind-%DATE%.log',
  handleExceptions: true,
  level: 'debug',
  maxFiles: 5,
});

// Reconfigure the default instance logger winston provides with DailyRotateFile for markbind-cli
winston.configure({
  exitOnError: false,
  transports: [
    consoleTransport,
    dailyRotateFileTransport,
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
});

module.exports = {
  error: coreLogger.error,
  warn: coreLogger.warn,
  info: coreLogger.info,
  verbose: coreLogger.verbose,
  debug: coreLogger.debug,
  /* eslint-disable no-console */
  log: console.log,
  logo: () => console.log(chalk.cyan(figlet.textSync('MarkBind', { horizontalLayout: 'full' }))),
  useDebugConsole,
};
