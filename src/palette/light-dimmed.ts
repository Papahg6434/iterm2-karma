/**
 * Karma Light Dimmed — terminal palette.
 *
 * Dimmed variant of `lightPalette`. Background shifts from pure white
 * (`#ffffff`) to a slight off-white (`#f5f3f7`) for reduced glare on bright
 * displays. Foreground is muted from `#0a0e14` to `#1c1f24`. Accents are
 * desaturated ~10% — the goal is "Karma, just gentler", not a different theme.
 *
 * Use when: long reading sessions, sunlit-but-not-blinding environments,
 * or any scenario where the base Karma Light feels too high-contrast.
 *
 * Convention: bright row mirrors regular (Karma Light's own convention from
 * `lightPalette`). brightBlack stays at base `#999999` — already dim-friendly.
 */

import { lightPalette } from "./light.ts";
import type { Palette } from "./types.ts";

export const lightDimmedPalette: Palette = {
  name: "Karma Light Dimmed",

  ansi: {
    ...lightPalette.ansi,

    // ANSI 0–7 — muted, slightly grayer
    black: "#1c1f24", // muted from base #0a0e14
    red: "#e07a90", // muted from base #fc618d (gentler pink)
    green: "#4a9a4c", // muted from base #2d972f (slightly more grayish-green)
    yellow: "#d49a26", // muted from base #eeae11
    blue: "#6688b8", // muted from base #5688c7
    magenta: "#7c5ab0", // muted from base #6f42c1 (slightly toned-down purple)
    cyan: "#6688b8", // parity with blue (Karma не различает)
    white: "#5a5860", // slightly muted from base #525053

    // ANSI 8–15 — bright row mirrors regular (Karma Light convention)
    brightRed: "#e07a90",
    brightGreen: "#4a9a4c",
    brightYellow: "#e0a040", // muted from base #ffaa33
    brightBlue: "#6688b8",
    brightMagenta: "#9676d0", // muted from base #a86efd
    brightCyan: "#6688b8",
    // brightBlack stays #999999 (already mid-gray in base, dim-appropriate)
    brightWhite: "#1c1f24", // matches new black (intentional inversion vs ANSI 0)
  },

  ui: {
    background: "#f5f3f7", // off-white instead of pure white
    foreground: "#1c1f24", // muted from base #0a0e14
    cursor: "#9676d0", // muted highlight purple (vs base #a86efd)
    cursorText: "#f5f3f7", // background, for legibility on purple cursor
    selection: "#ddd8e2", // muted from base #e5e3ea
    selectedText: "#1c1f24", // foreground
    bold: "#1c1f24", // matches foreground (less harsh than pure black on off-white)
    link: "#9676d0", // muted highlight purple, matches cursor
  },
};
