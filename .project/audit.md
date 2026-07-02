# Многоуровневый аудит FastyGo Templ Registry

Репозиторий (с момента последнего чекпоинта) стал заметно зрелее: появились `docs/mental-model.md`, `docs/learn/`, единый `docs/coming-from-shadcn.md`, чёткие `.cursor/rules/*`. Это меняет базовую оценку — большая часть «глобальных» пробелов из прошлых ревью закрыта документацией. Ниже — сквозной аудит по всем 4 уровням с конкретными файлами и приоритетами.

---

## Executive Summary

**Общая оценка: 4/5 — сильная архитектура, документация почти образцовая, но есть 1 блокирующий и 2–3 болезненных gap'а именно в *первом* пользовательском опыте.**

Шансы вовлечения:

| Персона | Вовлечённость | Причина |
|---|---|---|
| React-команда (middle+, знает shadcn) | **Высокая**, если минует один P0-баг установки | `cn`, `cva`-подобные `*.variants.json`, `asChild`, named exports — всё узнаваемо с первого взгляда на `README.md` |
| Джуниор после shadcn → Templ | **Средняя-высокая** | `docs/learn/01-hero` — реальный split-view урок с построчной таблицей различий; но lesson только один, остальное — «доучись по аналогии» |
| Фронтендер, осваивающий второй стек | **Средняя** | Материал есть (mental-model + learn + coming-from-shadcn), но нет *браузерного* split-view — только «открой два файла в IDE» |
| LLM-ассистент | **Высокая** | `.cursor/rules/*.mdc` — исключительно точные, спецификации `*.spec.md` формализованы, `variantcheck`/`blockonce`/`validate-spec` дают жёсткую обратную связь |

**Топ quick wins (в порядке ROI):**

1. **P0 — задокументировать двойной `bun install`.** `examples/README.md` говорит только `cd examples && bun install`, но `ui/*.tsx`/`utils/*.ts` физически лежат в корне и тянут `clsx`/`tailwind-merge`/`react` из **корневых** `node_modules`. Свежий клон + `cd examples && bun run dev:vite` без предварительного `bun install` в корне — вероятная ошибка резолва модулей на первом же запуске.
2. **P1 — единая команда старта из корня.** Сейчас нет `bun run dev` в корневом `package.json`; React-разработчик, который «открывает репозиторий и хочет увидеть UI за 60 секунд», должен сам понять, что нужно зайти в `examples/`.
3. **P1 — расширить `docs/learn/` хотя бы на layout-grammar и Sheet.** Сейчас 1 полный урок из 4 задуманных («Planned lessons» — Sidebar/Sheet/Layout grammar помечены как «not yet written»).
4. **P2 — обозначить, что `docs/learn/` = «открой 2 файла в IDE», а не браузерный split-view.** Формат Sololearn подразумевает браузер без установки; текущая реализация требует локальный IDE + Go + Bun toolchain.
5. **P2 — снять `As int` untyped heritage там, где ещё остался (частично закрыто — см. Parity report).**

---

## 1. Onboarding Map (Product-level)

Путь «получил ссылку → собрал первый экран»:

```
README.md
  ├─ таблица "One recipe, two runtimes" (60 сек, понятно)
  ├─ "New here? docs/mental-model.md" ────────────► читает 5 идей (~5 мин)
  ├─ "Coming from shadcn? docs/coming-from-shadcn.md"
  ├─ "guided split-view lesson → docs/learn/"
  └─ "Local preview → examples/README.md"
        │
        ▼
examples/README.md
  ├─ "From examples/: bun install && bun run dev:templ"   ⚠️ P0: не упомянут корневой bun install
  └─ "bun run dev:vite"                                     ⚠️ то же самое
        │
        ▼
  🔴 ВЫСОКИЙ РИСК ЗАСТРЕВАНИЯ: module resolution error
     (clsx/tailwind-merge/react не найдены, если не сделан
     `bun install` в корне репозитория)
```

Оценка риска по точкам входа:

