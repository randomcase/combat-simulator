"""
Command Loaders Architecture for the Sovereign Combat Simulator.
Provides 5 specialized Command Loaders:
1. ManifestCommandLoader      — Loads JSON Large Data Models (ECAT, 314-11Vector, CADFG, MSTM-SPC)
2. GambitRuleCommandLoader    — Compiles autonomous Gambit AI strings into executable rule nodes
3. DSLScriptCommandLoader     — Parses deterministic .cmd combat & tournament batch scripts
4. PolyglotFormatCommandLoader— Ingests and exports all 12 Polyglot data model formats
5. StreamReplayCommandLoader  — Streams NDJSON event logs & Monte Carlo job manifests
"""

from __future__ import annotations
from dataclasses import dataclass, field
import json
from pathlib import Path
import re
from typing import Any, Dict, List, Optional

from .models import CharacterProfile314, CombatEntity, Polyglot12FormatSerializer


COMMAND_LOADER_CATALOG: List[Dict[str, str]] = [
    {
        "loader_id": "LOADER-01-MANIFEST",
        "class_name": "ManifestCommandLoader",
        "supported_inputs": "archetypes.json, profiles_314.json, commands.json, damage_matrix.json, spc_transition_matrix.json",
        "purpose": "Validates and loads high-dimensional ECAT stat tensors, 11-vector profiles, 8x8 damage graphs, and SPC transition matrices into memory.",
    },
    {
        "loader_id": "LOADER-02-GAMBIT-AST",
        "class_name": "GambitRuleCommandLoader",
        "supported_inputs": "Gambit DSL chains: VERB(Target, key=val) -> VERB2(...)",
        "purpose": "Compiles autonomous node instruction stacks (ORBIT, TRADE, BOLSTER, HOLD, ATTACK, DEFEND, HEAL, PURSUE_A_STAR, SEAL_QUMQUM) into priority AST nodes.",
    },
    {
        "loader_id": "LOADER-03-DSL-SCRIPT",
        "class_name": "DSLScriptCommandLoader",
        "supported_inputs": ".cmd batch scripts (e.g. data/scenarios/gauntlet_batch.cmd)",
        "purpose": "Parses deterministic simulation scripts (SET_SEED, SPAWN, BIND_GAMBIT, THRONE_DECREE, QUEUE_CMD, CLASH_11VECTOR, SIMULATE_MATCH, MONTE_CARLO).",
    },
    {
        "loader_id": "LOADER-04-POLYGLOT-12",
        "class_name": "PolyglotFormatCommandLoader",
        "supported_inputs": ".json, .jsonl, .csv, .tsv, .sql, .yml, .toml, .xml, .pbtxt, .bin64, .cypher, .md",
        "purpose": "Transcodes and hot-injects character and combat data across all 12 storage formats.",
    },
    {
        "loader_id": "LOADER-05-STREAM-NDJSON",
        "class_name": "StreamReplayCommandLoader",
        "supported_inputs": "NDJSON / JSONL event streams & stdin pipelines",
        "purpose": "Streams large-scale Monte Carlo telemetry and deterministic replay ledgers with O(1) memory overhead.",
    },
]


@dataclass
class GambitClause:
    verb: str
    target_expr: str
    params: Dict[str, str] = field(default_factory=dict)


@dataclass
class DSLInstruction:
    opcode: str
    args: List[str]
    kv_args: Dict[str, str]
    line_no: int
    raw_line: str


