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
import { darkDimmedPalette } from "./src/palette/dark-dimmed.ts";
import { darkHcPalette } from "./src/palette/dark-hc.ts";
import { lightPalette } from "./src/palette/light.ts";
import { lightDimmedPalette } from "./src/palette/light-dimmed.ts";
import { lightHcPalette } from "./src/palette/light-hc.ts";
import { renderItermcolors } from "./src/render/itermcolors.ts";
import { renderPreviewData } from "./src/render/preview-data.ts";
import type { Palette } from "./src/palette/types.ts";

interface Target {
  readonly palette: Palette;
  readonly outPath: string;
  /** Shell prefix for `assets/_preview-data.sh` (uppercase ASCII, no trailing _). */
  readonly previewPrefix: string;
}

const TARGETS: ReadonlyArray<Target> = [
  {
    palette: darkPalette,
    outPath: "colors/karma-dark.itermcolors",
    previewPrefix: "DARK",
  },
  {
    palette: lightPalette,
    outPath: "colors/karma-light.itermcolors",
    previewPrefix: "LIGHT",
  },
  {
    palette: darkHcPalette,
    outPath: "colors/karma-dark-hc.itermcolors",
    previewPrefix: "DARK_HC",
  },
  {
    palette: lightHcPalette,
    outPath: "colors/karma-light-hc.itermcolors",
    previewPrefix: "LIGHT_HC",
  },
  {
    palette: darkDimmedPalette,
    outPath: "colors/karma-dark-dimmed.itermcolors",
    previewPrefix: "DARK_DIMMED",
  },
  {
    palette: lightDimmedPalette,
    outPath: "colors/karma-light-dimmed.itermcolors",
    previewPrefix: "LIGHT_DIMMED",
  },
];

const PREVIEW_DATA_PATH = "assets/_preview-data.sh";

async function main(): Promise<void> {
  await Deno.mkdir("colors", { recursive: true });
  await Deno.mkdir("assets", { recursive: true });

  // Emit one .itermcolors per target.
  for (const { palette, outPath } of TARGETS) {
    const xml = renderItermcolors(palette);
    await Deno.writeTextFile(outPath, xml);
    console.log(`build: wrote ${outPath}`);
  }

  // Emit a single _preview-data.sh covering all targets, sourced by preview.sh.
  const previewEntries = TARGETS.map((t) => ({
    prefix: t.previewPrefix,
    palette: t.palette,
  }));
  const previewSh = renderPreviewData(previewEntries);
  await Deno.writeTextFile(PREVIEW_DATA_PATH, previewSh);
  console.log(`build: wrote ${PREVIEW_DATA_PATH}`);
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`build: failed — ${message}`);
  Deno.exit(1);
}
