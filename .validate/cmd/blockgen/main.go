package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	check := flag.Bool("check", false, "exit non-zero if generated files are stale")
	flag.Parse()

	repoRoot, err := findRepoRoot()
	if err != nil {
		fmt.Fprintf(os.Stderr, "blockgen: %v\n", err)
		os.Exit(1)
	}

	specs, err := discoverBlockSpecs(repoRoot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "blockgen: discover: %v\n", err)
		os.Exit(1)
	}
	if len(specs) == 0 {
		fmt.Println("blockgen: no block specs found")
		return
	}

	var stale []string
	for _, spec := range specs {
		outPath, content, err := generateBlock(spec)
		if err != nil {
			fmt.Fprintf(os.Stderr, "blockgen: %s: %v\n", spec.relPath, err)
			os.Exit(1)
		}
		if outPath == "" {
			continue
		}
		existing, readErr := os.ReadFile(outPath)
		if readErr != nil && !os.IsNotExist(readErr) {
			fmt.Fprintf(os.Stderr, "blockgen: read %s: %v\n", outPath, readErr)
			os.Exit(1)
		}
		if string(existing) == content {
			continue
		}
		if *check {
			stale = append(stale, outPath)
			continue
		}
		if err := os.WriteFile(outPath, []byte(content), 0o644); err != nil {
			fmt.Fprintf(os.Stderr, "blockgen: write %s: %v\n", outPath, err)
			os.Exit(1)
		}
		fmt.Printf("blockgen: wrote %s\n", outPath)
	}

	if len(stale) > 0 {
		fmt.Fprintf(os.Stderr, "blockgen: stale generated files (%d):\n", len(stale))
		for _, path := range stale {
			fmt.Fprintf(os.Stderr, "  %s\n", path)
		}
		fmt.Fprintf(os.Stderr, "run: go run ./.validate/cmd/blockgen\n")
		os.Exit(1)
	}
	if *check {
		fmt.Printf("blockgen: OK (%d blocks)\n", len(specs))
	}
}
