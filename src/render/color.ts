/**
 * Color rendering — pure transformations from Karma palette hex strings to
 * the numeric RGB form expected by iTerm2's `.itermcolors` plist.
 *
 * No I/O, no logging, no globals. Throws on invalid input so the build script
 * fails fast at the boundary rather than emitting a silent default color.
 */

import type { RgbComponents } from "../palette/types.ts";

const HEX_PATTERN = /^[0-9a-f]{6}$/;
const MAX_BYTE = 255;

/**
 * Raw 0..255 integer RGB components, as found in the source hex string itself.
 *
 * Used by emitters that need the pre-normalized form — for example the
 * shell preview data emitter, which writes `R=247; G=241; B=255` triples
 * for `assets/preview.sh` to source.
 */
export interface RgbBytes {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/**
 * Parse a 6-digit hex color string into raw 0..255 integer components.
 *
 * Accepts:
 * - With or without leading `#` (e.g. `"#FC618D"` or `"FC618D"`).
 * - Mixed case (input is folded to lowercase before matching).
 * - Surrounding whitespace (input is trimmed).
 *
 * Throws `Error` for any other shape — empty string, 3-digit shorthand,
 * 8-digit hex with alpha, non-hex characters, internal whitespace, etc.
 *
 * Both `parseHex` (NSColor 0..1 floats) and `parseHexBytes` (0..255 ints)
 * funnel through this single validation path.
 *
 * @param hex - 6-digit hex color, optionally prefixed with `#`.
 * @returns RGB components as integers in 0..255.
 * @throws {Error} When `hex` is not a 6-digit hex color.
 */
export function parseHexBytes(hex: string): RgbBytes {
  const cleaned = hex.trim().toLowerCase().replace(/^#/, "");

  if (!HEX_PATTERN.test(cleaned)) {
    throw new Error(
      `Invalid hex color: "${hex}". Expected 6-digit hex like "#fc618d".`,
    );
  }

  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

/**
 * Parse a 6-digit hex color string into normalized RGB components in 0..1.
 *
 * Same input contract as `parseHexBytes` — see that function for the
 * accepted forms and error semantics. The 0..1 range is what NSColor
 * (and therefore iTerm2's `.itermcolors` plist) expects.
 *
 * @param hex - 6-digit hex color, optionally prefixed with `#`.
 * @returns RGB components in the 0..1 range expected by NSColor.
 * @throws {Error} When `hex` is not a 6-digit hex color.
 */
export function parseHex(hex: string): RgbComponents {
  const { r, g, b } = parseHexBytes(hex);
  return {
    red: r / MAX_BYTE,
    green: g / MAX_BYTE,
    blue: b / MAX_BYTE,
  };
}
