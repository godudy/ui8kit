package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

var (
	reOneOfTags = regexp.MustCompile(`oneOf\(t,\s*("(?:\\.|[^"\\])*"(?:\s*,\s*"(?:\\.|[^"\\])*")*)\)`)
)

func loadTagGroups(repoRoot string) (map[string][]string, error) {
	data, err := os.ReadFile(filepath.Join(repoRoot, "utils", "tags.go"))
	if err != nil {
		return nil, err
	}
	src := string(data)
	out := map[string][]string{}

	cases := []struct {
		name string
		key  string
	}{
		{"TagGroupLayout", "utils.tags.TagGroupLayout"},
		{"TagGroupBoxAllowed", "utils.tags.TagGroupBoxAllowed"},
		{"TagGroupBlockText", "utils.tags.TagGroupBlockText"},
		{"TagGroupInline", "utils.tags.TagGroupInline"},
		{"TagGroupStack", "utils.tags.TagGroupStack"},
		{"TagGroupGroup", "utils.tags.TagGroupGroup"},
		{"TagGroupText", "utils.tags.TagGroupText"},
		{"TagGroupContainer", "utils.tags.TagGroupContainer"},
		{"TagGroupList", "utils.tags.TagGroupList"},
		{"TagGroupListItem", "utils.tags.TagGroupListItem"},
	}

	for _, c := range cases {
		idx := strings.Index(src, "case "+c.name+":")
		if idx < 0 {
			continue
		}
		chunk := src[idx:]
		if end := strings.Index(chunk, "\n\tcase "); end > 0 {
			chunk = chunk[:end]
		}
		tags := map[string]bool{}
		for _, m := range reOneOfTags.FindAllStringSubmatch(chunk, -1) {
			for _, lit := range splitGoStringLiterals(m[1]) {
				tags[lit] = true
			}
		}
		if c.name == "TagGroupText" {
			for _, t := range out["utils.tags.TagGroupBlockText"] {
				tags[t] = true
			}
			for _, t := range out["utils.tags.TagGroupInline"] {
				tags[t] = true
			}
		}
		out[c.key] = sortedKeys(tags)
	}
	return out, nil
}

func loadRecipeKeys(repoRoot string) (map[string][]string, error) {
	out := map[string][]string{}
	utilsPath := filepath.Join(repoRoot, "utils", "utils.go")
	data, err := os.ReadFile(utilsPath)
	if err != nil {
		return nil, err
	}
	src := string(data)

	recipes := []string{"InputChrome", "InputSize", "ControlChrome", "ControlSize"}
	for _, varName := range recipes {
		sourceID := "utils.recipes." + varName
		for _, fieldKey := range []string{"variant", "size"} {
			keys := extractRecipeFieldKeys(src, varName, fieldKey)
			if len(keys) > 0 {
				out[sourceID+"."+fieldKey] = keys
			}
		}
	}

	addTemplRecipe := func(relPath, sourceID string, fields ...string) {
		data, err := os.ReadFile(filepath.Join(repoRoot, filepath.FromSlash(relPath)))
		if err != nil {
			return
		}
		src := string(data)
		parts := strings.Split(sourceID, ".")
		varName := parts[len(parts)-1]
		for _, field := range fields {
			keys := extractRecipeFieldKeys(src, varName, field)
			if len(keys) > 0 {
				out[sourceID+"."+field] = keys
			}
		}
	}
	addTemplRecipe("ui/button/button.templ", "ui.button.ButtonVariants", "variant", "size")
	addTemplRecipe("ui/badge/badge.templ", "ui.badge.BadgeVariants", "variant", "size")
	addTemplRecipe("ui/icon/icon.templ", "ui.icon.IconVariants", "type", "size")
	addTemplRecipe("ui/image/image.templ", "ui.image.ImageVariants", "variant", "size", "fit", "position", "aspect")
	addTemplRecipe("ui/link/link.templ", "ui.link.LinkVariants", "variant", "size")
	addTemplRecipe("ui/separator/separator.templ", "ui.separator.SeparatorVariants", "variant", "orientation")
	addTemplRecipe("ui/disclosure/disclosure.templ", "ui.disclosure.DisclosureVariants", "variant", "size")
	addTemplRecipe("ui/dialog/dialog.templ", "ui.dialog.DialogVariants", "variant", "size")
	addTemplRecipe("ui/form/controls.templ", "ui.form.FieldsetVariants", "variant", "size")
	addTemplRecipe("ui/form/controls.templ", "ui.form.LegendVariants", "variant", "size")
	addTemplRecipe("ui/form/controls.templ", "ui.form.MeterVariants", "variant", "size")
	addTemplRecipe("ui/form/controls.templ", "ui.form.ProgressVariants", "variant", "size")

	out["utils.helpers.TitleTag"] = []string{"1", "2", "3", "4", "5", "6"}
	return out, nil
}