| Точка входа | Риск | Комментарий |
|---|---|---|
| `README.md` → понимание модели | 🟢 Низкий | Таблица TSX/Templ side-by-side в первых строках — сильный первый экран |
| `docs/mental-model.md` | 🟢 Низкий | 5 идей, mermaid-диаграмма, короткий и точный |
| `docs/learn/01-hero` | 🟢 Низкий (для 1 урока) | Отличный формат: таблица построчных различий + 2 упражнения (React→Templ и обратно) |
| Установка зависимостей | 🔴 Высокий | Два независимых `bun.lock` (корень + `examples/`), не workspace; последовательность установки не задокументирана |
| `bun run dev:vite` | 🟡 Средний | Как только зависимости стоят — работает: `vite.config.ts` алиасит `@registry/ui` прямо на `ui/index.ts`, hot-reload сразу видит правки в `ui/`/`components/` |
| Полная валидация (`bun run verify`) | 🟢 Низкий | Понятный pipeline, единая команда, зелёный вывод по шагам |
| Добавление нового brick'а | 🟢 Низкий | `.cursor/rules/templ-registry-structure.mdc` даёт явный чеклист «Adding a brick» (6 шагов) |

**Где реально теряют интерес:** между «прочитал README» и «увидел живой UI в браузере». Это единственный разрыв, который не покрыт учебными материалами — он чисто инфраструктурный (bootstrap), а не концептуальный.

---

## 2. DX / Онбординг — взгляд senior shadcn-разработчика

### Что узнаваемо сразу (P-none, работает как ожидается)

- `cn()` = `clsx + tailwind-merge`, каллер-класс побеждает — 1:1 с shadcn (`utils/cn.ts`).
- `asChild` + `Slot` — Radix-паттерн воспроизведён почти буквально (`ui/slot/slot.tsx`, применён в `Button`, `Title`, `Card`, `SheetTrigger/Close`).
- `variant`/`size` через типизированный union, не `string` — `type ButtonVariant = typeof buttonKeys.variant` (`ui/button/button.tsx:13-14`) — сильнее, чем в среднем shadcn-проекте (там часто просто `VariantProps<typeof buttonVariants>`, тут plus строгая типизация из JSON).
- `forwardRef` везде, `displayName` везде — привычный boilerplate.
- Named exports для composite (`CardHeader`, `CardTitle`, ...) без `Card.Header` — задокументированное сознательное решение (`docs/coming-from-shadcn.md` → «Dot notation is intentionally not supported»), явно объяснено *зачем*.

### Где shadcn-разработчик ожидает одно, а находит другое

| # | Приоритет | Ожидание (shadcn) | Реальность здесь | Где документировано |
|---|---|---|---|---|
| 1 | **P0** | `npx shadcn add button` → всё работает сразу | Нужно вручную понять двойной `bun install` | Нигде явно |
| 2 | P1 | Variants — просто `cva()` в TS-файле рядом с компонентом | Variants — отдельный **JSON**-файл, который читают *и* Go, *и* React через `composeRecipe`/`Compose` | `docs/mental-model.md` §1 — задокументировано, но непривычно с первого взгляда |
| 3 | P1 | `className` — универсальный escape hatch, можно перебить что угодно | `className`/`Class` — **аддитивный**, нет `unstyled`; для нового вида — новый вариант в JSON | `docs/architecture.md` — явно: «There is no universal `unstyled` escape hatch» |
| 4 | P2 | Raw `<div>` — нормально в JSX | Raw layout-теги запрещены внутри `ui/`/`components/`/example-блоков; нужен `Block`/`Box`/`Stack`/`Group` | `docs/mental-model.md` §3, `.cursor/rules/templ-layout-grammar.mdc` |
| 5 | P2 | Один рантайм, один язык | Два. React-дев обязан держать в голове, что правки в `ui/button/button.tsx` **не** синхронизируются автоматически с `button.templ` — нужен параллельный ручной порт | `docs/mental-model.md` §5 — сказано прямо, но это по-настоящему непривычная модель |

### Проверка вживую: `ui/button` — образцовая пара

`ui/button/button.tsx` и `ui/button/button.templ` — я специально сверил построчно: оба читают один `button.variants.json`, оба одинаково собирают disabled-состояние (`state = disabled ? "pointer-events-none opacity-50" : ""`), оба одинаково реализуют `asChild`/`ButtonClasses`-обходной путь для навигации. Это лучший «первый брик» для новичка — и `docs/learn/README.md` уже рекомендует его первым. Хорошее решение.

