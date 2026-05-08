# AGENTS.md

> Карта проекта для AI-агентов и новых разработчиков. Файл описывает только то, что реально существует в публичном репозитории. Обновляйте при значительных изменениях структуры.

## Обзор проекта

Порт VS Code темы [Karma](https://sreetamdas.com/karma) от Шритама Даса для терминала [iTerm2](https://iterm2.com). Build-pipeline на Deno + TypeScript генерирует `.itermcolors` (XML plist) для двух вариантов — Karma Dark и Karma Light. Структура повторяет [`catppuccin/iterm`](https://github.com/catppuccin/iterm).

## Стек технологий

- **Язык:** TypeScript
- **Runtime:** Deno (без `node_modules`, нативные импорты, встроенный TypeScript)
- **Формат вывода:** `.itermcolors` (Apple XML property list / NSColor 0..1)
- **VCS:** Git (ветка по умолчанию `main`)
- **Лицензия:** MIT (совместимо с MIT источника `sreetamdas/karma`)

## Структура проекта

```
.
├── colors/                             # .itermcolors (Color Preset import flow)
│   ├── karma-dark.itermcolors          # base Dark
│   ├── karma-light.itermcolors         # base Light
│   ├── karma-dark-hc.itermcolors       # high-contrast Dark
│   ├── karma-light-hc.itermcolors      # high-contrast Light
│   ├── karma-dark-dimmed.itermcolors   # dimmed Dark (OLED / late-night)
│   └── karma-light-dimmed.itermcolors  # dimmed Light (off-white)
├── profiles/                           # Dynamic Profile JSON (drop-in flow)
│   ├── karma-dark.json                 # cp into ~/Library/Application Support/iTerm2/DynamicProfiles/
│   ├── karma-light.json                # iTerm2 picks up immediately, no clicks
│   ├── karma-dark-hc.json              # стабильные Guid'ы — пересоздание = update, не дубль
│   ├── karma-light-hc.json
│   ├── karma-dark-dimmed.json
│   └── karma-light-dimmed.json
├── assets/
│   ├── SCREENSHOTS.md            # recipe для freeze-based превью
│   ├── preview.sh                # true-color ANSI генератор для freeze --execute
│   ├── _preview-data.sh          # AUTO-GENERATED: RGB triples для preview.sh (не править руками)
│   ├── karma-dark.webp           # превью Karma Dark
│   ├── karma-light.webp          # превью Karma Light
│   ├── karma-dark-hc.webp        # превью Karma Dark HC
│   ├── karma-light-hc.webp       # превью Karma Light HC
│   ├── karma-dark-dimmed.webp    # превью Karma Dark Dimmed
│   └── karma-light-dimmed.webp   # превью Karma Light Dimmed
├── src/
│   ├── palette/
│   │   ├── types.ts              # Palette, AnsiColors, UiColors, RgbComponents
│   │   ├── dark.ts               # darkPalette: Palette (refined ANSI 16, base Dark)
│   │   ├── light.ts              # lightPalette: Palette (refined Light, base Light)
│   │   ├── dark-hc.ts            # darkHcPalette — spread override on darkPalette
│   │   ├── light-hc.ts           # lightHcPalette — spread override on lightPalette
│   │   ├── dark-dimmed.ts        # darkDimmedPalette — spread override on darkPalette
│   │   └── light-dimmed.ts       # lightDimmedPalette — spread override on lightPalette
│   └── render/
│       ├── color.ts                  # parseHex(hex), parseHexBytes(hex)
│       ├── color.test.ts             # unit-тесты для color.ts
│       ├── iterm-keys.ts             # ANSI_KEY_BY_FIELD, UI_KEY_BY_FIELD (shared)
│       ├── itermcolors.ts            # renderItermcolors(palette) -> XML plist
│       ├── dynamic-profile.ts        # renderDynamicProfile(palette, opts) -> JSON
│       ├── dynamic-profile.test.ts   # unit-тесты dynamic-profile.ts
│       ├── preview-data.ts           # paletteToShell, renderPreviewData -> _preview-data.sh
│       └── preview-data.test.ts      # unit-тесты preview-data.ts
├── .github/
│   └── workflows/
│       └── ci.yml                # CI: fmt/lint/check/test + idempotency + plist validation
├── build.ts                      # оркестратор: палитра → render → colors/
├── deno.json                     # tasks: build, fmt, fmt:check, lint, test, check
├── deno.lock                     # lock-файл для воспроизводимости
├── README.md                     # инструкции по импорту, превью, сборка
├── LICENSE                       # MIT
└── .editorconfig                 # UTF-8/LF/2sp/final-newline
```

## Ключевые команды

| Команда | Что делает |
|---------|-----------|
| `deno task fmt:check` | Проверка форматирования (CI gate) |
| `deno task lint` | Линтинг |
| `deno task check` | Type-check (strict mode) |
| `deno task test` | 51 unit-тестов (parseHex, parseHexBytes, paletteToShell, renderPreviewData, renderDynamicProfile) |
| `deno task build` | Генерирует `colors/*.itermcolors`, `profiles/*.json`, `assets/_preview-data.sh` (всё детерминированно) |

## Конвенции

- **Файлы:** `kebab-case.ts` (например, `palette/dark.ts`)
- **Переменные/функции:** `camelCase`
- **Типы/интерфейсы:** `PascalCase` (`Palette`, `AnsiColors`, `UiColors`, `RgbComponents`)
- **Hex-цвета:** lowercase, формат `#rrggbb` как строки
- **TypeScript:** strict mode, все поля `readonly`, отсутствие `any`

## Архитектура

Layered + Functional Core / Imperative Shell:

- **`src/palette/`** — чистые данные. Hex-коды Karma, без I/O, без сторонних зависимостей.
- **`src/render/`** — чистые трансформации (`parseHex`, `renderItermcolors`). Никаких побочных эффектов, throws на невалидном входе.
- **`build.ts`** — единственный файл с I/O (`Deno.mkdir`, `Deno.writeTextFile`, `console.*`, `Deno.exit`).

Build детерминирован: повторный запуск `deno task build` даёт пустой `git diff colors/` (проверяется в CI).

## Архитектурные инварианты

- ✅ Hex-литералы есть **только** в `src/palette/{dark,light}.ts`. Test inputs и docstring-примеры разрешены.
- ✅ `palette/` импортирует только сам себя (`./types.ts`).
- ✅ `render/` импортирует только `../palette/types.ts` и (для `itermcolors.ts`) `./color.ts`.
- ✅ `build.ts` — entry point, не импортируется ниоткуда.
- ✅ `parseHex` — pure function, throws с понятным сообщением на невалидном hex.
- ✅ Никаких циклических импортов (проверка через `deno info src/render/itermcolors.ts`).

## Формат `.itermcolors`

Сгенерированные файлы — Apple XML property list 1.0 (НЕ binary plist). Ключевые правила:

- 24 обязательных ключа: `Ansi 0 Color` … `Ansi 15 Color` + `Background Color`, `Foreground Color`, `Bold Color`, `Cursor Color`, `Cursor Text Color`, `Selection Color`, `Selected Text Color`, `Link Color`.
- Top-level ключи отсортированы лексикографически (`Ansi 0`, `Ansi 1`, `Ansi 10`, `Ansi 11`, …, `Ansi 9`, `Background Color`, …) — соответствует выводу `plutil -convert xml1`.
- Inner dict ключи alphabetical: `Alpha Component`, `Blue Component`, `Color Space`, `Green Component`, `Red Component`.
- `Color Space` → `<string>sRGB</string>` (НЕ `Color Space Name`).
- `Alpha Component` всегда `<real>1.0</real>` (даже для opaque).
- Все RGB-компоненты — `<real>` (не `<integer>` даже для 0/1).
- DOCTYPE обязателен для портабельности.
- Валидация: `plutil -lint` (macOS) или `python3 -c "import plistlib; plistlib.load(open('...', 'rb'))"` (cross-platform, используется в CI).

## Правила для агентов

- **Палитра — единственный источник правды.** Hex-коды берутся только из `src/palette/{dark,light}.ts`. Никаких "магических" hex-кодов в `render/` или `build.ts`.
- **Воспроизводимость сборки:** двойной запуск `deno task build` должен давать пустой `git diff colors/`. Если diff есть — найти источник недетерминизма (порядок ключей, форматирование чисел, локаль).
- **Refined ANSI 16 mapping** (см. `src/palette/dark.ts` и `light.ts`): не использовать verbatim Karma `terminal.ansi*` значения — там есть quirks (`ansiBlue = orange` в Dark, инверсия ANSI 0/7 в Light).
- **Декомпозиция shell-команд:** не объединять команды через `&&` если требуется отладка. Запускать по одной и проверять результат.
- **Безопасность:** не коммитить секреты (env vars, tokens). Содержимое `.env` гитнорится.
