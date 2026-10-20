/* ============================================================================
 * SOVEREIGN 3.14π MULTI-VIEWPORT RENDERING ENGINE (4 SIMULTANEOUS GAME WINDOWS)
 * - Window 1: Expanded 2.5D Isometric World, A* Grid, Floating Damage & Towers
 * - Window 2: Close-Up Mubārazah Duel & Frame-Data / Archetype Resonance Arena
 * - Window 3: 32-Point Compass Macro Caravan & 7-Realm Strategic Radar
 * - Window 4: Gemini SPC Markov Phase-Space (S0..S3) & Ring-Buffer Oscilloscope
 * ============================================================================ */
(function () {
  const PI_314 = 3.14;

  function createViewportsController(state, addLog) {
    const canvasMain = document.getElementById("sovereign25dGameCanvas");
    const ctxMain = canvasMain ? canvasMain.getContext("2d") : null;

    const canvasArena = document.getElementById("tacticalArenaCanvas");
    const ctxArena = canvasArena ? canvasArena.getContext("2d") : null;

    const canvasRadar = document.getElementById("worldCaravanRadarCanvas");
    const ctxRadar = canvasRadar ? canvasRadar.getContext("2d") : null;

    const canvasSpc = document.getElementById("spcPhaseOscilloscopeCanvas");
    const ctxSpc = canvasSpc ? canvasSpc.getContext("2d") : null;

    function isoProject(gx, gy, gz) {
      if (!canvasMain) return { x: 0, y: 0 };
      const w = canvasMain.width;
      const h = canvasMain.height;
      const scale = 60 * (state.cameraZoom || 1.0);
      const sx = w * 0.48 + (state.cameraPanX || 0) + (gx - gy) * scale;
      const sy = h * 0.50 + (state.cameraPanY || 0) + (gx + gy) * (scale * 0.52) - (gz || 0) * (state.cameraZoom || 1.0);
      return { x: sx, y: sy };
    }

    function isoUnproject(sx, sy) {
      if (!canvasMain) return { gx: 0, gy: 0 };
      const w = canvasMain.width;
      const h = canvasMain.height;
      const scale = 60 * (state.cameraZoom || 1.0);
      const dx = (sx - w * 0.48 - (state.cameraPanX || 0)) / scale;
      const dy = (sy - h * 0.50 - (state.cameraPanY || 0)) / (scale * 0.52);
      return {
        gx: +((dx + dy) * 0.5).toFixed(2),
        gy: +((dy - dx) * 0.5).toFixed(2)
      };
    }

    function spawnFloatingText(text, sx, sy, color, isBig) {
      state.floatingTexts.push({
        text: text,
        x: sx,
        y: sy,
        vy: -1.35,
        life: 1.0,
        color: color || "#FDE68A",
        isBig: !!isBig
      });
    }

    function spawnVfx(type, sx, sy, tx, ty, color) {
      for (let i = 0; i < 14; i++) {
        state.vfxParticles.push({
          type: type || "SPARKLES",
          x: sx,
          y: sy,
          tx: tx != null ? tx : sx + (Math.random() - 0.5) * 145,
          ty: ty != null ? ty : sy + (Math.random() - 0.5) * 95,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5 - 1.5,
          progress: 0,
          life: 1.0,
          radius: (4 + Math.random() * 7.5) * (state.vfxScalePi / PI_314),
          color: color || "#FDE68A"
        });
      }
    }

    /* ========================================================================
     * WINDOW 1: 2.5D ISOMETRIC CASTLE, A* PATHFINDING GRID & FLOATING NUMBERS
     * ======================================================================== */
    function renderMain25DViewport() {
      if (!ctxMain || !canvasMain) return;
      const t = state.tickCount * 0.045 * (state.walkSpeedPi / PI_314);
      const themes = window.SOV_ERA_THEMES || [];
      const theme = themes[state.eraIndex] || themes[0];

      // Sky gradient
      const grad = ctxMain.createLinearGradient(0, 0, 0, canvasMain.height);
      grad.addColorStop(0, theme.skyTop);
      grad.addColorStop(1, theme.skyBot);
      ctxMain.fillStyle = grad;
      ctxMain.fillRect(0, 0, canvasMain.width, canvasMain.height);

      // Draw 2.5D Isometric Diamond Tile Grid (-7 to +7)
      for (let gx = -7; gx <= 7; gx++) {
        for (let gy = -6; gy <= 6; gy++) {
          const p0 = isoProject(gx, gy, 0);
          const p1 = isoProject(gx + 1, gy, 0);
          const p2 = isoProject(gx + 1, gy + 1, 0);
          const p3 = isoProject(gx, gy + 1, 0);
          ctxMain.beginPath();
          ctxMain.moveTo(p0.x, p0.y);
          ctxMain.lineTo(p1.x, p1.y);
          ctxMain.lineTo(p2.x, p2.y);
          ctxMain.lineTo(p3.x, p3.y);
          ctxMain.closePath();
          ctxMain.fillStyle = ((gx + gy) & 1) === 0 ? theme.tileA : theme.tileB;
          ctxMain.fill();
          ctxMain.strokeStyle = state.showAStarGrid ? "rgba(56, 189, 248, 0.28)" : "rgba(212, 175, 55, 0.13)";
          ctxMain.lineWidth = state.showAStarGrid ? 1.2 : 1;
          ctxMain.stroke();

          if (state.showAStarGrid && (gx % 2 === 0) && (gy % 2 === 0)) {
            const hCost = Math.hypot(gx, gy).toFixed(1);
            ctxMain.fillStyle = "rgba(186, 230, 253, 0.45)";
            ctxMain.font = "9px Consolas";
            ctxMain.textAlign = "center";
            ctxMain.fillText("(" + gx + "," + gy + ") h=" + hCost, p0.x, p0.y + 14);
          }
        }
      }

      // Draw Trade & Expansion Splines from Single Castle (0,0) to Strongholds
      const castleCenter = isoProject(0, 0, 12);
      state.strongholds.forEach((sh, idx) => {
        if (idx === 0) return;
        const sp = isoProject(sh.gx, sh.gy, 8);
        ctxMain.save();
        ctxMain.beginPath();
        ctxMain.setLineDash([6, 4]);
        ctxMain.moveTo(castleCenter.x, castleCenter.y);
        ctxMain.lineTo(sp.x, sp.y);
        ctxMain.strokeStyle = sh.isEnemy ? "rgba(244, 63, 94, 0.48)" : "rgba(212, 175, 55, 0.40)";
        ctxMain.lineWidth = 1.6;
        ctxMain.stroke();
        ctxMain.restore();
      });

      // Draw Strongholds & Central Single Castle Sanctuary
      state.strongholds.forEach((sh) => {
        const pos = isoProject(sh.gx, sh.gy, 0);
        const height = (sh.isCastle ? 48 : 28) * (state.cameraZoom || 1.0);
        const halfW = (sh.isCastle ? 28 : 17) * (state.cameraZoom || 1.0);
        ctxMain.fillStyle = sh.isCastle ? theme.castleColor : sh.color;
        ctxMain.fillRect(pos.x - halfW, pos.y - height, halfW * 2, height);
        ctxMain.strokeStyle = "#D4AF37";
        ctxMain.lineWidth = sh.isCastle ? 2.4 : 1.3;
        ctxMain.strokeRect(pos.x - halfW, pos.y - height, halfW * 2, height);

        ctxMain.beginPath();
        ctxMain.arc(pos.x, pos.y - height, sh.isCastle ? 19 : 11, Math.PI, 0);
        ctxMain.fillStyle = sh.isEnemy ? "#991B1B" : "#D4AF37";
        ctxMain.fill();

        ctxMain.fillStyle = "#F8FAFC";
        ctxMain.font = sh.isCastle ? "bold 11px Segoe UI" : "10px Segoe UI";
        ctxMain.textAlign = "center";
        ctxMain.fillText(sh.name.split("(")[0].trim(), pos.x, pos.y + 15);
      });

      // Draw Tower Defense Emplacements
      state.towers.forEach((tw) => {
        const tp = isoProject(tw.gx, tw.gy, 0);
        ctxMain.fillStyle = tw.color;
        ctxMain.beginPath();
        ctxMain.moveTo(tp.x, tp.y - 32);
        ctxMain.lineTo(tp.x + 13, tp.y);
        ctxMain.lineTo(tp.x - 13, tp.y);
        ctxMain.closePath();
        ctxMain.fill();
        ctxMain.strokeStyle = "#FDE68A";
        ctxMain.stroke();

        ctxMain.beginPath();
        ctxMain.ellipse(tp.x, tp.y, 32, 16, 0, 0, Math.PI * 2);
        ctxMain.strokeStyle = "rgba(16, 185, 129, 0.32)";
        ctxMain.stroke();
      });

      // Update & Draw Moving Caravans
      state.caravans.forEach((cv) => {
        const dx = cv.tx - cv.gx;
        const dy = cv.ty - cv.gy;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.08) {
          cv.gx += (dx / dist) * 0.012 * (state.simSpeedMult || 1.0);
          cv.gy += (dy / dist) * 0.012 * (state.simSpeedMult || 1.0);
        } else {
          cv.tx = cv.gx > 0 ? -3.6 : 3.6;
          cv.ty = cv.gy > 0 ? -2.2 : 1.8;
        }
        const cp = isoProject(cv.gx, cv.gy, 0);
        ctxMain.fillStyle = cv.friendly ? "#10B981" : "#F59E0B";
        ctxMain.beginPath();
        ctxMain.arc(cp.x, cp.y - 8, 9, 0, Math.PI * 2);
        ctxMain.fill();
        ctxMain.strokeStyle = "#FFFFFF";
        ctxMain.stroke();
        ctxMain.fillStyle = "#FDE68A";
        ctxMain.font = "9px Consolas";
        ctxMain.textAlign = "center";
        ctxMain.fillText("🐪 " + cv.name.slice(0, 22), cp.x, cp.y - 21);
      });

      // Update & Draw 3D Unit Sprites with Real-Time Archetype Resonance & Combat Numbers
      state.units.forEach((u, idx) => {
        const res = window.SovCommandEngine
          ? window.SovCommandEngine.evaluateArchetypeResonance(u, u.verb)
          : { multiplier: 1.0, tier: "BASELINE", offMult: 1.0, defMult: 1.0 };
        u.activeResonance = res.multiplier;
        u.resonanceTier = res.tier;

        if (u.verb === "ORBIT") {
          u.orbitAngle += 0.018 * (state.walkSpeedPi / PI_314) * (state.simSpeedMult || 1.0);
          const r = (state.orbitRadiusPi / PI_314) * 2.15;
          u.gx = Math.cos(u.orbitAngle) * r;
          u.gy = Math.sin(u.orbitAngle) * r;
        } else if (u.verb === "DEFEND" || u.verb === "HOLD" || u.verb === "INTERCEPT") {
          // Defensive patrol / bodyguard stance around nearest friendly or waypoint
          u.orbitAngle += 0.008 * (state.simSpeedMult || 1.0);
          if (state.tickCount % 95 === (idx * 7) % 95) {
            const up = isoProject(u.gx, u.gy, 16);
            u.hp = Math.min(u.maxHp, u.hp + Math.round(14 * res.multiplier));
            if (res.multiplier > 1.05) {
              spawnFloatingText("🛡️ " + u.verb + " RESONANCE " + res.multiplier.toFixed(2) + "x (+" + Math.round((res.multiplier - 1) * 100) + "% DEF)", up.x, up.y - 42, "#6EE7B7", false);
            }
          }
        } else {
          // A* Pursuit toward target or nearest opposing unit
          let bestTarget = null;
          let bestDist = 999;
          state.units.forEach((other) => {
            if (other.isEnemy !== u.isEnemy) {
              const d = Math.hypot(other.gx - u.gx, other.gy - u.gy);
              if (d < bestDist) {
                bestDist = d;
                bestTarget = other;
              }
            }
          });

          if (bestTarget) {
            // Draw A* Vector Line when A* grid is enabled
            if (state.showAStarGrid) {
              const pFrom = isoProject(u.gx, u.gy, 6);
              const pTo = isoProject(bestTarget.gx, bestTarget.gy, 6);
              ctxMain.save();
              ctxMain.beginPath();
              ctxMain.setLineDash([3, 3]);
              ctxMain.moveTo(pFrom.x, pFrom.y);
              ctxMain.lineTo(pTo.x, pTo.y);
              ctxMain.strokeStyle = u.isEnemy ? "rgba(244, 63, 94, 0.55)" : "rgba(56, 189, 248, 0.65)";
              ctxMain.lineWidth = 1.2;
              ctxMain.stroke();
              ctxMain.restore();
            }

            if (bestDist > 0.85) {
              const stepSpeed = 0.016 * (state.walkSpeedPi / PI_314) * (u.verb === "PURSUE_A_STAR" ? res.multiplier : 1.0) * (state.simSpeedMult || 1.0);
              u.gx += ((bestTarget.gx - u.gx) / bestDist) * stepSpeed;
              u.gy += ((bestTarget.gy - u.gy) / bestDist) * stepSpeed;
            } else if (state.tickCount % 52 === (idx * 5) % 52) {
              const up = isoProject(u.gx, u.gy, 14);
              const bp = isoProject(bestTarget.gx, bestTarget.gy, 14);
              spawnVfx(u.vfxType, up.x, up.y, bp.x, bp.y, u.isEnemy ? "#A855F7" : "#FDE68A");

              // Calculate real-time hit damage with Archetype Resonance!
              const defRes = window.SovCommandEngine
                ? window.SovCommandEngine.evaluateArchetypeResonance(bestTarget, bestTarget.verb)
                : { defMult: 1.0 };
              const rawHit = (u.atk * 0.38) * res.offMult;
              const mitHit = (bestTarget.def * 0.22) * defRes.defMult;
              const dmg = Math.max(12, Math.round(rawHit - mitHit));
              bestTarget.hp = Math.max(45, bestTarget.hp - dmg);
              if (bestTarget.hp <= 55) {
                bestTarget.hp = bestTarget.maxHp; // Respawn / convert cycle
                if (u.isEnemy === false) u.conversions++;
              }

              const hitLabel = res.multiplier > 1.05
                ? "-" + dmg + " HP ⚡" + res.multiplier.toFixed(2) + "x"
                : "-" + dmg + " HP";
              spawnFloatingText(hitLabel, bp.x, bp.y - 34, u.isEnemy ? "#FCA5A5" : "#FDE68A", res.multiplier >= 1.4);

              // Enqueue into live Ring-Buffer Queue
              if (window.SovCommandEngine) {
                window.SovCommandEngine.ringBuffer.enqueue(
                  state.tickCount + 2,
                  res.tier === "PRIME_RESONANCE" ? 0 : 1,
                  u.name.split("(")[0].trim(),
                  u.verb,
                  bestTarget.name.split("(")[0].trim(),
                  u
                );
              }
            }
          }
        }

        const floatZ = u.isFloating
          ? 14 + Math.sin(t * 2.0 + idx) * 6.0 * (state.floatAmpPi / PI_314)
          : Math.abs(Math.sin(t * 3.14 + idx)) * 3.5;

        const up = isoProject(u.gx, u.gy, floatZ);
        const groundP = isoProject(u.gx, u.gy, 0);

        // Ground shadow
        ctxMain.beginPath();
        ctxMain.ellipse(groundP.x, groundP.y, u.isMounted ? 16 : 11, u.isMounted ? 8 : 5.5, 0, 0, Math.PI * 2);
        ctxMain.fillStyle = "rgba(0,0,0,0.55)";
        ctxMain.fill();

        // Archetype Resonance Ground Ring (Green/Gold when command resonates with archetype!)
        if (u.activeResonance > 1.05) {
          ctxMain.beginPath();
          ctxMain.ellipse(groundP.x, groundP.y, 18, 9, 0, 0, Math.PI * 2);
          ctxMain.strokeStyle = u.resonanceTier === "PRIME_RESONANCE" ? "rgba(16, 185, 129, 0.78)" : "rgba(212, 175, 55, 0.65)";
          ctxMain.lineWidth = 1.6;
          ctxMain.stroke();
        }

        if (idx === state.selectedUnitIndex) {
          ctxMain.beginPath();
          ctxMain.ellipse(groundP.x, groundP.y, 23, 11.5, 0, 0, Math.PI * 2);
          ctxMain.strokeStyle = "#38BDF8";
          ctxMain.lineWidth = 2.2;
          ctxMain.stroke();
        }

        if (u.empowered) {
          ctxMain.beginPath();
          ctxMain.arc(up.x, up.y - 12, 19 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
          ctxMain.fillStyle = "rgba(212, 175, 55, 0.20)";
          ctxMain.fill();
          ctxMain.strokeStyle = "rgba(253, 230, 138, 0.75)";
          ctxMain.lineWidth = 1.3;
          ctxMain.stroke();
        }

        // Legs
        const legSwing = Math.sin(t * 4.2 + idx) * 5;
        ctxMain.strokeStyle = u.isEnemy ? "#FCA5A5" : "#E2E8F0";
        ctxMain.lineWidth = 2.4;
        ctxMain.beginPath();
        ctxMain.moveTo(up.x - 4, up.y - 4);
        ctxMain.lineTo(up.x - 4 + legSwing, up.y + 4);
        ctxMain.moveTo(up.x + 4, up.y - 4);
        ctxMain.lineTo(up.x + 4 - legSwing, up.y + 4);
        ctxMain.stroke();

        // Mount
        if (u.isMounted) {
          ctxMain.fillStyle = u.isEnemy ? "#7F1D1D" : "#B45309";
          ctxMain.fillRect(up.x - 13, up.y - 10, 26, 9);
        }

        // Torso
        ctxMain.fillStyle = u.isEnemy ? "#DC2626" : (idx === 0 ? "#10B981" : theme.accent);
        ctxMain.beginPath();
        ctxMain.roundRect(up.x - 8, up.y - 24, 16, 18, 4);
        ctxMain.fill();
        ctxMain.strokeStyle = "#FDE68A";
        ctxMain.lineWidth = 1.2;
        ctxMain.stroke();

        // Head
        ctxMain.beginPath();
        ctxMain.arc(up.x, up.y - 29, 6, 0, Math.PI * 2);
        ctxMain.fillStyle = "#FDE68A";
        ctxMain.fill();

        if (u.isFloating) {
          ctxMain.beginPath();
          ctxMain.ellipse(up.x, up.y - 38, 12, 4, t * 0.5, 0, Math.PI * 2);
          ctxMain.strokeStyle = "#FDE68A";
          ctxMain.lineWidth = 1.6;
          ctxMain.stroke();
        }

        // Weapon swing
        const swingAngle = Math.sin(t * 3.5 + idx) * 0.65;
        ctxMain.save();
        ctxMain.translate(up.x + 7, up.y - 16);
        ctxMain.rotate(swingAngle);
        ctxMain.strokeStyle = "#6EE7B7";
        ctxMain.lineWidth = 2.5;
        ctxMain.beginPath();
        ctxMain.moveTo(0, 0);
        ctxMain.lineTo(14, -10);
        ctxMain.stroke();
        ctxMain.restore();

        // HP bar + Verb/Resonance tag
        ctxMain.fillStyle = "rgba(0,0,0,0.75)";
        ctxMain.fillRect(up.x - 18, up.y - 47, 36, 5);
        ctxMain.fillStyle = u.isEnemy ? "#EF4444" : "#10B981";
        ctxMain.fillRect(up.x - 18, up.y - 47, 36 * Math.max(0.05, u.hp / u.maxHp), 5);

        ctxMain.fillStyle = u.activeResonance > 1.05 ? "#6EE7B7" : "#CBD5E1";
        ctxMain.font = "bold 9px Consolas";
        ctxMain.textAlign = "center";
        ctxMain.fillText(u.verb + " (" + u.activeResonance.toFixed(2) + "x)", up.x, up.y - 51);
      });

      // Update & Draw VFX Particles
      for (let i = state.vfxParticles.length - 1; i >= 0; i--) {
        const p = state.vfxParticles[i];
        p.progress += 0.045;
        p.life -= 0.022;
        if (p.life <= 0) {
          state.vfxParticles.splice(i, 1);
          continue;
        }
        const curX = p.x + (p.tx - p.x) * Math.min(1, p.progress) + p.vx;
        const curY = p.y + (p.ty - p.y) * Math.min(1, p.progress) - Math.sin(p.progress * Math.PI) * 38;

        ctxMain.save();
        ctxMain.globalAlpha = Math.max(0, p.life);
        if (p.type.includes("SWORD_SWIPE")) {
          ctxMain.strokeStyle = "#FDE68A";
          ctxMain.lineWidth = 3.5;
          ctxMain.beginPath();
          ctxMain.arc(curX, curY, p.radius * 2.2, -0.8, 1.4);
          ctxMain.stroke();
        } else if (p.type.includes("ARROWS")) {
          ctxMain.strokeStyle = "#38BDF8";
          ctxMain.lineWidth = 2.0;
          ctxMain.beginPath();
          ctxMain.moveTo(curX - 8, curY - 6);
          ctxMain.lineTo(curX + 8, curY + 6);
          ctxMain.stroke();
        } else if (p.type.includes("CLOUD") || p.type.includes("VINEGAR") || p.type.includes("POISON")) {
          ctxMain.fillStyle = p.color;
          ctxMain.beginPath();
          ctxMain.arc(curX, curY, p.radius * 2.8, 0, Math.PI * 2);
          ctxMain.fill();
        } else if (p.type.includes("MISSILE") || p.type.includes("CHARGE")) {
          ctxMain.fillStyle = "#F43F5E";
          ctxMain.beginPath();
          ctxMain.arc(curX, curY, p.radius * 1.4, 0, Math.PI * 2);
          ctxMain.fill();
        } else {
          ctxMain.fillStyle = p.color || "#6EE7B7";
          ctxMain.beginPath();
          ctxMain.arc(curX, curY, p.radius * 0.85, 0, Math.PI * 2);
          ctxMain.fill();
        }
        ctxMain.restore();
      }

      // Update & Draw Floating Combat Damage / Resonance Callouts
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy;
        ft.life -= 0.02;
        if (ft.life <= 0) {
          state.floatingTexts.splice(i, 1);
          continue;
        }
        ctxMain.save();
        ctxMain.globalAlpha = Math.max(0, ft.life);
        ctxMain.font = ft.isBig ? "bold 12px Consolas" : "bold 10px Consolas";
        ctxMain.fillStyle = ft.color;
        ctxMain.textAlign = "center";
        ctxMain.fillText(ft.text, ft.x, ft.y);
        ctxMain.restore();
      }
    }

    /* ========================================================================
     * WINDOW 2: CLOSE-UP MUBĀRAZAH DUEL & FRAME-DATA / RESONANCE ARENA
     * ======================================================================== */
    function renderTacticalArenaViewport() {
      if (!ctxArena || !canvasArena) return;
      const w = canvasArena.width;
      const h = canvasArena.height;
      const profiles = window.SOV_PROFILES_DATA || [];
      const aIdx = parseInt(document.getElementById("clashAttackerSelect")?.value || "0", 10) || 0;
      const dIdx = parseInt(document.getElementById("clashDefenderSelect")?.value || "10", 10) || 10;
      const att = profiles[aIdx] || profiles[0];
      const def = profiles[dIdx] || profiles[10];
      const activeVerb = document.getElementById("clashVerbSelect")?.value || "DEFEND";

      const resA = window.SovCommandEngine.evaluateArchetypeResonance(att, activeVerb);
      const resD = window.SovCommandEngine.evaluateArchetypeResonance(def, "HOLD");
      const cmd = resA.command;

      // Arena background
      const grad = ctxArena.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#081226");
      grad.addColorStop(0.7, "#111D35");
      grad.addColorStop(1, "#1E1916");
      ctxArena.fillStyle = grad;
      ctxArena.fillRect(0, 0, w, h);

      // Arena floor grid
      const floorY = h * 0.72;
      ctxArena.strokeStyle = "rgba(212, 175, 55, 0.25)";
      ctxArena.lineWidth = 1.5;
      ctxArena.beginPath();
      ctxArena.moveTo(0, floorY);
      ctxArena.lineTo(w, floorY);
      ctxArena.stroke();

      // Frame Data Phase Cycle (Startup -> Active -> Recovery)
      const totalFrames = cmd.startupFrames + cmd.activeFrames + cmd.recoveryFrames;
      const curFrame = state.tickCount % totalFrames;
      let phaseName = "STARTUP";
      let phaseColor = "#38BDF8";
      if (curFrame >= cmd.startupFrames && curFrame < cmd.startupFrames + cmd.activeFrames) {
        phaseName = "ACTIVE HITBOX";
        phaseColor = "#10B981";
      } else if (curFrame >= cmd.startupFrames + cmd.activeFrames) {
        phaseName = "RECOVERY";
        phaseColor = "#F59E0B";
      }

      // Draw Frame Timeline Bar at Top of Arena
      const barX = 24;
      const barY = 44;
      const barW = w - 48;
      const sW = (cmd.startupFrames / totalFrames) * barW;
      const aW = (cmd.activeFrames / totalFrames) * barW;
      const rW = (cmd.recoveryFrames / totalFrames) * barW;

      ctxArena.fillStyle = "rgba(56, 189, 248, 0.35)";
      ctxArena.fillRect(barX, barY, sW, 14);
      ctxArena.fillStyle = "rgba(16, 185, 129, 0.45)";
      ctxArena.fillRect(barX + sW, barY, aW, 14);
      ctxArena.fillStyle = "rgba(245, 158, 11, 0.35)";
      ctxArena.fillRect(barX + sW + aW, barY, rW, 14);

      const playheadX = barX + (curFrame / totalFrames) * barW;
      ctxArena.fillStyle = "#FFFFFF";
      ctxArena.fillRect(playheadX - 2, barY - 4, 4, 22);

      ctxArena.fillStyle = "#FDE68A";
      ctxArena.font = "bold 11px Consolas";
      ctxArena.textAlign = "left";
      ctxArena.fillText(
        "COMMAND: [" + cmd.verb + "] • Frame " + (curFrame + 1) + "/" + totalFrames + " (" + phaseName + ") • Startup:" + cmd.startupFrames + "f Active:" + cmd.activeFrames + "f Rec:" + cmd.recoveryFrames + "f",
        barX,
        barY - 8
      );

      // Attacker & Defender Duel Positions
      const lunge = phaseName === "ACTIVE HITBOX" ? Math.sin((curFrame - cmd.startupFrames) * 0.4) * 55 : 0;
      const ax = w * 0.28 + lunge;
      const dx = w * 0.72;

      // Attacker Archetype Resonance Aura
      ctxArena.beginPath();
      ctxArena.arc(ax, floorY - 52, 46 + Math.sin(state.tickCount * 0.1) * 5, 0, Math.PI * 2);
      ctxArena.fillStyle = resA.tier === "PRIME_RESONANCE" ? "rgba(16, 185, 129, 0.22)" : "rgba(212, 175, 55, 0.14)";
      ctxArena.fill();
      ctxArena.strokeStyle = resA.tier === "PRIME_RESONANCE" ? "#10B981" : "#D4AF37";
      ctxArena.lineWidth = 2;
      ctxArena.stroke();

      // Attacker Fighter Body
      ctxArena.fillStyle = "#10B981";
      ctxArena.beginPath();
      ctxArena.roundRect(ax - 20, floorY - 84, 40, 56, 8);
      ctxArena.fill();
      ctxArena.strokeStyle = "#FDE68A";
      ctxArena.stroke();
      ctxArena.beginPath();
      ctxArena.arc(ax, floorY - 98, 15, 0, Math.PI * 2);
      ctxArena.fillStyle = "#FDE68A";
      ctxArena.fill();

      // Active Hitbox / Shield Wall Graphic
      if (phaseName === "ACTIVE HITBOX") {
        ctxArena.save();
        ctxArena.strokeStyle = cmd.category === "DEFENSIVE" ? "#6EE7B7" : "#F43F5E";
        ctxArena.lineWidth = 4;
        ctxArena.beginPath();
        if (cmd.category === "DEFENSIVE") {
          ctxArena.arc(ax + 34, floorY - 55, 42, -Math.PI * 0.45, Math.PI * 0.45);
        } else {
          ctxArena.moveTo(ax + 24, floorY - 60);
          ctxArena.lineTo(dx - 24, floorY - 55);
        }
        ctxArena.stroke();
        ctxArena.restore();
      }

      // Defender Fighter Body
      ctxArena.fillStyle = "#DC2626";
      ctxArena.beginPath();
      ctxArena.roundRect(dx - 20, floorY - 84, 40, 56, 8);
      ctxArena.fill();
      ctxArena.strokeStyle = "#FCA5A5";
      ctxArena.stroke();
      ctxArena.beginPath();
      ctxArena.arc(dx, floorY - 98, 15, 0, Math.PI * 2);
      ctxArena.fillStyle = "#FCA5A5";
      ctxArena.fill();

      // Labels & Resonance Readout
      ctxArena.textAlign = "center";
      ctxArena.fillStyle = "#6EE7B7";
      ctxArena.font = "bold 12px Segoe UI";
      ctxArena.fillText(att.characterName.split("(")[0].trim(), ax, floorY + 24);
      ctxArena.font = "11px Consolas";
      ctxArena.fillStyle = "#FDE68A";
      ctxArena.fillText(att.coreArchetype + " • Resonance: " + resA.multiplier.toFixed(2) + "x (" + resA.tier + ")", ax, floorY + 42);

      ctxArena.fillStyle = "#FDA4AF";
      ctxArena.font = "bold 12px Segoe UI";
      ctxArena.fillText(def.characterName.split("(")[0].trim(), dx, floorY + 24);
      ctxArena.font = "11px Consolas";
      ctxArena.fillText(def.coreArchetype + " • Defense Stance (" + resD.multiplier.toFixed(2) + "x)", dx, floorY + 42);

      // Bottom Resonance Explanation Banner
      ctxArena.fillStyle = "rgba(4, 7, 15, 0.88)";
      ctxArena.fillRect(16, h - 46, w - 32, 34);
      ctxArena.strokeStyle = "rgba(16, 185, 129, 0.45)";
      ctxArena.strokeRect(16, h - 46, w - 32, 34);
      ctxArena.fillStyle = "#6EE7B7";
      ctxArena.font = "11px Consolas";
      ctxArena.textAlign = "left";
      ctxArena.fillText(resA.summaryText.slice(0, 96), 26, h - 25);
    }

    /* ========================================================================
     * WINDOW 3: 32-POINT COMPASS & MACRO CARAVAN LOGISTICS RADAR
     * ======================================================================== */
    function renderWorldCaravanRadar() {
      if (!ctxRadar || !canvasRadar) return;
      const w = canvasRadar.width;
      const h = canvasRadar.height;
      const cx = w * 0.5;
      const cy = h * 0.52;
      const maxR = Math.min(w, h) * 0.41;

      ctxRadar.fillStyle = "#040814";
      ctxRadar.fillRect(0, 0, w, h);

      // Draw 32-Point Sidereal Compass Rose Rings
      for (let r = 1; r <= 4; r++) {
        ctxRadar.beginPath();
        ctxRadar.arc(cx, cy, (maxR / 4) * r, 0, Math.PI * 2);
        ctxRadar.strokeStyle = "rgba(212, 175, 55, 0.22)";
        ctxRadar.lineWidth = 1;
        ctxRadar.stroke();
      }

      for (let i = 0; i < 32; i++) {
        const ang = (i / 32) * Math.PI * 2;
        ctxRadar.beginPath();
        ctxRadar.moveTo(cx, cy);
        ctxRadar.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
        ctxRadar.strokeStyle = i % 8 === 0 ? "rgba(212, 175, 55, 0.45)" : "rgba(56, 189, 248, 0.12)";
        ctxRadar.stroke();
      }

      // Radar sweep line
      const sweepAng = (state.tickCount * 0.025) % (Math.PI * 2);
      ctxRadar.beginPath();
      ctxRadar.moveTo(cx, cy);
      ctxRadar.lineTo(cx + Math.cos(sweepAng) * maxR, cy + Math.sin(sweepAng) * maxR);
      ctxRadar.strokeStyle = "rgba(16, 185, 129, 0.75)";
      ctxRadar.lineWidth = 2;
      ctxRadar.stroke();

      // Plot Strongholds on Radar
      state.strongholds.forEach((sh) => {
        const sx = cx + (sh.gx / 6.0) * maxR;
        const sy = cy + (sh.gy / 4.2) * maxR;
        ctxRadar.beginPath();
        ctxRadar.arc(sx, sy, sh.isCastle ? 9 : 6, 0, Math.PI * 2);
        ctxRadar.fillStyle = sh.color;
        ctxRadar.fill();
        ctxRadar.strokeStyle = "#FFFFFF";
        ctxRadar.stroke();

        ctxRadar.fillStyle = "#F8FAFC";
        ctxRadar.font = "10px Consolas";
        ctxRadar.textAlign = "center";
        ctxRadar.fillText(sh.name.split("(")[0].trim().slice(0, 18), sx, sy - 10);
      });

      // Plot Caravans on Radar
      state.caravans.forEach((cv) => {
        const sx = cx + (cv.gx / 6.0) * maxR;
        const sy = cy + (cv.gy / 4.2) * maxR;
        ctxRadar.fillStyle = cv.friendly ? "#6EE7B7" : "#F59E0B";
        ctxRadar.fillRect(sx - 4, sy - 4, 8, 8);
      });
    }

    /* ========================================================================
     * WINDOW 4: GEMINI SPC MARKOV PHASE-SPACE & RING-BUFFER OSCILLOSCOPE
     * ======================================================================== */
    function renderSpcPhaseOscilloscope() {
      if (!ctxSpc || !canvasSpc || !window.SovCommandEngine) return;
      const w = canvasSpc.width;
      const h = canvasSpc.height;
      const spc = window.SovCommandEngine.spcEngine;

      if (state.tickCount % 15 === 0) {
        spc.stepTick(-0.08);
      }

      ctxSpc.fillStyle = "#04070F";
      ctxSpc.fillRect(0, 0, w, h);

      // Draw S0, S1, S2, S3 Threshold Bands
      const bands = [
        { label: "S3 HARD SHUTDOWN (≥4.0σ)", yTop: 28, yBot: h * 0.25, color: "rgba(153, 27, 27, 0.22)" },
        { label: "S2 CRITICAL (2.5σ–4.0σ)", yTop: h * 0.25, yBot: h * 0.48, color: "rgba(244, 63, 94, 0.16)" },
        { label: "S1 WARNING (1.0σ–2.5σ)", yTop: h * 0.48, yBot: h * 0.72, color: "rgba(245, 158, 11, 0.14)" },
        { label: "S0 OPTIMAL (<1.0σ | Cp≥1.33)", yTop: h * 0.72, yBot: h - 24, color: "rgba(16, 185, 129, 0.16)" }
      ];

      bands.forEach(b => {
        ctxSpc.fillStyle = b.color;
        ctxSpc.fillRect(16, b.yTop, w - 32, b.yBot - b.yTop);
        ctxSpc.fillStyle = "#94A3B8";
        ctxSpc.font = "10px Consolas";
        ctxSpc.textAlign = "left";
        ctxSpc.fillText(b.label, 24, b.yTop + 14);
      });

      // Plot Sigma Waveform History
      const hist = spc.history;
      if (hist.length > 1) {
        ctxSpc.beginPath();
        for (let i = 0; i < hist.length; i++) {
          const x = 20 + (i / 90) * (w - 40);
          const normSigma = Math.min(1, hist[i].sigma / 4.2);
          const y = (h - 28) - normSigma * (h - 64);
          if (i === 0) ctxSpc.moveTo(x, y);
          else ctxSpc.lineTo(x, y);
        }
        ctxSpc.strokeStyle = "#6EE7B7";
        ctxSpc.lineWidth = 2.4;
        ctxSpc.stroke();
      }

      // Top Telemetry Pill
      ctxSpc.fillStyle = "#FDE68A";
      ctxSpc.font = "bold 11px Consolas";
      ctxSpc.textAlign = "right";
      ctxSpc.fillText(
        "STATE: S" + spc.stateIndex + " | Cp=" + spc.cp + " | σ=" + spc.sigma.toFixed(2) + " | Π=" + spc.possibilityIndex + " | Transitions=" + spc.transitionCount,
        w - 20,
        20
      );
    }

    function renderAllViewports() {
      state.tickCount++;
      renderMain25DViewport();
      if (state.viewportLayout === "2x" || state.viewportLayout === "4x") {
        renderTacticalArenaViewport();
      }
      if (state.viewportLayout === "4x") {
        renderWorldCaravanRadar();
        renderSpcPhaseOscilloscope();
      }

      // Pop due commands from Ring Buffer every 20 ticks and update UI panel
      if (state.tickCount % 20 === 0 && window.SovCommandEngine) {
        window.SovCommandEngine.ringBuffer.popDue(state.tickCount);
        if (window.SovGame && window.SovGame.renderRingBufferPanel) {
          window.SovGame.renderRingBufferPanel();
        }
      }

      requestAnimationFrame(renderAllViewports);
    }

    // Interactive Click Handler on Main 2.5D Canvas
    if (canvasMain) {
      canvasMain.addEventListener("click", function (ev) {
        const rect = canvasMain.getBoundingClientRect();
        const mx = (ev.clientX - rect.left) * (canvasMain.width / rect.width);
        const my = (ev.clientY - rect.top) * (canvasMain.height / rect.height);
        const gridCoord = isoUnproject(mx, my);

        if (state.canvasClickTool === "BUILD_TOWER" || state.combatMode === "TD") {
          state.towers.push({
            name: "Ribāṭ Tower #" + (state.towers.length + 1),
            gx: gridCoord.gx,
            gy: gridCoord.gy,
            type: "ARCHER_314",
            color: "#10B981"
          });
          spawnVfx("SPARKLES", mx, my, mx, my - 40, "#10B981");
          spawnFloatingText("+Ribāṭ Tower (" + gridCoord.gx + "," + gridCoord.gy + ")", mx, my - 25, "#6EE7B7", true);
          addLog("Constructed new Ribāṭ Defense Tower at (" + gridCoord.gx + ", " + gridCoord.gy + ") (+3.14π Security)!", "#FDE68A");
          return;
        }

        if (state.canvasClickTool === "SPAWN_UNIT") {
          if (window.SovGame && window.SovGame.deployProfileToGrid) {
            const profIdx = parseInt(document.getElementById("clashAttackerSelect")?.value || "0", 10) || 0;
            window.SovGame.deployProfileToGrid(profIdx, gridCoord.gx, gridCoord.gy);
            spawnFloatingText("⚡ Deployed @ (" + gridCoord.gx + "," + gridCoord.gy + ")", mx, my - 25, "#FDE68A", true);
          }
          return;
        }

        // Default: Select unit or set waypoint
        let clickedUnit = -1;
        let bestD = 34;
        state.units.forEach((u, idx) => {
          const up = isoProject(u.gx, u.gy, 10);
          const d = Math.hypot(up.x - mx, up.y - my);
          if (d < bestD) {
            bestD = d;
            clickedUnit = idx;
          }
        });

        if (clickedUnit >= 0) {
          state.selectedUnitIndex = clickedUnit;
          if (window.SovGame && window.SovGame.syncInspectorToSelectedUnit) {
            window.SovGame.syncInspectorToSelectedUnit();
          }
          const u = state.units[clickedUnit];
          const up = isoProject(u.gx, u.gy, 12);
          spawnVfx("SPARKLES", up.x, up.y, up.x, up.y - 30, "#6EE7B7");
          spawnFloatingText("Selected: " + u.verb + " (" + (u.activeResonance || 1).toFixed(2) + "x)", up.x, up.y - 35, "#38BDF8", true);
          addLog("Inspected Autonomous Node #" + (clickedUnit + 1) + ": " + u.name + " [" + u.verb + " @ " + (u.activeResonance || 1).toFixed(2) + "x Resonance]", "#6EE7B7");
        } else {
          // Move selected unit toward clicked isometric coordinate
          const selU = state.units[state.selectedUnitIndex];
          if (selU) {
            selU.gx = gridCoord.gx;
            selU.gy = gridCoord.gy;
            spawnVfx("SPARKLES", mx, my, mx, my - 25, "#38BDF8");
            spawnFloatingText("A* Move (" + gridCoord.gx + "," + gridCoord.gy + ")", mx, my - 20, "#38BDF8", false);
          }
        }
      });
    }

    return {
      isoProject: isoProject,
      isoUnproject: isoUnproject,
      spawnVfx: spawnVfx,
      spawnFloatingText: spawnFloatingText,
      renderAllViewports: renderAllViewports,
      renderTacticalArenaViewport: renderTacticalArenaViewport,
      renderWorldCaravanRadar: renderWorldCaravanRadar,
      renderSpcPhaseOscilloscope: renderSpcPhaseOscilloscope
    };
  }

  window.SovViewportsFactory = {
    createViewportsController: createViewportsController
  };
})();
