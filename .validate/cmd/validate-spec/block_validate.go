package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func validateBlockContract(doc *specDoc, rel string, repoRoot string) []validationError {
	layer := stringField(doc.fm, "layer")
	if layer != "catalog-block" && layer != "primitive" && layer != "composite" {
		return nil
	}
	var errs []validationError
	specDir := filepath.Dir(doc.path)

	dataFile := stringField(doc.fm, "data")
	if dataFile != "" {
		errs = append(errs, validateDataRefs(doc, rel, specDir, dataFile)...)
	}

	variants := stringField(doc.fm, "variants")
	if variants != "" {
		errs = append(errs, validateVariantsFile(doc, rel, specDir, variants)...)
	}

	recipes := getMap(doc.fm, "variant_recipes")
	for _, rawFile := range recipes {
		file, _ := rawFile.(string)
		if file == "" || file == variants {
			continue
		}
		errs = append(errs, validateVariantsFile(doc, rel, specDir, file)...)
	}

	codegen := getMap(doc.fm, "codegen")
	if codegen != nil {
		output := stringField(codegen, "output")
		if output == "" {
			errs = append(errs, validationError{rel, "codegen.output", "required when codegen is set"})
		} else {
			genPath := filepath.Join(specDir, output)
			if _, err := os.Stat(genPath); err != nil {
				errs = append(errs, validationError{rel, "codegen.output", fmt.Sprintf("missing generated file %q; run blockgen", output)})
			}
		}
	}

	return errs
}

func validateDataRefs(doc *specDoc, rel, specDir, dataFile string) []validationError {
	path := filepath.Join(specDir, dataFile)
	raw, err := os.ReadFile(path)
	if err != nil {
		return []validationError{{rel, "data", fmt.Sprintf("missing data file %q", dataFile)}}
	}
	var payload struct {
		Showcase map[string]json.RawMessage `json:"showcase"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return []validationError{{rel, "data", fmt.Sprintf("invalid JSON in %q: %v", dataFile, err)}}
	}
	if payload.Showcase == nil {
		return []validationError{{rel, "data", fmt.Sprintf("%q must contain showcase object", dataFile)}}
	}

	var errs []validationError
	for _, item := range getSlice(doc.fm, "showcase") {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		ref := stringField(m, "ref")
		if ref == "" {
			ref = stringField(m, "id")
		}
		if ref == "" {
			continue
		}
		if _, ok := payload.Showcase[ref]; !ok {
			errs = append(errs, validationError{rel, "showcase", fmt.Sprintf("ref %q missing from %s showcase", ref, dataFile)})
		}
	}
	return errs
}

func validateVariantsFile(doc *specDoc, rel, specDir, variantsFile string) []validationError {
	path := filepath.Join(specDir, variantsFile)
	raw, err := os.ReadFile(path)
	if err != nil {
		return []validationError{{rel, "variants", fmt.Sprintf("missing variants file %q", variantsFile)}}
	}
	byKey, defaults, err := loadVariantsByKey(raw)
	if err != nil {
		return []validationError{{rel, "variants", err.Error()}}
	}

	var errs []validationError

	// Forbid empty-string byKey entries; every key must be non-empty.
	for k, m := range byKey {
		if _, ok := m[""]; ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("byKey[%s] contains empty-string key; move its class under a named variant (e.g. \"default\")", k)})
		}
	}

	// defaults[k] must reference a non-empty key present in byKey[k].
	for k, def := range defaults {
		if def == "" {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s] is empty-string; set it to a real key in byKey[%s]", k, k)})
			continue
		}
		allowed, ok := byKey[k]
		if !ok {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s] references missing byKey[%s]", k, k)})
			continue
		}
		if _, present := allowed[def]; !present {
			errs = append(errs, validationError{rel, "variants", fmt.Sprintf("defaults[%s]=%q not found in byKey[%s]", k, def, k)})
		}
	}

	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return errs
	}

	// allow-list-source may reference the variants file by its full spec-relative
	// path or by its short basename (e.g. "home.variants.json#toolTone" even when
	// `variants:` points into a shared runtime-neutral location such as
	// examples/data/home.variants.json via several "../" segments).
	basenamePrefix := filepath.Base(variantsFile) + "#"
	fullPrefix := variantsFile + "#"
	for field, rawField := range api {
		fm, _ := rawField.(map[string]any)
		if fm == nil {
			continue
		}
		source, _ := fm["allow-list-source"].(string)
		var key string
		switch {
		case strings.HasPrefix(source, fullPrefix):
			key = strings.TrimPrefix(source, fullPrefix)
		case strings.HasPrefix(source, basenamePrefix):
			key = strings.TrimPrefix(source, basenamePrefix)
		default:
			continue
		}
		specEnum := getStringSliceAny(fm["enum"])
		codeEnum := sortedMapKeys(byKey[key])
		missing, extra := diffEnum(specEnum, codeEnum)
		if len(missing) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("api.enum missing values from %s: %v", source, missing)})
		}
		if len(extra) > 0 {
			errs = append(errs, validationError{rel, field, fmt.Sprintf("api.enum has extra values not in %s: %v", source, extra)})
		}
	}
	return errs
}

func loadVariantsByKey(raw []byte) (map[string]map[string]string, map[string]string, error) {
	var payload struct {
		ByKey    map[string]map[string]string `json:"byKey"`
		Defaults map[string]string            `json:"defaults"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, nil, fmt.Errorf("invalid variants JSON: %w", err)
	}
	if payload.ByKey == nil {
		return nil, nil, fmt.Errorf("variants JSON missing byKey")
	}
	return payload.ByKey, payload.Defaults, nil
}

func sortedMapKeys(m map[string]string) []string {
	if m == nil {
		return nil
	}
	keys := map[string]bool{}
	for k := range m {
		keys[k] = true
	}
	return sortedKeys(keys)
}

func getMap(fm map[string]any, key string) map[string]any {
	v, _ := fm[key].(map[string]any)
	return v
}
