package main

import (
	"os"
	"path/filepath"
	"strings"
)

func discoverBlockSpecs(repoRoot string) ([]blockSpec, error) {
	root := filepath.Join(repoRoot, "examples", "templ", "ui", "blocks")
	var specs []blockSpec
	err := filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		if !strings.HasSuffix(path, ".spec.md") {
			return nil
		}
		doc, err := loadSpec(path)
		if err != nil {
			return err
		}
		layer := stringField(doc.fm, "layer")
		if layer != "catalog-block" && doc.fm["codegen"] == nil {
			return nil
		}
		rel, _ := filepath.Rel(repoRoot, path)
		specs = append(specs, blockSpec{
			path:    path,
			dir:     filepath.Dir(path),
			relPath: rel,
			doc:     *doc,
		})
		return nil
	})
	if err != nil && !os.IsNotExist(err) {
		return nil, err
	}
	return specs, nil
}
