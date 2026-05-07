/**
 * iTerm2 `.itermcolors` plist generator — pure XML serialization of a
 * `Palette` into the Apple property list format expected by iTerm2's
 * "Color Presets → Import" dialog.
 *
 * Format reference: `.opencode/skills/itermcolors-format/SKILL.md`.
 *
 * Determinism contract:
 * - Top-level keys are emitted in **lexicographic** order (ASCII sort) so
 *   diffs between builds are stable. Lex order matches what `plutil -convert
 *   xml1` and real iTerm2 exports use.
 * - Inner color-dict keys are alphabetical: Alpha, Blue, Color Space, Green,
 *   Red.
 * - Numeric components use `Number.prototype.toString()` (locale-independent,
 *   IEEE-754 deterministic). Integral values get an explicit `.0` suffix to
 *   avoid `<real>0</real>` (the convention is `<real>0.0</real>`).
 * - Alpha is always `1.0` — palette inputs do not carry alpha at this layer.
 *
 * No I/O, no logging, no globals.
 */

import type { AnsiColors, Palette, RgbComponents, UiColors } from "../palette/types.ts";
import { parseHex } from "./color.ts";

// --- Plist envelope -------------------------------------------------------

const HEADER = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" ' +
  '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
  '<plist version="1.0">',
  "<dict>",
].join("\n");

const FOOTER = [
  "</dict>",
  "</plist>",
  "", // trailing newline (POSIX-friendly)
].join("\n");

// --- AnsiColors / UiColors → iTerm2 plist key mapping ---------------------
// Both records are `Record<keyof X, string>` so the type system enforces a
// complete mapping — adding a new field to AnsiColors / UiColors without a
// corresponding entry here is a compile error.

const ANSI_KEY_BY_FIELD: Readonly<Record<keyof AnsiColors, string>> = {
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

const UI_KEY_BY_FIELD: Readonly<Record<keyof UiColors, string>> = {
  background: "Background Color",
  bold: "Bold Color",
  cursor: "Cursor Color",
  cursorText: "Cursor Text Color",
  foreground: "Foreground Color",
  link: "Link Color",
  selectedText: "Selected Text Color",
  selection: "Selection Color",
};

// --- Helpers --------------------------------------------------------------

/**
 * Format an RGB component (0..1 float) for inclusion in a `<real>` element.
 *
 * Integral values get an explicit `.0` suffix because iTerm2 / plutil-canonical
 * exports always write `<real>0.0</real>` and `<real>1.0</real>` rather than
 * `<real>0</real>` / `<real>1</real>`.
 */
function formatComponent(value: number): string {
  return Number.isInteger(value) ? value.toFixed(1) : value.toString();
}

/**
 * Render the inner NSColor `<dict>` for a single color, with two-tab
 * indentation (so it slots in below a top-level `<key>` at one tab).
 */
function renderColorDict(rgb: RgbComponents): string {
  return [
    "\t<dict>",
    "\t\t<key>Alpha Component</key>",
    "\t\t<real>1.0</real>",
    "\t\t<key>Blue Component</key>",
    `\t\t<real>${formatComponent(rgb.blue)}</real>`,
    "\t\t<key>Color Space</key>",
    "\t\t<string>sRGB</string>",
    "\t\t<key>Green Component</key>",
    `\t\t<real>${formatComponent(rgb.green)}</real>`,
    "\t\t<key>Red Component</key>",
    `\t\t<real>${formatComponent(rgb.red)}</real>`,
    "\t</dict>",
  ].join("\n");
}

/**
 * Render a complete top-level entry — the iTerm2 key (e.g. `Ansi 0 Color`)
 * and its color dict — at one tab of indentation.
 */
function renderEntry(key: string, hex: string): string {
  return [
    `\t<key>${key}</key>`,
    renderColorDict(parseHex(hex)),
  ].join("\n");
}

// --- Public API -----------------------------------------------------------

/**
 * Render a `Palette` into the full `.itermcolors` XML plist string.
 *
 * The result is suitable for `Deno.writeTextFile` — UTF-8, with a trailing
 * newline — and for `plutil -lint` validation.
 *
 * @param palette - Source palette (e.g. `darkPalette` from `src/palette/dark.ts`).
 * @returns A complete XML plist 1.0 document with all 24 standard iTerm2 keys.
 */
export function renderItermcolors(palette: Palette): string {
  const allEntries: Array<readonly [string, string]> = [];

  for (const field of Object.keys(ANSI_KEY_BY_FIELD) as Array<keyof AnsiColors>) {
    allEntries.push([ANSI_KEY_BY_FIELD[field], palette.ansi[field]]);
  }
  for (const field of Object.keys(UI_KEY_BY_FIELD) as Array<keyof UiColors>) {
    allEntries.push([UI_KEY_BY_FIELD[field], palette.ui[field]]);
  }

  // Lexicographic ASCII sort (stable, locale-independent) — matches the
  // ordering of real iTerm2 exports and `plutil -convert xml1` output.
  allEntries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const body = allEntries
    .map(([key, hex]) => renderEntry(key, hex))
    .join("\n");

  return [HEADER, body, FOOTER].join("\n");
}
