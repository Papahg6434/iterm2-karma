/**
 * Karma Dark Dimmed — terminal palette.
 *
 * Dimmed variant of `darkPalette`. Background is lifted slightly from pure-dark
 * (`#0a0e14` → `#14181f`) — counterintuitively, on OLED screens the jump from
 * "pure black" to "any non-black" is the most fatiguing transition; a slight
 * lift smooths it. Foreground and accents are pulled toward middle gray
 * (~10% desaturation, slight luminance reduction).
 *
 * Use when: late-night work, OLED displays where pure black causes bloom,
 * or any scenario where the base Karma Dark feels too saturated/vivid.
 *
 * Design rule: every cell that exists in the base is desaturated or muted —
 * but the *relative* hierarchy (cyan-blue identity, pink-red, purple) stays
 * intact. The variant should still read as Karma, just quieter.
 */

import { darkPalette } from "./dark.ts";
import type { Palette } from "./types.ts";

export const darkDimmedPalette: Palette = {
  name: "Karma Dark Dimmed",

  ansi: {
    ...darkPalette.ansi,

    // ANSI 0–7 — desaturated and slightly lifted
    black: "#14181f", // lifted from base #0a0e14
    red: "#e87691", // muted pink (vs base #fc618d, less neon)
    green: "#82c891", // muted green (vs base #7bd88f)
    yellow: "#ebd870", // muted yellow (vs base #fce566)
    blue: "#6cc4d2", // muted cyan-blue (vs base #5ad4e6)
    magenta: "#a892d4", // muted purple (vs base #af98e6)
    cyan: "#6cc4d2", // parity with blue (Karma не различает)
    white: "#a8a4ae", // muted from base #bab6c0

    // ANSI 8–15 — bright row similarly muted
    brightBlack: "#5c5a5f", // slightly muted from base #69676c
    brightRed: "#e8869c", // muted from base #ff7ba0
    brightGreen: "#98cea4", // muted from base #9ce3ab
    brightYellow: "#ebd870", // parity with yellow (already muted)
    brightBlue: "#80c8d2", // muted from base #7fe0ee
    brightMagenta: "#b6a4d6", // muted from base #c3b0f0
    brightCyan: "#80c8d2", // parity with brightBlue
    brightWhite: "#e2def0", // muted from base #f7f1ff
  },

  ui: {
    background: "#14181f", // matches ansi black
    foreground: "#e2def0", // muted from base #f7f1ff
    cursor: "#ebd870", // muted yellow
    cursorText: "#14181f", // background
    selection: "#2f2d3d", // muted from base #3a384a
    selectedText: "#e2def0", // foreground
    bold: "#f0eafa", // less harsh than pure white
    link: "#9678d8", // muted highlight purple (vs base #a86efd)
  },
};
