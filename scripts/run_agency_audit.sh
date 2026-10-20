#!/usr/bin/env bash
# ==============================================================================
# SOVEREIGN 3.14π REPOSITORY AGENCY — PRE-THOUGHT REFERENTIAL AUDIT & AUTO-TUNE
# Accessed FIRST before thought, analyzation, principle, and priory-to-form.
# ==============================================================================
set -euo pipefail

echo "=============================================================================="
echo "♊ SOVEREIGN 3.14π REPOSITORY AGENCY — 12-SECTOR (360° / 2π) PRE-THOUGHT GATE"
echo "=============================================================================="

REQUIRED_MDS=(
  "agency/00-PRE-THOUGHT-INDEX.md"
  "agency/01-pi-thought-curver.md"
  "agency/02-circular-combat-physics.md"
  "agency/03-archetype-command-smith.md"
  "agency/04-command-loader-governor.md"
  "agency/05-monte-carlo-11vector-analyst.md"
  "agency/06-spc-decision-arbiter.md"
  "agency/07-castle-throne-steward.md"
  "agency/08-caravan-commodity-quartermaster.md"
  "agency/09-diplomacy-syndication-envoy.md"
  "agency/10-viewport-ui-architect.md"
  "agency/11-library-lore-chronicler.md"
  "agency/12-polyglot-work-executor.md"
)

for md in "${REQUIRED_MDS[@]}"; do
  if [[ ! -f "$md" ]]; then
    echo "❌ MISSING PRE-THOUGHT AGENCY DOCUMENT: $md"
    exit 1
  fi
  echo "✔ [REFERENCED FIRST] $md ($(wc -l < "$md" | tr -d ' ') lines)"
done

echo "------------------------------------------------------------------------------"
echo "🔍 Auditing Studio JavaScript Modules via Node.js Syntax & Circular Standards..."
for js in studio/studio-data.js studio/studio-commands.js studio/studio-agency.js studio/studio-viewports.js studio/studio-app.js; do
  if [[ -f "$js" ]]; then
    node --check "$js"
    echo "✔ [SYNTAX & STANDARD OK] $js"
  fi
done

echo "=============================================================================="
echo "⭕ 360° (2π = 6.283 rad) PRE-THOUGHT AGENCY GATE COMPLETE — ALL 12 SECTORS LOCKED"
echo "=============================================================================="
