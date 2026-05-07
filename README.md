# iTerm2 Karma

> Цветовая тема [Karma](https://sreetamdas.com/karma) от [Шритама Даса](https://github.com/sreetamdas) — порт для [iTerm2](https://iterm2.com).

Karma — VS Code тема, вдохновлённая Ayu, Lucy и Andromeda, с яркими акцентами на тёмном и светлом фоне. Этот репозиторий портирует её палитру в формат `.itermcolors`, чтобы терминал выглядел согласованно с редактором.

## Превью

<p align="center">
  <img src="assets/karma-dark.webp" alt="Karma Dark theme in iTerm2" width="800">
  <br>
  <em>🌙 Karma Dark</em>
</p>

<p align="center">
  <img src="assets/karma-light.webp" alt="Karma Light theme in iTerm2" width="800">
  <br>
  <em>☀️ Karma Light</em>
</p>

## Установка

1. Скачайте файл нужного варианта из каталога [`colors/`](./colors):
   - [`karma-dark.itermcolors`](./colors/karma-dark.itermcolors)
   - [`karma-light.itermcolors`](./colors/karma-light.itermcolors)
2. Запустите iTerm2 и откройте настройки (`⌘ + ,`).
3. Перейдите в **Profiles** → выберите профиль для редактирования.
4. На вкладке **Colors** нажмите **Color Presets** → **Import…**.
5. Выберите скачанный `.itermcolors` файл.
6. Снова откройте **Color Presets** и выберите импортированный пресет.
7. Готово. ✨

## Варианты темы

| Вариант | Файл | Использование |
|---------|------|---------------|
| 🌙 Karma Dark | [`colors/karma-dark.itermcolors`](./colors/karma-dark.itermcolors) | На тёмном фоне (default Karma) |
| ☀️ Karma Light | [`colors/karma-light.itermcolors`](./colors/karma-light.itermcolors) | На светлом фоне (Karma Light из VS Code) |

## Рекомендуемый шрифт

Karma в оригинале использует [Iosevka](https://typeof.net/Iosevka/) (`Iosevka Term` или `Iosevka`). Для максимального соответствия исходной теме рекомендуется тот же шрифт в iTerm2. Любой другой моноширинный шрифт работает корректно — палитра не зависит от шрифта.

## Сборка из исходников

Тема собирается build-скриптом на Deno из единого источника палитры в `src/palette/`. Для конечного пользователя Deno **не нужен** — `.itermcolors` файлы закоммичены в репозиторий.

```bash
# Требуется Deno >= 2.0
deno task build
```

Скрипт детерминированно генерирует файлы в `colors/`: повторный запуск не вносит изменений (проверяется в CI через `git diff --exit-code colors/`). Полный pipeline:

```bash
deno task fmt:check    # форматирование
deno task lint         # линтинг
deno task check        # типы (strict mode)
deno task test         # 23 unit-теста parseHex
deno task build        # сгенерировать оба .itermcolors
```

См. [.ai-factory/ARCHITECTURE.md](./.ai-factory/ARCHITECTURE.md) для подробностей о слоях `palette/`, `render/`, `build.ts` (Layered + Functional Core / Imperative Shell).

## Скриншоты темы

Recipe для воспроизведения превью-скриншотов: [`assets/SCREENSHOTS.md`](./assets/SCREENSHOTS.md).

## Источники

- [sreetamdas/karma](https://github.com/sreetamdas/karma) — оригинальная VS Code тема (MIT)
- [sreetamdas.com/karma](https://sreetamdas.com/karma) — демо-страница темы с примерами на разных языках
- [catppuccin/iterm](https://github.com/catppuccin/iterm) — референс структуры репозитория и build-pipeline
- [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) — архив `.itermcolors` тем для проверки формата

## Благодарности

Огромное спасибо [Шритаму Дасу](https://github.com/sreetamdas) за оригинальную тему Karma. Этот порт переводит его палитру в формат iTerm2 — вся работа по подбору цветов и эстетических решений принадлежит ему.

Структура репозитория и build-pipeline вдохновлены [catppuccin/iterm](https://github.com/catppuccin/iterm).

## Лицензия

[MIT](./LICENSE) — совместимо с лицензией [оригинального проекта Karma](https://github.com/sreetamdas/karma/blob/main/LICENSE.md).
