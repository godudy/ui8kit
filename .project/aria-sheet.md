Изучил рабочий код в Blank. Это **решение проблемы** — у них уже есть стабильный паттерн, который мы случайно сломали в Templ registry.

## Ключевая находка

Blank vendored `sheet.templ` рендерит Sheet корнем как **`<div>`**, не `<dialog>`:

```199:203:vendor/github.com/fastygo/templ/components/sheet/sheet.templ
templ Sheet(p SheetProps) {
	<div class={ SheetClasses(p) } hidden?={ !p.Open } { sheetRootAttrs(p)... }>
		{ children... }
	</div>
}
```

И атрибуты корня (`vendor/.../sheet.templ:149-169`):

```149:169:vendor/github.com/fastygo/templ/components/sheet/sheet.templ
func sheetRootAttrs(p SheetProps) templ.Attributes {
	attrs := uiutils.MergeAttrs(templ.Attributes{}, p.Attrs)
	if strings.TrimSpace(p.ID) != "" {
		attrs["id"] = p.ID
	}
	attrs["role"] = "dialog"
	attrs["aria-modal"] = "true"
	attrs["data-state"] = sheetState(p.Open)
	// ... aria-label / aria-labelledby / aria-describedby
	if sheetBehavior(p.Behavior) == "ui8kit" {
		attrs["data-ui8kit"] = "sheet"
		attrs["data-ui8kit-dialog"] = true
	}
}
```

И **это работает в продакшене**. Тесты в `navigation_render_test.go:17-97` фиксируют контракт: `role="dialog"`, `aria-modal="true"`, `data-ui8kit="sheet"`, `data-ui8kit-dialog-close`, `data-ui8kit-dialog-open`, `data-ui8kit-dialog-target`, `hidden` на overlay в закрытом SSR-состоянии.

## Почему `<div role="dialog">` + ui8kit работает, а `<dialog>` — нет

