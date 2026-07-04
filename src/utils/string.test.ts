import { isRelativeUrl, isUrl } from 'utils/string';
import { describe, expect, it } from 'vitest';

describe('isUrl', () => {
  it('returns true for an http URL', () => {
    expect(isUrl('http://example.com')).toBe(true);
  });

  it('returns true for an https URL', () => {
    expect(isUrl('https://example.com')).toBe(true);
  });

  it('returns true for a URL with a path', () => {
    expect(isUrl('https://example.com/foo/bar')).toBe(true);
  });

  it('returns true for a URL with query params', () => {
    expect(isUrl('https://example.com?q=1&page=2')).toBe(true);
  });

  it('returns false for a ftp URL', () => {
    expect(isUrl('ftp://example.com')).toBe(false);
  });

  it('returns false for a mailto URL', () => {
    expect(isUrl('mailto:user@example.com')).toBe(false);
  });

  it('returns false for a file URL', () => {
    expect(isUrl('file:///etc/hosts')).toBe(false);
  });

  it('returns false for a data URL', () => {
    expect(isUrl('data:text/plain;base64,SGVsbG8=')).toBe(false);
  });

  it('returns false for a ws URL', () => {
    expect(isUrl('ws://example.com')).toBe(false);
  });

  it('returns false for a wss URL', () => {
    expect(isUrl('wss://example.com')).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isUrl('hello world')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isUrl('')).toBe(false);
  });

  it('returns false for a relative path', () => {
    expect(isUrl('/foo/bar')).toBe(false);
  });

  it('returns false for a number-like string', () => {
    expect(isUrl('12345')).toBe(false);
  });
});

describe('isRelativeUrl', () => {
  it('returns true for a simple relative path', () => {
    expect(isRelativeUrl('/image.jpg')).toBe(true);
  });

  it('returns true for a nested relative path', () => {
    expect(isRelativeUrl('/some-path/image.jpg')).toBe(true);
  });

  it('returns true for a path with extension', () => {
    expect(isRelativeUrl('/index.php')).toBe(true);
  });

  it('returns true for a path with query string', () => {
    expect(isRelativeUrl('/search?q=foo')).toBe(true);
  });

  it('returns false for a bare slash', () => {
    expect(isRelativeUrl('/')).toBe(false);
  });

  it('returns false for a path with spaces', () => {
    expect(isRelativeUrl('/foo bar')).toBe(false);
  });

  it('returns false for an absolute URL', () => {
    expect(isRelativeUrl('https://example.com/foo')).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isRelativeUrl('hello')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isRelativeUrl('')).toBe(false);
  });
});
