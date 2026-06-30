#!/usr/bin/env bun
/** One-off: convert @ui.Text(p, value) to @ui.Text(p) { value } */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, relative } from "path";

const COMPONENTS = [
  ["ui", "Text"],
  ["ui", "Inline"],
  ["ui", "Title"],
  ["ui", "FormDescription"],
  ["ui", "FormMessage"],
  ["cmp", "CardTitle"],
  ["cmp", "CardDescription"],
  ["cmp", "SheetTitle"],
  ["cmp", "SheetDescription"],
] as const;

function depthDelta(ch: string): number {
  if ("({".includes(ch)) return 1;
  if (")}".includes(ch)) return -1;
  return 0;
}

function convertContent(text: string): { text: string; changes: number } {
  let changes = 0;
  for (const [prefix, name] of COMPONENTS) {
    const needle = `@${prefix}.${name}(`;
    let pos = 0;
    while (true) {
      const start = text.indexOf(needle, pos);
      if (start === -1) break;
      let i = start + needle.length;
      let depth = 1;
      let inString = false;
      let stringQuote = "";
      while (i < text.length && depth > 0) {
        const ch = text[i];
        if (inString) {
          if (ch === stringQuote && text[i - 1] !== "\\") inString = false;
        } else if ('"`\''.includes(ch)) {
          inString = true;
          stringQuote = ch;
        } else {
          depth += depthDelta(ch);
        }
        i++;
      }
      if (depth !== 0) {
        pos = start + needle.length;
        continue;
      }
      const inner = text.slice(start + needle.length, i - 1);
      let splitAt = -1;
      depth = 0;
      inString = false;
      stringQuote = "";
      for (let j = 0; j < inner.length; j++) {
        const ch = inner[j];
        if (inString) {
          if (ch === stringQuote && (j === 0 || inner[j - 1] !== "\\")) inString = false;
        } else if ('"`\''.includes(ch)) {
          inString = true;
          stringQuote = ch;
        } else {
          if ("({".includes(ch)) depth++;
          else if (")}".includes(ch)) depth--;
          else if (ch === "," && depth === 0) splitAt = j;
        }
      }
      if (splitAt === -1) {
        pos = i;
        continue;
      }
      const args = inner.slice(0, splitAt).trim();
      const value = inner.slice(splitAt + 1).trim();
      const replacement = `@${prefix}.${name}(${args}) { ${value} }`;
      text = text.slice(0, start) + replacement + text.slice(i);
      changes++;
      pos = start + replacement.length;
    }
  }
  return { text, changes };
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    if (statSync(p).isDirectory()) acc = walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const root = join(import.meta.dir, "../..");
const roots = ["ui", "components", join("examples", "templ")];
let total = 0;
for (const r of roots) {
  const base = join(root, r);
  for (const path of walk(base)) {
    if (!path.endsWith(".templ") && !path.endsWith(".spec.md")) continue;
    if (path.includes("_templ.go")) continue;
    const original = readFileSync(path, "utf8");
    const { text, changes } = convertContent(original);
    if (changes > 0) {
      writeFileSync(path, text.replace(/\r\n/g, "\n"), "utf8");
      console.log(`${relative(root, path)}: ${changes}`);
      total += changes;
    }
  }
}
console.log(`done: ${total}`);
