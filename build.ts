/**
 * Build orchestrator — generate `.itermcolors` files in `colors/` from the
 * palettes in `src/palette/`.
 *
 * This is the **only** module in the project that performs I/O (`Deno.mkdir`,
 * `Deno.writeTextFile`, `console.*`, `Deno.exit`). All transformation logic
 * lives in pure modules under `src/`.
 *
 * Run via `deno task build` (which adds `--allow-write=colors`).
 */

import { darkPalette } from "./src/palette/dark.ts";
import { lightPalette } from "./src/palette/light.ts";
import { renderItermcolors } from "./src/render/itermcolors.ts";
import type { Palette } from "./src/palette/types.ts";

interface Target {
  readonly palette: Palette;
  readonly outPath: string;
}

const TARGETS: ReadonlyArray<Target> = [
  { palette: darkPalette, outPath: "colors/karma-dark.itermcolors" },
  { palette: lightPalette, outPath: "colors/karma-light.itermcolors" },
];

async function main(): Promise<void> {
  await Deno.mkdir("colors", { recursive: true });

  for (const { palette, outPath } of TARGETS) {
    const xml = renderItermcolors(palette);
    await Deno.writeTextFile(outPath, xml);
    console.log(`build: wrote ${outPath}`);
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`build: failed — ${message}`);
  Deno.exit(1);
}
