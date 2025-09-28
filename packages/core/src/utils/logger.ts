import winston from 'winston';
import type { ProgressBar } from '../lib/progress';

let progressBar: ProgressBar | null = null;

const setProgressBar = (bar: ProgressBar) => {
  progressBar = bar;
};
const removeProgressBar = () => {
  progressBar = null;
};

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
});

winston.configure({
  exitOnError: false,
  transports: [consoleTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
});

// create a wrapper for error messages
const errorWrap = (input: any) => {
  if (progressBar) {
    progressBar.interruptBegin();
    winston.error(input as any);
    progressBar.interruptEnd();
  } else {
    winston.error(input as any);
  }
};

// create a wrapper for warning messages
const warnWrap = (input: any) => {
  if (progressBar) {
    progressBar.interruptBegin();
    winston.warn(input as any);
    progressBar.interruptEnd();
  } else {
    winston.warn(input as any);
  }
};

// create a wrapper for info messages
const infoWrap = (input: any) => {
  if (progressBar) {
    progressBar.interruptBegin();
    winston.info(input as any);
    progressBar.interruptEnd();
  } else {
    winston.info(input as any);
  }
};

const { debug } = winston;
const { verbose } = winston;

export {
  errorWrap as error,
  warnWrap as warn,
  infoWrap as info,
  verbose,
  debug,
  setProgressBar,
  removeProgressBar,
};
