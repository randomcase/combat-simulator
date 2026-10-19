"""
Large Data Models (LDMs) & 12-Format Polyglot Serializer/Deserializer Catalog
for the Sovereign Combat Simulator.
"""

from __future__ import annotations
import base64
from dataclasses import dataclass, field
import json
from typing import Any, Dict, List, Optional

PI_314: float = 3.14

LARGE_DATA_MODEL_CATALOG: List[Dict[str, str]] = [
    {
        "code": "ECAT-LDM",
        "name": "Entity-Component-Attribute Tensor Model",
        "schema": "data/archetypes.json",
        "description": "19-dimensional attribute tensors (HP, Stamina, Mana, Attack/Spell Power, Armor, Magic Resist, Crit, Evasion, Poise, Tenacity, Penetration) with Sub-Archetype multiplier projections.",
    },
    {
        "code": "SOVEREIGN-314-11VECTOR-LDM",
        "name": "1-Profile-1-Character 11-Vector Procedural Weighing Model",
        "schema": "data/profiles_314.json",
        "description": "12 Canonical Character Profiles (Good Warlock, 313 Badr Vanguard, Mamluk Lancer, Bimaristan Healer, Inbiq Alchemist, Qaws Sniper, Manjaniq Sapper, Ribat Militia, Caravan Explorer, Omani Mariner, Syndication Sorcerer, Imperial Cataphract) weighted in multiples of 3.14 pi.",
    },
    {
        "code": "MSTM-SPC-LDM",
        "name": "Markov / Stochastic SPC State-Transition Matrix Model",
        "schema": "data/spc_transition_matrix.json",
        "description": "4-state Statistical Process Control architecture (S0 Optimal, S1 Warning, S2 Critical/Stagger, S3 Hard Shutdown/KO) governed by P_corrected = P_baseline + T (sum_j T_ij = 0) and Possibility Index (Pi > 0.75).",
    },
    {
        "code": "CADFG-LDM",
        "name": "Combat Action & Damage Formula Graph Model",
        "schema": "data/commands.json + data/damage_matrix.json",
        "description": "8x8 Damage Type Effectiveness Matrix (Slash, Pierce, Blunt, Fire, Ice, Lightning, Arcane, True vs. 8 Armor Classes), frame data (startup/active/recovery), and hyperbolic mitigation curves.",
    },
    {
        "code": "SETL-LDM",
        "name": "Status Effect & Temporal Tick Ledger Model",
        "schema": "data/commands.json",
        "description": "Deterministic ring-buffer of DoT/HoT effects, armor/resist sunders, poise stagger decay, and purifying Vinegar-Rosewater mist neutralization.",
    },
    {
        "code": "UABDM-GAMBIT-LDM",
        "name": "Utility AI & Autonomous Gambit Decision Matrix Model",
        "schema": "data/profiles_314.json",
        "description": "Priority-ordered autonomous rule stacks (ORBIT -> BOLSTER -> HEAL -> DEFEND -> PURSUE_A_STAR -> ATTACK -> SEAL_QUMQUM) evaluated every simulation tick.",
    },
    {
        "code": "MCTRL-POLYGLOT-12-LDM",
        "name": "12-Format Polyglot Cartridge & Monte Carlo Replay Ledger",
        "schema": "data/formats/*",
        "description": "Cross-engine serialization across JSON, JSONL, CSV, TSV, SQL, YAML, TOML, XML, Protobuf-Text, Binary/Base64, Cypher Property-Graph, and Abjad 261 Wafq Markdown.",
    },
]