| Проверка | `<dialog open?>` | `<div role="dialog" hidden?>` |
|----------|------------------|------------------------------|
| Снятие `hidden` ui8kit'ом | недостаточно — UA `display:none` без `open`/`showModal()` | достаточно — `display:none` ↔ нормально |
| `showModal()` нужен | да | нет |
| Top layer / `::backdrop` | да | нет (но sheet'у не нужно — `fixed` + overlay `<div>`) |
| Конфликт с ui8kit | да (два механизма) | нет (один механизм) |
| Парity Templ/React | сложный | тривиальный |

## Дополнительный паттерн из Blank — CSS-only scroll lock

`internal/ui/layout/helpers.go:25-30`:

```25:30:internal/ui/layout/helpers.go
func documentBodyClass() string {
	return uiutils.Cn(
		"min-h-screen overflow-x-hidden bg-background font-sans text-foreground",
		"max-md:has-[#"+MobileSheetPanelID+":not([hidden])]:overflow-hidden",
	)
}
```

Body блокирует скролл когда панель видна — **чистым CSS `:has()`**, без JS. ui8kit toggles `hidden` → CSS сам реагирует. Это работает именно потому что корень `<div hidden>`, а не `<dialog>`.

## Суммаризация знаний — единый паттерн для обеих стопок

### Markup контракт (одинаковый в Templ и TSX)

```
<button data-ui8kit-dialog-open data-ui8kit-dialog-target="panel-id" aria-controls="panel-id" aria-haspopup="dialog" aria-expanded="false">
<div role="dialog" id="panel-id" data-ui8kit="sheet" data-ui8kit-dialog data-state="closed" hidden aria-modal="true" aria-labelledby="title-id">
  <div data-ui8kit-dialog-close data-ui8kit-dialog-target="panel-id" hidden></div>  <!-- overlay -->
  <div> <!-- content -->
    <h2 id="title-id">…</h2>
    <button data-ui8kit-dialog-close data-ui8kit-dialog-target="panel-id">✕</button>
  </div>
</div>
```

### Runtime контракт (только `@ui8kit/aria`)

- Открытие: click на `[data-ui8kit-dialog-open]` → ui8kit `N(panel, true)` → `removeAttribute('hidden')` + `data-state="open"` + focus
- Закрытие: click на `[data-ui8kit-dialog-close]` или overlay или Esc → ui8kit `N(panel, false)` → `setAttribute('hidden')` + `data-state="closed"` + вернуть фокус
- Scroll lock: CSS `:has(#panel:not([hidden])):overflow-hidden`
- Программное открытие извне: `window.ui8kit.open(id)` / `close(id)`

### Что должно быть в React `sheet.tsx` (после упрощения)

- Никакого `useControllable`, `useState`, `useEffect`, `showModal()`, `close()`
- `open` prop → только начальный `data-state` + `hidden` (как `Open` в Templ)
- `onClick` на trigger/close/overlay — **не нужен**, ui8kit обрабатывает на `document`
- `target` вместо `For` — единственная naming-разница
- `behavior="ui8kit"` → всегда эмитит `data-ui8kit-*` хуки
- `Sheet` root → `<div role="dialog">`, не `<dialog>`

### Что зафиксировать в spec

- `semantics.root: div[role=dialog]` (не `dialog`)
- `behavior="ui8kit"` — единственный runtime на обеих стопках
- `open` — статический начальный state, не controlled callback
- `OnOpenChange` — убрать из react-only пропсов (или оставить только для не-ui8kit режима, если такой будет)
- Body scroll lock — опциональный CSS `:has()` паттерн, документировать как рекомендацию

## Компромисс, на который идём

Минусы:
- Теряем native `<dialog>` top layer, `::backdrop`, native focus trap
- Для **центральных модалов** (alertdialog) этот loss значимый — там `showModal()` нужен

Плюсы:
- Полный parity Templ ↔ React — один mental model
- Onboarding в обе стороны тривиальный
- Нет конфликтов двух runtime
- Можно добавлять новые интерактивные элементы (tabs, combobox, menu, disclosure) по тому же шаблону без страха
- CSS `:has()` scroll lock работает без JS

### Разделение использования

- **Sheet** (side panel) → `<div role="dialog">` + ui8kit (этот компромисс)
- **Dialog** (center modal / alertdialog) → native `<dialog>` + `showModal()` остаётся в `ui/dialog` — там top layer реально нужен

## План миграции (для Agent mode)

1. `components/sheet/sheet.templ`: `<dialog open?>` → `<div hidden?>`
2. `components/sheet/sheet.tsx`: убрать `useControllable`/`useEffect`/`showModal`/`onClick` open-close handlers, root → `<div role="dialog">`, эмитить ui8kit хуки всегда при `behavior="ui8kit"`
3. `components/sheet/sheet.spec.md`: `semantics.root: div[role=dialog]`, убрать `OnOpenChange` из react-only
4. `examples/vite/src/blocks/{home,dashboard}/page.tsx`: убрать `useState`/`sheetOpen`/`onOpenChange`, использовать статический `open={false}` + ui8kit
5. Обновить тесты: `home-page.snapshot.test.tsx` (убрать `onOpenChange`), `sheet-controlled.test.tsx` → переименовать в `sheet-ui8kit-contract.test.tsx` с проверкой markup паритета
6. Опционально: добавить CSS `:has()` scroll lock в dashboard/home layout
7. Прогнать `bun run verify` + `go test ./...`

Когда будешь готов — переключи в Agent mode, я выполню миграцию.

-------------------------

если я правильно понял, то мы теряем это только для Sheet и только для мобильных экранов верно?

Теряем native <dialog> top layer, ::backdrop, native focus trap
Для центральных модалов (alertdialog) этот loss значимый — там showModal() нужен

и другие, обычные модальные окна мы спокойно создадим отдельно по канонам ARIA 

в таком случае ничего страшщного. люди с ограниченными возможностями все равно кливиатурой будут управлять с ПК версии где мобильное меню скрыто 

-------------------------

Почти верно, но есть пара нюансов — давай уточню точно.

## Что теряем и где

### Точность 1: потеря касается Sheet компонента, не "только мобильных"

Sheet-компонент всегда будет `<div role="dialog">` + ui8kit — независимо от размера экрана. То есть если кто-то использует Sheet для **десктопного side-panel** (фильтры, инспектор, drawer) — там тоже не будет native `<dialog>`.

**Но это OK**, потому что Sheet по своей природе — **side panel**, а не center modal. Для side panel:

| Native фича | Нужна ли для side panel |
|-------------|--------------------------|
| Top layer | нет — `fixed z-50` достаточно |
| `::backdrop` | нет — есть отдельный overlay `<div>` |
| Native focus trap | нет — ui8kit делает свой (Tab cycling, фокус на первый элемент, возврат фокуса) |
| Esc | ui8kit обрабатывает |
| Click-outside | ui8kit обрабатывает через overlay |

Так что потеря **только для Sheet**, и для **всех размеров экрана**, но эти фичи для side panel всё равно не нужны. Мобильное меню — просто частный случай Sheet.

### Точность 2: `ui/dialog` остаётся native

Да, **`ui/dialog`** (центральные модалы, alertdialog) — отдельный компонент, остаётся `<dialog>` + `showModal()`. Там top layer, `::backdrop`, native focus trap реально нужны. По ARIA-канону — отдельно.

### Точность 3: про клавиатуру и a11y

Твоя логика верная, но с важным уточнением:

- **Десктоп**: мобильное меню `md:hidden` → бургер не рендерится → клавиатурный пользователь использует sidebar nav (клавиатурно-доступный). Sheet не встречается. ✅
- **Мобильный клавиатурник** (Bluetooth клавиатура на планшете/телефоне, switch device): Sheet **встречается**, и тут:
  - ui8kit dialog pattern делает focus trap (Tab cycling внутри панели) ✅
  - Esc закрывает ✅
  - Фокус на первый элемент при открытии ✅
  - Возврат фокуса на trigger при закрытии ✅
  
  То есть ui8kit покрывает клавиатурный a11y на мобильном. Потеря vs native `<dialog>` минимальна — native focus trap чуть robust'нее на уровне браузера, но функционально ui8kit эквивалентен.

## Итоговая картина

```
┌─────────────────────────────────────────────────────────┐
│ Sheet (side panel, любая ширина)                        │
│  → <div role="dialog"> + @ui8kit/aria                   │
│  → мобильное меню, фильтры, drawers, inspectors         │
│  → теряем: native top layer/backdrop/trap (не нужны)    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Dialog (center modal, alertdialog)                      │
│  → <dialog> + showModal() — native ARIA canon           │
│  → подтверждения, формы, wizards                        │
│  → сохраняем: top layer, ::backdrop, native trap        │
└─────────────────────────────────────────────────────────┘
```

## Что нужно зафиксировать в spec чтобы не было путаницы

В `sheet.spec.md`:
- `semantics.root: div[role=dialog]` — явно, с пометкой "side panel semantics, not native dialog element"
- Пометка: "For center modals use `ui/dialog`, not `Sheet`"
- `behavior="ui8kit"` — единственный runtime

В `dialog.spec.md` (для `ui/dialog`):
- `semantics.root: dialog` (native element)
- `showModal()` / `close()` — native API
- `behavior="ui8kit"` — опционально, для hook-паритета, но runtime native

## Компромисс подтверждён

Страшного ничего. Логика верная:
- Sheet → ui8kit-only, parity Templ/React
- Dialog → native, для модалов
- Клавиатурный a11y покрыт ui8kit'ом на мобильном, sidebar'ом на десктопе
- Onboarding симметричный — один паттерн `data-ui8kit-*` для всех side-panel случаев

====================

Миграция завершена.

## Что изменилось

### `components/sheet/sheet.templ`
- Корень: `<dialog open?>` → **`<div hidden?={ !p.Open }>`** (как в Blank)

### `components/sheet/sheet.tsx`
- Убраны `useControllable`, `onOpenChange`, `showModal`, React `onClick` для open/close
- Корень: **`<div role="dialog">`** с `hidden={!open}`
- При `behavior="ui8kit"` всегда эмитятся `data-ui8kit-*` хуки
- Runtime полностью на `@ui8kit/aria`

### Примеры (home, dashboard, gallery)
- Убран `useState` / `sheetOpen` / `onOpenChange`
- Разметка как в Templ: только `behavior="ui8kit"` + `target`

### Spec & docs
- `semantics.root: div[role=dialog]`
- Удалён `OnOpenChange` из react-only API Sheet
- Обновлены `.project/coming-from-shadcn.md` и `.cursor/rules/templ-react-port.mdc`

### Тесты
- Новый `sheet-ui8kit-contract.test.tsx` (markup-паритет)
- Расширены Go render tests
- Удалён устаревший `sheet-controlled.test.tsx`

## Единый паттерн (Templ = React)

```tsx
<SheetTrigger id="trigger" target="panel" behavior="ui8kit">☰</SheetTrigger>
<Sheet id="panel" behavior="ui8kit" aria-label="Menu">
  <SheetOverlay target="panel" behavior="ui8kit" />
  <SheetContent>...</SheetContent>
</Sheet>
```

Открытие/закрытие — только `@ui8kit/aria`. Hard refresh и проверь бургер на `/home/` и `/` в мобильной ширине.

## Manifest entries

Whenever a brick introduces a new `data-ui8kit-*` hook (tabs, combobox, menu, …),
register it in [`examples/web/static/js/manifest.json`](../examples/web/static/js/manifest.json):

- Add the pattern name to `patterns` (e.g. `"sheet"`, `"dialog"`).
- List every hook attribute under `hooks.<pattern>` so `bun run validate:aria` can
  verify example markup against the registered `@ui8kit/aria` subset.

Current sheet/dialog hooks: `data-ui8kit`, `data-ui8kit-dialog`,
`data-ui8kit-dialog-open`, `data-ui8kit-dialog-close`, `data-ui8kit-dialog-target`.