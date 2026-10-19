MERGE (u:AutonomousMuslimNode {id:'CHAR-001-GOOD-WARLOCK', name:'Al-Hakim Zakeem Al-Muwahhid (The Good Warlock Devoted to Islam)', statPi:9.42})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'ORBIT(Single_Castle, r=3.14) -> BOLSTER(All_Allies, aura=3.14x) -> HEAL(Lowest_HP_Unit, threshold=62.8%) -> SEAL_QUMQUM(Nearest_Warlock_Zalim, until_hp_depleted)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-002-BADR-313-VANGUARD', name:'Hamzah Al-Badri (313 Core Muslim Vanguard Champion)', statPi:6.28})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'DEFEND(Caravan_Center, r=3.14) -> INTERCEPT(Nearest_Attacker_To_Healer) -> ATTACK(Enemy_Champion, mode=MUBARAZAH_UNTIL_HP_DEPLETED) -> HOLD(Castle_Gate)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-003-MAMLUK-LANCER', name:'Baybars Al-Bunduqdari (Elite Mamluk Heavy Cavalry Lancer)', statPi:6.28})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'PURSUE_A_STAR(Target=Enemy_Ranged_Or_Sorcerer, speed=6.28) -> ATTACK(Nearest_To_Caravan_Flank, until_hp_depleted) -> ORBIT(Besieged_Castle, r=6.28) -> BOLSTER(Militia)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-004-BIMARISTAN-HEALER', name:'Rufaydah & Ibn Sina Al-Tabib (Support Bimaristan Field Healer)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'HEAL(Unit_Y_Lowest_HP, threshold=75.0%) -> DEFEND(Unit_XX_Caravan_Straggler, r=3.14) -> PURIFY(Poison_Cloud_Tile) -> ATTACK_NEAREST_TO(Unit_YY_Healee, until_hp_depleted)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-005-INBIQ-ALCHEMIST', name:'Jabir Al-Kimiyai (Alchemical Inbiq, Vinegar-Acid & Naft Master)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'BOLSTER(Weapon_Damascus_Steel, buff=3.14) -> ATTACK(Clustered_Enemy_Formation, vfx=POISON_ACID_OR_NAFT_MISSILE) -> PURIFY(Syndication_Miasma) -> DEFEND(Castle_Lab)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-006-QAWS-SNIPER', name:'Sad Al-Rami (Composite Bow Sniper & Janissary Tufekci Marksman)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'HOLD(High_Elevation_Tile) -> ATTACK(Enemy_Approaching_Ally_YY, range=7, until_hp_depleted) -> DEFEND(Caravan_Flank) -> SKIRMISH_KITE(Min_Dist=3.14)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-007-MANJANIQ-SAPPER', name:'Salman & Orban Al-Manjaniqi (Siege Engineer, Trench Builder & Cannoneer)', statPi:6.28})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'BOLSTER(Castle_Walls_And_Towers) -> ATTACK(Enemy_Castle_Gate_Or_Tower, vfx=SIEGE_MISSILE, until_hp_depleted) -> HOLD(Trench_Line) -> DEFEND(Cannons)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-008-RIBAT-MILITIA', name:'Al-Murabit Al-Ansari (Ribat Frontier Militia & Straggler Guardian)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'DEFEND(Caravan_Rearguard_Stragglers, r=3.14) -> GUARD_INTERCEPT(Healer_And_Merchant) -> ATTACK_NEAREST_TO(Protected_Ally_YY, until_hp_depleted) -> HOLD(Ribat_Tower)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-009-CARAVAN-EXPLORER', name:'Ibn Battutah & Abd al-Rahman Al-Tajir (Auxiliary Caravan Master, Explorer & Diplomat)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'TRADE(Nearest_Bazaar_Or_Port_Faire) -> ORBIT(Neutral_Caravan, diplomatic_dawah=true) -> UNCOVER(Syndication_Node) -> BOLSTER(Castle_Treasury_Dinars)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-010-OMANI-MARINER', name:'Ahmad ibn Majid Al-Muallim (Auxiliary Omani/Yemeni Monsoon Navigator & Port Admiral)', statPi:5.34})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'TRADE(Port_Faire_Node) -> ORBIT(Coastal_Sea_Lane, r=6.28) -> ATTACK(Pirate_Or_Syndicate_Fleet, vfx=BROADSIDES_AND_ARROWS) -> BOLSTER(Vinegar_Cotton_Tobacco_Cargo)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-011-SYNDICATION-SORCERER', name:'Kahin Al-Jibt (Oppositional Warlock Syndication Sorcerer & Miasma Weaver)', statPi:4.71})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'ORBIT(Syndication_Stronghold, r=3.14) -> ATTACK(Caravan_Stragglers, vfx=POISON_CLOUD) -> HOLD(Corrupt_Sanctum) -> YIELD_WHEN_UNCOVERED(Convert_Or_Qumqum_Seal)'}]->(c);

MERGE (u:AutonomousMuslimNode {id:'CHAR-012-IMPERIAL-CATAPHRACT', name:'Marzuban & Strategos (Oppositional Empire Frontier Commander / Prospective Convert)', statPi:5.65})
MERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})
MERGE (u)-[:GOVERNED_BY {commands:'HOLD(Imperial_Fortress_Gate) -> ATTACK(Vanguard_Approaching_Citadel, until_hp_depleted) -> OFFER_MEDIATION_OR_CAPITULATION(When_Castle_Order_And_Justice_High)'}]->(c);