class GambitRuleCommandLoader:
    """Compiles Gambit rule strings like 'HEAL(Lowest_HP, threshold=75%) -> ATTACK(Enemy, until_hp_depleted)'."""

    CLAUSE_RE = re.compile(r"([A-Z0-9_]+)\(([^)]*)\)")

    @classmethod
    def compile_rule_stack(cls, rule_stack_str: str) -> List[GambitClause]:
        clauses: List[GambitClause] = []
        parts = [p.strip() for p in rule_stack_str.split("->") if p.strip()]
        for part in parts:
            m = cls.CLAUSE_RE.search(part)
            if not m:
                clauses.append(GambitClause(verb=part.upper(), target_expr="SELF"))
                continue
            verb = m.group(1).strip().upper()
            inner = [x.strip() for x in m.group(2).split(",") if x.strip()]
            target_expr = "ANY"
            params: Dict[str, str] = {}
            for idx, token in enumerate(inner):
                if "=" in token:
                    k, v = token.split("=", 1)
                    params[k.strip()] = v.strip()
                elif idx == 0:
                    target_expr = token
                else:
                    params[f"arg_{idx}"] = token
            clauses.append(GambitClause(verb=verb, target_expr=target_expr, params=params))
        return clauses


class ManifestCommandLoader:
    """Loads all JSON Large Data Models and instantiates CombatEntity instances."""

    def __init__(self, data_dir: Path) -> None:
        self.data_dir = Path(data_dir)
        self.archetypes: Dict[str, Dict[str, Any]] = {}
        self.sub_archetypes: Dict[str, Dict[str, Any]] = {}
        self.profiles_314: Dict[str, CharacterProfile314] = {}
        self.raw_profiles_314: List[Dict[str, Any]] = []
        self.commands: Dict[str, Dict[str, Any]] = {}
        self.damage_matrix: Dict[str, Any] = {}
        self.spc_matrix: Dict[str, Any] = {}

    def load_all(self) -> None:
        arch_data = json.loads((self.data_dir / "archetypes.json").read_text(encoding="utf-8"))
        for arch in arch_data.get("archetypes", []):
            self.archetypes[arch["id"]] = arch
            for sub in arch.get("sub_archetypes", []):
                self.sub_archetypes[sub["id"]] = sub

        prof_path = self.data_dir / "profiles_314.json"
        if prof_path.exists():
            prof_data = json.loads(prof_path.read_text(encoding="utf-8"))
            self.raw_profiles_314 = prof_data.get("character_profiles", [])
            for p in self.raw_profiles_314:
                cp = CharacterProfile314.from_dict(p)
                self.profiles_314[cp.profileId] = cp

        cmd_data = json.loads((self.data_dir / "commands.json").read_text(encoding="utf-8"))
        for cmd in cmd_data.get("commands", []):
            self.commands[cmd["id"]] = cmd

        self.damage_matrix = json.loads(
            (self.data_dir / "damage_matrix.json").read_text(encoding="utf-8")
        )
        self.spc_matrix = json.loads(
            (self.data_dir / "spc_transition_matrix.json").read_text(encoding="utf-8")
        )

    def spawn_entity(
        self,
        unit_id: str,
        archetype_id: str,
        team: str,
        sub_archetype_id: Optional[str] = None,
        profile_id: Optional[str] = None,
    ) -> CombatEntity:
        if archetype_id not in self.archetypes:
            raise ValueError(f"Unknown archetype_id: {archetype_id}")
        arch = self.archetypes[archetype_id]
        attrs = dict(arch["base_attributes"])

        if sub_archetype_id and sub_archetype_id in self.sub_archetypes:
            mults = self.sub_archetypes[sub_archetype_id].get("stat_multipliers", {})
            for k, factor in mults.items():
                if k in attrs:
                    attrs[k] = round(attrs[k] * float(factor), 3)

        stat_pi = 6.28
        armor_pi = 3.14
        weapon_pi = 3.14
        gambit_list: List[str] = []
        display_name = arch["name"]

        if profile_id and profile_id in self.profiles_314:
            prof = self.profiles_314[profile_id]
            stat_pi = prof.statWeightPi
            armor_pi = prof.armorWeightPi
            weapon_pi = prof.weaponWeightPi
            display_name = prof.characterName
            gambit_list = [
                c.verb for c in GambitRuleCommandLoader.compile_rule_stack(prof.commandsRuleStack)
            ]
            # Scale base HP/Attack/Defense mildly by the 3.14 profile weights
            pi_ratio = stat_pi / 6.28
            attrs["max_hp"] = round(attrs["max_hp"] * max(0.85, min(1.35, pi_ratio)), 2)

        return CombatEntity(
            unit_id=unit_id,
            name=display_name,
            team=team,
            archetype_id=archetype_id,
            sub_archetype_id=sub_archetype_id,
            armor_type=arch["armor_type"],
            profile_id=profile_id or archetype_id,
            max_hp=attrs["max_hp"],
            hp=attrs["max_hp"],
            max_stamina=attrs["max_stamina"],
            stamina=attrs["max_stamina"],
            max_mana=attrs["max_mana"],
            mana=attrs["max_mana"],
            attack_power=attrs["attack_power"],
            spell_power=attrs["spell_power"],
            armor=attrs["armor"],
            magic_resist=attrs["magic_resist"],
            crit_chance=attrs["crit_chance"],
            crit_multiplier=attrs["crit_multiplier"],
            evasion=attrs["evasion"],
            accuracy=attrs["accuracy"],
            attack_speed=attrs["attack_speed"],
            move_speed=attrs["move_speed"],
            max_poise=attrs["max_poise"],
            poise=attrs["max_poise"],
            tenacity=attrs["tenacity"],
            armor_penetration=attrs["armor_penetration"],
            magic_penetration=attrs["magic_penetration"],
            stamina_regen=attrs["stamina_regen"],
            mana_regen=attrs["mana_regen"],
            stat_weight_pi=stat_pi,
            armor_weight_pi=armor_pi,
            weapon_weight_pi=weapon_pi,
            corrected_policy=bool(arch.get("corrected_policy_enabled", True)),
            gambit_stack=gambit_list,
            default_commands=list(arch.get("default_commands", [])),
        )