func extractRecipeFieldKeys(src, varName, fieldKey string) []string {
	idx := strings.Index(src, "var "+varName)
	if idx < 0 {
		return nil
	}
	chunk := src[idx:]
	if end := strings.Index(chunk, "\nvar "); end > 0 {
		chunk = chunk[:end]
	}
	return extractTemplVariantKeys(chunk, fieldKey)
}

func extractTemplVariantKeys(src, keyName string) []string {
	pattern := regexp.MustCompile(`"` + regexp.QuoteMeta(keyName) + `":\s*(?:map\[string\]string\{|\{)([^}]+)\}`)
	m := pattern.FindStringSubmatch(src)
	if len(m) < 2 {
		return nil
	}
	return parseQuotedMapKeys(m[1])
}

func parseQuotedMapKeys(block string) []string {
	keys := map[string]bool{}
	for _, line := range strings.Split(block, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, `"`) {
			continue
		}
		key := strings.Trim(strings.Split(line, ":")[0], `"`)
		if key != "" {
			keys[key] = true
		}
	}
	return filterRecipeKeys(sortedKeys(keys))
}

// filterRecipeKeys drops internal recipe aliases not exposed in brick api enums.
func filterRecipeKeys(keys []string) []string {
	var out []string
	for _, k := range keys {
		if k == "md" {
			continue
		}
		out = append(out, k)
	}
	return out
}

func splitGoStringLiterals(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		part = strings.TrimSpace(part)
		part = strings.Trim(part, `"`)
		if part != "" {
			out = append(out, part)
		}
	}
	return out
}

func sortedKeys(m map[string]bool) []string {
	var out []string
	for k := range m {
		if k == "" {
			continue
		}
		out = append(out, k)
	}
	sort.Strings(out)
	return out
}

func normalizeEnumValue(v any) string {
	switch t := v.(type) {
	case int:
		return strconv.Itoa(t)
	case int64:
		return strconv.FormatInt(t, 10)
	case float64:
		if t == float64(int(t)) {
			return strconv.Itoa(int(t))
		}
		return strconv.FormatFloat(t, 'f', -1, 64)
	case bool:
		if t {
			return "true"
		}
		return "false"
	case string:
		return strings.TrimSpace(t)
	default:
		return fmt.Sprint(v)
	}
}

func resolveAllowList(source string, field string, allowLists map[string][]string) ([]string, bool) {
	if keys, ok := allowLists[source]; ok {
		return keys, true
	}
	fieldKey := strings.ToLower(field)
	scoped := source + "." + fieldKey
	if keys, ok := allowLists[scoped]; ok {
		return keys, true
	}
	return nil, false
}

func diffEnum(spec, code []string) (missing, extra []string) {
	specSet := map[string]bool{}
	codeSet := map[string]bool{}
	for _, v := range spec {
		specSet[v] = true
	}
	for _, v := range code {
		codeSet[v] = true
	}
	for _, v := range code {
		if !specSet[v] {
			missing = append(missing, v)
		}
	}
	for _, v := range spec {
		if !codeSet[v] {
			extra = append(extra, v)
		}
	}
	sort.Strings(missing)
	sort.Strings(extra)
	return missing, extra
}
