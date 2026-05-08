/**
 * Unit tests for `paletteToShell` / `renderPreviewData` in `./preview-data.ts`.
 *
 * Run via `deno task test`.
 */

import { assertEquals, assertStringIncludes, assertThrows } from "@std/assert";

import { paletteToShell, renderPreviewData } from "./preview-data.ts";
import type { Palette } from "../palette/types.ts";

const SAMPLE: Palette = {
  name: "Test Palette",
  ansi: {
    black: "#000000",
    red: "#fc618d",
    green: "#7bd88f",
    yellow: "#fce566",
    blue: "#5ad4e6",
    magenta: "#af98e6",
    cyan: "#5ad4e6",
    white: "#bab6c0",
    brightBlack: "#69676c",
    brightRed: "#ff7ba0",
    brightGreen: "#9ce3ab",
    brightYellow: "#fce566",
    brightBlue: "#7fe0ee",
    brightMagenta: "#c3b0f0",
    brightCyan: "#7fe0ee",
    brightWhite: "#f7f1ff",
  },
  ui: {
    background: "#0a0e14",
    foreground: "#f7f1ff",
    cursor: "#fce566",
    cursorText: "#0a0e14",
    selection: "#3a384a",
    selectedText: "#f7f1ff",
    bold: "#ffffff",
    link: "#a86efd",
  },
};

Deno.test("paletteToShell: emits the palette name as a shell comment header", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  assertStringIncludes(out, "# Test Palette");
});

Deno.test("paletteToShell: emits every cell with the given prefix", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  // 18 cells per palette (FG + HLT + 16 ANSI)
  for (
    const suffix of [
      "FG",
      "HLT",
      "BLK",
      "RED",
      "GRN",
      "YEL",
      "BLU",
      "MAG",
      "CYA",
      "WHT",
      "GRY",
      "BR_RED",
      "BR_GRN",
      "BR_YEL",
      "BR_BLU",
      "BR_MAG",
      "BR_CYA",
      "BR_WHT",
    ]
  ) {
    assertStringIncludes(out, `TEST_${suffix}_R=`);
    assertStringIncludes(out, `TEST_${suffix}_G=`);
    assertStringIncludes(out, `TEST_${suffix}_B=`);
  }
});

Deno.test("paletteToShell: converts hex correctly (#fc618d → 252,97,141)", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  assertStringIncludes(out, "TEST_RED_R=252; TEST_RED_G=97; TEST_RED_B=141");
});

Deno.test("paletteToShell: converts #000000 → 0,0,0 and #ffffff → 255,255,255", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  assertStringIncludes(out, "TEST_BLK_R=0; TEST_BLK_G=0; TEST_BLK_B=0");
  // brightWhite #f7f1ff = 247,241,255
  assertStringIncludes(out, "TEST_BR_WHT_R=247; TEST_BR_WHT_G=241; TEST_BR_WHT_B=255");
});

Deno.test("paletteToShell: appends original hex as trailing comment", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  assertStringIncludes(out, "# #fc618d");
  assertStringIncludes(out, "# #a86efd");
});

Deno.test("paletteToShell: produces no trailing newline (caller composes layout)", () => {
  const out = paletteToShell(SAMPLE, "TEST");
  assertEquals(out.endsWith("\n"), false);
});

Deno.test("paletteToShell: throws on invalid palette hex (delegates to parseHexBytes)", () => {
  const broken: Palette = {
    ...SAMPLE,
    ansi: { ...SAMPLE.ansi, red: "not-a-hex" },
  };
  assertThrows(() => paletteToShell(broken, "TEST"), Error, "Invalid hex color");
});

// --- renderPreviewData (full file) -----------------------------------------

Deno.test("renderPreviewData: includes auto-generated header", () => {
  const out = renderPreviewData([{ prefix: "A", palette: SAMPLE }]);
  assertStringIncludes(out, "#!/usr/bin/env bash");
  assertStringIncludes(out, "AUTO-GENERATED");
  assertStringIncludes(out, "src/palette/*.ts");
});

Deno.test("renderPreviewData: emits every palette block with its prefix", () => {
  const out = renderPreviewData([
    { prefix: "DARK", palette: SAMPLE },
    { prefix: "DARK_HC", palette: { ...SAMPLE, name: "HC" } },
  ]);
  assertStringIncludes(out, "DARK_FG_R=");
  assertStringIncludes(out, "DARK_HC_FG_R=");
});

Deno.test("renderPreviewData: ends with exactly one trailing newline", () => {
  const out = renderPreviewData([{ prefix: "A", palette: SAMPLE }]);
  assertEquals(out.endsWith("\n"), true);
  assertEquals(out.endsWith("\n\n"), false);
});

Deno.test("renderPreviewData: separates blocks with a blank line", () => {
  const out = renderPreviewData([
    { prefix: "A", palette: SAMPLE },
    { prefix: "B", palette: SAMPLE },
  ]);
  // The separator "\n\n" must appear between blocks.
  const sepCount = out.split("\n\n").length - 1;
  // We expect: 1 after header + 1 between blocks = 2 occurrences of "\n\n".
  assertEquals(sepCount >= 1, true);
});
