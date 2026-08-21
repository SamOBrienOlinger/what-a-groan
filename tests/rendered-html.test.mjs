import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  maximumWordingPoints,
  mishapScore,
  negativeWordScore,
} from "../app/scoring.ts";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("ships the complete game loop", () => {
  assert.match(page, /What happened\?/);
  assert.match(page, /How bad was it\?/);
  assert.match(page, /severity-\$\{mishap\.id\}/);
  assert.doesNotMatch(page, /name="intensity"/);
  assert.match(page, /Issue verdict/);
  assert.match(page, /Share finding/);
});

test("includes eight selectable mishaps", () => {
  const ids = [...page.matchAll(/id: "([a-z]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 8);
  assert.equal(new Set(ids).size, 8);
});

test("keeps the experience local and accessible", () => {
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-pressed=/);
  assert.match(page, /<textarea/);
  assert.match(page, /Your notes stay in this browser/);
  assert.match(page, /No login, mercifully/);
});

test("adds capped points for whole negative words", () => {
  assert.equal(negativeWordScore("bad badminton awful broken"), 6);
  assert.equal(negativeWordScore("A perfectly adequate afternoon"), 0);
  assert.equal(negativeWordScore("awful ".repeat(20)), maximumWordingPoints);
});

test("scores each mishap with its own severity", () => {
  assert.match(page, /A real pain/);
  assert.match(page, /Total nightmare/);
  assert.match(page, /It broke me/);
  assert.equal(mishapScore(8, "", 1), 8);
  assert.equal(mishapScore(8, "awful", 1.5), 17);
  assert.equal(mishapScore(8, "awful", 2), 22);
});

test("keeps scoring private until the final result", () => {
  assert.doesNotMatch(page, /className="points"/);
  assert.doesNotMatch(page, /Wording \+|No wording points|Current reading/);
  assert.doesNotMatch(page, /×\{option\.value\}|groan points|Best on this device/);
  assert.match(page, /out of \{maximumScore\}/);
  assert.match(page, /const maximumScore = mishaps\.reduce/);
});

test("uses finished product metadata", () => {
  assert.match(layout, /WHAT A GROAN!/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
});

test("includes mobile and reduced-motion treatment", () => {
  assert.match(styles, /@media \(max-width: 520px\)/);
  assert.match(styles, /prefers-reduced-motion/);
});
