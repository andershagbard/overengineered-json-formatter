export const isUrl = (value: string): boolean => {
  try {
    const { protocol } = new URL(value);

    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

export const isRelativeUrl = (value: string): boolean => {
  return /^\/\S+$/.test(value);
};
