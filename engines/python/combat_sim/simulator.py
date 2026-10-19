"""
Deterministic Tick-Based, 11-Vector & Monte Carlo Combat Simulation Engine
with Statistical Process Control (SPC S0..S3) State-Transition Matrix governance.
"""

from __future__ import annotations
from dataclasses import dataclass, field
import math
import random
from typing import Any, Dict, List, Optional, Tuple

from .command_loader import (
    DSLInstruction,
    GambitRuleCommandLoader,
    ManifestCommandLoader,
)
from .models import PI_314, ActiveStatusEffect, CharacterProfile314, CombatEntity


@dataclass
class Clash11VectorResult:
    attacker_id: str
    defender_id: str
    initiative_rad_per_sec: float
    raw_weighted_offense: float
    defender_armor_mitigation: float
    net_damage_per_hit: float
    turns_to_win: int
    lanchester_asabiyyah_win_prob_pct: float
    active_vfx: str
    commands_stack: str


@dataclass
class SimulationMatchResult:
    seed: int
    combat_mode: str
    winning_team: str
    total_ticks: int
    survivors: List[str]
    team_damage_dealt: Dict[str, float]
    spc_state_transitions: int
    possibility_overrides_triggered: int
    telemetry_log: List[Dict[str, Any]] = field(default_factory=list)


