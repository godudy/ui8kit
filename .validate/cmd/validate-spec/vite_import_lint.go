package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	reRegistryImport     = regexp.MustCompile(`(?m)from\s+["']@registry/`)
	reDeepRelativeImport = regexp.MustCompile(`(?m)from\s+["'](?:\.\./){3,}`)
)

func validateViteImportStyle(repoRoot string) []validationError {
	root := filepath.Join(repoRoot, "examples", "vite", "src")
	if _, err := os.Stat(root); err != nil {
		return nil
	}

	var errs []validationError
	_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			return nil
		}
		if !strings.HasSuffix(path, ".ts") && !strings.HasSuffix(path, ".tsx") {
			return nil
		}
		raw, readErr := os.ReadFile(path)
		if readErr != nil {
			rel, _ := filepath.Rel(repoRoot, path)
			errs = append(errs, validationError{rel, "imports", fmt.Sprintf("read error: %v", readErr)})
			return nil
		}
		text := string(raw)
		hasRegistry := reRegistryImport.MatchString(text)
		hasDeepRelative := reDeepRelativeImport.MatchString(text)
		if hasRegistry && hasDeepRelative {
			rel, _ := filepath.Rel(repoRoot, path)
			errs = append(errs, validationError{
				file:    rel,
				field:   "imports",
				message: "do not mix @registry/* aliases with deep relative imports (../../../...) in the same file",
			})
		}
		return nil
	})

	return errs
}
