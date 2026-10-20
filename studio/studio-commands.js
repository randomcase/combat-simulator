/* ============================================================================
 * SOVEREIGN 3.14π COMMAND ENGINE: ARCHETYPE RESONANCE, CUSTOM COMMAND FORGE,
 * 5 LIVE COMMAND LOADERS, GEMINI SPC MATRIX (S0..S3) & MONTE CARLO RUNNER
 * ============================================================================ */
(function () {
  const PI_314 = 3.14;

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
      name: "Dynamic Command: " + clean,
      category: "TACTICAL_MOVEMENT",
      resonantArchetypes: ["ARCH_SENTINEL", "ARCH_VANGUARD"],
      resonanceMultiplierPi: 1.314,
      resonantBonusDesc: "Dynamic command resonance (+31.4% Archetypical Synergy)",
      startupFrames: 4,
      activeFrames: 12,
      recoveryFrames: 6,
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

    // Specific Defensive / Offensive / Support bonus breakdowns
    const isDefensiveCmd = cmd.category === "DEFENSIVE" || cmd.verb === "DEFEND" || cmd.verb === "HOLD" || cmd.verb === "INTERCEPT";
    const isOffensiveCmd = cmd.category === "OFFENSIVE" || cmd.verb === "ATTACK" || cmd.verb === "PURSUE_A_STAR" || cmd.verb === "SKIRMISH_KITE";
    const isSupportCmd = cmd.category === "SUPPORT" || cmd.verb === "HEAL" || cmd.verb === "BOLSTER" || cmd.verb === "PURIFY";

    const offMult = isOffensiveCmd ? multiplier : (primaryMatch ? 1.0 + (multiplier - 1.0) * 0.45 : 1.0);
    const defMult = isDefensiveCmd ? multiplier : (primaryMatch ? 1.0 + (multiplier - 1.0) * 0.55 : 1.0);
    const supportMult = isSupportCmd ? multiplier : 1.0;

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
      spcDeltaSigma: +(cmd.spcDeltaSigma * (primaryMatch ? 1.25 : 1.0)).toFixed(3),
      summaryText: primaryMatch
        ? "⚡ PRIME RESONANCE (" + multiplier.toFixed(2) + "x): [" + cmd.verb + "] resonates with [" + coreArch + "] — " + cmd.resonantBonusDesc
        : secondaryMatch
          ? "✨ HARMONIC RESONANCE (" + multiplier.toFixed(2) + "x): [" + cmd.verb + "] harmonizes with [" + coreArch + "]"
          : "Standard Execution (1.00x): [" + cmd.verb + "] on [" + coreArch + "] (Resonates best with " + archList.join(", ") + ")"
    };
  }

  /* Command Loader #3: Gambit Rule-Stack AST Parser with Archetype Resonance Annotations */
  function parseGambitStack(ruleStackStr, unitOrProfile) {
    if (!ruleStackStr) return [];
    const steps = String(ruleStackStr).split("->").map(s => s.trim()).filter(Boolean);
    return steps.map((rawStep, idx) => {
      const m = rawStep.match(/^([A-Z0-9_]+)\s*(?:\((.*)\))?$/i);
      const rawVerb = m ? m[1].toUpperCase() : rawStep.split("(")[0].trim().toUpperCase();
      // Normalize verb aliases
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
        resonance: res
      };
    });
  }

  /* Command Loader #4: Priority Ring-Buffer Tick Queue */
  class RingBufferCommandQueue {
    constructor(capacity) {
      this.capacity = capacity || 64;
      this.items = [];
      this.seq = 0;
      this.executedHistory = [];
    }

    enqueue(scheduledTick, priority, actorName, verb, targetName, unitOrProfile) {
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

  /* Command Loader #5: Utility-AI Policy Selector & Gemini SPC Markov Controller */
  class GeminiSPCEngine {
    constructor() {
      this.stateIndex = 0; // 0=S0, 1=S1, 2=S2, 3=S3
      this.cp = 1.62;
      this.sigma = 0.42;
      this.possibilityIndex = 0.18;
      this.useCorrectedMatrix = true;
      this.transitionCount = 0;
      this.history = [];
    }

    stepTick(spcDeltaSigma) {
      // Apply command delta + slight environmental noise
      const noise = (Math.random() - 0.49) * 0.08;
      this.sigma = Math.max(0.15, Math.min(4.5, this.sigma + (spcDeltaSigma || 0) * 0.25 + noise));

      // Corrective Policy Compensation
      let compensationMsg = null;
      if (this.useCorrectedMatrix) {
        if (this.sigma >= 2.5 && this.sigma < 4.0) {
          // S2 -> Dynamic Shunt Attenuation (12ms) & Active Loop Reset
          this.sigma = Math.max(0.65, this.sigma - 1.45);
          compensationMsg = "⚡ SPC S2 Dynamic Shunt Attenuation (12ms) -> De-energized fault & reset loop to S0/S1!";
          this.transitionCount++;
        } else if (this.sigma >= 1.0 && this.sigma < 2.5) {
          // S1 -> Structural Offset Bias Injection (-1.2σ_x)
          this.sigma = Math.max(0.40, this.sigma - 0.65);
          compensationMsg = "🛡️ SPC S1 Structural Offset Bias Injection (-1.2σ_x) -> Stabilized variance!";
          this.transitionCount++;
        }
      }

      this.cp = +(Math.max(0.45, 2.0 - this.sigma * 0.42)).toFixed(2);
      this.possibilityIndex = +(Math.min(0.99, Math.max(0.05, this.sigma / 4.2))).toFixed(2);

      // Possibility Space Override Framework (Π > 0.75)
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
        let situational = 1.0;
        const hpRatio = (unit.hp || 500) / Math.max(1, unit.maxHp || 500);
        if (hpRatio < 0.55 && (c.verb === "DEFEND" || c.verb === "HEAL" || c.verb === "HOLD")) {
          situational += 0.65;
        }
        if (this.stateIndex >= 1 && c.spcDeltaSigma < 0) {
          situational += 0.50; // Prefer SPC-stabilizing commands when variance drifts
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

  /* Command Loader #2: .cmd DSL Script Parser & Runner */
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
        results.push("Line " + (idx + 1) + ": Switched Combat Mode -> " + tokens[1].toUpperCase());
      } else if (op === "COMMAND_DEF") {
        const verb = (kv.VERB || "CUSTOM_GUARD").toUpperCase();
        const arch = (kv.ARCH || "ARCH_VANGUARD").toUpperCase();
        const resMult = parseFloat(kv.RESONANCE) || 1.50;
        const pwr = parseFloat(kv.POWER) || 3.77;
        const mit = parseFloat(kv.MITIGATION) || 4.71;
        const vfx = kv.VFX || "SWORD_SWIPE_AND_SPARKLES";
        registerOrUpdateCommand({
          id: "CMD_DSL_" + verb,
          verb: verb,
          name: "DSL Defined: " + verb,
          category: mit >= pwr ? "DEFENSIVE" : "OFFENSIVE",
          resonantArchetypes: [arch, "ARCH_SENTINEL"],
          resonanceMultiplierPi: resMult,
          resonantBonusDesc: "Defined via .cmd DSL Loader — Resonates with " + arch + " (" + resMult.toFixed(2) + "x)",
          startupFrames: 4,
          activeFrames: 14,
          recoveryFrames: 6,
          basePowerPi: pwr,
          mitigationPi: mit,
          rangeTiles: 3,
          vfxType: vfx,
          spcDeltaSigma: -0.28,
          isCustom: true
        });
        results.push("Line " + (idx + 1) + ": Registered Custom Command [" + verb + "] resonating with [" + arch + " @ " + resMult + "x]");
      } else if (op === "SPAWN" && tokens[1] && gameInstance) {
        const profId = tokens[1];
        const profIdx = (window.SOV_PROFILES_DATA || []).findIndex(p => p.profileId === profId);
        if (profIdx >= 0 && gameInstance.deployProfileToGrid) {
          gameInstance.deployProfileToGrid(profIdx, parseFloat(kv.X), parseFloat(kv.Y));
          results.push("Line " + (idx + 1) + ": Spawned 3D Sprite [" + profId + "]");
        }
      } else if (op === "GAMBIT" && tokens[1] && gameInstance) {
        const profId = tokens[1];
        const ruleStr = line.split(/\s+/).slice(2).join(" ");
        const unit = (gameInstance.state.units || []).find(u => u.profileId === profId);
        if (unit) {
          unit.gambit = ruleStr;
          results.push("Line " + (idx + 1) + ": Updated Gambit AST for [" + profId + "]");
        }
      } else if (op === "EXEC" && gameInstance) {
        const actorId = kv.ACTOR || "CHAR-002-BADR-313-VANGUARD";
        const verb = kv.VERB || "DEFEND";
        const targetId = kv.TARGET || "CHAR-004-BIMARISTAN-HEALER";
        const prof = (window.SOV_PROFILES_DATA || []).find(p => p.profileId === actorId) || window.SOV_PROFILES_DATA[0];
        const queued = window.SovCommandEngine.ringBuffer.enqueue(
          gameInstance.state.tickCount + 1,
          1,
          prof.characterName.split("(")[0].trim(),
          verb,
          targetId,
          prof
        );
        results.push("Line " + (idx + 1) + ": Queued [" + verb + "] by [" + actorId + "] (Resonance " + queued.resonanceMult + "x)");
      } else if (op === "INJECT_SPC" && window.SovCommandEngine) {
        const snap = window.SovCommandEngine.spcEngine.stepTick(-0.55);
        results.push("Line " + (idx + 1) + ": Injected SPC Compensation -> State " + snap.stateCode + " (Cp=" + snap.cp + ", σ=" + snap.sigma + ")");
      } else if (op === "CLASH_11VEC" && gameInstance && gameInstance.recalc11VectorClash) {
        gameInstance.recalc11VectorClash();
        results.push("Line " + (idx + 1) + ": Evaluated 11-Vector Clash with Archetype Resonance");
      } else if (op === "SIM_BATCH" && gameInstance && gameInstance.runMonteCarloTournament) {
        const iters = parseInt(kv.ITERATIONS, 10) || 150;
        gameInstance.runMonteCarloTournament(iters);
        results.push("Line " + (idx + 1) + ": Executed Monte Carlo Batch (" + iters + " iterations/matchup)");
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

  /* Live Monte Carlo & 11-Vector Tournament Matrix Engine */
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
      let totalSpcTransitions = 0;

      for (let i = 0; i < iters; i++) {
        let hpA = att.baseHp * resA.defMult;
        let hpB = def.baseHp * resB.defMult;
        let ticks = 0;
        let spcTrans = 0;
        let sigma = 0.55;

        while (hpA > 0 && hpB > 0 && ticks < 40) {
          ticks++;
          const jitterA = 0.86 + Math.random() * 0.28;
          const jitterB = 0.86 + Math.random() * 0.28;

          const rawA = att.baseAttack * (att.statWeightPi / PI_314) * (1 + att.weaponWeightPi / 6.28) * resA.offMult * jitterA;
          const mitB = def.baseDefense * (def.armorWeightPi / PI_314) * 0.628 * resB.defMult;
          const dmgAtoB = Math.max(22.0, rawA - mitB);

          const rawB = def.baseAttack * (def.statWeightPi / PI_314) * (1 + def.weaponWeightPi / 6.28) * resB.offMult * jitterB;
          const mitA = att.baseDefense * (att.armorWeightPi / PI_314) * 0.628 * resA.defMult;
          const dmgBtoA = Math.max(18.0, rawB - mitA);

          hpB -= dmgAtoB;
          if (hpB <= 0) break;
          hpA -= dmgBtoA;

          // Self-healing if Support/Resonant HEAL or DEFEND
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
        totalSpcTransitions += spcTrans;
      }

      const winRateA = +(aWins / iters * 100).toFixed(1);
      return {
        attackerId: att.profileId,
        attackerName: att.characterName.split("(")[0].trim(),
        attackerArch: att.coreArchetype,
        attackerCmd: m.cmdA,
        attackerResonance: resA.multiplier,
        defenderId: def.profileId,
        defenderName: def.characterName.split("(")[0].trim(),
        defenderArch: def.coreArchetype,
        defenderCmd: m.cmdB,
        defenderResonance: resB.multiplier,
        iterations: iters,
        winRatePct: winRateA,
        avgTicks: +(totalTicks / iters).toFixed(2),
        avgSpcTransitions: +(totalSpcTransitions / iters).toFixed(2)
      };
    });

    return results;
  }

  window.SovCommandEngine = {
    getCommandByVerb: getCommandByVerb,
    evaluateArchetypeResonance: evaluateArchetypeResonance,
    parseGambitStack: parseGambitStack,
    registerOrUpdateCommand: registerOrUpdateCommand,
    parseAndExecuteDslScript: parseAndExecuteDslScript,
    runMonteCarloSimulation: runMonteCarloSimulation,
    ringBuffer: new RingBufferCommandQueue(64),
    spcEngine: new GeminiSPCEngine()
  };
})();
