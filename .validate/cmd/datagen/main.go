package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

func main() {
	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "datagen: %v\n", err)
		os.Exit(1)
	}
	specs, err := discoverUISpecs(repoRoot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "datagen: %v\n", err)
		os.Exit(1)
	}
	for _, specPath := range specs {
		if err := generateDataFile(specPath); err != nil {
			fmt.Fprintf(os.Stderr, "datagen: %s: %v\n", specPath, err)
			os.Exit(1)
		}
	}
	fmt.Printf("datagen: OK (%d specs)\n", len(specs))
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

func generateDataFile(specPath string) error {
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
	fm := map[string]any{}
	if err := yaml.Unmarshal([]byte(fmText), &fm); err != nil {
		return err
	}
	layer, _ := fm["layer"].(string)
	if layer != "primitive" {
		return nil
	}
	id, _ := fm["id"].(string)
	if id == "" {
		return nil
	}
	dir := filepath.Dir(specPath)
	baseName := strings.TrimSuffix(filepath.Base(specPath), ".spec.md")
	dataFile := baseName + ".data.json"
	outPath := filepath.Join(dir, dataFile)

	showcase := getSlice(fm, "showcase")
	if len(showcase) == 0 {
		return nil
	}

	showcaseMap := map[string]any{}
	for _, item := range showcase {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		id := stringField(m, "id")
		if id == "" {
			continue
		}
		entry := map[string]any{}
		if props, ok := m["props"].(map[string]any); ok && len(props) > 0 {
			entry["props"] = normalizeProps(props)
		}
		if children, ok := m["children"].(map[string]any); ok {
			entry["children"] = children
		}
		if text, ok := m["text"].(string); ok && text != "" {
			entry["children"] = map[string]any{"text": text}
		}
		showcaseMap[id] = entry
	}

	payload := map[string]any{
		"$schema":  "../../schemas/data.schema.json",
		"id":       id,
		"showcase": showcaseMap,
	}
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\n')
	if existing, err := os.ReadFile(outPath); err == nil && string(existing) == string(data) {
		return nil
	}
	if err := os.WriteFile(outPath, data, 0o644); err != nil {
		return err
	}
	fmt.Printf("datagen: wrote %s\n", outPath)
	return nil
}

func normalizeProps(m map[string]any) map[string]any {
	out := map[string]any{}
	for k, v := range m {
		out[k] = v
	}
	return out
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
