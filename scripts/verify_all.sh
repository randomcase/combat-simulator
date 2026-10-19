#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=================================================================="
echo "1. VERIFYING LARGE DATA MODELS & 12 POLYGLOT STORAGE CARTRIDGES"
echo "=================================================================="
ls -lh data/*.json data/scenarios/*.cmd data/formats/sovereign_combat_model_314.*

echo ""
echo "=================================================================="
echo "2. RUNNING PYTHON 3.12 ENGINE UNIT & INVARIANT TESTS + CLI"
echo "=================================================================="
python -m unittest discover -s engines/python -p "test_*.py" -v
python engines/python/main.py --run-script data/scenarios/gauntlet_batch.cmd
python engines/python/main.py --monte-carlo 50

echo ""
echo "=================================================================="
echo "3. RUNNING GO 1.26 ENGINE UNIT TESTS & CONCURRENT MONTE CARLO CLI"
echo "=================================================================="
cd "$ROOT_DIR/engines/go"
go test -v ./internal/engine
go run ./cmd/sim --data ../../data --iterations 500 --workers 8
cd "$ROOT_DIR"

echo ""
echo "=================================================================="
echo "4. COMPILING & RUNNING JAVA 26 VIRTUAL-THREAD ENGINE"
echo "=================================================================="
mkdir -p engines/java/bin
javac -d engines/java/bin engines/java/src/main/java/com/combatsim/Main.java
java -cp engines/java/bin com.combatsim.Main --data data

echo ""
echo "=================================================================="
echo "5. Copying/Syncing index.html FOR GITHUB PAGES / STUDIO LAUNCH"
echo "=================================================================="
cp -f islamic-single-castle-25d-rpg-caravan-siege-314-studio-game.html index.html
ls -lh index.html islamic-single-castle-25d-rpg-caravan-siege-314-studio-game.html

echo ""
echo "ALL POLYGLOT ENGINES, LARGE DATA MODELS & COMMAND LOADERS VERIFIED!"
