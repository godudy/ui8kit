//go:build ignore

// One-off seeder: go run ./.validate/cmd/variantgen/seed_ui_variants.go
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type recipe struct {
	ID       string                       `json:"id"`
	Base     string                       `json:"base"`
	Keys     []string                     `json:"keys"`
	Defaults map[string]string            `json:"defaults"`
	ByKey    map[string]map[string]string `json:"byKey"`
}

func main() {
	root := findRoot()
	schema := "../../schemas/variants.schema.json"

	write := func(rel string, r recipe) {
		r.ID = r.ID // set per file
		out := map[string]any{
			"$schema":  schema,
			"id":       r.ID,
			"base":     r.Base,
			"keys":     r.Keys,
			"defaults": r.Defaults,
			"byKey":    r.ByKey,
		}
		path := filepath.Join(root, filepath.FromSlash(rel))
		data, _ := json.MarshalIndent(out, "", "  ")
		data = append(data, '\n')
		os.MkdirAll(filepath.Dir(path), 0o755)
		os.WriteFile(path, data, 0o644)
	}

	// button
	write("ui/button/button.variants.json", recipe{
		ID:       "ui.button",
		Base:     "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {
				"default":     "bg-primary text-primary-foreground hover:bg-primary/90",
				"destructive": "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				"outline":     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				"secondary":   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				"ghost":       "hover:bg-accent hover:text-accent-foreground",
				"link":        "text-primary underline-offset-4 hover:underline",
				"unstyled":    "",
			},
			"size": {
				"default": "h-10 px-4 py-2",
				"sm":      "h-9 rounded-md px-3",
				"lg":      "h-11 rounded-md px-8",
				"icon":    "h-10 w-10",
			},
		},
	})

	write("ui/stack/stack.variants.json", recipe{
		ID: "ui.stack", Base: "flex flex-col items-start justify-start", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{},
	})

	write("ui/dialog/dialog.variants.json", recipe{
		ID:       "ui.dialog",
		Base:     "m-auto rounded-lg border border-border bg-background text-foreground shadow-lg backdrop:bg-background/80",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "", "card": "bg-card text-card-foreground", "sheet": "min-h-screen rounded-none", "unstyled": ""},
			"size":    {"sm": "w-full max-w-sm", "default": "w-full max-w-lg", "lg": "w-full max-w-2xl", "xl": "w-full max-w-4xl", "full": "h-full w-full max-w-none"},
		},
	})

	write("ui/badge/badge.variants.json", recipe{
		ID:       "ui.badge",
		Base:     "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "border-transparent bg-primary text-primary-foreground hover:bg-primary/80", "secondary": "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80", "destructive": "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80", "outline": "text-foreground"},
			"size":    {"default": "px-2.5 py-0.5 text-xs", "sm": "px-2 py-0.5 text-xs", "lg": "px-3 py-1 text-sm"},
		},
	})

	write("ui/link/link.variants.json", recipe{
		ID:       "ui.link",
		Base:     "inline-flex items-center gap-1 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "text-primary hover:underline", "muted": "text-muted-foreground hover:text-foreground hover:underline", "nav": "text-foreground hover:text-primary", "block": "flex w-full text-foreground hover:text-primary", "external": "text-primary hover:underline", "unstyled": ""},
			"size":    {"sm": "text-sm", "default": "text-sm", "md": "text-base", "lg": "text-lg"},
		},
	})

	write("ui/separator/separator.variants.json", recipe{
		ID:       "ui.separator",
		Base:     "shrink-0 border-0 bg-border",
		Keys:     []string{"orientation", "variant"},
		Defaults: map[string]string{"orientation": "horizontal", "variant": "default"},
		ByKey: map[string]map[string]string{
			"orientation": {"horizontal": "h-px w-full", "vertical": "h-full w-px"},
			"variant":     {"default": "", "muted": "bg-muted", "strong": "bg-foreground", "spaced": "my-4", "unstyled": ""},
		},
	})

	write("ui/icon/icon.variants.json", recipe{
		ID:       "ui.icon",
		Base:     "inline-block shrink-0",
		Keys:     []string{"type", "size"},
		Defaults: map[string]string{"type": "class", "size": "default"},
		ByKey: map[string]map[string]string{
			"type": {"class": "", "svg": "", "text": ""},
			"size": {"xs": "h-3 w-3", "sm": "h-4 w-4", "default": "h-4 w-4", "md": "h-5 w-5", "lg": "h-6 w-6", "xl": "h-8 w-8"},
		},
	})

	write("ui/image/image.variants.json", recipe{
		ID:       "ui.image",
		Base:     "block max-w-full",
		Keys:     []string{"variant", "size", "fit", "position", "aspect"},
		Defaults: map[string]string{"variant": "default", "size": "auto", "fit": "cover", "position": "center", "aspect": "auto"},
		ByKey: map[string]map[string]string{
			"variant":  {"default": "", "rounded": "rounded-md", "avatar": "rounded-full", "thumbnail": "rounded-md border border-border", "logo": "object-contain", "unstyled": ""},
			"size":     {"auto": "", "default": "", "xs": "h-6 w-6", "sm": "h-8 w-8", "md": "h-12 w-12", "lg": "h-16 w-16", "xl": "h-24 w-24", "full": "h-full w-full"},
			"fit":      {"contain": "object-contain", "cover": "object-cover", "fill": "object-fill", "none": "object-none", "scale-down": "object-scale-down"},
			"position": {"bottom": "object-bottom", "center": "object-center", "left": "object-left", "right": "object-right", "top": "object-top", "left-bottom": "object-left-bottom", "left-top": "object-left-top", "right-bottom": "object-right-bottom", "right-top": "object-right-top"},
			"aspect":   {"auto": "aspect-auto", "square": "aspect-square", "video": "aspect-video"},
		},
	})

	write("ui/disclosure/disclosure.variants.json", recipe{
		ID:       "ui.disclosure",
		Base:     "group",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "rounded-md border border-border", "ghost": "", "card": "rounded-md border border-border bg-card text-card-foreground", "unstyled": ""},
			"size":    {"sm": "text-sm", "default": "text-sm", "lg": "text-base"},
		},
	})

	write("ui/disclosure/summary.variants.json", recipe{
		ID:       "ui.disclosure.summary",
		Base:     "flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "px-4 py-3 font-medium", "ghost": "py-2 font-medium", "card": "px-4 py-3 font-medium", "unstyled": ""},
			"size":    {"sm": "text-sm", "default": "text-sm", "lg": "text-base"},
		},
	})

	write("ui/group/group.variants.json", recipe{ID: "ui.group", Base: "flex min-w-0", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})
	write("ui/label/label.variants.json", recipe{ID: "ui.label", Base: "text-sm font-medium leading-none", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})

	write("ui/form/form.variants.json", recipe{ID: "ui.form", Base: "grid gap-4", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})
	write("ui/form/form-item.variants.json", recipe{ID: "ui.form.item", Base: "flex flex-col gap-2", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})
	write("ui/form/form-description.variants.json", recipe{ID: "ui.form.description", Base: "text-xs text-muted-foreground", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})
	write("ui/form/form-message.variants.json", recipe{ID: "ui.form.message", Base: "text-sm font-medium text-destructive", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})

	write("ui/form/fieldset.variants.json", recipe{
		ID: "ui.form.fieldset", Base: "grid gap-4", Keys: []string{"variant", "size"}, Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "", "card": "rounded-md border border-border p-4", "inline": "flex flex-wrap items-start gap-3", "unstyled": ""},
			"size":    {"sm": "gap-2", "default": "gap-4", "lg": "gap-6"},
		},
	})
	write("ui/form/legend.variants.json", recipe{
		ID: "ui.form.legend", Base: "text-sm font-medium", Keys: []string{"variant", "size"}, Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "", "muted": "text-muted-foreground", "unstyled": ""},
			"size":    {"sm": "text-xs", "default": "text-sm", "lg": "text-base"},
		},
	})
	write("ui/form/meter.variants.json", recipe{
		ID: "ui.form.meter", Base: "h-2 w-full", Keys: []string{"variant", "size"}, Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "accent-primary", "muted": "accent-muted-foreground", "unstyled": ""},
			"size":    {"sm": "h-1", "default": "h-2", "lg": "h-3"},
		},
	})
	write("ui/form/progress.variants.json", recipe{
		ID: "ui.form.progress", Base: "h-2 w-full", Keys: []string{"variant", "size"}, Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"default": "accent-primary", "muted": "accent-muted-foreground", "unstyled": ""},
			"size":    {"sm": "h-1", "default": "h-2", "lg": "h-3"},
		},
	})

	inputRecipe := recipe{
		ID:       "ui.input",
		Base:     "w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"unstyled": "", "": "border-border bg-background", "default": "border-border bg-background", "outline": "border-border bg-background", "ghost": "border-transparent bg-muted"},
			"size":    {"": "h-10 px-3 py-2 text-sm", "default": "h-10 px-3 py-2 text-sm", "xs": "h-8 px-2 text-xs", "sm": "h-9 px-3 text-sm", "lg": "h-11 px-4 text-base"},
		},
	}
	write("ui/input/input.variants.json", inputRecipe)
	write("ui/textarea/textarea.variants.json", recipe{ID: "ui.textarea", Base: inputRecipe.Base, Keys: inputRecipe.Keys, Defaults: inputRecipe.Defaults, ByKey: inputRecipe.ByKey})
	write("ui/select/select.variants.json", recipe{ID: "ui.select", Base: inputRecipe.Base, Keys: inputRecipe.Keys, Defaults: inputRecipe.Defaults, ByKey: inputRecipe.ByKey})

	controlRecipe := recipe{
		ID:       "ui.checkbox",
		Base:     "rounded border border-primary text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		Keys:     []string{"variant", "size"},
		Defaults: map[string]string{"variant": "default", "size": "default"},
		ByKey: map[string]map[string]string{
			"variant": {"unstyled": "", "": "border-primary", "default": "border-primary", "outline": "border-primary", "ghost": "border-primary bg-muted/30"},
			"size":    {"": "h-4 w-4", "default": "h-4 w-4", "xs": "h-3 w-3", "sm": "h-3.5 w-3.5", "lg": "h-5 w-5"},
		},
	}
	write("ui/checkbox/checkbox.variants.json", recipe{ID: "ui.checkbox", Base: controlRecipe.Base, Keys: controlRecipe.Keys, Defaults: controlRecipe.Defaults, ByKey: controlRecipe.ByKey})
	write("ui/radio/radio.variants.json", recipe{ID: "ui.radio", Base: controlRecipe.Base, Keys: controlRecipe.Keys, Defaults: controlRecipe.Defaults, ByKey: controlRecipe.ByKey})
	write("ui/switch/switch.variants.json", recipe{ID: "ui.switch", Base: controlRecipe.Base, Keys: controlRecipe.Keys, Defaults: controlRecipe.Defaults, ByKey: controlRecipe.ByKey})

	empty := recipe{Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}}
	write("ui/block/block.variants.json", recipe{ID: "ui.block", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/box/box.variants.json", recipe{ID: "ui.box", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/text/text.variants.json", recipe{ID: "ui.text", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/title/title.variants.json", recipe{ID: "ui.title", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/container/container.variants.json", recipe{ID: "ui.container", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/list/list.variants.json", recipe{ID: "ui.list", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/table/table.variants.json", recipe{ID: "ui.table", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})
	write("ui/linebreak/linebreak.variants.json", recipe{ID: "ui.linebreak", Base: "", Keys: empty.Keys, Defaults: empty.Defaults, ByKey: empty.ByKey})

	write("ui/grid/grid.variants.json", recipe{ID: "ui.grid", Base: "grid", Keys: []string{}, Defaults: map[string]string{}, ByKey: map[string]map[string]string{}})

	fmt.Println("seeded ui variants")
}

func findRoot() string {
	dir, _ := os.Getwd()
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			if _, err := os.Stat(filepath.Join(dir, "ui")); err == nil {
				return dir
			}
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return "."
		}
		dir = parent
	}
}