### Card — единственная точка, где раньше был реальный разброс, сейчас закрыта

Ранее (до последнего фоллоу-апа) `CardTitle`/`CardDescription` в Go принимали `value string`, а в React — `children`. Сейчас (`components/card/card.templ:79-92`) обе части используют `{ children... }`, и spec (`card.spec.md`) синхронизирован с `As: HeadingLevel`-подобной аннотацией через `allow-list-source`. Это заметный прогресс с последнего ревью.

---

## 3. Архитектурный аудит — надёжность для джуниоров и слабых LLM

**Оценка: 4.5/5 (junior/LLM-friendly).**

### Предсказуемость brick'а

Контракт «5 файлов = 1 brick» — соблюдается почти без исключений:

```
ui/<brick>/
  <brick>.spec.md          # API contract
  <brick>.variants.json    # class recipe
  <brick>.data.json        # showcase fixtures (опционально)
  <brick>.templ            # Go
  <brick>.tsx               # React (опционально)
```

Слабая LLM, увидев один пример (`ui/button/`), может механически воспроизвести это для нового brick'а — структура файлов идентична во всех 30+ проверенных папках (`ui/badge`, `ui/select`, `ui/disclosure`, `components/sheet`, ...).

### «Скрытые правила», которые LLM не выведет из одного примера

| Правило | Насколько скрыто | Где раскрыто |
|---|---|---|
| `Block` открывает файл/блок **ровно один раз** | Средне — это не видно из кода brick'а, только из линтера `blockonce` | `.cursor/rules/templ-layout-grammar.mdc`, `docs/mental-model.md` §3 |
| `defaults[k]` обязан ссылаться на непустой `byKey[k]`; `""` ключи запрещены | Высоко скрыто — обычный JSON выглядит валидным, но `variantcheck` его завалит | `docs/architecture.md` §Variants — документировано явно |
| `react-only: true` не может течь в `parts[].props` (Templ) | Высоко скрыто, тонкое правило спецификации | `.cursor/rules/templ-component-spec.mdc` |
| `Box` — только `div`, `Block` может быть `div` (когда это не landmark) | Средне — на первый взгляд кажется, что Box/Block взаимозаменяемы | `docs/mental-model.md` §3, таблица тегов явная |
| `TagGroup*` enum в Go (`utils/tags.go`) — сгенерированный файл, редактировать нельзя | Низко скрыто — есть шапка `// Code generated by tagsgen. DO NOT EDIT.` | Явный комментарий в файле |

Всё перечисленное **задокументировано где-то**, но не в одном месте — LLM должен прочитать 2-3 файла правил, чтобы собрать полную картину. Это ожидаемо для системы такого размера и не критично, поскольку `.cursor/rules/*.mdc` целиком написаны для агентов, а не для людей — это правильное разделение.

### Хрупкие места

1. **`primitives.smoke.test.tsx` — единая точка сборки для 28 spec'ов.** Формально `validate-spec` проверяет только существование файла по пути `targets.react.test`, а не «содержит describe-блок для этого brick'а». Я проверил файл вручную (`examples/vite/tests/primitives.smoke.test.tsx`) — там **реально** есть `describe()` на каждый из 28 примитивов с содержательными assertions. Дисциплина сейчас хорошая, но контракт **не enforced** механически: если джуниор/LLM добавит новый примитив и укажет `test: .../primitives.smoke.test.tsx` без добавления `describe()`-блока, валидатор это пропустит. Слабое место для будущего дрейфа.
2. **Cross-stack coupling через алиасы `@blocks/home-variants`.** `examples/vite/vite.config.ts:39` и `tsconfig.react.json:20` алиасят React-импорт прямо на JSON-файл, физически лежащий в папке `examples/templ/...`. React-разработчик, никогда не открывавший Go-часть, при правке «тона» карточки инструмента будет вынужден зайти в директорию `templ/`. Это не баг (общий источник правды — осознанное решение), но психологически создаёт впечатление «не могу работать без Go-контекста», что противоречит цели «React-команда вовлекается без Go-бэкграунда».
3. **Двух-installer setup** (см. п.1 Executive Summary) — архитектурно обоснован (Go module vs future npm package, `docs/publishing.md`), но не документирован как последовательность для локальной разработки.

