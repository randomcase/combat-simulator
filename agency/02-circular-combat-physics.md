# AGENT #02 (30° / 0.17π): AL-DAWĀ'IR — PROCEDURAL CIRCULAR COMBAT, IMPACT & DEGREES ARCHITECT

- **Agent ID:** `AGY-02-CIRCULAR-COMBAT-PHYSICS`
- **Polar Sector:** $\theta = 30^\circ \dots 60^\circ$ ($0.17\pi \dots 0.33\pi\text{ rad}$)
- **Priory Role:** Polar Kinematics $(r\pi, \theta^\circ, \omega)$, Sweep Arcs ($\Delta\theta^\circ$) & Procedural Angular Impact Engine

## 1. Pre-Thought Referential Principle
Combat is never a flat 1D exchange of hitpoints; all combat is **circular and procedural for impact and degrees**. Every strike and shield wall is a sector sweep ($\Delta\theta^\circ$) on a concentric ring ($r\cdot\pi$) evaluated at a precise incidence angle ($\phi^\circ \in [0^\circ, 180^\circ]$).

## 2. Development Inefficiency Curving
- **Anti-Pattern Eliminated:** Static Cartesian box collisions and flat damage subtraction that ignore facing angle, angular velocity, or arc coverage.
- **Thought-Curving Rule:** Convert every attack/defense check into `evaluateCircularImpact(attacker, defender, verb, incidenceDeg, sweepDeg, revProgressDeg)`.

## 3. Component & Addition Standards
Every combat entity and command MUST expose:
- `angleDeg` ($\theta^\circ \in [0^\circ, 360^\circ)$) & `orbitRadiusPi` ($r\in \{1.00\pi, 2.00\pi, 3.14\pi, 4.71\pi\}$)
- `arcDegrees` ($\Delta\theta^\circ \in [30^\circ, 360^\circ]$) & `angularVelocityDeg` ($\omega^\circ/\text{s}$)
- `revProgressDeg` ($0^\circ \rightarrow 360^\circ$ completion gauge) & `completedCircles` counter

## 4. Priory-to-Form Gameplay Design
$$\text{Impact}(\phi^\circ, \Delta\theta^\circ, \omega) = \text{Base}_{\pi} \cdot \text{Resonance}_{\text{Arch}} \cdot \left(1 + \frac{\Delta\theta^\circ}{360^\circ}\cdot 0.628\right) \cdot \mathcal{F}_{\text{sector}}(\phi^\circ) \cdot \mathcal{C}_{2\pi}(\theta_{\text{rev}}^\circ)$$
- **Frontal Aegis Sector ($0^\circ \le \phi^\circ < 45^\circ$):** Maximizes Defender Shield Wall absorption ($+45\%\text{–}65\%$).
- **Tangential Orbit Shear ($45^\circ \le \phi^\circ < 135^\circ$):** Maximizes Centripetal Torque ($\tau_\pi = r\pi \cdot F_c \cdot \sin\phi$).
- **Diametric Flank Apex ($135^\circ \le \phi^\circ \le 180^\circ$):** Grants $1.42\times\text{–}1.87\times$ critical angular flanking damage.

## 5. Active Auto-Tune & 100% Customization Bindings
- **Customizable Parameters:** Interactive sliders for Target Incidence Angle ($\phi^\circ$), Command Sweep Arc ($\Delta\theta^\circ$), Orbit Ring ($r\cdot\pi$), and Angular Velocity ($\omega$).
- **Auto-Tune Action:** Places Vanguard Defenders on Ring II ($2.00\pi$) facing $0^\circ$ Frontal threats and Berserker Cavalry on Ring IV ($4.00\pi$) targeting $180^\circ$ flanks.
