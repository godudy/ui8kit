package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

type specDoc struct {
	path string
	fm   map[string]any
}

type blockSpec struct {
	path    string
	dir     string
	relPath string
	doc     specDoc
}

type codegenConfig struct {
	Output string
	Data   codegenDataConfig
}

type codegenDataConfig struct {
	PropsType       string
	DefaultFunction string
	Ref             string
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
			return "", fmt.Errorf("repo root not found from cwd")
		}
		dir = parent
	}
}

func loadSpec(path string) (*specDoc, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	text := strings.ReplaceAll(string(raw), "\r\n", "\n")
	if !strings.HasPrefix(text, "---\n") {
		return nil, fmt.Errorf("missing YAML front matter")
	}
	end := strings.Index(text[4:], "\n---")
	if end < 0 {
		return nil, fmt.Errorf("unclosed YAML front matter")
	}
	fmText := text[4 : 4+end]
	fm := map[string]any{}
	if err := yaml.Unmarshal([]byte(fmText), &fm); err != nil {
		return nil, fmt.Errorf("front matter YAML: %w", err)
	}
	return &specDoc{path: path, fm: fm}, nil
}

func stringField(fm map[string]any, key string) string {
	v, _ := fm[key].(string)
	return strings.TrimSpace(v)
}

func getMap(fm map[string]any, key string) map[string]any {
	v, _ := fm[key].(map[string]any)
	return v
}

func getSlice(fm map[string]any, key string) []any {
	v, _ := fm[key].([]any)
	return v
}

func blockBaseName(spec blockSpec) string {
	base := strings.TrimSuffix(filepath.Base(spec.path), ".spec.md")
	if base != "" {
		return base
	}
	return filepath.Base(spec.dir)
}

func resolveCodegen(spec blockSpec) codegenConfig {
	cfg := codegenConfig{
		Output: "page_gen.go",
		Data: codegenDataConfig{
			PropsType:       "PageProps",
			DefaultFunction: "DefaultPage",
		},
	}
	if raw := getMap(spec.doc.fm, "codegen"); raw != nil {
		if out := stringField(raw, "output"); out != "" {
			cfg.Output = out
		}
		if data := getMap(raw, "data"); data != nil {
			if v := stringField(data, "propsType"); v != "" {
				cfg.Data.PropsType = v
			}
			if v := stringField(data, "defaultFunction"); v != "" {
				cfg.Data.DefaultFunction = v
			}
			if v := stringField(data, "ref"); v != "" {
				cfg.Data.Ref = v
			}
		}
	}
	if cfg.Data.Ref == "" {
		cfg.Data.Ref = defaultShowcaseRef(spec.doc.fm)
	}
	return cfg
}

func defaultShowcaseRef(fm map[string]any) string {
	for _, item := range getSlice(fm, "showcase") {
		m, _ := item.(map[string]any)
		if m == nil {
			continue
		}
		if ref := stringField(m, "ref"); ref != "" {
			return ref
		}
		if id := stringField(m, "id"); id != "" {
			return id
		}
	}
	return "default"
}

func packageName(spec blockSpec) string {
	pkg := filepath.Base(spec.dir)
	if pkg == "" || pkg == "." {
		return "block"
	}
	return pkg
}
