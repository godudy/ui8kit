#!/usr/bin/env python3
"""One-off: convert @ui.Text(p, value) to @ui.Text(p) { value } for parity sweep."""
from __future__ import annotations

import re
import sys
from pathlib import Path

COMPONENTS = [
    ("ui", "Text"),
    ("ui", "Inline"),
    ("ui", "Title"),
    ("ui", "FormDescription"),
    ("ui", "FormMessage"),
    ("cmp", "CardTitle"),
    ("cmp", "CardDescription"),
    ("cmp", "SheetTitle"),
    ("cmp", "SheetDescription"),
]


def depth_delta(ch: str) -> int:
    if ch in "({":
        return 1
    if ch in ")}":
        return -1
    return 0


def convert_content(text: str) -> tuple[str, int]:
    changes = 0
    for prefix, name in COMPONENTS:
        needle = f"@{prefix}.{name}("
        pos = 0
        while True:
            start = text.find(needle, pos)
            if start == -1:
                break
            i = start + len(needle)
            depth = 1
            in_string = False
            string_quote = ""
            while i < len(text) and depth > 0:
                ch = text[i]
                if in_string:
                    if ch == string_quote and text[i - 1] != "\\":
                        in_string = False
                elif ch in "\"'`":
                    in_string = True
                    string_quote = ch
                else:
                    depth += depth_delta(ch)
                i += 1
            if depth != 0:
                pos = start + len(needle)
                continue
            inner = text[start + len(needle) : i - 1]
            split_at = -1
            depth = 0
            in_string = False
            string_quote = ""
            for j, ch in enumerate(inner):
                if in_string:
                    if ch == string_quote and (j == 0 or inner[j - 1] != "\\"):
                        in_string = False
                elif ch in "\"'`":
                    in_string = True
                    string_quote = ch
                else:
                    if ch in "({":
                        depth += 1
                    elif ch in ")}":
                        depth -= 1
                    elif ch == "," and depth == 0:
                        split_at = j
            if split_at == -1:
                pos = i
                continue
            args = inner[:split_at].strip()
            value = inner[split_at + 1 :].strip()
            replacement = f"@{prefix}.{name}({args}) {{ {value} }}"
            text = text[:start] + replacement + text[i:]
            changes += 1
            pos = start + len(replacement)
    return text, changes


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    globs = [
        "ui/**/*.templ",
        "ui/**/*.spec.md",
        "components/**/*.templ",
        "components/**/*.spec.md",
        "examples/templ/**/*.templ",
    ]
    total = 0
    for pattern in globs:
        for path in root.glob(pattern):
            if path.name.endswith("_templ.go"):
                continue
            original = path.read_text(encoding="utf-8")
            converted, n = convert_content(original)
            if n:
                path.write_text(converted, encoding="utf-8", newline="\n")
                print(f"{path.relative_to(root)}: {n} conversion(s)")
                total += n
    print(f"done: {total} conversion(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
