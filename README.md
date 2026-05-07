# iTerm2 Karma

> Цветовая тема [Karma](https://sreetamdas.com/karma) от [Шритама Даса](https://github.com/sreetamdas) — порт для [iTerm2](https://iterm2.com).

Karma — VS Code тема, вдохновлённая Ayu, Lucy и Andromeda, с яркими акцентами на тёмном и светлом фоне. Этот репозиторий портирует её палитру в формат `.itermcolors`, чтобы терминал выглядел согласованно с редактором.

> ⚠️ **В разработке.** Готовые `.itermcolors` файлы ещё не сгенерированы. См. [.ai-factory/DESCRIPTION.md](./.ai-factory/DESCRIPTION.md).

## Превью

🌙 **Karma Dark** *(скриншот появится после первой сборки)*

☀️ **Karma Light** *(скриншот появится после первой сборки)*

## Установка

1. Скачайте файл нужного варианта из каталога [`colors/`](./colors):
   - `karma-dark.itermcolors`
   - `karma-light.itermcolors`
2. Запустите iTerm2 и откройте настройки (`⌘ + ,`).
3. Перейдите в **Profiles** → выберите профиль для редактирования.
4. На вкладке **Colors** нажмите **Color Presets** → **Import…**.
5. Выберите скачанный `.itermcolors` файл.
6. Снова откройте **Color Presets** и выберите импортированный пресет.
7. Готово. ✨

## Варианты темы

| Вариант | Файл | Использование |
|---------|------|---------------|
| 🌙 Karma Dark | [`colors/karma-dark.itermcolors`](./colors/karma-dark.itermcolors) | По умолчанию — на тёмном фоне |
| ☀️ Karma Light | [`colors/karma-light.itermcolors`](./colors/karma-light.itermcolors) | На светлом фоне (Karma Light из VS Code) |

## Сборка из исходников

Тема собирается build-скриптом на Deno из единого источника палитры в `src/palette/`. Для конечного пользователя Deno **не нужен** — `.itermcolors` файлы коммитятся в репозиторий.

```bash
# Требуется Deno >= 1.40
deno task build
```

Скрипт сгенерирует файлы в `colors/` детерминированно: повторный запуск не должен изменять выходные файлы.

См. [.ai-factory/ARCHITECTURE.md](./.ai-factory/ARCHITECTURE.md) для подробностей о слоях `palette/`, `render/`, `build.ts`.

## Источники

- [sreetamdas/karma](https://github.com/sreetamdas/karma) — оригинальная VS Code тема (MIT)
- [sreetamdas.com/karma](https://sreetamdas.com/karma) — демо-страница темы с примерами
- [catppuccin/iterm](https://github.com/catppuccin/iterm) — референс структуры репозитория и build-pipeline
- [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) — архив `.itermcolors` тем для проверки формата

## Благодарности

Огромное спасибо [Шритаму Дасу](https://github.com/sreetamdas) за оригинальную тему Karma. Этот порт лишь переводит его палитру в формат iTerm2 — вся работа по подбору цветов принадлежит ему.

Структура репозитория и build-pipeline вдохновлены [catppuccin/iterm](https://github.com/catppuccin/iterm).

## Лицензия

[MIT](./LICENSE) — совместимо с лицензией [оригинального проекта Karma](https://github.com/sreetamdas/karma/blob/main/LICENSE.md).
