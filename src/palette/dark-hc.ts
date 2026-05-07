/**
 * Karma Dark HC (high-contrast) — terminal palette.
 *
 * High-contrast variant of `darkPalette`. Pure-black background and pure-white
 * foreground for maximum bg/fg ratio. Accents are amplified ~10–15% in
 * saturation/lightness without losing Karma's identity (yellow stays at peak,
 * the cyan-blue/purple/pink trio remains recognisable).
 *
 * Use when: outdoor / bright-light viewing, large displays, accessibility,
 * or simply "I want it punchier".
 *
 * Implementation: an object-spread override on top of `darkPalette`. Only the
 * cells that differ from the base are listed explicitly; everything else is
 * inherited unchanged. This keeps the diff between Dark and Dark HC easy to
 * audit: `diff src/palette/dark.ts src/palette/dark-hc.ts` shows exactly what
 * the high-contrast variant changes.
 */

import { darkPalette } from "./dark.ts";
import type { Palette } from "./types.ts";

export const darkHcPalette: Palette = {
  name: "Karma Dark HC",

  ansi: {
    ...darkPalette.ansi,

    // ANSI 0–7 — push to extremes
    black: "#000000", // pure black (vs base #0a0e14)
    red: "#ff5c87", // amplified pink (vs base #fc618d)
    green: "#80e598", // amplified green (vs base #7bd88f)
    // yellow already at peak in base (#fce566) — keep
    blue: "#61dceb", // amplified cyan-blue (vs base #5ad4e6)
    magenta: "#b9a3ee", // amplified purple (vs base #af98e6)
    cyan: "#61dceb", // parity with blue (Karma не различает)
    white: "#d6d2db", // brighter than base #bab6c0 for visibility on pure black

    // ANSI 8–15 — bright row pulled further
    brightRed: "#ff8aab", // brighter than base #ff7ba0
    brightGreen: "#a3e9b1", // brighter than base #9ce3ab
    brightYellow: "#fff080", // slightly above peak (vs base #fce566)
    brightBlue: "#87e5f1", // brighter than base #7fe0ee
    brightMagenta: "#cab6f4", // brighter than base #c3b0f0
    brightCyan: "#87e5f1", // parity with brightBlue
    brightWhite: "#ffffff", // pure white (vs base #f7f1ff)
  },

  ui: {
    ...darkPalette.ui,
    background: "#000000", // pure black (vs base #0a0e14)
    foreground: "#ffffff", // pure white (vs base #f7f1ff)
    cursorText: "#000000", // background, for legibility on yellow cursor
    selection: "#4d4a5e", // more visible on pure black than base #3a384a
    selectedText: "#ffffff", // foreground
    bold: "#ffffff", // already pure white in base, but explicit here
    link: "#b78dff", // brighter highlight purple (vs base #a86efd)
    // cursor stays Karma yellow #fce566 (kept from base) — identity anchor
  },
};
