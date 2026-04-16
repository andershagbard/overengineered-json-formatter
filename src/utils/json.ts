import type { Json } from 'types/json';

export const isExpandable = (
  value: Json,
): value is Json[] | Record<string, Json> =>
  value !== null && typeof value === 'object';

export const getEntries = (
  value: Json[] | Record<string, Json>,
): Array<[string, Json, boolean]> => {
  if (Array.isArray(value)) {
    return value.map((child, index) => [index.toString(), child, false]);
  }

  return Object.entries(value).map(([key, child]) => [key, child, true]);
};

export const nodeCount = (value: Json): number => {
  if (Array.isArray(value)) {
    return 1 + value.reduce((sum: number, v: Json) => sum + nodeCount(v), 0);
  }

  if (value !== null && typeof value === 'object') {
    return (
      1 +
      Object.values(value).reduce(
        (sum: number, v: Json) => sum + nodeCount(v),
        0,
      )
    );
  }

  return 1;
};

export const maxDepth = (value: Json): number => {
  if (Array.isArray(value)) {
    return value.length === 0 ? 1 : 1 + Math.max(...value.map(maxDepth));
  }

  if (value !== null && typeof value === 'object') {
    const vals = Object.values(value);
    return vals.length === 0 ? 1 : 1 + Math.max(...vals.map(maxDepth));
  }

  return 0;
};
