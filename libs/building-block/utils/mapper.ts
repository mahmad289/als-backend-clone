import { pick } from 'lodash';

export function mapper<T>(
  data:
    | Partial<Record<keyof T, unknown>>
    | Partial<Record<keyof T, unknown>>[]
    | null
    | [],
  fieldsToPick: string[],
): Record<string, unknown> | Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.map(da => pick(da, fieldsToPick));
  }

  return pick(data, fieldsToPick);
}
