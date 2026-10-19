#!/usr/bin/env python3
"""
Automated Unit & Invariant Verification Suite for the Sovereign Combat Simulator.
"""

from __future__ import annotations
from pathlib import Path
import tempfile
import unittest

from combat_sim.command_loader import (
    DSLScriptCommandLoader,
    GambitRuleCommandLoader,
    ManifestCommandLoader,
    PolyglotFormatCommandLoader,
)
from combat_sim.models import LARGE_DATA_MODEL_CATALOG, Polyglot12FormatSerializer
from combat_sim.simulator import CombatSimulatorEngine


class CombatSimulatorTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.data_dir = Path(__file__).resolve().parents[2] / "data"
        cls.loader = ManifestCommandLoader(cls.data_dir)
        cls.loader.load_all()

    def test_01_large_data_models_loaded(self) -> None:
        self.assertGreaterEqual(len(LARGE_DATA_MODEL_CATALOG), 7)
        self.assertEqual(len(self.loader.archetypes), 6)
        self.assertEqual(len(self.loader.sub_archetypes), 18)
        self.assertEqual(len(self.loader.profiles_314), 12)
        self.assertGreaterEqual(len(self.loader.commands), 25)

    def test_02_spc_matrix_conservation_invariants(self) -> None:
        spc = self.loader.spc_matrix
        p_base = spc["p_baseline"]
        p_corr = spc["p_corrected"]
        tensor = spc["transformation_tensor"]

        for i in range(4):
            self.assertAlmostEqual(sum(p_base[i]), 1.0, places=5)
            self.assertAlmostEqual(sum(p_corr[i]), 1.0, places=5)
            # Conservation of stochastic transformation tensor: sum_j T_ij == 0
            self.assertAlmostEqual(sum(tensor[i]), 0.0, places=5)
            for j in range(4):
                self.assertAlmostEqual(p_base[i][j] + tensor[i][j], p_corr[i][j], places=5)

    def test_03_gambit_rule_command_loader(self) -> None:
        rule = "ORBIT(Single_Castle, r=3.14) -> BOLSTER(All_Allies, aura=3.14x) -> HEAL(Lowest_HP_Unit, threshold=62.8%) -> SEAL_QUMQUM(Nearest_Warlock_Zalim, until_hp_depleted)"
        clauses = GambitRuleCommandLoader.compile_rule_stack(rule)
        self.assertEqual(len(clauses), 4)
        self.assertEqual(clauses[0].verb, "ORBIT")
        self.assertEqual(clauses[0].target_expr, "Single_Castle")
        self.assertEqual(clauses[0].params.get("r"), "3.14")
        self.assertEqual(clauses[3].verb, "SEAL_QUMQUM")

    def test_04_11vector_procedural_clash_weighing(self) -> None:
        engine = CombatSimulatorEngine(self.loader, seed=314159265)
        res = engine.calculate_11vector_clash(
            "CHAR-001-GOOD-WARLOCK",
            "CHAR-011-SYNDICATION-SORCERER",
            stat_w=9.42,
            weapon_w=3.14,
            armor_w=1.57,
            empower_w=3.14,
        )
        self.assertGreater(res.net_damage_per_hit, 31.4)
        self.assertGreater(res.lanchester_asabiyyah_win_prob_pct, 85.0)
        self.assertLessEqual(res.turns_to_win, 10)

    def test_05_dsl_script_execution_and_determinism(self) -> None:
        script_path = self.data_dir / "scenarios" / "gauntlet_batch.cmd"
        instructions = DSLScriptCommandLoader.parse_file(script_path)
        self.assertGreaterEqual(len(instructions), 15)

        engine1 = CombatSimulatorEngine(self.loader, seed=314159265)
        out1 = engine1.execute_dsl_instructions(instructions)

        engine2 = CombatSimulatorEngine(self.loader, seed=314159265)
        out2 = engine2.execute_dsl_instructions(instructions)

        self.assertEqual(out1["match_results"], out2["match_results"])
        self.assertEqual(out1["monte_carlo_results"], out2["monte_carlo_results"])

    def test_06_polyglot_12_formats_serialization(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            out_dir = Path(tmp)
            files = PolyglotFormatCommandLoader.export_all_12_formats(
                self.loader.raw_profiles_314, out_dir
            )
            self.assertEqual(len(files), 12)
            for f in files:
                self.assertTrue(f.exists())
                self.assertGreater(f.stat().st_size, 100)


if __name__ == "__main__":
    unittest.main(verbosity=2)
