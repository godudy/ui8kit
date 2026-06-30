#!/usr/bin/env bun
/** Fix templ children: wrap bare expressions in { expr } */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, relative } from "path";

const NAMES =
  "Text|Inline|Title|FormDescription|FormMessage|CardTitle|CardDescription|SheetTitle|SheetDescription";

function fix(text: string): { text: string; n: number } {
  let n = 0;
  const re = new RegExp(
    `@((?:ui|cmp)\\.(${NAMES})\\([^\\)]*\\)) \\{ ([^{][^}]*) \\}`,
    "g"
  );
  text = text.replace(re, (_m, call, _name, inner) => {
    const trimmed = inner.trim();
    if (trimmed.startsWith("{")) return _m;
    n++;
    return `@${call} { { ${trimmed} } }`;
  });
  return { text, n };
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
let total = 0;
for (const r of ["ui", "components", join("examples", "templ")]) {
  for (const path of walk(join(root, r))) {
    if (!path.endsWith(".templ") && !path.endsWith(".spec.md")) continue;
    const original = readFileSync(path, "utf8");
    const { text, n } = fix(original);
    if (n > 0) {
      writeFileSync(path, text.replace(/\r\n/g, "\n"), "utf8");
      console.log(`${relative(root, path)}: ${n}`);
      total += n;
    }
  }
}
console.log(`done: ${total}`);
