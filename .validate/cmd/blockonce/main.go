// blockonce enforces the "one Block per file" layout rule.
//
// Rule (see .cursor/rules/templ-layout-grammar.mdc, rule 6):
//   <Block> appears at most once per file. Subsequent inner containers
//   must use <Box>, <Stack>, or <Group>.
//
// The tool scans TSX (`*.tsx`) and Templ (`*.templ`) files under the
// registry and examples. For each file it counts top-level Block invocations
// and fails with a line-numbered report if any file has more than one.
//
// Counting rules:
//   TSX:   `<Block` token followed by whitespace, `>`, or `/`
//   Templ: `@ui.Block(` or any `@<pkg>.Block(` invocation
//
// Cross-file composition is unaffected: rendering <Sidebar /> from another
// file does not count toward the current file's Block budget.
package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

var (
	tsxBlockRe   = regexp.MustCompile(`<Block(\s|>|/)`)
	templBlockRe = regexp.MustCompile(`@\w+\.Block\(`)
)

type hit struct {
	path string
	line int
	text string
}

func main() {
	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "blockonce: %v\n", err)
		os.Exit(1)
	}

	roots := []string{
		filepath.Join(repoRoot, "ui"),
		filepath.Join(repoRoot, "components"),
		filepath.Join(repoRoot, "examples", "vite", "src"),
		filepath.Join(repoRoot, "examples", "templ"),
	}

	var allErrs []string
	for _, root := range roots {
		errs := scanRoot(repoRoot, root)
		allErrs = append(allErrs, errs...)
	}

	if len(allErrs) > 0 {
		fmt.Fprintf(os.Stderr, "blockonce: %d violation(s)\n", len(allErrs))
		for _, e := range allErrs {
			fmt.Fprintf(os.Stderr, "%s\n", e)
		}
		os.Exit(1)
	}
	fmt.Println("blockonce: ok")
}

func findRepoRoot() (string, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	dir := cwd
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("go.mod not found from %s", cwd)
		}
		dir = parent
	}
}

func scanRoot(repoRoot, root string) []string {
	if _, err := os.Stat(root); err != nil {
		return nil
	}

	var paths []string
	_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return nil
		}
		name := d.Name()
		// Skip generated files: *_templ.go is templ output, block_gen.go etc.
		if strings.HasSuffix(name, ".tsx") || strings.HasSuffix(name, ".templ") {
			// Skip the Block primitive itself; it defines <Block> but does not
			// use it as a layout entry.
			if isBlockPrimitive(path) {
				return nil
			}
			paths = append(paths, path)
		}
		return nil
	})
	sort.Strings(paths)

	var errs []string
	for _, p := range paths {
		hits, err := countBlocks(p)
		if err != nil {
			errs = append(errs, fmt.Sprintf("  %s: read error: %v", relPath(repoRoot, p), err))
			continue
		}
		if len(hits) > 1 {
			rel := relPath(repoRoot, p)
			lines := []string{fmt.Sprintf("  %s: <Block> appears %d times (expected ≤ 1)", rel, len(hits))}
			for _, h := range hits {
				lines = append(lines, fmt.Sprintf("    line %d: %s", h.line, strings.TrimSpace(h.text)))
			}
			lines = append(lines, "    fix: keep one <Block> as the file entry point; replace subsequent")
			lines = append(lines, "         landmark wrappers with <Box>, <Stack>, or <Group>, or extract them")
			lines = append(lines, "         into their own composite file.")
			errs = append(errs, strings.Join(lines, "\n"))
		}
	}
	return errs
}

func isBlockPrimitive(path string) bool {
	p := filepath.ToSlash(path)
	return strings.HasSuffix(p, "/ui/block/block.tsx") ||
		strings.HasSuffix(p, "/ui/block/block.templ")
}

func countBlocks(path string) ([]hit, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var re *regexp.Regexp
	if strings.HasSuffix(path, ".tsx") {
		re = tsxBlockRe
	} else {
		re = templBlockRe
	}

	var hits []hit
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	lineNum := 0
	for scanner.Scan() {
		lineNum++
		line := scanner.Text()
		// Skip simple line comments to avoid false positives.
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "//") {
			continue
		}
		for _, idx := range re.FindAllStringIndex(line, -1) {
			hits = append(hits, hit{path: path, line: lineNum, text: line[max0(idx[0]-2):min(len(line), idx[1]+8)]})
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return hits, nil
}

func max0(v int) int {
	if v < 0 {
		return 0
	}
	return v
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func relPath(repoRoot, p string) string {
	rel, err := filepath.Rel(repoRoot, p)
	if err != nil {
		return p
	}
	return filepath.ToSlash(rel)
}
