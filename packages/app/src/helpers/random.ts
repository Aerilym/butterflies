import { v4, validate, version } from 'uuid';

export function isUuid(uuid: string): boolean {
  return validate(uuid);
}

export const uuid = {
  validate: (uuid: string): boolean => {
    const ver = version(uuid) === 4;
    return ver && isUuid(uuid);
  },
  generate: (): string => {
    const uuid = v4();
    return uuid;
  },
};
