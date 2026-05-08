#!/usr/bin/env bash
#
# Preview script for iTerm2 Karma theme screenshots.
#
# Catppuccin-style layout: small palette swatch on the left, fetch-style
# system info on the right, ANSI 0-15 numerical strip below, blank prompt
# at the bottom.
#
# Uses 24-bit true-color escape codes with exact Karma palette hex values,
# so the output is pixel-perfect regardless of which terminal profile is
# active. Designed to be piped into `freeze --window` for the macOS chrome.
#
# All hex codes are sourced from `_preview-data.sh`, which is auto-generated
# by `build.ts` from the TypeScript palettes in `src/palette/*.ts`. This
# script never duplicates palette data — see AGENTS.md → "Архитектурные
# инварианты": hex literals exist only in src/palette/{dark,light}.ts.
#
# Usage:
#   ./assets/preview.sh dark            | freeze ...
#   ./assets/preview.sh light           | freeze ...
#   ./assets/preview.sh dark-hc         | freeze ...
#   ./assets/preview.sh light-hc        | freeze ...
#   ./assets/preview.sh dark-dimmed     | freeze ...
#   ./assets/preview.sh light-dimmed    | freeze ...

set -euo pipefail

VARIANT="${1:-dark}"

# ── Locate and source the auto-generated palette data ────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_FILE="${SCRIPT_DIR}/_preview-data.sh"

if [[ ! -f "${DATA_FILE}" ]]; then
  echo "preview.sh: ${DATA_FILE} not found." >&2
  echo "preview.sh: run 'deno task build' first to generate it." >&2
  exit 1
fi

# shellcheck source=/dev/null
source "${DATA_FILE}"

# ── Pick the active palette by mapping VARIANT → shell prefix ────────────────
# Each variant maps to the prefix defined in build.ts TARGETS (DARK, LIGHT,
# DARK_HC, LIGHT_HC, DARK_DIMMED, LIGHT_DIMMED). The variable lookup below
# uses bash indirect expansion (`${!name}`) so we read e.g. DARK_FG_R when
# VARIANT=dark, LIGHT_HC_FG_R when VARIANT=light-hc, etc.
case "${VARIANT}" in
  dark)         P="DARK";         THEME_NAME="Karma Dark" ;;
  light)        P="LIGHT";        THEME_NAME="Karma Light" ;;
  dark-hc)      P="DARK_HC";      THEME_NAME="Karma Dark HC" ;;
  light-hc)     P="LIGHT_HC";     THEME_NAME="Karma Light HC" ;;
  dark-dimmed)  P="DARK_DIMMED";  THEME_NAME="Karma Dark Dimmed" ;;
  light-dimmed) P="LIGHT_DIMMED"; THEME_NAME="Karma Light Dimmed" ;;
  *)
    echo "preview.sh: unknown variant '${VARIANT}'." >&2
    echo "preview.sh: expected one of: dark, light, dark-hc, light-hc, dark-dimmed, light-dimmed." >&2
    exit 1
    ;;
esac

# Resolve the active palette into short variables via indirect expansion.
# For each cell (FG, RED, ...) read the three R/G/B components from the
# prefixed names defined in _preview-data.sh.
resolve() {
  local cell="$1"
  local rname="${P}_${cell}_R" gname="${P}_${cell}_G" bname="${P}_${cell}_B"
  echo "${!rname} ${!gname} ${!bname}"
}

read -r FG_R FG_G FG_B   <<< "$(resolve FG)"
read -r HLT_R HLT_G HLT_B <<< "$(resolve HLT)"
read -r RED_R RED_G RED_B <<< "$(resolve RED)"
read -r GRN_R GRN_G GRN_B <<< "$(resolve GRN)"
read -r YEL_R YEL_G YEL_B <<< "$(resolve YEL)"
read -r BLU_R BLU_G BLU_B <<< "$(resolve BLU)"
read -r MAG_R MAG_G MAG_B <<< "$(resolve MAG)"
read -r CYA_R CYA_G CYA_B <<< "$(resolve CYA)"
read -r WHT_R WHT_G WHT_B <<< "$(resolve WHT)"
read -r GRY_R GRY_G GRY_B <<< "$(resolve GRY)"
read -r BR_RED_R BR_RED_G BR_RED_B <<< "$(resolve BR_RED)"
read -r BR_GRN_R BR_GRN_G BR_GRN_B <<< "$(resolve BR_GRN)"
read -r BR_YEL_R BR_YEL_G BR_YEL_B <<< "$(resolve BR_YEL)"
read -r BR_BLU_R BR_BLU_G BR_BLU_B <<< "$(resolve BR_BLU)"
read -r BR_MAG_R BR_MAG_G BR_MAG_B <<< "$(resolve BR_MAG)"
read -r BR_CYA_R BR_CYA_G BR_CYA_B <<< "$(resolve BR_CYA)"
read -r BR_WHT_R BR_WHT_G BR_WHT_B <<< "$(resolve BR_WHT)"