@dataclass
class CharacterProfile314:
    profileId: str
    characterName: str
    arabicTitle: str
    archetypeClass: str
    mappedCoreArchetype: str
    livedExperienceOrigin: str
    commandsRuleStack: str
    tacticalFunction: str
    spriteAnimationForm: str
    statWeightPi: float
    armorWeightPi: float
    weaponWeightPi: float
    skillName: str
    skillAbilityName: str
    vfxType: str
    skillTone: str
    skillDefense: str
    canonicalMetricsOfSkill: str
    baseHp: float
    baseAttack: float
    baseDefense: float
    baseRangeTiles: int
    moveSpeedPi: float

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> "CharacterProfile314":
        return cls(
            profileId=str(d["profileId"]),
            characterName=str(d["characterName"]),
            arabicTitle=str(d.get("arabicTitle", "")),
            archetypeClass=str(d["archetypeClass"]),
            mappedCoreArchetype=str(d.get("mappedCoreArchetype", "ARCH_SENTINEL")),
            livedExperienceOrigin=str(d.get("livedExperienceOrigin", "")),
            commandsRuleStack=str(d["commandsRuleStack"]),
            tacticalFunction=str(d.get("tacticalFunction", "")),
            spriteAnimationForm=str(d.get("spriteAnimationForm", "Walking_8Dir_Stride")),
            statWeightPi=float(d["statWeightPi"]),
            armorWeightPi=float(d["armorWeightPi"]),
            weaponWeightPi=float(d["weaponWeightPi"]),
            skillName=str(d.get("skillName", "")),
            skillAbilityName=str(d.get("skillAbilityName", "")),
            vfxType=str(d.get("vfxType", "SPARKLES")),
            skillTone=str(d.get("skillTone", "Sakinah")),
            skillDefense=str(d.get("skillDefense", "")),
            canonicalMetricsOfSkill=str(d.get("canonicalMetricsOfSkill", "")),
            baseHp=float(d["baseHp"]),
            baseAttack=float(d["baseAttack"]),
            baseDefense=float(d["baseDefense"]),
            baseRangeTiles=int(d.get("baseRangeTiles", 1)),
            moveSpeedPi=float(d.get("moveSpeedPi", 3.14)),
        )


@dataclass
class ActiveStatusEffect:
    effect_id: str
    name: str
    remaining_ticks: int
    stat_mod: Dict[str, float] = field(default_factory=dict)
    tick_damage: float = 0.0


@dataclass
class CombatEntity:
    unit_id: str
    name: str
    team: str
    archetype_id: str
    sub_archetype_id: Optional[str]
    armor_type: str
    profile_id: str
    max_hp: float
    hp: float
    max_stamina: float
    stamina: float
    max_mana: float
    mana: float
    attack_power: float
    spell_power: float
    armor: float
    magic_resist: float
    crit_chance: float
    crit_multiplier: float
    evasion: float
    accuracy: float
    attack_speed: float
    move_speed: float
    max_poise: float
    poise: float
    tenacity: float
    armor_penetration: float
    magic_penetration: float
    stamina_regen: float
    mana_regen: float
    stat_weight_pi: float = 6.28
    armor_weight_pi: float = 3.14
    weapon_weight_pi: float = 3.14
    spc_state: str = "S0"
    cp_index: float = 1.50
    sigma_drift: float = 0.35
    pi_possibility: float = 0.20
    corrected_policy: bool = True
    gambit_stack: List[str] = field(default_factory=list)
    default_commands: List[str] = field(default_factory=list)
    cooldowns: Dict[str, int] = field(default_factory=dict)
    status_effects: List[ActiveStatusEffect] = field(default_factory=list)

    @property
    def is_alive(self) -> bool:
        return self.hp > 0.0 and self.spc_state != "S3"

    def effective_stat(self, stat_name: str) -> float:
        base_val = float(getattr(self, stat_name))
        bonus = sum(eff.stat_mod.get(stat_name, 0.0) for eff in self.status_effects)
        return max(0.0, base_val + bonus)


