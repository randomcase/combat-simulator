# ⚔️ Sovereign 3.14 $\pi$ Combat Simulator — Large Data Models, Archetypes & Command Loaders

A polyglot, deterministic **Combat Simulator** built on **7 Large Data Models (LDMs)**, **6 Core ECAT Archetypes (18 Sub-Archetypes)**, **12 Canonical 11-Vector Character Profiles (`3.14 π` Weighted)**, **5 Specialized Command Loaders**, **12 Polyglot Storage Formats**, and **4 Runtime Engines** (**HTML5/Canvas 2.5D/3D Studio**, **TypeScript**, **Python 3.12**, **Go 1.26**, and **Java 21+/26 Virtual Threads**), governed by the **Gemini Statistical Process Control (SPC) State-Transition Matrix ($S_0 \dots S_3$)**.

---

## 📊 1. Large Data Models (LDMs) Catalog for Combat Simulation

| LDM Code | Model Name | Schema File(s) | Core Mathematical / Structural Role |
| :--- | :--- | :--- | :--- |
| **`ECAT-LDM`** | **Entity-Component-Attribute Tensor Model** | [`data/archetypes.json`](data/archetypes.json) | 19-dimensional attribute tensors (`max_hp`, `stamina`, `mana`, `attack_power`, `spell_power`, `armor`, `magic_resist`, `crit_chance`, `crit_multiplier`, `evasion`, `accuracy`, `attack_speed`, `move_speed`, `max_poise`, `tenacity`, `armor_penetration`, `magic_penetration`, `stamina_regen`, `mana_regen`) with sub-archetype tensor projections. |
| **`SOVEREIGN-314-11VECTOR-LDM`** | **1-Profile-1-Character 11-Vector Procedural Weighing Model** | [`data/profiles_314.json`](data/profiles_314.json) | 12 Canonical Character Profiles (`CHAR-001` to `CHAR-012`) anchored on the **313 of Badr + 1 Sovereign Anchor = $314 = 100 \times 3.14\pi$** principle, weighing Stat $\pi$, Armor $\pi$, Weapon $\pi$, 3D Sprite Form, VFX, Tone, Defense, and Lanchester + Ibn Khaldūn *'Aṣabiyyah* Win Probability. |
| **`MSTM-SPC-LDM`** | **Markov / Stochastic SPC State-Transition Matrix Model** | [`data/spc_transition_matrix.json`](data/spc_transition_matrix.json) | 4-state Statistical Process Control architecture ($S_0$ Optimal $C_p \ge 1.33$, $S_1$ Warning $1.00 \le C_p < 1.33$, $S_2$ Critical/Stagger $0.67 \le C_p < 1.00$, $S_3$ Hard Shutdown/KO $C_p < 0.67$) with $P_{\text{corrected}} = P_{\text{baseline}} + T$ ($\sum_j T_{ij} = 0$) and Possibility Index override ($\Pi > 0.75$). |
| **`CADFG-LDM`** | **Combat Action & Damage Formula Graph Model** | [`data/commands.json`](data/commands.json), [`data/damage_matrix.json`](data/damage_matrix.json) | $8 \times 8$ Damage Type Effectiveness Matrix (`SLASH`, `PIERCE`, `BLUNT`, `FIRE`, `ICE`, `LIGHTNING`, `ARCANE`, `TRUE` vs. 8 Armor Classes), frame data (`startup`, `active`, `recovery`), and hyperbolic mitigation curves $D_{\text{eff}} = D_{\text{raw}} \cdot \frac{K}{K + R_{\text{eff}}}$. |
| **`SETL-LDM`** | **Status Effect & Temporal Tick Ledger Model** | [`data/commands.json`](data/commands.json) | Deterministic ring-buffer of DoT/HoT effects, armor/resist sunders, poise stagger decay, and purifying Vinegar-Rosewater mist neutralization. |
| **`UABDM-GAMBIT-LDM`** | **Utility AI & Autonomous Gambit Decision Matrix Model** | [`data/profiles_314.json`](data/profiles_314.json) | Priority-ordered autonomous rule chains (`ORBIT -> BOLSTER -> HEAL -> DEFEND -> PURSUE_A_STAR -> ATTACK -> SEAL_QUMQUM`) evaluated every tick. |
| **`MCTRL-POLYGLOT-12-LDM`** | **12-Format Polyglot Cartridge & Monte Carlo Replay Ledger** | [`data/formats/`](data/formats/) | Cross-engine serialization across `.json`, `.jsonl`, `.csv`, `.tsv`, `.sql`, `.yml`, `.toml`, `.xml`, `.pbtxt`, `.bin64`, `.cypher`, and `.md` (Abjad 261 Wafq). |

---

## 🛡️ 2. Archetypes Taxonomy (ECAT Core + 11-Vector Character Roster)

