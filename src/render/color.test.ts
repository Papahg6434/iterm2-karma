/**
 * Unit tests for `parseHex` in `./color.ts`.
 *
 * Run via `deno task test`.
 */

import { assertAlmostEquals, assertEquals, assertThrows } from "@std/assert";

import { parseHex, parseHexBytes } from "./color.ts";

const FLOAT_TOLERANCE = 1e-9;

Deno.test("parseHex: parses lowercase 6-digit hex with leading #", () => {
  const result = parseHex("#fc618d");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 97 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 141 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: parses uppercase 6-digit hex with leading #", () => {
  const result = parseHex("#FC618D");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 97 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 141 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: parses mixed-case 6-digit hex with leading #", () => {
  const result = parseHex("#Fc618D");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 97 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 141 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: accepts hex without leading #", () => {
  const result = parseHex("fc618d");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 97 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 141 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: trims surrounding whitespace", () => {
  const result = parseHex("  #fc618d  ");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 97 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 141 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: handles tabs and newlines as whitespace", () => {
  const result = parseHex("\t#fc618d\n");
  assertAlmostEquals(result.red, 252 / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: returns exact 0 for #000000", () => {
  assertEquals(parseHex("#000000"), { red: 0, green: 0, blue: 0 });
});

Deno.test("parseHex: returns exact 1 for #ffffff", () => {
  assertEquals(parseHex("#ffffff"), { red: 1, green: 1, blue: 1 });
});

Deno.test("parseHex: returns exact 1 for #FFFFFF (uppercase)", () => {
  assertEquals(parseHex("#FFFFFF"), { red: 1, green: 1, blue: 1 });
});

// Karma Dark accents — sanity-check a handful of real palette values.
Deno.test("parseHex: parses Karma Dark green #7bd88f", () => {
  const result = parseHex("#7bd88f");
  assertAlmostEquals(result.red, 0x7b / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 0xd8 / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 0x8f / 255, FLOAT_TOLERANCE);
});

Deno.test("parseHex: parses Karma Dark background #0a0e14", () => {
  const result = parseHex("#0a0e14");
  assertAlmostEquals(result.red, 0x0a / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.green, 0x0e / 255, FLOAT_TOLERANCE);
  assertAlmostEquals(result.blue, 0x14 / 255, FLOAT_TOLERANCE);
});

// Negative cases — every invalid input must throw with a message that includes
// the original (untrimmed, original-case) string for downstream diagnostics.

Deno.test("parseHex: throws on empty string", () => {
  assertThrows(() => parseHex(""), Error, 'Invalid hex color: ""');
});

Deno.test("parseHex: throws on whitespace-only input (preserves original in error)", () => {
  // Whitespace trims to empty internally, but the error message must still
  // surface the original whitespace input for downstream diagnostics.
  assertThrows(() => parseHex("   "), Error, 'Invalid hex color: "   "');
});

Deno.test("parseHex: throws on '#' alone", () => {
  assertThrows(() => parseHex("#"), Error, 'Invalid hex color: "#"');
});

Deno.test("parseHex: throws on 3-digit shorthand", () => {
  assertThrows(() => parseHex("#abc"), Error, 'Invalid hex color: "#abc"');
});

Deno.test("parseHex: throws on 5 digits", () => {
  assertThrows(() => parseHex("#abcde"), Error, 'Invalid hex color: "#abcde"');
});

Deno.test("parseHex: throws on 7 digits", () => {
  assertThrows(() => parseHex("#abcdefg"), Error, 'Invalid hex color: "#abcdefg"');
});

Deno.test("parseHex: throws on 8-digit hex (alpha not supported)", () => {
  assertThrows(() => parseHex("#fc618dff"), Error, 'Invalid hex color: "#fc618dff"');
});

Deno.test("parseHex: throws on non-hex characters", () => {
  assertThrows(() => parseHex("#zzzzzz"), Error, 'Invalid hex color: "#zzzzzz"');
});

Deno.test("parseHex: throws on css rgb() format", () => {
  assertThrows(() => parseHex("rgb(252,97,141)"), Error, 'Invalid hex color: "rgb(252,97,141)"');
});

Deno.test("parseHex: throws on internal whitespace", () => {
  assertThrows(() => parseHex("#fc 618d"), Error, 'Invalid hex color: "#fc 618d"');
});

Deno.test("parseHex: throws on multiple leading # characters", () => {
  assertThrows(() => parseHex("##fc618d"), Error, 'Invalid hex color: "##fc618d"');
});

Deno.test("parseHex: error message preserves original casing", () => {
  // assertThrows substring match is case-sensitive; this guards that we don't
  // lowercase the input before embedding it in the error message.
  assertThrows(() => parseHex("#GHIJKL"), Error, '"#GHIJKL"');
});

// --- parseHexBytes (raw 0..255 ints) ---------------------------------------

Deno.test("parseHexBytes: returns raw integer bytes for lowercase hex", () => {
  const result = parseHexBytes("#fc618d");
  assertEquals(result, { r: 252, g: 97, b: 141 });
});

Deno.test("parseHexBytes: handles uppercase, no #, and whitespace identically", () => {
  assertEquals(parseHexBytes("FC618D"), { r: 252, g: 97, b: 141 });
  assertEquals(parseHexBytes("  #FC618D  "), { r: 252, g: 97, b: 141 });
});

Deno.test("parseHexBytes: returns 0,0,0 for #000000 and 255,255,255 for #ffffff", () => {
  assertEquals(parseHexBytes("#000000"), { r: 0, g: 0, b: 0 });
  assertEquals(parseHexBytes("#ffffff"), { r: 255, g: 255, b: 255 });
});

Deno.test("parseHexBytes: throws on invalid input with the same message as parseHex", () => {
  assertThrows(
    () => parseHexBytes("#abcde"),
    Error,
    'Invalid hex color: "#abcde"',
  );
});

Deno.test("parseHex and parseHexBytes share validation (parity check)", () => {
  // Any input rejected by parseHex must be rejected by parseHexBytes — and
  // vice versa — because parseHex internally delegates to parseHexBytes.
  for (const bad of ["", "#abc", "#zzzzzz", "rgb(1,2,3)", "#fc 618d"]) {
    assertThrows(() => parseHex(bad));
    assertThrows(() => parseHexBytes(bad));
  }
});