class Polyglot12FormatSerializer:
    """Serializes Large Data Model Character Profiles into all 12 canonical formats."""

    FORMAT_EXTENSIONS = [
        (".json", "JSON Hierarchical Single-Castle & 11-Vector LDM"),
        (".jsonl", "JSONL / NDJSON Streaming Character & Event Records"),
        (".csv", "CSV Spreadsheet-Ready 11-Vector Relational Matrix"),
        (".tsv", "TSV Tab-Separated POSIX Stream Matrix"),
        (".sql", "SQL Relational DDL & DML Schema + INSERTs"),
        (".yml", "YAML Declarative Configuration Profile"),
        (".toml", "TOML Strongly-Typed Game Engine Config"),
        (".xml", "XML 3D Sprite Rig & 11-Vector Combat Schema"),
        (".pbtxt", "Protobuf-Text / FlatBuffers Wire Message Payload"),
        (".bin64", "Binary TypedArray / Hex Bitmask / Base64 Cartridge Seed"),
        (".cypher", "Property-Graph Cypher Triples & Gambit AI Rule Graph"),
        (".md", "Abjad 261 Wafq Matrix & Collegiate Markdown Ledger"),
    ]

    @staticmethod
    def serialize(fmt_index: int, profiles: List[Dict[str, Any]], ummah_nodes: int = 314) -> str:
        if fmt_index == 0:
            return json.dumps(
                {
                    "piPrincipleAnchor": PI_314,
                    "ummahNodes": ummah_nodes,
                    "characterProfiles": profiles,
                },
                indent=2,
                ensure_ascii=False,
            )
        elif fmt_index == 1:
            return "\n".join(json.dumps(p, ensure_ascii=False) for p in profiles)
        elif fmt_index == 2:
            header = "profileId,characterName,archetypeClass,statWeightPi,armorWeightPi,weaponWeightPi,vfxType,skillTone,baseHp,baseAttack,baseDefense"
            rows = [
                f'{p["profileId"]},"{p["characterName"]}","{p["archetypeClass"]}",{p["statWeightPi"]},{p["armorWeightPi"]},{p["weaponWeightPi"]},{p["vfxType"]},"{p["skillTone"]}",{p["baseHp"]},{p["baseAttack"]},{p["baseDefense"]}'
                for p in profiles
            ]
            return "\n".join([header] + rows)
        elif fmt_index == 3:
            header = "profileId\tcharacterName\tarchetypeClass\tstatWeightPi\tarmorWeightPi\tweaponWeightPi\tcommandsRuleStack"
            rows = [
                f'{p["profileId"]}\t{p["characterName"]}\t{p["archetypeClass"]}\t{p["statWeightPi"]}\t{p["armorWeightPi"]}\t{p["weaponWeightPi"]}\t{p["commandsRuleStack"]}'
                for p in profiles
            ]
            return "\n".join([header] + rows)
        elif fmt_index == 4:
            ddl = (
                "CREATE TABLE IF NOT EXISTS character_profiles_314 (\n"
                "  profile_id VARCHAR(40) PRIMARY KEY,\n"
                "  character_name VARCHAR(120),\n"
                "  archetype_class VARCHAR(80),\n"
                "  stat_weight_pi DECIMAL(6,2),\n"
                "  armor_weight_pi DECIMAL(6,2),\n"
                "  weapon_weight_pi DECIMAL(6,2),\n"
                "  vfx_type VARCHAR(40),\n"
                "  commands_stack TEXT\n"
                ");\n\n"
            )
            inserts = []
            for p in profiles:
                cname = p["characterName"].replace("'", "''")
                aclass = p["archetypeClass"].replace("'", "''")
                cstack = p["commandsRuleStack"].replace("'", "''")
                inserts.append(
                    f"INSERT INTO character_profiles_314 VALUES ('{p['profileId']}', '{cname}', '{aclass}', {p['statWeightPi']}, {p['armorWeightPi']}, {p['weaponWeightPi']}, '{p['vfxType']}', '{cstack}');"
                )
            return ddl + "\n".join(inserts)
        elif fmt_index == 5:
            lines = [
                "sovereign-single-castle:",
                "  pi-principle: 3.14",
                f"  ummah-initial-badr-anchor: {ummah_nodes}",
                "  characters:",
            ]
            for p in profiles:
                lines.extend(
                    [
                        f"    - profile-id: {p['profileId']}",
                        f'      name: "{p["characterName"]}"',
                        f"      stat-weight-pi: {p['statWeightPi']}",
                        f"      armor-weight-pi: {p['armorWeightPi']}",
                        f"      weapon-weight-pi: {p['weaponWeightPi']}",
                        f"      vfx-type: {p['vfxType']}",
                        f'      commands: "{p["commandsRuleStack"]}"',
                    ]
                )
            return "\n".join(lines)
        elif fmt_index == 6:
            lines = [
                "[castle_engine]",
                "pi_anchor = 3.14",
                f"ummah_nodes = {ummah_nodes}",
                "",
            ]
            for p in profiles:
                lines.extend(
                    [
                        "[[characters]]",
                        f'profile_id = "{p["profileId"]}"',
                        f'name = "{p["characterName"]}"',
                        f"stat_weight_pi = {p['statWeightPi']}",
                        f"armor_weight_pi = {p['armorWeightPi']}",
                        f"weapon_weight_pi = {p['weaponWeightPi']}",
                        f'vfx_type = "{p["vfxType"]}"',
                        "",
                    ]
                )
            return "\n".join(lines)
        elif fmt_index == 7:
            lines = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                f'<SovereignSingleCastle piAnchor="3.14" ummahNodes="{ummah_nodes}">',
            ]
            for p in profiles:
                cmd_esc = (
                    p["commandsRuleStack"]
                    .replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                )
                lines.append(
                    f'  <CharacterProfile id="{p["profileId"]}" statPi="{p["statWeightPi"]}" armorPi="{p["armorWeightPi"]}" weaponPi="{p["weaponWeightPi"]}" form="{p["spriteAnimationForm"]}" vfx="{p["vfxType"]}">'
                )
                lines.append(f"    <Commands>{cmd_esc}</Commands>")
                lines.append("  </CharacterProfile>")
            lines.append("</SovereignSingleCastle>")
            return "\n".join(lines)
        elif fmt_index == 8:
            blocks = []
            for idx, p in enumerate(profiles, start=1):
                blocks.append(
                    f'character_profile {{\n  field_id: {idx}\n  profile_id: "{p["profileId"]}"\n  stat_weight_pi: {p["statWeightPi"]}\n  armor_weight_pi: {p["armorWeightPi"]}\n  weapon_weight_pi: {p["weaponWeightPi"]}\n  vfx_emitter: {p["vfxType"]}\n}}'
                )
            return "\n\n".join(blocks)
        elif fmt_index == 9:
            lead_id = profiles[0]["profileId"] if profiles else "NONE"
            raw_json = json.dumps({"pi": 3.14, "nodes": ummah_nodes, "lead": lead_id})
            b64 = base64.b64encode(raw_json.encode("utf-8")).decode("ascii")
            vec = " | ".join(
                f"{p['statWeightPi']},{p['armorWeightPi']},{p['weaponWeightPi']}"
                for p in profiles
            )
            return f"SOV_HEX_HEADER::0x00FF3140_013A\nFLOAT32_WEIGHT_VECTOR::[{vec}]\nBASE64_CARTRIDGE::{b64}"
        elif fmt_index == 10:
            stmts = []
            for p in profiles:
                cname = p["characterName"].replace("'", "")
                cstack = p["commandsRuleStack"].replace("'", "")
                stmts.append(
                    f"MERGE (u:AutonomousMuslimNode {{id:'{p['profileId']}', name:'{cname}', statPi:{p['statWeightPi']}}})\n"
                    f"MERGE (c:SingleCastle {{name:'Madinah_Priory_Core', pi:3.14}})\n"
                    f"MERGE (u)-[:GOVERNED_BY {{commands:'{cstack}'}}]->(c);"
                )
            return "\n\n".join(stmts)
        else:
            header = (
                "# Sovereign Single-Castle 11-Vector Character & Combat Ledger (3.14 pi)\n\n"
                "## Abjad 261 Wafq Invariant (3x3 Magic Square = 9 x 29 = 261)\n"
                "| 116 | 29 | 116 |\n|---|---|---|\n| 58 | 87 | 116 |\n| 87 | 145 | 29 |\n\n"
                "| Profile ID | Name | Stat pi | Armor pi | Weapon pi | VFX | Commands |\n"
                "|---|---|---|---|---|---|\n"
            )
            rows = [
                f"| {p['profileId']} | {p['characterName']} | {p['statWeightPi']}pi | {p['armorWeightPi']}pi | {p['weaponWeightPi']}pi | {p['vfxType']} | `{p['commandsRuleStack']}` |"
                for p in profiles
            ]
            return header + "\n".join(rows)
