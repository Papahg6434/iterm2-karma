/**
 * Karma Light HC (high-contrast) — terminal palette.
 *
 * High-contrast variant of `lightPalette`. Pure-white background and pure-black
 * foreground. Accents are deepened (lower luminance) to strengthen the contrast
 * ratio against the white background. Yellow on white is the hardest case — to
 * stay readable at the AA threshold the variant uses a brownish-yellow rather
 * than the base's vivid `#eeae11`. This is a deliberate compromise: identity
 * suffers slightly so legibility wins.
 *
 * Use when: outdoor / bright-light viewing, projector output, accessibility,
 * or any scenario where the base Karma Light feels too pastel.
 *
 * No specific WCAG AAA claim is made — pragmatic AA-ish ratios across the
 * accent grid with maximum identity preservation are the design goal.
 */

import { lightPalette } from "./light.ts";
import type { Palette } from "./types.ts";

export const lightHcPalette: Palette = {
  name: "Karma Light HC",

  ansi: {
    ...lightPalette.ansi,

    // ANSI 0–7 — deepened for stronger ratio on white
    black: "#000000", // pure black (vs base #0a0e14)
    red: "#c01650", // deepened pink/red (vs base #fc618d)
    green: "#1a6e1c", // deepened green (vs base #2d972f)
    yellow: "#9c6800", // brownish-yellow for AA legibility (vs base #eeae11)
    blue: "#2f5e9e", // deepened blue (vs base #5688c7)
    magenta: "#4d2d9a", // deepened purple (vs base #6f42c1)
    cyan: "#2f5e9e", // parity with blue (Karma не различает)
    white: "#2e2c30", // much darker than base #525053 for high contrast on white

    // ANSI 8–15 — bright row mirrors regular (Karma Light convention)
    brightRed: "#c01650",
    brightGreen: "#1a6e1c",
    brightYellow: "#9c6800",
    brightBlue: "#2f5e9e",
    brightMagenta: "#4d2d9a",
    brightCyan: "#2f5e9e",
    // brightBlack stays #999999 (already in base, slightly muted gray)
    // brightWhite stays #0a0e14 (intentional inversion vs ANSI 0)
  },

  ui: {
    ...lightPalette.ui,
    foreground: "#000000", // pure black (vs base #0a0e14)
    cursor: "#4d2d9a", // deepened highlight purple (vs base #a86efd)
    selection: "#cfcad8", // more visible on white than base #e5e3ea
    selectedText: "#000000", // foreground
    bold: "#000000", // already #000000 in base, but explicit
    link: "#4d2d9a", // deepened highlight purple, matches cursor
    // background stays #ffffff (already pure white in base)
    // cursorText stays #ffffff (legible on purple cursor)
  },
};
