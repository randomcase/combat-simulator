#!/usr/bin/env python3
"""
CLI Runner & Polyglot Data Model Inspector for the Sovereign Combat Simulator.
"""

from __future__ import annotations
import argparse
import json
from pathlib import Path
import sys

from combat_sim.command_loader import (
    COMMAND_LOADER_CATALOG,
    DSLScriptCommandLoader,
    ManifestCommandLoader,
    PolyglotFormatCommandLoader,
)
from combat_sim.models import LARGE_DATA_MODEL_CATALOG, Polyglot12FormatSerializer
from combat_sim.simulator import CombatSimulatorEngine


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sovereign 3.14 Pi Combat Simulator — Large Data Models, Archetypes & Command Loaders"
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(__file__).resolve().parents[2] / "data",
        help="Path to Large Data Models directory",
    )
    parser.add_argument(
        "--list-models",
        action="store_true",
        help="List all Large Data Models, Archetypes, 11-Vector Profiles, and Command Loaders",
    )
    parser.add_argument(
        "--run-script",
        type=Path,
        default=None,
        help="Execute a deterministic .cmd DSL script (e.g. data/scenarios/gauntlet_batch.cmd)",
    )
    parser.add_argument(
        "--export-formats",
        type=Path,
        default=None,
        help="Export all 12 Polyglot Data Model storage formats to the specified directory",
    )
    parser.add_argument(
        "--monte-carlo",
        type=int,
        default=0,
        help="Run N iterations of full 6x6 Archetype Matrix tournament",
    )
    args = parser.parse_args()

    loader = ManifestCommandLoader(args.data_dir)
    loader.load_all()
    engine = CombatSimulatorEngine(loader)

    if args.list_models:
        report = {
            "large_data_models": LARGE_DATA_MODEL_CATALOG,
            "command_loaders": COMMAND_LOADER_CATALOG,
            "polyglot_12_formats": [
                {"index": idx, "extension": ext, "description": desc}
                for idx, (ext, desc) in enumerate(Polyglot12FormatSerializer.FORMAT_EXTENSIONS)
            ],
            "core_archetypes": [
                {
                    "id": a["id"],
                    "name": a["name"],
                    "role": a["class_role"],
                    "armor_type": a["armor_type"],
                    "sub_archetypes": [s["id"] for s in a.get("sub_archetypes", [])],
                    "default_commands": a.get("default_commands", []),
                }
                for a in loader.archetypes.values()
            ],
            "profiles_314_11vector": [
                {
                    "profileId": p.profileId,
                    "characterName": p.characterName,
                    "archetypeClass": p.archetypeClass,
                    "mappedCoreArchetype": p.mappedCoreArchetype,
                    "statWeightPi": p.statWeightPi,
                    "armorWeightPi": p.armorWeightPi,
                    "weaponWeightPi": p.weaponWeightPi,
                    "vfxType": p.vfxType,
                    "commandsRuleStack": p.commandsRuleStack,
                }
                for p in loader.profiles_314.values()
            ],
        }
        print(json.dumps(report, indent=2, ensure_ascii=False))

    if args.export_formats is not None:
        written = PolyglotFormatCommandLoader.export_all_12_formats(
            loader.raw_profiles_314, args.export_formats
        )
        print(f"Exported {len(written)} polyglot format files to {args.export_formats}:")
        for p in written:
            print(f"  - {p.name} ({p.stat().st_size} bytes)")

    if args.run_script is not None:
        instructions = DSLScriptCommandLoader.parse_file(args.run_script)
        summary = engine.execute_dsl_instructions(instructions)
        print(json.dumps(summary, indent=2, ensure_ascii=False))

    if args.monte_carlo > 0:
        arch_ids = list(loader.archetypes.keys())
        matrix_results = []
        for i, a1 in enumerate(arch_ids):
            for a2 in arch_ids[i + 1 :]:
                res = engine.run_monte_carlo(a1, a2, iterations=args.monte_carlo)
                matrix_results.append(res)
        print(json.dumps({"tournament_matrix": matrix_results}, indent=2))

    if not (args.list_models or args.export_formats or args.run_script or args.monte_carlo > 0):
        # Default demonstration: run gauntlet_batch.cmd
        default_script = args.data_dir / "scenarios" / "gauntlet_batch.cmd"
        if default_script.exists():
            instructions = DSLScriptCommandLoader.parse_file(default_script)
            summary = engine.execute_dsl_instructions(instructions)
            print(json.dumps(summary, indent=2, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    sys.exit(main())
