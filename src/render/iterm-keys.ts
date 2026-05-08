/**
 * iTerm2 plist / dynamic-profile key mappings — shared by `itermcolors.ts`
 * and `dynamic-profile.ts`.
 *
 * Both formats use the same human-readable key names (`Ansi 0 Color`,
 * `Background Color`, etc.) for color attributes — they only differ in the
 * outer envelope (XML plist vs JSON dynamic profile). These maps are the
 * single source of truth for palette-field → iTerm2-key translation.
 *
 * No I/O, no logic — just a pair of typed `Record`s.
 */

import type { AnsiColors, UiColors } from "../palette/types.ts";

/**
 * Map from `AnsiColors` field names to iTerm2's plist keys for ANSI 0..15.
 *
 * `Record<keyof AnsiColors, string>` makes the map exhaustive at compile
 * time — adding a new field to `AnsiColors` without an entry here is a
 * type error.
 */
export const ANSI_KEY_BY_FIELD: Readonly<Record<keyof AnsiColors, string>> = {
  black: "Ansi 0 Color",
  red: "Ansi 1 Color",
  green: "Ansi 2 Color",
  yellow: "Ansi 3 Color",
  blue: "Ansi 4 Color",
  magenta: "Ansi 5 Color",
  cyan: "Ansi 6 Color",
  white: "Ansi 7 Color",
  brightBlack: "Ansi 8 Color",
  brightRed: "Ansi 9 Color",
  brightGreen: "Ansi 10 Color",
  brightYellow: "Ansi 11 Color",
  brightBlue: "Ansi 12 Color",
  brightMagenta: "Ansi 13 Color",
  brightCyan: "Ansi 14 Color",
  brightWhite: "Ansi 15 Color",
};

/**
 * Map from `UiColors` field names to iTerm2's plist keys for the named
 * (non-ANSI) cells like Background, Cursor, Selection, Bold, Link.
 */
export const UI_KEY_BY_FIELD: Readonly<Record<keyof UiColors, string>> = {
  background: "Background Color",
  bold: "Bold Color",
  cursor: "Cursor Color",
  cursorText: "Cursor Text Color",
  foreground: "Foreground Color",
  link: "Link Color",
  selectedText: "Selected Text Color",
  selection: "Selection Color",
};