class CombatSimulatorEngine:
    """Executes deterministic tick combat, 11-vector weighing, DSL scripts, and Monte Carlo batches."""

    def __init__(self, loader: ManifestCommandLoader, seed: int = 314159265) -> None:
        self.loader = loader
        self.seed = seed
        self.rng = random.Random(seed)
        self.combat_mode = "SIEGE"
        self.spc_policy = "CORRECTED"
        self.entities: Dict[str, CombatEntity] = {}
        self.queued_commands: Dict[int, List[Tuple[str, str, str]]] = {}
        self.throne_decrees: List[str] = []

    def reset_rng(self, seed: int) -> None:
        self.seed = seed
        self.rng = random.Random(seed)

    def calculate_11vector_clash(
        self,
        attacker_profile_id: str,
        defender_profile_id: str,
        stat_w: Optional[float] = None,
        weapon_w: Optional[float] = None,
        armor_w: Optional[float] = None,
        empower_w: float = PI_314,
    ) -> Clash11VectorResult:
        att: CharacterProfile314 = self.loader.profiles_314[attacker_profile_id]
        dfn: CharacterProfile314 = self.loader.profiles_314[defender_profile_id]

        s_w = stat_w if stat_w is not None else att.statWeightPi
        w_w = weapon_w if weapon_w is not None else att.weaponWeightPi
        a_w = armor_w if armor_w is not None else dfn.armorWeightPi

        initiative = round((att.moveSpeedPi * s_w) / max(0.5, w_w * 0.314), 2)
        raw_offense = att.baseAttack * (s_w / PI_314) * (1.0 + w_w / 6.28) * (empower_w / PI_314)
        mitigation = dfn.baseDefense * (a_w / PI_314) * 0.628
        net_dmg = max(31.4, raw_offense - mitigation)
        turns = math.ceil(dfn.baseHp / net_dmg)
        win_prob = min(99.6, max(52.0, 68.0 + (raw_offense - mitigation) * 0.085))

        return Clash11VectorResult(
            attacker_id=att.profileId,
            defender_id=dfn.profileId,
            initiative_rad_per_sec=initiative,
            raw_weighted_offense=round(raw_offense, 2),
            defender_armor_mitigation=round(mitigation, 2),
            net_damage_per_hit=round(net_dmg, 2),
            turns_to_win=turns,
            lanchester_asabiyyah_win_prob_pct=round(win_prob, 2),
            active_vfx=att.vfxType,
            commands_stack=att.commandsRuleStack,
        )

    def step_spc_state(self, entity: CombatEntity) -> Tuple[str, str, bool]:
        """Evaluates SPC state transitions using P_baseline or P_corrected = P_baseline + T."""
        spc = self.loader.spc_matrix
        states_order: List[str] = spc["state_order"]
        curr_idx = states_order.index(entity.spc_state)

        # Possibility space override check (Pi > 0.75)
        override_threshold = float(spc.get("possibility_override_threshold", 0.75))
        if entity.pi_possibility > override_threshold and entity.corrected_policy:
            prev = entity.spc_state
            entity.spc_state = "S0"
            entity.sigma_drift = max(0.2, entity.sigma_drift - 1.4)
            entity.cp_index = max(1.35, entity.cp_index + 0.30)
            entity.pi_possibility = 0.25
            return prev, entity.spc_state, True

        matrix_key = "p_corrected" if (self.spc_policy == "CORRECTED" and entity.corrected_policy) else "p_baseline"
        row_probs: List[float] = spc[matrix_key][curr_idx]

        r = self.rng.random()
        cumulative = 0.0
        next_state = entity.spc_state
        for idx, prob in enumerate(row_probs):
            cumulative += prob
            if r <= cumulative:
                next_state = states_order[idx]
                break

        # Prevent healthy entities from randomly entering S3 KO without taking critical damage
        if next_state == "S3" and entity.hp > entity.max_hp * 0.18:
            next_state = "S2"

        prev = entity.spc_state
        entity.spc_state = next_state
        return prev, next_state, False

    def select_command(self, actor: CombatEntity, allies: List[CombatEntity], enemies: List[CombatEntity]) -> Tuple[str, CombatEntity]:
        """Selects optimal command and target using Utility AI & Gambit rules."""
        living_enemies = [e for e in enemies if e.is_alive]
        living_allies = [a for a in allies if a.is_alive]
        target = min(living_enemies, key=lambda e: e.hp) if living_enemies else actor

        # Emergency SPC recovery if in S2 or low HP
        if actor.spc_state == "S2" or actor.hp < actor.max_hp * 0.35:
            for emergency_cmd in ("CMD_SHUNT_ATTENUATE", "CMD_POSSIBILITY_PURGE", "CMD_MATRIX_RECALIBRATE", "CMD_IRON_BULWARK", "CMD_MANA_BARRIER"):
                if emergency_cmd in actor.default_commands and actor.cooldowns.get(emergency_cmd, 0) == 0:
                    cmd_def = self.loader.commands[emergency_cmd]
                    if actor.stamina >= cmd_def["stamina_cost"] and actor.mana >= cmd_def["mana_cost"]:
                        return emergency_cmd, actor

        # Evaluate available offensive/control commands
        best_cmd = "CMD_BASIC_STRIKE"
        best_score = -1.0
        for cmd_id in actor.default_commands:
            if actor.cooldowns.get(cmd_id, 0) > 0:
                continue
            cmd_def = self.loader.commands.get(cmd_id)
            if not cmd_def:
                continue
            if actor.stamina < cmd_def["stamina_cost"] or actor.mana < cmd_def["mana_cost"]:
                continue
            scaling = cmd_def["scaling"]
            est_dmg = (
                scaling.get("base_damage", 0.0)
                + actor.effective_stat("attack_power") * scaling.get("attack_power_ratio", 0.0)
                + actor.effective_stat("spell_power") * scaling.get("spell_power_ratio", 0.0)
            )
            if target.hp < target.max_hp * 0.35 and scaling.get("missing_hp_bonus_ratio", 0.0) > 0:
                est_dmg *= 1.55
            if est_dmg > best_score:
                best_score = est_dmg
                best_cmd = cmd_id

        return best_cmd, target

    def execute_command(
        self, tick: int, actor: CombatEntity, cmd_id: str, target: CombatEntity
    ) -> Dict[str, Any]:
        cmd_def = self.loader.commands.get(cmd_id, self.loader.commands["CMD_BASIC_STRIKE"])
        actor.stamina = max(0.0, actor.stamina - float(cmd_def["stamina_cost"]))
        actor.mana = max(0.0, actor.mana - float(cmd_def["mana_cost"]))
        actor.cooldowns[cmd_id] = int(cmd_def["cooldown_ticks"])

        spc_mod = self.loader.spc_matrix["states"][actor.spc_state]["combat_modifier"]
        target_spc_mod = self.loader.spc_matrix["states"][target.spc_state]["combat_modifier"]

        scaling = cmd_def["scaling"]
        self_heal = float(scaling.get("self_heal", 0.0))
        if self_heal > 0.0:
            actor.hp = min(actor.max_hp, actor.hp + self_heal * (actor.stat_weight_pi / 6.28))

        base_dmg = float(scaling.get("base_damage", 0.0))
        damage_dealt = 0.0
        is_crit = False
        is_hit = True

        if base_dmg > 0.0 and target.is_alive:
            hit_prob = max(
                0.20,
                min(
                    0.99,
                    actor.effective_stat("accuracy")
                    + spc_mod["accuracy_bonus"]
                    - target.effective_stat("evasion") * 0.5,
                ),
            )
            is_hit = self.rng.random() <= hit_prob
            if is_hit:
                raw_dmg = (
                    base_dmg
                    + actor.effective_stat("attack_power") * float(scaling.get("attack_power_ratio", 0.0))
                    + actor.effective_stat("spell_power") * float(scaling.get("spell_power_ratio", 0.0))
                )
                if float(scaling.get("missing_hp_bonus_ratio", 0.0)) > 0.0:
                    missing_ratio = max(0.0, (target.max_hp - target.hp) / target.max_hp)
                    raw_dmg *= 1.0 + missing_ratio * float(scaling["missing_hp_bonus_ratio"])

                # 8x8 Damage Type Matrix multiplier
                dmg_type = cmd_def["damage_type"]
                armor_types: List[str] = self.loader.damage_matrix["armor_types"]
                armor_idx = armor_types.index(target.armor_type) if target.armor_type in armor_types else 0
                type_mult = float(self.loader.damage_matrix["effectiveness_matrix"][dmg_type][armor_idx])

                # Armor / Magic Resist hyperbolic mitigation curve
                if dmg_type in ("SLASH", "PIERCE", "BLUNT"):
                    eff_def = target.effective_stat("armor") * target_spc_mod["defense_multiplier"] * (1.0 - actor.armor_penetration)
                    k = float(self.loader.damage_matrix["mitigation_constants"]["armor_half_mitigation_k"])
                    mit_mult = k / (k + max(0.0, eff_def))
                elif dmg_type == "TRUE":
                    mit_mult = 1.0
                else:
                    eff_def = target.effective_stat("magic_resist") * target_spc_mod["defense_multiplier"] * (1.0 - actor.magic_penetration)
                    k = float(self.loader.damage_matrix["mitigation_constants"]["resist_half_mitigation_k"])
                    mit_mult = k / (k + max(0.0, eff_def))

                crit_prob = min(0.95, actor.effective_stat("crit_chance") + float(cmd_def.get("crit_bonus", 0.0)))
                is_crit = self.rng.random() <= crit_prob
                crit_mult = actor.crit_multiplier if is_crit else 1.0

                # 3.14 Pi weight ratio adjustment
                pi_weight_factor = (actor.stat_weight_pi / 6.28) * (1.0 + (actor.weapon_weight_pi - target.armor_weight_pi) * 0.04)
                damage_dealt = max(
                    raw_dmg * 0.08,
                    raw_dmg * type_mult * mit_mult * crit_mult * spc_mod["damage_multiplier"] * max(0.65, pi_weight_factor),
                )
                damage_dealt = round(damage_dealt, 2)
                target.hp = max(0.0, round(target.hp - damage_dealt, 2))

                lifesteal = float(scaling.get("lifesteal_ratio", 0.0))
                if lifesteal > 0.0:
                    actor.hp = min(actor.max_hp, round(actor.hp + damage_dealt * lifesteal, 2))

                # Poise & SPC drift impact
                poise_dmg = float(cmd_def.get("poise_damage", 0.0)) * (1.0 - target.tenacity * 0.5)
                target.poise = max(0.0, target.poise - poise_dmg)
                spc_eff = cmd_def.get("spc_effect", {})
                target.sigma_drift = min(5.0, target.sigma_drift + float(spc_eff.get("sigma_delta_target", 0.15)))
                if target.poise <= 0.0:
                    target.spc_state = "S2"
                    target.poise = target.max_poise * 0.5
                    target.pi_possibility = min(1.0, target.pi_possibility + 0.30)

        # Apply status effects
        for eff in cmd_def.get("status_effects", []):
            eff_target = actor if eff.get("target") == "SELF" else target
            eff_target.status_effects.append(
                ActiveStatusEffect(
                    effect_id=eff["id"],
                    name=eff["name"],
                    remaining_ticks=int(eff["duration_ticks"]),
                    stat_mod=dict(eff.get("stat_mod", {})),
                    tick_damage=float(eff.get("tick_damage", 0.0)),
                )
            )

        # Actor SPC self-adjustment
        spc_eff = cmd_def.get("spc_effect", {})
        actor.cp_index = max(0.4, min(2.2, actor.cp_index + float(spc_eff.get("cp_delta_self", 0.0))))
        actor.sigma_drift = max(0.1, actor.sigma_drift + float(spc_eff.get("sigma_delta_self", 0.0)))

        if target.hp <= 0.0:
            target.spc_state = "S3"

        return {
            "tick": tick,
            "actor": actor.unit_id,
            "command": cmd_id,
            "target": target.unit_id,
            "hit": is_hit,
            "crit": is_crit,
            "damage": damage_dealt,
            "target_hp": target.hp,
            "actor_spc": actor.spc_state,
            "target_spc": target.spc_state,
        }

    def simulate_match(self, max_ticks: int = 60, record_telemetry: bool = True) -> SimulationMatchResult:
        telemetry: List[Dict[str, Any]] = []
        team_dmg: Dict[str, float] = {}
        spc_transitions = 0
        overrides = 0

        for u in self.entities.values():
            team_dmg.setdefault(u.team, 0.0)

        t = 0
        while t < max_ticks:
            t += 1
            living = [u for u in self.entities.values() if u.is_alive]
            teams_alive = {u.team for u in living}
            if len(teams_alive) <= 1:
                break

            # Sort turn order by effective attack_speed * stat_weight_pi
            turn_order = sorted(
                living,
                key=lambda u: (u.effective_stat("attack_speed") * u.stat_weight_pi, u.unit_id),
                reverse=True,
            )

            for unit in turn_order:
                if not unit.is_alive:
                    continue

                # Tick status effects & regen
                next_effects: List[ActiveStatusEffect] = []
                for eff in unit.status_effects:
                    if eff.tick_damage > 0.0:
                        unit.hp = max(0.0, round(unit.hp - eff.tick_damage, 2))
                    eff.remaining_ticks -= 1
                    if eff.remaining_ticks > 0:
                        next_effects.append(eff)
                unit.status_effects = next_effects
                if unit.hp <= 0.0:
                    unit.spc_state = "S3"
                    continue

                unit.stamina = min(unit.max_stamina, unit.stamina + unit.stamina_regen)
                unit.mana = min(unit.max_mana, unit.mana + unit.mana_regen)
                for cid in list(unit.cooldowns.keys()):
                    if unit.cooldowns[cid] > 0:
                        unit.cooldowns[cid] -= 1

                prev_s, next_s, ovr = self.step_spc_state(unit)
                if prev_s != next_s:
                    spc_transitions += 1
                if ovr:
                    overrides += 1
                if not unit.is_alive:
                    continue

                # Check queued command for this tick/actor
                chosen_cmd: Optional[str] = None
                chosen_target: Optional[CombatEntity] = None
                for q_actor, q_cmd, q_target in self.queued_commands.get(t, []):
                    if q_actor == unit.unit_id and q_target in self.entities:
                        chosen_cmd = q_cmd
                        chosen_target = self.entities[q_target]
                        break

                if not chosen_cmd or not chosen_target or not chosen_target.is_alive:
                    allies = [a for a in self.entities.values() if a.team == unit.team and a.is_alive]
                    enemies = [e for e in self.entities.values() if e.team != unit.team and e.is_alive]
                    if not enemies:
                        break
                    chosen_cmd, chosen_target = self.select_command(unit, allies, enemies)

                ev = self.execute_command(t, unit, chosen_cmd, chosen_target)
                team_dmg[unit.team] = round(team_dmg.get(unit.team, 0.0) + ev["damage"], 2)
                if record_telemetry:
                    telemetry.append(ev)

        living_end = [u for u in self.entities.values() if u.is_alive]
        teams_remaining = list({u.team for u in living_end})
        if len(teams_remaining) == 1:
            winner = teams_remaining[0]
        else:
            # Tie-breaker by total remaining HP
            hp_by_team: Dict[str, float] = {}
            for u in living_end:
                hp_by_team[u.team] = hp_by_team.get(u.team, 0.0) + u.hp
            winner = max(hp_by_team.items(), key=lambda kv: kv[1])[0] if hp_by_team else "DRAW"

        return SimulationMatchResult(
            seed=self.seed,
            combat_mode=self.combat_mode,
            winning_team=winner,
            total_ticks=t,
            survivors=[u.unit_id for u in living_end],
            team_damage_dealt=team_dmg,
            spc_state_transitions=spc_transitions,
            possibility_overrides_triggered=overrides,
            telemetry_log=telemetry,
        )

    def run_monte_carlo(
        self, arch_a: str, arch_b: str, iterations: int = 200, max_ticks: int = 50
    ) -> Dict[str, Any]:
        wins_a = 0
        wins_b = 0
        total_ticks = 0
        total_spc_transitions = 0

        for i in range(iterations):
            self.reset_rng(314159 + i * 314)
            self.entities.clear()
            self.queued_commands.clear()
            self.entities["alpha_1"] = self.loader.spawn_entity("alpha_1", arch_a, "TEAM_ALPHA")
            self.entities["omega_1"] = self.loader.spawn_entity("omega_1", arch_b, "TEAM_OMEGA")
            res = self.simulate_match(max_ticks=max_ticks, record_telemetry=False)
            if res.winning_team == "TEAM_ALPHA":
                wins_a += 1
            elif res.winning_team == "TEAM_OMEGA":
                wins_b += 1
            total_ticks += res.total_ticks
            total_spc_transitions += res.spc_state_transitions

        return {
            "matchup": f"{arch_a} vs {arch_b}",
            "iterations": iterations,
            "arch_a_win_rate": round(wins_a / max(1, iterations), 4),
            "arch_b_win_rate": round(wins_b / max(1, iterations), 4),
            "avg_ticks_to_resolution": round(total_ticks / max(1, iterations), 2),
            "avg_spc_transitions": round(total_spc_transitions / max(1, iterations), 2),
        }

    def execute_dsl_instructions(self, instructions: List[DSLInstruction]) -> Dict[str, Any]:
        summary: Dict[str, Any] = {
            "instructions_executed": 0,
            "spawned_units": [],
            "throne_decrees": [],
            "clash_11vector_results": [],
            "match_results": [],
            "monte_carlo_results": [],
        }

        for inst in instructions:
            summary["instructions_executed"] += 1
            op = inst.opcode
            if op == "SET_SEED" and inst.args:
                self.reset_rng(int(inst.args[0]))
            elif op == "SET_COMBAT_MODE" and inst.args:
                self.combat_mode = inst.args[0]
            elif op == "SET_SPC_POLICY" and inst.args:
                self.spc_policy = inst.args[0].upper()
            elif op == "SPAWN" and len(inst.args) >= 4:
                uid, arch_id, sub_id, team = inst.args[:4]
                prof_id = inst.args[4] if len(inst.args) >= 5 else None
                entity = self.loader.spawn_entity(uid, arch_id, team, sub_id, prof_id)
                self.entities[uid] = entity
                summary["spawned_units"].append(uid)
            elif op == "BIND_GAMBIT" and inst.args:
                uid = inst.args[0]
                if uid in self.entities:
                    clauses = GambitRuleCommandLoader.compile_rule_stack(inst.kv_args.get("rule_stack", ""))
                    self.entities[uid].gambit_stack = [c.verb for c in clauses]
            elif op == "THRONE_DECREE" and inst.args:
                decree_name = ":".join(inst.args)
                self.throne_decrees.append(decree_name)
                summary["throne_decrees"].append(decree_name)
                # Apply +3.14% Castle Barakah buff to TEAM_ALPHA
                for u in self.entities.values():
                    if u.team == "TEAM_ALPHA":
                        u.hp = min(u.max_hp, round(u.hp * 1.0314, 2))
                        u.cp_index = min(2.2, round(u.cp_index + 0.05, 3))
            elif op == "QUEUE_CMD":
                tick_no = int(inst.kv_args.get("tick", "1"))
                actor_id = inst.kv_args.get("actor", "")
                cmd_id = inst.kv_args.get("cmd", "CMD_BASIC_STRIKE")
                target_id = inst.kv_args.get("target", "")
                self.queued_commands.setdefault(tick_no, []).append((actor_id, cmd_id, target_id))
            elif op == "CLASH_11VECTOR" and len(inst.args) >= 2:
                att_id, def_id = inst.args[0], inst.args[1]
                stat_pi = float(inst.kv_args["stat_pi"]) if "stat_pi" in inst.kv_args else None
                weap_pi = float(inst.kv_args["weapon_pi"]) if "weapon_pi" in inst.kv_args else None
                arm_pi = float(inst.kv_args["armor_pi"]) if "armor_pi" in inst.kv_args else None
                emp_pi = float(inst.kv_args.get("empower_pi", str(PI_314)))
                clash_res = self.calculate_11vector_clash(att_id, def_id, stat_pi, weap_pi, arm_pi, emp_pi)
                summary["clash_11vector_results"].append(clash_res.__dict__)
            elif op == "SIMULATE_MATCH":
                max_t = int(inst.kv_args.get("max_ticks", "60"))
                m_res = self.simulate_match(max_ticks=max_t, record_telemetry=True)
                summary["match_results"].append(
                    {
                        "seed": m_res.seed,
                        "combat_mode": m_res.combat_mode,
                        "winning_team": m_res.winning_team,
                        "total_ticks": m_res.total_ticks,
                        "survivors": m_res.survivors,
                        "team_damage_dealt": m_res.team_damage_dealt,
                        "spc_state_transitions": m_res.spc_state_transitions,
                        "possibility_overrides_triggered": m_res.possibility_overrides_triggered,
                        "events_recorded": len(m_res.telemetry_log),
                    }
                )
            elif op == "MONTE_CARLO":
                iters = int(inst.kv_args.get("iterations", "200"))
                matchup = inst.kv_args.get("matchup", "ARCH_SENTINEL:ARCH_BERSERKER")
                arch_a, arch_b = matchup.split(":", 1)
                mc_res = self.run_monte_carlo(arch_a, arch_b, iterations=iters)
                summary["monte_carlo_results"].append(mc_res)

        return summary
