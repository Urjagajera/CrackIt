/**
 * Trim leading and trailing whitespace from input string.
 */
export function trimInput(value: string): string {
  return value ? value.trim() : '';
}

/**
 * Validates if trimmed string is non-empty.
 */
export function isNonEmptyString(value: string): boolean {
  return trimInput(value).length > 0;
}
