import { executeScript } from '@elastic/micro-jq';

import type { Json } from 'types/json';

export type FilterResult =
  | { ok: true; value: Json }
  | { ok: false; error: string };

export const runFilter = (data: Json, filter: string): FilterResult => {
  if (!filter.trim()) return { ok: true, value: data };
  try {
    const result = executeScript(data, filter) as Json;
    return { ok: true, value: result };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};
