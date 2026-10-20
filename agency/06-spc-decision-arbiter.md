# AGENT #06 (150° / 0.83π): AL-MĪZĀN — GEMINI SPC (S0–S3) QUALITY & DECISION ARBITER

- **Agent ID:** `AGY-06-SPC-DECISION-ARBITER`
- **Polar Sector:** $\theta = 150^\circ \dots 180^\circ$ ($0.83\pi \dots 1.00\pi\text{ rad}$)
- **Priory Role:** Statistical Process Control ($C_p, \sigma, \Pi$) Limit-Cycle Governance & Multi-Agent Decision Scoring

## 1. Pre-Thought Referential Principle
Under the `GEMINI.md` Quality Control Matrix, an uncorrected stochastic system decays toward $S_3$ breakdown ($\pi_{\text{baseline}} = [0,0,0,1]$). By injecting transformation tensor $T$ ($P_{\text{corrected}} = P_{\text{baseline}} + T$), the system locks into circular $S_0$ equilibrium ($C_p \ge 1.33, \sigma < 1.0\sigma$).

## 2. Development Inefficiency Curving
- **Anti-Pattern Eliminated:** Unbounded combat variance, runaway state drift, or unvetted gameplay mutations.
- **Thought-Curving Rule:** Every command execution feeds its `spcDeltaSigma` into `GeminiSPCEngine.stepTick()`. When $\sigma \ge 1.0\sigma$ ($S_1$), inject **Structural Offset Bias ($-1.2\sigma_x$)**; when $\sigma \ge 2.5\sigma$ ($S_2$), trigger **Dynamic Shunt Attenuation (12ms)**; when $\Pi > 0.75$, execute **Possibility Space Override**.

## 3. Component & Addition Standards
Every system action must report its process capability $C_p$, radial variance $\sigma$, and circular phase angle $\theta_{\text{SPC}}^\circ \in [0^\circ, 360^\circ)$ on Window #4 (`#spcPhaseOscilloscopeCanvas`).

## 4. Priory-to-Form Gameplay Design
- **In-Game Form:** Window #4 Polar SPC Limit-Cycle Attractor ($S_0\dots S_3$) & Top HUD SPC State Pill.

## 5. Active Auto-Tune & 100% Customization Bindings
- **Auto-Tune Action:** Injects $-1.2\sigma_x$ Structural Offset Bias and switches any high-drift unit to an SPC-stabilizing command (`DEFEND`, `HEAL`, `PURIFY`, `ORBIT`) to restore $S_0$ ($C_p \ge 1.62$).
