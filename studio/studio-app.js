/* ============================================================================
 * SOVEREIGN 3.14π CIRCULAR COMBAT & PRE-THOUGHT AGENCY STUDIO CONTROLLER
 * - Connects studio-data.js, studio-commands.js, studio-agency.js & studio-viewports.js
 * - 100% In-Game Customizability of Commands, Degrees, Orbits & 12 Agency MDs
 * ============================================================================ */
(function () {
  const PI_314 = 3.14;
  const DEG_TO_RAD = Math.PI / 180;

  const state = {
    barakahPower: 314.00,
    barakahRate: 9.42,
    ummahNodes: 314,
    dinars: 3140.0,
    dinarRate: 31.4,
    commodities: { vinegar: 314, cotton: 314, tobacco: 314, steel: 314 },
    suffragePct: 98.6,
    illuminatedTomes: 67,
    eraIndex: 0,
    combatMode: "WORLD",
    viewportLayout: "2x",
    theaterExpanded: false,
    showAStarGrid: true,
    canvasClickTool: "INSPECT",
    cameraZoom: 1.0,
    cameraPanX: 0,
    cameraPanY: 0,
    simSpeedMult: 1.0,
    walkSpeedPi: 3.14,
    floatAmpPi: 3.14,
    vfxScalePi: 3.14,
    orbitRadiusPi: 3.14,
    globalPhaseDeg: 0.0,
    totalCompletedCircles: 12,
    meanTorquePi: 54.2,
    meanIncidenceDeg: 135.0,
    selectedUnitIndex: 1, // Default to Hamzah Vanguard Defender on Ring II (2.00π)
    selectedAgencyIndex: 0,
    activeThroneRoomId: "THRONE_03_EQUILATERAL_APEX", // Default to The 3rd Throne Room (3.14π Equilateral Apex)
    currentStorageFormat: 0,
    tickCount: 0,
    units: [],
    caravans: [],
    towers: [],
    vfxParticles: [],
    circularWaves: [],
    floatingTexts: [],
    strongholds: [
      { name: "Single Castle Sanctuary (0.00π Core)", gx: 0, gy: 0, color: "#D4AF37", duty: "Throne Room, 68-Tome Library & Simāṭ Cafeteria", isCastle: true },
      { name: "Stronghold of Córdoba & Granada (Al-Andalus)", gx: -4.1, gy: -2.1, color: "#F43F5E", duty: "Vinegar Vineyards, Olive Oil & 400k Books" },
      { name: "Stronghold of Damascus & Jerusalem (Al-Shām)", gx: -1.8, gy: -3.2, color: "#38BDF8", duty: "Damascus Fūlādh Crucible Steel & Rosewater" },
      { name: "Stronghold of Baghdad & Kūfah (Bayt al-Ḥikmah)", gx: 2.3, gy: -2.6, color: "#A78BFA", duty: "Al-Inbīq Vinegar-Acid Alchemy & 3.14π Math" },
      { name: "Port Faire of Muscat, Sohar & Aden (Oman/Yemen)", gx: 3.6, gy: 1.8, color: "#10B981", duty: "32-Point Brass Compasses & Monsoon Dhows" },
      { name: "Port Stronghold of Aceh & Malacca (Nusantara)", gx: 4.5, gy: 2.6, color: "#6EE7B7", duty: "Botanicals, Spice Curing & Maritime Da'wah" },
      { name: "Sanctuary of Axum, Cairo & Timbuktu (Africa)", gx: -3.4, gy: 2.5, color: "#F59E0B", duty: "Egyptian Quṭn Cotton Looms & Gold Dīnārs" },
      { name: "Oppositional Syndication Citadel (4.71π Outer)", gx: 4.4, gy: -1.1, color: "#EF4444", duty: "Uncovered Syndication -> Sealed in Brass Qumqum", isEnemy: true }
    ]
  };

  function addLog(msg, color) {
    const box = document.getElementById("liveCombatLog");
    if (!box) return;
    const div = document.createElement("div");
    div.className = "log-entry";
    div.style.color = color || "#E2E8F0";
    const ts = new Date().toLocaleTimeString();
    div.textContent = "[" + ts + "] " + msg;
    box.prepend(div);
    while (box.children.length > 50) {
      box.removeChild(box.lastChild);
    }
  }

  function initUnitsAndCaravans() {
    state.units = [];
    const profiles = window.SOV_PROFILES_DATA || [];
    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      const isEnemy = p.profileId.includes("SYNDICATION") || p.profileId.includes("IMPERIAL");
      const angleDeg = (i * 30) % 360;
      const defaultVerb = isEnemy
        ? "ATTACK"
        : (i === 0 ? "ORBIT" : (p.coreArchetype === "ARCH_VANGUARD" ? "DEFEND" : (p.coreArchetype === "ARCH_TACTICIAN" ? "HEAL" : (p.coreArchetype === "ARCH_BERSERKER" ? "PURSUE_A_STAR" : "BOLSTER"))));

      const res = window.SovCommandEngine
        ? window.SovCommandEngine.evaluateArchetypeResonance(p, defaultVerb)
        : { multiplier: 1.45, tier: "PRIME_RESONANCE", arcDegrees: 180, orbitRadiusPi: 2.00, angularSpeedDeg: 120 };

      const rPi = isEnemy ? 3.14 : (res.orbitRadiusPi || 2.00);
      const rad = angleDeg * DEG_TO_RAD;

      state.units.push({
        idx: i,
        profileId: p.profileId,
        name: p.characterName,
        archetype: p.archetypeClass,
        coreArchetype: p.coreArchetype,
        form: p.spriteAnimationForm,
        verb: defaultVerb,
        gambit: p.commandsRuleStack,
        statW: p.statWeightPi,
        armorW: p.armorWeightPi,
        weaponW: p.weaponWeightPi,
        vfxType: p.vfxType,
        tone: p.skillTone,
        tradeSkill: p.skillName,
        experience: p.livedExperienceOrigin,
        hp: p.baseHp,
        maxHp: p.baseHp,
        atk: p.baseAttack,
        def: p.baseDefense,
        isEnemy: isEnemy,
        isFloating: p.spriteAnimationForm.includes("Floating"),
        isMounted: p.spriteAnimationForm.includes("Mounted") || p.spriteAnimationForm.includes("Camel"),
        empowered: i < 4,
        orbitRadiusPi: rPi,
        customOrbitPi: rPi,
        angleDeg: angleDeg,
        arcDegrees: res.arcDegrees || 180,
        angularVelocityDeg: res.angularSpeedDeg || 120,
        revProgressDeg: (i * 28) % 360,
        completedCircles: 1 + (i % 3),
        lastIncidenceDeg: 135,
        lastTorquePi: 48.2,
        lastProceduralDmg: 142,
        gx: Math.cos(rad) * rPi * 1.18,
        gy: Math.sin(rad) * rPi * 1.18,
        conversions: isEnemy ? 0 : (3 + i * 2),
        activeResonance: res.multiplier,
        resonanceTier: res.tier
      });
    }

    state.caravans = [
      { name: "Madīnah–Córdoba (Al-Andalus) Orbital Caravan", orbitRadiusPi: 2.50, orbitAngleDeg: 45, cargo: "Vinegar, Olive Oil & 68-Tome Copies", friendly: true, stragglersProtected: true },
      { name: "Muscat–Aden–Malacca Monsoon Dhow Circuit", orbitRadiusPi: 3.14, orbitAngleDeg: 165, cargo: "32-Point Compasses, Cotton & Botanicals", friendly: true, stragglersProtected: true },
      { name: "Outer 4.71π Envoy Caravan (Awaiting Da'wah)", orbitRadiusPi: 4.20, orbitAngleDeg: 285, cargo: "Silver Bullion, Spices & Uncovered Scroll", friendly: false, stragglersProtected: false }
    ];

    state.towers = [
      { name: "Ribāṭ 360° Watchtower of Salmān", gx: -1.5, gy: 1.2, rPi: 1.62, angleDeg: 141, type: "ARCHER_314", color: "#38BDF8" },
      { name: "Al-Inbīq Vinegar-Rosewater Purifier Ring", gx: 1.5, gy: -1.1, rPi: 1.58, angleDeg: 324, type: "VINEGAR_MIST", color: "#10B981" },
      { name: "Solomonic Brass Qumqum Ward Pylon", gx: 2.3, gy: 0.4, rPi: 2.00, angleDeg: 10, type: "QUMQUM_BEAM", color: "#D4AF37" }
    ];
  }

  /* ==========================================================================
   * LIVE 12-UNIT CIRCULAR COMBAT, DEGREES & 360° COMPLETION TELEMETRY TABLE
   * ========================================================================== */
  function renderCircularTelemetryTable() {
    const tbody = document.getElementById("circularCombatTelemetryBody");
    if (!tbody) return;
    tbody.innerHTML = state.units.map((u, idx) => {
      const isSel = idx === state.selectedUnitIndex;
      const pct = Math.min(100, Math.round(((u.revProgressDeg || 0) / 360) * 100));
      const radVal = (((u.angleDeg || 0) * Math.PI) / 180).toFixed(2);
      const chipCls = u.resonanceTier === "PRIME_RESONANCE" ? "resonance-high" : (u.resonanceTier === "HARMONIC_RESONANCE" ? "resonance-med" : "resonance-base");

      return '<tr style="' + (isSel ? 'background:rgba(56,189,248,0.12);' : '') + '">' +
        '<td><strong style="color:' + (u.isEnemy ? '#FDA4AF' : '#FDE68A') + ';cursor:pointer;" onclick="window.SovGame.selectUnitByIndex(' + idx + ')">' +
        (isSel ? '🎯 ' : '') + u.name.split("(")[0].trim() + '</strong><br/>' +
        '<span class="badge ' + (u.isEnemy ? 'badge-crimson' : 'badge-emerald') + '">' + u.coreArchetype + '</span></td>' +
        '<td><span class="resonance-chip ' + chipCls + '">' + u.verb + ' (' + u.activeResonance.toFixed(2) + 'x)</span></td>' +
        '<td style="font-family:Consolas,monospace;color:#FDE68A;"><strong>' + Math.round(u.angleDeg || 0) + '°</strong> <span style="color:#94A3B8;">(' + radVal + ' rad)</span></td>' +
        '<td style="font-family:Consolas,monospace;color:#93C5FD;">r = <strong>' + (u.orbitRadiusPi || 2.0).toFixed(2) + 'π</strong></td>' +
        '<td style="font-family:Consolas,monospace;color:#6EE7B7;">Δθ = <strong>' + (u.arcDegrees || 180) + '°</strong> | ω = ' + (u.angularVelocityDeg || 120) + '°/s</td>' +
        '<td style="min-width:155px;">' +
        '<div style="display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:0.7rem;">' +
        '<span style="color:#6EE7B7;">' + Math.round(u.revProgressDeg || 0) + '° / 360° (' + pct + '%)</span>' +
        '<span style="color:#FDE68A;">⭕ ' + (u.completedCircles || 0) + ' (2π)</span></div>' +
        '<div class="winrate-bar-outer"><div class="winrate-bar-inner" style="width:' + pct + '%;"></div></div>' +
        '</td>' +
        '<td style="font-family:Consolas,monospace;font-size:0.72rem;">' +
        'φ = <strong style="color:#F43F5E;">' + Math.round(u.lastIncidenceDeg || 135) + '°</strong> | τ = <strong style="color:#FDE68A;">' + (u.lastTorquePi || 45.0) + ' N·π</strong><br/>' +
        '<span style="color:#6EE7B7;">Impact: ' + Math.round(u.lastProceduralDmg || 140) + ' HP</span></td>' +
        '<td><div class="btn-row">' +
        '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.forceUnit360Completion(' + idx + ')">⭕ 360° Pulse</button>' +
        '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.cycleUnitRing(' + idx + ')">🔄 Ring</button>' +
        '</div></td>' +
        '</tr>';
    }).join("");
  }

  /* ==========================================================================
   * 12-FACET REPOSITORY AGENCY UI RENDERERS (agency/01..12_*.md)
   * ========================================================================== */
  function renderAgencyCouncilUI() {
    if (!window.SovAgencyEngine) return;
    const council = window.SovAgencyEngine.getCouncil();
    const status = window.SovAgencyEngine.getAutoTuneStatus();

    // 1. Populate Agency Selector Dropdown
    const sel = document.getElementById("agencySelectDropdown");
    if (sel && sel.options.length !== council.length) {
      sel.innerHTML = council.map((ag, i) =>
        '<option value="' + i + '">[' + ag.angleDeg + '° / ' + ag.radianPi + '] ' + ag.name + ' (' + ag.file + ')</option>'
      ).join("");
      sel.value = String(state.selectedAgencyIndex || 0);
    }

    // 2. Sync Selected Agent Customizer & Embedded MD Editor
    const curAg = council[state.selectedAgencyIndex] || council[0];
    if (curAg) {
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setTxt("agencySelectedHeader", "[" + curAg.angleDeg + "° | " + curAg.radianPi + "] " + curAg.name);
      setTxt("agencySelectedFileBadge", curAg.file);
      setVal("agencyWeightSlider", curAg.weightPi);
      setTxt("agencyWeightVal", Number(curAg.weightPi).toFixed(2) + "π");
      setVal("agencyPrioryInput", curAg.prioryPrinciple);
      setVal("agencyStandardInput", curAg.componentStandard);
      setVal("agencyMarkdownEditor", curAg.embeddedMarkdown);
    }

    // 3. Render 12-Agent Circular Table
    const tbody = document.getElementById("agencyCouncilTableBody");
    if (tbody) {
      tbody.innerHTML = council.map((ag, idx) => {
        const isCurrentAuto = idx === status.currentSectorIdx;
        return '<tr style="' + (isCurrentAuto ? 'background:rgba(16,185,129,0.12);' : '') + '">' +
          '<td style="font-family:Consolas,monospace;color:#FDE68A;"><strong>' + ag.angleDeg + '°</strong> (' + ag.radianPi + ')<br/>' +
          '<span class="badge ' + (isCurrentAuto ? 'badge-emerald' : 'badge-gold') + '">' + (isCurrentAuto ? '⚡ ACTIVE GATE' : 'Sector #' + ag.sectorIndex) + '</span></td>' +
          '<td><strong style="color:#6EE7B7;">' + ag.shortName + '</strong><br/><code style="font-size:0.68rem;color:#93C5FD;">' + ag.file + '</code></td>' +
          '<td style="font-size:0.72rem;"><strong>Facet:</strong> ' + ag.facet + '<br/><span style="color:#CBD5E1;">' + ag.prioryPrinciple + '</span></td>' +
          '<td style="font-size:0.72rem;color:#FDA4AF;">' + ag.inefficiencyCurved + '</td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.7rem;color:#6EE7B7;">' + ag.componentStandard + '</td>' +
          '<td style="font-family:Consolas,monospace;"><strong>' + Number(ag.weightPi).toFixed(2) + 'π</strong><br/>' +
          '<span class="resonance-chip ' + (ag.autoTuneEnabled ? 'resonance-high' : 'resonance-base') + '">' + (ag.autoTuneEnabled ? 'Auto-Tune ON' : 'Paused') + '</span></td>' +
          '<td><div class="btn-row">' +
          '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.selectAgencyForEdit(' + idx + ')">📖 Edit MD</button>' +
          '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.runSingleAgencySector(' + idx + ')">⚡ Tune</button>' +
          '</div></td>' +
          '</tr>';
      }).join("");
    }
  }

  /* ==========================================================================
   * DATA-DRIVEN COMMANDS, PROFILES, THRONE, COMMODITIES, KINGS & 68 TOMES
   * ========================================================================== */
  function refreshCommandUI() {
    const cmds = window.SOV_COMMANDS_REGISTRY || [];
    const u = state.units[state.selectedUnitIndex] || state.units[0];

    const inspSel = document.getElementById("inspVerbSelect");
    if (inspSel) {
      const currentVal = u ? u.verb : inspSel.value;
      inspSel.innerHTML = cmds.map(c => {
        const res = window.SovCommandEngine.evaluateArchetypeResonance(u, c.verb);
        const star = res.tier === "PRIME_RESONANCE" ? "⚡ " : (res.tier === "HARMONIC_RESONANCE" ? "✨ " : "");
        return '<option value="' + c.verb + '">' + star + c.verb + " [Δ" + (c.arcDegrees || 180) + "° | r=" + (c.orbitRadiusPi || 2.0).toFixed(2) + "π] (" + res.multiplier.toFixed(2) + "x)</option>";
      }).join("");
      if (currentVal) inspSel.value = currentVal;
    }

    const clashVerbSel = document.getElementById("clashVerbSelect");
    if (clashVerbSel) {
      const curClashVerb = clashVerbSel.value || "DEFEND";
      clashVerbSel.innerHTML = cmds.map(c => {
        return '<option value="' + c.verb + '">' + c.verb + " (Δ" + (c.arcDegrees || 180) + "° @ r=" + (c.orbitRadiusPi || 2.0).toFixed(2) + "π • " + c.resonantArchetypes.join("/") + " " + c.resonanceMultiplierPi.toFixed(2) + "x)</option>";
      }).join("");
      clashVerbSel.value = curClashVerb;
    }

    const tbody = document.getElementById("commandRegistryTableBody");
    if (tbody) {
      tbody.innerHTML = cmds.map((c, idx) => {
        const res = window.SovCommandEngine.evaluateArchetypeResonance(u, c.verb);
        const chipClass = res.tier === "PRIME_RESONANCE" ? "resonance-high" : (res.tier === "HARMONIC_RESONANCE" ? "resonance-med" : "resonance-base");
        return '<tr>' +
          '<td><strong style="color:#FDE68A;font-family:Consolas,monospace;">' + c.verb + '</strong><br/><span style="font-size:0.7rem;color:#94A3B8;">' + c.id + (c.isCustom ? ' • <span style="color:#6EE7B7;">[Custom]</span>' : '') + '</span></td>' +
          '<td><strong>' + c.name + '</strong><br/><span class="badge badge-sapphire">' + c.category + '</span> <span class="badge badge-purple">' + c.vfxType + '</span></td>' +
          '<td style="font-family:Consolas,monospace;color:#FDE68A;">' +
          'Arc: <strong>Δ' + (c.arcDegrees || 180) + '°</strong> (' + (((c.arcDegrees || 180) * Math.PI) / 180).toFixed(2) + ' rad)<br/>' +
          'Ring: <strong>r=' + (c.orbitRadiusPi || 2.0).toFixed(2) + 'π</strong> | ω=' + (c.angularSpeedDeg || 120) + '°/s</td>' +
          '<td><div style="margin-bottom:3px;">' + c.resonantArchetypes.map(a => '<span class="badge badge-gold" style="margin-right:3px;">' + a + '</span>').join('') + '</div>' +
          '<div style="font-size:0.72rem;color:#CBD5E1;">' + c.resonantBonusDesc + '</div></td>' +
          '<td style="font-family:Consolas,monospace;"><span class="resonance-chip ' + chipClass + '">Max ' + c.resonanceMultiplierPi.toFixed(2) + 'x</span><br/>' +
          '<span style="font-size:0.7rem;color:#6EE7B7;">Selected: ' + res.multiplier.toFixed(2) + 'x</span></td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.72rem;">' +
          'Pwr: ' + c.basePowerPi.toFixed(2) + 'π | Mit: ' + c.mitigationPi.toFixed(2) + 'π<br/>' +
          'Wheel: ' + c.startupFrames + 's / ' + c.activeFrames + 'a / ' + c.recoveryFrames + 'r (360°)<br/>' +
          'SPC Δσ: ' + (c.spcDeltaSigma > 0 ? '+' : '') + c.spcDeltaSigma + 'σ</td>' +
          '<td><div class="btn-row">' +
          '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.executeCommandWithSelectedUnit(\'' + c.verb + '\')">⚡ Cast</button>' +
          '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.loadCommandIntoForge(' + idx + ')">✏️ Edit</button>' +
          '</div></td>' +
          '</tr>';
      }).join("");
    }
  }

  function populateBastilleCrucibleSelects() {
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
    const attSel = document.getElementById("clashAttackerSelect");
    const defSel = document.getElementById("clashDefenderSelect");
    const bState = window.SovCommandEngine && window.SovCommandEngine.getBastilleState
      ? window.SovCommandEngine.getBastilleState()
      : { vaults: {} };

    const optionsHtml = pool.map((c) => {
      const v = (bState.vaults && bState.vaults[c.id]) || { fortificationTier: 1, wallIntegrityPct: 100 };
      return '<option value="' + c.id + '">[' + c.degree + '° | T' + v.fortificationTier + '] ' + c.name.replace(/^\d+°\s*/, "") + ' (' + c.combatRole + ')</option>';
    }).join("");

    if (attSel) {
      const prevAtt = attSel.value;
      attSel.innerHTML = optionsHtml;
      if (prevAtt && pool.some(c => c.id === prevAtt)) {
        attSel.value = prevAtt;
      } else {
        attSel.value = "DB_ARCH_090_MAMLUK_SHOCK_LANCER";
      }
    }
    if (defSel) {
      const prevDef = defSel.value || state.selectedBastilleVaultId;
      defSel.innerHTML = optionsHtml;
      if (prevDef && pool.some(c => c.id === prevDef)) {
        defSel.value = prevDef;
      } else {
        defSel.value = "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      }
      state.selectedBastilleVaultId = defSel.value;
    }
  }

  function renderProfilesTableAndSelects() {
    const profiles = window.SOV_PROFILES_DATA || [];
    populateBastilleCrucibleSelects();

    const tbody = document.getElementById("profiles11VectorTableBody");
    if (tbody) {
      tbody.innerHTML = profiles.map((p, idx) => {
        const gambitNodes = window.SovCommandEngine.parseGambitStack(p.commandsRuleStack, p);
        const gambitBadges = gambitNodes.map(g => {
          const cls = g.resonance.tier === "PRIME_RESONANCE" ? "resonance-high" : (g.resonance.tier === "HARMONIC_RESONANCE" ? "resonance-med" : "resonance-base");
          return '<span class="resonance-chip ' + cls + '" style="margin:2px;">' + g.verb + " [Δ" + g.arcDegrees + "°|" + g.resonance.multiplier.toFixed(2) + "x]</span>";
        }).join(" → ");

        return '<tr>' +
          '<td><strong style="color:#FDE68A;">' + p.characterName + '</strong><br/><span style="color:#6EE7B7;font-size:0.72rem;">' + p.arabicTitle + '</span><br/><span style="color:#94A3B8;font-size:0.7rem;">' + p.profileId + '</span></td>' +
          '<td><span class="badge badge-gold">' + p.archetypeClass + '</span><br/><span class="badge badge-emerald" style="margin-top:3px;">ECAT: ' + p.coreArchetype + '</span></td>' +
          '<td style="font-size:0.72rem;"><strong>Experience:</strong> ' + p.livedExperienceOrigin + '<br/><strong>' + p.willAndPatronage + '</strong></td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.7rem;color:#6EE7B7;"><div>' + p.commandsRuleStack + '</div><div style="margin-top:4px;">' + gambitBadges + '</div></td>' +
          '<td style="font-size:0.72rem;"><strong>Function:</strong> ' + p.tacticalFunction + '<br/><strong>3D Form:</strong> <span style="color:#93C5FD;">' + p.spriteAnimationForm + '</span></td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.72rem;"><strong>Stat:</strong> ' + p.statWeightPi.toFixed(2) + 'π<br/><strong>Armor:</strong> ' + p.armorWeightPi.toFixed(2) + 'π<br/><strong>Weapon:</strong> ' + p.weaponWeightPi.toFixed(2) + 'π</td>' +
          '<td style="font-size:0.72rem;"><strong>Skill:</strong> ' + p.skillName + '<br/><strong>Ability:</strong> <span style="color:#FDE68A;">' + p.skillAbilityName + '</span><br/><strong>Defense:</strong> ' + p.skillDefense + '</td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.7rem;color:#FDE68A;">' + p.canonicalMetricsOfSkill + '<br/>' +
          '<button class="btn btn-sm btn-emerald" style="margin-top:5px;" onclick="window.SovGame.deployProfileToGrid(' + idx + ')">🚀 Deploy on Ring</button></td>' +
          '</tr>';
      }).join("");
    }
  }

  function renderThroneRoomDepartments() {
    const galleryMount = document.getElementById("throneRooms3DGalleryMount");
    const grid = document.getElementById("throneRoomDeptsGrid");
    const thrones = window.SOV_THRONE_ROOMS_DATA || [];
    const depts = window.SOV_THRONE_DEPTS || [];
    const activeThrone = thrones.find(t => t.id === state.activeThroneRoomId) || thrones[2] || thrones[0];

    if (galleryMount && thrones.length > 0 && activeThrone) {
      const cardsHtml = thrones.map((t, idx) => {
        const isAct = t.id === activeThrone.id;
        return '<div class="throne-3d-card' + (isAct ? ' active-throne' : '') + '" onclick="window.SovGame.activateThroneRoom3D(\'' + t.id + '\')">' +
          '<div class="throne-3d-img-wrap">' +
            '<img src="' + t.imagePath + '" alt="' + t.title + '" loading="lazy" />' +
            '<span class="throne-3d-ring-pill">' + t.ringRadiusPi + '</span>' +
            (idx === 2 ? '<span class="throne-3d-new-pill">★ 3RD THRONE ROOM (AI 3D)</span>' : '<span class="throne-3d-seq-pill">AI 3D ROOM #' + (idx + 1) + '</span>') +
          '</div>' +
          '<div class="throne-3d-card-body">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:0.35rem;margin-bottom:0.2rem;">' +
              '<span class="badge ' + t.badgeClass + '" style="font-size:0.64rem;">' + t.ordinal + '</span>' +
              '<span style="font-family:Consolas,monospace;font-size:0.68rem;color:#6EE7B7;">+' + t.auraBonusPi.toFixed(2) + 'π/s</span>' +
            '</div>' +
            '<h4 style="margin:0 0 0.18rem 0;font-size:0.82rem;color:#FDE68A;">' + t.title + '</h4>' +
            '<div style="font-size:0.7rem;color:#93C5FD;margin-bottom:0.25rem;">' + t.degreeGeometry + '</div>' +
            '<p style="margin:0 0 0.32rem 0;font-size:0.71rem;color:#CBD5E1;line-height:1.38;">' + t.architecture + '</p>' +
            '<div style="font-size:0.69rem;color:#6EE7B7;background:rgba(16,185,129,0.1);padding:0.28rem 0.45rem;border-radius:6px;border-left:2px solid #10B981;margin-bottom:0.35rem;">' +
              '<strong>Active 3D Throne Aura:</strong> ' + t.combatAuraDesc +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
              '<span style="font-size:0.67rem;color:#94A3B8;">' + t.governedDeptLabels + '</span>' +
              '<button class="btn btn-sm ' + (isAct ? 'btn-emerald' : 'btn-sapphire') + '" onclick="event.stopPropagation();window.SovGame.activateThroneRoom3D(\'' + t.id + '\')">' +
                (isAct ? '✔ Active 3D Throne' : '👑 Enter Throne Room') +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join("");

      galleryMount.innerHTML =
        '<div class="throne-3d-hero">' +
          '<div class="throne-3d-hero-visual">' +
            '<img src="' + activeThrone.imagePath + '" alt="' + activeThrone.title + '" />' +
            '<div class="throne-3d-hero-overlay">' +
              '<span class="badge badge-gold">' + activeThrone.ordinal + '</span>' +
              '<span class="badge badge-emerald">' + activeThrone.ringRadiusPi + ' • +' + activeThrone.auraBonusPi.toFixed(2) + 'π Aura</span>' +
            '</div>' +
          '</div>' +
          '<div class="throne-3d-hero-info">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.25rem;">' +
              '<span style="font-size:0.72rem;color:#6EE7B7;font-family:Consolas,monospace;font-weight:700;">✨ AI-GENERATED 2.5D/3D ISOMETRIC SOVEREIGN THRONE CHAMBER</span>' +
              '<span class="badge badge-gold">' + activeThrone.degreeGeometry + '</span>' +
            '</div>' +
            '<h3 style="margin:0 0 0.2rem 0;font-size:1.02rem;color:#FDE68A;">' + activeThrone.title + '</h3>' +
            '<div style="font-size:0.78rem;color:#6EE7B7;margin-bottom:0.38rem;">' + activeThrone.arabic + '</div>' +
            '<p style="margin:0 0 0.42rem 0;font-size:0.76rem;color:#E2E8F0;line-height:1.45;"><strong>3D Architectural Geometry:</strong> ' + activeThrone.architecture + '</p>' +
            '<div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);padding:0.45rem 0.6rem;border-radius:8px;margin-bottom:0.45rem;font-size:0.75rem;color:#6EE7B7;">' +
              '<strong>⭕ Program-Assigned Circular Combat &amp; Statecraft Resonance:</strong> ' + activeThrone.combatAuraDesc +
            '</div>' +
            '<div style="font-size:0.72rem;color:#93C5FD;margin-bottom:0.5rem;"><strong>Governed Castle Departments:</strong> ' + activeThrone.governedDeptLabels + '</div>' +
            '<div class="btn-row">' +
              '<button class="btn btn-emerald" onclick="window.SovGame.activateThroneRoom3D(\'' + activeThrone.id + '\')">👑 Pulse ' + activeThrone.ordinal.split("(")[0].trim() + ' Aura (+' + activeThrone.auraBonusPi.toFixed(2) + 'π)</button>' +
              '<button class="btn btn-sapphire" onclick="window.SovGame.triggerGlobal360CompletionPulse()">⭕ Fire 360° Sovereign Zenith Finisher</button>' +
              '<button class="btn" onclick="window.SovGame.triggerDatabankCoalitionBattle(\'3v3\')">🔺 Convene 3v3 Equilateral Apex Trial</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sub-grid-3">' + cardsHtml + '</div>';
    }

    if (!grid) return;
    grid.innerHTML = depts.map(d => {
      const parentThrone = thrones.find(t => (t.governedDepts || []).indexOf(d.id) !== -1);
      const isHighlighted = activeThrone && (activeThrone.governedDepts || []).indexOf(d.id) !== -1;
      return '<div class="sub-card" style="' + (isHighlighted ? 'border-color:var(--emerald);box-shadow:0 0 14px rgba(16,185,129,0.18);' : '') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:0.35rem;margin-bottom:0.2rem;">' +
          '<h4 style="margin:0;">' + d.title + '</h4>' +
          (parentThrone ? '<span class="badge ' + parentThrone.badgeClass + '" style="font-size:0.62rem;">' + parentThrone.ordinal.split(" ")[0] + ' ' + parentThrone.ordinal.split(" ")[2] + '</span>' : '') +
        '</div>' +
        '<div style="color:#FDE68A;font-size:0.75rem;margin-bottom:0.28rem;">' + d.arabic + '</div>' +
        '<p style="margin:0 0 0.32rem 0;color:#CBD5E1;font-size:0.74rem;"><strong>Prophetic Precedent:</strong> ' + d.precedent + '</p>' +
        '<p style="margin:0 0 0.32rem 0;color:#93C5FD;font-size:0.74rem;"><strong>Manual Dictate:</strong> ' + d.dictate + '</p>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.4rem;padding-top:0.38rem;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<span style="font-family:Consolas,monospace;font-size:0.7rem;color:#6EE7B7;">' + d.formula + '</span>' +
          '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.issueThroneDecree(\'' + d.id + '\')">Issue Decree (+3.14π)</button>' +
        '</div></div>';
    }).join("");
  }

  function renderCommoditiesTable() {
    const tbody = document.getElementById("commoditiesTableBody");
    if (!tbody) return;
    const comms = window.SOV_COMMODITIES_DATA || [];
    tbody.innerHTML = comms.map(c =>
      '<tr>' +
      '<td><strong style="color:#FDE68A;">' + c.name + '</strong><br/><span style="font-size:0.71rem;color:#6EE7B7;">' + c.sub + '</span></td>' +
      '<td>' + c.ports + '</td>' +
      '<td>' + c.chain + '</td>' +
      '<td>' + c.credit + '</td>' +
      '<td><span style="color:#93C5FD;">' + c.utility + '</span></td>' +
      '<td style="font-family:Consolas,monospace;color:#FDE68A;font-weight:700;">' + c.valPi.toFixed(2) + ' π Dīnārs<br/>' +
      '<button class="btn btn-sm btn-emerald" style="margin-top:4px;" onclick="window.SovGame.harvestAndTradeCommodity(\'' + c.id + '\', ' + c.valPi + ')">Harvest &amp; Trade</button></td>' +
      '</tr>'
    ).join("");
  }

  function renderRumoredKingsGrid() {
    const grid = document.getElementById("rumoredKingsGrid");
    if (!grid) return;
    const kings = window.SOV_KINGS_DATA || [];
    grid.innerHTML = kings.map(k =>
      '<div class="sub-card" id="kingCard_' + k.id + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:0.4rem;">' +
      '<h4>👑 ' + k.name + '</h4>' +
      '<span class="badge badge-gold">' + k.vector + '</span>' +
      '</div>' +
      '<div style="font-size:0.73rem;color:#93C5FD;margin-bottom:0.32rem;">' + k.era + '</div>' +
      '<p style="margin:0 0 0.32rem 0;font-size:0.75rem;color:#E2E8F0;"><strong>Initial Curiosity, Hope &amp; Gifts:</strong> ' + k.curiosity + '</p>' +
      '<div style="background:rgba(15,23,42,0.9);border-left:3px solid #F43F5E;padding:0.42rem 0.58rem;border-radius:6px;margin:0.38rem 0;font-size:0.74rem;">' +
      '<div style="color:#FDA4AF;font-weight:700;">🕵️ Uncovered Syndication: ' + k.syndication + '</div>' +
      '<div style="color:#FDE68A;"><strong>True Nature:</strong> ' + k.nature + '</div>' +
      '<div style="color:#CBD5E1;"><strong>"Wolves at the Door" / Suffrage Cause:</strong> ' + k.grievance + '</div>' +
      '</div>' +
      '<div style="background:rgba(16,185,129,0.12);border-left:3px solid #10B981;padding:0.42rem 0.58rem;border-radius:6px;margin:0.38rem 0;font-size:0.74rem;color:#6EE7B7;">' +
      '<strong>Priory &amp; Scientific Discovery Unlocked:</strong> ' + k.discovery +
      '</div>' +
      '<div class="btn-row" style="margin-top:0.45rem;">' +
      '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.sendDiplomaticEpistle(\'' + k.id + '\', \'' + k.name.replace(/'/g, "\\'") + '\')">📜 Send Prophetic Epistle &amp; Uncover Syndication</button>' +
      '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.sendCaravanToKing(\'' + k.id + '\')">🐪 Send Orbital Caravan</button>' +
      '</div></div>'
    ).join("");
  }

  function renderCastleLibraryTomes() {
    const grid = document.getElementById("castleLibraryTomeGrid");
    const tomes = window.SOV_TOMES_DATA || [];

    if (grid) {
      grid.innerHTML = tomes.map(t =>
        '<div class="tome-card illuminated" id="tomeCard_' + t.seq + '">' +
        '<div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:0.35rem;margin-bottom:0.28rem;">' +
        '<span class="badge badge-gold">Tome #' + String(t.seq).padStart(2, "0") + ' / 68</span>' +
        '<span style="font-size:0.68rem;color:#6EE7B7;font-family:Consolas,monospace;">+3.14² π Illuminated</span>' +
        '</div>' +
        '<div style="font-weight:700;color:#FDE68A;font-size:0.84rem;margin-bottom:0.18rem;">' + t.label + ' — ' + t.title + '</div>' +
        '<div style="font-size:0.71rem;color:#93C5FD;margin-bottom:0.28rem;">' + t.wing + ' • ' + t.tag + '</div>' +
        '</div>' +
        '<div class="btn-row" style="margin-top:0.32rem;">' +
        '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.injectTomeScenario(' + t.seq + ')">⚡ Inject Tome into Circular Arena (+98.6π)</button>' +
        '</div></div>'
      ).join("");
    }
  }

  function renderRingBufferPanel() {
    const box = document.getElementById("ringBufferQueueBox");
    if (!box || !window.SovCommandEngine) return;
    const rb = window.SovCommandEngine.ringBuffer;
    const recent = rb.executedHistory.slice(0, 8);
    if (recent.length === 0) {
      box.innerHTML = '<div style="color:#94A3B8;">Ring-buffer awaiting circular degree dispatches...</div>';
      return;
    }
    box.innerHTML = recent.map(item => {
      const badgeColor = item.resonanceTier === "PRIME_RESONANCE" ? "#6EE7B7" : (item.resonanceTier === "HARMONIC_RESONANCE" ? "#FDE68A" : "#CBD5E1");
      return '<div class="log-entry">' +
        '<span style="color:#38BDF8;">[T#' + item.scheduledTick + ']</span> ' +
        '<strong>' + item.actorName + '</strong> → ' +
        '<span style="color:' + badgeColor + ';font-weight:700;">' + item.verb + ' [Δ' + (item.arcDegrees || 180) + '° | φ=' + (item.incidenceDeg || 135) + '° | ' + item.resonanceMult.toFixed(2) + 'x]</span> ' +
        'on <em>' + item.targetName + '</em> <span style="color:#FDE68A;">(' + (item.impactDmg || 120) + ' DMG)</span>' +
        '</div>';
    }).join("");
  }

  function syncInspectorToSelectedUnit() {
    const u = state.units[state.selectedUnitIndex];
    if (!u) return;
    refreshCommandUI();

    const res = window.SovCommandEngine.evaluateArchetypeResonance(u, u.verb);
    u.activeResonance = res.multiplier;
    u.resonanceTier = res.tier;
    u.arcDegrees = res.arcDegrees || 180;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("selectedNodeBadge", "Node #" + String(state.selectedUnitIndex + 1).padStart(3, "0") + " • θ=" + Math.round(u.angleDeg || 0) + "° (r=" + (u.orbitRadiusPi || 2.0).toFixed(2) + "π)");
    setEl("inspNodeName", u.name);
    setEl("inspNodeRole", "Archetype: " + u.archetype + " [" + u.coreArchetype + "] • Ring r=" + (u.orbitRadiusPi || 2.0).toFixed(2) + "π");

    const verbSel = document.getElementById("inspVerbSelect");
    if (verbSel) verbSel.value = u.verb;

    const expEl = document.getElementById("inspNodeExperience");
    if (expEl) {
      expEl.innerHTML =
        "<strong>Circular Telemetry:</strong> Bearing θ=<strong>" + Math.round(u.angleDeg || 0) + "°</strong> (" + (((u.angleDeg || 0) * Math.PI) / 180).toFixed(2) + " rad) | " +
        "Sweep Arc Δθ=<strong>" + (u.arcDegrees || 180) + "°</strong> | ω=<strong>" + (u.angularVelocityDeg || 120) + "°/s</strong> | " +
        "2π Completion: <strong>" + Math.round(((u.revProgressDeg || 0) / 360) * 100) + "%</strong> (" + (u.completedCircles || 0) + " Circles)";
    }

    const gambitInput = document.getElementById("inspNodeGambitInput");
    if (gambitInput) gambitInput.value = u.gambit;

    const astBox = document.getElementById("inspGambitAstBadges");
    if (astBox && window.SovCommandEngine) {
      const ast = window.SovCommandEngine.parseGambitStack(u.gambit, u);
      astBox.innerHTML = ast.map(node => {
        const cls = node.resonance.tier === "PRIME_RESONANCE" ? "resonance-high" : (node.resonance.tier === "HARMONIC_RESONANCE" ? "resonance-med" : "resonance-base");
        return '<span class="resonance-chip ' + cls + '" title="' + node.resonance.summaryText + '">' +
          node.stepIndex + ". " + node.verb + " [Δ" + node.arcDegrees + "°|" + node.resonance.multiplier.toFixed(2) + "x]" +
          '</span>';
      }).join(" → ");
    }

    const resBanner = document.getElementById("inspActiveResonanceBanner");
    if (resBanner) {
      resBanner.textContent = res.summaryText;
      resBanner.style.borderColor = res.tier === "PRIME_RESONANCE" ? "#10B981" : "#D4AF37";
      resBanner.style.color = res.tier === "PRIME_RESONANCE" ? "#6EE7B7" : "#FDE68A";
    }

    setEl("inspStatW", u.statW.toFixed(2) + "π");
    setEl("inspArmorW", u.armorW.toFixed(2) + "π");
    setEl("inspWeaponW", u.weaponW.toFixed(2) + "π");
    setEl("inspTone", u.tone.split("(")[0].trim());
    setEl("inspTradeSkill", "Δ" + (u.arcDegrees || 180) + "° @ " + (u.orbitRadiusPi || 2.0).toFixed(2) + "π");
    setEl("inspConversions", (u.completedCircles || 0) + " Circles / " + u.conversions + " Nodes");
  }

  /* ==========================================================================
   * INITIALIZE VIEWPORTS & EXPORT PUBLIC STUDIO API (window.SovGame)
   * ========================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    initUnitsAndCaravans();

    const vp = window.SovViewportsFactory.createViewportsController(state, addLog);

    const G = {
      state: state,
      addLog: addLog,
      spawnVfx: vp.spawnVfx,
      isoProject: vp.isoProject,
      polarIsoProject: vp.polarIsoProject,
      syncInspectorToSelectedUnit: syncInspectorToSelectedUnit,
      refreshCommandUI: refreshCommandUI,
      renderRingBufferPanel: renderRingBufferPanel,
      renderCircularTelemetryTable: renderCircularTelemetryTable,
      renderAgencyCouncilUI: renderAgencyCouncilUI
    };
    window.SovGame = G;

    /* Studio Workspace Tab & Multi-Window Layout Controls */
    G.switchStudioTab = function (tabId) {
      const sections = document.querySelectorAll(".studio-section");
      sections.forEach(sec => {
        if (tabId === "ALL") {
          sec.classList.remove("hidden-tab");
        } else {
          sec.classList.toggle("hidden-tab", sec.id !== "studioSec_" + tabId);
        }
      });
      document.querySelectorAll(".studio-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
      });
    };

    G.setViewportLayout = function (layoutMode) {
      state.viewportLayout = layoutMode;
      const matrix = document.getElementById("viewportsMatrixContainer");
      if (matrix) {
        matrix.className = "viewports-matrix layout-" + layoutMode;
      }
      const win2 = document.getElementById("gameWin2_Arena");
      const win3 = document.getElementById("gameWin3_Radar");
      const win4 = document.getElementById("gameWin4_Spc");
      if (win2) win2.style.display = (layoutMode === "2x" || layoutMode === "4x") ? "flex" : "none";
      if (win3) win3.style.display = (layoutMode === "4x") ? "flex" : "none";
      if (win4) win4.style.display = (layoutMode === "4x") ? "flex" : "none";

      ["1x", "2x", "4x"].forEach(m => {
        const b = document.getElementById("layoutBtn_" + m);
        if (b) b.classList.toggle("active", m === layoutMode);
      });
      addLog("Switched Circular Viewport Layout to [" + layoutMode.toUpperCase() + "] Mode.", "#6EE7B7");
    };

    G.toggleTheaterExpanded = function () {
      state.theaterExpanded = !state.theaterExpanded;
      const mainGrid = document.getElementById("studioMainWorkspaceGrid");
      if (mainGrid) {
        mainGrid.classList.toggle("theater-expanded", state.theaterExpanded);
      }
      const btn = document.getElementById("theaterToggleBtn");
      if (btn) btn.classList.toggle("active", state.theaterExpanded);
      addLog(state.theaterExpanded ? "Expanded Circular Gaming Windows to Full-Width Theater!" : "Restored Docked Inspector Split View.", "#FDE68A");
    };

    G.toggleMaximizeWindow = function (winId) {
      const card = document.getElementById(winId);
      if (card) {
        card.classList.toggle("maximized-window");
      }
    };

    G.toggleAStarGrid = function () {
      state.showAStarGrid = !state.showAStarGrid;
      const btn = document.getElementById("toggleAStarBtn");
      if (btn) btn.classList.toggle("active", state.showAStarGrid);
      addLog("24-Spoke Polar Degree Protractor & A* Overlay: " + (state.showAStarGrid ? "ENABLED" : "COMPACT"), "#38BDF8");
    };

    G.setCanvasClickTool = function (toolMode) {
      state.canvasClickTool = toolMode;
      const sel = document.getElementById("abstractToolSelect");
      if (sel) sel.value = toolMode;
      addLog("Polar Canvas Click Tool set to: [" + toolMode + "]", "#FDE68A");
    };

    G.adjustCameraZoom = function (delta) {
      state.cameraZoom = Math.max(0.65, Math.min(1.65, +(state.cameraZoom + delta).toFixed(2)));
    };

    G.resetCamera = function () {
      state.cameraZoom = 1.0;
      state.cameraPanX = 0;
      state.cameraPanY = 0;
    };

    G.setSimSpeed = function (mult) {
      state.simSpeedMult = mult;
      addLog("Circular Angular Velocity ω Clock set to " + mult + "x (3.14π Synchronized).", "#6EE7B7");
    };

    G.selectUnitByIndex = function (idx) {
      if (idx >= 0 && idx < state.units.length) {
        state.selectedUnitIndex = idx;
        syncInspectorToSelectedUnit();
        renderCircularTelemetryTable();
      }
    };

    G.forceUnit360Completion = function (idx) {
      const u = state.units[idx != null ? idx : state.selectedUnitIndex];
      if (!u) return;
      u.revProgressDeg = 359.5;
      vp.spawnCircularShockwave(u.orbitRadiusPi || 2.0, u.angleDeg || 0, 110, "#10B981", u.arcDegrees || 360, u.angleDeg || 0);
      addLog("Forced 360° (2π) Full-Circle Completion Pulse on [" + u.name.split("(")[0].trim() + "] -> 3.14x Procedural Impact Unleashed!", "#6EE7B7");
    };

    G.triggerGlobal360CompletionPulse = function () {
      state.units.forEach((u, i) => {
        if (!u.isEnemy) {
          u.revProgressDeg = 359.0;
          vp.spawnCircularShockwave(u.orbitRadiusPi || 2.0, u.angleDeg || (i * 30), 95, "#10B981", u.arcDegrees || 314, u.angleDeg || 0);
        }
      });
      state.totalCompletedCircles += 10;
      state.barakahPower += 314.0;
      addLog("⭕ Triggered Global 360° (2π) Sovereign Completion Pulse across all Concentric π-Rings (+314.0π Surge)!", "#FDE68A");
    };

    G.cycleUnitRing = function (idx) {
      const u = state.units[idx != null ? idx : state.selectedUnitIndex];
      if (!u) return;
      const rings = [1.00, 2.00, 3.14, 4.71];
      const curIdx = rings.findIndex(r => Math.abs(r - (u.customOrbitPi || 2.00)) < 0.35);
      const nextRing = rings[(curIdx + 1) % rings.length];
      u.customOrbitPi = nextRing;
      u.orbitRadiusPi = nextRing;
      syncInspectorToSelectedUnit();
      renderCircularTelemetryTable();
      addLog("Shifted [" + u.name.split("(")[0].trim() + "] to Concentric Ring r = " + nextRing.toFixed(2) + "π!", "#93C5FD");
    };

    /* Era & Combat Modes */
    G.setContemporaryEra = function (idxStr) {
      state.eraIndex = parseInt(idxStr, 10) || 0;
      const sel = document.getElementById("hudEraSelector");
      const label = sel ? sel.options[sel.selectedIndex].text : "Era I";
      const readout = document.getElementById("canvasTopLeftReadout");
      if (readout) {
        readout.textContent = "3.14π Circular Mode: " + state.combatMode + " • " + label;
      }
      addLog("Contemporary Canon Style morphed to " + label + ".", "#6EE7B7");
    };

    G.setCombatMode = function (mode) {
      state.combatMode = mode;
      const sel = document.getElementById("abstractModeSelect");
      if (sel) sel.value = mode;
      const readout = document.getElementById("canvasTopLeftReadout");
      if (readout) {
        readout.textContent = "3.14π Circular Mode: " + mode + " • 4 Concentric Rings (1π..4.71π) • 360° Protractor";
      }
      G.triggerVfxBurst(mode === "SIEGE" ? "MISSILES" : (mode === "AMBUSH" ? "ARROWS" : "SPARKLES"));
      addLog("Switched Circular Arena to [" + mode + "] Mode — All units executing procedural degree & arc sweeps.", "#FDE68A");
    };

    G.triggerVfxBurst = function (vfxKind) {
      const c = vp.isoProject(0, 0, 20);
      if (vfxKind === "SPARKLES") {
        vp.spawnVfx("SPARKLES", c.x, c.y, c.x, c.y - 60, "#6EE7B7");
        vp.spawnCircularShockwave(1.00, state.globalPhaseDeg, 90, "#10B981", 360, 0);
        state.barakahPower += 31.4;
        addLog("Good Warlock emitted 360° (2π) Barakah Sparkle Wave (+31.4π Uncapped Power)!", "#6EE7B7");
      } else if (vfxKind === "SWORD_SWIPE") {
        vp.spawnVfx("SWORD_SWIPE", c.x - 40, c.y, c.x + 80, c.y - 20, "#FDE68A");
        vp.spawnCircularShockwave(2.00, state.globalPhaseDeg, 105, "#FDE68A", 314, state.globalPhaseDeg);
        addLog("Executed Crescent Damascus Fūlādh Sword Swipe (Δ314° = 1.74π rad Cleave Arc)!", "#FDE68A");
      } else if (vfxKind === "ARROWS") {
        vp.spawnVfx("ARROWS", c.x - 90, c.y - 40, c.x + 130, c.y + 30, "#38BDF8");
        vp.spawnCircularShockwave(3.14, state.globalPhaseDeg, 95, "#38BDF8", 120, state.globalPhaseDeg);
        addLog("Composite Snipers unleashed Tangential 120° Cone of 314 Bodkin Arrows!", "#93C5FD");
      } else if (vfxKind === "MISSILES") {
        vp.spawnVfx("MISSILES", c.x, c.y - 30, c.x + 150, c.y - 10, "#F43F5E");
        vp.spawnCircularShockwave(4.71, 180, 120, "#F43F5E", 90, 180);
        addLog("Launched 90° Quadrant Manjanīq & Solomonic Qumqum Vortex Salvo!", "#FDA4AF");
      } else if (vfxKind === "POISON_VINEGAR") {
        vp.spawnVfx("VINEGAR_MIST", c.x - 20, c.y, c.x + 90, c.y, "rgba(16,185,129,0.65)");
        vp.spawnCircularShockwave(2.00, 0, 110, "#6EE7B7", 360, 0);
        addLog("360° Al-Inbīq Vinegar-Rosewater Ring neutralized outer miasma!", "#6EE7B7");
      } else if (vfxKind === "EMPOWERED") {
        state.units.forEach(u => { if (!u.isEnemy) u.empowered = true; });
        state.barakahRate += 3.14;
        vp.spawnCircularShockwave(3.14, 0, 130, "#FDE68A", 360, 0);
        addLog("All Friendly Concentric Rings Empowered with 3.14π Circular Tawḥīd Auras!", "#FDE68A");
      } else if (vfxKind === "MAMLUK_CHARGE") {
        vp.spawnVfx("CAVALRY_CHARGE", c.x - 100, c.y + 20, c.x + 140, c.y - 30, "#F59E0B");
        vp.spawnCircularShockwave(4.00, 180, 115, "#F59E0B", 180, 180);
        addLog("Mamlūk Heavy Cavalry executed 180° Spiral Flank Charge (φ=180° Apex Impact)!", "#FDE68A");
      }
    };

    G.spawnProceduralCaravan = function () {
      state.caravans.push({
        name: "Orbital Caravan #" + (state.caravans.length + 1) + " (32-Bearing Circuit)",
        orbitRadiusPi: 2.50 + (state.caravans.length % 3) * 0.8,
        orbitAngleDeg: (state.globalPhaseDeg + 90) % 360,
        cargo: "Vinegar, Cotton, Botanicals & 32-Pt Compasses",
        friendly: true,
        stragglersProtected: true
      });
      state.dinarRate += 6.28;
      addLog("Dispatched new Orbital Caravan onto the 32-Bearing (360°) Trade Ring (+6.28 Dīnārs/s)!", "#6EE7B7");
    };

    G.updateAnimSliders = function () {
      state.walkSpeedPi = parseFloat(document.getElementById("animWalkSlider")?.value) || 3.14;
      state.floatAmpPi = parseFloat(document.getElementById("animFloatSlider")?.value) || 3.14;
      state.vfxScalePi = parseFloat(document.getElementById("animVfxSlider")?.value) || 3.14;
      state.orbitRadiusPi = parseFloat(document.getElementById("animOrbitSlider")?.value) || 3.14;
      document.getElementById("animWalkVal").textContent = state.walkSpeedPi.toFixed(2) + "π";
      document.getElementById("animFloatVal").textContent = state.floatAmpPi.toFixed(2) + "π";
      document.getElementById("animVfxVal").textContent = state.vfxScalePi.toFixed(2) + "π";
      document.getElementById("animOrbitVal").textContent = state.orbitRadiusPi.toFixed(2) + "π";
    };

    /* Unit Command & Archetype Resonance Actions */
    G.setSelectedNodeVerb = function (verb) {
      const u = state.units[state.selectedUnitIndex];
      if (!u) return;
      u.verb = verb;
      const res = window.SovCommandEngine.evaluateArchetypeResonance(u, verb);
      u.activeResonance = res.multiplier;
      u.resonanceTier = res.tier;
      u.arcDegrees = res.arcDegrees || 180;
      u.customOrbitPi = res.orbitRadiusPi || u.orbitRadiusPi;
      syncInspectorToSelectedUnit();
      renderCircularTelemetryTable();
      const up = vp.isoProject(u.gx, u.gy, 14);
      vp.spawnCircularShockwave(u.orbitRadiusPi, u.angleDeg, 75, "#10B981", u.arcDegrees, u.angleDeg);
      vp.spawnFloatingText(verb + " [Δ" + u.arcDegrees + "° | " + res.multiplier.toFixed(2) + "x]", up.x, up.y - 40, "#6EE7B7", true);
      addLog(res.summaryText, "#6EE7B7");
    };

    G.executeCommandWithSelectedUnit = function (verb) {
      G.setSelectedNodeVerb(verb);
      const u = state.units[state.selectedUnitIndex];
      if (u && window.SovCommandEngine) {
        window.SovCommandEngine.ringBuffer.enqueue(
          state.tickCount + 1,
          0,
          u.name.split("(")[0].trim(),
          verb,
          "Circular_Sector_" + Math.round(u.angleDeg) + "deg",
          u,
          { incidenceDeg: Math.round(u.lastIncidenceDeg || 135), dmg: Math.round(u.lastProceduralDmg || 150) }
        );
        renderRingBufferPanel();
      }
    };

    G.applyUtilityAiToSelectedUnit = function () {
      const u = state.units[state.selectedUnitIndex];
      if (!u || !window.SovCommandEngine) return;
      const best = window.SovCommandEngine.spcEngine.selectBestUtilityCommand(u);
      G.setSelectedNodeVerb(best.command.verb);
      addLog("Utility-AI Policy selected [" + best.command.verb + "] (Δ" + best.command.arcDegrees + "° @ r=" + best.command.orbitRadiusPi + "π, Resonance=" + best.resonance.multiplier.toFixed(2) + "x)!", "#FDE68A");
    };

    G.updateSelectedNodeGambit = function (ruleStr) {
      const u = state.units[state.selectedUnitIndex];
      if (!u) return;
      u.gambit = ruleStr;
      syncInspectorToSelectedUnit();
      addLog("Compiled Circular Gambit AST for [" + u.name + "]: " + ruleStr, "#6EE7B7");
    };

    /* ========================================================================
     * 12-AGENT PRE-THOUGHT REPOSITORY AGENCY CONTROLS & 100% CUSTOMIZATION
     * ======================================================================== */
    G.selectAgencyForEdit = function (idxStr) {
      state.selectedAgencyIndex = parseInt(idxStr, 10) || 0;
      const sel = document.getElementById("agencySelectDropdown");
      if (sel) sel.value = String(state.selectedAgencyIndex);
      renderAgencyCouncilUI();
    };

    G.saveCustomizedAgencyMd = function () {
      if (!window.SovAgencyEngine) return;
      const council = window.SovAgencyEngine.getCouncil();
      const curAg = council[state.selectedAgencyIndex];
      if (!curAg) return;
      curAg.weightPi = parseFloat(document.getElementById("agencyWeightSlider")?.value) || 3.14;
      curAg.prioryPrinciple = document.getElementById("agencyPrioryInput")?.value || curAg.prioryPrinciple;
      curAg.componentStandard = document.getElementById("agencyStandardInput")?.value || curAg.componentStandard;
      curAg.embeddedMarkdown = document.getElementById("agencyMarkdownEditor")?.value || curAg.embeddedMarkdown;
      renderAgencyCouncilUI();
      addLog("Updated Pre-Thought Agent [" + curAg.shortName + "] (" + curAg.file + ") @ Weight=" + curAg.weightPi.toFixed(2) + "π!", "#6EE7B7");
    };

    G.runSingleAgencySector = function (idx) {
      if (!window.SovAgencyEngine) return;
      const council = window.SovAgencyEngine.getCouncil();
      const ag = council[idx];
      if (!ag) return;
      const res = window.SovAgencyEngine.stepCircularAutoTune(G, false);
      renderAgencyCouncilUI();
      if (res && res.actionsLog.length) {
        addLog(res.actionsLog[0], "#6EE7B7");
      }
    };

    G.runFull360AgencyAutoTune = function () {
      if (!window.SovAgencyEngine) return;
      const res = window.SovAgencyEngine.stepCircularAutoTune(G, true);
      renderAgencyCouncilUI();
      syncInspectorToSelectedUnit();
      renderCircularTelemetryTable();
      const outBox = document.getElementById("agencyGateOutputBox");
      if (outBox && res) {
        outBox.innerHTML = res.actionsLog.map(l => '<div class="log-entry" style="color:#6EE7B7;">✔ ' + l + '</div>').join("");
      }
      vp.spawnCircularShockwave(3.14, 0, 125, "#10B981", 360, 0);
      addLog("♊ Executed Full 360° (2π) Pre-Thought Agency Auto-Tune across all 12 Embedded MDs!", "#FDE68A");
    };

    G.toggleAgencyAutoTuneLoop = function () {
      if (!window.SovAgencyEngine) return;
      const next = !window.SovAgencyEngine.isAutoTuneActive();
      window.SovAgencyEngine.setAutoTuneActive(next);
      const btn = document.getElementById("toggleAgencyLoopBtn");
      if (btn) {
        btn.textContent = next ? "🔄 Auto-Tune Loop: ACTIVE (360°)" : "⏸️ Auto-Tune Loop: PAUSED";
        btn.classList.toggle("active", next);
      }
      renderAgencyCouncilUI();
      addLog("Pre-Thought 12-Agent Circular Auto-Tune Loop: " + (next ? "ACTIVE" : "PAUSED"), "#FDE68A");
    };

    G.generateAndRegisterStandardComponent = function () {
      if (!window.SovAgencyEngine) return;
      const compType = document.getElementById("stdCompType")?.value || "CIRCULAR_COMMAND";
      const verbName = document.getElementById("stdCompName")?.value || "AEGIS_360_SHIELD";
      const arch = document.getElementById("stdCompArch")?.value || "ARCH_VANGUARD";
      const arcDeg = parseFloat(document.getElementById("stdCompArc")?.value) || 240;
      const orbitPi = parseFloat(document.getElementById("stdCompRing")?.value) || 2.00;

      const bp = window.SovAgencyEngine.generateStandardComponentBlueprint(compType, verbName, arch, arcDeg, orbitPi, 4.71, 5.65);
      window.SovCommandEngine.registerOrUpdateCommand(bp.commandSpec);
      G.setSelectedNodeVerb(bp.commandSpec.verb);

      const outBox = document.getElementById("agencyGateOutputBox");
      if (outBox) {
        outBox.innerHTML =
          '<div style="color:#FDE68A;font-weight:700;">✔ PRE-THOUGHT GATE PASSED (12/12 MDs Verified • Harmony=' + bp.preThoughtAudit.harmonyScorePi + 'π)</div>' +
          '<div style="color:#6EE7B7;">Curved Flow: ' + bp.preThoughtAudit.curvedPrioryForm.closedLoopFlow + '</div>' +
          '<div style="color:#93C5FD;">DSL Blueprint: <code>' + bp.dslCommandLine + '</code></div>';
      }
      addLog("Generated & Registered 12-Agent Standardized Component [" + bp.commandSpec.verb + "] (Δ" + arcDeg + "° @ r=" + orbitPi.toFixed(2) + "π)!", "#6EE7B7");
    };

    /* Custom Command Forge & Archetype Resonance Builder */
    G.loadCommandIntoForge = function (cmdIdx) {
      const c = (window.SOV_COMMANDS_REGISTRY || [])[cmdIdx];
      if (!c) return;
      document.getElementById("forgeCmdVerb").value = c.verb;
      document.getElementById("forgeCmdName").value = c.name;
      document.getElementById("forgeCmdCategory").value = c.category;
      document.getElementById("forgeCmdArch1").value = c.resonantArchetypes[0] || "ARCH_VANGUARD";
      document.getElementById("forgeCmdArch2").value = c.resonantArchetypes[1] || "ARCH_SENTINEL";
      document.getElementById("forgeCmdResMult").value = c.resonanceMultiplierPi;
      if (document.getElementById("forgeCmdArcDeg")) document.getElementById("forgeCmdArcDeg").value = c.arcDegrees || 180;
      if (document.getElementById("forgeCmdOrbitPi")) document.getElementById("forgeCmdOrbitPi").value = c.orbitRadiusPi || 2.00;
      if (document.getElementById("forgeCmdSpeedDeg")) document.getElementById("forgeCmdSpeedDeg").value = c.angularSpeedDeg || 120;
      document.getElementById("forgeCmdPower").value = c.basePowerPi;
      document.getElementById("forgeCmdMitigation").value = c.mitigationPi;
      document.getElementById("forgeCmdFrames").value = c.startupFrames + "/" + c.activeFrames + "/" + c.recoveryFrames;
      document.getElementById("forgeCmdVfx").value = c.vfxType;
      document.getElementById("forgeCmdDesc").value = c.resonantBonusDesc;
      addLog("Loaded Circular Command [" + c.verb + "] (Δ" + (c.arcDegrees || 180) + "°) into Custom Command Forge.", "#93C5FD");
    };

    G.saveCustomCommandFromForge = function () {
      const verb = (document.getElementById("forgeCmdVerb")?.value || "PHALANX_DEFEND").trim().toUpperCase().replace(/\s+/g, "_");
      const name = (document.getElementById("forgeCmdName")?.value || "Custom Circular Command").trim();
      const category = document.getElementById("forgeCmdCategory")?.value || "DEFENSIVE";
      const arch1 = document.getElementById("forgeCmdArch1")?.value || "ARCH_VANGUARD";
      const arch2 = document.getElementById("forgeCmdArch2")?.value || "ARCH_SENTINEL";
      const resMult = parseFloat(document.getElementById("forgeCmdResMult")?.value) || 1.50;
      const arcDeg = parseFloat(document.getElementById("forgeCmdArcDeg")?.value) || 180;
      const orbitPi = parseFloat(document.getElementById("forgeCmdOrbitPi")?.value) || 2.00;
      const speedDeg = parseFloat(document.getElementById("forgeCmdSpeedDeg")?.value) || 125;
      const pwr = parseFloat(document.getElementById("forgeCmdPower")?.value) || 3.77;
      const mit = parseFloat(document.getElementById("forgeCmdMitigation")?.value) || 4.71;
      const framesRaw = (document.getElementById("forgeCmdFrames")?.value || "4/14/6").split("/");
      const vfx = document.getElementById("forgeCmdVfx")?.value || "SWORD_SWIPE_AND_SPARKLES";
      const desc = document.getElementById("forgeCmdDesc")?.value || ("Resonates with " + arch1 + " (" + resMult.toFixed(2) + "x across Δ" + arcDeg + "° @ r=" + orbitPi + "π)");

      // First pass through Pre-Thought Agency Gate!
      if (window.SovAgencyEngine) {
        window.SovAgencyEngine.evaluatePreThoughtGate(verb, category, arcDeg, orbitPi);
      }

      const cmdObj = {
        id: "CMD_CUSTOM_" + verb,
        verb: verb,
        name: name,
        category: category,
        resonantArchetypes: arch2 && arch2 !== arch1 ? [arch1, arch2] : [arch1],
        resonanceMultiplierPi: resMult,
        resonantBonusDesc: desc,
        startupFrames: parseInt(framesRaw[0], 10) || 4,
        activeFrames: parseInt(framesRaw[1], 10) || 14,
        recoveryFrames: parseInt(framesRaw[2], 10) || 6,
        arcDegrees: arcDeg,
        optimalAngleDeg: category === "DEFENSIVE" ? 0 : 180,
        orbitRadiusPi: orbitPi,
        angularSpeedDeg: speedDeg,
        completionBonusPi: 3.14,
        basePowerPi: pwr,
        mitigationPi: mit,
        rangeTiles: category === "DEFENSIVE" ? 2 : 5,
        vfxType: vfx,
        spcDeltaSigma: category === "DEFENSIVE" || category === "SUPPORT" ? -0.35 : 0.12,
        isCustom: true
      };

      window.SovCommandEngine.registerOrUpdateCommand(cmdObj);
      G.setSelectedNodeVerb(verb);
      G.recalc11VectorClash();
      addLog("Pre-Thought Verified & Registered Circular Command [" + verb + "] (Δ" + arcDeg + "° @ r=" + orbitPi.toFixed(2) + "π | " + resMult.toFixed(2) + "x)!", "#6EE7B7");
    };

    /* ========================================================================
     * INTERACTIVE 24×15° / 6×60° EQUILATERAL ARCHETYPE CLASS FORGE, PERSISTENT
     * DATABANK OFFERINGS CRUD & AUTOMATED 1v1 / 2v2 / 3v3 COALITION ENGINE
     * ======================================================================== */
    state.selectedDatabankClassId = "DB_ARCH_015_AEGIS_WARDEN";
    state.databankDomainFilter = "ALL";
    state.autoWeighPoolActive = true;
    state.rosterAnimPaused = false;
    state.lastCoalitionResult = null;
    state.rosterAnim = null;

    function populateDatabankOfferingsSelects() {
      const off = window.SOV_DATABANK_OFFERINGS || {};
      const fill = (id, list, fmtFn) => {
        const el = document.getElementById(id);
        if (!el || !Array.isArray(list)) return;
        el.innerHTML = list.map(item => '<option value="' + item.id + '">' + fmtFn(item) + '</option>').join("");
      };
      fill("dbClassWeaponSelect", off.weapons, w => w.name + " [+" + w.arcBonusDeg + "° | " + w.torqueMult + "x]");
      fill("dbClassArmorSelect", off.armors, a => a.name + " [Mit " + a.mitigationPi + "π | Refl " + a.reflectPct + "%]");
      fill("dbClassSpellSelect", off.spells, s => s.name + " [Δ" + s.arcDeg + "° | " + s.powerPi + "π]");
      fill("dbClassPotionSelect", off.potions, p => p.name + " [+" + p.healPi + "π | " + p.buffMult + "x]");
      fill("dbClassInventorySelect", off.inventory, i => i.name + " [" + i.weightPi + "π | +" + Math.round((i.completionBoost - 1) * 100) + "% 360°]");
    }

    function refreshDatabankTemplateDropdown() {
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const sel = document.getElementById("dbClassTemplateSelect");
      if (sel) {
        sel.innerHTML = pool.map(c =>
          '<option value="' + c.id + '">' +
          (c.isCustom ? "★ [CUSTOM] " : "") + c.degree + "° (×3.14=" + c.degTimes314 + "°) — " + c.name + " [" + c.modality + "]" +
          '</option>'
        ).join("");
        if (pool.some(c => c.id === state.selectedDatabankClassId)) {
          sel.value = state.selectedDatabankClassId;
        }
      }
      refreshPersistentRosterSelects();
    }

    function refreshPersistentRosterSelects() {
      if (!window.SovCommandEngine || !window.SovCommandEngine.getCoalitionRosterState) return;
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const st = window.SovCommandEngine.getCoalitionRosterState();
      const mode = st.mode || "3v3";
      const optsHtml = pool.map(c =>
        '<option value="' + c.id + '">' +
        (c.isCustom ? "★ " : "") + c.degree + "° " + c.name.replace(/^\d+°\s*/, "").slice(0, 20) +
        " [" + c.modality.replace("PHYSICAL_", "").slice(0, 7) + " • " + (c.eloRating || 1650) + "]" +
        '</option>'
      ).join("");

      for (let i = 0; i < 3; i++) {
        const selA = document.getElementById("rosterSelect_A" + i);
        const selB = document.getElementById("rosterSelect_B" + i);
        if (selA) {
          selA.innerHTML = optsHtml;
          if (pool.some(c => c.id === st.rosterA[i])) selA.value = st.rosterA[i];
        }
        if (selB) {
          selB.innerHTML = optsHtml;
          if (pool.some(c => c.id === st.rosterB[i])) selB.value = st.rosterB[i];
        }
      }

      const showSlot2 = mode === "2v2" || mode === "3v3";
      const showSlot3 = mode === "3v3";
      const setDisp = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? "flex" : "none";
      };
      setDisp("rosterSlotRow_A1", showSlot2);
      setDisp("rosterSlotRow_B1", showSlot2);
      setDisp("rosterSlotRow_A2", showSlot3);
      setDisp("rosterSlotRow_B2", showSlot3);

      ["1v1", "2v2", "3v3"].forEach(m => {
        const b = document.getElementById("btnRosterMode_" + m);
        if (b) b.classList.toggle("active", m === mode);
      });

      const resolved = window.SovCommandEngine.resolveActiveRosterTeams(mode);
      const badgeA = document.getElementById("rosterARecordBadge");
      const badgeB = document.getElementById("rosterBRecordBadge");
      const winsA = mode === "2v2" ? (st.rosterAWins2v2 || 8) : (st.rosterAWins3v3 || 14);
      const winsB = mode === "2v2" ? (st.rosterBWins2v2 || 3) : (st.rosterBWins3v3 || 4);
      if (badgeA) {
        badgeA.textContent = mode + ": " + winsA + "W–" + winsB + "L • " + resolved.synergyA.mult.toFixed(2) + "x";
      }
      if (badgeB) {
        badgeB.textContent = mode + ": " + winsB + "W–" + winsA + "L • " + resolved.synergyB.mult.toFixed(2) + "x";
      }
    }

    function readCurrentForgeClassForm(overrideId, forceCustom) {
      const deg = parseFloat(document.getElementById("dbClassDegreeInput")?.value) || 15;
      const ocScore = parseFloat(document.getElementById("dbClassOrderChaosSlider")?.value || "-75");
      const geo = window.SovCommandEngine.resolveDegreeGeometry(deg, ocScore);
      const pol = document.getElementById("dbClassPolaritySelect")?.value || geo.polarity;

      return {
        id: overrideId || state.selectedDatabankClassId || ("DB_CUSTOM_" + Math.round(geo.baseDeg)),
        degree: deg,
        name: (document.getElementById("dbClassNameInput")?.value || (geo.baseDeg + "° " + geo.domain60.modality)).trim(),
        signatureCommand: (document.getElementById("forgeCmdVerb")?.value || "DEFEND").trim().toUpperCase(),
        domain60Id: geo.domain60.id,
        domain60Name: geo.domain60.shortLabel,
        coreArchetype: geo.domain60.coreArchetype,
        modality: geo.domain60.modality,
        attribute: geo.domain60.primaryAttribute,
        polarity: pol,
        alignment: ocScore <= 0 ? "ORDER" : "CHAOS",
        orderChaosScore: ocScore,
        weaponId: document.getElementById("dbClassWeaponSelect")?.value || "WPN_01_BADR_SHAMSHIR",
        armorId: document.getElementById("dbClassArmorSelect")?.value || "ARM_01_JAWSHAN_HEAVY_PLATE",
        spellId: document.getElementById("dbClassSpellSelect")?.value || "SPL_05_BADR_313_AEGIS_DOME",
        potionId: document.getElementById("dbClassPotionSelect")?.value || "POT_01_BLESSED_VINEGAR_ELIXIR",
        inventoryId: document.getElementById("dbClassInventorySelect")?.value || "INV_01_32PT_ASTROLABE",
        arcDegrees: parseFloat(document.getElementById("forgeCmdArcDeg")?.value) || 180,
        orbitRadiusPi: parseFloat(document.getElementById("forgeCmdOrbitPi")?.value) || 2.00,
        statWeightPi: parseFloat(document.getElementById("dbClassStatWeightPi")?.value) || 7.54,
        isCustom: forceCustom != null ? forceCustom : undefined
      };
    }

    function renderArchetypeDegreeWheelCanvas(previewMetricsOverride) {
      const canvas = document.getElementById("archetypeDegreeWheelCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const previewMetrics = previewMetricsOverride || state.lastPreviewMetrics;
      if (previewMetricsOverride) state.lastPreviewMetrics = previewMetricsOverride;

      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#04070E");
      bg.addColorStop(1, "#091122");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = 152;
      const cy = 152;
      const R_OUTER = 122;
      const R_MID = 86;
      const R_INNER = 48;

      const domains = window.SOV_EQUILATERAL_60_DOMAINS || [];
      const anim = state.rosterAnim;

      // 1. Draw 6 Equilateral 60° Combat Domains
      domains.forEach(d => {
        const startRad = (d.startDeg - 90) * DEG_TO_RAD;
        const endRad = (d.endDeg - 90) * DEG_TO_RAD;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R_OUTER, startRad, endRad);
        ctx.closePath();
        ctx.fillStyle = d.color + "1C";
        ctx.fill();
        ctx.strokeStyle = d.color + "77";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const midRad = ((d.startDeg + 30) - 90) * DEG_TO_RAD;
        const lx = cx + Math.cos(midRad) * (R_OUTER + 15);
        const ly = cy + Math.sin(midRad) * (R_OUTER + 15);
        ctx.fillStyle = d.color;
        ctx.font = "bold 8px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(d.modality.replace("PHYSICAL_", "").replace("_ALCHEMICAL", ""), lx, ly);
        ctx.restore();
      });

      // 2. Concentric Polarity Rings
      [R_INNER, R_MID, R_OUTER].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Draw 24 Dominant 15° Spokes & Static Sector Markers
      for (let s = 1; s <= 24; s++) {
        const deg = s * 15;
        const rad = (deg - 90) * DEG_TO_RAD;
        const xOut = cx + Math.cos(rad) * R_OUTER;
        const yOut = cy + Math.sin(rad) * R_OUTER;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * 16, cy + Math.sin(rad) * 16);
        ctx.lineTo(xOut, yOut);
        ctx.strokeStyle = (deg % 60 === 0) ? "rgba(253, 230, 138, 0.55)" : "rgba(148, 163, 184, 0.16)";
        ctx.lineWidth = (deg % 60 === 0) ? 1.4 : 0.7;
        ctx.stroke();

        const nr = R_OUTER - 7;
        const nx = cx + Math.cos(rad) * nr;
        const ny = cy + Math.sin(rad) * nr;
        ctx.beginPath();
        ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = (s % 2 === 1) ? "rgba(110, 231, 183, 0.55)" : "rgba(244, 63, 94, 0.55)";
        ctx.fill();
      }

      // 4. Highlight Active Forged Class Degree Vector (Subtle Gold Reference Ray)
      if (previewMetrics) {
        const deg = previewMetrics.geo.baseDeg;
        const centerRad = (deg - 90) * DEG_TO_RAD;
        const vx = cx + Math.cos(centerRad) * R_OUTER;
        const vy = cy + Math.sin(centerRad) * R_OUTER;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vx, vy);
        ctx.strokeStyle = "rgba(253, 230, 138, 0.45)";
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 5. LIVE 60 FPS ANIMATED 2v2 / 3v3 ROSTER-VS-ROSTER BATTLE LAYER
      if (anim) {
        // 5A. Draw Rotating Team Formation Chords (2v2 Pincer Axis or 3v3 Equilateral Triangle)
        const drawAnimatedRosterChords = (fighters, strokeCol, fillCol) => {
          const alive = fighters.filter(f => f.hp > 0);
          if (alive.length === 0) return;
          ctx.save();
          ctx.beginPath();
          alive.forEach((f, idx) => {
            const rad = (f.currentDeg - 90) * DEG_TO_RAD;
            const px = cx + Math.cos(rad) * f.orbitRadiusPx;
            const py = cy + Math.sin(rad) * f.orbitRadiusPx;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          if (alive.length > 1) ctx.closePath();
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = 2.4;
          ctx.stroke();
          if (alive.length >= 3) {
            ctx.fillStyle = fillCol;
            ctx.fill();
          }
          ctx.restore();
        };

        drawAnimatedRosterChords(anim.fightersB, "rgba(244, 63, 94, 0.88)", "rgba(244, 63, 94, 0.14)");
        drawAnimatedRosterChords(anim.fightersA, "rgba(16, 185, 129, 0.95)", "rgba(16, 185, 129, 0.18)");

        // 5B. Draw Expanding 360° (2π) Completion Shockwaves
        anim.shockwaves.forEach(sw => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = Math.max(0, sw.alpha);
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        });

        // 5C. Draw Flying Projectiles & Spell Beams between Roster A & Roster B
        anim.projectiles.forEach(pr => {
          const px = pr.x1 + (pr.x2 - pr.x1) * pr.progress;
          const py = pr.y1 + (pr.y2 - pr.y1) * pr.progress;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pr.x1 + (pr.x2 - pr.x1) * Math.max(0, pr.progress - 0.22), pr.y1 + (pr.y2 - pr.y1) * Math.max(0, pr.progress - 0.22));
          ctx.lineTo(px, py);
          ctx.strokeStyle = pr.color;
          ctx.lineWidth = 2.6;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 3.8, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.restore();
        });

        // 5D. Draw Orbiting Roster A & Roster B Fighters with Weapon Sweep Cones & HP Bars
        const allFighters = anim.fightersA.concat(anim.fightersB);
        allFighters.forEach(f => {
          const rad = (f.currentDeg - 90) * DEG_TO_RAD;
          const fx = cx + Math.cos(rad) * f.orbitRadiusPx;
          const fy = cy + Math.sin(rad) * f.orbitRadiusPx;
          f.screenX = fx;
          f.screenY = fy;

          const isDead = f.hp <= 0;
          ctx.save();
          if (isDead) ctx.globalAlpha = 0.32;

          // Active Weapon Sweep Cone when striking
          if (f.swingFlash > 0 && !isDead) {
            const halfArc = Math.min(75, (f.metrics.totalArcDeg || 150) * 0.28) * DEG_TO_RAD;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.arc(fx, fy, 26, f.targetRad - halfArc, f.targetRad + halfArc);
            ctx.closePath();
            ctx.fillStyle = f.team === "A" ? "rgba(16, 185, 129, 0.36)" : "rgba(244, 63, 94, 0.36)";
            ctx.fill();
          }

          // 360° (2π) Revolution Progress Outer Halo around Fighter Node
          const revRatio = Math.min(1, (f.revProgressDeg || 0) / 360);
          ctx.beginPath();
          ctx.arc(fx, fy, 11.5, -Math.PI / 2, -Math.PI / 2 + revRatio * Math.PI * 2);
          ctx.strokeStyle = "#FDE68A";
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Fighter Core Token
          ctx.beginPath();
          ctx.arc(fx, fy, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = f.team === "A" ? "#059669" : "#E11D48";
          ctx.fill();
          ctx.strokeStyle = f.team === "A" ? "#6EE7B7" : "#FDA4AF";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Slot Label (A1, A2, A3 / B1, B2, B3)
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 8px Consolas, monospace";
          ctx.textAlign = "center";
          ctx.fillText(f.slotLabel, fx, fy + 3);

          // Overhead HP Bar
          const bw = 24;
          const bh = 3.5;
          const hpRatio = Math.max(0, Math.min(1, f.hp / Math.max(1, f.maxHp)));
          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.fillRect(fx - bw / 2, fy - 16, bw, bh);
          ctx.fillStyle = f.team === "A" ? "#10B981" : "#F43F5E";
          ctx.fillRect(fx - bw / 2, fy - 16, bw * hpRatio, bh);

          ctx.restore();
        });

        // 5E. Draw Floating Damage / 360° Finisher Callouts
        anim.floatingTexts.forEach(ft => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, ft.alpha);
          ctx.font = "bold 9.5px Consolas, monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = ft.color;
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        });
      }

      // 6. Right-Side Live Roster vs. Roster Scoreboard & Telemetry Panel (x = 300..632)
      const rx = 300;
      const rw = W - rx - 8;

      if (anim) {
        ctx.fillStyle = "rgba(8, 14, 28, 0.94)";
        ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
        ctx.lineWidth = 1;
        ctx.fillRect(rx, 8, rw, 192);
        ctx.strokeRect(rx, 8, rw, 192);

        ctx.fillStyle = "#FDE68A";
        ctx.font = "bold 10px Consolas, monospace";
        ctx.fillText(
          "⭕ LIVE " + anim.mode + " ROSTER VS ROSTER (" + (anim.finished ? (anim.teamAWon ? "🏆 ALPHA WON" : "⚔️ OMEGA WON") : "CLASHING") + ")",
          rx + 7,
          23
        );

        // Team A Roster Vitals on Canvas
        ctx.fillStyle = "#6EE7B7";
        ctx.font = "bold 9px Consolas, monospace";
        ctx.fillText("🛡️ ROSTER ALPHA (" + anim.synergyA.mult.toFixed(2) + "x • ⭕" + anim.completedCirclesA + " Circles)", rx + 7, 38);

        anim.fightersA.forEach((f, idx) => {
          const y = 51 + idx * 21;
          const hpPct = Math.max(0, Math.min(1, f.hp / Math.max(1, f.maxHp)));
          ctx.fillStyle = "#E2E8F0";
          ctx.font = "8.8px Consolas, monospace";
          ctx.fillText(
            f.slotLabel + " " + Math.round(f.currentDeg) + "° " + f.cls.name.replace(/^\d+°\s*/, "").slice(0, 15),
            rx + 7,
            y
          );
          // HP bar
          ctx.fillStyle = "rgba(15,23,42,0.95)";
          ctx.fillRect(rx + 152, y - 7, 96, 7);
          ctx.fillStyle = "#10B981";
          ctx.fillRect(rx + 152, y - 7, 96 * hpPct, 7);
          ctx.fillStyle = "#FDE68A";
          ctx.fillText(Math.round(f.hp) + "HP ⭕" + f.completed360s, rx + 253, y);
        });

        // Team B Roster Vitals on Canvas
        const yBHeader = 118;
        ctx.fillStyle = "#FDA4AF";
        ctx.font = "bold 9px Consolas, monospace";
        ctx.fillText("⚔️ ROSTER OMEGA (" + anim.synergyB.mult.toFixed(2) + "x • ⭕" + anim.completedCirclesB + " Circles)", rx + 7, yBHeader);

        anim.fightersB.forEach((f, idx) => {
          const y = yBHeader + 13 + idx * 21;
          const hpPct = Math.max(0, Math.min(1, f.hp / Math.max(1, f.maxHp)));
          ctx.fillStyle = "#E2E8F0";
          ctx.font = "8.8px Consolas, monospace";
          ctx.fillText(
            f.slotLabel + " " + Math.round(f.currentDeg) + "° " + f.cls.name.replace(/^\d+°\s*/, "").slice(0, 15),
            rx + 7,
            y
          );
          ctx.fillStyle = "rgba(15,23,42,0.95)";
          ctx.fillRect(rx + 152, y - 7, 96, 7);
          ctx.fillStyle = "#F43F5E";
          ctx.fillRect(rx + 152, y - 7, 96 * hpPct, 7);
          ctx.fillStyle = "#FDE68A";
          ctx.fillText(Math.round(f.hp) + "HP ⭕" + f.completed360s, rx + 253, y);
        });
      }

      // 7. Bottom-Right Forged Class Preview Box (y = 205..302)
      if (previewMetrics) {
        const g = previewMetrics.geo;
        const yBase = 205;
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
        ctx.lineWidth = 1;
        ctx.fillRect(rx, yBase, rw, 98);
        ctx.strokeRect(rx, yBase, rw, 98);

        ctx.fillStyle = "#6EE7B7";
        ctx.font = "bold 9.5px Consolas, monospace";
        ctx.fillText("FORGED CLASS: " + previewMetrics.cls.name.slice(0, 30), rx + 7, yBase + 15);

        ctx.fillStyle = "#FDE68A";
        ctx.font = "9px Consolas, monospace";
        ctx.fillText(
          "θ=" + g.inputDegree + "° | ×3.14=" + g.degTimes314 + "° | ×π=" + g.degTimesPi + "°",
          rx + 7,
          yBase + 30
        );
        ctx.fillStyle = "#93C5FD";
        ctx.fillText(
          "Dom: " + g.domain60.modality + " | " + g.polarity.split("_")[0] + " | " + g.alignment + " (" + g.orderChaosScore + ")",
          rx + 7,
          yBase + 44
        );
        ctx.fillStyle = "#E2E8F0";
        ctx.fillText(
          "Wpn: " + previewMetrics.wpn.name.slice(0, 32),
          rx + 7,
          yBase + 58
        );
        ctx.fillStyle = "#C084FC";
        ctx.fillText(
          "Spl: " + previewMetrics.spl.name.slice(0, 27) + " | Pot: +" + previewMetrics.pot.healPi + "π",
          rx + 7,
          yBase + 72
        );
        ctx.fillStyle = "#6EE7B7";
        ctx.fillText(
          "Power: " + previewMetrics.compositePowerScore + "π | Off: " + previewMetrics.rawOffensePi + " | Def: " + previewMetrics.rawDefensePi,
          rx + 7,
          yBase + 87
        );
      }
    }

    function renderDatabankArchetypePoolTable() {
      const tbody = document.getElementById("databankArchetypePoolTableBody");
      if (!tbody || !window.SovCommandEngine) return;
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const filter = state.databankDomainFilter || "ALL";
      const filtered = pool.filter(c => filter === "ALL" || c.domain60Id === filter);
      const rosterSt = window.SovCommandEngine.getCoalitionRosterState ? window.SovCommandEngine.getCoalitionRosterState() : { rosterA: [], rosterB: [] };

      const badgeEl = document.getElementById("dbClassPersistBadge");
      if (badgeEl) {
        badgeEl.textContent = "PERSISTENT DATABANK POOL (" + pool.length + " CLASSES • 24×15° + CUSTOM)";
      }

      tbody.innerHTML = filtered.map(c => {
        const m = window.SovCommandEngine.computeClassProceduralMetrics(c);
        const isSel = c.id === state.selectedDatabankClassId;
        const inA = (rosterSt.rosterA || []).indexOf(c.id);
        const inB = (rosterSt.rosterB || []).indexOf(c.id);
        const polColor = (c.polarity || "").indexOf("+1") === 0 ? "#38BDF8" : "#C084FC";
        const alignColor = c.alignment === "ORDER" ? "#6EE7B7" : "#FDA4AF";

        return '<tr style="' + (isSel ? 'background:rgba(16,185,129,0.12);' : '') + '">' +
          '<td style="font-family:Consolas,monospace;font-size:0.72rem;">' +
            '<strong style="color:#FDE68A;font-size:0.82rem;">' + c.degree + '°</strong> ' +
            '<span style="color:#94A3B8;">(#' + c.sectorIndex + '/24)</span><br/>' +
            '<span style="color:#6EE7B7;">×3.14 = <strong>' + c.degTimes314 + '°</strong></span><br/>' +
            '<span style="color:#38BDF8;">×π = <strong>' + c.degTimesPi + '°</strong> (' + c.radianPi + 'π)</span>' +
          '</td>' +
          '<td>' +
            '<strong style="color:#FFFFFF;">' + c.name + '</strong> ' +
            (c.isCustom ? '<span class="badge badge-gold">CUSTOM</span> ' : '') +
            (inA >= 0 ? '<span class="badge badge-emerald" style="font-size:0.6rem;">ROSTER A' + (inA + 1) + '</span> ' : '') +
            (inB >= 0 ? '<span class="badge badge-crimson" style="font-size:0.6rem;">ROSTER B' + (inB + 1) + '</span> ' : '') + '<br/>' +
            '<span class="badge badge-emerald" style="font-size:0.65rem;">' + c.domain60Name + '</span> ' +
            '<code style="font-size:0.68rem;color:#FDE68A;">[' + c.signatureCommand + ']</code>' +
          '</td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.7rem;">' +
            '<span style="color:#FDE68A;">' + c.attribute + '</span><br/>' +
            '<span style="color:' + polColor + ';">' + c.polarity + '</span><br/>' +
            '<span style="color:' + alignColor + ';font-weight:700;">' + c.alignment + ' (' + c.orderChaosScore + ')</span>' +
          '</td>' +
          '<td style="font-size:0.69rem;line-height:1.38;">' +
            '<div>⚔️ <strong style="color:#FDE68A;">' + m.wpn.name.split("(")[0].trim() + '</strong> (' + m.wpn.weightPi + 'π)</div>' +
            '<div>🛡️ <span style="color:#6EE7B7;">' + m.arm.name.split("(")[0].trim() + '</span> (' + m.arm.mitigationPi + 'π)</div>' +
            '<div>✨ <span style="color:#C084FC;">' + m.spl.name.split("(")[0].trim() + '</span> | 🧪 ' + m.pot.name.split(" ")[0] + ' | 🧭 ' + m.inv.name.split(" ")[0] + '</div>' +
          '</td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.71rem;">' +
            '<strong style="color:#6EE7B7;">Pwr: ' + m.compositePowerScore + 'π</strong><br/>' +
            '<span style="color:#FDE68A;">Off:' + m.rawOffensePi + ' | Def:' + m.rawDefensePi + '</span><br/>' +
            '<span style="color:#93C5FD;">Δ' + m.totalArcDeg + '° @ r=' + (c.orbitRadiusPi || 2.0).toFixed(2) + 'π</span>' +
          '</td>' +
          '<td style="font-family:Consolas,monospace;font-size:0.71rem;">' +
            '<strong style="color:#6EE7B7;">' + (c.wins || 0) + 'W</strong> – <strong style="color:#FDA4AF;">' + (c.losses || 0) + 'L</strong><br/>' +
            '<span style="color:#FDE68A;">ELO: ' + (c.eloRating || 1650) + '</span><br/>' +
            '<span style="color:#38BDF8;">⭕ ' + (c.completed360Count || 0) + ' Circles</span>' +
          '</td>' +
          '<td>' +
            '<div class="btn-row">' +
              '<button class="btn btn-sm" onclick="window.SovGame.selectDatabankClassForEdit(\'' + c.id + '\')" title="Load into CRUD Forge">✏️ Forge</button>' +
              '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.assignClassToRoster(\'A\', \'' + c.id + '\')" title="Add to Persistent Allied Roster A">+Roster A</button>' +
              '<button class="btn btn-sm btn-crimson" onclick="window.SovGame.assignClassToRoster(\'B\', \'' + c.id + '\')" title="Add to Persistent Opposition Roster B">+Roster B</button>' +
              '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.startAnimatedRosterClash(\'2v2\', \'' + c.id + '\')" title="Animate 2v2 Roster Clash with this Class">🛡️ 2v2</button>' +
              '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.startAnimatedRosterClash(\'3v3\', \'' + c.id + '\')" title="Animate 3v3 Roster Clash with this Class">🔺 3v3</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join("");
    }

    G.selectDatabankClassForEdit = function (classId) {
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const found = pool.find(c => c.id === classId) || pool[0];
      if (!found) return;
      state.selectedDatabankClassId = found.id;

      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
      setVal("dbClassTemplateSelect", found.id);
      setVal("dbClassNameInput", found.name);
      setVal("forgeCmdVerb", found.signatureCommand || "DEFEND");
      setVal("dbClassDegreeInput", found.degree);
      setVal("dbClassDegreeSlider", Math.min(360, Math.max(1, Math.round(found.degree))));
      setVal("dbClassDomainSelect", found.domain60Id);
      setVal("dbClassPolaritySelect", found.polarity);
      setVal("dbClassOrderChaosSlider", found.orderChaosScore != null ? found.orderChaosScore : -75);
      setVal("dbClassWeaponSelect", found.weaponId);
      setVal("dbClassArmorSelect", found.armorId);
      setVal("dbClassSpellSelect", found.spellId);
      setVal("dbClassPotionSelect", found.potionId);
      setVal("dbClassInventorySelect", found.inventoryId);
      setVal("forgeCmdArcDeg", found.arcDegrees || 180);
      setVal("forgeCmdOrbitPi", found.orbitRadiusPi || 2.00);
      setVal("dbClassStatWeightPi", found.statWeightPi || 7.54);

      G.previewForgedClassLive();
    };

    G.previewForgedClassLive = function () {
      if (!window.SovCommandEngine) return;
      const draft = readCurrentForgeClassForm();
      const m = window.SovCommandEngine.computeClassProceduralMetrics(draft);
      const g = m.geo;

      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setTxt("roDegSector", g.inputDegree + "° (#" + g.sectorIndex + "/24)");
      setTxt("roDeg314", g.degTimes314 + "°");
      setTxt("roDegPi", g.degTimesPi + "°");
      setTxt("roRadPi", g.radianPi + "π rad");
      setTxt("roSpinor720", g.spinor720Deg + "° (4π)");

      const domSel = document.getElementById("dbClassDomainSelect");
      if (domSel) domSel.value = g.domain60.id;

      const badge = document.getElementById("dbClassAlignmentBadge");
      if (badge) {
        badge.textContent = g.alignment + " (" + (g.orderChaosScore > 0 ? "+" : "") + g.orderChaosScore + ")";
        badge.style.color = g.alignment === "ORDER" ? "#6EE7B7" : "#FDA4AF";
      }

      const bar = document.getElementById("dbClassLiveMetricsBar");
      if (bar) {
        bar.innerHTML =
          '<strong style="color:#FDE68A;">[' + g.domain60.shortLabel + ']</strong> • ' +
          'Composite: <strong style="color:#6EE7B7;">' + m.compositePowerScore + 'π</strong> • ' +
          'Offense: <strong>' + m.rawOffensePi + 'π</strong> • ' +
          'Defense: <strong>' + m.rawDefensePi + 'π</strong> • ' +
          'Total Arc: <strong style="color:#38BDF8;">Δ' + m.totalArcDeg + '°</strong> • ' +
          'Speed: <strong>ω=' + m.angularSpeedDeg + '°/s</strong> • ' +
          'SPC Δσ: <strong>' + m.spcStabilityDelta + 'σ</strong>';
      }

      renderArchetypeDegreeWheelCanvas(m);
    };

    G.syncDegreeInputFromSlider = function (val) {
      const num = parseFloat(val) || 15;
      const inp = document.getElementById("dbClassDegreeInput");
      if (inp) inp.value = num;
      const geo = window.SovCommandEngine.resolveDegreeGeometry(num);
      const polSel = document.getElementById("dbClassPolaritySelect");
      if (polSel) polSel.value = geo.polarity;
      G.previewForgedClassLive();
    };

    G.syncDegreeSliderFromInput = function (val) {
      const num = parseFloat(val) || 15;
      const sld = document.getElementById("dbClassDegreeSlider");
      if (sld) sld.value = Math.min(360, Math.max(1, Math.round(num % 360 || 360)));
      const geo = window.SovCommandEngine.resolveDegreeGeometry(num);
      const polSel = document.getElementById("dbClassPolaritySelect");
      if (polSel) polSel.value = geo.polarity;
      G.previewForgedClassLive();
    };

    G.stepForgedClassDegree = function (delta) {
      const cur = parseFloat(document.getElementById("dbClassDegreeInput")?.value) || 15;
      let next = cur + delta;
      if (next <= 0) next += 360;
      if (next > 1130.4) next = 360;
      const inp = document.getElementById("dbClassDegreeInput");
      if (inp) inp.value = +next.toFixed(1);
      G.syncDegreeSliderFromInput(next);
    };

    G.snapForgedClassDegreeTo15 = function () {
      const cur = parseFloat(document.getElementById("dbClassDegreeInput")?.value) || 15;
      const snapped = Math.max(15, Math.min(360, Math.round(cur / 15) * 15 || 15));
      const inp = document.getElementById("dbClassDegreeInput");
      if (inp) inp.value = snapped;
      G.syncDegreeSliderFromInput(snapped);
      // Load matching canonical 15° template if available
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const match = pool.find(c => Math.abs(c.degree - snapped) < 0.5);
      if (match) {
        G.selectDatabankClassForEdit(match.id);
      }
    };

    G.onDomainSelectChange = function (domainId) {
      const domains = window.SOV_EQUILATERAL_60_DOMAINS || [];
      const d = domains.find(x => x.id === domainId);
      if (!d) return;
      const targetDeg = d.startDeg + 15;
      const inp = document.getElementById("dbClassDegreeInput");
      if (inp) inp.value = targetDeg;
      G.syncDegreeSliderFromInput(targetDeg);
    };

    G.saveForgedArchetypeClass = function () {
      const formObj = readCurrentForgeClassForm(state.selectedDatabankClassId);
      const saved = window.SovCommandEngine.upsertArchetypeClassTemplate(formObj);
      state.selectedDatabankClassId = saved.id;
      refreshDatabankTemplateDropdown();
      renderDatabankArchetypePoolTable();
      G.previewForgedClassLive();
      G.triggerDatabankCoalitionBattle("3v3", saved.id);
      addLog("💾 Saved Archetype Class [" + saved.name + "] (" + saved.degree + "° | ×3.14=" + saved.degTimes314 + "° | ×π=" + saved.degTimesPi + "°) to Persistent Databank Pool!", "#6EE7B7");
    };

    G.createNewCustomArchetypeClass = function () {
      const newId = "DB_CUSTOM_" + Math.round(parseFloat(document.getElementById("dbClassDegreeInput")?.value) || 15) + "DEG_" + Math.floor(100 + Math.random() * 899);
      const formObj = readCurrentForgeClassForm(newId, true);
      if (formObj.name.indexOf("[Custom]") === -1 && formObj.name.indexOf("[Forged]") === -1) {
        formObj.name += " [Forged]";
      }
      const saved = window.SovCommandEngine.upsertArchetypeClassTemplate(formObj);
      state.selectedDatabankClassId = saved.id;
      refreshDatabankTemplateDropdown();
      renderDatabankArchetypePoolTable();
      G.selectDatabankClassForEdit(saved.id);
      G.triggerDatabankCoalitionBattle("3v3", saved.id);
      addLog("➕ Created New Custom Databank Class [" + saved.name + "] @ " + saved.degree + "° and entered it into the 2v2/3v3 Coalition Pool!", "#FDE68A");
    };

    G.cloneActiveArchetypeClass = function () {
      const cloned = window.SovCommandEngine.cloneArchetypeClassTemplate(state.selectedDatabankClassId);
      state.selectedDatabankClassId = cloned.id;
      refreshDatabankTemplateDropdown();
      renderDatabankArchetypePoolTable();
      G.selectDatabankClassForEdit(cloned.id);
      addLog("🧬 Cloned Archetype Class [" + cloned.name + "] in Persistent Databank Pool.", "#93C5FD");
    };

    G.deleteActiveArchetypeClass = function () {
      window.SovCommandEngine.deleteOrResetArchetypeClassTemplate(state.selectedDatabankClassId);
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      state.selectedDatabankClassId = pool[0]?.id || "DB_ARCH_015_AEGIS_WARDEN";
      refreshDatabankTemplateDropdown();
      renderDatabankArchetypePoolTable();
      G.selectDatabankClassForEdit(state.selectedDatabankClassId);
      addLog("🗑️ Reset / Deleted selected Databank Archetype Template.", "#FDA4AF");
    };

    G.resetDatabankPool = function () {
      window.SovCommandEngine.resetDatabankPoolToCanon();
      state.selectedDatabankClassId = "DB_ARCH_015_AEGIS_WARDEN";
      refreshDatabankTemplateDropdown();
      renderDatabankArchetypePoolTable();
      G.selectDatabankClassForEdit(state.selectedDatabankClassId);
      addLog("↺ Restored all 24 Canonical 15° Dominant Archetypes in the Databank Pool.", "#FDE68A");
    };

    G.filterDatabankPool = function (domainFilter) {
      state.databankDomainFilter = domainFilter;
      ["ALL", "DOM_01_DEFENDERS", "DOM_02_PHYSICAL_ATTACKERS", "DOM_03_RANGED", "DOM_04_SPELL", "DOM_05_SUPPORT", "DOM_06_SOVEREIGN"].forEach(k => {
        const b = document.getElementById("dbFilter_" + k);
        if (b) b.classList.toggle("active", k === domainFilter);
      });
      renderDatabankArchetypePoolTable();
    };

    G.spawnForgedClassInArena = function (classIdOverride) {
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const cls = pool.find(c => c.id === (classIdOverride || state.selectedDatabankClassId)) || pool[0];
      if (!cls) return;
      const m = window.SovCommandEngine.computeClassProceduralMetrics(cls);
      const rPi = cls.orbitRadiusPi || 2.00;
      const deg = cls.degree % 360;
      const rad = deg * DEG_TO_RAD;

      state.units.push({
        idx: state.units.length,
        profileId: cls.id,
        name: cls.name + " (" + cls.degree + "°)",
        archetype: cls.modality + " • " + cls.alignment,
        coreArchetype: cls.coreArchetype,
        form: cls.modality === "SPELL_ALCHEMICAL" || cls.modality === "SOVEREIGN_HYBRID" ? "Floating Aura" : "Armored Stride",
        verb: cls.signatureCommand || "DEFEND",
        gambit: cls.signatureCommand + "(Δ" + m.totalArcDeg + "°) -> " + m.spl.name,
        statW: cls.statWeightPi,
        armorW: m.arm.weightPi,
        weaponW: m.wpn.weightPi,
        vfxType: m.spl.vfx || "SWORD_SWIPE_AND_SPARKLES",
        tone: cls.polarity + " • " + cls.alignment,
        tradeSkill: m.wpn.name.split("(")[0].trim() + " + " + m.pot.name.split(" ")[0],
        experience: cls.combatStyleDesc,
        hp: Math.round(1200 + m.rawDefensePi * 3.14),
        maxHp: Math.round(1200 + m.rawDefensePi * 3.14),
        atk: Math.round(m.rawOffensePi),
        def: Math.round(m.rawDefensePi),
        isEnemy: false,
        isFloating: cls.modality === "SPELL_ALCHEMICAL" || cls.modality === "SOVEREIGN_HYBRID",
        isMounted: cls.modality === "PHYSICAL_ATTACKER",
        empowered: true,
        orbitRadiusPi: rPi,
        customOrbitPi: rPi,
        angleDeg: deg,
        arcDegrees: m.totalArcDeg,
        angularVelocityDeg: m.angularSpeedDeg,
        revProgressDeg: 0,
        completedCircles: 0,
        lastIncidenceDeg: 135,
        lastTorquePi: m.compositePowerScore,
        lastProceduralDmg: Math.round(m.rawOffensePi * 0.65),
        gx: Math.cos(rad) * rPi * 1.18,
        gy: Math.sin(rad) * rPi * 1.18,
        conversions: cls.wins || 5,
        activeResonance: 1.45,
        resonanceTier: "PRIME_RESONANCE"
      });
      state.selectedUnitIndex = state.units.length - 1;
      syncInspectorToSelectedUnit();
      renderCircularTelemetryTable();
      vp.spawnCircularShockwave(rPi, deg, 95, "#10B981", m.totalArcDeg, deg);
      addLog("🚀 Spawned Databank Class [" + cls.name + "] (" + cls.degree + "° | " + m.wpn.name.split("(")[0].trim() + ") onto Ring r=" + rPi.toFixed(2) + "π!", "#6EE7B7");
    };

    /* ========================================================================
     * LIVE 60 FPS ANIMATED 2v2 & 3v3 ROSTER VS. ROSTER BATTLE ENGINE
     * Spawns Team A & Team B from Persistent Databank Rosters onto the 360°
     * Circular Arena AND Main 2.5D Isometric Rings, animates orbital movement,
     * 2v2 Pincer Chords, 3v3 Equilateral Triangles, weapon sweeps, spell beams,
     * 360° Finisher shockwaves, and persists outcomes to localStorage.
     * ======================================================================== */
    function renderRosterVitalsAndLedgerUI() {
      const anim = state.rosterAnim;
      const strip = document.getElementById("databankRosterVitalsStrip");
      const box = document.getElementById("databankCoalitionLiveBox");
      const rosterSt = window.SovCommandEngine.getCoalitionRosterState ? window.SovCommandEngine.getCoalitionRosterState() : null;

      if (strip && anim) {
        const renderTeamColumn = (fighters, teamLabel, borderCol, barCol) => {
          return '<div style="background:rgba(9,15,28,0.92);border:1px solid ' + borderCol + ';border-radius:6px;padding:0.32rem 0.45rem;">' +
            '<div style="font-size:0.66rem;font-weight:800;color:' + barCol + ';margin-bottom:0.22rem;display:flex;justify-content:space-between;">' +
              '<span>' + teamLabel + '</span>' +
              '<span>⭕ ' + (fighters === anim.fightersA ? anim.completedCirclesA : anim.completedCirclesB) + ' Circles</span>' +
            '</div>' +
            fighters.map(f => {
              const hpPct = Math.max(0, Math.min(100, Math.round((f.hp / Math.max(1, f.maxHp)) * 100)));
              const revPct = Math.max(0, Math.min(100, Math.round(((f.revProgressDeg || 0) / 360) * 100)));
              return '<div style="margin-bottom:0.22rem;font-family:Consolas,monospace;font-size:0.64rem;">' +
                '<div style="display:flex;justify-content:space-between;color:#E2E8F0;">' +
                  '<span><strong style="color:#FDE68A;">' + f.slotLabel + '</strong> ' + Math.round(f.currentDeg) + '° ' + f.cls.name.replace(/^\d+°\s*/, "").slice(0, 16) + '</span>' +
                  '<span style="color:' + barCol + ';">' + Math.round(f.hp) + '/' + Math.round(f.maxHp) + ' HP (' + hpPct + '%)</span>' +
                '</div>' +
                '<div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:2px 0;">' +
                  '<div style="height:100%;width:' + hpPct + '%;background:' + barCol + ';transition:width 0.1s linear;"></div>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:0.6rem;color:#94A3B8;">' +
                  '<span>⚔️ ' + f.metrics.wpn.name.split(" ")[0] + ' + ✨ ' + f.metrics.spl.name.split(" ")[0] + '</span>' +
                  '<span style="color:#FDE68A;">360° Meter: ' + revPct + '%</span>' +
                '</div>' +
              '</div>';
            }).join("") +
          '</div>';
        };

        strip.innerHTML =
          renderTeamColumn(anim.fightersA, "🛡️ ROSTER ALPHA (" + anim.mode + " • " + anim.synergyA.mult.toFixed(2) + "x)", "rgba(16,185,129,0.4)", "#10B981") +
          renderTeamColumn(anim.fightersB, "⚔️ ROSTER OMEGA (" + anim.mode + " • " + anim.synergyB.mult.toFixed(2) + "x)", "rgba(244,63,94,0.4)", "#F43F5E");
      }

      if (box && anim) {
        const hist = (rosterSt && Array.isArray(rosterSt.matchHistory)) ? rosterSt.matchHistory.slice(0, 4) : [];
        const histHtml = hist.map(h =>
          '<div style="color:#93C5FD;font-family:Consolas,monospace;font-size:0.64rem;">' +
            '💾 [Saved Match #' + h.matchNo + ' • ' + h.mode + '] ' +
            '<strong style="color:' + (h.winner === "ROSTER_A" ? "#6EE7B7" : "#FDA4AF") + ';">' + (h.winner === "ROSTER_A" ? "ALPHA WON" : "OMEGA WON") + ' (' + h.winProbPct + '%)</strong> — ' +
            h.teamANames + ' vs ' + h.teamBNames + ' (⭕' + h.circlesA + ':' + h.circlesB + ')' +
          '</div>'
        ).join("");

        box.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:3px;margin-bottom:4px;">' +
            '<span style="color:#FDE68A;font-weight:700;">⭕ ' + anim.mode + ' ANIMATED ROSTER CLASH (' +
              (anim.finished ? (anim.teamAWon ? '🏆 ROSTER ALPHA VICTORY — PERSISTED' : '⚔️ ROSTER OMEGA VICTORY — PERSISTED') : '⚡ LIVE ORBITAL COMBAT IN PROGRESS') +
            ')</span>' +
            '<span style="color:#38BDF8;font-family:Consolas,monospace;">Mean τ=' + anim.meanTorqueA.toFixed(1) + 'π | Saved Matches: ' + (rosterSt ? rosterSt.totalMatchesPersisted : 29) + '</span>' +
          '</div>' +
          '<div style="margin-bottom:4px;">' +
            anim.roundLog.slice(0, 4).map(line => '<div style="color:#CBD5E1;font-family:Consolas,monospace;font-size:0.65rem;">• ' + line + '</div>').join("") +
          '</div>' +
          '<div style="border-top:1px dashed rgba(212,175,55,0.28);padding-top:3px;">' +
            '<div style="font-size:0.64rem;color:#FDE68A;font-weight:700;">📜 Persistent Databank Roster Match History (localStorage):</div>' +
            histHtml +
          '</div>';
      }
    }

    function syncRosterFightersToMainArena(anim) {
      if (!anim) return;
      // Keep core castle units and replace/update active roster duelists on the 2.5D Concentric Rings
      state.units = state.units.filter(u => !u.isRosterClashUnit);
      const all = anim.fightersA.concat(anim.fightersB);
      all.forEach(f => {
        const rPi = f.orbitRadiusPi || 2.51;
        const rad = (f.currentDeg || 0) * DEG_TO_RAD;
        state.units.push({
          idx: state.units.length,
          isRosterClashUnit: true,
          rosterSlotLabel: f.slotLabel,
          profileId: f.cls.id,
          name: "[" + f.slotLabel + "] " + f.cls.name,
          archetype: f.cls.modality + " • " + f.cls.alignment,
          coreArchetype: f.cls.coreArchetype,
          form: f.cls.modality === "SPELL_ALCHEMICAL" || f.cls.modality === "SOVEREIGN_HYBRID" ? "Floating Aura" : "Armored Stride",
          verb: f.cls.signatureCommand || "ATTACK",
          gambit: f.cls.signatureCommand + " -> " + f.metrics.spl.name,
          statW: f.cls.statWeightPi,
          armorW: f.metrics.arm.weightPi,
          weaponW: f.metrics.wpn.weightPi,
          vfxType: f.metrics.spl.vfx || "SWORD_SWIPE_AND_SPARKLES",
          tone: f.cls.polarity,
          tradeSkill: f.metrics.wpn.name.split("(")[0].trim(),
          experience: f.cls.combatStyleDesc,
          hp: Math.round(f.hp),
          maxHp: Math.round(f.maxHp),
          atk: Math.round(f.metrics.rawOffensePi),
          def: Math.round(f.metrics.rawDefensePi),
          isEnemy: f.team === "B",
          isFloating: f.cls.modality === "SPELL_ALCHEMICAL" || f.cls.modality === "SOVEREIGN_HYBRID",
          isMounted: f.cls.modality === "PHYSICAL_ATTACKER",
          empowered: true,
          orbitRadiusPi: rPi,
          customOrbitPi: rPi,
          angleDeg: f.currentDeg,
          arcDegrees: f.metrics.totalArcDeg,
          angularVelocityDeg: f.angularSpeedDeg * (f.team === "B" ? -0.9 : 1.0),
          revProgressDeg: f.revProgressDeg || 0,
          completedCircles: f.completed360s || 0,
          lastIncidenceDeg: 135,
          lastTorquePi: f.metrics.compositePowerScore,
          lastProceduralDmg: Math.round(f.metrics.rawOffensePi * 0.6),
          gx: Math.cos(rad) * rPi * 1.18,
          gy: Math.sin(rad) * rPi * 1.18,
          conversions: f.cls.wins || 5,
          activeResonance: f.team === "A" ? anim.synergyA.mult : anim.synergyB.mult,
          resonanceTier: "PRIME_RESONANCE"
        });
      });
      renderCircularTelemetryTable();
    }

    G.startAnimatedRosterClash = function (modeStr, primaryClassId, silentLog) {
      if (!window.SovCommandEngine) return;
      const st = window.SovCommandEngine.getCoalitionRosterState();
      const mode = modeStr || st.mode || "3v3";
      window.SovCommandEngine.setCoalitionRosterMode(mode);

      if (primaryClassId) {
        window.SovCommandEngine.setCoalitionRosterSlot("A", 0, primaryClassId);
      }

      refreshPersistentRosterSelects();
      const resolved = window.SovCommandEngine.resolveActiveRosterTeams(mode);

      const buildFighter = (cls, m, idx, teamKey, synMult) => {
        const baseHp = Math.round((1250 + m.rawDefensePi * 3.14) * synMult);
        const radiiPx = [98, 74, 112];
        const radiiPi = [2.51, 1.85, 3.14];
        return {
          team: teamKey,
          slotIdx: idx,
          slotLabel: teamKey + (idx + 1),
          cls: cls,
          metrics: m,
          hp: baseHp,
          maxHp: baseHp,
          currentDeg: (cls.degree + (teamKey === "B" ? 15 : 0)) % 360,
          orbitRadiusPx: radiiPx[idx % radiiPx.length],
          orbitRadiusPi: cls.orbitRadiusPi || radiiPi[idx % radiiPi.length],
          angularSpeedDeg: Math.max(55, Math.min(185, m.angularSpeedDeg * 0.65)),
          revProgressDeg: 0,
          completed360s: 0,
          attackCooldown: 0.25 + idx * 0.18 + (teamKey === "B" ? 0.12 : 0),
          swingFlash: 0,
          targetRad: 0,
          screenX: 152,
          screenY: 152
        };
      };

      const fightersA = resolved.teamA.map((c, i) => buildFighter(c, resolved.metricsA[i], i, "A", resolved.synergyA.mult));
      const fightersB = resolved.teamB.map((c, i) => buildFighter(c, resolved.metricsB[i], i, "B", resolved.synergyB.mult));

      state.rosterAnim = {
        active: true,
        finished: false,
        mode: mode,
        teamA: resolved.teamA,
        teamB: resolved.teamB,
        synergyA: resolved.synergyA,
        synergyB: resolved.synergyB,
        fightersA: fightersA,
        fightersB: fightersB,
        projectiles: [],
        shockwaves: [],
        floatingTexts: [],
        roundLog: [
          "🚀 Launched Persistent " + mode + " Roster Clash: [" +
          fightersA.map(f => f.cls.degree + "° " + f.cls.name.replace(/^\d+°\s*/, "").split(" ")[0]).join(" + ") +
          "] vs [" +
          fightersB.map(f => f.cls.degree + "° " + f.cls.name.replace(/^\d+°\s*/, "").split(" ")[0]).join(" + ") + "]"
        ],
        completedCirclesA: 0,
        completedCirclesB: 0,
        sumTorqueA: 0,
        sumTorqueB: 0,
        strikesA: 0,
        strikesB: 0,
        meanTorqueA: 68.4,
        meanTorqueB: 62.1,
        elapsedSec: 0,
        cooldownAfterFinish: 0,
        teamAWon: true,
        winProbPct: 82.0
      };

      state.lastCoalitionResult = state.rosterAnim;
      syncRosterFightersToMainArena(state.rosterAnim);
      renderRosterVitalsAndLedgerUI();
      renderDatabankArchetypePoolTable();

      const statusRo = document.getElementById("rosterWheelStatusReadout");
      if (statusRo) {
        statusRo.textContent = "⭕ LIVE " + mode + " ROSTER VS ROSTER ANIMATING (" + fightersA.length + "v" + fightersB.length + " PERSISTENT DATABANK)";
      }

      if (!silentLog) {
        vp.spawnCircularShockwave(2.51, fightersA[0].currentDeg, 105, "#10B981", 270, fightersA[0].currentDeg);
        addLog("🎬 Animating Persistent " + mode + " Roster vs. Roster Clash: [" + fightersA.map(f => f.slotLabel + ":" + f.cls.degree + "°").join(", ") + "] vs [" + fightersB.map(f => f.slotLabel + ":" + f.cls.degree + "°").join(", ") + "]!", "#6EE7B7");
      }
    };

    // Keep backward compatibility alias
    G.triggerDatabankCoalitionBattle = function (modeStr, classIdOverride, silentLog) {
      G.startAnimatedRosterClash(modeStr, classIdOverride, silentLog);
    };

    function finalizeAndPersistRosterClash(anim) {
      if (!anim || anim.finished) return;
      anim.finished = true;
      const remHpA = anim.fightersA.reduce((s, f) => s + Math.max(0, f.hp), 0);
      const maxHpA = anim.fightersA.reduce((s, f) => s + f.maxHp, 0);
      const remHpB = anim.fightersB.reduce((s, f) => s + Math.max(0, f.hp), 0);
      const maxHpB = anim.fightersB.reduce((s, f) => s + f.maxHp, 0);

      const scoreA = (anim.completedCirclesA * 520) + (remHpA / Math.max(1, maxHpA) * 1000) + anim.meanTorqueA * 4;
      const scoreB = (anim.completedCirclesB * 520) + (remHpB / Math.max(1, maxHpB) * 1000) + anim.meanTorqueB * 4;
      anim.teamAWon = remHpB <= 0 ? true : (remHpA <= 0 ? false : (scoreA >= scoreB));
      anim.winProbPct = +((scoreA / Math.max(1, scoreA + scoreB)) * 100).toFixed(1);
      anim.cooldownAfterFinish = 2.6;

      const outcome = {
        mode: anim.mode,
        teamA: anim.teamA,
        teamB: anim.teamB,
        synergyA: anim.synergyA,
        synergyB: anim.synergyB,
        teamAWon: anim.teamAWon,
        winProbPct: anim.winProbPct,
        completedCirclesA: Math.max(1, anim.completedCirclesA),
        completedCirclesB: Math.max(1, anim.completedCirclesB),
        meanTorqueA: +anim.meanTorqueA.toFixed(1),
        meanTorqueB: +anim.meanTorqueB.toFixed(1)
      };

      const savedRec = window.SovCommandEngine.persistCoalitionBattleOutcome(outcome);
      state.lastCoalitionResult = outcome;

      anim.roundLog.unshift(
        "🏆 MATCH #" + savedRec.matchNo + " PERSISTED (" + anim.mode + "): " +
        (anim.teamAWon ? "ROSTER ALPHA WON" : "ROSTER OMEGA WON") +
        " (" + anim.winProbPct + "% | ⭕" + outcome.completedCirclesA + ":" + outcome.completedCirclesB + " | MVP: " + savedRec.mvpName + ")"
      );

      anim.shockwaves.push({
        x: 152,
        y: 152,
        radius: 18,
        maxRadius: 122,
        color: anim.teamAWon ? "#10B981" : "#F43F5E",
        alpha: 1.0
      });

      refreshPersistentRosterSelects();
      renderDatabankArchetypePoolTable();
      renderRosterVitalsAndLedgerUI();
    }

    function stepRosterBattleAnimation(dt) {
      const anim = state.rosterAnim;
      if (!anim || state.rosterAnimPaused) return;

      // Update transient VFX (shockwaves, projectiles, floating texts)
      for (let i = anim.shockwaves.length - 1; i >= 0; i--) {
        const sw = anim.shockwaves[i];
        sw.radius += dt * 115;
        sw.alpha -= dt * 1.1;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) anim.shockwaves.splice(i, 1);
      }
      for (let i = anim.projectiles.length - 1; i >= 0; i--) {
        const pr = anim.projectiles[i];
        pr.progress += dt * 3.4;
        if (pr.progress >= 1) anim.projectiles.splice(i, 1);
      }
      for (let i = anim.floatingTexts.length - 1; i >= 0; i--) {
        const ft = anim.floatingTexts[i];
        ft.y -= dt * 22;
        ft.alpha -= dt * 0.95;
        if (ft.alpha <= 0) anim.floatingTexts.splice(i, 1);
      }

      if (anim.finished) {
        anim.cooldownAfterFinish -= dt;
        if (anim.cooldownAfterFinish <= 0 && state.autoWeighPoolActive) {
          // Cycle between 2v2 and 3v3 Roster vs. Roster animations automatically
          const nextMode = anim.mode === "3v3" ? "2v2" : "3v3";
          G.startAnimatedRosterClash(nextMode, null, true);
        }
        return;
      }

      anim.elapsedSec += dt;

      const stepFighter = (f, enemyList, synMult, isTeamA) => {
        if (f.hp <= 0) return;
        const dir = isTeamA ? 1 : -1;
        const stepDeg = f.angularSpeedDeg * dt;
        f.currentDeg = (f.currentDeg + dir * stepDeg + 360) % 360;
        f.revProgressDeg += stepDeg;
        if (f.swingFlash > 0) f.swingFlash = Math.max(0, f.swingFlash - dt);

        // Check 360° (2π) Full-Circle Completion Finisher!
        if (f.revProgressDeg >= 360) {
          f.revProgressDeg -= 360;
          f.completed360s++;
          if (isTeamA) anim.completedCirclesA++;
          else anim.completedCirclesB++;

          // Potion heal + 360° Shockwave
          const healAmt = Math.round((f.metrics.pot.healPi || 3.14) * 28);
          f.hp = Math.min(f.maxHp, f.hp + healAmt);
          anim.shockwaves.push({
            x: f.screenX || 152,
            y: f.screenY || 152,
            radius: 8,
            maxRadius: 68,
            color: isTeamA ? "#10B981" : "#F43F5E",
            alpha: 0.95
          });
          anim.floatingTexts.push({
            x: f.screenX || 152,
            y: (f.screenY || 152) - 14,
            text: "⭕360° +" + healAmt + "HP",
            color: "#FDE68A",
            alpha: 1.0
          });
        }

        f.attackCooldown -= dt;
        if (f.attackCooldown <= 0) {
          f.attackCooldown = 0.62 + Math.random() * 0.28;
          const aliveEnemies = enemyList.filter(e => e.hp > 0);
          if (aliveEnemies.length === 0) return;
          const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

          let phiDeg = Math.abs(f.currentDeg - target.currentDeg) % 360;
          if (phiDeg > 180) phiDeg = 360 - phiDeg;

          const angleMult = phiDeg >= 135 ? 1.48 : (phiDeg >= 45 ? 1.24 : 0.92);
          const polBonus = f.cls.polarity !== target.cls.polarity ? 1.12 : 1.0;
          const torque = +(f.metrics.rawOffensePi * synMult * angleMult * polBonus * (0.9 + Math.random() * 0.2) * 0.25).toFixed(1);
          const dmg = Math.max(38, Math.round(torque * 2.25 - target.metrics.rawDefensePi * 0.28));

          target.hp = Math.max(0, target.hp - dmg);
          f.swingFlash = 0.26;
          f.targetRad = Math.atan2((target.screenY || 152) - (f.screenY || 152), (target.screenX || 152) - (f.screenX || 152));

          if (isTeamA) {
            anim.strikesA++;
            anim.sumTorqueA += torque;
            anim.meanTorqueA = anim.sumTorqueA / anim.strikesA;
          } else {
            anim.strikesB++;
            anim.sumTorqueB += torque;
            anim.meanTorqueB = anim.sumTorqueB / anim.strikesB;
          }

          anim.projectiles.push({
            x1: f.screenX || 152,
            y1: f.screenY || 152,
            x2: target.screenX || 152,
            y2: target.screenY || 152,
            progress: 0,
            color: isTeamA ? "#6EE7B7" : "#FDA4AF"
          });

          anim.floatingTexts.push({
            x: target.screenX || 152,
            y: (target.screenY || 152) - 10,
            text: "-" + dmg + (phiDeg >= 135 ? " CRIT!" : ""),
            color: isTeamA ? "#6EE7B7" : "#FDA4AF",
            alpha: 1.0
          });

          anim.roundLog.unshift(
            "[" + f.slotLabel + "→" + target.slotLabel + " φ=" + Math.round(phiDeg) + "°] " +
            f.cls.name.replace(/^\d+°\s*/, "").split(" ").slice(0, 2).join(" ") +
            " (" + f.metrics.wpn.name.split(" ")[0] + ") hit for " + dmg + " DMG (τ=" + torque + "π)"
          );
          if (anim.roundLog.length > 10) anim.roundLog.length = 10;
        }
      };

      anim.fightersA.forEach(f => stepFighter(f, anim.fightersB, anim.synergyA.mult, true));
      anim.fightersB.forEach(f => stepFighter(f, anim.fightersA, anim.synergyB.mult, false));

      const aliveA = anim.fightersA.some(f => f.hp > 0);
      const aliveB = anim.fightersB.some(f => f.hp > 0);
      if (!aliveA || !aliveB || anim.elapsedSec >= 8.5) {
        finalizeAndPersistRosterClash(anim);
      }
    }

    G.onRosterSlotChange = function (teamKey, slotIdx, classId) {
      window.SovCommandEngine.setCoalitionRosterSlot(teamKey, slotIdx, classId);
      const st = window.SovCommandEngine.getCoalitionRosterState();
      G.startAnimatedRosterClash(st.mode, null, false);
    };

    G.assignClassToRoster = function (teamKey, classId) {
      window.SovCommandEngine.assignClassToNextRosterSlot(teamKey, classId);
      const st = window.SovCommandEngine.getCoalitionRosterState();
      G.startAnimatedRosterClash(st.mode, null, false);
    };

    G.autoBuildRosterTeam = function (teamKey) {
      window.SovCommandEngine.autoBuildEquilateralRoster(teamKey, state.selectedDatabankClassId);
      const st = window.SovCommandEngine.getCoalitionRosterState();
      G.startAnimatedRosterClash(st.mode, null, false);
    };

    G.swapRosterTeams = function () {
      window.SovCommandEngine.swapCoalitionRosters();
      const st = window.SovCommandEngine.getCoalitionRosterState();
      G.startAnimatedRosterClash(st.mode, null, false);
    };

    G.toggleRosterBattleAnimation = function () {
      state.rosterAnimPaused = !state.rosterAnimPaused;
      const btn = document.getElementById("btnToggleRosterAnim");
      if (btn) {
        btn.textContent = state.rosterAnimPaused ? "▶️ Anim: PAUSED" : "⏯️ Anim: LIVE";
        btn.className = state.rosterAnimPaused ? "btn btn-sm" : "btn btn-sm btn-emerald";
      }
    };

    G.instantResolveAndPersistRosterClash = function () {
      if (state.rosterAnim && !state.rosterAnim.finished) {
        finalizeAndPersistRosterClash(state.rosterAnim);
      } else {
        const st = window.SovCommandEngine.getCoalitionRosterState();
        G.startAnimatedRosterClash(st.mode, null, false);
      }
    };

    G.toggleAutoWeighDatabankPool = function () {
      state.autoWeighPoolActive = !state.autoWeighPoolActive;
      const btn = document.getElementById("autoWeighPoolBtn");
      if (btn) {
        btn.textContent = state.autoWeighPoolActive ? "🔄 Auto-Clash Pool: ON" : "⏸️ Auto-Clash Pool: OFF";
        btn.className = state.autoWeighPoolActive ? "btn btn-emerald" : "btn";
      }
      addLog("Automated Databank Roster vs. Roster (2v2 / 3v3) Loop: " + (state.autoWeighPoolActive ? "ENABLED" : "PAUSED"), "#6EE7B7");
    };

    function bindArchetypeWheelCanvasEvents() {
      const canvas = document.getElementById("archetypeDegreeWheelCanvas");
      if (!canvas) return;
      const cx = 152;
      const cy = 146;

      const getDegFromEvent = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        if (mx > 295) return null; // Right-side legend area
        let deg = (Math.atan2(my - cy, mx - cx) * 180 / Math.PI) + 90;
        if (deg <= 0) deg += 360;
        return +deg.toFixed(1);
      };

      canvas.addEventListener("mousemove", function (e) {
        const deg = getDegFromEvent(e);
        if (deg == null) return;
        const snap15 = Math.max(15, Math.min(360, Math.round(deg / 15) * 15 || 15));
        const ro = document.getElementById("wheelHoverReadout");
        if (ro) {
          ro.textContent = "Hover θ=" + deg + "° (Snap " + snap15 + "°) • ×3.14=" + (deg * 3.14).toFixed(1) + "° • ×π=" + (deg * Math.PI).toFixed(1) + "°";
        }
      });

      canvas.addEventListener("click", function (e) {
        const deg = getDegFromEvent(e);
        if (deg == null) return;
        const snap15 = Math.max(15, Math.min(360, Math.round(deg / 15) * 15 || 15));
        const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
        const match = pool.find(c => Math.abs((c.degree % 360 || 360) - snap15) < 4);
        if (match) {
          G.selectDatabankClassForEdit(match.id);
          G.triggerDatabankCoalitionBattle("3v3", match.id);
        } else {
          const inp = document.getElementById("dbClassDegreeInput");
          if (inp) inp.value = deg;
          G.syncDegreeSliderFromInput(deg);
        }
      });
    }

    G.runLiveDslScript = function () {
      const area = document.getElementById("dslScriptEditorArea");
      if (!area || !window.SovCommandEngine) return;
      const res = window.SovCommandEngine.parseAndExecuteDslScript(area.value, G);
      const outBox = document.getElementById("dslExecutionOutputBox");
      if (outBox) {
        outBox.innerHTML = res.executionLog.map(l => '<div class="log-entry" style="color:#6EE7B7;">✔ ' + l + '</div>').join("");
      }
      renderCircularTelemetryTable();
      addLog("Executed .cmd Circular DSL Battle Script (" + res.instructionCount + " instructions).", "#FDE68A");
    };

    /* Throne Room, Commodities & Diplomacy */
    G.activateThroneRoom3D = function (throneId) {
      const thrones = window.SOV_THRONE_ROOMS_DATA || [];
      const found = thrones.find(t => t.id === throneId) || thrones[2] || thrones[0];
      if (!found) return;
      state.activeThroneRoomId = found.id;
      state.barakahRate += found.auraBonusPi;
      state.barakahPower += found.auraBonusPi * 10;
      state.ummahNodes += 15;
      renderThroneRoomDepartments();
      const ringNum = parseFloat(found.ringRadiusPi) || 3.14;
      vp.spawnCircularShockwave(ringNum > 0.2 ? ringNum : 1.00, 0, 118, "#D4AF37", 360, 0);
      G.triggerVfxBurst("EMPOWERED");
      addLog("👑 Entered [" + found.title + "] (" + found.ringRadiusPi + ") -> Activated 3D Throne Aura (+" + found.auraBonusPi.toFixed(2) + "π/s & 360° Sovereign Resonance)!", "#FDE68A");
    };

    G.issueThroneDecree = function (deptId) {
      state.barakahRate += 3.14;
      state.dinarRate += 9.42;
      state.ummahNodes += 12;
      G.triggerVfxBurst("SPARKLES");
      addLog("Throne Room Decree issued in [" + deptId + "] -> +3.14π Barakah/s, +12 Autonomous Nodes on Concentric Rings!", "#FDE68A");
    };

    G.serveCafeteriaLunch = function () {
      state.commodities.vinegar += 31;
      state.units.forEach(u => { if (!u.isEnemy) u.hp = u.maxHp; });
      G.triggerVfxBurst("SPARKLES");
      addLog("Served Simāṭ Lunch (Blessed Vinegar & Tharīd) at 0.00π Core — All Concentric Rings Restored to 100% HP!", "#6EE7B7");
    };

    G.collectCastleSuffrage = function () {
      state.suffragePct = Math.min(100, state.suffragePct + 0.4);
      state.ummahNodes += 19;
      state.barakahRate += 6.28;
      addLog("Collected Suffrage & Paired Mu'ākhāh Patrons -> +19 Autonomous Nodes Joined!", "#FDE68A");
    };

    G.harvestAndTradeCommodity = function (commId, valPi) {
      state.dinars += valPi * 100;
      state.commodities.vinegar += 15;
      state.commodities.cotton += 15;
      state.commodities.tobacco += 15;
      state.commodities.steel += 15;
      addLog("Harvested & traded [" + commId + "] across 32-Bearing Port Faires -> +" + Math.round(valPi * 100) + " Gold Dīnārs!", "#6EE7B7");
    };

    G.delegateFullCaravanFormation = function () {
      G.spawnProceduralCaravan();
      state.ummahNodes += 10;
      addLog("Delegated 10-Specialist Orbital Caravan onto the 3.14π Trade Ring!", "#FDE68A");
    };

    G.absorbNeutralCaravans = function () {
      state.caravans.forEach(cv => { cv.friendly = true; cv.stragglersProtected = true; });
      state.ummahNodes += 31;
      state.barakahPower += 94.2;
      G.triggerVfxBurst("SPARKLES");
      addLog("Converted & Absorbed Orbital Caravans (+31 Muslim Nodes)!", "#6EE7B7");
    };

    G.sendDiplomaticEpistle = function (kingId, kingName) {
      state.ummahNodes += 45;
      state.barakahRate += 6.28;
      state.dinars += 628;
      G.triggerVfxBurst("SPARKLES");
      addLog("Envoy to " + kingName + " uncovered local Syndication -> Unlocked Priory Discovery & +45 Converts!", "#FDE68A");
    };

    G.sendCaravanToKing = function (kingId) {
      G.spawnProceduralCaravan();
      state.dinars += 314;
      addLog("Dispatched Orbital Caravan to [" + kingId + "] (+314 Gold Dīnārs)!", "#93C5FD");
    };

    G.deployProfileToGrid = function (profIdx, customRingPi, customAngleDeg) {
      const p = (window.SOV_PROFILES_DATA || [])[profIdx];
      if (!p) return;
      const defaultVerb = p.coreArchetype === "ARCH_VANGUARD" ? "DEFEND" : "ATTACK";
      const res = window.SovCommandEngine.evaluateArchetypeResonance(p, defaultVerb);
      const rPi = !isNaN(customRingPi) ? customRingPi : (res.orbitRadiusPi || 2.00);
      const deg = !isNaN(customAngleDeg) ? customAngleDeg : Math.round(Math.random() * 360);
      const rad = deg * DEG_TO_RAD;

      state.units.push({
        idx: state.units.length,
        profileId: p.profileId,
        name: p.characterName,
        archetype: p.archetypeClass,
        coreArchetype: p.coreArchetype,
        form: p.spriteAnimationForm,
        verb: defaultVerb,
        gambit: p.commandsRuleStack,
        statW: p.statWeightPi,
        armorW: p.armorWeightPi,
        weaponW: p.weaponWeightPi,
        vfxType: p.vfxType,
        tone: p.skillTone,
        tradeSkill: p.skillName,
        experience: p.livedExperienceOrigin,
        hp: p.baseHp,
        maxHp: p.baseHp,
        atk: p.baseAttack,
        def: p.baseDefense,
        isEnemy: false,
        isFloating: p.spriteAnimationForm.includes("Floating"),
        isMounted: p.spriteAnimationForm.includes("Mounted"),
        empowered: true,
        orbitRadiusPi: rPi,
        customOrbitPi: rPi,
        angleDeg: deg,
        arcDegrees: res.arcDegrees || 180,
        angularVelocityDeg: res.angularSpeedDeg || 120,
        revProgressDeg: 0,
        completedCircles: 0,
        lastIncidenceDeg: 135,
        lastTorquePi: 52.4,
        lastProceduralDmg: 165,
        gx: Math.cos(rad) * rPi * 1.18,
        gy: Math.sin(rad) * rPi * 1.18,
        conversions: 5,
        activeResonance: res.multiplier,
        resonanceTier: res.tier
      });
      state.ummahNodes += 1;
      renderCircularTelemetryTable();
      vp.spawnCircularShockwave(rPi, deg, 85, "#10B981", res.arcDegrees || 180, deg);
      addLog("Deployed [" + p.characterName.split("(")[0].trim() + "] on Ring r=" + rPi.toFixed(2) + "π @ θ=" + Math.round(deg) + "° (" + defaultVerb + " " + res.multiplier.toFixed(2) + "x)!", "#6EE7B7");
    };

    /* ============================================================================
     * 🏰 THE BASTILLE OF ARCHETYPES — 6 EQUILATERAL 60° CITADEL BASTIONS,
     *    24 GARRISONED 15° VAULTS & LIVE 60 FPS HEXAGONAL CRUCIBLE CANVAS
     * ============================================================================ */
    state.selectedBastilleWingFilter = "ALL";
    state.selectedBastilleVaultId = "DB_ARCH_060_EQUILATERAL_COLOSSUS";
    state.bastilleAnim = {
      phaseDeg: 0,
      challengerOrbitDeg: 210,
      wardenOrbitDeg: 30,
      lastHitCooldown: 0,
      shockwaves: [],
      floatingTexts: [],
      lastTrialResult: null
    };

    function renderBastilleOfArchetypesUI() {
      if (!window.SovCommandEngine || !window.SovCommandEngine.getBastilleState) return;
      const bState = window.SovCommandEngine.getBastilleState();
      const wings = window.SovCommandEngine.getBastilleWingsSchema();
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];

      // 1. Render 6-Bastion Equilateral Wing Strip
      const wingStrip = document.getElementById("bastilleSixWingsStrip");
      if (wingStrip) {
        wingStrip.innerHTML = wings.map(w => {
          const wingVaults = pool.filter(c => c.degree >= w.degMin && c.degree <= w.degMax);
          const avgTier = wingVaults.length
            ? (wingVaults.reduce((s, c) => s + ((bState.vaults[c.id]?.fortificationTier) || 1), 0) / wingVaults.length).toFixed(1)
            : "2.0";
          const avgWall = wingVaults.length
            ? Math.round(wingVaults.reduce((s, c) => s + ((bState.vaults[c.id]?.wallIntegrityPct) || 100), 0) / wingVaults.length)
            : 100;
          const activeSel = state.selectedBastilleWingFilter === w.id;
          return (
            '<div onclick="window.SovGame.filterBastilleByWing(\'' + w.id + '\')" style="cursor:pointer;padding:0.42rem 0.55rem;border-radius:7px;background:' +
            (activeSel ? 'rgba(212,175,55,0.2)' : 'rgba(2,6,23,0.78)') +
            ';border:1px solid ' + (activeSel ? '#FDE68A' : w.color) +
            ';box-shadow:' + (activeSel ? '0 0 12px rgba(212,175,55,0.35)' : 'none') + ';transition:all 0.15s ease;">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;font-weight:700;color:' + w.color + ';">' +
                '<span>' + w.icon + ' ' + w.shortTitle + '</span>' +
                '<span class="badge badge-gold" style="font-size:0.6rem;">' + w.sectorLabel + '</span>' +
              '</div>' +
              '<div style="font-size:0.65rem;color:#E2E8F0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + w.arabicTitle + '</div>' +
              '<div style="display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:0.63rem;color:#94A3B8;margin-top:3px;">' +
                '<span>' + wingVaults.length + ' Vaults • Avg T' + avgTier + '</span>' +
                '<span style="color:#6EE7B7;">Wall ' + avgWall + '%</span>' +
              '</div>' +
            '</div>'
          );
        }).join("");
      }

      // 2. Update Filter Buttons active state
      const allFilterIds = ["ALL"].concat(wings.map(w => w.id));
      allFilterIds.forEach(fid => {
        const btn = document.getElementById("bastilleFilter_" + fid);
        if (btn) btn.classList.toggle("active", state.selectedBastilleWingFilter === fid);
      });

      // 3. Update Selected Vault Badge
      const defSel = document.getElementById("clashDefenderSelect");
      const activeVaultId = (defSel && defSel.value) || state.selectedBastilleVaultId || "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      state.selectedBastilleVaultId = activeVaultId;
      const activeVaultCls = pool.find(c => c.id === activeVaultId) || pool[0];
      const activeVaultRec = (bState.vaults && bState.vaults[activeVaultId]) || { fortificationTier: 2, wallIntegrityPct: 95, wardenTitle: "Sovereign Bastion Warden" };
      const selBadge = document.getElementById("bastilleSelectedVaultBadge");
      if (selBadge && activeVaultCls) {
        selBadge.textContent = "Vault: " + activeVaultCls.degree + "° " + activeVaultCls.name.replace(/^\d+°\s*/, "") + " (Tier " + activeVaultRec.fortificationTier + " • Wall " + activeVaultRec.wallIntegrityPct + "%)";
      }

      // 4. Render 24-Vault Bastille Garrison Table (#monteCarloResultsBody)
      const tbody = document.getElementById("monteCarloResultsBody");
      if (tbody) {
        const filteredPool = state.selectedBastilleWingFilter === "ALL"
          ? pool
          : pool.filter(c => {
              const v = bState.vaults[c.id];
              return v && v.wingId === state.selectedBastilleWingFilter;
            });

        tbody.innerHTML = filteredPool.map(c => {
          const v = bState.vaults[c.id] || {
            wingId: "WING_DEFENDERS",
            wingTitle: "Bastion I: Defenders",
            wardenTitle: "Garrison Warden",
            fortificationTier: 2,
            wallIntegrityPct: 92,
            defensesWon: 14,
            breachesSuffered: 4,
            sealsEarned: 3,
            avgCirclesCompleted: 2.1,
            avgTorquePi: 74.5,
            status: "FORTIFIED"
          };
          const wingObj = wings.find(w => w.id === v.wingId) || wings[0];
          const m = window.SovCommandEngine.computeClassProceduralMetrics(c);
          const totalTrials = Math.max(1, v.defensesWon + v.breachesSuffered);
          const holdRatePct = +((v.defensesWon / totalTrials) * 100).toFixed(1);
          const breachRatePct = +(100 - holdRatePct).toFixed(1);
          const isSelected = c.id === state.selectedBastilleVaultId;
          const tierRoman = ["I", "II", "III", "IV", "V"][Math.max(0, Math.min(4, (v.fortificationTier || 1) - 1))];

          return (
            '<tr style="' + (isSelected ? 'background:rgba(212,175,55,0.14);outline:1px solid rgba(212,175,55,0.45);' : '') + '">' +
              '<td>' +
                '<span class="badge" style="background:rgba(2,6,23,0.85);border:1px solid ' + wingObj.color + ';color:' + wingObj.color + ';font-size:0.65rem;">' + wingObj.icon + ' ' + wingObj.shortTitle + '</span><br/>' +
                '<strong style="color:#FDE68A;font-family:Consolas,monospace;font-size:0.75rem;">Vault ' + c.degree + '° (×3.14=' + c.degTimes314 + '°)</strong>' +
              '</td>' +
              '<td>' +
                '<strong style="color:#F8FAFC;cursor:pointer;" onclick="window.SovGame.selectBastilleVault(\'' + c.id + '\')">' + c.name + '</strong><br/>' +
                '<span style="color:#6EE7B7;font-size:0.7rem;">' + c.arabicTitle + ' • <em>' + v.wardenTitle + '</em></span>' +
              '</td>' +
              '<td>' +
                '<span class="badge badge-gold">🏰 Tier ' + tierRoman + ' (' + v.fortificationTier + '/5)</span> ' +
                '<span class="badge ' + (v.status === 'BREACHED' ? 'badge-crimson' : 'badge-emerald') + '">' + v.status + '</span><br/>' +
                '<div style="font-family:Consolas,monospace;font-size:0.68rem;color:#CBD5E1;margin-top:3px;">Wall Integrity: <strong style="color:#6EE7B7;">' + v.wallIntegrityPct + '%</strong> • Seals: <strong style="color:#FDE68A;">🏅 ' + v.sealsEarned + '</strong></div>' +
              '</td>' +
              '<td style="font-size:0.68rem;line-height:1.35;">' +
                '<div>🗡️ <span style="color:#FDE68A;">' + m.wpn.name + '</span></div>' +
                '<div>🛡️ <span style="color:#93C5FD;">' + m.arm.name + '</span></div>' +
                '<div>✨ <span style="color:#C4B5FD;">' + m.spl.name + '</span></div>' +
              '</td>' +
              '<td style="min-width:165px;">' +
                '<div style="display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:0.71rem;">' +
                  '<span style="color:#6EE7B7;font-weight:700;">🛡️ ' + holdRatePct + '% Held (' + v.defensesWon + ')</span>' +
                  '<span style="color:#FDA4AF;">⚔️ ' + breachRatePct + '% (' + v.breachesSuffered + ')</span>' +
                '</div>' +
                '<div class="winrate-bar-outer" style="margin-top:3px;"><div class="winrate-bar-inner" style="width:' + holdRatePct + '%;"></div></div>' +
                '<div style="font-family:Consolas,monospace;font-size:0.65rem;color:#94A3B8;margin-top:2px;">ELO: <strong style="color:#FDE68A;">' + (c.eloRating || 1650) + '</strong> • Pwr: ' + m.compositePowerScore + 'π</div>' +
              '</td>' +
              '<td style="font-family:Consolas,monospace;color:#FDE68A;">' +
                '⭕ ' + v.avgCirclesCompleted + ' (2π)<br/>' +
                '<span style="font-size:0.68rem;color:#6EE7B7;">τ = ' + v.avgTorquePi + ' N·π</span>' +
              '</td>' +
              '<td>' +
                '<div class="btn-row" style="gap:0.22rem;">' +
                  '<button class="btn btn-sm btn-gold" onclick="window.SovGame.executeBastilleVaultBreach(\'' + c.id + '\')" title="Challenge this Bastille Vault in the Crucible">⚔️ Breach</button>' +
                  '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.fortifySelectedBastilleVault(\'' + c.id + '\')" title="Upgrade Vault Fortification Tier (+3.14π Wall)">🏰 Fortify</button>' +
                  '<button class="btn btn-sm btn-sapphire" onclick="window.SovGame.draftSelectedVaultToRoster(\'A\',\'' + c.id + '\')" title="Draft Warden to Roster A">+A</button>' +
                  '<button class="btn btn-sm btn-crimson" onclick="window.SovGame.draftSelectedVaultToRoster(\'B\',\'' + c.id + '\')" title="Draft Warden to Roster B">+B</button>' +
                '</div>' +
              '</td>' +
            '</tr>'
          );
        }).join("");
      }
    }

    G.filterBastilleByWing = function (wingId) {
      state.selectedBastilleWingFilter = wingId || "ALL";
      renderBastilleOfArchetypesUI();
    };

    G.selectBastilleVault = function (classId) {
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const cls = pool.find(c => c.id === classId) || pool[0];
      if (!cls) return;
      state.selectedBastilleVaultId = cls.id;
      const defSel = document.getElementById("clashDefenderSelect");
      if (defSel) defSel.value = cls.id;
      G.recalc11VectorClash();
      renderBastilleOfArchetypesUI();
      addLog("🏰 Selected Bastille Vault [" + cls.degree + "° " + cls.name + "] for Crucible Inspection.", "#FDE68A");
    };

    /* Bastille Vault Crucible & 3.14π Circular Breach Calculator */
    G.recalc11VectorClash = function () {
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const bState = window.SovCommandEngine && window.SovCommandEngine.getBastilleState
        ? window.SovCommandEngine.getBastilleState()
        : { vaults: {} };

      const attId = document.getElementById("clashAttackerSelect")?.value || "DB_ARCH_090_MAMLUK_SHOCK_LANCER";
      const defId = document.getElementById("clashDefenderSelect")?.value || state.selectedBastilleVaultId || "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      state.selectedBastilleVaultId = defId;

      const attCls = pool.find(c => c.id === attId) || pool[0];
      const defCls = pool.find(c => c.id === defId) || pool[3] || pool[0];
      if (!attCls || !defCls) return;

      const vaultRec = (bState.vaults && bState.vaults[defCls.id]) || {
        wingTitle: "Bastion I: Defenders",
        wardenTitle: "Citadel Warden",
        fortificationTier: 2,
        wallIntegrityPct: 95,
        defensesWon: 14,
        breachesSuffered: 4,
        sealsEarned: 3
      };

      const selectedVerb = document.getElementById("clashVerbSelect")?.value || "STRIKE";
      const statW = parseFloat(document.getElementById("clashStatSlider")?.value) || attCls.statWeightPi || 3.14;
      const weapW = parseFloat(document.getElementById("clashWeaponSlider")?.value) || 3.45;
      const armW = parseFloat(document.getElementById("clashArmorSlider")?.value) || 3.60;
      const incAngleDeg = parseFloat(document.getElementById("clashAngleSlider")?.value || "145");
      const sweepArcDeg = parseFloat(document.getElementById("clashArcSlider")?.value || "180");

      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setTxt("clashStatVal", statW.toFixed(2) + "π");
      setTxt("clashWeaponVal", weapW.toFixed(2) + "π");
      setTxt("clashArmorVal", armW.toFixed(2) + "π");
      setTxt("clashAngleVal", Math.round(incAngleDeg) + "° (" + ((incAngleDeg * Math.PI) / 180).toFixed(2) + "r)");
      setTxt("clashArcVal", "Δ" + Math.round(sweepArcDeg) + "° (" + ((sweepArcDeg / 360) * 2).toFixed(2) + "π)");

      const mAtt = window.SovCommandEngine.computeClassProceduralMetrics(attCls);
      const mDef = window.SovCommandEngine.computeClassProceduralMetrics(defCls);
      const fortBonusDef = vaultRec.fortificationTier * 16 + Math.round(vaultRec.wallIntegrityPct * 0.25);

      const attProfile = {
        profileId: attCls.id,
        characterName: attCls.name,
        coreArchetype: attCls.combatRole,
        statWeightPi: statW,
        weaponWeightPi: weapW,
        armorWeightPi: mAtt.arm.weightPi,
        baseHp: mAtt.effectiveHp,
        baseAttack: mAtt.effectiveAtk,
        baseDefense: mAtt.effectiveDef
      };
      const defProfile = {
        profileId: defCls.id,
        characterName: defCls.name,
        coreArchetype: defCls.combatRole,
        statWeightPi: defCls.statWeightPi,
        weaponWeightPi: mDef.wpn.weightPi,
        armorWeightPi: armW + vaultRec.fortificationTier * 0.22,
        baseHp: mDef.effectiveHp + vaultRec.fortificationTier * 95,
        baseAttack: mDef.effectiveAtk,
        baseDefense: mDef.effectiveDef + fortBonusDef
      };

      const circ = window.SovCommandEngine.evaluateCircularImpact(attProfile, defProfile, selectedVerb, incAngleDeg, sweepArcDeg, 360);
      const revToBreach = Math.max(1, Math.ceil(defProfile.baseHp / Math.max(1, circ.netProceduralDamage)));
      const breachProb = Math.min(96.5, Math.max(18.0, 52.0 + (circ.rawProceduralOffense - defProfile.baseDefense * 1.15) * 0.085));

      const out = document.getElementById("clashFormulaOutput");
      if (out) {
        out.innerHTML =
          '<div style="color:#FDE68A;font-weight:700;margin-bottom:4px;">🏰 BASTILLE VAULT CRUCIBLE: [' + attCls.degree + '° ' + attCls.name.replace(/^\d+°\s*/, "") + '] vs. VAULT [' + defCls.degree + '° ' + defCls.name.replace(/^\d+°\s*/, "") + ']</div>' +
          '<div style="color:#6EE7B7;margin-bottom:4px;"><strong>Garrison Bastion:</strong> ' + vaultRec.wingTitle + ' • <strong>Tier ' + vaultRec.fortificationTier + '/5</strong> (Wall ' + vaultRec.wallIntegrityPct + '% | +' + fortBonusDef + ' Fortification DEF)</div>' +
          '<div>1. <strong>Breach Incidence (φ°) &amp; Sector:</strong> φ = <strong>' + circ.incidenceAngleDeg + '° (' + circ.incidenceRad + ' rad)</strong> → <span style="color:#93C5FD;">' + circ.sectorZoneLabel + ' (' + circ.degreeImpactMult + 'x)</span></div>' +
          '<div>2. <strong>Sweep Arc (Δθ°) &amp; Ring Orbit:</strong> Δθ = <strong>' + circ.sweepArcDeg + '° (' + circ.sweepArcRad + ' rad)</strong> covering <strong>' + (circ.circleCoverageRatio * 100).toFixed(1) + '%</strong> of 360° Vault @ r = <strong>' + circ.orbitRadiusPi + 'π</strong></div>' +
          '<div>3. <strong>Tangential Siege Torque (τ_π):</strong> ω = <strong>' + circ.angularVelocityDegPerSec + '°/s</strong> | τ = <strong style="color:#FDE68A;">' + circ.tangentialTorquePi + ' N·m·π</strong></div>' +
          '<div>4. <strong>Net Breach Damage per Revolution:</strong> <span style="color:#6EE7B7;font-weight:700;">' + circ.netProceduralDamage + ' HP/strike</span> vs. Warden HP <strong>' + defProfile.baseHp + '</strong></div>' +
          '<div>5. <strong>Vault Breach Forecast:</strong> <span style="color:#FDE68A;font-weight:700;">' + breachProb.toFixed(1) + '% Breach Chance in ~' + revToBreach + ' Circular Revolutions (2π)</span> • Record: ' + vaultRec.defensesWon + ' Held / ' + vaultRec.breachesSuffered + ' Breached</div>';
      }
      const winReadout = document.getElementById("canvasWinCalcReadout");
      if (winReadout) {
        winReadout.textContent = "Bastille Breach: " + breachProb.toFixed(1) + "% • [" + selectedVerb + " Δ" + circ.sweepArcDeg + "° @ φ=" + circ.incidenceAngleDeg + "°] • τ=" + circ.tangentialTorquePi + " N·π • Hit: " + circ.netProceduralDamage + " HP";
      }
      renderBastilleOfArchetypesUI();
    };

    G.executeBastilleVaultBreach = function (vaultIdOverride) {
      if (vaultIdOverride) {
        state.selectedBastilleVaultId = vaultIdOverride;
        const defSel = document.getElementById("clashDefenderSelect");
        if (defSel) defSel.value = vaultIdOverride;
      }
      const attId = document.getElementById("clashAttackerSelect")?.value || "DB_ARCH_090_MAMLUK_SHOCK_LANCER";
      const defId = state.selectedBastilleVaultId || document.getElementById("clashDefenderSelect")?.value || "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      const incAngleDeg = parseFloat(document.getElementById("clashAngleSlider")?.value || "145");
      const sweepArcDeg = parseFloat(document.getElementById("clashArcSlider")?.value || "180");

      const trial = window.SovCommandEngine.challengeBastilleVault(attId, defId, incAngleDeg, sweepArcDeg);
      if (!trial) return;

      state.bastilleAnim.lastTrialResult = trial;
      state.bastilleAnim.shockwaves.push({
        r: 18,
        maxR: 135,
        alpha: 1.0,
        color: trial.breached ? "#F59E0B" : "#10B981"
      });
      state.bastilleAnim.floatingTexts.push({
        x: 340,
        y: 195,
        vy: -24,
        alpha: 1.0,
        color: trial.breached ? "#FDE68A" : "#6EE7B7",
        text: (trial.breached ? "⚔️ VAULT BREACHED! (" : "🛡️ VAULT HELD! (") + trial.revolutions + " rev • τ=" + trial.avgTorquePi + "π)"
      });

      const liveBox = document.getElementById("bastilleGauntletLiveBox");
      if (liveBox) {
        liveBox.innerHTML =
          '<strong style="color:' + (trial.breached ? '#FDE68A' : '#6EE7B7') + ';">' +
          (trial.breached ? '⚔️ VAULT BREACHED IN CRUCIBLE!' : '🛡️ BASTILLE WARDEN HELD THE VAULT!') +
          '</strong> — Challenger <strong>' + trial.challengerName + ' (' + trial.challengerDeg + '°)</strong> vs. Warden <strong>' +
          trial.wardenName + ' (' + trial.wardenDeg + '° • Tier ' + trial.fortificationTier + ')</strong> | ' +
          'Revolutions: <strong>' + trial.revolutions + ' (⭕ ' + trial.circlesCompleted + ')</strong> | ' +
          'Mean Torque: <strong>' + trial.avgTorquePi + ' N·π</strong> | Wall Integrity: <strong>' + trial.wallIntegrityAfter + '%</strong> | ' +
          'Final HP: Challenger <strong>' + trial.challengerHpRemaining + '</strong> vs. Warden <strong>' + trial.wardenHpRemaining + '</strong>';
      }

      G.recalc11VectorClash();
      renderDatabankArchetypePoolTable();
      G.triggerVfxBurst(trial.breached ? "SWORD_SWIPE" : "SPARKLES");
      addLog(
        (trial.breached ? "⚔️ BASTILLE BREACH: [" : "🛡️ BASTILLE DEFENSE: [") +
        trial.challengerName + "] vs. Vault [" + trial.wardenDeg + "° " + trial.wardenName + "] — " +
        (trial.breached ? "Breached in " : "Held across ") + trial.revolutions + " revolutions (Wall " + trial.wallIntegrityAfter + "%).",
        trial.breached ? "#FDE68A" : "#6EE7B7"
      );
    };

    G.fortifySelectedBastilleVault = function (vaultIdOverride) {
      const targetId = vaultIdOverride || state.selectedBastilleVaultId || document.getElementById("clashDefenderSelect")?.value || "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      state.selectedBastilleVaultId = targetId;
      const v = window.SovCommandEngine.fortifyBastilleVault(targetId);
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const cls = pool.find(c => c.id === targetId);
      if (v && cls) {
        state.bastilleAnim.shockwaves.push({ r: 24, maxR: 150, alpha: 1.0, color: "#10B981" });
        state.bastilleAnim.floatingTexts.push({
          x: 340,
          y: 185,
          vy: -22,
          alpha: 1.0,
          color: "#6EE7B7",
          text: "🏰 FORTIFIED VAULT " + cls.degree + "° -> TIER " + v.fortificationTier + " (Wall " + v.wallIntegrityPct + "%)"
        });
        G.recalc11VectorClash();
        renderDatabankArchetypePoolTable();
        addLog("🏰 Fortified Bastille Vault [" + cls.degree + "° " + cls.name + "] to Tier " + v.fortificationTier + "/5 (Wall Integrity " + v.wallIntegrityPct + "%).", "#6EE7B7");
      }
    };

    G.draftSelectedVaultToRoster = function (side, vaultIdOverride) {
      const targetId = vaultIdOverride || state.selectedBastilleVaultId || document.getElementById("clashDefenderSelect")?.value;
      if (!targetId) return;
      G.assignClassToSavedRoster(side || "A", targetId);
      renderBastilleOfArchetypesUI();
    };

    G.resetBastilleCitadel = function () {
      if (!window.SovCommandEngine || !window.SovCommandEngine.resetBastilleState) return;
      window.SovCommandEngine.resetBastilleState();
      G.recalc11VectorClash();
      renderBastilleOfArchetypesUI();
      addLog("🏰 Reset all 24 Bastille of Archetypes Vaults to Baseline Fortification Tiers & 100% Wall Integrity.", "#FDE68A");
    };

    G.executeLiveClashOnCanvas = function () {
      G.executeBastilleVaultBreach();
    };

    /* 6-Bastion Equilateral Siege Gauntlet Runner */
    G.runMonteCarloTournament = function () {
      if (!window.SovCommandEngine || !window.SovCommandEngine.runBastilleSixWingGauntlet) return;
      const gauntlet = window.SovCommandEngine.runBastilleSixWingGauntlet();
      state.bastilleAnim.shockwaves.push({ r: 15, maxR: 180, alpha: 1.0, color: "#D4AF37" });
      state.bastilleAnim.floatingTexts.push({
        x: 340,
        y: 175,
        vy: -25,
        alpha: 1.0,
        color: "#FDE68A",
        text: "🔥 6-BASTION GAUNTLET: " + gauntlet.breachedCount + "/6 BASTIONS BREACHED (" + gauntlet.totalSeals + " Seals)"
      });

      const liveBox = document.getElementById("bastilleGauntletLiveBox");
      if (liveBox && gauntlet.wingResults) {
        const summaryBadges = gauntlet.wingResults.map(r =>
          '<span class="badge ' + (r.breached ? 'badge-gold' : 'badge-emerald') + '" style="margin-right:4px;">' +
          r.wingTitle.split(":")[0] + ' (' + r.wardenDeg + '°): ' + (r.breached ? '⚔️ Breached' : '🛡️ Held') + '</span>'
        ).join(" ");
        liveBox.innerHTML =
          '<div style="margin-bottom:3px;"><strong style="color:#FDE68A;">🔥 6-BASTION EQUILATERAL SIEGE GAUNTLET COMPLETE: ' +
          gauntlet.breachedCount + ' / 6 Bastions Breached</strong> • Total Citadel Seals: <strong style="color:#6EE7B7;">🏅 ' + gauntlet.totalSeals + '</strong></div>' +
          '<div>' + summaryBadges + '</div>';
      }

      G.recalc11VectorClash();
      renderDatabankArchetypePoolTable();
      addLog("🔥 Stormed all 6 Equilateral 60° Bastions in the Bastille of Archetypes: " + gauntlet.breachedCount + "/6 Bastions Breached!", "#FDE68A");
    };

    /* Live 60 FPS Hexagonal Bastille of Archetypes Canvas Renderer */
    function renderBastilleArchetypesCanvas() {
      const canvas = document.getElementById("bastilleArchetypesCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W * 0.5;
      const cy = H * 0.51;
      const outerHexR = Math.min(W, H) * 0.43;
      const vaultRingR = outerHexR * 0.82;
      const courtyardR = outerHexR * 0.46;

      ctx.clearRect(0, 0, W, H);

      // Background Radial Gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, outerHexR * 1.18);
      bgGrad.addColorStop(0, "#0F172A");
      bgGrad.addColorStop(0.65, "#060D1A");
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const wings = (window.SovCommandEngine && window.SovCommandEngine.getBastilleWingsSchema)
        ? window.SovCommandEngine.getBastilleWingsSchema()
        : [];
      const bState = (window.SovCommandEngine && window.SovCommandEngine.getBastilleState)
        ? window.SovCommandEngine.getBastilleState()
        : { vaults: {} };
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];

      // 1. Draw 6 Equilateral 60° Hexagonal Citadel Bastion Sectors
      wings.forEach((w, idx) => {
        const startRad = ((w.degMin - 90) * Math.PI) / 180;
        const endRad = ((w.degMax - 90) * Math.PI) / 180;
        const midRad = ((w.degMin + 30 - 90) * Math.PI) / 180;
        const isWingFiltered = state.selectedBastilleWingFilter === w.id;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerHexR, startRad, endRad);
        ctx.closePath();
        ctx.fillStyle = isWingFiltered ? (w.color + "33") : (w.color + "16");
        ctx.fill();
        ctx.strokeStyle = isWingFiltered ? "#FDE68A" : (w.color + "88");
        ctx.lineWidth = isWingFiltered ? 2.2 : 1.2;
        ctx.stroke();

        // Outer Hexagonal Bastion Wall Segment
        const x1 = cx + Math.cos(startRad) * outerHexR;
        const y1 = cy + Math.sin(startRad) * outerHexR;
        const x2 = cx + Math.cos(endRad) * outerHexR;
        const y2 = cy + Math.sin(endRad) * outerHexR;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 3.2;
        ctx.stroke();

        // Corner Citadel Turret
        ctx.beginPath();
        ctx.arc(x1, y1, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#0F172A";
        ctx.fill();
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Bastion Wing Title outside/near outer rim
        const labelR = outerHexR + 17;
        const lx = cx + Math.cos(midRad) * labelR;
        const ly = cy + Math.sin(midRad) * labelR;
        ctx.fillStyle = w.color;
        ctx.font = "bold 10px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(w.shortTitle.toUpperCase() + " [" + w.sectorLabel + "]", lx, ly);
        ctx.restore();
      });

      // 2. Draw 24 Garrisoned 15° Vault Cells around the Citadel Ring
      const first24 = pool.slice(0, 24);
      first24.forEach(cls => {
        const deg = cls.degree || 15;
        const rad = ((deg - 90) * Math.PI) / 180;
        const vx = cx + Math.cos(rad) * vaultRingR;
        const vy = cy + Math.sin(rad) * vaultRingR;
        const vRec = (bState.vaults && bState.vaults[cls.id]) || { fortificationTier: 2, wallIntegrityPct: 95, status: "FORTIFIED" };
        const isSelected = cls.id === state.selectedBastilleVaultId;

        // Spoke line from courtyard to vault
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * courtyardR, cy + Math.sin(rad) * courtyardR);
        ctx.lineTo(vx, vy);
        ctx.strokeStyle = isSelected ? "rgba(253,230,138,0.75)" : "rgba(148,163,184,0.18)";
        ctx.lineWidth = isSelected ? 2.0 : 1.0;
        ctx.stroke();

        // Vault Cell Node
        const cellR = isSelected ? 13.5 : 10.5;
        ctx.beginPath();
        ctx.arc(vx, vy, cellR, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#1E293B" : "#091020";
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#FDE68A" : (vRec.status === "BREACHED" ? "#F43F5E" : cls.color || "#10B981");
        ctx.lineWidth = isSelected ? 2.6 : 1.6;
        ctx.stroke();

        // Wall Integrity Arc around Vault Cell
        const wallArc = ((vRec.wallIntegrityPct || 100) / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(vx, vy, cellR + 2.5, -Math.PI / 2, -Math.PI / 2 + wallArc);
        ctx.strokeStyle = vRec.wallIntegrityPct >= 75 ? "#10B981" : "#F59E0B";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Degree & Tier label inside Vault Cell
        ctx.fillStyle = isSelected ? "#FDE68A" : "#E2E8F0";
        ctx.font = (isSelected ? "bold 8.5px" : "8px") + " Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(deg + "°", vx, vy - 2.5);
        ctx.fillStyle = "#6EE7B7";
        ctx.font = "7px Consolas, monospace";
        ctx.fillText("T" + (vRec.fortificationTier || 2), vx, vy + 5.2);
      });

      // 3. Draw Central Bastille Crucible Courtyard & Live Animated Duelists
      ctx.beginPath();
      ctx.arc(cx, cy, courtyardR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(2, 6, 23, 0.86)";
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inner 3.14π Protractor Ring
      ctx.beginPath();
      ctx.arc(cx, cy, courtyardR * 0.62, 0, Math.PI * 2);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(147, 197, 253, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Advance live Bastille Courtyard duelists
      const anim = state.bastilleAnim;
      anim.phaseDeg = (anim.phaseDeg + 1.8) % 360;
      anim.challengerOrbitDeg = (anim.challengerOrbitDeg + 2.4) % 360;
      anim.wardenOrbitDeg = (anim.wardenOrbitDeg - 1.6 + 360) % 360;

      const attId = document.getElementById("clashAttackerSelect")?.value || "DB_ARCH_090_MAMLUK_SHOCK_LANCER";
      const defId = state.selectedBastilleVaultId || "DB_ARCH_060_EQUILATERAL_COLOSSUS";
      const attCls = pool.find(c => c.id === attId) || pool[0];
      const defCls = pool.find(c => c.id === defId) || pool[3] || pool[0];

      const cRad = ((anim.challengerOrbitDeg - 90) * Math.PI) / 180;
      const wRad = ((anim.wardenOrbitDeg - 90) * Math.PI) / 180;
      const duelR = courtyardR * 0.62;
      const ax = cx + Math.cos(cRad) * duelR;
      const ay = cy + Math.sin(cRad) * duelR;
      const dx = cx + Math.cos(wRad) * (duelR * 0.42);
      const dy = cy + Math.sin(wRad) * (duelR * 0.42);

      // Clash vector line
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.55)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Draw Challenger Node
      ctx.beginPath();
      ctx.arc(ax, ay, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6";
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#93C5FD";
      ctx.font = "bold 8.5px Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚔️ " + (attCls ? attCls.degree + "°" : "90°"), ax, ay - 13);

      // Draw Vault Warden Node
      ctx.beginPath();
      ctx.arc(dx, dy, 10.5, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = "#6EE7B7";
      ctx.font = "bold 8.5px Consolas, monospace";
      ctx.fillText("🏰 " + (defCls ? defCls.degree + "°" : "60°"), dx, dy + 19);

      // Center Courtyard Title
      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 9.5px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText("BASTILLE CRUCIBLE", cx, cy - 4);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "8px Consolas, monospace";
      ctx.fillText("3.14π • 24 VAULTS", cx, cy + 8);

      // Render Shockwaves
      for (let i = anim.shockwaves.length - 1; i >= 0; i--) {
        const sw = anim.shockwaves[i];
        sw.r += 2.8;
        sw.alpha -= 0.022;
        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          anim.shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();
      }

      // Render Floating Combat Texts
      for (let i = anim.floatingTexts.length - 1; i >= 0; i--) {
        const ft = anim.floatingTexts[i];
        ft.y += ft.vy * 0.016;
        ft.alpha -= 0.012;
        if (ft.alpha <= 0) {
          anim.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = "bold 10px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }
    }

    function bindBastilleCanvasEvents() {
      const canvas = document.getElementById("bastilleArchetypesCanvas");
      if (!canvas) return;
      canvas.addEventListener("click", function (ev) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (ev.clientX - rect.left) * scaleX;
        const my = (ev.clientY - rect.top) * scaleY;

        const cx = canvas.width * 0.5;
        const cy = canvas.height * 0.51;
        const outerHexR = Math.min(canvas.width, canvas.height) * 0.43;
        const vaultRingR = outerHexR * 0.82;
        const courtyardR = outerHexR * 0.46;

        const distCenter = Math.hypot(mx - cx, my - cy);
        if (distCenter <= courtyardR * 0.85) {
          G.executeBastilleVaultBreach();
          return;
        }

        const pool = (window.SOV_ARCHETYPE_DATABANK_POOL || []).slice(0, 24);
        let bestCls = null;
        let bestDist = 24;
        pool.forEach(cls => {
          const rad = (((cls.degree || 15) - 90) * Math.PI) / 180;
          const vx = cx + Math.cos(rad) * vaultRingR;
          const vy = cy + Math.sin(rad) * vaultRingR;
          const d = Math.hypot(mx - vx, my - vy);
          if (d < bestDist) {
            bestDist = d;
            bestCls = cls;
          }
        });
        if (bestCls) {
          G.selectBastilleVault(bestCls.id);
        }
      });
    }

    /* 12-Format Polyglot Studio Serializer */
    G.selectStorageFormat = function (fmtIdx) {
      state.currentStorageFormat = fmtIdx;
      for (let i = 0; i < 12; i++) {
        const b = document.getElementById("fmtBtn_" + i);
        if (b) b.classList.toggle("active", i === fmtIdx);
      }
      const profiles = window.SOV_PROFILES_DATA || [];
      const cmds = window.SOV_COMMANDS_REGISTRY || [];
      const agency = window.SOV_AGENCY_COUNCIL || [];
      const p0 = profiles[0] || {};
      const area = document.getElementById("polyglotStudioTextarea");
      const meta = document.getElementById("studioFormatMeta");
      if (!area) return;

      if (fmtIdx === 0) {
        meta.textContent = "Format #1: JSON (.json) — Full 3.14π Circular Combat, 12-Agent Pre-Thought Agency, Commands & 11-Vector Package";
        area.value = JSON.stringify({
          piPrincipleAnchor: 3.14,
          circularDegreesComplete: 360,
          preThoughtAgencyCouncil: agency.map(a => ({ id: a.id, sectorDeg: a.angleDeg, file: a.file, weightPi: a.weightPi })),
          customizableCommands: cmds,
          characterProfiles: profiles
        }, null, 2);
      } else if (fmtIdx === 1) {
        meta.textContent = "Format #2: JSONL / NDJSON (.jsonl) — Streaming 1-Line-Per-Record Agency, Command & Character Stream";
        area.value = agency.map(a => JSON.stringify(a)).concat(cmds.map(c => JSON.stringify(c))).concat(profiles.map(p => JSON.stringify(p))).join("\n");
      } else if (fmtIdx === 2) {
        meta.textContent = "Format #3: CSV (.csv) — Spreadsheet-Ready 11-Vector & Circular Degree Matrix";
        const header = "profileId,characterName,coreArchetype,statWeightPi,armorWeightPi,weaponWeightPi,vfxType,baseHp,baseAttack,baseDefense";
        const rows = profiles.map(p => [p.profileId, '"' + p.characterName + '"', p.coreArchetype, p.statWeightPi, p.armorWeightPi, p.weaponWeightPi, p.vfxType, p.baseHp, p.baseAttack, p.baseDefense].join(","));
        area.value = [header].concat(rows).join("\n");
      } else if (fmtIdx === 3) {
        meta.textContent = "Format #4: TSV (.tsv) — Tab-Separated POSIX Stream Matrix";
        const header = "profileId\tcharacterName\tcoreArchetype\tstatWeightPi\tarmorWeightPi\tweaponWeightPi\tcommandsRuleStack";
        const rows = profiles.map(p => [p.profileId, p.characterName, p.coreArchetype, p.statWeightPi, p.armorWeightPi, p.weaponWeightPi, p.commandsRuleStack].join("\t"));
        area.value = [header].concat(rows).join("\n");
      } else if (fmtIdx === 4) {
        meta.textContent = "Format #5: SQL Relational DDL & DML (.sql) — Normalized Schema & INSERT Statements";
        const sqlHeader = "CREATE TABLE IF NOT EXISTS character_profiles_314 (\n  profile_id VARCHAR(40) PRIMARY KEY,\n  character_name VARCHAR(120),\n  core_archetype VARCHAR(40),\n  stat_weight_pi DECIMAL(6,2),\n  armor_weight_pi DECIMAL(6,2),\n  weapon_weight_pi DECIMAL(6,2),\n  vfx_type VARCHAR(40),\n  commands_stack TEXT\n);\n\n";
        const inserts = profiles.map(p => "INSERT INTO character_profiles_314 VALUES ('" + p.profileId + "', '" + p.characterName.replace(/'/g, "''") + "', '" + p.coreArchetype + "', " + p.statWeightPi + ", " + p.armorWeightPi + ", " + p.weaponWeightPi + ", '" + p.vfxType + "', '" + p.commandsRuleStack.replace(/'/g, "''") + "');").join("\n");
        area.value = sqlHeader + inserts;
      } else if (fmtIdx === 5) {
        meta.textContent = "Format #6: YAML (.yml) — Declarative Circular Combat, Agency & Command Profile";
        area.value = "sovereign-circular-studio:\n  pi-principle: 3.14\n  complete-circle-degrees: 360\n  agency-mds: 12\n  commands:\n" +
          cmds.map(c => "    - verb: " + c.verb + "\n      arc-degrees: " + (c.arcDegrees || 180) + "\n      orbit-radius-pi: " + (c.orbitRadiusPi || 2.0) + "\n      resonates-with: [" + c.resonantArchetypes.join(", ") + "]\n      resonance-multiplier: " + c.resonanceMultiplierPi).join("\n");
      } else if (fmtIdx === 6) {
        meta.textContent = "Format #7: TOML (.toml) — Strongly-Typed Game Engine Section Config";
        area.value = "[circular_combat_engine]\npi_anchor = 3.14\ndegrees_complete = 360\nummah_nodes = " + state.ummahNodes + "\n\n" +
          cmds.map(c => '[[commands]]\nverb = "' + c.verb + '"\narc_degrees = ' + (c.arcDegrees || 180) + "\norbit_radius_pi = " + (c.orbitRadiusPi || 2.0) + "\nresonance_mult = " + c.resonanceMultiplierPi + "\n").join("\n");
      } else if (fmtIdx === 7) {
        meta.textContent = "Format #8: XML (.xml) — 3D Sprite Rig & Circular Combat Schema";
        area.value = '<?xml version="1.0" encoding="UTF-8"?>\n<SovereignCircularStudio piAnchor="3.14" degrees="360">\n' +
          profiles.map(p => '  <CharacterProfile id="' + p.profileId + '" archetype="' + p.coreArchetype + '" statPi="' + p.statWeightPi + '" armorPi="' + p.armorWeightPi + '" weaponPi="' + p.weaponWeightPi + '">\n    <Commands>' + p.commandsRuleStack.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</Commands>\n  </CharacterProfile>").join("\n") +
          "\n</SovereignCircularStudio>";
      } else if (fmtIdx === 8) {
        meta.textContent = "Format #9: Protobuf-Text / FlatBuffers (.pbtxt) — Wire-Ready Message Payload";
        area.value = profiles.map((p, idx) => "character_profile {\n  field_id: " + (idx + 1) + '\n  profile_id: "' + p.profileId + '"\n  core_archetype: "' + p.coreArchetype + '"\n  stat_weight_pi: ' + p.statWeightPi + "\n  armor_weight_pi: " + p.armorWeightPi + "\n  weapon_weight_pi: " + p.weaponWeightPi + "\n}").join("\n\n");
      } else if (fmtIdx === 9) {
        meta.textContent = "Format #10: Binary TypedArray / Hex Bitmask / Base64 Seed (.bin64)";
        const rawJson = JSON.stringify({ pi: 3.14, deg: 360, nodes: state.ummahNodes, lead: p0.profileId, cmds: cmds.length, agency: 12 });
        const b64 = btoa(unescape(encodeURIComponent(rawJson)));
        area.value = "SOV_HEX_HEADER::0x00FF3140_0168\nFLOAT32_WEIGHT_VECTOR::[" + profiles.map(p => p.statWeightPi + "," + p.armorWeightPi + "," + p.weaponWeightPi).join(" | ") + "]\nBASE64_CARTRIDGE::" + b64;
      } else if (fmtIdx === 10) {
        meta.textContent = "Format #11: Property-Graph Cypher Triples (.cypher) — Pre-Thought Agency & Circular Combat Graph";
        area.value = agency.map(a => "MERGE (ag:PreThoughtAgent {id:'" + a.id + "', sectorDeg:" + a.angleDeg + ", file:'" + a.file + "'});").join("\n") + "\n\n" +
          profiles.map(p => "MERGE (u:AutonomousMuslimNode {id:'" + p.profileId + "', archetype:'" + p.coreArchetype + "', statPi:" + p.statWeightPi + "})\nMERGE (c:SingleCastle {name:'Madinah_Priory_Core', pi:3.14})\nMERGE (u)-[:ORBITS_AT_314_PI {commands:'" + p.commandsRuleStack.replace(/'/g, "") + "'}]->(c);").join("\n\n");
      } else {
        meta.textContent = "Format #12: Abjad 261 Wafq & Collegiate Markdown Table (.md)";
        area.value = "# Sovereign 3.14π Circular Combat & 12-Agent Pre-Thought Ledger\n\n| Verb | Arc Δθ° | Ring r·π | Resonant Archetypes | Multiplier |\n|---|---|---|---|---|\n" +
          cmds.map(c => "| `" + c.verb + "` | " + (c.arcDegrees || 180) + "° | " + (c.orbitRadiusPi || 2.0) + "π | " + c.resonantArchetypes.join(", ") + " | " + c.resonanceMultiplierPi + "x |").join("\n");
      }
    };

    G.injectStudioDataModel = function () {
      const area = document.getElementById("polyglotStudioTextarea");
      if (!area) return;
      try {
        if (state.currentStorageFormat === 0) {
          const parsed = JSON.parse(area.value);
          if (parsed.characterProfiles && Array.isArray(parsed.characterProfiles)) {
            window.SOV_PROFILES_DATA = parsed.characterProfiles;
          }
          if (parsed.customizableCommands && Array.isArray(parsed.customizableCommands)) {
            window.SOV_COMMANDS_REGISTRY = parsed.customizableCommands;
          }
          renderProfilesTableAndSelects();
          refreshCommandUI();
        }
      } catch (e) {
        // Non-JSON formats handled symbolically
      }
      state.barakahPower += 314.0;
      G.triggerVfxBurst("EMPOWERED");
      addLog("Hot-injected Polyglot Data Model into live 3.14π Circular Engine (+314.0π Surge)!", "#6EE7B7");
    };

    G.downloadCurrentFormatFile = function () {
      const exts = [".json", ".jsonl", ".csv", ".tsv", ".sql", ".yml", ".toml", ".xml", ".pbtxt", ".bin64", ".cypher", ".md"];
      const ext = exts[state.currentStorageFormat] || ".txt";
      const content = document.getElementById("polyglotStudioTextarea")?.value || "";
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sovereign-circular-314-model" + ext;
      a.click();
      addLog("Exported sovereign data model file: sovereign-circular-314-model" + ext, "#93C5FD");
    };

    G.filterLibraryTomes = function (query) {
      const q = (query || "").toLowerCase().trim();
      const cards = document.querySelectorAll("#castleLibraryTomeGrid .tome-card");
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = (!q || text.includes(q)) ? "flex" : "none";
      });
    };

    G.injectTomeScenario = function (seqNum) {
      const tomes = window.SOV_TOMES_DATA || [];
      const found = tomes.find(t => t.seq === seqNum) || { seq: seqNum, title: "Tome #" + seqNum };
      state.barakahPower += 98.6;
      state.ummahNodes += 7;
      G.triggerVfxBurst("SPARKLES");
      addLog("Activated Castle Library Tome #" + seqNum + " [" + found.title + "] -> Injected Scenario into 3.14π Circular Arena!", "#FDE68A");
    };

    G.studyAll67Tomes = function () {
      state.barakahPower += 3140.0;
      state.barakahRate += 31.4;
      state.ummahNodes += 68;
      G.triggerVfxBurst("EMPOWERED");
      addLog("Illuminated All 68 Portals in the Single Castle Library -> +3,140π Omniscient Circular Surge!", "#6EE7B7");
    };

    /* ========================================================================
     * DATA-DRIVEN ABSTRACTED STUDIO CHROME RENDERER & PROGRAM-ASSIGNED METRICS
     * Every top-bar metric card explains what it means and executes its assigned
     * program action when clicked.
     * ======================================================================== */
    function renderAbstractedStudioChrome() {
      const mount = document.getElementById("sovereignStudioHeaderMount");
      const schema = window.SOV_STUDIO_HEADER_SCHEMA;
      if (!mount || !schema) return;

      // 1. Render 6 Program-Assigned Interactive Telemetry Cards (Single 6-Column Row)
      const telemetryHtml = schema.telemetryCards.map(card =>
        '<div class="hud-metric" title="' + card.tooltip + '" onclick="' + card.onClickCode + '">' +
          '<div class="hud-metric-top">' +
            '<span class="hud-metric-label">' + card.label + '</span>' +
            '<span class="hud-metric-action">' + card.actionBadge + '</span>' +
          '</div>' +
          '<div class="hud-metric-row">' +
            '<span id="' + card.valId + '" class="hud-metric-val">' + card.defaultVal + '</span>' +
            '<span id="' + card.rateId + '" class="hud-metric-rate">' + card.defaultRate + '</span>' +
          '</div>' +
          '<div class="hud-metric-bar-bg">' +
            '<div id="' + card.barId + '" class="hud-metric-bar-fill" style="background:' + card.barColor + ';width:72%;"></div>' +
          '</div>' +
        '</div>'
      ).join("");

      // 2. Render Studio Navigation Tabs
      const tabsHtml = schema.studioTabs.map(t =>
        '<button class="studio-tab-btn' + (t.active ? ' active' : '') + '" data-tab="' + t.id + '" onclick="window.SovGame.switchStudioTab(\'' + t.id + '\')">' +
          t.label +
        '</button>'
      ).join("");

      // 3. Render Abstracted Era, Mode, Click Tool & Circular Action Selectors + Layout Controls on One Row
      const eraOpts = schema.eraOptions.map(e => '<option value="' + e.value + '">' + e.label + '</option>').join("");
      const modeOpts = schema.combatModes.map(m => '<option value="' + m.id + '">' + m.label + '</option>').join("");
      const toolOpts = schema.canvasTools.map(t => '<option value="' + t.id + '">' + t.label + '</option>').join("");
      const actionOpts = schema.circularActions.map(a => '<option value="' + a.id + '">' + a.label + '</option>').join("");

      mount.innerHTML =
        '<div class="hud-inner">' + telemetryHtml + '</div>' +
        '<nav class="studio-nav-ribbon">' +
          '<div class="studio-nav-inner">' +
            '<div class="studio-tab-group">' + tabsHtml + '</div>' +
            '<div class="studio-layout-group">' +
              '<select id="hudEraSelector" class="studio-select" style="max-width:128px;padding:0.1rem 0.25rem;font-size:0.64rem;color:#CBD5E1;" onchange="window.SovGame.setContemporaryEra(this.value)" title="Select Canon Era Palette">' +
                eraOpts +
              '</select>' +
              '<select id="abstractModeSelect" class="studio-select" style="max-width:118px;padding:0.1rem 0.25rem;font-size:0.64rem;color:#FDE68A;font-weight:700;" onchange="window.SovGame.setCombatMode(this.value)">' +
                modeOpts +
              '</select>' +
              '<select id="abstractToolSelect" class="studio-select" style="max-width:124px;padding:0.1rem 0.25rem;font-size:0.64rem;color:#6EE7B7;" onchange="window.SovGame.setCanvasClickTool(this.value)">' +
                toolOpts +
              '</select>' +
              '<select id="abstractActionSelect" class="studio-select" style="max-width:126px;padding:0.1rem 0.25rem;font-size:0.64rem;color:#93C5FD;">' +
                actionOpts +
              '</select>' +
              '<button class="btn btn-sm btn-emerald" onclick="window.SovGame.executeAbstractAction()">⚡ Cast</button>' +
              '<span class="badge badge-emerald" style="font-family:Consolas,monospace;font-size:0.62rem;" title="Polar Gemini SPC Limit-Cycle">♊ <strong id="hudSpcBadgeVal">S0 Cp=1.62</strong></span>' +
              '<button id="layoutBtn_1x" class="btn btn-sm" onclick="window.SovGame.setViewportLayout(\'1x\')">1x</button>' +
              '<button id="layoutBtn_2x" class="btn btn-sm active" onclick="window.SovGame.setViewportLayout(\'2x\')">2x</button>' +
              '<button id="layoutBtn_4x" class="btn btn-sm" onclick="window.SovGame.setViewportLayout(\'4x\')">4x</button>' +
              '<button id="toggleAStarBtn" class="btn btn-sm active" onclick="window.SovGame.toggleAStarGrid()" title="Toggle 24-Spoke Degree Protractor">📐</button>' +
              '<button class="btn btn-sm" onclick="const d=document.getElementById(\'conceptPlatesDrawer\');if(d)d.style.display=d.style.display===\'none\'?\'grid\':\'none\';" title="Toggle 4 Concept Art Plates">🖼️</button>' +
              '<button id="theaterToggleBtn" class="btn btn-sm btn-sapphire" onclick="window.SovGame.toggleTheaterExpanded()" title="Full-Width Theater">↔</button>' +
            '</div>' +
          '</div>' +
        '</nav>';
    }

    /* Program-Assigned Metric Card Click Dispatcher */
    G.assignMetricAction = function (assignmentKey) {
      if (assignmentKey === "CLASS_FORGE") {
        G.switchStudioTab("ALL");
        const sec = document.getElementById("studioSec_COMMAND_FORGE");
        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        addLog("🛡️ Metric #1 [Active Class & 15° Sector] -> Opened Interactive Class & Command Forge!", "#6EE7B7");
      } else if (assignmentKey === "SHIFT_UNIT_RING") {
        G.cycleUnitRing(state.selectedUnitIndex);
      } else if (assignmentKey === "SPAWN_LOADOUT") {
        G.spawnForgedClassInArena(state.selectedDatabankClassId);
      } else if (assignmentKey === "TEST_ANGLE_CLASH") {
        G.executeLiveClashOnCanvas();
      } else if (assignmentKey === "FIRE_360_FINISHER") {
        G.triggerGlobal360CompletionPulse();
      } else if (assignmentKey === "RUN_3V3_COALITION") {
        G.triggerDatabankCoalitionBattle("3v3", state.selectedDatabankClassId, false);
      }
    };

    G.executeAbstractAction = function (actionIdOverride) {
      const act = actionIdOverride || document.getElementById("abstractActionSelect")?.value || "PULSE_360";
      if (act === "PULSE_360") {
        G.triggerGlobal360CompletionPulse();
      } else if (act === "AGENCY_AUTOTUNE") {
        G.runFull360AgencyAutoTune();
      } else {
        G.triggerVfxBurst(act);
      }
    };

    const dslArea = document.getElementById("dslScriptEditorArea");
    if (dslArea && window.SOV_DEFAULT_DSL_SCRIPT) {
      dslArea.value = window.SOV_DEFAULT_DSL_SCRIPT;
    }

    /* ============================================================================
     * 🤖 AUTOMATED 2v2 & 3v3 ARCHETYPE COMBAT HOST COMPONENTS (60 FPS PODS)
     * ============================================================================ */
    state.autoHostConfig = {
      running: true,
      speedMult: 1.0,
      matchmakingMode: "BASTION_VS_BASTION"
    };
    state.autoHosts = {
      "2v2": null,
      "3v3": null
    };

    function createAutoHostFighter(cls, side, slotIdx, teamSize) {
      const m = window.SovCommandEngine.computeClassProceduralMetrics(cls);
      const stepDeg = 360 / teamSize;
      const baseAngle = (slotIdx * stepDeg + (side === "A" ? 15 : 15 + stepDeg * 0.5)) % 360;
      const ringOptions = [1.57, 2.35, 3.14];
      const orbitRadiusPi = ringOptions[slotIdx % ringOptions.length];
      return {
        id: cls.id,
        name: cls.name.replace(/^\d+°\s*/, ""),
        fullName: cls.name,
        degree: cls.degree || 15,
        side: side,
        slotIdx: slotIdx,
        color: side === "A" ? "#10B981" : "#F43F5E",
        accentColor: cls.color || (side === "A" ? "#6EE7B7" : "#FDA4AF"),
        maxHp: m.effectiveHp,
        hp: m.effectiveHp,
        atk: m.effectiveAtk,
        def: m.effectiveDef,
        powerPi: m.compositePowerScore,
        wpnName: m.wpn.name,
        splName: m.spl.name,
        orbitAngleDeg: baseAngle,
        orbitRadiusPi: orbitRadiusPi,
        angularVelDegPerSec: (side === "A" ? 1 : -1) * (28 + (cls.degree % 45) * 0.45 + slotIdx * 4),
        attackCooldown: 0.45 + slotIdx * 0.22,
        lastDmg: 0,
        lastPhi: 135,
        kills: 0,
        eloRating: cls.eloRating || 1650
      };
    }

    function draftAutoHostTeams(mode, waveNum) {
      const count = mode === "2v2" ? 2 : 3;
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const wings = (window.SovCommandEngine && window.SovCommandEngine.getBastilleWingsSchema)
        ? window.SovCommandEngine.getBastilleWingsSchema()
        : [];
      const mm = state.autoHostConfig.matchmakingMode || "BASTION_VS_BASTION";

      let teamAClasses = [];
      let teamBClasses = [];
      let title = "";

      if (mm === "SAVED_ROSTER_GAUNTLET" && window.SovCommandEngine && window.SovCommandEngine.getSavedRosters) {
        const saved = window.SovCommandEngine.getSavedRosters();
        const rAIds = (saved[mode] && saved[mode].rosterA) || [];
        teamAClasses = rAIds.map(id => pool.find(c => c.id === id)).filter(Boolean);
        const wingB = wings[(waveNum + (mode === "3v3" ? 2 : 0)) % Math.max(1, wings.length)];
        const wingBPool = wingB ? pool.filter(c => c.degree >= wingB.degMin && c.degree <= wingB.degMax) : pool;
        for (let i = 0; i < count; i++) {
          if (!teamAClasses[i]) teamAClasses[i] = pool[(waveNum + i) % pool.length];
          teamBClasses.push(wingBPool[(waveNum + i) % wingBPool.length] || pool[(waveNum + i + 4) % pool.length]);
        }
        title = "Wave #" + waveNum + ": Saved Roster A vs. " + (wingB ? wingB.shortTitle : "Bastille Squad");
      } else if (mm === "TOP_ELO_CHAMPIONS") {
        const sorted = pool.slice().sort((a, b) => (b.eloRating || 1650) - (a.eloRating || 1650));
        const offset = ((waveNum - 1) * 2) % Math.max(1, sorted.length - count * 2);
        for (let i = 0; i < count; i++) {
          teamAClasses.push(sorted[(offset + i * 2) % sorted.length]);
          teamBClasses.push(sorted[(offset + i * 2 + 1) % sorted.length]);
        }
        title = "Wave #" + waveNum + ": Top ELO Sovereign Bracket (" + teamAClasses[0].degree + "° vs. " + teamBClasses[0].degree + "°)";
      } else if (mm === "FULL_24_VAULT_CYCLE") {
        const baseIdx = ((waveNum - 1) * count + (mode === "3v3" ? 6 : 0)) % pool.length;
        for (let i = 0; i < count; i++) {
          teamAClasses.push(pool[(baseIdx + i) % pool.length]);
          teamBClasses.push(pool[(baseIdx + i + 12) % pool.length]);
        }
        title = "Wave #" + waveNum + ": Vaults " + teamAClasses.map(c => c.degree + "°").join("/") + " vs. " + teamBClasses.map(c => c.degree + "°").join("/");
      } else {
        // Default: BASTION_VS_BASTION (Equilateral 60° Wing vs. Wing)
        const wAIdx = (waveNum - 1 + (mode === "3v3" ? 2 : 0)) % Math.max(1, wings.length);
        const wBIdx = (wAIdx + (mode === "3v3" ? 3 : 1)) % Math.max(1, wings.length);
        const wA = wings[wAIdx];
        const wB = wings[wBIdx];
        const poolA = wA ? pool.filter(c => c.degree >= wA.degMin && c.degree <= wA.degMax) : pool;
        const poolB = wB ? pool.filter(c => c.degree >= wB.degMin && c.degree <= wB.degMax) : pool;
        for (let i = 0; i < count; i++) {
          teamAClasses.push(poolA[(waveNum + i) % poolA.length] || pool[i]);
          teamBClasses.push(poolB[(waveNum + i) % poolB.length] || pool[(i + 6) % pool.length]);
        }
        title = "Wave #" + waveNum + ": " + (wA ? wA.shortTitle : "Bastion A") + " vs. " + (wB ? wB.shortTitle : "Bastion B");
      }

      return {
        teamAClasses: teamAClasses,
        teamBClasses: teamBClasses,
        title: title
      };
    }

    function initOrSpawnAutoHostPod(mode) {
      const prev = state.autoHosts[mode];
      const waveNum = prev ? prev.waveNumber + 1 : 1;
      const drafted = draftAutoHostTeams(mode, waveNum);
      const count = mode === "2v2" ? 2 : 3;

      const fightersA = drafted.teamAClasses.map((c, idx) => createAutoHostFighter(c, "A", idx, count));
      const fightersB = drafted.teamBClasses.map((c, idx) => createAutoHostFighter(c, "B", idx, count));

      state.autoHosts[mode] = {
        mode: mode,
        waveNumber: waveNum,
        title: drafted.title,
        fightersA: fightersA,
        fightersB: fightersB,
        globalPhaseDeg: 0,
        completedCircles: 0,
        meanTorquePi: 72.4,
        clashBeams: [],
        shockwaves: [{ r: 14, maxR: 92, alpha: 1.0, color: mode === "2v2" ? "#3B82F6" : "#D4AF37" }],
        floatingTexts: [],
        winnerSide: null,
        intermissionSec: 0,
        historyLogs: prev ? prev.historyLogs.slice(0, 10) : []
      };

      renderAutomatedHostPodHTML(mode);
    }

    function resolveAutoHostPodVictory(pod, winningSide) {
      if (pod.winnerSide) return;
      pod.winnerSide = winningSide;
      pod.intermissionSec = 2.4;

      const winners = winningSide === "A" ? pod.fightersA : pod.fightersB;
      const losers = winningSide === "A" ? pod.fightersB : pod.fightersA;
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];

      winners.forEach(f => {
        const cls = pool.find(c => c.id === f.id);
        if (cls) {
          cls.wins = (cls.wins || 14) + 1;
          cls.eloRating = Math.min(2850, (cls.eloRating || 1650) + 12);
          f.eloRating = cls.eloRating;
        }
      });
      losers.forEach(f => {
        const cls = pool.find(c => c.id === f.id);
        if (cls) {
          cls.losses = (cls.losses || 4) + 1;
          cls.eloRating = Math.max(1100, (cls.eloRating || 1650) - 9);
          f.eloRating = cls.eloRating;
        }
      });

      if (window.SovCommandEngine && window.SovCommandEngine.savePersistedDatabankState) {
        window.SovCommandEngine.savePersistedDatabankState();
      }

      const winNames = winners.map(f => f.degree + "° " + f.name.split(" ")[0]).join(" + ");
      const loseNames = losers.map(f => f.degree + "° " + f.name.split(" ")[0]).join(" + ");
      const logLine =
        "🏆 [Wave #" + pod.waveNumber + " " + pod.mode + "] Team " + winningSide + " (" + winNames + ") def. (" + loseNames + ") • ⭕ " +
        pod.completedCircles.toFixed(1) + " (2π) • τ=" + Math.round(pod.meanTorquePi) + "π";

      pod.historyLogs.unshift({
        wave: pod.waveNumber,
        winnerSide: winningSide,
        text: logLine
      });
      if (pod.historyLogs.length > 10) pod.historyLogs.pop();

      pod.shockwaves.push({
        r: 12,
        maxR: 110,
        alpha: 1.0,
        color: winningSide === "A" ? "#10B981" : "#F43F5E"
      });
      pod.floatingTexts.push({
        x: 280,
        y: 105,
        vy: -18,
        alpha: 1.0,
        color: "#FDE68A",
        text: "🏆 TEAM " + winningSide + " WINS " + pod.mode + " WAVE #" + pod.waveNumber + "! (+12 ELO)"
      });

      renderAutomatedHostPodHTML(pod.mode);
      renderDatabankArchetypePoolTable();
    }

    function stepSingleAutoHostPod(pod, dt) {
      if (!pod) return;
      if (pod.winnerSide) {
        pod.intermissionSec -= dt;
        if (pod.intermissionSec <= 0) {
          initOrSpawnAutoHostPod(pod.mode);
        }
        return;
      }

      const effDt = dt * (state.autoHostConfig.speedMult || 1.0);
      pod.globalPhaseDeg += effDt * 68;
      if (pod.globalPhaseDeg >= 360) {
        pod.globalPhaseDeg -= 360;
        pod.completedCircles += 1;
        // 360° (2π) 3.14x Finisher Surge across all living fighters!
        pod.shockwaves.push({ r: 10, maxR: 105, alpha: 1.0, color: "#D4AF37" });
        pod.floatingTexts.push({
          x: 280,
          y: 42,
          vy: -16,
          alpha: 1.0,
          color: "#FDE68A",
          text: "⭕ 360° (2π) 3.14x FINISHER SURGE! (Circle #" + pod.completedCircles + ")"
        });
      }

      const aliveA = pod.fightersA.filter(f => f.hp > 0);
      const aliveB = pod.fightersB.filter(f => f.hp > 0);

      if (aliveA.length === 0 || aliveB.length === 0) {
        resolveAutoHostPodVictory(pod, aliveA.length >= aliveB.length ? "A" : "B");
        return;
      }

      const allFighters = pod.fightersA.concat(pod.fightersB);
      allFighters.forEach(f => {
        if (f.hp <= 0) return;
        f.orbitAngleDeg = (f.orbitAngleDeg + f.angularVelDegPerSec * effDt + 360) % 360;
        f.attackCooldown -= effDt;
        if (f.attackCooldown <= 0) {
          const enemies = f.side === "A" ? aliveB : aliveA;
          if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            const rawDiff = Math.abs(f.orbitAngleDeg - target.orbitAngleDeg) % 360;
            const phi = rawDiff > 180 ? 360 - rawDiff : rawDiff;
            const zoneMult = phi >= 135 ? 1.57 : (phi >= 45 ? 1.31 : 0.92);
            const surgeMult = pod.globalPhaseDeg >= 310 ? 1.45 : 1.0;
            const rawDmg = (f.atk * 1.18 * zoneMult * surgeMult) - target.def * 0.42;
            const dmg = Math.max(48, Math.round(rawDmg));
            target.hp = Math.max(0, target.hp - dmg);
            f.lastDmg = dmg;
            f.lastPhi = Math.round(phi);
            f.attackCooldown = 0.72 + (f.slotIdx * 0.14);

            const torque = +(f.orbitRadiusPi * Math.PI * (f.atk * 0.24) * Math.max(0.35, Math.sin((phi * Math.PI) / 180))).toFixed(1);
            pod.meanTorquePi = +(pod.meanTorquePi * 0.8 + torque * 0.2).toFixed(1);

            pod.clashBeams.push({
              fromDeg: f.orbitAngleDeg,
              fromR: f.orbitRadiusPi,
              toDeg: target.orbitAngleDeg,
              toR: target.orbitRadiusPi,
              color: f.side === "A" ? "#10B981" : "#F43F5E",
              alpha: 0.95,
              phi: Math.round(phi),
              dmg: dmg
            });

            if (target.hp <= 0) {
              f.kills += 1;
              pod.shockwaves.push({
                r: 8,
                maxR: 65,
                alpha: 1.0,
                color: f.side === "A" ? "#10B981" : "#F43F5E"
              });
            }
          }
        }
      });

      const remA = pod.fightersA.filter(f => f.hp > 0);
      const remB = pod.fightersB.filter(f => f.hp > 0);
      if (remA.length === 0 || remB.length === 0) {
        resolveAutoHostPodVictory(pod, remA.length >= remB.length ? "A" : "B");
      } else if (pod.completedCircles >= 4) {
        const hpSumA = remA.reduce((s, f) => s + f.hp, 0);
        const hpSumB = remB.reduce((s, f) => s + f.hp, 0);
        resolveAutoHostPodVictory(pod, hpSumA >= hpSumB ? "A" : "B");
      }
    }

    function renderSingleAutoHostPodCanvas(mode) {
      const canvasId = mode === "2v2" ? "autoHost2v2Canvas" : "autoHost3v3Canvas";
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const pod = state.autoHosts[mode];
      if (!pod) return;

      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;
      const cx = W * 0.5;
      const cy = H * 0.52;
      const maxR = Math.min(W, H) * 0.41;

      ctx.clearRect(0, 0, W, H);

      // Radial Background
      const bg = ctx.createRadialGradient(cx, cy, 8, cx, cy, maxR * 1.35);
      bg.addColorStop(0, mode === "2v2" ? "#0B192C" : "#1A140B");
      bg.addColorStop(0.7, "#050B16");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw 6 Equilateral 60° Sector Spokes & 24 15° Protractor Ticks
      for (let deg = 0; deg < 360; deg += 15) {
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = deg % 60 === 0;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * (isMajor ? 14 : maxR * 0.85), cy + Math.sin(rad) * (isMajor ? 14 : maxR * 0.85));
        ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
        ctx.strokeStyle = isMajor ? "rgba(212, 175, 55, 0.28)" : "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = isMajor ? 1.2 : 0.8;
        ctx.stroke();
      }

      // Draw Concentric π Rings (1.57π, 2.35π, 3.14π)
      [0.5, 0.75, 1.0].forEach((ratio, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 2 ? "rgba(212, 175, 55, 0.45)" : "rgba(147, 197, 253, 0.18)";
        ctx.lineWidth = idx === 2 ? 1.6 : 1.0;
        ctx.stroke();
      });

      // Global 360° (2π) Finisher Progress Ring
      const progRad = ((pod.globalPhaseDeg / 360) * Math.PI * 2) - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR + 5, -Math.PI / 2, progRad);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2.4;
      ctx.stroke();

      const getFighterPos = (f) => {
        const rad = ((f.orbitAngleDeg - 90) * Math.PI) / 180;
        const rPx = (f.orbitRadiusPi / 3.14) * maxR;
        return {
          x: cx + Math.cos(rad) * rPx,
          y: cy + Math.sin(rad) * rPx
        };
      };

      // Draw Formation Geometry (180° Polar Axis for 2v2, 120° Equilateral Triangle for 3v3)
      ["A", "B"].forEach(side => {
        const team = (side === "A" ? pod.fightersA : pod.fightersB).filter(f => f.hp > 0);
        if (team.length >= 2) {
          ctx.save();
          ctx.beginPath();
          team.forEach((f, idx) => {
            const p = getFighterPos(f);
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          if (team.length === 3) ctx.closePath();
          ctx.strokeStyle = side === "A" ? "rgba(16, 185, 129, 0.35)" : "rgba(244, 63, 94, 0.35)";
          ctx.fillStyle = side === "A" ? "rgba(16, 185, 129, 0.07)" : "rgba(244, 63, 94, 0.07)";
          if (team.length === 3) ctx.fill();
          ctx.setLineDash([4, 3]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Draw Active Clash Beams
      for (let i = pod.clashBeams.length - 1; i >= 0; i--) {
        const b = pod.clashBeams[i];
        b.alpha -= 0.045;
        if (b.alpha <= 0) {
          pod.clashBeams.splice(i, 1);
          continue;
        }
        const r1 = ((b.fromDeg - 90) * Math.PI) / 180;
        const r2 = ((b.toDeg - 90) * Math.PI) / 180;
        const x1 = cx + Math.cos(r1) * ((b.fromR / 3.14) * maxR);
        const y1 = cy + Math.sin(r1) * ((b.fromR / 3.14) * maxR);
        const x2 = cx + Math.cos(r2) * ((b.toR / 3.14) * maxR);
        const y2 = cy + Math.sin(r2) * ((b.toR / 3.14) * maxR);

        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        const mx = (x1 + x2) * 0.5;
        const my = (y1 + y2) * 0.5;
        ctx.fillStyle = "#FDE68A";
        ctx.font = "bold 8.5px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText("-" + b.dmg + " (φ=" + b.phi + "°)", mx, my - 4);
        ctx.restore();
      }

      // Draw All Fighters (2v2 = 4 fighters, 3v3 = 6 fighters)
      pod.fightersA.concat(pod.fightersB).forEach(f => {
        const pos = getFighterPos(f);
        const dead = f.hp <= 0;

        ctx.save();
        ctx.globalAlpha = dead ? 0.28 : 1.0;

        // Fighter Token Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dead ? 7 : 10, 0, Math.PI * 2);
        ctx.fillStyle = f.side === "A" ? "#065F46" : "#881337";
        ctx.fill();
        ctx.strokeStyle = f.side === "A" ? "#34D399" : "#FB7185";
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Degree label inside token
        ctx.fillStyle = "#F8FAFC";
        ctx.font = "bold 7.5px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(f.degree + "°", pos.x, pos.y);

        // Mini HP Bar above Fighter
        if (!dead) {
          const bw = 28;
          const bh = 3.5;
          const hpPct = Math.max(0, Math.min(1, f.hp / Math.max(1, f.maxHp)));
          ctx.fillStyle = "rgba(2,6,23,0.85)";
          ctx.fillRect(pos.x - bw / 2, pos.y - 16, bw, bh);
          ctx.fillStyle = f.side === "A" ? "#10B981" : "#F43F5E";
          ctx.fillRect(pos.x - bw / 2, pos.y - 16, bw * hpPct, bh);
        }

        // Fighter short name below token
        ctx.fillStyle = f.side === "A" ? "#6EE7B7" : "#FDA4AF";
        ctx.font = "8px Consolas, monospace";
        ctx.fillText(f.name.split(" ")[0], pos.x, pos.y + 16);
        ctx.restore();
      });

      // Shockwaves
      for (let i = pod.shockwaves.length - 1; i >= 0; i--) {
        const sw = pod.shockwaves[i];
        sw.r += 2.2;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0 || sw.r >= sw.maxR) {
          pod.shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.beginPath();
        ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.restore();
      }

      // Floating Texts
      for (let i = pod.floatingTexts.length - 1; i >= 0; i--) {
        const ft = pod.floatingTexts[i];
        ft.y += ft.vy * 0.016;
        ft.alpha -= 0.014;
        if (ft.alpha <= 0) {
          pod.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = "bold 9.5px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // Victory / Intermission Banner if Resolved
      if (pod.winnerSide) {
        ctx.save();
        ctx.fillStyle = "rgba(2, 6, 23, 0.82)";
        ctx.fillRect(cx - 145, cy - 22, 290, 44);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cx - 145, cy - 22, 290, 44);
        ctx.fillStyle = "#FDE68A";
        ctx.font = "bold 10.5px Cinzel, serif";
        ctx.textAlign = "center";
        ctx.fillText("🏆 TEAM " + pod.winnerSide + " VICTORIOUS! (+12 ELO)", cx, cy - 5);
        ctx.fillStyle = "#6EE7B7";
        ctx.font = "9px Consolas, monospace";
        ctx.fillText("Auto-Queuing Wave #" + (pod.waveNumber + 1) + " in " + Math.max(0.1, pod.intermissionSec).toFixed(1) + "s...", cx, cy + 11);
        ctx.restore();
      }
    }

    function renderAutomatedHostPodHTML(mode) {
      const pod = state.autoHosts[mode];
      if (!pod) return;
      const prefix = mode === "2v2" ? "autoHost2v2" : "autoHost3v3";
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

      setTxt(prefix + "Title", pod.title);
      setTxt(
        prefix + "WaveBadge",
        "Wave #" + pod.waveNumber + " • ⭕ " + (pod.completedCircles + pod.globalPhaseDeg / 360).toFixed(1) + " (2π)"
      );

      const aliveA = pod.fightersA.filter(f => f.hp > 0).length;
      const aliveB = pod.fightersB.filter(f => f.hp > 0).length;
      setTxt(prefix + "TeamABadge", "🟢 TEAM A (" + aliveA + "/" + pod.fightersA.length + " Alive)");
      setTxt(prefix + "TeamBBadge", "🔴 TEAM B (" + aliveB + "/" + pod.fightersB.length + " Alive)");
      setTxt(
        prefix + "StatusOverlay",
        pod.winnerSide
          ? ("🏆 TEAM " + pod.winnerSide + " WON! Next in " + Math.max(0.1, pod.intermissionSec).toFixed(1) + "s")
          : ("⚡ τ=" + pod.meanTorquePi + " N·π • " + Math.round(pod.globalPhaseDeg) + "°/360°")
      );

      const vitalsEl = document.getElementById(prefix + "VitalsStrip");
      if (vitalsEl) {
        const renderTeamCol = (fighters, sideLabel, borderCol) => {
          return (
            '<div style="background:rgba(2,6,23,0.78);border:1px solid ' + borderCol + ';border-radius:6px;padding:0.32rem 0.45rem;">' +
              '<div style="font-size:0.64rem;font-weight:700;color:#FDE68A;margin-bottom:3px;">' + sideLabel + '</div>' +
              fighters.map(f => {
                const pct = Math.round((f.hp / Math.max(1, f.maxHp)) * 100);
                return (
                  '<div style="margin-bottom:3px;">' +
                    '<div style="display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:0.63rem;">' +
                      '<span style="color:' + (f.hp > 0 ? '#F8FAFC' : '#64748B') + ';font-weight:700;">' + f.degree + '° ' + f.name.slice(0, 14) + '</span>' +
                      '<span style="color:' + (f.side === 'A' ? '#6EE7B7' : '#FDA4AF') + ';">' + f.hp + '/' + f.maxHp + ' HP (' + f.eloRating + ')</span>' +
                    '</div>' +
                    '<div class="winrate-bar-outer" style="height:4px;margin-top:1px;">' +
                      '<div style="height:100%;width:' + pct + '%;background:' + (f.side === 'A' ? '#10B981' : '#F43F5E') + ';"></div>' +
                    '</div>' +
                  '</div>'
                );
              }).join("") +
            '</div>'
          );
        };
        vitalsEl.innerHTML =
          renderTeamCol(pod.fightersA, "🟢 Coalition Team A (" + mode + ")", "rgba(16,185,129,0.35)") +
          renderTeamCol(pod.fightersB, "🔴 Challenger Team B (" + mode + ")", "rgba(244,63,94,0.35)");
      }

      const logEl = document.getElementById(prefix + "LogBox");
      if (logEl) {
        if (pod.historyLogs.length === 0) {
          logEl.innerHTML = '<div style="color:#94A3B8;">⏳ Automated ' + mode + ' Wave #' + pod.waveNumber + ' in progress — ELO &amp; Win/Loss records auto-persist on completion...</div>';
        } else {
          logEl.innerHTML = pod.historyLogs.map(item =>
            '<div style="color:' + (item.winnerSide === 'A' ? '#6EE7B7' : '#FDA4AF') + ';margin-bottom:2px;">' + item.text + '</div>'
          ).join("");
        }
      }
    }

    G.toggleAutomatedCombatHosts = function () {
      state.autoHostConfig.running = !state.autoHostConfig.running;
      const badge = document.getElementById("autoHostEngineStatusBadge");
      const btn = document.getElementById("autoHostToggleBtn");
      if (badge) {
        badge.textContent = state.autoHostConfig.running ? "🟢 AUTO-HOSTING LIVE (60 FPS)" : "⏸️ AUTO-HOST PAUSED";
        badge.className = "badge " + (state.autoHostConfig.running ? "badge-emerald" : "badge-gold");
      }
      if (btn) {
        btn.textContent = state.autoHostConfig.running ? "⏸️ Pause Auto-Hosts" : "▶️ Resume Auto-Hosts";
      }
      addLog(state.autoHostConfig.running ? "🤖 Resumed 2v2 & 3v3 Automated Archetype Combat Host Components." : "⏸️ Paused 2v2 & 3v3 Automated Combat Host Components.", "#6EE7B7");
    };

    G.setAutomatedHostMatchmakingMode = function (mmMode) {
      state.autoHostConfig.matchmakingMode = mmMode || "BASTION_VS_BASTION";
      initOrSpawnAutoHostPod("2v2");
      initOrSpawnAutoHostPod("3v3");
      addLog("🤖 Switched Automated 2v2 & 3v3 Combat Host League to [" + state.autoHostConfig.matchmakingMode + "].", "#FDE68A");
    };

    G.setAutomatedHostSpeed = function (spd) {
      state.autoHostConfig.speedMult = spd || 1;
      [1, 2, 4].forEach(s => {
        const b = document.getElementById("autoHostSpd" + s);
        if (b) b.classList.toggle("active", s === spd);
      });
    };

    G.spawnNextAutomatedWave = function (which) {
      if (which === "2v2" || which === "BOTH") initOrSpawnAutoHostPod("2v2");
      if (which === "3v3" || which === "BOTH") initOrSpawnAutoHostPod("3v3");
      addLog("⏭️ Spawned Next Automated " + (which || "BOTH") + " Archetype Combat Wave!", "#6EE7B7");
    };

    G.promoteAutomatedMatchToMainWheel = function (mode) {
      const pod = state.autoHosts[mode || "3v3"];
      if (!pod || !window.SovCommandEngine || !window.SovCommandEngine.setSavedRosterSide) return;
      const idsA = pod.fightersA.map(f => f.id);
      const idsB = pod.fightersB.map(f => f.id);
      window.SovCommandEngine.setSavedRosterSide(pod.mode, "A", idsA);
      window.SovCommandEngine.setSavedRosterSide(pod.mode, "B", idsB);
      G.triggerDatabankCoalitionBattle(pod.mode, idsA[0], false);
      const sec1 = document.getElementById("studioSec_COMMAND_FORGE");
      if (sec1) sec1.scrollIntoView({ behavior: "smooth", block: "start" });
      addLog("📥 Promoted Automated " + pod.mode + " Wave #" + pod.waveNumber + " into Main Section 1 360° Roster Arena!", "#FDE68A");
    };

    // Initial Pre-Thought Gate & Data-Driven Render
    renderAbstractedStudioChrome();
    renderAgencyCouncilUI();
    renderProfilesTableAndSelects();
    refreshCommandUI();
    populateDatabankOfferingsSelects();
    refreshDatabankTemplateDropdown();
    bindArchetypeWheelCanvasEvents();
    bindBastilleCanvasEvents();
    G.selectDatabankClassForEdit("DB_ARCH_015_AEGIS_WARDEN");
    renderDatabankArchetypePoolTable();
    G.triggerDatabankCoalitionBattle("3v3", "DB_ARCH_015_AEGIS_WARDEN", true);
    renderCircularTelemetryTable();
    renderThroneRoomDepartments();
    renderCommoditiesTable();
    renderRumoredKingsGrid();
    renderCastleLibraryTomes();
    syncInspectorToSelectedUnit();
    G.setViewportLayout("2x");
    G.recalc11VectorClash();
    G.selectStorageFormat(0);
    renderBastilleOfArchetypesUI();
    initOrSpawnAutoHostPod("2v2");
    initOrSpawnAutoHostPod("3v3");

    // Live Program-Assigned Telemetry & Pre-Thought Auto-Tune Loop (Every 300ms)
    let loopTick = 0;
    setInterval(function () {
      loopTick++;
      state.barakahPower += state.barakahRate * 0.3;
      state.dinars += state.dinarRate * 0.3;

      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      const setBar = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = Math.max(6, Math.min(100, pct)) + "%"; };

      const u = state.units[state.selectedUnitIndex] || state.units[0];
      const pool = window.SOV_ARCHETYPE_DATABANK_POOL || [];
      const activeCls = pool.find(c => c.id === state.selectedDatabankClassId) || pool[0];

      // 1. Active Class & 15° Sector (Assigned -> Class Forge)
      if (activeCls) {
        setTxt("hudClassVal", activeCls.degree + "° " + activeCls.name.replace(/^\d+°\s*/, "").slice(0, 18));
        setTxt("hudClassDomainVal", activeCls.modality.replace("PHYSICAL_", "").slice(0, 10) + " (×3.14=" + activeCls.degTimes314 + "°)");
        setBar("hudBarClass", (activeCls.degree % 360 || 360) / 360 * 100);
      }

      // 2. Selected Unit HP, Hit Damage & Concentric Ring (Assigned -> Shift Unit Ring)
      if (u) {
        const hpPct = Math.round((u.hp / Math.max(1, u.maxHp)) * 100);
        setTxt("hudUnitVitalsVal", Math.round(u.hp) + " HP • " + Math.round(u.lastProceduralDmg || 165) + " DMG");
        setTxt("hudUnitRingVal", "Ring " + (u.orbitRadiusPi || 2.0).toFixed(2) + "π [" + u.verb + "]");
        setBar("hudBarVitals", hpPct);
      }

      // 3. Equipped Databank Loadout & Composite Power (Assigned -> Spawn Class in Arena)
      if (activeCls && window.SovCommandEngine) {
        const m = window.SovCommandEngine.computeClassProceduralMetrics(activeCls);
        const wShort = m.wpn.name.split(" ").slice(0, 2).join(" ");
        const sShort = m.spl.name.split(" ").slice(0, 2).join(" ");
        setTxt("hudLoadoutVal", wShort + " + " + sShort);
        setTxt("hudLoadoutPwrVal", "Pwr " + m.compositePowerScore + "π");
        setBar("hudBarLoadout", Math.min(100, (m.compositePowerScore / 320) * 100));
      }

      // 4. Attack Angle & Flank Bonus (Assigned -> Test Angle Clash)
      const phi = Math.round(state.meanIncidenceDeg || 135);
      const zoneName = phi >= 135 ? "Rear Flank Crit" : (phi >= 45 ? "Side Orbit Shear" : "Frontal Shield");
      const zoneMult = phi >= 135 ? "1.57x" : (phi >= 45 ? "1.31x" : "1.45x DEF");
      setTxt("hudAngleAdvantageVal", "φ=" + phi + "° " + zoneName);
      setTxt("hudTorqueMultVal", zoneMult + " (τ=" + Math.round(state.meanTorquePi || 60) + "π)");
      setBar("hudBarAngle", (phi / 180) * 100);

      // 5. 360° (3.14x) Finisher Meter (Assigned -> Fire 3.14x Finisher Pulse)
      const gDeg = +(state.globalPhaseDeg || 0).toFixed(1);
      const finPct = Math.round((gDeg / 360) * 100);
      setTxt("hudGlobalAngleVal", finPct + "% to 360° Finisher (" + Math.round(gDeg) + "°)");
      setTxt("hudCompletedCirclesVal", state.totalCompletedCircles + " Circles");
      setBar("hudBar360", finPct);

      // 6. 2v2 / 3v3 Coalition Record & ELO (Assigned -> Run 3v3 Coalition Clash)
      if (activeCls) {
        const wins = activeCls.wins || 18;
        const losses = activeCls.losses || 4;
        const winPct = Math.round((wins / Math.max(1, wins + losses)) * 100);
        const lastMode = state.lastCoalitionResult ? state.lastCoalitionResult.mode : "3v3";
        setTxt("hudCoalitionRecordVal", wins + "W–" + losses + "L (" + (activeCls.eloRating || 1650) + " ELO)");
        setTxt("hudCoalitionWinPctVal", winPct + "% Win (" + lastMode + ")");
        setBar("hudBarCoalition", winPct);
      }

      // 7. Pre-Thought Agency Auto-Tune Step every 6 intervals (~1.8s)
      if (window.SovAgencyEngine && window.SovAgencyEngine.isAutoTuneActive() && loopTick % 6 === 0) {
        window.SovAgencyEngine.stepCircularAutoTune(G, false);
        renderAgencyCouncilUI();
      }

      // 8. Refresh Live Animated 2v2 / 3v3 Roster vs. Roster HTML Vitals & Match Ledger
      if (state.rosterAnim) {
        renderRosterVitalsAndLedgerUI();
      }
      if (state.autoHosts && state.autoHosts["2v2"] && state.autoHosts["3v3"]) {
        renderAutomatedHostPodHTML("2v2");
        renderAutomatedHostPodHTML("3v3");
      }

      if (window.SovCommandEngine) {
        const spc = window.SovCommandEngine.spcEngine;
        setTxt("hudSpcBadgeVal", "S" + spc.stateIndex + " Cp=" + spc.cp);
      }
    }, 300);

    // 60 FPS Animated 2v2 / 3v3 Roster vs. Roster, Bastille Citadel & Automated Host Pods Loop
    let lastRosterFrameTs = performance.now();
    function animateRosterBattleLoop(nowTs) {
      const dt = Math.min(0.05, Math.max(0.005, (nowTs - lastRosterFrameTs) / 1000));
      lastRosterFrameTs = nowTs;
      stepRosterBattleAnimation(dt * (state.simSpeedMult || 1.0));
      renderArchetypeDegreeWheelCanvas();
      renderBastilleArchetypesCanvas();
      if (state.autoHostConfig && state.autoHostConfig.running) {
        stepSingleAutoHostPod(state.autoHosts["2v2"], dt);
        stepSingleAutoHostPod(state.autoHosts["3v3"], dt);
      }
      renderSingleAutoHostPodCanvas("2v2");
      renderSingleAutoHostPodCanvas("3v3");
      requestAnimationFrame(animateRosterBattleLoop);
    }

    addLog("♊ Pre-Thought Repository Agency (12 Embedded MDs in agency/) accessed FIRST — All combat curved to 3.14π Circular Degrees (0°→360°).", "#FDE68A");
    requestAnimationFrame(vp.renderAllViewports);
    requestAnimationFrame(animateRosterBattleLoop);
  });
})();
