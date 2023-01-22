import { compressToBase64 } from 'lz-string';
import { log } from '../services/log/logger';

/**
 * Compresses an uncompressed string producing an instance of a ASCII UTF-16 string, which represents the original string encoded in Base64.
 * @param string An uncompressed string.
 * @returns A compressed string.
 */
export async function compressString(string: string): Promise<string> {
  log.debug('Compressing string of size', string.length);
  if (string.length <= 4) return string;
  const compressedString = compressToBase64(string);
  const percent = (((string.length - compressedString.length) / string.length) * 100).toFixed(2);
  log.debug(
    'String compressed',
    'from',
    string.length,
    'to',
    compressedString.length,
    `(${percent}%)`
  );
  if (compressedString.length > string.length)
    log.error('String compression produced an inflated string', {
      percent,
      originalSize: string.length,
      compressedSize: compressedString.length,
      original: string,
      compressed: compressedString,
    });
  return compressedString;
}
