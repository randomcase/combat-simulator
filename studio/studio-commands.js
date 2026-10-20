/* ============================================================================
 * SOVEREIGN 3.14π CIRCULAR & PROCEDURAL DEGREE COMMAND ENGINE:
 * - All Combat is Circular (0° → 360° / 2π rad) to Complete & Procedural for Impact/Degrees
 * - Archetype Resonance, Custom Command Forge, 5 Loaders, Gemini SPC & Monte Carlo
 * ============================================================================ */
(function () {
  const PI_314 = 3.14;
  const TWO_PI_628 = 6.283185;
  const DEG_TO_RAD = Math.PI / 180;

  /* Helper: Find Command by Verb or ID */
  function getCommandByVerb(verbOrId) {
    if (!verbOrId) return window.SOV_COMMANDS_REGISTRY[0];
    const clean = String(verbOrId).trim().toUpperCase();
    const found = (window.SOV_COMMANDS_REGISTRY || []).find(
      c => c.verb.toUpperCase() === clean || c.id.toUpperCase() === clean || clean.startsWith(c.verb.toUpperCase())
    );
    return found || {
      id: "CMD_DYNAMIC_" + clean,
      verb: clean,
      name: "Dynamic Circular Command: " + clean,
      category: "TACTICAL_MOVEMENT",
      resonantArchetypes: ["ARCH_SENTINEL", "ARCH_VANGUARD"],
      resonanceMultiplierPi: 1.314,
      resonantBonusDesc: "Dynamic circular command resonance (+31.4% Archetypical 360° Synergy)",
      startupFrames: 4,
      activeFrames: 12,
      recoveryFrames: 6,
      arcDegrees: 314,
      optimalAngleDeg: 180,
      orbitRadiusPi: 3.14,
      angularSpeedDeg: 140.0,
      completionBonusPi: 3.14,
      basePowerPi: 3.14,
      mitigationPi: 3.14,
      rangeTiles: 4,
      vfxType: "SPARKLES",
      spcDeltaSigma: -0.15,
      isCustom: true
    };
  }

  /* Compute Archetype Resonance between a Unit/Profile and a Command Verb */
  function evaluateArchetypeResonance(unitOrProfile, verbOrId) {
    const cmd = getCommandByVerb(verbOrId);
    const coreArch = (unitOrProfile && (unitOrProfile.coreArchetype || unitOrProfile.mappedCoreArchetype)) || "ARCH_VANGUARD";
    const archList = cmd.resonantArchetypes || [];
    const primaryMatch = archList[0] === coreArch;
    const secondaryMatch = !primaryMatch && archList.includes(coreArch);

    let multiplier = 1.0;
    let tier = "BASELINE";
    if (primaryMatch) {
      multiplier = cmd.resonanceMultiplierPi || 1.45;
      tier = "PRIME_RESONANCE";
    } else if (secondaryMatch) {
      multiplier = +(1.0 + ((cmd.resonanceMultiplierPi || 1.35) - 1.0) * 0.68).toFixed(3);
      tier = "HARMONIC_RESONANCE";
    }

    const isDefensiveCmd = cmd.category === "DEFENSIVE" || cmd.verb === "DEFEND" || cmd.verb === "HOLD" || cmd.verb === "INTERCEPT";
    const isOffensiveCmd = cmd.category === "OFFENSIVE" || cmd.verb === "ATTACK" || cmd.verb === "PURSUE_A_STAR" || cmd.verb === "SKIRMISH_KITE";
    const isSupportCmd = cmd.category === "SUPPORT" || cmd.verb === "HEAL" || cmd.verb === "BOLSTER" || cmd.verb === "PURIFY";

    const offMult = isOffensiveCmd ? multiplier : (primaryMatch ? 1.0 + (multiplier - 1.0) * 0.45 : 1.0);
    const defMult = isDefensiveCmd ? multiplier : (primaryMatch ? 1.0 + (multiplier - 1.0) * 0.55 : 1.0);
    const supportMult = isSupportCmd ? multiplier : 1.0;

    const arcDeg = cmd.arcDegrees || 314;
    const arcRad = +((arcDeg * Math.PI) / 180).toFixed(2);
    const orbitR = cmd.orbitRadiusPi || 3.14;
    const angSpeed = cmd.angularSpeedDeg || 120.0;

    return {
      command: cmd,
      coreArchetype: coreArch,
      tier: tier,
      multiplier: +multiplier.toFixed(3),
      offenseBonusPct: +((offMult - 1.0) * 100).toFixed(1),
      defenseBonusPct: +((defMult - 1.0) * 100).toFixed(1),
      supportBonusPct: +((supportMult - 1.0) * 100).toFixed(1),
      offMult: offMult,
      defMult: defMult,
      supportMult: supportMult,
      arcDegrees: arcDeg,
      arcRadians: arcRad,
      orbitRadiusPi: orbitR,
      angularSpeedDeg: angSpeed,
      spcDeltaSigma: +(cmd.spcDeltaSigma * (primaryMatch ? 1.25 : 1.0)).toFixed(3),
      summaryText: primaryMatch
        ? "⚡ PRIME RESONANCE (" + multiplier.toFixed(2) + "x | Δ" + arcDeg + "° @ r=" + orbitR.toFixed(2) + "π): [" + cmd.verb + "] resonates with [" + coreArch + "] — " + cmd.resonantBonusDesc
        : secondaryMatch
          ? "✨ HARMONIC RESONANCE (" + multiplier.toFixed(2) + "x | Δ" + arcDeg + "° @ r=" + orbitR.toFixed(2) + "π): [" + cmd.verb + "] harmonizes with [" + coreArch + "]"
          : "Standard Circular Execution (1.00x | Δ" + arcDeg + "°): [" + cmd.verb + "] on [" + coreArch + "] (Resonates best with " + archList.join(", ") + ")"
    };
  }

  /* ==========================================================================
   * 3.14π PROCEDURAL CIRCULAR IMPACT & DEGREES ENGINE
   * Computes procedural combat impact from:
   * 1. Polar Bearing Angles θ_A°, θ_D° and Relative Incidence Angle φ° ∈ [0°, 180°]
   * 2. Command Sweep Arc Span Δθ° (90°..360°) & Radian Coverage (Δθ / 360° * 2π)
   * 3. Angular Velocity ω (°/s & rad/s) & Radial Ring Distance r·π
   * 4. Centripetal Force (m·ω²·r) & Tangential Torque (τ = r × F·sin(φ))
   * 5. Circular Revolution Completion (0° → 360° / 2π = 3.14x Completion Surge)
   * ========================================================================== */
  function evaluateCircularImpact(attacker, defender, verbOrId, customIncidenceDeg, customSweepDeg, revProgressDeg) {
    const resA = evaluateArchetypeResonance(attacker, verbOrId || (attacker && attacker.verb) || "DEFEND");
    const defVerb = (defender && defender.verb) || "HOLD";
    const resD = evaluateArchetypeResonance(defender, defVerb);
    const cmd = resA.command;

    // 1. Polar Angles & Relative Incidence Angle φ° (0° = Frontal Bastion, 90° = Tangential Shear, 180° = Rear Flank)
    const thetaA = attacker && typeof attacker.angleDeg === "number" ? ((attacker.angleDeg % 360) + 360) % 360 : 45;
    const thetaD = defender && typeof defender.angleDeg === "number" ? ((defender.angleDeg % 360) + 360) % 360 : 190;
    let rawDiff = Math.abs(thetaA - thetaD) % 360;
    if (rawDiff > 180) rawDiff = 360 - rawDiff;
    const incidenceDeg = customIncidenceDeg != null && !isNaN(customIncidenceDeg)
      ? Math.max(0, Math.min(180, +customIncidenceDeg))
      : +rawDiff.toFixed(1);
    const incidenceRad = +(incidenceDeg * DEG_TO_RAD).toFixed(3);

    // 2. Command Sweep Arc Δθ° (Degrees of Circle Covered)
    const sweepDeg = customSweepDeg != null && !isNaN(customSweepDeg)
      ? Math.max(15, Math.min(360, +customSweepDeg))
      : (cmd.arcDegrees || 314);
    const sweepRad = +(sweepDeg * DEG_TO_RAD).toFixed(3);
    const circleCoverageRatio = +(sweepDeg / 360).toFixed(3);

    // 3. Orbit Radius r·π & Angular Velocity ω
    const rPi = (attacker && attacker.orbitRadiusPi) || cmd.orbitRadiusPi || PI_314;
    const omegaDeg = ((cmd.angularSpeedDeg || 120) * resA.multiplier);
    const omegaRad = +(omegaDeg * DEG_TO_RAD).toFixed(3);

    // 4. Procedural Degree Alignment & Sector Physics
    const isDefensive = cmd.category === "DEFENSIVE" || cmd.verb === "DEFEND" || cmd.verb === "HOLD" || cmd.verb === "INTERCEPT";
    let degreeImpactMult = 1.0;
    let sectorZoneLabel = "TANGENTIAL_SHEAR (90°)";

    if (incidenceDeg < 45) {
      sectorZoneLabel = "FRONTAL_AEGIS_SECTOR (0°–45°)";
      // Frontal clash rewards Defensive Shield Wall resonance (+45%..+65%)
      degreeImpactMult = isDefensive ? +(1.314 + (sweepDeg / 360) * 0.314).toFixed(3) : 1.05;
    } else if (incidenceDeg < 135) {
      sectorZoneLabel = "TANGENTIAL_ORBIT_SHEAR (45°–135°)";
      // Tangential shear maximizes centripetal torque τ = r * F * sin(φ)
      degreeImpactMult = +(1.18 + Math.sin(incidenceRad) * 0.314).toFixed(3);
    } else {
      sectorZoneLabel = "DIAMETRIC_FLANK_APEX (135°–180°)";
      // 180° diametric flank grants π/2 (1.57x) to 2.0x critical angular impact
      degreeImpactMult = +(1.42 + (incidenceDeg / 180) * 0.45).toFixed(3);
    }

    // 5. Circular Revolution Completion (0° → 360° / 2π)
    let rawRev = revProgressDeg != null && !isNaN(revProgressDeg)
      ? +revProgressDeg
      : ((attacker && attacker.revProgressDeg) || 282.6);
    const curRevDeg = rawRev >= 360 ? 360 : (((rawRev % 360) + 360) % 360);
    const completionPct = +((curRevDeg / 360) * 100).toFixed(1);
    const isCircleComplete = curRevDeg >= 345;
    const completionMult = isCircleComplete
      ? (cmd.completionBonusPi || PI_314)
      : +(1.0 + (curRevDeg / 360) * 0.628).toFixed(3);

    // 6. Centripetal Force & Tangential Torque in π-Units
    const massPi = ((attacker && (attacker.statWeightPi || attacker.statW)) || 6.28) + ((attacker && (attacker.weaponWeightPi || attacker.weaponW)) || 3.14);
    const centripetalForcePi = +(massPi * Math.pow(omegaRad * 0.314, 2) * rPi).toFixed(2);
    const tangentialTorquePi = +(rPi * centripetalForcePi * (0.5 + Math.abs(Math.sin(incidenceRad * 0.5 + 0.52)))).toFixed(2);

    // 7. Procedural Hit & Shield Mitigation Calculation
    const baseAtk = (attacker && (attacker.baseAttack || attacker.atk)) || 145;
    const baseDef = (defender && (defender.baseDefense || defender.def)) || 105;
    const statW = (attacker && (attacker.statWeightPi || attacker.statW)) || 6.28;
    const weapW = (attacker && (attacker.weaponWeightPi || attacker.weaponW)) || 3.14;
    const armW = (defender && (defender.armorWeightPi || defender.armorW)) || 2.51;

    const arcPowerFactor = 1.0 + (sweepDeg / 360) * 0.628;
    const rawProceduralOffense = baseAtk * (statW / PI_314) * (1 + weapW / TWO_PI_628) * resA.offMult * arcPowerFactor * degreeImpactMult * (1 + (completionMult - 1) * 0.35);
    const selfShieldMitigation = baseDef * (armW / PI_314) * 0.628 * resA.defMult * (1 + (sweepDeg / 360) * 0.45);
    const defenderShieldMit = baseDef * (armW / PI_314) * 0.55 * resD.defMult * (incidenceDeg < 60 ? 1.314 : 0.78);
    const netProceduralDamage = Math.max(25.1, +(rawProceduralOffense - defenderShieldMit).toFixed(1));

    return {
      command: cmd,
      resonanceAttacker: resA,
      resonanceDefender: resD,
      attackerAngleDeg: +thetaA.toFixed(1),
      defenderAngleDeg: +thetaD.toFixed(1),
      incidenceAngleDeg: incidenceDeg,
      incidenceRad: incidenceRad,
      sectorZoneLabel: sectorZoneLabel,
      sweepArcDeg: sweepDeg,
      sweepArcRad: sweepRad,
      circleCoverageRatio: circleCoverageRatio,
      orbitRadiusPi: +rPi.toFixed(2),
      angularVelocityDegPerSec: +omegaDeg.toFixed(1),
      angularVelocityRadPerSec: omegaRad,
      revProgressDeg: +curRevDeg.toFixed(1),
      completionPct: completionPct,
      isCircleComplete: isCircleComplete,
      completionMult: completionMult,
      degreeImpactMult: degreeImpactMult,
      centripetalForcePi: centripetalForcePi,
      tangentialTorquePi: tangentialTorquePi,
      rawProceduralOffense: +rawProceduralOffense.toFixed(1),
      selfShieldMitigation: +selfShieldMitigation.toFixed(1),
      defenderShieldMit: +defenderShieldMit.toFixed(1),
      netProceduralDamage: netProceduralDamage
    };
  }

  /* Command Loader #3: Gambit Rule-Stack AST Parser with Archetype Resonance & Degree Annotations */
  function parseGambitStack(ruleStackStr, unitOrProfile) {
    if (!ruleStackStr) return [];
    const steps = String(ruleStackStr).split("->").map(s => s.trim()).filter(Boolean);
    return steps.map((rawStep, idx) => {
      const m = rawStep.match(/^([A-Z0-9_]+)\s*(?:\((.*)\))?$/i);
      const rawVerb = m ? m[1].toUpperCase() : rawStep.split("(")[0].trim().toUpperCase();
      let normVerb = rawVerb;
      if (rawVerb.startsWith("ATTACK")) normVerb = "ATTACK";
      if (rawVerb.startsWith("GUARD")) normVerb = "INTERCEPT";
      const argsStr = m && m[2] ? m[2] : "";
      const res = evaluateArchetypeResonance(unitOrProfile, normVerb);
      return {
        stepIndex: idx + 1,
        rawStep: rawStep,
        verb: rawVerb,
        normalizedVerb: normVerb,
        args: argsStr,
        arcDegrees: res.arcDegrees,
        orbitRadiusPi: res.orbitRadiusPi,
        resonance: res
      };
    });
  }

  /* Command Loader #4: Priority Ring-Buffer Tick Queue (With Circular Degree Telemetry) */
  class RingBufferCommandQueue {
    constructor(capacity) {
      this.capacity = capacity || 64;
      this.items = [];
      this.seq = 0;
      this.executedHistory = [];
    }

    enqueue(scheduledTick, priority, actorName, verb, targetName, unitOrProfile, impactDegInfo) {
      const res = evaluateArchetypeResonance(unitOrProfile, verb);
      const entry = {
        id: ++this.seq,
        scheduledTick: scheduledTick,
        priority: priority,
        actorName: actorName,
        verb: res.command.verb,
        targetName: targetName || "Nearest_Target",
        resonanceMult: res.multiplier,
        resonanceTier: res.tier,
        arcDegrees: res.arcDegrees,
        orbitRadiusPi: res.orbitRadiusPi,
        incidenceDeg: impactDegInfo && impactDegInfo.incidenceDeg != null ? impactDegInfo.incidenceDeg : Math.round((unitOrProfile && unitOrProfile.angleDeg) || 180),
        impactDmg: impactDegInfo && impactDegInfo.dmg != null ? impactDegInfo.dmg : Math.round(res.command.basePowerPi * 31.4 * res.multiplier),
        vfxType: res.command.vfxType,
        startupFrames: res.command.startupFrames,
        activeFrames: res.command.activeFrames,
        recoveryFrames: res.command.recoveryFrames,
        spcDeltaSigma: res.spcDeltaSigma
      };
      this.items.push(entry);
      this.items.sort((a, b) => (a.scheduledTick - b.scheduledTick) || (a.priority - b.priority) || (a.id - b.id));
      if (this.items.length > this.capacity) {
        this.items.pop();
      }
      return entry;
    }

    popDue(currentTick) {
      const due = [];
      while (this.items.length > 0 && this.items[0].scheduledTick <= currentTick) {
        const item = this.items.shift();
        this.executedHistory.unshift(item);
        if (this.executedHistory.length > 32) this.executedHistory.pop();
        due.push(item);
      }
      return due;
    }
  }

  /* Command Loader #5: Utility-AI Policy Selector & Gemini SPC Circular Phase Controller */
  class GeminiSPCEngine {
    constructor() {
      this.stateIndex = 0; // 0=S0, 1=S1, 2=S2, 3=S3
      this.cp = 1.62;
      this.sigma = 0.42;
      this.phaseAngleDeg = 0.0;
      this.possibilityIndex = 0.18;
      this.useCorrectedMatrix = true;
      this.transitionCount = 0;
      this.history = [];
    }

    stepTick(spcDeltaSigma) {
      const noise = (Math.random() - 0.49) * 0.08;
      this.sigma = Math.max(0.15, Math.min(4.5, this.sigma + (spcDeltaSigma || 0) * 0.25 + noise));
      this.phaseAngleDeg = (this.phaseAngleDeg + 18.0) % 360;

      let compensationMsg = null;
      if (this.useCorrectedMatrix) {
        if (this.sigma >= 2.5 && this.sigma < 4.0) {
          this.sigma = Math.max(0.65, this.sigma - 1.45);
          compensationMsg = "⚡ SPC S2 Dynamic Shunt Attenuation (12ms) -> Reset circular limit cycle to S0/S1!";
          this.transitionCount++;
        } else if (this.sigma >= 1.0 && this.sigma < 2.5) {
          this.sigma = Math.max(0.40, this.sigma - 0.65);
          compensationMsg = "🛡️ SPC S1 Structural Offset Bias Injection (-1.2σ_x) -> Stabilized circular phase!";
          this.transitionCount++;
        }
      }

      this.cp = +(Math.max(0.45, 2.0 - this.sigma * 0.42)).toFixed(2);
      this.possibilityIndex = +(Math.min(0.99, Math.max(0.05, this.sigma / 4.2))).toFixed(2);

      if (this.possibilityIndex > 0.75) {
        this.sigma = 0.38;
        this.cp = 1.68;
        this.possibilityIndex = 0.12;
        compensationMsg = "🚨 Possibility Index Π > 0.75 Override Triggered -> Executed isolated line purge to S0!";
        this.transitionCount++;
      }

      const prevState = this.stateIndex;
      if (this.sigma < 1.0) this.stateIndex = 0;
      else if (this.sigma < 2.5) this.stateIndex = 1;
      else if (this.sigma < 4.0) this.stateIndex = 2;
      else this.stateIndex = 3;

      if (prevState !== this.stateIndex) {
        this.transitionCount++;
      }

      const snap = {
        stateIndex: this.stateIndex,
        stateCode: "S" + this.stateIndex,
        cp: this.cp,
        sigma: +this.sigma.toFixed(2),
        phaseAngleDeg: +this.phaseAngleDeg.toFixed(1),
        possibilityIndex: this.possibilityIndex,
        compensationMsg: compensationMsg
      };
      this.history.push(snap);
      if (this.history.length > 90) this.history.shift();
      return snap;
    }

    selectBestUtilityCommand(unit) {
      const cmds = window.SOV_COMMANDS_REGISTRY || [];
      let bestCmd = cmds[0];
      let bestScore = -999;

      for (let i = 0; i < cmds.length; i++) {
        const c = cmds[i];
        const res = evaluateArchetypeResonance(unit, c.verb);
        let situational = 1.0 + ((c.arcDegrees || 180) / 360) * 0.25;
        const hpRatio = (unit.hp || 500) / Math.max(1, unit.maxHp || 500);
        if (hpRatio < 0.55 && (c.verb === "DEFEND" || c.verb === "HEAL" || c.verb === "HOLD")) {
          situational += 0.65;
        }
        if (this.stateIndex >= 1 && c.spcDeltaSigma < 0) {
          situational += 0.50;
        }
        const score = (c.basePowerPi * 0.55 + c.mitigationPi * 0.45) * res.multiplier * situational;
        if (score > bestScore) {
          bestScore = score;
          bestCmd = c;
        }
      }
      return {
        command: bestCmd,
        utilityScore: +bestScore.toFixed(2),
        resonance: evaluateArchetypeResonance(unit, bestCmd.verb)
      };
    }
  }

  /* Command Loader #2: .cmd DSL Script Parser & Runner (Circular Degree Support) */
  function parseAndExecuteDslScript(scriptText, gameInstance) {
    const lines = String(scriptText || "").split(/\r?\n/);
    const parsedInstructions = [];
    const results = [];

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) return;
      const tokens = line.split(/\s+/);
      const op = tokens[0].toUpperCase();
      const kv = {};
      tokens.slice(1).forEach(tok => {
        const eq = tok.indexOf("=");
        if (eq > 0) {
          kv[tok.slice(0, eq).toUpperCase()] = tok.slice(eq + 1);
        }
      });

      parsedInstructions.push({ line: idx + 1, op: op, tokens: tokens, kv: kv, raw: line });

      if (op === "MODE" && tokens[1] && gameInstance && gameInstance.setCombatMode) {
        gameInstance.setCombatMode(tokens[1].toUpperCase());
        results.push("Line " + (idx + 1) + ": Switched Circular Arena Mode -> " + tokens[1].toUpperCase());
      } else if (op === "COMMAND_DEF") {
        const verb = (kv.VERB || "CUSTOM_GUARD").toUpperCase();
        const arch = (kv.ARCH || "ARCH_VANGUARD").toUpperCase();
        const resMult = parseFloat(kv.RESONANCE) || 1.50;
        const arcDeg = parseFloat(kv.ARC_DEG) || 240;
        const orbitPi = parseFloat(kv.ORBIT_PI) || 2.00;
        const speedDeg = parseFloat(kv.SPEED_DEG) || 120;
        const pwr = parseFloat(kv.POWER) || 3.77;
        const mit = parseFloat(kv.MITIGATION) || 4.71;
        const vfx = kv.VFX || "SWORD_SWIPE_AND_SPARKLES";
        registerOrUpdateCommand({
          id: "CMD_DSL_" + verb,
          verb: verb,
          name: "DSL Circular: " + verb + " (" + arcDeg + "°)",
          category: mit >= pwr ? "DEFENSIVE" : "OFFENSIVE",
          resonantArchetypes: [arch, "ARCH_SENTINEL"],
          resonanceMultiplierPi: resMult,
          resonantBonusDesc: "Defined via .cmd DSL Loader — Resonates with " + arch + " (" + resMult.toFixed(2) + "x across Δ" + arcDeg + "° @ r=" + orbitPi + "π)",
          startupFrames: 4,
          activeFrames: 14,
          recoveryFrames: 6,
          arcDegrees: arcDeg,
          optimalAngleDeg: mit >= pwr ? 0 : 180,
          orbitRadiusPi: orbitPi,
          angularSpeedDeg: speedDeg,
          completionBonusPi: 3.14,
          basePowerPi: pwr,
          mitigationPi: mit,
          rangeTiles: 3,
          vfxType: vfx,
          spcDeltaSigma: -0.28,
          isCustom: true
        });
        results.push("Line " + (idx + 1) + ": Registered Circular Command [" + verb + "] (Δ" + arcDeg + "° @ r=" + orbitPi + "π | " + arch + " " + resMult + "x)");
      } else if (op === "SPAWN" && tokens[1] && gameInstance) {
        const profId = tokens[1];
        const profIdx = (window.SOV_PROFILES_DATA || []).findIndex(p => p.profileId === profId);
        const rPi = parseFloat(kv.R_PI) || 2.00;
        const deg = parseFloat(kv.DEG) || 0;
        if (profIdx >= 0 && gameInstance.deployProfileToGrid) {
          gameInstance.deployProfileToGrid(profIdx, rPi, deg);
          results.push("Line " + (idx + 1) + ": Spawned 3D Sprite [" + profId + "] on Ring r=" + rPi + "π @ θ=" + deg + "°");
        }
      } else if (op === "GAMBIT" && tokens[1] && gameInstance) {
        const profId = tokens[1];
        const ruleStr = line.split(/\s+/).slice(2).join(" ");
        const unit = (gameInstance.state.units || []).find(u => u.profileId === profId);
        if (unit) {
          unit.gambit = ruleStr;
          results.push("Line " + (idx + 1) + ": Updated Circular Gambit AST for [" + profId + "]");
        }
      } else if (op === "EXEC" && gameInstance) {
        const actorId = kv.ACTOR || "CHAR-002-BADR-313-VANGUARD";
        const verb = kv.VERB || "DEFEND";
        const targetId = kv.TARGET || "CHAR-004-BIMARISTAN-HEALER";
        const deg = parseFloat(kv.DEG) || 180;
        const prof = (window.SOV_PROFILES_DATA || []).find(p => p.profileId === actorId) || window.SOV_PROFILES_DATA[0];
        const queued = window.SovCommandEngine.ringBuffer.enqueue(
          gameInstance.state.tickCount + 1,
          1,
          prof.characterName.split("(")[0].trim(),
          verb,
          targetId,
          prof,
          { incidenceDeg: deg }
        );
        results.push("Line " + (idx + 1) + ": Queued [" + verb + "] by [" + actorId + "] @ θ=" + deg + "° (Resonance " + queued.resonanceMult + "x)");
      } else if (op === "INJECT_SPC" && window.SovCommandEngine) {
        const snap = window.SovCommandEngine.spcEngine.stepTick(-0.55);
        results.push("Line " + (idx + 1) + ": Injected SPC Compensation -> State " + snap.stateCode + " (Cp=" + snap.cp + ", σ=" + snap.sigma + ", θ=" + snap.phaseAngleDeg + "°)");
      } else if (op === "CLASH_11VEC" && gameInstance && gameInstance.recalc11VectorClash) {
        gameInstance.recalc11VectorClash();
        results.push("Line " + (idx + 1) + ": Evaluated 3.14π Circular & 11-Vector Clash");
      } else if (op === "SIM_BATCH" && gameInstance && gameInstance.runMonteCarloTournament) {
        const iters = parseInt(kv.ITERATIONS, 10) || 150;
        gameInstance.runMonteCarloTournament(iters);
        results.push("Line " + (idx + 1) + ": Executed Circular Monte Carlo Batch (" + iters + " iterations/matchup)");
      }
    });

    return {
      instructionCount: parsedInstructions.length,
      instructions: parsedInstructions,
      executionLog: results
    };
  }

  /* Register or Update Custom Command in Registry */
  function registerOrUpdateCommand(cmdObj) {
    const reg = window.SOV_COMMANDS_REGISTRY || [];
    const idx = reg.findIndex(c => c.verb.toUpperCase() === cmdObj.verb.toUpperCase() || c.id === cmdObj.id);
    if (idx >= 0) {
      reg[idx] = Object.assign({}, reg[idx], cmdObj);
    } else {
      reg.unshift(cmdObj);
    }
    if (window.SovGame && window.SovGame.refreshCommandUI) {
      window.SovGame.refreshCommandUI();
    }
    return cmdObj;
  }

  /* Live Circular Monte Carlo & 11-Vector Tournament Matrix Engine */
  function runMonteCarloSimulation(iterationsPerPair) {
    const iters = Math.max(10, Math.min(2000, parseInt(iterationsPerPair, 10) || 100));
    const profiles = window.SOV_PROFILES_DATA || [];
    const matchups = [
      { aIdx: 0, bIdx: 10, cmdA: "SEAL_QUMQUM", cmdB: "ATTACK" },
      { aIdx: 1, bIdx: 11, cmdA: "DEFEND", cmdB: "ATTACK" },
      { aIdx: 2, bIdx: 11, cmdA: "PURSUE_A_STAR", cmdB: "HOLD" },
      { aIdx: 7, bIdx: 10, cmdA: "DEFEND", cmdB: "ATTACK" },
      { aIdx: 5, bIdx: 10, cmdA: "SKIRMISH_KITE", cmdB: "ATTACK" },
      { aIdx: 6, bIdx: 11, cmdA: "SIEGE_BOMBARD", cmdB: "HOLD" },
      { aIdx: 3, bIdx: 10, cmdA: "HEAL", cmdB: "ATTACK" },
      { aIdx: 4, bIdx: 11, cmdA: "PURIFY", cmdB: "ATTACK" }
    ];

    const results = matchups.map(m => {
      const att = profiles[m.aIdx] || profiles[0];
      const def = profiles[m.bIdx] || profiles[10];
      const resA = evaluateArchetypeResonance(att, m.cmdA);
      const resB = evaluateArchetypeResonance(def, m.cmdB);

      let aWins = 0;
      let totalTicks = 0;
      let totalCirclesCompleted = 0;
      let totalTorqueSum = 0;
      let totalSpcTransitions = 0;

      for (let i = 0; i < iters; i++) {
        let hpA = att.baseHp * resA.defMult;
        let hpB = def.baseHp * resB.defMult;
        let degA = 0;
        let degB = 180;
        let revProgressA = 0;
        let circlesA = 0;
        let ticks = 0;
        let spcTrans = 0;
        let sigma = 0.55;

        while (hpA > 0 && hpB > 0 && ticks < 40) {
          ticks++;
          const stepDegA = (resA.angularSpeedDeg * 0.25) * (0.9 + Math.random() * 0.2);
          const stepDegB = (resB.angularSpeedDeg * 0.22) * (0.9 + Math.random() * 0.2);
          degA = (degA + stepDegA) % 360;
          degB = (degB + stepDegB) % 360;
          revProgressA += stepDegA;

          let completionSurge = 1.0;
          if (revProgressA >= 360) {
            revProgressA -= 360;
            circlesA++;
            completionSurge = PI_314 * 0.55; // 360° (2π) Completion Pulse!
          }

          let incDeg = Math.abs(degA - degB) % 360;
          if (incDeg > 180) incDeg = 360 - incDeg;

          const circ = evaluateCircularImpact(att, def, m.cmdA, incDeg, resA.arcDegrees, revProgressA);
          totalTorqueSum += circ.tangentialTorquePi;

          const jitterA = 0.88 + Math.random() * 0.24;
          const jitterB = 0.88 + Math.random() * 0.24;

          const dmgAtoB = circ.netProceduralDamage * completionSurge * jitterA * 0.42;
          const rawB = def.baseAttack * (def.statWeightPi / PI_314) * (1 + def.weaponWeightPi / TWO_PI_628) * resB.offMult * jitterB;
          const dmgBtoA = Math.max(16.0, (rawB - circ.selfShieldMitigation) * 0.42);

          hpB -= dmgAtoB;
          if (hpB <= 0) break;
          hpA -= dmgBtoA;

          if (m.cmdA === "HEAL" || m.cmdA === "DEFEND") {
            hpA = Math.min(att.baseHp * resA.defMult, hpA + 18.5 * resA.multiplier);
          }

          sigma += (Math.random() - 0.46) * 0.35 + resA.spcDeltaSigma * 0.15;
          if (sigma > 1.2 || sigma < 0.25) {
            spcTrans++;
            sigma = 0.55;
          }
        }
        if (hpA >= hpB) aWins++;
        totalTicks += ticks;
        totalCirclesCompleted += circlesA;
        totalSpcTransitions += spcTrans;
      }

      const winRateA = +(aWins / iters * 100).toFixed(1);
      return {
        attackerId: att.profileId,
        attackerName: att.characterName.split("(")[0].trim(),
        attackerArch: att.coreArchetype,
        attackerCmd: m.cmdA,
        attackerArcDeg: resA.arcDegrees,
        attackerOrbitPi: resA.orbitRadiusPi,
        attackerResonance: resA.multiplier,
        defenderId: def.profileId,
        defenderName: def.characterName.split("(")[0].trim(),
        defenderArch: def.coreArchetype,
        defenderCmd: m.cmdB,
        defenderResonance: resB.multiplier,
        iterations: iters,
        winRatePct: winRateA,
        avgTicks: +(totalTicks / iters).toFixed(2),
        avgCirclesCompleted: +(totalCirclesCompleted / iters).toFixed(2),
        avgTorquePi: +(totalTorqueSum / Math.max(1, totalTicks)).toFixed(2),
        avgSpcTransitions: +(totalSpcTransitions / iters).toFixed(2)
      };
    });

    return results;
  }

  /* ==========================================================================
   * PERSISTENT 24-SECTOR (15°) & FREEFORM DATABANK ARCHETYPE POOL + CRUD LAYER
   * + AUTOMATED 1v1 / 2v2 / 3v3 COALITION PROCEDURAL ENGINE
   * ========================================================================== */
  const DATABANK_STORAGE_KEY = "SOV_ARCHETYPE_DATABANK_V314";

  function initDatabankArchetypePool() {
    const canon = (window.SOV_ARCHETYPE_DATABANK_24 || []).map(item => Object.assign({}, item));
    try {
      const raw = localStorage.getItem(DATABANK_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length >= 24) {
          window.SOV_ARCHETYPE_DATABANK_POOL = saved;
          return window.SOV_ARCHETYPE_DATABANK_POOL;
        }
      }
    } catch (e) {
      // Fallback to canonical 24 pool
    }
    window.SOV_ARCHETYPE_DATABANK_POOL = canon;
    return window.SOV_ARCHETYPE_DATABANK_POOL;
  }

  function saveDatabankPoolToStorage() {
    try {
      if (window.SOV_ARCHETYPE_DATABANK_POOL) {
        localStorage.setItem(DATABANK_STORAGE_KEY, JSON.stringify(window.SOV_ARCHETYPE_DATABANK_POOL));
      }
    } catch (e) {
      // Ignore storage quota errors
    }
  }

  function resolveDegreeGeometry(rawDegree, customOrderChaosScore) {
    const numDeg = Math.max(1, Math.min(1130.4, parseFloat(rawDegree) || 15));
    let baseDeg = numDeg % 360;
    if (baseDeg <= 0.01) baseDeg = 360;

    const sectorIndex = Math.max(1, Math.min(24, Math.round(baseDeg / 15) || 1));
    const nearest15Deg = sectorIndex * 15;

    const domains = window.SOV_EQUILATERAL_60_DOMAINS || [];
    const domainIdx = Math.min(5, Math.floor((baseDeg - 0.001) / 60));
    const domain60 = domains[domainIdx] || domains[0] || {
      id: "DOM_01_DEFENDERS",
      shortLabel: "DEFENDERS (0°–60°)",
      coreArchetype: "ARCH_VANGUARD",
      modality: "DEFENDER",
      primaryAttribute: "DEFENSE_POISE",
      color: "#10B981"
    };

    const local60Offset = +(baseDeg - domainIdx * 60).toFixed(1);
    const polarity = local60Offset <= 30.0 ? "+1_PROJECTIVE" : "-1_REFLECTIVE";
    const defaultOrderChaos = (sectorIndex % 2 === 1) ? -75 : 70;
    const orderChaosScore = customOrderChaosScore != null && !isNaN(customOrderChaosScore)
      ? Math.max(-100, Math.min(100, +customOrderChaosScore))
      : defaultOrderChaos;
    const alignment = orderChaosScore <= 0 ? "ORDER" : "CHAOS";

    return {
      inputDegree: +numDeg.toFixed(1),
      baseDeg: +baseDeg.toFixed(1),
      nearest15Deg: nearest15Deg,
      sectorIndex: sectorIndex,
      degTimes314: +(numDeg * PI_314).toFixed(2),
      degTimesPi: +(numDeg * Math.PI).toFixed(2),
      radianPi: +(numDeg / 180).toFixed(3),
      spinor720Deg: +(baseDeg + 360).toFixed(1),
      torus1130Deg: +(baseDeg * PI_314).toFixed(1),
      domain60: domain60,
      local60Offset: local60Offset,
      polarity: polarity,
      alignment: alignment,
      orderChaosScore: orderChaosScore
    };
  }

  function getOfferingById(category, id) {
    const cat = (window.SOV_DATABANK_OFFERINGS && window.SOV_DATABANK_OFFERINGS[category]) || [];
    return cat.find(x => x.id === id) || cat[0] || {};
  }

  function upsertArchetypeClassTemplate(tplInput) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const geo = resolveDegreeGeometry(tplInput.degree || 15, tplInput.orderChaosScore);
    const wpn = getOfferingById("weapons", tplInput.weaponId);
    const arm = getOfferingById("armors", tplInput.armorId);
    const spl = getOfferingById("spells", tplInput.spellId);
    const pot = getOfferingById("potions", tplInput.potionId);
    const inv = getOfferingById("inventory", tplInput.inventoryId);

    const existingIdx = pool.findIndex(x => x.id === tplInput.id);
    const prev = existingIdx >= 0 ? pool[existingIdx] : null;

    const record = {
      id: tplInput.id || ("DB_CUSTOM_" + Math.round(geo.baseDeg) + "_" + Date.now().toString().slice(-4)),
      sectorIndex: geo.sectorIndex,
      degree: geo.inputDegree,
      degTimes314: geo.degTimes314,
      degTimesPi: geo.degTimesPi,
      radianPi: geo.radianPi,
      spinor720Deg: geo.spinor720Deg,
      torus1130Deg: geo.torus1130Deg,
      name: (tplInput.name || (geo.baseDeg + "° " + geo.domain60.modality + " Specialist")).trim(),
      title: tplInput.title || ("Dominant " + geo.baseDeg + "° " + geo.domain60.modality + " (" + geo.alignment + " • " + geo.polarity + ")"),
      domain60Id: geo.domain60.id,
      domain60Name: geo.domain60.shortLabel,
      coreArchetype: tplInput.coreArchetype || geo.domain60.coreArchetype,
      modality: tplInput.modality || geo.domain60.modality,
      attribute: tplInput.attribute || geo.domain60.primaryAttribute,
      polarity: tplInput.polarity || geo.polarity,
      alignment: tplInput.alignment || geo.alignment,
      orderChaosScore: geo.orderChaosScore,
      signatureCommand: (tplInput.signatureCommand || "DEFEND").toUpperCase(),
      weaponId: wpn.id,
      armorId: arm.id,
      spellId: spl.id,
      potionId: pot.id,
      inventoryId: inv.id,
      statWeightPi: +(parseFloat(tplInput.statWeightPi) || (prev && prev.statWeightPi) || 7.85).toFixed(2),
      weaponWeightPi: wpn.weightPi || 3.14,
      armorWeightPi: arm.weightPi || 3.77,
      orbitRadiusPi: +(parseFloat(tplInput.orbitRadiusPi) || (prev && prev.orbitRadiusPi) || 2.51).toFixed(2),
      arcDegrees: Math.max(15, Math.min(360, parseInt(tplInput.arcDegrees, 10) || spl.arcDeg || 180)),
      wins: prev ? prev.wins : 1,
      losses: prev ? prev.losses : 0,
      eloRating: prev ? prev.eloRating : 1650,
      avgTorquePi: prev ? prev.avgTorquePi : 62.8,
      completed360Count: prev ? prev.completed360Count : 3,
      isCustom: tplInput.isCustom != null ? !!tplInput.isCustom : (existingIdx < 0 || (prev && prev.isCustom)),
      combatStyleDesc: tplInput.combatStyleDesc || (
        geo.baseDeg + "° (" + geo.degTimes314 + "° ×3.14 | " + geo.degTimesPi + "° ×π) " +
        geo.domain60.modality + " [" + geo.alignment + " / " + geo.polarity + "] with " + wpn.name + " & " + spl.name
      )
    };

    if (existingIdx >= 0) {
      pool[existingIdx] = record;
    } else {
      pool.unshift(record);
    }
    saveDatabankPoolToStorage();
    return record;
  }

  function cloneArchetypeClassTemplate(sourceId) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const src = pool.find(x => x.id === sourceId) || pool[0];
    const cloneId = "DB_CUSTOM_" + Math.round(src.degree) + "DEG_" + Math.floor(100 + Math.random() * 899);
    const cloned = Object.assign({}, src, {
      id: cloneId,
      name: src.name + " [Forged Variant]",
      wins: 0,
      losses: 0,
      eloRating: 1650,
      isCustom: true
    });
    pool.unshift(cloned);
    saveDatabankPoolToStorage();
    return cloned;
  }

  function deleteOrResetArchetypeClassTemplate(id) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const idx = pool.findIndex(x => x.id === id);
    if (idx < 0) return false;
    const canonMatch = (window.SOV_ARCHETYPE_DATABANK_24 || []).find(x => x.id === id);
    if (canonMatch) {
      pool[idx] = Object.assign({}, canonMatch);
    } else {
      pool.splice(idx, 1);
    }
    saveDatabankPoolToStorage();
    return true;
  }

  function resetDatabankPoolToCanon() {
    try { localStorage.removeItem(DATABANK_STORAGE_KEY); } catch (e) {}
    window.SOV_ARCHETYPE_DATABANK_POOL = (window.SOV_ARCHETYPE_DATABANK_24 || []).map(x => Object.assign({}, x));
    return window.SOV_ARCHETYPE_DATABANK_POOL;
  }

  /* Compute Comprehensive Procedural Combat Profile for a Databank Archetype Class */
  function computeClassProceduralMetrics(cls) {
    const geo = resolveDegreeGeometry(cls.degree || 15, cls.orderChaosScore);
    const wpn = getOfferingById("weapons", cls.weaponId);
    const arm = getOfferingById("armors", cls.armorId);
    const spl = getOfferingById("spells", cls.spellId);
    const pot = getOfferingById("potions", cls.potionId);
    const inv = getOfferingById("inventory", cls.inventoryId);
    const cmd = getCommandByVerb(cls.signatureCommand || "DEFEND");

    // 1. Degree × 3.14 & × π Harmonic Scaling
    const piDegreeFactor = 1.0 + (geo.baseDeg / 360) * 0.314 + (geo.inputDegree > 360 ? 0.157 : 0);
    // 2. Polarity (+1 Projective boosts offense/torque; -1 Reflective boosts mitigation/counter)
    const isProjective = (cls.polarity || geo.polarity).indexOf("+1") === 0;
    const polarityOffMult = isProjective ? 1.18 : 1.04;
    const polarityDefMult = isProjective ? 1.04 : 1.22;

    // 3. Order vs Chaos Alignment (-100 Order = low variance, high poise; +100 Chaos = high crit & speed)
    const ocScore = cls.orderChaosScore != null ? cls.orderChaosScore : geo.orderChaosScore;
    const chaosRatio = Math.max(0, ocScore) / 100;
    const orderRatio = Math.max(0, -ocScore) / 100;

    // 4. Offerings Totals (Weapon, Armor, Spell, Potion, Inventory)
    const totalArcDeg = Math.min(360, (cls.arcDegrees || cmd.arcDegrees || 180) + (wpn.arcBonusDeg || 0));
    const rawOffensePi = +(
      ((cls.statWeightPi || 7.5) * 14.5 + (wpn.weightPi || 3.14) * 18.0 + (spl.powerPi || 4.5) * 15.0) *
      (wpn.torqueMult || 1.25) *
      (pot.buffMult || 1.2) *
      polarityOffMult *
      (1 + chaosRatio * 0.22 + orderRatio * 0.10) *
      piDegreeFactor
    ).toFixed(2);

    const rawDefensePi = +(
      ((arm.mitigationPi || 4.0) * 22.0 + (cls.statWeightPi || 7.5) * 9.5 + (pot.healPi || 3.14) * 12.0) *
      polarityDefMult *
      (1 + orderRatio * 0.25) *
      (1 + (arm.reflectPct || 20) / 100)
    ).toFixed(2);

    const angularSpeedDeg = +(
      ((cmd.angularSpeedDeg || 120) + (totalArcDeg * 0.25)) *
      (inv.completionBoost || 1.2) *
      (1 + chaosRatio * 0.18)
    ).toFixed(1);

    const spcStabilityDelta = +(
      (cmd.spcDeltaSigma || -0.15) + (pot.spcDelta || -0.20) - (orderRatio * 0.25) + (chaosRatio * 0.22)
    ).toFixed(3);

    return {
      cls: cls,
      geo: geo,
      wpn: wpn,
      arm: arm,
      spl: spl,
      pot: pot,
      inv: inv,
      cmd: cmd,
      totalArcDeg: totalArcDeg,
      rawOffensePi: rawOffensePi,
      rawDefensePi: rawDefensePi,
      angularSpeedDeg: angularSpeedDeg,
      spcStabilityDelta: spcStabilityDelta,
      compositePowerScore: +(rawOffensePi * 0.55 + rawDefensePi * 0.45 + angularSpeedDeg * 0.314).toFixed(1)
    };
  }

  /* Evaluate Equilateral Team Synergy for 1v1, 2v2, or 3v3 Coalition */
  function evaluateCoalitionTeamSynergy(teamClasses) {
    if (!teamClasses || teamClasses.length === 0) return { mult: 1.0, chordLabel: "Solo (1.00x)" };
    if (teamClasses.length === 1) {
      const m0 = computeClassProceduralMetrics(teamClasses[0]);
      return {
        mult: 1.15,
        chordLabel: "Solo 1v1 Mubārazah Focus (1.15x • " + m0.geo.baseDeg + "°)",
        uniqueDomains: 1
      };
    }

    const uniqueDomains = new Set(teamClasses.map(c => c.domain60Id)).size;
    const uniqueModalities = new Set(teamClasses.map(c => c.modality)).size;
    const hasOrder = teamClasses.some(c => c.alignment === "ORDER");
    const hasChaos = teamClasses.some(c => c.alignment === "CHAOS");
    const hasPosPol = teamClasses.some(c => (c.polarity || "").indexOf("+1") === 0);
    const hasNegPol = teamClasses.some(c => (c.polarity || "").indexOf("-1") === 0);

    // Check angular chord spacing between teammates
    let equilateralBonus = 0;
    let chordType = "Standard Coalition";
    for (let i = 0; i < teamClasses.length; i++) {
      for (let j = i + 1; j < teamClasses.length; j++) {
        let diff = Math.abs((teamClasses[i].degree % 360) - (teamClasses[j].degree % 360));
        if (diff > 180) diff = 360 - diff;
        if (Math.abs(diff - 120) <= 20) {
          equilateralBonus += 0.18;
          chordType = "120° Equilateral Triangle Chord";
        } else if (Math.abs(diff - 60) <= 20) {
          equilateralBonus += 0.14;
          chordType = "60° Equilateral Hex-Chord";
        } else if (Math.abs(diff - 180) <= 20) {
          equilateralBonus += 0.16;
          chordType = "180° Diametric Pincer Axis";
        }
      }
    }

    const domainBonus = uniqueDomains * 0.08 + uniqueModalities * 0.05;
    const mizanBonus = (hasOrder && hasChaos ? 0.08 : 0) + (hasPosPol && hasNegPol ? 0.08 : 0);
    const totalMult = +(1.0 + Math.min(0.628, equilateralBonus + domainBonus + mizanBonus)).toFixed(3);

    return {
      mult: totalMult,
      chordLabel: chordType + " (" + totalMult.toFixed(2) + "x • " + uniqueDomains + " Equilateral Domains)",
      uniqueDomains: uniqueDomains
    };
  }

  /* ==========================================================================
   * PERSISTENT 2v2 & 3v3 ROSTER VS. ROSTER DATABANK MANAGER & MATCH LEDGER
   * Stores Team A Roster (3 slots), Team B Roster (3 slots), Active Mode (2v2/3v3),
   * Cumulative Roster Team W-L Records, and Match History in localStorage.
   * ========================================================================== */
  const COALITION_ROSTER_STORAGE_KEY = "SOV_COALITION_ROSTERS_V314";

  function getDefaultCoalitionRosterState() {
    return {
      mode: "3v3",
      rosterA: [
        "DB_ARCH_015_AEGIS_WARDEN",
        "DB_ARCH_135_QAWS_OVERWATCH",
        "DB_ARCH_255_BIMARISTAN_PHYSICIAN"
      ],
      rosterB: [
        "DB_ARCH_090_MAMLUK_SHOCK_LANCER",
        "DB_ARCH_210_NAFT_PYROMANCER",
        "DB_ARCH_330_SHURA_MARSHAL"
      ],
      rosterAWins2v2: 8,
      rosterBWins2v2: 3,
      rosterAWins3v3: 14,
      rosterBWins3v3: 4,
      totalMatchesPersisted: 29,
      matchHistory: [
        {
          matchNo: 29,
          mode: "3v3",
          teamANames: "15° Phalanx + 135° Qaws + 255° Physician",
          teamBNames: "90° Mamlūk + 210° Nafṭ + 330° Marshal",
          winner: "ROSTER_A",
          winProbPct: 86.4,
          circlesA: 4,
          circlesB: 2,
          meanTorqueA: 74.2,
          mvpName: "15° Badr Phalanx Warden"
        },
        {
          matchNo: 28,
          mode: "2v2",
          teamANames: "15° Phalanx + 135° Qaws",
          teamBNames: "90° Mamlūk + 210° Nafṭ",
          winner: "ROSTER_A",
          winProbPct: 81.2,
          circlesA: 3,
          circlesB: 2,
          meanTorqueA: 68.5,
          mvpName: "135° Badr Qaws Overwatch"
        }
      ]
    };
  }

  function initCoalitionRosterState() {
    const def = getDefaultCoalitionRosterState();
    try {
      const raw = localStorage.getItem(COALITION_ROSTER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.rosterA) && Array.isArray(parsed.rosterB)) {
          window.SOV_COALITION_ROSTER_STATE = Object.assign({}, def, parsed);
          return window.SOV_COALITION_ROSTER_STATE;
        }
      }
    } catch (e) {}
    window.SOV_COALITION_ROSTER_STATE = def;
    return window.SOV_COALITION_ROSTER_STATE;
  }

  function saveCoalitionRosterState() {
    try {
      if (window.SOV_COALITION_ROSTER_STATE) {
        localStorage.setItem(COALITION_ROSTER_STORAGE_KEY, JSON.stringify(window.SOV_COALITION_ROSTER_STATE));
      }
    } catch (e) {}
  }

  function getCoalitionRosterState() {
    if (!window.SOV_COALITION_ROSTER_STATE) initCoalitionRosterState();
    return window.SOV_COALITION_ROSTER_STATE;
  }

  function setCoalitionRosterMode(modeStr) {
    const st = getCoalitionRosterState();
    st.mode = (modeStr === "2v2" || modeStr === "1v1") ? modeStr : "3v3";
    saveCoalitionRosterState();
    return st;
  }

  function setCoalitionRosterSlot(teamKey, slotIdx, classId) {
    const st = getCoalitionRosterState();
    const arr = teamKey === "B" ? st.rosterB : st.rosterA;
    const idx = Math.max(0, Math.min(2, parseInt(slotIdx, 10) || 0));
    arr[idx] = classId;
    saveCoalitionRosterState();
    return st;
  }

  function assignClassToNextRosterSlot(teamKey, classId) {
    const st = getCoalitionRosterState();
    const arr = teamKey === "B" ? st.rosterB : st.rosterA;
    const teamSize = st.mode === "2v2" ? 2 : (st.mode === "1v1" ? 1 : 3);
    const existingIdx = arr.slice(0, teamSize).indexOf(classId);
    if (existingIdx === -1) {
      // Shift into active slots and persist
      if (teamSize === 1) {
        arr[0] = classId;
      } else if (teamSize === 2) {
        arr[1] = arr[0];
        arr[0] = classId;
      } else {
        arr[2] = arr[1];
        arr[1] = arr[0];
        arr[0] = classId;
      }
    }
    saveCoalitionRosterState();
    return st;
  }

  function autoBuildEquilateralRoster(teamKey, anchorClassId) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const st = getCoalitionRosterState();
    const arr = teamKey === "B" ? st.rosterB : st.rosterA;
    const otherArr = teamKey === "B" ? st.rosterA : st.rosterB;

    const lead = pool.find(c => c.id === anchorClassId) ||
                 pool.find(c => c.id === arr[0]) ||
                 pool[Math.floor(Math.random() * pool.length)];

    const chosen = [lead];
    const spacingStep = st.mode === "2v2" ? 180 : 120;
    const candidates = pool.filter(c => c.id !== lead.id && otherArr.indexOf(c.id) === -1);

    for (let s = 1; s < 3; s++) {
      const targetDeg = (lead.degree + s * spacingStep) % 360 || 360;
      candidates.sort((x, y) => {
        let dx = Math.abs((x.degree % 360 || 360) - targetDeg);
        if (dx > 180) dx = 360 - dx;
        let dy = Math.abs((y.degree % 360 || 360) - targetDeg);
        if (dy > 180) dy = 360 - dy;
        return (dx + Math.random() * 25) - (dy + Math.random() * 25);
      });
      if (candidates.length > 0) {
        chosen.push(candidates.shift());
      } else {
        chosen.push(pool[(s * 7) % pool.length]);
      }
    }

    if (teamKey === "B") {
      st.rosterB = chosen.map(c => c.id);
    } else {
      st.rosterA = chosen.map(c => c.id);
    }
    saveCoalitionRosterState();
    return st;
  }

  function swapCoalitionRosters() {
    const st = getCoalitionRosterState();
    const tmp = st.rosterA.slice();
    st.rosterA = st.rosterB.slice();
    st.rosterB = tmp;
    saveCoalitionRosterState();
    return st;
  }

  function resolveActiveRosterTeams(modeOverride) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const st = getCoalitionRosterState();
    const mode = modeOverride || st.mode || "3v3";
    const teamSize = mode === "3v3" ? 3 : (mode === "2v2" ? 2 : 1);

    const resolveSlot = (id, fallbackIdx) => pool.find(c => c.id === id) || pool[fallbackIdx % pool.length];
    const teamA = [];
    const teamB = [];
    for (let i = 0; i < teamSize; i++) {
      teamA.push(resolveSlot(st.rosterA[i], i * 4));
      teamB.push(resolveSlot(st.rosterB[i], (i * 4 + 6) % pool.length));
    }
    return {
      mode: mode,
      teamSize: teamSize,
      teamA: teamA,
      teamB: teamB,
      synergyA: evaluateCoalitionTeamSynergy(teamA),
      synergyB: evaluateCoalitionTeamSynergy(teamB),
      metricsA: teamA.map(computeClassProceduralMetrics),
      metricsB: teamB.map(computeClassProceduralMetrics)
    };
  }

  function persistCoalitionBattleOutcome(outcome) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const st = getCoalitionRosterState();
    const mode = outcome.mode || st.mode || "3v3";
    const teamA = outcome.teamA || [];
    const teamB = outcome.teamB || [];
    const teamAWon = !!outcome.teamAWon;

    teamA.forEach(c => {
      if (teamAWon) {
        c.wins = (c.wins || 0) + 1;
        if (mode === "2v2") c.wins2v2 = (c.wins2v2 || 0) + 1;
        if (mode === "3v3") c.wins3v3 = (c.wins3v3 || 0) + 1;
        c.eloRating = Math.round((c.eloRating || 1650) + 12);
      } else {
        c.losses = (c.losses || 0) + 1;
        if (mode === "2v2") c.losses2v2 = (c.losses2v2 || 0) + 1;
        if (mode === "3v3") c.losses3v3 = (c.losses3v3 || 0) + 1;
        c.eloRating = Math.max(1200, Math.round((c.eloRating || 1650) - 8));
      }
      c.completed360Count = (c.completed360Count || 0) + Math.max(1, outcome.completedCirclesA || 1);
      c.avgTorquePi = +(((c.avgTorquePi || 60) * 0.8 + (outcome.meanTorqueA || 64) * 0.2)).toFixed(1);
    });

    teamB.forEach(c => {
      if (!teamAWon) {
        c.wins = (c.wins || 0) + 1;
        if (mode === "2v2") c.wins2v2 = (c.wins2v2 || 0) + 1;
        if (mode === "3v3") c.wins3v3 = (c.wins3v3 || 0) + 1;
        c.eloRating = Math.round((c.eloRating || 1650) + 12);
      } else {
        c.losses = (c.losses || 0) + 1;
        if (mode === "2v2") c.losses2v2 = (c.losses2v2 || 0) + 1;
        if (mode === "3v3") c.losses3v3 = (c.losses3v3 || 0) + 1;
        c.eloRating = Math.max(1200, Math.round((c.eloRating || 1650) - 8));
      }
      c.completed360Count = (c.completed360Count || 0) + Math.max(1, outcome.completedCirclesB || 1);
      c.avgTorquePi = +(((c.avgTorquePi || 60) * 0.8 + (outcome.meanTorqueB || 60) * 0.2)).toFixed(1);
    });

    if (mode === "2v2") {
      if (teamAWon) st.rosterAWins2v2 = (st.rosterAWins2v2 || 0) + 1;
      else st.rosterBWins2v2 = (st.rosterBWins2v2 || 0) + 1;
    } else if (mode === "3v3") {
      if (teamAWon) st.rosterAWins3v3 = (st.rosterAWins3v3 || 0) + 1;
      else st.rosterBWins3v3 = (st.rosterBWins3v3 || 0) + 1;
    }
    st.totalMatchesPersisted = (st.totalMatchesPersisted || 0) + 1;

    const mvpCls = (teamAWon ? teamA[0] : teamB[0]) || { name: "Sovereign Vanguard" };
    const recordEntry = {
      matchNo: st.totalMatchesPersisted,
      mode: mode,
      teamANames: teamA.map(x => x.degree + "° " + x.name.replace(/^\d+°\s*/, "").split(" ").slice(0, 2).join(" ")).join(" + "),
      teamBNames: teamB.map(x => x.degree + "° " + x.name.replace(/^\d+°\s*/, "").split(" ").slice(0, 2).join(" ")).join(" + "),
      winner: teamAWon ? "ROSTER_A" : "ROSTER_B",
      winProbPct: outcome.winProbPct || 78.5,
      circlesA: outcome.completedCirclesA || 3,
      circlesB: outcome.completedCirclesB || 2,
      meanTorqueA: outcome.meanTorqueA || 68.4,
      mvpName: mvpCls.name
    };

    if (!Array.isArray(st.matchHistory)) st.matchHistory = [];
    st.matchHistory.unshift(recordEntry);
    if (st.matchHistory.length > 20) st.matchHistory.length = 20;

    saveDatabankPoolToStorage();
    saveCoalitionRosterState();
    return recordEntry;
  }

  /* Run Procedural Circular Clash between Persisted Roster A and Persisted Roster B */
  function runProceduralCoalitionEncounter(modeStr, primaryClassId, customEnemyIds, useSavedRoster) {
    if (!window.SOV_ARCHETYPE_DATABANK_POOL) initDatabankArchetypePool();
    const pool = window.SOV_ARCHETYPE_DATABANK_POOL;
    const st = getCoalitionRosterState();
    const mode = modeStr || st.mode || "3v3";
    const teamSize = mode === "3v3" ? 3 : (mode === "2v2" ? 2 : 1);

    if (primaryClassId && !useSavedRoster) {
      st.rosterA[0] = primaryClassId;
    }
    st.mode = mode;

    const resolved = resolveActiveRosterTeams(mode);
    const teamA = resolved.teamA;
    const teamB = resolved.teamB;
    const synA = resolved.synergyA;
    const synB = resolved.synergyB;
    const metricsA = resolved.metricsA;
    const metricsB = resolved.metricsB;

    // Simulate Circular Revolution Ticks (0° → 360° / 2π Phase Dominance + HP/Poise)
    let hpA = metricsA.reduce((s, m) => s + 1200 + m.rawDefensePi * 3.14, 0) * synA.mult;
    let hpB = metricsB.reduce((s, m) => s + 1200 + m.rawDefensePi * 3.14, 0) * synB.mult;
    const maxHpA = hpA;
    const maxHpB = hpB;

    let phaseDegA = 0;
    let phaseDegB = 0;
    let completedCirclesA = 0;
    let completedCirclesB = 0;
    let totalTorqueA = 0;
    let totalTorqueB = 0;
    const roundLog = [];

    for (let tick = 1; tick <= 12; tick++) {
      const mA = metricsA[(tick - 1) % metricsA.length];
      const mB = metricsB[(tick - 1) % metricsB.length];

      // Relative Incidence Angle φ° between active fighters
      let phiDeg = Math.abs((mA.cls.degree + tick * 25) - (mB.cls.degree + tick * 15)) % 360;
      if (phiDeg > 180) phiDeg = 360 - phiDeg;

      // Polarity & Alignment Counter-Bonus
      const polDiffBonusA = mA.cls.polarity !== mB.cls.polarity ? 1.15 : 1.0;
      const alignBonusA = (mA.cls.alignment === "ORDER" && mB.cls.alignment === "CHAOS") ? 1.14 : 1.06;

      // Advance Circular Phase (0° → 360°)
      const stepDegA = (mA.angularSpeedDeg * 0.38) * synA.mult * (0.92 + Math.random() * 0.16);
      const stepDegB = (mB.angularSpeedDeg * 0.38) * synB.mult * (0.92 + Math.random() * 0.16);
      phaseDegA += stepDegA;
      phaseDegB += stepDegB;

      let surgeA = 1.0;
      let surgeB = 1.0;
      if (phaseDegA >= 360) {
        phaseDegA -= 360;
        completedCirclesA++;
        surgeA = PI_314 * 0.55; // 360° (2π) Full-Circle Completion Pulse!
      }
      if (phaseDegB >= 360) {
        phaseDegB -= 360;
        completedCirclesB++;
        surgeB = PI_314 * 0.55;
      }

      const torqueA = +(mA.rawOffensePi * synA.mult * polDiffBonusA * alignBonusA * surgeA * (0.9 + Math.random() * 0.2) * 0.24).toFixed(1);
      const torqueB = +(mB.rawOffensePi * synB.mult * surgeB * (0.9 + Math.random() * 0.2) * 0.24).toFixed(1);
      totalTorqueA += torqueA;
      totalTorqueB += torqueB;

      const netDmgToB = Math.max(45, +(torqueA * 2.4 - mB.rawDefensePi * 0.32).toFixed(1));
      const netDmgToA = Math.max(45, +(torqueB * 2.4 - mA.rawDefensePi * 0.32).toFixed(1));

      hpB = Math.max(0, hpB - netDmgToB);
      hpA = Math.max(0, hpA - netDmgToA);

      if (tick <= 5 || hpA <= 0 || hpB <= 0 || surgeA > 1.0) {
        roundLog.push(
          "T#" + tick + " [φ=" + Math.round(phiDeg) + "°]: " +
          mA.cls.name + " (" + mA.cls.degree + "° • " + mA.wpn.name.split("(")[0].trim() + " + " + mA.spl.name.split(" ")[0] + ") → " +
          netDmgToB + " DMG (τ=" + torqueA + "π" + (surgeA > 1 ? " ⭕360° SURGE!" : "") + ") vs " +
          mB.cls.name + " (" + mB.cls.degree + "°)"
        );
      }
      if (hpA <= 0 || hpB <= 0) break;
    }

    const scoreA = (completedCirclesA * 650) + (hpA / maxHpA * 1000) + totalTorqueA * 0.8;
    const scoreB = (completedCirclesB * 650) + (hpB / maxHpB * 1000) + totalTorqueB * 0.8;
    const teamAWon = scoreA >= scoreB;
    const winProbPct = +((scoreA / Math.max(1, scoreA + scoreB)) * 100).toFixed(1);

    const outcome = {
      mode: mode,
      teamA: teamA,
      teamB: teamB,
      metricsA: metricsA,
      metricsB: metricsB,
      synergyA: synA,
      synergyB: synB,
      teamAWon: teamAWon,
      winProbPct: winProbPct,
      completedCirclesA: Math.max(1, completedCirclesA),
      completedCirclesB: Math.max(1, completedCirclesB),
      meanTorqueA: +(totalTorqueA / 12).toFixed(1),
      meanTorqueB: +(totalTorqueB / 12).toFixed(1),
      roundLog: roundLog
    };

    persistCoalitionBattleOutcome(outcome);
    return outcome;
  }

  // Initialize pool and persistent rosters immediately
  initDatabankArchetypePool();
  initCoalitionRosterState();

  window.SovCommandEngine = {
    getCommandByVerb: getCommandByVerb,
    evaluateArchetypeResonance: evaluateArchetypeResonance,
    evaluateCircularImpact: evaluateCircularImpact,
    parseGambitStack: parseGambitStack,
    registerOrUpdateCommand: registerOrUpdateCommand,
    parseAndExecuteDslScript: parseAndExecuteDslScript,
    runMonteCarloSimulation: runMonteCarloSimulation,
    initDatabankArchetypePool: initDatabankArchetypePool,
    resolveDegreeGeometry: resolveDegreeGeometry,
    getOfferingById: getOfferingById,
    upsertArchetypeClassTemplate: upsertArchetypeClassTemplate,
    cloneArchetypeClassTemplate: cloneArchetypeClassTemplate,
    deleteOrResetArchetypeClassTemplate: deleteOrResetArchetypeClassTemplate,
    resetDatabankPoolToCanon: resetDatabankPoolToCanon,
    computeClassProceduralMetrics: computeClassProceduralMetrics,
    evaluateCoalitionTeamSynergy: evaluateCoalitionTeamSynergy,
    runProceduralCoalitionEncounter: runProceduralCoalitionEncounter,
    getCoalitionRosterState: getCoalitionRosterState,
    setCoalitionRosterMode: setCoalitionRosterMode,
    setCoalitionRosterSlot: setCoalitionRosterSlot,
    assignClassToNextRosterSlot: assignClassToNextRosterSlot,
    autoBuildEquilateralRoster: autoBuildEquilateralRoster,
    swapCoalitionRosters: swapCoalitionRosters,
    resolveActiveRosterTeams: resolveActiveRosterTeams,
    persistCoalitionBattleOutcome: persistCoalitionBattleOutcome,
    ringBuffer: new RingBufferCommandQueue(64),
    spcEngine: new GeminiSPCEngine()
  };
})();
