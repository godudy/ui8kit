package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type variantJSON struct {
	Keys     []string                     `json:"keys"`
	Defaults map[string]string            `json:"defaults"`
	ByKey    map[string]map[string]string `json:"byKey"`
}

func validateAllVariantJSON(repoRoot string) []validationError {
	var errs []validationError
	for _, path := range discoverVariantJSONFiles(repoRoot) {
		fileErrs := validateVariantJSONFile(repoRoot, path)
		errs = append(errs, fileErrs...)
	}
	return errs
}

func discoverVariantJSONFiles(repoRoot string) []string {
	roots := []string{
		filepath.Join(repoRoot, "ui"),
		filepath.Join(repoRoot, "components"),
		filepath.Join(repoRoot, "examples"),
	}
	var out []string
	for _, root := range roots {
		if _, err := os.Stat(root); err != nil {
			continue
		}
		_ = filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
			if err != nil {
				return nil
			}
			if d.IsDir() {
				return nil
			}
			if strings.HasSuffix(d.Name(), ".variants.json") {
				out = append(out, path)
			}
			return nil
		})
	}
	sort.Strings(out)
	return out
}

func validateVariantJSONFile(repoRoot, path string) []validationError {
	rel, _ := filepath.Rel(repoRoot, path)
	raw, err := os.ReadFile(path)
	if err != nil {
		return []validationError{{rel, "variants", fmt.Sprintf("read error: %v", err)}}
	}

	var payload variantJSON
	if err := json.Unmarshal(raw, &payload); err != nil {
		return []validationError{{rel, "variants", fmt.Sprintf("invalid JSON: %v", err)}}
	}

	var errs []validationError
	keySet := map[string]bool{}
	for _, key := range payload.Keys {
		k := strings.TrimSpace(key)
		if k == "" {
			errs = append(errs, validationError{rel, "variants", "keys contains empty entry"})
			continue
		}
		keySet[k] = true
	}

	if len(payload.Keys) == 0 {
		if len(payload.ByKey) > 0 {
			errs = append(errs, validationError{rel, "variants", "keys is empty but byKey is non-empty"})
		}
		if len(payload.Defaults) > 0 {
			errs = append(errs, validationError{rel, "variants", "keys is empty but defaults is non-empty"})
		}
		return errs
	}

	if len(payload.ByKey) == 0 {
		errs = append(errs, validationError{rel, "variants", "keys is non-empty but byKey is empty"})
		return errs
	}

	for _, key := range payload.Keys {
		if _, ok := payload.ByKey[key]; !ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("keys contains %q but byKey[%s] is missing", key, key)})
		}
	}

	for key, options := range payload.ByKey {
		if strings.TrimSpace(key) == "" {
			errs = append(errs, validationError{rel, "variants", "byKey contains empty key name"})
			continue
		}
		if !keySet[key] {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("byKey[%s] exists but keys is missing %q", key, key)})
		}
		if len(options) == 0 {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("byKey[%s] has no options", key)})
		}
		if _, ok := options[""]; ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("byKey[%s] contains empty-string key; use a named variant key", key)})
		}
	}

	for key, def := range payload.Defaults {
		if strings.TrimSpace(key) == "" {
			errs = append(errs, validationError{rel, "variants", "defaults contains empty key name"})
			continue
		}
		def = strings.TrimSpace(def)
		if def == "" {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s] is empty-string; set it to a real key in byKey[%s]", key, key)})
			continue
		}
		options, ok := payload.ByKey[key]
		if !ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s] references missing byKey[%s]", key, key)})
			continue
		}
		if _, ok := options[def]; !ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s]=%q not found in byKey[%s]", key, def, key)})
		}
	}

	return errs
}