### Anti-паттерны — не найдено активных

Не нашёл `unstyled`-эскейпов, не нашёл `value string` вместо `children` (кроме легитимных Go-хелперов типа `iconType(value string) string`, которые не являются публичным API brick'а), не нашёл `As int` без типизации в проверенных spec'ах.

---

## 4. Parity Report — Go/Templ ↔ React TSX

Матрица паритета по проверенным brick'ам (✅ = полный паритет концепций и API-контракта, ⚠️ =小 расхождение задокументировано и обосновано, 🔶 = расхождение неявное/не задокументировано):

| Brick | Children model | Props naming | asChild/Slot | Variants source | Behavior hooks | Итог |
|---|---|---|---|---|---|---|
| `ui/button` | ✅ `{children...}` / `{children}` | ✅ `Class`↔`className`, `AriaLabel`↔`aria-label` | ✅ обе стороны (Go — `ButtonClasses` на ручном `<a>`, React — `asChild`) | ✅ единый `button.variants.json` | н/д | ✅ |
| `ui/badge` | ✅ | ✅ | н/д (нет интерактивности) | ✅ | н/д | ✅ |
| `ui/title` | ✅ (после фикса) | ✅ `As`↔`as`, оба типизированы через `HeadingLevel` | ✅ React `asChild`; Go — `HeadingTag`-хелпер | ✅ | н/д | ✅ |
| `components/card` | ✅ (после фикса) | ✅ | ✅ (React `asChild` на `Card`; Go — `CardClasses` на ручной wrapper) | ✅ | н/д | ✅ |
| `components/sheet` | ✅ | ⚠️ `For` (Go) ↔ `target` (React) — задокументировано в `docs/architecture.md` таблице | ✅ на `SheetTrigger`/`SheetClose` | ✅ | ✅ идентичный DOM-контракт (`data-ui8kit-dialog-*`), React добавляет dev-warning при попытке контролировать `open` — обоснованная асимметрия (SSR не ре-рендерится) | ✅ |
| `ui/select` | ✅ | ✅ | н/д | ✅ | н/д | ✅ |
| `ui/disclosure` | ✅ | ✅ | н/д | ✅ (два recipe-файла — `disclosure.variants.json` + `summary.variants.json`, симметрично на обеих сторонах) | н/д | ✅ |
| `ui/form` (+controls) | ✅ | ✅ | н/д | ✅ | н/д | ✅ |

**Вывод:** на уровне проверенных brick'ов концептуальный паритет фактически достигнут — это прямое следствие фоллоу-апа из предыдущего ревью (Attrs sweep, HeadingLevel unification, children unification). Расхождения, которые остались, **все документированы** в `docs/architecture.md` таблице "Runtime Parity" и `docs/coming-from-shadcn.md` таблице "Naming Conversion" — то есть они являются частью учебного материала, а не скрытым багом.

### Топ расхождений, мешающих обучению (не критично, но заметно)

1. **Синтаксис списков** — `.map()` vs `for _, x := range xs` — фундаментальное отличие языков, не библиотеки; уже отражено в `docs/learn/01-hero` таблице (строка 7), это правильный подход — не скрывать, а объяснять.
2. **`HeroChat` twin-хелперы** (`workflowStepLabel` в `.ts` и `.go`) — при изменении логики нужно править **два файла с одинаковым именем функции на двух языках**. `docs/learn/01-hero/README.md` (строка 36) явно предупреждает: «edit both when logic changes» — это правильно поймано, но масштабируется плохо при росте числа таких хелперов (сейчас единичный случай).
3. **Готовность к split-view формату:** контент готов (построчные таблицы уже есть в `docs/learn/01-hero`), но *инструмент показа* — нет. Сейчас единственный «split view» — открыть два файла в редакторе вручную по ссылкам из README. Настоящего browser-based split-viewer (как просил пользователь, «как в Sololearn») не существует.

---

## 5. Gap List

| # | Приоритет | Gap | Рекомендация |
|---|---|---|---|
| 1 | **P0** | Двойной `bun install` не задокументирован | Добавить в `README.md` и `examples/README.md` явный шаг 0: `bun install` (корень) → `cd examples && bun install` → `bun run dev:vite`. Рассмотреть bun workspaces, чтобы это стало одной командой. |
| 2 | P1 | Нет команды «одна кнопка старта» из корня | Добавить в корневой `package.json` скрипт `"dev": "cd examples && bun install && bun run dev:vite"` (или аналог) |
| 3 | P1 | `docs/learn/` — только 1 из 4 запланированных уроков | Дописать хотя бы Layout grammar (`Block`/`Box`/`Stack`/`Group`) — это правило, которое чаще всего ломает новичков (raw-тег запрещён) |
| 4 | P2 | Split-view — не браузерный, а «открой 2 файла в IDE» | Для формата Sololearn нужен отдельный микро-инструмент (даже статический — просто side-by-side HTML с подсветкой синтаксиса из существующих `.tsx`/`.templ` файлов); не требует полноценного doc-site |
| 5 | P2 | `primitives.smoke.test.tsx` — soft contract, не enforced на 1:1 покрытие | Не критично сейчас; при росте registry стоит рассмотреть скрипт, который парсит `describe()`-блоки и сверяет со списком brick'ов, ссылающихся на файл |
| 6 | P3 | Cross-stack coupling `@blocks/*-variants` в `examples/templ/` для React-only разработчика | Опционально: скопировать/симлинкнуть JSON в `examples/vite/src/data/`, чтобы React-дев не заходил в папку `templ/` |

---

## 6. Рекомендации для учебника (split-режимы)

Приоритет по режимам:

1. **React → Templ (первый режим).** Аудитория — существующая React-команда, которую «подсаживают» на Go SSR. `docs/learn/01-hero` уже реализует Exercise A именно в этом направлении — расширять дальше по той же схеме.
2. **Templ → React (второй режим).** Нужен для обратного случая (Go-команда учится React). Exercise B в `01-hero` уже это покрывает, но только для одного brick'а.
3. **Порядок уроков** (рекомендую именно такой, отражает сложность):
   - `ui/button` (нулевая сложность — variant/size/children)
   - `ui/badge` (минимум пропсов — второй урок, как уже рекомендовано в `learn/01-hero/README.md`)
   - Layout grammar (`Block`/`Box`/`Stack`/`Group`) — критично для избежания «raw div» анти-паттерна
   - `components/card` (composite, named exports)
   - `components/sheet` (behavior hooks, `@ui8kit/aria` граница) — самый сложный, оставить последним

---

## Ответы на критерии успеха аудита

**Вовлекутся ли React-разработчики без Go-бэкграунда?**
Да, при условии устранения P0 (двойной install). Само API, naming, variant-модель — всё уже проектировано так, чтобы быть узнаваемым для shadcn-разработчика. Сейчас единственный барьер — не концептуальный, а инфраструктурный.

**Сможет ли джуниор после shadcn за 1–2 дня собрать простой UI в templ?**
Да — контракт «5 файлов на brick», facade-импорты (`@ui.Button`, `@cmp.Card`) и `docs/learn/01-hero` дают достаточную опору. Ограничение: за пределами Hero/Button/Badge/Card придётся учиться по аналогии без урока.

**Насколько синхронны TSX и templ — есть ли «учебные» пары для сравнения?**
Да, на уровне проверенных brick'ов (Button, Badge, Title, Card, Sheet, Select, Disclosure, Form) — паритет фактический и задокументированный. `docs/architecture.md` и `docs/coming-from-shadcn.md` дают готовые таблицы конверсии.

**Поймёт ли слабая LLM правила добавления/изменения brick'а без догадок?**
В основном да. `.cursor/rules/templ-registry-structure.mdc` даёт явный 6-шаговый чеклист «Adding a brick», `.cursor/rules/templ-component-spec.mdc` — жёсткий контракт spec-файла, `variantcheck`/`blockonce`/`validate-spec` дают немедленную механическую обратную связь при нарушении правил. Единственный «мягкий» контракт — test coverage (см. Gap #5).

**Что сделать в первую очередь для UX уровня split-учебника в браузере?**
Сначала — закрыть P0 (bootstrap), потому что до него бессмысленно оптимизировать обучающий опыт. Затем — дописать `docs/learn/` до layout grammar и sheet. Полноценный браузерный split-viewer — это отдельная (не срочная) инвестиция уровня P2, ценная, но не блокирующая текущий прогресс.