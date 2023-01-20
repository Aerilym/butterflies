import { logger, consoleTransport, sentryTransport, fileAsyncTransport } from 'react-native-logs';
import * as FileSystem from 'expo-file-system';
import type { FileInfo } from 'expo-file-system';
import { InteractionManager } from 'react-native';

import { isMobileDevice, isWeb } from '../../helpers/environment';
import { Sentry } from './sentry';

export type LogFile =
  | {
      name: string;
      contents: string;
    } & FileInfo;

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

// The file logger is only created if the app is running on a mobile device.
const fileConfig = isMobileDevice
  ? {
      severity: 'debug',
      transport: fileAsyncTransport,
      transportOptions: {
        FS: FileSystem,
        fileName: `logs_{date-today}`,
      },
    }
  : null;

const fileLog = fileConfig
  ? logger.createLogger<'debug' | 'info' | 'warn' | 'error'>(fileConfig)
  : null;

const localLog = logger.createLogger<'debug' | 'info' | 'warn' | 'error'>(localConfig);
const sentryLog = logger.createLogger<'warn' | 'error'>(sentryConfig);

const log = {
  debug: (message: string, ...args: unknown[]) => {
    localLog.debug(message, ...args);
    fileLog?.debug(message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    localLog.info(message, ...args);
    fileLog?.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    localLog.warn(message, ...args);
    fileLog?.warn(message, ...args);
    sentryLog.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    localLog.error(message, ...args);
    fileLog?.error(message, ...args);
    sentryLog.error(message, ...args);
  },
};

/**
 * Get all log files from the device.
 * @param startDate The start date to filter by.
 * @param endDate The end date to filter by.
 * @returns An array of log files.
 */
export async function getLogFiles(startDate?: Date, endDate?: Date): Promise<LogFile[]> {
  if (!isMobileDevice) return [];
  let fileNames = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? '');

  // If a start an end date are provided, filter the log files by those dates.
  if (startDate && endDate) {
    fileNames = fileNames.filter((name) => {
      const dateString = name.split('_')[1];
      const dateArr = dateString.split('-').map(Number);
      const date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);

      return date >= startDate && date <= endDate;
    });
  }

  const filePromises: Promise<LogFile | null>[] = fileNames.map(async (name) => {
    const info = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory ?? ''}/${name}`);
    if (!info.exists) return null;
    const contents = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory ?? ''}/${name}`,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    return { name, contents, ...info };
  });

  // Resolve the file reading promises and filter out any files that don't exist.
  const files = (await Promise.all(filePromises)).filter((file): file is LogFile => file !== null);
  return files;
}

export { log };
