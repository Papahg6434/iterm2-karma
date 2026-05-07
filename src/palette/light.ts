/**
 * Karma Light — terminal palette.
 *
 * Source of truth: `karma-palette` skill (which itself derives from
 * `sreetamdas/karma` `src/tokens.ts` `KARMA_LIGHT` and `themes/light.json`).
 *
 * Mapping strategy: the **refined ANSI 16 mapping** from `karma-palette`
 * (variant *b*), not Karma's verbatim `terminal.ansi*` ship values.
 *
 * Karma Light's verbatim mapping has two quirks the refined mapping fixes:
 * 1. `terminal.ansiBlack` is set to `#FFFFFF` (white) because Karma treats
 *    ANSI 0 as "background"; combined with `terminal.ansiWhite = #0A0E14`
 *    it inverts the conventional ANSI 0/7 polarity. This breaks tools like
 *    `ls --color=auto` that assume ANSI 0 is dark. The refined mapping uses
 *    `#0a0e14` for ANSI 0 and a mid-gray `#525053` for ANSI 7 so "white"
 *    text remains visible on the white background.
 * 2. `terminal.ansiBlue = #6F42C1` (purple) and `terminal.ansiMagenta =
 *    #FA8D3E` (orange). Refined uses Karma's actual blue (`#5688c7`) for
 *    ANSI 4 and Karma's purple (`#6f42c1`) for ANSI 5.
 *
 * Bright variants: Karma Light does not differentiate bright vs regular for
 * red/green/cyan/blue in `terminal.ansi*` (both rows hold the same hex). The
 * refined mapping introduces variation only for `brightBlack` (`#999999`),
 * `brightYellow` (`#ffaa33`, Karma's `yellowButDarker`), and `brightMagenta`
 * (`#a86efd`, Karma's `highlight` purple). Other bright slots reuse regular.
 *
 * See: `.opencode/skills/karma-palette/SKILL.md` → "Karma Light — ANSI 16 (b)".
 */

import type { Palette } from "./types.ts";

export const lightPalette: Palette = {
  name: "Karma Light",

  ansi: {
    // ANSI 0–7 — standard
    black: "#0a0e14", // KARMA_LIGHT.primary (refined: dark text on white bg)
    red: "#fc618d", // KARMA_LIGHT.red
    green: "#2d972f", // KARMA_LIGHT.green
    yellow: "#eeae11", // KARMA_LIGHT.yellow, terminal.ansiYellow
    blue: "#5688c7", // KARMA_LIGHT.blue (refined: skip purple-as-blue)
    magenta: "#6f42c1", // KARMA_LIGHT.purple (refined: skip orange-as-magenta)
    cyan: "#5688c7", // reuse KARMA_LIGHT.blue (Karma не различает blue/cyan)
    white: "#525053", // KARMA_LIGHT.gray.7 (mid-gray для контраста на white bg)

    // ANSI 8–15 — bright variants (Karma Light не различает в большинстве слотов)
    brightBlack: "#999999", // KARMA_LIGHT.gray.6, terminal.ansiBrightBlack
    brightRed: "#fc618d", // same as red (Karma Light не различает)
    brightGreen: "#2d972f", // same as green
    brightYellow: "#ffaa33", // KARMA_LIGHT.yellowButDarker (heading/string color)
    brightBlue: "#5688c7", // same as blue
    brightMagenta: "#a86efd", // KARMA_LIGHT.highlight (links / cursor accent)
    brightCyan: "#5688c7", // same as blue/cyan (intentional parity)
    brightWhite: "#0a0e14", // foreground (intentional inversion vs ANSI 0)
  },

  ui: {
    background: "#ffffff", // KARMA_LIGHT.background, editor.background
    foreground: "#0a0e14", // KARMA_LIGHT.primary, editor.foreground
    cursor: "#a86efd", // editorCursor.foreground (Karma highlight purple)
    cursorText: "#ffffff", // background, для legibility на purple cursor
    // Pre-blended approximation of `editor.selectionBackground: #bab6c026` over
    // the white background. Same convention as Karma Dark for VS Code parity.
    // Future: when render/ supports NSColor `Alpha Component`, use 8-digit hex
    // directly so selection blends correctly over arbitrary backgrounds.
    selection: "#e5e3ea",
    selectedText: "#0a0e14", // foreground
    bold: "#000000", // extra contrast on white bg
    link: "#a86efd", // textLink.foreground (highlight purple)
  },
};