### 2.1 Core Combat Archetypes & 18 Sub-Archetypes ([`data/archetypes.json`](data/archetypes.json))

| Archetype ID | Archetype Name | Class Role | Armor Class | Sub-Archetypes | Default Command Loadout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ARCH_VANGUARD`** | **Aegis Juggernaut** | Vanguard / Tank | `HEAVY_PLATE` | `Citadel Warden`, `Colossus Breaker`, `Runic Templar` | `CMD_SHIELD_SLAM`, `CMD_IRON_BULWARK`, `CMD_SEISMIC_CLEAVE`, `CMD_SHUNT_ATTENUATE`, `CMD_BASIC_STRIKE`, `CMD_GUARD_STANCE` |
| **`ARCH_BERSERKER`** | **Crimson Ravager** | Berserker / Bruiser | `MEDIUM_MAIL` | `Apex Warlord`, `Frenzy Dervish`, `Dread Executioner` | `CMD_BLOODLUST_FLURRY`, `CMD_RENDING_AXE`, `CMD_GUILLOTINE_DROP`, `CMD_ADRENALINE_SURGE`, `CMD_BASIC_STRIKE`, `CMD_RECKLESS_LUNGE` |
| **`ARCH_ARCANIST`** | **Chrono-Aether Weaver** | Arcanist / Control Mage | `AETHER_SHROUD` | `Solar Pyromancer`, `Glacial Archon`, `Void Singularity Caller` | `CMD_AETHER_NOVA`, `CMD_CRYO_LANCE`, `CMD_ARCANE_SINGULARITY`, `CMD_OFFSET_BIAS_PULSE`, `CMD_MANA_BARRIER`, `CMD_VOLT_ARC` |
| **`ARCH_ASSASSIN`** | **Phantom Nightblade** | Assassin / Burst Duelist | `LIGHT_LEATHER` | `Eclipse Nightblade`, `Toxic Viper`, `Mirage Riposte Duelist` | `CMD_PHANTOM_LUNGE`, `CMD_VENOM_DAGGER`, `CMD_DEATH_MARK_EXECUTE`, `CMD_SMOKE_EVASION`, `CMD_SHADOW_LACERATE`, `CMD_BASIC_STRIKE` |
| **`ARCH_TACTICIAN`** | **Brehon Arbiter** | Tactician / Matrix Stabilizer | `COMPOSITE_REACTIVE` | `High Justiciar`, `Tempo Strategist`, `Logic Inquisitor` | `CMD_JUDICIAL_DECREE`, `CMD_MATRIX_RECALIBRATE`, `CMD_HALBERD_SWEEP`, `CMD_OFFSET_BIAS_PULSE`, `CMD_SHUNT_ATTENUATE`, `CMD_BASIC_STRIKE` |
| **`ARCH_SENTINEL`** | **Sovereign Orion Sentinel** | Sovereign Hybrid / Apex | `SOVEREIGN_AEGIS` | `Romulus Template Architect`, `Remus Boundary Auditor`, `N0 Sovereign Prime` | `CMD_ORION_STARFALL`, `CMD_SOVEREIGN_VERDICT`, `CMD_POSSIBILITY_PURGE`, `CMD_SHUNT_ATTENUATE`, `CMD_SEISMIC_CLEAVE`, `CMD_BASIC_STRIKE` |

### 2.2 1-Profile-1-Character 11-Vector Roster ([`data/profiles_314.json`](data/profiles_314.json))

1. **`CHAR-001-GOOD-WARLOCK`** — *Al-Ḥakīm Zakeem Al-Muwaḥḥid (The Good Warlock Devoted to Islam)* (`9.42π` Stat / `1.57π` Armor / `3.14π` Weapon | `SPARKLES_AND_MISSILES`)
2. **`CHAR-002-BADR-313-VANGUARD`** — *Ḥamzah Al-Badrī (313 Core Muslim Vanguard Champion)* (`6.28π` / `3.14π` / `2.51π` | `SWORD_SWIPE`)
3. **`CHAR-003-MAMLUK-LANCER`** — *Baybars Al-Bunduqdārī (Elite Mamlūk Heavy Cavalry Lancer)* (`6.28π` / `4.71π` / `3.14π` | `CAVALRY_CHARGE`)
4. **`CHAR-004-BIMARISTAN-HEALER`** — *Rufaydah & Ibn Sīnā Al-Ṭabīb (Support Bīmāristān Field Healer)* (`4.71π` / `1.25π` / `0.94π` | `SPARKLES_AND_VINEGAR_MIST`)
5. **`CHAR-005-INBIQ-ALCHEMIST`** — *Jābir Al-Kīmiyā'ī (Alchemical Inbīq, Vinegar-Acid & Nafṭ Master)* (`4.71π` / `1.88π` / `1.57π` | `MISSILES_AND_CLOUDS`)
6. **`CHAR-006-QAWS-SNIPER`** — *Sa'd Al-Rāmī (Composite Bow Sniper & Janissary Tüfekçi Marksman)* (`4.71π` / `1.57π` / `1.25π` | `ARROWS`)
7. **`CHAR-007-MANJANIQ-SAPPER`** — *Salmān & Orban Al-Manjanīqī (Siege Engineer, Trench Builder & Cannoneer)* (`6.28π` / `3.77π` / `9.42π` | `MISSILES`)
8. **`CHAR-008-RIBAT-MILITIA`** — *Al-Murābiṭ Al-Anṣārī (Ribāṭ Frontier Militia & Straggler Guardian)* (`4.71π` / `3.14π` / `2.20π` | `SWORD_SWIPE_AND_SPARKLES`)
9. **`CHAR-009-CARAVAN-EXPLORER`** — *Ibn Baṭṭūṭah & 'Abd al-Raḥmān Al-Tājir (Caravan Master, Explorer & Diplomat)* (`4.71π` / `1.25π` / `0.94π` | `SPARKLES`)
10. **`CHAR-010-OMANI-MARINER`** — *Aḥmad ibn Mājid Al-Mu'allim (Omani/Yemeni Monsoon Navigator & Port Admiral)* (`5.34π` / `1.88π` / `2.51π` | `MISSILES_AND_SPARKLES`)
11. **`CHAR-011-SYNDICATION-SORCERER`** — *Kāhin Al-Jibt (Oppositional Warlock Syndication Sorcerer & Miasma Weaver)* (`4.71π` / `1.57π` / `1.88π` | `POISON_CLOUD_AND_MISSILES`)
12. **`CHAR-012-IMPERIAL-CATAPHRACT`** — *Marzubān & Strategos (Oppositional Empire Frontier Commander / Prospective Convert)* (`5.65π` / `4.40π` / `3.14π` | `SWORD_SWIPE_AND_ARROWS`)

---

## ⚙️ 3. Command Loaders Architecture

| Loader ID | Loader Class | Input Grammar / Formats | Function |
| :--- | :--- | :--- | :--- |
| **`LOADER-01-MANIFEST`** | `ManifestCommandLoader` | `archetypes.json`, `profiles_314.json`, `commands.json`, `damage_matrix.json`, `spc_transition_matrix.json` | Validates schemas, resolves sub-archetype tensor multipliers, and builds in-memory lookup tables. |
| **`LOADER-02-GAMBIT-AST`** | `GambitRuleCommandLoader` | `VERB(Target, k=v) -> VERB2(...)` | Compiles autonomous node instruction stacks (`ORBIT`, `TRADE`, `BOLSTER`, `HOLD`, `ATTACK`, `DEFEND`, `HEAL`, `PURSUE_A_STAR`, `SEAL_QUMQUM`) into priority AST clauses. |
| **`LOADER-03-DSL-SCRIPT`** | `DSLScriptCommandLoader` | [`data/scenarios/gauntlet_batch.cmd`](data/scenarios/gauntlet_batch.cmd) | Parses deterministic `.cmd` batch scripts (`SET_SEED`, `SPAWN`, `BIND_GAMBIT`, `THRONE_DECREE`, `QUEUE_CMD`, `CLASH_11VECTOR`, `SIMULATE_MATCH`, `MONTE_CARLO`). |
| **`LOADER-04-POLYGLOT-12`** | `PolyglotFormatCommandLoader` | `.json`, `.jsonl`, `.csv`, `.tsv`, `.sql`, `.yml`, `.toml`, `.xml`, `.pbtxt`, `.bin64`, `.cypher`, `.md` | Transcodes and hot-injects combat & character models across all 12 storage formats in [`data/formats/`](data/formats/). |
| **`LOADER-05-STREAM-NDJSON`** | `StreamReplayCommandLoader` | `.jsonl` / stdin stream | Streams large-scale Monte Carlo telemetry and deterministic replay ledgers. |

---

## 🚀 4. Running All Polyglot Engines (Pure Git Bash)

```bash
# 1. Run Python 3.12 Unit Tests, 12-Format Exporter & DSL Batch Simulator
python engines/python/test_simulator.py
python engines/python/main.py --list-models
python engines/python/main.py --export-formats data/formats
python engines/python/main.py --run-script data/scenarios/gauntlet_batch.cmd

# 2. Run Go 1.26 Concurrent Worker-Pool Simulator & Tests
(cd engines/go && go test -v ./... && go run ./cmd/sim -data ../../data)

# 3. Compile & Run Java 21+/26 Virtual-Thread & Sealed-Interface Simulator
mkdir -p engines/java/bin
javac -Xlint:all -Werror -d engines/java/bin engines/java/src/main/java/com/combatsim/Main.java
java -cp engines/java/bin com.combatsim.Main data

# 4. Run Full Polyglot Verification Pipeline
bash scripts/verify_all.sh
```
