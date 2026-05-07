# AGENTS.md

> Карта проекта для AI-агентов и новых разработчиков. Файл описывает только то, что реально существует на момент написания. Обновляйте при значительных изменениях структуры. Подробное содержание тех или иных разделов держится в связанных артефактах — здесь только ссылки и краткие описания.

## Обзор проекта

Порт VS Code темы [Karma](https://sreetamdas.com/karma) от Шритама Даса для терминала [iTerm2](https://iterm2.com). Build-pipeline на Deno + TypeScript генерирует `.itermcolors` (XML plist) для вариантов Karma Dark и Karma Light — структура повторяет [`catppuccin/iterm`](https://github.com/catppuccin/iterm). См. подробности в [.ai-factory/DESCRIPTION.md](./.ai-factory/DESCRIPTION.md).

## Стек технологий

- **Язык программирования:** TypeScript
- **Runtime:** Deno (без `node_modules`, нативные импорты, встроенный TypeScript)
- **Формат вывода:** `.itermcolors` (Apple XML property list / NSColor 0..1)
- **VCS:** Git (ветка по умолчанию `main`)
- **Лицензия (планируется):** MIT (совместимо с MIT источника)

## Структура проекта

```
.
├── .ai-factory/                  # AI Factory: спецификации, правила, конфиг
│   ├── DESCRIPTION.md            # детальная спецификация проекта
│   ├── config.yaml               # настройки AI Factory (язык, git, пути)
│   └── rules/
│       └── base.md               # базовые конвенции проекта
├── .agents/                      # универсальные skills из skills.sh (общие для всех агентов)
│   └── skills/
│       └── deno-expert/          # экспертиза по Deno (denoland/skills)
├── .claude/                      # контекст для Claude Code
│   ├── agents/                   # агенты AI Factory (sidecar, coordinator, ...)
│   └── skills/                   # AI Factory skills + симлинки на кастомные
├── .opencode/                    # контекст для OpenCode
│   └── skills/                   # AI Factory skills + кастомные (itermcolors-format, karma-palette)
├── .git/                         # репозиторий Git
├── .ai-factory.json              # метаданные AI Factory (отслеживает установленные skills)
├── .mcp.json                     # конфиг MCP-серверов для Claude Code
├── opencode.json                 # конфиг MCP-серверов для OpenCode
├── skills-lock.json              # lock-файл skills.sh
└── AGENTS.md                     # этот файл
```

Структура исходников (текущее состояние, ✅ — реализовано):
```
.
├── colors/                       # ⏳ сгенерированные .itermcolors (будут коммититься)
├── assets/                       # ⏳ превью-скриншоты для README
├── src/
│   ├── palette/
│   │   ├── types.ts              # ✅ Palette, AnsiColors, UiColors, RgbComponents
│   │   └── dark.ts               # ✅ darkPalette: Palette (refined ANSI 16 mapping)
│   └── render/
│       ├── color.ts              # ✅ parseHex(hex) -> RgbComponents
│       └── color.test.ts         # ✅ unit-тесты parseHex (22 кейса)
├── build.ts                      # ⏳ entry point: deno run --allow-write build.ts
├── deno.json                     # ✅ tasks: build, fmt, fmt:check, lint, test, check
├── deno.lock                     # ✅ lock-файл для воспроизводимости
├── README.md                     # ✅ инструкции по импорту, ссылки
├── LICENSE                       # ⏳ MIT
└── .editorconfig                 # ⏳
```

## Ключевые точки входа

| Файл | Назначение |
|------|------------|
| `.ai-factory/DESCRIPTION.md` | Полная спецификация проекта (стек, фичи, архитектурные заметки) |
| `.ai-factory/config.yaml` | Конфигурация AI Factory: язык, git, пути к артефактам |
| `.ai-factory/rules/base.md` | Базовые конвенции (именование, модули, ошибки, логирование, плейст) |
| `opencode.json` | MCP-серверы для OpenCode (`filesystem`, `github`) |
| `.mcp.json` | MCP-серверы для Claude Code (тот же набор в формате Claude) |
| `build.ts` (планируется) | Deno-скрипт сборки, читает палитру и пишет `colors/*.itermcolors` |
| `deno.json` (планируется) | Deno tasks: `deno task build`, `deno task fmt`, `deno task lint`, `deno task test` |

## Документация

| Документ | Путь | Описание |
|----------|------|----------|
| README | `README.md` | Landing page: инструкции импорта в iTerm2, варианты темы, credits |
| Спецификация | `.ai-factory/DESCRIPTION.md` | Цели, фичи, стек, архитектурные заметки, нефункциональные требования |
| Архитектура | `.ai-factory/ARCHITECTURE.md` | Layered + Functional Core / Imperative Shell — слои, зависимости, примеры кода |
| Roadmap | `.ai-factory/ROADMAP.md` | Стратегические вехи (M1–M7): scaffold → Dark → Light → docs → CI → release → stretch |
| Базовые правила | `.ai-factory/rules/base.md` | Конвенции именования, структуры модулей, обработки ошибок, plist-формат |

## AI-контекст: skills и MCP

| Файл / каталог | Назначение |
|----------------|------------|
| `AGENTS.md` | Этот файл — структурная карта проекта для AI-агентов |
| `.ai-factory/DESCRIPTION.md` | Спецификация проекта (читайте перед началом работы над фичами) |
| `.ai-factory/ARCHITECTURE.md` | Архитектурные правила (паттерн, слои, зависимости) |
| `.ai-factory/rules/base.md` | Конвенции проекта (именование, структура, ошибки) |
| `.opencode/skills/itermcolors-format/SKILL.md` | Спецификация формата `.itermcolors` (plist 1.0, NSColor, ANSI 0–15) |
| `.opencode/skills/karma-palette/SKILL.md` | Палитра Karma (dark + light) и маппинг в ANSI 16 + iTerm2 system colors |
| `.agents/skills/deno-expert/SKILL.md` | Экспертные знания по Deno (jsr:, deno fmt, deno lint, deno test) |
| `.opencode/skills/aif-*` / `.claude/skills/aif-*` | Метаскиллы AI Factory (plan, implement, review, verify, ...) |

## MCP-серверы

| Сервер | Назначение | Требует |
|--------|------------|---------|
| `filesystem` | Расширенные файловые операции в каталоге проекта | — |
| `github` | Работа с issues, PR, репозиторием на GitHub | `GITHUB_TOKEN` в окружении |

## Правила для агентов

- **Декомпозиция shell-команд:** не объединяйте команды через `&&`, если требуется отладка. Запускайте по одной и проверяйте результат каждой.
  - Пример **неправильно**: `git checkout main && git pull`
  - Пример **правильно**: сначала `git checkout main`, затем `git pull origin main`
- **Палитра — единственный источник правды:** значения hex-кодов берутся из skill `karma-palette` (или из `src/palette/*.ts` после реализации). Никаких "магических" hex-кодов в `render/` или `build.ts`.
- **Формат `.itermcolors` — авторитет skill:** при работе с plist-выводом сверяйтесь со skill `itermcolors-format` (правильные ключи, NSColor sRGB, plist 1.0).
- **Воспроизводимость сборки:** двойной запуск `deno task build` должен давать пустой `git diff` в `colors/`. См. правила в `.ai-factory/rules/base.md`.
- **Безопасность:** не коммитить `GITHUB_TOKEN` или другие секреты. MCP-серверы читают переменные из окружения.
