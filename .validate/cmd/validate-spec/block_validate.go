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
	if layer != "catalog-block" {
		return nil
	}
	var errs []validationError
	specDir := filepath.Dir(doc.path)

	dataFile := stringField(doc.fm, "data")
	if dataFile != "" {
		errs = append(errs, validateDataRefs(doc, rel, specDir, dataFile)...)
	}

	variantsFile := stringField(doc.fm, "variants")
	if variantsFile != "" {
		errs = append(errs, validateVariantsFile(doc, rel, specDir, variantsFile)...)
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
	keys, err := loadVariantsByKey(raw)
	if err != nil {
		return []validationError{{rel, "variants", err.Error()}}
	}

	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return nil
	}

	var errs []validationError
	for field, rawField := range api {
		fm, _ := rawField.(map[string]any)
		if fm == nil {
			continue
		}
		source, _ := fm["allow-list-source"].(string)
		if !strings.HasPrefix(source, variantsFile+"#") {
			continue
		}
		key := strings.TrimPrefix(source, variantsFile+"#")
		specEnum := getStringSliceAny(fm["enum"])
		codeEnum := sortedMapKeys(keys[key])
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

func loadVariantsByKey(raw []byte) (map[string]map[string]string, error) {
	var payload struct {
		ByKey map[string]map[string]string `json:"byKey"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, fmt.Errorf("invalid variants JSON: %w", err)
	}
	if payload.ByKey == nil {
		return nil, fmt.Errorf("variants JSON missing byKey")
	}
	return payload.ByKey, nil
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