# ── Color helpers ─────────────────────────────────────────────────────────────
fg() { printf "\033[38;2;%d;%d;%dm" "$1" "$2" "$3"; }
bg() { printf "\033[48;2;%d;%d;%dm" "$1" "$2" "$3"; }
rst() { printf "\033[0m"; }
bld() { printf "\033[1m"; }

# ── ASCII art (small Karma "K" with palette dots) — left column ──────────────
art_lines=(
  "                "
  "  ██╗  ██╗      "
  "  ██║ ██╔╝      "
  "  █████╔╝       "
  "  ██╔═██╗       "
  "  ██║  ██╗      "
  "  ╚═╝  ╚═╝      "
  "                "
)

# ── Fetch-style system info — right column ───────────────────────────────────
info_lines=(
  ""
  "$(bld)$(fg "$GRN_R" "$GRN_G" "$GRN_B")karma$(rst)$(fg "$FG_R" "$FG_G" "$FG_B")@$(rst)$(bld)$(fg "$YEL_R" "$YEL_G" "$YEL_B")iterm2$(rst)"
  "$(fg "$GRY_R" "$GRY_G" "$GRY_B")──────────────────────$(rst)"
  "$(fg "$RED_R" "$RED_G" "$RED_B")theme$(rst)     $(fg "$FG_R" "$FG_G" "$FG_B")${THEME_NAME}$(rst)"
  "$(fg "$RED_R" "$RED_G" "$RED_B")variant$(rst)   $(fg "$FG_R" "$FG_G" "$FG_B")refined ANSI 16$(rst)"
  "$(fg "$RED_R" "$RED_G" "$RED_B")source$(rst)    $(fg "$FG_R" "$FG_G" "$FG_B")sreetamdas/karma$(rst)"
  "$(fg "$RED_R" "$RED_G" "$RED_B")license$(rst)   $(fg "$FG_R" "$FG_G" "$FG_B")MIT$(rst)"
  ""
)

# ── Render top section: art on left, info on right ───────────────────────────
echo
for i in "${!art_lines[@]}"; do
  printf "  $(fg "$HLT_R" "$HLT_G" "$HLT_B")%s$(rst)   %b\n" "${art_lines[$i]}" "${info_lines[$i]}"
done

# ── ANSI 0-15 numerical strip (each digit in its own color) ──────────────────
# ANSI 0 (black) on a dark background is invisible, so we render the "0" digit
# in ANSI 7 (white) for visibility — same trick on light backgrounds.
echo
printf "  "
i=0
for color in \
  "$WHT_R $WHT_G $WHT_B" \
  "$RED_R $RED_G $RED_B" \
  "$GRN_R $GRN_G $GRN_B" \
  "$YEL_R $YEL_G $YEL_B" \
  "$BLU_R $BLU_G $BLU_B" \
  "$MAG_R $MAG_G $MAG_B" \
  "$CYA_R $CYA_G $CYA_B" \
  "$WHT_R $WHT_G $WHT_B" \
  "$GRY_R $GRY_G $GRY_B" \
  "$BR_RED_R $BR_RED_G $BR_RED_B" \
  "$BR_GRN_R $BR_GRN_G $BR_GRN_B" \
  "$BR_YEL_R $BR_YEL_G $BR_YEL_B" \
  "$BR_BLU_R $BR_BLU_G $BR_BLU_B" \
  "$BR_MAG_R $BR_MAG_G $BR_MAG_B" \
  "$BR_CYA_R $BR_CYA_G $BR_CYA_B" \
  "$BR_WHT_R $BR_WHT_G $BR_WHT_B"
do
  read -r r g b <<< "$color"
  if (( i < 9 )); then
    printf "$(bld)$(fg "$r" "$g" "$b") %d $(rst) " "$i"
  else
    printf "$(bld)$(fg "$r" "$g" "$b")%d $(rst) " "$i"
  fi
  i=$((i + 1))
done
echo
echo

# ── Empty prompt at the bottom (catppuccin-style) ────────────────────────────
printf "  $(fg "$BLU_R" "$BLU_G" "$BLU_B")~$(rst)\n"
printf "$(bld)$(fg "$BLU_R" "$BLU_G" "$BLU_B")λ$(rst) \n"
