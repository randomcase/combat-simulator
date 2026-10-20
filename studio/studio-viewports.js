/* ============================================================================
 * SOVEREIGN 3.14π CIRCULAR & PROCEDURAL DEGREE MULTI-VIEWPORT ENGINE
 * All combat is circular (0° → 360° / 2π rad) to complete & procedural for impact/degrees:
 * - Window 1: 3.14π Concentric Ring Isometric Arena (1π, 2π, 3.14π, 4.71π),
 *             24-Spoke Degree Protractor, Procedural Sector Sweeps & 360° Completion Pulses
 * - Window 2: 360° (2π) Procedural Impact Protractor, Circular Frame-Phase Wheel & Torque Dial
 * - Window 3: 3.14π Orbital Caravan Circuit & 32-Bearing (11.25°) Harmonics Radar
 * - Window 4: Polar Gemini SPC Limit-Cycle Attractor (S0..S3) & 360° Phase-Drift Rose
 * ============================================================================ */
(function () {
  const PI_314 = 3.14;
  const TWO_PI = Math.PI * 2;
  const DEG_TO_RAD = Math.PI / 180;
  const RAD_TO_DEG = 180 / Math.PI;

  function createViewportsController(state, addLog) {
    const canvasMain = document.getElementById("sovereign25dGameCanvas");
    const ctxMain = canvasMain ? canvasMain.getContext("2d") : null;

    const canvasArena = document.getElementById("tacticalArenaCanvas");
    const ctxArena = canvasArena ? canvasArena.getContext("2d") : null;

    const canvasRadar = document.getElementById("worldCaravanRadarCanvas");
    const ctxRadar = canvasRadar ? canvasRadar.getContext("2d") : null;

    const canvasSpc = document.getElementById("spcPhaseOscilloscopeCanvas");
    const ctxSpc = canvasSpc ? canvasSpc.getContext("2d") : null;

    // Track hover polar coordinates on Window #1
    const hoverPolar = { active: false, sx: 0, sy: 0, gx: 0, gy: 0, rPi: 2.0, angleDeg: 0, angleRad: 0 };

    /* Isometric projection of (gx, gy, gz) where (0,0) is the Single-Castle Center */
    function isoProject(gx, gy, gz) {
      if (!canvasMain) return { x: 0, y: 0 };
      const w = canvasMain.width;
      const h = canvasMain.height;
      const scale = 64 * (state.cameraZoom || 1.0);
      const sx = w * 0.50 + (state.cameraPanX || 0) + (gx - gy) * scale;
      const sy = h * 0.52 + (state.cameraPanY || 0) + (gx + gy) * (scale * 0.52) - (gz || 0) * (state.cameraZoom || 1.0);
      return { x: sx, y: sy };
    }

    /* Project Polar (rPi, angleDeg, gz) directly onto the 2.5D Isometric Circular Arena */
    function polarIsoProject(rPi, angleDeg, gz) {
      const rad = (angleDeg || 0) * DEG_TO_RAD;
      const worldR = (rPi || 0) * 1.18;
      const gx = Math.cos(rad) * worldR;
      const gy = Math.sin(rad) * worldR;
      return isoProject(gx, gy, gz || 0);
    }

    function isoUnproject(sx, sy) {
      if (!canvasMain) return { gx: 0, gy: 0, rPi: 0, angleDeg: 0, angleRad: 0 };
      const w = canvasMain.width;
      const h = canvasMain.height;
      const scale = 64 * (state.cameraZoom || 1.0);
      const dx = (sx - w * 0.50 - (state.cameraPanX || 0)) / scale;
      const dy = (sy - h * 0.52 - (state.cameraPanY || 0)) / (scale * 0.52);
      const gx = (dx + dy) * 0.5;
      const gy = (dy - dx) * 0.5;
      const worldR = Math.hypot(gx, gy);
      const rPi = +(worldR / 1.18).toFixed(2);
      let deg = Math.atan2(gy, gx) * RAD_TO_DEG;
      if (deg < 0) deg += 360;
      return {
        gx: +gx.toFixed(2),
        gy: +gy.toFixed(2),
        rPi: rPi,
        angleDeg: +deg.toFixed(1),
        angleRad: +(deg * DEG_TO_RAD).toFixed(3)
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

    /* Spawn Expanding Circular Shockwave Ring on 360° (2π) Completion or Impact */
    function spawnCircularShockwave(rPiCenter, angleDegCenter, maxRadiusPx, color, arcSpanDeg, headingDeg) {
      const p = polarIsoProject(rPiCenter, angleDegCenter, 4);
      state.circularWaves = state.circularWaves || [];
      state.circularWaves.push({
        x: p.x,
        y: p.y,
        curR: 8,
        maxR: maxRadiusPx || 95,
        life: 1.0,
        color: color || "#10B981",
        arcSpanDeg: arcSpanDeg || 360,
        headingDeg: headingDeg || 0
      });
    }

    function spawnVfx(type, sx, sy, tx, ty, color) {
      for (let i = 0; i < 14; i++) {
        const ang = (i / 14) * TWO_PI + (state.tickCount * 0.05);
        state.vfxParticles.push({
          type: type || "SPARKLES",
          x: sx,
          y: sy,
          tx: tx != null ? tx : sx + Math.cos(ang) * 90,
          ty: ty != null ? ty : sy + Math.sin(ang) * 55,
          vx: Math.cos(ang) * 3.14,
          vy: Math.sin(ang) * 3.14 - 1.2,
          progress: 0,
          life: 1.0,
          angle: ang,
          radius: (4 + Math.random() * 6.5) * (state.vfxScalePi / PI_314),
          color: color || "#FDE68A"
        });
      }
    }

    /* Helper: Draw an Isometric Circular Arc / Sector on Window #1 */
    function drawIsoCircleOrSector(ctx, centerGx, centerGy, radiusWorld, startDeg, endDeg, strokeStyle, fillStyle, lineWidth, dashed) {
      const steps = 48;
      const span = endDeg - startDeg;
      ctx.save();
      if (dashed) ctx.setLineDash(dashed);
      ctx.beginPath();
      if (fillStyle && Math.abs(span) < 359) {
        const cPos = isoProject(centerGx, centerGy, 2);
        ctx.moveTo(cPos.x, cPos.y);
      }
      for (let i = 0; i <= steps; i++) {
        const deg = startDeg + (span * i) / steps;
        const rad = deg * DEG_TO_RAD;
        const px = centerGx + Math.cos(rad) * radiusWorld;
        const py = centerGy + Math.sin(rad) * radiusWorld;
        const proj = isoProject(px, py, 2);
        if (i === 0 && (!fillStyle || Math.abs(span) >= 359)) {
          ctx.moveTo(proj.x, proj.y);
        } else {
          ctx.lineTo(proj.x, proj.y);
        }
      }
      if (fillStyle) {
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        if (Math.abs(span) >= 359) ctx.closePath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth || 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    /* ========================================================================
     * WINDOW 1: 3.14π CIRCULAR ISOMETRIC ARENA, CONCENTRIC RINGS & DEGREES
     * ======================================================================== */
    function renderMain25DViewport() {
      if (!ctxMain || !canvasMain) return;
      const w = canvasMain.width;
      const h = canvasMain.height;
      const t = state.tickCount * 0.045 * (state.walkSpeedPi / PI_314);
      const themes = window.SOV_ERA_THEMES || [];
      const theme = themes[state.eraIndex] || themes[0];

      // 1. Radial Cosmic Sky Backdrop
      const centerScreen = isoProject(0, 0, 0);
      const grad = ctxMain.createRadialGradient(centerScreen.x, centerScreen.y, 30, centerScreen.x, centerScreen.y, Math.max(w, h) * 0.72);
      grad.addColorStop(0, theme.tileB || "#1E293B");
      grad.addColorStop(0.55, theme.skyBot || "#0F172A");
      grad.addColorStop(1, "#03060D");
      ctxMain.fillStyle = grad;
      ctxMain.fillRect(0, 0, w, h);

      // 2. Draw Concentric 3.14π Circular Battlefield Discs & Degree Rings
      const rings = [
        { rPi: 4.71, label: "RING IV (4.71π = 3π/2) • FURŪSIYYAH CAVALRY & SIEGE ORBIT", stroke: "rgba(244, 63, 94, 0.42)", fill: "rgba(15, 23, 42, 0.45)" },
        { rPi: 3.14, label: "RING III (3.14π) • SOVEREIGN MUBĀRAZAH & CLASH HORIZON", stroke: "rgba(56, 189, 248, 0.55)", fill: "rgba(16, 32, 62, 0.36)" },
        { rPi: 2.00, label: "RING II (2.00π = 360° RAD) • DEFENDER / VANGUARD SHIELD WALL", stroke: "rgba(212, 175, 55, 0.65)", fill: "rgba(30, 41, 35, 0.38)" },
        { rPi: 1.00, label: "RING I (1.00π = 180° RAD) • SANCTUARY & BĪMĀRISTĀN TRIAGE CORE", stroke: "rgba(16, 185, 129, 0.72)", fill: "rgba(16, 185, 129, 0.10)" }
      ];

      rings.forEach((rk) => {
        drawIsoCircleOrSector(ctxMain, 0, 0, rk.rPi * 1.18, 0, 360, rk.stroke, rk.fill, rk.rPi === 3.14 ? 2.2 : 1.5, null);
        // Label at 270° (Top of isometric circle)
        const lblPos = polarIsoProject(rk.rPi, 225, 0);
        ctxMain.fillStyle = "rgba(253, 230, 138, 0.78)";
        ctxMain.font = "bold 9px Consolas";
        ctxMain.textAlign = "center";
        ctxMain.fillText(rk.label, lblPos.x, lblPos.y - 4);
      });

      // 3. Draw 24 Radial Degree Spokes (Every 15°, Major Labels Every 30°)
      for (let deg = 0; deg < 360; deg += 15) {
        const isMajor = (deg % 30 === 0);
        const isCardinal = (deg % 90 === 0);
        if (!state.showAStarGrid && !isMajor) continue;

        const pInner = polarIsoProject(0.35, deg, 0);
        const pOuter = polarIsoProject(4.85, deg, 0);

        ctxMain.save();
        ctxMain.beginPath();
        if (!isCardinal) ctxMain.setLineDash([4, 4]);
        ctxMain.moveTo(pInner.x, pInner.y);
        ctxMain.lineTo(pOuter.x, pOuter.y);
        ctxMain.strokeStyle = isCardinal
          ? "rgba(212, 175, 55, 0.52)"
          : (isMajor ? "rgba(56, 189, 248, 0.28)" : "rgba(148, 163, 184, 0.14)");
        ctxMain.lineWidth = isCardinal ? 1.6 : 1.0;
        ctxMain.stroke();
        ctxMain.restore();

        if (isMajor) {
          const pRim = polarIsoProject(5.15, deg, 0);
          const piFrac = (deg / 180).toFixed(2);
          ctxMain.fillStyle = isCardinal ? "#FDE68A" : "#93C5FD";
          ctxMain.font = isCardinal ? "bold 10px Consolas" : "9px Consolas";
          ctxMain.textAlign = "center";
          ctxMain.fillText(deg + "° (" + piFrac + "π)", pRim.x, pRim.y + 3);
        }
      }

      // 4. Draw Global Rotating 3.14π Phase Sweep Ray (0° → 360°)
      const globalDeg = state.globalPhaseDeg || 0;
      const sweepEnd = polarIsoProject(4.71, globalDeg, 3);
      ctxMain.save();
      ctxMain.beginPath();
      ctxMain.moveTo(centerScreen.x, centerScreen.y);
      ctxMain.lineTo(sweepEnd.x, sweepEnd.y);
      ctxMain.strokeStyle = "rgba(16, 185, 129, 0.65)";
      ctxMain.lineWidth = 2.0;
      ctxMain.stroke();
      ctxMain.restore();

      // 5. Draw Strongholds on Circular Ring Bearings (r·π, θ°)
      state.strongholds.forEach((sh, idx) => {
        const pos = isoProject(sh.gx, sh.gy, 0);
        if (sh.isCastle) {
          // Central Circular Dome Sanctuary at (0,0)
          drawIsoCircleOrSector(ctxMain, 0, 0, 0.48, 0, 360, "#D4AF37", "rgba(212, 175, 55, 0.28)", 2.5, null);
          ctxMain.beginPath();
          ctxMain.arc(pos.x, pos.y - 22, 24 * (state.cameraZoom || 1.0), 0, TWO_PI);
          ctxMain.fillStyle = "rgba(212, 175, 55, 0.24)";
          ctxMain.fill();
          ctxMain.strokeStyle = "#FDE68A";
          ctxMain.lineWidth = 2.2;
          ctxMain.stroke();

          ctxMain.beginPath();
          ctxMain.arc(pos.x, pos.y - 28, 15 * (state.cameraZoom || 1.0), Math.PI, 0);
          ctxMain.fillStyle = "#D4AF37";
          ctxMain.fill();

          ctxMain.fillStyle = "#FDE68A";
          ctxMain.font = "bold 11px Consolas";
          ctxMain.textAlign = "center";
          ctxMain.fillText("🕋 0.00π CORE (360° ANCHOR)", pos.x, pos.y + 18);
        } else {
          const shDeg = ((Math.atan2(sh.gy, sh.gx) * RAD_TO_DEG) + 360) % 360;
          ctxMain.beginPath();
          ctxMain.arc(pos.x, pos.y - 12, 12 * (state.cameraZoom || 1.0), 0, TWO_PI);
          ctxMain.fillStyle = sh.isEnemy ? "rgba(153, 27, 27, 0.85)" : "rgba(15, 23, 42, 0.9)";
          ctxMain.fill();
          ctxMain.strokeStyle = sh.color || "#D4AF37";
          ctxMain.lineWidth = 2;
          ctxMain.stroke();

          ctxMain.fillStyle = "#F8FAFC";
          ctxMain.font = "9px Consolas";
          ctxMain.textAlign = "center";
          ctxMain.fillText(sh.name.split("(")[0].trim().slice(0, 20) + " [" + Math.round(shDeg) + "°]", pos.x, pos.y + 13);
        }
      });

      // 6. Draw Circular Ribāṭ Defense Towers & Their 360° Aura Rings
      state.towers.forEach((tw) => {
        const tp = isoProject(tw.gx, tw.gy, 0);
        drawIsoCircleOrSector(ctxMain, tw.gx, tw.gy, 0.65, 0, 360, "rgba(56, 189, 248, 0.45)", "rgba(56, 189, 248, 0.08)", 1.3, [3, 3]);
        ctxMain.beginPath();
        ctxMain.arc(tp.x, tp.y - 14, 9, 0, TWO_PI);
        ctxMain.fillStyle = tw.color;
        ctxMain.fill();
        ctxMain.strokeStyle = "#FDE68A";
        ctxMain.stroke();
      });

      // 7. Update & Draw Orbital Caravans (Moving Along Circular 3.14π Trade Rings)
      state.caravans.forEach((cv, cIdx) => {
        cv.orbitAngleDeg = ((cv.orbitAngleDeg != null ? cv.orbitAngleDeg : cIdx * 120) + 0.42 * (state.simSpeedMult || 1.0)) % 360;
        cv.orbitRadiusPi = cv.orbitRadiusPi || (2.5 + (cIdx % 3) * 0.75);
        const rad = cv.orbitAngleDeg * DEG_TO_RAD;
        cv.gx = Math.cos(rad) * cv.orbitRadiusPi * 1.18;
        cv.gy = Math.sin(rad) * cv.orbitRadiusPi * 1.18;

        const cp = isoProject(cv.gx, cv.gy, 4);
        ctxMain.fillStyle = cv.friendly ? "#10B981" : "#F59E0B";
        ctxMain.beginPath();
        ctxMain.arc(cp.x, cp.y - 6, 8, 0, TWO_PI);
        ctxMain.fill();
        ctxMain.strokeStyle = "#FFFFFF";
        ctxMain.stroke();

        ctxMain.fillStyle = "#FDE68A";
        ctxMain.font = "9px Consolas";
        ctxMain.textAlign = "center";
        ctxMain.fillText("🐪 " + Math.round(cv.orbitAngleDeg) + "° (" + cv.orbitRadiusPi.toFixed(1) + "π)", cp.x, cp.y - 18);
      });

      // 8. Update & Draw All Combat Units on Procedural Circular Trajectories (r·π, θ°, Δθ°, ω)
      let frameTorqueSum = 0;
      let frameIncidenceSum = 0;
      let frameClashCount = 0;

      state.units.forEach((u, idx) => {
        const res = window.SovCommandEngine
          ? window.SovCommandEngine.evaluateArchetypeResonance(u, u.verb)
          : { multiplier: 1.0, tier: "BASELINE", offMult: 1.0, defMult: 1.0, arcDegrees: 180, orbitRadiusPi: 2.0, angularSpeedDeg: 120 };

        u.activeResonance = res.multiplier;
        u.resonanceTier = res.tier;
        u.arcDegrees = res.arcDegrees || 180;

        // Target Orbit Ring r·π based on Command & Role (Smoothly interpolates to target ring)
        const targetRingPi = u.customOrbitPi || res.orbitRadiusPi || (u.isEnemy ? 3.14 : 2.00);
        u.orbitRadiusPi = u.orbitRadiusPi != null
          ? u.orbitRadiusPi + (targetRingPi - u.orbitRadiusPi) * 0.06
          : targetRingPi;

        // Procedural Angular Velocity ω (°/tick)
        const dirSign = u.isEnemy ? -1 : 1; // Opposition orbits counter-clockwise for continuous angular interception!
        const omegaDegPerTick = ((res.angularSpeedDeg || 120) / 60) * (state.walkSpeedPi / PI_314) * (state.simSpeedMult || 1.0) * 0.55;
        u.angularVelocityDeg = +(omegaDegPerTick * 60).toFixed(1);

        u.angleDeg = ((u.angleDeg != null ? u.angleDeg : (idx * 30)) + dirSign * omegaDegPerTick + 360) % 360;
        u.revProgressDeg = (u.revProgressDeg || 0) + Math.abs(omegaDegPerTick);

        // Check for 360° (2π) Full-Circle Completion!
        if (u.revProgressDeg >= 360) {
          u.revProgressDeg -= 360;
          u.completedCircles = (u.completedCircles || 0) + 1;
          state.totalCompletedCircles = (state.totalCompletedCircles || 0) + 1;
          state.barakahPower += 3.14 * res.multiplier;

          const upComp = polarIsoProject(u.orbitRadiusPi, u.angleDeg, 18);
          spawnCircularShockwave(u.orbitRadiusPi, u.angleDeg, 78 * res.multiplier, u.isEnemy ? "#F43F5E" : "#10B981", u.arcDegrees, u.angleDeg);
          spawnFloatingText(
            "⭕ 360° (2π) COMPLETE! [" + u.verb + " 3.14x PULSE]",
            upComp.x,
            upComp.y - 48,
            u.isEnemy ? "#FDA4AF" : "#6EE7B7",
            true
          );
        }

        // Convert Polar (r·π, θ°) to World (gx, gy)
        const rad = u.angleDeg * DEG_TO_RAD;
        const worldR = u.orbitRadiusPi * 1.18;
        u.gx = Math.cos(rad) * worldR;
        u.gy = Math.sin(rad) * worldR;

        // Find Nearest Opposing Unit by Angular & Radial Proximity for Procedural Degree Clash
        let bestTarget = null;
        let bestAngularDist = 999;
        state.units.forEach((other) => {
          if (other.isEnemy !== u.isEnemy) {
            const d = Math.hypot((other.gx || 0) - u.gx, (other.gy || 0) - u.gy);
            if (d < bestAngularDist) {
              bestAngularDist = d;
              bestTarget = other;
            }
          }
        });

        if (bestTarget && window.SovCommandEngine) {
          const circ = window.SovCommandEngine.evaluateCircularImpact(u, bestTarget, u.verb, null, u.arcDegrees, u.revProgressDeg);
          u.lastIncidenceDeg = circ.incidenceAngleDeg;
          u.lastTorquePi = circ.tangentialTorquePi;
          u.lastProceduralDmg = circ.netProceduralDamage;

          frameTorqueSum += circ.tangentialTorquePi;
          frameIncidenceSum += circ.incidenceAngleDeg;
          frameClashCount++;

          // Trigger Procedural Degree Impact when angular sector sweeps across target
          if (state.tickCount % 48 === (idx * 4) % 48) {
            const up = isoProject(u.gx, u.gy, 14);
            const bp = isoProject(bestTarget.gx, bestTarget.gy, 14);
            spawnVfx(u.vfxType, up.x, up.y, bp.x, bp.y, u.isEnemy ? "#F43F5E" : "#FDE68A");

            const dmg = Math.round(circ.netProceduralDamage * 0.28);
            bestTarget.hp = Math.max(45, bestTarget.hp - dmg);
            if (bestTarget.hp <= 55) {
              bestTarget.hp = bestTarget.maxHp;
              if (!u.isEnemy) u.conversions = (u.conversions || 0) + 1;
            }

            const degTag = "⚡" + dmg + " [θ=" + Math.round(u.angleDeg) + "° • φ=" + Math.round(circ.incidenceAngleDeg) + "° • Δ" + u.arcDegrees + "° • " + res.multiplier.toFixed(2) + "x]";
            spawnFloatingText(degTag, bp.x, bp.y - 34, u.isEnemy ? "#FCA5A5" : "#FDE68A", res.multiplier >= 1.45);

            window.SovCommandEngine.ringBuffer.enqueue(
              state.tickCount + 2,
              res.tier === "PRIME_RESONANCE" ? 0 : 1,
              u.name.split("(")[0].trim(),
              u.verb,
              bestTarget.name.split("(")[0].trim(),
              u,
              { incidenceDeg: Math.round(circ.incidenceAngleDeg), dmg: dmg }
            );
          }
        }

        const floatZ = u.isFloating
          ? 14 + Math.sin(t * 2.0 + idx) * 6.0 * (state.floatAmpPi / PI_314)
          : Math.abs(Math.sin(t * 3.14 + idx)) * 3.5;

        const up = isoProject(u.gx, u.gy, floatZ);
        const groundP = isoProject(u.gx, u.gy, 0);

        // 8A. Draw Unit's Procedural Command Sweep Sector (Δθ° Cone on the Ground)
        const halfArc = (u.arcDegrees || 180) * 0.5;
        const headingDeg = u.angleDeg + (u.isEnemy ? -90 : 90);
        const sectorStroke = u.isEnemy
          ? "rgba(244, 63, 94, 0.55)"
          : (u.resonanceTier === "PRIME_RESONANCE" ? "rgba(16, 185, 129, 0.65)" : "rgba(212, 175, 55, 0.50)");
        const sectorFill = u.isEnemy
          ? "rgba(244, 63, 94, 0.10)"
          : (u.resonanceTier === "PRIME_RESONANCE" ? "rgba(16, 185, 129, 0.13)" : "rgba(212, 175, 55, 0.10)");

        drawIsoCircleOrSector(
          ctxMain,
          u.gx,
          u.gy,
          0.58 * (state.vfxScalePi / PI_314),
          headingDeg - halfArc,
          headingDeg + halfArc,
          sectorStroke,
          sectorFill,
          1.4,
          null
        );

        // 8B. Draw Unit's 0° → 360° (2π) Circular Revolution Progress Gauge Ring
        const revEndRad = -Math.PI * 0.5 + ((u.revProgressDeg || 0) / 360) * TWO_PI;
        ctxMain.beginPath();
        ctxMain.arc(groundP.x, groundP.y, 17, 0, TWO_PI);
        ctxMain.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctxMain.lineWidth = 2.2;
        ctxMain.stroke();

        ctxMain.beginPath();
        ctxMain.arc(groundP.x, groundP.y, 17, -Math.PI * 0.5, revEndRad);
        ctxMain.strokeStyle = u.isEnemy ? "#F43F5E" : "#10B981";
        ctxMain.lineWidth = 2.8;
        ctxMain.stroke();

        if (idx === state.selectedUnitIndex) {
          ctxMain.beginPath();
          ctxMain.arc(groundP.x, groundP.y, 24, 0, TWO_PI);
          ctxMain.strokeStyle = "#38BDF8";
          ctxMain.lineWidth = 2.4;
          ctxMain.stroke();
        }

        // 8C. Draw Circular Unit Avatar & Orbital Weapon Arc
        ctxMain.fillStyle = u.isEnemy ? "#DC2626" : (idx === 0 ? "#10B981" : theme.accent);
        ctxMain.beginPath();
        ctxMain.arc(up.x, up.y - 14, 10, 0, TWO_PI);
        ctxMain.fill();
        ctxMain.strokeStyle = "#FDE68A";
        ctxMain.lineWidth = 1.5;
        ctxMain.stroke();

        ctxMain.beginPath();
        ctxMain.arc(up.x, up.y - 27, 5.5, 0, TWO_PI);
        ctxMain.fillStyle = "#FDE68A";
        ctxMain.fill();

        // Rotating Circular Blade / Shield Orbit around Unit
        const bladeAng = (u.revProgressDeg || 0) * DEG_TO_RAD;
        ctxMain.beginPath();
        ctxMain.arc(up.x, up.y - 14, 16, bladeAng - 0.9, bladeAng + 0.9);
        ctxMain.strokeStyle = u.isEnemy ? "#FCA5A5" : "#6EE7B7";
        ctxMain.lineWidth = 2.6;
        ctxMain.stroke();

        // 8D. Unit Circular Degree & Resonance Tag
        const completionPct = Math.round(((u.revProgressDeg || 0) / 360) * 100);
        ctxMain.fillStyle = "rgba(3, 7, 18, 0.82)";
        ctxMain.fillRect(up.x - 44, up.y - 54, 88, 17);
        ctxMain.fillStyle = u.activeResonance > 1.05 ? "#6EE7B7" : "#E2E8F0";
        ctxMain.font = "bold 9px Consolas";
        ctxMain.textAlign = "center";
        ctxMain.fillText(
          u.verb + " " + Math.round(u.angleDeg) + "° [Δ" + u.arcDegrees + "°|" + completionPct + "%]",
          up.x,
          up.y - 42
        );
      });

      // Store Aggregate Circular Metrics on state for the Top Telemetry Bar
      state.globalPhaseDeg = ((state.globalPhaseDeg || 0) + 1.57 * (state.simSpeedMult || 1.0)) % 360;
      state.meanTorquePi = frameClashCount > 0 ? +(frameTorqueSum / frameClashCount).toFixed(1) : 48.6;
      state.meanIncidenceDeg = frameClashCount > 0 ? +(frameIncidenceSum / frameClashCount).toFixed(1) : 135.0;

      // 9. Update & Draw Expanding 360° Completion Shockwave Rings
      state.circularWaves = state.circularWaves || [];
      for (let i = state.circularWaves.length - 1; i >= 0; i--) {
        const cw = state.circularWaves[i];
        cw.curR += 2.6;
        cw.life -= 0.028;
        if (cw.life <= 0 || cw.curR >= cw.maxR) {
          state.circularWaves.splice(i, 1);
          continue;
        }
        ctxMain.save();
        ctxMain.globalAlpha = Math.max(0, cw.life);
        ctxMain.strokeStyle = cw.color;
        ctxMain.lineWidth = 2.6;
        ctxMain.beginPath();
        const startA = ((cw.headingDeg - cw.arcSpanDeg * 0.5) * DEG_TO_RAD);
        const endA = ((cw.headingDeg + cw.arcSpanDeg * 0.5) * DEG_TO_RAD);
        ctxMain.ellipse(cw.x, cw.y, cw.curR, cw.curR * 0.52, 0, startA, endA);
        ctxMain.stroke();
        ctxMain.restore();
      }

      // 10. Update & Draw Circular VFX Particles
      for (let i = state.vfxParticles.length - 1; i >= 0; i--) {
        const p = state.vfxParticles[i];
        p.progress += 0.048;
        p.life -= 0.024;
        if (p.life <= 0) {
          state.vfxParticles.splice(i, 1);
          continue;
        }
        // Spiral / circular arc interpolation
        const spiralOffset = Math.sin(p.progress * Math.PI) * 28;
        const curX = p.x + (p.tx - p.x) * Math.min(1, p.progress) + Math.cos(p.angle + p.progress * PI_314) * spiralOffset * 0.4;
        const curY = p.y + (p.ty - p.y) * Math.min(1, p.progress) - Math.sin(p.progress * Math.PI) * 32;

        ctxMain.save();
        ctxMain.globalAlpha = Math.max(0, p.life);
        ctxMain.strokeStyle = p.color || "#FDE68A";
        ctxMain.fillStyle = p.color || "#6EE7B7";
        ctxMain.lineWidth = 2.5;
        ctxMain.beginPath();
        if (p.type.includes("SWORD_SWIPE")) {
          ctxMain.arc(curX, curY, p.radius * 2.3, p.progress * PI_314, p.progress * PI_314 + 2.2);
          ctxMain.stroke();
        } else {
          ctxMain.arc(curX, curY, p.radius, 0, TWO_PI);
          ctxMain.fill();
        }
        ctxMain.restore();
      }

      // 11. Draw Interactive Polar Cursor Protractor when hovering over Window #1
      if (hoverPolar.active) {
        ctxMain.save();
        ctxMain.beginPath();
        ctxMain.moveTo(centerScreen.x, centerScreen.y);
        ctxMain.lineTo(hoverPolar.sx, hoverPolar.sy);
        ctxMain.strokeStyle = "rgba(56, 189, 248, 0.55)";
        ctxMain.setLineDash([4, 4]);
        ctxMain.stroke();

        ctxMain.beginPath();
        ctxMain.arc(hoverPolar.sx, hoverPolar.sy, 14, 0, TWO_PI);
        ctxMain.strokeStyle = "#38BDF8";
        ctxMain.setLineDash([]);
        ctxMain.stroke();

        ctxMain.fillStyle = "rgba(3, 7, 18, 0.9)";
        ctxMain.fillRect(hoverPolar.sx + 14, hoverPolar.sy - 22, 178, 20);
        ctxMain.strokeStyle = "#38BDF8";
        ctxMain.strokeRect(hoverPolar.sx + 14, hoverPolar.sy - 22, 178, 20);
        ctxMain.fillStyle = "#FDE68A";
        ctxMain.font = "bold 10px Consolas";
        ctxMain.textAlign = "left";
        ctxMain.fillText(
          "r=" + hoverPolar.rPi + "π | θ=" + hoverPolar.angleDeg + "° (" + hoverPolar.angleRad + " rad)",
          hoverPolar.sx + 20,
          hoverPolar.sy - 9
        );
        ctxMain.restore();
      }

      // 12. Update & Draw Floating Degree & Damage Callouts
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
        ctxMain.font = ft.isBig ? "bold 11px Consolas" : "bold 10px Consolas";
        ctxMain.fillStyle = ft.color;
        ctxMain.textAlign = "center";
        ctxMain.fillText(ft.text, ft.x, ft.y);
        ctxMain.restore();
      }
    }

    /* ========================================================================
     * WINDOW 2: 360° (2π) PROCEDURAL IMPACT PROTRACTOR & CIRCULAR FRAME WHEEL
     * ======================================================================== */
    function renderTacticalArenaViewport() {
      if (!ctxArena || !canvasArena || !window.SovCommandEngine) return;
      const w = canvasArena.width;
      const h = canvasArena.height;
      const cx = w * 0.44;
      const cy = h * 0.52;
      const outerR = Math.min(w * 0.38, h * 0.41);

      const profiles = window.SOV_PROFILES_DATA || [];
      const aIdx = parseInt(document.getElementById("clashAttackerSelect")?.value || "1", 10) || 0;
      const dIdx = parseInt(document.getElementById("clashDefenderSelect")?.value || "10", 10) || 10;
      const att = profiles[aIdx] || profiles[0];
      const def = profiles[dIdx] || profiles[10];
      const activeVerb = document.getElementById("clashVerbSelect")?.value || "DEFEND";
      const customIncDeg = parseFloat(document.getElementById("clashAngleSlider")?.value || "145");
      const customSweepDeg = parseFloat(document.getElementById("clashArcSlider")?.value || "180");

      const cmd = window.SovCommandEngine.getCommandByVerb(activeVerb);
      const totalFrames = cmd.startupFrames + cmd.activeFrames + cmd.recoveryFrames;
      const curFrame = state.tickCount % totalFrames;
      const revDeg = +((curFrame / totalFrames) * 360).toFixed(1);

      const circ = window.SovCommandEngine.evaluateCircularImpact(att, def, activeVerb, customIncDeg, customSweepDeg, revDeg);

      // Background
      ctxArena.fillStyle = "#040814";
      ctxArena.fillRect(0, 0, w, h);

      // 1. Draw 360° Outer Protractor Ring & Degree Ticks
      ctxArena.beginPath();
      ctxArena.arc(cx, cy, outerR, 0, TWO_PI);
      ctxArena.strokeStyle = "rgba(212, 175, 55, 0.45)";
      ctxArena.lineWidth = 2;
      ctxArena.stroke();

      for (let deg = 0; deg < 360; deg += 15) {
        const rad = (deg - 90) * DEG_TO_RAD;
        const isMajor = deg % 45 === 0;
        const r1 = outerR - (isMajor ? 10 : 5);
        const r2 = outerR;
        ctxArena.beginPath();
        ctxArena.moveTo(cx + Math.cos(rad) * r1, cy + Math.sin(rad) * r1);
        ctxArena.lineTo(cx + Math.cos(rad) * r2, cy + Math.sin(rad) * r2);
        ctxArena.strokeStyle = isMajor ? "#FDE68A" : "rgba(148, 163, 184, 0.35)";
        ctxArena.lineWidth = isMajor ? 1.8 : 1;
        ctxArena.stroke();

        if (isMajor) {
          const rl = outerR + 15;
          ctxArena.fillStyle = "#FDE68A";
          ctxArena.font = "bold 9px Consolas";
          ctxArena.textAlign = "center";
          ctxArena.fillText(deg + "°", cx + Math.cos(rad) * rl, cy + Math.sin(rad) * rl + 3);
        }
      }

      // 2. Draw Circular Frame-Phase Wheel (Startup° -> Active° -> Recovery° = 360° Complete Circle!)
      const wheelR = outerR * 0.78;
      const sEndDeg = (cmd.startupFrames / totalFrames) * 360;
      const aEndDeg = ((cmd.startupFrames + cmd.activeFrames) / totalFrames) * 360;

      const drawRingArc = (startD, endD, color, width) => {
        ctxArena.beginPath();
        ctxArena.arc(cx, cy, wheelR, (startD - 90) * DEG_TO_RAD, (endD - 90) * DEG_TO_RAD);
        ctxArena.strokeStyle = color;
        ctxArena.lineWidth = width;
        ctxArena.stroke();
      };

      drawRingArc(0, sEndDeg, "rgba(56, 189, 248, 0.75)", 14);       // Startup Arc (Cyan)
      drawRingArc(sEndDeg, aEndDeg, "rgba(16, 185, 129, 0.88)", 14); // Active Impact Arc (Emerald)
      drawRingArc(aEndDeg, 360, "rgba(245, 158, 11, 0.70)", 14);     // Recovery Completion Arc (Gold)

      // 3. Draw Command Sweep Arc Sector (Δθ°) in the Inner Duel Circle
      const innerR = outerR * 0.54;
      const halfSweep = circ.sweepArcDeg * 0.5;
      ctxArena.beginPath();
      ctxArena.moveTo(cx, cy);
      ctxArena.arc(cx, cy, innerR, (-halfSweep - 90) * DEG_TO_RAD, (halfSweep - 90) * DEG_TO_RAD);
      ctxArena.closePath();
      ctxArena.fillStyle = circ.resonanceAttacker.tier === "PRIME_RESONANCE"
        ? "rgba(16, 185, 129, 0.22)"
        : "rgba(212, 175, 55, 0.16)";
      ctxArena.fill();
      ctxArena.strokeStyle = "#10B981";
      ctxArena.lineWidth = 1.8;
      ctxArena.stroke();

      // 4. Plot Attacker (0° Top Anchor) & Defender (at Incidence Angle φ°) on the Circular Duel Ring
      const attRad = (-90) * DEG_TO_RAD;
      const defRad = (circ.incidenceAngleDeg - 90) * DEG_TO_RAD;
      const ax = cx + Math.cos(attRad) * innerR;
      const ay = cy + Math.sin(attRad) * innerR;
      const dx = cx + Math.cos(defRad) * innerR;
      const dy = cy + Math.sin(defRad) * innerR;

      // Draw Incidence Angle φ° Arc between Attacker & Defender
      ctxArena.beginPath();
      ctxArena.arc(cx, cy, innerR * 0.45, attRad, defRad);
      ctxArena.strokeStyle = "#F43F5E";
      ctxArena.lineWidth = 2.2;
      ctxArena.stroke();

      // Draw Rotating Playhead Ray (0° -> 360° Completion)
      const playRad = (revDeg - 90) * DEG_TO_RAD;
      ctxArena.beginPath();
      ctxArena.moveTo(cx, cy);
      ctxArena.lineTo(cx + Math.cos(playRad) * (outerR + 4), cy + Math.sin(playRad) * (outerR + 4));
      ctxArena.strokeStyle = "#FFFFFF";
      ctxArena.lineWidth = 2.4;
      ctxArena.stroke();

      // Attacker & Defender Nodes on the Circle
      ctxArena.beginPath();
      ctxArena.arc(ax, ay, 11, 0, TWO_PI);
      ctxArena.fillStyle = "#10B981";
      ctxArena.fill();
      ctxArena.strokeStyle = "#FDE68A";
      ctxArena.stroke();

      ctxArena.beginPath();
      ctxArena.arc(dx, dy, 11, 0, TWO_PI);
      ctxArena.fillStyle = "#EF4444";
      ctxArena.fill();
      ctxArena.strokeStyle = "#FCA5A5";
      ctxArena.stroke();

      // Center Hub Readout
      ctxArena.beginPath();
      ctxArena.arc(cx, cy, 28, 0, TWO_PI);
      ctxArena.fillStyle = "rgba(4, 8, 20, 0.92)";
      ctxArena.fill();
      ctxArena.strokeStyle = "#D4AF37";
      ctxArena.stroke();

      ctxArena.fillStyle = "#FDE68A";
      ctxArena.font = "bold 11px Consolas";
      ctxArena.textAlign = "center";
      ctxArena.fillText(Math.round(revDeg) + "°", cx, cy - 2);
      ctxArena.fillStyle = "#6EE7B7";
      ctxArena.font = "9px Consolas";
      ctxArena.fillText((revDeg / 180).toFixed(2) + "π", cx, cy + 11);

      // 5. Right-Side Procedural Degree & Impact Telemetry Column inside Window #2
      const rx = w * 0.68;
      const lines = [
        { lbl: "ACTIVE COMMAND", val: cmd.verb + " (" + circ.resonanceAttacker.multiplier.toFixed(2) + "x)", col: "#FDE68A" },
        { lbl: "SWEEP ARC (Δθ°)", val: circ.sweepArcDeg + "° (" + circ.sweepArcRad + " rad)", col: "#6EE7B7" },
        { lbl: "INCIDENCE (φ°)", val: circ.incidenceAngleDeg + "° (" + circ.incidenceRad + " rad)", col: "#F43F5E" },
        { lbl: "SECTOR ZONE", val: circ.sectorZoneLabel.split(" ")[0], col: "#93C5FD" },
        { lbl: "ANGULAR VEL (ω)", val: circ.angularVelocityDegPerSec + "°/s (" + circ.angularVelocityRadPerSec + " rad/s)", col: "#E2E8F0" },
        { lbl: "CENTRIPETAL (Fc)", val: circ.centripetalForcePi + " N·π @ r=" + circ.orbitRadiusPi + "π", col: "#A78BFA" },
        { lbl: "TORQUE IMPACT (τ)", val: circ.tangentialTorquePi + " N·m·π", col: "#FDE68A" },
        { lbl: "2π COMPLETION", val: circ.completionPct + "% (" + circ.completionMult + "x Surge)", col: "#10B981" },
        { lbl: "NET PROCEDURAL HIT", val: circ.netProceduralDamage + " HP / Strike", col: "#6EE7B7" }
      ];

      lines.forEach((ln, i) => {
        const y = 34 + i * 26;
        ctxArena.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctxArena.fillRect(rx - 8, y - 13, w - rx + 2, 22);
        ctxArena.fillStyle = "#94A3B8";
        ctxArena.font = "9px Consolas";
        ctxArena.textAlign = "left";
        ctxArena.fillText(ln.lbl + ":", rx - 2, y + 1);
        ctxArena.fillStyle = ln.col;
        ctxArena.font = "bold 10px Consolas";
        ctxArena.textAlign = "right";
        ctxArena.fillText(ln.val, w - 12, y + 1);
      });
    }

    /* ========================================================================
     * WINDOW 3: 3.14π ORBITAL CARAVAN & 32-BEARING (11.25°) HARMONICS WHEEL
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

      // Draw 4 Concentric π Rings (1π, 2π, 3.14π, 4.71π)
      const piRings = [1.0, 2.0, 3.14, 4.71];
      piRings.forEach((pr, idx) => {
        const rPx = ((idx + 1) / 4) * maxR;
        ctxRadar.beginPath();
        ctxRadar.arc(cx, cy, rPx, 0, TWO_PI);
        ctxRadar.strokeStyle = idx === 2 ? "rgba(16, 185, 129, 0.5)" : "rgba(212, 175, 55, 0.25)";
        ctxRadar.lineWidth = idx === 2 ? 1.8 : 1;
        ctxRadar.stroke();

        ctxRadar.fillStyle = "rgba(253, 230, 138, 0.65)";
        ctxRadar.font = "9px Consolas";
        ctxRadar.textAlign = "left";
        ctxRadar.fillText(pr.toFixed(2) + "π", cx + 4, cy - rPx + 10);
      });

      // Draw 32 Compass Spokes (Each = 11.25° = π/16 rad)
      for (let i = 0; i < 32; i++) {
        const deg = i * 11.25;
        const ang = deg * DEG_TO_RAD;
        ctxRadar.beginPath();
        ctxRadar.moveTo(cx, cy);
        ctxRadar.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
        ctxRadar.strokeStyle = i % 8 === 0 ? "rgba(212, 175, 55, 0.48)" : "rgba(56, 189, 248, 0.14)";
        ctxRadar.stroke();

        if (i % 4 === 0) {
          ctxRadar.fillStyle = "#93C5FD";
          ctxRadar.font = "bold 9px Consolas";
          ctxRadar.textAlign = "center";
          ctxRadar.fillText(deg + "°", cx + Math.cos(ang) * (maxR + 14), cy + Math.sin(ang) * (maxR + 14) + 3);
        }
      }

      // Rotating 3.14π Radar Sweep Cone
      const sweepRad = (state.globalPhaseDeg || 0) * DEG_TO_RAD;
      ctxRadar.beginPath();
      ctxRadar.moveTo(cx, cy);
      ctxRadar.arc(cx, cy, maxR, sweepRad - 0.35, sweepRad);
      ctxRadar.closePath();
      ctxRadar.fillStyle = "rgba(16, 185, 129, 0.18)";
      ctxRadar.fill();

      // Plot Caravans Orbiting in Polar Coordinates
      state.caravans.forEach((cv) => {
        const rPx = ((cv.orbitRadiusPi || 3.14) / 4.71) * maxR;
        const rad = (cv.orbitAngleDeg || 0) * DEG_TO_RAD;
        const sx = cx + Math.cos(rad) * rPx;
        const sy = cy + Math.sin(rad) * rPx;

        ctxRadar.beginPath();
        ctxRadar.arc(sx, sy, 6, 0, TWO_PI);
        ctxRadar.fillStyle = cv.friendly ? "#10B981" : "#F59E0B";
        ctxRadar.fill();
        ctxRadar.strokeStyle = "#FFFFFF";
        ctxRadar.stroke();

        ctxRadar.fillStyle = "#FDE68A";
        ctxRadar.font = "9px Consolas";
        ctxRadar.textAlign = "center";
        ctxRadar.fillText(Math.round(cv.orbitAngleDeg || 0) + "°", sx, sy - 9);
      });
    }

    /* ========================================================================
     * WINDOW 4: POLAR GEMINI SPC LIMIT-CYCLE ATTRACTOR (S0..S3) & PHASE ROSE
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

      // LEFT HALF: Polar Limit-Cycle Attractor (r = σ, θ = 0°..360°)
      const pcx = w * 0.28;
      const pcy = h * 0.54;
      const maxPolarR = Math.min(w * 0.24, h * 0.39);

      const spcRings = [
        { sigma: 4.0, label: "S3 ≥4.0σ", color: "rgba(153, 27, 27, 0.45)" },
        { sigma: 2.5, label: "S2 <4.0σ", color: "rgba(244, 63, 94, 0.45)" },
        { sigma: 1.0, label: "S1 <2.5σ", color: "rgba(245, 158, 11, 0.50)" },
        { sigma: 0.45, label: "S0 <1.0σ", color: "rgba(16, 185, 129, 0.65)" }
      ];

      spcRings.forEach(sr => {
        const rPx = (sr.sigma / 4.2) * maxPolarR;
        ctxSpc.beginPath();
        ctxSpc.arc(pcx, pcy, rPx, 0, TWO_PI);
        ctxSpc.strokeStyle = sr.color;
        ctxSpc.lineWidth = 1.6;
        ctxSpc.stroke();
      });

      // Plot Circular Phase-Space Trajectory of σ(θ)
      const hist = spc.history;
      if (hist.length > 1) {
        ctxSpc.beginPath();
        for (let i = 0; i < hist.length; i++) {
          const ang = (hist[i].phaseAngleDeg || (i * 15)) * DEG_TO_RAD;
          const rPx = Math.min(1, hist[i].sigma / 4.2) * maxPolarR;
          const px = pcx + Math.cos(ang) * rPx;
          const py = pcy + Math.sin(ang) * rPx;
          if (i === 0) ctxSpc.moveTo(px, py);
          else ctxSpc.lineTo(px, py);
        }
        ctxSpc.strokeStyle = "#6EE7B7";
        ctxSpc.lineWidth = 2.0;
        ctxSpc.stroke();
      }

      // RIGHT HALF: 0° → 360° (2π) Sinusoidal Harmonic Phase Lock Waveform
      const wx0 = w * 0.55;
      const ww = w * 0.41;
      ctxSpc.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctxSpc.strokeRect(wx0, 36, ww, h - 62);

      if (hist.length > 1) {
        ctxSpc.beginPath();
        for (let i = 0; i < hist.length; i++) {
          const x = wx0 + (i / 90) * ww;
          const normSigma = Math.min(1, hist[i].sigma / 4.2);
          const y = (h - 32) - normSigma * (h - 72);
          if (i === 0) ctxSpc.moveTo(x, y);
          else ctxSpc.lineTo(x, y);
        }
        ctxSpc.strokeStyle = "#38BDF8";
        ctxSpc.lineWidth = 2.2;
        ctxSpc.stroke();
      }

      ctxSpc.fillStyle = "#FDE68A";
      ctxSpc.font = "bold 10px Consolas";
      ctxSpc.textAlign = "left";
      ctxSpc.fillText(
        "POLAR SPC LIMIT-CYCLE: S" + spc.stateIndex + " | Cp=" + spc.cp + " | σ=" + spc.sigma.toFixed(2) + " | θ=" + spc.phaseAngleDeg + "°",
        16,
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

      if (state.tickCount % 18 === 0 && window.SovCommandEngine) {
        window.SovCommandEngine.ringBuffer.popDue(state.tickCount);
        if (window.SovGame && window.SovGame.renderRingBufferPanel) {
          window.SovGame.renderRingBufferPanel();
        }
        if (window.SovGame && window.SovGame.renderCircularTelemetryTable) {
          window.SovGame.renderCircularTelemetryTable();
        }
      }

      requestAnimationFrame(renderAllViewports);
    }

    // Interactive Polar Mouse Hover & Click on Window #1
    if (canvasMain) {
      canvasMain.addEventListener("mousemove", function (evt) {
        const rect = canvasMain.getBoundingClientRect();
        const scaleX = canvasMain.width / rect.width;
        const scaleY = canvasMain.height / rect.height;
        const sx = (evt.clientX - rect.left) * scaleX;
        const sy = (evt.clientY - rect.top) * scaleY;
        const unp = isoUnproject(sx, sy);
        hoverPolar.active = true;
        hoverPolar.sx = sx;
        hoverPolar.sy = sy;
        hoverPolar.gx = unp.gx;
        hoverPolar.gy = unp.gy;
        hoverPolar.rPi = unp.rPi;
        hoverPolar.angleDeg = unp.angleDeg;
        hoverPolar.angleRad = unp.angleRad;
      });

      canvasMain.addEventListener("mouseleave", function () {
        hoverPolar.active = false;
      });

      canvasMain.addEventListener("click", function (evt) {
        const rect = canvasMain.getBoundingClientRect();
        const scaleX = canvasMain.width / rect.width;
        const scaleY = canvasMain.height / rect.height;
        const clickX = (evt.clientX - rect.left) * scaleX;
        const clickY = (evt.clientY - rect.top) * scaleY;
        const gridPos = isoUnproject(clickX, clickY);

        if (state.canvasClickTool === "SPAWN_UNIT" && window.SovGame) {
          const profIdx = parseInt(document.getElementById("clashAttackerSelect")?.value || "1", 10) || 1;
          window.SovGame.deployProfileToGrid(profIdx, Math.max(0.8, Math.min(4.71, gridPos.rPi)), gridPos.angleDeg);
          return;
        }

        if (state.canvasClickTool === "BUILD_TOWER") {
          state.towers.push({
            name: "Circular Ribāṭ Tower #" + (state.towers.length + 1),
            gx: gridPos.gx,
            gy: gridPos.gy,
            rPi: gridPos.rPi,
            angleDeg: gridPos.angleDeg,
            type: "QUMQUM_360",
            color: "#10B981"
          });
          spawnCircularShockwave(gridPos.rPi, gridPos.angleDeg, 80, "#38BDF8", 360, 0);
          spawnFloatingText("🗼 360° TOWER @ " + gridPos.angleDeg + "° (" + gridPos.rPi + "π)", clickX, clickY - 20, "#38BDF8", true);
          addLog("Constructed 360° Ribāṭ Tower at Polar (r=" + gridPos.rPi + "π, θ=" + gridPos.angleDeg + "°)!", "#38BDF8");
          return;
        }

        // Default INSPECT / POLAR ORBIT SHIFT: Select nearest unit or shift selected unit to clicked polar ring & angle
        let bestIdx = -1;
        let bestDist = 42;
        state.units.forEach((u, idx) => {
          const up = isoProject(u.gx, u.gy, 10);
          const d = Math.hypot(up.x - clickX, up.y - clickY);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = idx;
          }
        });

        if (bestIdx >= 0) {
          state.selectedUnitIndex = bestIdx;
          if (window.SovGame && window.SovGame.syncInspectorToSelectedUnit) {
            window.SovGame.syncInspectorToSelectedUnit();
          }
          const sel = state.units[bestIdx];
          addLog("Inspected Circular Node #" + (bestIdx + 1) + ": " + sel.name + " @ (r=" + (sel.orbitRadiusPi || 2.0).toFixed(2) + "π, θ=" + Math.round(sel.angleDeg || 0) + "°)", "#FDE68A");
        } else {
          const sel = state.units[state.selectedUnitIndex];
          if (sel) {
            sel.customOrbitPi = Math.max(0.8, Math.min(4.71, gridPos.rPi));
            sel.angleDeg = gridPos.angleDeg;
            spawnCircularShockwave(sel.customOrbitPi, sel.angleDeg, 70, "#FDE68A", sel.arcDegrees || 180, sel.angleDeg);
            spawnFloatingText("⭕ VECTOR SHIFT → r=" + sel.customOrbitPi.toFixed(2) + "π @ θ=" + gridPos.angleDeg + "°", clickX, clickY - 14, "#6EE7B7", false);
            addLog("Shifted [" + sel.name.split("(")[0].trim() + "] to Circular Ring r=" + sel.customOrbitPi.toFixed(2) + "π, Bearing θ=" + gridPos.angleDeg + "°!", "#6EE7B7");
          }
        }
      });
    }

    return {
      isoProject: isoProject,
      polarIsoProject: polarIsoProject,
      isoUnproject: isoUnproject,
      spawnFloatingText: spawnFloatingText,
      spawnCircularShockwave: spawnCircularShockwave,
      spawnVfx: spawnVfx,
      renderAllViewports: renderAllViewports
    };
  }

  window.SovViewportsFactory = {
    createViewportsController: createViewportsController
  };
})();
