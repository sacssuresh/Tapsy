/**
 * Production-safe logging utility
 * Only logs in development mode, except for errors which are always logged
 */

const isDev = __DEV__;

/**
 * Log debug messages (only in development)
 */
export const log = (...args: unknown[]): void => {
  if (isDev) {
    console.log(...args);
  }
};

/**
 * Log warnings (only in development)
 */
export const warn = (...args: unknown[]): void => {
  if (isDev) {
    console.warn(...args);
  }
};

/**
 * Log errors (always logged, even in production)
 * In production, consider sending to error tracking service
 */
export const error = (...args: unknown[]): void => {
  console.error(...args);
  // TODO: In production, send to error tracking service (e.g., Sentry, Bugsnag)
};

/**
 * Log info messages (only in development)
 */
export const info = (...args: unknown[]): void => {
  if (isDev) {
    console.log('[INFO]', ...args);
  }
};

