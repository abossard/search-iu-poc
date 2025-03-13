// utility.ts

export function insertString(
  str: string,
  index: number,
  value: string
): string {
  return str.substring(0, index) + value + str.substring(index);
}

export function toUUID(_uuid: string): string {
  _uuid = insertString(_uuid, 8, "-").toUpperCase();
  _uuid = insertString(_uuid, 13, "-").toUpperCase();
  _uuid = insertString(_uuid, 18, "-").toUpperCase();
  return insertString(_uuid, 23, "-").toUpperCase();
}

export function convertToUUID(_uuid: string): string {
  return "{" + toUUID(_uuid) + "}";
}

