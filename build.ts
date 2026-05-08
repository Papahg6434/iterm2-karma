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
import { renderDynamicProfile } from "./src/render/dynamic-profile.ts";
import { renderItermcolors } from "./src/render/itermcolors.ts";
import { renderPreviewData } from "./src/render/preview-data.ts";
import type { Palette } from "./src/palette/types.ts";

interface Target {
  readonly palette: Palette;
  /** Output path for the `.itermcolors` color preset (manual import flow). */
  readonly itermcolorsPath: string;
  /** Output path for the Dynamic Profile JSON (drop-in install flow). */
  readonly dynamicProfilePath: string;
  /**
   * Stable Guid for the Dynamic Profile. Generated once via `uuidgen` and
   * frozen — changing this would create duplicate profiles in users' iTerm2
   * settings on next pickup.
   */
  readonly guid: string;
  /** Shell prefix for `assets/_preview-data.sh` (uppercase ASCII, no trailing _). */
  readonly previewPrefix: string;
}

const TARGETS: ReadonlyArray<Target> = [
  {
    palette: darkPalette,
    itermcolorsPath: "colors/karma-dark.itermcolors",
    dynamicProfilePath: "profiles/karma-dark.json",
    guid: "1EBF97F9-AA53-4BBA-BFE3-90590577C52E",
    previewPrefix: "DARK",
  },
  {
    palette: lightPalette,
    itermcolorsPath: "colors/karma-light.itermcolors",
    dynamicProfilePath: "profiles/karma-light.json",
    guid: "B92F2A7A-CF64-48BA-867C-BD2EDDA70E35",
    previewPrefix: "LIGHT",
  },
  {
    palette: darkHcPalette,
    itermcolorsPath: "colors/karma-dark-hc.itermcolors",
    dynamicProfilePath: "profiles/karma-dark-hc.json",
    guid: "FD49AF34-6D72-46C1-8605-C363F18F128D",
    previewPrefix: "DARK_HC",
  },
  {
    palette: lightHcPalette,
    itermcolorsPath: "colors/karma-light-hc.itermcolors",
    dynamicProfilePath: "profiles/karma-light-hc.json",
    guid: "651E3923-8026-436F-8959-1E21101D5EC2",
    previewPrefix: "LIGHT_HC",
  },
  {
    palette: darkDimmedPalette,
    itermcolorsPath: "colors/karma-dark-dimmed.itermcolors",
    dynamicProfilePath: "profiles/karma-dark-dimmed.json",
    guid: "71840995-F412-49ED-8B57-EE5201DA9F01",
    previewPrefix: "DARK_DIMMED",
  },
  {
    palette: lightDimmedPalette,
    itermcolorsPath: "colors/karma-light-dimmed.itermcolors",
    dynamicProfilePath: "profiles/karma-light-dimmed.json",
    guid: "49105A3E-97E2-4A5B-BE8F-5F02138B83D4",
    previewPrefix: "LIGHT_DIMMED",
  },
];

const PREVIEW_DATA_PATH = "assets/_preview-data.sh";

async function main(): Promise<void> {
  await Deno.mkdir("colors", { recursive: true });
  await Deno.mkdir("profiles", { recursive: true });
  await Deno.mkdir("assets", { recursive: true });

  // Emit one .itermcolors and one Dynamic Profile JSON per target.
  for (const target of TARGETS) {
    const xml = renderItermcolors(target.palette);
    await Deno.writeTextFile(target.itermcolorsPath, xml);
    console.log(`build: wrote ${target.itermcolorsPath}`);

    const json = renderDynamicProfile(target.palette, { guid: target.guid });
    await Deno.writeTextFile(target.dynamicProfilePath, json);
    console.log(`build: wrote ${target.dynamicProfilePath}`);
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
