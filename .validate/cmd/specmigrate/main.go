package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

func main() {
	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "specmigrate: %v\n", err)
		os.Exit(1)
	}
	specs, err := discoverUISpecs(repoRoot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "specmigrate: %v\n", err)
		os.Exit(1)
	}
	for _, specPath := range specs {
		if err := migrateSpec(specPath); err != nil {
			fmt.Fprintf(os.Stderr, "specmigrate: %s: %v\n", specPath, err)
			os.Exit(1)
		}
	}
	fmt.Printf("specmigrate: OK (%d specs)\n", len(specs))
}

func findRepoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			if _, err := os.Stat(filepath.Join(dir, "ui")); err == nil {
				return dir, nil
			}
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "", fmt.Errorf("repo root not found")
		}
		dir = parent
	}
}

func discoverUISpecs(repoRoot string) ([]string, error) {
	root := filepath.Join(repoRoot, "ui")
	var paths []string
	err := filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		if strings.HasSuffix(path, ".spec.md") {
			paths = append(paths, path)
		}
		return nil
	})
	return paths, err
}

func migrateSpec(specPath string) error {
	raw, err := os.ReadFile(specPath)
	if err != nil {
		return err
	}
	text := strings.ReplaceAll(string(raw), "\r\n", "\n")
	if !strings.HasPrefix(text, "---\n") {
		return nil
	}
	end := strings.Index(text[4:], "\n---")
	if end < 0 {
		return nil
	}
	fmText := text[4 : 4+end]
	body := strings.TrimLeft(text[4+end+4:], "\n")
	fm := map[string]any{}
	if err := yaml.Unmarshal([]byte(fmText), &fm); err != nil {
		return err
	}
	layer, _ := fm["layer"].(string)
	if layer != "primitive" {
		return nil
	}
	if _, ok := fm["targets"]; ok {
		return nil
	}

	dir := filepath.Dir(specPath)
	baseName := strings.TrimSuffix(filepath.Base(specPath), ".spec.md")
	pkg := stringField(fm, "package")
	facade := stringField(fm, "facade")
	component := stringField(fm, "templ")
	id := stringField(fm, "id")

	variantsFile := baseName + ".variants.json"
	dataFile := baseName + ".data.json"
	if _, err := os.Stat(filepath.Join(dir, variantsFile)); err != nil {
		// fallback to brick folder name for single-spec dirs
		brick := filepath.Base(dir)
		if brick != baseName {
			alt := brick + ".variants.json"
			if _, err2 := os.Stat(filepath.Join(dir, alt)); err2 == nil {
				variantsFile = alt
			}
		}
	}
	if _, err := os.Stat(filepath.Join(dir, dataFile)); err != nil {
		brick := filepath.Base(dir)
		if brick != baseName {
			alt := brick + ".data.json"
			if _, err2 := os.Stat(filepath.Join(dir, alt)); err2 == nil {
				dataFile = alt
			}
		}
	}

	fm["targets"] = map[string]any{
		"templ": map[string]any{
			"package":   pkg,
			"facade":    facade,
			"component": component,
		},
		"react": map[string]any{
			"package":   reactPackage(id),
			"facade":    "@fastygo/templ-react",
			"component": component,
		},
	}
	fm["variants"] = variantsFile
	fm["data"] = dataFile

	api, _ := fm["api"].(map[string]any)
	if api != nil {
		for field, raw := range api {
			fmField, _ := raw.(map[string]any)
			if fmField == nil {
				continue
			}
			role := stringField(fmField, "role")
			switch role {
			case "appearance", "density":
				if _, hasEnum := fmField["enum"]; hasEnum {
					fmField["cva"] = true
					key := strings.ToLower(field)
					if field == "Variant" {
						key = "variant"
					}
					if field == "Size" {
						key = "size"
					}
					if field == "Orientation" {
						key = "orientation"
					}
					if field == "Type" && id == "ui.icon" {
						key = "type"
					}
					if strings.Contains(field, "Fit") || field == "Fit" {
						key = "fit"
					}
					if field == "Position" {
						key = "position"
					}
					if field == "Aspect" {
						key = "aspect"
					}
					fmField["allow-list-source"] = variantsFile + "#" + key
				}
			case "style-extension", "html-attrs", "identity", "state", "accessible-name", "navigation", "control-type", "association", "landmark-tag", "stack-tag", "column-count":
				fmField["cva"] = false
			default:
				if _, ok := fmField["cva"]; !ok {
					fmField["cva"] = false
				}
			}
			api[field] = fmField
		}
		fm["api"] = api
	}

	showcase := getSlice(fm, "showcase")
	for i, item := range showcase {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		id := stringField(m, "id")
		if id != "" {
			m["ref"] = id
		}
		showcase[i] = m
	}
	if len(showcase) > 0 {
		fm["showcase"] = showcase
	}

	semantics, _ := fm["semantics"].(map[string]any)
	if semantics == nil {
		semantics = map[string]any{}
	}
	semantics["data"] = dataFile
	fm["semantics"] = semantics

	newFM, err := yaml.Marshal(fm)
	if err != nil {
		return err
	}
	newText := "---\n" + string(newFM) + "---\n" + body
	if string(raw) == newText {
		return nil
	}
	if err := os.WriteFile(specPath, []byte(newText), 0o644); err != nil {
		return err
	}
	fmt.Printf("specmigrate: updated %s\n", specPath)
	return nil
}

func reactPackage(id string) string {
	suffix := strings.TrimPrefix(id, "ui.")
	if suffix == "" {
		return "@fastygo/templ-react/ui"
	}
	return "@fastygo/templ-react/ui/" + suffix
}

func getSlice(fm map[string]any, key string) []any {
	v, ok := fm[key]
	if !ok {
		return nil
	}
	s, _ := v.([]any)
	return s
}

func stringField(m map[string]any, key string) string {
	v, _ := m[key].(string)
	return v
}
