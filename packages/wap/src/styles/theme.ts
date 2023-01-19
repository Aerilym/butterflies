import { extendTheme } from 'native-base';
import { themeFontConfig } from './fonts';

export const appTheme = extendTheme({
  ...themeFontConfig,
});
