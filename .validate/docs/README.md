# Spec validation (Templ registry)

Machine-readable component specs live next to bricks as `{name}.spec.md`.

| File | Role |
|------|------|
| [`.cursor/rules/templ-component-spec.mdc`](../../.cursor/rules/templ-component-spec.mdc) | **Authoring rule:** `api` vs `showcase`, validation contract |
| [`component.spec.template.md`](component.spec.template.md) | Blank template and validation rules for parsers |
| [`../../utils/utils.spec.md`](../../utils/utils.spec.md) | Helper module catalog + `allow-list-source` registry |
| [`../../utils/tags.spec.md`](../../utils/tags.spec.md) | TagGroup allow-lists for layout and text primitives |
| [`../scripts/validate-spec.sh`](../scripts/validate-spec.sh) | Local wrapper: `go run` validate-spec (+ optional `go test`) |

## Two layers

- **`api:`** — full contract (complete enums, `allow-list-source`)
- **`showcase:`** — curated examples only; missing entry ≠ forbidden value (read `api` for full enum)

Brick specs: one `{name}.spec.md` per folder under `ui/*` and `components/*`.
Helper specs (`layer: helper`): use `exports` and optional `examples:` (not `api` / `showcase`).

## Local validation

From any directory:

```bash
bash .validate/scripts/validate-spec.sh
```

Include Go tests after specs pass:

```bash
bash .validate/scripts/validate-spec.sh --with-tests
```

Direct command (repo root):

```bash
go run ./.validate/cmd/validate-spec
go test ./.validate/cmd/validate-spec
```

The validator checks:

- Required front matter keys (`id`, `layer`, `kind`, `package`, `facade`, `api`, `showcase`, `semantics` for bricks)
- No legacy `props:` / `variants:` keys in brick specs
- 1:1 mapping between `showcase[].id` (or helper `examples[].id`) and `## Example {id}` sections with one fenced block (`templ` or `go`)
- `allow-list-source` matches `utils/tags.go`, recipe vars in `utils/utils.go`, and brick-local `*Variants` maps
- [`components.json`](../../components.json) aliases: `components` → `@/components`, `ui` → `@/components/ui`, `utils` → `@/utils`

Exit code is non-zero on any mismatch; errors print file path and field name.

Human-facing documentation is generated elsewhere (e.g. FastyGoUI showcase) from these specs.
