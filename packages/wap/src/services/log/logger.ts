import { logger, consoleTransport, sentryTransport } from 'react-native-logs';
import { InteractionManager } from 'react-native';

import { isWeb } from '../../helpers/environment';
import { Sentry } from './sentry';

const baseConfig = {
  severity: __DEV__ ? 'debug' : 'info',
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
};

const localConfig = {
  ...baseConfig,
  transport: [consoleTransport],
  enabled: true,
};

const sentryConfig = {
  ...baseConfig,
  transport: [sentryTransport],
  transportOptions: {
    ...baseConfig.transportOptions,
    SENTRY: isWeb ? Sentry.Browser : Sentry.Native,
  },
  enabled: __DEV__ ? false : true,
};

const localLog = logger.createLogger<'debug' | 'info' | 'warn' | 'error'>(localConfig);
const sentryLog = logger.createLogger<'warn' | 'error'>(sentryConfig);

const log = {
  debug: (message: string, ...args: unknown[]) => {
    localLog.debug(message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    localLog.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    localLog.warn(message, ...args);
    sentryLog.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    localLog.error(message, ...args);
    sentryLog.error(message, ...args);
  },
};

export { log };
