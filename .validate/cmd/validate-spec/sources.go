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
		{"TagGroupStack", "utils.tags.TagGroupStack"},
		{"TagGroupGroup", "utils.tags.TagGroupGroup"},
		{"TagGroupText", "utils.tags.TagGroupText"},
		{"TagGroupContainer", "utils.tags.TagGroupContainer"},
		{"TagGroupList", "utils.tags.TagGroupList"},
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
		if c.name == "TagGroupStack" || c.name == "TagGroupGroup" {
			for _, t := range out["utils.tags.TagGroupLayout"] {
				tags[t] = true
			}
			if c.name == "TagGroupStack" {
				tags["ul"] = true
				tags["ol"] = true
			}
			if c.name == "TagGroupGroup" {
				tags["fieldset"] = true
			}
		}
		if c.name == "TagGroupText" {
			for _, t := range []string{"p", "blockquote", "figcaption", "address", "pre", "span", "small", "time", "em", "strong", "cite", "abbr", "code", "mark"} {
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

	recipes := []string{"InputChrome", "InputSize", "ControlChrome", "ControlSize", "CardVariants", "AlertVariants"}
	for _, varName := range recipes {
		sourceID := "utils.recipes." + varName
		for _, fieldKey := range []string{"variant", "size"} {
			keys := extractRecipeFieldKeys(src, varName, fieldKey)
			if len(keys) > 0 {
				out[sourceID+"."+fieldKey] = keys
			}
		}
	}

	btnPath := filepath.Join(repoRoot, "ui", "button", "button.templ")
	if data, err := os.ReadFile(btnPath); err == nil {
		out["ui.button.ButtonVariants.variant"] = extractTemplVariantKeys(string(data), "variant")
		out["ui.button.ButtonVariants.size"] = extractTemplVariantKeys(string(data), "size")
	}
	badgePath := filepath.Join(repoRoot, "ui", "badge", "badge.templ")
	if data, err := os.ReadFile(badgePath); err == nil {
		out["ui.badge.BadgeVariants.variant"] = extractTemplVariantKeys(string(data), "variant")
		out["ui.badge.BadgeVariants.size"] = extractTemplVariantKeys(string(data), "size")
	}

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
