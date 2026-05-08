/**
 * Unit tests for `renderDynamicProfile` in `./dynamic-profile.ts`.
 *
 * Run via `deno task test`.
 */

import { assertEquals, assertStringIncludes, assertThrows } from "@std/assert";

import { renderDynamicProfile } from "./dynamic-profile.ts";
import type { Palette } from "../palette/types.ts";

const SAMPLE: Palette = {
  name: "Karma Test",
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
    brightWhite: "#ffffff",
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

const FIXED_GUID = "1EBF97F9-AA53-4BBA-BFE3-90590577C52E";

function parse(out: string): { Profiles: Array<Record<string, unknown>> } {
  return JSON.parse(out);
}

Deno.test("renderDynamicProfile: produces valid JSON with one profile", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const doc = parse(out);
  assertEquals(Array.isArray(doc.Profiles), true);
  assertEquals(doc.Profiles.length, 1);
});

Deno.test("renderDynamicProfile: emits the required Name and Guid", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const profile = parse(out).Profiles[0];
  assertEquals(profile.Name, "Karma Test");
  assertEquals(profile.Guid, FIXED_GUID);
});

Deno.test("renderDynamicProfile: defaults parent to 'Default'", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const profile = parse(out).Profiles[0];
  assertEquals(profile["Dynamic Profile Parent Name"], "Default");
});

Deno.test("renderDynamicProfile: respects custom parent profile name", () => {
  const out = renderDynamicProfile(SAMPLE, {
    guid: FIXED_GUID,
    parentProfileName: "Light Background",
  });
  const profile = parse(out).Profiles[0];
  assertEquals(profile["Dynamic Profile Parent Name"], "Light Background");
});

Deno.test("renderDynamicProfile: emits all 24 standard color keys", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const profile = parse(out).Profiles[0];
  const expected = [
    "Ansi 0 Color",
    "Ansi 1 Color",
    "Ansi 2 Color",
    "Ansi 3 Color",
    "Ansi 4 Color",
    "Ansi 5 Color",
    "Ansi 6 Color",
    "Ansi 7 Color",
    "Ansi 8 Color",
    "Ansi 9 Color",
    "Ansi 10 Color",
    "Ansi 11 Color",
    "Ansi 12 Color",
    "Ansi 13 Color",
    "Ansi 14 Color",
    "Ansi 15 Color",
    "Background Color",
    "Bold Color",
    "Cursor Color",
    "Cursor Text Color",
    "Foreground Color",
    "Link Color",
    "Selected Text Color",
    "Selection Color",
  ];
  for (const key of expected) {
    assertEquals(typeof profile[key], "object", `missing key: ${key}`);
  }
});

Deno.test("renderDynamicProfile: NSColor dicts have correct shape", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const profile = parse(out).Profiles[0] as Record<string, Record<string, unknown>>;
  const red = profile["Ansi 1 Color"];
  // #fc618d = (252, 97, 141) / 255
  assertEquals(red["Alpha Component"], 1);
  assertEquals(red["Color Space"], "sRGB");
  assertEquals(red["Red Component"], 252 / 255);
  assertEquals(red["Green Component"], 97 / 255);
  assertEquals(red["Blue Component"], 141 / 255);
});

Deno.test("renderDynamicProfile: output ends with trailing newline", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  assertEquals(out.endsWith("\n"), true);
  assertEquals(out.endsWith("\n\n"), false);
});

Deno.test("renderDynamicProfile: JSON is human-readable (2-space indent)", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  // Indentation produces lines starting with multiples of 2 spaces.
  assertStringIncludes(out, "\n  ");
  assertStringIncludes(out, "\n    ");
});

Deno.test("renderDynamicProfile: identity keys come before color keys", () => {
  const out = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const nameIdx = out.indexOf('"Name"');
  const ansi0Idx = out.indexOf('"Ansi 0 Color"');
  const bgIdx = out.indexOf('"Background Color"');
  assertEquals(nameIdx > 0, true);
  assertEquals(nameIdx < ansi0Idx, true, "Name must come before Ansi 0 Color");
  assertEquals(nameIdx < bgIdx, true, "Name must come before Background Color");
});

Deno.test("renderDynamicProfile: deterministic — same input → same output", () => {
  const a = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const b = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  assertEquals(a, b);
});

Deno.test("renderDynamicProfile: different Guids produce different output", () => {
  const a = renderDynamicProfile(SAMPLE, { guid: FIXED_GUID });
  const b = renderDynamicProfile(SAMPLE, {
    guid: "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF",
  });
  assertEquals(a === b, false);
});

Deno.test("renderDynamicProfile: throws on invalid palette hex", () => {
  const broken: Palette = {
    ...SAMPLE,
    ansi: { ...SAMPLE.ansi, red: "not-a-hex" },
  };
  assertThrows(
    () => renderDynamicProfile(broken, { guid: FIXED_GUID }),
    Error,
    "Invalid hex color",
  );
});