class DSLScriptCommandLoader:
    """Parses deterministic .cmd combat simulator batch scripts."""

    @staticmethod
    def parse_file(script_path: Path) -> List[DSLInstruction]:
        return DSLScriptCommandLoader.parse_text(script_path.read_text(encoding="utf-8"))

    @staticmethod
    def parse_text(script_text: str) -> List[DSLInstruction]:
        instructions: List[DSLInstruction] = []
        for idx, raw_line in enumerate(script_text.splitlines(), start=1):
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            tokens = line.split()
            opcode = tokens[0].upper()
            pos_args: List[str] = []
            kv_args: Dict[str, str] = {}
            if opcode == "BIND_GAMBIT" and len(tokens) >= 3:
                pos_args.append(tokens[1])
                kv_args["rule_stack"] = " ".join(tokens[2:])
            else:
                for tok in tokens[1:]:
                    if "=" in tok:
                        k, v = tok.split("=", 1)
                        kv_args[k.strip()] = v.strip()
                    else:
                        pos_args.append(tok)
            instructions.append(
                DSLInstruction(
                    opcode=opcode,
                    args=pos_args,
                    kv_args=kv_args,
                    line_no=idx,
                    raw_line=raw_line,
                )
            )
        return instructions


class PolyglotFormatCommandLoader:
    """Exports and imports all 12 Polyglot Data Model Formats."""

    @staticmethod
    def export_all_12_formats(
        profiles: List[Dict[str, Any]], output_dir: Path, base_name: str = "sovereign_combat_model_314"
    ) -> List[Path]:
        output_dir.mkdir(parents=True, exist_ok=True)
        written: List[Path] = []
        for idx, (ext, _desc) in enumerate(Polyglot12FormatSerializer.FORMAT_EXTENSIONS):
            target = output_dir / f"{base_name}{ext}"
            content = Polyglot12FormatSerializer.serialize(idx, profiles, ummah_nodes=314)
            target.write_text(content, encoding="utf-8")
            written.append(target)
        return written
